// ── Result-surface state selection (pure) ────────────────────────────────────
// Extracted from ResultCard.tsx (MWPW-199251) so the busy/cancelled/error/
// published/awaiting-publish/empty branching can be unit-tested without importing
// React or @react-spectrum/s2. ResultCard renders one block per state and reads
// the chosen state from here — this module is the single source of truth for
// WHICH state a Session is in, so the render guards can never drift from the test.
import type { Session } from '../sessions/types';

// The six mutually-exclusive surfaces ResultCard can show, in priority order:
//   busy             → a run is in flight (GeneratingCard)
//   cancelled        → the user stopped a run with nothing produced yet
//   error            → a run failed with nothing produced yet (retry / figma re-auth)
//   published        → the page landed in Authoring (shipped.prototypeUrl)
//   awaiting-publish → a page is built and awaiting the deliberate ship step
//   empty            → pending / undefined (nothing to show)
export type ResultState =
  | 'busy'
  | 'cancelled'
  | 'error'
  | 'published'
  | 'awaiting-publish'
  | 'empty';

// Statuses where a run is actively in flight → the busy surface wins over
// everything else (even if stale versions/shipped data is still attached).
const BUSY_STATUSES: ReadonlySet<string> = new Set([
  'queued',
  'generating',
  'waiting',
  'refining',
  'shipping',
  'deploying',
  'running',
]);

export function isBusy(s: Session): boolean {
  return BUSY_STATUSES.has(s.status);
}

// A cancelled run reaches the client as status:'error' — distinguished from a
// genuine failure by an explicit phase:'cancelled' or a /cancelled/i error string.
export function isCancelled(s: Session): boolean {
  return s.phase === 'cancelled' || /cancelled/i.test(s.error || '');
}

// Resolve the single surface to render. Order matters and mirrors ResultCard's
// guard order exactly:
//   1. busy wins outright.
//   2. an errored run with NO versions is either cancelled (user stopped) or a
//      genuine error — both show a terminal card with a restart action.
//   3. an errored run WITH versions falls through to the done surfaces (a late
//      failure shouldn't discard an already-built page).
//   4. shipped.prototypeUrl → published; else any versions → awaiting-publish.
//   5. nothing produced → empty.
export function selectResultState(s: Session): ResultState {
  if (isBusy(s)) return 'busy';

  const noVersions = (s.versions?.length ?? 0) === 0;
  if (s.status === 'error' && noVersions) {
    return isCancelled(s) ? 'cancelled' : 'error';
  }

  if (s.shipped?.prototypeUrl) return 'published';
  if ((s.versions?.length ?? 0) > 0) return 'awaiting-publish';
  return 'empty';
}
