import { CLASS_NAME_HIDDEN, NAMESPACE } from './constants.js';

export function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

export const getSlotText = (element, name) =>
    element.querySelector(`[slot="${name}"]`).textContent.trim();

/**
 * Dispatches custom event of the given `type` on the given `target`.
 * @template T
 * @param {EventTarget} target
 * @param {string} type
 * @param {CustomEventInit<T>} options
 */
export const dispatchAsyncEvent = (
    target,
    type,
    { bubbles = true, cancelable, composed, detail } = {},
) =>
    window.setTimeout(() =>
        target?.dispatchEvent(
            new CustomEvent(type, {
                bubbles,
                cancelable,
                composed,
                detail,
            }),
        ),
    );

/**
 * Finds the closest common ancestor for given array of DOM elements.
 * Note: the search may go up DOM tree beyoud some expected container (e.g. card) and event result in `document.body`.
 * For a good solution, @see https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
 * @param { Element[] } elements
 * Array of DOM elements to find the common ancestor for.
 * @returns { Element | null }
 * The closest common ancestor of the given elements or `null` if none found.
 */
export function getCommonAncestor(...elements) {
    const [first, ...rest] = elements;
    if (!first) return null;
    let ancestor = first.parentElement;
    if (!rest.length) return ancestor;
    while (ancestor) {
        if (rest.every((element) => ancestor.contains(element))) {
            return ancestor;
        }
        ancestor = ancestor.parentElement;
    }
    return null;
}

/**
 * @param {Commerce.Placeholder} placeholder
 * @returns {boolean}
 */
export function isRegularPrice(placeholder) {
    if (placeholder.isInlinePrice) {
        const { template } = placeholder.dataset;
        if (template === 'price' || !template) {
            return true;
        }
    }
    return false;
}

/**
 * Joins an array of string `tokens`,
 * filtering out `falsy` values and replacing non-word characters in each token.
 * @param { string[] } tokens
 * Array of strings to be joined.
 * @param { string } delimiter
 * Delimiter used to join the tokens and replace non-word characters.
 */
const joinTokens = (tokens, delimiter) =>
    tokens
        .flatMap((token) => token?.split?.(/\W+/g))
        .filter((token, index) => token && (index > 0 || token !== NAMESPACE))
        .join(delimiter);

/**
 * Creates a namespaced CSS class name.
 * Replaces any sequence of non-word characters with a single hyphen.
 * @param {...string} args - Components of the class name.
 * @returns {string} - The namespaced and cleaned CSS class name.
 */
export const makeCssClassName = (...args) =>
    `${NAMESPACE}-${joinTokens(args, '-')}`;

/**
 * Creates a namespaced event type.
 * Replaces any sequence of non-word characters with a single colon.
 * @param {...string} args - Components of the event type.
 * @returns {string} The namespaced and cleaned event type.
 */
export const makeEventTypeName = (...args) =>
    `${NAMESPACE}:${joinTokens(args, ':')}`;

/**
 * @param {Commerce.Offers} offers
 * @param {Commerce.filterOffer} filter
 */
export function showOffers(offers, filter = () => true) {
    let i = 0;
    for (const offer of offers.values()) {
        offer.container?.classList.toggle(
            CLASS_NAME_HIDDEN,
            !filter(offer, i++),
        );
    }
}

/**
 * Returns the text nodes of the given element.
 * @param {HTMLElement} element
 * @returns array of text nodes
 */
export function getTextNodes(element) {
    const textNodes = [];
    function findTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(findTextNodes);
        }
    }

    findTextNodes(element);
    return textNodes;
}

/**
 * Helper function to create an element with attributes
 * @param {string} tag
 * @param {Object} attributes
 * @param {*} innerHTML
 * @returns {HTMLElement}
 */
export function createTag(tag, attributes = {}, innerHTML) {
    const element = document.createElement(tag);
    element.innerHTML = innerHTML;

    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    return element;
}

/**
 * Checks if the current device is mobile based on the screen width.
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches;
}

/**
 * Checks if the current device is mobile or tablet based on the screen width.
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobileOrTablet() {
  return window.matchMedia('(max-width: 1024px)').matches;
}
