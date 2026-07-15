import type { ReactElement } from 'react';
import { FigmaMark, LinkMark } from './glyphs';

// Welcome-tour slides. Each specimen is a live CSS mock (not a PNG) so it themes
// and never goes stale — pattern from the v2 GuardrailSpecimen. Copy is a draft.

export interface SplashSlide {
  id: string;
  title: string;
  body: string;
  specimen: () => ReactElement;
}

export const SPLASH_SLIDES: SplashSlide[] = [
  {
    id: 'welcome',
    title: 'Meet Forge',
    body:
      'Forge turns a design into a real, editable Adobe.com page in minutes, without hand-building it. Here is what it does.',
    specimen: () => (
      <span className="pf-splash-spec-brand">
        <span className="pf-splash-spec-brandmark">PF</span>
      </span>
    ),
  },
  {
    id: 'two-doors',
    title: 'A Figma frame or a live page',
    body:
      'Paste a Figma frame or point Forge at a live URL. You choose how closely the page follows your starting point.',
    specimen: () => (
      <span className="pf-splash-spec-doors">
        <span className="pf-splash-spec-door">
          <span className="pf-src-glyph pf-src-glyph--figma">
            <FigmaMark />
          </span>
          <span className="pf-splash-spec-doorlabel">Figma</span>
        </span>
        <span className="pf-splash-spec-door">
          <span className="pf-src-glyph pf-src-glyph--url">
            <LinkMark />
          </span>
          <span className="pf-splash-spec-doorlabel">URL</span>
        </span>
      </span>
    ),
  },
  {
    id: 'real-page',
    title: 'A real, on-brand page',
    body:
      'Forge builds the page from Adobe’s approved Milo blocks, reusing real ones where they fit. The result is on-brand and ready to edit, not a mockup.',
    specimen: () => (
      <span className="pf-splash-spec-page" aria-hidden="true">
        <span className="pf-splash-spec-page-hero" />
        <span className="pf-splash-spec-page-row">
          <span /><span /><span />
        </span>
        <span className="pf-splash-spec-page-cta" />
      </span>
    ),
  },
  {
    id: 'download',
    title: 'Download the page',
    body:
      'Download the finished page as a single HTML file, images included, that opens in any browser.',
    specimen: () => (
      <span className="pf-splash-spec-download" aria-hidden="true">
        <span className="pf-splash-spec-file">
          <span className="pf-splash-spec-file-corner" />
          <span className="pf-splash-spec-file-line" />
          <span className="pf-splash-spec-file-line" />
        </span>
        <span className="pf-splash-spec-arrow" />
      </span>
    ),
  },
];
