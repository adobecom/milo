import * as THREE from '../../deps/three.js';
import {
  CAM_FOV, CARD_ASPECT, COLUMN_EPS, TAN_HALF_FOV, WORLD_UP, YAW_ONLY_GEOMETRY, capDpr, clamp01,
  coverFit, cylinderMasonryLayout, easeInOutCubic, easeOutCubic, fibSpherePos, lerpN,
  prefersReducedMotion, resolveBP, scrollYAtTravelT, seededRandom, sphereCardScale, travelSpanPx,
  usesCylinderGeometry,
} from './core.js';
import {
  createCardMaterial, createClickDragTexture, createPlaceholderTexture, createTextMaterial,
  loadCardTextures, loadHintFont, loadModalTexture as loadModalTextureRaw,
} from './gl.js';
import createGlobeModal from './modal.js';
import createInteraction, { createCursor, createGalleryA11y, createGlobeControls } from './interaction.js';
import { loadGlobeStyles, onRemoved, scatterCards } from './authoring.js';
import { createPullQuote } from './quote-particles.js';

const Z_UNIT = new THREE.Vector3(0, 0, 1);

const LENIS_TRUST_PX = 2;
const SCROLL_LAG_PX = 8;
const SCROLL_JUMP_PX = 100;

export function createScrollReader() {
  let smoothY = window.scrollY;

  function deQuantize(y) {
    const err = y - smoothY;
    const mag = Math.abs(err);
    smoothY = mag > SCROLL_JUMP_PX ? y : smoothY + err * (mag / (mag + SCROLL_LAG_PX));
    return smoothY;
  }

  return function readScrollY() {
    const domY = window.scrollY;
    if (!window.lenis?.isSmooth) return deQuantize(domY);
    const lenisY = window.lenis.animatedScroll;
    const trusted = Number.isFinite(lenisY) && Math.abs(lenisY - domY) <= LENIS_TRUST_PX;
    if (!trusted) return deQuantize(domY);
    smoothY = lenisY;
    return lenisY;
  };
}

// Every *_RATE / FRICTION / SPEED below is authored per 60fps frame and rescaled at its use site
// by frame.dtScale: linear ones by multiply, exponential eases by ** dtScale. MAX_VEL is shared
// with utils/globe/interaction.js (it clamps; the block divides drag speed by it).
const DRAG_FRICTION = 0.94;
export const MAX_VEL = 0.08; // rad per 60fps frame; ceiling on a flick AND a held step
const DRAG_CATCHUP = 0.5; // share of an over-max backlog worked off per 60fps frame
const AUTO_ROT_SPEED = 0.0005; // ambient yaw RATE per 60fps frame (NOT an increment into velX)
// Browse-only pitch cap; excess eases back to the resting cap at PITCH_RELAX.
const KEY_PITCH_CAP = (85 * Math.PI) / 180;
const RESTING_PITCH = Math.PI / 3;
const PITCH_RELAX = 0.85;
// Sphere-centring tween lengths, in 60fps frames (nudge.frame advances by dtScale).
const KEY_BROWSE_FRAMES = 90;
const KEY_MODAL_FRAMES = 20;
const ROTATE_STEP_FRAMES = 34;
const ROTATE_DEADZONE = 0.15;

const SPHERE_DRAG_WARP_BASELINE = 0.05; // while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on the combined value
const SPHERE_DRAG_WARP_EASE = 0.20; // per-frame ease toward the target

export function createOrientationState() {
  return {
    // x = pitch, y = yaw, z = keyboard-uprighting roll.
    orient: { x: 0, y: 0, z: 0 },
    // pendingX/Y: exact unapplied travel (rad). velX/Y: smoothed velocity per 60fps frame.
    drag: { isDragging: false, velX: 0, velY: 0, pendingX: 0, pendingY: 0 },
    nudge: {
      active: false,
      kind: '', // 'browse' | 'modal' | 'rotate' — who armed it; see the browse-exit edge + rotateStep
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      startX: 0,
      startY: 0,
      startZ: 0,
      frame: 0,
      frames: 0,
    },
    pitchReleaseCap: RESTING_PITCH, // glides ±85°→±60° when leaving browse
    warp: 0,
    wasBrowsing: false,
    inside: false,
  };
}

const isRotated = ({ x, y, z }) => x !== 0 || y !== 0 || z !== 0;

function dropTravel(drag) {
  drag.velX = 0;
  drag.velY = 0;
  drag.pendingX = 0;
  drag.pendingY = 0;
}

// Does NOT touch drag velocity or warp.
function resetOrient(state) {
  state.orient.x = 0;
  state.orient.y = 0;
  state.orient.z = 0;
  state.pitchReleaseCap = RESTING_PITCH;
  state.nudge.active = false;
}

// One frame of sphere rotation. Mutates state in place; no THREE, no DOM. Returns whether the
// orientation is non-identity, so callers can skip the rotation math when upright.
export function stepOrientation(state, {
  dtScale, interactive, orientReset, frozen, browsing, spinEnabled, quoteOwnsCards, restK,
}) {
  const { orient, drag, nudge } = state;

  // Cancel browse's own tween so it stops fighting resumed auto-spin. A rotate press collapses
  // browse (focusout) in the same turn it arms its nudge — don't eat that.
  if (state.wasBrowsing && !browsing && nudge.kind === 'browse') nudge.active = false;
  state.wasBrowsing = browsing;

  if (quoteOwnsCards) {
    dropTravel(drag);
    nudge.active = false;
    state.warp = 0;
    return isRotated(orient);
  }

  if (nudge.active) {
    nudge.frame += dtScale;
    const e = easeInOutCubic(Math.min(1, nudge.frame / nudge.frames));
    orient.y = nudge.startY + (nudge.targetY - nudge.startY) * e;
    orient.x = nudge.startX + (nudge.targetX - nudge.startX) * e;
    orient.z = nudge.startZ + (nudge.targetZ - nudge.startZ) * e;
    if (e >= 1) nudge.active = false;
  }
  // frozen (modal open): holds its rotation. !interactive (still folding): no new drag and no
  // auto-spin, but inertia keeps coasting.
  // Consume the banked travel; anything but held-and-live drops it (no pooling on resume).
  const holding = drag.isDragging && !frozen && interactive;
  let stepX = 0;
  let stepY = 0;
  if (holding) {
    // Jerk limiter: under one frame's rotation passes through exactly; past it the step is
    // capped then eased and the rest stays banked.
    const maxStep = MAX_VEL * dtScale;
    const catchup = 1 - (1 - DRAG_CATCHUP) ** dtScale;
    const limit = (v) => (Math.abs(v) <= maxStep
      ? v
      : Math.max(-maxStep, Math.min(maxStep, v * catchup)));
    stepX = limit(drag.pendingX);
    stepY = limit(drag.pendingY);
    drag.pendingX -= stepX;
    drag.pendingY -= stepY;
  } else {
    drag.pendingX = 0;
    drag.pendingY = 0;
  }
  if (!frozen) {
    // Inside the globe the far wall moves opposite, so negate to track the visible surface.
    const dragDir = state.inside ? -1 : 1;
    if (drag.isDragging) {
      // Held: position-driven off the (rate-limited) travel — no smoothing lag on normal frames.
      orient.y += stepX * dragDir;
      orient.x += stepY * dragDir;
      if (!interactive) { drag.velX = 0; drag.velY = 0; } // inert mid-fold: must not fling
    } else {
      // Released: velocity-driven coast.
      const friction = DRAG_FRICTION ** dtScale;
      drag.velX *= friction;
      drag.velY *= friction;
      // Ambient spin stays OUT of velX (a bias in it decays asymmetrically by direction).
      const spin = interactive && spinEnabled && !browsing ? AUTO_ROT_SPEED : 0;
      orient.y += (drag.velX + spin) * dtScale * dragDir;
      orient.x += drag.velY * dtScale * dragDir;
    }
    if (browsing) {
      orient.x = Math.max(-KEY_PITCH_CAP, Math.min(KEY_PITCH_CAP, orient.x));
      state.pitchReleaseCap = Math.max(RESTING_PITCH, Math.abs(orient.x)); // prime the glide
    } else {
      orient.x = Math.max(-state.pitchReleaseCap, Math.min(state.pitchReleaseCap, orient.x));
      const relax = PITCH_RELAX ** dtScale;
      if (state.pitchReleaseCap > RESTING_PITCH) {
        state.pitchReleaseCap = RESTING_PITCH + (state.pitchReleaseCap - RESTING_PITCH) * relax;
        if (state.pitchReleaseCap - RESTING_PITCH < 0.001) state.pitchReleaseCap = RESTING_PITCH;
      }
      // Upright roll relaxes to 0 over the same glide (so pitch + roll settle together).
      if (orient.z !== 0) {
        orient.z *= relax;
        if (Math.abs(orient.z) < 0.001) orient.z = 0;
      }
    }
  }

  let warpTarget = 0;
  if (!frozen && interactive) {
    const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const baseline = drag.isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
    warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + dragSpeed * SPHERE_DRAG_WARP_VEL);
  }
  state.warp += (warpTarget * restK - state.warp) * (1 - (1 - SPHERE_DRAG_WARP_EASE) ** dtScale);
  state.warp = Math.min(state.warp, SPHERE_DRAG_WARP_MAX * restK);
  if (Math.abs(state.warp) < 0.001) state.warp = 0;

  // Full reset only at the very top — a dip mid-scroll keeps orientation and inertia.
  if (orientReset) {
    resetOrient(state);
    drag.velX = 0;
    drag.velY = 0;
  }

  return isRotated(orient);
}

// Euler order 'XYZ' is load-bearing. Applied MANUALLY per card; the sphere group's rotation stays
// identity and rotQuat is shared into utils/globe/modal.js BY REFERENCE.
export function createOrientation({ getCards, getBp, isReducedMotion }) {
  const state = createOrientationState();
  const { orient, drag, nudge } = state;
  const rotQuat = new THREE.Quaternion();
  const rotEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const screenRollQuat = new THREE.Quaternion();
  const targetQuat = new THREE.Quaternion(); // scratch: keyboard-centring target orientation
  const targetEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const cardUp = new THREE.Vector3(); // scratch: focused card's world up (for the upright roll)

  function refreshQuat() {
    rotEuler.set(orient.x, orient.y, 0);
    rotQuat.setFromEuler(rotEuler);
    if (orient.z !== 0) {
      screenRollQuat.setFromAxisAngle(Z_UNIT, orient.z);
      rotQuat.premultiply(screenRollQuat); // world-Z roll applied last (screen space)
    }
  }

  // Shortest signed yaw bringing a slot front-centre. Scale-invariant, so on the barrel it
  // depends only on the column — rotateStep relies on that.
  function yawDeltaToCenter(spherePos, fromYaw = orient.y, inside = state.inside) {
    const cy = Math.cos(fromYaw);
    const sy = Math.sin(fromYaw);
    const px = spherePos.x * cy + spherePos.z * sy;
    const pz = -spherePos.x * sy + spherePos.z * cy;
    let deltaY = -Math.atan2(px, pz); // → +Z (near wall, camera outside)
    if (inside) deltaY += Math.PI; // → −Z (far wall, camera inside)
    return Math.atan2(Math.sin(deltaY), Math.cos(deltaY));
  }

  function cardCenterYawPitch(idx, pitchCap, yawOnly, inside = state.inside) {
    const { spherePos } = getCards()[idx];
    const targetYaw = orient.y + yawDeltaToCenter(spherePos, orient.y, inside);
    if (yawOnly) return { targetYaw, targetPitch: orient.x };
    const h = Math.hypot(spherePos.x, spherePos.z);
    const pitchMag = Math.atan2(spherePos.y, h); // drives the card's height → centre
    const targetPitch = Math.max(-pitchCap, Math.min(pitchCap, inside ? -pitchMag : pitchMag));
    return { targetYaw, targetPitch };
  }

  function armNudge(kind, frames, targetX, targetY, targetZ) {
    nudge.targetX = targetX;
    nudge.targetY = targetY;
    nudge.targetZ = targetZ;
    nudge.startX = orient.x;
    nudge.startY = orient.y;
    nudge.startZ = orient.z;
    nudge.frames = frames;
    nudge.frame = isReducedMotion() ? frames : 0;
    nudge.kind = kind;
    nudge.active = true;
  }

  function centerModalCard(idx) {
    if (!getCards()[idx]) return;
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, RESTING_PITCH, getBp().YAW_ONLY);
    armNudge('modal', KEY_MODAL_FRAMES, targetPitch, targetYaw, orient.z);
  }

  // Ease to the next column BOUNDARY (never `y += pitch`); dir −1 = surface travels screen-left.
  function rotateStep(dir) {
    // Measure from where the last press is HEADED, so taps queue instead of re-targeting.
    const from = nudge.active && nudge.kind === 'rotate' ? nudge.targetY : orient.y;
    const deltas = [];
    getCards().forEach((card) => {
      // Mid-morph spherePos has no column structure yet — read the target.
      const slot = card.morph ? card.morph.posTo : card.spherePos;
      const d = yawDeltaToCenter(slot, from);
      if (!deltas.some((seen) => Math.abs(seen - d) < COLUMN_EPS)) deltas.push(d);
    });
    if (!deltas.length) return;
    const deadzone = ((2 * Math.PI) / deltas.length) * ROTATE_DEADZONE;
    const ahead = deltas.filter((d) => d * (state.inside ? -dir : dir) > deadzone);
    if (!ahead.length) return; // one column: nothing to step to
    const delta = ahead.reduce((a, b) => (Math.abs(a) < Math.abs(b) ? a : b));
    armNudge('rotate', ROTATE_STEP_FRAMES, orient.x, from + delta, orient.z);
    drag.velX = 0;
    drag.velY = 0;
  }

  // a11y's centerCard: the shared yaw/pitch solve plus the screen-Z roll that cancels the
  // card's residual tilt. snapPending = focus is about to scroll us back to the formed position,
  // where the camera sits OUTSIDE the sphere: solve for THERE, not for wherever the user scrolled
  // to. Trusting the live flag from inside the zoom aims at the far wall (yaw + π, pitch negated)
  // and the card lands out of view.
  function centerCardOnScreen(idx, snapPending = false) {
    const card = getCards()[idx];
    if (!card) return;
    const inside = snapPending ? false : state.inside;
    const { targetYaw, targetPitch } = cardCenterYawPitch(
      idx,
      KEY_PITCH_CAP,
      getBp().YAW_ONLY,
      inside,
    );
    // The card's world up at that (pitch, yaw), pre screen-roll.
    targetEuler.set(targetPitch, targetYaw, 0);
    targetQuat.setFromEuler(targetEuler).multiply(card.sphereQuat);
    cardUp.set(0, 1, 0).applyQuaternion(targetQuat);
    const rollTarget = Math.atan2(cardUp.x, cardUp.y); // screen-Z roll that returns up → +Y
    const dRoll = Math.atan2(Math.sin(rollTarget - orient.z), Math.cos(rollTarget - orient.z));
    armNudge('browse', KEY_BROWSE_FRAMES, targetPitch, targetYaw, orient.z + dRoll);
    drag.velX = 0;
    drag.velY = 0;
  }

  return {
    drag,
    rotQuat,
    isRotated: () => isRotated(orient),
    refreshQuat,
    isInside: () => state.inside,
    setInside(inside) { state.inside = inside; },
    warp: () => state.warp,
    centerModalCard,
    rotateStep,
    centerCardOnScreen,
    dropTravel: () => dropTravel(drag),
    update(input) {
      const active = stepOrientation(state, input);
      refreshQuat();
      return active;
    },
    reset() {
      resetOrient(state);
      state.warp = 0;
      state.wasBrowsing = false;
      state.inside = false;
      drag.isDragging = false;
      dropTravel(drag);
    },
  };
}

export const CA_ENABLED = true;
const SCROLL_VEL_MAX = 18; // px/frame scroll speed that saturates the motion trail
const HOVER_CA = 0.0125;
const SPHERE_DRAG_CA_MUL = 0.2; // uCA per unit of the drag warp

// Hover (sphere phase only).
const HOVER_WARP = 0.4;
export const HOVER_SCALE = 0.25; // added, not replacing: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target

// Per-card un-dissolve once its photo lands.
const REVEAL_RATE = 0.06; // per-frame
// One-time sm-barrel reflow after all textures load.
const MASONRY_MORPH_RATE = 0.05; // per-frame

const FACING_EDGE_ON_BAND = 0.25; // |normal.z| half-width of the facing fade-out band
const DRAG_FLIP_MAX_CAM_FRAC = 0.95; // ceiling on dragFlipZ as a fraction of CAM_Z_SPHERE

const CARD_ORDER_STEPS = 1000;
export const CARD_ORDER_BASE = -(CARD_ORDER_STEPS + 8);
const HOVER_ORDER_STEPS = 7;
const TEXT_ORDER = CARD_ORDER_BASE - CARD_ORDER_STEPS - 8;

export function solveMasonry(bp, aspectOf) {
  return cylinderMasonryLayout({
    aspects: Array.from({ length: bp.N_TOTAL }, (unused, i) => aspectOf(i)),
    radius: bp.SPHERE_R,
    frustumH: bp.CYL_FRUSTUM_H,
    colsFit: bp.CYL_COLS_FIT,
    colGapRatio: bp.CYL_COL_GAP_RATIO,
    rowGapRatio: bp.CYL_ROW_GAP_RATIO,
    aspectCap: bp.CYL_ASPECT_CAP,
    bulge: bp.CYL_BULGE,
  });
}

export function createCardField({
  getBp, getCards, getSphereGroup, getCamera, frame, orientation, pullQuote, isReducedMotion,
  tAtCamZ,
}) {
  const { drag, rotQuat } = orientation;
  const masonryMorph = { active: false, t: 0 };
  let fadeRefH = 0; // wall-wide card height the near-camera fade bands off; recomputeDragFlip
  let dragFlipZ = 0; // camera z at which drag inverts; set once cards are built
  let pqAppearT = 1; // scrollT the last card leaves the screen at; see publishCue

  const cardNormal = new THREE.Vector3();
  const facingTarget = new THREE.Vector3();
  const facingAlign = new THREE.Quaternion();
  const facingPartial = new THREE.Quaternion();
  const IDENTITY_QUAT = new THREE.Quaternion();
  const tmpVec3 = new THREE.Vector3();
  const uvScratch = {};

  // Depth (world units, from the camera) at which a card has faded out completely. placeSphereCard
  // owns the rule; dragFlipZ and the pull-quote cue are both anchored to it. NOTE: those two apply
  // the sphere group's scale differently — see the call sites.
  const cardVanishDepth = () => getBp().NEAR_FADE_END * fadeRefH;

  // The cue is where the last card leaves the SCREEN, not where the camera clears the shell:
  // placeSphereCard hides a card bp.NEAR_FADE_END card-heights out, and the deepest card centre
  // sits at -SPHERE_R under any rotation. fadeRefH 0 falls back to -SPHERE_R, which errs late.
  function publishCue() {
    const bp = getBp();
    const clearZ = -bp.SPHERE_R + cardVanishDepth();
    pqAppearT = tAtCamZ(clearZ, bp.CAM_Z_SPHERE, bp.CAM_Z_END);
    pullQuote.setCue(pqAppearT);
  }

  // Camera z below which drag inverts, anchored to where cards VANISH. Sole writer of fadeRefH.
  // Rerun once textures land (sphereWorldH starts as a placeholder).
  function recomputeDragFlip() {
    const cards = getCards();
    const group = getSphereGroup();
    if (!group || cards.length === 0) return;
    const groupScale = group.scale.x || 1;
    const maxRadial = cards.reduce(
      (m, c) => Math.max(m, Math.hypot(c.spherePos.x, c.spherePos.z)),
      0,
    ) * groupScale;
    fadeRefH = cards.reduce((s, c) => s + c.sphereWorldH, 0) / cards.length;
    dragFlipZ = Math.min(
      maxRadial + cardVanishDepth() * groupScale,
      getBp().CAM_Z_SPHERE * DRAG_FLIP_MAX_CAM_FRAC,
    );
    publishCue();
  }

  // Read live each frame, so writing these morphs the card into its native shape.
  function updateCardSphereSizing(card, srcAspect) {
    const { sX, sY } = sphereCardScale(srcAspect);
    card.srcAspect = srcAspect;
    card.sphereScaleSX = sX;
    card.sphereScaleSY = sY;
    card.sphereWorldH = getBp().CARD_H_SPHERE * sY;
  }

  // sm barrel: re-solve the packing once every aspect is known; each card morphs to its slot.
  function resolveMasonryLayout(aspectOf) {
    const bp = getBp();
    const cards = getCards();
    const masonry = solveMasonry(bp, aspectOf);
    for (let i = 0; i < bp.N_TOTAL; i += 1) {
      const card = cards[i];
      if (!card) continue; // eslint-disable-line no-continue
      const mas = masonry[i];
      const sp = mas.pos.clone();
      const faceTarget = sp.clone().sub(mas.normal);
      const m = new THREE.Matrix4().lookAt(sp, faceTarget, WORLD_UP);
      const sq = new THREE.Quaternion().setFromRotationMatrix(m); // no roll on the masonry path
      card.morph = {
        posFrom: card.spherePos.clone(),
        posTo: sp,
        quatFrom: card.sphereQuat.clone(),
        quatTo: sq,
        ssxFrom: card.sphereScaleSX,
        ssxTo: mas.w / bp.CARD_W_SPHERE,
        ssyFrom: card.sphereScaleSY,
        ssyTo: mas.h / bp.CARD_H_SPHERE,
        swhFrom: card.sphereWorldH,
        swhTo: mas.h,
      };
    }
    masonryMorph.active = true;
    masonryMorph.t = 0;
  }

  // Tilts limb cards toward the camera; MUTATES the quat in place. Target is sign(n.z) × view
  // dir so back cards keep facing away.
  function applySphereFacing(quat, amount = 1) {
    let k = getBp().CARD_FACE_CAMERA * amount;
    if (!k) return;
    cardNormal.set(0, 0, 1).applyQuaternion(quat); // current outward normal (local +Z)
    // Fade out around edge-on, else the target's sign flip teleports the card.
    const edgeOnT = Math.min(1, Math.abs(cardNormal.z) / FACING_EDGE_ON_BAND);
    k *= edgeOnT * edgeOnT * (3 - 2 * edgeOnT); // smoothstep — C1, so no velocity kink
    if (k < 1e-6) return;
    facingTarget.set(0, 0, cardNormal.z < 0 ? -1 : 1);
    facingAlign.setFromUnitVectors(cardNormal, facingTarget);
    facingPartial.copy(IDENTITY_QUAT).slerp(facingAlign, k);
    quat.premultiply(facingPartial);
  }

  const applyCardFacing = (mesh, amount = 1) => applySphereFacing(mesh.quaternion, amount);

  // Sphere slot with the live drag rotation baked in, so a reparent can't flash it unrotated.
  function snapCardToSphereSlot(card) {
    if (!card || !card.mesh) return;
    if (orientation.isRotated()) {
      orientation.refreshQuat();
      card.mesh.position.copy(card.spherePos).applyQuaternion(rotQuat);
      card.mesh.quaternion.copy(rotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(card.mesh); // match placeSphereCard's tilt (else a one-frame flash)
    card.mesh.scale.set(card.sphereScaleSX, card.sphereScaleSY, 1);
    card.hoverTarget = 0;
    card.hoverT = 0;
  }

  // dx/dy: world-space delta this frame. ampOverride defaults to sqrt(scroll/drag speed ratio).
  function applyMotionCA(mesh, dx, dy, ampOverride, cap) {
    if (!CA_ENABLED) return;
    const bp = getBp();
    const s = cap !== undefined ? cap : bp.CA_MOTION_CAP;
    const sX = Math.max(mesh.scale.x, 0.01);
    const sY = Math.max(mesh.scale.y, 0.01);
    const dt = frame.dtScale;
    const uvDX = dx / (bp.CARD_W_SPHERE * sX * dt);
    const uvDY = dy / (bp.CARD_H_SPHERE * sY * dt);
    const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const ampRaw = Math.min(1.0, Math.max(frame.scrollVel / SCROLL_VEL_MAX, dragSpeed / MAX_VEL));
    const amp = ampOverride !== undefined ? ampOverride : Math.sqrt(ampRaw);
    const rep = mesh.material.uniforms.uRepeat.value;
    const mx = Math.max(-s, Math.min(s, uvDX * amp)) * rep.x;
    const my = Math.max(-s, Math.min(s, uvDY * amp)) * rep.y;
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // Cover-crop + corner aspect for THIS frame's shape.
  function applyCardFit(mesh, card, planeAspect) {
    const aspect = planeAspect !== undefined
      ? planeAspect
      : CARD_ASPECT * (mesh.scale.x / (mesh.scale.y || 1));
    const uv = coverFit(card.srcAspect, aspect, uvScratch);
    const u = mesh.material.uniforms;
    u.uRepeat.value.set(uv.rx, uv.ry);
    u.uOffset.value.set(uv.ox, uv.oy);
    u.uAspect.value = aspect;
  }

  function advanceCard(card, dtScale) {
    if (card.hasTexture && card.revealT < 1) {
      card.revealT = Math.min(1, card.revealT + REVEAL_RATE * dtScale);
    }
    if (masonryMorph.active && card.morph) {
      const e = easeInOutCubic(masonryMorph.t);
      const mo = card.morph;
      card.spherePos.lerpVectors(mo.posFrom, mo.posTo, e);
      card.sphereQuat.slerpQuaternions(mo.quatFrom, mo.quatTo, e);
      card.sphereScaleSX = lerpN(mo.ssxFrom, mo.ssxTo, e);
      card.sphereScaleSY = lerpN(mo.ssyFrom, mo.ssyTo, e);
      card.sphereWorldH = lerpN(mo.swhFrom, mo.swhTo, e);
    }
  }

  // Gates on the GLOBAL live predicate, not per-card progress. Must match interaction.js:
  // hoverTarget is only rewritten on pointermove, so a pointer parked over a card while the page
  // scrolls past the cue would otherwise hold its hover.
  function updateCardHover(card, { dtScale, scrollT }, live) {
    if (!live || isReducedMotion()) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * (1 - (1 - HOVER_RATE) ** dtScale);
    card.hoverT = Math.min(card.hoverT, pullQuote.handoffEase(scrollT));
  }

  // Applied per card, not in placeSphereCard: the hover gate is global but sphere placement can be
  // per-card, so a card still folding at 0.999 would raise hoverT and render nothing.
  function applyCardCA(card, mesh, baseCA = 0) {
    if (!CA_ENABLED) return;
    const { uniforms } = mesh.material;
    uniforms.uCA.value = baseCA + card.hoverT * HOVER_CA + orientation.warp() * SPHERE_DRAG_CA_MUL;
    uniforms.uWarp.value = card.hoverT * HOVER_WARP;
    if (card.hoverT > 0.01) uniforms.uHoverPos.value.copy(card.hoverUV);
    else uniforms.uHoverPos.value.set(0.5, 0.5);
  }

  function placeSphereCard(card, mesh, { sphereRotActive, sphGroupZ }) {
    const bp = getBp();
    const hs = 1 + card.hoverT * HOVER_SCALE;
    if (sphereRotActive) {
      mesh.position.copy(card.spherePos).applyQuaternion(rotQuat);
    } else {
      mesh.position.copy(card.spherePos);
    }
    const depth = getCamera().position.z - (sphGroupZ + mesh.position.z);
    // One band for the whole wall, so the order is purely by depth.
    const fadeEnd = cardVanishDepth();
    const fadeStart = bp.NEAR_FADE_START * fadeRefH;
    const proxFade = pullQuote.isOn() && mesh.position.z < 0
      ? 1
      : clamp01((depth - fadeEnd) / (fadeStart - fadeEnd));
    // Skip the DRAW, not the state updates, once fully faded.
    mesh.visible = proxFade > 0;
    mesh.scale.set(card.sphereScaleSX * hs, card.sphereScaleSY * hs, hs);
    applyCardFit(mesh, card);
    if (sphereRotActive) {
      mesh.quaternion.copy(rotQuat).multiply(card.sphereQuat);
    } else {
      mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(mesh);
    if (depth <= 0) { mesh.visible = false; return; }
    if (pullQuote.takeNear(card, proxFade)) mesh.visible = false;
    mesh.material.opacity = Math.min(proxFade, card.revealT);
    mesh.material.uniforms.uDissolve.value = 1 - card.revealT;
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = proxFade;
    if (CA_ENABLED) {
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + orientation.warp();
    }
    // World delta approximated as depth × angular velocity.
    const dragDt = frame.dtScale;
    applyMotionCA(
      mesh,
      card.spherePos.z * drag.velX * dragDt,
      -card.spherePos.z * drag.velY * dragDt,
    );
  }

  function applyDepthOrder(card, mesh, { sphereRotActive }) {
    let { z } = card.spherePos;
    if (sphereRotActive) {
      tmpVec3.copy(card.spherePos).applyQuaternion(rotQuat);
      z = tmpVec3.z;
    }
    const n = Math.max(-1, Math.min(1, z / getBp().SPHERE_R));
    let order = CARD_ORDER_BASE + Math.round(n * CARD_ORDER_STEPS);
    if (n >= 0 && card.hoverT > 0.01) {
      order = CARD_ORDER_BASE + CARD_ORDER_STEPS + 1 + Math.round(card.hoverT * HOVER_ORDER_STEPS);
    }
    mesh.renderOrder = order;
  }

  function updateAll(currentFrame, updateCard) {
    if (masonryMorph.active) {
      masonryMorph.t = Math.min(1, masonryMorph.t + MASONRY_MORPH_RATE * currentFrame.dtScale);
    }
    for (let i = 0; i < getBp().N_TOTAL; i += 1) updateCard(i, currentFrame);
    if (masonryMorph.active && masonryMorph.t >= 1) {
      masonryMorph.active = false;
      getCards().forEach((card) => { card.morph = null; });
      recomputeDragFlip(); // now that spherePos/sphereWorldH hold the final masonry values
    }
  }

  return {
    publishCue,
    recomputeDragFlip,
    updateCardSphereSizing,
    resolveMasonryLayout,
    applySphereFacing,
    applyCardFacing,
    snapCardToSphereSlot,
    applyMotionCA,
    applyCardFit,
    advanceCard,
    updateCardHover,
    applyCardCA,
    placeSphereCard,
    applyDepthOrder,
    updateAll,
    pqAppearT: () => pqAppearT,
    dragFlipZ: () => dragFlipZ,
    reset() {
      masonryMorph.active = false;
      masonryMorph.t = 0;
      // Otherwise a band crossing pairs the old band's card height with the new band's SPHERE_R
      // in publishCue, which runs before any card exists.
      fadeRefH = 0;
    },
  };
}

// "Click & Drag" hint text: a WebGL plane behind the sphere.
const TEXT_REBUILD_DEBOUNCE_MS = 150;
const TEXT_BEHIND_GAP = 15; // world units behind the sphere back surface
const TEXT_WARP_ENTER_MAX = 4.50;
const TEXT_OPACITY_PEAK = 0.15;
const TEXT_OPACITY_RESTING = 0.06;
const TEXT_WARP_OVERFLOW = 0.6; // extra mesh scale per warp unit
const TEXT_CA_WARP_MUL = 0.75;
const HINT_EXIT_RATE = 0.007;

export function createHintText({
  getBp, getCamera, getSphereGroup, getView, frame, text, isReducedMotion, getCueT,
}) {
  let mesh = null;
  let retired = false;
  let exitT = 0;
  let rebuildTimer = 0;

  function planeSize() {
    const { SPHERE_R, CAM_Z_SPHERE } = getBp();
    const { W, H } = getView();
    const camera = getCamera();
    const dist = CAM_Z_SPHERE - (-(SPHERE_R + TEXT_BEHIND_GAP));
    const visH = 2 * TAN_HALF_FOV * dist;
    const visW = visH * (camera ? camera.aspect : W / H);
    return { w: visW, h: visH };
  }

  function dispose() {
    if (!mesh) return;
    if (mesh.parent) mesh.parent.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material.uniforms.uMap.value) mesh.material.uniforms.uMap.value.dispose();
    mesh.material.dispose();
    mesh = null;
  }

  // See README ("Click & Drag" hint text).
  function build() {
    const replacing = !!mesh;
    dispose();
    const targetGroup = getSphereGroup();
    const create = () => {
      const group = getSphereGroup();
      if (group !== targetGroup || !group) return;
      if (!replacing && !isReducedMotion() && frame.hintEntryT > 0) return;
      const { W, H } = getView();
      const camera = getCamera();
      const aspect = camera ? camera.aspect : W / H;
      const texture = createClickDragTexture(aspect, text);
      if (!texture) return;
      const dpr = capDpr();
      const sz = planeSize();
      const mat = createTextMaterial({
        texture,
        aspect,
        resolution: { x: W * dpr, y: H * dpr },
      });
      const created = new THREE.Mesh(new THREE.PlaneGeometry(sz.w, sz.h), mat);
      created.position.set(0, 0, -(getBp().SPHERE_R + TEXT_BEHIND_GAP));
      created.renderOrder = TEXT_ORDER;
      created.visible = false; // the tick stage reveals it once the entry is underway
      mesh = created;
      group.add(created);
    };
    // Two-arg then, NOT .then().catch(): a throw inside create must not re-run create and
    // orphan the mesh it already added.
    const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
    Promise.all([fontsReady, loadHintFont(text)]).then(create, () => {});
  }

  // Deferred only while off-screen.
  function onResize() {
    if (!mesh) return;
    clearTimeout(rebuildTimer);
    rebuildTimer = 0;
    if (mesh.visible) {
      build();
    } else {
      rebuildTimer = setTimeout(() => {
        rebuildTimer = 0;
        if (mesh) build();
      }, TEXT_REBUILD_DEBOUNCE_MS);
    }
  }

  // sphereDist: the live camera↔sphere distance, which the plane's scale tracks.
  function update({ dtScale, scrollT, hintEntryT }, sphereDist) {
    if (retired && exitT < 1) exitT = Math.min(1, exitT + dtScale * HINT_EXIT_RATE);
    if (!mesh) return;
    const { uniforms } = mesh.material;

    if (isReducedMotion()) {
      mesh.visible = true;
      mesh.scale.setScalar(1);
      uniforms.uOpacity.value = TEXT_OPACITY_RESTING;
      uniforms.uWarp.value = 0;
      uniforms.uZoom.value = 0;
      uniforms.uCA.value = 0;
      uniforms.uExitP.value = 0;
      return;
    }
    if (hintEntryT <= 0) {
      mesh.visible = false;
      mesh.scale.setScalar(1); // plane is viewport-sized; the warp does the entrance
      return;
    }

    const { CAM_Z_SPHERE, SPHERE_R } = getBp();
    const txtT = easeOutCubic(hintEntryT);
    const txtWarpEntrance = lerpN(TEXT_WARP_ENTER_MAX, 0, hintEntryT * hintEntryT);
    // Fill the viewport at the current camera distance + warp-proportional overflow.
    const restDist = CAM_Z_SPHERE + SPHERE_R + TEXT_BEHIND_GAP;
    const currDist = sphereDist + SPHERE_R + TEXT_BEHIND_GAP;
    mesh.scale.setScalar(currDist / restDist + txtWarpEntrance * TEXT_WARP_OVERFLOW);
    const txtOp = lerpN(TEXT_OPACITY_PEAK, TEXT_OPACITY_RESTING, txtT)
      * (1 - clamp01(scrollT / getCueT()));

    mesh.visible = txtOp > 0.001 && exitT < 1;
    uniforms.uOpacity.value = txtOp;
    uniforms.uZoom.value = scrollT;
    uniforms.uWarp.value = txtWarpEntrance;
    uniforms.uExitP.value = exitT;

    if (CA_ENABLED) uniforms.uCA.value = txtWarpEntrance * TEXT_CA_WARP_MUL;
  }

  return {
    build,
    onResize,
    update,
    retire() { retired = true; },
    isRetired: () => retired,
    reset() {
      if (rebuildTimer) { clearTimeout(rebuildTimer); rebuildTimer = 0; }
      dispose();
      retired = false;
      exitT = 0;
    },
  };
}

// Card caps are on texture HEIGHT; modal caps are on the longest side.
const CARD_TEX_SM = 384;
const CARD_TEX_MD = 768;
const MODAL_TEX_SM = 1024;
const MODAL_TEX_MD = 2048;
const ANTIALIAS_SM = false;
const ANTIALIAS_MD = true;

const RM_GLOBE_SCALE_MD = 0.9; // sm stays at 1

const CA_MOTION_CAP_SM = 0.01; // directional UV shift max
const CA_MOTION_CAP_MD = 0.03;

const CANVAS_HIDE_MARGIN_T = 0.05;

const MAX_CONTEXT_REBUILDS = 4;
const CONTEXT_STABLE_MS = 10000;

// One globe instance. `spec` is what differs per block: breakpoints, seeds, timeline, content and
// `createHooks(rt)` for its choreography. Every hook but entryCamZ, viewOffsetY and
// browseScrollTop is optional. DOM lookups are scoped to `root` so >1 globe can coexist; `gid` is
// this instance's unique-id suffix (CA filter url(#…) ref).
export function createGlobeRuntime(spec, {
  cards: authoredCards, hintText, instructions, root, gid, labels,
}) {
  const { name, breakpoints, timeline } = spec;
  const { hoistToBody = false, bodyOpenClass = false, tracksCanvasTop = false } = spec.modal;
  const q = (sel) => root.querySelector(sel); // root-scoped query (multi-instance safe)

  const CARD_CONTENT = authoredCards || [];

  function authoredIdx(i) {
    return CARD_CONTENT[i]?.authoredIndex ?? i;
  }

  const AUTHORED_ORDER = [];
  CARD_CONTENT.forEach((_, i) => { AUTHORED_ORDER[authoredIdx(i)] = i; });

  function getCardMetadata(i) {
    return CARD_CONTENT[i];
  }

  function authoredNo(i) {
    return authoredIdx(i) + 1;
  }

  function stepCard(i, dir) {
    const n = AUTHORED_ORDER.length;
    return AUTHORED_ORDER[(authoredIdx(i) + dir + n) % n];
  }

  let reducedMotion = false;

  // Frozen within a band; rebuilt on a crossing. null until initRuntime runs.
  let bp = null;

  function resolveBpProfile(bandName, cfg, cylinder) {
    const nTotal = CARD_CONTENT.length;
    const shape = cylinder ? YAW_ONLY_GEOMETRY : cfg;
    const sphereCardH = cfg.CARD_H_SPHERE;
    return Object.freeze({
      name: bandName,
      YAW_ONLY: cylinder, // compared in doLayout to detect a pointer-precision change
      N_TOTAL: nTotal,
      CA_MOTION_CAP: bandName === 'sm' ? CA_MOTION_CAP_SM : CA_MOTION_CAP_MD,
      SPHERE_R: cfg.SPHERE_R,
      CARD_H_SPHERE: sphereCardH,
      CARD_W_SPHERE: sphereCardH * CARD_ASPECT,
      CAM_Z_SPHERE: cfg.CAM_Z_SPHERE,
      CAM_Z_END: cfg.CAM_Z_END,
      // Near-camera fade band, in mean card-heights of camera depth. START is purely visual; END
      // also anchors dragFlipZ and the pull-quote cue — see cardVanishDepth.
      NEAR_FADE_START: cfg.NEAR_FADE_START,
      NEAR_FADE_END: cfg.NEAR_FADE_END,
      // Listed explicitly, not spread, so the overlay's layout keys can't leak on.
      CARD_FACE_CAMERA: shape.CARD_FACE_CAMERA,
      CYLINDER: !!shape.CYLINDER,
      CYL_COLS_FIT: cfg.CYL_COLS_FIT ?? shape.CYL_COLS_FIT,
      CYL_COL_GAP_RATIO: shape.CYL_COL_GAP_RATIO,
      CYL_ROW_GAP_RATIO: shape.CYL_ROW_GAP_RATIO,
      CYL_ASPECT_CAP: shape.CYL_ASPECT_CAP,
      CYL_BULGE: shape.CYL_BULGE,
      // Frustum height at the cylinder's centre plane — the column solve's vertical budget.
      CYL_FRUSTUM_H: 2 * TAN_HALF_FOV * cfg.CAM_Z_SPHERE,
      CARD_ROLL_JITTER: cfg.CARD_ROLL_JITTER,
      DRAG_GEARING: cfg.DRAG_GEARING,
      ...spec.bpExtras(cfg, nTotal),
    });
  }

  let renderer; let scene; let camera; let
    sphereGroup;
  let cards = [];
  let textures = [];
  let cardAspects = []; // per-card native image aspect (index-aligned with CARD_CONTENT)
  let placeholderTex = null; // shared transparent texture for not-yet-loaded cards

  // The single source for the clocks — never cache them.
  const frameState = timeline.createFrame();
  const frameInput = timeline.createFrameInput();

  let blockDocTop = 0; // block's top in document space (the scroll runway)
  let blockHeight = 0; // its full scroll length
  let formationVh = 0; // from --globe-formation-vh, where a block has one (see readCssVars)
  let W = 0;
  let H = 0;
  let navH = 0; // --globe-nav-h; see the globe-gallery README (The nav band)

  const worldEl = q('.globe-world');

  let renderReady = false;
  let onScreen = true; // assume visible until the observer's first callback corrects it
  let canvasHidden = false; // set by updateCanvasVisibility; also skips the scene draw

  const orientation = createOrientation({
    getCards: () => cards,
    getBp: () => bp,
    isReducedMotion: () => reducedMotion,
  });
  const { drag, rotQuat: sphereRotQuat } = orientation;

  let modal = null;
  let a11y = null;
  let interaction = null;
  let controls = null;
  let cursor = null;

  let suppressFocusSnap = false;

  function measureBlock() {
    blockDocTop = root.getBoundingClientRect().top + window.scrollY;
    blockHeight = root.offsetHeight;
  }

  const pullQuote = createPullQuote({
    timeline: {
      easePow: timeline.TRAVEL_EASE_POW,
      spanPx: travelSpanPx,
      scrollYAt: scrollYAtTravelT,
    },
    ...spec.pullQuote,
    root,
    getBp: () => bp,
    getView: () => ({ W, H, navH }),
    getSpan: () => frameInput,
    getFormationVh: () => formationVh,
    getCards: () => cards,
    getSphereGroup: () => sphereGroup,
    isCardManaged: (card) => modal.isCardManaged(card),
    onHeightChange: measureBlock,
  });

  const field = createCardField({
    getBp: () => bp,
    getCards: () => cards,
    getSphereGroup: () => sphereGroup,
    getCamera: () => camera,
    frame: frameState,
    orientation,
    pullQuote,
    isReducedMotion: () => reducedMotion,
    tAtCamZ: timeline.travelTAtCamZ,
  });

  const hint = createHintText({
    getBp: () => bp,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    getView: () => ({ W, H, navH }),
    frame: frameState,
    text: hintText,
    isReducedMotion: () => reducedMotion,
    getCueT: field.pqAppearT,
  });

  function formedScrollPx() {
    return Math.min((formationVh / 100) * H, blockHeight);
  }

  const hooks = spec.createHooks({
    q,
    root,
    worldEl,
    field,
    rotQuat: sphereRotQuat,
    formedScrollPx,
    get bp() { return bp; },
    get W() { return W; },
    get H() { return H; },
    get navH() { return navH; },
    get cards() { return cards; },
    get camera() { return camera; },
    get sphereGroup() { return sphereGroup; },
    get blockDocTop() { return blockDocTop; },
    get reducedMotion() { return reducedMotion; },
  });

  function cardAspect(i) {
    return cardAspects[i] || CARD_ASPECT;
  }

  function buildCards() {
    const {
      N_TOTAL, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE, CARD_ROLL_JITTER, CYLINDER,
    } = bp;
    if (!placeholderTex) placeholderTex = createPlaceholderTexture();
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    if (reducedMotion && bp.name !== 'sm') sphereGroup.scale.setScalar(RM_GLOBE_SCALE_MD);
    cards = [];
    const rollRandom = seededRandom(spec.rollSeed);

    // Whole-set solve, run ONCE before the per-card loop. Null on the sphere path.
    const masonry = CYLINDER
      ? solveMasonry(bp, cardAspect)
      : null;

    const fibSlots = masonry ? null : Array.from(
      { length: N_TOTAL },
      (unused, k) => fibSpherePos(k, N_TOTAL, SPHERE_R),
    ).sort((a, b) => a.z - b.z);

    for (let i = 0; i < N_TOTAL; i += 1) {
      const srcAspect = cardAspect(i);
      const mas = masonry ? masonry[i] : null;
      const sphereScale = sphereCardScale(srcAspect);

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      const mat = createCardMaterial({
        texture: textures[i] || placeholderTex,
        aspect: CARD_ASPECT, // arc/grid start shape; per-phase stages update uAspect
      });
      const mesh = new THREE.Mesh(geo, mat);
      sphereGroup.add(mesh);

      const sp = mas ? mas.pos.clone() : fibSlots[i].clone();

      // lookAt target is INSIDE the surface so local +Z points out.
      const faceTarget = mas
        ? sp.clone().sub(mas.normal)
        : new THREE.Vector3(0, 0, 0);
      const m = new THREE.Matrix4()
        .lookAt(sp, faceTarget, WORLD_UP);
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
      const rz = CYLINDER ? 0 : (rollRandom() - 0.5) * CARD_ROLL_JITTER;
      sq.multiply(new THREE.Quaternion().setFromAxisAngle(Z_UNIT, rz));

      cards.push({
        mesh,
        spherePos: sp,
        sphereQuat: sq,
        srcAspect,
        sphereScaleSX: mas ? mas.w / CARD_W_SPHERE : sphereScale.sX,
        sphereScaleSY: mas ? mas.h / CARD_H_SPHERE : sphereScale.sY,
        sphereWorldH: mas ? mas.h : CARD_H_SPHERE * sphereScale.sY,
        hoverT: 0, // eased 0→1 hover progress (sphere phase only)
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
        hasTexture: !!textures[i], // false until this card's photo loads (onEach flips it)
        revealT: textures[i] ? 1 : 0, // eased 0→1 texture-ready un-dissolve
        morph: null, // the sm masonry re-solve's from/to pair, while one is running
      });
    }
    field.recomputeDragFlip();
    hooks.onCardsBuilt?.();
  }

  modal = createGlobeModal({
    hoistToBody,
    bodyOpenClass,
    renderContent: spec.modal.renderContent,
    q,
    getScene: () => scene,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    getRenderer: () => renderer,
    getCards: () => cards,
    getCount: () => CARD_CONTENT.length,
    getCardMetadata,
    authoredNo,
    stepCard,
    // Returns the pending Image (cancellable), or null when the base cap already meets it.
    loadModalUpgrade: (idx, onReady, onError) => {
      const base = bp.name === 'sm' ? CARD_TEX_SM : CARD_TEX_MD;
      const modalCap = bp.name === 'sm' ? MODAL_TEX_SM : MODAL_TEX_MD;
      if (modalCap <= base) return null;
      const meta = getCardMetadata(idx);
      const src = spec.modalImageUrl(meta, modalCap);
      return loadModalTextureRaw(src, modalCap, onReady, onError, meta.crossOrigin, name);
    },
    getViewport: () => ({ W, H }),
    ...(tracksCanvasTop && { getCanvasTop: () => renderer.domElement.getBoundingClientRect().top }),
    getBP: () => bp.name,
    getCardDims: () => ({ w: bp.CARD_W_SPHERE, h: bp.CARD_H_SPHERE }),
    cardAspect: CARD_ASPECT,
    getAntialias: () => (bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD),
    caEnabled: CA_ENABLED,
    cardLabel: labels.cardLabel,
    getReducedMotion: () => reducedMotion,
    sphereRotQuat,
    snapToSphereSlot: field.snapCardToSphereSlot,
    applySphereFacing: field.applySphereFacing,
    requestNavNudge: (idx) => {
      if (a11y && a11y.isBrowsing()) orientation.centerCardOnScreen(idx);
      else orientation.centerModalCard(idx);
    },
    applyMotionCA: field.applyMotionCA,
    restoreFocusOnClose: (idx) => { if (a11y && a11y.isBrowsing()) a11y.focusCard(idx); },
  });

  function readCssVars() {
    const rootStyle = getComputedStyle(root);
    const cssNum = (prop) => {
      const n = parseFloat(rootStyle.getPropertyValue(prop));
      return Number.isFinite(n) ? n : null;
    };
    const vh = cssNum('--globe-formation-vh');
    if (vh !== null) formationVh = vh;
    const nav = cssNum('--globe-nav-h');
    if (nav !== null) navH = nav;
  }

  const measureViewportH = () => Math.max(1, worldEl.offsetHeight);

  function snapToBrowseView() {
    if (suppressFocusSnap) return;
    const top = hooks.browseScrollTop();
    if (window.lenis?.scrollTo) window.lenis.scrollTo(top, { force: true, immediate: true });
    else window.scrollTo(0, top);
  }

  // Armed on blur/hidden, disarmed a frame after focus, so a tab-return can't re-snap.
  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => { requestAnimationFrame(() => { suppressFocusSnap = false; }); };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };

  const retireHint = () => { if (frameState.hintRetirable) hint.retire(); };

  const openModalAndDismissHint = (idx, x, y) => {
    retireHint();
    modal.open(idx, x, y);
  };

  // Canvas taps only — the keyboard path reports itself.
  const openModalFromCanvas = (idx, x, y) => {
    openModalAndDismissHint(idx, x, y);
    if (modal.getModalIdx() >= 0) a11y?.trackCardOpen(idx);
  };

  // The globe is on screen and nothing is covering it. The keyboard path stays on THIS even past
  // the pull-quote cue: focusing a card runs snapToBrowseView, which scrolls back into range, so
  // retiring the tab stops early would remove the entry point before the snap could use it.
  const globeFormed = () => frameState.interactive && modal.getModalIdx() < 0;

  // Live to the pointer: drag, tap-to-open, canvas cursor and the on-canvas controls all retire
  // together. Interactivity saturates for the whole travel tail, so the pull-quote cue is what
  // actually ends the pointer-interactive stretch.
  const globeLive = () => globeFormed() && frameState.scrollT < pullQuote.liveUntil();

  a11y = createGalleryA11y({
    name,
    q,
    getCount: () => CARD_CONTENT.length,
    cardOrder: AUTHORED_ORDER,
    getModalIdx: () => modal.getModalIdx(),
    isGlobeFormed: globeFormed,
    getCardLabel: (i) => {
      const m = getCardMetadata(i);
      return (m && m.alt) || `Image ${authoredNo(i)}`;
    },
    getCardLang: (i) => {
      const m = getCardMetadata(i);
      return (m && m.alt && m.lang) || '';
    },
    // A focus snap follows unless it is suppressed (tab-return): solve for where the camera lands.
    centerCard: (i) => orientation.centerCardOnScreen(i, !suppressFocusSnap),
    openCard: (i) => openModalAndDismissHint(i, W / 2, H / 2),
    onFocus: snapToBrowseView,
    galleryInstructions: instructions,
    gid,
  });

  controls = createGlobeControls({
    name,
    q,
    labels,
    getVisible: globeLive,
    getHintDismissed: hint.isRetired,
    rotate: (dir) => {
      retireHint();
      orientation.rotateStep(dir);
    },
  });

  cursor = createCursor({
    getGlobeLive: globeFormed,
    getCursorRetired: () => hint.isRetired() || frameState.scrollT >= pullQuote.liveUntil(),
    labelText: hintText,
  });

  const dragSensitivity = () => {
    const radiusPx = (bp.SPHERE_R * H) / bp.CYL_FRUSTUM_H;
    return ((Math.PI / 2) * bp.DRAG_GEARING) / Math.max(1, radiusPx);
  };

  interaction = createInteraction({
    getRenderer: () => renderer,
    getCamera: () => camera,
    getCards: () => cards,
    openModal: (idx, x, y) => openModalFromCanvas(idx, x, y),
    getDragSensitivity: dragSensitivity,
    isGlobeLive: globeLive,
    maxVel: MAX_VEL,
    drag,
    // Pitch follows geometry, not pointer type: the barrel is yaw-only for mouse too.
    getYawOnly: () => bp.YAW_ONLY,
    onDrag: retireHint,
  });

  const readScrollY = createScrollReader();

  function computeFrame(now) {
    frameInput.scrollY = readScrollY();
    frameInput.reducedMotion = reducedMotion;
    frameInput.blockDocTop = blockDocTop;
    frameInput.blockHeight = blockHeight;
    frameInput.formPx = formedScrollPx();
    frameInput.travelPx = pullQuote.travelPx();
    frameInput.viewportH = H;
    hooks.fillFrameInput?.(frameInput);
    frameInput.now = now || performance.now();
    timeline.deriveFrame(frameState, frameInput);
    frameInput.prevScrollY = frameState.scrollY;
    frameInput.prevNow = frameInput.now;
    return frameState;
  }

  let appliedViewOffsetY = null; // W and H are baked into the call; null on any change to either
  function applyCentringOffset(offY) {
    if (offY === appliedViewOffsetY) return;
    appliedViewOffsetY = offY;
    if (offY) camera.setViewOffset(W, H, 0, -offY, W, H);
    else camera.clearViewOffset();
  }

  function updateActiveCamera(frame) {
    const { sphereFormT, scrollT } = frame;
    const { CAM_Z_SPHERE, CAM_Z_END } = bp;
    // easeInCubic into the travel's ease-out.
    camera.position.z = scrollT === 0
      ? lerpN(hooks.entryCamZ(), CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
      : timeline.camZAtTravelT(scrollT, CAM_Z_SPHERE, CAM_Z_END);
    applyCentringOffset(hooks.viewOffsetY(frame));
    // Flip the drag once the camera is INSIDE; the threshold is dragFlipZ, not SPHERE_R.
    orientation.setInside(scrollT > 0 && Math.abs(camera.position.z) < field.dragFlipZ());
    return hooks.activeCamera?.(frame) ?? camera;
  }

  // Refreshes sphereRotQuat; the rotation itself is applied per-card in updateCardTransform.
  function updateSphereRotation(frame) {
    return orientation.update({
      dtScale: frame.dtScale,
      interactive: frame.interactive,
      orientReset: frame.orientReset,
      frozen: modal.getModalIdx() >= 0,
      browsing: a11y.isBrowsing(),
      spinEnabled: !reducedMotion && !controls.isSpinPaused(),
      quoteOwnsCards: pullQuote.ownsCards(),
      restK: pullQuote.handoffEase(frame.scrollT),
    });
  }

  const ringWorld = new THREE.Vector3();
  const ringEdge = new THREE.Vector3();
  function updateA11yFocusRing() {
    const idx = a11y.getFocusedIdx();
    if (idx < 0 || !cards[idx] || !cards[idx].mesh) return;
    const { mesh } = cards[idx];
    mesh.getWorldPosition(ringWorld);
    if (canvasHidden || !mesh.visible || camera.position.z - ringWorld.z <= 0.01) {
      a11y.setFocusRect(0, 0, 0, 0);
      return;
    }
    const groupScale = sphereGroup.scale.x;
    ringEdge.set(
      ringWorld.x + 0.5 * bp.CARD_W_SPHERE * mesh.scale.x * groupScale,
      ringWorld.y + 0.5 * bp.CARD_H_SPHERE * mesh.scale.y * groupScale,
      ringWorld.z,
    );
    camera.updateMatrixWorld();
    ringWorld.project(camera);
    ringEdge.project(camera);
    const cx = (ringWorld.x * 0.5 + 0.5) * W;
    const cy = (-ringWorld.y * 0.5 + 0.5) * H;
    const wPx = Math.abs(ringEdge.x - ringWorld.x) * W;
    const hPx = Math.abs(ringEdge.y - ringWorld.y) * H;
    a11y.setFocusRect(cx, cy, wPx, hPx);
  }

  function updateCanvasVisibility(frame) {
    const { scrollY, scrollT, beforeEntry } = frame;
    const canvas = renderer.domElement;
    // RM: canvas is in normal flow (scrolls away, clips naturally) — just reveal once.
    if (reducedMotion) {
      canvasHidden = false;
      canvas.style.display = 'block';
      return;
    }
    // Past the reveal every card is prox-faded out and the hint text has finished; the scene
    // holds nothing else, so the draw is skipped too. The modal is the exception: its backdrop
    // blurs this canvas, so hiding it would leave the blur with nothing to sample.
    const pastEnd = pullQuote.isOn()
      ? pullQuote.isDone(scrollY)
      : scrollT >= field.pqAppearT() + CANVAS_HIDE_MARGIN_T;
    canvasHidden = modal.getModalIdx() < 0 && (beforeEntry || pastEnd);
    canvas.style.display = canvasHidden ? 'none' : 'block';
  }

  function renderScene(activeCamera) {
    if (!canvasHidden) renderer.render(scene, activeCamera);
    modal.render();
  }

  function updateCardTransform(i, frame) {
    const card = cards[i];
    const { mesh } = card;

    // utils/globe/modal.js drives the cards it manages (active + swipe-neighbours).
    if (modal.isCardManaged(card)) return;

    // Both BEFORE the placement reads them.
    field.advanceCard(card, frame.dtScale);
    const baseCA = hooks.cardProgress?.(card, i, frame) ?? 0;

    field.updateCardHover(card, frame, globeLive());
    field.applyCardCA(card, mesh, baseCA);

    if (hooks.placeCard) {
      hooks.placeCard(card, mesh, i, frame);
    } else {
      field.placeSphereCard(card, mesh, frame);
      field.applyDepthOrder(card, mesh, frame);
    }
  }

  // Stage order is FIXED and load-bearing.
  function tick(now) {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const frame = computeFrame(now);
    hooks.beforeFrame?.(frame);

    a11y.updateTabStops();
    pullQuote.update(frame, frame.scrollY);
    frame.activeCamera = updateActiveCamera(frame);
    frame.sphereRotActive = updateSphereRotation(frame);
    modal.updateAnimation(frame.sphereRotActive, frame.dtScale);
    modal.updateDesktopNav();
    updateCanvasVisibility(frame);

    renderer.sortObjects = true;

    hooks.beforeCards?.(frame);
    field.updateAll(frame, updateCardTransform);
    pullQuote.afterCards();
    updateA11yFocusRing(); // after card transforms — reads the meshes' fresh world positions
    hint.update(
      frame,
      hooks.hintSphereDist?.(frame) ?? Math.max(camera.position.z, bp.CAM_Z_SPHERE),
    );
    cursor.update();
    interaction.applyCursor();
    controls.update();
    hooks.afterFrame?.(frame);
    renderScene(frame.activeCamera);
  }

  let rafId = 0;
  function rafLoop(now) { rafId = requestAnimationFrame(rafLoop); tick(now); }
  function startTicker() {
    if (rafId) return;
    // Re-baseline scroll and the frame clock; the parked interval isn't a dt.
    frameInput.prevScrollY = readScrollY();
    frameInput.prevNow = 0;
    rafId = requestAnimationFrame(rafLoop);
  }
  function stopTicker() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
    // Inertia can't coast while the loop is parked — retire it.
    orientation.dropTravel();
  }
  function syncTicker() {
    if (renderReady && onScreen) {
      startTicker();
    } else {
      stopTicker();
      if (renderer) renderer.domElement.style.display = 'none';
    }
  }

  const ctxLoss = { rebuilds: 0, stableTimer: 0, recovering: false, recoverTimer: 0 };
  function onContextLost(e) {
    e.preventDefault();
    if (ctxLoss.stableTimer) { clearTimeout(ctxLoss.stableTimer); ctxLoss.stableTimer = 0; }
    stopTicker();
    renderReady = false;
    window.lana?.log?.(`${name}: WebGL context lost`, { tags: name, severity: 'warn' });
  }
  function recoverFromContextLoss() {
    ctxLoss.recoverTimer = 0;
    ctxLoss.recovering = false;
    ctxLoss.rebuilds += 1;
    const collapsed = ctxLoss.rebuilds > MAX_CONTEXT_REBUILDS;
    window.lana?.log?.(
      collapsed
        ? `${name}: WebGL context keeps failing — collapsing`
        : `${name}: WebGL context restored — rebuilding`,
      { tags: name, severity: collapsed ? 'error' : 'info' },
    );
    // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
    destroy(false);
    // eslint-disable-next-line no-use-before-define -- same hoisted mutual ref
    if (collapsed || initRuntime() === false) {
      root.classList.add('globe-empty');
      return;
    }
    ctxLoss.stableTimer = window.setTimeout(() => {
      ctxLoss.rebuilds = 0; ctxLoss.stableTimer = 0;
    }, CONTEXT_STABLE_MS);
  }
  function onContextRestored() {
    if (ctxLoss.recovering) return; // coalesce the main + modal canvases' restore events (README)
    ctxLoss.recovering = true;
    ctxLoss.recoverTimer = window.setTimeout(recoverFromContextLoss, 0);
  }
  const contextCanvases = [q('.globe-canvas'), q('.globe-modal-canvas')];
  function bindContextListeners(add) {
    const fn = add ? 'addEventListener' : 'removeEventListener';
    contextCanvases.forEach((c) => {
      c[fn]('webglcontextlost', onContextLost, false);
      c[fn]('webglcontextrestored', onContextRestored, false);
    });
  }

  let resizeHandler = null;
  let reducedMotionMQ = null;
  let reducedMotionHandler = null;
  function detachReducedMotion() {
    if (reducedMotionMQ && reducedMotionHandler) {
      reducedMotionMQ.removeEventListener('change', reducedMotionHandler);
    }
    reducedMotionMQ = null;
    reducedMotionHandler = null;
  }
  let appliedDpr = 0;
  let layoutObs = null; // ResizeObserver keeping block metrics fresh as page content loads
  let intersectionObs = null; // IntersectionObserver gating the rAF loop on visibility
  let layoutWaitObs = null;
  function disconnectObservers() {
    [layoutObs, intersectionObs, layoutWaitObs].forEach((o) => o && o.disconnect());
    layoutObs = null;
    intersectionObs = null;
    layoutWaitObs = null;
  }
  let textureLoadGeneration = 0;

  function initRuntime() {
    const canvas = q('.globe-canvas');
    if (!canvas) return false;

    // See the globe-gallery README (Zero-box gate).
    if (root.offsetHeight <= 0) {
      if (!layoutWaitObs) {
        layoutWaitObs = new ResizeObserver(() => {
          if (root.offsetHeight <= 0) return;
          layoutWaitObs.disconnect();
          layoutWaitObs = null;
          if (initRuntime() === false) root.classList.add('globe-empty');
        });
        layoutWaitObs.observe(root);
      }
      return undefined;
    }

    reducedMotion = prefersReducedMotion();
    root.classList.toggle('globe-reduced', reducedMotion);
    hooks.beforeBuild?.(canvas);

    W = window.innerWidth;
    H = measureViewportH();

    const band = resolveBP(breakpoints, W);
    bp = resolveBpProfile(band.name, band.cfg, usesCylinderGeometry(band.name));
    field.publishCue();

    try {
      const aa = bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, alpha: true });
    } catch (e) {
      renderer = null;
      window.lana?.log?.(`${name}: WebGL renderer creation failed: ${e?.message || e}`, { tags: name, severity: 'warn' });
      return false;
    }
    appliedDpr = capDpr();
    renderer.setPixelRatio(appliedDpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false; // we manage order via mesh.renderOrder

    bindContextListeners(true);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(CAM_FOV, W / H, 0.1, 5000);
    camera.position.set(0, 0, hooks.entryCamZ());
    camera.lookAt(0, 0, 0);
    appliedViewOffsetY = null;
    hooks.onCameraReady?.();

    function doLayout({ fromResize = false } = {}) {
      readCssVars();
      measureBlock();
      pullQuote.syncHeight();
      const nextW = window.innerWidth;
      const nextH = measureViewportH();
      if (fromResize && nextW === W && nextH === H) {
        pullQuote.layout(); // the quote box can change width without the viewport doing so
        return;
      }
      W = nextW;
      H = nextH;
      appliedViewOffsetY = null;

      // A band crossing or RM toggle rebuilds (geometry is baked at build time); resizing
      // within a band takes the cheap path.
      const nextBand = resolveBP(breakpoints, W);
      const nextReducedMotion = prefersReducedMotion();
      if (nextBand.name !== bp.name || nextReducedMotion !== reducedMotion) {
        // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
        destroy(false);
        if (initRuntime() === false) root.classList.add('globe-empty');
        return;
      }
      const dpr = capDpr();
      if (dpr !== appliedDpr) {
        appliedDpr = dpr;
        renderer.setPixelRatio(dpr);
      }
      renderer.setSize(W, H);
      modal.resize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      hooks.onResize?.();
      hint.onResize();
      pullQuote.layout();
    }
    if (!reducedMotion) pullQuote.build({ scene, renderer, camera });
    doLayout();
    // A webfont landing after first layout retypesets the quote.
    if (document.fonts && document.fonts.ready) {
      const afterFonts = () => pullQuote.layout(true);
      document.fonts.ready.then(afterFonts, afterFonts);
    }
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => doLayout({ fromResize: true });
    window.addEventListener('resize', resizeHandler, { passive: true });

    // RM can toggle mid-session without a resize.
    detachReducedMotion();
    reducedMotionMQ = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    if (reducedMotionMQ) {
      reducedMotionHandler = () => doLayout();
      reducedMotionMQ.addEventListener('change', reducedMotionHandler);
    }

    disconnectObservers();

    // Page height changes shift offsetTop with no window resize behind them.
    layoutObs = new ResizeObserver(() => doLayout({ fromResize: true }));
    layoutObs.observe(document.body);

    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObs = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        syncTicker();
      }, { rootMargin: '100% 0px 100% 0px' });
      intersectionObs.observe(root);
    }

    interaction.setup(canvas);
    if (!bp.CYLINDER && !reducedMotion) cursor.setup(canvas);
    root.classList.toggle('globe-barrel', bp.CYLINDER);

    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    modal.setup();

    buildCards();

    if (!bp.CYLINDER) hint.build();
    renderer.compile(scene, camera);
    a11y.setup();
    controls.setup();

    renderReady = true;
    syncTicker();

    const loadGeneration = textureLoadGeneration;
    const onEachTexture = (i, tex, srcAspect) => {
      if (loadGeneration !== textureLoadGeneration) { tex.dispose(); return; }
      textures[i] = tex;
      cardAspects[i] = srcAspect;
      const card = cards[i];
      if (!card) return;
      card.mesh.material.map = tex; // property proxy writes uMap
      renderer.initTexture(tex);
      card.srcAspect = srcAspect; // every phase's fit derives from it; the modal falls back to it
      // md sizes per-card in place; sm re-solves its packing in onDone.
      if (!bp.CYLINDER) field.updateCardSphereSizing(card, srcAspect);
      card.hasTexture = true; // revealT eases up in updateCardTransform
    };
    const onDoneTextures = (loadedTextures, loadedAspects) => {
      if (loadGeneration !== textureLoadGeneration) {
        loadedTextures.forEach((t) => t && t.dispose());
        return;
      }
      textures = loadedTextures;
      cardAspects = loadedAspects;
      // recomputeDragFlip runs when the barrel's morph settles.
      if (bp.CYLINDER) field.resolveMasonryLayout(cardAspect);
      else field.recomputeDragFlip();
    };
    const cardMaxTexH = bp.name === 'sm' ? CARD_TEX_SM : CARD_TEX_MD;
    loadCardTextures({
      count: bp.N_TOTAL,
      // Ask at the cap, by HEIGHT, matching fitCardDims.
      getSrc: (i) => spec.cardImageUrl(getCardMetadata(i), cardMaxTexH),
      maxTexH: cardMaxTexH,
      name,
      getCrossOrigin: (i) => getCardMetadata(i).crossOrigin || null,
    }, onEachTexture, onDoneTextures);
    return true;
  }

  // finalize also removes a modal hoisted out of the block.
  function destroy(finalize = hoistToBody) {
    stopTicker();
    renderReady = false;
    textureLoadGeneration += 1; // invalidate any loadCardTextures callback still in flight

    onScreen = true; // reset the visibility default; the next init's observer re-corrects it
    bindContextListeners(false);
    if (ctxLoss.stableTimer) { clearTimeout(ctxLoss.stableTimer); ctxLoss.stableTimer = 0; }
    if (ctxLoss.recoverTimer) { clearTimeout(ctxLoss.recoverTimer); ctxLoss.recoverTimer = 0; }
    ctxLoss.recovering = false;
    disconnectObservers();
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    detachReducedMotion();
    window.removeEventListener('blur', armFocusGuard);
    window.removeEventListener('focus', disarmFocusGuard);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    interaction.teardown();
    cursor.teardown();
    controls.teardown();
    if (renderer) {
      // Do NOT forceContextLoss() here — the canvas is reused across rebuilds and a force-lost
      // context never restores.
      renderer.dispose();
      renderer.domElement.style.display = 'none';
    }
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const { mesh } = card;
      if (mesh) {
        const mm = card.modalMat;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
        if (mesh.origMaterial && mesh.origMaterial !== mesh.material) mesh.origMaterial.dispose();
        if (mm && mm !== mesh.material && mm !== mesh.origMaterial) mm.dispose();
      }
    }
    for (let i = 0; i < textures.length; i += 1) {
      if (textures[i]) textures[i].dispose();
    }
    if (placeholderTex) { placeholderTex.dispose(); placeholderTex = null; }
    field.reset();
    cards = [];
    textures = [];
    cardAspects = [];
    hint.reset();
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; sphereGroup = null;
    hooks.onDestroy?.();
    modal.destroy(finalize);
    a11y.teardown();
    pullQuote.teardown();
    Object.assign(frameState, timeline.createFrame());
    Object.assign(frameInput, timeline.createFrameInput());
    canvasHidden = false;
    // The closure survives a rebuild, so a pre-rebuild tilt would carry over.
    orientation.reset();
    // NOTE: `bp` intentionally NOT cleared — doLayout compares it, initRuntime overwrites it.
  }

  return { init: initRuntime, destroy };
}

// A block's `init`. spec.setup(el) parses the authored rows and builds the DOM, synchronously,
// before anything awaits; it returns the runtime's options plus loadCards().
export async function initGlobeBlock(el, spec) {
  const styles = loadGlobeStyles();
  if (prefersReducedMotion()) {
    el.classList.add('globe-reduced');
  }

  const { loadCards, ...options } = spec.setup(el);
  const authored = await loadCards();
  await styles;
  if (!authored || authored.length === 0) {
    el.classList.add('globe-empty');
    return el;
  }
  const runtime = createGlobeRuntime(spec, { ...options, cards: scatterCards(authored), root: el });
  if (runtime.init() === false) { el.classList.add('globe-empty'); return el; }
  el.globeRuntime = runtime;

  onRemoved(el, () => runtime.destroy());

  return el;
}
