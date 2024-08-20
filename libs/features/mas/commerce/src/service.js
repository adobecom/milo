import { Checkout } from './checkout.js';
import * as Constants from './constants.js';
import { EVENT_TYPE_READY, TAG_NAME_SERVICE } from './constants.js';
import { Defaults } from './defaults.js';
import { isFunction } from './external.js';
import { Ims } from './ims.js';
import { fetchPriceLiterals } from './literals.js';
import { Log } from './log.js';
import { Price } from './price.js';
import { getSettings } from './settings.js';
import { Wcs } from './wcs.js';
import { setImmediate } from './utilities.js';

/**
 * Custom web component to provide active instance of commerce service
 * to consumers, appended to the head section of current document.
 */
export class HTMLWcmsCommerceElement extends HTMLElement {
    /** @type {Commerce.Instance} */
    static instance;
    /** @type {Promise<Commerce.Instance>} */
    static promise = null;

    get isWcmsCommerce() {
        return true;
    }
    // Service API is defined below, in `activateService` method
}

// Register service component
window.customElements.define(TAG_NAME_SERVICE, HTMLWcmsCommerceElement);

/**
 * @param {Commerce.Config} config
 * @returns {Promise<Commerce.Instance>}
 */
async function activateService(config, dataProviders) {
    // Load settings and literals
    const log = Log.init(config.env).module('service');
    log.debug('Activating:', config);
    /** @type {Commerce.Literals} */
    const literals = { price: {} };
    const settings = Object.freeze(getSettings(config));
    // Fetch price literals
    try {
        literals.price = await fetchPriceLiterals(settings);
    } catch (error) {
        log.warn('Price literals were not fetched:', error);
    }
    // Create checkout/price options providers registry
    const providers = {
        /** @type {Set<Commerce.Checkout.provideCheckoutOptions>} */
        checkout: new Set(),
        /** @type {Set<Commerce.Price.providePriceOptions>} */
        price: new Set(),
    };
    // Create custom web component to expose service instance to the DOM
    const element = document.createElement(TAG_NAME_SERVICE);
    const startup = { literals, providers, settings };
    // Extend web component object with service API
    // @ts-ignore
    HTMLWcmsCommerceElement.instance = Object.defineProperties(
        element,
        Object.getOwnPropertyDescriptors({
            // Activate modules and expose their API as combined flat object
            ...Checkout(startup, dataProviders),
            ...Ims(startup),
            ...Price(startup),
            ...Wcs(startup),
            ...Constants,
            // Defined serviceweb  component API
            Log,
            get defaults() {
                return Defaults;
            },
            get literals() {
                return literals;
            },
            get log() {
                return Log;
            },
            get providers() {
                return {
                    checkout(provider) {
                        providers.checkout.add(provider);
                        return () => providers.checkout.delete(provider);
                    },
                    price(provider) {
                        providers.price.add(provider);
                        return () => providers.price.delete(provider);
                    },
                };
            },
            get settings() {
                return settings;
            },
        }),
    );
    log.debug('Activated:', { literals, settings, element });
    // Append web component and dispatch "ready" event
    document.head.append(element);
    setImmediate(() => {
        const event = new CustomEvent(EVENT_TYPE_READY, {
            bubbles: true,
            cancelable: false,
            detail: HTMLWcmsCommerceElement.instance,
        });
        HTMLWcmsCommerceElement.instance.dispatchEvent(event);
    });
    return HTMLWcmsCommerceElement.instance;
}

/** @type {Commerce.resetService} */
export function resetService() {
    // Remove service web component
    document.head.querySelector(TAG_NAME_SERVICE)?.remove();
    HTMLWcmsCommerceElement.promise = null;
    Log.reset();
}

/** @type {Commerce.initService} */
export function initService(getConfig, getProviders) {
    // Callback is provided, activate service or/and return its promise
    if (isFunction(getConfig)) {
        const dataProviders = isFunction(getProviders) ? getProviders() : {};
        if (dataProviders.force) resetService();
        return (HTMLWcmsCommerceElement.promise ??= activateService(
            getConfig(),
            dataProviders,
        ));
    }
    // Return existing promise
    if (HTMLWcmsCommerceElement.promise) return HTMLWcmsCommerceElement.promise;
    // Return new promise resolving on "ready" event with new instance of service
    return new Promise((resolve) => {
        const listener = (event) => {
            resolve(event.detail);
        };
        document.head.addEventListener(EVENT_TYPE_READY, listener, {
            once: true,
        });
    });
}
