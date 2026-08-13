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
import {
  easeOutCubic, easeInOutCubic, lerpN,
  buildArcCtx, getFanData, cssToWorld, rotateArcPoint, arcCamZ,
} from './src/math.js';
import * as TL from './src/timeline.js';

const CARD_ASPECT = 456 / 631; // portrait

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const isRtl = () => document.documentElement.dir === 'rtl';

// Two render profiles split at 768px (Milo sm↔md); resolved once via resolveBP(W).
// See README (Breakpoints).
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
    SPHERE_AREA_NORM: 0, // 0 = native-aspect sizing. See SPHERE_AREA_NORM in buildCards.
    CARD_ROLL_JITTER: 0.5, // per-card random roll, radians (±0.25 ≈ ±14°)
    ARC_DENSE_FRACTION: 0.6, // share of cards clustered into the off-screen arc flank
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
    SPHERE_AREA_NORM: 0,
    ARC_DENSE_FRACTION: 0,
    CYL_COLS_FIT: 0.65, // phone-only override of the shared wall-height dial
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

const CARD_TEX_SM = 256;
const CARD_TEX_MD = 768;
const MODAL_TEX_SM = 768;
const MODAL_TEX_MD = 2048;
const ANTIALIAS_SM = false;
const ANTIALIAS_MD = true;
const GLOBAL_CA_SM = false;
const GLOBAL_CA_MD = true;

// Shape overlay applied wherever drags are yaw-only (touch / narrow viewport): a cylindrical
// masonry wall replaces the Fibonacci sphere so yaw can bring any card face-on at any height.
// Selected per pointer precision (independent of the width band). See README (yaw-only geometry).
const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_GAP_RATIO: 0.20, // inter-card gap as a fraction of card width
  CYL_ASPECT_CAP: 1.5, // clamp on card aspect (cover-crop crops harder past it)
  CYL_BULGE: 0.18, // barrel bulge: r = R·(1 − bulge·t²); keep ≤~0.2 or edges overlap
  CARD_FACE_CAMERA: 0.1, // limb polish; costs barrel smoothness — read the README before raising
  SPHERE_AREA_NORM: 0,
};

// Cylinder-masonry wall vs Fibonacci sphere. True on the sm width band OR a coarse primary
// pointer. matchMedia-less environments are treated as precise-pointer. See README.
function usesCylinderGeometry(bandName) {
  if (bandName === 'sm') return true;
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

// Scroll-timing constants live in src/timeline.js.
const ARC_STAGGER = 0.594;

// Reduced motion: shrink the static desktop sphere so the whole ball fits (sm left at 1).
const RM_GLOBE_SCALE_MD = 0.9;

// Grid peel / fold.
const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width
// Non-uniform fanT split: low-i cards cluster into fanT [0, this] off-screen and peel first;
// the rest spread across the visible upper arc. ARC_DENSE_COUNT (per-BP) scales with N_TOTAL.
const ARC_DENSE_SPLIT = 0.50;

// Drag / auto-rotation. MAX_VEL is shared with interaction.js (it clamps, core normalizes).
const DRAG_FRICTION = 0.94;
const MAX_VEL = 0.06;
const AUTO_ROT_SPEED = 0.000045;
// Keyboard browse pitch cap ±85° (vs ±60° drag); excess eases back at PITCH_RELAX once
// browsing ends. See updateSphereRotation.
const KEY_PITCH_CAP = (85 * Math.PI) / 180;
const PITCH_RELAX = 0.85;
// Frame counts for the sphere-centring easeInOutCubic tweens: browse slow (anti-dizziness),
// modal faster (runs behind the blur). See README (Accessibility).
const KEY_BROWSE_FRAMES = 90;
const KEY_MODAL_FRAMES = 20;
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
const HOVER_RATE = 0.15; // per-frame lerp toward target (~125ms to 80%)

// Progressive texture reveal: per-card un-dissolve once its photo lands. See buildCards + onEach.
const REVEAL_RATE = 0.06; // per-frame reveal ease (~0.28s @60fps)
// One-time masonry (sm barrel) reflow after all textures load, if the barrel is already formed.
const MASONRY_MORPH_RATE = 0.05; // per-frame ease of the position/scale morph (~0.33s)

// Near-camera proximity fade (zoom-through): dissolve a card by its depth in front of the
// lens before it can fill the frame. Thresholds in card-heights. See README (near fade).
const FACING_EDGE_ON_BAND = 0.25; // |normal.z| half-width of the facing fade-out band
const DRAG_FLIP_MAX_CAM_FRAC = 0.95; // ceiling on dragFlipZ as a fraction of CAM_Z_SPHERE
const NEAR_FADE_START = 2.5; // begin fading below 2.5 card-heights depth
const NEAR_FADE_END = 1.6; // fully transparent below 1.6 card-heights

// Sphere-drag warp: baseline while dragging + velocity burst that decays via DRAG_FRICTION.
const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value

// "Click & Drag" hint text (WebGL plane behind the sphere). See README (Behavior notes).
const TEXT_BEHIND_GAP = 15; // world units behind the sphere's back surface
const TEXT_WARP_ENTER_MAX = 4.50; // uWarp at entrance
const TEXT_SCALE_ENTER = 1.0; // plane stays viewport-sized; warp handles the look
const TEXT_OPACITY_PEAK = 0.15; // opacity at peak fade-in
const TEXT_OPACITY_RESTING = 0.06; // settled opacity once the sphere is formed
const TEXT_CA_DIR_STRENGTH = 0.05; // uMotionDir strength for drag CA on the text
const TEXT_CA_WARP_MUL = 1.5; // warp-driven CA boost
const TEXT_DRAG_WARP_MUL = 3.0; // text drag-warp vs sphere cards — more violent
const TEXT_WARP_OVERFLOW = 0.6; // extra mesh scale per warp unit — letterforms bleed off

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
// Cylindrical masonry layout — a WHOLE-SET solve (card heights depend on image aspects, so
// balancing columns needs all of them). Cards packed greedily into the shortest column;
// column count = fewest that fit `colsFit` of the frustum. Returns { pos, w, h } per card.
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
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1] — curves the
  // silhouette while columns keep constant azimuth (straight alignment preserved).
  const wallH = packed.wallH || 1;
  return packed.placed.map((p, i) => {
    // Centre each column's own stack vertically (reads as masonry, not a ragged edge).
    const colTotal = packed.totals[p.col];
    const y = colTotal / 2 - p.offset - p.h / 2;
    const azimuth = (2 * Math.PI * p.col) / cols;
    const t = Math.max(-1, Math.min(1, (2 * y) / wallH));
    const r = radius * (1 - bulge * t * t);
    // Outward normal of the surface of revolution r(y): (1, −dr/dy) normalized, swung to
    // this azimuth, so buildCards can aim the card flat against its own tilted surface.
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

// Factory returning { init, destroy }. `root` is the block element; all DOM lookups are
// scoped to it (root.querySelector) so >1 globe can coexist. `gid` is this instance's
// unique-id suffix (minted by buildGlobeDom) so the CA filter url(#…) ref matches its node.
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

  // Active breakpoint profile — frozen, constant within a band. Assigned by resolveBpProfile
  // in initRuntime, rebuilt on a band crossing. null until then — do NOT read at module load.
  let bp = null;

  // Resolve a band's static cfg into the active profile. Pure — returns a frozen object.
  // `cylinder` (from usesCylinderGeometry) selects the shape constants.
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
      SPHERE_AREA_NORM: shape.SPHERE_AREA_NORM,
      CYLINDER: !!shape.CYLINDER,
      // A band may override the shared wall-height dial to contain its own near face (sm does).
      CYL_COLS_FIT: cfg.CYL_COLS_FIT !== undefined ? cfg.CYL_COLS_FIT : shape.CYL_COLS_FIT,
      CYL_GAP_RATIO: shape.CYL_GAP_RATIO,
      CYL_ASPECT_CAP: shape.CYL_ASPECT_CAP,
      CYL_BULGE: shape.CYL_BULGE,
      // Frustum height at the cylinder's centre plane — the column solve's vertical budget.
      CYL_FRUSTUM_H: 2 * Math.tan(Math.PI / 6) * cfg.CAM_Z_SPHERE,
      CARD_ROLL_JITTER: cfg.CARD_ROLL_JITTER,
      // Dense-arc cluster as a share of the count (count-independent ratio); clamped below
      // nTotal-1 so the spread region always keeps at least one card.
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
  let cardTexData = []; // per-card sphereScaleX + arc UV crop values
  let placeholderTex = null; // shared transparent texture for not-yet-loaded cards
  // One-time sm-barrel reflow once all aspects are known (masonry packing is a whole-set solve).
  const masonryMorph = { active: false, t: 0 };
  let gridCardW = 0; let
    gridTilts = [];

  // Persistent clock context + its input (see src/timeline.js). frameState is the single source
  // for the clocks — don't cache them in the closure. See README (Module layout).
  const frameState = TL.createFrame();
  const frameInput = TL.createFrameInput();

  let blockDocTop = 0; // block's top in document space (the scroll runway)
  let blockHeight = 0; // its full scroll length
  let pqAppearZoomT = 0.5; // zoomT the pull-quote fades in at; from --pq-pin-factor (see doLayout)
  let W = 0; let
    H = 0;

  const pqEl = q('.globe-gallery-pullquote');
  let pqShown = false;

  let caFilterR = null; // SVG feOffset element for red channel
  let caFilterB = null; // SVG feOffset element for blue channel
  let globalCaFilterOn = false; // whether canvas.style.filter currently holds the CA url
  // Cached node + last-written style strings (DOM writes only on change).
  const arcCopy = { el: null, startSide: '', startStr: '', opStr: '', transformStr: '' };

  const drag = { isDragging: false, velX: 0, velY: 0 };
  let renderReady = false;
  let onScreen = true; // assume visible until the observer's first callback corrects it
  let sphereDragWarp = 0;
  let cameraInsideSphere = false;
  let dragFlipZ = 0; // camera z at which drag inverts; set in buildCards
  // "Click & Drag" hint text mesh (built async, null until fonts load) + one-way exit progress.
  let textMesh = null;
  let textExitProgress = 0;

  // Per-card sphere-rotation state. Drag rotation is applied MANUALLY per card in tick()'s
  // sphere/fold blocks (sphereGroup.rotation stays identity). Source is a pitch/yaw Euler
  // pair; sphereRotQuat is rebuilt each frame and shared by reference into modal.js. 'XYZ'
  // keeps the clamped pitch as the outer rotation (self-levels; no gimbal flip). See README
  // (Sphere rotation). x = pitch, y = yaw, z = keyboard-uprighting roll.
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

  // Sphere-to-card alignment tween. See README (Module layout → grouped closure state).
  const navNudge = {
    active: false,
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
  // Return the sphere to its upright resting orientation. Shared by the scroll-out zero and
  // the rebuild. Does NOT touch drag velocity or sphereDragWarp (callers handle those).
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

  // Suppresses the focus→snap-scroll while the tab is backgrounded (pdf-space pattern).
  let suppressFocusSnap = false;

  let arcCtx = null; // current arc context, rebuilt per frame in tick() via buildArcCtx

  // Grid layout — GRID_COLS/ROWS are the NOMINAL grid (size, gap, centering origin);
  // totalW/totalH derive from the nominal dims so adding cards never shifts already-placed cards.
  // See README (Card count).
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

  function buildCards() {
    const {
      N_TOTAL, N_VISIBLE, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE, GRID_COLS, GRID_ROWS,
      CARD_ROLL_JITTER, SPHERE_AREA_NORM, CYLINDER,
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
        aspects: Array.from({ length: N_TOTAL }, (unused, i) => {
          const d = cardTexData[i] || {};
          return (d.sphereScaleX !== undefined ? d.sphereScaleX : 1) * CARD_ASPECT;
        }),
        radius: SPHERE_R,
        frustumH: bp.CYL_FRUSTUM_H,
        colsFit: bp.CYL_COLS_FIT,
        gapRatio: bp.CYL_GAP_RATIO,
        aspectCap: bp.CYL_ASPECT_CAP,
        bulge: bp.CYL_BULGE,
      })
      : null;

    for (let i = 0; i < N_TOTAL; i += 1) {
      // cardTexData is fully populated by the time buildCards() fires (called from onDone)
      const ctd = cardTexData[i] || {};
      const sphereScaleX = ctd.sphereScaleX !== undefined ? ctd.sphereScaleX : 1;
      const imgAspect = sphereScaleX * CARD_ASPECT;
      // Equal-area normalization: scaling both axes by sphereScaleX^-norm equalizes area at
      // norm=0.5 without distorting aspect; norm=0 = native size. See README.
      const areaNorm = SPHERE_AREA_NORM
        ? sphereScaleX ** -SPHERE_AREA_NORM
        : 1;
      // Masonry solves absolute world w/h; convert to scale factors against the shared geometry.
      const mas = masonry ? masonry[i] : null;
      // Cover-crop UVs (fall back to the no-crop identity if the texture errored).
      const repeatX = ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1;
      const repeatY = ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1;
      const offsetX = ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0;
      const offsetY = ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      const mat = createCardMaterial({
        // Contour until this card's photo lands (onEach swaps in the real texture).
        texture: textures[i] || placeholderTex,
        aspect: CARD_ASPECT, // arc/grid start shape; per-phase stages update uAspect
        repeatX,
        repeatY,
        offsetX,
        offsetY,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = N_VISIBLE - i;
      sphereGroup.add(mesh);

      const sp = mas
        ? mas.pos.clone()
        : fibSpherePos(i, N_TOTAL, SPHERE_R);

      // Face outward: masonry aims along its computed surface normal (flat against the
      // barrel); the sphere aims at the origin. lookAt target is INSIDE the surface (sp −
      // normal) so local +Z points out.
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
        // Sphere-phase scale factors (equal-area norm folded in). sphereScaleX is the raw
        // aspect stretch (grid/arc/modal read it); sphereScaleS{X,Y} the sphere/fold apply.
        sphereScaleX,
        sphereScaleSX: mas ? mas.w / CARD_W_SPHERE : sphereScaleX * areaNorm,
        sphereScaleSY: mas ? mas.h / CARD_H_SPHERE : areaNorm,
        // This card's ACTUAL rendered world height — the near fade is in card-heights, and on
        // masonry CARD_H_SPHERE is only the geometry base. See README (near fade).
        sphereWorldH: mas ? mas.h : CARD_H_SPHERE * areaNorm,
        // World-space aspect for the rounded-corner SDF — must equal actual rendered w/h.
        imgAspect: mas ? mas.w / mas.h : imgAspect,
        arcRepeatX: repeatX,
        arcRepeatY: repeatY,
        arcOffsetX: offsetX,
        arcOffsetY: offsetY,
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

  // Drag-flip threshold: camera z below which drag inverts, anchored to where cards VANISH
  // (front wall's max radial distance + the tallest card's fade-end) so the flip lands with
  // the dissolve. Fold in sphereGroup.scale (RM shrinks the group on md). See README.
  // Recomputed once all textures land, since sphereWorldH starts at a placeholder aspect.
  function recomputeDragFlip() {
    if (!sphereGroup || cards.length === 0) return;
    const groupScale = sphereGroup.scale.x || 1;
    const maxRadial = cards.reduce(
      (m, c) => Math.max(m, Math.hypot(c.spherePos.x, c.spherePos.z)),
      0,
    ) * groupScale;
    const maxCardH = cards.reduce((m, c) => Math.max(m, c.sphereWorldH), 0) * groupScale;
    // Clamped below the zoom-start distance (DRAG_FLIP_MAX_CAM_FRAC) so the flip stays inside
    // the zoom-through.
    dragFlipZ = Math.min(
      maxRadial + NEAR_FADE_END * maxCardH,
      bp.CAM_Z_SPHERE * DRAG_FLIP_MAX_CAM_FRAC,
    );
  }

  // Sphere-phase sizing for one card from its loaded image aspect (non-masonry path). Read live
  // each frame by placeSphereCard, so updating these here "morphs" the card into its native shape.
  function updateCardSphereSizing(card, sphereScaleX) {
    const areaNorm = bp.SPHERE_AREA_NORM ? sphereScaleX ** -bp.SPHERE_AREA_NORM : 1;
    card.sphereScaleX = sphereScaleX;
    card.sphereScaleSX = sphereScaleX * areaNorm;
    card.sphereScaleSY = areaNorm;
    card.sphereWorldH = bp.CARD_H_SPHERE * areaNorm;
    card.imgAspect = sphereScaleX * CARD_ASPECT;
  }

  // sm barrel only: masonry packing needs every image aspect, so it's solved once with placeholder
  // aspects up front and re-solved here after all textures land. Each card morphs from its
  // provisional slot to the final one (invisible if the user is still in arc/grid). See onDone.
  function resolveMasonryLayout() {
    const { N_TOTAL, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE } = bp;
    const masonry = cylinderMasonryLayout({
      aspects: Array.from({ length: N_TOTAL }, (unused, i) => {
        const d = cardTexData[i] || {};
        return (d.sphereScaleX !== undefined ? d.sphereScaleX : 1) * CARD_ASPECT;
      }),
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
        iaFrom: card.imgAspect,
        iaTo: mas.w / mas.h,
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
        texture: createClickDragTexture(aspect, hintText || 'Click & Drag'),
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

  // Card facing — tilts limb cards partway toward the camera so edge-on slivers stay legible.
  // MUST be per-frame (the sphere rotates). Target is sign(n.z) × view dir so back cards keep
  // facing away. k=0 is a true sphere (no-op). `amount` (fold passes fdE) eases the tilt in.
  // Operates on a Quaternion in place (also modal.js's close-anim target). See README.
  function applySphereFacing(quat, amount = 1) {
    let k = bp.CARD_FACE_CAMERA * amount;
    if (!k) return;
    cardNormal.set(0, 0, 1).applyQuaternion(quat); // current outward normal (local +Z)
    // Fade to 0 across a band around edge-on so the target's sign flip (normal.z crossing 0)
    // doesn't teleport the card ~63°. See README (FACING_EDGE_ON_BAND).
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

  // Set a card to its sphere slot with the current drag rotation baked in, so a reparent
  // doesn't flash an unrotated card for one frame before tick() re-applies rotation.
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

  // Shared: the sphere yaw + pitch that bring card `idx` to screen centre. Yaw is exact
  // (rotate spherePos about Y by the current yaw, null its x). Pitch drives height → 0,
  // clamped to `pitchCap`. yawOnly holds pitch (cylinder can't centre vertically). Inside the
  // globe both terms flip to the far (−Z) wall. Used by the modal + keyboard gallery.
  function cardCenterYawPitch(idx, pitchCap, yawOnly) {
    const { spherePos } = cards[idx];
    const cy = Math.cos(sphereOrient.y);
    const sy = Math.sin(sphereOrient.y);
    const px = spherePos.x * cy + spherePos.z * sy;
    const pz = -spherePos.x * sy + spherePos.z * cy;
    const inside = cameraInsideSphere;
    let deltaY = -Math.atan2(px, pz); // → +Z (near wall, camera outside)
    if (inside) deltaY += Math.PI; // → −Z (far wall, camera inside)
    deltaY = Math.atan2(Math.sin(deltaY), Math.cos(deltaY)); // shortest signed spin
    const targetYaw = sphereOrient.y + deltaY;
    if (yawOnly) return { targetYaw, targetPitch: sphereOrient.x };
    const h = Math.sqrt(px * px + pz * pz); // horizontal radius after yaw alignment
    const pitchMag = Math.atan2(spherePos.y, h); // drives the card's height → centre
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
    navNudge.active = true;
  }

  // Keyboard-gallery centring: rotate so card `idx` lands dead-centre and stands upright.
  // Injected into a11y.js as centerCard. Yaw + pitch from the shared solve; the extra term is
  // the upright screen-Z roll cancelling the card's residual tilt (eased back to 0 on exit).
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
    navNudge.active = true;
    // Kill residual spin (auto-rotate/drag inertia) so it can't fight the ease.
    drag.velX = 0;
    drag.velY = 0;
  }

  // Motion-trail CA. dx/dy: world-space position delta this frame. ampOverride: optional 0-1;
  // when omitted, derived from max(scroll velocity, drag speed) so spin + modal both drive CA.
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

  // UV helper — drives the cover-crop through the card shader's uniforms.
  function setCardUV(mesh, rx, ry, ox, oy) {
    mesh.material.uniforms.uRepeat.value.set(rx, ry);
    mesh.material.uniforms.uOffset.value.set(ox, oy);
  }

  // Sets the rounded-corner SDF's world-space aspect so corners stay circular as the card scales.
  function setCardAspect(mesh, aspect) {
    mesh.material.uniforms.uAspect.value = aspect;
  }

  // Modal DI module — assigned after the helpers its callbacks depend on. Reads live state via
  // getters; reaches the sphere only through sphereRotQuat + the snap/nudge callbacks.
  modal = createGlobeModal({
    q,
    getScene: () => scene,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    getRenderer: () => renderer,
    getCards: () => cards,
    getCount: () => CARD_CONTENT.length,
    getCardMetadata,
    // Lazily load a sharper texture for the opened card. Returns the pending Image (so the
    // modal can cancel it) or null when the base cap already meets the modal cap (reuse, no load).
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

  // Scroll px from the block top where the sphere is fully formed (progress = foldLast); locked to
  // FORMATION_SCROLL_VH, clamped to the runway. See README → runway / progress model.
  function formedScrollPx() {
    return Math.min((TL.FORMATION_SCROLL_VH / 100) * H, blockHeight);
  }

  // Focusing the widget snaps the page to the interactive globe state (formed-sphere offset;
  // block top under RM). Deferred a frame so focus settles first (pdf-space). See README.
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

  // Focus-snap guard: a tab-return refocuses the widget and would re-fire the snap. Arm on
  // blur/hidden; disarm a frame after focus so the synchronous refocus stays suppressed.
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

  // Desktop custom cursor (no-op on touch). Created before interaction so its isActive()
  // can gate interaction's hover cursor writes (the two share the canvas).
  cursor = createCursor({
    getCanvas: () => (renderer ? renderer.domElement : null),
    getSphereInteractive: () => frameState.sphereFormT >= TL.SPHERE_INTERACTIVE_T,
    getModalOpen: () => modal.getModalIdx() >= 0,
    getReducedMotion: () => reducedMotion,
    // Two-step exit off the shared hint signal (see the threshold constants).
    getHintDismissed: () => textExitProgress > TL.CURSOR_HINT_DISMISS_T
      || frameState.zoomT > TL.CURSOR_ZOOM_DISMISS_T,
    getCursorRetired: () => textExitProgress > TL.CURSOR_RETIRE_T
      || frameState.zoomT > TL.CURSOR_ZOOM_RETIRE_T,
    labelText: hintText || 'Click & Drag',
    drag,
  });

  interaction = createInteraction({
    getRenderer: () => renderer,
    getCamera: () => camera,
    getCards: () => cards,
    getModalIdx: () => modal.getModalIdx(),
    openModal: (idx, x, y) => openModalFromCanvas(idx, x, y),
    getSphereFormT: () => frameState.sphereFormT,
    interactiveThreshold: TL.SPHERE_INTERACTIVE_T,
    maxVel: MAX_VEL,
    drag,
    isCursorActive: () => cursor.isActive(),
    // Pitch follows geometry, not pointer type: the barrel (bp.YAW_ONLY) is yaw-only for mouse too.
    getYawOnly: () => bp.YAW_ONLY,
  });

  // Per-frame pipeline. tick() is a thin orchestrator over the single-concern stages below;
  // computeFrame builds one `frameState` context, producer stages write results back onto it.
  // Stage order matters (see tick()'s note). See README (Module layout).

  // Refresh the derivation's input from live layout/scroll state, then derive onto frameState.
  function computeFrame() {
    frameInput.scrollY = window.scrollY;
    frameInput.reducedMotion = reducedMotion;
    frameInput.blockDocTop = blockDocTop;
    frameInput.blockHeight = blockHeight;
    frameInput.formPx = formedScrollPx();
    frameInput.viewportH = H;
    frameInput.arcScale = bp.CARD_W_ARC / bp.CARD_W_SPHERE;
    TL.deriveFrame(frameState, frameInput);
    frameInput.prevLenisY = frameState.lenisY;
    return frameState;
  }

  // Pick + position the camera for this frame and return it.
  //   Arc phase (no folding yet): ortho — flat 2D.
  //   Fold phase: perspective approaching CAM_Z_SPHERE in lockstep with the fold so
  //     the sphere reaches normal size exactly when cards finish folding.
  //   Zoom-through: perspective continuing CAM_Z_SPHERE → CAM_Z_END.
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
      // Approach uses easeInCubic (accelerates in, matching the zoom's easeOutCubic). Sphere
      // apparent size is held by the sphereGroup.position.z offset, not camera proximity.
      const camZ = zoomT === 0
        ? lerpN(camZArc, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
        : lerpN(CAM_Z_SPHERE, CAM_Z_END, easeOutCubic(zoomT));
      camera.position.z = camZ;
      camera.updateProjectionMatrix();
    }
    // Flip the drag once the camera is INSIDE (near wall's cards gone). Threshold is dragFlipZ
    // (derived in buildCards from where cards actually disappear), not SPHERE_R.
    cameraInsideSphere = zoomT > 0 && Math.abs(camera.position.z) < dragFlipZ;
    return activeCamera;
  }

  // Sphere rotation (drag inertia + auto-rotate) + nav-nudge ease + drag-warp easing. Returns
  // sphereRotActive and refreshes sphereRotQuat. Rotation is applied PER-CARD (scaled by fdE)
  // in updateCardTransform, not to sphereGroup.rotation (kept identity for world-matrix queries).
  function updateSphereRotation(frame) {
    const { sphereFormT } = frame;
    sphereGroup.rotation.x = 0;
    sphereGroup.rotation.y = 0;

    // Leaving browse: cancel any in-flight nudge so its targets stop fighting resumed
    // auto-spin + the drag clamp. The pitch excess eases back to 60° below.
    const browsing = a11y && a11y.isBrowsing();
    if (wasBrowsing && !browsing) {
      navNudge.active = false;
    }
    wasBrowsing = browsing;

    // Sphere-to-card alignment ease. Runs even while the modal is open (so the sphere aligns
    // behind the blur), a frame-counted easeInOutCubic tween toward the nudge target.
    if (navNudge.active) {
      navNudge.frame += 1;
      const e = easeInOutCubic(Math.min(1, navNudge.frame / navNudge.frames));
      sphereOrient.y = navNudge.startY + (navNudge.targetY - navNudge.startY) * e;
      sphereOrient.x = navNudge.startX + (navNudge.targetX - navNudge.startX) * e;
      sphereOrient.z = navNudge.startZ + (navNudge.targetZ - navNudge.startZ) * e;
      if (e >= 1) navNudge.active = false;
    }
    if (sphereFormT >= TL.SPHERE_INTERACTIVE_T) {
      // Pause auto-rotation + drag while a modal is open — sphere freezes at its current rotation
      if (modal.getModalIdx() < 0) {
        if (!drag.isDragging) {
          drag.velX *= DRAG_FRICTION;
          drag.velY *= DRAG_FRICTION;
          // Auto-spin off under reduced motion and while browsing (globe holds the image).
          if (!reducedMotion && !(a11y && a11y.isBrowsing())) drag.velX += AUTO_ROT_SPEED;
        }
        // Inside the globe the far wall moves opposite the same world rotation, so negate the
        // delta to keep dragging tracking the surface the user sees.
        const dragDir = cameraInsideSphere ? -1 : 1;
        // Yaw spins freely; pitch is clamped (absolute angle) so the globe self-levels.
        sphereOrient.y += drag.velX * dragDir;
        sphereOrient.x += drag.velY * dragDir;
        // Pitch cap glides via pitchReleaseCap: ±60° for drag, up to ±85° while browsing, easing
        // back to 60° (PITCH_RELAX) after browse so leaving a beyond-cap card slides, not snaps.
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

      // Sphere-drag warp: baseline (while held) + velocity burst, eased toward a target rather
      // than snapped (a hard drop popped the barrel distortion when the modal opened).
      let warpTarget;
      if (modal.getModalIdx() < 0) {
        const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
        const burst = dragSpeed * SPHERE_DRAG_WARP_VEL;
        const baseline = drag.isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
        warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + burst);
      } else {
        warpTarget = 0;
      }
      sphereDragWarp += (warpTarget - sphereDragWarp) * 0.20;
      if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;
    } else {
      // Below interactive threshold: stop accumulating drag/auto-rot. Rotation is preserved
      // mid-scroll (a brief dip doesn't lose it); zeroed only at the very top of the section.
      drag.velX = 0;
      drag.velY = 0;
      sphereDragWarp += (0 - sphereDragWarp) * 0.20;
      if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;
      if (sphereFormT < TL.SPHERE_ORIENT_RESET_T) {
        resetSphereOrientation();
      }
    }

    // sphereRotActive is a fast-path flag so the rotation math can be skipped when upright.
    const sphereRotActive = (sphereOrient.y !== 0 || sphereOrient.x !== 0 || sphereOrient.z !== 0);
    refreshSphereRotQuat();
    return sphereRotActive;
  }

  // Project the focused browse image to screen space each frame so a11y.js's :focus-visible
  // ring hugs it as the nudge rotates it to centre. Closed-form (camera at (0,0,z), 60° FOV).
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

  // Pull-quote: JS adds .is-active once zoomT crosses pqAppearZoomT (sticky handles exit). On
  // scroll-up, a fast 0.15s fade so it disappears before the sticky element drifts down.
  function updatePullQuote(frame) {
    const { zoomT, scrollingDown } = frame;
    // Reduced motion: CSS owns it (opacity:1, no reveal) — no JS toggling.
    if (reducedMotion) return;
    if (pqEl) {
      if (zoomT >= pqAppearZoomT && !pqShown) {
        pqEl.style.transition = ''; // restore CSS default (0.7s, set in .css)
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

  // During fold: slide sphereGroup forward so the sphere-camera distance lerps FOLD_SPHERE_DIST
  // → CAM_Z_SPHERE. Cards not yet on the sphere subtract sphGroupZ so they stay at world z≈0.
  // Runs at sphereFormT===0 too so sphGroupZ is CONTINUOUS at that boundary (else a forward dart).
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

  // Global chromatic-aberration SVG filter on the canvas: vertical R/B shift tracks scroll
  // velocity, cleared on settle.
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
    // sm pins 8px from viewport inline-start;
    // md uses the 24px-grid-aligned position with centering.
    const gridLeft = (bp.name === 'sm')
      ? 8
      : 24 + Math.max(0, (W - 48 - 1392) / 2);
    const inlineStartSide = isRtl() ? 'right' : 'left';
    const inlineEndSide = isRtl() ? 'left' : 'right';
    const insetStr = `${gridLeft}px`;
    const opStr = arcCopyOp.toFixed(3);
    const transformStr = `translateY(${arcCopySlide.toFixed(1)}px)`;
    if (inlineStartSide !== arcCopy.startSide) {
      arcCopy.el.style[inlineEndSide] = '';
      arcCopy.startSide = inlineStartSide;
      arcCopy.startStr = '';
    }
    if (insetStr !== arcCopy.startStr) {
      arcCopy.el.style[inlineStartSide] = insetStr;
      arcCopy.startStr = insetStr;
    }
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

  // Card transform stage. Each card runs one phase branch per frame: arc → peel → grid-dwell →
  // fold → sphere. The four place*Card branches + dispatcher stay in this file (they read deeply
  // from the closure). Per-frame values come from the shared `frame` context. See README.

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
    // Near-camera proximity fade: card depth in front of the lens (world z = sphGroupZ +
    // mesh.position.z). Cull only at depth ≤ 0 (not the fade edge, else scroll jitter flashes it).
    const depth = camera.position.z - (sphGroupZ + mesh.position.z);
    if (depth <= 0) { mesh.visible = false; return; }
    // Thresholds scale with THIS card's rendered height (card.sphereWorldH), not the geometry base.
    const fadeEnd = NEAR_FADE_END * card.sphereWorldH;
    const fadeStart = NEAR_FADE_START * card.sphereWorldH;
    const proxFade = Math.max(0, Math.min(1, (depth - fadeEnd) / (fadeStart - fadeEnd)));
    mesh.scale.set(card.sphereScaleSX * hs, card.sphereScaleSY * hs, hs);
    setCardUV(mesh, 1, 1, 0, 0);
    setCardAspect(mesh, card.imgAspect);
    if (sphereRotActive) {
      mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      mesh.quaternion.copy(card.sphereQuat);
    }
    applyCardFacing(mesh);
    mesh.renderOrder = 0;
    // Compose the near-camera proximity fade with the texture-ready reveal (both drive dissolve +
    // opacity): take the max dissolve / min opacity so neither un-hides what the other hides.
    const proxDis = 1 - proxFade;
    const revealDis = 1 - card.revealT;
    mesh.material.opacity = Math.min(proxFade, card.revealT);
    mesh.material.uniforms.uDissolve.value = Math.max(proxDis, revealDis);
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = proxFade;
    // Hover composes additively on transition CA. uHoverPos anchors the warp at the cursor UV
    // when hovered; otherwise the drag warp uses the card centre (0.5, 0.5).
    if (CA_ENABLED) {
      mesh.material.uniforms.uCA.value = cardCA + card.hoverT * HOVER_CA;
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + sphereDragWarp;
      if (card.hoverT > 0.01) {
        mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
      } else {
        mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
      }
    }
    // CA smear: approximate world delta as depth × angular velocity (front cards smear more).
    applyMotionCA(mesh, card.spherePos.z * drag.velX, -card.spherePos.z * drag.velY);
  }

  // Branch: grid → sphere fold. Lerps FROM the card's live `stage` transform (collapses to the
  // grid slot at gpE >= 1) TO its sphere slot by fdE, so the fold can open mid-peel without a snap.
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
    mesh.scale.set(
      lerpN(stage.scale, card.sphereScaleSX, fdE),
      lerpN(stage.scale, card.sphereScaleSY, fdE),
      1,
    );
    setCardUV(
      mesh,
      lerpN(card.arcRepeatX, 1, fdE),
      lerpN(card.arcRepeatY, 1, fdE),
      lerpN(card.arcOffsetX, 0, fdE),
      lerpN(card.arcOffsetY, 0, fdE),
    );
    setCardAspect(mesh, lerpN(CARD_ASPECT, card.imgAspect, fdE));
    // Orientation slerps gridQuat → sphereQuat (upright, not the live peel orientation, which
    // would flip the face through the camera plane). The residual peel spin (stage.rotZ −
    // gridTilt, → 0 at peel end) is reapplied about local Z so it spins in-plane like the peel.
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
    // Blend the facing tilt in over the fold (scaled by fdE) so it lands continuous with
    // placeSphereCard (else it snaps when fdE hits 1).
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
    setCardUV(mesh, card.arcRepeatX, card.arcRepeatY, card.arcOffsetX, card.arcOffsetY);
    setCardAspect(mesh, CARD_ASPECT);
    mesh.quaternion.copy(card.gridQuat);
    mesh.renderOrder = N_TOTAL - i;
    mesh.material.opacity = 1;
    applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  // Compute a card's live "stage" transform on the arc→grid continuum at peel ease gpE (0 = arc,
  // 1 = grid slot). Returns { slot, x, y, z, scale, rotZ } — serves both the arc/peel render and
  // the ORIGIN of the fold lerp (at gpE >= 1 it collapses to the grid slot).
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

    // peelStartRot: reset on the arc; else snapshot the first peel frame's rotation, normalized
    // within ±π of gridTilt. Direct z-angle lerp avoids the slerp hemisphere flip at atan2's wrap.
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

  // Branch: arc phase (waiting to peel, or peeling arc→grid). Renders the live `stage`; render
  // order + motion-CA strength differ between the pure-arc (gpE <= 0) and peeling sub-phases.
  function placeArcCard(card, mesh, i, gpE, stage, prevMeshX, prevMeshY) {
    const { N_TOTAL, N_VISIBLE } = bp;
    mesh.visible = true;
    setCardAspect(mesh, CARD_ASPECT);
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

  // Per-card dispatcher: derive this card's timing (peel/fold easings, CA, hover), then run one
  // phase branch. Called once per card by updateCardTransforms.
  function updateCardTransform(i, frame) {
    const { progress, gridFormT, gpWin, sphereFormT, entryRot } = frame;
    const { N_TOTAL } = bp;
    const card = cards[i];
    const { mesh } = card;

    // Skip cards the modal manages (active card + swipe-neighbors) — modal.js drives them.
    if (modal.isCardManaged(card)) return;

    // Advance the texture-ready reveal (started in onEach) and the one-time sm-barrel reflow morph
    // (set up in resolveMasonryLayout). Both must run before the branch reads revealT/spherePos.
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
      card.imgAspect = lerpN(mo.iaFrom, mo.iaTo, e);
    }

    // Arc → grid peel stagger: i-based cascade + per-card jitter.
    const baseDelay = (i / Math.max(1, N_TOTAL - 1)) * TL.GRID_PEEL_STAGGER;
    const jitter = (card.peelJitter - 0.5) * TL.ARC_PEEL_JITTER;
    const gpDelay = Math.max(0, Math.min(TL.GRID_PEEL_STAGGER, baseDelay + jitter));
    const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
    const gpE = easeOutCubic(gpLocalT);

    // Grid → sphere fold: begins when this card's peel reaches FOLD_START_LOCAL_T. The gate is
    // on the raw peel localT, not the eased gpE.
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
      ) * CA_STRENGTH;
      mesh.material.uniforms.uCA.value = cardCA;
      mesh.material.uniforms.uWarp.value = 0; // sphere block re-applies from hoverT below
    }

    // Hover state ease — gated on the global interactive threshold (not per-card fdE, so
    // late-folding cards hover at sphereFormT=0.8). Visual effects render only in the sphere block.
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T || reducedMotion) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * HOVER_RATE;

    // Contour/reveal defaults for the non-sphere phases (placeSphereCard overrides them with its
    // own proximity+reveal combine). uDissolve doubles as the reveal un-dissolve here and the
    // near-camera dissolve in the sphere phase, so it must be (re)set every frame.
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = 1;
    mesh.material.uniforms.uDissolve.value = 1 - card.revealT;

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

  // Stage: hint-exit signal. Owns textExitProgress (0→1) driving the hint dissolve + cursor
  // retirement. Separate from updateClickDragText because that stage early-returns before the
  // interactive range — the scroll-out that resets this.
  function updateHintExitProgress(frame) {
    const { sphereFormT } = frame;
    // Reset on scroll-out of the interactive range (fresh on re-entry).
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T) {
      textExitProgress = 0;
      return;
    }
    if (reducedMotion || !drag.isDragging || textExitProgress >= 1) return;
    // A vertical touch drag is page scroll, not a globe drag — don't accrue during it (else the
    // hint retires before the user ever spun the globe). See interaction.js's axis lock.
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

  // Stage: "Click & Drag" hint text. Warps in on fold, settles faint, fades on zoom, dissolves
  // on first drag (textExitProgress). Reads frame.foldSphDist + live sphereDragWarp, so it runs
  // after both. No-op until the async font build assigns textMesh. See README (Behavior notes).
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
      textMesh.scale.setScalar(TEXT_SCALE_ENTER);
      return;
    }

    const { CAM_Z_SPHERE, SPHERE_R } = bp;
    // Remap so 0→1 covers [TEXT_APPEAR_START, 1].
    const sfRaw = (sphereFormT - TL.TEXT_APPEAR_START) / (1 - TL.TEXT_APPEAR_START);
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

  // Per-frame tick — thin orchestrator. Builds `frame`, runs each stage in a FIXED, load-bearing
  // order (producers before consumers; modal.updateAnimation reads the prev frame's
  // sphereGroup.position + this frame's refreshed sphereRotQuat). Keep it intact.
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
    updateArcCopy(frame);
    renderScene(frame.activeCamera);
  }

  // rAF driver. startTicker/stopTicker are called from initRuntime and destroy.
  let rafId = 0;
  function rafLoop() { tick(); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() {
    if (rafId) return;
    // Reset the velocity baseline so a resume after an off-screen scroll doesn't spike scrollVel.
    frameInput.prevLenisY = window.scrollY;
    rafId = requestAnimationFrame(rafLoop);
  }
  function stopTicker() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }
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
  // Reduced-motion media query + listener (a mid-session OS toggle rebuilds; see doLayout).
  let reducedMotionMQ = null;
  let reducedMotionHandler = null;
  let layoutObs = null; // ResizeObserver keeping block metrics fresh as page content loads
  let intersectionObs = null; // IntersectionObserver gating the rAF loop on visibility
  let textureLoadGeneration = 0;

  function initRuntime() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas) return false;

    reducedMotion = prefersReducedMotion();
    root.classList.toggle('globe-gallery-reduced', reducedMotion);

    // Reduced motion: canvas into normal flow (absolute in the static world) so the globe
    // scrolls away; top nudge clears the section above. See README (Reduced motion).
    if (reducedMotion) {
      canvas.style.position = 'absolute';
      canvas.style.top = '8vh';
    } else {
      canvas.style.position = '';
      canvas.style.top = '';
    }

    W = window.innerWidth;
    H = window.innerHeight;

    // Resolve the breakpoint profile before anything reads bp.*.
    const band = resolveBP(W);
    bp = resolveBpProfile(band.name, band.cfg, usesCylinderGeometry(band.name));

    try {
      const aa = bp.name === 'sm' ? ANTIALIAS_SM : ANTIALIAS_MD;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: aa, alpha: true });
    } catch (e) {
      renderer = null;
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    function doLayout() {
      W = window.innerWidth;
      H = window.innerHeight;

      // A band crossing (768px) or a reduced-motion toggle rebuilds via destroy()+init()
      // (geometry + RM layout are baked at build time); resizing within a band takes the cheap
      // path. Pointer precision is read at init only — a mid-session mouse/trackpad swap needs a
      // reload (out of scope; see README).
      const nextBand = resolveBP(W);
      const nextReducedMotion = prefersReducedMotion();
      if (nextBand.name !== bp.name || nextReducedMotion !== reducedMotion) {
        // eslint-disable-next-line no-use-before-define -- hoisted destroy/initRuntime mutual ref
        destroy();
        if (initRuntime() === false) root.classList.add('globe-gallery-empty');
        return;
      }
      blockDocTop = root.getBoundingClientRect().top + window.scrollY;
      blockHeight = root.offsetHeight || window.innerHeight * 7;
      const pinFactor = parseFloat(getComputedStyle(root).getPropertyValue('--pq-pin-factor')) || 0.44;
      pqAppearZoomT = Math.max(0, (1 - pinFactor) - TL.PQ_APPEAR_LEAD);
      // Re-apply DPR (can change when dragging between monitors of different density).
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      // Hint-text plane size tracks the viewport — rebuild on within-band resize.
      if (textMesh) buildTextMesh();
    }
    doLayout();
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = doLayout;
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Reduced motion can toggle mid-session (OS setting) without a resize, so listen directly;
    // doLayout rebuilds so the static/animated layout switch never needs a reload.
    if (reducedMotionMQ && reducedMotionHandler) {
      reducedMotionMQ.removeEventListener('change', reducedMotionHandler);
    }
    reducedMotionMQ = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
    if (reducedMotionMQ) {
      reducedMotionHandler = doLayout;
      reducedMotionMQ.addEventListener('change', reducedMotionHandler);
    }

    // Recompute block metrics whenever page height changes (content loading above shifts
    // offsetTop; blockHeight=0 at first paint would make progress=Infinity).
    if (layoutObs) layoutObs.disconnect();
    layoutObs = new ResizeObserver(() => {
      blockDocTop = root.getBoundingClientRect().top + window.scrollY;
      blockHeight = root.offsetHeight || window.innerHeight * 7;
    });
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

    // Focus-snap guard listeners (see snapToInteractive).
    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    // Cache the global-CA SVG filter elements.
    caFilterR = q('.globe-gallery-ca-r-offset');
    caFilterB = q('.globe-gallery-ca-b-offset');
    arcCopy.el = q('.globe-gallery-arc-copy');
    arcCopy.startSide = '';
    arcCopy.startStr = '';
    arcCopy.opStr = '';
    arcCopy.transformStr = '';

    modal.setup();

    // Build the scene up front so the block paints immediately: cards render as contours and each
    // photo un-dissolves in as its texture lands, instead of blocking on the whole set.
    buildCards();
    buildTextMesh();
    a11y.setup();
    renderReady = true;
    syncTicker();

    const loadGeneration = textureLoadGeneration;
    const onEachTexture = (i, tex, texData) => {
      if (loadGeneration !== textureLoadGeneration) { tex.dispose(); return; }
      textures[i] = tex;
      cardTexData[i] = texData;
      const card = cards[i];
      if (!card) return;
      card.mesh.material.map = tex; // property proxy writes uMap
      // Cover-crop UVs (used by the arc/grid/fold phases; the sphere renders identity UVs).
      card.arcRepeatX = texData.arcRepeatX;
      card.arcRepeatY = texData.arcRepeatY;
      card.arcOffsetX = texData.arcOffsetX;
      card.arcOffsetY = texData.arcOffsetY;
      // Native image aspect — the modal reads this on every breakpoint for its plane aspect.
      card.sphereScaleX = texData.sphereScaleX;
      // md sphere also sizes the rendered card per-card now (positions are index-based, no reflow);
      // the sm barrel packs against all aspects, so it re-solves its render sizing once in onDone.
      if (!bp.CYLINDER) updateCardSphereSizing(card, texData.sphereScaleX);
      card.hasTexture = true; // revealT eases up in updateCardTransform
    };
    const onDoneTextures = (loadedTextures, loadedTexData) => {
      if (loadGeneration !== textureLoadGeneration) {
        loadedTextures.forEach((t) => t && t.dispose());
        return;
      }
      textures = loadedTextures;
      cardTexData = loadedTexData;
      if (bp.CYLINDER) resolveMasonryLayout(); // recomputeDragFlip runs when the morph settles
      else recomputeDragFlip();
    };
    const cardMaxTex = bp.name === 'sm' ? CARD_TEX_SM : CARD_TEX_MD;
    loadCardTextures({
      count: bp.N_TOTAL,
      // Request the image already sized to our texture cap so slow links download ~tens of KB,
      // not the full-res source (we downscale to cardMaxTex client-side regardless).
      getSrc: (i) => optimizeImgUrl(getCardMetadata(i).img, cardMaxTex),
      planeAspect: CARD_ASPECT,
      maxTex: cardMaxTex,
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
    if (renderer) {
      renderer.domElement.style.filter = '';
      globalCaFilterOn = false;
      // NOTE: do NOT forceContextLoss() here — the canvas element is reused across rebuilds
      // (band crossings / reduced-motion toggles), and a force-lost context is never restored,
      // so the next renderer on the same canvas is born dead ("Context Lost"). dispose() alone
      // frees this renderer's GPU resources.
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
    cardTexData = [];
    // Free the hint-text GPU resources + reset its exit progress before scene teardown.
    disposeTextMesh();
    textExitProgress = 0;
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    modal.destroy();
    a11y.teardown();
    if (arcCopy.el) arcCopy.el.style.cssText = '';
    if (pqEl) { pqEl.classList.remove('is-active'); pqEl.style.transition = ''; pqShown = false; }
    frameInput.prevLenisY = 0; frameState.scrollVel = 0;
    // Reset sphere orientation + drag/nudge state: the closure survives a rebuild, so without
    // this a pre-rebuild tilt carries over. See README (destroy resets).
    resetSphereOrientation();
    sphereDragWarp = 0;
    drag.isDragging = false; drag.velX = 0; drag.velY = 0;
    wasBrowsing = false;
    // NOTE: `bp` intentionally NOT cleared — doLayout compares it, initRuntime overwrites it.
  }

  return { init: initRuntime, destroy };
}

export default async function init(el) {
  // Reduced motion: static, still-interactive globe in plain document flow. See README.
  if (prefersReducedMotion()) {
    el.classList.add('globe-gallery-reduced');
  }

  // Extract authored content (incl. the UI labels) before buildGlobeDom() wipes the children.
  const {
    arcCopy, pullQuote, hintText, instructions, labels, fragmentHref,
  } = parseAuthoredContent(el);

  // buildGlobeDom mints + returns the per-instance id suffix (reused for the CA filter ref)
  // and fills the arc-copy / pull-quote slots.
  const gid = buildGlobeDom(el, labels, { arcCopy, pullQuote });

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
