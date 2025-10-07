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
    element?.querySelector(`[slot="${name}"]`)?.textContent?.trim();

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

export function historyPushState(queryParams) {
    if (!window.history.pushState) return;
    const newURL = new URL(window.location.href);
    newURL.search = `?${queryParams}`;
    window.history.pushState({ path: newURL.href }, '', newURL.href);    
}

export function updateHash(key, value) {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    hash.set(key, value);
    window.location.hash = hash.toString();
}

/**
 * Convert the query params to hash
 * @param {string[]} keys - The keys to convert to hash
 */
export function paramsToHash(keys = []) {
    keys.forEach(key => {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get(key);
        if (!value) return;
        if (window.location.hash.includes(`${key}=`)) { // in case the key already exists in the hash, update the hash
            updateHash(key, value);
        } else { // otherwise, add the key to the hash
            window.location.hash = window.location.hash ? `${window.location.hash}&${key}=${value}` : `${key}=${value}`;
        }
        urlParams.delete(key);
        historyPushState(urlParams.toString());
    });
}

export function getOuterHeight(element) {
    const style = window.getComputedStyle(element);
    return element.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
}

