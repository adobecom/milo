// Every phase constant, threshold, and the per-frame clock derivation.
// Pure — no THREE, no DOM, no closure state.
import { clamp01, camZAtT, tAtCamZ, dtScaleOf, TAN_HALF_FOV } from '../../../../utils/globe/core.js';

export { FRAME_MS, DT_SCALE_MIN, DT_SCALE_MAX } from '../../../../utils/globe/core.js';

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
export const BROWSE_VIEW_T = 0.96;
export const SPHERE_ORIENT_RESET_T = 0.01;
export const TEXT_APPEAR_START = 0.10;

export const ARC_COPY_IN_ENTRY_T = 0.336;
export const ARC_COPY_OUT_FORM_START = 0.20;
export const ARC_COPY_OUT_FORM_END = 0.90;

export const CANVAS_HIDE_MARGIN_T = 0.05;

export const progressAtFormT = (t) => FOLD_FIRST_PROGRESS + t * FOLD_WINDOW;

export const BROWSE_VIEW_SCROLL_FRAC = progressAtFormT(BROWSE_VIEW_T) / SPHERE_FORMED_PROGRESS;

export const ARC_COPY_OUT_START = progressAtFormT(ARC_COPY_OUT_FORM_START);
export const ARC_COPY_OUT_END = progressAtFormT(ARC_COPY_OUT_FORM_END);

export const ZOOM_EASE_POW = 2;

// The zoom camera's world z at zoomT, and its inverse. An inverse pair: neither is derivable
// from the other at runtime, so they must be edited together — hence they live side by side.
// Break the pairing and pqAppearZoomT drifts silently, taking the controls, the canvas cursor,
// the canvas hide and the pull-quote reveal with it.
export const camZAtZoomT = (t, camZSphere, camZEnd) => camZAtT(
  t,
  camZSphere,
  camZEnd,
  ZOOM_EASE_POW,
);

export const zoomTAtCamZ = (z, camZSphere, camZEnd) => tAtCamZ(
  z,
  camZSphere,
  camZEnd,
  ZOOM_EASE_POW,
);

export function zoomSpanPx({ blockHeight, formPx, zoomPx = 0 }) {
  return zoomPx > 0 ? zoomPx : Math.max(1, blockHeight - formPx);
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
    zoomPx: 0,
    viewportH: 0,
    arcScale: 1,
    entryLeadVh: 0,
  };
}

// No allocation; caller carries frame.lenisY back into input.prevLenisY.
export function deriveFrame(frame, input) {
  const {
    reducedMotion, blockDocTop, blockHeight, formPx, zoomPx, viewportH, entryLeadVh,
  } = input;

  frame.dtScale = dtScaleOf(input.now, input.prevNow);

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
  const tailPx = zoomSpanPx({ blockHeight, formPx, zoomPx });
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

export function scrollYAtZoomT(zoomT, span) {
  return span.blockDocTop + span.formPx + zoomT * zoomSpanPx(span);
}

export function cardFoldStartProgress(gpDelay) {
  const foldStartFormT = gpDelay + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW;
  const foldStartArcT = PROGRESS_GRID_ARC_START + Math.min(1, foldStartFormT) * GRID_ARC_RANGE;
  return Math.max(0, (foldStartArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
}

export function easeInOutQuint(t) { return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2; }

// Quadratic ramp over the first `k`, then linear (C1 at the seam).
export function arcRotationEase(t, k) {
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}

// The fan circle (centre + radius) plus rotation offset / effective span, driven by arcPanT.
export function buildArcCtx(arcPanT, W, H, arcSpan, rampT) {
  const arcRot0 = arcRotationEase(arcPanT, rampT);
  const R = Math.max(W, H) * 1.5; // smaller radius = more visible arc curvature
  const alpha = Math.atan2(H, W);
  const fanCX = W * 0.5 - R * Math.sin(alpha);
  const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
  const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
  const rotOffset = arcSpan * 0.5 - arcSpan * 1.5 * arcRot0;
  const effectiveSpan = arcSpan * (1 + 0.4 * arcRot0);
  return {
    R, fanCX, fanCY, thetaM, rotOffset, effectiveSpan,
  };
}

export function getFanData(t, arcCtx, out = {}) {
  const angle = arcCtx.thetaM + arcCtx.effectiveSpan / 2
            - t * arcCtx.effectiveSpan
            + arcCtx.rotOffset;
  const rx = Math.cos(angle);
  const ry = Math.sin(angle);
  out.px = arcCtx.fanCX + arcCtx.R * rx;
  out.py = arcCtx.fanCY + arcCtx.R * ry;
  out.rx = rx;
  out.ry = ry;
  out.cssRot = Math.atan2(rx, -ry);
  return out;
}

// CSS screen coords → world coords (origin at screen centre, Y flipped).
export function cssToWorld(px, py, W, H, out = {}) {
  out.x = px - W / 2;
  out.y = -(py - H / 2);
  return out;
}

export function rotateArcPoint(px, py, A, arcCtx, W, H, out = {}) {
  const dx = px - arcCtx.fanCX;
  const dy = py - arcCtx.fanCY;
  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const rpx = arcCtx.fanCX + dx * cosA - dy * sinA;
  const rpy = arcCtx.fanCY + dx * sinA + dy * cosA;
  return cssToWorld(rpx, rpy, W, H, out);
}

// Frustum height = H at z=0, so 1 world unit = 1 CSS pixel.
export function arcCamZ(H) {
  return H / (2 * TAN_HALF_FOV);
}
