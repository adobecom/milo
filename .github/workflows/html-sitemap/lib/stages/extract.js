import path from 'node:path';
import fs from 'node:fs/promises';
import { loadConfig } from '../config/config.js';
import { planExtractUnits, relevantExtendedGeos } from '../config/scope.js';
import {
  ensureDir,
  getBaseGeoDir,
  getBaseGeoExtractDir,
  getExtendedGeoDir,
  writeJson,
  writeText,
} from '../util/files.js';
import { mapWithConcurrency } from '../util/concurrency.js';
import { formatStageGeo, getErrorMessage } from '../util/stages.js';
import { extractGnavArtifacts, getPlaceholdersUrl } from '../sources/gnav.js';
import { fetchJson } from '../util/fetch.js';
import { fetchQueryIndex } from '../sources/query-index.js';
import { normalizeQueryIndexData } from '../data/normalize.js';

/**
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 * @typedef {import('../util/stages.js').UnitStageResult} UnitStageResult
 */

const UNIT_CONCURRENCY = 2;

/**
 * @typedef {Object} QueryIndexSummary
 * @property {string} site
 * @property {string} geo
 * @property {boolean} ok
 * @property {number} rowCount
 * @property {number} indexableCount
 * @property {string} [url]
 * @property {unknown} [json]
 * @property {number} [status]
 * @property {string} [statusText]
 */

/**
 * @typedef {Object} ExtractUnitSummary
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {boolean} gnavOk
 * @property {boolean} placeholdersOk
 * @property {QueryIndexSummary[]} baseQueryIndices
 * @property {QueryIndexSummary[]} extendedQueryIndices
 * @property {boolean} sitemapEligible
 */

/**
 * @param {string} geo
 * @returns {string}
 */
function formatGeo(geo) {
  return geo || '(default)';
}

/**
 * @param {string} outputDir
 * @param {unknown} rawConfig
 * @returns {Promise<void>}
 */
async function writeConfigSnapshot(outputDir, rawConfig) {
  await writeJson(path.join(outputDir, 'html-sitemap.json'), rawConfig);
}

/**
 * @param {string} baseExtractDir
 * @param {ExtractUnit} unit
 * @param {Awaited<ReturnType<typeof extractGnavArtifacts>>} gnavResult
 * @param {Date} now
 * @returns {Promise<boolean>}
 */
async function writeGnav(
  baseExtractDir,
  unit,
  gnavResult,
  now,
) {
  if (!gnavResult.ok) {
    console.warn(gnavResult.warning);
    return false;
  }

  const gnavDir = path.join(baseExtractDir, 'gnav');
  await ensureDir(gnavDir);

  await Promise.all(gnavResult.artifacts.map((artifact) => writeText(
    path.join(gnavDir, artifact.file),
    artifact.content,
  )));

  const manifest = {
    generatedAt: now.toISOString(),
    subdomain: unit.subdomain,
    hostSite: unit.hostSite,
    baseGeo: unit.baseGeo,
    sourceOrigin: gnavResult.sourceOrigin,
    files: gnavResult.artifacts.map((artifact) => ({
      file: artifact.file,
      kind: artifact.kind,
      sourceUrl: artifact.sourceUrl,
      sourcePath: artifact.sourcePath,
      parentFile: artifact.parentFile,
      heading: artifact.heading || null,
    })),
  };

  await writeJson(path.join(gnavDir, 'manifest.json'), manifest);
  return true;
}

/**
 * @param {string} baseExtractDir
 * @param {ExtractUnit} unit
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<boolean>}
 */
async function writePlaceholders(baseExtractDir, unit, fetchImpl) {
  const url = getPlaceholdersUrl(unit.baseGeo);
  const response = await fetchJson(url, {}, { fetchImpl });
  if (!response.ok) {
    console.warn(`[warn] Skipping placeholders for ${unit.subdomain}/${formatGeo(unit.baseGeo)}: ${response.status} ${response.statusText}`);
    return false;
  }

  try {
    const json = await response.json();
    await writeJson(path.join(baseExtractDir, 'placeholders.json'), json);
    return true;
  } catch (error) {
    console.warn(`[warn] Skipping placeholders for ${unit.subdomain}/${formatGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
    return false;
  }
}

/**
 * @param {ExtractUnit} unit
 * @param {string} geo
 * @param {string} site
 * @param {string} queryIndexPath
 * @param {boolean} addHtmlExtension
 * @param {Record<string, string>} siteDomains
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<QueryIndexSummary>}
 */
async function fetchQueryIndexSummary(
  unit,
  geo,
  site,
  queryIndexPath,
  addHtmlExtension,
  siteDomains,
  fetchImpl,
) {
  const result = await fetchQueryIndex({
    site,
    geo,
    queryIndexPath,
    fetchImpl,
  });

  if (!result.ok) {
    console.warn(`[warn] Skipping query index for ${unit.subdomain}/${formatGeo(geo)} ${site}: ${result.status} ${result.statusText}`);
    return {
      site,
      geo,
      ok: false,
      rowCount: 0,
      indexableCount: 0,
      status: result.status,
      statusText: result.statusText,
    };
  }

  return {
    site,
    geo,
    ok: true,
    url: result.url,
    rowCount: result.rowCount,
    indexableCount: normalizeQueryIndexData(result.json, unit.domain, siteDomains, { addHtmlExtension }).length,
    json: result.json,
  };
}

/**
 * @param {ExtractUnit} unit
 * @param {{ outputDir: string, siteDomains: Record<string, string>, allExtendedGeos: string[], fetchImpl?: typeof fetch, now: Date }} options
 * @returns {Promise<ExtractUnitSummary>}
 */
async function runExtractUnit(
  unit,
  {
    outputDir,
    siteDomains,
    allExtendedGeos,
    fetchImpl,
    now,
  },
) {
  console.log(`[extract] ${unit.subdomain}/${formatGeo(unit.baseGeo)}`);

  const baseQueryResults = await Promise.all(unit.queryIndexRows.map((row) => fetchQueryIndexSummary(
    unit,
    unit.baseGeo,
    row.site,
    row.queryIndexPath,
    row.addHtmlExtension,
    siteDomains,
    fetchImpl,
  )));

  const sitemapEligible = baseQueryResults.some((result) => result.ok && result.indexableCount > 0);
  if (!sitemapEligible) {
    const geoDir = getBaseGeoDir(outputDir, unit.subdomain, unit.baseGeo);
    await Promise.all([
      fs.rm(path.join(geoDir, '_extract'), { recursive: true, force: true }),
      fs.rm(path.join(geoDir, 'sitemap.json'), { force: true }),
      fs.rm(path.join(geoDir, 'sitemap.html'), { force: true }),
    ]);
    return {
      subdomain: unit.subdomain,
      baseGeo: unit.baseGeo,
      gnavOk: false,
      placeholdersOk: false,
      baseQueryIndices: baseQueryResults,
      extendedQueryIndices: [],
      sitemapEligible,
    };
  }

  const baseExtractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  await ensureDir(baseExtractDir);

  await Promise.all(baseQueryResults
    .filter((result) => result.ok)
    .flatMap((result) => [
      writeJson(path.join(baseExtractDir, result.site, 'query-index.json'), result.json),
      writeJson(path.join(baseExtractDir, result.site, '_meta.json'), { originUrl: result.url }),
    ]));

  const gnavResult = await extractGnavArtifacts({
    hostSite: unit.hostSite,
    baseGeo: unit.baseGeo,
    fetchImpl,
  });
  const gnavOk = await writeGnav(baseExtractDir, unit, gnavResult, now);
  const placeholdersOk = await writePlaceholders(baseExtractDir, unit, fetchImpl);

  const extendedQueryResults = await Promise.all(
    allExtendedGeos.flatMap((extendedGeo) => unit.queryIndexRows.map(async (row) => {
      const summary = await fetchQueryIndexSummary(
        unit,
        extendedGeo,
        row.site,
        row.queryIndexPath,
        row.addHtmlExtension,
        siteDomains,
        fetchImpl,
      );
      if (summary.ok) {
        const extendedGeoSiteDir = path.join(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, extendedGeo), row.site);
        await Promise.all([
          writeJson(path.join(extendedGeoSiteDir, 'query-index.json'), summary.json),
          writeJson(path.join(extendedGeoSiteDir, '_meta.json'), { originUrl: summary.url }),
        ]);
      }
      return summary;
    })),
  );

  return {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    gnavOk,
    placeholdersOk,
    baseQueryIndices: baseQueryResults,
    extendedQueryIndices: extendedQueryResults,
    sitemapEligible,
  };
}

/**
 * @param {{ summary?: ExtractUnitSummary }[]} units
 * @returns {void}
 */
function printExtractSummary(
  units,
) {
  const summaries = units.flatMap((entry) => (entry.summary ? [entry.summary] : []));
  if (!summaries.length) {
    console.log('[summary] No extract units completed.');
    return;
  }

  const pageCandidates = summaries.filter((summary) => summary.sitemapEligible).map((summary) => formatGeo(summary.baseGeo));
  const noPageCandidates = summaries.filter((summary) => !summary.sitemapEligible).map((summary) => formatGeo(summary.baseGeo));
  const missingGnav = summaries.filter((summary) => !summary.gnavOk).map((summary) => formatGeo(summary.baseGeo));
  const missingPlaceholders = summaries.filter((summary) => !summary.placeholdersOk).map((summary) => formatGeo(summary.baseGeo));
  const baseMisses = summaries.flatMap((summary) =>
    summary.baseQueryIndices
      .filter((result) => !result.ok)
      .map((result) => `${formatGeo(summary.baseGeo)}:${result.site}`),
  );
  const extendedSuccessCount = summaries.reduce((count, summary) => count + summary.extendedQueryIndices.filter((result) => result.ok).length, 0);
  const extendedMissCount = summaries.reduce((count, summary) => count + summary.extendedQueryIndices.filter((result) => !result.ok).length, 0);

  console.log(`[summary] Base geos processed: ${summaries.length}`);
  console.log(`[summary] Base geos with sitemap output: ${pageCandidates.length}${pageCandidates.length ? ` -> ${pageCandidates.join(', ')}` : ''}`);
  if (noPageCandidates.length) {
    console.log(`[summary] Base geos without sitemap output: ${noPageCandidates.join(', ')}`);
  }
  if (missingGnav.length && missingGnav.length !== summaries.length) {
    console.log(`[summary] Missing GNAV: ${missingGnav.join(', ')}`);
  }
  if (missingPlaceholders.length && missingPlaceholders.length !== summaries.length) {
    console.log(`[summary] Missing placeholders: ${missingPlaceholders.join(', ')}`);
  }
  if (baseMisses.length) {
    console.log(`[summary] Missing base query indices: ${baseMisses.join(', ')}`);
  }
  if (extendedSuccessCount || extendedMissCount) {
    console.log(`[summary] Extended query indices: ${extendedSuccessCount} fetched, ${extendedMissCount} skipped`);
  }
}

/**
 * @param {{ configRef: string, outputDir: string, subdomainFilter?: string, geoFilter?: string, fetchImpl?: typeof fetch, now?: Date }} options
 * @returns {Promise<UnitStageResult>}
 */
export async function runExtract({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  fetchImpl = fetch,
  now = new Date(),
}) {
  const config = await loadConfig(configRef, { fetchImpl });
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });

  await ensureDir(outputDir);
  await writeConfigSnapshot(outputDir, config.raw);

  const settled = await mapWithConcurrency(units, UNIT_CONCURRENCY, async (unit) => {
    try {
      const summary = await runExtractUnit(unit, {
        outputDir,
        siteDomains: config.siteDomains,
        allExtendedGeos: relevantExtendedGeos(config, unit),
        fetchImpl,
        now,
      });
      return { ok: true, unit, summary };
    } catch (error) {
      console.error(`[error] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
      return { ok: false, unit, error };
    }
  });

  printExtractSummary(settled);

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
