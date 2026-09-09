// Pure stateless helpers: easings, UV fitting, camera math, frame clock.
// No THREE, no DOM, no closure state.

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }

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

// frame.dtScale rescales per-60fps-frame rates; clamped.
export const FRAME_MS = 1000 / 60;
export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;

// Allocated once per runtime, mutated in place. Shape stays monomorphic.
export function createFrame() {
  return {
    dtScale: 1,
    activeCamera: null,
    sphereRotActive: false,
    sphGroupZ: 0,
  };
}
