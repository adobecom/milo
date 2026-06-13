/* Texture + rounded-corner alpha-mask creation for the globe cards.

   Three.js alphaMap uses the green channel as the alpha multiplier: white =
   opaque, black = transparent. The masks here paint a white rounded rect on
   black so the card planes render with rounded corners.

   `renderer` is injected (not imported) so this module stays a pure factory: it
   reads `renderer.capabilities` for max anisotropy when available and otherwise
   skips it. Nothing here holds per-globe state except the sphere-mask cache,
   which is created per call to createSphereMaskCache(). */
import * as THREE from '../three.module.min.js';

const ARC_CORNER_RATIO = 22 / 456; // 22px corner on the 456px-wide portrait source
const SPHERE_CORNER_RATIO = 22 / 631; // 22px corner relative to the 631px-tall source

function paintRoundedRect(ctx, w, h, r) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.arcTo(w, 0, w, r, r);
  ctx.lineTo(w, h - r);
  ctx.arcTo(w, h, w - r, h, r);
  ctx.lineTo(r, h);
  ctx.arcTo(0, h, 0, h - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();
}

function canvasToMaskTexture(canvas, renderer) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
  return tex;
}

// High-resolution portrait mask shared by all cards in the arc/grid phases.
export function createRoundedMask(renderer) {
  const cw = 1024;
  const ch = Math.round(1024 * (631 / 456)); // 1416
  const r = Math.round(cw * ARC_CORNER_RATIO); // 49px
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  paintRoundedRect(c.getContext('2d'), cw, ch, r);
  return canvasToMaskTexture(c, renderer);
}

// Per-aspect mask for the sphere phase: the canvas W:H matches the card's
// world-space shape after its non-uniform scale, so the corner arcs stay
// physically circular rather than getting stretched into ellipses.
export function createRoundedMaskForAspect(aspect, renderer) {
  const canvasH = 512;
  const canvasW = Math.max(1, Math.round(canvasH * aspect));
  const r = Math.round(canvasH * SPHERE_CORNER_RATIO);
  const c = document.createElement('canvas');
  c.width = canvasW; c.height = canvasH;
  paintRoundedRect(c.getContext('2d'), canvasW, canvasH, r);
  return canvasToMaskTexture(c, renderer);
}

// Cache of sphere masks keyed by rounded aspect (so e.g. 0.72 and 1.78 get
// distinct entries) — avoids rebuilding a mask canvas per card.
export function createSphereMaskCache(renderer) {
  const cache = {};
  return {
    get(aspect) {
      const key = Math.round(aspect * 100);
      if (!cache[key]) cache[key] = createRoundedMaskForAspect(aspect, renderer);
      return cache[key];
    },
  };
}

// Load every card image into a CanvasTexture, applying a cover-fit crop so the
// source's native aspect isn't stretched onto the fixed card plane.
//
// file:// security notes:
//   • TextureLoader sets crossOrigin='anonymous' → CORS mode → Chrome rejects
//     file:// origins. So we load via a plain Image (no crossOrigin) and draw
//     onto a 2D canvas, then wrap with CanvasTexture (allowed for same-origin).
//   • If the canvas comes back tainted, fall back to an untainted placeholder
//     so gl.texImage2D won't throw and crash the render loop.
//
// onDone(textures, cardTexData) fires once all `count` textures have settled.
// cardTexData[i] carries the cover-crop UVs + sphereScaleX the build step needs.
export function loadCardTextures({ count, getSrc, planeAspect }, onDone) {
  let loaded = 0;
  const textures = new Array(count);
  const cardTexData = [];

  function makeCanvas(w, h, color) {
    const cv = document.createElement('canvas');
    cv.width = w || 4; cv.height = h || 6;
    const ctx2 = cv.getContext('2d');
    ctx2.fillStyle = color || '#555';
    ctx2.fillRect(0, 0, cv.width, cv.height);
    return cv;
  }

  function done(i, tex) {
    tex.colorSpace = THREE.SRGBColorSpace;
    // Cover-fit: crop the texture so its native aspect isn't stretched to the plane.
    const imgW = (tex.image && tex.image.width) || 1;
    const imgH = (tex.image && tex.image.height) || 1;
    const imgAspect = imgW / imgH;
    if (imgAspect > planeAspect) {
      // Image wider than plane → crop left/right, keep center
      tex.repeat.x = planeAspect / imgAspect;
      tex.offset.x = (1 - tex.repeat.x) / 2;
    } else if (imgAspect < planeAspect) {
      // Image taller than plane → crop top/bottom, keep center
      tex.repeat.y = imgAspect / planeAspect;
      tex.offset.y = (1 - tex.repeat.y) / 2;
    }
    // sphereScaleX: how much to stretch card width so it shows native ratio on the sphere.
    // arcRepeat/Offset: the cover-crop UV values above (lerp start for the fold morph).
    cardTexData[i] = {
      sphereScaleX: imgAspect / planeAspect,
      arcRepeatX: tex.repeat.x,
      arcRepeatY: tex.repeat.y,
      arcOffsetX: tex.offset.x,
      arcOffsetY: tex.offset.y,
    };
    textures[i] = tex;
    loaded += 1;
    if (loaded === count) onDone(textures, cardTexData);
  }

  function tryLoad(i) {
    const img = new Image();
    img.onload = () => {
      const cw = img.naturalWidth || 512;
      const ch = img.naturalHeight || 512;
      const cv = makeCanvas(cw, ch, '#555');
      let usedCv = cv;
      try {
        cv.getContext('2d').drawImage(img, 0, 0);
        // Verify the canvas is not tainted (throws on file:// if cross-origin).
        cv.getContext('2d').getImageData(0, 0, 1, 1);
      } catch (e) {
        usedCv = makeCanvas(cw, ch, '#444');
      }
      done(i, new THREE.CanvasTexture(usedCv));
    };
    img.onerror = () => {
      done(i, new THREE.CanvasTexture(makeCanvas(4, 6, '#555')));
    };
    img.src = getSrc(i); // no crossOrigin — needed so img.onload fires for file://
  }

  for (let i = 0; i < count; i += 1) tryLoad(i);
}
