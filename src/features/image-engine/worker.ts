import { expose } from 'comlink';
import {
  applyAdjustments,
  autoTuneSettings,
  createDemoImageData,
  removeBackground,
  upscale2x
} from './adjustments';

const api = {
  applyAdjustments,
  autoTuneSettings,
  createDemoImageData,
  removeBackground,
  upscale2x
};

export type ImageWorkerApi = typeof api;

expose(api);
