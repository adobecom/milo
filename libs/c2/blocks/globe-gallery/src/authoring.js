/* Authoring layer: parses the block rows + fetches the card fragment, and builds
   the canvas/overlay/modal DOM the runtime expects. */

// ── Authoring ────────────────────────────────────────────────────────────────
// Adobe app catalog used to render the modal badge chips (the id drives the
// brand-colored icon class in globe.css, e.g. .card-modal__badge-icon--photoshop).
// At module scope so both placeholder generation and authored-badge parsing share it.
const APP_CATALOG = [
  { id: 'photoshop', name: 'Photoshop', abbr: 'Ps' },
  { id: 'lightroom', name: 'Lightroom', abbr: 'Lr' },
  { id: 'illustrator', name: 'Illustrator', abbr: 'Ai' },
  { id: 'premiere', name: 'Premiere Pro', abbr: 'Pr' },
  { id: 'aftereffects', name: 'After Effects', abbr: 'Ae' },
  { id: 'firefly', name: 'Firefly', abbr: 'Ff' },
  { id: 'express', name: 'Express', abbr: 'Ex' },
  { id: 'fresco', name: 'Fresco', abbr: 'Fr' },
];

// Resolve a badge's app from an authored token (matches id / name / abbr,
// case-insensitive). Unknown apps still render, with a derived 2-letter abbr.
function findApp(token) {
  const t = (token || '').trim();
  const key = t.toLowerCase();
  const match = APP_CATALOG.find(
    (a) => a.id === key || a.name.toLowerCase() === key || a.abbr.toLowerCase() === key,
  );
  if (match) return match;
  return { id: 'photoshop', name: t || 'App', abbr: t.slice(0, 2) || 'Ap' };
}

// AUTHORING CONTRACT:
// The block has three authored rows (direct child <div>s), in fixed order:
//   Row 0 — arc-copy:   heading → arc-copy title; <p> → arc-copy body
//   Row 1 — cards:      a fragment link resolved by Milo before init() fires.
//                       Each card in the fragment is a flat sequence of elements
//                       (separated by <hr> for multiple cards):
//                         <p><em>Role</em></p>
//                         <p><strong>Name</strong></p>
//                         <p>Description text</p>
//                         <ul><li>App<ul><li>Role</li></ul></li>…</ul>
//                         <p><picture>…</picture></p>
//   Row 2 — pull-quote (optional): heading → quote;
//                       first <p> → name; second <p> → role
// Returns { arcCopy, pullQuote, fragmentHref }. Cards are fetched from the fragment
// link separately (fetchFragmentCards); the block collapses if the fetch yields none.

function parseArcCopy(row) {
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img'))
    .map((p) => p.textContent)
    .filter(Boolean);
  return {
    title: heading ? heading.textContent : paras.shift() || '',
    body: paras.join(' '),
  };
}

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')].map((p) => p.textContent).filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

function parseFragmentCardSegment(nodes) {
  let picture = null; let img = null;
  let role = ''; let name = ''; let description = '';
  const badges = [];

  nodes.forEach((node) => {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) return;

    if (tag === 'P') {
      const pic = node.querySelector('picture');
      if (pic) { picture = pic; img = pic.querySelector('img'); return; }
      const inlineImg = node.querySelector('img');
      if (inlineImg) { img = inlineImg; return; }
      const em = node.querySelector('em');
      if (em) { role = em.textContent.trim(); return; }
      const strong = node.querySelector('strong');
      if (strong) { name = strong.textContent.trim(); return; }
      const text = node.textContent.trim();
      if (text && !description) description = text;
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        const nestedLi = li.querySelector('ul > li');
        if (nestedLi) {
          const appText = [...li.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .join('').trim();
          const roleText = nestedLi.textContent.trim();
          if (appText) badges.push({ app: findApp(appText), role: roleText });
        } else {
          // Legacy pipe-separated format: "Photoshop | Compositing"
          const parts = li.textContent.split('|').map((s) => s.trim()).filter(Boolean);
          if (parts[0]) badges.push({ app: findApp(parts[0]), role: parts.slice(1).join(' ') });
        }
      });
    }
  });

  if (!img) return null;
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    picture,
    name,
    role,
    description,
    badges,
  };
}

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => n.nodeName === 'P' || n.nodeName === 'UL');

  if (!hasDirectContent) {
    // Children are section divs (each fragment section = one card). Recurse into each.
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

  // Flat content — split by <hr> to handle multiple cards within a single section.
  const segments = [];
  let current = [];
  [...row.childNodes].forEach((node) => {
    if (node.nodeName === 'HR') {
      if (current.length) { segments.push(current); current = []; }
    } else if (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()) {
      current.push(node);
    }
  });
  if (current.length) segments.push(current);
  return segments.map((nodes) => parseFragmentCardSegment(nodes)).filter(Boolean);
}

// Fetch the fragment's full .plain.html and parse all card sections from it.
export async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const cards = [...tmp.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

// The rows are positional (see AUTHORING CONTRACT): arc-copy is always row 0,
// the card fragment link is row 1, and an optional pull-quote is row 2. The
// fragment href is read here (before buildGlobeDom wipes the DOM) — links are
// authored with #_dnb (e.g. /fragments/…#_dnb) so Milo skips auto-resolution and
// the raw <a href> survives to here; the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
  };
}

// ── DOM the runtime expects ──────────────────────────────────────────────────
// The original prototype hand-authored these nodes in index.html. We build them
// inside the block element instead. The runtime finds nodes by querying *within
// the block root* (root.querySelector('.class')), so ids are no longer needed
// for lookup → more than one globe can coexist on a page.
//
// Two things still require a real id (no classname equivalent — both are
// document-wide id references), made unique per instance via `gid`:
//   • the CA SVG filter — referenced from JS as `filter: url(#ca-filter-<gid>)`.
//   • the modal heading/description — referenced by the dialog's aria-labelledby
//     / aria-describedby IDREFs.
// `gid` is minted here (this module owns both creating and embedding the ids)
// and returned by buildGlobeDom so the runtime can build the same url(#…) ref.
//
// Fixed-position overlays (ca-svg, pull-quote, modal) can live inside the block:
// position:fixed escapes the relative/sticky ancestors here (no transform/filter
// on the chain).
const buildMarkup = (gid, labels) => `
  <div class="globe-gallery-world">
    <canvas class="globe-gallery-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:3;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
  </div>

  <svg class="globe-gallery-ca-svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <filter id="ca-filter-${gid}" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rch"/>
        <feOffset in="rch" class="globe-gallery-ca-r-offset" dx="0" dy="0" result="rOff"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gch"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bch"/>
        <feOffset in="bch" class="globe-gallery-ca-b-offset" dx="0" dy="0" result="bOff"/>
        <feComposite in="rOff" in2="gch" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg"/>
        <feComposite in="rg" in2="bOff" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
      </filter>
    </defs>
  </svg>

  <aside class="globe-gallery-arc-copy" role="region" aria-label="${labels.arcRegion}">
    <h2 class="globe-gallery-arc-copy__title"></h2>
    <p class="globe-gallery-arc-copy__body"></p>
  </aside>

  <div class="globe-gallery-pullquote-pin">
    <div class="globe-gallery-pullquote">
      <blockquote class="globe-gallery-pullquote__quote"></blockquote>
      <div class="globe-gallery-pullquote__attribution">
        <p class="globe-gallery-pullquote__name"></p>
        <p class="globe-gallery-pullquote__role"></p>
      </div>
    </div>
  </div>

  <div class="globe-gallery-modal" aria-hidden="true">
    <div class="globe-gallery-modal__backdrop"></div>
  </div>

  <canvas class="globe-gallery-modal-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:115;display:none;pointer-events:none;"></canvas>

  <div class="globe-gallery-modal-chrome" role="dialog" aria-modal="true" aria-labelledby="globe-gallery-modal-name-${gid}" aria-describedby="globe-gallery-modal-description-${gid}" aria-hidden="true">
    <button class="globe-gallery-modal__nav globe-gallery-modal__nav--prev" type="button" aria-label="${labels.prevCard}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="globe-gallery-modal__nav globe-gallery-modal__nav--next" type="button" aria-label="${labels.nextCard}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="globe-gallery-modal__counter" aria-hidden="true"></div>
    <button class="globe-gallery-modal__close" type="button" aria-label="${labels.closeBtn}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <img class="globe-gallery-modal__image" alt="" />
    <div class="globe-gallery-modal__info">
      <p class="globe-gallery-modal__role-label"></p>
      <h2 class="globe-gallery-modal__name" id="globe-gallery-modal-name-${gid}"></h2>
      <p class="globe-gallery-modal__description" id="globe-gallery-modal-description-${gid}"></p>
      <ul class="globe-gallery-modal__badges" aria-label="${labels.appsUsed}"></ul>
    </div>
  </div>
`;

// Per-page instance counter → a unique suffix for this instance's id-bearing
// nodes. Only needs to be unique within the document so multiple globes don't
// collide on their shared-namespace ids; an incrementing int is the simplest
// guarantee of that.
let globeInstanceSeq = 0;

// Build the block's DOM and return the `gid` used for this instance's unique ids
// so the runtime can reference the CA filter via `url(#ca-filter-<gid>)`.
export function buildGlobeDom(el, labels, { arcCopy, pullQuote }) {
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  el.innerHTML = buildMarkup(gid, labels);
  el.querySelector('.globe-gallery-arc-copy__title').textContent = arcCopy.title;
  el.querySelector('.globe-gallery-arc-copy__body').textContent = arcCopy.body;
  el.querySelector('.globe-gallery-pullquote__quote').textContent = pullQuote.quote;
  el.querySelector('.globe-gallery-pullquote__name').textContent = pullQuote.name;
  el.querySelector('.globe-gallery-pullquote__role').textContent = pullQuote.role;
  return gid;
}
