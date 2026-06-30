// ── SectionsDrawer — the per-section detail behind the composition bar ────────
// The build report leads with a single proportion bar (reused vs newly designed)
// that scales to any number of sections without breaking. The full per-section
// list lives here, in a slide-over opened by "View all N sections". Each row:
//   • a green check (reused — matched an existing block) or a plus (newly
//     designed — created new). Both are positive actions; neither reads as
//     pass/fail (a check-vs-cross would wrongly imply "new = failed").
//   • the real Milo block name.
//   • match confidence (how sure we were a section fit an existing block), shown
//     only where it exists — newly designed sections had no match, so no score.

import { useEffect } from 'react';
import Close from '@react-spectrum/s2/icons/Close';
import type { SectionTableResult } from './SectionTable';

export interface SectionViewRow {
  index: number;
  kind: 'reused' | 'new';
  label: string;
  block: string | null;
  confidencePct: number | null;
}

// Derive the per-section rows from the raw report data (decision vocabulary +
// the generated-block-name map). Mirrors SectionTable.deriveAction, collapsed to
// the two honest outcomes a creator cares about: reused vs newly designed.
export function deriveSectionRows(result: SectionTableResult): SectionViewRow[] {
  const sections = Array.isArray(result.sections) ? result.sections : [];
  const generated: Record<number, string> = {};
  if (Array.isArray(result.newBlockTasks)) {
    for (const t of result.newBlockTasks) {
      if (t && t.index != null && t.blockName) generated[t.index] = t.blockName;
    }
  }

  return sections.map((sec, i) => {
    const idx = sec.index ?? i + 1;
    const d = sec.decision || '';
    const isReused = d === 'tight-variant' || d === 'tight' || d === 'loose-variant' || d === 'loose';
    const restyled = d === 'loose-variant' || d === 'loose';
    const genName = idx != null ? generated[idx] : undefined;

    if (isReused) {
      const variants =
        Array.isArray(sec.variantClasses) && sec.variantClasses.length
          ? ` (${sec.variantClasses.join(', ')})`
          : '';
      return {
        index: idx,
        kind: 'reused',
        label: restyled ? 'Reused, restyled' : 'Reused',
        block: sec.block ? `${sec.block}${variants}` : null,
        confidencePct: typeof sec.score === 'number' ? Math.round(sec.score * 100) : null,
      };
    }

    // Newly designed (a new block was authored) or no-match kept-original.
    return {
      index: idx,
      kind: 'new',
      label: genName ? 'Newly designed' : 'Kept your original design',
      block: genName || null,
      confidencePct: null,
    };
  });
}

function Mark({ kind }: { kind: 'reused' | 'new' }) {
  return (
    <span className={`pf-drow-ic pf-drow-ic--${kind}`}>
      {kind === 'reused' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </span>
  );
}

interface SectionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rows: SectionViewRow[];
  reusedCount: number;
  newCount: number;
}

export function SectionsDrawer({ isOpen, onClose, rows, reusedCount, newCount }: SectionsDrawerProps) {
  // Close on Escape while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`pf-drawer-scrim${isOpen ? ' pf-drawer-scrim--open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`pf-drawer${isOpen ? ' pf-drawer--open' : ''}`}
        aria-label="All sections"
        aria-hidden={!isOpen}
      >
        <div className="pf-drawer-head">
          <div>
            <h3 className="pf-drawer-title">All sections</h3>
            <p className="pf-drawer-sub">
              {rows.length} section{rows.length === 1 ? '' : 's'} · {reusedCount} reused · {newCount} newly designed
            </p>
          </div>
          <button className="pf-drawer-close" type="button" onClick={onClose} aria-label="Close">
            <Close />
          </button>
        </div>

        <div className="pf-drawer-body">
          {rows.map((r) => (
            <div className="pf-drow" key={r.index}>
              <span className="pf-drow-n">{r.index}</span>
              <span className="pf-drow-mid">
                <span className={`pf-drow-act pf-drow-act--${r.kind}`}>
                  <Mark kind={r.kind} />
                  {r.label}
                </span>
                {r.block && <div className="pf-drow-blk">{r.block}</div>}
              </span>
              <span className={`pf-drow-conf${r.confidencePct == null ? ' pf-drow-conf--none' : ''}`}>
                {r.confidencePct == null ? '—' : `${r.confidencePct}%`}
              </span>
            </div>
          ))}
        </div>

        <p className="pf-drawer-note">
          Match confidence is how sure we were that a section fit an existing block. Newly
          designed sections had no match, so there is no score.
        </p>
      </aside>
    </>
  );
}
