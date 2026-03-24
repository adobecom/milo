import { createTag } from '../../utils/utils.js';

const JSON_URL_PATTERN = /https?:\/\/[^\s<>"']+\.json(?:\?[^\s<>"']*)?/g;
const NOINDEX_NOFOLLOW_PATTERN = /^noindex\s*,\s*nofollow$/i;
// At the current measured upper bound (~687 KB per aggregated locale set),
// 4 concurrent fetches keeps worst-case in-flight transfer near 2.75 MB.
const MAX_CONCURRENT_FETCHES = 4;

let activeFetches = 0;
const fetchQueue = [];

function getUrlList(cell) {
  const matches = cell.innerHTML.match(JSON_URL_PATTERN) || [];
  return [...new Set(matches.map((url) => url.trim()))];
}

function isProductionOrigin(origin) {
  try {
    return new URL(origin).hostname.endsWith('.adobe.com');
  } catch {
    return false;
  }
}

function getEffectiveOrigin(indexUrl) {
  if (isProductionOrigin(window.location.origin)) return window.location.origin;
  try {
    return new URL(indexUrl).origin;
  } catch {
    return null;
  }
}

function toPageUrl(item, effectiveOrigin) {
  if (item.url) return item.url;
  if (item.href) return item.href;
  const path = item.path || '';
  if (!path) return '';
  if (effectiveOrigin) return new URL(path, effectiveOrigin).href;
  return path;
}

function normalizePayload(payload) {
  return {
    items: payload?.data || payload?.items || payload?.results || [],
    total: payload?.total,
    offset: payload?.offset,
    limit: payload?.limit,
  };
}

function isNoindexNofollow(item) {
  return (
    typeof item?.robots === 'string'
    && NOINDEX_NOFOLLOW_PATTERN.test(item.robots.trim())
  );
}

async function runWithFetchLimit(task) {
  if (activeFetches >= MAX_CONCURRENT_FETCHES) {
    await new Promise((resolve) => {
      fetchQueue.push(resolve);
    });
  }

  activeFetches += 1;

  try {
    return await task();
  } finally {
    activeFetches -= 1;
    fetchQueue.shift()?.();
  }
}

function cleanTitle(title) {
  return title.replace(/\s*\|.*$/, '').trim();
}

function toPageTitle(item) {
  if (item.title) return cleanTitle(item.title);
  if (item.navtitle) return cleanTitle(item.navtitle);
  if (!item.path) return 'Untitled';

  const path = item.path.replace(/\/$/, '').split('/').pop() || item.path;
  return cleanTitle(
    path
      .replace(/\.html?$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  );
}

async function fetchQueryIndexPage(indexUrl, offset = 0, pageSize = 500) {
  const url = new URL(indexUrl);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', pageSize);

  const response = await runWithFetchLimit(() => fetch(url.href));
  if (!response.ok) throw new Error(`Failed to fetch ${url.href}: ${response.status}`);
  return response.json();
}

async function fetchAllQueryIndexItems(indexUrl) {
  const items = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const payload = normalizePayload(
      await fetchQueryIndexPage(indexUrl, offset),
    );
    const pageItems = payload.items || [];
    items.push(...pageItems);

    total = payload.total ?? Infinity;
    const pageLimit = payload.limit ?? pageItems.length;
    if (!pageItems.length || pageItems.length < pageLimit) break;
    offset += pageLimit;
  }

  return items;
}

async function buildLanguageGroup(indexEntries, options = {}) {
  const [firstEntry] = indexEntries;
  const groups = await Promise.all(
    indexEntries.map(async ({ url }) => ({
      url,
      items: await fetchAllQueryIndexItems(url),
    })),
  );
  const filteredItems = groups
    .flatMap(({ url, items }) => items.map((item) => ({
      item,
      effectiveOrigin: getEffectiveOrigin(url),
    })))
    .filter(({ item }) => options.includeNoindex || !isNoindexNofollow(item));
  const seenHrefs = new Set();

  return {
    label: firstEntry?.label || '',
    items: filteredItems
      .map(({ item, effectiveOrigin }) => ({
        href: toPageUrl(item, effectiveOrigin),
        title: toPageTitle(item),
      }))
      .filter((item) => {
        if (!item.href || seenHrefs.has(item.href)) return false;
        seenHrefs.add(item.href);
        return true;
      }),
  };
}

function groupIndexEntries(indexEntries) {
  return Object.values(
    indexEntries.reduce((acc, entry) => {
      const key = entry.label || '__default__';
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {}),
  );
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

async function createCountryItem(label, indexEntries, options = {}) {
  const details = createTag('details', { class: 'sitemap-extended-item' });
  const summary = createTag('summary', null, label);
  const body = createTag('div', { class: 'sitemap-extended-body' });
  const groupedEntries = groupIndexEntries(indexEntries);

  const groups = await Promise.all(
    groupedEntries.map(async (entries) => {
      try {
        return await buildLanguageGroup(entries, options);
      } catch (e) {
        const urls = entries.map((entry) => entry.url).join(', ');
        window.lana?.log(
          `sitemap-extended: failed to build group for "${label}" (${urls}): ${e.message}`,
          { tags: 'sitemap', severity: 'error' },
        );
        return null;
      }
    }),
  );

  const renderedGroups = groups.filter((group) => group && group.items.length);
  if (!renderedGroups.length) return null;

  renderedGroups.forEach((group) => {
    body.append(createLanguageSection(group));
  });

  details.append(summary, body);
  return details;
}

function readStructuredRow(row) {
  const content = row.querySelector(':scope > div') || row;
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
    .map((row) => readStructuredRow(row))
    .filter(Boolean);
}

function shouldIncludeNoindex(el) {
  if (el.classList.contains('include-noindex')) return true;

  const params = new URLSearchParams(window.location.search);
  return params.get('sitemap-extended-include-noindex') === 'true';
}

export default async function init(el) {
  const rows = readRows(el);
  const list = createTag('div', { class: 'sitemap-extended-list foreground' });
  const options = { includeNoindex: shouldIncludeNoindex(el) };

  const items = await Promise.all(
    rows.map((row) => createCountryItem(row.label, row.indexEntries, options)),
  );
  items.filter(Boolean).forEach((item) => list.append(item));

  el.textContent = '';
  el.className = `sitemap-extended-container ${el.className}`;
  el.classList.remove('sitemap-extended');
  el.classList.add('con-block');
  el.append(list);
}
