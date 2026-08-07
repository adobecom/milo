import { createTag } from '../../../utils/utils.js';

const OVERLAY_CLASS = 'preflight-diff-overlay';
const ADDED_MODIFIER = 'is-added';
const MODIFIED_MODIFIER = 'is-modified';
const WRAP_CLASS = 'preflight-diff-highlight-wrap';
const RELATIVE_CLASS = 'preflight-diff-highlight-relative';
const ISOLATE_CLASS = 'preflight-diff-highlight-isolate';
const JUMP_CLASS = 'preflight-diff-jump-highlight';
const CONTROL_CLASS = 'preflight-diff-highlight-control';

// Void/replaced elements never render appended children, so the overlay can't live inside them
// directly — those get wrapped instead (see ensureOverlayHost).
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

// Fallback for decoration-inserted wrapper levels (e.g. <img> wrapped in <picture>) not in the
// plain.html tree — any-depth search, lower confidence since the index no longer lines up exactly.
function descendantMatch(context, seg) {
  const found = context.querySelectorAll(seg.tag.toLowerCase());
  return found[seg.index - 1] || null;
}

// Blocks rebuild their own internal DOM, so a leaf resolved deep inside one isn't reliably
// the same leaf the path meant — climb to the containing block instead (block-kind only).
function toBlockAltitude(el, root) {
  const block = el.closest('.section > div[class]');
  if (block && block !== root && root.contains(block)) return block;
  return el;
}

// Best-effort walk of a pre-decoration xpath against the real, decorated page; never throws.
// kind 'block' climbs to the containing block; anything else returns the resolved element as-is.
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

// Reverses everything this module added under `root`. Order matters: overlays are removed first
// so a wrapper's only remaining child is the original wrapped element.
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

// Returns an element the overlay can attach to: `el` itself, or for void/replaced elements a
// freshly-inserted wrapper. ISOLATE_CLASS gives the host its own stacking context so the overlay's
// z-index only competes with layers inside it, and can't escape to outrank the modal.
function ensureOverlayHost(el) {
  if (VOID_HOST_TAGS.has(el.tagName)) {
    const wrapper = createTag('span', { class: `${WRAP_CLASS} ${ISOLATE_CLASS}` });
    el.replaceWith(wrapper);
    wrapper.append(el);
    return wrapper;
  }
  // Only force a positioning context when one doesn't already exist, to avoid fighting an
  // explicit position the page's own CSS set.
  if (window.getComputedStyle(el).position === 'static') {
    el.classList.add(RELATIVE_CLASS);
  }
  el.classList.add(ISOLATE_CLASS);
  return el;
}

// Page-injected control (like showReturnPopover) so highlights can be dismissed without
// reopening preflight; hide flips the panel's toggle via onDismiss.
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

// Mirrors panels/assets.js's goToAsset affordance
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
