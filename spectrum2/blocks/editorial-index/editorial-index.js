import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { CDN_WHITELISTED_ORIGINS } from '../_shared/urls.js';

const FAMILY = 'editorial-index';
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

function buttonsKeepingProtocol(container) {
  const base = container.ownerDocument.baseURI;
  const before = new Map([...container.querySelectorAll('a[href]')].map((a) => [a, a.getAttribute('href')]));
  const buttons = decorateButtons(container);
  before.forEach((orig, a) => {
    const now = a.getAttribute('href');
    if (now !== orig && !keepsProtocol(orig, now, base)) a.setAttribute('href', orig);
  });
  return buttons;
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

export function rowKind(row) {
  if (row.querySelector(HEADINGS)) return 'head';
  if (row.querySelector('picture, img') || [...row.querySelectorAll('a[href]')].some(isSvgLink)) return 'logo';
  if (row.querySelector('a[href]')) return 'link';
  return (row.textContent || '').trim() ? 'text' : 'empty';
}

export function readIndex(rows) {
  const kinds = rows.map(rowKind);
  const firstLogo = kinds.indexOf('logo');
  if (firstLogo < 0) return null;
  let storyStart = kinds.findIndex((k, i) => i > firstLogo && k === 'head');
  if (storyStart < 0) storyStart = rows.length;
  const plan = { head: [], logos: [], foot: [], kept: [], story: rows.slice(storyStart) };
  let lastLogo = firstLogo;
  kinds.forEach((k, i) => { if (k === 'logo' && i < storyStart) lastLogo = i; });
  rows.slice(0, storyStart).forEach((row, i) => {
    const k = kinds[i];
    if (k === 'empty') return;
    if (k === 'logo') plan.logos.push(row);
    else if (i < firstLogo && (k === 'head' || k === 'text')) plan.head.push(row);
    else if (i > lastLogo && (k === 'link' || k === 'text')) plan.foot.push(row);
    else plan.kept.push(row);
  });
  return plan;
}

function contentOf(row) {
  const cells = cellsOf(row);
  return (cells.length ? cells : [row]).flatMap((cell) => [...cell.childNodes]);
}

function partsOfRow(row, make) {
  const cells = cellsOf(row);
  return (cells.length ? cells : [row]).flatMap((cell) => paragraphsOf(cell, make));
}

function partsOf(rows, make) {
  return rows
    .flatMap((row) => { const cells = cellsOf(row); return cells.length ? cells : [row]; })
    .flatMap((cell) => paragraphsOf(cell, make, { media: true }));
}

const isHeading = (n) => n.matches(HEADINGS);
const isLogo = (n) => !!(n.matches('picture, img') || n.querySelector('picture, img')) && !textOf(n);
const isLinks = (n) => {
  const links = [...n.querySelectorAll('a[href]')];
  if (n.matches('a[href]')) return true;
  if (!links.length) return false;
  return textOf(n) === links.map((a) => textOf(a)).filter(Boolean).join(' ') || !textOf(n);
};
const isAttribution = (n) => {
  if (n.matches('a[href]') || n.querySelector('a[href]')) return false;
  if (n.matches('strong, b')) return !!textOf(n);
  const bold = [...n.querySelectorAll('strong, b')].map((s) => textOf(s)).join(' ');
  return !!bold && bold === textOf(n);
};

export function readStory(nodes) {
  const story = {
    eyebrow: [], logo: null, headline: null, quote: [], attribution: null, actions: [], rest: [],
  };
  nodes.forEach((n) => {
    if (!story.logo && isLogo(n)) { story.logo = n; return; }
    if (!story.headline) {
      if (isHeading(n)) story.headline = n;
      else story.eyebrow.push(n);
      return;
    }
    if (isLinks(n) && !isLogo(n)) { story.actions.push(n); return; }
    if (!story.attribution && story.quote.length && isAttribution(n)) {
      story.attribution = n;
      return;
    }
    if (!story.attribution && !story.actions.length && !isHeading(n)) {
      story.quote.push(n);
      return;
    }
    story.rest.push(n);
  });
  return story;
}

function logoItem(row, make) {
  const item = make('li', { class: 'editorial-index-item' });
  item.append(...contentOf(row));
  const img = item.querySelector('img');
  const name = (img?.getAttribute('alt') || '').trim();
  const link = item.querySelector('a[href]');
  link?.classList.add('editorial-index-link');
  if (name && !textOf(item)) (link ?? item).append(make('span', { class: 'editorial-index-label', 'aria-hidden': 'true' }, name));
  return item;
}

function storyCard(rows, make) {
  const story = readStory(partsOf(rows, make));
  if (!story.headline) return null;
  const card = make('div', { class: 'editorial-index-story' });
  const lead = make('div', { class: 'editorial-index-story-lead' });
  if (story.logo) {
    const logo = make('div', { class: 'editorial-index-story-logo' });
    logo.append(story.logo);
    lead.append(logo);
  }
  if (story.eyebrow.length) {
    const eyebrow = make('div', { class: 'editorial-index-story-eyebrow' });
    eyebrow.append(...story.eyebrow);
    lead.append(eyebrow);
  }
  story.headline.classList.add('editorial-index-story-headline');
  lead.append(story.headline);
  const body = make('div', { class: 'editorial-index-story-body' });
  if (story.quote.length || story.attribution) {
    const figure = make('figure', { class: 'editorial-index-story-quote' });
    if (story.quote.length) {
      const blockquote = make('blockquote');
      blockquote.append(...story.quote);
      figure.append(blockquote);
    }
    if (story.attribution) {
      const caption = make('figcaption', { class: 'editorial-index-story-attribution' });
      caption.append(...story.attribution.childNodes);
      figure.append(caption);
    }
    body.append(figure);
  }
  if (story.rest.length) {
    const more = make('div', { class: 'editorial-index-story-more' });
    more.append(...story.rest);
    body.append(more);
  }
  if (story.actions.length) {
    const actions = make('div', { class: 'editorial-index-story-actions' });
    actions.append(...story.actions);
    buttonsKeepingProtocol(actions);
    body.append(actions);
  }
  card.append(lead, body);
  return card;
}

function decorateEditorialIndex(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.editorialIndexDecorated) return;
  const { make } = ctx;
  if (!readIndex(rowsOf(el))) return;
  el.dataset.editorialIndexDecorated = 'true';
  const plan = readIndex(rowsOf(el));
  svgLinksToPictures(el, make, el.ownerDocument.defaultView);
  linkShims(el);

  const parts = [];
  if (plan.head.length) {
    const head = make('div', { class: 'editorial-index-head' });
    plan.head.forEach((row) => head.append(...partsOfRow(row, make)));
    head.querySelectorAll(HEADINGS).forEach((h) => h.classList.add('editorial-index-heading'));
    parts.push(head);
  }
  const list = make('ul', { class: 'editorial-index-list' });
  plan.logos.forEach((row) => list.append(logoItem(row, make)));
  parts.push(list);
  plan.kept.forEach((row) => { row.classList.add('editorial-index-row'); parts.push(row); });
  if (plan.foot.length) {
    const foot = make('div', { class: 'editorial-index-foot' });
    plan.foot.forEach((row) => foot.append(...partsOfRow(row, make)));
    buttonsKeepingProtocol(foot);
    parts.push(foot);
  }
  const card = plan.story.length ? storyCard(plan.story, make) : null;
  if (card) {
    parts.push(card);
    el.classList.add('editorial-index-has-story');
  } else {
    plan.story.forEach((row) => { row.classList.add('editorial-index-row'); parts.push(row); });
  }
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'editorial-index': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateEditorialIndex,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
