// ── GeneratingCard — the calm, long-wait generating view ──────────────────────
// A real run can take up to ~30 minutes, so this is tuned for a long, uncertain
// wait: a phase headline carries the sense of progress (NOT a seconds clock, NOT
// a determinate "almost done" bar), an indeterminate quiet progress sweep, honest
// reassuring copy, and a generic monochrome page that assembles on the right.
// (No big 6-step stepper — it was decoration and not a Spectrum standard.)

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Session } from '../sessions/types';
import { deriveTimeline } from './ProgressTimeline';
import { isReimagine } from './intent';
import { pickActivityDetail } from './activityText';
import { ActivityLog } from './ActivityLog';
import api from '../sessions/api';

// ── Phase → calm copy ─────────────────────────────────────────────────────────
// We reuse deriveTimeline (the existing phase→step mapping) so this stays in sync
// with whatever the server emits, then map the step to human, jargon-free copy.
const STEP_COPY: Array<{ head: string; sub: string; label: string }> = [
  { head: 'Getting started', sub: 'Preparing your session.', label: 'Getting started' },
  { head: 'Reading your design', sub: 'Forge is studying the layout and content before it starts rebuilding.', label: 'Reading your design' },
  { head: 'Matching to approved blocks', sub: 'Finding Milo blocks that already fit your design, and flagging the parts that need something new.', label: 'Matching blocks' },
  { head: 'Building your page', sub: 'Laying out your sections from approved blocks, and designing new ones where they are needed.', label: 'Building your page' },
  { head: 'Sending to Authoring', sub: 'Getting your page ready in DA.', label: 'Sending to Authoring' },
  { head: 'Bringing it together', sub: 'Assembling your page and getting it ready to preview.', label: 'Almost ready' },
];

// Reimagine speaks Stardust, not matcher: it's a redesign, not a block-match. Same
// step indices as STEP_COPY (so the skeleton + progress stay in sync), reworded to
// reflect the magic — reading, then reimagining, then exploring directions.
const REIMAGINE_COPY: Array<{ head: string; sub: string; label: string }> = [
  { head: 'Getting started', sub: 'Preparing your session.', label: 'Getting started' },
  { head: 'Reading the page', sub: 'Stardust is studying the layout, content, and brand of the live page.', label: 'Reading the page' },
  { head: 'Reimagining on our brand', sub: 'Rethinking the page from the ground up, on the Adobe brand.', label: 'Reimagining' },
  { head: 'Exploring directions', sub: 'Designing several distinct takes so you can choose the one that fits.', label: 'Exploring directions' },
  { head: 'Sending to Authoring', sub: 'Getting your redesign ready in DA.', label: 'Sending to Authoring' },
  { head: 'Bringing it together', sub: 'Assembling the directions and getting them ready to preview.', label: 'Almost ready' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface GeneratingCardProps {
  session: Session;
  onCancel: () => Promise<void>;
  // Needed to fetch the live-preview HTML (GET /sessions/:id/preview). Optional so
  // demo/mock callers can omit it — without it the card falls back to the skeleton.
  serverUrl?: string;
}

// ── Building-page skeleton ──────────────────────────────────────────────────────
// Generic + monochrome on purpose: it conveys "your page is being built" without
// implying a specific number of reused vs new blocks (a real design could have
// 10+ of either). Reveal advances with the phase step. Red appears only in the
// finished result, never in this skeleton.
function BuildSkeleton({ step }: { step: number }) {
  const heroIn = step >= 1;
  const bandIn = step >= 3;
  const row1In = step >= 3;
  const row2In = step >= 4;
  const ctaIn = step >= 5;
  // Settle (turn from grey placeholder to "finished" surface) one step after reveal.
  const settled = step >= 5;

  return (
    <div className="pf-build">
      <div className="pf-build-chrome">
        <i /><i /><i /><span className="pf-build-bar" />
      </div>
      <div className="pf-build-page">
        <div className={`pf-blk pf-b-hero${heroIn ? ' pf-blk--in pf-b-hero--lit' : ''}`}>
          <span className="pf-b-eyebrow" />
          <span className="pf-b-ln pf-b-ln--t" />
          <span className="pf-b-ln" />
        </div>
        <div className={`pf-blk pf-b-band${bandIn ? ' pf-blk--in' : ''}${settled ? ' pf-b-band--settled' : ''}`} />
        <div className={`pf-blk pf-b-row pf-b-row--2up${row1In ? ' pf-blk--in' : ''}`}>
          {[0, 1].map((i) => (
            <div key={i} className={`pf-b-card${settled ? ' pf-b-card--settled' : ''}`}>
              <span className="pf-b-th" /><span className="pf-b-ln" /><span className="pf-b-ln pf-b-ln--s" />
            </div>
          ))}
        </div>
        <div className={`pf-blk pf-b-row${row2In ? ' pf-blk--in' : ''}`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={`pf-b-card${settled ? ' pf-b-card--settled' : ''}`}>
              <span className="pf-b-th" /><span className="pf-b-ln" /><span className="pf-b-ln pf-b-ln--s" />
            </div>
          ))}
        </div>
        <div className={`pf-blk pf-b-cta${ctaIn ? ' pf-blk--in' : ''}${settled ? ' pf-b-cta--settled' : ''}`} />
      </div>
    </div>
  );
}

// ── Section wireframe (V4 — Tier-1) ───────────────────────────────────────────
// The moment the server reads SECTION_COUNT (long before the first draft paints —
// minutes, on a pathological design), we can show REAL structure: one equal-height
// tile per top-level section. Every top-level section is full-bleed (x=0,
// w=CANVAS_WIDTH), so we deliberately drop x/width and lay them out as a vertical
// stack. As sections fill (progress.itemsDone) the tiles settle top-down and the
// current one is labeled — so the wireframe itself conveys "the screen is filling"
// before the iframe takes over with the named skeleton (a seamless N-tile → N-tile
// handoff). Independent of the read completing — this worked even on the run that
// stalled. Absurd counts are capped so the pane never degenerates into slivers.
function SectionWireframe({ count, done, currentItem }: { count: number; done: number; currentItem: string | null }) {
  const n = Math.min(Math.max(count, 1), 24);
  return (
    <div className="pf-build pf-wire">
      <div className="pf-build-chrome"><i /><i /><i /><span className="pf-build-bar" /></div>
      <div className="pf-wire-page">
        {Array.from({ length: n }).map((_, i) => {
          const settled = i < done;
          const current = i === done && i < count;
          const cls = `pf-wire-tile${settled ? ' pf-wire-tile--settled' : ''}${current ? ' pf-wire-tile--current' : ''}`;
          return (
            <div key={i} className={cls}>
              {current && currentItem ? <span className="pf-wire-label">{currentItem}</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reading scan (pre-count liveness) ─────────────────────────────────────────
// The gap Track V's wireframe/live preview don't cover: the FIRST ~1–2 min of a
// read, where the agent is drilling metadata to find the real page frame — no
// SECTION_COUNT yet, no first paint yet. Before this, that window fell through to
// the static BuildSkeleton (one dark rectangle that never moves — read as "stuck",
// the exact "nothing is happening" complaint). This makes the read pane ALIVE from
// second one: a scanning beam sweeps top→bottom over neutral tiles that breathe,
// conveying "reading your design". It is deliberately count-AGNOSTIC (a generic
// tile stack styled EXACTLY like the wireframe) so the handoff when SECTION_COUNT
// lands is calm: the OUTER frame stays put (identical chrome + 440px min-height),
// only the interior recounts from these 5 generic tiles into the real N (the beam
// pops out, the tiles resize) — a settle, not a layout jump. Honest: it loops
// forever and never implies completion or fabricates specific sections. Zero Figma calls.
function ReadingScan() {
  return (
    <div className="pf-build pf-wire pf-scan">
      <div className="pf-build-chrome"><i /><i /><i /><span className="pf-build-bar" /></div>
      <div className="pf-wire-page">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="pf-wire-tile pf-scan-tile" style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
      <span className="pf-scan-beam" aria-hidden />
    </div>
  );
}

// ── Live preview (MWPW-199520) ────────────────────────────────────────────────
// The in-progress page rendered in a SANDBOXED iframe. srcdoc (not src) so the
// Bearer-authenticated HTML never needs a subresource fetch — the server inlines
// all media as data: URIs. sandbox="allow-scripts" WITHOUT allow-same-origin: the
// body is single-agent LLM output assembled from externally-supplied Figma text,
// so it's treated as untrusted and denied DOM/same-origin access to the parent.
// Expand-to-fullscreen: the in-grid pane is only ~half the width, so the live page
// is cramped. An expand control pops the SAME srcDoc into a near-fullscreen overlay
// (portal on document.body) so the design can be inspected large; Esc or a
// backdrop click closes it. Ban-safe: still srcDoc, no network fetch — just a
// second iframe over the same in-memory HTML, mounted only while expanded.
function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function LiveFrame({ html, label }: { html: string; label: string }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  return (
    <div className="pf-live">
      <div className="pf-live-bar">
        <span className="pf-live-dot" aria-hidden />
        {label}
        <button
          type="button"
          className="pf-live-expand"
          onClick={() => setExpanded(true)}
          aria-label="Expand preview to fullscreen"
          title="Expand preview"
        >
          <ExpandIcon />
        </button>
      </div>
      <div className="pf-live-scroll">
        <iframe
          className="pf-live-frame"
          title="Live preview of your page as it is being built"
          srcDoc={html}
          sandbox="allow-scripts"
          loading="lazy"
        />
      </div>
      {expanded && createPortal(
        <div
          className="pf-live-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded live preview"
          onClick={() => setExpanded(false)}
        >
          <div className="pf-live-overlay-card" onClick={(e) => e.stopPropagation()}>
            <div className="pf-live-bar">
              <span className="pf-live-dot" aria-hidden />
              {label}
              <button
                type="button"
                className="pf-live-expand"
                onClick={() => setExpanded(false)}
                aria-label="Close expanded preview"
                title="Close (Esc)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="pf-live-scroll">
              <iframe
                className="pf-live-frame"
                title="Expanded live preview of your page"
                srcDoc={html}
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

// ── Rate-limit countdown (MWPW-199520 — visible waiting) ──────────────────────
// A KNOWN, bounded wait (server sends a Retry-After-derived `until`), so unlike the
// long uncertain run this DOES show a live seconds countdown — a deliberate scoped
// exception, confined to the waiting state. Ticks locally each second toward `until`.
function WaitingNote({ rl }: { rl: NonNullable<Session['progress']>['rateLimited'] }) {
  const until = rl?.until ?? null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [until]);
  const secs = until ? Math.max(0, Math.ceil((until - now) / 1000)) : null;
  return (
    <div className="pf-gen2-time pf-gen2-wait" role="status">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
      {secs != null && secs > 0
        ? `Figma is rate-limiting us — retrying in ${secs}s. Your work is safe.`
        : 'Figma is rate-limiting us — retrying now…'}
    </div>
  );
}

// ── Visible-body gate (V1) ────────────────────────────────────────────────────
// Belt-and-suspenders against a BLANK white iframe. The extract agent's very first
// progressive draft used to be a comment-only skeleton (<section><!-- Hero:
// building… --></section> ×N) → a white frame = the "nothing for 20 minutes"
// complaint. The server now refuses to flip preview.ready on such a draft
// (hasVisiblePreviewBody in extract.js), and V2 makes the first paint a NAMED
// skeleton; this is the last line of defense so the iframe never replaces the grey
// BuildSkeleton until there is something a human can actually see. Mirrors the
// server-side helper — keep the two in sync.
export function hasVisibleBody(html: string | null | undefined): boolean {
  if (!html) return false;
  const stripped = html
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  if (/<img\b|<svg\b/i.test(stripped)) return true;
  const visibleText = stripped.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return visibleText.length >= 8;
}

// ── Live reading detail (V3) ──────────────────────────────────────────────────
// A friendly, updating one-liner that makes the long read feel ALIVE. Prefers the
// DETERMINISTIC section-fill signal the server derives from the draft ("Building
// section 3 of 9…"); before any section count is known it falls back to the newest
// non-noise agent line (pickActivityDetail — previously dead code). Returns null
// when there's nothing honest to say, so the caller can hide the row.
export function readingDetail(session: Session): string | null {
  const p = session.progress;
  const total = p?.itemsTotal ?? null;
  if (total && total > 0) {
    const done = p?.itemsDone ?? 0;
    if (done <= 0) return `Found ${total} section${total === 1 ? '' : 's'} — laying out the page…`;
    if (done >= total) return `All ${total} sections drafted — sharpening…`;
    const cur = p?.currentItem ? `: ${p.currentItem}` : '';
    return `Building section ${Math.min(done + 1, total)} of ${total}${cur}…`;
  }
  return pickActivityDetail(session.messages);
}

// ── Stall heartbeat (V5) ──────────────────────────────────────────────────────
// A stuck tool loop looks identical to steady work — the indeterminate sweep keeps
// sweeping. So we watch every meaningful progress signal and measure how long since
// ANY of them last changed. When nothing has advanced for a while we swap the calm
// "usually takes a few minutes" copy for an honest nudge, so the UI never implies
// forward motion the agent isn't making. Elapsed is measured on the CLIENT clock
// relative to the last observed change, so server/client clock skew is irrelevant
// (server timestamps are used only to detect that a change happened, never subtracted).
function useStallSeconds(session: Session): number {
  const signature = [
    session.status,
    session.phase,
    session.progress?.updatedAt ?? 0,
    session.progress?.itemsDone ?? -1,
    session.progress?.turn ?? -1,
    session.preview?.version ?? 0,
    session.messages?.length ?? 0,
  ].join('|');
  const lastChange = useRef<{ sig: string; at: number }>({ sig: signature, at: Date.now() });
  const [now, setNow] = useState(() => Date.now());
  if (lastChange.current.sig !== signature) {
    lastChange.current = { sig: signature, at: Date.now() };
  }
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return Math.max(0, Math.floor((now - lastChange.current.at) / 1000));
}

// Gentle nudge past ~60s of no progress; a firmer (still calm) line past ~3min.
// 60s (not 45s) because a single legitimate get_design_context on a large design
// can run ~30–60s with no intermediate signal — we don't want to cry "stalled"
// during honest slow work, only when it's genuinely gone quiet.
const STALL_NUDGE_S = 60;
const STALL_LONG_S = 180;

// ── Component ─────────────────────────────────────────────────────────────────

export function GeneratingCard({ session, onCancel, serverUrl }: GeneratingCardProps) {
  const { stepIdx } = deriveTimeline(session);
  // When Stardust is running (Reimagine), use the redesign-voiced copy + engine
  // attribution; otherwise the matcher-voiced copy.
  const reimagine = isReimagine(session);
  const table = reimagine ? REIMAGINE_COPY : STEP_COPY;
  const copy = table[Math.max(0, Math.min(table.length - 1, stepIdx))];

  // Live preview: re-fetch the HTML whenever the server bumps preview.version, so
  // the pane sharpens round by round. On a transient/404 (not ready yet) we keep
  // the last good frame rather than flashing back to the skeleton.
  const previewReady = Boolean(session.preview?.ready);
  const previewVersion = session.preview?.version ?? 0;
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  useEffect(() => {
    if (!previewReady || !serverUrl) return undefined;
    let cancelled = false;
    api.getSessionPreviewHtml(session.sessionId, serverUrl)
      .then((h) => { if (!cancelled) setPreviewHtml(h); })
      .catch(() => { /* transient / 404 — keep the last frame */ });
    return () => { cancelled = true; };
  }, [session.sessionId, serverUrl, previewReady, previewVersion]);

  const rl = session.progress?.rateLimited || null;
  const waiting = session.status === 'waiting' || Boolean(rl);
  // V5: seconds since any meaningful progress signal last advanced.
  const stallSeconds = useStallSeconds(session);
  const stalled = !waiting && stallSeconds >= STALL_NUDGE_S;
  // V3: the live, friendly reading line shown on the MAIN view (visual stays primary).
  const detail = readingDetail(session);
  // The raw per-line read log lives here as SECONDARY info, folded into a compact
  // "Progress details" disclosure in the LEFT column (under the copy/actions) —
  // where the textual detail belongs — rather than a full-width strip below the
  // card that competes with the preview.
  const logLines = (session.messages || []).map((m) => m.text || String(m));
  // V1: require a NON-TRIVIAL VISIBLE body before the iframe replaces the grey
  // skeleton, so a comment-only / near-empty early draft can never blank the screen.
  const showLive = previewReady && Boolean(previewHtml) && hasVisibleBody(previewHtml);
  // During a Stardust redesign the preview pointer is frozen at the faithful v1
  // (the redesign builds a separate version and does not re-snapshot), so label the
  // frame honestly instead of implying it's the live redesign "sharpening".
  const redesigning = session.phase === 'redesign' || session.status === 'refining';
  // Early frames come from the extract agent's progressive drafts (rough by design —
  // MWPW-199520): the page paints top-down while Forge is still READING the Figma
  // (step 1). Only in that reading step do we set the "rough at first" expectation;
  // by step 2 (matching) the preview is the full bespoke, and convergence "sharpens".
  const buildingEarly = !redesigning && stepIdx <= 1;
  // V4: once SECTION_COUNT is known (during the read, before the first draft paints),
  // show a real N-tile wireframe instead of the generic monochrome skeleton. Confined
  // to the reading step so later phases keep the familiar skeleton fallback.
  const sectionCount = session.progress?.itemsTotal ?? 0;
  const showWireframe = !showLive && !redesigning && stepIdx <= 1 && sectionCount > 0;
  // Before the count is known (the metadata drill-down that opens every read), keep
  // the read pane ALIVE with the scanning visual instead of the static skeleton, so
  // "reading your design" never looks stuck. Covers the queued + reading steps
  // (stepIdx<=1); matching/building keep the familiar BuildSkeleton. Suppressed while
  // waiting: during a rate-limit pause a sweeping "reading" beam would contradict the
  // paused copy, so we fall back to the static skeleton. Hands off to the wireframe
  // the instant SECTION_COUNT lands.
  const showScanning = !showLive && !showWireframe && !redesigning && !waiting && stepIdx <= 1;
  const liveLabel = redesigning
    ? 'Faithful baseline — redesigning on top…'
    : buildingEarly
      ? 'Building live — rough at first, sharpens as Forge works'
      : 'Live preview — sharpening as Forge refines your page';

  return (
    <div className="pf-gen2">
      <div className="pf-gen2-left">
        <div className={`pf-gen2-eyebrow${reimagine ? ' pf-gen2-eyebrow--stardust' : ''}`}>
          <span className="pf-gen2-orb" aria-hidden />
          {reimagine ? 'Stardust is redesigning your page' : 'Forging your page'}
        </div>
        <h2 className="pf-gen2-head">{waiting ? 'Waiting on Figma' : copy.head}</h2>
        <p className="pf-gen2-sub">
          {waiting
            ? 'Figma limited how fast we can read your design. We’ll continue automatically.'
            : copy.sub}
        </p>

        <div className="pf-gen2-prog" role="progressbar" aria-label={copy.label}>
          <div className="pf-gen2-prog-track"><div className="pf-gen2-prog-sweep" /></div>
          <div className="pf-gen2-prog-label">{copy.label}</div>
        </div>

        {!waiting && detail && (
          <div className="pf-gen2-detail" role="status" aria-live="polite">{detail}</div>
        )}

        {waiting ? (
          <WaitingNote rl={rl} />
        ) : (
          <div className={`pf-gen2-time${stalled ? ' pf-gen2-stall' : ''}`} role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
            {!stalled
              ? 'This usually takes a few minutes. A full redesign can take longer.'
              : stallSeconds >= STALL_LONG_S
                ? 'This design is taking unusually long to read. Your session is safe — you can keep waiting, or cancel and try a smaller frame.'
                : 'Still reading a large design — this one is taking a while. Your work is safe and we’re still on it.'}
          </div>
        )}

        <div className="pf-gen2-actions">
          <button type="button" className="pf-btn-cancel2" onClick={onCancel}>Cancel</button>
          <span className="pf-gen2-leave">Leave this open and come back. We&apos;ll keep working.</span>
        </div>

        {logLines.length > 0 && (
          <div className="pf-gen2-log">
            <ActivityLog
              sessionId={session.sessionId}
              logLines={logLines}
              title="Progress details"
              key={`gen-${session.sessionId}`}
            />
          </div>
        )}
      </div>

      {showLive ? (
        <LiveFrame html={previewHtml as string} label={liveLabel} />
      ) : showWireframe ? (
        <SectionWireframe
          count={sectionCount}
          done={session.progress?.itemsDone ?? 0}
          currentItem={session.progress?.currentItem ?? null}
        />
      ) : showScanning ? (
        <ReadingScan />
      ) : (
        <BuildSkeleton step={stepIdx} />
      )}
    </div>
  );
}
