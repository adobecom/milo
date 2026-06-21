/* GLSL source strings for the card + modal ShaderMaterials. */

// ── Modal SDF shader material ─────────────────────────────────────────────
// Used only for the modal-active card. A rasterized alphaMap will always pixelate
// at modal scale (card ~75vh, textures at 512–1024px). The SDF computes the rounded
// rect boundary in the fragment shader at native screen resolution with 1-pixel AA
// via fwidth — perfectly sharp at any zoom level.
//
// uAspect = world-space width/height of the rendered card (CARD_ASPECT × sphereScaleX).
// The SDF coordinate space maps UV (0,1)×(0,1) → pos in [-A/2,A/2]×[-0.5,0.5] so
// corner radius uRadius is expressed as a fraction of card height (22/631 ≈ 0.0349).

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
  'uniform float uRadius;',
  'uniform float uOpacity;',
  'uniform vec2 uMotionDir;', // card velocity in UV space — drives motion-trail CA; (0,0) = off
  'uniform float uWarp;', // fisheye intensity (0 = none, ~0.4 = strong bulge); used in open/close/drag
  'uniform vec2 uWarpCenter;', // UV anchor for fisheye (0.5, 0.5 default; touch UV during drag)
  'varying vec2 vUv;',
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
  'void main() {',
  // SDF rounded-rect clip uses raw vUv so the card's geometry outline doesn't warp.
  '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
  '  float d = rrSDF(pos, vec2(uAspect * 0.5 - uRadius, 0.5 - uRadius), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float alpha = 1.0 - smoothstep(-px, px, d);',
  // Fisheye/barrel warp anchored at uWarpCenter — same formula as the globe-card
  // hover shader. Image content bulges outward around the anchor point.
  '  vec2 d2 = vUv - uWarpCenter;',
  '  float r2 = dot(d2, d2);',
  '  vec2 warpedUv = d2 / (1.0 + uWarp * r2 * 4.0) + uWarpCenter;',
  // Motion-trail CA: R trails behind card motion, B ghosts ahead. Sampled on warpedUv.
  '  float r = texture2D(map, warpedUv - uMotionDir).r;',
  '  float g = texture2D(map, warpedUv).g;',
  '  float b = texture2D(map, warpedUv + uMotionDir * 0.5).b;',
  // Re-encode linear→sRGB (Three.js uploads SRGBColorSpace textures decoded to linear)
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
  '}',
].join('\n');

// ── Card ShaderMaterial — chromatic aberration (Option B) ─────────────────
// uCA = 0 → normal render; uCA > 0 → R/B channels split outward from card center.
// uRepeat/uOffset replicate the texture cover-crop the texture matrix would track
// (a ShaderMaterial doesn't apply texture.repeat/offset automatically).
// Rounded corners use the same analytic SDF the modal card uses (rrSDF below):
// uRadius is a fraction of card height (22/631) and uAspect is the card's current
// world-space width/height, set per phase so corners stay circular as the card
// stretches from portrait (arc/grid) to its image aspect (sphere). This replaces
// the old rasterized alphaMap + per-aspect mask cache — sharp at any size, no
// texture uploads, and the fold morph can lerp uAspect with no mask-swap pop.
// sRGB re-encode: Three.js uploads SRGBColorSpace textures decoded to linear;
// custom ShaderMaterial must re-encode linear→sRGB to match MeshBasicMaterial output.
export const CARD_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

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
  'varying vec2 vUv;',
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
  'void main() {',
  // When the camera is inside the globe, the far-hemisphere cards are seen from
  // behind. A DoubleSide plane viewed from its back shows the image mirrored
  // horizontally. Flip uv.x on back-facing fragments so the back reads identically
  // to the front (gl_FrontFacing is true for the outward-facing side).
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  // Fisheye magnify anchored at uHoverPos (cursor position in UV space).
  // Dividing the offset-from-cursor by (1 + uWarp * r² * 4) samples from closer
  // to the cursor as r grows, so image content visually expands AROUND the cursor —
  // the classic "lens loupe" look. uHoverPos = (0.5, 0.5) → centered fisheye.
  '  vec2 d  = fUv - uHoverPos;',
  '  float r2 = dot(d, d);',
  '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
  '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
  // Rounded-corner alpha: SDF of the card outline in raw geometry UV (the rect is
  // symmetric, so the back-face uv.x flip doesn't affect it). pos maps UV to a space
  // uAspect units wide × 1 tall, matching world proportions, so the corner radius is
  // isotropic in world space. fwidth gives ~1px edge antialiasing at any zoom.
  // The box half-size is the FULL plane half-size (uAspect/2, 0.5) so the rect fills
  // the card plane edge-to-edge, matching the old mask. (The modal insets the box by
  // uRadius and rescales its plane to compensate — the globe card has no such rescale,
  // so insetting here would shrink every card by uRadius on each side.)
  '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float a = 1.0 - smoothstep(-px, px, dsd);',
  // Radial CA (transition peaks) + directional motion trail (velocity-driven)
  // R: trails behind — displaced opposite to motion + radial spread outward
  // G: current position, no displacement
  // B: ghost slightly ahead — displaced in motion direction + radial spread inward
  '  vec2 radial = (fUv - 0.5) * uCA;',
  '  float r = texture2D(uMap, baseUv + radial - uMotionDir).r;',
  '  float g = texture2D(uMap, baseUv).g;',
  '  float b = texture2D(uMap, baseUv - radial + uMotionDir * 0.5).b;',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, a * uOpacity);',
  '}',
].join('\n');
