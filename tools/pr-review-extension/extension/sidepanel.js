// RELAY_BASE, CODE_FENCE_RE, renderBody, buildEditableTextBlock all come
// from shared-render.js, loaded before this file in sidepanel.html.

const els = {
  prContext: document.getElementById('pr-context'),
  runBtn: document.getElementById('run-btn'),
  status: document.getElementById('status'),
  results: document.getElementById('results'),
  title: document.getElementById('result-title'),
  size: document.getElementById('result-size'),
  overviewContainer: document.getElementById('result-overview-container'),
  sections: {
    blockers: document.getElementById('blockers-section'),
    suggestions: document.getElementById('suggestions-section'),
    nice_to_haves: document.getElementById('nice-to-haves-section'),
  },
  lists: {
    blockers: document.getElementById('blockers-list'),
    suggestions: document.getElementById('suggestions-list'),
    nice_to_haves: document.getElementById('nice-to-haves-list'),
  },
  postStatus: document.getElementById('post-status'),
  postDraftBtn: document.getElementById('post-draft-btn'),
  postCommentBtn: document.getElementById('post-comment-btn'),
  postApproveBtn: document.getElementById('post-approve-btn'),
  postRequestChangesBtn: document.getElementById('post-request-changes-btn'),
};

let currentPr = null; // { owner, repo, number, url } — tracks whatever PR the active tab is on
let currentFindings = null;
let reviewedPr = null; // the PR currentFindings actually belongs to — may differ from currentPr
                        // if the user switched tabs while a review was in flight

// --- chrome.storage.local data contract, shared with content.js ---
// Key:   `pr-review:${owner}/${repo}#${number}`
// Value: { findings, accepted: { blockers: bool[], suggestions: bool[],
//          nice_to_haves: bool[] } }
// The side panel writes `findings` (once, right after a review) and reads
// `accepted` back; content.js only ever reads `findings` and writes `accepted`.
function storageKey(pr) {
  return `pr-review:${pr.owner}/${pr.repo}#${pr.number}`;
}

function defaultAccepted(findings) {
  return {
    blockers: (findings.blockers || []).map(() => true),
    suggestions: (findings.suggestions || []).map(() => true),
    nice_to_haves: (findings.nice_to_haves || []).map(() => true),
  };
}

// chrome.storage.local requires the "storage" permission — only present
// once the unpacked extension has been reloaded in chrome://extensions after
// manifest.json changed. Guard every entry point so a missing/not-yet-granted
// permission degrades gracefully instead of throwing and halting the whole
// script (a synchronous throw here would stop everything below it, including
// the final detectPr() call at the bottom of this file).
function hasLocalStorage() {
  return !!(chrome.storage && chrome.storage.local);
}

// Fire-and-forget: not on the critical path for rendering, and any failure
// here shouldn't block the panel from showing results.
function persistFindings(pr, findings) {
  if (!hasLocalStorage()) return;
  const key = storageKey(pr);
  chrome.storage.local.set({
    [key]: { findings, accepted: defaultAccepted(findings) },
  }).catch((err) => console.error('pr-review: failed to persist findings', err));
}

async function readStoredEntry(pr) {
  if (!pr || !hasLocalStorage()) return null;
  const key = storageKey(pr);
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  } catch (err) {
    console.error('pr-review: failed to read stored entry', err);
    return null;
  }
}

// Mirrors content.js's own updateAccepted — writing through to storage on
// every checkbox change (not just content.js's on-page ones) is what makes
// storage a reliable single source of truth at post time. Without this, a
// checkbox toggled only here in the side panel never left the DOM, so
// postReview's old "storage wins" merge would silently overwrite it with
// storage's stale defaults.
async function updateAcceptedInStorage(sectionKey, idx, checked) {
  if (!reviewedPr || !hasLocalStorage()) return;
  const key = storageKey(reviewedPr);
  try {
    const result = await chrome.storage.local.get(key);
    const entry = result[key];
    if (!entry) return;
    const accepted = { ...entry.accepted };
    const arr = Array.isArray(accepted[sectionKey]) ? [...accepted[sectionKey]] : [];
    arr[idx] = checked;
    accepted[sectionKey] = arr;
    await chrome.storage.local.set({ [key]: { findings: entry.findings, accepted } });
  } catch (err) {
    console.error('pr-review: failed to persist checkbox change', err);
  }
}

// Updates existing checkboxes in place from a freshly-read `accepted` object
// (e.g. toggled on the GitHub page by content.js) — deliberately does not
// touch anything else, so in-progress Edit-mode textareas aren't disturbed.
function applyAcceptedToDom(accepted) {
  if (!accepted) return;
  for (const key of ['blockers', 'suggestions', 'nice_to_haves']) {
    const arr = accepted[key];
    if (!Array.isArray(arr)) continue;
    const checkboxes = [...els.lists[key].querySelectorAll('input[type="checkbox"]')];
    checkboxes.forEach((cb, i) => {
      if (i < arr.length) cb.checked = !!arr[i];
    });
  }
}

// Keeps the panel's own checkboxes in sync if the user toggled accept/decline
// on the actual GitHub page (via content.js) while the panel is also open.
// Guarded (see hasLocalStorage above): this runs at module load time, and a
// missing "storage" permission would otherwise throw here and silently stop
// every line below it — including the detectPr() call at the bottom of this
// file — breaking basic PR detection for a reason that has nothing to do with it.
if (hasLocalStorage()) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    if (!reviewedPr) return;
    const change = changes[storageKey(reviewedPr)];
    if (!change || !change.newValue) return;
    applyAcceptedToDom(change.newValue.accepted);
  });
}

function parsePrFromUrl(url) {
  if (!url) return null;
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], number: Number(m[3]), url: url.split('#')[0] };
}

async function detectPr() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentPr = parsePrFromUrl(tab?.url);
  if (currentPr) {
    els.prContext.textContent = `${currentPr.owner}/${currentPr.repo} #${currentPr.number}`;
    els.runBtn.disabled = false;
  } else {
    els.prContext.textContent = 'Open a GitHub PR page to enable review.';
    els.runBtn.disabled = true;
  }
}

// item.body is mutated in place by both Edit and Simplify — item is a direct
// reference into currentFindings[key][i], so the /api/post payload (which
// sends currentFindings back to the relay) picks up any edits automatically,
// with no change needed to the wire format.
function buildFindingItem(item, checked, sectionKey, idx) {
  const li = document.createElement('li');
  const label = document.createElement('label');
  label.className = 'finding-item';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => updateAcceptedInStorage(sectionKey, idx, checkbox.checked));

  const wrapper = document.createElement('span');
  wrapper.className = 'finding-content';

  if (item.file && item.line != null) {
    const location = document.createElement('span');
    location.className = 'finding-location';
    location.textContent = `${item.file}:${item.line}`; // textContent only — never render model output as HTML
    wrapper.append(location);
  }

  const { container, toolbar } = buildEditableTextBlock(
    () => item.body,
    (v) => { item.body = v; },
  );
  wrapper.append(container, toolbar);

  label.append(checkbox, wrapper);
  li.append(label);
  return { li, checkbox };
}

function renderFindings(findings) {
  currentFindings = findings;
  if (reviewedPr) persistFindings(reviewedPr, findings);
  els.title.textContent = `PR #${findings.pr_number} — ${findings.title}`;
  els.size.textContent = findings.size_line;

  els.overviewContainer.innerHTML = ''; // clearing with an empty string, not model content — safe
  const { container: overviewBody, toolbar: overviewToolbar } = buildEditableTextBlock(
    () => currentFindings.overview,
    (v) => { currentFindings.overview = v; },
  );
  els.overviewContainer.append(overviewBody, overviewToolbar);

  for (const key of ['blockers', 'suggestions', 'nice_to_haves']) {
    const list = els.lists[key];
    list.innerHTML = '';
    const items = findings[key] || [];
    els.sections[key].hidden = items.length === 0;
    items.forEach((item, idx) => {
      const { li } = buildFindingItem(item, true, key, idx);
      list.append(li);
    });
  }

  els.results.hidden = false;
}

function collectAccepted() {
  const accepted = {};
  for (const key of ['blockers', 'suggestions', 'nice_to_haves']) {
    accepted[key] = [...els.lists[key].querySelectorAll('input[type="checkbox"]')].map((cb) => cb.checked);
  }
  return accepted;
}

// server-side keys use "Blockers"/"Suggestions"/"Nice-to-haves" section titles;
// map from the snake_case UI keys to those before posting.
function toServerAccepted(accepted) {
  return {
    Blockers: accepted.blockers,
    Suggestions: accepted.suggestions,
    'Nice-to-haves': accepted.nice_to_haves,
  };
}

els.runBtn.addEventListener('click', async () => {
  if (!currentPr) return;
  const prAtRequestTime = currentPr; // snapshot — currentPr may change if the user switches tabs mid-fetch
  els.runBtn.disabled = true;
  els.results.hidden = true;
  els.status.textContent = 'Running review — this can take a couple of minutes…';

  try {
    const res = await fetch(`${RELAY_BASE}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: prAtRequestTime.url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    els.status.textContent = `Done (cost: $${(data.cost_usd || 0).toFixed(3)})`;
    reviewedPr = prAtRequestTime;
    renderFindings(data.findings);
  } catch (err) {
    els.status.textContent = `Error: ${err.message}. Is the relay running (npm start in tools/pr-review-extension/relay)?`;
  } finally {
    els.runBtn.disabled = false;
  }
});

const postButtons = () => [
  els.postDraftBtn, els.postCommentBtn, els.postApproveBtn, els.postRequestChangesBtn,
];

// After a draft review is created, the PR tab's own diff view has no way to
// know new pending-review comments exist server-side — reload it so the
// user sees them immediately instead of having to refresh by hand.
async function refreshPrTab(pr) {
  if (!pr) return;
  try {
    const tabs = await chrome.tabs.query({ url: `https://github.com/${pr.owner}/${pr.repo}/pull/${pr.number}*` });
    for (const tab of tabs) {
      if (tab.id != null) chrome.tabs.reload(tab.id);
    }
  } catch (err) {
    console.error('pr-review: failed to refresh PR tab', err);
  }
}

async function postReview(reviewState) {
  if (!reviewedPr || !currentFindings) return;
  els.postStatus.textContent = 'Posting…';
  postButtons().forEach((b) => { b.disabled = true; });

  try {
    // Both surfaces now write every checkbox change straight to storage
    // (see updateAcceptedInStorage above and content.js's own updateAccepted),
    // so storage is always at least as fresh as either surface's own DOM —
    // trust it outright rather than merging, which previously let a stale
    // stored value silently overwrite a change made only in this panel.
    // collectAccepted() is only a fallback for the (normally unreachable)
    // case where storage has no entry at all yet.
    const stored = await readStoredEntry(reviewedPr);
    const accepted = stored?.accepted || collectAccepted();

    const res = await fetch(`${RELAY_BASE}/api/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo: `${reviewedPr.owner}/${reviewedPr.repo}`,
        prNumber: reviewedPr.number,
        findings: currentFindings,
        accepted: toServerAccepted(accepted),
        reviewState,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    els.postStatus.textContent = data.pending
      ? 'Draft review created — refreshing the PR tab so you can review and submit it yourself (nothing is visible to anyone else yet).'
      : 'Posted to GitHub.';
    if (data.pending) await refreshPrTab(reviewedPr);
  } catch (err) {
    els.postStatus.textContent = `Error: ${err.message}`;
  } finally {
    postButtons().forEach((b) => { b.disabled = false; });
  }
}

els.postDraftBtn.addEventListener('click', () => postReview('draft'));
els.postCommentBtn.addEventListener('click', () => postReview('comment'));
els.postApproveBtn.addEventListener('click', () => postReview('approve'));
els.postRequestChangesBtn.addEventListener('click', () => postReview('request_changes'));

chrome.tabs.onActivated.addListener(detectPr);
chrome.tabs.onUpdated.addListener((_, changeInfo) => { if (changeInfo.url) detectPr(); });

detectPr();
