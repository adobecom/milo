import { rowsOf, cellsOf, hasContent, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateViewportContent } from '../_shared/viewport.js';
import { decorateBlockText, applyTextOverrides, roleClass } from '../_shared/text.js';
import { decorateButtons } from '../_shared/buttons.js';
import { decorateBlockBg, applyAuthoredColour, isAuthoredColour } from '../_shared/background.js';
import { federatedUrl } from '../_shared/urls.js';

const BLOCK = 'base-card';
export const CLS = Object.freeze({
  inner: `${BLOCK}-inner`,
  backdrop: `${BLOCK}-backdrop`,
  media: `${BLOCK}-media`,
  icon: `${BLOCK}-icon`,
  body: `${BLOCK}-body`,
  extra: `${BLOCK}-extra`,
  footer: `${BLOCK}-footer`,
  title: `${BLOCK}-title`,
  heading: `${BLOCK}-heading`,
  lockup: `${BLOCK}-lockup`,
  lockupLabel: `${BLOCK}-lockup-label`,
  device: `${BLOCK}-device`,
  divider: `${BLOCK}-divider`,
  link: `${BLOCK}-link`,
  standalone: `${BLOCK}-standalone`,
  imageLink: `${BLOCK}-image-link`,
  open: `${BLOCK}-open`,
  horizontal: `${BLOCK}-horizontal`,
  consonant: `${BLOCK}-consonant`,
  noBg: `${BLOCK}-no-bg`,
  hasBg: `${BLOCK}-has-bg`,
  noBorder: `${BLOCK}-no-border`,
  equalHeight: `${BLOCK}-equal-height`,
  upsDesktop: `${BLOCK}-ups-desktop`,
  toneLight: `${BLOCK}-tone-light`,
  toneDark: `${BLOCK}-tone-dark`,
  noMedia: `${BLOCK}-no-media`,
  noForeground: `${BLOCK}-no-foreground`,
  hasLink: `${BLOCK}-has-link`,
  hasDivider: `${BLOCK}-has-divider`,
  grid: `${BLOCK}-grid`,
});

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const SVG_URL = /\.svg(\?.*)?$/i;
const PIPE_TAIL = /\s?\|([^|]*)$/;
const C2_OVERRIDE = /^(heading|body|button)-/;
const C2_TEXT = Object.freeze({ origin: 'c2', heading: '5', body: 'md', button: 'md' });
const EDITORIAL_TEXT = Object.freeze({ origin: 'c1', heading: 'm', body: 'm', detail: 'm' });
const CONSONANT_TYPES = Object.freeze({
  'half-card': 'half',
  'half-height-card': 'half-height',
  'product-card': 'product',
  'double-width-card': 'double-width',
});
const MEDIA = 'img, picture, video';

function imageLinks(block, make) {
  block.querySelectorAll('img[alt*="|"]').forEach((img) => {
    const [source, alt, icon] = img.alt.split('|');
    const text = (source || '').trim();
    if (!/^https:\/\/[^\s]+$/.test(text) || icon !== undefined) return;
    let url;
    try {
      url = new URL(text);
    } catch (e) {
      return;
    }
    const href = (url.hostname.includes('.aem.') || url.hostname.includes('.hlx.'))
      ? `${url.pathname}${url.search}${url.hash}` : url.href;
    if (href.includes('.mp4')) return;
    img.setAttribute('alt', (alt || '').trim());
    const pic = img.closest('picture') || img;
    const a = make('a', { href, class: CLS.imageLink });
    pic.replaceWith(a);
    a.append(pic);
  });
}

function svgLink(a, make, win) {
  const text = a.textContent;
  const href = a.getAttribute('href') || '';
  if (!(text.includes('.svg') || href.includes('.svg'))) return;
  const [first, ...rest] = text.split('|');
  let authored;
  let hrefUrl;
  try {
    authored = new URL(first.trim());
    hrefUrl = new URL(a.href);
  } catch (e) {
    return;
  }
  const alt = rest.join('|').trim();
  const src = (authored.hostname.includes('.hlx.') || authored.hostname.includes('.aem.'))
    ? authored.pathname
    : authored.href;
  const picture = make('picture', null, make('img', { loading: 'lazy', src: federatedUrl(src, win), alt }));
  if (authored.pathname === hrefUrl.pathname) a.replaceWith(picture);
  else a.replaceChildren(picture);
}

function pipeTail(a) {
  const text = a.textContent;
  if (!PIPE_TAIL.test(text) || /\.[a-z]+/i.test(text)) return;
  const node = [...a.childNodes].reverse()[0];
  if (!node) return;
  const label = node.textContent.match(PIPE_TAIL)?.[1];
  node.textContent = node.textContent.replace(PIPE_TAIL, '');
  a.setAttribute('aria-label', (label || '').trim());
}

function blankTarget(a) {
  const href = a.getAttribute('href') || '';
  if (!href.includes('#_blank')) return;
  a.setAttribute('target', '_blank');
  a.setAttribute('href', href.replace('#_blank', ''));
}

function loaderPass(block, make, win) {
  imageLinks(block, make);
  [...block.querySelectorAll('a[href]')].forEach((a) => {
    svgLink(a, make, win);
    if (!block.contains(a)) return;
    blankTarget(a);
    pipeTail(a);
  });
}

export function colourTone(value) {
  const v = String(value || '').trim().toLowerCase();
  let rgba = null;
  const hex = v.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    const h = hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    rgba = [0, 2, 4, 6].map((i) => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255));
    rgba[3] /= 255;
  }
  const fn = v.match(/^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)\s*(?:[,/]\s*(\d*\.?\d+)(%?)\s*)?\)$/);
  if (fn) {
    const alpha = fn[4] === undefined ? 1 : Number(fn[4]) / (fn[5] ? 100 : 1);
    rgba = [Number(fn[1]), Number(fn[2]), Number(fn[3]), alpha];
  }
  if (!rgba || rgba[3] < 1 || rgba.slice(0, 3).some((c) => c > 255)) return null;
  const [r, g, b] = rgba.slice(0, 3).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? 'light' : 'dark';
}

function setTone(el, colour) {
  let tone = colourTone(colour);
  if (el.classList.contains('dark')) tone = 'dark';
  else if (el.classList.contains('light')) tone = 'light';
  if (tone) el.classList.add(tone === 'light' ? CLS.toneLight : CLS.toneDark);
}

function markTitles(scope, title = scope.querySelector(HEADINGS)) {
  scope.querySelectorAll(HEADINGS).forEach((h) => {
    h.classList.remove(CLS.title, CLS.heading);
    h.classList.add(h === title ? CLS.title : CLS.heading);
  });
}

export function wireCardLink(inner, only = () => true) {
  const links = [...inner.querySelectorAll('a[href]')];
  if (!links.length) return [];
  const urls = new Set(links.map((a) => a.href || a.getAttribute('href')));
  if (urls.size !== 1 || !links.every(only)) return [];
  links.forEach((a) => a.classList.add(CLS.link));
  inner.classList.add(CLS.hasLink);
  return links;
}

function part(make, cls, children) {
  return make('div', { class: cls }, children);
}

function markStandalone(scope) {
  scope.querySelectorAll('a').forEach((a) => {
    const parent = a.parentElement;
    if (!parent) return;
    if (textOf(parent) === textOf(a)) a.classList.add(CLS.standalone);
  });
}

function decorateC2Container(block, el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  const [row] = rowsOf(block);
  if (!row) return;
  const [foreground, media] = cellsOf(row);
  if (!foreground) return;
  loaderPass(row, make, win);

  decorateBlockText(foreground, C2_TEXT);
  markStandalone(foreground);

  const inner = make('div', { class: CLS.inner });
  const body = part(make, CLS.body, foreground);
  if (media && hasContent(media)) {
    const mediaPart = part(make, CLS.media, media);
    const first = foreground.children[0];
    if (first?.childElementCount === 1 && first.firstElementChild.tagName === 'PICTURE') {
      const icon = first.firstElementChild;
      const img = icon.querySelector('img');
      if (img?.hasAttribute('src') && SVG_URL.test(img.getAttribute('src'))) {
        img.setAttribute('src', federatedUrl(img.getAttribute('src'), win));
      }
      icon.classList.add(CLS.icon);
      mediaPart.append(icon);
      if (!first.children.length && !textOf(first)) first.remove();
    }
    inner.append(mediaPart);
  } else {
    media?.remove();
    inner.classList.add(CLS.noMedia);
  }
  inner.append(body);
  markTitles(body);
  wireCardLink(inner, (a) => a.classList.contains(CLS.standalone));
  row.replaceWith(inner);
}

function decorateBaseCard(el, ctx) {
  el.classList.add(BLOCK, CLS.open);
  const authored = [...el.classList].filter((c) => C2_OVERRIDE.test(c));
  const afterApply = (root) => {
    const live = [...root.classList].filter((c) => C2_OVERRIDE.test(c));
    const all = [...new Set([...authored, ...live])];
    if (all.length) applyTextOverrides(ctx.make('div', { class: all.join(' ') }), 'c2', root);
    root.classList.remove(...all);
  };
  const decorateOne = (block) => decorateC2Container(block, el, ctx);
  return decorateViewportContent(el, decorateOne, { afterApply });
}

function stepText(card) {
  const parts = [];
  const heading = card.querySelector(HEADINGS);
  if (textOf(heading)) parts.push(textOf(heading));
  card.querySelectorAll('p').forEach((p) => {
    if (!textOf(p)) return;
    const link = p.querySelector('a');
    if (link && /\.(svg|png|jpe?g|webp|gif)(\?|#|$)/i.test(link.getAttribute('href') || '')) return;
    parts.push(textOf(p));
  });
  return parts.join(' ');
}

export function emitHowTo(el) {
  const doc = el.ownerDocument;
  const section = el.closest('.section');
  if (!section || section.dataset.howToSchema) return null;
  const prev = section.previousElementSibling;
  const heading = prev?.querySelector(HEADINGS);
  if (!textOf(heading)) return null;
  section.dataset.howToSchema = 'true';
  const loc = doc.defaultView?.location;
  const url = loc ? `${loc.origin}${loc.pathname}` : '';
  const desc = prev.querySelector('p');
  const json = {
    '@context': 'http://schema.org',
    '@type': 'HowTo',
    name: textOf(heading),
    description: desc ? textOf(desc) : '',
    publisher: {
      '@type': 'Organization',
      name: 'Adobe',
      logo: { '@type': 'ImageObject', url: 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg' },
    },
    step: [...section.querySelectorAll('.editorial-card.seo')].map((card, i) => ({
      '@type': 'HowToStep',
      url,
      name: `Step ${i + 1}`,
      itemListElement: [{ '@type': 'HowToDirection', text: stepText(card) }],
    })),
  };
  const script = doc.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(json);
  (doc.head || doc.documentElement).append(script);
  return script;
}

function decorateLockup(row, make) {
  const p = row.querySelector(':scope > div > p');
  if (!p?.querySelector('img')) return;
  p.classList.add(CLS.lockup);
  [...p.childNodes].forEach((node) => {
    if (node.nodeType === 3 && node.nodeValue.trim()) {
      node.replaceWith(make('span', { class: CLS.lockupLabel }, node.nodeValue));
    }
  });
}

function decorateHrs(row, make) {
  let found = false;
  const toHr = (node) => {
    const text = (node.textContent || '').trim();
    if (!text.startsWith('---')) return;
    found = true;
    const hr = make('hr', { class: CLS.divider });
    applyAuthoredColour(hr, text.substring(3).trim());
    node.replaceChildren(hr);
  };
  row.querySelectorAll('p').forEach(toHr);
  const first = row.children[0];
  if (first && first.childElementCount === 0) toHr(first);
  if (found) row.classList.add(CLS.hasDivider);
}

function extendDevice(scope) {
  const detail = scope.querySelector('[class^="s2-detail-"], [class*=" s2-detail-"]');
  const prev = detail?.previousElementSibling;
  if (!prev) return;
  const body = [...prev.classList].find((c) => c.startsWith('s2-body-'));
  if (body) prev.classList.remove(body);
  prev.classList.add(CLS.device);
}

function decorateEditorialBg(el, row, open) {
  const cells = cellsOf(row);
  if (open || cells.every((c) => c.innerHTML.trim() === '')) {
    row.remove();
    el.classList.add(CLS.noBg);
    return null;
  }
  const bg = decorateBlockBg(el, row, { className: CLS.backdrop });
  if (bg.kind === 'colour') {
    el.classList.add(CLS.hasBg);
    setTone(el, bg.value);
    return null;
  }
  if (bg.kind === 'media') {
    const colours = [...row.children].map((c) => c.style.getPropertyValue('--_authored-bg').trim());
    const sameColour = colours.every((c) => c && c === colours[0]);
    if (!row.querySelector(MEDIA) && sameColour) setTone(el, colours[0]);
    return row;
  }
  el.classList.add(CLS.noBg);
  return null;
}

function decorateEditorialMedia(el, row) {
  const cells = cellsOf(row);
  if (!hasContent(row)) {
    row.remove();
    return null;
  }
  if (cells.length === 1 && !row.querySelector(`${MEDIA}, a[href]`) && isAuthoredColour(textOf(row))) {
    row.remove();
    return null;
  }
  row.classList.add(CLS.media);
  if (cells.length > 1) decorateBlockBg(el, row, { className: CLS.media });
  return row;
}

function wireCarouselDesktop(el) {
  if (!el.closest('.carousel.ups-desktop')) return;
  const win = el.ownerDocument.defaultView;
  if (!win || typeof win.matchMedia !== 'function') return;
  const mq = win.matchMedia('(min-width: 900px)');
  const sync = () => el.classList.toggle(CLS.upsDesktop, mq.matches);
  sync();
  mq.addEventListener('change', sync);
}

function decorateEditorial(el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  el.classList.add(BLOCK);
  if (el.classList.contains('seo')) emitHowTo(el);
  const open = el.classList.contains('open');
  if (open) el.classList.add(CLS.open);
  loaderPass(el, make, win);

  const rows = rowsOf(el);
  const n = rows.length;
  let bgRow = null;
  let mediaRow = null;
  let copyRows = [];
  if (n >= 4) [bgRow, mediaRow, ...copyRows] = rows;
  else if (n === 3 && open) [mediaRow, ...copyRows] = rows;
  else if (n === 3) [bgRow, mediaRow, ...copyRows] = rows;
  else if (n === 2) [mediaRow, ...copyRows] = rows;
  else copyRows = rows;
  if (n === 4) el.classList.add(CLS.equalHeight);

  const backdrop = bgRow ? decorateEditorialBg(el, bgRow, open) : null;
  if (!bgRow) el.classList.add(CLS.noBg);

  const inner = make('div', { class: CLS.inner });
  const media = mediaRow ? decorateEditorialMedia(el, mediaRow) : null;
  if (media) inner.append(media);
  else inner.classList.add(CLS.noMedia);

  let hasForeground = false;
  copyRows.forEach((row, i) => {
    if (!hasContent(row)) {
      row.remove();
      return;
    }
    hasForeground = true;
    let cls = CLS.extra;
    if (i === 0) cls = CLS.body;
    else if (i === copyRows.length - 1) cls = CLS.footer;
    row.classList.add(cls);
    if (i === 0) decorateLockup(row, make);
    decorateBlockText(row, EDITORIAL_TEXT);
    decorateHrs(row, make);
    inner.append(row);
  });
  if (!hasForeground) inner.classList.add(CLS.noForeground);

  el.replaceChildren(...(backdrop ? [backdrop] : []), inner);
  extendDevice(inner);
  applyTextOverrides(el, ctx.overrides);
  markTitles(inner);
  if (el.classList.contains('click')) wireCardLink(inner);
  wireCarouselDesktop(el);
}

function consonantType(el) {
  const found = [...el.classList]
    .find((c) => Object.prototype.hasOwnProperty.call(CONSONANT_TYPES, c));
  return found ? CONSONANT_TYPES[found] : 'half';
}

function holderOf(a, cell) {
  let node = a;
  while (node.parentElement && node.parentElement !== cell && ['P', 'EM', 'STRONG', 'DIV'].includes(node.parentElement.tagName)) {
    node = node.parentElement;
  }
  return node;
}

const NUP = /(^|\s)(two|three|four|five)-up(\s|$)/;
export function wrapConsonantGrid(el, make) {
  const section = el.parentElement?.closest('.section') || null;
  if (!section || el.parentElement !== section || NUP.test(section.className)) return null;
  if (section.querySelector(`:scope > .${CLS.grid}`)) return null;
  const name = [...el.classList][0];
  const cards = [...section.children].filter((c) => [...c.classList][0] === name);
  if (cards.length < 2) return null;
  const grid = make('div', { class: `${BLOCK} ${CLS.grid}` });
  cards[0].before(grid);
  grid.append(...cards);
  return grid;
}

function decorateConsonant(el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  wrapConsonantGrid(el, make);
  el.classList.add(BLOCK, CLS.consonant);
  if (!el.classList.contains('border')) el.classList.add(CLS.noBorder);
  loaderPass(el, make, win);
  const type = consonantType(el);
  const [row] = rowsOf(el);
  if (!row) return;
  const cells = cellsOf(row);
  const cell = cells[0];
  if (!cell) return;

  const merch = el.classList.contains('merch') && type === 'half';
  const lastP = merch ? [...cell.querySelectorAll(':scope > p')].pop() : null;
  const links = merch ? [...(lastP?.querySelectorAll('a[href]') || [])] : [...cell.querySelectorAll('a[href]')];
  const title = cell.querySelector(HEADINGS);

  decorateButtons(cell);
  if (title) title.classList.add(roleClass('c1', 'heading', 'xs'));
  cell.querySelectorAll(':scope > :is(p, ul, ol):not([class])').forEach((p) => {
    if (textOf(p)) p.classList.add(roleClass('c1', 'body', 'xs'));
  });

  const inner = make('div', { class: CLS.inner });
  const picture = cell.querySelector('picture');
  if (picture) {
    const holder = picture.parentElement;
    inner.append(part(make, CLS.media, make('div', null, picture)));
    if (holder && holder !== cell && !hasContent(holder)) holder.remove();
  } else {
    inner.classList.add(CLS.noMedia);
  }

  const footerTypes = type === 'half' || type === 'product';
  let footer = null;
  if (footerTypes && links.length) {
    const holders = [...new Set(links.map((a) => holderOf(a, cell)))];
    footer = part(make, CLS.footer, make('div', null, holders));
    if (merch) footer.prepend(make('hr', { class: CLS.divider }));
    if (lastP && !hasContent(lastP)) lastP.remove();
  }
  inner.append(part(make, CLS.body, cell));
  if (footer) inner.append(footer);
  cells.slice(1).forEach((c) => inner.querySelector(`.${CLS.body}`).append(c));
  row.replaceWith(inner);
  markTitles(inner);
  if (type === 'half-height' || type === 'double-width') wireCardLink(inner);
}

function decorateHorizontal(el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  el.classList.add(BLOCK, CLS.horizontal);
  loaderPass(el, make, win);
  const [row] = rowsOf(el);
  if (!row) return;
  const cells = cellsOf(row);
  const heading = row.querySelector(HEADINGS);
  let cell = heading ? heading.closest('div') : null;
  if (!cell || cell === row || !row.contains(cell)) [cell] = cells;
  if (!cell) return;

  const inner = make('div', { class: CLS.inner });
  const img = row.querySelector('img');
  if (img) {
    const pic = img.closest('a') && row.contains(img.closest('a')) ? img.closest('a') : (img.closest('picture') || img);
    const holder = pic.parentElement;
    inner.append(part(make, CLS.media, make('div', null, pic)));
    if (holder && holder !== row && !cells.includes(holder) && !hasContent(holder)) holder.remove();
  } else {
    inner.classList.add(CLS.noMedia);
  }

  const headings = [...cell.querySelectorAll(HEADINGS)];
  const titleEl = headings[headings.length - 1];
  if (titleEl) titleEl.classList.add(roleClass('c1', 'heading', 'xs'));
  cell.querySelectorAll('p').forEach((p) => {
    if (hasContent(p)) p.classList.add(roleClass('c1', 'body', 'xs'));
  });
  const body = part(make, CLS.body, cell);
  cells.filter((c) => c !== cell).forEach((c) => body.append(c));
  inner.append(body);
  row.replaceWith(inner);
  markTitles(inner, titleEl);
  wireCardLink(inner);
}

export const MEMBERS = Object.freeze({
  'base-card': {
    origin: 'c2',
    compat: 'canonical',
    overrides: 'c2',
    viewportPrePass: true,
    decorate: decorateBaseCard,
  },
  'editorial-card': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'c1',
    viewportPrePass: false,
    decorate: decorateEditorial,
  },
  card: {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateConsonant,
  },
  'card-horizontal': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateHorizontal,
  },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
