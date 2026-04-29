import fs from 'node:fs/promises';
import path from 'node:path';
import { relevantExtendedGeos } from '../config/scope.js';
import { getBaseGeoDataFile, getBaseGeoExtractDir, writeJson } from '../util/files.js';
import { loadPlaceholderMap } from '../sources/placeholders.js';
import { buildBaseGeoLinks } from './gnav-sections.js';
import { buildExtendedGeoLinks } from './links.js';
import { normalizeQueryIndexData } from './normalize.js';

/**
 * @typedef {import('../config/config.js').HtmlSitemapConfig} HtmlSitemapConfig
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 */

/**
 * @typedef {Object} TransformDataSummary
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {boolean} wroteData
 * @property {number} baseGeoSectionCount
 * @property {number} extendedGeoGroupCount
 * @property {number} extendedGeoConsideredCount
 * @property {number} extendedGeoWithRawLinksCount
 * @property {number} extendedGeoRenderedCount
 * @property {number} extendedGeoEmptyCount
 * @property {number} extendedGeoDedupedAwayCount
 */

/** @typedef {Awaited<ReturnType<typeof buildBaseGeoLinks>>} SitemapBaseGeoLinks */
/** @typedef {Awaited<ReturnType<typeof buildExtendedGeoLinks>>} SitemapExtendedGeoLinks */

/**
 * @typedef {Object} SitemapSections
 * @property {SitemapBaseGeoLinks} baseGeoLinks
 * @property {SitemapExtendedGeoLinks} extendedGeoLinks
 */

/**
 * @typedef {Object} SitemapDataDocument
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {string} domain
 * @property {SitemapSections} sections
 */

/**
 * @param {string} outputDir
 * @param {Pick<ExtractUnit, 'subdomain' | 'baseGeo'>} unit
 * @returns {Promise<SitemapDataDocument>}
 */
export async function readSitemapDataDocument(
  outputDir,
  unit,
) {
  return JSON.parse(
    await fs.readFile(getBaseGeoDataFile(outputDir, unit.subdomain, unit.baseGeo), 'utf8'),
  );
}

/**
 * @param {string} outputDir
 * @param {HtmlSitemapConfig} config
 * @param {ExtractUnit} unit
 * @param {{ geo: string }[]} renderedGroups
 * @returns {Promise<Pick<TransformDataSummary, 'extendedGeoConsideredCount' | 'extendedGeoWithRawLinksCount' | 'extendedGeoRenderedCount' | 'extendedGeoEmptyCount' | 'extendedGeoDedupedAwayCount'>>}
 */
async function summarizeExtendedGeoInputs(
  outputDir,
  config,
  unit,
  renderedGroups,
) {
  const geos = relevantExtendedGeos(config, unit);
  const rendered = new Set(renderedGroups.map((group) => group.geo));
  let withRawLinks = 0;
  let empty = 0;
  let dedupedAway = 0;

  await Promise.all(geos.map(async (geo) => {
    const geoDir = path.join(getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo), 'extended', geo);
    const siteDirs = await fs.readdir(geoDir).catch(() => []);
    let rawCount = 0;

    await Promise.all(siteDirs.map(async (siteDir) => {
      const json = JSON.parse(await fs.readFile(path.join(geoDir, siteDir, 'query-index.json'), 'utf8'));
      rawCount += normalizeQueryIndexData(json, unit.domain, config.siteDomains).length;
    }));

    if (rawCount > 0) {
      withRawLinks += 1;
      if (!rendered.has(geo)) dedupedAway += 1;
      return;
    }

    empty += 1;
  }));

  return {
    extendedGeoConsideredCount: geos.length,
    extendedGeoWithRawLinksCount: withRawLinks,
    extendedGeoRenderedCount: rendered.size,
    extendedGeoEmptyCount: empty,
    extendedGeoDedupedAwayCount: dedupedAway,
  };
}

/**
 * @param {string} outputDir
 * @param {HtmlSitemapConfig} config
 * @param {ExtractUnit} unit
 * @returns {Promise<TransformDataSummary>}
 */
export async function buildSitemapDataDocument(
  outputDir,
  config,
  unit,
) {
  const extractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  const placeholders = await loadPlaceholderMap(path.join(extractDir, 'placeholders.json'));
  const regionLabels = config.regionLabels?.[unit.subdomain] || {};

  const baseGeoLinks = await buildBaseGeoLinks(
    path.join(extractDir, 'gnav'),
    placeholders,
    unit.domain,
    config.siteDomains,
  ).catch(() => []);
  const extendedGeoLinks = await buildExtendedGeoLinks(outputDir, config, unit, regionLabels);
  const extendedGeoSummary = await summarizeExtendedGeoInputs(outputDir, config, unit, extendedGeoLinks);

  /** @type {SitemapDataDocument} */
  const document = {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    domain: unit.domain,
    sections: {
      baseGeoLinks,
      extendedGeoLinks,
    },
  };

  await writeJson(getBaseGeoDataFile(outputDir, unit.subdomain, unit.baseGeo), document);

  return {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    wroteData: true,
    baseGeoSectionCount: baseGeoLinks.length,
    extendedGeoGroupCount: extendedGeoLinks.length,
    ...extendedGeoSummary,
  };
}
