/* ─────────────────────────────────────────────────────────────────────────
   Globe Gallery — Three.js WebGL scrolled hero.

   Phases (progress 0→1 across the block's 850vh scroll length):
     0.00 – 0.55  Arc: 45 cards rotate across viewport
     0.14 – 0.65  Grid peel: cards peel off arc into 9×5 grid (staggered)
     0.37 – 0.78  Sphere fold: each card folds to sphere immediately after arriving in grid
     0.78 – 1.00  Zoom: camera flies through sphere
   ───────────────────────────────────────────────────────────────────────── */
import * as THREE from './three.module.min.js';
// eslint-disable-next-line import/no-relative-packages
import { getConfig } from '../../../utils/utils.js';
// eslint-disable-next-line import/no-relative-packages
import { replaceKeyArray } from '../../../features/placeholders.js';
import { parseAuthoredContent, fetchFragmentCards, buildGlobeDom } from './src/authoring.js';
import loadCardTextures from './src/textures.js';
import { createCardMaterial } from './src/materials.js';
import createGalleryA11y from './src/a11y.js';
import createGlobeModal from './src/modal.js';
import createInteraction from './src/interaction.js';
import { easeOutCubic, easeInOutCubic, easeOutSine, lerpN } from './src/math.js';
import { buildArcCtx, getFanData, cssToWorld, rotateArcPoint, arcCamZ } from './src/arc.js';

// ── Layout / breakpoints ─────────────────────────────────────────────────────
// Image-derived (texture aspect, never changes)
const CARD_ASPECT = 456 / 631; // portrait

// Resolved once at init() via resolveBP(W). Two render profiles, split at 768px
// (the Milo sm↔md boundary). They differ in card count, so crossing 768px on
// resize triggers a full destroy()+init() rebuild (see doLayout); resizing within
// a band takes the cheap path. There is deliberately no md↔lg distinction here:
// Milo md (768–1279) and lg (1280–1440) render identically, so this `md` band
// covers both (md and up). A separate lg band would never change anything the
// WebGL cares about. CSS keeps its own md/lg type tiers (see globe.css).
const BREAKPOINTS = {
  // ≥768 — Milo md + lg (named for its lower bound). Full experience: 45 cards,
  // 9×5 grid, large sphere.
  md: {
    minWidth: 768,
    N_TOTAL: 45,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 6.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 65,
    CAM_Z_END: -60,
    GRID_COLS: 9,
    GRID_ROWS: 5,
    ARC_DENSE_COUNT: 27,
  },
  // <768 — Milo sm. Tuned for 375x667 portrait: sphere fits ~88% viewport width /
  // 49% height at SPHERE_R=20, CAM_Z_SPHERE=70; card count + grid adjusted to
  // portrait; arc cards sized to fit with margin. ARC_DENSE_COUNT=0 → cards spread
  // uniformly across the arc (N_TOTAL=24 isn't crowded enough to need clustering).
  sm: {
    minWidth: 0,
    N_TOTAL: 24,
    ARC_SPAN: 3.6,
    SPHERE_R: 20,
    CARD_H_SPHERE: 6.0,
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    GRID_COLS: 3,
    GRID_ROWS: 8,
    ARC_DENSE_COUNT: 0,
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

// ── Phase timeline (progress 0→1 across the block's 850vh scroll length) ─────
const ARC_STAGGER = 0.594;
const PROGRESS_PAN_END = 0.55;
const PROGRESS_ARC_PREROLL = 0.30;
// Grid peel expressed as arc-rotation fraction (0=arc start, 1=arc end).
const PROGRESS_GRID_ARC_START = 0.30;
const PROGRESS_GRID_ARC_END = 0.60;
const PROGRESS_FOLD_DUR = 0.25;
const PROGRESS_ZOOM_END = 1.00;
// Progress at which the sphere is fully formed and the zoom hasn't started yet
// (sphereFormT=1, zoomT=0) — the canonical "interactive globe" scroll position keyboard
// focus snaps to. Mirrors the foldLast computation in computeFrame (single source).
const SPHERE_FORMED_PROGRESS = Math.max(
  0,
  (PROGRESS_GRID_ARC_END - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END,
) + PROGRESS_FOLD_DUR;

// ── Entry timing ─────────────────────────────────────────────────────────────
// Two independent knobs (the WebGL canvas is transparent, so an early reveal only
// draws the card meshes, not an opaque sheet over the content above):
//   ENTRY_LEAD_VH — how far, in viewport heights, BEFORE the block's top the
//     globe starts entering (arc-copy fade-in, arc pre-roll, canvas reveal).
//     The prototype used 0.85 (hero, nothing above it) — that pre-rolls the arc
//     across most of the viewport while preceding blocks are still on screen,
//     so the arc overlaps them. 0 = only starts once the block's top reaches
//     the viewport top (no overlap, but feels late). A moderate value starts as
//     the section is arriving without sweeping the arc over the content above.
//   ENTRY_RAMP_VH — the ramp length (viewport heights) over which arcCopyEntryT
//     goes 0→1. This sets how FAST the arc-copy fades and the arc pre-rolls,
//     and the gap between the text appearing and the arc arriving. MUST stay
//     independent of the lead (prototype value 1.05) — coupling them is what
//     made the arc rotate/peel too fast and shrank the text→arc gap.
const ENTRY_LEAD_VH = 0.4;
const ENTRY_RAMP_VH = 1.05;

// ── Grid peel / fold ─────────────────────────────────────────────────────────
const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width (computed per layout)
// arc→grid: stagger peels across 20% of formation phase (more simultaneous)
const GRID_PEEL_STAGGER = 0.20;
// per-card random offset added to gpDelay — breaks the linear cascade for an organic feel
const ARC_PEEL_JITTER = 0.40;
// Non-uniform fanT distribution along the arc:
//   Cards [0, ARC_DENSE_COUNT-1] cluster tight into fanT [0, ARC_DENSE_SPLIT] (off-screen flank).
//   Cards [ARC_DENSE_COUNT, N-1] spread across fanT [ARC_DENSE_SPLIT, 1] (the visible upper arc).
// The clustered cards peel first (low i = early gpDelay), so they vanish before rotation
// would otherwise bring their compressed fanT region into view.
// ARC_DENSE_COUNT is per-BP (in BREAKPOINTS) since it must scale with N_TOTAL.
const ARC_DENSE_SPLIT = 0.50;

// ── Drag / auto-rotation ─────────────────────────────────────────────────────
// (Pointer→velocity sensitivity lives in src/interaction.js; MAX_VEL is shared —
// the interaction module clamps drag velocity to it, the core normalizes by it.)
const DRAG_FRICTION = 0.94;
const MAX_VEL = 0.06;
const AUTO_ROT_SPEED = 0.000045;
// Keyboard arrow-spin (focused globe widget): per-press velocity impulse (normal
// motion, decays via DRAG_FRICTION) and the direct yaw step (reduced motion, instant).
const KEY_SPIN_IMPULSE = 0.025;
const KEY_SPIN_STEP = 0.5; // radians (~29°) per Left/Right press under reduced motion

// ── Sphere interaction ───────────────────────────────────────────────────────
// Sphere becomes interactive (drag-rotate, hover, click → modal) at this
// sphereFormT threshold rather than waiting for full formation. Lower = sphere
// can be grabbed mid-fold. Above ≥0.5 the lerped card positions are close
// enough to sphere that rotating the group still reads as spinning the sphere.
const SPHERE_INTERACTIVE_T = 0.8;

// ── Chromatic aberration (Options B + C) ─────────────────────────────────────
const CA_ENABLED = true; // master kill switch — set false to disable all CA without removing code
const CA_STRENGTH = 0.012; // radial UV shift per channel (bell-curve at transition peaks; Option B)
const CA_MOTION_STRENGTH = 1.0; // directional UV shift max — peel / fold / sphere / modal
const CA_MOTION_STRENGTH_ARC = 0.04; // softer clamp while cards sit on the arc
const SCROLL_VEL_MAX = 15; // px/frame scroll speed that saturates motion trail at full strength
const SCROLL_VEL_DEADBAND = 2; // px/frame below this = Lenis settle noise → no CA (anti-shimmer)
const CA_PX_MAX = 3; // max vertical pixel shift for global canvas SVG filter (Option C)

// ── Hover (sphere phase only) ────────────────────────────────────────────────
// Polished/premium feel — settles in/out, no continuous animation while hovered.
const HOVER_CA = 0.025; // CA bump composed additively onto transition CA
const HOVER_WARP = 0.4; // barrel-distortion amount sent to shader
const HOVER_SCALE = 0.25; // scale multiplier added: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target (~125ms to 80%)

// ── Near-camera proximity fade (zoom-through) ────────────────────────────────
// During the zoom-through the camera flies through the sphere shell, so any card on
// the flight path passes within a hair of the lens and fills the screen. Fade a card
// out by its depth in front of the camera so it dissolves before it can cover the
// frame, instead of hard-clipping at the near plane (which would slice + pop cards).
// Thresholds are in card-heights (× bp.CARD_H_SPHERE) so they scale per breakpoint.
// A 60° FOV card fills the viewport height at ~0.87 card-heights of depth, so the
// fade completes above that. Both thresholds sit well inside the resting interactive
// distance (nearest card depth ≈ CAM_Z_SPHERE − SPHERE_R ≈ 4–5 card-heights), so the
// steady globe + the approach are untouched — the fade only engages mid zoom-through.
const NEAR_FADE_START = 2.5; // begin fading when card depth < 2.5 card-heights
const NEAR_FADE_END = 1.0; // fully transparent when card depth < 1.0 card-height

// ── Sphere-drag warp (all breakpoints) ───────────────────────────────────────
// Hybrid intensity: a baseline while actively dragging, plus a velocity-driven
// burst that decays naturally with dragVel via DRAG_FRICTION after release.
// Applied to ALL sphere cards (front + back) using each card's own center (0.5, 0.5).
const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed (px/frame in world units)
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value

// ── Modal-nav reactivity nudge ───────────────────────────────────────────────
// A spring on sphereRotY/X toward the newly-shown card's slot so the sphere
// acknowledges prev/next nav. Scales with angular distance (capped); slight
// underdamping gives a bouncy settle. The modal (modal.js) triggers it via the
// injected requestNavNudge → triggerModalNavNudge here; the spring physics live
// in updateSphereRotation. All other modal tuning lives in modal.js.
const NAV_NUDGE_FACTOR = 0.25; // 25% of full alignment angle — gentle
const NAV_NUDGE_MAX_Y = 0.45; // ~26° cap so distant cards don't cause big swings
const NAV_NUDGE_MAX_X = 0.18; // ~10° cap (X is already clamped to ±π/3 elsewhere)
const NAV_NUDGE_STIFF = 0.05; // softer pull
const NAV_NUDGE_DAMP = 0.86; // closer to critical damping → minimal overshoot

// ── Fibonacci sphere distribution ────────────────────────────────────────────
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
function fibSpherePos(i, total, radius) {
  const polarAngle = Math.acos(1 - (2 * i) / total);
  const azimuth = GOLDEN_ANGLE * i;
  return new THREE.Vector3(
    radius * Math.sin(polarAngle) * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    radius * Math.sin(polarAngle) * Math.sin(azimuth),
  );
}

// The globe runtime. Originally an IIFE exposing window.offerGlobe in the
// hub-creative prototype; now a factory returning { init, destroy }.
// Key changes from the prototype: gsap.ticker → requestAnimationFrame,
// Lenis reads → window.scrollY. `root` is the block element; all DOM lookups
// are scoped to it (root.querySelector) so >1 globe can coexist on a page.
// `gid` is this instance's unique-id suffix, minted by buildGlobeDom (authoring.js)
// and threaded in here so the CA filter url(#…) ref matches the built node.
function createGlobeGalleryRuntime(authoredCards, root, gid, labels, reducedMotion) {
  // Root-scoped query helper — every DOM lookup goes through this so the runtime
  // only ever touches its own block's nodes (multi-instance safe).
  const q = (sel) => root.querySelector(sel);

  // The card content the runtime renders. authoredCards is always present (from the fragment).
  const CARD_CONTENT = authoredCards || [];

  // Per-card accessor. bp.N_TOTAL is clamped to the authored count (see
  // resolveBpProfile), so i is always in range — no modulo wrap. Fewer authored cards than the grid
  // can hold simply leaves the last grid column partially filled.
  function getCardMetadata(i) {
    return CARD_CONTENT[i];
  }

  // Active breakpoint profile — the static BREAKPOINTS config (module scope)
  // resolved against the viewport band + authored card count. Assigned by
  // resolveBpProfile() in initRuntime, rebuilt on a band crossing (destroy→init);
  // frozen + constant within a band. Read throughout as bp.N_TOTAL, bp.SPHERE_R,
  // bp.GRID_COLS, etc. — functions destructure what they need at their top; the DI
  // getters read bp.* live so they never capture a stale band. null until
  // initRuntime() runs — do NOT read at module load time.
  let bp = null;

  // Resolve a band's static cfg into the active profile: clamps N_TOTAL to the
  // authored card count, derives the sphere card width + fold distance, clamps the
  // dense-arc cluster. Pure — returns a frozen object assigned to `bp`.
  function resolveBpProfile(name, cfg) {
    // N_TOTAL follows the authored card count, capped at the per-BP maximum
    // (cfg.N_TOTAL == GRID_COLS*GRID_ROWS — the grid can't hold more). Fewer
    // cards → ragged last grid column (accepted). More cards → extras dropped.
    const nTotal = Math.min(CARD_CONTENT.length, cfg.N_TOTAL);
    return Object.freeze({
      name,
      N_TOTAL: nTotal,
      N_VISIBLE: nTotal, // all cards on arc simultaneously (no conveyor)
      ARC_SPAN: cfg.ARC_SPAN,
      SPHERE_R: cfg.SPHERE_R,
      CARD_H_SPHERE: cfg.CARD_H_SPHERE,
      CARD_W_SPHERE: cfg.CARD_H_SPHERE * CARD_ASPECT,
      CARD_W_ARC: cfg.CARD_W_ARC,
      CAM_Z_SPHERE: cfg.CAM_Z_SPHERE,
      CAM_Z_END: cfg.CAM_Z_END,
      // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
      FOLD_SPHERE_DIST: Math.round(cfg.SPHERE_R / (0.35 * Math.tan(Math.PI / 6))),
      GRID_COLS: cfg.GRID_COLS,
      GRID_ROWS: cfg.GRID_ROWS,
      // Clamp the dense-arc cluster to the actual card count so a small authored
      // set still leaves cards for the visible spread region (fanT > ARC_DENSE_SPLIT).
      ARC_DENSE_COUNT: Math.min(cfg.ARC_DENSE_COUNT, nTotal),
    });
  }

  // ── State ──────────────────────────────────────────────────────────────────
  let renderer; let scene; let camera; let cameraOrtho; let
    sphereGroup;
  // { mesh, spherePos, sphereQuat, gridPos, gridScale, gridTilt, gridQuat, gridCol, gridRow }
  let cards = [];
  // Both assigned by loadCardTextures()'s onDone callback before buildCards() runs.
  // cardTexData[i] = per-card sphereScaleX + arc UV crop values.
  let textures = [];
  let cardTexData = [];
  let gridCardW = 0; let
    gridTilts = [];

  let progress = 0;
  let arcCopyEntryT = 0;
  // The block element itself is the scroll runway:
  // blockDocTop = its top in document space, blockHeight = its full scroll length.
  let blockDocTop = 0;
  let blockHeight = 0;
  let W = 0; let
    H = 0;

  const pqEl = q('.globe-gallery-pullquote');
  let pqShown = false;

  let caFilterR = null; // SVG feOffset element for red channel  (Option C)
  let caFilterB = null; // SVG feOffset element for blue channel (Option C)
  let prevLenisY = 0; // previous frame scroll position — used to compute scrollVel
  let scrollVel = 0; // |lenisY - prevLenisY| — drives motion trail intensity

  let sphereRotY = 0;
  let sphereRotX = 0;

  const drag = { isDragging: false, velX: 0, velY: 0 };
  let tickerAdded = false;
  let sphereDragWarp = 0;
  let cameraInsideSphere = false;

  // Per-card sphere-rotation state (THREE objects). The sphere drag rotation is applied
  // MANUALLY to each card in the sphere/fold blocks of tick() — sphereGroup.rotation is
  // kept at identity so cards in non-sphere phases (arc/grid) aren't transformed by stale
  // drag rotation. sphereRotEuler/Quat are shared by reference into modal.js (its closing
  // animation reads the live rotation), so they're created eagerly — the reference is stable.
  // 'XYZ' → R = R_pitch · R_yaw: pitch (sphereRotX, clamped ±60°) is the OUTER
  // rotation about world X, so vertical drag always tilts about the screen-horizontal
  // axis regardless of how far the globe has been spun. Yaw (sphereRotY, unclamped) is
  // the inner turntable spin about the local up-axis. Putting the clamped axis outside
  // is what avoids the gimbal flip ('YXZ' had unclamped yaw outside, so passing 180°
  // of yaw inverted the local pitch axis and reversed vertical drag).
  const sphereRotEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const sphereRotQuat = new THREE.Quaternion();
  const foldRotQuat = new THREE.Quaternion();
  const tmpVec3 = new THREE.Vector3();

  // Modal-nav "reactivity nudge": when user navigates prev/next within the modal,
  // drive a spring on sphereRotY/X toward a target derived from the new card's slot
  // position. Sphere visibly rotates behind the blur to acknowledge the navigation.
  // Magnitude scales with angular distance to the new card's actual position, so a
  // close neighbor gives a small nudge and a back-of-sphere card gives a bigger one
  // (capped). Slight overshoot + decay for a "bouncy" feel.
  let navNudgeActive = false;
  let navNudgeTargetY = 0;
  let navNudgeTargetX = 0;
  let navNudgeVelY = 0;
  let navNudgeVelX = 0; // tuning consts (NAV_NUDGE_*) are at module scope

  let modal = null;
  let a11y = null;
  let interaction = null;

  // Suppresses the focus→snap-scroll while the tab is backgrounded, so returning to the
  // tab (which refocuses the globe widget) doesn't yank the page to the globe. Armed on
  // window blur / visibility-hidden, disarmed (deferred a frame) on focus. (pdf-space.)
  let suppressFocusSnap = false;

  // Current arc context (computed once per frame in tick() via buildArcCtx)
  let arcCtx = null;

  // ── Arc math ─────────────────────────────────────────────────────────────────
  // The fanned-arc layout + CSS↔WebGL coordinate helpers live in src/arc.js as
  // pure functions; the runtime owns `arcCtx` (rebuilt each frame in tick() via
  // buildArcCtx) and threads it + the viewport (W, H) back into them.

  // ── Materials ───────────────────────────────────────────────────────────────
  // Texture loading lives in textures.js; material factories in materials.js.
  // Rounded corners are computed analytically in the card shader (SDF), driven by
  // each card's uAspect uniform (set per phase by the card-transform stages) — no
  // rasterized mask textures.

  // ── Grid layout (9×5 = 45 cards, sized to fit viewport) ───────────────────
  function computeGridLayout() {
    if (cards.length === 0) return;
    const { GRID_COLS, GRID_ROWS, CARD_W_SPHERE } = bp;
    // md (≥768): cards fill viewport width via W/GRID_COLS; gaps push grid
    // off-screen by design (cards on the side overflow as a "more cards beyond" cue).
    // sm (<768): fit the grid within the viewport exactly — solve cardW so that
    // GRID_COLS*cardW + (GRID_COLS-1)*cardW*GRID_GAP_RATIO == W. No overflow.
    gridCardW = (bp.name === 'sm')
      ? W / (GRID_COLS + (GRID_COLS - 1) * GRID_GAP_RATIO)
      : W / GRID_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const totalW = GRID_COLS * gridCardW + (GRID_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    // Column-major layout: i=0 → col 8 row 4 (lower-right), then sweeps bottom-to-top
    // within each column, moving right-to-left. Adjacent arc cards land in the same column.
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

  // ── Build scene geometry ────────────────────────────────────────────────────
  function buildCards() {
    const {
      N_TOTAL, N_VISIBLE, SPHERE_R, CARD_W_SPHERE, CARD_H_SPHERE, GRID_COLS, GRID_ROWS,
    } = bp;
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    cards = [];

    for (let i = 0; i < N_TOTAL; i += 1) {
      // cardTexData is fully populated by the time buildCards() fires (called from onDone)
      const ctd = cardTexData[i] || {};
      const sphereScaleX = ctd.sphereScaleX !== undefined ? ctd.sphereScaleX : 1;
      const imgAspect = sphereScaleX * CARD_ASPECT;
      // Cover-crop UVs (fall back to the no-crop identity if the texture errored).
      const repeatX = ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1;
      const repeatY = ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1;
      const offsetX = ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0;
      const offsetY = ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      const mat = createCardMaterial({
        texture: textures[i],
        aspect: CARD_ASPECT, // arc/grid start shape; per-phase stages update uAspect
        repeatX,
        repeatY,
        offsetX,
        offsetY,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = N_VISIBLE - i;
      sphereGroup.add(mesh);

      // Sphere target position (Fibonacci)
      const sp = fibSpherePos(i, N_TOTAL, SPHERE_R);

      // Sphere orientation: face center + random z-rotation
      const m = new THREE.Matrix4()
        .lookAt(sp, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
      const rz = (Math.random() - 0.5) * 0.5;
      sq.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rz));

      // Column-major mapping (matches computeGridLayout)
      // ctd / sScaleX already declared above (before material creation)
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
        sphereScaleX,
        imgAspect, // world-space aspect on the sphere (CARD_ASPECT × sphereScaleX)
        arcRepeatX: repeatX,
        arcRepeatY: repeatY,
        arcOffsetX: offsetX,
        arcOffsetY: offsetY,
        hoverT: 0, // eased 0→1 hover progress (sphere phase only)
        hoverTarget: 0, // instant 0|1 set by onHover() raycast
        hoverUV: new THREE.Vector2(0.5, 0.5), // cursor position on card in UV space
      });
    }
    // Seed per-card random tilts once so they stay stable across resize
    gridTilts = [];
    for (let ti = 0; ti < N_TOTAL; ti += 1) {
      gridTilts.push((Math.random() - 0.5) * 0.175); // ±5° in radians
    }
    computeGridLayout();
  }

  // Drag + click + hover live in the interaction module (src/interaction.js),
  // created below once the modal exists. sphereFormT is computed inside tick();
  // cache it here so the interaction module's click/hover handlers (which fire
  // between ticks) know whether the sphere is in the clickable state — they read
  // it via the getSphereFormT getter injected into createInteraction.
  let sphereFormTAtLastTick = 0;

  // Set a card's local transform to its canonical sphere slot with the current
  // sphere-drag rotation baked in. Used by reparent sites so there's no one-frame
  // flash of an unrotated card before tick()'s sphere block re-applies rotation.
  function snapCardToSphereSlot(card) {
    if (!card || !card.mesh) return;
    const hasRot = (sphereRotY !== 0 || sphereRotX !== 0);
    if (hasRot && sphereRotEuler) {
      sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'XYZ');
      sphereRotQuat.setFromEuler(sphereRotEuler);
      card.mesh.position.copy(card.spherePos).applyEuler(sphereRotEuler);
      card.mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    card.mesh.scale.set(card.sphereScaleX, 1, 1);
  }

  // Modal-nav reactivity: compute the spring target that will rotate the sphere
  // partway toward facing the new card's slot, then activate the spring. Injected
  // into modal.js as requestNavNudge and called on each prev/next nav (arrow or swipe).
  function triggerModalNavNudge(newIdx) {
    if (!sphereRotEuler || !cards[newIdx]) return;
    const newCard = cards[newIdx];
    // World position of new card's slot under the CURRENT sphere rotation.
    const wp = tmpVec3.copy(newCard.spherePos).applyEuler(sphereRotEuler);
    // alignDeltaY: rotation around Y that would bring the card's projected XZ
    // position to the +Z axis (facing the camera). Sign: positive Y rotation moves
    // a +X-side card toward +Z, so the delta is -atan2(x, z).
    const alignDeltaY = -Math.atan2(wp.x, wp.z);
    // alignDeltaX: rotation around X that would bring the card's Y component to
    // 0 after the Y alignment. Approximate (Y and X rotations don't commute) but
    // close enough at NUDGE_FACTOR scale.
    const horiz = Math.sqrt(wp.x * wp.x + wp.z * wp.z);
    const alignDeltaX = Math.atan2(wp.y, horiz);
    // Scaled, clamped deltas — subtle nudge that grows with distance but capped.
    const nudgeY = Math.max(
      -NAV_NUDGE_MAX_Y,
      Math.min(NAV_NUDGE_MAX_Y, alignDeltaY * NAV_NUDGE_FACTOR),
    );
    const nudgeX = Math.max(
      -NAV_NUDGE_MAX_X,
      Math.min(NAV_NUDGE_MAX_X, alignDeltaX * NAV_NUDGE_FACTOR),
    );
    navNudgeTargetY = sphereRotY + nudgeY;
    navNudgeTargetX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, sphereRotX + nudgeX));
    navNudgeActive = true;
  }

  // ── Motion-trail CA helper ────────────────────────────────────────────────────
  // dx/dy: world-space position delta this frame (new - prev).
  // ampOverride: optional 0-1 amplitude; when omitted, amplitude is derived from
  //   the greater of scroll velocity and globe drag speed so globe spin and modal
  //   animation both drive CA without relying on scroll.
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
      : Math.min(1.0, Math.max(scrollVel / SCROLL_VEL_MAX, dragSpeed / MAX_VEL));
    const mx = Math.max(-s, Math.min(s, uvDX * amp));
    const my = Math.max(-s, Math.min(s, uvDY * amp));
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // ── UV helper — drives the cover-crop through the card shader's uniforms ──
  function setCardUV(mesh, rx, ry, ox, oy) {
    mesh.material.uniforms.uRepeat.value.set(rx, ry);
    mesh.material.uniforms.uOffset.value.set(ox, oy);
  }

  // ── Aspect helper — sets the rounded-corner SDF's world-space aspect for this
  // card's current phase, so corners stay circular as the card stretches from
  // portrait (arc/grid) to its image aspect (sphere). Replaces the old per-phase
  // alphaMap swap (arcMask ↔ per-aspect sphereMask).
  function setCardAspect(mesh, aspect) {
    mesh.material.uniforms.uAspect.value = aspect;
  }

  // ── Modal + keyboard-gallery DI modules ─────────────────────────────────────
  // Assigned here, after the sphere-rotation helpers + applyMotionCA they depend
  // on are defined (so the injected callbacks aren't forward-refs). Both read live
  // runtime state through getters, so they never hold a stale snapshot across a
  // resize / breakpoint re-init. The modal owns its own canvas/scene + the
  // open/close/navigate state machine; it reaches into the sphere only through the
  // shared sphereRotEuler/Quat objects + the snapToSphereSlot / requestNavNudge
  // callbacks (which keep sphereRotX/Y + the nav-nudge spring in core).
  modal = createGlobeModal({
    q,
    getScene: () => scene,
    getCamera: () => camera,
    getSphereGroup: () => sphereGroup,
    getRenderer: () => renderer,
    getCards: () => cards,
    getCount: () => bp.N_TOTAL,
    getCardMetadata,
    getViewport: () => ({ W, H }),
    getBP: () => bp.name,
    getCardDims: () => ({ w: bp.CARD_W_SPHERE, h: bp.CARD_H_SPHERE }),
    cardAspect: CARD_ASPECT,
    caEnabled: CA_ENABLED,
    cardLabel: labels.cardLabel,
    reducedMotion,
    sphereRotEuler,
    sphereRotQuat,
    snapToSphereSlot: snapCardToSphereSlot,
    requestNavNudge: triggerModalNavNudge,
    applyMotionCA,
  });

  // Keyboard spin: Left/Right arrows on the focused globe widget call this. Normal
  // motion injects a velocity impulse into the shared drag.velX so the existing
  // friction/inertia in updateSphereRotation gives a natural eased flick (clamped to
  // MAX_VEL). Reduced motion steps sphereRotY directly by a fixed angle — a discrete
  // reposition with no momentum/auto-rotate (auto-spin is also off in that mode).
  function spinGlobe(dir) {
    if (reducedMotion) {
      sphereRotY += dir * KEY_SPIN_STEP;
    } else {
      drag.velX = Math.max(-MAX_VEL, Math.min(MAX_VEL, drag.velX + dir * KEY_SPIN_IMPULSE));
    }
  }

  // Focusing the globe widget snaps the page so the block enters its interactive "globe"
  // state instead of being skipped, and is in view before the focus ring shows. Normal
  // motion scrolls to the formed-sphere offset inside the tall runway; reduced motion
  // (a ~100vh section that already renders the formed sphere) aligns the block to the
  // viewport top. Deferred a frame so the focus settles first (pdf-space pattern).
  function snapToInteractive() {
    if (suppressFocusSnap) return;
    const top = reducedMotion
      ? blockDocTop
      : blockDocTop + SPHERE_FORMED_PROGRESS * blockHeight;
    requestAnimationFrame(() => {
      if (window.lenis?.scrollTo) window.lenis.scrollTo(top, { force: true, immediate: true });
      else window.scrollTo(0, top);
    });
  }

  // Focus-snap guard: while the tab is backgrounded, the browser refocuses the last
  // element on return — which would re-fire the widget's focus → snap. Arm on blur /
  // hidden; disarm a frame after focus so the synchronous refocus stays suppressed.
  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => { requestAnimationFrame(() => { suppressFocusSnap = false; }); };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };

  a11y = createGalleryA11y({
    q,
    getCount: () => bp.N_TOTAL,
    getSphereFormT: () => sphereFormTAtLastTick,
    getModalIdx: () => modal.getModalIdx(),
    interactiveThreshold: SPHERE_INTERACTIVE_T,
    spinGlobe,
    // Keyboard activation has no pointer target → open the first item (decision 3),
    // emanating the open-warp from screen center.
    openModal: () => modal.open(0, W / 2, H / 2),
    onFocus: snapToInteractive,
    galleryLabel: labels.galleryLabel,
  });

  // Pointer interaction (drag-to-spin, click → modal, hover). Owns its listeners +
  // raycaster; setup(canvas)/teardown() are called from initRuntime/destroy. Reads
  // live runtime state through getters; shares drag velocity via the `drag` object.
  interaction = createInteraction({
    getRenderer: () => renderer,
    getCamera: () => camera,
    getCards: () => cards,
    getModalIdx: () => modal.getModalIdx(),
    openModal: (idx, x, y) => modal.open(idx, x, y),
    getSphereFormT: () => sphereFormTAtLastTick,
    interactiveThreshold: SPHERE_INTERACTIVE_T,
    maxVel: MAX_VEL,
    drag,
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Per-frame pipeline. tick() (defined at the end of this section) is a thin
  // orchestrator: computeFrame() builds the per-frame `frame` context (scroll +
  // every phase t-value + the card-entry transforms), each stage below reads what
  // it needs from `frame` (destructured at its top) and the producer stages
  // (updateActiveCamera, updateSphereRotation, updateSphereGroupDepth) write their
  // result back onto `frame`, then the same object flows into the card loop. ONE
  // per-frame context, not several. Stage order matters (see tick()'s note). All
  // other per-instance render state lives in the closure and is read directly.
  // ════════════════════════════════════════════════════════════════════════════

  // Read scroll position and derive every phase progress value for this frame.
  // Also refreshes the closure scroll state other code reads between ticks
  // (scrollVel for motion CA, sphereFormTAtLastTick for the click/hover handlers).
  function computeFrame() {
    const { CARD_W_ARC, CARD_W_SPHERE } = bp;
    // Reduced motion: pin the scroll input to the formed-sphere position so every
    // downstream phase value resolves to the static interactive globe (sphereFormT=1,
    // zoomT=0) with no scroll dependence — and no motion trail (scrollVel forced 0).
    // The pin cancels in `progress` (it's (lenisY - blockDocTop)/blockHeight), so it's
    // independent of the collapsed blockHeight. Canvas visibility uses REAL scroll (see
    // updateCanvasVisibility) so the fixed canvas still hides when scrolled away.
    const lenisY = reducedMotion
      ? blockDocTop + SPHERE_FORMED_PROGRESS * blockHeight
      : window.scrollY;
    const scrollingDown = lenisY >= prevLenisY;
    // px/frame scroll speed — drives the velocity-based CA (global filter + motion trail).
    // Dead-band it: after a scroll, Lenis eases to its target for several frames, wobbling
    // window.scrollY by sub-pixel/±1px amounts. Without the dead-band that residual keeps
    // re-firing the CA every frame, which shimmers near (large) cards light/dark. Real
    // scrolling moves many px/frame, so this only suppresses settle noise.
    const rawScrollVel = reducedMotion ? 0 : Math.abs(lenisY - prevLenisY);
    scrollVel = rawScrollVel < SCROLL_VEL_DEADBAND ? 0 : rawScrollVel;
    prevLenisY = lenisY;
    const entryStart = blockDocTop - H * ENTRY_LEAD_VH;
    const entryRange = H * ENTRY_RAMP_VH;
    arcCopyEntryT = Math.max(0, Math.min(1, (lenisY - entryStart) / entryRange));
    progress = Math.max(0, Math.min(1, (lenisY - blockDocTop) / blockHeight));

    // arcPanT: preroll animates in WITH the entry (0 before section, PROGRESS_ARC_PREROLL by entry)
    // so the arc is already in motion as the section scrolls into view.
    const arcPanT = Math.min(1, progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL * arcCopyEntryT);
    const slideT = Math.max(arcCopyEntryT, Math.max(0, Math.min(1, progress / 0.07)));
    const slideE = easeOutSine(slideT);

    // gridFormT driven by arc rotation — peel is always relative to how far the arc has rotated
    const gridFormT = Math.max(0, Math.min(
      1,
      (arcPanT - PROGRESS_GRID_ARC_START) / (PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START),
    ));

    // Convert arc-pan arrival times to progress units for fold/zoom phase calculations.
    // arcPanT(progress) ≈ progress/PROGRESS_PAN_END + PROGRESS_ARC_PREROLL
    //   →  progress ≈ (arcPanT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END
    const gpWin = 1.0 - GRID_PEEL_STAGGER;
    const arcRange = PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START;
    const foldFirstArcT = PROGRESS_GRID_ARC_START + gpWin * arcRange;
    const foldFirst = Math.max(0, (foldFirstArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
    const foldLast = SPHERE_FORMED_PROGRESS;
    const sphereFormT = Math.max(0, Math.min(1, (progress - foldFirst) / (foldLast - foldFirst)));
    const zoomT = Math.max(0, Math.min(1, (progress - foldLast) / (PROGRESS_ZOOM_END - foldLast)));
    sphereFormTAtLastTick = sphereFormT; // cache for the interaction module's click/hover handlers

    // Card-entry transforms (consumed by the arc branch of updateCardTransform):
    // entryRot — the arc holds off-screen for the first 5% of entry (while the text
    // settles), then sweeps counter-clockwise into its fanned position over the rest;
    // entryYOffset — the vertical slide-up; arcScale — the arc→sphere card size ratio.
    const arcEntryT = Math.max(0, Math.min(1, (arcCopyEntryT - 0.05) / 0.95));
    const entryRot = (1 - easeOutCubic(arcEntryT)) * 0.9;
    const entryYOffset = (1 - slideE) * H * 0.30;
    const arcScale = CARD_W_ARC / CARD_W_SPHERE;

    return {
      // scroll
      lenisY,
      scrollingDown,
      // phase t-values
      arcPanT,
      gridFormT,
      gpWin,
      sphereFormT,
      zoomT,
      // card-entry transforms (arc branch)
      entryRot,
      entryYOffset,
      arcScale,
      // Filled in by the pipeline stages below — declared here so the frame's shape is
      // stable + documented in one place: the active camera (updateActiveCamera),
      // whether any sphere rotation is applied (updateSphereRotation), and the
      // sphere-group z offset (updateSphereGroupDepth).
      activeCamera: null,
      sphereRotActive: false,
      sphGroupZ: 0,
    };
  }

  // Pick + position the camera for this frame and return it.
  //   Arc phase (no folding yet): ortho — flat 2D.
  //   Fold phase: perspective approaching CAM_Z_SPHERE in lockstep with the fold so
  //     the sphere reaches normal size exactly when cards finish folding.
  //   Zoom-through: perspective continuing CAM_Z_SPHERE → CAM_Z_END.
  function updateActiveCamera(frame) {
    const { sphereFormT, zoomT } = frame;
    const { SPHERE_R, CAM_Z_SPHERE, CAM_Z_END } = bp;
    let activeCamera;
    const camZArc = arcCamZ(H);
    if (sphereFormT === 0) {
      activeCamera = cameraOrtho;
      camera.position.z = camZArc;
      camera.updateProjectionMatrix();
    } else {
      activeCamera = camera;
      // Approach (camZArc → CAM_Z_SPHERE) uses easeInCubic: accelerates into the sphere,
      // matching velocity with the zoom phase (easeOutCubic starts fast). Sphere apparent
      // size is kept constant by sphereGroup.position.z offset, not camera proximity.
      const camZ = zoomT === 0
        ? lerpN(camZArc, CAM_Z_SPHERE, sphereFormT * sphereFormT * sphereFormT)
        : lerpN(CAM_Z_SPHERE, CAM_Z_END, easeOutCubic(zoomT));
      camera.position.z = camZ;
      camera.updateProjectionMatrix();
    }
    cameraInsideSphere = zoomT > 0 && Math.abs(camera.position.z) < SPHERE_R;
    return activeCamera;
  }

  // Sphere rotation (drag inertia + gentle auto-rotate) + modal-nav spring nudge +
  // sphere-drag barrel-warp easing. Returns sphereRotActive (whether any rotation
  // is applied) and refreshes sphereRotEuler/Quat for this frame.
  //
  // sphereRotY/sphereRotX accumulate from drag input while above the interactive
  // threshold. They are NOT written to sphereGroup.rotation — the rotation is
  // applied PER-CARD in the sphere/fold blocks of updateCardTransform, scaled by
  // each card's own fdE. This means:
  //   - Cards in sphere phase (fdE = 1) render fully rotated.
  //   - Cards mid-fold (fdE in (0, 1)) lerp between unrotated grid position and
  //     rotated sphere position, so rotation "unwinds" as a card unfolds back to grid.
  //   - Cards in arc/grid/peel phases (fdE = 0) are never rotated — eliminating the
  //     off-screen drift the previous sphereGroup-level rotation caused.
  // sphereGroup.rotation is forced to identity each frame so world-matrix queries
  // (modal snapshots, sphereGroup.attach) read the baked-in per-card rotation.
  function updateSphereRotation(frame) {
    const { sphereFormT } = frame;
    sphereGroup.rotation.x = 0;
    sphereGroup.rotation.y = 0;

    // ── Modal-navigation spring nudge ──
    // Runs even while modal is open (drag accumulation is gated, but the spring is
    // independent). Drives sphereRotY/X toward the target set by triggerModalNavNudge.
    // Slight underdamping (damp < critical) gives a small overshoot + settle.
    if (navNudgeActive) {
      const nDy = navNudgeTargetY - sphereRotY;
      const nDx = navNudgeTargetX - sphereRotX;
      navNudgeVelY = (navNudgeVelY + nDy * NAV_NUDGE_STIFF) * NAV_NUDGE_DAMP;
      navNudgeVelX = (navNudgeVelX + nDx * NAV_NUDGE_STIFF) * NAV_NUDGE_DAMP;
      sphereRotY += navNudgeVelY;
      sphereRotX += navNudgeVelX;
      // Settle when position is at target AND velocity is essentially zero.
      if (Math.abs(nDy) < 0.001 && Math.abs(nDx) < 0.001
          && Math.abs(navNudgeVelY) < 0.001 && Math.abs(navNudgeVelX) < 0.001) {
        navNudgeActive = false;
        navNudgeVelY = 0;
        navNudgeVelX = 0;
      }
    }
    if (sphereFormT >= SPHERE_INTERACTIVE_T) {
      // Pause auto-rotation + drag while a modal is open — sphere freezes at its current rotation
      if (modal.getModalIdx() < 0) {
        if (!drag.isDragging) {
          drag.velX *= DRAG_FRICTION;
          drag.velY *= DRAG_FRICTION;
          // Auto-spin is disabled under reduced motion (decision 2) — the globe sits
          // still until the user drags or arrow-keys it. Drag inertia is preserved.
          if (!reducedMotion) drag.velX += AUTO_ROT_SPEED;
        }
        // Inside the globe the visible (far-hemisphere) wall moves opposite to the
        // same world rotation, so a drag that pulls the outer shell right would push
        // the inner wall left. Negate the delta so dragging always tracks the surface
        // the user is looking at — consistent feel inside and out.
        const dragDir = cameraInsideSphere ? -1 : 1;
        sphereRotY += drag.velX * dragDir;
        sphereRotX += drag.velY * dragDir;
        sphereRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, sphereRotX));
      }

      // ── Sphere-drag warp ──
      // Baseline (while actively held) + velocity burst that decays via dragVel friction.
      // Smoothly ease toward a per-frame target rather than snapping. Without easing,
      // releasing a drag (or clicking — pointerup flips isDragging to false AND
      // opening the modal flips getModalIdx() non-negative) caused the baseline (0.05)
      // to drop to 0 in one frame — the remaining sphere cards' barrel distortion
      // popped, which read as a pixel-level "jump" right when the modal opened.
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
      // Below interactive threshold: stop accumulating drag inertia/auto-rot.
      // sphereRotY/sphereRotX are preserved while mid-scroll so a brief dip below
      // and back doesn't lose the user's accumulated rotation. Zero only at the very
      // top of the section so a fresh entry into the sphere starts upright.
      // Warp eases (same rate as the interactive-zone branch) rather than snapping.
      drag.velX = 0;
      drag.velY = 0;
      sphereDragWarp += (0 - sphereDragWarp) * 0.20;
      if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;
      if (sphereFormT < 0.01) {
        sphereRotY = 0;
        sphereRotX = 0;
      }
    }

    // sphereRotActive is a fast-path flag so the rotation math can be skipped when upright.
    const sphereRotActive = (sphereRotY !== 0 || sphereRotX !== 0);
    if (sphereRotEuler) {
      sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'XYZ');
      sphereRotQuat.setFromEuler(sphereRotEuler);
    }
    return sphereRotActive;
  }

  // Canvas visibility — instantly visible once the section approaches; no opacity
  // fade (the arc's own rotation/slide-up handles the "appearing" feel).
  function updateCanvasVisibility(frame) {
    const { lenisY, zoomT } = frame;
    const canvas = renderer.domElement;
    // Reduced motion pins frame.lenisY to the formed-sphere position, so it can't gate
    // visibility — use REAL scroll vs the block's bounds instead, so the fixed canvas
    // hides when the (collapsed ~100vh) block is scrolled out of view.
    if (reducedMotion) {
      const realY = window.scrollY;
      const inView = realY + H > blockDocTop && realY < blockDocTop + blockHeight;
      canvas.style.display = inView ? 'block' : 'none';
      if (inView) canvas.style.opacity = '1';
      return;
    }
    const showTrigger = blockDocTop - H * ENTRY_LEAD_VH; // matches entryStart in computeFrame
    if (lenisY < showTrigger || zoomT >= 0.95) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }
  }

  // Pull-quote: invisible while scrolling in from below; JS adds .is-active once
  // zoomT crosses 0.38 (element is already at its sticky position). The sticky
  // container handles the natural forward exit.
  // Scroll-up exit: the sticky element unsticks only ~84px after the fade threshold,
  // so a full 0.7s transition would still be playing when the element starts drifting
  // downward. On scroll-up we use a fast 0.15s fade so it disappears before moving.
  function updatePullQuote(frame) {
    const { zoomT, scrollingDown } = frame;
    if (pqEl) {
      if (zoomT >= 0.38 && !pqShown) {
        pqEl.style.transition = ''; // restore CSS default (0.7s, set in .css)
        pqShown = true;
        pqEl.classList.add('is-active');
      } else if (zoomT < 0.38 && pqShown) {
        if (!scrollingDown) {
          pqEl.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        }
        pqShown = false;
        pqEl.classList.remove('is-active');
      }
    }
  }

  // During fold: slide sphereGroup forward so the sphere-camera distance lerps from
  // FOLD_SPHERE_DIST (70% viewport height) at fold start to CAM_Z_SPHERE (93%) at fold
  // complete — easeInCubic holds it near 70% through formation, then swells to full size.
  // Cards NOT yet on the sphere subtract the returned sphGroupZ from their local z so
  // they stay at world z≈0 and appear at their correct size from the camera.
  //
  // IMPORTANT: the formula runs at sphereFormT === 0 too (not gated on sphereFormT > 0)
  // so sphGroupZ is CONTINUOUS at that boundary. Previously the condition was
  //   `(sphereFormT > 0 && zoomT === 0) ? (camZ - foldSphDist) : 0`
  // which jumped sphGroupZ from 0 → ~490 in one frame when the first card began
  // folding. For cards still in grid this canceled out (their mesh.position.z compensates
  // by -sphGroupZ → world z stays 0), but for the card that just transitioned into the
  // FOLD block, its world z = (sphGroupZ + spherePos.z) × fdE jumped from 0 → ~25 in one
  // frame — a visible forward "dart" that read as a scene glitch during scroll.
  // Using camera.position.z directly (always set in both ortho/perspective branches above).
  function updateSphereGroupDepth(frame) {
    const { sphereFormT, zoomT } = frame;
    const { FOLD_SPHERE_DIST, CAM_Z_SPHERE } = bp;
    const sphereFormT3 = sphereFormT * sphereFormT * sphereFormT;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT3);
    const sphGroupZ = zoomT === 0 ? (camera.position.z - foldSphDist) : 0;
    sphereGroup.position.z = sphGroupZ;
    return sphGroupZ;
  }

  // Option C: global chromatic aberration SVG filter on the WebGL canvas.
  // Vertical shift (dy) tracks scroll velocity — scroll is vertical so R/B shift up/down.
  // Resets to zero when scrolling stops so the canvas returns to clean on every settle.
  function updateGlobalCA() {
    if (CA_ENABLED && caFilterR) {
      const canvas = renderer.domElement;
      const scrollVelNorm = Math.min(1.0, scrollVel / SCROLL_VEL_MAX);
      const globalCA = scrollVelNorm * CA_PX_MAX;
      if (globalCA > 0.05) {
        caFilterR.setAttribute('dx', '0');
        caFilterR.setAttribute('dy', (-globalCA).toFixed(2));
        caFilterB.setAttribute('dx', '0');
        caFilterB.setAttribute('dy', (globalCA * 0.5).toFixed(2));
        canvas.style.filter = `url(#ca-filter-${gid})`;
      } else {
        canvas.style.filter = '';
      }
    }
  }

  // Arc-copy overlay: fades/slides in with the entry, fades + scales out as the
  // headline arrives. Pinned left per breakpoint.
  function updateArcCopy() {
    const arcCopyEl = q('.globe-gallery-arc-copy');
    if (arcCopyEl) {
      const PROGRESS_HEADLINE_IN = 0.25;
      const PROGRESS_ARC_COPY_OUT = 0.50;
      const arcCopyInE = easeOutCubic(Math.min(1, arcCopyEntryT / 0.336));
      const arcCopyOutT = Math.max(0, Math.min(
        1,
        (progress - PROGRESS_HEADLINE_IN) / (PROGRESS_ARC_COPY_OUT - PROGRESS_HEADLINE_IN),
      ));
      const arcCopyOutE = easeOutCubic(arcCopyOutT);
      const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
      const arcCopySlide = 24 * (1 - arcCopyInE);
      // sm pins to 8px from viewport left (matches nav pill outer padding).
      // md uses the 24px-grid-aligned position with centering offset.
      const gridLeft = (bp.name === 'sm')
        ? 8
        : 24 + Math.max(0, (W - 48 - 1392) / 2);
      arcCopyEl.style.left = `${gridLeft}px`;
      arcCopyEl.style.opacity = arcCopyOp.toFixed(3);
      arcCopyEl.style.transform = `translateY(${arcCopySlide.toFixed(1)}px)`;
    }
  }

  // Draw the main scene, plus the modal card on its own canvas when active.
  function renderScene(activeCamera) {
    renderer.render(scene, activeCamera);
    modal.render();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // Card transform stage. Each card runs exactly one phase branch per frame:
  // arc → peel → grid-dwell → fold → sphere. The four place*Card branches + the
  // per-card dispatcher live at runtime scope (not nested in updateCardTransforms)
  // so each reads as a standalone named function. They stay in THIS file rather
  // than a src/ module because they read deeply from the runtime closure (BP
  // constants, sphere-rotation quats, drag velocity, setCardUV / applyMotionCA,
  // arcCtx, …) — a module boundary here would mean a huge DI surface and getter
  // calls in the per-card hot loop. The per-frame values that vary (sphGroupZ,
  // sphereRotActive, the entry/arc transforms) are read from the shared `frame`
  // context (built by computeFrame, threaded through the pipeline).
  // ════════════════════════════════════════════════════════════════════════════

  // ── Branch: fully in sphere ──
  function placeSphereCard(card, mesh, cardCA, frame) {
    const { sphereRotActive, sphGroupZ } = frame;
    mesh.visible = true;
    const hs = 1 + card.hoverT * HOVER_SCALE; // 1.0 → 1.08 on hover
    // Apply manual sphere-drag rotation: world position = R × spherePos.
    // sphereGroup.rotation is identity, so the rotated local position becomes the
    // rotated world position (offset only by sphereGroup.position.z).
    if (sphereRotActive) {
      mesh.position.copy(card.spherePos).applyEuler(sphereRotEuler);
    } else {
      mesh.position.copy(card.spherePos);
    }
    // Near-camera proximity fade: how far this card sits in front of the lens
    // (sphereGroup is offset only in z, so card world z = sphGroupZ + mesh.position.z).
    // Dissolve it before it can fill the screen during the zoom-through.
    // Cull (visible=false) only at depth ≤ 0 — cards at/behind the lens, e.g. the far
    // hemisphere once we're inside — NOT at the fade edge: proxFade is already 0 for
    // depth ≤ fadeEnd, so the only visibility toggle happens where the card is invisible
    // on both sides. Toggling at the fade edge instead would let a sub-pixel scroll
    // jitter (Lenis easing to its target after a scroll) flash near cards on/off.
    const { CARD_H_SPHERE } = bp;
    const depth = camera.position.z - (sphGroupZ + mesh.position.z);
    if (depth <= 0) { mesh.visible = false; return; }
    const fadeEnd = NEAR_FADE_END * CARD_H_SPHERE;
    const fadeStart = NEAR_FADE_START * CARD_H_SPHERE;
    const proxFade = Math.max(0, Math.min(1, (depth - fadeEnd) / (fadeStart - fadeEnd)));
    mesh.scale.set(card.sphereScaleX * hs, hs, hs);
    setCardUV(mesh, 1, 1, 0, 0);
    setCardAspect(mesh, card.imgAspect);
    if (sphereRotActive) {
      mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      mesh.quaternion.copy(card.sphereQuat);
    }
    mesh.renderOrder = 0;
    mesh.material.opacity = proxFade;
    // Hover composes additively on top of transition CA (which is 0 in steady sphere state).
    // uHoverPos anchors the warp at the cursor's UV position on this card when hovered;
    // when not hovered, the sphere-drag warp uses each card's own center (0.5, 0.5).
    if (CA_ENABLED) {
      mesh.material.uniforms.uCA.value = cardCA + card.hoverT * HOVER_CA;
      mesh.material.uniforms.uWarp.value = card.hoverT * HOVER_WARP + sphereDragWarp;
      if (card.hoverT > 0.01) {
        mesh.material.uniforms.uHoverPos.value.copy(card.hoverUV);
      } else {
        mesh.material.uniforms.uHoverPos.value.set(0.5, 0.5);
      }
    }
    // Sphere phase: local position is constant (sphereGroup rotates). Approximate
    // world-space delta as depth × angular velocity — front-facing cards (large z) show
    // more CA than side-facing cards (z ≈ 0), giving a convincing rotation smear.
    applyMotionCA(mesh, card.spherePos.z * drag.velX, -card.spherePos.z * drag.velY);
  }

  // ── Branch: grid → sphere fold ──
  function placeFoldingCard(card, mesh, fdE, prevMeshX, prevMeshY, frame) {
    const { sphGroupZ, sphereRotActive } = frame;
    mesh.visible = true;
    // Sphere endpoint is FULLY rotated by the current drag; the lerp itself
    // handles the unwind (at fdE=0 the card is at unrotated gridPos, at fdE=1
    // it's at fully-rotated sphere position; in between, a straight-line lerp
    // between those two world points). Quaternion slerps between gridQuat and
    // the rotated sphereQuat by fdE, so orientation reaches the rotated slot
    // exactly when position does.
    //
    // Cards with fdE = 0 fall through to the grid/arc blocks below where no
    // rotation is applied — so non-sphere-phase cards are never transformed
    // by the drag rotation.
    let sX; let sY; let sZ;
    if (sphereRotActive) {
      tmpVec3.copy(card.spherePos).applyEuler(sphereRotEuler);
      sX = tmpVec3.x; sY = tmpVec3.y; sZ = tmpVec3.z;
    } else {
      sX = card.spherePos.x; sY = card.spherePos.y; sZ = card.spherePos.z;
    }
    mesh.position.set(
      lerpN(card.gridPos.x, sX, fdE),
      lerpN(card.gridPos.y, sY, fdE),
      lerpN(card.gridPos.z - sphGroupZ, sZ, fdE),
    );
    mesh.scale.set(
      lerpN(card.gridScale, card.sphereScaleX, fdE),
      lerpN(card.gridScale, 1, fdE),
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
    if (sphereRotActive) {
      foldRotQuat.copy(sphereRotQuat).multiply(card.sphereQuat);
      mesh.quaternion.slerpQuaternions(card.gridQuat, foldRotQuat, fdE);
    } else {
      mesh.quaternion.slerpQuaternions(card.gridQuat, card.sphereQuat, fdE);
    }
    mesh.renderOrder = 0;
    mesh.material.opacity = 1;
    applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
  }

  // ── Branch: fully in grid (dwell phase) ──
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

  // ── Branch: arc phase — waiting to peel, or actively peeling arc→grid ──
  function placeArcCard(card, mesh, i, gpE, prevMeshX, prevMeshY, frame) {
    const { arcPanT, entryRot, entryYOffset, arcScale, sphGroupZ } = frame;
    const { N_TOTAL, N_VISIBLE, ARC_DENSE_COUNT } = bp;
    // No conveyor: all cards on arc simultaneously, slot = i for every card.
    const slot = i;
    const rawT = Math.max(0, Math.min(1, slot / (N_VISIBLE - 1)));
    // Non-uniform fanT distribution (see constants block): cluster low-i cards off-screen,
    // spread high-i cards across the visible upper arc for ~17% overlap instead of ~35%.
    const splitR = ARC_DENSE_COUNT / (N_VISIBLE - 1);
    let fanT;
    if (rawT < splitR) {
      fanT = (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT;
    } else {
      fanT = ARC_DENSE_SPLIT
           + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
    }
    const fan = getFanData(fanT, arcCtx);
    const arcDelay = fanT * ARC_STAGGER;
    const arcLocalT = Math.max(
      0,
      Math.min(1, (arcPanT - arcDelay) / Math.max(0.01, 1 - ARC_STAGGER)),
    );
    const arcLocalE = easeInOutCubic(arcLocalT);
    const pxPushed = fan.px + fan.rx * 60 * arcLocalE;
    const pyPushed = fan.py + fan.ry * 60 * arcLocalE;
    const wp = entryRot > 0.001
      ? rotateArcPoint(pxPushed, pyPushed, entryRot, arcCtx, W, H)
      : cssToWorld(pxPushed, pyPushed, W, H);
    const arcY = wp.y - entryYOffset;
    const webglRot = -fan.cssRot - entryRot;

    mesh.visible = true;
    setCardAspect(mesh, CARD_ASPECT);

    if (gpE <= 0) {
      // Arc phase — reset peel snapshot so the next peel re-captures cleanly
      card.peelStartRot = null;
      mesh.position.set(wp.x, arcY, -sphGroupZ);
      mesh.scale.setScalar(arcScale);
      mesh.rotation.set(0, 0, webglRot);
      mesh.renderOrder = N_VISIBLE - Math.round(slot);
      mesh.material.opacity = 1;
      applyMotionCA(mesh, wp.x - prevMeshX, arcY - prevMeshY, undefined, CA_MOTION_STRENGTH_ARC);
    } else {
      // Peel phase — snapshot the rotation on the first frame, normalized to within ±π of
      // gridTilt for shortest angular path. Direct z-angle lerp avoids the quaternion slerp
      // hemisphere flip that snaps when webglRot wraps across atan2's discontinuity.
      if (card.peelStartRot == null) {
        let startRot = webglRot;
        while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
        while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
        card.peelStartRot = startRot;
      }
      const interpRot = card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
      mesh.position.set(
        lerpN(wp.x, card.gridPos.x, gpE),
        lerpN(arcY, card.gridPos.y, gpE),
        -sphGroupZ,
      );
      mesh.scale.setScalar(lerpN(arcScale, card.gridScale, gpE));
      mesh.rotation.set(0, 0, interpRot);
      mesh.renderOrder = N_TOTAL + N_VISIBLE - i;
      mesh.material.opacity = 1;
      applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
    }
  }

  // Per-card dispatcher: derive this card's timing (peel/fold easings, CA, hover),
  // then run exactly one phase branch. Extracted from the old `for` body so the
  // early-outs read as `return` (no-continue) — called once per card by
  // updateCardTransforms.
  function updateCardTransform(i, frame) {
    const { gridFormT, gpWin, sphereFormT, entryRot } = frame;
    const { N_TOTAL } = bp;
    const card = cards[i];
    const { mesh } = card;

    // Skip cards the modal manages — the active modal card + any swipe-neighbors
    // parented into the modal scene. Their positions/materials/scales are driven by
    // modal.js; the main loop would otherwise overwrite them every frame.
    if (modal.isCardManaged(card)) return;

    // ── Arc → grid peel stagger: i-based base cascade + per-card jitter for organic timing ──
    const baseDelay = (i / (N_TOTAL - 1)) * GRID_PEEL_STAGGER;
    const jitter = (card.peelJitter - 0.5) * ARC_PEEL_JITTER;
    const gpDelay = Math.max(0, Math.min(GRID_PEEL_STAGGER, baseDelay + jitter));
    const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
    const gpE = easeOutCubic(gpLocalT);

    // ── Grid → sphere fold: starts immediately when this card arrives in grid ──
    // Convert arc-pan arrival back to progress for fold timer
    const gpArrivalArcT = PROGRESS_GRID_ARC_START
      + Math.min(1, gpDelay + gpWin) * (PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START);
    const gpArrivalProg = Math.max(0, (gpArrivalArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
    const fdLocalT = Math.max(0, Math.min(1, (progress - gpArrivalProg) / PROGRESS_FOLD_DUR));
    const fdE = gpE >= 1 ? easeInOutCubic(fdLocalT) : 0;

    // ── Option B: per-card CA strength driven by transition state ──
    // Arc entry: CA peaks when entryRot is large (arc rotating in), fades to 0 when settled.
    // Peel + fold: bell curve (peaks at midpoint of each transition, 0 at start/end).
    let cardCA = 0;
    if (CA_ENABLED) {
      cardCA = Math.max(
        entryRot / 0.9,
        gpE * (1 - gpE) * 4,
        fdE * (1 - fdE) * 4,
      ) * CA_STRENGTH;
      mesh.material.uniforms.uCA.value = cardCA;
      // uWarp default = 0 every frame; sphere block re-applies based on hoverT below.
      mesh.material.uniforms.uWarp.value = 0;
    }

    // ── Hover state ease ──
    // Gated on the GLOBAL interactive threshold (same as drag/click), not per-card
    // fdE. Previously `if (fdE < 1) card.hoverTarget = 0;` blocked hover on any card
    // still finishing its fold animation — meaning hover wouldn't activate at
    // sphereFormT = 0.8 for the late-folding cards even though drag/click did.
    // Hover VISUAL effects still only render inside the sphere block (fdE >= 1)
    // so a card lerping through fold doesn't get scale/warp applied mid-motion.
    if (sphereFormT < SPHERE_INTERACTIVE_T) card.hoverTarget = 0;
    card.hoverT += (card.hoverTarget - card.hoverT) * HOVER_RATE;

    // Capture position BEFORE this frame's section block updates it — delta drives motion CA.
    const prevMeshX = mesh.position.x;
    const prevMeshY = mesh.position.y;

    // Exactly one phase branch runs per card, in order of latest phase first.
    if (fdE >= 1) { placeSphereCard(card, mesh, cardCA, frame); return; }
    if (fdE > 0) { placeFoldingCard(card, mesh, fdE, prevMeshX, prevMeshY, frame); return; }
    if (gpE >= 1) { placeGridCard(card, mesh, i, prevMeshX, prevMeshY, frame); return; }
    placeArcCard(card, mesh, i, gpE, prevMeshX, prevMeshY, frame);
  }

  // Position every card for this frame: run the per-card dispatcher over the shared
  // `frame` context (built by computeFrame, with the producer stages' results already
  // written back). The modal-active card + swipe-neighbors are skipped inside it.
  function updateCardTransforms(frame) {
    for (let i = 0; i < bp.N_TOTAL; i += 1) updateCardTransform(i, frame);
  }

  // ── Per-frame tick — thin orchestrator ──────────────────────────────────────
  // Builds the per-frame `frame` context, then runs each stage in a fixed order,
  // writing producer results (activeCamera, sphereRotActive, sphGroupZ) back onto
  // `frame` so later stages + the card loop read them. Stage ORDER matters and is
  // load-bearing in two ways: (1) a producer must run before its consumers
  // (updateActiveCamera sets cameraInsideSphere + camera.z, read by
  // updateSphereRotation + updateSphereGroupDepth); (2) modal.updateAnimation's
  // closing branch reads sphereGroup.position from the PREVIOUS frame and the live
  // sphereRotEuler/Quat refreshed by updateSphereRotation THIS frame. Keep it intact.
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
    renderer.sortObjects = frame.sphereFormT > 0.5;

    frame.sphGroupZ = updateSphereGroupDepth(frame);
    updateGlobalCA();
    updateCardTransforms(frame);
    updateArcCopy();
    renderScene(frame.activeCamera);
  }

  // rAF driver (replacing the prototype's gsap.ticker). Defined here, after tick(),
  // so there's no forward reference; startTicker/stopTicker are called from
  // initRuntime (once textures load) and destroy.
  let rafId = 0;
  function rafLoop() { tick(); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() { if (!rafId) rafId = requestAnimationFrame(rafLoop); }
  function stopTicker() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  // ── Layout ─────────────────────────────────────────────────────────────────
  let resizeHandler = null;
  let layoutObs = null; // ResizeObserver keeping block metrics fresh as page content loads

  // ── Init ───────────────────────────────────────────────────────────────────
  function initRuntime() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas) return false;

    W = window.innerWidth;
    H = window.innerHeight;

    // Resolve the breakpoint profile BEFORE anything reads bp.N_TOTAL, bp.SPHERE_R,
    // etc. CSS is intentionally NOT BP-aware here — author per-BP CSS with
    // traditional @media queries.
    const band = resolveBP(W);
    bp = resolveBpProfile(band.name, band.cfg);

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (e) {
      renderer = null;
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false; // we manage order via mesh.renderOrder

    scene = new THREE.Scene();

    // Perspective camera — used during sphere + zoom phases
    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 0, arcCamZ(H));
    camera.lookAt(0, 0, 0);

    // Orthographic camera — used during arc phase for true flat 2D (no perspective distortion)
    // Bounds map 1 world unit = 1 CSS pixel, matching the arc math coordinate space.
    cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
    cameraOrtho.position.set(0, 0, 100);
    cameraOrtho.lookAt(0, 0, 0);

    function doLayout() {
      W = window.innerWidth;
      H = window.innerHeight;

      // Crossing the 768px boundary changes the render profile (card count,
      // grid, sphere) → full destroy()+init() so all geometry, textures, and
      // grid layout rebuild with the new band's constants. Resizing within a
      // band falls through to the cheap path below.
      const nextBand = resolveBP(W);
      if (nextBand.name !== bp.name) {
        // eslint-disable-next-line no-use-before-define
        destroy();
        if (initRuntime() === false) root.classList.add('globe-gallery--empty');
        return;
      }
      blockDocTop = root.getBoundingClientRect().top + window.scrollY;
      blockHeight = root.offsetHeight || window.innerHeight * 7;
      // Re-apply DPR — it can change at runtime (e.g. dragging the window between
      // monitors of different pixel density); without this the canvas would keep
      // the old DPR's internal buffer size and render at the wrong resolution.
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
    }
    doLayout();
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = doLayout;
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Recompute block metrics whenever page height changes (images/blocks loading
    // above the block shift its offsetTop; blockHeight=0 at first paint makes
    // progress=Infinity and skips straight to the zoom/pull-quote phase).
    if (layoutObs) layoutObs.disconnect();
    layoutObs = new ResizeObserver(() => {
      blockDocTop = root.getBoundingClientRect().top + window.scrollY;
      blockHeight = root.offsetHeight || window.innerHeight * 7;
    });
    layoutObs.observe(document.body);

    interaction.setup(canvas);

    // Focus-snap guard listeners (see snapToInteractive): suppress the snap while the tab
    // is backgrounded so returning to the tab doesn't yank the page to the globe.
    window.addEventListener('blur', armFocusGuard);
    window.addEventListener('focus', disarmFocusGuard);
    document.addEventListener('visibilitychange', onVisibilityChange);

    canvas.style.display = 'block';

    // Cache SVG filter elements for Option C global CA
    caFilterR = q('.globe-gallery-ca-r-offset');
    caFilterB = q('.globe-gallery-ca-b-offset');

    modal.setup();

    loadCardTextures({
      count: bp.N_TOTAL,
      getSrc: (i) => getCardMetadata(i).img,
      planeAspect: CARD_ASPECT,
    }, (loadedTextures, loadedTexData) => {
      textures = loadedTextures;
      cardTexData = loadedTexData;
      buildCards();
      a11y.setup();
      if (!tickerAdded) {
        startTicker();
        tickerAdded = true;
      }
    });
    return true;
  }

  function destroy() {
    stopTicker();
    tickerAdded = false;
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    if (layoutObs) {
      layoutObs.disconnect();
      layoutObs = null;
    }
    window.removeEventListener('blur', armFocusGuard);
    window.removeEventListener('focus', disarmFocusGuard);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    // Pointer interaction cleanup (removes canvas + window listeners, clears cursor).
    interaction.teardown();
    if (renderer) {
      renderer.domElement.style.filter = '';
      renderer.dispose();
      renderer.domElement.style.display = 'none';
    }
    cards = [];
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    // Modal cleanup (disposes its renderer, clears the close timeout + keydown handler).
    modal.destroy();
    // A11y gallery cleanup so a fresh init starts clean.
    a11y.teardown();
    // Reset arc-copy and pull-quote
    const arcCopyEl = q('.globe-gallery-arc-copy');
    if (arcCopyEl) arcCopyEl.style.cssText = '';
    if (pqEl) { pqEl.classList.remove('is-active'); pqEl.style.transition = ''; pqShown = false; }
    prevLenisY = 0; scrollVel = 0;
    // NOTE: `bp` is intentionally NOT cleared here. doLayout() compares bp.name
    // against the resolved band to detect a profile crossing, and initRuntime()
    // overwrites it. Clearing it would break the re-init flow.
  }

  return { init: initRuntime, destroy };
}

// ── Localized UI strings ──────────────────────────────────────────────────────
// Chrome aria-labels (modal nav/close, region labels) + the keyboard-gallery
// button labels all resolve through Milo's placeholder dictionary so they localize
// per locale, with English as the fallback (the default-locale sheet supplies it;
// see README "Localization" for the keys to add). The card label is a tokenized
// template so each locale controls word order around the interpolated values.
// TODO: finalize authoring these keys
async function resolveGlobeLabels() {
  const [
    arcRegion, prevCard, nextCard, closeBtn, appsUsed, galleryTplRaw, cardTplRaw,
  ] = await replaceKeyArray(
    ['image-gallery-intro', 'previous-card', 'next-card', 'close',
      'apps-used', 'image-gallery-instructions', 'image-gallery-card-label'],
    getConfig(),
  );
  // replaceKey returns the de-hyphenated key when a placeholder is absent from every
  // sheet; for the tokenized templates that leaves no {{…}} to fill, so fall back to
  // the English template. (The static labels de-hyphenate to readable English.)
  const galleryTpl = galleryTplRaw.includes('{{count}}')
    ? galleryTplRaw
    : 'Interactive image gallery, {{count}} images. '
      + 'Use the Left and Right arrow keys to rotate the globe, and Enter to browse the gallery.';
  const cardTpl = cardTplRaw.includes('{{name}}')
    ? cardTplRaw
    : 'View photo by {{name}}, {{index}} of {{count}}';
  return {
    arcRegion,
    prevCard,
    nextCard,
    closeBtn,
    appsUsed,
    // aria-label for the single globe widget — describes what the globe is + how to
    // drive it (screen-reader "what is this"). count is the live card total.
    galleryLabel: (count) => galleryTpl.replace('{{count}}', String(count)),
    cardLabel: (name, index, count) => cardTpl
      .replace('{{name}}', name)
      .replace('{{index}}', String(index))
      .replace('{{count}}', String(count)),
  };
}

// ── Block entry point ────────────────────────────────────────────────────────
export default async function init(el) {
  // Reduced-motion: skip the WebGL experience entirely and collapse the block's
  // tall scroll length. TODO (iterate): author a static poster fallback like pdf-space.
  // Reduced motion: render a STATIC, still-interactive globe instead of the scroll
  // choreography. The runtime pins the timeline to the formed-sphere state (no arc/grid/
  // fold/zoom), disables auto-spin, and snaps the modal open/close — drag, arrow-spin,
  // and click→open all still work. The block collapses to ~100vh (see .globe-gallery--
  // reduced in the CSS) so it's a normal-height section rather than a tall scroll runway.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) el.classList.add('globe-gallery--reduced');

  // Extract authored content BEFORE buildGlobeDom() wipes the block's children.
  // fragmentHref is captured here so it survives the DOM wipe.
  const { arcCopy, pullQuote, fragmentHref } = parseAuthoredContent(el);

  const labels = await resolveGlobeLabels();
  // buildGlobeDom mints + returns this instance's unique id suffix (CA filter,
  // modal aria targets); the runtime reuses it for the url(#…) filter ref. It also
  // fills the arc-copy / pull-quote slots with the parsed authored text.
  const gid = buildGlobeDom(el, labels, { arcCopy, pullQuote });

  // Cards come from the authored fragment link, resolved by Milo before init().
  const cards = fragmentHref ? await fetchFragmentCards(fragmentHref) : null;
  // No cards → nothing to render. Collapse the block rather than init an empty scene.
  if (!cards || cards.length === 0) {
    el.classList.add('globe-gallery--empty');
    return el;
  }
  const runtime = createGlobeGalleryRuntime(cards, el, gid, labels, reducedMotion);
  if (!runtime) { el.classList.add('globe-gallery--empty'); return el; }
  if (runtime.init() === false) { el.classList.add('globe-gallery--empty'); return el; }
  el.globeRuntime = runtime;

  // Teardown when the block is removed from the document (SPA / MEP swaps).
  const removalObserver = new MutationObserver(() => {
    if (document.contains(el)) return;
    runtime.destroy();
    removalObserver.disconnect();
  });
  if (el.parentElement) removalObserver.observe(el.parentElement, { childList: true });

  return el;
}
