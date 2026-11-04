import { createTag } from '../../../utils/utils.js';
import { normalizeText } from '../checks/diff/nodePath.js';
import { SIMILARITY_THRESHOLD, textSimilarity, diffWords } from '../checks/diff/diffContent.js';

const OVERLAY_CLASS = 'preflight-diff-overlay';
const ADDED_MODIFIER = 'is-added';
const MODIFIED_MODIFIER = 'is-modified';
const WRAP_CLASS = 'preflight-diff-highlight-wrap';
const RELATIVE_CLASS = 'preflight-diff-highlight-relative';
const ISOLATE_CLASS = 'preflight-diff-highlight-isolate';
const CONTROL_CLASS = 'preflight-diff-highlight-control';
const SR_ONLY_CLASS = 'preflight-diff-sr-only';
const INS_CLASS = 'preflight-diff-ins';
const DEL_CLASS = 'preflight-diff-del';

const SR_LABEL = {
  [ADDED_MODIFIER]: 'Unpublished — new',
  [MODIFIED_MODIFIER]: 'Unpublished — changed',
};

const CONTROL_LABEL_ON = 'Unpublished changes highlighted';
const CONTROL_LABEL_OFF = 'Unpublished changes not highlighted';

const VOID_HOST_TAGS = new Set(['IMG', 'VIDEO', 'IFRAME', 'AUDIO', 'EMBED', 'OBJECT', 'CANVAS', 'INPUT']);
const INLINE_TAGS = new Set(['A', 'ABBR', 'B', 'CODE', 'EM', 'I', 'MARK', 'S', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'U']);

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

function resolveBlock(root, blockName, expectedText) {
  if (!blockName || !expectedText) return null;
  let best = null;
  let bestScore = SIMILARITY_THRESHOLD;
  root.querySelectorAll(`.${CSS.escape(blockName)}`).forEach((block) => {
    const score = textSimilarity(normalizeText(block.textContent), expectedText);
    if (score >= bestScore) { best = block; bestScore = score; }
  });
  return best;
}

export function resolveOnPage(path, root, kind, expectedText, blockName) {
  if (!root) return null;
  if (kind === 'block') return resolveBlock(root, blockName, expectedText);
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
    if (textSimilarity(normalizeText(context.textContent), expectedText) < SIMILARITY_THRESHOLD) {
      return null;
    }
  }
  return context;
}

function logUnmapped(change) {
  window.lana?.log?.(
    `[preflight][diff-onpage] could not map change to page: type=${change?.type} tag=${change?.tag} path=${change?.path}`,
    { tags: 'preflight', errorType: 'i' },
  );
}

const wordMarkUndos = new Set();

function undoWordMarks(matches) {
  [...wordMarkUndos].filter(matches).forEach((undo) => {
    undo.originalText.forEach((data, node) => { node.data = data; });
    undo.originalChildren.forEach((children, parent) => parent.replaceChildren(...children));
    wordMarkUndos.delete(undo);
  });
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
  undoWordMarks((undo) => root.contains(undo.el) || !undo.el.isConnected);
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

function wordSpots(el) {
  const spots = [];
  let current = null;
  const blockOf = (node) => {
    let block = node.parentElement;
    while (block !== el && INLINE_TAGS.has(block.tagName)) block = block.parentElement;
    return block;
  };
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      [...node.data.matchAll(/\S+|\s+/g)].forEach(({ 0: text, index }) => {
        if (!text.trim()) {
          current = null;
          return;
        }
        if (!current) {
          current = { text: '', pieces: [], block: blockOf(node) };
          spots.push(current);
        }
        current.text += text;
        current.pieces.push({ node, start: index, end: index + text.length });
      });
      return;
    }
    const inline = INLINE_TAGS.has(node.tagName);
    if (!inline) current = null;
    node.childNodes.forEach(walk);
    if (!inline) current = null;
  };
  el.childNodes.forEach(walk);
  return spots;
}

const textOf = (spots) => spots.map(({ text }) => text).join(' ');
const firstPiece = ({ pieces }) => pieces[0];
const lastPiece = ({ pieces }) => pieces[pieces.length - 1];

function markWords(el, liveEl, previewEl) {
  const spots = wordSpots(el);
  const previewWords = textOf(wordSpots(previewEl));
  if (!previewWords || previewWords !== textOf(spots)) return;
  const liveSpots = wordSpots(liveEl);
  const wordDiff = diffWords(textOf(liveSpots), previewWords);
  if (!wordDiff) return;

  const edits = [];
  let removed = [];
  let removedBeforeNext;
  let removedBlock;
  let ins = null;
  let spot = 0;
  let live = 0;
  const pushRemoved = (beforeNext) => {
    if (!removed.length) return;
    const removedText = removed.join(' ');
    removed = [];
    if (beforeNext ? spot < spots.length : spot === 0) {
      const { node, start } = firstPiece(spots[spot]);
      const textWithSpaceAfter = `${removedText} `;
      edits.push({ node, start, end: start, del: textWithSpaceAfter });
    } else {
      const { node, end } = lastPiece(spots[spot - 1]);
      const textWithSpaceBefore = ` ${removedText}`;
      edits.push({ node, start: end, end, del: textWithSpaceBefore });
    }
  };
  wordDiff.forEach(({ type, text }) => {
    if (type === 'removed') {
      const word = liveSpots[live];
      if (removed.length && word.block !== removedBlock) pushRemoved(removedBeforeNext);
      if (!removed.length) {
        removedBlock = word.block;
        removedBeforeNext = !live || lastPiece(liveSpots[live - 1]).node !== firstPiece(word).node;
      }
      removed.push(text);
      live += 1;
      return;
    }
    pushRemoved(removedBeforeNext);
    if (type === 'same') {
      ins = null;
      live += 1;
    } else {
      spots[spot].pieces.forEach(({ node, start, end }) => {
        if (ins?.node === node) {
          ins.end = end;
        } else {
          ins = { node, start, end };
          edits.push(ins);
        }
      });
    }
    spot += 1;
  });
  pushRemoved(removedBeforeNext);

  const undo = { el, originalText: new Map(), originalChildren: new Map() };
  edits.forEach(({ node }) => {
    undo.originalText.set(node, node.data);
    undo.originalChildren.set(node.parentNode, [...node.parentNode.childNodes]);
  });
  wordMarkUndos.add(undo);
  edits.reverse().forEach(({ node, start, end, del }) => {
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    if (del) range.insertNode(createTag('del', { class: DEL_CLASS }, [del]));
    else range.surroundContents(createTag('ins', { class: INS_CLASS }));
  });
}

const DISMISS_KEY = 'preflight-diff-hidden';
const readDismissed = () => { try { return localStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; } };

let highlightsDismissed = readDismissed();
export const areHighlightsDismissed = () => highlightsDismissed;
export const setHighlightsDismissed = (value) => {
  highlightsDismissed = value;
  try { localStorage.setItem(DISMISS_KEY, value ? '1' : '0'); } catch { /* storage may be blocked */ }
};

function showHighlightControl(root, applyOverlays, forceHighlights) {
  document.querySelector(`.${CONTROL_CLASS}`)?.remove();
  let dismissed = !forceHighlights && areHighlightsDismissed();
  const labelText = dismissed ? CONTROL_LABEL_OFF : CONTROL_LABEL_ON;
  const toggleText = dismissed ? 'Show' : 'Hide';
  const label = createTag('span', { class: 'preflight-diff-control-label', 'aria-live': 'polite' }, labelText);
  const toggle = createTag('button', { class: 'preflight-diff-control-hide' }, toggleText);
  const control = createTag(
    'div',
    { class: CONTROL_CLASS, role: 'region', 'aria-label': 'Unpublished content highlights' },
    [label, toggle],
  );
  toggle.addEventListener('click', () => {
    if (dismissed) {
      applyOverlays();
      toggle.textContent = 'Hide';
      label.textContent = CONTROL_LABEL_ON;
    } else {
      clearOverlays(root);
      toggle.textContent = 'Show';
      label.textContent = CONTROL_LABEL_OFF;
    }
    dismissed = !dismissed;
    if (!forceHighlights) setHighlightsDismissed(dismissed);
  });
  document.body.append(control);
}

export function highlightOnPage(diff, root, forceHighlights) {
  clearHighlights(root);

  const applyOverlays = () => {
    clearOverlays(root);
    const apply = (change, modifierClass) => {
      let el = null;
      try {
        el = resolveOnPage(
          change.path,
          change.scope || root,
          change.kind,
          change.previewText || change.liveText || '',
          change.blockName,
        );
      } catch {
        el = null;
      }
      if (!el) {
        logUnmapped(change);
        return;
      }
      if (change.liveEl) {
        try {
          markWords(el, change.liveEl, change.previewEl);
        } catch (e) {
          undoWordMarks((undo) => undo.el === el);
          window.lana?.log?.(`[preflight][diff-onpage] word marks failed: ${e.message}`, { tags: 'preflight', errorType: 'i' });
        }
      }
      const host = ensureOverlayHost(el);
      const kindClass = change.kind === 'block' ? ' is-block' : '';
      const overlay = createTag('span', { class: `${OVERLAY_CLASS} ${modifierClass}${kindClass}`, 'aria-hidden': 'true' });
      const srLabel = createTag('span', { class: `sr-only ${SR_ONLY_CLASS}` }, SR_LABEL[modifierClass]);
      host.append(overlay, srLabel);
    };
    (diff?.added || []).forEach((change) => apply(change, ADDED_MODIFIER));
    (diff?.modified || []).forEach((change) => apply(change, MODIFIED_MODIFIER));
  };

  if (diff?.added?.length || diff?.modified?.length) {
    if (forceHighlights || !areHighlightsDismissed()) applyOverlays();
    showHighlightControl(root, applyOverlays, forceHighlights);
  }

  return function cleanup() {
    clearHighlights(root);
  };
}
