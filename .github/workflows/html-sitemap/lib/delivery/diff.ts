import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadConfig } from '../planning/config.ts';
import { planExtractUnits } from '../planning/scope.ts';
import { mapWithConcurrency } from '../concurrency.ts';
import { getBaseGeoHtmlFile, pathExists } from '../files.ts';
import { normalizeDaRoot, getRemoteHtmlFilePath } from './remote-paths.ts';
import { getDaAuthHeader } from './da-auth.ts';
import { fetchRemoteHtml } from './da-source.ts';
import { formatStageGeo, getErrorMessage, type UnitStageResult } from '../stage.ts';

const UNIT_CONCURRENCY = 2;

export type DiffStatus = 'changed' | 'unchanged' | 'new';

type DiffSummary = {
  subdomain: string;
  baseGeo: string;
  status: DiffStatus;
  localHash?: string;
  remoteHash?: string;
};

export type DiffResult = UnitStageResult<DiffSummary>;

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function printSummary(units: Array<{ ok: boolean; summary?: DiffSummary; unit: { baseGeo: string } }>): void {
  const changed = units.flatMap((entry) => entry.summary?.status === 'changed' ? [formatStageGeo(entry.unit.baseGeo)] : []);
  const unchanged = units.flatMap((entry) => entry.summary?.status === 'unchanged' ? [formatStageGeo(entry.unit.baseGeo)] : []);
  const newPages = units.flatMap((entry) => entry.summary?.status === 'new' ? [formatStageGeo(entry.unit.baseGeo)] : []);
  const skipped = units.flatMap((entry) => !entry.summary ? [formatStageGeo(entry.unit.baseGeo)] : []);

  if (changed.length) console.log(`[summary] Changed: ${changed.join(', ')}`);
  if (newPages.length) console.log(`[summary] New: ${newPages.join(', ')}`);
  if (unchanged.length) console.log(`[summary] Unchanged: ${unchanged.join(', ')}`);
  if (skipped.length) console.log(`[summary] Skipped: ${skipped.join(', ')}`);
}

export async function runDiff({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  daRoot,
  fetchImpl = fetch,
}: {
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
  daRoot: string;
  fetchImpl?: typeof fetch;
}): Promise<DiffResult> {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });
  const authHeader = await getDaAuthHeader(fetchImpl);
  const normalizedRoot = normalizeDaRoot(daRoot);

  const settled = await mapWithConcurrency(units, UNIT_CONCURRENCY, async (unit) => {
    if (!unit.deploy) {
      return { ok: true, unit };
    }

    const localFile = getBaseGeoHtmlFile(outputDir, unit.subdomain, unit.baseGeo);
    const exists = await pathExists(localFile);
    if (!exists) {
      return { ok: true, unit };
    }

    try {
      const localHtml = await fs.readFile(localFile, 'utf8');
      const localHash = sha256(localHtml);
      const remoteFile = getRemoteHtmlFilePath(normalizedRoot, unit.baseGeo);
      const remote = await fetchRemoteHtml(unit.hostSite, remoteFile, authHeader, fetchImpl);

      let status: DiffStatus;
      let remoteHash: string | undefined;

      if (!remote.ok) {
        status = 'new';
      } else {
        remoteHash = sha256(remote.html);
        status = localHash === remoteHash ? 'unchanged' : 'changed';
      }

      console.log(`[diff] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${status}`);

      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          status,
          localHash,
          remoteHash,
        },
      };
    } catch (error) {
      console.error(`[error] diff ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
      return { ok: false, unit, error };
    }
  });

  printSummary(settled);

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
