import { loadScript, loadStyle } from '../../utils/utils.js';

const IMS_COMMERCE_CLIENT_ID = 'aos_milo_commerce';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const OST_SCRIPT_URL = 'https://www.stage.adobe.com/special/tacocat/ost/lib/1.10.0/index.js';
const OST_STYLE_URL = 'https://www.stage.adobe.com/special/tacocat/ost/lib/1.10.0/index.css';

const ENVIRONMENT = 'PROD';
const WCS_API_KEY = 'wcms-commerce-ims-ro-user-cc';
const AOS_API_KEY = 'wcms-commerce-ims-user-prod';
const CHECKOUT_CLIENT_ID = 'creative';

const searchParameters = new URLSearchParams(window.location.search);
const token = searchParameters.get('token');
if (token) {
  searchParameters.delete('token');
}

document.body.classList.add('tool', 'tool-ost');

export function createLinkMarkup(
  offerSelectorId,
  type,
  { offer_id: offerId, name: offerName, commitment, planType },
  placeholderOptions,
  location = window.location,
) {
  const ctaText = 'buy-now';
  const isCheckoutPlaceholder = !!type && type.startsWith('checkout');
  const createText = () => (isCheckoutPlaceholder
    ? `CTA {{${ctaText}}}`
    : `{{PRICE - ${planType} - ${offerName}}}`);

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

let rootElement;

function initOST({ token: aosAccessToken }) {
  const country = 'US';
  const language = 'en';

  const options = {
    rootMargin: '0px',
    threshold: 1.0,
  };

  const main = document.querySelector('main');
  const observer = new IntersectionObserver(() => {
    observer.unobserve(main);
    window.ost.openOfferSelectorTool({
      country,
      language,
      environment: ENVIRONMENT,
      wcsApiKey: WCS_API_KEY,
      aosApiKey: AOS_API_KEY,
      aosAccessToken,
      checkoutClientId: CHECKOUT_CLIENT_ID,
      searchParameters,
      createLinkMarkup,
      rootElement,
    });
  }, options);
  observer.observe(main);
}

export default async function init(el) {
  if (rootElement) return; // only one OST is supported per page
  el.innerHTML = '<div />';
  rootElement = el.firstElementChild;

  loadStyle(OST_STYLE_URL);
  await loadScript(OST_SCRIPT_URL);
  await loadStyle('https://use.typekit.net/pps7abe.css');
  if (token) {
    initOST({ token });
  } else {
    window.adobeid = {
      client_id: IMS_COMMERCE_CLIENT_ID,
      environment: 'prod',
      optimizations: { fastEvents: true },
      autoValidateToken: true,
      scope: 'AdobeID,openid',
      onAccessToken: initOST,
      onReady: () => {
        if (!window.adobeIMS.isSignedInUser()) {
          window.adobeIMS.signIn();
        }
      },
    };
    await loadScript(IMS_PROD_URL);
  }
}
