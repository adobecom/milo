import { loadConfig } from '../planning/config.ts';
import { planExtractUnits, relevantExtendedGeos } from '../planning/scope.ts';
import { ensureDir } from '../files.ts';
import { mapWithConcurrency } from '../concurrency.ts';
import { formatStageGeo, getErrorMessage, type UnitStageResult } from '../stage.ts';
import {
  printExtractSummary,
  runExtractUnit,
  writeConfigSnapshot,
  type ExtractUnitSummary,
} from './extract-work.ts';

const UNIT_CONCURRENCY = 2;

type ExtractResult = UnitStageResult<ExtractUnitSummary>;

export async function runExtract({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  fetchImpl = fetch,
  now = new Date(),
}: {
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
  fetchImpl?: typeof fetch;
  now?: Date;
}): Promise<ExtractResult> {
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
