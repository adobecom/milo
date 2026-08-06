const ADDED_CLASS = 'preflight-diff-added';
const MODIFIED_CLASS = 'preflight-diff-modified';
const REMOVED_CLASS = 'preflight-diff-removed';
const SCROLL_OFFSET = 16;

// Attribute lookup (not tree-walking) so highlighting survives decoration reshaping the DOM.
function findByKey(pane, path) {
  return pane?.querySelector(`[data-diff-key="${CSS.escape(path)}"]`);
}

function highlight(pane, path, className) {
  const el = findByKey(pane, path);
  if (!el) return;
  el.classList.add(className);
}

export function applyHighlights(previewPane, livePane, diff) {
  (diff?.added || []).forEach((change) => highlight(previewPane, change.path, ADDED_CLASS));
  (diff?.modified || []).forEach((change) => {
    highlight(previewPane, change.path, MODIFIED_CLASS);
    highlight(livePane, change.path, MODIFIED_CLASS);
  });
  (diff?.removed || []).forEach((change) => highlight(livePane, change.path, REMOVED_CLASS));
}

function offsetWithinPane(el, pane) {
  const elRect = el.getBoundingClientRect();
  const paneRect = pane.getBoundingClientRect();
  return Math.round(elRect.top - paneRect.top + pane.scrollTop);
}

export function scrollToChange(pane, change) {
  const el = findByKey(pane, change.path);
  if (!el) return;
  pane.scrollTo({ top: offsetWithinPane(el, pane) - SCROLL_OFFSET, behavior: 'smooth' });
}
