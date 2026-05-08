export type CompareMode = 'edited' | 'original';

export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export interface AdjustmentSettings {
  exposure: number;
  contrast: number;
  saturation: number;
  warmth: number;
  shadows: number;
  highlights: number;
  sharpness: number;
  vignette: number;
}

export interface LoadedImage {
  imageData: ImageData;
  blob: Blob;
  name: string;
}

export interface ProjectSnapshot {
  id: string;
  name: string;
  originalName: string;
  updatedAt: string;
  width: number;
  height: number;
  settings: AdjustmentSettings;
  originalBlob: Blob;
}

export interface EngineResult {
  imageData: ImageData;
  message: string;
}
