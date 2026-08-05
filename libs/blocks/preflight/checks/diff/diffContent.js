import { normalizeText, getXPath } from './nodePath.js';

const CONTENT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, a, img, button, blockquote';

function ownText(el) {
  if (el.tagName === 'IMG') return normalizeText(el.getAttribute('alt') || '');
  return normalizeText(el.textContent);
}

function identity(el) {
  if (el.tagName === 'IMG') return `img|${el.getAttribute('src') || ''}`;
  if (el.tagName === 'A') return `a|${el.getAttribute('href') || ''}|${ownText(el)}`;
  return `${el.tagName.toLowerCase()}|${ownText(el)}`;
}

function collect(rootEl) {
  return [...rootEl.querySelectorAll(CONTENT_SELECTOR)].map((el) => ({
    el,
    path: getXPath(el, rootEl),
    tag: el.tagName,
    text: ownText(el),
    sig: identity(el),
  }));
}

// Longest-common-subsequence match on signatures; returns [liveIdx, previewIdx] pairs.
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
  // An unmatched removed+added pair at the same path/tag is one element edited in place.
  removedCand.forEach((r) => {
    const mIdx = addedCand.findIndex((a, idx) => !usedAdded.has(idx)
      && a.tag === r.tag && a.path === r.path);
    if (mIdx >= 0) {
      usedAdded.add(mIdx);
      const a = addedCand[mIdx];
      modified.push({
        type: 'modified', path: a.path, tag: a.tag, previewEl: a.el, liveEl: r.el, previewText: a.text, liveText: r.text,
      });
    } else {
      removed.push({ type: 'removed', path: r.path, tag: r.tag, liveEl: r.el, liveText: r.text });
    }
  });
  const added = addedCand
    .filter((_, idx) => !usedAdded.has(idx))
    .map((a) => ({ type: 'added', path: a.path, tag: a.tag, previewEl: a.el, previewText: a.text }));

  return { added, modified, removed, unchanged: pairs.length };
}
