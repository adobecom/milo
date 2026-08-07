import { SEVERITY, STATUS } from './constants.js';
import fetchVersions from './diff/fetchVersions.js';
import computeDiff, { DIFF_STATE } from './diff/computeDiff.js';

function countChanges(content, metadata) {
  return content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length;
}

export function runChecks({ url = new URL(window.location.href) } = {}) {
  return [(async () => {
    try {
      const resolvedUrl = url instanceof URL ? url : new URL(url, window.location.href);
      const versions = await fetchVersions(resolvedUrl);
      const diff = computeDiff(versions);

      if (diff.state === DIFF_STATE.SKIPPED || diff.state === DIFF_STATE.NO_PREVIEW) {
        return {
          name: 'Content Diff',
          status: STATUS.PASS,
          severity: SEVERITY.WARNING,
          details: { skipped: true },
        };
      }

      if (diff.state === DIFF_STATE.LIVE_UNAVAILABLE) {
        return {
          name: 'Content Diff',
          status: STATUS.LIMBO,
          severity: SEVERITY.WARNING,
          details: {
            error: 'Could not load the live version to compare.',
            liveUnavailable: true,
            status: versions.status,
          },
        };
      }

      // A brand-new (unpublished) page is "all new content", not a broken diff — always pass.
      if (diff.state === DIFF_STATE.NEW_PAGE) {
        return {
          name: 'Content Diff',
          status: STATUS.PASS,
          severity: SEVERITY.WARNING,
          details: {
            content: diff.content,
            metadata: diff.metadata,
            status: versions.status,
            skipped: false,
            newPage: true,
          },
        };
      }

      const total = countChanges(diff.content, diff.metadata);
      return {
        name: 'Content Diff',
        // "fail" here means "changes exist", not a broken page.
        status: total > 0 ? STATUS.FAIL : STATUS.PASS,
        severity: SEVERITY.WARNING,
        details: {
          content: diff.content,
          metadata: diff.metadata,
          status: versions.status,
          skipped: false,
        },
      };
    } catch (e) {
      window.lana?.log?.(`[preflight][diff] ${e.message}`, { tags: 'preflight', errorType: 'i' });
      return {
        name: 'Content Diff',
        status: STATUS.LIMBO,
        severity: SEVERITY.WARNING,
        details: { error: e.message },
      };
    }
  })()];
}

// Mirrors structure.js: bundle helpers into a default export too (lone named export trips lint).
export default { countChanges, runChecks };
