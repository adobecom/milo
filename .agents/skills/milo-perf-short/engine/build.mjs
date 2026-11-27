// Vendored unchanged from Adobe-acom/forgeflex .agents/skills/pr-short/engine @5479db43; fix upstream first.
// Build a story-driven PR short from a scene list.
//   node build.mjs <story.json> [--final] [--force]      (run.sh <work> build|final calls this)
//   --final: the build you publish; refuses PR-head drift and a flagged screen, appends the anti-repetition ledger. --force: build despite lint/ledger failures (recorded).
// Every scene is synthesized first, so its length is its narration's length (exact sync, no drift).
// Writes <out>/short.mp4, sheet.png, provenance.json, captions.srt and appends the ledger. See SKILL.md §1-§4.
//
// story.json:
// { "id": "pr80-lcp", "pr": 80, "ticket": "MWPW-214545", "chip": "MWPW-214545 · LCP image weight",
//   "angle": "side-by-side", "palette": "paper", "motion": "calm", "out": "out",
//   "voice": { "name": "en-US-AvaMultilingualNeural", "rate": "-5%", "pitch": "+0Hz" },
//   "sources": { "after": "rec/after/x.webm", "hero": "ev/hero.png" },    // paths relative to story.json
//   "ui": { "surface": "Hallmark panel", "sources": ["before", "after"], "probe": "ev/probe.json" }   // or { "none": why } / { "blocker": what }
//   "provenance": { "head": "PR head SHA the after side contains (--final checks it)", ... commits, page, fetchedAt, disclosures ... },
//   "repo": "owner/name" (optional; gh resolves the PR from the cwd otherwise),
//   "scenes": [ { "type": "...", "say": "narration", ...type fields, "texts": [...], "boxes": [...] } ] }
//
// Every scene names its beat: context | comparison, then verdict only for unresolved topics.
// Scene types (all accept: beat, say, rate, pitch, lead, pad, minDur, holdReason, bg, texts, boxes, chip:false, captions:false):
//   card    { key, title, lines: [string] }                                      the context beat: ticket + what is implemented
//   verdict { title, rows: [{ state: open|block, t }] }                          optional unresolved-topic ending
//   text   { lines: [{ t, size, color, y, at, anim }] }
//   stat   { value, unit, decimals, label, compare: [{ label, value, color }] }   bars grow in, proportional
//   still  { src, from: [x,y,w,h], to: [x,y,w,h] }                                Ken Burns between two rects
//   clip   { src, start, end, from, to }  end-start longer than the scene ⇒ sped up WITH an on-screen "N× speed" badge
//   split  { left: { src, start, end, rect, label, boxes, still }, right: {...} } matched stable crops; boxes in source pixels
//   code   { title, lines: [string | { t, color }] }                              real output only (SKILL.md §4)
// texts: [{ t, at, x, y, size, color, anim: rise|fade (calm) or pop|slam|type (motion: "lively"), box, align }]  (output px)
// boxes: [{ rect: [x,y,w,h] in SOURCE px, at, color, label }]                   mapped through the scene's final view
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintStory, lintTiming, ledgerCheck, ledgerAppend, headDrift } from './lint.mjs';
import { screenShort } from './screen.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = 1920; const H = 1080; const FPS = 30;
const storyPath = path.resolve(process.argv[2] || '');
const force = process.argv.includes('--force');
const isFinal = process.argv.includes('--final');
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const base = path.dirname(storyPath);
const out = path.resolve(base, story.out || 'out');
const work = path.join(out, 'work');
fs.mkdirSync(work, { recursive: true });

export const PALETTES = {
  ink: { bg: '#0f1729', fg: '#f5f7fb', dim: '#8a94a8', accent: '#ff6b4a', ok: '#3ddc97', warn: '#ffb02e', bad: '#ff4d5e', panel: '#1b2540' },
  paper: { bg: '#f6f1e7', fg: '#1d1b16', dim: '#7c7462', accent: '#2f5bea', ok: '#13804b', warn: '#b86e00', bad: '#c62f3b', panel: '#ffffff' },
  signal: { bg: '#0b0b0b', fg: '#ffffff', dim: '#9a9a9a', accent: '#ffd400', ok: '#38e07b', warn: '#ff9f1a', bad: '#ff3b47', panel: '#1c1c1c' },
  mint: { bg: '#e8f6f1', fg: '#0d2b23', dim: '#5b7a70', accent: '#0a7d5a', ok: '#0a7d5a', warn: '#b35c00', bad: '#c0283b', panel: '#ffffff' },
  dusk: { bg: '#2a1838', fg: '#fff6ee', dim: '#b9a6c4', accent: '#ff9e64', ok: '#7ee2b8', warn: '#ffd166', bad: '#ff5d73', panel: '#3a2550' },
};
const pal = PALETTES[story.palette || 'paper'];
if (!pal) throw new Error(`unknown palette ${story.palette}`);
// Business context: calm by default (fades, small rises, no overshoot). "lively" restores pop/slam/type.
const CALM = (story.motion || 'calm') !== 'lively';
const voice = { name: 'en-US-AvaMultilingualNeural', rate: '-5%', pitch: '+0Hz', ...(story.voice || {}) };

// ---------- gates: lint + anti-repetition ledger ----------
const lint = lintStory(story);
const repeat = ledgerCheck(story);
for (const m of [...lint.warnings, ...repeat.warnings]) console.warn(`warn: ${m}`);
const fails = [...lint.errors, ...repeat.errors];
if (isFinal && story.pr) {
  const r = spawnSync('gh', ['pr', 'view', String(story.pr), ...(story.repo ? ['--repo', story.repo] : []), '--json', 'headRefOid', '-q', '.headRefOid'], { encoding: 'utf8' });
  const drift = headDrift(story, r.status === 0 ? r.stdout.trim() : null, (r.stderr || r.error?.message || '').split('\n')[0].slice(0, 160));
  if (drift) fails.push(drift);
}
if (fails.length) {
  for (const m of fails) console.error(`FAIL: ${m}`);
  if (!force) process.exit(1);
  console.warn('--force: building anyway; the provenance records the overridden failures');
}

// ---------- helpers ----------
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 26, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${(r.stderr || '').slice(-1500)}`);
  return r.stdout;
};
const probe = (f) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).trim());
const dims = (f) => run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', f]).trim().split('x').map(Number);
const src = (k) => {
  const p = story.sources?.[k] ?? k;
  const abs = path.resolve(base, p);
  if (!fs.existsSync(abs)) throw new Error(`missing source ${k}: ${abs}`);
  return abs;
};
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const assColor = (hex, alpha = 0) => {
  const h = hex.replace('#', '');
  return `&H${alpha.toString(16).padStart(2, '0').toUpperCase()}${h.slice(4, 6)}${h.slice(2, 4)}${h.slice(0, 2)}&`.toUpperCase();
};
const col = (c) => (c && pal[c]) || c || pal.fg;
const ts = (s) => {
  const t = Math.max(0, s);
  const hh = Math.floor(t / 3600); const mm = Math.floor((t % 3600) / 60); const ss = (t % 60).toFixed(2).padStart(5, '0');
  return `${hh}:${String(mm).padStart(2, '0')}:${ss}`;
};
// ASS text: braces and backslashes would become override tags; newlines become \N.
const esc = (s) => String(s).replace(/\\/g, '\u29F5').replace(/[{}]/g, (c) => (c === '{' ? '(' : ')')).replace(/\n/g, '\\N');
const fmtNum = (v, d = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function findTtsPython() {
  if (process.env.EDGE_TTS_PYTHON) return process.env.EDGE_TTS_PYTHON;
  const bin = execFileSync('/bin/sh', ['-c', 'command -v edge-tts'], { encoding: 'utf8' }).trim();
  return fs.readFileSync(bin, 'utf8').split('\n')[0].replace(/^#!/, '').trim();
}
const PY = findTtsPython();

function speak(i, scene) {
  const txt = path.join(work, `s${i}.txt`); const mp3 = path.join(work, `s${i}.mp3`); const wj = path.join(work, `s${i}.words.json`);
  fs.writeFileSync(txt, scene.say);
  let last;
  for (let a = 0; a < 3; a += 1) { // edge-tts occasionally answers NoAudioReceived; retry, never fall back to another voice
    try {
      run(PY, [path.join(HERE, 'tts.py'), voice.name, scene.rate || voice.rate, scene.pitch || voice.pitch, txt, mp3, wj]);
      const w = JSON.parse(fs.readFileSync(wj, 'utf8'));
      // edge-tts pads ~0.5 s of silence at the end; the scene's own pad decides the breath instead
      return { mp3, words: w, dur: Math.min(probe(mp3), w.at(-1).end + 0.12) };
    } catch (e) { last = e; }
  }
  throw last;
}

// Normalize a rect to 16:9 around its centre (zoom never distorts), covering the source: it grows the short side,
// and only shrinks the long side when the source runs out, so a full-frame view crops instead of letterboxing.
function fitRect([x, y, w, h], [bx, by, bw, bh]) {
  let nw = w; let nh = h;
  if (nw / nh > W / H) nh = (nw * H) / W; else nw = (nh * W) / H;
  if (nh > bh) { nh = bh; nw = (nh * W) / H; }
  if (nw > bw) { nw = bw; nh = (nw * H) / W; }
  const cx = x + w / 2; const cy = y + h / 2;
  const nx = Math.min(Math.max(bx, cx - nw / 2), bx + bw - nw); const ny = Math.min(Math.max(by, cy - nh / 2), by + bh - nh);
  return [nx, ny, nw, nh];
}

// ---------- ASS ----------
function assHeader() {
  const S = (name, font, size, primary, secondary, outline, back, bold, borderStyle, outlineW, shadow, align, mv) => `Style: ${name},${font},${size},${primary},${secondary},${outline},${back},${bold},0,0,0,100,100,0,0,${borderStyle},${outlineW},${shadow},${align},${mv},${mv},${mv},1`;
  return `[Script Info]
ScriptType: v4.00+
PlayResX: ${W}
PlayResY: ${H}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
${S('Cap', 'Avenir Next', 54, assColor('#ffffff'), assColor('#ffffff', 0x70), assColor('#000000', 0x30), assColor('#000000', 0x30), -1, 3, 14, 0, 2, 60)}
${S('Big', 'Avenir Next', 110, assColor(pal.fg), assColor(pal.fg), assColor(pal.bg), assColor('#000000', 0xff), -1, 1, 0, 0, 5, 0)}
${S('Label', 'Avenir Next', 40, assColor(pal.bg), assColor(pal.bg), assColor(pal.accent), assColor(pal.accent), -1, 3, 10, 0, 7, 0)}
${S('Mono', 'Menlo', 34, assColor('#e8ecf3'), assColor('#e8ecf3'), assColor('#000000', 0xff), assColor('#000000', 0xff), 0, 1, 0, 0, 7, 0)}
${S('Shape', 'Arial', 20, assColor(pal.accent), assColor(pal.accent), assColor(pal.accent), assColor('#000000', 0xff), 0, 1, 0, 0, 7, 0)}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
}
const ev = (layer, a, b, style, text) => `Dialogue: ${layer},${ts(a)},${ts(b)},${style},,0,0,0,,${text}`;
const rectShape = (w, h) => `m 0 0 l ${Math.round(w)} 0 ${Math.round(w)} ${Math.round(h)} 0 ${Math.round(h)}`;

function kinetic(t, D) {
  const at = t.at ?? 0; const end = t.until ?? D;
  const size = t.size ?? 96; const color = assColor(col(t.color));
  const x = t.x ?? W / 2; const y = t.y ?? H / 2; const an = t.align ?? 5;
  const boxed = t.box ? `\\bord14\\3c${assColor(col(t.box))}\\4c${assColor(col(t.box))}` : '\\bord0';
  const baseTags = `\\an${an}\\fs${size}\\c${color}${boxed}\\shad0`;
  const style = t.box ? 'Label' : 'Big';
  let anim = t.anim || (CALM ? 'fade' : 'rise');
  if (CALM && ['slam', 'pop', 'type'].includes(anim)) anim = 'fade';
  const rise = CALM ? 14 : 40;
  switch (anim) {
    case 'slam': return [ev(3, at, end, style, `{${baseTags}\\pos(${x},${y})\\fscx260\\fscy260\\alpha&HFF&\\t(0,180,\\fscx100\\fscy100\\alpha&H00&)\\fad(0,200)}${esc(t.t)}`)];
    case 'pop': return [ev(3, at, end, style, `{${baseTags}\\pos(${x},${y})\\fscx70\\fscy70\\t(0,140,\\fscx108\\fscy108)\\t(140,260,\\fscx100\\fscy100)\\fad(80,200)}${esc(t.t)}`)];
    case 'fade': return [ev(3, at, end, style, `{${baseTags}\\pos(${x},${y})\\fad(${t.fadeIn ?? 300},250)}${esc(t.t)}`)];
    case 'type': {
      const s = String(t.t); const step = Math.min(0.045, 0.9 / Math.max(1, s.length)); const outE = [];
      for (let k = 1; k <= s.length; k += 1) {
        const a = at + (k - 1) * step; const b = k === s.length ? end : at + k * step;
        outE.push(ev(3, a, b, style, `{${baseTags}\\pos(${x},${y})}${esc(s.slice(0, k))}`));
      }
      return outE;
    }
    default: return [ev(3, at, end, style, `{${baseTags}\\move(${x},${y + rise},${x},${y},0,${CALM ? 320 : 260})\\fad(220,200)}${esc(t.t)}`)];
  }
}

// Word-timed captions: phrases of ≤5 words, split at pauses; the spoken word lights up (\k).
function captions(words, lead, D) {
  const lines = []; let cur = [];
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i]; const nx = words[i + 1];
    cur.push(w);
    const pause = nx ? nx.start - w.end : 1;
    if (cur.length >= 5 || pause > 0.22 || /[.,;:!?]$/.test(w.text)) { lines.push(cur); cur = []; }
  }
  if (cur.length) lines.push(cur);
  return lines.map((ln, j) => {
    const a = lead + ln[0].start; const nextStart = lines[j + 1] ? lead + lines[j + 1][0].start : D - 0.05;
    const b = Math.min(nextStart, lead + ln.at(-1).end + 0.6);
    const parts = ln.map((w, k) => {
      if (CALM) return esc(w.text);
      const nxt = ln[k + 1] ? ln[k + 1].start : w.end;
      const kdur = Math.max(1, Math.round(((k === 0 ? w.start - ln[0].start : 0) + (nxt - w.start)) * 100));
      return `{\\k${kdur}}${esc(w.text)}`;
    });
    return ev(5, a, b, 'Cap', `{\\an2\\pos(${W / 2},${H - 58})\\fad(60,60)}${parts.join(' ')}`);
  });
}

function chrome(i, D, offset, total, scene) {
  const e = [];
  if (scene.chip !== false && scene.type !== 'card' && story.chip) {
    e.push(ev(6, 0, D, 'Label', `{\\an7\\pos(36,30)\\fs28\\bord9\\c${assColor('#ffffff')}\\3c${assColor('#000000', 0x30)}\\4c${assColor('#000000', 0x30)}}${esc(story.chip)}`));
  }
  // progress line: the whole video's elapsed share, so a viewer always knows how much is left
  const p0 = (offset / total) * 100; const p1 = ((offset + D) / total) * 100;
  if (story.progress === true) e.push(ev(7, 0, D, 'Shape', `{\\an7\\pos(0,${H - 8})\\bord0\\c${assColor(pal.accent)}\\fscx${p0.toFixed(2)}\\t(0,${Math.round(D * 1000)},\\fscx${p1.toFixed(2)})\\p1}${rectShape(W, 8)}{\\p0}`));
  return e;
}

function boxEvents(boxes, view, offX, offY, D, width = W, height = H, px = 0, py = 0) {
  const [vx, vy, vw, vh] = view; const kx = width / vw; const ky = height / vh; const e = [];
  for (const b of boxes || []) {
    const [x, y, w, h] = b.rect; const at = b.at ?? 0.3; const c = assColor(col(b.color || 'accent'));
    const ox = px + (x + offX - vx) * kx; const oy = py + (y + offY - vy) * ky; const ow = w * kx; const oh = h * ky;
    const enter = CALM ? '\\fad(260,0)' : '\\3a&HFF&\\fscx118\\fscy118\\t(0,220,\\fscx100\\fscy100\\3a&H00&)';
    e.push(ev(4, at, b.until ?? D, 'Shape', `{\\an5\\pos(${Math.round(ox + ow / 2)},${Math.round(oy + oh / 2)})\\bord${CALM ? 5 : 6}\\shad0\\1a&HFF&\\3c${c}${enter}\\p1}${rectShape(ow, oh)}{\\p0}`));
    if (b.label) {
      const ly = oy + oh + 26 > H - 140 ? oy - 34 : oy + oh + 34;
      e.push(ev(4, at + 0.15, b.until ?? D, 'Label', `{\\an4\\pos(${Math.round(Math.max(30, ox))},${Math.round(ly)})\\fs36\\c${assColor(pal.bg === '#0f1729' ? '#ffffff' : pal.bg)}\\3c${c}\\4c${c}\\fad(150,150)}${esc(b.label)}`));
    }
  }
  return e;
}

// ---------- visuals ----------
// Zoompan over a source padded to 16:9 and prescaled 2× (smooth sub-pixel motion).
function viewFilter(input, info, from, to, D, ease = true) {
  const [sw, sh] = info; const cw = Math.max(sw, Math.ceil((sh * W) / H)); const ch = Math.max(sh, Math.ceil((sw * H) / W));
  const offX = Math.floor((cw - sw) / 2); const offY = Math.floor((ch - sh) / 2);
  const shift = (r) => (r ? [r[0] + offX, r[1] + offY, r[2], r[3]] : [offX, offY, sw, sh]);
  const inside = [offX, offY, sw, sh]; const r0 = fitRect(shift(from), inside); const r1 = fitRect(shift(to || from), inside);
  const K = 2; const t = `(on/${FPS})`; const dur = Math.max(0.5, Math.min(D - 0.2, (to ? (D * 0.7) : 0.01)));
  const p = `min(max(${t}/${dur.toFixed(3)},0),1)`; const e = ease ? `(${p}*${p}*(3-2*${p}))` : p;
  const lerp = (a, b) => `(${a.toFixed(2)}+(${(b - a).toFixed(2)})*${e})`;
  const f = `${input}fps=${FPS},pad=${cw}:${ch}:${offX}:${offY}:color=${pal.bg},scale=${cw * K}:${ch * K}:flags=lanczos,`
    + `zoompan=z='${cw}/${lerp(r0[2], r1[2])}':x='${lerp(r0[0], r1[0])}*${K}':y='${lerp(r0[1], r1[1])}*${K}':d=1:s=${W}x${H}:fps=${FPS}`;
  return { f, view: r1, offX, offY };
}

function clipInput(scene, D) {
  if (scene.still) return { args: ['-loop', '1', '-t', D.toFixed(3), '-i', src(scene.src)], pre: 'setpts=PTS-STARTPTS,', speed: 1, file: src(scene.src) };
  const file = src(scene.src); const start = scene.start ?? 0; const span = (scene.end ?? start + D) - start;
  const speed = span > D + 0.05 ? span / D : 1;
  const pre = speed > 1 ? `setpts=(PTS-STARTPTS)/${speed.toFixed(4)},` : 'setpts=PTS-STARTPTS,';
  const freeze = speed > 1 ? '' : `tpad=stop_mode=clone:stop_duration=${D.toFixed(3)},`;
  return { args: ['-ss', String(start), '-t', String(Math.min(span, 1e5) + 0.5), '-i', file], pre: `${pre}${freeze}`, speed, file };
}

function renderScene(i, scene, D, ass, audio) {
  const outF = path.join(work, `seg${i}.mp4`);
  const bgHex = (scene.bg && col(scene.bg)) || pal.bg;
  const inputs = []; let fc;
  const ev2 = [];
  if (scene.type === 'still' || scene.type === 'clip') {
    let pre = ''; let info;
    if (scene.type === 'still') {
      const f = src(scene.src); info = dims(f);
      inputs.push('-loop', '1', '-t', D.toFixed(3), '-i', f);
    } else {
      const ci = clipInput(scene, D); info = dims(ci.file); inputs.push(...ci.args); pre = ci.pre;
      if (ci.speed > 1.05) ev2.push(...kinetic({ t: `${ci.speed.toFixed(ci.speed < 10 ? 1 : 0)}× speed`, x: W - 40, y: 52, align: 9, size: 30, box: 'panel', color: 'fg', anim: 'fade' }, D));
    }
    const v = viewFilter(`[0:v]${pre}`, info, scene.from, scene.to, D);
    fc = `${v.f},trim=duration=${D.toFixed(3)}[base]`;
    ev2.push(...boxEvents(scene.boxes, v.view, v.offX, v.offY, D));
  } else if (scene.type === 'split') {
    const sides = ['left', 'right'].map((k, j) => {
      const s = scene[k]; const ci = clipInput(s, D); const info = dims(ci.file);
      inputs.push(...ci.args);
      const r = s.rect || [0, 0, info[0], info[1]];
      if (r[0] + r[2] > info[0] || r[1] + r[3] > info[1]) throw new Error(`split ${k} crop exceeds source dimensions`);
      return { ci, r, s };
    });
    const scale = Math.min(...sides.flatMap(({ r }) => [900 / r[2], 760 / r[3]]));
    sides.forEach((sd, j) => {
      sd.pw = Math.max(2, Math.floor(sd.r[2] * scale / 2) * 2);
      sd.ph = Math.max(2, Math.floor(sd.r[3] * scale / 2) * 2);
      sd.x = (j ? 980 : 40) + Math.round((900 - sd.pw) / 2); sd.y = 160 + Math.round((760 - sd.ph) / 2);
      sd.f = `[${j}:v]${sd.ci.pre}fps=${FPS},crop=${sd.r[2]}:${sd.r[3]}:${sd.r[0]}:${sd.r[1]},scale=${sd.pw}:${sd.ph}:flags=lanczos,setsar=1,trim=duration=${D.toFixed(3)}[p${j}]`;
      ev2.push(...kinetic({ t: sd.s.label || (j ? 'AFTER' : 'BEFORE'), x: j ? 980 : 40, y: 112, align: 4, size: 40, color: sd.s.color || 'fg', anim: 'fade' }, D));
      ev2.push(...boxEvents(sd.s.boxes, sd.r, 0, 0, D, sd.pw, sd.ph, sd.x, sd.y));
      if (sd.ci.speed > 1.05) ev2.push(...kinetic({ t: `${sd.ci.speed.toFixed(1)}× speed`, x: j ? 1880 : 940, y: 142, align: 6, size: 28, color: 'dim', anim: 'fade' }, D));
    });
    fc = `color=c=${bgHex}:s=${W}x${H}:r=${FPS}:d=${D.toFixed(3)}[bg];${sides[0].f};${sides[1].f};`
      + `[bg][p0]overlay=${sides[0].x}:${sides[0].y}[b1];[b1][p1]overlay=${sides[1].x}:${sides[1].y},trim=duration=${D.toFixed(3)}[base]`;
  } else {
    inputs.push('-f', 'lavfi', '-i', `color=c=${bgHex}:s=${W}x${H}:r=${FPS}:d=${D.toFixed(3)}`);
    fc = '[0:v]null[base]';
  }
  const assF = path.join(work, `seg${i}.ass`);
  fs.writeFileSync(assF, assHeader() + [...ass, ...ev2].join('\n') + '\n');
  const nIn = inputs.filter((x) => x === '-i').length;
  const lead = scene.lead ?? 0.15;
  fc += `;[base]subtitles=seg${i}.ass,format=yuv420p[v];[${nIn}:a]adelay=${Math.round(lead * 1000)}:all=1,apad,atrim=0:${D.toFixed(3)},aresample=48000[a]`;
  run('ffmpeg', ['-v', 'error', '-y', ...inputs, '-i', audio, '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
    '-t', D.toFixed(3), '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2', outF], { cwd: work });
  return outF;
}

function sceneOverlays(scene, D, first = false) {
  const e = []; const lead = scene.lead ?? 0.15;
  // Frame 0 is the GitHub thumbnail: the opening card is fully drawn on it, never faded in from a blank page.
  const fadeIn = first ? 0 : undefined;
  if (scene.type === 'text') {
    const lines = scene.lines || [];
    lines.forEach((ln, j) => {
      const y = ln.y ?? H / 2 + (j - (lines.length - 1) / 2) * ((ln.size ?? 110) * 1.25);
      e.push(...kinetic({ ...ln, y, at: ln.at ?? lead + j * 0.35 }, D));
    });
  } else if (scene.type === 'stat') {
    const v = Number(scene.value); const d = scene.decimals ?? 0; const steps = CALM ? 1 : 18; const t0 = lead; const t1 = lead + 0.9;
    for (let k = 1; k <= steps; k += 1) {
      const a = t0 + ((k - 1) * (t1 - t0)) / steps; const b = k === steps ? D : t0 + (k * (t1 - t0)) / steps;
      const val = v * (1 - (1 - k / steps) ** 3);
      e.push(ev(3, a, b, 'Big', `{\\an5\\pos(${W / 2},${scene.compare ? 330 : 470})${CALM ? '\\fad(300,0)' : ''}\\fs220\\c${assColor(col(scene.color || 'accent'))}}${esc(fmtNum(val, d))}{\\fs110} ${esc(scene.unit || '')}`));
    }
    if (scene.label) e.push(...kinetic({ t: scene.label, y: scene.compare ? 500 : 650, size: 56, color: 'dim', at: t1 - 0.2 }, D));
    const cmp = scene.compare || []; const max = Math.max(...cmp.map((c) => c.value), 1);
    cmp.forEach((c, j) => {
      const at = t1 + 0.2 + j * 0.45; const y = 640 + j * 130; const wpx = Math.max(12, (1180 * c.value) / max);
      e.push(...kinetic({ t: c.label, x: 520, y: y - 4, align: 6, size: 46, color: 'fg', anim: 'fade', at }, D));
      e.push(ev(3, at, D, 'Shape', `{\\an7\\pos(560,${y - 34})\\bord0\\c${assColor(col(c.color || 'accent'))}\\fscx0\\t(0,600,\\fscx100)\\p1}${rectShape(wpx, 60)}{\\p0}`));
    });
  } else if (scene.type === 'card') {
    // The context beat: ticket key, title, and 1-3 lines of what is implemented, left-aligned like a slide.
    const x = 170; const lines = scene.lines || [];
    e.push(ev(1, 0, D, 'Shape', `{\\an7\\pos(120,250)\\bord0\\c${assColor(pal.accent)}\\fad(${first ? 0 : 200},0)\\p1}${rectShape(10, 250 + lines.length * 78)}{\\p0}`));
    e.push(...kinetic({ t: scene.key || story.ticket || '', x, y: 290, align: 4, size: 44, color: 'accent', anim: 'fade', at: 0, fadeIn }, D));
    e.push(...kinetic({ t: scene.title || '', x, y: 350, align: 7, size: 64, color: 'fg', anim: 'fade', at: 0, fadeIn }, D));
    lines.forEach((t, j) => e.push(...kinetic({ t, x, y: 660 + j * 78, align: 4, size: 46, color: 'dim', anim: 'fade', at: 0, fadeIn }, D)));
  } else if (scene.type === 'verdict') {
    const x = 170; const rows = scene.rows || []; const tag = { open: ['OPEN', 'warn'], block: ['BLOCKING', 'bad'] };
    e.push(...kinetic({ t: scene.title || 'Still open', x, y: 250, align: 4, size: 70, color: 'fg', anim: 'fade', at: 0 }, D));
    rows.forEach((r, j) => {
      const [label, c] = tag[r.state] || tag.open; const y = 400 + j * 118; const at = 0;
      e.push(ev(3, at, D, 'Label', `{\\an4\\pos(${x},${y})\\fs36\\bord10\\c${assColor(pal.bg)}\\3c${assColor(col(c))}\\4c${assColor(col(c))}\\fad(220,0)}${esc(label)}`));
      e.push(...kinetic({ t: r.t, x: x + 270, y, align: 4, size: 48, color: 'fg', anim: 'fade', at }, D));
    });
  } else if (scene.type === 'code') {
    const lines = scene.lines || []; const x = 110; const y = 150; const w = W - 220; const lh = 68; const h = 130 + lines.length * lh;
    e.push(ev(1, 0, D, 'Shape', `{\\an7\\pos(${x},${y})\\bord0\\c${assColor('#11151f')}\\fad(150,0)\\p1}${rectShape(w, h)}{\\p0}`));
    e.push(ev(1, 0, D, 'Shape', `{\\an7\\pos(${x},${y})\\bord0\\c${assColor('#262c3a')}\\fad(150,0)\\p1}${rectShape(w, 64)}{\\p0}`));
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, j) => e.push(ev(2, 0, D, 'Shape', `{\\an7\\pos(${x + 26 + j * 34},${y + 22})\\bord0\\c${assColor(c)}\\p1}${rectShape(20, 20)}{\\p0}`)));
    if (scene.title) e.push(ev(2, 0, D, 'Mono', `{\\an7\\pos(${x + 140},${y + 14})\\fs28\\c${assColor('#9aa4b8')}}${esc(scene.title)}`));
    const span = Math.max(0.4, (D - lead) * 0.6);
    lines.forEach((ln, j) => {
      const L = typeof ln === 'string' ? { t: ln } : ln; const at = L.at ?? lead + (j * span) / Math.max(1, lines.length);
      e.push(ev(2, at, D, 'Mono', `{\\an7\\fs46\\pos(${x + 44},${y + 96 + j * lh})\\c${assColor(L.color ? col(L.color) : '#e8ecf3')}\\fad(90,0)}${esc(L.t)}`));
    });
  }
  for (const t of scene.texts || []) e.push(...kinetic(t, D));
  return e;
}

// ---------- build ----------
const scenes = story.scenes;
const voiced = scenes.map((s, i) => ({ ...speak(i, s), scene: s }));
const durs = voiced.map(({ dur, scene }) => Math.max(scene.minDur ?? (scene.beat === 'comparison' ? 0 : 2), (scene.lead ?? 0.15) + dur + (scene.pad ?? 0.25)));
const total = durs.reduce((a, b) => a + b, 0);
const speechEnds = voiced.map(({ words }) => words.at(-1).end);
const timingErrors = lintTiming(story, durs, speechEnds);
if (timingErrors.length) {
  for (const m of timingErrors) console.error(`FAIL: ${m}`);
  if (!force) process.exit(1);
  fails.push(...timingErrors);
}
const beatSecs = {};
scenes.forEach((s, i) => { beatSecs[s.beat] = (beatSecs[s.beat] || 0) + durs[i]; });
console.log(`beats: ${Object.entries(beatSecs).map(([k, v]) => `${k} ${v.toFixed(1)} s`).join(', ')}`);
const segs = []; const srt = []; let offset = 0;
voiced.forEach(({ words, mp3, scene }, i) => {
  const D = durs[i];
  const ass = [...chrome(i, D, offset, total, scene), ...sceneOverlays(scene, D, i === 0)];
  if (scene.captions !== false) ass.push(...captions(words, scene.lead ?? 0.15, D));
  segs.push(renderScene(i, scene, D, ass, mp3));
  srt.push({ a: offset + (scene.lead ?? 0.15), b: offset + D - 0.1, t: scene.say });
  console.log(`scene ${i} ${scene.type.padEnd(5)} ${D.toFixed(2)}s  ${scene.say.slice(0, 70)}`);
  offset += D;
});
const list = path.join(work, 'concat.txt');
fs.writeFileSync(list, segs.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
const final = path.join(out, 'short.mp4');
run('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', final]);
const srtTs = (s) => ts(s).replace(/^(\d):/, '0$1:').replace('.', ',') + '0';
fs.writeFileSync(path.join(out, 'captions.srt'), srt.map((c, i) => `${i + 1}\n${srtTs(c.a)} --> ${srtTs(c.b)}\n${c.t}\n`).join('\n'));
const every = Math.max(1, total / 15);
run('ffmpeg', ['-v', 'error', '-y', '-i', final, '-vf', `fps=1/${every.toFixed(3)},scale=480:-1,tile=5x3:padding=6:color=white`, '-frames:v', '1', path.join(out, 'sheet.png')]);

const finalDur = probe(final);
const words = scenes.map((s) => s.say).join(' ').split(/\s+/).filter(Boolean).length;
const prov = {
  id: story.id, pr: story.pr, ticket: story.ticket, angle: story.angle, palette: story.palette, motion: CALM ? 'calm' : 'lively',
  final: isFinal, builtAt: new Date().toISOString(), host: os.hostname().replace(/\..*/, ''), duration: Number(finalDur.toFixed(2)),
  wordsPerMinute: Math.round((words / finalDur) * 60), voice,
  beats: Object.fromEntries(Object.entries(beatSecs).map(([k, v]) => [k, Number(v.toFixed(2))])),
  scenes: scenes.map((s, i) => ({
    ...s,
    dur: Number(durs[i].toFixed(2)),
    speechEnd: Number(((s.lead ?? 0.15) + speechEnds[i]).toFixed(2)),
    silentTail: Number((durs[i] - (s.lead ?? 0.15) - speechEnds[i]).toFixed(2)),
  })),
  sources: Object.fromEntries(Object.keys(story.sources || {}).map((k) => [k, { path: story.sources[k], sha256: sha(src(k)) }])),
  ui: story.ui || null,
  overriddenFailures: force ? fails : [], lintWarnings: [...lint.warnings, ...repeat.warnings],
  output: { file: 'short.mp4', sha256: sha(final) }, facts: story.provenance || {},
};
let at = 0;
const screen = screenShort(final, scenes.map((s, i) => ({ beat: s.beat, a: at, b: (at += durs[i]) })));
for (const f of screen.flags) console.error(`FLAG: ${f}`);
console.log(`screen: ${screen.pass ? 'PASS' : 'FLAG'} (frame 0 Y ${screen.frame0.ymin}-${screen.frame0.ymax}, ${screen.meanVolumeDb} dB)`);
prov.screen = screen;
if (isFinal && !screen.pass && force) prov.overriddenFailures.push(...screen.flags);
fs.writeFileSync(path.join(out, 'provenance.json'), JSON.stringify(prov, null, 2));
if (isFinal && !screen.pass && !force) { console.error('FAIL: --final refuses a flagged screen; fix the build (or --force, recorded)'); process.exit(1); }
if (isFinal) ledgerAppend(story, prov); else console.log('draft: ledger not updated (pass --final for the published build)');
console.log(`\n${final}\n${finalDur.toFixed(1)} s, ${prov.wordsPerMinute} wpm, ${scenes.length} scenes, longest shot ${Math.max(...durs).toFixed(1)} s`);
