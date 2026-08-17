import { normalizeText, getXPath } from './nodePath.js';

export const CONTENT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, a, img, button, blockquote';

const SIMILARITY_THRESHOLD = 0.3;

function ownText(el) {
  if (el.tagName === 'IMG') return normalizeText(el.getAttribute('alt') || '');
  return normalizeText(el.textContent);
}

function identity(el) {
  if (el.tagName === 'IMG') return `img|${el.getAttribute('src') || ''}`;
  if (el.tagName === 'A') return `a|${el.getAttribute('href') || ''}|${ownText(el)}`;
  return `${el.tagName.toLowerCase()}|${ownText(el)}`;
}

function tokenize(text) {
  return normalizeText(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export function textSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach((token) => { if (setB.has(token)) intersection += 1; });
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function isSimilarEnough(unitA, unitB) {
  return textSimilarity(unitA.text, unitB.text) >= SIMILARITY_THRESHOLD;
}

function firstClass(el) {
  return (el.getAttribute('class') || '').trim().split(/\s+/)[0] || '';
}

function collectBlock(el, root) {
  const blockName = firstClass(el);
  const text = normalizeText(el.textContent);
  return {
    kind: 'block',
    el,
    blockName,
    path: getXPath(el, root),
    tag: 'DIV',
    text,
    sig: `block|${blockName}|${text}`,
  };
}

function collectLeaf(el, root) {
  return {
    kind: 'leaf',
    el,
    path: getXPath(el, root),
    tag: el.tagName,
    text: ownText(el),
    sig: identity(el),
  };
}

function isEmptyWrapper(el) {
  return el.tagName !== 'IMG' && ownText(el) === '';
}

function collectFromSection(section, root, units) {
  [...section.children].forEach((child) => {
    if (child.tagName === 'DIV' && firstClass(child)) {
      units.push(collectBlock(child, root));
      return;
    }
    const candidates = child.matches(CONTENT_SELECTOR)
      ? [child, ...child.querySelectorAll(CONTENT_SELECTOR)]
      : [...child.querySelectorAll(CONTENT_SELECTOR)];
    candidates.forEach((leaf) => {
      if (isEmptyWrapper(leaf)) return;
      units.push(collectLeaf(leaf, root));
    });
  });
}

function collect(rootEl) {
  const units = [];
  [...rootEl.children]
    .filter((el) => el.tagName === 'DIV')
    .forEach((section) => collectFromSection(section, rootEl, units));
  return units;
}

function lcsPairs(live, preview) {
  const n = live.length;
  const m = preview.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = live[i].sig === preview[j].sig
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (live[i].sig === preview[j].sig) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
}

function isModifiedPair(removedUnit, addedUnit) {
  if (removedUnit.tag !== addedUnit.tag) return false;
  if (removedUnit.kind === 'block') {
    // Blocks are coarse and identified by name; their sibling-index path is fragile — any
    // add/remove/reorder above shifts it. Match on name + content similarity so a genuinely
    // edited block that moved is still "changed", not new+removed. Leaves keep exact-path
    // anchoring below: they are high-cardinality/low-distinctiveness, where path is the only
    // reliable discriminator.
    return removedUnit.blockName !== ''
      && removedUnit.blockName === addedUnit.blockName
      && isSimilarEnough(removedUnit, addedUnit);
  }
  if (removedUnit.path !== addedUnit.path) return false;
  return isSimilarEnough(removedUnit, addedUnit);
}

function toChange(type, unit) {
  const change = { type, kind: unit.kind, path: unit.path, tag: unit.tag };
  if (unit.kind === 'block') change.blockName = unit.blockName;
  return change;
}

export default function diffContent(previewRoot, liveRoot) {
  const preview = collect(previewRoot);
  const live = collect(liveRoot);
  const pairs = lcsPairs(live, preview);
  const matchedLive = new Set(pairs.map(([i]) => i));
  const matchedPreview = new Set(pairs.map(([, j]) => j));

  const removedCand = live.filter((_, i) => !matchedLive.has(i));
  const addedCand = preview.filter((_, j) => !matchedPreview.has(j));

  const modified = [];
  const removed = [];
  const usedAdded = new Set();
  removedCand.forEach((r) => {
    let mIdx = -1;
    let bestScore = -1;
    addedCand.forEach((a, idx) => {
      if (usedAdded.has(idx) || !isModifiedPair(r, a)) return;
      const score = textSimilarity(r.text, a.text);
      if (score > bestScore) { bestScore = score; mIdx = idx; }
    });
    if (mIdx >= 0) {
      usedAdded.add(mIdx);
      const a = addedCand[mIdx];
      modified.push({
        ...toChange('modified', a),
        previewEl: a.el,
        liveEl: r.el,
        previewText: a.text,
        liveText: r.text,
      });
    } else {
      removed.push({ ...toChange('removed', r), liveEl: r.el, liveText: r.text });
    }
  });
  const added = addedCand
    .filter((_, idx) => !usedAdded.has(idx))
    .map((a) => ({ ...toChange('added', a), previewEl: a.el, previewText: a.text }));

  return { added, modified, removed, unchanged: pairs.length };
}
