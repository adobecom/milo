// Pointer interaction for the globe.
import * as THREE from '../three.module.min.js';

const FRAME_MS = 1000 / 60; // velX/velY are per-60fps-frame; the core rescales by real frame dt
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
  getRenderer, getCamera, getCards, getModalIdx, openModal,
  getSphereFormT, getDragSensitivity, interactiveThreshold, maxVel, drag,
  getYawOnly,
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
  let hoveringCard = false;
  let appliedCursor = null; // last value written to canvas.style.cursor

  // Sole writer of the canvas cursor. Also called per-frame: the gate flips on scroll alone.
  function applyCursor() {
    if (!canvasEl) return;
    let want = '';
    if (getSphereFormT() >= interactiveThreshold && getModalIdx() < 0) {
      if (drag.isDragging) want = 'grabbing';
      else want = hoveringCard ? 'pointer' : 'grab';
    }
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

  function onPointerDown(e) {
    if (e.button !== 0 || !e.isPrimary) return;
    if (getModalIdx() >= 0) return;
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
    applyCursor();
  }

  function onPointerMove(e) {
    if (!ownsDrag(e)) return;
    resolveAxisLock(e);
    // Inert until the axis latches horizontal. lastMX/MY/lastMoveT are NOT advanced here, so
    // neither the travel nor the elapsed time is lost.
    if (isTouchDrag && axisLock !== AXIS_HORIZONTAL) return;
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
    if (dx < CLICK_MAX_MOVE && dy < CLICK_MAX_MOVE && dt < CLICK_MAX_TIME
      && getSphereFormT() >= interactiveThreshold && getModalIdx() < 0) {
      handleCardClick(e);
    }
  }

  function clearHover() {
    hoveringCard = false;
    const cards = getCards();
    for (let i = 0; i < cards.length; i += 1) cards[i].hoverTarget = 0;
  }

  function onHover(e) {
    if (e.pointerType !== 'mouse') return;
    const camera = getCamera();
    if (!getRenderer() || !camera) return;
    const cards = getCards();
    if (getSphereFormT() < interactiveThreshold || getModalIdx() >= 0) {
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

  // True while an in-flight touch gesture is page scroll or undecided. Gated on isDragging —
  // isTouchDrag persists after pointerup.
  const isPageScrollGesture = () => drag.isDragging
    && isTouchDrag
    && axisLock !== AXIS_HORIZONTAL;

  return { setup, teardown, isPageScrollGesture, applyCursor };
}
