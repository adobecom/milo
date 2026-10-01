import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { decorateBlockText, applyTextOverrides } from '../_shared/text.js';
import { decorateViewportContent } from '../_shared/viewport.js';
import { CDN_WHITELISTED_ORIGINS } from '../_shared/urls.js';

const FAMILY = 'quick-actions';
const DEFAULT_ITEM_WIDTH = 106;
const MAX_ITEM_WIDTH = 2000;
const NAV_DEBOUNCE_MS = 50;
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_PATH = 'm9.30103,6c0-.04883-.02002-.09521-.02783-.14343-.01074-.06726-.01294-.13586-.03894-.19971-.04456-.10974-.11121-.21252-.20007-.30139L4.34277.66309c-.35547-.35547-.93359-.35547-1.28906,0s-.35645.93262,0,1.28906l4.047,4.04785-4.047,4.04785c-.35645.35645-.35547.93359,0,1.28906.17773.17773.41113.2666.64453.2666s.4668-.08887.64453-.2666l4.69141-4.69238c.08887-.08887.15552-.19165.20007-.30139.026-.06384.0282-.13245.03894-.19971.00781-.04822.02783-.0946.02783-.14343Z';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const INTERACTIVE = 'a[href], button, input, select, textarea, iframe, details, summary, [tabindex]';
const FOCUSABLE = 'a[href], button, input, select, textarea, iframe, summary, [tabindex]:not([tabindex="-1"])';
const EDS_HOST = /\.(hlx|aem)\./;
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
const PLACEHOLDER = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
const C2_N_UP = { mobile: 'two-up', tablet: 'three-up', desktop: 'six-up' };
const C2_QUERIES = { mobile: '(width < 768px)', tablet: '(768px <= width < 1280px)' };

let trackCount = 0;

function resolveUrl(href, base) {
  if (href === null || href === undefined) return null;
  try {
    return new URL(href, base).href;
  } catch (e) {
    return null;
  }
}

function chevron(doc) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 12 12');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_PATH);
  svg.append(path);
  return svg;
}

function svgLinksToPictures(el, make, win) {
  const base = el.ownerDocument.baseURI;
  let origin = '';
  try { origin = win?.location?.origin || ''; } catch (e) { origin = ''; }
  const onAdobe = CDN_WHITELISTED_ORIGINS.includes(origin);
  el.querySelectorAll('a[href]').forEach((a) => {
    if (a.children.length) return;
    const text = a.textContent || '';
    const href = a.getAttribute('href') || '';
    if (!text.includes('.svg') && !href.includes('.svg')) return;
    const [first, ...rest] = text.split('|');
    let authored;
    let linked;
    try {
      authored = new URL(first.trim());
      linked = new URL(href, base);
    } catch (e) {
      return;
    }
    const alt = rest.join('|').trim();
    let src = authored.href;
    if (EDS_HOST.test(authored.hostname)) {
      src = onAdobe ? authored.pathname : authored.href.replace('.aem.page/', '.aem.live/');
    }
    const picture = make('picture', {}, make('img', { loading: 'lazy', src, alt }));
    if (authored.pathname === linked.pathname) a.replaceWith(picture);
    else a.replaceChildren(picture);
  });
}

function linkShims(el) {
  el.querySelectorAll('a[href]').forEach((a) => {
    let href = a.getAttribute('href');
    if (href.includes('#_blank')) {
      a.setAttribute('target', '_blank');
      href = href.replace('#_blank', '');
    }
    if (href.includes('#_dnb')) href = href.replace('#_dnb', '');
    if (href !== a.getAttribute('href')) a.setAttribute('href', href);
    const text = a.textContent || '';
    if (!PIPE_LABEL.test(text) || HAS_EXTENSION.test(text)) return;
    const node = a.lastChild;
    const label = node?.textContent.match(PIPE_LABEL)?.[1];
    if (label === undefined) return;
    node.textContent = node.textContent.replace(PIPE_LABEL, '');
    if (label.trim()) a.setAttribute('aria-label', label.trim());
  });
}

const URL_ATTRS = new Set(['href', 'src', 'srcset', 'poster', 'action', 'formaction', 'xlink:href']);
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
// eslint-disable-next-line no-bitwise
const SHOW_ELEMENT_AND_TEXT = 0x1 | 0x4;

function safeUrl(value, base) {
  return String(value).split(',').every((part) => {
    const url = part.trim().split(/\s+/)[0];
    if (!url) return true;
    try { return SAFE_SCHEMES.has(new URL(url, base).protocol); } catch (e) { return false; }
  });
}

function withPlaceholderFallbacks(value) {
  let hit = false;
  const out = value.replace(PLACEHOLDER, (match, key, encodedKey) => {
    hit = true;
    return (key || encodedKey || '').replaceAll('-', ' ');
  });
  return hit ? out.replace(/&nbsp;/g, '\u00A0') : value;
}

function placeholderFallbacks(el) {
  const walker = el.ownerDocument.createTreeWalker(el, SHOW_ELEMENT_AND_TEXT);
  for (let node = el; node; node = walker.nextNode()) {
    if (node.nodeType === 3) {
      const value = withPlaceholderFallbacks(node.nodeValue);
      if (value !== node.nodeValue) node.nodeValue = value;
    } else {
      [...node.attributes].forEach(({ name, value }) => {
        const next = withPlaceholderFallbacks(value);
        if (next === value) return;
        if (URL_ATTRS.has(name.toLowerCase()) && !safeUrl(next, el.ownerDocument.baseURI)) {
          node.removeAttribute(name);
          return;
        }
        node.setAttribute(name, next);
      });
    }
  }
}

function linkAttrs(anchor) {
  const attrs = {};
  [...anchor.attributes].forEach(({ name, value }) => {
    if (name === 'class' || name === 'style') return;
    attrs[name] = value;
  });
  return attrs;
}

function prepareForWrapper(content, href, base) {
  const target = resolveUrl(href, base);
  const inner = [...content.querySelectorAll(INTERACTIVE)];
  const same = inner.filter((node) => node.matches('a[href]') && resolveUrl(node.getAttribute('href'), base) === target);
  if (same.length !== inner.length) return false;
  same.forEach((link) => link.replaceWith(...link.childNodes));
  return true;
}

function decorateActionItem(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.quickActionsItem) return;
  const { make } = ctx;
  const doc = el.ownerDocument;
  placeholderFallbacks(el);
  svgLinksToPictures(el, make, doc.defaultView);
  linkShims(el);

  const rows = rowsOf(el);
  if (!rows.length) {
    el.dataset.quickActionsItem = 'empty';
    return;
  }
  const linkRow = rows.length > 1 ? rows[rows.length - 1] : null;
  const pictures = [...el.querySelectorAll('picture')];
  const media = pictures[0]?.parentElement ?? null;
  const content = media?.closest('div') ?? cellsOf(rows[0])[0] ?? rows[0];
  media?.classList.add('quick-actions-media');
  content.classList.add('quick-actions-content');

  if (el.classList.contains('float-icon') && pictures.length > 1 && media) {
    pictures[1].classList.add('quick-actions-float-icon');
    media.append(pictures[1]);
  }

  let floated = null;
  if (el.classList.contains('float-button') && linkRow && media) {
    [floated] = decorateButtons(linkRow);
    if (floated) {
      media.classList.add('quick-actions-media-button');
      media.append(floated);
    }
  }

  const anchor = linkRow?.querySelector('a') ?? null;
  const href = anchor?.getAttribute('href');
  let tile;
  let keptLink = null;
  if (href !== null && href !== undefined && !floated) {
    if (prepareForWrapper(content, href, doc.baseURI)) {
      tile = make('a', linkAttrs(anchor));
    } else {
      tile = make('div');
      keptLink = anchor;
    }
  } else {
    tile = make('div');
  }
  tile.classList.add('quick-actions-tile');
  tile.append(content);
  if (keptLink) {
    const wrap = make('p', { class: 'quick-actions-tile-link' });
    wrap.append(keptLink);
    tile.append(wrap);
  }
  el.replaceChildren(tile);
  el.dataset.quickActionsItem = 'decorated';
}

export function scrollerProps(el) {
  return rowsOf(el).reduce((attrs, row) => {
    const [key, value] = cellsOf(row);
    if (key && value) {
      attrs[key.textContent.trim().toLowerCase()] = value.textContent.trim().toLowerCase();
    }
    return attrs;
  }, {});
}

export function itemWidthOf(props) {
  const n = parseFloat(props['item width']);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_ITEM_WIDTH;
  return Math.min(Math.round(n), MAX_ITEM_WIDTH);
}

export function styleClassesOf(props) {
  if (!props.style) return [];
  return props.style.split(', ').map((s) => s.replaceAll(' ', '-')).filter((s) => /^[a-z0-9_-]+$/.test(s));
}

function navButton(make, doc, which, trackId) {
  const label = which === 'previous' ? 'Previous' : 'Next';
  const button = make('button', {
    type: 'button',
    class: `quick-actions-nav quick-actions-nav-${which}`,
    'aria-label': label,
    'aria-controls': trackId,
    hidden: true,
  });
  button.append(chevron(doc));
  return button;
}

function setHidden(button, hide, other) {
  if (button.hidden === hide) return;
  const hadFocus = button.ownerDocument.activeElement === button;
  if (hide && hadFocus && other && !other.hidden) other.focus();
  button.hidden = hide;
}

export function updateNav(track, prev, next) {
  const max = track.scrollWidth - track.clientWidth;
  const pos = Math.abs(track.scrollLeft);
  setHidden(prev, pos <= 1, next);
  setHidden(next, max <= 1 || pos >= max - 1, prev);
}

function columnGap(win, track) {
  const gap = parseFloat(win.getComputedStyle(track).columnGap);
  return Number.isFinite(gap) ? gap : 0;
}

function wireNavigation(el, track, prev, next, itemWidth) {
  const win = el.ownerDocument.defaultView;
  const update = () => updateNav(track, prev, next);
  const reduce = () => !!win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go = (direction) => {
    const rtl = win.getComputedStyle(track).direction === 'rtl';
    const left = direction * (rtl ? -1 : 1) * (itemWidth + columnGap(win, track));
    if (typeof track.scrollBy === 'function') track.scrollBy({ left, behavior: reduce() ? 'auto' : 'smooth' });
    else track.scrollLeft += left;
    update();
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  let timer = null;
  track.addEventListener('scroll', () => {
    win.clearTimeout(timer);
    timer = win.setTimeout(update, NAV_DEBOUNCE_MS);
  }, { passive: true });
  track.addEventListener('scrollend', update);
  track.addEventListener('load', update, true);
  if (typeof win.ResizeObserver === 'function') new win.ResizeObserver(update).observe(track);
  else win.addEventListener('resize', update);
  update();
}

function decorateActionScroller(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.quickActionsScroller) return;
  const { make } = ctx;
  const doc = el.ownerDocument;
  const props = scrollerProps(el);
  const itemWidth = itemWidthOf(props);
  const hasNav = el.classList.contains('navigation');
  const items = el.parentElement
    ? [...el.parentElement.querySelectorAll('.action-item')].filter((item) => !item.closest('.quick-actions-track'))
    : [];
  items.forEach((item) => {
    // eslint-disable-next-line no-use-before-define
    if (!item.dataset.quickActionsItem && [...item.classList][0] === 'action-item') decorate(item);
  });

  trackCount += 1;
  let trackId = `quick-actions-track-${trackCount}`;
  while (doc.getElementById(trackId)) {
    trackCount += 1;
    trackId = `quick-actions-track-${trackCount}`;
  }
  const track = make('div', { class: ['quick-actions-track', ...styleClassesOf(props)].join(' '), id: trackId });
  track.append(...items);
  el.style.setProperty('--_item-width', String(itemWidth));
  el.style.setProperty('--_columns', String(Math.max(items.length, 1)));

  if (track.querySelector('a[href]')) {
    track.setAttribute('role', 'list');
    items.forEach((item) => item.setAttribute('role', 'listitem'));
  }
  if (hasNav) {
    const prev = navButton(make, doc, 'previous', trackId);
    const next = navButton(make, doc, 'next', trackId);
    el.replaceChildren(track, prev, next);
    wireNavigation(el, track, prev, next, itemWidth);
  } else {
    el.replaceChildren(track);
    if (!track.querySelector(FOCUSABLE)) track.setAttribute('tabindex', '0');
  }
  el.dataset.quickActionsScroller = 'decorated';
}

function c2Header(block, make) {
  const firstRow = block.children[0];
  const headerCell = firstRow?.children[0];
  if (!headerCell?.querySelector(HEADINGS)) return null;
  const header = make('div', { class: 'quick-actions-header' });
  header.append(...headerCell.childNodes);
  firstRow.remove();
  decorateBlockText(header, { origin: 'c2', heading: '4', body: 'md', button: 'lg' });
  return header;
}

function c2Tile(row, make) {
  const [labelCell, mediaCell] = row.children;
  const labelLink = labelCell?.querySelector('a');
  const href = labelLink?.getAttribute('href');
  const tile = make(href ? 'a' : 'div', { class: 'quick-actions-tile quick-actions-c2-tile', href });
  const mediaPic = mediaCell?.querySelector('picture');
  const mediaImg = mediaPic?.querySelector('img') ?? mediaCell?.querySelector('img');
  if (mediaImg) {
    const media = mediaPic ?? mediaImg;
    media.classList.add('quick-actions-c2-media');
    tile.append(media);
  }
  if (labelLink) {
    const footer = make('div', { class: 'quick-actions-tile-footer' });
    const icon = make('span', { class: 'quick-actions-chevron', 'aria-hidden': 'true' });
    icon.append(chevron(row.ownerDocument));
    footer.append(make('span', { class: 'quick-actions-tile-label s2-heading-6' }, textOf(labelLink)), icon);
    tile.append(footer);
  }
  return tile;
}

function c2Grid(container, win, make) {
  const header = c2Header(container, make);
  const rows = [...container.children].filter((row) => row.children.length >= 2);
  const grid = make('div', { class: 'quick-actions-grid' });
  rows.forEach((row) => grid.append(c2Tile(row, make)));
  const queries = win?.matchMedia ? Object.fromEntries(Object.entries(C2_QUERIES)
    .map(([k, q]) => [k, win.matchMedia(q)])) : {};
  const applyNUp = () => {
    let key = 'desktop';
    if (queries.mobile?.matches) key = 'mobile';
    else if (queries.tablet?.matches) key = 'tablet';
    grid.classList.remove(...Object.values(C2_N_UP).map((v) => `quick-actions-${v}`));
    grid.classList.add(`quick-actions-${C2_N_UP[key]}`);
  };
  applyNUp();
  Object.values(queries).forEach((mq) => mq.addEventListener?.('change', applyNUp));
  container.replaceChildren(...[header, grid].filter(Boolean));
}

function decorateQuickActions(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.quickActionsGrid) return;
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  linkShims(el);
  const afterApply = (root) => applyTextOverrides(root, ctx.overrides);
  decorateViewportContent(el, (container) => c2Grid(container, win, make), { afterApply });
  el.dataset.quickActionsGrid = 'decorated';
}

export const MEMBERS = {
  'quick-actions': {
    origin: 'c2',
    compat: 'canonical',
    overrides: 'c2',
    viewportPrePass: true,
    decorate: decorateQuickActions,
  },
  'action-item': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateActionItem,
  },
  'action-scroller': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateActionScroller,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
