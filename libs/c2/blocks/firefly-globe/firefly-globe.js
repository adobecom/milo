import * as THREE from '../../../deps/three.js';
import {
  parseAuthoredContent, fetchFragmentCards, buildGlobeDom,
  optimizeImgUrl, scatterCards,
} from './src/authoring.js';
import {
  createCardMaterial, createTextMaterial, createPlaceholderTexture,
  loadCardTextures, loadModalTexture as loadModalTextureRaw, createClickDragTexture,
  loadHintFont,
} from './src/materials.js';
import createGalleryA11y from './src/a11y.js';
import createGlobeModal from './src/modal.js';
import createInteraction from './src/interaction.js';
import createGlobeControls from './src/controls.js';
import createCursor from './src/cursor.js';
import {
  easeInOutCubic, lerpN, clamp01, coverFit,
  capDpr, CAM_FOV, TAN_HALF_FOV,
  CURSOR_ZOOM_RETIRE_T, FRAME_MS, DT_SCALE_MIN, DT_SCALE_MAX, createFrame,
} from './src/utils.js';

const CARD_ASPECT = 456 / 631;

function sphereCardScale(srcAspect) {
  const a = Number.isFinite(srcAspect) && srcAspect > 0 ? srcAspect : CARD_ASPECT;
  const stretch = Math.sqrt(a / CARD_ASPECT);
  return { sX: stretch, sY: 1 / stretch };
}

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  || !!window.matchMedia?.('(height <= 460px) and (resolution >= 1.5dppx)').matches;

const BREAKPOINTS = {
  sm: {
    minWidth: 0,
    SPHERE_R: 18,
    CARD_H_SPHERE: 11.0, // PlaneGeometry base only; masonry sets the visible size
    CAM_Z_SPHERE: 70,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.5,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
  },
  md: {
    minWidth: 768,
    SPHERE_R: 35,
    CARD_H_SPHERE: 10.5,
    CAM_Z_SPHERE: 57,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.6,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

// Card caps are on texture HEIGHT; modal caps are on the longest side.
const CARD_TEX_SM = 384;
const CARD_TEX_MD = 768;
const MODAL_TEX_SM = 1024;
const MODAL_TEX_MD = 2048;
const ANTIALIAS_SM = false;
const ANTIALIAS_MD = true;

// Yaw-only drags (touch / narrow): a cylindrical masonry wall replaces the Fibonacci sphere.
const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_COL_GAP_RATIO: 0.20, // column gap as a fraction of card width; also sets cardW
  CYL_ROW_GAP_RATIO: 0.10, // row gap as a fraction of card width
  CYL_ASPECT_CAP: 1.9, // on the LAID-OUT aspect; past it the fit crops
  CYL_BULGE: 0.18, // r = R·(1 − bulge·t²); keep ≤~0.2 or edges overlap
  CARD_FACE_CAMERA: 0.1, // >0 costs barrel smoothness
};

function usesCylinderGeometry(bandName) {
  if (bandName === 'sm') return true;
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

const RM_GLOBE_SCALE_MD = 0.9; // sm stays at 1

const TEXT_REBUILD_DEBOUNCE_MS = 150;

// Every *_RATE / FRICTION / SPEED below is authored per 60fps frame and rescaled at its use site
// by frame.dtScale: linear ones by multiply, exponential eases by ** dtScale. MAX_VEL is shared
// with interaction.js (it clamps, core normalizes).
const DRAG_FRICTION = 0.94;
const MAX_VEL = 0.08; // rad per 60fps frame; ceiling on a flick AND a held step
const DRAG_CATCHUP = 0.5; // share of an over-max backlog worked off per 60fps frame
const AUTO_ROT_SPEED = 0.0005; // ambient yaw RATE per 60fps frame (NOT an increment into velX)
// Browse-only pitch cap; excess eases back to the resting cap at PITCH_RELAX.
const KEY_PITCH_CAP = (85 * Math.PI) / 180;
const PITCH_RELAX = 0.85;
// Sphere-centring tween lengths, in 60fps frames (navNudge.frame advances by dtScale).
const KEY_BROWSE_FRAMES = 90;
const KEY_MODAL_FRAMES = 20;
const ROTATE_STEP_FRAMES = 34;
const ROTATE_DEADZONE = 0.15;
const COLUMN_EPS = 1e-6;

// Chromatic aberration.
const CA_ENABLED = true;
const CA_MOTION_CAP_SM = 0.01; // directional UV shift max
const CA_MOTION_CAP_MD = 0.03;
const HOVER_CA = 0.0125;
const SPHERE_DRAG_CA_MUL = 0.2; // uCA per unit of sphereDragWarp

// Hover (sphere phase only).
const HOVER_WARP = 0.4;
const HOVER_SCALE = 0.25; // added, not replacing: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target

// Per-card un-dissolve once its photo lands.
const REVEAL_RATE = 0.06; // per-frame
// One-time sm-barrel reflow after all textures load.
const MASONRY_MORPH_RATE = 0.05; // per-frame

// Near-camera proximity fade, in card-heights of depth.
const FACING_EDGE_ON_BAND = 0.25; // |normal.z| half-width of the facing fade-out band
// Near-camera fade. The BAND is per breakpoint (bp.NEAR_FADE_START/END, in mean card-heights of
// camera depth) — sm cards are far larger against the viewport, so the two can want a different
// feel. The RAMP SHAPE below is shared: it is how the band is spent, not how wide it is.
const NEAR_FADE_OPACITY_BIAS = 0.4; // exponent on the prox opacity ramp (<1 = fade out later)
const NEAR_FADE_DISPERSE_RAMP = 0.9; // exponent on uDisperse, applied here not in the shader

const CARD_ORDER_STEPS = 1000;
const CARD_ORDER_BASE = -(CARD_ORDER_STEPS + 8);
const HOVER_ORDER_STEPS = 7;
const TEXT_ORDER = CARD_ORDER_BASE - CARD_ORDER_STEPS - 8;

const SPHERE_DRAG_WARP_BASELINE = 0.05; // while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on the combined value
const SPHERE_DRAG_WARP_EASE = 0.20; // per-frame ease toward the target

// "Click & Drag" hint text: a WebGL plane behind the sphere.
const TEXT_BEHIND_GAP = 15; // world units behind the sphere back surface
const TEXT_OPACITY_RESTING = 0.06;
const HINT_EXIT_RATE = 0.007;

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const BALANCE_PASSES = 20;

function balanceColumns(heights, gap, cols) {
  const n = heights.length;
  const load = new Array(cols).fill(0);
  const col = new Array(n);
  const tallestFirst = Array.from({ length: n }, (unused, i) => i)
    .sort((a, b) => heights[b] - heights[a] || a - b);
  for (let k = 0; k < n; k += 1) {
    const i = tallestFirst[k];
    let best = 0;
    for (let c = 1; c < cols; c += 1) if (load[c] < load[best]) best = c;
    col[i] = best;
    load[best] += heights[i] + gap;
  }
  for (let pass = 0; pass < BALANCE_PASSES; pass += 1) {
    let swapped = false;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const [a, b, d] = [col[i], col[j], heights[i] - heights[j]];
        if (a !== b && d * (load[b] - load[a] + d) < 0) {
          load[a] -= d;
          load[b] += d;
          col[i] = b;
          col[j] = a;
          swapped = true;
        }
      }
    }
    if (!swapped) break;
  }
  return col;
}

// Cylindrical masonry layout — a WHOLE-SET solve; returns { pos, w, h } per card.
// See README (yaw-only geometry) for the packing + column-count rules.
function cylinderMasonryLayout({
  aspects, radius, frustumH, colsFit, colGapRatio, rowGapRatio = colGapRatio, aspectCap, bulge = 0,
}) {
  const n = aspects.length;
  // Clamp extremes so one panorama can't dominate a column (cover-crop handles the rest).
  const clamped = aspects.map((ar) => {
    const a = Number.isFinite(ar) && ar > 0 ? ar : 1;
    return Math.max(1 / aspectCap, Math.min(aspectCap, a));
  });

  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + colGapRatio);
    const rowGap = cardW * rowGapRatio;
    const hs = clamped.map((a) => cardW / a);
    const col = balanceColumns(hs, rowGap, cols);
    const colH = new Array(cols).fill(0);
    const placed = new Array(n);
    for (let c = 0; c < cols; c += 1) {
      for (let i = 0; i < n; i += 1) {
        if (col[i] !== c) continue; // eslint-disable-line no-continue
        placed[i] = { col: c, offset: colH[c], w: cardW, h: hs[i] };
        colH[c] += hs[i] + rowGap;
      }
    }
    const totals = colH.map((h) => Math.max(0, h - rowGap));
    return { placed, totals, wallH: Math.max(...totals) };
  };

  // Fewest columns that fit.
  let packed = null;
  for (let cols = Math.min(4, n); cols <= Math.max(4, n); cols += 1) {
    packed = pack(cols);
    if (packed.wallH <= frustumH * colsFit) break;
  }

  const cols = packed.totals.length;
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1]. Azimuth is untouched.
  const wallH = packed.wallH || 1;
  return packed.placed.map((p, i) => {
    const colTotal = packed.totals[p.col];
    const y = colTotal / 2 - p.offset - p.h / 2;
    const azimuth = (2 * Math.PI * p.col) / cols;
    const t = Math.max(-1, Math.min(1, (2 * y) / wallH));
    const r = radius * (1 - bulge * t * t);
    // Outward normal of the surface of revolution r(y): (1, −dr/dy) normalized, at this azimuth.
    const dRdy = bulge === 0 ? 0 : radius * -2 * bulge * t * (2 / wallH);
    const nScale = 1 / Math.hypot(1, dRdy);
    return {
      pos: new THREE.Vector3(
        r * Math.cos(azimuth),
        y,
        r * Math.sin(azimuth),
      ),
      normal: new THREE.Vector3(
        nScale * Math.cos(azimuth),
        -dRdy * nScale,
        nScale * Math.sin(azimuth),
      ),
      w: p.w,
      h: p.h,
      index: i,
    };
  });
}

function fibSpherePos(i, total, radius) {
  const y = 1 - (2 * i + 1) / total;
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, y)));
  const azimuth = GOLDEN_ANGLE * i;
  return new THREE.Vector3(
    radius * Math.sin(polarAngle) * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    radius * Math.sin(polarAngle) * Math.sin(azimuth),
  );
}

// DOM lookups are scoped to `root` so >1 globe can coexist; `gid` is this instance's unique-id
// suffix (CA filter url(#…) ref).
function createGlobeGalleryRuntime(
  authoredCards,
  hintText,
  instructions,
  root,
  gid,
  labels,
) {
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

  function resolveBpProfile(name, cfg, cylinder) {
    const nTotal = CARD_CONTENT.length;
    const shape = cylinder ? YAW_ONLY_GEOMETRY : cfg;
    const sphereCardH = cfg.CARD_H_SPHERE;
    return Object.freeze({
      name,
      YAW_ONLY: cylinder, // compared in doLayout to detect a pointer-precision change
      N_TOTAL: nTotal, // total number of cards
      CA_MOTION_CAP: name === 'sm' ? CA_MOTION_CAP_SM : CA_MOTION_CAP_MD,
      SPHERE_R: cfg.SPHERE_R,
      CARD_H_SPHERE: sphereCardH,
      CARD_W_SPHERE: sphereCardH * CARD_ASPECT,
      CAM_Z_SPHERE: cfg.CAM_Z_SPHERE,
      // Near-camera fade band, in mean card-heights of camera depth. START is purely visual; END
      // also anchors dragFlipZ — see cardVanishDepth.
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
    });
  }

  let renderer; let scene; let camera; let
    sphereGroup;
  let cards = [];
  let textures = [];
  let cardAspects = []; // per-card native image aspect (index-aligned with CARD_CONTENT)
  let placeholderTex = null; // shared transparent texture for not-yet-loaded cards
  const masonryMorph = { active: false, t: 0 };

  // The single source for the clocks — never cache them.
  const frameState = createFrame();
  const frameInput = { prevNow: 0 };
  let W = 0;
  let H = 0;
  let navH = 0; // --gg-nav-h; see README (The nav band)

  const worldEl = q('.firefly-globe-world');

  // Shared by reference with interaction.js. pendingX/Y: exact unapplied travel (rad).
  // velX/Y: smoothed velocity per 60fps frame.
  const drag = { isDragging: false, velX: 0, velY: 0, pendingX: 0, pendingY: 0 };
  let renderReady = false;
  let onScreen = true; // assume visible until the observer's first callback corrects it
  let sphereDragWarp = 0;
  let fadeRefH = 0; // wall-wide card height the near-camera fade bands off; recomputeDragFlip
  let textMesh = null;
  let hintRetired = false;
  let hintExitT = 0;

  // x = pitch, y = yaw, z = keyboard-uprighting roll. Applied MANUALLY per card; sphereGroup
  // .rotation stays identity and sphereRotQuat is shared into modal.js BY REFERENCE.
  // Euler order 'XYZ' is load-bearing.
  const sphereOrient = { x: 0, y: 0, z: 0 };
  // Glides ±85°→±60° when leaving browse.
  let pitchReleaseCap = Math.PI / 3;
  const sphereRotEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const sphereRotQuat = new THREE.Quaternion();
  const screenRollQuat = new THREE.Quaternion();
  const Z_UNIT = new THREE.Vector3(0, 0, 1);
  const refreshSphereRotQuat = () => {
    sphereRotEuler.set(sphereOrient.x, sphereOrient.y, 0);
    sphereRotQuat.setFromEuler(sphereRotEuler);
    if (sphereOrient.z !== 0) {
      screenRollQuat.setFromAxisAngle(Z_UNIT, sphereOrient.z);
      sphereRotQuat.premultiply(screenRollQuat); // world-Z roll applied last (screen space)
    }
  };
  const tmpVec3 = new THREE.Vector3();

  const navNudge = {
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
  };
  const kbTargetQuat = new THREE.Quaternion(); // scratch: keyboard-centring target orientation
  const kbTargetEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const kbUp = new THREE.Vector3(); // scratch: focused card's world up (for the upright roll)
  let wasBrowsing = false; // tracks the keyboard-gallery browse edge
  // Does NOT touch drag velocity or sphereDragWarp.
  function resetSphereOrientation() {
    sphereOrient.x = 0;
    sphereOrient.y = 0;
    sphereOrient.z = 0;
    pitchReleaseCap = Math.PI / 3;
    navNudge.active = false;
  }
  const cardNormal = new THREE.Vector3();
  const facingTarget = new THREE.Vector3();
  const facingAlign = new THREE.Quaternion();
  const facingPartial = new THREE.Quaternion();
  const IDENTITY_QUAT = new THREE.Quaternion();

  let modal = null;
  let a11y = null;
  let interaction = null;
  let controls = null;
  let cursor = null;

  let suppressFocusSnap = false;

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

    // Whole-set solve, run ONCE before the per-card loop. Null on the sphere path.
    const masonry = CYLINDER
      ? cylinderMasonryLayout({
        aspects: Array.from({ length: N_TOTAL }, (unused, i) => cardAspect(i)),
        radius: SPHERE_R,
        frustumH: bp.CYL_FRUSTUM_H,
        colsFit: bp.CYL_COLS_FIT,
        colGapRatio: bp.CYL_COL_GAP_RATIO,
        rowGapRatio: bp.CYL_ROW_GAP_RATIO,
        aspectCap: bp.CYL_ASPECT_CAP,
        bulge: bp.CYL_BULGE,
      })
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
        aspect: CARD_ASPECT,
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
      const rz = CYLINDER ? 0 : (Math.random() - 0.5) * CARD_ROLL_JITTER;
      sq.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz));

      cards.push({
        mesh,
        spherePos: sp,
        sphereQuat: sq,
        srcAspect,
        sphereScaleSX: mas ? mas.w / CARD_W_SPHERE : sphereScale.sX,
        sphereScaleSY: mas ? mas.h / CARD_H_SPHERE : sphereScale.sY,
        sphereWorldH: mas ? mas.h : CARD_H_SPHERE * sphereScale.sY,
        hoverT: 0, // eased 0→1 hover progress
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
        hasTexture: !!textures[i], // false until this card's photo loads (onEach flips it)
        revealT: textures[i] ? 1 : 0, // eased 0→1 texture-ready un-dissolve
        morph: null, // the sm masonry re-solve's from/to pair, while one is running
      });
    }
    // eslint-disable-next-line no-use-before-define -- hoisted helper defined just below
    recomputeDragFlip();
  }

  // Depth (world units, from the camera) at which a card has faded out completely.
  const cardVanishDepth = () => bp.NEAR_FADE_END * fadeRefH;

  // Camera z below which drag inverts, anchored to where cards VANISH. Sole writer of fadeRefH.
  // Rerun once textures land (sphereWorldH starts as a placeholder).
  function recomputeDragFlip() {
    if (!sphereGroup || cards.length === 0) return;
    fadeRefH = cards.reduce((s, c) => s + c.sphereWorldH, 0) / cards.length;
  }

  // Read live each frame, so writing these morphs the card into its native shape.
  function updateCardSphereSizing(card, srcAspect) {
    const { sX, sY } = sphereCardScale(srcAspect);
    card.srcAspect = srcAspect;
    card.sphereScaleSX = sX;
    card.sphereScaleSY = sY;
    card.sphereWorldH = bp.CARD_H_SPHERE * sY;
  }

  // sm barrel: re-solve the packing once every aspect is known; each card morphs to its slot.
  function resolveMasonryLayout() {
    const { N_TOTAL, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE } = bp;
    const masonry = cylinderMasonryLayout({
      aspects: Array.from({ length: N_TOTAL }, (unused, i) => cardAspect(i)),
      radius: SPHERE_R,
      frustumH: bp.CYL_FRUSTUM_H,
      colsFit: bp.CYL_COLS_FIT,
      colGapRatio: bp.CYL_COL_GAP_RATIO,
      rowGapRatio: bp.CYL_ROW_GAP_RATIO,
      aspectCap: bp.CYL_ASPECT_CAP,
      bulge: bp.CYL_BULGE,
    });
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < N_TOTAL; i += 1) {
      const card = cards[i];
      if (!card) continue; // eslint-disable-line no-continue
      const mas = masonry[i];
      const sp = mas.pos.clone();
      const faceTarget = sp.clone().sub(mas.normal);
      const m = new THREE.Matrix4().lookAt(sp, faceTarget, up);
      const sq = new THREE.Quaternion().setFromRotationMatrix(m); // no roll on the masonry path
      card.morph = {
        posFrom: card.spherePos.clone(),
        posTo: sp,
        quatFrom: card.sphereQuat.clone(),
        quatTo: sq,
        ssxFrom: card.sphereScaleSX,
        ssxTo: mas.w / CARD_W_SPHERE,
        ssyFrom: card.sphereScaleSY,
        ssyTo: mas.h / CARD_H_SPHERE,
        swhFrom: card.sphereWorldH,
        swhTo: mas.h,
      };
    }
    masonryMorph.active = true;
    masonryMorph.t = 0;
  }

  function textPlaneSize() {
    const { SPHERE_R, CAM_Z_SPHERE } = bp;
    const dist = CAM_Z_SPHERE - (-(SPHERE_R + TEXT_BEHIND_GAP));
    const visH = 2 * TAN_HALF_FOV * dist;
    const visW = visH * (camera ? camera.aspect : W / H);
    return { w: visW, h: visH };
  }

  function disposeTextMesh() {
    if (!textMesh) return;
    if (textMesh.parent) textMesh.parent.remove(textMesh);
    textMesh.geometry.dispose();
    if (textMesh.material.uniforms.uMap.value) textMesh.material.uniforms.uMap.value.dispose();
    textMesh.material.dispose();
    textMesh = null;
  }

  // See README ("Click & Drag" hint text).
  function buildTextMesh() {
    disposeTextMesh();
    const targetGroup = sphereGroup;
    const create = () => {
      if (sphereGroup !== targetGroup || !sphereGroup) return;
      const { SPHERE_R } = bp;
      const aspect = camera ? camera.aspect : W / H;
      const texture = createClickDragTexture(aspect, hintText);
      if (!texture) return;
      const dpr = capDpr();
      const sz = textPlaneSize();
      const mat = createTextMaterial({
        texture,
        aspect,
        resolution: { x: W * dpr, y: H * dpr },
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(sz.w, sz.h), mat);
      mesh.position.set(0, 0, -(SPHERE_R + TEXT_BEHIND_GAP));
      mesh.renderOrder = TEXT_ORDER;
      mesh.visible = false;
      textMesh = mesh;
      sphereGroup.add(mesh);
    };
    // Two-arg then, NOT .then().catch(): a throw inside create must not re-run create and
    // orphan the mesh it already added.
    const fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
    Promise.all([fontsReady, loadHintFont(hintText)]).then(create, () => {});
  }

  // Tilts limb cards toward the camera; MUTATES the quat in place. Target is sign(n.z) × view
  // dir so back cards keep facing away.
  function applySphereFacing(quat, amount = 1) {
    let k = bp.CARD_FACE_CAMERA * amount;
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
    const hasRot = (sphereOrient.y !== 0 || sphereOrient.x !== 0 || sphereOrient.z !== 0);
    if (hasRot) {
      refreshSphereRotQuat();
      card.mesh.position.copy(card.spherePos).applyQuaternion(sphereRotQuat);
      card.mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(card.mesh); // match placeSphereCard's tilt (else a one-frame flash)
    card.mesh.scale.set(card.sphereScaleSX, card.sphereScaleSY, 1);
    card.hoverTarget = 0;
    card.hoverT = 0;
  }

  // Shortest signed yaw bringing a slot front-centre. Scale-invariant, so on the barrel it
  // depends only on the column — rotateStep relies on that.
  function yawDeltaToCenter(spherePos, fromYaw = sphereOrient.y, inside = false) {
    const cy = Math.cos(fromYaw);
    const sy = Math.sin(fromYaw);
    const px = spherePos.x * cy + spherePos.z * sy;
    const pz = -spherePos.x * sy + spherePos.z * cy;
    let deltaY = -Math.atan2(px, pz); // → +Z (near wall, camera outside)
    if (inside) deltaY += Math.PI; // → −Z (far wall, camera inside)
    return Math.atan2(Math.sin(deltaY), Math.cos(deltaY));
  }

  function cardCenterYawPitch(idx, pitchCap, yawOnly, inside = false) {
    const { spherePos } = cards[idx];
    const targetYaw = sphereOrient.y + yawDeltaToCenter(spherePos, sphereOrient.y, inside);
    if (yawOnly) return { targetYaw, targetPitch: sphereOrient.x };
    const h = Math.hypot(spherePos.x, spherePos.z);
    const pitchMag = Math.atan2(spherePos.y, h); // drives the card's height → centre
    const targetPitch = Math.max(-pitchCap, Math.min(pitchCap, inside ? -pitchMag : pitchMag));
    return { targetYaw, targetPitch };
  }

  function armNavNudge(kind, frames, targetX, targetY, targetZ) {
    navNudge.targetX = targetX;
    navNudge.targetY = targetY;
    navNudge.targetZ = targetZ;
    navNudge.startX = sphereOrient.x;
    navNudge.startY = sphereOrient.y;
    navNudge.startZ = sphereOrient.z;
    navNudge.frames = frames;
    navNudge.frame = reducedMotion ? frames : 0;
    navNudge.kind = kind;
    navNudge.active = true;
  }

  function centerModalCard(idx) {
    if (!cards[idx]) return;
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, Math.PI / 3, bp.YAW_ONLY);
    armNavNudge('modal', KEY_MODAL_FRAMES, targetPitch, targetYaw, sphereOrient.z);
  }

  // Ease to the next column BOUNDARY (never `y += pitch`); dir −1 = surface travels screen-left.
  function rotateStep(dir) {
    // Measure from where the last press is HEADED, so taps queue instead of re-targeting.
    const from = navNudge.active && navNudge.kind === 'rotate' ? navNudge.targetY : sphereOrient.y;
    const deltas = [];
    cards.forEach((card) => {
      // Mid-morph spherePos has no column structure yet — read the target.
      const slot = masonryMorph.active && card.morph ? card.morph.posTo : card.spherePos;
      const d = yawDeltaToCenter(slot, from);
      if (!deltas.some((seen) => Math.abs(seen - d) < COLUMN_EPS)) deltas.push(d);
    });
    if (!deltas.length) return;
    const deadzone = ((2 * Math.PI) / deltas.length) * ROTATE_DEADZONE;
    const ahead = deltas.filter((d) => d * dir > deadzone);
    if (!ahead.length) return; // one column: nothing to step to
    const delta = ahead.reduce((a, b) => (Math.abs(a) < Math.abs(b) ? a : b));
    armNavNudge('rotate', ROTATE_STEP_FRAMES, sphereOrient.x, from + delta, sphereOrient.z);
    drag.velX = 0;
    drag.velY = 0;
  }

  // Yaw/pitch solve + screen-Z roll that cancels a card's residual tilt, centring it on screen.
  function centerCardOnScreen(idx) {
    if (!cards[idx]) return;
    const { sphereQuat } = cards[idx];
    const inside = false;
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, KEY_PITCH_CAP, bp.YAW_ONLY, inside);
    // The card's world up at that (pitch, yaw), pre screen-roll.
    kbTargetEuler.set(targetPitch, targetYaw, 0);
    kbTargetQuat.setFromEuler(kbTargetEuler).multiply(sphereQuat);
    kbUp.set(0, 1, 0).applyQuaternion(kbTargetQuat);
    const rollTarget = Math.atan2(kbUp.x, kbUp.y); // screen-Z roll that returns up → +Y
    const dRoll = Math.atan2(
      Math.sin(rollTarget - sphereOrient.z),
      Math.cos(rollTarget - sphereOrient.z),
    );
    armNavNudge('browse', KEY_BROWSE_FRAMES, targetPitch, targetYaw, sphereOrient.z + dRoll);
    drag.velX = 0;
    drag.velY = 0;
  }

  // dx/dy: world-space delta this frame. ampOverride defaults to sqrt(scroll/drag speed ratio).
  function applyMotionCA(mesh, dx, dy, ampOverride, cap) {
    if (!CA_ENABLED) return;
    const { CARD_W_SPHERE, CARD_H_SPHERE } = bp;
    const s = cap !== undefined ? cap : bp.CA_MOTION_CAP;
    const sX = Math.max(mesh.scale.x, 0.01);
    const sY = Math.max(mesh.scale.y, 0.01);
    const dt = frameState.dtScale;
    const uvDX = dx / (CARD_W_SPHERE * sX * dt);
    const uvDY = dy / (CARD_H_SPHERE * sY * dt);
    const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const ampRaw = Math.min(1.0, dragSpeed / MAX_VEL);
    const amp = ampOverride !== undefined ? ampOverride : Math.sqrt(ampRaw);
    const rep = mesh.material.uniforms.uRepeat.value;
    const mx = Math.max(-s, Math.min(s, uvDX * amp)) * rep.x;
    const my = Math.max(-s, Math.min(s, uvDY * amp)) * rep.y;
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // Cover-crop + corner aspect for THIS frame's shape.
  const uvScratch = {};
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

  modal = createGlobeModal({
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
      const src = optimizeImgUrl(getCardMetadata(idx).img, modalCap);
      return loadModalTextureRaw(src, modalCap, onReady, onError);
    },
    getViewport: () => ({ W, H }),
    getBP: () => bp.name,
    getCardDims: () => ({ w: bp.CARD_W_SPHERE, h: bp.CARD_H_SPHERE }),
    cardAspect: CARD_ASPECT,
    getAntialias: () => (bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD),
    caEnabled: CA_ENABLED,
    cardLabel: labels.cardLabel,
    getReducedMotion: () => reducedMotion,
    sphereRotQuat,
    snapToSphereSlot: snapCardToSphereSlot,
    applySphereFacing,
    requestNavNudge: (idx) => {
      if (a11y && a11y.isBrowsing()) centerCardOnScreen(idx);
      else centerModalCard(idx);
    },
    applyMotionCA,
    restoreFocusOnClose: (idx) => { if (a11y && a11y.isBrowsing()) a11y.focusCard(idx); },
  });

  function readCssVars() {
    const rootStyle = getComputedStyle(root);
    const cssNum = (prop) => {
      const n = parseFloat(rootStyle.getPropertyValue(prop));
      return Number.isFinite(n) ? n : null;
    };
    const nav = cssNum('--gg-nav-h');
    if (nav !== null) navH = nav;
  }

  const measureViewportH = () => Math.max(1, worldEl.offsetHeight);

  function snapToBrowseView() {
    if (suppressFocusSnap) return;
    root.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  // Armed on blur/hidden, disarmed a frame after focus, so a tab-return can't re-snap.
  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => { requestAnimationFrame(() => { suppressFocusSnap = false; }); };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };

  const openModalAndDismissHint = (idx, x, y) => {
    hintRetired = true;
    modal.open(idx, x, y);
  };

  // Canvas taps only — the keyboard path reports itself.
  const openModalFromCanvas = (idx, x, y) => {
    openModalAndDismissHint(idx, x, y);
    if (modal.getModalIdx() >= 0) a11y?.trackCardOpen(idx);
  };

  const globeFormed = () => modal.getModalIdx() < 0;

  a11y = createGalleryA11y({
    q,
    getCount: () => CARD_CONTENT.length,
    cardOrder: AUTHORED_ORDER,
    getModalIdx: () => modal.getModalIdx(),
    isGlobeFormed: globeFormed,
    getCardLabel: (i) => {
      const m = getCardMetadata(i);
      return (m && m.alt) || `Image ${authoredNo(i)}`;
    },
    // A focus snap follows unless it is suppressed (tab-return): solve for where the camera lands.
    centerCard: (i) => centerCardOnScreen(i),
    openCard: (i) => openModalAndDismissHint(i, W / 2, H / 2),
    onFocus: snapToBrowseView,
    galleryInstructions: instructions,
    gid,
  });

  // Live to the pointer when globe is formed and no modal is open.
  const globeLive = globeFormed;

  controls = createGlobeControls({
    q,
    labels,
    getVisible: globeLive,
    getHintDismissed: () => hintRetired,
    rotate: (dir) => {
      hintRetired = true;

      rotateStep(dir);
    },
  });

  cursor = createCursor({
    getGlobeLive: globeLive,
    getCursorRetired: () => hintRetired || frameState.zoomT > CURSOR_ZOOM_RETIRE_T,
    labelText: hintText,
    drag,
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
    isCursorActive: () => cursor.isActive(),
    onDrag: () => { hintRetired = true; },
  });

  function computeFrame(now) {
    const nowMs = now || performance.now();
    const dtMs = frameInput.prevNow ? nowMs - frameInput.prevNow : FRAME_MS;
    frameInput.prevNow = nowMs;
    frameState.dtScale = Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));
    frameState.sphereFormT = 1;
    frameState.zoomT = 0;
    return frameState;
  }

  let appliedViewOffsetY = null; // W and H are baked into the call; null on any change to either
  function applyCentringOffset(sphereFormT) {
    const offY = (navH / 2) * sphereFormT;
    if (offY === appliedViewOffsetY) return;
    appliedViewOffsetY = offY;
    if (offY) camera.setViewOffset(W, H, 0, -offY, W, H);
    else camera.clearViewOffset();
  }

  function updateActiveCamera() {
    camera.position.z = bp.CAM_Z_SPHERE;
    applyCentringOffset(1);
    return camera;
  }

  // Refreshes sphereRotQuat; the rotation itself is applied per-card in updateCardTransform.
  function updateSphereRotation(frame) {
    const { dtScale } = frame;

    // Cancel browse's own tween so it stops fighting resumed auto-spin. A rotate press collapses
    // browse (focusout) in the same turn it arms its nudge — don't eat that.
    const browsing = a11y && a11y.isBrowsing();
    if (wasBrowsing && !browsing && navNudge.kind === 'browse') {
      navNudge.active = false;
    }
    wasBrowsing = browsing;

    if (navNudge.active) {
      navNudge.frame += dtScale;
      const e = easeInOutCubic(Math.min(1, navNudge.frame / navNudge.frames));
      sphereOrient.y = navNudge.startY + (navNudge.targetY - navNudge.startY) * e;
      sphereOrient.x = navNudge.startX + (navNudge.targetX - navNudge.startX) * e;
      sphereOrient.z = navNudge.startZ + (navNudge.targetZ - navNudge.startZ) * e;
      if (e >= 1) navNudge.active = false;
    }
    // frozen (modal open): holds its rotation. !interactive (still folding): no new drag and no
    // auto-spin, but inertia keeps coasting.
    const frozen = modal.getModalIdx() >= 0;
    // Consume the banked travel; anything but held-and-live drops it (no pooling on resume).
    const holding = drag.isDragging && !frozen;
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
      if (drag.isDragging) {
        // Held: position-driven off the (rate-limited) travel — no smoothing lag on normal frames.
        sphereOrient.y += stepX;
        sphereOrient.x += stepY;
      } else {
        // Released: velocity-driven coast.
        const friction = DRAG_FRICTION ** dtScale;
        drag.velX *= friction;
        drag.velY *= friction;
        // Ambient spin stays OUT of velX (a bias in it decays asymmetrically by direction).
        const spin = !reducedMotion && !browsing && !controls.isSpinPaused()
          ? AUTO_ROT_SPEED : 0;
        sphereOrient.y += (drag.velX + spin) * dtScale;
        sphereOrient.x += drag.velY * dtScale;
      }
      const RESTING_PITCH = Math.PI / 3;
      if (browsing) {
        sphereOrient.x = Math.max(-KEY_PITCH_CAP, Math.min(KEY_PITCH_CAP, sphereOrient.x));
        pitchReleaseCap = Math.max(RESTING_PITCH, Math.abs(sphereOrient.x)); // prime the glide
      } else {
        sphereOrient.x = Math.max(-pitchReleaseCap, Math.min(pitchReleaseCap, sphereOrient.x));
        const relax = PITCH_RELAX ** dtScale;
        if (pitchReleaseCap > RESTING_PITCH) {
          pitchReleaseCap = RESTING_PITCH + (pitchReleaseCap - RESTING_PITCH) * relax;
          if (pitchReleaseCap - RESTING_PITCH < 0.001) pitchReleaseCap = RESTING_PITCH;
        }
        // Upright roll relaxes to 0 over the same glide (so pitch + roll settle together).
        if (sphereOrient.z !== 0) {
          sphereOrient.z *= relax;
          if (Math.abs(sphereOrient.z) < 0.001) sphereOrient.z = 0;
        }
      }
    }

    let warpTarget = 0;
    if (!frozen) {
      const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
      const baseline = drag.isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
      warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + dragSpeed * SPHERE_DRAG_WARP_VEL);
    }
    sphereDragWarp += (warpTarget - sphereDragWarp) * (1 - (1 - SPHERE_DRAG_WARP_EASE) ** dtScale);
    if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;

    // Fast-path flag so the rotation math can be skipped when upright.
    const sphereRotActive = (sphereOrient.y !== 0 || sphereOrient.x !== 0 || sphereOrient.z !== 0);
    refreshSphereRotQuat();
    return sphereRotActive;
  }

  const ringWorld = new THREE.Vector3();
  const ringEdge = new THREE.Vector3();
  function updateA11yFocusRing() {
    const idx = a11y.getFocusedIdx();
    if (idx < 0 || !cards[idx] || !cards[idx].mesh) return;
    const { mesh } = cards[idx];
    mesh.getWorldPosition(ringWorld);
    if (camera.position.z - ringWorld.z <= 0.01) return; // behind/at the camera
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

  function renderScene(activeCamera) {
    renderer.render(scene, activeCamera);
    modal.render();
  }

  function placeSphereCard(card, mesh, frame) {
    const { sphereRotActive, sphGroupZ } = frame;
    mesh.visible = true;
    const hs = 1 + card.hoverT * HOVER_SCALE; // 1.0 → 1.08 on hover
    if (sphereRotActive) {
      mesh.position.copy(card.spherePos).applyQuaternion(sphereRotQuat);
    } else {
      mesh.position.copy(card.spherePos);
    }
    // Return early ONLY at depth ≤ 0 — a return leaves the transform stale, which scroll jitter
    // shows as a flash.
    const depth = camera.position.z - (sphGroupZ + mesh.position.z);
    if (depth <= 0) { mesh.visible = false; return; }
    // One band for the whole wall, so the order is purely by depth.
    const fadeEnd = cardVanishDepth();
    const fadeStart = bp.NEAR_FADE_START * fadeRefH;
    const proxFade = clamp01((depth - fadeEnd) / (fadeStart - fadeEnd));
    // Skip the DRAW, not the state updates, once fully faded.
    mesh.visible = proxFade > 0;
    mesh.scale.set(card.sphereScaleSX * hs, card.sphereScaleSY * hs, hs);
    applyCardFit(mesh, card);
    if (sphereRotActive) {
      mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(mesh);
    // Max dissolve, min opacity, so neither un-hides what the other hides.
    const proxDis = 1 - proxFade;
    const revealDis = 1 - card.revealT;
    mesh.material.opacity = Math.min(proxFade ** NEAR_FADE_OPACITY_BIAS, card.revealT);
    mesh.material.uniforms.uDissolve.value = Math.max(proxDis, revealDis);
    mesh.material.uniforms.uDisperse.value = proxDis ** NEAR_FADE_DISPERSE_RAMP;
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = proxFade;
    if (CA_ENABLED) {
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + sphereDragWarp;
    }
    // World delta approximated as depth × angular velocity.
    const dragDt = frameState.dtScale;
    applyMotionCA(
      mesh,
      card.spherePos.z * drag.velX * dragDt,
      -card.spherePos.z * drag.velY * dragDt,
    );
  }

  function applyCardOrder(card, mesh, frame) {
    let { z } = card.spherePos;
    if (frame.sphereRotActive) {
      tmpVec3.copy(card.spherePos).applyQuaternion(sphereRotQuat);
      z = tmpVec3.z;
    }
    const n = Math.max(-1, Math.min(1, z / bp.SPHERE_R));
    let order = CARD_ORDER_BASE + Math.round(n * CARD_ORDER_STEPS);
    if (n >= 0 && card.hoverT > 0.01) {
      order = CARD_ORDER_BASE + CARD_ORDER_STEPS + 1 + Math.round(card.hoverT * HOVER_ORDER_STEPS);
    }
    mesh.renderOrder = order;
  }

  function updateCardTransform(i, frame) {
    const { dtScale } = frame;
    const card = cards[i];
    const { mesh } = card;

    if (modal.isCardManaged(card)) return;

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

    if (!globeFormed() || reducedMotion) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * (1 - (1 - HOVER_RATE) ** dtScale);

    if (CA_ENABLED) {
      mesh.material.uniforms.uCA.value = card.hoverT * HOVER_CA
        + sphereDragWarp * SPHERE_DRAG_CA_MUL;
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP;
      if (card.hoverT > 0.01) {
        mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
      } else {
        mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
      }
    }

    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = 1;
    mesh.material.uniforms.uDissolve.value = 1 - card.revealT;
    mesh.material.uniforms.uDisperse.value = 0;

    placeSphereCard(card, mesh, frame);
    applyCardOrder(card, mesh, frame);
  }

  function updateCardTransforms(frame) {
    if (masonryMorph.active) {
      masonryMorph.t = Math.min(1, masonryMorph.t + MASONRY_MORPH_RATE * frame.dtScale);
    }
    for (let i = 0; i < bp.N_TOTAL; i += 1) updateCardTransform(i, frame);
    if (masonryMorph.active && masonryMorph.t >= 1) {
      masonryMorph.active = false;
      for (let i = 0; i < cards.length; i += 1) { if (cards[i]) cards[i].morph = null; }
      recomputeDragFlip(); // now that spherePos/sphereWorldH hold the final masonry values
    }
  }

  function updateHintExit(frame) {
    if (!hintRetired || hintExitT >= 1) return;
    hintExitT = Math.min(1, hintExitT + frame.dtScale * HINT_EXIT_RATE);
  }

  function updateClickDragText() {
    if (!textMesh) return;
    const { uniforms } = textMesh.material;
    textMesh.visible = hintExitT < 1;
    textMesh.scale.setScalar(1);
    uniforms.uOpacity.value = TEXT_OPACITY_RESTING;
    uniforms.uWarp.value = 0;
    uniforms.uZoom.value = 0;
    uniforms.uCA.value = 0;
    uniforms.uExitP.value = hintExitT;
  }

  function tick(now) {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const frame = computeFrame(now);

    a11y.updateTabStops();
    frame.activeCamera = updateActiveCamera();
    frame.sphereRotActive = updateSphereRotation(frame);
    modal.updateAnimation(frame.sphereRotActive, frame.dtScale);
    modal.updateDesktopNav();

    renderer.sortObjects = true;

    sphereGroup.position.z = 0;
    frame.sphGroupZ = 0;
    updateCardTransforms(frame);
    updateA11yFocusRing();
    updateHintExit(frame);

    updateClickDragText();
    cursor.update();
    interaction.applyCursor();
    controls.update();
    renderScene(frame.activeCamera);
  }

  let rafId = 0;
  function rafLoop(now) { tick(now); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() {
    if (rafId) return;
    frameInput.prevNow = 0; // re-baseline the frame clock; the parked gap isn't a dt
    rafId = requestAnimationFrame(rafLoop);
  }
  function stopTicker() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
    // Inertia can't coast while the loop is parked — retire it.
    drag.velX = 0; drag.velY = 0; drag.pendingX = 0; drag.pendingY = 0;
  }
  function syncTicker() {
    if (renderReady && onScreen) startTicker();
    else stopTicker();
  }

  const MAX_CONTEXT_REBUILDS = 4;
  const CONTEXT_STABLE_MS = 10000;
  const ctxLoss = { rebuilds: 0, stableTimer: 0, recovering: false, recoverTimer: 0 };
  function onContextLost(e) {
    e.preventDefault();
    if (ctxLoss.stableTimer) { clearTimeout(ctxLoss.stableTimer); ctxLoss.stableTimer = 0; }
    stopTicker();
    renderReady = false;
    window.lana?.log?.('firefly-globe: WebGL context lost', { tags: 'firefly-globe', severity: 'warn' });
  }
  function recoverFromContextLoss() {
    ctxLoss.recoverTimer = 0;
    ctxLoss.recovering = false;
    ctxLoss.rebuilds += 1;
    const collapsed = ctxLoss.rebuilds > MAX_CONTEXT_REBUILDS;
    window.lana?.log?.(
      collapsed
        ? 'firefly-globe: WebGL context keeps failing — collapsing'
        : 'firefly-globe: WebGL context restored — rebuilding',
      { tags: 'firefly-globe', severity: collapsed ? 'error' : 'info' },
    );
    // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
    destroy();
    // eslint-disable-next-line no-use-before-define -- same hoisted mutual ref
    if (collapsed || initRuntime() === false) {
      root.classList.add('firefly-globe-empty');
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
  function bindContextListeners(add) {
    const fn = add ? 'addEventListener' : 'removeEventListener';
    [q('.firefly-globe-canvas'), q('.firefly-globe-modal-canvas')].forEach((c) => {
      if (!c) return;
      c[fn]('webglcontextlost', onContextLost, false);
      c[fn]('webglcontextrestored', onContextRestored, false);
    });
  }

  let resizeHandler = null;
  let textRebuildTimer = 0;
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
  let intersectionObs = null; // IntersectionObserver gating the rAF loop on visibility
  let layoutWaitObs = null;
  function disconnectObservers() {
    [intersectionObs, layoutWaitObs].forEach((o) => o && o.disconnect());
    intersectionObs = null;
    layoutWaitObs = null;
  }
  let textureLoadGeneration = 0;

  function initRuntime() {
    const canvas = q('.firefly-globe-canvas');
    if (!canvas) return false;

    // See README (Zero-box gate).
    if (root.offsetHeight <= 0) {
      if (!layoutWaitObs) {
        layoutWaitObs = new ResizeObserver(() => {
          if (root.offsetHeight <= 0) return;
          layoutWaitObs.disconnect();
          layoutWaitObs = null;
          if (initRuntime() === false) root.classList.add('firefly-globe-empty');
        });
        layoutWaitObs.observe(root);
      }
      return undefined;
    }

    reducedMotion = prefersReducedMotion();
    root.classList.toggle('firefly-globe-reduced', reducedMotion);

    canvas.style.position = 'absolute';

    W = window.innerWidth;
    H = measureViewportH();

    const band = resolveBP(W);
    bp = resolveBpProfile(band.name, band.cfg, usesCylinderGeometry(band.name));

    try {
      const aa = bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, alpha: true });
    } catch (e) {
      renderer = null;
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
    camera.position.set(0, 0, bp.CAM_Z_SPHERE);
    camera.lookAt(0, 0, 0);
    appliedViewOffsetY = null;

    function doLayout({ fromResize = false } = {}) {
      readCssVars();
      const nextW = window.innerWidth;
      const nextH = measureViewportH();
      if (fromResize && nextW === W && nextH === H) return;
      W = nextW;
      H = nextH;
      appliedViewOffsetY = null;

      // A band crossing or RM toggle rebuilds (geometry is baked at build time); resizing
      // within a band takes the cheap path.
      const nextBand = resolveBP(W);
      const nextReducedMotion = prefersReducedMotion();
      if (nextBand.name !== bp.name || nextReducedMotion !== reducedMotion) {
        // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
        destroy();
        if (initRuntime() === false) root.classList.add('firefly-globe-empty');
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
      // Deferred only while off-screen.
      if (textMesh) {
        clearTimeout(textRebuildTimer);
        textRebuildTimer = 0;
        if (textMesh.visible) {
          buildTextMesh();
        } else {
          textRebuildTimer = setTimeout(() => {
            textRebuildTimer = 0;
            if (textMesh) buildTextMesh();
          }, TEXT_REBUILD_DEBOUNCE_MS);
        }
      }
    }
    doLayout();
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

    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObs = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        syncTicker();
      });
      intersectionObs.observe(root);
    }

    interaction.setup(canvas);
    if (!bp.CYLINDER && !reducedMotion) cursor.setup(canvas);
    root.classList.toggle('firefly-globe-barrel', bp.CYLINDER);

    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    modal.setup();

    buildCards();

    if (!bp.CYLINDER) buildTextMesh();
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
      card.srcAspect = srcAspect; // modal falls back to this when no texture aspect is known
      // md sizes per-card in place; sm re-solves its packing in onDone.
      if (!bp.CYLINDER) updateCardSphereSizing(card, srcAspect);
      card.hasTexture = true; // revealT eases up in updateCardTransform
    };
    const onDoneTextures = (loadedTextures, loadedAspects) => {
      if (loadGeneration !== textureLoadGeneration) {
        loadedTextures.forEach((t) => t && t.dispose());
        return;
      }
      textures = loadedTextures;
      cardAspects = loadedAspects;
      if (bp.CYLINDER) resolveMasonryLayout(); // recomputeDragFlip runs when the morph settles
      else recomputeDragFlip();
    };
    const cardMaxTexH = bp.name === 'sm' ? CARD_TEX_SM : CARD_TEX_MD;
    loadCardTextures({
      count: bp.N_TOTAL,
      // Ask at the cap, by HEIGHT, matching fitCardDims.
      getSrc: (i) => optimizeImgUrl(getCardMetadata(i).img, cardMaxTexH, 'height'),
      maxTexH: cardMaxTexH,
    }, onEachTexture, onDoneTextures);
    return true;
  }

  function destroy() {
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
    if (textRebuildTimer) { clearTimeout(textRebuildTimer); textRebuildTimer = 0; }
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
    masonryMorph.active = false; masonryMorph.t = 0;
    fadeRefH = 0;
    cards = [];
    textures = [];
    cardAspects = [];
    disposeTextMesh();
    hintRetired = false;
    hintExitT = 0;
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; sphereGroup = null;
    modal.destroy();
    a11y.teardown();
    frameInput.prevNow = 0;
    // The closure survives a rebuild, so a pre-rebuild tilt would carry over.
    resetSphereOrientation();
    sphereDragWarp = 0;
    drag.isDragging = false;
    drag.velX = 0; drag.velY = 0; drag.pendingX = 0; drag.pendingY = 0;
    wasBrowsing = false;
    // NOTE: `bp` intentionally NOT cleared — doLayout compares it, initRuntime overwrites it.
  }

  return { init: initRuntime, destroy };
}

export default async function init(el) {
  if (prefersReducedMotion()) {
    el.classList.add('firefly-globe-reduced');
  }

  // Before buildGlobeDom() wipes the children.
  const { hintText, touchHint, instructions, labels, fragmentHref } = parseAuthoredContent(el);

  const gid = buildGlobeDom(el, labels, { touchHint });

  const authored = fragmentHref ? await fetchFragmentCards(fragmentHref) : null;
  if (!authored || authored.length === 0) {
    el.classList.add('firefly-globe-empty');
    return el;
  }
  const runtime = createGlobeGalleryRuntime(
    scatterCards(authored),
    hintText,
    instructions,
    el,
    gid,
    labels,
  );
  if (!runtime) { el.classList.add('firefly-globe-empty'); return el; }
  if (runtime.init() === false) { el.classList.add('firefly-globe-empty'); return el; }
  el.globeRuntime = runtime;

  const removalObserver = new MutationObserver(() => {
    if (document.contains(el)) return;
    runtime.destroy();
    removalObserver.disconnect();
  });
  removalObserver.observe(document.body, { childList: true, subtree: true });

  return el;
}
