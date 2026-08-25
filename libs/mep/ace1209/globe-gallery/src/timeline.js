// Every phase constant, threshold, and the per-frame clock derivation.
// Pure — no THREE, no DOM, no closure state.

import { clamp01, easeOutCubic, lerpN } from './math.js';

export const PROGRESS_PAN_END = 0.55;
export const PROGRESS_ARC_PREROLL = 0.30;
export const PROGRESS_GRID_ARC_START = 0.30;
export const PROGRESS_GRID_ARC_END = 0.60;
export const PROGRESS_FOLD_DUR = 0.25;
export const PROGRESS_ZOOM_END = 1.00;
export const GRID_ARC_RANGE = PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START;

export const GRID_PEEL_STAGGER = 0.20;
export const GRID_PEEL_JITTER = 2 * GRID_PEEL_STAGGER;
export const GRID_PEEL_WINDOW = 1.0 - GRID_PEEL_STAGGER;

export const FOLD_PEEL_OVERLAP = 0.35;
export const FOLD_START_LOCAL_T = 1 - (FOLD_PEEL_OVERLAP ** (1 / 3));

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

// Entry: raw-scroll space, before `progress` exists.

export const ENTRY_RAMP_VH = 1.05;
export const ENTRY_ROT_MAX = 0.9;
export const ARC_ENTRY_STAGGER = 0.45;

// sphereFormT. One gate for everything that says "the globe is live": hover, click, drag,
// auto-rotate, desktop cursor, hint-plane entrance
export const SPHERE_INTERACTIVE_T = 0.94;
export const SPHERE_ORIENT_RESET_T = 0.01;
export const TEXT_APPEAR_START = 0.10;

export const ARC_COPY_IN_ENTRY_T = 0.336;
export const ARC_COPY_OUT_FORM_START = 0.20;
export const ARC_COPY_OUT_FORM_END = 0.90;

export const CANVAS_HIDE_MARGIN_T = 0.05;

export const HINT_DISMISS_T = 0.12; // hintDismissProgress at which the barrel hint retires

// frame.dtScale rescales per-60fps-frame rates; clamped.

export const FRAME_MS = 1000 / 60;
export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;

export const progressAtFormT = (t) => FOLD_FIRST_PROGRESS + t * FOLD_WINDOW;

// zoomT is a fraction of the ZOOM span; the CSS pin and hold ceiling reason in fractions of the
// whole tail. Identical only while PROGRESS_ZOOM_END is 1, so convert at the boundary.
export const ZOOM_TO_TAIL_T = (PROGRESS_ZOOM_END - SPHERE_FORMED_PROGRESS)
  / (1 - SPHERE_FORMED_PROGRESS);

export const ARC_COPY_OUT_START = progressAtFormT(ARC_COPY_OUT_FORM_START);
export const ARC_COPY_OUT_END = progressAtFormT(ARC_COPY_OUT_FORM_END);

// The zoom camera's world z at zoomT, and its inverse. An inverse pair: neither is derivable
// from the other at runtime, so they must be edited together — hence they live side by side.
// Break the pairing and pqAppearZoomT drifts silently, taking the controls, the canvas cursor,
// the canvas hide and the pull-quote reveal with it.
export function camZAtZoomT(t, camZSphere, camZEnd) {
  return lerpN(camZSphere, camZEnd, easeOutCubic(t));
}

export function zoomTAtCamZ(z, camZSphere, camZEnd) {
  const span = camZSphere - camZEnd;
  if (!(span > 0)) return 0;
  const eased = Math.min(1, Math.max(0, (camZSphere - z) / span));
  return 1 - ((1 - eased) ** (1 / 3));
}

// Allocated once per runtime, mutated in place. Every field initialized here so the shape stays
// monomorphic; activeCamera and below are written by tick()'s producer stages.
export function createFrame() {
  return {
    lenisY: 0,
    scrollVel: 0,
    dtScale: 1,
    progress: 0,
    arcCopyEntryT: 0,
    arcPanT: 0,
    gridFormT: 0,
    gpWin: GRID_PEEL_WINDOW,
    sphereFormT: 0,
    zoomT: 0,
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
    entryLeadVh: 0,
  };
}

// No allocation; caller carries frame.lenisY back into input.prevLenisY.
export function deriveFrame(frame, input) {
  const {
    reducedMotion, blockDocTop, blockHeight, formPx, viewportH, entryLeadVh,
  } = input;

  const dtMs = input.prevNow ? input.now - input.prevNow : FRAME_MS;
  frame.dtScale = Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));

  // RM pins scroll input to the formed-sphere position; the pin cancels in `progress` but
  // canvas visibility still uses real scroll.
  const lenisY = reducedMotion ? blockDocTop + formPx : input.scrollY;
  frame.lenisY = lenisY;
  frame.scrollVel = reducedMotion ? 0 : Math.abs(lenisY - input.prevLenisY) / frame.dtScale;

  const entryStart = blockDocTop - viewportH * entryLeadVh;
  const entryRange = Math.max(1, viewportH * ENTRY_RAMP_VH);
  const arcCopyEntryT = clamp01((lenisY - entryStart) / entryRange);
  frame.arcCopyEntryT = arcCopyEntryT;

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

  frame.arcScale = input.arcScale;

  return frame;
}

export function cardFoldStartProgress(gpDelay) {
  const foldStartFormT = gpDelay + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW;
  const foldStartArcT = PROGRESS_GRID_ARC_START + Math.min(1, foldStartFormT) * GRID_ARC_RANGE;
  return Math.max(0, (foldStartArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
}
