import { createTag, loadStyle } from '../../utils/utils.js';
import { resolveContext, createClient, signIn, onToken } from './api.js';
import { computeRollup, deriveStatus, computeStatusCounts, computePreflightRollup, preflightTier } from './rollup.js';
import applyView from './view.js';

const PLACEHOLDER = [
  'https://main--da-bacom--adobecom.aem.page/de/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/fr/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/jp/some-campaign-page',
].join('\n');

export function parseUrls(text) {
  return (text || '')
    .split(/\n|,/)
    .map((u) => u.trim())
    .filter(Boolean);
}

const PAGE_SIZE = 25;

const EDS_HOST_RE = /\.aem\.(page|live)$/i;
const HOST_REPO = {
  'business.adobe.com': 'da-bacom',
  'business.stage.adobe.com': 'da-bacom',
};

export function normalizeUrl(input) {
  let u;
  try { u = new URL(input); } catch { return input; }
  const host = u.hostname.toLowerCase();
  if (EDS_HOST_RE.test(host)) return input;
  const repo = HOST_REPO[host];
  if (!repo) return input;
  let path = u.pathname.replace(/\.html$/i, '');
  if (path.length > 1) path = path.replace(/\/$/, '');
  return `https://main--${repo}--adobecom.aem.page${path}`;
}

const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '#');

const fillSelect = (sel, opts) => {
  opts.forEach(([value, label]) => sel.append(createTag('option', { value }, label)));
};

function createStatusCell(when) {
  if (!when) return createTag('td', { class: 'pt-cell pt-empty' }, '—');
  const date = new Date(when).toLocaleDateString();
  const cell = createTag('td', { class: 'pt-cell pt-ok', title: when });
  cell.append(createTag('span', { class: 'pt-check' }, '✓'), ` ${date}`);
  return cell;
}

const STATUS_CLASS = { Draft: 'pt-badge-draft', Previewed: 'pt-badge-previewed', Live: 'pt-badge-live' };

function createBadgeCell(status) {
  const cell = createTag('td', { class: 'pt-cell' });
  const badge = createTag('span', { class: `pt-badge ${STATUS_CLASS[status] || ''}` });
  badge.textContent = status;
  cell.append(badge);
  return cell;
}

function createCommentsCell(annotations) {
  const { threads = 0, open = 0 } = annotations || {};
  if (!threads) return createTag('td', { class: 'pt-cell pt-empty' }, '—');
  return createTag('td', { class: 'pt-cell' }, `💬 ${open ? `${threads} · ${open} open` : threads}`);
}

function createPreflightCell(preflight) {
  const score = preflight?.score;
  if (score == null) return createTag('td', { class: 'pt-cell pt-empty' }, '—');
  const parts = [];
  if (preflight.seo != null) parts.push(`SEO ${preflight.seo}`);
  if (preflight.accessibility != null) parts.push(`A11y ${preflight.accessibility}`);
  if (preflight.assets != null) parts.push(`Assets ${preflight.assets}`);
  if (preflight.brokenLinks) parts.push(`${preflight.brokenLinks} broken link${preflight.brokenLinks === 1 ? '' : 's'}`);
  if (preflight.a11yIssues) parts.push(`${preflight.a11yIssues} a11y issue${preflight.a11yIssues === 1 ? '' : 's'}`);
  if (preflight.lastRun) parts.push(`run ${new Date(preflight.lastRun).toLocaleDateString()}`);
  const cell = createTag('td', { class: 'pt-cell' });
  cell.append(createTag('span', { class: `pt-pf pt-pf-${preflightTier(score)}`, title: parts.join(' · ') }, String(score)));
  return cell;
}

function createStatCard(label, pctValue, n, total, variant) {
  const card = createTag('div', { class: `pt-stat pt-stat-${variant}` });
  const head = createTag('div', { class: 'pt-stat-head' });
  head.append(
    createTag('span', { class: 'pt-stat-label' }, label),
    createTag('span', { class: 'pt-stat-frac' }, `${n} / ${total}`),
  );
  const big = createTag('div', { class: 'pt-stat-pct' }, `${pctValue}%`);
  const bar = createTag('div', { class: 'pt-bar' });
  bar.append(createTag('div', { class: 'pt-bar-fill', style: `width:${pctValue}%` }));
  card.append(head, big, bar);
  return card;
}

function renderPager(view, pages, total, start, shown, onChange) {
  const pager = createTag('div', { class: 'pt-pager' });
  const prev = createTag('button', { type: 'button', class: 'pt-page-btn', 'aria-label': 'Previous page' }, '‹ Prev');
  const next = createTag('button', { type: 'button', class: 'pt-page-btn', 'aria-label': 'Next page' }, 'Next ›');
  prev.disabled = view.page <= 1;
  next.disabled = view.page >= pages;
  const info = createTag('span', { class: 'pt-page-info' }, `${start + 1}–${start + shown} of ${total} · Page ${view.page} of ${pages}`);
  prev.addEventListener('click', () => { view.page -= 1; onChange(); });
  next.addEventListener('click', () => { view.page += 1; onChange(); });
  pager.append(prev, info, next);
  return pager;
}

function renderResults(mount, rows, since, view = {}) {
  mount.replaceChildren();
  if (rows.length === 0) {
    mount.append(createTag('p', { class: 'pt-muted' }, 'No URLs to check.'));
    return;
  }
  const rollup = computeRollup(rows, { since: since || undefined });
  const counts = computeStatusCounts(rows);
  const preflight = computePreflightRollup(rows);

  const stats = createTag('div', { class: 'pt-stats' });
  stats.append(
    createStatCard('Previewed', rollup.previewedPct, rollup.previewed, rollup.total, 'previewed'),
    createStatCard('Published', rollup.publishedPct, rollup.published, rollup.total, 'published'),
  );
  if (preflight.checked) {
    stats.append(createStatCard('Preflight OK', preflight.passingPct, preflight.passing, preflight.checked, 'preflight'));
  }

  const countStrip = createTag('div', { class: 'pt-status-counts' });
  countStrip.append(
    createTag('span', { class: 'pt-badge pt-badge-draft' }, `Draft ${counts.draft}`),
    createTag('span', { class: 'pt-badge pt-badge-previewed' }, `Previewed ${counts.previewed}`),
    createTag('span', { class: 'pt-badge pt-badge-live' }, `Live ${counts.live}`),
  );

  const visible = applyView(rows, view);
  const total = visible.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  view.page = Math.min(Math.max(view.page, 1), pages);
  const start = (view.page - 1) * PAGE_SIZE;
  const pageRows = visible.slice(start, start + PAGE_SIZE);

  const hasPreflight = preflight.checked > 0;
  const table = createTag('table', { class: 'pt-table' });
  const headRow = createTag('tr');
  const headCells = [
    createTag('th', { scope: 'col' }, 'Page'),
    createTag('th', { scope: 'col' }, 'Status'),
    createTag('th', { scope: 'col' }, 'Previewed'),
    createTag('th', { scope: 'col' }, 'Published'),
  ];
  if (hasPreflight) headCells.push(createTag('th', { scope: 'col' }, 'Preflight'));
  headCells.push(createTag('th', { scope: 'col' }, 'Comments'));
  headRow.append(...headCells);
  table.append(createTag('thead', {}, headRow));
  const tbody = createTag('tbody');
  pageRows.forEach((r) => {
    const tr = createTag('tr');
    const href = safeUrl(r.url);
    const linkCell = createTag('td', { class: 'pt-cell pt-url' });
    const link = createTag('a', { class: 'pt-link', href, target: '_blank', rel: 'noopener noreferrer' });
    link.textContent = r.url;
    linkCell.append(link);
    const cells = [
      linkCell,
      createBadgeCell(deriveStatus(r)),
      createStatusCell(r.lastPreview),
      createStatusCell(r.lastPublish),
    ];
    if (hasPreflight) cells.push(createPreflightCell(r.preflight));
    cells.push(createCommentsCell(r.annotations));
    tr.append(...cells);
    tbody.append(tr);
  });
  table.append(tbody);

  mount.append(stats, countStrip, createTag('div', { class: 'pt-table-wrap' }, table));
  if (total === 0) {
    mount.append(createTag('p', { class: 'pt-muted' }, 'No pages match the current filter or search.'));
  } else if (pages > 1) {
    const onPage = () => renderResults(mount, rows, since, view);
    mount.append(renderPager(view, pages, total, start, pageRows.length, onPage));
  }
}

function renderError(mount, status, message) {
  mount.replaceChildren();
  if (status === 401) {
    const m = 'Not signed in to Adobe. Sign in, then check again.';
    mount.append(createTag('p', { class: 'pt-error' }, m));
    const btn = createTag('button', { type: 'button', class: 'pt-check-btn pt-signin' }, 'Sign in to Adobe');
    btn.addEventListener('click', () => signIn());
    mount.append(btn);
    return;
  }
  mount.append(createTag('p', { class: 'pt-error' }, message));
}

export default async function init(block) {
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });

  const ctx = await resolveContext(block);
  const client = createClient(ctx);

  block.replaceChildren();

  const header = createTag('div', { class: 'pt-header' });
  const checkBtn = createTag('button', { type: 'button', class: 'pt-check-btn' }, 'Check status');
  header.append(createTag('h2', { class: 'pt-title' }, 'Project Tracking'), checkBtn);

  const label = createTag('label', { class: 'pt-label', for: 'pt-urls' }, 'Pages to track');
  const hint = createTag('p', { class: 'pt-hint' }, 'Paste page URLs (business.adobe.com or …aem.page), one per line — or drop a sheet below.');
  const fileInput = createTag('input', { type: 'file', accept: '.xlsx,.csv', class: 'pt-file' });
  const dropZone = createTag('div', { class: 'pt-drop', role: 'button', tabindex: '0' }, 'Drop an .xlsx or .csv here, or click to choose — we’ll pull the page URLs out for you');
  dropZone.append(fileInput);
  const dropStatus = createTag('p', { class: 'pt-drop-status' });
  const textarea = createTag('textarea', { id: 'pt-urls', class: 'pt-textarea', placeholder: PLACEHOLDER, inputmode: 'url' });
  const count = createTag('p', { class: 'pt-count' }, '0 URLs entered');

  const since = createTag('input', { type: 'date', class: 'pt-since' });
  const sinceLabel = createTag('label', { class: 'pt-since-label' }, 'Count from date ');
  sinceLabel.append(since);

  const view = { filter: 'all', sort: 'url', search: '', page: 1 };
  const toolbar = createTag('div', { class: 'pt-toolbar' });
  const filterSel = createTag('select', { class: 'pt-filter', 'aria-label': 'Filter by status' });
  fillSelect(filterSel, [['all', 'All statuses'], ['Draft', 'Draft'], ['Previewed', 'Previewed'], ['Live', 'Live']]);
  const sortSel = createTag('select', { class: 'pt-sort', 'aria-label': 'Sort by' });
  fillSelect(sortSel, [['url', 'Sort: URL'], ['status', 'Sort: Status'], ['lastPublish', 'Sort: Last published'], ['lastPreview', 'Sort: Last previewed']]);
  const searchInput = createTag('input', { type: 'search', class: 'pt-search', placeholder: 'Search URL…', 'aria-label': 'Search URL' });
  toolbar.append(filterSel, sortSel, searchInput);

  const resultsInit = createTag('p', { class: 'pt-muted' }, 'Results will appear here after you check status.');
  const results = createTag('div', { class: 'pt-results', 'aria-live': 'polite' }, resultsInit);

  block.append(
    header,
    label,
    hint,
    dropZone,
    dropStatus,
    textarea,
    count,
    sinceLabel,
    toolbar,
    results,
  );

  let rows = null;

  const updateCount = () => {
    const n = parseUrls(textarea.value).length;
    count.textContent = `${n} URL${n === 1 ? '' : 's'} entered`;
  };

  const rerender = () => {
    if (rows) renderResults(results, rows, since.value, view);
  };

  const updateView = (patch = {}) => { Object.assign(view, patch, { page: 1 }); rerender(); };

  const check = async () => {
    const inputs = parseUrls(textarea.value);
    if (inputs.length === 0 || checkBtn.disabled) return;
    const pairs = inputs.map((original) => ({ original, api: normalizeUrl(original) }));
    const uniqueApis = [...new Set(pairs.map((p) => p.api))];
    checkBtn.disabled = true;
    checkBtn.textContent = 'Checking…';
    results.replaceChildren(createTag('p', { class: 'pt-muted' }, 'Checking…'));
    try {
      const data = await client.post('/project-status', { urls: uniqueApis });
      const byApi = new Map(uniqueApis.map((api, i) => [api, data[i]]));
      rows = pairs.map(({ original, api }) => ({ ...(byApi.get(api) ?? {}), url: original }));
      view.page = 1;
      renderResults(results, rows, since.value, view);
    } catch (e) {
      rows = null;
      renderError(results, e.status, `Could not reach project-status (${e.message}).`);
    } finally {
      checkBtn.disabled = false;
      checkBtn.textContent = 'Check status';
    }
  };

  const loadFile = async (file) => {
    if (!file) return;
    dropZone.classList.add('pt-drop-busy');
    dropStatus.textContent = 'Reading sheet…';
    try {
      const { extractUrlsFromFile } = await import('./xlsx.js');
      const urls = await extractUrlsFromFile(file);
      if (!urls.length) {
        dropStatus.textContent = 'No trackable page URLs found in that file.';
        return;
      }
      textarea.value = urls.join('\n');
      updateCount();
      const plural = urls.length === 1 ? '' : 's';
      dropStatus.textContent = `Loaded ${urls.length} URL${plural} from ${file.name}.`;
    } catch (e) {
      dropStatus.textContent = `Could not read that file (${e.message}).`;
    } finally {
      dropZone.classList.remove('pt-drop-busy');
    }
  };

  fileInput.addEventListener('change', () => loadFile(fileInput.files[0]));
  dropZone.addEventListener('click', (e) => { if (e.target !== fileInput) fileInput.click(); });
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('pt-drop-over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('pt-drop-over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('pt-drop-over');
    loadFile(e.dataTransfer?.files?.[0]);
  });

  textarea.addEventListener('input', updateCount);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); }
  });
  checkBtn.addEventListener('click', check);
  onToken(() => check());
  since.addEventListener('change', () => updateView());
  filterSel.addEventListener('change', () => updateView({ filter: filterSel.value }));
  sortSel.addEventListener('change', () => updateView({ sort: sortSel.value }));
  searchInput.addEventListener('input', () => updateView({ search: searchInput.value }));
}
