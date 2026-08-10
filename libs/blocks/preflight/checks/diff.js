import { SEVERITY, STATUS } from './constants.js';
import fetchVersions from './diff/fetchVersions.js';
import computeDiff, { DIFF_STATE } from './diff/computeDiff.js';

const sectionCount = (s) => s.added.length + s.modified.length + s.removed.length;

export function countChanges(content, metadata) {
  return sectionCount(content) + sectionCount(metadata);
}

export function runChecks({ url = new URL(window.location.href) } = {}) {
  const result = (status, details) => ({
    name: 'Content Diff',
    status,
    severity: SEVERITY.WARNING,
    details,
  });
  return [(async () => {
    try {
      const resolvedUrl = url instanceof URL ? url : new URL(url, window.location.href);
      const versions = await fetchVersions(resolvedUrl);
      const diff = computeDiff(versions);

      if (diff.state === DIFF_STATE.SKIPPED || diff.state === DIFF_STATE.NO_PREVIEW) {
        return result(STATUS.PASS, { skipped: true });
      }
      if (diff.state === DIFF_STATE.LIVE_UNAVAILABLE) {
        return result(STATUS.LIMBO, {
          error: 'Could not load the live version to compare.',
          liveUnavailable: true,
          status: versions.status,
        });
      }

      const details = {
        content: diff.content,
        metadata: diff.metadata,
        status: versions.status,
        skipped: false,
      };
      // A brand-new (unpublished) page is all-new content, not a broken diff — always pass.
      if (diff.state === DIFF_STATE.NEW_PAGE) {
        return result(STATUS.PASS, { ...details, newPage: true });
      }
      // "fail" here means "changes exist", not a broken page.
      const status = countChanges(diff.content, diff.metadata) > 0 ? STATUS.FAIL : STATUS.PASS;
      return result(status, details);
    } catch (e) {
      window.lana?.log?.(`[preflight][diff] ${e.message}`, { tags: 'preflight', errorType: 'i' });
      return result(STATUS.LIMBO, { error: e.message });
    }
  })()];
}
