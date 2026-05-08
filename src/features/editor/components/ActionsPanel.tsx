import { Download, Eraser, Gauge, Save, Sparkles, Upload, Wand2, Zap } from 'lucide-react';
import type { ExportFormat } from '../types';

interface ActionsPanelProps {
  disabled: boolean;
  busy: boolean;
  projectName: string;
  exportFormat: ExportFormat;
  webGpuAvailable: boolean;
  onProjectNameChange: (name: string) => void;
  onAutoTune: () => void;
  onRemoveBackground: () => void;
  onUpscale: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onExportFormatChange: (format: ExportFormat) => void;
}

export function ActionsPanel({
  disabled,
  busy,
  projectName,
  exportFormat,
  webGpuAvailable,
  onProjectNameChange,
  onAutoTune,
  onRemoveBackground,
  onUpscale,
  onSave,
  onLoad,
  onExport,
  onExportFormatChange
}: ActionsPanelProps) {
  return (
    <aside className="panel" aria-label="AI and export tools">
      <div className="panel-heading">
        <h2>Tools</h2>
        <span className="status-pill">
          <Zap aria-hidden="true" size={14} />
          WebGPU {webGpuAvailable ? 'ready' : 'fallback'}
        </span>
      </div>

      <div className="tool-grid">
        <button className="tool-button" type="button" disabled={disabled || busy} onClick={onAutoTune}>
          <Wand2 aria-hidden="true" size={18} />
          Auto tone
        </button>
        <button
          className="tool-button"
          type="button"
          disabled={disabled || busy}
          onClick={onRemoveBackground}
        >
          <Eraser aria-hidden="true" size={18} />
          Remove bg
        </button>
        <button className="tool-button" type="button" disabled={disabled || busy} onClick={onUpscale}>
          <Gauge aria-hidden="true" size={18} />
          2x upscale
        </button>
      </div>

      <div className="divider" />

      <label className="field">
        <span>Project</span>
        <input
          value={projectName}
          onChange={(event) => onProjectNameChange(event.currentTarget.value)}
          placeholder="Untitled edit"
        />
      </label>

      <div className="tool-grid">
        <button className="tool-button" type="button" disabled={disabled || busy} onClick={onSave}>
          <Save aria-hidden="true" size={18} />
          Save local
        </button>
        <button className="tool-button" type="button" disabled={busy} onClick={onLoad}>
          <Upload aria-hidden="true" size={18} />
          Load last
        </button>
      </div>

      <div className="divider" />

      <label className="field">
        <span>Export</span>
        <select
          value={exportFormat}
          onChange={(event) => onExportFormatChange(event.currentTarget.value as ExportFormat)}
        >
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
      </label>
      <button className="primary-action" type="button" disabled={disabled || busy} onClick={onExport}>
        <Download aria-hidden="true" size={18} />
        Export image
      </button>

      <div className="ai-note">
        <Sparkles aria-hidden="true" size={16} />
        Local AI-style tools are heuristic in v1; model-backed WASM/WebGPU modules stay behind this same lazy
        boundary.
      </div>
    </aside>
  );
}
