/* ─────────────────────────────────────────────────────────────────────────
   Arc-phase geometry — the fanned-arc card layout + the CSS↔WebGL coordinate
   bridge used while the cards rotate across the viewport (progress 0→~0.55).

   Pure functions, no mutable runtime state: everything is derived from the
   viewport (W, H), the breakpoint's ARC_SPAN, and the per-frame arc context
   that buildArcCtx() returns. The runtime owns the arcCtx value (rebuilt once
   per frame) and threads it back into getFanData / rotateArcPoint. Hoisted out
   of the runtime closure for the same reason src/math.js is — stateless helpers
   read more clearly at module scope and shrink the runtime factory.
   ───────────────────────────────────────────────────────────────────────── */

// Arc rotation easing — a tiny quadratic ramp over the first `k` of the input
// that then continues linearly (matching value + slope at the seam), so the arc
// eases out of rest without a velocity discontinuity.
export function arcRotationEase(t) {
  const k = 0.08;
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}

// Build the per-frame arc context: the circle (centre + radius) the cards are
// fanned around, plus the rotation offset / effective span that arcPanT drives.
// Returned (not stored) so the runtime holds the single source of truth.
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

// t = 0..1 normalized position across the arc span (0 = one end, 1 = other end)
export function getFanData(t, arcCtx) {
  const angle = arcCtx.thetaM + arcCtx.effectiveSpan / 2
            - t * arcCtx.effectiveSpan
            + arcCtx.rotOffset;
  const px = arcCtx.fanCX + arcCtx.R * Math.cos(angle);
  const py = arcCtx.fanCY + arcCtx.R * Math.sin(angle);
  // Radial direction (CSS screen space, Y-down)
  const rx = Math.cos(angle);
  const ry = Math.sin(angle);
  // CSS card rotation (in radians) — tangent to arc circle
  const cssRot = Math.atan2(rx, -ry);
  return { px, py, rx, ry, cssRot };
}

// Convert CSS screen coordinates to WebGL world coordinates
// (origin at screen center; Y flipped)
export function cssToWorld(px, py, W, H) {
  return { x: px - W / 2, y: -(py - H / 2) };
}

// Rotate a point (in CSS screen space) around (fanCX, fanCY) by angle A (CW in CSS)
// then convert to world space.
export function rotateArcPoint(px, py, A, arcCtx, W, H) {
  const dx = px - arcCtx.fanCX;
  const dy = py - arcCtx.fanCY;
  const cosA = Math.cos(A);
  const sinA = Math.sin(A);
  const rpx = arcCtx.fanCX + dx * cosA - dy * sinA;
  const rpy = arcCtx.fanCY + dx * sinA + dy * cosA;
  return cssToWorld(rpx, rpy, W, H);
}

// Camera Z for the arc phase: set so that at z=0 the frustum height equals H,
// making 1 world unit = 1 CSS pixel (the coordinate space the arc math assumes).
export function arcCamZ(H) {
  return H / (2 * Math.tan(Math.PI / 6)); // fov=60, half-angle=30°
}
