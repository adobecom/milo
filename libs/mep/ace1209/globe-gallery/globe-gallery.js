import * as THREE from './three.module.min.js';
import { parseAuthoredContent, fetchFragmentCards, buildGlobeDom, optimizeImgUrl } from './src/authoring.js';
import {
  createCardMaterial, createTextMaterial, createPlaceholderTexture,
  loadCardTextures, loadModalTexture as loadModalTextureRaw, createClickDragTexture,
} from './src/materials.js';
import createGalleryA11y from './src/a11y.js';
import createGlobeModal from './src/modal.js';
import createInteraction from './src/interaction.js';
import createCursor from './src/cursor.js';
import createGlobeControls from './src/controls.js';
import {
  easeOutCubic, easeInOutCubic, lerpN, coverFit,
  buildArcCtx, getFanData, cssToWorld, rotateArcPoint, arcCamZ,
} from './src/math.js';
import * as TL from './src/timeline.js';

const CARD_ASPECT = 456 / 631; // portrait

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Two render profiles split at 768px (Milo sm↔md); resolved once via resolveBP(W).
const BREAKPOINTS = {
  md: {
    minWidth: 768,
    N_MAX: 0,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 6.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 65,
    CAM_Z_END: -60,
    GRID_COLS: 9,
    GRID_ROWS: 5,
    // 0 = cards face radially outward (true sphere). See applyCardFacing.
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    ARC_DENSE_FRACTION: 0.6, // share of cards clustered into the off-screen arc flank
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking — see dragSensitivity
  },
  sm: {
    minWidth: 0,
    N_MAX: 24,
    ARC_SPAN: 3.6,
    SPHERE_R: 16,
    CARD_H_SPHERE: 11.0, // sm: only the PlaneGeometry base (masonry sets visible size)
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    GRID_COLS: 3,
    GRID_ROWS: 8,
    // Shape keys unreachable on sm (always cylinder); kept for the uniform contract.
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    ARC_DENSE_FRACTION: 0,
    CYL_COLS_FIT: 0.65, // phone-only override of the shared wall-height dial
    DRAG_GEARING: 0.53, // geared down from 1:1 — the phone barrel is small on screen
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

// Card caps are on texture HEIGHT (fitCardDims); modal caps are on the longest side.
const CARD_TEX_SM = 256;
const CARD_TEX_MD = 768;
const MODAL_TEX_SM = 768;
const MODAL_TEX_MD = 2048;
const ANTIALIAS_SM = false;
const ANTIALIAS_MD = true;
const GLOBAL_CA_SM = false;
const GLOBAL_CA_MD = true;

// Shape overlay for yaw-only drags (touch / narrow): a cylindrical masonry wall replaces the
// Fibonacci sphere.
const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_GAP_RATIO: 0.20, // inter-card gap as a fraction of card width
  // Guard on the LAID-OUT aspect; past it the fit crops. See README (yaw-only) before lowering.
  CYL_ASPECT_CAP: 1.9,
  CYL_BULGE: 0.18, // barrel bulge: r = R·(1 − bulge·t²); keep ≤~0.2 or edges overlap
  CARD_FACE_CAMERA: 0.1, // limb polish; costs barrel smoothness — read the README before raising
};

// True on the sm band OR a coarse primary pointer (matchMedia-less = precise).
function usesCylinderGeometry(bandName) {
  if (bandName === 'sm') return true;
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

// Scroll-timing constants live in src/timeline.js.
const ARC_STAGGER = 0.594;

// Reduced motion: shrink the static desktop sphere so the whole ball fits (sm left at 1).
const RM_GLOBE_SCALE_MD = 0.9;

const TEXT_REBUILD_DEBOUNCE_MS = 150;

// Grid peel / fold.
const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width
// fanT boundary: low-i cards cluster below it off-screen and peel first.
const ARC_DENSE_SPLIT = 0.50;

// Drag / auto-rotation. MAX_VEL is shared with interaction.js (it clamps, core normalizes).
// FRICTION and AUTO_ROT_SPEED are authored per 60fps frame and rescaled by frame.dtScale.
const DRAG_FRICTION = 0.94;
const MAX_VEL = 0.08; // rad per 60fps frame (×60·180/π for °/s): ceiling on a flick AND a held step
const DRAG_CATCHUP = 0.5; // share of an over-max backlog worked off per 60fps frame (jerk limiter)
const AUTO_ROT_SPEED = 0.0005; // ambient yaw RATE per 60fps frame (NOT an increment into velX)
// Browse-only pitch cap (drag stops at the resting cap); excess eases back at PITCH_RELAX.
const KEY_PITCH_CAP = (85 * Math.PI) / 180;
const PITCH_RELAX = 0.85;
// Frame counts for the sphere-centring tweens: browse slow (anti-dizziness), modal faster.
const KEY_BROWSE_FRAMES = 90;
const KEY_MODAL_FRAMES = 20;
const ROTATE_STEP_FRAMES = 34;
const ROTATE_DEADZONE = 0.15;
const COLUMN_EPS = 1e-6;
const RING_TANHALF = Math.tan(Math.PI / 6); // tan(30°) — projects a card for the focus ring

// Chromatic aberration.
const CA_ENABLED = true; // master kill switch
const CA_STRENGTH = 0.012; // radial UV shift per channel (bell-curve at transition peaks)
const CA_MOTION_STRENGTH = 1.0; // directional UV shift max — peel / fold / sphere / modal
const CA_MOTION_STRENGTH_ARC = 0.04; // softer clamp while cards sit on the arc
const SCROLL_VEL_MAX = 14; // px/frame scroll speed that saturates the motion trail
const CA_PX_MAX = 4; // max vertical pixel shift for the global canvas SVG filter

// Hover (sphere phase only) — settles in/out, no continuous animation.
const HOVER_CA = 0.025; // CA bump composed additively onto transition CA
const HOVER_WARP = 0.4; // barrel-distortion amount sent to shader
const HOVER_SCALE = 0.25; // scale multiplier added: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target

// Progressive texture reveal: per-card un-dissolve once its photo lands. See buildCards + onEach.
const REVEAL_RATE = 0.06; // per-frame reveal ease
// One-time masonry (sm barrel) reflow after all textures load, if the barrel is already formed.
const MASONRY_MORPH_RATE = 0.05; // per-frame ease of the position/scale morph

// Near-camera proximity fade, in card-heights of depth.
const FACING_EDGE_ON_BAND = 0.25; // |normal.z| half-width of the facing fade-out band
const DRAG_FLIP_MAX_CAM_FRAC = 0.95; // ceiling on dragFlipZ as a fraction of CAM_Z_SPHERE
const NEAR_FADE_START = 2.5; // depth where the fade begins
const NEAR_FADE_END = 1.6; // depth at which the card is fully transparent
const NEAR_FADE_OPACITY_BIAS = 0.4; // exponent on the prox opacity ramp (< 1 = fade out later)
const NEAR_FADE_DISPERSE_RAMP = 0.9; // exponent on uDisperse, applied here not in the shader

// Sphere-drag warp: baseline while dragging + velocity burst that decays via DRAG_FRICTION.
const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value

// "Click & Drag" hint text (WebGL plane behind the sphere).
const TEXT_BEHIND_GAP = 15; // world units behind the sphere's back surface
const TEXT_WARP_ENTER_MAX = 4.50; // uWarp at entrance
const TEXT_OPACITY_PEAK = 0.15; // opacity at peak fade-in
const TEXT_OPACITY_RESTING = 0.06; // settled opacity once the sphere is formed
const TEXT_CA_DIR_STRENGTH = 0.05; // uMotionDir strength for drag CA on the text
const TEXT_CA_WARP_MUL = 1.5; // warp-driven CA boost
const TEXT_DRAG_WARP_MUL = 3.0; // text drag-warp vs sphere cards — more violent
const TEXT_WARP_OVERFLOW = 0.6; // extra mesh scale per warp unit — letterforms bleed off

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
// Cylindrical masonry layout — a WHOLE-SET solve; returns { pos, w, h } per card.
// See README (yaw-only geometry) for the packing + column-count rules.
function cylinderMasonryLayout({
  aspects, radius, frustumH, colsFit, gapRatio, aspectCap, bulge = 0,
}) {
  const n = aspects.length;
  // Clamp extremes so one panorama can't dominate a column (cover-crop handles the rest).
  const clamped = aspects.map((ar) => {
    const a = Number.isFinite(ar) && ar > 0 ? ar : 1;
    return Math.max(1 / aspectCap, Math.min(aspectCap, a));
  });

  // Pack into `cols` columns; returns the per-column running heights + placements.
  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + gapRatio);
    const gap = cardW * gapRatio;
    const colH = new Array(cols).fill(0);
    const placed = new Array(n);
    // Tallest-first (longest-processing-time heuristic) — balances columns to ~1.05.
    const order = Array.from({ length: n }, (unused, i) => i)
      .sort((a, b) => clamped[a] - clamped[b]); // ascending aspect = descending height
    for (let k = 0; k < n; k += 1) {
      const i = order[k];
      const h = cardW / clamped[i];
      // Shortest column wins → balanced totals.
      let best = 0;
      for (let c = 1; c < cols; c += 1) if (colH[c] < colH[best]) best = c;
      placed[i] = { col: best, offset: colH[best], w: cardW, h };
      colH[best] += h + gap;
    }
    // Trailing gap isn't part of the occupied height.
    const totals = colH.map((h) => Math.max(0, h - gap));
    return { placed, totals, wallH: Math.max(...totals) };
  };

  // Fewest columns that fit. Upper bound n: one card per column always fits comfortably.
  let packed = null;
  for (let cols = Math.min(4, n); cols <= Math.max(4, n); cols += 1) {
    packed = pack(cols);
    if (packed.wallH <= frustumH * colsFit) break;
  }

  const cols = packed.totals.length;
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1]. Azimuth is untouched.
  const wallH = packed.wallH || 1;
  return packed.placed.map((p, i) => {
    // Centre each column's own stack vertically (reads as masonry, not a ragged edge).
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
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, 1 - (2 * i) / total)));
  const azimuth = GOLDEN_ANGLE * i;
  return new THREE.Vector3(
    radius * Math.sin(polarAngle) * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    radius * Math.sin(polarAngle) * Math.sin(azimuth),
  );
}

// Factory returning { init, destroy }. All DOM lookups are scoped to `root` so >1 globe can
// coexist; `gid` is this instance's unique-id suffix (CA filter url(#…) ref).
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

  // bp.N_TOTAL is clamped to the authored count, so i is always in range (no modulo wrap).
  function getCardMetadata(i) {
    return CARD_CONTENT[i];
  }

  let reducedMotion = false;

  // Frozen, constant within a band; rebuilt on a crossing. null until initRuntime runs.
  let bp = null;

  // Resolve a band's cfg into the active profile (pure, frozen). `cylinder` picks the shape keys.
  function resolveBpProfile(name, cfg, cylinder) {
    // N_TOTAL follows the authored count, capped only where a band sets N_MAX (sm: 24).
    const nTotal = cfg.N_MAX > 0
      ? Math.min(CARD_CONTENT.length, cfg.N_MAX)
      : CARD_CONTENT.length;
    if (cfg.N_MAX > 0 && CARD_CONTENT.length > cfg.N_MAX) {
      window.lana?.log?.(
        `globe-gallery: ${CARD_CONTENT.length} cards authored, rendering the first ${cfg.N_MAX} at breakpoint "${name}"`,
        { tags: 'globe-gallery', severity: 'info' },
      );
    }
    const shape = cylinder ? YAW_ONLY_GEOMETRY : cfg;
    // PlaneGeometry base; on the masonry path each mesh is scaled to its solved w/h.
    const sphereCardH = cfg.CARD_H_SPHERE;
    return Object.freeze({
      name,
      YAW_ONLY: cylinder, // compared in doLayout to detect a pointer-precision change
      GLOBAL_CA: name === 'sm' ? GLOBAL_CA_SM : GLOBAL_CA_MD,
      N_TOTAL: nTotal,
      N_VISIBLE: nTotal, // all cards on arc simultaneously (no conveyor)
      ARC_SPAN: cfg.ARC_SPAN,
      SPHERE_R: cfg.SPHERE_R,
      CARD_H_SPHERE: sphereCardH,
      CARD_W_SPHERE: sphereCardH * CARD_ASPECT,
      CARD_W_ARC: cfg.CARD_W_ARC,
      CAM_Z_SPHERE: cfg.CAM_Z_SPHERE,
      CAM_Z_END: cfg.CAM_Z_END,
      // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
      FOLD_SPHERE_DIST: Math.round(cfg.SPHERE_R / (0.35 * Math.tan(Math.PI / 6))),
      GRID_COLS: cfg.GRID_COLS,
      GRID_ROWS: cfg.GRID_ROWS,
      // Shape keys listed explicitly (not spread) so the overlay's layout keys can't leak on.
      CARD_FACE_CAMERA: shape.CARD_FACE_CAMERA,
      CYLINDER: !!shape.CYLINDER,
      // A band may override the shared wall-height dial to contain its own near face (sm does).
      CYL_COLS_FIT: cfg.CYL_COLS_FIT !== undefined ? cfg.CYL_COLS_FIT : shape.CYL_COLS_FIT,
      CYL_GAP_RATIO: shape.CYL_GAP_RATIO,
      CYL_ASPECT_CAP: shape.CYL_ASPECT_CAP,
      CYL_BULGE: shape.CYL_BULGE,
      // Frustum height at the cylinder's centre plane — the column solve's vertical budget.
      CYL_FRUSTUM_H: 2 * Math.tan(Math.PI / 6) * cfg.CAM_Z_SPHERE,
      CARD_ROLL_JITTER: cfg.CARD_ROLL_JITTER,
      DRAG_GEARING: cfg.DRAG_GEARING,
      // Share of the count (count-independent), clamped so the spread keeps ≥1 card.
      ARC_DENSE_COUNT: Math.min(
        Math.round(cfg.ARC_DENSE_FRACTION * nTotal),
        Math.max(0, nTotal - 1),
      ),
    });
  }

  let renderer; let scene; let camera; let cameraOrtho; let
    sphereGroup;
  let cards = [];
  // Cards + meshes are built up front (with contours); textures fill in progressively via onEach.
  let textures = [];
  let cardAspects = []; // per-card native image aspect (index-aligned with CARD_CONTENT)
  let placeholderTex = null; // shared transparent texture for not-yet-loaded cards
  // One-time sm-barrel reflow once all aspects are known (masonry packing is a whole-set solve).
  const masonryMorph = { active: false, t: 0 };
  let gridCardW = 0; let
    gridTilts = [];

  // Persistent clock context + input. The single source for the clocks — never cache them.
  const frameState = TL.createFrame();
  const frameInput = TL.createFrameInput();

  let blockDocTop = 0; // block's top in document space (the scroll runway)
  let blockHeight = 0; // its full scroll length
  // zoomT the camera clears the shell's far wall at; from the geometry (see
  // publishPqAppearZoomT). TWO consumers: the pull-quote's reveal and the globe controls' hide.
  let pqAppearZoomT = 0.5;
  let formationVh = 0; // from --gg-formation-vh (see readCssVars)
  let W = 0;
  let H = 0;

  const worldEl = q('.globe-gallery-world');
  const pqEl = q('.globe-gallery-pullquote');
  let pqShown = false;

  let caFilterR = null; // SVG feOffset element for red channel
  let caFilterB = null; // SVG feOffset element for blue channel
  let globalCaFilterOn = false; // whether canvas.style.filter currently holds the CA url
  // Cached node + last-written style strings (DOM writes only on change).
  const arcCopy = { el: null, opStr: '', transformStr: '' };

  // Shared by reference with interaction.js: pendingX/Y = exact unapplied travel (rad), velX/Y =
  // smoothed velocity per 60fps frame. See README (Drag physics).
  const drag = { isDragging: false, velX: 0, velY: 0, pendingX: 0, pendingY: 0 };
  let renderReady = false;
  let onScreen = true; // assume visible until the observer's first callback corrects it
  let sphereDragWarp = 0;
  let cameraInsideSphere = false;
  let dragFlipZ = 0; // camera z at which drag inverts; set in buildCards
  let fadeRefH = 0; // wall-wide card height the near-camera fade bands off; recomputeDragFlip
  // "Click & Drag" hint text mesh (built async, null until fonts load) + one-way exit progress.
  let textMesh = null;
  let textExitProgress = 0;

  // x = pitch, y = yaw, z = keyboard-uprighting roll. Applied MANUALLY per card (sphereGroup
  // .rotation stays identity); sphereRotQuat is rebuilt each frame and shared into modal.js by
  // reference. Euler order 'XYZ' is load-bearing — see README (Sphere rotation).
  const sphereOrient = { x: 0, y: 0, z: 0 };
  // Pitch cap that glides ±85°→±60° when leaving browse (see updateSphereRotation).
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
  const foldRotQuat = new THREE.Quaternion();
  // Scratch quat/euler for the fold's residual peel-spin (reused per card, per frame).
  const stageQuat = new THREE.Quaternion();
  const stageEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const tmpVec3 = new THREE.Vector3();
  const fanScratch = {};
  const wpScratch = {};
  const stageScratch = {};

  // Sphere-to-card alignment tween.
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
  // Back to the upright resting orientation. Does NOT touch drag velocity or sphereDragWarp.
  function resetSphereOrientation() {
    sphereOrient.x = 0;
    sphereOrient.y = 0;
    sphereOrient.z = 0;
    pitchReleaseCap = Math.PI / 3;
    navNudge.active = false;
  }
  // Scratch for applyCardFacing (reused per card, per frame — never retained).
  const cardNormal = new THREE.Vector3();
  const facingTarget = new THREE.Vector3();
  const facingAlign = new THREE.Quaternion();
  const facingPartial = new THREE.Quaternion();
  // Never-mutated identity, used to slerp a partial card-facing rotation out of.
  const IDENTITY_QUAT = new THREE.Quaternion();

  let modal = null;
  let a11y = null;
  let interaction = null;
  let cursor = null;
  let controls = null;

  // Suppresses the focus→snap-scroll while the tab is backgrounded (pdf-space pattern).
  let suppressFocusSnap = false;

  let arcCtx = null; // current arc context, rebuilt per frame in tick() via buildArcCtx

  // GRID_COLS/ROWS are NOMINAL (size, gap, origin) so adding cards never shifts placed ones.
  function computeGridLayout() {
    if (cards.length === 0) return;
    const { GRID_COLS, GRID_ROWS, CARD_W_SPHERE } = bp;
    // md: cards fill viewport width (gaps overflow by design). sm: fit grid exactly, no overflow.
    gridCardW = (bp.name === 'sm')
      ? W / (GRID_COLS + (GRID_COLS - 1) * GRID_GAP_RATIO)
      : W / GRID_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const totalW = GRID_COLS * gridCardW + (GRID_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    // Column-major: i=0 → lower-right, sweeping bottom-to-top then right-to-left.
    for (let i = 0; i < cards.length; i += 1) {
      const col = GRID_COLS - 1 - Math.floor(i / GRID_ROWS);
      const row = GRID_ROWS - 1 - (i % GRID_ROWS);
      const gx = -totalW / 2 + col * (gridCardW + gridGap) + gridCardW / 2;
      const gy = totalH / 2 - row * (gridCardH + gridGap) - gridCardH / 2;
      const tilt = gridTilts[i] || 0;
      cards[i].gridPos = new THREE.Vector3(gx, gy, 0);
      cards[i].gridScale = gridCardW / CARD_W_SPHERE;
      cards[i].gridTilt = tilt;
      cards[i].gridQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, tilt));
      cards[i].gridCol = col;
      cards[i].gridRow = row;
    }
  }

  // Native aspect of card i's image; the portrait placeholder until its texture decodes.
  function cardAspect(i) {
    return cardAspects[i] || CARD_ASPECT;
  }

  function buildCards() {
    const {
      N_TOTAL, N_VISIBLE, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE, GRID_COLS, GRID_ROWS,
      CARD_ROLL_JITTER, CYLINDER,
    } = bp;
    if (!placeholderTex) placeholderTex = createPlaceholderTexture();
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    // Reduced motion (desktop): shrink the static sphere to fit (see RM_GLOBE_SCALE_MD).
    if (reducedMotion && bp.name !== 'sm') sphereGroup.scale.setScalar(RM_GLOBE_SCALE_MD);
    cards = [];

    // Masonry is a whole-set solve, run ONCE before the per-card loop. Null on the sphere path.
    const masonry = CYLINDER
      ? cylinderMasonryLayout({
        aspects: Array.from({ length: N_TOTAL }, (unused, i) => cardAspect(i)),
        radius: SPHERE_R,
        frustumH: bp.CYL_FRUSTUM_H,
        colsFit: bp.CYL_COLS_FIT,
        gapRatio: bp.CYL_GAP_RATIO,
        aspectCap: bp.CYL_ASPECT_CAP,
        bulge: bp.CYL_BULGE,
      })
      : null;

    for (let i = 0; i < N_TOTAL; i += 1) {
      const srcAspect = cardAspect(i);
      // Masonry solves absolute world w/h; convert to scale factors against the shared geometry.
      const mas = masonry ? masonry[i] : null;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      const mat = createCardMaterial({
        // Contour until this card's photo lands (onEach swaps in the real texture).
        texture: textures[i] || placeholderTex,
        aspect: CARD_ASPECT, // arc/grid start shape; per-phase stages update uAspect
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = N_VISIBLE - i;
      sphereGroup.add(mesh);

      const sp = mas
        ? mas.pos.clone()
        : fibSpherePos(i, N_TOTAL, SPHERE_R);

      // Face outward: masonry along its surface normal, sphere at the origin. lookAt target is
      // INSIDE the surface so local +Z points out.
      const faceTarget = mas
        ? sp.clone().sub(mas.normal)
        : new THREE.Vector3(0, 0, 0);
      const m = new THREE.Matrix4()
        .lookAt(sp, faceTarget, new THREE.Vector3(0, 1, 0));
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
      // No roll on the masonry path (columns lining up IS the effect).
      const rz = CYLINDER ? 0 : (Math.random() - 0.5) * CARD_ROLL_JITTER;
      sq.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz));

      cards.push({
        mesh,
        spherePos: sp,
        sphereQuat: sq,
        gridPos: new THREE.Vector3(),
        gridScale: 1,
        gridTilt: 0,
        gridQuat: new THREE.Quaternion(),
        gridCol: GRID_COLS - 1 - Math.floor(i / GRID_ROWS),
        gridRow: GRID_ROWS - 1 - (i % GRID_ROWS),
        peelJitter: Math.random(),
        // The only per-card texture value stored; every phase's fit derives from it.
        srcAspect,
        // Sphere-phase scale: native aspect, or the masonry's solved world size as a scale.
        sphereScaleSX: mas ? mas.w / CARD_W_SPHERE : srcAspect / CARD_ASPECT,
        sphereScaleSY: mas ? mas.h / CARD_H_SPHERE : 1,
        // ACTUAL rendered world height: on masonry CARD_H_SPHERE is only the geometry base.
        sphereWorldH: mas ? mas.h : CARD_H_SPHERE,
        hoverT: 0, // eased 0→1 hover progress (sphere phase only)
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
        hasTexture: !!textures[i], // false until this card's photo loads (onEach flips it)
        revealT: textures[i] ? 1 : 0, // eased 0→1 texture-ready un-dissolve
      });
    }
    // eslint-disable-next-line no-use-before-define -- hoisted helper defined just below
    recomputeDragFlip();

    // Seed per-card random tilts once so they stay stable across resize.
    gridTilts = [];
    for (let ti = 0; ti < N_TOTAL; ti += 1) {
      gridTilts.push((Math.random() - 0.5) * 0.175); // ±5° in radians
    }
    computeGridLayout();
  }

  // Camera z below which drag inverts, anchored to where cards VANISH so the flip lands with the
  // dissolve; also sets fadeRefH. Recomputed once textures land (sphereWorldH is a placeholder).
  function recomputeDragFlip() {
    if (!sphereGroup || cards.length === 0) return;
    const groupScale = sphereGroup.scale.x || 1;
    const maxRadial = cards.reduce(
      (m, c) => Math.max(m, Math.hypot(c.spherePos.x, c.spherePos.z)),
      0,
    ) * groupScale;
    fadeRefH = cards.reduce((s, c) => s + c.sphereWorldH, 0) / cards.length;
    // Clamped below the zoom-start distance so the flip stays inside the zoom-through.
    dragFlipZ = Math.min(
      maxRadial + NEAR_FADE_END * fadeRefH * groupScale,
      bp.CAM_Z_SPHERE * DRAG_FLIP_MAX_CAM_FRAC,
    );
  }

  // Sphere-phase sizing from the loaded aspect (non-masonry). Read live each frame, so writing
  // these morphs the card into its native shape.
  function updateCardSphereSizing(card, srcAspect) {
    card.srcAspect = srcAspect;
    card.sphereScaleSX = srcAspect / CARD_ASPECT;
    card.sphereScaleSY = 1;
    card.sphereWorldH = bp.CARD_H_SPHERE;
  }

  // sm barrel: re-solve the whole-set packing once every aspect is known; each card morphs to its
  // final slot. See README (progressive texture reveal).
  function resolveMasonryLayout() {
    const { N_TOTAL, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE } = bp;
    const masonry = cylinderMasonryLayout({
      aspects: Array.from({ length: N_TOTAL }, (unused, i) => cardAspect(i)),
      radius: SPHERE_R,
      frustumH: bp.CYL_FRUSTUM_H,
      colsFit: bp.CYL_COLS_FIT,
      gapRatio: bp.CYL_GAP_RATIO,
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

  // World-space size of the hint-text plane: fills the frustum at the text's resting depth.
  function textPlaneSize() {
    const { SPHERE_R, CAM_Z_SPHERE } = bp;
    const dist = CAM_Z_SPHERE - (-(SPHERE_R + TEXT_BEHIND_GAP));
    const visH = 2 * Math.tan(Math.PI / 6) * dist; // fov=60 → half-angle 30°
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

  // Build (or rebuild) the text plane. Async: waits for fonts so it renders in Adobe Clean.
  function buildTextMesh() {
    disposeTextMesh();
    const targetGroup = sphereGroup;
    const aspect = camera ? camera.aspect : W / H;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const create = () => {
      if (sphereGroup !== targetGroup || !sphereGroup) return;
      const { SPHERE_R } = bp;
      const sz = textPlaneSize();
      const mat = createTextMaterial({
        texture: createClickDragTexture(aspect, hintText),
        aspect,
        resolution: { x: W * dpr, y: H * dpr },
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(sz.w, sz.h), mat);
      mesh.position.set(0, 0, -(SPHERE_R + TEXT_BEHIND_GAP));
      mesh.renderOrder = -1; // behind the sphere cards
      mesh.visible = false; // the tick stage reveals it once the fold is underway
      textMesh = mesh;
      sphereGroup.add(mesh);
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(create).catch(create);
    } else {
      create();
    }
  }

  // Tilts limb cards partway toward the camera (edge-on legibility); mutates the quat in place.
  // Target is sign(n.z) × view dir so back cards keep facing away; k=0 is a no-op.
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
    // Partial rotation toward that target, then compose onto the orientation.
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

  // Shared solve: the yaw + pitch bringing card `idx` to screen centre (yawOnly holds pitch — a
  // cylinder can't centre vertically). Inside the globe both flip to the far wall.
  // Shortest signed yaw that brings a slot front-centre. Scale-invariant, so on the barrel it
  // depends only on azimuth — i.e. only on the column. rotateStep relies on that.
  function yawDeltaToCenter(spherePos, fromYaw = sphereOrient.y) {
    const cy = Math.cos(fromYaw);
    const sy = Math.sin(fromYaw);
    const px = spherePos.x * cy + spherePos.z * sy;
    const pz = -spherePos.x * sy + spherePos.z * cy;
    let deltaY = -Math.atan2(px, pz); // → +Z (near wall, camera outside)
    if (cameraInsideSphere) deltaY += Math.PI; // → −Z (far wall, camera inside)
    return Math.atan2(Math.sin(deltaY), Math.cos(deltaY));
  }

  function cardCenterYawPitch(idx, pitchCap, yawOnly) {
    const { spherePos } = cards[idx];
    const targetYaw = sphereOrient.y + yawDeltaToCenter(spherePos);
    if (yawOnly) return { targetYaw, targetPitch: sphereOrient.x };
    const h = Math.hypot(spherePos.x, spherePos.z);
    const pitchMag = Math.atan2(spherePos.y, h); // drives the card's height → centre
    const inside = cameraInsideSphere;
    const targetPitch = Math.max(-pitchCap, Math.min(pitchCap, inside ? -pitchMag : pitchMag));
    return { targetYaw, targetPitch };
  }

  function centerModalCard(idx) {
    if (!cards[idx]) return;
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, Math.PI / 3, bp.YAW_ONLY);
    navNudge.targetY = targetYaw;
    navNudge.targetX = targetPitch;
    navNudge.targetZ = sphereOrient.z; // no roll change — keep the globe level
    navNudge.startY = sphereOrient.y;
    navNudge.startX = sphereOrient.x;
    navNudge.startZ = sphereOrient.z;
    navNudge.frames = KEY_MODAL_FRAMES;
    navNudge.frame = reducedMotion ? KEY_MODAL_FRAMES : 0;
    navNudge.kind = 'modal';
    navNudge.active = true;
  }

  // One rotate-button press: ease to the next column BOUNDARY (never `y += pitch`), dir −1 = the
  // surface travels screen-left. Pitch/roll pinned. See README (Globe controls).
  function rotateStep(dir) {
    // Measure from where the last press is HEADED, not where we are, so taps queue instead of
    // re-targeting the boundary already in flight (which made a double-tap slower than a single).
    const from = navNudge.active && navNudge.kind === 'rotate' ? navNudge.targetY : sphereOrient.y;
    const deltas = [];
    cards.forEach((card) => {
      // Mid-morph spherePos is a per-frame lerp with no column structure yet — read the target.
      const slot = masonryMorph.active && card.morph ? card.morph.posTo : card.spherePos;
      const d = yawDeltaToCenter(slot, from);
      if (!deltas.some((seen) => Math.abs(seen - d) < COLUMN_EPS)) deltas.push(d);
    });
    if (!deltas.length) return;
    // Skip a boundary we're already on, else ambient drift eats the press.
    const deadzone = ((2 * Math.PI) / deltas.length) * ROTATE_DEADZONE;
    const ahead = deltas.filter((d) => d * (cameraInsideSphere ? -dir : dir) > deadzone);
    if (!ahead.length) return; // one column: nothing to step to
    const delta = ahead.reduce((a, b) => (Math.abs(a) < Math.abs(b) ? a : b));
    navNudge.targetY = from + delta;
    navNudge.targetX = sphereOrient.x;
    navNudge.targetZ = sphereOrient.z;
    navNudge.startY = sphereOrient.y;
    navNudge.startX = sphereOrient.x;
    navNudge.startZ = sphereOrient.z;
    navNudge.frames = ROTATE_STEP_FRAMES;
    navNudge.frame = reducedMotion ? ROTATE_STEP_FRAMES : 0;
    navNudge.kind = 'rotate';
    navNudge.active = true;
    // Kill residual spin (auto-rotate/drag inertia) so it can't fight the ease.
    drag.velX = 0;
    drag.velY = 0;
  }

  // Keyboard-gallery centring (a11y.js's centerCard): the shared yaw/pitch solve plus the
  // screen-Z roll that cancels the card's residual tilt. See README (Accessibility).
  function centerCardOnScreen(idx) {
    if (!cards[idx]) return;
    const { sphereQuat } = cards[idx];
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, KEY_PITCH_CAP, bp.YAW_ONLY);
    // Roll: the card's world up at that (pitch, yaw), pre screen-roll; cancel its screen tilt.
    kbTargetEuler.set(targetPitch, targetYaw, 0);
    kbTargetQuat.setFromEuler(kbTargetEuler).multiply(sphereQuat);
    kbUp.set(0, 1, 0).applyQuaternion(kbTargetQuat);
    const rollTarget = Math.atan2(kbUp.x, kbUp.y); // screen-Z roll that returns up → +Y
    const dRoll = Math.atan2(
      Math.sin(rollTarget - sphereOrient.z),
      Math.cos(rollTarget - sphereOrient.z),
    );
    navNudge.targetY = targetYaw;
    navNudge.targetX = targetPitch;
    navNudge.targetZ = sphereOrient.z + dRoll; // shortest-path roll
    navNudge.startY = sphereOrient.y;
    navNudge.startX = sphereOrient.x;
    navNudge.startZ = sphereOrient.z;
    navNudge.frames = KEY_BROWSE_FRAMES;
    navNudge.frame = reducedMotion ? KEY_BROWSE_FRAMES : 0;
    navNudge.kind = 'browse';
    navNudge.active = true;
    // Kill residual spin (auto-rotate/drag inertia) so it can't fight the ease.
    drag.velX = 0;
    drag.velY = 0;
  }

  // Motion-trail CA. dx/dy: world-space delta this frame. ampOverride defaults to
  // max(scroll velocity, drag speed).
  function applyMotionCA(mesh, dx, dy, ampOverride, strength) {
    if (!CA_ENABLED) return;
    const { CARD_W_SPHERE, CARD_H_SPHERE } = bp;
    const s = strength !== undefined ? strength : CA_MOTION_STRENGTH;
    const sX = Math.max(mesh.scale.x, 0.01);
    const sY = Math.max(mesh.scale.y, 0.01);
    const uvDX = dx / (CARD_W_SPHERE * sX);
    const uvDY = dy / (CARD_H_SPHERE * sY);
    const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const amp = ampOverride !== undefined
      ? ampOverride
      : Math.min(1.0, Math.max(frameState.scrollVel / SCROLL_VEL_MAX, dragSpeed / MAX_VEL));
    const mx = Math.max(-s, Math.min(s, uvDX * amp));
    const my = Math.max(-s, Math.min(s, uvDY * amp));
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // Cover-crop + corner aspect for THIS frame's shape. See README (Architecture notes).
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

  // Modal DI module — assigned after the helpers its callbacks depend on.
  modal = createGlobeModal({
    q,
    getScene: () => scene,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    getRenderer: () => renderer,
    getCards: () => cards,
    getCount: () => CARD_CONTENT.length,
    getCardMetadata,
    // Sharper texture for the opened card. Returns the pending Image (cancellable), or null when
    // the base cap already meets the modal cap.
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

  // Block top in document space + full scroll length.
  function measureBlock() {
    blockDocTop = root.getBoundingClientRect().top + window.scrollY;
    blockHeight = root.offsetHeight;
  }

  // Reads the runway props. See README (CSS is the source of truth).
  function readCssVars() {
    const rootStyle = getComputedStyle(root);
    const cssNum = (prop) => {
      const n = parseFloat(rootStyle.getPropertyValue(prop));
      return Number.isFinite(n) ? n : null;
    };
    const vh = cssNum('--gg-formation-vh');
    if (vh !== null) formationVh = vh;
  }

  const measureViewportH = () => Math.max(1, worldEl.offsetHeight);

  // The quote's cue is a place in the scene, not a scroll number: the zoomT the camera clears the
  // shell's far wall at, so it can never land while cards are still in frame. Cards mount radially,
  // so the deepest one sits hypot(R, half its in-plane extent) back. Published to CSS — see README.
  function publishPqAppearZoomT() {
    const halfExtent = bp.CYLINDER
      ? bp.CARD_W_SPHERE / 2
      : Math.hypot(bp.CARD_W_SPHERE, bp.CARD_H_SPHERE) / 2;
    const clearZ = -Math.hypot(bp.SPHERE_R, halfExtent);
    pqAppearZoomT = TL.zoomTAtCamZ(clearZ, bp.CAM_Z_SPHERE, bp.CAM_Z_END);
    root.style.setProperty('--gg-pq-appear-t', pqAppearZoomT.toFixed(4));
  }

  // Scroll px from the block top where the sphere is formed. See README (Scroll model).
  function formedScrollPx() {
    return Math.min((formationVh / 100) * H, blockHeight);
  }

  // Focus snaps the page to the interactive globe state, deferred a frame so focus settles.
  function snapToInteractive() {
    if (suppressFocusSnap) return;
    const top = reducedMotion
      ? blockDocTop
      : blockDocTop + formedScrollPx();
    requestAnimationFrame(() => {
      if (window.lenis?.scrollTo) window.lenis.scrollTo(top, { force: true, immediate: true });
      else window.scrollTo(0, top);
    });
  }

  // Guard: armed on blur/hidden, disarmed a frame after focus, so a tab-return can't re-snap.
  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => { requestAnimationFrame(() => { suppressFocusSnap = false; }); };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };

  // Open a card + retire the hint: textExitProgress → 1 (past both cursor thresholds).
  const openModalAndDismissHint = (idx, x, y) => {
    textExitProgress = 1;
    modal.open(idx, x, y);
  };

  // Canvas taps only — the keyboard path reports itself. See README (Analytics).
  const openModalFromCanvas = (idx, x, y) => {
    openModalAndDismissHint(idx, x, y);
    if (modal.getModalIdx() >= 0) a11y?.trackCardOpen(idx);
  };

  a11y = createGalleryA11y({
    q,
    getCount: () => bp.N_TOTAL,
    getSphereFormT: () => frameState.sphereFormT,
    getModalIdx: () => modal.getModalIdx(),
    interactiveThreshold: TL.SPHERE_INTERACTIVE_T,
    getCardLabel: (i) => {
      const m = getCardMetadata(i);
      return (m && m.alt) || `Image ${i + 1}`;
    },
    // Browse-image focus → rotate the globe so that image is centred on screen.
    centerCard: centerCardOnScreen,
    // Enter on a browse image → open the detail modal for that image, warp from centre.
    openCard: (i) => openModalAndDismissHint(i, W / 2, H / 2),
    onFocus: snapToInteractive,
    galleryInstructions: instructions,
    gid,
  });

  // Created before interaction so isActive() can gate its hover-cursor writes (shared canvas).
  cursor = createCursor({
    getCanvas: () => (renderer ? renderer.domElement : null),
    getSphereInteractive: () => frameState.sphereFormT >= TL.SPHERE_INTERACTIVE_T,
    getModalOpen: () => modal.getModalIdx() >= 0,
    getReducedMotion: () => reducedMotion,
    // Two-step exit on drag activity; scrolling out collapses both steps
    getHintDismissed: () => textExitProgress > TL.CURSOR_DRAG_DISMISS_T
      || frameState.zoomT > TL.CURSOR_ZOOM_RETIRE_T,
    getCursorRetired: () => textExitProgress > TL.CURSOR_DRAG_RETIRE_T
      || frameState.zoomT > TL.CURSOR_ZOOM_RETIRE_T,
    labelText: hintText,
    drag,
  });

  controls = createGlobeControls({
    q,
    labels,
    getVisible: () => frameState.sphereFormT >= TL.SPHERE_INTERACTIVE_T
      && frameState.zoomT < pqAppearZoomT
      && modal.getModalIdx() < 0,
    rotate: rotateStep,
  });

  // Rad per pointer px, live off the viewport + band. See README (Drag physics)
  const dragSensitivity = () => {
    const radiusPx = (bp.SPHERE_R * H) / bp.CYL_FRUSTUM_H;
    return ((Math.PI / 2) * bp.DRAG_GEARING) / Math.max(1, radiusPx);
  };

  interaction = createInteraction({
    getRenderer: () => renderer,
    getCamera: () => camera,
    getCards: () => cards,
    getModalIdx: () => modal.getModalIdx(),
    openModal: (idx, x, y) => openModalFromCanvas(idx, x, y),
    getSphereFormT: () => frameState.sphereFormT,
    getDragSensitivity: dragSensitivity,
    interactiveThreshold: TL.SPHERE_INTERACTIVE_T,
    maxVel: MAX_VEL,
    drag,
    isCursorActive: () => cursor.isActive(),
    // Pitch follows geometry, not pointer type: the barrel (bp.YAW_ONLY) is yaw-only for mouse too.
    getYawOnly: () => bp.YAW_ONLY,
  });

  // Per-frame pipeline: computeFrame builds one `frameState`, producer stages write back onto it.
  // Stage order is load-bearing — see README (Module layout).

  // Refresh the derivation's input from live layout/scroll state, then derive onto frameState.
  function computeFrame() {
    frameInput.scrollY = window.scrollY;
    frameInput.reducedMotion = reducedMotion;
    frameInput.blockDocTop = blockDocTop;
    frameInput.blockHeight = blockHeight;
    frameInput.formPx = formedScrollPx();
    frameInput.viewportH = H;
    frameInput.arcScale = bp.CARD_W_ARC / bp.CARD_W_SPHERE;
    frameInput.now = performance.now();
    TL.deriveFrame(frameState, frameInput);
    frameInput.prevLenisY = frameState.lenisY;
    frameInput.prevNow = frameInput.now;
    return frameState;
  }

  // Pick + position the camera: ortho on the arc, perspective from the fold on. See README
  // (Lifecycle timeline).
  function updateActiveCamera(frame) {
    const { sphereFormT, zoomT } = frame;
    const { CAM_Z_SPHERE, CAM_Z_END } = bp;
    let activeCamera;
    const camZArc = arcCamZ(H);
    if (sphereFormT === 0) {
      activeCamera = cameraOrtho;
      camera.position.z = camZArc;
      camera.updateProjectionMatrix();
    } else {
      activeCamera = camera;
      // easeInCubic matches the zoom's easeOutCubic. Apparent size is held by sphereGroup.z.
      const camZ = zoomT === 0
        ? lerpN(camZArc, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
        : lerpN(CAM_Z_SPHERE, CAM_Z_END, easeOutCubic(zoomT));
      camera.position.z = camZ;
      camera.updateProjectionMatrix();
    }
    // Flip the drag once the camera is INSIDE; the threshold is dragFlipZ, not SPHERE_R.
    cameraInsideSphere = zoomT > 0 && Math.abs(camera.position.z) < dragFlipZ;
    return activeCamera;
  }

  // Drag inertia + auto-rotate + nav-nudge + drag-warp. Returns sphereRotActive and refreshes
  // sphereRotQuat; the rotation itself is applied per-card in updateCardTransform.
  function updateSphereRotation(frame) {
    const { sphereFormT, dtScale } = frame;
    sphereGroup.rotation.x = 0;
    sphereGroup.rotation.y = 0;

    // Leaving browse: cancel browse's own tween so it stops fighting resumed auto-spin. A rotate
    // press collapses browse (focusout) in the same turn it arms its nudge — don't eat that.
    const browsing = a11y && a11y.isBrowsing();
    if (wasBrowsing && !browsing && navNudge.kind === 'browse') {
      navNudge.active = false;
    }
    wasBrowsing = browsing;

    // Card-alignment tween. Runs while the modal is open too (the sphere aligns behind the blur).
    if (navNudge.active) {
      navNudge.frame += 1;
      const e = easeInOutCubic(Math.min(1, navNudge.frame / navNudge.frames));
      sphereOrient.y = navNudge.startY + (navNudge.targetY - navNudge.startY) * e;
      sphereOrient.x = navNudge.startX + (navNudge.targetX - navNudge.startX) * e;
      sphereOrient.z = navNudge.startZ + (navNudge.targetZ - navNudge.startZ) * e;
      if (e >= 1) navNudge.active = false;
    }
    // frozen (modal open): sphere holds its rotation. !interactive (still folding): no new drag and
    // no auto-spin, but inertia keeps coasting. See README (Drag physics).
    const frozen = modal.getModalIdx() >= 0;
    const interactive = sphereFormT >= TL.SPHERE_INTERACTIVE_T;
    // Consume the banked travel; anything but held-and-live drops it (no pooling on resume).
    const holding = drag.isDragging && !frozen && interactive;
    let stepX = 0;
    let stepY = 0;
    if (holding) {
      // Jerk limiter: under one frame's worth of rotation passes through exactly, past it the step
      // is capped then eased and the rest stays banked. See README (Drag physics).
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
      const dragDir = cameraInsideSphere ? -1 : 1;
      // Yaw (y) spins freely; pitch (x) is clamped below so the globe self-levels.
      if (drag.isDragging) {
        // Held: position-driven off the (rate-limited) travel — no smoothing lag on normal frames.
        sphereOrient.y += stepX * dragDir;
        sphereOrient.x += stepY * dragDir;
        if (!interactive) { drag.velX = 0; drag.velY = 0; } // inert mid-fold: must not fling
      } else {
        // Released: velocity-driven coast. Both rates are per 60fps frame → rescaled by dtScale.
        const friction = DRAG_FRICTION ** dtScale;
        drag.velX *= friction;
        drag.velY *= friction;
        // Ambient spin stays OUT of velX (a bias in it decays asymmetrically by direction).
        const spin = interactive && !reducedMotion && !(a11y && a11y.isBrowsing())
          && !controls.isSpinPaused()
          ? AUTO_ROT_SPEED : 0;
        sphereOrient.y += (drag.velX + spin) * dtScale * dragDir;
        sphereOrient.x += drag.velY * dtScale * dragDir;
      }
      // pitchReleaseCap glides the browse cap back to the resting one.
      const RESTING_PITCH = Math.PI / 3;
      if (browsing) {
        sphereOrient.x = Math.max(-KEY_PITCH_CAP, Math.min(KEY_PITCH_CAP, sphereOrient.x));
        pitchReleaseCap = Math.max(RESTING_PITCH, Math.abs(sphereOrient.x)); // prime the glide
      } else {
        sphereOrient.x = Math.max(-pitchReleaseCap, Math.min(pitchReleaseCap, sphereOrient.x));
        if (pitchReleaseCap > RESTING_PITCH) {
          pitchReleaseCap = RESTING_PITCH + (pitchReleaseCap - RESTING_PITCH) * PITCH_RELAX;
          if (pitchReleaseCap - RESTING_PITCH < 0.001) pitchReleaseCap = RESTING_PITCH;
        }
        // Upright roll relaxes to 0 over the same glide (so pitch + roll settle together).
        if (sphereOrient.z !== 0) {
          sphereOrient.z *= PITCH_RELAX;
          if (Math.abs(sphereOrient.z) < 0.001) sphereOrient.z = 0;
        }
      }
    }

    // Drag warp: baseline while held + velocity burst, EASED toward the target, never snapped.
    let warpTarget = 0;
    if (!frozen && interactive) {
      const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
      const baseline = drag.isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
      warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + dragSpeed * SPHERE_DRAG_WARP_VEL);
    }
    sphereDragWarp += (warpTarget - sphereDragWarp) * 0.20;
    if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;

    // Full reset (orientation + inertia) only at the very top — a dip mid-scroll keeps both.
    if (sphereFormT < TL.SPHERE_ORIENT_RESET_T) {
      resetSphereOrientation();
      drag.velX = 0;
      drag.velY = 0;
    }

    // sphereRotActive is a fast-path flag so the rotation math can be skipped when upright.
    const sphereRotActive = (sphereOrient.y !== 0 || sphereOrient.x !== 0 || sphereOrient.z !== 0);
    refreshSphereRotQuat();
    return sphereRotActive;
  }

  // Project the focused browse image to screen space so a11y.js's ring hugs it (closed-form).
  const ringWorld = new THREE.Vector3();
  function updateA11yFocusRing() {
    const idx = a11y.getFocusedIdx();
    if (idx < 0 || !cards[idx] || !cards[idx].mesh) return;
    const { mesh } = cards[idx];
    mesh.getWorldPosition(ringWorld);
    const viewZ = camera.position.z - ringWorld.z; // distance in front of the camera
    if (viewZ <= 0.01) return; // behind/at the camera — nothing sensible to draw
    const groupScale = sphereGroup.scale.x;
    const halfWWorld = 0.5 * bp.CARD_W_SPHERE * mesh.scale.x * groupScale;
    const halfHWorld = 0.5 * bp.CARD_H_SPHERE * mesh.scale.y * groupScale;
    // Half the frustum's world height/width at this depth (fov 60° → tan(30°) = TANHALF).
    const halfViewH = viewZ * RING_TANHALF;
    const halfViewW = halfViewH * (W / H);
    const cx = ((ringWorld.x / halfViewW) * 0.5 + 0.5) * W;
    const cy = ((-ringWorld.y / halfViewH) * 0.5 + 0.5) * H;
    const wPx = (halfWWorld / halfViewW) * W;
    const hPx = (halfHWorld / halfViewH) * H;
    a11y.setFocusRect(cx, cy, wPx, hPx);
  }

  // Canvas visibility — instantly shown once the section approaches (arc motion is the reveal).
  function updateCanvasVisibility(frame) {
    const { lenisY, zoomT } = frame;
    const canvas = renderer.domElement;
    // Reduced motion: canvas is in normal flow (scrolls away, clips naturally) — just reveal once.
    if (reducedMotion) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      return;
    }
    const showTrigger = blockDocTop - H * TL.ENTRY_LEAD_VH; // matches entryStart in computeFrame
    if (lenisY < showTrigger || zoomT >= TL.CANVAS_HIDE_ZOOM_T) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }
  }

  // JS only adds .is-active past pqAppearZoomT; CSS sticky handles the exit.
  function updatePullQuote(frame) {
    const { zoomT, scrollingDown } = frame;
    // Reduced motion: CSS owns it (opacity:1, no reveal) — no JS toggling.
    if (reducedMotion) return;
    if (pqEl) {
      if (zoomT >= pqAppearZoomT && !pqShown) {
        pqEl.style.transition = ''; // restore CSS default (0.45s, set in .css)
        pqShown = true;
        pqEl.classList.add('is-active');
      } else if (zoomT < pqAppearZoomT && pqShown) {
        if (!scrollingDown) {
          pqEl.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        }
        pqShown = false;
        pqEl.classList.remove('is-active');
      }
    }
  }

  // Slides sphereGroup forward over the fold (cards not yet on the sphere subtract sphGroupZ).
  // Must run at sphereFormT===0 too, for continuity — see README (Architecture notes).
  function updateSphereGroupDepth(frame) {
    const { sphereFormT, zoomT } = frame;
    const { FOLD_SPHERE_DIST, CAM_Z_SPHERE } = bp;
    const sphereFormT3 = sphereFormT * sphereFormT * sphereFormT;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT3);
    // Expose for the hint-text stage (its plane scale tracks the live camera↔sphere distance).
    frame.foldSphDist = foldSphDist;
    const sphGroupZ = zoomT === 0 ? (camera.position.z - foldSphDist) : 0;
    sphereGroup.position.z = sphGroupZ;
    return sphGroupZ;
  }

  // Canvas-wide CA filter: vertical R/B shift tracks scroll velocity, cleared on settle.
  function updateGlobalCA() {
    if (!bp.GLOBAL_CA) {
      if (globalCaFilterOn) {
        renderer.domElement.style.filter = '';
        globalCaFilterOn = false;
      }
      return;
    }
    if (CA_ENABLED && caFilterR) {
      const canvas = renderer.domElement;
      const scrollVelNorm = Math.min(1.0, frameState.scrollVel / SCROLL_VEL_MAX);
      const globalCA = scrollVelNorm * CA_PX_MAX;
      if (globalCA > 0.05) {
        caFilterR.setAttribute('dx', '0');
        caFilterR.setAttribute('dy', (-globalCA).toFixed(2));
        caFilterB.setAttribute('dx', '0');
        caFilterB.setAttribute('dy', (globalCA * 0.5).toFixed(2));
        // Write the filter string only on the off→on edge (the feOffset attrs carry the rest).
        if (!globalCaFilterOn) {
          canvas.style.filter = `url(#ca-filter-${gid})`;
          globalCaFilterOn = true;
        }
      } else if (globalCaFilterOn) {
        canvas.style.filter = '';
        globalCaFilterOn = false;
      }
    }
  }

  function updateArcCopy(frame) {
    if (!arcCopy.el) return;
    const arcCopyInE = easeOutCubic(Math.min(1, frame.arcCopyEntryT / TL.ARC_COPY_IN_ENTRY_T));
    const arcCopyOutT = Math.max(0, Math.min(
      1,
      (frame.progress - TL.ARC_COPY_OUT_START) / (TL.ARC_COPY_OUT_END - TL.ARC_COPY_OUT_START),
    ));
    const arcCopyOutE = easeInOutCubic(arcCopyOutT);
    const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
    const arcCopySlide = 24 * (1 - arcCopyInE);
    const opStr = arcCopyOp.toFixed(3);
    const transformStr = `translateY(${arcCopySlide.toFixed(1)}px)`;
    if (opStr !== arcCopy.opStr) { arcCopy.el.style.opacity = opStr; arcCopy.opStr = opStr; }
    if (transformStr !== arcCopy.transformStr) {
      arcCopy.el.style.transform = transformStr;
      arcCopy.transformStr = transformStr;
    }
  }

  // Draw the main scene, plus the modal card on its own canvas when active.
  function renderScene(activeCamera) {
    renderer.render(scene, activeCamera);
    modal.render();
  }

  // One phase branch per card per frame: arc → peel → grid-dwell → fold → sphere.

  // Branch: fully in sphere.
  function placeSphereCard(card, mesh, cardCA, frame) {
    const { sphereRotActive, sphGroupZ } = frame;
    mesh.visible = true;
    const hs = 1 + card.hoverT * HOVER_SCALE; // 1.0 → 1.08 on hover
    // Manual sphere-drag rotation: world position = R × spherePos (group rotation is identity).
    if (sphereRotActive) {
      mesh.position.copy(card.spherePos).applyQuaternion(sphereRotQuat);
    } else {
      mesh.position.copy(card.spherePos);
    }
    // Prox fade by depth in front of the lens. Return early ONLY at depth ≤ 0 — a return leaves the
    // transform stale, which scroll jitter shows as a flash.
    const depth = camera.position.z - (sphGroupZ + mesh.position.z);
    if (depth <= 0) { mesh.visible = false; return; }
    // One band for the whole wall (fadeRefH), so the order is purely by depth. See README.
    const fadeEnd = NEAR_FADE_END * fadeRefH;
    const fadeStart = NEAR_FADE_START * fadeRefH;
    const proxFade = Math.max(0, Math.min(1, (depth - fadeEnd) / (fadeStart - fadeEnd)));
    // Skip the DRAW (not the state updates) once fully faded. See README (near-camera dissolve).
    mesh.visible = proxFade > 0;
    mesh.scale.set(card.sphereScaleSX * hs, card.sphereScaleSY * hs, hs);
    applyCardFit(mesh, card);
    if (sphereRotActive) {
      mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(mesh);
    mesh.renderOrder = 0;
    // Prox fade + texture reveal both drive dissolve/opacity: max dissolve, min opacity, so
    // neither un-hides what the other hides.
    const proxDis = 1 - proxFade;
    const revealDis = 1 - card.revealT;
    mesh.material.opacity = Math.min(proxFade ** NEAR_FADE_OPACITY_BIAS, card.revealT);
    mesh.material.uniforms.uDissolve.value = Math.max(proxDis, revealDis);
    mesh.material.uniforms.uDisperse.value = proxDis ** NEAR_FADE_DISPERSE_RAMP;
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = proxFade;
    // Hover uniforms come from updateCardTransform; this phase only adds the drag warp.
    if (CA_ENABLED) {
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + sphereDragWarp;
    }
    // CA smear: approximate world delta as depth × angular velocity (front cards smear more).
    applyMotionCA(mesh, card.spherePos.z * drag.velX, -card.spherePos.z * drag.velY);
  }

  // Branch: grid → sphere fold, lerping from the live `stage` transform by fdE.
  function placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame) {
    const { sphereRotActive } = frame;
    mesh.visible = true;
    // Sphere endpoint is fully rotated; the lerp itself unwinds it. fdE=0 cards fall through.
    let sX; let sY; let sZ;
    if (sphereRotActive) {
      tmpVec3.copy(card.spherePos).applyQuaternion(sphereRotQuat);
      sX = tmpVec3.x; sY = tmpVec3.y; sZ = tmpVec3.z;
    } else {
      sX = card.spherePos.x; sY = card.spherePos.y; sZ = card.spherePos.z;
    }
    mesh.position.set(
      lerpN(stage.x, sX, fdE),
      lerpN(stage.y, sY, fdE),
      lerpN(stage.z, sZ, fdE),
    );
    // Hover lands before the fold ends, so scale for it here too or the card pops at fdE 1.
    // Both axes, so applyCardFit's aspect is unchanged.
    const hs = 1 + card.hoverT * HOVER_SCALE;
    mesh.scale.set(
      lerpN(stage.scale, card.sphereScaleSX, fdE) * hs,
      lerpN(stage.scale, card.sphereScaleSY, fdE) * hs,
      1,
    );
    applyCardFit(mesh, card); // reads the scale set just above, so the fold framing stays exact
    // Slerp gridQuat → sphereQuat (the UPRIGHT grid quat, not the live peel spin), then reapply
    // the residual peel spin about local Z. Both are load-bearing.
    if (sphereRotActive) {
      foldRotQuat.copy(sphereRotQuat).multiply(card.sphereQuat);
      mesh.quaternion.slerpQuaternions(card.gridQuat, foldRotQuat, fdE);
    } else {
      mesh.quaternion.slerpQuaternions(card.gridQuat, card.sphereQuat, fdE);
    }
    const residualZ = stage.rotZ - card.gridTilt;
    if (residualZ !== 0) {
      stageQuat.setFromEuler(stageEuler.set(0, 0, residualZ));
      mesh.quaternion.multiply(stageQuat); // local-Z (in-plane) spin, post-multiply
    }
    // Blend the facing tilt in by fdE so it lands continuous with placeSphereCard.
    applyCardFacing(mesh, fdE);
    mesh.renderOrder = 0;
    mesh.material.opacity = 1;
    applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  // Branch: fully in grid (dwell phase).
  function placeGridCard(card, mesh, i, prevMeshX, prevMeshY, frame) {
    const { sphGroupZ } = frame;
    const { N_TOTAL } = bp;
    mesh.visible = true;
    mesh.position.set(card.gridPos.x, card.gridPos.y, card.gridPos.z - sphGroupZ);
    mesh.scale.setScalar(card.gridScale);
    applyCardFit(mesh, card, CARD_ASPECT);
    mesh.quaternion.copy(card.gridQuat);
    mesh.renderOrder = N_TOTAL - i;
    mesh.material.opacity = 1;
    applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  // The card's live transform on the arc→grid continuum at peel ease gpE (0 = arc, 1 = grid).
  // Serves the arc/peel render AND the origin of the fold lerp.
  function computeCardStage(card, i, gpE, frame) {
    const { arcPanT, entryRot, entryYOffset, arcScale, sphGroupZ } = frame;
    const { N_VISIBLE, ARC_DENSE_COUNT } = bp;
    const slot = i; // no conveyor: all cards on arc simultaneously
    const rawT = Math.max(0, Math.min(1, slot / Math.max(1, N_VISIBLE - 1)));
    // Non-uniform fanT split (see ARC_DENSE_SPLIT): cluster low-i off-screen, spread the rest.
    const splitR = ARC_DENSE_COUNT / Math.max(1, N_VISIBLE - 1);
    let fanT;
    if (rawT < splitR) {
      fanT = (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT;
    } else {
      fanT = ARC_DENSE_SPLIT
           + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
    }
    const fan = getFanData(fanT, arcCtx, fanScratch);
    const arcDelay = fanT * ARC_STAGGER;
    const arcLocalT = Math.max(
      0,
      Math.min(1, (arcPanT - arcDelay) / Math.max(0.01, 1 - ARC_STAGGER)),
    );
    const arcLocalE = easeInOutCubic(arcLocalT);
    const pxPushed = fan.px + fan.rx * 60 * arcLocalE;
    const pyPushed = fan.py + fan.ry * 60 * arcLocalE;
    const wp = entryRot > 0.001
      ? rotateArcPoint(pxPushed, pyPushed, entryRot, arcCtx, W, H, wpScratch)
      : cssToWorld(pxPushed, pyPushed, W, H, wpScratch);
    const arcY = wp.y - entryYOffset;
    const webglRot = -fan.cssRot - entryRot;

    // peelStartRot: first peel frame's rotation, normalized within ±π of gridTilt. Direct z-angle
    // lerp, NOT slerp — see README (Architecture notes).
    if (gpE <= 0) {
      card.peelStartRot = null;
    } else if (card.peelStartRot == null) {
      let startRot = webglRot;
      while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
      while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
      card.peelStartRot = startRot;
    }

    stageScratch.slot = slot;
    stageScratch.x = lerpN(wp.x, card.gridPos.x, gpE);
    stageScratch.y = lerpN(arcY, card.gridPos.y, gpE);
    stageScratch.z = lerpN(-sphGroupZ, card.gridPos.z - sphGroupZ, gpE);
    stageScratch.scale = lerpN(arcScale, card.gridScale, gpE);
    stageScratch.rotZ = card.peelStartRot == null
      ? webglRot
      : card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
    return stageScratch;
  }

  // Branch: arc phase. Render order + motion-CA strength differ once the peel starts.
  function placeArcCard(card, mesh, i, gpE, stage, prevMeshX, prevMeshY) {
    const { N_TOTAL, N_VISIBLE } = bp;
    mesh.visible = true;
    applyCardFit(mesh, card, CARD_ASPECT); // first phase a card renders in — must fit here too
    mesh.position.set(stage.x, stage.y, stage.z);
    mesh.scale.setScalar(stage.scale);
    mesh.rotation.set(0, 0, stage.rotZ);
    mesh.material.opacity = 1;
    if (gpE <= 0) {
      mesh.renderOrder = N_VISIBLE - Math.round(stage.slot);
      applyMotionCA(
        mesh,
        mesh.position.x - prevMeshX,
        mesh.position.y - prevMeshY,
        undefined,
        CA_MOTION_STRENGTH_ARC,
      );
    } else {
      mesh.renderOrder = N_TOTAL + N_VISIBLE - i;
      applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
    }
  }

  // Per-card dispatcher: derive timing (peel/fold easings, CA, hover), then run one branch.
  function updateCardTransform(i, frame) {
    const { progress, gridFormT, gpWin, sphereFormT, entryRot } = frame;
    const { N_TOTAL } = bp;
    const card = cards[i];
    const { mesh } = card;

    // Skip cards the modal manages (active card + swipe-neighbors) — modal.js drives them.
    if (modal.isCardManaged(card)) return;

    // Advance the reveal + the one-time masonry morph, both BEFORE the branch reads them.
    if (card.hasTexture && card.revealT < 1) {
      card.revealT = Math.min(1, card.revealT + REVEAL_RATE);
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

    // Arc → grid peel stagger: i-based cascade + per-card jitter.
    const baseDelay = (i / Math.max(1, N_TOTAL - 1)) * TL.GRID_PEEL_STAGGER;
    const jitter = (card.peelJitter - 0.5) * TL.ARC_PEEL_JITTER;
    const gpDelay = Math.max(0, Math.min(TL.GRID_PEEL_STAGGER, baseDelay + jitter));
    const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
    const gpE = easeOutCubic(gpLocalT);

    // Fold gate is the RAW peel localT vs FOLD_START_LOCAL_T, not the eased gpE.
    const foldStartProg = TL.cardFoldStartProgress(gpDelay);
    const fdLocalT = Math.max(0, Math.min(1, (progress - foldStartProg) / TL.PROGRESS_FOLD_DUR));
    const fdE = gpLocalT >= TL.FOLD_START_LOCAL_T ? easeInOutCubic(fdLocalT) : 0;

    // Per-card CA strength: arc entry peaks with entryRot; peel + fold use a bell curve.
    let cardCA = 0;
    if (CA_ENABLED) {
      cardCA = Math.max(
        entryRot / TL.ENTRY_ROT_MAX,
        gpE * (1 - gpE) * 4,
        fdE * (1 - fdE) * 4,
      ) * CA_STRENGTH; // written to uCA with the hover term below
    }

    // Hover ease gates on the GLOBAL interactive threshold, not per-card fdE.
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T || reducedMotion) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * HOVER_RATE;

    // Applied here, not in placeSphereCard: the gate above is global but fdE is per-card, so a
    // card still folding at fdE 0.999 would raise hoverT and render nothing. See README.
    if (CA_ENABLED) {
      mesh.material.uniforms.uCA.value = cardCA + card.hoverT * HOVER_CA;
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP;
      if (card.hoverT > 0.01) {
        mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
      } else {
        mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
      }
    }

    // Contour/reveal defaults for the non-sphere phases. uDissolve is shared with the sphere
    // phase's near-camera dissolve, so it must be (re)set every frame.
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = 1;
    mesh.material.uniforms.uDissolve.value = 1 - card.revealT;
    mesh.material.uniforms.uDisperse.value = 0;

    // Capture position before the branch updates it — delta drives motion CA.
    const prevMeshX = mesh.position.x;
    const prevMeshY = mesh.position.y;

    // One phase branch per card, latest phase first. Sphere + settled-grid skip the stage compute.
    if (fdE >= 1) { placeSphereCard(card, mesh, cardCA, frame); return; }
    if (gpE >= 1 && fdE === 0) {
      placeGridCard(card, mesh, i, prevMeshX, prevMeshY, frame);
      return;
    }
    // Arc/peel/fold all need the live arc→grid stage (the fold lerps FROM it).
    const stage = computeCardStage(card, i, gpE, frame);
    if (fdE > 0) { placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame); return; }
    placeArcCard(card, mesh, i, gpE, stage, prevMeshX, prevMeshY);
  }

  // Position every card for this frame over the shared `frame` context.
  function updateCardTransforms(frame) {
    if (masonryMorph.active) {
      masonryMorph.t = Math.min(1, masonryMorph.t + MASONRY_MORPH_RATE);
    }
    for (let i = 0; i < bp.N_TOTAL; i += 1) updateCardTransform(i, frame);
    if (masonryMorph.active && masonryMorph.t >= 1) {
      masonryMorph.active = false;
      for (let i = 0; i < cards.length; i += 1) { if (cards[i]) cards[i].morph = null; }
      recomputeDragFlip(); // now that spherePos/sphereWorldH hold the final masonry values
    }
  }

  // Owns textExitProgress (hint dissolve + cursor retirement) for both consumers — the hint plane
  // and the cursor label. A separate stage because updateClickDragText early-returns below
  // TEXT_APPEAR_START. Monotonic 0→1 and never re-armed: the first drag retires the hint for the
  // life of this runtime. See README (hint text).
  function updateHintExitProgress(frame) {
    const { sphereFormT } = frame;
    if (textExitProgress >= 1 || reducedMotion || !drag.isDragging) return;
    // A held drag can scroll out of the live range (pointer capture outlives the gate) — a globe
    // that isn't interactive must not accrue.
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T) return;
    // A vertical touch drag is page scroll, not a globe drag — don't accrue during it.
    if (interaction.isPageScrollGesture()) return;
    const spd = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const norm = spd / MAX_VEL; // 0–1
    textExitProgress = Math.min(
      1,
      textExitProgress
        + norm * 0.018 // drag-distance contribution
        + 0.0022 // hold-time contribution (~0.13/s at 60fps)
        + norm * norm * 0.010, // velocity burst (quadratic — a fast flick punches harder)
    );
  }

  // Hint text: warps in on fold, settles faint, fades on zoom, dissolves on first drag. Reads
  // frame.foldSphDist + live sphereDragWarp, so it runs after both.
  function updateClickDragText(frame) {
    if (!textMesh) return;
    const { sphereFormT, zoomT, foldSphDist } = frame;
    const { uniforms } = textMesh.material;

    if (reducedMotion) {
      // Static: faint, no warp / CA / dissolve (RM suppresses all motion).
      textMesh.visible = true;
      textMesh.scale.setScalar(1);
      uniforms.uOpacity.value = TEXT_OPACITY_RESTING;
      uniforms.uUVScale.value = 1.0;
      uniforms.uWarp.value = 0;
      uniforms.uZoom.value = 0;
      uniforms.uCA.value = 0;
      uniforms.uMotionDir.value.set(0, 0);
      return;
    }
    if (sphereFormT <= TL.TEXT_APPEAR_START) {
      // Hidden until the fold is underway.
      textMesh.visible = false;
      textMesh.scale.setScalar(1); // plane is viewport-sized; the warp does the entrance
      return;
    }

    const { CAM_Z_SPHERE, SPHERE_R } = bp;
    // Entrance resolves ON the interactive gate, not at sphereFormT 1. See README (hint text).
    const sfRaw = (sphereFormT - TL.TEXT_APPEAR_START)
      / (TL.SPHERE_INTERACTIVE_T - TL.TEXT_APPEAR_START);
    const sfT = Math.max(0, Math.min(1, sfRaw));
    const txtT = easeOutCubic(sfT);
    // Warp: strong at entrance, 0 at rest.
    const txtWarpEntrance = lerpN(TEXT_WARP_ENTER_MAX, 0, sfT * sfT);
    // Scale: fill the viewport at the current camera distance + warp-proportional overflow.
    const restDist = CAM_Z_SPHERE + SPHERE_R + TEXT_BEHIND_GAP;
    const currDist = foldSphDist + SPHERE_R + TEXT_BEHIND_GAP;
    const warpTot = txtWarpEntrance + sphereDragWarp * TEXT_DRAG_WARP_MUL;
    textMesh.scale.setScalar(currDist / restDist + warpTot * TEXT_WARP_OVERFLOW);
    // Opacity settles peak→resting over the fold, then fades on zoom (no fade-in).
    const txtOp = lerpN(TEXT_OPACITY_PEAK, TEXT_OPACITY_RESTING, txtT)
      * (1 - Math.min(1, zoomT * TL.TEXT_ZOOM_FADE_RATE));

    textMesh.visible = txtOp > 0.001 && textExitProgress < 0.999;
    uniforms.uUVScale.value = 1.0;
    uniforms.uOpacity.value = txtOp;
    uniforms.uZoom.value = zoomT;
    uniforms.uExitP.value = textExitProgress;
    uniforms.uWarp.value = txtWarpEntrance + sphereDragWarp * TEXT_DRAG_WARP_MUL;

    if (CA_ENABLED) {
      const dragSpd = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
      // Speed-based CA (sharp burst) + warp-based CA (lingers as the warp decays).
      uniforms.uCA.value = (dragSpd / MAX_VEL) * CA_STRENGTH * 5
        + (sphereDragWarp + txtWarpEntrance) * TEXT_CA_WARP_MUL;
      uniforms.uMotionDir.value.set(
        drag.velX * TEXT_CA_DIR_STRENGTH,
        -drag.velY * TEXT_CA_DIR_STRENGTH,
      );
    }
  }

  // Thin orchestrator. Stage order is FIXED and load-bearing — see README (Module layout).
  function tick() {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const frame = computeFrame();
    arcCtx = buildArcCtx(frame.arcPanT, W, H, bp.ARC_SPAN);

    a11y.updateTabStops();
    frame.activeCamera = updateActiveCamera(frame);
    frame.sphereRotActive = updateSphereRotation(frame);
    modal.updateAnimation(frame.sphereRotActive);
    modal.updateDesktopNav();
    updateCanvasVisibility(frame);
    updatePullQuote(frame);

    // Arc needs manual render order; sphere needs camera-distance sorting.
    renderer.sortObjects = frame.sphereFormT > TL.DEPTH_SORT_FORM_T;

    frame.sphGroupZ = updateSphereGroupDepth(frame);
    updateGlobalCA();
    updateCardTransforms(frame);
    updateA11yFocusRing(); // after card transforms — reads the meshes' fresh world positions
    updateHintExitProgress(frame); // owns textExitProgress — before its two consumers

    updateClickDragText(frame);
    cursor.update();
    controls.update();
    updateArcCopy(frame);
    renderScene(frame.activeCamera);
  }

  // rAF driver. startTicker/stopTicker are called from initRuntime and destroy.
  let rafId = 0;
  function rafLoop() { tick(); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() {
    if (rafId) return;
    // Re-baseline scroll (no scrollVel spike) + the frame clock (the parked interval isn't dt).
    frameInput.prevLenisY = window.scrollY;
    frameInput.prevNow = 0;
    rafId = requestAnimationFrame(rafLoop);
  }
  function stopTicker() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
    // Inertia can't coast while the loop is parked — retire it rather than resume it later.
    drag.velX = 0; drag.velY = 0; drag.pendingX = 0; drag.pendingY = 0;
  }
  // Run the loop only while renderReady AND onScreen; called whenever either input changes.
  function syncTicker() {
    if (renderReady && onScreen) {
      startTicker();
    } else {
      stopTicker();
      if (renderer) renderer.domElement.style.display = 'none';
    }
  }

  const MAX_CONTEXT_REBUILDS = 4;
  const CONTEXT_STABLE_MS = 10000;
  // WebGL context-loss recovery state. See README (WebGL context loss).
  const ctxLoss = { rebuilds: 0, stableTimer: 0, recovering: false, recoverTimer: 0 };
  function onContextLost(e) {
    e.preventDefault();
    if (ctxLoss.stableTimer) { clearTimeout(ctxLoss.stableTimer); ctxLoss.stableTimer = 0; }
    stopTicker();
    renderReady = false;
    window.lana?.log?.('globe-gallery: WebGL context lost', { tags: 'globe-gallery', severity: 'warn' });
  }
  function recoverFromContextLoss() {
    ctxLoss.recoverTimer = 0;
    ctxLoss.recovering = false;
    ctxLoss.rebuilds += 1;
    const collapsed = ctxLoss.rebuilds > MAX_CONTEXT_REBUILDS;
    window.lana?.log?.(
      collapsed
        ? 'globe-gallery: WebGL context keeps failing — collapsing'
        : 'globe-gallery: WebGL context restored — rebuilding',
      { tags: 'globe-gallery', severity: collapsed ? 'error' : 'info' },
    );
    // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
    destroy();
    // eslint-disable-next-line no-use-before-define -- same hoisted mutual ref
    if (collapsed || initRuntime() === false) {
      root.classList.add('globe-gallery-empty');
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
    [q('.globe-gallery-canvas'), q('.globe-gallery-modal-canvas')].forEach((c) => {
      if (!c) return;
      c[fn]('webglcontextlost', onContextLost, false);
      c[fn]('webglcontextrestored', onContextRestored, false);
    });
  }

  let resizeHandler = null;
  let textRebuildTimer = 0;
  // Reduced-motion media query + listener (a mid-session OS toggle rebuilds; see doLayout).
  let reducedMotionMQ = null;
  let reducedMotionHandler = null;
  let appliedDpr = 0;
  let layoutObs = null; // ResizeObserver keeping block metrics fresh as page content loads
  let intersectionObs = null; // IntersectionObserver gating the rAF loop on visibility
  let textureLoadGeneration = 0;

  function initRuntime() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas) return false;

    reducedMotion = prefersReducedMotion();
    root.classList.toggle('globe-gallery-reduced', reducedMotion);

    // RM: canvas into normal flow so the globe scrolls away. See README (Reduced motion).
    canvas.style.position = reducedMotion ? 'absolute' : '';

    W = window.innerWidth;
    H = measureViewportH();

    // Resolve the breakpoint profile before anything reads bp.*.
    const band = resolveBP(W);
    bp = resolveBpProfile(band.name, band.cfg, usesCylinderGeometry(band.name));
    publishPqAppearZoomT();

    try {
      const aa = bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, alpha: true });
    } catch (e) {
      renderer = null;
      return false;
    }
    appliedDpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(appliedDpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false; // we manage order via mesh.renderOrder

    bindContextListeners(true);

    scene = new THREE.Scene();

    // Perspective camera — sphere + zoom phases.
    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 0, arcCamZ(H));
    camera.lookAt(0, 0, 0);

    // Orthographic camera — arc phase, flat 2D (1 world unit = 1 CSS pixel).
    cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
    cameraOrtho.position.set(0, 0, 100);
    cameraOrtho.lookAt(0, 0, 0);

    // Only the resize path passes fromResize — see README (doLayout cost control).
    function doLayout({ fromResize = false } = {}) {
      measureBlock();
      readCssVars();
      const nextW = window.innerWidth;
      const nextH = measureViewportH();
      if (fromResize && nextW === W && nextH === H) return;
      W = nextW;
      H = nextH;

      // A band crossing or an RM toggle rebuilds (geometry is baked at build time); resizing
      // within a band takes the cheap path. See README (Breakpoints & rebuilds).
      const nextBand = resolveBP(W);
      const nextReducedMotion = prefersReducedMotion();
      if (nextBand.name !== bp.name || nextReducedMotion !== reducedMotion) {
        // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
        destroy();
        if (initRuntime() === false) root.classList.add('globe-gallery-empty');
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      if (dpr !== appliedDpr) {
        appliedDpr = dpr;
        renderer.setPixelRatio(dpr);
      }
      renderer.setSize(W, H);
      modal.resize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      cameraOrtho.left = -W / 2;
      cameraOrtho.right = W / 2;
      cameraOrtho.top = H / 2;
      cameraOrtho.bottom = -H / 2;
      cameraOrtho.updateProjectionMatrix();
      computeGridLayout();
      // Deferred only while off-screen. See README (doLayout cost control).
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

    // RM can toggle mid-session without a resize, so listen directly; doLayout rebuilds.
    if (reducedMotionMQ && reducedMotionHandler) {
      reducedMotionMQ.removeEventListener('change', reducedMotionHandler);
    }
    reducedMotionMQ = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    if (reducedMotionMQ) {
      reducedMotionHandler = () => doLayout();
      reducedMotionMQ.addEventListener('change', reducedMotionHandler);
    }

    // Page height changes shift offsetTop; blockHeight=0 at first paint → progress=Infinity.
    if (layoutObs) layoutObs.disconnect();
    layoutObs = new ResizeObserver(() => doLayout({ fromResize: true }));
    layoutObs.observe(document.body);

    if (intersectionObs) intersectionObs.disconnect();
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObs = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        syncTicker();
      }, { rootMargin: '100% 0px 100% 0px' });
      intersectionObs.observe(root);
    }

    interaction.setup(canvas);
    cursor.setup();
    root.classList.toggle('globe-gallery-barrel', bp.CYLINDER);

    // Focus-snap guard listeners (see snapToInteractive).
    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    // Cache the global-CA SVG filter elements.
    caFilterR = q('.globe-gallery-ca-r-offset');
    caFilterB = q('.globe-gallery-ca-b-offset');
    arcCopy.el = q('.globe-gallery-arc-copy');
    arcCopy.opStr = '';
    arcCopy.transformStr = '';

    modal.setup();

    // Build up front so the block paints immediately; photos un-dissolve in as they land.
    buildCards();

    if (!bp.CYLINDER) buildTextMesh();
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
      card.srcAspect = srcAspect; // every phase's fit derives from it; the modal falls back to it
      // md sizes per-card in place (index-based positions); sm re-solves its packing in onDone.
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
      // Ask at the cap, by HEIGHT, matching fitCardDims. See README (image requests).
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
    if (intersectionObs) {
      intersectionObs.disconnect();
      intersectionObs = null;
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    if (textRebuildTimer) { clearTimeout(textRebuildTimer); textRebuildTimer = 0; }
    if (reducedMotionMQ && reducedMotionHandler) {
      reducedMotionMQ.removeEventListener('change', reducedMotionHandler);
      reducedMotionMQ = null;
      reducedMotionHandler = null;
    }
    if (layoutObs) {
      layoutObs.disconnect();
      layoutObs = null;
    }
    window.removeEventListener('blur', armFocusGuard);
    window.removeEventListener('focus', disarmFocusGuard);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    interaction.teardown();
    // Cursor cleanup — runs while renderer exists so getCanvas() resolves.
    cursor.teardown();
    controls.teardown();
    if (renderer) {
      renderer.domElement.style.filter = '';
      globalCaFilterOn = false;
      // Do NOT forceContextLoss() here — the canvas element is reused across rebuilds and a
      // force-lost context never restores. See README (WebGL context loss).
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
    cards = [];
    textures = [];
    cardAspects = [];
    // Free the hint-text GPU resources + reset its exit progress before scene teardown.
    disposeTextMesh();
    textExitProgress = 0;
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    modal.destroy();
    a11y.teardown();
    if (arcCopy.el) arcCopy.el.style.cssText = '';
    if (pqEl) { pqEl.classList.remove('is-active'); pqEl.style.transition = ''; pqShown = false; }
    frameInput.prevLenisY = 0; frameInput.prevNow = 0; frameState.scrollVel = 0;
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
  // Reduced motion: static, still-interactive globe in plain document flow.
  if (prefersReducedMotion()) {
    el.classList.add('globe-gallery-reduced');
  }

  // Extract authored content (incl. the UI labels) before buildGlobeDom() wipes the children.
  const {
    arcCopy, pullQuote, hintText, touchHint, instructions, labels, fragmentHref,
  } = parseAuthoredContent(el);

  // Returns the per-instance id suffix (CA filter ref) and fills the copy slots.
  const gid = buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint });

  // Cards come from the authored fragment link.
  const cards = fragmentHref ? await fetchFragmentCards(fragmentHref) : null;
  if (!cards || cards.length === 0) {
    el.classList.add('globe-gallery-empty');
    return el;
  }
  const runtime = createGlobeGalleryRuntime(
    cards,
    hintText,
    instructions,
    el,
    gid,
    labels,
  );
  if (!runtime) { el.classList.add('globe-gallery-empty'); return el; }
  if (runtime.init() === false) { el.classList.add('globe-gallery-empty'); return el; }
  el.globeRuntime = runtime;

  const removalObserver = new MutationObserver(() => {
    if (document.contains(el)) return;
    runtime.destroy();
    removalObserver.disconnect();
  });
  removalObserver.observe(document.body, { childList: true, subtree: true });

  return el;
}
