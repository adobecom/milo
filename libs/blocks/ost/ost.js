import { loadScript, loadStyle } from '../../utils/utils.js';

const IMS_COMMERCE_CLIENT_ID = 'aos_milo_commerce';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const OST_SCRIPT_URL = 'https://www.stage.adobe.com/special/tacocat/ost/lib/index.js';
const OST_STYLE_URL = 'https://www.stage.adobe.com/special/tacocat/ost/lib/index.css';

const getImsToken = async () => {
  window.adobeid = {
    client_id: IMS_COMMERCE_CLIENT_ID,
    environment: 'prod',
    scope: 'AdobeID,openid',
  };
  if (!window.adobeIMS) {
    await loadScript(IMS_PROD_URL);
  }
  if (!window.adobeIMS.isSignedInUser()) {
    window.adobeIMS.signIn();
  }
  return window.adobeIMS?.getAccessToken()?.token;
};
export function createLinkMarkup(
  offerSelectorId,
  type,
  { offer_id: offerId, name: offerName, commitment },
  placeholderOptions,
  location = window.location,
) {
  const ctaText = 'buy-now';
  const isCheckoutPlaceholder = !!type && type.startsWith('checkout');
  const createText = () => (isCheckoutPlaceholder
    ? `CTA {{${ctaText}}}`
    : `{{PRICE - ${offerId} - ${offerName}}}`);

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
      const { workflow, workflowStep } = placeholderOptions;
      url.searchParams.set('text', 'buy-now');
      url.searchParams.set('checkoutType', workflow);
      url.searchParams.set(
        'workflowStep',
        toggleWorkflowStepFormat(workflowStep),
      );
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

export default async function init() {
  const aosAccessToken = await getImsToken();
  const country = 'US';
  const language = 'en';
  const environment = 'PROD';
  const wcsApiKey = 'wcms-commerce-ims-ro-user-cc';
  const aosApiKey = 'wcms-commerce-ims-user-prod';
  const checkoutClientId = 'creative';
  const rootContainer = document.querySelector('.ost');
  const searchParameters = new URLSearchParams(window.location.search);
  rootContainer.removeChild(rootContainer.firstElementChild);
  if (!window.ost) {
    loadStyle(OST_STYLE_URL);
    await loadScript(OST_SCRIPT_URL);
  }
  window.ost.openOfferSelectorTool({
    country,
    language,
    environment,
    wcsApiKey,
    aosApiKey,
    aosAccessToken,
    checkoutClientId,
    searchParameters,
    createLinkMarkup,
  });
}
