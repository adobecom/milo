// Vendored unchanged from Adobe-acom/forgeflex .agents/skills/pr-short/engine @5479db43; fix upstream first.
// Cheap mechanical screen of a BUILT short, before anyone looks at frames (adapted from the video-demo skill's
// screen.mjs). One ffprobe and three ffmpeg passes; FLAGs:
//   - format: not 1920x1080 H.264 at 30 fps with an AAC track
//   - thumbnail: frame 0 (GitHub's preview) blank or black, i.e. the opening card faded in from an empty page
//   - silent: mean audio volume below -45 dB (narration missing or muted)
//   - frozen evidence: a static span >= 3 s inside a comparison scene (dead air, a stuck capture or an
//     undisclosed frozen recording). Card and verdict scenes are static by design and excused.
//   node screen.mjs <short.mp4> [--provenance provenance.json]     exit 0 PASS, 1 FLAG, 2 error
// build.mjs runs it after every build and records the result in provenance.json; --final refuses a FLAG.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const FREEZE_S = 3;
export const SILENT_DB = -45;
const BLANK_RANGE = 40; // frame-0 luma max-min below this: a flat page with no title on it

const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 64 << 20 });

// windows: [{ beat, a, b }] scene spans in output seconds; static spans are only judged inside comparisons.
export function frozenEvidence(spans, windows, freeze = FREEZE_S) {
  const flags = [];
  for (const { a, b } of spans) {
    for (const w of windows.filter((x) => x.beat === 'comparison')) {
      const u = Math.max(a, w.a); const v = Math.min(b, w.b);
      if (v - u >= freeze) flags.push(`frozen evidence ${u.toFixed(1)}-${v.toFixed(1)} s in the comparison: cut the wait or disclose a hold`);
    }
  }
  return flags;
}

export function screenShort(file, windows = []) {
  const flags = []; const res = {};
  const p = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate', '-of', 'json', file], { encoding: 'utf8' });
  if (p.status !== 0) throw new Error(`ffprobe failed: ${p.stderr}`);
  const streams = JSON.parse(p.stdout).streams;
  const v = streams.find((s) => s.codec_type === 'video'); const a = streams.find((s) => s.codec_type === 'audio');
  if (!v || v.codec_name !== 'h264' || v.width !== 1920 || v.height !== 1080 || v.r_frame_rate !== '30/1') flags.push(`format: video ${v ? `${v.codec_name} ${v.width}x${v.height} ${v.r_frame_rate}` : 'missing'}, want h264 1920x1080 30/1`);
  if (!a || a.codec_name !== 'aac') flags.push(`format: audio ${a?.codec_name ?? 'missing'}, want aac`);

  const f0 = ff(['-i', file, '-frames:v', '1', '-vf', 'signalstats,metadata=print', '-f', 'null', '-']).stderr || '';
  const stat = (k) => { const m = new RegExp(`lavfi\\.signalstats\\.${k}=([\\d.]+)`).exec(f0); return m ? +m[1] : null; };
  res.frame0 = { yavg: stat('YAVG'), ymin: stat('YMIN'), ymax: stat('YMAX') };
  if (res.frame0.ymax == null) flags.push('thumbnail: could not measure frame 0');
  else if (res.frame0.ymax - res.frame0.ymin < BLANK_RANGE) flags.push(`thumbnail: frame 0 is a flat ${res.frame0.yavg < 30 ? 'black' : 'blank'} page; the opening card must be drawn on frame 0`);

  if (a) {
    const m = /mean_volume: (-?[\d.]+) dB/.exec(ff(['-i', file, '-vn', '-af', 'volumedetect', '-f', 'null', '-']).stderr || '');
    res.meanVolumeDb = m ? +m[1] : null;
    if (res.meanVolumeDb == null || res.meanVolumeDb < SILENT_DB) flags.push(`silent: mean volume ${res.meanVolumeDb ?? '?'} dB < ${SILENT_DB} dB`);
  }

  const fr = ff(['-i', file, '-an', '-vf', `freezedetect=n=0.003:d=${FREEZE_S}`, '-f', 'null', '-']).stderr || '';
  const spans = []; let s0 = null;
  for (const m of fr.matchAll(/freeze_(start|end): ([\d.]+)/g)) {
    if (m[1] === 'start') s0 = +m[2]; else if (s0 != null) { spans.push({ a: s0, b: +m[2] }); s0 = null; }
  }
  if (s0 != null) spans.push({ a: s0, b: windows.at(-1)?.b ?? s0 + FREEZE_S });
  res.staticSpans = spans.map(({ a: x, b: y }) => [Number(x.toFixed(2)), Number(y.toFixed(2))]);
  flags.push(...frozenEvidence(spans, windows));
  return { pass: !flags.length, flags, ...res };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const i = args.indexOf('--provenance');
  const provFile = i >= 0 ? args.splice(i, 2)[1] : null; const file = args[0];
  if (!file || !fs.existsSync(file)) { console.error('usage: node screen.mjs <short.mp4> [--provenance provenance.json]'); process.exit(2); }
  let windows = []; let t = 0;
  if (provFile) windows = JSON.parse(fs.readFileSync(provFile, 'utf8')).scenes.map((s) => ({ beat: s.beat, a: t, b: (t += s.dur) }));
  const r = screenShort(file, windows);
  for (const f of r.flags) console.log(`FLAG  ${f}`);
  console.log(`SCREEN ${r.pass ? 'PASS' : 'FLAG'} ${path.basename(file)} (frame 0 Y ${r.frame0.ymin}-${r.frame0.ymax}, ${r.meanVolumeDb} dB, ${r.staticSpans.length} static span(s))`);
  process.exit(r.pass ? 0 : 1);
}
