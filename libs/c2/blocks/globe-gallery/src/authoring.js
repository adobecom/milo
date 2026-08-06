// Badge chips; id drives the brand-colored icon class in globe.css.
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

// Match an authored token to an app by id/name/abbr; unknown apps get a 2-letter abbr.
function findApp(token) {
  const t = (token || '').trim();
  const key = t.toLowerCase();
  const match = APP_CATALOG.find(
    (a) => a.id === key || a.name.toLowerCase() === key || a.abbr.toLowerCase() === key,
  );
  if (match) return match;
  return { id: 'photoshop', name: t || 'App', abbr: t.slice(0, 2) || 'Ap' };
}

// See README (Authoring contract) for the authored-row layout.

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
        const anchor = [...li.childNodes].find((n) => n.nodeName === 'A');
        const appHref = anchor ? (anchor.getAttribute('href') || null) : null;
        if (nestedLi) {
          const appText = anchor
            ? anchor.textContent.trim()
            : [...li.childNodes]
              .filter((n) => n.nodeType === Node.TEXT_NODE)
              .map((n) => n.textContent.trim())
              .join('').trim();
          const roleText = nestedLi.textContent.trim();
          if (appText) badges.push({ app: findApp(appText), role: roleText, href: appHref });
        } else {
          // Legacy pipe-separated format: "Photoshop | Compositing"
          const parts = li.textContent.split('|').map((s) => s.trim()).filter(Boolean);
          if (parts[0]) badges.push({ app: findApp(parts[0]), role: parts.slice(1).join(' '), href: appHref });
        }
      });
    }
  });

  if (!img) return null;
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: (img.getAttribute('alt') || '').trim(),
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
    // Children are section divs (each fragment section = one card).
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

  // Flat content — split by <hr> for multiple cards in one section.
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

// Fetch the fragment's .plain.html and parse all card sections from it.
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

// Positional rows (see README, Authoring contract). Fragment links are authored
// with #_dnb so Milo skips auto-resolution; the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, hintTextRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  const hintText = hintTextRow?.textContent.trim() || '';
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
    hintText,
  };
}

// Runtime queries nodes within the block root, so multiple globes can coexist.
// `gid` makes the two document-wide id refs unique per instance: the CA SVG
// filter (url(#ca-filter-<gid>)) and the modal's aria-labelledby/describedby.
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

  <canvas class="globe-gallery-modal-canvas" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:111;display:none;pointer-events:none;"></canvas>

  <dialog class="globe-gallery-modal-chrome" tabindex="-1" aria-labelledby="globe-gallery-modal-role-${gid} globe-gallery-modal-name-${gid} globe-gallery-modal-position-${gid}" aria-describedby="globe-gallery-modal-description-${gid}">
    <div class="globe-gallery-modal__info">
      <p class="globe-gallery-modal__role-label" id="globe-gallery-modal-role-${gid}"></p>
      <h2 class="globe-gallery-modal__name" id="globe-gallery-modal-name-${gid}" tabindex="-1" aria-describedby="globe-gallery-modal-role-${gid} globe-gallery-modal-position-${gid}"></h2>
      <p class="globe-gallery-modal__description" id="globe-gallery-modal-description-${gid}"></p>
      <ul class="globe-gallery-modal__badges"></ul>
    </div>
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="globe-gallery-modal__image globe-gallery-sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
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
    <span class="globe-gallery-modal__position globe-gallery-sr-only" id="globe-gallery-modal-position-${gid}"></span>
  </dialog>
`;

// Per-page instance counter → unique id suffix per globe.
let globeInstanceSeq = 0;

// Build the block's DOM; returns the `gid` for this instance's unique ids.
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
