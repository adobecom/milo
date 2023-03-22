import { loadScript, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

export default async function init() {
  if (!window.ost) {
    await loadScript(`https://www.stage.adobe.com/special/tacocat/ost/offer-selector-tool.js`);
  }

  const ostCountry = 'US';
  const ostLanguage = 'en';
  const ostEnvironment = 'STAGE';
  const ostWcsApiKey = 'wcms-commerce-ims-ro-user-cc';
  const ostAosApiKey = 'dexter-commerce-offers';
  const checkoutClientId = 'creative';
  const ostAosAccessToken = sessionStorage.getItem('AOS_ACCESS_TOKEN') || localStorage.getItem('AOS_ACCESS_TOKEN');
  const ostRootContainer = document.querySelector('.ost');
  let url = new URL(window.location);
  let searchParameters = url.searchParams;
  ostRootContainer.removeChild(ostRootContainer.firstElementChild);
  window.ost.openOfferSelectorTool({
    ostCountry,
    ostLanguage,
    ostEnvironment,
    ostWcsApiKey,
    ostAosApiKey,
    ostAosAccessToken,
    checkoutClientId,
    searchParameters,
  });
}
