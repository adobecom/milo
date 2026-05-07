/**
 * Resolves the page-copy bundle (page title) for a given (subdomain, geo)
 * unit. Substitutes `{{placeholders}}` from the geo's placeholders.json.
 */

import { resolvePlaceholders } from '../sources/placeholders.js';

/**
 * @typedef {import('../config/config.js').HtmlSitemapConfig} HtmlSitemapConfig
 * @typedef {import('../sources/placeholders.js').PlaceholderMap} PlaceholderMap
 */

/**
 * @typedef {Object} PageCopy
 * @property {string} pageTitle
 */

/**
 * Resolve `{{placeholders}}` in every string field of a PageCopy.
 * @param {PageCopy} copy
 * @param {PlaceholderMap} placeholders
 * @returns {PageCopy}
 */
function resolvePageCopy(copy, placeholders) {
  return {
    pageTitle: resolvePlaceholders(copy.pageTitle, placeholders),
  };
}

/**
 * Look up the page-copy row for a unit and resolve placeholders. Falls back
 * to `pageTitle: 'Sitemap'` when no matching row exists.
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
  const row = config.pageCopy.find((entry) => entry.subdomain === unit.subdomain && entry.geo === unit.baseGeo);
  if (!row) {
    console.warn(`[warn] No page-copy row for ${unit.subdomain}/${unit.baseGeo || '(default)'}; using defaults`);
  }
  const copy = {
    pageTitle: row?.pageTitle || 'Sitemap',
  };
  return resolvePageCopy(copy, placeholders);
}
