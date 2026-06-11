import { createTag, loadStyle } from '../../utils/utils.js';
import { resolveContext, createClient, loadDaSdk } from '../milo-dashboard/api.js';
import { computeRollup } from './rollup.js';

const PLACEHOLDER = [
  'https://main--da-bacom--adobecom.aem.page/de/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/fr/some-campaign-page',
  'https://main--da-bacom--adobecom.aem.page/jp/some-campaign-page',
].join('\n');

// Split a pasted blob into trimmed, non-empty URL lines (newline- or comma-separated).
export function parseUrls(text) {
  return (text || '')
    .split(/\n|,/)
    .map((u) => u.trim())
    .filter(Boolean);
}

// Only render http(s) URLs as real links; anything else (javascript:, data:) → '#'.
const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '#');

function createStatusCell(when) {
  if (!when) return createTag('td', { class: 'pt-cell pt-empty' }, '—');
  const date = new Date(when).toLocaleDateString();
  const cell = createTag('td', { class: 'pt-cell pt-ok', title: when });
  cell.append(createTag('span', { class: 'pt-check' }, '✓'), ` ${date}`);
  return cell;
}

function createStatCard(label, pctValue, n, total, variant) {
  const card = createTag('div', { class: `pt-stat pt-stat--${variant}` });
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

function renderResults(mount, rows, since) {
  mount.replaceChildren();
  if (rows.length === 0) {
    mount.append(createTag('p', { class: 'pt-muted' }, 'No URLs to check.'));
    return;
  }
  const rollup = computeRollup(rows, { since: since || undefined });

  const stats = createTag('div', { class: 'pt-stats' });
  stats.append(
    createStatCard('Previewed', rollup.previewedPct, rollup.previewed, rollup.total, 'previewed'),
    createStatCard('Published', rollup.publishedPct, rollup.published, rollup.total, 'published'),
  );

  const table = createTag('table', { class: 'pt-table' });
  const headRow = createTag('tr');
  headRow.append(
    createTag('th', { scope: 'col' }, 'Page'),
    createTag('th', { scope: 'col' }, 'Previewed'),
    createTag('th', { scope: 'col' }, 'Published'),
  );
  table.append(createTag('thead', {}, headRow));
  const tbody = createTag('tbody');
  rows.forEach((r) => {
    const tr = createTag('tr');
    const href = safeUrl(r.url);
    const linkCell = createTag('td', { class: 'pt-cell pt-url' });
    linkCell.append(createTag('a', { class: 'pt-link', href, target: '_blank', rel: 'noopener noreferrer' }, r.url));
    tr.append(linkCell, createStatusCell(r.lastPreview), createStatusCell(r.lastPublish));
    tbody.append(tr);
  });
  table.append(tbody);

  mount.append(stats, createTag('div', { class: 'pt-table-wrap' }, table));
}

// 401 → not signed in (offer Adobe sign-in); 403 → signed in but lacks access;
// anything else → the raw reach/network message.
function renderError(mount, status, message) {
  mount.replaceChildren();
  if (status === 403) {
    const m = 'Not authorized: your account needs the statistics role on milo-core.';
    mount.append(createTag('p', { class: 'pt-error' }, m));
    return;
  }
  if (status === 401) {
    const m = 'Not signed in to Adobe. Sign in, then check again.';
    mount.append(createTag('p', { class: 'pt-error' }, m));
    if (window.adobeIMS?.signIn) {
      const btn = createTag('button', { type: 'button', class: 'pt-check-btn pt-signin' }, 'Sign in to Adobe');
      btn.addEventListener('click', () => window.adobeIMS.signIn());
      mount.append(btn);
    }
    return;
  }
  mount.append(createTag('p', { class: 'pt-error' }, message));
}

export default async function init(block) {
  await new Promise((resolve) => { loadStyle(import.meta.url.replace('.js', '.css'), resolve); });

  const ctx = await resolveContext(block, { loadDaSdk });
  const client = createClient(ctx);

  block.replaceChildren();

  const header = createTag('div', { class: 'pt-header' });
  const checkBtn = createTag('button', { type: 'button', class: 'pt-check-btn' }, 'Check status');
  header.append(createTag('h2', { class: 'pt-title' }, 'Project Tracking'), checkBtn);

  const label = createTag('label', { class: 'pt-label', for: 'pt-urls' }, 'Pages to track');
  const hint = createTag('p', { class: 'pt-hint' }, 'Paste one URL per line, then Check status.');
  const textarea = createTag('textarea', { id: 'pt-urls', class: 'pt-textarea', placeholder: PLACEHOLDER, inputmode: 'url' });
  const count = createTag('p', { class: 'pt-count' }, '0 URLs entered');

  const since = createTag('input', { type: 'date', class: 'pt-since' });
  const sinceLabel = createTag('label', { class: 'pt-since-label' }, 'Count from date ');
  sinceLabel.append(since);

  const resultsInit = createTag('p', { class: 'pt-muted' }, 'Results will appear here after you check status.');
  const results = createTag('div', { class: 'pt-results', 'aria-live': 'polite' }, resultsInit);

  block.append(header, label, hint, textarea, count, sinceLabel, results);

  let rows = null;

  const updateCount = () => {
    const n = parseUrls(textarea.value).length;
    count.textContent = `${n} URL${n === 1 ? '' : 's'} entered`;
  };

  const rerender = () => {
    if (rows) renderResults(results, rows, since.value);
  };

  const check = async () => {
    const urls = parseUrls(textarea.value);
    if (urls.length === 0 || checkBtn.disabled) return;
    checkBtn.disabled = true;
    checkBtn.textContent = 'Checking…';
    results.replaceChildren(createTag('p', { class: 'pt-muted' }, 'Checking…'));
    try {
      rows = await client.post('/page-status', { urls });
      renderResults(results, rows, since.value);
    } catch (e) {
      rows = null;
      renderError(results, e.status, `Could not reach page-status (${e.message}).`);
    } finally {
      checkBtn.disabled = false;
      checkBtn.textContent = 'Check status';
    }
  };

  textarea.addEventListener('input', updateCount);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); }
  });
  checkBtn.addEventListener('click', check);
  since.addEventListener('change', rerender);
}
