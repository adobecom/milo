import {
  clamp01, camZAtT, tAtCamZ, createBaseFrame, createBaseFrameInput, deriveBaseFrame,
  travelSpanPx, TEXT_APPEAR_START,
} from '../../../../utils/globe/core.js';

export const TRAVEL_EASE_POW = 3;

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

export const SPHERE_INTERACTIVE_T = 0.02;

export const createFrame = createBaseFrame;
export const createFrameInput = createBaseFrameInput;

export function deriveFrame(frame, input) {
  const { blockDocTop, blockHeight, travelPx, viewportH } = input;

  const scrollY = deriveBaseFrame(frame, input);

  frame.sphereFormT = clamp01(1 + (scrollY - blockDocTop) / Math.max(1, viewportH));
  frame.scrollT = clamp01((scrollY - blockDocTop) / travelSpanPx({ blockHeight, travelPx }));
  frame.interactive = frame.sphereFormT >= SPHERE_INTERACTIVE_T;
  frame.orientReset = !frame.interactive;
  frame.hintEntryT = clamp01((frame.sphereFormT - TEXT_APPEAR_START) / (1 - TEXT_APPEAR_START));
  frame.hintRetirable = frame.sphereFormT >= 1;
  return frame;
}
