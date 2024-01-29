import { getConfig, loadScript, localizeLink } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

export const priceLiteralsURL = 'https://milo.adobe.com/libs/commerce/price-literals.json';
export const entitlementsURL = 'https://milo.adobe.com/libs/commerce/entitlements.json?limit=2000';

export const PRICE_TEMPLATE_DISCOUNT = 'discount';
export const PRICE_TEMPLATE_OPTICAL = 'optical';
export const PRICE_TEMPLATE_REGULAR = 'price';
export const PRICE_TEMPLATE_STRIKETHROUGH = 'strikethrough';

const TITLE_PRODUCT_ARRANGEMENT_CODE = 'Product Arrangement Code';
const LOADING_ENTITLEMENTS = 'loading-entitlements';

export function polyfills() {
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
    const { codeRoot, miloLibs } = getConfig();
    const base = miloLibs || codeRoot;
    polyfills.promise = loadScript(`${base}/deps/custom-elements.js`);
  }
  return polyfills.promise;
}

export async function loadEntitlements() {
  loadEntitlements.promise = loadEntitlements.promise ?? Promise.all([
    import('../global-navigation/utilities/getUserEntitlements.js'),
    fetch(entitlementsURL),
  ]).then(([{ default: getUserEntitlements }, mappings]) => {
    if (!mappings.ok) return [];
    return Promise.all([getUserEntitlements(), mappings.json()]);
  });
  return loadEntitlements.promise;
}

async function getCheckoutAction(offers) {
  const [{ arrangement_codes: aCodes } = {}, entitlementsMappings] = await loadEntitlements();
  if (aCodes === undefined) return undefined;
  const [{ productArrangementCode }] = offers;
  if (aCodes[productArrangementCode] === true) {
    const mapping = entitlementsMappings.data
      ?.find(({ [TITLE_PRODUCT_ARRANGEMENT_CODE]: code }) => code === productArrangementCode);
    if (!mapping) return undefined;
    const config = getConfig();
    const { locale: { ietf } } = config;
    const text = await replaceKey(mapping.CTA, config);
    const url = mapping[ietf] || localizeLink(mapping.Target);
    return { text, url };
  }
  return undefined;
}

/**
 * Activates commerce service and returns a promise resolving to its ready-to-use instance.
 */
export async function initService(force = false) {
  if (force) {
    initService.promise = undefined;
    loadEntitlements.promise = undefined;
  }
  initService.promise = initService.promise ?? polyfills().then(async () => {
    // loadIms();
    const commerceLib = await import('../../deps/commerce.js');
    const { env, commerce = {}, locale } = getConfig();
    commerce.priceLiteralsURL = priceLiteralsURL;
    const service = await commerceLib.init(() => ({
      env,
      commerce,
      locale,
    }), () => ({ getCheckoutAction, force }));
    service.imsSignedInPromise.then((isSignedIn) => {
      if (isSignedIn) {
        loadEntitlements();
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
  const entitlement = 'false' ?? params?.get('entitlement'); // temporarly disabled.
  return {
    ...context,
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    checkoutMarketSegment,
    entitlement,
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
  const context = await getCheckoutContext(el, params);
  if (!context) return null;
  const service = await initService();
  const text = el.textContent?.replace(/^CTA +/, '');
  const cta = service.createCheckoutLink(context, text);
  cta.classList.add('con-button');
  cta.classList.toggle('button-l', large);
  cta.classList.toggle('blue', strong);
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
  const log = service.Log.module('merch');
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}
