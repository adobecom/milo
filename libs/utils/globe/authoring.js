// eslint-disable-next-line import/no-relative-packages
import { getConfig, loadStyle } from '../utils.js';
import { seededRandom } from './core.js';

let globeStyles;

export function loadGlobeStyles() {
  const { base } = getConfig();
  globeStyles ||= new Promise((resolve) => { loadStyle(`${base}/utils/globe/globe.css`, resolve); });
  return globeStyles;
}

export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

export function setLang(el, lang) {
  if (lang) el.lang = lang;
  else el.removeAttribute('lang');
}

export const daaBlockName = (name) => name.replace(/-/g, '_');

export function onRemoved(el, callback) {
  const observer = new MutationObserver(() => {
    if (el.isConnected) return;
    observer.disconnect();
    callback();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Fallback only; authored inline so it stays localizable.
const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

const DEFAULT_TOUCH_HINT = 'Click and drag to rotate. Tap to dive deep into the artwork.';

export const LABEL_DIVIDER = '||';

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

export function cellText(cell) {
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

const CARD_ORDER_SEED = 'One day I will return to your side';

export function scatterCards(cards) {
  const out = cards.map((card, i) => ({ ...card, authoredIndex: i }));
  const random = seededRandom(CARD_ORDER_SEED);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function firstChar(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const at = node.data.search(/\S/);
    if (at >= 0) return { node, at, ch: String.fromCodePoint(node.data.codePointAt(at)) };
  }
  return null;
}

function liveAdvance({ node, at, ch }) {
  const range = document.createRange();
  range.setStart(node, at);
  range.setEnd(node, at + ch.length);
  return range.getBoundingClientRect().width;
}

function canvasAdvance(el, ch) {
  const cs = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  if (!ctx.font.includes(cs.fontSize)) return 0; // font didn't parse; canvas is on its 10px default
  return ctx.measureText(ch).width + (parseFloat(cs.letterSpacing) || 0);
}

function canHang(el) {
  const cs = getComputedStyle(el);
  return cs.writingMode.startsWith('horizontal') && cs.textAlign !== 'center';
}

const hangRoom = new WeakMap();
const hangPending = new WeakSet();

function hangLater(el, when) {
  if (hangPending.has(el)) return;
  hangPending.add(el);
  when.then(() => {
    hangPending.delete(el);
    // eslint-disable-next-line no-use-before-define
    if (el.isConnected) hangOpeningMark(el, hangRoom.get(el), true);
  });
}

function hangOpeningMark(el, room, isRetry = false) {
  hangRoom.set(el, room);
  el.style.textIndent = '';
  const first = firstChar(el);
  if (!room || !first || !OPENING_MARK.test(first.ch) || !canHang(el)) return;
  const fontSize = parseFloat(getComputedStyle(el).fontSize);
  const live = liveAdvance(first);
  const advance = live || canvasAdvance(el, first.ch);
  if (!isRetry) {
    if (!live) hangLater(el, new Promise((res) => { requestAnimationFrame(res); }));
    else if (document.fonts?.status === 'loading') hangLater(el, document.fonts.ready);
  }
  // Too wide to hang — a CJK bracket, or just past the padding.
  if (advance >= fontSize * 0.8 || advance > room) return;
  if (advance > 0) el.style.textIndent = `${-advance / fontSize}em`;
}

export function hangParagraphs(container) {
  if (!container) return;
  const room = gutterOf(container);
  [...container.children].forEach((p) => hangOpeningMark(p, room));
}

const QUOTE_TEXT = new WeakMap();

export function plainQuote(quoteEl) {
  if (!quoteEl) return '';
  if (!QUOTE_TEXT.has(quoteEl)) QUOTE_TEXT.set(quoteEl, quoteEl.textContent);
  const text = QUOTE_TEXT.get(quoteEl).trim();
  quoteEl.textContent = text;
  hangOpeningMark(quoteEl, gutterOf(quoteEl.closest('.globe-pullquote')));
  return text;
}

const buildMarkup = ({ name, labels, canvasStyle, arcCopyHtml, modalInfoHtml }) => {
  const daaName = daaBlockName(name);
  return `
  <div class="globe-world">
    <canvas class="globe-canvas" style="${canvasStyle}"></canvas>
    <div class="globe-controls" inert>
      <button class="globe-control globe-spin-toggle" type="button" daa-ll="pause_spin--${daaName}" aria-label="${escapeHtml(labels.pauseSpin)}">
        <svg class="globe-icon-pause" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="8" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>
        <svg class="globe-icon-play" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>
      </button>
      <div class="globe-hint">
        <button class="globe-control globe-rotate" type="button" data-dir="-1" daa-ll="rotate_left--${daaName}" aria-label="${escapeHtml(labels.rotateLeft)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="globe-hint-text"></div>
        <button class="globe-control globe-rotate" type="button" data-dir="1" daa-ll="rotate_right--${daaName}" aria-label="${escapeHtml(labels.rotateRight)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>

${arcCopyHtml}  <div class="globe-pullquote-pin">
    <div class="globe-pullquote-rail">
      <figure class="globe-pullquote">
        <blockquote class="globe-pullquote-quote heading-1"></blockquote>
        <figcaption class="globe-pullquote-attribution">
          <p class="globe-pullquote-name body-lg"></p>
          <p class="globe-pullquote-role body-lg"></p>
        </figcaption>
      </figure>
    </div>
  </div>

  <div class="globe-modal" aria-hidden="true">
    <div class="globe-modal-backdrop"></div>
  </div>

  <canvas class="globe-modal-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="globe-modal-chrome">
    ${modalInfoHtml.trim()}
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="globe-modal-image sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
    <button class="globe-modal-nav globe-modal-nav-prev" type="button" daa-ll="prev_card-1--globe_card_modal" aria-label="${escapeHtml(labels.prevCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="globe-modal-counter" aria-hidden="true"></div>
    <span class="globe-modal-position sr-only" role="note"></span>
    <button class="globe-modal-nav globe-modal-nav-next" type="button" daa-ll="next_card-2--globe_card_modal" aria-label="${escapeHtml(labels.nextCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="globe-modal-close" type="button" daa-ll="close-3--globe_card_modal" aria-label="${escapeHtml(labels.closeBtn)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <span class="globe-modal-announce sr-only" aria-live="polite"></span>
  </dialog>
`;
};

let globeInstanceSeq = 0;

export function buildGlobeSkeleton(el, name, labels, opts) {
  const { touchHint, pullQuote, canvasStyle } = opts;
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  const modalInfoHtml = opts.modalInfoHtml(gid);
  const arcCopyHtml = opts.arcCopyHtml || '';
  el.classList.add('globe');
  el.innerHTML = buildMarkup({ name, labels, canvasStyle, arcCopyHtml, modalInfoHtml });
  const hintEl = el.querySelector('.globe-hint-text');
  if (touchHint.paras.length) renderParagraphs(hintEl, touchHint.paras);
  else hintEl.textContent = touchHint.text;
  if (pullQuote) {
    el.querySelector('.globe-pullquote-quote').textContent = pullQuote.quote;
    el.querySelector('.globe-pullquote-name').textContent = pullQuote.name;
    el.querySelector('.globe-pullquote-role').textContent = pullQuote.role;
  } else {
    el.querySelector('.globe-pullquote-pin')?.remove();
  }
  return gid;
}

export const DEFAULT_HINT = 'Click & Drag';

function parsePullQuote(row) {
  const quoteEl = row.querySelector('blockquote') || row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !quoteEl?.contains(p))
    .map((p) => p.textContent)
    .filter(Boolean);
  return {
    quote: quoteEl ? quoteEl.textContent : paras.shift() || '',
    name: paras[0] || '',
    role: paras[1] || '',
  };
}

export function parseCommonRows(hintTextRow, a11yRow, pullQuoteRow) {
  const cells = hintTextRow ? [...hintTextRow.querySelectorAll(':scope > div')] : [];
  const parts = (a11yRow?.textContent ?? '').split(LABEL_DIVIDER).map((s) => s.trim());
  return {
    touchHint: { paras: cellParas(cells[0]), text: cellText(cells[0]) || DEFAULT_TOUCH_HINT },
    hintText: cellText(cells[1]) || DEFAULT_HINT,
    instructions: parts[0] || DEFAULT_GALLERY_INSTRUCTIONS,
    labels: buildLabels(parts),
    pullQuote: pullQuoteRow ? parsePullQuote(pullQuoteRow) : null,
  };
}
