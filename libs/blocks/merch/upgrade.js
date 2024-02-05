import { getMetadata, createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const MANAGE_PLAN_MSG_SUBTYPE = {
  AppLoaded: 'AppLoaded',
  EXTERNAL: 'EXTERNAL',
  SWITCH: 'SWITCH',
  RETURN_BACK: 'RETURN_BACK',
  OrderComplete: 'OrderComplete',
  Error: 'Error',
  Close: 'Close',
};
const isProductFamily = (offer, pfs) => {
  const productFamily = offer?.offer?.product_arrangement?.family;
  return productFamily && pfs.includes(productFamily);
};
let shouldRefetchEntitlements = false;
let modal;

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

const handleIFrameEvents = ({ data: msgData }) => {
  let parsedMsg = null;
  try {
    parsedMsg = JSON.parse(msgData);
  } catch (error) {
    // If message data can't be JSON.parse()-d, we can ignore this message, it's not the one we need
    return;
  }
  const { app, subType, data } = parsedMsg || {};

  if (app !== 'ManagePlan') return;
  switch (subType) {
    case MANAGE_PLAN_MSG_SUBTYPE.AppLoaded:
      // todo hide spinner
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.EXTERNAL:
      if (!data?.externalUrl || !data.target) return;
      window.open(data.externalUrl, data.target);
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.SWITCH:
      if (!data?.externalUrl || !data.target) return;
      window.open(data.externalUrl, data.target);
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.RETURN_BACK:
      if (!data?.externalUrl || !data.target) return;
      if (data.returnUrl) {
        window.sessionStorage.setItem('upgradeModalReturnUrl', data.returnUrl);
      }
      window.open(data.externalUrl, data.target);
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.OrderComplete:
      shouldRefetchEntitlements = true;
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.Error:
      break;
    case MANAGE_PLAN_MSG_SUBTYPE.Close:
      // todo deletePayPalParamsFromPageUrl();
      if (shouldRefetchEntitlements) {
        window.location.reload();
      }
      modal?.dispatchEvent(new Event('closeModal'));
      break;
    default:
      break;
  }
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
    window.addEventListener('message', handleIFrameEvents);
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
    const content = createTag('div', { class: 'upgrade-flow-modal-content' });
    content.append(iframe);

    const showModal = async (e) => {
      e.preventDefault();
      modal = await getModal(null, { id: 'preflight', content, closeEvent: 'closeModal', class: ['upgrade-flow-modal'] });
      this.dataset.switchPlanUrl2 = upgradeUrl;
    };
    const text = await replaceKey('upgrade-now', config);
    return { text, url: upgradeUrl, handler: showModal };
  }
}
