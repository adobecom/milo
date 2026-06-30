// ── IntentDial — "How should we build it?" (both source doors) ────────────────
// One segmented control that asks the single intent question up front and writes a
// structured `intentPolicy` field:
//   • conformance (default) — "Stay on our blocks." Reuse approved Milo blocks,
//     accept drift. Fastest, cheapest, most reusable.
//   • fidelity              — "Match my design." Reproduce as closely as possible;
//     author new blocks wherever nothing fits.
//   • reimagine             — "Reimagine with Stardust." Redesign from the ground
//     up. A SEPARATE, heavier engine (longer, pricier). Offered ONLY on the URL
//     door (Stardust crawls a live URL — it has nothing to act on for a Figma
//     frame), so `allowReimagine` gates the third stop.
//
// HONESTY: this dial is PROMPT-ONLY today for the conformance/fidelity split — the
// matcher does NOT read it (runBlockAwareConversion accepts `intent` and never
// reads the policy). Reimagine DOES route to a real, different pipeline (Stardust)
// via the bridge below. So the dial speaks intent; only Reimagine currently changes
// the engine. Wiring conformance/fidelity into the matcher is a backend milestone.

import type { IntentPolicy } from '../sessions/types';
import { StardustMark } from './StardustMark';

// ── Stops ─────────────────────────────────────────────────────────────────────
interface Stop {
  value: IntentPolicy;
  label: string;
  helper: string;
  stardust?: boolean;
}

// The stops, with copy that fits the source. Figma → "Match my design";
// URL → "Match the page" (you're matching a live page, not your own design).
function buildStops(source: 'figma' | 'url'): Stop[] {
  const matchLabel = source === 'figma' ? 'Match my design' : 'Match the page';
  const matchHelper =
    source === 'figma'
      ? 'Reproduce your design closely. New blocks wherever nothing fits.'
      : 'Reproduce the page closely. New blocks wherever nothing fits.';
  return [
    {
      value: 'conformance',
      label: 'Stay on our blocks',
      helper: 'Reuse approved blocks. Fastest and most reusable, may drift.',
    },
    {
      value: 'fidelity',
      label: matchLabel,
      helper: matchHelper,
    },
    {
      value: 'reimagine',
      label: 'Reimagine',
      helper: 'Stardust redesigns it from scratch on the brand.',
      stardust: true,
    },
  ];
}

// ── Backend-compat bridge ─────────────────────────────────────────────────────
// Map the explicit policy (+ optional free-text note) to the legacy wire fields the
// server ALREADY accepts: `mode` (URL path: 'reimagine' triggers Stardust, anything
// else is the Match pass-through) and `intent` (a free-text directive the prompt
// reads). 'reimagine' is the only policy that flips the engine; conformance and
// fidelity both stay on the Match pass-through (fidelity rides as a prompt directive).
export function departureIntent(
  policy: IntentPolicy,
  note?: string,
): { mode: 'reimagine' | null; intent: string | null } {
  const trimmed = (note || '').trim();
  if (policy === 'reimagine') {
    return { mode: 'reimagine', intent: trimmed || null };
  }
  if (policy === 'fidelity') {
    const directive =
      'Reproduce the source design as closely as possible; author new blocks wherever no approved block fits.';
    return { mode: null, intent: trimmed ? `${directive} ${trimmed}` : directive };
  }
  // conformance → server default (no directive); the note, if any, still rides.
  return { mode: null, intent: trimmed || null };
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface IntentDialProps {
  value: IntentPolicy;
  onChange: (next: IntentPolicy) => void;
  // The input source — tunes the "Match" stop's copy (my design vs the page).
  source: 'figma' | 'url';
  // When Reimagine is shown but Stardust isn't set up (real build, no skill
  // configured), the stop is disabled with a hint. The demo seeds it ready.
  stardustReady?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function IntentDial({ value, onChange, source, stardustReady = true }: IntentDialProps) {
  const stops = buildStops(source);
  const active = stops.find((s) => s.value === value) ?? stops[0];

  return (
    <div className="pf-field">
      <p className="pf-seg-label" id="pf-intent-label">How should we build it?</p>
      <div className="pf-segmented pf-segmented--intent" role="radiogroup" aria-labelledby="pf-intent-label">
        {stops.map((s) => {
          const disabled = s.stardust ? !stardustReady : false;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={s.value === value}
              disabled={disabled}
              title={disabled ? 'Reimagine runs on Stardust. An engineer sets it up.' : undefined}
              className={`pf-seg${s.value === value ? ' pf-seg--active' : ''}${s.stardust ? ' pf-seg--stardust' : ''}`}
              onClick={() => onChange(s.value)}
            >
              {s.stardust && <span className="pf-seg-glyph"><StardustMark /></span>}
              {s.label}
            </button>
          );
        })}
      </div>
      <p className="pf-dial-help">
        {active.value === 'reimagine' && !stardustReady
          ? 'Reimagine runs on Stardust. An engineer sets it up first.'
          : active.helper}
      </p>
    </div>
  );
}
