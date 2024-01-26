import { loadIms, getMetadata, createTag, getConfig } from '../../utils/utils.js';
import getUserEntitlements from '../global-navigation/utilities/getUserEntitlements.js';

const isProductFamily = (offer, pfs) => {
  const productFamily = offer?.offer?.product_arrangement?.family;
  return productFamily && pfs.includes(productFamily);
};

const upgradeCta = async (cta, upgradable, upgradeOffer) => {
  const { value } = await upgradeOffer.onceSettled();
  if (!upgradable?.offer?.offer_id || value.length === 0) return;
  const { env } = getConfig();
  const url = new URL(env?.name === 'prod' ? 'https://plan.adobe.com' : 'https://stage.plan.adobe.com');
  url.searchParams.append('intent', 'switch');
  url.searchParams.append('toOfferId', upgradeOffer.value[0].offerId);
  url.searchParams.append('fromOffer', upgradable.offer.offer_id);
  url.searchParams.append('language', 'en'); // todo check where comes from
  url.searchParams.append('surface', 'ADOBE_COM');
  url.searchParams.append('ctx', 'if');
  url.searchParams.append('ctxRtUrl', encodeURIComponent(window.location.href));

  const iframe = createTag('iframe', {
    src: url.toString(),
    title: 'Upgrade modal',
    frameborder: '0',
    marginwidth: '0',
    marginheight: '0',
    scrolling: 'no',
    allowfullscreen: 'true',
    loading: 'lazy',
    class: 'upgrade-flow-iframe',
  });

  const { getModal } = await import('../modal/modal.js');
  cta.addEventListener('click', async (e) => {
    e.preventDefault();
    getModal(null, { id: 'preflight', content: iframe, closeEvent: 'closeModal', class: ['upgrade-flow-modal'] });
  });
  cta.textContent = 'Upgrade now';
  cta.dataset.switchPlanUrl = url.toString();
};

const upgradeCta2 = async (cta) => {
  const url = 'https://stage.plan.adobe.com/?intent=switch&toOfferId=632B3ADD940A7FBB7864AA5AD19B8D28&fromOffer=5F2E4A8FD58D70C8860F51A4DE042E0C&language=en&surface=ADOBE_COM&ctx=if&ctxRtUrl=http%3A%2F%2Flocalhost%3A3000%2Fdrafts%2Fmariia%2FupgradeFlow%2Fupgradeflow%23';
  const iframe = createTag('iframe', {
    src: url,
    title: 'Upgrade modal',
    frameborder: '0',
    marginwidth: '0',
    marginheight: '0',
    scrolling: 'no',
    allowfullscreen: 'true',
    loading: 'lazy',
    class: 'upgrade-flow-iframe',
  });

  const { getModal } = await import('../modal/modal.js');
  cta.addEventListener('click', async (e) => {
    e.preventDefault();
    getModal(null, { id: 'preflight', content: iframe, closeEvent: 'closeModal', class: ['upgrade-flow-modal'] });
  });
  cta.textContent = 'Upgrade now';
};

const getProductFamily = async (placeholder) => {
  const { value } = await placeholder.onceSettled();
  if (!value || value.length === 0) return null;
  // todo temporary fix till WCS implements the product family
  const { productArrangementCode } = value[0];
  if (!productArrangementCode) return null;
  if (productArrangementCode === 'ccsn_direct_individual') {
    return 'CC_ALL_APPS';
  }
  if (productArrangementCode === 'DRAFTS') {
    return 'photoshop';
  }
  return null;
};

/**
 * Metadata 'switch-modal' format is 'switch-modal'PHOTOSHOP, ILLUSTRATOR: CC_ALL_APPS'
 * 'sourcePF' source product family, e.g. PHOTOSHOP or ILLUSTRATOR
 * 'targetPF' target product family, e.g. CC_ALL_APPS
 *
 * This method checks if:
 * 1. The CTA is in the list of upgrade targets, e.g. CC_ALL_APPS
 * 2. The user is signed in
 * 3. The user doesn't have an upgrade target, e.g. CC_ALL_APPS already
 * 4. The user has an upgrade source offer, e.g. PHOTOSHOP or ILLUSTRATOR, etc.
 *
 */
export default async function handleUpgradeOffer(cta, upgradeOffer) {
  const [sourcePF, targetPF] = getMetadata('switch-modal').split(':')
    .map((productFamilies) => productFamilies.split(',').map((pf) => pf.trim()).filter(Boolean));
  const ctaProductFamily = await getProductFamily(cta);
  if (!targetPF.includes(ctaProductFamily)) return;

  await loadIms();
  if (!window.adobeIMS.isSignedInUser()) return;
  const entitlements = await getUserEntitlements({ params: [{ name: 'include', value: 'OFFER.PRODUCT_ARRANGEMENT' }], format: 'raw' });
  if (!entitlements || !Array.isArray(entitlements)) return;
  const hasUpgradeTarget = entitlements?.find((offer) => isProductFamily(offer, targetPF));
  if (hasUpgradeTarget) return;

  const changePlanOffers = entitlements?.filter((offer) => offer.change_plan_available === true);
  const upgradable = changePlanOffers?.find((offer) => isProductFamily(offer, sourcePF));
  if (upgradable) {
    await upgradeCta(cta, upgradable, upgradeOffer);
  }
}

/**
* Replaces the `ctxRtUrl` in the `queryString`
* @param {string} queryString
* @returns {string}
*/
export function replaceCtxRtUrl(queryString) {
  /* In order for the RETURN_BACK navigation to work correctly, the host page must include
  a ctxRtUrl query param in the iframe src. This value should represent the URL of the host page
  and will be used as the return URL (for example, when redirecting to PayPal). */
  if (!queryString || typeof queryString !== 'string') return '';

  if (queryString.includes('ctxRtUrl=')) {
    const ctxUrlRegexp = /ctxRtUrl=([^&]+)/; // matches this part of the string: ctxRtUrl=https%3A%2F%2Faccount.stage.adobe.com
    return queryString.replace(ctxUrlRegexp, properCtxRtUrl);
  }
  return `${queryString}${properCtxRtUrl}`;
}
