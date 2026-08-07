import { createTag } from '../../../utils/utils.js';

const OVERLAY_CLASS = 'preflight-diff-overlay';
const ADDED_MODIFIER = 'is-added';
const MODIFIED_MODIFIER = 'is-modified';
const WRAP_CLASS = 'preflight-diff-highlight-wrap';
const RELATIVE_CLASS = 'preflight-diff-highlight-relative';
const ISOLATE_CLASS = 'preflight-diff-highlight-isolate';
const JUMP_CLASS = 'preflight-diff-jump-highlight';
const CONTROL_CLASS = 'preflight-diff-highlight-control';

// Replaced/void elements don't render appended children (a browser never paints a child of an
// <img>), so the overlay can't live inside them directly — those get wrapped instead (see
// ensureOverlayHost). Every other diffable tag (p, headings, li, a, button, blockquote, and a
// block's own container div) can safely host the overlay as a plain child.
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

// Same-tag occurrence count among direct children only — the exact rule getXPath used to
// compute the index in the first place. This is the high-confidence match.
function directChildMatch(context, seg) {
  const siblings = [...context.children].filter((el) => el.tagName === seg.tag);
  return siblings[seg.index - 1] || null;
}

// Decoration can insert a wrapper level that isn't in the plain.html tree (an <img> wrapped in
// a <picture>, a block given an extra layout div, ...). Widening the search to any-depth
// descendants tolerates that, at the cost of the index no longer being guaranteed to mean the
// same thing it did in the original per-level count — a best-effort, lower-confidence fallback.
function descendantMatch(context, seg) {
  const found = context.querySelectorAll(seg.tag.toLowerCase());
  return found[seg.index - 1] || null;
}

// Blocks freely rebuild their own internal DOM (rows/cells) in their init(); a leaf resolved a
// few levels deep inside one isn't reliably the same leaf the path meant. Outlining the whole
// block is coarser but robust, and reads fine visually either way. Only used for block-kind
// changes — default content is never wrapped this way (see resolveOnPage).
function toBlockAltitude(el, root) {
  const block = el.closest('.section > div[class]');
  if (block && block !== root && root.contains(block)) return block;
  return el;
}

/**
 * Best-effort walk of a pre-decoration xpath (from getXPath over a .plain.html <main>) against
 * the real, already-decorated page. Never throws; returns null when it can't confidently resolve
 * anything (not even the outermost segment).
 *
 * `kind` controls the altitude of the returned element: a 'block' change climbs to the
 * containing block (see toBlockAltitude — Milo blocks rebuild their internal DOM, so the outer
 * block is the only reliably-stable target). Anything else (a 'leaf' / default-content change,
 * or no kind at all) returns the resolved element itself — climbing further would land on
 * decoration's default-content-wrapper div and outline the entire section for a single
 * paragraph or image edit, which is too coarse.
 */
export function resolveOnPage(path, root, kind) {
  if (!root) return null;
  const segments = parsePath(path);
  if (!segments.length) return null;

  let context = root;
  let matchedLevels = 0;

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];
    const match = directChildMatch(context, seg) || descendantMatch(context, seg);
    if (!match) break;
    context = match;
    matchedLevels += 1;
  }

  if (matchedLevels === 0) return null;
  return kind === 'block' ? toBlockAltitude(context, root) : context;
}

function logUnmapped(change) {
  window.lana?.log?.(
    `[preflight][diff-onpage] could not map change to page: type=${change?.type} tag=${change?.tag} path=${change?.path}`,
    { tags: 'preflight', errorType: 'i' },
  );
}

// Removes every overlay this module ever added under `root`, and reverses any wrapping/
// positioning it applied to host them — leaves the page exactly as it was found. Order matters:
// overlays are removed first so a wrapper's only remaining child is the original wrapped element.
export function clearHighlights(root) {
  root.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((overlay) => overlay.remove());
  root.querySelectorAll(`.${RELATIVE_CLASS}`).forEach((el) => el.classList.remove(RELATIVE_CLASS));
  root.querySelectorAll(`.${ISOLATE_CLASS}`).forEach((el) => el.classList.remove(ISOLATE_CLASS));
  root.querySelectorAll(`.${WRAP_CLASS}`).forEach((wrapper) => {
    const original = wrapper.firstElementChild;
    if (original) wrapper.replaceWith(original);
    else wrapper.remove();
  });
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
}

/**
 * Returns an element the overlay can be safely appended to for `el`: `el` itself for anything
 * that renders its children (a block's own container div, p/heading/li/a/button/blockquote), or
 * a freshly-inserted positioned wrapper for replaced/void elements (img, video, ...) that never
 * render appended children at all.
 *
 * A block's own layered content (e.g. a marquee's background image/video/overlay) can establish
 * its own z-index stacking, which used to bury the overlay's outline+::before underneath it. That
 * was previously "fixed" with a max-int z-index on the overlay — but the overlay lives on the real
 * page, not inside the preflight modal, so a max-int value also jumps above the modal itself
 * (--modal-z-index in modal.css), which is wrong.
 *
 * The correct fix scopes the problem instead of out-escalating it: giving the host its own
 * stacking context (`isolation: isolate`, see ISOLATE_CLASS in preflight.css) means the overlay's
 * z-index is only ever compared against layers *inside* that host — it can win with a modest
 * value, and it can never escape the host's context to compete with (or exceed) the modal, which
 * lives in a separate, higher-stacked context on `body`.
 */
function ensureOverlayHost(el) {
  if (VOID_HOST_TAGS.has(el.tagName)) {
    const wrapper = createTag('span', { class: `${WRAP_CLASS} ${ISOLATE_CLASS}` });
    el.replaceWith(wrapper);
    wrapper.append(el);
    return wrapper;
  }
  // Only force a positioning context when one doesn't already exist — position:relative with no
  // offsets doesn't move `el`, so this is a no-op visually, but skipping it when `el` (or a block
  // root) is already positioned avoids fighting an explicit position the page's own CSS set.
  if (window.getComputedStyle(el).position === 'static') {
    el.classList.add(RELATIVE_CLASS);
  }
  el.classList.add(ISOLATE_CLASS);
  return el;
}

/**
 * Outlines added/modified changes directly on the real page. Removed content never rendered on
 * the preview page in the first place, so it's intentionally skipped here (it stays list-only).
 * Never throws — an unresolvable change is logged and skipped.
 *
 * Renders each highlight as a dedicated overlay element (see ensureOverlayHost) rather than
 * outlining the target in place — an in-flow outline/::before ribbon on the element itself can
 * end up underneath a block's own higher-stacked layered content (media, gradients, overlays);
 * an appended overlay child sits above it instead, thanks to the host's own isolated stacking
 * context (see ISOLATE_CLASS / ensureOverlayHost) — no need for an extreme z-index.
 *
 * Clears everything this module previously added under `root` before applying — the preflight
 * modal is re-created (not just hidden) on every open, so a prior call's returned cleanup can be
 * orphaned rather than invoked; clearing first keeps re-runs idempotent instead of accumulating
 * stale overlays or wrappers.
 */
// Page-injected control (like showReturnPopover) so highlights can be dismissed without
// reopening preflight. Hide clears immediately (works with the modal closed) and flips the
// panel's toggle via onDismiss so a reopened panel reflects the off state.
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

export function highlightOnPage(diff, root, onDismiss) {
  clearHighlights(root);

  let applied = 0;
  const apply = (change, modifierClass) => {
    let el = null;
    try {
      el = resolveOnPage(change.path, root, change.kind);
    } catch {
      el = null;
    }
    if (!el) {
      logUnmapped(change);
      return;
    }
    const host = ensureOverlayHost(el);
    const overlay = createTag('span', { class: `${OVERLAY_CLASS} ${modifierClass}`, 'aria-hidden': 'true' });
    host.append(overlay);
    applied += 1;
  };

  (diff?.added || []).forEach((change) => apply(change, ADDED_MODIFIER));
  (diff?.modified || []).forEach((change) => apply(change, MODIFIED_MODIFIER));

  if (applied > 0 && typeof onDismiss === 'function') showHighlightControl(root, onDismiss);

  return function cleanup() {
    clearHighlights(root);
  };
}

function clearJumpHighlight() {
  document.querySelectorAll(`.${JUMP_CLASS}`).forEach((el) => el.classList.remove(JUMP_CLASS));
}

// Fixed popover at the top-left of the screen — mirrors panels/assets.js's goToAsset affordance
// so jumping to a content-diff change on the page feels the same as jumping to an asset.
function showReturnPopover() {
  document.querySelector('.preflight-return-popover')?.remove();

  const label = createTag('span', { class: 'preflight-return-label' }, 'Reviewing change on page');
  const reopen = createTag('button', { class: 'preflight-return-reopen' }, 'Back to Preflight');
  const dismiss = createTag('button', { class: 'preflight-return-dismiss' }, 'Dismiss');
  const popover = createTag('div', { class: 'preflight-return-popover', role: 'dialog', 'aria-label': 'Content change review' }, [label, reopen, dismiss]);

  const cleanup = () => { popover.remove(); clearJumpHighlight(); };
  dismiss.addEventListener('click', cleanup);
  reopen.addEventListener('click', () => {
    cleanup();
    document.querySelector('aem-sidekick, helix-sidekick')
      ?.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
  });

  document.body.append(popover);
}

/**
 * Closes the preflight modal and jumps to a change's element on the real page. Returns false
 * (and logs) without touching the DOM when the change can't be resolved on the page — e.g. a
 * removed change, or a change the tolerant resolver couldn't map.
 */
export function jumpToChangeOnPage(change, root = document.querySelector('main')) {
  const el = resolveOnPage(change?.path, root, change?.kind);
  if (!el) {
    logUnmapped(change);
    return false;
  }

  document.getElementById('preflight')?.dispatchEvent(new CustomEvent('closeModal'));
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clearJumpHighlight();
    el.classList.add(JUMP_CLASS);
    showReturnPopover();
  });
  return true;
}
