/* ─────────────────────────────────────────────────────────────────────────
   Pointer interaction for the globe — a DI module (createInteraction(deps)).

   Owns the canvas pointer/mouse plumbing: drag-to-spin input, click-vs-drag
   discrimination, and raycast picking for hover (cursor + per-card hover state)
   and click → modal open. Owns the listeners (setup(canvas) wires them,
   teardown() removes them) and its own raycaster + NDC scratch.

   The drag VELOCITY it produces is shared with the core sphere stage by
   reference through `drag` ({ isDragging, velX, velY }): this module writes it
   from raw pointer deltas; the core updateSphereRotation reads it, applies
   inertia/auto-rotate friction, and writes it back. Sharing a mutable object
   (rather than passing scalars through callbacks) mirrors how the modal shares
   sphereRotEuler/Quat — two stages mutate the same value each frame. Everything
   else (renderer, camera, cards, sphere-formation progress, modal open) is read
   through getters / callbacks so the module never holds a stale snapshot across
   a breakpoint re-init.
   ───────────────────────────────────────────────────────────────────────── */
import * as THREE from '../three.module.min.js';

// Pointer tuning (module scope — pure, no per-instance state).
const DRAG_SENSITIVITY = 0.005; // pointer px → rad/frame drag velocity
// Click-vs-drag thresholds — tuned for both mouse and touch. 10px / 500ms is
// generous enough for fingertip taps (which can jitter 8–15px) while still
// distinguishing from intentional drag gestures.
const CLICK_MAX_MOVE = 10; // px
const CLICK_MAX_TIME = 500; // ms
const PICK_MIN_OPACITY = 0.1;

export default function createInteraction({
  getRenderer, getCamera, getCards, getModalIdx, openModal,
  getSphereFormT, interactiveThreshold, maxVel, drag, isCursorActive,
}) {
  // Raycaster + NDC scratch for canvas picking (hover + click → modal).
  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();

  let canvasEl = null;
  let lastMX = 0;
  let lastMY = 0;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownT = 0;

  // Raycast the cards under the pointer; returns THREE intersections (nearest
  // first). Empty when renderer/camera aren't ready or nothing is hit.
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
    if (getModalIdx() >= 0) return; // modal open — don't drag the globe
    drag.isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    drag.velX = 0; drag.velY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = Date.now();
  }

  function onPointerMove(e) {
    if (!drag.isDragging) return;
    drag.velX = Math.max(-maxVel, Math.min(maxVel, (e.clientX - lastMX) * DRAG_SENSITIVITY));
    // +Y cursor delta (drag down) → +sphereRotX → +X-axis rotation tips the front
    // surface downward, so the globe follows the cursor (drag down reveals the top).
    drag.velY = Math.max(-maxVel, Math.min(maxVel, (e.clientY - lastMY) * DRAG_SENSITIVITY));
    lastMX = e.clientX; lastMY = e.clientY;
  }

  // Click → modal: open the modal for the front-most card under the pointer.
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
    const wasDragging = drag.isDragging;
    drag.isDragging = false;
    if (!wasDragging) return;
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
    // The custom cursor (cursor.js) owns the canvas cursor while it's active (sets
    // `cursor: none`), so defer all our cursor writes to it then — otherwise the two fight.
    const cursorActive = typeof isCursorActive === 'function' && isCursorActive();
    // Only show pointer + run hover state during sphere + zoom phases.
    // When out of sphere phase, clear ALL hoverTargets so the ease-out kicks in.
    if (getSphereFormT() < interactiveThreshold || getModalIdx() >= 0) {
      if (!cursorActive) canvas.style.cursor = '';
      for (let ci = 0; ci < cards.length; ci += 1) cards[ci].hoverTarget = 0;
      return;
    }
    const hits = pickCards(e);
    if (!cursorActive) canvas.style.cursor = hits.length > 0 ? 'pointer' : '';

    // First-hit mesh is the front-most card. Set its hoverTarget to 1, clear all others.
    // Also capture the UV at the cursor — the shader anchors its fisheye warp at this point.
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
    canvas.addEventListener('mousemove', onHover);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    // pointercancel fires when the browser hijacks the gesture (common in Chrome
    // DevTools touch emulation with touch-action restrictions). Treat it as
    // pointerup so taps still register — the thresholds in onPointerUp filter drags.
    window.addEventListener('pointercancel', onPointerUp);
  }

  function teardown() {
    if (canvasEl) {
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      canvasEl.removeEventListener('mousemove', onHover);
      canvasEl.style.cursor = '';
      canvasEl = null;
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  }

  return { setup, teardown };
}
