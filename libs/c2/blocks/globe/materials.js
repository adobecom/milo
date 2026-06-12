/* ShaderMaterial / MeshBasicMaterial factories for the globe cards + modal card.

   Kept separate from globe.js so the GLSL-bound material setup (uniforms, the
   property-proxy that lets the tick loop treat a ShaderMaterial like a
   MeshBasicMaterial, and the SDF modal material) reads as one self-contained
   unit. All functions are pure factories — they take the texture + plain
   numbers and return a THREE.Material, holding no per-instance state. */
import * as THREE from './three.module.min.js';
import { CARD_VERT, CARD_FRAG, MODAL_VERT, MODAL_FRAG } from './shaders.js';

// Card material — chromatic-aberration ShaderMaterial when CA is on, else a
// plain MeshBasicMaterial. The ShaderMaterial gets property proxies (opacity /
// alphaMap / map / needsUpdate) so the tick loop can drive it through the same
// `mesh.material.opacity = …` API a MeshBasicMaterial exposes, without caring
// which one it got. `needsUpdate` is suppressed — uniform texture swaps don't
// require a shader relink.
export function createCardMaterial({
  texture, alphaMap, repeatX, repeatY, offsetX, offsetY, caEnabled,
}) {
  if (!caEnabled) {
    return new THREE.MeshBasicMaterial({
      map: texture,
      alphaMap,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      alphaTest: 0.0,
      depthTest: true,
      depthWrite: false,
    });
  }
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uAlphaMap: { value: alphaMap },
      uOpacity: { value: 0 },
      uCA: { value: 0 },
      uRepeat: { value: new THREE.Vector2(repeatX, repeatY) },
      uOffset: { value: new THREE.Vector2(offsetX, offsetY) },
      uMotionDir: { value: new THREE.Vector2(0, 0) },
      uWarp: { value: 0 },
      uHoverPos: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader: CARD_VERT,
    fragmentShader: CARD_FRAG,
    side: THREE.DoubleSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });
  Object.defineProperty(mat, 'opacity', { get() { return mat.uniforms.uOpacity.value; }, set(v) { mat.uniforms.uOpacity.value = v; } });
  Object.defineProperty(mat, 'alphaMap', { get() { return mat.uniforms.uAlphaMap.value; }, set(v) { mat.uniforms.uAlphaMap.value = v; } });
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
