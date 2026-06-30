// ── FidelityMeter — honest render-diff fidelity readout ───────────────────────
// the-new-plan §4.2 item 8 / F-add-1. Replaces the green-lie of an unconditional
// "ready" with a truthful measure of how faithfully the shipped page reproduces
// the source design.
//
// Inputs are render-diff scalars (0–1) from visual convergence:
//   • combined      — MISMATCH ratio (0 = perfect). Fidelity = 1 - combined.
//   • textPresence  — PRESENCE ratio (1 = every expected text node rendered).
//   • presenceMeasured — false ⇒ textPresence is a sentinel, show "not measured".
//
// When the server has NOT surfaced fidelity (the current state — see
// pendingLiveE2E), every value renders as "—" and the meter says so plainly
// rather than implying success.

import type { ReactNode } from 'react';
import type { RenderFidelity } from '../sessions/types';

// 0–49% = low (red), 50–74% = mid (amber), 75–100% = high (green).
// Matches SectionTable.scoreLevel thresholds for visual consistency.
function level(pct: number): 'high' | 'mid' | 'low' {
  if (pct >= 75) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

// Convert a combined MISMATCH ratio (0 = perfect) to a fidelity LEVEL.
export function fidelityLevel(combined: number | null | undefined): 'high' | 'mid' | 'low' {
  if (combined == null) return 'low';
  return level(Math.round((1 - combined) * 100));
}

// ── A single labelled bar (or em-dash when unmeasured) ─────────────────────────

function MeterRow({
  label,
  pct,
  unmeasured,
  tooltip,
}: {
  label: string;
  pct: number | null;
  unmeasured?: boolean;
  tooltip: string;
}): ReactNode {
  if (pct == null || unmeasured) {
    return (
      <div className="pf-fidelity-row">
        <span className="pf-fidelity-label">{label}</span>
        <span className="pf-fidelity-meter pf-fidelity-meter--na" title={tooltip}>
          <span className="pf-fidelity-na" aria-hidden="true">—</span>
          <span className="pf-fidelity-na-note">{unmeasured ? 'not measured' : 'unavailable'}</span>
        </span>
      </div>
    );
  }
  const lvl = level(pct);
  return (
    <div className="pf-fidelity-row">
      <span className="pf-fidelity-label">{label}</span>
      <span
        className={`pf-fidelity-meter pf-fidelity-meter--${lvl}`}
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct}% — ${tooltip}`}
        title={tooltip}
      >
        <span className="pf-fidelity-track">
          <span className="pf-fidelity-fill" style={{ width: `${pct}%` }} />
        </span>
        <span className="pf-fidelity-pct" aria-hidden="true">
          {pct}%
        </span>
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface FidelityMeterProps {
  fidelity: RenderFidelity | null | undefined;
  // `compact` drops the section heading — used inside the per-section table cell.
  compact?: boolean;
}

export function FidelityMeter({ fidelity, compact }: FidelityMeterProps) {
  const combined = fidelity?.combined ?? null;
  const fidelityPct = combined == null ? null : Math.round((1 - combined) * 100);

  const presenceUnmeasured = fidelity?.presenceMeasured === false;
  const presence = fidelity?.textPresence ?? null;
  const presencePct = presence == null ? null : Math.round(presence * 100);

  // Nothing at all from the server → one honest line, no fake bars.
  if (!fidelity || (combined == null && presence == null)) {
    return (
      <div className={`pf-fidelity${compact ? ' pf-fidelity--compact' : ''}`}>
        {!compact && <div className="pf-fidelity-title">Design fidelity</div>}
        <div className="pf-fidelity-row">
          <span className="pf-fidelity-meter pf-fidelity-meter--na" title="The render-diff fidelity check did not run for this page.">
            <span className="pf-fidelity-na" aria-hidden="true">—</span>
            <span className="pf-fidelity-na-note">fidelity not measured</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`pf-fidelity${compact ? ' pf-fidelity--compact' : ''}`}>
      {!compact && <div className="pf-fidelity-title">Design fidelity</div>}
      <MeterRow
        label="Visual match"
        pct={fidelityPct}
        tooltip="How closely the shipped render reproduces your source design (1 − render-diff mismatch)."
      />
      <MeterRow
        label="Text present"
        pct={presencePct}
        unmeasured={presenceUnmeasured}
        tooltip={
          presenceUnmeasured
            ? 'No text nodes were available to grade — text presence could not be measured.'
            : 'Share of expected text from your design that actually rendered on the page.'
        }
      />
    </div>
  );
}
