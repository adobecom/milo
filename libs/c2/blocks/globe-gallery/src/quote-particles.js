import * as THREE from '../../../../deps/three.js';
import {
  QUOTE_POINTS_VERT, QUOTE_POINTS_FRAG, QUOTE_PLANE_VERT, QUOTE_PLANE_FRAG,
  QUOTE_MOTIONS, QUOTE_CRISP_P, QUOTE_ARRIVE_JITTER,
} from './shaders.js';

// The WebGL pull quote: card pixels scatter and fly into the quote's glyphs, then hand over to a
// crisp raster of the same text. The DOM figure stays the layout source and the a11y copy; this
// module only draws what it measured. All coordinates are CSS px from the top-left of the rail,
// which shares its box with the canvas while the quote is on screen. See README (WebGL pull quote).

const INK_ALPHA = 128; // raster alpha that counts as a target pixel
const PROBE = 24; // grid that finds the on-screen part of each card
const DST_SIZE = 2; // until the first layout measures the spacing
const EDGE_LEAD = 0.75; // share of the departure order set by distance from the card's edge
const RASTER_PAD = 6; // px around the figure so antialiased edges are not clipped
// The last glyph is crisp here; the whole quote is the crisp raster from then on.
const CRISP_P = QUOTE_CRISP_P;
export const QUOTE_LIVE_P = CRISP_P;
const DST_SPACING = 1.25; // landed dot size, as a multiple of the targets' mean spacing

function textLines(el, ox, oy) {
  const cs = getComputedStyle(el);
  const style = {
    font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
    color: cs.getPropertyValue('--gg-pq-ink').trim() || '#fafafa',
    rtl: cs.direction === 'rtl',
    letterSpacing: cs.letterSpacing,
  };
  const lines = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const { data } = node;
    let line = null;
    let i = 0;
    Array.from(data).forEach((ch) => {
      const start = i;
      i += ch.length;
      if (/\s/.test(ch)) return;
      range.setStart(node, start);
      range.setEnd(node, i);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (!line || Math.abs(r.top - line.top) > r.height * 0.5) {
        line = {
          ...style, node, start, end: i, top: r.top, left: r.left, right: r.right,
        };
        lines.push(line);
        return;
      }
      line.end = i;
      line.top = Math.min(line.top, r.top);
      line.left = Math.min(line.left, r.left);
      line.right = Math.max(line.right, r.right);
    });
  }
  return lines.map((l) => ({
    ...l,
    text: l.node.data.slice(l.start, l.end),
    node: null,
    top: l.top - oy,
    left: l.left - ox,
    right: l.right - ox,
  }));
}

const TEXT_SEL = '.globe-gallery-pullquote-quote, .globe-gallery-pullquote-name, .globe-gallery-pullquote-role';

function fontsFor(figureEl) {
  return [...figureEl.querySelectorAll(TEXT_SEL)].map((el) => {
    const cs = getComputedStyle(el);
    return { font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, text: el.textContent };
  });
}

function measure(figureEl, railEl) {
  const origin = railEl.getBoundingClientRect();
  const fig = figureEl.getBoundingClientRect();
  if (!fig.width || !fig.height) return null;
  const cs = getComputedStyle(figureEl);
  const fx = fig.left - origin.left;
  const fy = fig.top - origin.top;
  const rw = parseFloat(cs.getPropertyValue('--gg-crosshair-width')) || 1;
  const pad = (side) => parseFloat(cs[`padding${side}`]) || 0;
  // Mirrors the ::before (horizontals) / ::after (verticals) crosshair in the stylesheet.
  const rules = [
    [fx, fy + pad('Top'), fig.width, rw],
    [fx, fy + fig.height - pad('Bottom') - rw, fig.width, rw],
    [fx + pad('Left'), fy, rw, fig.height],
    [fx + fig.width - pad('Right') - rw, fy, rw, fig.height],
  ];
  return {
    box: {
      x: fx - RASTER_PAD,
      y: fy - RASTER_PAD,
      w: fig.width + 2 * RASTER_PAD,
      h: fig.height + 2 * RASTER_PAD,
    },
    runs: [...figureEl.querySelectorAll(TEXT_SEL)]
      .flatMap((el) => textLines(el, origin.left, origin.top)),
    rules,
    ruleColor: cs.getPropertyValue('--gg-pq-rule-color').trim() || '#3a3a3a',
    rtl: cs.direction === 'rtl',
  };
}

function rasterize(m, dpr) {
  const x0 = Math.floor(m.box.x * dpr);
  const y0 = Math.floor(m.box.y * dpr);
  const w = Math.max(1, Math.ceil((m.box.x + m.box.w) * dpr) - x0);
  const h = Math.max(1, Math.ceil((m.box.y + m.box.h) * dpr) - y0);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  // Rule edges snap to device pixels so the 1px hairlines stay crisp.
  ctx.fillStyle = m.ruleColor;
  m.rules.forEach(([rx, ry, rw, rh]) => {
    const px = Math.round(rx * dpr) - x0;
    const py = Math.round(ry * dpr) - y0;
    ctx.fillRect(px, py, Math.max(1, Math.round(rw * dpr)), Math.max(1, Math.round(rh * dpr)));
  });
  ctx.setTransform(dpr, 0, 0, dpr, -x0, -y0);
  m.runs.forEach((run) => {
    ctx.font = run.font;
    ctx.fillStyle = run.color;
    ctx.direction = run.rtl ? 'rtl' : 'ltr';
    ctx.textAlign = run.rtl ? 'right' : 'left';
    ctx.textBaseline = 'alphabetic';
    if ('letterSpacing' in ctx) ctx.letterSpacing = run.letterSpacing === 'normal' ? '0px' : run.letterSpacing;
    const tm = ctx.measureText(run.text);
    // A Range box is the font's content area, so its top sits one font ascent above the baseline.
    const ascent = tm.fontBoundingBoxAscent ?? tm.actualBoundingBoxAscent;
    // Pull canvas advance onto the DOM's, so the hidden text and the drawn text share a box.
    const domW = run.right - run.left;
    const sx = tm.width > 0 ? Math.min(1.1, Math.max(0.9, domW / tm.width)) : 1;
    ctx.save();
    ctx.translate(run.rtl ? run.right : run.left, run.top + ascent);
    if (Math.abs(sx - 1) > 0.004) ctx.scale(sx, 1);
    ctx.fillText(run.text, 0, 0);
    ctx.restore();
  });
  return {
    canvas, ctx, x0, y0, w, h,
  };
}

// ?pqmotion= picks the flight (see QUOTE_MOTIONS); anything else is the default, abc.
export function parseMotion(search = '') {
  const mode = new URLSearchParams(search).get('pqmotion');
  return Object.prototype.hasOwnProperty.call(QUOTE_MOTIONS, mode) ? mode : 'abc';
}

const PENDING = 9; // departure/arrival p before pairing: beyond any flight
const PAIR_BANDS = 8; // x bands of the 2D quantile order (8 measured best of 4–32)

// Indices of the first `count` points sorted by `key`, via one native typed-array sort of packed
// (quantized key, index) pairs.
function sortBy(key, idx) {
  const SLOT = 2 ** 20; // index bits under the key; counts stay well below
  const m = idx.length;
  let lo = Infinity; let hi = -Infinity;
  for (let j = 0; j < m; j += 1) {
    const v = key[idx[j]];
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  const scale = (SLOT - 1) / Math.max(1e-6, hi - lo);
  const packed = new Float64Array(m);
  for (let j = 0; j < m; j += 1) packed[j] = Math.round((key[idx[j]] - lo) * scale) * SLOT + idx[j];
  packed.sort();
  const out = new Uint32Array(m);
  for (let j = 0; j < m; j += 1) out[j] = packed[j] % SLOT;
  return out;
}

// A locality-preserving order over the set's own extent: PAIR_BANDS equal-count bands by x, each
// read top to bottom. Rank r in one set and rank r in another sit at the same x and y quantiles,
// so pairing two sets by rank keeps neighbours together and paths short (a cheap stand-in for
// optimal transport; about half the random pairing's path on the page, see README).
export function coherentOrder(xs, ys, count = xs.length) {
  const all = new Uint32Array(count);
  for (let i = 0; i < count; i += 1) all[i] = i;
  const byX = sortBy(xs, all);
  const out = new Uint32Array(count);
  for (let b = 0; b < PAIR_BANDS; b += 1) {
    const from = Math.floor((b * count) / PAIR_BANDS);
    const to = Math.floor(((b + 1) * count) / PAIR_BANDS);
    if (to > from) out.set(sortBy(ys, byX.subarray(from, to)), from);
  }
  return out;
}

// Soft pairing: the band order with noisy sort keys and near-rank swaps, so neighbouring cards'
// particles interleave at the band seams and card colours dither instead of tiling the text.
const SOFT_X = 1; // ± x key noise, in band widths
const SOFT_Y = 0.12; // ± y key noise, as a share of the set's height
const SOFT_SWAP = 0.2; // share of target ranks that trade sources with a near rank
const SOFT_SWAP_SPAN = 1 / 32; // how near, as a share of all ranks

function extent(arr, count) {
  let lo = Infinity; let hi = -Infinity;
  for (let i = 0; i < count; i += 1) {
    if (arr[i] < lo) lo = arr[i];
    if (arr[i] > hi) hi = arr[i];
  }
  return Math.max(1e-6, hi - lo);
}

export default function createQuoteParticles({ figureEl, railEl, count, motion = 'abc' }) {
  const n = count;
  const M = QUOTE_MOTIONS[motion] || QUOTE_MOTIONS.abc;
  const group = new THREE.Group();
  group.visible = false;

  // Text targets, shared out to the card draws by setSources.
  const tDst = new Float32Array(n * 2);
  const tCol = new Float32Array(n * 3);
  const tOrder = new Float32Array(n); // reading order 0 → 1
  let tSorted = new Uint32Array(0); // target indices in coherentOrder
  let stats = {};
  let pairing = null; // the pending pairing frame's token

  // One set of uniform objects, referenced by every card material, so a frame updates them once.
  const shared = {
    uP: { value: 0 },
    uView: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uDstSize: { value: DST_SIZE },
    uAlpha: { value: 1 },
    uZoomT: { value: new THREE.Vector2() },
    uCentre: { value: new THREE.Vector2() },
    uCamZ: { value: new THREE.Vector2() },
  };
  let draws = []; // [{ points, mat, geo }]
  let lastQuads = null;

  const planeGeo = new THREE.BufferGeometry();
  planeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  planeGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));
  planeGeo.setIndex([0, 2, 1, 2, 3, 1]);
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uP: shared.uP,
      uBox: { value: { x: 0, y: 0, z: 1, w: 1 } },
      uRtl: { value: 0 },
      uArrive: { value: new THREE.Vector2(M.arriveStart, M.arriveSpan) },
      uView: shared.uView,
    },
    vertexShader: QUOTE_PLANE_VERT,
    fragmentShader: QUOTE_PLANE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.frustumCulled = false;
  plane.renderOrder = 1e6 + 1;
  group.add(plane);

  let ready = false; // targets + raster exist
  let generation = 0;
  let version = 0; // bumps whenever the buffers or raster change
  let stateKey = '';
  let drawnKey = '';
  let lastP = 0;

  function writeTargets(r, m, dpr) {
    const { data } = r.ctx.getImageData(0, 0, r.w, r.h);
    const step = Math.max(1, Math.round(dpr));
    const cand = [];
    for (let y = 0; y < r.h; y += step) {
      for (let x = 0; x < r.w; x += step) {
        const k = (y * r.w + x) * 4;
        if (data[k + 3] >= INK_ALPHA) cand.push(k);
      }
    }
    if (!cand.length) return false;
    // Partial Fisher-Yates: a uniform pick when there is ink to spare, a cycle when there is not.
    const pick = Uint32Array.from(cand);
    const take = Math.min(n, pick.length);
    for (let i = 0; i < take; i += 1) {
      const j = i + Math.floor(Math.random() * (pick.length - i));
      [pick[i], pick[j]] = [pick[j], pick[i]];
    }
    const { box } = m;
    planeMat.uniforms.uBox.value = { x: box.x, y: box.y, z: box.w, w: box.h };
    planeMat.uniforms.uRtl.value = m.rtl ? 1 : 0;
    // Landed dots a little wider than their spacing, so a glyph's particles read as a fill.
    const spacing = Math.sqrt(cand.length / n);
    shared.uDstSize.value = Math.min(4, Math.max(1.6, DST_SPACING * spacing));
    const jitter = pick.length < n ? 0.6 : 0;
    for (let i = 0; i < n; i += 1) {
      const k = pick[i % take];
      const p = k / 4;
      const px = (r.x0 + (p % r.w) + 0.5) / dpr + (Math.random() - 0.5) * jitter;
      const py = (r.y0 + Math.floor(p / r.w) + 0.5) / dpr + (Math.random() - 0.5) * jitter;
      tDst[i * 2] = px;
      tDst[i * 2 + 1] = py;
      tCol.set([data[k] / 255, data[k + 1] / 255, data[k + 2] / 255], i * 3);
      const xn = (px - box.x) / Math.max(1, box.w);
      const yn = (py - box.y) / Math.max(1, box.h);
      // Must match QUOTE_PLANE_FRAG's order, which reveals the crisp text pixel by pixel.
      tOrder[i] = Math.min(1, Math.max(0, (m.rtl ? 1 - xn : xn) * 0.7 + yn * 0.3));
    }
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i += 1) { xs[i] = tDst[i * 2]; ys[i] = tDst[i * 2 + 1]; }
    tSorted = coherentOrder(xs, ys);
    // converge bends its paths around the quote's centre.
    shared.uCentre.value.set(xs.reduce((a, v) => a + v, 0) / n, ys.reduce((a, v) => a + v, 0) / n);
    return true;
  }

  function writePlane(r, dpr) {
    const x0 = r.x0 / dpr;
    const y0 = r.y0 / dpr;
    const x1 = (r.x0 + r.w) / dpr;
    const y1 = (r.y0 + r.h) / dpr;
    planeGeo.attributes.position.array.set([x0, y0, 0, x1, y0, 0, x0, y1, 0, x1, y1, 0]);
    planeGeo.attributes.position.needsUpdate = true;
    const tex = new THREE.CanvasTexture(r.canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    if (planeMat.uniforms.uMap.value) planeMat.uniforms.uMap.value.dispose();
    planeMat.uniforms.uMap.value = tex;
  }

  function clearDraws() {
    draws.forEach(({ points, mat, geo }) => {
      group.remove(points);
      geo.dispose();
      mat.dispose();
    });
    draws = [];
  }

  // A particle's release p: where it eases off the camera's dolly. It depends only on how deep it
  // sits in its card (`edge`: 0 rim → 1 centre, loosened), so the cards tear from the rim.
  const releaseAt = (edge) => (M.release ? M.release[0] + M.release[1] * edge : M.departMax * edge);

  // [departure, arrival] p once the particle is paired with a target of reading order `order`.
  function flight(order, edge, jitter = 0) {
    const arrive = M.arriveStart + M.arriveSpan * order + jitter;
    const release = releaseAt(edge);
    if (!M.fly) return [release, arrive]; // converge: one long leg, straight from the release
    // A fixed flight ending at the particle's own arrival, so only a band is airborne at once;
    // rim particles fly longer so they still leave first. Never before the release.
    const leave = arrive - M.fly * (1 + M.edgeFly * (1 - edge));
    return [Math.min(arrive - 0.5 * M.fly, Math.max(release, leave)), arrive];
  }

  // One card's (or the fallback's) particles, drawn as tiles from the hand-off frame on. Their
  // targets come with the pairing (fillDraw); until then they hold at PENDING, never reached.
  function addDraw(card, uvs, cell) {
    const k = uvs.length / 2;
    const geo = new THREE.BufferGeometry();
    const dst = new Float32Array(k * 3);
    const rand = new Float32Array(k * 4);
    const edge = new Float32Array(k);
    for (let j = 0; j < k; j += 1) {
      const u = uvs[j * 2];
      const v = uvs[j * 2 + 1];
      const inner = card ? Math.min(1, 2 * Math.min(u, 1 - u, v, 1 - v)) : Math.random();
      edge[j] = EDGE_LEAD * inner + (1 - EDGE_LEAD) * Math.random();
      rand.set([PENDING, releaseAt(edge[j]), Math.random() * 2 - 1, PENDING], j * 4);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(dst, 3));
    geo.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
    geo.setAttribute('aDstCol', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4));
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        ...shared,
        uMap: { value: card ? card.tex : null },
        uRepeat: { value: card ? card.repeat : new THREE.Vector2(1, 1) },
        uOffset: { value: card ? card.offset : new THREE.Vector2() },
        uMirror: { value: card && card.mirror ? 1 : 0 },
        uAspect: { value: card ? card.aspect : 1 },
        uRadius: { value: card ? card.radius : 0 },
        uCardAlpha: { value: card ? card.alpha : 1 },
        uOrigin: { value: card ? card.origin : new THREE.Vector3() },
        uAxisU: { value: card ? card.axisU : new THREE.Vector3() },
        uAxisV: { value: card ? card.axisV : new THREE.Vector3() },
        uCell: { value: new THREE.Vector2(cell[0], cell[1]) },
        uScreenSrc: { value: card ? 0 : 1 },
      },
      defines: { PQ_MOTION: M.id },
      vertexShader: QUOTE_POINTS_VERT,
      fragmentShader: QUOTE_POINTS_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.renderOrder = 1e6 + (card ? card.order : 0) / 1e4; // the cards' own depth order
    group.add(points);
    draws.push({ points, mat, geo, count: k, edge });
  }

  // A draw's targets from the coherent rank each particle took.
  function fillDraw({ geo, edge }, ranks) {
    const { position, aDstCol, aRand } = geo.attributes;
    for (let j = 0; j < ranks.length; j += 1) {
      const i = tSorted[ranks[j]];
      position.array.set([tDst[i * 2], tDst[i * 2 + 1]], j * 3);
      aDstCol.array.set([tCol[i * 3], tCol[i * 3 + 1], tCol[i * 3 + 2]], j * 3);
      const jitter = (Math.random() * 2 - 1) * QUOTE_ARRIVE_JITTER;
      const [leave, arrive] = flight(tOrder[i], edge[j], jitter);
      aRand.array[j * 4] = leave;
      aRand.array[j * 4 + 3] = arrive;
    }
    [position, aDstCol, aRand].forEach((a) => { a.needsUpdate = true; });
  }

  // Mean straight-line path of the pairing, against the old random one.
  function pathStats(sx, sy, ranks, k) {
    let paired = 0; let random = 0;
    for (let i = 0; i < k; i += 1) {
      const t = tSorted[ranks[i]];
      paired += Math.hypot(tDst[t * 2] - sx[i], tDst[t * 2 + 1] - sy[i]);
      const q = i % n;
      random += Math.hypot(tDst[q * 2] - sx[i], tDst[q * 2 + 1] - sy[i]);
    }
    return { count: k, meanPath: paired / Math.max(1, k), meanPathRandom: random / Math.max(1, k) };
  }

  // Source order r takes the r-th quantile of the targets' coherent order.
  function quantileRanks(order, k) {
    const ranks = new Uint32Array(k);
    for (let r = 0; r < k; r += 1) ranks[order[r]] = Math.min(n - 1, Math.floor((r * n) / k));
    return ranks;
  }

  // Each source's target rank under soft pairing (see SOFT_X).
  function softRanks(xs, ys, k) {
    const bw = (SOFT_X * extent(xs, k)) / PAIR_BANDS;
    const bh = SOFT_Y * extent(ys, k);
    const nx = new Float32Array(k);
    const ny = new Float32Array(k);
    for (let i = 0; i < k; i += 1) {
      nx[i] = xs[i] + (Math.random() * 2 - 1) * bw;
      ny[i] = ys[i] + (Math.random() * 2 - 1) * bh;
    }
    const order = coherentOrder(nx, ny, k);
    const ranks = quantileRanks(order, k);
    // Swaps along the order, so a target trades its source with a nearby target's.
    const span = Math.max(1, Math.round(SOFT_SWAP_SPAN * k));
    for (let r = 0; r < k; r += 1) {
      if (Math.random() < SOFT_SWAP) {
        const q = Math.min(k - 1, Math.max(0, r + Math.round((Math.random() * 2 - 1) * span)));
        const [a, b] = [order[r], order[q]];
        [ranks[a], ranks[b]] = [ranks[b], ranks[a]];
      }
    }
    return ranks;
  }

  // cards: [{ project(u, v) → [x, y] px now, origin, axisU, axisV (world), tex, repeat, offset,
  // mirror, aspect, radius, alpha, order }], u right and v down the card as seen. The particle
  // budget is shared by the on-screen area of each card's visible part and laid on a grid over it.
  function setSources(cards, W, H) {
    lastQuads = { cards, W, H };
    clearDraws();
    if (!ready) return Promise.resolve(null);
    const inView = ([x, y]) => x > -0.05 * W && x < 1.05 * W && y > -0.05 * H && y < 1.05 * H;
    const windows = cards.map(({ project }) => {
      let u0 = 1; let u1 = 0; let v0 = 1; let v1 = 0;
      for (let a = 0; a <= PROBE; a += 1) {
        for (let b = 0; b <= PROBE; b += 1) {
          if (inView(project(a / PROBE, b / PROBE))) {
            u0 = Math.min(u0, a / PROBE); u1 = Math.max(u1, a / PROBE);
            v0 = Math.min(v0, b / PROBE); v1 = Math.max(v1, b / PROBE);
          }
        }
      }
      if (u1 < u0) {
        // A sliver between probe points still counts: the whole card, if its box meets the view.
        const pts = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => project(u, v));
        const xs = pts.map((q) => q[0]);
        const ys = pts.map((q) => q[1]);
        const meets = Math.max(...xs) > 0 && Math.min(...xs) < W
          && Math.max(...ys) > 0 && Math.min(...ys) < H;
        return meets ? { u0: 0, u1: 1, v0: 0, v1: 1 } : null;
      }
      const pad = 1 / PROBE;
      return {
        u0: Math.max(0, u0 - pad),
        u1: Math.min(1, u1 + pad),
        v0: Math.max(0, v0 - pad),
        v1: Math.min(1, v1 + pad),
      };
    });
    const area = cards.map(({ project }, ci) => {
      const win = windows[ci];
      if (!win) return 0;
      const pts = [[win.u0, win.v0], [win.u1, win.v0], [win.u1, win.v1], [win.u0, win.v1]]
        .map(([u, v]) => project(u, v));
      let a2 = 0; // shoelace
      pts.forEach(([x, y], k) => { const [nx, ny] = pts[(k + 1) % 4]; a2 += x * ny - nx * y; });
      return Math.abs(a2) / 2;
    });
    const total = area.reduce((a, b) => a + b, 0);
    const t0 = performance.now();
    pairing = null;
    // Every particle's cell, and roughly where it sits on screen now (bilinear over the window's
    // projected corners: plenty for pairing, and far cheaper than projecting each one).
    const grids = [];
    if (!total) {
      const uvs = new Float32Array(n * 2).map(() => Math.random());
      grids.push({ card: null, uvs, cell: [0, 0] });
    } else {
      cards.forEach((card, ci) => {
        const win = windows[ci];
        const share = Math.floor((n * area[ci]) / total);
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
        const uvs = new Float32Array(cols * rows * 2);
        for (let r = 0; r < rows; r += 1) {
          for (let c = 0; c < cols; c += 1) {
            uvs[(r * cols + c) * 2] = win.u0 + (c + 0.5) * du;
            uvs[(r * cols + c) * 2 + 1] = win.v0 + (r + 0.5) * dv;
          }
        }
        const box = [[win.u0, win.v0], [win.u1, win.v0], [win.u1, win.v1], [win.u0, win.v1]];
        const corners = box.map(([u, v]) => card.project(u, v));
        grids.push({ card, uvs, cell: [du, dv], corners, win });
      });
    }
    const k = grids.reduce((sum, g) => sum + g.uvs.length / 2, 0);
    const sx = new Float32Array(k);
    const sy = new Float32Array(k);
    let o = 0;
    grids.forEach(({ uvs, corners, win }) => {
      for (let j = 0; j < uvs.length / 2; j += 1) {
        if (!corners) {
          sx[o] = uvs[j * 2] * W;
          sy[o] = uvs[j * 2 + 1] * H;
        } else {
          const a = (uvs[j * 2] - win.u0) / Math.max(1e-6, win.u1 - win.u0);
          const b = (uvs[j * 2 + 1] - win.v0) / Math.max(1e-6, win.v1 - win.v0);
          const [p0, p1, p2, p3] = corners;
          sx[o] = (1 - b) * ((1 - a) * p0[0] + a * p1[0]) + b * ((1 - a) * p3[0] + a * p2[0]);
          sy[o] = (1 - b) * ((1 - a) * p0[1] + a * p1[1]) + b * ((1 - a) * p3[1] + a * p2[1]);
        }
        o += 1;
      }
    });
    o = 0;
    const slices = grids.map(({ card, uvs, cell }) => {
      addDraw(card, uvs, cell);
      const slice = [o, o + uvs.length / 2];
      [, o] = slice;
      return slice;
    });
    stats = { count: k, handoffMs: performance.now() - t0 };
    performance.measure?.('globe-gallery pq sources', { start: t0, detail: { motion, ...stats } });
    version += 1;
    // The pairing waits, off the hand-off frame, and is split in two: the sort on the next frame,
    // the buffer fill on the one after. Nothing departs before its release, many frames later.
    const token = {};
    pairing = token;
    const nextFrame = () => new Promise((res) => { requestAnimationFrame(res); });
    const live = () => pairing === token;
    return nextFrame().then(() => {
      if (!live()) return null;
      const t1 = performance.now();
      const ranks = softRanks(sx, sy, k);
      const sortMs = performance.now() - t1;
      return nextFrame().then(() => {
        if (!live()) return null;
        const t2 = performance.now();
        draws.forEach((d, di) => fillDraw(d, ranks.subarray(...slices[di])));
        const fillMs = performance.now() - t2;
        stats = { ...stats, ...pathStats(sx, sy, ranks, k), sortMs, fillMs };
        const detail = { motion, ...stats };
        performance.measure?.('globe-gallery pq pairing', { start: t1, detail });
        version += 1;
        return stats;
      });
    });
  }

  // Async only for the font wait; measure → raster → targets run in one task so they agree.
  async function layout({ dpr }) {
    generation += 1;
    const gen = generation;
    if (document.fonts) {
      const loads = fontsFor(figureEl).map(({ font, text }) => document.fonts.load(font, text));
      await Promise.all([document.fonts.ready, ...loads]).catch(() => {});
    }
    if (gen !== generation || !figureEl.isConnected) return false;
    const m = measure(figureEl, railEl);
    if (!m || !m.runs.length) { ready = false; return false; }
    const r = rasterize(m, dpr);
    ready = writeTargets(r, m, dpr);
    if (ready) writePlane(r, dpr);
    if (ready && lastQuads) setSources(lastQuads.cards, lastQuads.W, lastQuads.H);
    version += 1;
    return ready;
  }

  // p is the flight progress; zoom = [zoomT at p 0, zoomT per unit p, CAM_Z_SPHERE, z span], so a
  // departed particle knows where the camera was when it left. active: false hides everything.
  function update(p, { W, H, dpr, active = true, zoom = [0, 0, 0, 0] }) {
    lastP = p;
    const show = ready && active;
    group.visible = show;
    shared.uP.value = p;
    shared.uView.value.set(W, H);
    shared.uDpr.value = dpr;
    shared.uZoomT.value.set(zoom[0], zoom[1]);
    shared.uCamZ.value.set(zoom[2], zoom[3]);
    draws.forEach(({ points }) => { points.visible = p < CRISP_P; });
    plane.visible = p > M.arriveStart;
    // Past CRISP_P every pixel is the finished raster, so further scroll changes nothing drawn.
    const drawnP = p >= CRISP_P ? 'crisp' : p;
    stateKey = `${drawnP}|${show}|${version}|${W}x${H}@${dpr}`;
  }

  return {
    object: group,
    layout,
    setSources,
    update,
    isReady: () => ready,
    drawCount: () => draws.length + 1,
    motion,
    getStats: () => stats,
    // Settled and already on the canvas: the caller may skip the draw.
    isIdle: () => lastP >= CRISP_P && stateKey === drawnKey,
    markDrawn: () => { drawnKey = stateKey; },
    invalidate: () => { drawnKey = ''; },
    dispose() {
      generation += 1;
      ready = false;
      pairing = null;
      clearDraws();
      if (group.parent) group.parent.remove(group);
      planeGeo.dispose();
      if (planeMat.uniforms.uMap.value) planeMat.uniforms.uMap.value.dispose();
      planeMat.dispose();
    },
  };
}
