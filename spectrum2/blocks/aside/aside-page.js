import { textOf } from '../_shared/dom.js';
import { isAuthoredColour } from '../_shared/background.js';

const EDS_HOST = /\.(hlx|aem)\./;
const HTTPS_URL = /^https:\/\/[^\s]+$/;
const PIPE_LABEL = /\s?\|([^|]*)$/;
const HAS_EXTENSION = /\.[a-z]+/i;
const PLAY_GLYPH = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="42" viewBox="0 0 40 42" aria-hidden="true" focusable="false" class="aside-play-glyph"><path fill="currentColor" d="M36.8084 15.6746L8.93018 0.728828C4.89238 -1.43591 0 1.48158 0 6.05422V35.9458C0 40.5184 4.89238 43.4359 8.93018 41.2712L36.8084 26.3253C41.0639 24.0439 41.0638 17.956 36.8084 15.6746Z"/></svg>';

export const HEADINGS = 'h1, h2, h3, h4, h5, h6';

export function uniqueId(doc, stem) {
  let n = 1;
  while (doc.getElementById(`${stem}-${n}`)) n += 1;
  return `${stem}-${n}`;
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
    if (sameFile) a.replaceWith(picture);
    else a.replaceChildren(picture);
  });
}

function playButton(link, picture, format) {
  const img = picture.querySelector('img');
  const alt = img?.getAttribute('alt') || '';
  img?.setAttribute('role', 'none');
  const size = format.includes('-') ? format.split('-')[1] : 'large';
  link.classList.add('aside-play-link', `aside-play-${size}`);
  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', `Play${alt ? ` ${alt}` : ''}`);
  link.addEventListener('keydown', (e) => {
    if (e.key !== ' ') return;
    e.preventDefault();
    link.click();
  });
  const glyph = link.ownerDocument.createElement('span');
  glyph.className = 'aside-play-icon';
  glyph.innerHTML = PLAY_GLYPH;
  link.append(picture, glyph);
}

export function imageAltsToLinks(el, make) {
  el.querySelectorAll('img[alt*="|"]').forEach((img) => {
    const [source, alt, icon] = img.getAttribute('alt').split('|');
    const trimmed = (source || '').trim();
    if (!HTTPS_URL.test(trimmed)) return;
    let url;
    try {
      url = new URL(trimmed);
    } catch (e) {
      return;
    }
    const href = EDS_HOST.test(url.hostname) ? `${url.pathname}${url.search}${url.hash}` : url.href;
    const picture = img.closest('picture');
    if (href.includes('.mp4') || !picture || !picture.parentElement || picture.closest('a')) return;
    img.setAttribute('alt', (alt || '').trim());
    const link = make('a', { href, class: 'aside-image-link' });
    picture.before(link);
    const format = (icon || '').trim().split(':')[1];
    if (format) playButton(link, picture, format);
    else link.append(picture);
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

export function pageLinkShims(el, make) {
  imageAltsToLinks(el, make);
  svgLinksToPictures(el, make);
  pipeLabelsToAria(el);
}

const POSITION = '(?:-?\\d*\\.?\\d+(?:%|px)?|left|right|top|bottom|center)';
const GRADIENT_WITH_POSITION = new RegExp(`^\\s*((?:repeating-)?(?:linear|radial|conic)-gradient\\(.*\\))\\s+${POSITION}(?:\\s+${POSITION})?\\s*$`, 'i');

export function dropGradientPosition(row) {
  if (!row) return;
  const cells = row.children.length ? [...row.children] : [row];
  cells.forEach((cell) => {
    if (cell.querySelector('img, video, a[href*=".mp4"]')) return;
    const text = cell.textContent || '';
    const match = text.match(GRADIENT_WITH_POSITION);
    // eslint-disable-next-line prefer-destructuring
    if (match && !isAuthoredColour(text) && isAuthoredColour(match[1])) cell.textContent = match[1];
  });
}

const NAMED = {
  white: [255, 255, 255],
  black: [0, 0, 0],
  whitesmoke: [245, 245, 245],
  gainsboro: [220, 220, 220],
  lightgray: [211, 211, 211],
  lightgrey: [211, 211, 211],
  silver: [192, 192, 192],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
};

function channelsOf(colour) {
  const v = colour.trim().toLowerCase();
  const hex = v.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    const h = hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    const rgba = [0, 2, 4, 6].map((i) => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255));
    return { rgb: rgba.slice(0, 3), alpha: rgba[3] / 255 };
  }
  const fn = v.match(/^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)\s*(?:[,/]\s*(\d*\.?\d+)(%?)\s*)?\)$/);
  if (fn) {
    const alpha = fn[4] === undefined ? 1 : Number(fn[4]) / (fn[5] ? 100 : 1);
    return { rgb: [Number(fn[1]), Number(fn[2]), Number(fn[3])], alpha };
  }
  if (NAMED[v]) return { rgb: NAMED[v], alpha: 1 };
  return null;
}

function luminance([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function colourTone(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const single = channelsOf(text);
  const stops = single ? [single] : [...text.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^()]*\)/gi)].map((m) => channelsOf(m[0]));
  const bad = (s) => !s || s.alpha < 1 || s.rgb.some((c) => c > 255);
  if (!stops.length || stops.some(bad)) return null;
  const tones = new Set(stops.map((s) => (luminance(s.rgb) > 0.179 ? 'light' : 'dark')));
  return tones.size === 1 ? [...tones][0] : null;
}

export function markStaticLinks(el) {
  el.querySelectorAll('a:not([class])').forEach((a) => a.classList.add('aside-static'));
}

export function headingText(el) {
  return textOf(el.querySelector(`${HEADINGS}, strong`)) || null;
}
