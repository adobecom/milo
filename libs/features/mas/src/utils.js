import { EVENT_TYPE_READY } from './constants.js';

const MAS_COMMERCE_SERVICE = 'mas-commerce-service';

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
    element.querySelector(`[slot="${name}"]`)?.textContent?.trim();

/**
 * Helper function to create an element with attributes
 * @param {string} tag
 * @param {Object} attributes
 * @param {*} content
 * @returns {HTMLElement}
 */
export function createTag(tag, attributes = {}, content = null, is = null) {
    const element = is
        ? document.createElement(tag, { is })
        : document.createElement(tag);
    if (content instanceof HTMLElement) {
        element.appendChild(content);
    } else {
        element.innerHTML = content;
    }

    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    return element;
}

export function matchMobile() {
  return window.matchMedia('(max-width: 767px)');
}

/**
 * Checks if the current device is mobile based on the screen width.
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobile() {
  return matchMobile().matches;
}

export function printMeasure(measure) {
  return `startTime:${measure.startTime.toFixed(2)}|duration:${measure.duration.toFixed(2)}`;
}

/**
 * Checks if the current device is mobile or tablet based on the screen width.
 * @returns {boolean} True if the device is mobile, otherwise false.
 */
export function isMobileOrTablet() {
    return window.matchMedia('(max-width: 1024px)').matches;
}

/* c8 ignore next 4 */
export function wait(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls given `getConfig` every time new instance of the commerce service is activated,
 * passing new instance as the only argument.
 * @param {(commerce: Commerce.Instance) => void} getConfig
 * @param {{ once?: boolean; }} options
 * @returns {() => void}
 * A function, stopping notifications when called.
 */
export function discoverService(getConfig, { once = false } = {}) {
    let latest = null;
    function discover() {
        /** @type { Commerce.Instance } */
        const current = document.querySelector(MAS_COMMERCE_SERVICE);
        if (current === latest) return;
        latest = current;
        if (current) getConfig(current);
    }
    document.addEventListener(EVENT_TYPE_READY, discover, { once });
    setTimeout(discover, 0);
    return () => document.removeEventListener(EVENT_TYPE_READY, discover);
}

export function getService() {
  return document.getElementsByTagName(MAS_COMMERCE_SERVICE)?.[0];
}
