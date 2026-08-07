import { SEVERITY, STATUS } from './constants.js';
import fetchVersions from './diff/fetchVersions.js';
import diffContent from './diff/diffContent.js';
import diffMetadata from './diff/diffMetadata.js';
import { checkUnpublishedFragments } from './merch.js';
import { parseMain, isConfirmedUnpublished } from './diff/versionHelpers.js';

function countChanges(content, metadata, unpublished) {
  return content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length
    + unpublished.length;
}

export function runChecks({ area = document, url = new URL(window.location.href) } = {}) {
  return [(async () => {
    try {
      const resolvedUrl = url instanceof URL ? url : new URL(url, window.location.href);
      const versions = await fetchVersions(resolvedUrl);
      if (versions.skipped || !versions.preview) {
        return {
          name: 'Content Diff',
          status: STATUS.PASS,
          severity: SEVERITY.WARNING,
          details: { skipped: true },
        };
      }

      const previewRoot = parseMain(versions.preview.html);

      // Never fabricate an empty live doc when live fails to load — only a confirmed-unpublished
      // page is safe to treat as "all new".
      if (versions.liveStatus !== 'ok') {
        if (isConfirmedUnpublished(versions)) {
          const emptyRoot = document.createElement('main');
          const content = diffContent(previewRoot, emptyRoot);
          const metadata = diffMetadata(previewRoot, emptyRoot);
          const { unpublished } = await checkUnpublishedFragments({ area })
            .catch(() => ({ unpublished: [] }));
          return {
            name: 'Content Diff',
            status: STATUS.PASS,
            severity: SEVERITY.WARNING,
            details: {
              content,
              metadata,
              unpublishedFragments: unpublished,
              status: versions.status,
              skipped: false,
              newPage: true,
            },
          };
        }
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

      const liveRoot = parseMain(versions.live.html);
      const content = diffContent(previewRoot, liveRoot);
      const metadata = diffMetadata(previewRoot, liveRoot);
      const { unpublished } = await checkUnpublishedFragments({ area })
        .catch(() => ({ unpublished: [] }));
      const total = countChanges(content, metadata, unpublished);
      return {
        name: 'Content Diff',
        // "fail" here means "changes exist", not a broken page.
        status: total > 0 ? STATUS.FAIL : STATUS.PASS,
        severity: SEVERITY.WARNING,
        details: {
          content,
          metadata,
          unpublishedFragments: unpublished,
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
export default { parseMain, countChanges, runChecks };
