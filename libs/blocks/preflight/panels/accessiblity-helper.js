const defaultConfig = {
  checks: ['altText', 'keyboard'],
  minContrast: 4.5,
  include: ['body'],
  exclude: ['.preflight', '.global-navigation', '.global-footer'],
};

// Get a unique selector for an element
function getUniqueSelector(el) {
  if (!el) return '';
  if (el.id) return `#${el.id}`;

  const classNames = el.className?.trim()?.split(/\s+/);
  if (classNames && classNames.length > 0) {
    return `${el.tagName.toLowerCase()}.${classNames.join('.')}`;
  }

  return el.tagName.toLowerCase();
}

// Get elements based on include/exclude selectors
function getFilteredElements(includeSelectors = ['body'], excludeSelectors = []) {
  const includedElements = includeSelectors.flatMap((selector) => Array.from(document.querySelectorAll(`${selector} *`)));

  if (excludeSelectors.length === 0) return includedElements;

  const excludedElements = excludeSelectors.flatMap((selector) => Array.from(document.querySelectorAll(`${selector}, ${selector} *`)));

  return includedElements.filter((el) => !excludedElements.includes(el));
}

// Check alt text for images
function checkImageAltText(elements) {
  const violations = [];
  const images = elements.filter((el) => el.tagName === 'IMG');

  images.forEach((img) => {
    const alt = img.getAttribute('alt');

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
    } else if (/^\d+$/.test(alt.trim()) || alt.trim().length < 3) {
      violations.push({
        description: `Alt text "${alt}" appears meaningless.`,
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

// Check focus indicators for keyboard navigation
function checkKeyboardNavigation(elements) {
  const violations = [];

  const focusableElements = elements.filter((el) => {
    const selectorList = [
      'a[href]',
      'button',
      'input',
      'textarea',
      'select',
      '[tabindex]:not([tabindex="-1"])',
    ];
    return el.matches(selectorList.join(','));
  });

  if (focusableElements.length === 0) {
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

  focusableElements.forEach((el) => {
    const styles = window.getComputedStyle(el);

    const hasVisibleOutline = styles.outlineStyle !== 'none'
      && parseFloat(styles.outlineWidth) > 0;

    const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== '';
    const hasFocusIndicator = hasVisibleOutline || hasBoxShadow;

    if (!hasFocusIndicator) {
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
    }
  });

  return violations;
}

// Main function to run custom accessibility checks
async function customAccessibilityChecks(config = {}) {
  const {
    checks = ['altText', 'keyboard'],
    include = ['body'],
    exclude = [],
  } = { ...defaultConfig, ...config };

  const violations = [];

  const elements = getFilteredElements(include, exclude);

  if (!elements.length) {
    return violations;
  }

  if (checks.includes('altText')) {
    violations.push(...checkImageAltText(elements));
  }

  if (checks.includes('keyboard')) {
    violations.push(...checkKeyboardNavigation(elements));
  }

  return violations;
}

export default customAccessibilityChecks;
