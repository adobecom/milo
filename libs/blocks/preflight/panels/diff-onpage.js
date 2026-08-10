import { createTag } from '../../../utils/utils.js';
import { normalizeText } from '../checks/diff/nodePath.js';
import { textSimilarity } from '../checks/diff/diffContent.js';

const OVERLAY_CLASS = 'preflight-diff-overlay';
const ADDED_MODIFIER = 'is-added';
const MODIFIED_MODIFIER = 'is-modified';
const WRAP_CLASS = 'preflight-diff-highlight-wrap';
const RELATIVE_CLASS = 'preflight-diff-highlight-relative';
const ISOLATE_CLASS = 'preflight-diff-highlight-isolate';
const CONTROL_CLASS = 'preflight-diff-highlight-control';
// Marker for cleanup/tests only — visually-hidden styling comes from Milo's global .sr-only.
const SR_ONLY_CLASS = 'preflight-diff-sr-only';

// The overlay badge is an aria-hidden ::before; screen readers get this real text node.
const SR_LABEL = {
  [ADDED_MODIFIER]: 'Unpublished — new',
  [MODIFIED_MODIFIER]: 'Unpublished — changed',
};

// Void/replaced elements can't host appended children, so these get wrapped (ensureOverlayHost).
const VOID_HOST_TAGS = new Set(['IMG', 'VIDEO', 'IFRAME', 'AUDIO', 'EMBED', 'OBJECT', 'CANVAS', 'INPUT']);

// Matches getXPath's segment shape "tag[index]", e.g. "/div[1]/p[3]" -> [{tag, index}, ...].
function parsePath(path) {
  if (!path) return [];
  return path.split('/')
    .filter(Boolean)
    .map((segment) => {
      const match = segment.match(/^([a-z0-9-]+)\[(\d+)\]$/i);
      if (!match) return null;
      return { tag: match[1].toUpperCase(), index: parseInt(match[2], 10) };
    })
    .filter(Boolean);
}

// Same-tag count among direct children only — the exact rule getXPath used; high-confidence match.
function directChildMatch(context, seg) {
  const siblings = [...context.children].filter((el) => el.tagName === seg.tag);
  return siblings[seg.index - 1] || null;
}

// Fallback for decoration wrappers (e.g. <img> in <picture>) — any-depth, lower confidence.
function descendantMatch(context, seg) {
  const found = context.querySelectorAll(seg.tag.toLowerCase());
  return found[seg.index - 1] || null;
}

// Blocks rebuild their DOM — a leaf resolved deep inside may be wrong, so climb to the block.
function toBlockAltitude(el, root) {
  const block = el.closest('.section > div[class]');
  if (block && block !== root && root.contains(block)) return block;
  return el;
}

// Best-effort walk of a pre-decoration xpath against the decorated page; never throws.
export function resolveOnPage(path, root, kind, expectedText) {
  if (!root) return null;
  const segments = parsePath(path);
  if (!segments.length) return null;

  let context = root;
  let matchedLevels = 0;
  let usedFallback = false;

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    const direct = directChildMatch(context, seg);
    const match = direct || descendantMatch(context, seg);
    if (!match) break;
    if (!direct) usedFallback = true;
    context = match;
    matchedLevels += 1;
  }

  if (matchedLevels === 0) return null;

  // A fuzzy fallback can land on the wrong element — verify its text before trusting it.
  if (usedFallback && expectedText && normalizeText(context.textContent)) {
    if (textSimilarity(normalizeText(context.textContent), expectedText) < 0.3) return null;
  }

  return kind === 'block' ? toBlockAltitude(context, root) : context;
}

function logUnmapped(change) {
  window.lana?.log?.(
    `[preflight][diff-onpage] could not map change to page: type=${change?.type} tag=${change?.tag} path=${change?.path}`,
    { tags: 'preflight', errorType: 'i' },
  );
}

// Order matters: remove overlays before unwrapping, so a wrapper's last child is the original.
export function clearHighlights(root) {
  root.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((overlay) => overlay.remove());
  root.querySelectorAll(`.${SR_ONLY_CLASS}`).forEach((el) => el.remove());
  root.querySelectorAll(`.${RELATIVE_CLASS}`).forEach((el) => el.classList.remove(RELATIVE_CLASS));
  root.querySelectorAll(`.${ISOLATE_CLASS}`).forEach((el) => el.classList.remove(ISOLATE_CLASS));
  root.querySelectorAll(`.${WRAP_CLASS}`).forEach((wrapper) => {
    const original = wrapper.firstElementChild;
    if (original) wrapper.replaceWith(original);
    else wrapper.remove();
  });
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
}

// ISOLATE_CLASS scopes the overlay's stacking context so its z-index can't outrank the modal.
function ensureOverlayHost(el) {
  if (VOID_HOST_TAGS.has(el.tagName)) {
    const wrapper = createTag('span', { class: `${WRAP_CLASS} ${ISOLATE_CLASS}` });
    el.replaceWith(wrapper);
    wrapper.append(el);
    return wrapper;
  }
  // Only add a positioning context if none exists, so we don't fight the page's own position.
  if (window.getComputedStyle(el).position === 'static') {
    el.classList.add(RELATIVE_CLASS);
  }
  el.classList.add(ISOLATE_CLASS);
  return el;
}

// Page-injected control so highlights can be dismissed without reopening preflight.
function showHighlightControl(root, onDismiss) {
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
  const label = createTag('span', { class: 'preflight-diff-control-label' }, 'Unpublished changes highlighted');
  const hide = createTag('button', { class: 'preflight-diff-control-hide' }, 'Hide');
  const control = createTag(
    'div',
    { class: CONTROL_CLASS, role: 'region', 'aria-label': 'Unpublished content highlights' },
    [label, hide],
  );
  hide.addEventListener('click', () => {
    clearHighlights(root);
    onDismiss();
  });
  document.body.append(control);
}

// Session dismiss shared by the on-page control and the panel toggle, so hiding stays in sync.
let highlightsDismissed = false;
export const areHighlightsDismissed = () => highlightsDismissed;
export const setHighlightsDismissed = (value) => { highlightsDismissed = value; };

export function highlightOnPage(diff, root, onDismiss) {
  clearHighlights(root);

  let applied = 0;
  const apply = (change, modifierClass) => {
    let el = null;
    try {
      el = resolveOnPage(change.path, root, change.kind, change.previewText || change.liveText || '');
    } catch {
      el = null;
    }
    if (!el) {
      logUnmapped(change);
      return;
    }
    const host = ensureOverlayHost(el);
    // Full-bleed blocks: an edge outline sits at the viewport perimeter and reads as invisible,
    // so block overlays use an inset frame instead (see preflight.css).
    const kindClass = change.kind === 'block' ? ' is-block' : '';
    const overlay = createTag('span', { class: `${OVERLAY_CLASS} ${modifierClass}${kindClass}`, 'aria-hidden': 'true' });
    const srLabel = createTag('span', { class: `sr-only ${SR_ONLY_CLASS}` }, SR_LABEL[modifierClass]);
    host.append(overlay, srLabel);
    applied += 1;
  };

  (diff?.added || []).forEach((change) => apply(change, ADDED_MODIFIER));
  (diff?.modified || []).forEach((change) => apply(change, MODIFIED_MODIFIER));

  if (applied > 0 && typeof onDismiss === 'function') showHighlightControl(root, onDismiss);

  return function cleanup() {
    clearHighlights(root);
  };
}

// Auto-apply on preview load (FA #1). Caller preview-gates + defers; respects the dismiss flag.
export function autoHighlightOnPage(diff, root) {
  if (highlightsDismissed || !root) return undefined;
  return highlightOnPage(diff, root, () => { highlightsDismissed = true; });
}
