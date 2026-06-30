// ── GeneratingCard — the calm, long-wait generating view ──────────────────────
// A real run can take up to ~30 minutes, so this is tuned for a long, uncertain
// wait: a phase headline carries the sense of progress (NOT a seconds clock, NOT
// a determinate "almost done" bar), an indeterminate quiet progress sweep, honest
// reassuring copy, and a generic monochrome page that assembles on the right.
// (No big 6-step stepper — it was decoration and not a Spectrum standard.)

import type { Session } from '../sessions/types';
import { deriveTimeline } from './ProgressTimeline';
import { isReimagine } from './intent';

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

// ── Component ─────────────────────────────────────────────────────────────────

export function GeneratingCard({ session, onCancel }: GeneratingCardProps) {
  const { stepIdx } = deriveTimeline(session);
  // When Stardust is running (Reimagine), use the redesign-voiced copy + engine
  // attribution; otherwise the matcher-voiced copy.
  const reimagine = isReimagine(session);
  const table = reimagine ? REIMAGINE_COPY : STEP_COPY;
  const copy = table[Math.max(0, Math.min(table.length - 1, stepIdx))];

  return (
    <div className="pf-gen2">
      <div className="pf-gen2-left">
        <div className={`pf-gen2-eyebrow${reimagine ? ' pf-gen2-eyebrow--stardust' : ''}`}>
          <span className="pf-gen2-orb" aria-hidden />
          {reimagine ? 'Stardust is redesigning your page' : 'Forging your page'}
        </div>
        <h2 className="pf-gen2-head">{copy.head}</h2>
        <p className="pf-gen2-sub">{copy.sub}</p>

        <div className="pf-gen2-prog" role="progressbar" aria-label={copy.label}>
          <div className="pf-gen2-prog-track"><div className="pf-gen2-prog-sweep" /></div>
          <div className="pf-gen2-prog-label">{copy.label}</div>
        </div>

        <div className="pf-gen2-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
          </svg>
          This usually takes a few minutes. A full redesign can take longer.
        </div>

        <div className="pf-gen2-actions">
          <button type="button" className="pf-btn-cancel2" onClick={onCancel}>Cancel</button>
          <span className="pf-gen2-leave">Leave this open and come back. We&apos;ll keep working.</span>
        </div>
      </div>

      <BuildSkeleton step={stepIdx} />
    </div>
  );
}
