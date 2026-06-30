// ── SlideCard — the white Adobe slide card shell (THROWAWAY) ──────────────────
// The reusable corporate-deck card: a white 16:9 card on the dark stage, the Adobe
// icon top-left, a red accent rule, an Adobe Clean headline, a footer with the
// slide number, and (text variant only) a faint icon watermark. Body content is
// passed as children, so both the text slides (caption) and the flywheel slide
// (a viz) wear the same chrome.

import type { ReactNode } from 'react';
import { AdobeGlyph } from './AdobeMark';

interface SlideCardProps {
  eyebrow?: string;
  title?: string;
  caption?: ReactNode;
  index: number; // 0-based
  total: number;
  // 'text' centers a short caption; 'viz' gives the body full width for a diagram
  // and drops the watermark (the viz is the focus).
  variant?: 'text' | 'viz';
  children?: ReactNode;
}

export function SlideCard({ eyebrow, title, caption, index, total, variant = 'text', children }: SlideCardProps) {
  return (
    <div className={`pf-tslide pf-tslide--${variant}`}>
      {/* Top-left: the Adobe icon glyph, the corporate signature. */}
      <div className="pf-tslide-brand">
        <AdobeGlyph className="pf-tslide-icon" />
      </div>

      {/* Faint icon watermark (text slides only), bleeding off the lower-right. */}
      {variant === 'text' && <AdobeGlyph className="pf-tslide-watermark" />}

      {/* Body. Text slides stack everything in one centered column. Viz slides
          split into two columns: the heading copy on the LEFT, the diagram on the
          RIGHT, so the viz never collides with the title or footer padding. */}
      {variant === 'viz' ? (
        <div className="pf-tslide-body pf-tslide-body--split">
          <div className="pf-tslide-col-text">
            <span className="pf-tslide-rule" aria-hidden />
            {eyebrow && <div className="pf-tslide-eyebrow">{eyebrow}</div>}
            {title && <h1 className="pf-tslide-title">{title}</h1>}
            {caption && <p className="pf-tslide-caption">{caption}</p>}
          </div>
          <div className="pf-tslide-col-viz">{children}</div>
        </div>
      ) : (
        <div className="pf-tslide-body">
          <span className="pf-tslide-rule" aria-hidden />
          {eyebrow && <div className="pf-tslide-eyebrow">{eyebrow}</div>}
          {title && <h1 className="pf-tslide-title">{title}</h1>}
          {caption && <p className="pf-tslide-caption">{caption}</p>}
          {children}
        </div>
      )}

      {/* Footer rule + meta: deck name left, slide number right. */}
      <div className="pf-tslide-foot">
        <span className="pf-tslide-foot-name">Project Forge</span>
        <span className="pf-tslide-foot-num">{index + 1} / {total}</span>
      </div>
    </div>
  );
}
