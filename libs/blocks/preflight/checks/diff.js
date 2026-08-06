import { SEVERITY, STATUS } from './constants.js';
import fetchVersions from './diff/fetchVersions.js';
import diffContent from './diff/diffContent.js';
import diffMetadata from './diff/diffMetadata.js';
import { checkUnpublishedFragments } from './merch.js';

function parseMain(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.querySelector('main') || doc.body;
}

function countChanges(content, metadata, unpublished) {
  return content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length
    + unpublished.length;
}

export function runChecks({ area = document, url = new URL(window.location.href) } = {}) {
  return [(async () => {
    try {
      const versions = await fetchVersions(url instanceof URL ? url : new URL(url, window.location.href));
      if (versions.skipped || !versions.preview) {
        return {
          name: 'Content Diff',
          status: STATUS.PASS,
          severity: SEVERITY.WARNING,
          details: { skipped: true },
        };
      }
      const previewRoot = parseMain(versions.preview.html);
      const liveRoot = versions.live ? parseMain(versions.live.html) : document.createElement('main');
      const content = diffContent(previewRoot, liveRoot);
      const metadata = diffMetadata(previewRoot, liveRoot);
      const { unpublished } = await checkUnpublishedFragments({ area })
        .catch(() => ({ unpublished: [] }));
      const total = countChanges(content, metadata, unpublished);
      return {
        name: 'Content Diff',
        // WARNING severity "fail" here means "changes exist", not a broken page.
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

// Mirrors structure.js: a lone named export trips import/prefer-default-export,
// so bundle it (plus the internal helpers) into a default export too.
export default { parseMain, countChanges, runChecks };
