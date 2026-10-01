// spectrum2 preview blocks for the milo site.
//
// Opt-in per page, never on by default: page metadata `spectrum2 | on`, or `?spectrum2=on`
// on the URL (`?spectrum2=off` beats the metadata). Optional, metadata or query (query wins):
//   spectrum2-set    <slug>.<hash8>   a set listed in manifest.js: its look.css REPLACES the token
//                                     sheet and its families get the set class before decorate
//   spectrum2-theme  <id>.<hash8> | @<channel>   (ignored with a set)
// A set or theme that is not in manifest.js falls back to the default token sheet.
// Without the opt-in libs/scripts/scripts.js never imports this file.
//
// How it works. milo libs/utils/utils.js getBlockData ends with
//   if (mep?.blocks?.[name]) path = mep.blocks[name];
// which beats milo's C1/C2/codeRoot resolution, so every block name a spectrum2 family owns
// is pointed at /spectrum2/... here. MEP/Target REPLACE config.mep when they start
// (personalization.js), so a setter re-applies these paths on every assignment.
// The page must stay C1: on a `foundation: c2` page milo refuses every C1 name first.
import M from './manifest.js';

const ROOT = new URL('.', import.meta.url).href.replace(/\/$/, '');
const qs = new URLSearchParams(window.location.search);
// Milo's author-only block notifications (pink outline, Obsolete / Not Consonant labels) are hidden on a
// spectrum2 page; `?notifications=on` shows them.
if (qs.get('notifications') === 'on') document.documentElement.classList.add('spectrum2-notifications');
const meta = (name) => document.head.querySelector(`meta[name="${name}"]`)?.content?.trim() || null;
const opt = (name) => qs.get(name) || meta(name);
const warn = (...a) => console.warn('[spectrum2]', ...a); // eslint-disable-line no-console
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export function spectrum2Requested() {
  const q = qs.get('spectrum2');
  if (q === 'off') return false;
  return q === 'on' || meta('spectrum2')?.toLowerCase() === 'on';
}

const link = (href, where, data = {}) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  Object.assign(l.dataset, data);
  where.append(l);
  return l;
};

// A theme value -> a file under themes/. Anything not shipped here uses the default sheet,
// so a page that names another theme still gets exactly one token sheet and no 404.
function themeFile(value) {
  const pin = value?.startsWith('@') ? M.channels[value.slice(1)] : value;
  if (pin && M.themes[pin]) return { file: M.themes[pin], pin };
  if (value) warn(`spectrum2-theme "${value}" is not available, using ${M.defaultTheme}`);
  return { file: M.themes[M.defaultTheme], pin: M.defaultTheme };
}

// Call once, right after setConfig() and before loadArea().
export default function spectrum2(config) {
  // 0. Icons. milo decorateSVG takes an icon's URL from the link TEXT and turns an .aem./.hlx. URL
  // into a path on THIS site. A doc written for a business.adobe.com page may name its icons by
  // that site's preview host, whose /assets/ milo does not have: point those at the public host.
  const PUBLIC = { 'da-bacom': 'https://business.adobe.com', bacom: 'https://business.adobe.com' };
  const PREVIEW = /^[a-z0-9-]+--([a-z0-9-]+)--adobecom\.(?:aem|hlx)\.(?:page|live)$/;
  document.querySelectorAll('main a').forEach((a) => {
    const [first, ...rest] = a.textContent.split('|');
    if (!first.trim().endsWith('.svg')) return;
    try {
      const u = new URL(first.trim());
      const host = PUBLIC[u.hostname.match(PREVIEW)?.[1]];
      if (host) a.textContent = [`${host}${u.pathname}`, ...rest].join(' |');
    } catch { /* not a URL: milo leaves it alone too */ }
  });

  const setId = opt('spectrum2-set');
  const set = setId ? M.sets[setId] || null : null;
  if (setId && !set) warn(`spectrum2-set "${setId}" is not available, using the default token sheet`);

  // 1. Block paths. A set family's members go through the set's shim (class before decorate).
  const blocks = {};
  Object.entries(M.members).forEach(([name, family]) => {
    if (set?.members.includes(name)) blocks[name] = `${ROOT}/sets/${setId}/shim/${name}`;
    else blocks[name] = name === family ? `${ROOT}/blocks/${family}` : `${ROOT}/alias/${name}`;
  });
  const withOurs = (v) => {
    if (v && typeof v === 'object') v.blocks = { ...(v.blocks || {}), ...blocks };
    return v;
  };
  let mep = withOurs(config.mep || {});
  Object.defineProperty(config, 'mep', {
    configurable: true,
    enumerable: true,
    get() { return mep; },
    set(v) { mep = withOurs(v); },
  });

  // 1b. Prologues. A section's opening heading (a rich-content root, `data-spectrum2-prologue`)
  // belongs INSIDE the section it heads, spanning its grid, so that section is padded once.
  // A doc may author the heading as a section of its own right before it. Put it back before
  // milo decorates, so the rhythm, the grid span and rich-content's section ground (a prologue's
  // authored colour covers its whole section) come out right. A doc that marks its prologues
  // (block option `prologue` on the text root) is taken at its word. Otherwise, and only on a
  // doc whose own metadata opts in (not any milo page tried with ?spectrum2=on), a prologue is a
  // section of heading-family roots only, holding a heading, right before a section with a
  // non-heading block that is not a band.
  const heading = new Set(Object.keys(M.members).filter((n) => M.members[n] === 'rich-content'));
  const isHeading = (el) => el.matches('div[class]') && heading.has(el.classList[0]);
  const metaRow = (w, key) => [...w.querySelectorAll(':scope > .section-metadata > div')]
    .find((row) => row.children[0]?.textContent.trim().toLowerCase() === key)?.children[1];
  const marked = !!document.querySelector('main > div > div.prologue');
  const isPrologue = (w) => {
    const kids = [...w.children];
    if (!kids.length || !kids.every(isHeading)) return false;
    if (marked) return kids.every((el) => el.classList.contains('prologue'));
    if (meta('spectrum2')?.toLowerCase() !== 'on') return false;
    return kids.some((el) => el.querySelector('h1, h2, h3, h4, h5, h6'));
  };
  const wrappers = [...document.querySelectorAll('main > div')];
  let prologues = 0;
  wrappers.forEach((w, i) => {
    const next = wrappers[i + 1];
    if (!next || !isPrologue(w)) return;
    const body = [...next.children]
      .filter((el) => el.matches('div[class]') && !M.neutral.includes(el.classList[0]));
    if (body.every(isHeading)) return;
    if (/(^|,)\s*no spacing\s*(,|$)/i.test(metaRow(next, 'style')?.textContent || '')) return;
    const heads = [...w.children];
    heads.forEach((el) => { el.dataset.spectrum2Prologue = ''; });
    // milo's handleMasonry hands spans out in child order: the heading takes a full-width track.
    const masonry = metaRow(next, 'masonry');
    if (masonry) {
      masonry.textContent = [...heads.map(() => 'full-width'), masonry.textContent.trim()].join(', ');
    }
    next.prepend(...heads);
    w.remove();
    prologues += 1;
  });

  // 1c. milo's handleMasonry (section-metadata.js) also adds `masonry-up`, a marker no milo css
  // reads, but it makes a masonry section match the families' N-up rules (`:is([class*="-up"] *)`),
  // which would turn a prologue into a padded card. The section only needs `masonry-layout`, so
  // drop the marker as milo writes it (it is added after this runs, while milo decorates).
  const main = document.querySelector('main');
  const unUp = new MutationObserver((records) => records.forEach(({ target: t }) => {
    // remove() rewrites the attribute even with no such token (a new record, so a loop): test.
    if (t.classList.contains('section') && t.classList.contains('masonry-up')) {
      t.classList.remove('masonry-up');
    }
  }));
  if (main) unUp.observe(main, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // 2. ONE token sheet: the set's look, else the theme (metadata/query), else the default.
  const theme = set
    ? { file: `sets/${setId}/look.css`, pin: setId }
    : themeFile(opt('spectrum2-theme'));
  link(`${ROOT}/${theme.file}`, document.head, { spectrum2Tokens: theme.pin });

  // 3. A set's skin options: swapped on the skin's AUTHORED roots before milo decorates them.
  const roots = [...document.querySelectorAll('main > div > div[class]')];
  Object.values(set?.skins || {}).forEach((swap) => roots.forEach((el) => {
    const s = swap[el.classList[0]];
    if (!s) return;
    el.classList.remove(...s.drop.filter((c) => c !== el.classList[0]));
    el.classList.add(...s.add);
  }));

  // 4. Skins restyle milo's own blocks: css at the END of <body> so it wins ties with <head>.
  M.skins.forEach((s) => {
    link(`${ROOT}/blocks/${s.name}/${s.name}.css`, document.body, { spectrum2Skin: s.name });
    if (s.activation === 'page' && s.gate) document.body.classList.add(s.gate);
  });
  // 4b. Page rhythm and bands (see page.css).
  link(`${ROOT}/page.css`, document.body, { spectrum2Page: '' });

  // 5. Roots nobody can render here: not a spectrum2 block and not a milo block.
  const known = new Set([...Object.keys(M.members), ...M.miloBlocks, ...M.neutral]);
  const unknown = [...new Set(roots.map((el) => el.classList[0]).filter((n) => !known.has(n)))];
  if (unknown.length) {
    roots.filter((el) => unknown.includes(el.classList[0]))
      .forEach((el) => { el.dataset.spectrum2Unsupported = ''; });
    warn(`no spectrum2 family and no milo block for: ${unknown.join(', ')}`);
  }

  // 6. prose-skin (activation all-spectrum2): only once every decorated block is ours or skinned.
  const skinned = new Set(M.skins.map((s) => s.skinOf));
  const neutral = new Set(M.neutral);
  window.milo?.deferredPromise?.then(() => {
    const left = [...document.querySelectorAll('main div[data-block-status], main div[data-failed]')]
      .filter((el) => !el.classList.contains('spectrum2'))
      .map((el) => el.classList[0])
      .filter((name) => name && !neutral.has(name) && !skinned.has(name));
    M.skins.filter((s) => s.activation === 'all-spectrum2' && s.gate).forEach((s) => {
      if (!left.length) document.body.classList.add(s.gate);
      else document.body.dataset[camel(`spectrum2-${s.name}-blockers`)] = [...new Set(left)].join(' ');
    });
  });

  document.documentElement.dataset.spectrum2 = set ? setId : theme.pin;
  const active = set ? setId : null;
  window.spectrum2 = { set: active, theme: theme.pin, unknown, prologues };
}
