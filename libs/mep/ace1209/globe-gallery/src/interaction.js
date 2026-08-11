// Pointer interaction for the globe (DI module). See README (Behavior notes).
import * as THREE from '../three.module.min.js';

const DRAG_SENSITIVITY = 0.005; // pointer px → rad/frame drag velocity
const CLICK_MAX_MOVE = 10; // px
const CLICK_MAX_TIME = 500; // ms
const PICK_MIN_OPACITY = 0.1;
// Touch axis lock: touch gets yaw only (vertical drag = page scroll). See README.
const AXIS_LOCK_THRESHOLD = 8; // px of travel before the axis is decided
const AXIS_UNDECIDED = 0;
const AXIS_HORIZONTAL = 1; // spinning the globe — we consume the deltas
const AXIS_VERTICAL = 2; // page scroll — we ignore the gesture entirely

export default function createInteraction({
  getRenderer, getCamera, getCards, getModalIdx, openModal,
  getSphereFormT, interactiveThreshold, maxVel, drag, isCursorActive, getYawOnly,
}) {
  // Raycaster + NDC scratch for canvas picking.
  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();

  let canvasEl = null;
  let lastMX = 0;
  let lastMY = 0;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownT = 0;
  // isTouchDrag: this gesture is touch/pen, so the axis lock applies per-gesture on hybrids.
  let isTouchDrag = false;
  let axisLock = AXIS_UNDECIDED;

  // Resolve the touch axis lock from total travel since pointerdown. No-op for mouse.
  function resolveAxisLock(e) {
    if (!isTouchDrag || axisLock !== AXIS_UNDECIDED) return;
    const tdx = Math.abs(e.clientX - pointerDownX);
    const tdy = Math.abs(e.clientY - pointerDownY);
    if (Math.max(tdx, tdy) < AXIS_LOCK_THRESHOLD) return;
    axisLock = tdx > tdy ? AXIS_HORIZONTAL : AXIS_VERTICAL;
  }

  function ownsDrag(e) {
    return drag.isDragging && canvasEl != null && canvasEl.hasPointerCapture(e.pointerId);
  }

  // Zero the shared drag object. NOT called on pointerup — release keeps velX/velY (inertia).
  function resetDrag() {
    drag.isDragging = false;
    drag.velX = 0;
    drag.velY = 0;
  }

  function cancelDrag() {
    if (!drag.isDragging) return;
    resetDrag();
  }

  // Raycast the cards under the pointer; returns intersections (nearest first).
  function pickCards(e) {
    const renderer = getRenderer();
    const camera = getCamera();
    if (!renderer || !camera) return [];
    const rect = renderer.domElement.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const meshes = getCards()
      .map((c) => c.mesh)
      .filter((m) => m.visible && m.material.opacity >= PICK_MIN_OPACITY);
    return raycaster.intersectObjects(meshes, false);
  }

  function onPointerDown(e) {
    if (e.button !== 0 || !e.isPrimary) return;
    if (getModalIdx() >= 0) return;
    canvasEl.setPointerCapture(e.pointerId);
    drag.isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    drag.velX = 0; drag.velY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = Date.now();
    // Pen grouped with touch: direct contact, drives the page scroll gesture too.
    isTouchDrag = e.pointerType === 'touch' || e.pointerType === 'pen';
    axisLock = AXIS_UNDECIDED;
  }

  function onPointerMove(e) {
    if (!ownsDrag(e)) return;
    resolveAxisLock(e);
    // Touch, axis not yet resolved → consume nothing (lastMX/MY NOT advanced, so no delta lost).
    if (isTouchDrag && axisLock === AXIS_UNDECIDED) return;
    // Touch, vertical → the page owns this gesture; leave the sphere inert.
    if (isTouchDrag && axisLock === AXIS_VERTICAL) return;
    drag.velX = Math.max(-maxVel, Math.min(maxVel, (e.clientX - lastMX) * DRAG_SENSITIVITY));
    // Pitch is enabled only for a mouse on the sphere. Touch never pitches (vertical = scroll);
    // the yaw-only barrel never pitches for anyone (a cylinder can't centre vertically — matches
    // the keyboard/modal centring path, which holds pitch when bp.YAW_ONLY). +Y delta (drag down)
    // tips the front down so the globe follows.
    if (!isTouchDrag && !getYawOnly()) {
      drag.velY = Math.max(-maxVel, Math.min(maxVel, (e.clientY - lastMY) * DRAG_SENSITIVITY));
    }
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
    if (!ownsDrag(e)) return;
    drag.isDragging = false;
    // Clear the lock for the next gesture. The tap test below is independent of axisLock
    // (CLICK_MAX_MOVE 10px > AXIS_LOCK_THRESHOLD 8px, so a jittery tap may have latched one).
    axisLock = AXIS_UNDECIDED;
    const dx = Math.abs(e.clientX - pointerDownX);
    const dy = Math.abs(e.clientY - pointerDownY);
    const dt = Date.now() - pointerDownT;
    if (dx < CLICK_MAX_MOVE && dy < CLICK_MAX_MOVE && dt < CLICK_MAX_TIME
      && getSphereFormT() >= interactiveThreshold && getModalIdx() < 0) {
      handleCardClick(e);
    }
  }

  function onHover(e) {
    const renderer = getRenderer();
    const camera = getCamera();
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    const cards = getCards();
    // Defer cursor writes to cursor.js while it's active (it sets `cursor: none`).
    const cursorActive = typeof isCursorActive === 'function' && isCursorActive();
    // Out of sphere phase: clear all hoverTargets so the ease-out kicks in.
    if (getSphereFormT() < interactiveThreshold || getModalIdx() >= 0) {
      if (!cursorActive) canvas.style.cursor = '';
      for (let ci = 0; ci < cards.length; ci += 1) cards[ci].hoverTarget = 0;
      return;
    }
    const hits = pickCards(e);
    if (!cursorActive) canvas.style.cursor = hits.length > 0 ? 'pointer' : '';

    // Front-most card gets hoverTarget 1; capture its UV so the shader anchors the fisheye.
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
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('lostpointercapture', cancelDrag);
    canvas.addEventListener('contextmenu', cancelDrag);
    canvas.addEventListener('mousemove', onHover);
  }

  function teardown() {
    if (canvasEl) {
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('pointermove', onPointerMove);
      canvasEl.removeEventListener('pointerup', onPointerUp);
      canvasEl.removeEventListener('pointercancel', onPointerUp);
      canvasEl.removeEventListener('lostpointercapture', cancelDrag);
      canvasEl.removeEventListener('contextmenu', cancelDrag);
      canvasEl.removeEventListener('mousemove', onHover);
      canvasEl.style.cursor = '';
      canvasEl = null;
    }
    resetDrag();
  }

  // True when the in-flight touch gesture is a page scroll (or hasn't declared its axis):
  // the globe is inert, so hint-text dismissal must exclude it. See README (Behavior notes).
  // Gated on drag.isDragging since isTouchDrag persists after pointerup.
  const isPageScrollGesture = () => drag.isDragging
    && isTouchDrag
    && axisLock !== AXIS_HORIZONTAL;

  return { setup, teardown, isPageScrollGesture };
}
