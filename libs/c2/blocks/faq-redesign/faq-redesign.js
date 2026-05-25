import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Module-level cursor tracking — one global listener, shared by all instances.
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

// Spring tracker for one picture element.
//
// C = 2·decay = 2·12 = 24  (exact AE match)
//
// K varies per layer to create visual separation during cursor movement.
// All layers share the same damping (C=24) so oscillations decay at the
// same rate — only the responsiveness differs, matching the Ddelay stagger
// intent in AE where back layers trail the front layer.
//
//   Layer 0 (front): K=775  → exact AE freq=4  (ω₀=√775, ωd≈25 rad/s ≈ 4 Hz)
//   Layer 1 (mid):   K=500  → slightly softer, more lag
//   Layer 2 (back):  K=280  → softest, most lag
function createSpring(el, k, c = 24) {
  let sx = 0; let sy = 0;
  let svx = 0; let svy = 0;
  let rafId = null;
  let prevTs = null;

  function tick(ts) {
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.033) : 0.016;
    prevTs = ts;

    svx += ((mouseX - 2 - sx) * k - svx * c) * dt;
    svy += ((mouseY - sy) * k - svy * c) * dt;
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

  // K per layer — front layer matches AE exactly (K=775 = ω₀² for freq=4, decay=12).
  // Back layers use progressively softer springs to trail behind, replicating
  // the visual stagger that Ddelay=0.30 creates between layers in AE.
  const SPRING_K = [775, 500, 280];

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

    // Pre-position all pictures at the cursor before revealing to avoid
    // a single-frame flash at an unset position.
    pics.forEach((pic) => {
      pic.style.left = `${mouseX - 2}px`;
      pic.style.top = `${mouseY}px`;
    });

    activeMedia.classList.add('is-visible');

    springs = pics.map((pic, i) => {
      const k = SPRING_K[i] ?? SPRING_K[SPRING_K.length - 1];
      const spring = createSpring(pic, k);
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
