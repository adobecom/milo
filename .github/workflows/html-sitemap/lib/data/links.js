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
 * @typedef {Record<string, string>} RegionLabelMap
 *   geo -> label, scoped to a single subdomain
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
 * Strip trailing `.html` so legacy (cc) and modern (da-cc) paths compare equal.
 * @param {string} pathname
 * @returns {string}
 */
function stripHtmlSuffix(pathname) {
  return pathname.replace(/\.html$/, '');
}

/**
 * @param {string} pathname
 * @param {string} geo
 * @returns {string}
 */
function dedupKey(pathname, geo) {
  return stripHtmlSuffix(canonicalizePathForGeo(pathname, geo));
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
  const geoDir = getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, geo);
  const siteDirs = await fs.readdir(geoDir).catch(() => []);
  const perSite = await Promise.all(siteDirs.map(async (siteDir) => {
    const dir = path.join(geoDir, siteDir);
    const [json, meta] = await Promise.all([
      fs.readFile(path.join(dir, 'query-index.json'), 'utf8').then(JSON.parse),
      fs.readFile(path.join(dir, '_meta.json'), 'utf8').then(JSON.parse).catch(() => ({})),
    ]);
    return {
      site: siteDir,
      links: normalizeQueryIndexData(json, unit.domain, config.siteDomains, meta.originUrl),
    };
  }));

  // Inter-site dedup: same logical path can appear in legacy (cc) with `.html`
  // and modern (da-cc) without. Strip `.html` for comparison and prefer da-*.
  /** @type {Map<string, { link: NormalizedLink, site: string }>} */
  const byKey = new Map();
  for (const { site, links } of perSite) {
    const isDa = site.startsWith('da-');
    for (const link of links) {
      const key = stripHtmlSuffix(link.path);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, { link, site });
      } else if (!existing.site.startsWith('da-') && isDa) {
        byKey.set(key, { link, site });
      }
    }
  }
  return [...byKey.values()].map((entry) => entry.link);
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
        .forEach((link) => basePaths.add(dedupKey(link.path, unit.baseGeo)));
    }));

  const groups = await Promise.all(
    relevantExtendedGeos(config, unit).map(async (geo) => {
      const links = await loadExtendedQueryIndexLinks(outputDir, config, unit, geo);
      const seen = new Set();
      const deduped = links.filter((link) => {
        const key = dedupKey(link.path, geo);
        if (basePaths.has(key) || seen.has(key)) return false;
        seen.add(key);
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
