import { useEffect, useRef } from 'react';
import type { CompareMode } from '../types';

interface CanvasStageProps {
  original: ImageData | null;
  processed: ImageData | null;
  mode: CompareMode;
}

export function CanvasStage({ original, processed, mode }: CanvasStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const active = mode === 'original' ? original : processed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    canvas.width = active.width;
    canvas.height = active.height;
    const context = canvas.getContext('2d');
    context?.putImageData(active, 0, 0);
  }, [active]);

  if (!active) {
    return (
      <div className="stage-empty" data-testid="dropzone">
        <div>
          <p className="text-lg font-semibold text-slate-950">Drop a photo to start</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            OpenPhoto Studio keeps edits local. Load a file or generate the demo image to try the editor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-frame">
      <canvas ref={canvasRef} className="stage-canvas" aria-label="Photo editing canvas" />
    </div>
  );
}
