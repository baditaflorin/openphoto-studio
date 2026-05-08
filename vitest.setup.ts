import '@testing-library/jest-dom/vitest';

if (typeof ImageData === 'undefined') {
  class TestImageData {
    readonly colorSpace = 'srgb' as PredefinedColorSpace;
    readonly data: Uint8ClampedArray;
    readonly height: number;
    readonly width: number;

    constructor(dataOrWidth: Uint8ClampedArray | number, widthOrHeight: number, height?: number) {
      if (typeof dataOrWidth === 'number') {
        this.width = dataOrWidth;
        this.height = widthOrHeight;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
        return;
      }

      if (!height) {
        throw new Error('ImageData height is required when data is provided.');
      }

      this.data = dataOrWidth;
      this.width = widthOrHeight;
      this.height = height;
    }
  }

  Object.defineProperty(globalThis, 'ImageData', {
    value: TestImageData as unknown as typeof ImageData,
    writable: true
  });
}
