// Pure rollup logic for GWP Project Tracking. A page "counts" as previewed/
// published if it has that event timestamp and — when a start-tracking date is
// given — the event is on/after it. The denominator is always the total pasted
// links (locked scope: "% of the copied links").
function counts(when, sinceMs) {
  if (!when) return false;
  if (sinceMs == null) return true;
  const t = new Date(when).getTime();
  return !Number.isNaN(t) && t >= sinceMs;
}

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

// eslint-disable-next-line import/prefer-default-export
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
