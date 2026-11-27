#!/usr/bin/env node
// Before/after performance check for a Milo change. Interleaves cold loads of the same page on both sides
// under each device profile, then writes runs.json, report.json and report.md.
//
//   node .agents/skills/milo-perf-verify/perf.mjs \
//     --page https://main--da-bacom--adobecom.aem.live/some/page \
//     --milolibs-before stage --milolibs-after my-branch \
//     [--before <url> --after <url>]            # full URLs instead of --page + --milolibs-*
//     [--local-before-port 6457 --local-after-port 6458]   # both sides ?milolibs=local, each on its own aem up
//     [--runs 5] [--warmup 1] [--viewports mobile,tablet,desktop] [--no-scroll] [--martech off]
//     [--changed origin/stage...HEAD --repo ../milo-after]  # prove the changed libs/ files ran on the after side
//     [--allow-unloaded <block>,...] [--allow-unexercised <path>,...]
//     [--block geo2.adobe.com]                  # abort a host on both sides (one that hangs from this network)
//     [--federal same-origin|as-is]             # federal served like production's same origin (default), or as is
//     [--out tmp/perf/<slug>] [--label-before stage --label-after PR]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PROFILES, withMilolibs, describeProfile } from './lib/profiles.mjs';
import { measureRun } from './lib/measure.mjs';
import { buildReport, renderMarkdown } from './lib/report.mjs';

function args(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const k = a.slice(2);
    if (k.startsWith('no-')) { o[k.slice(3)] = false; continue; }
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('--')) o[k] = true; else { o[k] = v; i += 1; }
  }
  return o;
}

const a = args(process.argv.slice(2));
if (a.rerender) {
  const { readFileSync } = await import('node:fs');
  const dir = resolve(a.rerender);
  const report = buildReport(JSON.parse(readFileSync(`${dir}/runs.json`, 'utf8')));
  writeFileSync(`${dir}/report.json`, JSON.stringify(report, null, 1));
  writeFileSync(`${dir}/report.md`, renderMarkdown(report));
  process.stdout.write(`verdict: ${report.verdict.toUpperCase()}  ${report.summary}\n`);
  process.exit(0);
}
const martech = a.martech ?? 'off';
const before = a.before || (a.page && withMilolibs(a.page, a['milolibs-before'] || (a['local-before-port'] ? 'local' : null), martech));
const after = a.after || (a.page && withMilolibs(a.page, a['milolibs-after'] || (a['local-after-port'] ? 'local' : null), martech));
if (!before || !after) {
  process.stderr.write('need --before and --after, or --page with --milolibs-before/--milolibs-after (or --local-*-port)\n');
  process.exit(2);
}
if (before === after && !a['local-before-port']) {
  process.stderr.write('before and after are the same URL; nothing would be compared\n');
  process.exit(2);
}
const runs = Number(a.runs || 5);
const warmup = Number(a.warmup ?? 1);
const viewports = String(a.viewports || 'mobile,tablet,desktop').split(',').filter((v) => PROFILES[v]);
const out = resolve(a.out || `tmp/perf/${Date.now()}`);
mkdirSync(out, { recursive: true });
const sides = {
  before: { url: before, port: a['local-before-port'] ? Number(a['local-before-port']) : null, label: a['label-before'] || 'before' },
  after: { url: after, port: a['local-after-port'] ? Number(a['local-after-port']) : null, label: a['label-after'] || 'after' },
};

const log = (m) => process.stdout.write(`${m}\n`);
const browser = await chromium.launch({ args: ['--disable-features=HttpsUpgrades', '--no-default-browser-check'] });
const block = String(a.block || '').split(',').map((s) => s.trim()).filter(Boolean);
const federal = a.federal === 'as-is' ? 'as-is' : 'same-origin';
const all = { meta: { before: sides.before, after: sides.after, runs, warmup, viewports, block, federal, scroll: a.scroll !== false, startedAt: new Date().toISOString(), profiles: Object.fromEntries(viewports.map((v) => [v, describeProfile(v)])) }, runs: [] };

// The blocks the page authors (first class of each div with a class in <main>; EDS markup has no other).
// A block that was refused or never loaded changes the page's height, requests and shifts: not measurable.
const authoredOf = async (url) => {
  const html = await (await fetch(url)).text();
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  return [...new Set([...main.matchAll(/<div class="([a-z0-9-]+)/g)].map((x) => x[1]))].filter((n) => !n.endsWith('-metadata'));
};
const allowUnloaded = String(a['allow-unloaded'] || '').split(',').filter(Boolean);
// --changed <git range> (run in --repo, the after side's checkout): every changed libs/ JS or CSS file must be
// requested by the after side, or the change's logic never ran and the numbers say nothing about it.
let changedFiles = [];
if (a.changed) {
  const { execFileSync } = await import('node:child_process');
  changedFiles = execFileSync('git', ['-C', resolve(a.repo || '.'), 'diff', '--name-only', '--diff-filter=AMR', a.changed], { encoding: 'utf8' })
    .split('\n').filter((f) => /^libs\/.*\.(m?js|css)$/.test(f) && !/\.test\.|\/test\//.test(f));
}
const allowUnexercised = String(a['allow-unexercised'] || '').split(',').filter(Boolean);
const unexercised = (r) => changedFiles.filter((f) => !allowUnexercised.some((x) => f.includes(x))
  && !r.requests.some((q) => { try { return new URL(q.url).pathname === `/${f}`; } catch { return false; } }));
all.meta.changed = { range: a.changed || null, files: changedFiles, allowed: allowUnexercised };
const authored = {};
for (const side of ['before', 'after']) authored[side] = await authoredOf(sides[side].url);
all.meta.blocks = authored;
const blockProblems = (side, r) => {
  if (!r.blocks) return [];
  const failed = r.blocks.failed.map((b) => `${b.name} refused (${b.reason})`);
  const missing = authored[side].filter((n) => !r.blocks.loaded.includes(n) && !r.blocks.failed.some((b) => b.name === n)).map((n) => `${n} did not load`);
  return [...failed, ...missing].filter((m) => !allowUnloaded.some((n) => m.startsWith(`${n} `)));
};

for (const vp of viewports) {
  for (let w = 0; w < warmup; w += 1) {
    for (const side of ['before', 'after']) {
      log(`warm-up ${vp} ${side}`);
      const wr = await measureRun(browser, { url: sides[side].url, profile: vp, localPort: sides[side].port, scroll: false, trace: false, block, federal });
      const bad = blockProblems(side, wr);
      if (side === 'after') for (const f of unexercised(wr)) bad.push(`${f} (changed) was never requested`);
      if (bad.length) {
        process.stderr.write(`not measurable: on ${side} (${vp}) ${bad.join('; ')}. Author the test page with the changed blocks on its foundation (milo-local-testpage checks that) or pass --allow-unloaded <block> / --allow-unexercised <path> with the reason it is not part of the change.\n`);
        await browser.close();
        process.exit(2);
      }
    }
  }
  for (let i = 0; i < runs; i += 1) {
    const order = i % 2 ? ['after', 'before'] : ['before', 'after'];
    for (const side of order) {
      const r = await measureRun(browser, { url: sides[side].url, profile: vp, localPort: sides[side].port, scroll: a.scroll !== false, block, federal });
      r.side = side; r.run = i;
      const bad = blockProblems(side, r);
      if (side === 'after') { const u = unexercised(r); if (u.length) bad.push(...u.map((f) => `${f} (changed) was never requested`)); }
      if (bad.length) r.blockProblems = bad;
      all.runs.push(r);
      const pre = r.requests.filter((q) => q.preLcp).length;
      log(`${vp} ${side} #${i + 1}: LCP ${r.lcp?.t ?? '-'} ms  CLS ${r.cls.load}/${r.cls.withScroll}  TBT ${r.tbt ?? '-'} ms  pre-LCP req ${pre}/${r.requests.length}${r.navError ? `  ERROR ${r.navError}` : ''}${r.traceError ? `  (${r.traceError})` : ''}`);
    }
  }
}
await browser.close();

writeFileSync(`${out}/runs.json`, JSON.stringify(all, null, 1));
const report = buildReport(all);
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
writeFileSync(`${out}/report.md`, renderMarkdown(report));
log(`\nverdict: ${report.verdict.toUpperCase()}  ${report.summary}`);
log(`wrote ${out}/report.md, report.json, runs.json`);
