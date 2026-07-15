// ── InputPanel ────────────────────────────────────────────────────────────────
// The "New session" entry point: two SOURCE doors, intent FIXED BY THE DOOR (no
// dial — see MWPW-200668; the old IntentDial was retired because it rendered
// nowhere).
//   1. An outcome PREVIEW per door (the kind of page Forge builds) — the only
//      place brand-red appears, because it depicts real page output.
//   2. Two SOURCE doors as compact rows (answer: what do you have?):
//        • Figma frame → intent 'conformance' (build on the Adobe design system)
//        • Live URL    → intent 'reimagine'   (Stardust redesign, a heavier engine)
//      The open door ALONE determines the policy (doorIntentPolicy / buildEntryIntent
//      in ./intent) — the user does not pick it. There is no third "Reimagine" door:
//      Reimagine is simply what the URL door does, because Stardust crawls a live
//      URL and has nothing to act on for a Figma frame.
//   3. The Figma door additionally shows the EFFORT control (quick ↔ refine harder)
//      → the server's convergence round budget. The URL/Reimagine door runs
//      Stardust (no round budget), so effort is not shown or sent there.
//
// HONESTY NOTES (verified against the server):
//   • Figma OAuth is entirely server-side (milo-logs-deploy) — the door opens
//     straight to the frame input. If a run's OAuth session expires mid-run, the
//     server attaches figmaAuthUrl and ResultCard renders the reactive
//     FigmaReauthCard to send the user to sign in.
//   • intentPolicy is PROMPT-ONLY today: the matcher does NOT read it. Only
//     'reimagine' actually switches engines, via the legacy `mode:'reimagine'` the
//     server reads (→ Stardust). 'conformance' is a display label over the default
//     matcher pass-through. Wiring the policy into the matcher is a backend milestone.

import { useState } from 'react';
import { TextField } from '@react-spectrum/s2';
import { SOURCES } from '../sessions/types';
import type { IntentPolicy } from '../sessions/types';
import { buildEntryIntent, doorIntentPolicy } from './intent';
import { useSessions } from '../sessions/SessionsProvider';
import { FigmaMark, LinkMark } from './glyphs';

// ── Door view state ─────────────────────────────────────────────────────────
// Two SOURCE doors: 'figma' (a frame) and 'url' (a live page). The open door FIXES
// the intent (Figma → conformance, URL → reimagine-with-Stardust) — there is no
// dial and no third door. Reimagine belongs to the URL path because Stardust
// crawls a live URL and has nothing to act on for a Figma frame.
type View = 'doors' | 'figma' | 'url';

// ── Generation effort (Figma door only) ───────────────────────────────────────
// A single "quick pass ↔ refine harder" control (MWPW-200016). It maps to the
// server's convergence round budget (sourceInput.effort → resolveMaxRounds):
// quick=1 (the fast, passable first pass — the default), balanced=3, thorough=5.
// Effort ONLY affects the Figma → convergence path; the URL/Reimagine door runs
// Stardust, which has no round budget, so the control is not shown there.
type Effort = 'quick' | 'balanced' | 'thorough';
// V6: the hints describe how much REFINEMENT happens after the read — NOT overall
// speed. Effort only trims convergence rounds; the (long) Figma read takes the same
// time at every setting, so "Quick" must not read as "faster to first result".
const EFFORT_OPTIONS: ReadonlyArray<{ id: Effort; label: string; hint: string }> = [
  { id: 'quick', label: 'Quick pass', hint: 'Fewer refine rounds' },
  { id: 'balanced', label: 'Balanced', hint: 'A few refine rounds' },
  { id: 'thorough', label: 'Refine harder', hint: 'Chase the frame closely' },
];

// FigmaMark/LinkMark moved to ./glyphs (shared with the welcome tour).
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

function FlowArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

// A finished-page thumbnail (the "after"). Brand-red appears here because this
// depicts real Adobe-page output. Shown per-door so each door reads as a
// transformation (source → finished page), not a tile.
function ResultThumb() {
  return (
    <span className="pf-result" aria-hidden="true">
      <span className="pf-result-hero"><span className="pf-result-eyebrow" /></span>
      <span className="pf-result-body">
        {[0, 1, 2].map((i) => (
          <span key={i} className="pf-result-card"><span /><span /></span>
        ))}
        <span className="pf-result-cta" />
      </span>
    </span>
  );
}


// ── Per-door copy ─────────────────────────────────────────────────────────────
// Two doors, each with ONE fixed outcome (no dial). Copy stays terse and
// frictionless: title + one input, nothing else. The demo prefills a real URL so
// the presenter just clicks the CTA.
const DOORS = {
  // Stardust door first (top). Generic workflow name; the input is the whole UI.
  url: {
    title: 'Stardust',
    blurb: 'Point at any live page.',
    label: 'Page URL',
    placeholder: 'https://example.com/page',
    prefill: 'https://inside.adobe.com',
    cta: 'Adobify this page',
  },
  // Figma door second.
  figma: {
    title: 'Figma',
    blurb: 'Paste a frame to start.',
    label: 'Figma frame URL',
    placeholder: 'https://figma.com/design/…?node-id=…',
    prefill: 'https://www.figma.com/design/lOFnBFhsYyFWPbSdiPa9us/Hub-%E2%80%94-A.com?node-id=1-11&p=f&m=dev',
    cta: 'Build my page',
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function InputPanel() {
  const { startSession } = useSessions();

  const [view, setView] = useState<View>('doors');
  const [sourceInput, setSourceInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fast-passable default (MWPW-200016): the machine produces a quick first pass;
  // the designer chooses to push harder. Figma door only (see Effort above).
  const [effort, setEffort] = useState<Effort>('quick');

  // The DOOR fixes the intent (no dial — MWPW-200668):
  //   Figma frame → build on the Adobe design system (conformance).
  //   Live URL    → Reimagine with Stardust (reimagine).
  // So the policy is derived from the open door, not chosen by the user.
  const isFigma = view === 'figma';
  const intentPolicy: IntentPolicy = doorIntentPolicy(isFigma ? 'figma' : 'url');

  // SOURCES: figma → inputKey 'figmaUrl'; eds-url → inputKey 'url'.
  const src = SOURCES.find((s) => s.id === (isFigma ? 'figma' : 'eds-url'))!;
  const door = isFigma ? DOORS.figma : DOORS.url;

  function openDoor(next: 'figma' | 'url') {
    setView(next);
    // Prefill a real URL so the demo is one click — the presenter just hits the CTA.
    setSourceInput(DOORS[next].prefill ?? '');
    setError(null);
  }

  function back() {
    setView('doors');
    setSourceInput('');
    setError(null);
  }

  async function handleSubmit() {
    setError(null);
    const val = sourceInput.trim();
    if (!val) {
      setError(`${door.label} is required`);
      return;
    }

    const body: Record<string, unknown> = {};
    body[src.inputKey] = val;

    // The DOOR fixes the intent — Figma → conformance, URL → reimagine (Stardust).
    // buildEntryIntent returns the structured policy, the legacy `mode` the server
    // reads today (reimagine only), and the Figma-only effort budget. (MWPW-200668)
    Object.assign(body, buildEntryIntent(isFigma ? 'figma' : 'url', effort));

    setIsSubmitting(true);
    try {
      await startSession({ source: src.id, sourceInput: body });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Doors view (default) ────────────────────────────────────────────────────
  if (view === 'doors') {
    return (
      <div className="pf-entry">
        <h2 className="pf-entry-title">You get a real Adobe page, ready to edit.</h2>
        <p className="pf-entry-sub">
          Start from a Figma frame or a live page. You choose how closely to follow it next.
        </p>

        <p className="pf-start-label">What are you starting from?</p>

        <div className="pf-doors">
          {/* Figma door FIRST (Flow 1, CPro → DA — Audumber's framing). Clickable
              region, NOT a <button>, so the open chevron can be a real sibling
              button. */}
          <div
            className="pf-door"
            role="button"
            tabIndex={0}
            aria-label="Build my design from a Figma frame"
            onClick={() => openDoor('figma')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor('figma'); } }}
          >
            <span className="pf-door-transform">
              <span className="pf-src-glyph pf-src-glyph--figma"><FigmaMark /></span>
              <span className="pf-flow-arrow"><FlowArrow /></span>
              <ResultThumb />
            </span>
            <span className="pf-door-copy">
              <span className="pf-door-name">{DOORS.figma.title}</span>
              <span className="pf-door-blurb">{DOORS.figma.blurb}</span>
            </span>
            <span className="pf-door-trailing" />
            <button
              type="button"
              className="pf-door-go"
              aria-label="Open"
              onClick={(e) => { e.stopPropagation(); openDoor('figma'); }}
            >
              <Chevron />
            </button>
          </div>

          {/* Stardust door SECOND (Flow 2): Adobify a live page. */}
          <div
            className="pf-door"
            role="button"
            tabIndex={0}
            aria-label="Adobify a live page"
            onClick={() => openDoor('url')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor('url'); } }}
          >
            <span className="pf-door-transform">
              <span className="pf-src-glyph pf-src-glyph--url"><LinkMark /></span>
              <span className="pf-flow-arrow"><FlowArrow /></span>
              <ResultThumb />
            </span>
            <span className="pf-door-copy">
              <span className="pf-door-name">{DOORS.url.title}</span>
              <span className="pf-door-blurb">{DOORS.url.blurb}</span>
            </span>
            <span className="pf-door-trailing" />
            <button
              type="button"
              className="pf-door-go"
              aria-label="Open"
              onClick={(e) => { e.stopPropagation(); openDoor('url'); }}
            >
              <Chevron />
            </button>
          </div>
        </div>

        <div className="pf-converge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Both land on the same thing: a real, on-brand Milo page you can edit and ship.
        </div>
      </div>
    );
  }

  // ── Focused input view (a door is open) ──────────────────────────────────────
  return (
    <div className="pf-entry">
      <div className="pf-focus-card">
        <button type="button" className="pf-back-btn" onClick={back}>
          <BackArrow />
          Back
        </button>

        {/* Frictionless: header, one input, one button — a single consistent
            vertical rhythm (the .pf-focus-body gap), nothing else. The door fixed
            the outcome and the URL is prefilled, so the only move is the CTA. */}
        <div className="pf-focus-body">
          <div className="pf-focus-head">
            <span className={`pf-src-glyph pf-src-glyph--${view}`}>
              {isFigma ? <FigmaMark /> : <LinkMark />}
            </span>
            <h3 className="pf-focus-title">{door.title}</h3>
          </div>

          <TextField
            label={door.label}
            value={sourceInput}
            onChange={setSourceInput}
            placeholder={door.placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            UNSAFE_style={{ width: '100%' }}
          />

          {error && <div className="pf-form-error">{error}</div>}

          {/* Generation effort — Figma door only (MWPW-200016). A single
              quick↔harder control, not a fine dial. Maps to the convergence
              round budget on the server; the URL/Reimagine door has none. */}
          {isFigma && (
            <div className="pf-effort" role="group" aria-label="How hard to refine the first pass">
              <span className="pf-effort-label">Effort</span>
              <div className="pf-effort-seg">
                {EFFORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`pf-effort-opt${effort === opt.id ? ' is-active' : ''}`}
                    aria-pressed={effort === opt.id}
                    title={opt.hint}
                    onClick={() => setEffort(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* The proven custom filled button — the S2 <Button> chrome gets stripped
              by the app's global button reset. Reimagine gets the gradient. */}
          <div className="pf-focus-actions">
            <button
              type="button"
              className={`pf-btn-primary pf-entry-cta${intentPolicy === 'reimagine' ? ' pf-btn-gradient' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Starting…' : intentPolicy === 'reimagine' ? 'Reimagine this page' : door.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
