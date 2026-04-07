import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadConfig } from '../planning/config.ts';
import { planExtractUnits } from '../planning/scope.ts';
import { mapWithConcurrency } from '../concurrency.ts';
import { getBaseGeoHtmlFile, pathExists } from '../files.ts';
import {
  normalizeDaRoot,
  getRemoteHtmlFilePath,
} from './remote-paths.ts';
import { getDaAuthHeader } from './da-auth.ts';
import { fetchRemoteHtml, getDaLiveEditUrl, uploadHtmlFile } from './da-source.ts';
import { formatStageGeo, getErrorMessage, type UnitStageEntry, type UnitStageResult } from '../stage.ts';
const UNIT_CONCURRENCY = 2;

type PushSummary = {
  subdomain: string;
  baseGeo: string;
  pushed: boolean;
  remotePath?: string;
  editUrl?: string;
};

export type PushResult = UnitStageResult<PushSummary>;

function printSummary(units: UnitStageEntry<PushSummary>[]): void {
  const pushed = units.flatMap((entry) => entry.summary?.pushed ? [formatStageGeo(entry.summary.baseGeo)] : []);
  const skipped = units.flatMap((entry) => !entry.summary?.pushed ? [formatStageGeo(entry.unit.baseGeo)] : []);
  console.log(`[summary] Base geos pushed: ${pushed.length}${pushed.length ? ` -> ${pushed.join(', ')}` : ''}`);
  const pushedUrls = units.flatMap((entry) => entry.summary?.editUrl ? [entry.summary.editUrl] : []);
  if (pushedUrls.length) {
    console.log('[summary] Pushed DA URLs:');
    pushedUrls.forEach((url) => console.log(`  ${url}`));
  }
  if (skipped.length) {
    console.log(`[summary] Base geos skipped for push: ${skipped.join(', ')}`);
  }
}

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

export async function runPush({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  daRoot,
  force = false,
  fetchImpl = fetch,
}: {
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
  daRoot: string;
  force?: boolean;
  fetchImpl?: typeof fetch;
}): Promise<PushResult> {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });
  const authHeader = await getDaAuthHeader(fetchImpl);
  const normalizedRoot = normalizeDaRoot(daRoot);

  const settled = await mapWithConcurrency(units, UNIT_CONCURRENCY, async (unit) => {
    if (!unit.deploy) {
      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          pushed: false,
        },
      };
    }

    const localFile = getBaseGeoHtmlFile(outputDir, unit.subdomain, unit.baseGeo);
    const exists = await pathExists(localFile);
    if (!exists) {
      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          pushed: false,
        },
      };
    }

    const remoteFile = getRemoteHtmlFilePath(normalizedRoot, unit.baseGeo);
    const editUrl = getDaLiveEditUrl(unit.hostSite, remoteFile);

    try {
      if (!force) {
        const localHtml = await fs.readFile(localFile, 'utf8');
        const localHash = sha256(localHtml);
        const remote = await fetchRemoteHtml(unit.hostSite, remoteFile, authHeader, fetchImpl);
        if (remote.ok && sha256(remote.html) === localHash) {
          console.log(`[push] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: unchanged, skipping`);
          return {
            ok: true,
            unit,
            summary: {
              subdomain: unit.subdomain,
              baseGeo: unit.baseGeo,
              pushed: false,
            },
          };
        }
      }

      console.log(`[push] ${unit.subdomain}/${formatStageGeo(unit.baseGeo)} -> ${editUrl}`);
      await uploadHtmlFile(unit.hostSite, remoteFile, localFile, authHeader, fetchImpl);
      return {
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          pushed: true,
          remotePath: remoteFile,
          editUrl,
        },
      };
    } catch (error) {
      console.error(`[error] push ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
      return { ok: false, unit, error };
    }
  });

  printSummary(settled);

  return {
    hadFailures: settled.some((entry) => !entry.ok),
    units: settled,
  };
}
