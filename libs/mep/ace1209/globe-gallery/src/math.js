// Pure stateless helpers: generic easings + the arc-phase geometry (fanned-arc card layout +
// CSS↔WebGL coordinate bridge). The runtime owns the per-frame arcCtx from buildArcCtx().

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
export function easeOutSine(t) { return Math.sin((t * Math.PI) / 2); }

export function lerpN(a, b, t) { return a + (b - a) * t; }

// Cover-fit crop (UV repeat + offset) that fills `planeAspect` with `imgAspect`, centre-cropping
// the overflow; identity when they match. Caller owns `out`. See README (Architecture notes).
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

// Arc rotation ease: quadratic ramp over the first `k`, then linear (C1 at the seam).
export function arcRotationEase(t) {
  const k = 0.08;
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}

// Per-frame arc context: the fan circle (centre + radius) plus rotation offset /
// effective span driven by arcPanT.
export function buildArcCtx(arcPanT, W, H, arcSpan) {
  const arcRot0 = arcRotationEase(arcPanT);
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
  // Radial direction (CSS screen space, Y-down)
  const rx = Math.cos(angle);
  const ry = Math.sin(angle);
  out.px = arcCtx.fanCX + arcCtx.R * rx;
  out.py = arcCtx.fanCY + arcCtx.R * ry;
  out.rx = rx;
  out.ry = ry;
  // CSS card rotation (in radians) — tangent to arc circle
  out.cssRot = Math.atan2(rx, -ry);
  return out;
}

// CSS screen coords → WebGL world coords (origin at screen center, Y flipped).
export function cssToWorld(px, py, W, H, out = {}) {
  out.x = px - W / 2;
  out.y = -(py - H / 2);
  return out;
}

// Rotate a CSS-space point around (fanCX, fanCY) by angle A (CW), then to world space.
export function rotateArcPoint(px, py, A, arcCtx, W, H, out = {}) {
  const dx = px - arcCtx.fanCX;
  const dy = py - arcCtx.fanCY;
  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const rpx = arcCtx.fanCX + dx * cosA - dy * sinA;
  const rpy = arcCtx.fanCY + dx * sinA + dy * cosA;
  return cssToWorld(rpx, rpy, W, H, out);
}

// Arc-phase camera Z: frustum height = H at z=0, so 1 world unit = 1 CSS pixel.
export function arcCamZ(H) {
  return H / (2 * Math.tan(Math.PI / 6)); // fov=60, half-angle=30°
}
