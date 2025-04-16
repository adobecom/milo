import { getFilteredElements } from './helper.js';
import checkImageAltText from './check-image-alt-text.js';
import checkKeyboardNavigation from './check-keyboard-navigation.js';
import checkColorContrast from './check-color-contrast.js';

const checkFunctions = [
  checkImageAltText,
  checkKeyboardNavigation,
  checkColorContrast,
];

/**
 * Runs custom accessibility checks on filtered elements.
 * @param {Object} config - custom check config (checks, include, exclude).
 * @returns {Array} Violations from all custom checks.
 */
async function customAccessibilityChecks(config = {}) {
  try {
    // Filter DOM elements based on include/exclude
    const elements = getFilteredElements(config.include, config.exclude);
    if (!elements.length) return [];
    return checkFunctions.flatMap((checkFn) => checkFn(elements, config));
  } catch (error) {
    window.lana.log(`Error running custom accessibility checks: ${error.message}`);
    return [];
  }
}

export default customAccessibilityChecks;
