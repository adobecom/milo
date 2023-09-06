import ctaTextOption from './ctaTextOption.js';
import { getConfig, getLocale, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';
import { ENV_PROD, getTacocatEnv } from '../merch/merch.js';

const IMS_COMMERCE_CLIENT_ID = 'aos_milo_commerce';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const OST_VERSION = '1.12.0';
const OST_BASE = `https://www.stage.adobe.com/special/tacocat/ost/lib/${OST_VERSION}`;
const OST_SCRIPT_URL = `${OST_BASE}/index.js`;
const OST_STYLE_URL = `${OST_BASE}/index.css`;

export const AOS_API_KEY = 'wcms-commerce-ims-user-prod';
export const CHECKOUT_CLIENT_ID = 'creative';
export const WCS_API_KEY = 'wcms-commerce-ims-ro-user-cc';

/**
 * Maps Franklin page metadata to OST properties.
 * Only values present in this object will be provided to OST.
 * Each key of the object is metadata key.
 * Each value - OST property name.
 */
const METADATA_MAPPINGS = { 'checkout-type': 'checkoutType' };

document.body.classList.add('tool', 'tool-ost');

export function createLinkMarkup(
  offerSelectorId,
  type,
  { offer_id: offerId, name: offerName, commitment, planType },
  placeholderOptions,
  location = window.location,
) {
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
      const DEFAULT_WORKFLOW = 'UCv3';
      const DEFAULT_WORKFLOW_STEP = 'email';
      const { workflow, workflowStep } = placeholderOptions;
      url.searchParams.set('text', ctaText);
      if (workflow !== DEFAULT_WORKFLOW) {
        url.searchParams.set('checkoutType', workflow);
      }
      if (workflowStep !== DEFAULT_WORKFLOW_STEP) {
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
}

export async function loadOstEnv() {
  const searchParameters = new URLSearchParams(window.location.search);
  const aosAccessToken = searchParameters.get('token');
  searchParameters.delete('token');
  const owner = searchParameters.get('owner');
  const referrer = searchParameters.get('referrer');
  const repo = searchParameters.get('repo');

  let country;
  let language;
  let locale;
  const { locales } = getConfig();
  const metadata = {};
  let url;

  if (owner && referrer && repo) {
    try {
      const res = await fetch(`//admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      url = new URL(json.preview.url);
      locale = getLocale(locales, url.pathname);
      ({ country, language } = getTacocatEnv(ENV_PROD, locale));
    } catch (e) {
      console.error('OST, failed to get env:', e.message);
      ({ country, language } = getTacocatEnv());
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
      } catch (e) {
        console.error('OST, failed to get metadata:', e.message);
      }
    }
  }

  ({ country, language } = getTacocatEnv(ENV_PROD, locale));

  return {
    ...metadata,
    aosAccessToken,
    aosApiKey: AOS_API_KEY,
    checkoutClientId: CHECKOUT_CLIENT_ID,
    country,
    environment: ENV_PROD.toUpperCase(),
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
      createLinkMarkup,
      rootElement: el.firstElementChild,
    });
  }

  if (ostEnv.aosAccessToken) {
    openOst();
  } else {
    window.adobeid = {
      client_id: IMS_COMMERCE_CLIENT_ID,
      environment: 'prod',
      optimizations: { fastEvents: true },
      autoValidateToken: true,
      scope: 'AdobeID,openid',
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
