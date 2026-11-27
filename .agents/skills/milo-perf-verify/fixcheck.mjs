#!/usr/bin/env node
// Review -> fix -> re-measure: did the fix resolve what the review flagged?
//
//   node .agents/skills/milo-perf-verify/fixcheck.mjs \
//     --was tmp/perf/prNNNN-<flagged-sha>     # milo-perf-verify --out of base vs the flagged head
//     --now tmp/perf/prNNNN-<fix-sha>         # base vs the head with the fix (same page, flags, viewports)
//     [--direct tmp/perf/prNNNN-<a>-vs-<b>]   # optional: flagged head (before) vs fix head (after), one run
//     [--label-was 90d7840 --label-now 597b0a1] [--out <dir>]   # default out: the --now dir
// Writes fixcheck.json and fixcheck.md. Exits 2 if the runs are not comparable (federal mode, blocked hosts,
// page or profiles differ), 1 if the fix is not effective, 0 otherwise.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildFixCheck, renderFixCheck, incompatibilities } from './lib/fixcheck.mjs';
import { buildReport } from './lib/report.mjs';

const a = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const k = process.argv[i]; if (!k.startsWith('--')) continue;
  a[k.slice(2)] = process.argv[i + 1]; i += 1;
}
if (!a.was || !a.now) { process.stderr.write('usage: fixcheck.mjs --was <report dir> --now <report dir> [--direct <dir>] [--out <dir>]\n'); process.exit(2); }
// Rebuild from the raw runs when they are there, so an older report gets the current evidence (gates, keys).
const load = (d) => {
  const runs = join(resolve(d), 'runs.json');
  return existsSync(runs) ? buildReport(JSON.parse(readFileSync(runs, 'utf8'))) : JSON.parse(readFileSync(join(resolve(d), 'report.json'), 'utf8'));
};
const was = load(a.was); const now = load(a.now); const direct = a.direct ? load(a.direct) : null;
const bad = incompatibilities(was, now);
if (bad.length) { for (const m of bad) process.stderr.write(`NOT COMPARABLE: ${m}\n`); process.exit(2); }
const fc = buildFixCheck({ was, now, direct, labels: { was: a['label-was'], now: a['label-now'] } });
const out = resolve(a.out || a.now);
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'fixcheck.json'), `${JSON.stringify(fc, null, 2)}\n`);
const md = renderFixCheck(fc);
writeFileSync(join(out, 'fixcheck.md'), md);
process.stdout.write(md);
process.exit(/^(not effective|partly effective)$/.test(fc.verdict) ? 1 : 0);
