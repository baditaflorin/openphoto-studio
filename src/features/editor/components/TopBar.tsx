import { Github, Heart, ImagePlus, RotateCcw, Upload } from 'lucide-react';
import { appMeta } from '../../metadata/appMeta';
import type { CompareMode } from '../types';

interface TopBarProps {
  compareMode: CompareMode;
  hasImage: boolean;
  busy: boolean;
  onCompareModeChange: (mode: CompareMode) => void;
  onFilePick: (file: File) => void;
  onDemo: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function TopBar({
  compareMode,
  hasImage,
  busy,
  onCompareModeChange,
  onFilePick,
  onDemo,
  onUndo,
  canUndo
}: TopBarProps) {
  return (
    <header className="app-topbar">
      <div className="brand-block">
        <div className="brand-mark">OP</div>
        <div>
          <p className="brand-name">OpenPhoto Studio</p>
          <p className="build-meta">
            v{appMeta.version} · commit {appMeta.commit}
          </p>
        </div>
      </div>

      <div className="topbar-actions">
        <label className="button-secondary">
          <ImagePlus aria-hidden="true" size={18} />
          Open
          <input
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif,image/avif"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) onFilePick(file);
              event.currentTarget.value = '';
            }}
          />
        </label>
        <button className="button-secondary" type="button" disabled={busy} onClick={onDemo}>
          <Upload aria-hidden="true" size={18} />
          Demo
        </button>
        <button
          className="icon-button"
          type="button"
          disabled={!canUndo || busy}
          title="Undo destructive edit"
          onClick={onUndo}
        >
          <RotateCcw aria-hidden="true" size={18} />
        </button>
        <div className="segmented" aria-label="Before and after view">
          <button
            type="button"
            aria-pressed={compareMode === 'edited'}
            disabled={!hasImage}
            onClick={() => onCompareModeChange('edited')}
          >
            Edited
          </button>
          <button
            type="button"
            aria-pressed={compareMode === 'original'}
            disabled={!hasImage}
            onClick={() => onCompareModeChange('original')}
          >
            Original
          </button>
        </div>
        <a className="button-secondary" href={appMeta.repositoryUrl} rel="noreferrer" target="_blank">
          <Github aria-hidden="true" size={18} />
          Star
        </a>
        <a className="button-primary" href={appMeta.paypalUrl} rel="noreferrer" target="_blank">
          <Heart aria-hidden="true" size={18} />
          Support
        </a>
      </div>
    </header>
  );
}
