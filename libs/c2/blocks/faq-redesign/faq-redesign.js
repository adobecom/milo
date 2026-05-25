import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Creates an independent spring tracker for a single picture element.
// Each picture gets its own stiffness (k) so they lag by different amounts,
// creating visible separation as the cursor moves.
// C = 2 * decay (24) is shared — damping is consistent.
function createSpring(el, k, c = 24) {
  let sx = 0; let sy = 0;
  let svx = 0; let svy = 0;
  let rafId = null;
  let prevTs = null;
  let getTarget;

  function tick(ts) {
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.033) : 0.016;
    prevTs = ts;

    const [tx, ty] = getTarget();
    svx += ((tx - sx) * k - svx * c) * dt;
    svy += ((ty - sy) * k - svy * c) * dt;
    sx += svx * dt;
    sy += svy * dt;

    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;

    rafId = requestAnimationFrame(tick);
  }

  return {
    start(x, y, targetFn) {
      getTarget = targetFn;
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
  let mouseX = 0;
  let mouseY = 0;
  let isScrolling = false;
  let scrollEndTimer = null;

  // Each picture layer gets a progressively softer spring so they separate
  // during cursor movement. Tuned to AE: amp=0.5, freq=4, decay=12.
  // base K ≈ amp * [(freq*2π)² + decay²] ≈ 387.
  // Subsequent layers subtract 100 per step → more lag → visual depth.
  const SPRING_K = [400, 280, 180];

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
    activeMedia.classList.add('is-visible');

    const pics = [...media.querySelectorAll('picture')];
    springs = pics.map((pic, i) => {
      const k = SPRING_K[i] ?? SPRING_K[SPRING_K.length - 1];
      const spring = createSpring(pic, k);
      // Each picture starts at the cursor and immediately begins tracking.
      // The target function always reads the latest mouse coords.
      spring.start(mouseX - 2, mouseY, () => [mouseX - 2, mouseY]);
      return spring;
    });
  };

  // Activates the image for whichever .faq-item is under the given coordinates.
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

  // Global tracking keeps mouseX/mouseY current for the scroll-end check.
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  list.addEventListener('mousemove', (e) => {
    if (!DESKTOP_MQ.matches) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

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
