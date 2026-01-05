import { getUniqueSelector } from './helper.js';

/**
 * Check that focusable elements have visible focus indicators.
 * @param {HTMLElement[]} elements - DOM elements to check.
 * @param {Object} config - Optional configuration object (expects `checks` array).
 * @returns {Array} List of accessibility violations.
 */
export default function checkKeyboardNavigation(elements = [], config = {}) {
  const { checks = [] } = config;
  // Skip this check if 'keyboard' isn't enabled in the config
  if (!checks.includes('keyboard')) return [];
  const violations = [];
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  const focusableElements = elements.filter((el) => el.matches(focusableSelectors.join(',')));
  // No focusable elements found - report critical violation
  if (!focusableElements.length) {
    violations.push({
      description: 'Ensures focusable elements have a visible focus indicator.',
      impact: 'critical',
      id: 'focus-visible',
      help: 'Ensure all interactive elements can be focused using the keyboard.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
      nodes: [],
    });
    return violations;
  }
  const isVisiblyRendered = (el) => {
    const styles = window.getComputedStyle(el);
    if (styles.display === 'none' || styles.visibility === 'hidden' || parseFloat(styles.opacity) === 0) return false;
    const elBox = el.getBoundingClientRect();
    if (elBox.width <= 0 || elBox.height <= 0) return false;
    return true;
  };
  focusableElements.forEach((el) => {
    if (isVisiblyRendered(el)) return;
    violations.push({
      description: 'Element is not visibly rendered; keyboard focus may not be perceivable.',
      impact: 'critical',
      id: 'focus-visible',
      help: 'Ensure elements are visible and occupy space so keyboard focus is perceivable.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
      nodes: [{
        target: [getUniqueSelector(el)],
        html: el.outerHTML,
      }],
    });
  });
  return violations;
}
