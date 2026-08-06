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

      // The live .plain.html didn't load — never fabricate an empty live doc to diff against,
      // that's what made every preview node read as "added" (e.g. a 404'd live page showing
      // 45 false "NEW" changes). Distinguish a genuinely new/unpublished page (safe to treat
      // preview content as new) from an unreadable live version of a page that IS published,
      // or one whose publish state we couldn't even determine (also unsafe to guess).
      if (versions.liveStatus !== 'ok') {
        const isConfirmedUnpublished = versions.status != null
          && !versions.status.live?.lastModified;
        if (isConfirmedUnpublished) {
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
