import isFunction from '../lang/isFunction.js';

/**
 * A polyfill for the `matches` method which may not be
 * natively provided in all browsers without being prefixed
 * @param {Object} element The element for which we want to check if it matches the selector.
 * @param {String} selector The selector with which to test the element against.
 * @return {Boolean} Whether the element would be selected by the selector
 */
const matches = (element, selector) => {
  let isMatching;

  if (!element || !selector) {
    return null;
  }

  if (isFunction(window.Element.prototype.matches)) {
    isMatching = element.matches(selector);
  } else {
    const customMatchFunction = function customMatchFunction(s) {
      const matching = (this.document || this.ownerDocument).querySelectorAll(s);
      let index = matching.length;

      do {
        index -= 1;
      } while (index >= 0 && matching.item(index) !== this);

      return index > -1;
    };

    const matchFunction = element.matchesSelector || element.mozMatchesSelector
            || element.msMatchesSelector || element.oMatchesSelector
            || element.webkitMatchesSelector || customMatchFunction;

    isMatching = matchFunction.apply(element, [selector]);
  }

  return isMatching;
};

export default matches;
