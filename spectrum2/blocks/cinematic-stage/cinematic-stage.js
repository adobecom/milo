import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { isAuthoredColour, applyAuthoredColour } from '../_shared/background.js';

const FAMILY = 'cinematic-stage';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
export const MAX_STAGGER = 12;
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

const LOOSE = new WeakSet();
function partsOf(el, make, keep = false) {
  return rowsOf(el)
    .flatMap((row) => { const cells = cellsOf(row); return cells.length ? cells : [row]; })
    .flatMap((cell) => {
      const authored = new Set(cell.childNodes);
      return paragraphsOf(cell, make, { keep }).map((n) => {
        if (!authored.has(n) && !n.children.length) LOOSE.add(n);
        return n;
      });
    });
}

const isHeading = (n) => n.matches(HEADINGS);
const isPicture = (n) => !!(n.matches('picture, img') || n.querySelector('picture, img')) && !textOf(n);
const isColour = (n) => LOOSE.has(n) && isAuthoredColour(textOf(n));
const isLinks = (n) => {
  if (n.matches('a[href]')) return true;
  const links = [...n.querySelectorAll('a[href]')];
  if (!links.length) return false;
  return textOf(n) === links.map((a) => textOf(a)).filter(Boolean).join(' ');
};

export function readStage(nodes) {
  const stage = {
    picture: null, colour: null, eyebrow: [], headline: null, lede: [], actions: [],
  };
  nodes.forEach((n) => {
    if (!stage.picture && isPicture(n)) { stage.picture = n; return; }
    if (!stage.headline) {
      if (isHeading(n)) stage.headline = n;
      else if (!stage.colour && isColour(n)) stage.colour = n;
      else stage.eyebrow.push(n);
      return;
    }
    if (isLinks(n)) stage.actions.push(n);
    else stage.lede.push(n);
  });
  return stage;
}

export function splitWords(heading, make) {
  if ([...heading.children].some((c) => c.tagName !== 'BR')) return 0;
  const label = textOf(heading);
  if (!label) return 0;
  const doc = heading.ownerDocument;
  let index = 0;
  [...heading.childNodes].forEach((node) => {
    if (node.nodeType !== TEXT) return;
    const pieces = node.nodeValue.split(/(\s+)/).filter((piece) => piece !== '');
    const replacement = pieces.map((piece) => {
      if (/^\s+$/.test(piece)) return doc.createTextNode(piece);
      const word = make('span', { class: 'cinematic-stage-word', 'aria-hidden': 'true' }, piece);
      word.style.setProperty('--_word', String(Math.min(index, MAX_STAGGER)));
      index += 1;
      return word;
    });
    node.replaceWith(...replacement);
  });
  heading.setAttribute('aria-label', label);
  heading.classList.add('cinematic-stage-split');
  return index;
}

function decorateCinematicStage(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.cinematicStageDecorated) return;
  const { make } = ctx;
  if (!readStage(partsOf(el, make, true)).headline) return;
  el.dataset.cinematicStageDecorated = 'true';
  linkShims(el);
  const stage = readStage(partsOf(el, make));

  const parts = [];
  if (stage.picture) {
    const media = make('div', { class: 'cinematic-stage-media' });
    media.append(stage.picture);
    parts.push(media);
    el.classList.add('cinematic-stage-has-picture');
  }
  if (stage.colour) applyAuthoredColour(el, textOf(stage.colour));

  const body = make('div', { class: 'cinematic-stage-body' });
  if (stage.eyebrow.length) {
    const eyebrow = make('div', { class: 'cinematic-stage-eyebrow' });
    eyebrow.append(...stage.eyebrow);
    body.append(eyebrow);
  }
  stage.headline.classList.add('cinematic-stage-headline');
  splitWords(stage.headline, make);
  body.append(stage.headline);
  if (stage.lede.length) {
    const lede = make('div', { class: 'cinematic-stage-lede' });
    lede.append(...stage.lede);
    body.append(lede);
  }
  if (stage.actions.length) {
    const actions = make('div', { class: 'cinematic-stage-actions' });
    actions.append(...stage.actions);
    decorateButtons(actions);
    body.append(actions);
  }
  parts.push(body);
  if (stage.picture || stage.colour) el.classList.add('dark');
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'cinematic-stage': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateCinematicStage,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
