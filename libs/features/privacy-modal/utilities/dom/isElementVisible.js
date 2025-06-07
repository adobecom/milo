/**
 * Checks if an element is visible on the page
 * @param {HTMLElement} elem Element to be checked for visibility
 * @returns {Boolean} <em>True</em> if the element is visible, <em>false</em> otherwise
 */
const isElementVisible = (elem) => !!(elem
  && elem instanceof HTMLElement
  && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
  && window.getComputedStyle(elem).getPropertyValue('visibility') !== 'hidden');

export default isElementVisible;
