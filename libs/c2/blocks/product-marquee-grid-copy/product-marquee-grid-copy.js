import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

function parseColumn(col) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.src);

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const iconParent = iconEl?.closest('p');
  const allParas = [...col.querySelectorAll('p')].filter(
    (el) => el !== iconParent && el.textContent.trim(),
  );

  // First para = left-side body copy; everything after = right-side merch card
  const [bodyEl, ...merch] = allParas;
  if (bodyEl) bodyEl.classList.add('heading-5');

  const ctaParas = merch.filter((p) => p.querySelector('em a, strong a'));
  const contentParas = merch.filter((p) => !p.querySelector('em a, strong a'));

  return {
    iconEl, heading, bodyEl, contentParas, ctaParas,
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

function buildMerchCard(contentParas, ctaParas) {
  const cardContent = createTag('div', { class: 'pm-merch-content' });
  contentParas.forEach((para, i) => {
    if (para.querySelector('a[href*="osi="], [is="inline-price"], [data-wcs-osi]')) {
      para.classList.add('pm-price');
      contentParas[i + 1]?.classList.add('pm-price-sub');
    }
    cardContent.append(para);
  });

  const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
  ctaParas.forEach((p) => ctaWrapper.append(p));
  decorateButtons(ctaWrapper);

  return createTag('div', { class: 'pm-merch-card' }, [cardContent, ctaWrapper]);
}

function decorate(block) {
  const col = block.children[0]?.children[0];
  if (!col) return;

  const {
    iconEl, heading, bodyEl, contentParas, ctaParas,
  } = parseColumn(col);

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading));
  if (bodyEl) foreground.append(bodyEl);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  if (contentParas.length || ctaParas.length) {
    promoArea.append(buildMerchCard(contentParas, ctaParas));
  }

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
