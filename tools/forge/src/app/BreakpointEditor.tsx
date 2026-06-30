// ── BreakpointEditor ─────────────────────────────────────────────────────────
// Port of buildBreakpointList (vanilla page-forge.js lines 249–315).
// Renders a list of breakpoint rows: label + width + figma URL + remove button.

import { ActionButton, NumberField, TextField } from '@react-spectrum/s2';
import type { BreakpointDef } from '../sessions/types';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface BreakpointEditorProps {
  breakpoints: BreakpointDef[];
  onChange: (bps: BreakpointDef[]) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BreakpointEditor({ breakpoints, onChange }: BreakpointEditorProps) {
  function updateRow(index: number, patch: Partial<BreakpointDef>) {
    const next = breakpoints.map((bp, i) =>
      i === index ? { ...bp, ...patch } : bp,
    );
    onChange(next);
  }

  function removeRow(index: number) {
    if (breakpoints.length <= 1) return;
    onChange(breakpoints.filter((_, i) => i !== index));
  }

  function addRow() {
    onChange([...breakpoints, { label: '', width: 1440, figmaUrl: '' }]);
  }

  return (
    <div className="pf-bp-wrap">
      <div className="pf-bp-header">
        <span className="pf-label">Breakpoints</span>
        <span className="pf-bp-hint">Label · Width · Figma URL</span>
      </div>

      <div className="pf-bp-list">
        {breakpoints.map((bp, i) => (
          <div key={i} className="pf-bp-row">
            <TextField
              aria-label="Breakpoint label"
              value={bp.label}
              onChange={(val) => updateRow(i, { label: val })}
              placeholder="Label"
            />
            <NumberField
              aria-label="Breakpoint width"
              value={bp.width}
              onChange={(val) => updateRow(i, { width: val })}
              minValue={1}
              maxValue={9999}
              formatOptions={{ useGrouping: false }}
            />
            <TextField
              aria-label="Figma URL"
              value={bp.figmaUrl}
              onChange={(val) => updateRow(i, { figmaUrl: val })}
              placeholder="https://www.figma.com/design/…"
            />
            <ActionButton
              onPress={() => removeRow(i)}
              isQuiet
              aria-label="Remove breakpoint"
              isDisabled={breakpoints.length <= 1}
            >
              ×
            </ActionButton>
          </div>
        ))}
      </div>

      <button type="button" className="pf-bp-add" onClick={addRow}>
        + Add breakpoint
      </button>
    </div>
  );
}
