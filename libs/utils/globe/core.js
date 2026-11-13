import * as THREE from '../../deps/three.js';

export const GLOBE_SEED = 'One day I will return to your side';
const RANDOM_MOD = 2147483647;

export const CAM_FOV = 60;
export const TAN_HALF_FOV = Math.tan((CAM_FOV * Math.PI) / 360);
const MAX_DPR = 2;

export const FRAME_MS = 1000 / 60;
export const MAX_VEL = 0.08;
export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;
export const TEXT_APPEAR_START = 0.10;

export const CARD_ASPECT = 456 / 631;
export const CARD_RADIUS = 22 / 631;
export const WORLD_UP = new THREE.Vector3(0, 1, 0);
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));
const BALANCE_PASSES = 20;
export const COLUMN_EPS = 1e-6;

export const YAW_ONLY_GEOMETRY = {
  CYL_COLS_FIT: 0.80,
  CYL_COL_GAP_RATIO: 0.20,
  CYL_ROW_GAP_RATIO: 0.10,
  CYL_ASPECT_CAP: 1.9,
  CYL_BULGE: 0.18,
  CARD_FACE_CAMERA: 0.1,
};

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }

export function lerpN(a, b, t) { return a + (b - a) * t; }

export function smoothstep01(t) { return t * t * (3 - 2 * t); }

export function decayToZero(v, k, eps = 0.001) {
  const out = v * k;
  return Math.abs(out) < eps ? 0 : out;
}

export function clamp01(t) { return t > 0 ? Math.min(1, t) : 0; }

export function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

export function wrapAngle(a) { return Math.atan2(Math.sin(a), Math.cos(a)); }

export const nextFrame = () => new Promise((res) => { requestAnimationFrame(res); });

export function logGlobe(name, msg, severity = 'warn') {
  window.lana?.log?.(`${name}: ${msg}`, { tags: name, severity });
}

function hashSeed(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % RANDOM_MOD;
  return h || 1;
}

export function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state * 48271) % RANDOM_MOD;
    return state / RANDOM_MOD;
  };
}

// UV repeat + offset that fills `planeAspect` with `imgAspect`, centre-cropping the overflow.
// Caller owns `out`.
export function coverFit(imgAspect, planeAspect, out = {}) {
  Object.assign(out, { rx: 1, ry: 1, ox: 0, oy: 0 });
  if (!(imgAspect > 0) || !(planeAspect > 0)) return out;
  if (imgAspect > planeAspect) {
    out.rx = planeAspect / imgAspect;
    out.ox = (1 - out.rx) / 2;
  } else if (imgAspect < planeAspect) {
    out.ry = imgAspect / planeAspect;
    out.oy = (1 - out.ry) / 2;
  }
  return out;
}

export const capDpr = () => Math.min(window.devicePixelRatio, MAX_DPR);

export function pxPerWorldAt(dist, H) { return H / (2 * dist * TAN_HALF_FOV); }

function dtScaleOf(now, prevNow) {
  const dtMs = prevNow ? now - prevNow : FRAME_MS;
  return clamp(dtMs / FRAME_MS, DT_SCALE_MIN, DT_SCALE_MAX);
}

export function camZAtT(t, camZSphere, camZEnd, pow) {
  return lerpN(camZSphere, camZEnd, 1 - (1 - clamp01(t)) ** pow);
}

export function tAtCamZ(z, camZSphere, camZEnd, pow) {
  const span = camZSphere - camZEnd;
  if (!(span > 0)) return 0;
  const eased = clamp01((camZSphere - z) / span);
  return 1 - ((1 - eased) ** (1 / pow));
}

// Scroll past the formed position over which the camera travels.
export function travelSpanPx({ blockHeight, formPx = 0, travelPx = 0 }) {
  return travelPx > 0 ? travelPx : Math.max(1, blockHeight - formPx);
}

export function scrollYAtTravelT(t, span) {
  return span.blockDocTop + (span.formPx || 0) + t * travelSpanPx(span);
}

// All fields are initialized here so the shape stays monomorphic.
export function createBaseFrame() {
  return {
    scrollY: 0,
    scrollVel: 0,
    dtScale: 1,
    sphereFormT: 0,
    scrollT: 0,
    interactive: false,
    orientReset: true,
    hintEntryT: 0,
    hintRetirable: true,
    beforeEntry: false,
    activeCamera: null,
    sphereRotActive: false,
    sphGroupZ: 0,
  };
}

export function createBaseFrameInput() {
  return {
    scrollY: 0,
    prevScrollY: 0,
    now: 0,
    prevNow: 0, // 0 = no previous frame (first tick / resume) → dtScale 1
    reducedMotion: false,
    blockDocTop: 0,
    blockHeight: 0,
    formPx: 0,
    travelPx: 0,
    viewportH: 0,
  };
}

// No allocation; caller carries frame.scrollY back into input.prevScrollY.
export function deriveBaseFrame(frame, input) {
  frame.dtScale = dtScaleOf(input.now, input.prevNow);
  // RM pins scroll input to the formed-sphere position; the pin cancels in the clocks but canvas
  // visibility still uses real scroll.
  const scrollY = input.reducedMotion ? input.blockDocTop + input.formPx : input.scrollY;
  frame.scrollY = scrollY;
  frame.scrollVel = input.reducedMotion ? 0 : Math.abs(scrollY - input.prevScrollY) / frame.dtScale;
  return scrollY;
}

export function resolveBP(breakpoints, w) {
  const name = w >= breakpoints.md.minWidth ? 'md' : 'sm';
  return { name, cfg: breakpoints[name] };
}

export const planeAspect = ({ x, y }) => CARD_ASPECT * (x / (y || 1));

export function sphereCardScale(srcAspect) {
  const a = srcAspect > 0 ? srcAspect : CARD_ASPECT;
  const stretch = Math.sqrt(a / CARD_ASPECT);
  return { sX: stretch, sY: 1 / stretch };
}

export const mediaMatches = (query) => !!window.matchMedia?.(query).matches;

export const prefersReducedMotion = () => mediaMatches('(prefers-reduced-motion: reduce)')
  || mediaMatches('(height <= 460px) and (resolution >= 1.5dppx)');

export const isCoarsePointer = () => mediaMatches('(pointer: coarse)');

export const isRtl = () => document.documentElement.dir === 'rtl';

export function cssNumber(el, prop, fallback) {
  const n = parseFloat(getComputedStyle(el).getPropertyValue(prop));
  return Number.isFinite(n) ? n : fallback;
}

export function usesCylinderGeometry(bandName) {
  return bandName === 'sm' || isCoarsePointer();
}

function balanceColumns(heights, gap, cols) {
  const n = heights.length;
  const load = new Array(cols).fill(0);
  const col = new Array(n);
  const tallestFirst = [...heights.keys()]
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

// Cylindrical masonry layout — a WHOLE-SET solve; returns { pos, normal, w, h } per card.
// See README (Layout: sphere or barrel) for the packing + column-count rules.
export function cylinderMasonryLayout({
  aspects, radius, frustumH, colsFit, colGapRatio, rowGapRatio = colGapRatio, aspectCap, bulge = 0,
}) {
  const n = aspects.length;
  // Clamp extremes so one panorama can't dominate a column (cover-crop handles the rest).
  const clamped = aspects.map((a) => clamp(a > 0 ? a : 1, 1 / aspectCap, aspectCap));

  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + colGapRatio);
    const rowGap = cardW * rowGapRatio;
    const hs = clamped.map((a) => cardW / a);
    const col = balanceColumns(hs, rowGap, cols);
    const colH = new Array(cols).fill(0);
    const placed = hs.map((h, i) => {
      const c = col[i];
      const offset = colH[c];
      colH[c] += h + rowGap;
      return { col: c, offset, w: cardW, h };
    });
    const totals = colH.map((h) => Math.max(0, h - rowGap));
    return { placed, totals, wallH: Math.max(...totals) };
  };

  let packed = null;
  for (let cols = Math.min(4, n); cols <= Math.max(4, n); cols += 1) {
    packed = pack(cols);
    if (packed.wallH <= frustumH * colsFit) break;
  }

  const cols = packed.totals.length;
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1]. Azimuth is untouched.
  const wallH = packed.wallH || 1;
  return packed.placed.map((p) => {
    const colTotal = packed.totals[p.col];
    const y = colTotal / 2 - p.offset - p.h / 2;
    const azimuth = (2 * Math.PI * p.col) / cols;
    const cos = Math.cos(azimuth);
    const sin = Math.sin(azimuth);
    const t = clamp((2 * y) / wallH, -1, 1);
    const r = radius * (1 - bulge * t * t);
    // Outward normal of the surface of revolution r(y): (1, −dr/dy) normalized, at this azimuth.
    const dRdy = bulge === 0 ? 0 : radius * -2 * bulge * t * (2 / wallH);
    const nScale = 1 / Math.hypot(1, dRdy);
    return {
      pos: new THREE.Vector3(
        r * cos,
        y,
        r * sin,
      ),
      normal: new THREE.Vector3(
        nScale * cos,
        -dRdy * nScale,
        nScale * sin,
      ),
      w: p.w,
      h: p.h,
    };
  });
}

export function fibSpherePos(i, total, radius) {
  const y = 1 - (2 * i + 1) / total;
  const polarAngle = Math.acos(clamp(y, -1, 1));
  const azimuth = GOLDEN_ANGLE * i;
  const ringRadius = radius * Math.sin(polarAngle);
  return new THREE.Vector3(
    ringRadius * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    ringRadius * Math.sin(azimuth),
  );
}

export function stopInertia(drag) {
  drag.velX = 0;
  drag.velY = 0;
}

export function dropTravel(drag) {
  stopInertia(drag);
  drag.pendingX = 0;
  drag.pendingY = 0;
}

export function createDisposer() {
  const cleanups = [];
  return {
    add(fn) { cleanups.push(fn); },
    listen(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    },
    dispose() {
      while (cleanups.length) cleanups.pop()();
    },
  };
}
