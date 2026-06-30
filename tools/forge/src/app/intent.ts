// ── intent.ts — one place to read "what did this run ask for" ─────────────────
// resolveIntentPolicy() derives the intent LABEL for a session. It is a label for
// display ONLY — never wired into the matcher (the matcher doesn't read intent
// today; see IntentDial). It bridges all three ways a policy can reach us so the
// result/report can render before OR after the entry change ships:
//   1. the explicit field (sourceInput.intentPolicy or session.intentPolicy),
//   2. the engine/mode signal (engine 'stardust' / mode 'reimagine' → reimagine),
//   3. a best-effort fallback for older sessions (Figma with a note → fidelity).
//
// HONESTY: the chip/copy this drives describe the run that HAPPENED ("built on
// approved blocks" / "what you asked for"), never a claim that Forge enforced the
// intent in the matcher.

import type { IntentPolicy, Session } from '../sessions/types';

export function resolveIntentPolicy(s: Session): IntentPolicy {
  const src = (s.sourceInput || {}) as Record<string, unknown>;
  // 1. Explicit field (session-level first, then the source input).
  const explicit = (s.intentPolicy || s.versions?.[0]?.intentPolicy || src.intentPolicy) as
    | IntentPolicy
    | undefined;
  if (explicit === 'conformance' || explicit === 'fidelity' || explicit === 'reimagine') {
    return explicit;
  }
  // 2. Engine / mode signal → reimagine (Stardust ran).
  if (s.engine === 'stardust' || s.versions?.[0]?.engine === 'stardust' || src.mode === 'reimagine') {
    return 'reimagine';
  }
  // 3. Fallback for older sessions: Figma with a note read as fidelity (the old
  //    note-derived behavior); everything else defaults to the safe conformance.
  if (s.source === 'figma' && String(src.intent || '').trim()) return 'fidelity';
  return 'conformance';
}

// Whether Stardust produced this run (gates all four Stardust mentions).
export function isReimagine(s: Session): boolean {
  return resolveIntentPolicy(s) === 'reimagine';
}

// ── Copy tables (single source of truth for the mode-aware language) ──────────

// The result chip label (the MODE that produced the page — distinct from the
// verdict, which is the run STATE). Only reimagine is colored (indigo); the other
// two are neutral.
export const INTENT_CHIP: Record<IntentPolicy, string> = {
  conformance: 'Built on approved blocks',
  fidelity: 'Built to match your design',
  reimagine: 'Reimagined with Stardust',
};

// The lead verb for the summary sentence, tied to the mode so chip + prose agree.
export const INTENT_SUMMARY_VERB: Record<IntentPolicy, string> = {
  conformance: 'Rebuilt',
  fidelity: 'Built',
  reimagine: 'Reimagined',
};

// The build-report context line — the run's intent, in a few words. Framed as the
// REQUEST, never as enforcement (the matcher doesn't read intent yet).
export const INTENT_REQUEST_LINE: Record<IntentPolicy, string> = {
  conformance: 'Built to stay on approved blocks.',
  fidelity: 'Built to match your design.',
  reimagine: 'Reimagined on Stardust.',
};
