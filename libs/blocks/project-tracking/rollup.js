function counts(when, sinceMs) {
  if (!when) return false;
  if (sinceMs == null) return true;
  const t = new Date(when).getTime();
  return !Number.isNaN(t) && t >= sinceMs;
}

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

export function computeRollup(rows = [], { since } = {}) {
  const sinceTime = since != null ? new Date(since).getTime() : NaN;
  const sinceMs = Number.isNaN(sinceTime) ? null : sinceTime;

  const total = rows.length;
  let previewed = 0;
  let published = 0;
  rows.forEach((r) => {
    if (counts(r.lastPreview, sinceMs)) previewed += 1;
    if (counts(r.lastPublish, sinceMs)) published += 1;
  });

  return {
    total,
    previewed,
    published,
    previewedPct: pct(previewed, total),
    publishedPct: pct(published, total),
  };
}

export function deriveStatus(row = {}) {
  if (row.status) return row.status;
  const published = row.published ?? (row.lastPublish != null);
  const previewed = row.previewed ?? (row.lastPreview != null);
  if (published) return 'Live';
  if (previewed) return 'Previewed';
  return 'Draft';
}

export function computeStatusCounts(rows = []) {
  let draft = 0;
  let previewed = 0;
  let live = 0;
  rows.forEach((r) => {
    const s = deriveStatus(r);
    if (s === 'Live') live += 1;
    else if (s === 'Previewed') previewed += 1;
    else draft += 1;
  });
  return { total: rows.length, draft, previewed, live };
}
