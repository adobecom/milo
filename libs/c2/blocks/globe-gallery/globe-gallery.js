/* ─────────────────────────────────────────────────────────────────────────
   Globe Gallery — Three.js WebGL scrolled hero.

   Phases (progress 0→1 across the block's full scroll length; height set in the CSS):
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
import { loadCardTextures, createClickDragTexture } from './src/textures.js';
import { createCardMaterial, createTextMaterial } from './src/materials.js';
import createGalleryA11y from './src/a11y.js';
import createGlobeModal from './src/modal.js';
import createInteraction from './src/interaction.js';
import createCursor from './src/cursor.js';
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
  // ≥768 — Milo md + lg (named for its lower bound). Full experience: every authored
  // card (N_MAX: 0 = uncapped), 9×5 nominal grid, large sphere.
  md: {
    minWidth: 768,
    // Cap on how many authored cards this band renders. 0 = uncapped (render all).
    // Desktop shows the full set: the sphere is a Fibonacci distribution and the arc
    // is a normalized fanT spread, so both scale to any count; the grid intentionally
    // overflows the viewport already (see computeGridLayout), so cards beyond the
    // 9×5 = 45 nominal slots land in extra off-screen columns rather than being dropped.
    N_MAX: 0,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 6.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 65,
    CAM_Z_END: -60,
    GRID_COLS: 9,
    GRID_ROWS: 5,
    // Full sphere — desktop has free rotation, so any card can be pitched to face the
    // camera; nothing is permanently oblique. See fibSpherePos.
    POLAR_BAND: 1,
    // 0 = cards face radially outward (true sphere). See applyCardFacing.
    CARD_FACE_CAMERA: 0,
    // 0 = keep native-aspect sizing (landscape cards are physically bigger). md is sparse
    // enough (8.9% coverage, gap/maxHalfDiag 1.57) that the size variance reads as collage
    // rather than crowding. See SPHERE_AREA_NORM in buildCards.
    SPHERE_AREA_NORM: 0,
    // Per-card random roll, radians (±0.25 ≈ ±14°) — collage scatter.
    CARD_ROLL_JITTER: 0.5,
    // Fraction of the cards that cluster into the off-screen arc flank. A fraction (not
    // an absolute count) so the clustered:spread ratio holds at any card count — at the
    // former fixed 45 cards this resolves to the same 27.
    ARC_DENSE_FRACTION: 0.6,
  },
  // <768 — Milo sm. Tuned for 375x667 portrait: sphere fits ~88% viewport width /
  // 49% height at SPHERE_R=20, CAM_Z_SPHERE=70; card count + grid adjusted to
  // portrait; arc cards sized to fit with margin. ARC_DENSE_FRACTION=0 → cards spread
  // uniformly across the arc (24 isn't crowded enough to need clustering).
  // N_MAX is a HARD 24 here (unlike md's uncapped): the 3×8 grid already overflows a
  // 667px-tall viewport, the sphere is small, and mobile shouldn't pay the texture cost
  // of a large set. Extra authored cards are deliberately ignored on sm — the first 24 win.
  sm: {
    minWidth: 0,
    N_MAX: 24,
    ARC_SPAN: 3.6,
    SPHERE_R: 20,
    // 6.0 → 11.0. Coverage scales with H², and this is the nominal height BEFORE
    // SPHERE_AREA_NORM (which shrinks wide cards and grows tall ones to equalize area).
    // Net: ~42% sphere-face coverage — the sparse "scattered" read was mostly low coverage —
    // while the widest card still clears its neighbours (gap/maxHalfDiag 1.60). Cheaper than
    // more cards (no extra textures/draws). Only affects the SPHERE phase; CARD_W_ARC drives
    // the arc.
    CARD_H_SPHERE: 11.0,
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    GRID_COLS: 3,
    GRID_ROWS: 8,
    // Truncated to a latitude band → barrel/"sphere section" silhouette. Touch is
    // yaw-only, which can't change a card's latitude, so the polar caps would be
    // permanently edge-on (see fibSpherePos). 0.7 → polar range 46–134°, worst-case
    // obliquity 44° (was 90°), silhouette 1.26:1 wide — still reads as a globe.
    // Side effect: the globe covers ~41% of viewport height (was ~55%). Deliberately NOT
    // compensated by pulling CAM_Z_SPHERE in — the equator is unchanged, so width is
    // already at ~98% of the frustum and any closer clips the globe horizontally.
    POLAR_BAND: 0.7,
    // Turn each card halfway from radial-outward toward the camera, killing the edge-on
    // slivers at the left/right limb (azimuthal obliquity — POLAR_BAND only fixed the
    // latitude component). Halves worst-case obliquity: 90° → 45°. See updateCardFacing.
    CARD_FACE_CAMERA: 0.5,
    // Reduced from md's ±14° to ±5°: at sm's sparse coverage the larger jitter reads as
    // scattered debris rather than a structured surface.
    CARD_ROLL_JITTER: 0.18,
    // 0.5 = EQUAL AREA. Cards keep native aspect on the sphere, so a 16:9 image was 2.67×
    // the area of a 2:3 one — the actual cause of the "some places dense, some sparse"
    // read (the widest cards had gap/maxHalfDiag 1.25, i.e. they physically overlapped
    // their neighbours). Scaling both axes by sphereScaleX^-0.5 equalizes area exactly
    // while leaving aspect — and therefore the image — undistorted.
    SPHERE_AREA_NORM: 0.5,
    ARC_DENSE_FRACTION: 0,
  },
};

function resolveBP(w) {
  if (w >= BREAKPOINTS.md.minWidth) return { name: 'md', cfg: BREAKPOINTS.md };
  return { name: 'sm', cfg: BREAKPOINTS.sm };
}

// ── Phase timeline (progress 0→1 across the block's full scroll length) ──────
const ARC_STAGGER = 0.594;
const PROGRESS_PAN_END = 0.55;
const PROGRESS_ARC_PREROLL = 0.30;
// Grid peel expressed as arc-rotation fraction (0=arc start, 1=arc end).
const PROGRESS_GRID_ARC_START = 0.30;
const PROGRESS_GRID_ARC_END = 0.60;
const PROGRESS_FOLD_DUR = 0.25;
const PROGRESS_ZOOM_END = 1.00;
// arc→grid: stagger peels across this fraction of the formation phase (more simultaneous).
// Defined here (not the grid/fold block below) because the fold window derives from it.
const GRID_PEEL_STAGGER = 0.20;
// Grid → sphere fold overlap: each card begins folding to the sphere this far — in peel
// position-space (0–1) — BEFORE it fully lands in the grid, folding from its live peel
// position so there's no snap. Effect: the 9×5 grid never visibly "resolves" as a finished
// composition (the grid phase reads shorter). FOLD_START_LOCAL_T is the inverse-eased peel
// localT at which the fold opens (peel uses easeOutCubic, so position-space overlap d maps
// to time-space 1 − d^(1/3)). FOLD_PEEL_OVERLAP = 0 exactly restores the prior "settle in
// grid, then fold" behavior (FOLD_START_LOCAL_T = 1 → fold opens at peel completion).
// REVERT: set FOLD_PEEL_OVERLAP to 0.
const FOLD_PEEL_OVERLAP = 0.35;
const FOLD_START_LOCAL_T = 1 - (FOLD_PEEL_OVERLAP ** (1 / 3));
// Progress at which the sphere is fully formed and the zoom hasn't started yet
// (sphereFormT=1, zoomT=0) — the canonical "interactive globe" scroll position keyboard
// focus snaps to. Mirrors the foldLast computation in computeFrame (single source): the
// LAST card's fold finish = (latest fold-start arcT → progress) + PROGRESS_FOLD_DUR. With
// FOLD_PEEL_OVERLAP = 0 the min() resolves to PROGRESS_GRID_ARC_END (the old value).
const SPHERE_FORMED_PROGRESS = Math.max(
  0,
  (PROGRESS_GRID_ARC_START
    + Math.min(1, GRID_PEEL_STAGGER + FOLD_START_LOCAL_T * (1 - GRID_PEEL_STAGGER))
      * (PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START)
    - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END,
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

// Reduced motion: the formed desktop globe is sized to ~93% of the viewport height
// (immersive framing inherited from the scroll experience), so its top/bottom cards
// bleed off screen. Under RM the globe is static, so shrink the sphere group on desktop
// (md) to bring the whole ball into view. sm renders at ~49% height already — left at 1.
const RM_GLOBE_SCALE_MD = 0.9;

// ── Grid peel / fold ─────────────────────────────────────────────────────────
const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width (computed per layout)
// (GRID_PEEL_STAGGER + the FOLD_PEEL_OVERLAP fold-overlap knobs live in the phase-timeline
// block above — the fold window derives from them.)
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
const SCROLL_VEL_MAX = 14; // px/frame scroll speed that saturates motion trail at full strength
const SCROLL_VEL_DEADBAND = 7; // px/frame below this = Lenis settle noise → no CA (anti-shimmer)
const CA_PX_MAX = 4; // max vertical pixel shift for global canvas SVG filter (Option C)

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
// A 60° FOV card fills the viewport height at ~0.87 card-heights of depth. The fade
// completes well above that (END = 1.6) so a near card vanishes while it's still
// comfortably smaller than the frame — otherwise a large, faint, dispersing card reads
// as background haze rather than a foreground card streaking past the lens. Both
// thresholds sit well inside the resting interactive distance (nearest card depth ≈
// CAM_Z_SPHERE − SPHERE_R ≈ 4–5 card-heights), so the steady globe + the approach are
// untouched — the fade only engages mid zoom-through.
const NEAR_FADE_START = 2.5; // begin fading when card depth < 2.5 card-heights
const NEAR_FADE_END = 1.6; // fully transparent when card depth < 1.6 card-heights

// ── Sphere-drag warp (all breakpoints) ───────────────────────────────────────
// Hybrid intensity: a baseline while actively dragging, plus a velocity-driven
// burst that decays naturally with dragVel via DRAG_FRICTION after release.
// Applied to ALL sphere cards (front + back) using each card's own center (0.5, 0.5).
const SPHERE_DRAG_WARP_BASELINE = 0.05; // constant while isDragging
const SPHERE_DRAG_WARP_VEL = 3.5; // multiplier on drag-speed (px/frame in world units)
const SPHERE_DRAG_WARP_MAX = 0.25; // cap on combined value

// ── "Click & Drag" hint text (WebGL plane behind the sphere) ─────────────────
// A text plane sits behind the back of the sphere (Z = −(SPHERE_R + gap)) inside
// sphereGroup, so it rotates with the globe. It warps in during the fold, settles to a
// faint resting opacity, fades out on zoom, and warps/dissolves away permanently on the
// user's FIRST drag (textExitProgress, 0→1, resets only when the section scrolls out of
// the interactive range). Shows on all devices. Tuning constants (world units / 0–1 eases):
const TEXT_BEHIND_GAP = 15; // world units behind the sphere's back surface
const TEXT_WARP_ENTER_MAX = 4.50; // uWarp at entrance — barrel distortion on the fill plane
const TEXT_SCALE_ENTER = 1.0; // plane stays viewport-sized; warp handles the abstract look
const TEXT_APPEAR_START = 0.10; // sphereFormT before the text starts appearing (~10% into fold)
const TEXT_OPACITY_PEAK = 0.15; // opacity at peak fade-in (visible during the chaos)
const TEXT_OPACITY_RESTING = 0.06; // settled opacity once the sphere is formed (matches Figma)
const TEXT_CA_DIR_STRENGTH = 0.05; // uMotionDir strength for drag CA on the text
const TEXT_CA_WARP_MUL = 1.5; // warp-driven CA boost (lingers as warp decays)
const TEXT_DRAG_WARP_MUL = 3.0; // text drag-warp vs sphere cards — more violent
const TEXT_WARP_OVERFLOW = 0.6; // extra mesh scale per warp unit — letterforms bleed off-screen
// The custom cursor rides the same textExitProgress signal as the WebGL hint, in two
// steps: at CURSOR_HINT_DISMISS_T the "Click & Drag" label fades out, and at the later
// CURSOR_RETIRE_T the whole cursor does too and the system cursor takes back over
// (see cursor.js). Both reset with textExitProgress on scroll-out.
const CURSOR_HINT_DISMISS_T = 0.12;
const CURSOR_RETIRE_T = 0.55;

// ── Modal-nav reactivity nudge ───────────────────────────────────────────────
// A spring that rotates the sphere partway toward the newly-shown card's slot so it
// acknowledges prev/next nav. Scales with angular distance (capped); slight
// underdamping gives a bouncy settle. The modal (modal.js) triggers it via the
// injected requestNavNudge → triggerModalNavNudge here; the spring physics live
// in updateSphereRotation. All other modal tuning lives in modal.js.
const NAV_NUDGE_FACTOR = 0.25; // 25% of full alignment angle — gentle
// Single cap on the minimal-arc rotation (one angle now, not per-axis Y/X: the nudge is a
// rotation about one arbitrary axis — the shortest arc bringing the card to front-center).
// 0.45 rad ≈ 26°, matching the old dominant Y cap so the feel is unchanged.
const NAV_NUDGE_MAX_ANGLE = 0.45;
const NAV_NUDGE_STIFF = 0.05; // softer pull
const NAV_NUDGE_DAMP = 0.86; // closer to critical damping → minimal overshoot

// ── Fibonacci sphere distribution ────────────────────────────────────────────
// Cards are spread by walking cos(polar) linearly — equal-area, so spacing stays even.
//
// POLAR_BAND (per-BP) truncates the distribution to a latitude band: cos(polar) is spread
// over [−band, +band] instead of the full [−1, +1], which chops the caps off and leaves a
// "sphere section" — a barrel/cylinder silhouette that still curves like a globe. band = 1
// is the untruncated sphere.
//
// WHY sm needs it: touch is yaw-only (see interaction.js's axis lock), and yaw can never
// change a card's latitude. A card's best-case obliquity at its ideal yaw is exactly
// |polar − 90°|, so polar-cap cards are permanently edge-on however much the user spins —
// at band = 1 the top/bottom cards sit at 90°/66° oblique and are effectively unseeable
// (3 of 24 on sm). Truncating to band = 0.7 caps worst-case obliquity at 44°, so every
// card becomes reachable and legible with yaw alone. Desktop keeps band = 1: free
// rotation there can pitch any card to face the camera, so nothing is unreachable.
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
function fibSpherePos(i, total, radius, band = 1) {
  // Scale the original full-sphere expression rather than re-deriving the spread, so
  // band = 1 reproduces the previous positions EXACTLY (bit-for-bit) — desktop is unchanged.
  const cosPolar = band * (1 - (2 * i) / total);
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, cosPolar)));
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
function createGlobeGalleryRuntime(authoredCards, hintText, root, gid, labels, reducedMotion) {
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

  // Resolve a band's static cfg into the active profile: derives N_TOTAL from the
  // authored card count, the sphere card width + fold distance, and the dense-arc
  // cluster size. Pure — returns a frozen object assigned to `bp`.
  function resolveBpProfile(name, cfg) {
    // N_TOTAL follows the authored card count, capped only where the band sets a hard
    // N_MAX (sm: 24 — see BREAKPOINTS). md is uncapped, so authoring 50 cards puts all
    // 50 on the sphere and the arc; the grid phase absorbs the surplus in extra
    // off-screen columns (computeGridLayout keeps its 9×5 nominal framing).
    const nTotal = cfg.N_MAX > 0
      ? Math.min(CARD_CONTENT.length, cfg.N_MAX)
      : CARD_CONTENT.length;
    if (cfg.N_MAX > 0 && CARD_CONTENT.length > cfg.N_MAX) {
      window.lana?.log?.(
        `globe-gallery: ${CARD_CONTENT.length} cards authored, rendering the first ${cfg.N_MAX} at breakpoint "${name}"`,
        { tags: 'globe-gallery', severity: 'info' },
      );
    }
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
      POLAR_BAND: cfg.POLAR_BAND,
      CARD_FACE_CAMERA: cfg.CARD_FACE_CAMERA,
      SPHERE_AREA_NORM: cfg.SPHERE_AREA_NORM,
      CARD_ROLL_JITTER: cfg.CARD_ROLL_JITTER,
      // Dense-arc cluster as a share of the actual card count, so the clustered:spread
      // ratio is count-independent. Clamped below nTotal-1 so the spread region
      // (fanT > ARC_DENSE_SPLIT) always keeps at least one card.
      ARC_DENSE_COUNT: Math.min(
        Math.round(cfg.ARC_DENSE_FRACTION * nTotal),
        Math.max(0, nTotal - 1),
      ),
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

  const drag = { isDragging: false, velX: 0, velY: 0 };
  let tickerAdded = false;
  let sphereDragWarp = 0;
  let cameraInsideSphere = false;
  // "Click & Drag" hint text: the mesh (built async after fonts load, so null until then)
  // and the one-way exit progress (0→1, accumulated on first drag; reset on scroll-out).
  let textMesh = null;
  let textExitProgress = 0;

  // ── Per-card sphere-rotation state (THREE objects) ─────────────────────────
  // The sphere drag rotation is applied MANUALLY to each card in the sphere/fold blocks
  // of tick() — sphereGroup.rotation is kept at identity so cards in non-sphere phases
  // (arc/grid) aren't transformed by stale drag rotation. sphereRotQuat is shared by
  // reference into modal.js (its closing animation reads the live rotation), so it's
  // created eagerly — the reference is stable.
  //
  // FREE ROTATION (trackball). The orientation is a single ACCUMULATED QUATERNION, not a
  // pitch/yaw Euler pair. Each frame's drag deltas are applied as world-axis rotations
  // PREMULTIPLIED onto the state (see updateSphereRotation): premultiplying by a world
  // axis means "drag right" is always the screen's horizontal axis no matter how far the
  // globe has been tumbled, so there is no local frame that can go degenerate.
  //
  // This replaced an 'XYZ' Euler pair (pitch clamped ±60° as the outer rotation, yaw
  // unclamped inside). That ordering existed solely to dodge a gimbal flip — with 'YXZ'
  // (unclamped yaw outside) the local pitch axis's world-X component goes 0 at 90° of yaw
  // (vertical drag does nothing) and −1 at 180° (drag down tilts up). Quaternion
  // accumulation has no such failure: response to a vertical drag is flat at every
  // orientation, and pitch passes through ±90° and beyond without a limit.
  //
  // TRADEOFF — roll becomes PATH-DEPENDENT. Pitch and yaw rotations do not commute, and
  // their commutator is a ROLL term (order ε² per frame, integrated along the drag path),
  // so curved drags accumulate tilt the user never asked for: one circular drag builds ~26°,
  // three build ~67°, and it does not self-cancel.
  //
  // Be precise about what changed: the OLD clamped-Euler scheme ALSO produced roll — the
  // screen-horizontal axis picks up a y-component of sin(yaw)·sin(pitch), so pitch 45° +
  // yaw 45° gave 30° of roll, well inside the clamp. What the old scheme gave was roll that
  // was BOUNDED and NON-HYSTERETIC: a pure function of the current (pitch, yaw), returning
  // to exactly 0 whenever pitch did, bounded by |roll| ≤ |pitch| ≤ 60°. So what we gave up
  // is SELF-CORRECTION, not the absence of roll — dragging back to horizontal no longer
  // levels the globe. Accumulated roll clears only on scroll-out (identity() below).
  //
  // CURRENT DECISION (open): ship pure trackball; the drift has not been judged on a real
  // device. If it proves unacceptable, prefer a spring-to-upright on release over reverting
  // to Euler — see the three options in README.md (Behavior notes → Free rotation).
  // The quaternion is the SOLE representation — there is no longer a companion Euler
  // (every consumer takes the quat directly, via `.applyQuaternion` / `.copy`).
  const sphereRotQuat = new THREE.Quaternion();
  // Scratch for building each frame's incremental world-axis delta.
  const dragDeltaQuat = new THREE.Quaternion();
  const WORLD_X = new THREE.Vector3(1, 0, 0);
  const WORLD_Y = new THREE.Vector3(0, 1, 0);
  // Apply one world-axis increment to the accumulated orientation. Premultiply (not
  // multiply) so the axis is interpreted in WORLD space — post-multiplying would rotate
  // about the sphere's own tumbled local axis, which is the drift-prone behavior.
  const applySphereRotDelta = (axis, angle) => {
    if (angle === 0) return;
    dragDeltaQuat.setFromAxisAngle(axis, angle);
    sphereRotQuat.premultiply(dragDeltaQuat);
  };
  // Maintain the unit-length invariant. Repeated quaternion products drift off the unit
  // sphere, so normalize every frame (cheap; prevents cumulative scale error from leaking
  // into card transforms over a long session).
  const refreshSphereRotQuat = () => {
    sphereRotQuat.normalize();
  };
  const foldRotQuat = new THREE.Quaternion();
  // Scratch quat/euler for the fold's residual peel-spin (reused per card, per frame —
  // see placeFoldingCard). Stable references, never retained.
  const stageQuat = new THREE.Quaternion();
  const stageEuler = new THREE.Euler(0, 0, 0, 'XYZ');
  const tmpVec3 = new THREE.Vector3();

  // Modal-nav "reactivity nudge": when user navigates prev/next within the modal, spring
  // the sphere partway toward facing the new card's slot. Sphere visibly rotates behind
  // the blur to acknowledge the navigation. Magnitude scales with angular distance to the
  // new card's actual position, so a close neighbor gives a small nudge and a
  // back-of-sphere card gives a bigger one (capped). Slight overshoot + decay for a
  // "bouncy" feel.
  //
  // Under free rotation the spring runs on a single SLERP PARAMETER (navNudgeT, 0→1)
  // between two captured orientations rather than on two Euler scalars — the geodesic
  // between them is the shortest arc, so the nudge can't inject roll of its own.
  let navNudgeActive = false;
  let navNudgeT = 1; // 0 = at nudge start orientation, 1 = at target
  let navNudgeVel = 0; // tuning consts (NAV_NUDGE_*) are at module scope
  const navNudgeStartQuat = new THREE.Quaternion();
  const navNudgeTargetQuat = new THREE.Quaternion();
  // Scratch for the minimal-arc alignment rotation (rebuilt per nudge request).
  const navNudgeAlignQuat = new THREE.Quaternion();
  // Scratch for applyCardFacing (reused per card, per frame — never retained).
  const cardNormal = new THREE.Vector3();
  const facingTarget = new THREE.Vector3();
  const facingAlign = new THREE.Quaternion();
  const facingPartial = new THREE.Quaternion();
  // Front-center view direction (camera looks down −Z, so the visible pole is +Z) and a
  // never-mutated identity to slerp the nudge magnitude out of.
  const FRONT_CENTER_DIR = new THREE.Vector3(0, 0, 1);
  const IDENTITY_QUAT = new THREE.Quaternion();

  let modal = null;
  let a11y = null;
  let interaction = null;
  let cursor = null;

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

  // ── Grid layout (9×5 nominal on md, sized to fit viewport) ────────────────
  // GRID_COLS/ROWS define the NOMINAL grid: it sets the card size, the gap, and the
  // centering origin. On md the card count is uncapped, so a set larger than
  // GRID_COLS*GRID_ROWS simply continues into further columns (col goes negative →
  // placed further left, off-screen). That's deliberate and needs no special-casing:
  // the md grid already overflows the viewport ~1.44× by design as a "more cards
  // beyond" cue, so the surplus lands in the same off-screen region. Critically,
  // totalW/totalH stay derived from the NOMINAL dims, never from the actual column
  // count — otherwise adding cards would re-center the grid and shift every card.
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
      POLAR_BAND, CARD_ROLL_JITTER, SPHERE_AREA_NORM,
    } = bp;
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);
    // Reduced motion (desktop): shrink the whole sphere so the static ball fits the
    // viewport instead of bleeding off top/bottom (see RM_GLOBE_SCALE_MD). Rotation is
    // per-card via quaternion, so a uniform group scale doesn't affect drag/spin.
    if (reducedMotion && bp.name !== 'sm') sphereGroup.scale.setScalar(RM_GLOBE_SCALE_MD);
    cards = [];

    for (let i = 0; i < N_TOTAL; i += 1) {
      // cardTexData is fully populated by the time buildCards() fires (called from onDone)
      const ctd = cardTexData[i] || {};
      const sphereScaleX = ctd.sphereScaleX !== undefined ? ctd.sphereScaleX : 1;
      const imgAspect = sphereScaleX * CARD_ASPECT;
      // Equal-area normalization (see SPHERE_AREA_NORM). On the sphere a card keeps its
      // image's native aspect, so width scales with sphereScaleX while height stays at
      // CARD_H_SPHERE — a 16:9 image ends up 2.67× the AREA of a 2:3 one, which is what
      // made the sphere read as crowded in places and empty in others. Scaling BOTH axes
      // by sphereScaleX^-norm equalizes area at norm = 0.5 (area ∝ scaleX·scaleY, so
      // scaleX·scaleY = ssx·ssx^-1 = 1) and leaves aspect untouched, so the image is
      // never distorted. norm = 0 restores the previous native-size behavior exactly.
      const areaNorm = SPHERE_AREA_NORM
        ? sphereScaleX ** -SPHERE_AREA_NORM
        : 1;
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
      const sp = fibSpherePos(i, N_TOTAL, SPHERE_R, POLAR_BAND);

      // Sphere orientation: face center + random z-rotation (jitter is per-BP — sm uses a
      // smaller spread, see CARD_ROLL_JITTER).
      const m = new THREE.Matrix4()
        .lookAt(sp, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
      const sq = new THREE.Quaternion().setFromRotationMatrix(m);
      const rz = (Math.random() - 0.5) * CARD_ROLL_JITTER;
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
        // Final sphere-phase scale factors (equal-area normalization already folded in —
        // see areaNorm above). sphereScaleX is the RAW aspect stretch, kept because the
        // grid/arc phases and the modal size their planes from it; sphereScale{X,Y} are
        // what the sphere/fold branches apply. With SPHERE_AREA_NORM = 0 these are
        // exactly (sphereScaleX, 1) — the previous behavior.
        sphereScaleX,
        sphereScaleSX: sphereScaleX * areaNorm,
        sphereScaleSY: areaNorm,
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

  // World-space size of the hint-text plane: sized to fill the camera frustum at the
  // text's resting depth (camera ↔ text-behind-sphere distance), so at warp=0 the
  // canvas's 0.10–0.90 inset spans 80% of the viewport. Uses camera.aspect (square in RM)
  // so the plane never exceeds the frustum width and texture pixels stay square.
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

  // Build (or rebuild) text plane and add it to sphereGroup. Async: waits
  // for fonts so the canvas renders in Adobe Clean, not a fallback.
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

  // Drag + click + hover live in the interaction module (src/interaction.js),
  // created below once the modal exists. sphereFormT is computed inside tick();
  // cache it here so the interaction module's click/hover handlers (which fire
  // between ticks) know whether the sphere is in the clickable state — they read
  // it via the getSphereFormT getter injected into createInteraction.
  let sphereFormTAtLastTick = 0;

  // ── Card facing — turns cards partway from radial-outward toward the camera ──
  // Fixes the edge-on "sliver" cards at the left/right limb. A card faces radially
  // outward, so its obliquity to the camera equals its angular distance from
  // front-center: at the limb (90°) it renders as a line. POLAR_BAND only addressed the
  // LATITUDE component of that; this addresses the azimuthal component, which is
  // intrinsic to a sphere and unfixable by redistribution.
  //
  // MUST be per-frame, not baked into card.sphereQuat at build time: the sphere rotates,
  // so a baked tilt rotates with it and stops pointing at the camera — and since sm is
  // yaw-only, every card cycles through the limb.
  //
  // The alignment target is sign(n.z) × view direction, NOT the view direction itself: a
  // uniform blend toward +Z would rotate a BACK-hemisphere card (normal ≈ −Z) to
  // perpendicular, turning the fix into the very sliver it removes. Aligning each card
  // toward whichever pole it already faces keeps back cards fully facing away (visible
  // from behind; CARD_FRAG mirrors uv.x for back faces), and preserves the sphere read.
  //
  // k = 0 is a true sphere (no-op, so md pays nothing but a cheap early return).
  // `amount` (default 1) scales the effect — the fold branch passes its fdE so the tilt
  // eases in as the card lands, arriving continuous with the sphere branch.
  // Operates on a THREE.Quaternion IN PLACE, so it serves both the per-frame mesh writes
  // here and modal.js's close-animation target (injected as applySphereFacing).
  function applySphereFacing(quat, amount = 1) {
    const k = bp.CARD_FACE_CAMERA * amount;
    if (!k) return;
    // Card's current outward normal = its local +Z under this orientation.
    cardNormal.set(0, 0, 1).applyQuaternion(quat);
    facingTarget.set(0, 0, cardNormal.z < 0 ? -1 : 1);
    facingAlign.setFromUnitVectors(cardNormal, facingTarget);
    // Partial rotation toward that target, then compose onto the orientation.
    facingPartial.copy(IDENTITY_QUAT).slerp(facingAlign, k);
    quat.premultiply(facingPartial);
  }

  const applyCardFacing = (mesh, amount = 1) => applySphereFacing(mesh.quaternion, amount);

  // Set a card's local transform to its canonical sphere slot with the current
  // sphere-drag rotation baked in. Used by reparent sites so there's no one-frame
  // flash of an unrotated card before tick()'s sphere block re-applies rotation.
  function snapCardToSphereSlot(card) {
    if (!card || !card.mesh) return;
    const hasRot = Math.abs(sphereRotQuat.w) < 0.999999; // not identity
    if (hasRot) {
      refreshSphereRotQuat();
      card.mesh.position.copy(card.spherePos).applyQuaternion(sphereRotQuat);
      card.mesh.quaternion.copy(sphereRotQuat).multiply(card.sphereQuat);
    } else {
      card.mesh.position.copy(card.spherePos);
      card.mesh.quaternion.copy(card.sphereQuat);
    }
    // Match placeSphereCard's facing tilt, else the reparented card flashes at the
    // un-tilted orientation for one frame — the exact flash this function exists to avoid.
    applyCardFacing(card.mesh);
    card.mesh.scale.set(card.sphereScaleSX, card.sphereScaleSY, 1);
  }

  // Modal-nav reactivity: compute the spring target that will rotate the sphere
  // partway toward facing the new card's slot, then activate the spring. Injected
  // into modal.js as requestNavNudge and called on each prev/next nav (arrow or swipe).
  // Under free rotation this is the MINIMAL ARC: one rotation, about the single axis that
  // carries the card's current world direction toward front-center (+Z). setFromUnitVectors
  // gives exactly that (shortest great-circle path), which is both simpler and strictly
  // more correct than the old two-Euler approximation — whose own comment conceded that Y
  // and X rotations don't commute. It also can't inject roll: the rotation axis is
  // perpendicular to both directions, so no component is spent twisting about the view.
  function triggerModalNavNudge(newIdx) {
    if (!cards[newIdx]) return;
    const newCard = cards[newIdx];
    // Current world direction of the new card's slot (unit), under the live orientation.
    const from = tmpVec3.copy(newCard.spherePos).applyQuaternion(sphereRotQuat).normalize();
    // Rotation carrying that direction to front-center. Degenerate when the card is
    // already at front-center (from ≈ +Z) — setFromUnitVectors handles the parallel and
    // antiparallel cases, and a near-zero angle simply produces a no-op nudge.
    navNudgeAlignQuat.setFromUnitVectors(from, FRONT_CENTER_DIR);
    // Scale to a gentle fraction of full alignment, capped. Both are applied to the ANGLE
    // (via slerp from identity) rather than to the quaternion components, so the axis is
    // preserved and only the magnitude changes.
    const fullAngle = 2 * Math.acos(Math.min(1, Math.abs(navNudgeAlignQuat.w)));
    const wantAngle = Math.min(NAV_NUDGE_MAX_ANGLE, fullAngle * NAV_NUDGE_FACTOR);
    // fullAngle ≈ 0 → card already centered, nothing to acknowledge.
    if (fullAngle < 1e-4) return;
    navNudgeStartQuat.copy(sphereRotQuat);
    navNudgeTargetQuat
      .copy(IDENTITY_QUAT)
      .slerp(navNudgeAlignQuat, wantAngle / fullAngle)
      .multiply(sphereRotQuat);
    navNudgeT = 0;
    navNudgeVel = 0;
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
  // shared sphereRotQuat object + the snapToSphereSlot / requestNavNudge
  // callbacks (which keep the orientation + nav-nudge spring in core).
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
    sphereRotQuat,
    snapToSphereSlot: snapCardToSphereSlot,
    applySphereFacing,
    requestNavNudge: triggerModalNavNudge,
    applyMotionCA,
  });

  // Keyboard spin: Left/Right arrows on the focused globe widget call this. Normal
  // motion injects a velocity impulse into the shared drag.velX so the existing
  // friction/inertia in updateSphereRotation gives a natural eased flick (clamped to
  // MAX_VEL). Reduced motion steps the orientation directly by a fixed yaw angle — a
  // discrete reposition with no momentum/auto-rotate (auto-spin is also off in that mode).
  // Keyboard spin is yaw-only, so it never accumulates roll.
  function spinGlobe(dir) {
    if (reducedMotion) {
      applySphereRotDelta(WORLD_Y, dir * KEY_SPIN_STEP);
      refreshSphereRotQuat();
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

  // Open a card + retire the "Click & Drag" hint. Opening a card is a stronger "I get
  // it" signal than a spin, so textExitProgress goes straight to 1 — past both cursor
  // thresholds, so the hint stays gone and the cursor is retired once the modal closes.
  const openModalAndDismissHint = (idx, x, y) => {
    textExitProgress = 1;
    modal.open(idx, x, y);
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
    openModal: () => openModalAndDismissHint(0, W / 2, H / 2),
    onFocus: snapToInteractive,
    galleryLabel: labels.galleryLabel,
    galleryInstructions: labels.galleryInstructions,
    gid,
  });

  // Pointer interaction (drag-to-spin, click → modal, hover). Owns its listeners +
  // raycaster; setup(canvas)/teardown() are called from initRuntime/destroy. Reads
  // live runtime state through getters; shares drag velocity via the `drag` object.
  // Desktop custom cursor (no-op on touch). Created before interaction so its
  // isActive() can gate interaction's hover cursor writes (the two share the canvas).
  cursor = createCursor({
    getCanvas: () => (renderer ? renderer.domElement : null),
    getSphereInteractive: () => sphereFormTAtLastTick >= SPHERE_INTERACTIVE_T,
    getModalOpen: () => modal.getModalIdx() >= 0,
    getReducedMotion: () => reducedMotion,
    // The two-step exit off the shared hint signal (see the threshold constants).
    getHintDismissed: () => textExitProgress > CURSOR_HINT_DISMISS_T,
    getCursorRetired: () => textExitProgress > CURSOR_RETIRE_T,
    labelText: hintText || 'Click & Drag',
    drag,
  });

  interaction = createInteraction({
    getRenderer: () => renderer,
    getCamera: () => camera,
    getCards: () => cards,
    getModalIdx: () => modal.getModalIdx(),
    openModal: (idx, x, y) => openModalAndDismissHint(idx, x, y),
    getSphereFormT: () => sphereFormTAtLastTick,
    interactiveThreshold: SPHERE_INTERACTIVE_T,
    maxVel: MAX_VEL,
    drag,
    isCursorActive: () => cursor.isActive(),
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
    // First card (gpDelay≈0) starts folding when its peel reaches FOLD_START_LOCAL_T·gpWin
    // (with FOLD_PEEL_OVERLAP = 0 → FOLD_START_LOCAL_T = 1, i.e. peel completion = the old
    // gpWin timing). foldLast (= SPHERE_FORMED_PROGRESS) tracks the latest card's finish.
    const foldFirstArcT = PROGRESS_GRID_ARC_START + FOLD_START_LOCAL_T * gpWin * arcRange;
    const foldFirst = Math.max(0, (foldFirstArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
    const foldLast = SPHERE_FORMED_PROGRESS;
    const sphereFormT = Math.max(0, Math.min(1, (progress - foldFirst) / (foldLast - foldFirst)));
    // Zoom-through starts the instant the sphere finishes forming (no interactive gap).
    // The pre-v3 zoom/tail pacing is preserved by the shorter runway height (see .css),
    // not by delaying the zoom start — v3's grid compression is removed from the total
    // scroll length rather than redistributed into a formed-but-static pause.
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
      foldSphDist: 0,
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
  // is applied) and renormalizes sphereRotQuat for this frame.
  //
  // sphereRotQuat accumulates from drag input while above the interactive
  // threshold. It is NOT written to sphereGroup.rotation — the rotation is
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
    // independent). Eases the orientation toward navNudgeTargetQuat (set by
    // triggerModalNavNudge). Slight underdamping gives a small overshoot + settle.
    //
    // Under free rotation this is a spring on the SLERP PARAMETER rather than on two
    // Euler scalars: navNudgeT runs 0→1 along the geodesic from the orientation at
    // nudge-request time to the target, so the nudge takes the shortest arc and can't
    // inject roll of its own (the old per-axis version fought the accumulated quat).
    if (navNudgeActive) {
      const nD = 1 - navNudgeT;
      navNudgeVel = (navNudgeVel + nD * NAV_NUDGE_STIFF) * NAV_NUDGE_DAMP;
      navNudgeT += navNudgeVel;
      sphereRotQuat.copy(navNudgeStartQuat).slerp(navNudgeTargetQuat, Math.min(1, navNudgeT));
      // Settle when the parameter is at the target AND velocity is essentially zero.
      if (Math.abs(nD) < 0.001 && Math.abs(navNudgeVel) < 0.001) {
        navNudgeActive = false;
        navNudgeVel = 0;
        navNudgeT = 1;
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
        // World-axis increments, premultiplied onto the accumulated orientation: yaw about
        // world Y (keeps auto-rotate a level turntable spin however the globe is tumbled),
        // pitch about world X (always the screen-horizontal axis). No pitch clamp — free
        // rotation, so cards can tumble past vertical and read upside down. That's the
        // honest result of the gesture; CARD_FRAG already handles back-facing fragments.
        applySphereRotDelta(WORLD_Y, drag.velX * dragDir);
        applySphereRotDelta(WORLD_X, drag.velY * dragDir);
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
      // The orientation is preserved while mid-scroll so a brief dip below and back
      // doesn't lose the user's accumulated rotation. Reset to identity only at the very
      // top of the section so a fresh entry into the sphere starts upright — this is also
      // the only thing that clears accumulated roll (see the free-rotation note above).
      // Warp eases (same rate as the interactive-zone branch) rather than snapping.
      drag.velX = 0;
      drag.velY = 0;
      sphereDragWarp += (0 - sphereDragWarp) * 0.20;
      if (Math.abs(sphereDragWarp) < 0.001) sphereDragWarp = 0;
      if (sphereFormT < 0.01) {
        sphereRotQuat.identity();
        navNudgeActive = false;
      }
    }

    // Fast-path flag so the rotation math can be skipped while the globe is exactly
    // upright. Compared against identity (w = ±1) rather than two zeroed scalars.
    const sphereRotActive = Math.abs(sphereRotQuat.w) < 0.999999;
    refreshSphereRotQuat();
    return sphereRotActive;
  }

  // Canvas visibility — instantly visible once the section approaches; no opacity
  // fade (the arc's own rotation/slide-up handles the "appearing" feel).
  function updateCanvasVisibility(frame) {
    const { lenisY, zoomT } = frame;
    const canvas = renderer.domElement;
    // Reduced motion lays the block out as normal document flow: the canvas is
    // absolute inside the (now static) .globe-gallery-world (set in initRuntime), so
    // it scrolls away with the page and clips naturally instead of pinning to the
    // viewport. No scroll-based gating is needed — just reveal it once.
    if (reducedMotion) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
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
    // Reduced motion: the quote flows normally below the globe and is statically
    // visible (CSS forces opacity:1, no sticky/scale reveal) — no JS toggling.
    if (reducedMotion) return;
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
    // Expose for the hint-text stage (its plane scale tracks the live camera↔sphere distance).
    frame.foldSphDist = foldSphDist;
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
      mesh.position.copy(card.spherePos).applyQuaternion(sphereRotQuat);
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
    mesh.material.opacity = proxFade;
    mesh.material.uniforms.uDissolve.value = 1 - proxFade;
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
  // Lerps FROM the card's live `stage` transform (the arc→grid peel position, which
  // collapses to the grid slot once gpE >= 1) TO its sphere slot by fdE. Folding from the
  // live position — not a hard-coded gridPos — is what lets the fold open mid-peel
  // (FOLD_PEEL_OVERLAP > 0) without a snap.
  function placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame) {
    const { sphereRotActive } = frame;
    mesh.visible = true;
    // Sphere endpoint is FULLY rotated by the current drag; the lerp itself handles the
    // unwind (at fdE=0 the card is at its stage position, at fdE=1 the fully-rotated sphere
    // position; in between a straight-line lerp between those world points). Cards with
    // fdE = 0 fall through to the grid/arc branches where no drag rotation is applied.
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
    // Orientation slerps along the stable UPRIGHT-grid → sphere arc (gridQuat → sphereQuat),
    // NOT from the live peel orientation: mid-overlap that still carries a large in-plane Z
    // spin from a steep arc entry, and slerping from it swings the card's face through the
    // camera plane — a brief mirrored-back "flip" with the DoubleSide material. The residual
    // peel spin that hasn't unwound yet (stage.rotZ − gridTilt, → 0 as the peel completes) is
    // instead reapplied about the card's LOCAL Z (its normal) so it spins in-plane like the
    // peel. At fdE=0 this equals Euler(0,0,stage.rotZ) (continuous with the peel branch); at
    // peel completion residual=0, so it equals the plain gridQuat→sphereQuat slerp.
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
    // Blend the camera-facing tilt in over the fold (scaled by fdE) so a card arrives at
    // exactly the orientation placeSphereCard will give it. Without this the fold would
    // land on the un-tilted sphereQuat and the card would snap the instant fdE hits 1.
    applyCardFacing(mesh, fdE);
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

  // Compute a card's live "stage" transform: its position on the arc→grid continuum at the
  // current peel ease gpE (0 = on the arc, 1 = fully in the grid slot). Returned as
  // { slot, x, y, z, scale, rotZ }. Extracted from the old arc branch so it can serve BOTH
  // the arc/peel render AND the ORIGIN of the fold lerp (placeFoldingCard) — at gpE >= 1 it
  // collapses exactly to the grid slot, so a fold that opens mid-peel is continuous.
  function computeCardStage(card, i, gpE, frame) {
    const { arcPanT, entryRot, entryYOffset, arcScale, sphGroupZ } = frame;
    const { N_VISIBLE, ARC_DENSE_COUNT } = bp;
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

    // peelStartRot: reset while purely on the arc (so the next peel re-captures cleanly);
    // otherwise snapshot the rotation on the first peel frame, normalized to within ±π of
    // gridTilt for the shortest angular path. A direct z-angle lerp avoids the quaternion
    // slerp hemisphere flip that snaps when webglRot wraps across atan2's discontinuity.
    if (gpE <= 0) {
      card.peelStartRot = null;
    } else if (card.peelStartRot == null) {
      let startRot = webglRot;
      while (startRot - card.gridTilt > Math.PI) startRot -= 2 * Math.PI;
      while (startRot - card.gridTilt < -Math.PI) startRot += 2 * Math.PI;
      card.peelStartRot = startRot;
    }

    return {
      slot,
      x: lerpN(wp.x, card.gridPos.x, gpE),
      y: lerpN(arcY, card.gridPos.y, gpE),
      z: lerpN(-sphGroupZ, card.gridPos.z - sphGroupZ, gpE),
      scale: lerpN(arcScale, card.gridScale, gpE),
      rotZ: card.peelStartRot == null
        ? webglRot
        : card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE,
    };
  }

  // ── Branch: arc phase — waiting to peel, or actively peeling arc→grid ──
  // Renders the live `stage` transform directly; render order + motion-CA strength differ
  // between the pure-arc (gpE <= 0) and peeling (gpE > 0) sub-phases.
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

    // ── Grid → sphere fold: begins when this card's peel reaches FOLD_START_LOCAL_T ──
    // (FOLD_PEEL_OVERLAP = 0 → that's gpLocalT = 1, i.e. fully landed in grid, the original
    // "settle then fold" timing). Convert the fold-start arc-pan time back to progress for
    // the per-card fold timer; the gate is on the raw peel localT, not the eased gpE.
    const foldStartFormT = gpDelay + FOLD_START_LOCAL_T * gpWin;
    const foldStartArcT = PROGRESS_GRID_ARC_START
      + Math.min(1, foldStartFormT) * (PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START);
    const foldStartProg = Math.max(0, (foldStartArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
    const fdLocalT = Math.max(0, Math.min(1, (progress - foldStartProg) / PROGRESS_FOLD_DUR));
    const fdE = gpLocalT >= FOLD_START_LOCAL_T ? easeInOutCubic(fdLocalT) : 0;

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

    // Near-camera dissolve resets to 0 every frame; placeSphereCard raises it for cards
    // close to the lens. Reset here (not in each branch) so a card leaving the sphere
    // phase can't carry a stale dissolve value into the grid/fold/arc branches.
    mesh.material.uniforms.uDissolve.value = 0;

    // Capture position BEFORE this frame's section block updates it — delta drives motion CA.
    const prevMeshX = mesh.position.x;
    const prevMeshY = mesh.position.y;

    // Exactly one phase branch runs per card, in order of latest phase first.
    // Sphere + settled-grid need no arc kinematics, so they skip the stage compute.
    if (fdE >= 1) { placeSphereCard(card, mesh, cardCA, frame); return; }
    if (gpE >= 1 && fdE === 0) {
      placeGridCard(card, mesh, i, prevMeshX, prevMeshY, frame);
      return;
    }
    // Arc, peel, and fold-from-stage all need the card's live arc→grid stage transform —
    // the fold lerps FROM it (so a fold that opens mid-peel is positionally continuous).
    const stage = computeCardStage(card, i, gpE, frame);
    if (fdE > 0) { placeFoldingCard(card, mesh, fdE, stage, prevMeshX, prevMeshY, frame); return; }
    placeArcCard(card, mesh, i, gpE, stage, prevMeshX, prevMeshY);
  }

  // Position every card for this frame: run the per-card dispatcher over the shared
  // `frame` context (built by computeFrame, with the producer stages' results already
  // written back). The modal-active card + swipe-neighbors are skipped inside it.
  function updateCardTransforms(frame) {
    for (let i = 0; i < bp.N_TOTAL; i += 1) updateCardTransform(i, frame);
  }

  // ── Stage: hint-exit signal ──
  // Owns textExitProgress (0→1), the one-way "the user gets it" signal driving both the
  // WebGL hint text's dissolve and the custom cursor's two-step retirement. Kept out of
  // updateClickDragText because that stage early-returns before the interactive range —
  // exactly the scroll-out that has to reset the signal.
  function updateHintExitProgress(frame) {
    const { sphereFormT } = frame;
    // Reset on scroll-out of the interactive range (fresh on re-entry).
    if (sphereFormT < SPHERE_INTERACTIVE_T) {
      textExitProgress = 0;
      return;
    }
    if (reducedMotion || !drag.isDragging || textExitProgress >= 1) return;
    // A vertical touch drag is the page's scroll gesture, not a globe drag (see
    // interaction.js's axis lock). drag.isDragging is still true through it, so without
    // this the hold-time term below would accrue during an ordinary mobile scroll and
    // retire the "Click & Drag" hint before the user had ever spun the globe.
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

  // ── Stage: "Click & Drag" hint text ──
  // Warps in during the fold, settles to a faint resting opacity, fades on zoom, and
  // warps/dissolves away permanently on the user's first drag (reading the
  // textExitProgress signal that updateHintExitProgress owns). Reads frame.foldSphDist
  // (updateSphereGroupDepth) + the live sphereDragWarp (updateSphereRotation), so it must
  // run after both. No-op until the async font build assigns textMesh.
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
    if (sphereFormT <= TEXT_APPEAR_START) {
      // Hidden until the fold is underway.
      textMesh.visible = false;
      textMesh.scale.setScalar(TEXT_SCALE_ENTER);
      return;
    }

    const { CAM_Z_SPHERE, SPHERE_R } = bp;
    // Remap so 0→1 covers [TEXT_APPEAR_START, 1].
    const sfRaw = (sphereFormT - TEXT_APPEAR_START) / (1 - TEXT_APPEAR_START);
    const sfT = Math.max(0, Math.min(1, sfRaw));
    const txtT = easeOutCubic(sfT);
    // Warp eases out (power-2) — strong at entrance, gone at rest.
    const txtWarpEntrance = lerpN(TEXT_WARP_ENTER_MAX, 0, sfT * sfT);
    // Scale: fill the viewport at the current camera distance, plus overflow proportional to
    // total warp so letterforms bleed off-screen during entrance/drag.
    const restDist = CAM_Z_SPHERE + SPHERE_R + TEXT_BEHIND_GAP;
    const currDist = foldSphDist + SPHERE_R + TEXT_BEHIND_GAP;
    const warpTot = txtWarpEntrance + sphereDragWarp * TEXT_DRAG_WARP_MUL;
    textMesh.scale.setScalar(currDist / restDist + warpTot * TEXT_WARP_OVERFLOW);
    // Opacity settles peak→resting over the fold, then fades on zoom (no fade-in — the
    // warp/dissolve carries the entrance feel).
    const txtOp = lerpN(TEXT_OPACITY_PEAK, TEXT_OPACITY_RESTING, txtT)
      * (1 - Math.min(1, zoomT * 3));

    // textExitProgress is owned by updateHintExitProgress (an earlier stage) — read only here.
    textMesh.visible = txtOp > 0.001 && textExitProgress < 0.999;
    uniforms.uUVScale.value = 1.0;
    uniforms.uOpacity.value = txtOp;
    uniforms.uZoom.value = zoomT;
    uniforms.uExitP.value = textExitProgress;
    // Drag warp: entrance warp + multiplied drag burst — more violent than the sphere cards.
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

  // ── Per-frame tick — thin orchestrator ──────────────────────────────────────
  // Builds the per-frame `frame` context, then runs each stage in a fixed order,
  // writing producer results (activeCamera, sphereRotActive, sphGroupZ, foldSphDist) back
  // onto `frame` so later stages + the card loop read them. Stage ORDER matters and is
  // load-bearing in two ways: (1) a producer must run before its consumers
  // (updateActiveCamera sets cameraInsideSphere + camera.z, read by
  // updateSphereRotation + updateSphereGroupDepth; updateClickDragText reads foldSphDist
  // from updateSphereGroupDepth + the live sphereDragWarp from updateSphereRotation);
  // (2) modal.updateAnimation's closing branch reads sphereGroup.position from the PREVIOUS
  // frame and the live sphereRotQuat refreshed by updateSphereRotation THIS frame.
  // Keep it intact.
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
    updateHintExitProgress(frame); // owns textExitProgress — before its two consumers

    updateClickDragText(frame);
    cursor.update();
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

    // Reduced motion: take the canvas out of fixed viewport-pinning and into normal
    // flow (absolute within the static .globe-gallery-world) so the static globe
    // scrolls away naturally and the pull-quote follows below — see the --reduced CSS.
    // The top nudge drops the globe a touch below the section's top edge so it isn't
    // flush against the previous section; the world is grown symmetrically in CSS
    // (+2× this offset) so the sphere and the centred a11y widget stay aligned.
    if (reducedMotion) {
      canvas.style.position = 'absolute';
      canvas.style.top = '8vh';
    }

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
      // The hint-text plane size + canvas aspect track the viewport — rebuild on resize
      // (within-band; a band crossing already does a full destroy()+init()).
      if (textMesh) buildTextMesh();
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
    cursor.setup();

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
      buildTextMesh();
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
    // Custom cursor cleanup (removes its body-level DOM + mousemove listener). Runs while
    // renderer still exists so getCanvas() resolves to clear the canvas cursor + listeners.
    cursor.teardown();
    if (renderer) {
      renderer.domElement.style.filter = '';
      renderer.dispose();
      renderer.domElement.style.display = 'none';
    }
    cards = [];
    // Free the hint-text GPU resources + reset its exit progress before the scene teardown.
    disposeTextMesh();
    textExitProgress = 0;
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
    arcRegion, prevCard, nextCard, closeBtn, appsUsed,
    galleryTplRaw, galleryInstrRaw, cardTplRaw,
  ] = await replaceKeyArray(
    ['image-gallery-intro', 'previous-card', 'next-card', 'close', 'apps-used',
      'image-gallery-label', 'image-gallery-instructions', 'image-gallery-card-label'],
    getConfig(),
  );
  // replaceKey returns the de-hyphenated key (keyToStr: '-'→' ') when a placeholder is
  // absent from every sheet, so fall back to English there. The globe widget's accessible
  // NAME (image-gallery-label, tokenized with {{count}}) is kept separate from its
  // operating INSTRUCTIONS (image-gallery-instructions, read via aria-describedby) so a
  // screen reader announces a concise name on every focus and the how-to-drive-it once.
  // TODO: localize — the English strings below are the hardcoded fallbacks that render
  // until the image-gallery-* keys are finalized in the placeholders sheet (see TODO
  // above); once the sheet supplies them per locale these branches are never hit.
  const galleryTpl = galleryTplRaw.includes('{{count}}')
    ? galleryTplRaw
    : 'Interactive image gallery, {{count}} images';
  const galleryInstructions = galleryInstrRaw === 'image gallery instructions'
    ? 'Use the Left and Right arrow keys to rotate the globe, and Enter to browse the gallery.'
    : galleryInstrRaw;
  const cardTpl = cardTplRaw.includes('{{name}}')
    ? cardTplRaw
    : 'View photo by {{name}}, {{index}} of {{count}}';
  return {
    arcRegion,
    prevCard,
    nextCard,
    closeBtn,
    appsUsed,
    // Concise aria-label for the single globe widget (the screen-reader "what is this").
    // count is the live card total. The controls are described separately (below).
    galleryLabel: (count) => galleryTpl.replace('{{count}}', String(count)),
    // Operating instructions, wired as the widget's aria-describedby target in a11y.js.
    galleryInstructions,
    cardLabel: (name, index, count) => cardTpl
      .replace('{{name}}', name)
      .replace('{{index}}', String(index))
      .replace('{{count}}', String(count)),
  };
}

// ── Block entry point ────────────────────────────────────────────────────────
export default async function init(el) {
  // Reduced motion: render a STATIC, still-interactive globe instead of the scroll
  // choreography, laid out as plain document flow. The runtime pins the timeline to the
  // formed-sphere state (no arc/grid/fold/zoom), disables auto-spin, and snaps the modal
  // open/close — drag, arrow-spin, and click→open all still work. Instead of pinning a
  // fixed canvas, `--reduced` (see the CSS) makes the globe a static ~100vh section that
  // scrolls away naturally (canvas absolute in the static world, set in initRuntime),
  // followed by the pull-quote in normal flow — no runway, no sticky, no scroll gating.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) el.classList.add('globe-gallery--reduced');

  // Extract authored content BEFORE buildGlobeDom() wipes the block's children.
  // fragmentHref is captured here so it survives the DOM wipe.
  const { arcCopy, pullQuote, hintText, fragmentHref } = parseAuthoredContent(el);

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
  const runtime = createGlobeGalleryRuntime(cards, hintText, el, gid, labels, reducedMotion);
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
