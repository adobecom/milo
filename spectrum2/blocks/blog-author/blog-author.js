import { textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { applyAuthoredColour } from '../_shared/background.js';
import { pageShims } from '../_shared/s1-page.js';
import { icon } from '../_shared/s1-blog-icons.js';

export const SOCIAL_PLATFORMS = Object.freeze({
  'linkedin.com': { name: 'LinkedIn', icon: 'linkedin' },
  'twitter.com': { name: 'X', icon: 'x' },
  'x.com': { name: 'X', icon: 'x' },
  'facebook.com': { name: 'Facebook', icon: 'facebook' },
  'instagram.com': { name: 'Instagram', icon: 'instagram' },
});
const HEX = '#[0-9a-fA-F]{3,6}';
const GRADIENT = new RegExp(`^(${HEX})\\s*,\\s*(${HEX})$`);
const SOLID = new RegExp(`^${HEX}$`);
const TEXT_CLASSES = ['blog-author-heading', 'blog-author-role', 'blog-author-bio'];
const TEXT_SELECTOR = '.blog-author-heading, .blog-author-role, .blog-author-bio, .blog-author-links';
const LIGHT_THRESHOLD = 0.179;

function absolute(href, base) {
  try {
    return new URL(href, base).href;
  } catch (e) {
    return null;
  }
}

export function resolvePlatform(href, base) {
  let host;
  try {
    host = new URL(href, base).hostname.toLowerCase();
  } catch (e) {
    return undefined;
  }
  return Object.keys(SOCIAL_PLATFORMS).find((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function hexLuminance(hex) {
  let h = String(hex).replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function schemeFor(hexes) {
  const values = hexes.map(hexLuminance);
  if (!values.length || values.some((v) => v === null)) return null;
  if (values.every((v) => v > LIGHT_THRESHOLD)) return 'light';
  if (values.every((v) => v <= LIGHT_THRESHOLD)) return 'dark';
  return null;
}

function applyColour(el, value, hexes) {
  if (!applyAuthoredColour(el, value)) return;
  const previous = el.dataset.spectrum2Scheme;
  if (previous === undefined && (el.classList.contains('light') || el.classList.contains('dark'))) {
    el.dataset.spectrum2Scheme = 'authored';
    return;
  }
  if (previous === 'authored') return;
  if (previous) el.classList.remove(previous);
  const scheme = schemeFor(hexes);
  if (scheme) el.classList.add(scheme);
  el.dataset.spectrum2Scheme = scheme || '';
}

function decorateSocial(cell) {
  const doc = cell.ownerDocument;
  const links = [...cell.querySelectorAll('a')];
  cell.replaceChildren(...links);
  cell.className = 'blog-author-links';
  links.forEach((a) => {
    const domain = resolvePlatform(a.getAttribute('href'), doc.baseURI);
    if (!domain) {
      a.hidden = true;
      return;
    }
    const platform = SOCIAL_PLATFORMS[domain];
    a.setAttribute('aria-label', platform.name);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add('blog-author-link');
    a.replaceChildren(icon(doc, platform.icon, 'blog-author-icon', { meta: platform.icon !== 'x' }));
  });
}

export function personSchema(el, company) {
  const doc = el.ownerDocument;
  const name = textOf(el.querySelector('.blog-author-heading'));
  if (!name) return null;
  const href = doc.defaultView?.location?.href || doc.baseURI;
  let id = `${href}#person`;
  try {
    const url = new URL(href);
    id = `${url.origin}${url.pathname}#person`;
  } catch (e) { /* not a URL: no @id */ }
  const schema = { '@context': 'https://schema.org', '@type': 'Person', name, url: href, '@id': id };
  if (company) schema.worksFor = { '@type': 'Organization', name: company };
  const title = textOf(el.querySelector('.blog-author-role'));
  if (title) schema.jobTitle = title;
  const description = [...el.querySelectorAll('.blog-author-bio')].map(textOf).filter(Boolean).join(' ');
  if (description) schema.description = description;
  const src = el.querySelector('picture img')?.getAttribute('src');
  const image = src ? absolute(src, doc.baseURI) : null;
  if (image) schema.image = image;
  const sameAs = [...el.querySelectorAll('.blog-author-links a:not([hidden])')]
    .filter((a) => a.getAttribute('aria-label'))
    .map((a) => absolute(a.getAttribute('href'), doc.baseURI))
    .filter(Boolean);
  if (sameAs.length) schema.sameAs = sameAs;
  return schema;
}

function decorateBlogAuthor(el, ctx) {
  const { make } = ctx;
  el.classList.add('blog-author');
  pageShims(el, make);
  const doc = el.ownerDocument;
  let social = null;
  let company = null;
  let textIdx = 0;

  el.querySelectorAll(':scope > div > div').forEach((cell) => {
    const row = cell.parentElement;
    const text = cell.textContent.trim();
    const gradient = text.match(GRADIENT);
    if (gradient) {
      applyColour(el, `linear-gradient(to bottom, ${gradient[1]}, ${gradient[2]})`, [gradient[1], gradient[2]]);
      row.remove();
      return;
    }
    if (SOLID.test(text)) {
      applyColour(el, text, [text]);
      row.remove();
      return;
    }
    if (cell.querySelector('picture')) {
      cell.className = 'blog-author-portrait';
      return;
    }
    const links = [...cell.querySelectorAll('a')];
    if (links.some((a) => resolvePlatform(a.getAttribute('href'), doc.baseURI))) {
      if (!social) {
        social = cell;
      } else {
        links.forEach((a) => social.append(a));
        row.remove();
      }
      return;
    }
    if (social) {
      company = textOf(cell);
      row.remove();
      return;
    }
    cell.className = TEXT_CLASSES[Math.min(textIdx, 2)];
    textIdx += 1;
  });

  if (social) decorateSocial(social);

  const content = make('div', { class: 'blog-author-text' });
  el.querySelectorAll(TEXT_SELECTOR).forEach((node) => content.append(node));
  [...el.children].filter((row) => row.tagName === 'DIV' && !row.children.length).forEach((row) => row.remove());
  el.append(content);
  content.querySelectorAll(':scope > :is(.blog-author-heading, .blog-author-role, .blog-author-bio)').forEach((node) => {
    if (!textOf(node) && !node.querySelector('img, picture, video, iframe')) node.hidden = true;
  });

  const schema = personSchema(el, company);
  if (schema) {
    const script = make('script', { type: 'application/ld+json', 'data-spectrum2-blog-author': '' }, JSON.stringify(schema));
    (doc.head || doc.documentElement).append(script);
  }
}

export const MEMBERS = {
  'blog-author': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateBlogAuthor,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: 'blog-author' });
}
