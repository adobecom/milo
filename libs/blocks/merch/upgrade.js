import { loadIms } from '../../utils/utils.js';
import getUserEntitlements from '../global-navigation/utilities/getUserEntitlements.js';

// todo figure out if list of cta should be configurable
// or additionally defined by some flag
const isUpgradeTarget = (ctaProductFamily) => {
  if (ctaProductFamily === 'CC_ALL_APPS'
    || ctaProductFamily === 'CC_ALL_APPS_STOCK_BUNDLE'
    || ctaProductFamily === 'CC_PRO') return true;
  return false;
};

const isUpgradable = (offer) => {
  const productFamily = offer?.offer?.product_arrangement?.family;
  const upgradableOffers = ['PHOTOSHOP', 'ILLUSTRATOR', 'ACROBAT', 'AUDITION', 'RUSH', 'INDESIGN', '3DI', 'XD', 'PREMIERE', 'AFTEREFFECTS', 'DREAMWEAVER', 'CC_EXPRESS', 'INCOPY', '3D_TEXTURING', 'PHOTOGRAPHY', 'EDGE_ANIMATE', 'PHOTOSHOP_LIGHTROOM', 'ILLUSTRATOR_STOCK_BUNDLE'];
  return productFamily && upgradableOffers.includes(productFamily);
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

export default async function handleUpgradeOffer(cta, upgradeOffer) {
  const ctaProductFamily = await getProductFamily(cta);
  if (!isUpgradeTarget(ctaProductFamily)) return;

  await loadIms();
  if (!window.adobeIMS.isSignedInUser()) return;
  const entitlements = await getUserEntitlements({ params: [{ name: 'include', value: 'OFFER.PRODUCT_ARRANGEMENT' }], format: 'raw' });
  const hasUpgradeTarget = entitlements?.find((offer) => {
    const productFamily = offer?.offer?.product_arrangement?.family;
    return isUpgradeTarget(productFamily);
  });
  if (hasUpgradeTarget) return;

  const changePlanOffers = entitlements?.filter((offer) => offer.change_plan_available === true);
  const upgradable = changePlanOffers?.find((offer) => isUpgradable(offer));
  if (upgradable) {
    await upgradeCta(cta, upgradeOffer);
  }
}
