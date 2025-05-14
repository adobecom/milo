import { Checkout } from './checkout.js';
import * as Constants from './constants.js';
import { EVENT_TYPE_READY, SELECTOR_MAS_ELEMENT } from './constants.js';
import { Defaults } from './defaults.js';
import { Ims } from './ims.js';
import { getPriceLiterals } from './literals.js';
import { Log } from './log.js';
import { Price } from './price.js';
import { getSettings } from './settings.js';
import { Wcs } from './wcs.js';
import { updateConfig as updateLanaConfig } from './lana.js';

export const TAG_NAME_SERVICE = 'mas-commerce-service';

const MARK_START = 'mas:start';
const MARK_READY = 'mas:ready';

export const MEASURE_INIT_TIME = 'mas-commerce-service:initTime';

/**
 * web component to provide commerce and fragment service to consumers.
 */
export class MasCommerceService extends HTMLElement {
    #initDuration;

    lastLoggingTime = 0;
    get #config() {
        const env = this.getAttribute('env') ?? 'prod';
        const config = {
            commerce: { env },
            hostEnv: { name: env },
            lana: {
                tags: this.getAttribute('lana-tags'),
                sampleRate: parseInt(
                    this.getAttribute('lana-sample-rate') ?? 1,
                    10,
                ),
                isProdDomain: env === 'prod',
            },
            masIOUrl: this.getAttribute('mas-io-url'),
        };
        //root parameters
        ['locale', 'country', 'language', 'preview'].forEach((attribute) => {
            const value = this.getAttribute(attribute);
            if (value) {
                config[attribute] = value;
            }
        });
        //commerce parameters
        [
            'checkout-workflow-step',
            'force-tax-exclusive',
            'checkout-client-id',
            'allow-override',
            'wcs-api-key',
        ].forEach((attribute) => {
            const value = this.getAttribute(attribute);
            if (value != null) {
                const camelCaseAttribute = attribute.replace(/-([a-z])/g, (g) =>
                    g[1].toUpperCase(),
                );
                config.commerce[camelCaseAttribute] = value;
            }
        });
        return config;
    }

    async registerCheckoutAction(action) {
        if (typeof action != 'function') return;
        this.buildCheckoutAction = async (offers, options, el) => {
            const checkoutAction = await action?.(
                offers,
                options,
                this.imsSignedInPromise,
                el,
            );
            if (checkoutAction) {
                return checkoutAction;
            }
            return null;
        };
    }

    activate() {
        const config = this.#config;
        // Load settings and literals
        const settings = getSettings(config);
        updateLanaConfig(config.lana);
        const log = Log.init(config.hostEnv).module('service');
        log.debug('Activating:', config);

        // Fetch price literals
        const price = getPriceLiterals(settings);
        const literals = { price };
        // Create checkout/price options providers registry
        const providers = {
            checkout: new Set(),
            price: new Set(),
        };
        const startup = { literals, providers, settings };
        // Extend web component object with service API
        Object.defineProperties(
            this,
            Object.getOwnPropertyDescriptors({
                // Activate modules and expose their API as combined flat object
                ...Checkout(startup),
                ...Ims(startup),
                ...Price(startup),
                ...Wcs(startup),
                ...Constants,
                // Defined serviceweb  component API
                Log,
                get defaults() {
                    return Defaults;
                },
                get log() {
                    return Log;
                },
                /* c8 ignore next 11 */
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
                        has: (providerFunction) =>
                            providers.price.has(providerFunction) ||
                            providers.checkout.has(providerFunction),
                    };
                },
                get settings() {
                    return settings;
                },
            }),
        );
        log.debug('Activated:', { literals, settings });
        const event = new CustomEvent(EVENT_TYPE_READY, {
            bubbles: true,
            cancelable: false,
            detail: this,
        });
        performance.mark(MARK_READY);
        this.#initDuration = performance.measure(
            MEASURE_INIT_TIME,
            MARK_START,
            MARK_READY,
        )?.duration;
        this.dispatchEvent(event);
        setTimeout(() => {
            this.logFailedRequests();
        }, 10000);
    }

    connectedCallback() {
        performance.mark(MARK_START);
        this.activate();
    }

    flushWcsCache() {
        /* c8 ignore next 3 */
        this.flushWcsCacheInternal();
        this.log.debug('Flushed WCS cache');
    }

    refreshOffers() {
        this.flushWcsCacheInternal();
        document
            .querySelectorAll(SELECTOR_MAS_ELEMENT)
            .forEach((el) => el.requestUpdate(true));
        this.log.debug('Refreshed WCS offers');
        this.logFailedRequests();
    }

    refreshFragments() {
        this.flushWcsCacheInternal();
        document.querySelectorAll('aem-fragment').forEach((el) => el.refresh());
        this.log.debug('Refreshed AEM fragments');
        this.logFailedRequests();
    }

    get duration() {
        return {
            [MEASURE_INIT_TIME]: this.#initDuration,
        };
    }

    /**
     * Logs failed network requests related to AEM fragments and WCS commerce artifacts.
     * Identifies failed resources by checking for zero transfer size, zero duration,
     * response status less than 200, or response status greater than or equal to 400.
     * Only logs errors if any of the failed resources are fragment or commerce artifact requests.
     */
    /* c8 ignore next 21 */
    logFailedRequests() {
        const failedResources = [...performance.getEntriesByType('resource')]
            .filter(({ startTime }) => startTime > this.lastLoggingTime)
            .filter(
                ({ transferSize, duration, responseStatus }) =>
                    (transferSize === 0 &&
                        duration === 0 &&
                        responseStatus < 200) ||
                    responseStatus >= 400,
            );

        // Create a Map to deduplicate resources by URL, keeping only the last one
        const uniqueFailedResources = Array.from(
            new Map(
                failedResources.map((resource) => [resource.name, resource]),
            ).values(),
        );

        if (
            uniqueFailedResources.some(({ name }) =>
                /(\/fragments\/|web_commerce_artifact)/.test(name),
            )
        ) {
            const failedUrls = uniqueFailedResources.map(({ name }) => name);
            this.log.error('Failed requests:', {
                failedUrls,
                ...this.duration,
            });
        }
        this.lastLoggingTime = performance.now().toFixed(3);
    }
}

// Register service component
if (!window.customElements.get(TAG_NAME_SERVICE)) {
    window.customElements.define(TAG_NAME_SERVICE, MasCommerceService);
}
