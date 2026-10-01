import { rowsOf, cellsOf, hasContent } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText } from '../_shared/text.js';
import { applyAuthoredColour, isAuthoredColour } from '../_shared/background.js';
import { revealAfter } from '../_shared/motion.js';

const FAMILY = 'feature-rows';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
const POSITION_WORDS = new Set(['top', 'bottom', 'left', 'right', 'center']);
const FIT_WORDS = new Set(['cover', 'contain']);
const MAX_PICTURES = 3;
const VIEWPORTS = {
  2: [['s2-mobile-only'], ['s2-tablet-only', 's2-desktop-only']],
  3: [['s2-mobile-only'], ['s2-tablet-only'], ['s2-desktop-only']],
};
const ELEMENT = 1;
const TEXT = 3;

function protocolOf(href, base) {
  try { return new URL(href, base).protocol; } catch (e) { return null; }
}
export function keepsProtocol(orig, next, base) {
  const before = protocolOf(orig, base);
  return before !== null && before === protocolOf(next, base);
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

export function readFocus(text) {
  const words = (text || '').toLowerCase().split(/[\s,]+/).filter(Boolean);
  const position = words.filter((w) => POSITION_WORDS.has(w));
  const fit = words.filter((w) => FIT_WORDS.has(w));
  if (position.length + fit.length !== words.length) return null;
  if (position.length > 2 || fit.length > 1) return null;
  return { position: position.join(' '), fit: fit[0] || '' };
}

export function readMedia(cells) {
  const pictures = [];
  const loose = [];
  let bad = false;
  const walk = (container) => {
    let last = null;
    [...container.childNodes].forEach((n) => {
      if (bad) return;
      if (n.nodeType === TEXT) {
        if (!n.nodeValue.trim()) return;
        if (last) {
          last.focusNodes.push(n);
          last.focusText = `${last.focusText} ${n.nodeValue}`;
        } else {
          loose.push(n.nodeValue.trim());
        }
        return;
      }
      if (n.nodeType !== ELEMENT) return;
      if (n.matches('picture, img')) {
        last = { picture: n, focusNodes: [], focusText: '' };
        pictures.push(last);
        return;
      }
      if (n.matches('br')) return;
      if (n.matches('p, div') && !n.matches(HEADINGS)) {
        walk(n);
        return;
      }
      bad = true;
    });
  };
  cells.forEach(walk);
  if (bad) return null;
  if (pictures.length) {
    if (loose.length || pictures.length > MAX_PICTURES) return null;
    for (const p of pictures) {
      p.focus = readFocus(p.focusText);
      if (!p.focus) return null;
    }
    return { kind: 'pictures', pictures };
  }
  const colour = loose.join(' ').trim();
  if (!colour) return { kind: 'tile' };
  return isAuthoredColour(colour) ? { kind: 'colour', colour } : null;
}

const headingCount = (cell) => cell.querySelectorAll(HEADINGS).length;

function readFeature(cells) {
  const withHeading = cells.filter((c) => headingCount(c) > 0);
  if (withHeading.length !== 1 || headingCount(withHeading[0]) !== 1) return null;
  const [text] = withHeading;
  const media = readMedia(cells.filter((c) => c !== text));
  return media ? { text, media } : null;
}

export function readTable(el) {
  const rows = rowsOf(el).filter((row) => hasContent(row));
  if (!rows.length) return null;
  const cellsOfRow = (row) => { const cells = cellsOf(row); return cells.length ? cells : [row]; };
  let intro = null;
  let start = 0;
  if (rows.length > 1 && cellsOfRow(rows[0]).length === 1) {
    [intro] = cellsOfRow(rows[0]);
    start = 1;
  }
  const features = [];
  for (const row of rows.slice(start)) {
    const feature = readFeature(cellsOfRow(row));
    if (!feature) return null;
    features.push(feature);
  }
  return features.length ? { intro, features } : null;
}

function renderMedia(media, make) {
  const box = make('div', { class: 'feature-rows-media' });
  if (media.kind === 'tile') {
    box.classList.add('feature-rows-media-tile');
    return box;
  }
  if (media.kind === 'colour') {
    box.classList.add('feature-rows-media-colour');
    applyAuthoredColour(box, media.colour);
    return box;
  }
  box.classList.add('feature-rows-media-picture');
  const viewports = VIEWPORTS[media.pictures.length] || [[]];
  media.pictures.forEach((p, i) => {
    const frame = make('div', { class: 'feature-rows-picture' });
    frame.classList.add(...(viewports[i] || []));
    if (p.focus.fit === 'contain') frame.classList.add('feature-rows-picture-contain');
    const img = p.picture.matches('img') ? p.picture : p.picture.querySelector('img');
    if (img && p.focus.position) img.style.setProperty('--_object-position', p.focus.position);
    p.focusNodes.forEach((n) => n.remove());
    frame.append(p.picture);
    box.append(frame);
  });
  return box;
}

function renderText(cell, make) {
  const text = make('div', { class: 'feature-rows-text' });
  text.append(...cell.childNodes);
  decorateBlockText(text, { origin: 'c1', heading: 'xl', body: 'm', detail: 'm' });
  const heading = text.querySelector(HEADINGS);
  heading?.classList.add('feature-rows-title');
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.classList.contains('s2-detail-m')) eyebrow.classList.add('feature-rows-eyebrow');
  return text;
}

function renderIntro(cell, make) {
  const intro = make('div', { class: 'feature-rows-intro' });
  intro.append(...cell.childNodes);
  decorateBlockText(intro, { origin: 'c1', heading: 'xxl', body: 'l' });
  intro.querySelector(HEADINGS)?.classList.add('feature-rows-intro-heading');
  return intro;
}

function decorateFeatureRows(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.featureRowsDecorated) return;
  const table = readTable(el);
  if (!table) return;
  el.dataset.featureRowsDecorated = 'true';
  linkShims(el);
  const { make } = ctx;
  const parts = [];
  if (table.intro) parts.push(renderIntro(table.intro, make));
  const list = make('div', { class: 'feature-rows-list' });
  table.features.forEach((feature) => {
    const row = make('div', { class: `feature-rows-row feature-rows-row-${feature.media.kind}` });
    row.append(renderText(feature.text, make), renderMedia(feature.media, make));
    list.append(row);
  });
  parts.push(list);
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'feature-rows': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateFeatureRows,
  },
};

const REVEAL = '.feature-rows-intro, .feature-rows-row';

export default function decorate(el) {
  const block = dispatch(el, MEMBERS, { block: FAMILY });
  return revealAfter(block, el, () => el.querySelectorAll(REVEAL));
}
