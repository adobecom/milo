// ── InputPanel ────────────────────────────────────────────────────────────────
// The "New session" entry point: two SOURCE doors, intent chosen inside each.
//   1. An outcome PREVIEW per door (the kind of page Forge builds) — the only
//      place brand-red appears, because it depicts real page output.
//   2. Two SOURCE doors as compact rows (answer: what do you have?):
//        • Build my design (Figma frame) + a proactive Connect Figma
//        • Rebuild a page  (live URL)
//      Each door carries the INTENT DIAL (IntentDial). The Figma dial offers
//      conformance/fidelity; the URL dial adds a third stop — "Reimagine" — which
//      runs Stardust (a separate, heavier redesign engine). Reimagine lives on the
//      URL dial, NOT a third door, because Stardust crawls a live URL — it has
//      nothing to act on for a Figma frame, and a separate "paste a URL" entry
//      would just duplicate the URL door's input.
//
// HONESTY NOTES (verified against the server):
//   • "Connect Figma" promotes the EXISTING Figma OAuth (today only fired reactively
//     mid-run via FigmaReauthCard) to a proactive front-door action. There is no
//     /v1/me, no persisted identity and no disconnect endpoint yet, so the connected
//     state says "Connected to Figma" with NO name, and persists for the session only.
//     The reactive FigmaReauthCard stays the backstop.
//   • The conformance/fidelity split is PROMPT-ONLY today: the dial writes a
//     structured `intentPolicy` + a bridged legacy `intent`, but the matcher does
//     NOT yet read the policy (see IntentDial.departureIntent). Reimagine DOES route
//     to a real, different pipeline (Stardust) via the bridge's `mode:'reimagine'`.
//     Wiring conformance/fidelity into the matcher is a named backend milestone.

import { useState, useEffect } from 'react';
import { TextField, ActionButton } from '@react-spectrum/s2';
import { SOURCES } from '../sessions/types';
import type { IntentPolicy } from '../sessions/types';
import { useSessions } from '../sessions/SessionsProvider';
import { useUiState } from './UiStateContext';
import { useConfig } from '../config';

// ── Door view state ─────────────────────────────────────────────────────────
// Two SOURCE doors: 'figma' (a frame) and 'url' (a live page). Intent (including
// Reimagine-with-Stardust) is a stop on the dial INSIDE the URL door, not a third
// door — Stardust crawls a live URL, so it belongs to the URL path, not its own
// entry. The Figma door's dial offers only conformance/fidelity.
type View = 'doors' | 'figma' | 'url';

// ── Inline glyphs (kept local; the app has no icon for the Figma mark) ────────
function FigmaMark() {
  return (
    <svg viewBox="0 0 38 57" aria-hidden="true">
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

function LinkMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#565650" strokeWidth="2" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  );
}


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


// ── Connected-to-Figma status chip (neutral, green dot — NEVER blue: status, not
// action). No name/avatar: the server exposes no Figma identity.
function ConnectedChip() {
  return (
    <span className="pf-connected"><span className="pf-connected-dot" />Connected to Figma</span>
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
    blurbDisconnected: 'Point at any live page.',
    blurbConnected: 'Point at any live page.',
    label: 'Page URL',
    placeholder: 'https://example.com/page',
    prefill: 'https://inside.adobe.com',
    cta: 'Adobify this page',
  },
  // Figma door second.
  figma: {
    title: 'Figma',
    blurbDisconnected: 'Connect once, then paste a frame.',
    blurbConnected: 'Paste a frame to start.',
    label: 'Figma frame URL',
    placeholder: 'https://figma.com/design/…?node-id=…',
    prefill: 'https://www.figma.com/design/lOFnBFhsYyFWPbSdiPa9us/Hub-%E2%80%94-A.com?node-id=1-11&p=f&m=dev',
    cta: 'Build my page',
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────────

export function InputPanel() {
  const { startSession } = useSessions();
  const { dispatch: uiDispatch } = useUiState();
  const { config } = useConfig();

  const [view, setView] = useState<View>('doors');
  const [sourceInput, setSourceInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // "Connected to Figma" is derived from real config, not a local flag: if the
  // Figma token has a value, the inputs are wired, so we show connected. "Connect
  // Figma" opens a focused one-field modal where that token is entered.
  const figmaConnected = Boolean((config.figmaToken || '').trim());

  // The Figma door is gated on connection: trying to open it while unconnected
  // routes to Connect first. We remember the intent so that the moment the token
  // lands, we advance into the door automatically ("once that's done we move on").
  const [pendingFigmaOpen, setPendingFigmaOpen] = useState(false);
  useEffect(() => {
    if (figmaConnected && pendingFigmaOpen) {
      setPendingFigmaOpen(false);
      openDoor('figma');
    }
    // openDoor is stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figmaConnected, pendingFigmaOpen]);


  // The DOOR fixes the intent now (no dial — see the simplification note below):
  //   Figma frame → build on the Adobe design system (conformance).
  //   Live URL    → Reimagine with Stardust (reimagine).
  // So the policy is derived from the open door, not chosen by the user.
  const isFigma = view === 'figma';
  const intentPolicy: IntentPolicy = isFigma ? 'conformance' : 'reimagine';

  // SOURCES: figma → inputKey 'figmaUrl'; eds-url → inputKey 'url'.
  const src = SOURCES.find((s) => s.id === (isFigma ? 'figma' : 'eds-url'))!;
  const door = isFigma ? DOORS.figma : DOORS.url;

  function openDoor(next: 'figma' | 'url') {
    setView(next);
    // Prefill a real URL so the demo is one click — the presenter just hits the CTA.
    setSourceInput(DOORS[next].prefill ?? '');
    setError(null);
  }

  // The Figma door can't be entered until Figma is connected. If the user tries,
  // remember the intent and send them to Connect; the effect above advances into
  // the door once the token lands.
  function tryOpenFigma() {
    if (figmaConnected) {
      openDoor('figma');
    } else {
      setPendingFigmaOpen(true);
      uiDispatch({ type: 'openConnectFigma' });
    }
  }

  function back() {
    setView('doors');
    setSourceInput('');
    setError(null);
  }

  // Connect Figma opens a focused one-field modal (just the dev PAT), not the full
  // settings slideover. It writes the same config.figmaToken, so once saved
  // figmaConnected (above) flips to true on its own.
  function connectFigma() {
    uiDispatch({ type: 'openConnectFigma' });
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

    // The DOOR fixes the intent: Figma → conformance (design system), URL →
    // reimagine (Stardust). Forward the structured policy + the legacy `mode` the
    // server reads today (reimagine routes to Stardust; conformance is the default
    // matcher pass-through).
    body.intentPolicy = intentPolicy;
    if (intentPolicy === 'reimagine') body.mode = 'reimagine';

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
              region, NOT a <button>, so the Connect control + open chevron can be
              real sibling buttons. */}
          <div
            className="pf-door"
            role="button"
            tabIndex={0}
            aria-label="Build my design from a Figma frame"
            onClick={tryOpenFigma}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryOpenFigma(); } }}
          >
            <span className="pf-door-transform">
              <span className="pf-src-glyph pf-src-glyph--figma"><FigmaMark /></span>
              <span className="pf-flow-arrow"><FlowArrow /></span>
              <ResultThumb />
            </span>
            <span className="pf-door-copy">
              <span className="pf-door-name">{DOORS.figma.title}</span>
              <span className="pf-door-blurb">
                {figmaConnected ? DOORS.figma.blurbConnected : DOORS.figma.blurbDisconnected}
              </span>
            </span>
            <span className="pf-door-trailing" onClick={(e) => e.stopPropagation()}>
              {figmaConnected ? (
                <ConnectedChip />
              ) : (
                <ActionButton onPress={connectFigma} aria-label="Connect Figma">
                  <FigmaMark />
                  Connect Figma
                </ActionButton>
              )}
            </span>
            <button
              type="button"
              className="pf-door-go"
              aria-label="Open"
              onClick={(e) => { e.stopPropagation(); tryOpenFigma(); }}
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
              <span className="pf-door-blurb">{DOORS.url.blurbConnected}</span>
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
            {isFigma && figmaConnected && <ConnectedChip />}
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
