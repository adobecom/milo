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
  });
}
