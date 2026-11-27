#!/usr/bin/env node
// Turns a published consumer page (or a bare block snippet) into a local Milo test page under tmp/, which
// `aem up` serves as-is. The page gets Milo's own head (libs/scripts/scripts.js from the same origin), so
// whichever checkout serves it is the code under test.
//
//   node .agents/skills/milo-local-testpage/make-testpage.mjs \
//     --from https://main--da-bacom-blog--adobecom.aem.live/blog/some-article \
//     --rename blog-header=forge-blog-header,ai-summary=forge-ai-summary \
//     --meta header=off,footer=off \
//     --out tmp/perf/blog-article.html
//
//   node .agents/skills/milo-local-testpage/make-testpage.mjs --block my-block --html snippet.html \
//     [--foundation c2] --out tmp/perf/my-block.html
//
// --from      a page to copy (its <main> and its <meta name=...> tags; scripts and links are dropped)
// --html      a file with block markup (the EDS table shape: <div class="block"><div><div>cell</div></div></div>)
// --rename    old=new block class renames, comma-separated
// --meta      name=value metadata overrides, comma-separated (value "-" removes the tag)
// --drop      CSS selectors removed from <main> before saving, comma-separated
// --foundation c2 adds <meta name="foundation" content="c2"> (C2 blocks load from libs/c2/blocks)
// --repo      the Milo checkout that will serve the page (default: cwd); its libs/utils/utils.js block lists
//             decide which names load
// --changed   git range of the change under test (e.g. origin/stage...HEAD, run in --repo): the blocks it
//             touches (libs/blocks/<name>, libs/c2/blocks/<name>) must be on the page's foundation; one that
//             is not authored is noted (another block may load it; perf.mjs --changed proves it ran)
// --allow-mismatch  write the page even when a check below fails
//
// Nothing is renamed for you. The page's foundation is its own metadata (`foundation: c2`, else C1, or
// --foundation), and the page is checked as authored: every block must load on that foundation (on C2, a
// C1-only name is refused and a site block 404s locally), and the changed blocks must be there. A block that
// does not load changes the page's height, requests and shifts, so a failed check is an error.
// --rename is authoring, not a fix-up: use it to author the C2 (or C1) names of the blocks under test.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const argv = process.argv.slice(2);
const a = {};
for (let i = 0; i < argv.length; i += 1) {
  if (!argv[i].startsWith('--')) continue;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) a[argv[i].slice(2)] = true; else { a[argv[i].slice(2)] = v; i += 1; }
}
const list = (s) => (s ? String(s).split(',').map((x) => x.trim()).filter(Boolean) : []);
const pairs = (s) => Object.fromEntries(list(s).map((p) => { const i = p.indexOf('='); return [p.slice(0, i), p.slice(i + 1)]; }));
if (!a.out || (!a.from && !a.html)) {
  process.stderr.write('need --out and one of --from <url> or --html <file>\n');
  process.exit(2);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let metas = {}; let title = 'Milo test page'; let main = '';

if (a.from) {
  const resp = await fetch(a.from);
  if (!resp.ok) { process.stderr.write(`${a.from} answered ${resp.status}\n`); process.exit(1); }
  const html = await resp.text();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  // Parse only: no network, no scripts. URLs are made absolute against the source page by hand.
  await page.route('**/*', (r) => r.abort());
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  ({ metas, title, main } = await page.evaluate(({ base, rename, drop }) => {
    const m = {};
    for (const el of document.head.querySelectorAll('meta[name], meta[property]')) {
      const k = el.getAttribute('name') || el.getAttribute('property');
      if (k === 'viewport' || k === 'head-loaded') continue;
      m[k] = el.getAttribute('content') || '';
    }
    const mainEl = document.querySelector('main');
    for (const s of drop) mainEl.querySelectorAll(s).forEach((n) => n.remove());
    for (const [from, to] of Object.entries(rename)) {
      mainEl.querySelectorAll(`div.${CSS.escape(from)}`).forEach((n) => { n.classList.replace(from, to); });
    }
    const abs = (v) => { try { return new URL(v, base).href; } catch { return v; } };
    for (const n of mainEl.querySelectorAll('[href]')) { const v = n.getAttribute('href'); if (!v.startsWith('#')) n.setAttribute('href', abs(v)); }
    for (const n of mainEl.querySelectorAll('[src]')) n.setAttribute('src', abs(n.getAttribute('src')));
    for (const n of mainEl.querySelectorAll('[srcset]')) {
      n.setAttribute('srcset', n.getAttribute('srcset').split(',').map((part) => { const [u, ...rest] = part.trim().split(/\s+/); return [abs(u), ...rest].join(' '); }).join(', '));
    }
    for (const k of ['og:image', 'og:image:secure_url', 'twitter:image', 'og:url']) if (m[k]) m[k] = abs(m[k]);
    return { metas: m, title: document.title, main: mainEl.innerHTML };
  }, { base: a.from, rename: pairs(a.rename), drop: list(a.drop) }));
  await browser.close();
} else {
  main = `<div>${readFileSync(a.html, 'utf8')}</div>`;
  for (const [from, to] of Object.entries(pairs(a.rename))) main = main.replaceAll(`class="${from}`, `class="${to}`);
}

if (a.foundation) metas.foundation = a.foundation;
const foundation = metas.foundation === 'c2' ? 'c2' : 'c1';

// Block lists of the serving checkout, as getBlockData in libs/utils/utils.js applies them.
const repo = resolve(a.repo || '.');
const utilsSrc = readFileSync(resolve(repo, 'libs/utils/utils.js'), 'utf8');
const listOf = (name) => {
  const m = utilsSrc.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  return new Set(m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : []);
};
const C1 = listOf('C1_BLOCKS'); const C2 = listOf('C2_BLOCKS');
if (!C1.size || !C2.size) { process.stderr.write('no C1_BLOCKS/C2_BLOCKS in libs/utils/utils.js; run from a Milo checkout or pass --repo\n'); process.exit(2); }
const authored = [...new Set([...main.matchAll(/<div class="([a-z0-9-]+)/g)].map((x) => x[1]))];
const problems = [];
for (const n of authored) {
  if (foundation === 'c2' && !C2.has(n)) {
    if (C1.has(n)) problems.push(`${n} is a C1 block: Milo refuses it on this C2 page`);
    else if (!n.endsWith('-metadata')) problems.push(`${n} is on neither block list: it loads from the site's codeRoot, which a local Milo does not serve`);
  }
  if (foundation === 'c1' && !C1.has(n) && !n.endsWith('-metadata')) {
    problems.push(C2.has(n) ? `${n} is a C2 block on a C1 page: it loads from libs/blocks, not libs/c2/blocks` : `${n} is on neither block list: it loads from the site's codeRoot, which a local Milo does not serve`);
  }
}
let changed = [];
if (a.changed) {
  const { execFileSync } = await import('node:child_process');
  const files = execFileSync('git', ['-C', repo, 'diff', '--name-only', a.changed], { encoding: 'utf8' }).split('\n');
  const seen = new Map();
  for (const f of files) {
    const m = f.match(/^libs\/(c2\/)?blocks\/([^/]+)\//);
    if (m) seen.set(m[2], m[1] ? 'c2' : 'c1');
  }
  changed = [...seen].map(([name, fnd]) => ({ name, foundation: fnd, onPage: authored.includes(name) }));
  for (const c of changed) {
    if (c.foundation !== foundation) problems.push(`changed block ${c.name} is ${c.foundation}, but the page is ${foundation}`);
    else if (!c.onPage) process.stderr.write(`note: changed block ${c.name} is not authored on the page; it counts only if another block loads it (perf.mjs --changed checks that its files are requested)\n`);
  }
  if (!seen.size) process.stderr.write(`${a.changed} changes no block folder; nothing to require on the page\n`);
}
process.stderr.write(`foundation: ${foundation} (${a.foundation ? '--foundation' : metas.foundation ? 'page metadata' : 'no foundation metadata'})\n`);
process.stderr.write(`blocks: ${authored.join(', ') || 'none'}\n`);
if (changed.length) process.stderr.write(`changed: ${changed.map((c) => `${c.name} (${c.foundation}${c.onPage ? ', on the page' : ''})`).join(', ')}\n`);
for (const p of problems) process.stderr.write(`mismatch: ${p}\n`);
if (problems.length && !a['allow-mismatch']) {
  process.stderr.write('page not written: author the page with the blocks the change touches, on their foundation (or pass --allow-mismatch)\n');
  process.exit(1);
}

// Milo's getMetadata reads names with a colon from `property`, the rest from `name`.
const metaTags = Object.entries(metas)
  .map(([k, v]) => `<meta ${k.includes(':') ? 'property' : 'name'}="${esc(k)}" content="${esc(v)}">`)
  .join('\n    ');

const out = `<!DOCTYPE html>
<html>
  <head>
    <title>${esc(title)}</title>
    <!-- generated by .agents/skills/milo-local-testpage/make-testpage.mjs${a.from ? ` from ${esc(a.from)}` : ''}; foundation ${foundation} -->
    ${metaTags}
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="/libs/scripts/scripts.js" type="module"></script>
    <link rel="icon" href="data:," size="any">
    <style>body { display: none; }</style>
  </head>
  <body>
    <header></header>
    <main>${main}</main>
    <footer></footer>
  </body>
</html>
`;
const file = resolve(a.out);
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, out);
process.stdout.write(`${file}\n`);
