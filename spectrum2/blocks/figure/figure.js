import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';

const MEDIA_TAGS = ['PICTURE', 'VIDEO', 'A'];

function isMediaChild(child) {
  if (MEDIA_TAGS.includes(child.nodeName)) return true;
  if (child.nodeName === 'SPAN' && child.classList.contains('modal-img-link')) return true;
  return child.classList.contains('s2-video');
}

function buildCaption(em, make) {
  em.classList.add('figure-caption');
  return make('figcaption', {}, em);
}

function decorateVideo(child, figEl) {
  const holder = child.querySelector('.s2-video');
  if (holder) {
    figEl.prepend(holder);
    return;
  }
  if (child.querySelector('video')) figEl.prepend(child.querySelector('.video-container, .pause-play-wrapper, video'));
}

function wrapInLink(link, figEl) {
  const picture = figEl.querySelector('picture');
  if (picture && !link.classList.contains('pause-play-wrapper')) {
    const label = (link.textContent || '').replace(/\s+/g, ' ').trim();
    const img = picture.querySelector('img');
    if (label && img && !(img.getAttribute('alt') || '').trim() && !link.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', label);
    }
    link.textContent = '';
    link.append(picture);
  }
  figEl.prepend(link);
}

export function buildFigure(cell, make) {
  const figEl = make('figure');
  [...cell.children].forEach((child) => {
    if (isMediaChild(child)) {
      figEl.prepend(child);
      return;
    }
    const imageVideo = child.querySelector('.modal-img-link');
    if (imageVideo) figEl.prepend(imageVideo);
    const picture = child.querySelector('picture');
    if (picture) figEl.prepend(picture);
    decorateVideo(child, figEl);
    const caption = child.querySelector('em');
    if (caption) figEl.append(buildCaption(caption, make));
    const link = child.querySelector('a');
    if (link) wrapInLink(link, figEl);
  });
  return figEl;
}

function decorateFigure(el, ctx) {
  const { make } = ctx;
  el.classList.add('figure');
  pageShims(el, make);
  decorateVideoLinks(el, { make });
  const cells = [...el.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;
  el.replaceChildren(...cells.map((cell) => buildFigure(cell, make)));
  if (cells.length > 1) el.classList.add('figure-list', `figure-list-${cells.length}`);
}

export const MEMBERS = {
  figure: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateFigure,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'figure' });
}
