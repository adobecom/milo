import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Replicates the AE damped oscillator spring (amp=0.5, freq=4, decay=12).
// Formula: p(t) = 1 - e^(-decay*t) * [cos(freq*2π*t) + (decay/freq*2π)*sin(freq*2π*t)]
// Returns a cancel function that stops the animation and resets the element.
function springIn(el, { amp = 0.5, freq = 4, decay = 12, delay = 0 } = {}) {
  let rafId;
  let startTime = null;
  const TAU = 2 * Math.PI;

  el.style.opacity = '0';
  el.style.transform = 'scale(0.85) translateY(10px)';

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed = (ts - startTime) / 1000;

    if (elapsed < delay) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    const t = elapsed - delay;
    const envelope = Math.exp(-decay * t);
    const spring = envelope * (Math.cos(freq * TAU * t) + (decay / (freq * TAU)) * Math.sin(freq * TAU * t));
    const p = 1 - spring; // 0→1 with overshoot

    el.style.opacity = String(Math.min(1, p * 3));
    el.style.transform = `scale(${0.85 + 0.15 * p}) translateY(${10 * (1 - p)}px)`;

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      el.style.cssText = '';
    }
  }

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    el.style.cssText = '';
  };
}

function addCursorFollower(list) {
  let activeMedia = null;
  let stopAnimations = [];
  let mouseX = 0;
  let mouseY = 0;
  let isScrolling = false;
  let scrollEndTimer = null;

  const setPosition = (media) => {
    media.style.left = `${mouseX - 2}px`;
    media.style.top = `${mouseY}px`;
  };

  const hide = () => {
    stopAnimations.forEach((stop) => stop());
    stopAnimations = [];
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    stopAnimations.forEach((stop) => stop());
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;
    setPosition(activeMedia);
    activeMedia.classList.add('is-visible');
    stopAnimations = [...media.querySelectorAll('picture')].map((pic, i) => springIn(pic, { delay: i * 0.05 }));
  };

  // Activates the image for whichever .faq-item is under the given coordinates.
  // mouseover doesn't re-fire when the page scrolls under a stationary cursor,
  // so we share this logic with the scroll-end handler.
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
    if (!DESKTOP_MQ.matches || !activeMedia) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    setPosition(activeMedia);
  });

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches || isScrolling) return;
    activateItemAt(e.clientX, e.clientY);
  });

  // Attach scroll listener only while cursor is over the list.
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
