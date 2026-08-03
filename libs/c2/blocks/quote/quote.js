import { decorateBlockText, decorateViewportContent, hangOpeningQuote } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function decorateQuote(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;
  decorateBlockText(cell, { heading: '1' });
  const [quote, name, role] = [...cell.querySelectorAll(':scope > :is(h1, h2, h3, h4, h5, h6, p)')];
  if (!quote) return;

  hangOpeningQuote(quote);
  const figure = createTag('figure', { class: 'foreground' }, createTag('blockquote', { class: 'quote-copy' }, quote));

  if (name) {
    name.classList.add('quote-name');
    const figcaption = createTag('figcaption', { class: 'quote-attribution' }, name);
    if (role) {
      role.classList.add('quote-role');
      figcaption.append(role);
    }
    figure.append(figcaption);
  }

  figure.append(createTag('div', { class: 'quote-frame', 'aria-hidden': 'true' }));
  block.replaceChildren(figure);
}

// Scroll-reveal (opt-in via `style: scroll-reveal` on the section — see quote.css).
// The quote is pinned at viewport centre by CSS (position:sticky, top:50vh). We drive
// `.is-revealed` so it EMERGES in place once at rest — and, crucially, so scroll-up
// reverses that (shrinks away at centre) instead of drifting to the bottom of the page.
//
// The trick is a zero-height sentinel at the quote's natural flow position. The sentinel
// is NOT sticky, so it sits in the viewport's top half exactly while the quote is stuck
// at centre. Observing it against the top half (rootMargin bottom -50%) gives:
//   • scroll down → sentinel rises past 50vh as the quote reaches centre → reveal (emerge)
//   • scroll up  → sentinel drops below 50vh the instant the quote would unstick → hide,
//     while it's still centred, so it fades/shrinks in place (fast transition below)
//   • scroll forward past the dwell → sentinel stays in the top half → stays revealed and
//     scrolls off the top naturally (the original's forward exit).
// Visual opt-in is purely in CSS (`.section.scroll-reveal`), so this is a no-op for plain
// quotes and needs no coupling to section-metadata's load order.
function setupScrollReveal(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sentinel = createTag('div', { 'aria-hidden': 'true', class: 'quote-reveal-sentinel' });
  el.parentElement.insertBefore(sentinel, el);
  const observer = new IntersectionObserver(([entry]) => {
    const revealed = entry.isIntersecting;
    // Slow in-place emerge; fast hide so the quote is gone before the sticky element can
    // drift once it unsticks on scroll-up (mirrors globe-gallery's 0.15s scroll-up fade).
    el.style.transition = revealed
      ? 'opacity 0.7s ease, transform 0.7s ease'
      : 'opacity 0.15s ease, transform 0.15s ease';
    el.classList.toggle('is-revealed', revealed);
  }, { rootMargin: '0px 0px -50% 0px' });
  observer.observe(sentinel);
}

export default function init(el) {
  decorateViewportContent(el, decorateQuote);
  setupScrollReveal(el);
}
