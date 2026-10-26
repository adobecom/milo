import * as THREE from '../../../../deps/three.js';
import {
  QUOTE_POINTS_VERT, QUOTE_POINTS_FRAG, QUOTE_PLANE_VERT, QUOTE_PLANE_FRAG,
  QUOTE_FLIGHT as F, QUOTE_CRISP_P, QUOTE_ARRIVE_JITTER,
  QUOTE_MIN_DEPTH, QUOTE_RELEASE_REACH, QUOTE_TILE_MAX_K, PENDING_P,
} from './shaders.js';

// The pull-quote transition: card pixels swirl into the quote's glyphs, then hand over to a
// crisp raster of the same text. The DOM figure stays the layout source and the a11y copy; this
// module only draws what it measured. All coordinates are CSS px from the top-left of the rail,
// which shares its box with the canvas while the quote is on screen. See README (Pull quote).

const INK_ALPHA = 128; // raster alpha that counts as a target pixel
const PROBE = 24; // grid that finds the on-screen part of each card
const REMNANT_K = 4; // a remnant tile's size at the hand-off, in even shares of the view
const MIN_TILES = 256; // per card on screen at the release, however small
const SEED = 20240611; // every draw below is seeded: a scroll position always looks the same
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
  // The DOM's own baseline offset from a zero-size inline-block probe: canvas font metrics round
  // differently, which would put small text a pixel off the DOM copy the quote swaps to at rest.
  const probe = document.createElement('span');
  probe.style.cssText = 'display:inline-block;width:0;height:0';
  el.prepend(probe);
  const baseY = probe.getBoundingClientRect().bottom;
  probe.remove();
  const first = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let ascent = null;
  for (let n = first.nextNode(); n && ascent === null; n = first.nextNode()) {
    const k = n.data.search(/\S/);
    if (k >= 0) {
      range.setStart(n, k);
      range.setEnd(n, k + 1);
      ascent = baseY - range.getBoundingClientRect().top;
    }
  }
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
    ascent,
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
    figTop: fy,
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
    const ascent = run.ascent ?? tm.fontBoundingBoxAscent ?? tm.actualBoundingBoxAscent;
    // Pull canvas advance onto the DOM's, so the hidden text and the drawn text share a box.
    const domW = run.right - run.left;
    const sx = tm.width > 0 ? Math.min(1.1, Math.max(0.9, domW / tm.width)) : 1;
    ctx.save();
    // Layout snaps the figure's offset and each baseline within it to device pixels, separately;
    // canvas doesn't. Snap the same way, so the raster matches the DOM copy swapped in at rest.
    const snap = (v) => Math.round(v * dpr) / dpr;
    const base = snap(m.figTop) + snap(run.top + ascent - m.figTop);
    ctx.translate(run.rtl ? run.right : run.left, base);
    if (Math.abs(sx - 1) > 0.004) ctx.scale(sx, 1);
    ctx.fillText(run.text, 0, 0);
    ctx.restore();
  });
  return {
    canvas, ctx, x0, y0, w, h,
  };
}

const PENDING = PENDING_P;
// A released particle's stop stays inside this share of the view: what is left of its room to the
// edge is shared out softly (tanh), so stops never pile up on the edge.
const STOP_BOUND = 0.96;
const SEAM_RAMP = 0.3; // share of the paired window, from a remnant seam, that holds on longer
// A card's release window ends by the p at which less than KEEP_SEEN of what is seen of it at p 0
// is still in view (scanned in SCAN_STEP on a SCAN_PROBE grid), but not before MIN_LATE.
const KEEP_SEEN = 0.5;
const SCAN_STEP = 0.01;
const SCAN_PROBE = 8;
const MIN_LATE = 0.04;

// Park–Miller: a small seeded PRNG in (0, 1), exact in doubles.
export function seededRandom(seed) {
  let a = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

// The camera at flight progress p, as the shaders' camZAt (TL.camZAtZoomT along the runway);
// zoom = [zoomT at p 0, zoomT per unit p, CAM_Z_SPHERE, z span].
const clamp01 = (x) => Math.min(1, Math.max(0, x));
export function camZAt(zoom, p) {
  const z = clamp01(zoom[0] + p * zoom[1]);
  return zoom[2] - zoom[3] * (1 - (1 - z) ** 3);
}
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

export default function createQuoteParticles({ figureEl, railEl, count }) {
  const n = count;
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
    uCamZ: { value: new THREE.Vector2() },
  };
  let draws = []; // [{ points, mat, geo }]
  let lastQuads = null;
  let sourcesPaired = false; // the current sources have their targets

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
    const rnd = seededRandom(SEED);
    for (let i = 0; i < take; i += 1) {
      const j = i + Math.floor(rnd() * (pick.length - i));
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
      const px = (r.x0 + (p % r.w) + 0.5) / dpr + (rnd() - 0.5) * jitter;
      const py = (r.y0 + Math.floor(p / r.w) + 0.5) / dpr + (rnd() - 0.5) * jitter;
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
  const releaseAt = (edge) => F.release[0] + F.release[1] * edge;

  // [departure, arrival] p once the particle is paired with a target of reading order `order`.
  function flight(order, edge, release, jitter = 0) {
    const arrive = F.arriveStart + F.arriveSpan * order + jitter;
    // A fixed flight ending at the particle's own arrival, so only a band is airborne at once;
    // rim particles fly longer so they still leave first. Never before the release.
    const leave = arrive - F.fly * (1 + F.edgeFly * (1 - edge));
    return [Math.min(arrive - 0.5 * F.fly, Math.max(release, leave)), arrive];
  }

  // One card's (or the fallback's) particles: the `paired` first, then card-only remnant tiles.
  // Targets and departures come with the pairing (fillDraw); until then they hold at PENDING.
  function addDraw(card, {
    uvs, cells, edge, release, stop, paired,
  }) {
    const k = uvs.length / 2;
    const geo = new THREE.BufferGeometry();
    const rand = new Float32Array(k * 4);
    for (let j = 0; j < k; j += 1) {
      rand.set([PENDING, release[j], j < paired ? stop[j] : 0, PENDING], j * 4);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
    geo.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
    geo.setAttribute('aCell', new THREE.BufferAttribute(cells, 2));
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
        uAxisU: { value: card ? card.axisU : new THREE.Vector3(1, 0, 0) },
        uAxisV: { value: card ? card.axisV : new THREE.Vector3(0, -1, 0) },
        uScreenSrc: { value: card ? 0 : 1 },
      },
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
    draws.push({
      points, mat, geo, count: k, paired, edge, release,
    });
  }

  // A draw's targets from the coherent rank each paired particle took.
  function fillDraw({ geo, edge, release }, ranks, rnd) {
    const { position, aDstCol, aRand } = geo.attributes;
    for (let j = 0; j < ranks.length; j += 1) {
      const i = tSorted[ranks[j]];
      position.array.set([tDst[i * 2], tDst[i * 2 + 1]], j * 3);
      aDstCol.array.set([tCol[i * 3], tCol[i * 3 + 1], tCol[i * 3 + 2]], j * 3);
      const jitter = (rnd() * 2 - 1) * QUOTE_ARRIVE_JITTER;
      const [leave, arrive] = flight(tOrder[i], edge[j], release[j], jitter);
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
    return { meanPath: paired / Math.max(1, k), meanPathRandom: random / Math.max(1, k) };
  }

  // Source order r takes the r-th quantile of the targets' coherent order.
  function quantileRanks(order, k) {
    const ranks = new Uint32Array(k);
    for (let r = 0; r < k; r += 1) ranks[order[r]] = Math.min(n - 1, Math.floor((r * n) / k));
    return ranks;
  }

  // Each source's target rank under soft pairing (see SOFT_X).
  function softRanks(xs, ys, k, rnd) {
    const bw = (SOFT_X * extent(xs, k)) / PAIR_BANDS;
    const bh = SOFT_Y * extent(ys, k);
    const nx = new Float32Array(k);
    const ny = new Float32Array(k);
    for (let i = 0; i < k; i += 1) {
      nx[i] = xs[i] + (rnd() * 2 - 1) * bw;
      ny[i] = ys[i] + (rnd() * 2 - 1) * bh;
    }
    const order = coherentOrder(nx, ny, k);
    const ranks = quantileRanks(order, k);
    // Swaps along the order, so a target trades its source with a nearby target's.
    const span = Math.max(1, Math.round(SOFT_SWAP_SPAN * k));
    for (let r = 0; r < k; r += 1) {
      if (rnd() < SOFT_SWAP) {
        const q = Math.min(k - 1, Math.max(0, r + Math.round((rnd() * 2 - 1) * span)));
        const [a, b] = [order[r], order[q]];
        [ranks[a], ranks[b]] = [ranks[b], ranks[a]];
      }
    }
    return ranks;
  }

  // The source layout. cards: [{ origin, axisU, axisV (world; u right, v down the card's front),
  // tex, repeat, offset, aspect, radius, alpha, order }]; view: { W, H, zoom (as update), proj:
  // [P00, P11, P02, P12] of the camera's projection }. Everything is read off the CANONICAL camera
  // (camZAt), never the frame that happened to run it, so the layout is a pure function of the
  // cards and the runway: a fling and a slow scroll get the same particles. Each card is tiled:
  // - where it is still on screen at the end of its release window: paired tiles, the budget
  //   shared by that on-screen area, each easing to a stop in view with a fine tile, so the quote
  //   is made of what the user saw dissolve, in fine grains (see README, Source layout);
  // - the rest of what is on screen at p 0: coarse card-only tiles that ride the dolly off screen.
  function setSources(cards, view) {
    lastQuads = { cards, view };
    clearDraws();
    sourcesPaired = false;
    pairing = null;
    if (!ready) return Promise.resolve(null);
    const { W, H, zoom, proj: [P00, P11, P02, P12] } = view;
    const t0 = performance.now();
    const rnd = seededRandom(SEED);
    const z0 = camZAt(zoom, 0);
    const lateP = F.release[0] + F.release[1]; // the last release
    const share = Math.sqrt((W * H) / n); // px per tile, were the view evenly shared
    const toPx = (x, y, z, cz) => {
      const D = cz - z;
      if (D < 0.05) return null;
      return [((P00 * x) / D - P02 + 1) * 0.5 * W, (1 - ((P11 * y) / D - P12)) * 0.5 * H];
    };
    const at = (card, u, v) => [
      card.origin.x + card.axisU.x * u + card.axisV.x * v,
      card.origin.y + card.axisU.y * u + card.axisV.y * v,
      card.origin.z + card.axisU.z * u + card.axisV.z * v,
    ];
    const project = (card, u, v, cz) => toPx(...at(card, u, v), cz);
    // How many of a coarse probe grid's points on the card are in view at camera cz.
    const hitsAt = (card, cz) => {
      let hits = 0;
      for (let a = 0; a <= SCAN_PROBE; a += 1) {
        for (let b = 0; b <= SCAN_PROBE; b += 1) {
          const q = project(card, a / SCAN_PROBE, b / SCAN_PROBE, cz);
          if (q && q[0] >= 0 && q[0] <= W && q[1] >= 0 && q[1] <= H) hits += 1;
        }
      }
      return hits;
    };
    // The uv box of the card's part inside the view (margin m) at camera cz; probe-padded.
    const windowAt = (card, cz, m) => {
      const inView = (q) => q && q[0] > -m * W && q[0] < (1 + m) * W
        && q[1] > -m * H && q[1] < (1 + m) * H;
      let u0 = 1; let u1 = 0; let v0 = 1; let v1 = 0; let hits = 0;
      for (let a = 0; a <= PROBE; a += 1) {
        for (let b = 0; b <= PROBE; b += 1) {
          if (inView(project(card, a / PROBE, b / PROBE, cz))) {
            hits += 1;
            u0 = Math.min(u0, a / PROBE); u1 = Math.max(u1, a / PROBE);
            v0 = Math.min(v0, b / PROBE); v1 = Math.max(v1, b / PROBE);
          }
        }
      }
      if (!hits) return null;
      const pad = 1 / PROBE;
      return {
        u0: Math.max(0, u0 - pad),
        u1: Math.min(1, u1 + pad),
        v0: Math.max(0, v0 - pad),
        v1: Math.min(1, v1 + pad),
        hits,
      };
    };
    const quadArea = (card, w, cz) => {
      const pts = [[w.u0, w.v0], [w.u1, w.v0], [w.u1, w.v1], [w.u0, w.v1]]
        .map(([u, v]) => project(card, u, v, cz));
      if (pts.some((q) => !q)) return 0;
      let a2 = 0; // shoelace
      pts.forEach(([x, y], k) => { const [nx, ny] = pts[(k + 1) % 4]; a2 += x * ny - nx * y; });
      return Math.abs(a2) / 2;
    };
    const span = (w) => [w.u1 - w.u0, w.v1 - w.v0];
    // Cut [a0, a1] into cells about `step` wide, on lines from a0; returns the cell edges.
    const cuts = (a0, a1, step) => {
      const m = Math.max(1, Math.ceil((a1 - a0) / Math.max(1e-6, step) - 1e-6));
      return Array.from({ length: m + 1 }, (_, i) => a0 + ((a1 - a0) * i) / m);
    };
    const snapIn = (edges, lo, hi) => {
      let i0 = 0; let i1 = edges.length - 1;
      while (i0 < edges.length - 1 && edges[i0 + 1] <= lo) i0 += 1;
      while (i1 > 0 && edges[i1 - 1] >= hi) i1 -= 1;
      return [i0, i1];
    };
    const plans = [];
    cards.forEach((card) => {
      const corners = [[0, 0], [1, 0], [0, 1]].map(([u, v]) => project(card, u, v, z0));
      if (corners.some((q) => !q)) return; // reaches behind the camera: never the far side
      const outer = windowAt(card, z0, 0.05);
      if (!outer) return;
      // Screen winding tells a back face, which the card shader mirrors in u.
      const [q0, q1, q2] = corners;
      const mirror = (q1[0] - q0[0]) * (q2[1] - q0[1]) - (q1[1] - q0[1]) * (q2[0] - q0[0]) < 0;
      // Coarse remnant grid over the p-0 part; the paired window is snapped out to its lines so a
      // remnant tile never overlaps a paired one.
      const [ou, ov] = span(outer);
      const w0 = project(card, outer.u0, outer.v0, z0);
      const wu = project(card, outer.u1, outer.v0, z0);
      const wv = project(card, outer.u0, outer.v1, z0);
      const pxU = Math.hypot(wu[0] - w0[0], wu[1] - w0[1]) / Math.max(1e-6, ou);
      const pxV = Math.hypot(wv[0] - w0[0], wv[1] - w0[1]) / Math.max(1e-6, ov);
      const eu = cuts(outer.u0, outer.u1, (REMNANT_K * share) / Math.max(1e-6, pxU));
      const ev = cuts(outer.v0, outer.v1, (REMNANT_K * share) / Math.max(1e-6, pxV));
      // Its release window: the design's, or earlier if the dolly takes half of what is seen of it
      // at p 0 off screen before then (narrow views), so it always dissolves while in view.
      const seen0 = hitsAt(card, z0);
      let late = lateP;
      for (let q = SCAN_STEP; q < lateP; q += SCAN_STEP) {
        if (hitsAt(card, camZAt(zoom, q)) < KEEP_SEEN * seen0) {
          late = Math.max(MIN_LATE, q);
          break;
        }
      }
      const early = Math.min(F.release[0], late / 2);
      const zLate = camZAt(zoom, late);
      const seen = windowAt(card, zLate, 0);
      let fine = null;
      let area = 0;
      if (seen) {
        const [iu0, iu1] = snapIn(eu, seen.u0, seen.u1);
        const [iv0, iv1] = snapIn(ev, seen.v0, seen.v1);
        fine = {
          u0: eu[iu0], u1: eu[iu1], v0: ev[iv0], v1: ev[iv1], iu0, iu1, iv0, iv1,
        };
        // Its projected box, times the share of the box's probes actually in view.
        const [su, sv] = span(seen);
        const probes = (su * PROBE + 1) * (sv * PROBE + 1);
        area = quadArea(card, seen, zLate) * Math.min(1, seen.hits / probes);
      }
      plans.push({
        card: { ...card, mirror }, eu, ev, fine, area, early, late, zLate,
      });
    });
    // The remnant tiles first: what is left of the budget is shared by the paired areas.
    let remnant = 0;
    plans.forEach((pl) => {
      const cu = pl.eu.length - 1;
      const cv = pl.ev.length - 1;
      const inner = pl.fine ? (pl.fine.iu1 - pl.fine.iu0) * (pl.fine.iv1 - pl.fine.iv0) : 0;
      pl.remnant = cu * cv - inner;
      remnant += pl.remnant;
    });
    const total = plans.reduce((sum, pl) => sum + pl.area, 0);
    const nFine = Math.max(Math.floor(n / 2), n - remnant);
    const grids = [];
    const focal = 0.5 * P00 * W; // px per world unit at depth 1
    const tileMax = QUOTE_TILE_MAX_K * share;
    if (!total) {
      const k = nFine;
      const uvs = new Float32Array(k * 2).map(() => rnd());
      const edge = new Float32Array(k).map(() => rnd());
      const release = edge.map((e) => releaseAt(e));
      const sx = new Float32Array(k);
      const sy = new Float32Array(k);
      for (let j = 0; j < k; j += 1) { sx[j] = uvs[j * 2] * W; sy[j] = uvs[j * 2 + 1] * H; }
      const cells = new Float32Array(k * 2);
      grids.push({
        card: null, uvs, cells, edge, release, stop: edge, paired: k, sx, sy,
      });
    } else {
      plans.forEach(({
        card, eu, ev, fine, area, early, late, zLate,
      }) => {
        let cols = 0; let rows = 0;
        if (fine && area > 0) {
          const want = Math.max(MIN_TILES, Math.floor((nFine * area) / total));
          const a = project(card, fine.u0, fine.v0, zLate);
          const b = project(card, fine.u1, fine.v0, zLate);
          const c = project(card, fine.u0, fine.v1, zLate);
          const wPx = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 1;
          const hPx = a && c ? Math.hypot(c[0] - a[0], c[1] - a[1]) : 1;
          cols = Math.max(1, Math.round(Math.sqrt((want * wPx) / Math.max(1, hPx))));
          rows = Math.max(1, Math.floor(want / cols));
        }
        const kf = cols * rows;
        const rest = (eu.length - 1) * (ev.length - 1)
          - (fine && kf ? (fine.iu1 - fine.iu0) * (fine.iv1 - fine.iv0) : 0);
        const k = kf + rest;
        if (!k) return;
        const uvs = new Float32Array(k * 2);
        const cells = new Float32Array(k * 2);
        const release = new Float32Array(k);
        const stop = new Float32Array(kf);
        const edge = new Float32Array(kf);
        const sx = new Float32Array(kf);
        const sy = new Float32Array(kf);
        let kp = 0; // paired, from the front
        let kr = k; // remnant, from the back
        const put = (j, u, v, du, dv, rel) => {
          uvs[j * 2] = u; uvs[j * 2 + 1] = v;
          cells[j * 2] = du; cells[j * 2 + 1] = dv;
          release[j] = rel;
        };
        if (kf) {
          const lenU = Math.hypot(card.axisU.x, card.axisU.y, card.axisU.z);
          const lenV = Math.hypot(card.axisV.x, card.axisV.y, card.axisV.z);
          const spanU = fine.u1 - fine.u0;
          const spanV = fine.v1 - fine.v0;
          const du = spanU / cols;
          const dv = spanV / rows;
          const ext = Math.max(lenU * du, lenV * dv);
          for (let r = 0; r < rows; r += 1) {
            for (let c = 0; c < cols; c += 1) {
              const u = fine.u0 + (c + 0.5) * du;
              const v = fine.v0 + (r + 0.5) * dv;
              const inner = Math.min(1, 2 * Math.min(u, 1 - u, v, 1 - v));
              const e = EDGE_LEAD * inner + (1 - EDGE_LEAD) * rnd();
              // Next to the remnant (where the card runs off screen by lateP) it holds on until
              // lateP, when that seam is on the view's edge, so the tear is never a straight cut.
              const seam = Math.min(
                fine.u0 > 0 ? (u - fine.u0) / spanU : 1,
                fine.u1 < 1 ? (fine.u1 - u) / spanU : 1,
                fine.v0 > 0 ? (v - fine.v0) / spanV : 1,
                fine.v1 < 1 ? (fine.v1 - v) / spanV : 1,
              );
              const hold = Math.min(1, ((0.75 + 0.5 * rnd()) * seam) / SEAM_RAMP);
              const rel = early + (late - early) * Math.max(e, 1 - hold);
              const [x, y, z] = at(card, u, v);
              const zDep = camZAt(zoom, rel);
              const dRel = zDep - z;
              // rho(D) = dEdge / D: its offset from the view's centre, 1 on the edge, at depth D.
              const dx = (P00 * Math.abs(x)) / Math.max(1e-6, 1 + Math.sign(x) * P02);
              const dy = (P11 * Math.abs(y)) / Math.max(1e-6, 1 + Math.sign(y) * P12);
              const dEdge = Math.max(dx, dy);
              const rhoRel = dEdge / Math.max(1e-6, dRel);
              if (rhoRel >= STOP_BOUND) {
                // Out of view by its release: rides the dolly off with the rest of the card.
                kr -= 1;
                put(kr, u, v, du, dv, rel);
              } else {
                // Its natural stop (QUOTE_RELEASE_REACH of the depth left), its outward drift
                // softly limited to the room left in view, and its tile to tileMax.
                const dNat = dRel - QUOTE_RELEASE_REACH * Math.max(0.001, dRel - QUOTE_MIN_DEPTH);
                const room = STOP_BOUND - rhoRel;
                const rho = rhoRel + room * Math.tanh((dEdge / dNat - rhoRel) / room);
                const dStop = Math.max(dNat, dEdge / Math.max(1e-6, rho), (focal * ext) / tileMax);
                const zStop = z + Math.min(dRel, dStop);
                put(kp, u, v, du, dv, rel);
                stop[kp] = zStop;
                edge[kp] = e;
                [sx[kp], sy[kp]] = toPx(x, y, z, zStop);
                kp += 1;
              }
            }
          }
        }
        for (let a = 0; a < eu.length - 1; a += 1) {
          for (let b = 0; b < ev.length - 1; b += 1) {
            const inFine = fine && kf && a >= fine.iu0 && a < fine.iu1
              && b >= fine.iv0 && b < fine.iv1;
            if (!inFine) {
              kr -= 1;
              put(
                kr,
                (eu[a] + eu[a + 1]) / 2,
                (ev[b] + ev[b + 1]) / 2,
                eu[a + 1] - eu[a],
                ev[b + 1] - ev[b],
                late,
              );
            }
          }
        }
        grids.push({
          card,
          uvs,
          cells,
          release,
          stop,
          edge,
          paired: kp,
          sx: sx.subarray(0, kp),
          sy: sy.subarray(0, kp),
        });
      });
    }
    const k = grids.reduce((sum, g) => sum + g.paired, 0);
    const sx = new Float32Array(k);
    const sy = new Float32Array(k);
    let o = 0;
    const slices = grids.map((g) => {
      addDraw(g.card, g);
      sx.set(g.sx, o);
      sy.set(g.sy, o);
      const slice = [o, o + g.paired];
      [, o] = slice;
      return slice;
    });
    const all = grids.reduce((sum, g) => sum + g.uvs.length / 2, 0);
    const handoffMs = performance.now() - t0;
    stats = { count: all, paired: k, remnant: all - k, cards: grids.length, handoffMs };
    performance.measure?.('globe-gallery pq sources', { start: t0, detail: { ...stats } });
    version += 1;
    // The pairing waits, off the hand-off frame, and is split in two: the sort on the next frame,
    // the buffer fill on the one after. Until it is done the particles stay hidden and the caller
    // keeps the cards (isPaired); the layout above already fixes where everything will be.
    const token = {};
    pairing = token;
    const nextFrame = () => new Promise((res) => { requestAnimationFrame(res); });
    const live = () => pairing === token;
    return nextFrame().then(() => {
      if (!live()) return null;
      const t1 = performance.now();
      const ranks = softRanks(sx, sy, k, rnd);
      const sortMs = performance.now() - t1;
      return nextFrame().then(() => {
        if (!live()) return null;
        const t2 = performance.now();
        draws.forEach((d, di) => fillDraw(d, ranks.subarray(...slices[di]), rnd));
        const fillMs = performance.now() - t2;
        stats = { ...stats, ...pathStats(sx, sy, ranks, k), sortMs, fillMs };
        performance.measure?.('globe-gallery pq pairing', { start: t1, detail: { ...stats } });
        sourcesPaired = true;
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
    if (ready && lastQuads) setSources(lastQuads.cards, lastQuads.view);
    version += 1;
    return ready;
  }

  // p is the flight progress; zoom = [zoomT at p 0, zoomT per unit p, CAM_Z_SPHERE, z span], so a
  // departed particle knows where the camera was when it left. active: false hides everything.
  function update(p, { W, H, dpr, active = true, zoom = [0, 0, 0, 0] }) {
    lastP = p;
    const show = ready && active && sourcesPaired;
    group.visible = show;
    shared.uP.value = p;
    shared.uView.value.set(W, H);
    shared.uDpr.value = dpr;
    shared.uZoomT.value.set(zoom[0], zoom[1]);
    shared.uCamZ.value.set(zoom[2], zoom[3]);
    draws.forEach(({ points }) => { points.visible = p < CRISP_P; });
    plane.visible = p > F.arriveStart;
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
    isPaired: () => sourcesPaired,
    drawCount: () => draws.length + 1,
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
