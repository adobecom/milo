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

// Turns already-fetched versions into { state, content, metadata }. Callers fetch versions
// themselves — the check eagerly for the aggregate run, the panel lazily on tab-select — so this
// stays free of network work and both layers share one skip/new-page/compare implementation.
export default function computeDiff(versions) {
  if (versions.skipped) return { state: DIFF_STATE.SKIPPED };
  if (!versions.preview) return { state: DIFF_STATE.NO_PREVIEW };

  const previewRoot = parseMain(versions.preview.html);

  if (versions.liveStatus !== 'ok') {
    // Never fabricate an empty live doc when live fails to load — only a confirmed-unpublished
    // page is safe to treat as "all new".
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
