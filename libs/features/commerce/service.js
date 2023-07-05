import pollImsCountry from './ims.js';
import Log from './log.js';
import getSettings from './settings.js';
import getWcsClient from './wcs.js';

let providers = {
  price: new Set(),
};
/** @type {Commerce.Instance} */
let instance = null;
let promise = null;

/** @type {Commerce.init} */
async function init(callback) {
  const config = callback();

  Log.init(config.env);
  const log = Log.commerce;
  log.debug('Initialising:', config);
  const literals = { price: {} };
  const settings = getSettings(config);

  instance = {
    imsCountryPromise: pollImsCountry().then((countryCode) => {
      if (countryCode) settings.country = countryCode;
      return countryCode;
    }),
    providers: {
      price(interceptor) {
        providers.add(interceptor);
        return () => providers.delete(interceptor);
      },
    },
    literals,
    settings,
    wcs: getWcsClient(settings)
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

function use() {
  if (instance === null) throw new Error('Not initialised');
  return instance;
}

export default {
  providers,

  /** @type {Commerce.Instance} */
  get instance() {
    return use();
  },

  /** @type {Commerce.Checkout.Settings & Commerce.Wcs.Settings} */
  get settings() {
    return use().settings;
  },

  /** @type {Commerce.Wcs.Client} */
  get wcs() {
    return use().wcs;
  },

  /** @type {Commerce.init} */
  init(callback) {
    // eslint-disable-next-line no-return-assign
    return promise ??= init(callback);
  },

  reset() {
    instance = null;
    promise = null;
    providers.price.clear();
  },
};
