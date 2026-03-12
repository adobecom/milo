import locales from '../../utils/locales.js';
import { createTag } from '../../utils/utils.js';

const LANGUAGE_LABELS = {
  ar: 'Arabic',
  cs: 'Czech',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  fi: 'Finnish',
  fil: 'Filipino',
  fr: 'French',
  he: 'Hebrew',
  hi: 'Hindi',
  hu: 'Hungarian',
  id: 'Indonesian',
  in: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  ms: 'Malay',
  nl: 'Dutch',
  no: 'Norwegian',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sv: 'Swedish',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  vi: 'Vietnamese',
  zh: 'Chinese',
};
const QUERY_INDEX_URL_PATTERN = /https?:\/\/[^\s<>"']*query-index\.json(?:\?[^\s<>"']*)?/g;

function getLocaleFromQueryIndexUrl(indexUrl) {
  try {
    const { pathname } = new URL(indexUrl);
    return pathname.split('/').filter(Boolean)[0] || '';
  } catch (e) {
    return '';
  }
}

function getLanguageLabel(locale) {
  const ietf = locales[locale]?.ietf;
  if (!ietf) return 'English';

  const languageCode = ietf.toLowerCase().split('-')[0];
  return LANGUAGE_LABELS[languageCode] || languageCode.toUpperCase();
}

function getUrlList(cell) {
  const matches = cell.innerHTML.match(QUERY_INDEX_URL_PATTERN) || [];
  return [...new Set(matches.map((url) => url.trim()))];
}

function toPageUrl(indexUrl, item) {
  if (item.url) return item.url;

  try {
    const parsedIndexUrl = new URL(indexUrl);
    if (item.path) return new URL(item.path, parsedIndexUrl.origin).href;
  } catch (e) {
    return item.path || '';
  }

  return item.path || '';
}

function toPageTitle(item) {
  if (item.title) return item.title;
  if (item.navtitle) return item.navtitle;
  if (!item.path) return 'Untitled';

  const path = item.path.replace(/\/$/, '').split('/').pop() || item.path;
  return path
    .replace(/\.html?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function fetchQueryIndexPage(indexUrl, offset = 0, pageSize = 500) {
  const url = new URL(indexUrl);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', pageSize);

  const response = await fetch(url.href);
  if (!response.ok) throw new Error(`Failed to fetch ${url.href}: ${response.status}`);
  return response.json();
}

async function fetchAllQueryIndexItems(indexUrl) {
  const items = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const payload = await fetchQueryIndexPage(indexUrl, offset);
    const pageItems = payload.data || [];
    items.push(...pageItems);

    total = payload.total ?? pageItems.length;
    const pageOffset = payload.offset ?? offset;
    const pageLimit = payload.limit ?? pageItems.length;
    if (!pageItems.length || !pageLimit) break;
    offset = pageOffset + pageLimit;
  }

  return items;
}

async function buildLanguageGroup(indexUrl) {
  const locale = getLocaleFromQueryIndexUrl(indexUrl);
  const items = await fetchAllQueryIndexItems(indexUrl);

  return {
    locale,
    label: getLanguageLabel(locale),
    items: items.map((item) => ({
      href: toPageUrl(indexUrl, item),
      title: toPageTitle(item),
    })).filter((item) => item.href),
  };
}

function createLanguageSection(group) {
  const title = createTag('h4', null, group.label);
  const list = createTag('ul');

  group.items.forEach((item) => {
    const link = createTag('a', { href: item.href }, item.title);
    list.append(createTag('li', null, link));
  });

  return createTag('section', { class: 'language-group' }, [title, list]);
}

async function createCountryItem(label, indexUrls) {
  const details = createTag('details', { class: 'sitemap-extended-item' });
  const summary = createTag('summary', null, label);
  const body = createTag('div', { class: 'sitemap-extended-body' });

  const groups = await Promise.all(indexUrls.map(async (indexUrl) => {
    try {
      return await buildLanguageGroup(indexUrl);
    } catch (e) {
      return null;
    }
  }));

  groups.filter((group) => group && group.items.length).forEach((group) => {
    body.append(createLanguageSection(group));
  });

  details.append(summary, body);
  return details;
}

function readRows(el) {
  return [...el.querySelectorAll(':scope > div')]
    .map((row) => {
      const [labelCell, urlsCell] = row.children;
      if (!labelCell || !urlsCell) return null;

      const label = labelCell.textContent.trim();
      const indexUrls = getUrlList(urlsCell);
      if (!label || !indexUrls.length) return null;

      return { label, indexUrls };
    })
    .filter(Boolean);
}

export default async function init(el) {
  const rows = readRows(el);
  const list = createTag('div', { class: 'sitemap-extended-list foreground' });

  const items = await Promise.all(rows.map((row) => createCountryItem(row.label, row.indexUrls)));
  items.forEach((item) => list.append(item));

  el.textContent = '';
  el.className = `sitemap-extended-container ${el.className}`;
  el.classList.remove('sitemap-extended');
  el.classList.add('con-block');
  el.append(list);
}
