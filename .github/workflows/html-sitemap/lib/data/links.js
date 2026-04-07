import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeQueryIndexData } from './normalize.js';
import { formatGeoLabelFromInventory } from './geo-labels.js';
import { relevantExtendedGeos } from '../config/scope.js';
import { getBaseGeoExtractDir, getExtendedGeoDir } from '../util/files.js';

/**
 * @typedef {import('./normalize.js').NormalizedLink} NormalizedLink
 * @typedef {import('./geo-labels.js').GeoLabelInventoryEntry} GeoLabelInventoryEntry
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 * @typedef {import('../config/config.js').HtmlSitemapConfig} HtmlSitemapConfig
 * @typedef {import('../sources/regions.js').RegionLabelMap} RegionLabelMap
 */

/**
 * @typedef {Object} OtherSitemapLink
 * @property {string} geo
 * @property {string} title
 * @property {string} url
 */

/**
 * @typedef {Object} ExtendedGeoGroup
 * @property {string} geo
 * @property {string} title
 * @property {NormalizedLink[]} links
 */

/**
 * @param {HtmlSitemapConfig} config
 * @param {string} subdomain
 * @returns {GeoLabelInventoryEntry[]}
 */
function buildGeoLabelInventory(config, subdomain) {
  /** @type {Map<string, GeoLabelInventoryEntry>} */
  const entries = new Map();

  for (const row of config.geoMap.filter((entry) => entry.subdomain === subdomain)) {
    if (!entries.has(row.baseGeo)) {
      entries.set(row.baseGeo, { geo: row.baseGeo, language: row.language });
    }

    for (const extendedGeo of row.extendedGeos) {
      if (!entries.has(extendedGeo)) {
        const [, extendedLanguage] = extendedGeo.split('_');
        entries.set(extendedGeo, {
          geo: extendedGeo,
          language: extendedLanguage || row.language,
        });
      }
    }
  }

  return [...entries.values()];
}

/**
 * @param {string} _geo
 * @param {string} label
 * @param {GeoLabelInventoryEntry[]} _inventory
 * @returns {string}
 */
function normalizeRegionLabel(
  _geo,
  label,
  _inventory,
) {
  const normalized = label.replace(/\s+/g, ' ').trim();
  return normalized.replace(/\s+-\s+.+$/u, '').trim();
}

/**
 * @param {string} geo
 * @param {GeoLabelInventoryEntry[]} inventory
 * @param {RegionLabelMap} regionLabels
 * @returns {string}
 */
function resolveGeoLabel(
  geo,
  inventory,
  regionLabels,
) {
  if (!geo) return 'Global';
  const regionLabel = regionLabels[geo];
  if (regionLabel) return normalizeRegionLabel(geo, regionLabel, inventory);
  return formatGeoLabelFromInventory(geo, inventory);
}

/**
 * @param {string} pathname
 * @param {string} geo
 * @returns {string}
 */
function canonicalizePathForGeo(pathname, geo) {
  if (!geo) return pathname;
  const prefix = `/${geo}`;
  if (pathname === prefix) return '/';
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length) || '/';
  }
  return pathname;
}

/**
 * @param {string} domain
 * @param {string} geo
 * @returns {string}
 */
function sitemapUrl(domain, geo) {
  const prefix = geo ? `/${geo}` : '';
  return `https://${domain}${prefix}/sitemap.html`;
}

/**
 * @param {HtmlSitemapConfig} config
 * @param {ExtractUnit} unit
 * @param {RegionLabelMap} regionLabels
 * @returns {OtherSitemapLink[]}
 */
export function buildOtherSitemapLinks(
  config,
  unit,
  regionLabels,
) {
  const geoLabelInventory = buildGeoLabelInventory(config, unit.subdomain);
  return config.geoMap
    .filter((row) => row.subdomain === unit.subdomain)
    .filter((row) => row.baseGeo !== unit.baseGeo)
    .filter((row) => row.deploy)
    .map((row) => ({
      geo: row.baseGeo,
      title: resolveGeoLabel(row.baseGeo, geoLabelInventory, regionLabels),
      url: sitemapUrl(unit.domain, row.baseGeo),
    }));
}

/**
 * @param {string} outputDir
 * @param {HtmlSitemapConfig} config
 * @param {ExtractUnit} unit
 * @param {string} geo
 * @returns {Promise<NormalizedLink[]>}
 */
async function loadExtendedQueryIndexLinks(
  outputDir,
  config,
  unit,
  geo,
) {
  const siteDirs = await fs.readdir(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, geo)).catch(() => []);
  const links = await Promise.all(siteDirs.map(async (siteDir) => {
    const json = JSON.parse(await fs.readFile(path.join(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, geo), siteDir, 'query-index.json'), 'utf8'));
    return normalizeQueryIndexData(json, unit.domain, config.siteDomains);
  }));
  return links.flat();
}

/**
 * @param {string} outputDir
 * @param {HtmlSitemapConfig} config
 * @param {ExtractUnit} unit
 * @param {RegionLabelMap} regionLabels
 * @returns {Promise<ExtendedGeoGroup[]>}
 */
export async function buildExtendedGeoLinks(
  outputDir,
  config,
  unit,
  regionLabels,
) {
  const geoLabelInventory = buildGeoLabelInventory(config, unit.subdomain);
  const baseExtractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  const baseSiteDirs = await fs.readdir(baseExtractDir).catch(() => []);
  const basePaths = new Set();

  await Promise.all(baseSiteDirs
    .filter((entry) => entry !== 'gnav' && entry !== 'extended' && !entry.endsWith('.json') && !entry.endsWith('.html'))
    .map(async (siteDir) => {
      const json = JSON.parse(await fs.readFile(path.join(baseExtractDir, siteDir, 'query-index.json'), 'utf8'));
      normalizeQueryIndexData(json, unit.domain, config.siteDomains)
        .forEach((link) => basePaths.add(canonicalizePathForGeo(link.path, unit.baseGeo)));
    }));

  const groups = await Promise.all(
    relevantExtendedGeos(config, unit).map(async (geo) => {
      const links = await loadExtendedQueryIndexLinks(outputDir, config, unit, geo);
      const seen = new Set();
      const deduped = links.filter((link) => {
        const canonicalPath = canonicalizePathForGeo(link.path, geo);
        if (basePaths.has(canonicalPath) || seen.has(canonicalPath)) return false;
        seen.add(canonicalPath);
        return true;
      });
      if (!deduped.length) return null;
      return {
        geo,
        title: resolveGeoLabel(geo, geoLabelInventory, regionLabels),
        links: deduped,
      };
    }),
  );

  return groups.filter(Boolean);
}
