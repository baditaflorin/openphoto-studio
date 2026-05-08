import { wrap } from 'comlink';
import type { ImageWorkerApi } from './worker';

let worker: Worker | undefined;
let api: ReturnType<typeof wrap<ImageWorkerApi>> | undefined;

export function getImageWorker() {
  if (!worker || !api) {
    worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    api = wrap<ImageWorkerApi>(worker);
  }

  return api;
}

export function disposeImageWorker() {
  worker?.terminate();
  worker = undefined;
  api = undefined;
}
