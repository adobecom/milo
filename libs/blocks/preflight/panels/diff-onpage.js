import { createTag } from '../../../utils/utils.js';

const ADDED_CLASS = 'preflight-diff-added';
const MODIFIED_CLASS = 'preflight-diff-modified';
const JUMP_CLASS = 'preflight-diff-jump-highlight';

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
// block is coarser but robust, and reads fine visually either way.
function toBlockAltitude(el, root) {
  const block = el.closest('.section > div[class]');
  if (block && block !== root && root.contains(block)) return block;
  return el;
}

/**
 * Best-effort walk of a pre-decoration xpath (from getXPath over a .plain.html <main>) against
 * the real, already-decorated page. Never throws; returns null when it can't confidently resolve
 * anything (not even the outermost segment).
 */
export function resolveOnPage(path, root) {
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
  return toBlockAltitude(context, root);
}

function logUnmapped(change) {
  window.lana?.log?.(
    `[preflight][diff-onpage] could not map change to page: type=${change?.type} tag=${change?.tag} path=${change?.path}`,
    { tags: 'preflight', errorType: 'i' },
  );
}

function clearHighlights(root) {
  root.querySelectorAll(`.${ADDED_CLASS}, .${MODIFIED_CLASS}`)
    .forEach((el) => el.classList.remove(ADDED_CLASS, MODIFIED_CLASS));
}

/**
 * Outlines added/modified changes directly on the real page. Removed content never rendered on
 * the preview page in the first place, so it's intentionally skipped here (it stays list-only).
 * Never throws — an unresolvable change is logged and skipped.
 *
 * Clears any of its own classes under `root` before applying — the preflight modal is re-created
 * (not just hidden) on every open, so a prior call's returned cleanup can be orphaned rather than
 * invoked; clearing first keeps re-runs idempotent instead of accumulating stale outlines.
 */
export function highlightOnPage(diff, root) {
  clearHighlights(root);

  const apply = (change, className) => {
    let el = null;
    try {
      el = resolveOnPage(change.path, root);
    } catch {
      el = null;
    }
    if (!el) {
      logUnmapped(change);
      return;
    }
    el.classList.add(className);
  };

  (diff?.added || []).forEach((change) => apply(change, ADDED_CLASS));
  (diff?.modified || []).forEach((change) => apply(change, MODIFIED_CLASS));

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
  const el = resolveOnPage(change?.path, root);
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
