import {
  loadScript,
  getConfig,
  createTag,
} from '../../utils/utils.js';

const version = '1.12.0';
const wcs = { apiKey: 'wcms-commerce-ims-ro-user-milo' };
const envProd = 'prod';
const ctaPrefix = /^CTA +/;

let initialized = false;

const supportedLanguages = [
  'ar', 'bg', 'cs', 'da', 'de', 'en', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh_CN', 'zh_TW',
];

const geoMappings = {
  africa: 'en-ZA',
  mena_en: 'en-DZ',
  il_he: 'iw-IL',
  mena_ar: 'ar-DZ',
  id_id: 'in-ID',
  no: 'nb-NO',
};

function omitNullValues(target) {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (value == null) delete target[key];
    });
  }
  return target;
}

const getTacocatEnv = (envName, locale) => {
  const wcsLocale = geoMappings[locale.prefix] ?? locale.ietf;
  // eslint-disable-next-line prefer-const
  let [language, country = 'US'] = wcsLocale.split('-', 2);
  if (!supportedLanguages.includes(language)) {
    language = 'en';
  }
  const host = envName === envProd
    ? 'https://www.adobe.com'
    : 'https://www.stage.adobe.com';
  const scriptUrl = `${host}/special/tacocat/lib/${version}/tacocat.js`;
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
    wcs,
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
  Object.assign(span.dataset, omitNullValues(dataAttrs));
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
    const options = omitNullValues({
      ...checkoutContext,
      ...omitNullValues({
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
