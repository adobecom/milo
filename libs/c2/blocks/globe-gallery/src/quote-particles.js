import * as THREE from '../../../../deps/three.js';
import {
  QUOTE_PARTICLE_VERT, QUOTE_PARTICLE_FRAG,
  QUOTE_ARRIVE_FROM, QUOTE_ARRIVE_SPREAD, QUOTE_ARRIVE_JITTER, QUOTE_REVEAL_LAG, QUOTE_REVEAL_DUR,
  QUOTE_FLY, QUOTE_EDGE_FLY, QUOTE_DETACH_AT,
} from './shaders.js';

// Pull-quote particle hand-off: the far-side cards' pixels burst off and fly into the quote's
// glyphs, laid out by the real DOM. See README (Particle hand-off).

const INK_ALPHA = 128;
const SIZE_PER_SPACING = 1.5; // dot diameter over mean ink spacing: just enough to read solid
const SIZE_MIN = 1.2;
const SIZE_MAX = 4;

function fontOf(cs) {
  return `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
}

// Visible text only: the sr-only copy duplicates the split lines.
function visibleTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.textContent.trim() && !n.parentElement.closest('.sr-only')
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

// Each word is drawn at its own Range box, so canvas/DOM advance drift never accumulates past a
// word and every wrap, indent and hung mark comes straight from the DOM layout.
function drawWords(ctx, node, originX, originY) {
  const cs = getComputedStyle(node.parentElement);
  ctx.font = fontOf(cs);
  if (!ctx.font.includes(cs.fontSize)) return; // unparsable font: skip rather than draw at 10px
  if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
  ctx.fillStyle = cs.color;
  const range = document.createRange();
  const text = node.textContent;
  [...text.matchAll(/\S+/g)].forEach((m) => {
    range.setStart(node, m.index);
    range.setEnd(node, m.index + m[0].length);
    const rect = range.getClientRects()[0];
    if (!rect || !rect.width) return;
    const metrics = ctx.measureText(m[0]);
    const asc = metrics.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
    const desc = metrics.fontBoundingBoxDescent ?? parseFloat(cs.fontSize) * 0.2;
    // Centre the font box in the range box: exact when the metrics agree, symmetric when not.
    const baseline = rect.top + (rect.height - asc - desc) / 2 + asc;
    ctx.fillText(m[0], rect.left - originX, baseline - originY);
  });
}

// Fonts the figure's text uses that are not loaded yet; the caller re-rasterizes once they are.
export function pendingFonts(figureEl) {
  if (!document.fonts?.check) return [];
  const fonts = visibleTextNodes(figureEl).map((n) => fontOf(getComputedStyle(n.parentElement)));
  return [...new Set(fonts)].filter((f) => !document.fonts.check(f));
}

// Target points in CSS px: x in viewport space, y relative to `originTop` (the pin's top), so a
// scrolled pin only shifts one uniform. Null when there is nothing to draw.
export function rasterizeQuote(figureEl, originTop, budget) {
  const fig = figureEl.getBoundingClientRect();
  const w = Math.ceil(fig.width);
  const h = Math.ceil(fig.height);
  if (!w || !h || budget <= 0) return null;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.textBaseline = 'alphabetic';
  visibleTextNodes(figureEl).forEach((node) => drawWords(ctx, node, fig.left, fig.top));
  const { data } = ctx.getImageData(0, 0, w, h);
  const ink = [];
  for (let i = 3; i < data.length; i += 4) if (data[i] >= INK_ALPHA) ink.push((i - 3) / 4);
  if (!ink.length) return null;
  // Always the full budget, so the cards' coverage doesn't depend on the quote's length. Partial
  // Fisher–Yates: an unbiased subset when there is ink to spare, a cycle when there is not.
  const count = budget;
  const take = Math.min(count, ink.length);
  for (let i = 0; i < take; i += 1) {
    const j = i + Math.floor(Math.random() * (ink.length - i));
    [ink[i], ink[j]] = [ink[j], ink[i]];
  }
  const dst = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const px = ink[i % take];
    const x = px % w;
    const y = (px - x) / w;
    dst[i * 3] = fig.left + x + Math.random();
    dst[i * 3 + 1] = fig.top - originTop + y + Math.random();
    color[i * 3] = data[px * 4] / 255;
    color[i * 3 + 1] = data[px * 4 + 1] / 255;
    color[i * 3 + 2] = data[px * 4 + 2] / 255;
  }
  const spacing = Math.sqrt(ink.length / take);
  const size = Math.min(SIZE_MAX, Math.max(SIZE_MIN, spacing * SIZE_PER_SPACING));
  return { dst, color, count, size };
}

// deps/three.js is a tree-shaken subset with no Points, BufferGeometry or BufferAttribute: a
// stripped PlaneGeometry supplies both, and a Mesh flagged isPoints is drawn as gl.POINTS.
function createPointGeometry(attrs) {
  const geo = new THREE.PlaneGeometry(1, 1);
  const Attr = geo.getAttribute('position').constructor;
  geo.setIndex(null);
  ['position', 'normal', 'uv'].forEach((name) => geo.deleteAttribute(name));
  Object.entries(attrs).forEach(([name, [array, size]]) => {
    geo.setAttribute(name, new Attr(array, size));
  });
  return geo;
}

function createPoints(geo, material) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.isMesh = false;
  mesh.isPoints = true;
  return mesh;
}

// Reading-order position (0..1) of a point in the quote's ink box: mostly along the line, a little
// down the block. The particles land, and the text turns crisp, in this order.
export function readingOrder(x, y, box) {
  const xn = (x - box.x0) / Math.max(1, box.x1 - box.x0);
  const yn = (y - box.y0) / Math.max(1, box.y1 - box.y0);
  return (box.rtl ? 1 - xn : xn) * 0.7 + yn * 0.3;
}

// Inverse along a line: the x at which reading order reaches o, on the row at y.
export function readingX(o, y, box) {
  const yn = (y - box.y0) / Math.max(1, box.y1 - box.y0);
  const along = (o - yn * 0.3) / 0.7;
  return box.x0 + (box.rtl ? 1 - along : along) * (box.x1 - box.x0);
}

// The reading-order positions whose text is fully crisp (o1) and not yet crisp at all (o0) at
// flight progress p. Mirrors the particle shader's per-particle reveal.
export function revealFront(p) {
  const at = (p - QUOTE_ARRIVE_FROM - QUOTE_REVEAL_LAG) / QUOTE_ARRIVE_SPREAD;
  return { o0: at, o1: at - QUOTE_REVEAL_DUR / QUOTE_ARRIVE_SPREAD };
}

function inkBox(dst, count, rtl) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (let i = 0; i < count; i += 1) {
    x0 = Math.min(x0, dst[i * 3]); x1 = Math.max(x1, dst[i * 3]);
    y0 = Math.min(y0, dst[i * 3 + 1]); y1 = Math.max(y1, dst[i * 3 + 1]);
  }
  return { x0, y0, x1, y1, rtl };
}

const MATERIAL_POOL = 24; // per-card draws prepared up front; more are added on demand
const PENDING = 9; // reading order / departure / arrival before pairing: beyond any flight
const PAIR_BANDS = 8; // x bands of the 2D quantile order
const EDGE_LEAD = 0.75; // share of a particle's departure order set by its depth in its card
// Soft pairing: noise on the band keys and near-rank swaps, so neighbouring cards interleave and
// colours dither across the seams instead of tiling the text in single-card rectangles.
const SOFT_X = 1; // ± x key noise, in band widths
const SOFT_Y = 0.12; // ± y key noise, as a share of the set's height
const SOFT_SWAP = 0.2; // share of particles swapped with a near rank
const SOFT_SWAP_SPAN = 1 / 32; // how near, as a share of all ranks

const SORT_BUCKETS = 4096; // key resolution of the counting sort: below a pixel at these extents
const bucketCounts = new Uint32Array(SORT_BUCKETS + 1);

// Indices `idx` stably sorted by key[i] quantized to SORT_BUCKETS: a counting sort, linear in the
// count, so the pairing stays off the critical path even on a throttled phone.
function sortBy(key, idx) {
  let lo = Infinity; let hi = -Infinity;
  idx.forEach((i) => { lo = Math.min(lo, key[i]); hi = Math.max(hi, key[i]); });
  const scale = (SORT_BUCKETS - 1) / Math.max(1e-6, hi - lo);
  const slot = new Uint16Array(idx.length);
  bucketCounts.fill(0);
  idx.forEach((i, k) => {
    slot[k] = Math.round((key[i] - lo) * scale);
    bucketCounts[slot[k] + 1] += 1;
  });
  for (let b = 1; b <= SORT_BUCKETS; b += 1) bucketCounts[b] += bucketCounts[b - 1];
  const out = new Uint32Array(idx.length);
  idx.forEach((i, k) => {
    out[bucketCounts[slot[k]]] = i;
    bucketCounts[slot[k]] += 1;
  });
  return out;
}

// A locality-preserving order over a point set's own extent: PAIR_BANDS equal-count bands by x,
// each read top to bottom. Rank r in one set and rank r in another sit at the same x and y
// quantiles, so pairing two sets by rank keeps neighbours together and paths short (a cheap
// stand-in for optimal transport).
export function coherentOrder(xs, ys, count = xs.length) {
  const byX = sortBy(xs, Uint32Array.from({ length: count }, (_, i) => i));
  const out = new Uint32Array(count);
  for (let b = 0; b < PAIR_BANDS; b += 1) {
    const from = Math.floor((b * count) / PAIR_BANDS);
    const to = Math.floor(((b + 1) * count) / PAIR_BANDS);
    if (to > from) out.set(sortBy(ys, byX.subarray(from, to)), from);
  }
  return out;
}

function extent(v, count) {
  let lo = Infinity; let hi = -Infinity;
  for (let i = 0; i < count; i += 1) { lo = Math.min(lo, v[i]); hi = Math.max(hi, v[i]); }
  return Math.max(0, hi - lo);
}

// coherentOrder over noisy keys, then a share of near-rank swaps: still local (paths stay short),
// but no card maps onto one contiguous rectangle of the text.
export function softOrder(xs, ys, count = xs.length) {
  const bw = (SOFT_X * extent(xs, count)) / PAIR_BANDS;
  const bh = SOFT_Y * extent(ys, count);
  const nx = new Float32Array(count);
  const ny = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    nx[i] = xs[i] + (Math.random() * 2 - 1) * bw;
    ny[i] = ys[i] + (Math.random() * 2 - 1) * bh;
  }
  const order = coherentOrder(nx, ny, count);
  const span = Math.max(1, Math.round(SOFT_SWAP_SPAN * count));
  for (let r = 0; r < count; r += 1) {
    if (Math.random() < SOFT_SWAP) {
      const q = Math.min(count - 1, Math.max(0, r + Math.round((Math.random() * 2 - 1) * span)));
      [order[r], order[q]] = [order[q], order[r]];
    }
  }
  return order;
}

// [departure, arrival] uP of a particle released at `release`, `edge` deep in its card (0 rim →
// 1 centre), paired with a target of reading order `order`: a fixed flight ending at its own
// arrival, so only a band is airborne at once; rim particles fly longer so they still leave first.
// Never before it has let go of the camera.
export function flightWindow(order, edge, release) {
  const arrive = QUOTE_ARRIVE_FROM + order * QUOTE_ARRIVE_SPREAD
    + (Math.random() * 2 - 1) * QUOTE_ARRIVE_JITTER;
  const leave = arrive - QUOTE_FLY * (1 + QUOTE_EDGE_FLY * (1 - edge));
  return [Math.min(arrive - 0.5 * QUOTE_FLY, Math.max(release + QUOTE_DETACH_AT, leave)), arrive];
}

const QUAD_PROBE = 12;

// The uv window of a card that is on screen (padded a probe step), from a coarse probe grid. Null
// when none of it is.
function screenWindow(project, W, H) {
  const inView = ([x, y]) => x > -0.05 * W && x < 1.05 * W && y > -0.05 * H && y < 1.05 * H;
  let u0 = 1; let u1 = 0; let v0 = 1; let v1 = 0;
  for (let a = 0; a <= QUAD_PROBE; a += 1) {
    for (let b = 0; b <= QUAD_PROBE; b += 1) {
      if (inView(project(a / QUAD_PROBE, b / QUAD_PROBE))) {
        u0 = Math.min(u0, a / QUAD_PROBE); u1 = Math.max(u1, a / QUAD_PROBE);
        v0 = Math.min(v0, b / QUAD_PROBE); v1 = Math.max(v1, b / QUAD_PROBE);
      }
    }
  }
  if (u1 < u0) return null;
  const pad = 1 / QUAD_PROBE;
  return {
    u0: Math.max(0, u0 - pad),
    u1: Math.min(1, u1 + pad),
    v0: Math.max(0, v0 - pad),
    v1: Math.min(1, v1 + pad),
  };
}

function windowArea(project, win) {
  const pts = [[win.u0, win.v0], [win.u1, win.v0], [win.u1, win.v1], [win.u0, win.v1]]
    .map(([u, v]) => project(u, v));
  let a2 = 0;
  pts.forEach(([x, y], k) => { const [nx, ny] = pts[(k + 1) % 4]; a2 += x * ny - nx * y; });
  return Math.abs(a2) / 2;
}

export default function createQuoteParticles(scene, renderOrder) {
  // Shared by reference into every per-card material.
  const shared = {
    uProj: { value: new THREE.Matrix4() },
    uZoom: { value: new THREE.Vector2(0, 0) },
    uCamZ: { value: new THREE.Vector2(0, 0) },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uPinTop: { value: 0 },
    uP: { value: 0 },
    uFade: { value: 1 },
    uSize: { value: 2 },
    uMinDepth: { value: 1.5 },
  };
  const makeMaterial = (card) => new THREE.ShaderMaterial({
    uniforms: {
      ...shared,
      uMap: { value: card ? card.texture : null },
      uRepeat: { value: new THREE.Vector2(card ? card.repeat.x : 1, card ? card.repeat.y : 1) },
      uOffset: { value: new THREE.Vector2(card ? card.offset.x : 0, card ? card.offset.y : 0) },
      uAspect: { value: card ? card.aspect : 1 },
      uRadius: { value: card ? card.radius : 0 },
      uCA: { value: card ? card.ca : 0 },
      uMirror: { value: card && card.mirror ? 1 : 0 },
      uAlpha: { value: card ? card.alpha : 0 },
      uAxisU: { value: card ? card.axisU.clone() : new THREE.Vector3(1, 0, 0) },
      uAxisV: { value: card ? card.axisV.clone() : new THREE.Vector3(0, 1, 0) },
      uCell: { value: new THREE.Vector2(card ? card.cellU : 0.01, card ? card.cellV : 0.01) },
    },
    vertexShader: QUOTE_PARTICLE_VERT,
    fragmentShader: QUOTE_PARTICLE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    extensions: { derivatives: true }, // fwidth for the corner AA in WebGL1; no-op in WebGL2
  });
  // Point a pooled material at a card (or at nothing: an invisible stand-in).
  const aimMaterial = (mat, card) => {
    const u = mat.uniforms;
    u.uMap.value = card ? card.texture : null;
    u.uRepeat.value.set(card ? card.repeat.x : 1, card ? card.repeat.y : 1);
    u.uOffset.value.set(card ? card.offset.x : 0, card ? card.offset.y : 0);
    u.uAspect.value = card ? card.aspect : 1;
    u.uRadius.value = card ? card.radius : 0;
    u.uCA.value = card ? card.ca : 0;
    u.uMirror.value = card && card.mirror ? 1 : 0;
    u.uAlpha.value = card ? card.alpha : 0;
    if (card) {
      u.uAxisU.value.copy(card.axisU);
      u.uAxisV.value.copy(card.axisV);
      u.uCell.value.set(card.cellU, card.cellV);
    }
    return mat;
  };
  let points = null;
  let count = 0;
  // A pool built (and compiled by the caller) with the targets, so the hand-off frame only
  // re-aims materials instead of setting new ones up.
  let pool = [];
  let materials = [];
  const pooled = (k) => {
    while (pool.length <= k) pool.push(makeMaterial(null));
    return pool[k];
  };
  let lastSources = null;
  let orderBox = null;
  // Text targets, kept to be dealt out by the pairing: px, colour, reading order, coherent order.
  let tDst = null;
  let tCol = null;
  let tOrder = null;
  let tSorted = null;
  // Per particle, from setSources: rough screen position now, depth in its card, release p.
  let sx = null;
  let sy = null;
  let edge = null;
  let pairing = null; // the pending pairing frame's token
  let stats = {};

  function disposeMaterials() {
    pool.forEach((m) => m.dispose());
    pool = [];
    materials = [];
  }

  function disposeGeometry() {
    if (!points) return;
    scene.remove(points);
    points.geometry.dispose();
    points = null;
  }

  // Deal the targets out to the particles by rank in coherentOrder, so the r-th source (by screen
  // position) takes the target at the same x and y quantiles, and set each one's flight.
  function pair() {
    const t0 = performance.now();
    const geo = points.geometry;
    const pos = geo.getAttribute('position');
    const col = geo.getAttribute('aDstColor');
    const seed = geo.getAttribute('aSeed');
    const rel = geo.getAttribute('aRelease');
    const order = softOrder(sx, sy, count);
    let paired = 0;
    let random = 0;
    for (let r = 0; r < count; r += 1) {
      const i = order[r];
      const t = tSorted[r];
      pos.array.set([tDst[t * 2], tDst[t * 2 + 1], 0], i * 3);
      col.array.set([tCol[t * 3], tCol[t * 3 + 1], tCol[t * 3 + 2]], i * 3);
      const [leave, arrive] = flightWindow(tOrder[t], edge[i], rel.array[i]);
      seed.array.set([tOrder[t], leave, Math.random() * 2 - 1, arrive], i * 4);
      paired += Math.hypot(tDst[t * 2] - sx[i], tDst[t * 2 + 1] - sy[i]);
      random += Math.hypot(tDst[r * 2] - sx[i], tDst[r * 2 + 1] - sy[i]); // targets are shuffled
    }
    [pos, col, seed].forEach((a) => { a.needsUpdate = true; });
    stats = {
      ...stats,
      count,
      meanPath: paired / Math.max(1, count),
      meanPathRandom: random / Math.max(1, count),
      pairMs: performance.now() - t0,
    };
    return stats;
  }

  // cards: [{ project(u, v) → [x, y] px (v down the card as seen), world(u, v, out) → Vector3,
  // axisU, axisV (world per unit geometry uv), depth, texture, repeat, offset, aspect, radius, ca,
  // mirror, alpha }]. Particles go to each card by the on-screen area of its visible part, as a
  // grid of tiles in one contiguous range per card, so each card is one draw with its own texture.
  function setSources(cards, W, H) {
    lastSources = { cards, W, H };
    if (!points) return Promise.resolve(null);
    const t0 = performance.now();
    const geo = points.geometry;
    const srcW = geo.getAttribute('aSrcWorld');
    const uv = geo.getAttribute('aUv');
    const rel = geo.getAttribute('aRelease');
    const windows = cards.map((c) => screenWindow(c.project, W, H));
    const area = cards.map((c, k) => (windows[k] ? windowArea(c.project, windows[k]) : 0));
    const total = area.reduce((a, b) => a + b, 0);
    materials = [];
    geo.clearGroups();
    sx = new Float32Array(count);
    sy = new Float32Array(count);
    edge = new Float32Array(count);
    const edgeOf = edge;
    const tmp = new THREE.Vector3();
    let i = 0;
    if (total > 0) {
      const shares = area.map((a) => Math.floor((count * a) / total));
      const largest = area.indexOf(Math.max(...area));
      shares[largest] += count - shares.reduce((a, b) => a + b, 0);
      const depths = cards.filter((c, k) => shares[k] > 0).map((c) => c.depth);
      const dMin = Math.min(...depths);
      const dSpan = Math.max(1e-3, Math.max(...depths) - dMin);
      cards.forEach((card, k) => {
        const share = shares[k];
        const win = windows[k];
        if (share < 1 || !win) return;
        const [ax, ay] = card.project(win.u0, win.v0);
        const [bx, by] = card.project(win.u1, win.v0);
        const [cx, cy] = card.project(win.u0, win.v1);
        const wPx = Math.hypot(bx - ax, by - ay);
        const hPx = Math.hypot(cx - ax, cy - ay);
        const cols = Math.max(1, Math.round(Math.sqrt((share * wPx) / Math.max(1, hPx))));
        const rows = Math.max(1, Math.floor(share / cols));
        const du = (win.u1 - win.u0) / cols;
        const dv = (win.v1 - win.v0) / rows;
        const start = i;
        const depthRank = (card.depth - dMin) / dSpan; // nearer cards let go first
        // Roughly where each tile sits on screen now (bilinear over the window's projected
        // corners: plenty for pairing, and far cheaper than projecting each one).
        const [dx, dy] = card.project(win.u1, win.v1);
        const at = (u, v) => {
          const a = (u - win.u0) / Math.max(1e-6, win.u1 - win.u0);
          const b = (v - win.v0) / Math.max(1e-6, win.v1 - win.v0);
          return [
            (1 - b) * ((1 - a) * ax + a * bx) + b * ((1 - a) * cx + a * dx),
            (1 - b) * ((1 - a) * ay + a * by) + b * ((1 - a) * cy + a * dy),
          ];
        };
        const put = (u, v) => {
          // v runs down the card as seen; geometry v runs up.
          card.world(u, v, tmp);
          srcW.array.set([tmp.x, tmp.y, tmp.z], i * 3);
          uv.array.set([u, 1 - v], i * 2);
          // Edge-first: 0 on the rim, 1 at the centre, in card-height units.
          const rim = Math.min(Math.min(u, 1 - u) * card.aspect, Math.min(v, 1 - v));
          const inner = Math.min(1, rim / (0.5 * Math.min(card.aspect, 1)));
          rel.array[i] = 0.02 + 0.08 * depthRank + 0.1 * inner + 0.06 * Math.random();
          [sx[i], sy[i]] = at(u, v);
          edgeOf[i] = EDGE_LEAD * inner + (1 - EDGE_LEAD) * Math.random();
          i += 1;
        };
        for (let r = 0; r < rows; r += 1) {
          for (let c = 0; c < cols; c += 1) put(win.u0 + (c + 0.5) * du, win.v0 + (r + 0.5) * dv);
        }
        // The grid rounding leaves a few over: doubled up at random in the same window.
        while (i - start < share) {
          const ru = win.u0 + Math.random() * (win.u1 - win.u0);
          put(ru, win.v0 + Math.random() * (win.v1 - win.v0));
        }
        materials.push(aimMaterial(pooled(materials.length), { ...card, cellU: du, cellV: dv }));
        geo.addGroup(start, i - start, materials.length - 1);
      });
    }
    if (i < count) {
      // Nothing left to break up: invisible stand-ins that only show once they have flown.
      for (; i < count; i += 1) {
        srcW.array.set([0, 0, -1e3], i * 3);
        uv.array.set([0.5, 0.5], i * 2);
        rel.array[i] = 0;
        sx[i] = Math.random() * W;
        sy[i] = Math.random() * H;
        edgeOf[i] = Math.random();
      }
      materials.push(aimMaterial(pooled(materials.length), null));
      geo.addGroup(0, count, materials.length - 1);
    }
    points.material = materials;
    srcW.needsUpdate = true;
    uv.needsUpdate = true;
    rel.needsUpdate = true;
    // Until paired, nothing departs or reveals (PENDING is beyond any flight). The pairing (the
    // sort) runs on the next frame, off the hand-off frame; no particle is released before then.
    const seed = geo.getAttribute('aSeed');
    for (let k = 0; k < count; k += 1) seed.array.set([PENDING, PENDING, 0, PENDING + 1], k * 4);
    seed.needsUpdate = true;
    stats = { handoffMs: performance.now() - t0 };
    const token = {};
    pairing = token;
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        if (pairing !== token || !points) { resolve(null); return; }
        pairing = null;
        resolve(pair());
      });
    });
  }

  function build(targets, rtl = false) {
    disposeGeometry();
    count = targets.count;
    orderBox = inkBox(targets.dst, count, rtl);
    tDst = new Float32Array(count * 2);
    tOrder = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const [x, y] = [targets.dst[i * 3], targets.dst[i * 3 + 1]];
      tDst.set([x, y], i * 2);
      tOrder[i] = Math.min(1, Math.max(0, readingOrder(x, y, orderBox)));
    }
    tCol = targets.color;
    tSorted = coherentOrder(
      tDst.filter((v, k) => k % 2 === 0),
      tDst.filter((v, k) => k % 2 === 1),
      count,
    );
    const seed = new Float32Array(count * 4);
    for (let k = 0; k < count; k += 1) seed.set([PENDING, PENDING, 0, PENDING + 1], k * 4);
    const geo = createPointGeometry({
      position: [targets.dst.slice(), 3],
      aDstColor: [targets.color.slice(), 3],
      aSrcWorld: [new Float32Array(count * 3), 3],
      aUv: [new Float32Array(count * 2), 2],
      aRelease: [new Float32Array(count), 1],
      aSeed: [seed, 4],
    });
    disposeMaterials();
    for (let k = 0; k < MATERIAL_POOL; k += 1) pooled(k);
    materials = pool;
    // Every pooled material drawn over the full range for the warm-up compile; setSources regroups.
    pool.forEach((m, k) => geo.addGroup(0, k ? 0 : count, k));
    points = createPoints(geo, materials);
    points.frustumCulled = false; // positions are clip-space; the bounds three would test are not
    points.renderOrder = renderOrder;
    points.visible = false;
    shared.uSize.value = targets.size;
    scene.add(points);
    if (lastSources) return setSources(lastSources.cards, lastSources.W, lastSources.H);
    return Promise.resolve(null);
  }

  // zoom: [zoomT at p = 0, zoomT per unit p]; camZ: [CAM_Z_SPHERE, CAM_Z_END].
  function setFrame({
    p, fade, pinTop, W, H, dpr, camera, zoom, camZ,
  }) {
    shared.uP.value = p;
    shared.uFade.value = fade;
    shared.uPinTop.value = pinTop;
    shared.uViewport.value.set(W, H);
    shared.uDpr.value = dpr;
    if (camera) shared.uProj.value.copy(camera.projectionMatrix);
    if (zoom) shared.uZoom.value.set(zoom[0], zoom[1]);
    if (camZ) shared.uCamZ.value.set(camZ[0], camZ[1]);
  }

  function setVisible(v) { if (points) points.visible = v; }

  function dispose() {
    pairing = null;
    disposeGeometry();
    disposeMaterials();
    lastSources = null;
  }

  return {
    build,
    setSources,
    setFrame,
    setVisible,
    isBuilt: () => !!points,
    getOrderBox: () => orderBox,
    getStats: () => stats,
    getDrawCount: () => (points ? points.geometry.groups.length : 0),
    dispose,
  };
}
