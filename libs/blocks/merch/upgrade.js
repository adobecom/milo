import { getMetadata, createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const isProductFamily = (offer, pfs) => {
  const productFamily = offer?.offer?.product_arrangement?.family;
  return productFamily && pfs.includes(productFamily);
};

function buildUrl(upgradeOffer, upgradable, config) {
  const toOffer = upgradeOffer?.value[0].offerId;
  const fromOffer = upgradable?.offer?.offer_id;
  if (!toOffer || !fromOffer) return;
  const { env } = config;
  const url = new URL(env?.name === 'prod' ? 'https://plan.adobe.com' : 'https://stage.plan.adobe.com');
  url.searchParams.append('intent', 'switch');
  url.searchParams.append('toOfferId', toOffer);
  url.searchParams.append('fromOffer', fromOffer);
  url.searchParams.append('language', 'en'); // todo check where comes from
  url.searchParams.append('surface', 'ADOBE_COM');
  url.searchParams.append('ctx', 'if');
  url.searchParams.append('ctxRtUrl', encodeURIComponent(window.location.href));
  return url.toString();
}

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
export default async function handleUpgradeOffer(ctaPF, upgradeOffer, entitlements) {
  const [sourcePF, targetPF] = getMetadata('switch-modal').split(':')
    .map((productFamilies) => productFamilies.split(',').map((pf) => pf.trim()).filter(Boolean));
  if (!targetPF.includes(ctaPF)) return;

  const hasUpgradeTarget = entitlements?.find((offer) => isProductFamily(offer, targetPF));
  if (hasUpgradeTarget) return;

  const changePlanOffers = entitlements?.filter((offer) => offer.change_plan_available === true);
  const upgradable = changePlanOffers?.find((offer) => isProductFamily(offer, sourcePF));
  if (!upgradable) return;

  await upgradeOffer.onceSettled();
  const config = getConfig();
  const upgradeUrl = buildUrl(upgradeOffer, upgradable, config);
  if (upgradeUrl) {
    const iframe = createTag('iframe', {
      src: upgradeUrl,
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
    const func = (e) => {
      e.preventDefault();
      getModal(null, { id: 'preflight', content: iframe, closeEvent: 'closeModal', class: ['upgrade-flow-modal'] });
      this.dataset.switchPlanUrl2 = upgradeUrl;
    };
    const text = await replaceKey('upgrade-now', config);
    return { text, url: upgradeUrl, handler: func };
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
