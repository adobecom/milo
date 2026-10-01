import { rowsOf, cellsOf, textOf, hasContent } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { decorateBlockBg, isAuthoredColour } from '../_shared/background.js';
import { revealAfter } from '../_shared/motion.js';

const FAMILY = 'stage-hero';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const PICTURES = 'picture, img';
const MOVING = 'video, iframe, a[href*=".mp4"]';
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
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

function cellsOrRow(row) {
  const cells = cellsOf(row);
  return cells.length ? cells : [row];
}
function nodesOf(row) {
  return cellsOrRow(row)
    .flatMap((cell) => [...cell.childNodes])
    .filter((n) => n.nodeType === ELEMENT || (n.nodeType === TEXT && n.nodeValue.trim()));
}
function partsOf(row, make) {
  return cellsOrRow(row).flatMap((cell) => paragraphsOf(cell, make));
}

const isHeading = (n) => n.nodeType === ELEMENT && n.matches(HEADINGS);
const isLinks = (n) => {
  if (n.nodeType !== ELEMENT) return false;
  if (n.matches('a[href]')) return true;
  const links = [...n.querySelectorAll('a[href]')];
  if (!links.length) return false;
  return textOf(n) === links.map((a) => textOf(a)).filter(Boolean).join(' ') || !textOf(n);
};

export function isPhotoRow(row) {
  if (!row || row.querySelector(HEADINGS) || row.querySelector(MOVING)) return false;
  const cells = cellsOf(row);
  if (!cells.length) return false;
  const filled = cells.filter((c) => hasContent(c));
  if (!filled.length) return false;
  return filled.every((c) => (c.querySelector(PICTURES)
    ? !textOf(c)
    : isAuthoredColour(textOf(c))));
}

export function readStage(el) {
  const rows = rowsOf(el).filter((r) => hasContent(r));
  const copyAt = rows.findIndex((r) => nodesOf(r).some(isHeading));
  if (copyAt < 0 || copyAt > 1) return null;
  if (copyAt === 1 && !isPhotoRow(rows[0])) return null;
  if (rows.length > copyAt + 2) return null;
  const panel = rows[copyAt + 1] || null;
  if (panel && panel.querySelector(MOVING)) return null;
  return { photo: copyAt === 1 ? rows[0] : null, copy: rows[copyAt], panel };
}

export function readCopy(nodes) {
  const headings = nodes.map((n, i) => (isHeading(n) ? i : -1)).filter((i) => i >= 0);
  const at = headings.length > 1 ? headings[1] : headings[0];
  const copy = { eyebrow: nodes.slice(0, at), heading: nodes[at], lede: [], actions: [] };
  nodes.slice(at + 1)
    .forEach((n) => (isLinks(n) && !isHeading(n) ? copy.actions : copy.lede).push(n));
  return copy;
}

export function readPanel(nodes) {
  const panel = { intro: [], links: [], note: [] };
  nodes.forEach((n) => {
    if (isLinks(n) && !panel.note.length) panel.links.push(n);
    else if (!panel.links.length) panel.intro.push(n);
    else panel.note.push(n);
  });
  return panel;
}

function group(make, cls, nodes) {
  if (!nodes.length) return null;
  const box = make('div', { class: cls });
  box.append(...nodes);
  return box;
}

function decorateStage(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.stageHeroDecorated) return;
  const { make } = ctx;
  const stage = readStage(el);
  if (!stage) return;
  el.dataset.stageHeroDecorated = 'true';
  linkShims(el);

  const parts = [];
  if (stage.photo) {
    const hasPicture = !!stage.photo.querySelector(PICTURES);
    if (decorateBlockBg(el, stage.photo).kind === 'media') {
      stage.photo.classList.add('stage-hero-media');
      parts.push(stage.photo);
      if (hasPicture) el.classList.add('stage-hero-has-photo');
    }
  }

  const copy = readCopy(partsOf(stage.copy, make));
  copy.heading.classList.add('stage-hero-heading');
  const actions = group(make, 'stage-hero-actions', copy.actions);
  if (actions) decorateButtons(actions);
  const copyBox = make('div', { class: 'stage-hero-copy' });
  copyBox.append(...[
    group(make, 'stage-hero-eyebrow', copy.eyebrow),
    copy.heading,
    group(make, 'stage-hero-lede', copy.lede),
    actions,
  ].filter(Boolean));

  const body = make('div', { class: 'stage-hero-body' });
  body.append(copyBox);
  if (stage.panel) {
    const panel = readPanel(partsOf(stage.panel, make));
    const links = group(make, 'stage-hero-panel-links', panel.links);
    links?.querySelectorAll('a[href]').forEach((a) => a.classList.add('stage-hero-panel-link'));
    const panelBox = make('div', { class: 'stage-hero-panel' });
    panelBox.append(...[
      group(make, 'stage-hero-panel-intro', panel.intro),
      links,
      group(make, 'stage-hero-panel-note', panel.note),
    ].filter(Boolean));
    body.append(panelBox);
    el.classList.add('stage-hero-has-panel');
  }
  parts.push(body);
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'stage-hero': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateStage,
  },
};

const REVEAL = '.stage-hero-copy > *, .stage-hero-panel';

export default function decorate(el) {
  const block = dispatch(el, MEMBERS, { block: FAMILY });
  return revealAfter(block, el, () => el.querySelectorAll(REVEAL));
}
