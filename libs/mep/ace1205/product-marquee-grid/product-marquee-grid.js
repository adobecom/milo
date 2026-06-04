import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M6.58349 11.208L10.2837 7.50781C10.606 7.18554 10.606 6.66406 10.2837 6.34179C9.96142 6.01953 9.43994 6.01953 9.11767 6.34179L6.82568 8.63281V1.375C6.82568 0.918955 6.45654 0.549805 6.00048 0.549805C5.54442 0.549805 5.17528 0.918945 5.17528 1.375V8.63281L2.88329 6.34179C2.56102 6.01953 2.03954 6.01953 1.71727 6.34179C1.55614 6.50292 1.47508 6.71386 1.47508 6.9248C1.47508 7.13574 1.55613 7.34668 1.71727 7.50781L5.41747 11.208C5.73974 11.5303 6.26122 11.5303 6.58349 11.208Z" fill="#fff"/></svg>';

function parseColumn(col, isSoftOffer) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.src);

  const ctaLinkPara = col.querySelector('p:has(em a), p:has(strong a)');
  const ctaLink = ctaLinkPara?.querySelector('em a, strong a');
  ctaLinkPara?.remove();

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const allParas = [...col.querySelectorAll('p')].filter((el) => el.textContent.trim());
  const labelEl = isSoftOffer && allParas.length >= 2 ? allParas.at(-1) : null;
  const bodyEls = labelEl ? allParas.slice(0, -1) : allParas;
  bodyEls.forEach((el) => el.classList.add('heading-5'));

  return {
    iconEl, ctaLink, ctaLinkPara, heading, labelEl, bodyEls,
  };
}

function buildChicletRow(iconEl, heading) {
  const chicletRow = createTag('div', { class: 'pm-chiclet-row' });
  if (iconEl) {
    iconEl.classList.add('icon');
    chicletRow.append(iconEl);
  }
  if (heading) chicletRow.append(heading);
  return chicletRow;
}

function buildSoftOfferCta(ctaLinkPara, labelEl) {
  const ctaWrapper = createTag('div', { class: 'pm-promo-cta' });
  if (labelEl) {
    labelEl.classList.add('pm-promo-cta-label');
    ctaWrapper.append(labelEl);
  }
  ctaWrapper.append(ctaLinkPara);
  decorateButtons(ctaWrapper);
  return ctaWrapper;
}

// TODO: confirm if the featured-offer variant is used on other pages; remove if not needed.
function buildPromoButton(ctaLink) {
  return createTag('a', { class: 'pm-promo-button', href: ctaLink.getAttribute('href') }, [
    createTag('span', { class: 'pm-promo-text eyebrow' }, ctaLink.textContent.trim()),
    createTag('span', { class: 'pm-promo-chevron', 'aria-hidden': 'true' }, CHEVRON_SVG),
  ]);
}

function decorate(block) {
  const isPromoCta = block.classList.contains('featured-offer');
  const col = block.children[0]?.children[0];
  if (!col) return;

  const {
    iconEl, ctaLink, ctaLinkPara, heading, labelEl, bodyEls,
  } = parseColumn(col, !isPromoCta);

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading), ...bodyEls);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  if (ctaLink) {
    const promoEl = isPromoCta
      ? buildPromoButton(ctaLink)
      : buildSoftOfferCta(ctaLinkPara, labelEl);
    promoArea.append(promoEl);
  }

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
