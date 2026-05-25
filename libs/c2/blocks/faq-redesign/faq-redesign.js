import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Spring-based cursor follower.
// The position of the media element tracks the cursor with damped-oscillator
// physics, matching the AE inertial-bounce expression (amp=0.5, freq=4, decay=12).
// k  = amp * [decay² + (freq·2π)²] ≈ 0.5 * 775 ≈ 387
// c  = 2 · decay = 24
function addCursorFollower(list) {
  let activeMedia = null;
  let mouseX = 0;
  let mouseY = 0;
  let isScrolling = false;
  let scrollEndTimer = null;

  const K = 387; // spring stiffness
  const C = 24;  // damping coefficient

  let sx = 0; let sy = 0;    // current spring position
  let svx = 0; let svy = 0;  // spring velocity
  let rafId = null;
  let prevTs = null;

  function springTick(ts) {
    if (!activeMedia) { rafId = null; return; }
    const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.033) : 0.016;
    prevTs = ts;

    const tx = mouseX - 2;
    const ty = mouseY;

    svx += ((tx - sx) * K - svx * C) * dt;
    svy += ((ty - sy) * K - svy * C) * dt;
    sx += svx * dt;
    sy += svy * dt;

    activeMedia.style.left = `${sx}px`;
    activeMedia.style.top = `${sy}px`;

    rafId = requestAnimationFrame(springTick);
  }

  const hide = () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; prevTs = null; }
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;

    // Snap spring to cursor on entry — velocity zero so the spring immediately
    // starts chasing any cursor movement with full inertial bounce.
    sx = mouseX - 2;
    sy = mouseY;
    svx = 0;
    svy = 0;
    prevTs = null;

    activeMedia.style.left = `${sx}px`;
    activeMedia.style.top = `${sy}px`;
    activeMedia.classList.add('is-visible');

    rafId = requestAnimationFrame(springTick);
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
    // Spring tick reads mouseX/mouseY directly — no explicit setPosition call needed.
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
