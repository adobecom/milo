// Pure stateless helpers: easings + arc-phase geometry. The runtime owns the per-frame arcCtx.

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
export function easeInOutQuint(t) { return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2; }
export function easeOutExpo(t) { return t >= 1 ? 1 : 1 - 2 ** (-10 * t); }

export function lerpN(a, b, t) { return a + (b - a) * t; }

export function clamp01(t) { return t > 0 ? Math.min(1, t) : 0; }

// UV repeat + offset that fills `planeAspect` with `imgAspect`, centre-cropping the overflow.
// Caller owns `out`.
export function coverFit(imgAspect, planeAspect, out = {}) {
  out.rx = 1; out.ry = 1; out.ox = 0; out.oy = 0;
  if (!(imgAspect > 0) || !(planeAspect > 0)) return out;
  if (imgAspect > planeAspect) {
    out.rx = planeAspect / imgAspect; // wider than the plane → crop left/right
    out.ox = (1 - out.rx) / 2;
  } else if (imgAspect < planeAspect) {
    out.ry = imgAspect / planeAspect; // taller than the plane → crop top/bottom
    out.oy = (1 - out.ry) / 2;
  }
  return out;
}

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

export const CAM_FOV = 60;
export const TAN_HALF_FOV = Math.tan((CAM_FOV * Math.PI) / 360);

export function pxPerWorldAt(dist, H) { return H / (2 * dist * TAN_HALF_FOV); }

// Frustum height = H at z=0, so 1 world unit = 1 CSS pixel.
export function arcCamZ(H) {
  return H / (2 * TAN_HALF_FOV);
}
