import { clamp01, camZAtT, tAtCamZ, dtScaleOf } from '../../../../utils/globe/core.js';

export const TRAVEL_EASE_POW = 3;

export const TEXT_APPEAR_START = 0.10;
export const CANVAS_HIDE_MARGIN_T = 0.05;

export const camZAtTravelT = (t, camZSphere, camZEnd) => camZAtT(
  t,
  camZSphere,
  camZEnd,
  TRAVEL_EASE_POW,
);

export const travelTAtCamZ = (z, camZSphere, camZEnd) => tAtCamZ(
  z,
  camZSphere,
  camZEnd,
  TRAVEL_EASE_POW,
);

export function travelSpanPx({ blockHeight, travelPx = 0 }) {
  return travelPx > 0 ? travelPx : Math.max(1, blockHeight);
}

export function scrollYAtTravelT(t, span) {
  return span.blockDocTop + t * travelSpanPx(span);
}

export const SPHERE_INTERACTIVE_T = 0.02;

// Allocated once per runtime, mutated in place. Every field initialized here so the shape stays
// monomorphic; activeCamera and below are written by tick()'s producer stages.
export function createFrame() {
  return {
    scrollY: 0,
    scrollVel: 0,
    dtScale: 1,
    entryT: 0,
    scrollT: 0,
    sphereFormed: false,
    interactive: false,
    activeCamera: null,
    sphereRotActive: false,
  };
}

export function createFrameInput() {
  return {
    scrollY: 0,
    prevScrollY: 0,
    now: 0,
    prevNow: 0, // 0 = no previous frame (first tick / resume) → dtScale 1
    reducedMotion: false,
    blockDocTop: 0,
    blockHeight: 0,
    travelPx: 0,
    viewportH: 0,
  };
}

// No allocation; caller carries frame.scrollY back into input.prevScrollY.
export function deriveFrame(frame, input) {
  const { reducedMotion, blockDocTop, blockHeight, travelPx, viewportH } = input;

  frame.dtScale = dtScaleOf(input.now, input.prevNow);

  // RM pins scroll input to the formed-sphere position.
  const scrollY = reducedMotion ? blockDocTop : input.scrollY;
  frame.scrollY = scrollY;
  frame.scrollVel = reducedMotion ? 0 : Math.abs(scrollY - input.prevScrollY) / frame.dtScale;

  frame.entryT = clamp01(1 + (scrollY - blockDocTop) / Math.max(1, viewportH));
  frame.scrollT = clamp01((scrollY - blockDocTop) / travelSpanPx({ blockHeight, travelPx }));
  frame.sphereFormed = frame.entryT >= 1;
  frame.interactive = frame.entryT >= SPHERE_INTERACTIVE_T;
  return frame;
}
