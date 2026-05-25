import { createTag } from '../../../utils/utils.js';
import { debounce } from '../../../utils/action.js';

// Scroll-driven animation: arc → peel → settle → slotting. See README.md
// for the full phase timeline and design rationale.

const BREAKPOINTS = {
  mobile: () => window.innerWidth <= 767,
  tablet: () => window.innerWidth >= 768 && window.innerWidth <= 1279,
  desktop: () => window.innerWidth >= 1280,
};

const CARD_COLUMN_OFFSETS_RATIO = [-0.462, -0.154, 0.154, 0.462];
const CARD_COLUMN_GAP_RATIO = CARD_COLUMN_OFFSETS_RATIO[1] - CARD_COLUMN_OFFSETS_RATIO[0];
const CARD_WIDTH = 192;
const DEFAULT_CARD_HEIGHT = 230;
/** 8 cards fan along the arc (2 rows × 4 cols). Used for fanIdx normalization. */
const FAN_COUNT = 8;
const FAN_LAST_INDEX = FAN_COUNT - 1;
/** Row pitch / compression math uses this tallest-card metric. */
const ROW_METRIC_HEIGHT = 264;
const LABEL_CLEARANCE = 28;
// ── Animation tunables — edit here to adjust timing and feel ─────────────
const ANIM = {
  // Arc rotation timeline (abstract scroll units)
  arcPanEnd: 1350, // post-pin scroll units to complete a full rotation
  peelStartScroll: 135, // absolute scroll position where peel begins

  // Desktop/tablet peel + settle
  desktopPeelEnd: 1132,
  desktopSlottingDuration: 1720,
  arcSettleDuration: 1700,

  // Mobile peel + settle
  mobileSettleDuration: 468,
  mobileSlottingDuration: 900,
  mobilePostRevealScroll: 500,

  mobileArcAlpha: 0.6,

  // Arc shape + feel
  arcStagger: 0.50,
  arcSpan: 0.80,
  arcLiftZoom: 1.00,
  arcYTilt: 25,
  arcXTilt: 10,
  arcPushDistance: 60, // px each card is pushed outward along arc normal when peel begins
  arcFanDepthDelta: 0.30, // fanIdx=7 sits at 1.0×, fanIdx=0 at (1 - delta)× scale to fake depth
  arcShadowAlpha: 0.15, // base shadow opacity for arc-phase cards; fades with peel

  // Slide-in (arc entry): X offset + scale + opacity fade. Continuous arc
  // rotation through pre-pin (see arcPrePinRatio) keeps the slide-in feeling
  // rotational, so no Y counter-translation is added here.
  slideStagger: 0.45, // per-card stagger fraction (fanIdx=7 first, fanIdx=0 last)
  slideScaleStart: 0.85, // scale at slide start, grows to 1.0 on arrival
  slideStartX: 0.55, // base X offset as fraction of viewport width
  slideStaggerX: 0.20, // additional X offset per later card (fraction of vW)
  slideOverlap: 200, // scroll units into arc rotation when slide fully completes
  slideOpacityRampTo: 0.25, // cardSlideT value at which slide-in opacity reaches 1
  // Fraction of pre-pin scroll that drives arc rotation. >0 makes the arc
  // visibly rotate during slide-in so the transition into post-pin rotation is
  // continuous, not "off → on" at the pin moment.
  arcPrePinRatio: 0.125,

  // Grid layout
  baseColumnSpread: 1.20,
  baseRowGap: 0.60,
  columnCompressionTarget: 0.675,
  cardScaleDesktop: 1.035,

  // Mockup positioning
  desktopPeekStartH: 960,
  desktopPeekAmount: 0.30,
  mobileHeadlineY: 0.12,

  // Mockup animation
  desktopMockupStartScale: 2.5,
  desktopMockupEndScale: 1.0,
  mobileMockupStartScale: 2.0,
  mobileMockupEndScale: 1.0,
};

// ── Canvas dot-grid tunables ──────────────────────────────────────────────────
const CANVAS = {
  spacing: 16,
  mobileSpacing: 24,
  dotSize: 1,
  mouseRadius: 125,
  repelForce: 20,
  spring: 0.01,
  damping: 0.59,
  dotColor: '#969696',
};

// Derived scroll boundaries — computed from ANIM; do not edit directly.
/** Scroll unit at which card peel starts (end of the arc-rotation intro window). */
const PEEL_START_SCROLL = ANIM.peelStartScroll;
/** Full arc→grid scroll span reference; mobile settle timing anchors here. */
const DESKTOP_ARC_REFERENCE_END = ANIM.arcPanEnd + 1000;
const DESKTOP_SLOTTING_START = ANIM.desktopPeelEnd + ANIM.arcSettleDuration;
const MOBILE_GRID_END = Math.round(
  PEEL_START_SCROLL + (DESKTOP_ARC_REFERENCE_END - PEEL_START_SCROLL) * 0.39,
);
const MOBILE_PAN_START = Math.round((PEEL_START_SCROLL + MOBILE_GRID_END) / 2);
/** Column spread used to pin marketing text X during arc (settled spread minus post-peel trim). */
const ARC_TEXT_ANCHOR_COLUMN_SPREAD = ANIM.columnCompressionTarget - 0.15;

// Mobile layout constants
const MOBILE_COL_GAP = 32;
const MOBILE_OUTER_MARGIN = 24;

// FAN_INDEX_BY_GRID_POSITION maps grid [row][col] → arc position.
// Arc reads column-by-column L→R; fanIdx=0 is lower-right (peels first).
const FAN_INDEX_BY_GRID_POSITION = [
  [7, 5, 3, 1],
  [6, 4, 2, 0],
];

// ──────────── Acrobat desktop mockup geometry ────────────
// Mockup is a 971×576 illustration scaled responsively. Card slot positions
// are authored in mockup-pixel coordinates and scaled to the rendered width.
const ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH = 971;
const ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT = 576;
const ACROBAT_DESKTOP_MOCKUP_MAX_WIDTH = 971;
const ACROBAT_DESKTOP_MOCKUP_TABLET_MIN_WIDTH = 680;
const ACROBAT_DESKTOP_MOCKUP_TABLET_VW = 0.70;
const ACROBAT_DESKTOP_MOCKUP_DESKTOP_VW = 0.686;
const ACROBAT_DESKTOP_SLOT_WIDTH = 134;
const ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN = [129, 284, 439, 594];
const ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW = [187, 393];
/** px from header bottom to mockup top, and mockup bottom to CTA top, at rest. */
const ACROBAT_DESKTOP_GAP_ABOVE = 40;
const ACROBAT_DESKTOP_GAP_BELOW = 40;

// ──────────── Acrobat mobile mockup geometry ────────────
const ACROBAT_MOBILE_MOCKUP_WIDTH = 294;
const ACROBAT_MOBILE_MOCKUP_HEIGHT = 536;
const ACROBAT_MOBILE_MOCKUP_TOP_BAR_HEIGHT = 44;
const ACROBAT_MOBILE_MOCKUP_BOTTOM_BAR_HEIGHT = 100;
const ACROBAT_MOBILE_MOCKUP_TOP_PADDING = 48;
const ACROBAT_MOBILE_MOCKUP_BOTTOM_PADDING = 8;
const ACROBAT_MOBILE_SLOT_COLUMN_GAP = 16;
const ACROBAT_MOBILE_SLOT_ROW_COUNT = 2;
const ACROBAT_MOBILE_SLOT_ROW_GAP = 24;
const ACROBAT_MOBILE_CARD_LABEL_HEIGHT = 22;
const ACROBAT_MOBILE_CARD_LABEL_GAP = 4;

// Marketing text-block vertical offset below the bottom card row:
// label gap + label height + spacing to text. Used in 3 places.
const TEXT_BLOCK_BELOW_CARD_OFFSET = ACROBAT_MOBILE_CARD_LABEL_GAP
  + ACROBAT_MOBILE_CARD_LABEL_HEIGHT + 32;

function getAcrobatDesktopMockupWidth(viewportWidth, isTablet) {
  if (isTablet) {
    return Math.max(
      ACROBAT_DESKTOP_MOCKUP_TABLET_MIN_WIDTH,
      Math.min(ACROBAT_DESKTOP_MOCKUP_MAX_WIDTH, viewportWidth * ACROBAT_DESKTOP_MOCKUP_TABLET_VW),
    );
  }
  return Math.min(
    viewportWidth * ACROBAT_DESKTOP_MOCKUP_DESKTOP_VW,
    ACROBAT_DESKTOP_MOCKUP_MAX_WIDTH,
  );
}

function getDeskCardCenterX(viewportWidth, colIdx, columnSpread) {
  return viewportWidth * (0.5 + CARD_COLUMN_OFFSETS_RATIO[colIdx] * columnSpread);
}

function clamp01(x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}
function easeOutCubic(t) {
  return 1 - ((1 - t) ** 3);
}
// Quadratic ease-in for first 8%, then constant velocity — essentially linear after ramp.
function arcRotationEase(t) {
  const k = 0.08;
  const a = 1 / (k * (2 - k));
  const v0 = a * k * k;
  const s = 2 * a * k;
  return t <= k ? a * t * t : v0 + s * (t - k);
}
function easeOutSine(t) {
  return Math.sin((t * Math.PI) / 2);
}
function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function hexToRgb(hex) {
  const hexValue = parseInt(hex.replace('#', ''), 16);
  return [Math.floor(hexValue / 65536) % 256, Math.floor(hexValue / 256) % 256, hexValue % 256];
}

const [DOT_RED, DOT_GREEN, DOT_BLUE] = hexToRgb(CANVAS.dotColor);

function createCanvasGrid(canvas, {
  isMobile,
  getViewport,
  getCards,
  getCardCenter,
  getState,
}) {
  const context = canvas.getContext('2d');
  const mouse = { x: -9999, y: -9999 };
  let dots = [];
  let settled = true;

  function getSpacing() {
    return isMobile() ? CANVAS.mobileSpacing : CANVAS.spacing;
  }

  function buildGrid() {
    const { width, height } = getViewport();
    const spacing = getSpacing();
    dots = [];
    const columnCount = Math.ceil(width / spacing) + 2;
    const rowCount = Math.ceil(height / spacing) + 2;
    for (let row = 0; row < rowCount; row += 1) {
      for (let column = 0; column < columnCount; column += 1) {
        const x = column * spacing;
        const y = row * spacing;
        dots.push({
          originX: x, originY: y, x, y, velocityX: 0, velocityY: 0,
        });
      }
    }
  }

  function resize() {
    const { width, height } = getViewport();
    canvas.width = width;
    canvas.height = height;
    buildGrid();
  }

  function update() {
    if (isMobile()) return;
    const mouseParked = mouse.x === -9999;
    if (mouseParked && settled) return;

    const activeCards = getCards();

    let currentMouseRadius = CANVAS.mouseRadius;
    let currentRepelForce = CANVAS.repelForce;
    let boost = 0;
    activeCards.forEach((card) => {
      const { x, y } = getCardCenter(card);
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) boost = Math.max(boost, 1 - dist / 280);
    });
    if (boost > 0) {
      currentMouseRadius = CANVAS.mouseRadius * (1 + boost * 1.5);
      currentRepelForce = CANVAS.repelForce * (1 + boost * 0.8);
    }

    // 8k+ dots need raw loops
    let maxDisturbance = 0;
    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i];
      const deltaX = dot.x - mouse.x;
      const deltaY = dot.y - mouse.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < currentMouseRadius && distance > 0) {
        const force = (1 - distance / currentMouseRadius) * currentRepelForce;
        dot.velocityX += (deltaX / distance) * force;
        dot.velocityY += (deltaY / distance) * force;
      }
      dot.velocityX += (dot.originX - dot.x) * CANVAS.spring;
      dot.velocityY += (dot.originY - dot.y) * CANVAS.spring;
      dot.velocityX *= CANVAS.damping;
      dot.velocityY *= CANVAS.damping;
      dot.x += dot.velocityX;
      dot.y += dot.velocityY;
      const disturb = Math.abs(dot.velocityX) + Math.abs(dot.velocityY)
        + Math.abs(dot.x - dot.originX) + Math.abs(dot.y - dot.originY);
      if (disturb > maxDisturbance) maxDisturbance = disturb;
    }
    settled = mouseParked && maxDisturbance < 0.05;
    if (settled) {
      for (let i = 0; i < dots.length; i += 1) {
        const dot = dots[i];
        dot.x = dot.originX;
        dot.y = dot.originY;
        dot.velocityX = 0;
        dot.velocityY = 0;
      }
    }
  }

  function draw() {
    const { width, height } = getViewport();
    const { arcToGridProgress } = getState();
    context.clearRect(0, 0, width, height);
    const alpha = 0.45 * arcToGridProgress;
    if (alpha <= 0) return;
    context.fillStyle = `rgba(${DOT_RED},${DOT_GREEN},${DOT_BLUE},${alpha})`;

    context.beginPath();
    for (let i = 0; i < dots.length; i += 1) {
      context.moveTo(dots[i].x + CANVAS.dotSize, dots[i].y);
      context.arc(dots[i].x, dots[i].y, CANVAS.dotSize, 0, Math.PI * 2);
    }
    context.fill();
  }

  const handleMouseMove = (e) => {
    if (isMobile()) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    settled = false;
  };
  const handleMouseLeave = () => {
    mouse.x = -9999;
    mouse.y = -9999;
  };

  canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
  canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  return {
    resize,
    update,
    draw,
    destroy() {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    },
  };
}

function parseAuthoredContent(el) {
  const [titleRow, imageRow1, imageRow2, textRow, ctaRow, mockupRow] = [...el.children];
  const cards = [];
  [imageRow1, imageRow2].forEach((rowEl, rowIdx) => {
    [...rowEl.children].forEach((cellEl, colIdx) => {
      const img = cellEl.querySelector('img');
      const imageWidth = (img && parseInt(img.getAttribute('width'), 10)) || CARD_WIDTH;
      const imageHeight = (img && parseInt(img.getAttribute('height'), 10)) || DEFAULT_CARD_HEIGHT;
      const cardHeight = Math.round(CARD_WIDTH * (imageHeight / imageWidth));
      const label = cellEl.textContent.trim();
      // Mobile mapping: row 0 becomes a 2×2 grid (col%2, floor(col/2)); row 1 is hidden.
      cards.push({
        colIdx,
        rowIdx,
        mobileColIdx: colIdx % 2,
        mobileRowIdx: Math.floor(colIdx / 2),
        mobileHidden: rowIdx !== 0,
        cardHeight,
        label,
        el: cellEl,
      });
    });
  });
  const titleEl = titleRow.firstElementChild;
  const textBlockEl = textRow.firstElementChild;
  const ctaEl = ctaRow.firstElementChild;
  const [mobileMockupCol, desktopMockupCol, desktopPanelCol] = mockupRow.children;
  const mobileMockupImgEl = mobileMockupCol?.querySelector('picture');
  const desktopMockupImgEl = desktopMockupCol?.querySelector('picture');
  const desktopPanelImgEl = desktopPanelCol?.querySelector('picture');
  return {
    titleEl,
    cards,
    textBlockEl,
    ctaEl,
    mobileMockupImgEl,
    desktopMockupImgEl,
    desktopPanelImgEl,
  };
}

/** Builds the card-scene DOM: one stack root under `.card-scene` plus card state objects. */
function buildCardStack(cardScene, cardDefs) {
  const stackRoot = createTag('div', { class: 'card-stack' });
  cardScene.append(stackRoot);
  return cardDefs.map((def) => {
    const cardEl = def.el;
    cardEl.classList.add('card');
    cardEl.style.left = '0';
    cardEl.style.top = '0';
    const cardImg = cardEl.querySelector('img');
    if (cardImg) cardImg.decoding = 'async';
    stackRoot.appendChild(cardEl);
    let labelEl = null;
    if (def.label) {
      labelEl = createTag('div', { class: 'card-label-outer' }, def.label);
      labelEl.style.left = '0';
      labelEl.style.top = '0';
      labelEl.style.opacity = '0';
      stackRoot.appendChild(labelEl);
    }
    return {
      colIdx: def.colIdx,
      rowIdx: def.rowIdx,
      mobileColIdx: def.mobileColIdx,
      mobileRowIdx: def.mobileRowIdx,
      mobileHidden: def.mobileHidden,
      fanIdx: FAN_INDEX_BY_GRID_POSITION[def.rowIdx][def.colIdx],
      width: CARD_WIDTH,
      baseHeight: def.cardHeight,
      height: def.cardHeight,
      el: cardEl,
      labelEl,
      baseX: 0,
      baseY: 0,
      // NaN sentinel: render passes overwrite these with finite values once a
      // card has been positioned. getCanvasCardCenter checks for finiteness so
      // a legitimate x=0 doesn't fall through to the baseX fallback.
      visualCx: NaN,
      visualCy: NaN,
    };
  });
}

function setCardTransform(el, {
  translateX, translateY, scale, rotation = 0, tiltX = 0, tiltY = 0,
}) {
  el.style.transform = `translate(${translateX}px,${translateY}px) scale(${scale}) rotate(${rotation}deg) perspective(900px) rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
}

function arcCardShadow(opacity) {
  const a = (opacity * 1.8).toFixed(3);
  return `0 12px 20px 0 rgba(0,0,0,${a})`;
}

const ADBE_LOGO = `
<svg class="adbe-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 793 714" fill="none" overflow="visible">
  <path class="adbe-logo-path" d="M772.755 713.494H611.337C604.324 713.622 597.432 711.662 591.536 707.862C585.641 704.063 581.01 698.596 578.231 692.158L402.994 282.541C402.537 280.946 401.577 279.541 400.258 278.534C398.94 277.527 397.331 276.972 395.672 276.95C394.013 276.929 392.391 277.442 391.046 278.414C389.701 279.386 388.706 280.766 388.207 282.348L279 542.424C278.407 543.83 278.172 545.362 278.315 546.882C278.457 548.402 278.974 549.863 279.819 551.134C280.663 552.406 281.809 553.449 283.155 554.171C284.501 554.893 286.004 555.27 287.531 555.27H407.571C411.208 555.27 414.763 556.341 417.795 558.348C420.827 560.356 423.2 563.211 424.618 566.559L477.174 683.481C478.567 686.762 479.125 690.337 478.799 693.886C478.473 697.435 477.273 700.848 475.306 703.821C473.338 706.793 470.665 709.232 467.526 710.92C464.386 712.608 460.876 713.492 457.311 713.494H20.3044C17.0176 713.475 13.7866 712.642 10.8994 711.072C8.01233 709.501 5.5588 707.241 3.75759 704.492C1.95639 701.743 0.863449 698.592 0.576217 695.318C0.288985 692.045 0.816374 688.751 2.11138 685.731L280.081 23.9607C282.922 16.9565 287.809 10.9715 294.105 6.78681C300.401 2.60216 307.812 0.412351 315.372 0.50329H475.697C483.259 0.403187 490.675 2.58926 496.973 6.77504C503.271 10.9608 508.157 16.951 510.991 23.9607L790.885 685.731C792.18 688.746 792.709 692.035 792.426 695.304C792.142 698.573 791.055 701.721 789.261 704.469C787.466 707.216 785.021 709.478 782.141 711.053C779.261 712.627 776.037 713.466 772.755 713.494V713.494Z"/>
</svg>`;

function buildStage(el) {
  const {
    titleEl, cards: cardDefs, textBlockEl, ctaEl,
    mobileMockupImgEl, desktopMockupImgEl, desktopPanelImgEl,
  } = parseAuthoredContent(el);
  const desktopMockupWrapper = createTag('div', { class: 'acrobat-desktop-mockup' });
  if (desktopMockupImgEl) desktopMockupWrapper.appendChild(desktopMockupImgEl);
  const desktopPanelWrapper = createTag('div', { class: 'acrobat-desktop-panel' });
  if (desktopPanelImgEl) desktopPanelWrapper.appendChild(desktopPanelImgEl);
  desktopMockupWrapper.appendChild(desktopPanelWrapper);
  const mobileMockupWrapper = createTag('div', { class: 'acrobat-mobile-mockup' });
  if (mobileMockupImgEl) mobileMockupWrapper.appendChild(mobileMockupImgEl);
  const stage = createTag(
    'div',
    { class: 'dot-grid-stage' },
    `<canvas></canvas>${ADBE_LOGO}<div class="card-scene"></div>`,
  );
  const cardScene = stage.querySelector('.card-scene');
  const sceneCards = buildCardStack(cardScene, cardDefs);
  titleEl.classList.add('acrobat-title');
  textBlockEl.classList.add('text-block');
  textBlockEl.style.left = '0';
  ctaEl.classList.add('acrobat-cta');
  [titleEl, textBlockEl].forEach((e) => {
    e.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading');
    e.querySelector('p')?.classList.add('subcopy');
  });
  stage.append(desktopMockupWrapper, mobileMockupWrapper, titleEl, textBlockEl, ctaEl);
  el.replaceChildren(stage);
  return {
    stage,
    titleEl,
    textBlockEl,
    ctaEl,
    sceneCards,
    canvas: el.querySelector('canvas'),
    adbeLogoPath: el.querySelector('.adbe-logo-path'),
  };
}

export default function init(el) {
  const {
    stage, titleEl, textBlockEl, ctaEl, sceneCards,
    canvas, adbeLogoPath,
  } = buildStage(el);
  const desktopMockupEl = stage.querySelector('.acrobat-desktop-mockup');
  const desktopPanelEl = stage.querySelector('.acrobat-desktop-panel');

  // dasharray >> path length so the full dash covers the path with no snake effect
  const adbeLogoLength = Math.max(adbeLogoPath.getTotalLength(), 3000) * 2 + 500;
  adbeLogoPath.style.strokeDasharray = adbeLogoLength;
  stage.style.setProperty('--adbe-logo-length', adbeLogoLength);

  // ──────────────────── Animation state ────────────────────
  let viewportWidth = 0;
  let viewportHeight = 0;
  const scrollTimeline = { current: 0 };

  const phase = {
    arcPan: 0,
    arcToGrid: 0,
    slotting: 0,
    slideT: 0,
  };

  // Desktop card grid metrics (columnSpread, rowGap). Only read on desktop; mobile uses
  // frame.mobileLayout. Updated each frame anyway so breakpoint switches don't leave stale values.
  const cardGridLayout = {
    columnSpread: ANIM.baseColumnSpread,
    rowGap: ANIM.baseRowGap,
  };

  // Scroll offsets (abstract units) where arc/grid/slotting phases begin or how long they run.
  const timing = {
    gridEnd: MOBILE_GRID_END,
    slottingStart: MOBILE_GRID_END + ANIM.mobileSettleDuration,
    slottingDuration: ANIM.mobileSlottingDuration,
    postRevealScrollDistance: ANIM.mobilePostRevealScroll,
    /** Scroll position where post-peel settle compression / text pan begins. */
    settleScrollStart: DESKTOP_ARC_REFERENCE_END,
  };

  // Vertical pan offsets (px) for cards, text, and mockup during peel→grid and post-reveal.
  const verticalPan = {
    arcGridY: 0,
    mobilePostRevealY: 0,
    deskPostRevealY: 0,
  };

  /**
   * Viewport Y of the mobile Acrobat mockup top at rest.
   * Set in updateMockupAndTitleTransform; read by getMobileMockupCardSlot.
   */
  let mobileAcrobatMockupRestTop = 0;
  let cachedHeadlineH = 60;
  // Desktop/tablet: computed in resize(), used by getDesktopMockupFrame() and post-reveal pan.
  let cachedAcrobatWinTop = 0;
  let cachedAcrobatCtaTop = 0;
  let cachedDeskPostRevealNeeded = 0;
  let cachedMobilePostRevealDistance = ANIM.mobilePostRevealScroll;

  // Per-frame arc geometry — built once by buildArcCtx().
  let arcAngle = Math.atan2(1, 1);
  let arcGeometry = null;

  // Per-frame viewport profile — refreshed at top of each loop iteration.
  // Avoids repeated window.innerWidth reads + repeated getMobileLayout() calls.
  const frame = {
    isMobile: false,
    isTablet: false,
    mobileLayout: null,
  };

  let cachedTextBlockWidth = 0;
  let cachedBlockDocTop = 0;
  let cachedBlockHeight = 0;

  // ──────────────────── Arc geometry helpers ────────────────────
  function getCardArcToGridProgress(card) {
    const delay = (card.fanIdx / FAN_LAST_INDEX) * ANIM.arcStagger;
    const win = 1 - ANIM.arcStagger;
    return clamp01((phase.arcToGrid - delay) / win);
  }

  // Precompute per-frame arc constants once so getFanCenter doesn't recompute for each card.
  function buildArcCtx() {
    const arcRotationProgress = arcRotationEase(phase.arcPan);
    const arcZoom = 1.4 - 0.4 * easeOutCubic(phase.arcToGrid);
    const arcRadius = Math.max(viewportWidth, viewportHeight) * 1.2 * arcZoom;
    const fanCenterX = viewportWidth * 0.5 - arcRadius * Math.sin(arcAngle);
    const fanCenterY = viewportHeight * 0.5
      + arcRadius * Math.cos(arcAngle)
      - viewportHeight * 0.1;
    const middleAngle = arcAngle - Math.PI / 2;
    const rotationOffset = ANIM.arcSpan * 0.5 - ANIM.arcSpan * 1.5 * arcRotationProgress;
    const effectiveArcSpan = ANIM.arcSpan * (1 + 0.4 * arcRotationProgress);
    const flattenRaw = clamp01((phase.arcToGrid - 0.5) / 0.5);
    const flattenProgress = 0.20 * easeInOutCubic(flattenRaw);
    let tangentDirectionX = 0;
    let tangentDirectionY = 0;
    let arcMidpointX = 0;
    let arcMidpointY = 0;
    if (flattenProgress > 0) {
      const midAngle = middleAngle + rotationOffset;
      arcMidpointX = fanCenterX + arcRadius * Math.cos(midAngle);
      arcMidpointY = fanCenterY + arcRadius * Math.sin(midAngle);
      const currentTangentDirectionX = -Math.sin(midAngle);
      const currentTangentDirectionY = Math.cos(midAngle);
      const blendedTangentDirectionX = currentTangentDirectionX
        + (1 - currentTangentDirectionX) * flattenProgress;
      const blendedTangentDirectionY = currentTangentDirectionY * (1 - flattenProgress);
      const tangentDirectionLength = Math.sqrt(
        blendedTangentDirectionX * blendedTangentDirectionX
          + blendedTangentDirectionY * blendedTangentDirectionY,
      );
      tangentDirectionX = blendedTangentDirectionX / tangentDirectionLength;
      tangentDirectionY = blendedTangentDirectionY / tangentDirectionLength;
    }
    arcGeometry = {
      arcRadius,
      fanCenterX,
      fanCenterY,
      middleAngle,
      rotationOffset,
      effectiveArcSpan,
      flattenProgress,
      tangentDirectionX,
      tangentDirectionY,
      arcMidpointX,
      arcMidpointY,
      arcZoom,
    };
  }

  // Fan arc position — diagonal arc upper-left to lower-right, bowing toward upper-right.
  // Reads arcGeometry (built once per frame) so frame-level trig is not repeated per card.
  function getFanCenter(card) {
    const {
      arcRadius,
      fanCenterX,
      fanCenterY,
      middleAngle,
      rotationOffset,
      effectiveArcSpan,
      flattenProgress,
      tangentDirectionX,
      tangentDirectionY,
      arcMidpointX,
      arcMidpointY,
    } = arcGeometry;
    const angle = middleAngle + effectiveArcSpan / 2
      - (card.fanIdx / FAN_LAST_INDEX) * effectiveArcSpan
      + rotationOffset;
    let x = fanCenterX + arcRadius * Math.cos(angle);
    let y = fanCenterY + arcRadius * Math.sin(angle);
    const arcCosine = (x - fanCenterX) / arcRadius;
    const arcSine = (y - fanCenterY) / arcRadius;
    const arcRotation = (Math.atan2(arcCosine, -arcSine) * 180) / Math.PI;
    let rot = arcRotation;
    if (flattenProgress > 0) {
      const projection = (x - arcMidpointX) * tangentDirectionX
        + (y - arcMidpointY) * tangentDirectionY;
      const lineX = arcMidpointX + projection * tangentDirectionX;
      const lineY = arcMidpointY + projection * tangentDirectionY;
      x += (lineX - x) * flattenProgress;
      y += (lineY - y) * flattenProgress;
      rot = arcRotation * (1 - flattenProgress);
    }
    return { x, y, rot, rx: arcCosine, ry: arcSine };
  }

  // ──────────────────── Layout helpers ────────────────────
  // Responsive mobile grid dims. At 375px matches base sizing; scales to ~70% grid at 767px.
  function getMobileLayout() {
    const t = clamp01((viewportWidth - 375) / 392);
    const cardW = Math.round((viewportWidth * (0.875 - t * 0.175) - MOBILE_COL_GAP) / 2);
    const scale = cardW / CARD_WIDTH;
    const tallH = Math.round(ROW_METRIC_HEIGHT * scale);
    return { cardW, scale, tallH, rowPitch: tallH + 61 };
  }

  function refreshFrameProfile() {
    frame.isMobile = BREAKPOINTS.mobile();
    frame.isTablet = !frame.isMobile && BREAKPOINTS.tablet();
    frame.mobileLayout = frame.isMobile ? getMobileLayout() : null;
    if (frame.isMobile) {
      timing.gridEnd = MOBILE_GRID_END;
      timing.slottingStart = MOBILE_GRID_END + ANIM.mobileSettleDuration;
      timing.slottingDuration = ANIM.mobileSlottingDuration;
      timing.postRevealScrollDistance = cachedMobilePostRevealDistance;
      timing.settleScrollStart = DESKTOP_ARC_REFERENCE_END;
    } else {
      timing.gridEnd = ANIM.desktopPeelEnd;
      timing.slottingStart = DESKTOP_SLOTTING_START;
      timing.slottingDuration = ANIM.desktopSlottingDuration;
      timing.postRevealScrollDistance = cachedDeskPostRevealNeeded;
      timing.settleScrollStart = ANIM.desktopPeelEnd;
    }
  }

  function getDeskGridScale() {
    if (frame.isMobile) return 1.0;
    if (frame.isTablet) {
      const colFit = (viewportWidth * CARD_COLUMN_GAP_RATIO * cardGridLayout.columnSpread - 24)
        / (CARD_WIDTH * ANIM.cardScaleDesktop);
      const rowFit = (viewportHeight * cardGridLayout.rowGap - 24)
        / (ROW_METRIC_HEIGHT * ANIM.cardScaleDesktop);
      return Math.max(0.45, Math.min(1.0, Math.min(colFit, rowFit)));
    }
    return Math.max(
      0.75,
      Math.min(1.0, 0.75 + (0.25 * (viewportWidth - 768)) / (1440 - 768)),
    );
  }

  // Per-frame mockup geometry — shared across all 8 cards in the slotting phase.
  // Per-card slot derivation happens in get*MockupCardSlot using these frame values.
  function getMobileMockupFrame() {
    const chromeLeft = (viewportWidth - ACROBAT_MOBILE_MOCKUP_WIDTH) / 2;
    const chromeTop = mobileAcrobatMockupRestTop
      || (viewportHeight - ACROBAT_MOBILE_MOCKUP_HEIGHT) / 2;
    const canvasTop = chromeTop + ACROBAT_MOBILE_MOCKUP_TOP_BAR_HEIGHT;
    const canvasHeight = ACROBAT_MOBILE_MOCKUP_HEIGHT
      - ACROBAT_MOBILE_MOCKUP_TOP_BAR_HEIGHT
      - ACROBAT_MOBILE_MOCKUP_BOTTOM_BAR_HEIGHT;
    const labelStripHeight = ACROBAT_MOBILE_CARD_LABEL_GAP + ACROBAT_MOBILE_CARD_LABEL_HEIGHT;
    const availableSlotHeight = canvasHeight
      - ACROBAT_MOBILE_MOCKUP_TOP_PADDING
      - ACROBAT_MOBILE_MOCKUP_BOTTOM_PADDING
      - (ACROBAT_MOBILE_SLOT_ROW_COUNT - 1) * ACROBAT_MOBILE_SLOT_ROW_GAP
      - ACROBAT_MOBILE_SLOT_ROW_COUNT * labelStripHeight;
    const tallSlotH = Math.floor(availableSlotHeight / ACROBAT_MOBILE_SLOT_ROW_COUNT);
    const cardSlotScale = tallSlotH / ROW_METRIC_HEIGHT;
    const slotWidth = Math.round(CARD_WIDTH * cardSlotScale);
    const slotGridLeft = chromeLeft
      + (ACROBAT_MOBILE_MOCKUP_WIDTH - 2 * slotWidth - ACROBAT_MOBILE_SLOT_COLUMN_GAP) / 2;
    const rowPitch = tallSlotH + labelStripHeight + ACROBAT_MOBILE_SLOT_ROW_GAP;
    const firstRowCenterY = canvasTop + ACROBAT_MOBILE_MOCKUP_TOP_PADDING + tallSlotH / 2 + 30;
    return { slotWidth, cardSlotScale, slotGridLeft, rowPitch, firstRowCenterY };
  }

  function getDesktopMockupFrame() {
    const mockupWidth = getAcrobatDesktopMockupWidth(viewportWidth, frame.isTablet);
    const mockupLeft = (viewportWidth - mockupWidth) / 2;
    const mockupTop = cachedAcrobatWinTop;
    const scale = mockupWidth / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH;
    const slotWidth = ACROBAT_DESKTOP_SLOT_WIDTH * scale;
    return { mockupLeft, mockupTop, scale, slotWidth };
  }

  function getMobileMockupCardSlot(card, mockupFrame) {
    const width = mockupFrame.slotWidth;
    const height = Math.round(card.baseHeight * mockupFrame.cardSlotScale);
    const centerY = mockupFrame.firstRowCenterY + card.mobileRowIdx * mockupFrame.rowPitch;
    const x = mockupFrame.slotGridLeft
      + card.mobileColIdx * (width + ACROBAT_MOBILE_SLOT_COLUMN_GAP);
    return { x, y: centerY - height / 2, width, height };
  }

  function getDesktopMockupCardSlot(card, mockupFrame) {
    const width = mockupFrame.slotWidth;
    const height = card.height * (width / CARD_WIDTH);
    return {
      x: mockupFrame.mockupLeft
        + ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN[card.colIdx] * mockupFrame.scale
        - width / 2,
      y: mockupFrame.mockupTop
        + ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW[card.rowIdx] * mockupFrame.scale
        - height / 2,
      width,
      height,
    };
  }

  function positionCards() {
    if (frame.isMobile) {
      const { mobileLayout } = frame;
      const gridW = mobileLayout.cardW * 2 + MOBILE_COL_GAP;
      const gridLeft = Math.max(MOBILE_OUTER_MARGIN, Math.round((viewportWidth - gridW) / 2));
      const firstRowCenterY = viewportHeight * 0.50 + mobileLayout.tallH / 2;
      sceneCards.forEach((card) => {
        if (card.mobileHidden) {
          // Park hidden mobile cards far off-screen so canvas anchors don't influence dots.
          card.baseX = -9999;
          card.baseY = -9999;
          return;
        }
        const centerX = gridLeft
            + card.mobileColIdx * (mobileLayout.cardW + MOBILE_COL_GAP)
            + mobileLayout.cardW / 2;
        const centerY = firstRowCenterY + card.mobileRowIdx * mobileLayout.rowPitch;
        card.baseX = centerX - card.width / 2;
        card.baseY = centerY - card.height / 2;
      });
      return;
    }
    const rowAnchor = -0.2 + 0.7 * phase.arcToGrid;
    sceneCards.forEach((card) => {
      const centerX = getDeskCardCenterX(
        viewportWidth,
        card.colIdx,
        cardGridLayout.columnSpread,
      );
      const centerY = viewportHeight * (0.5 + (card.rowIdx - rowAnchor) * cardGridLayout.rowGap);
      card.baseX = centerX - card.width / 2;
      card.baseY = centerY - card.height / 2;
    });
  }

  function getCanvasCardCenter(card) {
    return {
      x: Number.isFinite(card.visualCx) ? card.visualCx : card.baseX + card.width / 2,
      y: Number.isFinite(card.visualCy) ? card.visualCy : card.baseY + card.height / 2,
    };
  }

  const canvasGrid = createCanvasGrid(canvas, {
    isMobile: BREAKPOINTS.mobile,
    getViewport: () => ({ width: viewportWidth, height: viewportHeight }),
    getCards: () => sceneCards,
    getCardCenter: getCanvasCardCenter,
    getState: () => ({ arcToGridProgress: phase.arcToGrid }),
  });

  function resize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    refreshFrameProfile();
    canvasGrid.resize();
    // Mobile uses the responsive layout; desktop/tablet use authored card dimensions.
    if (frame.isMobile) {
      const { mobileLayout } = frame;
      sceneCards.forEach((card) => {
        card.width = mobileLayout.cardW;
        card.height = Math.round(card.baseHeight * mobileLayout.scale);
        card.el.style.width = `${card.width}px`;
        card.el.style.height = `${card.height}px`;
      });
    } else {
      sceneCards.forEach((card) => {
        card.width = CARD_WIDTH;
        card.height = card.baseHeight;
        card.el.style.width = `${card.width}px`;
        card.el.style.height = `${card.height}px`;
      });
    }
    arcAngle = frame.isMobile ? ANIM.mobileArcAlpha : Math.atan2(viewportHeight, viewportWidth);
    cachedHeadlineH = titleEl?.offsetHeight || 80;
    if (frame.isMobile) {
      const headlineRestY = viewportHeight * ANIM.mobileHeadlineY;
      const chromeRestY = headlineRestY + cachedHeadlineH + 24;
      titleEl.style.top = `${headlineRestY}px`;
      const ctaRestY = chromeRestY + ACROBAT_MOBILE_MOCKUP_HEIGHT + 24;
      ctaEl.style.top = `${ctaRestY}px`;
      const ctaH = ctaEl.offsetHeight || 40;
      const mobilePostRevealNeeded = Math.max(0, ctaRestY + ctaH + 20 - viewportHeight);
      cachedMobilePostRevealDistance = mobilePostRevealNeeded > 0
        ? ANIM.mobilePostRevealScroll : 0;
    }
    cachedTextBlockWidth = textBlockEl.offsetWidth;
    positionCards();
    cachedBlockDocTop = el.getBoundingClientRect().top + window.scrollY;
    cachedBlockHeight = el.offsetHeight;
    if (!frame.isMobile && desktopMockupEl) {
      const aW = getAcrobatDesktopMockupWidth(viewportWidth, frame.isTablet);
      const aH = aW * (ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH);
      const ctaH = ctaEl.offsetHeight || 40;
      const stackH = cachedHeadlineH + ACROBAT_DESKTOP_GAP_ABOVE
        + aH + ACROBAT_DESKTOP_GAP_BELOW + ctaH;
      const centeredTop = Math.max(48, (viewportHeight - stackH) / 2);
      const peekWinTop = viewportHeight - ANIM.desktopPeekAmount * aH;
      const peekStackTop = peekWinTop - cachedHeadlineH - ACROBAT_DESKTOP_GAP_ABOVE;
      const peekRange = ANIM.desktopPeekStartH - viewportHeight;
      const peekBlend = Math.max(0, Math.min(1, peekRange / 320));
      const stackTop = centeredTop + peekBlend * (peekStackTop - centeredTop);
      cachedAcrobatWinTop = stackTop + cachedHeadlineH + ACROBAT_DESKTOP_GAP_ABOVE;
      cachedAcrobatCtaTop = cachedAcrobatWinTop + aH + ACROBAT_DESKTOP_GAP_BELOW;
      cachedDeskPostRevealNeeded = Math.max(0, cachedAcrobatCtaTop + ctaH + 20 - viewportHeight);
      titleEl.style.top = `${stackTop}px`;
      desktopMockupEl.style.top = `${cachedAcrobatWinTop}px`;
      ctaEl.style.top = `${cachedAcrobatCtaTop}px`;
      verticalPan.deskPostRevealY = 0;
    }
  }

  function setLabelPos(card, centerX, centerY, scale, opacity) {
    if (!card.labelEl) return;
    if (opacity <= 0) {
      card.labelEl.style.opacity = '0';
      return;
    }
    card.labelEl.style.transform = `translate(${centerX - (card.width / 2) * scale}px,${centerY + (card.height / 2) * scale + 4}px) scale(${scale})`;
    card.labelEl.style.opacity = opacity.toFixed(3);
  }

  // ──────────────────── Card phase renderers ────────────────────
  function hideMobileCard(card) {
    card.el.style.opacity = '0';
    card.el.style.pointerEvents = 'none';
    if (card.labelEl) card.labelEl.style.opacity = '0';
  }

  // Arc rotation + peel onto the grid.
  function renderArcPeelToGrid(card, cardScale, deskGridScale) {
    const cardPeelProgress = getCardArcToGridProgress(card);
    const fanPos = getFanCenter(card);
    const { arcZoom } = arcGeometry;
    const fanDepth = 1 - (card.fanIdx / FAN_LAST_INDEX) * ANIM.arcFanDepthDelta;
    const fanScale = cardScale * (1 + ANIM.arcLiftZoom) * fanDepth * arcZoom;

    const gridCenterX = card.baseX + card.width / 2;
    const gridCenterY = card.baseY + card.height / 2 - verticalPan.arcGridY;

    const arcLocalDelay = (card.fanIdx / FAN_LAST_INDEX) * ANIM.arcStagger;
    const arcLocalWin = Math.max(0.01, 1 - ANIM.arcStagger);
    const cardArcPushProgress = clamp01((phase.arcPan - arcLocalDelay) / arcLocalWin);
    const cardArcPushEase = easeInOutCubic(cardArcPushProgress);

    const pushedX = fanPos.x + fanPos.rx * ANIM.arcPushDistance * cardArcPushEase;
    const pushedY = fanPos.y + fanPos.ry * ANIM.arcPushDistance * cardArcPushEase;

    const totalPeelEase = easeOutCubic(cardPeelProgress);
    const currentX = pushedX + (gridCenterX - pushedX) * totalPeelEase;
    const currentY = pushedY + (gridCenterY - pushedY) * totalPeelEase;
    const scale = fanScale + (cardScale * deskGridScale - fanScale) * totalPeelEase;
    const rotation = fanPos.rot * (1 - totalPeelEase);

    // Per-card slide-in: X offset from right + scale ramp + opacity fade. The
    // sense of continuous rotation through pre-pin comes from arcPrePinRatio
    // (in updateAnimationProgress), not from a Y offset here.
    const slideStaggerFrac = (1 - card.fanIdx / FAN_LAST_INDEX) * ANIM.slideStagger;
    const cardSlideT = clamp01((phase.slideT - slideStaggerFrac) / (1 - slideStaggerFrac));
    const slideE = easeOutSine(cardSlideT);
    const slideX = viewportWidth
      * (ANIM.slideStartX + (1 - card.fanIdx / FAN_LAST_INDEX) * ANIM.slideStaggerX)
      * (1 - slideE);
    const slideScaleMul = ANIM.slideScaleStart + (1 - ANIM.slideScaleStart) * slideE;

    card.visualCx = currentX + slideX;
    card.visualCy = currentY;

    const isPeeling = cardPeelProgress > 0.01;
    if (cardPeelProgress < 0.995) {
      const zBase = isPeeling ? 32 : 20;
      const zIndex = String(zBase + (FAN_LAST_INDEX - card.fanIdx));
      if (zIndex !== card.lastZIndex) {
        card.lastZIndex = zIndex;
        card.el.style.zIndex = zIndex;
      }
    } else if (card.lastZIndex !== '') {
      card.lastZIndex = '';
      card.el.style.zIndex = '';
    }

    const tiltFactor = Math.max(0, 1 - phase.arcToGrid / 0.12);
    const screenYNorm = (fanPos.y - viewportHeight / 2) / (viewportHeight / 2);
    const cardYTilt = screenYNorm * ANIM.arcYTilt * tiltFactor;
    const cardXTilt = -screenYNorm * ANIM.arcXTilt * tiltFactor;

    setCardTransform(card.el, {
      translateX: currentX + slideX - card.width / 2,
      translateY: currentY - card.height / 2,
      scale: scale * slideScaleMul,
      rotation,
      tiltX: cardXTilt,
      tiltY: cardYTilt,
    });
    card.el.style.opacity = Math.min(1, cardSlideT / ANIM.slideOpacityRampTo).toFixed(3);
    const shadowAlpha = ANIM.arcShadowAlpha * (1 - cardPeelProgress);
    const shadowAlphaKey = shadowAlpha.toFixed(3);
    if (shadowAlphaKey !== card.lastArcShadowAlphaKey) {
      card.lastArcShadowAlphaKey = shadowAlphaKey;
      card.el.style.boxShadow = arcCardShadow(shadowAlpha);
    }
    const peelReveal = clamp01((cardPeelProgress - 0.8) / 0.2);
    setLabelPos(card, currentX, currentY, scale, peelReveal);
  }

  // Final glide from on-grid position into its slot in the Acrobat mockup.
  function renderGridToSlot(card, cardScale, deskGridScale, mockupFrame) {
    const cardSlot = frame.isMobile
      ? getMobileMockupCardSlot(card, mockupFrame)
      : getDesktopMockupCardSlot(card, mockupFrame);
    const endCenterX = cardSlot.x + cardSlot.width / 2;
    const endCenterY = cardSlot.y + cardSlot.height / 2
      - (frame.isMobile ? verticalPan.mobilePostRevealY : verticalPan.deskPostRevealY);
    const endScale = cardSlot.width / card.width;

    const startCenterX = card.baseX + card.width / 2;
    const startCenterY = card.baseY + card.height / 2 - verticalPan.arcGridY;

    const slottingEaseProgress = easeInOutSine(phase.slotting);
    const centerX = startCenterX + (endCenterX - startCenterX) * slottingEaseProgress;
    const centerY = startCenterY + (endCenterY - startCenterY) * slottingEaseProgress;
    const startScale = cardScale * deskGridScale;
    const scale = startScale + (endScale - startScale) * slottingEaseProgress;
    card.visualCx = centerX;
    card.visualCy = centerY;

    setCardTransform(card.el, {
      translateX: centerX - card.width / 2,
      translateY: centerY - card.height / 2,
      scale,
    });
    card.el.style.opacity = 1;
    card.el.style.boxShadow = '';
    card.el.style.zIndex = '';
    setLabelPos(card, centerX, centerY, scale, Math.max(0, 1 - phase.slotting * 2));
  }

  // Card rendering: 3-branch state machine — exactly one branch runs per card per frame.
  function updateCardPositions() {
    const cardScale = frame.isMobile ? 1.0 : ANIM.cardScaleDesktop;
    const inArcPeel = phase.arcToGrid < 1 && phase.slotting <= 0;
    // Frame-level values shared across cards — compute once per frame, not per card.
    const deskGridScale = getDeskGridScale();
    let mockupFrame = null;
    if (!inArcPeel) {
      mockupFrame = frame.isMobile ? getMobileMockupFrame() : getDesktopMockupFrame();
    }
    sceneCards.forEach((card) => {
      if (frame.isMobile && card.mobileHidden) {
        hideMobileCard(card);
        return;
      }
      if (inArcPeel) renderArcPeelToGrid(card, cardScale, deskGridScale);
      else renderGridToSlot(card, cardScale, deskGridScale, mockupFrame);
    });
  }

  // ──────────────────── Per-frame loop phases ────────────────────

  function readScrollProgress() {
    const blockTop = cachedBlockDocTop - window.scrollY;
    const panRange = Math.max(1, cachedBlockHeight - window.innerHeight);
    return clamp01(-blockTop / panRange);
  }

  function updateAnimationProgress() {
    const animScrollTotal = timing.slottingStart + timing.slottingDuration
      + timing.postRevealScrollDistance;
    scrollTimeline.current = readScrollProgress() * animScrollTotal;

    const blockTop = cachedBlockDocTop - window.scrollY;
    const slideEarly = viewportHeight * 1.0;
    // Clamp blockTop ≥ 0 so prePinContrib holds at slideEarly post-pin instead of
    // growing further. Without this, slideT velocity doubles at scroll=0.
    const prePinContrib = Math.max(0, slideEarly - Math.max(0, blockTop));
    const slideScroll = scrollTimeline.current + prePinContrib;
    phase.slideT = clamp01(slideScroll / (slideEarly + ANIM.slideOverlap));

    // Mix prePinContrib into arcPan so rotation runs continuously through
    // slide-in — eliminates the "translation → rotation" snap at the pin moment.
    const arcScroll = scrollTimeline.current + prePinContrib * ANIM.arcPrePinRatio;
    phase.arcPan = clamp01(arcScroll / ANIM.arcPanEnd);
    const rawArcToGridProgress = (scrollTimeline.current - PEEL_START_SCROLL)
      / (timing.gridEnd - PEEL_START_SCROLL);
    phase.arcToGrid = clamp01(rawArcToGridProgress);
    const rawSlottingProgress = (scrollTimeline.current - timing.slottingStart)
      / timing.slottingDuration;
    phase.slotting = clamp01(rawSlottingProgress);
  }

  let arcTextPanProgressCached = 0;

  // Writes per-frame transform/opacity scalars to CSS custom properties on the stage.
  // The actual transform and opacity declarations live in CSS — see .acrobat-* rules.
  function updateMockupAndTitleTransform() {
    const slottingEase = easeInOutSine(phase.slotting);

    const rawTitleMotionProgress = (scrollTimeline.current - timing.slottingStart)
      / (timing.slottingDuration + 350);
    const titleMotionProgress = clamp01(rawTitleMotionProgress);
    const titleSlide = easeOutCubic(titleMotionProgress);
    const titleOpacity = titleSlide;

    // Post-mockup reveal pan — mobile only, pans the Acrobat UI up to reveal the CTA.
    const postRevealProgress = timing.postRevealScrollDistance
      ? clamp01(
        (scrollTimeline.current - (timing.slottingStart + timing.slottingDuration))
          / timing.postRevealScrollDistance,
      )
      : 0;

    if (frame.isMobile) {
      const mobileScaleDelta = ANIM.mobileMockupStartScale - ANIM.mobileMockupEndScale;
      const mobileScale = ANIM.mobileMockupStartScale - mobileScaleDelta * slottingEase;
      const mobileTopOverhang = (mobileScaleDelta / 2) * ACROBAT_MOBILE_MOCKUP_HEIGHT;
      const mobileOffscreen = viewportHeight + mobileTopOverhang + 30;
      const slideOffset = (1 - slottingEase) * mobileOffscreen;
      const headlineRestY = viewportHeight * ANIM.mobileHeadlineY;
      const liveHeadlineH = titleEl.offsetHeight || cachedHeadlineH;
      const chromeRestY = headlineRestY + liveHeadlineH + 24;
      mobileAcrobatMockupRestTop = chromeRestY;
      const ctaRestY = chromeRestY + ACROBAT_MOBILE_MOCKUP_HEIGHT + 24;
      const postRevealNeeded = Math.max(0, ctaRestY + 60 - viewportHeight);
      const postRevealPanY = ((easeOutSine(postRevealProgress) + postRevealProgress) / 2)
        * postRevealNeeded;
      verticalPan.mobilePostRevealY = postRevealPanY;
      stage.style.setProperty('--mockup-y', `${chromeRestY + slideOffset - postRevealPanY}px`);
      stage.style.setProperty('--mockup-scale', mobileScale);
      stage.style.setProperty('--title-y', `${slideOffset - postRevealPanY}px`);
      stage.style.setProperty('--title-scale', 1);
      stage.style.setProperty('--title-opacity', titleOpacity);
      stage.style.setProperty('--cta-y', `${slideOffset - postRevealPanY}px`);
    } else {
      verticalPan.mobilePostRevealY = 0;
      const acrobatWidth = getAcrobatDesktopMockupWidth(viewportWidth, frame.isTablet);
      const mockupHeight = acrobatWidth
        * (ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH);
      const desktopScaleDelta = ANIM.desktopMockupStartScale
        - ANIM.desktopMockupEndScale;
      const topOverhang = (desktopScaleDelta / 2) * mockupHeight;
      const offscreenY = viewportHeight + topOverhang + 30;
      const mockupTranslateY = (1 - slottingEase) * offscreenY;
      const mockupScale = ANIM.desktopMockupStartScale - desktopScaleDelta * slottingEase;
      const titleScale = 0.92 + 0.08 * titleSlide;
      const deskRevealTarget = cachedDeskPostRevealNeeded
        ? easeOutSine(postRevealProgress) * cachedDeskPostRevealNeeded
        : 0;
      verticalPan.deskPostRevealY = deskRevealTarget;
      const panY = deskRevealTarget;
      stage.style.setProperty('--mockup-y', `${mockupTranslateY - panY}px`);
      stage.style.setProperty('--mockup-scale', mockupScale);
      stage.style.setProperty('--title-y', `${mockupTranslateY - panY}px`);
      stage.style.setProperty('--title-scale', titleScale);
      stage.style.setProperty('--title-opacity', titleOpacity);
      stage.style.setProperty('--cta-y', `${mockupTranslateY - panY}px`);
      const ctaVisiblePx = viewportHeight - cachedAcrobatCtaTop + panY;
      ctaEl.style.opacity = Math.max(0, Math.min(1, ctaVisiblePx / 60)).toFixed(3);
      if (desktopPanelEl) {
        const media = desktopPanelEl.querySelector('picture');
        const panelRevealT = clamp01((phase.slotting - 0.6) / 0.4);
        const panelEase = easeOutCubic(panelRevealT);
        media.style.transform = `translateX(${((1 - panelEase) * 100).toFixed(2)}%)`;
      }
    }
  }

  // ADBE logo flourish — draws from start → fully complete just as mockup transition begins.
  // Mobile: delayed to 85% through peel so it doesn't draw during arc/peel.
  function updateAdbeLogo() {
    const adbeLogoPeelStart = frame.isMobile
      ? PEEL_START_SCROLL + (MOBILE_GRID_END - PEEL_START_SCROLL) * 0.85
      : PEEL_START_SCROLL;
    const adbeLogoSpan = timing.slottingStart - adbeLogoPeelStart;
    const rawAdbeLogoProgress = (scrollTimeline.current - adbeLogoPeelStart) / adbeLogoSpan;
    const adbeLogoProgress = clamp01(rawAdbeLogoProgress);
    const adbeLogoDrawProgress = easeInOutSine(adbeLogoProgress);
    const adbeLogoFadeIn = clamp01(adbeLogoProgress * 6);
    const adbeLogoFadeOut = 1 - clamp01((phase.slotting - 0.4) / 0.3);
    stage.style.setProperty('--adbe-draw', adbeLogoDrawProgress);
    stage.style.setProperty('--adbe-opacity', adbeLogoFadeIn * adbeLogoFadeOut);
  }

  function updateCompressionAndPan() {
    arcTextPanProgressCached = clamp01(
      (scrollTimeline.current - timing.settleScrollStart) / ANIM.arcSettleDuration,
    );
    const compressedColGapPx = viewportWidth * CARD_COLUMN_GAP_RATIO * ANIM.columnCompressionTarget
      - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + ROW_METRIC_HEIGHT + LABEL_CLEARANCE)
      / viewportHeight;
    const postPeelEase = easeOutSine(arcTextPanProgressCached);
    const slottingCompression = easeInOutSine(phase.slotting);
    cardGridLayout.columnSpread = ANIM.baseColumnSpread
      + (ANIM.columnCompressionTarget - ANIM.baseColumnSpread) * phase.arcToGrid
      - 0.15 * postPeelEase - 0.15 * slottingCompression;
    cardGridLayout.rowGap = ANIM.baseRowGap
      + (compressedRowGap - ANIM.baseRowGap) * phase.arcToGrid
      - 0.04 * postPeelEase - 0.04 * slottingCompression;
    const textAtRestY = viewportHeight * (0.5 + 0.5 * compressedRowGap)
      + ROW_METRIC_HEIGHT / 2
      + 90;
    const arcPanTarget = Math.max(0, textAtRestY - viewportHeight * 0.70);
    verticalPan.arcGridY = arcPanTarget * easeOutSine(arcTextPanProgressCached);
    if (frame.isMobile) {
      const { mobileLayout } = frame;
      const mobileRow1CenterY = viewportHeight * 0.50
        + mobileLayout.tallH / 2 + mobileLayout.rowPitch;
      const mobileTextBaseY = mobileRow1CenterY + mobileLayout.tallH / 2
        + TEXT_BLOCK_BELOW_CARD_OFFSET;
      const mobileTextTarget = Math.max(0, mobileTextBaseY - viewportHeight * 0.65);
      const mobilePanProgress = clamp01((scrollTimeline.current - MOBILE_PAN_START) / 900);
      verticalPan.arcGridY = mobileTextTarget * easeOutSine(mobilePanProgress);
    }
  }

  function updateTextBlock() {
    const textEase = easeInOutSine(phase.slotting);
    const textScaleDuringSlotting = 1 - 0.28 * textEase;
    const deskGridScaleForText = getDeskGridScale();
    const halfCardOnGrid = (CARD_WIDTH / 2) * ANIM.cardScaleDesktop * deskGridScaleForText;
    const col3Right = getDeskCardCenterX(viewportWidth, 3, ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      + halfCardOnGrid;
    const col0VisualLeft = getDeskCardCenterX(viewportWidth, 0, ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      - halfCardOnGrid;
    const arcTextFadeProgress = frame.isMobile
      ? clamp01((phase.slotting - 0.4) / 0.3)
      : clamp01((phase.slotting - 0.55) / 0.15);
    const arcFinalScale = frame.isMobile
      ? textScaleDuringSlotting
      : textScaleDuringSlotting * (1 - 0.15 * easeInOutSine(arcTextFadeProgress));
    let pinnedTextY;
    let textLeft;
    if (frame.isMobile) {
      const { mobileLayout } = frame;
      const row1CenterY = viewportHeight * 0.50
        + mobileLayout.tallH / 2 + mobileLayout.rowPitch;
      pinnedTextY = row1CenterY - verticalPan.arcGridY
        + mobileLayout.tallH / 2 + TEXT_BLOCK_BELOW_CARD_OFFSET;
      const gridW = mobileLayout.cardW * 2 + MOBILE_COL_GAP;
      textLeft = Math.max(
        MOBILE_OUTER_MARGIN,
        Math.round((viewportWidth - gridW) / 2),
      );
    } else {
      textLeft = frame.isTablet
        ? col0VisualLeft
        : col3Right - cachedTextBlockWidth;
      pinnedTextY = viewportHeight * (0.5 + 0.5 * cardGridLayout.rowGap)
        + ROW_METRIC_HEIGHT / 2
        + 37
        + viewportHeight * 0.036
        - verticalPan.arcGridY;
    }
    const arcReveal = frame.isMobile
      ? clamp01((phase.arcToGrid - 0.1) / 0.3)
      : clamp01(arcTextPanProgressCached * 2);
    const textOpacity = Math.max(0, 1 - arcTextFadeProgress) * arcReveal;
    textBlockEl.style.transform = `translate(${textLeft}px,${pinnedTextY}px) scale(${arcFinalScale})`;
    textBlockEl.style.opacity = textOpacity;
  }

  // ──────────────────── Debug overlay (?dotgriddebug) ────────────────────
  // Lazily loaded from dot-grid-debug.js only when ?dotgriddebug is set.
  let debug = null;
  if (new URLSearchParams(window.location.search).has('dotgriddebug')) {
    import('./dot-grid-debug.js').then(({ default: createDebugOverlay }) => {
      debug = createDebugOverlay(() => {
        const c = scrollTimeline.current;
        let stageLabel = 'done';
        if (c < PEEL_START_SCROLL) stageLabel = 'arc-pan';
        else if (c < timing.gridEnd) stageLabel = 'peel';
        else if (c < timing.slottingStart) stageLabel = 'settle';
        else if (c < timing.slottingStart + timing.slottingDuration) stageLabel = 'slotting';
        else if (timing.postRevealScrollDistance > 0) stageLabel = 'post-reveal';
        let breakpoint = 'desktop';
        if (frame.isMobile) breakpoint = 'mobile';
        else if (frame.isTablet) breakpoint = 'tablet';
        return {
          stage: stageLabel,
          breakpoint,
          viewportWidth,
          viewportHeight,
          scrollCurrent: c,
          animTotal: timing.slottingStart + timing.slottingDuration
            + timing.postRevealScrollDistance,
          phase,
          settle: arcTextPanProgressCached,
          peelStartScroll: PEEL_START_SCROLL,
          gridEnd: timing.gridEnd,
          slottingStart: timing.slottingStart,
          slottingDuration: timing.slottingDuration,
          columnSpread: cardGridLayout.columnSpread,
          rowGap: cardGridLayout.rowGap,
          arcGridY: verticalPan.arcGridY,
          postRevealY: frame.isMobile
            ? verticalPan.mobilePostRevealY
            : verticalPan.deskPostRevealY,
          blockHeight: el.offsetHeight,
        };
      });
    });
  }

  // ──────────────────── Render loop ────────────────────
  let rafId = 0;
  let running = false;

  function loop() {
    if (!running) return;

    refreshFrameProfile();
    updateAnimationProgress();
    buildArcCtx();
    updateMockupAndTitleTransform();
    updateAdbeLogo();
    updateCompressionAndPan();
    updateTextBlock();
    positionCards();
    canvasGrid.update();
    canvasGrid.draw();
    updateCardPositions();
    debug?.update();
    rafId = requestAnimationFrame(loop);
  }

  // ──────────────────── Bootstrap ────────────────────
  const onResize = debounce(resize, 120);
  window.addEventListener('resize', onResize);

  resize();

  (function prewarmCardTextures() {
    sceneCards.forEach((card) => {
      card.el.querySelector('img')?.decode?.().catch(() => {});
    });
    stage.querySelectorAll('.acrobat-desktop-mockup img, .acrobat-mobile-mockup img').forEach((img) => {
      img.decode?.().catch(() => {});
    });
  }());

  const startLoop = () => {
    if (running) return;
    running = true;
    loop();
  };
  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      resize();
      startLoop();
    } else {
      stopLoop();
    }
  }, { rootMargin: '200px 0px' });
  io.observe(el);

  // Watch only el's immediate parent for childList changes — a document.body
  // subtree observer would fire on every DOM mutation across the page.
  const removalObserver = new MutationObserver((_, observer) => {
    if (document.contains(el)) return;
    stopLoop();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    canvasGrid.destroy();
    debug?.destroy();
    observer.disconnect();
  });
  if (el.parentElement) {
    removalObserver.observe(el.parentElement, { childList: true });
  }

  return el;
}
