import * as THREE from '../../../deps/three.js';
import { createTag, getFederatedUrl, getConfig } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';
import {
  easeOutCubic, easeInOutCubic, lerpN, clamp, clamp01, TAN_HALF_FOV, TEXT_APPEAR_START, CARD_ASPECT,
  seededRandom, createBaseFrame, createBaseFrameInput, deriveBaseFrame, travelSpanPx, logGlobe,
  wrapAngle,
} from '../../../utils/globe/core.js';
import { escapeHtml, hangParagraphs, buildGlobeSkeleton, fetchGlobeData, parseCommonRows } from '../../../utils/globe/authoring.js';
import { CARD_ORDER_BASE, HOVER_SCALE, initGlobeBlock } from '../../../utils/globe/runtime.js';

const NAME = 'globe-gallery';

function badgeSvgUrl(a) {
  return [a.getAttribute('href'), a.textContent.trim()].find((s) => s?.includes('.svg')) ?? '';
}

function badgeIconHtml(url) {
  if (!url) return null;
  const src = getFederatedUrl(url);
  return `<picture class="globe-modal-badge-icon" aria-hidden="true"><img loading="lazy" src="${escapeHtml(src)}" alt=""></picture>`;
}

function parseArcCopy(row) {
  if (!row) return { title: '', body: [] };
  const heading = row.querySelector('h1,h2,h3,h4,h5,h6');
  const paras = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture,img') && p.textContent.trim());
  return {
    title: heading?.textContent ?? paras.shift()?.textContent.trim() ?? '',
    body: paras,
  };
}

function wholeParaChild(p, selector) {
  const child = p.querySelector(selector);
  const text = child?.textContent.trim();
  return text && text === p.textContent.trim() ? text : '';
}

function parseFragmentCardSegment(nodes) {
  let img = null;
  let role = '';
  let name = '';
  const description = [];
  const badges = [];

  nodes.forEach((node) => {
    const tag = node.nodeName;
    if (/^H[1-6]$/.test(tag)) {
      name ||= node.textContent.trim();
    } else if (tag === 'P') {
      const inlineImg = node.querySelector('img');
      if (inlineImg) {
        img ||= inlineImg;
        return;
      }
      const em = !role && wholeParaChild(node, 'em');
      const strong = !em && !name && wholeParaChild(node, 'strong');
      if (em) role = em;
      else if (strong) name = strong;
      else if (node.textContent.trim()) description.push(node);
    } else if (tag === 'PICTURE' || tag === 'IMG') {
      img ||= tag === 'IMG' ? node : node.querySelector('img');
    } else if (tag === 'UL') {
      node.querySelectorAll(':scope > li').forEach((li) => {
        const row = li.cloneNode(true);
        const featureLi = row.querySelector(':scope > ul > li');
        row.querySelector(':scope > ul')?.remove();

        const anchors = [...row.querySelectorAll('a')];
        const svgAnchor = anchors.find(badgeSvgUrl);
        const linkAnchor = anchors.find((a) => a !== svgAnchor);
        const icon = badgeIconHtml(
          svgAnchor ? badgeSvgUrl(svgAnchor) : row.querySelector('img')?.getAttribute('src'),
        );
        svgAnchor?.remove();

        const badgeName = (linkAnchor ?? row).textContent.trim();
        if (badgeName) {
          badges.push({
            name: badgeName,
            role: featureLi?.textContent.trim() ?? '',
            href: linkAnchor?.getAttribute('href') || null,
            icon,
          });
        }
      });
    }
  });

  if (!img) {
    const label = nodes.map((n) => n.textContent || '').join(' ').trim().slice(0, 60);
    logGlobe(NAME, `fragment section skipped, no image — "${label}"`, 'info');
    return null;
  }
  return {
    img: img.currentSrc || img.getAttribute('src') || img.src,
    alt: img.getAttribute('alt')?.trim() ?? '',
    name,
    role,
    description,
    badges,
  };
}

const CARD_CONTENT_TAGS = /^(P|UL|PICTURE|IMG|H[1-6])$/;

function parseFragmentCards(row) {
  const hasDirectContent = [...row.children].some((n) => CARD_CONTENT_TAGS.test(n.nodeName));

  if (!hasDirectContent) {
    return [...row.querySelectorAll(':scope > div')].flatMap(parseFragmentCards);
  }

  const segments = [[]];
  [...row.childNodes].forEach((node) => {
    const isContent = node.nodeType !== Node.TEXT_NODE || node.textContent.trim();
    if (node.nodeName === 'HR') segments.push([]);
    else if (isContent) segments.at(-1).push(node);
  });
  return segments
    .filter((nodes) => nodes.length)
    .map(parseFragmentCardSegment)
    .filter(Boolean);
}

export async function fetchFragmentCards(href) {
  const url = `${href}.plain.html`;
  return fetchGlobeData(NAME, url, undefined, async (resp) => {
    // DOMParser yields an inert document, so card <img>/<picture> never fetch here — only the
    // right-sized texture URL is downloaded.
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    const cards = [...doc.body.querySelectorAll(':scope > div')]
      .flatMap(parseFragmentCards);
    if (cards.length) return cards;
    logGlobe(NAME, `no usable cards in fragment: ${url}`);
    return null;
  });
}

export function optimizeImgUrl(src, px, axis = 'width') {
  if (!src) return src;
  try {
    const url = new URL(src, window.location.href);
    if (!/(^|\/)media_[0-9a-f]/i.test(url.pathname)) return src;
    return `${url.origin}${url.pathname}?${axis}=${Math.round(px)}&format=webply`;
  } catch {
    return src;
  }
}

// Positional rows. Fragment links are authored with #_dnb so Milo skips auto-resolution;
// the hash is stripped before fetching.
export function parseAuthoredContent(el) {
  const [arcCopyRow, cardsRow, hintTextRow, a11yRow, pullQuoteRow] = [...el.children];
  const fragmentLink = cardsRow?.querySelector('a[href]');
  // Row 2 is two cells: the barrel's bottom-row copy, then the hint plane / cursor label.
  return {
    arcCopy: parseArcCopy(arcCopyRow),
    fragmentHref: fragmentLink?.href.replace(/#.*$/, '') ?? null,
    ...parseCommonRows(hintTextRow, a11yRow, pullQuoteRow),
  };
}

const ARC_COPY_HTML = `  <div class="globe-arc-copy">
    <h2 class="globe-arc-copy-title"></h2>
    <div class="globe-arc-copy-body body-md"></div>
  </div>

`;

const modalInfoHtml = (gid) => `
    <div class="globe-modal-info" data-lenis-prevent>
      <h2 class="globe-modal-name" id="globe-modal-name-${gid}" tabindex="-1" autofocus aria-describedby="globe-modal-role-${gid} globe-modal-position-${gid}"></h2>
      <p class="globe-modal-role-label" id="globe-modal-role-${gid}"></p>
      <span class="globe-modal-position sr-only" id="globe-modal-position-${gid}" aria-hidden="true"></span>
      <div class="globe-modal-description" id="globe-modal-description-${gid}" role="document"></div>
      <ul class="globe-modal-badges"></ul>
    </div>
`;

export function buildGlobeDom(el, { labels, arcCopy, pullQuote, touchHint }) {
  const gid = buildGlobeSkeleton(el, NAME, {
    labels,
    touchHint,
    pullQuote,
    arcCopyHtml: ARC_COPY_HTML,
    modalInfoHtml,
  });
  el.querySelector('.globe-arc-copy-title').textContent = arcCopy.title;
  el.querySelector('.globe-arc-copy-body').replaceChildren(...arcCopy.body);
  return gid;
}

export function renderModalContent(targetEl, meta) {
  targetEl.querySelector('.globe-modal-role-label').textContent = meta.role;
  targetEl.querySelector('.globe-modal-name').textContent = meta.name;
  const descEl = targetEl.querySelector('.globe-modal-description');
  descEl.replaceChildren(...meta.description);
  hangParagraphs(descEl);
  const config = getConfig();
  const rows = meta.badges.map((b) => {
    const daall = `${processTrackingLabels(b.name, config, 20)}--globe_card_modal`;
    const nameHtml = b.href
      ? `<a class="globe-modal-badge-app globe-modal-badge-app-link" href="${escapeHtml(b.href)}" daa-ll="${escapeHtml(daall)}">${escapeHtml(b.name)}</a>`
      : `<span class="globe-modal-badge-app">${escapeHtml(b.name)}</span>`;
    return createTag('li', { class: 'globe-modal-badge' }, `<div class="globe-modal-badge-left">${b.icon ?? ''}${nameHtml}</div><span class="globe-modal-badge-role">${escapeHtml(b.role)}</span>`);
  });
  targetEl.querySelector('.globe-modal-badges').replaceChildren(...rows);
  return { descEl, speech: [[meta.name], [meta.role]] };
}

const PROGRESS_PAN_END = 0.55;
const PROGRESS_ARC_PREROLL = 0.30;
const PROGRESS_GRID_ARC_START = 0.30;
const PROGRESS_GRID_ARC_END = 0.60;
export const PROGRESS_FOLD_DUR = 0.25;
const PROGRESS_ZOOM_END = 1.00;
const GRID_ARC_RANGE = PROGRESS_GRID_ARC_END - PROGRESS_GRID_ARC_START;

const GRID_PEEL_STAGGER = 0.20;
const GRID_PEEL_JITTER = 2 * GRID_PEEL_STAGGER;
const GRID_PEEL_WINDOW = 1.0 - GRID_PEEL_STAGGER;

const FOLD_PEEL_OVERLAP = 0.35;
const FOLD_START_LOCAL_T = 1 - (FOLD_PEEL_OVERLAP ** (1 / 3));

export function cardFoldStartProgress(gpDelay) {
  const foldStartFormT = gpDelay + FOLD_START_LOCAL_T * GRID_PEEL_WINDOW;
  const foldStartArcT = PROGRESS_GRID_ARC_START + Math.min(1, foldStartFormT) * GRID_ARC_RANGE;
  return Math.max(0, (foldStartArcT - PROGRESS_ARC_PREROLL) * PROGRESS_PAN_END);
}

const FOLD_FIRST_PROGRESS = cardFoldStartProgress(0);
export const SPHERE_FORMED_PROGRESS = cardFoldStartProgress(GRID_PEEL_STAGGER) + PROGRESS_FOLD_DUR;
const FOLD_WINDOW = SPHERE_FORMED_PROGRESS - FOLD_FIRST_PROGRESS;

// Entry: raw-scroll space, before `progress` exists.
const ENTRY_RAMP_VH = 1.05;
const ENTRY_ROT_MAX = 0.9;
const ARC_ENTRY_STAGGER = 0.45;

// sphereFormT. One gate for everything that says "the globe is live": hover, click, drag,
// auto-rotate, desktop cursor, hint-plane entrance
export const SPHERE_INTERACTIVE_T = 0.94;
const BROWSE_VIEW_T = 0.96;
const SPHERE_ORIENT_RESET_T = 0.01;

const ARC_COPY_IN_ENTRY_T = 0.336;
const ARC_COPY_OUT_FORM_START = 0.20;
const ARC_COPY_OUT_FORM_END = 0.90;

const progressAtFormT = (t) => FOLD_FIRST_PROGRESS + t * FOLD_WINDOW;

const BROWSE_VIEW_SCROLL_FRAC = progressAtFormT(BROWSE_VIEW_T) / SPHERE_FORMED_PROGRESS;

export const ARC_COPY_OUT_START = progressAtFormT(ARC_COPY_OUT_FORM_START);
export const ARC_COPY_OUT_END = progressAtFormT(ARC_COPY_OUT_FORM_END);

export const TRAVEL_EASE_POW = 2;

export function createFrame() {
  return {
    ...createBaseFrame(),
    progress: 0,
    arcCopyEntryT: 0,
    arcPanT: 0,
    gridFormT: 0,
    foldSphDist: 0,
  };
}

export function createFrameInput() {
  return { ...createBaseFrameInput(), entryLeadVh: 0 };
}

export function deriveFrame(frame, input) {
  const { blockDocTop, formPx, viewportH, entryLeadVh } = input;

  const scrollY = deriveBaseFrame(frame, input);

  const entryStart = blockDocTop - viewportH * entryLeadVh;
  const entryRange = Math.max(1, viewportH * ENTRY_RAMP_VH);
  const arcCopyEntryT = clamp01((scrollY - entryStart) / entryRange);
  frame.arcCopyEntryT = arcCopyEntryT;
  frame.beforeEntry = scrollY < entryStart;

  const rawScroll = scrollY - blockDocTop;
  const progress = rawScroll <= formPx
    ? clamp01(rawScroll / Math.max(1, formPx)) * SPHERE_FORMED_PROGRESS
    : SPHERE_FORMED_PROGRESS
      + clamp01((rawScroll - formPx) / travelSpanPx(input)) * (1 - SPHERE_FORMED_PROGRESS);
  frame.progress = progress;

  const arcPanT = Math.min(1, progress / PROGRESS_PAN_END + PROGRESS_ARC_PREROLL * arcCopyEntryT);
  frame.arcPanT = arcPanT;
  frame.gridFormT = clamp01((arcPanT - PROGRESS_GRID_ARC_START) / GRID_ARC_RANGE);
  const sphereFormT = clamp01((progress - FOLD_FIRST_PROGRESS) / FOLD_WINDOW);
  frame.sphereFormT = sphereFormT;
  frame.interactive = sphereFormT >= SPHERE_INTERACTIVE_T;
  frame.orientReset = sphereFormT < SPHERE_ORIENT_RESET_T;
  frame.hintEntryT = clamp01(
    (sphereFormT - TEXT_APPEAR_START) / (SPHERE_INTERACTIVE_T - TEXT_APPEAR_START),
  );
  frame.scrollT = clamp01(
    (progress - SPHERE_FORMED_PROGRESS) / (PROGRESS_ZOOM_END - SPHERE_FORMED_PROGRESS),
  );

  return frame;
}

export function easeInOutQuint(t) { return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2; }

// Quadratic ramp over the first `k`, then linear (C1 at the seam).
export function arcRotationEase(t, k) {
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}

export function buildArcCtx(arcPanT, W, H, arcSpan, rampT) {
  const arcRot0 = arcRotationEase(arcPanT, rampT);
  const R = Math.max(W, H) * 1.5; // smaller radius = more visible arc curvature
  const alpha = Math.atan2(H, W);
  const fanCX = W * 0.5 - R * Math.sin(alpha);
  const fanCY = H * 0.5 + R * Math.cos(alpha) - H * 0.15;
  const thetaM = Math.atan2(-Math.cos(alpha), Math.sin(alpha));
  const rotOffset = arcSpan * 0.5 - arcSpan * 1.5 * arcRot0;
  const effectiveSpan = arcSpan * (1 + 0.4 * arcRot0);
  return {
    R, fanCX, fanCY, thetaM, rotOffset, effectiveSpan,
  };
}

export function getFanData(t, arcCtx, out = {}) {
  const angle = arcCtx.thetaM + arcCtx.effectiveSpan * (0.5 - t) + arcCtx.rotOffset;
  const rx = Math.cos(angle);
  const ry = Math.sin(angle);
  out.px = arcCtx.fanCX + arcCtx.R * rx;
  out.py = arcCtx.fanCY + arcCtx.R * ry;
  out.rx = rx;
  out.ry = ry;
  out.cssRot = Math.atan2(rx, -ry);
  return out;
}

// CSS screen coords → world coords (origin at screen centre, Y flipped).
export function cssToWorld(px, py, W, H, out = {}) {
  out.x = px - W / 2;
  out.y = -(py - H / 2);
  return out;
}

export function rotateArcPoint(px, py, angle, arcCtx, W, H, out = {}) {
  const dx = px - arcCtx.fanCX;
  const dy = py - arcCtx.fanCY;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rpx = arcCtx.fanCX + dx * cos - dy * sin;
  const rpy = arcCtx.fanCY + dx * sin + dy * cos;
  return cssToWorld(rpx, rpy, W, H, out);
}

// Frustum height = H at z=0, so 1 world unit = 1 CSS pixel.
export function arcCamZ(H) {
  return H / (2 * TAN_HALF_FOV);
}

const BREAKPOINTS = {
  sm: {
    minWidth: 0,
    ARC_SPAN: 3.6,
    SPHERE_R: 18,
    CARD_H_SPHERE: 11.0, // PlaneGeometry base only; masonry sets the visible size
    CARD_W_ARC: 220,
    CAM_Z_SPHERE: 70,
    CAM_Z_END: -60,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.5,
    GRID_WINDOW_COLS: 3,
    GRID_ROWS: 8,
    CARD_FACE_CAMERA: 0,
    CARD_ROLL_JITTER: 0.18,
    ARC_DENSE_FRACTION: 0.5,
    CYL_COLS_FIT: 0.65,
    DRAG_GEARING: 0.53, // fraction of 1:1 surface tracking
    ENTRY_LEAD_VH: 0.55,
    ARC_RAMP_T: 0.20,
  },
  md: {
    minWidth: 768,
    ARC_SPAN: 4.50,
    SPHERE_R: 35,
    CARD_H_SPHERE: 10.5,
    CARD_W_ARC: 456,
    CAM_Z_SPHERE: 57,
    CAM_Z_END: -60,
    NEAR_FADE_START: 2.0,
    NEAR_FADE_END: 1.6,
    GRID_WINDOW_COLS: 9,
    GRID_ROWS: 5,
    CARD_FACE_CAMERA: 0, // 0 = radially outward (true sphere)
    CARD_ROLL_JITTER: 0.5, // per-card random roll: ±half this, in radians
    ARC_DENSE_FRACTION: 0.4, // share clustered into the off-screen arc flank
    DRAG_GEARING: 0.6, // fraction of 1:1 surface tracking
    ENTRY_LEAD_VH: 0.5,
    ARC_RAMP_T: 0.1,
  },
};

const PEEL_SEED = 'You Shall Not pass!';
const TILT_SEED = 'Git Gud!';

const GRID_GAP_RATIO = 0.5; // gap between cards = 0.5× card width
const ARC_DENSE_SPLIT = 0.50; // fanT boundary: low-i cards below it peel first

const CA_STRENGTH = 0.01;

const CARD_ORDER_HANDOVER_T = 0.5;

function createHooks(ctx) {
  let cameraOrtho;
  let arcCtx = null;

  const arcCopy = { el: null, applied: {} };

  const foldRotQuat = new THREE.Quaternion();
  const stageQuat = new THREE.Quaternion();
  const stageEuler = new THREE.Euler();
  const tmpVec3 = new THREE.Vector3();
  const fanScratch = {};
  const wpScratch = {};
  const stageScratch = {};
  const phase = { gpE: 0, fdE: 0, baseCA: 0, entry: {} };

  function computeGridLayout() {
    const { GRID_WINDOW_COLS, GRID_ROWS, CARD_W_SPHERE } = ctx.bp;
    const gridCardW = ctx.bp.name === 'sm'
      ? ctx.W / (GRID_WINDOW_COLS + (GRID_WINDOW_COLS - 1) * GRID_GAP_RATIO)
      : ctx.W / GRID_WINDOW_COLS;
    const gridGap = gridCardW * GRID_GAP_RATIO;
    const gridCardH = gridCardW / CARD_ASPECT;
    const gridCols = Math.max(GRID_WINDOW_COLS, Math.ceil(ctx.cards.length / GRID_ROWS));
    const colShift = Math.round((gridCols - GRID_WINDOW_COLS) / 2);
    const totalW = GRID_WINDOW_COLS * gridCardW + (GRID_WINDOW_COLS - 1) * gridGap;
    const totalH = GRID_ROWS * gridCardH + (GRID_ROWS - 1) * gridGap;
    // Column-major: i=0 → lower-right, sweeping bottom-to-top then right-to-left.
    ctx.cards.forEach((card, i) => {
      const col = GRID_WINDOW_COLS - 1 - Math.floor(i / GRID_ROWS) + colShift;
      const row = GRID_ROWS - 1 - (i % GRID_ROWS);
      const gx = -totalW / 2 + col * (gridCardW + gridGap) + gridCardW / 2;
      const gy = totalH / 2 - row * (gridCardH + gridGap) - gridCardH / 2;
      // Written through, not replaced — this reruns on every resize.
      card.gridPos.set(gx, gy, 0);
      card.gridScale = gridCardW / CARD_W_SPHERE;
    });
  }

  // Cards not yet on the sphere subtract sphGroupZ. Must run at sphereFormT===0 too.
  function updateSphereGroupDepth(frame) {
    const { sphereFormT, scrollT } = frame;
    const { FOLD_SPHERE_DIST, CAM_Z_SPHERE } = ctx.bp;
    const foldSphDist = lerpN(FOLD_SPHERE_DIST, CAM_Z_SPHERE, sphereFormT ** 3);
    // For the hint-text stage: its plane scale tracks the live camera↔sphere distance.
    frame.foldSphDist = foldSphDist;
    frame.sphGroupZ = scrollT === 0 ? (ctx.camera.position.z - foldSphDist) : 0;
    ctx.sphereGroup.position.z = frame.sphGroupZ;
  }

  function setArcCopyStyle(prop, value) {
    if (arcCopy.applied[prop] === value) return;
    arcCopy.applied[prop] = value;
    arcCopy.el.style[prop] = value;
  }

  function updateArcCopy(frame) {
    if (ctx.reducedMotion) return;
    const arcCopyInE = easeOutCubic(Math.min(1, frame.arcCopyEntryT / ARC_COPY_IN_ENTRY_T));
    const arcCopyOutT = clamp01(
      (frame.progress - ARC_COPY_OUT_START) / (ARC_COPY_OUT_END - ARC_COPY_OUT_START),
    );
    const arcCopyOutE = easeInOutCubic(arcCopyOutT);
    const arcCopyOp = arcCopyInE * (1 - arcCopyOutE);
    const arcCopySlide = 24 * (1 - arcCopyInE);
    setArcCopyStyle('opacity', arcCopyOp.toFixed(3));
    setArcCopyStyle('pointerEvents', arcCopyOp > 0 ? 'auto' : 'none');
    setArcCopyStyle('transform', `translateY(${arcCopySlide.toFixed(1)}px)`);
  }

  function placeFoldingCard(card, mesh, fdE, stage, frame) {
    const { sphereRotActive } = frame;
    // Sphere endpoint is fully rotated; the lerp itself unwinds it.
    ctx.field.slotPose(card, sphereRotActive, tmpVec3, foldRotQuat);
    mesh.position.set(
      lerpN(stage.x, tmpVec3.x, fdE),
      lerpN(stage.y, tmpVec3.y, fdE),
      lerpN(stage.z, tmpVec3.z, fdE),
    );
    // Hover lands before the fold ends, so scale for it here too or the card pops at fdE 1.
    // Both axes, so applyCardFit's aspect is unchanged.
    const hs = 1 + card.hoverT * HOVER_SCALE;
    mesh.scale.set(
      lerpN(stage.scale, card.sphereScaleSX, fdE) * hs,
      lerpN(stage.scale, card.sphereScaleSY, fdE) * hs,
      1,
    );
    ctx.field.applyCardFit(mesh, card); // reads the scale set just above: fold framing stays exact
    // Slerp to the upright grid quat, not the peel spin, then reapply the residual spin.
    mesh.quaternion.slerpQuaternions(card.gridQuat, foldRotQuat, fdE);
    const residualZ = stage.rotZ - card.gridTilt;
    if (residualZ !== 0) {
      stageQuat.setFromEuler(stageEuler.set(0, 0, residualZ));
      mesh.quaternion.multiply(stageQuat);
    }
    // Blend by fdE so it lands continuous with placeSphereCard.
    ctx.field.applyCardFacing(mesh, fdE);
  }

  function placeGridCard(card, mesh, frame) {
    mesh.position.set(card.gridPos.x, card.gridPos.y, card.gridPos.z - frame.sphGroupZ);
    mesh.scale.setScalar(card.gridScale);
    ctx.field.applyCardFit(mesh, card, CARD_ASPECT);
    mesh.quaternion.copy(card.gridQuat);
  }

  // Transform on the arc→grid continuum at peel ease gpE (0 = arc, 1 = grid). Serves the
  // arc/peel render AND the origin of the fold lerp.
  function computeCardEntry(i, frame, out) {
    const last = Math.max(1, ctx.count - 1);
    const rawT = clamp01(i / last);
    const splitR = ctx.bp.ARC_DENSE_COUNT / last;
    out.fanT = rawT < splitR
      ? (rawT / Math.max(0.001, splitR)) * ARC_DENSE_SPLIT
      : ARC_DENSE_SPLIT + ((rawT - splitR) / Math.max(0.001, 1 - splitR)) * (1 - ARC_DENSE_SPLIT);
    const delay = ARC_ENTRY_STAGGER * Math.min(1, (1 - out.fanT) / (1 - ARC_DENSE_SPLIT));
    const span = Math.max(0.01, 1 - ARC_ENTRY_STAGGER);
    const rotT = clamp01((frame.arcCopyEntryT - delay) / span);
    out.rot = (1 - easeInOutQuint(rotT)) * ENTRY_ROT_MAX;
    return out;
  }

  function computeCardStage(card, gpE, frame, entry) {
    const { sphGroupZ } = frame;
    const arcScale = ctx.bp.CARD_W_ARC / ctx.bp.CARD_W_SPHERE;
    const { fanT, rot: entryRot } = entry;
    const fan = getFanData(fanT, arcCtx, fanScratch);
    const wp = entryRot > 0.001
      ? rotateArcPoint(fan.px, fan.py, entryRot, arcCtx, ctx.W, ctx.H, wpScratch)
      : cssToWorld(fan.px, fan.py, ctx.W, ctx.H, wpScratch);
    const webglRot = -fan.cssRot - entryRot;

    // Direct z-angle lerp, not slerp.
    if (gpE <= 0) {
      card.peelStartRot = null;
    } else if (card.peelStartRot === null) {
      card.peelStartRot = card.gridTilt + wrapAngle(webglRot - card.gridTilt);
    }

    stageScratch.x = lerpN(wp.x, card.gridPos.x, gpE);
    stageScratch.y = lerpN(wp.y, card.gridPos.y, gpE);
    stageScratch.z = lerpN(-sphGroupZ, card.gridPos.z - sphGroupZ, gpE);
    stageScratch.scale = lerpN(arcScale, card.gridScale, gpE);
    stageScratch.rotZ = card.peelStartRot === null
      ? webglRot
      : card.peelStartRot + (card.gridTilt - card.peelStartRot) * gpE;
    return stageScratch;
  }

  function placeArcCard(card, mesh, stage) {
    ctx.field.applyCardFit(mesh, card, CARD_ASPECT); // first phase a card renders in: must fit here
    mesh.position.set(stage.x, stage.y, stage.z);
    mesh.scale.setScalar(stage.scale);
    mesh.rotation.set(0, 0, stage.rotZ);
  }

  function applyCardOrder(card, mesh, i, frame) {
    if (frame.sphereFormT <= CARD_ORDER_HANDOVER_T) mesh.renderOrder = CARD_ORDER_BASE + i;
    else ctx.field.applyDepthOrder(card, mesh, frame);
  }

  return {
    entryCamZ: () => arcCamZ(ctx.H),
    viewOffsetY: ({ sphereFormT }) => (ctx.navH / 2) * sphereFormT,
    browseScrollTop: () => (ctx.reducedMotion
      ? ctx.worldEl.getBoundingClientRect().top + window.scrollY
      : ctx.blockDocTop + ctx.formedScrollPx() * BROWSE_VIEW_SCROLL_FRAC),
    // Ortho on the arc, perspective from the fold on.
    activeCamera: ({ sphereFormT }) => (sphereFormT === 0 ? cameraOrtho : ctx.camera),
    fillFrameInput(input) {
      input.entryLeadVh = ctx.bp.ENTRY_LEAD_VH;
    },
    beforeBuild(canvas) {
      arcCopy.el = ctx.q('.globe-arc-copy');
      if (ctx.reducedMotion) ctx.worldEl.before(arcCopy.el);
      else ctx.worldEl.after(arcCopy.el);
      ctx.disposer.add(() => { arcCopy.el.style.cssText = ''; });
      canvas.style.position = '';
    },
    onCameraReady() {
      const { W, H } = ctx;
      // Arc phase: flat 2D, 1 world unit = 1 CSS pixel.
      cameraOrtho = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, 5000);
      cameraOrtho.position.set(0, 0, 100);
      cameraOrtho.lookAt(0, 0, 0);
    },
    onResize() {
      const { W, H } = ctx;
      Object.assign(cameraOrtho, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
      cameraOrtho.updateProjectionMatrix();
      computeGridLayout();
    },
    onCardsBuilt() {
      const peelRandom = seededRandom(PEEL_SEED);
      const tiltRandom = seededRandom(TILT_SEED);
      const tiltEuler = new THREE.Euler();
      ctx.cards.forEach((card) => {
        card.gridPos = new THREE.Vector3();
        card.gridScale = 1;
        card.gridTilt = (tiltRandom() - 0.5) * 0.175;
        card.gridQuat = new THREE.Quaternion().setFromEuler(tiltEuler.set(0, 0, card.gridTilt));
        card.peelJitter = peelRandom();
        card.peelStartRot = null;
      });
      computeGridLayout();
    },
    beforeFrame(frame) {
      arcCtx = buildArcCtx(frame.arcPanT, ctx.W, ctx.H, ctx.bp.ARC_SPAN, ctx.bp.ARC_RAMP_T);
    },
    beforeCards: updateSphereGroupDepth,
    afterFrame: updateArcCopy,
    hintSphereDist: (frame) => frame.foldSphDist,
    cardPhase(card, i, frame) {
      const { progress, gridFormT } = frame;
      const baseDelay = (i / Math.max(1, ctx.count - 1)) * GRID_PEEL_STAGGER;
      const jitter = (card.peelJitter - 0.5) * GRID_PEEL_JITTER;
      const gpDelay = clamp(baseDelay + jitter, 0, GRID_PEEL_STAGGER);
      const gpLocalT = clamp01((gridFormT - gpDelay) / GRID_PEEL_WINDOW);
      const gpE = easeOutCubic(gpLocalT);

      // Gated on the RAW peel localT, not the eased gpE.
      const foldStartProg = cardFoldStartProgress(gpDelay);
      const fdLocalT = clamp01((progress - foldStartProg) / PROGRESS_FOLD_DUR);
      const fdE = gpLocalT >= FOLD_START_LOCAL_T ? easeInOutCubic(fdLocalT) : 0;

      computeCardEntry(i, frame, phase.entry);
      phase.gpE = gpE;
      phase.fdE = fdE;
      phase.baseCA = Math.max(
        phase.entry.rot / ENTRY_ROT_MAX,
        gpE * (1 - gpE) * 4,
        fdE * (1 - fdE) * 4,
      ) * CA_STRENGTH;
      return phase;
    },
    placeCard(card, mesh, i, frame, { gpE, fdE, entry }) {
      // Latest phase first. Sphere + settled-grid skip the stage compute.
      card.onSphere = fdE >= 1;
      if (card.onSphere) {
        ctx.field.placeSphereCard(card, mesh, frame);
      } else {
        const { uniforms } = mesh.material;
        uniforms.uReveal.value = card.revealT;
        uniforms.uContourFade.value = 1;
        uniforms.uDissolve.value = 1 - card.revealT;
        mesh.visible = true;
        mesh.material.opacity = 1;
        const prevMeshX = mesh.position.x;
        const prevMeshY = mesh.position.y;
        if (gpE >= 1 && fdE === 0) {
          placeGridCard(card, mesh, frame);
        } else {
          const stage = computeCardStage(card, gpE, frame, entry);
          if (fdE > 0) placeFoldingCard(card, mesh, fdE, stage, frame);
          else placeArcCard(card, mesh, stage);
        }
        ctx.field.applyMotionCA(mesh, mesh.position.x - prevMeshX, mesh.position.y - prevMeshY);
      }
      applyCardOrder(card, mesh, i, frame);
    },
  };
}

const SPEC = {
  name: NAME,
  breakpoints: BREAKPOINTS,
  timeline: { createFrame, createFrameInput, deriveFrame, TRAVEL_EASE_POW },
  bpExtras: (cfg, nTotal) => ({
    // Sphere-camera distance at fold start → ~70% viewport height; lerps to CAM_Z_SPHERE.
    FOLD_SPHERE_DIST: Math.round(cfg.SPHERE_R / (0.35 * TAN_HALF_FOV)),
    // Clamped so the spread keeps ≥1 card.
    ARC_DENSE_COUNT: Math.min(
      Math.round(cfg.ARC_DENSE_FRACTION * nTotal),
      Math.max(0, nTotal - 1),
    ),
  }),
  pullQuote: { requireOnSphere: true, manageCanvas: true },
  modal: { bodyOpenClass: true, renderContent: renderModalContent },
  cardImageUrl: (meta, cap) => optimizeImgUrl(meta.img, cap, 'height'),
  modalImageUrl: (meta, cap) => optimizeImgUrl(meta.img, cap),
  createHooks,
  parseContent: parseAuthoredContent,
  buildDom: buildGlobeDom,
  loadCards({ fragmentHref }) {
    if (fragmentHref) return fetchFragmentCards(fragmentHref);
    logGlobe(NAME, 'no fragment link authored');
    return null;
  },
};

export default function init(el) {
  return initGlobeBlock(el, SPEC);
}
