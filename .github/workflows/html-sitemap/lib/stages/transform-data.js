import { loadConfig } from '../config/config.js';
import { planExtractUnits } from '../config/scope.js';
import { mapWithConcurrency } from '../util/concurrency.js';
import { collectTransformableBaseGeos, makeBaseGeoKey } from '../config/availability.js';
import { buildSitemapDataDocument } from '../data/sitemap.js';
import { formatStageGeo, getErrorMessage } from '../util/stages.js';

/**
 * @typedef {import('../data/sitemap.js').TransformDataSummary} TransformDataSummary
 * @typedef {import('../util/stages.js').UnitStageEntry} UnitStageEntry
 * @typedef {import('../util/stages.js').UnitStageResult} UnitStageResult
 */

const UNIT_CONCURRENCY = 2;

/**
 * @param {UnitStageEntry[]} units
 * @returns {void}
 */
function printSummary(units) {
  const written = units.flatMap((entry) => entry.summary?.wroteData ? [formatStageGeo(entry.summary.baseGeo)] : []);
  const skipped = units.flatMap((entry) => !entry.summary?.wroteData ? [formatStageGeo(entry.unit.baseGeo)] : []);
  const extendedConsidered = units.reduce((total, entry) => total + (entry.summary?.extendedGeoConsideredCount || 0), 0);
  const extendedWithRaw = units.reduce((total, entry) => total + (entry.summary?.extendedGeoWithRawLinksCount || 0), 0);
  const extendedRendered = units.reduce((total, entry) => total + (entry.summary?.extendedGeoRenderedCount || 0), 0);
  const extendedEmpty = units.reduce((total, entry) => total + (entry.summary?.extendedGeoEmptyCount || 0), 0);
  const extendedDeduped = units.reduce((total, entry) => total + (entry.summary?.extendedGeoDedupedAwayCount || 0), 0);
  console.log(`[summary] Base geos transformed: ${written.length}${written.length ? ` -> ${written.join(', ')}` : ''}`);
  if (skipped.length) {
    console.log(`[summary] Base geos skipped: ${skipped.join(', ')}`);
  }
  if (extendedConsidered) {
    console.log(`[summary] Extended geos considered: ${extendedConsidered}`);
    console.log(`[summary] Extended geos with raw links: ${extendedWithRaw}`);
    console.log(`[summary] Extended geos rendered after dedupe: ${extendedRendered}`);
    console.log(`[summary] Extended geos empty after fetch: ${extendedEmpty}`);
    console.log(`[summary] Extended geos fully removed by dedupe: ${extendedDeduped}`);
  }
}

/**
 * @param {{ configRef: string, outputDir: string, subdomainFilter?: string, geoFilter?: string }} options
 * @returns {Promise<UnitStageResult>}
 */
export async function runTransformData({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
}) {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });
  const siblingCandidateUnits = planExtractUnits(config, { subdomainFilter });
  const availableBaseGeos = await collectTransformableBaseGeos(outputDir, siblingCandidateUnits);

  const settled = await mapWithConcurrency(units, UNIT_CONCURRENCY, async (unit) => {
    const transformable = availableBaseGeos.has(makeBaseGeoKey(unit.subdomain, unit.baseGeo));
    if (!transformable) {
      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          wroteData: false,
          baseGeoSectionCount: 0,
          extendedGeoGroupCount: 0,
          extendedGeoConsideredCount: 0,
          extendedGeoWithRawLinksCount: 0,
          extendedGeoRenderedCount: 0,
          extendedGeoEmptyCount: 0,
          extendedGeoDedupedAwayCount: 0,
        },
      };
    }

    try {
      console.log(`[transform:data] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}`);
      const summary = await buildSitemapDataDocument(outputDir, config, unit);
      return { ok: true, unit, summary };
    } catch (error) {
      console.error(`[error] transform:data ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
      return { ok: false, unit, error };
    }
  });

  printSummary(settled);

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
