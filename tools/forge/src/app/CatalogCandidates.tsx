// ── CatalogCandidates — "What this added to the design system" (per-run strip) ─
// A LEAN on-ramp to the flywheel: it shows the new blocks this run authored as
// SHIPPED (real) and CANDIDATE (eligible, planned), then links to the design system
// for the full story. The crunchy "what happens after" detail lives there, not here.
//
// HONESTY:
//   • "Shipped" is the only real state. "Candidate" is eligibility, marked Planned*.
//   • Anything not built carries the Planned asterisk + one footnote, never a claim.

import type { CandidateBlock, CandidateTrigger, Session } from '../sessions/types';
import { useUiState } from './UiStateContext';
import { Planned } from './Planned';

const TRIGGER_LABEL: Record<CandidateTrigger, string> = {
  'coverage-gap': 'coverage gap',
  'bespoke-oneoff': 'one-off for this page',
  reimagine: 'from a redesign',
};

function CandidateRow({ block }: { block: CandidateBlock }) {
  return (
    <div className="pf-cand-row">
      <span className="pf-cand-name">{block.blockName}</span>
      <span className="pf-cand-states">
        <span className="pf-cand-shipped">In Milo</span>
        <span className="pf-cand-elig">Candidate</span>
      </span>
      <span className="pf-cand-trigger">{TRIGGER_LABEL[block.trigger]}</span>
    </div>
  );
}

export function CatalogCandidates({ session }: { session: Session }) {
  const { dispatch } = useUiState();
  const candidates = session.candidateBlocks ?? [];

  if (candidates.length === 0) {
    return (
      <p className="pf-cand-lede pf-cand-lede--none">
        Nothing new this time. Every section reused an approved block, which is the goal.
      </p>
    );
  }

  return (
    <div className="pf-cand">
      <p className="pf-cand-lede">
        <b>{candidates.length}</b> new block{candidates.length === 1 ? '' : 's'} in Milo, each a{' '}
        <Planned>candidate</Planned> for the shared library.
      </p>

      <div className="pf-cand-list">
        {candidates.map((b) => (
          <CandidateRow key={b.blockName} block={b} />
        ))}
      </div>

      <p className="pf-cand-foot">
        <Planned.Note>Promotion is planned, not built yet.</Planned.Note>{' '}
        <button
          type="button"
          className="pf-cand-link"
          onClick={() => dispatch({ type: 'openDesignSystem' })}
        >
          See the design system
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </p>
    </div>
  );
}
