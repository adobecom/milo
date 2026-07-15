import { createTag } from '../../../utils/utils.js';

const ROW_SEL = '.jira-tracker table tbody tr';
// Status buckets mirror the pill classes the jira-tracker block renders.
const STATUS_LABELS = [['Not Started', 'todo'], ['In Development', 'active'], ['Done', 'done']];

let activeName = null;
let activeStatus = null;

function assigneesOf(tr) {
  const cell = tr.querySelector('.jt-col-assignee');
  if (!cell) return [];
  return [...new Set([...cell.querySelectorAll('.jt-assignee')].map((e) => e.textContent.trim()).filter(Boolean))];
}

function bucketsOf(tr) {
  const set = new Set();
  tr.querySelectorAll('.jt-col-status .jt-pill').forEach((p) => {
    if (p.classList.contains('is-done')) set.add('done');
    else if (p.classList.contains('is-active')) set.add('active');
    else if (p.classList.contains('is-todo')) set.add('todo');
  });
  return set;
}

function applyFilter() {
  document.querySelectorAll(ROW_SEL).forEach((tr) => {
    const okName = !activeName || assigneesOf(tr).includes(activeName);
    const okStatus = !activeStatus || bucketsOf(tr).has(activeStatus);
    tr.classList.toggle('jt-hidden', !(okName && okStatus));
  });
  // Sections with no visible rows are hidden purely via CSS (:has), see the css.
}

function chip(text, value, active) {
  return createTag('button', {
    class: `jtf-chip${active ? ' is-active' : ''}`,
    type: 'button',
    'data-value': value || '',
    'aria-pressed': active ? 'true' : 'false',
  }, text);
}

function group(kind, label, items) {
  const g = createTag('div', { class: 'jtf-group', 'data-kind': kind, role: 'group', 'aria-label': label });
  g.append(createTag('span', { class: 'jtf-label' }, label));
  g.append(chip('All', null, true));
  items.forEach(([t, v]) => g.append(chip(t, v)));
  return g;
}

function countBy(fn) {
  const m = new Map();
  document.querySelectorAll(ROW_SEL).forEach((tr) => fn(tr).forEach((v) => m.set(v, (m.get(v) || 0) + 1)));
  return m;
}

function render(el) {
  const aCounts = countBy(assigneesOf);
  const sCounts = countBy(bucketsOf);
  const names = [...aCounts.keys()].sort((a, b) => a.localeCompare(b)).map((n) => [`${n} (${aCounts.get(n)})`, n]);
  const statuses = STATUS_LABELS.filter(([, b]) => sCounts.get(b)).map(([t, b]) => [`${t} (${sCounts.get(b)})`, b]);

  const box = createTag('div', { class: 'jtf-box' });
  box.append(group('assignee', 'Assignee', names));
  box.append(group('status', 'Status', statuses));
  el.textContent = '';
  el.append(box);

  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.jtf-chip');
    if (!btn) return;
    const g = btn.closest('.jtf-group');
    const kind = g.dataset.kind;
    const val = btn.dataset.value || null;
    if (kind === 'assignee') activeName = activeName === val ? null : val;
    else activeStatus = activeStatus === val ? null : val;
    const cur = kind === 'assignee' ? activeName : activeStatus;
    g.querySelectorAll('.jtf-chip').forEach((c) => {
      const on = (c.dataset.value || null) === cur;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyFilter();
  });
}

export default function init(el) {
  // Trackers may decorate after this block, so wait for at least one row.
  let tries = 0;
  const build = () => {
    if (!document.querySelector(ROW_SEL) && tries < 40) { tries += 1; setTimeout(build, 100); return; }
    render(el);
  };
  build();
}
