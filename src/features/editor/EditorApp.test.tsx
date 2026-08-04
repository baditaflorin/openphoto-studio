import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EditorApp } from './EditorApp';
import { imageDataToBlob } from './imageIO';
import { saveLastProject } from '../storage/projects';
import type { AdjustmentSettings } from './types';

// jsdom has no real <canvas> 2D backend or Worker runtime, so the canvas-touching
// pieces (imageIO) and the comlink-wrapped worker client are faked here. Each fake
// image is tagged with a distinct, identity-comparable ImageData "marker" so the
// tests can prove *which* pixels flowed through Save/Load/Export/Undo instead of
// just that *some* pixels did.
const testDoubles = vi.hoisted(() => {
  class TaggedBlob extends Blob {
    readonly imageData: ImageData;
    readonly fileName: string;

    constructor(imageData: ImageData, fileName: string) {
      super([], { type: 'image/png' });
      this.imageData = imageData;
      this.fileName = fileName;
    }
  }

  const makeMarker = (width: number, height: number, fill: number) =>
    new ImageData(new Uint8ClampedArray(width * height * 4).fill(fill), width, height);

  return {
    TaggedBlob,
    processedMarker: makeMarker(4, 4, 10),
    upscaledMarker: makeMarker(8, 8, 30)
  };
});

vi.mock('./imageIO', () => ({
  fileToImageData: vi.fn(async (file: Blob, fallbackName = 'imported image') => {
    const tagged = file as InstanceType<typeof testDoubles.TaggedBlob>;
    return { imageData: tagged.imageData, blob: file, name: fallbackName ?? tagged.fileName };
  }),
  imageDataToBlob: vi.fn(async (imageData: ImageData) => new testDoubles.TaggedBlob(imageData, 'export')),
  imageDataToPngBlob: vi.fn(
    async (imageData: ImageData) => new testDoubles.TaggedBlob(imageData, 'export.png')
  ),
  downloadBlob: vi.fn()
}));

vi.mock('../image-engine/client', () => ({
  getImageWorker: () => ({
    applyAdjustments: vi.fn(async () => testDoubles.processedMarker),
    autoTuneSettings: vi.fn(async (): Promise<Partial<AdjustmentSettings>> => ({})),
    removeBackground: vi.fn(async () => testDoubles.processedMarker),
    upscale2x: vi.fn(async () => testDoubles.upscaledMarker)
  })
}));

vi.mock('../storage/projects', () => {
  let stored: unknown = null;
  return {
    saveLastProject: vi.fn(async (snapshot: unknown) => {
      stored = snapshot;
    }),
    loadLastProject: vi.fn(async () => stored)
  };
});

async function loadDemoAndWaitForPreview() {
  fireEvent.click(screen.getByRole('button', { name: /demo/i }));
  await waitFor(() => expect(screen.getByText(/preview rendered locally/i)).toBeInTheDocument());
}

describe('EditorApp data-loss and export-correctness regressions', () => {
  it('exports the pixels the canvas is actually showing, not always the live-edit preview', async () => {
    render(<EditorApp />);
    await loadDemoAndWaitForPreview();

    // Switch to the "Original" comparison view. The canvas is now showing the
    // untouched source image, not the adjusted preview.
    fireEvent.click(screen.getByRole('button', { name: 'Original' }));
    fireEvent.click(screen.getByRole('button', { name: /export image/i }));

    await waitFor(() => expect(imageDataToBlob).toHaveBeenCalled());
    const [exported] = vi.mocked(imageDataToBlob).mock.calls.at(-1)!;

    // A regression back to "always export `processed`" would make this the
    // 4x4 processedMarker instead of the full-size original.
    expect(exported).not.toBe(testDoubles.processedMarker);
    expect(exported.width).toBe(1280);
    expect(exported.height).toBe(860);
  });

  it('keeps a destructive edit (2x upscale) after Save Local + Load Last survives a remount', async () => {
    const { unmount } = render(<EditorApp />);
    await loadDemoAndWaitForPreview();

    fireEvent.click(screen.getByRole('button', { name: /2x upscale/i }));
    await waitFor(() => expect(screen.getByText(/2x upscale finished locally/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /save local/i }));
    await waitFor(() => expect(saveLastProject).toHaveBeenCalled());

    // Snapshot must be built from the post-upscale pixels, not a stale copy of
    // the originally imported file.
    const [snapshotArg] = vi.mocked(saveLastProject).mock.calls.at(-1)!;
    const savedBlob = snapshotArg.originalBlob as InstanceType<typeof testDoubles.TaggedBlob>;
    expect(savedBlob.imageData).toBe(testDoubles.upscaledMarker);

    // Simulate a full page refresh: unmount and remount from scratch, then restore.
    unmount();
    render(<EditorApp />);
    fireEvent.click(screen.getByRole('button', { name: /load last/i }));
    await waitFor(() => expect(screen.getByText(/loaded local project/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Original' }));
    const canvas = screen.getByLabelText('Photo editing canvas') as HTMLCanvasElement;
    await waitFor(() => expect(canvas.width).toBe(testDoubles.upscaledMarker.width));
    expect(canvas.height).toBe(testDoubles.upscaledMarker.height);
  });

  it('restores the adjustment settings that were live before a destructive edit on Undo', async () => {
    render(<EditorApp />);
    await loadDemoAndWaitForPreview();

    const [exposureInput] = screen.getAllByRole('slider') as HTMLInputElement[];
    fireEvent.change(exposureInput, { target: { value: '42' } });
    await waitFor(() => expect(exposureInput.value).toBe('42'));

    fireEvent.click(screen.getByRole('button', { name: /remove bg/i }));
    // Destructive edits flatten the current preview into pixels, so the sliders
    // reset to neutral for the *new* baseline.
    await waitFor(() => expect(exposureInput.value).toBe('0'));

    fireEvent.click(screen.getByRole('button', { name: /undo destructive edit/i }));
    await waitFor(() => expect(exposureInput.value).toBe('42'));
  });
});
