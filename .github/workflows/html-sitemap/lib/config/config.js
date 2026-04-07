import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

/**
 * @typedef {Object} DomainConfigRow
 * @property {string} subdomain
 * @property {string} domain
 * @property {string} site
 * @property {string} extendedSitemap
 * @property {string} template
 */

/**
 * @typedef {Object} QueryIndexMapRow
 * @property {string} subdomain
 * @property {string} site
 * @property {string} queryIndexPath
 * @property {boolean} enabled
 */

/**
 * @typedef {Object} GeoMapRow
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {string} language
 * @property {string[]} extendedGeos
 * @property {boolean} deploy
 */

/**
 * @typedef {Object} PageCopyRow
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {string} pageTitle
 * @property {string} pageDescription
 * @property {string} otherSitemapsHeading
 * @property {string} extendedPagesHeading
 */

/**
 * @typedef {Object} HtmlSitemapConfig
 * @property {Record<string, unknown>} raw
 * @property {DomainConfigRow[]} domains
 * @property {QueryIndexMapRow[]} queryIndexMap
 * @property {GeoMapRow[]} geoMap
 * @property {PageCopyRow[]} pageCopy
 * @property {Record<string, string>} siteDomains
 */

export const DEFAULT_DA_TEMPLATE = 'da-sitemap.html';

/**
 * @typedef {Record<string, { data?: Record<string, string>[] }>} MultiSheetJson
 */

/**
 * @param {string} value
 * @returns {boolean}
 */
function isUrl(value) {
  return /^https?:\/\//.test(value);
}

/**
 * @param {MultiSheetJson} json
 * @param {string} name
 * @returns {Record<string, string>[]}
 */
function requireSheet(json, name) {
  const rows = json?.[name]?.data;
  if (!Array.isArray(rows)) {
    throw new Error(`Config is missing required sheet: ${name}`);
  }
  return rows;
}

/**
 * @param {string} sheetName
 * @param {Record<string, string>[]} rows
 * @param {string[]} requiredFields
 * @param {Record<string, string>} [alternateFields]
 * @returns {void}
 */
function validateRequiredFields(
  sheetName,
  rows,
  requiredFields,
  alternateFields,
) {
  rows.forEach((row, index) => {
    for (const field of requiredFields) {
      const alt = alternateFields?.[field];
      if (!(field in row) && !(alt && alt in row)) {
        const label = alt ? `"${field}" or "${alt}"` : `"${field}"`;
        throw new Error(`Config sheet "${sheetName}" row ${index}: missing required field ${label}`);
      }
    }
  });
}

/**
 * @param {string} [value]
 * @returns {string[]}
 */
function parseExtendedGeos(value) {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

/**
 * @param {string} [value]
 * @returns {string}
 */
function normalizeBaseGeo(value) {
  return value || '';
}

/**
 * @param {string} [value]
 * @returns {boolean}
 */
function parseBooleanFlag(value) {
  if (value === undefined || value === null || value === '') return false;
  return ['true', '1', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

/**
 * @param {string} ref
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<MultiSheetJson>}
 */
export async function loadJsonRef(
  ref,
  { fetchImpl = fetch } = {},
) {
  if (isUrl(ref)) {
    const response = await fetchImpl(ref, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  const filePath = path.resolve(process.cwd(), ref);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * @param {string} ref
 * @param {{ fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<HtmlSitemapConfig>}
 */
export async function loadConfig(
  ref,
  options = {},
) {
  const json = await loadJsonRef(ref, options);

  const configRows = requireSheet(json, 'config');
  const qimRows = requireSheet(json, 'query-index-map');
  const geoRows = requireSheet(json, 'geo-map');
  const copyRows = requireSheet(json, 'page-copy');

  const subdomainAlt = { subdomain: 'domain' };
  validateRequiredFields('config', configRows, ['subdomain', 'domain', 'site', 'extendedSitemap']);
  validateRequiredFields('query-index-map', qimRows, ['subdomain', 'site', 'queryIndexPath'], subdomainAlt);
  validateRequiredFields('geo-map', geoRows, ['subdomain', 'language'], subdomainAlt);
  validateRequiredFields('page-copy', copyRows, ['subdomain', 'pageTitle', 'pageDescription'], subdomainAlt);

  const domains = configRows.map((row) => ({
    subdomain: row.subdomain,
    domain: row.domain,
    site: row.site,
    extendedSitemap: row.extendedSitemap,
    template: row.template || DEFAULT_DA_TEMPLATE,
  })).filter((row) => row.subdomain && row.domain && row.site);

  const queryIndexMap = qimRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    site: row.site,
    queryIndexPath: row.queryIndexPath,
    enabled: parseBooleanFlag(row.enabled),
  })).filter((row) => row.subdomain && row.site && row.queryIndexPath && row.enabled);

  const geoMap = geoRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    baseGeo: normalizeBaseGeo(row.baseGeo),
    language: row.language,
    extendedGeos: parseExtendedGeos(row.extendedGeos),
    deploy: parseBooleanFlag(row.deploy),
  })).filter((row) => row.subdomain && row.language !== undefined);

  const pageCopy = copyRows.map((row) => ({
    subdomain: row.subdomain || row.domain,
    baseGeo: normalizeBaseGeo(row.baseGeo),
    pageTitle: row.pageTitle || '',
    pageDescription: row.pageDescription || '',
    otherSitemapsHeading: row.otherSitemapsHeading || '',
    extendedPagesHeading: row.extendedPagesHeading || '',
  })).filter((row) => row.subdomain);

  const domainBySubdomain = new Map(domains.map((row) => [row.subdomain, row.domain]));
  const siteDomains = Object.fromEntries([
    ...domains.map((row) => [row.site, row.domain]),
    ...queryIndexMap.flatMap((row) => {
      const domain = domainBySubdomain.get(row.subdomain);
      return domain ? [[row.site, domain]] : [];
    }),
  ]);

  return {
    raw: json,
    domains,
    queryIndexMap,
    geoMap,
    pageCopy,
    siteDomains,
  };
}
