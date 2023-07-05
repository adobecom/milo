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

/** @type {Commerce.getSettings} */
export function getSettings({
  commerce = {},
  env = { name: PROD },
  locale = { ietf: 'en-US' },
} = {}) {
  const isProd = env.name === PROD;

  const ietf = geoMappings[locale.prefix ?? ''] ?? locale.ietf;
  let [language = defaults.language, country = defaults.country] = ietf.split('-', 2);
  country = country.toUpperCase();
  language = (
    supportedLanguages.some((candidate) => equalsCI(candidate, language))
      ? language
      : defaults.language
  ).toLowerCase();

  const head = document.documentElement;
  const getSetting = (key) => commerce[key]
    // @ts-ignore
    ?? head.querySelector(`meta[name="${toKebabCase(key)}"]`)?.content;

  /** @type {Commerce.Checkout.Settings & Commerce.Wcs.Settings} */
  const settings = {};
  settings.checkoutClientId = getSetting('checkoutClientId') ?? defaults.checkoutClientId;
  settings.checkoutWorkflow = toEnum(
    getSetting('checkoutWorkflow'),
    CheckoutWorkflow,
    defaults.checkoutWorkflow
  );
  settings.checkoutWorkflowStep = settings.checkoutWorkflow === CheckoutWorkflow.V3
    ? toEnum(
      getSetting('checkoutWorkflowStep'),
      CheckoutWorkflowStep,
      defaults.checkoutWorkflowStep
    )
    : CheckoutWorkflowStep.CHECKOUT;
  settings.country = country;
  settings.env = isProd ? Environment.PRODUCTION : Environment.STAGE;
  settings.language = language;
  settings.locale = `${language}_${country}`;
  settings.wcsApiKey = getSetting('wcsApiKey') ?? defaults.wcsApiKey;
  settings.wcsEnvironment = isProd ? WcsEnvironment.PRODUCTION : WcsEnvironment.STAGE;
  settings.wcsForceTaxExclusive = toBoolean(
    getSetting('wcsForceTaxExclusive'),
    defaults.wcsForceTaxExclusive
  );
  settings.wcsLandscape = toEnum(
    getSetting('wcsLandscape'),
    WcsLandscape,
    defaults.wcsLandscape
  );
  settings.wcsDebounceDelay = toPositiveFiniteNumber(
    getSetting('wcsDebounceDelay'),
    defaults.wcsDebounceDelay
  );
  settings.wcsOfferSelectorLimit = toPositiveFiniteNumber(
    getSetting('wcsOfferSelectorLimit'),
    defaults.wcsOfferSelectorLimit
  );
  return settings;
}

export default getSettings;
