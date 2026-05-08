import type { AdjustmentSettings } from '../editor/types';

const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

const clampRange = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function createDemoImageData(width = 1280, height = 860) {
  const data = new Uint8ClampedArray(width * height * 4);
  const centerX = width * 0.58;
  const centerY = height * 0.45;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const sky = y / height;
      const dx = (x - centerX) / width;
      const dy = (y - centerY) / height;
      const sun = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 5.4);
      const ridge = y > height * (0.58 + Math.sin(x * 0.012) * 0.045) ? 1 : 0;
      const foreground = y > height * 0.72 ? 1 : 0;

      data[i] = clampByte(36 + 42 * (1 - sky) + sun * 190 + ridge * 24 + foreground * 18);
      data[i + 1] = clampByte(92 + 88 * (1 - sky) + sun * 90 + ridge * 56 + foreground * 38);
      data[i + 2] = clampByte(122 + 75 * (1 - sky) + sun * 16 - ridge * 34 - foreground * 42);
      data[i + 3] = 255;
    }
  }

  return new ImageData(data, width, height);
}

export function applyAdjustments(source: ImageData, settings: AdjustmentSettings) {
  const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
  const data = output.data;
  const contrastValue = settings.contrast * 1.28;
  const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));
  const saturationFactor = 1 + settings.saturation / 100;
  const exposureShift = settings.exposure * 1.35;
  const warmthShift = settings.warmth * 0.55;
  const centerX = source.width / 2;
  const centerY = source.height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % source.width;
    const y = Math.floor(pixelIndex / source.width);
    const luminance = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    const shadowWeight = clampRange((150 - luminance) / 150, 0, 1);
    const highlightWeight = clampRange((luminance - 96) / 159, 0, 1);
    const grey = luminance;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / maxDistance;
    const vignette = settings.vignette > 0 ? Math.pow(distance, 1.7) * settings.vignette * 1.8 : 0;

    let r = data[i] + exposureShift + settings.shadows * shadowWeight - settings.highlights * highlightWeight;
    let g =
      data[i + 1] + exposureShift + settings.shadows * shadowWeight - settings.highlights * highlightWeight;
    let b =
      data[i + 2] + exposureShift + settings.shadows * shadowWeight - settings.highlights * highlightWeight;

    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    r = grey + (r - grey) * saturationFactor + warmthShift - vignette;
    g = grey + (g - grey) * saturationFactor - vignette;
    b = grey + (b - grey) * saturationFactor - warmthShift - vignette;

    data[i] = clampByte(r);
    data[i + 1] = clampByte(g);
    data[i + 2] = clampByte(b);
  }

  if (settings.sharpness > 0) {
    return sharpen(output, settings.sharpness / 100);
  }

  return output;
}

export function autoTuneSettings(source: ImageData): Partial<AdjustmentSettings> {
  let min = 255;
  let max = 0;
  let total = 0;
  let count = 0;

  for (let i = 0; i < source.data.length; i += 64) {
    const luminance = source.data[i] * 0.2126 + source.data[i + 1] * 0.7152 + source.data[i + 2] * 0.0722;
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
    total += luminance;
    count += 1;
  }

  const mean = total / Math.max(1, count);
  const range = max - min;

  return {
    exposure: clampRange((132 - mean) * 0.35, -32, 32),
    contrast: range < 150 ? clampRange((150 - range) * 0.22, 6, 26) : 4,
    saturation: 8,
    shadows: mean < 105 ? 18 : 6,
    highlights: max > 238 ? 12 : -4,
    sharpness: 22
  };
}

export function removeBackground(source: ImageData, strength = 54) {
  const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
  const edge = averageEdgeColor(source);
  const tolerance = 24 + strength * 1.15;

  for (let i = 0; i < output.data.length; i += 4) {
    const distance = colorDistance(
      output.data[i],
      output.data[i + 1],
      output.data[i + 2],
      edge[0],
      edge[1],
      edge[2]
    );
    const alpha = clampRange(((distance - tolerance * 0.42) / tolerance) * 255, 0, 255);
    output.data[i + 3] = Math.min(output.data[i + 3], clampByte(alpha));
  }

  return output;
}

export function upscale2x(source: ImageData) {
  const width = source.width * 2;
  const height = source.height * 2;
  const output = new ImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    const srcY = y / 2;
    const y0 = Math.floor(srcY);
    const y1 = Math.min(source.height - 1, y0 + 1);
    const fy = srcY - y0;

    for (let x = 0; x < width; x += 1) {
      const srcX = x / 2;
      const x0 = Math.floor(srcX);
      const x1 = Math.min(source.width - 1, x0 + 1);
      const fx = srcX - x0;
      const out = (y * width + x) * 4;

      for (let c = 0; c < 4; c += 1) {
        const top = sample(source, x0, y0, c) * (1 - fx) + sample(source, x1, y0, c) * fx;
        const bottom = sample(source, x0, y1, c) * (1 - fx) + sample(source, x1, y1, c) * fx;
        output.data[out + c] = clampByte(top * (1 - fy) + bottom * fy);
      }
    }
  }

  return sharpen(output, 0.18);
}

function sharpen(source: ImageData, amount: number) {
  const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);

  for (let y = 1; y < source.height - 1; y += 1) {
    for (let x = 1; x < source.width - 1; x += 1) {
      const i = (y * source.width + x) * 4;

      for (let c = 0; c < 3; c += 1) {
        const blur =
          (sample(source, x - 1, y, c) +
            sample(source, x + 1, y, c) +
            sample(source, x, y - 1, c) +
            sample(source, x, y + 1, c)) /
          4;
        output.data[i + c] = clampByte(source.data[i + c] + (source.data[i + c] - blur) * amount);
      }
    }
  }

  return output;
}

function averageEdgeColor(source: ImageData): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const step = Math.max(1, Math.floor(Math.min(source.width, source.height) / 120));

  for (let x = 0; x < source.width; x += step) {
    [0, source.height - 1].forEach((y) => {
      const i = (y * source.width + x) * 4;
      r += source.data[i];
      g += source.data[i + 1];
      b += source.data[i + 2];
      count += 1;
    });
  }

  for (let y = 0; y < source.height; y += step) {
    [0, source.width - 1].forEach((x) => {
      const i = (y * source.width + x) * 4;
      r += source.data[i];
      g += source.data[i + 1];
      b += source.data[i + 2];
      count += 1;
    });
  }

  return [r / count, g / count, b / count];
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function sample(source: ImageData, x: number, y: number, channel: number) {
  const safeX = clampRange(x, 0, source.width - 1);
  const safeY = clampRange(y, 0, source.height - 1);
  return source.data[(safeY * source.width + safeX) * 4 + channel];
}
