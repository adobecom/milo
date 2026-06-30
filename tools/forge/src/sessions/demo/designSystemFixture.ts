// ── Design system fixture — seed data for the flywheel walkthrough (demo) ─────
//
// Powers app/DesignSystemView.tsx. Only the candidate block NAMES + triggers are
// real artifacts from demo runs; the promotion lifecycle the view lets you walk
// (nominate → review → promote) is an interactive PREVIEW, not wired to a live
// catalog. The view holds the lifecycle state locally and starts everything as a
// candidate, so this fixture only needs to supply the seed list.

import { PROMOTION_LEDGER } from './fixtures';

export interface DesignSystemDemo {
  // Candidate blocks accumulated across demo runs (names/triggers real; promotion
  // status is driven interactively in the view). Sorted thesis-first in the ledger
  // (coverage-gap strongest, reimagine weakest).
  candidates: typeof PROMOTION_LEDGER;
}

export const DESIGN_SYSTEM_DEMO: DesignSystemDemo = {
  candidates: PROMOTION_LEDGER,
};
