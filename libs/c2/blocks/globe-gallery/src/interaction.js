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
   sphereRotQuat — two stages mutate the same value each frame. Everything
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
// ── Touch axis lock ──────────────────────────────────────────────────────────
// On a touch device a vertical drag is the page-scroll gesture, so the globe can't
// also claim it. Touch therefore gets YAW ONLY: horizontal drag spins the sphere,
// vertical drag scrolls the page. Pitch (velY) stays mouse-only — there's no
// competing gesture with a pointer.
//
// The canvas already carries `touch-action: pan-y` (see authoring.js), which makes
// the BROWSER hand vertical pans to the page and fire `pointercancel` at us. That
// alone isn't enough: the moves before the browser commits to the pan still arrive
// as pointermove, so raw deltas would leak a pitch kick into velY at the start of
// every scroll. This lock resolves the axis ourselves from the first decisive
// movement, so nothing leaks while the browser is still deciding.
//
// Resolution is deferred until the pointer travels AXIS_LOCK_THRESHOLD from the
// down point (a fingertip's first pixels are too noisy to judge direction), then
// latched for the rest of the gesture so a curved swipe can't flip axes mid-drag.
const AXIS_LOCK_THRESHOLD = 8; // px of travel before the axis is decided
// Lock states for the current touch gesture.
const AXIS_UNDECIDED = 0;
const AXIS_HORIZONTAL = 1; // spinning the globe — we consume the deltas
const AXIS_VERTICAL = 2; // page scroll — we ignore the gesture entirely

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
  // Axis lock for the in-flight gesture (see AXIS_LOCK_THRESHOLD). `isTouchDrag`
  // records whether THIS gesture came from a touch/pen contact rather than a mouse,
  // so the lock applies per-gesture on hybrid devices (touchscreen laptops) instead
  // of being decided once by a capability sniff.
  let isTouchDrag = false;
  let axisLock = AXIS_UNDECIDED;

  // Resolve the touch axis lock from total travel since pointerdown. No-op for mouse
  // gestures (pitch is mouse-only) and once the axis is already latched. Ties and
  // sub-threshold movement stay UNDECIDED so neither axis acts on ambiguous input.
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

  // Zero the shared drag object (spin state + inertia velocity). Shared by cancelDrag
  // (guarded) and teardown. NOT used on pointerup, which deliberately keeps velX/velY so
  // the release carries inertia into updateSphereRotation.
  function resetDrag() {
    drag.isDragging = false;
    drag.velX = 0;
    drag.velY = 0;
  }

  function cancelDrag() {
    if (!drag.isDragging) return;
    resetDrag();
  }

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
    if (e.button !== 0 || !e.isPrimary) return;
    if (getModalIdx() >= 0) return;
    canvasEl.setPointerCapture(e.pointerId);
    drag.isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    drag.velX = 0; drag.velY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = Date.now();
    // Per-gesture, so a hybrid device (touchscreen laptop) gets the lock for finger
    // input and full pitch for its mouse. 'pen' is grouped with touch: it's a direct
    // contact on the same surface, so it drives the page's scroll gesture too.
    isTouchDrag = e.pointerType === 'touch' || e.pointerType === 'pen';
    axisLock = AXIS_UNDECIDED;
  }

  function onPointerMove(e) {
    if (!ownsDrag(e)) return;
    resolveAxisLock(e);
    // Touch, axis not yet resolved → consume nothing. Holding both axes until the
    // gesture declares itself is what keeps a scroll from nudging the globe; the
    // deltas aren't lost, since lastMX/lastMY are NOT advanced here, so the first
    // frame after the lock resolves carries the full travel since pointerdown.
    if (isTouchDrag && axisLock === AXIS_UNDECIDED) return;
    // Touch, vertical → the page owns this gesture. Leave velX/velY at rest so the
    // sphere is inert for the whole scroll (the browser's `touch-action: pan-y` is
    // doing the actual scrolling).
    if (isTouchDrag && axisLock === AXIS_VERTICAL) return;
    drag.velX = Math.max(-maxVel, Math.min(maxVel, (e.clientX - lastMX) * DRAG_SENSITIVITY));
    // Pitch is MOUSE-ONLY. On touch, vertical drag is the page-scroll gesture, so a
    // horizontal-locked touch drag spins yaw only and leaves velY untouched — see the
    // AXIS_LOCK_THRESHOLD block. +Y cursor delta (drag down) → a positive world-X
    // rotation, which tips the front surface downward, so the globe follows the cursor
    // (drag down reveals the top).
    if (!isTouchDrag) {
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
    // Clear the lock so a cancelled/finished gesture can't leak its axis into the next
    // one. The tap test below is deliberately independent of axisLock: CLICK_MAX_MOVE
    // (10px) exceeds AXIS_LOCK_THRESHOLD (8px), so a jittery fingertip tap may well have
    // latched an axis, and gating the tap on the lock would swallow those taps.
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

  // True when the in-flight gesture is a touch drag the PAGE owns (vertical scroll),
  // or a touch drag that hasn't declared its axis yet. The globe is inert then, so
  // per-frame stages that treat `drag.isDragging` as "the user is working the globe"
  // must exclude it — notably the hint-text dismissal, whose hold-time term would
  // otherwise accrue during an ordinary scroll and retire the "Click & Drag" hint
  // without the user ever having spun anything.
  // Gated on drag.isDragging as well as the lock: isTouchDrag persists after pointerup
  // (it describes the last gesture's input type), so without it this would keep reporting
  // true between touch gestures and suppress the hint stage while nothing is in flight.
  const isPageScrollGesture = () => drag.isDragging
    && isTouchDrag
    && axisLock !== AXIS_HORIZONTAL;

  return { setup, teardown, isPageScrollGesture };
}
