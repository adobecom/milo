import { textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText, applyTextOverrides } from '../_shared/text.js';

const VARIANTS = ['full-width', 'vertical', 'bio', 'inline'];
const SIZES = ['small', 'medium', 'large', 'xlarge', 'medium-compact'];
const DEFAULT_SIZE = 'large';
const TEXT_SIZES = {
  small: { 'full-width': ['m', 'm'], vertical: ['s', 'm'], bio: ['s', 's'], inline: ['s', 's'] },
  medium: { 'full-width': ['l', 'm'], vertical: ['m', 'm'], bio: ['s', 's'], inline: ['s', 's'] },
  large: { 'full-width': ['xl', 'm'], vertical: ['m', 'm'], bio: ['s', 's'], inline: ['s', 's'] },
};
const UP_AND_INLINE_SIZES = ['xs', 's'];
const N_UP = /(two|three|four)[- ]?up/i;
const EDS_HOST = /\.(hlx|aem)\./;
const HTTPS_URL = /^https:\/\/[^\s]+$/;
const GENERIC_LINK = /^(learn more|read more|see more|find out more|discover more|more|click here|explore|details)$/i;
const INTERACTIVE = 'a, button, input, select, textarea, iframe, details, summary, [tabindex], audio[controls], video[controls]';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
const PLACEHOLDER = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
// eslint-disable-next-line no-bitwise
const SHOW_ELEMENT_AND_TEXT = 0x1 | 0x4;

function resolveUrl(href, base) {
  if (href === null || href === undefined) return null;
  try {
    return new URL(href, base).href;
  } catch (e) {
    return null;
  }
}

export function blockSize(el) {
  const found = SIZES.find((size) => el.classList.contains(size)) || DEFAULT_SIZE;
  return TEXT_SIZES[found] ? found : DEFAULT_SIZE;
}

export function blockVariant(el) {
  return VARIANTS.find((v) => el.classList.contains(v)) ?? VARIANTS[0];
}

export function upAndInline(el) {
  if (!el.classList.contains('inline')) return false;
  const section = el.parentElement?.closest('.section');
  if (section && N_UP.test(section.className)) return true;
  const sectionMetadata = el.parentElement?.querySelector('.section-metadata');
  return !!sectionMetadata && N_UP.test(sectionMetadata.textContent || '');
}

export function textSizes(el) {
  if (upAndInline(el)) return UP_AND_INLINE_SIZES;
  return TEXT_SIZES[blockSize(el)][blockVariant(el)];
}

function svgLinksToPictures(el, make) {
  const base = el.ownerDocument.baseURI;
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
    const alt = rest.join('|').trim();
    const sameFile = authored.pathname === linked.pathname;
    let src = authored.href;
    if (sameFile) src = href;
    else if (EDS_HOST.test(authored.hostname)) src = authored.pathname;
    const picture = make('picture', {}, make('img', { loading: 'lazy', src, alt }));
    if (sameFile) a.replaceWith(picture);
    else a.replaceChildren(picture);
  });
}

function imageAltsToLinks(el, make) {
  el.querySelectorAll('img[alt*="|"]').forEach((img) => {
    const parts = img.getAttribute('alt').split('|');
    const source = parts[0].trim();
    if (parts.length !== 2 || !HTTPS_URL.test(source)) return;
    let url;
    try {
      url = new URL(source);
    } catch (e) {
      return;
    }
    const href = EDS_HOST.test(url.hostname) ? `${url.pathname}${url.search}${url.hash}` : url.href;
    const picture = img.closest('picture');
    if (href.includes('.mp4') || !picture || !picture.parentElement || picture.closest('a')) return;
    img.setAttribute('alt', parts[1].trim());
    const link = make('a', { href });
    picture.replaceWith(link);
    link.append(picture);
  });
}

function pipeLabelsToAria(el) {
  el.querySelectorAll('a').forEach((a) => {
    const text = a.textContent || '';
    if (!PIPE_LABEL.test(text) || HAS_EXTENSION.test(text)) return;
    const node = a.lastChild;
    const label = node?.textContent.match(PIPE_LABEL)?.[1];
    if (label === undefined) return;
    node.textContent = node.textContent.replace(PIPE_LABEL, '');
    if (label.trim()) a.setAttribute('aria-label', label.trim());
  });
}

const URL_ATTRS = new Set(['href', 'src', 'srcset', 'poster', 'action', 'formaction', 'xlink:href']);
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
function safeUrl(value, base) {
  return String(value).split(',').every((part) => {
    const url = part.trim().split(/\s+/)[0];
    if (!url) return true;
    try { return SAFE_SCHEMES.has(new URL(url, base).protocol); } catch { return false; }
  });
}

function withPlaceholderFallbacks(value) {
  let hit = false;
  const out = value.replace(PLACEHOLDER, (match, key, encodedKey) => {
    hit = true;
    return (key || encodedKey || '').replaceAll('-', ' ');
  });
  return hit ? out.replace(/&nbsp;/g, '\u00A0') : value;
}

function placeholderFallbacks(el) {
  const walker = el.ownerDocument.createTreeWalker(el, SHOW_ELEMENT_AND_TEXT);
  for (let node = el; node; node = walker.nextNode()) {
    if (node.nodeType === 3) {
      const value = withPlaceholderFallbacks(node.nodeValue);
      if (value !== node.nodeValue) node.nodeValue = value;
    } else {
      [...node.attributes].forEach(({ name, value }) => {
        const next = withPlaceholderFallbacks(value);
        if (next === value) return;
        if (URL_ATTRS.has(name.toLowerCase()) && !safeUrl(next, el.ownerDocument.baseURI)) {
          node.removeAttribute(name);
          return;
        }
        node.setAttribute(name, next);
      });
    }
  }
}

function loneActionLink(lastElem, iconP) {
  if (!lastElem || lastElem === iconP || lastElem.children.length !== 1) return null;
  const link = lastElem.lastElementChild;
  if (link.nodeName !== 'A' || !textOf(link) || textOf(link) !== textOf(lastElem)) return null;
  return link;
}

function wrapIconAndAction(text, iconP, iconLink, lastElem, actionLink, make) {
  if (iconP.parentElement !== text || lastElem.parentElement !== text) return null;
  const base = text.ownerDocument.baseURI;
  const target = resolveUrl(actionLink.getAttribute('href'), base);
  if (!target || resolveUrl(iconLink.getAttribute('href'), base) !== target) return null;
  const range = [];
  for (let node = iconP; node; node = node.nextSibling) {
    range.push(node);
    if (node === lastElem) break;
  }
  if (range[range.length - 1] !== lastElem) return null;
  const inner = range
    .filter((node) => node.nodeType === 1)
    .flatMap((node) => [node, ...node.querySelectorAll('*')])
    .filter((node) => node !== iconLink && node !== actionLink && node.matches(INTERACTIVE));
  const sameUrl = inner.filter((node) => node.matches('a[href]')
    && resolveUrl(node.getAttribute('href'), base) === target);
  if (sameUrl.length !== inner.length) return null;
  const wrapper = make('a', {
    href: actionLink.getAttribute('href'),
    class: 'icon-block-wrapper-anchor',
    target: actionLink.getAttribute('target'),
    rel: actionLink.getAttribute('rel'),
  });
  [iconLink, ...sameUrl].forEach((link) => link.replaceWith(...link.childNodes));
  lastElem.replaceChildren(...actionLink.childNodes);
  iconP.before(wrapper);
  wrapper.append(...range);
  return wrapper;
}

function decorateInline(el, host, make) {
  const secondColumn = make('div', { class: 'icon-block-second-column' });
  [...host.children]
    .filter((child) => !child.classList.contains('icon-block-icon-area'))
    .forEach((content) => {
      let node = content;
      const firstIcon = content.querySelector('.icon:first-child');
      if (firstIcon) {
        node = make('span', { class: 'icon-block-title-row' });
        node.append(firstIcon, content);
      }
      secondColumn.append(node);
    });
  if (secondColumn.children.length === 1) el.classList.add('icon-block-items-center');
  host.append(secondColumn);
}

function decorateCtaContainer(el, make) {
  const lastActionArea = el.querySelector('.s2-action-area:last-of-type');
  if (!lastActionArea) return;
  const container = make('div', { class: 'icon-block-cta-container' });
  lastActionArea.after(container);
  const previous = lastActionArea.previousElementSibling;
  if (previous?.classList.contains('s2-action-area')) container.append(previous);
  container.append(lastActionArea);
}

function adoptMiloButtons(el) {
  el.querySelectorAll('.action-area').forEach((p) => p.classList.add('s2-action-area'));
  el.querySelectorAll('a.con-button:not(.s2-button)').forEach((a) => {
    a.classList.add('s2-button', a.classList.contains('blue') ? 's2-button-accent' : 's2-button-outline');
  });
}

function uniqueId(doc, stem) {
  let n = 1;
  while (doc.getElementById(`${stem}-${n}`)) n += 1;
  return `${stem}-${n}`;
}

function nameWrapper(wrapper) {
  const doc = wrapper.ownerDocument;
  const heading = wrapper.querySelector(HEADINGS);
  const action = wrapper.querySelector('.s2-action-area');
  if (!heading || !action) return;
  if (!heading.id) heading.id = uniqueId(doc, 'icon-block-heading');
  if (!action.id) action.id = uniqueId(doc, 'icon-block-action');
  wrapper.setAttribute('aria-labelledby', `${heading.id} ${action.id}`);
}

function describeGenericLinks(el) {
  const heading = el.querySelector(HEADINGS);
  if (!heading) return;
  el.querySelectorAll('a[href]').forEach((a) => {
    if (a.classList.contains('icon-block-wrapper-anchor') || heading.contains(a)) return;
    if (a.hasAttribute('aria-label') || a.hasAttribute('aria-describedby')) return;
    if (!GENERIC_LINK.test(textOf(a))) return;
    if (!heading.id) heading.id = uniqueId(el.ownerDocument, 'icon-block-heading');
    a.setAttribute('aria-describedby', heading.id);
  });
}

function decorateIconBlock(el, ctx) {
  const { make } = ctx;
  if (el.classList.contains('intro')) el.classList.add('xxxl-spacing-top', 'xl-spacing-static-bottom');
  if (el.classList.contains('fullwidth')) el.classList.replace('fullwidth', 'full-width');
  imageAltsToLinks(el, make);
  svgLinksToPictures(el, make);
  pipeLabelsToAria(el);
  placeholderFallbacks(el);

  const row = el.querySelector(':scope > div:not([class])');
  if (!row) return;
  row.classList.add('icon-block-foreground');
  const text = row.querySelector(`${HEADINGS}, p`)?.closest('div');
  if (!text) return;
  text.classList.add('icon-block-text');

  const image = row.querySelector('img');
  const iconP = image?.closest('p') ?? null;
  const lastElem = text.lastElementChild;
  const actionLink = loneActionLink(lastElem, iconP);
  if (actionLink) lastElem.classList.add('s2-action-area');
  iconP?.classList.add('icon-block-icon-area');
  const iconLink = iconP?.querySelector('a');
  const wrapper = iconLink && actionLink
    ? wrapIconAndAction(text, iconP, iconLink, lastElem, actionLink, make)
    : null;

  const [heading, body] = textSizes(el);
  decorateBlockText(el, { origin: ctx.origin, heading, body });
  applyTextOverrides(el, ctx.overrides);

  if (el.classList.contains('inline')) decorateInline(el, wrapper || text, make);
  adoptMiloButtons(el);
  decorateCtaContainer(el, make);
  describeGenericLinks(el);
  if (wrapper) nameWrapper(wrapper);
}

export const MEMBERS = {
  'icon-block': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateIconBlock,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'icon-block' });
}
