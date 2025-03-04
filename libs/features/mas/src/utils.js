import { HEADER_X_REQUEST_ID } from './constants.js';

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

/* c8 ignore next 4 */
export function wait(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFetchErrorMessage(
    error,
    response,
    url,
    { start, duration },
) {
    let message = `${error}: ${response?.status}, url: ${url.toString()}`;
    const requestId = response?.headers?.get(HEADER_X_REQUEST_ID);
    if (requestId) {
        message = `${message}, ${HEADER_X_REQUEST_ID}: ${requestId}`;
    }
    if (start && duration) {
        message = `${message}, start: ${start}, duration: ${duration}`;
    }
    return message;
}
