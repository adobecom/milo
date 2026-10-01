import { textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';

const FAMILY = 'event-speakers';
export const PREVIEW_LENGTH = 75;
const READ_MORE = 'Read more';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const SHOW_TEXT = 0x4;
const SPACE = /\s/;
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_PATH = 'm9.30103,6c0-.04883-.02002-.09521-.02783-.14343-.01074-.06726-.01294-.13586-.03894-.19971-.04456-.10974-.11121-.21252-.20007-.30139L4.34277.66309c-.35547-.35547-.93359-.35547-1.28906,0s-.35645.93262,0,1.28906l4.047,4.04785-4.047,4.04785c-.35645.35645-.35547.93359,0,1.28906.17773.17773.41113.2666.64453.2666s.4668-.08887.64453-.2666l4.69141-4.69238c.08887-.08887.15552-.19165.20007-.30139.026-.06384.0282-.13245.03894-.19971.00781-.04822.02783-.0946.02783-.14343Z';

const visibleLength = (node) => (node.textContent || '').replace(/\s+/g, ' ').trim().length;
const isLowSurrogate = (code) => code >= 0xDC00 && code <= 0xDFFF;

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

function blockNumber(el) {
  const doc = el.ownerDocument;
  let n = doc.querySelectorAll('[data-event-speakers-block]').length + 1;
  while (doc.getElementById(`${FAMILY}-${n}-desc-1`)) n += 1;
  el.dataset.eventSpeakersBlock = String(n);
  return n;
}

export function findCut(root, limit = PREVIEW_LENGTH) {
  if (visibleLength(root) <= limit) return null;
  const walker = root.ownerDocument.createTreeWalker(root, SHOW_TEXT);
  let count = 0;
  let prevSpace = true;
  let lastBreak = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const s = node.nodeValue;
    for (let i = 0; i < s.length; i += 1) {
      const space = SPACE.test(s[i]);
      if (!(space && prevSpace)) {
        count += 1;
        if (count > limit) {
          if (space) return { node, offset: i };
          if (lastBreak) return lastBreak;
          const offset = isLowSurrogate(s.charCodeAt(i)) ? i - 1 : i;
          return { node, offset: Math.max(offset, 0) };
        }
        if (space) lastBreak = { node, offset: i };
        prevSpace = space;
      }
    }
  }
  return null;
}

function hideAfter(root, cut, make) {
  const hidden = [];
  const wrap = (textNode) => {
    const span = make('span', { class: 'event-speakers-rest' });
    textNode.replaceWith(span);
    span.append(textNode);
    span.hidden = true;
    hidden.push(span);
    return span;
  };
  const first = wrap(cut.node.splitText(cut.offset));
  for (let node = first; node && node !== root; node = node.parentNode) {
    let sib = node.nextSibling;
    while (sib) {
      const next = sib.nextSibling;
      if (sib.nodeType === 1 && !sib.hidden) {
        sib.hidden = true;
        hidden.push(sib);
      } else if (sib.nodeType === 3 && sib.nodeValue.trim()) {
        wrap(sib);
      }
      sib = next;
    }
  }
  return { hidden, first };
}

function collapse(desc, ctx, ids) {
  const cut = findCut(desc);
  if (!cut) return null;
  const { make } = ctx;
  const { hidden, first } = hideAfter(desc, cut, make);
  const ellipsis = make('span', { class: 'event-speakers-ellipsis', 'aria-hidden': 'true' });
  first.before(ellipsis);
  const button = make('button', {
    type: 'button',
    class: 'event-speakers-more',
    'aria-expanded': 'false',
    'aria-controls': ids.desc,
    'aria-describedby': ids.name,
  });
  button.append(make('span', { class: 'event-speakers-more-label' }, ids.label), chevron(desc.ownerDocument));
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    hidden.forEach((node) => { node.hidden = !open; });
    ellipsis.hidden = open;
    button.setAttribute('aria-expanded', String(open));
    desc.classList.toggle('event-speakers-desc-open', open);
  });
  return button;
}

function decorateSpeaker(row, i, n, ctx) {
  const { make } = ctx;
  row.classList.add('event-speakers-speaker');
  const [photo, name, desc, readMore] = [...row.children].filter((cell) => cell.tagName === 'DIV');
  photo?.classList.add('event-speakers-photo');
  name?.classList.add('event-speakers-name');
  desc?.classList.add('event-speakers-desc');
  const label = textOf(readMore) || READ_MORE;
  readMore?.remove();

  const text = make('div', { class: 'event-speakers-text' });
  const anchor = name ?? desc;
  if (anchor) anchor.before(text);
  else row.append(text);
  if (name) text.append(name);
  if (!desc) return;
  text.append(desc);
  desc.id = desc.id || `${FAMILY}-${n}-desc-${i + 1}`;
  const heading = name?.querySelector(HEADINGS) ?? name?.firstElementChild ?? null;
  if (heading && !heading.id) heading.id = `${FAMILY}-${n}-name-${i + 1}`;
  const button = collapse(desc, ctx, { desc: desc.id, name: heading?.id ?? null, label });
  if (button) desc.after(button);
}

function decorateEventSpeakers(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.eventSpeakersDecorated) return;
  el.dataset.eventSpeakersDecorated = 'true';
  const n = blockNumber(el);
  [...el.children].filter((row) => row.tagName === 'DIV').forEach((row, i) => decorateSpeaker(row, i, n, ctx));
}

export const MEMBERS = {
  'event-speakers': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateEventSpeakers,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
