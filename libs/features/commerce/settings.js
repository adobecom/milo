import {
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  Environment,
  WcsEnvironment,
  WcsLandscape
} from './externals.js';
import {
  equalsCI,
  toBoolean,
  toEnum,
  toKebabCase,
  toPositiveFiniteNumber
} from './utils.js';

export const PROD = 'prod';

export const defaults = {
  checkoutClientId: 'adobe_com',
  checkoutWorkflow: CheckoutWorkflow.V3,
  checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
  country: 'US',
  env: Environment.PRODUCTION,
  language: 'en',
  wcsApiKey: 'wcms-commerce-ims-ro-user-milo',
  wcsDebounceDelay: 50,
  wcsEnvironment: WcsEnvironment.PRODUCTION,
  wcsForceTaxExclusive: false,
  wcsLandscape: WcsLandscape.PUBLISHED,
  wcsOfferSelectorLimit: 20,
};

const geoMappings = {
  africa: 'en-ZA',
  mena_en: 'en-DZ',
  il_he: 'iw-IL',
  mena_ar: 'ar-DZ',
  id_id: 'in-ID',
  no: 'nb-NO',
};

const supportedLanguages = [
  'ar', 'bg', 'cs', 'da', 'de', 'en', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh_CN', 'zh_TW',
];

/** @type {Commerce.getLocaleSettings} */
export function getLocaleSettings({
  locale = { ietf: 'en-US' },
} = {}) {
  const ietf = geoMappings[locale.prefix ?? ''] ?? locale.ietf;
  let [language = defaults.language, country = defaults.country] = ietf.split('-', 2);

  country = country.toUpperCase();
  language = (
    supportedLanguages.some((candidate) => equalsCI(candidate, language))
      ? language
      : defaults.language
  ).toLowerCase();

  return {
    country,
    language,
    locale: `${language}_${country}`
  }
}

/** @type {Commerce.getSettings} */
export function getSettings({
  commerce = {},
  env = { name: PROD },
  locale = undefined,
} = {}) {
  const isProd = env.name === PROD;

  const getSetting = (key) => commerce[key] ?? document.documentElement
    .querySelector(`meta[name="${toKebabCase(key)}"]`)
    // @ts-ignore
    ?.content;

  const checkoutClientId = getSetting('checkoutClientId') ?? defaults.checkoutClientId;
  const checkoutWorkflow = toEnum(
    getSetting('checkoutWorkflow'),
    CheckoutWorkflow,
    defaults.checkoutWorkflow
  );
  const checkoutWorkflowStep = checkoutWorkflow === CheckoutWorkflow.V3
    ? toEnum(
      getSetting('checkoutWorkflowStep'),
      CheckoutWorkflowStep,
      defaults.checkoutWorkflowStep
    )
    : CheckoutWorkflowStep.CHECKOUT;
  const wcsApiKey = getSetting('wcsApiKey') ?? defaults.wcsApiKey;
  const wcsEnvironment = isProd ? WcsEnvironment.PRODUCTION : WcsEnvironment.STAGE;
  const wcsForceTaxExclusive = toBoolean(
    getSetting('wcsForceTaxExclusive'),
    defaults.wcsForceTaxExclusive
  );
  const wcsLandscape = toEnum(
    getSetting('wcsLandscape'),
    WcsLandscape,
    defaults.wcsLandscape
  );
  const wcsDebounceDelay = toPositiveFiniteNumber(
    getSetting('wcsDebounceDelay'),
    defaults.wcsDebounceDelay
  );
  const wcsOfferSelectorLimit = toPositiveFiniteNumber(
    getSetting('wcsOfferSelectorLimit'),
    defaults.wcsOfferSelectorLimit
  );

  /** @type {Commerce.Checkout.Settings & Commerce.Wcs.Settings} */
  return {
    ...getLocaleSettings({ locale }),
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    env: isProd ? Environment.PRODUCTION : Environment.STAGE,
    wcsApiKey,
    wcsEnvironment,
    wcsForceTaxExclusive,
    wcsLandscape,
    wcsDebounceDelay,
    wcsOfferSelectorLimit,
  };
}

export default getSettings;
