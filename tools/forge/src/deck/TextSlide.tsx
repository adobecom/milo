// ── TextSlide — a proper Adobe-style title/close slide (THROWAWAY) ────────────
// A thin wrapper over SlideCard: the white 16:9 Adobe card with a centered caption
// below the headline. Used for the text-only slides (title + close).

import type { ReactNode } from 'react';
import { SlideCard } from './SlideCard';

interface TextSlideProps {
  eyebrow?: string;
  title?: string;
  caption?: ReactNode;
  index: number; // 0-based
  total: number;
}

export function TextSlide({ eyebrow, title, caption, index, total }: TextSlideProps) {
  return (
    <SlideCard eyebrow={eyebrow} title={title} index={index} total={total} variant="text">
      {caption && <p className="pf-tslide-caption">{caption}</p>}
    </SlideCard>
  );
}
