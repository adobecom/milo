import * as THREE from '../../../../deps/three.js';
import {
  ZOOM_EASE_POW, FRAME_MS, camZAtZoomT, zoomTAtCamZ, zoomSpanPx, scrollYAtZoomT,
} from './timeline.js';
import { clamp01, capDpr } from './math.js';
import { plainQuote } from './authoring.js';
import { RR_SDF, HASH21, glf } from './shaders.js';

const PULL_BP = {
  sm: { startR: 0.5, expand: 0.5, count: 15000 },
  md: { startR: 0, expand: 1.5, count: 48000 },
};
const FLY_VH = 1.0;
const READ_VH = 0.05;
const HANDOFF_EASE_T = 0.04;
const SWAP_MS = 120;
const DEBOUNCE_MS = 150;
const NEAR_TILE_PX = 4.5;

const INK_ALPHA = 128;
const PROBE = 24;
const TILE_MAX_K = 1.5;
const OFF_VIEW_K = 0.25;
const SEED = 20240611;
const RULE_WEIGHT = 3;
const RASTER_PAD = 6;
const DST_SPACING = 1.25;
const RULE_DROP = 0.15;
const TEXT_END = 0.9;
const IDLE_TIMEOUT_MS = 1000;

const PAIR_BANDS = 8;
const SOFT_Y = 0.12;
const SOFT_SWAP = 0.2;
const SOFT_SWAP_SPAN = 1 / 32;

const SETTLE = 0.04;
const INK_FROM = 0.95;
const ARRIVE_JITTER = 0.02;
const FLIGHT = {
  arriveStart: 0.4,
  arriveSpan: 0.35,
  release: [0.02, 0.015],
  depart: [0.03, 0.02],
  minFly: 0.15,
};
export const QUOTE_LIVE_P = FLIGHT.arriveStart + FLIGHT.arriveSpan
  + 2 * ARRIVE_JITTER + SETTLE;
const SWIRL_AMP = 0.1;
const SWIRL_SCALE = 0.35;
const SWIRL_DRIFT = 1.5;
const MIN_DEPTH = 2;
const RELEASE_REACH = 0.5;
const TILE_CAP = 256;
const DETACH_P = 0.01;
const EDGE_LEAD = 0.2;
const SCATTER_SPAN = 0.08;

const CURL_NOISE = [
  'float vnoise(vec2 p) {',
  '  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
  '  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),',
  '    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);',
  '}',
  'float flowField(vec2 p) { return vnoise(p) + 0.5 * vnoise(p * 2.03 + 17.1); }',
  'vec2 curl(vec2 p) {',
  '  const float e = 0.05;',
  '  float dx = flowField(p + vec2(e, 0.0)) - flowField(p - vec2(e, 0.0));',
  '  float dy = flowField(p + vec2(0.0, e)) - flowField(p - vec2(0.0, e));',
  '  vec2 c = vec2(dy, -dx) / (2.0 * e);',
  '  return c / (1.0 + length(c));',
  '}',
];

const PX_TO_CLIP = [
  'vec4 pxToClip(vec2 p, vec2 view) {',
  '  return vec4(p.x / view.x * 2.0 - 1.0, 1.0 - p.y / view.y * 2.0, 0.0, 1.0);',
  '}',
];

const POINTS_VERT = [
  'uniform float uP;',
  'uniform vec2 uView;',
  'uniform float uDpr;',
  'uniform float uDstSize;',
  'uniform vec2 uZoomT;',
  'uniform vec2 uCamZ;',
  'uniform vec3 uOrigin;',
  'uniform vec3 uAxisU;',
  'uniform vec3 uAxisV;',
  'uniform float uScreenSrc;',
  'uniform float uScatterP;',
  'uniform float uScatterExpand;',
  'attribute vec2 aUv;',
  'attribute vec2 aCell;',
  'attribute vec4 aRand;',
  'attribute vec3 aDstCol;',
  'varying vec2 vSrc;',
  'varying float vCamZ;',
  'varying vec4 vProj;',
  'varying float vSize;',
  'varying float vRound;',
  'varying vec3 vInk;',
  'varying float vInkK;',
  'varying float vFade;',
  ...PX_TO_CLIP,
  ...HASH21,
  ...CURL_NOISE,
  'float camZAt(float p) {',
  '  float z = clamp(uZoomT.x + p * uZoomT.y, 0.0, 1.0);',
  `  return uCamZ.x - uCamZ.y * (1.0 - pow(1.0 - z, ${glf(ZOOM_EASE_POW)}));`,
  '}',
  'vec2 toPx(vec3 w, float camZ) {',
  '  vec4 c = projectionMatrix * vec4(w.xy, w.z - camZ, 1.0);',
  '  vec2 n = c.xy / c.w;',
  '  return vec2((n.x + 1.0) * 0.5 * uView.x, (1.0 - n.y) * 0.5 * uView.y);',
  '}',
  'void main() {',
  '  vec2 s; vec2 su; vec2 sv;',
  '  float zEff = cameraPosition.z;',
  '  if (uScreenSrc > 0.5) {',
  '    s = aUv * uView; su = vec2(2.0, 0.0); sv = vec2(0.0, 2.0);',
  '  } else {',
  '    vec3 w = uOrigin + uAxisU * aUv.x + uAxisV * aUv.y;',
  '    float camZ = cameraPosition.z;',
  '    float zDep = camZAt(aRand.y);',
  `    float minZ = w.z + ${glf(MIN_DEPTH)};`,
  '    if (uScatterP < 0.0 && camZ < zDep) {',
  `      float d = max(zDep - minZ, 0.001) * ${glf(RELEASE_REACH)};`,
  '      zEff = zDep - d * (1.0 - exp(-(zDep - camZ) / d));',
  '    }',
  '    zEff = max(zEff, minZ);',
  '    s = toPx(w, zEff);',
  '    su = toPx(w + uAxisU * aCell.x, zEff) - s;',
  '    sv = toPx(w + uAxisV * aCell.y, zEff) - s;',
  '  }',
  '  bool scatter = uScatterP >= 0.0;',
  '  float t = clamp((uP - aRand.x) / max(aRand.w - aRand.x, 0.001), 0.0, 1.0);',
  '  vec2 pos = mix(s, position.xy, t);',
  '  if (!scatter && t > 0.0 && t < 1.0) {',
  '    float vmin = min(uView.x, uView.y);',
  `    vec2 flow = curl(pos / (${glf(SWIRL_SCALE)} * vmin) + uP * ${glf(SWIRL_DRIFT)});`,
  `    pos += flow * ${glf(SWIRL_AMP)} * vmin * sin(3.14159 * t);`,
  '  }',
  '  float tile = max(abs(su.x) + abs(sv.x), abs(su.y) + abs(sv.y)) * 1.05 + 0.5;',
  `  float detach = smoothstep(aRand.y, aRand.y + ${glf(DETACH_P)}, uP);`,
  '  if (scatter) {',
  '    float h1 = hash21(aUv * 97.0 + 13.1);',
  '    float h2 = hash21(aUv * 61.0 + 3.7);',
  '    float rim = min(1.0, 2.0 * min(min(aUv.x, 1.0 - aUv.x), min(aUv.y, 1.0 - aUv.y)));',
  `    float det = ${glf(SCATTER_SPAN)} * (${glf(EDGE_LEAD)} * rim + ${glf(1 - EDGE_LEAD)} * h1);`,
  '    t = clamp((uScatterP - det) / (1.0 - det), 0.0, 1.0);',
  '    vec2 dir = s - toPx(uOrigin + 0.5 * (uAxisU + uAxisV), zEff);',
  '    float a = (h2 - 0.5) * 0.8;',
  '    dir = mat2(cos(a), sin(a), -sin(a), cos(a)) * dir;',
  '    pos = s + (dir * (0.5 + h2) * uScatterExpand + (s - 0.5 * uView) * 0.5) * t * t * (3.0 - 2.0 * t);',
  '    float x = min(t / 0.25, 1.0);',
  '    detach = x * x * x * (x * (x * 6.0 - 15.0) + 10.0);',
  '  }',
  '  float g = smoothstep(0.0, scatter ? 1.0 : 0.4, t);',
  '  float land = scatter ? 0.0 : smoothstep(0.85, 1.0, t);',
  `  tile = min(tile, ${glf(TILE_CAP)});`,
  '  float size = mix(tile * (1.0 - (scatter ? 0.0 : 0.2) * detach), scatter ? 0.35 * tile : uDstSize, g)',
  '    * (1.0 + 0.3 * land);',
  '  gl_Position = pxToClip(pos, uView);',
  '  gl_PointSize = max(1.0, size * uDpr);',
  '  vSrc = s;',
  '  vCamZ = zEff;',
  '  vProj = vec4(projectionMatrix[0][0], projectionMatrix[1][1], projectionMatrix[2][0], projectionMatrix[2][1]);',
  '  vSize = size;',
  '  vRound = max(g, detach) * (1.0 - land);',
  `  float fadeAt = aRand.w + ${glf(ARRIVE_JITTER)};`,
  `  vFade = 1.0 - smoothstep(fadeAt + ${glf(SETTLE * 0.3)}, fadeAt + ${glf(SETTLE * 0.8)}, uP);`,
  '  vInk = aDstCol;',
  `  float ink = smoothstep(${glf(INK_FROM)}, 1.0, t);`,
  '  vInkK = ink * ink;',
  '  if (scatter) { vFade = 1.0 - smoothstep(0.0, 0.7, t); vInkK = 0.0; }',
  '}',
].join('\n');

const POINTS_FRAG = [
  'uniform sampler2D uMap;',
  'uniform vec2 uRepeat;',
  'uniform vec2 uOffset;',
  'uniform float uMirror;',
  'uniform float uAspect;',
  'uniform float uRadius;',
  'uniform float uCardAlpha;',
  'uniform float uScreenSrc;',
  'uniform vec2 uView;',
  'uniform vec3 uOrigin;',
  'uniform vec3 uAxisU;',
  'uniform vec3 uAxisV;',
  'varying vec2 vSrc;',
  'varying float vCamZ;',
  'varying vec4 vProj;',
  'varying float vSize;',
  'varying float vRound;',
  'varying vec3 vInk;',
  'varying float vInkK;',
  'varying float vFade;',
  ...RR_SDF,
  'void main() {',
  '  vec2 pc = gl_PointCoord - 0.5;',
  '  float dotA = 1.0 - smoothstep(0.16, 0.25, dot(pc, pc));',
  '  float alpha = vFade * mix(1.0, dotA, vRound);',
  '  vec3 col = vInk;',
  '  if (uScreenSrc > 0.5) {',
  '    alpha *= vRound;',
  '  } else {',
  '    vec2 px = vSrc + pc * vSize;',
  '    vec2 ndc = vec2(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0);',
  '    vec3 dir = vec3((ndc.x + vProj.z) / vProj.x, (ndc.y + vProj.w) / vProj.y, -1.0);',
  '    vec3 cam = vec3(0.0, 0.0, vCamZ);',
  '    vec3 nrm = cross(uAxisU, uAxisV);',
  '    float den = dot(dir, nrm);',
  '    vec3 hit = cam + dir * (dot(uOrigin - cam, nrm) / (abs(den) > 1e-6 ? den : 1e-6)) - uOrigin;',
  '    vec2 uv = vec2(dot(hit, uAxisU) / dot(uAxisU, uAxisU), dot(hit, uAxisV) / dot(uAxisV, uAxisV));',
  '    vec2 fUv = vec2(uMirror > 0.5 ? 1.0 - uv.x : uv.x, 1.0 - uv.y);',
  '    vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '    float aa = fwidth(pos.y);',
  '    alpha *= uCardAlpha * (1.0 - smoothstep(-aa, aa, rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius)));',
  '    vec3 tex = texture2D(uMap, fUv * uRepeat + uOffset).rgb;',
  '    col = mix(pow(max(tex, 0.0), vec3(1.0 / 2.2)), vInk, vInkK);',
  '  }',
  '  if (alpha < 0.004) discard;',
  '  gl_FragColor = vec4(col, alpha);',
  '}',
].join('\n');

const PLANE_VERT = [
  'uniform vec2 uView;',
  'varying vec2 vUv;',
  ...PX_TO_CLIP,
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = pxToClip(position.xy, uView);',
  '}',
].join('\n');

const PLANE_FRAG = [
  'uniform sampler2D uMap;',
  'uniform sampler2D uOrder;',
  'uniform float uP;',
  'varying vec2 vUv;',
  'void main() {',
  `  float arrive = ${glf(FLIGHT.arriveStart)} + ${glf(FLIGHT.arriveSpan)} * texture2D(uOrder, vUv).r;`,
  `  float reveal = smoothstep(arrive, arrive + ${glf(SETTLE * 0.6 + ARRIVE_JITTER)}, uP);`,
  '  vec4 t = texture2D(uMap, vUv);',
  '  gl_FragColor = vec4(t.rgb, t.a * reveal);',
  '}',
].join('\n');

const idle = () => new Promise((res) => {
  if (!window.requestIdleCallback) setTimeout(res, 0);
  else window.requestIdleCallback(() => res(), { timeout: IDLE_TIMEOUT_MS });
});

const fontOf = (cs) => `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

function textLines(el, ox, oy) {
  const cs = getComputedStyle(el);
  const style = {
    font: fontOf(cs),
    color: cs.getPropertyValue('--gg-pq-ink').trim() || '#fafafa',
    rtl: cs.direction === 'rtl',
    letterSpacing: cs.letterSpacing,
  };
  const lines = [];
  const range = document.createRange();
  const probe = document.createElement('span');
  probe.style.cssText = 'display:inline-block;width:0;height:0';
  el.prepend(probe);
  const baseY = probe.getBoundingClientRect().bottom;
  probe.remove();
  let ascent = null;
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node);
  nodes.forEach((node) => {
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
      ascent ??= baseY - r.top;
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
  });
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
  return [...figureEl.querySelectorAll(TEXT_SEL)]
    .map((el) => ({ font: fontOf(getComputedStyle(el)), text: el.textContent }));
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
    const ascent = run.ascent ?? tm.fontBoundingBoxAscent ?? tm.actualBoundingBoxAscent;
    const domW = run.right - run.left;
    const sx = tm.width > 0 ? Math.min(1.1, Math.max(0.9, domW / tm.width)) : 1;
    ctx.save();
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

function landingOrders(m, r, dpr, data) {
  const [top, bottom, left, right] = m.rules;
  const rw = left[2];
  const [lx, rx, ty, by] = [left[0], right[0], top[1], bottom[1]].map((v) => v + rw / 2);
  const tol = rw / 2 + 1;
  const { box } = m;
  const across = (px) => clamp01((px - box.x) / Math.max(1, box.w));
  const wave = (px) => (1 - RULE_DROP) * across(px);
  const size = r.w * r.h;
  const order = new Float32Array(size);
  const rule = new Uint8Array(size);
  let textEnd = 0;
  for (let y = 0; y < r.h; y += 1) {
    const py = (r.y0 + y + 0.5) / dpr;
    const onBottom = Math.abs(py - by) <= tol;
    const onTop = Math.abs(py - ty) <= tol;
    const rightOrder = wave(rx) + RULE_DROP * clamp01((py - ty) / Math.max(1, by - ty));
    const down = ((py - box.y) / Math.max(1, box.h)) * 0.3;
    for (let x = 0, i = y * r.w; x < r.w; x += 1, i += 1) {
      if (data[i * 4 + 3]) {
        const px = (r.x0 + x + 0.5) / dpr;
        if (Math.abs(px - rx) <= tol) {
          rule[i] = 1;
          order[i] = rightOrder;
        } else if (Math.abs(px - lx) <= tol || (!onBottom && onTop)) {
          rule[i] = 1;
          order[i] = wave(px);
        } else if (onBottom) {
          rule[i] = 1;
          order[i] = wave(px) + RULE_DROP * clamp01((px - box.x) / Math.max(1, rx - box.x));
        } else {
          const a = across(px);
          order[i] = clamp01((m.rtl ? 1 - a : a) * 0.7 + down);
          if (order[i] > textEnd) textEnd = order[i];
        }
      }
    }
  }
  const textScale = TEXT_END / (textEnd || 1);
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    if (order[i]) bytes[i] = Math.round(255 * (rule[i] ? order[i] : order[i] * textScale));
  }
  return { bytes, rule };
}

function compileShown(renderer, camera, root, shown) {
  const was = shown.map((o) => o.visible);
  shown.forEach((o) => { o.visible = true; });
  renderer.compile(root, camera);
  shown.forEach((o, i) => { o.visible = was[i]; });
}

function createCardPointsMaterial(shared, scatterP = -1) {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...shared,
      uMap: { value: null },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
      uMirror: { value: 0 },
      uAspect: { value: 1 },
      uRadius: { value: 0 },
      uCardAlpha: { value: 1 },
      uOrigin: { value: new THREE.Vector3() },
      uAxisU: { value: new THREE.Vector3(1, 0, 0) },
      uAxisV: { value: new THREE.Vector3(0, -1, 0) },
      uScreenSrc: { value: 0 },
      uScatterP: { value: scatterP },
    },
    vertexShader: POINTS_VERT,
    fragmentShader: POINTS_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    extensions: { derivatives: true },
  });
}

function pointsGeometry(uvs, cells, rand) {
  const k = uvs.length / 2;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
  geo.setAttribute('aUv', new THREE.BufferAttribute(uvs, 2));
  geo.setAttribute('aCell', new THREE.BufferAttribute(cells, 2));
  geo.setAttribute('aDstCol', new THREE.BufferAttribute(new Float32Array(k * 3), 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand ?? new Float32Array(k * 4), 4));
  return geo;
}

function setCardUniforms(u, card) {
  u.uMap.value = card.tex;
  u.uRepeat.value.copy(card.repeat);
  u.uOffset.value.copy(card.offset);
  u.uMirror.value = card.mirror ? 1 : 0;
  u.uAspect.value = card.aspect;
  u.uRadius.value = card.radius;
  u.uCardAlpha.value = card.alpha;
  u.uOrigin.value.copy(card.origin);
  u.uAxisU.value.copy(card.axisU);
  u.uAxisV.value.copy(card.axisV);
}

function seededRandom(seed) {
  let a = (Math.abs(Math.floor(seed)) % 2147483646) + 1;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

const camZAt = (zoom, p) => camZAtZoomT(zoom[0] + p * zoom[1], zoom[2], zoom[2] - zoom[3]);

function pAtCamZ(zoom, cz) {
  if (!(zoom[1] > 0) || !(zoom[3] > 0)) return Infinity;
  return (zoomTAtCamZ(cz, zoom[2], zoom[2] - zoom[3]) - zoom[0]) / zoom[1];
}

function bounds(n, at) {
  let lo = Infinity; let hi = -Infinity;
  for (let j = 0; j < n; j += 1) {
    const v = at(j);
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  return [lo, Math.max(1e-6, hi - lo)];
}

function sortBy(key, idx) {
  const SLOT = 2 ** 20;
  const m = idx.length;
  const [lo, span] = bounds(m, (j) => key[idx[j]]);
  const scale = (SLOT - 1) / span;
  const packed = new Float64Array(m);
  for (let j = 0; j < m; j += 1) packed[j] = Math.round((key[idx[j]] - lo) * scale) * SLOT + idx[j];
  packed.sort();
  const out = new Uint32Array(m);
  for (let j = 0; j < m; j += 1) out[j] = packed[j] % SLOT;
  return out;
}

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

export default function createQuoteParticles({ figureEl, railEl, count }) {
  const n = count;
  const group = new THREE.Group();
  group.visible = false;

  const tDst = new Float32Array(n * 2);
  const tCol = new Float32Array(n * 3);
  const tOrder = new Float32Array(n);
  let tSorted = new Uint32Array(0);
  let pairing = null;

  const shared = {
    uP: { value: 0 },
    uView: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uDstSize: { value: 0 },
    uZoomT: { value: new THREE.Vector2() },
    uCamZ: { value: new THREE.Vector2() },
  };
  let draws = [];
  let pending = [];
  let sourcesPaired = false;

  const planeGeo = new THREE.BufferGeometry();
  planeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  planeGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));
  planeGeo.setIndex([0, 2, 1, 2, 3, 1]);
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: null },
      uOrder: { value: null },
      uP: shared.uP,
      uView: shared.uView,
    },
    vertexShader: PLANE_VERT,
    fragmentShader: PLANE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.frustumCulled = false;
  plane.renderOrder = 1e6 + 1;
  group.add(plane);

  const disposePlaneTextures = () => {
    [planeMat.uniforms.uMap.value, planeMat.uniforms.uOrder.value].forEach((t) => t?.dispose());
  };

  let ready = false;
  let generation = 0;
  let lastP = 0;

  function writeTargets(r, m, dpr) {
    const { data } = r.ctx.getImageData(0, 0, r.w, r.h);
    const step = Math.max(1, Math.round(dpr));
    const orders = landingOrders(m, r, dpr, data);
    const repsAt = (i) => (data[i * 4 + 3] < INK_ALPHA
      ? 0 : 1 + orders.rule[i] * (RULE_WEIGHT - 1));
    const eachCell = (fn) => {
      for (let y = 0; y < r.h; y += step) {
        for (let x = 0, i = y * r.w; x < r.w; x += step, i += step) fn(i);
      }
    };
    let total = 0;
    eachCell((i) => { total += repsAt(i); });
    if (!total) return null;
    const pick = new Uint32Array(total);
    let c = 0;
    eachCell((i) => { for (let k = repsAt(i); k > 0; k -= 1) { pick[c] = i; c += 1; } });
    const take = Math.min(n, pick.length);
    const rnd = seededRandom(SEED);
    for (let i = 0; i < take; i += 1) {
      const j = i + Math.floor(rnd() * (pick.length - i));
      [pick[i], pick[j]] = [pick[j], pick[i]];
    }
    const spacing = Math.sqrt(total / n);
    shared.uDstSize.value = Math.min(4, Math.max(1.6, DST_SPACING * spacing));
    const jitter = pick.length < n ? 0.6 : 0;
    for (let i = 0; i < n; i += 1) {
      const p = pick[i % take];
      tDst[i * 2] = (r.x0 + (p % r.w) + 0.5) / dpr + (rnd() - 0.5) * jitter;
      tDst[i * 2 + 1] = (r.y0 + Math.floor(p / r.w) + 0.5) / dpr + (rnd() - 0.5) * jitter;
      for (let ch = 0; ch < 3; ch += 1) tCol[i * 3 + ch] = data[p * 4 + ch] / 255;
      tOrder[i] = orders.bytes[p] / 255;
    }
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i += 1) { xs[i] = tDst[i * 2]; ys[i] = tDst[i * 2 + 1]; }
    tSorted = coherentOrder(xs, ys);
    return orders.bytes;
  }

  const canvasTexture = (canvas) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  };

  function writePlane(r, dpr, orderBytes) {
    const x0 = r.x0 / dpr;
    const y0 = r.y0 / dpr;
    const x1 = (r.x0 + r.w) / dpr;
    const y1 = (r.y0 + r.h) / dpr;
    planeGeo.attributes.position.array.set([x0, y0, 0, x1, y0, 0, x0, y1, 0, x1, y1, 0]);
    planeGeo.attributes.position.needsUpdate = true;
    const orderCanvas = document.createElement('canvas');
    orderCanvas.width = r.w;
    orderCanvas.height = r.h;
    const img = new ImageData(r.w, r.h);
    for (let i = 0; i < orderBytes.length; i += 1) {
      img.data[i * 4] = orderBytes[i];
      img.data[i * 4 + 3] = 255;
    }
    orderCanvas.getContext('2d').putImageData(img, 0, 0);
    const u = planeMat.uniforms;
    disposePlaneTextures();
    u.uMap.value = canvasTexture(r.canvas);
    u.uOrder.value = canvasTexture(orderCanvas);
  }

  function disposeDraws(list) {
    list.forEach(({ points, mat, geo }) => {
      group.remove(points);
      geo.dispose();
      mat.dispose();
    });
  }

  function clearSources() {
    pairing = null;
    disposeDraws(draws);
    disposeDraws(pending);
    draws = [];
    pending = [];
    sourcesPaired = false;
  }

  const releaseAt = (edge) => FLIGHT.release[0] + FLIGHT.release[1] * edge;

  function addDraw(card, { uvs, cells, edge, release }) {
    const k = uvs.length / 2;
    const rand = new Float32Array(k * 4);
    for (let j = 0; j < k; j += 1) rand[j * 4 + 1] = release[j];
    const geo = pointsGeometry(uvs, cells, rand);
    const mat = createCardPointsMaterial(shared);
    if (card) setCardUniforms(mat.uniforms, card);
    else mat.uniforms.uScreenSrc.value = 1;
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    points.renderOrder = 1e6 + (card ? card.order : 0) / 1e4;
    group.add(points);
    pending.push({ points, mat, geo, edge, release });
  }

  function fillDraw({ geo, edge, release }, ranks, rnd) {
    const { position, aDstCol, aRand } = geo.attributes;
    for (let j = 0; j < ranks.length; j += 1) {
      const i = tSorted[ranks[j]];
      position.array[j * 3] = tDst[i * 2];
      position.array[j * 3 + 1] = tDst[i * 2 + 1];
      for (let ch = 0; ch < 3; ch += 1) aDstCol.array[j * 3 + ch] = tCol[i * 3 + ch];
      const order = tOrder[i];
      const arrive = FLIGHT.arriveStart + FLIGHT.arriveSpan * order
        + (rnd() * 2 - 1) * ARRIVE_JITTER;
      const leave = FLIGHT.depart[0] + FLIGHT.depart[1] * (0.6 * order + 0.4 * edge[j]);
      aRand.array[j * 4] = Math.min(arrive - FLIGHT.minFly, Math.max(release[j] + 0.01, leave));
      aRand.array[j * 4 + 3] = arrive;
    }
    [position, aDstCol, aRand].forEach((a) => { a.needsUpdate = true; });
  }

  function quantileRanks(order, k) {
    const ranks = new Uint32Array(k);
    for (let r = 0; r < k; r += 1) ranks[order[r]] = Math.min(n - 1, Math.floor((r * n) / k));
    return ranks;
  }

  function softRanks(xs, ys, k, rnd) {
    const bw = bounds(k, (i) => xs[i])[1] / PAIR_BANDS;
    const bh = SOFT_Y * bounds(k, (i) => ys[i])[1];
    const nx = new Float32Array(k);
    const ny = new Float32Array(k);
    for (let i = 0; i < k; i += 1) {
      nx[i] = xs[i] + (rnd() * 2 - 1) * bw;
      ny[i] = ys[i] + (rnd() * 2 - 1) * bh;
    }
    const order = coherentOrder(nx, ny, k);
    const ranks = quantileRanks(order, k);
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

  function setSources(cards, view) {
    pairing = null;
    disposeDraws(pending);
    pending = [];
    if (!ready) {
      clearSources();
      return Promise.resolve(false);
    }
    const { W, H, zoom, proj: [P00, P11, P02, P12] } = view;
    const rnd = seededRandom(SEED);
    const z0 = camZAt(zoom, 0);
    const zPair = camZAt(zoom, FLIGHT.depart[0] + 0.5 * FLIGHT.depart[1]);
    const pxX = (x, D) => ((P00 * x) / D - P02 + 1) * 0.5 * W;
    const pxY = (y, D) => (1 - ((P11 * y) / D - P12)) * 0.5 * H;
    const toPx = (x, y, z, cz) => (cz - z < 0.05 ? null : [pxX(x, cz - z), pxY(y, cz - z)]);
    const at = (card, u, v) => [
      card.origin.x + card.axisU.x * u + card.axisV.x * v,
      card.origin.y + card.axisU.y * u + card.axisV.y * v,
      card.origin.z + card.axisU.z * u + card.axisV.z * v,
    ];
    const project = (card, u, v, cz) => toPx(...at(card, u, v), cz);
    const inView = (q) => q && q[0] >= 0 && q[0] <= W && q[1] >= 0 && q[1] <= H;
    const areaAt = (card, cz) => {
      const pts = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => project(card, u, v, cz));
      if (pts.some((q) => !q)) return [0, 0];
      let hits = 0;
      for (let a = 0; a < PROBE; a += 1) {
        for (let b = 0; b < PROBE; b += 1) {
          if (inView(project(card, (a + 0.5) / PROBE, (b + 0.5) / PROBE, cz))) hits += 1;
        }
      }
      let a2 = 0;
      pts.forEach(([x, y], k) => { const [nx, ny] = pts[(k + 1) % 4]; a2 += x * ny - nx * y; });
      return [Math.abs(a2) / 2, (Math.abs(a2) / 2) * (hits / PROBE ** 2)];
    };
    const plans = [];
    cards.forEach((card) => {
      const corners = [[0, 0], [1, 0], [0, 1]].map(([u, v]) => project(card, u, v, z0));
      const [full, area] = areaAt(card, z0);
      if (corners.some((q) => !q) || !area) return;
      const [q0, q1, q2] = corners;
      const mirror = (q1[0] - q0[0]) * (q2[1] - q0[1]) - (q1[1] - q0[1]) * (q2[0] - q0[0]) < 0;
      const aspect = Math.hypot(q1[0] - q0[0], q1[1] - q0[1])
        / Math.max(1, Math.hypot(q2[0] - q0[0], q2[1] - q0[1]));
      plans.push({ card: { ...card, mirror }, aspect, weight: area + OFF_VIEW_K * (full - area) });
    });
    const total = plans.reduce((sum, pl) => sum + pl.weight, 0);
    const grids = [];
    if (!plans.length) {
      const uvs = new Float32Array(n * 2).map(() => rnd());
      const edge = new Float32Array(n).map(() => rnd());
      const sx = new Float32Array(n);
      const sy = new Float32Array(n);
      for (let j = 0; j < n; j += 1) { sx[j] = uvs[j * 2] * W; sy[j] = uvs[j * 2 + 1] * H; }
      grids.push({
        card: null, uvs, cells: new Float32Array(n * 2), edge, release: edge.map(releaseAt), sx, sy,
      });
    }
    const tileMax = TILE_MAX_K * Math.sqrt((W * H) / n);
    plans.forEach(({ card, aspect, weight }) => {
      const want = Math.floor((n * weight) / Math.max(1, total));
      const cols = Math.max(1, Math.round(Math.sqrt(want * aspect)));
      const rows = Math.max(1, Math.floor(want / cols));
      const cell = Math.max(card.axisU.length() / cols, card.axisV.length() / rows);
      const tileD = (0.5 * P00 * W * cell) / tileMax;
      const k = cols * rows;
      const uvs = new Float32Array(k * 2);
      const cells = new Float32Array(k * 2);
      const edge = new Float32Array(k);
      const release = new Float32Array(k);
      const sx = new Float32Array(k);
      const sy = new Float32Array(k);
      const { origin: o, axisU: au, axisV: av } = card;
      cells.fill(1 / cols);
      for (let j = 1; j < k * 2; j += 2) cells[j] = 1 / rows;
      for (let j = 0; j < k; j += 1) {
        const u = ((j % cols) + 0.5) / cols;
        const v = (Math.floor(j / cols) + 0.5) / rows;
        uvs[j * 2] = u;
        uvs[j * 2 + 1] = v;
        const inner = Math.min(1, 2 * Math.min(u, 1 - u, v, 1 - v));
        edge[j] = EDGE_LEAD * inner + (1 - EDGE_LEAD) * rnd();
        const x = o.x + au.x * u + av.x * v;
        const y = o.y + au.y * u + av.y * v;
        const z = o.z + au.z * u + av.z * v;
        const due = Math.min(releaseAt(edge[j]), pAtCamZ(zoom, z + tileD));
        release[j] = Math.max(FLIGHT.release[0], due);
        const zDep = camZAt(zoom, release[j]);
        const d = RELEASE_REACH * Math.max(0.001, zDep - z - MIN_DEPTH);
        const D = zDep - d * (1 - Math.exp(-Math.max(0, zDep - zPair) / d)) - z;
        sx[j] = D < 0.05 ? W / 2 : pxX(x, D);
        sy[j] = D < 0.05 ? H / 2 : pxY(y, D);
      }
      grids.push({
        card, uvs, cells, edge, release, sx, sy,
      });
    });
    const k = grids.reduce((sum, g) => sum + g.edge.length, 0);
    const sx = new Float32Array(k);
    const sy = new Float32Array(k);
    let o = 0;
    const slices = grids.map((g) => {
      addDraw(g.card, g);
      sx.set(g.sx, o);
      sy.set(g.sy, o);
      const slice = [o, o + g.edge.length];
      [, o] = slice;
      return slice;
    });
    const token = {};
    pairing = token;
    const nextFrame = () => new Promise((res) => { requestAnimationFrame(res); });
    const live = () => pairing === token;
    return nextFrame().then(() => {
      if (!live()) return false;
      const ranks = softRanks(sx, sy, k, rnd);
      return nextFrame().then(() => {
        if (!live()) return false;
        pending.forEach((d, di) => fillDraw(d, ranks.subarray(...slices[di]), rnd));
        disposeDraws(draws);
        draws = pending;
        pending = [];
        draws.forEach(({ points }) => { points.visible = lastP < QUOTE_LIVE_P; });
        sourcesPaired = true;
        return true;
      });
    });
  }

  async function layout({ dpr }) {
    generation += 1;
    const gen = generation;
    if (document.fonts) {
      const loads = fontsFor(figureEl).map(({ font, text }) => document.fonts.load(font, text));
      await Promise.all([document.fonts.ready, ...loads]).catch(() => {});
    }
    await idle();
    if (gen !== generation || !figureEl.isConnected) return false;
    const m = measure(figureEl, railEl);
    if (!m || !m.runs.length) { ready = false; return false; }
    const r = rasterize(m, dpr);
    const orderBytes = writeTargets(r, m, dpr);
    ready = !!orderBytes;
    if (ready) writePlane(r, dpr, orderBytes);
    return ready;
  }

  function update(p, { W, H, dpr, active = true, zoom = [0, 0, 0, 0] }) {
    lastP = p;
    const show = ready && active && (sourcesPaired || p >= QUOTE_LIVE_P);
    group.visible = show;
    shared.uP.value = p;
    shared.uView.value.set(W, H);
    shared.uDpr.value = dpr;
    shared.uZoomT.value.set(zoom[0], zoom[1]);
    shared.uCamZ.value.set(zoom[2], zoom[3]);
    draws.forEach(({ points }) => { points.visible = p < QUOTE_LIVE_P; });
    plane.visible = p > FLIGHT.arriveStart;
  }

  const warm = (renderer, camera) => compileShown(renderer, camera, group, [group, plane]);

  return {
    object: group,
    warm,
    layout,
    setSources,
    update,
    isReady: () => ready,
    isPaired: () => sourcesPaired,
    clearSources,
    dispose() {
      generation += 1;
      ready = false;
      clearSources();
      if (group.parent) group.parent.remove(group);
      planeGeo.dispose();
      disposePlaneTextures();
      planeMat.dispose();
    },
  };
}

export function createCardScatter({ expand }) {
  const group = new THREE.Group();
  const shared = {
    uScatterExpand: { value: expand },
    uView: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
  };
  let geo = null;
  let gridKey = '';
  const slots = [];

  function setGrid(cols, rows) {
    const key = `${cols}x${rows}`;
    if (key === gridKey) return;
    gridKey = key;
    const k = cols * rows;
    const uvs = new Float32Array(k * 2);
    const cells = new Float32Array(k * 2);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const j = r * cols + c;
        const u = (c + 0.5) / cols;
        const v = (r + 0.5) / rows;
        uvs.set([u, v], j * 2);
        cells.set([1 / cols, 1 / rows], j * 2);
      }
    }
    const next = pointsGeometry(uvs, cells);
    slots.forEach(({ points }) => { points.geometry = next; });
    if (geo) geo.dispose();
    geo = next;
  }

  function slot(i) {
    if (slots[i]) return slots[i];
    const mat = createCardPointsMaterial(shared, 0);
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.visible = false;
    group.add(points);
    slots[i] = { points, mat };
    return slots[i];
  }

  function update(cards, { W, H, dpr }) {
    shared.uView.value.set(W, H);
    shared.uDpr.value = dpr;
    const used = geo ? cards.length : 0;
    for (let i = 0; i < used; i += 1) {
      const c = cards[i];
      const { points, mat } = slot(i);
      setCardUniforms(mat.uniforms, c);
      mat.uniforms.uScatterP.value = c.d;
      points.renderOrder = c.order;
      points.visible = true;
    }
    for (let i = used; i < slots.length; i += 1) slots[i].points.visible = false;
  }

  function warm(renderer, camera) {
    setGrid(1, 1);
    compileShown(renderer, camera, group, [slot(0).points]);
  }

  return {
    object: group,
    warm,
    setGrid,
    update,
    dispose() {
      slots.forEach(({ points, mat }) => { group.remove(points); mat.dispose(); });
      slots.length = 0;
      if (geo) geo.dispose();
      geo = null;
      if (group.parent) group.parent.remove(group);
    },
  };
}

export function createPullQuote({
  root, getBp, getView, getSpan, getFormationVh, getCards, getSphereGroup, isCardManaged,
  onHeightChange,
}) {
  const figureEl = root.querySelector('.globe-gallery-pullquote');
  const quoteEl = root.querySelector('.globe-gallery-pullquote-quote');
  const railEl = root.querySelector('.globe-gallery-pullquote-rail');
  const forcedColors = window.matchMedia?.('(forced-colors: active)') ?? null;
  const near = [];
  let fx = null;
  let scatter = null;
  let camera = null;
  let canvas = null;
  let rasterTimer = 0;
  const s = { appearT: 0.5, startT: 0.5 };
  const reset = () => Object.assign(s, {
    zoomVh: 0,
    heightVh: 0,
    p: 0,
    live: false,
    sourced: false,
    planes: [],
    viewKey: '',
    nextKey: '',
    nextAt: 0,
    layoutKey: '',
    canvasPos: '',
    on: false,
    swapT: 0,
    swapStr: '',
  });
  reset();

  const isOn = () => s.on;
  const ownsCards = () => s.p > 0 && isOn();
  const zoomPx = () => (s.zoomVh / 100) * getView().H;

  function syncHeight() {
    const zoomVh = parseFloat(getComputedStyle(root).getPropertyValue('--gg-zoom-vh'));
    s.zoomVh = fx && zoomVh > 0 ? zoomVh : 0;
    if (!s.zoomVh) return;
    const at = (zoomT, vh) => getFormationVh() + zoomT * s.zoomVh + vh;
    const quoteDone = Math.max(at(s.startT, QUOTE_LIVE_P * FLY_VH * 100), at(s.appearT, 0));
    const next = Math.round((quoteDone + READ_VH * 100 + 100) * 10) / 10;
    if (next === s.heightVh) return;
    s.heightVh = next;
    root.style.setProperty('--gg-pq-height', `${next}vh`);
    onHeightChange();
  }

  function setCue(appearZoomT) {
    const bp = getBp();
    const startZ = PULL_BP[bp.name].startR * bp.SPHERE_R;
    s.appearT = appearZoomT;
    s.startT = Math.min(appearZoomT, zoomTAtCamZ(startZ, bp.CAM_Z_SPHERE, bp.CAM_Z_END));
    syncHeight();
  }

  function handoffEase(zoomT) {
    if (!isOn()) return 1;
    const t = clamp01((s.startT - zoomT) / HANDOFF_EASE_T);
    return t * t * (3 - 2 * t);
  }

  function fitQuote() {
    const { H, navH } = getView();
    const bandH = H - navH;
    if (!(bandH > 0) || figureEl.scrollHeight <= bandH) return;
    const cs = getComputedStyle(quoteEl);
    const origFs = parseFloat(cs.fontSize);
    const origLh = parseFloat(cs.lineHeight);
    const origLs = parseFloat(cs.letterSpacing) || 0;
    for (let i = 0; i < 2 && figureEl.scrollHeight > bandH; i += 1) {
      const fs = parseFloat(getComputedStyle(quoteEl).fontSize);
      const next = Math.max(origFs * 0.5, fs * (bandH / figureEl.scrollHeight));
      if (Math.abs(next - fs) < 0.5) break;
      const k = next / origFs;
      quoteEl.style.fontSize = `${next.toFixed(1)}px`;
      if (origLh) quoteEl.style.lineHeight = `${(origLh * k).toFixed(1)}px`;
      quoteEl.style.letterSpacing = `${(origLs * k).toFixed(2)}px`;
      plainQuote(quoteEl);
    }
  }

  function layout(force) {
    if (!figureEl || !figureEl.isConnected || !quoteEl) return;
    const { H, navH } = getView();
    const key = `${figureEl.clientWidth}x${H}|${navH}|${capDpr()}`;
    if (!force && key === s.layoutKey) return;
    s.layoutKey = key;
    quoteEl.removeAttribute('style');
    plainQuote(quoteEl);
    if (!fx) return;
    fitQuote();
    const railH = figureEl.getBoundingClientRect().bottom - railEl.getBoundingClientRect().top;
    root.style.setProperty('--gg-pq-rail-h', `${railH.toFixed(1)}px`);
    clearTimeout(rasterTimer);
    rasterTimer = setTimeout(() => {
      fx?.layout({ dpr: capDpr() }).then(() => { s.viewKey = ''; });
    }, DEBOUNCE_MS);
  }

  function dropSelection() {
    const sel = window.getSelection?.();
    if (sel && !sel.isCollapsed && figureEl.contains(sel.anchorNode)) sel.removeAllRanges();
  }

  const worldReleased = (lenisY) => {
    const { blockDocTop, blockHeight } = getSpan();
    return lenisY >= blockDocTop + blockHeight - getView().H;
  };

  function placeCanvas() {
    if (!canvas) return;
    const pos = s.p > 0 ? 'absolute' : 'fixed';
    if (pos === s.canvasPos) return;
    s.canvasPos = pos;
    canvas.style.position = pos;
  }

  function update({ lenisY, dtScale }) {
    if (!fx) return;
    s.on = fx.isReady() && !forcedColors?.matches;
    const startY = scrollYAtZoomT(s.startT, getSpan());
    s.p = clamp01((lenisY - startY) / Math.max(1, FLY_VH * getView().H));
    const live = s.p >= QUOTE_LIVE_P;
    const want = isOn() && live;
    const step = (dtScale * FRAME_MS) / SWAP_MS;
    s.swapT = want && worldReleased(lenisY) ? 1 : clamp01(s.swapT + (want ? step : -step));
    const str = s.swapT.toFixed(3);
    if (str !== s.swapStr) {
      s.swapStr = str;
      figureEl.style.setProperty('--gg-pq-dom', str);
    }
    figureEl.classList.toggle('is-dom', !s.on);
    placeCanvas();
    if (live === s.live) return;
    s.live = live;
    if (!live) dropSelection();
    figureEl.classList.toggle('is-live', live);
  }

  function isDone(lenisY) {
    return s.swapT >= 1 || worldReleased(lenisY);
  }

  function takeNear(card, proxFade) {
    if (!scatter || proxFade >= 1) return false;
    if (proxFade > 0) near.push({ card, d: 1 - proxFade });
    return true;
  }

  function cardPlane(card) {
    const { mesh } = card;
    const { CARD_W_SPHERE, CARD_H_SPHERE } = getBp();
    const u = mesh.material.uniforms;
    const world = (cu, cv) => new THREE.Vector3(
      (cu - 0.5) * CARD_W_SPHERE,
      (0.5 - cv) * CARD_H_SPHERE,
      0,
    ).applyMatrix4(mesh.matrixWorld);
    const origin = world(0, 0);
    return {
      origin,
      axisU: world(1, 0).sub(origin),
      axisV: world(0, 1).sub(origin),
      tex: u.uMap.value,
      repeat: u.uRepeat.value.clone(),
      offset: u.uOffset.value.clone(),
      aspect: u.uAspect.value,
      radius: u.uRadius.value,
      alpha: card.revealT ** 2,
      order: mesh.renderOrder,
    };
  }

  function cardPlanes() {
    const out = [];
    getCards().forEach((card) => {
      if (!card.onSphere || isCardManaged(card)) return;
      const plane = cardPlane(card);
      if (plane.alpha > 0.002) out.push(plane);
    });
    return out;
  }

  function updateScatter(W, H) {
    const { CARD_W_SPHERE, CARD_H_SPHERE, NEAR_FADE_START } = getBp();
    const hPx = (camera.projectionMatrix.elements[5] * H) / 2 / NEAR_FADE_START;
    const cols = Math.ceil((hPx * CARD_W_SPHERE) / CARD_H_SPHERE / NEAR_TILE_PX);
    scatter.setGrid(cols, Math.ceil(hPx / NEAR_TILE_PX));
    camera.updateMatrixWorld();
    const list = near.map(({ card, d }) => {
      const plane = cardPlane(card);
      const pts = [plane.origin, plane.origin.clone().add(plane.axisU),
        plane.origin.clone().add(plane.axisV)].map((v) => v.clone().project(camera));
      const cross = (pts[1].x - pts[0].x) * (pts[2].y - pts[0].y)
        - (pts[1].y - pts[0].y) * (pts[2].x - pts[0].x);
      return { ...plane, d, mirror: cross > 0 };
    });
    near.length = 0;
    scatter.update(list, { W, H, dpr: capDpr() });
  }

  function updateParticles(W, H) {
    const owns = ownsCards();
    const { CAM_Z_SPHERE, CAM_Z_END } = getBp();
    const flyT = (FLY_VH * H) / zoomSpanPx(getSpan());
    const zoom = [s.startT, flyT, CAM_Z_SPHERE, CAM_Z_SPHERE - CAM_Z_END];
    if (owns) {
      const e = camera.projectionMatrix.elements;
      const view = { W, H, zoom, proj: [e[0], e[5], e[8], e[9]] };
      const key = JSON.stringify(view);
      if (key !== s.nextKey) Object.assign(s, { nextKey: key, nextAt: performance.now() });
      const settled = performance.now() - s.nextAt >= DEBOUNCE_MS;
      if (!s.sourced || (key !== s.viewKey && settled)) {
        if (!s.sourced) s.planes = cardPlanes();
        fx.setSources(s.planes, view);
        s.sourced = true;
        s.viewKey = key;
      }
      if (fx.isPaired() || s.p >= QUOTE_LIVE_P) {
        getCards().forEach((card) => {
          if (!isCardManaged(card)) card.mesh.visible = false;
        });
      }
    } else if (s.sourced) {
      s.sourced = false;
      fx.clearSources();
    }
    fx.update(s.p, { W, H, dpr: capDpr(), active: owns, zoom });
  }

  function afterCards() {
    if (!scatter) return;
    const { W, H } = getView();
    if (near.length || (ownsCards() && !s.sourced)) getSphereGroup().updateMatrixWorld(true);
    updateScatter(W, H);
    if (fx) updateParticles(W, H);
  }

  function build(ctx) {
    ({ camera } = ctx);
    canvas = ctx.renderer.domElement;
    const cfg = PULL_BP[getBp().name];
    scatter = createCardScatter({ expand: cfg.expand });
    ctx.scene.add(scatter.object);
    scatter.warm(ctx.renderer, camera);
    if (figureEl && railEl && figureEl.textContent.trim()) {
      fx = createQuoteParticles({ figureEl, railEl, count: cfg.count });
      ctx.scene.add(fx.object);
      fx.warm(ctx.renderer, camera);
    }
    root.classList.toggle('globe-gallery-pq-particles', !!fx);
  }

  function teardown() {
    clearTimeout(rasterTimer);
    fx?.dispose();
    scatter?.dispose();
    fx = null;
    scatter = null;
    canvas = null;
    camera = null;
    near.length = 0;
    root.classList.remove('globe-gallery-pq-particles');
    root.style.removeProperty('--gg-pq-height');
    root.style.removeProperty('--gg-pq-rail-h');
    if (figureEl) {
      figureEl.style.cssText = '';
      figureEl.classList.remove('is-live', 'is-dom');
    }
    reset();
  }

  return {
    build,
    teardown,
    layout,
    syncHeight,
    setCue,
    update,
    afterCards,
    takeNear,
    isDone,
    isOn,
    ownsCards,
    handoffEase,
    zoomPx,
    liveUntil: () => (isOn() ? s.startT : s.appearT),
  };
}
