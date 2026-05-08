import type { ExportFormat, LoadedImage } from './types';

const maxImportEdge = 2600;

export async function fileToImageData(file: Blob, fallbackName = 'imported image'): Promise<LoadedImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxImportEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    throw new Error('Canvas 2D is not available in this browser.');
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return {
    imageData: context.getImageData(0, 0, width, height),
    blob: file,
    name: 'name' in file && typeof file.name === 'string' ? file.name : fallbackName
  };
}

export async function imageDataToBlob(imageData: ImageData, type: ExportFormat, quality = 0.92) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas 2D is not available in this browser.');
  }

  context.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('The browser could not encode the image.'));
        }
      },
      type,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function imageDataToPngBlob(imageData: ImageData) {
  return imageDataToBlob(imageData, 'image/png');
}
