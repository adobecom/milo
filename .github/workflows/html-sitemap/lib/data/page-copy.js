import { resolvePlaceholders } from '../sources/placeholders.js';

/**
 * @typedef {import('../config/config.js').HtmlSitemapConfig} HtmlSitemapConfig
 * @typedef {import('../sources/placeholders.js').PlaceholderMap} PlaceholderMap
 */

/**
 * @typedef {Object} PageCopy
 * @property {string} pageTitle
 * @property {string} pageDescription
 * @property {string} otherSitemapsHeading
 * @property {string} extendedPagesHeading
 */

/**
 * @param {PageCopy} copy
 * @param {PlaceholderMap} placeholders
 * @returns {PageCopy}
 */
function resolvePageCopy(copy, placeholders) {
  return {
    pageTitle: resolvePlaceholders(copy.pageTitle, placeholders),
    pageDescription: resolvePlaceholders(copy.pageDescription, placeholders),
    otherSitemapsHeading: resolvePlaceholders(copy.otherSitemapsHeading, placeholders),
    extendedPagesHeading: resolvePlaceholders(copy.extendedPagesHeading, placeholders),
  };
}

/**
 * @param {HtmlSitemapConfig} config
 * @param {{ subdomain: string, baseGeo: string, language: string }} unit
 * @param {PlaceholderMap} [placeholders]
 * @returns {PageCopy}
 */
export function getPageCopy(
  config,
  unit,
  placeholders = {},
) {
  const row = config.pageCopy.find((entry) => entry.subdomain === unit.subdomain && entry.baseGeo === unit.baseGeo);
  if (!row) {
    console.warn(`[warn] No page-copy row for ${unit.subdomain}/${unit.baseGeo || '(default)'}; using defaults`);
  }
  const copy = {
    pageTitle: row?.pageTitle || 'Sitemap',
    pageDescription: row?.pageDescription || '',
    otherSitemapsHeading: row?.otherSitemapsHeading || '',
    extendedPagesHeading: row?.extendedPagesHeading || '',
  };
  return resolvePageCopy(copy, placeholders);
}
