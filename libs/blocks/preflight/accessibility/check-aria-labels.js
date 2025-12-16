import { getUniqueSelector } from './helper.js';

export default function checkAriaLabels(elements = [], config = {}) {
  const { checks = [] } = config;
  if (!checks.includes('aria-labels')) return [];
  const violations = [];
  const targetElements = elements.filter((el) => el.matches('button, [role="button"], .con-button'));

  const missingAriaLabel = targetElements.filter((el) => !el.hasAttribute('aria-label') && !el.textContent.trim());
  missingAriaLabel.forEach((el) => {
    violations.push({
      description: 'Element is missing the aria-label attribute.',
      impact: 'serious',
      id: 'aria-labels',
      help: 'Add the aria-label attribute that describes the element.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6',
      nodes: [{
        target: [getUniqueSelector(el)],
        html: el.outerHTML,
      }],
    });
  });

  const ariaLabelPrefixMismatch = targetElements.filter((el) => {
    const ariaLabel = el.getAttribute('aria-label')?.trim().toLowerCase();
    const textContent = el.textContent?.trim().toLowerCase();
    if (!ariaLabel || !textContent) return false;
    return !ariaLabel.startsWith(textContent);
  });
  ariaLabelPrefixMismatch.forEach((el) => {
    violations.push({
      description: 'Element aria-label does not start with element text content.',
      impact: 'moderate',
      id: 'aria-labels',
      help: 'Ensure the aria-label starts with the element text content.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6',
      nodes: [{
        target: [getUniqueSelector(el)],
        html: el.outerHTML,
      }],
    });
  });

  const anchorsWithAriaLabels = targetElements.filter((el) => el.tagName.toLowerCase() === 'a' && !!el.getAttribute('aria-label') && !!el.href);
  const labelToAnchors = {};
  anchorsWithAriaLabels.forEach((el) => {
    const key = el.getAttribute('aria-label').trim().toLowerCase();
    if (!labelToAnchors[key]) labelToAnchors[key] = [];
    labelToAnchors[key].push(el);
  });

  Object.keys(labelToAnchors).forEach((labelKey) => {
    const els = labelToAnchors[labelKey];
    if (els.length < 2) return;
    const uniqueUrls = new Set(els.map((el) => el.href));
    if (uniqueUrls.size < 2) return;
    const nodes = els.map((el) => ({
      target: [getUniqueSelector(el)],
      html: el.outerHTML,
    }));
    violations.push({
      description: 'Elements share the same aria-label but link to different URLs.',
      impact: 'moderate',
      id: 'aria-labels',
      help: 'Use unique aria-labels for links that navigate to different URLs.',
      helpUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6',
      nodes,
    });
  });
  return violations;
}
