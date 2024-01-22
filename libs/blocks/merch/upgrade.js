import { loadIms, getMetadata, createTag } from '../../utils/utils.js';
import getUserEntitlements from '../global-navigation/utilities/getUserEntitlements.js';

const isProductFamily = (offer, pfs) => {
  const productFamily = offer?.offer?.product_arrangement?.family;
  return productFamily && pfs.includes(productFamily);
};

const upgradeCta = async (cta) => {
  const path = 'https://stage.plan.adobe.com?toOfferId=632B3ADD940A7FBB7864AA5AD19B8D28&language=en&intent=switch&surface=ADOBE_COM&ctx=if&ctxRtUrl=https://www.qa01.adobe.com/creativecloud/plans.html&onClose=https://www.stage.adobe.com&fromOffer=25A15F318CDEA57CB477721B9CAE0AB8';

  const iframe = createTag('iframe', {
    src: path,
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
  // replace cta with upgrade
  cta.textContent = 'Upgrade';
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
  const hasUpgradeTarget = entitlements?.find((offer) => isProductFamily(offer, targetPF));
  if (hasUpgradeTarget) return;

  const changePlanOffers = entitlements?.filter((offer) => offer.change_plan_available === true);
  const upgradable = changePlanOffers?.find((offer) => isProductFamily(offer, sourcePF));
  if (upgradable) {
    await upgradeCta(cta, upgradeOffer);
  }
}
