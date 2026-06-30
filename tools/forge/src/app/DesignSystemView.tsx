// ── DesignSystemView — the flywheel, demonstrated ─────────────────────────────
// The cross-run home for the design-system flywheel. Instead of describing the
// (unbuilt) promotion lane in prose, it lets you DRIVE it: nominate a candidate →
// it moves to In review → approve it → it lands in Promoted, and the lifecycle
// counts move with it. That teaches the loop by doing it.
//
// HONESTY: this is a PREVIEW of the flow on demo data — the promotion lane isn't
// wired to the live shared catalog yet. One persistent banner says so. "Shipped" is
// the only count that reflects real runs; the rest is this interactive mockup.

import { useState } from 'react';
import ChevronLeft from '@react-spectrum/s2/icons/ChevronLeft';
import Checkmark from '@react-spectrum/s2/icons/Checkmark';
import { DESIGN_SYSTEM_DEMO } from '../sessions/demo/designSystemFixture';
import type { CandidateTrigger, PromotionLedgerEntry } from '../sessions/types';
import { useUiState } from './UiStateContext';
import { Planned } from './Planned';

const TRIGGER_LABEL: Record<CandidateTrigger, string> = {
  'coverage-gap': 'coverage gap',
  'bespoke-oneoff': 'one-off',
  reimagine: 'redesign',
};

// Local lifecycle stage for the interactive walkthrough.
type Stage = 'candidate' | 'in-review' | 'promoted';
interface Row extends PromotionLedgerEntry {
  stage: Stage;
}

const SHIPPED_COUNT = 7; // the only REAL count (blocks authored across demo runs)

export function DesignSystemView() {
  const { dispatch } = useUiState();
  // Seed from the demo ledger; everything starts as a candidate.
  const [rows, setRows] = useState<Row[]>(
    DESIGN_SYSTEM_DEMO.candidates.map((c) => ({ ...c, stage: 'candidate' })),
  );

  function move(blockName: string, stage: Stage) {
    setRows((rs) => rs.map((r) => (r.blockName === blockName ? { ...r, stage } : r)));
  }

  const candidates = rows.filter((r) => r.stage === 'candidate');
  const inReview = rows.filter((r) => r.stage === 'in-review');
  const promoted = rows.filter((r) => r.stage === 'promoted');

  // "In Milo" is the concrete real state: the block's code is committed to a Milo
  // branch (vs the vague "Shipped"). The rest of the lifecycle is the planned lane.
  const counts: Array<{ key: Stage | 'shipped'; label: string; n: number; real: boolean }> = [
    { key: 'shipped', label: 'In Milo', n: SHIPPED_COUNT, real: true },
    { key: 'candidate', label: 'Candidates', n: candidates.length, real: false },
    { key: 'in-review', label: 'In review', n: inReview.length, real: false },
    { key: 'promoted', label: 'Promoted', n: promoted.length, real: false },
  ];

  return (
    <div className="pf-ds">
      <button
        type="button"
        className="pf-back-btn"
        onClick={() => dispatch({ type: 'closeDesignSystem' })}
      >
        <ChevronLeft />
        Back
      </button>

      <h2 className="pf-ds-title">Design system</h2>
      <p className="pf-ds-sub">How a new block earns a place in the shared library.</p>

      <div className="pf-ds-banner">
        <Planned.Note>Walks the flow on demo data; not wired to the live catalog yet.</Planned.Note>
      </div>

      {/* Lifecycle track — counts move as you nominate/approve below. */}
      <div className="pf-fw-track">
        {counts.map((c, i) => (
          <div className="pf-fw-stage-wrap" key={c.key}>
            <div className={`pf-fw-stage${c.real ? ' pf-fw-stage--real' : ''}`}>
              <span className="pf-fw-count">{c.n}</span>
              <span className="pf-fw-label">{c.label}</span>
            </div>
            {i < counts.length - 1 && (
              <span className="pf-fw-arrow" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Candidates — nominate to send to review. */}
      {candidates.length > 0 && (
        <section className="pf-ds-section">
          <h3 className="pf-ds-h3">Candidates</h3>
          <div className="pf-fw-cand-list">
            {candidates.map((c) => (
              <div className="pf-fw-cand" key={c.blockName}>
                <span className="pf-fw-cand-name">{c.blockName}</span>
                <span className="pf-fw-cand-meta">
                  {c.recurrenceCount > 1 ? `${c.recurrenceCount} runs` : '1 run'} ·{' '}
                  {TRIGGER_LABEL[c.trigger]}
                </span>
                <button
                  type="button"
                  className="pf-btn-secondary pf-fw-cand-act"
                  onClick={() => move(c.blockName, 'in-review')}
                >
                  Nominate
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In review — approve to promote, or send back. */}
      {inReview.length > 0 && (
        <section className="pf-ds-section">
          <h3 className="pf-ds-h3">In review</h3>
          <div className="pf-fw-cand-list">
            {inReview.map((c) => (
              <div className="pf-fw-cand" key={c.blockName}>
                <span className="pf-fw-cand-name">{c.blockName}</span>
                <span className="pf-fw-cand-meta">{TRIGGER_LABEL[c.trigger]}</span>
                <span className="pf-fw-review-acts">
                  <button type="button" className="pf-btn-secondary" onClick={() => move(c.blockName, 'candidate')}>
                    Send back
                  </button>
                  <button type="button" className="pf-btn-primary pf-fw-approve" onClick={() => move(c.blockName, 'promoted')}>
                    Approve
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promoted — in the shared library; next Match run reuses it. */}
      <section className="pf-ds-section">
        <h3 className="pf-ds-h3">Promoted</h3>
        {promoted.length === 0 ? (
          <p className="pf-ds-empty-msg">Approve a candidate to promote it. None yet.</p>
        ) : (
          <div className="pf-fw-cand-list">
            {promoted.map((c) => (
              <div className="pf-fw-cand pf-fw-cand--promoted" key={c.blockName}>
                <span className="pf-fw-promoted-ic" aria-hidden><Checkmark /></span>
                <span className="pf-fw-cand-name">{c.blockName}</span>
                <span className="pf-fw-cand-meta">In the shared library. Future runs reuse it.</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* The crunchy "what happens after" detail lives HERE, not on every result. */}
      <section className="pf-ds-section pf-ds-how">
        <h3 className="pf-ds-h3">How promotion works</h3>
        <ol className="pf-ds-steps">
          <li><b>Noticed.</b> A block recurs across runs, or fills a gap a designer wanted reused.</li>
          <li><b>Reviewed.</b> A design-system owner approves, merges, or rejects it.</li>
          <li><b>Promoted.</b> It joins the shared library and is fingerprinted, so the matcher finds it next time.</li>
        </ol>
        <p className="pf-ds-foot">
          <Planned.Note>Review and promotion are planned. Today every block lands in Milo on its own
          branch.</Planned.Note>
        </p>
      </section>
    </div>
  );
}
