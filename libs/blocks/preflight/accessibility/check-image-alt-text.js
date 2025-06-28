import { getUniqueSelector } from './helper.js';

/**
 * Check for valid alt text on <img> elements.
 * @param {HTMLElement[]} elements - The DOM elements to check.
 * @param {Object} config - Optional configuration object.
 * @returns {Array} List of accessibility violations for images.
 */
export default function checkImageAltText(elements = [], config = {}) {
  const { checks = [] } = config;
  // Skip this check if 'altText' isn't enabled in the config
  if (!checks.includes('altText')) return [];
  const violations = [];
  const images = elements.filter((el) => el.tagName === 'IMG');
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    const role = (img.getAttribute('role') || '').toLowerCase();
    const ariaHidden = img.getAttribute('aria-hidden') === 'true';
    const isDecorative = role === 'presentation' || ariaHidden || alt === '';
    const style = window.getComputedStyle(img);
    const isHidden = style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0;
    if (isDecorative || isHidden) return;
    // Missing alt attribute or value is incorrect ( numbers or too short)
    if (alt === null) {
      violations.push({
        description: 'Image is missing an alt attribute.',
        impact: 'serious',
        id: 'image-alt',
        help: 'Add an alt attribute that describes the image.',
        helpUrl: 'https://www.w3.org/WAI/tutorials/images/',
        nodes: [{
          target: [getUniqueSelector(img)],
          html: img.outerHTML,
        }],
      });
      return;
    }
    const altTrimmed = alt.trim();
    const isNumeric = /^\d+$/.test(alt.trim());
    const isShort = altTrimmed.length < 3;
    if (isNumeric || isShort) {
      violations.push({
        description: `Alt text "${alt}" is too short (less than 3 characters) or numeric.`,
        impact: 'serious',
        id: 'image-alt',
        help: 'Provide descriptive alt text that conveys the purpose of the image.',
        helpUrl: 'https://www.w3.org/WAI/tutorials/images/decision-tree/',
        nodes: [{
          target: [getUniqueSelector(img)],
          html: img.outerHTML,
        }],
      });
    }
  });
  return violations;
}
