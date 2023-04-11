import {
  loadScript,
  getConfig,
  createTag,
  getMetadata,
} from '../../utils/utils.js';

const VERSION = '1.12.0';
const WCS = { apiKey: 'wcms-commerce-ims-ro-user-milo' };
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

const PLACEHOLDER_TYPE_MAPPINGS = {
  optical: 'priceOptical',
  strikethrough: 'priceStrikethrough',
};

let initialized = false;

function omitNullValues(target) {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (value == null) delete target[key];
    });
  }
  return target;
}

const getTacocatEnv = (envName, locale) => {
  const wcsLocale = GEO_MAPPINGS[locale.prefix] ?? locale.ietf;
  // eslint-disable-next-line prefer-const
  let [language, country = 'US'] = wcsLocale.split('-', 2);
  if (!SUPPORTED_LANGS.includes(language)) {
    language = 'en';
  }
  const host = envName === ENV_PROD
    ? 'https://www.adobe.com'
    : 'https://www.stage.adobe.com';
  const scriptUrl = `${host}/special/tacocat/lib/${VERSION}/tacocat.js`;
  const literalScriptUrl = `${host}/special/tacocat/literals/${language}.js`;
  return { scriptUrl, literalScriptUrl, country, language };
};

function initTacocat(envName, country, language) {
  window.tacocat.tacocat({
    defaults: {
      country,
      language,
    },
    environment: envName,
    wcs: WCS,
    literals: window.tacocat.literals?.[language] ?? {},
  });
}

function loadTacocat() {
  if (initialized) {
    return;
  }
  initialized = true;
  const {
    env,
    locale,
  } = getConfig();
  const {
    scriptUrl,
    literalScriptUrl,
    country,
    language,
  } = getTacocatEnv(env.name, locale);

  Promise.all([
    loadScript(literalScriptUrl).catch(() => ({})),
    loadScript(scriptUrl),
  ]).then(() => initTacocat(env.name, country, language));
}

function buildCheckoutButton(a, osi, options) {
  a.href = '#';
  a.dataset.wcsOsi = osi;
  a.dataset.template = 'checkoutUrl';
  a.className = 'con-button blue button-m';
  Object.assign(a.dataset, options);
  a.textContent = a.textContent?.replace(CTA_PREFIX, '');
  return a;
}

function buildPrice(osi, type, dataAttrs = {}) {
  const span = createTag('span', {
    'data-wcs-osi': osi,
    'data-template': type,
  });
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
  const checkoutWorkflowStep = searchParams?.get('workflowStep')?.replace('_', '/');
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
  loadTacocat();
  const { searchParams } = new URL(el.href);
  const osi = searchParams.get('osi');
  const type = searchParams.get('type');
  if (!(osi && type)) {
    el.textContent = '';
    el.setAttribute('aria-details', 'Invalid merch block');
    return undefined;
  }

  const promotionCode = (searchParams.get('promo')
    ?? el.closest('[data-promotion-code]')?.dataset.promotionCode) || undefined;

  if (isCTA(type)) {
    const options = omitNullValues({
      promotionCode,
      ...getCheckoutContext(searchParams, getConfig()),
    });
    buildCheckoutButton(el, osi, options);
    return el;
  }
  const displayRecurrence = searchParams.get('term');
  const displayPerUnit = searchParams.get('seat');
  const displayTax = searchParams.get('tax');
  const displayOldPrice = promotionCode ? searchParams.get('old') : undefined;
  const price = buildPrice(osi, PLACEHOLDER_TYPE_MAPPINGS[type] || type, {
    displayRecurrence,
    displayPerUnit,
    displayTax,
    displayOldPrice,
    promotionCode,
  });
  el.replaceWith(price);
  return price;
}

export { getTacocatEnv, initTacocat };
