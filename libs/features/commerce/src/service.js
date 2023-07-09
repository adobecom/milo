import Checkout from './checkout.js';
import defaults from './defaults.js';
import { pollImsCountry } from './ims.js';
import Log from './log.js';
import { getSettings } from './settings.js';
import Wcs from './wcs.js';

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
    if (countryCode) settings.country = countryCode;
    return countryCode;
  });

  instance = {
    checkout: Checkout(settings),
    defaults: Object.freeze({ ...defaults }),
    ims: {
      get country() {
        return imsCountry;
      }
    },
    providers: {
      price(provider) {
        providers.price.add(provider);
        return () => providers.price.delete(provider);
      },
    },
    literals,
    settings,
    wcs: Wcs(settings)
  };

  // fetch price literals
  await fetch(
    await import.meta.resolve(`./literals/price/${settings.language.toLowerCase()}.json`),
  )
    .then((response) => response.json())
    .then(
      (priceLiterals) => {
        literals.price = priceLiterals;
        log.debug('Price literals loaded:', priceLiterals);
      },
      (error) => {
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

function demand() {
  if (instance === null) throw new Error('Not initialised');
  return instance;
}

/** @type {Commerce.init} */
export function init(callback) {
  // eslint-disable-next-line no-return-assign
  return promise ??= activate(callback);
}

/** @type {Commerce.reset} */
export function reset() {
  instance = null;
  promise = null;
  providers.price.clear();
}

/** @type {Commerce.Internal.Instance} */
export default {
  get checkout() {
    return demand().checkout;
  },
  get defaults() {
    return demand().defaults;
  },
  get ims() {
    return demand().ims;
  },
  get literals() {
    return demand().literals;
  },
  get providers() {
    return providers;
  },
  get settings() {
    return demand().settings;
  },
  get wcs() {
    return demand().wcs;
  },
};
