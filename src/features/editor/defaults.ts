import type { AdjustmentSettings, ExportFormat } from './types';

export const defaultAdjustments: AdjustmentSettings = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  shadows: 0,
  highlights: 0,
  sharpness: 0,
  vignette: 0
};

export const exportFormats: Array<{ label: string; mime: ExportFormat; extension: string }> = [
  { label: 'PNG', mime: 'image/png', extension: 'png' },
  { label: 'JPEG', mime: 'image/jpeg', extension: 'jpg' },
  { label: 'WebP', mime: 'image/webp', extension: 'webp' }
];

export const adjustmentControls: Array<{
  key: keyof AdjustmentSettings;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: 'exposure', label: 'Exposure', min: -100, max: 100, step: 1 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 120, step: 1 },
  { key: 'warmth', label: 'Warmth', min: -100, max: 100, step: 1 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, step: 1 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1 }
];
