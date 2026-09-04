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
const SR_ONLY_CLASS = 'preflight-diff-sr-only';

const SR_LABEL = {
  [ADDED_MODIFIER]: 'Unpublished — new',
  [MODIFIED_MODIFIER]: 'Unpublished — changed',
};

const CONTROL_LABEL_ON = 'Unpublished changes highlighted';
const CONTROL_LABEL_OFF = 'Unpublished changes not highlighted';

const VOID_HOST_TAGS = new Set(['IMG', 'VIDEO', 'IFRAME', 'AUDIO', 'EMBED', 'OBJECT', 'CANVAS', 'INPUT']);

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

function directChildMatch(context, seg) {
  const siblings = [...context.children].filter((el) => el.tagName === seg.tag);
  return siblings[seg.index - 1] || null;
}

function descendantMatch(context, seg) {
  const found = context.querySelectorAll(seg.tag.toLowerCase());
  return found[seg.index - 1] || null;
}

function toBlockAltitude(el, root) {
  const block = el.closest('.section > div[class]');
  if (block && block !== root && root.contains(block)) return block;
  return el;
}

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

function clearOverlays(root) {
  root.querySelectorAll(`.${OVERLAY_CLASS}`).forEach((overlay) => overlay.remove());
  root.querySelectorAll(`.${SR_ONLY_CLASS}`).forEach((el) => el.remove());
  root.querySelectorAll(`.${RELATIVE_CLASS}`).forEach((el) => el.classList.remove(RELATIVE_CLASS));
  root.querySelectorAll(`.${ISOLATE_CLASS}`).forEach((el) => el.classList.remove(ISOLATE_CLASS));
  root.querySelectorAll(`.${WRAP_CLASS}`).forEach((wrapper) => {
    const original = wrapper.firstElementChild;
    if (original) wrapper.replaceWith(original);
    else wrapper.remove();
  });
}

export function clearHighlights(root) {
  clearOverlays(root);
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
}

function ensureOverlayHost(el) {
  const inPicture = el.tagName === 'IMG' && el.parentElement?.tagName === 'PICTURE';
  const target = inPicture ? el.parentElement : el;
  if (target.tagName === 'PICTURE' || VOID_HOST_TAGS.has(target.tagName)) {
    const wrapper = createTag('span', { class: `${WRAP_CLASS} ${ISOLATE_CLASS}` });
    target.replaceWith(wrapper);
    wrapper.append(target);
    return wrapper;
  }
  if (window.getComputedStyle(el).position === 'static') {
    el.classList.add(RELATIVE_CLASS);
  }
  el.classList.add(ISOLATE_CLASS);
  return el;
}

let highlightsDismissed = false;
export const areHighlightsDismissed = () => highlightsDismissed;
export const setHighlightsDismissed = (value) => { highlightsDismissed = value; };

function showHighlightControl(root, applyOverlays) {
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
  const label = createTag('span', { class: 'preflight-diff-control-label', 'aria-live': 'polite' }, CONTROL_LABEL_ON);
  const toggle = createTag('button', { class: 'preflight-diff-control-hide' }, 'Hide');
  const control = createTag(
    'div',
    { class: CONTROL_CLASS, role: 'region', 'aria-label': 'Unpublished content highlights' },
    [label, toggle],
  );
  toggle.addEventListener('click', () => {
    if (areHighlightsDismissed()) {
      applyOverlays();
      setHighlightsDismissed(false);
      toggle.textContent = 'Hide';
      label.textContent = CONTROL_LABEL_ON;
    } else {
      clearOverlays(root);
      setHighlightsDismissed(true);
      toggle.textContent = 'Show';
      label.textContent = CONTROL_LABEL_OFF;
    }
  });
  document.body.append(control);
}

export function highlightOnPage(diff, root) {
  clearHighlights(root);

  const applyOverlays = () => {
    clearOverlays(root);
    let applied = 0;
    const apply = (change, modifierClass) => {
      let el = null;
      try {
        el = resolveOnPage(change.path, change.scope || root, change.kind, change.previewText || change.liveText || '');
      } catch {
        el = null;
      }
      if (!el) {
        logUnmapped(change);
        return;
      }
      const host = ensureOverlayHost(el);
      const kindClass = change.kind === 'block' ? ' is-block' : '';
      const overlay = createTag('span', { class: `${OVERLAY_CLASS} ${modifierClass}${kindClass}`, 'aria-hidden': 'true' });
      const srLabel = createTag('span', { class: `sr-only ${SR_ONLY_CLASS}` }, SR_LABEL[modifierClass]);
      host.append(overlay, srLabel);
      applied += 1;
    };
    (diff?.added || []).forEach((change) => apply(change, ADDED_MODIFIER));
    (diff?.modified || []).forEach((change) => apply(change, MODIFIED_MODIFIER));
    return applied;
  };

  if (applyOverlays() > 0) showHighlightControl(root, applyOverlays);

  return function cleanup() {
    clearHighlights(root);
  };
}

export function autoHighlightOnPage(diff, root) {
  if (highlightsDismissed || !root) return undefined;
  return highlightOnPage(diff, root);
}
