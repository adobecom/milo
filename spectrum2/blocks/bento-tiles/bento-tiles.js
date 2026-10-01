import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { revealAfter } from '../_shared/motion.js';

const FAMILY = 'bento-tiles';
const SIZES = ['large', 'medium', 'small'];
const COLUMNS = 6;
const SPAN = { small: 2, medium: 3 };
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const MEDIA = 'picture, img, video';
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;

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

const cellsOfRow = (row) => { const cells = cellsOf(row); return cells.length ? cells : [row]; };
const hasMedia = (n) => n.matches(MEDIA) || !!n.querySelector(MEDIA);
const isMediaOnly = (n) => hasMedia(n) && !textOf(n);
const hasHeading = (n) => n.matches(HEADINGS) || !!n.querySelector(HEADINGS);
const hasLink = (n) => n.matches('a[href]') || !!n.querySelector('a[href]');

export function sizeOf(cell) {
  if (!cell || hasMedia(cell) || hasLink(cell) || hasHeading(cell)) return null;
  const word = textOf(cell).toLowerCase();
  return SIZES.includes(word) ? word : null;
}

function partsOf(cells, make) {
  return cells.flatMap((cell) => paragraphsOf(cell, make));
}

export function readTable(el) {
  let head = null;
  const tiles = [];
  rowsOf(el).forEach((row) => {
    const cells = cellsOfRow(row).filter((c) => textOf(c) || hasMedia(c) || c.querySelector(':not(br)'));
    if (!cells.length) return;
    const size = cells.length > 1 ? sizeOf(cells[0]) : null;
    const content = size ? cells.slice(1) : cells;
    const isHead = !head && !tiles.length && !size
      && content.some(hasHeading) && !content.some(hasMedia) && !content.some(hasLink);
    if (isHead) head = content;
    else tiles.push({ size, cells: content });
  });
  return tiles.length ? { head, tiles } : null;
}

export function layoutOf(sizes) {
  const out = sizes.map((s, i) => ({ size: s || (i === 0 ? 'large' : 'small'), span: 0, lead: false, tabletFull: false }));
  let row = [];
  let used = 0;
  const flush = () => {
    let spare = COLUMNS - used;
    while (row.length && spare > 0) {
      const t = row.reduce((min, cur) => (cur.span <= min.span ? cur : min));
      t.span += 1;
      spare -= 1;
    }
    row = [];
    used = 0;
  };
  for (let i = 0; i < out.length; i += 1) {
    const t = out[i];
    if (t.size === 'large') {
      flush();
      const side = [];
      for (let k = i + 1; k < out.length && side.length < 2 && out[k].size !== 'large'; k += 1) side.push(out[k]);
      if (side.length === 2) {
        Object.assign(t, { span: COLUMNS - 2, lead: true });
        side.forEach((s) => { s.span = 2; });
      } else {
        t.span = COLUMNS / (side.length + 1);
        side.forEach((s) => { s.span = t.span; });
      }
      i += side.length;
    } else {
      const span = SPAN[t.size];
      if (used + span > COLUMNS) flush();
      t.span = span;
      used += span;
      row.push(t);
    }
  }
  flush();
  let col = 0;
  let prev = null;
  out.forEach((t) => {
    if (t.lead || t.span === COLUMNS) {
      if (col === 1 && prev) prev.tabletFull = true;
      t.tabletFull = true;
      col = 0;
    } else {
      col = (col + 1) % 2;
    }
    prev = t;
  });
  if (col === 1 && prev) prev.tabletFull = true;
  return out;
}

function buildTile(tile, layout, make) {
  const nodes = partsOf(tile.cells, make);
  const classes = ['bento-tiles-tile', `bento-tiles-${layout.size}`, `bento-tiles-span-${layout.span}`];
  if (layout.lead) classes.push('bento-tiles-lead');
  if (layout.tabletFull) classes.push('bento-tiles-tablet-full');
  const li = make('li', { class: classes.join(' ') });

  const media = nodes.find(isMediaOnly);
  const heading = nodes.find((n) => n !== media && n.matches(HEADINGS));
  const body = make('div', { class: 'bento-tiles-body' });
  const rest = nodes.filter((n) => n !== media);
  const at = heading ? rest.indexOf(heading) : -1;
  const actions = [];
  rest.forEach((n, i) => {
    if (n === heading) {
      n.classList.add('bento-tiles-heading');
    } else if (i > at && hasLink(n) && !hasMedia(n) && (n.matches('a[href]')
      || textOf(n) === [...n.querySelectorAll('a[href]')].map((a) => textOf(a)).filter(Boolean).join(' '))) {
      actions.push(n);
      return;
    }
    body.append(n);
  });
  const badge = heading?.previousElementSibling;
  if (badge && badge.matches('p') && textOf(badge) && !hasMedia(badge) && !hasLink(badge)) badge.classList.add('bento-tiles-badge');
  if (actions.length) {
    const area = make('div', { class: 'bento-tiles-actions' });
    area.append(...actions);
    decorateButtons(area);
    body.append(area);
  }
  if (media) {
    li.append(make('div', { class: 'bento-tiles-media' }, media));
    li.classList.add('bento-tiles-has-media');
  }
  li.append(body);
  return li;
}

function decorateBentoTiles(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.bentoTilesDecorated) return;
  const { make } = ctx;
  const table = readTable(el);
  if (!table) return;
  el.dataset.bentoTilesDecorated = 'true';
  linkShims(el);
  const { head, tiles } = table;
  const parts = [];
  if (head) {
    const box = make('div', { class: 'bento-tiles-head' });
    const nodes = partsOf(head, make);
    nodes.find((n) => n.matches(HEADINGS))?.classList.add('bento-tiles-title');
    box.append(...nodes);
    parts.push(box);
  }
  const layout = layoutOf(tiles.map((t) => t.size));
  const grid = make('ul', { class: 'bento-tiles-grid' });
  tiles.forEach((tile, i) => grid.append(buildTile(tile, layout[i], make)));
  parts.push(grid);
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'bento-tiles': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateBentoTiles,
  },
};

const REVEAL = '.bento-tiles-head, .bento-tiles-tile';

export default function decorate(el) {
  const block = dispatch(el, MEMBERS, { block: FAMILY });
  return revealAfter(block, el, () => el.querySelectorAll(REVEAL));
}
