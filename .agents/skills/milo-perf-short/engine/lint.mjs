// Script lint + anti-repetition ledger for pr-short (SKILL.md §3).
// Vendored from Adobe-acom/forgeflex .agents/skills/pr-short/engine @5479db43. milo-perf-short: changes are marked
// `milo-perf-short:`; the ledger is shared with pr-short on purpose (one writer's tics across all shorts).
//   node lint.mjs <story.json>        prints errors/warnings; exit 1 on any error
// Imported by build.mjs, which refuses to build on an error unless --force.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const LEDGER = process.env.PR_SHORTS_LEDGER || path.join(os.homedir(), '.cache', 'pr-short', 'ledger.jsonl');

// Phrases that make narration sound generated or padded (SKILL.md §3.4). Case-insensitive, whole phrase.
export const BANNED = [
  'seamless', 'seamlessly', "let's dive in", 'dive into', 'deep dive', 'game-changer', 'game changer', 'in this video',
  'in this pr', 'this pr introduces', 'this pull request', 'robust', 'leverage', 'leverages', 'ever wondered',
  'not only', 'but also', 'here is the before and after', "here's the before and after", 'before and after',
  'unlock', 'unleash', 'elevate', 'empower', 'supercharge', 'streamline', 'cutting-edge', 'state-of-the-art',
  'revolutionize', 'delve', 'tapestry', 'in today', "in today's", 'it is worth noting', "it's worth noting",
  'without further ado', 'buckle up', 'stay tuned', 'smash that', 'like and subscribe', 'enhanced', 'enhances',
  'comprehensive', 'effortless', 'effortlessly', 'boasts', 'meticulous', 'testament', 'ensures that',
  'a new era', 'look no further', 'say goodbye', 'say hello to', 'the result?', 'the best part?', 'imagine a world',
];
export const BEATS = ['context', 'comparison', 'verdict'];
export const BEAT_WORDS = { context: 18, comparison: 46, verdict: 16 };
export const MAX_WORDS = 70;
export const MAX_SECONDS = 30;
export const ANGLES = ['side-by-side', 'root-cause', 'number', 'boundary', 'walkthrough', 'honest-gap', 'myth', 'reverse'];

const words = (t) => t.split(/\s+/).filter(Boolean);
const opener = (s, n) => words(s.toLowerCase().replace(/[^a-z0-9\s']/g, '')).slice(0, n).join(' ');

export function lintStory(story) {
  const errors = []; const warnings = [];
  const scenes = story.scenes || [];
  const say = scenes.map((s) => s.say || '').join(' ');
  const lower = ` ${say.toLowerCase()} `;
  if (story.angle && !ANGLES.includes(story.angle)) errors.push(`angle must be one of ${ANGLES.join(', ')}`);
  if (scenes.length > 4) errors.push('use a context card, one or two comparisons, and an optional unresolved-topic ending; merge extra scenes');
  const order = scenes.map((sc) => BEATS.indexOf(sc.beat));
  scenes.forEach((sc, i) => { if (order[i] < 0) errors.push(`scene ${i}: beat must be one of ${BEATS.join(', ')}`); });
  for (let i = 1; i < order.length; i += 1) if (order[i] < order[i - 1]) errors.push(`scene ${i}: beat "${scenes[i].beat}" after "${scenes[i - 1].beat}"; keep ${BEATS.join(' → ')}`);
  for (const b of ['context', 'comparison']) if (!scenes.some((sc) => sc.beat === b)) errors.push(`missing beat "${b}"`);
  if (scenes[0] && scenes[0].type !== 'card') errors.push('scene 0 must be a card: ticket key, title, what is implemented');
  if (scenes.at(-1) && !['comparison', 'verdict'].includes(scenes.at(-1).beat)) errors.push('end on the comparison, or an unresolved-topic verdict');
  for (const b of BEATS) {
    const nb = words(scenes.filter((sc) => sc.beat === b).map((sc) => sc.say || '').join(' ')).length;
    if (nb > BEAT_WORDS[b]) errors.push(`beat "${b}" has ${nb} words; budget ${BEAT_WORDS[b]} (~${Math.round(BEAT_WORDS[b] / 3)} s)`);
  }
  // UI provenance (SKILL.md §2): the change is shown on the real page it affects.
  const ui = story.ui || {};
  const uiKeys = ui.sources || [];
  if (!ui.surface && !ui.none && !ui.blocker) {
    errors.push('ui missing: set ui.surface + ui.sources (real page recordings), ui.none (why the change has no UI), or ui.blocker (what stopped the real UI after a page probe)');
  } else if (ui.surface) {
    if (!uiKeys.length || uiKeys.some((k) => !(story.sources || {})[k])) errors.push('ui.sources must name keys in sources that are real page recordings');
    if (!ui.probe) errors.push('ui.probe missing: record the page probe that showed before and after differ (SKILL.md §2.0)');
    // milo-perf-short: a comparison may also be the scorecard still, rendered by record.mjs from the measured
    // report.json; it must name that file in `evidence` (numbers on screen come from a run, never typed in).
    for (const sc of scenes.filter((s) => s.beat === 'comparison' && !(s.type === 'still' && s.evidence))) {
      if (sc.type !== 'split' || ![sc.left?.src, sc.right?.src].every((k) => k && uiKeys.includes(k))) {
        errors.push(`each UI comparison must be a split showing both ui.sources recordings of the real ${ui.surface}`);
      }
      if (sc.left?.src && sc.right?.src && (story.sources?.[sc.left.src] ?? sc.left.src) === (story.sources?.[sc.right.src] ?? sc.right.src)) {
        errors.push('UI comparison needs different before and after sources');
      }
      if (![...(sc.left?.boxes || []), ...(sc.right?.boxes || [])].length) errors.push('UI comparison needs a source-coordinate highlight box on the changed region');
    }
  } else if (ui.blocker) {
    warnings.push(`no real UI: ${ui.blocker} (disclose it on screen and in the PR comment)`);
  }
  const card = scenes.find((sc) => sc.type === 'card');
  if (card && (!card.title || !(card.lines || []).length || card.lines.length > 3)) errors.push('card needs a title and 1-3 lines of what is implemented');
  const verdict = scenes.find((sc) => sc.type === 'verdict');
  if (verdict) {
    const rows = verdict.rows || [];
    if (!rows.length || rows.length > 3) errors.push('verdict needs 1-3 unresolved-topic rows');
    if (rows.some((r) => !['open', 'block'].includes(r.state))) errors.push('verdict rows must contain only open questions, unfinished work or blockers (open or block)');
  }
  for (const p of BANNED) {
    const re = new RegExp(`(^|[^a-z])${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i');
    if (re.test(lower)) errors.push(`banned phrase: "${p}"`);
  }
  const n = words(say).length;
  if (n > MAX_WORDS) errors.push(`${n} words: over ${MAX_WORDS}; shorten the script, not the viewing time`);
  // The opening line is spoken over the card: concrete, no filler, no ticket number read aloud.
  const hook = scenes[0]?.say || '';
  if (/^(so|today|hi|hey|welcome|okay|alright|this pr|this ticket|in this|mwpw)\b/i.test(hook)) errors.push(`opening line starts with filler: "${hook.split(' ').slice(0, 3).join(' ')}"`);
  if (/MWPW[- ]?\d/i.test(say)) errors.push('do not read the ticket key aloud; it is on the card and the chip');
  for (const [i, s] of scenes.entries()) {
    if (s.beat === 'context' && s.type !== 'card') errors.push(`scene ${i}: context must be a card`);
    if (s.beat === 'verdict' && s.type !== 'verdict') errors.push(`scene ${i}: verdict must be a verdict`);
    if (s.type === 'code' && !s.evidence) errors.push(`scene ${i}: code card needs "evidence" naming the command or file it reproduces (no invented output)`);
    if ((s.type === 'still' || s.type === 'clip') && !s.src) errors.push(`scene ${i}: ${s.type} needs src`);
    if (s.type === 'split') {
      for (const side of ['left', 'right']) {
        const panel = s[side];
        if (!panel?.src) errors.push(`scene ${i}: split ${side} needs src`);
        const validRect = (r) => Array.isArray(r) && r.length === 4 && r.every(Number.isFinite) && r[0] >= 0 && r[1] >= 0 && r[2] > 0 && r[3] > 0;
        if (panel?.rect && !validRect(panel.rect)) errors.push(`scene ${i}: split ${side} crop must be [x,y,width,height] with positive size`);
        for (const b of panel?.boxes || []) {
          if (!validRect(b.rect)) {
            errors.push(`scene ${i}: split ${side} box must be a source-pixel rect with positive size`);
          } else if (validRect(panel.rect)) {
            const [x, y, w, h] = panel.rect; const [bx, by, bw, bh] = b.rect;
            if (bx < x || by < y || bx + bw > x + w || by + bh > y + h) errors.push(`scene ${i}: split ${side} box lies outside its crop`);
          }
        }
      }
      if ((s.boxes || []).length) errors.push(`scene ${i}: put split boxes inside left.boxes or right.boxes`);
    }
  }
  const todo = JSON.stringify(story).match(/TODO/g)?.length ?? 0;
  if (todo) errors.push(`${todo} TODO placeholder(s) from the template remain: fill them from the recording`);
  if (!story.provenance || !Object.keys(story.provenance).length) errors.push('provenance is empty: name commits, page, fetch time and disclosures');
  return { errors, warnings };
}

export function lintTiming(story, durations, speechEnds) {
  const errors = [];
  if (durations.length !== story.scenes.length || durations.some((d) => !Number.isFinite(d) || d <= 0)) return ['scene durations must be positive finite seconds, one per scene'];
  if (speechEnds !== undefined && (!Array.isArray(speechEnds) || speechEnds.length !== durations.length || speechEnds.some((t) => !Number.isFinite(t) || t < 0))) return ['speech ends must be nonnegative finite seconds, one per scene'];
  const total = durations.reduce((a, b) => a + b, 0);
  if (total > MAX_SECONDS) errors.push(`duration ${total.toFixed(1)} s exceeds ${MAX_SECONDS} s`);
  const comparison = durations.reduce((sum, d, i) => sum + (story.scenes[i].beat === 'comparison' ? d : 0), 0);
  if (comparison < total / 2) errors.push('comparison must occupy at least half the short; shorten context or status instead of padding the comparison');
  for (const [i, s] of story.scenes.entries()) {
    if (s.beat !== 'comparison' && durations[i] < 2) errors.push(`${s.beat} needs at least 2 seconds to read`);
    if (speechEnds) {
      const end = (s.lead ?? 0.15) + speechEnds[i];
      const tail = durations[i] - end;
      if (tail < 0) errors.push(`scene ${i}: narration extends past its scene`);
      else if (tail > 1 && !(typeof s.holdReason === 'string' && s.holdReason.trim())) errors.push(`scene ${i}: ${tail.toFixed(1)} s after narration; remove padding or explain an essential evidence hold with holdReason`);
    }
  }
  return errors;
}

// Drift gate (adapted from video-demo's preflight): a published short must show the code the PR now holds.
// provenance.head is the PR head SHA the after recording contains; current is the PR's live head.
export function headDrift(story, current, why = '') {
  const head = story.provenance?.head;
  if (!head) return 'provenance.head missing: record the PR head SHA the after recording contains';
  if (!current) return `could not read the PR head to compare with provenance.head${why ? ` (${why})` : ''}; publish only once it can be checked`;
  const a = String(head).toLowerCase(); const b = String(current).toLowerCase();
  if (a.length < 7 || !(b.startsWith(a) || a.startsWith(b))) return `PR head moved to ${b.slice(0, 12)} after the recording of ${a.slice(0, 12)}: re-record the after side (and before, if the base matters) before publishing`;
  return null;
}

function readLedger() {
  try { return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; }
}
const shape = (story) => (story.scenes || []).map((s) => s.type).join('>');

export function ledgerCheck(story, recent = 12) {
  const errors = []; const warnings = [];
  const prior = readLedger().filter((e) => e.id !== story.id).slice(-recent);
  if (!prior.length) return { errors, warnings };
  const hook3 = opener(story.scenes?.[0]?.say || '', 3);
  if (prior.some((e) => e.hook3 === hook3)) warnings.push(`opening matches a recent short ("${hook3}"); keep it only if it explains this ticket precisely`);
  const recentSay = new Set(prior.flatMap((e) => e.phrases || []));
  const mine = phrases(story);
  const reused = mine.filter((p) => recentSay.has(p));
  if (reused.length >= 2) warnings.push(`check repeated wording for specificity: ${reused.slice(0, 3).map((p) => `"${p}"`).join(', ')}`);
  return { errors, warnings };
}

// Distinctive 4-word phrases, to catch a writer's tics across shorts.
function phrases(story) {
  const w = words((story.scenes || []).map((s) => s.say).join(' ').toLowerCase().replace(/[^a-z0-9\s']/g, ' '));
  const out = new Set();
  for (let i = 0; i + 4 <= w.length; i += 1) out.add(w.slice(i, i + 4).join(' '));
  return [...out];
}

export function ledgerAppend(story, prov) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  const entry = { id: story.id, pr: story.pr, at: prov.builtAt, angle: story.angle, palette: story.palette,
    hook3: opener(story.scenes?.[0]?.say || '', 3), shape: shape(story), duration: prov.duration, phrases: phrases(story) };
  const rest = readLedger().filter((e) => e.id !== story.id);
  fs.writeFileSync(LEDGER, [...rest, entry].map((e) => JSON.stringify(e)).join('\n') + '\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const story = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const a = lintStory(story); const b = ledgerCheck(story);
  for (const m of [...a.warnings, ...b.warnings]) console.log(`warn: ${m}`);
  for (const m of [...a.errors, ...b.errors]) console.log(`FAIL: ${m}`);
  const words2 = (story.scenes || []).map((s) => s.say).join(' ').split(/\s+/).filter(Boolean).length;
  console.log(`${story.scenes?.length ?? 0} scenes, ${words2} words; build checks duration, comparison share and silent padding`);
  process.exit(a.errors.length + b.errors.length ? 1 : 0);
}
