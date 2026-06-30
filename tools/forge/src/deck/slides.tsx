// ── slides — the leadership deck arc (THROWAWAY) ──────────────────────────────
// Exec audience: minimal text, mostly showing. The "stage" slides embed the REAL
// product (LiveStage) — the presenter drives it live, on the stubbed compressed
// clock, so doors click, the page builds through every stage, and the result is
// the genuine UI. Reorder/trim freely — the Deck renders this list in order.

import type { ReactNode } from 'react';
import { LiveStage } from './LiveStage';
import { Flywheel } from './Flywheel';

export interface Slide {
  id: string;
  tone?: 'hero' | 'plain' | 'dark';
  eyebrow?: string;
  title?: string;
  caption?: ReactNode;
  render?: () => ReactNode;
  stageFill?: boolean;
  // When true, render() is dropped INTO the white Adobe slide card (variant 'viz'),
  // so a diagram wears the same chrome as the text slides. Else render() fills the
  // stage on its own (the live product).
  card?: boolean;
}

// The single thread across every slide: this is the AI CMS we're building.
// AI builds the pages; the design system gets stronger instead of drifting.
// Each slide adds one rung, building to: we need Forge. Eyebrows carry the
// running spine so a director can follow the argument without reading the body.
export const SLIDES: Slide[] = [
  // 1 — Title. Name the thing: the AI CMS.
  {
    id: 'title',
    tone: 'hero',
    eyebrow: 'Project Forge',
    title: 'The AI CMS for Adobe.com',
    caption: 'AI builds the pages. The design system gets stronger every time it runs.',
  },

  // 2 — Flow 1 (Audumber's framing): a CPro Figma design becomes a live DA page.
  // Figma door live, Stardust greyed.
  {
    id: 'live-build',
    tone: 'hero',
    eyebrow: 'It makes real pages',
    title: 'A CPro design becomes a live page',
    render: () => <LiveStage start="doors" highlight="figma" />,
    stageFill: true,
  },

  // 3 — Flow 2: Adobify a live page with Stardust. URL door live, Figma greyed.
  {
    id: 'live-reimagine',
    tone: 'hero',
    eyebrow: 'It designs, not just converts',
    title: 'Adobify what exists',
    render: () => <LiveStage start="doors" highlight="url" />,
    stageFill: true,
  },

  // 4 — The thing that makes it a SYSTEM, not a tool: it compounds.
  {
    id: 'flywheel',
    tone: 'hero',
    eyebrow: 'It gets stronger as it runs',
    title: 'A system, not a tool',
    caption: 'When it builds a new block, the good ones graduate into the shared library, so the next page reuses them. The system compounds instead of drifting.',
    render: () => <Flywheel />,
    card: true,
  },

  // 6 — See the system learn (the loop, live).
  {
    id: 'design-system',
    tone: 'hero',
    eyebrow: 'Watch the system learn',
    title: 'The library that teaches itself',
    render: () => <LiveStage start="designSystem" label="Page Forge · Design system" />,
    stageFill: true,
  },

  // 7 — Close. The conclusion: nobody else is building this; we need Forge.
  {
    id: 'close',
    tone: 'hero',
    eyebrow: 'Why it has to be us',
    title: 'Nobody else is building this',
    caption: 'Everyone makes AI that generates pages. The AI CMS, where every page makes the system stronger, is ours to build. The page engine works today.',
  },
];
