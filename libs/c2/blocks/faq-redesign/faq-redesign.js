import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Spring parameters — directly match the After Effects KEyframes sliders
const SPRING_FREQ = 4;   // freq slider: 4.00  (oscillations per second)
const SPRING_DECAY = 12; // decay slider: 12.00 (how fast the bounce dies out)

// Derived spring constants for the damped harmonic oscillator
const OMEGA = SPRING_FREQ * 2 * Math.PI; // natural angular frequency (~25.1 rad/s)
const OMEGA_D = Math.sqrt(OMEGA * OMEGA - SPRING_DECAY * SPRING_DECAY); // damped frequency (~22.1 rad/s)

// Starting offsets — must match the CSS initial transform values
const START_X = 16; // px
const START_Y = 4;  // px

// Exact solution to the underdamped spring ODE for a displacement initial condition.
// x(0) = startOffset, x'(0) = 0 → element starts at the offset and decays to 0.
// This is the JS equivalent of: value + v * amp * sin(freq*t*2π) / exp(decay*t)
// from the AE expression, applied to a displacement rather than a velocity trigger.
function springValue(t, startOffset) {
  const B = (SPRING_DECAY * startOffset) / OMEGA_D;
  return Math.exp(-SPRING_DECAY * t)
    * (startOffset * Math.cos(OMEGA_D * t) + B * Math.sin(OMEGA_D * t));
}

function addHoverAnimation(list) {
  let activeMedia = null;
  let cancelAnim = null;

  const runSpring = (inner) => {
    cancelAnim?.();
    // Set starting position synchronously so there is no flash before first rAF
    inner.style.transform = `translateX(${START_X}px) translateY(${START_Y}px)`;
    const startTime = performance.now();
    let rafId;

    const tick = (now) => {
      const t = (now - startTime) / 1000; // seconds since trigger
      const x = springValue(t, START_X);
      const y = springValue(t, START_Y);
      inner.style.transform = `translateX(${x}px) translateY(${y}px)`;
      if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        inner.style.transform = '';
        rafId = 0;
      }
    };

    rafId = requestAnimationFrame(tick);
    cancelAnim = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };
  };

  const hide = () => {
    cancelAnim?.();
    cancelAnim = null;
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches) return;
    const item = e.target.closest('.faq-item');
    if (!item) return;
    const media = item.querySelector('.faq-media');
    if (!media || media === activeMedia) return;
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;
    activeMedia.classList.add('is-visible');
    const inner = media.querySelector('.faq-media-inner');
    if (inner) runSpring(inner);
  });

  list.addEventListener('mouseleave', hide);
}

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Row 1: section headline
  const headingCol = rows[0]?.children[0];
  const headline = createTag('div', { class: 'faq-headline' });
  if (headingCol) {
    decorateBlockText(headingCol, { heading: '2' });
    headline.append(...headingCol.childNodes);
  }

  // Rows 2-N: list items
  const list = createTag('ol', { class: 'faq-list' });
  rows.slice(1).forEach((row, i) => {
    const textCol = row.children[0];
    const mediaCol = row.children[1];

    const item = createTag('li', { class: 'faq-item' });
    const number = createTag('span', { class: 'faq-number eyebrow' }, String(i + 1).padStart(2, '0'));

    const text = createTag('div', { class: 'faq-text title-4' });
    if (textCol) {
      text.append(...textCol.childNodes);
    }

    item.append(number, text);

    if (mediaCol) {
      const pic = mediaCol.querySelector('picture');
      if (pic) {
        const inner = createTag('div', { class: 'faq-media-inner' });
        inner.append(pic);
        const media = createTag('div', { class: 'faq-media' });
        media.append(inner);
        item.append(media);
      }
    }

    list.append(item);
  });

  addHoverAnimation(list);

  const listCol = createTag('div', { class: 'faq-list-col' });
  listCol.append(list);

  block.replaceChildren(headline, listCol);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
