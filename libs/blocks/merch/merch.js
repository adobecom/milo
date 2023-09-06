import { getConfig, getMetadata, loadScript } from '../../utils/utils.js';

export const CTA_PREFIX = /^CTA +/;

export async function initService() {
  const commerce = await import('../../deps/commerce.js');
  return commerce.init(getConfig);
}

export async function getCommerceContext(el, params) {
  const wcsOsi = params.get('osi');
  if (!wcsOsi) return null;
  const perpetual = params.get('perp') === 'true' || undefined;
  const promotionCode = (
    params.get('promo') ?? el.closest('[data-promotion-code]')?.dataset.promotionCode
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
  const checkoutWorkflow = params.get('workflow')
    ?? getMetadata('checkout-workflow')
    ?? settings.checkoutWorkflow;
  const checkoutWorkflowStep = params
    ?.get('workflowStep')
    ?.replace('_', '/')
    ?? settings.checkoutWorkflowStep;
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
  const type = params.get('type');
  const template = type === 'price' ? undefined : type;
  return {
    ...context,
    displayOldPrice,
    displayPerUnit,
    displayRecurrence,
    displayTax,
    template,
  };
}

export async function buildCta(el, params) {
  const context = await getCheckoutContext(el, params);
  if (!context) return null;
  const service = await initService();
  const cta = service.createCheckoutLink(
    context,
    el.textContent?.replace(CTA_PREFIX, ''),
  );
  cta.classList.add('con-button');
  if (el.closest('.marquee')) {
    cta.classList.add('button-l');
  }
  if (el.firstElementChild?.tagName === 'STRONG' || el.parentElement?.tagName === 'STRONG') {
    cta.classList.add('blue');
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

export async function polyfill() {
  if (polyfill.done) return;
  polyfill.done = true;
  let isSupported = false;
  document.createElement('div', {
    // eslint-disable-next-line getter-return
    get is() {
      isSupported = true;
    },
  });
  /* c8 ignore start */
  if (!isSupported) {
    const { codeRoot, miloLibs } = getConfig();
    const base = miloLibs || codeRoot;
    await loadScript(`${base}/deps/custom-elements.js`);
  }
  /* c8 ignore stop */
}

export default async function init(el) {
  if (!el?.classList?.contains('merch')) return undefined;
  await polyfill();
  const { searchParams: params } = new URL(el.href);
  const service = await initService();
  const log = service.log.module('merch');
  const build = params.get('type') === 'checkoutUrl' ? buildCta : buildPrice;
  const merch = await build(el, params);
  if (merch) {
    log.debug('Rendering:', { options: { ...merch.dataset }, merch, el });
    el.replaceWith(merch);
    return merch;
  }
  log.warn('Failed to get context:', { el });
  return null;
}
