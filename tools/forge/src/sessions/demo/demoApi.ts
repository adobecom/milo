// ── Demo API driver — the smoke-and-mirrors generation engine ──────────────────
//
// Mission: run the REAL applet and walk the REAL workflow, but fake the one slow,
// paid, fragile part — the generation request. This module is a drop-in stand-in
// for the `api` object (api.ts). When the demo flag is on (see api.ts), every
// call routes here instead of fetch()ing the page-forge server.
//
// How the timeline works WITHOUT touching the poll loop:
//   • createSession() stamps a start time and returns a 'queued' session.
//   • getSession() is called every ~2s by useActiveSessionPoll. It computes the
//     session's CURRENT state from elapsed wall-clock against the fixture's
//     compressed durations — so the page advances queued → generating → gate
//     (done, awaiting Deploy) entirely on its own.
//   • deployPrototype()/ship() stamp a deploy start time; getSession() then
//     advances deploying → done-with-live-links (Brad's real blocks).
//
// Net effect: the user clicks Generate, watches a realistic ~13s run with a live
// progress timeline + friendly activity log, lands on the section/block report,
// clicks Deploy, and gets the real ?milolibs=local preview link. No key, no
// backend, no 30-minute wait.

import type { CandidateBlock, ForgeEngine, IntentPolicy, Session } from '../types';
import type { SessionStatus } from '../types';
import type { DemoFixture } from './fixtures';
import { pickFixture, triggerForPolicy } from './fixtures';

// ── Internal run record ─────────────────────────────────────────────────────────

interface DemoRun {
  sessionId: string;
  fixture: DemoFixture;
  sourceInput: Record<string, unknown>;
  // The policy the user actually chose at entry (may differ from the fixture's
  // baked default — e.g. Figma + fidelity reuses the FIGMA shape). Drives the
  // result chip, summary verb, and candidate triggers so they match the choice.
  chosenPolicy: IntentPolicy;
  startedAt: number;
  // Set when the user clicks Deploy/Ship — drives the deploy beat.
  deployStartedAt: number | null;
}

// Resolve the effective intent/engine/candidates for a run from the CHOSEN policy
// (not the fixture's baked default), so every door+intent combination reads true.
function effective(run: DemoRun): {
  intentPolicy: IntentPolicy;
  engine: ForgeEngine;
  driftCount: number;
  candidateBlocks: CandidateBlock[];
} {
  const policy = run.chosenPolicy;
  const engine: ForgeEngine = policy === 'reimagine' ? 'stardust' : 'matcher';
  // Drift (sections restyled to fit) is a conformance-only honesty count.
  const driftCount = policy === 'conformance' ? run.fixture.driftCount : 0;
  // Re-stamp each authored block's trigger to match the chosen intent.
  const trigger = triggerForPolicy(policy);
  const candidateBlocks = run.fixture.candidateBlocks.map((b) => ({ ...b, trigger }));
  return { intentPolicy: policy, engine, driftCount, candidateBlocks };
}

const runs = new Map<string, DemoRun>();

// Hosted prototype pages (src/prototype/*.html) live next to the app, so we build
// an absolute URL from the CURRENT page origin + base path. That way "Open
// prototype" opens a real, scrollable page wherever the demo runs (vite dev on
// :5173, or the da-playground build under ?ref=local) and never a dead
// localhost:3000 tab. Pass a file like 'hub.html' or 'inside-a.html'.
function hostedHref(file: string): string {
  let base = '/tools/';
  try {
    // import.meta.env.BASE_URL is '/tools/' in this app's vite config.
    base = (import.meta.env.BASE_URL as string) || base;
  } catch {
    /* non-vite context — keep the default */
  }
  const path = `${base.replace(/\/+$/, '')}/prototype/${file}`;
  try {
    return new URL(path, window.location.origin).toString();
  } catch {
    return path;
  }
}

// "Open prototype" target for a given flow. Reimagine flows open their first
// Stardust direction; everything else opens the Hub prototype page.
function prototypeHref(flow?: string): string {
  const f = (flow || '').includes('reimagine') ? 'inside-a.html' : 'hub.html';
  return hostedHref(f);
}

// Resolve a fixture's reimagine variants (file → absolute hosted href) for the UI.
function resolveVariants(fixture: DemoFixture): Session['reimagineVariants'] {
  const vs = fixture.reimagineVariants;
  if (!vs || !vs.length) return undefined;
  return vs.map((v) => ({ id: v.id, label: v.label, note: v.note, thumb: v.thumb, href: hostedHref(v.file) }));
}

// Global demo-speed multiplier: 0.8 = 20% faster than the fixture durations.
// Applied to both the generation and deploy beats so the whole fake run is snappier.
const SPEED = 0.8;

// Demo clock. Real now(); the workflow forbids Date.now() only inside Workflow
// scripts — this is app code, so it's fine and necessary for the timeline.
function now(): number {
  return Date.now();
}

// A short, deterministic-looking id (mirrors the server's randomUUID-based ids
// closely enough for slug derivation in ActiveSession).
let seq = 0;
function makeId(): string {
  seq += 1;
  const stamp = now().toString(16);
  return `demo-${stamp}-${seq.toString().padStart(4, '0')}`;
}

// Reveal the first N friendly messages proportional to how far into the
// generation beat we are, so the activity log fills in gradually.
function messagesForProgress(lines: string[], frac: number): { text: string }[] {
  const n = Math.max(1, Math.min(lines.length, Math.ceil(lines.length * frac)));
  return lines.slice(0, n).map((text) => ({ text }));
}

// A self-contained demo page for the live-preview iframe. `frac` fades it in from a
// rough early draft to a settled page, mirroring how convergence sharpens the real
// preview round by round. Media-free (like the captured d02bd5fb fixture) so it
// renders identically with no inlined assets.
function demoPreviewHtml(frac: number): string {
  const settled = frac >= 0.6;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;font-family:"Adobe Clean",system-ui,-apple-system,sans-serif;color:#1d1d1f;background:#fff}
  .hero{padding:64px 48px;background:linear-gradient(135deg,#1473e6,#0d66d0);color:#fff}
  .hero h1{font-size:44px;margin:0 0 12px;font-weight:700;letter-spacing:-.02em}
  .hero p{font-size:20px;opacity:.92;margin:0;max-width:32ch}
  .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:48px}
  .card{border:1px solid #e6e6e6;border-radius:12px;padding:24px}
  .card h3{margin:0 0 8px;font-size:18px} .card p{color:#6e6e73;margin:0;font-size:14px;line-height:1.5}
  .cta{margin:0 48px 64px;padding:36px;background:#f5f5f7;border-radius:14px;text-align:center}
  .cta a{display:inline-block;margin-top:14px;padding:12px 28px;background:#1473e6;color:#fff;border-radius:24px;text-decoration:none;font-weight:600}
  ${settled ? '' : '.cards,.cta{opacity:.5;filter:saturate(.6)}'}
  </style></head><body>
  <section class="hero"><h1>Create with Adobe</h1><p>Everything you need to design, collaborate, and ship — on the Adobe brand.</p></section>
  <section class="cards">
    <div class="card"><h3>Design</h3><p>Bring ideas to life with powerful, intuitive tools.</p></div>
    <div class="card"><h3>Collaborate</h3><p>Work together in real time, wherever your team is.</p></div>
    <div class="card"><h3>Ship</h3><p>Publish to the web in a click, faithfully on brand.</p></div>
  </section>
  <section class="cta"><h2>Ready to start?</h2><a href="#">Get started</a></section>
  </body></html>`;
}

// ── Build a Session snapshot for the current moment ─────────────────────────────

function snapshot(run: DemoRun): Session {
  const { fixture, sessionId, sourceInput } = run;
  const base: Session = {
    sessionId,
    source: fixture.source,
    sourceInput,
    status: 'queued',
    versions: [],
    currentV: 0,
    messages: [],
  };

  // ── Deploy beat (only after the user clicks Deploy) ──────────────────────────
  if (run.deployStartedAt != null) {
    const dElapsed = now() - run.deployStartedAt;
    const dFrac = Math.min(1, dElapsed / (fixture.deployDurationMs * SPEED));

    // Generation already finished → versions + report are present throughout.
    const settled = dFrac >= 1;
    const status: SessionStatus = settled ? 'done' : 'deploying';
    const phase = settled ? 'done' : dFrac > 0.5 ? 'verify' : 'push';

    const genLines = fixture.genMessages.map((text) => ({ text }));
    const deployLines = messagesForProgress(fixture.deployMessages, dFrac).map((m) => m);

    return {
      ...base,
      status,
      phase,
      versions: fixture.versions,
      currentV: 1,
      matchReport: fixture.matchReport,
      previewImage: fixture.previewImage,
      reimagineVariants: resolveVariants(fixture),
      fidelity: settled ? fixture.fidelity : null,
      // Intent / engine / promotion framing — stamped from the CHOSEN policy.
      ...effective(run),
      // Only attach the live shipped block once fully done; mid-deploy it's empty
      // so the timeline sits on "Publishing/Going live" rather than showing links.
      shipped: settled ? fixture.shipped : {},
      totalUsage: settled ? fixture.finalUsage : undefined,
      messages: [...genLines, ...deployLines],
      lastSummary: fixture.versions[0]?.summary ?? undefined,
    };
  }

  // ── Generation beat ──────────────────────────────────────────────────────────
  const gElapsed = now() - run.startedAt;
  const gFrac = Math.min(1, gElapsed / (fixture.genDurationMs * SPEED));

  // First ~6% is "queued", then we're "generating", until the beat completes and
  // we land on the deploy gate (status 'done' but no shipped.prototypeUrl).
  if (gFrac >= 1) {
    // Deploy gate — generation done, awaiting the user's Deploy click.
    return {
      ...base,
      status: 'done',
      phase: 'gate',
      versions: fixture.versions,
      currentV: 1,
      matchReport: fixture.matchReport,
      previewImage: fixture.previewImage,
      reimagineVariants: resolveVariants(fixture),
      // Pre-publish: NO prototypeUrl (keeps the deliberate "Publish to DA" step),
      // but a daPreviewUrl IS honest here — the locked model lets you OPEN the
      // finished page as a preview before shipping. ResultCard uses it to power
      // the preview's "Open preview" action so the hover overlay isn't empty.
      shipped: { daPreviewUrl: fixture.shipped.daPreviewUrl },
      // Fidelity is measured at generation time; surface it at the gate too.
      fidelity: fixture.fidelity,
      // Intent / engine / promotion framing — stamped from the CHOSEN policy.
      ...effective(run),
      totalUsage: fixture.finalUsage,
      messages: fixture.genMessages.map((text) => ({ text })),
      lastSummary: fixture.versions[0]?.summary ?? undefined,
    };
  }

  if (gFrac < 0.06) {
    return { ...base, status: 'queued', phase: 'queued', messages: [{ text: 'Getting started…' }] };
  }

  // Mid-generation: map progress onto the server's phase vocabulary so the
  // ProgressTimeline advances Reading → Matching → Authoring.
  const phase =
    gFrac < 0.3 ? (fixture.source === 'figma' ? 'extracting' : 'fetch')
      : gFrac < 0.6 ? 'matching'
        : 'composing';

  // Live preview (MWPW-199520): once past the initial read, expose a preview that
  // "sharpens" — version bumps with progress so the pane re-fetches each poll and
  // GeneratingCard swaps the skeleton for the <iframe srcdoc>.
  const previewReady = gFrac >= 0.22;
  const preview = previewReady
    ? { ready: true, version: Math.floor((gFrac - 0.22) * 14) + 1, url: `/sessions/${sessionId}/preview`, updatedAt: now() }
    : { ready: false, version: 0, url: null, updatedAt: null };

  // Synthetic Figma-throttle window (finding [19]): gFrac in [0.30, 0.40) → the run
  // reads as 'waiting' with a live countdown, so the waiting UI is exercised in mock
  // mode without a backend. Figma-source only (the tree 429 is a Figma-path event).
  const genMs = fixture.genDurationMs * SPEED;
  if (fixture.source === 'figma' && gFrac >= 0.30 && gFrac < 0.40) {
    const until = run.startedAt + Math.round(genMs * 0.40);
    return {
      ...base,
      status: 'waiting',
      phase,
      preview,
      progress: {
        phase,
        rateLimited: {
          endpoint: 'design-tree',
          attempt: 1,
          waitMs: null,
          retryAfterS: Math.max(1, Math.ceil((until - now()) / 1000)),
          until,
        },
      },
      messages: messagesForProgress(fixture.genMessages, gFrac),
    };
  }

  return {
    ...base,
    status: 'generating',
    phase,
    preview,
    messages: messagesForProgress(fixture.genMessages, gFrac),
  };
}

// ── Public surface — mirrors the parts of `api` the UI calls ─────────────────────

export const demoApi = {
  createSession(
    body: { source: string; sourceInput: Record<string, unknown> },
  ): Promise<Session> {
    const sourceInput = body.sourceInput || {};
    const fixture = pickFixture(body.source, sourceInput);
    // The policy the user chose at entry; fall back to the fixture's default for any
    // legacy body that predates the explicit field.
    const chosenPolicy = (sourceInput.intentPolicy as IntentPolicy) || fixture.intentPolicy;
    const run: DemoRun = {
      sessionId: makeId(),
      fixture,
      sourceInput,
      chosenPolicy,
      startedAt: now(),
      deployStartedAt: null,
    };
    runs.set(run.sessionId, run);
    return Promise.resolve(snapshot(run));
  },

  getSession(sessionId: string): Promise<Session> {
    const run = runs.get(sessionId);
    if (!run) {
      const err = new Error('Session not found (demo)') as Error & { status: number };
      err.status = 404;
      return Promise.reject(err);
    }
    return Promise.resolve(snapshot(run));
  },

  // Live-preview HTML for the iframe (MWPW-199520). Varies with progress so a
  // re-fetch on version bump visibly "sharpens" — same contract as the real route.
  getSessionPreviewHtml(sessionId: string): Promise<string> {
    const run = runs.get(sessionId);
    const frac = run ? Math.min(1, (now() - run.startedAt) / (run.fixture.genDurationMs * SPEED)) : 1;
    return Promise.resolve(demoPreviewHtml(frac));
  },

  deployPrototype(sessionId: string): Promise<{ sessionId: string; currentV: number }> {
    const run = runs.get(sessionId);
    if (run && run.deployStartedAt == null) run.deployStartedAt = now();
    return Promise.resolve({ sessionId, currentV: 1 });
  },

  ship(sessionId: string): Promise<{ sessionId: string; currentV: number }> {
    const run = runs.get(sessionId);
    if (run && run.deployStartedAt == null) run.deployStartedAt = now();
    return Promise.resolve({ sessionId, currentV: 1 });
  },

  cancelSession(sessionId: string): Promise<{ ok: boolean; aborted: boolean }> {
    runs.delete(sessionId);
    return Promise.resolve({ ok: true, aborted: true });
  },

  retrySession(sessionId: string): Promise<Session> {
    const run = runs.get(sessionId);
    if (run) {
      run.startedAt = now();
      run.deployStartedAt = null;
      return Promise.resolve(snapshot(run));
    }
    const err = new Error('Session not found (demo)') as Error & { status: number };
    err.status = 404;
    return Promise.reject(err);
  },

  // "Open prototype" → open the hosted, scrollable Forge prototype page. The
  // production end state is the real ?milolibs=local page; for the demo we serve a
  // hand-coded HTML page from the app's own origin (src/prototype/hub.html, served
  // at /tools/prototype/hub.html by vite dev AND by the da-playground build), so
  // the click always opens a real page you can scroll and feel — never a dead
  // localhost:3000 tab. Origin-relative so it works wherever the demo is served.
  previewLocal(
    sessionId: string,
  ): Promise<{ ok: boolean; previewUrl: string; started?: string[] }> {
    const run = runs.get(sessionId);
    const previewUrl = prototypeHref(run?.fixture.flow);
    return Promise.resolve({ ok: true, previewUrl });
  },

  // No-ops / passthroughs for the rest of the surface the UI may touch.
  refreshToken(): Promise<unknown> {
    return Promise.resolve({ ok: true });
  },

  getMatchReport(sessionId: string): Promise<unknown> {
    const run = runs.get(sessionId);
    return Promise.resolve(run?.fixture.matchReport ?? null);
  },

  getSessionsHistory(): Promise<unknown> {
    return Promise.resolve({ entries: [] });
  },

  restoreSession(): Promise<Session> {
    const err = new Error('Restore is disabled in demo mode') as Error & { status: number };
    err.status = 400;
    return Promise.reject(err);
  },

  revealPath(): Promise<unknown> {
    return Promise.resolve({ ok: true });
  },
};

export default demoApi;
