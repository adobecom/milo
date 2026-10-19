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

const GRID_LONG = 256; // card colour lookup resolution, long side: per-particle, not an average
const gridCache = new WeakMap();

// A card photo at lookup resolution, cached per image. Rows follow the texture's own v (bitmaps
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
    uIn: { value: 0 },
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

  // quads: [{ pts: [TLx, TLy, TRx, TRy, BRx, BRy, BLx, BLy], project(u, v) → [x, y], alpha, image,
  // repeat, offset, mirror }] in viewport px, u right and v down the card as seen. Each card gets
  // particles in proportion to its on-screen area, on a grid so the tiles cover it edge to edge,
  // each placed through the card's own projection (perspective-correct) and sized to its cell.
  function setSources(quads, W, H) {
    lastSources = { quads, W, H };
    if (!points) return;
    const src = points.geometry.getAttribute('aSrc');
    const size = points.geometry.getAttribute('aSrcSize');
    const col = points.geometry.getAttribute('aSrcColor');
    // Only the part of each card that is on screen: its uv window, from a coarse probe grid.
    const inView = ([x, y]) => x > -0.05 * W && x < 1.05 * W && y > -0.05 * H && y < 1.05 * H;
    const PROBE = 12;
    const windows = quads.map(({ project }) => {
      let u0 = 1; let u1 = 0; let v0 = 1; let v1 = 0;
      for (let a = 0; a <= PROBE; a += 1) {
        for (let b = 0; b <= PROBE; b += 1) {
          if (inView(project(a / PROBE, b / PROBE))) {
            u0 = Math.min(u0, a / PROBE); u1 = Math.max(u1, a / PROBE);
            v0 = Math.min(v0, b / PROBE); v1 = Math.max(v1, b / PROBE);
          }
        }
      }
      if (u1 < u0) return null;
      const pad = 1 / PROBE;
      return {
        u0: Math.max(0, u0 - pad),
        u1: Math.min(1, u1 + pad),
        v0: Math.max(0, v0 - pad),
        v1: Math.min(1, v1 + pad),
      };
    });
    const area = quads.map(({ project }, qi) => {
      const win = windows[qi];
      if (!win) return 0;
      const pts = [[win.u0, win.v0], [win.u1, win.v0], [win.u1, win.v1], [win.u0, win.v1]]
        .map(([u, v]) => project(u, v));
      // Shoelace: the window's projected area.
      let a2 = 0;
      pts.forEach(([x, y], k) => { const [nx, ny] = pts[(k + 1) % 4]; a2 += x * ny - nx * y; });
      return Math.abs(a2) / 2;
    });
    const total = area.reduce((a, b) => a + b, 0);
    let i = 0;
    const put = (q, u, v, cellU, cellV) => {
      const {
        project, alpha, image, repeat, offset, mirror,
      } = q;
      const [x, y] = project(u, v);
      const [xu, yu] = project(u + cellU, v);
      const [xv, yv] = project(u, v + cellV);
      src.array[i * 2] = x;
      src.array[i * 2 + 1] = y;
      const cell = Math.max(Math.hypot(xu - x, yu - y), Math.hypot(xv - x, yv - y));
      size.array[i] = Math.min(64, 1.2 * cell); // a little overlap, so no seams between tiles
      const grid = colorGrid(image);
      if (grid) {
        // The card shader mirrors u on back faces; GL v runs up the photo.
        const gu = Math.min(0.999, Math.max(0, (mirror ? 1 - u : u) * repeat.x + offset.x));
        const gv = Math.min(0.999, Math.max(0, (1 - v) * repeat.y + offset.y));
        const k = (Math.floor(gv * grid.h) * grid.w + Math.floor(gu * grid.w)) * 4;
        const d = grid.data;
        col.array.set([d[k] / 255, d[k + 1] / 255, d[k + 2] / 255, alpha], i * 4);
      } else {
        col.array.set([GRAY[0], GRAY[1], GRAY[2], alpha], i * 4);
      }
      i += 1;
    };
    if (total > 0) {
      quads.forEach((q, qi) => {
        const share = Math.floor((count * area[qi]) / total);
        const win = windows[qi];
        if (share < 1 || !win) return;
        const [ax, ay] = q.project(win.u0, win.v0);
        const [bx, by] = q.project(win.u1, win.v0);
        const [cx, cy] = q.project(win.u0, win.v1);
        const wPx = Math.hypot(bx - ax, by - ay);
        const hPx = Math.hypot(cx - ax, cy - ay);
        const cols = Math.max(1, Math.round(Math.sqrt((share * wPx) / Math.max(1, hPx))));
        const rows = Math.max(1, Math.floor(share / cols));
        const du = (win.u1 - win.u0) / cols;
        const dv = (win.v1 - win.v0) / rows;
        for (let r = 0; r < rows && i < count; r += 1) {
          for (let c = 0; c < cols && i < count; c += 1) {
            put(q, win.u0 + (c + 0.5) * du, win.v0 + (r + 0.5) * dv, du, dv);
          }
        }
      });
    }
    // The grid rounding leaves a few over: doubled up at random on the largest cards.
    while (i < count) {
      if (!total) {
        src.array.set([Math.random() * W, Math.random() * H], i * 2);
        size.array[i] = 2;
        col.array.set([1, 1, 1, 0], i * 4); // nothing left to break up: invisible until it flies
        i += 1;
      } else {
        let r = Math.random() * total;
        let q = 0;
        while (q < area.length - 1 && (r > area[q] || !windows[q])) { r -= area[q]; q += 1; }
        const win = windows[q];
        const u = win.u0 + Math.random() * (win.u1 - win.u0);
        const v = win.v0 + Math.random() * (win.v1 - win.v0);
        put(quads[q], u, v, 0.02, 0.02);
      }
    }
    src.needsUpdate = true;
    size.needsUpdate = true;
    col.needsUpdate = true;
  }

  function build(targets, rtl = false) {
    disposeGeometry();
    count = targets.count;
    const geo = createPointGeometry({
      position: [targets.dst, 3],
      aDstColor: [targets.color, 3],
      aSrc: [new Float32Array(count * 2), 2],
      aSrcSize: [new Float32Array(count), 1],
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
    p, fadeIn, fade, pinTop, W, H, dpr,
  }) {
    uniforms.uP.value = p;
    uniforms.uIn.value = fadeIn;
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
