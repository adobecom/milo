import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';
import { CDN_WHITELISTED_ORIGINS } from '../_shared/urls.js';
import { revealAfter } from '../_shared/motion.js';

const FAMILY = 'customer-story';
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

function partsOf(el, make, keep = false) {
  return rowsOf(el)
    .flatMap((row) => { const cells = cellsOf(row); return cells.length ? cells : [row]; })
    .flatMap((cell) => paragraphsOf(cell, make, { keep, media: true }));
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

function decorateCustomerStory(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.customerStoryDecorated) return;
  const { make } = ctx;
  if (!readStory(partsOf(el, make, true)).headline) return;
  el.dataset.customerStoryDecorated = 'true';
  svgLinksToPictures(el, make, el.ownerDocument.defaultView);
  linkShims(el);
  const story = readStory(partsOf(el, make));

  const body = make('div', { class: 'customer-story-body' });
  if (story.eyebrow.length) {
    const eyebrow = make('div', { class: 'customer-story-eyebrow' });
    eyebrow.append(...story.eyebrow);
    body.append(eyebrow);
  }
  if (story.headline) {
    story.headline.classList.add('customer-story-headline');
    body.append(story.headline);
  }
  if (story.quote.length || story.attribution) {
    const figure = make('figure', { class: 'customer-story-quote' });
    if (story.quote.length) {
      const blockquote = make('blockquote');
      blockquote.append(...story.quote);
      figure.append(blockquote);
    }
    if (story.attribution) {
      const caption = make('figcaption', { class: 'customer-story-attribution' });
      caption.append(...story.attribution.childNodes);
      figure.append(caption);
    }
    body.append(figure);
  }
  if (story.rest.length) {
    const more = make('div', { class: 'customer-story-more' });
    more.append(...story.rest);
    body.append(more);
  }
  if (story.actions.length) {
    const actions = make('div', { class: 'customer-story-actions' });
    actions.append(...story.actions);
    buttonsKeepingProtocol(actions);
    body.append(actions);
  }
  const parts = [body];
  if (story.logo) {
    const aside = make('div', { class: 'customer-story-aside' });
    const logo = make('div', { class: 'customer-story-logo' });
    logo.append(story.logo);
    aside.append(logo);
    parts.push(aside);
    el.classList.add('customer-story-has-logo');
  }
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'customer-story': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateCustomerStory,
  },
};

const REVEAL = '.customer-story-body > *, .customer-story-aside';

export default function decorate(el) {
  const block = dispatch(el, MEMBERS, { block: FAMILY });
  return revealAfter(block, el, () => el.querySelectorAll(REVEAL));
}
