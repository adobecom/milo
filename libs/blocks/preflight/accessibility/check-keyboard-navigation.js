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
    'button',
    'input',
    'textarea',
    'select',
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
  // Check each focusable element for a visible focus indicator
  focusableElements.forEach((el) => {
    const styles = window.getComputedStyle(el);
    const hasVisibleOutline = styles.outlineStyle !== 'none' && parseFloat(styles.outlineWidth) > 0;
    const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow;
    if (hasVisibleOutline || hasBoxShadow) return;
    violations.push({
      description: 'Element does not have a visible focus indicator.',
      impact: 'moderate',
      id: 'focus-visible',
      help: 'Ensure interactive elements show a visible focus indicator on keyboard focus.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
      nodes: [{
        target: [getUniqueSelector(el)],
        html: el.outerHTML,
      }],
    });
  });
  return violations;
}
