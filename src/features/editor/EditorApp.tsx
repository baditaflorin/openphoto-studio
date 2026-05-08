import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdjustmentsPanel } from './components/AdjustmentsPanel';
import { ActionsPanel } from './components/ActionsPanel';
import { CanvasStage } from './components/CanvasStage';
import { TopBar } from './components/TopBar';
import { defaultAdjustments, exportFormats } from './defaults';
import { downloadBlob, fileToImageData, imageDataToBlob, imageDataToPngBlob } from './imageIO';
import type { AdjustmentSettings, CompareMode, ExportFormat, ProjectSnapshot } from './types';
import { getImageWorker } from '../image-engine/client';
import { createDemoImageData } from '../image-engine/adjustments';
import { loadLastProject, saveLastProject } from '../storage/projects';

type StatusTone = 'neutral' | 'success' | 'error';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `project-${Date.now()}`;

export function EditorApp() {
  const [source, setSource] = useState<ImageData | null>(null);
  const [processed, setProcessed] = useState<ImageData | null>(null);
  const [originalBlob, setOriginalBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState('demo-photo.png');
  const [settings, setSettings] = useState<AdjustmentSettings>(defaultAdjustments);
  const [projectName, setProjectName] = useState('Untitled edit');
  const [compareMode, setCompareMode] = useState<CompareMode>('edited');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('image/png');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ tone: StatusTone; message: string }>({
    tone: 'neutral',
    message: 'Ready. Open a photo or load the demo image.'
  });
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [webGpuAvailable, setWebGpuAvailable] = useState(false);
  const renderToken = useRef(0);

  useEffect(() => {
    setWebGpuAvailable(typeof navigator !== 'undefined' && 'gpu' in navigator);
  }, []);

  useEffect(() => {
    if (!source) {
      setProcessed(null);
      return;
    }

    const token = renderToken.current + 1;
    renderToken.current = token;
    const timeout = window.setTimeout(() => {
      setBusy(true);
      getImageWorker()
        .applyAdjustments(source, settings)
        .then((result) => {
          if (renderToken.current === token) {
            setProcessed(result);
            setStatus({
              tone: 'success',
              message: `${result.width} x ${result.height} preview rendered locally.`
            });
          }
        })
        .catch((error: unknown) => {
          if (renderToken.current === token) {
            setStatus({
              tone: 'error',
              message: error instanceof Error ? error.message : 'Preview rendering failed.'
            });
          }
        })
        .finally(() => {
          if (renderToken.current === token) {
            setBusy(false);
          }
        });
    }, 90);

    return () => window.clearTimeout(timeout);
  }, [settings, source]);

  const hasImage = Boolean(source);

  const loadImage = useCallback(async (file: Blob, name?: string) => {
    setBusy(true);
    try {
      const loaded = await fileToImageData(file, name);
      setSource(loaded.imageData);
      setOriginalBlob(loaded.blob);
      setOriginalName(loaded.name);
      setProjectName(loaded.name.replace(/\.[^.]+$/, '') || 'Untitled edit');
      setSettings(defaultAdjustments);
      setUndoStack([]);
      setCompareMode('edited');
      setStatus({
        tone: 'success',
        message: `${loaded.name} loaded at ${loaded.imageData.width} x ${loaded.imageData.height}.`
      });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'The image could not be loaded.'
      });
    } finally {
      setBusy(false);
    }
  }, []);

  const loadDemo = useCallback(async () => {
    const demo = createDemoImageData();
    const blob = await imageDataToPngBlob(demo);
    await loadImage(blob, 'openphoto-demo.png');
  }, [loadImage]);

  const runDestructiveEdit = useCallback(
    async (operation: (image: ImageData) => Promise<ImageData>, successMessage: string) => {
      const base = processed ?? source;
      if (!base || !source) return;

      setBusy(true);
      try {
        const next = await operation(base);
        setUndoStack((stack) => [...stack.slice(-8), source]);
        setSource(next);
        setSettings(defaultAdjustments);
        setCompareMode('edited');
        setStatus({ tone: 'success', message: successMessage });
      } catch (error) {
        setStatus({
          tone: 'error',
          message: error instanceof Error ? error.message : 'The tool could not finish.'
        });
      } finally {
        setBusy(false);
      }
    },
    [processed, source]
  );

  const autoTune = useCallback(async () => {
    if (!source) return;

    setBusy(true);
    try {
      const next = await getImageWorker().autoTuneSettings(source);
      setSettings((current) => ({ ...current, ...next }));
      setStatus({ tone: 'success', message: 'Auto tone applied from local luminance analysis.' });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Auto tone failed.'
      });
    } finally {
      setBusy(false);
    }
  }, [source]);

  const saveProject = useCallback(async () => {
    if (!source || !originalBlob) return;

    const snapshot: ProjectSnapshot = {
      id: createId(),
      name: projectName.trim() || 'Untitled edit',
      originalName,
      updatedAt: new Date().toISOString(),
      width: source.width,
      height: source.height,
      settings,
      originalBlob
    };

    try {
      await saveLastProject(snapshot);
      setStatus({ tone: 'success', message: 'Saved locally in this browser.' });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Local save failed.'
      });
    }
  }, [originalBlob, originalName, projectName, settings, source]);

  const loadProject = useCallback(async () => {
    try {
      const snapshot = await loadLastProject();

      if (!snapshot) {
        setStatus({ tone: 'neutral', message: 'No local project has been saved yet.' });
        return;
      }

      await loadImage(snapshot.originalBlob, snapshot.originalName);
      setSettings(snapshot.settings);
      setProjectName(snapshot.name);
      setStatus({
        tone: 'success',
        message: `Loaded local project saved ${new Date(snapshot.updatedAt).toLocaleString()}.`
      });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Local load failed.'
      });
    }
  }, [loadImage]);

  const exportImage = useCallback(async () => {
    if (!processed) return;

    const format = exportFormats.find((item) => item.mime === exportFormat) ?? exportFormats[0];

    try {
      const blob = await imageDataToBlob(processed, format.mime);
      downloadBlob(blob, `${projectName.trim() || 'openphoto-export'}.${format.extension}`);
      setStatus({ tone: 'success', message: `${format.label} export prepared in the browser.` });
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Export failed.'
      });
    }
  }, [exportFormat, processed, projectName]);

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      const previous = stack.at(-1);
      if (!previous) return stack;
      setSource(previous);
      setSettings(defaultAdjustments);
      setStatus({ tone: 'success', message: 'Reverted the last destructive edit.' });
      return stack.slice(0, -1);
    });
  }, []);

  const statusClass = useMemo(() => `status-line ${status.tone}`, [status.tone]);

  return (
    <main
      className="app-shell"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) void loadImage(file);
      }}
    >
      <TopBar
        compareMode={compareMode}
        hasImage={hasImage}
        busy={busy}
        canUndo={undoStack.length > 0}
        onCompareModeChange={setCompareMode}
        onFilePick={(file) => void loadImage(file)}
        onDemo={() => void loadDemo()}
        onUndo={undo}
      />

      <section className="workspace">
        <AdjustmentsPanel settings={settings} disabled={!hasImage || busy} onChange={setSettings} />

        <section className="center-stage" aria-label="Image editor">
          <CanvasStage original={source} processed={processed} mode={compareMode} />
          <div className={statusClass} role={status.tone === 'error' ? 'alert' : 'status'}>
            {busy ? 'Working locally...' : status.message}
          </div>
        </section>

        <ActionsPanel
          disabled={!hasImage}
          busy={busy}
          projectName={projectName}
          exportFormat={exportFormat}
          webGpuAvailable={webGpuAvailable}
          onProjectNameChange={setProjectName}
          onAutoTune={() => void autoTune()}
          onRemoveBackground={() =>
            void runDestructiveEdit(
              (image) => getImageWorker().removeBackground(image, 54),
              'Background transparency estimated from the image edges.'
            )
          }
          onUpscale={() =>
            void runDestructiveEdit(
              (image) => getImageWorker().upscale2x(image),
              '2x upscale finished locally.'
            )
          }
          onSave={() => void saveProject()}
          onLoad={() => void loadProject()}
          onExport={() => void exportImage()}
          onExportFormatChange={setExportFormat}
        />
      </section>
    </main>
  );
}
