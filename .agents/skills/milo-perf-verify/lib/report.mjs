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

function judge(v) {
  const findings = [];
  const d = (k) => (v.metrics[k].after.median ?? 0) - (v.metrics[k].before.median ?? 0);
  const noise = (k) => Math.max(v.metrics[k].before.iqr, v.metrics[k].after.iqr);
  for (const k of ['clsLoad', 'clsScroll']) {
    const delta = d(k); const lim = Math.max(0.01, noise(k));
    if (delta > lim) findings.push({ level: 'regression', what: `CLS ${k === 'clsLoad' ? 'during load' : 'with scroll'} +${delta.toFixed(3)}` });
    else if (delta < -lim) findings.push({ level: 'improvement', what: `CLS ${k === 'clsLoad' ? 'during load' : 'with scroll'} ${delta.toFixed(3)}` });
  }
  {
    const delta = d('tbt'); const lim = Math.max(30, 0.1 * (v.metrics.tbt.before.median || 0), noise('tbt'));
    if (delta > lim) findings.push({ level: 'regression', what: `TBT +${Math.round(delta)} ms` });
    else if (delta < -lim) findings.push({ level: 'improvement', what: `TBT ${Math.round(delta)} ms` });
  }
  {
    const delta = d('lcp'); const lim = Math.max(100, 0.05 * (v.metrics.lcp.before.median || 0), noise('lcp'));
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

export function renderMarkdown(r) {
  const L = [];
  const { meta } = r;
  L.push(`## ${ICON[r.verdict]} Performance check: ${r.verdict.toUpperCase()}`);
  L.push('');
  L.push(`Before: ${meta.before.label} (${code(meta.before.url)})  `);
  L.push(`After: ${meta.after.label} (${code(meta.after.url)})  `);
  L.push(`${meta.runs} cold loads per side per viewport, interleaved, after ${meta.warmup} warm-up load${meta.warmup === 1 ? '' : 's'}; medians with min–max.`);
  L.push('');
  L.push(`|${meta.viewports.map((v) => ` ${v[0].toUpperCase()}${v.slice(1)} |`).join('')}`.replace(/^\|/, '| |'));
  L.push(`|---|${meta.viewports.map(() => '---').join('|')}|`);
  L.push(`| Verdict |${meta.viewports.map((v) => { const f = r.viewports[v].findings; const lv = f.some((x) => x.level === 'regression') ? 'regression' : f.some((x) => x.level === 'watch') ? 'watch' : 'pass'; return ` ${ICON[lv]} ${f.map((x) => x.what).join('; ') || 'no change beyond noise'}`; }).join(' |')} |`);
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
  if (meta.block?.length) L.push(`- Blocked on both sides (environment, not the change): ${meta.block.map(code).join(', ')}.`);
  L.push('</details>');
  return `${L.join('\n')}\n`;
}
