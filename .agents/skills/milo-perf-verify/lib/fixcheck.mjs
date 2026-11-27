// Review -> fix -> re-measure. Compares two milo-perf-verify reports that share a base: WAS (base vs the PR head
// the review flagged) and NOW (base vs the head with the fix). Every finding WAS flagged gets a measured outcome
// under the same noise limits the verdict uses (noiseLimit in report.mjs), and anything NOW flags that WAS did not
// is a new finding. Optionally a DIRECT report (flagged head vs fix head, one run) is folded in as corroboration.
import { metricDelta, noiseLimit } from './report.mjs';

const METRICS = [
  ['lcp', 'LCP', 'ms', 0], ['fcp', 'FCP', 'ms', 0], ['tbt', 'TBT', 'ms', 0],
  ['clsLoad', 'CLS during load', '', 3], ['clsScroll', 'CLS with scroll', '', 3],
];
const federalOf = (meta) => meta.federal ?? 'as-is'; // reports from before --federal measured as is

// Settings that change WHAT is measured must match; otherwise the two deltas are not comparable.
export function incompatibilities(was, now) {
  const r = [];
  if (federalOf(was.meta) !== federalOf(now.meta)) r.push(`federal mode differs (was ${federalOf(was.meta)}, now ${federalOf(now.meta)}): re-run one side with --federal ${federalOf(was.meta)}`);
  const blk = (m) => [...(m.block || [])].sort().join(',');
  if (blk(was.meta) !== blk(now.meta)) r.push(`blocked hosts differ (was ${blk(was.meta) || 'none'}, now ${blk(now.meta) || 'none'})`);
  const path = (m) => { try { const u = new URL(m.before.url); return u.pathname + u.search; } catch { return m.before.url; } };
  if (path(was.meta) !== path(now.meta)) r.push(`the page differs (was ${path(was.meta)}, now ${path(now.meta)})`);
  for (const vp of sharedViewports(was, now)) {
    if (was.meta.profiles?.[vp] !== now.meta.profiles?.[vp]) r.push(`${vp} profile differs`);
  }
  if (!sharedViewports(was, now).length) r.push('no viewport in common');
  return r;
}

export const sharedViewports = (was, now) => was.meta.viewports.filter((v) => now.meta.viewports.includes(v));

const fmtDelta = (x, unit, dp) => (x == null ? '–' : `${x > 0 ? '+' : ''}${x.toFixed(dp)}${unit ? ` ${unit}` : ''}`);

function metricOutcome(w, n, k) {
  const dw = metricDelta(w, k); const dn = metricDelta(n, k);
  const lw = noiseLimit(w, k); const ln = noiseLimit(n, k);
  const flaggedWas = dw > lw; const flaggedNow = dn > ln;
  let outcome = 'unchanged';
  if (flaggedWas && !flaggedNow) outcome = 'resolved';
  else if (flaggedWas && dn < dw - ln) outcome = 'partly';
  else if (flaggedWas) outcome = 'persists';
  else if (flaggedNow) outcome = 'new';
  return { k, was: dw, now: dn, limit: ln, outcome, base: n.metrics[k].before.median, fix: n.metrics[k].after.median };
}

// Reports from before the {federal} placeholder name federal's preview host in full; compare both spellings as one.
const canon = (k) => k.replace(/^https?:\/\/main--federal--adobecom\.aem\.(page|live)(?=\/)/, '{federal}');
const keyed = (list) => list.map((x) => ({ ...x, key: canon(x.key) }));

function requestOutcomes(w, n) {
  const nAdded = keyed(n.preLcp.added); const wAdded = keyed(w.preLcp.added);
  const nowAdded = new Map(nAdded.map((x) => [x.key, x]));
  const wasAdded = new Set(wAdded.map((x) => x.key));
  const laterNow = new Set([...keyed(n.requests.added).map((x) => x.key), ...keyed(n.preLcp.removed).filter((x) => x.alsoLater).map((x) => x.key)]);
  const out = wAdded.map((x) => {
    const y = nowAdded.get(x.key);
    // Still before LCP. If LCP waited on it before and does not now, the fix took it off the critical path.
    if (y) return { key: x.key, type: x.type, outcome: 'persists', initiator: y.initiator, block: y.from?.block || null, alsoLater: y.alsoLater, how: x.gates && !y.gates ? 'LCP no longer waits on it' : (y.gates ? 'LCP still waits on it' : null) };
    // Off the pre-LCP list. Still a new request overall means it moved past LCP; otherwise it is gone, or the
    // base makes it too (then it was only "new before LCP" because LCP moved).
    return { key: x.key, type: x.type, outcome: 'resolved', how: laterNow.has(x.key) ? 'now after LCP' : 'no longer new' };
  });
  for (const x of nAdded) if (!wasAdded.has(x.key)) out.push({ key: x.key, type: x.type, outcome: 'new', initiator: x.initiator, block: x.from?.block || null, alsoLater: x.alsoLater, how: x.gates ? 'LCP waits on it' : null });
  return out;
}

export function buildFixCheck({ was, now, direct = null, labels = {} }) {
  const viewports = {};
  for (const vp of sharedViewports(was, now)) {
    const w = was.viewports[vp]; const n = now.viewports[vp];
    const metrics = METRICS.map(([k]) => metricOutcome(w, n, k));
    const requests = requestOutcomes(w, n);
    const stacks = { was: w.stacks.length, now: n.stacks.length };
    const base = { was: w.metrics.lcp.before.median, now: n.metrics.lcp.before.median };
    // The base ran twice; if its LCP moved by more than the noise, say so (each delta is still within its own run).
    const baseDrift = Math.abs((base.now ?? 0) - (base.was ?? 0)) > noiseLimit(n, 'lcp') ? base : null;
    const d = direct?.viewports?.[vp];
    const directLcp = d ? { delta: metricDelta(d, 'lcp'), limit: noiseLimit(d, 'lcp'), findings: d.findings } : null;
    const all = [...metrics.filter((m) => m.outcome !== 'unchanged'), ...requests];
    const flagged = all.filter((x) => x.outcome !== 'new');
    const hasNew = all.some((x) => x.outcome === 'new');
    let outcome;
    if (!flagged.length) outcome = hasNew ? 'new findings' : 'nothing to fix';
    else if (flagged.every((x) => x.outcome === 'resolved')) outcome = hasNew ? 'resolved, with new findings' : 'resolved';
    else if (flagged.some((x) => x.outcome === 'resolved' || x.outcome === 'partly')) outcome = 'partly resolved';
    else outcome = 'not resolved';
    viewports[vp] = { metrics, requests, stacks, baseDrift, direct: directLcp, outcome, nowFindings: n.findings };
  }
  const outs = Object.values(viewports).map((v) => v.outcome);
  const anyNew = outs.some((o) => /new/.test(o));
  let verdict;
  if (outs.every((o) => o === 'nothing to fix')) verdict = 'nothing to fix';
  else if (outs.some((o) => o === 'partly resolved' || o === 'not resolved')) {
    verdict = outs.some((o) => o.startsWith('resolved') || o === 'partly resolved') ? 'partly effective' : 'not effective';
  } else if (outs.some((o) => o.startsWith('resolved'))) verdict = anyNew ? 'effective, with new findings' : 'effective';
  else verdict = 'new findings';
  return { kind: 'fixcheck', verdict, labels, meta: { was: was.meta, now: now.meta, direct: direct?.meta || null }, nowVerdict: now.verdict, viewports };
}

const ICON = { resolved: '✅', partly: '🟡', persists: '❌', new: '🆕', unchanged: '·' };
const VICON = { effective: '✅', 'effective, with new findings': '⚠️', 'partly effective': '🟡', 'not effective': '❌', 'new findings': '⚠️', 'nothing to fix': '✅' };
const code = (s) => `\`${String(s).replace(/`/g, "'")}\``;
const cap = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;

const fmt = (x, unit, dp) => (x == null ? '–' : `${x.toFixed(dp)}${unit ? ` ${unit}` : ''}`);
const short = (k) => k.split('?')[0].split('/').pop();
const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const sourceOf = (r) => (r.block ? `\`${r.block}\`` : /^parser/.test(r.initiator || '') ? 'the page markup' : 'other code');
// "`a` and `b` from `block`; `c` from the page markup"
const bySource = (rows) => {
  const m = new Map(); const seen = new Set();
  for (const r of rows) { const k = `\`${short(r.key)}\``; if (seen.has(k)) continue; seen.add(k); const s = sourceOf(r); m.set(s, new Set([...(m.get(s) || []), k])); }
  return [...m].map(([s, ks]) => `${list([...ks])} from ${s}`).join('; ');
};

// At most three one-sentence points, most severe first: what got worse, what is still open, what the fix resolved.
export function fixPoints(fc) {
  const vps = Object.keys(fc.viewports);
  const name = Object.fromEntries(METRICS.map(([k, n]) => [k, n]));
  const unit = Object.fromEntries(METRICS.map(([k, , u, dp]) => [k, [u, dp]]));
  const metricRows = (o) => vps.flatMap((v) => fc.viewports[v].metrics.filter((m) => o.includes(m.outcome)).map((m) => ({ ...m, vp: v })));
  // alsoLater: requested on both sides, before LCP only because LCP moved; an effect, not a finding to fix.
  const reqRows = (o) => vps.flatMap((v) => fc.viewports[v].requests.filter((r) => o.includes(r.outcome) && !r.alsoLater).map((r) => ({ ...r, vp: v })));
  const delta = (m, x) => fmtDelta(x, ...unit[m.k]);
  const byMetric = (rows) => [...new Set(rows.map((m) => m.k))].map((k) => rows.filter((m) => m.k === k));
  const points = [];
  const worse = metricRows(['new', 'persists']);
  if (worse.length) {
    const lead = byMetric(worse)[0];
    const verb = lead[0].outcome === 'new' ? 'got worse since the review' : 'are still worse than the base';
    points.push(`❌ ${list([...new Set(worse.map((m) => name[m.k]))])} ${verb}: ${name[lead[0].k]} ${list(lead.map((m) => `${delta(m, m.now)} on ${m.vp}`))}; find what the change put on the critical path.`);
  }
  const newReq = reqRows(['new']);
  if (newReq.length) points.push(`❌ New before LCP since the review: ${bySource(newReq)}; start ${newReq.length > 1 ? 'them' : 'it'} after LCP unless the first paint needs ${newReq.length > 1 ? 'them' : 'it'}.`);
  const open = reqRows(['persists']);
  if (open.length) {
    const waits = open.some((r) => /still waits/.test(r.how || ''));
    points.push(`🟡 Still requested before LCP: ${bySource(open)} (${list([...new Set(open.map((r) => r.vp))])}); ${waits ? 'LCP still waits on them, so stop awaiting them before the block renders' : 'LCP no longer waits on them, but starting them after LCP would clear this finding'}.`);
  }
  const partly = metricRows(['partly']);
  if (partly.length) { const g = byMetric(partly)[0]; points.push(`🟡 ${list([...new Set(partly.map((m) => name[m.k]))])} improved but still over the base: ${name[g[0].k]} ${list(g.map((m) => `${delta(m, m.was)} → ${delta(m, m.now)} on ${m.vp}`))}.`); }
  const fixed = metricRows(['resolved']);
  if (fixed.length) {
    const lead = byMetric(fixed)[0];
    const names = [...new Set(fixed.map((m) => name[m.k]))];
    points.push(`✅ ${list(names)} regression fixed: at the review ${list(lead.map((m) => `${delta(m, m.was)} on ${m.vp}`))} over the base, now ${list(lead.map((m) => delta(m, m.now)))}.`);
  }
  if (!points.length) points.push('✅ Nothing was flagged and nothing new is flagged.');
  // Keep the resolved point last when trimming, so the reader sees both what is left and what worked.
  if (points.length > 3) { const ok = points.filter((p) => p.startsWith('✅')); return [...points.filter((p) => !p.startsWith('✅')).slice(0, 3 - ok.length), ...ok].slice(0, 3); }
  return points;
}

export function renderFixCheck(fc) {
  const L = [];
  const vps = Object.keys(fc.viewports);
  const { labels: lb } = fc;
  L.push(`## ${VICON[fc.verdict]} Fix check: ${fc.verdict.toUpperCase()}`);
  L.push('');
  L.push(`Before: ${fc.meta.now.before.label}. After: ${lb.now || fc.meta.now.after.label} (the fix). Reviewed head: ${lb.was || fc.meta.was.after.label}.`);
  L.push('');
  L.push(`| |${vps.map((v) => ` ${cap(v)} |`).join('')}`);
  L.push(`|---|${vps.map(() => '---').join('|')}|`);
  for (const [k, n, unit, dp] of METRICS.filter(([k]) => k !== 'clsScroll')) {
    L.push(`| ${k === 'clsLoad' ? 'CLS' : n} |${vps.map((v) => { const m = fc.viewports[v].metrics.find((x) => x.k === k); return ` ${fmt(m.base, unit, dp)} → ${fmt(m.fix, unit, dp)} |`; }).join('')}`);
  }
  L.push('');
  L.push(...fixPoints(fc).map((p) => `- ${p}`));
  L.push('');
  L.push(`<sub>Medians of ${fc.meta.now.runs} interleaved cold loads per side, before → after. Federal ${federalOf(fc.meta.now)}. Per-request detail in fixcheck.json.</sub>`);
  return `${L.join('\n')}\n`;
}
