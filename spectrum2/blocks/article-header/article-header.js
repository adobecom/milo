import { rowsOf, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { pageShims } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';
import { icon } from '../_shared/s1-blog-icons.js';
import { CDN_WHITELISTED_ORIGINS } from '../_shared/urls.js';

const DATE = /^([0-1]\d)-([0-3]\d)-(2\d{3})$/;
const POPUP_FEATURES = 'popup,top=233,left=233,width=700,height=467';
const STATUS_MS = 3000;
const MEDIA = 'img, picture, video, iframe, svg';
export const LABELS = Object.freeze({
  x: 'share twitter',
  linkedin: 'share linkedin',
  facebook: 'share facebook',
  copy: 'copy to clipboard',
  copied: 'Copied to clipboard',
});
const pending = new WeakMap();

export function authorReady(el) {
  return pending.get(el) || Promise.resolve(null);
}

const hasContent = (node) => !!node && (textOf(node) !== '' || !!node.querySelector?.(MEDIA));

function ownOrigins(doc) {
  const origins = new Set();
  try { origins.add(new URL(doc.baseURI).origin); } catch (e) { /* no base URI */ }
  const loc = doc.defaultView?.location?.origin;
  if (loc && loc !== 'null') origins.add(loc);
  return origins;
}

function adobeOrigin(url) {
  const noStage = url.origin.replace('.stage', '');
  return CDN_WHITELISTED_ORIGINS.some((o) => (o.startsWith('https://') ? noStage === o : url.hostname.endsWith(o)));
}

export function authorPageUrl(authorEl, doc) {
  const raw = (authorEl?.nodeName === 'A' && authorEl.getAttribute('href')) || authorEl?.dataset?.authorPage || '';
  if (!raw.trim()) return null;
  let url;
  try {
    url = new URL(raw.trim().toLowerCase(), doc.baseURI);
  } catch (e) {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol)) return null;
  if (!ownOrigins(doc).has(url.origin) && !adobeOrigin(url)) return null;
  const path = url.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  return path ? `${url.origin}${path}.plain.html` : null;
}

function httpUrl(src, base) {
  try {
    const url = new URL(src, base);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch (e) {
    return null;
  }
}

function unlink(authorEl) {
  if (authorEl.nodeName === 'A' && authorEl.parentNode) authorEl.replaceWith(...authorEl.childNodes);
}

async function loadAuthor(authorEl, avatar, make) {
  const doc = avatar.ownerDocument;
  const win = doc.defaultView;
  const url = authorPageUrl(authorEl, doc);
  if (!url || typeof win?.fetch !== 'function' || typeof win.DOMParser !== 'function') return null;
  let resp;
  try {
    resp = await win.fetch(url);
  } catch (e) {
    return null;
  }
  if (!resp?.ok) {
    unlink(authorEl);
    return null;
  }
  let page;
  try {
    page = new win.DOMParser().parseFromString(await resp.text(), 'text/html');
  } catch (e) {
    return null;
  }
  const src = page.querySelector('img')?.getAttribute('src');
  const resolved = src ? httpUrl(src, url) : null;
  if (!resolved) return null;
  const img = make('img', { class: 'article-header-avatar-image', src: resolved, alt: '', loading: 'lazy' });
  img.addEventListener('load', () => avatar.classList.add('article-header-avatar-loaded'));
  img.addEventListener('error', () => img.remove());
  avatar.append(img);
  if (img.complete && img.naturalWidth) avatar.classList.add('article-header-avatar-loaded');
  return img;
}

function decorateCategory(row) {
  row.classList.add('article-header-category');
  if (!hasContent(row)) row.hidden = true;
}

function decorateDate(date, make) {
  date.classList.add('article-header-date');
  const match = textOf(date).match(DATE);
  if (!match || date.querySelector('time')) return;
  const [, month, day, year] = match;
  const time = make('time', { datetime: `${year}-${month}-${day}` });
  time.append(...date.childNodes);
  date.append(time);
}

function shareActions(el, make) {
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const pageUrl = encodeURIComponent(win?.location?.href || doc.baseURI || '');
  const title = encodeURIComponent(textOf(el.querySelector('h1')));
  const targets = [
    ['x', `https://www.twitter.com/share?&url=${pageUrl}&text=${title}`],
    ['linkedin', `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${title}`],
    ['facebook', `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`],
  ];
  const share = make('div', { class: 'article-header-share' });
  targets.forEach(([name, href]) => {
    const link = make('a', {
      class: 'article-header-share-link',
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': LABELS[name],
      'data-share': name,
    });
    link.append(icon(doc, name, 'article-header-share-icon'));
    link.addEventListener('click', (event) => {
      const popup = typeof win?.open === 'function' ? win.open(href, `share-${name}`, POPUP_FEATURES) : null;
      if (!popup) return;
      try { popup.opener = null; } catch (e) { /* cross-origin */ }
      event.preventDefault();
    });
    share.append(link);
  });

  const copy = make('button', { type: 'button', class: 'article-header-share-link article-header-copy', 'aria-label': LABELS.copy });
  copy.append(icon(doc, 'link', 'article-header-share-icon'));
  const status = make('span', { class: 'article-header-copy-status', role: 'status', 'aria-live': 'polite' });
  let timer = null;
  copy.addEventListener('click', async () => {
    try {
      const clipboard = win?.navigator?.clipboard;
      if (!clipboard) throw new Error('no clipboard');
      await clipboard.writeText(win.location.href);
      copy.classList.remove('article-header-copy-failure');
      copy.classList.add('article-header-copy-success');
      status.textContent = LABELS.copied;
      win.clearTimeout(timer);
      timer = win.setTimeout(() => { status.textContent = ''; }, STATUS_MS);
    } catch (e) {
      copy.classList.add('article-header-copy-failure');
      copy.classList.remove('article-header-copy-success');
    }
  });
  share.append(make('span', { class: 'article-header-copy-wrap' }, [copy, status]));
  return share;
}

function decorateByline(el, row, make) {
  row.classList.add('article-header-byline');
  const info = row.firstElementChild;
  if (!info) return null;
  info.classList.add('article-header-byline-info');
  const authorContainer = info.firstElementChild;
  const avatar = make('div', { class: 'article-header-avatar' });
  avatar.append(icon(el.ownerDocument, 'user', 'article-header-avatar-icon'));
  row.prepend(avatar);
  let job = Promise.resolve(null);
  if (authorContainer) {
    authorContainer.classList.add('article-header-author');
    const authorEl = authorContainer.firstElementChild || authorContainer;
    job = loadAuthor(authorEl, avatar, make).catch(() => null);
  }
  const date = info.querySelector(':scope > p:last-child');
  if (date && date !== authorContainer) decorateDate(date, make);
  row.append(shareActions(el, make));
  return job;
}

function decorateMedia(row, make) {
  row.classList.add('article-header-media');
  decorateVideoLinks(row, { make });
  const picture = row.querySelector('picture');
  if (!picture) {
    row.classList.add('article-header-media-video');
    if (!hasContent(row)) row.hidden = true;
    return;
  }
  row.classList.add('article-header-media-image');
  const cell = row.lastElementChild;
  const figure = make('figure', { class: 'article-header-figure' });
  const caption = row.querySelector('em');
  if (caption) figure.append(make('figcaption', { class: 'article-header-caption' }, caption));
  figure.prepend(picture);
  row.prepend(figure);
  if (cell && cell !== figure && !hasContent(cell)) cell.remove();
}

function decorateArticleHeader(el, ctx) {
  const { make } = ctx;
  el.classList.add('article-header');
  pageShims(el, make);
  const [category, title, byline, media] = rowsOf(el);
  if (category) decorateCategory(category);
  title?.classList.add('article-header-title');
  const job = byline ? decorateByline(el, byline, make) : null;
  if (media) decorateMedia(media, make);
  if (job) pending.set(el, job);
}

export const MEMBERS = {
  'article-header': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateArticleHeader,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'article-header' });
}
