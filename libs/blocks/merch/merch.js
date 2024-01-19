import { getConfig, loadScript } from '../../utils/utils.js';

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

export function addFromOfferId({ entitlements, queryString, upgradeableProductFamilies }) {
  if (!entitlements?.offers || !queryString || !upgradeableProductFamilies) return queryString;
  const { offers } = entitlements;
  const firstSingleAppOfferId = Object.keys(offers).find((offerId) => upgradeableProductFamilies
    .includes(offers[offerId].product_arrangement?.family));
  if (!firstSingleAppOfferId) return queryString;
  if (queryString.includes('fromOffer=')) {
    const fromOfferRegexp = /fromOffer=([^&]+)/; // matches this part of the string: fromOffer=123456789
    return queryString.replace(fromOfferRegexp, `fromOffer=${firstSingleAppOfferId}`);
  }
  return `${queryString}&fromOffer=${firstSingleAppOfferId}`;
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
  const currentPageUrl = new URL(window.location.href);
  // If URL includes wcmmode=disabled param, the PayPal modal will not open, so we need to remove it
  currentPageUrl.searchParams.delete('wcmmode');
  const properCtxRtUrl = `ctxRtUrl=${encodeURIComponent(currentPageUrl.toString())}`;
  if (queryString.includes('ctxRtUrl=')) {
    const ctxUrlRegexp = /ctxRtUrl=([^&]+)/; // matches this part of the string: ctxRtUrl=https%3A%2F%2Faccount.stage.adobe.com
    return queryString.replace(ctxUrlRegexp, properCtxRtUrl);
  }
  return `${queryString}${properCtxRtUrl}`;
}

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
  const upgradeOffer = document.querySelector('.merch-offers.upgrade [data-wcs-osi]');
  if (upgradeOffer) {
    const { default: handleUpgradeOffer } = await import('./upgrade.js');
    handleUpgradeOffer(cta, upgradeOffer);
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
  const log = service.Log.module('merch');
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}
