// Scroll timeline: every phase constant, every threshold, and the per-frame clock derivation.
// Pure — no THREE, no DOM, no closure state. See README (Lifecycle timeline) for what each
// constant gates, the six clocks, and the frame contract.

import { easeOutCubic, easeOutSine } from './math.js';

// --- Phase constants (progress-space) ---

export const PROGRESS_PAN_END = 0.55;
export const PROGRESS_ARC_PREROLL = 0.30;
export const PROGRESS_GRID_ARC_START = 0.30;
export const PROGRESS_GRID_ARC_END = 0.60;
export const PROGRESS_FOLD_DUR = 0.25;
export const PROGRESS_ZOOM_END = 1.00;
export const GRID_ARC_RANGE = PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START;

export const GRID_PEEL_STAGGER = 0.20;
export const ARC_PEEL_JITTER = 0.40;
export const GRID_PEEL_WINDOW = 1.0 - GRID_PEEL_STAGGER;

export const FOLD_PEEL_OVERLAP = 0.35;
export const FOLD_START_LOCAL_T = 1 - (FOLD_PEEL_OVERLAP ** (1 / 3));

// Fold window ends: sphereFormT 0 and 1. cardFoldStartProgress(0) === FOLD_FIRST_PROGRESS.
export const FOLD_FIRST_PROGRESS = Math.max(
  0,
  (PROGRESS_GRID_ARC_START
    + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW * GRID_ARC_RANGE
    - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END,
);
export const SPHERE_FORMED_PROGRESS = Math.max(
  0,
  (PROGRESS_GRID_ARC_START
    + Math.min(1, GRID_PEEL_STAGGER + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW) * GRID_ARC_RANGE
    - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END,
) + PROGRESS_FOLD_DUR;
export const FOLD_WINDOW = SPHERE_FORMED_PROGRESS - FOLD_FIRST_PROGRESS;

// CSS owns these; only read when the custom property doesn't resolve. See README (Scroll model).
export const CSS_FALLBACK = {
  FORMATION_VH: 304,
  RUNWAY_VH: 520,
  PQ_PIN_FACTOR: 0.65,
};

export const PQ_APPEAR_LEAD = 0.03;

// --- Entry (raw-scroll space, before `progress` exists) ---

export const ENTRY_LEAD_VH = 0.4;
export const ENTRY_RAMP_VH = 1.05;
export const ARC_ENTRY_HOLD_T = 0.05;
export const ENTRY_ROT_MAX = 0.9;
export const ENTRY_SLIDE_H_FRAC = 0.30;
export const SLIDE_IN_PROGRESS = 0.07;

// --- Gates, each in its own clock's space ---

// sphereFormT
export const SPHERE_INTERACTIVE_T = 0.8;
export const DEPTH_SORT_FORM_T = 0.5;
export const SPHERE_ORIENT_RESET_T = 0.01;
export const TEXT_APPEAR_START = 0.10;

// arcCopyEntryT / fold-window fraction
export const ARC_COPY_IN_ENTRY_T = 0.336;
export const ARC_COPY_OUT_FORM_START = 0.20;
export const ARC_COPY_OUT_FORM_END = 0.90;

// zoomT
export const TEXT_ZOOM_FADE_RATE = 3;
export const CANVAS_HIDE_ZOOM_T = 0.95;
export const CURSOR_HINT_DISMISS_T = 0.12;
export const CURSOR_RETIRE_T = 0.55;
export const CURSOR_ZOOM_DISMISS_T = 0.38;
export const CURSOR_ZOOM_RETIRE_T = 0.40;

export const SCROLL_VEL_DEADBAND = 7; // px/frame — below this is Lenis settle noise

// --- Frame pacing (frame.dtScale rescales per-60fps-frame rates; clamped) ---

export const FRAME_MS = 1000 / 60;
export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;

// --- Derived (docs/tests, not per frame) ---

export const progressAtFormT = (t) => FOLD_FIRST_PROGRESS + t * FOLD_WINDOW;
export const progressAtZoomT = (t) => SPHERE_FORMED_PROGRESS
  + t * (PROGRESS_ZOOM_END - SPHERE_FORMED_PROGRESS);

export const ARC_COPY_OUT_START = progressAtFormT(ARC_COPY_OUT_FORM_START);
export const ARC_COPY_OUT_END = progressAtFormT(ARC_COPY_OUT_FORM_END);

// --- Frame ---

const clamp01 = (v) => (v > 0 ? Math.min(1, v) : 0); // NaN → 0

// Allocated once per runtime, mutated in place. Every field initialized here so the shape stays
// monomorphic; activeCamera and below are written by tick()'s producer stages.
export function createFrame() {
  return {
    lenisY: 0,
    scrollingDown: true,
    scrollVel: 0,
    dtScale: 1,
    progress: 0,
    arcCopyEntryT: 0,
    arcPanT: 0,
    gridFormT: 0,
    gpWin: GRID_PEEL_WINDOW,
    sphereFormT: 0,
    zoomT: 0,
    entryRot: ENTRY_ROT_MAX,
    entryYOffset: 0,
    arcScale: 1,
    activeCamera: null,
    sphereRotActive: false,
    sphGroupZ: 0,
    foldSphDist: 0,
  };
}

export function createFrameInput() {
  return {
    scrollY: 0,
    prevLenisY: 0,
    now: 0,
    prevNow: 0, // 0 = no previous frame (first tick / resume) → dtScale 1
    reducedMotion: false,
    blockDocTop: 0,
    blockHeight: 0,
    formPx: 0,
    viewportH: 0,
    arcScale: 1,
  };
}

// Derive every clock onto `frame`. No allocation; caller carries frame.lenisY back into
// input.prevLenisY.
export function deriveFrame(frame, input) {
  const { reducedMotion, blockDocTop, blockHeight, formPx, viewportH } = input;

  // Elapsed time as a multiple of a 60fps frame; the caller carries `now` into `prevNow`.
  const dtMs = input.prevNow ? input.now - input.prevNow : FRAME_MS;
  frame.dtScale = Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));

  // Reduced motion pins scroll input to the formed-sphere position; the pin cancels in `progress`
  // but canvas visibility still uses real scroll.
  const lenisY = reducedMotion ? blockDocTop + formPx : input.scrollY;
  frame.lenisY = lenisY;
  frame.scrollingDown = lenisY >= input.prevLenisY;
  const rawScrollVel = reducedMotion ? 0 : Math.abs(lenisY - input.prevLenisY);
  frame.scrollVel = rawScrollVel < SCROLL_VEL_DEADBAND ? 0 : rawScrollVel;

  const entryStart = blockDocTop - viewportH * ENTRY_LEAD_VH;
  const entryRange = Math.max(1, viewportH * ENTRY_RAMP_VH);
  const arcCopyEntryT = clamp01((lenisY - entryStart) / entryRange);
  frame.arcCopyEntryT = arcCopyEntryT;

  // Piecewise: formation over [0, formPx] (fixed length), zoom-through + quote over the rest.
  const rawScroll = lenisY - blockDocTop;
  const tailPx = Math.max(1, blockHeight - formPx);
  const progress = rawScroll <= formPx
    ? clamp01(rawScroll / Math.max(1, formPx)) * SPHERE_FORMED_PROGRESS
    : SPHERE_FORMED_PROGRESS
      + clamp01((rawScroll - formPx) / tailPx) * (1 - SPHERE_FORMED_PROGRESS);
  frame.progress = progress;

  const arcPanT = Math.min(1, progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL * arcCopyEntryT);
  frame.arcPanT = arcPanT;
  frame.gridFormT = clamp01((arcPanT - PROGRESS_GRID_ARC_START) / GRID_ARC_RANGE);
  frame.gpWin = GRID_PEEL_WINDOW;
  frame.sphereFormT = clamp01((progress - FOLD_FIRST_PROGRESS) / FOLD_WINDOW);
  frame.zoomT = clamp01(
    (progress - SPHERE_FORMED_PROGRESS) / (PROGRESS_ZOOM_END - SPHERE_FORMED_PROGRESS),
  );

  const slideT = Math.max(arcCopyEntryT, clamp01(progress / SLIDE_IN_PROGRESS));
  const arcEntryT = clamp01((arcCopyEntryT - ARC_ENTRY_HOLD_T) / (1 - ARC_ENTRY_HOLD_T));
  frame.entryRot = (1 - easeOutCubic(arcEntryT)) * ENTRY_ROT_MAX;
  frame.entryYOffset = (1 - easeOutSine(slideT)) * viewportH * ENTRY_SLIDE_H_FRAC;
  frame.arcScale = input.arcScale;

  return frame;
}

export function cardFoldStartProgress(gpDelay) {
  const foldStartFormT = gpDelay + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW;
  const foldStartArcT = PROGRESS_GRID_ARC_START + Math.min(1, foldStartFormT) * GRID_ARC_RANGE;
  return Math.max(0, (foldStartArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
}
