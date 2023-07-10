/// <reference path="../../deps/commerce.d.ts" />
import ctaTextOption from './ctaTextOption.js';
import { getConfig, getLocale, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';

export const AOS_API_KEY = 'wcms-commerce-ims-user-prod';
export const CHECKOUT_CLIENT_ID = 'creative';
const IMS_COMMERCE_CLIENT_ID = 'aos_milo_commerce';
const IMS_SCOPE = 'AdobeID,openid';
const IMS_ENV = 'prod';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const OST_VERSION = '1.11.0';
const OST_BASE = `https://www.stage.adobe.com/special/tacocat/ost/lib/${OST_VERSION}`;
const OST_SCRIPT_URL = `${OST_BASE}/index.js`;
const OST_STYLE_URL = `${OST_BASE}/index.css`;
/** @see https://git.corp.adobe.com/PandoraUI/core/blob/master/packages/react-env-provider/src/component.tsx#L49 */
export const PANDORA_ENV = 'production';
export const WCS_API_KEY = 'wcms-commerce-ims-ro-user-cc';

/**
 * Maps Franklin page metadata to OST properties.
 * Only values present in this object will be provided to OST.
 * Each key of the object is metadata key.
 * Each value is OST property name.
 */
const METADATA_MAPPINGS = { 'checkout-workflow': 'workflow' };

document.body.classList.add('tool', 'tool-ost');

/**
 * @param {Commerce.Defaults} defaults
 */
export const LinkMarkupFactory = (defaults) => (
  offerSelectorId,
  type,
  { offer_id: offerId, name: offerName, commitment, planType },
  placeholderOptions,
  location = window.location,
) => {
  const { ctaText = 'buy-now' } = placeholderOptions;
  const isCheckoutPlaceholder = !!type && type.startsWith('checkout');
  const createText = () => (isCheckoutPlaceholder
    ? `CTA {{${ctaText}}}`
    : `PRICE - ${planType} - ${offerName}`);

  const createHref = () => {
    const url = new URL(location.protocol + location.host);
    url.pathname = '/tools/ost';
    url.searchParams.set('osi', offerSelectorId);
    url.searchParams.set('offerId', offerId);
    url.searchParams.set('type', type);

    if (commitment === 'PERPETUAL') {
      url.searchParams.set('perp', true);
    }
    const toggleWorkflowStepFormat = (workflowStep) => (workflowStep
      ? workflowStep.replace(/[_/]/g, (match) => (match === '_' ? '/' : '_'))
      : '');

    if (isCheckoutPlaceholder) {
      url.searchParams.set('text', ctaText);
      const { workflow, workflowStep } = placeholderOptions;
      if (workflow !== defaults.checkoutWorkflow) {
        url.searchParams.set('workflow', workflow);
      }
      if (workflowStep !== defaults.checkoutWorkflowStep) {
        url.searchParams.set(
          'workflowStep',
          toggleWorkflowStepFormat(workflowStep),
        );
      }
    } else {
      const { displayRecurrence, displayPerUnit, displayTax } = placeholderOptions;
      url.searchParams.set('term', displayRecurrence);
      url.searchParams.set('seat', displayPerUnit);
      url.searchParams.set('tax', displayTax);
    }

    return url.toString();
  };

  const link = document.createElement('a');
  link.textContent = createText();
  link.href = createHref();
  return link;
};

export async function loadOstEnv() {
  /* c8 ignore next */
  const { Log, defaults, getLocaleSettings } = await import('../../deps/commerce.js');

  const searchParameters = new URLSearchParams(window.location.search);
  const aosAccessToken = searchParameters.get('token');
  searchParameters.delete('token');
  const owner = searchParameters.get('owner');
  const referrer = searchParameters.get('referrer');
  const repo = searchParameters.get('repo');

  let { country, language } = getLocaleSettings();
  const { locales } = getConfig();
  const log = Log.commerce.module('ost');
  const metadata = {};
  let url;

  if (owner && referrer && repo) {
    try {
      const res = await fetch(`//admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      url = new URL(json.preview.url);
      const locale = getLocale(locales, url.pathname);
      ({ country, language } = getLocaleSettings({ locale }));
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

  return {
    ...metadata,
    aosAccessToken,
    aosApiKey: AOS_API_KEY,
    checkoutClientId: CHECKOUT_CLIENT_ID,
    createLinkMarkup: LinkMarkupFactory(defaults),
    country,
    environment: PANDORA_ENV,
    language,
    searchParameters,
    wcsApiKey: WCS_API_KEY,
    ctaTextOption,
  };
}

export default async function init(el) {
  el.innerHTML = '<div />';

  loadStyle(OST_STYLE_URL);
  loadStyle('https://use.typekit.net/pps7abe.css');

  const [ostEnv] = await Promise.all([
    loadOstEnv(),
    loadScript(OST_SCRIPT_URL),
  ]);

  function openOst() {
    window.ost.openOfferSelectorTool({
      ...ostEnv,
      rootElement: el.firstElementChild,
    });
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
