import { createTag } from '../../../utils/utils.js';

const COLUMNS = [
  { key: 'site', label: 'Project', type: 'text' },
  { key: 'publishes', label: 'Publishes', type: 'number' },
  { key: 'previews', label: 'Previews', type: 'number' },
  { key: 'avg_health', label: 'Health', type: 'health' },
  { key: 'checks', label: 'Checks', type: 'number' },
];

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

function formatHealth(value) {
  const num = toNumber(value);
  return num === null ? '—' : num.toFixed(1);
}

function compareRows(a, b, column, direction) {
  const dir = direction === 'asc' ? 1 : -1;
  if (column.type === 'text') {
    return a[column.key].localeCompare(b[column.key]) * dir;
  }
  const av = toNumber(a[column.key]);
  const bv = toNumber(b[column.key]);
  if (av === null && bv === null) return 0;
  if (av === null) return 1;
  if (bv === null) return -1;
  return (av - bv) * dir;
}

export default function renderProjectTable(container, projectRows, onSelect) {
  let sortKey = 'publishes';
  let sortDir = 'desc';

  function render() {
    container.replaceChildren();
    const column = COLUMNS.find((c) => c.key === sortKey);
    const sorted = [...projectRows].sort((a, b) => compareRows(a, b, column, sortDir));

    const headerCells = COLUMNS.map((col) => {
      const th = createTag('th', null, col.label);
      if (col.key === sortKey) th.classList.add(sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
      th.addEventListener('click', () => {
        if (sortKey === col.key) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey = col.key;
          sortDir = col.type === 'text' ? 'asc' : 'desc';
        }
        render();
      });
      return th;
    });
    const thead = createTag('thead', null, createTag('tr', null, headerCells));

    const bodyRows = sorted.map((row) => {
      const cells = COLUMNS.map((col) => {
        if (col.type === 'health') return createTag('td', null, formatHealth(row[col.key]));
        if (col.type === 'number') return createTag('td', null, String(toNumber(row[col.key]) ?? ''));
        return createTag('td', null, row[col.key]);
      });
      const tr = createTag('tr', { class: 'project-row', 'data-site': row.site }, cells);
      tr.addEventListener('click', () => { if (onSelect) onSelect(row.site); });
      return tr;
    });
    const tbody = createTag('tbody', null, bodyRows);

    container.append(createTag('table', { class: 'project-table' }, [thead, tbody]));
  }

  render();
}
