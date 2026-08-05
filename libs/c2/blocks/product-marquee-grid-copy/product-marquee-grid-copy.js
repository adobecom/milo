import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

const BLOCK_ELS = 'p, h1, h2, h3, h4, h5, h6';

function parseColumn(col) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.src);

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const iconParent = iconEl?.closest(BLOCK_ELS);
  const allEls = [...col.querySelectorAll(BLOCK_ELS)].filter(
    (el) => el !== iconParent && el !== heading && el.textContent.trim(),
  );

  // First element = left-side body copy; everything after = right-side merch card
  const [bodyEl, ...merch] = allEls;
  if (bodyEl) bodyEl.classList.add('heading-5');

  const ctaEls = merch.filter((el) => el.querySelector('em a, strong a'));
  const contentEls = merch.filter((el) => !el.querySelector('em a, strong a'));

  return {
    iconEl, heading, bodyEl, contentEls, ctaEls,
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

function buildMerchCard(contentEls, ctaEls) {
  const cardContent = createTag('div', { class: 'pm-merch-content' });
  contentEls.forEach((el, i) => {
    if (el.querySelector('a[href*="osi="], [is="inline-price"], [data-wcs-osi]')) {
      el.classList.add('pm-price');
      const subEl = contentEls[i + 1];
      if (subEl) {
        subEl.classList.add('pm-price-sub');
        const priceGroup = createTag('div', { class: 'pm-price-group' }, [el, subEl]);
        cardContent.append(priceGroup);
      } else {
        cardContent.append(el);
      }
    } else if (!el.classList.contains('pm-price-sub')) {
      cardContent.append(el);
    }
  });

  const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
  ctaEls.forEach((el) => ctaWrapper.append(el));
  decorateButtons(ctaWrapper);

  return createTag('div', { class: 'pm-merch-card' }, [cardContent, ctaWrapper]);
}

function decorate(block) {
  const isMerchOffer = block.classList.contains('merch-offer');
  const col = block.children[0]?.children[0];
  if (!col) return;

  const {
    iconEl, heading, bodyEl, contentEls, ctaEls,
  } = parseColumn(col);

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading));
  if (bodyEl) foreground.append(bodyEl);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  if (isMerchOffer && (contentEls.length || ctaEls.length)) {
    promoArea.append(buildMerchCard(contentEls, ctaEls));
  }

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
