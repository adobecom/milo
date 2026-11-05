// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../utils.js';

// On-canvas globe chrome: auto-spin play/pause + the barrel's rotate row.
export function createGlobeControls({
  name, q, labels, getVisible, getHintDismissed, rotate,
}) {
  const SPIN_DAA_PAUSE = `pause_spin--${name.replace(/-/g, '_')}`;
  const SPIN_DAA_RESUME = `resume_spin--${name.replace(/-/g, '_')}`;
  let layerEl = null;
  let spinBtn = null;
  let hintEl = null;
  let rotateBtns = [];
  let paused = false; // survives breakpoint rebuilds — the closure outlives them
  let appliedVisible = null; // last-written class state; update() only writes on a flip
  let appliedDismissed = null;

  function renderSpinState() {
    if (!spinBtn) return;
    spinBtn.setAttribute('aria-label', paused ? labels.resumeSpin : labels.pauseSpin);
    spinBtn.setAttribute('daa-ll', paused ? SPIN_DAA_RESUME : SPIN_DAA_PAUSE);
    spinBtn.classList.toggle('is-paused', paused);
  }

  function onSpinClick() {
    paused = !paused;
    renderSpinState();
  }

  function onRotateClick(e) {
    rotate(Number(e.currentTarget.dataset.dir));
  }

  function setup() {
    layerEl = q(`.${name}-controls`);
    if (!layerEl) return;
    // Tab order, not layout: must land AFTER a11y.setup's nodes.
    layerEl.parentNode?.appendChild(layerEl);
    spinBtn = layerEl.querySelector(`.${name}-spin-toggle`);
    hintEl = layerEl.querySelector(`.${name}-hint`);
    rotateBtns = [...layerEl.querySelectorAll(`.${name}-rotate`)];
    spinBtn?.addEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.addEventListener('click', onRotateClick));
    appliedVisible = null;
    appliedDismissed = null;
    renderSpinState();
  }

  function update() {
    if (!layerEl) return;
    const visible = getVisible();
    if (visible !== appliedVisible) {
      appliedVisible = visible;
      layerEl.classList.toggle('is-visible', visible);
      layerEl.inert = !visible;
    }
    const dismissed = typeof getHintDismissed === 'function' && getHintDismissed();
    if (dismissed !== appliedDismissed) {
      appliedDismissed = dismissed;
      hintEl?.classList.toggle('is-dismissed', dismissed);
    }
  }

  function isSpinPaused() { return paused; }

  function teardown() {
    spinBtn?.removeEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.removeEventListener('click', onRotateClick));
    layerEl?.classList.remove('is-visible');
    if (layerEl) layerEl.inert = true;
    hintEl?.classList.remove('is-dismissed');
    layerEl = null;
    spinBtn = null;
    hintEl = null;
    rotateBtns = [];
    appliedVisible = null;
    appliedDismissed = null;
  }

  return { setup, update, teardown, isSpinPaused };
}

const RETIRE_FADE_MS = 420;

const initialState = () => ({
  onCanvas: false,
  suppressed: false,
  active: false,
  retireT0: -1,
  mx: 0,
  my: 0,
  wx: NaN,
  wy: NaN,
  hasCoords: false,
});

export function createCursor(deps) {
  const { name, getGlobeLive, getCursorRetired, labelText } = deps;
  let canvasEl = null;
  let els = null;
  let state = initialState();
  let textWidth = 0;
  const isRtl = () => document.dir === 'rtl';

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function onMove(e) {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.hasCoords = true;
    state.suppressed = false;
  }
  function onEnter(e) { state.onCanvas = true; onMove(e); }
  function onLeave() { state.onCanvas = false; }
  function onSuppress() { state.suppressed = true; }

  function setup(canvas) {
    if (els) return;
    if (!window.matchMedia) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursorInner = `<div class="${name}-cursor-text-wrap">`
      + `<span class="${name}-cursor-text"></span>`
      + '</div>';
    const container = createTag('div', { class: `${name}-cursor`, 'aria-hidden': 'true' }, cursorInner);
    document.body.appendChild(container);
    container.querySelector(`.${name}-cursor-text`).textContent = labelText || 'Click & Drag';
    els = {
      container,
      text: container.querySelector(`.${name}-cursor-text-wrap`),
    };
    textWidth = els.text.offsetWidth;
    document.fonts?.ready?.then(() => { if (els) textWidth = els.text.offsetWidth; });

    canvasEl = canvas;
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('focusin', onSuppress);
    window.addEventListener('blur', onSuppress);
  }

  function update() {
    if (!els) return;

    const wantRetired = getCursorRetired();
    if (wantRetired !== (state.retireT0 >= 0)) {
      state.retireT0 = wantRetired ? now() : -1;
      els.container.classList.toggle(`${name}-cursor-retiring`, wantRetired);
    }
    const faded = state.retireT0 >= 0 && now() - state.retireT0 >= RETIRE_FADE_MS;

    const wantActive = state.hasCoords
      && state.onCanvas
      && !state.suppressed
      && getGlobeLive()
      && !faded;
    if (wantActive !== state.active) {
      state.active = wantActive;
      state.wx = NaN;
      els.container.classList.toggle(`${name}-cursor-active`, state.active);
    }
    if (!state.active || (state.mx === state.wx && state.my === state.wy)) return;
    state.wx = state.mx;
    state.wy = state.my;
    const textX = isRtl() ? state.mx - textWidth - 32 : state.mx + 32;
    els.text.style.transform = `translate(${textX}px, ${state.my - 11}px)`;
  }

  function teardown() {
    if (canvasEl) {
      canvasEl.removeEventListener('mouseenter', onEnter);
      canvasEl.removeEventListener('mouseleave', onLeave);
      canvasEl.removeEventListener('mousemove', onMove);
      canvasEl = null;
    }
    document.removeEventListener('focusin', onSuppress);
    window.removeEventListener('blur', onSuppress);
    if (els) {
      els.container.remove();
      els = null;
    }
    state = initialState();
  }

  return { setup, update, teardown };
}

// Keyboard + screen-reader gallery for the globe.

export function createGalleryA11y({
  name,
  q,
  getCount,
  cardOrder,
  getModalIdx,
  isGlobeFormed,
  getCardLabel,
  getCardLang = () => '',
  centerCard,
  openCard,
  onFocus,
  galleryInstructions,
  gid,
}) {
  // Uniform, never per card. Each `-`-separated segment must stay within 20 chars or Milo
  // truncates it.
  const daaName = name.replace(/-/g, '_');
  const CARD_OPEN_DAA_LL = `card_open--${daaName}`;
  const ENTER_GALLERY_DAA_LL = `enter_gallery_kbd--${daaName}`;
  let widgetEl = null; // collapsed entry button (single tab stop)
  let cardsEl = null; // container for the per-image browse buttons
  let cardButtons = []; // per-image buttons (tab order only while entered)
  let entered = false; // true while in BROWSE mode
  let focusedIdx = -1; // currently-focused browse image, -1 if none
  // Last-applied tab state; updateTabStops() only writes on a real change.
  let appliedModalOpen = null;
  let appliedEntered = null;

  function resetAppliedTabState() {
    appliedModalOpen = null;
    appliedEntered = null;
  }

  function setBrowseActive(active) {
    if (cardsEl) cardsEl.inert = !active;
  }

  function collapse() {
    entered = false;
    focusedIdx = -1;
    setBrowseActive(false);
    if (widgetEl) widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;
  }

  // Shared, not per-button closures; each reads its index from dataset.idx.
  function onCardFocus(e) {
    focusedIdx = Number(e.currentTarget.dataset.idx);
    centerCard(focusedIdx);
    onFocus();
  }
  function onCardBlur(e) {
    if (focusedIdx === Number(e.currentTarget.dataset.idx)) focusedIdx = -1;
    e.currentTarget.removeAttribute('style');
  }
  function onCardClick(e) {
    // Untrusted = synthesized by trackCardOpen(), report-only.
    if (!e.isTrusted) return;
    if (isGlobeFormed()) openCard(Number(e.currentTarget.dataset.idx));
  }
  function onCardKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      collapse();
      if (widgetEl) widgetEl.focus({ preventScroll: true });
      return;
    }
    if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
    const n = cardOrder.indexOf(Number(e.currentTarget.dataset.idx));
    const next = cardButtons[cardOrder[n + (e.shiftKey ? -1 : 1)]];
    if (!next) return;
    e.preventDefault();
    next.focus({ preventScroll: true });
  }

  function enterBrowse() {
    if (!isGlobeFormed() || !cardButtons.length) return;
    entered = true;
    if (widgetEl) widgetEl.tabIndex = -1;
    setBrowseActive(true);
    cardButtons[cardOrder[0]].focus({ preventScroll: true });
  }

  // Call after buildCards() so getCount() is final.
  function setup() {
    const canvas = q(`.${name}-canvas`);
    if (!canvas || !canvas.parentNode) return;
    const parent = canvas.parentNode;

    // Remove existing nodes on re-init so we don't double up.
    [`.${name}-a11y`, `.${name}-a11y-cards`].forEach((sel) => {
      const existing = q(sel);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    });

    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = `${name}-a11y`;
    widgetEl.setAttribute('daa-ll', ENTER_GALLERY_DAA_LL);
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // One element serves both the visible :focus-visible popup and the aria-labelledby name.
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = `${name}-a11y-tip`;
      descEl.id = `${name}-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      descEl.setAttribute('aria-hidden', 'true');
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    widgetEl.addEventListener('focus', () => { onFocus(); });
    widgetEl.addEventListener('click', () => { enterBrowse(); });

    cardsEl = document.createElement('div');
    cardsEl.className = `${name}-a11y-cards`;
    cardsEl.inert = true;
    const count = getCount();
    cardButtons = [];
    for (let n = 0; n < count; n += 1) {
      const i = cardOrder[n];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${name}-a11y-card`;
      btn.dataset.idx = String(i);
      btn.setAttribute('daa-ll', CARD_OPEN_DAA_LL);
      btn.setAttribute('aria-label', getCardLabel(i));
      if (getCardLang(i)) btn.lang = getCardLang(i);
      btn.addEventListener('focus', onCardFocus);
      btn.addEventListener('blur', onCardBlur);
      btn.addEventListener('click', onCardClick);
      btn.addEventListener('keydown', onCardKeydown);
      cardButtons[i] = btn;
      cardsEl.appendChild(btn);
    }

    // Skip while the modal is open, so focus returns to the image on close.
    cardsEl.addEventListener('focusout', (e) => {
      if (!entered || getModalIdx() >= 0) return;
      if (!e.relatedTarget && !document.hasFocus()) return;
      if (!e.relatedTarget || !cardsEl.contains(e.relatedTarget)) collapse();
    });

    parent.appendChild(widgetEl);
    parent.appendChild(cardsEl);
    entered = false;
    resetAppliedTabState();
  }

  // Only writes the DOM when (modalOpen, entered) flips.
  function updateTabStops() {
    if (!widgetEl) return;
    const modalOpen = getModalIdx() >= 0;
    if (modalOpen === appliedModalOpen && entered === appliedEntered) return;
    appliedModalOpen = modalOpen;
    appliedEntered = entered;
    widgetEl.tabIndex = !modalOpen && !entered ? 0 : -1;
    setBrowseActive(!modalOpen && entered);
  }

  // The core reads this to pause auto-spin so the globe holds the centred image.
  function isBrowsing() {
    return entered;
  }

  function focusCard(idx) {
    if (!entered) return;
    const btn = cardButtons[idx];
    if (!btn) return;
    setBrowseActive(true);
    btn.focus({ preventScroll: true });
  }

  // Report a canvas card open by clicking that card's button.
  function trackCardOpen(idx) {
    const btn = cardButtons[idx];
    if (!btn || !cardsEl) return;
    const wasInert = cardsEl.inert;
    cardsEl.inert = false;
    btn.click();
    cardsEl.inert = wasInert;
  }

  function getFocusedIdx() {
    return focusedIdx;
  }

  // Size the focused button to a screen-space rect so the ring tracks the image.
  function setFocusRect(cx, cy, w, h) {
    const btn = cardButtons[focusedIdx];
    if (!btn) return;
    btn.style.left = `${cx}px`;
    btn.style.top = `${cy}px`;
    btn.style.width = `${w}px`;
    btn.style.height = `${h}px`;
    btn.style.borderRadius = `${h * 0.035}px`;
    btn.style.opacity = w && h ? '' : '0';
  }

  function teardown() {
    [widgetEl, cardsEl].forEach((node) => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    widgetEl = null;
    cardsEl = null;
    cardButtons = [];
    entered = false;
    focusedIdx = -1;
    resetAppliedTabState();
  }

  return {
    setup,
    updateTabStops,
    teardown,
    isBrowsing,
    getFocusedIdx,
    setFocusRect,
    focusCard,
    trackCardOpen,
  };
}

export function escapeHtml(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s ?? '').replace(/[&<>"']/g, (c) => map[c]);
}

// Fallback only; authored inline so it stays localizable.
export const DEFAULT_GALLERY_INSTRUCTIONS = 'Press Enter to enter the gallery, then Tab through the images.';

export const DEFAULT_TOUCH_HINT = 'Click and drag to rotate. Tap to dive deep into the artwork.';

export const LABEL_DIVIDER = '||';

const DEFAULT_LABELS = [
  DEFAULT_GALLERY_INSTRUCTIONS,
  'Rotate left', 'Rotate right', 'Pause spinning', 'Resume spinning',
  'Previous card', '{index} of {count}', 'Next card', 'Close',
];

const CARD_TPL_INDEX = 6;

export function buildLabels(parts) {
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

export function cellParas(cell) {
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

export function hangOpeningMark(el, room, isRetry = false) {
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

export function plainQuote(quoteEl, name) {
  if (!quoteEl) return '';
  if (!QUOTE_TEXT.has(quoteEl)) QUOTE_TEXT.set(quoteEl, quoteEl.textContent);
  const text = QUOTE_TEXT.get(quoteEl).trim();
  quoteEl.textContent = text;
  hangOpeningMark(quoteEl, gutterOf(quoteEl.closest(`.${name}-pullquote`)));
  return text;
}

const buildMarkup = ({ name, labels, canvasStyle, arcCopyHtml, modalInfoHtml }) => {
  const daaName = name.replace(/-/g, '_');
  return `
  <div class="${name}-world">
    <canvas class="${name}-canvas" style="${canvasStyle}"></canvas>
    <div class="${name}-controls" inert>
      <button class="${name}-control ${name}-spin-toggle" type="button" daa-ll="pause_spin--${daaName}" aria-label="${escapeHtml(labels.pauseSpin)}">
        <svg class="${name}-icon-pause" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="8" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>
        <svg class="${name}-icon-play" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>
      </button>
      <div class="${name}-hint">
        <button class="${name}-control ${name}-rotate" type="button" data-dir="-1" daa-ll="rotate_left--${daaName}" aria-label="${escapeHtml(labels.rotateLeft)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="${name}-hint-text"></div>
        <button class="${name}-control ${name}-rotate" type="button" data-dir="1" daa-ll="rotate_right--${daaName}" aria-label="${escapeHtml(labels.rotateRight)}">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>

${arcCopyHtml}  <div class="${name}-pullquote-pin">
    <div class="${name}-pullquote-rail">
      <figure class="${name}-pullquote">
        <blockquote class="${name}-pullquote-quote heading-1"></blockquote>
        <figcaption class="${name}-pullquote-attribution">
          <p class="${name}-pullquote-name body-lg"></p>
          <p class="${name}-pullquote-role body-lg"></p>
        </figcaption>
      </figure>
    </div>
  </div>

  <div class="${name}-modal" aria-hidden="true">
    <div class="${name}-modal-backdrop"></div>
  </div>

  <canvas class="${name}-modal-canvas" style="position:fixed;top:0;left:0;width:100%;height:100vh;z-index:14;display:none;pointer-events:none;"></canvas>

  <dialog class="${name}-modal-chrome">
    ${modalInfoHtml.trim()}
    <!-- sr-only alt for the WebGL photo; after the info so the heading is read first. -->
    <span class="${name}-modal-image sr-only" role="img"></span>
    <!-- Controls after the info scrim so they paint on top of it. -->
    <button class="${name}-modal-nav ${name}-modal-nav-prev" type="button" daa-ll="prev_card-1--globe_card_modal" aria-label="${escapeHtml(labels.prevCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="${name}-modal-counter" aria-hidden="true"></div>
    <span class="${name}-modal-position sr-only" role="note"></span>
    <button class="${name}-modal-nav ${name}-modal-nav-next" type="button" daa-ll="next_card-2--globe_card_modal" aria-label="${escapeHtml(labels.nextCard)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="${name}-modal-close" type="button" daa-ll="close-3--globe_card_modal" aria-label="${escapeHtml(labels.closeBtn)}">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
    </button>
    <span class="${name}-modal-announce sr-only" aria-live="polite"></span>
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
  el.innerHTML = buildMarkup({ name, labels, canvasStyle, arcCopyHtml, modalInfoHtml });
  const hintEl = el.querySelector(`.${name}-hint-text`);
  if (touchHint.paras.length) renderParagraphs(hintEl, touchHint.paras);
  else hintEl.textContent = touchHint.text;
  if (pullQuote) {
    el.querySelector(`.${name}-pullquote-quote`).textContent = pullQuote.quote;
    el.querySelector(`.${name}-pullquote-name`).textContent = pullQuote.name;
    el.querySelector(`.${name}-pullquote-role`).textContent = pullQuote.role;
  } else {
    el.querySelector(`.${name}-pullquote-pin`)?.remove();
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
