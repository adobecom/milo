import { createTag } from '../../utils/utils.js';

const LOCALE_LANGUAGE_LABELS = {
  br: 'Portuguese',
  ca: 'English',
  ca_fr: 'French',
  ch_de: 'German',
  ch_fr: 'French',
  cn: 'English',
  dk: 'English',
  fi: 'English',
  la: 'Spanish',
  mena_en: 'English',
  nl: 'English',
  no: 'English',
  nz: 'English',
  se: 'English',
  sg: 'English',
  th_en: 'English',
};

function getLocaleFromQueryIndexUrl(indexUrl) {
  try {
    const { pathname } = new URL(indexUrl);
    return pathname.split('/').filter(Boolean)[0] || '';
  } catch (e) {
    return '';
  }
}

function getLanguageLabel(locale) {
  if (LOCALE_LANGUAGE_LABELS[locale]) return LOCALE_LANGUAGE_LABELS[locale];

  const [, language] = locale.split('_');
  if (language) {
    const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
    return languageNames.of(language) || language.toUpperCase();
  }

  return 'English';
}

function getUrlList(cell) {
  const links = [...cell.querySelectorAll('a[href]')].map((link) => link.href.trim()).filter(Boolean);
  if (links.length) return links;

  return cell.textContent
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
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
