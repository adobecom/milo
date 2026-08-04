// Injects stored PR-review findings directly onto GitHub's Unified diff view
// (github.com/{owner}/{repo}/pull/{n}/files), at the exact file/line each
// finding references, with an accept/decline checkbox plus Edit/Simplify
// controls (reusing renderBody/buildEditableTextBlock from shared-render.js,
// loaded before this file — see manifest.json content_scripts order).
//
// Data contract (agreed with the side panel, which owns writing `findings`):
//   chrome.storage.local key `pr-review:${owner}/${repo}#${number}` ->
//   { findings: {...}, accepted: { blockers: [bool], suggestions: [bool],
//     nice_to_haves: [bool] } }
// This script reads that entry once at startup (and again if Turbo navigates
// to a different PR without a full page reload) and only ever writes back
// the `accepted` sub-object — it never rewrites `findings`.

console.log('[pr-review] content.js loaded on', location.href);

// Visible on-page status badge — the "nothing happens" failure mode this
// extension has hit repeatedly is otherwise silent (no thrown error visible
// without DevTools open), most commonly because reloading the unpacked
// extension in chrome://extensions invalidates any content script already
// injected into an already-open tab: every chrome.* call in that stale
// instance then throws "Extension context invalidated" and nothing happens.
// This badge makes that state (and every other lifecycle stage) visible from
// a plain screenshot.
let statusBadgeEl = null;
function setStatusBadge(text, variant) {
  if (!statusBadgeEl) {
    statusBadgeEl = document.createElement('div');
    statusBadgeEl.id = 'pr-review-status-badge';
    (document.body || document.documentElement).append(statusBadgeEl);
  }
  statusBadgeEl.textContent = `PR Review: ${text}`;
  statusBadgeEl.dataset.variant = variant || 'idle';
}

function isInvalidatedContextError(err) {
  return /context invalidated/i.test(err?.message || '');
}

setStatusBadge('content script loaded, checking for a stored review…', 'idle');

const SECTION_META = {
  blockers: { label: 'Blocker' },
  suggestions: { label: 'Suggestion' },
  nice_to_haves: { label: 'Nice-to-have' },
};
const SECTION_KEYS = Object.keys(SECTION_META);

let storageKey = null;
let prData = null; // { findings, accepted } — local working copy, mutated in place
const injectedRows = new Map(); // "section:idx" -> { finding, refreshBody }
const loggedSplitViewFiles = new Set(); // file paths we've already logged a split-view skip note for
const expandedFiles = new Set(); // file paths we've already clicked "Expand all" for — click once, not per finding
let filesObserver = null;
let mutationDebounceTimer = null;

function parsePrFromPath(pathname) {
  const m = pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: Number(m[3]) };
}

function annotationKey(sectionKey, idx) {
  return `${sectionKey}:${idx}`;
}

// content.js's own fetch would be subject to github.com's CSP, which will
// very likely block a request to the local relay — route through the
// background service worker instead (background.js owns the actual fetch).
function simplifyViaBackground(body) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'SIMPLIFY', body }, (response) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      if (response?.error) return reject(new Error(response.error));
      resolve(response.simplified);
    });
  });
}

// Safer than building a raw CSS attribute-selector string out of a path that
// could contain characters needing escaping — match by attribute value instead.
function findFileContainer(path) {
  const files = document.querySelectorAll('.file[data-tagsearch-path]');
  for (const file of files) {
    if (file.getAttribute('data-tagsearch-path') === path) return file;
  }
  return null;
}

// A given data-line-number can appear twice in a row (once for the old-file
// number cell, once for the new-file one), and unrelated rows can coincidentally
// share a number across old/new sides. Disambiguate by requiring the matched
// cell to be the *last* td.js-blob-rnum in its row — that's always the
// new/right-side line-number cell in the unified view's 3-td row shape.
function findRightSideCell(fileEl, line) {
  const candidates = fileEl.querySelectorAll(`td.js-blob-rnum[data-line-number="${line}"]`);
  for (const td of candidates) {
    const row = td.closest('tr');
    if (!row) continue;
    const numCells = row.querySelectorAll('td.js-blob-rnum');
    if (numCells.length && numCells[numCells.length - 1] === td) {
      return row;
    }
  }
  return null;
}

// A finding's line can legitimately be outside every rendered hunk's context
// window (e.g. citing the enclosing rule's opening line, not just the
// changed line) — GitHub collapses those regions by default, so there's no
// row to find at all until the user (or we) expand them. GitHub's own
// per-file "Expand all" button AJAX-loads the full file into the same table,
// which the existing MutationObserver on #files already reacts to — so a
// single click here is enough; no separate retry loop needed on this end.
function tryExpandFile(fileEl, filePath) {
  if (expandedFiles.has(filePath)) return false;
  const expandBtn = fileEl.querySelector('button.js-expand-full');
  if (!expandBtn) return false;
  expandedFiles.add(filePath);
  console.info(`[pr-review] "${filePath}" — target line isn't in the rendered diff (likely collapsed context); clicking "Expand all" to reveal it.`);
  expandBtn.click();
  return true;
}

// Heuristic for "this file is rendered in Split view, not Unified" — either
// there's no js-blob-rnum at all, or a code row has two blob-code cells
// (old-side + new-side) instead of unified's one.
function isSplitView(fileEl) {
  const anyRnum = fileEl.querySelector('td.js-blob-rnum');
  if (!anyRnum) return true;
  const row = anyRnum.closest('tr');
  const codeTds = row ? row.querySelectorAll('td.blob-code') : [];
  return codeTds.length >= 2;
}

function buildInjectableList() {
  if (!prData?.findings) return [];
  const list = [];
  for (const sectionKey of SECTION_KEYS) {
    const items = prData.findings[sectionKey] || [];
    items.forEach((finding, idx) => {
      if (finding.file && finding.line != null) list.push({ sectionKey, idx, finding });
    });
  }
  return list;
}

async function updateAccepted(sectionKey, idx, checked) {
  if (!storageKey || !hasLocalStorage()) return;
  // Re-fetch immediately before writing so we only ever clobber `accepted`,
  // never a `findings` edit the side panel may have made concurrently.
  const result = await chrome.storage.local.get(storageKey);
  const entry = result[storageKey];
  if (!entry) return;
  const accepted = { ...entry.accepted };
  const arr = Array.isArray(accepted[sectionKey]) ? [...accepted[sectionKey]] : [];
  arr[idx] = checked;
  accepted[sectionKey] = arr;
  if (prData) prData.accepted = accepted;
  await chrome.storage.local.set({ [storageKey]: { findings: entry.findings, accepted } });
}

function buildAnnotationRow(row, finding, sectionKey, idx) {
  const colCount = row.querySelectorAll('td').length;

  const box = document.createElement('div');
  box.className = `pr-review-annotation pr-review-annotation--${sectionKey}`;

  const header = document.createElement('div');
  header.className = 'pr-review-annotation-header';

  const badge = document.createElement('span');
  badge.className = 'pr-review-annotation-badge';
  badge.textContent = SECTION_META[sectionKey].label;
  header.append(badge);

  const acceptLabel = document.createElement('label');
  acceptLabel.className = 'pr-review-annotation-accept';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = !!(prData.accepted?.[sectionKey] && prData.accepted[sectionKey][idx]);
  checkbox.addEventListener('change', () => updateAccepted(sectionKey, idx, checkbox.checked));
  acceptLabel.append(checkbox, document.createTextNode('Accept'));
  header.append(acceptLabel);

  box.append(header);

  const { container, toolbar } = buildEditableTextBlock(
    () => finding.body,
    (v) => { finding.body = v; },
    simplifyViaBackground,
  );
  container.classList.add('pr-review-annotation-body');
  toolbar.classList.add('pr-review-annotation-toolbar');

  box.append(container, toolbar);

  const td = document.createElement('td');
  td.colSpan = colCount;
  td.className = 'pr-review-annotation-cell';
  td.append(box);

  const tr = document.createElement('tr');
  tr.className = 'pr-review-annotation-row';
  tr.append(td);

  const refreshBody = () => {
    container.innerHTML = ''; // clearing with an empty string, not model content — safe
    renderBody(container, finding.body);
  };

  return { tr, refreshBody };
}

// A finding's file can legitimately not be part of this PR's diff at all —
// e.g. the reviewer flagging "this same bug also exists in file X" as a
// related observation, not a location within the change being reviewed.
// That's indistinguishable, up front, from "this file's diff hasn't
// finished mounting yet" — and every attempt to time-box that distinction
// (attempt-count budgets, then a wall-clock grace period, then gating the
// clock on file-count stability) produced a false positive against GitHub's
// React-based Files-changed view, which hydrates on its own schedule with
// no reliable "settled" signal from the outside. A genuinely off-diff
// finding just retries harmlessly forever (still correctly demoted to plain
// text when actually posting — see server.js's diffLineIndex filtering,
// verified separately); a real in-diff file wrongly flagged as unreachable
// is actively misleading. So: no timeout, no warning — just keep retrying.
function tryInject({ sectionKey, idx, finding }) {
  const key = annotationKey(sectionKey, idx);
  if (injectedRows.has(key)) return;

  const fileEl = findFileContainer(finding.file);
  if (!fileEl) return; // diff for this file not mounted yet (or not part of it) — retry on next observer pass

  const row = findRightSideCell(fileEl, finding.line);
  if (!row) {
    if (!loggedSplitViewFiles.has(finding.file) && isSplitView(fileEl)) {
      loggedSplitViewFiles.add(finding.file);
      console.info(`[pr-review] "${finding.file}" is shown in Split view — annotations only support Unified view, skipping this file.`);
      return;
    }
    tryExpandFile(fileEl, finding.file); // may reveal the line — MutationObserver will retry
    return; // line not present in the rendered diff yet (or unsupported view)
  }
  if (row.dataset.prReviewAnnotated === 'true') return; // already annotated
  if (row.querySelectorAll('td').length !== 3) return; // hunk-header or unexpected shape — skip

  const { tr, refreshBody } = buildAnnotationRow(row, finding, sectionKey, idx);
  row.after(tr);
  row.dataset.prReviewAnnotated = 'true';
  injectedRows.set(key, { finding, refreshBody });
}

function injectAll() {
  if (!prData) return;
  const list = buildInjectableList();
  for (const entry of list) tryInject(entry);
  if (list.length === 0) {
    setStatusBadge('review has no file/line-anchored findings to inject', 'ok');
    return;
  }
  setStatusBadge(`${injectedRows.size}/${list.length} annotations injected`, injectedRows.size > 0 ? 'ok' : 'idle');
}

function scheduleInjectAll() {
  clearTimeout(mutationDebounceTimer);
  mutationDebounceTimer = setTimeout(() => {
    if (prData) injectAll();
  }, 150);
}

function attachObserver() {
  const root = document.getElementById('files') || document.body;
  if (filesObserver) filesObserver.disconnect();
  filesObserver = new MutationObserver(() => scheduleInjectAll());
  filesObserver.observe(root, { childList: true, subtree: true });
}

function hasLocalStorage() {
  return !!(chrome.storage && chrome.storage.local);
}

async function loadPrData(key) {
  if (!hasLocalStorage()) {
    console.warn('[pr-review] chrome.storage.local not accessible — is the "storage" permission in manifest.json, and has the extension been reloaded since?');
    return null;
  }
  try {
    const result = await chrome.storage.local.get(key);
    const entry = result[key];
    return entry ? { findings: entry.findings, accepted: entry.accepted || {} } : null;
  } catch (err) {
    if (isInvalidatedContextError(err)) {
      setStatusBadge('extension was reloaded — refresh this tab to resume', 'error');
    } else {
      setStatusBadge(`storage read failed: ${err.message}`, 'error');
    }
    console.error('[pr-review] chrome.storage.local.get failed', err);
    return null;
  }
}

async function init() {
  const pr = parsePrFromPath(location.pathname);
  if (!pr) return;
  storageKey = `pr-review:${pr.owner}/${pr.repo}#${pr.number}`;
  prData = await loadPrData(storageKey);
  if (!prData) {
    if (statusBadgeEl?.dataset.variant !== 'error') {
      setStatusBadge('no stored review yet for this PR — run one from the side panel', 'idle');
    }
    return; // no review run yet for this PR — no placeholder UI
  }
  attachObserver();
  injectAll();
}

// GitHub uses Turbo for navigation between PR tabs (Conversation <-> Files
// changed) and commits — no full page reload, so re-run injection here too.
// If the path now points at a different PR, treat it as a fresh startup:
// re-read storage for the new key (still just once per PR, not polling).
document.addEventListener('turbo:render', async () => {
  const pr = parsePrFromPath(location.pathname);
  if (!pr) {
    storageKey = null;
    prData = null;
    injectedRows.clear();
    loggedSplitViewFiles.clear();
    expandedFiles.clear();
    return;
  }
  const newKey = `pr-review:${pr.owner}/${pr.repo}#${pr.number}`;
  if (newKey !== storageKey) {
    storageKey = newKey;
    prData = await loadPrData(storageKey);
  }
  injectedRows.clear(); // Turbo swaps the DOM — old row references (and their data-* flags) are gone
  loggedSplitViewFiles.clear();
  expandedFiles.clear();
  attachObserver(); // #files may have been replaced with a new node
  if (prData) injectAll();
});

// Two cases land here:
// 1. First arrival — the common case, since this content script's own
//    init() typically runs (and finds no stored review yet) well before the
//    side panel finishes a review that can take 1-3 minutes. Once findings
//    first appear in storage, this is the only signal we get; treat it as a
//    fresh load and actually inject, rather than silently doing nothing.
// 2. A later edit/simplify from the side panel on already-injected findings
//    — re-render just the changed body via renderBody(), no re-injection.
// Guarded (see hasLocalStorage above): registering this at the top level
// unconditionally would throw and silently stop every line below it if
// chrome.storage.local isn't accessible yet — the exact same failure
// shape that broke sidepanel.js earlier, just here instead.
if (hasLocalStorage()) {
  chrome.storage.onChanged.addListener((changes, area) => {
    try {
      if (area !== 'local' || !storageKey || !changes[storageKey]) return;
      const newEntry = changes[storageKey].newValue;
      if (!newEntry) return;

      if (!prData) {
        prData = { findings: newEntry.findings, accepted: newEntry.accepted || {} };
        attachObserver();
        injectAll();
        return;
      }

      for (const sectionKey of SECTION_KEYS) {
        const newItems = newEntry.findings?.[sectionKey] || [];
        const masterArr = prData.findings[sectionKey] || (prData.findings[sectionKey] = []);
        newItems.forEach((newItem, idx) => {
          if (!masterArr[idx]) {
            masterArr[idx] = { ...newItem };
            return;
          }
          if (masterArr[idx].body === newItem.body) return;
          masterArr[idx].body = newItem.body;
          const rec = injectedRows.get(annotationKey(sectionKey, idx));
          if (rec) rec.refreshBody();
        });
      }
    } catch (err) {
      if (isInvalidatedContextError(err)) {
        setStatusBadge('extension was reloaded — refresh this tab to resume', 'error');
      } else {
        setStatusBadge(`error handling review update: ${err.message}`, 'error');
      }
      console.error('[pr-review] onChanged handler failed', err);
    }
  });
} else {
  console.warn('[pr-review] chrome.storage.local not accessible — live sync with the side panel is disabled for this page load.');
}

init();
