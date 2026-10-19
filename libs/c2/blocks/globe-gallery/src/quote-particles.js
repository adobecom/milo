import * as THREE from '../../../../deps/three.js';
import {
  QUOTE_POINTS_VERT, QUOTE_POINTS_FRAG, QUOTE_PLANE_VERT, QUOTE_PLANE_FRAG,
  QUOTE_FLY_START, QUOTE_FLY_DUR, QUOTE_DELAY_MAX,
} from './shaders.js';

// The WebGL pull quote: card pixels scatter and fly into the quote's glyphs, then hand over to a
// crisp raster of the same text. The DOM figure stays the layout source and the a11y copy; this
// module only draws what it measured. All coordinates are CSS px from the top-left of the rail,
// which shares its box with the canvas while the quote is on screen. See README (WebGL pull quote).

const INK_ALPHA = 128; // raster alpha that counts as a target pixel
const GRID_LONG = 32; // card colour lookup resolution, long side
const SRC_SIZE = 2.4; // point size, CSS px
const DST_SIZE = 2;
const SCATTER_EXPAND = 0.7; // radial blow-out factor at the end of the expand phase
const SCATTER_RADIUS = 0.2; // random scatter, as a share of the viewport's short side
const RASTER_PAD = 6; // px around the figure so antialiased edges are not clipped
const LANDED_P = QUOTE_FLY_START + QUOTE_DELAY_MAX + QUOTE_FLY_DUR;
const PLANE_IN = [LANDED_P - 0.04, LANDED_P + 0.08];
const POINTS_OUT = [LANDED_P + 0.02, 1];
export const QUOTE_LIVE_P = LANDED_P;

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const gridCache = new WeakMap();

// Card photo shrunk to a tiny grid. Rows follow the texture's own v (the bitmaps are uploaded
// pre-flipped), so (u, v) in GL uv space indexes it directly.
function colorGrid(tex) {
  const img = tex && tex.image;
  if (!img || !img.width || !img.height) return null;
  if (gridCache.has(img)) return gridCache.get(img);
  let grid = null;
  try {
    const s = GRID_LONG / Math.max(img.width, img.height);
    const w = Math.max(1, Math.round(img.width * s));
    const h = Math.max(1, Math.round(img.height * s));
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    grid = { w, h, data: ctx.getImageData(0, 0, w, h).data };
  } catch (e) {
    grid = null; // detached bitmap or a tainted image: the card falls back to a flat grey
  }
  gridCache.set(img, grid);
  return grid;
}

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

export default function createQuoteParticles({ figureEl, railEl, count }) {
  const n = count;
  const group = new THREE.Group();
  group.visible = false;

  const geo = new THREE.BufferGeometry();
  const dst = new Float32Array(n * 3);
  const src = new Float32Array(n * 2);
  const srcCol = new Float32Array(n * 4);
  const dstCol = new Float32Array(n * 3);
  const rand = new Float32Array(n * 4);
  const attr = (arr, size) => new THREE.BufferAttribute(arr, size).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', attr(dst, 3));
  geo.setAttribute('aSrc', attr(src, 2));
  geo.setAttribute('aSrcCol', attr(srcCol, 4));
  geo.setAttribute('aDstCol', attr(dstCol, 3));
  geo.setAttribute('aRand', attr(rand, 4));

  const pointsMat = new THREE.ShaderMaterial({
    uniforms: {
      uP: { value: 0 },
      uView: { value: new THREE.Vector2(1, 1) },
      uDpr: { value: 1 },
      uScatter: { value: new THREE.Vector2(SCATTER_EXPAND, 0) },
      uSrcSize: { value: SRC_SIZE },
      uDstSize: { value: DST_SIZE },
      uAlpha: { value: 1 },
    },
    vertexShader: QUOTE_POINTS_VERT,
    fragmentShader: QUOTE_POINTS_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const points = new THREE.Points(geo, pointsMat);
  points.frustumCulled = false;
  points.renderOrder = 1e6;
  group.add(points);

  const planeGeo = new THREE.BufferGeometry();
  planeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  planeGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));
  planeGeo.setIndex([0, 2, 1, 2, 3, 1]);
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uOpacity: { value: 0 },
      uView: { value: pointsMat.uniforms.uView.value },
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
    const jitter = pick.length < n ? 0.6 : 0;
    for (let i = 0; i < n; i += 1) {
      const k = pick[i % take];
      const p = k / 4;
      const px = (r.x0 + (p % r.w) + 0.5) / dpr + (Math.random() - 0.5) * jitter;
      const py = (r.y0 + Math.floor(p / r.w) + 0.5) / dpr + (Math.random() - 0.5) * jitter;
      dst[i * 3] = px;
      dst[i * 3 + 1] = py;
      dst[i * 3 + 2] = 0;
      dstCol[i * 3] = data[k] / 255;
      dstCol[i * 3 + 1] = data[k + 1] / 255;
      dstCol[i * 3 + 2] = data[k + 2] / 255;
      // Arrival sweeps in reading order, loosened by a random share.
      const xn = (px - box.x) / Math.max(1, box.w);
      const yn = (py - box.y) / Math.max(1, box.h);
      const order = (m.rtl ? 1 - xn : xn) * 0.7 + yn * 0.3;
      rand[i * 4] = (order * 0.75 + Math.random() * 0.25) * QUOTE_DELAY_MAX;
      rand[i * 4 + 1] = Math.random() * Math.PI * 2;
      rand[i * 4 + 2] = 0.3 + 0.7 * Math.random();
      rand[i * 4 + 3] = Math.random() * 2 - 1;
    }
    ['position', 'aDstCol', 'aRand'].forEach((a) => { geo.attributes[a].needsUpdate = true; });
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
    version += 1;
    return ready;
  }

  // quads: [{ pts: [TLx, TLy, TRx, TRy, BRx, BRy, BLx, BLy], alpha, tex, repeat, offset }] in px.
  function setSources(quads, W, H) {
    const weights = quads.map(({ pts }) => {
      const xs = [pts[0], pts[2], pts[4], pts[6]];
      const ys = [pts[1], pts[3], pts[5], pts[7]];
      const w = Math.min(W * 1.25, Math.max(...xs)) - Math.max(-W * 0.25, Math.min(...xs));
      const h = Math.min(H * 1.25, Math.max(...ys)) - Math.max(-H * 0.25, Math.min(...ys));
      return Math.max(0, w) * Math.max(0, h);
    });
    let total = 0;
    const cum = weights.map((w) => { total += w; return total; });
    for (let i = 0; i < n; i += 1) {
      if (!total) {
        src[i * 2] = Math.random() * W;
        src[i * 2 + 1] = Math.random() * H;
        srcCol.set([1, 1, 1, 0], i * 4);
      } else {
        const target = Math.random() * total;
        let q = 0;
        while (cum[q] < target) q += 1;
        const { pts, alpha, tex, repeat, offset } = quads[q];
        const u = Math.random();
        const v = Math.random();
        const top = [pts[0] + (pts[2] - pts[0]) * u, pts[1] + (pts[3] - pts[1]) * u];
        const bot = [pts[6] + (pts[4] - pts[6]) * u, pts[7] + (pts[5] - pts[7]) * u];
        src[i * 2] = top[0] + (bot[0] - top[0]) * v;
        src[i * 2 + 1] = top[1] + (bot[1] - top[1]) * v;
        // Screen winding tells the back faces, which the card shader mirrors in u.
        const cross = (pts[2] - pts[0]) * (pts[5] - pts[1]) - (pts[3] - pts[1]) * (pts[4] - pts[0]);
        const fu = cross < 0 ? 1 - u : u;
        const grid = colorGrid(tex);
        if (grid) {
          const gu = Math.min(0.999, Math.max(0, fu * repeat.x + offset.x));
          const gv = Math.min(0.999, Math.max(0, (1 - v) * repeat.y + offset.y));
          const k = (Math.floor(gv * grid.h) * grid.w + Math.floor(gu * grid.w)) * 4;
          const c = grid.data;
          srcCol.set([c[k] / 255, c[k + 1] / 255, c[k + 2] / 255, alpha], i * 4);
        } else {
          srcCol.set([0.6, 0.6, 0.6, alpha], i * 4);
        }
      }
    }
    geo.attributes.aSrc.needsUpdate = true;
    geo.attributes.aSrcCol.needsUpdate = true;
    version += 1;
  }

  // drawn: false hands the quote to the DOM (forced colours) and keeps the canvas clear of it.
  function update(p, { W, H, dpr, drawn = true }) {
    lastP = p;
    const show = ready && drawn && p > 0;
    group.visible = show;
    const u = pointsMat.uniforms;
    u.uP.value = p;
    u.uView.value.set(W, H);
    u.uDpr.value = dpr;
    u.uScatter.value.y = SCATTER_RADIUS * Math.min(W, H);
    u.uAlpha.value = 1 - smoothstep(POINTS_OUT[0], POINTS_OUT[1], p);
    planeMat.uniforms.uOpacity.value = smoothstep(PLANE_IN[0], PLANE_IN[1], p);
    points.visible = u.uAlpha.value > 0;
    plane.visible = planeMat.uniforms.uOpacity.value > 0;
    stateKey = `${p}|${show}|${version}|${W}x${H}@${dpr}`;
  }

  return {
    object: group,
    layout,
    setSources,
    update,
    isReady: () => ready,
    // Settled and already on the canvas: the caller may skip the draw.
    isIdle: () => lastP >= 1 && stateKey === drawnKey,
    markDrawn: () => { drawnKey = stateKey; },
    invalidate: () => { drawnKey = ''; },
    dispose() {
      generation += 1;
      ready = false;
      if (group.parent) group.parent.remove(group);
      geo.dispose();
      pointsMat.dispose();
      planeGeo.dispose();
      if (planeMat.uniforms.uMap.value) planeMat.uniforms.uMap.value.dispose();
      planeMat.dispose();
    },
  };
}
