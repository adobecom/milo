import * as THREE from './three.module.min.js';
import {
  parseAuthoredContent, fetchFragmentCards, buildGlobeDom,
  optimizeImgUrl, layoutQuote,
} from './src/authoring.js';
import {
  createCardMaterial, createTextMaterial, createPlaceholderTexture,
  loadCardTextures, loadModalTexture as loadModalTextureRaw, createClickDragTexture,
} from './src/materials.js';
import createGalleryA11y from './src/a11y.js';
import createGlobeModal from './src/modal.js';
import createInteraction from './src/interaction.js';
import createGlobeControls from './src/controls.js';
import {
  easeOutCubic, easeInOutCubic, easeInOutQuint, easeOutExpo, lerpN, coverFit,
  buildArcCtx, getFanData, cssToWorld, rotateArcPoint, arcCamZ,
} from './src/math.js';
import * as TL from './src/timeline.js';

const CARD_ASPECT = 456 / 631;

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const BREAKPOINTS = {
  md: {
    minWidth: 768,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 6.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 65,
    CAM_Z_END: -60,
    GRID_WINDOW_COLS: 9,
    GRID_ROWS: 5,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    ARC_DENSE_FRACTION: 0.5, // share clustered into the off-screen arc flank
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
  },
  sm: {
    minWidth: 0,
    ARC_SPAN: 3.6,
    SPHERE_R: 16,
    CARD_H_SPHERE: 11.0, // PlaneGeometry base only; masonry sets the visible size
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    GRID_WINDOW_COLS: 3,
    GRID_ROWS: 8,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    ARC_DENSE_FRACTION: 0.4,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

// Card caps are on texture HEIGHT; modal caps are on the longest side.
const CARD_TEX_SM = 256;
const CARD_TEX_MD = 768;
const MODAL_TEX_SM = 768;
const MODAL_TEX_MD = 2048;
const ANTIALIAS_SM = false;
const ANTIALIAS_MD = true;
const GLOBAL_CA_SM = false;
const GLOBAL_CA_MD = true;

// Yaw-only drags (touch / narrow): a cylindrical masonry wall replaces the Fibonacci sphere.
const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_GAP_RATIO: 0.20, // inter-card gap as a fraction of card width
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

const PQ_HOLD_CLEARANCE_BAND_FRAC = 0.045; // of band; quote bottom → next section top

// The reveal's share of the hold; the rest is dead scroll, nothing changing. See README.
const PQ_REVEAL_END = 0.50;

// Shares of the reveal window; horizontals lead verticals.
const PQ_DRAW_H_SPAN = 0.82;
const PQ_DRAW_V_START = 0.26;

const PQ_HOLD_EASE = 0.08; // per 60fps frame, rescaled by dtScale at the use site
const PQ_HOLD_IN_MS = 1400; // fastest the hold may play, forwards
const PQ_HOLD_OUT_MS = 450; // and back
const PQ_HOLD_MAX_DT = 100; // a tab-away must not arrive as one step
const PQ_HOLD_STALL_MS = 140; // no new ground for this long and the scroll counts as stopped
const PQ_HOLD_FLIP = 0.01; // retrace that is a real reversal, not noise; also how a stop is seen
const PQ_COPY_LAG = [0, 0.18, 0.28]; // quote, name, role — as a share of the sweep
const PQ_COPY_KEYS = ['q', 'n', 'r'];
const PQ_COPY_LINE_SPAN = 0.55; // each line's own share; the lags divide what is left

const clamp01 = (v) => (v > 0 ? Math.min(1, v) : 0); // NaN -> 0

const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width
const ARC_DENSE_SPLIT = 0.50; // fanT boundary: low-i cards below it peel first

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
const RING_TANHALF = Math.tan(Math.PI / 6);

// Chromatic aberration.
const CA_ENABLED = true;
const CA_STRENGTH = 0.012; // radial UV shift per channel
const CA_MOTION_STRENGTH = 1.0; // directional UV shift max
const CA_MOTION_STRENGTH_ARC = 0.04;
const SCROLL_VEL_MAX = 14; // px/frame scroll speed that saturates the motion trail
const CA_PX_MAX = 4; // max vertical px shift for the canvas SVG filter

// Hover (sphere phase only).
const HOVER_CA = 0.025;
const HOVER_WARP = 0.4;
const HOVER_SCALE = 0.25; // added, not replacing: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target

// Per-card un-dissolve once its photo lands.
const REVEAL_RATE = 0.06; // per-frame
// One-time sm-barrel reflow after all textures load.
const MASONRY_MORPH_RATE = 0.05; // per-frame

// Near-camera proximity fade, in card-heights of depth.
const FACING_EDGE_ON_BAND = 0.25; // |normal.z| half-width of the facing fade-out band
const DRAG_FLIP_MAX_CAM_FRAC = 0.95; // ceiling on dragFlipZ as a fraction of CAM_Z_SPHERE
const NEAR_FADE_START = 2.5; // depth where the fade begins
const NEAR_FADE_END = 1.6; // depth at which the card is fully transparent
const NEAR_FADE_OPACITY_BIAS = 0.4; // exponent on the prox opacity ramp (<1 = fade out later)
const NEAR_FADE_DISPERSE_RAMP = 0.9; // exponent on uDisperse, applied here not in the shader

const SPHERE_DRAG_WARP_BASELINE = 0.05; // while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on the combined value
const SPHERE_DRAG_WARP_EASE = 0.20; // per-frame ease toward the target

// "Click & Drag" hint text: a WebGL plane behind the sphere.
const TEXT_BEHIND_GAP = 15; // world units behind the sphere back surface
const TEXT_WARP_ENTER_MAX = 4.50;
const TEXT_OPACITY_PEAK = 0.15;
const TEXT_OPACITY_RESTING = 0.06;
const TEXT_CA_WARP_MUL = 1.5;
const TEXT_WARP_OVERFLOW = 0.6; // extra mesh scale per warp unit
// hintDismissProgress accrual per 60fps frame of drag.
const HINT_EXIT_DIST_RATE = 0.018;
const HINT_EXIT_HOLD_RATE = 0.0022; // ~0.13/s at 60fps
const HINT_EXIT_BURST_RATE = 0.010;

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

  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + gapRatio);
    const gap = cardW * gapRatio;
    const colH = new Array(cols).fill(0);
    const placed = new Array(n);
    const order = Array.from({ length: n }, (unused, i) => i)
      .sort((a, b) => clamped[a] - clamped[b]); // ascending aspect = descending height
    for (let k = 0; k < n; k += 1) {
      const i = order[k];
      const h = cardW / clamped[i];
      let best = 0;
      for (let c = 1; c < cols; c += 1) if (colH[c] < colH[best]) best = c;
      placed[i] = { col: best, offset: colH[best], w: cardW, h };
      colH[best] += h + gap;
    }
    const totals = colH.map((h) => Math.max(0, h - gap));
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
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, 1 - (2 * i) / total)));
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

  function getCardMetadata(i) {
    return CARD_CONTENT[i];
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
      GRID_WINDOW_COLS: cfg.GRID_WINDOW_COLS,
      GRID_ROWS: cfg.GRID_ROWS,
      // Listed explicitly, not spread, so the overlay's layout keys can't leak on.
      CARD_FACE_CAMERA: shape.CARD_FACE_CAMERA,
      CYLINDER: !!shape.CYLINDER,
      CYL_COLS_FIT: cfg.CYL_COLS_FIT ?? shape.CYL_COLS_FIT,
      CYL_GAP_RATIO: shape.CYL_GAP_RATIO,
      CYL_ASPECT_CAP: shape.CYL_ASPECT_CAP,
      CYL_BULGE: shape.CYL_BULGE,
      // Frustum height at the cylinder's centre plane — the column solve's vertical budget.
      CYL_FRUSTUM_H: 2 * Math.tan(Math.PI / 6) * cfg.CAM_Z_SPHERE,
      CARD_ROLL_JITTER: cfg.CARD_ROLL_JITTER,
      DRAG_GEARING: cfg.DRAG_GEARING,
      // Clamped so the spread keeps ≥1 card.
      ARC_DENSE_COUNT: Math.min(
        Math.round(cfg.ARC_DENSE_FRACTION * nTotal),
        Math.max(0, nTotal - 1),
      ),
    });
  }

  let renderer; let scene; let camera; let cameraOrtho; let
    sphereGroup;
  let cards = [];
  let textures = [];
  let cardAspects = []; // per-card native image aspect (index-aligned with CARD_CONTENT)
  let placeholderTex = null; // shared transparent texture for not-yet-loaded cards
  const masonryMorph = { active: false, t: 0 };
  let gridCardW = 0; let
    gridTilts = [];

  // The single source for the clocks — never cache them.
  const frameState = TL.createFrame();
  const frameInput = TL.createFrameInput();

  let blockDocTop = 0; // block's top in document space (the scroll runway)
  let blockHeight = 0; // its full scroll length
  // zoomT the last card leaves the screen at; see publishPqAppearZoomT.
  let pqAppearZoomT = 0.5;
  let pqAppearTailT = 0.5; // same cue in tail-fraction space, for the CSS pin
  let formationVh = 0; // from --gg-formation-vh (see readCssVars)
  let W = 0;
  let H = 0;
  let navH = 0; // --gg-nav-h; see README (The nav band)

  const worldEl = q('.globe-gallery-world');
  const pqEl = q('.globe-gallery-pullquote');
  // The cached strings elide unchanged style writes.
  const pq = {
    quoteEl: q('.globe-gallery-pullquote-quote'),
    lineEls: [], // one per rendered line
    splitW: 0, // box width they were split at
    holdT: 0,
    holdV: 0, // followHold's output — the hold every phase reads
    holdMs: 0,
    holdPeak: 0, // furthest the scroll's own hold has reached in the current direction
    holdMoveMs: 0, // when it last reached a new one; nothing for PQ_HOLD_STALL_MS means stopped
    holdDir: -1,
    frameStr: '',
    copyStr: '',
  };

  let caFilterR = null; // SVG feOffset element for red channel
  let caFilterB = null; // SVG feOffset element for blue channel
  let globalCaFilterOn = false; // whether canvas.style.filter currently holds the CA url
  const arcCopy = { el: null, opStr: '', transformStr: '' };

  // Shared by reference with interaction.js. pendingX/Y: exact unapplied travel (rad).
  // velX/Y: smoothed velocity per 60fps frame.
  const drag = { isDragging: false, velX: 0, velY: 0, pendingX: 0, pendingY: 0 };
  let renderReady = false;
  let onScreen = true; // assume visible until the observer's first callback corrects it
  let canvasHidden = false; // set by updateCanvasVisibility; also skips the scene draw
  let sphereDragWarp = 0;
  let cameraInsideSphere = false;
  let dragFlipZ = 0; // camera z at which drag inverts; set in buildCards
  let fadeRefH = 0; // wall-wide card height the near-camera fade bands off; recomputeDragFlip
  let textMesh = null;
  let hintDismissProgress = 0; // 0→1 over drag activity; retires the barrel's DOM hint

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
  const foldRotQuat = new THREE.Quaternion();
  const stageQuat = new THREE.Quaternion();
  const stageEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const tmpVec3 = new THREE.Vector3();
  const fanScratch = {};
  const wpScratch = {};
  const stageScratch = {};
  const entryScratch = {};

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

  let suppressFocusSnap = false;

  let arcCtx = null; // current arc context, rebuilt per frame in tick() via buildArcCtx

  function computeGridLayout() {
    if (cards.length === 0) return;
    const { GRID_WINDOW_COLS, GRID_ROWS, CARD_W_SPHERE } = bp;
    gridCardW = (bp.name === 'sm')
      ? W / (GRID_WINDOW_COLS + (GRID_WINDOW_COLS - 1) * GRID_GAP_RATIO)
      : W / GRID_WINDOW_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const gridCols = Math.max(GRID_WINDOW_COLS, Math.ceil(cards.length / GRID_ROWS));
    const colShift = Math.round((gridCols - GRID_WINDOW_COLS) / 2);
    const totalW = GRID_WINDOW_COLS * gridCardW + (GRID_WINDOW_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    const tiltEuler = new THREE.Euler(0, 0, 0);
    // Column-major: i=0 → lower-right, sweeping bottom-to-top then right-to-left.
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const col = GRID_WINDOW_COLS - 1 - Math.floor(i / GRID_ROWS) + colShift;
      const row = GRID_ROWS - 1 - (i % GRID_ROWS);
      const gx = -totalW / 2 + col * (gridCardW + gridGap) + gridCardW / 2;
      const gy = totalH / 2 - row * (gridCardH + gridGap) - gridCardH / 2;
      const tilt = gridTilts[i] || 0;
      // Written through, not replaced — this reruns on every resize.
      card.gridPos.set(gx, gy, 0);
      card.gridScale = gridCardW / CARD_W_SPHERE;
      card.gridTilt = tilt;
      card.gridQuat.setFromEuler(tiltEuler.set(0, 0, tilt));
      card.gridCol = col;
      card.gridRow = row;
    }
  }

  function cardAspect(i) {
    return cardAspects[i] || CARD_ASPECT;
  }

  function buildCards() {
    const {
      N_TOTAL, N_VISIBLE, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE, GRID_WINDOW_COLS, GRID_ROWS,
      CARD_ROLL_JITTER, CYLINDER,
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
        gapRatio: bp.CYL_GAP_RATIO,
        aspectCap: bp.CYL_ASPECT_CAP,
        bulge: bp.CYL_BULGE,
      })
      : null;

    for (let i = 0; i < N_TOTAL; i += 1) {
      const srcAspect = cardAspect(i);
      const mas = masonry ? masonry[i] : null;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      const mat = createCardMaterial({
        texture: textures[i] || placeholderTex,
        aspect: CARD_ASPECT, // arc/grid start shape; per-phase stages update uAspect
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = N_VISIBLE - i;
      sphereGroup.add(mesh);

      const sp = mas
        ? mas.pos.clone()
        : fibSpherePos(i, N_TOTAL, SPHERE_R);

      // lookAt target is INSIDE the surface so local +Z points out.
      const faceTarget = mas
        ? sp.clone().sub(mas.normal)
        : new THREE.Vector3(0, 0, 0);
      const m = new THREE.Matrix4()
        .lookAt(sp, faceTarget, new THREE.Vector3(0, 1, 0));
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
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
        gridCol: GRID_WINDOW_COLS - 1 - Math.floor(i / GRID_ROWS),
        gridRow: GRID_ROWS - 1 - (i % GRID_ROWS),
        peelJitter: Math.random(),
        srcAspect,
        sphereScaleSX: mas ? mas.w / CARD_W_SPHERE : srcAspect / CARD_ASPECT,
        sphereScaleSY: mas ? mas.h / CARD_H_SPHERE : 1,
        // ACTUAL rendered height: on masonry CARD_H_SPHERE is only the geometry base.
        sphereWorldH: mas ? mas.h : CARD_H_SPHERE,
        hoverT: 0, // eased 0→1 hover progress (sphere phase only)
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
        hasTexture: !!textures[i], // false until this card's photo loads (onEach flips it)
        revealT: textures[i] ? 1 : 0, // eased 0→1 texture-ready un-dissolve
        peelStartRot: null, // set on the first peel frame, cleared back at gpE 0
        morph: null, // the sm masonry re-solve's from/to pair, while one is running
      });
    }
    // eslint-disable-next-line no-use-before-define -- hoisted helper defined just below
    recomputeDragFlip();

    gridTilts = [];
    for (let ti = 0; ti < N_TOTAL; ti += 1) {
      gridTilts.push((Math.random() - 0.5) * 0.175); // ±5° in radians
    }
    computeGridLayout();
  }

  // Camera z below which drag inverts, anchored to where cards VANISH. Sole writer of fadeRefH.
  // Rerun once textures land (sphereWorldH starts as a placeholder).
  function recomputeDragFlip() {
    if (!sphereGroup || cards.length === 0) return;
    const groupScale = sphereGroup.scale.x || 1;
    const maxRadial = cards.reduce(
      (m, c) => Math.max(m, Math.hypot(c.spherePos.x, c.spherePos.z)),
      0,
    ) * groupScale;
    fadeRefH = cards.reduce((s, c) => s + c.sphereWorldH, 0) / cards.length;
    dragFlipZ = Math.min(
      maxRadial + NEAR_FADE_END * fadeRefH * groupScale,
      bp.CAM_Z_SPHERE * DRAG_FLIP_MAX_CAM_FRAC,
    );
    // eslint-disable-next-line no-use-before-define -- hoisted; both are plain function decls
    publishPqAppearZoomT();
    // eslint-disable-next-line no-use-before-define -- same
    publishPqMetrics(); // guards no-op before layout
  }

  // Read live each frame, so writing these morphs the card into its native shape.
  function updateCardSphereSizing(card, srcAspect) {
    card.srcAspect = srcAspect;
    card.sphereScaleSX = srcAspect / CARD_ASPECT;
    card.sphereScaleSY = 1;
    card.sphereWorldH = bp.CARD_H_SPHERE;
  }

  // sm barrel: re-solve the packing once every aspect is known; each card morphs to its slot.
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

  // Async: waits for fonts so it renders in Adobe Clean.
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
    // Two-arg then, NOT .then().catch(): a throw inside create must not re-run create and
    // orphan the mesh it already added.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(create, create);
    else create();
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
    drag.velX = 0;
    drag.velY = 0;
  }

  // a11y.js's centerCard: the shared yaw/pitch solve plus the screen-Z roll that cancels the
  // card's residual tilt.
  function centerCardOnScreen(idx) {
    if (!cards[idx]) return;
    const { sphereQuat } = cards[idx];
    const { targetYaw, targetPitch } = cardCenterYawPitch(idx, KEY_PITCH_CAP, bp.YAW_ONLY);
    // The card's world up at that (pitch, yaw), pre screen-roll.
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
    drag.velX = 0;
    drag.velY = 0;
  }

  // dx/dy: world-space delta this frame. ampOverride defaults to max(scrollVel, dragSpeed).
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

  function measureBlock() {
    blockDocTop = root.getBoundingClientRect().top + window.scrollY;
    blockHeight = root.offsetHeight;
  }

  function readCssVars() {
    const rootStyle = getComputedStyle(root);
    const cssNum = (prop) => {
      const n = parseFloat(rootStyle.getPropertyValue(prop));
      return Number.isFinite(n) ? n : null;
    };
    const vh = cssNum('--gg-formation-vh');
    if (vh !== null) formationVh = vh;
    const nav = cssNum('--gg-nav-h');
    if (nav !== null) navH = nav;
  }

  const measureViewportH = () => Math.max(1, worldEl.offsetHeight);

  // The cue is where the last card leaves the SCREEN, not where the camera clears the shell:
  // placeSphereCard hides a card NEAR_FADE_END card-heights out, and the deepest card centre
  // sits at -SPHERE_R under any rotation. fadeRefH 0 falls back to -SPHERE_R, which errs late.
  function publishPqAppearZoomT() {
    const clearZ = -bp.SPHERE_R + NEAR_FADE_END * fadeRefH;
    pqAppearZoomT = TL.zoomTAtCamZ(clearZ, bp.CAM_Z_SPHERE, bp.CAM_Z_END);
    // CSS pins against the tail, not the zoom span.
    pqAppearTailT = pqAppearZoomT * TL.ZOOM_TO_TAIL_T;
    root.style.setProperty('--gg-pq-appear-t', pqAppearTailT.toFixed(4));
  }

  // The hold spends the gap between the quote's bottom edge and the next section's top, which
  // depends on the authored quote's height. Publishes 0 when there is no room.
  function publishPqMetrics() {
    if (!pqEl || !pqEl.isConnected) return;
    const toVh = (px) => (px / H) * 100;
    const tailVh = toVh(blockHeight) - formationVh;
    if (!(tailVh > 0)) return;
    const nextSectionTopVh = (1 - pqAppearTailT) * tailVh;
    const opticalCenterPx = navH + (H - navH) / 2;
    const box = pqEl.getBoundingClientRect();
    const quoteBottomVh = toVh(opticalCenterPx + box.height / 2);
    const clearanceVh = (100 - toVh(navH)) * PQ_HOLD_CLEARANCE_BAND_FRAC;
    const freeVh = Math.max(0, nextSectionTopVh - quoteBottomVh - clearanceVh);
    root.style.setProperty('--gg-pq-hold-max', `${freeVh.toFixed(1)}vh`);

    // Mirror what CSS resolves for the pin, so the hold spans exactly the pinned scroll.
    const prefVh = parseFloat(getComputedStyle(root).getPropertyValue('--gg-pq-hold')) || 0;
    pq.holdT = Math.min(prefVh, freeVh) / tailVh;
  }

  // Both horizontals take h, both verticals v; the gradients carry the clockwise direction.
  function writeFrameVars(h, v) {
    const str = `${h.toFixed(4)};${v.toFixed(4)}`;
    if (str === pq.frameStr) return;
    pq.frameStr = str;
    pqEl.style.setProperty('--gg-pq-h', `${(h * 100).toFixed(2)}%`);
    pqEl.style.setProperty('--gg-pq-v', `${(v * 100).toFixed(2)}%`);
  }

  function formedScrollPx() {
    return Math.min((formationVh / 100) * H, blockHeight);
  }

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

  // Armed on blur/hidden, disarmed a frame after focus, so a tab-return can't re-snap.
  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => { requestAnimationFrame(() => { suppressFocusSnap = false; }); };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };

  const openModalAndDismissHint = (idx, x, y) => {
    hintDismissProgress = 1;
    modal.open(idx, x, y);
  };

  // Canvas taps only — the keyboard path reports itself.
  const openModalFromCanvas = (idx, x, y) => {
    openModalAndDismissHint(idx, x, y);
    if (modal.getModalIdx() >= 0) a11y?.trackCardOpen(idx);
  };

  a11y = createGalleryA11y({
    q,
    getCount: () => CARD_CONTENT.length,
    getSphereFormT: () => frameState.sphereFormT,
    getModalIdx: () => modal.getModalIdx(),
    interactiveThreshold: TL.SPHERE_INTERACTIVE_T,
    getCardLabel: (i) => {
      const m = getCardMetadata(i);
      return (m && m.alt) || `Image ${i + 1}`;
    },
    centerCard: centerCardOnScreen,
    openCard: (i) => openModalAndDismissHint(i, W / 2, H / 2),
    onFocus: snapToInteractive,
    galleryInstructions: instructions,
    gid,
  });

  controls = createGlobeControls({
    q,
    labels,
    getVisible: () => frameState.sphereFormT >= TL.SPHERE_INTERACTIVE_T
      && frameState.zoomT < pqAppearZoomT
      && modal.getModalIdx() < 0,
    getHintDismissed: () => hintDismissProgress > TL.HINT_DISMISS_T,
    rotate: (dir) => {
      hintDismissProgress = 1;

      rotateStep(dir);
    },
  });

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
    // Pitch follows geometry, not pointer type: the barrel is yaw-only for mouse too.
    getYawOnly: () => bp.YAW_ONLY,
  });

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

  let appliedViewOffsetY = null; // W and H are baked into the call; null on any change to either
  function applyCentringOffset(sphereFormT) {
    const offY = (navH / 2) * sphereFormT;
    if (offY === appliedViewOffsetY) return;
    appliedViewOffsetY = offY;
    if (offY) camera.setViewOffset(W, H, 0, -offY, W, H);
    else camera.clearViewOffset();
  }

  // Ortho on the arc, perspective from the fold on.
  function updateActiveCamera(frame) {
    const { sphereFormT, zoomT } = frame;
    const { CAM_Z_SPHERE, CAM_Z_END } = bp;
    let activeCamera;
    const camZArc = arcCamZ(H);
    if (sphereFormT === 0) {
      activeCamera = cameraOrtho;
      camera.position.z = camZArc;
    } else {
      activeCamera = camera;
      // easeInCubic matches the zoom's easeOutCubic; apparent size is held by sphereGroup.z.
      const camZ = zoomT === 0
        ? lerpN(camZArc, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
        : lerpN(CAM_Z_SPHERE, CAM_Z_END, easeOutCubic(zoomT));
      camera.position.z = camZ;
    }
    applyCentringOffset(sphereFormT);
    // Flip the drag once the camera is INSIDE; the threshold is dragFlipZ, not SPHERE_R.
    cameraInsideSphere = zoomT > 0 && Math.abs(camera.position.z) < dragFlipZ;
    return activeCamera;
  }

  // Refreshes sphereRotQuat; the rotation itself is applied per-card in updateCardTransform.
  function updateSphereRotation(frame) {
    const { sphereFormT, dtScale } = frame;

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
    const interactive = sphereFormT >= TL.SPHERE_INTERACTIVE_T;
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
      const dragDir = cameraInsideSphere ? -1 : 1;
      if (drag.isDragging) {
        // Held: position-driven off the (rate-limited) travel — no smoothing lag on normal frames.
        sphereOrient.y += stepX * dragDir;
        sphereOrient.x += stepY * dragDir;
        if (!interactive) { drag.velX = 0; drag.velY = 0; } // inert mid-fold: must not fling
      } else {
        // Released: velocity-driven coast.
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
    if (!frozen && interactive) {
      const dragSpeed = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
      const baseline = drag.isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
      warpTarget = Math.min(SPHERE_DRAG_WARP_MAX, baseline + dragSpeed * SPHERE_DRAG_WARP_VEL);
    }
    sphereDragWarp += (warpTarget - sphereDragWarp) * (1 - (1 - SPHERE_DRAG_WARP_EASE) ** dtScale);
    if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;

    // Full reset only at the very top — a dip mid-scroll keeps orientation and inertia.
    if (sphereFormT < TL.SPHERE_ORIENT_RESET_T) {
      resetSphereOrientation();
      drag.velX = 0;
      drag.velY = 0;
    }

    // Fast-path flag so the rotation math can be skipped when upright.
    const sphereRotActive = (sphereOrient.y !== 0 || sphereOrient.x !== 0 || sphereOrient.z !== 0);
    refreshSphereRotQuat();
    return sphereRotActive;
  }

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
    const cy = ((-ringWorld.y / halfViewH) * 0.5 + 0.5) * H + (appliedViewOffsetY || 0);
    const wPx = (halfWWorld / halfViewW) * W;
    const hPx = (halfHWorld / halfViewH) * H;
    a11y.setFocusRect(cx, cy, wPx, hPx);
  }

  function updateCanvasVisibility(frame) {
    const { lenisY, zoomT } = frame;
    const canvas = renderer.domElement;
    // RM: canvas is in normal flow (scrolls away, clips naturally) — just reveal once.
    if (reducedMotion) {
      canvasHidden = false;
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      return;
    }
    const showTrigger = blockDocTop - H * TL.ENTRY_LEAD_VH; // matches entryStart in computeFrame
    // Past the reveal every card is prox-faded out and the hint text has finished; the scene
    // holds nothing else, so the draw is skipped too.
    canvasHidden = lenisY < showTrigger
      || zoomT >= pqAppearZoomT + TL.CANVAS_HIDE_MARGIN_T;
    if (canvasHidden) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }
  }

  function updatePullQuoteCopy(reveal) {
    const p = reveal;
    const arrive = (lag) => easeOutCubic(clamp01((p - lag) / (1 - lag)));
    const lines = pq.lineEls;
    const last = lines.length - 1;
    let str = '';
    const vals = [];
    for (let i = 0; i < 3; i += 1) {
      vals.push(arrive(PQ_COPY_LAG[i]));
      str += `${vals[i].toFixed(3)};`;
    }
    // Each line snaps inside its own share; the shares stagger across the sweep.
    const lineVals = lines.map((_, i) => {
      const lag = last > 0 ? ((1 - PQ_COPY_LINE_SPAN) * i) / last : 0;
      return easeOutExpo(clamp01((p - lag) / PQ_COPY_LINE_SPAN));
    });
    lineVals.forEach((v) => { str += `${v.toFixed(3)};`; });
    if (str === pq.copyStr) return;
    pq.copyStr = str;
    for (let i = 0; i < 3; i += 1) {
      pqEl.style.setProperty(`--gg-pq-copy-${PQ_COPY_KEYS[i]}`, vals[i].toFixed(3));
    }
    lines.forEach((el, i) => el.style.setProperty('--gg-pq-line-v', lineVals[i].toFixed(3)));
  }

  // The one clock the pull-quote runs on: the scroll's hold, eased rather than read. scrollY
  // arrives quantised, so a slow scroll delivers a staircase, and the sweep amplifies each step
  // into several pixels of line travel — the ease is what turns that back into motion. It is
  // capped at the play-out rate so a flick cannot skip the sequence, direction needs PQ_HOLD_FLIP
  // of retrace to turn, and each direction only gains ground, so noise cannot walk the sweep back.
  // Stopped inside the reveal, the phase plays itself out; past it there is nothing to play.
  // See README.
  function followHold(target) {
    const now = performance.now();
    const dtMs = pq.holdMs ? Math.min(now - pq.holdMs, PQ_HOLD_MAX_DT) : 0;
    pq.holdMs = now;
    const fwd = pq.holdDir > 0;
    const gained = fwd ? target > pq.holdPeak : target < pq.holdPeak;
    const turned = fwd ? target < pq.holdPeak - PQ_HOLD_FLIP : target > pq.holdPeak + PQ_HOLD_FLIP;
    if (gained || turned) {
      if (turned) pq.holdDir = -pq.holdDir;
      pq.holdPeak = target;
      pq.holdMoveMs = now;
    }
    const up = pq.holdDir > 0;
    const step = dtMs / (up ? PQ_HOLD_IN_MS : PQ_HOLD_OUT_MS);
    if (now - pq.holdMoveMs > PQ_HOLD_STALL_MS && pq.holdV < PQ_REVEAL_END) {
      pq.holdV = up ? Math.min(PQ_REVEAL_END, pq.holdV + step) : Math.max(0, pq.holdV - step);
      return pq.holdV;
    }
    const goal = up ? Math.max(target, pq.holdV) : Math.min(target, pq.holdV);
    const delta = goal - pq.holdV;
    const eased = delta * (1 - (1 - PQ_HOLD_EASE) ** frameState.dtScale);
    pq.holdV += Math.abs(eased) > step ? Math.sign(delta) * step : eased;
    return pq.holdV;
  }

  // PQ_REVEAL_END splits the hold: reveal, then dead scroll. With no hold to spend — a viewport
  // with no room for one — the cue itself is the whole target.
  function updatePullQuoteFrame(zoomT) {
    const scrolled = pq.holdT > 0
      ? clamp01((zoomT - pqAppearZoomT) / pq.holdT)
      : Number(zoomT >= pqAppearZoomT);
    const hold = followHold(scrolled);

    const reveal = clamp01(hold / PQ_REVEAL_END);
    const hDrawn = easeOutCubic(clamp01(reveal / PQ_DRAW_H_SPAN));
    const vDrawn = easeOutCubic(clamp01((reveal - PQ_DRAW_V_START) / (1 - PQ_DRAW_V_START)));
    writeFrameVars(hDrawn, vDrawn);

    updatePullQuoteCopy(reveal);
  }

  // Re-split from scratch: line breaks move with the box width and the resolved font. The fresh
  // elements carry no progress var, so the cache is dropped and the current frame rewritten.
  // Width-gated, since the box can change without the viewport doing so (a scrollbar arriving) and
  // can equally stay put across a viewport change that only alters height.
  function relayoutQuote(force) {
    if (!pqEl || !pqEl.isConnected || !pq.quoteEl) return;
    const w = pqEl.clientWidth;
    if (!force && w === pq.splitW) return;
    pq.splitW = w;
    pq.lineEls = layoutQuote(pq.quoteEl);
    pq.copyStr = '';
    if (!reducedMotion) updatePullQuoteFrame(frameState.zoomT);
  }

  function updatePullQuote(frame) {
    // RM: CSS owns it — no JS driving.
    if (reducedMotion || !pqEl) return;
    updatePullQuoteFrame(frame.zoomT);
  }

  // Cards not yet on the sphere subtract sphGroupZ. Must run at sphereFormT===0 too.
  function updateSphereGroupDepth(frame) {
    const { sphereFormT, zoomT } = frame;
    const { FOLD_SPHERE_DIST, CAM_Z_SPHERE } = bp;
    const sphereFormT3 = sphereFormT * sphereFormT * sphereFormT;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT3);
    // For the hint-text stage: its plane scale tracks the live camera↔sphere distance.
    frame.foldSphDist = foldSphDist;
    const sphGroupZ = zoomT === 0 ? (camera.position.z - foldSphDist) : 0;
    sphereGroup.position.z = sphGroupZ;
    return sphGroupZ;
  }

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

  function renderScene(activeCamera) {
    if (!canvasHidden) renderer.render(scene, activeCamera);
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
    const fadeEnd = NEAR_FADE_END * fadeRefH;
    const fadeStart = NEAR_FADE_START * fadeRefH;
    const proxFade = Math.max(0, Math.min(1, (depth - fadeEnd) / (fadeStart - fadeEnd)));
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
    mesh.renderOrder = 0;
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
    applyMotionCA(mesh, card.spherePos.z * drag.velX, -card.spherePos.z * drag.velY);
  }

  function placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame) {
    const { sphereRotActive } = frame;
    mesh.visible = true;
    // Sphere endpoint is fully rotated; the lerp itself unwinds it.
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
    // Slerp to the UPRIGHT grid quat, not the live peel spin, then reapply the residual peel
    // spin about local Z. Both are load-bearing.
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
    // Blend by fdE so it lands continuous with placeSphereCard.
    applyCardFacing(mesh, fdE);
    mesh.renderOrder = 0;
    mesh.material.opacity = 1;
    applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

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

  // Transform on the arc→grid continuum at peel ease gpE (0 = arc, 1 = grid). Serves the
  // arc/peel render AND the origin of the fold lerp.
  function computeCardEntry(i, frame, out) {
    const { N_VISIBLE, ARC_DENSE_COUNT } = bp;
    const rawT = Math.max(0, Math.min(1, i / Math.max(1, N_VISIBLE - 1)));
    const splitR = ARC_DENSE_COUNT / Math.max(1, N_VISIBLE - 1);
    out.fanT = rawT < splitR
      ? (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT
      : ARC_DENSE_SPLIT + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
    const delay = TL.ARC_ENTRY_STAGGER
      * Math.min(1, (1 - out.fanT) / (1 - ARC_DENSE_SPLIT));
    const span = Math.max(0.01, 1 - TL.ARC_ENTRY_STAGGER);
    const rotT = Math.max(0, Math.min(1, (frame.arcCopyEntryT - delay) / span));
    out.rot = (1 - easeInOutQuint(rotT)) * TL.ENTRY_ROT_MAX;
    return out;
  }

  function computeCardStage(card, i, gpE, frame, entry) {
    const { arcScale, sphGroupZ } = frame;
    const { fanT, rot: entryRot } = entry;
    const fan = getFanData(fanT, arcCtx, fanScratch);
    const wp = entryRot > 0.001
      ? rotateArcPoint(fan.px, fan.py, entryRot, arcCtx, W, H, wpScratch)
      : cssToWorld(fan.px, fan.py, W, H, wpScratch);
    const webglRot = -fan.cssRot - entryRot;

    // First peel frame's rotation, normalized within ±π of gridTilt. Direct z-angle lerp,
    // NOT slerp.
    if (gpE <= 0) {
      card.peelStartRot = null;
    } else if (card.peelStartRot == null) {
      let startRot = webglRot;
      while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
      while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
      card.peelStartRot = startRot;
    }

    stageScratch.slot = i;
    stageScratch.x = lerpN(wp.x, card.gridPos.x, gpE);
    stageScratch.y = lerpN(wp.y, card.gridPos.y, gpE);
    stageScratch.z = lerpN(-sphGroupZ, card.gridPos.z - sphGroupZ, gpE);
    stageScratch.scale = lerpN(arcScale, card.gridScale, gpE);
    stageScratch.rotZ = card.peelStartRot == null
      ? webglRot
      : card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
    return stageScratch;
  }

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

  function updateCardTransform(i, frame) {
    const { progress, gridFormT, gpWin, sphereFormT, dtScale } = frame;
    const { N_TOTAL } = bp;
    const card = cards[i];
    const { mesh } = card;

    // modal.js drives the cards it manages (active + swipe-neighbours).
    if (modal.isCardManaged(card)) return;

    // Both BEFORE the branch reads them.
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

    const baseDelay = (i / Math.max(1, N_TOTAL - 1)) * TL.GRID_PEEL_STAGGER;
    const jitter = (card.peelJitter - 0.5) * TL.GRID_PEEL_JITTER;
    const gpDelay = Math.max(0, Math.min(TL.GRID_PEEL_STAGGER, baseDelay + jitter));
    const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
    const gpE = easeOutCubic(gpLocalT);

    // Gated on the RAW peel localT, not the eased gpE.
    const foldStartProg = TL.cardFoldStartProgress(gpDelay);
    const fdLocalT = Math.max(0, Math.min(1, (progress - foldStartProg) / TL.PROGRESS_FOLD_DUR));
    const fdE = gpLocalT >= TL.FOLD_START_LOCAL_T ? easeInOutCubic(fdLocalT) : 0;

    const entry = computeCardEntry(i, frame, entryScratch);

    let cardCA = 0;
    if (CA_ENABLED) {
      cardCA = Math.max(
        entry.rot / TL.ENTRY_ROT_MAX,
        gpE * (1 - gpE) * 4,
        fdE * (1 - fdE) * 4,
      ) * CA_STRENGTH; // written to uCA with the hover term below
    }

    // Gates on the GLOBAL interactive threshold, not per-card fdE.
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T || reducedMotion) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * (1 - (1 - HOVER_RATE) ** dtScale);

    // Applied here, not in placeSphereCard: the gate above is global but fdE is per-card, so a
    // card still folding at fdE 0.999 would raise hoverT and render nothing.
    if (CA_ENABLED) {
      mesh.material.uniforms.uCA.value = cardCA + card.hoverT * HOVER_CA;
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP;
      if (card.hoverT > 0.01) {
        mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
      } else {
        mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
      }
    }

    // uDissolve is shared with the sphere phase's near-camera dissolve, so it must be reset
    // every frame.
    mesh.material.uniforms.uReveal.value = card.revealT;
    mesh.material.uniforms.uContourFade.value = 1;
    mesh.material.uniforms.uDissolve.value = 1 - card.revealT;
    mesh.material.uniforms.uDisperse.value = 0;

    const prevMeshX = mesh.position.x;
    const prevMeshY = mesh.position.y;

    // Latest phase first. Sphere + settled-grid skip the stage compute.
    if (fdE >= 1) { placeSphereCard(card, mesh, frame); return; }
    if (gpE >= 1 && fdE === 0) {
      placeGridCard(card, mesh, i, prevMeshX, prevMeshY, frame);
      return;
    }
    const stage = computeCardStage(card, i, gpE, frame, entry);
    if (fdE > 0) { placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame); return; }
    placeArcCard(card, mesh, i, gpE, stage, prevMeshX, prevMeshY);
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

  // Sole writer of hintDismissProgress.
  function updateHintExitProgress(frame) {
    const { sphereFormT, dtScale } = frame;
    if (hintDismissProgress >= 1 || reducedMotion || !drag.isDragging) return;
    // Pointer capture outlives the gate, so a held drag can scroll out of the live range.
    if (sphereFormT < TL.SPHERE_INTERACTIVE_T) return;
    // A vertical touch drag is page scroll, not a globe drag.
    if (interaction.isPageScrollGesture()) return;
    const spd = Math.sqrt(drag.velX * drag.velX + drag.velY * drag.velY);
    const norm = spd / MAX_VEL; // 0–1
    hintDismissProgress = Math.min(
      1,
      hintDismissProgress + dtScale * (
        norm * HINT_EXIT_DIST_RATE
        + HINT_EXIT_HOLD_RATE
        + norm * norm * HINT_EXIT_BURST_RATE
      ),
    );
  }

  // Reads frame.foldSphDist, so it runs after the fold.
  function updateClickDragText(frame) {
    if (!textMesh) return;
    const { sphereFormT, zoomT, foldSphDist } = frame;
    const { uniforms } = textMesh.material;

    if (reducedMotion) {
      textMesh.visible = true;
      textMesh.scale.setScalar(1);
      uniforms.uOpacity.value = TEXT_OPACITY_RESTING;
      uniforms.uWarp.value = 0;
      uniforms.uZoom.value = 0;
      uniforms.uCA.value = 0;
      return;
    }
    if (sphereFormT <= TL.TEXT_APPEAR_START) {
      textMesh.visible = false;
      textMesh.scale.setScalar(1); // plane is viewport-sized; the warp does the entrance
      return;
    }

    const { CAM_Z_SPHERE, SPHERE_R } = bp;
    // Entrance resolves ON the interactive gate, not at sphereFormT 1.
    const sfRaw = (sphereFormT - TL.TEXT_APPEAR_START)
      / (TL.SPHERE_INTERACTIVE_T - TL.TEXT_APPEAR_START);
    const sfT = Math.max(0, Math.min(1, sfRaw));
    const txtT = easeOutCubic(sfT);
    const txtWarpEntrance = lerpN(TEXT_WARP_ENTER_MAX, 0, sfT * sfT);
    // Fill the viewport at the current camera distance + warp-proportional overflow.
    const restDist = CAM_Z_SPHERE + SPHERE_R + TEXT_BEHIND_GAP;
    const currDist = foldSphDist + SPHERE_R + TEXT_BEHIND_GAP;
    textMesh.scale.setScalar(currDist / restDist + txtWarpEntrance * TEXT_WARP_OVERFLOW);
    const txtOp = lerpN(TEXT_OPACITY_PEAK, TEXT_OPACITY_RESTING, txtT)
      * (1 - clamp01(zoomT / pqAppearZoomT));

    textMesh.visible = txtOp > 0.001;
    uniforms.uOpacity.value = txtOp;
    uniforms.uZoom.value = zoomT;
    uniforms.uWarp.value = txtWarpEntrance;

    if (CA_ENABLED) uniforms.uCA.value = txtWarpEntrance * TEXT_CA_WARP_MUL;
  }

  // Stage order is FIXED and load-bearing.
  function tick() {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const frame = computeFrame();
    arcCtx = buildArcCtx(frame.arcPanT, W, H, bp.ARC_SPAN);

    a11y.updateTabStops();
    frame.activeCamera = updateActiveCamera(frame);
    frame.sphereRotActive = updateSphereRotation(frame);
    modal.updateAnimation(frame.sphereRotActive, frame.dtScale);
    modal.updateDesktopNav();
    updateCanvasVisibility(frame);
    updatePullQuote(frame);

    // Arc needs manual render order; sphere needs camera-distance sorting.
    renderer.sortObjects = frame.sphereFormT > TL.DEPTH_SORT_FORM_T;

    frame.sphGroupZ = updateSphereGroupDepth(frame);
    updateGlobalCA();
    updateCardTransforms(frame);
    updateA11yFocusRing(); // after card transforms — reads the meshes' fresh world positions
    updateHintExitProgress(frame); // before controls.update reads it

    updateClickDragText(frame);
    interaction.applyCursor();
    controls.update();
    updateArcCopy(frame);
    renderScene(frame.activeCamera);
  }

  let rafId = 0;
  function rafLoop() { tick(); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() {
    if (rafId) return;
    // Re-baseline scroll and the frame clock; the parked interval isn't a dt.
    frameInput.prevLenisY = window.scrollY;
    frameInput.prevNow = 0;
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
    if (renderReady && onScreen) {
      startTicker();
    } else {
      stopTicker();
      if (renderer) renderer.domElement.style.display = 'none';
    }
  }

  const MAX_CONTEXT_REBUILDS = 4;
  const CONTEXT_STABLE_MS = 10000;
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

    // RM: canvas into normal flow so the globe scrolls away.
    canvas.style.position = reducedMotion ? 'absolute' : '';

    W = window.innerWidth;
    H = measureViewportH();

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

    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 0, arcCamZ(H));
    camera.lookAt(0, 0, 0);
    appliedViewOffsetY = null;

    // Arc phase: flat 2D, 1 world unit = 1 CSS pixel.
    cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
    cameraOrtho.position.set(0, 0, 100);
    cameraOrtho.lookAt(0, 0, 0);

    function doLayout({ fromResize = false } = {}) {
      measureBlock();
      readCssVars();
      const nextW = window.innerWidth;
      const nextH = measureViewportH();
      if (fromResize && nextW === W && nextH === H) {
        relayoutQuote(); // the quote box can change width without the viewport doing so
        publishPqMetrics();
        return;
      }
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
      relayoutQuote(); // before the metrics: the split settles the box they measure
      publishPqMetrics();
    }
    doLayout();
    // A webfont landing after first layout retypesets the quote.
    if (document.fonts && document.fonts.ready) {
      const afterFonts = () => { relayoutQuote(true); publishPqMetrics(); };
      document.fonts.ready.then(afterFonts, afterFonts);
    }
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => doLayout({ fromResize: true });
    window.addEventListener('resize', resizeHandler, { passive: true });

    // RM can toggle mid-session without a resize.
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
    root.classList.toggle('globe-gallery-barrel', bp.CYLINDER);

    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    caFilterR = q('.globe-gallery-ca-r-offset');
    caFilterB = q('.globe-gallery-ca-b-offset');
    arcCopy.el = q('.globe-gallery-arc-copy');
    arcCopy.opStr = '';
    arcCopy.transformStr = '';

    modal.setup();

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
    controls.teardown();
    if (renderer) {
      renderer.domElement.style.filter = '';
      globalCaFilterOn = false;
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
    // Otherwise a band crossing pairs the old band's card height with the new band's SPHERE_R
    // in publishPqAppearZoomT, which runs before any card exists.
    fadeRefH = 0;
    cards = [];
    textures = [];
    cardAspects = [];
    disposeTextMesh();
    hintDismissProgress = 0;
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    modal.destroy();
    a11y.teardown();
    if (arcCopy.el) arcCopy.el.style.cssText = '';
    if (pqEl) {
      pqEl.style.cssText = '';
      pq.frameStr = '';
      pq.copyStr = '';
    }
    frameInput.prevLenisY = 0; frameInput.prevNow = 0; frameState.scrollVel = 0;
    canvasHidden = false;
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
    el.classList.add('globe-gallery-reduced');
  }

  // Before buildGlobeDom() wipes the children.
  const {
    arcCopy, pullQuote, hintText, touchHint, instructions, labels, fragmentHref,
  } = parseAuthoredContent(el);

  const gid = buildGlobeDom(el, labels, { arcCopy, pullQuote, touchHint });

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
