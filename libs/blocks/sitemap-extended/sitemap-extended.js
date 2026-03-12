import { createTag } from '../../utils/utils.js';

const JSON_URL_PATTERN = /(?:https?:\/\/[^\s<>"']+|\/[^\s<>"']+)\.json(?:\?[^\s<>"']*)?/g;

function getUrlList(cell) {
  const matches = cell.innerHTML.match(JSON_URL_PATTERN) || [];
  return [...new Set(matches.map((url) => url.trim()))];
}

function getSectionContent(row) {
  return row.querySelector(':scope > div') || row;
}

function toPageUrl(indexUrl, item) {
  if (item.url) return item.url;
  if (item.href) return item.href;

  try {
    const parsedIndexUrl = new URL(indexUrl);
    if (item.path) return new URL(item.path, parsedIndexUrl.origin).href;
  } catch (e) {
    return item.path || '';
  }

  return item.path || '';
}

function normalizePayload(payload) {
  return {
    items: payload?.data || payload?.items || payload?.results || [],
    total: payload?.total,
    offset: payload?.offset,
    limit: payload?.limit,
  };
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
  const url = new URL(indexUrl, window.location.href);
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
    const payload = normalizePayload(await fetchQueryIndexPage(indexUrl, offset));
    const pageItems = payload.items || [];
    items.push(...pageItems);

    total = payload.total ?? pageItems.length;
    const pageOffset = payload.offset ?? offset;
    const pageLimit = payload.limit ?? pageItems.length;
    if (!pageItems.length || !pageLimit) break;
    offset = pageOffset + pageLimit;
  }

  return items;
}

async function buildLanguageGroup(indexUrl, labelOverride) {
  const items = await fetchAllQueryIndexItems(indexUrl);

  return {
    label: labelOverride || '',
    items: items.map((item) => ({
      href: toPageUrl(indexUrl, item),
      title: toPageTitle(item),
    })).filter((item) => item.href),
  };
}

function createLanguageSection(group) {
  const list = createTag('ul');

  group.items.forEach((item) => {
    const link = createTag('a', { href: item.href }, item.title);
    list.append(createTag('li', null, link));
  });

  const content = [list];
  if (group.label) {
    content.unshift(createTag('h4', null, group.label));
  }

  return createTag('section', { class: 'language-group' }, content);
}

async function createCountryItem(label, indexEntries) {
  const details = createTag('details', { class: 'sitemap-extended-item' });
  const summary = createTag('summary', null, label);
  const body = createTag('div', { class: 'sitemap-extended-body' });

  const groups = await Promise.all(indexEntries.map(async ({ url, label: groupLabel }) => {
    try {
      return await buildLanguageGroup(url, groupLabel);
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

function readLegacyRow(row) {
  const [labelCell, urlsCell] = row.children;
  if (!labelCell || !urlsCell) return null;

  const label = labelCell.textContent.trim();
  const indexEntries = getUrlList(urlsCell).map((url) => ({ url }));
  if (!label || !indexEntries.length) return null;

  return { label, indexEntries };
}

function readStructuredRow(row) {
  const content = getSectionContent(row);
  const labelHeading = content.querySelector('h3');
  if (!labelHeading) return null;

  const label = labelHeading.textContent.trim();
  const indexEntries = [];
  let currentGroupLabel = '';
  let started = false;

  [...content.children].forEach((child) => {
    if (child === labelHeading) {
      started = true;
      return;
    }

    if (!started) return;

    if (child.tagName === 'H4') {
      currentGroupLabel = child.textContent.trim();
      return;
    }

    getUrlList(child).forEach((url) => {
      indexEntries.push({
        url,
        label: currentGroupLabel || undefined,
      });
    });
  });

  if (!label || !indexEntries.length) return null;
  return { label, indexEntries };
}

function readRows(el) {
  return [...el.querySelectorAll(':scope > div')]
    .map((row) => readStructuredRow(row) || readLegacyRow(row))
    .filter(Boolean);
}

export default async function init(el) {
  if (el.dataset.blockStatus === 'loaded') return;

  const rows = readRows(el);
  const list = createTag('div', { class: 'sitemap-extended-list foreground' });

  const items = await Promise.all(
    rows.map((row) => createCountryItem(row.label, row.indexEntries)),
  );
  items.forEach((item) => list.append(item));

  el.textContent = '';
  el.className = `sitemap-extended-container ${el.className}`;
  el.classList.remove('sitemap-extended');
  el.classList.add('con-block');
  el.append(list);
}
