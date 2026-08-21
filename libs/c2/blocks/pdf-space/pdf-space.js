import { createTag } from '../../../utils/utils.js';
import { debounce } from '../../../utils/action.js';

// Scroll-driven animation: arc → peel → settle → slotting -> potential postReveal. See README.md

// Keep these breakpoints in sync with the matching MQ ranges in pdf-space.css.
const BREAKPOINTS = {
  mobile: window.matchMedia('(max-width: 767px)'),
  tablet: window.matchMedia('(min-width: 768px) and (max-width: 1279px)'),
};

const CARD_COLUMN_OFFSETS_RATIO = [-0.462, -0.154, 0.154, 0.462];
const CARD_COLUMN_GAP_RATIO = CARD_COLUMN_OFFSETS_RATIO[1] - CARD_COLUMN_OFFSETS_RATIO[0];
const CARD_WIDTH = 192;
const DEFAULT_CARD_HEIGHT = 230;
const FAN_COUNT = 8;
const FAN_LAST_INDEX = FAN_COUNT - 1;
/** Row pitch / compression math uses this tallest-card metric. */
const ROW_METRIC_HEIGHT = 264;
const LABEL_CLEARANCE = 28;
const OFFSCREEN_SENTINEL = -9999;
// Animation tunables. See README.md
const ANIM_CONFIG = {
  // Phase scroll boundaries (desktop)
  peelStartScroll: 535,
  desktopPeelEnd: 1532,
  arcSettleDuration: 1600,
  desktopSlottingDuration: 1420,

  // Arc rotation feel
  arcPanEnd: 1350,
  arcSweepMultiplier: 1,
  arcSpan: 0.80,
  arcStagger: 0.50,
  arcLiftZoom: 1.00,
  arcFanDepthDelta: 0.30,
  arcYTilt: 25,
  arcXTilt: 10,
  arcPushDistance: 60,
  arcShadowAlpha: 0.15,
  arcCwStart: 0.6,
  // Vertical bias of the arc apex as a fraction of vh. Card 7 (top of arc)
  // rests at viewport y = vh * (0.5 - arcApexLift). 0 = centered, 0.1 = 10%
  // above center.
  arcApexLift: 0.10,
  // Uniform downward Y translation applied during pre-pin, decaying to 0 by
  // the time the block is fully pinned. Lets cards rise into their orbital
  // position from below — keeps short viewports from clipping the lifted
  // apex without lowering the at-rest arcApexLift. No X component and no
  // per-card stagger, so cards still read as a rotating arc, not a slide.
  prePinSlideY: 0.3,

  // Slide-in opacity & scale ramps
  slideStagger: 0.45,
  slideScaleStart: 0.85,
  slideOverlap: 200,
  slideOpacityRampTo: 0.25,

  // Grid layout (post-peel resting positions)
  baseColumnSpread: 1.20,
  baseRowGap: 0.60,
  columnCompressionTarget: 0.675,
  cardScaleDesktop: 1.035,

  // Mockup positioning (resize-time, not scroll-driven)
  desktopPeekStartH: 960,
  desktopPeekAmount: 0.30,
  mobileHeadlineY: 0.12,

  // Mockup slot-in scale curve (driven by ANIM_STATE.phase.slotting 0 → 1)
  desktopMockupStartScale: 2.5,
  desktopMockupEndScale: 1.0,
  mobileMockupStartScale: 2.0,
  mobileMockupEndScale: 1.0,

  // Mobile-specific timing
  mobileSettleDuration: 468,
  mobileSlottingDuration: 900,
  mobileArcAngle: 0.6,
};

// ── Canvas dot-pattern tunables ───────────────────────────────────────────────
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
/** Full arc→grid scroll span reference; mobile settle timing anchors here. */
const DESKTOP_ARC_REFERENCE_END = ANIM_CONFIG.arcPanEnd + 1000;
const DESKTOP_SLOTTING_START = ANIM_CONFIG.desktopPeelEnd + ANIM_CONFIG.arcSettleDuration;
const MOBILE_GRID_END = Math.round(
  ANIM_CONFIG.peelStartScroll + (DESKTOP_ARC_REFERENCE_END - ANIM_CONFIG.peelStartScroll) * 0.39,
);
const MOBILE_PAN_START = Math.round((ANIM_CONFIG.peelStartScroll + MOBILE_GRID_END) / 2);
/** Mobile text-block pan-up scroll budget (from MOBILE_PAN_START, ending mid-slotting). */
const MOBILE_TEXT_PAN_DURATION = 900;
/** Column spread used to pin marketing text X during arc (settled spread minus post-peel trim). */
const ARC_TEXT_ANCHOR_COLUMN_SPREAD = ANIM_CONFIG.columnCompressionTarget - 0.15;

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
const ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH = 971;
const ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT = 576;
const ACROBAT_DESKTOP_MOCKUP_MAX_WIDTH = 1200;
const ACROBAT_DESKTOP_MOCKUP_TABLET_MIN_WIDTH = 680;
const ACROBAT_DESKTOP_MOCKUP_TABLET_VW = 0.70;
const ACROBAT_DESKTOP_MOCKUP_DESKTOP_VW = 0.686;
const ACROBAT_DESKTOP_SLOT_WIDTH = 134;
const ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN = [129, 284, 439, 594];
const ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW = [187, 393];
const ACROBAT_DESKTOP_GAP_ABOVE = 40;
const ACROBAT_DESKTOP_GAP_BELOW = 40;
const ACROBAT_CTA_HEIGHT = 40;

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
  pointerTarget,
}) {
  const context = canvas.getContext('2d');
  // Last pointer position, in viewport coords (what `e.clientX/Y` gives us).
  const pointerViewport = { x: OFFSCREEN_SENTINEL, y: OFFSCREEN_SENTINEL };
  // Same pointer, translated into canvas-local coords (what the dots use).
  // Recomputed each frame in update() because scroll can move the canvas
  // under a stationary cursor without firing a new mousemove.
  const pointerCanvas = { x: OFFSCREEN_SENTINEL, y: OFFSCREEN_SENTINEL };
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

  function syncPointerCanvas() {
    if (pointerViewport.x === OFFSCREEN_SENTINEL) {
      pointerCanvas.x = OFFSCREEN_SENTINEL;
      pointerCanvas.y = OFFSCREEN_SENTINEL;
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const localX = pointerViewport.x - rect.left;
    const localY = pointerViewport.y - rect.top;
    const inside = localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height;
    pointerCanvas.x = inside ? localX : OFFSCREEN_SENTINEL;
    pointerCanvas.y = inside ? localY : OFFSCREEN_SENTINEL;
  }

  function update() {
    if (isMobile()) return;
    syncPointerCanvas();
    const pointerParked = pointerCanvas.x === OFFSCREEN_SENTINEL;
    if (pointerParked && settled) return;

    const activeCards = getCards();

    let currentMouseRadius = CANVAS.mouseRadius;
    let currentRepelForce = CANVAS.repelForce;
    let boost = 0;
    activeCards.forEach((card) => {
      const { x, y } = getCardCenter(card);
      const dx = pointerCanvas.x - x;
      const dy = pointerCanvas.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 280) boost = Math.max(boost, 1 - dist / 280);
    });
    if (boost > 0) {
      currentMouseRadius = CANVAS.mouseRadius * (1 + boost * 1.5);
      currentRepelForce = CANVAS.repelForce * (1 + boost * 0.8);
    }

    let maxDisturbance = 0;
    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i];
      const deltaX = dot.x - pointerCanvas.x;
      const deltaY = dot.y - pointerCanvas.y;
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
    settled = pointerParked && maxDisturbance < 0.05;
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
    pointerViewport.x = e.clientX;
    pointerViewport.y = e.clientY;
    settled = false;
  };
  const handleMouseLeave = () => {
    pointerViewport.x = OFFSCREEN_SENTINEL;
    pointerViewport.y = OFFSCREEN_SENTINEL;
  };

  pointerTarget.addEventListener('mousemove', handleMouseMove, { passive: true });
  pointerTarget.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  return {
    resize,
    update,
    draw,
    destroy() {
      pointerTarget.removeEventListener('mousemove', handleMouseMove);
      pointerTarget.removeEventListener('mouseleave', handleMouseLeave);
    },
  };
}

function parseAuthoredContent(el) {
  const [imageRow1, imageRow2, textRow, titleRow, mockupRow, ctaRow] = [...el.children];
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

// SceneCard shape and buildCardStack params: see README.md § "Card data model".
function buildCardStack(cardScene, cardDefs) {
  const stackRoot = createTag('div', { class: 'card-stack' });
  cardScene.append(stackRoot);
  return cardDefs.map((def) => {
    const cardEl = def.el;
    cardEl.classList.add('card');
    const cardImg = cardEl.querySelector('img');
    if (cardImg) cardImg.decoding = 'async';
    stackRoot.appendChild(cardEl);
    let labelEl = null;
    if (def.label) {
      labelEl = createTag('div', { class: 'card-label-outer' }, def.label);
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
      lastZIndex: '',
      lastArcShadowAlphaKey: '',
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
<svg class="adbe-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 793 714" fill="none" overflow="visible" aria-hidden="true" focusable="false">
  <path class="adbe-logo-path" d="M772.755 713.494H611.337C604.324 713.622 597.432 711.662 591.536 707.862C585.641 704.063 581.01 698.596 578.231 692.158L402.994 282.541C402.537 280.946 401.577 279.541 400.258 278.534C398.94 277.527 397.331 276.972 395.672 276.95C394.013 276.929 392.391 277.442 391.046 278.414C389.701 279.386 388.706 280.766 388.207 282.348L279 542.424C278.407 543.83 278.172 545.362 278.315 546.882C278.457 548.402 278.974 549.863 279.819 551.134C280.663 552.406 281.809 553.449 283.155 554.171C284.501 554.893 286.004 555.27 287.531 555.27H407.571C411.208 555.27 414.763 556.341 417.795 558.348C420.827 560.356 423.2 563.211 424.618 566.559L477.174 683.481C478.567 686.762 479.125 690.337 478.799 693.886C478.473 697.435 477.273 700.848 475.306 703.821C473.338 706.793 470.665 709.232 467.526 710.92C464.386 712.608 460.876 713.492 457.311 713.494H20.3044C17.0176 713.475 13.7866 712.642 10.8994 711.072C8.01233 709.501 5.5588 707.241 3.75759 704.492C1.95639 701.743 0.863449 698.592 0.576217 695.318C0.288985 692.045 0.816374 688.751 2.11138 685.731L280.081 23.9607C282.922 16.9565 287.809 10.9715 294.105 6.78681C300.401 2.60216 307.812 0.412351 315.372 0.50329H475.697C483.259 0.403187 490.675 2.58926 496.973 6.77504C503.271 10.9608 508.157 16.951 510.991 23.9607L790.885 685.731C792.18 688.746 792.709 692.035 792.426 695.304C792.142 698.573 791.055 701.721 789.261 704.469C787.466 707.216 785.021 709.478 782.141 711.053C779.261 712.627 776.037 713.466 772.755 713.494V713.494Z"/>
</svg>`;

function buildStage(el) {
  const {
    titleEl, cards: cardDefs, textBlockEl, ctaEl,
    mobileMockupImgEl, desktopMockupImgEl, desktopPanelImgEl,
  } = parseAuthoredContent(el);
  // The mockup chrome, dot canvas, and Adobe logo are decorative framing for
  // the animation — hide them from AT so VO+arrow only walks the real content.
  const desktopMockupWrapper = createTag('div', { class: 'acrobat-desktop-mockup', 'aria-hidden': 'true' });
  if (desktopMockupImgEl) desktopMockupWrapper.appendChild(desktopMockupImgEl);
  const desktopPanelWrapper = createTag('div', { class: 'acrobat-desktop-panel' });
  if (desktopPanelImgEl) desktopPanelWrapper.appendChild(desktopPanelImgEl);
  desktopMockupWrapper.appendChild(desktopPanelWrapper);
  const mobileMockupWrapper = createTag('div', { class: 'acrobat-mobile-mockup', 'aria-hidden': 'true' });
  if (mobileMockupImgEl) mobileMockupWrapper.appendChild(mobileMockupImgEl);
  const stage = createTag(
    'div',
    { class: 'pdf-space-stage' },
    `<canvas aria-hidden="true"></canvas>${ADBE_LOGO}`,
  );
  const cardScene = createTag('div', { class: 'card-scene', 'aria-hidden': 'true' });
  const sceneCards = buildCardStack(cardScene, cardDefs);
  titleEl.classList.add('acrobat-title');
  textBlockEl.classList.add('text-block');
  ctaEl.classList.add('acrobat-cta');
  titleEl.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading', 'heading-2');
  textBlockEl.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading', 'heading-6');
  titleEl.querySelector('p')?.classList.add('subcopy', 'body-md');
  textBlockEl.querySelector('p')?.classList.add('subcopy', 'body-md');
  textBlockEl.querySelector('a')?.classList.add('label');
  ctaEl.querySelector('a')?.classList.add('label');

  stage.append(cardScene, textBlockEl, titleEl, ctaEl);
  el.replaceChildren(stage);
  return {
    stage,
    titleEl,
    textBlockEl,
    ctaEl,
    sceneCards,
    desktopMockupWrapper,
    desktopPanelWrapper,
    mobileMockupWrapper,
    canvas: el.querySelector('canvas'),
    adbeLogoPath: el.querySelector('.adbe-logo-path'),
  };
}

// ──────────────────── No-motion static layout ────────────────────
// Slot geometry below mirrors getDesktopMockupCardSlot / getMobileMockupCardSlot,
// but expressed as percentages of the mockup's design box so the slotted card
// clones scale with the responsive mockup without per-frame JS.
function getNoMotionDesktopSlotPct(def) {
  const slotHDesign = ACROBAT_DESKTOP_SLOT_WIDTH * (def.cardHeight / CARD_WIDTH);
  const cx = ACROBAT_DESKTOP_SLOT_CENTER_X_BY_COLUMN[def.colIdx];
  const cy = ACROBAT_DESKTOP_SLOT_CENTER_Y_BY_ROW[def.rowIdx];
  return {
    left: ((cx - ACROBAT_DESKTOP_SLOT_WIDTH / 2) / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH) * 100,
    top: ((cy - slotHDesign / 2) / ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT) * 100,
    width: (ACROBAT_DESKTOP_SLOT_WIDTH / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH) * 100,
    height: (slotHDesign / ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT) * 100,
  };
}

function getNoMotionMobileSlotPct(def) {
  const canvasHeight = ACROBAT_MOBILE_MOCKUP_HEIGHT
    - ACROBAT_MOBILE_MOCKUP_TOP_BAR_HEIGHT
    - ACROBAT_MOBILE_MOCKUP_BOTTOM_BAR_HEIGHT;
  const labelStrip = ACROBAT_MOBILE_CARD_LABEL_GAP + ACROBAT_MOBILE_CARD_LABEL_HEIGHT;
  const availableSlotHeight = canvasHeight
    - ACROBAT_MOBILE_MOCKUP_TOP_PADDING
    - ACROBAT_MOBILE_MOCKUP_BOTTOM_PADDING
    - (ACROBAT_MOBILE_SLOT_ROW_COUNT - 1) * ACROBAT_MOBILE_SLOT_ROW_GAP
    - ACROBAT_MOBILE_SLOT_ROW_COUNT * labelStrip;
  const tallSlotH = Math.floor(availableSlotHeight / ACROBAT_MOBILE_SLOT_ROW_COUNT);
  const cardSlotScale = tallSlotH / ROW_METRIC_HEIGHT;
  const slotWidth = Math.round(CARD_WIDTH * cardSlotScale);
  const slotGridLeft = (ACROBAT_MOBILE_MOCKUP_WIDTH
    - 2 * slotWidth - ACROBAT_MOBILE_SLOT_COLUMN_GAP) / 2;
  const rowPitch = tallSlotH + labelStrip + ACROBAT_MOBILE_SLOT_ROW_GAP;
  const firstRowCenterY = ACROBAT_MOBILE_MOCKUP_TOP_BAR_HEIGHT
    + ACROBAT_MOBILE_MOCKUP_TOP_PADDING + tallSlotH / 2 + 30;
  const height = Math.round(def.cardHeight * cardSlotScale);
  const centerY = firstRowCenterY + def.mobileRowIdx * rowPitch;
  const x = slotGridLeft + def.mobileColIdx * (slotWidth + ACROBAT_MOBILE_SLOT_COLUMN_GAP);
  return {
    left: (x / ACROBAT_MOBILE_MOCKUP_WIDTH) * 100,
    top: ((centerY - height / 2) / ACROBAT_MOBILE_MOCKUP_HEIGHT) * 100,
    width: (slotWidth / ACROBAT_MOBILE_MOCKUP_WIDTH) * 100,
    height: (height / ACROBAT_MOBILE_MOCKUP_HEIGHT) * 100,
  };
}

// Slotted clones are decorative duplicates of the grid figures (same images,
// shown inside the mockup), so they carry no alt and are hidden from AT.
function buildSlottedCard(def, isMobile) {
  const pic = def.el.querySelector('picture') || def.el.querySelector('img');
  if (!pic) return null;
  const slot = isMobile
    ? getNoMotionMobileSlotPct(def)
    : getNoMotionDesktopSlotPct(def);
  const cardEl = createTag('div', { class: 'no-motion-slotted-card', 'aria-hidden': 'true' });
  cardEl.style.left = `${slot.left}%`;
  cardEl.style.top = `${slot.top}%`;
  cardEl.style.width = `${slot.width}%`;
  cardEl.style.height = `${slot.height}%`;
  const picClone = pic.cloneNode(true);
  picClone.querySelector('img')?.setAttribute('alt', '');
  cardEl.appendChild(picClone);
  return cardEl;
}

// Static, non-animated composition for users who prefer reduced motion. Shows
// the resting card grid + marketing copy (settle end-state) above the Acrobat
// mockup with cards slotted in (slotting end-state). Cards are duplicated: the
// grid figures and the slotted clones are separate DOM, since the animated
// version reuses one set of cards across both moments and a static layout needs
// both visible at once.
function buildNoMotion(el) {
  const {
    titleEl, cards: cardDefs, textBlockEl, ctaEl,
    mobileMockupImgEl, desktopMockupImgEl, desktopPanelImgEl,
  } = parseAuthoredContent(el);

  titleEl.classList.add('acrobat-title');
  textBlockEl.classList.add('text-block');
  ctaEl.classList.add('acrobat-cta');
  titleEl.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading', 'heading-2');
  textBlockEl.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading', 'heading-6');
  titleEl.querySelector('p')?.classList.add('subcopy', 'body-md');
  textBlockEl.querySelector('p')?.classList.add('subcopy', 'body-md');
  textBlockEl.querySelector('a')?.classList.add('label');
  ctaEl.querySelector('a')?.classList.add('label');

  // Cards are decorative here too — the text-block is the only real content in
  // this section — so hide the whole grid from AT. With it gone, AT reading
  // order follows the top-down layout: text-block first, then the acrobat
  // heading and CTA in the section below.
  const cardGrid = createTag('div', { class: 'no-motion-card-grid', 'aria-hidden': 'true' });
  cardDefs.forEach((def) => {
    const figure = createTag('figure', { class: `no-motion-card${def.mobileHidden ? ' no-motion-card-desktop-only' : ''}` });
    const pic = def.el.querySelector('picture') || def.el.querySelector('img');
    if (pic) {
      const picClone = pic.cloneNode(true);
      // Aspect-ratio lives on the image box (not the figure) so the label can
      // flow below it, matching the settled motion layout.
      picClone.style.aspectRatio = `${CARD_WIDTH} / ${def.cardHeight}`;
      figure.appendChild(picClone);
    }
    if (def.label) {
      figure.appendChild(createTag('figcaption', { class: 'no-motion-card-label' }, def.label));
    }
    cardGrid.appendChild(figure);
  });
  const gridSection = createTag('div', { class: 'no-motion-grid-section' });
  gridSection.append(cardGrid, textBlockEl);

  const desktopMockup = createTag('div', { class: 'acrobat-desktop-mockup', 'aria-hidden': 'true' });
  if (desktopMockupImgEl) desktopMockup.appendChild(desktopMockupImgEl);
  const desktopPanel = createTag('div', { class: 'acrobat-desktop-panel' });
  if (desktopPanelImgEl) desktopPanel.appendChild(desktopPanelImgEl);
  desktopMockup.appendChild(desktopPanel);
  cardDefs.forEach((def) => {
    const slotted = buildSlottedCard(def, false);
    if (slotted) desktopMockup.appendChild(slotted);
  });

  const mobileMockup = createTag('div', { class: 'acrobat-mobile-mockup', 'aria-hidden': 'true' });
  if (mobileMockupImgEl) mobileMockup.appendChild(mobileMockupImgEl);
  cardDefs.forEach((def) => {
    if (def.mobileHidden) return;
    const slotted = buildSlottedCard(def, true);
    if (slotted) mobileMockup.appendChild(slotted);
  });

  const mockupSection = createTag('div', { class: 'no-motion-mockup-section' });
  mockupSection.append(titleEl, desktopMockup, mobileMockup, ctaEl);

  const stage = createTag('div', { class: 'pdf-space-stage' });
  stage.style.setProperty('--acrobat-mobile-mockup-width', `${ACROBAT_MOBILE_MOCKUP_WIDTH}px`);
  stage.style.setProperty('--acrobat-mobile-mockup-height', `${ACROBAT_MOBILE_MOCKUP_HEIGHT}px`);
  stage.append(gridSection, mockupSection);
  el.replaceChildren(stage);
}

// derivePhases params and return shape: see README.md § "derivePhases".
export function derivePhases(scroll, prePinY, vph, timing) {
  const prePinContrib = Math.max(0, vph - prePinY);
  return {
    slideT: clamp01((scroll + prePinContrib) / (vph + ANIM_CONFIG.slideOverlap)),
    arcPan: clamp01(scroll / ANIM_CONFIG.arcPanEnd),
    arcToGrid: clamp01(
      (scroll - ANIM_CONFIG.peelStartScroll) / (timing.gridEnd - ANIM_CONFIG.peelStartScroll),
    ),
    slotting: clamp01(
      (scroll - timing.slottingStart) / timing.slottingDuration,
    ),
  };
}

function getCardArcToGridProgress(card, arcToGrid) {
  const delay = (card.fanIdx / FAN_LAST_INDEX) * ANIM_CONFIG.arcStagger;
  const win = 1 - ANIM_CONFIG.arcStagger;
  return clamp01((arcToGrid - delay) / win);
}

function getMobileLayout(vw) {
  const t = clamp01((vw - 375) / 392);
  const cardW = Math.round((vw * (0.875 - t * 0.175) - MOBILE_COL_GAP) / 2);
  const scale = cardW / CARD_WIDTH;
  const tallH = Math.round(ROW_METRIC_HEIGHT * scale);
  return { cardW, scale, tallH, rowPitch: tallH + 61 };
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

function getCanvasCardCenter(card) {
  return {
    x: Number.isFinite(card.visualCx) ? card.visualCx : card.baseX + card.width / 2,
    y: Number.isFinite(card.visualCy) ? card.visualCy : card.baseY + card.height / 2,
  };
}

function mountMotion(el) {
  const {
    stage, titleEl, textBlockEl, ctaEl, sceneCards,
    desktopMockupWrapper, desktopPanelWrapper, mobileMockupWrapper,
    canvas, adbeLogoPath,
  } = buildStage(el);
  const desktopMockupEl = desktopMockupWrapper;
  const desktopPanelEl = desktopPanelWrapper;

  const adbeLogoLength = Math.max(adbeLogoPath.getTotalLength(), 3000) * 2 + 500;
  adbeLogoPath.style.strokeDasharray = adbeLogoLength;
  stage.style.setProperty('--adbe-logo-length', adbeLogoLength);
  stage.style.setProperty('--acrobat-mobile-mockup-width', `${ACROBAT_MOBILE_MOCKUP_WIDTH}px`);
  stage.style.setProperty('--acrobat-mobile-mockup-height', `${ACROBAT_MOBILE_MOCKUP_HEIGHT}px`);

  // ──────────────────── Animation state ────────────────────
  let viewportWidth = 0;
  let viewportHeight = 0;
  let scrollCurrent = 0;
  let revealActive = false;
  let revealScrollCurrent = 0;
  let suppressFocusSnap = false;

  const ANIM_STATE = {
    phase: { arcPan: 0, arcToGrid: 0, slotting: 0, slideT: 0 },
    // Scroll offsets (abstract units) where arc/grid/slotting phases begin or how long they run.
    timing: {
      gridEnd: MOBILE_GRID_END,
      slottingStart: MOBILE_GRID_END + ANIM_CONFIG.mobileSettleDuration,
      slottingDuration: ANIM_CONFIG.mobileSlottingDuration,
      postRevealScrollDistance: 0,
      /** Scroll position where post-peel settle compression / text pan begins. */
      settleScrollStart: DESKTOP_ARC_REFERENCE_END,
    },
    cardGridLayout: {
      columnSpread: ANIM_CONFIG.baseColumnSpread,
      rowGap: ANIM_CONFIG.baseRowGap,
    },
    // Vertical pan offsets (px) for cards, text, and mockup during peel→grid and post-reveal.
    verticalPan: { arcGridY: 0, mobilePostRevealY: 0, deskPostRevealY: 0 },
    frame: { isMobile: false, isTablet: false, mobileLayout: null },
  };

  const LAYOUT_CACHE = {
    headlineH: 60,
    acrobatWinTop: 0,
    acrobatCtaTop: 0,
    deskPostRevealNeeded: 0,
    mobilePostRevealDistance: 0,
    navOffset: 120, // hardcoded now until LNAV is finalized. Then we could do DOM measurement
    mobileAcrobatMockupRestTop: 0,
    textBlockWidth: 0,
    blockDocTop: 0,
    blockHeight: 0,
  };

  let arcAngle = Math.atan2(1, 1);
  let arcGeometry = null;
  let prePinOffset = 0;

  // Precompute per-frame arc constants once so getFanCenter doesn't recompute for each card.
  function buildArcCtx() {
    const arcZoom = 1.4 - 0.4 * easeOutCubic(ANIM_STATE.phase.arcToGrid);
    const arcRadius = Math.max(viewportWidth, viewportHeight) * 1.2 * arcZoom;
    const fanCenterX = viewportWidth * 0.5 - arcRadius * Math.sin(arcAngle);
    const fanCenterY = viewportHeight * (0.5 - ANIM_CONFIG.arcApexLift)
      + arcRadius * Math.cos(arcAngle);
    const middleAngle = arcAngle - Math.PI / 2;
    const cwBoost = ANIM_CONFIG.arcCwStart * clamp01(prePinOffset / viewportHeight);
    const rotationOffset = ANIM_CONFIG.arcSpan * 0.5 + cwBoost
      - ANIM_CONFIG.arcSpan * ANIM_CONFIG.arcSweepMultiplier * ANIM_STATE.phase.arcPan;
    const effectiveArcSpan = ANIM_CONFIG.arcSpan * (1 + 0.4 * ANIM_STATE.phase.arcPan);
    const flattenRaw = clamp01((ANIM_STATE.phase.arcToGrid - 0.5) / 0.5);
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

  function refreshFrameProfile() {
    ANIM_STATE.frame.isMobile = BREAKPOINTS.mobile.matches;
    ANIM_STATE.frame.isTablet = !ANIM_STATE.frame.isMobile && BREAKPOINTS.tablet.matches;
    ANIM_STATE.frame.mobileLayout = ANIM_STATE.frame.isMobile
      ? getMobileLayout(viewportWidth) : null;
    if (ANIM_STATE.frame.isMobile) {
      ANIM_STATE.timing.gridEnd = MOBILE_GRID_END;
      ANIM_STATE.timing.slottingStart = MOBILE_GRID_END + ANIM_CONFIG.mobileSettleDuration;
      ANIM_STATE.timing.slottingDuration = ANIM_CONFIG.mobileSlottingDuration;
      ANIM_STATE.timing.postRevealScrollDistance = LAYOUT_CACHE.mobilePostRevealDistance;
      ANIM_STATE.timing.settleScrollStart = DESKTOP_ARC_REFERENCE_END;
    } else {
      ANIM_STATE.timing.gridEnd = ANIM_CONFIG.desktopPeelEnd;
      ANIM_STATE.timing.slottingStart = DESKTOP_SLOTTING_START;
      ANIM_STATE.timing.slottingDuration = ANIM_CONFIG.desktopSlottingDuration;
      ANIM_STATE.timing.postRevealScrollDistance = LAYOUT_CACHE.deskPostRevealNeeded;
      ANIM_STATE.timing.settleScrollStart = ANIM_CONFIG.desktopPeelEnd;
    }
  }

  function getDeskGridScale() {
    if (ANIM_STATE.frame.isMobile) return 1.0;
    if (ANIM_STATE.frame.isTablet) {
      const { columnSpread, rowGap } = ANIM_STATE.cardGridLayout;
      const colFit = (viewportWidth * CARD_COLUMN_GAP_RATIO * columnSpread - 24)
        / (CARD_WIDTH * ANIM_CONFIG.cardScaleDesktop);
      const rowFit = (viewportHeight * rowGap - 24)
        / (ROW_METRIC_HEIGHT * ANIM_CONFIG.cardScaleDesktop);
      return Math.max(0.45, Math.min(1.0, Math.min(colFit, rowFit)));
    }
    return Math.max(
      0.75,
      Math.min(1.0, 0.75 + (0.25 * (viewportWidth - 768)) / (1440 - 768)),
    );
  }

  // Per-frame mockup geometry — shared across all 8 cards in the slotting ANIM_STATE.phase.
  // Per-card slot derivation happens in get*MockupCardSlot using these frame values.
  function getMobileMockupFrame() {
    const chromeLeft = (viewportWidth - ACROBAT_MOBILE_MOCKUP_WIDTH) / 2;
    const chromeTop = LAYOUT_CACHE.mobileAcrobatMockupRestTop
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
    const mockupWidth = getAcrobatDesktopMockupWidth(viewportWidth, ANIM_STATE.frame.isTablet);
    const mockupLeft = (viewportWidth - mockupWidth) / 2;
    const mockupTop = LAYOUT_CACHE.acrobatWinTop;
    const scale = mockupWidth / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH;
    const slotWidth = ACROBAT_DESKTOP_SLOT_WIDTH * scale;
    return { mockupLeft, mockupTop, scale, slotWidth };
  }

  function positionCards() {
    if (ANIM_STATE.frame.isMobile) {
      const { mobileLayout } = ANIM_STATE.frame;
      const gridW = mobileLayout.cardW * 2 + MOBILE_COL_GAP;
      const gridLeft = Math.max(MOBILE_OUTER_MARGIN, Math.round((viewportWidth - gridW) / 2));
      const firstRowCenterY = viewportHeight * 0.50 + mobileLayout.tallH / 2;
      sceneCards.forEach((card) => {
        if (card.mobileHidden) {
          // Park hidden mobile cards far off-screen so canvas anchors don't influence dots.
          card.baseX = OFFSCREEN_SENTINEL;
          card.baseY = OFFSCREEN_SENTINEL;
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
    const rowAnchor = -0.2 + 0.7 * ANIM_STATE.phase.arcToGrid;
    sceneCards.forEach((card) => {
      const centerX = getDeskCardCenterX(
        viewportWidth,
        card.colIdx,
        ANIM_STATE.cardGridLayout.columnSpread,
      );
      const centerY = viewportHeight
        * (0.5 + (card.rowIdx - rowAnchor) * ANIM_STATE.cardGridLayout.rowGap);
      card.baseX = centerX - card.width / 2;
      card.baseY = centerY - card.height / 2;
    });
  }

  const canvasGrid = createCanvasGrid(canvas, {
    isMobile: () => BREAKPOINTS.mobile.matches,
    getViewport: () => ({ width: viewportWidth, height: viewportHeight }),
    getCards: () => sceneCards,
    getCardCenter: getCanvasCardCenter,
    getState: () => ({ arcToGridProgress: ANIM_STATE.phase.arcToGrid }),
    pointerTarget: el,
  });

  function syncMockupWrappers() {
    const active = ANIM_STATE.frame.isMobile ? mobileMockupWrapper : desktopMockupWrapper;
    const inactive = ANIM_STATE.frame.isMobile ? desktopMockupWrapper : mobileMockupWrapper;
    if (inactive.parentNode) inactive.remove();
    if (!active.parentNode) stage.insertBefore(active, ctaEl);
  }

  function resize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    refreshFrameProfile();
    syncMockupWrappers();
    canvasGrid.resize();
    // Mobile uses the responsive layout; desktop/tablet use authored card dimensions.
    if (ANIM_STATE.frame.isMobile) {
      const { mobileLayout } = ANIM_STATE.frame;
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
    arcAngle = ANIM_STATE.frame.isMobile
      ? ANIM_CONFIG.mobileArcAngle
      : Math.atan2(viewportHeight, viewportWidth);
    LAYOUT_CACHE.headlineH = titleEl?.offsetHeight || 80;
    if (ANIM_STATE.frame.isMobile) {
      const headlineRestY = viewportHeight * ANIM_CONFIG.mobileHeadlineY + LAYOUT_CACHE.navOffset;
      const chromeRestY = headlineRestY + LAYOUT_CACHE.headlineH + 24;
      titleEl.style.top = `${headlineRestY}px`;
      const ctaRestY = chromeRestY + ACROBAT_MOBILE_MOCKUP_HEIGHT + 24;
      ctaEl.style.top = `${ctaRestY}px`;
      const ctaH = ctaEl.offsetHeight || ACROBAT_CTA_HEIGHT;
      LAYOUT_CACHE.mobilePostRevealDistance = Math.max(0, ctaRestY + ctaH + 80 - viewportHeight);
    }
    LAYOUT_CACHE.textBlockWidth = textBlockEl.offsetWidth;
    positionCards();
    LAYOUT_CACHE.blockDocTop = el.getBoundingClientRect().top + window.scrollY;
    LAYOUT_CACHE.blockHeight = el.offsetHeight;
    if (!ANIM_STATE.frame.isMobile && desktopMockupEl) {
      const aW = getAcrobatDesktopMockupWidth(viewportWidth, ANIM_STATE.frame.isTablet);
      const aH = aW * (ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH);
      const ctaH = ctaEl.offsetHeight || ACROBAT_CTA_HEIGHT;
      const stackH = LAYOUT_CACHE.headlineH + ACROBAT_DESKTOP_GAP_ABOVE
        + aH + ACROBAT_DESKTOP_GAP_BELOW + ctaH;
      const centeredTop = Math.max(48, (viewportHeight - stackH) / 2) + LAYOUT_CACHE.navOffset;
      const peekWinTop = viewportHeight - ANIM_CONFIG.desktopPeekAmount * aH;
      const peekStackTop = peekWinTop - LAYOUT_CACHE.headlineH - ACROBAT_DESKTOP_GAP_ABOVE;
      const peekRange = ANIM_CONFIG.desktopPeekStartH - viewportHeight;
      const peekBlend = clamp01(peekRange / 320);
      const stackTop = centeredTop + peekBlend * (peekStackTop - centeredTop);
      LAYOUT_CACHE.acrobatWinTop = stackTop + LAYOUT_CACHE.headlineH + ACROBAT_DESKTOP_GAP_ABOVE;
      LAYOUT_CACHE.acrobatCtaTop = LAYOUT_CACHE.acrobatWinTop + aH + ACROBAT_DESKTOP_GAP_BELOW;
      const ctaBottom = LAYOUT_CACHE.acrobatCtaTop + ctaH + 80;
      LAYOUT_CACHE.deskPostRevealNeeded = Math.max(0, ctaBottom - viewportHeight);
      titleEl.style.top = `${stackTop}px`;
      desktopMockupEl.style.top = `${LAYOUT_CACHE.acrobatWinTop}px`;
      ctaEl.style.top = `${LAYOUT_CACHE.acrobatCtaTop}px`;
      ANIM_STATE.verticalPan.deskPostRevealY = 0;
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

  function renderArcPeelToGrid(card, cardScale, deskGridScale) {
    const cardPeelProgress = getCardArcToGridProgress(card, ANIM_STATE.phase.arcToGrid);
    const fanPos = getFanCenter(card);
    const { arcZoom } = arcGeometry;
    const fanDepth = 1 - (card.fanIdx / FAN_LAST_INDEX) * ANIM_CONFIG.arcFanDepthDelta;
    const fanScale = cardScale * (1 + ANIM_CONFIG.arcLiftZoom) * fanDepth * arcZoom;

    const gridCenterX = card.baseX + card.width / 2;
    const gridCenterY = card.baseY + card.height / 2 - ANIM_STATE.verticalPan.arcGridY;

    const arcLocalDelay = (card.fanIdx / FAN_LAST_INDEX) * ANIM_CONFIG.arcStagger;
    const arcLocalWin = Math.max(0.01, 1 - ANIM_CONFIG.arcStagger);
    const cardArcPushProgress = clamp01((ANIM_STATE.phase.arcPan - arcLocalDelay) / arcLocalWin);
    const cardArcPushEase = easeInOutCubic(cardArcPushProgress);

    const pushedX = fanPos.x + fanPos.rx * ANIM_CONFIG.arcPushDistance * cardArcPushEase;
    const pushedY = fanPos.y + fanPos.ry * ANIM_CONFIG.arcPushDistance * cardArcPushEase;

    const totalPeelEase = easeOutCubic(cardPeelProgress);
    const currentX = pushedX + (gridCenterX - pushedX) * totalPeelEase;
    const currentY = pushedY + (gridCenterY - pushedY) * totalPeelEase;
    const scale = fanScale + (cardScale * deskGridScale - fanScale) * totalPeelEase;
    const rotation = fanPos.rot * (1 - totalPeelEase);

    const slideStaggerFrac = (1 - card.fanIdx / FAN_LAST_INDEX) * ANIM_CONFIG.slideStagger;
    const cardSlideT = clamp01(
      (ANIM_STATE.phase.slideT - slideStaggerFrac) / (1 - slideStaggerFrac),
    );
    const slideE = easeOutSine(cardSlideT);
    const slideScaleMul = ANIM_CONFIG.slideScaleStart + (1 - ANIM_CONFIG.slideScaleStart) * slideE;

    const compensatedY = currentY - prePinOffset;

    const prePinSlideOffset = viewportHeight * ANIM_CONFIG.prePinSlideY
      * (1 - easeOutSine(ANIM_STATE.phase.slideT));
    const renderedY = compensatedY + prePinSlideOffset;

    card.visualCx = currentX;
    card.visualCy = renderedY;

    const isPeeling = cardPeelProgress > 0.01;
    if (cardPeelProgress < 0.995) {
      // Card stacking is internal to .card-scene's isolated context — see the
      // z-index legend at the top of pdf-space.css. Lower fanIdx renders on top.
      const zBase = isPeeling ? 10 : 0;
      const zIndex = String(zBase + (FAN_LAST_INDEX - card.fanIdx));
      if (zIndex !== card.lastZIndex) {
        card.lastZIndex = zIndex;
        card.el.style.zIndex = zIndex;
      }
    } else if (card.lastZIndex !== '') {
      card.lastZIndex = '';
      card.el.style.zIndex = '';
    }

    const tiltFactor = Math.max(0, 1 - ANIM_STATE.phase.arcToGrid / 0.12);
    const screenYNorm = (fanPos.y - viewportHeight / 2) / (viewportHeight / 2);
    const cardYTilt = screenYNorm * ANIM_CONFIG.arcYTilt * tiltFactor;
    const cardXTilt = -screenYNorm * ANIM_CONFIG.arcXTilt * tiltFactor;

    setCardTransform(card.el, {
      translateX: currentX - card.width / 2,
      translateY: renderedY - card.height / 2,
      scale: scale * slideScaleMul,
      rotation,
      tiltX: cardXTilt,
      tiltY: cardYTilt,
    });
    card.el.style.opacity = Math.min(1, cardSlideT / ANIM_CONFIG.slideOpacityRampTo).toFixed(3);
    const shadowAlpha = ANIM_CONFIG.arcShadowAlpha * (1 - cardPeelProgress);
    const shadowAlphaKey = shadowAlpha.toFixed(3);
    if (shadowAlphaKey !== card.lastArcShadowAlphaKey) {
      card.lastArcShadowAlphaKey = shadowAlphaKey;
      card.el.style.boxShadow = arcCardShadow(shadowAlpha);
    }
    const peelReveal = clamp01((cardPeelProgress - 0.8) / 0.2);
    setLabelPos(card, currentX, renderedY, scale, peelReveal);
  }

  // Final glide from on-grid position into its slot in the Acrobat mockup.
  function renderGridToSlot(card, cardScale, deskGridScale, mockupFrame) {
    const cardSlot = ANIM_STATE.frame.isMobile
      ? getMobileMockupCardSlot(card, mockupFrame)
      : getDesktopMockupCardSlot(card, mockupFrame);
    const endCenterX = cardSlot.x + cardSlot.width / 2;
    const postRevealY = ANIM_STATE.frame.isMobile
      ? ANIM_STATE.verticalPan.mobilePostRevealY
      : ANIM_STATE.verticalPan.deskPostRevealY;
    const endCenterY = cardSlot.y + cardSlot.height / 2 - postRevealY;
    const endScale = cardSlot.width / card.width;

    const startCenterX = card.baseX + card.width / 2;
    const startCenterY = card.baseY + card.height / 2 - ANIM_STATE.verticalPan.arcGridY;

    const slottingEaseProgress = easeInOutSine(ANIM_STATE.phase.slotting);
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
    setLabelPos(card, centerX, centerY, scale, Math.max(0, 1 - ANIM_STATE.phase.slotting * 2));
  }

  // Card rendering: 3-branch state machine — exactly one branch runs per card per ANIM_STATE.frame.
  function updateCardPositions() {
    const cardScale = ANIM_STATE.frame.isMobile ? 1.0 : ANIM_CONFIG.cardScaleDesktop;
    const inArcPeel = ANIM_STATE.phase.arcToGrid < 1 && ANIM_STATE.phase.slotting <= 0;
    // Frame-level values shared across cards — compute once per frame, not per card.
    const deskGridScale = getDeskGridScale();
    let mockupFrame = null;
    if (!inArcPeel) {
      mockupFrame = ANIM_STATE.frame.isMobile ? getMobileMockupFrame() : getDesktopMockupFrame();
    }
    sceneCards.forEach((card) => {
      if (ANIM_STATE.frame.isMobile && card.mobileHidden) {
        hideMobileCard(card);
        return;
      }
      if (inArcPeel) renderArcPeelToGrid(card, cardScale, deskGridScale);
      else renderGridToSlot(card, cardScale, deskGridScale, mockupFrame);
    });
  }

  // ──────────────────── Per-frame loop phases ────────────────────

  function updateAnimationProgress() {
    const animScrollTotal = ANIM_STATE.timing.slottingStart + ANIM_STATE.timing.slottingDuration
      + ANIM_STATE.timing.postRevealScrollDistance;
    let blockTop;
    if (revealActive) {
      scrollCurrent = revealScrollCurrent;
      blockTop = 0;
    } else {
      const { scrollY } = window;
      blockTop = LAYOUT_CACHE.blockDocTop - scrollY;
      const panRange = Math.max(1, LAYOUT_CACHE.blockHeight - viewportHeight);
      scrollCurrent = clamp01(-blockTop / panRange) * animScrollTotal;
    }
    prePinOffset = Math.max(0, blockTop);
    ANIM_STATE.phase = derivePhases(scrollCurrent, prePinOffset, viewportHeight, ANIM_STATE.timing);
  }

  let arcTextPanProgressCached = 0;

  // Writes per-frame transform/opacity scalars to CSS custom properties on the stage.
  function updateMockupAndTitleTransform() {
    const slottingEase = easeInOutSine(ANIM_STATE.phase.slotting);

    const rawTitleMotionProgress = (scrollCurrent - ANIM_STATE.timing.slottingStart)
      / (ANIM_STATE.timing.slottingDuration + 350);
    const titleMotionProgress = clamp01(rawTitleMotionProgress);
    const titleSlide = easeOutCubic(titleMotionProgress);
    const titleOpacity = titleSlide;

    // Post-mockup reveal pan — mobile only, pans the Acrobat UI up to reveal the CTA.
    const postRevealProgress = ANIM_STATE.timing.postRevealScrollDistance
      ? clamp01(
        (scrollCurrent - (ANIM_STATE.timing.slottingStart + ANIM_STATE.timing.slottingDuration))
          / ANIM_STATE.timing.postRevealScrollDistance,
      )
      : 0;

    if (ANIM_STATE.frame.isMobile) {
      ctaEl.style.opacity = '';
      const mobileScaleDelta = ANIM_CONFIG.mobileMockupStartScale
        - ANIM_CONFIG.mobileMockupEndScale;
      const mobileScale = ANIM_CONFIG.mobileMockupStartScale - mobileScaleDelta * slottingEase;
      const mobileTopOverhang = (mobileScaleDelta / 2) * ACROBAT_MOBILE_MOCKUP_HEIGHT;
      const mobileOffscreen = viewportHeight + mobileTopOverhang + 30;
      const slideOffset = (1 - slottingEase) * mobileOffscreen;
      const headlineRestY = viewportHeight * ANIM_CONFIG.mobileHeadlineY + LAYOUT_CACHE.navOffset;
      const chromeRestY = headlineRestY + LAYOUT_CACHE.headlineH + 24;
      LAYOUT_CACHE.mobileAcrobatMockupRestTop = chromeRestY;
      const postRevealNeeded = LAYOUT_CACHE.mobilePostRevealDistance;
      const postRevealPanY = ((easeOutSine(postRevealProgress) + postRevealProgress) / 2)
        * postRevealNeeded;
      ANIM_STATE.verticalPan.mobilePostRevealY = postRevealPanY;
      stage.style.setProperty('--mockup-y', `${chromeRestY + slideOffset - postRevealPanY}px`);
      stage.style.setProperty('--mockup-scale', mobileScale);
      stage.style.setProperty('--title-y', `${slideOffset - postRevealPanY}px`);
      stage.style.setProperty('--title-scale', 1);
      stage.style.setProperty('--title-opacity', titleOpacity);
      stage.style.setProperty('--cta-y', `${slideOffset - postRevealPanY}px`);
    } else {
      ANIM_STATE.verticalPan.mobilePostRevealY = 0;
      const acrobatWidth = getAcrobatDesktopMockupWidth(viewportWidth, ANIM_STATE.frame.isTablet);
      const mockupHeight = acrobatWidth
        * (ACROBAT_DESKTOP_MOCKUP_DESIGN_HEIGHT / ACROBAT_DESKTOP_MOCKUP_DESIGN_WIDTH);
      const desktopScaleDelta = ANIM_CONFIG.desktopMockupStartScale
        - ANIM_CONFIG.desktopMockupEndScale;
      const topOverhang = (desktopScaleDelta / 2) * mockupHeight;
      const offscreenY = viewportHeight + topOverhang + 30;
      const mockupTranslateY = (1 - slottingEase) * offscreenY;
      const mockupScale = ANIM_CONFIG.desktopMockupStartScale - desktopScaleDelta * slottingEase;
      const titleScale = 0.92 + 0.08 * titleSlide;
      const deskRevealTarget = LAYOUT_CACHE.deskPostRevealNeeded
        ? easeOutSine(postRevealProgress) * LAYOUT_CACHE.deskPostRevealNeeded
        : 0;
      ANIM_STATE.verticalPan.deskPostRevealY = deskRevealTarget;
      const panY = deskRevealTarget;
      stage.style.setProperty('--mockup-y', `${mockupTranslateY - panY}px`);
      stage.style.setProperty('--mockup-scale', mockupScale);
      stage.style.setProperty('--title-y', `${mockupTranslateY - panY}px`);
      stage.style.setProperty('--title-scale', titleScale);
      stage.style.setProperty('--title-opacity', titleOpacity);
      stage.style.setProperty('--cta-y', `${mockupTranslateY - panY}px`);
      const ctaVisiblePx = viewportHeight - LAYOUT_CACHE.acrobatCtaTop + panY;
      ctaEl.style.opacity = clamp01(ctaVisiblePx / 60).toFixed(3);
      if (desktopPanelEl) {
        const media = desktopPanelEl.querySelector('picture');
        const panelRevealT = clamp01((ANIM_STATE.phase.slotting - 0.6) / 0.4);
        const panelEase = easeOutCubic(panelRevealT);
        media.style.transform = `translateX(${((1 - panelEase) * 100).toFixed(2)}%)`;
      }
    }
  }

  // ADBE logo flourish — draws from start → fully complete just as mockup transition begins.
  // Mobile: delayed to 85% through peel so it doesn't draw during arc/peel.
  function updateAdbeLogo() {
    const adbeLogoPeelStart = ANIM_STATE.frame.isMobile
      ? ANIM_CONFIG.peelStartScroll + (MOBILE_GRID_END - ANIM_CONFIG.peelStartScroll) * 0.85
      : ANIM_CONFIG.peelStartScroll;
    const adbeLogoSpan = ANIM_STATE.timing.slottingStart - adbeLogoPeelStart;
    const rawAdbeLogoProgress = (scrollCurrent - adbeLogoPeelStart) / adbeLogoSpan;
    const adbeLogoProgress = clamp01(rawAdbeLogoProgress);
    const adbeLogoDrawProgress = easeInOutSine(adbeLogoProgress);
    const adbeLogoFadeIn = clamp01(adbeLogoProgress * 6);
    const adbeLogoFadeOut = 1 - clamp01((ANIM_STATE.phase.slotting - 0.4) / 0.3);
    stage.style.setProperty('--adbe-draw', adbeLogoDrawProgress);
    stage.style.setProperty('--adbe-opacity', adbeLogoFadeIn * adbeLogoFadeOut);
  }

  function updateCompressionAndPan() {
    arcTextPanProgressCached = clamp01(
      (scrollCurrent - ANIM_STATE.timing.settleScrollStart) / ANIM_CONFIG.arcSettleDuration,
    );
    const compressedColGapPx = viewportWidth * CARD_COLUMN_GAP_RATIO
      * ANIM_CONFIG.columnCompressionTarget - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + ROW_METRIC_HEIGHT + LABEL_CLEARANCE)
      / viewportHeight;
    const postPeelEase = easeOutSine(arcTextPanProgressCached);
    const slottingCompression = easeInOutSine(ANIM_STATE.phase.slotting);
    ANIM_STATE.cardGridLayout.columnSpread = ANIM_CONFIG.baseColumnSpread
      + (ANIM_CONFIG.columnCompressionTarget - ANIM_CONFIG.baseColumnSpread)
        * ANIM_STATE.phase.arcToGrid
      - 0.15 * postPeelEase - 0.15 * slottingCompression;
    ANIM_STATE.cardGridLayout.rowGap = ANIM_CONFIG.baseRowGap
      + (compressedRowGap - ANIM_CONFIG.baseRowGap) * ANIM_STATE.phase.arcToGrid
      - 0.04 * postPeelEase - 0.04 * slottingCompression;
    const textAtRestY = viewportHeight * (0.5 + 0.5 * compressedRowGap)
      + ROW_METRIC_HEIGHT / 2
      + 90;
    const arcPanTarget = Math.max(0, textAtRestY - viewportHeight * 0.70);
    ANIM_STATE.verticalPan.arcGridY = arcPanTarget * easeOutSine(arcTextPanProgressCached);
    if (ANIM_STATE.frame.isMobile) {
      const { mobileLayout } = ANIM_STATE.frame;
      const mobileRow1CenterY = viewportHeight * 0.50
        + mobileLayout.tallH / 2 + mobileLayout.rowPitch;
      const mobileTextBaseY = mobileRow1CenterY + mobileLayout.tallH / 2
        + TEXT_BLOCK_BELOW_CARD_OFFSET;
      const mobileTextTarget = Math.max(0, mobileTextBaseY - viewportHeight * 0.65);
      const mobilePanProgress = clamp01(
        (scrollCurrent - MOBILE_PAN_START) / MOBILE_TEXT_PAN_DURATION,
      );
      ANIM_STATE.verticalPan.arcGridY = mobileTextTarget * easeOutSine(mobilePanProgress);
    }
  }

  function updateTextBlock() {
    const textEase = easeInOutSine(ANIM_STATE.phase.slotting);
    const textScaleDuringSlotting = 1 - 0.28 * textEase;
    const deskGridScaleForText = getDeskGridScale();
    const halfCardOnGrid = (CARD_WIDTH / 2) * ANIM_CONFIG.cardScaleDesktop * deskGridScaleForText;
    const col3Right = getDeskCardCenterX(viewportWidth, 3, ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      + halfCardOnGrid;
    const col0VisualLeft = getDeskCardCenterX(viewportWidth, 0, ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      - halfCardOnGrid;
    const arcTextFadeProgress = ANIM_STATE.frame.isMobile
      ? clamp01((ANIM_STATE.phase.slotting - 0.4) / 0.3)
      : clamp01((ANIM_STATE.phase.slotting - 0.55) / 0.15);
    const arcFinalScale = ANIM_STATE.frame.isMobile
      ? textScaleDuringSlotting
      : textScaleDuringSlotting * (1 - 0.15 * easeInOutSine(arcTextFadeProgress));
    let pinnedTextY;
    let textLeft;
    if (ANIM_STATE.frame.isMobile) {
      const { mobileLayout } = ANIM_STATE.frame;
      const row1CenterY = viewportHeight * 0.50
        + mobileLayout.tallH / 2 + mobileLayout.rowPitch;
      pinnedTextY = row1CenterY - ANIM_STATE.verticalPan.arcGridY
        + mobileLayout.tallH / 2 + TEXT_BLOCK_BELOW_CARD_OFFSET;
      const gridW = mobileLayout.cardW * 2 + MOBILE_COL_GAP;
      textLeft = Math.max(
        MOBILE_OUTER_MARGIN,
        Math.round((viewportWidth - gridW) / 2),
      );
    } else {
      textLeft = ANIM_STATE.frame.isTablet
        ? col0VisualLeft
        : col3Right - LAYOUT_CACHE.textBlockWidth;
      pinnedTextY = viewportHeight * (0.5 + 0.5 * ANIM_STATE.cardGridLayout.rowGap)
        + ROW_METRIC_HEIGHT / 2
        + 37
        + viewportHeight * 0.036
        - ANIM_STATE.verticalPan.arcGridY;
    }
    const arcReveal = ANIM_STATE.frame.isMobile
      ? clamp01((ANIM_STATE.phase.arcToGrid - 0.1) / 0.3)
      : clamp01(arcTextPanProgressCached * 2);
    const textOpacity = Math.max(0, 1 - arcTextFadeProgress) * arcReveal;
    textBlockEl.style.transform = `translate(${textLeft}px,${pinnedTextY}px) scale(${arcFinalScale})`;
    textBlockEl.style.opacity = textOpacity;
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
    rafId = requestAnimationFrame(loop);
  }

  // ──────────────────── Bootstrap ────────────────────
  const onResize = debounce(resize, 100);
  window.addEventListener('resize', onResize);

  const armFocusGuard = () => { suppressFocusSnap = true; };
  const disarmFocusGuard = () => {
    requestAnimationFrame(() => { suppressFocusSnap = false; });
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') armFocusGuard();
    else disarmFocusGuard();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', armFocusGuard);
  window.addEventListener('focus', disarmFocusGuard);

  resize();

  // Prewarm card + mockup image decode so the first animated frame doesn't stall on img decode.
  sceneCards.forEach((card) => {
    card.el.querySelector('img')?.decode?.().catch(() => {});
  });
  stage.querySelectorAll('.acrobat-desktop-mockup img, .acrobat-mobile-mockup img').forEach((img) => {
    img.decode?.().catch(() => {});
  });

  function getTargetScrollTop(targetScrollCurrent) {
    const animScrollTotal = ANIM_STATE.timing.slottingStart + ANIM_STATE.timing.slottingDuration
      + ANIM_STATE.timing.postRevealScrollDistance;
    const blockDocTop = el.getBoundingClientRect().top + window.scrollY;
    const panRange = Math.max(1, el.offsetHeight - window.innerHeight);
    return blockDocTop + clamp01(targetScrollCurrent / animScrollTotal) * panRange;
  }

  function snapToFocusTarget(targetScrollCurrent) {
    if (suppressFocusSnap) return;
    const top = getTargetScrollTop(targetScrollCurrent);
    revealActive = true;
    revealScrollCurrent = targetScrollCurrent;

    requestAnimationFrame(() => {
      if (window.lenis?.scrollTo) {
        window.lenis.scrollTo(top, { force: true, immediate: true });
      } else {
        window.scrollTo(0, top);
      }
      requestAnimationFrame(() => {
        revealActive = false;
      });
    });
  }

  stage.addEventListener('scroll', () => {
    if (stage.scrollTop !== 0) stage.scrollTop = 0;
    if (stage.scrollLeft !== 0) stage.scrollLeft = 0;
  });

  let pointerDown = false;
  stage.addEventListener('pointerdown', () => { pointerDown = true; });
  stage.addEventListener('pointerup', () => { pointerDown = false; });

  const textBlockLink = textBlockEl.querySelector('a');
  textBlockLink?.addEventListener('focus', () => {
    if (!pointerDown) snapToFocusTarget(ANIM_STATE.timing.slottingStart);
  });
  const ctaLink = ctaEl.querySelector('a');
  ctaLink?.addEventListener('focus', () => {
    if (pointerDown) return;
    const { timing } = ANIM_STATE;
    snapToFocusTarget(
      timing.slottingStart + timing.slottingDuration + timing.postRevealScrollDistance,
    );
  });

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

  return function teardown() {
    stopLoop();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('blur', armFocusGuard);
    window.removeEventListener('focus', disarmFocusGuard);
    canvasGrid.destroy();
  };
}

export default function init(el) {
  // Both builds consume el's children, so keep a clone to rebuild from on toggle.
  const authoredContent = [...el.children].map((node) => node.cloneNode(true));
  const restoreAuthoredContent = () => {
    el.replaceChildren(...authoredContent.map((node) => node.cloneNode(true)));
  };

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reducedMotionQuery.matches;

  let teardownMotion = null;
  let mountedReduced = null;

  function mountMode(reduced) {
    teardownMotion?.();
    restoreAuthoredContent();
    el.classList.toggle('no-motion', reduced);
    if (reduced) {
      buildNoMotion(el);
      teardownMotion = null;
    } else {
      teardownMotion = mountMotion(el);
    }
    mountedReduced = reduced;
  }

  function syncMotionPreference() {
    const reduced = prefersReducedMotion();
    if (reduced !== mountedReduced) mountMode(reduced);
  }

  syncMotionPreference();
  reducedMotionQuery.addEventListener('change', syncMotionPreference);

  const removalObserver = new MutationObserver((_, observer) => {
    if (document.contains(el)) return;
    teardownMotion?.();
    reducedMotionQuery.removeEventListener('change', syncMotionPreference);
    observer.disconnect();
  });
  if (el.parentElement) {
    removalObserver.observe(el.parentElement, { childList: true });
  }

  return el;
}
