import * as THREE from '../../../../deps/three.js';
import { CARD_DISPERSE_VERT, CARD_FRAG, MODAL_VERT, MODAL_FRAG } from './shaders.js';

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

async function imageToTexture(img, cap, fit = fitDims) {
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
    window.lana?.log?.(`firefly-globe: card image could not be rasterized, rendering fallback: ${img.src} — ${e?.message || e}`, { tags: 'firefly-globe', severity: 'warn' });
    return makeSolidTexture(w, h, '#444');
  }
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

export function loadCardTextures({ count, getSrc, maxTexH, getCrossOrigin }, onEach, onDone) {
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
      imageToTexture(img, maxTexH, fitCardDims).then((tex) => done(i, tex));
    };
    img.onerror = () => {
      window.lana?.log?.(`firefly-globe: card image failed to load, rendering fallback: ${getSrc(i)}`, { tags: 'firefly-globe', severity: 'warn' });
      done(i, makeSolidTexture(4, 6, '#555'));
    };
    img.src = getSrc(i);
  }

  for (let i = 0; i < count; i += 1) tryLoad(i);
}

// Returns the Image so a pending load can be cancelled; caller owns disposal.
export function loadModalTexture(src, maxTex, onReady, onError, crossOrigin) {
  const img = new Image();
  if (crossOrigin) img.crossOrigin = crossOrigin;
  img.onload = () => {
    imageToTexture(img, maxTex).then(onReady);
  };
  img.onerror = () => {
    window.lana?.log?.(`firefly-globe: modal texture upgrade failed: ${src}`, { tags: 'firefly-globe', severity: 'warn' });
    if (onError) onError();
  };
  img.src = src;
  return img;
}
