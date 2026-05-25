import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');
const REDUCED_MOTION_MQ = window.matchMedia('(prefers-reduced-motion: reduce)');

// AE expression parameters — exact values from KEyframes layer sliders
const AMP = 0.5;
const FREQ = 4.0;
const DECAY = 12.0;
const TIME_MAX = 12.0;
const DDELAY_MS = 300;
// Browser px/s → AE composition units. AE velocity is much smaller in scale.
const VELOCITY_SCALE = 0.25;

function addCursorFollower(list) {
  let activeMedia = null;
  let mouseX = 0;
  let mouseY = 0;
  let mouseVY = 0;
  let prevY = 0;
  let prevTime = 0;
  let isScrolling = false;
  let scrollEndTimer = null;
  let springRafs = [];
  let springGen = 0;

  const stopSpring = () => {
    springGen++;
    springRafs.forEach((raf) => { if (raf) cancelAnimationFrame(raf); });
    springRafs = [];
  };

  const resetPictures = (media) => {
    [...media.querySelectorAll('picture')].forEach((pic) => {
      pic.style.opacity = '';
      pic.style.transform = '';
    });
  };

  // Each picture springs in independently, staggered by DDELAY_MS * index —
  // matching AE where each layer's keyframe is offset by one Ddelay increment.
  const startSpring = (media, vY) => {
    stopSpring();
    const pictures = [...media.querySelectorAll('picture')];

    if (REDUCED_MOTION_MQ.matches) {
      pictures.forEach((pic) => { pic.style.opacity = '1'; });
      return;
    }

    pictures.forEach((pic) => { pic.style.opacity = '0'; pic.style.transform = 'none'; });

    const gen = springGen;

    pictures.forEach((pic, i) => {
      // First picture fires immediately (i=0 → 0ms), matching AE where layer 1
      // keyframe is at t=0 and each subsequent layer is offset by one Ddelay.
      const startTime = performance.now() + DDELAY_MS * i;

      const tick = (now) => {
        if (springGen !== gen) return; // stale tick from a previous spring, discard
        if (now < startTime) {
          springRafs[i] = requestAnimationFrame(tick);
          return;
        }

        const t = (now - startTime) / 1000;

        // Opacity: fast fade-in over first 0.05s
        pic.style.opacity = String(Math.min(1, t / 0.05));

        // AE expression (exact):
        //   easeFactor = easeOut(t, 0, timeMax, 1, 0)  → cubic ease-out 1→0
        //   bounce = v * amp * sin(freq * t * 2π) / exp(decay * t)
        //   value + bounce * easeFactor
        const easeFactor = Math.pow(Math.max(0, 1 - t / TIME_MAX), 2);
        const effectiveVY = Math.abs(vY) < 100 ? Math.sign(vY || 1) * 100 : vY;
        const bounce = effectiveVY * VELOCITY_SCALE * AMP
          * Math.sin(FREQ * t * 2 * Math.PI)
          / Math.exp(DECAY * t);
        pic.style.transform = `translateY(${bounce * easeFactor}px)`;

        if (t < 0.5) {
          springRafs[i] = requestAnimationFrame(tick);
        } else {
          pic.style.opacity = '1';
          pic.style.transform = 'none';
          springRafs[i] = null;
        }
      };

      springRafs[i] = requestAnimationFrame(tick);
    });
  };

  const setPosition = (media) => {
    media.style.left = `${mouseX - 2}px`;
    media.style.top = `${mouseY}px`;
    media.style.transform = 'translateY(-100%)';
  };

  const hide = () => {
    stopSpring();
    if (activeMedia) {
      resetPictures(activeMedia);
      activeMedia.classList.remove('is-visible');
      activeMedia = null;
    }
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    if (activeMedia) {
      resetPictures(activeMedia);
      activeMedia.classList.remove('is-visible');
    }
    stopSpring();
    activeMedia = media;
    setPosition(activeMedia);
    activeMedia.classList.add('is-visible');
    startSpring(activeMedia, mouseVY);
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

  // Global tracking keeps mouseX/mouseY and velocity current for the scroll-end check.
  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const dt = now - prevTime;
    if (dt > 0) mouseVY = (e.clientY - prevY) / (dt / 1000);
    prevY = e.clientY;
    prevTime = now;
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
