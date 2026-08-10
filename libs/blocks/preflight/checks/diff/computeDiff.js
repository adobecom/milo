import diffContent from './diffContent.js';
import diffMetadata from './diffMetadata.js';
import { parseMain, isConfirmedUnpublished } from './versionHelpers.js';

export const DIFF_STATE = {
  SKIPPED: 'skipped',
  NO_PREVIEW: 'no-preview',
  LIVE_UNAVAILABLE: 'live-unavailable',
  NEW_PAGE: 'new-page',
  READY: 'ready',
};

// Fetch-free (callers pass in the versions) so the check and the panel share one diff path.
export default function computeDiff(versions) {
  if (versions.skipped) return { state: DIFF_STATE.SKIPPED };
  if (!versions.preview) return { state: DIFF_STATE.NO_PREVIEW };

  const previewRoot = parseMain(versions.preview.html);

  if (versions.liveStatus !== 'ok') {
    // Only a confirmed-unpublished page is safe as "all new" — never fake an empty live doc.
    if (!isConfirmedUnpublished(versions)) return { state: DIFF_STATE.LIVE_UNAVAILABLE };
    const emptyRoot = document.createElement('main');
    return {
      state: DIFF_STATE.NEW_PAGE,
      content: diffContent(previewRoot, emptyRoot),
      metadata: diffMetadata(previewRoot, emptyRoot),
    };
  }

  const liveRoot = parseMain(versions.live.html);
  return {
    state: DIFF_STATE.READY,
    content: diffContent(previewRoot, liveRoot),
    metadata: diffMetadata(previewRoot, liveRoot),
  };
}
