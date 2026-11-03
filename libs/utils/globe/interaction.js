import * as THREE from '../../deps/three.js';
// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../utils.js';
import { FRAME_MS, MAX_VEL, clamp, isRtl, mediaMatches } from './core.js';
import { daaBlockName } from './authoring.js';

const VEL_SMOOTH_MS = 35;
const CLICK_MAX_MOVE = 10;
const CLICK_MAX_MS = 500;
const PICK_MIN_OPACITY = 0.1;
// Touch axis lock: touch gets yaw only; a vertical drag is page scroll.
const AXIS_LOCK_THRESHOLD = 8;

export default function createInteraction(ctx, { openModal, isGlobeLive, onDrag }) {
  const { drag } = ctx;
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
  let axisLock = null;
  let dragMoved = false;
  let hoveringCard = false;
  let appliedCursor = null;

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

  const travelled = (e) => Math.max(
    Math.abs(e.clientX - pointerDownX),
    Math.abs(e.clientY - pointerDownY),
  );

  function resolveAxisLock(e) {
    if (!isTouchDrag || axisLock || travelled(e) < AXIS_LOCK_THRESHOLD) return;
    axisLock = Math.abs(e.clientX - pointerDownX) > Math.abs(e.clientY - pointerDownY) ? 'x' : 'y';
  }

  const ownsDrag = (e) => activePointerId === e.pointerId;

  function dropTravel() {
    drag.velX = 0;
    drag.velY = 0;
    drag.pendingX = 0;
    drag.pendingY = 0;
    sampX = 0;
    sampY = 0;
  }

  function releaseGesture() {
    drag.isDragging = false;
    activePointerId = -1;
    axisLock = null;
  }

  // NOT called on pointerup — release keeps velX/velY as inertia.
  function resetDrag() {
    releaseGesture();
    dropTravel();
    applyCursor();
  }

  // Abort outright: no inertia, no tap.
  function cancelDrag() {
    if (drag.isDragging) resetDrag();
  }

  // Fold banked travel into the velocity EMA, sampled by elapsed time, not per event.
  const clampVel = (v) => clamp(v, -MAX_VEL, MAX_VEL);
  function flushVel(t) {
    const dtMs = t - lastMoveT;
    if (dtMs <= 0) return;
    const a = 1 - Math.exp(-dtMs / VEL_SMOOTH_MS);
    drag.velX = clampVel(drag.velX + ((sampX / dtMs) * FRAME_MS - drag.velX) * a);
    drag.velY = clampVel(drag.velY + ((sampY / dtMs) * FRAME_MS - drag.velY) * a);
    sampX = 0;
    sampY = 0;
    lastMoveT = t;
  }

  // Keeps velX/velY as inertia, decayed across the idle gap since the last move. False when
  // there was no gesture to end.
  function endGesture() {
    if (!drag.isDragging) return false;
    releaseGesture();
    flushVel(performance.now());
    applyCursor();
    return true;
  }

  function pickCards(e) {
    const { renderer, camera } = ctx;
    const rect = renderer.domElement.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const { cards } = ctx;
    pickable.length = 0;
    for (let i = 0; i < cards.length; i += 1) {
      const m = cards[i].mesh;
      if (m.visible && m.material.opacity >= PICK_MIN_OPACITY) pickable.push(m);
    }
    return raycaster.intersectObjects(pickable, false);
  }

  function clearHover() {
    hoveringCard = false;
    ctx.cards.forEach((card) => { card.hoverTarget = 0; });
  }

  function onPointerDown(e) {
    if (e.button !== 0 || !e.isPrimary || !isGlobeLive()) return;
    canvasEl.setPointerCapture(e.pointerId);
    activePointerId = e.pointerId;
    drag.isDragging = true;
    dropTravel();
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    lastMX = pointerDownX;
    lastMY = pointerDownY;
    pointerDownT = performance.now();
    lastMoveT = pointerDownT;
    isTouchDrag = e.pointerType === 'touch' || e.pointerType === 'pen';
    axisLock = null;
    dragMoved = false;
    clearHover();
    applyCursor();
  }

  function onPointerMove(e) {
    if (!ownsDrag(e)) return;
    resolveAxisLock(e);
    // Inert until the axis latches horizontal. lastMX/MY/lastMoveT are NOT advanced here, so
    // neither the travel nor the elapsed time is lost.
    if (isTouchDrag && axisLock !== 'x') return;
    if (!dragMoved && travelled(e) >= CLICK_MAX_MOVE) {
      dragMoved = true;
      onDrag();
    }
    const t = performance.now();
    const sens = ctx.dragSensitivity;
    const dx = (e.clientX - lastMX) * sens;
    // Pitch only for a mouse on the sphere.
    const dy = !isTouchDrag && !ctx.bp.CYLINDER ? (e.clientY - lastMY) * sens : 0;
    // pendingX/Y: exact travel, applied 1:1. velX/Y: smoothed, for the release.
    drag.pendingX += dx;
    drag.pendingY += dy;
    sampX += dx;
    sampY += dy;
    flushVel(t);
    lastMX = e.clientX;
    lastMY = e.clientY;
  }

  function handleCardClick(e) {
    const [hit] = pickCards(e);
    const i = hit ? ctx.cards.findIndex((card) => card.mesh === hit.object) : -1;
    if (i >= 0) openModal(i, e.clientX, e.clientY);
  }

  function onPointerUp(e) {
    if (!ownsDrag(e) || !endGesture()) return;
    const isTap = travelled(e) < CLICK_MAX_MOVE && performance.now() - pointerDownT < CLICK_MAX_MS;
    if (isTap && isGlobeLive()) handleCardClick(e);
  }

  function onHover(e) {
    if (e.pointerType !== 'mouse' || drag.isDragging) return;
    if (!isGlobeLive()) {
      clearHover();
      applyCursor();
      return;
    }
    const [hit] = pickCards(e);
    hoveringCard = !!hit;
    applyCursor();
    ctx.cards.forEach((card) => {
      const isHit = card.mesh === hit?.object;
      card.hoverTarget = isHit ? 1 : 0;
      if (isHit && hit.uv) card.hoverUV.copy(hit.uv);
    });
  }

  function teardown() {
    canvasEl.style.cursor = '';
    appliedCursor = null;
    canvasEl = null;
    hoveringCard = false;
    resetDrag();
  }

  function setup(canvas) {
    const { disposer } = ctx;
    canvasEl = canvas;
    disposer.add(teardown);
    disposer.listen(canvas, 'pointerdown', onPointerDown);
    disposer.listen(canvas, 'pointermove', onPointerMove);
    disposer.listen(canvas, 'pointerup', onPointerUp);
    // pointercancel = taken away, not released: no inertia, no tap. lostpointercapture is a
    // no-op after a normal release, and the escape hatch on a real loss.
    disposer.listen(canvas, 'pointercancel', cancelDrag);
    disposer.listen(canvas, 'lostpointercapture', endGesture);
    disposer.listen(canvas, 'contextmenu', cancelDrag);
    disposer.listen(canvas, 'pointermove', onHover);
    disposer.listen(canvas, 'pointerleave', clearHover);
  }

  return { setup, applyCursor };
}

export function createGlobeControls(ctx, { name, labels, getVisible, getHintDismissed, rotate }) {
  const daaName = daaBlockName(name);
  const SPIN_DAA_PAUSE = `pause_spin--${daaName}`;
  const SPIN_DAA_RESUME = `resume_spin--${daaName}`;
  let layerEl = null;
  let spinBtn = null;
  let hintEl = null;
  let paused = false; // survives breakpoint rebuilds — the closure outlives them
  let appliedVisible = null;
  let appliedDismissed = null;

  function renderSpinState() {
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

  function teardown() {
    layerEl.classList.remove('is-visible');
    layerEl.inert = true;
    hintEl.classList.remove('is-dismissed');
    layerEl = null;
    spinBtn = null;
    hintEl = null;
  }

  function setup() {
    const { disposer } = ctx;
    layerEl = ctx.q('.globe-controls');
    disposer.add(teardown);
    // Tab order, not layout: must land AFTER a11y.setup's nodes.
    layerEl.parentNode.append(layerEl);
    spinBtn = layerEl.querySelector('.globe-spin-toggle');
    hintEl = layerEl.querySelector('.globe-hint');
    disposer.listen(spinBtn, 'click', onSpinClick);
    layerEl.querySelectorAll('.globe-rotate').forEach((btn) => {
      disposer.listen(btn, 'click', onRotateClick);
    });
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
    const dismissed = getHintDismissed();
    if (dismissed !== appliedDismissed) {
      appliedDismissed = dismissed;
      hintEl.classList.toggle('is-dismissed', dismissed);
    }
  }

  return { setup, update, isSpinPaused: () => paused };
}

const RETIRE_FADE_MS = 420;
const CURSOR_GAP_PX = 32;
const CURSOR_HALF_H_PX = 11;

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

export function createCursor(ctx, { getGlobeLive, getCursorRetired, labelText }) {
  let els = null;
  let state = initialState();
  let textWidth = 0;

  function onMove(e) {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.hasCoords = true;
    state.suppressed = false;
  }
  function onEnter(e) {
    state.onCanvas = true;
    onMove(e);
  }
  function onLeave() { state.onCanvas = false; }
  function onSuppress() { state.suppressed = true; }

  function teardown() {
    els.container.remove();
    els = null;
    state = initialState();
  }

  function setup(canvas) {
    if (els || !mediaMatches('(hover: hover) and (pointer: fine)')) return;

    const label = createTag('span', { class: 'globe-cursor-text' });
    label.textContent = labelText;
    const text = createTag('div', { class: 'globe-cursor-text-wrap' }, label);
    const container = createTag('div', { class: 'globe-cursor', 'aria-hidden': 'true' }, text, { parent: document.body });
    els = { container, text };
    textWidth = els.text.offsetWidth;
    document.fonts?.ready.then(() => { if (els) textWidth = els.text.offsetWidth; });

    const { disposer } = ctx;
    disposer.add(teardown);
    disposer.listen(canvas, 'mouseenter', onEnter);
    disposer.listen(canvas, 'mouseleave', onLeave);
    disposer.listen(canvas, 'mousemove', onMove, { passive: true });
    disposer.listen(document, 'focusin', onSuppress);
    disposer.listen(window, 'blur', onSuppress);
  }

  function update() {
    if (!els) return;

    const wantRetired = getCursorRetired();
    if (wantRetired !== (state.retireT0 >= 0)) {
      state.retireT0 = wantRetired ? performance.now() : -1;
      els.container.classList.toggle('globe-cursor-retiring', wantRetired);
    }
    const faded = state.retireT0 >= 0 && performance.now() - state.retireT0 >= RETIRE_FADE_MS;

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
    const textX = isRtl() ? state.mx - textWidth - CURSOR_GAP_PX : state.mx + CURSOR_GAP_PX;
    els.text.style.transform = `translate(${textX}px, ${state.my - CURSOR_HALF_H_PX}px)`;
  }

  return { setup, update };
}

export function createGalleryA11y(ctx, {
  name,
  gid,
  galleryInstructions,
  getModalIdx,
  isGlobeFormed,
  centerCard,
  openCard,
  onFocus,
}) {
  const { cardOrder } = ctx;
  // Each `-`-separated segment must stay within 20 chars or Milo truncates it.
  const daaName = daaBlockName(name);
  const CARD_OPEN_DAA_LL = `card_open--${daaName}`;
  const ENTER_GALLERY_DAA_LL = `enter_gallery_kbd--${daaName}`;
  let widgetEl = null;
  let cardsEl = null;
  let cardButtons = [];
  let entered = false;
  let focusedIdx = -1;
  let appliedModalOpen = null;
  let appliedEntered = null;

  function resetAppliedTabState() {
    appliedModalOpen = null;
    appliedEntered = null;
  }

  function setBrowseActive(active) {
    if (cardsEl) cardsEl.inert = !active;
  }

  function syncWidgetTab() {
    if (widgetEl) widgetEl.tabIndex = getModalIdx() < 0 && !entered ? 0 : -1;
  }

  function collapse() {
    entered = false;
    focusedIdx = -1;
    setBrowseActive(false);
    syncWidgetTab();
  }

  const cardIdx = (e) => Number(e.target.closest('.globe-a11y-card')?.dataset.idx ?? -1);

  function onCardFocus(e, idx) {
    focusedIdx = idx;
    centerCard(idx);
    onFocus();
  }
  function onCardClick(e, idx) {
    // Untrusted = synthesized by trackCardOpen(), report-only.
    if (e.isTrusted && isGlobeFormed()) openCard(idx);
  }
  function onCardKeydown(e, idx) {
    if (e.key === 'Escape') {
      e.preventDefault();
      collapse();
      widgetEl?.focus({ preventScroll: true });
      return;
    }
    if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
    const next = cardButtons[cardOrder[cardOrder.indexOf(idx) + (e.shiftKey ? -1 : 1)]];
    if (!next) return;
    e.preventDefault();
    next.focus({ preventScroll: true });
  }
  // Skip the collapse while the modal is open, so focus returns to the image on close.
  function onCardsFocusOut(e) {
    const idx = cardIdx(e);
    if (idx >= 0) {
      if (focusedIdx === idx) focusedIdx = -1;
      e.target.removeAttribute('style');
    }
    const to = e.relatedTarget;
    if (!entered || getModalIdx() >= 0 || (!to && !document.hasFocus())) return;
    if (!cardsEl.contains(to)) collapse();
  }

  function enterBrowse() {
    if (!isGlobeFormed() || !cardButtons.length) return;
    entered = true;
    syncWidgetTab();
    setBrowseActive(true);
    cardButtons[cardOrder[0]].focus({ preventScroll: true });
  }

  function teardown() {
    widgetEl?.remove();
    cardsEl?.remove();
    widgetEl = null;
    cardsEl = null;
    cardButtons = [];
    entered = false;
    focusedIdx = -1;
    resetAppliedTabState();
  }

  function setup() {
    const parent = ctx.q('.globe-canvas').parentNode;
    ctx.disposer.add(teardown);

    widgetEl = createTag('button', { type: 'button', class: 'globe-a11y', 'daa-ll': ENTER_GALLERY_DAA_LL });
    syncWidgetTab();

    // One element serves both the visible :focus-visible popup and the aria-labelledby name.
    if (galleryInstructions) {
      const descEl = createTag('span', { class: 'globe-a11y-tip', id: `globe-a11y-desc-${gid}`, 'aria-hidden': 'true' });
      descEl.textContent = galleryInstructions;
      widgetEl.append(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    widgetEl.addEventListener('focus', onFocus);
    widgetEl.addEventListener('click', enterBrowse);

    cardsEl = createTag('div', { class: 'globe-a11y-cards' });
    cardsEl.inert = true;
    cardButtons = [];
    cardOrder.forEach((i) => {
      const meta = ctx.cardMeta(i);
      const btn = createTag('button', {
        type: 'button',
        class: 'globe-a11y-card',
        'data-idx': i,
        'daa-ll': CARD_OPEN_DAA_LL,
        'aria-label': meta.alt || `Image ${ctx.authoredNo(i)}`,
      });
      if (meta.alt && meta.lang) btn.lang = meta.lang;
      cardButtons[i] = btn;
      cardsEl.append(btn);
    });
    const onCard = (handler) => (e) => {
      const idx = cardIdx(e);
      if (idx >= 0) handler(e, idx);
    };
    cardsEl.addEventListener('focusin', onCard(onCardFocus));
    cardsEl.addEventListener('click', onCard(onCardClick));
    cardsEl.addEventListener('keydown', onCard(onCardKeydown));
    cardsEl.addEventListener('focusout', onCardsFocusOut);

    parent.append(widgetEl, cardsEl);
    entered = false;
    resetAppliedTabState();
  }

  function updateTabStops() {
    if (!widgetEl) return;
    const modalOpen = getModalIdx() >= 0;
    if (modalOpen === appliedModalOpen && entered === appliedEntered) return;
    appliedModalOpen = modalOpen;
    appliedEntered = entered;
    syncWidgetTab();
    setBrowseActive(!modalOpen && entered);
  }

  function focusCard(idx) {
    const btn = cardButtons[idx];
    if (!entered || !btn) return;
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

  function setFocusRect(cx, cy, w, h) {
    const btn = cardButtons[focusedIdx];
    if (!btn) return;
    Object.assign(btn.style, {
      left: `${cx}px`,
      top: `${cy}px`,
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: `${h * 0.035}px`,
      opacity: w && h ? '' : '0',
    });
  }

  return {
    setup,
    updateTabStops,
    isBrowsing: () => entered,
    getFocusedIdx: () => focusedIdx,
    setFocusRect,
    focusCard,
    trackCardOpen,
  };
}
