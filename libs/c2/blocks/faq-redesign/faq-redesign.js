import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

function addCursorFollower(list) {
  let activeMedia = null;
  let mouseX = 0;
  let mouseY = 0;
  let rafPending = false;

  const setPosition = (media) => {
    media.style.left = `${mouseX - 2}px`;
    media.style.top = `${mouseY}px`;
  };

  const hide = () => {
    activeMedia?.classList.remove('is-visible');
    activeMedia = null;
  };

  const activate = (media) => {
    if (media === activeMedia) return;
    activeMedia?.classList.remove('is-visible');
    activeMedia = media;
    setPosition(activeMedia);
    activeMedia.classList.add('is-visible');
  };

  // After each scroll frame, check what's actually under the cursor
  // and show/hide accordingly — avoids the stale-hide problem where
  // mouseover never re-fires after scroll stops.
  const syncWithCursor = () => {
    rafPending = false;
    const el = document.elementFromPoint(mouseX, mouseY);
    const item = el?.closest?.('.faq-item');
    if (item && list.contains(item)) {
      const media = item.querySelector('.faq-media');
      if (media) { activate(media); return; }
    }
    hide();
  };

  list.addEventListener('mousemove', (e) => {
    if (!DESKTOP_MQ.matches) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (activeMedia) setPosition(activeMedia);
  });

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    const item = e.target.closest('.faq-item');
    if (!item) return;
    const media = item.querySelector('.faq-media');
    if (media) activate(media);
  });

  list.addEventListener('mouseleave', hide);

  document.addEventListener('scroll', () => {
    if (!DESKTOP_MQ.matches || rafPending) return;
    rafPending = true;
    requestAnimationFrame(syncWithCursor);
  }, { passive: true });
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
        const media = createTag('div', { class: 'faq-media' });
        media.append(pic);
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
