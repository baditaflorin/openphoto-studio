import {
  applyAdjustments,
  autoTuneSettings,
  createDemoImageData,
  removeBackground,
  upscale2x
} from './adjustments';
import { defaultAdjustments } from '../editor/defaults';

describe('image engine adjustments', () => {
  it('creates a demo image and applies neutral adjustments without resizing', () => {
    const demo = createDemoImageData(32, 24);
    const result = applyAdjustments(demo, defaultAdjustments);

    expect(result.width).toBe(32);
    expect(result.height).toBe(24);
    expect(result.data.length).toBe(demo.data.length);
  });

  it('computes auto tune settings from luminance', () => {
    const demo = createDemoImageData(24, 24);
    const settings = autoTuneSettings(demo);

    expect(settings.contrast).toBeGreaterThanOrEqual(0);
    expect(settings.sharpness).toBeGreaterThan(0);
  });

  it('can remove background alpha and upscale', () => {
    const demo = createDemoImageData(12, 10);
    const transparent = removeBackground(demo, 70);
    const upscaled = upscale2x(transparent);

    expect(transparent.data.some((_, index) => index % 4 === 3 && transparent.data[index] < 255)).toBe(true);
    expect(upscaled.width).toBe(24);
    expect(upscaled.height).toBe(20);
  });
});
