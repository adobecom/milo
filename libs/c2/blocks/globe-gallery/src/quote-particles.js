import * as THREE from '../../../../deps/three.js';
import { QUOTE_PARTICLE_VERT, QUOTE_PARTICLE_FRAG, QUOTE_DELAY_MAX } from './shaders.js';

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
    uScatter: { value: 0 },
    uMinDepth: { value: 1.5 },
    uTargetDepth: { value: 30 },
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
  let points = null;
  let count = 0;
  let materials = [];
  let lastSources = null;

  function disposeMaterials() {
    materials.forEach((m) => m.dispose());
    materials = [];
  }

  function disposeGeometry() {
    if (!points) return;
    scene.remove(points);
    points.geometry.dispose();
    points = null;
  }

  // cards: [{ project(u, v) → [x, y] px (v down the card as seen), world(u, v, out) → Vector3,
  // axisU, axisV (world per unit geometry uv), depth, texture, repeat, offset, aspect, radius, ca,
  // mirror, alpha }]. Particles go to each card by the on-screen area of its visible part, as a
  // grid of tiles in one contiguous range per card, so each card is one draw with its own texture.
  function setSources(cards, W, H) {
    lastSources = { cards, W, H };
    if (!points) return;
    const geo = points.geometry;
    const srcW = geo.getAttribute('aSrcWorld');
    const uv = geo.getAttribute('aUv');
    const rel = geo.getAttribute('aRelease');
    const windows = cards.map((c) => screenWindow(c.project, W, H));
    const area = cards.map((c, k) => (windows[k] ? windowArea(c.project, windows[k]) : 0));
    const total = area.reduce((a, b) => a + b, 0);
    disposeMaterials();
    geo.clearGroups();
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
        const put = (u, v) => {
          // v runs down the card as seen; geometry v runs up.
          card.world(u, v, tmp);
          srcW.array.set([tmp.x, tmp.y, tmp.z], i * 3);
          uv.array.set([u, 1 - v], i * 2);
          // Edge-first: 0 on the rim, 1 at the centre, in card-height units.
          const edge = Math.min(Math.min(u, 1 - u) * card.aspect, Math.min(v, 1 - v));
          const inner = Math.min(1, edge / (0.5 * Math.min(card.aspect, 1)));
          rel.array[i] = 0.02 + 0.08 * depthRank + 0.1 * inner + 0.06 * Math.random();
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
        materials.push(makeMaterial({ ...card, cellU: du, cellV: dv }));
        geo.addGroup(start, i - start, materials.length - 1);
      });
    }
    if (i < count) {
      // Nothing left to break up: invisible stand-ins that only show once they have flown.
      for (; i < count; i += 1) {
        srcW.array.set([0, 0, -1e3], i * 3);
        uv.array.set([0.5, 0.5], i * 2);
        rel.array[i] = 0;
      }
      materials.push(makeMaterial(null));
      geo.addGroup(0, count, materials.length - 1);
    }
    points.material = materials;
    srcW.needsUpdate = true;
    uv.needsUpdate = true;
    rel.needsUpdate = true;
  }

  function build(targets, rtl = false) {
    disposeGeometry();
    count = targets.count;
    const geo = createPointGeometry({
      position: [targets.dst, 3],
      aDstColor: [targets.color, 3],
      aSrcWorld: [new Float32Array(count * 3), 3],
      aUv: [new Float32Array(count * 2), 2],
      aRelease: [new Float32Array(count), 1],
      aSeed: [seedFor(targets.dst, count, rtl), 4],
    });
    disposeMaterials();
    materials = [makeMaterial(null)];
    geo.addGroup(0, count, 0);
    points = createPoints(geo, materials);
    points.frustumCulled = false; // positions are clip-space; the bounds three would test are not
    points.renderOrder = renderOrder;
    points.visible = false;
    shared.uSize.value = targets.size;
    scene.add(points);
    if (lastSources) setSources(lastSources.cards, lastSources.W, lastSources.H);
  }

  // zoom: [zoomT at p = 0, zoomT per unit p]; camZ: [CAM_Z_SPHERE, CAM_Z_END].
  function setFrame({
    p, fade, pinTop, W, H, dpr, camera, targetDepth, zoom, camZ,
  }) {
    shared.uP.value = p;
    shared.uFade.value = fade;
    shared.uPinTop.value = pinTop;
    shared.uViewport.value.set(W, H);
    shared.uDpr.value = dpr;
    shared.uScatter.value = 0.2 * Math.min(W, H);
    if (camera) shared.uProj.value.copy(camera.projectionMatrix);
    if (zoom) shared.uZoom.value.set(zoom[0], zoom[1]);
    if (camZ) shared.uCamZ.value.set(camZ[0], camZ[1]);
    if (targetDepth) shared.uTargetDepth.value = targetDepth;
  }

  function setVisible(v) { if (points) points.visible = v; }

  function dispose() {
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
    getDrawCount: () => (points ? points.geometry.groups.length : 0),
    dispose,
  };
}
