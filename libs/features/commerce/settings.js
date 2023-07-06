import {
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  Env,
  WcsEnv,
  WcsLandscape
} from './externals.js';
import {
  equalsCI,
  getParam,
  toBoolean,
  toEnum,
  toPositiveFiniteNumber
} from './utils.js';

export const MiloEnv = {
  LOCAL: 'local',
  PROD: 'prod',
  STAGE: 'stage',
}

export const defaults = {
  checkoutClientId: 'adobe_com',
  checkoutWorkflow: CheckoutWorkflow.V3,
  checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
  country: 'US',
  env: Env.PRODUCTION,
  language: 'en',
  wcsApiKey: 'wcms-commerce-ims-ro-user-milo',
  wcsDebounceDelay: 50,
  wcsEnv: WcsEnv.PRODUCTION,
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
  env: { name: envName } = { name: MiloEnv.PROD },
  locale = undefined,
} = {}) {
  const miloEnv = toEnum(
    commerce['env'] ?? getParam('env', false, envName !== MiloEnv.PROD),
    MiloEnv,
    envName ?? MiloEnv.PROD
  );
  const env = miloEnv === MiloEnv.LOCAL || miloEnv === MiloEnv.STAGE
    ? Env.STAGE
    : Env.PRODUCTION;

  const getSetting = (key, useMetadata = true, useSearchAndStorage = env === Env.STAGE) => commerce[key]
    ?? getParam(key, useMetadata, useSearchAndStorage);

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
  const wcsForceTaxExclusive = toBoolean(
    getSetting('wcsForceTaxExclusive'),
    defaults.wcsForceTaxExclusive
  );
  const wcsLandscape = toEnum(
    getSetting('wcsLandscape', false),
    WcsLandscape,
    defaults.wcsLandscape
  );
  const wcsDebounceDelay = toPositiveFiniteNumber(
    getSetting('wcsDebounceDelay', false),
    defaults.wcsDebounceDelay
  );
  const wcsOfferSelectorLimit = toPositiveFiniteNumber(
    getSetting('wcsOfferSelectorLimit', false),
    defaults.wcsOfferSelectorLimit
  );

  /** @type {Commerce.Checkout.Settings & Commerce.Wcs.Settings} */
  return {
    ...getLocaleSettings({ locale }),
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    env,
    wcsApiKey,
    wcsEnv: env === Env.STAGE ? WcsEnv.STAGE : WcsEnv.PRODUCTION,
    wcsForceTaxExclusive,
    wcsLandscape,
    wcsDebounceDelay,
    wcsOfferSelectorLimit,
  };
}

export default getSettings;
