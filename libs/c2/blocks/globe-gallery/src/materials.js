/* ShaderMaterial / MeshBasicMaterial factories for the globe cards + modal card.

   Kept separate from globe.js so the GLSL-bound material setup (uniforms, the
   property-proxy that lets the tick loop treat a ShaderMaterial like a
   MeshBasicMaterial, and the SDF modal material) reads as one self-contained
   unit. All functions are pure factories — they take the texture + plain
   numbers and return a THREE.Material, holding no per-instance state. */
import * as THREE from '../three.module.min.js';
import { CARD_VERT, CARD_FRAG, MODAL_VERT, MODAL_FRAG, TEXT_FRAG } from './shaders.js';

// Card material — a ShaderMaterial that handles the texture cover-crop, optional
// chromatic aberration, hover warp, and rounded corners (analytic SDF, same as the
// modal card). Rounded corners are driven by uAspect (the card's current world-space
// width/height, set per phase by the tick loop) + uRadius (22/631), replacing the old
// rasterized alphaMap. When the CA kill switch (CA_ENABLED) is off the caller just leaves
// the CA/warp/motion uniforms at 0, so the shader renders a plain rounded card with no
// aberration — no separate material path needed.
// Property proxies (opacity / map / needsUpdate) let the tick loop drive it through the
// same `mesh.material.opacity = …` API MeshBasicMaterial exposes; `needsUpdate` is a
// no-op (uniform writes don't require a shader relink).
export function createCardMaterial({
  texture, aspect, repeatX, repeatY, offsetX, offsetY,
}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uRepeat: { value: new THREE.Vector2(repeatX, repeatY) },
      uOffset: { value: new THREE.Vector2(offsetX, offsetY) },
      uMotionDir: { value: new THREE.Vector2(0, 0) },
      uWarp: { value: 0 },
      uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: aspect },
      uRadius: { value: 22.0 / 631.0 },
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

// Modal SDF material — used only for the flown-out modal card. Computes the
// rounded-rect boundary in the fragment shader (sharp at any zoom, unlike a
// rasterized alphaMap). `aspect` is the rendered card's world-space width/height
// (CARD_ASPECT × sphereScaleX); uRadius is a fraction of card height (22/631).
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

// "Click & Drag" hint-text material (TEXT_FRAG). Drives the warp/dissolve/exit entirely
// through its uniforms (the tick stage writes uOpacity/uWarp/uExitP/uCA/uMotionDir/uZoom
// directly — no opacity proxy needed). `aspect` is the canvas/camera aspect (x-axis warp
// correction); `resolution` is the device-pixel canvas size (edge fade). renderOrder is
// set by the caller so the plane draws behind the sphere cards.
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
      uMotionDir: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: CARD_VERT,
    fragmentShader: TEXT_FRAG,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
}
