import { Checkout } from './checkout.js';
import * as Constants from './constants.js';
import { EVENT_TYPE_READY } from './constants.js';
import { Defaults } from './defaults.js';
import { Ims } from './ims.js';
import { getPriceLiterals } from './literals.js';
import { Log } from './log.js';
import { Price } from './price.js';
import { getSettings } from './settings.js';
import { Wcs } from './wcs.js';
import { setImmediate } from './utilities.js';

export const TAG_NAME_SERVICE = 'mas-commerce-service';

/**
 * Custom web component to provide active instance of commerce service
 * to consumers, appended to the head section of current document.
 */
export class MasCommerceService extends HTMLElement {
    static instance;
    promise = null;

    get config() {
        const { searchParams } = new URL(import.meta.url);
        const env = this.getAttribute('env') || searchParams.get('env');
        const isStage = env?.toLowerCase() === 'stage';
        const envName = isStage ? 'stage' : 'prod';
        const commerceEnv = isStage ? 'STAGE' : 'PROD';
        const config = {
            env: { name: envName },
            commerce: { 'commerce.env': commerceEnv },
        };
        //root parameters
        ['locale', 'country', 'language'].forEach((attribute) => {
            const value = this.getAttribute(attribute);
            if (value) {
                config[attribute] = value;
            }
        });
        //commerce parameters
        ['checkoutWorkflowStep', 'forceTaxExclusive', 'checkoutClientId'].forEach((attribute) => {
            const value = this.getAttribute(attribute);
            if (value) {
                config.commerce[attribute] = value;
            }
        });
        return config;
    }

    async registerCheckoutAction(action) {
        if (typeof action != 'function') return;
        this.buildCheckoutAction = async (offers, options) => {
            const checkoutAction = await action?.(
                offers,
                options,
                this.imsSignedInPromise,
            );
            if (checkoutAction) {
                return checkoutAction;
            }
            return null;
        };
    }

    async activate(resolve) {
        const config = this.config;
        // Load settings and literals
        const log = Log.init(config.env).module('service');
        log.debug('Activating:', config);
        const settings = Object.freeze(getSettings(config));
        // Fetch price literals
        const literals = { price: {} };
        try {
            literals.price = await getPriceLiterals(
                settings,
                config.commerce.priceLiterals,
            );
        } catch (e) {}
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
                get literals() {
                    return literals;
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
                    };
                },
                get settings() {
                    return settings;
                },
            }),
        );
        log.debug('Activated:', { literals, settings });
        setImmediate(() => {
            const event = new CustomEvent(EVENT_TYPE_READY, {
                bubbles: true,
                cancelable: false,
                detail: this,
            });
            this.dispatchEvent(event);
        });
        resolve(this);
    }

    connectedCallback() {
      if (!this.readyPromise) {
        this.readyPromise = new Promise((resolve) => {
          this.activate(resolve);
        });
      }
    }

    disconnectedCallback() {
        this.readyPromise = null;
    }

    flushWcsCache() {
        this.flushWcsCache();
        this.log.debug('Flushed WCS cache');
    }

    refreshOffers() {
        this.flushWcsCache();
        document
            .querySelectorAll('span[is="inline-price"],a[is="checkout-link"]')
            .forEach((el) => el.requestUpdate(true));
        this.log.debug('Refreshed WCS offers');
    }

    refreshFragments() {
        this.flushWcsCache();
        document
            .querySelectorAll('aem-fragment')
            .forEach((el) => el.refresh());
        this.log.debug('Refreshed AEM fragments');
    }
}

// Register service component
if (!window.customElements.get(TAG_NAME_SERVICE)) {
    window.customElements.define(TAG_NAME_SERVICE, MasCommerceService);
}
