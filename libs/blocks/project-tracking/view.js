import { deriveStatus } from './rollup.js';

const STATUS_RANK = { Draft: 0, Previewed: 1, Live: 2 };
const ts = (v) => (v ? (new Date(v).getTime() || 0) : 0);

export function applyView(rows = [], { filter = 'all', search = '', sort = 'url' } = {}) {
  const q = search.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    const statusOk = filter === 'all' || deriveStatus(r) === filter;
    const searchOk = !q || (r.url || '').toLowerCase().includes(q);
    return statusOk && searchOk;
  });
  const sorters = {
    url: (a, b) => (a.url || '').localeCompare(b.url || ''),
    status: (a, b) => STATUS_RANK[deriveStatus(a)] - STATUS_RANK[deriveStatus(b)],
    lastPreview: (a, b) => ts(b.lastPreview) - ts(a.lastPreview),
    lastPublish: (a, b) => ts(b.lastPublish) - ts(a.lastPublish),
  };
  return [...filtered].sort(sorters[sort] || sorters.url);
}
