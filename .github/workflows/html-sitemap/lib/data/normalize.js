/**
 * @typedef {Object} NormalizedLink
 * @property {string} title
 * @property {string} originalTitle - title before Adobe-branding cleanup; equals title when no cleanup occurred
 * @property {string} url
 * @property {string} path - final path after any html-suffix manipulation
 * @property {string} originalPath - path as parsed from the source row, before any html-suffix manipulation
 * @property {string} [originUrl]
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

const TITLE_DELIMITERS = new Set(['|', '-', '–', '—']);

/**
 * Strip a trailing Adobe-branding suffix from a title.
 *
 * Algorithm: find the last title-segment delimiter (`|`, `-`, en-dash `–`,
 * or em-dash `—`) that is surrounded by whitespace (i.e. a true delimiter,
 * not a hyphen inside a word). If "adobe" appears anywhere in the
 * substring from that delimiter to the end of the title, strip from the
 * delimiter onward. Otherwise return the title unchanged (whitespace
 * collapsed and trimmed).
 *
 * Matches `| Adobe`, `- Adobe`, `– Adobe Substance 3D`, `| adobe.com`,
 * etc., including localized variants like `| Adobe France`. Preserves
 * legitimate subtitles such as `Acrobat Pro - DC` or `Tutorials – Pro
 * Tips` that contain a delimiter but no Adobe branding in the trailing
 * segment.
 *
 * @param {string} title
 * @returns {string}
 */
export function cleanTitle(title) {
  const cleaned = title.replace(/\s+/g, ' ').trim();
  let lastDelim = -1;
  for (let i = cleaned.length - 1; i > 0; i -= 1) {
    if (TITLE_DELIMITERS.has(cleaned[i]) && cleaned[i - 1] === ' ' && cleaned[i + 1] === ' ') {
      lastDelim = i;
      break;
    }
  }
  if (lastDelim !== -1 && /adobe/i.test(cleaned.slice(lastDelim))) {
    const prefix = cleaned.slice(0, lastDelim).trimEnd();
    if (prefix) return prefix;
  }
  return cleaned;
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
 * @typedef {Object} NormalizeOptions
 * @property {string} [originUrl]
 * @property {boolean} [addHtmlExtension]
 *   Append `.html` to the resolved path (unless it is already `.html` or the
 *   root `/`). Used for query indexes that omit the suffix that the live URL
 *   actually serves.
 */

/**
 * @param {unknown} raw
 * @param {string} fallbackDomain
 * @param {SiteDomainMap} [siteDomainMap]
 * @param {NormalizeOptions | string} [optionsOrOriginUrl]
 *   Pass a NormalizeOptions object. A bare string is accepted for backward
 *   compatibility and is interpreted as `originUrl`.
 * @returns {NormalizedLink[]}
 */
export function normalizeQueryIndexData(
  raw,
  fallbackDomain,
  siteDomainMap = {},
  optionsOrOriginUrl,
) {
  const options = typeof optionsOrOriginUrl === 'string'
    ? { originUrl: optionsOrOriginUrl }
    : (optionsOrOriginUrl || {});
  const { originUrl, addHtmlExtension = false } = options;

  const rows = Array.isArray(/** @type {{ data?: unknown[] }} */ (raw)?.data)
    ? /** @type {QueryIndexRow[]} */ (/** @type {{ data: unknown[] }} */ (raw).data)
    : [];

  return rows.flatMap((row) => {
    const source = row.path || row.url;
    if (!source || !isIndexable(row.robots)) return [];

    const productionUrl = toProductionUrl(String(source), fallbackDomain, siteDomainMap);
    const parsed = new URL(productionUrl);
    const originalPath = parsed.pathname;

    const shouldAddHtml = addHtmlExtension
      && originalPath !== '/'
      && !/\.html$/.test(originalPath);
    const urlPath = shouldAddHtml ? `${originalPath}.html` : originalPath;
    if (shouldAddHtml) parsed.pathname = urlPath;
    const url = parsed.toString();

    const rawTitle = String(row.title || '').replace(/\s+/g, ' ').trim();
    const originalTitle = rawTitle || titleFromSlug(urlPath);
    const title = cleanTitle(originalTitle);

    return [{
      title,
      originalTitle,
      url,
      path: urlPath,
      originalPath,
      ...(originUrl ? { originUrl } : {}),
    }];
  });
}
