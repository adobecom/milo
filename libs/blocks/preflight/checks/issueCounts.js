import { getPreflightResults } from './preflightApi.js';
import { runChecks as runLocalizationChecks } from './localization.js';
import { SEVERITY, STATUS } from './constants.js';

const issues = (errors = 0, warnings = 0) => ({ errors, warnings });
const failedToRun = { status: STATUS.FAIL };
const unfinished = { status: STATUS.LIMBO };
const SLOW_CHECK_TIMEOUT_MS = 10000;
const withTimeout = (promise, ms, onTimeout) => Promise.race([
  promise,
  new Promise((resolve) => { setTimeout(() => resolve(onTimeout), ms); }),
]);
const isFail = (check) => check?.status === STATUS.FAIL;
const isWarning = (check) => check?.status === STATUS.LIMBO
  || (isFail(check) && check.severity === SEVERITY.WARNING);

const countChecks = (checks = []) => issues(
  checks.filter((check) => isFail(check) && !isWarning(check)).length,
  checks.filter(isWarning).length,
);

export function countIssues(checks, linkErrors = 0) {
  const [a11y] = checks.accessibility || [];
  const [merch] = checks.merch || [];
  const [assets] = checks.assets || [];
  const { criticalAssetFailures = [], warningAssetFailures = [] } = assets?.details || {};
  const general = countChecks(checks.structure);
  return {
    General: issues(general.errors + linkErrors, general.warnings),
    SEO: countChecks(checks.seo),
    'M@S': issues(isFail(merch) ? merch.details?.unpublished?.length : 0),
    Accessibility: issues(isFail(a11y) ? a11y.details?.issuesCount : 0),
    Performance: countChecks(checks.performance),
    Assets: issues(criticalAssetFailures.length, warningAssetFailures.length),
  };
}

export async function getIssueCounts(
  { slowCheckTimeoutMs = SLOW_CHECK_TIMEOUT_MS, ...options } = {},
) {
  const [results, [linkCheck]] = await Promise.all([
    getPreflightResults(options),
    withTimeout(runLocalizationChecks({ area: document }).catch(() => []), slowCheckTimeoutMs, []),
  ]);
  if (!results?.runChecks) return null;
  const seo = await Promise.all((results.runChecks.seo ?? []).map((check) => withTimeout(
    Promise.resolve(check).catch(() => failedToRun),
    slowCheckTimeoutMs,
    unfinished,
  )));
  return countIssues({ ...results.runChecks, seo }, linkCheck?.details?.violations?.length);
}
