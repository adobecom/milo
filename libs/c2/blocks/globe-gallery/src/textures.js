/* Card image loading for the globe.

   Rounded corners are no longer rasterized here — the card shader computes them
   analytically (see CARD_FRAG / rrSDF in shaders.js), so this module is just the
   image loader. It holds no per-globe state. */
import * as THREE from '../three.module.min.js';

// Longest-side clamp (px) that preserves aspect (so a cover-crop's UVs stay correct).
// `maxTex` caps the GPU-resident texture: card planes are small on screen, so full native
// resolution (often 1500–2000px) is pure GPU-memory waste — iOS uploads each texture as
// uncompressed RGBA + mipmaps, and ~45 md cards at native size overruns the per-tab memory
// cap → Safari kills the tab ("A problem repeatedly occurred") during the arc settle. The
// per-device caps live in globe-gallery.js (CARD_TEX_* base set + MODAL_TEX_* opened card).
function fitDims(w, h, maxTex) {
  const longest = Math.max(w, h);
  if (longest <= maxTex) return { w, h };
  const s = maxTex / longest;
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

// Solid-color canvas — placeholder + untainted fallback (see imageToCanvas).
function makeCanvas(w, h, color) {
  const cv = document.createElement('canvas');
  cv.width = w || 4; cv.height = h || 6;
  const ctx2 = cv.getContext('2d');
  ctx2.fillStyle = color || '#555';
  ctx2.fillRect(0, 0, cv.width, cv.height);
  return cv;
}

// Draw an image into an aspect-preserving canvas clamped to `maxTex` (longest side).
//
// file:// security notes:
//   • TextureLoader sets crossOrigin='anonymous' → CORS mode → Chrome rejects
//     file:// origins. So we load via a plain Image (no crossOrigin) and draw
//     onto a 2D canvas, then wrap with CanvasTexture (allowed for same-origin).
//   • If the canvas comes back tainted, fall back to an untainted solid canvas
//     so gl.texImage2D won't throw and crash the render loop.
function imageToCanvas(img, maxTex) {
  const { w, h } = fitDims(img.naturalWidth || 512, img.naturalHeight || 512, maxTex);
  const cv = makeCanvas(w, h, '#555');
  try {
    cv.getContext('2d').drawImage(img, 0, 0, w, h);
    cv.getContext('2d').getImageData(0, 0, 1, 1); // throws if tainted
  } catch (e) {
    return makeCanvas(w, h, '#444');
  }
  return cv;
}

// Load every card image into a CanvasTexture, applying a cover-fit crop so the source's
// native aspect isn't stretched onto the fixed card plane. `maxTex` caps each texture's
// resolution (see fitDims).
//
// onDone(textures, cardTexData) fires once all `count` textures have settled.
// cardTexData[i] carries the cover-crop UVs + sphereScaleX the build step needs.
export function loadCardTextures({ count, getSrc, planeAspect, maxTex }, onDone) {
  let loaded = 0;
  const textures = new Array(count);
  const cardTexData = [];

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
    img.onload = () => { done(i, new THREE.CanvasTexture(imageToCanvas(img, maxTex))); };
    img.onerror = () => {
      done(i, new THREE.CanvasTexture(makeCanvas(4, 6, '#555')));
    };
    img.src = getSrc(i); // no crossOrigin — needed so img.onload fires for file://
  }

  for (let i = 0; i < count; i += 1) tryLoad(i);
}

// Lazily load one card image at a higher cap for the modal (the flown-out card is the only
// place a card is shown larger than its small base texture). The MODAL shader samples the
// full image with raw UV — the modal plane is sized to the image's native aspect, so there's
// no cover-crop and no repeat/offset to apply here (unlike loadCardTextures). `maxTex` caps
// it (see MODAL_TEX_* in globe-gallery.js). onReady(tex) fires once decoded; the caller owns
// disposal (on modal close). On error nothing fires — the modal keeps its base-texture
// placeholder. Returns the Image so the caller can cancel a pending load (img.src = '').
export function loadModalTexture(src, maxTex, onReady) {
  const img = new Image();
  img.onload = () => {
    const tex = new THREE.CanvasTexture(imageToCanvas(img, maxTex));
    tex.colorSpace = THREE.SRGBColorSpace;
    onReady(tex);
  };
  img.src = src; // no crossOrigin — needed so onload fires for file://
  return img;
}

// Offscreen-canvas resolution for the "Click & Drag" hint text (≈25% height = the
// type fills ~75% of it). The plane geometry is sized separately in world units.
// 2048 (was 4096): a 4096-wide canvas is a ~38MB texture + mipmaps for one line of type —
// needless on iOS's tight GPU budget. 2048 stays sharp at the hint's on-screen size.
const TEXT_CANVAS_W = 2048;

// Fraction of canvas width the text fills at rest (the warp-overflow scale then pushes
// letterforms off-screen during entrance/drag). The font auto-scales to hit this for ANY
// string, so the copy can change/localize without re-tuning per word.
const HINT_FILL = 0.8;

// Render the hint copy to a CanvasTexture, centered, white-on-transparent. `aspect` is the
// canvas (= camera) aspect so texture pixels stay square on the plane. The font size is
// derived by measuring HINT_TEXT and scaling it to span HINT_FILL of the width (capped so a
// short string can't overflow the height) — language-agnostic, unlike a fixed per-word
// layout. No per-instance state; the caller owns disposal.
export function createClickDragTexture(aspect, hintText = 'Click & Drag') {
  const canvas = document.createElement('canvas');
  const ctxH = Math.round(TEXT_CANVAS_W / aspect);
  canvas.width = TEXT_CANVAS_W;
  canvas.height = ctxH;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, TEXT_CANVAS_W, ctxH);
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  // Adobe Clean Display covers Latin; CJK / other scripts fall back to a system font.
  const setFont = (px) => {
    ctx.font = `900 ${px}px 'Adobe Clean Display', sans-serif`;
    // Negative letter spacing (−0.04em) matches the Figma tracking; scales with the font.
    if (typeof ctx.letterSpacing !== 'undefined') {
      ctx.letterSpacing = `-${Math.round(px * 0.04)}px`;
    }
  };

  // Measure at a reference size, then scale to fill HINT_FILL of the width. Cap to a
  // height budget so a very short string (e.g. one glyph) can't scale up and clip top/bottom.
  const refSize = Math.round((TEXT_CANVAS_W * 250) / 1440); // Figma: 250px @ 1440 viewport
  setFont(refSize);
  const measured = Math.max(1, ctx.measureText(hintText).width);
  const maxSize = Math.round(ctxH * 0.55); // keeps glyphs within the ~75% height budget
  const fitSize = Math.round(refSize * ((TEXT_CANVAS_W * HINT_FILL) / measured));
  const fontSize = Math.min(maxSize, fitSize);
  setFont(fontSize);

  ctx.fillText(hintText, TEXT_CANVAS_W / 2, ctxH * 0.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
