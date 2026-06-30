// ── ConversionReport — "How we built your page" ──────────────────────────────
// Composition-first: a single proportion bar (reused approved blocks vs newly
// designed) that scales to any number of sections without breaking into slivers,
// plus a plain sentence that carries the story. The full per-section detail lives
// in a slide-over drawer behind "View all N sections" (SectionsDrawer).
//
// Deliberately NOT shown here (this is a creator-facing surface): stat tiles, a
// "match %" presented as fidelity, a fidelity column (the server doesn't compute
// per-section fidelity, so it would only ever say "not measured"). Engineering
// telemetry (cost/tokens/turns) stays out too. See forge_result_audience_layers.

import { useState } from 'react';
import { SectionsDrawer, deriveSectionRows } from './SectionsDrawer';
import { UsageStrip } from './UsageStrip';
import { StardustMark } from './StardustMark';
import { INTENT_REQUEST_LINE } from './intent';
import type { IntentPolicy } from '../sessions/types';
import type { SectionTableResult } from './SectionTable';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Counters {
  reusableBlocksUsed?: number;
  newBlocksCreated?: number;
  totalSections?: number;
  reuseRate?: number;
}

export interface ConversionReportData extends SectionTableResult {
  slug?: string | null;
  branchUrl?: string | null;
  branchName?: string | null;
  sha?: string | null;
  daPreviewUrl?: string | null;
  milolibsUrl?: string | null;
  counters?: Counters | null;
  reuseRate?: number | null;
  // The intent the run asked for — drives the "you asked Forge to…" context line
  // and (for reimagine) the Stardust attribution. A LABEL, not a matcher signal.
  intentPolicy?: IntentPolicy;
}

interface ConversionReportProps {
  report: ConversionReportData;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ConversionReport({ report }: ConversionReportProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const rows = deriveSectionRows(report);
  // Prefer the real per-section rows; fall back to the server counters if rows
  // are absent (older sessions). Only render when we actually have something.
  const reused = rows.length
    ? rows.filter((r) => r.kind === 'reused').length
    : report.counters?.reusableBlocksUsed ?? 0;
  const created = rows.length
    ? rows.filter((r) => r.kind === 'new').length
    : report.counters?.newBlocksCreated ?? 0;
  const total = rows.length || report.counters?.totalSections || reused + created;

  if (!total) {
    return (
      <p className="pf-section-empty">
        Block breakdown appears here after the page is processed.
      </p>
    );
  }

  const policy = report.intentPolicy;
  const reimagine = policy === 'reimagine';

  // A SHORT headline. The numbers live in the bar + counts row below, so the lede
  // doesn't repeat them — it just frames what you're looking at.
  const lede = `Rebuilt as ${total} section${total === 1 ? '' : 's'} on the Adobe brand.`;

  return (
    <div className="pf-report2">
      {/* Reimagine = just the Stardust attribution. Match/Bespoke = the one-line
          "what you asked for" context. Never both, never verbose. */}
      {reimagine ? (
        <p className="pf-report2-stardust">
          <span className="pf-report2-stardust-glyph"><StardustMark /></span>
          Reimagined on Stardust
        </p>
      ) : (
        policy && <p className="pf-report2-intent">{INTENT_REQUEST_LINE[policy]}</p>
      )}
      <p className="pf-report2-lede">{lede}</p>

      <p className="pf-report2-bar-label">Composition</p>
      <div className="pf-report2-bar" role="img" aria-label={`${reused} of ${total} sections reused approved blocks`}>
        {reused > 0 && <span className="pf-report2-bar-reused" style={{ flexGrow: reused }} />}
        {created > 0 && <span className="pf-report2-bar-new" style={{ flexGrow: created }} />}
      </div>
      <div className="pf-report2-counts">
        <span className="pf-report2-count">
          <span className="pf-report2-sw pf-report2-sw--reused" />
          <b>{reused}</b> reused {reused === 1 ? 'block' : 'blocks'}
        </span>
        <span className="pf-report2-count">
          <span className="pf-report2-sw pf-report2-sw--new" />
          <b>{created}</b> newly designed
        </span>
      </div>

      {rows.length > 0 && (
        <div className="pf-report2-viewall">
          <button type="button" onClick={() => setDrawerOpen(true)}>
            View all {total} section{total === 1 ? '' : 's'}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}

      <SectionsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rows={rows}
        reusedCount={reused}
        newCount={created}
      />
    </div>
  );
}

// Re-export UsageStrip for use in session summary cards
export { UsageStrip };
