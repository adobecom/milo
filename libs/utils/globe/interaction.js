// Pointer, keyboard and on-canvas interaction for the globe: drag/pick, controls, cursor, a11y.
import * as THREE from '../../deps/three.js';
// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../utils.js';
import { FRAME_MS } from './core.js';
import { daaBlockName } from './authoring.js';

const VEL_SMOOTH_MS = 35; // EMA time constant
const CLICK_MAX_MOVE = 10; // px
const CLICK_MAX_TIME = 500; // ms
const PICK_MIN_OPACITY = 0.1;
// Touch axis lock: touch gets yaw only; a vertical drag is page scroll.
const AXIS_LOCK_THRESHOLD = 8; // px of travel before the axis is decided
const AXIS_UNDECIDED = 0;
const AXIS_HORIZONTAL = 1; // spinning the globe — we consume the deltas
const AXIS_VERTICAL = 2; // page scroll — we ignore the gesture entirely

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export default function createInteraction({
  getRenderer, getCamera, getCards, openModal,
  getDragSensitivity, isGlobeLive, maxVel, drag,
  getYawOnly, onDrag,
}) {
  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();
  const pickable = []; // reused per pick; pointermove outruns rAF, so don't allocate here

  let canvasEl = null;
  let activePointerId = -1; // owner of the in-flight gesture (-1 = none), not hasPointerCapture()
  let lastMX = 0;
  let lastMY = 0;
  let lastMoveT = 0;
  let sampX = 0; // travel (rad) banked since the last velocity sample — see flushVel
  let sampY = 0;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownT = 0;
  // Per-gesture, so the axis lock still applies correctly on hybrids.
  let isTouchDrag = false;
  let axisLock = AXIS_UNDECIDED;
  let dragMoved = false;
  let hoveringCard = false;
  let appliedCursor = null; // last value written to canvas.style.cursor

  // Sole writer of the canvas cursor. Also called per-frame: the gate flips on scroll alone.
  function applyCursor() {
    if (!canvasEl) return;
    let want = '';
    // A gesture already in flight keeps 'grabbing' until release: pointer capture outlives the
    // live gate, and the rotation it is still driving is real.
    if (drag.isDragging) want = 'grabbing';
    else if (isGlobeLive()) want = hoveringCard ? 'pointer' : 'grab';
    if (want === appliedCursor) return;
    appliedCursor = want;
    canvasEl.style.cursor = want;
  }

  function resolveAxisLock(e) {
    if (!isTouchDrag || axisLock !== AXIS_UNDECIDED) return;
    const tdx = Math.abs(e.clientX - pointerDownX);
    const tdy = Math.abs(e.clientY - pointerDownY);
    if (Math.max(tdx, tdy) < AXIS_LOCK_THRESHOLD) return;
    axisLock = tdx > tdy ? AXIS_HORIZONTAL : AXIS_VERTICAL;
  }

  const ownsDrag = (e) => activePointerId === e.pointerId;

  // NOT called on pointerup — release keeps velX/velY as inertia.
  function resetDrag() {
    drag.isDragging = false;
    drag.velX = 0;
    drag.velY = 0;
    drag.pendingX = 0;
    drag.pendingY = 0;
    sampX = 0;
    sampY = 0;
    activePointerId = -1;
    axisLock = AXIS_UNDECIDED;
    applyCursor();
  }

  // Abort outright: no inertia, no tap.
  function cancelDrag() {
    if (!drag.isDragging) return;
    resetDrag();
  }

  // Fold banked travel into the velocity EMA, sampled by elapsed time, not per event.
  const clampVel = (v) => Math.max(-maxVel, Math.min(maxVel, v));
  function flushVel(t) {
    const dtMs = t - lastMoveT;
    if (dtMs <= 0) return;
    const a = 1 - Math.exp(-dtMs / VEL_SMOOTH_MS);
    drag.velX = clampVel(drag.velX + ((sampX / dtMs) * FRAME_MS - drag.velX) * a);
    drag.velY = clampVel(drag.velY + ((sampY / dtMs) * FRAME_MS - drag.velY) * a);
    sampX = 0; sampY = 0;
    lastMoveT = t;
  }

  // Keeps velX/velY as inertia, decayed across the idle gap since the last move. False when
  // there was no gesture to end.
  function endGesture() {
    if (!drag.isDragging) return false;
    drag.isDragging = false;
    activePointerId = -1;
    axisLock = AXIS_UNDECIDED; // cleared for the next gesture; the tap test doesn't read it
    flushVel(now());
    applyCursor();
    return true;
  }

  function pickCards(e) {
    const renderer = getRenderer();
    const camera = getCamera();
    if (!renderer || !camera) return [];
    const rect = renderer.domElement.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const cards = getCards();
    pickable.length = 0;
    for (let i = 0; i < cards.length; i += 1) {
      const m = cards[i].mesh;
      if (m.visible && m.material.opacity >= PICK_MIN_OPACITY) pickable.push(m);
    }
    return raycaster.intersectObjects(pickable, false);
  }

  function clearHover() {
    hoveringCard = false;
    const cards = getCards();
    for (let i = 0; i < cards.length; i += 1) cards[i].hoverTarget = 0;
  }

  function onPointerDown(e) {
    if (e.button !== 0 || !e.isPrimary) return;
    if (!isGlobeLive()) return;
    canvasEl.setPointerCapture(e.pointerId);
    activePointerId = e.pointerId;
    drag.isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    drag.velX = 0; drag.velY = 0;
    drag.pendingX = 0; drag.pendingY = 0;
    sampX = 0; sampY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = now();
    lastMoveT = pointerDownT;
    isTouchDrag = e.pointerType === 'touch' || e.pointerType === 'pen';
    axisLock = AXIS_UNDECIDED;
    dragMoved = false;
    clearHover();
    applyCursor();
  }

  function onPointerMove(e) {
    if (!ownsDrag(e)) return;
    resolveAxisLock(e);
    // Inert until the axis latches horizontal. lastMX/MY/lastMoveT are NOT advanced here, so
    // neither the travel nor the elapsed time is lost.
    if (isTouchDrag && axisLock !== AXIS_HORIZONTAL) return;
    if (!dragMoved
      && (Math.abs(e.clientX - pointerDownX) >= CLICK_MAX_MOVE
        || Math.abs(e.clientY - pointerDownY) >= CLICK_MAX_MOVE)) {
      dragMoved = true;
      onDrag();
    }
    const t = now();
    const sens = getDragSensitivity(); // rad/px, live off the viewport + band
    const dx = (e.clientX - lastMX) * sens;
    // Pitch only for a mouse on the sphere.
    const dy = !isTouchDrag && !getYawOnly() ? (e.clientY - lastMY) * sens : 0;
    // pendingX/Y: exact travel, applied 1:1. velX/Y: smoothed, for the release.
    drag.pendingX += dx;
    drag.pendingY += dy;
    sampX += dx; sampY += dy;
    flushVel(t);
    lastMX = e.clientX; lastMY = e.clientY;
  }

  function handleCardClick(e) {
    const hits = pickCards(e);
    if (hits.length === 0) return;
    const hitMesh = hits[0].object;
    const cards = getCards();
    for (let i = 0; i < cards.length; i += 1) {
      if (cards[i].mesh === hitMesh) {
        openModal(i, e.clientX, e.clientY);
        break;
      }
    }
  }

  function onPointerUp(e) {
    if (!ownsDrag(e) || !endGesture()) return;
    const dx = Math.abs(e.clientX - pointerDownX);
    const dy = Math.abs(e.clientY - pointerDownY);
    const dt = now() - pointerDownT;
    if (dx < CLICK_MAX_MOVE && dy < CLICK_MAX_MOVE && dt < CLICK_MAX_TIME && isGlobeLive()) {
      handleCardClick(e);
    }
  }

  function onHover(e) {
    if (e.pointerType !== 'mouse' || drag.isDragging) return;
    const camera = getCamera();
    if (!getRenderer() || !camera) return;
    const cards = getCards();
    if (!isGlobeLive()) {
      hoveringCard = false;
      applyCursor();
      clearHover();
      return;
    }
    const hits = pickCards(e);
    hoveringCard = hits.length > 0;
    applyCursor();

    const hitMesh = hits.length > 0 ? hits[0].object : null;
    const hitUV = hits.length > 0 ? hits[0].uv : null;
    for (let i = 0; i < cards.length; i += 1) {
      const isHit = (cards[i].mesh === hitMesh);
      cards[i].hoverTarget = isHit ? 1 : 0;
      if (isHit && hitUV) cards[i].hoverUV.copy(hitUV);
    }
  }

  function setup(canvas) {
    canvasEl = canvas;
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    // pointercancel = taken away, not released: no inertia, no tap. lostpointercapture is a
    // no-op after a normal release, and the escape hatch on a real loss.
    canvas.addEventListener('pointercancel', cancelDrag);
    canvas.addEventListener('lostpointercapture', endGesture);
    canvas.addEventListener('contextmenu', cancelDrag);
    canvas.addEventListener('pointermove', onHover);
    canvas.addEventListener('pointerleave', clearHover);
  }

  function teardown() {
    if (canvasEl) {
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointercancel', cancelDrag);
      canvasEl.removeEventListener('lostpointercapture', endGesture);
      canvasEl.removeEventListener('contextmenu', cancelDrag);
      canvasEl.removeEventListener('pointermove', onHover);
      canvasEl.removeEventListener('pointerleave', clearHover);
      canvasEl.style.cursor = '';
      appliedCursor = null;
      canvasEl = null;
    }
    resetDrag();
  }

  return { setup, teardown, applyCursor };
}

// On-canvas globe chrome: auto-spin play/pause + the barrel's rotate row.
export function createGlobeControls({
  name, q, labels, getVisible, getHintDismissed, rotate,
}) {
  const daaName = daaBlockName(name);
  const SPIN_DAA_PAUSE = `pause_spin--${daaName}`;
  const SPIN_DAA_RESUME = `resume_spin--${daaName}`;
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
    layerEl = q('.globe-controls');
    if (!layerEl) return;
    // Tab order, not layout: must land AFTER a11y.setup's nodes.
    layerEl.parentNode?.appendChild(layerEl);
    spinBtn = layerEl.querySelector('.globe-spin-toggle');
    hintEl = layerEl.querySelector('.globe-hint');
    rotateBtns = [...layerEl.querySelectorAll('.globe-rotate')];
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
  const { getGlobeLive, getCursorRetired, labelText } = deps;
  let canvasEl = null;
  let els = null;
  let state = initialState();
  let textWidth = 0;
  const isRtl = () => document.dir === 'rtl';

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

    const cursorInner = '<div class="globe-cursor-text-wrap">'
      + '<span class="globe-cursor-text"></span>'
      + '</div>';
    const container = createTag('div', { class: 'globe-cursor', 'aria-hidden': 'true' }, cursorInner);
    document.body.appendChild(container);
    container.querySelector('.globe-cursor-text').textContent = labelText;
    els = {
      container,
      text: container.querySelector('.globe-cursor-text-wrap'),
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
      els.container.classList.toggle('globe-cursor-retiring', wantRetired);
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
      els.container.classList.toggle('globe-cursor-active', state.active);
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
  const daaName = daaBlockName(name);
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
    const canvas = q('.globe-canvas');
    if (!canvas || !canvas.parentNode) return;
    const parent = canvas.parentNode;

    // Remove existing nodes on re-init so we don't double up.
    ['.globe-a11y', '.globe-a11y-cards'].forEach((sel) => {
      const existing = q(sel);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    });

    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = 'globe-a11y';
    widgetEl.setAttribute('daa-ll', ENTER_GALLERY_DAA_LL);
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // One element serves both the visible :focus-visible popup and the aria-labelledby name.
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = 'globe-a11y-tip';
      descEl.id = `globe-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      descEl.setAttribute('aria-hidden', 'true');
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    widgetEl.addEventListener('focus', () => { onFocus(); });
    widgetEl.addEventListener('click', () => { enterBrowse(); });

    cardsEl = document.createElement('div');
    cardsEl.className = 'globe-a11y-cards';
    cardsEl.inert = true;
    const count = getCount();
    cardButtons = [];
    for (let n = 0; n < count; n += 1) {
      const i = cardOrder[n];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-a11y-card';
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
