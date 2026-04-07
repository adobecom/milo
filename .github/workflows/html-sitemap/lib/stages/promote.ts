import { loadConfig } from '../config/config.ts';
import { planExtractUnits } from '../config/scope.ts';
import type { ExtractUnit } from '../config/scope.ts';
import { mapWithConcurrency } from '../util/concurrency.ts';
import { getBaseGeoHtmlFile, pathExists } from '../util/files.ts';
import { normalizeDaRoot } from '../remote/paths.ts';
import {
  getAemDocumentUrl,
  getRepoToken,
  getRemotePromotePath,
  groupUnitsByRepo,
  pollJobStatus,
  startJob,
  type PromoteAction,
} from '../remote/aem-admin.ts';
import { formatStageGeo, getErrorMessage, type UnitStageResult } from '../util/stage.ts';

const GROUP_CONCURRENCY = 2;

type PromoteSummary = {
  subdomain: string;
  baseGeo: string;
  promoted: boolean;
  status?: number;
  remotePath?: string;
  documentUrl?: string;
};

type PromoteEntry = {
  ok: boolean;
  unit: ExtractUnit;
  summary: PromoteSummary;
  error?: unknown;
};

export type PromoteResult = UnitStageResult<PromoteSummary>;

function printSummary(action: PromoteAction, entries: PromoteEntry[]): void {
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
}: {
  action: PromoteAction;
  configRef: string;
  outputDir: string;
  subdomainFilter?: string;
  geoFilter?: string;
  daRoot: string;
  fetchImpl?: typeof fetch;
  pollIntervalMs?: number;
  maxPollAttempts?: number;
}): Promise<PromoteResult> {
  const config = await loadConfig(configRef);
  const units = planExtractUnits(config, { subdomainFilter, geoFilter });
  const normalizedRoot = normalizeDaRoot(daRoot);

  const skippedEntries: PromoteEntry[] = [];
  const presentUnits: ExtractUnit[] = [];
  for (const unit of units) {
    if (!unit.deploy) {
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
  const groups = new Map<string, ExtractUnit[]>();
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
          return {
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
          } satisfies PromoteEntry;
        });
      } catch (error) {
        return repoUnits.map((unit) => {
          console.error(`[error] ${action} ${unit.subdomain}/${formatStageGeo(unit.baseGeo)}: ${getErrorMessage(error)}`);
          const remotePath = getRemotePromotePath(normalizedRoot, unit.baseGeo);
          return {
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
          } satisfies PromoteEntry;
        });
      }
    },
  );

  const groupedPromoteEntries: PromoteEntry[] = groupEntries.flat();
  const entries: PromoteEntry[] = [
    ...skippedEntries,
    ...groupedPromoteEntries,
  ];

  printSummary(action, entries);

  return {
    hadFailures: entries.some((entry) => !entry.ok),
    units: entries,
  };
}
