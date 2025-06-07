import isFunction from '../lang/isFunction.js';
import matches from './matches.js';

/**
 * A polyfill for the `closest` method which is not natively provided in IE
 * @param {Object} initialElement The DOM element from which to start
 * traversing the DOM upwards to reach a certain parent
 * @param {String} selector The element's parent selector we want to reach.
 * @return {Object} The parent DOM element of the selector, if it is found.
 * Otherwise, the result will be `null`
 */
const closest = (initialElement, selector) => {
  let element = initialElement;
  let closestElement;

  if (!element || !selector) {
    return null;
  }

  if (isFunction(window.Element.prototype.closest)) {
    closestElement = element.closest(selector);
  } else {
    while (element && element.nodeType === 1) {
      if (matches(element, selector)) {
        closestElement = element;
        break;
      }

      element = element.parentNode;
    }
  }

  return closestElement;
};

export default closest;
