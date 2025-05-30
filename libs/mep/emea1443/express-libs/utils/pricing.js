import { getCountry } from './location-utils.js';

const currencies = {
  ar: 'ARS',
  at: 'EUR',
  au: 'AUD',
  be: 'EUR',
  bg: 'EUR',
  br: 'BRL',
  ca: 'CAD',
  ch: 'CHF',
  cl: 'CLP',
  co: 'COP',
  cr: 'USD',
  cy: 'EUR',
  cz: 'EUR',
  de: 'EUR',
  dk: 'DKK',
  ec: 'USD',
  ee: 'EUR',
  es: 'EUR',
  fi: 'EUR',
  fr: 'EUR',
  gb: 'GBP',
  uk: 'GBP',
  gr: 'EUR',
  gt: 'USD',
  hk: 'HKD',
  hu: 'EUR',
  id: 'IDR',
  ie: 'EUR',
  il: 'ILS',
  in: 'INR',
  it: 'EUR',
  jp: 'JPY',
  kr: 'KRW',
  lt: 'EUR',
  lu: 'EUR',
  lv: 'EUR',
  mt: 'EUR',
  mx: 'MXN',
  my: 'MYR',
  nl: 'EUR',
  no: 'NOK',
  nz: 'NZD',
  pe: 'PEN',
  ph: 'PHP',
  pl: 'EUR',
  pt: 'EUR',
  ro: 'EUR',
  ru: 'RUB',
  se: 'SEK',
  sg: 'SGD',
  si: 'EUR',
  sk: 'EUR',
  th: 'THB',
  tw: 'TWD',
  us: 'USD',
  ve: 'USD',
  za: 'ZAR',
  ae: 'AED',
  bh: 'BHD',
  eg: 'EGP',
  jo: 'JOD',
  kw: 'KWD',
  om: 'OMR',
  qa: 'QAR',
  sa: 'USD',
  ua: 'USD',
  dz: 'USD',
  lb: 'LBP',
  ma: 'USD',
  tn: 'USD',
  ye: 'USD',
  am: 'USD',
  az: 'USD',
  ge: 'USD',
  md: 'USD',
  tm: 'USD',
  by: 'USD',
  kz: 'USD',
  kg: 'USD',
  tj: 'USD',
  uz: 'USD',
  bo: 'USD',
  do: 'USD',
  hr: 'EUR',
  ke: 'USD',
  lk: 'USD',
  mo: 'HKD',
  mu: 'USD',
  ng: 'USD',
  pa: 'USD',
  py: 'USD',
  sv: 'USD',
  tt: 'USD',
  uy: 'USD',
  vn: 'USD',
  tr: 'TRY',
};

export function getCurrency(country) {
  return currencies[country];
}

function getCurrencyDisplay(currency) {
  if (currency === 'JPY') {
    return 'name';
  }
  if (['SEK', 'DKK', 'NOK'].includes(currency)) {
    return 'code';
  }
  return 'symbol';
}

export async function formatPrice(price, currency) {
  const { getConfig } = await import('../../../../utils/utils.js');
  if (price === '') return null;
  const customSymbols = {
    SAR: 'SR',
    CA: 'CAD',
    EGP: 'LE',
    ARS: 'Ar$',
  };
  let currencyLocale = 'en-GB'; // use en-GB for intl $ symbol formatting
  if (!['USD', 'TWD'].includes(currency)) {
    const country = await getCountry();
    currencyLocale = Object.entries(getConfig().locales).find(([key]) => key.startsWith(country))?.[1]?.ietf ?? 'en-US';
  }
  const currencyDisplay = getCurrencyDisplay(currency);

  let formattedPrice = new Intl.NumberFormat(currencyLocale, {
    style: 'currency',
    currency,
    currencyDisplay,
  }).format(price);

  Object.entries(customSymbols).forEach(([symbol, replacement]) => {
    formattedPrice = formattedPrice.replace(symbol, replacement);
  });

  return formattedPrice;
}

export const getOfferOnePlans = (() => {
  let json;
  return async (offerId) => {
    const { getConfig } = await import('../../../../utils/utils.js');
    let country = await getCountry();
    if (!country) country = 'us';

    let currency = getCurrency(country);
    if (!currency) {
      country = 'us';
      currency = 'USD';
    }

    if (!json) {
      const resp = await fetch('/express/system/offers-one.json?limit=5000');
      if (!resp.ok) return {};
      json = await resp.json();
    }

    const upperCountry = country.toUpperCase();
    let offer = json.data.find((e) => (e.o === offerId) && (e.c === upperCountry));
    if (!offer) offer = json.data.find((e) => (e.o === offerId) && (e.c === 'US'));
    if (!offer) return {};
    const lang = getConfig().locale.ietf.split('-')[0];
    const unitPrice = offer.p;
    const customOfferId = offer.oo || offerId;
    const ooAvailable = offer.oo || false;
    const showVat = offer.showVat || false;
    return {
      country,
      currency,
      lang,
      unitPrice: offer.p,
      unitPriceCurrencyFormatted: await formatPrice(unitPrice, currency),
      commerceURL: `https://commerce.adobe.com/checkout?cli=spark&co=${country}&items%5B0%5D%5Bid%5D=${customOfferId}&items%5B0%5D%5Bcs%5D=0&rUrl=https%3A%2F%express.adobe.com%2Fsp%2F&lang=${lang}`,
      vatInfo: offer.vat,
      prefix: offer.pre,
      suffix: offer.suf,
      basePrice: offer.bp,
      basePriceCurrencyFormatted: await formatPrice(offer.bp, currency),
      priceSuperScript: offer.sup,
      customOfferId,
      savePer: offer.savePer,
      ooAvailable,
      showVat,
      y2p: await formatPrice(offer.y2p, currency),
      term: offer.Term,
    };
  };
})();

export async function fetchPlanOnePlans(planUrl) {
  if (!window.pricingPlans) {
    window.pricingPlans = {};
  }

  let plan = window.pricingPlans[planUrl];
  if (!plan) {
    plan = {};
    const link = new URL(planUrl);
    const params = link.searchParams;

    plan.url = planUrl;
    plan.country = 'us';
    plan.language = 'en';
    plan.price = '9.99';
    plan.currency = 'US';
    plan.symbol = '$';

    // TODO: Remove '/sp/ once confirmed with stakeholders
    const allowedHosts = ['new.express.adobe.com', 'express.adobe.com', 'adobesparkpost.app.link', 'adobesparkpost-web.app.link'];
    const { host } = new URL(planUrl);
    if (allowedHosts.includes(host) || planUrl.includes('/sp/')) {
      plan.offerId = 'FREE0';
      plan.frequency = 'monthly';
      plan.name = 'Free';
      plan.stringId = 'free-trial';
    } else {
      plan.offerId = params.get('items[0][id]');
      plan.frequency = null;
      plan.name = 'Premium';
      plan.stringId = '3-month-trial';
    }

    if (plan.offerId === '70C6FDFC57461D5E449597CC8F327CF1' || plan.offerId === 'CFB1B7F391F77D02FE858C43C4A5C64F') {
      plan.frequency = 'Monthly';
    } else if (plan.offerId === 'E963185C442F0C5EEB3AE4F4AAB52C24' || plan.offerId === 'BADDACAB87D148A48539B303F3C5FA92') {
      plan.frequency = 'Annual';
    } else {
      plan.frequency = null;
    }

    const offer = await getOfferOnePlans(plan.offerId);
    const foundOffer = Object.keys(offer).length > 0;
    if (foundOffer) {
      plan.currency = offer.currency;
      plan.price = offer.unitPrice;
      plan.basePrice = offer.basePrice;
      plan.country = offer.country;
      plan.vatInfo = offer.vatInfo;
      plan.language = offer.lang;
      plan.offerId = offer.customOfferId;
      plan.ooAvailable = offer.ooAvailable;
      plan.rawPrice = offer.unitPriceCurrencyFormatted?.match(/[\d\s,.+]+/g);
      plan.prefix = offer.prefix ?? '';
      plan.suffix = offer.suffix ?? '';
      plan.sup = offer.priceSuperScript ?? '';
      plan.savePer = offer.savePer ?? '';
      plan.showVat = offer.showVat ?? false;
      plan.term = offer.term;
      plan.formatted = offer.unitPriceCurrencyFormatted?.replace(
        plan.rawPrice[0],
        `<strong>${plan.prefix}${plan.rawPrice[0]}</strong>`,
      );

      if (offer.basePriceCurrencyFormatted) {
        plan.rawBasePrice = offer.basePriceCurrencyFormatted.match(/[\d\s,.+]+/g);
        plan.formattedBP = offer.basePriceCurrencyFormatted.replace(
          plan.rawBasePrice[0],
          `<strong>${plan.prefix}${plan.rawBasePrice[0]}</strong>`,
        );
      }
      plan.y2p = offer.y2p;
    } else {
      const [country, { getConfig }] = await Promise.all([getCountry(), import('../../../../utils/utils.js')]);
      plan.country = country;
      [plan.lang] = getConfig().locale.ietf.split('-');
    }
    window.pricingPlans[planUrl] = plan;
  }
  return plan;
}

const offerIdSuppressMap = new Map();

export function shallSuppressOfferEyebrowText(
  savePer,
  offerTextContent,
  isPremiumCard,
  isSpecialEyebrowText,
  offerId,
) {
  if (offerId == null || offerId === undefined) return true;
  const key = offerId + isSpecialEyebrowText;
  if (offerIdSuppressMap.has(key)) {
    return offerIdSuppressMap.get(key);
  }
  let suppressOfferEyeBrowText = false;
  if (offerTextContent) {
    suppressOfferEyeBrowText = savePer === '' && offerTextContent.includes('{{savePercentage}}');
  }
  offerIdSuppressMap.set(key, suppressOfferEyeBrowText);
  return suppressOfferEyeBrowText;
}

function replaceUrlParam(url, paramName, paramValue) {
  const params = url.searchParams;
  params.set(paramName, paramValue);
  url.search = params.toString();
  return url;
}

export function buildUrl(optionUrl, country, language, getConfig, offerId = '') {
  const currentUrl = new URL(window.location.href);
  let planUrl = new URL(optionUrl);

  if (!planUrl.hostname.includes('commerce')) {
    return planUrl.href;
  }
  planUrl = replaceUrlParam(planUrl, 'co', country);
  planUrl = replaceUrlParam(planUrl, 'lang', language);
  if (offerId) {
    planUrl.searchParams.set(decodeURIComponent('items%5B0%5D%5Bid%5D'), offerId);
  }
  let rUrl = planUrl.searchParams.get('rUrl');
  if (currentUrl.searchParams.has('host')) {
    const hostParam = currentUrl.searchParams.get('host');
    const { host } = new URL(hostParam);
    if (host === 'express.adobe.com') {
      planUrl.hostname = 'commerce.adobe.com';
      if (rUrl) rUrl = rUrl.replace('express.adobe.com', hostParam);
    } else if (host === 'qa.adobeprojectm.com') {
      planUrl.hostname = 'commerce.adobe.com';
      if (rUrl) rUrl = rUrl.replace('express.adobe.com', hostParam);
    } else if (host.endsWith('.adobeprojectm.com')) {
      planUrl.hostname = 'commerce-stg.adobe.com';
      if (rUrl) rUrl = rUrl.replace('adminconsole.adobe.com', 'stage.adminconsole.adobe.com');
      if (rUrl) rUrl = rUrl.replace('express.adobe.com', hostParam);
    }
  }

  const env = getConfig().env.name;
  if (env && getConfig()[env].commerce && planUrl.hostname.includes('commerce')) planUrl.hostname = getConfig()[env].commerce;
  if (env && getConfig()[env].express && rUrl) {
    const url = new URL(rUrl);
    url.hostname = getConfig()[env].express;
    rUrl = url.toString();
  }

  if (rUrl) {
    rUrl = new URL(rUrl);

    if (currentUrl.searchParams.has('touchpointName')) {
      rUrl = replaceUrlParam(rUrl, 'touchpointName', currentUrl.searchParams.get('touchpointName'));
    }
    if (currentUrl.searchParams.has('destinationUrl')) {
      rUrl = replaceUrlParam(rUrl, 'destinationUrl', currentUrl.searchParams.get('destinationUrl'));
    }
    if (currentUrl.searchParams.has('srcUrl')) {
      rUrl = replaceUrlParam(rUrl, 'srcUrl', currentUrl.searchParams.get('srcUrl'));
    }
  }

  if (currentUrl.searchParams.has('code')) {
    planUrl.searchParams.set('code', currentUrl.searchParams.get('code'));
  }

  if (currentUrl.searchParams.get('rUrl')) {
    rUrl = currentUrl.searchParams.get('rUrl');
  }

  if (rUrl) planUrl.searchParams.set('rUrl', rUrl.toString());
  return planUrl.href;
}

export async function formatDynamicCartLink(a, plan) {
  const { getConfig } = await import('../../utils/utils.js');
  try {
    const pattern = /.*commerce.*adobe\.com.*/gm;
    if (pattern.test(a.href)) {
      let response;
      if (!plan) {
        response = await fetchPlanOnePlans(a.href);
      } else {
        response = plan;
      }
      const newTrialHref = buildUrl(
        response.url,
        response.country,
        response.language,
        getConfig,
        response.offerId,
      );
      a.href = newTrialHref;
    }
  } catch (error) {
    window.lana.log('Failed to fetch prices for page plan');
    window.lana.log(error);
  }
  return a;
}
