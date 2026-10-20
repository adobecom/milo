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

// Pull-quote particles: one Points draw per far-side card. Each particle is a cell of the card,
// a world-space point (uOrigin + uAxisU·u + uAxisV·v, the card frozen at the hand-off) projected
// with the LIVE camera, so it rides the dolly. Its point sprite is a window onto the real card
// texture (per-fragment uv through the inverse screen Jacobian), masked by the card's corner SDF,
// so at rest the tiles are the card, pixel for pixel. Then, edge first, each particle departs: its
// own camera eases to a stop (velocity-continuous) and it travels to its text target in px.
// aRand = (departure p, release p, wobble −1…1, arrival p). Sources and
// targets are paired by a 2D quantile order (quote-particles.js), so neighbours stay neighbours.
// Arrival is a function of the TARGET's reading order only, so every particle of a glyph lands
// together, and the crisp text plane reveals each pixel with that same function: the text goes
// crisp in one wave with the landing, with no global fill-in afterwards.
export const QUOTE_SETTLE = 0.04; // a region's particles hand over to the crisp text in this window
export const QUOTE_INK_FROM = 0.78; // share of a particle's own travel after which it turns to ink
export const QUOTE_CRISP_P = 0.84; // every mode's last glyph is crisp here: same runway for all

// Motion modes (?pqmotion=), one shared path skeleton; the id is the shader's PQ_MOTION define.
// arrive: reading order 0 → 1 lands across [start, start + span], so start + span + SETTLE is
// QUOTE_CRISP_P for every mode. departMax caps the edge-first break-up start. abc/swirl instead
// ease off the dolly in a short common window `release` (start, spread; rim first) so each card
// stays compact while it waits, then fly a fixed `fly`, rim particles up to `edgeFly` longer.
export const QUOTE_MOTIONS = {
  // Coherent pairing, direct paths with a slight wobble, a fixed flight per particle.
  abc: {
    id: 0, arriveStart: 0.45, arriveSpan: 0.35, release: [0.1, 0.1], fly: 0.3, edgeFly: 0.5,
  },
  // abc's timing, but the paths ride one shared curl-noise flow, so neighbours move as ribbons.
  swirl: {
    id: 1, arriveStart: 0.45, arriveSpan: 0.35, release: [0.1, 0.1], fly: 0.3, edgeFly: 0.5,
  },
  // Early rim-first release, then one long curved flight straight into the glyph: the control
  // point is pulled `pull` of the way toward the quote's centre and turned `vortex` × the source's
  // offset from it, so streams sweep in from every side like an inflowing vortex, never pausing.
  converge: {
    id: 2, arriveStart: 0.5, arriveSpan: 0.3, departMax: 0.25, pull: 0.35, vortex: 0.2,
  },
};
const QUOTE_WOBBLE = 0.06; // abc: sideways wobble, as a share of the path length
const QUOTE_SWIRL_AMP = 0.1; // swirl: flow displacement, as a share of the viewport's short side
const QUOTE_SWIRL_SCALE = 0.35; // swirl: flow feature size, as a share of the short side
const QUOTE_SWIRL_DRIFT = 1.5; // swirl: how far the flow evolves over the flight, noise units
const QUOTE_MIN_DEPTH = 2; // world units a released particle's camera stays in front of it
const QUOTE_RELEASE_REACH = 0.5; // share of its remaining depth a released particle still closes
const QUOTE_TILE_MAX = 128; // CSS px

const PX_TO_CLIP = [
  'vec4 pxToClip(vec2 p, vec2 view) {',
  '  return vec4(p.x / view.x * 2.0 - 1.0, 1.0 - p.y / view.y * 2.0, 0.0, 1.0);',
  '}',
];

// Value noise and its curl: a divergence-free 2D flow, deterministic in its inputs.
const CURL_NOISE = [
  'float vnoise(vec2 p) {',
  '  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
  '  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),',
  '    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);',
  '}',
  'float flowField(vec2 p) { return vnoise(p) + 0.5 * vnoise(p * 2.03 + 17.1); }',
  'vec2 curl(vec2 p) {',
  '  const float e = 0.05;',
  '  float dx = flowField(p + vec2(e, 0.0)) - flowField(p - vec2(e, 0.0));',
  '  float dy = flowField(p + vec2(0.0, e)) - flowField(p - vec2(0.0, e));',
  '  vec2 c = vec2(dy, -dx) / (2.0 * e);',
  '  return c / (1.0 + length(c));', // bounded below 1
  '}',
];

export const QUOTE_POINTS_VERT = [
  'uniform float uP;',
  'uniform vec2 uView;',
  'uniform float uDpr;',
  'uniform float uDstSize;',
  'uniform float uAlpha;',
  'uniform vec2 uZoomT;', // (zoomT at p = 0, zoomT per unit p)
  'uniform vec2 uCamZ;', // (CAM_Z_SPHERE, CAM_Z_SPHERE − CAM_Z_END)
  'uniform vec3 uOrigin;', // the card's top-left corner, world
  'uniform vec3 uAxisU;', // across the card's width, world
  'uniform vec3 uAxisV;', // down the card's height, world
  'uniform vec2 uCell;', // one particle's cell, in card uv
  'uniform float uScreenSrc;', // 1: no card; aUv is a viewport fraction
  'attribute vec2 aUv;', // u right, v down the card as seen
  'attribute vec4 aRand;',
  'attribute vec3 aDstCol;',
  'uniform vec2 uCentre;', // converge: the quote's centre, px
  'varying vec2 vUv;',
  'varying vec4 vJinv;',
  'varying float vSize;',
  'varying float vRound;',
  'varying vec3 vInk;',
  'varying float vInkK;',
  'varying float vFade;',
  ...PX_TO_CLIP,
  ...HASH21,
  ...CURL_NOISE,
  // Mirrors TL.camZAtZoomT, for the camera at a given flight progress.
  'float camZAt(float p) {',
  '  float z = clamp(uZoomT.x + p * uZoomT.y, 0.0, 1.0);',
  '  return uCamZ.x - uCamZ.y * (1.0 - pow(1.0 - z, 3.0));',
  '}',
  // The camera only dollies along z and looks down −z, so its view matrix is a translation.
  'vec2 toPx(vec3 w, float camZ) {',
  '  vec4 c = projectionMatrix * vec4(w.xy, w.z - camZ, 1.0);',
  '  vec2 n = c.xy / c.w;',
  '  return vec2((n.x + 1.0) * 0.5 * uView.x, (1.0 - n.y) * 0.5 * uView.y);',
  '}',
  'float smoother(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }', // still at ends
  'void main() {',
  '  vec2 s; vec2 su; vec2 sv;',
  '  if (uScreenSrc > 0.5) {',
  '    s = aUv * uView; su = vec2(2.0, 0.0); sv = vec2(0.0, 2.0);',
  '  } else {',
  '    vec3 w = uOrigin + uAxisU * aUv.x + uAxisV * aUv.y;',
  '    float camZ = cameraPosition.z;',
  // Released (edge first) from the dolly before it departs, so a late band still waits on screen.
  '    float zDep = camZAt(aRand.y);',
  `    float minZ = w.z + ${glf(QUOTE_MIN_DEPTH)};`,
  // Until it departs the particle sees the live camera; after, a camera that carries on at the
  // same speed and eases to a stop short of it — no kink, and never past it.
  '    float zEff = camZ;',
  '    if (camZ < zDep) {',
  `      float d = max(zDep - minZ, 0.001) * ${glf(QUOTE_RELEASE_REACH)};`,
  '      zEff = zDep - d * (1.0 - exp(-(zDep - camZ) / d));',
  '    }',
  '    zEff = max(zEff, minZ);',
  '    s = toPx(w, zEff);',
  '    su = toPx(w + uAxisU * uCell.x, zEff) - s;',
  '    sv = toPx(w + uAxisV * uCell.y, zEff) - s;',
  '  }',
  '  vec2 dst = position.xy;',
  // One leg from the card to the glyph: `t` drives the tile → dot change, landing and ink.
  '  float t = clamp((uP - aRand.x) / max(aRand.w - aRand.x, 0.001), 0.0, 1.0);',
  '  float te = smoother(t);', // still at both ends: velocity-continuous at departure and landing
  '#if PQ_MOTION == 2',
  `  vec2 ctrl = mix((s + dst) * 0.5, uCentre, ${glf(QUOTE_MOTIONS.converge.pull)});`,
  '  vec2 away = s - uCentre;',
  `  ctrl += vec2(-away.y, away.x) * ${glf(QUOTE_MOTIONS.converge.vortex)};`,
  '  float r = 1.0 - te;',
  '  vec2 pos = r * r * s + 2.0 * r * te * ctrl + te * te * dst;', // quadratic Bézier
  '#else',
  '  vec2 pos = mix(s, dst, te);',
  '  float bump = sin(3.14159 * te);', // 0 at both ends: hand-off and landing stay exact
  '#if PQ_MOTION == 1',
  '  float vmin = min(uView.x, uView.y);',
  `  vec2 flow = curl(pos / (${glf(QUOTE_SWIRL_SCALE)} * vmin) + uP * ${glf(QUOTE_SWIRL_DRIFT)});`,
  `  pos += flow * ${glf(QUOTE_SWIRL_AMP)} * vmin * bump;`,
  '#else',
  '  vec2 path = dst - s;',
  `  pos += vec2(-path.y, path.x) * aRand.z * ${glf(QUOTE_WOBBLE)} * bump;`,
  '#endif',
  '#endif',
  // The bounding square of the projected cell, so neighbouring tiles always overlap.
  '  float tile = max(abs(su.x) + abs(sv.x), abs(su.y) + abs(sv.y)) * 1.05 + 0.5;',
  '  float g = smoothstep(0.0, 0.4, t);',
  // Landing, the dot grows to a square that closes the gaps to its neighbours, so the glyph reads
  // solid for the moment before the crisp text takes it over.
  '  float land = smoothstep(0.85, 1.0, t);',
  `  float size = mix(min(tile, ${glf(QUOTE_TILE_MAX)}), uDstSize, g) * (1.0 + 0.3 * land);`,
  '  gl_Position = pxToClip(pos, uView);',
  '  gl_PointSize = max(1.0, size * uDpr);',
  // px → card uv for the fragment's offset inside the sprite.
  '  float a = su.x / uCell.x; float b = sv.x / uCell.y;',
  '  float c = su.y / uCell.x; float d = sv.y / uCell.y;',
  '  float det = a * d - b * c;',
  '  vJinv = vec4(d, -b, -c, a) / (abs(det) > 1e-6 ? det : 1e-6);',
  '  vUv = aUv;',
  '  vSize = size;',
  '  vRound = g * (1.0 - land);',
  // Out over the second half of the region's settle window, as the crisp text comes in under it.
  `  vFade = 1.0 - smoothstep(aRand.w + ${glf(QUOTE_SETTLE * 0.3)}, aRand.w + ${glf(QUOTE_SETTLE * 0.8)}, uP);`,
  '  vInk = aDstCol;',
  `  float ink = smoothstep(${glf(QUOTE_INK_FROM)}, 1.0, t);`,
  '  vInkK = ink * ink;',
  '}',
].join('\n');

export const QUOTE_POINTS_FRAG = [
  'uniform sampler2D uMap;',
  'uniform vec2 uRepeat;',
  'uniform vec2 uOffset;',
  'uniform float uMirror;',
  'uniform float uAspect;',
  'uniform float uRadius;',
  'uniform float uCardAlpha;',
  'uniform float uAlpha;',
  'uniform float uScreenSrc;',
  'varying vec2 vUv;',
  'varying vec4 vJinv;',
  'varying float vSize;',
  'varying float vRound;',
  'varying vec3 vInk;',
  'varying float vInkK;',
  'varying float vFade;',
  ...RR_SDF,
  'void main() {',
  '  vec2 pc = gl_PointCoord - 0.5;',
  '  float dotA = 1.0 - smoothstep(0.16, 0.25, dot(pc, pc));',
  '  float alpha = uAlpha * vFade * mix(1.0, dotA, vRound);',
  '  vec3 col = vInk;',
  '  if (uScreenSrc > 0.5) {',
  '    alpha *= vRound;', // nothing to break up: these only appear as they fly
  '  } else {',
  '    vec2 o = pc * vSize;',
  '    vec2 uv = vUv + vec2(dot(vJinv.xy, o), dot(vJinv.zw, o));',
  // The card's own GL uv (v up), mirrored on back faces exactly as CARD_FRAG does.
  '    vec2 fUv = vec2(uMirror > 0.5 ? 1.0 - uv.x : uv.x, 1.0 - uv.y);',
  '    vec2 pos = (fUv - 0.5) * vec2(uAspect, 1.0);',
  '    float aa = fwidth(pos.y);',
  '    alpha *= uCardAlpha * (1.0 - smoothstep(-aa, aa, rrSDF(pos, vec2(uAspect * 0.5, 0.5), uRadius)));',
  '    vec3 tex = texture2D(uMap, fUv * uRepeat + uOffset).rgb;',
  '    col = mix(pow(max(tex, 0.0), vec3(1.0 / 2.2)), vInk, vInkK);',
  '  }',
  '  if (alpha < 0.004) discard;',
  '  gl_FragColor = vec4(col, alpha);',
  '}',
].join('\n');

// The settled quote: the same raster the targets were sampled from, one texel per device pixel.
// The settled quote: the same raster the targets were sampled from, one texel per device pixel,
// each pixel revealed by the same reading-order arrival as the particles that land on it.
export const QUOTE_PLANE_VERT = [
  'uniform vec2 uView;',
  'varying vec2 vUv;',
  'varying vec2 vPx;',
  ...PX_TO_CLIP,
  'void main() {',
  '  vUv = uv;',
  '  vPx = position.xy;',
  '  gl_Position = pxToClip(position.xy, uView);',
  '}',
].join('\n');

export const QUOTE_PLANE_FRAG = [
  'uniform sampler2D uMap;',
  'uniform float uP;',
  'uniform vec4 uBox;', // the reading-order box (x, y, w, h), px
  'uniform vec2 uArrive;', // the motion's (arrival start, span)
  'uniform float uRtl;',
  'varying vec2 vUv;',
  'varying vec2 vPx;',
  'void main() {',
  '  vec2 n = (vPx - uBox.xy) / max(uBox.zw, vec2(1.0));',
  '  float order = clamp((uRtl > 0.5 ? 1.0 - n.x : n.x) * 0.7 + n.y * 0.3, 0.0, 1.0);',
  '  float arrive = uArrive.x + uArrive.y * order;',
  `  float reveal = smoothstep(arrive, arrive + ${glf(QUOTE_SETTLE * 0.6)}, uP);`,
  '  vec4 t = texture2D(uMap, vUv);',
  '  gl_FragColor = vec4(t.rgb, t.a * reveal);',
  '}',
].join('\n');
