import { rowsOf, cellsOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { CDN_WHITELISTED_ORIGINS } from '../_shared/urls.js';
import { revealAfter } from '../_shared/motion.js';

const FAMILY = 'logo-wall';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const EDS_HOST = /\.(hlx|aem)\./;
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;

function protocolOf(href, base) {
  try { return new URL(href, base).protocol; } catch (e) { return null; }
}
export function keepsProtocol(orig, next, base) {
  const before = protocolOf(orig, base);
  return before !== null && before === protocolOf(next, base);
}

export function svgLinksToPictures(el, make, win) {
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
    if (authored.protocol !== 'https:') return;
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
  const base = el.ownerDocument.baseURI;
  el.querySelectorAll('a[href]').forEach((a) => {
    const orig = a.getAttribute('href');
    const next = orig.replace('#_blank', '').replace('#_dnb', '');
    if (next !== orig && keepsProtocol(orig, next, base)) {
      if (orig.includes('#_blank')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      }
      a.setAttribute('href', next);
    }
    if (a.hasAttribute('aria-label')) return;
    const text = a.textContent || '';
    if (!PIPE_LABEL.test(text) || HAS_EXTENSION.test(text)) return;
    const node = a.lastChild;
    const label = node?.textContent.match(PIPE_LABEL)?.[1];
    if (label === undefined) return;
    node.textContent = node.textContent.replace(PIPE_LABEL, '');
    if (label.trim()) a.setAttribute('aria-label', label.trim());
  });
}

const isSvgLink = (a) => !a.children.length && /\.svg\b/.test(`${a.textContent} ${a.getAttribute('href') || ''}`)
  && /^\s*https:\/\//.test(a.textContent || '');

export function buttonsKeepingProtocol(container) {
  const base = container.ownerDocument.baseURI;
  const before = new Map([...container.querySelectorAll('a[href]')].map((a) => [a, a.getAttribute('href')]));
  const buttons = decorateButtons(container);
  before.forEach((orig, a) => {
    const now = a.getAttribute('href');
    if (now !== orig && !keepsProtocol(orig, now, base)) a.setAttribute('href', orig);
  });
  return buttons;
}

export function rowKind(row) {
  if (row.querySelector('picture, img') || [...row.querySelectorAll('a[href]')].some(isSvgLink)) return 'logo';
  if (row.querySelector(HEADINGS)) return 'head';
  if (row.querySelector('a[href]')) return 'link';
  return (row.textContent || '').trim() ? 'text' : 'empty';
}

function contentOf(row) {
  const cells = cellsOf(row);
  return (cells.length ? cells : [row]).flatMap((cell) => [...cell.childNodes]);
}

function partsOfRow(row, make) {
  const cells = cellsOf(row);
  return (cells.length ? cells : [row]).flatMap((cell) => paragraphsOf(cell, make));
}

function decorateLogoWall(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.logoWallDecorated) return;
  const { make } = ctx;
  const rows = rowsOf(el);
  const kinds = rows.map(rowKind);
  const firstLogo = kinds.indexOf('logo');
  if (firstLogo < 0) return;
  el.dataset.logoWallDecorated = 'true';
  const lastLogo = kinds.lastIndexOf('logo');
  svgLinksToPictures(el, make, el.ownerDocument.defaultView);
  linkShims(el);

  const head = make('div', { class: 'logo-wall-head' });
  const list = make('ul', { class: 'logo-wall-list' });
  const foot = make('div', { class: 'logo-wall-foot' });
  const kept = [];
  rows.forEach((row, i) => {
    const kind = kinds[i];
    if (kind === 'empty') return;
    if (kind === 'logo') {
      const item = make('li', { class: 'logo-wall-item' });
      item.append(...contentOf(row));
      item.querySelectorAll('a[href]').forEach((a) => a.classList.add('logo-wall-link'));
      list.append(item);
      return;
    }
    if (i < firstLogo && (kind === 'head' || kind === 'text')) {
      head.append(...partsOfRow(row, make));
      return;
    }
    if (i > lastLogo && (kind === 'link' || kind === 'text')) {
      foot.append(...partsOfRow(row, make));
      return;
    }
    row.classList.add('logo-wall-row');
    kept.push([i, row]);
  });
  const parts = [];
  if (head.childNodes.length) {
    head.querySelectorAll(HEADINGS).forEach((h) => h.classList.add('logo-wall-heading'));
    parts.push(head);
  }
  parts.push(list);
  kept.forEach(([, row]) => parts.push(row));
  if (foot.childNodes.length) {
    buttonsKeepingProtocol(foot);
    parts.push(foot);
  }
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'logo-wall': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateLogoWall,
  },
};

const REVEAL = '.logo-wall-head, .logo-wall-item, .logo-wall-foot';

export default function decorate(el) {
  const block = dispatch(el, MEMBERS, { block: FAMILY });
  return revealAfter(block, el, () => el.querySelectorAll(REVEAL));
}
