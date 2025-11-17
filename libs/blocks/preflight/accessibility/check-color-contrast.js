import { getConfig, loadScript } from '../../../utils/utils.js';
import { loadImage } from '../checks/assets.js';

// Calculates the relative luminance of an RGB color.
function luminance(r, g, b) {
  const [R, G, B] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return (c <= 0.03928) ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
}

// Calculates contrast ratio between two luminance values.
function contrastRatio(rgb1, rgb2) {
  const lum1 = luminance(...rgb1);
  const lum2 = luminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Parses an RGB color string into an array of RGB values.
function parseCssRgb(rgbStr) {
  if (!rgbStr) return null;
  const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return match ? match.slice(1, 4).map(Number) : null;
}

// Checks if an alpha value is fully transparent (zero).
function isZeroAlpha(alpha) {
  return alpha === '0' || alpha === '0%' || parseFloat(alpha) === 0;
}

// Checks if an RGBA color string is fully transparent.
function isTransparent(rgbStr) {
  if (!rgbStr) return false;
  const str = rgbStr.trim().toLowerCase();
  if (str === 'transparent') return true;
  if (str.startsWith('rgba(0, 0, 0, 0)')) return true;
  if (str.includes('/ 0')) return true; // CSS4 format like rgb(0 0 0 / 0)
  const modernMatch = str.match(/rgb[a]?\([^)]*\/\s*([\d.]+%?)\s*\)/);
  if (modernMatch) return isZeroAlpha(modernMatch[1]);
  const legacyMatch = str.match(/rgba?\([^)]*,\s*([\d.]+)\s*\)$/);
  if (legacyMatch) return isZeroAlpha(legacyMatch[1]);
  return false;
}

function extractBgImageUrl(bgImageCss) {
  if (!bgImageCss || bgImageCss === 'none') return null;
  const match = bgImageCss.match(/url\(["']?([^"')]+)["']?\)/);
  return match ? match[1] : null;
}

async function loadColorThief() {
  if (window.ColorThief) return window.ColorThief;
  try {
    const { base } = getConfig();
    await loadScript(`${base}/deps/colorThief.js`);
    return window.ColorThief;
  } catch {
    return null;
  }
}

async function getAverageColorFromUrl(url) {
  try {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = url;
    await loadImage(img);
    const thief = new window.ColorThief();
    const color = thief.getColor(img);
    return Array.isArray(color) ? color : null;
  } catch (e) {
    return null;
  }
}

async function getAverageColorFromNearestImg(element) {
  const candidates = [...element.querySelectorAll('img')];
  let el = element.parentElement;
  const maxHops = 5;
  let hops = 0;
  while (el && hops < maxHops) {
    candidates.push(...el.querySelectorAll('img'));
    el = el.parentElement;
    hops += 1;
  }
  if (!candidates.length) return null;
  for (let i = 0; i < candidates.length; i += 1) {
    const img = candidates[i];
    try {
      await loadImage(img);
      const thief = new window.ColorThief();
      const color = thief.getColor(img);
      if (Array.isArray(color)) return color;
    } catch (e) {
      // continue
    }
  }
  return null;
}

// Traverses the DOM to find the effective background color.
function getEffectiveBackgroundColor(element) {
  let el = element;
  while (el) {
    const bgColor = window.getComputedStyle(el).backgroundColor;
    const parsedColor = parseCssRgb(bgColor);
    if (parsedColor && !isTransparent(bgColor)) return parsedColor;
    el = el.parentElement;
  }
  return [255, 255, 255];
}

// get the computed foreground and background colors.
function getComputedColors(element) {
  const styles = window.getComputedStyle(element);
  const fgColor = parseCssRgb(styles.color);
  const bgColor = getEffectiveBackgroundColor(element);
  return { fgColor, bgColor };
}

/**
 * Checks color contrast as per WCAG 2.1 criteria.
 * @param {HTMLElement[]} elements - Elements to evaluate.
 * @param {Object} config - Config containing checks and minContrast.
 * @returns {Array} - List of violations.
 */
export default async function checkColorContrast(elements = [], config = {}) {
  const { checks = [], minContrast = 4.5 } = config;
  if (!checks.includes('color-contrast')) return [];
  const violations = [];
  const validElements = elements.filter((el) => {
    const styles = window.getComputedStyle(el);
    const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden' && parseFloat(styles.opacity) > 0;
    const hasText = el.textContent.trim().length > 0;
    const tagWhitelist = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button'];
    return isVisible && hasText && tagWhitelist.includes(el.tagName.toLowerCase());
  });
  for (const el of validElements) {
    const colorThief = await loadColorThief();
    if (!colorThief) return null;
    const { fgColor, bgColor } = getComputedColors(el);
    // eslint-disable-next-line no-continue
    if (!fgColor || !bgColor) continue;
    const styles = window.getComputedStyle(el);
    const fontSize = parseFloat(styles.fontSize) || 0;
    const fontWeight = parseInt(styles.fontWeight, 10) || 400;
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const requiredContrast = isLargeText ? 3.0 : minContrast;
    const baseContrast = contrastRatio(fgColor, bgColor);

    let effectiveBg = bgColor;
    let usedImageSampling = false;
    let ancestor = el;

    while (ancestor) {
      const bgImage = window.getComputedStyle(ancestor).backgroundImage;
      const url = extractBgImageUrl(bgImage);
      if (url) {
        // eslint-disable-next-line
        const avg = await getAverageColorFromUrl(url);
        if (avg) {
          effectiveBg = avg;
          usedImageSampling = true;
          break;
        }
      }
      ancestor = ancestor.parentElement;
    }

    if (!usedImageSampling) {
      // eslint-disable-next-line
      const avgFromImg = await getAverageColorFromNearestImg(el);
      if (avgFromImg) {
        effectiveBg = avgFromImg;
        usedImageSampling = true;
      }
    }

    const contrast = contrastRatio(fgColor, effectiveBg);
    if (usedImageSampling && contrast < requiredContrast) {
      const description = `Low contrast text over image (ratio: ${contrast.toFixed(2)}:1) - `
        + `WCAG AA Minimum is ${requiredContrast}:1`;
      violations.push({
        description,
        impact: 'serious',
        id: 'color-contrast-image',
        help: `Ensure contrast ratio is at least ${requiredContrast}:1.`,
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
        nodes: [{
          target: [`${el.tagName.toLowerCase()}${el.className ? `.${el.className.replace(/\s+/g, '.')}` : ''}: "${el.textContent.trim().slice(0, 30)}"`],
          html: el.outerHTML,
          contrastRatio: contrast.toFixed(2),
          foreground: `rgb(${fgColor.join(', ')})`,
          background: `rgb(${effectiveBg.join(', ')})`,
          baseBackground: `rgb(${bgColor.join(', ')})`,
        }],
      });
      // eslint-disable-next-line no-continue
      continue;
    }
    if (baseContrast < requiredContrast) {
      const descriptionBase = 'Low contrast text over color background (ratio: '
        + `${baseContrast.toFixed(2)}:1) - WCAG AA Minimum is ${requiredContrast}:1`;
      violations.push({
        description: descriptionBase,
        impact: 'serious',
        id: 'color-contrast',
        help: `Ensure contrast ratio is at least ${requiredContrast}:1.`,
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
        nodes: [{
          target: [`${el.tagName.toLowerCase()}${el.className ? `.${el.className.replace(/\s+/g, '.')}` : ''}: "${el.textContent.trim().slice(0, 30)}"`],
          html: el.outerHTML,
          contrastRatio: baseContrast.toFixed(2),
          foreground: `rgb(${fgColor.join(', ')})`,
          background: `rgb(${bgColor.join(', ')})`,
        }],
      });
      // eslint-disable-next-line no-continue
      continue;
    }
  }
  return violations;
}
