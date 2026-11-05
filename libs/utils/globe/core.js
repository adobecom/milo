import * as THREE from '../../deps/three.js';

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

// Rounded rect computed in the fragment shader, so it stays sharp at any zoom.
// uAspect = card world-space width/height; uRadius = fraction of height.
export const MODAL_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

export const MODAL_FRAG = [
  'uniform sampler2D map;',
  'uniform float uAspect;',
  'uniform float uRadius;', // corner radius (fraction of card height); 0 = square (mobile full-bleed)
  'uniform float uOpacity;',
  'uniform vec2 uMotionDir;', // card velocity in UV space — drives motion-trail CA; (0,0) = off
  'uniform float uWarp;', // fisheye intensity (0 = none, ~0.4 = strong bulge); used in open/close/drag
  'uniform vec2 uWarpCenter;', // UV anchor for fisheye (0.5, 0.5 default; touch UV during drag)
  'uniform vec2 uRepeat;', // cover-crop carried from the barrel; eases to (1,1) over the fly-out
  'uniform vec2 uOffset;',
  'varying vec2 vUv;',
  ...RR_SDF,
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
  '  vec2 d2 = fUv - wc;',
  '  float r2 = dot(d2, d2);',
  '  vec2 warpedUv = d2 / (1.0 + uWarp * r2 * 4.0) + wc;',
  '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
  // R trails behind, B ghosts ahead.
  '  float r = texture2D(map, baseUv - uMotionDir).r;',
  '  float g = texture2D(map, baseUv).g;',
  '  float b = texture2D(map, baseUv + uMotionDir * 0.5).b;',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
  '}',
].join('\n');

// uRepeat/uOffset apply the cover-crop by hand — ShaderMaterial does not auto-apply
// texture.repeat/offset.
export const CARD_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

const GRAIN_CELLS = 160;
export const glf = (n) => n.toFixed(3); // GLSL float literal (a bare `2` is an int there)

export const CARD_FRAG = [
  'uniform sampler2D uMap;',
  'uniform float uOpacity;',
  'uniform float uCA;',
  'uniform float uWarp;', // barrel-distortion amount (0 = none, ~0.07 = subtle bulge); used for hover
  'uniform vec2 uHoverPos;', // anchor point for the warp in UV space; cursor position on card during hover
  'uniform vec2 uRepeat;',
  'uniform vec2 uOffset;',
  'uniform vec2 uMotionDir;', // card motion in UV space × intensity; (0,0) = no smear
  'uniform float uAspect;', // card world-space width/height (set per phase) so corners stay circular
  'uniform float uRadius;', // corner radius as a fraction of card height (22/631)
  'uniform float uDissolve;',
  'uniform float uReveal;', // texture-ready reveal: 0 = contour only, 1 = full photo
  'uniform float uContourFade;', // near-camera gate for the contour (mirrors proxFade)
  'varying vec2 vUv;',
  ...RR_SDF,
  ...HASH21,
  'void main() {',
  // Flip uv.x on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  // Box half-size is the FULL plane (uAspect/2, 0.5) so the rect fills edge-to-edge.
  // fwidth gives ~1px AA.
  '  vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float shapeA = 1.0 - smoothstep(-px, px, dsd);', // solid box alpha, for the contour
  '  float a = shapeA;',
  // Particle grain, eaten edge-first.
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
  // Faint fill + ~1px edge stroke, shown before the photo un-dissolves in.
  '  float stroke = 1.0 - smoothstep(0.0, px * 1.5, abs(dsd));',
  '  float contourA = (shapeA * 0.06 + stroke * 0.5) * uContourFade;',
  // The photo alpha is already dispersing when uDissolve > 0, so the reveal reads as the same
  // edge-first un-dissolve.
  '  float outA = mix(contourA, a * uOpacity, uReveal);',
  // Bail BEFORE the texture fetches.
  '  if (outA < 0.002) discard;',
  '  vec2 d  = fUv - uHoverPos;',
  '  float r2 = dot(d, d);',
  '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
  '  vec2 mdir = fUv - 0.5;',
  '  vec2 meltUv = warpedUv;',
  '  float melt = uDissolve;',
  '  if (melt > 0.0) {',
  '    meltUv = (warpedUv - 0.5) / (1.0 + melt * 1.8) + 0.5;',
  '  }',
  '  vec2 baseUv = meltUv * uRepeat + uOffset;',
  // R trails behind, B ghosts ahead; smear scales with dissolve.
  '  vec2 meltRad = mdir * uDissolve * 0.22;',
  '  vec2 radial = mdir * uCA + meltRad;',
  '  float r = texture2D(uMap, baseUv + radial - uMotionDir).r * dR;',
  '  float g = texture2D(uMap, baseUv).g * dG;',
  '  float b = texture2D(uMap, baseUv - radial + uMotionDir * 0.5).b * dB;',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  vec3 outCol = mix(vec3(1.0), srgb, uReveal);',
  '  gl_FragColor = vec4(outCol, outA);',
  '}',
].join('\n');

// A CARD_FRAG variant over a text canvas, no corner SDF.
export const TEXT_FRAG = [
  'uniform sampler2D uMap;',
  'uniform float uOpacity;',
  'uniform float uCA;',
  'uniform float uWarp;',
  'uniform float uZoom;',
  'uniform float uUVScale;',
  'uniform float uAspect;',
  'uniform float uExitP;',
  'uniform vec2  uResolution;',
  'varying vec2  vUv;',
  ...HASH21,
  'void main() {',
  '  vec2 d = vUv - 0.5;',
  '  d.x *= 1.0 + uExitP * 1.6;',
  '  d    += d * uExitP * 0.7;',
  '  vec2 dA = vec2(d.x * uAspect, d.y);', // scale x to world-proportional space
  '  float r2 = dot(dA, dA);', // isotropic radius in world space
  '  float exitWarp = uWarp + uExitP * 3.0;',
  '  vec2 warpedVUv = d / (1.0 + exitWarp * r2 * 4.0) + 0.5;',
  '  vec2 finalUv = (warpedVUv - 0.5) / uUVScale + 0.5;',
  '  vec2 radial = (vUv - 0.5) * uCA;',
  '  float r = texture2D(uMap, finalUv + radial).r;',
  '  float g = texture2D(uMap, finalUv).g;',
  '  float b = texture2D(uMap, finalUv - radial).b;',
  '  float a = texture2D(uMap, finalUv).a;',
  // Sample alpha at 4 offsets so dissolve fires at glyph edges first.
  '  float _bl  = 0.020;',
  '  float _a4  = texture2D(uMap, finalUv + vec2( _bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(-_bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0,  _bl)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0, -_bl)).a;',
  '  float edgeProx = 1.0 - _a4 * 0.25;', // 0=deep interior, 1=at/near edge
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
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  vec2  sc   = gl_FragCoord.xy / uResolution;',
  '  float fz   = max(0.005, uWarp * 0.025);',
  '  float fadeX = smoothstep(0.0, fz,       sc.x) * smoothstep(1.0, 1.0 - fz,       sc.x);',
  '  float fadeY = smoothstep(0.0, fz * 0.5, sc.y) * smoothstep(1.0, 1.0 - fz * 0.5, sc.y);',
  '  float exitFade = 1.0 - smoothstep(0.0, 1.0, uExitP);',
  '  gl_FragColor = vec4(srgb, a * uOpacity * fadeX * fadeY * exitFade);',
  '}',
].join('\n');

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }

export function lerpN(a, b, t) { return a + (b - a) * t; }

export function clamp01(t) { return t > 0 ? Math.min(1, t) : 0; }

// UV repeat + offset that fills `planeAspect` with `imgAspect`, centre-cropping the overflow.
// Caller owns `out`.
export function coverFit(imgAspect, planeAspect, out = {}) {
  out.rx = 1; out.ry = 1; out.ox = 0; out.oy = 0;
  if (!(imgAspect > 0) || !(planeAspect > 0)) return out;
  if (imgAspect > planeAspect) {
    out.rx = planeAspect / imgAspect; // wider than the plane → crop left/right
    out.ox = (1 - out.rx) / 2;
  } else if (imgAspect < planeAspect) {
    out.ry = imgAspect / planeAspect; // taller than the plane → crop top/bottom
    out.oy = (1 - out.ry) / 2;
  }
  return out;
}

const MAX_DPR = 2;
export const capDpr = () => Math.min(window.devicePixelRatio, MAX_DPR);

export const CAM_FOV = 60;
export const TAN_HALF_FOV = Math.tan((CAM_FOV * Math.PI) / 360);

export function pxPerWorldAt(dist, H) { return H / (2 * dist * TAN_HALF_FOV); }

export const FRAME_MS = 1000 / 60;

export const DT_SCALE_MIN = 0.25;
export const DT_SCALE_MAX = 3;
export function dtScaleOf(now, prevNow) {
  const dtMs = prevNow ? now - prevNow : FRAME_MS;
  return Math.max(DT_SCALE_MIN, Math.min(DT_SCALE_MAX, dtMs / FRAME_MS));
}

export function camZAtT(t, camZSphere, camZEnd, pow) {
  return lerpN(camZSphere, camZEnd, 1 - (1 - clamp01(t)) ** pow);
}

export function tAtCamZ(z, camZSphere, camZEnd, pow) {
  const span = camZSphere - camZEnd;
  if (!(span > 0)) return 0;
  const eased = Math.min(1, Math.max(0, (camZSphere - z) / span));
  return 1 - ((1 - eased) ** (1 / pow));
}

// GPU-asset factories: the ShaderMaterials + the texture loaders.

// Property proxies let the tick loop drive this via MeshBasicMaterial's opacity/map API.
export function createCardMaterial({ texture, aspect }) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uMotionDir: { value: new THREE.Vector2(0, 0) },
      uWarp: { value: 0 },
      uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: aspect },
      uRadius: { value: 22.0 / 631.0 },
      uDissolve: { value: 0 },
      uReveal: { value: 0 }, // texture-ready reveal (0 = contour only, 1 = full photo)
      uContourFade: { value: 1 }, // near-camera gate for the contour (mirrors proxFade)
    },
    vertexShader: CARD_VERT,
    fragmentShader: CARD_FRAG,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
  });
  Object.defineProperty(mat, 'opacity', { get() { return mat.uniforms.uOpacity.value; }, set(v) { mat.uniforms.uOpacity.value = v; } });
  Object.defineProperty(mat, 'map', { get() { return mat.uniforms.uMap.value; }, set(v) { mat.uniforms.uMap.value = v; } });
  Object.defineProperty(mat, 'needsUpdate', { get() { return false; }, set() {} });
  return mat;
}

// `aspect` is the card's world-space width/height; uRadius is a fraction of card height and is
// owned by modal.js.
export function createModalMaterial(texture, aspect) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      uAspect: { value: aspect },
      uRadius: { value: 22.0 / 631.0 },
      uOpacity: { value: 1.0 },
      uMotionDir: { value: new THREE.Vector2(0, 0) },
      uWarp: { value: 0 },
      uWarpCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRepeat: { value: new THREE.Vector2(1, 1) },
      uOffset: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: MODAL_VERT,
    fragmentShader: MODAL_FRAG,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    extensions: { derivatives: true }, // enables fwidth in WebGL1; no-op in WebGL2
  });
}

// `aspect` is the camera aspect (x-axis warp); `resolution` is the device-pixel canvas size.
export function createTextMaterial({ texture, aspect, resolution }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uWarp: { value: 0 },
      uZoom: { value: 0 },
      uUVScale: { value: 1.0 },
      uAspect: { value: aspect },
      uExitP: { value: 0 },
      uResolution: { value: new THREE.Vector2(resolution.x, resolution.y) },
    },
    vertexShader: CARD_VERT,
    fragmentShader: TEXT_FRAG,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
}

// Clamp the longest side to `maxTex` px, preserving aspect.
function fitDims(w, h, maxTex) {
  const longest = Math.max(w, h);
  if (longest <= maxTex) return { w, h };
  const s = maxTex / longest;
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

// Capped on HEIGHT (the axis a portrait-ish slot keeps), with WIDE_TEX_RATIO bounding a
// panorama's width.
const WIDE_TEX_RATIO = 2.5;
function fitCardDims(w, h, maxH) {
  const s = Math.min(1, maxH / Math.max(1, h), (maxH * WIDE_TEX_RATIO) / Math.max(1, w));
  if (s >= 1) return { w, h };
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

function makeCanvas(w, h, color) {
  const cv = document.createElement('canvas');
  cv.width = w || 4; cv.height = h || 6;
  const ctx2 = cv.getContext('2d');
  ctx2.fillStyle = color || '#555';
  ctx2.fillRect(0, 0, cv.width, cv.height);
  return cv;
}

function makeSolidTexture(w, h, color) {
  const tex = new THREE.CanvasTexture(makeCanvas(w, h, color));
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

async function imageToTexture(img, cap, fit = fitDims, name = 'globe') {
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
    window.lana?.log?.(`${name}: card image could not be rasterized, rendering fallback: ${img.src} — ${e?.message || e}`, { tags: name, severity: 'warn' });
    return makeSolidTexture(w, h, '#444');
  }
}

function releaseCanvasAfterUpload(tex, cv) {
  tex.onUpdate = () => { cv.width = 0; cv.height = 0; };
}

// Lets a card mesh be built before its photo loads. Its pixels are never shown — the contour
// hides them until uReveal > 0.
export function createPlaceholderTexture() {
  const cv = document.createElement('canvas');
  cv.width = 1; cv.height = 1;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function texAspect(tex) {
  const imgW = (tex.image && tex.image.width) || 1;
  const imgH = (tex.image && tex.image.height) || 1;
  return imgW / imgH;
}

export function loadCardTextures({ count, getSrc, maxTexH, getCrossOrigin, name }, onEach, onDone) {
  let loaded = 0;
  const textures = new Array(count);
  const aspects = new Array(count);

  function done(i, tex) {
    const aspect = texAspect(tex);
    textures[i] = tex;
    aspects[i] = aspect;
    if (onEach) onEach(i, tex, aspect);
    loaded += 1;
    if (loaded === count && onDone) onDone(textures, aspects);
  }

  function tryLoad(i) {
    const img = new Image();
    const co = getCrossOrigin ? getCrossOrigin(i) : null;
    if (co) img.crossOrigin = co;
    img.onload = () => {
      imageToTexture(img, maxTexH, fitCardDims, name).then((tex) => done(i, tex));
    };
    img.onerror = () => {
      window.lana?.log?.(`${name}: card image failed to load, rendering fallback: ${getSrc(i)}`, { tags: name, severity: 'warn' });
      done(i, makeSolidTexture(4, 6, '#555'));
    };
    img.src = getSrc(i);
  }

  for (let i = 0; i < count; i += 1) tryLoad(i);
}

// Returns the Image so a pending load can be cancelled; caller owns disposal.
export function loadModalTexture(src, maxTex, onReady, onError, crossOrigin, name = 'globe') {
  const img = new Image();
  if (crossOrigin) img.crossOrigin = crossOrigin;
  img.onload = () => {
    imageToTexture(img, maxTex, undefined, name).then(onReady);
  };
  img.onerror = () => {
    window.lana?.log?.(`${name}: modal texture upgrade failed: ${src}`, { tags: name, severity: 'warn' });
    if (onError) onError();
  };
  img.src = src;
  return img;
}

const TEXT_MAX_SIDE = 2048;

// Fraction of canvas width the text fills; the font auto-scales to hit it for any string.
const HINT_FILL = 0.9;

const HINT_FALLBACK = 'adobe-clean-display, sans-serif';
function hintFamilies() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--heading-font-family') || HINT_FALLBACK;
}

export async function loadHintFont(text) {
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
export function createClickDragTexture(aspect, hintText = 'Click & Drag') {
  let canvasW; let canvasH;
  if (aspect >= 1) {
    canvasW = TEXT_MAX_SIDE;
    canvasH = Math.max(1, Math.round(TEXT_MAX_SIDE / aspect));
  } else {
    canvasH = TEXT_MAX_SIDE;
    canvasW = Math.max(1, Math.round(TEXT_MAX_SIDE * aspect));
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const families = usableFamilies(ctx);
  if (!families) return null;

  const setFont = (px) => {
    ctx.font = `900 ${px}px ${families}`;
    if (typeof ctx.letterSpacing !== 'undefined') {
      ctx.letterSpacing = `-${Math.round(px * 0.04)}px`;
    }
  };

  // Measure at a reference size, scale to HINT_FILL of the width, cap to a height budget.
  const refSize = Math.round((canvasW * 250) / 1440); // Figma: 250px @ 1440 viewport
  setFont(refSize);
  const rawWidth = ctx.measureText(hintText).width;
  const measured = rawWidth > 0 ? rawWidth : 1;
  const maxSize = Math.round(canvasH * 0.55); // keeps glyphs within the ~75% height budget
  const fitSize = Math.round(refSize * ((canvasW * HINT_FILL) / measured));
  const fontSize = Math.min(maxSize, fitSize);
  setFont(fontSize);

  ctx.fillText(hintText, canvasW / 2, canvasH * 0.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  releaseCanvasAfterUpload(tex, canvas); // sphere-only, single renderer — see README
  return tex;
}

export function resolveBP(breakpoints, w) {
  if (w >= breakpoints.md.minWidth) return { name: 'md', cfg: breakpoints.md };
  return { name: 'sm', cfg: breakpoints.sm };
}

export const CARD_ASPECT = 456 / 631;

export function sphereCardScale(srcAspect) {
  const a = Number.isFinite(srcAspect) && srcAspect > 0 ? srcAspect : CARD_ASPECT;
  const stretch = Math.sqrt(a / CARD_ASPECT);
  return { sX: stretch, sY: 1 / stretch };
}

export const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  || !!window.matchMedia?.('(height <= 460px) and (resolution >= 1.5dppx)').matches;

export function usesCylinderGeometry(bandName) {
  if (bandName === 'sm') return true;
  return !!window.matchMedia?.('(pointer: coarse)').matches;
}

// Yaw-only drags (touch / narrow): a cylindrical masonry wall replaces the Fibonacci sphere.
export const YAW_ONLY_GEOMETRY = {
  CYLINDER: true,
  CYL_COLS_FIT: 0.80, // wall-height dial: fewest columns whose tallest fits this × frustum
  CYL_COL_GAP_RATIO: 0.20, // column gap as a fraction of card width; also sets cardW
  CYL_ROW_GAP_RATIO: 0.10, // row gap as a fraction of card width
  CYL_ASPECT_CAP: 1.9, // on the LAID-OUT aspect; past it the fit crops
  CYL_BULGE: 0.18, // r = R·(1 − bulge·t²); keep ≤~0.2 or edges overlap
  CARD_FACE_CAMERA: 0.1, // >0 costs barrel smoothness
};

const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));

export const WORLD_UP = new THREE.Vector3(0, 1, 0);

const BALANCE_PASSES = 20;

export const COLUMN_EPS = 1e-6;

function balanceColumns(heights, gap, cols) {
  const n = heights.length;
  const load = new Array(cols).fill(0);
  const col = new Array(n);
  const tallestFirst = Array.from({ length: n }, (unused, i) => i)
    .sort((a, b) => heights[b] - heights[a] || a - b);
  for (let k = 0; k < n; k += 1) {
    const i = tallestFirst[k];
    let best = 0;
    for (let c = 1; c < cols; c += 1) if (load[c] < load[best]) best = c;
    col[i] = best;
    load[best] += heights[i] + gap;
  }
  for (let pass = 0; pass < BALANCE_PASSES; pass += 1) {
    let swapped = false;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const [a, b, d] = [col[i], col[j], heights[i] - heights[j]];
        if (a !== b && d * (load[b] - load[a] + d) < 0) {
          load[a] -= d;
          load[b] += d;
          col[i] = b;
          col[j] = a;
          swapped = true;
        }
      }
    }
    if (!swapped) break;
  }
  return col;
}

// Cylindrical masonry layout — a WHOLE-SET solve; returns { pos, w, h } per card.
// See README (yaw-only geometry) for the packing + column-count rules.
export function cylinderMasonryLayout({
  aspects, radius, frustumH, colsFit, colGapRatio, rowGapRatio = colGapRatio, aspectCap, bulge = 0,
}) {
  const n = aspects.length;
  // Clamp extremes so one panorama can't dominate a column (cover-crop handles the rest).
  const clamped = aspects.map((ar) => {
    const a = Number.isFinite(ar) && ar > 0 ? ar : 1;
    return Math.max(1 / aspectCap, Math.min(aspectCap, a));
  });

  const pack = (cols) => {
    const pitch = (2 * Math.PI * radius) / cols;
    const cardW = pitch / (1 + colGapRatio);
    const rowGap = cardW * rowGapRatio;
    const hs = clamped.map((a) => cardW / a);
    const col = balanceColumns(hs, rowGap, cols);
    const colH = new Array(cols).fill(0);
    const placed = new Array(n);
    for (let c = 0; c < cols; c += 1) {
      for (let i = 0; i < n; i += 1) {
        if (col[i] !== c) continue; // eslint-disable-line no-continue
        placed[i] = { col: c, offset: colH[c], w: cardW, h: hs[i] };
        colH[c] += hs[i] + rowGap;
      }
    }
    const totals = colH.map((h) => Math.max(0, h - rowGap));
    return { placed, totals, wallH: Math.max(...totals) };
  };

  // Fewest columns that fit.
  let packed = null;
  for (let cols = Math.min(4, n); cols <= Math.max(4, n); cols += 1) {
    packed = pack(cols);
    if (packed.wallH <= frustumH * colsFit) break;
  }

  const cols = packed.totals.length;
  // Barrel bulge: r(t) = radius·(1 − bulge·t²), t = 2y/wallH ∈ [−1,1]. Azimuth is untouched.
  const wallH = packed.wallH || 1;
  return packed.placed.map((p, i) => {
    const colTotal = packed.totals[p.col];
    const y = colTotal / 2 - p.offset - p.h / 2;
    const azimuth = (2 * Math.PI * p.col) / cols;
    const t = Math.max(-1, Math.min(1, (2 * y) / wallH));
    const r = radius * (1 - bulge * t * t);
    // Outward normal of the surface of revolution r(y): (1, −dr/dy) normalized, at this azimuth.
    const dRdy = bulge === 0 ? 0 : radius * -2 * bulge * t * (2 / wallH);
    const nScale = 1 / Math.hypot(1, dRdy);
    return {
      pos: new THREE.Vector3(
        r * Math.cos(azimuth),
        y,
        r * Math.sin(azimuth),
      ),
      normal: new THREE.Vector3(
        nScale * Math.cos(azimuth),
        -dRdy * nScale,
        nScale * Math.sin(azimuth),
      ),
      w: p.w,
      h: p.h,
      index: i,
    };
  });
}

export function fibSpherePos(i, total, radius) {
  const y = 1 - (2 * i + 1) / total;
  const polarAngle = Math.acos(Math.max(-1, Math.min(1, y)));
  const azimuth = GOLDEN_ANGLE * i;
  return new THREE.Vector3(
    radius * Math.sin(polarAngle) * Math.cos(azimuth),
    radius * Math.cos(polarAngle),
    radius * Math.sin(polarAngle) * Math.sin(azimuth),
  );
}
