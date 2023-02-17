import { loadScript, getConfig, createTag } from '../utils/utils.js';

const { miloLibs, codeRoot, env } = getConfig();
const base = miloLibs || codeRoot;

export function decorateButton(osi, a, text) {
  if (!osi || !a) return;
  a.href = '#';
  a.dataset.checkoutClientid = 'mini_plans';
  a.dataset.checkoutWorkflow = 'UCv3';
  a.dataset.checkoutWorkflowStep = 'email';
  a.dataset.wcsOsi = osi;
  a.dataset.template = 'checkoutUrl';
  a.textContent = text;
}

function buildPrice(osi, type) {
  return createTag('span', { 'data-wcs-osi': osi, 'data-template': type, class: type });
}

function getPriceType(name) {
  switch (name) {
    case 'price': { return 'price'; }
    case 'optical': { return 'priceOptical'; }
    case 'strikethrough': { return 'priceStrikethrough'; }
    case 'with-tax': { return 'priceWithTax'; }
    case 'with-strikethrough-tax': { return 'priceWithTaxStrikethrough'; }
    default: return 'price';
  }
}

export async function runTacocat() {
  if (!window.tacocat) {
    await loadScript(`${base}/deps/tacocat-index.js`);
  }

  const wcs = { apiKey: 'wcms-commerce-ims-ro-user-cc' };
  window.tacocat({ environment: env.name, wcs });
}

export function getPrice(osi, type) {
  if (!osi) return null;
  const priceType = getPriceType(type);
  const price = buildPrice(osi, priceType);
  return price;
}

export async function decorateCommerce(links) {
  links.forEach((link) => {
    const url = new URL(link.href);
    const osi = url.searchParams.get('osi');
    if (!osi) return;
    const type = url.searchParams.get('type');
    if (type === 'checkoutUrl') {
      const text = url.searchParams.get('text');
      decorateButton(osi, link, text);
    } else {
      const priceType = url.searchParams.get('priceType');
      const price = getPrice(osi, priceType);
      if (!price) return;
      link.parentElement.insertBefore(price, link);
      link.remove();
    }
  });
  await runTacocat();
}
