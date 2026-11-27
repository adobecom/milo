// Turns interleaved runs into a per-viewport before/after comparison and a verdict.
const median = (xs) => { const s = xs.filter((x) => x != null).sort((p, q) => p - q); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const quant = (xs, q) => { const s = xs.filter((x) => x != null).sort((p, r) => p - r); if (!s.length) return null; const i = (s.length - 1) * q; const lo = Math.floor(i); return s[lo] + (s[Math.ceil(i)] - s[lo]) * (i - lo); };
const iqr = (xs) => { const a = quant(xs, 0.75); const b = quant(xs, 0.25); return a == null ? 0 : a - b; };
const stat = (xs) => ({ median: median(xs), min: xs.length ? Math.min(...xs.filter((x) => x != null)) : null, max: xs.length ? Math.max(...xs.filter((x) => x != null)) : null, iqr: iqr(xs), n: xs.filter((x) => x != null).length });
const STABLE = 0.5;

const sigOf = (stack) => stack.slice(0, 3).map((f) => `${f.fn}@${f.url}`).join(' <- ') || '(parser)';
// The initiator as a person would say it: the JS stack, else what kind of load and from which file.
const initOf = (q) => (q.initiator.stack.length ? sigOf(q.initiator.stack)
  : `${q.initiator.type || 'parser'}${q.initiator.url ? ` from ${q.initiator.url}` : ''}`);

// Frequency of each key across runs; value = share of runs it appears in.
function freq(runs, keysOf) {
  const m = new Map();
  for (const r of runs) for (const k of new Set(keysOf(r))) m.set(k, (m.get(k) || 0) + 1);
  return new Map([...m].map(([k, c]) => [k, c / runs.length]));
}

function diffSets(fb, fa) {
  const added = []; const removed = [];
  for (const [k, f] of fa) if (f >= STABLE && (fb.get(k) || 0) < STABLE) added.push({ key: k, before: fb.get(k) || 0, after: f });
  for (const [k, f] of fb) if (f >= STABLE && (fa.get(k) || 0) < STABLE) removed.push({ key: k, before: f, after: fa.get(k) || 0 });
  return { added, removed };
}

function mostCommon(values) {
  const m = new Map(); for (const v of values) m.set(v, (m.get(v) || 0) + 1);
  return [...m].sort((p, q) => q[1] - p[1])[0]?.[0] ?? null;
}

// What the fix suggestions rest on, per new pre-LCP request: when it ends relative to LCP, which block
// code started it (outermost block frame), and whether it needs its own connection.
const GATE_MS = 120;
const blockOf = (q) => {
  const frames = [...q.initiator.stack].reverse().filter((f) => /\/blocks\/[^/]+\//.test(f.url || ''));
  const f = frames[0] || (/\/blocks\/[^/]+\//.test(q.initiator.url || '') ? { fn: null, url: q.initiator.url } : null);
  return f ? { block: f.url.match(/\/blocks\/([^/]+)\//)[1], fn: f.fn && f.fn !== '(anonymous)' ? f.fn : null } : null;
};
function evidenceOf(runs, key) {
  const hits = runs.map((r) => ({ r, q: r.requests.find((q) => q.norm === key && q.preLcp) })).filter((h) => h.q && h.r.lcp?.t != null);
  const gaps = hits.map(({ r, q }) => r.lcp.t - q.endMs);
  const q0 = hits[0]?.q;
  const host = /^https?:\/\//.test(key) ? new URL(key).host : null;
  const federal = key.startsWith('{federal}') || (!!host && /^main--federal--adobecom\.aem\.(page|live)$/.test(host));
  return {
    endMs: median(hits.map((h) => h.q.endMs)),
    lcpGapMs: median(gaps),
    // Only code can await a request; a parser-loaded image that happens to end near LCP is not a gate.
    gates: !!q0?.initiator.stack.length && gaps.filter((g) => g >= 0 && g <= GATE_MS).length >= STABLE * runs.length,
    from: q0 ? blockOf(q0) : null,
    host,
    federal,
  };
}

function compareViewport(B, A) {
  const metric = (fn) => ({ before: stat(B.map(fn)), after: stat(A.map(fn)) });
  const pre = (r) => r.requests.filter((q) => q.preLcp);
  const m = {
    lcp: metric((r) => r.lcp?.t ?? null),
    fcp: metric((r) => r.fcp),
    clsLoad: metric((r) => r.cls.load),
    clsScroll: metric((r) => r.cls.withScroll),
    tbt: metric((r) => r.tbt),
    preLcpRequests: metric((r) => pre(r).length),
    preLcpKB: metric((r) => Math.round(pre(r).reduce((s, q) => s + q.bytes, 0) / 1024)),
    requests: metric((r) => r.requests.length),
    totalKB: metric((r) => Math.round(r.requests.reduce((s, q) => s + q.bytes, 0) / 1024)),
    longTasks: metric((r) => r.longTasks.length),
  };
  const preDiff = diffSets(freq(B, (r) => pre(r).map((q) => q.norm)), freq(A, (r) => pre(r).map((q) => q.norm)));
  const allDiff = diffSets(freq(B, (r) => r.requests.map((q) => q.norm)), freq(A, (r) => r.requests.map((q) => q.norm)));
  const fbAll = freq(B, (r) => r.requests.map((q) => q.norm)); const faAll = freq(A, (r) => r.requests.map((q) => q.norm));
  // How each new pre-LCP request was started, so the writeup can name the code path.
  const firstWith = (runs, key) => runs.flatMap((r) => r.requests).find((q) => q.norm === key);
  const bytesOf = (runs, key) => median(runs.flatMap((r) => r.requests.filter((q) => q.norm === key).map((q) => q.bytes)));
  const describe = (x, runs) => {
    const q = firstWith(runs, x.key);
    x.initiator = q ? initOf(q) : null; x.type = q?.type; x.bytes = bytesOf(runs, x.key);
  };
  preDiff.added.forEach((x) => describe(x, A)); preDiff.removed.forEach((x) => describe(x, B));
  preDiff.added.forEach((x) => Object.assign(x, evidenceOf(A, x.key)));
  // A gate only matters where LCP actually got later; elsewhere a near miss is a coincidence.
  const lcpRose = metricDelta({ metrics: m }, 'lcp') > noiseLimit({ metrics: m }, 'lcp');
  preDiff.added.forEach((x) => { x.gates = x.gates && lcpRose; });
  // A renamed or moved file is not a new request: pair an added with a removed one of the same type that has
  // the same file name, or the same (non-parser) initiator and about the same size.
  const base = (k) => k.split('?')[0].split('/').pop();
  preDiff.moved = [];
  for (const x of [...preDiff.added]) {
    const y = preDiff.removed.find((r) => r.type === x.type && (base(r.key) === base(x.key)
      || (/@/.test(x.initiator || '') && r.initiator === x.initiator && Math.abs((r.bytes || 0) - (x.bytes || 0)) <= Math.max(200, 0.05 * (r.bytes || 0)))));
    if (!y) continue;
    preDiff.moved.push({ from: y.key, to: x.key, type: x.type, bytesBefore: y.bytes, bytesAfter: x.bytes, initiator: x.initiator });
    preDiff.added.splice(preDiff.added.indexOf(x), 1); preDiff.removed.splice(preDiff.removed.indexOf(y), 1);
  }
  // Moved across the LCP line: requested in both, but pre-LCP on one side only.
  for (const list of [preDiff.added, preDiff.removed]) for (const x of list) x.alsoLater = (fbAll.get(x.key) || 0) >= STABLE && (faAll.get(x.key) || 0) >= STABLE;

  // Initiator stacks of requests both sides make: did the code path that starts them change?
  const stacks = [];
  for (const [k, f] of fbAll) {
    if (f < STABLE || (faAll.get(k) || 0) < STABLE) continue;
    const sb = mostCommon(B.flatMap((r) => r.requests.filter((q) => q.norm === k).map((q) => sigOf(q.initiator.stack))));
    const sa = mostCommon(A.flatMap((r) => r.requests.filter((q) => q.norm === k).map((q) => sigOf(q.initiator.stack))));
    if (sb !== sa) stacks.push({ key: k, before: sb, after: sa });
  }
  const commonCount = [...fbAll].filter(([k, f]) => f >= STABLE && (faAll.get(k) || 0) >= STABLE).length;

  // Long-task work per script/step, averaged per run.
  const work = (runs) => { const m2 = new Map(); for (const r of runs) for (const t of r.longTasks) for (const w of t.top) m2.set(w.key, (m2.get(w.key) || 0) + w.ms / runs.length); return m2; };
  const wb = work(B); const wa = work(A);
  const tasks = [...new Set([...wb.keys(), ...wa.keys()])]
    .map((k) => ({ key: k, before: Math.round(wb.get(k) || 0), after: Math.round(wa.get(k) || 0) }))
    .map((x) => ({ ...x, delta: x.after - x.before }))
    .filter((x) => Math.abs(x.delta) >= 15)
    .sort((p, q) => Math.abs(q.delta) - Math.abs(p.delta)).slice(0, 8);

  // Layout-shift sources, averaged score per run.
  const src = (runs) => { const m2 = new Map(); for (const r of runs) for (const s of r.shifts) for (const so of s.sources.length ? s.sources : [{ el: '(unknown)' }]) { const k = `${so.el} [${s.phase}]`; m2.set(k, (m2.get(k) || 0) + s.value / Math.max(1, s.sources.length) / runs.length); } return m2; };
  const sb = src(B); const sa = src(A);
  const shiftSources = [...new Set([...sb.keys(), ...sa.keys()])]
    .map((k) => ({ key: k, before: Number((sb.get(k) || 0).toFixed(4)), after: Number((sa.get(k) || 0).toFixed(4)) }))
    .filter((x) => x.before >= 0.001 || x.after >= 0.001)
    .sort((p, q) => q.after - p.after);

  const lcpEl = { before: mostCommon(B.map((r) => r.lcp?.el)), after: mostCommon(A.map((r) => r.lcp?.el)) };
  const lcpRect = { before: B.find((r) => r.lcp?.el === lcpEl.before)?.lcp?.rect || null, after: A.find((r) => r.lcp?.el === lcpEl.after)?.lcp?.rect || null };
  const errors = [...B, ...A].filter((r) => r.navError || r.traceError).map((r) => `${r.side} #${r.run + 1}: ${r.navError || r.traceError}`);
  return { metrics: m, preLcp: preDiff, requests: allDiff, stacks, commonCount, tasks, shiftSources, lcpEl, lcpRect, errors };
}

// The smallest median delta that counts as a change, per metric: a floor, a share of the base, or the spread.
// judge() and the fix check (fixcheck.mjs) both use it, so "resolved" means the same as "not flagged".
export const metricDelta = (v, k) => (v.metrics[k].after.median ?? 0) - (v.metrics[k].before.median ?? 0);
export function noiseLimit(v, k) {
  const noise = Math.max(v.metrics[k].before.iqr, v.metrics[k].after.iqr);
  const base = v.metrics[k].before.median || 0;
  if (k === 'clsLoad' || k === 'clsScroll') return Math.max(0.01, noise);
  if (k === 'tbt') return Math.max(30, 0.1 * base, noise);
  return Math.max(100, 0.05 * base, noise); // lcp, fcp
}

function judge(v) {
  const findings = [];
  const d = (k) => metricDelta(v, k);
  for (const k of ['clsLoad', 'clsScroll']) {
    const delta = d(k); const lim = noiseLimit(v, k);
    if (delta > lim) findings.push({ level: 'regression', what: `CLS ${k === 'clsLoad' ? 'during load' : 'with scroll'} +${delta.toFixed(3)}` });
    else if (delta < -lim) findings.push({ level: 'improvement', what: `CLS ${k === 'clsLoad' ? 'during load' : 'with scroll'} ${delta.toFixed(3)}` });
  }
  {
    const delta = d('tbt'); const lim = noiseLimit(v, 'tbt');
    if (delta > lim) findings.push({ level: 'regression', what: `TBT +${Math.round(delta)} ms` });
    else if (delta < -lim) findings.push({ level: 'improvement', what: `TBT ${Math.round(delta)} ms` });
  }
  {
    const delta = d('lcp'); const lim = noiseLimit(v, 'lcp');
    if (delta > lim) findings.push({ level: 'watch', what: `LCP +${Math.round(delta)} ms` });
    else if (delta < -lim) findings.push({ level: 'improvement', what: `LCP ${Math.round(delta)} ms` });
  }
  if (v.preLcp.added.length) findings.push({ level: 'regression', what: `${v.preLcp.added.length} new request(s) before LCP` });
  if (v.preLcp.removed.length) findings.push({ level: 'improvement', what: `${v.preLcp.removed.length} fewer request(s) before LCP` });
  if (v.preLcp.moved.length) findings.push({ level: 'info', what: `${v.preLcp.moved.length} renamed/moved` });
  if (v.lcpEl.before !== v.lcpEl.after) findings.push({ level: 'watch', what: 'LCP element changed' });
  if (v.errors.length) findings.push({ level: 'watch', what: `${v.errors.length} run error(s)` });
  return findings;
}

export function buildReport(all) {
  const viewports = {};
  for (const vp of all.meta.viewports) {
    const B = all.runs.filter((r) => r.profile === vp && r.side === 'before');
    const A = all.runs.filter((r) => r.profile === vp && r.side === 'after');
    const v = compareViewport(B, A);
    v.findings = judge(v);
    viewports[vp] = v;
  }
  const levels = Object.values(viewports).flatMap((v) => v.findings.map((f) => f.level));
  const verdict = levels.includes('regression') ? 'regression' : levels.includes('watch') ? 'watch' : 'pass';
  const summary = Object.entries(viewports).map(([vp, v]) => `${vp}: ${v.findings.map((f) => f.what).join(', ') || 'no change beyond noise'}`).join('; ');
  return { meta: all.meta, verdict, summary, viewports };
}

const fmt = (s, unit = '', dp = 0) => (s.median == null ? '–' : `${s.median.toFixed(dp)}${unit}`);
const rng = (s, dp = 0) => (s.median == null ? '' : ` <sub>${s.min.toFixed(dp)}–${s.max.toFixed(dp)}</sub>`);
const delta = (b, a, unit = '', dp = 0) => {
  if (b.median == null || a.median == null) return '–';
  const x = a.median - b.median; if (Math.abs(x) < 10 ** -dp / 2) return '±0';
  return `${x > 0 ? '+' : ''}${x.toFixed(dp)}${unit}`;
};
const code = (s) => `\`${String(s).replace(/`/g, "'")}\``;
const ICON = { pass: '✅', watch: '⚠️', regression: '❌' };

// The per-viewport verdict row (with its header), shared by report.md and the top of the PR comment.
export function verdictTable(r) {
  const { meta } = r;
  const L = [];
  L.push(`|${meta.viewports.map((v) => ` ${v[0].toUpperCase()}${v.slice(1)} |`).join('')}`.replace(/^\|/, '| |'));
  L.push(`|---|${meta.viewports.map(() => '---').join('|')}|`);
  L.push(`| Verdict |${meta.viewports.map((v) => { const f = r.viewports[v].findings; const lv = f.some((x) => x.level === 'regression') ? 'regression' : f.some((x) => x.level === 'watch') ? 'watch' : 'pass'; const bad = f.filter((x) => x.level !== 'improvement').map((x) => x.what).join('; '); const good = f.filter((x) => x.level === 'improvement').map((x) => x.what).join('; '); return ` ${ICON[lv]} ${[bad, good && (bad ? `better: ${good}` : good)].filter(Boolean).join('. ') || 'no change beyond noise'}`; }).join(' |')} |`);
  return L;
}

// Fix suggestions from the evidence only: a request LCP lands right after, the block code that started it,
// a cross-origin host, a shift source, a script whose long-task time grew. Advice, not a finding.
export function suggestFixes(r) {
  const vps = r.meta.viewports.map((vp) => [vp, r.viewports[vp]]);
  const out = [];
  const byKey = new Map();
  // alsoLater: requested on both sides, only now before LCP; a consequence of a later LCP, not a cause.
  for (const [vp, v] of vps) for (const x of v.preLcp.added.filter((y) => !y.alsoLater)) {
    const e = byKey.get(x.key) || { x, vps: [], gated: [] };
    e.vps.push(vp); if (x.gates) e.gated.push(`${vp} ${Math.round(x.lcpGapMs)} ms`);
    byKey.set(x.key, e);
  }
  const where = (x) => (x.from ? ` started by the ${code(x.from.block)} block${x.from.fn ? ` in ${code(x.from.fn)}` : ''}` : '');
  const gating = [...byKey.values()].filter((e) => e.gated.length);
  for (const { x, gated } of gating) {
    out.push(`- **LCP waits on ${code(x.key)}**${where(x)}: LCP lands within ${GATE_MS} ms of it finishing (${gated.join(', ')} after). `
      + 'If it is not part of the LCP element, don\'t await it before the block renders: render the markup first and let it fill in afterwards (no `await` on it in `init`), reserving its box so nothing shifts.');
  }
  const blocks = new Map();
  for (const e of byKey.values()) if (!e.gated.length && e.x.from) blocks.set(e.x.from.block, [...(blocks.get(e.x.from.block) || []), e.x]);
  for (const [block, xs] of blocks) {
    out.push(`- **${code(block)} adds ${xs.length} request(s) before LCP** that LCP does not wait on (${xs.map((x) => code(x.key)).join(', ')}). `
      + 'If they are not needed for the first paint, start them later: `await import()` on demand, after LCP, or from `delayed.js`; lazy-load images below the fold.');
  }
  const fedAsIs = r.meta.federal !== 'same-origin';
  const fed = fedAsIs && [...byKey.values()].some((e) => e.x.federal);
  const cross = [...new Set([...byKey.values()].filter((e) => !e.x.federal).map((e) => e.x.host).filter(Boolean))];
  if (cross.length) out.push(`- **Preconnect** helps only for new cross-origin hosts: ${cross.map(code).join(', ')}. Same-origin requests already reuse the connection.`);
  if (fed) out.push(`- Federal (\`main--federal--adobecom.aem.*\`) is cross-origin only off production: there federal content comes from the page's own origin, so a preconnect won't help. Re-run with \`--federal same-origin\` to measure that.`);
  for (const [vp, v] of vps) {
    for (const k of ['clsLoad', 'clsScroll']) {
      if (metricDelta(v, k) <= noiseLimit(v, k)) continue;
      const s = v.shiftSources.find((y) => y.after > y.before);
      out.push(`- **CLS on ${vp}**${s ? `: ${code(s.key)} moves` : ''}. Reserve its space (\`aspect-ratio\`, \`min-height\`, a fixed icon box) or insert the content below the fold.`);
    }
    if (metricDelta(v, 'tbt') > noiseLimit(v, 'tbt')) {
      const t = v.tasks.find((y) => y.delta > 0);
      out.push(`- **TBT on ${vp}**${t ? `: ${code(t.key)} +${t.delta} ms in long tasks` : ''}. Split the work (yield between steps) or defer it past LCP.`);
    }
  }
  return out;
}

export function renderMarkdown(r) {
  const L = [];
  const { meta } = r;
  L.push(`## ${ICON[r.verdict]} Performance check: ${r.verdict.toUpperCase()}`);
  L.push('');
  L.push(`Before: ${meta.before.label} (${code(meta.before.url)})  `);
  L.push(`After: ${meta.after.label} (${code(meta.after.url)})  `);
  L.push(`${meta.runs} cold loads per side per viewport, interleaved, after ${meta.warmup} warm-up load${meta.warmup === 1 ? '' : 's'}; medians with min–max.`);
  L.push('');
  L.push(...verdictTable(r));
  const fixes = suggestFixes(r);
  if (fixes.length) L.push('', '**Suggested fixes** (from the evidence below; check them against the code):', '', ...fixes);
  L.push('');
  const rows = [
    ['CLS (load)', 'clsLoad', '', 3], ['CLS (with scroll)', 'clsScroll', '', 3], ['TBT', 'tbt', ' ms', 0],
    ['LCP', 'lcp', ' ms', 0], ['FCP', 'fcp', ' ms', 0], ['Requests before LCP', 'preLcpRequests', '', 0],
    ['KB before LCP', 'preLcpKB', '', 0], ['Requests total', 'requests', '', 0], ['KB total', 'totalKB', '', 0], ['Long tasks', 'longTasks', '', 0],
  ];
  for (const vp of meta.viewports) {
    const v = r.viewports[vp];
    L.push(`### ${vp[0].toUpperCase()}${vp.slice(1)} <sub>${meta.profiles[vp]}</sub>`);
    L.push('');
    L.push('| Metric | Before | After | Δ |');
    L.push('|---|---|---|---|');
    for (const [label, k, unit, dp] of rows) {
      const m = v.metrics[k];
      L.push(`| ${label} | ${fmt(m.before, unit, dp)}${rng(m.before, dp)} | ${fmt(m.after, unit, dp)}${rng(m.after, dp)} | ${delta(m.before, m.after, unit, dp)} |`);
    }
    L.push('');
    L.push(`LCP element: ${code(v.lcpEl.before)}${v.lcpEl.before === v.lcpEl.after ? ' (unchanged)' : ` → ${code(v.lcpEl.after)}`}`);
    L.push('');
    const reqList = (title, list, note) => {
      if (!list.length) return;
      L.push(`**${title}**`);
      L.push('');
      for (const x of list) L.push(`- ${code(x.key)}${x.type ? ` (${x.type})` : ''}${x.alsoLater ? ` — ${note}` : ''}${x.initiator ? `  \n  started by ${code(x.initiator)}` : ''}`);
      L.push('');
    };
    reqList('New before LCP', v.preLcp.added, 'already requested, but before LCP now');
    reqList('No longer before LCP', v.preLcp.removed, 'still requested, but after LCP now');
    if (v.preLcp.moved.length) {
      L.push('**Renamed or moved** (same request, new URL; not counted as new):');
      L.push('');
      for (const x of v.preLcp.moved) L.push(`- ${code(x.from)} → ${code(x.to)} (${x.type}, ${x.bytesBefore} → ${x.bytesAfter} B)`);
      L.push('');
    }
    const seen = new Set([...v.preLcp.added, ...v.preLcp.removed].map((x) => x.key).concat(v.preLcp.moved.flatMap((x) => [x.from, x.to])));
    const later = (list) => list.filter((x) => !seen.has(x.key));
    reqList('New requests (any time)', later(v.requests.added).map((x) => ({ key: x.key })));
    reqList('Requests no longer made (any time)', later(v.requests.removed).map((x) => ({ key: x.key })));
    if (!v.preLcp.added.length && !v.preLcp.removed.length) L.push(`No request was added or removed before LCP${v.preLcp.moved.length ? ' (renames aside)' : ''}.\n`);
    L.push(v.stacks.length
      ? `**Initiator stacks changed** for ${v.stacks.length} of ${v.commonCount} requests both sides make:\n\n${v.stacks.slice(0, 10).map((s) => `- ${code(s.key)}  \n  before ${code(s.before)}  \n  after ${code(s.after)}`).join('\n')}\n`
      : `Initiator stacks: identical for all ${v.commonCount} requests both sides make.\n`);
    L.push(v.tasks.length
      ? `**Long-task work that changed** (ms per load):\n\n| Work | Before | After | Δ |\n|---|---|---|---|\n${v.tasks.map((t) => `| ${code(t.key)} | ${t.before} | ${t.after} | ${t.delta > 0 ? '+' : ''}${t.delta} |`).join('\n')}\n`
      : 'Long-task attribution: no script or rendering step changed by 15 ms or more.\n');
    if (v.shiftSources.length) {
      L.push('**Layout-shift sources** (score per load):\n');
      L.push('| Element [phase] | Before | After |');
      L.push('|---|---|---|');
      for (const s of v.shiftSources.slice(0, 8)) L.push(`| ${code(s.key)} | ${s.before} | ${s.after} |`);
      L.push('');
    } else L.push('Layout shifts: none above 0.001 on either side.\n');
    if (v.errors.length) L.push(`Run errors: ${v.errors.map(code).join(', ')}\n`);
  }
  L.push('<details><summary>Method and caveats</summary>');
  L.push('');
  L.push('- Playwright Chromium, fresh context per load, service workers blocked, CPU and network throttled through CDP (Lighthouse lab presets).');
  L.push('- CLS is the web-vitals session-window score of shifts without recent input; "with scroll" adds a scroll to the bottom after load.');
  L.push('- TBT is computed from the Chrome trace: main-thread tasks ≥ 50 ms between FCP and the end of the load window (network quiet for 2 s and at least 4.5 s, past Milo\'s delayed phase).');
  L.push('- A request counts as new/removed only if it appears in at least half the loads on one side and fewer than half on the other. URLs are compared with the Milo origin as `{milo}` and the page origin as `{site}`.');
  L.push('- Initiator stacks compare the top three frames (function @ file, no line numbers) of the most common stack per request.');
  L.push('- Lab numbers on a shared laptop: read the deltas against the min–max ranges, not as field data.');
  if (meta.federal === 'same-origin') L.push('- Federal content (`{federal}` = `main--federal--adobecom.aem.*`) is served the way production serves it, from the page\'s own origin: each URL is fetched once and replayed under the same throttle, with no extra connection. On localhost and `*.aem.*` Milo loads it cross-origin, which production never does. Pass `--federal as-is` to measure the preview hosts.');
  else if (meta.federal === 'as-is') L.push('- Federal content is measured as is, cross-origin from `main--federal--adobecom.aem.*`; on production it comes from the page\'s own origin, so its cost here is an upper bound.');
  if (meta.block?.length) L.push(`- Blocked on both sides (environment, not the change): ${meta.block.map(code).join(', ')}.`);
  L.push('</details>');
  return `${L.join('\n')}\n`;
}
