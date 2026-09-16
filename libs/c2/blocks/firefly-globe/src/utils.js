export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
export function easeOutExpo(t) { return t >= 1 ? 1 : 1 - 2 ** (-10 * t); }

export function lerpN(a, b, t) { return a + (b - a) * t; }

export function clamp01(t) { return t > 0 ? Math.min(1, t) : 0; }

export function coverFit(imgAspect, planeAspect, out = {}) {
  out.rx = 1; out.ry = 1; out.ox = 0; out.oy = 0;
  if (!(imgAspect > 0) || !(planeAspect > 0)) return out;
  if (imgAspect > planeAspect) {
    out.rx = planeAspect / imgAspect; out.ox = (1 - out.rx) / 2;
  } else if (imgAspect < planeAspect) {
    out.ry = imgAspect / planeAspect; out.oy = (1 - out.ry) / 2;
  }
  return out;
}

const MAX_DPR = 2;
export const capDpr = () => Math.min(window.devicePixelRatio, MAX_DPR);

export const CAM_FOV = 60;
export const TAN_HALF_FOV = Math.tan((CAM_FOV * Math.PI) / 360);

export function pxPerWorldAt(dist, H) { return H / (2 * dist * TAN_HALF_FOV); }

export function camZAtTravelT(t, camZSphere, camZEnd) {
  return lerpN(camZSphere, camZEnd, easeOutCubic(t));
}

export function travelTAtCamZ(z, camZSphere, camZEnd) {
  const span = camZSphere - camZEnd;
  if (!(span > 0)) return 0;
  const eased = Math.min(1, Math.max(0, (camZSphere - z) / span));
  return 1 - ((1 - eased) ** (1 / 3));
}

export const SPHERE_INTERACTIVE_T = 0.02;

// frame.dtScale rescales per-60fps-frame rates; clamped.
export const FRAME_MS = 1000 / 60;
export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;

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
    sphGroupZ: 0,
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
    viewportH: 0,
  };
}

// No allocation; caller carries frame.scrollY back into input.prevScrollY.
export function deriveFrame(frame, input) {
  const { reducedMotion, blockDocTop, blockHeight, viewportH } = input;

  const dtMs = input.prevNow ? input.now - input.prevNow : FRAME_MS;
  frame.dtScale = Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));

  // RM pins scroll input to the formed-sphere position.
  const scrollY = reducedMotion ? blockDocTop : input.scrollY;
  frame.scrollY = scrollY;
  frame.scrollVel = reducedMotion ? 0 : Math.abs(scrollY - input.prevScrollY) / frame.dtScale;

  frame.entryT = clamp01(1 + (scrollY - blockDocTop) / Math.max(1, viewportH));
  frame.scrollT = clamp01((scrollY - blockDocTop) / Math.max(1, blockHeight));
  frame.sphereFormed = frame.entryT >= 1;
  frame.interactive = frame.entryT >= SPHERE_INTERACTIVE_T;
  return frame;
}
