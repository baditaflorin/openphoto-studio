import { RotateCcw } from 'lucide-react';
import { adjustmentControls, defaultAdjustments } from '../defaults';
import type { AdjustmentSettings } from '../types';

interface AdjustmentsPanelProps {
  settings: AdjustmentSettings;
  disabled: boolean;
  onChange: (settings: AdjustmentSettings) => void;
}

export function AdjustmentsPanel({ settings, disabled, onChange }: AdjustmentsPanelProps) {
  return (
    <section className="panel" aria-label="Adjustments">
      <div className="panel-heading">
        <h2>Adjust</h2>
        <button
          className="icon-button"
          type="button"
          title="Reset adjustments"
          onClick={() => onChange(defaultAdjustments)}
        >
          <RotateCcw aria-hidden="true" size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {adjustmentControls.map((control) => (
          <label className="control" key={control.key}>
            <span>
              {control.label}
              <output>{Math.round(settings[control.key])}</output>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={settings[control.key]}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...settings,
                  [control.key]: Number(event.currentTarget.value)
                })
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}
