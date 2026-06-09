/* eslint-disable */
/* Extracted from globe.js — part of the verbatim hub-creative offer-globe.js port.
   Authoring layer: parses the block rows + fetches the card fragment.
   Style cleanup (no-var, naming, max-len) is one tracked refactor task; the
   eslint-disable is intentional until then. See globe.js / PROGRESS.md. */

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
// The block has three authored rows (direct child <div>s):
//   Row 0 — arc-copy:   heading → .offer-arc-copy__title; <p> → .offer-arc-copy__body
//   Row 1 — cards:      a fragment link resolved by Milo before init() fires.
//                       Each card in the fragment is a flat sequence of elements
//                       (separated by <hr> for multiple cards):
//                         <p><em>Role</em></p>
//                         <p><strong>Name</strong></p>
//                         <p>Description text</p>
//                         <ul><li>App<ul><li>Role</li></ul></li>…</ul>
//                         <p><picture>…</picture></p>
//   Row 2 — pull-quote: heading → .offer-pullquote__quote;
//                       first <p> → .offer-pullquote__name;
//                       second <p> → .offer-pullquote__role
// Returns { cards, arcCopy, pullQuote }. cards falls back to [] (factory uses placeholders).

function parseArcCopy(row) {
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img'))
    .map((p) => p.textContent.trim())
    .filter(Boolean);
  return {
    title: heading ? heading.textContent.trim() : paras.shift() || '',
    body: paras.join(' '),
  };
}

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent.trim() : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

function parseFragmentCardSegment(nodes) {
  let picture = null; let img = null;
  let role = 'Photographer'; let name = ''; let description = '';
  const badges = [];

  for (const node of nodes) {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) continue;

    if (tag === 'P') {
      const pic = node.querySelector('picture');
      if (pic) { picture = pic; img = pic.querySelector('img'); continue; }
      const i = node.querySelector('img');
      if (i) { img = i; continue; }
      const em = node.querySelector('em');
      if (em) { role = em.textContent.trim(); continue; }
      const strong = node.querySelector('strong');
      if (strong) { name = strong.textContent.trim(); continue; }
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
  }

  if (!img) return null;
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    picture,
    name: name || 'Untitled',
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

export function parseAuthoredContent(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return { cards: [], arcCopy: null, pullQuote: null, fragmentHref: null };

  let cardRows = rows;
  let arcCopy = null;
  let pullQuote = null;

  if (rows.length > 1 && !rows[0].querySelector('picture, img')) {
    arcCopy = parseArcCopy(rows[0]);
    cardRows = cardRows.slice(1);
  }

  if (cardRows.length > 1 && !cardRows[cardRows.length - 1].querySelector('picture, img')) {
    pullQuote = parsePullQuote(cardRows[cardRows.length - 1]);
    cardRows = cardRows.slice(0, -1);
  }

  // Extract the fragment href before buildGlobeDom() wipes the DOM.
  // Canonical path: the link is authored with #_dnb (e.g. /fragments/…#_dnb) so
  // Milo skips auto-resolution and the raw <a href> is still in the DOM here.
  // Strip the hash before fetching. Fall back to data-path + image origin if
  // Milo already replaced the link (e.g. on a page that predates the #_dnb convention).
  const fragmentHref = (() => {
    for (const row of cardRows) {
      const a = row.querySelector('a[href]');
      if (a) return a.href.replace(/#.*$/, '');
      const pathEl = row.querySelector('[data-path]');
      if (pathEl) {
        const imgSrc = row.querySelector('img')?.src;
        const origin = imgSrc ? new URL(imgSrc).origin : window.location.origin;
        return `${origin}${pathEl.dataset.path}`;
      }
    }
    return null;
  })();

  const cards = cardRows.flatMap((row) => parseFragmentCards(row)).filter(Boolean);
  return { cards, arcCopy, pullQuote, fragmentHref };
}
