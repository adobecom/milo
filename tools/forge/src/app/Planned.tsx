// ── Planned — the one honesty primitive for "not built yet" ───────────────────
// Replaces the dashed "NOT BUILT YET" pill, which read as odd chrome inline. The
// pattern: gray the term and mark it with a small asterisk, so a planned concept
// reads as in-flight (greyed) without a loud badge. Reuse it for ANYTHING not yet
// built. Pair one <Planned.Note> per surface as the footnote the asterisk points to.
//
//   <Planned>candidate</Planned>            → greyed "candidate*"
//   <Planned.Note>Promotion is planned.</Planned.Note>  → "* Promotion is planned."

import type { ReactNode } from 'react';

function PlannedTerm({ children }: { children: ReactNode }) {
  return (
    <span className="pf-planned" title="Planned, not built yet.">
      {children}
      <span className="pf-planned-star" aria-hidden>*</span>
    </span>
  );
}

function PlannedNote({ children }: { children: ReactNode }) {
  return (
    <span className="pf-planned-note">
      <span className="pf-planned-star" aria-hidden>*</span>
      {children}
    </span>
  );
}

export const Planned = Object.assign(PlannedTerm, { Note: PlannedNote });
