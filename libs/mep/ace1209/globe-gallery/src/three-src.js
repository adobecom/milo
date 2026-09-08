/* eslint-disable import/no-extraneous-dependencies */
// Re-exports the Three.js symbols globe.js uses; esbuild tree-shakes the rest.
export {
  CanvasTexture,
  DoubleSide,
  Euler,
  Group,
  Matrix4,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Raycaster,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
