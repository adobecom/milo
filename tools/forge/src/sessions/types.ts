// ── Source / Status enums ─────────────────────────────────────────────────────

export type ForgeSource = 'figma' | 'url' | 'html';

// ── Intent / engine model (the locked product definition) ─────────────────────
// The intent the run was asked to honor. The 2-stop dial on the source doors
// writes only 'conformance' | 'fidelity'; 'reimagine' is written ONLY by the
// Reimagine/Stardust lane (the dial cannot reach it).
//
// HONESTY: this is PROMPT-ONLY today. The server's matcher does NOT read it
// (runBlockAwareConversion accepts `intent` and never reads the policy). The UI
// uses intentPolicy strictly as a LABEL for what the run asked for — never as
// proof the backend enforced it. Wiring it into the matcher is a backend
// milestone (see forge_product_definition_v1 §"What MUST be true").
export type IntentPolicy = 'conformance' | 'fidelity' | 'reimagine';

// Which generation engine produced the page. 'stardust' (the engineer-gated
// redesign engine) co-occurs ONLY with intentPolicy 'reimagine'; everything else
// is 'matcher'. Attribution of which pipeline ran — REAL today.
export type ForgeEngine = 'matcher' | 'stardust';

// Why a newly-authored block is a promotion candidate. ROADMAP framing: the
// promotion lane that would act on these does NOT exist yet — these are honest
// eligibility labels, not a built mechanism.
//   • 'coverage-gap' — authored under conformance (a human wanted reuse, nothing
//      fit) → the strongest candidate.
//   • 'bespoke-oneoff' — authored under fidelity → a one-off for this page.
//   • 'reimagine'     — authored by Stardust → novel but assumption-driven → the
//      weakest candidate.
export type CandidateTrigger = 'coverage-gap' | 'bespoke-oneoff' | 'reimagine';

// Where a candidate sits in the (UNBUILT) promotion lifecycle. Only 'shipped' is
// real today; the rest are ROADMAP and render with the Roadmap honesty pill.
export type PromotionStatus = 'shipped' | 'candidate' | 'in-review' | 'promoted' | 'declined';

export type SessionStatus =
  | 'pending'
  | 'queued'
  | 'generating'
  | 'refining'
  | 'running'
  | 'deploying'
  | 'shipping'
  | 'done'
  | 'error'
  | 'paused'
  | 'cancelled';

// ── Structural types ──────────────────────────────────────────────────────────

// One responsive frame. The server validates `figmaUrl` per breakpoint (it 400s
// on a missing/invalid one) and reads `width` + `label` for the viewport rows.
export interface BreakpointDef {
  label: string;
  width: number;
  figmaUrl: string;
}

export interface SessionVersion {
  v: number;
  intent?: string | null;
  basedOnV?: number | null;
  producedAt?: string;
  html?: string | null;
  summary?: string | null;
  usage?: unknown;
  // The intent the run asked for + which engine produced it. Optional: real
  // sessions that predate this field leave it undefined, and the UI derives a
  // best-effort label (see app/intent.ts::resolveIntentPolicy).
  intentPolicy?: IntentPolicy;
  engine?: ForgeEngine;
}

export interface SessionMessage {
  text: string;
}

// ── Usage (the cost a creator now sees) ───────────────────────────────────────
// Shape of session.totalUsage / shipped.deployUsage. All fields optional — a real
// session with no usage data degrades to "—" (never a faked 0). Cost is the only
// field shown to creators; turns/tokens stay debug-only (see app/CostLine.tsx).
export interface ForgeUsage {
  durationMs?: number | null;
  costUsd?: number | null;
  numTurns?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
}

// ── Promotion lifecycle (mostly ROADMAP) ──────────────────────────────────────
// One newly-authored block as it would move through the (UNBUILT) promotion lane.
// Only `shipped` + the block name/trigger are REAL today; recurrence/status beyond
// 'shipped'/'candidate' is roadmap framing rendered with the Roadmap honesty pill.
export interface CandidateBlock {
  // The real forge-* block name authored this run (REAL artifact).
  blockName: string;
  // Why it's eligible for promotion (honest label, not a built trigger).
  trigger: CandidateTrigger;
  // How many runs have authored this shape. ROADMAP — there is no recurrence
  // tracker in code; demo fixtures seed it to illustrate the thesis ranking.
  recurrenceCount?: number;
  // Where it sits in the lifecycle. Defaults to 'candidate' for new blocks;
  // 'shipped' is the only REAL state.
  status?: PromotionStatus;
}

// A demo-only ledger row for the standing Design system view: a block somewhere in
// the promotion lifecycle, across runs. ENTIRELY a UI illustration of the roadmap —
// never sent to or read from the server.
export interface PromotionLedgerEntry {
  blockName: string;
  trigger: CandidateTrigger;
  recurrenceCount: number;
  status: PromotionStatus;
  // Friendly, path-free note about where it came from (e.g. "from the Hub run").
  origin?: string;
}

// ── Render-diff fidelity (the-new-plan §4.2 item 8) ───────────────────────────
// The honest measure of how faithfully the shipped page reproduces the source,
// produced by visual convergence (server: figma/convergence.js). All scalars are
// 0–1. `combined` is a MISMATCH ratio (0 = perfect, 1 = nothing matched), so a
// fidelity score is `1 - combined`. `textPresence` is a PRESENCE ratio (1 = every
// expected text node rendered). `pixelMismatch` is the non-text pixel diff ratio.
// `presenceMeasured` is false when there were no spec text nodes to grade against
// — when false, textPresence is a sentinel (1) and must be shown as unmeasured.
//
// NOTE: as of this writing the server does NOT yet attach these as structured
// fields on the session — the convergence scalars live only in the version
// `summary` string + an on-disk summary.json. These fields are therefore OPTIONAL
// and the UI renders "—" / "not yet measured" when absent. See pendingLiveE2E.
export interface RenderFidelity {
  combined?: number | null;
  textPresence?: number | null;
  pixelMismatch?: number | null;
  presenceMeasured?: boolean | null;
}

export interface Session {
  // Server uses 'sessionId' as the primary key
  sessionId: string;
  // Kept for backward compatibility with history entries
  id?: string;
  status: SessionStatus;
  source: ForgeSource;
  sourceInput?: Record<string, unknown>;
  versions: SessionVersion[];
  currentV?: number;
  phase?: string;
  lastSummary?: string;
  shipped?: Record<string, unknown>;
  totalUsage?: unknown;
  error?: string;
  messages?: SessionMessage[];
  matchReport?: unknown;
  deployReport?: unknown;
  figmaFilePath?: string | null;
  // Render-diff fidelity — optional; absent until the server wires it through.
  fidelity?: RenderFidelity | null;
  // A finished-page screenshot for the result preview. Demo-only today (the stub
  // sets it from a fixture image); real sessions leave it undefined and fall back
  // to the generic skeleton until the server surfaces a real screenshot.
  previewImage?: string;
  // Reimagine explores multiple design directions from one input. When present
  // (demo reimagine runs), the result shows a strip of variant thumbnails; clicking
  // one previews it and can open the real hosted prototype page. Each carries a
  // thumbnail (data URI), a resolved hosted-page href, and a label/note.
  reimagineVariants?: Array<{ id: string; label: string; note: string; thumb: string; href: string }>;
  // ── Intent / engine / promotion (optional — real sessions degrade to "—") ────
  // The intent the run was asked for + which engine produced it. A LABEL, not a
  // matcher signal (see IntentPolicy above). On real sessions the UI falls back to
  // resolveIntentPolicy(), which best-effort derives it from sourceInput.
  intentPolicy?: IntentPolicy;
  engine?: ForgeEngine;
  // How many sections were restyled to fit an approved block (accepted drift).
  // Conformance-only honest count; ROADMAP to compute server-side, demo-seeded.
  driftCount?: number;
  // Newly-authored blocks framed as promotion candidates. `shipped` is REAL; the
  // candidate framing is ROADMAP (see CandidateBlock). Absent → no new blocks.
  candidateBlocks?: CandidateBlock[];
}

export interface HistoryEntryVersion {
  v: number;
  intent?: string | null;
  basedOnV?: number | null;
  producedAt?: string;
  html?: string | null;
  summary?: string | null;
  usage?: unknown;
}

export interface HistoryEntry {
  sessionId: string;
  // Kept for backward compatibility
  id?: string;
  source: ForgeSource;
  label?: string;
  input?: string;
  status: SessionStatus;
  // Carried so a cancelled run (status:'error' + phase:'cancelled') reads as
  // "Stopped", not "Needs review", in the sidebar + breadcrumb. See sessionStatus.
  phase?: string;
  ts: number;
  versionCount?: number;
  currentV?: number;
  versions?: HistoryEntryVersion[];
  shipped?: Record<string, unknown>;
  messagesTail?: Array<{ text: string }>;
  matchReportSummary?: unknown;
  figmaFilePath?: string | null;
}

export interface DaState {
  context: { org: string; repo: string; ref?: string; path?: string } | null;
  token: string;
  username: string;
}

// ── Constants (ported from vanilla page-forge.js) ─────────────────────────────

export const POLL_INTERVAL_MS = 2000;
export const MAX_HISTORY = 30;
export const MAX_HTML_IN_HISTORY_BYTES = 500 * 1024;
export const TOKEN_REFRESH_EVERY_N_TICKS = 30;
export const DEFAULT_SERVER_URL = 'http://localhost:8080';
export const STORAGE_KEY_HISTORY = 'page-forge:history';
export const STORAGE_KEY_RUNS = 'page-forge:runs';

export const DEFAULT_BREAKPOINTS: BreakpointDef[] = [
  { label: 'Desktop', width: 1440, figmaUrl: '' },
  { label: 'Tablet', width: 768, figmaUrl: '' },
  { label: 'Mobile', width: 390, figmaUrl: '' },
];

export interface SourceDef {
  id: ForgeSource | 'eds-url';
  label: string;
  inputKey: string;
  placeholder: string;
  hint: string;
}

export const SOURCES: SourceDef[] = [
  {
    id: 'figma',
    label: 'Figma',
    inputKey: 'figmaUrl',
    placeholder: 'https://www.figma.com/design/<file>/...?node-id=...',
    hint: 'Paste a Figma frame URL. The Forge extract agent renders it to standalone HTML (this is the slow path — 2–5 min).',
  },
  {
    id: 'eds-url',
    label: 'URL',
    inputKey: 'url',
    placeholder: 'https://example.com/page  or  https://main--<site>--<org>.aem.live/<page>',
    hint: 'Paste any live page URL — EDS, adobe.com, competitor site, anything. Fetched headlessly, then rebuilt from approved Milo blocks.',
  },
];
