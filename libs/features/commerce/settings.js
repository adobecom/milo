import { CheckoutType, WorkflowStep } from '@pandora/commerce-checkout-url-builder';
import { Environment, Landscape, ProviderEnvironment } from '@pandora/data-source-utils';

import { equalsCI, toBoolean, toKebabCase } from './utils.js';

const DEFAULT_WCS_API_KEY = 'wcms-commerce-ims-ro-user-milo';
const DEFAULT_CHECKOUT_CLIENT_ID = 'adobe_com';
const DEFAULT_COUNTRY = 'US';
const DEFAULT_LANGUAGE = 'en';

const GEO_MAPPINGS = {
  africa: 'en-ZA',
  mena_en: 'en-DZ',
  il_he: 'iw-IL',
  mena_ar: 'ar-DZ',
  id_id: 'in-ID',
  no: 'nb-NO',
};

const SUPPORTED_LANGS = [
  'ar', 'bg', 'cs', 'da', 'de', 'en', 'es', 'et', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh_CN', 'zh_TW',
];

const toCheckoutClientId = (value) => (value || DEFAULT_CHECKOUT_CLIENT_ID);

const toCheckoutWorkflow = (value) => (equalsCI(CheckoutType.V2, value)
  ? CheckoutType.V2
  : CheckoutType.V3);

const checkoutWorkflowSteps = Object.values(WorkflowStep);
const toCheckoutWorkflowStep = (value) => checkoutWorkflowSteps.find(
  (step) => equalsCI(step, value),
) ?? WorkflowStep.EMAIL;

const toWcsApiKey = (value) => (value || DEFAULT_WCS_API_KEY);

const toWcsLandscape = (value) => (equalsCI(Landscape.DRAFT, value)
  ? Landscape.DRAFT
  : Landscape.PUBLISHED);

/** @type {Commerce.getSettings} */
export default function getSettings({ commerce = {}, env, locale } = {}) {
  const prod = env.name === 'prod';

  const ietf = GEO_MAPPINGS[locale.prefix ?? ''] ?? locale.ietf;
  let [language = DEFAULT_LANGUAGE, country = DEFAULT_COUNTRY] = ietf.split('-', 2);
  country = country.toUpperCase();
  language = SUPPORTED_LANGS.some((candidate) => equalsCI(candidate, language))
    ? language.toUpperCase()
    : language.toUpperCase();

  const head = document.documentElement;
  const getValue = (key, metadata = true) => commerce[key] ?? (
    metadata
      ? head.querySelector(`meta[name="${toKebabCase(key)}"]`)?.content
      : undefined
  );

  const settings = {};
  settings.checkoutClientId = toCheckoutClientId(getValue('checkoutClientId'));
  settings.checkoutWorkflow = toCheckoutWorkflow(getValue('checkoutWorkflow'));
  settings.checkoutWorkflowStep = toCheckoutWorkflowStep(getValue('checkoutWorkflowStep'));
  settings.country = country;
  settings.env = prod ? ProviderEnvironment.PRODUCTION : ProviderEnvironment.STAGE;
  settings.language = language;
  settings.locale = `${language.toLowerCase()}_${country}`;
  settings.prod = prod;
  settings.wcsApiKey = toWcsApiKey(getValue('wcsApiKey'));
  settings.wcsEnvironment = prod ? Environment.PRODUCTION : Environment.STAGE;
  settings.wcsForceTaxExclusive = toBoolean(getValue('wcsForceTaxExclusive'));
  settings.wcsLandscape = toWcsLandscape(getValue('wcsLandscape'));
  settings.wcsDebounceDelay = commerce.wcsDebounceDelay ?? 50;
  settings.wcsOfferSelectorLimit = commerce.wcsOfferSelectorLimit ?? 20;
  return settings;
}
