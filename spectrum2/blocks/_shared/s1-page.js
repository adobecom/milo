import { applyAuthoredColour } from './background.js';

const EDS_HOST = /\.(hlx|aem)\./;
const HTTPS_URL = /^https:\/\/[^\s]+$/;
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
const PLACEHOLDER = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
// eslint-disable-next-line no-bitwise
const SHOW_ELEMENT_AND_TEXT = 0x1 | 0x4;
const URL_ATTRS = new Set(['href', 'src', 'srcset', 'poster', 'action', 'formaction', 'xlink:href']);
const SAFE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const SIZES = ['small', 'medium', 'large', 'xlarge', 'medium-compact'];

export function resolveUrl(href, base) {
  if (href === null || href === undefined) return null;
  try {
    return new URL(href, base).href;
  } catch (e) {
    return null;
  }
}

export function getBlockSize(el, defaultIndex = 1) {
  if (defaultIndex < 0 || defaultIndex > SIZES.length - 1) return null;
  return SIZES.find((size) => el.classList.contains(size)) || SIZES[defaultIndex];
}

export function imageAltsToLinks(el, make) {
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
    if (!picture || !picture.parentElement || picture.closest('a')) return;
    img.setAttribute('alt', parts[1].trim());
    if (href.includes('.mp4')) {
      const video = make('a', { href: url.href, 'data-video-poster': '' });
      picture.replaceWith(video);
      video.append(picture);
      return;
    }
    const link = make('a', { href, class: 's2-image-link' });
    picture.replaceWith(link);
    link.append(picture);
  });
}

export function svgLinksToPictures(el, make) {
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
    if (alt) {
      const heading = a.parentElement?.closest('h1, h2, h3, h4, h5, h6');
      heading?.append(make('span', { class: 's2-visually-hidden' }, alt));
    }
    if (sameFile) a.replaceWith(picture);
    else a.replaceChildren(picture);
  });
}

export function linkHashFlags(el) {
  el.querySelectorAll('a[href*="#_blank"], a[href*="#_nofollow"]').forEach((a) => {
    let href = a.getAttribute('href');
    if (href.includes('#_blank')) {
      a.setAttribute('target', '_blank');
      const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      a.setAttribute('rel', [...rel].join(' '));
      href = href.replace('#_blank', '');
    }
    if (href.includes('#_nofollow')) {
      const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('nofollow');
      a.setAttribute('rel', [...rel].join(' '));
      href = href.replace('#_nofollow', '');
    }
    a.setAttribute('href', href);
  });
}

export function pipeLabelsToAria(el) {
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
  return hit ? out.replace(/&nbsp;/g, ' ') : value;
}

export function placeholderFallbacks(el) {
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

export function pageShims(el, make) {
  imageAltsToLinks(el, make);
  svgLinksToPictures(el, make);
  linkHashFlags(el);
  pipeLabelsToAria(el);
  placeholderFallbacks(el);
}

export function adoptMiloButtons(el) {
  el.querySelectorAll('.action-area').forEach((p) => p.classList.add('s2-action-area'));
  el.querySelectorAll('a.con-button:not(.s2-button)').forEach((a) => {
    a.classList.add('s2-button', a.classList.contains('blue') ? 's2-button-accent' : 's2-button-outline');
  });
}

export function decorateBlockHrs(el, make) {
  let hasHr = false;
  const decorateHr = (tag) => {
    if (!tag.textContent.trim().startsWith('---')) return;
    hasHr = true;
    const bg = tag.textContent.trim().substring(3).trim();
    const hr = make('hr', { class: 's2-hr' });
    if (bg) applyAuthoredColour(hr, bg);
    tag.textContent = '';
    tag.append(hr);
  };
  el.querySelectorAll('p').forEach(decorateHr);
  if (el.children[0] && el.children[0].childElementCount === 0) decorateHr(el.children[0]);
  if (hasHr) el.classList.add('s2-has-divider');
  return hasHr;
}
