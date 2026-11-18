import * as THREE from '../../deps/three.js';
import { CARD_RADIUS, logGlobe } from './core.js';

const GRAIN_CELLS = 160;
const WIDE_TEX_RATIO = 2.5;
const TEXT_MAX_SIDE = 2048;
const HINT_FILL = 0.9;
const HINT_FALLBACK = 'adobe-clean-display, sans-serif';

// Signed-distance rounded rect (the corner mask). `b` is the FULL half-extent, radius included.
export const RR_SDF = [
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
];

// Inputs scaled first to dodge precision loss at large coords.
export const HASH21 = [
  'float hash21(vec2 p) {',
  '  p = fract(p * vec2(0.1031, 0.1030));',
  '  p += dot(p, p + 33.33);',
  '  return fract((p.x + p.y) * p.x);',
  '}',
];

const BARREL_WARP = [
  'vec2 barrelWarp(vec2 uv, vec2 center, float k) {',
  '  vec2 d = uv - center;',
  '  return d / (1.0 + k * dot(d, d) * 4.0) + center;',
  '}',
];

export const TO_SRGB = ['vec3 toSrgb(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }'];

const PLANE_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

// Rounded rect computed in the fragment shader, so it stays sharp at any zoom.
// uAspect = card world-space width/height; uRadius = fraction of height.
const MODAL_FRAG = [
  'uniform sampler2D map;',
  'uniform float uAspect;',
  'uniform float uRadius;',
  'uniform float uOpacity;',
  'uniform vec2 uMotionDir;',
  'uniform float uWarp;', // fisheye intensity (0 = none, ~0.4 = strong bulge); used in open/close/drag
  'uniform vec2 uWarpCenter;', // UV anchor for fisheye (0.5, 0.5 default; touch UV during drag)
  'uniform vec2 uRepeat;', // cover-crop carried from the barrel; eases to (1,1) over the fly-out
  'uniform vec2 uOffset;',
  'varying vec2 vUv;',
  ...RR_SDF,
  ...BARREL_WARP,
  ...TO_SRGB,
  'void main() {',
  // Raw vUv so the card outline doesn't warp; half-extents are the FULL plane, since an inset
  // box would clip uRadius of photo off every edge.
  '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
  '  float d = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float alpha = 1.0 - smoothstep(-px, px, d);',
  // Flip uv.x + warp anchor on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  '  vec2 wc = gl_FrontFacing ? uWarpCenter : vec2(1.0 - uWarpCenter.x, uWarpCenter.y);',
  '  vec2 warpedUv = barrelWarp(fUv, wc, uWarp);',
  '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
  // R trails behind, B ghosts ahead.
  '  float r = texture2D(map, baseUv - uMotionDir).r;',
  '  float g = texture2D(map, baseUv).g;',
  '  float b = texture2D(map, baseUv + uMotionDir * 0.5).b;',
  '  vec3 srgb = toSrgb(vec3(r, g, b));',
  '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
  '}',
].join('\n');

export const glf = (n) => n.toFixed(3); // GLSL float literal (a bare `2` is an int there)

// uRepeat/uOffset apply the cover-crop by hand — ShaderMaterial does not auto-apply
// texture.repeat/offset.
const CARD_FRAG = [
  'uniform sampler2D uMap;',
  'uniform float uOpacity;',
  'uniform float uCA;',
  'uniform float uWarp;', // barrel-distortion amount (0 = none, ~0.07 = subtle bulge); used for hover
  'uniform vec2 uHoverPos;',
  'uniform vec2 uRepeat;',
  'uniform vec2 uOffset;',
  'uniform vec2 uMotionDir;',
  'uniform float uAspect;',
  'uniform float uRadius;',
  'uniform float uDissolve;',
  'uniform float uReveal;', // texture-ready reveal: 0 = contour only, 1 = full photo
  'uniform float uContourFade;', // near-camera gate for the contour (mirrors proxFade)
  'varying vec2 vUv;',
  ...RR_SDF,
  ...HASH21,
  ...BARREL_WARP,
  ...TO_SRGB,
  'void main() {',
  // Flip uv.x on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  // Box half-size is the FULL plane (uAspect/2, 0.5) so the rect fills edge-to-edge.
  // fwidth gives ~1px AA.
  '  vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float shapeA = 1.0 - smoothstep(-px, px, dsd);',
  '  float a = shapeA;',
  '  float dR = 1.0; float dG = 1.0; float dB = 1.0;',
  '  if (uDissolve > 0.0) {',
  `    vec2 cell = floor(fUv * vec2(uAspect, 1.0) * ${glf(GRAIN_CELLS)});`,
  '    float nR = hash21(cell + vec2(0.00,  0.00));',
  '    float nG = hash21(cell + vec2(2.10,  1.30));',
  '    float nB = hash21(cell + vec2(1.70, -0.50));',
  '    float edgeProx = 1.0 - smoothstep(0.0, 0.28, -dsd);',
  '    float localDis = clamp(uDissolve + edgeProx * uDissolve * 1.4, 0.0, 1.0);',
  '    float pedge = 0.10;',
  '    dR = smoothstep(localDis - pedge, localDis + pedge, nR);',
  '    dG = smoothstep(localDis - pedge, localDis + pedge, nG);',
  '    dB = smoothstep(localDis - pedge, localDis + pedge, nB);',
  '    a *= (dR + dG + dB) * 0.3333;',
  '  }',
  '  float stroke = 1.0 - smoothstep(0.0, px * 1.5, abs(dsd));',
  '  float contourA = (shapeA * 0.06 + stroke * 0.5) * uContourFade;',
  // The photo alpha is already dispersing when uDissolve > 0, so the reveal reads as the same
  // edge-first un-dissolve.
  '  float outA = mix(contourA, a * uOpacity, uReveal);',
  // Bail BEFORE the texture fetches.
  '  if (outA < 0.002) discard;',
  '  vec2 warpedUv = barrelWarp(fUv, uHoverPos, uWarp);',
  '  vec2 mdir = fUv - 0.5;',
  '  vec2 meltUv = warpedUv;',
  '  if (uDissolve > 0.0) {',
  '    meltUv = (warpedUv - 0.5) / (1.0 + uDissolve * 1.8) + 0.5;',
  '  }',
  '  vec2 baseUv = meltUv * uRepeat + uOffset;',
  '  vec2 meltRad = mdir * uDissolve * 0.22;',
  '  vec2 radial = mdir * uCA + meltRad;',
  '  float r = texture2D(uMap, baseUv + radial - uMotionDir).r * dR;',
  '  float g = texture2D(uMap, baseUv).g * dG;',
  '  float b = texture2D(uMap, baseUv - radial + uMotionDir * 0.5).b * dB;',
  '  vec3 srgb = toSrgb(vec3(r, g, b));',
  '  vec3 outCol = mix(vec3(1.0), srgb, uReveal);',
  '  gl_FragColor = vec4(outCol, outA);',
  '}',
].join('\n');

const TEXT_FRAG = [
  'uniform sampler2D uMap;',
  'uniform float uOpacity;',
  'uniform float uCA;',
  'uniform float uWarp;',
  'uniform float uZoom;',
  'uniform float uAspect;',
  'uniform float uExitP;',
  'uniform vec2  uResolution;',
  'varying vec2  vUv;',
  ...HASH21,
  ...TO_SRGB,
  'void main() {',
  '  vec2 d = vUv - 0.5;',
  '  d.x *= 1.0 + uExitP * 1.6;',
  '  d    += d * uExitP * 0.7;',
  '  vec2 dA = vec2(d.x * uAspect, d.y);',
  '  float r2 = dot(dA, dA);',
  '  float exitWarp = uWarp + uExitP * 3.0;',
  '  vec2 finalUv = d / (1.0 + exitWarp * r2 * 4.0) + 0.5;',
  '  vec2 radial = (vUv - 0.5) * uCA;',
  '  float r = texture2D(uMap, finalUv + radial).r;',
  '  vec4 c = texture2D(uMap, finalUv);',
  '  float g = c.g;',
  '  float b = texture2D(uMap, finalUv - radial).b;',
  '  float a = c.a;',
  // Sample alpha at 4 offsets so dissolve fires at glyph edges first.
  '  float _bl  = 0.020;',
  '  float _a4  = texture2D(uMap, finalUv + vec2( _bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(-_bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0,  _bl)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0, -_bl)).a;',
  '  float edgeProx = 1.0 - _a4 * 0.25;',
  // 2px screen-space grain, per-channel seeds → RGB split.
  '  vec2  cell    = floor(gl_FragCoord.xy * 0.5);',
  '  float nR      = hash21(cell + vec2(0.00,  0.00));',
  '  float nG      = hash21(cell + vec2(2.10,  1.30));',
  '  float nB      = hash21(cell + vec2(1.70, -0.50));',
  '  float dissolve  = clamp(uWarp * 0.2 + uZoom * 2.0 + uExitP * 0.97, 0.0, 0.97);',
  '  float localDis  = clamp(dissolve + edgeProx * dissolve * 2.0, 0.0, 0.97);',
  '  float pedge     = 0.06;',
  '  float dR = smoothstep(localDis - pedge, localDis + pedge, nR);',
  '  float dG = smoothstep(localDis - pedge, localDis + pedge, nG);',
  '  float dB = smoothstep(localDis - pedge, localDis + pedge, nB);',
  '  r *= dR;  g *= dG;  b *= dB;',
  '  a *= (dR + dG + dB) * 0.333;',
  '  vec3 srgb = toSrgb(vec3(r, g, b));',
  '  vec2  sc   = gl_FragCoord.xy / uResolution;',
  '  float fz   = max(0.005, uWarp * 0.025);',
  '  float fadeX = smoothstep(0.0, fz,       sc.x) * smoothstep(1.0, 1.0 - fz,       sc.x);',
  '  float fadeY = smoothstep(0.0, fz * 0.5, sc.y) * smoothstep(1.0, 1.0 - fz * 0.5, sc.y);',
  '  float exitFade = 1.0 - smoothstep(0.0, 1.0, uExitP);',
  '  gl_FragColor = vec4(srgb, a * uOpacity * fadeX * fadeY * exitFade);',
  '}',
].join('\n');

// Property proxies let the tick loop drive this via MeshBasicMaterial's opacity/map API.
export function createCardMaterial({ texture, aspect }) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
      uMotionDir: { value: new THREE.Vector2() },
      uWarp: { value: 0 },
      uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: aspect },
      uRadius: { value: CARD_RADIUS },
      uDissolve: { value: 0 },
      uReveal: { value: 0 },
      uContourFade: { value: 1 },
    },
    vertexShader: PLANE_VERT,
    fragmentShader: CARD_FRAG,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
  });
  const { uOpacity, uMap } = mat.uniforms;
  return Object.defineProperties(mat, {
    opacity: { get: () => uOpacity.value, set(v) { uOpacity.value = v; } },
    map: { get: () => uMap.value, set(v) { uMap.value = v; } },
    needsUpdate: { get: () => false, set() {} },
  });
}

// `aspect` is the card's world-space width/height; uRadius is a fraction of card height and is
// owned by modal.js.
export function createModalMaterial({ texture, aspect }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      uAspect: { value: aspect },
      uRadius: { value: CARD_RADIUS },
      uOpacity: { value: 1.0 },
      uMotionDir: { value: new THREE.Vector2() },
      uWarp: { value: 0 },
      uWarpCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2() },
    },
    vertexShader: PLANE_VERT,
    fragmentShader: MODAL_FRAG,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
  });
}

export function createTextMaterial({ texture, aspect, resolution }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uWarp: { value: 0 },
      uZoom: { value: 0 },
      uAspect: { value: aspect },
      uExitP: { value: 0 },
      uResolution: { value: new THREE.Vector2(resolution.x, resolution.y) },
    },
    vertexShader: PLANE_VERT,
    fragmentShader: TEXT_FRAG,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
}

function scaleDims(w, h, s) {
  if (s >= 1) return { w, h };
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

const fitDims = (w, h, maxTex) => scaleDims(w, h, maxTex / Math.max(w, h));

const fitCardDims = (w, h, maxH) => scaleDims(
  w,
  h,
  Math.min(maxH / Math.max(1, h), (maxH * WIDE_TEX_RATIO) / Math.max(1, w)),
);

export function createCanvas(w, h) {
  return Object.assign(document.createElement('canvas'), { width: w, height: h });
}

function srgbTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSolidTexture(w, h, color) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  return srgbTexture(canvas);
}

async function imageToTexture(img, cap, name, fit = fitDims) {
  const { w, h } = fit(img.naturalWidth || 512, img.naturalHeight || 512, cap);
  try {
    const opts = { resizeWidth: w, resizeHeight: h, resizeQuality: 'high', imageOrientation: 'flipY' };
    const bitmap = await createImageBitmap(img, opts);
    const tex = new THREE.Texture(bitmap);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  } catch (e) {
    logGlobe(name, `card image could not be rasterized, rendering fallback: ${img.src} — ${e?.message || e}`);
    return makeSolidTexture(w, h, '#444');
  }
}

// Lets a card mesh be built before its photo loads. Its pixels are never shown — the contour
// hides them until uReveal > 0.
export const createPlaceholderTexture = () => makeSolidTexture(1, 1, '#555');

const texAspect = (tex) => (tex.image?.width || 1) / (tex.image?.height || 1);

function loadImage(src, crossOrigin, onLoad, onError) {
  const img = new Image();
  if (crossOrigin) img.crossOrigin = crossOrigin;
  img.onload = () => onLoad(img);
  img.onerror = onError;
  img.src = src;
  return img;
}

export function loadCardTextures({ count, getSrc, maxTexH, getCrossOrigin, name }, onEach, onDone) {
  let loaded = 0;

  function done(i, tex) {
    onEach(i, tex, texAspect(tex));
    loaded += 1;
    if (loaded === count) onDone();
  }

  for (let i = 0; i < count; i += 1) {
    const src = getSrc(i);
    loadImage(src, getCrossOrigin(i), (img) => {
      imageToTexture(img, maxTexH, name, fitCardDims).then((tex) => done(i, tex));
    }, () => {
      logGlobe(name, `card image failed to load, rendering fallback: ${src}`);
      done(i, makeSolidTexture(4, 6, '#555'));
    });
  }
}

// Returns the Image so a pending load can be cancelled; caller owns disposal.
export function loadModalTexture({ src, maxTex, crossOrigin, name }, onReady, onError) {
  return loadImage(src, crossOrigin, (img) => {
    imageToTexture(img, maxTex, name).then(onReady);
  }, () => {
    logGlobe(name, `modal texture upgrade failed: ${src}`);
    onError?.();
  });
}

function hintFamilies() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--heading-font-family') || HINT_FALLBACK;
}

export function loadHintFont(text) {
  return document.fonts.load(`900 100px ${hintFamilies()}`, text);
}

// canvas silently keeps its 10px default when the shorthand does not parse.
function usableFamilies(ctx) {
  const authored = hintFamilies();
  ctx.font = `900 100px ${authored}`;
  if (ctx.font.includes('100px')) return authored;
  ctx.font = `900 100px ${HINT_FALLBACK}`;
  return ctx.font.includes('100px') ? HINT_FALLBACK : null;
}

// `aspect` is the camera aspect, so texture pixels stay square. Null when no font parses.
export function createClickDragTexture(aspect, hintText) {
  const canvasW = aspect >= 1 ? TEXT_MAX_SIDE : Math.max(1, Math.round(TEXT_MAX_SIDE * aspect));
  const canvasH = aspect >= 1 ? Math.max(1, Math.round(TEXT_MAX_SIDE / aspect)) : TEXT_MAX_SIDE;
  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const families = usableFamilies(ctx);
  if (!families) return null;

  const setFont = (px) => {
    ctx.font = `900 ${px}px ${families}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `-${Math.round(px * 0.04)}px`;
  };

  // Measure at a reference size, scale to HINT_FILL of the width, cap to a height budget.
  const refSize = Math.round((canvasW * 250) / 1440); // Figma: 250px @ 1440 viewport
  setFont(refSize);
  const measured = ctx.measureText(hintText).width || 1;
  const maxSize = Math.round(canvasH * 0.55); // keeps glyphs within the ~75% height budget
  const fitSize = Math.round(refSize * ((canvasW * HINT_FILL) / measured));
  const fontSize = Math.min(maxSize, fitSize);
  setFont(fontSize);

  ctx.fillText(hintText, canvasW / 2, canvasH * 0.5);

  const tex = srgbTexture(canvas);
  tex.onUpdate = () => Object.assign(canvas, { width: 0, height: 0 }); // see README (Textures)
  return tex;
}
