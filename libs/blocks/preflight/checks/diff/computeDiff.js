import diffContent from './diffContent.js';
import { parseMain, isConfirmedUnpublished } from './versionHelpers.js';

export const DIFF_STATE = {
  SKIPPED: 'skipped',
  NO_PREVIEW: 'no-preview',
  LIVE_UNAVAILABLE: 'live-unavailable',
  NEW_PAGE: 'new-page',
  READY: 'ready',
};

export default function computeDiff(versions) {
  if (versions.skipped) return { state: DIFF_STATE.SKIPPED };
  if (!versions.preview) return { state: DIFF_STATE.NO_PREVIEW };

  const previewRoot = parseMain(versions.preview.html);

  if (versions.liveStatus !== 'ok') {
    if (!isConfirmedUnpublished(versions)) return { state: DIFF_STATE.LIVE_UNAVAILABLE };
    const emptyRoot = document.createElement('main');
    return { state: DIFF_STATE.NEW_PAGE, content: diffContent(previewRoot, emptyRoot) };
  }

  const liveRoot = parseMain(versions.live.html);
  return { state: DIFF_STATE.READY, content: diffContent(previewRoot, liveRoot) };
}
