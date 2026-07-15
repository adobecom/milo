import { decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const JIRA_BASE = 'https://jira.corp.adobe.com/browse/';
const KEY_RE = /\b[A-Z][A-Z0-9]+-\d+\b/g;
const PR_RE = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/(\d+)/i;
const STATE_RE = /\b(open|merged|closed|draft)\b/i;

// Status buckets by keyword (case-insensitive substring), checked green → blue
// → red, so variants map sensibly (e.g. "Ready to Deploy" → deploy → green,
// "In Code Review" → review → blue). Anything unmatched is treated as
// not-being-worked-on (red).
const DONE_HINTS = ['done', 'resolved', 'closed', 'complete', 'deploy', 'ship', 'live', 'release', 'verified', 'merged'];
const ACTIVE_HINTS = ['develop', 'progress', 'review', 'qa', 'analy', 'implement', 'testing', 'building'];
const PR_STATE = {
  open: 'is-open', merged: 'is-merged', closed: 'is-closed', draft: 'is-prdraft',
};

const COLS = {
  block: 'block', ticket: 'block', item: 'block',
  assignee: 'assignee', notes: 'notes', status: 'status', jira: 'status',
};

const norm = (s) => (s || '').toLowerCase().trim();
const muted = () => createTag('span', { class: 'jt-muted' }, '—');

function bucket(status) {
  const s = norm(status);
  if (DONE_HINTS.some((k) => s.includes(k))) return 'is-done';
  if (ACTIVE_HINTS.some((k) => s.includes(k))) return 'is-active';
  return 'is-todo';
}

function keyChip(k, small) {
  return createTag('a', {
    class: small ? 'jt-key-sm' : 'jt-key', href: `${JIRA_BASE}${k}`, target: '_blank', rel: 'noopener',
  }, k);
}

function labelOf(p) {
  const strong = p.querySelector('strong');
  return strong ? norm(strong.textContent).replace(':', '') : '';
}

function restText(p, strong) {
  let rest = '';
  p.childNodes.forEach((n) => { if (n !== strong) rest += n.textContent; });
  return rest.trim();
}

function renderStatusLine(p) {
  const strong = p.querySelector('strong');
  const rest = restText(p, strong);
  p.textContent = '';
  if (strong) p.append(strong, ' ');
  rest.split(';').map((s) => s.trim()).filter(Boolean).forEach((seg) => {
    const m = seg.match(/^([A-Z][A-Z0-9]+-\d+):\s*(.+)$/);
    const key = m?.[1];
    const st = (m ? m[2] : seg).trim();
    const item = createTag('span', { class: 'jt-status-item' });
    if (key) item.append(keyChip(key, true));
    item.append(createTag('span', { class: `jt-pill ${bucket(st)}` }, st));
    p.append(item);
  });
}

function renderPrLine(p) {
  const strong = p.querySelector('strong');
  const rest = restText(p, strong);
  p.textContent = '';
  if (strong) p.append(strong, ' ');
  const m = rest.match(PR_RE);
  if (!m) { p.append(document.createTextNode(rest || '—')); return; }
  const state = rest.match(STATE_RE)?.[1]?.toLowerCase();
  p.append(createTag('a', {
    class: 'jt-pr', href: m[0], target: '_blank', rel: 'noopener',
  }, `#${m[1]}`));
  if (state) p.append(createTag('span', { class: `jt-badge ${PR_STATE[state] || ''}` }, state));
}

function decorateStatusCell(td) {
  if (!td.textContent.trim()) { td.textContent = ''; td.append(muted()); return; }
  let ps = [...td.querySelectorAll(':scope > p')];
  if (!ps.length) {
    // EDS unwraps single-paragraph cells, so re-wrap the content into one line.
    const p = createTag('p');
    p.append(...td.childNodes);
    td.append(p);
    ps = [p];
  }
  td.classList.add('jt-jira');
  ps.forEach((p) => {
    const l = labelOf(p);
    if (l === 'status') renderStatusLine(p);
    else if (l === 'pr') renderPrLine(p);
  });
}

function decorateBlockCell(td) {
  const raw = td.textContent;
  const keys = raw.match(KEY_RE) || [];
  const name = raw.replace(/https?:\/\/\S+/g, '').replace(KEY_RE, '').replace(/\s+/g, ' ').trim();
  td.textContent = '';
  td.append(createTag('span', { class: 'jt-block-name' }, name || '—'));
  if (keys.length) {
    const wrap = createTag('div', { class: 'jt-keys' });
    keys.forEach((k) => wrap.append(keyChip(k, false)));
    td.append(wrap);
  }
}

function decorateAssigneeCell(td) {
  const raw = td.textContent.trim();
  td.textContent = '';
  if (!raw || raw === 'N/A' || raw === '???') { td.append(createTag('span', { class: 'jt-muted' }, raw || '—')); return; }
  raw.split(/[,/]/).map((s) => s.replace(/^@/, '').trim()).filter(Boolean)
    .forEach((n) => td.append(createTag('span', { class: 'jt-assignee' }, n)));
}

function applyColumn(td, col) {
  if (col === 'block') decorateBlockCell(td);
  else if (col === 'assignee') decorateAssigneeCell(td);
  else if (col === 'status') decorateStatusCell(td);
  else if (col === 'notes') td.classList.add('jt-notes');
}

function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;
  const headCells = [...rows[0].children].map((c) => c.textContent.trim());
  const colKeys = headCells.map((h) => COLS[norm(h)] || norm(h));

  const table = createTag('table', { class: 'jt-table' });
  const thead = createTag('thead');
  const htr = createTag('tr');
  headCells.forEach((h) => htr.append(createTag('th', { scope: 'col' }, h)));
  thead.append(htr);

  const tbody = createTag('tbody');
  rows.slice(1).forEach((r) => {
    const tr = createTag('tr');
    [...r.children].forEach((cell, i) => {
      const td = createTag('td', { class: `jt-col-${colKeys[i] || i}` });
      td.dataset.label = headCells[i] || '';
      td.append(...cell.childNodes);
      applyColumn(td, colKeys[i]);
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(thead, tbody);
  block.textContent = '';
  block.append(createTag('div', { class: 'jt-scroll' }, table));
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
