import { loadScript, getConfig, getMetadata } from '../../utils/utils.js';

export const VERSION = '1.16.0';
const ENV_PROD = 'prod';
const CTA_PREFIX = /^CTA +/;

const SUPPORTED_LANGS = [
  'ar', 'bg', 'cs', 'da', 'de', 'en', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh_CN', 'zh_TW',
];

const GEO_MAPPINGS = {
  africa: 'en-ZA',
  mena_en: 'en-DZ',
  il_he: 'iw-IL',
  mena_ar: 'ar-DZ',
  id_id: 'in-ID',
  no: 'nb-NO',
};

const omitNullValues = (target) => {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (value == null) delete target[key];
    });
  }
  return target;
};

window.tacocat = window.tacocat || {};

export const imsCountryPromise = () => new Promise((resolve) => {
  let count = 0;
  const check = setInterval(() => {
    count += 1;
    if (window.adobeIMS) {
      clearInterval(check);
      if (window.adobeIMS.isSignedInUser()) {
        window.adobeIMS
          .getProfile()
          .then(({ countryCode }) => resolve(countryCode))
          .catch(() => resolve());
      } else {
        resolve();
      }
    } else if (count > 25) {
      clearInterval(check);
      resolve();
    }
  }, 200);
});
window.tacocat.imsCountryPromise = imsCountryPromise();

export const getTacocatEnv = (envName, locale) => {
  const wcsLocale = (GEO_MAPPINGS[locale.prefix] ?? locale.ietf).split('-', 2);
  let language = wcsLocale[0];
  const country = wcsLocale[1] || 'US';
  if (!SUPPORTED_LANGS.includes(language)) {
    language = 'en';
  }
  const host = envName === ENV_PROD
    ? 'https://www.adobe.com'
    : 'https://www.stage.adobe.com';

  const literalScriptUrl = `${host}/special/tacocat/literals/${language}.js`;
  // const scriptUrl = `${host}/special/tacocat/lib/${VERSION}/tacocat.js`;
  const scriptUrl = 'http://local.adobe.com:9009/tacocat.js';
  const tacocatEnv = envName === ENV_PROD ? 'PRODUCTION' : 'STAGE';
  return { literalScriptUrl, scriptUrl, country, language, tacocatEnv };
};

export const runTacocat = (tacocatEnv, country, language) => {
  // init lana logger
  window.tacocat.initLanaLogger('merch-at-scale', tacocatEnv, { country }, { consumer: 'milo' });
  // launch tacocat library
  window.tacocat.tacocat({
    env: tacocatEnv,
    country,
    language,
  });
};

window.tacocat.loadPromise = new Promise((resolve) => {
  const { env, locale } = getConfig();
  const {
    literalScriptUrl,
    scriptUrl,
    country,
    language,
    tacocatEnv,
  } = getTacocatEnv(env.name, locale);

  loadScript(literalScriptUrl)
    .catch(() => ({})) /* ignore if literals fail */
    .then(() => loadScript(scriptUrl))
    .then(() => {
      runTacocat(tacocatEnv, country, language);
      resolve();
    });
});

function buildCheckoutButton(link, dataAttrs = {}) {
  const a = document.createElement('a', { is: 'checkout-link' });
  a.setAttribute('is', 'checkout-link');
  const classes = ['con-button'];
  if (link.closest('.marquee')) {
    classes.push('button-l');
  }
  if (link.firstElementChild?.tagName === 'STRONG' || link.parentElement?.tagName === 'STRONG') {
    classes.push('blue');
  }
  a.setAttribute('class', classes.join(' '));
  Object.assign(a.dataset, dataAttrs);
  a.textContent = link.textContent?.replace(CTA_PREFIX, '');
  window.tacocat.imsCountryPromise.then((countryCode) => {
    if (countryCode) {
      a.dataset.imsCountry = countryCode;
    }
  })
    .catch(() => { /* do nothing */ });
  return a;
}

function buildPrice(dataAttrs = {}) {
  const span = document.createElement('span', { is: 'inline-price' });
  span.setAttribute('is', 'inline-price');
  Object.assign(span.dataset, omitNullValues(dataAttrs));
  return span;
}

function isCTA(type) {
  return type === 'checkoutUrl';
}

/**
 * Checkout parameter can be set Merch link, code config (scripts.js) or be a default from tacocat.
 * To get the default, 'undefinded' should be passed, empty string will trigger an error!
 *
 * clientId - code config -> default (adobe_com)
 * checkoutType - merch link -> metadata -> default (UCv3)
 * workflowStep - merch link -> default (email)
 * marketSegment - merch link -> default (COM)
 * @param {*} searchParams link level overrides for checkout parameters
 * @returns checkout context object required to build a checkout url
 */
function getCheckoutContext(searchParams, config) {
  const { commerce } = config;
  const checkoutClientId = commerce?.checkoutClientId;
  const checkoutWorkflow = searchParams.get('checkoutType') ?? getMetadata('checkout-type');
  const checkoutWorkflowStep = searchParams
    ?.get('workflowStep')
    ?.replace('_', '/');
  const checkoutMarketSegment = searchParams.get('marketSegment');

  return {
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    checkoutMarketSegment,
  };
}

export default async function init(el) {
  if (!el?.classList?.contains('merch')) return undefined;
  try {
    await window.tacocat.loadPromise;
  } catch (e) {
    console.error('Tacocat not loaded', e);
    return undefined;
  }
  const { searchParams } = new URL(el.href);
  const osi = searchParams.get('osi');
  const type = searchParams.get('type');
  if (!(osi && type)) {
    el.textContent = '';
    el.setAttribute('aria-details', 'Invalid merch block');
    return undefined;
  }

  const promotionCode = (searchParams.get('promo')
      ?? el.closest('[data-promotion-code]')?.dataset.promotionCode)
    || undefined;

  const perpetual = searchParams.get('perp') === 'true' || undefined;

  if (isCTA(type)) {
    const options = omitNullValues({
      promotionCode,
      perpetual,
      wcsOsi: osi,
      ...getCheckoutContext(searchParams, getConfig()),
    });
    const cta = buildCheckoutButton(el, options);
    el.replaceWith(cta);
    return cta;
  }

  const displayRecurrence = searchParams.get('term');
  const displayPerUnit = searchParams.get('seat');
  const displayTax = searchParams.get('tax');
  const displayOldPrice = promotionCode ? searchParams.get('old') : undefined;
  const price = buildPrice({
    wcsOsi: osi,
    template: type === 'price' ? undefined : type,
    displayRecurrence,
    displayPerUnit,
    displayTax,
    displayOldPrice,
    promotionCode,
    perpetual,
  });
  el.replaceWith(price);
  return price;
}
