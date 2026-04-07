import path from 'node:path';
import fs from 'node:fs/promises';
import type { ExtractUnit } from '../config/scope.ts';
import {
  ensureDir,
  getBaseGeoExtractDir,
  getExtendedGeoDir,
  writeJson,
  writeText,
} from '../util/files.ts';
import { extractGnavArtifacts, getPlaceholdersUrl } from '../sources/gnav.ts';
import { fetchRegionsHtml, getRegionsUrl } from '../sources/regions.ts';
import { fetchJson } from '../util/fetch.ts';
import { fetchQueryIndex } from '../sources/query-index.ts';
import { normalizeQueryIndexData } from '../data/normalize.ts';
import { getErrorMessage } from '../util/stage.ts';

export type QueryIndexSummary = {
  site: string;
  geo: string;
  ok: boolean;
  rowCount: number;
  indexableCount: number;
  json?: unknown;
  status?: number;
  statusText?: string;
};

export type ExtractUnitSummary = {
  subdomain: string;
  baseGeo: string;
  gnavOk: boolean;
  placeholdersOk: boolean;
  regionsOk: boolean;
  baseQueryIndices: QueryIndexSummary[];
  extendedQueryIndices: QueryIndexSummary[];
  sitemapEligible: boolean;
};

function formatGeo(geo: string): string {
  return geo || '(default)';
}

export async function writeConfigSnapshot(outputDir: string, rawConfig: unknown): Promise<void> {
  await writeJson(path.join(outputDir, 'html-sitemap.json'), rawConfig);
}

async function writeGnav(
  baseExtractDir: string,
  unit: ExtractUnit,
  gnavResult: Awaited<ReturnType<typeof extractGnavArtifacts>>,
  now: Date,
): Promise<boolean> {
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

async function writePlaceholders(baseExtractDir: string, unit: ExtractUnit, fetchImpl?: typeof fetch): Promise<boolean> {
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

async function writeRegions(baseExtractDir: string, unit: ExtractUnit, fetchImpl?: typeof fetch): Promise<boolean> {
  const result = await fetchRegionsHtml(unit.hostSite, fetchImpl);
  if (!result.ok) {
    console.warn(`[warn] Skipping regions for ${unit.subdomain}/${formatGeo(unit.baseGeo)}: ${result.status} ${result.statusText} (${getRegionsUrl(unit.hostSite)})`);
    return false;
  }

  await writeText(path.join(baseExtractDir, 'regions.html'), result.html);
  return true;
}

async function fetchQueryIndexSummary(
  unit: ExtractUnit,
  geo: string,
  site: string,
  queryIndexPath: string,
  siteDomains: Record<string, string>,
  fetchImpl?: typeof fetch,
): Promise<QueryIndexSummary> {
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
    rowCount: result.rowCount,
    indexableCount: normalizeQueryIndexData(result.json, unit.domain, siteDomains).length,
    json: result.json,
  };
}

export async function runExtractUnit(
  unit: ExtractUnit,
  {
    outputDir,
    siteDomains,
    allExtendedGeos,
    fetchImpl,
    now,
  }: {
    outputDir: string;
    siteDomains: Record<string, string>;
    allExtendedGeos: string[];
    fetchImpl?: typeof fetch;
    now: Date;
  },
): Promise<ExtractUnitSummary> {
  console.log(`[extract] ${unit.subdomain}/${formatGeo(unit.baseGeo)}`);

  const baseQueryResults = await Promise.all(unit.queryIndexRows.map((row) => fetchQueryIndexSummary(
    unit,
    unit.baseGeo,
    row.site,
    row.queryIndexPath,
    siteDomains,
    fetchImpl,
  )));

  const sitemapEligible = baseQueryResults.some((result) => result.ok && result.indexableCount > 0);
  if (!sitemapEligible) {
    await fs.rm(path.join(outputDir, unit.subdomain, unit.baseGeo), { recursive: true, force: true });
    return {
      subdomain: unit.subdomain,
      baseGeo: unit.baseGeo,
      gnavOk: false,
      placeholdersOk: false,
      regionsOk: false,
      baseQueryIndices: baseQueryResults,
      extendedQueryIndices: [],
      sitemapEligible,
    };
  }

  const baseExtractDir = getBaseGeoExtractDir(outputDir, unit.subdomain, unit.baseGeo);
  await ensureDir(baseExtractDir);

  await Promise.all(baseQueryResults
    .filter((result) => result.ok)
    .map((result) => writeJson(
      path.join(baseExtractDir, result.site, 'query-index.json'),
      result.json,
    )));

  const gnavResult = await extractGnavArtifacts({
    hostSite: unit.hostSite,
    baseGeo: unit.baseGeo,
    fetchImpl,
  });
  const gnavOk = await writeGnav(baseExtractDir, unit, gnavResult, now);
  const placeholdersOk = await writePlaceholders(baseExtractDir, unit, fetchImpl);
  const regionsOk = await writeRegions(baseExtractDir, unit, fetchImpl);

  const extendedQueryResults = await Promise.all(
    allExtendedGeos.flatMap((extendedGeo) => unit.queryIndexRows.map(async (row) => {
      const summary = await fetchQueryIndexSummary(
        unit,
        extendedGeo,
        row.site,
        row.queryIndexPath,
        siteDomains,
        fetchImpl,
      );
      if (summary.ok) {
        await writeJson(
          path.join(getExtendedGeoDir(outputDir, unit.subdomain, unit.baseGeo, extendedGeo), row.site, 'query-index.json'),
          summary.json,
        );
      }
      return summary;
    })),
  );

  return {
    subdomain: unit.subdomain,
    baseGeo: unit.baseGeo,
    gnavOk,
    placeholdersOk,
    regionsOk,
    baseQueryIndices: baseQueryResults,
    extendedQueryIndices: extendedQueryResults,
    sitemapEligible,
  };
}

export function printExtractSummary(
  units: { summary?: ExtractUnitSummary }[],
): void {
  const summaries = units.flatMap((entry) => (entry.summary ? [entry.summary] : []));
  if (!summaries.length) {
    console.log('[summary] No extract units completed.');
    return;
  }

  const pageCandidates = summaries.filter((summary) => summary.sitemapEligible).map((summary) => formatGeo(summary.baseGeo));
  const noPageCandidates = summaries.filter((summary) => !summary.sitemapEligible).map((summary) => formatGeo(summary.baseGeo));
  const missingGnav = summaries.filter((summary) => !summary.gnavOk).map((summary) => formatGeo(summary.baseGeo));
  const missingPlaceholders = summaries.filter((summary) => !summary.placeholdersOk).map((summary) => formatGeo(summary.baseGeo));
  const missingRegions = summaries.filter((summary) => !summary.regionsOk).map((summary) => formatGeo(summary.baseGeo));
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
  if (missingRegions.length && missingRegions.length !== summaries.length) {
    console.log(`[summary] Missing regions: ${missingRegions.join(', ')}`);
  }
  if (baseMisses.length) {
    console.log(`[summary] Missing base query indices: ${baseMisses.join(', ')}`);
  }
  if (extendedSuccessCount || extendedMissCount) {
    console.log(`[summary] Extended query indices: ${extendedSuccessCount} fetched, ${extendedMissCount} skipped`);
  }
}
