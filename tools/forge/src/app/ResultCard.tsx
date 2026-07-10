// ── ResultCard — preview-first result + the busy/error states ─────────────────
// The done view leads with the page (the product IS the page), a plain one-line
// summary, and a DELIBERATE, separate Publish step (blocks → Milo, content → DA).
// Engineering telemetry (cost, tokens, turns, raw fidelity) is intentionally not
// shown here — see forge_result_audience_layers. The section-by-section build
// breakdown lives in a collapsed "How we built this" disclosure (rendered by
// ActiveSession, below this card).
//
// States:
//   1. busy (running/deploying/shipping/queued) → <GeneratingCard>
//   2. error + cancelled → cancelled card
//   3. error (no versions) → figma auth card or error + retry
//   4. done + shipped.prototypeUrl → preview-first, published (live links)
//   5. done + versions, not yet published → preview-first + Publish step
//   6. pending/undefined → empty

import { useState, useRef, type ReactNode } from 'react';
import { Button, Link } from '@react-spectrum/s2';
import OpenIn from '@react-spectrum/s2/icons/OpenIn';
import Edit from '@react-spectrum/s2/icons/Edit';
import Copy from '@react-spectrum/s2/icons/Copy';
import Checkmark from '@react-spectrum/s2/icons/Checkmark';
import Add from '@react-spectrum/s2/icons/Add';
import type { Session } from '../sessions/types';
import { GeneratingCard } from './GeneratingCard';
import { FigmaReauthCard } from './FigmaReauthCard';
import { fidelityLevel } from './FidelityMeter';
import { useConfig } from '../config';
import { api } from '../sessions/api';
import { StardustMark } from './StardustMark';
import { CostLine } from './CostLine';
import { PreviewBlocks } from './PreviewBlocks';
import { ReimagineVariants } from './ReimagineVariants';
import { deriveSectionRows } from './SectionsDrawer';
import type { SectionViewRow } from './SectionsDrawer';
import { resolveIntentPolicy, isReimagine, INTENT_CHIP, INTENT_SUMMARY_VERB } from './intent';

// ── Helpers ───────────────────────────────────────────────────────────────────

function isBusy(s: Session): boolean {
  return ['queued', 'generating', 'waiting', 'refining', 'shipping', 'deploying', 'running'].includes(
    s.status,
  );
}

// A plain-language title for the page (jargon-free; no internal slugs/branches).
// The intent MODE is now carried by the chip (IntentChip), so the title keeps a
// user-meaningful direction (e.g. Reimagine's "make it feel premium and quiet")
// and strips only internal slugs — never the user's own words.
function pageTitle(s: Session): string {
  const intent = s.versions?.[0]?.intent;
  // Strip only machine directives: the variant labels and the fidelity directive
  // the dial bridge injects (it starts with "Reproduce the source design…").
  const isMachineDirective =
    intent &&
    (/^variant\s+[abc]/i.test(intent) ||
      /^redesign$/i.test(intent) ||
      /^reproduce the source design/i.test(intent));
  if (intent && !isMachineDirective) {
    return intent.slice(0, 60);
  }
  const src = (s.sourceInput || {}) as Record<string, string>;
  if (src.url) return src.url.replace(/^https?:\/\//, '').slice(0, 60);
  if (src.figmaUrl) {
    // Figma node URLs are opaque; fall back to a friendly default.
    return 'Your page';
  }
  return 'Your page';
}

// ── Intent chip — which MODE produced this page (distinct from the verdict, which
// is the run STATE). Only reimagine is colored (indigo, with the Stardust mark);
// conformance/fidelity read neutral. A label, not a control — not clickable.
function IntentChip({ session }: { session: Session }) {
  const policy = resolveIntentPolicy(session);
  const reimagine = policy === 'reimagine';
  return (
    <span className={`pf-intent-chip${reimagine ? ' pf-intent-chip--stardust' : ''}`}>
      {reimagine && <span className="pf-intent-chip-glyph"><StardustMark /></span>}
      {INTENT_CHIP[policy]}
    </span>
  );
}

// Render a summary sentence with its integer counts bolded — the numbers are the
// scannable payload ("7 sections, 4 reused, 3 new"), the prose is the frame.
function boldNumbers(text: string): ReactNode {
  // Split on standalone integers, keeping the delimiters, and bold the digits.
  return text.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? <strong key={i}>{part}</strong> : part,
  );
}

// One honest sentence about what happened — counts in prose, no tiles, no meter.
// The lead verb is mode-aware so it agrees with the IntentChip (Rebuilt / Built /
// Reimagined). The reused-vs-new clause is unchanged across modes (the load-bearing
// flywheel fact). For conformance only, the accepted-drift count is named.
function summarySentence(s: Session): string | null {
  const shipped = (s.shipped || {}) as Record<string, unknown>;
  const mr =
    (s.matchReport as Record<string, unknown> | undefined) ||
    (shipped.matchReport as Record<string, unknown> | undefined) ||
    null;
  const counters = (mr?.counters as Record<string, number> | undefined) || undefined;
  const total = counters?.totalSections;
  const reused = counters?.reusableBlocksUsed;
  const created = counters?.newBlocksCreated;

  const policy = resolveIntentPolicy(s);
  const verb = INTENT_SUMMARY_VERB[policy];

  const parts: string[] = [];
  if (typeof total === 'number' && total > 0) {
    parts.push(`${verb} ${total} section${total === 1 ? '' : 's'} on the Adobe brand.`);
  } else {
    parts.push(`${verb} your page on the Adobe brand.`);
  }
  if (typeof reused === 'number' || typeof created === 'number') {
    const r = reused ?? 0;
    const c = created ?? 0;
    const bits: string[] = [];
    if (r > 0) bits.push(`reused ${r} approved block${r === 1 ? '' : 's'}`);
    if (c > 0) bits.push(`designed ${c} new one${c === 1 ? '' : 's'}`);
    if (bits.length) parts.push(`We ${bits.join(' and ')}.`);
  }

  // Conformance only: name the accepted drift (sections restyled to fit a block).
  const drift = s.driftCount;
  if (policy === 'conformance' && typeof drift === 'number' && drift > 0) {
    parts.push(`${drift} ${drift === 1 ? 'was' : 'were'} restyled to fit.`);
  }

  // Honest match phrase only when fidelity cleared the bar — and never for a
  // redesign (a Reimagine is not supposed to match the source).
  const fidelity = s.fidelity;
  if (
    policy !== 'reimagine' &&
    fidelity?.combined != null &&
    fidelityLevel(fidelity.combined) === 'high' &&
    fidelity.presenceMeasured !== false
  ) {
    parts.push('Closely matches your design.');
  }
  return parts.join(' ');
}

// The finished-page preview: a SCROLLABLE window onto the finished page, with the
// next actions in a frosted header pinned to the TOP of the window — always
// visible (no hover gate) — see the live page, or open it in the DA editor. The
// page content scrolls beneath the translucent frosted bar.
//
// PRODUCTION PLAN: this window will hold an <iframe src={liveHref}> of the real
// live page once we have the access/CORS to embed it. Until then `image` is a
// demo-only stand-in (set ONLY by demoApi via Session.previewImage); real sessions
// leave it undefined and fall back to the generic skeleton, so the product never
// shows a canned image dressed up as a real render. Red appears here because this
// depicts real page output.
function PagePreview({
  image,
  liveHref,
  editHref,
  onView,
  viewLabel = 'View live page',
  viewPrimary = true,
  blockRows = [],
}: {
  image?: string;
  liveHref?: string;
  editHref?: string;
  onView?: () => void;
  // The primary action's label. Pre-publish it's "Open preview" (nothing is live
  // yet); post-publish it's "View live page". Kept explicit so the copy never
  // overclaims the page's state.
  viewLabel?: string;
  // Whether the view action reads as the accent (blue) primary. Pre-publish this
  // is FALSE — the ship hero owns the only accent button, so the preview's view
  // action stays neutral and the deliberate ship step wins the hierarchy.
  viewPrimary?: boolean;
  // Per-section rows for the optional "Show blocks" dot rail (reused vs new).
  blockRows?: SectionViewRow[];
}) {
  const view = () => { if (onView) onView(); else if (liveHref) window.open(liveHref, '_blank', 'noopener'); };
  const canView = Boolean(onView || liveHref);
  // The block dot rail is OFF by default — the clean page wins until asked for.
  const [showMap, setShowMap] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasMap = blockRows.length > 0;

  function seek(fraction: number) {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: fraction * el.scrollHeight, behavior: 'smooth' });
  }

  // ── Scrollable image preview + frosted header (always visible) ────────────────
  if (image) {
    return (
      <div className="pf-preview pf-preview--img">
        <div className="pf-preview-bar">
          {canView && (
            <button
              type="button"
              className={`pf-preview-act${viewPrimary ? ' pf-preview-act--primary' : ''}`}
              onClick={view}
            >
              {viewLabel} <OpenIn UNSAFE_className="pf-link-icon" />
            </button>
          )}
          {editHref && (
            <button
              type="button"
              className="pf-preview-act"
              onClick={() => window.open(editHref, '_blank', 'noopener')}
            >
              <Edit UNSAFE_className="pf-link-icon" /> Edit in DA
            </button>
          )}
          {hasMap && (
            <button
              type="button"
              className={`pf-preview-act${showMap ? ' pf-preview-act--on' : ''}`}
              aria-pressed={showMap}
              onClick={() => setShowMap((v) => !v)}
            >
              {showMap ? 'Hide blocks' : 'Show blocks'}
            </button>
          )}
        </div>
        <div className="pf-preview-scroll" ref={scrollRef} tabIndex={0} aria-label="Preview of your finished page — scroll to see more">
          {showMap && <PreviewBlocks rows={blockRows} onSeek={seek} />}
          <img src={image} alt="Your finished page" loading="lazy" />
        </div>
      </div>
    );
  }

  // ── Fallback: generic skeleton (no screenshot yet) ────────────────────────────
  return (
    <div
      className="pf-preview"
      role={canView ? 'button' : undefined}
      tabIndex={canView ? 0 : undefined}
      onClick={() => { if (canView) view(); }}
      onKeyDown={(e) => { if (canView && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); view(); } }}
    >
      {canView && (
        <span className="pf-preview-open">
          Open live preview <OpenIn UNSAFE_className="pf-link-icon" />
        </span>
      )}
      <div className="pf-pv-hero">
        <span className="pf-pv-eyebrow" /><span className="pf-pv-htitle" /><span className="pf-pv-hsub" />
      </div>
      <div className="pf-pv-body">
        {[0, 1, 2].map((i) => (
          <div key={i} className="pf-pv-card">
            <span className="pf-pv-thumb" /><span className="pf-pv-line" /><span className="pf-pv-line pf-pv-line--s" />
          </div>
        ))}
        <span className="pf-pv-cta" />
      </div>
    </div>
  );
}

// A shorter "what happened" line for the in-Authoring state.
function summaryLive(s: Session): string {
  const shipped = (s.shipped || {}) as Record<string, unknown>;
  const mr =
    (s.matchReport as Record<string, unknown> | undefined) ||
    (shipped.matchReport as Record<string, unknown> | undefined) ||
    null;
  const counters = (mr?.counters as Record<string, number> | undefined) || undefined;
  const total = counters?.totalSections;
  const reused = counters?.reusableBlocksUsed;
  const created = counters?.newBlocksCreated;
  const lead = isReimagine(s) ? 'Reimagined on the Adobe brand.' : 'Rebuilt on the Adobe brand.';
  const parts: string[] = [lead];
  if (typeof total === 'number' && total > 0) {
    const bits: string[] = [];
    if (typeof reused === 'number' && reused > 0) bits.push(`${reused} reused approved block${reused === 1 ? '' : 's'}`);
    if (typeof created === 'number' && created > 0) bits.push(`${created} new one${created === 1 ? '' : 's'}`);
    parts.push(bits.length ? `${total} sections, ${bits.join(' and ')}.` : `${total} sections.`);
  }
  return parts.join(' ');
}

// ── "For engineering" handoff — only shown AFTER publish, when the Milo branch +
// new blocks actually exist. Its own quiet section (not a headline, not hidden).
// Creator-facing telemetry (cost/tokens/turns) stays OUT — this is the real,
// useful handoff: what shipped and where.
function EngHandoff({ shipped }: { shipped: Record<string, unknown> }) {
  const blocks = (shipped.miloBlocks as string[] | undefined) || [];
  const branchName = shipped.branchName as string | undefined;
  const branchUrl = shipped.branchUrl as string | undefined;
  if (!blocks.length && !branchName) return null;
  return (
    <div className="pf-eng">
      <div className="pf-eng-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
        For engineering
      </div>
      {blocks.length > 0 && (
        <div className="pf-eng-row">
          <span className="pf-eng-k">New blocks</span>
          <span className="pf-eng-v pf-eng-blocks">
            {blocks.map((b) => <span key={b} className="pf-eng-chip">{b}</span>)}
          </span>
        </div>
      )}
      {branchName && (
        <div className="pf-eng-row">
          <span className="pf-eng-k">Milo branch</span>
          <span className="pf-eng-v"><code>{branchName}</code></span>
        </div>
      )}
      {branchUrl && (
        <div className="pf-eng-row">
          <span className="pf-eng-k" />
          <Link href={branchUrl} target="_blank" rel="noopener" UNSAFE_className="pf-eng-link">
            Open the branch on GitHub <OpenIn UNSAFE_className="pf-link-icon" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Quiet pencil glyph for the Refine control.
function RefineGlyph() {
  return <Edit UNSAFE_className="pf-refine-icon" aria-hidden />;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ResultCardProps {
  session: Session;
  onDeploy: () => Promise<void>;
  onCancel: () => Promise<void>;
  onRetry: () => Promise<void>;
  onRefine?: () => void;
  // Start a fresh page (clears the active session → entry screen). Powers the
  // post-publish "Build another page" next-action.
  onNewPage?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ResultCard({ session, onDeploy, onCancel, onRetry, onRefine, onNewPage }: ResultCardProps) {
  const { config } = useConfig();
  const debug = config.debugMode === true;
  const serverUrl = (config.serverUrl || 'http://localhost:8080').replace(/\/+$/, '');
  const [deploying, setDeploying] = useState(false);
  const [preppingPreview, setPreppingPreview] = useState(false);
  const [previewErr, setPreviewErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reimagine runs carry several Stardust directions. Track which one is the active
  // preview; default to the first. The strip lets the presenter swap + open each.
  const variants = session.reimagineVariants ?? [];
  const [activeVariantId, setActiveVariantId] = useState<string | undefined>(variants[0]?.id);
  const activeVariant = variants.find((v) => v.id === activeVariantId) ?? variants[0];

  // Copy the shareable live URL to the clipboard (the genuinely-new capability
  // publishing unlocks — a link a PM can paste to a stakeholder).
  async function copyShareLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the link is still selectable in the field */
    }
  }

  // Stand up (or re-prop) the local render stack and open the ?milolibs=local
  // preview. Idempotent server-side — safe to re-press after switching sessions.
  async function handlePreviewLocal() {
    // Reimagine: open the ACTIVE Stardust direction's real hosted page directly.
    if (activeVariant?.href) {
      window.open(activeVariant.href, '_blank', 'noopener');
      return;
    }
    setPreppingPreview(true);
    setPreviewErr(null);
    try {
      const r = await api.previewLocal(session.sessionId, serverUrl, config);
      if (r?.previewUrl) window.open(r.previewUrl, '_blank', 'noopener');
    } catch (e) {
      setPreviewErr(e instanceof Error ? e.message : String(e));
    } finally {
      setPreppingPreview(false);
    }
  }

  const busy = isBusy(session);
  const figmaAuthUrl = (session as Session & { figmaAuthUrl?: string }).figmaAuthUrl;

  // ── State 1: busy ───────────────────────────────────────────────────────────
  // GeneratingCard owns its full two-column layout — render it directly, NOT
  // inside the old .pf-result-card--gen (whose overflow:hidden + flex column
  // clipped the build skeleton and squeezed the copy).
  if (busy) {
    return (
      <div className="pf-gen2-wrap">
        {figmaAuthUrl && (
          <FigmaReauthCard figmaAuthUrl={figmaAuthUrl} busy={true} onRetry={onRetry} />
        )}
        <GeneratingCard session={session} onCancel={onCancel} serverUrl={serverUrl} />
      </div>
    );
  }

  // ── State 2: cancelled ──────────────────────────────────────────────────────
  const isCancelled =
    session.phase === 'cancelled' || /cancelled/i.test(session.error || '');
  if (session.status === 'error' && isCancelled && (session.versions?.length ?? 0) === 0) {
    return (
      <div className="pf-state2 pf-state2--stopped">
        <span className="pf-state2-glyph" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="7" width="10" height="10" rx="1.5" /></svg>
        </span>
        <h2 className="pf-state2-title">Run stopped</h2>
        <p className="pf-state2-msg">You stopped this run. Start it again whenever you&apos;re ready.</p>
        <div className="pf-state2-actions">
          <Button variant="primary" onPress={onRetry}>Start again</Button>
        </div>
      </div>
    );
  }

  // ── State 3: error (no versions) ────────────────────────────────────────────
  if (session.status === 'error' && (session.versions?.length ?? 0) === 0) {
    if (figmaAuthUrl) {
      return (
        <div className="pf-result-card pf-result-card--gen">
          <FigmaReauthCard figmaAuthUrl={figmaAuthUrl} busy={false} onRetry={onRetry} />
        </div>
      );
    }
    const rawErr = session.error || 'Something went wrong.';
    const errMsg = /already running/i.test(rawErr)
      ? 'One generation at a time — another run is still in progress. Wait for it to finish, then try again.'
      : rawErr;
    return (
      <div className="pf-state2 pf-state2--error">
        <span className="pf-state2-glyph" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
        </span>
        <h2 className="pf-state2-title">Something went wrong</h2>
        <p className="pf-state2-msg">{errMsg}</p>
        <div className="pf-state2-actions">
          <Button variant="primary" onPress={onRetry}>Try again</Button>
        </div>
      </div>
    );
  }

  // ── Done: shared preview-first scaffold ───────────────────────────────────────
  const basename = session.figmaFilePath ? session.figmaFilePath.split('/').pop() : null;
  const staticUrl = basename ? `${serverUrl}/figma-exports/${basename}` : null;
  const shipped = session.shipped as Record<string, unknown> | undefined;
  const title = pageTitle(session);
  const summary = summarySentence(session);
  // Per-section rows for the optional "Show blocks" dot rail. Derived from the
  // match report; empty → no rail.
  const matchReportForRows =
    (session.matchReport as Record<string, unknown> | undefined) ||
    (shipped?.matchReport as Record<string, unknown> | undefined) ||
    null;
  const blockRows: SectionViewRow[] = matchReportForRows
    ? deriveSectionRows(matchReportForRows as Parameters<typeof deriveSectionRows>[0])
    : [];
  // The pre-publish "open the finished page as a preview" target (nothing shipped
  // yet). Prefer a static Figma export when present; else the DA preview URL the
  // server/stub provides. Powers both the "Open my page" button and the preview
  // overlay so neither is a dead control when there's no figma export.
  const previewHref =
    staticUrl || (shipped?.daPreviewUrl as string | undefined) || undefined;

  // ── State 4: published — live, shareable, with a "what now" loop ──────────────
  if (shipped?.prototypeUrl) {
    const milolibsHref =
      (shipped.milolibsUrl as string | undefined) ||
      (shipped.remotePreviewUrl as string | undefined) ||
      String(shipped.prototypeUrl);
    // The shareable URL is the real published domain (remotePreviewUrl, a
    // *.aem.page link), NOT the localhost preview — this is what a PM sends to a
    // stakeholder. Only surface the Share row when a true remote URL exists.
    const shareHref = shipped.remotePreviewUrl as string | undefined;

    return (
      <div className="pf-result2">
        <div className="pf-result2-top">
          <div>
            {/* The verdict reads as an EVENT — the page just landed in DA as a
                draft (NOT live; you publish from DA). The intent chip names the
                mode that produced it. */}
            <span className="pf-verdict-row">
              <span className="pf-verdict pf-verdict--live">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>
                In Authoring, ready to edit
              </span>
              <IntentChip session={session} />
            </span>
            <h2 className="pf-result2-title">{title}</h2>
          </div>
        </div>

        {variants.length > 0 && activeVariant ? (
          /* Reimagine, sent: the chosen direction is locked in; the others grey out
             so it's clear which one went to Authoring. */
          <ReimagineVariants
            variants={variants}
            lockedId={activeVariant.id}
          />
        ) : (
          /* The preview's frosty header is the single home for "view" + "edit". */
          <PagePreview
            image={session.previewImage}
            liveHref={milolibsHref}
            editHref={shipped.daUrl ? String(shipped.daUrl) : undefined}
            onView={handlePreviewLocal}
            viewLabel={preppingPreview ? 'Opening…' : 'Open prototype'}
            blockRows={blockRows}
          />
        )}

        <p className="pf-result2-summary">{boldNumbers(summaryLive(session))}</p>
        <CostLine session={session} />

        {/* One grouped "what now" panel — share the live page, then the next
            move. Tight within the group, a hairline between the two beats, so it
            reads as a single tidy unit instead of scattered fragments. The share
            link only appears for a real remote URL (a localhost preview isn't
            shareable). The next-actions row is always present (the loop matters
            even when there's nothing to share yet). */}
        <div className="pf-finish">
          {shareHref && (
            <div className="pf-finish-share">
              <div className="pf-finish-share-head">
                <span className="pf-finish-label">Authoring link · share with anyone</span>
                <button
                  type="button"
                  className="pf-btn-secondary pf-copy-btn"
                  onClick={() => copyShareLink(shareHref)}
                >
                  {copied ? <Checkmark /> : <Copy />} {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
              <a className="pf-finish-link" href={shareHref} target="_blank" rel="noopener">
                {shareHref.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {(onRefine || onNewPage) && (
            <div className="pf-finish-next">
              {onRefine && (
                <button type="button" className="pf-next-act" onClick={onRefine}>
                  <RefineGlyph /> Refine this page
                </button>
              )}
              {onNewPage && (
                <button type="button" className="pf-next-act" onClick={onNewPage}>
                  <Add UNSAFE_className="pf-next-icon" /> Build another page
                </button>
              )}
            </div>
          )}
        </div>

        {/* The engineering handoff is real ONLY post-publish, and is hidden from
            creators — engineers reveal it via Settings → Developer → Debug mode. */}
        {debug && <EngHandoff shipped={shipped} />}

        {previewErr && (
          <div className="pf-result-hint pf-result-hint--warn">
            Local preview couldn’t start: {previewErr}. Ensure MILO_PATH + the consumer
            repo are configured, then try again.
          </div>
        )}
      </div>
    );
  }

  // ── State 5: generated, awaiting publish (the deliberate ship step) ───────────
  if (session.versions && session.versions.length > 0) {
    async function handleDeploy() {
      setDeploying(true);
      try { await onDeploy(); } finally { setDeploying(false); }
    }

    return (
      <div className="pf-result2">
        <div className="pf-result2-top">
          <div>
            <span className="pf-verdict-row">
              <span className="pf-verdict pf-verdict--gate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M20 6L9 17l-5-5" /></svg>
                Built, ready to send
              </span>
              <IntentChip session={session} />
            </span>
            <h2 className="pf-result2-title">{title}</h2>
          </div>
          {/* Only Refine lives up here — "Open preview" lives on the preview's
              frosty header so the same action never appears twice. */}
          {onRefine && (
            <div className="pf-result2-actions">
              <Button variant="secondary" onPress={onRefine}>
                <RefineGlyph /> Refine
              </Button>
            </div>
          )}
        </div>

        {variants.length > 0 && activeVariant ? (
          /* Reimagine: no single preview — show the directions and Send the one you
             choose. Each card opens its real hosted page; Send sends THAT view. */
          <>
            <ReimagineVariants
              variants={variants}
              onSend={(v) => { setActiveVariantId(v.id); void handleDeploy(); }}
              sendingId={deploying ? activeVariant.id : null}
            />
            <CostLine session={session} />
          </>
        ) : (
          <>
            {/* The deliberate, separate ship step — a HERO banner directly under
                the verdict so the next action is unmissable. Sends the page to DA
                as an editable draft (you publish from DA later); NOT a live publish. */}
            <div className="pf-publish-hero">
              <div className="pf-publish-hero-copy">
                <div className="pf-publish-hero-title">Send to Authoring</div>
                <div className="pf-publish-hero-desc">Opens as an editable draft in DA.</div>
              </div>
              <button
                type="button"
                className="pf-btn-primary pf-btn-publish"
                onClick={handleDeploy}
                disabled={deploying}
              >
                {deploying ? 'Sending…' : 'Send to Authoring'}
              </button>
            </div>

            <PagePreview
              image={session.previewImage}
              viewLabel={preppingPreview ? 'Opening…' : 'Open prototype'}
              onView={handlePreviewLocal}
              liveHref={previewHref}
              viewPrimary={false}
              blockRows={blockRows}
            />

            {summary && <p className="pf-result2-summary">{boldNumbers(summary)}</p>}
            <CostLine session={session} />
          </>
        )}
      </div>
    );
  }

  // ── State 6: pending/empty ────────────────────────────────────────────────────
  return <div className="pf-result-card pf-result-card--empty" />;
}
