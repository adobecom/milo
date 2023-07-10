import defaults from './defaults.js';
import {
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  Env,
  WcsEnv,
  WcsLandscape,
} from './deps.js';
import {
  equalsCI,
  getParam,
  toBoolean,
  toEnum,
  toFiniteNumber,
} from './utils.js';

const MiloEnv = {
  LOCAL: 'local',
  PROD: 'prod',
  STAGE: 'stage',
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
function getLocaleSettings({ locale = { ietf: 'en-US' } } = {}) {
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
    locale: `${language}_${country}`,
  };
}

/** @type {Commerce.getSettings} */
function getSettings({
  commerce = {},
  locale = undefined,
} = {}) {
  // always use `prod` env by default, regardless Milo env
  // but allow overriding it in metadata, location.search or storage
  // @see https://github.com/adobecom/milo/pull/923
  const env = MiloEnv.PROD === toEnum(getParam('env', true, true), MiloEnv, MiloEnv.PROD)
    ? Env.PRODUCTION
    : Env.STAGE;

  const getSetting = (key, useMetadata = true) => commerce[key] ?? getParam(key, useMetadata, true);

  const checkoutClientId = getSetting('checkoutClientId') ?? defaults.checkoutClientId;
  const checkoutWorkflow = toEnum(
    getSetting('checkoutWorkflow'),
    CheckoutWorkflow,
    defaults.checkoutWorkflow,
  );
  const checkoutWorkflowStep = checkoutWorkflow === CheckoutWorkflow.V3
    ? toEnum(
      getSetting('checkoutWorkflowStep'),
      CheckoutWorkflowStep,
      defaults.checkoutWorkflowStep,
    )
    : CheckoutWorkflowStep.CHECKOUT;
  const wcsApiKey = getSetting('wcsApiKey') ?? defaults.wcsApiKey;
  const wcsForceTaxExclusive = toBoolean(
    getSetting('wcsForceTaxExclusive'),
    defaults.wcsForceTaxExclusive,
  );
  const wcsLandscape = toEnum(
    getSetting('wcsLandscape'),
    WcsLandscape,
    defaults.wcsLandscape,
  );
  let wcsBufferDelay = toFiniteNumber(
    getSetting('wcsBufferDelay'),
    defaults.wcsBufferDelay,
  );
  if (wcsBufferDelay < 0) wcsBufferDelay = 0;
  let wcsBufferLimit = toFiniteNumber(
    getSetting('wcsBufferLimit'),
    defaults.wcsBufferLimit,
  );
  if (wcsBufferLimit < 1) wcsBufferLimit = 1;

  /** @type {Commerce.Checkout.Settings & Commerce.Wcs.Settings} */
  return {
    ...getLocaleSettings({ locale }),
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    env,
    wcsApiKey,
    wcsBufferDelay,
    wcsBufferLimit,
    wcsEnv: env === Env.STAGE ? WcsEnv.STAGE : WcsEnv.PRODUCTION,
    wcsForceTaxExclusive,
    wcsLandscape,
  };
}

export default getSettings;
export { MiloEnv, getLocaleSettings, getSettings };
