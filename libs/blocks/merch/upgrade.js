import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const SOURCE_PF = ['PHOTOSHOP', 'ILLUSTRATOR', 'ACROBAT', 'AUDITION', 'RUSH', 'INDESIGN', '3DI', 'XD', 'PREMIERE', 'AFTEREFFECTS', 'DREAMWEAVER', 'CC_EXPRESS', 'INCOPY', '3D_TEXTURING', 'PHOTOGRAPHY', 'EDGE_ANIMATE', 'PHOTOSHOP_LIGHTROOM', 'ILLUSTRATOR_STOCK_BUNDLE'];
const TARGET_PF = ['CC_ALL_APPS', 'CC_ALL_APPS_STOCK_BUNDLE', 'CC_PRO'];
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
  if (!toOffer || !fromOffer) return undefined;
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

export default async function handleUpgradeOffer(ctaPF, upgradeOffer, entitlements) {
  if (!TARGET_PF.includes(ctaPF)) return undefined;

  const hasUpgradeTarget = entitlements?.find((offer) => isProductFamily(offer, TARGET_PF));
  if (hasUpgradeTarget) return undefined;

  const changePlanOffers = entitlements?.filter((offer) => offer.change_plan_available === true);
  const upgradable = changePlanOffers?.find((offer) => isProductFamily(offer, SOURCE_PF));
  if (!upgradable) return undefined;

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
      return modal;
    };
    return replaceKey('upgrade-now', config)
      .then((text) => ({ text, url: upgradeUrl, handler: showModal }));
  }
  return undefined;
}
