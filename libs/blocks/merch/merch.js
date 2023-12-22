import { getConfig, loadScript, loadIms, createTag } from '../../utils/utils.js';
import getUserEntitlements from '../global-navigation/utilities/getUserEntitlements.js';

export const priceLiteralsURL = 'https://milo.adobe.com/libs/commerce/price-literals.json';

export const PRICE_TEMPLATE_DISCOUNT = 'discount';
export const PRICE_TEMPLATE_OPTICAL = 'optical';
export const PRICE_TEMPLATE_REGULAR = 'price';
export const PRICE_TEMPLATE_STRIKETHROUGH = 'strikethrough';

export function polyfills() {
  /* c8 ignore start */
  if (!polyfills.promise) {
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
      const { codeRoot, miloLibs } = getConfig();
      const base = miloLibs || codeRoot;
      polyfills.promise = loadScript(`${base}/deps/custom-elements.js`);
    }
  }
  return polyfills.promise;
  /* c8 ignore stop */
}

/**
 * Activates commerce service and returns a promise resolving to its ready-to-use instance.
 */
export async function initService() {
  await polyfills();
  const commerce = await import('../../deps/commerce.js');
  return commerce.init(() => ({
    ...getConfig(),
    commerce: { priceLiteralsURL },
  }));
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
  return {
    ...context,
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    checkoutMarketSegment,
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

const upgradeCta = (cta) => createTag(
  'a',
  {
    href: '#upgrade',
    'data-modal-path': '/drafts/mariia/fragments/cardfragment',
    'data-modal-hash': '#upgrade',
    class: 'modal link-block ',
  },
  cta?.textContent,
);

const getProductFamilyFromPA = (productArrangementCode) => {
  if (!productArrangementCode) return null;
  if (productArrangementCode === 'ccsn_direct_individual') {
    return 'allapps';
  }
  if (productArrangementCode === 'DRAFTS') {
    return 'photoshop';
  }
  return null;
};

const getProductFamily = async (placeholder) => {
  const { value } = await placeholder.onceSettled();
  if (!value || value.length === 0) return null;
  const { productArrangementCode } = value[0];
  return getProductFamilyFromPA(productArrangementCode);
};

const isUserEligibleForUpgrade = async () => {
  // const alreadyPurchased = !!productFamily.find(family => entitlements.offer_families[family.toLowerCase()]);
  const entitlements = await getUserEntitlements();
  // enti?.offer_families
  const productFamily = '';
  if (productFamily === 'photoshop') {
    return true;
  }
  return false;
};

const handleUpgradeOffer = async (cta) => {
  const upgradeOffer = document.querySelector('.merch-offers.upgrade [data-wcs-osi]');
  if (!upgradeOffer) return;

  await loadIms();
  const isSignedInUser = window.adobeIMS.isSignedInUser();
  if (!isSignedInUser) return;
  const productFamily = await getProductFamily(cta);
  // todo allapps should be configurable
  if (productFamily === 'allapps') {
    const canUpgrade = await isUserEligibleForUpgrade();
  }
};

export async function buildCta(el, params) {
  const large = !!el.closest('.marquee');
  const strong = el.firstElementChild?.tagName === 'STRONG' || el.parentElement?.tagName === 'STRONG';
  const context = await getCheckoutContext(el, params);
  if (!context) return null;
  const service = await initService();
  const text = el.textContent?.replace(/^CTA +/, '');
  const cta = service.createCheckoutLink(context, text);
  cta.classList.add('con-button');
  cta.classList.toggle('button-l', large);
  cta.classList.toggle('blue', strong);
  handleUpgradeOffer(cta);
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
  const log = service.Log.module('merch');
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}
