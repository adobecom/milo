import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// AE Effect Controls — exact values from the screenshot
const AMP = 0.50;
const FREQ = 4.00;
const DECAY = 12.00;
const TIME_MAX = 12.00;
const DDELAY = 0.30; // stagger between layers

// Module-level cursor tracking with smoothed velocity.
// velocity = v in the AE formula: velocityAtTime(key(n).time - frameDuration/10)
let mouseX = 0;
let mouseY = 0;
let cursorVX = 0;
let cursorVY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let prevMouseTs = 0;

document.addEventListener('mousemove', (e) => {
  const now = performance.now();
  const dt = (now - prevMouseTs) / 1000;
  if (dt > 0 && dt < 0.1) {
    const rawVX = (e.clientX - prevMouseX) / dt;
    const rawVY = (e.clientY - prevMouseY) / dt;
    // Exponential moving average to smooth out per-frame jitter
    cursorVX = cursorVX * 0.6 + rawVX * 0.4;
    cursorVY = cursorVY * 0.6 + rawVY * 0.4;
  }
  prevMouseX = e.clientX;
  prevMouseY = e.clientY;
  prevMouseTs = now;
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

// Implements the exact AE inertial bounce expression per layer:
//   position = cursor + v * amp * sin(freq * 2π * t) * exp(−decay * t)
//
// Where:
//   cursor  = current mouse position (base value, updates every frame)
//   v       = cursor velocity captured at hover moment
//   t       = elapsed time since hover − delaySec (Ddelay stagger)
//
// Before Ddelay expires or after TIME_MAX: direct cursor follow (no bounce).
function createBounce(el, delaySec) {
  let entryVX = 0;
  let entryVY = 0;
  let entryTs = 0;
  let rafId = null;

  function tick(ts) {
    const t = (ts - entryTs) / 1000 - delaySec;

    let x;
    let y;

    if (t <= 0 || t > TIME_MAX) {
      // Outside active bounce window: follow cursor directly
      x = mouseX - 2;
      y = mouseY;
    } else {
      // AE formula: value + v * amp * sin(freq * 2π * t) * exp(−decay * t)
      const wave = AMP * Math.sin(FREQ * 2 * Math.PI * t) * Math.exp(-DECAY * t);
      x = (mouseX - 2) + entryVX * wave;
      y = mouseY + entryVY * wave;
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    rafId = requestAnimationFrame(tick);
  }

  return {
    start() {
      entryVX = cursorVX;
      entryVY = cursorVY;
      entryTs = performance.now();
      el.style.left = `${mouseX - 2}px`;
      el.style.top = `${mouseY}px`;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    },
  };
}

function addCursorFollower(list) {
  let activeMedia = null;
  let bounces = [];
  let isScrolling = false;
  let scrollEndTimer = null;

  // Ddelay per layer: 0s, 0.30s, 0.60s — exact AE stagger
  const DELAYS = [0, DDELAY, DDELAY * 2];

  const hide = () => {
    bounces.forEach((b) => b.stop());
    bounces = [];
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    bounces.forEach((b) => b.stop());
    bounces = [];
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;

    const pics = [...media.querySelectorAll('picture')];

    // Pre-position all pictures at cursor before making them visible
    pics.forEach((pic) => {
      pic.style.left = `${mouseX - 2}px`;
      pic.style.top = `${mouseY}px`;
    });

    activeMedia.classList.add('is-visible');

    bounces = pics.map((pic, i) => {
      const delay = DELAYS[i] ?? DELAYS[DELAYS.length - 1];
      const bounce = createBounce(pic, delay);
      bounce.start();
      return bounce;
    });
  };

  const activateItemAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const item = el?.closest?.('.faq-item');
    if (item && list.contains(item)) {
      const media = item.querySelector('.faq-media');
      if (media) activate(media);
    }
  };

  const onScroll = () => {
    isScrolling = true;
    hide();
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrolling = false;
      activateItemAt(mouseX, mouseY);
    }, 150);
  };

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches || isScrolling) return;
    activateItemAt(e.clientX, e.clientY);
  });

  list.addEventListener('mouseenter', () => {
    if (!DESKTOP_MQ.matches) return;
    document.addEventListener('scroll', onScroll, { passive: true });
  });

  list.addEventListener('mouseleave', () => {
    isScrolling = false;
    hide();
    clearTimeout(scrollEndTimer);
    document.removeEventListener('scroll', onScroll);
  });
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
      const pics = [...mediaCol.querySelectorAll('picture')];
      if (pics.length) {
        const media = createTag('div', { class: 'faq-media' });
        pics.forEach((pic) => media.append(pic));
        item.append(media);
      }
    }

    list.append(item);
  });

  addCursorFollower(list);

  const listCol = createTag('div', { class: 'faq-list-col' });
  listCol.append(list);

  block.replaceChildren(headline, listCol);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
