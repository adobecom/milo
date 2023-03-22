import {
  loadScript,
  getConfig,
  createTag,
} from '../../utils/utils.js';

const wcs = { apiKey: 'wcms-commerce-ims-ro-user-cc' };
const envProd = 'prod';
const ctaPrefix = /^CTA +/;

let initialized = false;

// supported languages for the price literals
const supportedLanguages = [
  'ar', 'bg', 'cs', 'da', 'de', 'en', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh_CN', 'zh_TW',
];

/**
 * Removes undefined properties from an object
 * @param {*} target Object with potentially undefined properties
 * @returns new Object without undefined properties
 */
export function omitUndefined(target) {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (value == null) delete target[key];
    });
  }
  return target;
}

const getTacocatEnv = (envName, ietf) => {
  const scriptUrl = (envName === envProd
    ? 'https://www.adobe.com/special/tacocat/lib/1.12.0/tacocat.js'
    : 'https://www.stage.adobe.com/special/tacocat/lib/1.12.0/tacocat.js');
  // eslint-disable-next-line prefer-const
  let [language, country = 'us'] = ietf.split('-', 2);
  if (!supportedLanguages.includes(language)) {
    language = 'en'; // default to english
  }
  const literalScriptUrl = (envName === envProd
    ? `https://www.adobe.com/special/tacocat/literals/${language}.js`
    : `https://www.stage.adobe.com/special/tacocat/literals/${language}.js`);

  return { scriptUrl, literalScriptUrl, country, language };
};

function initTacocat(envName, country, language) {
  window.tacocat.tacocat({
    defaults: {
      country,
      language,
    },
    environment: envName,
    wcs,
    literals: window.tacocat.literals[language],
  });
}

function loadTacocat() {
  if (initialized) {
    return;
  }
  initialized = true;
  const {
    env,
    locale: { ietf },
  } = getConfig();
  const { scriptUrl, literalScriptUrl, country, language } = getTacocatEnv(env.name, ietf);

  Promise.all([
    loadScript(literalScriptUrl, undefined, true),
    loadScript(scriptUrl, undefined, true),
  ]).then(() => initTacocat(env.name, country, language));
}

const placeholderTypeMappings = {
  optical: 'priceOptical',
  strikethrough: 'priceStrikethrough',
};

function buildCheckoutButton(a, osi, options) {
  a.href = '#';
  a.dataset.wcsOsi = osi;
  a.dataset.template = 'checkoutUrl';
  a.className = 'con-button blue button-m';
  Object.assign(a.dataset, options);
  a.textContent = a.textContent?.replace(ctaPrefix, '');
  return a;
}

function buildPrice(osi, type, dataAttrs = {}) {
  const span = createTag('span', {
    'data-wcs-osi': osi,
    'data-template': type,
  });
  Object.assign(span.dataset, omitUndefined(dataAttrs));
  return span;
}

function isCTA(type) {
  return type === 'checkoutUrl';
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
    const checkoutContext = {}; // TODO: load dynamically
    const checkoutWorkflow = searchParams.get('checkoutType');
    const checkoutWorkflowStep = searchParams.get('workflowStep');
    const options = omitUndefined({
      ...checkoutContext,
      ...omitUndefined({
        promotionCode,
        checkoutWorkflow,
        checkoutWorkflowStep,
      }),
    });
    buildCheckoutButton(el, osi, options);
    return el;
  }
  const displayRecurrence = searchParams.get('term');
  const displayPerUnit = searchParams.get('seat');
  const displayTax = searchParams.get('tax');
  const displayOldPrice = promotionCode ? searchParams.get('old') : undefined;
  const price = buildPrice(osi, placeholderTypeMappings[type] || type, {
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
