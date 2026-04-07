/**
 * @typedef {Object} NormalizedLink
 * @property {string} title
 * @property {string} url
 * @property {string} path
 */

/**
 * @typedef {Record<string, string>} SiteDomainMap
 */

/**
 * @typedef {Object} QueryIndexRow
 * @property {string} [path]
 * @property {string} [url]
 * @property {string} [title]
 * @property {string} [robots]
 */

/**
 * @param {string} pathname
 * @returns {string}
 */
function titleFromSlug(pathname) {
  const slug = (pathname.split('/').filter(Boolean).pop() || 'untitled')
    .replace(/\.[a-z0-9]+$/i, '');
  return slug.split('-').filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

/**
 * @param {string} title
 * @returns {string}
 */
export function cleanTitle(title) {
  return title
    .replace(/\s*[-|]\s*Adobe\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} hostname
 * @param {SiteDomainMap} siteDomainMap
 * @returns {string | null}
 */
function mapRepoHost(hostname, siteDomainMap) {
  const match = hostname.match(/^main--([a-z0-9-]+)--adobecom\.aem\.(live|page)$/);
  if (!match) return null;
  const domain = siteDomainMap[match[1]];
  return domain ? `https://${domain}` : null;
}

/**
 * @param {string} value
 * @param {string} fallbackDomain
 * @param {SiteDomainMap} [siteDomainMap]
 * @returns {string}
 */
export function toProductionUrl(
  value,
  fallbackDomain,
  siteDomainMap = {},
) {
  if (value.startsWith('/')) {
    return `https://${fallbackDomain}${value}`;
  }

  try {
    const parsed = new URL(value);
    const mappedOrigin = mapRepoHost(parsed.hostname, siteDomainMap);
    if (!mappedOrigin) return parsed.toString();
    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, mappedOrigin).toString();
  } catch {
    return `https://${fallbackDomain}/${value.replace(/^\/+/, '')}`;
  }
}

/**
 * @param {string} [robots]
 * @returns {boolean}
 */
function isIndexable(robots) {
  if (!robots) return true;
  const normalized = robots.toLowerCase();
  return !normalized.includes('noindex') && !normalized.includes('nofollow');
}

/**
 * @param {unknown} raw
 * @param {string} fallbackDomain
 * @param {SiteDomainMap} [siteDomainMap]
 * @returns {NormalizedLink[]}
 */
export function normalizeQueryIndexData(
  raw,
  fallbackDomain,
  siteDomainMap = {},
) {
  const rows = Array.isArray(/** @type {{ data?: unknown[] }} */ (raw)?.data)
    ? /** @type {QueryIndexRow[]} */ (/** @type {{ data: unknown[] }} */ (raw).data)
    : [];

  return rows.flatMap((row) => {
    const source = row.path || row.url;
    if (!source || !isIndexable(row.robots)) return [];

    const url = toProductionUrl(String(source), fallbackDomain, siteDomainMap);
    const parsed = new URL(url);
    const urlPath = parsed.pathname;
    const rawTitle = String(row.title || '').trim();
    const title = cleanTitle(rawTitle || titleFromSlug(urlPath));

    return [{ title, url, path: urlPath }];
  });
}
