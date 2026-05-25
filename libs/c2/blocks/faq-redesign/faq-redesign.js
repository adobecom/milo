import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(min-width: 1280px)');
const CURSOR_OFFSET_X = 28;
const CURSOR_OFFSET_Y = -20;
const FOLLOW_EASE = 0.18;
const FOLLOW_STOP_EPSILON = 0.15;
const FOLLOW_ROTATE_FACTOR = 0.35;
const FOLLOW_ROTATE_X_FACTOR = 0.22;
const FOLLOW_MAX_ROTATION = 8;
const FOLLOW_MAX_ROTATION_X = 6;

function addCursorFollower(list) {
  let activeMedia = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const syncTargetToPointer = (e) => {
    targetX = e.clientX + CURSOR_OFFSET_X;
    targetY = e.clientY + CURSOR_OFFSET_Y;
  };

  const applyPosition = (media, velocityX = 0, velocityY = 0) => {
    const rotation = clamp(
      velocityX * FOLLOW_ROTATE_FACTOR,
      -FOLLOW_MAX_ROTATION,
      FOLLOW_MAX_ROTATION,
    );
    const rotationX = clamp(
      -velocityY * FOLLOW_ROTATE_X_FACTOR,
      -FOLLOW_MAX_ROTATION_X,
      FOLLOW_MAX_ROTATION_X,
    );
    media.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg) rotateX(${rotationX}deg)`;
  };

  const tick = () => {
    if (!activeMedia || !DESKTOP_MQ.matches) {
      rafId = 0;
      return;
    }

    const prevX = currentX;
    const prevY = currentY;
    currentX += (targetX - currentX) * FOLLOW_EASE;
    currentY += (targetY - currentY) * FOLLOW_EASE;

    const velocityX = currentX - prevX;
    const velocityY = currentY - prevY;
    applyPosition(activeMedia, velocityX, velocityY);

    const settled = Math.abs(targetX - currentX) < FOLLOW_STOP_EPSILON
      && Math.abs(targetY - currentY) < FOLLOW_STOP_EPSILON
      && Math.abs(velocityX) < FOLLOW_STOP_EPSILON
      && Math.abs(velocityY) < FOLLOW_STOP_EPSILON;

    rafId = settled ? 0 : requestAnimationFrame(tick);
  };

  const runTick = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const hide = () => {
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  list.addEventListener('mousemove', (e) => {
    if (!activeMedia || !DESKTOP_MQ.matches) return;
    syncTargetToPointer(e);
    runTick();
  });

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches) return;
    const target = e.target instanceof Element ? e.target : e.target?.parentElement;
    if (!target) return;
    const item = target.closest('.faq-item');
    if (!item) return;
    const media = item.querySelector('.faq-media');
    if (!media || media === activeMedia) return;
    const isFirstActivation = !activeMedia;
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;
    syncTargetToPointer(e);
    if (isFirstActivation) {
      currentX = targetX;
      currentY = targetY;
    }
    applyPosition(activeMedia);
    activeMedia.classList.add('is-visible');
    runTick();
  });

  list.addEventListener('mouseleave', hide);
  document.addEventListener('scroll', hide, { passive: true });
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
        const mediaInner = createTag('div', { class: 'faq-media-inner' });
        pics.forEach((pic) => mediaInner.append(pic));
        media.append(mediaInner);
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
