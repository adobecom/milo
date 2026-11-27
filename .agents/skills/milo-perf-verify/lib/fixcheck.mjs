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
  return { k, was: dw, now: dn, limit: ln, outcome };
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
    if (y) return { key: x.key, type: x.type, outcome: 'persists', initiator: y.initiator, how: x.gates && !y.gates ? 'LCP no longer waits on it' : (y.gates ? 'LCP still waits on it' : null) };
    // Off the pre-LCP list. Still a new request overall means it moved past LCP; otherwise it is gone, or the
    // base makes it too (then it was only "new before LCP" because LCP moved).
    return { key: x.key, type: x.type, outcome: 'resolved', how: laterNow.has(x.key) ? 'now after LCP' : 'no longer new' };
  });
  for (const x of nAdded) if (!wasAdded.has(x.key)) out.push({ key: x.key, type: x.type, outcome: 'new', initiator: x.initiator, how: x.gates ? 'LCP waits on it' : null });
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

export function renderFixCheck(fc) {
  const L = [];
  const vps = Object.keys(fc.viewports);
  const { labels: lb } = fc;
  L.push(`## ${VICON[fc.verdict]} Fix check: ${fc.verdict.toUpperCase()}`);
  L.push('');
  L.push(`Was: ${lb.was || fc.meta.was.after.label} vs ${fc.meta.was.before.label}. Now: ${lb.now || fc.meta.now.after.label} vs ${fc.meta.now.before.label}. Federal ${federalOf(fc.meta.now)}.`);
  L.push('');
  L.push(`| |${vps.map((v) => ` ${cap(v)} |`).join('')}`);
  L.push(`|---|${vps.map(() => '---').join('|')}|`);
  L.push(`| Fix |${vps.map((v) => ` ${fc.viewports[v].outcome} |`).join('')}`);
  for (const [k, name, unit, dp] of METRICS) {
    const cells = vps.map((v) => {
      const m = fc.viewports[v].metrics.find((x) => x.k === k);
      return ` ${ICON[m.outcome]} ${fmtDelta(m.was, unit, dp)} → ${fmtDelta(m.now, unit, dp)} |`;
    });
    L.push(`| ${name} Δ |${cells.join('')}`);
  }
  L.push(`| New before LCP |${vps.map((v) => { const r = fc.viewports[v].requests; const c = (o) => r.filter((x) => x.outcome === o).length; return ` ${c('resolved')} resolved, ${c('persists')} persist, ${c('new')} new |`; }).join('')}`);
  L.push(`| Changed stacks |${vps.map((v) => ` ${fc.viewports[v].stacks.was} → ${fc.viewports[v].stacks.now} |`).join('')}`);
  if (vps.some((v) => fc.viewports[v].direct)) L.push(`| LCP Δ, flagged head → fix (one run) |${vps.map((v) => { const d = fc.viewports[v].direct; return ` ${d ? `${fmtDelta(d.delta, 'ms', 0)}${Math.abs(d.delta) <= d.limit ? ' (within noise)' : ''}` : '–'} |`; }).join('')}`);
  L.push('');
  L.push('Δ is the median after minus the base, in the run that measured it: was → now. ✅ resolved (within noise now), 🟡 smaller but still beyond noise, ❌ persists, 🆕 new.');
  L.push('');
  for (const v of vps) {
    const x = fc.viewports[v];
    const rows = x.requests.filter((r) => r.outcome !== 'unchanged');
    if (!rows.length && !x.baseDrift) continue;
    L.push(`### ${cap(v)}`);
    L.push('');
    for (const r of rows) L.push(`- ${ICON[r.outcome]} ${code(r.key)} (${r.type || '?'}): ${r.outcome}${r.how ? `, ${r.how}` : ''}${r.initiator && r.outcome !== 'resolved' ? `; started by ${code(r.initiator)}` : ''}`);
    if (x.baseDrift) L.push(`- The base's LCP median moved between the runs (${x.baseDrift.was} → ${x.baseDrift.now} ms); compare the deltas, not the absolute numbers.`);
    L.push('');
  }
  L.push('<details><summary>Method</summary>');
  L.push('');
  L.push('- Two milo-perf-verify runs against the same base: was (base vs the flagged head) and now (base vs the fix). Each delta is within its own interleaved run, so lab drift between the runs cancels.');
  L.push('- A finding is resolved when the now-delta is inside the same noise limit the verdict uses (`noiseLimit` in `lib/report.mjs`); partly when it shrank by more than that limit but is still beyond it.');
  L.push('- A request flagged new before LCP is resolved when the fix head no longer adds it before LCP; "now after LCP" means it is still requested, later.');
  if (fc.meta.direct) L.push('- The direct row is a third run, flagged head vs fix, interleaved: the fix measured against the code it replaces.');
  L.push('</details>');
  return `${L.join('\n')}\n`;
}
