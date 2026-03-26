/**
 * Returns a unique selector string for a given element.
 * @param {HTMLElement} el - Element to generate a selector for.
 * @returns {string} - Unique css selector.
 */
export function getUniqueSelector(el) {
  if (!el) return '';
  if (el.id) return `#${el.id}`;

  const classNames = el.className?.trim()?.split(/\s+/);
  if (classNames && classNames.length > 0) {
    return `${el.tagName.toLowerCase()}.${classNames.join('.')}`;
  }

  return el.tagName.toLowerCase();
}

/**
 * Returns elements included by selectors, excluding specified selectors.
 * @param {string[]} includeSelectors - css selectors to include.
 * @param {string[]} excludeSelectors - css selectors to exclude.
 * @returns {HTMLElement[]} - Filtered DOM elements.
 */
export function getFilteredElements(includeSelectors = ['body'], excludeSelectors = []) {
  const includedElements = includeSelectors.flatMap((selector) => Array.from(document.querySelectorAll(`${selector},  ${selector} *`)));

  if (excludeSelectors.length === 0) return includedElements;

  const excludedElements = excludeSelectors.flatMap((selector) => Array.from(document.querySelectorAll(`${selector}, ${selector} *`)));

  return includedElements.filter((el) => !excludedElements.some((ex) => el.isSameNode(ex)));
}
