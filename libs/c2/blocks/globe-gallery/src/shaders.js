// Signed-distance rounded rect (the corner mask). `b` is the FULL half-extent, radius included.
const RR_SDF = [
  'float rrSDF(vec2 p, vec2 b, float r) {',
  '  vec2 q = abs(p) - b + r;',
  '  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;',
  '}',
];

// Inputs scaled first to dodge precision loss at large coords.
const HASH21 = [
  'float hash21(vec2 p) {',
  '  p = fract(p * vec2(0.1031, 0.1030));',
  '  p += dot(p, p + 33.33);',
  '  return fract((p.x + p.y) * p.x);',
  '}',
];

// Rounded rect computed in the fragment shader, so it stays sharp at any zoom.
// uAspect = card world-space width/height; uRadius = fraction of height.
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
  // Raw vUv so the card outline doesn't warp; half-extents are the FULL plane, since an inset
  // box would clip uRadius of photo off every edge.
  '  vec2 pos = (vUv - 0.5) * vec2(uAspect, 1.0);',
  '  float d = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float alpha = 1.0 - smoothstep(-px, px, d);',
  // Flip uv.x + warp anchor on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  '  vec2 wc = gl_FrontFacing ? uWarpCenter : vec2(1.0 - uWarpCenter.x, uWarpCenter.y);',
  '  vec2 d2 = fUv - wc;',
  '  float r2 = dot(d2, d2);',
  '  vec2 warpedUv = d2 / (1.0 + uWarp * r2 * 4.0) + wc;',
  '  vec2 baseUv = warpedUv * uRepeat + uOffset;',
  // R trails behind, B ghosts ahead.
  '  float r = texture2D(map, baseUv - uMotionDir).r;',
  '  float g = texture2D(map, baseUv).g;',
  '  float b = texture2D(map, baseUv + uMotionDir * 0.5).b;',
  '  vec3 srgb = pow(max(vec3(r, g, b), 0.0), vec3(1.0 / 2.2));',
  '  gl_FragColor = vec4(srgb, alpha * uOpacity);',
  '}',
].join('\n');

// uRepeat/uOffset apply the cover-crop by hand — ShaderMaterial does not auto-apply
// texture.repeat/offset.
export const CARD_VERT = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n');

// Card dissolve + near-camera dispersion dials.
const GRAIN_CELLS = 160;
const DISPERSE_EXPAND = 2.5;
const DISPERSE_JITTER = 0.2;
const DISPERSE_CHUNKS = 44;
const DISPERSE_ERODE = 0.22;
const DISPERSE_EDGE_LEAD = 1.4;
const DISPERSE_MARGIN = 2 * DISPERSE_JITTER * DISPERSE_EXPAND; // derived so the stages can't drift
const glf = (n) => n.toFixed(3); // GLSL float literal (a bare `2` is an int there)

// CARD_VERT plus the dispersion overscan.
export const CARD_DISPERSE_VERT = [
  'uniform float uDisperse;',
  'uniform float uAspect;',
  'varying vec2 vUv;',
  'void main() {',
  `  float s = 1.0 + uDisperse * ${glf(DISPERSE_EXPAND)};`,
  `  float j = uDisperse * ${glf(DISPERSE_MARGIN)};`,
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
  'void main() {',
  // Flip uv.x on back faces so the back reads like the front.
  '  vec2 fUv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);',
  // Box half-size is the FULL plane (uAspect/2, 0.5) so the rect fills edge-to-edge.
  // fwidth gives ~1px AA.
  '  vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float shapeA = 1.0 - smoothstep(-px, px, dsd);', // solid box alpha, for the contour
  // Uniform-gated, so other phases pay nothing.
  '  vec2 sUv = fUv;',
  '  float srcSD = dsd;',
  '  float a = shapeA;',
  '  if (uDisperse > 0.0) {',
  `    vec2 chunk = floor(fUv * vec2(uAspect, 1.0) * ${glf(DISPERSE_CHUNKS)});`,
  '    float h1 = hash21(chunk + vec2(13.10, 71.90));',
  '    float h2 = hash21(chunk + vec2(3.70, 47.10));',
  '    float rim = 1.0 - smoothstep(0.0, 0.35, -dsd);',
  `    float det = h1 / (1.0 + rim * ${glf(DISPERSE_EDGE_LEAD)});`,
  `    float erode = ${glf(DISPERSE_ERODE)} * uDisperse * fract(h1 * 43.7);`,
  '    float sg = 1.0;',
  '    if (det < uDisperse) {',
  '      float spd = 0.25 + 0.75 * h2;',
  '      float t = (uDisperse - det) / max(1.0 - det, 1e-4);',
  `      sg = 1.0 + ${glf(DISPERSE_EXPAND)} * spd * t;`,
  '      vec2 jit = fract(vec2(h1, h2) * vec2(97.13, 61.70)) * 2.0 - 1.0;',
  `      vec2 wSrc = (pos - jit * (${glf(DISPERSE_JITTER)} * (sg - 1.0))) / sg;`,
  '      sUv = wSrc / vec2(uAspect, 1.0) + 0.5;',
  '    }',
  '    float pxs = px / sg;',
  '    srcSD = rrSDF((sUv - 0.5) * vec2(uAspect, 1.0), vec2(uAspect * 0.5, 0.5), uRadius) + erode;',
  '    a = 1.0 - smoothstep(-pxs, pxs, srcSD);',
  '  }',
  // Particle grain, eaten edge-first.
  '  float dR = 1.0; float dG = 1.0; float dB = 1.0;',
  '  if (uDissolve > 0.0) {',
  `    vec2 cell = floor(fUv * vec2(uAspect, 1.0) * ${glf(GRAIN_CELLS)});`,
  '    float nR = hash21(cell + vec2(0.00,  0.00));',
  '    float nG = hash21(cell + vec2(2.10,  1.30));',
  '    float nB = hash21(cell + vec2(1.70, -0.50));',
  '    float edgeProx = 1.0 - smoothstep(0.0, 0.28, -srcSD);',
  '    float localDis = clamp(uDissolve + edgeProx * uDissolve * 1.4, 0.0, 1.0);',
  '    float pedge = 0.10;',
  '    dR = smoothstep(localDis - pedge, localDis + pedge, nR);',
  '    dG = smoothstep(localDis - pedge, localDis + pedge, nG);',
  '    dB = smoothstep(localDis - pedge, localDis + pedge, nB);',
  '    a *= (dR + dG + dB) * 0.3333;',
  '  }',
  // Faint fill + ~1px edge stroke, shown before the photo un-dissolves in.
  '  float stroke = 1.0 - smoothstep(0.0, px * 1.5, abs(dsd));',
  '  float contourA = (shapeA * 0.06 + stroke * 0.5) * uContourFade;',
  // The photo alpha is already dispersing when uDissolve > 0, so the reveal reads as the same
  // edge-first un-dissolve.
  '  float outA = mix(contourA, a * uOpacity, uReveal);',
  // Bail BEFORE the texture fetches — load-bearing for the dispersion's fill cost.
  '  if (outA < 0.002) discard;',
  '  vec2 d  = sUv - uHoverPos;',
  '  float r2 = dot(d, d);',
  '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
  // Net of uDisperse, so the explosion owns the motion in the sphere phase and this is left to
  // the texture-ready reveal.
  '  vec2 mdir = sUv - 0.5;',
  '  vec2 meltUv = warpedUv;',
  '  float melt = max(uDissolve - uDisperse, 0.0);',
  '  if (melt > 0.0) {',
  '    meltUv = (warpedUv - 0.5) / (1.0 + melt * 1.8) + 0.5;',
  '  }',
  '  vec2 baseUv = meltUv * uRepeat + uOffset;',
  // R trails behind, B ghosts ahead; smear scales with dissolve.
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

// A CARD_FRAG variant over a text canvas, no corner SDF.
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
  'varying vec2  vUv;',
  ...HASH21,
  'void main() {',
  '  vec2 d = vUv - 0.5;',
  '  d.x *= 1.0 + uExitP * 1.6;',
  '  d    += d * uExitP * 0.7;',
  '  vec2 dA = vec2(d.x * uAspect, d.y);', // scale x to world-proportional space
  '  float r2 = dot(dA, dA);', // isotropic radius in world space
  '  float exitWarp = uWarp + uExitP * 3.0;',
  '  vec2 warpedVUv = d / (1.0 + exitWarp * r2 * 4.0) + 0.5;',
  '  vec2 finalUv = (warpedVUv - 0.5) / uUVScale + 0.5;',
  '  vec2 radial = (vUv - 0.5) * uCA;',
  '  float r = texture2D(uMap, finalUv + radial).r;',
  '  float g = texture2D(uMap, finalUv).g;',
  '  float b = texture2D(uMap, finalUv - radial).b;',
  '  float a = texture2D(uMap, finalUv).a;',
  // Sample alpha at 4 offsets so dissolve fires at glyph edges first.
  '  float _bl  = 0.020;',
  '  float _a4  = texture2D(uMap, finalUv + vec2( _bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(-_bl, 0.0)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0,  _bl)).a',
  '              + texture2D(uMap, finalUv + vec2(0.0, -_bl)).a;',
  '  float edgeProx = 1.0 - _a4 * 0.25;', // 0=deep interior, 1=at/near edge
  // 2px screen-space grain, per-channel seeds → RGB split.
  '  vec2  cell    = floor(gl_FragCoord.xy * 0.5);',
  '  float nR      = hash21(cell + vec2(0.00,  0.00));',
  '  float nG      = hash21(cell + vec2(2.10,  1.30));',
  '  float nB      = hash21(cell + vec2(1.70, -0.50));',
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
  '  float exitFade = 1.0 - smoothstep(0.0, 1.0, uExitP);',
  '  gl_FragColor = vec4(srgb, a * uOpacity * fadeX * fadeY * exitFade);',
  '}',
].join('\n');

// Pull-quote particles. Each starts as a tile of a far-side card: aSrcWorld is its point on the
// card plane (orientation frozen), projected with the LIVE camera every frame, so the tiles keep
// riding the zoom; aUv is its geometry uv, and the fragment shader samples the card's own texture
// across the tile (inverse screen Jacobian), masked by the card's corner SDF, so at uP = 0 the
// tiles are the card, pixel for pixel. After its own release (aRelease: edge-first, near cards
// first) a tile bursts off and flies to its text target (`position`, px), blended in clip space
// toward a camera-attached plane, so the motion eases out of the camera's. Phase shares of uP:
export const QUOTE_BURST_DUR = 0.22; // release → fully broken up
export const QUOTE_FLY_LAG = 0.04; // release → start of flight
export const QUOTE_FLY_DUR = 0.48;
export const QUOTE_DELAY_MAX = 0.2; // reading-order arrival spread
export const QUOTE_DETACH_AT = 0.04; // after its release, a tile stops riding the camera
export const QUOTE_DETACH_TAU = 0.05;
export const QUOTE_RELEASE_MAX = 0.26; // max aRelease; RELEASE + LAG + DELAY + DUR must stay ≤ 1
// Share of a particle's own travel after which it turns from its photo colour to the text's. Every
// particle has landed (t = 1) by uP = 1, which is where the DOM cross-fade starts: no colour pop.
export const QUOTE_INK_FROM = 0.78;

const PX_FROM_CLIP = [
  'vec2 pxOf(vec4 c, vec2 view) {',
  '  return vec2((c.x / c.w + 1.0) * 0.5 * view.x, (1.0 - c.y / c.w) * 0.5 * view.y);',
  '}',
];

export const QUOTE_PARTICLE_VERT = [
  'attribute vec3 aSrcWorld;',
  'attribute vec2 aUv;',
  'attribute float aRelease;',
  'attribute vec3 aDstColor;',
  'attribute vec4 aSeed;', // x = arrival delay, y = scatter angle, z = scatter share, w = swirl
  'uniform mat4 uProj;',
  // The camera only dollies along z (it never rotates), so its z as a function of uP is the whole
  // view: zoomT = uZoom.x + uP * uZoom.y, eased like TL.camZAtZoomT between uCamZ.x and uCamZ.y.
  'uniform vec2 uZoom;',
  'uniform vec2 uCamZ;',
  'uniform vec3 uAxisU;', // world vector per unit of geometry u on this card
  'uniform vec3 uAxisV;',
  'uniform vec2 uCell;', // a tile's uv extent
  'uniform vec2 uViewport;',
  'uniform float uDpr;',
  'uniform float uPinTop;',
  'uniform float uP;',
  'uniform float uFade;',
  'uniform float uSize;',
  'uniform float uScatter;', // px
  'uniform float uMinDepth;', // view depth the sources are clamped to, and where they break up
  'uniform float uTargetDepth;', // depth of the camera-attached text plane the flight blends to
  'varying vec2 vUv;',
  'varying vec4 vJinv;', // d(geometry uv) / d(px), column-major mat2
  'varying float vSize;', // css px
  'varying float vE;',
  'varying float vInk;',
  'varying float vAlpha;',
  'varying vec3 vDst;',
  ...PX_FROM_CLIP,
  'float camZAt(float p) {',
  '  float t = clamp(uZoom.x + p * uZoom.y, 0.0, 1.0);',
  '  return mix(uCamZ.x, uCamZ.y, 1.0 - pow(1.0 - t, 3.0));',
  '}',
  'float camZ;',
  'vec4 clipOf(vec3 w) {',
  '  vec4 v = vec4(w.xy, min(w.z - camZ, -uMinDepth), 1.0);',
  '  return uProj * v;',
  '}',
  'void main() {',
  // On the card a tile rides the live camera exactly; after its release it lets go of it on an
  // exponential tail (C1 at the release), so it neither stops dead nor keeps rushing outward.
  `  float rel = aRelease + ${glf(QUOTE_DETACH_AT)};`,
  `  float pd = uP <= rel ? uP : rel + ${glf(QUOTE_DETACH_TAU)} * (1.0 - exp(-(uP - rel) / ${glf(QUOTE_DETACH_TAU)}));`,
  '  camZ = camZAt(pd);',
  '  vec4 cs = clipOf(aSrcWorld);',
  '  float depth = camZ - aSrcWorld.z;',
  '  vec2 src = pxOf(cs, uViewport);',
  '  vec2 du = pxOf(clipOf(aSrcWorld + uAxisU * uCell.x), uViewport) - src;',
  '  vec2 dv = pxOf(clipOf(aSrcWorld + uAxisV * uCell.y), uViewport) - src;',
  '  mat2 m = mat2(du / uCell.x, dv / uCell.y);', // px per unit uv
  '  float det = m[0][0] * m[1][1] - m[1][0] * m[0][1];',
  '  mat2 inv = abs(det) > 1e-6 ? mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / det : mat2(0.0);',
  '  vJinv = vec4(inv[0], inv[1]);',
  '  float tile = max(abs(du.x) + abs(dv.x), abs(du.y) + abs(dv.y)) * 1.02;',
  // A source the camera is about to reach breaks up regardless of its schedule.
  '  float near = 1.0 - smoothstep(uMinDepth, uMinDepth * 4.0, depth);',
  `  float e = max(smoothstep(aRelease, aRelease + ${glf(QUOTE_BURST_DUR)}, uP), near);`,
  '  vec2 dir = vec2(cos(aSeed.y), sin(aSeed.y));',
  '  vec2 from = src + ((src - uViewport * 0.5) * 0.5 + dir * aSeed.z * uScatter) * e;',
  `  float t = clamp((uP - aRelease - ${glf(QUOTE_FLY_LAG)} - aSeed.x) / ${glf(QUOTE_FLY_DUR)}, 0.0, 1.0);`,
  '  float te = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(2.0 - 2.0 * t, 3.0) * 0.5;',
  '  vec2 dst = position.xy + vec2(0.0, uPinTop);',
  '  vec2 path = dst - from;',
  '  vec2 swirl = vec2(-path.y, path.x) * aSeed.w * 0.3 * sin(3.14159 * te);',
  '  vec2 toNdc = vec2(2.0, -2.0) / uViewport;',
  '  vec2 fromNdc = (from - uViewport * 0.5) * toNdc;',
  '  vec2 dstNdc = (dst - uViewport * 0.5) * toNdc;',
  // Linear in clip space is linear in view space: the flight leaves the moving card plane and
  // lands on a plane riding with the camera.
  '  vec4 c = mix(vec4(fromNdc * cs.w, 0.0, cs.w), vec4(dstNdc * uTargetDepth, 0.0, uTargetDepth), te);',
  '  c.xy += swirl * toNdc * c.w;',
  '  gl_Position = c;',
  '  float size = mix(mix(tile, max(2.4, uSize * 1.2), e), uSize, te);',
  '  gl_PointSize = clamp(size * uDpr, 1.0, 256.0);',
  '  vSize = gl_PointSize / uDpr;',
  '  vUv = aUv;',
  '  vE = e;',
  `  vInk = smoothstep(${glf(QUOTE_INK_FROM)}, 1.0, t);`,
  '  vDst = aDstColor;',
  '  vAlpha = uFade;',
  '}',
].join('\n');

export const QUOTE_PARTICLE_FRAG = [
  'uniform sampler2D uMap;',
  'uniform vec2 uRepeat;',
  'uniform vec2 uOffset;',
  'uniform float uAspect;',
  'uniform float uRadius;',
  'uniform float uCA;',
  'uniform float uMirror;',
  'uniform float uAlpha;',
  'varying vec2 vUv;',
  'varying vec4 vJinv;',
  'varying float vSize;',
  'varying float vE;',
  'varying float vInk;',
  'varying float vAlpha;',
  'varying vec3 vDst;',
  ...RR_SDF,
  'void main() {',
  // While on the card each fragment samples its own uv; breaking up collapses the tile to a dot.
  '  vec2 dpx = (gl_PointCoord - 0.5) * vSize;',
  '  vec2 uv = vUv + mat2(vJinv.xy, vJinv.zw) * dpx * (1.0 - vE);',
  '  vec2 fUv = uMirror > 0.5 ? vec2(1.0 - uv.x, uv.y) : uv;',
  // The card shader's own corner mask and AA, so the tiles' union is the card.
  '  vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '  float dsd = rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius);',
  '  float px = fwidth(pos.y);',
  '  float shapeA = 1.0 - smoothstep(-px, px, dsd);',
  '  float dotA = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - 0.5));',
  '  float a = uAlpha * vAlpha * mix(shapeA, dotA, smoothstep(0.0, 0.3, vE));',
  '  if (a < 0.002) discard;',
  '  vec2 base = fUv * uRepeat + uOffset;',
  '  vec2 radial = (fUv - 0.5) * uCA;',
  '  vec3 rgb = vec3(texture2D(uMap, base + radial).r, texture2D(uMap, base).g, texture2D(uMap, base - radial).b);',
  '  vec3 photo = pow(max(rgb, 0.0), vec3(1.0 / 2.2));',
  // Scattering lifts the photo colours a touch, so dark cards still read as they break up; the
  // letters assemble in photo colour and take the text's only as each particle lands.
  '  photo = mix(photo, vec3(1.0), 0.12 * vE);',
  '  gl_FragColor = vec4(mix(photo, vDst, vInk), a);',
  '}',
].join('\n');
