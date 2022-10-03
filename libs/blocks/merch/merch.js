import { loadScript, getConfig, createTag } from '../../utils/utils.js';

const { miloLibs, codeRoot, env } = getConfig();
const base = miloLibs || codeRoot;

function buildButton(a, osi) {
  if (!a) return null;
  a.href = '#';
  a.className = 'con-button blue button-M';
  a.dataset.checkoutClientid = 'mini_plans';
  a.dataset.checkoutWorkflow = 'UCv3';
  a.dataset.checkoutWorkflowStep = 'email';
  a.dataset.wcsOsi = osi;
  a.dataset.template = 'checkoutUrl';
  return a;
}

function buildPrice(osi, type) {
  return createTag('span', { 'data-wcs-osi': osi, 'data-template': type });
}

function getPriceType(name) {
  switch (name) {
    case 'price': { return 'price'; }
    case 'optical': { return 'priceOptical'; }
    case 'strikethrough': { return 'priceStrikethrough'; }
    case 'with-tax': { return 'priceWithTax'; }
    case 'with-strikethrough-tax': { return 'priceWithTaxStrikethrough'; }
    default: return null;
  }
}

export default async function init(el) {
  if (!window.tacocat) {
    await loadScript(`${base}/deps/tacocat-index.js`);
  }
  const osi = el.querySelector(':scope > div:first-of-type > div').textContent;
  if (!osi) return;
  const priceType = getPriceType([...el.classList][1]);
  if (priceType) {
    const price = buildPrice(osi, priceType);
    el.append(price);
  }
  const button = buildButton(el.querySelector('a'), osi);
  if (button) {
    el.append(button);
  }

  // Show *something* if there's just an OSI and nothing else.
  if (!priceType && !button) {
    const price = buildPrice(osi, 'price');
    el.append(price);
  }

  const wcs = { apiKey: 'wcms-commerce-ims-ro-user-cc' };
  window.tacocat({ environment: env.name, wcs });
}
