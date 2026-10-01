import { rowsOf, cellsOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { CARD, buildCard, buildList, absolutizePicture, cleanText } from './articles-card.js';
import {
  metaContent, siteRoot, loadTaxonomy, loadPlaceholders, placeholder, fetchOf, isoDate,
} from './articles-index.js';
import { decorateFeed, whenFeedSettled } from './articles-feed.js';

export { fetchBlogArticleIndex, resetArticleState } from './articles-index.js';
export { whenFeedSettled };

const BLOCK = 'recommended-articles';
export const CLS = Object.freeze({
  header: `${BLOCK}-header`,
  heading: `${BLOCK}-heading`,
  headerLink: `${BLOCK}-header-link`,
});
const TRIM_ENDINGS = ['|Adobe', '| Adobe', '| Adobe Blog', '|Adobe Blog'];

function fetchUrl(href, base) {
  try {
    const u = new URL(href, base);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    u.hash = '';
    return u.href;
  } catch (e) {
    return null;
  }
}

async function articleDetails(a, env) {
  const url = fetchUrl(a.getAttribute('href') || '', env.doc.baseURI);
  if (!url) return null;
  let html;
  try {
    const resp = await fetchOf(env.win)(url);
    if (!resp || !resp.ok) return null;
    html = await resp.text();
  } catch (e) {
    return null;
  }
  const page = new env.win.DOMParser().parseFromString(html, 'text/html');
  let title = cleanText(metaContent(page, 'og:title'));
  const ending = TRIM_ENDINGS.find((end) => title.endsWith(end));
  if (ending) title = cleanText(title.slice(0, title.length - ending.length));
  if (!title) return null;
  const category = cleanText(metaContent(page, 'category') || metaContent(page, 'article:tag'));
  const found = page.querySelector('picture');
  const picture = found ? absolutizePicture(env.doc.importNode(found, true), url) : null;
  const date = cleanText(metaContent(page, 'publication-date'));
  return {
    title,
    category,
    description: cleanText(metaContent(page, 'description')),
    picture,
    date: date ? { text: date, iso: isoDate(date) } : null,
    root: siteRoot(page, url),
  };
}

async function categoryLink(details, env) {
  if (!details.category || !details.root) return null;
  if (!env.taxonomies.has(details.root)) {
    env.taxonomies.set(details.root, loadTaxonomy(details.root, env.win));
  }
  const taxonomy = await env.taxonomies.get(details.root);
  return taxonomy?.get(details.category)?.link || null;
}

async function cardData(a, env) {
  const href = a.getAttribute('href') || '';
  const authored = cleanText(a.textContent);
  const details = await articleDetails(a, env);
  if (!details) return { href, title: authored || href, fallback: true };
  return {
    href,
    title: details.title,
    category: details.category
      ? { text: details.category, href: await categoryLink(details, env) }
      : null,
    description: details.description,
    date: details.date,
    picture: details.picture,
    well: !details.picture,
    source: authored,
  };
}

function buildHeader(cell, small, make) {
  const header = make('div', { class: CLS.header }, [...cell.childNodes]);
  const first = header.querySelector('a[href]');
  if (first) first.classList.add(...(small ? ['s2-button', 's2-button-outline'] : [CLS.headerLink]));
  return header;
}

async function decorateRecommended(el, ctx) {
  const { make } = ctx;
  const doc = el.ownerDocument;
  const env = { doc, win: doc.defaultView, taxonomies: new Map() };
  el.classList.add(BLOCK);
  const rows = rowsOf(el);
  if (!rows.length) return;
  const small = el.classList.contains('small');
  let header = null;
  let linkRow = rows[0];
  if (rows.length > 1) {
    const cell = cellsOf(rows[0])[0];
    if (cell) header = buildHeader(cell, small, make);
    [, linkRow] = rows;
  }
  const links = [...linkRow.querySelectorAll('a[href]')];
  el.replaceChildren();
  if (!header && !small) {
    const texts = await loadPlaceholders(doc, env.win);
    header = make('h3', { class: CLS.heading }, placeholder(texts, 'recommended-for-you'));
  }
  const data = await Promise.all(links.map((a) => cardData(a, env)));
  const list = buildList(make);
  list.append(...data.map((d) => buildCard(make, d)));
  if (header) el.append(header);
  el.append(list);
  el.dataset.articles = String(data.filter((d) => !d.fallback).length);
}

export const MEMBERS = Object.freeze({
  'recommended-articles': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateRecommended,
  },
  'article-feed': {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateFeed,
  },
});

export { CARD };

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
