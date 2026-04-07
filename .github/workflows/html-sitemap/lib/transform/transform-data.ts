import { loadConfig } from '../planning/config.ts';
import { planExtractUnits } from '../planning/scope.ts';
import { mapWithConcurrency } from '../concurrency.ts';
import { collectTransformableBaseGeos, makeBaseGeoKey } from '../planning/availability.ts';
import { buildSitemapDataDocument, type TransformDataSummary } from './sitemap-data.ts';
import { formatStageGeo, getErrorMessage, type UnitStageEntry, type UnitStageResult } from '../stage.ts';

const UNIT_CONCURRENCY = 2;

type TransformDataResult = UnitStageResult<TransformDataSummary>;

function printSummary(units: UnitStageEntry<TransformDataSummary>[]): void {
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

export async function runTransformData({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
}: {
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
}): Promise<TransformDataResult> {
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
