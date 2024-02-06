import { createTag } from '../../utils/utils.js';

const CTA_STYLES = {
  'STRONG': 'blue',
  'EM': 'outline',
}
function getCtaStyle(tagName) {
  return CTA_STYLES[tagName] || '';
}
function parseCtas(el) {
  const ctas = {};
  let index = 1;
  let a = el.querySelectorAll('a');
  let ctaLinks = a.length ?  a : [{}, {}];

  for (const ctaLink of ctaLinks) { // change to forEach
    ctas[`cta${index}url`] = ctaLink.href || '';
    ctas[`cta${index}text`] = ctaLink.textContent?.trim() || '';
    ctas[`cta${index}style`] = getCtaStyle(ctaLink.parentNode?.tagName);
    ctas[`cta${index}target`] = ctaLink.target || '';
    index++;
  }
  return ctas;
}
export const getMetadata = (el) => {
  let metadata = {};
  for (const row of el.children) {
    const key = row.children[0].textContent.trim().toLowerCase() || '';
    let val = row.children[1].innerHTML || '';
    if (key.includes('image')) {
      const img = row.children[1].querySelector('img');
      val = img ? new URL(img.src).pathname : '';
    }
    if (key.includes('cta')) {
      metadata = { ...metadata, ...parseCtas(row.children[1]) };
    }
    if (key.includes('variant')) {
      val = val.replace(/,/g, '');
    }
    metadata[key] = val;
  }
  return metadata;
};
export default function init(el) {
  let metadata = getMetadata(el);
  const additionalFields = {
    arbitrary: `
      promoId: ${metadata.promoid},
      context: ${metadata.context},
      imageTablet: ${metadata.imagetablet},
      imageDesktop: ${metadata.imagedesktop},
      variant: ${metadata.variant}`.trim(),
    tags: 'caas:content-type/promotion',
    cta1url: `${metadata.cta1url}`,
    cta1text: `${metadata.cta1text}`,
    cta1style: `${metadata.cta1style}`,
    cta2url: `${metadata.cta2url}`,
    cta2text: `${metadata.cta2text}`,
    cta2style: `${metadata.cta2style}`
  }

  for (const [key, val] of Object.entries(additionalFields)) {
    const container = createTag('div');
    container.innerHTML = `
    <div data-valign="middle">${key}</div>
    <div data-valign="middle">${val}</div>
  `;
    el.appendChild(container);
  }
}
