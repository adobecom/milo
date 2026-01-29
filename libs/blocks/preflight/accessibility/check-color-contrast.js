import { loadScript, getConfig } from '../../../utils/utils.js';
import { getUniqueSelector } from './helper.js';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const parseCssColorToRgb = (cssColor) => {
  if (!cssColor) return [0, 0, 0];
  const match = cssColor.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/i);
  if (!match) return [0, 0, 0];
  const r = Math.round(parseFloat(match[1]));
  const g = Math.round(parseFloat(match[2]));
  const b = Math.round(parseFloat(match[3]));
  return [r, g, b];
};

// FYI: all scary numbers below are from the WCAG formulas: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance

// Converts RGB values to linear light for luminance math
// because raw RGB values are not reliable for color contrast calculations
const srgbToLinear = (channel) => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = ([r, g, b]) => (
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
);

const contrastRatio = (fg, bg) => {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
};

const averageBackgroundColor = (ctx, x, y, w, h) => {
  if (w <= 0 || h <= 0) return [255, 255, 255];
  const { data } = ctx.getImageData(x, y, w, h);
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumA = 0;
  // loop through every pixel
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    sumR += data[i] * a;
    sumG += data[i + 1] * a;
    sumB += data[i + 2] * a;
    sumA += a;
  }
  if (sumA === 0) return [255, 255, 255];
  const r = Math.round(sumR / sumA);
  const g = Math.round(sumG / sumA);
  const b = Math.round(sumB / sumA);
  return [clamp(r, 0, 255), clamp(g, 0, 255), clamp(b, 0, 255)];
};

const captureDocumentCanvas = async () => {
  const docEl = document.documentElement;
  const { body } = document;
  const width = Math.max(docEl.scrollWidth, body.scrollWidth, docEl.clientWidth);
  const height = Math.max(docEl.scrollHeight, body.scrollHeight, docEl.clientHeight);
  return window.html2canvas(docEl, {
    useCORS: true,
    backgroundColor: null,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
    scale: 1,
    logging: false,
    onclone: (clonedDoc) => {
      ['.milo-preflight-overlay', '#preflight', '.modal-curtain.is-open', '.preflight-decoration', '.notification-controls-container']
        .forEach((selector) => {
          clonedDoc
            .querySelectorAll(selector)
            .forEach((el) => el.remove());
        });
    },
  });
};

const getWorstContrast = ({
  textNode,
  text,
  fgRgb,
  ctx,
  canvasWidth,
  canvasHeight,
  scrollX,
  scrollY,
}) => {
  let minRatio = Infinity;
  const updateWorstContrast = (charIndex) => {
    try {
      const range = document.createRange();
      range.setStart(textNode, charIndex);
      range.setEnd(textNode, charIndex + 1);
      const rects = Array.from(range.getClientRects());
      if (!rects.length) return;

      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const w = Math.max(0, Math.floor(right - left));
      const h = Math.max(0, Math.floor(bottom - top));
      if (w === 0 || h === 0) return;

      const x = clamp(Math.floor(left + scrollX), 0, canvasWidth);
      const y = clamp(Math.floor(top + scrollY), 0, canvasHeight);
      const safeW = clamp(w, 0, canvasWidth - x);
      const safeH = clamp(h, 0, canvasHeight - y);
      if (safeW <= 0 || safeH <= 0) return;

      const bgRgb = averageBackgroundColor(ctx, x, y, safeW, safeH);
      const ratio = contrastRatio(fgRgb, bgRgb);
      if (ratio < minRatio) minRatio = ratio;
    } catch (e) {
      // ignore per-letter measurement failures
    }
  };

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch && !/\s/.test(ch)) {
      updateWorstContrast(i);
    }
  }

  return minRatio;
};

const collectTextElements = (elements) => elements
  .filter((element) => {
    const { width, height } = element.getBoundingClientRect();
    return width > 0 && height > 0;
  })
  .flatMap((element) => {
    // collect only direct text child nodes to avoid duplicates while iterating all elements
    const directTextNodes = Array
      .from(element.childNodes)
      .filter((node) => (
        node.nodeType === Node.TEXT_NODE
        && node.textContent?.trim()
      ));

    const collected = directTextNodes.map((textNode) => {
      try {
        const range = document.createRange();
        range.selectNodeContents(textNode);
        const rects = Array.from(range.getClientRects());

        if (!rects.length) return null;
        const left = Math.min(...rects.map((r) => r.left));
        const top = Math.min(...rects.map((r) => r.top));
        const right = Math.max(...rects.map((r) => r.right));
        const bottom = Math.max(...rects.map((r) => r.bottom));
        const width = Math.max(0, right - left);
        const height = Math.max(0, bottom - top);
        if (width === 0 || height === 0) return null;

        const { parentElement } = textNode;
        const { color = '' } = parentElement ? window.getComputedStyle(parentElement) : {};

        return {
          element: textNode,
          boxCoordinates: { x: left, y: top, width, height },
          color,
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    return collected;
  });

const hideTextElements = (textElements) => {
  textElements.forEach((item) => {
    const textNode = item.element;
    const parent = textNode?.parentNode;

    if (!parent
      // avoid double-wrapping if already hidden by this step
      || (textNode.parentElement
      && textNode.parentElement.dataset
      && textNode.parentElement.dataset.preflightHiddenText === 'true')
    ) return;

    const wrapper = document.createElement('span');
    wrapper.style.visibility = 'hidden';
    wrapper.dataset.preflightHiddenText = 'true';
    parent.insertBefore(wrapper, textNode);
    wrapper.appendChild(textNode);
  });
};

const restoreHiddenText = () => {
  document.querySelectorAll('span[data-preflight-hidden-text="true"]').forEach((wrapper) => {
    const parent = wrapper.parentNode;
    const child = wrapper.firstChild;
    if (!parent || !child) return;
    parent.insertBefore(child, wrapper);
    wrapper.remove();
  });
};

const buildThumbnail = (item, canvasWidth, canvasHeight, scrollX, scrollY, canvasSource) => {
  let thumbX = 0;
  let thumbY = 0;
  let thumbWsrc = 0;
  let thumbHsrc = 0;
  if (item.boxCoordinates) {
    const nodeLeft = Math.floor(item.boxCoordinates.x || 0);
    const nodeTop = Math.floor(item.boxCoordinates.y || 0);
    const nodeW = Math.floor(item.boxCoordinates.width || 0);
    const nodeH = Math.floor(item.boxCoordinates.height || 0);
    const nx = clamp(Math.floor(nodeLeft + scrollX), 0, canvasWidth);
    const ny = clamp(Math.floor(nodeTop + scrollY), 0, canvasHeight);
    const nw = clamp(nodeW, 0, canvasWidth - nx);
    const nh = clamp(nodeH, 0, canvasHeight - ny);
    if (nw > 0 && nh > 0) {
      thumbX = nx;
      thumbY = ny;
      thumbWsrc = nw;
      thumbHsrc = nh;
    }
  }
  if (!(thumbWsrc > 0 && thumbHsrc > 0)) return null;
  const thumbMax = 320;
  const scale = Math.min(1, thumbMax / Math.max(thumbWsrc, thumbHsrc));
  const thumbW = Math.max(1, Math.floor(thumbWsrc * scale));
  const thumbH = Math.max(1, Math.floor(thumbHsrc * scale));
  const thumb = document.createElement('canvas');
  thumb.width = thumbW;
  thumb.height = thumbH;
  const tctx = thumb.getContext('2d');
  if (!tctx) return null;
  tctx.drawImage(
    canvasSource,
    thumbX,
    thumbY,
    thumbWsrc,
    thumbHsrc,
    0,
    0,
    thumbW,
    thumbH,
  );
  return thumb.toDataURL('image/png');
};

const applyContrastSampling = (textElements, backgroundCanvas, fullCanvas) => {
  if (!backgroundCanvas) return;
  const ctx = backgroundCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const { width: canvasWidth, height: canvasHeight } = backgroundCanvas;
  const scrollX = Math.round(window.scrollX || window.pageXOffset || 0);
  const scrollY = Math.round(window.scrollY || window.pageYOffset || 0);

  textElements.forEach((item) => {
    const { element: textNode, color } = item;
    const text = textNode?.textContent || '';
    if (!textNode || !text.length) return;

    const fgRgb = parseCssColorToRgb(color);
    const minRatio = getWorstContrast({
      textNode,
      text,
      fgRgb,
      ctx,
      canvasWidth,
      canvasHeight,
      scrollX,
      scrollY,
    });

    if (minRatio === Infinity) return;
    item.contrastRatio = minRatio;
    const thumbnail = buildThumbnail(
      item,
      canvasWidth,
      canvasHeight,
      scrollX,
      scrollY,
      fullCanvas || backgroundCanvas,
    );
    if (!thumbnail) return;
    item.thumbnail = thumbnail;
  });
};

const buildViolations = (textElements, minContrast) => {
  const violations = [];
  textElements.forEach((item) => {
    const el = item.element?.parentElement;
    if (!el) return;
    const styles = window.getComputedStyle(el);
    const fontSize = parseFloat(styles.fontSize) || 0;
    const weightStr = styles.fontWeight || '400';
    const parsedWeight = parseInt(weightStr, 10);
    let fontWeight;
    if (Number.isNaN(parsedWeight)) {
      fontWeight = weightStr.toLowerCase() === 'bold' ? 700 : 400;
    } else {
      fontWeight = parsedWeight;
    }
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const requiredContrast = isLargeText ? 3.0 : minContrast;
    const baseContrast = item.contrastRatio;
    if (typeof baseContrast !== 'number' || baseContrast >= requiredContrast) return;

    const target = getUniqueSelector(el);
    const preview = (el.textContent || '').trim().slice(0, 30);
    const nodeTarget = preview ? `${target}: "${preview}"` : target;

    violations.push({
      description: `Color contrast below minimum (current: ${baseContrast.toFixed(2)}:1, required: ${requiredContrast}:1).`,
      impact: 'serious',
      id: 'color-contrast-ratio',
      help: `Ensure contrast ratio is at least ${requiredContrast}:1.`,
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
      nodes: [{
        target: [nodeTarget],
        html: el.outerHTML,
        thumbnail: item.thumbnail,
      }],
    });
  });
  return violations;
};

export default async function checkColorContrast(elements = [], config = {}) {
  const { checks = [], minContrast = 4.5 } = config;
  if (!checks.includes('color-contrast')) return [];

  // Step 1: collect visible text nodes, their bounding boxes, and color.
  const textElements = collectTextElements(elements);

  // Step 2: add visibility hidden to all the text elements, to have a clean DOM for the canvas
  hideTextElements(textElements);

  // Step 3: capture DOM on canvas
  const { base } = getConfig();
  await loadScript(`${base}/deps/html2canvas.js`);
  const backgroundCanvas = await captureDocumentCanvas();

  // Step 4: restore the visibility of the text elements
  restoreHiddenText();

  // Step 5: Capture a full snapshot, with text visible, for thumbnails
  const fullCanvas = await captureDocumentCanvas();

  // Step 6: per character from each text node, sample background from textless canvas,
  // calculate color contrast, keep the worst ratio per node
  applyContrastSampling(textElements, backgroundCanvas, fullCanvas);

  // Step 7: create violation entries for low-contrast text nodes
  return buildViolations(textElements, minContrast);
}
