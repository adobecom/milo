// ── intent.ts — one place to read "what did this run ask for" ─────────────────
// resolveIntentPolicy() derives the intent LABEL for a session. It is a label for
// display ONLY — never wired into the matcher (the matcher doesn't read intent
// today; only 'reimagine' actually switches engines). It bridges all three ways a
// policy can reach us so the
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

// ── Entry-side intent (the WRITE side) — MWPW-200668 ──────────────────────────
// The New-session doors FIX the intent; there is no dial (the old IntentDial was
// retired — it rendered nowhere). The open door ALONE determines the policy the
// run is asked for:
//   • Figma frame → 'conformance' (build on the Adobe design system)
//   • Live URL    → 'reimagine'   (Stardust redesign — a separate, heavier engine)
// PROMPT-ONLY caveat (unchanged): the matcher does NOT read intentPolicy. Only
// 'reimagine' actually switches engines, via the legacy `mode:'reimagine'` the
// server reads today; 'conformance' is a display label over the default matcher
// pass-through.
export type EntryDoor = 'figma' | 'url';

export function doorIntentPolicy(door: EntryDoor): IntentPolicy {
  return door === 'figma' ? 'conformance' : 'reimagine';
}

// The intent-related fields the entry form submits for a door. Pure so the
// per-door contract (policy + the legacy `mode` the server reads + the Figma-only
// effort budget) is unit-testable without rendering the S2 form.
export interface EntryIntentFields {
  intentPolicy: IntentPolicy;
  // Only set for reimagine — routes the run to Stardust on the server.
  mode?: 'reimagine';
  // Convergence round budget, Figma path only (the URL/Reimagine door runs
  // Stardust, which has no round budget, so effort is never forwarded there).
  effort?: string;
}

export function buildEntryIntent(door: EntryDoor, effort?: string): EntryIntentFields {
  const intentPolicy = doorIntentPolicy(door);
  const fields: EntryIntentFields = { intentPolicy };
  if (intentPolicy === 'reimagine') fields.mode = 'reimagine';
  if (door === 'figma' && effort) fields.effort = effort;
  return fields;
}
