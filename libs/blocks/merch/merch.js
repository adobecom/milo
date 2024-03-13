import {
  createTag, getConfig, loadArea, loadScript, loadStyle, localizeLink,
} from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

export const PRICE_LITERALS_URL = 'https://milo.adobe.com/libs/commerce/price-literals.json';
export const CHECKOUT_LINK_CONFIG_PATH = '/commerce/checkout-link.json'; // relative to libs.

export const PRICE_TEMPLATE_DISCOUNT = 'discount';
export const PRICE_TEMPLATE_OPTICAL = 'optical';
export const PRICE_TEMPLATE_REGULAR = 'price';
export const PRICE_TEMPLATE_STRIKETHROUGH = 'strikethrough';

export const PLACEHOLDER_KEY_DOWNLOAD = 'download';

export const CC_SINGLE_APPS = [
  ['3D_TEXTURING'],
  ['3DI'],
  ['ACROBAT', 'ACROBAT_STOCK_BUNDLE'],
  ['AFTEREFFECTS', 'AFTER_EFFECTS_STOCK_BUNDLE'],
  ['AUDITION', 'AUDITION_STOCK_BUNDLE'],
  ['CC_EXPRESS'],
  ['FLASH', 'FLASH_STOCK_BUNDLE'],
  ['DREAMWEAVER', 'DREAMWEAVER_STOCK_BUNDLE'],
  ['EDGE_ANIMATE'],
  ['ILLUSTRATOR', 'ILLUSTRATOR_STOCK_BUNDLE'],
  ['INCOPY', 'INCOPY_STOCK_BUNDLE'],
  ['INDESIGN', 'INDESIGN_STOCK_BUNDLE'],
  ['PHOTOGRAPHY', 'PHOTOGRAPHY_STOCK_BUNDLE'],
  ['PHOTOSHOP_LIGHTROOM'],
  ['PHOTOSHOP', 'PHOTOSHOP_STOCK_BUNDLE'],
  ['PREMIERE', 'PREMIERE_STOCK_BUNDLE'],
  ['RUSH'],
  ['XD'],
];

export const CC_SINGLE_APPS_ALL = CC_SINGLE_APPS.flatMap((item) => item);

export const CC_ALL_APPS = ['CC_ALL_APPS',
  'CC_ALL_APPS_STOCK_BUNDLE', 'CC_PRO'];

const NAME_LOCALE = 'LOCALE';
const NAME_PRODUCT_FAMILY = 'PRODUCT_FAMILY';
const FREE_TRIAL_PATH = 'FREE_TRIAL_PATH';
const BUY_NOW_PATH = 'BUY_NOW_PATH';
const OFFER_TYPE_TRIAL = 'TRIAL';
const LOADING_ENTITLEMENTS = 'loading-entitlements';

let log;
let upgradeOffer = null;

export async function polyfills() {
  if (polyfills.promise) return polyfills.promise;
  let isSupported = false;
  document.createElement('div', {
    // eslint-disable-next-line getter-return
    get is() {
      isSupported = true;
    },
  });
  if (isSupported) {
    polyfills.promise = Promise.resolve();
  } else {
    const { base } = getConfig();
    polyfills.promise = loadScript(`${base}/deps/custom-elements.js`);
  }
  return polyfills.promise;
}

export async function fetchEntitlements() {
  fetchEntitlements.promise = fetchEntitlements.promise ?? import('../global-navigation/utilities/getUserEntitlements.js')
    .then(({ default: getUserEntitlements }) => getUserEntitlements(
      {
        params:
          [
            { name: 'include', value: 'OFFER.PRODUCT_ARRANGEMENT' }],
        format: 'raw',
      },
    ));
  return fetchEntitlements.promise;
}

export async function fetchCheckoutLinkConfigs(base = '') {
  fetchCheckoutLinkConfigs.promise = fetchCheckoutLinkConfigs.promise
    ?? fetch(`${base}${CHECKOUT_LINK_CONFIG_PATH}`).catch(() => {
      log?.error('Failed to fetch checkout link configs');
    }).then((mappings) => {
      if (!mappings?.ok) return undefined;
      return mappings.json();
    });
  return fetchCheckoutLinkConfigs.promise;
}

export async function getCheckoutLinkConfig(productFamily) {
  let { base } = getConfig();
  if (/\.page$/.test(document.location.origin)) {
    /* c8 ignore next 2 */
    base = base.replace('.live', '.page');
  }
  const checkoutLinkConfigs = await fetchCheckoutLinkConfigs(base);
  const { locale: { region } } = getConfig();
  const productFamilyConfigs = checkoutLinkConfigs.data?.filter(
    ({ [NAME_PRODUCT_FAMILY]: mappingProductFamily }) => mappingProductFamily === productFamily,
  );
  if (productFamilyConfigs.length === 0) return undefined;
  const checkoutLinkConfig = productFamilyConfigs.find(
    ({ [NAME_LOCALE]: locale }) => locale === '',
  );
  const checkoutLinkConfigOverride = productFamilyConfigs.find(
    ({ [NAME_LOCALE]: locale }) => locale === region,
  ) ?? {};
  const overrides = Object.fromEntries(
    Object.entries(checkoutLinkConfigOverride).filter(([, value]) => value),
  );
  const finalConfig = { ...checkoutLinkConfig, ...overrides };
  Object.entries(finalConfig).forEach(([key, value]) => {
    if (value === 'X' || value === '❌') {
      finalConfig[key] = '';
    }
  });
  return finalConfig;
}

export async function getDownloadAction(options, imsSignedInPromise, offerFamily) {
  if (options.entitlement !== true) return undefined;
  const loggedIn = await imsSignedInPromise;
  if (!loggedIn) return undefined;
  const entitlements = await fetchEntitlements();
  if (!entitlements?.length) return undefined;
  const checkoutLinkConfig = await getCheckoutLinkConfig(offerFamily);
  if (!checkoutLinkConfig?.DOWNLOAD_URL) return undefined;
  const offer = entitlements.find((
    { offer: { product_arrangement: { family: subscriptionFamily } } },
  ) => {
    if (CC_ALL_APPS.includes(subscriptionFamily)) return true; // has all apps
    if (CC_ALL_APPS.includes(offerFamily)) return false; // hasn't all apps and cta is all apps
    const singleAppFamily = CC_SINGLE_APPS // has single and and cta is single app
      .find((singleAppFamilies) => singleAppFamilies.includes(offerFamily));
    return singleAppFamily?.includes(subscriptionFamily);
  });
  if (!offer) return undefined;
  const config = getConfig();
  const text = await replaceKey(checkoutLinkConfig.DOWNLOAD_TEXT
      || PLACEHOLDER_KEY_DOWNLOAD, config);
  const url = localizeLink(checkoutLinkConfig.DOWNLOAD_URL);
  return { text, url };
}

export async function getUpgradeAction(options, imsSignedInPromise, productFamily) {
  if (options.entitlement === false) return undefined;
  const loggedIn = await imsSignedInPromise;
  if (!loggedIn) return undefined;
  const entitlements = await fetchEntitlements();
  if (upgradeOffer === null) {
    upgradeOffer = undefined;
    // will enter only once
    upgradeOffer = await document.querySelector('.merch-offers.upgrade [data-wcs-osi]');
  }
  await upgradeOffer?.onceSettled();
  if (upgradeOffer && entitlements?.length && productFamily) {
    const { default: handleUpgradeOffer } = await import('./upgrade.js');
    const upgradeAction = await handleUpgradeOffer(
      productFamily,
      upgradeOffer,
      entitlements,
      CC_SINGLE_APPS_ALL,
      CC_ALL_APPS,
    );
    return upgradeAction;
  }
  return undefined;
}

async function openFragmentModal(path, getModal) {
  const root = createTag('div');
  root.style.visibility = 'hidden';
  createTag('a', { href: `${path}` }, '', { parent: root });
  const modal = await getModal(null, {
    id: 'checkout-link-modal',
    content: root,
    closeEvent: 'closeModal',
    class: 'commerce-frame',
  });
  await loadArea(modal);
  root.style.visibility = '';
  return modal;
}

async function openExternalModal(url, getModal) {
  await loadStyle(`${getConfig().base}/blocks/iframe/iframe.css`);
  const root = createTag('div', { class: 'milo-iframe' });
  createTag('iframe', {
    src: url,
    frameborder: '0',
    marginwidth: '0',
    marginheight: '0',
    allowfullscreen: 'true',
    loading: 'lazy',
  }, '', { parent: root });
  return getModal(null, {
    id: 'checkout-link-modal',
    content: root,
    closeEvent: 'closeModal',
    class: 'commerce-frame',
  });
}

export async function openModal(e, url, offerType) {
  e.preventDefault();
  e.stopImmediatePropagation();
  const { getModal } = await import('../modal/modal.js');
  const offerTypeClass = offerType === OFFER_TYPE_TRIAL ? 'twp' : 'crm';
  let modal;
  if (/\/fragments\//.test(url)) {
    const fragmentPath = url.split(/hlx.(page|live)/).pop();
    modal = await openFragmentModal(fragmentPath, getModal);
  } else if (/^https?:/.test(url)) {
    modal = await openExternalModal(url, getModal);
  }
  if (modal) {
    modal.classList.add(offerTypeClass);
  }
}

export async function getModalAction(offers, options, productFamily) {
  if (options.modal !== true) return undefined;
  const checkoutLinkConfig = await getCheckoutLinkConfig(productFamily);
  if (!checkoutLinkConfig) return undefined;
  const [{ offerType }] = offers;
  const columnName = (offerType === OFFER_TYPE_TRIAL) ? FREE_TRIAL_PATH : BUY_NOW_PATH;
  let url = checkoutLinkConfig[columnName];
  if (!url) return undefined;
  url = localizeLink(checkoutLinkConfig[columnName]);
  return { url, handler: (e) => openModal(e, url, offerType) };
}

export async function getCheckoutAction(offers, options, imsSignedInPromise) {
  const [{ productArrangement: { productFamily } = {} }] = offers;
  const [downloadAction, upgradeAction, modalAction] = await Promise.all([
    getDownloadAction(options, imsSignedInPromise, productFamily),
    getUpgradeAction(options, imsSignedInPromise, productFamily),
    getModalAction(offers, options, productFamily),
  ]).catch((e) => {
    log?.error('Failed to resolve checkout action', e);
    return [];
  });
  return downloadAction || upgradeAction || modalAction;
}

/**
 * Activates commerce service and returns a promise resolving to its ready-to-use instance.
 */
export async function initService(force = false) {
  if (force) {
    initService.promise = undefined;
    fetchEntitlements.promise = undefined;
    fetchCheckoutLinkConfigs.promise = undefined;
  }
  initService.promise = initService.promise ?? polyfills().then(async () => {
    const commerceLib = await import('../../deps/commerce.js');
    const { env, commerce = {}, locale } = getConfig();
    commerce.priceLiteralsURL = PRICE_LITERALS_URL;
    const service = await commerceLib.init(() => ({
      env,
      commerce,
      locale,
    }), () => ({ getCheckoutAction, force }));
    service.imsSignedInPromise.then((isSignedIn) => {
      if (isSignedIn) {
        fetchEntitlements();
      }
    });
    return service;
  });
  return initService.promise;
}

export async function getCommerceContext(el, params) {
  const wcsOsi = params.get('osi');
  if (!wcsOsi) return null;
  const perpetual = params.get('perp') === 'true' || undefined;
  const promotionCode = (
    params.get('promo') ?? params.get('promotionCode') ?? el.closest('[data-promotion-code]')?.dataset.promotionCode
  ) || undefined;
  return { promotionCode, perpetual, wcsOsi };
}

/**
 * Checkout parameter can be set Merch link, code config (scripts.js) or be a default from tacocat.
 * To get the default, 'undefinded' should be passed, empty string will trigger an error!
 *
 * clientId - code config -> default (adobe_com)
 * workflow - merch link -> metadata -> default (UCv3)
 * workflowStep - merch link -> default (email)
 * marketSegment - merch link -> default (COM)
 * @param {{params: URLSearchParams, service: {settings: object}}} context
 * @returns checkout context object required to build a checkout url
 */
export async function getCheckoutContext(el, params) {
  const context = await getCommerceContext(el, params);
  if (!context) return null;
  const { settings } = await initService();
  const { checkoutClientId } = settings;
  const checkoutMarketSegment = params.get('marketSegment');
  const checkoutWorkflow = params.get('workflow') ?? settings.checkoutWorkflow;
  const checkoutWorkflowStep = params?.get('workflowStep') ?? settings.checkoutWorkflowStep;
  const entitlement = params?.get('entitlement');
  const modal = params?.get('modal');
  return {
    ...context,
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    checkoutMarketSegment,
    entitlement,
    modal,
  };
}

export async function getPriceContext(el, params) {
  const context = await getCommerceContext(el, params);
  if (!context) return null;
  const displayOldPrice = context.promotionCode ? params.get('old') : undefined;
  const displayPerUnit = params.get('seat');
  const displayRecurrence = params.get('term');
  const displayTax = params.get('tax');
  const forceTaxExclusive = params.get('exclusive');
  let template = PRICE_TEMPLATE_REGULAR;
  // This mapping also supports legacy OST links
  switch (params.get('type')) {
    case PRICE_TEMPLATE_DISCOUNT:
    case 'priceDiscount':
      template = PRICE_TEMPLATE_DISCOUNT;
      break;
    case PRICE_TEMPLATE_OPTICAL:
    case 'priceOptical':
      template = PRICE_TEMPLATE_OPTICAL;
      break;
    case PRICE_TEMPLATE_STRIKETHROUGH:
    case 'priceStrikethrough':
      template = PRICE_TEMPLATE_STRIKETHROUGH;
      break;
    default:
      break;
  }
  return {
    ...context,
    displayOldPrice,
    displayPerUnit,
    displayRecurrence,
    displayTax,
    forceTaxExclusive,
    template,
  };
}

export async function buildCta(el, params) {
  const large = !!el.closest('.marquee');
  const strong = el.firstElementChild?.tagName === 'STRONG' || el.parentElement?.tagName === 'STRONG';
  if (el.closest('.merch-offers.upgrade')) {
    params.append('entitlement', 'false');
  }
  const context = await getCheckoutContext(el, params);
  if (!context) return null;
  const service = await initService();
  const text = el.textContent?.replace(/^CTA +/, '');
  const cta = service.createCheckoutLink(context, text);
  if (el.href.includes('#_tcl')) {
    el.href = el.href.replace('#_tcl', '');
  } else {
    cta.classList.add('con-button');
    cta.classList.toggle('button-l', large);
    cta.classList.toggle('blue', strong);
  }
  if (context.entitlement !== 'false') {
    cta.classList.add(LOADING_ENTITLEMENTS);
    cta.onceSettled().finally(() => cta.classList.remove(LOADING_ENTITLEMENTS));
  }
  return cta;
}

async function buildPrice(el, params) {
  const context = await getPriceContext(el, params);
  if (!context) return null;
  const service = await initService();
  const price = service.createInlinePrice(context);
  return price;
}

export default async function init(el) {
  if (!el?.classList?.contains('merch')) return undefined;
  const { searchParams } = new URL(el.href);
  const isCta = searchParams.get('type') === 'checkoutUrl';
  const merch = await (isCta ? buildCta : buildPrice)(el, searchParams);
  const service = await initService();
  log = service.Log.module('merch');
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}
