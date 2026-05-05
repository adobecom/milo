import { loadConfig } from '../config/config.js';
import { planExtractUnits } from '../config/scope.js';
import { mapWithConcurrency } from '../util/concurrency.js';
import { getBaseGeoHtmlFile, pathExists } from '../util/files.js';
import { normalizeDaRoot } from '../remote/paths.js';
import {
  getAemDocumentUrl,
  getRepoToken,
  getRemotePromotePath,
  groupUnitsByRepo,
  pollJobStatus,
  startJob,
} from '../remote/aem-admin.js';
import { formatStageGeo, getErrorMessage } from '../util/stages.js';

/**
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 * @typedef {import('../remote/aem-admin.js').PromoteAction} PromoteAction
 * @typedef {import('../util/stages.js').UnitStageResult} UnitStageResult
 */

/** @type {string[]} */
const STAGE_ORDER = ['push', 'preview', 'publish'];

/**
 * Returns true if the unit's configured stage is at least as far as the action.
 * e.g. stage='preview' reaches 'preview' but not 'publish'.
 * @param {string} unitStage
 * @param {string} action
 * @returns {boolean}
 */
function unitReachesStage(unitStage, action) {
  if (!unitStage) return false;
  return STAGE_ORDER.indexOf(unitStage) >= STAGE_ORDER.indexOf(action);
}

const GROUP_CONCURRENCY = 2;

/**
 * @typedef {Object} PromoteSummary
 * @property {string} subdomain
 * @property {string} baseGeo
 * @property {boolean} promoted
 * @property {number} [status]
 * @property {string} [remotePath]
 * @property {string} [documentUrl]
 */

/**
 * @typedef {Object} PromoteEntry
 * @property {boolean} ok
 * @property {ExtractUnit} unit
 * @property {PromoteSummary} summary
 * @property {unknown} [error]
 */

/**
 * @typedef {UnitStageResult} PromoteResult
 */

/**
 * @param {PromoteAction} action
 * @param {PromoteEntry[]} entries
 * @returns {void}
 */
function printSummary(action, entries) {
  const promoted = entries.flatMap((entry) => entry.summary.promoted ? [formatStageGeo(entry.summary.baseGeo)] : []);
  const skipped = entries.flatMap((entry) => !entry.summary.promoted && entry.ok ? [formatStageGeo(entry.unit.baseGeo)] : []);
  const failed = entries.flatMap((entry) => !entry.ok ? [formatStageGeo(entry.unit.baseGeo)] : []);
  console.log(`[summary] Base geos ${action}ed: ${promoted.length}${promoted.length ? ` -> ${promoted.join(', ')}` : ''}`);
  const documentUrls = entries.flatMap((entry) => entry.summary.documentUrl ? [entry.summary.documentUrl] : []);
  if (documentUrls.length) {
    console.log(`[summary] ${action === 'preview' ? 'Preview' : 'Live'} URLs:`);
    documentUrls.forEach((url) => console.log(`  ${url}`));
  }
  if (skipped.length) {
    console.log(`[summary] Base geos skipped for ${action}: ${skipped.join(', ')}`);
  }
  if (failed.length) {
    console.log(`[summary] Base geos failed for ${action}: ${failed.join(', ')}`);
  }
}

/**
 * @param {{ action: PromoteAction, configRef: string, outputDir: string, subdomainFilter?: string, geoFilter?: string, daRoot: string, fetchImpl?: typeof fetch, pollIntervalMs?: number, maxPollAttempts?: number }} options
 * @returns {Promise<PromoteResult>}
 */
export async function runPromote({
  action,
  configRef,
  outputDir,
  subdomainFilter,
  geoFilter,
  daRoot,
  fetchImpl = fetch,
  pollIntervalMs = 2000,
  maxPollAttempts = 30,
}) {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });
  const normalizedRoot = normalizeDaRoot(daRoot);

  /** @type {PromoteEntry[]} */
  const skippedEntries = [];
  /** @type {ExtractUnit[]} */
  const presentUnits = [];
  for (const unit of units) {
    if (!unitReachesStage(unit.stage, action)) {
      skippedEntries.push({
        ok: true,
        unit,
        summary: {
          subdomain: unit.subdomain,
          baseGeo: unit.baseGeo,
          promoted: false,
        },
      });
      continue;
    }
    const localFile = getBaseGeoHtmlFile(outputDir, unit.subdomain, unit.baseGeo);
    const exists = await pathExists(localFile);
    if (exists) {
      presentUnits.push(unit);
      continue;
    }
    skippedEntries.push({
      ok: true,
      unit,
      summary: {
        subdomain: unit.subdomain,
        baseGeo: unit.baseGeo,
        promoted: false,
      },
    });
  }
  const groups = new Map();
  groupUnitsByRepo(presentUnits).forEach((repoUnits, repo) => groups.set(repo, repoUnits));

  const groupEntries = await mapWithConcurrency(
    Array.from(groups.entries()),
    GROUP_CONCURRENCY,
    async ([repo, repoUnits]) => {
      const authHeader = getRepoToken(repo);
      const paths = repoUnits.map((unit) => {
        return getRemotePromotePath(normalizedRoot, unit.baseGeo);
      });
      const environment = action === 'preview' ? 'page' : 'live';
      const urls = repoUnits.map((unit) => getAemDocumentUrl(repo, getRemotePromotePath(normalizedRoot, unit.baseGeo), environment));

      try {
        console.log(`[${action}] ${repo} -> ${urls.join(', ')}`);
        const job = await startJob(action, repo, paths, authHeader, fetchImpl);
        const status = await pollJobStatus(job, authHeader, fetchImpl, pollIntervalMs, maxPollAttempts);
        const resources = status.data?.resources || [];
        const resourceStatuses = new Map(resources.map((resource) => [resource.path || '', resource.status || 0]));

        return repoUnits.map((unit) => {
          const remotePath = getRemotePromotePath(normalizedRoot, unit.baseGeo);
          const documentUrl = getAemDocumentUrl(repo, remotePath, environment);
          const statusCode = resourceStatuses.get(remotePath) || 0;
          const ok = statusCode === 200 || statusCode === 204;
          if (!ok) {
            console.error(`[error] ${action} ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: HTTP ${statusCode || 'unknown'}`);
          }
          return /** @type {PromoteEntry} */ ({
            ok,
            unit,
            summary: {
              subdomain: unit.subdomain,
              baseGeo: unit.baseGeo,
              promoted: ok,
              status: statusCode,
              remotePath,
              documentUrl,
            },
          });
        });
      } catch (error) {
        return repoUnits.map((unit) => {
          console.error(`[error] ${action} ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
          const remotePath = getRemotePromotePath(normalizedRoot, unit.baseGeo);
          return /** @type {PromoteEntry} */ ({
            ok: false,
            unit,
            error,
            summary: {
              subdomain: unit.subdomain,
              baseGeo: unit.baseGeo,
              promoted: false,
              remotePath,
              documentUrl: getAemDocumentUrl(repo, remotePath, environment),
            },
          });
        });
      }
    },
  );

  /** @type {PromoteEntry[]} */
  const groupedPromoteEntries = groupEntries.flat();
  /** @type {PromoteEntry[]} */
  const entries = [
    ...skippedEntries,
    ...groupedPromoteEntries,
  ];

  printSummary(action, entries);

  return {
    hadFailures: entries.some((entry) => !entry.ok),
    units: entries,
  };
}
