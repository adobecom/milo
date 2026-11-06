import * as THREE from '../../deps/three.js';

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }

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

const MAX_DPR = 2;
export const capDpr = () => Math.min(window.devicePixelRatio, MAX_DPR);

export const CAM_FOV = 60;
export const TAN_HALF_FOV = Math.tan((CAM_FOV * Math.PI) / 360);

export function pxPerWorldAt(dist, H) { return H / (2 * dist * TAN_HALF_FOV); }

export const FRAME_MS = 1000 / 60;

export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;
export function dtScaleOf(now, prevNow) {
  const dtMs = prevNow ? now - prevNow : FRAME_MS;
  return Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));
}

export function camZAtT(t, camZSphere, camZEnd, pow) {
  return lerpN(camZSphere, camZEnd, 1 - (1 - clamp01(t)) ** pow);
}

export function tAtCamZ(z, camZSphere, camZEnd, pow) {
  const span = camZSphere - camZEnd;
  if (!(span > 0)) return 0;
  const eased = Math.min(1, Math.max(0, (camZSphere - z) / span));
  return 1 - ((1 - eased) ** (1 / pow));
}

export function resolveBP(breakpoints, w) {
  if (w >= breakpoints.md.minWidth) return { name: 'md', cfg: breakpoints.md };
  return { name: 'sm', cfg: breakpoints.sm };
}

export const CARD_ASPECT = 456 / 631;

export function sphereCardScale(srcAspect) {
  const a = Number.isFinite(srcAspect) && srcAspect > 0 ? srcAspect : CARD_ASPECT;
  const stretch = Math.sqrt(a / CARD_ASPECT);
  return { sX: stretch, sY: 1 / stretch };
}

export const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  || !!window.matchMedia?.('(height <= 460px) and (resolution >= 1.5dppx)').matches;

export function usesCylinderGeometry(bandName) {
  if (bandName === 'sm') return true;
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

// Yaw-only drags (touch / narrow): a cylindrical masonry wall replaces the Fibonacci sphere.
export const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_COL_GAP_RATIO: 0.20, // column gap as a fraction of card width; also sets cardW
  CYL_ROW_GAP_RATIO: 0.10, // row gap as a fraction of card width
  CYL_ASPECT_CAP: 1.9, // on the LAID-OUT aspect; past it the fit crops
  CYL_BULGE: 0.18, // r = R·(1 − bulge·t²); keep ≤~0.2 or edges overlap
  CARD_FACE_CAMERA: 0.1, // >0 costs barrel smoothness
};

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));

export const WORLD_UP = new THREE.Vector3(0, 1, 0);

const BALANCE_PASSES = 20;

export const COLUMN_EPS = 1e-6;

function balanceColumns(heights, gap, cols) {
  const n = heights.length;
  const load = new Array(cols).fill(0);
  const col = new Array(n);
  const tallestFirst = Array.from({ length: n }, (unused, i) => i)
    .sort((a, b) => heights[b] - heights[a] || a - b);
  for (let k = 0; k < n; k += 1) {
    const i = tallestFirst[k];
    let best = 0;
    for (let c = 1; c < cols; c += 1) if (load[c] < load[best]) best = c;
    col[i] = best;
    load[best] += heights[i] + gap;
  }
  for (let pass = 0; pass < BALANCE_PASSES; pass += 1) {
    let swapped = false;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const [a, b, d] = [col[i], col[j], heights[i] - heights[j]];
        if (a !== b && d * (load[b] - load[a] + d) < 0) {
          load[a] -= d;
          load[b] += d;
          col[i] = b;
          col[j] = a;
          swapped = true;
        }
      }
    }
    if (!swapped) break;
  }
  return col;
}

// Cylindrical masonry layout — a WHOLE-SET solve; returns { pos, w, h } per card.
// See README (yaw-only geometry) for the packing + column-count rules.
export function cylinderMasonryLayout({
  aspects, radius, frustumH, colsFit, colGapRatio, rowGapRatio = colGapRatio, aspectCap, bulge = 0,
}) {
  const n = aspects.length;
  // Clamp extremes so one panorama can't dominate a column (cover-crop handles the rest).
  const clamped = aspects.map((ar) => {
    const a = Number.isFinite(ar) && ar > 0 ? ar : 1;
    return Math.max(1 / aspectCap, Math.min(aspectCap, a));
  });

  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + colGapRatio);
    const rowGap = cardW * rowGapRatio;
    const hs = clamped.map((a) => cardW / a);
    const col = balanceColumns(hs, rowGap, cols);
    const colH = new Array(cols).fill(0);
    const placed = new Array(n);
    for (let c = 0; c < cols; c += 1) {
      for (let i = 0; i < n; i += 1) {
        if (col[i] !== c) continue; // eslint-disable-line no-continue
        placed[i] = { col: c, offset: colH[c], w: cardW, h: hs[i] };
        colH[c] += hs[i] + rowGap;
      }
    }
    const totals = colH.map((h) => Math.max(0, h - rowGap));
    return { placed, totals, wallH: Math.max(...totals) };
  };

  // Fewest columns that fit.
  let packed = null;
  for (let cols = Math.min(4, n); cols <= Math.max(4, n); cols += 1) {
    packed = pack(cols);
    if (packed.wallH <= frustumH * colsFit) break;
  }

  const cols = packed.totals.length;
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1]. Azimuth is untouched.
  const wallH = packed.wallH || 1;
  return packed.placed.map((p, i) => {
    const colTotal = packed.totals[p.col];
    const y = colTotal / 2 - p.offset - p.h / 2;
    const azimuth = (2 * Math.PI * p.col) / cols;
    const t = Math.max(-1, Math.min(1, (2 * y) / wallH));
    const r = radius * (1 - bulge * t * t);
    // Outward normal of the surface of revolution r(y): (1, −dr/dy) normalized, at this azimuth.
    const dRdy = bulge === 0 ? 0 : radius * -2 * bulge * t * (2 / wallH);
    const nScale = 1 / Math.hypot(1, dRdy);
    return {
      pos: new THREE.Vector3(
        r * Math.cos(azimuth),
        y,
        r * Math.sin(azimuth),
      ),
      normal: new THREE.Vector3(
        nScale * Math.cos(azimuth),
        -dRdy * nScale,
        nScale * Math.sin(azimuth),
      ),
      w: p.w,
      h: p.h,
      index: i,
    };
  });
}

export function fibSpherePos(i, total, radius) {
  const y = 1 - (2 * i + 1) / total;
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, y)));
  const azimuth = GOLDEN_ANGLE * i;
  return new THREE.Vector3(
    radius * Math.sin(polarAngle) * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    radius * Math.sin(polarAngle) * Math.sin(azimuth),
  );
}
