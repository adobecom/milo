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
const ARC_INTRO_FRACTION = 0.10;
const ARC_PAN_END = 1350;
const ARC_PEEL_OVERLAP = ARC_PAN_END * (1 - ARC_INTRO_FRACTION);
const DESKTOP_GRID_END = ARC_PAN_END + 1000;
const DESKTOP_SLOTTING_DURATION = 2200;
const ARC_SETTLE_DURATION = 1700;
const DESKTOP_SLOTTING_START = DESKTOP_GRID_END + ARC_SETTLE_DURATION;

// Mobile is the base path: shorter peel, no settle, shorter mockup transition.
// Desktop/tablet extend these timings below for the larger arc and mockup motion.
const MOBILE_SETTLE_DURATION = 1056;
const MOBILE_SLOTTING_DURATION = 550;
const MOBILE_GRID_END = Math.round(
  (ARC_PAN_END - ARC_PEEL_OVERLAP) + (DESKTOP_GRID_END - (ARC_PAN_END - ARC_PEEL_OVERLAP)) * 0.5,
);
const MOBILE_PAN_START = Math.round(((ARC_PAN_END - ARC_PEEL_OVERLAP) + MOBILE_GRID_END) / 2);
const MOBILE_ARC_ALPHA = 0.6; // arc orientation on portrait screens
const MOBILE_SLIDE_DURATION = 300;
const MOBILE_SLIDE_STAGGER = 0.45;
const MOBILE_SLIDE_START_Y = 0.90;
const MOBILE_SLIDE_SCALE = 0.85;
const MOBILE_SLIDE_START_X = 0.55;
const MOBILE_SLIDE_STAGGER_X = 0.20;

// Mobile layout constants
const MOBILE_COL_GAP = 32;
const MOBILE_OUTER_MARGIN = 24;
const MOBILE_POST_REVEAL_SCROLL = 500;

// Arc + intro animation tunables
const ARC_STAGGER = 0.50;
const ARC_SPAN = 0.80;
const ARC_LIFT_ZOOM = 1.00;
const ARC_Y_TILT = 25;
const ARC_X_TILT = 10;
const INTRO_STAGGER = 0.50;
const INTRO_COMPRESS = 0.20;
const INTRO_DISTANCE = 0.20;
const CARD_SCALE_DESKTOP = 1.15;
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
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * ((t - 1) ** 3) + c1 * ((t - 1) ** 2);
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
      const label = cellEl.textContent.trim();
      const imageWidth = (img && parseInt(img.getAttribute('width'), 10)) || CARD_WIDTH;
      const imageHeight = (img && parseInt(img.getAttribute('height'), 10)) || DEFAULT_CARD_HEIGHT;
      const cardHeight = Math.round(CARD_WIDTH * (imageHeight / imageWidth));
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
        html: picture ? picture.outerHTML : '',
      });
    });
  });
  const titleEl = titleRow.firstElementChild;
  const textBlockEl = textRow.firstElementChild;
  const ctaEl = ctaRow.firstElementChild;
  return { titleEl, cards, textBlockEl, ctaEl };
}

function setCardTransform(el, {
  translateX, translateY, scale, rotation = 0, tiltX = 0, tiltY = 0,
}) {
  el.style.transform = `translate(${translateX}px,${translateY}px) scale(${scale}) rotate(${rotation}deg) rotateY(${tiltY.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg)`;
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
  const { titleEl, cards: authoredCards, textBlockEl, ctaEl } = parseAuthoredContent(el);
  const stage = createTag(
    'div',
    { class: 'dot-grid-stage' },
    `<canvas></canvas>${ADBE_LOGO}<div class="world"></div>${ACROBAT_DESKTOP_MOCKUP}${ACROBAT_MOBILE_MOCKUP}`,
  );
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
    authoredCards,
    canvas: el.querySelector('canvas'),
    world: el.querySelector('.world'),
    acrobatDesktopMockupEl: el.querySelector('.acrobat-desktop-mockup'),
    acrobatMobileMockupEl: el.querySelector('.acrobat-mobile-mockup'),
    adbeLogoSvg: el.querySelector('.adbe-logo-svg'),
    adbeLogoPath: el.querySelector('.adbe-logo-path'),
  };
}

function buildCardLayer(world, cards) {
  const layerEl = createTag('div', { class: 'layer' });
  world.appendChild(layerEl);
  const cardObjects = cards.map((def) => {
    const cardEl = createTag('div', { class: 'card' }, def.html);
    layerEl.appendChild(cardEl);
    let labelEl = null;
    if (def.label) {
      labelEl = createTag('div', { class: 'card-label-outer' }, def.label);
      labelEl.style.opacity = '0';
      layerEl.appendChild(labelEl);
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
  return { el: layerEl, cards: cardObjects };
}

export default async function init(el) {
  await loadBlockStyles();

  const ctx = buildStage(el);
  const {
    titleEl, textBlockEl, ctaEl, authoredCards,
    canvas, world, acrobatDesktopMockupEl, acrobatMobileMockupEl,
    adbeLogoSvg, adbeLogoPath,
  } = ctx;

  // dasharray >> path length so the full dash covers the path with no snake effect
  const adbeLogoLength = Math.max(adbeLogoPath.getTotalLength(), 3000) * 2 + 500;
  adbeLogoPath.style.strokeDasharray = adbeLogoLength;
  adbeLogoPath.style.strokeDashoffset = adbeLogoLength;

  // ──────────────────── Animation state ────────────────────
  let viewportWidth = 0;
  let viewportHeight = 0;
  const scroll = { current: 0 };

  // Phase progress, 0..1 each
  const phase = {
    arcPan: 0,
    arcToGrid: 0,
    slotting: 0,
    gridCompression: 0,
  };

  // Per-frame layout (column spread, row gap)
  const layout = {
    columnSpread: BASE_COLUMN_SPREAD,
    rowGap: BASE_ROW_GAP,
  };

  // Mobile is the base; desktop/tablet override these in applyViewportTiming().
  const timing = {
    gridEnd: MOBILE_GRID_END,
    slottingStart: MOBILE_GRID_END + MOBILE_SETTLE_DURATION,
    slottingDuration: MOBILE_SLOTTING_DURATION,
    postRevealScrollDistance: MOBILE_POST_REVEAL_SCROLL,
  };

  // Vertical pan offsets accumulated during peel→grid and post-reveal.
  const pan = {
    arcGridY: 0,
    mobilePostRevealY: 0,
  };

  // Mobile chrome rest position (set per frame, read by getMobileMockupCardSlot)
  let mobileChromeRestY = 0;
  let cachedHeadlineH = 60;

  // Per-frame arc geometry — built once by buildArcCtx().
  let arcAngle = Math.atan2(1, 1);
  let arcGeometry = null;

  // Per-frame viewport profile — refreshed at top of each loop iteration.
  // Avoids repeated window.innerWidth reads + repeated getMobileLayout() calls.
  const frame = {
    isMobile: false,
    mobileLayout: null,
  };

  const allLayers = [authoredCards].map((cards) => buildCardLayer(world, cards));

  // ──────────────────── Arc geometry helpers ────────────────────
  function getCardArcIntroProgress(card) {
    const staggerStart = (1 - card.fanIdx / 7) * INTRO_STAGGER * ARC_INTRO_FRACTION;
    const staggerDur = ARC_INTRO_FRACTION - staggerStart;
    return Math.max(0, Math.min(1, (phase.arcPan - staggerStart) / staggerDur));
  }

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
    const tallH = Math.round(230 * scale);
    return { cardW, scale, tallH, rowPitch: tallH + 61 };
  }

  function refreshFrameProfile() {
    frame.isMobile = BREAKPOINTS.mobile();
    frame.mobileLayout = getMobileLayout();
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
    const chromeTop = mobileChromeRestY || (viewportHeight - MOBILE_MOCKUP_HEIGHT) / 2;
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
    const cardSlotScale = tallSlotH / 230;

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
    const mockupWidth = Math.min(viewportWidth * 0.686, 988);
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
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
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
          * (0.5 + CARD_COLUMN_OFFSETS_RATIO[card.colIdx] * layout.columnSpread);
        const rowAnchor = -0.2 + 0.7 * phase.gridCompression;
        const centerY = viewportHeight * (0.5 + (card.rowIdx - rowAnchor) * layout.rowGap);
        card.baseX = centerX - card.width / 2;
        card.baseY = centerY - card.height / 2;
      });
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
    getCards: () => allLayers[0].cards,
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
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        card.width = ml.cardW;
        card.height = Math.round(card.baseHeight * ml.scale);
        if (useDesktopLayout) {
          card.width = CARD_WIDTH;
          card.height = card.baseHeight;
        }
      });
    });
    arcAngle = frame.isMobile ? MOBILE_ARC_ALPHA : Math.atan2(viewportHeight, viewportWidth);
    const titleHeading = titleEl && titleEl.querySelector('.heading');
    cachedHeadlineH = (titleHeading && titleHeading.offsetHeight)
      || (titleEl && titleEl.offsetHeight) || 60;
    positionCards();
    canvasGrid.updateCardAnchors(allLayers);
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

  // Desktop-only: cards slide in from below to take their fan position.
  function renderArcIntro(card, cardScale) {
    const cardIntroProgress = getCardArcIntroProgress(card);
    const cardIntroEase = easeOutCubic(cardIntroProgress);

    const fanPos = getFanCenter(card);
    const { arcRadius, fanCenterX, fanCenterY, middleAngle, arcZoom } = arcGeometry;
    const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
    const fanScale = cardScale * (1 + ARC_LIFT_ZOOM) * fanDepth * arcZoom;

    const compressedArcSpan = ARC_SPAN * INTRO_COMPRESS;
    const compressedArcAngle = middleAngle + compressedArcSpan / 2
      - (card.fanIdx / 7) * compressedArcSpan
      + 0.28;
    const compressedArcX = fanCenterX + arcRadius * Math.cos(compressedArcAngle);
    const compressedArcY = fanCenterY + arcRadius * Math.sin(compressedArcAngle);
    const compressedArcRotation = (
      Math.atan2(Math.cos(compressedArcAngle), -Math.sin(compressedArcAngle)) * 180
    ) / Math.PI;

    const extraOffX = viewportWidth * (0.5 + (1 - card.fanIdx / 7) * INTRO_DISTANCE);
    const extraOffY = (1 - card.fanIdx / 7) * viewportHeight * 0.3;
    const startX = compressedArcX + extraOffX;
    const startY = compressedArcY + extraOffY + viewportHeight * 0.35;

    const currentX = startX + (fanPos.x - startX) * cardIntroEase;
    const currentY = startY + (fanPos.y - startY) * cardIntroEase;
    const rotation = compressedArcRotation
      + (fanPos.rot - compressedArcRotation) * cardIntroEase;

    const furtherness = 1 - card.fanIdx / 7;
    const startScale = 0.50 - furtherness * 0.20;
    const scaleFactor = startScale + (1 - startScale) * cardIntroEase;
    const scale = fanScale * scaleFactor * (0.93 + 0.07 * easeOutBack(cardIntroProgress));
    const cardIntroOpacity = Math.min(1, cardIntroProgress / 0.10);

    card.visualCx = currentX;
    card.visualCy = currentY;
    card.el.style.zIndex = String(31 - card.fanIdx);

    const tiltFactor = Math.max(0, 1 - phase.arcToGrid / 0.12);
    const screenYNorm = (fanPos.y - viewportHeight / 2) / (viewportHeight / 2);
    const cardYTilt = screenYNorm * ARC_Y_TILT * tiltFactor;
    const cardXTilt = -screenYNorm * ARC_X_TILT * tiltFactor;

    applyCardBox(card.el, card);
    setCardTransform(card.el, {
      translateX: currentX - card.baseX - card.width / 2,
      translateY: currentY - card.baseY - card.height / 2,
      scale,
      rotation,
      tiltX: cardXTilt,
      tiltY: cardYTilt,
    });
    card.el.style.opacity = (CARD_OPACITY * cardIntroOpacity).toFixed(3);
    card.el.style.boxShadow = arcCardShadow(0.15);
    setLabelPos(card, currentX, currentY, scale, 0);
  }

  // Arc rotation + peel onto the grid (mobile also includes the rise-from-below slide).
  function renderArcPeelToGrid(card, cardScale) {
    const cardPeelProgress = getCardArcToGridProgress(card);
    const fanPos = getFanCenter(card);
    const { arcZoom } = arcGeometry;
    const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
    const fanScale = cardScale * (1 + ARC_LIFT_ZOOM) * fanDepth * arcZoom;

    const gridCenterX = card.baseX + card.width / 2;
    const gridCenterY = card.baseY + card.height / 2 - pan.arcGridY;

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
    const scale = fanScale + (cardScale - fanScale) * totalPeelEase;
    const rotation = fanPos.rot * (1 - totalPeelEase);

    // Mobile: arc rises from below, staggered per card, overlapping with rotation.
    let mobileSlideX = 0;
    let mobileSlideY = 0;
    let mobileSlideScaleMultiplier = 1;
    let mobileSlideOpacity = 1;
    if (frame.isMobile) {
      const mobileSlideProgress = Math.max(
        0,
        Math.min(1, scroll.current / MOBILE_SLIDE_DURATION),
      );
      const staggerFrac = (1 - card.fanIdx / 7) * MOBILE_SLIDE_STAGGER;
      const cardMobileSlideProgress = Math.max(
        0,
        Math.min(1, (mobileSlideProgress - staggerFrac) / (1 - staggerFrac)),
      );
      const cardMobileSlideEase = easeOutCubic(cardMobileSlideProgress);
      const mobileSlideXMultiplier = MOBILE_SLIDE_START_X
        + (1 - card.fanIdx / 7) * MOBILE_SLIDE_STAGGER_X;
      mobileSlideX = viewportWidth * mobileSlideXMultiplier * (1 - cardMobileSlideEase);
      mobileSlideY = viewportHeight * MOBILE_SLIDE_START_Y * (1 - cardMobileSlideEase);
      mobileSlideScaleMultiplier = MOBILE_SLIDE_SCALE
        + (1 - MOBILE_SLIDE_SCALE) * cardMobileSlideEase;
      mobileSlideOpacity = Math.min(1, cardMobileSlideProgress / 0.25);
    }

    card.visualCx = currentX + mobileSlideX;
    card.visualCy = currentY + mobileSlideY;

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
      translateX: currentX - card.baseX - card.width / 2 + mobileSlideX,
      translateY: currentY - card.baseY - card.height / 2 + mobileSlideY,
      scale: scale * mobileSlideScaleMultiplier,
      rotation,
      tiltX: cardXTilt,
      tiltY: cardYTilt,
    });
    card.el.style.opacity = (CARD_OPACITY * mobileSlideOpacity).toFixed(3);
    card.el.style.boxShadow = arcCardShadow(0.15 * (1 - cardPeelProgress));
    const peelReveal = Math.max(0, Math.min(1, (cardPeelProgress - 0.8) / 0.2));
    setLabelPos(card, currentX, currentY, cardScale, peelReveal);
  }

  // Final glide from on-grid position into its slot in the Acrobat mockup.
  function renderGridToSlot(card, cardScale) {
    const cardSlot = frame.isMobile
      ? getMobileMockupCardSlot(card)
      : getDesktopMockupCardSlot(card.colIdx, card.rowIdx, card.height);
    const endCenterX = cardSlot.x + cardSlot.width / 2;
    const endCenterY = frame.isMobile
      ? cardSlot.y + cardSlot.height / 2 - pan.mobilePostRevealY
      : cardSlot.y + cardSlot.height / 2;
    const endScale = cardSlot.width / card.width;

    const startCenterX = card.baseX + card.width / 2;
    const startCenterY = card.baseY + card.height / 2 - pan.arcGridY;

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
    const inArcIntro = !frame.isMobile
      && phase.arcPan < ARC_INTRO_FRACTION
      && phase.slotting <= 0;
    const inArcPeel = phase.arcToGrid < 1 && phase.slotting <= 0;
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        if (frame.isMobile && card.mobileHidden) {
          hideMobileCard(card);
          return;
        }
        if (inArcIntro) renderArcIntro(card, cardScale);
        else if (inArcPeel) renderArcPeelToGrid(card, cardScale);
        else renderGridToSlot(card, cardScale);
      });
    });
  }

  // ──────────────────── Per-frame loop phases ────────────────────
  let interactive = false;

  function readScrollProgress() {
    const rect = el.getBoundingClientRect();
    const panRange = Math.max(1, el.offsetHeight - window.innerHeight);
    return Math.max(0, Math.min(1, -rect.top / panRange));
  }

  function applyViewportTiming() {
    if (frame.isMobile) {
      timing.gridEnd = MOBILE_GRID_END;
      timing.slottingStart = MOBILE_GRID_END + MOBILE_SETTLE_DURATION;
      timing.slottingDuration = MOBILE_SLOTTING_DURATION;
      timing.postRevealScrollDistance = MOBILE_POST_REVEAL_SCROLL;
    } else {
      timing.gridEnd = DESKTOP_GRID_END;
      timing.slottingStart = DESKTOP_SLOTTING_START;
      timing.slottingDuration = DESKTOP_SLOTTING_DURATION;
      timing.postRevealScrollDistance = 0;
    }
  }

  function updateAnimationProgress() {
    const animScrollTotal = timing.slottingStart + timing.slottingDuration
      + timing.postRevealScrollDistance;
    scroll.current = readScrollProgress() * animScrollTotal;

    phase.arcPan = Math.max(0, Math.min(1, scroll.current / ARC_PAN_END));
    const peelStart = ARC_PAN_END - ARC_PEEL_OVERLAP;
    const peelT = (scroll.current - peelStart) / (timing.gridEnd - peelStart);
    phase.arcToGrid = Math.max(0, Math.min(1, peelT));
    const rawSlottingProgress = (scroll.current - timing.slottingStart) / timing.slottingDuration;
    phase.slotting = Math.max(0, Math.min(1, rawSlottingProgress));
    phase.gridCompression = phase.arcToGrid;
  }

  function updateMockupAndTitleTransform() {
    const slottingEase = easeInOutSine(phase.slotting);
    const mockupScale = 2.5 - 1.5 * slottingEase;
    const mockupHeight = viewportHeight * 0.63;
    const topOverhang = ((2.5 - 1) / 2) * mockupHeight;
    const offscreenY = viewportHeight + topOverhang + 30;
    const mockupTranslateY = (1 - slottingEase) * offscreenY;

    const titleRawT = (scroll.current - timing.slottingStart) / (timing.slottingDuration + 350);
    const titleAnimT = Math.max(0, Math.min(1, titleRawT));
    const titleSlide = easeOutCubic(titleAnimT);
    const titleOpacity = titleSlide;
    const titleScale = 0.92 + 0.08 * titleSlide;

    // Post-mockup reveal pan — mobile only, pans the Acrobat UI up to reveal the CTA.
    const postRevealProgress = timing.postRevealScrollDistance
      ? Math.max(
        0,
        Math.min(
          1,
          (scroll.current - (timing.slottingStart + timing.slottingDuration))
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
      mobileChromeRestY = chromeRestY;
      const ctaRestY = chromeRestY + mobileChromeHeight + 10;
      const postRevealNeeded = Math.max(0, ctaRestY + 40 + 20 - viewportHeight);
      const postRevealPanY = ((easeOutSine(postRevealProgress) + postRevealProgress) / 2)
        * postRevealNeeded;
      pan.mobilePostRevealY = postRevealPanY;
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
      pan.mobilePostRevealY = 0;
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
      ? (ARC_PAN_END - ARC_PEEL_OVERLAP)
        + (MOBILE_GRID_END - (ARC_PAN_END - ARC_PEEL_OVERLAP)) * 0.85
      : ARC_PAN_END * ARC_INTRO_FRACTION;
    const adbeLogoSpan = timing.slottingStart - adbeLogoPeelStart;
    const rawAdbeLogoProgress = (scroll.current - adbeLogoPeelStart) / adbeLogoSpan;
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
    const arcTextPanProgress = Math.max(
      0,
      Math.min(1, (scroll.current - timing.gridEnd) / ARC_SETTLE_DURATION),
    );
    const compressedColGapPx = viewportWidth * CARD_COLUMN_GAP_RATIO * 0.75 - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + DEFAULT_CARD_HEIGHT) / viewportHeight;
    const postPeelT = easeOutSine(arcTextPanProgress);
    const slottingCompression = easeInOutSine(phase.slotting);
    layout.columnSpread = BASE_COLUMN_SPREAD
      + (0.75 - BASE_COLUMN_SPREAD) * phase.arcToGrid
      - 0.15 * postPeelT - 0.15 * slottingCompression;
    layout.rowGap = BASE_ROW_GAP
      + (compressedRowGap - BASE_ROW_GAP) * phase.arcToGrid
      - 0.04 * postPeelT - 0.04 * slottingCompression;
    const textAtRestY = viewportHeight * (0.5 + 0.5 * compressedRowGap)
      + DEFAULT_CARD_HEIGHT / 2
      + 90;
    const arcPanTarget = Math.max(0, textAtRestY - viewportHeight * 0.50);
    pan.arcGridY = arcPanTarget * easeOutSine(arcTextPanProgress);
    if (frame.isMobile) {
      // Mobile pan: starts at peel midpoint (MOBILE_PAN_START ~689), runs 1610 units.
      // Brings the last visible row up to make room for the text block.
      const ml = frame.mobileLayout;
      const mobileRow1CenterY = viewportHeight * 0.50 + ml.tallH / 2 + ml.rowPitch;
      const mobileTextBaseY = mobileRow1CenterY + ml.tallH / 2 + 4 + 22 + 32;
      const mobileTextTarget = Math.max(0, mobileTextBaseY - viewportHeight * 0.50);
      const mobilePanT = Math.max(0, Math.min(1, (scroll.current - MOBILE_PAN_START) / 1610));
      pan.arcGridY = mobileTextTarget * easeOutSine(mobilePanT);
    }
  }

  function updateTextBlock() {
    const arcTextRevealProgress = Math.max(
      0,
      Math.min(1, (scroll.current - timing.gridEnd) / 400),
    );
    const textEase = easeInOutSine(phase.slotting);
    const textScale = 1 - 0.28 * textEase;
    let pinnedTextY;
    if (frame.isMobile) {
      // Text block lands 32px below label of tallest visible-row card.
      const ml = frame.mobileLayout;
      const row1CenterY = viewportHeight * 0.50 + ml.tallH / 2 + ml.rowPitch;
      pinnedTextY = row1CenterY - pan.arcGridY + ml.tallH / 2 + 4 + 22 + 32;
      const gridW = ml.cardW * 2 + MOBILE_COL_GAP;
      const mobileGridLeft = Math.max(
        MOBILE_OUTER_MARGIN,
        Math.round((viewportWidth - gridW) / 2),
      );
      textBlockEl.style.left = `${mobileGridLeft}px`;
    } else {
      const col3Right = viewportWidth
        * (0.5 + CARD_COLUMN_OFFSETS_RATIO[3] * layout.columnSpread)
        + CARD_WIDTH / 2;
      const arcTextLeft = col3Right - textBlockEl.offsetWidth;
      pinnedTextY = viewportHeight * (0.5 + 0.5 * layout.rowGap)
        + DEFAULT_CARD_HEIGHT / 2
        + 90
        + viewportHeight * 0.12
        - pan.arcGridY;
      textBlockEl.style.left = `${arcTextLeft}px`;
    }
    // Mobile: text fades in early in the peel (10%→40%). Desktop: short timer after peel end.
    const arcReveal = frame.isMobile
      ? Math.max(0, Math.min(1, (phase.arcToGrid - 0.1) / 0.3))
      : Math.min(1, arcTextRevealProgress * 2.5);
    const arcTextFadeProgress = Math.max(0, Math.min(1, (phase.slotting - 0.4) / 0.3));
    const textOpacity = Math.max(0, 1 - arcTextFadeProgress) * arcReveal;
    textBlockEl.style.transform = `translateY(${pinnedTextY}px) scale(${textScale})`;
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
    canvasGrid.updateCardAnchors(allLayers);
    canvasGrid.update();
    canvasGrid.draw();
    updateCardPositions();
    rafId = requestAnimationFrame(loop);
  }

  // ──────────────────── Bootstrap ────────────────────
  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  resize();

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
