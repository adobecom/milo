// ── Deck — the leadership slideshow (THROWAWAY) ───────────────────────────────
// An HTML deck that embeds the REAL Forge UI inside slides. Arrow keys / click to
// advance. Exec audience: minimal text, mostly showing. Reached via ?deck.
//
// Each slide is { caption, render }. "Stage" slides embed the REAL product
// (LiveStage → WorkArea + ModalRoot) so the presenter drives the live flow on the
// stubbed compressed clock; "diagram" slides are clean markup.

import { useEffect, useState } from 'react';
import { SLIDES } from './slides';
import { DeckBoundary } from './DeckBoundary';
import { TextSlide } from './TextSlide';
import { SlideCard } from './SlideCard';
import { useConfig } from '../config';

export function Deck() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const slide = SLIDES[i];
  const { config, setConfig } = useConfig();

  // On-stage friction-killers (deck-only). The app gates two steps on saved config
  // that, when missing, pop a Connect modal asking the presenter to paste values
  // live: the Figma door (needs a token) and Send to Authoring (needs a consumer
  // repo + preview URL). The demo stubs both flows end to end, so we seed harmless
  // placeholder config to clear the gates, exactly as the app already forces
  // stardustReady in demo mode ("show what works, working"). Real saved values are
  // preserved. setConfig is in-memory only (not persisted), so nothing leaks.
  useEffect(() => {
    const patch: Partial<typeof config> = {};
    if (!(config.figmaToken || '').trim()) patch.figmaToken = 'demo';
    if (!(config.repoPath || '').trim()) patch.repoPath = 'demo/consumer';
    if (!(config.consumerPreviewUrl || '').trim()) patch.consumerPreviewUrl = 'http://localhost:3000';
    if (Object.keys(patch).length) setConfig({ ...config, ...patch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); setI((v) => Math.min(n - 1, v + 1)); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setI((v) => Math.max(0, v - 1)); }
      else if (e.key === 'Home') setI(0);
      else if (e.key === 'End') setI(n - 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n]);

  // Slide kinds:
  //   • text  — no render → the Adobe-style title/close slide card.
  //   • card  — render() dropped INTO the white Adobe card (e.g. the flywheel viz).
  //   • stage — render() hosts the live product (tighter header, canvas is the hero).
  const isText = !slide.render;
  const isCard = Boolean(slide.render) && slide.card === true;
  const isStage = Boolean(slide.render) && !slide.card;

  return (
    <div className={`pf-deck pf-deck--${slide.tone ?? 'plain'}`}>
      {isText && (
        <div className="pf-deck-slide pf-deck-slide--text" key={i}>
          <TextSlide
            eyebrow={slide.eyebrow}
            title={slide.title}
            caption={slide.caption}
            index={i}
            total={n}
          />
        </div>
      )}

      {isCard && (
        <div className="pf-deck-slide pf-deck-slide--text" key={i}>
          <SlideCard
            eyebrow={slide.eyebrow}
            title={slide.title}
            caption={slide.caption}
            index={i}
            total={n}
            variant="viz"
          >
            <DeckBoundary compact key={slide.id}>{slide.render!()}</DeckBoundary>
          </SlideCard>
        </div>
      )}

      {isStage && (
        <div className="pf-deck-slide pf-deck-slide--stage" key={i}>
          {slide.eyebrow && <div className="pf-deck-eyebrow">{slide.eyebrow}</div>}
          {slide.title && <h1 className="pf-deck-title">{slide.title}</h1>}
          {slide.caption && <p className="pf-deck-caption">{slide.caption}</p>}
          <div className={`pf-deck-stage${slide.stageFill ? ' pf-deck-stage--fill' : ''}`}>
            <DeckBoundary compact key={slide.id}>{slide.render!()}</DeckBoundary>
          </div>
        </div>
      )}

      {/* Progress dots + arrows — quiet, bottom. */}
      <div className="pf-deck-nav">
        <button className="pf-deck-arrow" type="button" aria-label="Previous" disabled={i === 0} onClick={() => setI((v) => Math.max(0, v - 1))}>‹</button>
        <div className="pf-deck-dots">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`pf-deck-dot${idx === i ? ' pf-deck-dot--on' : ''}`}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
        <button className="pf-deck-arrow" type="button" aria-label="Next" disabled={i === n - 1} onClick={() => setI((v) => Math.min(n - 1, v + 1))}>›</button>
      </div>
    </div>
  );
}
