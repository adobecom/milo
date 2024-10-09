import { Checkout } from './checkout.js';
import * as Constants from './constants.js';
import { EVENT_TYPE_READY, TAG_NAME_SERVICE } from './constants.js';
import { Defaults } from './defaults.js';
import { isFunction } from './external.js';
import { Ims } from './ims.js';
import { getPriceLiterals } from './literals.js';
import { Log } from './log.js';
import { Price } from './price.js';
import { getSettings } from './settings.js';
import { Wcs } from './wcs.js';
import { setImmediate } from './utilities.js';

/**
 * Custom web component to provide active instance of commerce service
 * to consumers, appended to the head section of current document.
 */
export class MasCommerceService extends HTMLElement {
    static instance;
    promise = null;
    startup = null;
    dataProviders = null;

    get config() {
      const { searchParams } = new URL(import.meta.url);
      const env = this.getAttribute('env') || searchParams.get('env');
      const isStage =  env?.toLowerCase() === 'stage';      
      const envName = isStage ? 'stage' : 'prod';
      const commerceEnv = isStage ? 'STAGE' : 'PROD';
      const config =  {
        env: { name: envName },
        commerce: { 'commerce.env': commerceEnv },
      };
      ['locale','country','language'].forEach((attribute) => {
        const value = this.getAttribute(attribute);
        if (value) {
          config[attribute] = value;
        }
      });
      return config;
    }

    registerCheckoutAction( action ) {
      if (typeof(action) != 'function' ) return;
      this.dataProviders = { getCheckoutAction : action };
      if (this.startup) {
        Object.assign(this, { ...Checkout(this.startup, this.dataProviders)})
      }
    }

    get autostart() {
      return this.getAttribute('autostart') || false;
    }
    
    /**
     * @param config, if not provided, the one from attributes of the element will be taken
     * @param providers, if not provided, the one from registrations before activation will be taken
     * @returns 
     */
    async innerActivate(resolve, config, dataProviders) {
        // Load settings and literals
      const log = Log.init(config.env).module('service');
      log.debug('Activating:', config);
      const literals = { price: {} };
      const settings = Object.freeze(getSettings(config));
      // Fetch price literals
      try {
        literals.price = await getPriceLiterals(settings, config.commerce.priceLiterals);
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
      this.startup = { literals, providers, settings };      
      // Extend web component object with service API
      // @ts-ignore
      MasCommerceService.instance = Object.defineProperties(
        this,
        Object.getOwnPropertyDescriptors({
          // Activate modules and expose their API as combined flat object
          ...Checkout(this.startup, dataProviders),
          ...Ims(this.startup),
          ...Price(this.startup),
          ...Wcs(this.startup),
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
      log.debug('Activated:', { literals, settings, });
      setImmediate(() => {
        const event = new CustomEvent(EVENT_TYPE_READY, {
          bubbles: true,
          cancelable: false,
          detail: MasCommerceService.instance,
        });
        this.dispatchEvent(event);
      });
      resolve(this);
    }

    /**
     * @param config, if not provided, the one from attributes of the element will be taken
     * @param providers, if not provided, the one from registrations before activation will be taken
     * @returns
     */
    async activate(config, dataProviders) {
      if (this.promise) {
        return this.promise;
      }
      MasCommerceService.instance = this;
      this.promise = new Promise((resolve) => {
        this.innerActivate(resolve, {...this.config, ...config}, {...this.dataProviders, ...dataProviders});
      });
      return this.promise;
    }

    connectedCallback() {
      if (this.autostart) {
        this.activate();
      }
    }
}

// Register service component
window.customElements.define(TAG_NAME_SERVICE, MasCommerceService);

/** used for removing */
export function reset() {
  // Remove service web component
  document.head.querySelector(TAG_NAME_SERVICE)?.remove();
  Log.reset();
}

/**
 * Used for enabling commerce from function call
 * @param {*} getConfig 
 * @param {*} getProviders 
 * @returns 
 */
export function init(getConfig, getProviders) {
  // Callback is provided, activate service or/and return its promise
  const config = isFunction(getConfig) ? getConfig() : {};
  const dataProviders = isFunction(getProviders) ? getProviders() : {};
  if (dataProviders.force) reset();
  const prevEl = document.querySelector(TAG_NAME_SERVICE);
  if (prevEl && prevEl.promise) return prevEl.promise;
  prevEl?.remove();
  // Append web component and dispatch "ready" event
  // Create custom web component to expose service instance to the DOM
  const element = document.createElement(TAG_NAME_SERVICE);
  document.head.append(element);
  return element.activate(config, dataProviders);    
}
