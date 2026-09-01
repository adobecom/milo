import * as THREE from '../three.module.min.js';
import {
  CARD_VERT, CARD_DISPERSE_VERT, CARD_FRAG, MODAL_VERT, MODAL_FRAG, TEXT_FRAG,
} from './shaders.js';

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
      uDissolve: { value: 0 }, // near-camera proximity dissolve (0 = solid, 1 = fully dispersed)
      uDisperse: { value: 0 }, // near-camera explosion (near-camera only; 0 in other phases)
      uReveal: { value: 0 }, // texture-ready reveal (0 = contour only, 1 = full photo)
      uContourFade: { value: 1 }, // near-camera gate for the contour (mirrors proxFade)
    },
    vertexShader: CARD_DISPERSE_VERT,
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

// Loaded via plain Image (no crossOrigin) so file:// works; a tainted canvas falls back solid.
function imageToCanvas(img, cap, fit = fitDims) {
  const { w, h } = fit(img.naturalWidth || 512, img.naturalHeight || 512, cap);
  const cv = makeCanvas(w, h, '#555');
  const ctx = cv.getContext('2d');
  try {
    ctx.drawImage(img, 0, 0, w, h);
    ctx.getImageData(0, 0, 1, 1); // throws (SecurityError) if the canvas is cross-origin tainted
  } catch (e) {
    window.lana?.log?.(`globe-gallery: card image could not be rasterized, rendering fallback: ${img.src} — ${e?.message || e}`, { tags: 'globe-gallery', severity: 'warn' });
    return makeCanvas(w, h, '#444');
  }
  return cv;
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

// onEach fires per settled image, onDone once all `count` settle. These deliberately do NOT
// releaseCanvasAfterUpload — two renderers upload them.
export function loadCardTextures({ count, getSrc, maxTexH }, onEach, onDone) {
  let loaded = 0;
  const textures = new Array(count);
  const aspects = new Array(count);

  function done(i, tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
    const aspect = texAspect(tex);
    textures[i] = tex;
    aspects[i] = aspect;
    if (onEach) onEach(i, tex, aspect);
    loaded += 1;
    if (loaded === count && onDone) onDone(textures, aspects);
  }

  function tryLoad(i) {
    const img = new Image();
    img.onload = () => {
      const rasterize = () => done(
        i,
        new THREE.CanvasTexture(imageToCanvas(img, maxTexH, fitCardDims)),
      );
      if (img.decode) img.decode().then(rasterize, rasterize);
      else rasterize();
    };
    img.onerror = () => {
      window.lana?.log?.(`globe-gallery: card image failed to load, rendering fallback: ${getSrc(i)}`, { tags: 'globe-gallery', severity: 'warn' });
      done(i, new THREE.CanvasTexture(makeCanvas(4, 6, '#555')));
    };
    img.src = getSrc(i); // no crossOrigin — needed so img.onload fires for file://
  }

  for (let i = 0; i < count; i += 1) tryLoad(i);
}

// Returns the Image so a pending load can be cancelled; caller owns disposal.
export function loadModalTexture(src, maxTex, onReady, onError) {
  const img = new Image();
  img.onload = () => {
    const tex = new THREE.CanvasTexture(imageToCanvas(img, maxTex));
    tex.colorSpace = THREE.SRGBColorSpace;
    onReady(tex);
  };
  img.onerror = () => {
    window.lana?.log?.(`globe-gallery: modal texture upgrade failed: ${src}`, { tags: 'globe-gallery', severity: 'warn' });
    if (onError) onError();
  };
  img.src = src; // no crossOrigin — needed so onload fires for file://
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
