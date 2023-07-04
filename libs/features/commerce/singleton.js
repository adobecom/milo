import pollImsCountry from './ims.js';
import getWcsClient from './wcs.js';
import getSettings from './settings.js';
import Log from './log.js';

let instance = null;
let promise = null;

/** @type {Commerce.init} */
async function init(injector) {
  const log = Log.commerce;

  const { config, loadScript } = injector();
  log.debug('Initialising:', config);
  instance = { settings: getSettings(config) };

  instance.imsCountryPromise = pollImsCountry().then((countryCode) => {
    if (countryCode) {
      instance.settings.country = countryCode;
    }
  });

  instance.price = {
    addOptionProvider(provider) {
      const { optionProviders } = instance.price;
      optionProviders.add(provider);
      return () => optionProviders.delete(provider);
    },
    optionProviders: new Set(),
  };

  instance.wcs = getWcsClient(instance.settings);

  const host = instance.settings.prod
    ? 'https://www.adobe.com'
    : 'https://www.stage.adobe.com';
  const literalsUrl = `${host}/special/tacocat/literals/${instance.settings.language.toLowerCase()}.js`;
  await loadScript(literalsUrl).then(
    () => {
      log.debug('Literals loaded');
    },
    (error) => {
      log.error('Literals not loaded:', error);
    },
  );
  instance.literals = window.tacocat?.literals?.[instance.settings.language] ?? {};

  /* light up all placeholders */
  document
    .querySelectorAll('[is="checkout-link"],[is="inline-price"]')
    .forEach((el) => el.init());

  log.debug('Initialised:', instance);
  return instance;
}

export default {
  /** @type {Commerce.Instance} */
  get instance() {
    if (instance === null) throw new Error('Not initialised');
    return instance;
  },
  /** @type {Commerce.init} */
  init(injector) {
    if (promise === null) promise = init(injector);
    return promise;
  },
  reset() {
    instance = null;
  },
};
