// ── Timeline derivation (pure) ──────────────────────────────────────────────
// Extracted from ProgressTimeline.tsx (MWPW-199250) so the phase/status → step+state
// logic can be unit-tested without importing React or @react-spectrum/s2 icons.
// STEP_COUNT MUST equal STEPS.length in ProgressTimeline.tsx (guarded at module load there).
import type { Session } from '../sessions/types';

// Number of steps in the journey timeline:
// queued → read → match → author → publish → verify.
export const STEP_COUNT = 6;

// Phase → step index. Every phase the server can emit maps to one of the steps.
// When a phase is unrecognised, deriveTimeline falls back to the status-minimum.
const PHASE_TO_STEP: Record<string, number> = {
  // step 0 — queued
  queued: 0,
  // step 1 — reading design
  fetch: 1, forge: 1, extracting: 1, redesign: 1, tweak: 1,
  // step 2 — matching blocks
  converge: 2, converging: 2, negotiate: 2, convert: 2, matching: 2,
  // step 3 — authoring page
  worktree: 3, 'local-write': 3,
  composing: 3, 'generating-blocks': 3, linting: 3,
  // step 4 — publishing to DA
  push: 4, 'da-push': 4, shipping: 4,
  // step 5 — going live (verify during deploy, or just done)
  verify: 5,
};

// Minimum step implied by session.status when the phase is unrecognised.
const STATUS_MIN_STEP: Record<string, number> = {
  queued: 0, generating: 1, refining: 1, running: 1,
  // 'waiting' (MWPW-199520) is a rate-limit pause — its phase is usually a
  // recognised one (converge → 2) that wins, but the extract-phase wait has no
  // PHASE_TO_STEP entry, so anchor its minimum at 'reading' rather than regressing
  // the timeline to Queued mid-run.
  waiting: 1,
  shipping: 4, deploying: 3,
};

export type TimelineState = 'running' | 'gate' | 'done' | 'error' | 'cancelled';

export interface TimelineInfo {
  stepIdx: number;   // 0–(STEP_COUNT-1), never -1
  state: TimelineState;
}

export function deriveTimeline(session: Session): TimelineInfo {
  const phase = session.phase || '';
  const status = session.status;

  // ── Terminal: error / cancelled ───────────────────────────────────────────
  if (status === 'error') {
    const isCancelled = phase === 'cancelled' || /cancelled/i.test(session.error || '');
    const phaseStep = PHASE_TO_STEP[phase] ?? -1;
    // Best-effort last step: phase map first, then infer from source
    const stepIdx = phaseStep >= 0 ? phaseStep : (session.source === 'figma' ? 2 : 1);
    return { stepIdx, state: isCancelled ? 'cancelled' : 'error' };
  }

  // ── Terminal: done ────────────────────────────────────────────────────────
  if (status === 'done') {
    const shipped = session.shipped as Record<string, unknown> | undefined;
    if (shipped?.prototypeUrl) {
      // Fully deployed — all steps complete
      return { stepIdx: STEP_COUNT - 1, state: 'done' };
    }
    // Generation done, waiting for user to click Deploy (deploy gate).
    // Infer last completed step from source type.
    const gateStep = session.source === 'figma' ? 2 : 1;
    return { stepIdx: gateStep, state: 'gate' };
  }

  // ── Paused (waiting for user action) ─────────────────────────────────────
  if (status === 'paused') {
    const gateStep = session.source === 'figma' ? 2 : 1;
    return { stepIdx: gateStep, state: 'gate' };
  }

  // ── Active (busy) ─────────────────────────────────────────────────────────
  const phaseStep = PHASE_TO_STEP[phase] ?? -1;
  const statusMin = STATUS_MIN_STEP[status] ?? 0;
  // Hold the last known step instead of dropping to -1 when phase is unrecognised.
  const stepIdx = phaseStep >= 0 ? phaseStep : statusMin;
  return { stepIdx, state: 'running' };
}
