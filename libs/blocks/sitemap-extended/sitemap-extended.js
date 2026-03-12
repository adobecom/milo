import locales from '../../utils/locales.js';
import { createTag, getConfig } from '../../utils/utils.js';

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
const COUNTRY_LABELS = {
  en: {
    br: 'Brazil',
    ca: 'Canada',
    ch: 'Switzerland',
    cn: 'China',
    dk: 'Denmark',
    fi: 'Finland',
    la: 'Latin America',
    mena: 'Middle East & North Africa',
    nl: 'Netherlands',
    no: 'Norway',
    nz: 'New Zealand',
    se: 'Sweden',
    sg: 'Singapore',
    th: 'Thailand',
  },
};

function getLocaleFromQueryIndexUrl(indexUrl) {
  try {
    const { pathname } = new URL(indexUrl);
    return pathname.split('/').filter(Boolean)[0] || '';
  } catch (e) {
    return '';
  }
}

function getCurrentPageLocale() {
  const configLocale = getConfig()?.locale?.prefix?.replace(/^\//, '');
  if (configLocale) return configLocale;

  const [firstPathSegment] = window.location.pathname.split('/').filter(Boolean);
  return firstPathSegment && locales[firstPathSegment] ? firstPathSegment : '';
}

function getCurrentLanguageCode() {
  const currentLocale = getCurrentPageLocale();
  const ietf = locales[currentLocale]?.ietf || 'en';
  return ietf.toLowerCase().split('-')[0];
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

function getTokenList(cell) {
  return [...new Set(
    cell.textContent
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean),
  )];
}

function normalizeConfigKey(value) {
  return value.toLowerCase().replace(/[^a-z]/g, '');
}

function getCountryLabel(countryCode) {
  const currentLanguageCode = getCurrentLanguageCode();
  const languageLabels = COUNTRY_LABELS[currentLanguageCode] || COUNTRY_LABELS.en;
  return languageLabels[countryCode] || countryCode.toUpperCase();
}

function buildIndexUrl(baseUrl, geo, indexFile) {
  return new URL(`${geo}/${indexFile}`, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).href;
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

function cleanTitle(title) {
  return title.replace(/\s*\|.*$/, '').trim();
}

function toPageTitle(item) {
  if (item.title) return cleanTitle(item.title);
  if (item.navtitle) return cleanTitle(item.navtitle);
  if (!item.path) return 'Untitled';

  const path = item.path.replace(/\/$/, '').split('/').pop() || item.path;
  return cleanTitle(path
    .replace(/\.html?$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()));
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

function readCompactConfig(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const config = rows.reduce((acc, row) => {
    const [keyCell, valueCell] = row.children;
    if (!keyCell || !valueCell) return acc;
    acc[normalizeConfigKey(keyCell.textContent.trim())] = valueCell;
    return acc;
  }, {});

  const baseUrl = config.baseurl?.textContent.trim();
  const geos = config.geos ? getTokenList(config.geos) : [];
  const indexFile = config.indexfile?.textContent.trim();

  if (!baseUrl || !geos.length || !indexFile) return null;

  const countries = [];
  const countryMap = new Map();

  geos.forEach((geo) => {
    const countryCode = geo.split('_')[0];
    const country = countryMap.get(countryCode) || {
      label: getCountryLabel(countryCode),
      indexUrls: [],
    };

    country.indexUrls.push(buildIndexUrl(baseUrl, geo, indexFile));

    if (!countryMap.has(countryCode)) {
      countryMap.set(countryCode, country);
      countries.push(country);
    }
  });

  return countries;
}

function readExplicitRows(el) {
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

function readRows(el) {
  return readCompactConfig(el) || readExplicitRows(el);
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
