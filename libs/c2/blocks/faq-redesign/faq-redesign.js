import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Module-level cursor tracking — one global listener, shared by all instances.
// posHistory stores the last 800ms of positions to support Ddelay lookup.
let mouseX = 0;
let mouseY = 0;
const posHistory = [];

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  posHistory.push({ x: e.clientX, y: e.clientY, ts: performance.now() });
  const cutoff = performance.now() - 800;
  while (posHistory.length > 1 && posHistory[0].ts < cutoff) posHistory.shift();
}, { passive: true });

// Returns the interpolated cursor position from `delaySec` seconds ago.
// This is the exact JS equivalent of AE's Ddelay expression parameter.
function getDelayedPos(delaySec) {
  if (!posHistory.length) return [mouseX - 2, mouseY];
  const targetTs = performance.now() - delaySec * 1000;
  for (let i = posHistory.length - 1; i >= 0; i--) {
    if (posHistory[i].ts <= targetTs) {
      if (i + 1 < posHistory.length) {
        const a = posHistory[i];
        const b = posHistory[i + 1];
        const ratio = (targetTs - a.ts) / (b.ts - a.ts);
        return [a.x + (b.x - a.x) * ratio - 2, a.y + (b.y - a.y) * ratio];
      }
      return [posHistory[i].x - 2, posHistory[i].y];
    }
  }
  return [posHistory[0].x - 2, posHistory[0].y];
}

// Spring tracker for one picture element.
//
// Exact match to AE inertial bounce parameters:
//   freq = 4   → ωd = 4·2π = 25.13 rad/s
//   decay = 12 → damping rate α = 12
//   ω₀ = √(α² + ωd²) = √(144 + 631) = √775 ≈ 27.8 rad/s
//   K = ω₀² = 775,  C = 2·α = 24
//
// Layer separation comes from Ddelay (temporal lag), not different K values.
// All three layers share K=775, C=24 — exactly as in AE.
function createSpring(el, delaySec) {
  const K = 775;
  const C = 24;
  let sx = 0; let sy = 0;
  let svx = 0; let svy = 0;
  let rafId = null;
  let prevTs = null;

  function tick(ts) {
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.033) : 0.016;
    prevTs = ts;

    const [tx, ty] = getDelayedPos(delaySec);
    svx += ((tx - sx) * K - svx * C) * dt;
    svy += ((ty - sy) * K - svy * C) * dt;
    sx += svx * dt;
    sy += svy * dt;

    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;

    rafId = requestAnimationFrame(tick);
  }

  return {
    start(x, y) {
      sx = x; sy = y; svx = 0; svy = 0; prevTs = null;
      el.style.left = `${sx}px`;
      el.style.top = `${sy}px`;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; prevTs = null; }
    },
  };
}

function addCursorFollower(list) {
  let activeMedia = null;
  let springs = [];
  let isScrolling = false;
  let scrollEndTimer = null;

  // Ddelay per layer — exact match to AE Ddelay = 0.30:
  // layer 0: tracks cursor at t+0s (real-time)
  // layer 1: tracks cursor at t−0.30s
  // layer 2: tracks cursor at t−0.60s
  const DELAYS = [0, 0.30, 0.60];

  const hide = () => {
    springs.forEach((s) => s.stop());
    springs = [];
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    springs.forEach((s) => s.stop());
    springs = [];
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;

    const pics = [...media.querySelectorAll('picture')];

    // Pre-position all pictures at cursor before revealing — prevents a
    // single-frame flash at an unset (0,0) position.
    pics.forEach((pic) => {
      pic.style.left = `${mouseX - 2}px`;
      pic.style.top = `${mouseY}px`;
    });

    activeMedia.classList.add('is-visible');

    springs = pics.map((pic, i) => {
      const delay = DELAYS[i] ?? DELAYS[DELAYS.length - 1];
      const spring = createSpring(pic, delay);
      spring.start(mouseX - 2, mouseY);
      return spring;
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
