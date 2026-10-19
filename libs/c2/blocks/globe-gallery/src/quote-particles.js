import * as THREE from '../../../../deps/three.js';
import { QUOTE_PARTICLE_VERT, QUOTE_PARTICLE_FRAG, QUOTE_DELAY_MAX } from './shaders.js';

// Pull-quote particle hand-off: the far-side cards' pixels burst off and fly into the quote's
// glyphs, laid out by the real DOM. See README (Particle hand-off).

const INK_ALPHA = 128;
const GRAY = [0.55, 0.55, 0.55];
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
  const count = Math.min(budget, ink.length);
  if (!count) return null;
  // Partial Fisher–Yates: an unbiased random subset spreads evenly over every glyph.
  for (let i = 0; i < count; i += 1) {
    const j = i + Math.floor(Math.random() * (ink.length - i));
    [ink[i], ink[j]] = [ink[j], ink[i]];
  }
  const dst = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const px = ink[i];
    const x = px % w;
    const y = (px - x) / w;
    dst[i * 3] = fig.left + x + Math.random();
    dst[i * 3 + 1] = fig.top - originTop + y + Math.random();
    color[i * 3] = data[px * 4] / 255;
    color[i * 3 + 1] = data[px * 4 + 1] / 255;
    color[i * 3 + 2] = data[px * 4 + 2] / 255;
  }
  const spacing = Math.sqrt(ink.length / count);
  const size = Math.min(SIZE_MAX, Math.max(SIZE_MIN, spacing * SIZE_PER_SPACING));
  return { dst, color, count, size };
}

const GRID_LONG = 32; // card colour lookup resolution, long side
const gridCache = new WeakMap();

// A card photo shrunk to a tiny grid, cached per image. Rows follow the texture's own v (bitmaps
// are uploaded pre-flipped), so GL uv indexes it directly. Null when the image can't be read.
export function colorGrid(image) {
  if (!image || !image.width || !image.height) return null;
  if (gridCache.has(image)) return gridCache.get(image);
  let grid = null;
  try {
    const k = GRID_LONG / Math.max(image.width, image.height);
    const w = Math.max(1, Math.round(image.width * k));
    const h = Math.max(1, Math.round(image.height * k));
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, w, h);
    grid = { w, h, data: ctx.getImageData(0, 0, w, h).data };
  } catch (e) {
    grid = null;
  }
  gridCache.set(image, grid);
  return grid;
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

// Arrival sweeps in reading order, loosened by a random share.
function seedFor(dst, count, rtl) {
  let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
  for (let i = 0; i < count; i += 1) {
    x0 = Math.min(x0, dst[i * 3]); x1 = Math.max(x1, dst[i * 3]);
    y0 = Math.min(y0, dst[i * 3 + 1]); y1 = Math.max(y1, dst[i * 3 + 1]);
  }
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    const xn = (dst[i * 3] - x0) / Math.max(1, x1 - x0);
    const yn = (dst[i * 3 + 1] - y0) / Math.max(1, y1 - y0);
    const order = (rtl ? 1 - xn : xn) * 0.7 + yn * 0.3;
    seed[i * 4] = (order * 0.75 + Math.random() * 0.25) * QUOTE_DELAY_MAX;
    seed[i * 4 + 1] = Math.random() * Math.PI * 2;
    seed[i * 4 + 2] = 0.3 + 0.7 * Math.random();
    seed[i * 4 + 3] = Math.random() * 2 - 1;
  }
  return seed;
}

export default function createQuoteParticles(scene, renderOrder) {
  const uniforms = {
    uViewport: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uPinTop: { value: 0 },
    uP: { value: 0 },
    uFade: { value: 1 },
    uSize: { value: 2 },
    uScatter: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: QUOTE_PARTICLE_VERT,
    fragmentShader: QUOTE_PARTICLE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  let points = null;
  let count = 0;
  let lastSources = null;

  function disposeGeometry() {
    if (!points) return;
    scene.remove(points);
    points.geometry.dispose();
    points = null;
  }

  // quads: [{ pts: [TLx, TLy, TRx, TRy, BRx, BRy, BLx, BLy], alpha, image, repeat, offset }],
  // in viewport px. Particles are spread over them by on-screen area.
  function setSources(quads, W, H) {
    lastSources = { quads, W, H };
    if (!points) return;
    const src = points.geometry.getAttribute('aSrc');
    const col = points.geometry.getAttribute('aSrcColor');
    const weights = quads.map(({ pts }) => {
      const xs = [pts[0], pts[2], pts[4], pts[6]];
      const ys = [pts[1], pts[3], pts[5], pts[7]];
      const w = Math.min(W * 1.25, Math.max(...xs)) - Math.max(-W * 0.25, Math.min(...xs));
      const h = Math.min(H * 1.25, Math.max(...ys)) - Math.max(-H * 0.25, Math.min(...ys));
      return Math.max(0, w) * Math.max(0, h);
    });
    let total = 0;
    const cum = weights.map((w) => { total += w; return total; });
    for (let i = 0; i < count; i += 1) {
      if (!total) {
        // Nothing left to break up: invisible until the flight fades them in.
        src.array.set([Math.random() * W, Math.random() * H], i * 2);
        col.array.set([1, 1, 1, 0], i * 4);
      } else {
        const r = Math.random() * total;
        let q = 0;
        while (cum[q] < r) q += 1;
        const { pts, alpha, image, repeat, offset } = quads[q];
        const u = Math.random();
        const v = Math.random();
        const tx = pts[0] + (pts[2] - pts[0]) * u;
        const ty = pts[1] + (pts[3] - pts[1]) * u;
        const bx = pts[6] + (pts[4] - pts[6]) * u;
        const by = pts[7] + (pts[5] - pts[7]) * u;
        src.array.set([tx + (bx - tx) * v, ty + (by - ty) * v], i * 2);
        // A back face winds the other way on screen, and the card shader mirrors it in u.
        const cross = (pts[2] - pts[0]) * (pts[5] - pts[1]) - (pts[3] - pts[1]) * (pts[4] - pts[0]);
        const fu = cross < 0 ? 1 - u : u;
        const grid = colorGrid(image);
        if (grid) {
          const gu = Math.min(0.999, Math.max(0, fu * repeat.x + offset.x));
          const gv = Math.min(0.999, Math.max(0, (1 - v) * repeat.y + offset.y));
          const k = (Math.floor(gv * grid.h) * grid.w + Math.floor(gu * grid.w)) * 4;
          const d = grid.data;
          col.array.set([d[k] / 255, d[k + 1] / 255, d[k + 2] / 255, alpha], i * 4);
        } else {
          col.array.set([GRAY[0], GRAY[1], GRAY[2], alpha], i * 4);
        }
      }
    }
    src.needsUpdate = true;
    col.needsUpdate = true;
  }

  function build(targets, rtl = false) {
    disposeGeometry();
    count = targets.count;
    const geo = createPointGeometry({
      position: [targets.dst, 3],
      aDstColor: [targets.color, 3],
      aSrc: [new Float32Array(count * 2), 2],
      aSrcColor: [new Float32Array(count * 4), 4],
      aSeed: [seedFor(targets.dst, count, rtl), 4],
    });
    points = createPoints(geo, material);
    points.frustumCulled = false; // positions are clip-space; the bounds three would test are not
    points.renderOrder = renderOrder;
    points.visible = false;
    uniforms.uSize.value = targets.size;
    scene.add(points);
    if (lastSources) setSources(lastSources.quads, lastSources.W, lastSources.H);
  }

  function setFrame({
    p, fade, pinTop, W, H, dpr,
  }) {
    uniforms.uP.value = p;
    uniforms.uFade.value = fade;
    uniforms.uPinTop.value = pinTop;
    uniforms.uViewport.value.set(W, H);
    uniforms.uDpr.value = dpr;
    uniforms.uScatter.value = 0.2 * Math.min(W, H);
  }

  function setVisible(v) { if (points) points.visible = v; }

  function dispose() {
    disposeGeometry();
    material.dispose();
    lastSources = null;
  }

  return {
    build,
    setSources,
    setFrame,
    setVisible,
    isBuilt: () => !!points,
    dispose,
  };
}
