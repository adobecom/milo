import { createTag } from '../../utils/utils.js';

const MAX_NUM_CTAS = 2;
const CTA_STYLES = {
  STRONG: 'blue',
  EM: 'outline',
};
function getCtaStyle(tagName) {
  return CTA_STYLES[tagName] || '';
}

function getUrl(ctaLink) {
  if (!ctaLink) {
    return '';
  }
  const modalPath = ctaLink.getAttribute('data-modal-path');
  const modalHash = ctaLink.getAttribute('data-modal-hash');
  const target = ctaLink.target ? `#${ctaLink.target}` : '';
  if (modalPath && modalHash) {
    return `${modalPath}${modalHash}`;
  }
  return `${ctaLink.href}${target}`;
}
function parseCtas(el) {
  const ctas = {};
  const ctaLinks = el.querySelectorAll('a') || [];

  for (let i = 1; i <= MAX_NUM_CTAS; i += 1) {
    const ctaLink = ctaLinks[i - 1] || '';
    ctas[`cta${i}url`] = getUrl(ctaLink);
    ctas[`cta${i}text`] = ctaLink.textContent?.trim() || '';
    ctas[`cta${i}style`] = getCtaStyle(ctaLink.parentNode?.tagName);
  }
  return ctas;
}

function getImageOrVideo(el) {
  const img = el?.querySelector('img');
  const video = el?.querySelector('.video');
  let val = img ? new URL(img.src).pathname : '';
  val = video ? new URL(video.href).pathname : val;
  return val;
}

function parseBrick(el) {
  const [headingEl, descriptionEl, ctaEl, imageEl] = el?.querySelectorAll('p') || [];
  const brick = {
    heading: headingEl?.querySelector('strong')?.textContent || '',
    description: descriptionEl?.innerHTML || '',
    ...parseCtas(ctaEl),
    image: getImageOrVideo(imageEl),
  };

  return btoa(JSON.stringify(brick));
}

export const getMetadata = (el) => {
  let metadata = {};
  for (const row of el.children) {
    const key = row.children[0].textContent.trim().toLowerCase() || '';
    let val = row.children[1]?.innerHTML || '';
    if (key.startsWith('image')) {
      val = getImageOrVideo(row.children[1]);
    }
    if (key.includes('cta')) {
      metadata = { ...metadata, ...parseCtas(row.children[1]) };
    }
    if (key.includes('brick')) {
      val = parseBrick(row.children[1]);
    }
    if (key.includes('variant')) {
      val = val.replaceAll(',', '');
    }
    metadata[key] = val;
  }
  return metadata;
};
export default function init(el) {
  const metadata = getMetadata(el);
  const additionalFields = {
    arbitrary: `
      promoId: ${metadata.promoid},
      context: ${metadata.context},
      imageTablet: ${metadata.imagetablet},
      imageDesktop: ${metadata.imagedesktop},
      backgroundColor: ${metadata.backgroundcolor},
      leftBrick: ${metadata.leftbrick},
      rightBrick: ${metadata.rightbrick},
      variant: ${metadata.variant}`.trim(),
    tags: 'caas:content-type/promotion',
    cta1url: `${metadata.cta1url}`,
    cta1text: `${metadata.cta1text}`,
    cta1style: `${metadata.cta1style}`,
    cta2url: `${metadata.cta2url}`,
    cta2text: `${metadata.cta2text}`,
    cta2style: `${metadata.cta2style}`,
  };

  for (const [key, val] of Object.entries(additionalFields)) {
    const container = createTag('div');
    container.innerHTML = `
    <div data-valign="middle">${key}</div>
    <div data-valign="middle">${val}</div>
  `;
    el.appendChild(container);
  }
}
