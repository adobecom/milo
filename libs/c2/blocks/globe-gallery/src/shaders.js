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
  'uniform float uDissolve;', // near-camera particle dissolve (0 = solid, 1 = fully dispersed)
  'varying vec2 vUv;',
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
  // Hash — scale inputs first to avoid sin() precision issues at large pixel coords.
  'float hash21(vec2 p) {',
  '  p = fract(p * vec2(0.1031, 0.1030));',
  '  p += dot(p, p + 33.33);',
  '  return fract((p.x + p.y) * p.x);',
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
  // ── Near-camera particle dissolve + warm-white burn rim (uDissolve 0→1) ──
  // Style-1 edge-first grain (border frays first via edgeProx) plus a clean monochrome
  // glow riding the dissolve front — no per-cell colour tint, so the card burns away with
  // a bright edge instead of the coloured pink/brown mosaic. The 3 channels dissolve on
  // near-shared seeds so the grain itself barely fringes.
  '  if (uDissolve > 0.0) {',
  '    float edgeProx = 1.0 - smoothstep(0.0, 0.28, -dsd);',
  // Chunkier 4px cells (was 2px) — fewer, larger particles read as calmer, less speckle.
  '    vec2 cell = floor(gl_FragCoord.xy * 0.25);',
  '    float n0 = hash21(cell);',
  '    float nR = n0;',
  '    float nG = hash21(cell + vec2(0.60, 0.30));',
  '    float nB = hash21(cell + vec2(0.30, 0.60));',
  '    float localDis = clamp(uDissolve + edgeProx * uDissolve * 1.3, 0.0, 1.0);',
  // Softer transition (was 0.08) so particles fade in/out gently instead of popping.
  '    float pedge = 0.13;',
  '    float dR = smoothstep(localDis - pedge, localDis + pedge, nR);',
  '    float dG = smoothstep(localDis - pedge, localDis + pedge, nG);',
  '    float dB = smoothstep(localDis - pedge, localDis + pedge, nB);',
  '    r *= dR; g *= dG; b *= dB;',
  '    a *= (dR + dG + dB) * 0.3333;',
  // Rim glow: a single warm-white tint (not a per-cell hue crossfade) rides the thin
  // burning front, so only the dissolving edge brightens. Added in linear space so the
  // sRGB encode tone-maps it; balanced RGB keeps it a clean glow rather than a muddy tint.
  '    float heat = clamp(1.0 - abs(n0 - localDis) / (pedge * 1.2), 0.0, 1.0);',
  '    heat *= smoothstep(0.0, 0.06, uDissolve);',
  '    vec3 ember = vec3(1.00, 0.94, 0.82) * heat * 0.55;',
  '    r += ember.r; g += ember.g; b += ember.b;',
  '    a = max(a, heat * 0.4);',
  '  }',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, a * uOpacity);',
  '}',
].join('\n');

// "Click & Drag" hint text. A simplified CARD_FRAG variant: samples a centered
// text canvas (alpha = glyph coverage, no rounded-corner SDF), with a barrel warp
// + per-pixel particle "dissolve" that scatters the glyphs edge-first. uExitP (0→1)
// drives the one-way exit on the user's first drag: horizontal stretch + radial
// scatter + amplified warp + full dissolve + opacity fade. uAspect scales the x-axis
// to world-proportional space so the warp falloff is isotropic on wide viewports
// (otherwise glyphs stretch horizontally). uUVScale = 1 (kept for symmetry/zoom).
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
  'uniform vec2  uMotionDir;',
  'varying vec2  vUv;',
  // Hash — scale inputs first to avoid sin() precision issues at large pixel coords
  'float hash21(vec2 p) {',
  '  p = fract(p * vec2(0.1031, 0.1030));',
  '  p += dot(p, p + 33.33);',
  '  return fract((p.x + p.y) * p.x);',
  '}',
  'void main() {',
  '  vec2 d = vUv - 0.5;',
  // Exit: horizontal stretch (mimics drag direction) + radial scatter (letters fly outward)
  '  d.x *= 1.0 + uExitP * 1.6;',
  '  d    += d * uExitP * 0.7;',
  '  vec2 dA = vec2(d.x * uAspect, d.y);', // scale x to world-proportional space
  '  float r2 = dot(dA, dA);', // isotropic radius in world space
  // Exit amplifies the barrel warp on top of the normal warp
  '  float exitWarp = uWarp + uExitP * 3.0;',
  '  vec2 warpedVUv = d / (1.0 + exitWarp * r2 * 4.0) + 0.5;',
  '  vec2 finalUv = (warpedVUv - 0.5) / uUVScale + 0.5;',
  '  vec2 radial = (vUv - 0.5) * uCA;',
  '  float r = texture2D(uMap, finalUv + radial - uMotionDir).r;',
  '  float g = texture2D(uMap, finalUv).g;',
  '  float b = texture2D(uMap, finalUv - radial + uMotionDir * 0.5).b;',
  '  float a = texture2D(uMap, finalUv).a;',
  // Edge-proximity map: sample alpha at a wide offset in 4 dirs. Deep interior → all
  // 4 hits opaque → no boost; near a glyph edge → some hits transparent → edgeProx
  // rises, so dissolution fires at character edges first and eats inward.
  '  float _bl  = 0.020;',
  '  float _a4  = texture2D(uMap, finalUv + vec2( _bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(-_bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0,  _bl)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0, -_bl)).a;',
  '  float edgeProx = 1.0 - _a4 * 0.25;', // 0=deep interior, 1=at/near edge
  // Particle dissolve: 2px screen-space grain, per-channel seeds → RGB split
  '  vec2  cell    = floor(gl_FragCoord.xy * 0.5);',
  '  float nR      = hash21(cell + vec2(0.00,  0.00));',
  '  float nG      = hash21(cell + vec2(2.10,  1.30));',
  '  float nB      = hash21(cell + vec2(1.70, -0.50));',
  // Exit progress drives dissolve toward 0.97 (full scatter) on top of warp/zoom dissolve
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
  '  float exitFade = 1.0 - smoothstep(0.0, 0.85, uExitP);',
  '  gl_FragColor = vec4(srgb, a * uOpacity * fadeX * fadeY * exitFade);',
  '}',
].join('\n');
