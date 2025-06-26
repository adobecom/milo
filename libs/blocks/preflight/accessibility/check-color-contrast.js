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
export default function checkColorContrast(elements = [], config = {}) {
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
  validElements.forEach((el) => {
    const { fgColor, bgColor } = getComputedColors(el);
    if (!fgColor || !bgColor) return;
    const contrast = contrastRatio(fgColor, bgColor);
    const styles = window.getComputedStyle(el);
    const fontSize = parseFloat(styles.fontSize) || 0;
    const fontWeight = parseInt(styles.fontWeight, 10) || 400;
    // WCAG 2.1 Large Text Definition:
    // Bold text >= 14pt (≈ 18.66px), Normal text >= 18pt (≈ 24px)
    // Large text requires contrast ratio of 3:1, Normal text requires 4.5:1
    const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const requiredContrast = isLargeText ? 3.0 : minContrast;
    if (contrast < requiredContrast) {
      violations.push({
        description: `Low contrast text (ratio: ${contrast.toFixed(2)}:1) - WCAG AA Minimum is ${requiredContrast}:1`,
        impact: 'serious',
        id: 'color-contrast',
        help: `Ensure contrast ratio is at least ${requiredContrast}:1.`,
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
        nodes: [{
          target: [`${el.tagName.toLowerCase()}${el.className ? `.${el.className.replace(/\s+/g, '.')}` : ''}: "${el.textContent.trim().slice(0, 30)}"`],
          html: el.outerHTML,
          contrastRatio: contrast.toFixed(2),
          foreground: `rgb(${fgColor.join(', ')})`,
          background: `rgb(${bgColor.join(', ')})`,
        }],
      });
    }
  });
  return violations;
}
