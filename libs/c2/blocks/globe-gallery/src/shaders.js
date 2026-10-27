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

// The texture-ready reveal's grain.
const GRAIN_CELLS = 160;
const glf = (n) => n.toFixed(3); // GLSL float literal (a bare `2` is an int there)

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
  'uniform float uDissolve;', // texture-ready reveal's dissolve (0 = solid, 1 = grain + smear)
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
  '  float a = shapeA;',
  // Particle grain, eaten edge-first.
  '  float dR = 1.0; float dG = 1.0; float dB = 1.0;',
  '  if (uDissolve > 0.0) {',
  `    vec2 cell = floor(fUv * vec2(uAspect, 1.0) * ${glf(GRAIN_CELLS)});`,
  '    float nR = hash21(cell + vec2(0.00,  0.00));',
  '    float nG = hash21(cell + vec2(2.10,  1.30));',
  '    float nB = hash21(cell + vec2(1.70, -0.50));',
  '    float edgeProx = 1.0 - smoothstep(0.0, 0.28, -dsd);',
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
  // Bail BEFORE the texture fetches.
  '  if (outA < 0.002) discard;',
  '  vec2 d  = fUv - uHoverPos;',
  '  float r2 = dot(d, d);',
  '  vec2 warpedUv = d / (1.0 + uWarp * r2 * 4.0) + uHoverPos;',
  '  vec2 mdir = fUv - 0.5;',
  '  vec2 meltUv = warpedUv;',
  '  float melt = uDissolve;',
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
// texture (per-fragment uv from a ray through the card's plane, so it stays exact under any
// perspective and tile size), masked by the card's corner SDF, so at rest the tiles are the card,
// pixel for pixel. Released rim first, each particle's own camera keeps a decaying share of the
// dolly (velocity-continuous, no clamp); later it departs and travels to its text target.
// aRand = (departure p, release p, 1 on a crosshair target, arrival p). Sources and targets are
// paired by a 2D quantile order (quote-particles.js), so neighbours stay neighbours.
// Arrival is a function of the TARGET's reading order only, so every particle of a glyph lands
// together, and the crisp text plane reveals each pixel with that same function: the text goes
// crisp in one wave with the landing, with no global fill-in afterwards.
// Share of the crosshair's order the right rule takes, drawing down from its top once the
// horizontal rules' left-to-right wave reaches it.
export const QUOTE_RULE_DROP = 0.15;
// Share of the order the text's last pixel lands at; the crosshair takes the full order, so its
// lines finish a little after the text.
export const QUOTE_TEXT_END = 0.88;
export const QUOTE_SETTLE = 0.04; // a region's particles hand over to the crisp text in this window
// Share of a particle's own travel after which it turns to ink; later for the crosshair, whose
// grey ink reads as colourless.
export const QUOTE_INK_FROM = 0.98;
const QUOTE_RULE_INK_FROM = 0.98;
// ± p on each particle's reading-order arrival, so the landing wave's edge is feathered and a dense
// region never lands at one instant. The crisp reveal and the particle fade allow for it.
export const QUOTE_ARRIVE_JITTER = 0.02;
// The flight. Reading order 0 → 1 lands across [arriveStart, arriveStart + arriveSpan]; the last
// glyph is crisp at QUOTE_CRISP_P. Particles ease off the dolly in a short common window `release`
// (start, spread; rim first), so a card turns to dots at once, then all depart within `depart`
// (start, spread; by reading order, rim first), right away, so the dotted cards never sit still,
// each flying at least `minFly`.
export const QUOTE_FLIGHT = {
  arriveStart: 0.4,
  arriveSpan: 0.35,
  release: [0.02, 0.015],
  depart: [0.03, 0.02],
  minFly: 0.15,
};
export const QUOTE_CRISP_P = QUOTE_FLIGHT.arriveStart + QUOTE_FLIGHT.arriveSpan
  + 2 * QUOTE_ARRIVE_JITTER + QUOTE_SETTLE;
// The swirl: every path rides one shared curl-noise flow, so neighbours move as ribbons. Its
// displacement is AMP × the viewport's short side times sin(π · eased progress), so it is zero at
// the hand-off and at landing, and the flow drifts with scroll (uP) only, so it reverses exactly.
export const QUOTE_SWIRL_AMP = 0.1;
const QUOTE_SWIRL_SCALE = 0.35; // flow feature size, as a share of the short side
const QUOTE_SWIRL_DRIFT = 1.5; // how far the flow evolves over the flight, noise units
export const QUOTE_MIN_DEPTH = 2; // world units a released particle's camera stays in front of it
// Share of its remaining depth a released particle still closes.
export const QUOTE_RELEASE_REACH = 0.5;
const QUOTE_TILE_CAP = 256; // CSS px, a sanity cap
// A released far tile: p over which it turns into a dot. It then holds its place (on its eased
// camera) until it departs.
const QUOTE_DETACH_P = 0.01;
// Share of a tile's detach time set by its distance from its card's edge (the rest is random), for
// both layers. Low: a card dissolves all over at once, not in a ring travelling inward.
export const QUOTE_EDGE_LEAD = 0.2;
// A near card's scatter: the share of its dissolve over which tiles detach (short, so the whole
// card turns to dots together and disperses as one), and how far out they fly, in multiples of
// their offset from the card centre.
const SCATTER_SPAN = 0.08;
const SCATTER_EXPAND = 1.5;

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

// JS mirror of the shader's envelope on the swirl, for tests.
export const swirlEnvelope = (t) => Math.sin(Math.PI * Math.min(1, Math.max(0, t)));

const PX_TO_CLIP = [
  'vec4 pxToClip(vec2 p, vec2 view) {',
  '  return vec4(p.x / view.x * 2.0 - 1.0, 1.0 - p.y / view.y * 2.0, 0.0, 1.0);',
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
  'uniform float uScreenSrc;', // 1: no card; aUv is a viewport fraction
  // ≥ 0: a near card's scatter (CardScatter), at this progress of its near-camera dissolve; the
  // particles ride the card's live pose, break up edge first (aRand.x) and drift out to nothing.
  'uniform float uScatterP;',
  'uniform float uAspect;', // the card's width / height
  'attribute vec2 aUv;', // u right, v down the card as seen
  'attribute vec2 aCell;', // the particle's cell, in card uv
  'attribute vec4 aRand;',
  'attribute vec3 aDstCol;',
  'varying vec2 vSrc;',
  'varying float vCamZ;',
  'varying vec4 vProj;',
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
  'void main() {',
  '  vec2 s; vec2 su; vec2 sv;',
  '  float zEff = cameraPosition.z;',
  '  if (uScreenSrc > 0.5) {',
  '    s = aUv * uView; su = vec2(2.0, 0.0); sv = vec2(0.0, 2.0);',
  '  } else {',
  '    vec3 w = uOrigin + uAxisU * aUv.x + uAxisV * aUv.y;',
  '    float camZ = cameraPosition.z;',
  // Released (edge first) from the dolly before it departs, so a late band still waits on screen.
  '    float zDep = camZAt(aRand.y);',
  `    float minZ = w.z + ${glf(QUOTE_MIN_DEPTH)};`,
  // Until its release the particle sees the live camera; after, a camera that carries on at the
  // same speed and eases to a stop short of it — no kink, and never past it.
  '    if (uScatterP < 0.0 && camZ < zDep) {',
  `      float d = max(zDep - minZ, 0.001) * ${glf(QUOTE_RELEASE_REACH)};`,
  '      zEff = zDep - d * (1.0 - exp(-(zDep - camZ) / d));',
  '    }',
  '    zEff = max(zEff, minZ);',
  '    s = toPx(w, zEff);',
  '    su = toPx(w + uAxisU * aCell.x, zEff) - s;',
  '    sv = toPx(w + uAxisV * aCell.y, zEff) - s;',
  '  }',
  'bool scatter = uScatterP >= 0.0;',
  // One leg from the card to the glyph: `t` drives the tile → dot change, landing and ink.
  '  float t = clamp((uP - aRand.x) / max(aRand.w - aRand.x, 0.001), 0.0, 1.0);',
  // Linear: no lingering on the card at departure, no crawl into the glyph at landing.
  '  float te = t;',
  '  vec2 pos = mix(s, position.xy, te);',
  // Carried by the shared flow, zero at both ends: hand-off and landing are exact.
  '  float vmin = min(uView.x, uView.y);',
  `  vec2 flow = curl(pos / (${glf(QUOTE_SWIRL_SCALE)} * vmin) + uP * ${glf(QUOTE_SWIRL_DRIFT)});`,
  `  pos += flow * ${glf(QUOTE_SWIRL_AMP)} * vmin * sin(3.14159 * te);`,
  // The bounding square of the projected cell, so neighbouring tiles always overlap.
  '  float tile = max(abs(su.x) + abs(sv.x), abs(su.y) + abs(sv.y)) * 1.05 + 0.5;',
  // A far tile turns into a dot at its release, in place, and waits there until it departs.
  `  float detach = smoothstep(aRand.y, aRand.y + ${glf(QUOTE_DETACH_P)}, uP);`,
  // Scatter: the whole card turns to dots at once and bursts outward: each tile flies from the
  // card's centre (and the view's, past the camera) at its own speed and angle, easing in and out.
  // Exact at t = 0.
  '  if (scatter) {',
  '    float h1 = hash21(aUv * 97.0 + 13.1);',
  '    float h2 = hash21(aUv * 61.0 + 3.7);',
  '    float rim = min(1.0, 2.0 * min(min(aUv.x, 1.0 - aUv.x), min(aUv.y, 1.0 - aUv.y)));',
  `    float det = ${glf(SCATTER_SPAN)} * (${glf(QUOTE_EDGE_LEAD)} * rim + ${glf(1 - QUOTE_EDGE_LEAD)} * h1);`,
  '    t = clamp((uScatterP - det) / (1.0 - det), 0.0, 1.0);',
  '    vec2 dir = s - toPx(uOrigin + 0.5 * (uAxisU + uAxisV), zEff);',
  '    float a = (h2 - 0.5) * 0.8;',
  '    dir = mat2(cos(a), sin(a), -sin(a), cos(a)) * dir;',
  `    pos = s + (dir * (0.5 + h2) * ${glf(SCATTER_EXPAND)} + (s - 0.5 * uView) * 0.5) * t * t * (3.0 - 2.0 * t);`,
  '  }',
  // Each tile is a square, contiguous with its neighbours, until it detaches (its release, or a
  // scatter tile's lift-off), then within a moment a round dot smaller than its cell, so a tile
  // never reads as a brick. g then takes it to its landing size.
  '  if (scatter) { float x = min(t / 0.25, 1.0); detach = x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }',
  '  float g = smoothstep(0.0, scatter ? 1.0 : 0.4, t);',
  // Landing, the dot grows to a square that closes the gaps to its neighbours, so the glyph reads
  // solid for the moment before the crisp text takes it over.
  '  float land = scatter ? 0.0 : smoothstep(0.85, 1.0, t);',
  `  tile = min(tile, ${glf(QUOTE_TILE_CAP)});`,
  '  float size = mix(tile * (1.0 - (scatter ? 0.0 : 0.2) * detach), scatter ? 0.35 * tile : uDstSize, g)',
  '    * (1.0 + 0.3 * land);',
  '  gl_Position = pxToClip(pos, uView);',
  '  gl_PointSize = max(1.0, size * uDpr);',
  // Where the sprite's texels come from: around the source point, seen by the particle's camera.
  '  vSrc = s;',
  '  vCamZ = zEff;',
  '  vProj = vec4(projectionMatrix[0][0], projectionMatrix[1][1], projectionMatrix[2][0], projectionMatrix[2][1]);',
  '  vSize = size;',
  '  vRound = max(g, detach) * (1.0 - land);',
  // Out over the second half of the region's settle window, as the crisp text comes in under it.
  // Keyed past the latest arrival in its region, so early landers stay until the crisp text is in.
  `  float fadeAt = aRand.w + ${glf(QUOTE_ARRIVE_JITTER)};`,
  `  vFade = 1.0 - smoothstep(fadeAt + ${glf(QUOTE_SETTLE * 0.3)}, fadeAt + ${glf(QUOTE_SETTLE * 0.8)}, uP);`,
  '  vInk = aDstCol;',
  `  float ink = smoothstep(mix(${glf(QUOTE_INK_FROM)}, ${glf(QUOTE_RULE_INK_FROM)}, aRand.z), 1.0, t);`,
  '  vInkK = ink * ink;',
  // A scatter fades as its dots spread apart, so it is gone before it reads as a sparse dot field.
  '  if (scatter) { vFade = 1.0 - smoothstep(0.0, 0.7, t); vInkK = 0.0; }',
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
  'uniform vec2 uView;',
  'uniform vec3 uOrigin;',
  'uniform vec3 uAxisU;',
  'uniform vec3 uAxisV;',
  'varying vec2 vSrc;',
  'varying float vCamZ;',
  'varying vec4 vProj;',
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
  // The fragment's ray at the source, through the card's plane: exact card uv under perspective.
  '    vec2 px = vSrc + pc * vSize;',
  '    vec2 ndc = vec2(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0);',
  '    vec3 dir = vec3((ndc.x + vProj.z) / vProj.x, (ndc.y + vProj.w) / vProj.y, -1.0);',
  '    vec3 cam = vec3(0.0, 0.0, vCamZ);',
  '    vec3 nrm = cross(uAxisU, uAxisV);',
  '    float den = dot(dir, nrm);',
  '    vec3 hit = cam + dir * (dot(uOrigin - cam, nrm) / (abs(den) > 1e-6 ? den : 1e-6)) - uOrigin;',
  '    vec2 uv = vec2(dot(hit, uAxisU) / dot(uAxisU, uAxisU), dot(hit, uAxisV) / dot(uAxisV, uAxisV));',
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
  'uniform float uRtl;',
  'uniform vec4 uRules;', // crosshair centre lines (left x, right x, top y, bottom y), px
  'uniform float uRuleW;',
  'uniform float uTextEnd;', // the text's last reading order / QUOTE_TEXT_END
  'varying vec2 vUv;',
  'varying vec2 vPx;',
  'void main() {',
  '  vec2 n = (vPx - uBox.xy) / max(uBox.zw, vec2(1.0));',
  // Must match quote-particles.js writeTargets: reading order for the text; the crosshair a
  // left-to-right wave, then the right rule draws down from its top.
  '  float order = clamp((uRtl > 0.5 ? 1.0 - n.x : n.x) * 0.7 + n.y * 0.3, 0.0, 1.0) / uTextEnd;',
  '  float tol = uRuleW * 0.5 + 1.0;',
  '  vec2 d = min(abs(vPx.xx - uRules.xy), abs(vPx.yy - uRules.zw));', // nearest of the 4 lines
  `  float wave = ${glf(1 - QUOTE_RULE_DROP)} * clamp(n.x, 0.0, 1.0);`,
  '  if (abs(vPx.x - uRules.y) <= tol) {',
  '    float down = clamp((vPx.y - uRules.z) / max(uRules.w - uRules.z, 1.0), 0.0, 1.0);',
  `    float atRight = ${glf(1 - QUOTE_RULE_DROP)} * clamp((uRules.y - uBox.x) / max(uBox.z, 1.0), 0.0, 1.0);`,
  `    order = atRight + ${glf(QUOTE_RULE_DROP)} * down;`,
  '  } else if (d.x <= tol) order = wave;',
  '  else if (abs(vPx.y - uRules.w) <= tol) {',
  '    float toRight = clamp((vPx.x - uBox.x) / max(uRules.y - uBox.x, 1.0), 0.0, 1.0);',
  `    order = wave + ${glf(QUOTE_RULE_DROP)} * toRight;`,
  '  } else if (d.y <= tol) order = wave;',
  '  order = clamp(order, 0.0, 1.0);',
  `  float arrive = ${glf(QUOTE_FLIGHT.arriveStart)} + ${glf(QUOTE_FLIGHT.arriveSpan)} * order;`,
  // From the region's mean arrival to past its latest one: crisp only once most particles are in.
  `  float reveal = smoothstep(arrive, arrive + ${glf(QUOTE_SETTLE * 0.6 + QUOTE_ARRIVE_JITTER)}, uP);`,
  '  vec4 t = texture2D(uMap, vUv);',
  '  gl_FragColor = vec4(t.rgb, t.a * reveal);',
  '}',
].join('\n');
