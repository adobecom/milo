#!/usr/bin/env node
// Film a perf short's evidence and draft its story, from a finished milo-perf-verify run.
//   node .agents/skills/milo-perf-short/record.mjs --work <W> --report <perf out dir> \
//     [--profile mobile] [--scroll-ms 5000] [--pr 7243 --repo adobecom/milo --ticket MWPW-1 --title "..."]
// Re-uses the report's own before/after URLs, local ports and blocked hosts (report.json meta), so the film is
// the same page under the same device profile and throttling as the numbers. Writes:
//   <W>/rec/{before,after}.webm   one cold load per side, then one matched smooth scroll (warm-up load first)
//   <W>/rec/probe.json            what each filmed load measured, and where the clip starts in each video
//   <W>/rec/scorecard.png         1920x1080, drawn ONLY from report.json (the still's `evidence`)
//   <W>/short.json, story.json, comment.md   drafts, never overwritten; narration left as TODO for the writer
import { chromium } from 'playwright';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { PROFILES, describeProfile, routeLocalLibs, throttle } from '../milo-perf-verify/lib/profiles.mjs';
import { COLLECTOR, clsOf } from '../milo-perf-verify/lib/measure.mjs';

function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('--')) o[argv[i].slice(2)] = true; else { o[argv[i].slice(2)] = v; i += 1; }
  }
  return o;
}
const a = args(process.argv.slice(2));
if (!a.work || !a.report) { process.stderr.write('need --work <dir> and --report <milo-perf-verify out dir>\n'); process.exit(2); }
const W = resolve(a.work); const REC = join(W, 'rec'); mkdirSync(REC, { recursive: true });
const reportDir = resolve(a.report);
const report = JSON.parse(readFileSync(join(reportDir, 'report.json'), 'utf8'));
const { meta } = report;
const profile = a.profile || (meta.viewports.includes('mobile') ? 'mobile' : meta.viewports[0]);
if (!PROFILES[profile]) { process.stderr.write(`unknown profile ${profile}\n`); process.exit(2); }
const scrollMs = Number(a['scroll-ms'] || 5000);
const vp = PROFILES[profile].context.viewport;
const log = (m) => process.stdout.write(`${m}\n`);

async function film(browser, side, video) {
  const s = meta[side];
  const ctxOpts = { ...PROFILES[profile].context, serviceWorkers: 'block' };
  if (video) ctxOpts.recordVideo = { dir: join(REC, '_raw'), size: vp };
  const context = await browser.newContext(ctxOpts);
  const tCreated = Date.now();
  const page = await context.newPage();
  await page.addInitScript(COLLECTOR);
  await routeLocalLibs(page, s.port);
  for (const host of meta.block || []) await context.route((u) => u.hostname === host, (r) => r.abort('blockedbyclient'));
  await throttle(context, page, profile);
  const tNav = Date.now();
  await page.goto(s.url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForTimeout(1500);
  const load = await page.evaluate(() => window.__perf.snapshot());
  const scrollAt = (Date.now() - tNav) / 1000;
  // One matched movement: the same distance at the same speed on both sides, at most three screens.
  await page.evaluate(async (ms) => {
    const dist = Math.min(document.documentElement.scrollHeight - window.innerHeight, window.innerHeight * 3);
    const t0 = performance.now();
    await new Promise((done) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        window.scrollTo(0, Math.round(dist * (k < 0.5 ? 2 * k * k : 1 - ((-2 * k + 2) ** 2) / 2)));
        if (k < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
  }, scrollMs);
  await page.waitForTimeout(700);
  const end = (Date.now() - tNav) / 1000;
  const after = await page.evaluate(() => window.__perf.snapshot());
  const videoPath = video ? await page.video().path() : null;
  await context.close();
  return {
    side, url: s.url, videoPath, startS: (tNav - tCreated) / 1000, scrollAtS: scrollAt, endS: end,
    lcpMs: load.lcp ? Math.round(load.lcp.t) : null, lcpEl: load.lcp?.el ?? null, lcpRect: load.lcpRect,
    fcpMs: load.fcp != null ? Math.round(load.fcp) : null,
    cls: { load: Number(clsOf(load.shifts).toFixed(4)), withScroll: Number(clsOf(after.shifts).toFixed(4)) },
  };
}

const browser = await chromium.launch({ args: ['--disable-features=HttpsUpgrades'] });
const takes = {};
for (const side of ['before', 'after']) { log(`warm-up ${profile} ${side}`); await film(browser, side, false); }
for (const side of ['before', 'after']) {
  const t = await film(browser, side, true);
  copyFileSync(t.videoPath, join(REC, `${side}.webm`));
  t.video = `rec/${side}.webm`; delete t.videoPath;
  takes[side] = t;
  log(`filmed ${profile} ${side}: LCP ${t.lcpMs} ms  CLS ${t.cls.load}/${t.cls.withScroll}  clip ${t.startS.toFixed(2)}-${(t.startS + t.endS).toFixed(2)} s`);
}

// ---------- scorecard, from report.json only ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const med = (m) => m.median;
const cell = (m, unit, dp, worseUp = true) => {
  const b = med(m.before); const f = med(m.after);
  if (b == null || f == null) return '<td>–</td>';
  const d = f - b; const lim = Math.max(m.before.iqr, m.after.iqr, unit === ' ms' ? 30 : 0.001);
  const cls = Math.abs(d) <= lim ? 'same' : (d > 0) === worseUp ? 'bad' : 'ok';
  const sign = d > 0 ? '+' : d < 0 ? '−' : '±';
  return `<td><span class="v">${b.toFixed(dp)} → ${f.toFixed(dp)}${unit}</span><span class="d ${cls}">${sign}${Math.abs(d).toFixed(dp)}</span></td>`;
};
const rows = Object.entries(report.viewports).map(([name, v]) => `<tr><th>${esc(name)}</th>
  ${cell(v.metrics.clsScroll, '', 3)}${cell(v.metrics.tbt, ' ms', 0)}${cell(v.metrics.lcp, ' ms', 0)}${cell(v.metrics.preLcpRequests, '', 0)}</tr>`).join('');
const first = Object.values(report.viewports);
const short = (k) => k.replace(/^\{(milo|site)\}/, '').replace(/\?.*$/, '');
const removed = [...new Map(first.flatMap((v) => v.preLcp.removed).map((x) => [x.key, x])).values()];
const added = [...new Map(first.flatMap((v) => v.preLcp.added).map((x) => [x.key, x])).values()];
const moved = [...new Map(first.flatMap((v) => v.preLcp.moved).map((x) => [x.to, x])).values()];
const stackChanges = first.reduce((n, v) => n + v.stacks.length, 0);
const common = Math.min(...first.map((v) => v.commonCount));
const verdictWord = { pass: 'No regression', watch: 'Watch', regression: 'Regression' }[report.verdict];
const list = (xs, f) => xs.slice(0, 4).map((x) => `<li>${esc(f(x))}</li>`).join('') + (xs.length > 4 ? `<li class="dim">and ${xs.length - 4} more</li>` : '');
const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;width:1920px;height:1080px;background:#f6f1e7;color:#1d1b16;font:28px/1.35 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;box-sizing:border-box;padding:70px 90px}
  h1{font-size:52px;margin:0 0 6px} .sub{color:#7c7462;font-size:26px;margin-bottom:34px}
  .chip{display:inline-block;padding:4px 18px;border-radius:30px;font-size:30px;font-weight:600;margin-left:18px;vertical-align:middle;color:#fff;background:${report.verdict === 'pass' ? '#13804b' : report.verdict === 'watch' ? '#b86e00' : '#c62f3b'}}
  table{border-collapse:separate;border-spacing:0 10px;width:100%} th,td{text-align:left;padding:14px 22px;background:#fff}
  thead th{background:none;color:#7c7462;font-weight:500;font-size:24px;padding-bottom:0} tbody th{border-radius:12px 0 0 12px;width:170px}
  td:last-child{border-radius:0 12px 12px 0} .v{font-variant-numeric:tabular-nums} .d{margin-left:14px;font-size:22px;padding:2px 10px;border-radius:8px}
  .same{color:#7c7462;background:#eee8da} .ok{color:#fff;background:#13804b} .bad{color:#fff;background:#c62f3b}
  .cols{display:flex;gap:40px;margin-top:30px} .box{flex:1 1 0;min-width:0;overflow-wrap:anywhere;background:#fff;border-radius:14px;padding:20px 28px}
  .box h2{font-size:26px;margin:0 0 8px;color:#7c7462;font-weight:600} ul{margin:0;padding-left:26px;font-size:24px} .dim{color:#7c7462}
  code{font:22px ui-monospace,Menlo,monospace}
</style>
<h1>Performance before → after<span class="chip">${esc(verdictWord)}</span></h1>
<div class="sub">${esc(meta.before.label)} → ${esc(meta.after.label)} · median of ${meta.runs} interleaved cold loads per viewport${meta.block?.length ? ` · blocked on both sides: ${esc(meta.block.join(', '))}` : ''}</div>
<table><thead><tr><th></th><th>CLS (load + scroll)</th><th>TBT</th><th>LCP</th><th>Requests before LCP</th></tr></thead><tbody>${rows}</tbody></table>
<div class="cols">
  <div class="box"><h2>No longer requested before LCP</h2><ul>${removed.length ? list(removed, (x) => `${short(x.key)}${x.alsoLater ? ' (now after LCP)' : ''}`) : '<li class="dim">none</li>'}</ul></div>
  <div class="box"><h2>New before LCP</h2><ul>${added.length ? list(added, (x) => `${short(x.key)}${x.alsoLater ? ' (was after LCP)' : ''}`) : '<li class="dim">none</li>'}${moved.length ? list(moved, (x) => `renamed: ${short(x.from).split('/').pop()} → ${short(x.to).split('/').pop()}`) : ''}</ul></div>
  <div class="box"><h2>Initiator stacks</h2><ul><li>${stackChanges ? `${stackChanges} changed` : `identical for all ${common} requests both sides make`}</li><li class="dim">long-task work: ${first.every((v) => !v.tasks.length) ? 'no change ≥ 15 ms' : 'changed, see report'}</li></ul></div>
</div>`;
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.setContent(html);
await page.screenshot({ path: join(REC, 'scorecard.png') });
await browser.close();

writeFileSync(join(REC, 'probe.json'), JSON.stringify({ profile, describe: describeProfile(profile), scrollMs, report: reportDir, takes, filmedAt: new Date().toISOString() }, null, 1));

// ---------- drafts ----------
const gh = (q) => { const r = spawnSync('gh', q, { encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : null; };
const repo = a.repo || 'adobecom/milo';
const pr = a.pr ? Number(a.pr) : 0;
const head = a.head || (pr ? gh(['pr', 'view', String(pr), '--repo', repo, '--json', 'headRefOid', '-q', '.headRefOid']) : null);
const clamp = (r) => {
  if (!r) return null;
  const x = Math.max(0, r.x); const y = Math.max(0, r.y);
  const w = Math.min(vp.width - x, r.width); const h = Math.min(vp.height - y, r.height);
  return w > 4 && h > 4 ? [x, y, w, h] : null;
};
const panel = (side, label) => {
  const t = takes[side]; const box = clamp(t.lcpRect);
  return {
    src: side, start: Number(t.startS.toFixed(2)), end: Number((t.startS + t.endS).toFixed(2)), rect: [0, 0, vp.width, vp.height], label,
    boxes: box && t.lcpMs != null ? [{ rect: box, at: Number((t.lcpMs / 1000 + 0.2).toFixed(2)), until: Number(t.scrollAtS.toFixed(2)), label: `LCP ${(t.lcpMs / 1000).toFixed(2)} s` }] : [],
  };
};
const story = {
  id: `pr${pr}-perf`, pr, repo, ticket: a.ticket || 'TODO', palette: 'paper', angle: 'number',
  sources: { before: 'rec/before.webm', after: 'rec/after.webm', scorecard: 'rec/scorecard.png' },
  ui: { surface: `the test page in Chrome, ${profile} profile (${describeProfile(profile)})`, sources: ['before', 'after'], probe: 'rec/probe.json' },
  provenance: {
    head: head || 'TODO PR head SHA the after side serves', before: meta.before.label, after: meta.after.label,
    page: meta.after.url, report: reportDir, runs: meta.runs, profiles: meta.profiles, blocked: meta.block, fetchedAt: meta.startedAt,
  },
  scenes: [
    { beat: 'context', type: 'card', key: a.ticket || 'TODO', title: a.title || 'TODO the PR title, readable', lines: ['TODO what the change does to loading, in one plain sentence'], say: 'TODO what the change does, in ordinary words' },
    { beat: 'comparison', type: 'split', minDur: 7, say: 'TODO what the filmed loads show: when each side paints, any shift; quote LCP only if it moved beyond the report ranges', left: panel('before', `BEFORE · ${profile}`), right: panel('after', `AFTER · ${profile}`) },
    { beat: 'comparison', type: 'still', src: 'scorecard', evidence: 'report.json', from: [0, 0, 1920, 1080], to: [60, 40, 1800, 1012], minDur: 5, say: 'TODO the scorecard: CLS, TBT, requests before LCP, stacks' },
    ...(report.verdict === 'pass' ? [] : [{ beat: 'verdict', type: 'verdict', title: 'Open before merge', rows: [{ state: report.verdict === 'regression' ? 'block' : 'open', t: 'TODO the regression to fix, in a few words' }], say: 'TODO what has to change before merge' }]),
  ],
};
const put = (f, body) => { const p = join(W, f); if (existsSync(p)) log(`kept existing ${f}`); else { writeFileSync(p, body); log(`wrote ${f}`); } };
put('short.json', `${JSON.stringify({ pr, repo, ticket: a.ticket || null, report: reportDir }, null, 1)}\n`);
put('story.json', `${JSON.stringify(story, null, 1)}\n`);
put('comment.md', `TODO one sentence: what the short shows, and the headline result.\n\n<!-- publish appends ${'report.md'} under "Full report"; list disclosures here: blocked hosts, local test page, what was not measured -->\n`);
log(`\nnext: write the narration in ${join(W, 'story.json')}, then node .agents/skills/milo-perf-short/engine/build.mjs ${join(W, 'story.json')}`);
