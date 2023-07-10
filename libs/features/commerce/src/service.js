/* eslint-disable import/no-named-as-default */
import Checkout from './checkout.js';
import defaults from './defaults.js';
import { pollImsCountry } from './ims.js';
import Log from './log.js';
import getSettings from './settings.js';
import Wcs from './wcs.js';

const ErrorMessage = { init: 'Not initialised' };

/** @type {Commerce.Instance} */
let instance = null;
let promise = null;
const providers = {
  /** @type {Set<Commerce.providePriceOptions>} */
  price: new Set(),
};

async function activate(callback) {
  const config = callback?.() ?? {};

  Log.init(config.env);
  const log = Log.commerce;
  log.debug('Initialising:', config);
  const literals = { price: {} };
  const settings = getSettings(config);
  const imsCountry = pollImsCountry().then((countryCode) => {
    if (countryCode) {
      log.debug('Ims country code:', countryCode);
      settings.country = countryCode;
    }
    return countryCode;
  });

  instance = {
    checkout: Checkout(settings),
    defaults: Object.freeze({ ...defaults }),
    ims: {
      get country() {
        return imsCountry;
      },
    },
    providers: {
      price(provider) {
        providers.price.add(provider);
        return () => providers.price.delete(provider);
      },
    },
    literals,
    settings,
    wcs: Wcs(settings),
  };

  // fetch price literals
  await window.fetch(
    await import.meta.resolve(`./literals/price/${settings.language.toLowerCase()}.json`),
  )
    .then((response) => response.json())
    .then(
      (priceLiterals) => {
        literals.price = priceLiterals;
        log.debug('Price literals loaded:', priceLiterals);
      },
      (error) => {
        /* c8 ignore next */
        log.error('Price literals not loaded:', error);
      },
    );

  // light up all DOM placeholders
  document
    .querySelectorAll('[is="checkout-link"],[is="inline-price"]')
    // @ts-ignore
    .forEach((el) => el.render());

  log.debug('Initialised:', instance);
  return instance;
}

function assertExists() {
  if (instance === null) {
    throw new Error(ErrorMessage.init);
  }
  return instance;
}

function reset() {
  instance = null;
  promise = null;
  providers.price.clear();
  Log.reset();
}

/** @type {Commerce.init} */
function init(callback, force) {
  if (force) reset();
  // eslint-disable-next-line no-return-assign
  return promise ??= activate(callback);
}

/** @type {Commerce.Internal.Instance} */
const singleton = {
  get checkout() {
    return assertExists().checkout;
  },
  get defaults() {
    return assertExists().defaults;
  },
  get ims() {
    return assertExists().ims;
  },
  get literals() {
    return assertExists().literals;
  },
  get providers() {
    return providers;
  },
  get settings() {
    return assertExists().settings;
  },
  get wcs() {
    return assertExists().wcs;
  },
};

export default singleton;
export { ErrorMessage, init, reset };
