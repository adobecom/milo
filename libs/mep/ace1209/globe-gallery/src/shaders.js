// Signed-distance rounded rect (the corner mask). `b` is the FULL half-extent, radius included.
const RR_SDF = [
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
];

// Hash for the particle dissolves; inputs scaled first to dodge precision loss at large coords.
const HASH21 = [
  'float hash21(vec2 p) {',
  '  p = fract(p * vec2(0.1031, 0.1030));',
  '  p += dot(p, p + 33.33);',
  '  return fract((p.x + p.y) * p.x);',
  '}',
];

// Modal SDF shader material — rounded rect computed in the fragment shader (sharp
// at any zoom). uAspect = card world-space width/height; uRadius = fraction of height.
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
  'uniform float uRadius;', // corner radius (fraction of card height); 0 = square (mobile full-bleed)
  'uniform float uOpacity;',
  'uniform vec2 uMotionDir;', // card velocity in UV space — drives motion-trail CA; (0,0) = off
  'uniform float uWarp;', // fisheye intensity (0 = none, ~0.4 = strong bulge); used in open/close/drag
  'uniform vec2 uWarpCenter;', // UV anchor for fisheye (0.5, 0.5 default; touch UV during drag)
  'uniform vec2 uRepeat;', // cover-crop carried from the barrel; eases to (1,1) over the fly-out
  'uniform vec2 uOffset;',
  'varying vec2 vUv;',
  ...RR_SDF,
  'void main() {',
  // Raw vUv so the card outline doesn't warp; half-extents are the FULL plane (as CARD_FRAG) —
  // an inset box would clip uRadius of photo off every edge. See README (Image fit).
  '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
  '  float d = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float alpha = 1.0 - smoothstep(-px, px, d);',
  // Flip uv.x + warp anchor on back faces so the back reads like the front (matches CARD_FRAG).
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  '  vec2 wc = gl_FrontFacing ? uWarpCenter : vec2(1.0 - uWarpCenter.x, uWarpCenter.y);',
  // Fisheye/barrel warp anchored at wc.
  '  vec2 d2 = fUv - wc;',
  '  float r2 = dot(d2, d2);',
  '  vec2 warpedUv = d2 / (1.0 + uWarp * r2 * 4.0) + wc;',
  // Cover-crop (identity once the card has settled at its native-aspect modal size).
  '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
  // Motion-trail CA: R trails behind, B ghosts ahead.
  '  float r = texture2D(map, baseUv - uMotionDir).r;',
  '  float g = texture2D(map, baseUv).g;',
  '  float b = texture2D(map, baseUv + uMotionDir * 0.5).b;',
  // Re-encode linear→sRGB.
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
  '}',
].join('\n');

// Card ShaderMaterial. uCA splits R/B outward; uRepeat/uOffset apply the cover-crop
// (ShaderMaterial doesn't auto-apply texture.repeat/offset); rounded corners via rrSDF.
export const CARD_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

// Near-camera dispersion. Read README (Near-camera dissolve EXPLODES past the card box)
// before touching any of it — the dials, ramp, overscan and grain-origin read are all coupled.
const DISPERSE_EXPAND = '2.00';
const DISPERSE_JITTER = '0.15';
const DISPERSE_RAMP = [
  'float dispRamp(float x) {',
  '  return pow(clamp(x, 0.0, 1.0), 0.9);',
  '}',
];

// Card vertex shader: CARD_VERT plus the dispersion overscan. See README.
export const CARD_DISPERSE_VERT = [
  'uniform float uDisperse;',
  'uniform float uAspect;',
  'varying vec2 vUv;',
  ...DISPERSE_RAMP,
  'void main() {',
  '  float e = dispRamp(uDisperse);',
  `  float s = 1.0 + e * ${DISPERSE_EXPAND};`,
  `  float j = 2.0 * ${DISPERSE_JITTER} * e * ${DISPERSE_EXPAND};`,
  '  vec2 grow = s + j / vec2(max(uAspect, 0.0001), 1.0);',
  '  vUv = (uv - 0.5) * grow + 0.5;',
  '  vec3 p = vec3(position.xy * grow, position.z);',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);',
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
  'uniform float uDissolve;', // near-camera dissolve (0 = solid, 1 = expanded + smeared + dispersed)
  'uniform float uDisperse;', // near-camera explosion (0 = grains stay put); see README
  'uniform float uReveal;', // texture-ready reveal: 0 = contour only, 1 = full photo
  'uniform float uContourFade;', // near-camera gate for the contour (mirrors proxFade)
  'varying vec2 vUv;',
  ...RR_SDF,
  ...HASH21,
  ...DISPERSE_RAMP,
  'void main() {',
  // Flip uv.x on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  // Grain cells in the card's own uv space (× uAspect so cells stay square) so the grain
  // travels with the card. Shared by the dispersion offset and the particle mask below.
  '  vec2 cell = floor(fUv * vec2(uAspect, 1.0) * 160.0);',
  '  float nR = hash21(cell + vec2(0.00,  0.00));',
  '  float nG = hash21(cell + vec2(2.10,  1.30));',
  '  float nB = hash21(cell + vec2(1.70, -0.50));',
  // Rounded-corner alpha: rrSDF in world-proportional UV; box half-size is the full
  // plane (uAspect/2, 0.5) so the rect fills edge-to-edge. fwidth gives ~1px AA.
  '  vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float shapeA = 1.0 - smoothstep(-px, px, dsd);', // solid box alpha, for the contour
  // Explosion: per-grain lift-off, each detached grain reading its origin. See README.
  '  float sg = 1.0;',
  '  vec2 sUv = fUv;',
  '  if (uDisperse > 0.0) {',
  '    float e = dispRamp(uDisperse);',
  '    float det = hash21(cell + vec2(13.10, 71.90));',
  '    if (det < e) {',
  '      float spd = hash21(cell + vec2(3.70, 47.10));',
  '      float t = (e - det) / max(1.0 - det, 1e-4);',
  `      sg = 1.0 + ${DISPERSE_EXPAND} * spd * t;`,
  '      vec2 jit = vec2(hash21(cell + vec2(31.70, 11.30)), hash21(cell + vec2(57.30, 91.10)));',
  `      vec2 wSrc = (pos - (jit * 2.0 - 1.0) * (${DISPERSE_JITTER} * (sg - 1.0))) / sg;`,
  '      sUv = wSrc / vec2(uAspect, 1.0) + 0.5;',
  '    }',
  '  }',
  // Photo alpha is masked at the grain's ORIGIN (pxs = the AA band back there). See README.
  '  float pxs = px / sg;',
  '  float srcSD = rrSDF((sUv - 0.5) * vec2(uAspect, 1.0), vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float a = 1.0 - smoothstep(-pxs, pxs, srcSD);',
  // Particle grain eaten edge-first (edgeProx from SDF dist).
  '  float dR = 1.0; float dG = 1.0; float dB = 1.0;',
  '  if (uDissolve > 0.0) {',
  '    float edgeProx = 1.0 - smoothstep(0.0, 0.28, -srcSD);',
  '    float localDis = clamp(uDissolve + edgeProx * uDissolve * 1.4, 0.0, 1.0);',
  '    float pedge = 0.10;',
  '    dR = smoothstep(localDis - pedge, localDis + pedge, nR);',
  '    dG = smoothstep(localDis - pedge, localDis + pedge, nG);',
  '    dB = smoothstep(localDis - pedge, localDis + pedge, nB);',
  '    a *= (dR + dG + dB) * 0.3333;',
  '  }',
  // Contour: faint fill + ~1px edge stroke (reuse dsd/px), shown before the photo un-dissolves in.
  '  float stroke = 1.0 - smoothstep(0.0, px * 1.5, abs(dsd));',
  '  float contourA = (shapeA * 0.06 + stroke * 0.5) * uContourFade;',
  // Crossfade contour → photo as reveal goes 0→1; the photo alpha `a` is already dispersing when
  // uDissolve > 0, so the reveal reads as the same edge-first un-dissolve.
  '  float outA = mix(contourA, a * uOpacity, uReveal);',
  // Bail before the texture fetches — load-bearing for the dispersion's fill cost. See README.
  '  if (outA < 0.002) discard;',
  // Fisheye magnify anchored at uHoverPos (cursor UV); (0.5,0.5) = centered.
  '  vec2 d  = sUv - uHoverPos;',
  '  float r2 = dot(d, d);',
  '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
  // Near-camera dissolve (melt + particle): content expands as the card rushes the lens.
  '  vec2 mdir = sUv - 0.5;',
  '  vec2 meltUv = warpedUv;',
  '  if (uDissolve > 0.0) {',
  '    meltUv = (warpedUv - 0.5) / (1.0 + uDissolve * 1.8) + 0.5;',
  '  }',
  '  vec2 baseUv = meltUv * uRepeat + uOffset;',
  // Radial CA + motion trail: R trails behind, B ghosts ahead; smear scales with dissolve.
  '  vec2 meltRad = mdir * uDissolve * 0.22;',
  '  vec2 radial = mdir * uCA + meltRad;',
  '  float r = texture2D(uMap, baseUv + radial - uMotionDir).r * dR;',
  '  float g = texture2D(uMap, baseUv).g * dG;',
  '  float b = texture2D(uMap, baseUv - radial + uMotionDir * 0.5).b * dB;',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  vec3 outCol = mix(vec3(1.0), srgb, uReveal);',
  '  gl_FragColor = vec4(outCol, outA);',
  '}',
].join('\n');

// "Click & Drag" hint text — a CARD_FRAG variant over a text canvas (no corner SDF),
// with warp + particle dissolve. uExitP (0→1) drives the one-way exit on first drag.
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
  ...HASH21,
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
  // Edge-proximity: sample alpha at 4 offsets so dissolve fires at glyph edges first.
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
