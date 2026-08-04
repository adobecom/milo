# Chrome Trace Parser

Used by SKILL.md Trace Mode. Reads a Chrome DevTools performance trace (`.json` exported via DevTools → Performance → Save profile) and returns a `MetricsBundle` compatible with the existing trace-analyser.

## Inputs

- `file_path` — absolute or relative path to the `.json` trace file

## Limitations vs Playwright mode

- `animationAudit` is not available (no DOM access) — always `[]`
- `resourceTotals` / `resourceSummary` are empty unless network events are present in the trace
- `vitals.inpMs` is `null` unless `EventTiming` entries are in the trace
- `gpuTextureMB` / `jsHeapMB` are `null`
- Single pass only — no throttled comparison

## Procedure

Run the following Node.js script via Bash, substituting `%%FILE_PATH%%` with the actual path. The script prints a JSON MetricsBundle to stdout.

```bash
node -e "
const fs = require('fs');
const path = require('path');

const filePath = '%%FILE_PATH%%';
let data;
try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) { process.stderr.write('Failed to parse trace: ' + e.message); process.exit(1); }

const events = Array.isArray(data) ? data : (data.traceEvents || []);

// Find main renderer thread by highest RunTask count
const tidMap = {};
for (const e of events) {
  if (e.name === 'RunTask' && e.ph === 'X') {
    const k = e.pid + '|' + e.tid;
    tidMap[k] = (tidMap[k] || 0) + 1;
  }
}
const mainKey = Object.entries(tidMap).sort((a, b) => b[1] - a[1])[0];
const [mainPid, mainTid] = mainKey ? mainKey[0].split('|').map(Number) : [null, null];

// Accumulate main-thread durations (microseconds)
let taskUs = 0, scriptUs = 0, recalcUs = 0, layoutUs = 0;
const longTasks = [];
const minTs = events.reduce((m, e) => (e.ts && e.ts < m ? e.ts : m), Infinity);

for (const e of events) {
  if (e.ph !== 'X' || e.pid !== mainPid || e.tid !== mainTid) continue;
  const dur = e.dur || 0;
  if (e.name === 'RunTask') {
    taskUs += dur;
    if (dur > 50000) longTasks.push({ durationMs: Math.round(dur / 1000), startMs: Math.round((e.ts - minTs) / 1000) });
  }
  if (e.name === 'UpdateLayoutTree') recalcUs += dur;
  if (e.name === 'Layout') layoutUs += dur;
  if (['EvaluateScript','FunctionCall','v8.compile','V8.Execute'].includes(e.name)) scriptUs += dur;
}

// FPS from DrawFrame events
const frames = events
  .filter(e => e.name === 'DrawFrame' && (e.ph === 'I' || e.ph === 'i') && e.pid === mainPid)
  .map(e => e.ts)
  .sort((a, b) => a - b);

const frameDurMs = [];
for (let i = 1; i < frames.length; i++) frameDurMs.push((frames[i] - frames[i-1]) / 1000);

let scroll;
if (frameDurMs.length < 2) {
  scroll = { fpsAvg: 60, fpsMin: 60, fpsMax: 60, rafP50: 16, rafP95: 16, rafMax: 16, jankFrames: 0, totalFrames: 0 };
} else {
  const sorted = [...frameDurMs].sort((a, b) => a - b);
  const p = pct => sorted[Math.min(Math.floor(sorted.length * pct / 100), sorted.length - 1)];
  const avg = Math.round(frameDurMs.reduce((a, b) => a + b, 0) / frameDurMs.length);
  scroll = {
    fpsAvg: avg > 0 ? Math.round(1000 / avg) : 60,
    fpsMin: Math.round(1000 / sorted[sorted.length - 1]),
    fpsMax: Math.round(1000 / sorted[0]),
    rafP50: Math.round(p(50)),
    rafP95: Math.round(p(95)),
    rafMax: Math.round(sorted[sorted.length - 1]),
    jankFrames: frameDurMs.filter(x => x > 33).length,
    totalFrames: frameDurMs.length,
  };
}

longTasks.sort((a, b) => b.durationMs - a.durationMs);
const tbt = longTasks.reduce((sum, t) => sum + Math.max(t.durationMs - 50, 0), 0);

process.stdout.write(JSON.stringify({
  profile: 'chrome-trace',
  url: path.basename(filePath),
  vitals: { inpMs: null },
  scroll,
  longTasks: longTasks.slice(0, 10),
  totalBlockingTimeMs: tbt,
  animationAudit: [],
  cdp: {
    taskDurationS: +(taskUs / 1e6).toFixed(3),
    scriptDurationS: +(scriptUs / 1e6).toFixed(3),
    recalcStyleDurationS: +(recalcUs / 1e6).toFixed(3),
    layoutDurationS: +(layoutUs / 1e6).toFixed(3),
    jsHeapMB: null,
    gpuTextureMB: null,
  },
  resourceTotals: {},
  resourceSummary: {},
  screenshotPath: null,
  notes: ['Source: Chrome DevTools performance trace. animationAudit and resourceSummary unavailable in trace mode.'],
}));
"
```

## Output

The script prints a MetricsBundle JSON string to stdout. Capture it, parse it, and store as `baseline`. Set `throttled = baseline` (single-pass — no CPU comparison available).

If the script exits with a non-zero code, the file is not a valid Chrome trace. Tell the user and stop.
