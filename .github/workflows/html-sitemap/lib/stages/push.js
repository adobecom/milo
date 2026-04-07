import fs from 'node:fs/promises';
import { sha256 } from '../util/hash.js';
import { loadConfig } from '../config/config.js';
import { planExtractUnits } from '../config/scope.js';
import { mapWithConcurrency } from '../util/concurrency.js';
import { getBaseGeoHtmlFile, pathExists } from '../util/files.js';
import {
  normalizeDaRoot,
  getRemoteHtmlFilePath,
} from '../remote/paths.js';
import { getDaAuthHeader } from '../remote/da-auth.js';
import { fetchRemoteHtml, getDaLiveEditUrl, uploadHtmlFile } from '../remote/da-source.js';
import { formatStageGeo, getErrorMessage } from '../util/stages.js';

/**
 * @typedef {import('../util/stages.js').UnitStageEntry} UnitStageEntry
 * @typedef {import('../util/stages.js').UnitStageResult} UnitStageResult
 */

const UNIT_CONCURRENCY = 2;

/**
 * @typedef {Object} PushSummary
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {boolean} pushed
 * @property {string} [remotePath]
 * @property {string} [editUrl]
 */

/**
 * @typedef {UnitStageResult} PushResult
 */

/**
 * @param {UnitStageEntry[]} units
 * @returns {void}
 */
function printSummary(units) {
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

/**
 * @param {{ configRef: string, outputDir: string, subdomainFilter?: string, geoFilter?: string, daRoot: string, force?: boolean, fetchImpl?: typeof fetch }} options
 * @returns {Promise<PushResult>}
 */
export async function runPush({
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  daRoot,
  force = false,
  fetchImpl = fetch,
}) {
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
        if (!remote.ok && remote.status !== 404) {
          throw new Error(`Failed to fetch remote document for diff: HTTP ${remote.status}`);
        }
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
