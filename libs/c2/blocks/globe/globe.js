/* ─────────────────────────────────────────────────────────────────────────
   Offer Globe — Three.js WebGL scrolled hero.

   Phases (progress 0→1 across 850vh .offer-pin-spacer):
     0.00 – 0.55  Arc: 45 cards rotate across viewport
     0.14 – 0.65  Grid peel: cards peel off arc into 9×5 grid (staggered)
     0.37 – 0.78  Sphere fold: each card folds to sphere immediately after arriving in grid
     0.78 – 1.00  Zoom: camera flies through sphere
   ───────────────────────────────────────────────────────────────────────── */
import * as THREE from './three.module.min.js';
import { parseAuthoredContent, fetchFragmentCards } from './authoring.js';
import buildGlobeDom from './markup.js';
import { CARD_VERT, CARD_FRAG, MODAL_VERT, MODAL_FRAG } from './shaders.js';
// ════════════════════════════════════════════════════════════════════════════
// Tuning constants + pure helpers (module scope — pure, no per-instance state).
// Grouped by concern; the render loop in createGlobeRuntime() reads them directly.
// (authoring.js, markup.js, shaders.js remain separate modules.)
// ════════════════════════════════════════════════════════════════════════════

// ── Layout / breakpoints ─────────────────────────────────────────────────────
// Image-derived (texture aspect, never changes)
const CARD_ASPECT = 456 / 631; // portrait

// Visual-layout knobs that change between viewport sizes. Tablet & mobile start as
// EXACT mirrors of desktop — tuning a non-desktop BP cannot affect desktop because
// each BP holds its own values. Resolved once at init() via resolveBP(W); crossing
// a BP boundary on resize triggers full destroy() + init() (see doLayout).
//
// To add a new breakpoint: copy one of the entries below, give it a new key (e.g.
// 'largeDesktop'), set minWidth, and update resolveBP() to test for it.
// Thresholds match the ACOM design system (Consonant 2.0):
//   desktop ≥1024, tablet 768–1023, mobile <768.
// Type/layout @media queries in CSS use the same boundaries.
const BREAKPOINTS = {
  desktop: {
    minWidth: 1024,
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
  tablet: {
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
  mobile: {
    // Tuned for 375x667 portrait. Sphere fits ~88% viewport width / 49% height
    // at SPHERE_R=20, CAM_Z_SPHERE=70. Card count + grid layout adjusted to
    // portrait orientation. Arc cards sized to fit within viewport with margin.
    // ARC_DENSE_COUNT=0 → cards spread uniformly across arc (no off-screen
    // dense cluster), since N_TOTAL=24 isn't crowded enough to need clustering.
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
  if (w >= BREAKPOINTS.desktop.minWidth) return { name: 'desktop', cfg: BREAKPOINTS.desktop };
  if (w >= BREAKPOINTS.tablet.minWidth) return { name: 'tablet', cfg: BREAKPOINTS.tablet };
  return { name: 'mobile', cfg: BREAKPOINTS.mobile };
}

// ── Phase timeline (progress 0→1 across the 850vh spacer) ────────────────────
const ARC_STAGGER = 0.594;
const P_PAN_END = 0.55;
const P_ARC_PREROLL = 0.30;
// Grid peel expressed as arc-rotation fraction (0=arc start, 1=arc end).
const P_GRID_ARC_START = 0.30;
const P_GRID_ARC_END = 0.60;
const P_FOLD_DUR = 0.25;
const P_ZOOM_END = 1.00;

// ── Entry timing ─────────────────────────────────────────────────────────────
// Two independent knobs (the WebGL canvas is transparent, so an early reveal only
// draws the card meshes, not an opaque sheet over the content above):
//   ENTRY_LEAD_VH — how far, in viewport heights, BEFORE the spacer's top the
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
const DRAG_FRICTION = 0.94;
const DRAG_SENSITIVITY = 0.005;
const MAX_VEL = 0.06;
const AUTO_ROT_SPEED = 0.000045;

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
const CA_PX_MAX = 3; // max vertical pixel shift for global canvas SVG filter (Option C)

// ── Hover (sphere phase only) ────────────────────────────────────────────────
// Polished/premium feel — settles in/out, no continuous animation while hovered.
const HOVER_CA = 0.025; // CA bump composed additively onto transition CA
const HOVER_WARP = 0.4; // barrel-distortion amount sent to shader
const HOVER_SCALE = 0.25; // scale multiplier added: 1.0 → 1.25
const HOVER_RATE = 0.15; // per-frame lerp toward target (~125ms to 80%)

// ── Sphere-drag warp (all breakpoints) ───────────────────────────────────────
// Hybrid intensity: a baseline while actively dragging, plus a velocity-driven
// burst that decays naturally with dragVel via DRAG_FRICTION after release.
// Applied to ALL sphere cards (front + back) using each card's own center (0.5, 0.5).
const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed (px/frame in world units)
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value

// ── Easing ───────────────────────────────────────────────────────────────────
function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
function easeOutSine(t) { return Math.sin((t * Math.PI) / 2); }

function lerpN(a, b, t) { return a + (b - a) * t; }

// ── Fibonacci sphere distribution ────────────────────────────────────────────
function fibSpherePos(i, total, radius) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Per-page instance counter → unique ids for the few nodes that still need one
// (the CA SVG filter referenced via url(#…), and the modal's aria-labelledby).
let globeInstanceSeq = 0;

// The globe runtime. Originally an IIFE exposing window.offerGlobe in the
// hub-creative prototype; now a factory returning { init, destroy }.
// Key changes from the prototype: gsap.ticker → requestAnimationFrame,
// Lenis reads → window.scrollY. `root` is the block element; all DOM lookups
// are scoped to it (root.querySelector) so >1 globe can coexist on a page.
// `gid` is this instance's unique-id suffix (see globeInstanceSeq).
function createGlobeRuntime(authoredCards, root, gid) {
  // rAF driver replacing gsap.ticker.
  let rafId = 0;
  // eslint-disable-next-line no-use-before-define -- tick() runs only via rAF, after init
  function rafLoop() { tick(); rafId = requestAnimationFrame(rafLoop); }
  function startTicker() { if (!rafId) rafId = requestAnimationFrame(rafLoop); }
  function stopTicker() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  // Root-scoped query helper — every DOM lookup goes through this so the runtime
  // only ever touches its own block's nodes (multi-instance safe).
  const q = (sel) => root.querySelector(sel);

  // The card content the runtime renders. authoredCards is always present (from the fragment).
  const CARD_CONTENT = authoredCards || [];

  // Per-card accessor. N_TOTAL is clamped to the authored count (see applyBP),
  // so i is always in range — no modulo wrap. Fewer authored cards than the grid
  // can hold simply leaves the last grid column partially filled.
  function getCardMetadata(i) {
    return CARD_CONTENT[i];
  }

  // ── Per-BP values — declared here, assigned by applyBP() before buildCards() runs ──
  // Do NOT read these at module load time; their values are only valid after init().
  let N_TOTAL; let N_VISIBLE; let ARC_SPAN; let SPHERE_R; let CARD_H_SPHERE; let CARD_W_SPHERE;
  let CARD_W_ARC; let CAM_Z_SPHERE; let CAM_Z_END;
  let FOLD_SPHERE_DIST; let GRID_COLS; let GRID_ROWS;
  let ARC_DENSE_COUNT;
  let currentBPName = null;

  function applyBP(cfg) {
    // N_TOTAL follows the authored card count, capped at the per-BP maximum
    // (cfg.N_TOTAL == GRID_COLS*GRID_ROWS — the grid can't hold more). Fewer
    // cards → ragged last grid column (accepted). More cards → extras dropped.
    N_TOTAL = Math.min(CARD_CONTENT.length, cfg.N_TOTAL);
    N_VISIBLE = N_TOTAL; // all cards on arc simultaneously (no conveyor)
    ARC_SPAN = cfg.ARC_SPAN;
    SPHERE_R = cfg.SPHERE_R;
    CARD_H_SPHERE = cfg.CARD_H_SPHERE;
    CARD_W_SPHERE = CARD_H_SPHERE * CARD_ASPECT;
    CARD_W_ARC = cfg.CARD_W_ARC;
    CAM_Z_SPHERE = cfg.CAM_Z_SPHERE;
    CAM_Z_END = cfg.CAM_Z_END;
    // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
    FOLD_SPHERE_DIST = Math.round(SPHERE_R / (0.35 * Math.tan(Math.PI / 6)));
    GRID_COLS = cfg.GRID_COLS;
    GRID_ROWS = cfg.GRID_ROWS;
    // Clamp the dense-arc cluster to the actual card count so a small authored
    // set still leaves cards for the visible spread region (fanT > ARC_DENSE_SPLIT).
    ARC_DENSE_COUNT = Math.min(cfg.ARC_DENSE_COUNT, N_TOTAL);
  }

  // ── State ──────────────────────────────────────────────────────────────────
  let renderer; let scene; let camera; let cameraOrtho; let
    sphereGroup;
  let modalRenderer; let modalScene; let
    modalCanvasEl; // separate canvas/scene for the flown-out modal card
  // { mesh, spherePos, sphereQuat, gridPos, gridScale, gridTilt, gridQuat, gridCol, gridRow }
  let cards = [];
  let textures = [];
  // per-card: sphereScaleX, arc UV crop values — populated in done(), read in buildCards()
  const cardTexData = [];
  let gridCardW = 0; let
    gridTilts = [];

  let progress = 0;
  let arcCopyEntryT = 0;
  let spacerOffsetTop = 0;
  let spacerHeight = 0;
  let W = 0; let
    H = 0;

  const pqEl = q('.offer-pullquote');
  let pqShown = false;

  let caFilterR = null; // SVG feOffset element for red channel  (Option C)
  let caFilterB = null; // SVG feOffset element for blue channel (Option C)
  let prevLenisY = 0; // previous frame scroll position — used to compute scrollVel
  let scrollVel = 0; // |lenisY - prevLenisY| — drives motion trail intensity

  let sphereRotY = 0; let
    sphereRotX = 0;
  let dragVelX = 0; let
    dragVelY = 0;
  let isDragging = false; let lastMX = 0; let
    lastMY = 0;
  let tickerAdded = false;
  let sphereDragWarp = 0; // current value pushed to all sphere cards (relocated from config block)

  // Per-card sphere-rotation state (THREE objects). The sphere drag rotation is applied
  // MANUALLY to each card in the sphere/fold blocks of tick() — sphereGroup.rotation is
  // kept at identity so cards in non-sphere phases (arc/grid) aren't transformed by stale
  // drag rotation. Lazy-initialized in setupModal() where THREE is loaded.
  let sphereRotEuler = null;
  let sphereRotQuat = null;
  let foldRotQuat = null;
  let tmpVec3 = null;

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
  let navNudgeVelX = 0;
  const NAV_NUDGE_FACTOR = 0.25; // 25% of full alignment angle — gentler
  const NAV_NUDGE_MAX_Y = 0.45; // ~26° cap so distant cards don't cause big swings
  const NAV_NUDGE_MAX_X = 0.18; // ~10° cap (X is already clamped to ±π/3 elsewhere)
  const NAV_NUDGE_STIFF = 0.05; // softer pull
  const NAV_NUDGE_DAMP = 0.86; // closer to critical damping → minimal overshoot

  // ── Desktop modal-nav warp transition ───────────────────────────────────
  // On desktop only (mobile uses live swipe gestures), clicking the prev/next
  // arrow triggers a cross-warp transition: the old card stays put and warps,
  // while the new card cross-dissolves in on top — also warped. Both cards'
  // uWarp uniforms follow a sin bell curve peaking mid-transition.
  let dnNavActive = false;
  let dnNavT0 = 0;
  let dnNavOldCard = null;
  let dnNavNewCard = null;
  const DN_NAV_DUR = 500; // ms
  const DN_NAV_WARP = 0.40; // peak warp (matches Pronounced option)

  // Click-vs-drag detection (canvas needs both — drag for sphere rotation, click for modal)
  let pointerDownX = 0; let pointerDownY = 0; let
    pointerDownT = 0;

  // Card detail modal state — the clicked card mesh itself flies to a target position
  // in world space and becomes the visible "image". HTML provides the info panel + chrome.
  let modalIdx = -1; // currently open card index, -1 if closed
  let modalCard = null; // reference to the card object whose mesh is animating
  let modalPhase = null; // 'opening' | 'open' | 'closing' | null
  let modalAnimT0 = 0; // animation start timestamp
  const MODAL_ANIM_DURATION = 350; // ms — shorter so card settles quickly
  // THREE.Vector3 / Quaternion instances — created lazily in setupModal() where THREE is loaded
  let modalStartPos = null;
  let modalStartQuat = null;
  let modalStartScale = null;
  let modalCloseStartPos = null;
  let modalCloseStartQuat = null;
  let modalCloseStartScale = null;
  let modalEl = null;
  let raycaster = null;
  let mouseNDC = null;
  let chromeProjV = null; // reusable Vector3 for chrome positioning projection

  // Chrome reveal — elements fade + slide in after card is 90% settled.
  let modalChromeRevealT0 = -1; // timestamp when card first hit 90%; -1 = not yet
  let modalChromeFadeT = 0; // 0→1 fade progress for chrome elements
  const CHROME_REVEAL_DUR = 300; // ms for chrome fade-in after trigger

  // Current arc context (computed once per frame)
  let arcCtx = null;

  // ── Arc math ─────────────────────────────────────────────────────────────────
  function arcRotationEase(t) {
    const k = 0.08; const
      a = 1 / (k * (2 - k));
    const v0 = a * k * k; const
      s = 2 * a * k;
    return t <= k ? a * t * t : v0 + s * (t - k);
  }

  function buildArcCtx(arcPanT) {
    const arcRot0 = arcRotationEase(arcPanT);
    const R = Math.max(W, H) * 1.5; // smaller radius = more visible arc curvature
    const alpha = Math.atan2(H, W);
    const fanCX = W * 0.5 - R * Math.sin(alpha);
    const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
    const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
    const rotOffset = ARC_SPAN * 0.5 - ARC_SPAN * 1.5 * arcRot0;
    const effectiveSpan = ARC_SPAN * (1 + 0.4 * arcRot0);
    arcCtx = {
      R,
      fanCX,
      fanCY,
      thetaM,
      rotOffset,
      effectiveSpan,
    };
  }

  // t = 0..1 normalized position across the arc span (0 = one end, 1 = other end)
  function getFanData(t) {
    const angle = arcCtx.thetaM + arcCtx.effectiveSpan / 2
              - t * arcCtx.effectiveSpan
              + arcCtx.rotOffset;
    const px = arcCtx.fanCX + arcCtx.R * Math.cos(angle);
    const py = arcCtx.fanCY + arcCtx.R * Math.sin(angle);
    // Radial direction (CSS screen space, Y-down)
    const rx = Math.cos(angle);
    const ry = Math.sin(angle);
    // CSS card rotation (in radians) — tangent to arc circle
    const cssRot = Math.atan2(rx, -ry);
    return { px, py, rx, ry, cssRot };
  }

  // Convert CSS screen coordinates to WebGL world coordinates
  // (origin at screen center; Y flipped)
  function cssToWorld(px, py) {
    return { x: px - W / 2, y: -(py - H / 2) };
  }

  // Rotate a point (in CSS screen space) around (fanCX, fanCY) by angle A (CW in CSS)
  // then convert to world space.
  function rotateArcPoint(px, py, A) {
    const dx = px - arcCtx.fanCX;
    const dy = py - arcCtx.fanCY;
    const cosA = Math.cos(A); const
      sinA = Math.sin(A);
    const rpx = arcCtx.fanCX + dx * cosA - dy * sinA;
    const rpy = arcCtx.fanCY + dx * sinA + dy * cosA;
    return cssToWorld(rpx, rpy);
  }

  // ── Rounded-rect alpha masks ───────────────────────────────────────────────
  // Draws a white rounded rect on black background. Three.js alphaMap uses the
  // green channel as the alpha multiplier: white=opaque, black=transparent.
  //
  // createRoundedMask() → high-res portrait mask (arc/grid phases, shared).
  // createRoundedMaskForAspect(aspect) → per-aspect mask for the sphere phase.
  //   Canvas W/H ratio matches the card's final world-space shape so corner arcs
  //   are physically circular, not elliptical. Cache avoids duplicate canvases.

  function createRoundedMask() {
    // High-resolution portrait mask for arc/grid phases.
    const cw = 1024; const
      ch = Math.round(1024 * (631 / 456)); // 1416
    const r = Math.round(cw * (22 / 456)); // 49px — proportional 22px corner
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(cw - r, 0);
    ctx.arcTo(cw, 0, cw, r, r);
    ctx.lineTo(cw, ch - r);
    ctx.arcTo(cw, ch, cw - r, ch, r);
    ctx.lineTo(r, ch);
    ctx.arcTo(0, ch, 0, ch - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }

  // Cache keyed by Math.round(aspect * 100) so e.g. 0.72 and 1.78 get distinct entries.
  const sphereMaskCache = {};

  function createRoundedMaskForAspect(aspect) {
    // Canvas whose W:H matches the card's world-space shape after non-uniform scale.
    // Corner radius r is 22/631 of canvas height — same physical proportion as arc mask.
    const canvasH = 512;
    const canvasW = Math.max(1, Math.round(canvasH * aspect));
    const r = Math.round(canvasH * (22 / 631));
    const c = document.createElement('canvas');
    c.width = canvasW; c.height = canvasH;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvasW - r, 0);
    ctx.arcTo(canvasW, 0, canvasW, r, r);
    ctx.lineTo(canvasW, canvasH - r);
    ctx.arcTo(canvasW, canvasH, canvasW - r, canvasH, r);
    ctx.lineTo(r, canvasH);
    ctx.arcTo(0, canvasH, 0, canvasH - r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tex.needsUpdate = true;
    return tex;
  }

  function getSphereMask(sphereScaleX) {
    // aspect = world-space width/height of the sphere card after scale(sphereScaleX, 1, 1)
    const aspect = sphereScaleX * CARD_ASPECT;
    const key = Math.round(aspect * 100);
    if (!sphereMaskCache[key]) {
      sphereMaskCache[key] = createRoundedMaskForAspect(aspect);
    }
    return sphereMaskCache[key];
  }

  function createModalShaderMaterial(texture, sphereScaleX) {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        uAspect: { value: sphereScaleX * CARD_ASPECT },
        uRadius: { value: 22.0 / 631.0 },
        uOpacity: { value: 1.0 },
        uMotionDir: { value: new THREE.Vector2(0, 0) },
        uWarp: { value: 0 },
        uWarpCenter: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: MODAL_VERT,
      fragmentShader: MODAL_FRAG,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
    });
  }

  function getModalMaterial(card) {
    if (!card.modalMat) {
      card.modalMat = createModalShaderMaterial(card.mesh.material.map, card.sphereScaleX);
    }
    return card.modalMat;
  }

  // Reset the modal SDF material's animated uniforms to clean defaults.
  // The SDF material is cached per-card (card.modalMat), so a card that was
  // mid-fade during an interrupted nav (uOpacity stuck at e.g. 0.4) would
  // inherit that stale value the next time it's shown in the modal — making
  // the image render dark and ghosted. Call this whenever the SDF material
  // is (re)assigned to a card or whenever a card leaves the modal flow.
  function resetModalMaterialUniforms(material, opacity) {
    const u = material && material.uniforms;
    if (!u) return;
    if (u.uOpacity) u.uOpacity.value = (typeof opacity === 'number' ? opacity : 1);
    if (u.uWarp) u.uWarp.value = 0;
    if (u.uMotionDir) u.uMotionDir.value.set(0, 0);
    // uWarpCenter is intentionally NOT reset here — callers set it (open: from
    // click origin, nav: 0.5/0.5) right after this.
  }

  // ── Camera Z for arc phase ──────────────────────────────────────────────────
  // Set camera Z so that at z=0 frustum height = H, making 1 world unit = 1 CSS pixel
  function arcCamZ() {
    return H / (2 * Math.tan(Math.PI / 6)); // fov=60, half-angle=30°
  }

  // ── Grid layout (9×5 = 45 cards, sized to fit viewport) ───────────────────
  function computeGridLayout() {
    if (cards.length === 0) return;
    // Desktop/tablet: cards fill viewport width via W/GRID_COLS; gaps push grid
    // off-screen by design (cards on the side overflow as a "more cards beyond" cue).
    // Mobile: fit the grid within the viewport exactly — solve cardW so that
    // GRID_COLS*cardW + (GRID_COLS-1)*cardW*GRID_GAP_RATIO == W. No overflow.
    const isMobile = (currentBPName === 'mobile');
    gridCardW = isMobile
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

  // ── Texture loading ────────────────────────────────────────────────────────
  // file:// security notes:
  //   • Three.js TextureLoader sets img.crossOrigin='anonymous' → CORS mode →
  //     Chrome rejects file:// origins → img.onerror fires → fallback colors.
  //   • new THREE.Texture(imgElement) → gl.texImage2D(img) → Chrome SecurityError
  //     for file:// img elements → crashes tick → blank screen.
  //   • SOLUTION: draw img onto a 2D canvas (no origin restriction) then wrap with
  //     THREE.CanvasTexture. Canvas texImage2D is allowed for same-origin content.
  //     If drawImage also fails, the onerror fallback paints a dark placeholder.
  function loadAllTextures(onDone) {
    let loaded = 0;
    textures = new Array(N_TOTAL);

    function makeCanvas(w, h, color) {
      const cv = document.createElement('canvas');
      cv.width = w || 4; cv.height = h || 6;
      const ctx2 = cv.getContext('2d');
      ctx2.fillStyle = color || '#555';
      ctx2.fillRect(0, 0, cv.width, cv.height);
      return cv;
    }

    function done(i, tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      // Cover-fit: crop the texture so its native aspect isn't stretched to the card plane.
      // Source images vary (square-ish to portrait); the plane is fixed at 456:631 ≈ 0.722.
      const imgW = (tex.image && tex.image.width) || 1;
      const imgH = (tex.image && tex.image.height) || 1;
      const imgAspect = imgW / imgH;
      const planeAspect = CARD_W_SPHERE / CARD_H_SPHERE; // 0.722
      if (imgAspect > planeAspect) {
        // Image wider than plane → crop left/right, keep center
        tex.repeat.x = planeAspect / imgAspect;
        tex.offset.x = (1 - tex.repeat.x) / 2;
      } else if (imgAspect < planeAspect) {
        // Image taller than plane → crop top/bottom, keep center
        tex.repeat.y = imgAspect / planeAspect;
        tex.offset.y = (1 - tex.repeat.y) / 2;
      }
      // Store aspect data so buildCards() can set per-card sphere scale + UV lerp start values.
      // sphereScaleX: how much to stretch card width so it shows native ratio on the sphere.
      // arcRepeat/Offset: the cover-crop UV values applied above (lerp start for fold morph).
      cardTexData[i] = {
        sphereScaleX: imgAspect / planeAspect,
        arcRepeatX: tex.repeat.x,
        arcRepeatY: tex.repeat.y,
        arcOffsetX: tex.offset.x,
        arcOffsetY: tex.offset.y,
      };
      textures[i] = tex;
      loaded += 1;
      if (loaded === N_TOTAL) onDone();
    }

    function tryLoad(i) {
      const img = new Image();
      img.onload = () => {
        const cw = img.naturalWidth || 512;
        const ch = img.naturalHeight || 512;
        const cv = makeCanvas(cw, ch, '#555');
        let usedCv = cv;
        try {
          cv.getContext('2d').drawImage(img, 0, 0);
          // Verify canvas is not tainted (throws SecurityError on file:// if cross-origin)
          cv.getContext('2d').getImageData(0, 0, 1, 1);
        } catch (e) {
          // Canvas is tainted — use a fresh untainted fallback so gl.texImage2D won't crash
          usedCv = makeCanvas(cw, ch, '#444');
        }
        done(i, new THREE.CanvasTexture(usedCv));
      };
      img.onerror = () => {
        done(i, new THREE.CanvasTexture(makeCanvas(4, 6, '#555')));
      };
      img.src = getCardMetadata(i).img; // no crossOrigin — needed so img.onload fires
    }

    for (let i = 0; i < N_TOTAL; i += 1) {
      tryLoad(i);
    }
  }

  // ── Build scene geometry ────────────────────────────────────────────────────
  function buildCards() {
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    cards = [];

    const roundedMask = createRoundedMask();

    for (let i = 0; i < N_TOTAL; i += 1) {
      // cardTexData is fully populated by the time buildCards() fires (called from onDone)
      const ctd = cardTexData[i] || {};
      const sScaleX = ctd.sphereScaleX !== undefined ? ctd.sphereScaleX : 1;

      const geo = new THREE.PlaneGeometry(CARD_W_SPHERE, CARD_H_SPHERE, 1, 1);
      let mat;
      if (CA_ENABLED) {
        mat = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: textures[i] },
            uAlphaMap: { value: roundedMask },
            uOpacity: { value: 0 },
            uCA: { value: 0 },
            uRepeat: {
              value: new THREE.Vector2(
                ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1,
                ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1,
              ),
            },
            uOffset: {
              value: new THREE.Vector2(
                ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0,
                ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0,
              ),
            },
            uMotionDir: { value: new THREE.Vector2(0, 0) },
            uWarp: { value: 0 },
            uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
          },
          vertexShader: CARD_VERT,
          fragmentShader: CARD_FRAG,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: true,
          depthWrite: false,
        });
        // Proxy material properties → uniforms so tick loop code works without modification.
        // `mat` is block-scoped (let), so each iteration's proxies capture their own material.
        // needsUpdate setter is suppressed — uniform texture swaps don't require shader relink.
        Object.defineProperty(mat, 'opacity', { get() { return mat.uniforms.uOpacity.value; }, set(v) { mat.uniforms.uOpacity.value = v; } });
        Object.defineProperty(mat, 'alphaMap', { get() { return mat.uniforms.uAlphaMap.value; }, set(v) { mat.uniforms.uAlphaMap.value = v; } });
        Object.defineProperty(mat, 'map', { get() { return mat.uniforms.uMap.value; }, set(v) { mat.uniforms.uMap.value = v; } });
        Object.defineProperty(mat, 'needsUpdate', { get() { return false; }, set() {} });
      } else {
        mat = new THREE.MeshBasicMaterial({
          map: textures[i],
          alphaMap: roundedMask,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          alphaTest: 0.0,
          depthTest: true,
          depthWrite: false,
        });
      }
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
        sphereScaleX: sScaleX,
        arcRepeatX: ctd.arcRepeatX !== undefined ? ctd.arcRepeatX : 1,
        arcRepeatY: ctd.arcRepeatY !== undefined ? ctd.arcRepeatY : 1,
        arcOffsetX: ctd.arcOffsetX !== undefined ? ctd.arcOffsetX : 0,
        arcOffsetY: ctd.arcOffsetY !== undefined ? ctd.arcOffsetY : 0,
        arcMask: roundedMask,
        sphereMask: getSphereMask(sScaleX),
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

  // ── Drag + click ───────────────────────────────────────────────────────────
  function onPointerDown(e) {
    if (modalIdx >= 0) return; // modal open — don't drag the globe
    isDragging = true;
    lastMX = e.clientX; lastMY = e.clientY;
    dragVelX = 0; dragVelY = 0;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownT = Date.now();
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    dragVelX = Math.max(-MAX_VEL, Math.min(MAX_VEL, (e.clientX - lastMX) * DRAG_SENSITIVITY));
    dragVelY = Math.max(-MAX_VEL, Math.min(MAX_VEL, -(e.clientY - lastMY) * DRAG_SENSITIVITY));
    lastMX = e.clientX; lastMY = e.clientY;
  }
  // sphereFormT is computed inside tick(); cache it so the click handler (which fires
  // between ticks) knows whether the sphere is in the clickable state.
  let sphereFormTAtLastTick = 0;

  function onPointerUp(e) {
    const wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) return;
    // Click vs drag thresholds — tuned for both mouse and touch.
    // 10px / 500ms is generous enough for fingertip taps (which can jitter 8–15px)
    // while still distinguishing from intentional drag gestures.
    const dx = Math.abs(e.clientX - pointerDownX);
    const dy = Math.abs(e.clientY - pointerDownY);
    const dt = Date.now() - pointerDownT;
    if (dx < 10 && dy < 10 && dt < 500
      && sphereFormTAtLastTick >= SPHERE_INTERACTIVE_T && modalIdx < 0) {
      // eslint-disable-next-line no-use-before-define
      handleCardClick(e);
    }
  }

  // ── Card click → modal ────────────────────────────────────────────────────
  function handleCardClick(e) {
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const meshes = cards.map((c) => c.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length > 0) {
      const hitMesh = hits[0].object;
      for (let i = 0; i < cards.length; i += 1) {
        if (cards[i].mesh === hitMesh) {
          // eslint-disable-next-line no-use-before-define
          openCardModal(i, e.clientX, e.clientY);
          break;
        }
      }
    }
  }

  // ── Hover cursor ──────────────────────────────────────────────────────────
  function onHover(e) {
    if (!renderer || !camera) return;
    const canvas = renderer.domElement;
    // Only show pointer + run hover state during sphere + zoom phases.
    // When out of sphere phase, clear ALL hoverTargets so the ease-out kicks in.
    if (sphereFormTAtLastTick < SPHERE_INTERACTIVE_T || modalIdx >= 0) {
      canvas.style.cursor = '';
      for (let ci = 0; ci < cards.length; ci += 1) cards[ci].hoverTarget = 0;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const meshes = cards.map((c) => c.mesh);
    const hits = raycaster.intersectObjects(meshes, false);
    canvas.style.cursor = hits.length > 0 ? 'pointer' : '';

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

  // The desktop/tablet layout overlays the info card on the image's lower portion,
  // with nav arrows in the margins outside the image and a close button at the
  // image's top-right — a deliberate divergence from the prototype's viewport-
  // anchored split view (see positionModalChrome + PROGRESS.md "Deliberate
  // divergences"). These constants size the modal image in computeModalTarget;
  // chrome offsets are computed in positionModalChrome. Mobile uses its own
  // stacked layout.
  //
  // Vertical padding is symmetric so the image's center stays at viewport H/2
  // whether the image is height- or width-constrained.
  const DT_IMG_PAD_T = 80; // image top padding (LANDSCAPE assets, uAspect > 1)
  const DT_IMG_PAD_B = 80; // image bottom padding (LANDSCAPE assets)
  const DT_PORTRAIT_VPAD = 24; // tighter top/bottom padding for portrait / 1×1 (uAspect ≤ 1)
  const DT_NAV_INSET = 24; // nav arrow inset baseline (feeds the image-width cap below)
  const DT_NAV_W = 44; // matches .card-modal__nav width
  // Horizontal cap on the modal image so it never extends under the chevron
  // columns: nav inset + chevron width + breathing room.
  const DT_GROUP_PAD_H = DT_NAV_INSET + DT_NAV_W + 20; // 88px

  // Compute target world position/quaternion/scale for the modal-active card.
  // Card is always 75% of viewport height; width follows the image's native aspect ratio
  // via sphereScaleX so portrait, square, and landscape assets all appear undistorted.
  // Width is clamped to 92vw so very wide landscape cards don't overflow on narrow screens.
  // Recomputed per-frame so it stays anchored even if the camera is still moving.
  function computeModalTarget(outPos, outQuat, outScale, cardOverride) {
    // cardOverride: if provided, compute target for THIS card (used by the
    // swipe-neighbors logic to position prev/next at offset slots). Defaults to
    // the active modalCard.
    const card = cardOverride || modalCard;
    const camZ = camera.position.z;
    const dist = 16.4;

    // How many CSS pixels = 1 world unit at 'dist' from the perspective camera (FOV 60°).
    const pxPerWorld = H / (2 * dist * Math.tan(Math.PI / 6));

    // Mobile: top-left lock at (8,8). Asset height is COMPUTED so a 24px gap
    //   sits between asset bottom and the nav-arrow row, and another 24px below
    //   the nav arrows before the info panel (whose natural height was measured
    //   in openCardModal). Width is proportional via sphereScaleX (aspect kept).
    // Desktop: centered horizontally, slight upward bias, width clamped to 92% W.
    const isMobile = (currentBPName === 'mobile');
    const sScaleX = (card && card.sphereScaleX) ? card.sphereScaleX : 1;
    let scaleY; let
      scaleX;

    if (isMobile) {
      // Mobile: VISIBLE asset always fills width = (viewport - 16px), 8px margins each side.
      // Height follows native aspect ratio (sphereScaleX × CARD_ASPECT).
      //
      // SDF math: the modal shader rounds the geometry by uRadius (= 22/631) in
      // normalized units where height = 1. In screen pixels the inset is uniform
      // = uRadius × cardHPx on ALL four sides. So:
      //   visible_width  = cardWPx − 2·uRadius·cardHPx
      //   visible_height = cardHPx − 2·uRadius·cardHPx = cardHPx · (1 − 2·uRadius)
      // Substituting cardHPx = cardWPx / uAspect and solving for cardWPx:
      //   visible_width = cardWPx · (1 − 2·uRadius / uAspect)
      //   cardWPx = visible_width / (1 − 2·uRadius / uAspect)
      const INSET = 8;
      const SDF_RADIUS = 22.0 / 631.0;
      const uAspect = CARD_ASPECT * sScaleX;

      const visibleWidthPx = W - 2 * INSET;
      const cardWPx = visibleWidthPx / (1 - (2 * SDF_RADIUS) / uAspect);
      const cardHPx = cardWPx / uAspect;

      scaleX = cardWPx / (CARD_W_SPHERE * pxPerWorld);
      scaleY = scaleX / sScaleX;

      // Position GEOMETRY corner offset by the SDF inset so the VISIBLE top-left
      // corner of the rendered rounded rectangle lands at exactly (INSET, INSET).
      // Asset height grows with portrait aspect — may overlap the info panel area
      // for very tall sources; this is the accepted trade-off for symmetric margins.
      const visibleInsetPx = SDF_RADIUS * cardHPx;
      const centerScreenX = (INSET - visibleInsetPx) + cardWPx / 2;
      const centerScreenY = (INSET - visibleInsetPx) + cardHPx / 2;
      const worldX = (centerScreenX - W / 2) / pxPerWorld;
      // screen Y is top→bottom; world Y is bottom→top
      const worldY = (H / 2 - centerScreenY) / pxPerWorld;
      outPos.set(worldX, worldY, camZ - dist);
    } else {
      // Desktop / tablet — image is centered in the viewport. The info panel
      // is anchored to bottom-right of viewport (positioned by chrome logic),
      // so the image no longer pairs horizontally with the info panel.
      //
      // Sizing rules:
      //   - Portrait / 1x1 (uAspect ≤ 1): fill viewport height minus 24px top
      //       + 24px bottom margins. Image grows as large as the aspect lets it.
      //       Cap horizontally to the chevron-bounded width so the image never
      //       extends under the chevron columns.
      //   - Landscape (uAspect > 1): keep the 80/80 vertical padding (height
      //       isn't the limiting factor for landscape anyway). Cap horizontally
      //       to the chevron-bounded width.
      //
      // Image is centered at viewport center (W/2, H/2) for all aspects so the
      // nav arrows (centered at mid-viewport) align with image middle.
      const uAspect = CARD_ASPECT * sScaleX;
      const availW = W - 2 * DT_GROUP_PAD_H;

      let imgH; let
        imgW;
      if (uAspect <= 1) {
        // Portrait / square: height-first.
        imgH = H - 2 * DT_PORTRAIT_VPAD;
        imgW = imgH * uAspect;
      } else {
        // Landscape: width-driven, but capped by 80/80 vertical padding.
        imgH = H - DT_IMG_PAD_T - DT_IMG_PAD_B;
        imgW = imgH * uAspect;
      }
      if (imgW > availW) {
        imgW = Math.max(1, availW);
        imgH = imgW / uAspect;
      }

      scaleY = imgH / (CARD_H_SPHERE * pxPerWorld);
      scaleX = scaleY * sScaleX;

      // Image centered at viewport center, both axes → world (0, 0, camZ-dist).
      outPos.set(0, 0, camZ - dist);
    }
    outQuat.identity();
    outScale.set(scaleX, scaleY, 1.0);
  }

  // Projects the modal card's screen-space bounds and positions the chrome elements
  // (close button, info panel, nav buttons) to align with the card's visible area.
  // Called every frame when modal is open so elements stay locked to the card.
  function positionModalChrome() {
    const chromeEl = q('.card-modal-chrome');
    if (!chromeEl || !camera) return;
    const infoEl = chromeEl.querySelector('.card-modal__info');
    const closeEl = chromeEl.querySelector('.card-modal__close');
    const prevEl = chromeEl.querySelector('.card-modal__nav--prev');
    const nextEl = chromeEl.querySelector('.card-modal__nav--next');

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale);

    const halfH = CARD_H_SPHERE * tgtScale.y * 0.5;
    const halfW = CARD_W_SPHERE * tgtScale.x * 0.5;

    if (!chromeProjV) chromeProjV = new THREE.Vector3();
    const pv = chromeProjV;

    // Project card edges to screen pixels
    pv.set(0, tgtPos.y + halfH, tgtPos.z).project(camera);
    const cardTopPx = (1 - pv.y) * 0.5 * H;

    pv.set(0, tgtPos.y - halfH, tgtPos.z).project(camera);
    const cardBotPx = (1 - pv.y) * 0.5 * H;

    pv.set(tgtPos.x - halfW, tgtPos.y, tgtPos.z).project(camera);
    const cardLeftPx = (pv.x + 1) * 0.5 * W;

    pv.set(tgtPos.x + halfW, tgtPos.y, tgtPos.z).project(camera);
    const cardRightPx = (pv.x + 1) * 0.5 * W;

    // Clamp to visible viewport (card may bleed off edges at large scale)
    const visTop = Math.max(0, cardTopPx);
    const visBot = Math.min(H, cardBotPx);
    const visLeft = Math.max(0, cardLeftPx);
    const visRight = Math.min(W, cardRightPx);

    // The SDF shader insets the visual card boundary by uRadius * card_height_px from the
    // geometry bounds. INSET accounts for that so chrome elements have 24px of *visible*
    // card (rendered photo) around them — not just geometry.
    const SDF_RADIUS_PX = (22.0 / 631.0) * (cardBotPx - cardTopPx);
    const INSET = 24 + Math.round(SDF_RADIUS_PX);

    const isMobile = (currentBPName === 'mobile');

    if (isMobile) {
      // ── Mobile layout ──
      //   Close button → top-right of viewport (16px inset)
      //   Nav arrows → bottom-left & bottom-right of viewport (16px inset)
      //   Info panel → bottom-anchored, bottom edge 16px above nav arrow tops
      //   Asset (computed in computeModalTarget) → top-left with 24px gap to info top
      const EDGE = 16; const NAV_H = 44; const
        INFO_TO_NAV_GAP = 16;

      if (closeEl) {
        closeEl.style.position = 'absolute';
        closeEl.style.top = `${EDGE}px`;
        closeEl.style.right = `${EDGE}px`;
        closeEl.style.bottom = 'auto';
        closeEl.style.left = 'auto';
      }

      // Nav arrows: bottom corners
      if (prevEl) {
        prevEl.style.position = 'absolute';
        prevEl.style.bottom = `${EDGE}px`;
        prevEl.style.left = `${EDGE}px`;
        prevEl.style.top = 'auto';
        prevEl.style.right = 'auto';
      }
      if (nextEl) {
        nextEl.style.position = 'absolute';
        nextEl.style.bottom = `${EDGE}px`;
        nextEl.style.right = `${EDGE}px`;
        nextEl.style.top = 'auto';
        nextEl.style.left = 'auto';
      }

      // Info panel: bottom-anchored. Bottom edge = (nav bottom edge + nav height + gap).
      // Math: nav bottom = 16, nav top = 16 + 44 = 60 from viewport bottom.
      //       info bottom = 60 + 16 = 76 from viewport bottom (16px above nav tops).
      // Panel left/right edges sit at 8px (matching the asset's 8px viewport margins),
      // so panel width = asset visible width = (viewport - 16).
      if (infoEl) {
        const infoBottomPx = EDGE + NAV_H + INFO_TO_NAV_GAP;
        infoEl.style.position = 'absolute';
        infoEl.style.bottom = `${infoBottomPx}px`;
        infoEl.style.top = 'auto';
        infoEl.style.left = '8px';
        infoEl.style.right = '8px';
        infoEl.style.width = 'auto';
        infoEl.style.minHeight = ''; // clear desktop value if responsive resize happened
      }
    } else {
      // ── Desktop / tablet: info OVERLAID on the image's lower area ──
      // DELIBERATE DIVERGENCE FROM THE PROTOTYPE (hub-creative/offer-globe.js
      // anchored a fixed-width info panel to the viewport's bottom-right). The
      // authored card images are portrait, so a viewport-anchored panel landed
      // in the empty space beside the centered image. Per design, the role /
      // name / description / badges now overlay the lower portion of the image
      // itself, with a CSS gradient scrim on .card-modal__info for legibility.
      // All chrome is anchored to the image's projected bounds, not the
      // viewport. See README.md / PROGRESS.md (modal layout note).
      //
      // visTop/visBot/visLeft/visRight (clamped image bounds) and INSET (24px +
      // SDF rounded-corner radius) were computed above. Inset keeps overlaid
      // chrome on the photo, not over the transparent rounded corner.
      const imgLeft = visLeft + INSET;
      const imgRight = visRight - INSET;
      const imgTop = visTop + INSET;
      const imgBot = visBot - INSET;
      const imgInnerW = Math.max(1, imgRight - imgLeft);
      const imageMidY = (visTop + visBot) / 2;

      // Info panel: overlaid on the image, left-aligned, spanning the image's
      // inner width, bottom edge at the image's lower inset. Auto height.
      if (infoEl) {
        infoEl.style.position = 'absolute';
        infoEl.style.top = 'auto';
        infoEl.style.bottom = `${H - imgBot}px`;
        infoEl.style.left = `${imgLeft}px`;
        infoEl.style.right = 'auto';
        infoEl.style.width = `${imgInnerW}px`;
        infoEl.style.minHeight = '';
      }

      // Close button: top-right corner of the image.
      if (closeEl) {
        closeEl.style.position = 'absolute';
        closeEl.style.top = `${imgTop}px`;
        closeEl.style.right = `${W - imgRight}px`;
        closeEl.style.bottom = 'auto';
        closeEl.style.left = 'auto';
      }

      // Nav arrows: in the margin OUTSIDE the image's left/right edges (in the
      // dark backdrop area, not over the photo), vertically centered on the
      // image. Clamped to a 16px viewport inset so they never run off-screen
      // when the image is wide.
      const NAV_GAP = 24;
      const navTop = imageMidY - DT_NAV_W / 2;
      if (prevEl) {
        prevEl.style.position = 'absolute';
        prevEl.style.top = `${navTop}px`;
        prevEl.style.left = `${Math.max(16, visLeft - NAV_GAP - DT_NAV_W)}px`;
        prevEl.style.right = 'auto';
        prevEl.style.bottom = 'auto';
      }
      if (nextEl) {
        nextEl.style.position = 'absolute';
        nextEl.style.top = `${navTop}px`;
        nextEl.style.left = `${Math.min(visRight + NAV_GAP, W - 16 - DT_NAV_W)}px`;
        nextEl.style.right = 'auto';
        nextEl.style.bottom = 'auto';
      }

      // Counter: just below the image, left-aligned with it (clamped on screen).
      const counterEl = chromeEl.querySelector('.card-modal__counter');
      if (counterEl) {
        counterEl.style.position = 'absolute';
        counterEl.style.top = `${Math.min(visBot + 8, H - 28)}px`;
        counterEl.style.left = `${imgLeft}px`;
        counterEl.style.right = 'auto';
        counterEl.style.bottom = 'auto';
        counterEl.style.transform = '';
      }
    }

    // Chrome fade + slide-up: driven by modalChromeFadeT (0→1 after card is 90% settled).
    // transition:none during the reveal so JS animation isn't fought by CSS hover transitions.
    const cFade = easeOutCubic(modalChromeFadeT);
    const cShift = Math.round((1 - cFade) * 8);
    const cTrans = modalChromeFadeT >= 1 ? '' : 'none';
    [infoEl, closeEl, prevEl, nextEl].forEach((el) => {
      if (!el) return;
      el.style.opacity = String(cFade);
      el.style.transform = modalChromeFadeT >= 1 ? '' : (`translateY(${cShift}px)`);
      el.style.transition = cTrans;
    });
  }

  // Tracks when the modal was last opened. Used by closeCardModal to suppress the
  // synthetic 'click' event that browsers dispatch on touch interactions after
  // pointerup — that click lands on the newly-visible backdrop and would
  // immediately close the just-opened modal.
  let modalOpenedAt = 0;
  // setTimeout ID for the close-finalize cleanup (removes is-visible / modal-open
  // / restarts Lenis after MODAL_ANIM_DURATION). Tracked so that opening a NEW
  // modal before the timeout fires can cancel it — otherwise a stale timeout
  // would yank the just-opened modal's classes after ~350ms, and the new modal
  // would mysteriously go invisible. See closeCardModal + openCardModal.
  let closeTimeoutId = null;

  // ── A11y: keyboard navigation ───────────────────────────────────────────
  // Parallel hidden DOM list of buttons that mirror each card on the globe.
  // Tab/Shift+Tab moves through them; focusing a button drives the same hover
  // state on the corresponding WebGL card; Enter/Space opens the modal.
  // Buttons get tabindex=0 only while the sphere is interactive (≥ INTERACTIVE_T
  // and no modal open). Cached and gated via a11yInteractive so we only iterate
  // when the state actually flips.
  let galleryBtns = null; // NodeList of buttons (set in setupGlobeGalleryA11y)
  let a11yInteractive = false; // current tabbable state of the gallery buttons
  // Focus ring (a DOM element positioned each frame to match the focused card's
  // projected screen bounds). Updated in tick when focusedCardIdx >= 0.
  let focusRingEl = null;
  let focusedCardIdx = -1;
  // Pool of corner Vector3s for projection (avoid per-frame allocation).
  let ringCorners = null;
  let ringTmpVec = null;
  // Element to restore focus to when modal closes (typically the gallery button
  // that opened the modal, or whatever had focus before mouse-click open).
  let modalFocusRestoreEl = null;

  // ── Modal warp state (drives fisheye uWarp/uWarpCenter on modal SDF material) ──
  // Updated each tick by either animation phase (opening/closing) or active gesture.
  let modalWarp = 0;
  const modalWarpCenter = new THREE.Vector2(0.5, 0.5);
  const MODAL_WARP_OPEN = 0.30; // peak during opening animation (bell curve over aT)
  const MODAL_WARP_CLOSE = 0.30; // peak during closing animation
  const MODAL_WARP_PULL = 0.40; // peak at full pull-down
  const MODAL_WARP_SWIPE = 0.25; // peak at full horizontal swipe

  // ── Desktop / tablet modal layout constants ────────────────────────────────
  function pushModalWarpUniforms() {
    if (!modalCard) return;
    const u = modalCard.mesh.material && modalCard.mesh.material.uniforms;
    if (!u || !u.uWarp || !u.uWarpCenter) return;
    u.uWarp.value = modalWarp;
    u.uWarpCenter.value.copy(modalWarpCenter);
  }

  // Map a viewport touch/click position to an approximate UV on the asset.
  // Asset visibly fills nearly the whole viewport on mobile (8px margins),
  // so viewport-fraction ≈ asset UV. Screen Y inverts (top→bottom = UV 1→0).
  function touchToWarpUV(clientX, clientY, out) {
    const v = out || new THREE.Vector2();
    v.x = Math.max(0, Math.min(1, clientX / W));
    v.y = Math.max(0, Math.min(1, 1 - clientY / H));
    return v;
  }

  // Set a card's local transform to its canonical sphere slot with the current
  // sphere-drag rotation baked in. Used by reparent sites so there's no one-frame
  // flash of an unrotated card before tick()'s sphere block re-applies rotation.
  function snapCardToSphereSlot(card) {
    if (!card || !card.mesh) return;
    const hasRot = (sphereRotY !== 0 || sphereRotX !== 0);
    if (hasRot && sphereRotEuler) {
      sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'YXZ');
      sphereRotQuat.setFromEuler(sphereRotEuler);
      card.mesh.position.copy(card.spherePos).applyEuler(sphereRotEuler);
      card.mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    card.mesh.scale.set(card.sphereScaleX, 1, 1);
  }

  // ── Swipe-neighbors helpers ───────────────────────────────────────────────
  // Pre-attach prev/next cards to modalScene at world offsets of ±viewport_width
  // so a horizontal swipe reveals them naturally (single CSS transform on the
  // canvas moves all three together — iOS Photos style).

  function attachCardToModal(card) {
    if (!card || !modalScene) return;
    if (card.mesh.parent === modalScene) return;
    modalScene.attach(card.mesh);
    card.mesh.origMaterial = card.mesh.material;
    card.mesh.material = getModalMaterial(card);
    card.mesh.renderOrder = 0;
    card.mesh.material.depthTest = true;
    // Reset cached SDF uniforms (uOpacity, uWarp, uMotionDir) so stale values
    // from a previous interrupted modal session don't carry over.
    resetModalMaterialUniforms(card.mesh.material, 1);
  }

  function detachCardToSphere(card) {
    if (!card || !sphereGroup) return;
    if (card.mesh.parent === sphereGroup) return;
    if (card.mesh.origMaterial) {
      card.mesh.material = card.mesh.origMaterial;
      card.mesh.origMaterial = null;
    }
    sphereGroup.attach(card.mesh);
    snapCardToSphereSlot(card);
    card.mesh.material.depthTest = true;
    card.mesh.renderOrder = 0;
  }

  // Write the authored metadata for card index i into the modal chrome DOM.
  function populateModal(i) {
    const targetEl = q('.card-modal-chrome') || modalEl;
    if (!targetEl) return;
    const meta = getCardMetadata(i);
    const imgEl = targetEl.querySelector('.card-modal__image');
    if (imgEl) { imgEl.src = meta.img; imgEl.alt = `${meta.name} — photograph`; }
    const roleLabelEl = targetEl.querySelector('.card-modal__role-label');
    if (roleLabelEl) roleLabelEl.textContent = meta.role || 'Photographer';
    targetEl.querySelector('.card-modal__name').textContent = meta.name;
    targetEl.querySelector('.card-modal__description').textContent = meta.description;
    const counterEl = targetEl.querySelector('.card-modal__counter');
    if (counterEl) counterEl.textContent = `${i + 1}/${N_TOTAL}`;
    const badgesEl = targetEl.querySelector('.card-modal__badges');
    badgesEl.innerHTML = '';
    meta.badges.forEach((b) => {
      const row = document.createElement('li');
      row.className = 'card-modal__badge';
      row.innerHTML = '<div class="card-modal__badge-left">'
          + `<div class="card-modal__badge-icon card-modal__badge-icon--${b.app.id}" aria-hidden="true">${b.app.abbr}</div>`
          + `<span class="card-modal__badge-app">${b.app.name}</span>`
        + '</div>'
        + `<span class="card-modal__badge-role">${b.role}</span>`;
      badgesEl.appendChild(row);
    });
  }

  // Modal-nav reactivity: compute the spring target that will rotate the sphere
  // partway toward facing the new card's slot, then activate the spring. Called
  // from navigateModal (arrow click) and commitSwipeNavigation (mobile swipe).
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

  // Begin the desktop modal-nav cross-warp transition. Old card stays at the
  // modal position with uOpacity easing to 0 and uWarp on a sin bell curve;
  // new card is placed at its own modal target (same screen position, possibly
  // different scale) with uOpacity easing to 1 and the same warp curve. Both
  // render at the same position; renderOrder controls draw order during blend.
  function startDesktopNavTransition(newIdx) {
    const oldCard = modalCard;
    const newCard = cards[newIdx];
    if (!oldCard || !newCard || !modalScene) return;

    // If a previous transition is mid-flight, finalize it first so we don't
    // leak the old-old card or its material into the wrong state.
    // eslint-disable-next-line no-use-before-define
    if (dnNavActive) completeDesktopNavTransition();

    // Attach new card to modalScene, swap to SDF material, position at modal target.
    modalScene.attach(newCard.mesh);
    newCard.mesh.origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    // Start invisible (uOpacity=0) — animation fades it up to 1 over DN_NAV_DUR.
    // Helper also clears any stale uWarp / uMotionDir from a previous session.
    resetModalMaterialUniforms(newCard.mesh.material, 0);
    newCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    newCard.mesh.material.depthTest = true;
    newCard.mesh.renderOrder = 1; // above oldCard during blend

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale, newCard);
    newCard.mesh.position.copy(tgtPos);
    newCard.mesh.quaternion.copy(tgtQuat);
    newCard.mesh.scale.copy(tgtScale);

    // Lock old card warp center to (0.5, 0.5) so the bell curve emanates from center.
    if (oldCard.mesh.material && oldCard.mesh.material.uniforms
      && oldCard.mesh.material.uniforms.uWarpCenter) {
      oldCard.mesh.material.uniforms.uWarpCenter.value.set(0.5, 0.5);
    }
    oldCard.mesh.renderOrder = 0;

    // Promote the new card to the "active" modalCard. The main modal animation
    // block's 'open' phase will keep it locked at tgtPos. Modal HTML content
    // updates to the new card's data.
    modalIdx = newIdx;
    modalCard = newCard;
    modalPhase = 'open';
    populateModal(newIdx);
    triggerModalNavNudge(newIdx);

    dnNavOldCard = oldCard;
    dnNavNewCard = newCard;
    dnNavT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    dnNavActive = true;
  }

  // Finalize the desktop nav transition: detach old card back to the sphere,
  // restore its material, reset uniforms on the new card to clean defaults.
  // Safe to call whether or not the animation reached aT >= 1.
  function completeDesktopNavTransition() {
    if (!dnNavActive) return;
    if (dnNavOldCard) {
      // Reset the cached SDF material's animated uniforms BEFORE swapping back
      // to the basic material. The SDF material persists in card.modalMat —
      // if uOpacity was mid-fade (interrupted nav), it would stay stuck at
      // that value, and the next modal session would show this card ghosted.
      resetModalMaterialUniforms(dnNavOldCard.modalMat, 1);
      if (dnNavOldCard.mesh.origMaterial) {
        dnNavOldCard.mesh.material = dnNavOldCard.mesh.origMaterial;
        dnNavOldCard.mesh.origMaterial = null;
      }
      sphereGroup.attach(dnNavOldCard.mesh);
      snapCardToSphereSlot(dnNavOldCard);
      dnNavOldCard.mesh.material.depthTest = true;
      dnNavOldCard.mesh.renderOrder = 0;
    }
    if (dnNavNewCard) {
      // The new card stays as the active modal card with SDF material; just
      // restore uniforms to a clean "fully visible, no warp" state.
      resetModalMaterialUniforms(dnNavNewCard.mesh.material, 1);
      dnNavNewCard.mesh.renderOrder = 0;
    }
    dnNavOldCard = null;
    dnNavNewCard = null;
    dnNavActive = false;
  }

  // Position a card in modalScene at slot -1 (left), 0 (center), or +1 (right).
  // Slot 0 = the card's natural top-left-locked target. ±1 = offset by viewport_width.
  function positionCardInModal(card, slot) {
    if (!card) return;
    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale, card);
    const pxPerWorld = H / (2 * 16.4 * Math.tan(Math.PI / 6));
    const viewportWidthWorld = W / pxPerWorld;
    card.mesh.position.set(tgtPos.x + slot * viewportWidthWorld, tgtPos.y, tgtPos.z);
    card.mesh.quaternion.copy(tgtQuat);
    card.mesh.scale.copy(tgtScale);
  }

  // Attach prev/next of the current modalCard to modalScene at offset positions.
  function prepSwipeNeighbors() {
    if (!modalCard || cards.length < 3) return; // skip if too few cards to have distinct neighbors
    const n = cards.length;
    const prevIdx = (modalIdx - 1 + n) % n;
    const nextIdx = (modalIdx + 1) % n;
    attachCardToModal(cards[prevIdx]);
    positionCardInModal(cards[prevIdx], -1);
    attachCardToModal(cards[nextIdx]);
    positionCardInModal(cards[nextIdx], 1);
  }

  // Return all non-current cards in modalScene back to sphereGroup.
  function clearSwipeNeighbors() {
    if (!modalScene || !sphereGroup) return;
    // Iterate a copy of children because detach mutates the list.
    const children = modalScene.children.slice();
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      // Keep the current card; return every other matching card to the sphere.
      if (!modalCard || child !== modalCard.mesh) {
        for (let j = 0; j < cards.length; j += 1) {
          if (cards[j].mesh === child) { detachCardToSphere(cards[j]); break; }
        }
      }
    }
  }

  // Swipe-commit world-space swap. direction: +1 = next (swipe left), -1 = prev (swipe right).
  // Called after the CSS transition has settled the canvas at ±viewport_width.
  // Reorganizes modalScene cards so the visual position is identical before/after
  // the canvas reset → no snap.
  function commitSwipeNavigation(direction) {
    if (!modalCard || !modalScene || cards.length < 3) return;
    if (modalPhase === 'closing') return; // Don't navigate while closing — same reason as navigateModal.
    const n = cards.length;
    const oldIdx = modalIdx;
    const newIdx = (oldIdx + direction + n) % n;
    const oldOppoIdx = (oldIdx - direction + n) % n; // old card on opposite side
    const newFarIdx = (oldIdx + 2 * direction + n) % n; // brand-new neighbor on swipe side

    // 1) Return the opposite-side old neighbor to the sphere.
    detachCardToSphere(cards[oldOppoIdx]);
    // 2) Old current → becomes new opposite-side neighbor.
    positionCardInModal(cards[oldIdx], -direction);
    // 3) The chosen neighbor is now the new current.
    modalCard = cards[newIdx];
    modalIdx = newIdx;
    positionCardInModal(modalCard, 0);
    // 4) Attach the new far neighbor (two steps in the swipe direction).
    attachCardToModal(cards[newFarIdx]);
    positionCardInModal(cards[newFarIdx], direction);

    populateModal(newIdx);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    triggerModalNavNudge(newIdx);
  }

  function openCardModal(i, originX, originY) {
    if (!modalEl || !cards[i]) return;
    // Cancel any pending close-finalize timeout from a previous close that
    // hasn't fired yet. Without this, the stale timeout fires mid-open and
    // strips is-visible / modal-open / restarts Lenis on our fresh modal —
    // the user clicks an image and the modal "won't show up."
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }
    modalOpenedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    // Remember focus origin so we can restore it on close. Skip the modal
    // chrome itself in case openCardModal is called from inside it (shouldn't
    // happen, but defensive).
    const focusedNow = document.activeElement;
    const chromeRoot = q('.card-modal-chrome');
    modalFocusRestoreEl = (chromeRoot && chromeRoot.contains(focusedNow)) ? null : focusedNow;
    modalIdx = i;
    modalCard = cards[i];
    // Pin warp center to click origin so the open-animation bulge emanates
    // from where the user tapped (or defaults to ~center if no origin given).
    if (typeof originX === 'number' && typeof originY === 'number') {
      touchToWarpUV(originX, originY, modalWarpCenter);
    } else {
      modalWarpCenter.set(0.5, 0.5);
    }
    modalWarp = 0; // bell curve in tick ramps it up from 0
    populateModal(i);

    // Snapshot the card's current WORLD transform (driven by sphereGroup rotation right now)
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalStartPos);
    modalCard.mesh.getWorldQuaternion(modalStartQuat);
    modalCard.mesh.getWorldScale(modalStartScale);

    // Reparent into the *modal* scene (separate canvas, above the blur backdrop) so the card
    // stays sharp while the sphere is blurred. world transform preserved via attach().
    if (modalScene) modalScene.attach(modalCard.mesh);
    else scene.attach(modalCard.mesh);

    // Swap to SDF shader material for crisp corners at modal scale (alphaMap pixelates).
    modalCard.mesh.origMaterial = modalCard.mesh.material;
    modalCard.mesh.material = getModalMaterial(modalCard);
    // Reset cached SDF uniforms — protects against stale values left by a
    // previous interrupted nav (e.g., uOpacity stuck mid-fade → ghosted image).
    resetModalMaterialUniforms(modalCard.mesh.material, 1);

    // Reset depth test/order — modal scene has only this one mesh
    modalCard.mesh.renderOrder = 0;
    modalCard.mesh.material.depthTest = true;
    if (modalCanvasEl) modalCanvasEl.style.display = 'block';

    modalPhase = 'opening';
    modalAnimT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Reset chrome reveal so elements start hidden and fade in after card settles.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;

    modalEl.classList.add('is-visible');
    modalEl.setAttribute('aria-hidden', 'false');
    const chromeEl = q('.card-modal-chrome');
    if (chromeEl) { chromeEl.classList.add('is-visible'); chromeEl.setAttribute('aria-hidden', 'false'); }
    positionModalChrome();
    requestAnimationFrame(() => {
      modalEl.classList.add('is-open');
      if (chromeEl) chromeEl.classList.add('is-open');
      // Move keyboard focus into the modal — close button is the safest default
      // (always present, no destructive default action). Falls back to chromeEl
      // for screen-reader announcement if close button is somehow missing.
      const closeBtn = chromeEl && chromeEl.querySelector('.card-modal__close');
      if (closeBtn) { try { closeBtn.focus(); } catch (e) { /* not focusable; ignore */ } }
    });

    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.add('is-modal-active');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    if (window.lenis) window.lenis.stop();

    // Pre-attach prev/next cards to modalScene at offset positions so horizontal
    // swipes reveal the neighbor mid-gesture (iOS Photos style). Mobile only.
    if (currentBPName === 'mobile') prepSwipeNeighbors();
  }

  function closeCardModal() {
    // Suppress the synthetic 'click' event that fires after touch pointerup —
    // it lands on the just-revealed backdrop and would immediately close the
    // modal we're in the middle of opening. 200ms is well past the synthetic
    // click delay (~50ms) but short enough to not delay legitimate closes.
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (now - modalOpenedAt < 200) return;
    if (!modalEl || modalIdx < 0 || !modalCard) return;
    // Re-entrancy guard: if a close is already in flight (modalPhase ===
    // 'closing'), additional Escape/backdrop clicks are no-ops. Without this,
    // a second close would re-snapshot modalCloseStartPos mid-animation and
    // jitter the card's return path, plus re-schedule the finalize timeout.
    if (modalPhase === 'closing') return;

    // If a desktop nav transition is still in flight, finalize it first so the
    // outgoing old card returns to its sphere slot cleanly before the close
    // animation starts on the (new) modalCard.
    if (dnNavActive) completeDesktopNavTransition();

    // Detach swipe-neighbor cards before the close animation begins so only the
    // current card flies back to the sphere; neighbors return to their slots silently.
    clearSwipeNeighbors();

    // Blur any focused element inside the modal chrome BEFORE aria-hidden=true gets
    // applied. Without this, the close button (which user just clicked) retains
    // focus → browser blocks aria-hidden + warns in console + can interfere with
    // subsequent pointer event delivery on touch in DevTools device emulation.
    const chromeEl = q('.card-modal-chrome');
    if (chromeEl && document.activeElement && chromeEl.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    // Snapshot current world transform (the modal target) as the START for the closing animation.
    modalCard.mesh.updateWorldMatrix(true, false);
    modalCard.mesh.getWorldPosition(modalCloseStartPos);
    modalCard.mesh.getWorldQuaternion(modalCloseStartQuat);
    modalCard.mesh.getWorldScale(modalCloseStartScale);

    modalPhase = 'closing';
    modalAnimT0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    // Immediately hide chrome elements — they'll hide with the container fade.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 0;

    modalEl.classList.remove('is-open');
    if (chromeEl) chromeEl.classList.remove('is-open');

    // Defer the page-scroll UNLOCK and aria/visibility cleanup until the close
    // animation completes (MODAL_ANIM_DURATION). Earlier this happened
    // synchronously here, which let the user scroll during the 350ms close
    // animation — sphereFormT would change underneath the in-flight modal card,
    // making its return-to-sphere trajectory chase a moving target.
    //
    // The timeout ID is tracked so openCardModal can cancel it if the user
    // opens a new modal in this 350ms window (otherwise a stale firing would
    // remove the new modal's is-visible / modal-open / Lenis-pause state).
    closeTimeoutId = setTimeout(() => {
      modalEl.classList.remove('is-visible');
      modalEl.setAttribute('aria-hidden', 'true');
      if (chromeEl) { chromeEl.classList.remove('is-visible'); chromeEl.setAttribute('aria-hidden', 'true'); }
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
      // Restore focus to whatever the user had focused before opening the modal
      // (typically the gallery button that opened it for keyboard users).
      if (modalFocusRestoreEl && document.body.contains(modalFocusRestoreEl)) {
        try { modalFocusRestoreEl.focus(); } catch (e) { /* element gone; ignore */ }
      }
      modalFocusRestoreEl = null;
      closeTimeoutId = null;
    }, MODAL_ANIM_DURATION);

    const canvas = renderer && renderer.domElement;
    if (canvas) canvas.classList.remove('is-modal-active');
  }

  function navigateModal(direction) {
    if (modalIdx < 0 || !modalCard) return;
    // Don't navigate while the modal is closing. Otherwise startDesktopNavTransition
    // would flip modalPhase from 'closing' back to 'open', orphaning the close
    // animation: the in-flight modalCard never reaches aT >= 1, so it's never
    // reparented to sphereGroup, modalCanvasEl stays display:block, and the stale
    // close-finalize timeout still fires — leaving a card floating in modalScene
    // with no surrounding chrome (the "duplicate globe" appearance).
    if (modalPhase === 'closing') return;
    const next = (modalIdx + direction + N_TOTAL) % N_TOTAL;

    // Desktop/tablet: cross-warp transition (old warps in place, new cross-fades
    // over top with matching warp). Mobile keeps its instant-swap flow because
    // its arrow buttons are paired with the live swipe gesture which already
    // provides the warp + slide feel.
    if (currentBPName !== 'mobile') {
      startDesktopNavTransition(next);
      return;
    }

    // Detach swipe-neighbor cards before swap; they'll be re-prepped at the end
    // for the new modalCard. Mobile only.
    clearSwipeNeighbors();

    // Return the current card mesh to its slot in the sphere group (instant snap).
    const oldCard = modalCard;
    if (oldCard.mesh.origMaterial) {
      oldCard.mesh.material = oldCard.mesh.origMaterial;
      oldCard.mesh.origMaterial = null;
    }
    sphereGroup.attach(oldCard.mesh);
    snapCardToSphereSlot(oldCard);
    oldCard.mesh.material.depthTest = true;
    oldCard.mesh.renderOrder = 0;

    // Move the new card into the modal scene and snap it to the target position.
    const newCard = cards[next];
    if (modalScene) modalScene.attach(newCard.mesh);
    else scene.attach(newCard.mesh);
    // Swap to SDF shader material for crisp corners at modal scale.
    newCard.mesh.origMaterial = newCard.mesh.material;
    newCard.mesh.material = getModalMaterial(newCard);
    newCard.mesh.renderOrder = 0;
    newCard.mesh.material.depthTest = true;

    const tgtPos = new THREE.Vector3();
    const tgtQuat = new THREE.Quaternion();
    const tgtScale = new THREE.Vector3();
    computeModalTarget(tgtPos, tgtQuat, tgtScale);
    newCard.mesh.position.copy(tgtPos);
    newCard.mesh.quaternion.copy(tgtQuat);
    newCard.mesh.scale.copy(tgtScale);

    modalIdx = next;
    modalCard = newCard;
    modalPhase = 'open';
    // Chrome stays fully visible during navigation — no animation, instant swap.
    modalChromeRevealT0 = -1;
    modalChromeFadeT = 1;
    populateModal(next);

    // Sphere reactivity: spring the rotation partway toward facing the new slot.
    triggerModalNavNudge(next);

    // Prep prev/next of the new current for the next swipe gesture.
    if (currentBPName === 'mobile') prepSwipeNeighbors();
  }

  // Build the hidden focusable button list that mirrors the cards on the globe.
  // Called after buildCards() once card metadata is available. Each button:
  //   - Focusing it sets card.hoverTarget=1 on the corresponding mesh (the WebGL
  //     hover effect — scale + warp — gives sighted keyboard users a visual cue).
  //   - Click/Enter/Space opens the modal at that card.
  //   - aria-label includes photographer name + position so screen readers can
  //     announce "View photo by William Eggleston, 1 of 45".
  // tabindex stays -1 until the sphere is interactive — see the toggle in tick().
  function setupGlobeGalleryA11y() {
    const canvas = q('.offer-globe-canvas');
    if (!canvas || !canvas.parentNode) return;

    // Remove existing on re-init so we don't double up.
    const existing = q('.globe-gallery-a11y');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    const container = document.createElement('div');
    container.id = 'globe-gallery-a11y';
    container.className = 'globe-gallery-a11y';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Image gallery');

    const list = document.createElement('ul');
    list.className = 'globe-gallery-a11y__list';

    // Wire one gallery button's focus/blur/click handlers. Defined outside the
    // build loop so the listeners aren't re-created per iteration (no-loop-func)
    // while still closing over the live runtime state (focusedCardIdx, etc.).
    function attachGalleryButton(idx, btnEl) {
      btnEl.addEventListener('focus', () => {
        // Drive the WebGL hover state on the focused card; clear the rest so
        // there's only ever one hover at a time (matches mouse behavior).
        for (let ci = 0; ci < cards.length; ci += 1) {
          cards[ci].hoverTarget = (ci === idx ? 1 : 0);
        }
        // Only show the projected focus ring for keyboard focus (matches
        // :focus-visible behavior in CSS — mouse clicks shouldn't display it).
        focusedCardIdx = idx;
        if (focusRingEl && btnEl.matches(':focus-visible')) {
          focusRingEl.classList.add('is-visible');
        }
      });
      btnEl.addEventListener('blur', () => {
        if (cards[idx]) cards[idx].hoverTarget = 0;
        if (focusedCardIdx === idx) focusedCardIdx = -1;
        if (focusRingEl) focusRingEl.classList.remove('is-visible');
      });
      btnEl.addEventListener('click', () => {
        if (modalIdx >= 0) return;
        if (sphereFormTAtLastTick < SPHERE_INTERACTIVE_T) return;
        // Use viewport center as the click origin so the open-warp emanates
        // from screen center (we don't have a click position from keyboard).
        openCardModal(idx, W / 2, H / 2);
      });
    }

    for (let i = 0; i < N_TOTAL; i += 1) {
      const meta = getCardMetadata(i);
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-gallery-a11y__btn';
      btn.setAttribute('aria-label', `View photo by ${meta.name}, ${i + 1} of ${N_TOTAL}`);
      btn.dataset.cardIdx = String(i);
      btn.tabIndex = -1; // off until the sphere is interactive
      btn.textContent = `${meta.name}, ${i + 1} of ${N_TOTAL}`;

      attachGalleryButton(i, btn);

      li.appendChild(btn);
      list.appendChild(li);
    }

    container.appendChild(list);
    canvas.parentNode.appendChild(container);
    galleryBtns = container.querySelectorAll('.globe-gallery-a11y__btn');
    a11yInteractive = false;

    // Single focus-ring element that tracks the projected bounding box of
    // whichever card is currently focused. position:fixed so it's relative to
    // the viewport, sized + rounded per-frame in tick().
    if (!focusRingEl) {
      focusRingEl = document.createElement('div');
      focusRingEl.className = 'globe-gallery-a11y__focus-ring';
      focusRingEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(focusRingEl);
    }
    // Pre-allocate projection scratch (4 corners + 1 tmp) — reused each frame
    // so the focus-ring update doesn't allocate.
    if (!ringCorners && typeof THREE !== 'undefined') {
      ringCorners = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ];
      ringTmpVec = new THREE.Vector3();
    }
    focusedCardIdx = -1;
  }

  function setupModal() {
    modalEl = q('.card-modal');
    if (!modalEl) return;
    raycaster = new THREE.Raycaster();
    mouseNDC = new THREE.Vector2();
    modalStartPos = new THREE.Vector3();
    modalStartQuat = new THREE.Quaternion();
    modalStartScale = new THREE.Vector3();
    modalCloseStartPos = new THREE.Vector3();
    modalCloseStartQuat = new THREE.Quaternion();
    modalCloseStartScale = new THREE.Vector3();
    sphereRotEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    sphereRotQuat = new THREE.Quaternion();
    foldRotQuat = new THREE.Quaternion();
    tmpVec3 = new THREE.Vector3();
    // Chrome div hosts the interactive elements (close, nav, info) above the WebGL card canvas.
    const chromeEl = q('.card-modal-chrome');
    const evtRoot = chromeEl || modalEl;
    evtRoot.querySelector('.card-modal__close').addEventListener('click', closeCardModal);
    evtRoot.querySelector('.card-modal__nav--prev').addEventListener('click', () => { navigateModal(-1); });
    evtRoot.querySelector('.card-modal__nav--next').addEventListener('click', () => { navigateModal(1); });
    modalEl.querySelector('.card-modal__backdrop').addEventListener('click', closeCardModal);
    document.addEventListener('keydown', (e) => {
      if (modalIdx < 0) return;
      if (e.key === 'Escape') closeCardModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
      // Block keyboard scroll keys (PageUp/Down, Home/End, Space, ArrowUp/Down)
      // while modal is open so the globe doesn't scroll/zoom behind the modal.
      // Space is exempted when focus is inside the modal chrome — Space should
      // activate a focused button (e.g., close), not be blocked.
      const chromeRoot = q('.card-modal-chrome');
      const focusInChrome = chromeRoot && chromeRoot.contains(document.activeElement);
      if (e.key === 'PageUp' || e.key === 'PageDown'
          || e.key === 'Home' || e.key === 'End'
          || e.key === 'ArrowUp' || e.key === 'ArrowDown'
          || (e.key === ' ' && !focusInChrome)) {
        e.preventDefault();
      }
      // Focus trap: when Tab/Shift+Tab would leave the modal chrome, wrap
      // around to the other end so focus stays inside the modal.
      if (e.key === 'Tab' && chromeRoot) {
        const focusables = chromeRoot.querySelectorAll('button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          try { last.focus(); } catch (err) { /* not focusable; ignore */ }
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          try { first.focus(); } catch (err) { /* not focusable; ignore */ }
        }
      }
    });

    // ── Mobile modal touch gestures: live 1:1 drag with rubber-band release ──
    // Horizontal: asset translates with finger; commit on release if past 25%
    //   viewport OR fast fling → animate off-screen and navigateModal.
    // Vertical (pull-down only): asset translates down + scales down with finger;
    //   commit on release if past 18% viewport OR fast fling → continue motion
    //   and closeCardModal.
    // Implemented via CSS transforms on modal-card-canvas (cheap, GPU-composited)
    // so the chrome (info panel, nav arrows, close, counter) stays put — matches
    // iOS Photos UX where only the asset moves during the gesture.
    let swStartX = 0; let
      swStartY = 0;
    let swLastX = 0; let swLastY = 0; let
      swLastT = 0;
    let swAxis = null; // 'x' | 'y' | null (locks after first significant move)
    let swActive = false;
    let swVelX = 0; let
      swVelY = 0;
    const AXIS_LOCK_PX = 10;
    const COMMIT_DIST_X_FRAC = 0.25; // 25% of viewport width
    const COMMIT_DIST_Y_FRAC = 0.18; // 18% of viewport height
    const COMMIT_VEL_X = 0.4; // px/ms
    const COMMIT_VEL_Y = 0.6;
    const PULL_SCALE_DAMPING = 1600; // larger → less scale change per px pulled
    const PULL_SCALE_MIN = 0.80;

    modalEl.addEventListener('touchstart', (e) => {
      if (currentBPName !== 'mobile') return;
      if (modalIdx < 0) return;
      if (e.touches.length !== 1) return;
      if (!modalCanvasEl) return;
      swStartX = e.touches[0].clientX; swLastX = swStartX;
      swStartY = e.touches[0].clientY; swLastY = swStartY;
      swLastT = Date.now();
      swActive = true;
      swAxis = null;
      swVelX = 0;
      swVelY = 0;
      // Capture touch position as warp center (finger-anchored fisheye).
      touchToWarpUV(swStartX, swStartY, modalWarpCenter);
      // Drag follows finger 1:1 with no animation lag.
      modalCanvasEl.style.transition = 'none';
    }, { passive: true });

    modalEl.addEventListener('touchmove', (e) => {
      if (!swActive || e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - swStartX;
      const dy = y - swStartY;

      // Axis lock — first significant movement determines whether this is a
      // horizontal swipe or a vertical pull-down. Prevents diagonal jitter.
      if (swAxis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        swAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }

      // Velocity tracking — used for fling detection on touchend.
      const now = Date.now();
      const dt = now - swLastT;
      if (dt > 0) {
        swVelX = (x - swLastX) / dt;
        swVelY = (y - swLastY) / dt;
      }
      swLastX = x; swLastY = y; swLastT = now;

      if (swAxis === 'x') {
        modalCanvasEl.style.transform = `translate3d(${dx}px, 0, 0)`;
        // Horizontal swipe warp: scales with drag distance relative to viewport width.
        // 30% of viewport width = full peak. Capped at MODAL_WARP_SWIPE.
        modalWarp = Math.min(1, Math.abs(dx) / (window.innerWidth * 0.30)) * MODAL_WARP_SWIPE;
      } else {
        // Pull-down only — upward drag does nothing (clamped to 0).
        const pullY = Math.max(0, dy);
        const scale = Math.max(PULL_SCALE_MIN, 1 - pullY / PULL_SCALE_DAMPING);
        modalCanvasEl.style.transform = `translate3d(0, ${pullY}px, 0) scale(${scale.toFixed(3)})`;
        // Pull-down warp: scales with pull distance relative to viewport height.
        // 20% of viewport height = full peak. Capped at MODAL_WARP_PULL.
        modalWarp = Math.min(1, pullY / (window.innerHeight * 0.20)) * MODAL_WARP_PULL;
      }
      pushModalWarpUniforms();
    }, { passive: true });

    modalEl.addEventListener('touchend', (e) => {
      if (!swActive) return;
      swActive = false;
      if (!modalCanvasEl || swAxis === null) { swAxis = null; return; }
      if (e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - swStartX;
      const dy = e.changedTouches[0].clientY - swStartY;

      if (swAxis === 'x') {
        const commit = Math.abs(dx) > window.innerWidth * COMMIT_DIST_X_FRAC
                  || Math.abs(swVelX) > COMMIT_VEL_X;
        if (commit) {
          // Animate canvas to translateX(±viewport_width) — that's exactly the
          // offset where the neighbor card lands at viewport center. Then swap
          // world positions in the same task as resetting CSS: the visible
          // result is identical before and after the reset (canvas shift + world
          // shift cancel), so no snap.
          //   swipe LEFT  (dx<0) → swipe direction -1 → +1 navigation (next)
          //   swipe RIGHT (dx>0) → swipe direction +1 → -1 navigation (previous)
          const cssDir = dx < 0 ? -1 : 1; // CSS animates toward swipe direction
          const navDir = -cssDir; // navigateModal direction (next = +1)
          modalCanvasEl.style.transition = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)';
          modalCanvasEl.style.transform = `translate3d(${cssDir * window.innerWidth}px, 0, 0)`;
          setTimeout(() => {
            modalCanvasEl.style.transition = 'none';
            commitSwipeNavigation(navDir);
            modalCanvasEl.style.transform = '';
          }, 220);
        } else {
          // Rubber-band back to center.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      } else {
        const pullCommit = dy > window.innerHeight * COMMIT_DIST_Y_FRAC
                      || swVelY > COMMIT_VEL_Y;
        if (pullCommit) {
          // Sync the mesh's WORLD position + scale to match the gesture's visible
          // state (which was driven purely by CSS transform on the canvas), then
          // reset CSS and call closeCardModal. closeCardModal snapshots the current
          // world transform as the close-animation start — so the fly-back to sphere
          // begins from where the user dragged the card, not from center. No snap.
          if (modalCard) {
            const pxPerWorld = H / (2 * 16.4 * Math.tan(Math.PI / 6));
            const pulledY = Math.max(0, dy);
            const gestureScale = Math.max(PULL_SCALE_MIN, 1 - pulledY / PULL_SCALE_DAMPING);
            modalCard.mesh.position.y -= pulledY / pxPerWorld; // CSS down → world Y negative
            modalCard.mesh.scale.multiplyScalar(gestureScale);
          }
          modalCanvasEl.style.transition = 'none';
          modalCanvasEl.style.transform = '';
          closeCardModal();
        } else {
          // Rubber-band back.
          modalCanvasEl.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)';
          modalCanvasEl.style.transform = '';
        }
      }
      swAxis = null;
    }, { passive: true });
  }

  // ── Motion-trail CA helper ────────────────────────────────────────────────────
  // dx/dy: world-space position delta this frame (new - prev).
  // ampOverride: optional 0-1 amplitude; when omitted, amplitude is derived from
  //   the greater of scroll velocity and globe drag speed so globe spin and modal
  //   animation both drive CA without relying on scroll.
  function applyMotionCA(mesh, dx, dy, ampOverride, strength) {
    if (!CA_ENABLED) return;
    const s = strength !== undefined ? strength : CA_MOTION_STRENGTH;
    const sX = Math.max(mesh.scale.x, 0.01);
    const sY = Math.max(mesh.scale.y, 0.01);
    const uvDX = dx / (CARD_W_SPHERE * sX);
    const uvDY = dy / (CARD_H_SPHERE * sY);
    const dragSpeed = Math.sqrt(dragVelX * dragVelX + dragVelY * dragVelY);
    const amp = ampOverride !== undefined
      ? ampOverride
      : Math.min(1.0, Math.max(scrollVel / SCROLL_VEL_MAX, dragSpeed / MAX_VEL));
    const mx = Math.max(-s, Math.min(s, uvDX * amp));
    const my = Math.max(-s, Math.min(s, uvDY * amp));
    mesh.material.uniforms.uMotionDir.value.set(mx, my);
  }

  // ── UV helper — routes to shader uniforms (CA on) or texture properties (CA off) ──
  function setCardUV(mesh, rx, ry, ox, oy) {
    if (CA_ENABLED) {
      mesh.material.uniforms.uRepeat.value.set(rx, ry);
      mesh.material.uniforms.uOffset.value.set(ox, oy);
    } else {
      const texMap = mesh.material.map;
      if (texMap) { texMap.repeat.set(rx, ry); texMap.offset.set(ox, oy); }
    }
  }

  // ── Per-frame tick ─────────────────────────────────────────────────────────
  function tick() {
    if (!renderer || !scene || !camera || !sphereGroup) return;

    const lenisY = window.scrollY;
    const scrollingDown = lenisY >= prevLenisY;
    scrollVel = Math.abs(lenisY - prevLenisY); // px/frame — drives motion trail intensity
    prevLenisY = lenisY;
    const entryStart = spacerOffsetTop - H * ENTRY_LEAD_VH;
    const entryRange = H * ENTRY_RAMP_VH;
    arcCopyEntryT = Math.max(0, Math.min(1, (lenisY - entryStart) / entryRange));
    progress = Math.max(0, Math.min(1, (lenisY - spacerOffsetTop) / spacerHeight));

    // ── Phase t values ──
    // arcPanT: preroll animates in WITH the entry (0 before section, P_ARC_PREROLL by entry)
    // so the arc is already in motion as the section scrolls into view.
    const arcPanT = Math.min(1, progress / P_PAN_END + P_ARC_PREROLL * arcCopyEntryT);
    const slideT = Math.max(arcCopyEntryT, Math.max(0, Math.min(1, progress / 0.07)));
    const slideE = easeOutSine(slideT);

    // gridFormT driven by arc rotation — peel is always relative to how far the arc has rotated
    const gridFormT = Math.max(0, Math.min(
      1,
      (arcPanT - P_GRID_ARC_START) / (P_GRID_ARC_END - P_GRID_ARC_START),
    ));

    // Convert arc-pan arrival times to progress units for fold/zoom phase calculations.
    // arcPanT(progress) ≈ progress/P_PAN_END + P_ARC_PREROLL
    //   →  progress ≈ (arcPanT - P_ARC_PREROLL) * P_PAN_END
    const gpWin = 1.0 - GRID_PEEL_STAGGER;
    const foldFirstArcT = P_GRID_ARC_START + gpWin * (P_GRID_ARC_END - P_GRID_ARC_START);
    const foldFirst = Math.max(0, (foldFirstArcT - P_ARC_PREROLL) * P_PAN_END);
    const foldLast = Math.max(0, (P_GRID_ARC_END - P_ARC_PREROLL) * P_PAN_END) + P_FOLD_DUR;
    const sphereFormT = Math.max(0, Math.min(1, (progress - foldFirst) / (foldLast - foldFirst)));
    const zoomT = Math.max(0, Math.min(1, (progress - foldLast) / (P_ZOOM_END - foldLast)));
    sphereFormTAtLastTick = sphereFormT; // cache for click handler

    // ── A11y: enable / disable gallery button tab-stops based on whether the
    //          sphere is currently interactive. Only iterates when the state
    //          flips (not every frame), so it's effectively free at idle. ──
    if (galleryBtns) {
      const wantInteractive = (sphereFormT >= SPHERE_INTERACTIVE_T) && (modalIdx < 0);
      if (wantInteractive !== a11yInteractive) {
        a11yInteractive = wantInteractive;
        for (let ga = 0; ga < galleryBtns.length; ga += 1) {
          galleryBtns[ga].tabIndex = wantInteractive ? 0 : -1;
        }
      }
    }

    // ── Build arc context ──
    buildArcCtx(arcPanT);

    // ── Active camera ──
    // Arc phase (no folding yet): ortho — flat 2D.
    // Fold phase: perspective, camera approaches CAM_Z_SPHERE in lockstep with the fold so
    //   sphere reaches normal size exactly when cards finish folding.
    // Zoom-through: perspective, camera continues from CAM_Z_SPHERE to CAM_Z_END.
    let activeCamera;
    const camZArc = arcCamZ();
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

    // ── Sphere rotation (drag + gentle auto) ──
    // sphereRotY/sphereRotX accumulate from drag input while above the interactive
    // threshold. They are NOT written to sphereGroup.rotation — the rotation is
    // applied PER-CARD in the sphere/fold blocks below, scaled by each card's own
    // fdE. This means:
    //   - Cards in sphere phase (fdE = 1) render fully rotated.
    //   - Cards mid-fold (fdE in (0, 1)) lerp between unrotated grid position and
    //     rotated sphere position, so rotation "unwinds" naturally as a card
    //     unfolds back to grid.
    //   - Cards in arc/grid/peel phases (fdE = 0) are never rotated — eliminating
    //     the off-screen drift that the previous sphereGroup-level rotation caused.
    //
    // sphereGroup.rotation is forced to identity each frame so any external code that
    // queries world matrices (modal world-snapshots, sphereGroup.attach) gets the
    // baked-in rotation from each mesh's local position, not from a group transform.
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
      if (modalIdx < 0) {
        if (!isDragging) {
          dragVelX *= DRAG_FRICTION;
          dragVelY *= DRAG_FRICTION;
          dragVelX += AUTO_ROT_SPEED;
        }
        sphereRotY += dragVelX;
        sphereRotX += dragVelY;
        sphereRotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, sphereRotX));
      }

      // ── Sphere-drag warp ──
      // Baseline (while actively held) + velocity burst that decays via dragVel friction.
      // Smoothly ease toward a per-frame target rather than snapping. Without easing,
      // releasing a drag (or clicking — pointerup flips isDragging to false AND
      // modal-open flips modalIdx non-negative) caused the baseline component (0.05)
      // to drop to 0 in one frame — the remaining sphere cards' barrel distortion
      // popped, which read as a pixel-level "jump" right when the modal opened.
      let warpTarget;
      if (modalIdx < 0) {
        const dragSpeed = Math.sqrt(dragVelX * dragVelX + dragVelY * dragVelY);
        const burst = dragSpeed * SPHERE_DRAG_WARP_VEL;
        const baseline = isDragging ? SPHERE_DRAG_WARP_BASELINE : 0;
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
      dragVelX = 0;
      dragVelY = 0;
      sphereDragWarp += (0 - sphereDragWarp) * 0.20;
      if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;
      if (sphereFormT < 0.01) {
        sphereRotY = 0;
        sphereRotX = 0;
      }
    }

    // Update the per-frame rotation Euler/Quaternion used by the sphere block + any
    // snap-to-sphere helpers. sphereRotActive is a fast-path flag so the rotation
    // math can be skipped when the sphere is upright.
    const sphereRotActive = (sphereRotY !== 0 || sphereRotX !== 0);
    if (sphereRotEuler) {
      sphereRotEuler.set(sphereRotX, sphereRotY, 0, 'YXZ');
      sphereRotQuat.setFromEuler(sphereRotEuler);
    }

    // ── Modal card animation (the flown-out card) ──
    // The card is parented to the scene root during modal phases. It animates from its
    // captured world transform → target near camera (opening), or back to current sphere
    // slot world transform (closing). Sphere keeps rotating behind it so the closing path
    // tracks the slot's live position.
    if (modalCard && modalPhase) {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const aT = Math.max(0, Math.min(1, (now - modalAnimT0) / MODAL_ANIM_DURATION));
      const aE = easeInOutCubic(aT);
      const tgtPos = new THREE.Vector3();
      const tgtQuat = new THREE.Quaternion();
      const tgtScale = new THREE.Vector3();

      // Capture modal card position before this frame's update for CA delta computation
      const prevModalX = modalCard.mesh.position.x;
      const prevModalY = modalCard.mesh.position.y;

      if (modalPhase === 'opening' || modalPhase === 'open') {
        computeModalTarget(tgtPos, tgtQuat, tgtScale);
        if (modalPhase === 'open' || aT >= 1) {
          modalCard.mesh.position.copy(tgtPos);
          modalCard.mesh.quaternion.copy(tgtQuat);
          modalCard.mesh.scale.copy(tgtScale);
          if (modalPhase === 'opening' && aT >= 1) modalPhase = 'open';
        } else {
          modalCard.mesh.position.lerpVectors(modalStartPos, tgtPos, aE);
          modalCard.mesh.quaternion.copy(modalStartQuat).slerp(tgtQuat, aE);
          modalCard.mesh.scale.lerpVectors(modalStartScale, tgtScale, aE);
        }

        // Chrome reveal: start fade-in once card is 90% to its target position.
        // Guard: skip if already at 1 (navigate snaps chrome instantly — no re-animation).
        if (modalChromeFadeT < 1) {
          if (aT >= 0.90 && modalChromeRevealT0 < 0) modalChromeRevealT0 = now;
          modalChromeFadeT = modalChromeRevealT0 >= 0
            ? Math.max(0, Math.min(1, (now - modalChromeRevealT0) / CHROME_REVEAL_DUR))
            : 0;
        }
      } else if (modalPhase === 'closing') {
        // Live target = the slot's current world transform.
        //   World position = (sphere drag rotation × spherePos) + sphereGroup.position
        //   World quat     = (sphere drag rotation) × sphereQuat
        // sphereGroup.rotation is identity (per-card rotation arch), so its matrixWorld
        // is just the z translation. Apply the drag rotation manually.
        sphereGroup.updateMatrixWorld(true);
        if (sphereRotActive) {
          tgtPos.copy(modalCard.spherePos).applyEuler(sphereRotEuler);
          tgtQuat.copy(sphereRotQuat).multiply(modalCard.sphereQuat);
        } else {
          tgtPos.copy(modalCard.spherePos);
          tgtQuat.copy(modalCard.sphereQuat);
        }
        tgtPos.add(sphereGroup.position);
        tgtScale.set(modalCard.sphereScaleX, 1, 1);

        modalCard.mesh.position.lerpVectors(modalCloseStartPos, tgtPos, aE);
        modalCard.mesh.quaternion.copy(modalCloseStartQuat).slerp(tgtQuat, aE);
        modalCard.mesh.scale.lerpVectors(modalCloseStartScale, tgtScale, aE);

        if (aT >= 1) {
          // Reset the cached SDF material's animated uniforms before swapping
          // back to the basic material. Without this, leftover uOpacity / uWarp
          // / uMotionDir values would persist on card.modalMat and ghost the
          // next time this card is shown in modal.
          resetModalMaterialUniforms(modalCard.modalMat, 1);
          // Restore original MeshBasicMaterial before re-parenting to globe
          if (modalCard.mesh.origMaterial) {
            modalCard.mesh.material = modalCard.mesh.origMaterial;
            modalCard.mesh.origMaterial = null;
          }
          // Re-parent to sphereGroup and snap to canonical local transform
          // (with the current sphere-drag rotation baked in so there's no flash).
          sphereGroup.attach(modalCard.mesh);
          snapCardToSphereSlot(modalCard);
          modalCard.mesh.material.depthTest = true;
          modalCard.mesh.renderOrder = 0;
          if (modalCanvasEl) modalCanvasEl.style.display = 'none';
          modalPhase = null;
          modalCard = null;
          modalIdx = -1;
        }
      }

      // Modal CA — apply to the SDF ShaderMaterial while the card is actively moving.
      // Use amp = 1.0 so the full CA_MOTION_STRENGTH is available; the position delta
      // itself encodes velocity (small delta when settled = small smear). Clear to zero
      // once fully open so the static card shows no aberration.
      if (CA_ENABLED && modalCard && modalCard.mesh.material.uniforms
        && modalCard.mesh.material.uniforms.uMotionDir) {
        if (modalPhase === 'open') {
          modalCard.mesh.material.uniforms.uMotionDir.value.set(0, 0);
        } else if (modalPhase) {
          const mdx = modalCard.mesh.position.x - prevModalX;
          const mdy = modalCard.mesh.position.y - prevModalY;
          applyMotionCA(modalCard.mesh, mdx, mdy, 1.0);
        }
      }

      // Modal warp — fisheye intensity driven by phase. During open/close the warp
      // peaks mid-animation (bell curve via sin(aT·π)) and settles to 0 when 'open'.
      // While 'open', the warp value is set externally by touch handlers (drag).
      if (modalPhase === 'opening') {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_OPEN;
      } else if (modalPhase === 'closing') {
        modalWarp = Math.sin(Math.max(0, Math.min(1, aT)) * Math.PI) * MODAL_WARP_CLOSE;
      } else if (modalPhase === 'open') {
        // Decay any leftover warp once settled; touch handlers will set it again on drag.
        modalWarp *= 0.85;
        if (modalWarp < 0.001) modalWarp = 0;
      }
      // Skip the push during desktop nav cross-warp — that animation drives BOTH the
      // old and new card's uWarp uniforms directly below.
      if (!dnNavActive) pushModalWarpUniforms();

      // Keep chrome elements locked to the card's projected screen position every frame.
      // During 'opening' this positions them at the final target so they fade in correctly.
      if (modalPhase === 'opening' || modalPhase === 'open') {
        positionModalChrome();
      }
    }

    // ── Desktop modal-nav cross-warp transition ──
    // Both old and new card materials get their uWarp uniform driven by a sin bell
    // curve peaking at DN_NAV_WARP mid-flight. Opacity cross-fades via easeInOutCubic.
    // At aT >= 1, finalize and detach the old card back to its sphere slot.
    if (dnNavActive) {
      const dnNow = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const dnT = Math.max(0, Math.min(1, (dnNow - dnNavT0) / DN_NAV_DUR));
      if (dnT >= 1) {
        completeDesktopNavTransition();
      } else {
        const dnWarp = Math.sin(dnT * Math.PI) * DN_NAV_WARP;
        const dnE = easeInOutCubic(dnT);
        if (dnNavOldCard && dnNavOldCard.mesh.material && dnNavOldCard.mesh.material.uniforms) {
          dnNavOldCard.mesh.material.uniforms.uWarp.value = dnWarp;
          dnNavOldCard.mesh.material.uniforms.uOpacity.value = 1 - dnE;
        }
        if (dnNavNewCard && dnNavNewCard.mesh.material && dnNavNewCard.mesh.material.uniforms) {
          dnNavNewCard.mesh.material.uniforms.uWarp.value = dnWarp;
          dnNavNewCard.mesh.material.uniforms.uOpacity.value = dnE;
        }
      }
    }

    // Canvas visibility — instantly visible once the section approaches; no opacity fade.
    // The arc's own rotation/slide-up handles the "appearing" feel.
    const canvas = renderer.domElement;
    // matches arcCopyEntryT start point (entryStart)
    const showTrigger = spacerOffsetTop - H * ENTRY_LEAD_VH;
    if (lenisY < showTrigger || zoomT >= 0.95) {
      canvas.style.display = 'none';
    } else {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
    }

    // Pull-quote: invisible while scrolling in from below; JS adds .is-active once
    // zoomT crosses 0.38 (element is already at its sticky position). The sticky
    // container handles the natural forward exit.
    // Scroll-up exit: the sticky element unsticks only ~84px after the fade threshold,
    // so a full 0.7s transition would still be playing when the element starts drifting
    // downward. On scroll-up we use a fast 0.15s fade so it disappears before moving.
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

    // Switch depth-sort strategy: arc needs manual order; sphere needs camera-distance sort
    renderer.sortObjects = sphereFormT > 0.5;

    // During fold: slide sphereGroup forward so the sphere-camera distance lerps from
    // FOLD_SPHERE_DIST (70% viewport height) at fold start to CAM_Z_SPHERE (93%) at fold
    // complete — easeInCubic holds it near 70% through formation, then swells to full size.
    // Cards NOT yet on the sphere subtract this offset from their local z so they stay at
    // world z≈0 and appear at their correct size from the camera.
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
    const sphereFormT3 = sphereFormT * sphereFormT * sphereFormT;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT3);
    const sphGroupZ = zoomT === 0 ? (camera.position.z - foldSphDist) : 0;
    sphereGroup.position.z = sphGroupZ;

    // No conveyor: all cards on arc simultaneously, slot = i for every card.
    const windowPos = 0;

    const entryYOffset = (1 - slideE) * H * 0.30;
    const arcScale = CARD_W_ARC / CARD_W_SPHERE;
    // Entry rotation: arc holds off-screen for the first 5% of entry (while text settles),
    // then sweeps counter-clockwise into its final fanned position over the remaining 95%.
    const arcEntryT = Math.max(0, Math.min(1, (arcCopyEntryT - 0.05) / 0.95));
    const entryRot = (1 - easeOutCubic(arcEntryT)) * 0.9;

    // ── Option C: global chromatic aberration SVG filter on the WebGL canvas ──
    // Vertical shift (dy) tracks scroll velocity — scroll is vertical so R/B shift up/down.
    // Resets to zero when scrolling stops so the canvas returns to clean on every settle.
    if (CA_ENABLED && caFilterR) {
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

    // Per-card transform for one frame. Extracted from the old `for` loop body so the
    // early-outs read as `return` (no-continue) — called once per card just below.
    function updateCardTransform(i) {
      const card = cards[i];
      const { mesh } = card;

      // Skip the modal-active card — its transform is driven by the modal animation loop above.
      // Also skip any card whose mesh is parented into modalScene (i.e., the prev/next
      // swipe-neighbors). Their positions/materials/scales are managed by the swipe
      // helpers; the main tick loop would otherwise overwrite them every frame.
      if (card === modalCard) return;
      if (modalScene && mesh.parent === modalScene) return;

      // ── Arc → grid peel stagger: i-based base cascade + per-card jitter for organic timing ──
      const baseDelay = (i / (N_TOTAL - 1)) * GRID_PEEL_STAGGER;
      const jitter = (card.peelJitter - 0.5) * ARC_PEEL_JITTER;
      const gpDelay = Math.max(0, Math.min(GRID_PEEL_STAGGER, baseDelay + jitter));
      const gpLocalT = Math.max(0, Math.min(1, (gridFormT - gpDelay) / Math.max(0.01, gpWin)));
      const gpE = easeOutCubic(gpLocalT);

      // ── Grid → sphere fold: starts immediately when this card arrives in grid ──
      // Convert arc-pan arrival back to progress for fold timer
      const gpArrivalArcT = P_GRID_ARC_START
        + Math.min(1, gpDelay + gpWin) * (P_GRID_ARC_END - P_GRID_ARC_START);
      const gpArrivalProg = Math.max(0, (gpArrivalArcT - P_ARC_PREROLL) * P_PAN_END);
      const fdLocalT = Math.max(0, Math.min(1, (progress - gpArrivalProg) / P_FOLD_DUR));
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

      // ── Fully in sphere ──
      if (fdE >= 1) {
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
        mesh.scale.set(card.sphereScaleX * hs, hs, hs);
        setCardUV(mesh, 1, 1, 0, 0);
        if (mesh.material.alphaMap !== card.sphereMask) {
          mesh.material.alphaMap = card.sphereMask;
          mesh.material.needsUpdate = true;
        }
        if (sphereRotActive) {
          mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
        } else {
          mesh.quaternion.copy(card.sphereQuat);
        }
        mesh.renderOrder = 0;
        mesh.material.opacity = 1;
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
        applyMotionCA(mesh, card.spherePos.z * dragVelX, -card.spherePos.z * dragVelY);
        return;
      }

      // ── Grid → sphere fold ──
      if (fdE > 0) {
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
        if (mesh.material.alphaMap !== card.arcMask) {
          mesh.material.alphaMap = card.arcMask;
          mesh.material.needsUpdate = true;
        }
        if (sphereRotActive) {
          foldRotQuat.copy(sphereRotQuat).multiply(card.sphereQuat);
          mesh.quaternion.slerpQuaternions(card.gridQuat, foldRotQuat, fdE);
        } else {
          mesh.quaternion.slerpQuaternions(card.gridQuat, card.sphereQuat, fdE);
        }
        mesh.renderOrder = 0;
        mesh.material.opacity = 1;
        applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
        return;
      }

      // ── Fully in grid (dwell phase) ──
      if (gpE >= 1) {
        mesh.visible = true;
        mesh.position.set(card.gridPos.x, card.gridPos.y, card.gridPos.z - sphGroupZ);
        mesh.scale.setScalar(card.gridScale);
        setCardUV(mesh, card.arcRepeatX, card.arcRepeatY, card.arcOffsetX, card.arcOffsetY);
        if (mesh.material.alphaMap !== card.arcMask) {
          mesh.material.alphaMap = card.arcMask;
          mesh.material.needsUpdate = true;
        }
        mesh.quaternion.copy(card.gridQuat);
        mesh.renderOrder = N_TOTAL - i;
        mesh.material.opacity = 1;
        applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
        return;
      }

      // ── Arc phase: waiting to peel, or actively peeling arc→grid ──
      const slot = i - windowPos;
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
      const fan = getFanData(fanT);
      const arcDelay = fanT * ARC_STAGGER;
      const arcLocalT = Math.max(
        0,
        Math.min(1, (arcPanT - arcDelay) / Math.max(0.01, 1 - ARC_STAGGER)),
      );
      const arcLocalE = easeInOutCubic(arcLocalT);
      const pxPushed = fan.px + fan.rx * 60 * arcLocalE;
      const pyPushed = fan.py + fan.ry * 60 * arcLocalE;
      const wp = entryRot > 0.001
        ? rotateArcPoint(pxPushed, pyPushed, entryRot)
        : cssToWorld(pxPushed, pyPushed);
      const arcY = wp.y - entryYOffset;
      const webglRot = -fan.cssRot - entryRot;

      mesh.visible = true;

      if (mesh.material.alphaMap !== card.arcMask) {
        mesh.material.alphaMap = card.arcMask;
        mesh.material.needsUpdate = true;
      }

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

    for (let i = 0; i < N_TOTAL; i += 1) updateCardTransform(i);

    // ── Arc copy element ──
    const arcCopyEl = q('.offer-arc-copy');
    if (arcCopyEl) {
      const P_HEADLINE_IN = 0.25;
      const P_ARC_COPY_OUT = 0.50;
      const arcCopyInE = easeOutCubic(Math.min(1, arcCopyEntryT / 0.336));
      const arcCopyOutT = Math.max(0, Math.min(
        1,
        (progress - P_HEADLINE_IN) / (P_ARC_COPY_OUT - P_HEADLINE_IN),
      ));
      const arcCopyOutE = easeOutCubic(arcCopyOutT);
      const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
      const arcCopySlide = 24 * (1 - arcCopyInE);
      // Mobile pins to 8px from viewport left (matches nav pill outer padding).
      // Desktop/tablet uses the 24px-grid-aligned position with centering offset.
      const gridLeft = (currentBPName === 'mobile')
        ? 8
        : 24 + Math.max(0, (W - 48 - 1392) / 2);
      arcCopyEl.style.left = `${gridLeft}px`;
      arcCopyEl.style.opacity = arcCopyOp.toFixed(3);
      arcCopyEl.style.transform = `translateY(${arcCopySlide.toFixed(1)}px)`;
    }

    renderer.render(scene, activeCamera);

    // Render the modal card on its own canvas (above the blur backdrop) when active
    if (modalRenderer && modalScene && modalCard) {
      modalRenderer.render(modalScene, camera);
    }

    // ── A11y: focus ring projection ──
    // If a gallery button is currently focused (via :focus-visible), project
    // the corresponding card's 4 corners to screen space, compute the bounding
    // box, and position the ring DOM element to match. Border-radius scales
    // proportionally with the card's projected height (the sphere card's
    // texture-baked rounded corners do the same).
    if (focusRingEl && focusedCardIdx >= 0 && focusedCardIdx < cards.length
        && focusRingEl.classList.contains('is-visible') && ringCorners) {
      const fmesh = cards[focusedCardIdx].mesh;
      if (fmesh && fmesh.visible) {
        fmesh.updateMatrixWorld(true);
        const halfWRing = CARD_W_SPHERE * 0.5;
        const halfHRing = CARD_H_SPHERE * 0.5;
        ringCorners[0].set(-halfWRing, -halfHRing, 0);
        ringCorners[1].set(halfWRing, -halfHRing, 0);
        ringCorners[2].set(halfWRing, halfHRing, 0);
        ringCorners[3].set(-halfWRing, halfHRing, 0);
        let fMinX = Infinity; let fMinY = Infinity; let fMaxX = -Infinity; let
          fMaxY = -Infinity;
        for (let rc = 0; rc < 4; rc += 1) {
          ringTmpVec.copy(ringCorners[rc]).applyMatrix4(fmesh.matrixWorld).project(camera);
          const sx = (ringTmpVec.x + 1) * 0.5 * W;
          const sy = (1 - ringTmpVec.y) * 0.5 * H;
          if (sx < fMinX) fMinX = sx;
          if (sy < fMinY) fMinY = sy;
          if (sx > fMaxX) fMaxX = sx;
          if (sy > fMaxY) fMaxY = sy;
        }
        const ringW = Math.max(0, fMaxX - fMinX);
        const ringH = Math.max(0, fMaxY - fMinY);
        focusRingEl.style.left = `${Math.round(fMinX)}px`;
        focusRingEl.style.top = `${Math.round(fMinY)}px`;
        focusRingEl.style.width = `${Math.round(ringW)}px`;
        focusRingEl.style.height = `${Math.round(ringH)}px`;
        // Match the card's texture-baked corner radius (22/631 of card height).
        focusRingEl.style.borderRadius = `${Math.round((ringH * 22) / 631)}px`;
      }
    }
  }

  // ── Layout ─────────────────────────────────────────────────────────────────
  let resizeHandler = null;
  let layoutObs = null; // ResizeObserver keeping spacer metrics fresh as page content loads
  let bpMediaQueries = []; // matchMedia listeners for BP boundaries (DevTools toggle backup)

  // ── Init ───────────────────────────────────────────────────────────────────
  function initRuntime() {
    const canvas = q('.offer-globe-canvas');
    if (!canvas) return;

    W = window.innerWidth;
    H = window.innerHeight;

    // Resolve breakpoint and apply its constants BEFORE anything reads N_TOTAL,
    // SPHERE_R, etc. CSS is intentionally NOT BP-aware here — author per-BP CSS
    // with traditional @media queries.
    const bp = resolveBP(W);
    currentBPName = bp.name;
    applyBP(bp.cfg);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false; // we manage order via mesh.renderOrder

    scene = new THREE.Scene();

    // Modal renderer / scene — renders only the flown-out card on a separate canvas above the
    // .card-modal__backdrop, so it stays sharp while the backdrop blurs the main canvas.
    modalCanvasEl = q('.modal-card-canvas');
    if (modalCanvasEl) {
      const modalGlOpts = { canvas: modalCanvasEl, antialias: true, alpha: true };
      modalRenderer = new THREE.WebGLRenderer(modalGlOpts);
      modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      modalRenderer.setSize(W, H);
      modalRenderer.setClearColor(0x000000, 0);
      modalScene = new THREE.Scene();
    }

    // Perspective camera — used during sphere + zoom phases
    camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
    camera.position.set(0, 0, arcCamZ());
    camera.lookAt(0, 0, 0);

    // Orthographic camera — used during arc phase for true flat 2D (no perspective distortion)
    // Bounds map 1 world unit = 1 CSS pixel, matching the arc math coordinate space.
    cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
    cameraOrtho.position.set(0, 0, 100);
    cameraOrtho.lookAt(0, 0, 0);

    const spacer = root; // the block element is the scroll spacer (.offer-pin-spacer)
    function doLayout() {
      W = window.innerWidth;
      H = window.innerHeight;

      // Crossing a breakpoint boundary → full destroy()+init() so all geometry,
      // textures, and grid layout rebuild with the new BP's constants. Falls
      // through to the same-BP path otherwise (cheap resize handling).
      const nextBP = resolveBP(W);
      if (nextBP.name !== currentBPName) {
        // eslint-disable-next-line no-use-before-define
        destroy();
        initRuntime();
        return;
      }
      spacerOffsetTop = spacer ? spacer.getBoundingClientRect().top + window.scrollY : 0;
      spacerHeight = spacer ? spacer.offsetHeight : window.innerHeight * 7;
      // Re-apply DPR — Chrome's DevTools device-emulation toggle changes DPR but
      // doesn't always fire 'resize'; without this the canvas would keep the old DPR's
      // internal buffer size and render at the wrong resolution.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      if (modalRenderer) {
        modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        modalRenderer.setSize(W, H);
      }
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

    // Recompute spacer metrics whenever page height changes (images/blocks loading
    // above the spacer shift its offsetTop; spacerHeight=0 at first paint makes
    // progress=Infinity and skips straight to the zoom/pull-quote phase).
    if (layoutObs) layoutObs.disconnect();
    layoutObs = new ResizeObserver(() => {
      spacerOffsetTop = spacer ? spacer.getBoundingClientRect().top + window.scrollY : 0;
      spacerHeight = spacer
        ? (spacer.offsetHeight || window.innerHeight * 7)
        : window.innerHeight * 7;
    });
    layoutObs.observe(document.body);

    // matchMedia listeners for the BP boundaries are a backup for the 'resize' event,
    // which Chrome doesn't always fire when DevTools device-emulation is toggled.
    // Each listener fires once when the viewport crosses its boundary in either direction.
    if (bpMediaQueries.length === 0) {
      const queries = [
        window.matchMedia('(max-width: 767px)'),
        window.matchMedia('(min-width: 768px) and (max-width: 1023px)'),
        window.matchMedia('(min-width: 1024px)'),
      ];
      const onMQChange = () => { doLayout(); };
      queries.forEach((mq) => {
        if (mq.addEventListener) mq.addEventListener('change', onMQChange);
        else mq.addListener(onMQChange); // Safari < 14 fallback
        bpMediaQueries.push({ mq, handler: onMQChange });
      });
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('mousemove', onHover);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    // pointercancel fires when the browser hijacks the gesture (common in Chrome
    // DevTools touch emulation with touch-action restrictions). Treat it as
    // pointerup so taps still register — the dx/dy/dt thresholds inside onPointerUp
    // already filter out genuine drags from taps.
    window.addEventListener('pointercancel', onPointerUp);

    canvas.style.display = 'block';

    // Cache SVG filter elements for Option C global CA
    caFilterR = q('.ca-r-offset');
    caFilterB = q('.ca-b-offset');

    setupModal();

    loadAllTextures(() => {
      buildCards();
      setupGlobeGalleryA11y();
      if (!tickerAdded) {
        startTicker();
        tickerAdded = true;
      }
    });
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
    if (bpMediaQueries.length) {
      bpMediaQueries.forEach((entry) => {
        if (entry.mq.removeEventListener) entry.mq.removeEventListener('change', entry.handler);
        else entry.mq.removeListener(entry.handler);
      });
      bpMediaQueries = [];
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onHover);
      renderer.domElement.style.cursor = '';
      renderer.domElement.style.filter = '';
      renderer.dispose();
      renderer.domElement.style.display = 'none';
    }
    cards = [];
    if (scene) { while (scene.children.length) scene.remove(scene.children[0]); }
    renderer = null; scene = null; camera = null; cameraOrtho = null; sphereGroup = null;
    // A11y gallery cleanup so a fresh init starts clean.
    const galleryEl = q('.globe-gallery-a11y');
    if (galleryEl && galleryEl.parentNode) galleryEl.parentNode.removeChild(galleryEl);
    if (focusRingEl && focusRingEl.parentNode) focusRingEl.parentNode.removeChild(focusRingEl);
    galleryBtns = null;
    a11yInteractive = false;
    focusRingEl = null;
    focusedCardIdx = -1;
    ringCorners = null;
    ringTmpVec = null;
    // Reset arc-copy and pull-quote
    const arcCopyEl = q('.offer-arc-copy');
    if (arcCopyEl) arcCopyEl.style.cssText = '';
    if (pqEl) { pqEl.classList.remove('is-active'); pqEl.style.transition = ''; pqShown = false; }
    prevLenisY = 0; scrollVel = 0;
    // NOTE: currentBPName and <html data-bp> are intentionally NOT cleared here.
    // doLayout() relies on currentBPName to detect crossings, and init() will
    // overwrite both. Clearing them would break the re-init flow.
  }

  return { init: initRuntime, destroy };
}

// ── Block entry point ────────────────────────────────────────────────────────
export default async function init(el) {
  if (el.dataset.globeReady) return el;
  el.dataset.globeReady = 'true';

  // Reduced-motion: skip the WebGL experience entirely and collapse the tall
  // scroll spacer. TODO (iterate): author a static poster fallback like pdf-space.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) {
    el.classList.add('globe--reduced');
    return el;
  }

  // Extract authored content BEFORE buildGlobeDom() wipes the block's children.
  // fragmentHref is captured here so it survives the DOM wipe.
  const { cards: domCards, arcCopy, pullQuote, fragmentHref } = parseAuthoredContent(el);

  // Unique suffix for this instance's id-bearing nodes (CA filter, aria target).
  globeInstanceSeq += 1;
  const gid = globeInstanceSeq;
  buildGlobeDom(el, gid);

  // Inject authored text into the built DOM slots (fallback to GLOBE_MARKUP defaults if absent).
  if (arcCopy) {
    const titleEl = el.querySelector('.offer-arc-copy__title');
    const bodyEl = el.querySelector('.offer-arc-copy__body');
    if (titleEl && arcCopy.title) titleEl.textContent = arcCopy.title;
    if (bodyEl && arcCopy.body) bodyEl.textContent = arcCopy.body;
  }
  if (pullQuote) {
    const quoteEl = el.querySelector('.offer-pullquote__quote');
    const nameEl = el.querySelector('.offer-pullquote__name');
    const roleEl = el.querySelector('.offer-pullquote__role');
    if (quoteEl && pullQuote.quote) quoteEl.textContent = pullQuote.quote;
    if (nameEl && pullQuote.name) nameEl.textContent = pullQuote.name;
    if (roleEl && pullQuote.role) roleEl.textContent = pullQuote.role;
  }

  const fetchedCards = await (
    fragmentHref ? fetchFragmentCards(fragmentHref) : Promise.resolve(null)
  );

  // Prefer fully-fetched cards; fall back to what was in the DOM at init() time.
  const cards = fetchedCards || domCards;
  // No cards → nothing to render. Collapse the spacer rather than init an empty scene.
  if (!cards || cards.length === 0) {
    el.classList.add('globe--reduced');
    return el;
  }
  const runtime = createGlobeRuntime(cards, el, gid);
  if (!runtime) { el.classList.add('globe--reduced'); return el; }
  runtime.init();
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
