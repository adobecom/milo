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
  if (row.site === null) return 'Unsupported';
  if (row.status) return row.status === 'Draft' ? 'No history found' : row.status;
  const published = row.published ?? (row.lastPublish != null);
  const previewed = row.previewed ?? (row.lastPreview != null);
  if (published) return 'Live';
  if (previewed) return 'Previewed';
  return 'No history found';
}

export const PREFLIGHT_PASS = 90;
export const PREFLIGHT_WARN = 70;

export function preflightTier(score) {
  if (score == null) return null;
  if (score >= PREFLIGHT_PASS) return 'pass';
  if (score >= PREFLIGHT_WARN) return 'warn';
  return 'fail';
}

export function computePreflightRollup(rows = []) {
  let checked = 0;
  let passing = 0;
  rows.forEach((r) => {
    const score = r.preflight?.score;
    if (score == null) return;
    checked += 1;
    if (score >= PREFLIGHT_PASS) passing += 1;
  });
  return { checked, passing, passingPct: pct(passing, checked) };
}

export function computeStatusCounts(rows = []) {
  let noHistory = 0;
  let previewed = 0;
  let live = 0;
  let unsupported = 0;
  rows.forEach((r) => {
    const s = deriveStatus(r);
    if (s === 'Live') live += 1;
    else if (s === 'Previewed') previewed += 1;
    else if (s === 'Unsupported') unsupported += 1;
    else noHistory += 1;
  });
  return { total: rows.length, noHistory, previewed, live, unsupported };
}
