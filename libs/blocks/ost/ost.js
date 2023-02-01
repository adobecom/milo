import { loadScript, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

export default async function init() {
  if (!window.ost) {
    await loadScript(`${base}/deps/offer-selector-tool.js`);
  }

  const ostCountry = 'US';
  const ostLanguage = 'en';
  const ostEnvironment = 'STAGE';
  const ostWcsApiKey = 'wcms-commerce-ims-ro-user-cc';
  const ostAosApiKey = 'dexter-commerce-offers';
  const ostAosAccessToken = sessionStorage.getItem('AOS_ACCESS_TOKEN') || localStorage.getItem('AOS_ACCESS_TOKEN');
  const ostRootContainer = document.querySelector('.ost');
  let url = new URL(window.location);
  let searchParams = new URLSearchParams(url.search);
  let osiSearch = searchParams.get('osi');
  ostRootContainer.removeChild(ostRootContainer.firstElementChild);
  window.ost.openOfferSelectorTool({
    ostCountry,
    ostLanguage,
    ostEnvironment,
    ostWcsApiKey,
    ostAosApiKey,
    ostAosAccessToken,
    osiSearch
  });
}
