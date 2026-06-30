// ── PreviewBlocks — the section dot rail over the result preview ──────────────
// A right-side dot rail (one dot per section) pinned over the scrollable preview,
// so a designer can see WHICH blocks were reused vs newly authored and jump to each.
// Reused = green; new = the same grey used for "newly designed" everywhere. Hover a
// dot for the block name; click to scroll the preview to that section.
//
// HONESTY: the preview is a STATIC screenshot today, so click-to-jump scrolls to an
// even proportional offset — a section MAP, not pixel-accurate DOM registration.
// When the preview is a live iframe, the same rail binds to real element offsets.

import type { SectionViewRow } from './SectionsDrawer';

interface PreviewBlocksProps {
  rows: SectionViewRow[];
  // Scroll the preview to a fractional position (0–1) when a dot is clicked.
  onSeek?: (fraction: number) => void;
}

export function PreviewBlocks({ rows, onSeek }: PreviewBlocksProps) {
  if (!rows.length) return null;
  const n = rows.length;

  return (
    <div className="pf-pvb-rail" role="list" aria-label="Section map">
      {rows.map((r, i) => (
        <button
          key={r.index}
          type="button"
          role="listitem"
          className={`pf-pvb-dot pf-pvb-dot--${r.kind}`}
          aria-label={`Section ${r.index}: ${r.kind === 'reused' ? 'reused' : 'newly designed'}${r.block ? `, ${r.block}` : ''}`}
          onClick={() => onSeek?.(i / n)}
        >
          <span className="pf-pvb-dot-tip">
            {r.kind === 'reused' ? 'Reused' : 'New'}
            {r.block ? ` · ${r.block}` : ''}
          </span>
        </button>
      ))}
    </div>
  );
}
