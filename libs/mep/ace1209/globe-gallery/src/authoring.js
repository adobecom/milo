// eslint-disable-next-line import/no-relative-packages
import { getFederatedUrl } from '../../../../utils/utils.js';

export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

function badgeSvgUrl(a) {
  const href = a.getAttribute('href') || '';
  if (href.includes('.svg')) return href;
  const text = a.textContent.trim();
  return text.includes('.svg') ? text : '';
}

function isSvgAnchor(a) {
  return !!badgeSvgUrl(a);
}

// Inline <picture> markup for a badge logo URL, or null.
function badgeIconHtml(url) {
  if (!url) return null;
  const src = getFederatedUrl(url);
  return `<picture class="globe-gallery-modal-badge-icon" aria-hidden="true"><img loading="lazy" src="${escapeHtml(src)}" alt=""></picture>`;
}

// Fallback only; authored inline so it stays localizable.
const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

const DEFAULT_HINT = 'Click & Drag';
const DEFAULT_TOUCH_HINT = 'Click and drag to rotate. Tap to dive deep into the artwork.';

const LABEL_DIVIDER = '||';
const DEFAULT_LABELS = [
  DEFAULT_GALLERY_INSTRUCTIONS,
  'Rotate left', 'Rotate right', 'Pause spinning', 'Resume spinning',
  'Previous card', '{index} of {count}', 'Next card', 'Close',
];
const CARD_TPL_INDEX = 6;

function buildLabels(parts) {
  const at = (i) => parts[i] || DEFAULT_LABELS[i];
  const cardTplRaw = parts[CARD_TPL_INDEX];
  const cardTpl = cardTplRaw?.includes('{index}') && cardTplRaw?.includes('{count}')
    ? cardTplRaw
    : DEFAULT_LABELS[CARD_TPL_INDEX];
  return {
    rotateLeft: at(1),
    rotateRight: at(2),
    pauseSpin: at(3),
    resumeSpin: at(4),
    prevCard: at(5),
    nextCard: at(7),
    closeBtn: at(8),
    cardLabel: (index, count) => cardTpl
      .replace('{index}', String(index))
      .replace('{count}', String(count)),
  };
}

function cellText(cell) {
  if (!cell) return '';
  const paras = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
  return (paras.length ? paras.join(' ') : cell.textContent).trim();
}

function cellParas(cell) {
  return cell ? [...cell.querySelectorAll('p')].filter((x) => x.textContent.trim()) : [];
}

// Move the authored <p>s into a container.
export function renderParagraphs(container, paras) {
  if (container) container.replaceChildren(...paras);
}

const OPENING_MARK = /^[\p{Ps}\p{Pi}\p{Pf}"']/u;

function gutterOf(el) {
  return el ? parseFloat(getComputedStyle(el).paddingInlineStart) || 0 : 0;
}

function hangOpeningMark(el, room) {
  el.style.textIndent = '';
  const text = el.textContent.trim();
  if (!room || !OPENING_MARK.test(text)) return;
  const cs = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  if (!ctx.font.includes(cs.fontSize)) return; // font didn't parse; canvas is on its 10px default
  // Canvas ignores letter-spacing, and heading-1 has some.
  const advance = ctx.measureText([...text][0]).width + (parseFloat(cs.letterSpacing) || 0);
  // Too wide to hang — a CJK bracket, or just past the padding.
  if (advance >= parseFloat(cs.fontSize) * 0.8 || advance > room) return;
  if (advance > 0) el.style.textIndent = `${-advance / parseFloat(cs.fontSize)}em`;
}

export function hangParagraphs(container) {
  if (!container) return;
  const room = gutterOf(container);
  [...container.children].forEach((p) => hangOpeningMark(p, room));
}

const QUOTE_TEXT = new WeakMap(); // authored text, so every relayout re-splits from scratch

// Group the words by the line box they landed on; under a pixel is baseline noise, not a wrap.
function measureLines(quoteEl, words) {
  const probes = words.map((w) => {
    const s = document.createElement('span');
    s.textContent = w;
    return s;
  });
  const nodes = [];
  probes.forEach((s, i) => {
    if (i) nodes.push(document.createTextNode(' '));
    nodes.push(s);
  });
  quoteEl.replaceChildren(...nodes);
  const lines = [];
  let top = null;
  probes.forEach((s, i) => {
    const y = s.offsetTop;
    if (top === null || y - top > 1) {
      lines.push([]);
      top = y;
    }
    lines[lines.length - 1].push(words[i]);
  });
  return lines;
}

// Re-typeset the quote as one masked block per rendered line, and return those lines for the
// caller to write progress vars to. Idempotent; plain text if there is nothing to split.
export function layoutQuote(quoteEl) {
  if (!quoteEl) return [];
  if (!QUOTE_TEXT.has(quoteEl)) QUOTE_TEXT.set(quoteEl, quoteEl.textContent);
  const text = QUOTE_TEXT.get(quoteEl).trim();
  quoteEl.style.textIndent = '';
  quoteEl.classList.remove('globe-gallery-pullquote-lines');
  quoteEl.textContent = text;
  if (!text) return [];
  hangOpeningMark(quoteEl, gutterOf(quoteEl.closest('.globe-gallery-pullquote')));
  const indent = quoteEl.style.textIndent;
  const lines = measureLines(quoteEl, text.split(/\s+/));
  const lineEls = lines.map((wordsOnLine, i) => {
    const line = document.createElement('span');
    line.className = 'globe-gallery-pullquote-line';
    const inner = document.createElement('span');
    inner.className = 'globe-gallery-pullquote-line-inner';
    inner.textContent = wordsOnLine.join(' ');
    line.append(inner);
    // A margin, not the text-indent it came from: that inherits into the inner and applies twice.
    if (i === 0 && indent) inner.style.marginInlineStart = indent;
    return line;
  });
  quoteEl.style.textIndent = '';
  quoteEl.classList.add('globe-gallery-pullquote-lines');
  // Spaced, or textContent runs the lines together ("the differentapps."). Whitespace between
  // flex items generates no box, so the layout is untouched.
  const nodes = [];
  lineEls.forEach((line, i) => {
    if (i) nodes.push(document.createTextNode(' '));
    nodes.push(line);
  });
  quoteEl.replaceChildren(...nodes);
  return lineEls;
}

function parseArcCopy(row) {
  if (!row) return { title: '', body: [] };
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img') && p.textContent.trim());
  return {
    title: heading ? heading.textContent : paras.shift()?.textContent.trim() || '',
    body: paras,
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

// The <em>/<strong> text, but only when it IS the whole paragraph.
function wholeParaChild(p, selector) {
  const child = p.querySelector(selector);
  const text = child?.textContent.trim();
  return text && text === p.textContent.trim() ? text : '';
}

function parseFragmentCardSegment(nodes) {
  let img = null;
  let role = ''; let name = '';
  const description = [];
  const badges = [];

  nodes.forEach((node) => {
    const tag = node.nodeName && node.nodeName.toUpperCase();
    if (!tag) return;

    if (/^H[1-6]$/.test(tag)) {
      if (!name) name = node.textContent.trim();
    } else if (tag === 'P') {
      const inlineImg = node.querySelector('img'); // <picture> or bare <img>; first wins
      if (inlineImg) {
        if (!img) img = inlineImg;
        return;
      }
      if (!role) {
        const em = wholeParaChild(node, 'em');
        if (em) { role = em; return; }
      }
      if (!name) {
        const strong = wholeParaChild(node, 'strong');
        if (strong) { name = strong; return; }
      }
      if (node.textContent.trim()) description.push(node); // everything else is description
    } else if (tag === 'PICTURE' || tag === 'IMG') {
      const bare = tag === 'IMG' ? node : node.querySelector('img');
      if (!img && bare) img = bare;
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        // Cloned, so the authored DOM is untouched.
        const row = li.cloneNode(true);
        const featureLi = row.querySelector(':scope > ul > li');
        row.querySelector(':scope > ul')?.remove();

        const anchors = [...row.querySelectorAll('a')];
        const svgAnchor = anchors.find(isSvgAnchor) || null;
        const linkAnchor = anchors.find((a) => a !== svgAnchor) || null;
        const icon = badgeIconHtml(
          svgAnchor ? badgeSvgUrl(svgAnchor) : row.querySelector('img')?.getAttribute('src'),
        );
        svgAnchor?.remove(); // its URL text is markup, never part of the name

        const badgeName = (linkAnchor ? linkAnchor.textContent : row.textContent).trim();
        if (badgeName) {
          badges.push({
            name: badgeName,
            role: featureLi?.textContent.trim() || '',
            href: linkAnchor?.getAttribute('href') || null,
            icon,
          });
        }
      });
    }
  });

  if (!img) {
    const label = nodes.map((n) => n.textContent || '').join(' ').trim().slice(0, 60);
    window.lana?.log?.(
      `globe-gallery: fragment section skipped, no image — "${label}"`,
      { tags: 'globe-gallery', severity: 'info' },
    );
    return null;
  }
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: (img.getAttribute('alt') || '').trim(),
    name,
    role,
    description,
    badges,
  };
}

const CARD_CONTENT_TAGS = /^(P|UL|PICTURE|IMG|H[1-6])$/;

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => CARD_CONTENT_TAGS.test(n.nodeName));

  if (!hasDirectContent) {
    const divs = [...row.querySelectorAll(':scope > div')];
    return divs.flatMap((div) => parseFragmentCards(div));
  }

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

export async function fetchFragmentCards(href) {
  try {
    const resp = await fetch(`${href}.plain.html`);
    if (!resp.ok) return null;
    const html = await resp.text();
    // DOMParser yields an inert document, so card <img>/<picture> never fetch here — only the
    // right-sized texture URL is downloaded.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const cards = [...doc.body.querySelectorAll(':scope > div')]
      .flatMap((section) => parseFragmentCards(section))
      .filter(Boolean);
    return cards.length ? cards : null;
  } catch (e) {
    return null;
  }
}

// Cards ask by height, the modal by width; non-media URLs pass through.
export function optimizeImgUrl(src, px, axis = 'width') {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.href);
    if (!/(^|\/)media_[0-9a-f]/i.test(url.pathname)) return src;
    return `${url.origin}${url.pathname}?${axis}=${Math.round(px)}&format=webply`;
  } catch (e) {
    return src;
  }
}

// Positional rows. Fragment links are authored with #_dnb so Milo skips auto-resolution;
// the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, hintTextRow, a11yRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  // Row 2 is two cells: the barrel's bottom-row copy, then the hint plane / cursor label.
  const cells = hintTextRow ? [...hintTextRow.querySelectorAll(':scope > div')] : [];
  const parts = (a11yRow?.textContent ?? '').split(LABEL_DIVIDER).map((s) => s.trim());
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
    fragmentHref: fragmentLink ? fragmentLink.href.replace(/#.*$/, '') : null,
    touchHint: { paras: cellParas(cells[0]), text: cellText(cells[0]) || DEFAULT_TOUCH_HINT },
    hintText: cellText(cells[1]) || DEFAULT_HINT,
    instructions: parts[0] || DEFAULT_GALLERY_INSTRUCTIONS,
    labels: buildLabels(parts),
  };
}

// `gid` makes the two document-wide id refs unique per instance: the CA SVG filter and the
// modal's aria-labelledby/describedby.
const buildMarkup = (gid, labels) => `
  <div class="globe-gallery-world">
    <canvas class="globe-gallery-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;display:none;pointer-events:auto;touch-action:pan-y;"></canvas>
    <div class="globe-gallery-controls">
      <button class="globe-gallery-control globe-gallery-spin-toggle" type="button" daa-ll="pause_spin--globe_gallery" aria-label="${escapeHtml(labels.pauseSpin)}">
        <svg class="globe-gallery-icon-pause" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="8" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>
        <svg class="globe-gallery-icon-play" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>
      </button>
      <div class="globe-gallery-hint">
        <button class="globe-gallery-control globe-gallery-rotate" type="button" data-dir="-1" daa-ll="rotate_left--globe_gallery" aria-label="${escapeHtml(labels.rotateLeft)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="globe-gallery-hint-text"></div>
        <button class="globe-gallery-control globe-gallery-rotate" type="button" data-dir="1" daa-ll="rotate_right--globe_gallery" aria-label="${escapeHtml(labels.rotateRight)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>

  <svg class="globe-gallery-ca-svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
    <defs>
      <filter id="ca-filter-${gid}" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="rch"/>
        <feOffset in="rch" class="globe-gallery-ca-r-offset" dx="0" dy="0" result="rOff"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1" result="gch"/>
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0 1" result="bch"/>
        <feOffset in="bch" class="globe-gallery-ca-b-offset" dx="0" dy="0" result="bOff"/>
        <feBlend in="rOff" in2="gch" mode="screen" result="rg"/>
        <feBlend in="rg" in2="bOff" mode="screen" result="rgb"/>
        <feComposite in="rgb" in2="SourceGraphic" operator="in"/>
      </filter>
    </defs>
  </svg>

  <div class="globe-gallery-arc-copy">
    <h2 class="globe-gallery-arc-copy-title"></h2>
    <div class="globe-gallery-arc-copy-body body-md"></div>
  </div>

  <div class="globe-gallery-pullquote-pin">
    <div class="globe-gallery-pullquote-rail">
      <div class="globe-gallery-pullquote">
        <blockquote class="globe-gallery-pullquote-quote heading-1"></blockquote>
        <div class="globe-gallery-pullquote-attribution">
          <p class="globe-gallery-pullquote-name body-lg"></p>
          <p class="globe-gallery-pullquote-role body-lg"></p>
        </div>
      </div>
    </div>
  </div>

  <div class="globe-gallery-modal" aria-hidden="true">
    <div class="globe-gallery-modal-backdrop"></div>
  </div>

  <canvas class="globe-gallery-modal-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="globe-gallery-modal-chrome" tabindex="-1" aria-labelledby="globe-gallery-modal-name-${gid} globe-gallery-modal-role-${gid} globe-gallery-modal-position-${gid}" aria-describedby="globe-gallery-modal-description-${gid}">
    <div class="globe-gallery-modal-info">
      <h2 class="globe-gallery-modal-name" id="globe-gallery-modal-name-${gid}" tabindex="-1" aria-describedby="globe-gallery-modal-role-${gid} globe-gallery-modal-position-${gid}"></h2>
      <p class="globe-gallery-modal-role-label" id="globe-gallery-modal-role-${gid}"></p>
      <div class="globe-gallery-modal-description" id="globe-gallery-modal-description-${gid}" data-lenis-prevent></div>
      <ul class="globe-gallery-modal-badges"></ul>
    </div>
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="globe-gallery-modal-image globe-gallery-sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
    <button class="globe-gallery-modal-nav globe-gallery-modal-nav-prev" type="button" daa-ll="prev_card-1--globe_card_modal" aria-label="${escapeHtml(labels.prevCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="globe-gallery-modal-nav globe-gallery-modal-nav-next" type="button" daa-ll="next_card-2--globe_card_modal" aria-label="${escapeHtml(labels.nextCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="globe-gallery-modal-counter" aria-hidden="true"></div>
    <button class="globe-gallery-modal-close" type="button" daa-ll="close-3--globe_card_modal" aria-label="${escapeHtml(labels.closeBtn)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <span class="globe-gallery-modal-position globe-gallery-sr-only" id="globe-gallery-modal-position-${gid}"></span>
  </dialog>
`;

let globeInstanceSeq = 0;

export function buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint }) {
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  el.innerHTML = buildMarkup(gid, labels);
  const hintEl = el.querySelector('.globe-gallery-hint-text');
  if (touchHint.paras.length) renderParagraphs(hintEl, touchHint.paras);
  else hintEl.textContent = touchHint.text;
  el.querySelector('.globe-gallery-arc-copy-title').textContent = arcCopy.title;
  renderParagraphs(el.querySelector('.globe-gallery-arc-copy-body'), arcCopy.body);
  if (pullQuote) {
    const quoteEl = el.querySelector('.globe-gallery-pullquote-quote');
    quoteEl.textContent = pullQuote.quote;
    el.querySelector('.globe-gallery-pullquote-name').textContent = pullQuote.name;
    el.querySelector('.globe-gallery-pullquote-role').textContent = pullQuote.role;
    layoutQuote(quoteEl);
  } else {
    el.querySelector('.globe-gallery-pullquote-pin').remove();
  }
  return gid;
}

const SCATTER_KEY = 'One day I will return to your side';
const SCATTER_MOD = 2147483647;

function seedFrom(key) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % SCATTER_MOD;
  return h || 1;
}

export function scatterCards(cards) {
  const out = cards.map((card, i) => ({ ...card, authoredIndex: i }));
  let rand = seedFrom(SCATTER_KEY);
  for (let i = out.length - 1; i > 0; i -= 1) {
    rand = (rand * 48271) % SCATTER_MOD;
    const j = Math.floor((rand / SCATTER_MOD) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
