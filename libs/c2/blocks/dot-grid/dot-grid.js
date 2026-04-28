import { createTag, getConfig, loadStyle } from '../../../utils/utils.js';
import { ACROBAT_DESKTOP_MOCKUP, ACROBAT_MOBILE_MOCKUP } from './acrobat-mockups.js';
import createCanvasGrid from './canvas-grid.js';

const BP = {
  mobile: () => window.innerWidth <= 767,
  tablet: () => window.innerWidth >= 768 && window.innerWidth <= 1279,
  desktop: () => window.innerWidth >= 1280,
};

const COL_OFFSETS_F = [-0.462, -0.154, 0.154, 0.462];
const COL_GAP_F = COL_OFFSETS_F[1] - COL_OFFSETS_F[0];
const CARD_WIDTH = 192;
const ROW_CARD_H = 230;
const REVEAL_SCROLL = 500;
const GRID_PAN_MAX = 300;
const GRID_PAN_SLOW_RATE = 0.28;
const GRID_PAN_BLEND = 130;
const ACROBAT_START_SCROLL = REVEAL_SCROLL + GRID_PAN_MAX;
const ACROBAT_END_SCROLL = ACROBAT_START_SCROLL + 900;
const ARC_INTRO_FRACTION = 0.10;
const ARC_PAN_END = 1350;
const ARC_PEEL_OVERLAP = ARC_PAN_END * (1 - ARC_INTRO_FRACTION);
const ARC_GRID_END = ARC_PAN_END + 1000;
const ARC_ACROBAT_DUR = 2200;
const ARC_SETTLE_DUR = 1700;
const ARC_ACROBAT_START = ARC_GRID_END + ARC_SETTLE_DUR;

// Mobile timing overrides — shorter peel, no settle, shorter acrobat transition.
const MOB_SETTLE_DUR = 1056;
const MOB_ACROBAT_DUR = 550;
const MOB_GRID_END = Math.round(
  (ARC_PAN_END - ARC_PEEL_OVERLAP) + (ARC_GRID_END - (ARC_PAN_END - ARC_PEEL_OVERLAP)) * 0.5,
);
const MOB_PAN_START = Math.round(((ARC_PAN_END - ARC_PEEL_OVERLAP) + MOB_GRID_END) / 2);
const MOB_ALPHA = 0.6; // arc orientation on portrait screens
const MOB_SLIDE_DUR = 300;
const MOB_SLIDE_STAGGER = 0.45;
const MOB_SLIDE_START_Y = 0.90;
const MOB_SLIDE_SCALE = 0.85;
const MOB_SLIDE_START_X = 0.55;
const MOB_SLIDE_STAGGER_X = 0.20;

// Mobile layout constants
const MOBILE_COL_GAP = 32;
const MOBILE_OUTER_MARGIN = 24;
const MOBILE_POST_REVEAL_SCROLL = 500;
// FAN_IDX maps grid [row][col] → arc position. Arc reads column-by-column L→R,
// bottom-to-top within each column; fanIdx=0 is lower-right (peels first).
const FAN_IDX = [
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
      const imgW = (img && parseInt(img.getAttribute('width'), 10)) || CARD_WIDTH;
      const imgH = (img && parseInt(img.getAttribute('height'), 10)) || ROW_CARD_H;
      const cardH = Math.round(CARD_WIDTH * (imgH / imgW));
      // Mobile mapping: row 0 becomes a 2×2 grid (col%2, floor(col/2)); row 1 is hidden.
      cards.push({
        colIdx,
        rowIdx,
        mobileColIdx: colIdx % 2,
        mobileRowIdx: Math.floor(colIdx / 2),
        mobileHidden: rowIdx !== 0,
        cardH,
        baseHeight: cardH,
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

const ARC_SVG_HTML = `
<svg class="arc-256-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 793 714" fill="none" overflow="visible">
  <path class="arc-256-path" d="M772.755 713.494H611.337C604.324 713.622 597.432 711.662 591.536 707.862C585.641 704.063 581.01 698.596 578.231 692.158L402.994 282.541C402.537 280.946 401.577 279.541 400.258 278.534C398.94 277.527 397.331 276.972 395.672 276.95C394.013 276.929 392.391 277.442 391.046 278.414C389.701 279.386 388.706 280.766 388.207 282.348L279 542.424C278.407 543.83 278.172 545.362 278.315 546.882C278.457 548.402 278.974 549.863 279.819 551.134C280.663 552.406 281.809 553.449 283.155 554.171C284.501 554.893 286.004 555.27 287.531 555.27H407.571C411.208 555.27 414.763 556.341 417.795 558.348C420.827 560.356 423.2 563.211 424.618 566.559L477.174 683.481C478.567 686.762 479.125 690.337 478.799 693.886C478.473 697.435 477.273 700.848 475.306 703.821C473.338 706.793 470.665 709.232 467.526 710.92C464.386 712.608 460.876 713.492 457.311 713.494H20.3044C17.0176 713.475 13.7866 712.642 10.8994 711.072C8.01233 709.501 5.5588 707.241 3.75759 704.492C1.95639 701.743 0.863449 698.592 0.576217 695.318C0.288985 692.045 0.816374 688.751 2.11138 685.731L280.081 23.9607C282.922 16.9565 287.809 10.9715 294.105 6.78681C300.401 2.60216 307.812 0.412351 315.372 0.50329H475.697C483.259 0.403187 490.675 2.58926 496.973 6.77504C503.271 10.9608 508.157 16.951 510.991 23.9607L790.885 685.731C792.18 688.746 792.709 692.035 792.426 695.304C792.142 698.573 791.055 701.721 789.261 704.469C787.466 707.216 785.021 709.478 782.141 711.053C779.261 712.627 776.037 713.466 772.755 713.494V713.494Z"/>
</svg>`;

export default async function init(el) {
  const { titleEl, cards: authoredCards, textBlockEl, ctaEl } = parseAuthoredContent(el);
  const { miloLibs, codeRoot } = getConfig();

  await new Promise((resolve) => {
    loadStyle(`${miloLibs || codeRoot}/c2/blocks/dot-grid/acrobat-mockups.css`, resolve);
  });

  const stage = createTag('div', { class: 'dot-grid-stage' }, `<canvas></canvas>${ARC_SVG_HTML}<div class="world"></div>${ACROBAT_DESKTOP_MOCKUP}${ACROBAT_MOBILE_MOCKUP}`);
  titleEl.classList.add('acrobat-title');
  textBlockEl.classList.add('text-block');
  ctaEl.classList.add('acrobat-cta');
  [titleEl, textBlockEl].forEach((e) => {
    e.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('heading');
  });
  stage.append(titleEl, textBlockEl, ctaEl);
  el.textContent = '';
  el.append(stage);

  const canvas = el.querySelector('canvas');
  const world = el.querySelector('.world');
  const acrobatWinEl = el.querySelector('.acrobat-win');
  const mobAcEl = el.querySelector('.mob-ac');
  const arc256Svg = el.querySelector('.arc-256-svg');
  const arc256Path = el.querySelector('.arc-256-path');

  const cfg = {
    cardScale: 1.15,
    opacity: 1.0,
  };

  const arcStagger = 0.50;
  const arcSpan = 0.80;
  const arcLiftZoom = 1.00;
  const arcYTilt = 25;
  const arcXTilt = 10;
  const introStagger = 0.50;
  const introCompress = 0.20;
  const introDistance = 0.20;

  let W = 0;
  let H = 0;

  const scroll = { current: 0 };
  let cardRevealOffset = REVEAL_SCROLL;
  let gridPanY = 0;
  let arcGridPanY = 0;
  let acrobatT = 0;
  let arcPanT = 0;
  let arcToGridT = 0;
  const arcMode = true;
  let frozenTextY = 0;
  let scrollColSpread = 1.20;
  let scrollRowGap = 0.60;
  let scrollT = 0;
  const baseColSpread = 1.20;
  const baseRowGap = 0.60;

  // Mobile-aware timing — updated each frame based on breakpoint.
  let effGridEnd = ARC_GRID_END;
  let effAcrobatStart = ARC_ACROBAT_START;
  let effAcrobatDur = ARC_ACROBAT_DUR;

  // Mobile chrome rest position (set in loop, read by getMobileAcrobatTarget).
  let mobChromeRestY = 0;
  let mobPostRevealPanY = 0;
  let cachedHeadlineH = 60;

  // Per-frame arc geometry — built once by buildArcCtx().
  let arcAlpha = Math.atan2(1, 1);
  let arcCtx = null;

  const layerDefs = [authoredCards];

  const allLayers = layerDefs.map((cards) => {
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
        fanIdx: FAN_IDX[def.rowIdx][def.colIdx],
        width: CARD_WIDTH,
        baseHeight: def.cardH ?? ROW_CARD_H,
        height: def.cardH ?? ROW_CARD_H,
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
  });

  function getArcIntroLocalT(card) {
    const staggerStart = (1 - card.fanIdx / 7) * introStagger * ARC_INTRO_FRACTION;
    const staggerDur = ARC_INTRO_FRACTION - staggerStart;
    return Math.max(0, Math.min(1, (arcPanT - staggerStart) / staggerDur));
  }

  function getArcToGridLocalT(card) {
    const delay = (card.fanIdx / 7) * arcStagger;
    const win = 1 - arcStagger;
    return Math.max(0, Math.min(1, (arcToGridT - delay) / win));
  }

  // Precompute per-frame arc constants once so getFanCenter doesn't recompute for each card.
  function buildArcCtx() {
    const arcRot0 = arcRotationEase(arcPanT);
    const arcZoom = 1.4 - 0.4 * easeOutCubic(arcToGridT);
    const R = Math.max(W, H) * 1.2 * arcZoom;
    const fanCX = W * 0.5 - R * Math.sin(arcAlpha);
    const fanCY = H * 0.5 + R * Math.cos(arcAlpha) - H * 0.15;
    const thetaM = Math.atan2(-Math.cos(arcAlpha), Math.sin(arcAlpha));
    const rotOffset = arcSpan * 0.5 - arcSpan * 1.5 * arcRot0;
    const effectiveSpan = arcSpan * (1 + 0.4 * arcRot0);
    const flattenT = easeInOutCubic(Math.min(1, arcToGridT / 0.5));
    let tdX = 0;
    let tdY = 0;
    let midX = 0;
    let midY = 0;
    if (flattenT > 0) {
      const midAngle = thetaM + rotOffset;
      midX = fanCX + R * Math.cos(midAngle);
      midY = fanCY + R * Math.sin(midAngle);
      const curTdX = -Math.sin(midAngle);
      const curTdY = Math.cos(midAngle);
      const blendTdX = curTdX + (1 - curTdX) * flattenT;
      const blendTdY = curTdY * (1 - flattenT);
      const tdLen = Math.sqrt(blendTdX * blendTdX + blendTdY * blendTdY);
      tdX = blendTdX / tdLen;
      tdY = blendTdY / tdLen;
    }
    arcCtx = {
      R, fanCX, fanCY, thetaM, rotOffset, effectiveSpan, flattenT, tdX, tdY, midX, midY, arcZoom,
    };
  }

  // Fan arc position — diagonal arc upper-left to lower-right, bowing toward upper-right.
  // Reads arcCtx (built once per frame) so frame-level trig is not repeated per card.
  function getFanCenter(card) {
    const {
      R, fanCX, fanCY, thetaM, rotOffset, effectiveSpan, flattenT, tdX, tdY, midX, midY,
    } = arcCtx;
    const angle = thetaM + effectiveSpan / 2 - (card.fanIdx / 7) * effectiveSpan + rotOffset;
    let x = fanCX + R * Math.cos(angle);
    let y = fanCY + R * Math.sin(angle);
    const cosA = (x - fanCX) / R;
    const sinA = (y - fanCY) / R;
    const arcRot = (Math.atan2(cosA, -sinA) * 180) / Math.PI;
    let rot = arcRot;
    if (flattenT > 0) {
      const proj = (x - midX) * tdX + (y - midY) * tdY;
      const lineX = midX + proj * tdX;
      const lineY = midY + proj * tdY;
      x += (lineX - x) * flattenT;
      y += (lineY - y) * flattenT;
      rot = arcRot * (1 - flattenT);
    }
    return { x, y, rot, rx: cosA, ry: sinA };
  }

  // Responsive mobile grid dims. At W=375 matches base sizing; scales to ~70% grid at W=767.
  function getMobLayout() {
    const t = Math.max(0, Math.min(1, (W - 375) / 392));
    const cardW = Math.round((W * (0.875 - t * 0.175) - MOBILE_COL_GAP) / 2);
    const scale = cardW / CARD_WIDTH;
    const tallH = Math.round(230 * scale);
    return { cardW, scale, tallH, rowPitch: tallH + 61 };
  }

  function getMobileAcrobatTarget(card) {
    const CHROME_W = 294;
    const CHROME_H = 536;
    const TOP_H = 44;
    const BOT_H = 100;
    const COL_GAP = 16;
    const TOP_PAD = 48;
    const BOT_PAD = 8;
    const LABEL_H = 22;
    const LABEL_GAP = 4;
    const ROW_GAP = 24;
    const ROWS = 2;

    const chromeLeft = (W - CHROME_W) / 2;
    const chromeTop = mobChromeRestY || (H - CHROME_H) / 2;
    const canvasTop = chromeTop + TOP_H;
    const canvasH = CHROME_H - TOP_H - BOT_H;

    const availH = canvasH - TOP_PAD - BOT_PAD
      - (ROWS - 1) * ROW_GAP - ROWS * (LABEL_GAP + LABEL_H);
    const tallSlotH = Math.floor(availH / ROWS);
    const acScale = tallSlotH / 230;

    const slotH = Math.round(card.baseHeight * acScale);
    const slotW = Math.round(CARD_WIDTH * acScale);

    const outerX = chromeLeft + (CHROME_W - 2 * slotW - COL_GAP) / 2;
    const rowPitch = tallSlotH + LABEL_GAP + LABEL_H + ROW_GAP;
    const row0CY = canvasTop + TOP_PAD + tallSlotH / 2;
    const cy = row0CY + card.mobileRowIdx * rowPitch;
    const cx = outerX + card.mobileColIdx * (slotW + COL_GAP) + slotW / 2;

    return { x: cx - slotW / 2, y: cy - slotH / 2, w: slotW, h: slotH };
  }

  function getAcrobatTarget(colIdx, rowIdx, cardH) {
    const winW = Math.min(W * 0.686, 988);
    const WIN_L = (W - winW) / 2;
    const WIN_T = H * 0.21 + 12;
    const scale = winW / 988;
    const COL_X = [355, 516, 677, 838];
    const ROW_CY = [194, 409];
    const cw = 146 * scale;
    const ch = cardH * (cw / CARD_WIDTH);
    return {
      x: WIN_L + COL_X[colIdx] * scale - cw / 2,
      y: WIN_T + ROW_CY[rowIdx] * scale - ch / 2,
      w: cw,
      h: ch,
    };
  }

  function positionCards() {
    const mobL = BP.mobile() ? getMobLayout() : null;
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        if (mobL) {
          if (card.mobileHidden) {
            card.baseX = -9999;
            card.baseY = -9999;
            return;
          }
          const gridW = mobL.cardW * 2 + MOBILE_COL_GAP;
          const gridLeft = Math.max(MOBILE_OUTER_MARGIN, Math.round((W - gridW) / 2));
          const cx = gridLeft + card.mobileColIdx * (mobL.cardW + MOBILE_COL_GAP) + mobL.cardW / 2;
          const row0CY = H * 0.50 + mobL.tallH / 2;
          const cy = row0CY + card.mobileRowIdx * mobL.rowPitch;
          card.baseX = cx - card.width / 2;
          card.baseY = cy - card.height / 2;
          return;
        }
        const cx = W * (0.5 + COL_OFFSETS_F[card.colIdx] * scrollColSpread);
        const rowAnchor = arcMode ? (-0.2 + 0.7 * scrollT) : 0.5;
        const cy = H * (0.5 + (card.rowIdx - rowAnchor) * scrollRowGap);
        card.baseX = cx - card.width / 2;
        card.baseY = cy - card.height / 2;
      });
    });
  }

  function getCanvasCardCenter(card) {
    const effReveal = arcMode ? 0 : cardRevealOffset;
    const effPanY = arcMode ? arcGridPanY : gridPanY;
    return {
      x: (arcMode && card.visualCx !== 0) ? card.visualCx : card.baseX + card.width / 2,
      y: (arcMode && card.visualCy !== 0)
        ? card.visualCy
        : card.baseY + card.height / 2 + effReveal - effPanY,
    };
  }

  const canvasGrid = createCanvasGrid(canvas, {
    isMobile: BP.mobile,
    getViewport: () => ({ width: W, height: H }),
    getCards: () => allLayers[0].cards,
    getCardCenter: getCanvasCardCenter,
    getState: () => ({ arcMode, arcToGridT, acrobatT }),
  });

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvasGrid.resize();
    // Update card width/height based on breakpoint so mobile cards are smaller.
    const mobL = BP.mobile() ? getMobLayout() : null;
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        if (mobL) {
          card.width = mobL.cardW;
          card.height = Math.round(card.baseHeight * mobL.scale);
        } else {
          card.width = CARD_WIDTH;
          card.height = card.baseHeight;
        }
      });
    });
    arcAlpha = BP.mobile() ? MOB_ALPHA : Math.atan2(H, W);
    const titleHeading = titleEl && titleEl.querySelector('.heading');
    cachedHeadlineH = (titleHeading && titleHeading.offsetHeight)
      || (titleEl && titleEl.offsetHeight) || 60;
    positionCards();
    canvasGrid.updateCardAnchors(allLayers);
  }

  function setLabelPos(card, cx, cy, scale, opacity) {
    if (!card.labelEl) return;
    if (opacity <= 0) {
      card.labelEl.style.opacity = '0';
      return;
    }
    card.labelEl.style.left = `${cx - (card.width / 2) * scale}px`;
    card.labelEl.style.top = `${cy + (card.height / 2) * scale + 4}px`;
    card.labelEl.style.transform = `scale(${scale})`;
    card.labelEl.style.opacity = opacity.toFixed(3);
  }

  // Card rendering: 3-branch state machine — exactly one branch runs per card per frame.
  //   Arc intro (desktop only: fan slides in), arc rotation + peel to grid, grid-to-Acrobat.
  function updateCardPositions() {
    allLayers.forEach((layer) => {
      layer.cards.forEach((card) => {
        if (BP.mobile() && card.mobileHidden) {
          card.el.style.opacity = '0';
          card.el.style.pointerEvents = 'none';
          if (card.labelEl) card.labelEl.style.opacity = '0';
          return;
        }
        // Mobile pins card scale to 1 so CSS width/height match visual size.
        const cardScale = BP.mobile() ? 1.0 : cfg.cardScale;

        if (!BP.mobile() && arcPanT < ARC_INTRO_FRACTION && acrobatT <= 0) {
          const introLocalT = getArcIntroLocalT(card);
          const introEase = easeOutCubic(introLocalT);

          const fanPos = getFanCenter(card);
          const { R, fanCX, fanCY, thetaM, arcZoom: arcZoomI } = arcCtx;
          const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
          const fanScale = cardScale * (1 + arcLiftZoom) * fanDepth * arcZoomI;

          const compSpan = arcSpan * introCompress;
          const compAngle = thetaM + compSpan / 2 - (card.fanIdx / 7) * compSpan + 0.28;
          const compX = fanCX + R * Math.cos(compAngle);
          const compY = fanCY + R * Math.sin(compAngle);
          const compRot = (Math.atan2(Math.cos(compAngle), -Math.sin(compAngle)) * 180) / Math.PI;

          const extraOffX = W * (0.5 + (1 - card.fanIdx / 7) * introDistance);
          const extraOffY = (1 - card.fanIdx / 7) * H * 0.3;
          const startX = compX + extraOffX;
          const startY = compY + extraOffY + H * 0.35;

          const posX = startX + (fanPos.x - startX) * introEase;
          const posY = startY + (fanPos.y - startY) * introEase;
          const rotation = compRot + (fanPos.rot - compRot) * introEase;

          const furtherness = 1 - card.fanIdx / 7;
          const startScale = 0.50 - furtherness * 0.20;
          const scaleFactor = startScale + (1 - startScale) * introEase;
          const scale = fanScale * scaleFactor * (0.93 + 0.07 * easeOutBack(introLocalT));
          const introOpacity = Math.min(1, introLocalT / 0.10);

          card.visualCx = posX;
          card.visualCy = posY;
          card.el.style.zIndex = String(31 - card.fanIdx);

          const tx = posX - card.baseX - card.width / 2;
          const ty = posY - card.baseY - card.height / 2;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${card.width}px`;
          card.el.style.height = `${card.height}px`;
          const tiltFactor = Math.max(0, 1 - arcToGridT / 0.12);
          const screenYNorm = (fanPos.y - H / 2) / (H / 2);
          const cardYTilt = screenYNorm * arcYTilt * tiltFactor;
          const cardXTilt = -screenYNorm * arcXTilt * tiltFactor;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale}) rotate(${rotation}deg) rotateY(${cardYTilt.toFixed(2)}deg) rotateX(${cardXTilt.toFixed(2)}deg)`;
          card.el.style.opacity = (cfg.opacity * introOpacity).toFixed(3);
          card.el.style.boxShadow = '0 4px 7.1px 0 rgba(0,0,0,0.15), 0 18px 25.1px 0 rgba(0,0,0,0.15), 0 60px 60px 0 rgba(0,0,0,0.15)';
          setLabelPos(card, posX, posY, scale, 0);
        } else if (arcToGridT < 1 && acrobatT <= 0) {
          const cardPeelT = getArcToGridLocalT(card);
          const fanPos = getFanCenter(card);
          const arcZoom = 1.4 - 0.4 * easeOutCubic(arcToGridT);
          const fanDepth = 1 - (card.fanIdx / 7) * 0.30;
          const fanScale = cardScale * (1 + arcLiftZoom) * fanDepth * arcZoom;

          const gridCx = card.baseX + card.width / 2;
          const gridCy = card.baseY + card.height / 2 - arcGridPanY;

          const arcLocalDelay = (card.fanIdx / 7) * arcStagger;
          const arcLocalWin = Math.max(0.01, 1 - arcStagger);
          const arcLocalT = Math.max(0, Math.min(1, (arcPanT - arcLocalDelay) / arcLocalWin));
          const arcLocalE = easeInOutCubic(arcLocalT);

          const pushedX = fanPos.x + fanPos.rx * 60 * arcLocalE;
          const pushedY = fanPos.y + fanPos.ry * 60 * arcLocalE;

          const totalPeelE = easeOutCubic(cardPeelT);
          const posX = pushedX + (gridCx - pushedX) * totalPeelE;
          const posY = pushedY + (gridCy - pushedY) * totalPeelE;
          const scale = fanScale + (cardScale - fanScale) * totalPeelE;
          const rotation = fanPos.rot * (1 - totalPeelE);

          // Mobile: arc rises from below, staggered per card, overlapping with rotation.
          let mobSlideX = 0;
          let mobSlideY = 0;
          let mobSlideScaleMul = 1;
          let mobSlideOpacity = 1;
          if (BP.mobile()) {
            const slideT = Math.max(0, Math.min(1, scroll.current / MOB_SLIDE_DUR));
            const staggerFrac = (1 - card.fanIdx / 7) * MOB_SLIDE_STAGGER;
            const cardSlideT = Math.max(0, Math.min(1, (slideT - staggerFrac) / (1 - staggerFrac)));
            const slideE = easeOutCubic(cardSlideT);
            const slideXMul = MOB_SLIDE_START_X + (1 - card.fanIdx / 7) * MOB_SLIDE_STAGGER_X;
            mobSlideX = W * slideXMul * (1 - slideE);
            mobSlideY = H * MOB_SLIDE_START_Y * (1 - slideE);
            mobSlideScaleMul = MOB_SLIDE_SCALE + (1 - MOB_SLIDE_SCALE) * slideE;
            mobSlideOpacity = Math.min(1, cardSlideT / 0.25);
          }

          card.visualCx = posX + mobSlideX;
          card.visualCy = posY + mobSlideY;

          const isPeeling = cardPeelT > 0.01;
          if (cardPeelT < 0.995) {
            const zBase = isPeeling ? 32 : 20;
            card.el.style.zIndex = String(zBase + (7 - card.fanIdx));
          } else {
            card.el.style.zIndex = '';
          }

          const tx = posX - card.baseX - card.width / 2 + mobSlideX;
          const ty = posY - card.baseY - card.height / 2 + mobSlideY;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${card.width}px`;
          card.el.style.height = `${card.height}px`;
          const tiltFactor = Math.max(0, 1 - arcToGridT / 0.12);
          const screenYNorm = (fanPos.y - H / 2) / (H / 2);
          const cardYTilt = screenYNorm * arcYTilt * tiltFactor;
          const cardXTilt = -screenYNorm * arcXTilt * tiltFactor;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale * mobSlideScaleMul}) rotate(${rotation}deg) rotateY(${cardYTilt.toFixed(2)}deg) rotateX(${cardXTilt.toFixed(2)}deg)`;
          card.el.style.opacity = (cfg.opacity * mobSlideOpacity).toFixed(3);
          const shadowA = (0.15 * (1 - cardPeelT)).toFixed(3);
          card.el.style.boxShadow = `0 4px 7.1px 0 rgba(0,0,0,${shadowA}), 0 18px 25.1px 0 rgba(0,0,0,${shadowA}), 0 60px 60px 0 rgba(0,0,0,${shadowA})`;
          const peelReveal = Math.max(0, Math.min(1, (cardPeelT - 0.8) / 0.2));
          setLabelPos(card, posX, posY, cardScale, peelReveal);
        } else {
          const target = BP.mobile()
            ? getMobileAcrobatTarget(card)
            : getAcrobatTarget(card.colIdx, card.rowIdx, card.height);
          const endCx = target.x + target.w / 2;
          const endCy = BP.mobile()
            ? target.y + target.h / 2 - mobPostRevealPanY
            : target.y + target.h / 2;
          const endScale = target.w / card.width;

          const startCx = card.baseX + card.width / 2;
          const startCy = card.baseY + card.height / 2 - arcGridPanY;

          const et = easeInOutSine(acrobatT);
          const cx = startCx + (endCx - startCx) * et;
          const cy = startCy + (endCy - startCy) * et;
          const scale = cardScale + (endScale - cardScale) * et;
          card.visualCx = cx;
          card.visualCy = cy;
          const tx = cx - card.baseX - card.width / 2;
          const ty = cy - card.baseY - card.height / 2;
          card.el.style.left = `${card.baseX}px`;
          card.el.style.top = `${card.baseY}px`;
          card.el.style.width = `${card.width}px`;
          card.el.style.height = `${card.height}px`;
          card.el.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
          card.el.style.opacity = cfg.opacity;
          card.el.style.boxShadow = '';
          card.el.style.zIndex = '';
          setLabelPos(card, cx, cy, scale, 1);
        }
      });
    });
  }

  let rafId = 0;
  let running = false;
  let interactive = false;

  function readScrollProgress() {
    const rect = el.getBoundingClientRect();
    const panRange = Math.max(1, el.offsetHeight - window.innerHeight);
    return Math.max(0, Math.min(1, -rect.top / panRange));
  }

  function loop() {
    if (!running) return;

    // Mobile-aware timing — shorter peel, no settle, shorter acrobat transition.
    effGridEnd = BP.mobile() ? MOB_GRID_END : ARC_GRID_END;
    effAcrobatStart = BP.mobile() ? (effGridEnd + MOB_SETTLE_DUR) : ARC_ACROBAT_START;
    effAcrobatDur = BP.mobile() ? MOB_ACROBAT_DUR : ARC_ACROBAT_DUR;

    const animScrollTotal = effAcrobatStart + effAcrobatDur
      + (BP.mobile() ? MOBILE_POST_REVEAL_SCROLL : 0);
    scroll.current = readScrollProgress() * animScrollTotal;
    cardRevealOffset = Math.max(0, REVEAL_SCROLL - scroll.current);

    const rawPan = Math.max(0, scroll.current - REVEAL_SCROLL);
    if (rawPan <= GRID_PAN_MAX) {
      gridPanY = rawPan;
    } else {
      const over = rawPan - GRID_PAN_MAX;
      if (over < GRID_PAN_BLEND) {
        const decel = (1 - GRID_PAN_SLOW_RATE) / (2 * GRID_PAN_BLEND);
        gridPanY = GRID_PAN_MAX + over - decel * over * over;
      } else {
        const blendIntegral = (GRID_PAN_BLEND * (1 + GRID_PAN_SLOW_RATE)) / 2;
        gridPanY = GRID_PAN_MAX + blendIntegral + GRID_PAN_SLOW_RATE * (over - GRID_PAN_BLEND);
      }
    }

    const arcTextPanT = arcMode
      ? Math.max(0, Math.min(1, (scroll.current - effGridEnd) / ARC_SETTLE_DUR))
      : 0;
    const arcRevealT = arcMode
      ? Math.max(0, Math.min(1, (scroll.current - effGridEnd) / 400))
      : 0;

    if (arcMode) {
      arcPanT = Math.max(0, Math.min(1, scroll.current / ARC_PAN_END));
      const peelStart = ARC_PAN_END - ARC_PEEL_OVERLAP;
      const peelT = (scroll.current - peelStart) / (effGridEnd - peelStart);
      arcToGridT = Math.max(0, Math.min(1, peelT));
      const acT = (scroll.current - effAcrobatStart) / effAcrobatDur;
      acrobatT = Math.max(0, Math.min(1, acT));
    } else {
      arcPanT = 0;
      arcToGridT = 1;
      const span = ACROBAT_END_SCROLL - ACROBAT_START_SCROLL;
      acrobatT = Math.max(0, Math.min(1, (scroll.current - ACROBAT_START_SCROLL) / span));
    }

    buildArcCtx();

    const acrobatSlide = easeInOutSine(acrobatT);
    const acrobatScale = 2.5 - 1.5 * acrobatSlide;
    const winH = H * 0.63;
    const topOverhang = ((2.5 - 1) / 2) * winH;
    const offscreenY = H + topOverhang + 30;
    const acrobatTranslateY = (1 - acrobatSlide) * offscreenY;

    const titleRawT = (scroll.current - effAcrobatStart) / (effAcrobatDur + 350);
    const titleAnimT = Math.max(0, Math.min(1, titleRawT));
    const titleSlide = easeOutCubic(titleAnimT);
    const titleOpacity = titleSlide;
    const titleScale = 0.92 + 0.08 * titleSlide;

    // Post-acrobat reveal pan — mobile only, pans the Acrobat UI up to reveal the CTA.
    const postRevealT = BP.mobile()
      ? Math.max(0, Math.min(1, (scroll.current - (effAcrobatStart + effAcrobatDur))
          / MOBILE_POST_REVEAL_SCROLL))
      : 0;

    if (BP.mobile()) {
      if (acrobatWinEl) acrobatWinEl.style.transform = '';
      const mobChromeH = 536;
      const mobScale = 2.0 - 1.0 * acrobatSlide;
      const mobTopOverhang = ((2.0 - 1.0) / 2) * mobChromeH;
      const mobOffscreen = H + mobTopOverhang + 30;
      const slideOffset = (1 - acrobatSlide) * mobOffscreen;
      const headlineRestY = H * 0.28;
      const chromeRestY = headlineRestY + cachedHeadlineH + 16;
      mobChromeRestY = chromeRestY;
      const ctaRestY = chromeRestY + mobChromeH + 10;
      const postRevealNeeded = Math.max(0, ctaRestY + 40 + 20 - H);
      const postRevealPanY = ((easeOutSine(postRevealT) + postRevealT) / 2) * postRevealNeeded;
      mobPostRevealPanY = postRevealPanY;
      if (mobAcEl) {
        mobAcEl.style.transform = `translateY(${chromeRestY + slideOffset - postRevealPanY}px) scale(${mobScale})`;
      }
      if (titleEl) {
        titleEl.style.transform = `translateY(${headlineRestY + slideOffset - postRevealPanY}px)`;
        titleEl.style.opacity = titleOpacity;
      }
      if (ctaEl) {
        ctaEl.style.transform = `translateY(${ctaRestY + slideOffset - postRevealPanY}px)`;
      }
    } else {
      mobPostRevealPanY = 0;
      acrobatWinEl.style.transform = `translateY(${acrobatTranslateY}px) scale(${acrobatScale})`;
      if (titleEl) {
        titleEl.style.transform = `translateY(${acrobatTranslateY}px) scale(${titleScale})`;
        titleEl.style.opacity = titleOpacity;
      }
      if (ctaEl) ctaEl.style.transform = `translateY(${acrobatTranslateY}px)`;
    }

    // Arc-256 flourish — draws from start → fully complete just as Acrobat transition begins.
    // Mobile: delayed to 85% through peel so it doesn't draw during arc/peel.
    const arc256PeelStart = BP.mobile()
      ? (ARC_PAN_END - ARC_PEEL_OVERLAP)
        + (MOB_GRID_END - (ARC_PAN_END - ARC_PEEL_OVERLAP)) * 0.85
      : ARC_PAN_END * ARC_INTRO_FRACTION;
    const arc256Span = effAcrobatStart - arc256PeelStart;
    const arc256RawT = (scroll.current - arc256PeelStart) / arc256Span;
    const arc256Progress = Math.max(0, Math.min(1, arc256RawT));
    const arc256DrawT = easeInOutSine(arc256Progress);
    const arc256FadeIn = Math.max(0, Math.min(1, arc256Progress * 6));
    const arc256FadeOut = Math.max(0, 1 - Math.max(0, Math.min(1, (acrobatT - 0.4) / 0.3)));
    // eslint-disable-next-line no-use-before-define
    arc256Path.style.strokeDashoffset = arc256Length * (1 - arc256DrawT);
    arc256Svg.style.opacity = arc256FadeIn * arc256FadeOut;

    // Enable clicks once the acrobat transition has essentially landed.
    const shouldBeInteractive = acrobatT >= 0.95;
    if (shouldBeInteractive !== interactive) {
      interactive = shouldBeInteractive;
      const pe = interactive ? 'auto' : 'none';
      titleEl.style.pointerEvents = pe;
      // TODO: when can this be interactive?
      textBlockEl.style.pointerEvents = pe;
      ctaEl.style.pointerEvents = pe;
    }

    scrollT = arcMode ? arcToGridT : Math.min(1, scroll.current / REVEAL_SCROLL);
    const compressedColGapPx = W * COL_GAP_F * 0.75 - CARD_WIDTH;
    const compressedRowGap = (compressedColGapPx + ROW_CARD_H) / H;
    if (arcMode) {
      const postPeelT = easeOutSine(arcTextPanT);
      const acrobatCmp = easeInOutSine(acrobatT);
      scrollColSpread = baseColSpread + (0.75 - baseColSpread) * arcToGridT
        - 0.15 * postPeelT - 0.15 * acrobatCmp;
      scrollRowGap = baseRowGap + (compressedRowGap - baseRowGap) * arcToGridT
        - 0.04 * postPeelT - 0.04 * acrobatCmp;
      const textAtRestY = H * (0.5 + 0.5 * compressedRowGap) + ROW_CARD_H / 2 + 90;
      const arcPanTarget = Math.max(0, textAtRestY - H * 0.50);
      arcGridPanY = arcPanTarget * easeOutSine(arcTextPanT);
      if (BP.mobile()) {
        // Mobile pan: starts at peel midpoint (MOB_PAN_START ~689), runs 1610 units.
        // Brings the last visible row up to make room for the text block.
        const ml = getMobLayout();
        const mobRow1Cy = H * 0.50 + ml.tallH / 2 + ml.rowPitch;
        const mobTextBaseY = mobRow1Cy + ml.tallH / 2 + 4 + 22 + 32;
        const mobTextTarget = Math.max(0, mobTextBaseY - H * 0.50);
        const mobPanT = Math.max(0, Math.min(1, (scroll.current - MOB_PAN_START) / 1610));
        arcGridPanY = mobTextTarget * easeOutSine(mobPanT);
      }
    } else {
      scrollColSpread = baseColSpread + (0.75 - baseColSpread) * scrollT;
      scrollRowGap = baseRowGap + (compressedRowGap - baseRowGap) * scrollT;
      arcGridPanY = 0;
    }

    const textEt = easeInOutSine(acrobatT);
    const textScale = 1 - 0.28 * textEt;
    if (arcMode) {
      if (BP.mobile()) {
        // Text block lands 32px below label of tallest visible-row card.
        const ml = getMobLayout();
        const row1Cy = H * 0.50 + ml.tallH / 2 + ml.rowPitch;
        frozenTextY = row1Cy - arcGridPanY + ml.tallH / 2 + 4 + 22 + 32;
        const gridW = ml.cardW * 2 + MOBILE_COL_GAP;
        const mobGridLeft = Math.max(MOBILE_OUTER_MARGIN, Math.round((W - gridW) / 2));
        textBlockEl.style.left = `${mobGridLeft}px`;
      } else {
        const col3Right = W * (0.5 + COL_OFFSETS_F[3] * scrollColSpread) + CARD_WIDTH / 2;
        const arcTextLeft = col3Right - textBlockEl.offsetWidth;
        frozenTextY = H * (0.5 + 0.5 * scrollRowGap) + ROW_CARD_H / 2 + 90 + H * 0.12 - arcGridPanY;
        textBlockEl.style.left = `${arcTextLeft}px`;
      }
      // Mobile: text fades in early in the peel (10%→40%). Desktop: short timer after peel end.
      const arcReveal = BP.mobile()
        ? Math.max(0, Math.min(1, (arcToGridT - 0.1) / 0.3))
        : Math.min(1, arcRevealT * 2.5);
      const arcTextFadeT = Math.max(0, Math.min(1, (acrobatT - 0.4) / 0.3));
      const textOpacity = Math.max(0, 1 - arcTextFadeT) * arcReveal;
      textBlockEl.style.transform = `translateY(${frozenTextY}px) scale(${textScale})`;
      textBlockEl.style.opacity = textOpacity;
    } else {
      const textScrollT = Math.min(1, scroll.current / REVEAL_SCROLL);
      const textColSpread = baseColSpread + (0.75 - baseColSpread) * textScrollT;
      const tCompColGapPx = W * COL_GAP_F * textColSpread - CARD_WIDTH;
      const tCompRowGap = (tCompColGapPx + ROW_CARD_H) / H;
      const textRowGapVal = baseRowGap + (tCompRowGap - baseRowGap) * textScrollT;
      const textLeft = W * (0.5 + COL_OFFSETS_F[0] * textColSpread) - CARD_WIDTH / 2;
      const textBaseY = H * (0.5 + 0.5 * textRowGapVal) + ROW_CARD_H / 2 + 90;
      if (acrobatT <= 0) frozenTextY = textBaseY - gridPanY;
      const textOpacity = Math.max(0, 1 - textEt);
      textBlockEl.style.left = `${textLeft}px`;
      textBlockEl.style.transform = `translateY(${frozenTextY}px) scale(${textScale})`;
      textBlockEl.style.opacity = textOpacity;
    }

    positionCards();
    canvasGrid.updateCardAnchors(allLayers);
    canvasGrid.update();
    canvasGrid.draw();
    updateCardPositions();
    rafId = requestAnimationFrame(loop);
  }

  const onResize = () => resize();

  window.addEventListener('resize', onResize);

  // dasharray >> path length so the full dash covers the path with no snake effect
  const arc256Length = Math.max(arc256Path.getTotalLength(), 3000) * 2 + 500;
  arc256Path.style.strokeDasharray = arc256Length;
  arc256Path.style.strokeDashoffset = arc256Length;

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
