/* Card image loading for the globe.

   Rounded corners are no longer rasterized here — the card shader computes them
   analytically (see CARD_FRAG / rrSDF in shaders.js), so this module is just the
   image loader. It holds no per-globe state. */
import * as THREE from '../three.module.min.js';

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
export default function loadCardTextures({ count, getSrc, planeAspect }, onDone) {
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
