import ctaTextOption from './ctaTextOption.js';
import {
  getConfig, getLocale, getMetadata, loadScript, loadStyle, createTag,
} from '../../utils/utils.js';
import { initService, loadMasComponent, getMasLibs, getMiloLocaleSettings, MAS_COMMERCE_SERVICE } from '../merch/merch.js';

export const AOS_API_KEY = 'wcms-commerce-ims-user-prod';
export const CHECKOUT_CLIENT_ID = 'creative';
export const DEFAULT_CTA_TEXT = 'buy-now';
const IMS_COMMERCE_CLIENT_ID = 'aos_milo_commerce';
const IMS_SCOPE = 'AdobeID,openid';
const IMS_ENV = 'prod';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const OST_SCRIPT_URL = '/studio/ost/index.js';
const OST_STYLE_URL = '/studio/ost/index.css';
/** @see https://git.corp.adobe.com/PandoraUI/core/blob/master/packages/react-env-provider/src/component.tsx#L49 */
export const WCS_ENV = 'PROD';
export const WCS_API_KEY = 'wcms-commerce-ims-ro-user-cc';
export const WCS_LANDSCAPE = 'PUBLISHED';
export const WCS_LANDSCAPE_DRAFT = 'DRAFT';
export const LANDSCAPE_URL_PARAM = 'commerce.landscape';
export const DEFAULTS_URL_PARAM = 'commerce.defaults';

function isMasDefaultsEnabled() {
  const searchParameters = new URLSearchParams(window.location.search);
  const defaults = searchParameters.get(DEFAULTS_URL_PARAM) || 'on';
  return defaults === 'on';
}

let masCommerceService;
const masDefaultsEnabled = isMasDefaultsEnabled();

/**
 * Maps Franklin page metadata to OST properties.
 * Only values present in this object will be provided to OST.
 * Each key of the object is metadata key.
 * Each value is OST property name.
 */
const METADATA_MAPPINGS = { 'checkout-workflow': 'workflow' };

const priceDefaultOptions = {
  term: true,
  seat: true,
  tax: false,
  old: false,
  exclusive: false,
};

const updateParams = (params, key, value, opts) => {
  if (value !== opts[key]) {
    params.set(key, value);
  }
};

document.body.classList.add('tool', 'tool-ost');

/**
 * Gets the base URL for loading Tacocat OST build file based on maslibs parameter
 * @returns {string} Base URL for OST index.js
 */
export function getMasLibsBase(windowObj) {
  const urlParams = new URLSearchParams(windowObj.location.search);
  const masLibs = urlParams.get('maslibs');

  if (!masLibs || masLibs.trim() === '' || masLibs.trim() === 'main') return 'https://mas.adobe.com';

  return getMasLibs().replace('/web-components/dist', '');
}

/**
 * @param {Commerce.Defaults} defaults
 */
export const createLinkMarkup = async (
  defaults,
  offerSelectorId,
  type,
  offer,
  options,
  promo,
  country,
) => {
  const isCta = !!type?.startsWith('checkout');
  const cs = offer.customer_segment;
  const ms = offer.market_segments[0];
  const taxFlags = masDefaultsEnabled && masCommerceService
    ? await masCommerceService.resolvePriceTaxFlags(country, null, cs, ms)
    : {};

  const createHref = () => {
    const params = new URLSearchParams([
      ['osi', offerSelectorId],
      ['type', type],
    ]);
    if (promo) params.set('promo', promo);
    if (offer.commitment === 'PERPETUAL') params.set('perp', true);

    if (isCta) {
      const { workflowStep } = options;
      params.set('text', options.ctaText ?? DEFAULT_CTA_TEXT);
      if (workflowStep && workflowStep !== defaults.checkoutWorkflowStep) {
        params.set('workflowStep', workflowStep);
      }
      if (options.modal) params.set('modal', options.modal);
      if (options.entitlement) params.set('entitlement', options.entitlement);
      if (options.upgrade) params.set('upgrade', options.upgrade);
    } else {
      const {
        displayRecurrence,
        displayPerUnit,
        displayTax,
        displayOldPrice,
        forceTaxExclusive,
      } = options;
      const optsMasDefaults = masDefaultsEnabled ? {
        ...priceDefaultOptions,
        seat: offer.customer_segment !== 'INDIVIDUAL',
        tax: taxFlags.displayTax || priceDefaultOptions.tax,
        exclusive: taxFlags.forceTaxExclusive || priceDefaultOptions.exclusive,
      } : priceDefaultOptions;
      updateParams(params, 'term', displayRecurrence, optsMasDefaults);
      updateParams(params, 'seat', displayPerUnit, optsMasDefaults);
      updateParams(params, 'tax', displayTax, optsMasDefaults);
      updateParams(params, 'old', displayOldPrice, optsMasDefaults);
      updateParams(params, 'exclusive', forceTaxExclusive, optsMasDefaults);
    }
    return `https://milo.adobe.com/tools/ost?${params.toString()}`;
  };

  const link = document.createElement('a');
  link.textContent = isCta
    ? `CTA {{${options.ctaText ?? DEFAULT_CTA_TEXT}}}`
    : `PRICE - ${offer.planType} - ${offer.name}`;
  link.href = createHref();
  return link;
};

export async function loadOstEnv() {
  const searchParameters = new URLSearchParams(window.location.search);
  const ostSearchParameters = new URLSearchParams();
  // deprecate unsupported parameters
  const wcsLandscape = searchParameters.get('wcsLandscape');
  const commerceEnv = searchParameters.get('commerce.env');
  if (wcsLandscape || commerceEnv) {
    if (wcsLandscape) {
      searchParameters.set(LANDSCAPE_URL_PARAM, wcsLandscape);
      searchParameters.delete('wcsLandscape');
    }
    if (commerceEnv?.toLowerCase() === 'stage') {
      searchParameters.set(LANDSCAPE_URL_PARAM, WCS_LANDSCAPE_DRAFT);
      searchParameters.delete('commerce.env');
    }
    window.history.replaceState({}, null, `${window.location.origin}${window.location.pathname}?${searchParameters.toString()}`);
  }
  /* c8 ignore next */
  const attributes = { 'allow-override': 'true' };
  if (masDefaultsEnabled) {
    attributes['data-mas-ff-defaults'] = 'on';
  }
  await initService(true, attributes);
  // Load commerce.js based on masLibs parameter
  masCommerceService = await loadMasComponent(MAS_COMMERCE_SERVICE);

  // Get the exports - they might be in different places depending on how it was loaded
  let Log;
  let Defaults;
  if (getMasLibs() && window.mas?.commerce) {
    // Loaded from external URL - check global scope
    ({ Log, Defaults } = window.mas.commerce);
  } else {
    // Loaded as module
    ({ Log, Defaults } = await import('../../deps/mas/commerce.js'));
  }

  const defaultPlaceholderOptions = Object.fromEntries([
    ['term', 'displayRecurrence', 'true'],
    ['seat', 'displayPerUnit', masDefaultsEnabled ? null : 'true'],
    ['tax', 'displayTax'],
    ['old', 'displayOldPrice'],
  ].map(([key, targetKey, defaultValue = false]) => {
    const value = searchParameters.get(key) ?? defaultValue;
    searchParameters.delete(key);
    return [targetKey, value === 'true'];
  }));

  // value inversed for legacy compatibility reasons.
  const exclusive = !(searchParameters.get('exclusive') === 'true');
  searchParameters.delete('exclusive');
  defaultPlaceholderOptions.forceTaxExclusive = exclusive;

  const searchOfferSelectorId = searchParameters.get('osi');
  searchParameters.delete('osi');

  [
    ['type'],
    ['text'],
    ['promo', 'storedPromoOverride', true],
    ['workflow', 'checkoutType'],
    ['workflowStep'],
  ].forEach(([key, targetKey, skip = false]) => {
    const value = searchParameters.get(key);
    if (value === null && skip) {
      return;
    }
    ostSearchParameters.set(targetKey ?? key, value);
    searchParameters.delete(key);
  });

  const workflowStep = ostSearchParameters.get('workflowStep');
  ostSearchParameters.set('workflowStep', workflowStep?.replace('/', '_'));

  let aosAccessToken = searchParameters.get('token');
  if (aosAccessToken) {
    sessionStorage.setItem('AOS_ACCESS_TOKEN', aosAccessToken);
    searchParameters.delete('token');
  } else {
    aosAccessToken = sessionStorage.getItem('AOS_ACCESS_TOKEN');
  }
  const search = searchParameters.toString();
  const newURL = `//${window.location.host}${window.location.pathname}${search ? `?${search}` : ''}`;
  window.history.replaceState({}, null, newURL);

  const environment = searchParameters.get('env') ?? WCS_ENV;
  const landscape = searchParameters.get(LANDSCAPE_URL_PARAM) ?? WCS_LANDSCAPE;
  const owner = searchParameters.get('owner');
  const referrer = searchParameters.get('referrer');
  const repo = searchParameters.get('repo');

  let { country, language } = getMiloLocaleSettings();
  const { locales } = getConfig();
  const log = Log.module('ost');
  const metadata = {};
  let url;

  if (owner && referrer && repo) {
    try {
      const res = await fetch(`//admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      url = new URL(json.preview.url);
      const locale = getLocale(locales, url.pathname);
      /* c8 ignore next 1 */
      ({ country, language } = getMiloLocaleSettings(locale));
    } catch (error) {
      log.error('Unable to fetch page status:', error);
    }

    if (url) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const parser = new DOMParser();
        const doc = parser.parseFromString(await res.text(), 'text/html');
        Object.entries(METADATA_MAPPINGS).forEach(
          ([key, value]) => {
            const content = getMetadata(key, doc);
            if (content) metadata[value] = content;
          },
        );
      } catch (error) {
        log.error('Unable to fetch page metadata:', error);
      }
    }
  }

  const onSelect = async (
    offerSelectorId,
    type,
    offer,
    options,
    promoOverride,
    co,
  ) => {
    log.debug(offerSelectorId, type, offer, options, promoOverride);
    const link = await createLinkMarkup(
      Defaults,
      offerSelectorId,
      type,
      offer,
      options,
      promoOverride,
      co,
    );

    log.debug(`Use Link: ${link.outerHTML}`);
    const linkBlob = new Blob([link.outerHTML], { type: 'text/html' });
    const textBlob = new Blob([link.href], { type: 'text/plain' });
    // eslint-disable-next-line no-undef
    const data = [new ClipboardItem({ [linkBlob.type]: linkBlob, [textBlob.type]: textBlob })];
    navigator.clipboard.write(data, log.debug, log.error);
  };

  return {
    ...metadata,
    aosAccessToken,
    aosApiKey: AOS_API_KEY,
    checkoutClientId: CHECKOUT_CLIENT_ID,
    onSelect,
    country,
    environment,
    landscape,
    language,
    searchParameters: ostSearchParameters,
    searchOfferSelectorId,
    defaultPlaceholderOptions,
    wcsApiKey: WCS_API_KEY,
    ctaTextOption,
    resolvePriceTaxFlags: masCommerceService?.resolvePriceTaxFlags,
    modalsAndEntitlements: true,
  };
}

function addToggleSwitch(container, label, checked, onChange) {
  const switchDiv = createTag('div', { class: 'spectrum-Switch' }, null, { parent: container });
  const input = createTag('input', { type: 'checkbox', class: 'spectrum-Switch-input', id: 'gb-overlay-toggle' }, null, { parent: switchDiv });
  createTag('span', { class: 'spectrum-Switch-switch' }, null, { parent: switchDiv });
  createTag('label', { class: 'spectrum-Switch-label', for: 'gb-overlay-toggle' }, label, { parent: switchDiv });
  input.checked = checked;
  input.addEventListener('change', onChange);
}

function addToggleSwitches(el, ostEnv) {
  const { base } = getConfig();
  loadStyle(`${base}/blocks/graybox/switch.css`);
  const toggleContainer = createTag('span', { class: 'toggle-switch' }, null, { parent: el });
  addToggleSwitch(toggleContainer, 'Draft landscape offer', ostEnv.landscape === WCS_LANDSCAPE_DRAFT, (e) => {
    const url = new URL(window.location.href);
    if (e.target.checked) {
      url.searchParams.set(LANDSCAPE_URL_PARAM, WCS_LANDSCAPE_DRAFT);
    } else {
      url.searchParams.delete(LANDSCAPE_URL_PARAM);
    }
    window.location.href = url.toString();
  });
  addToggleSwitch(toggleContainer, 'MAS defaults', masDefaultsEnabled, (e) => {
    const url = new URL(window.location.href);
    if (!e.target.checked) {
      url.searchParams.set(DEFAULTS_URL_PARAM, 'off');
    } else {
      url.searchParams.delete(DEFAULTS_URL_PARAM);
    }
    window.location.href = url.toString();
  });
}

export default async function init(el) {
  el.innerHTML = '<div />';

  loadStyle(`${getMasLibsBase(window)}${OST_STYLE_URL}`);
  loadStyle('https://use.typekit.net/pps7abe.css');

  const [ostEnv] = await Promise.all([
    loadOstEnv(),
    loadScript(`${getMasLibsBase(window)}${OST_SCRIPT_URL}`),
  ]);

  function openOst() {
    window.ost.openOfferSelectorTool({
      ...ostEnv,
      rootElement: el.firstElementChild,
    });
    addToggleSwitches(el, ostEnv);
  }

  if (ostEnv.aosAccessToken) {
    openOst();
  } else {
    window.adobeid = {
      client_id: IMS_COMMERCE_CLIENT_ID,
      environment: IMS_ENV,
      optimizations: { fastEvents: true },
      autoValidateToken: true,
      scope: IMS_SCOPE,
      onAccessToken: ({ token }) => {
        ostEnv.aosAccessToken = token;
        openOst();
      },
      onReady: () => {
        if (!window.adobeIMS.isSignedInUser()) {
          window.adobeIMS.signIn();
        }
      },
    };

    await loadScript(IMS_PROD_URL);
  }
}
