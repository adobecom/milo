/**
 * Screenshot Diff viewer.
 *
 * Reads run artifacts via the nala-auto.corp.adobe.com proxy instead of
 * fetching from internal S3 directly. nala-auto already has an
 * http-proxy-middleware path at /api/milo/* pointing at the same S3 bucket
 * the GitHub Actions workflow uploads to.
 *
 * Pre-conditions for this to work in the browser:
 *   - User is on Adobe corp network / VPN (nala-auto is internal)
 *   - nala-auto returns Access-Control-Allow-Origin for milo.adobe.com
 *     (small PR to adobecom/nala-auto; see PROPOSAL.md)
 */

const PROXY_BASE = 'https://nala-auto.corp.adobe.com/api/milo';
const GITHUB_REPO = 'JackySun9/milo'; // Switch to adobecom/milo when promoted
const WORKFLOW_FILE = 'screenshot-diff.yml';

const els = {
  project: document.getElementById('project'),
  loadBtn: document.getElementById('load-btn'),
  triggerBtn: document.getElementById('trigger-btn'),
  status: document.getElementById('status'),
  runMeta: document.getElementById('run-meta'),
  runTimestamp: document.getElementById('run-timestamp'),
  runCount: document.getElementById('run-count'),
  runDiffCount: document.getElementById('run-diff-count'),
  results: document.getElementById('results'),
};

function setStatus(message, type = 'info') {
  els.status.textContent = message;
  els.status.classList.remove('error', 'success');
  if (type === 'error') els.status.classList.add('error');
  else if (type === 'success') els.status.classList.add('success');
}

function projectPath(project) {
  return `screenshots/${project}`;
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

function flattenEntries(results) {
  const flat = [];
  Object.entries(results).forEach(([key, value]) => {
    const items = Array.isArray(value) ? value : [value];
    items.forEach((item, i) => {
      flat.push({ key: items.length > 1 ? `${key} #${i + 1}` : key, ...item });
    });
  });
  return flat;
}

function imageUrl(localPath) {
  return `${PROXY_BASE}/${localPath}`;
}

function renderEntry(entry) {
  const card = document.createElement('div');
  card.className = 'result-card';

  const hasDiff = Boolean(entry.diff);
  const urlsHtml = (entry.urls || '')
    .split(' | ')
    .filter(Boolean)
    .map((u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`)
    .join(' &middot; ');

  card.innerHTML = `
    <div class="result-card-header">
      <div class="result-card-title">
        <span class="caret">▶</span>
        <span>${entry.key}</span>
      </div>
      <span class="diff-badge ${hasDiff ? 'has-diff' : 'no-diff'}">
        ${hasDiff ? 'DIFF' : 'MATCH'}
      </span>
    </div>
    <div class="result-card-body">
      <div class="urls">${urlsHtml}</div>
      <div class="images">
        ${entry.a ? `
          <div class="image-tile">
            <div class="image-tile-label">A — Stable</div>
            <img src="${imageUrl(entry.a)}" alt="stable" loading="lazy" />
          </div>
        ` : ''}
        ${entry.b ? `
          <div class="image-tile">
            <div class="image-tile-label">B — Beta</div>
            <img src="${imageUrl(entry.b)}" alt="beta" loading="lazy" />
          </div>
        ` : ''}
        ${entry.diff ? `
          <div class="image-tile diff">
            <div class="image-tile-label">Diff</div>
            <img src="${imageUrl(entry.diff)}" alt="diff" loading="lazy" />
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const header = card.querySelector('.result-card-header');
  const caret = card.querySelector('.caret');
  header.addEventListener('click', () => {
    const expanded = card.classList.toggle('expanded');
    caret.textContent = expanded ? '▼' : '▶';
  });

  return card;
}

async function loadLatestRun() {
  const project = els.project.value;
  setStatus(`Loading latest run for ${project}…`);
  els.results.innerHTML = '';
  els.runMeta.classList.add('hidden');

  try {
    const base = `${PROXY_BASE}/${projectPath(project)}`;
    const [results, timestamp] = await Promise.all([
      fetchJson(`${base}/results.json`),
      fetchJson(`${base}/timestamp.json`).catch(() => null),
    ]);

    const entries = flattenEntries(results);
    const diffCount = entries.filter((e) => e.diff).length;

    els.runTimestamp.textContent = timestamp ? timestamp[0] : 'unknown';
    els.runCount.textContent = String(entries.length);
    els.runDiffCount.textContent = String(diffCount);
    els.runMeta.classList.remove('hidden');

    if (entries.length === 0) {
      els.results.innerHTML = '<div class="empty-state">No comparisons in this run.</div>';
    } else {
      entries.forEach((entry) => els.results.appendChild(renderEntry(entry)));
    }

    setStatus(`Loaded ${entries.length} comparison(s), ${diffCount} with diff(s).`, 'success');
  } catch (err) {
    setStatus(
      `Failed to load: ${err.message}. Are you on Adobe corp network?`,
      'error',
    );
  }
}

function openWorkflowDispatch() {
  const project = els.project.value;
  const url = `https://github.com/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}`;
  setStatus(`Opening GitHub workflow page for ${project}. Click "Run workflow" there.`);
  window.open(url, '_blank', 'noopener');
}

els.loadBtn.addEventListener('click', loadLatestRun);
els.triggerBtn.addEventListener('click', openWorkflowDispatch);

// Auto-load default project on first paint.
loadLatestRun();
