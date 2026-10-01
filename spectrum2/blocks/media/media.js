import { dispatch } from '../_shared/members.js';
import { decorateBlockText, applyTextOverrides } from '../_shared/text.js';
import { decorateBlockBg } from '../_shared/background.js';
import { pageShims, getBlockSize, adoptMiloButtons } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';

const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const TEXT_NODE = 3;
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHECKMARK_PATH = 'M7.864 15.734c-.222 0-.433-.098-.576-.27l-3.747-4.497c-.266-.319-.222-.792.096-1.057.317-.265.79-.223 1.056.096l3.154 3.786 7.44-9.469c.255-.326.728-.382 1.052-.127.326.256.383.728.127 1.053L8.454 15.447c-.14.179-.352.284-.579.287z';

export const TEXT_SIZES = Object.freeze({
  small: Object.freeze(['xs', 's', 'm']),
  medium: Object.freeze(['m', 's', 'm']),
  'medium-compact': Object.freeze(['xl', 'm', 'l']),
  large: Object.freeze(['xl', 'm', 'l']),
  xlarge: Object.freeze(['xxl', 'm', 'l']),
});
const BLOCK_TYPES = ['merch', 'qr-code', 'checklist'];
const Z_VARIANTS = ['checklist', 'qr-code'];

const childDivs = (el) => [...el.children].filter((c) => c.tagName === 'DIV');
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i;
const NAMED_SURFACES = { white: [255, 255, 255], black: [0, 0, 0] };

function solidRgb(value) {
  const text = String(value || '').trim().toLowerCase();
  if (NAMED_SURFACES[text]) return NAMED_SURFACES[text];
  let m = text.match(HEX);
  if (m) {
    let hex = m[1];
    if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
    if (hex.length === 8 && parseInt(hex.slice(6, 8), 16) < 128) return null;
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  m = text.match(RGB);
  if (!m) return null;
  const alpha = m[4] === undefined ? 1 : parseFloat(m[4]) / (m[4].endsWith('%') ? 100 : 1);
  return alpha < 0.5 ? null : [m[1], m[2], m[3]].map(Number);
}

export function surfaceTheme(value) {
  const rgb = solidRgb(value);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((c) => {
    const v = Math.min(255, c) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? 'light' : 'dark';
}

function decorateBackground(el, row) {
  const bg = decorateBlockBg(el, row);
  const theme = bg.kind === 'colour' ? surfaceTheme(bg.value) : null;
  if (theme && !el.classList.contains('dark') && !el.classList.contains('light')) el.classList.add(theme);
  return bg;
}

export function blockTypeOf(el) {
  return BLOCK_TYPES.reduce((found, type) => (el.classList.contains(type) ? type : found), null);
}

function decorateAvatar(text) {
  const first = text.children[0];
  if (!first || first.children.length !== 1) return;
  const only = first.children[0];
  if (only.localName === 'picture') only.classList.add('media-avatar');
}

function markPlainActionArea(text) {
  const plain = [...text.querySelectorAll('[class*="s2-body-"]')].find((node) => (
    !node.nextElementSibling
    && !node.classList.contains('s2-action-area')
    && [...node.children].some((c) => c.tagName === 'A' && !c.classList.contains('s2-button'))
  ));
  if (!plain) return;
  const hasTextNode = [...plain.childNodes].some((n) => n.nodeType === TEXT_NODE && n.textContent.trim() !== '');
  if (!hasTextNode) plain.classList.add('media-action-area-plain');
}

function decorateSubcopy(row) {
  const actionArea = row.querySelector('p.s2-action-area');
  const next = actionArea?.nextElementSibling;
  if (!next) return;
  if (next.tagName === 'P') next.className = 'media-subcopy';
  if (next.tagName === 'H3') {
    next.classList.remove('s2-heading-m', 's2-supplemental');
    next.classList.add('s2-heading-xs');
    row.querySelectorAll('h3.s2-heading-xs ~ p.s2-body-s a, h3.s2-heading-xs ~ p.s2-icon-area a').forEach((link) => {
      link.parentElement.className = 'media-subcopy-link';
      link.className = 's2-body-xxs';
    });
  }
}

const lastOfType = (node) => {
  for (let n = node.nextElementSibling; n; n = n.nextElementSibling) {
    if (n.tagName === node.tagName) return false;
  }
  return true;
};

function decorateCtaContainer(row, make) {
  const lastActionArea = [...row.querySelectorAll('.s2-action-area')].find(lastOfType);
  if (!lastActionArea || lastActionArea.parentElement?.classList.contains('media-cta-container')) return;
  const div = make('div', { class: 'media-cta-container' });
  lastActionArea.after(div);
  const previous = lastActionArea.previousElementSibling;
  if (previous?.classList.contains('s2-icon-stack-area')) div.append(previous);
  div.append(lastActionArea);
}

function decorateQr(container) {
  const text = container.querySelector('.media-text');
  if (!text) return;
  const kids = text.children;
  const appStore = kids[kids.length - 1]?.querySelector('a');
  const googlePlay = kids[kids.length - 2]?.querySelector('a');
  const qrImage = kids[kids.length - 3];
  if (!qrImage || !appStore || !googlePlay) return;
  [appStore, googlePlay].forEach(({ parentElement }) => parentElement.classList.add('media-qr-button'));
  qrImage.classList.add('media-qr-code-img');
  appStore.classList.add('media-app-store');
  appStore.setAttribute('aria-label', 'Apple App Store');
  googlePlay.classList.add('media-google-play');
  googlePlay.setAttribute('aria-label', 'Google Play Store');
}

function checkmark(doc) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'media-checkmark');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHECKMARK_PATH);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

function decorateChecklist(unit, make) {
  const items = new Set([...unit.querySelectorAll('li > a')].map((link) => link.parentElement));
  items.forEach((li) => {
    const span = make('span', { class: 'media-checklist-text' });
    span.append(...li.childNodes);
    li.append(span);
  });
  unit.querySelectorAll('li').forEach((li) => {
    if (li.parentElement?.classList.contains('s2-icon-stack-area')) return;
    if (li.querySelector(':scope > .media-checkmark')) return;
    li.prepend(checkmark(unit.ownerDocument));
  });
}

function initMedia(el, ctx) {
  const { make } = ctx;
  let rows = childDivs(el);
  if (rows.length > 1) {
    el.classList.add('media-has-bg');
    const [head, ...tail] = rows;
    decorateBackground(el, head);
    rows = tail;
  }
  const blockType = blockTypeOf(el);
  const [heading, body, detail] = TEXT_SIZES[getBlockSize(el)];
  const container = make('div', { class: 'media-foreground' });

  rows.forEach((row) => {
    row.classList.add('media-row');
    const header = row.querySelector(HEADINGS);
    if (header) {
      const text = header.closest('div');
      text.classList.add('media-text');
      decorateAvatar(text);
      decorateBlockText(text, { origin: 'c1', heading, body, detail, type: blockType });
      markPlainActionArea(text);
    }
    row.querySelector(':scope > div:not([class])')?.classList.add('media-image');
    decorateSubcopy(row);
    decorateCtaContainer(row, make);
    container.append(row);
  });

  if (blockType === 'qr-code') decorateQr(container);
  el.append(container);
  const first = container.querySelector(':scope > .media-row > div');
  if (first?.classList.contains('media-text')) el.classList.add('media-reverse-mobile');
  applyTextOverrides(el, ctx.overrides);
  if (blockType === 'checklist') decorateChecklist(el, make);
}

export function unscopeBareLight(el) {
  if (!el.classList.contains('light')) return false;
  const paintsSurface = !!el.querySelector(':scope > .s2-background') || !!el.style.getPropertyValue('--_authored-bg');
  if (paintsSurface) return false;
  el.classList.replace('light', 'media-light');
  el.dataset.spectrum2AuthoredTheme = 'light';
  return true;
}

function decorateMedia(el, ctx) {
  el.classList.add('media');
  pageShims(el, ctx.make);
  decorateVideoLinks(el, { make: ctx.make });
  adoptMiloButtons(el);
  initMedia(el, ctx);
  unscopeBareLight(el);
}

function decorateHeadline(header, size) {
  const headingRow = header.parentElement;
  headingRow.classList.add('media-z-heading-row');
  headingRow.parentElement.classList.add('media-z-heading');
  header.classList.add(size === 'large' ? 's2-heading-xl' : 's2-heading-l', 'media-z-headline');
}

export function getReversedRowCount(rows) {
  return rows.filter((row) => row.querySelector(':scope > div > div:first-of-type')
    ?.querySelector(HEADINGS)).length;
}

export function getChildSingleRowCount(children) {
  return children.filter((child) => child.children.length === 1).length;
}

function decorateZPattern(el, ctx) {
  el.classList.add('media');
  pageShims(el, ctx.make);
  decorateVideoLinks(el, { make: ctx.make });
  adoptMiloButtons(el);
  const children = childDivs(el);
  if (!children.length) return;
  const size = getBlockSize(el);
  const singleRowCount = getChildSingleRowCount(children);
  const headerIndex = singleRowCount === 1 ? 0 : 1;
  const rowHeader = children[headerIndex]?.querySelector(HEADINGS) ?? null;
  if (singleRowCount === 1) {
    if (!rowHeader) decorateBackground(el, children[0]);
    else decorateHeadline(rowHeader, size);
  }
  if (singleRowCount === 2) {
    decorateBackground(el, children[0]);
    if (rowHeader) decorateHeadline(rowHeader, size);
  }
  const zRows = childDivs(el).filter((row) => !row.hasAttribute('class'));
  zRows.forEach((row) => {
    row.classList.add('media-z-row');
    const mediaRow = ctx.make('div');
    mediaRow.append(...childDivs(row));
    row.classList.add(size);
    row.append(mediaRow);
  });
  if (getReversedRowCount(zRows) === 0) {
    zRows.forEach((row, i) => { if (i % 2) row.classList.add('media-reversed'); });
  }
  zRows.forEach((row) => {
    Z_VARIANTS.forEach((v) => { if (el.classList.contains(v)) row.classList.add(v); });
    initMedia(row, { ...ctx, overrides: 'none' });
  });
  unscopeBareLight(el);
}

export const MEMBERS = {
  media: {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'c1',
    viewportPrePass: false,
    decorate: decorateMedia,
  },
  'z-pattern': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateZPattern,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'media' });
}
