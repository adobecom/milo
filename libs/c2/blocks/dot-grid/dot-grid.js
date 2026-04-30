import { createTag, getConfig, loadStyle } from '../../../utils/utils.js';
import { ACROBAT_DESKTOP_MOCKUP, ACROBAT_MOBILE_MOCKUP } from './acrobat-mockups.js';
import createCanvasGrid from './canvas-grid.js';

// TODO: finalize breakpoints
const BREAKPOINTS = {
  mobile: () => window.innerWidth <= 767,
  tablet: () => window.innerWidth >= 768 && window.innerWidth <= 1279,
  desktop: () => window.innerWidth >= 1280,
};

const CARD_COLUMN_OFFSETS_RATIO = [-0.462, -0.154, 0.154, 0.462];
const CARD_COLUMN_GAP_RATIO = CARD_COLUMN_OFFSETS_RATIO[1] - CARD_COLUMN_OFFSETS_RATIO[0];
const CARD_WIDTH = 192;
const DEFAULT_CARD_HEIGHT = 230;
/** Row pitch / compression math uses this tallest-card metric. */
const ROW_METRIC_HEIGHT = 264;
const LABEL_CLEARANCE = 28;
const ARC_INTRO_FRACTION = 0.10;
const ARC_PAN_END = 1350;
const ARC_PEEL_OVERLAP = ARC_PAN_END * (1 - ARC_INTRO_FRACTION);
/** Scroll unit at which card peel starts (end of the arc-rotation intro window). */
const PEEL_START_SCROLL = ARC_PAN_END - ARC_PEEL_OVERLAP;
/** Full arc→grid scroll span reference; mobile settle timing anchors here. */
const DESKTOP_ARC_REFERENCE_END = ARC_PAN_END + 1000;
/** Desktop/tablet peel completes at this scroll unit. */
const DESKTOP_PEEL_END_SCROLL = 1132;
const DESKTOP_SLOTTING_DURATION = 1720;
const ARC_SETTLE_DURATION = 1700;
const DESKTOP_SLOTTING_BREATHE = 0;
const DESKTOP_SLOTTING_START = DESKTOP_PEEL_END_SCROLL
  + ARC_SETTLE_DURATION
  + DESKTOP_SLOTTING_BREATHE;

// Mobile is the base path: shorter peel, no settle, shorter mockup transition.
// Desktop/tablet extend these timings below for the larger arc and mockup motion.
const MOBILE_SETTLE_DURATION = 468;
const MOBILE_SLOTTING_DURATION = 900;
const MOBILE_GRID_END = Math.round(
  PEEL_START_SCROLL + (DESKTOP_ARC_REFERENCE_END - PEEL_START_SCROLL) * 0.39,
);
const MOBILE_PAN_START = Math.round((PEEL_START_SCROLL + MOBILE_GRID_END) / 2);
const MOBILE_ARC_ALPHA = 0.6; // arc orientation on portrait screens
const MOBILE_SLIDE_DURATION = 300;
/** Scroll units into arc rotation at which slide fully completes. */
const SLIDE_OVERLAP = 200;
// Slide-in shape — kept as separate mobile/desktop tables so each breakpoint can be
// retuned independently without touching the other. Currently identical by design.
const MOBILE_SLIDE_PARAMS = {
  stagger: 0.45,
  staggerX: 0.20,
  startX: 0.55,
  startY: 0.90,
  scale: 0.85,
};
const DESKTOP_SLIDE_PARAMS = {
  stagger: 0.45,
  staggerX: 0.20,
  startX: 0.55,
  startY: 0.90,
  scale: 0.85,
};

// Mobile layout constants
const MOBILE_COL_GAP = 32;
const MOBILE_OUTER_MARGIN = 24;
const MOBILE_POST_REVEAL_SCROLL = 500;

// Arc animation tunables
const ARC_STAGGER = 0.50;
const ARC_SPAN = 0.80;
const ARC_LIFT_ZOOM = 1.00;
const ARC_Y_TILT = 25;
const ARC_X_TILT = 10;
/** Settled horizontal compression target as columnSpread delta. */
const COLUMN_COMPRESSION_TARGET = 0.675;
/** Column spread used to pin marketing text X during arc (settled spread minus post-peel trim). */
const ARC_TEXT_ANCHOR_COLUMN_SPREAD = COLUMN_COMPRESSION_TARGET - 0.15;
const CARD_SCALE_DESKTOP = 1.035;
const CARD_OPACITY = 1.0;
const BASE_COLUMN_SPREAD = 1.20;
const BASE_ROW_GAP = 0.60;

// FAN_INDEX_BY_GRID_POSITION maps grid [row][col] → arc position.
// Arc reads column-by-column L→R; fanIdx=0 is lower-right (peels first).
const FAN_INDEX_BY_GRID_POSITION = [
  [7, 5, 3, 1],
  [6, 4, 2, 0],
];

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

// TODO: author product UI?
// TODO: finalize authoring structure
function parseAuthoredContent(el) {
  const [titleRow, imageRow1, imageRow2, textRow, ctaRow] = [...el.children];
  const cards = [];
  [imageRow1, imageRow2].forEach((rowEl, rowIdx) => {
    [...rowEl.children].forEach((cellEl, colIdx) => {
      const picture = cellEl.querySelector('picture');
      const img = cellEl.querySelector('img');
      const mediaRoot = picture || img || null;
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
        baseHeight: cardHeight,
        label,
        mediaRoot,
      });
    });
  });
  const titleEl = titleRow.firstElementChild;
  const textBlockEl = textRow.firstElementChild;
  const ctaEl = ctaRow.firstElementChild;
  return { titleEl, cards, textBlockEl, ctaEl };
}

/** Builds the card-scene DOM: one stack root under `.card-scene` plus card state objects. */
function buildCardStack(cardScene, cardDefs) {
  const stackRoot = createTag('div', { class: 'card-stack' });
  cardScene.append(stackRoot);
  return cardDefs.map((def) => {
    const cardEl = createTag('div', { class: 'card' });
    if (def.mediaRoot) {
      cardEl.appendChild(def.mediaRoot);
    }
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
      mobileColIdx: def.mobileColIdx ?? def.colIdx,
      mobileRowIdx: def.mobileRowIdx ?? def.rowIdx,
      mobileHidden: def.mobileHidden ?? false,
      fanIdx: FAN_INDEX_BY_GRID_POSITION[def.rowIdx][def.colIdx],
      width: CARD_WIDTH,
      baseHeight: def.cardHeight ?? DEFAULT_CARD_HEIGHT,
      height: def.cardHeight ?? DEFAULT_CARD_HEIGHT,
      el: cardEl,
      labelEl,
      baseX: 0,
      baseY: 0,
      visualCx: 0,
      visualCy: 0,
      anchorX: 0,
      anchorY: 0,
      dotIdx: -1,
    };
  });
}

function setCardTransform(el, {
  translateX, translateY, scale, rotation = 0, tiltX = 0, tiltY = 0,
}) {
  el.style.transform = `translate(${translateX}px,${translateY}px) scale(${scale}) rotate(${rotation}deg) perspective(900px) rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
}

function applyCardBox(el, { baseX, baseY, width, height }) {
  el.style.left = `${baseX}px`;
  el.style.top = `${baseY}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
}

function arcCardShadow(opacity) {
  const a = typeof opacity === 'number' ? opacity.toFixed(3) : opacity;
  return `0 4px 7.1px 0 rgba(0,0,0,${a}), 0 18px 25.1px 0 rgba(0,0,0,${a}), 0 60px 60px 0 rgba(0,0,0,${a})`;
}

const ADBE_LOGO = `
<svg class="adbe-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 793 714" fill="none" overflow="visible">
  <path class="adbe-logo-path" d="M772.755 713.494H611.337C604.324 713.622 597.432 711.662 591.536 707.862C585.641 704.063 581.01 698.596 578.231 692.158L402.994 282.541C402.537 280.946 401.577 279.541 400.258 278.534C398.94 277.527 397.331 276.972 395.672 276.95C394.013 276.929 392.391 277.442 391.046 278.414C389.701 279.386 388.706 280.766 388.207 282.348L279 542.424C278.407 543.83 278.172 545.362 278.315 546.882C278.457 548.402 278.974 549.863 279.819 551.134C280.663 552.406 281.809 553.449 283.155 554.171C284.501 554.893 286.004 555.27 287.531 555.27H407.571C411.208 555.27 414.763 556.341 417.795 558.348C420.827 560.356 423.2 563.211 424.618 566.559L477.174 683.481C478.567 686.762 479.125 690.337 478.799 693.886C478.473 697.435 477.273 700.848 475.306 703.821C473.338 706.793 470.665 709.232 467.526 710.92C464.386 712.608 460.876 713.492 457.311 713.494H20.3044C17.0176 713.475 13.7866 712.642 10.8994 711.072C8.01233 709.501 5.5588 707.241 3.75759 704.492C1.95639 701.743 0.863449 698.592 0.576217 695.318C0.288985 692.045 0.816374 688.751 2.11138 685.731L280.081 23.9607C282.922 16.9565 287.809 10.9715 294.105 6.78681C300.401 2.60216 307.812 0.412351 315.372 0.50329H475.697C483.259 0.403187 490.675 2.58926 496.973 6.77504C503.271 10.9608 508.157 16.951 510.991 23.9607L790.885 685.731C792.18 688.746 792.709 692.035 792.426 695.304C792.142 698.573 791.055 701.721 789.261 704.469C787.466 707.216 785.021 709.478 782.141 711.053C779.261 712.627 776.037 713.466 772.755 713.494V713.494Z"/>
</svg>`;

async function loadBlockStyles() {
  const { miloLibs, codeRoot } = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${miloLibs || codeRoot}/c2/blocks/dot-grid/acrobat-mockups.css`, resolve);
  });
}

function buildStage(el) {
  const { titleEl, cards: cardDefs, textBlockEl, ctaEl } = parseAuthoredContent(el);
  const stage = createTag(
    'div',
    { class: 'dot-grid-stage' },
    `<canvas></canvas>${ADBE_LOGO}<div class="card-scene"></div>${ACROBAT_DESKTOP_MOCKUP}${ACROBAT_MOBILE_MOCKUP}`,
  );
  const cardScene = stage.querySelector('.card-scene');
  const sceneCards = buildCardStack(cardScene, cardDefs);
  titleEl.classList.add('acrobat-title');
  textBlockEl.classList.add('text-block');
  ctaEl.classList.add('acrobat-cta');
  [titleEl, textBlockEl].forEach((e) => {
    e.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading');
  });
  stage.append(titleEl, textBlockEl, ctaEl);
  el.replaceChildren(stage);
  return {
    titleEl,
    textBlockEl,
    ctaEl,
    sceneCards,
    canvas: el.querySelector('canvas'),
    acrobatDesktopMockupEl: el.querySelector('.acrobat-desktop-mockup'),
    acrobatMobileMockupEl: el.querySelector('.acrobat-mobile-mockup'),
    adbeLogoSvg: el.querySelector('.adbe-logo-svg'),
    adbeLogoPath: el.querySelector('.adbe-logo-path'),
  };
}

export default async function init(el) {
  await loadBlockStyles();

  const {
    titleEl, textBlockEl, ctaEl, sceneCards,
    canvas, acrobatDesktopMockupEl, acrobatMobileMockupEl,
    adbeLogoSvg, adbeLogoPath,
  } = buildStage(el);

  // dasharray >> path length so the full dash covers the path with no snake effect
  const adbeLogoLength = Math.max(adbeLogoPath.getTotalLength(), 3000) * 2 + 500;
  adbeLogoPath.style.strokeDasharray = adbeLogoLength;
  adbeLogoPath.style.strokeDashoffset = adbeLogoLength;

  // ──────────────────── Animation state ────────────────────
  let viewportWidth = 0;
  let viewportHeight = 0;
  /**
   * Scroll-scrub timeline state.
   *  - current: animation scroll units (0 → animScrollTotal), grows after the stage pins.
   *  - blockTop: block bounding rect top in pixels — positive while the block is approaching
   *    from below, 0 at pin, negative during pinned scroll. Used to drive the card slide-in
   *    pre-pin (mirrors poc-v3's pageScroll-driven slide start during the JTBD overlay).
   */
  const scrollTimeline = { current: 0, blockTop: 0 };

  // Phase progress, 0..1 each
  const phase = {
    arcPan: 0,
    arcToGrid: 0,
    slotting: 0,
  };

  // Desktop card grid metrics (columnSpread, rowGap). Only read on desktop; mobile uses
  // frame.mobileLayout. Updated each frame anyway so breakpoint switches don't leave stale values.
  const cardGridLayout = {
    columnSpread: BASE_COLUMN_SPREAD,
    rowGap: BASE_ROW_GAP,
  };

  // Scroll offsets (abstract units) where arc/grid/slotting phases begin or how long they run.
  const timing = {
    gridEnd: MOBILE_GRID_END,
    slottingStart: MOBILE_GRID_END + MOBILE_SETTLE_DURATION,
    slottingDuration: MOBILE_SLOTTING_DURATION,
    postRevealScrollDistance: MOBILE_POST_REVEAL_SCROLL,
    /** Scroll position where post-peel settle compression / text pan begins. */
    settleScrollStart: DESKTOP_ARC_REFERENCE_END,
  };

  // Vertical pan offsets (px) for cards, text, and mockup during peel→grid and post-reveal.
  const verticalPan = {
    arcGridY: 0,
    mobilePostRevealY: 0,
  };

  /**
   * Viewport Y of the mobile Acrobat mockup top at rest.
   * Set in updateMockupAndTitleTransform; read by getMobileMockupCardSlot.
   */
  let mobileAcrobatMockupRestTop = 0;
  let cachedHeadlineH = 60;

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

  // ──────────────────── Arc geometry helpers ────────────────────
  function getCardArcToGridProgress(card) {
    const delay = (card.fanIdx / 7) * ARC_STAGGER;
    const win = 1 - ARC_STAGGER;
    return Math.max(0, Math.min(1, (phase.arcToGrid - delay) / win));
  }

  // Precompute per-frame arc constants once so getFanCenter doesn't recompute for each card.
  function buildArcCtx() {
    const arcRotationProgress = arcRotationEase(phase.arcPan);
    const arcZoom = 1.4 - 0.4 * easeOutCubic(phase.arcToGrid);
    const arcRadius = Math.max(viewportWidth, viewportHeight) * 1.2 * arcZoom;
    const fanCenterX = viewportWidth * 0.5 - arcRadius * Math.sin(arcAngle);
    const fanCenterY = viewportHeight * 0.5
      + arcRadius * Math.cos(arcAngle)
      - viewportHeight * 0.15;
    const middleAngle = Math.atan2(-Math.cos(arcAngle), Math.sin(arcAngle));
    const rotationOffset = ARC_SPAN * 0.5 - ARC_SPAN * 1.5 * arcRotationProgress;
    const effectiveArcSpan = ARC_SPAN * (1 + 0.4 * arcRotationProgress);
    const flattenProgress = easeInOutCubic(Math.min(1, phase.arcToGrid / 0.5));
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
      - (card.fanIdx / 7) * effectiveArcSpan
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
    const t = Math.max(0, Math.min(1, (viewportWidth - 375) / 392));
    const cardW = Math.round((viewportWidth * (0.875 - t * 0.175) - MOBILE_COL_GAP) / 2);
    const scale = cardW / CARD_WIDTH;
    const tallH = Math.round(ROW_METRIC_HEIGHT * scale);
    return { cardW, scale, tallH, rowPitch: tallH + 61 };
  }

  function refreshFrameProfile() {
    frame.isMobile = BREAKPOINTS.mobile();
    frame.isTablet = !frame.isMobile && BREAKPOINTS.tablet();
    frame.mobileLayout = getMobileLayout();
  }

  function getDeskGridScale() {
    if (frame.isMobile) return 1.0;
    if (frame.isTablet) {
      const colFit = (viewportWidth * CARD_COLUMN_GAP_RATIO * cardGridLayout.columnSpread - 24)
        / (CARD_WIDTH * CARD_SCALE_DESKTOP);
      const rowFit = (viewportHeight * cardGridLayout.rowGap - 24)
        / (ROW_METRIC_HEIGHT * CARD_SCALE_DESKTOP);
      return Math.max(0.45, Math.min(1.0, Math.min(colFit, rowFit)));
    }
    return Math.max(
      0.75,
      Math.min(1.0, 0.75 + (0.25 * (viewportWidth - 768)) / (1440 - 768)),
    );
  }

  function getMobileMockupCardSlot(card) {
    const MOBILE_MOCKUP_WIDTH = 294;
    const MOBILE_MOCKUP_HEIGHT = 536;
    const MOBILE_MOCKUP_TOP_BAR_HEIGHT = 44;
    const MOBILE_MOCKUP_BOTTOM_BAR_HEIGHT = 100;
    const SLOT_COLUMN_GAP = 16;
    const MOBILE_MOCKUP_TOP_PADDING = 48;
    const MOBILE_MOCKUP_BOTTOM_PADDING = 8;
    const CARD_LABEL_HEIGHT = 22;
    const CARD_LABEL_GAP = 4;
    const ROW_GAP = 24;
    const SLOT_ROW_COUNT = 2;

    const chromeLeft = (viewportWidth - MOBILE_MOCKUP_WIDTH) / 2;
    const chromeTop = mobileAcrobatMockupRestTop
      || (viewportHeight - MOBILE_MOCKUP_HEIGHT) / 2;
    const canvasTop = chromeTop + MOBILE_MOCKUP_TOP_BAR_HEIGHT;
    const canvasHeight = MOBILE_MOCKUP_HEIGHT
      - MOBILE_MOCKUP_TOP_BAR_HEIGHT
      - MOBILE_MOCKUP_BOTTOM_BAR_HEIGHT;

    const availableSlotHeight = canvasHeight
      - MOBILE_MOCKUP_TOP_PADDING
      - MOBILE_MOCKUP_BOTTOM_PADDING
      - (SLOT_ROW_COUNT - 1) * ROW_GAP
      - SLOT_ROW_COUNT * (CARD_LABEL_GAP + CARD_LABEL_HEIGHT);
    const tallSlotH = Math.floor(availableSlotHeight / SLOT_ROW_COUNT);
    const cardSlotScale = tallSlotH / ROW_METRIC_HEIGHT;

    const height = Math.round(card.baseHeight * cardSlotScale);
    const width = Math.round(CARD_WIDTH * cardSlotScale);

    const slotGridLeft = chromeLeft
      + (MOBILE_MOCKUP_WIDTH - 2 * width - SLOT_COLUMN_GAP) / 2;
    const rowPitch = tallSlotH + CARD_LABEL_GAP + CARD_LABEL_HEIGHT + ROW_GAP;
    const firstRowCenterY = canvasTop + MOBILE_MOCKUP_TOP_PADDING + tallSlotH / 2;
    const centerY = firstRowCenterY + card.mobileRowIdx * rowPitch;
    const centerX = slotGridLeft
      + card.mobileColIdx * (width + SLOT_COLUMN_GAP)
      + width / 2;

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    };
  }

  function getDesktopMockupCardSlot(colIdx, rowIdx, cardHeight) {
    const mockupWidth = frame.isTablet
      ? Math.max(680, Math.min(988, viewportWidth * 0.70))
      : Math.min(viewportWidth * 0.686, 988);
    const mockupLeft = (viewportWidth - mockupWidth) / 2;
    const mockupTop = viewportHeight * 0.21 + 12;
    const scale = mockupWidth / 988;
    const SLOT_CENTER_X_BY_COLUMN = [355, 516, 677, 838];
    const SLOT_CENTER_Y_BY_ROW = [194, 409];
    const width = 146 * scale;
    const height = cardHeight * (width / CARD_WIDTH);
    return {
      x: mockupLeft + SLOT_CENTER_X_BY_COLUMN[colIdx] * scale - width / 2,
      y: mockupTop + SLOT_CENTER_Y_BY_ROW[rowIdx] * scale - height / 2,
      width,
      height,
    };
  }

  function positionCards() {
    const useDesktopLayout = !frame.isMobile;
    const ml = frame.mobileLayout;
    sceneCards.forEach((card) => {
      if (!useDesktopLayout) {
        if (card.mobileHidden) {
          // Park hidden mobile cards far off-screen so canvas anchors don't influence dots.
          card.baseX = -9999;
          card.baseY = -9999;
          return;
        }
        const gridW = ml.cardW * 2 + MOBILE_COL_GAP;
        const gridLeft = Math.max(MOBILE_OUTER_MARGIN, Math.round((viewportWidth - gridW) / 2));
        const centerX = gridLeft
            + card.mobileColIdx * (ml.cardW + MOBILE_COL_GAP)
            + ml.cardW / 2;
        const firstRowCenterY = viewportHeight * 0.50 + ml.tallH / 2;
        const centerY = firstRowCenterY + card.mobileRowIdx * ml.rowPitch;
        card.baseX = centerX - card.width / 2;
        card.baseY = centerY - card.height / 2;
        return;
      }
      const centerX = viewportWidth
          * (0.5 + CARD_COLUMN_OFFSETS_RATIO[card.colIdx] * cardGridLayout.columnSpread);
      const rowAnchor = -0.2 + 0.7 * phase.arcToGrid;
      const centerY = viewportHeight * (0.5 + (card.rowIdx - rowAnchor) * cardGridLayout.rowGap);
      card.baseX = centerX - card.width / 2;
      card.baseY = centerY - card.height / 2;
    });
  }

  function getCanvasCardCenter(card) {
    return {
      x: card.visualCx !== 0 ? card.visualCx : card.baseX + card.width / 2,
      y: card.visualCy !== 0 ? card.visualCy : card.baseY + card.height / 2,
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
    // Mobile is the base layout; desktop/tablet restore authored card dimensions.
    const ml = frame.mobileLayout;
    const useDesktopLayout = !frame.isMobile;
    sceneCards.forEach((card) => {
      card.width = ml.cardW;
      card.height = Math.round(card.baseHeight * ml.scale);
      if (useDesktopLayout) {
        card.width = CARD_WIDTH;
        card.height = card.baseHeight;
      }
    });
    arcAngle = frame.isMobile ? MOBILE_ARC_ALPHA : Math.atan2(viewportHeight, viewportWidth);
    const titleHeading = titleEl && titleEl.querySelector('.heading');
    cachedHeadlineH = (titleHeading && titleHeading.offsetHeight)
      || (titleEl && titleEl.offsetHeight) || 60;
    cachedTextBlockWidth = textBlockEl.offsetWidth;
    positionCards();
    canvasGrid.updateCardAnchors(sceneCards);
  }

  function setLabelPos(card, centerX, centerY, scale, opacity) {
    if (!card.labelEl) return;
    if (opacity <= 0) {
      card.labelEl.style.opacity = '0';
      return;
    }
    card.labelEl.style.left = `${centerX - (card.width / 2) * scale}px`;
    card.labelEl.style.top = `${centerY + (card.height / 2) * scale + 4}px`;
    card.labelEl.style.transform = `scale(${scale})`;
    card.labelEl.style.opacity = opacity.toFixed(3);
  }

  // ──────────────────── Card phase renderers ────────────────────
  function hideMobileCard(card) {
    card.el.style.opacity = '0';
    card.el.style.pointerEvents = 'none';
    if (card.labelEl) card.labelEl.style.opacity = '0';
  }

  // Per-card slide-in offset/scale/opacity. Driven by the block's pre-pin position
  // (scrollTimeline.blockTop) so cards rise into the arc as the section scrolls into view —
  // mirrors poc-v3, where the slide rode the JTBD pre-scroll instead of pinned scroll.
  function computeCardSlide(card, slideEarly, params) {
    const slidePixels = Math.max(0, slideEarly - scrollTimeline.blockTop);
    const slideProgress = Math.min(1, slidePixels / (slideEarly + SLIDE_OVERLAP));
    const fanLagFraction = 1 - card.fanIdx / 7;
    const staggerFrac = fanLagFraction * params.stagger;
    const cardSlideProgress = Math.max(
      0,
      Math.min(1, (slideProgress - staggerFrac) / (1 - staggerFrac)),
    );
    const slideEase = easeOutSine(cardSlideProgress);
    const xMultiplier = params.startX + fanLagFraction * params.staggerX;
    return {
      x: viewportWidth * xMultiplier * (1 - slideEase),
      y: viewportHeight * params.startY * (1 - slideEase),
      scaleMultiplier: params.scale + (1 - params.scale) * slideEase,
      opacity: Math.min(1, cardSlideProgress / 0.25),
    };
  }

  // Arc rotation + peel onto the grid (slide-in from below on all breakpoints).
  function renderArcPeelToGrid(card, cardScale) {
    const cardPeelProgress = getCardArcToGridProgress(card);
    const fanPos = getFanCenter(card);
    const { arcZoom } = arcGeometry;
    const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
    const fanScale = cardScale * (1 + ARC_LIFT_ZOOM) * fanDepth * arcZoom;

    const gridCenterX = card.baseX + card.width / 2;
    const gridCenterY = card.baseY + card.height / 2 - verticalPan.arcGridY;

    const arcLocalDelay = (card.fanIdx / 7) * ARC_STAGGER;
    const arcLocalWin = Math.max(0.01, 1 - ARC_STAGGER);
    const cardArcPushProgress = Math.max(
      0,
      Math.min(1, (phase.arcPan - arcLocalDelay) / arcLocalWin),
    );
    const cardArcPushEase = easeInOutCubic(cardArcPushProgress);

    const pushedX = fanPos.x + fanPos.rx * 60 * cardArcPushEase;
    const pushedY = fanPos.y + fanPos.ry * 60 * cardArcPushEase;

    const totalPeelEase = easeOutCubic(cardPeelProgress);
    const currentX = pushedX + (gridCenterX - pushedX) * totalPeelEase;
    const currentY = pushedY + (gridCenterY - pushedY) * totalPeelEase;
    const deskGridScale = getDeskGridScale();
    const scale = fanScale + (cardScale * deskGridScale - fanScale) * totalPeelEase;
    const rotation = fanPos.rot * (1 - totalPeelEase);

    const slideEarly = frame.isMobile
      ? viewportHeight * 0.72 + MOBILE_SLIDE_DURATION * 0.13
      : viewportHeight * 0.75;
    const slideParams = frame.isMobile ? MOBILE_SLIDE_PARAMS : DESKTOP_SLIDE_PARAMS;
    const slide = computeCardSlide(card, slideEarly, slideParams);

    card.visualCx = currentX + slide.x;
    card.visualCy = currentY + slide.y;

    const isPeeling = cardPeelProgress > 0.01;
    if (cardPeelProgress < 0.995) {
      const zBase = isPeeling ? 32 : 20;
      card.el.style.zIndex = String(zBase + (7 - card.fanIdx));
    } else {
      card.el.style.zIndex = '';
    }

    const tiltFactor = Math.max(0, 1 - phase.arcToGrid / 0.12);
    const screenYNorm = (fanPos.y - viewportHeight / 2) / (viewportHeight / 2);
    const cardYTilt = screenYNorm * ARC_Y_TILT * tiltFactor;
    const cardXTilt = -screenYNorm * ARC_X_TILT * tiltFactor;

    applyCardBox(card.el, card);
    setCardTransform(card.el, {
      translateX: currentX - card.baseX - card.width / 2 + slide.x,
      translateY: currentY - card.baseY - card.height / 2 + slide.y,
      scale: scale * slide.scaleMultiplier,
      rotation,
      tiltX: cardXTilt,
      tiltY: cardYTilt,
    });
    card.el.style.opacity = (CARD_OPACITY * slide.opacity).toFixed(3);
    const shadowAlpha = 0.15 * (1 - cardPeelProgress);
    const shadowAlphaKey = shadowAlpha.toFixed(3);
    if (shadowAlphaKey !== card.lastArcShadowAlphaKey) {
      card.lastArcShadowAlphaKey = shadowAlphaKey;
      card.el.style.boxShadow = arcCardShadow(shadowAlpha);
    }
    const peelReveal = Math.max(0, Math.min(1, (cardPeelProgress - 0.8) / 0.2));
    setLabelPos(card, currentX, currentY, scale, peelReveal);
  }

  // Final glide from on-grid position into its slot in the Acrobat mockup.
  function renderGridToSlot(card, cardScale) {
    const cardSlot = frame.isMobile
      ? getMobileMockupCardSlot(card)
      : getDesktopMockupCardSlot(card.colIdx, card.rowIdx, card.height);
    const endCenterX = cardSlot.x + cardSlot.width / 2;
    const endCenterY = frame.isMobile
      ? cardSlot.y + cardSlot.height / 2 - verticalPan.mobilePostRevealY
      : cardSlot.y + cardSlot.height / 2;
    const endScale = cardSlot.width / card.width;

    const startCenterX = card.baseX + card.width / 2;
    const startCenterY = card.baseY + card.height / 2 - verticalPan.arcGridY;

    const slottingEaseProgress = easeInOutSine(phase.slotting);
    const centerX = startCenterX + (endCenterX - startCenterX) * slottingEaseProgress;
    const centerY = startCenterY + (endCenterY - startCenterY) * slottingEaseProgress;
    const scale = cardScale + (endScale - cardScale) * slottingEaseProgress;
    card.visualCx = centerX;
    card.visualCy = centerY;

    applyCardBox(card.el, card);
    setCardTransform(card.el, {
      translateX: centerX - card.baseX - card.width / 2,
      translateY: centerY - card.baseY - card.height / 2,
      scale,
    });
    card.el.style.opacity = CARD_OPACITY;
    card.el.style.boxShadow = '';
    card.el.style.zIndex = '';
    setLabelPos(card, centerX, centerY, scale, 1);
  }

  // Card rendering: 3-branch state machine — exactly one branch runs per card per frame.
  function updateCardPositions() {
    const cardScale = frame.isMobile ? 1.0 : CARD_SCALE_DESKTOP;
    const inArcPeel = phase.arcToGrid < 1 && phase.slotting <= 0;
    sceneCards.forEach((card) => {
      if (frame.isMobile && card.mobileHidden) {
        hideMobileCard(card);
        return;
      }
      if (inArcPeel) renderArcPeelToGrid(card, cardScale);
      else renderGridToSlot(card, cardScale);
    });
  }

  // ──────────────────── Per-frame loop phases ────────────────────
  let interactive = false;

  function readScrollProgress() {
    const rect = el.getBoundingClientRect();
    scrollTimeline.blockTop = rect.top;
    const panRange = Math.max(1, el.offsetHeight - window.innerHeight);
    return Math.max(0, Math.min(1, -rect.top / panRange));
  }

  function applyViewportTiming() {
    if (frame.isMobile) {
      timing.gridEnd = MOBILE_GRID_END;
      timing.slottingStart = MOBILE_GRID_END + MOBILE_SETTLE_DURATION;
      timing.slottingDuration = MOBILE_SLOTTING_DURATION;
      timing.postRevealScrollDistance = MOBILE_POST_REVEAL_SCROLL;
      timing.settleScrollStart = DESKTOP_ARC_REFERENCE_END;
    } else {
      timing.gridEnd = DESKTOP_PEEL_END_SCROLL;
      timing.slottingStart = DESKTOP_SLOTTING_START;
      timing.slottingDuration = DESKTOP_SLOTTING_DURATION;
      timing.postRevealScrollDistance = 0;
      timing.settleScrollStart = DESKTOP_PEEL_END_SCROLL;
    }
  }

  function updateAnimationProgress() {
    const animScrollTotal = timing.slottingStart + timing.slottingDuration
      + timing.postRevealScrollDistance;
    scrollTimeline.current = readScrollProgress() * animScrollTotal;

    phase.arcPan = Math.max(0, Math.min(1, scrollTimeline.current / ARC_PAN_END));
    const rawArcToGridProgress = (scrollTimeline.current - PEEL_START_SCROLL)
      / (timing.gridEnd - PEEL_START_SCROLL);
    phase.arcToGrid = Math.max(0, Math.min(1, rawArcToGridProgress));
    const rawSlottingProgress = (scrollTimeline.current - timing.slottingStart)
      / timing.slottingDuration;
    phase.slotting = Math.max(0, Math.min(1, rawSlottingProgress));
  }

  let arcTextPanProgressCached = 0;

  function updateMockupAndTitleTransform() {
    const slottingEase = easeInOutSine(phase.slotting);
    const mockupScale = 2.5 - 1.5 * slottingEase;
    const acrobatWidth = frame.isTablet
      ? Math.max(680, Math.min(988, viewportWidth * 0.70))
      : Math.min(viewportWidth * 0.686, 988);
    const mockupHeight = acrobatWidth * (567 / 988);
    const topOverhang = ((2.5 - 1) / 2) * mockupHeight;
    const offscreenY = viewportHeight + topOverhang + 30;
    const mockupTranslateY = (1 - slottingEase) * offscreenY;

    const rawTitleMotionProgress = (scrollTimeline.current - timing.slottingStart)
      / (timing.slottingDuration + 350);
    const titleMotionProgress = Math.max(0, Math.min(1, rawTitleMotionProgress));
    const titleSlide = easeOutCubic(titleMotionProgress);
    const titleOpacity = titleSlide;
    const titleScale = 0.92 + 0.08 * titleSlide;

    // Post-mockup reveal pan — mobile only, pans the Acrobat UI up to reveal the CTA.
    const postRevealProgress = timing.postRevealScrollDistance
      ? Math.max(
        0,
        Math.min(
          1,
          (scrollTimeline.current - (timing.slottingStart + timing.slottingDuration))
            / timing.postRevealScrollDistance,
        ),
      )
      : 0;

    if (frame.isMobile) {
      if (acrobatDesktopMockupEl) acrobatDesktopMockupEl.style.transform = '';
      const mobileChromeHeight = 536;
      const mobileScale = 2.0 - 1.0 * slottingEase;
      const mobileTopOverhang = ((2.0 - 1.0) / 2) * mobileChromeHeight;
      const mobileOffscreen = viewportHeight + mobileTopOverhang + 30;
      const slideOffset = (1 - slottingEase) * mobileOffscreen;
      const headlineRestY = viewportHeight * 0.28;
      const chromeRestY = headlineRestY + cachedHeadlineH + 16;
      mobileAcrobatMockupRestTop = chromeRestY;
      const ctaRestY = chromeRestY + mobileChromeHeight + 10;
      const postRevealNeeded = Math.max(0, ctaRestY + 40 + 20 - viewportHeight);
      const postRevealPanY = ((easeOutSine(postRevealProgress) + postRevealProgress) / 2)
        * postRevealNeeded;
      verticalPan.mobilePostRevealY = postRevealPanY;
      if (acrobatMobileMockupEl) {
        acrobatMobileMockupEl.style.transform = `translateY(${chromeRestY + slideOffset - postRevealPanY}px) scale(${mobileScale})`;
      }
      if (titleEl) {
        titleEl.style.transform = `translateY(${headlineRestY + slideOffset - postRevealPanY}px)`;
        titleEl.style.opacity = titleOpacity;
      }
      if (ctaEl) {
        ctaEl.style.transform = `translateY(${ctaRestY + slideOffset - postRevealPanY}px)`;
      }
    } else {
      verticalPan.mobilePostRevealY = 0;
      acrobatDesktopMockupEl.style.transform = `translateY(${mockupTranslateY}px) scale(${mockupScale})`;
      if (titleEl) {
        titleEl.style.transform = `translateY(${mockupTranslateY}px) scale(${titleScale})`;
        titleEl.style.opacity = titleOpacity;
      }
      if (ctaEl) ctaEl.style.transform = `translateY(${mockupTranslateY}px)`;
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
    const adbeLogoProgress = Math.max(0, Math.min(1, rawAdbeLogoProgress));
    const adbeLogoDrawProgress = easeInOutSine(adbeLogoProgress);
    const adbeLogoFadeIn = Math.max(0, Math.min(1, adbeLogoProgress * 6));
    const adbeLogoFadeOut = Math.max(
      0,
      1 - Math.max(0, Math.min(1, (phase.slotting - 0.4) / 0.3)),
    );
    adbeLogoPath.style.strokeDashoffset = adbeLogoLength * (1 - adbeLogoDrawProgress);
    adbeLogoSvg.style.opacity = adbeLogoFadeIn * adbeLogoFadeOut;
  }

  // Enable clicks once the mockup transition has essentially landed.
  function updateInteractivity() {
    const shouldBeInteractive = phase.slotting >= 0.95;
    if (shouldBeInteractive === interactive) return;
    interactive = shouldBeInteractive;
    const pointerEventsValue = interactive ? 'auto' : 'none';
    titleEl.style.pointerEvents = pointerEventsValue;
    // TODO: when can this be interactive?
    textBlockEl.style.pointerEvents = pointerEventsValue;
    ctaEl.style.pointerEvents = pointerEventsValue;
  }

  function updateCompressionAndPan() {
    arcTextPanProgressCached = Math.max(
      0,
      Math.min(1, (scrollTimeline.current - timing.settleScrollStart) / ARC_SETTLE_DURATION),
    );
    const compressedColGapPx = viewportWidth * CARD_COLUMN_GAP_RATIO * COLUMN_COMPRESSION_TARGET
      - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + ROW_METRIC_HEIGHT + LABEL_CLEARANCE)
      / viewportHeight;
    const postPeelEase = easeOutSine(arcTextPanProgressCached);
    const slottingCompression = easeInOutSine(phase.slotting);
    cardGridLayout.columnSpread = BASE_COLUMN_SPREAD
      + (COLUMN_COMPRESSION_TARGET - BASE_COLUMN_SPREAD) * phase.arcToGrid
      - 0.15 * postPeelEase - 0.15 * slottingCompression;
    cardGridLayout.rowGap = BASE_ROW_GAP
      + (compressedRowGap - BASE_ROW_GAP) * phase.arcToGrid
      - 0.04 * postPeelEase - 0.04 * slottingCompression;
    const textAtRestY = viewportHeight * (0.5 + 0.5 * compressedRowGap)
      + ROW_METRIC_HEIGHT / 2
      + 90;
    const arcPanTarget = Math.max(0, textAtRestY - viewportHeight * 0.70);
    verticalPan.arcGridY = arcPanTarget * easeOutSine(arcTextPanProgressCached);
    if (frame.isMobile) {
      const ml = frame.mobileLayout;
      const mobileRow1CenterY = viewportHeight * 0.50 + ml.tallH / 2 + ml.rowPitch;
      const mobileTextBaseY = mobileRow1CenterY + ml.tallH / 2 + 4 + 22 + 32;
      const mobileTextTarget = Math.max(0, mobileTextBaseY - viewportHeight * 0.65);
      const mobilePanProgress = Math.max(
        0,
        Math.min(1, (scrollTimeline.current - MOBILE_PAN_START) / 900),
      );
      verticalPan.arcGridY = mobileTextTarget * easeOutSine(mobilePanProgress);
    }
  }

  function updateTextBlock() {
    const textEase = easeInOutSine(phase.slotting);
    const textScaleDuringSlotting = 1 - 0.28 * textEase;
    const deskGridScaleForText = getDeskGridScale();
    const col3Right = viewportWidth
      * (0.5 + CARD_COLUMN_OFFSETS_RATIO[3] * ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      + (CARD_WIDTH / 2) * CARD_SCALE_DESKTOP * deskGridScaleForText;
    const col0VisualLeft = viewportWidth
      * (0.5 + CARD_COLUMN_OFFSETS_RATIO[0] * ARC_TEXT_ANCHOR_COLUMN_SPREAD)
      - (CARD_WIDTH / 2) * CARD_SCALE_DESKTOP * deskGridScaleForText;
    const arcTextFadeProgress = frame.isMobile
      ? Math.max(0, Math.min(1, (phase.slotting - 0.4) / 0.3))
      : Math.max(0, Math.min(1, (phase.slotting - 0.55) / 0.15));
    const arcFinalScale = frame.isMobile
      ? textScaleDuringSlotting
      : textScaleDuringSlotting * (1 - 0.15 * easeInOutSine(arcTextFadeProgress));
    let pinnedTextY;
    if (frame.isMobile) {
      const ml = frame.mobileLayout;
      const row1CenterY = viewportHeight * 0.50 + ml.tallH / 2 + ml.rowPitch;
      pinnedTextY = row1CenterY - verticalPan.arcGridY + ml.tallH / 2 + 4 + 22 + 32;
      const gridW = ml.cardW * 2 + MOBILE_COL_GAP;
      const mobileGridLeft = Math.max(
        MOBILE_OUTER_MARGIN,
        Math.round((viewportWidth - gridW) / 2),
      );
      textBlockEl.style.left = `${mobileGridLeft}px`;
    } else {
      const arcTextLeft = frame.isTablet
        ? col0VisualLeft
        : col3Right - (cachedTextBlockWidth || textBlockEl.offsetWidth);
      pinnedTextY = viewportHeight * (0.5 + 0.5 * cardGridLayout.rowGap)
        + ROW_METRIC_HEIGHT / 2
        + 37
        + viewportHeight * 0.036
        - verticalPan.arcGridY;
      textBlockEl.style.left = `${arcTextLeft}px`;
    }
    const arcReveal = frame.isMobile
      ? Math.max(0, Math.min(1, (phase.arcToGrid - 0.1) / 0.3))
      : Math.max(0, Math.min(1, arcTextPanProgressCached * 2));
    const textOpacity = Math.max(0, 1 - arcTextFadeProgress) * arcReveal;
    textBlockEl.style.transform = `translateY(${pinnedTextY}px) scale(${arcFinalScale})`;
    textBlockEl.style.opacity = textOpacity;
  }

  // ──────────────────── Render loop ────────────────────
  let rafId = 0;
  let running = false;

  function loop() {
    if (!running) return;

    refreshFrameProfile();
    applyViewportTiming();
    updateAnimationProgress();
    buildArcCtx();
    updateMockupAndTitleTransform();
    updateAdbeLogo();
    updateInteractivity();
    updateCompressionAndPan();
    updateTextBlock();
    positionCards();
    canvasGrid.updateCardAnchors(sceneCards);
    canvasGrid.update();
    canvasGrid.draw();
    updateCardPositions();
    rafId = requestAnimationFrame(loop);
  }

  // ──────────────────── Bootstrap ────────────────────
  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  resize();

  (function prewarmCanvasDots() {
    const savedArcToGrid = phase.arcToGrid;
    phase.arcToGrid = 0.001;
    refreshFrameProfile();
    applyViewportTiming();
    updateAnimationProgress();
    buildArcCtx();
    updateCompressionAndPan();
    updateMockupAndTitleTransform();
    updateTextBlock();
    positionCards();
    canvasGrid.updateCardAnchors(sceneCards);
    canvasGrid.update();
    canvasGrid.draw();
    updateCardPositions();
    phase.arcToGrid = savedArcToGrid;
    updateAnimationProgress();
    buildArcCtx();
    canvasGrid.draw();
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
    if (entry.isIntersecting) startLoop();
    else stopLoop();
  }, { rootMargin: '200px 0px' });
  io.observe(el);

  new MutationObserver((_, observer) => {
    if (document.contains(el)) return;
    stopLoop();
    io.disconnect();
    window.removeEventListener('resize', onResize);
    canvasGrid.destroy();
    observer.disconnect();
  }).observe(document.body, { childList: true, subtree: true });

  return el;
}
