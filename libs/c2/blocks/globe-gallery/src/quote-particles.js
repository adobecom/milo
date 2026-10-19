import * as THREE from '../../../../deps/three.js';
import { QUOTE_PARTICLE_VERT, QUOTE_PARTICLE_FRAG } from './shaders.js';

// Pull-quote particle hand-off: card pixels burst off the dissolving cards and fly into the
// quote's glyphs, laid out by the real DOM. See README (Pull quote).

export const MAX_CARDS = 64; // compiled into the shader's uniform arrays
const INK_ALPHA = 128;
const PALETTE_W = 12;
const PALETTE_H = 16;
const GRAY = [0.55, 0.55, 0.55];
const SIZE_PER_SPACING = 1.3; // dot diameter over mean ink spacing: just enough to read solid
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

let paletteCtx = null;

// A coarse PALETTE_W × PALETTE_H colour grid of a card photo, top row first. Null on failure.
export function sampleCardPalette(image) {
  if (!image || !image.width) return null;
  try {
    if (!paletteCtx) {
      const c = document.createElement('canvas');
      c.width = PALETTE_W;
      c.height = PALETTE_H;
      paletteCtx = c.getContext('2d', { willReadFrequently: true });
    }
    paletteCtx.clearRect(0, 0, PALETTE_W, PALETTE_H);
    paletteCtx.drawImage(image, 0, 0, PALETTE_W, PALETTE_H);
    const { data } = paletteCtx.getImageData(0, 0, PALETTE_W, PALETTE_H);
    const out = new Float32Array(PALETTE_W * PALETTE_H * 3);
    for (let i = 0; i < PALETTE_W * PALETTE_H; i += 1) {
      out[i * 3] = data[i * 4] / 255;
      out[i * 3 + 1] = data[i * 4 + 1] / 255;
      out[i * 3 + 2] = data[i * 4 + 2] / 255;
    }
    return out;
  } catch (e) {
    return null;
  }
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

export default function createQuoteParticles(scene, renderOrder) {
  // Flat vec4 arrays: three uploads a Float32Array uniform as-is.
  const cardA = new Float32Array(MAX_CARDS * 4);
  const cardB = new Float32Array(MAX_CARDS * 4);
  const uniforms = {
    uCardA: { value: cardA },
    uCardB: { value: cardB },
    uViewport: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uPinTop: { value: 0 },
    uFly: { value: 0 },
    uFade: { value: 1 },
    uSize: { value: 2 },
  };
  const material = new THREE.ShaderMaterial({
    defines: { MAX_CARDS },
    uniforms,
    vertexShader: QUOTE_PARTICLE_VERT,
    fragmentShader: QUOTE_PARTICLE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  let points = null;

  function disposeGeometry() {
    if (!points) return;
    scene.remove(points);
    points.geometry.dispose();
    points = null;
  }

  // palettes[k] is a sampleCardPalette grid (photos are flipY'd bitmaps, so rows run bottom-up).
  function build({ targets, palettes, cardCount }) {
    disposeGeometry();
    const n = targets.count;
    const slots = Math.max(1, Math.min(MAX_CARDS, cardCount));
    const card = new Float32Array(n * 3);
    const srcColor = new Float32Array(n * 3);
    const seed = new Float32Array(n * 4);
    for (let i = 0; i < n; i += 1) {
      const k = i % slots;
      const u = Math.random();
      const v = Math.random();
      card.set([k, u, v], i * 3);
      const pal = palettes[k];
      const cell = pal
        ? (Math.min(PALETTE_H - 1, Math.floor((1 - v) * PALETTE_H)) * PALETTE_W
          + Math.min(PALETTE_W - 1, Math.floor(u * PALETTE_W))) * 3
        : -1;
      srcColor.set(cell >= 0 ? pal.subarray(cell, cell + 3) : GRAY, i * 3);
      seed.set([Math.random(), Math.random(), Math.random() * Math.PI * 2, Math.random()], i * 4);
    }
    const geo = createPointGeometry({
      position: [targets.dst, 3],
      aDstColor: [targets.color, 3],
      aCard: [card, 3],
      aSrcColor: [srcColor, 3],
      aSeed: [seed, 4],
    });
    points = createPoints(geo, material);
    points.frustumCulled = false; // positions are clip-space; the bounds three would test are not
    points.renderOrder = renderOrder;
    points.visible = false;
    uniforms.uSize.value = targets.size;
    scene.add(points);
  }

  // Screen-space quad (CSS px, y down) a card's pixels leave from; axes are half-extents.
  function setCardQuad(k, cx, cy, ux, uy, vx, vy) {
    if (k >= MAX_CARDS) return;
    cardA.set([cx, cy, ux, uy], k * 4);
    cardB[k * 4] = vx;
    cardB[k * 4 + 1] = vy;
  }

  function setCardDissolve(k, v) {
    if (k < MAX_CARDS) cardB[k * 4 + 2] = v;
  }

  // Stand-in quads for cards never seen near the camera (e.g. a jump straight into the hold).
  function scatterCardQuads(W, H) {
    const half = H * 0.18;
    for (let k = 0; k < MAX_CARDS; k += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 0.35;
      const cx = W / 2 + Math.cos(a) * r * W;
      const cy = H / 2 + Math.sin(a) * r * H;
      setCardQuad(k, cx, cy, half * 0.72, 0, 0, half);
    }
  }

  function setFrame({
    fly, fade, pinTop, W, H, dpr,
  }) {
    if (!points) return;
    uniforms.uFly.value = fly;
    uniforms.uFade.value = fade;
    uniforms.uPinTop.value = pinTop;
    uniforms.uViewport.value.set(W, H);
    uniforms.uDpr.value = dpr;
  }

  function setVisible(v) { if (points) points.visible = v; }

  function dispose() {
    disposeGeometry();
    material.dispose();
  }

  return {
    build,
    setCardQuad,
    setCardDissolve,
    scatterCardQuads,
    setFrame,
    setVisible,
    isBuilt: () => !!points,
    dispose,
  };
}
