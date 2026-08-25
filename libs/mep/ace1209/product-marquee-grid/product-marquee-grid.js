import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

const MAS_FIELD_CLASSES = {
  description: ['mas-description'],
  prices: ['mas-price', 'heading-5'],
};

function hasVisibleContent(el) {
  return el.textContent.trim() || el.querySelector('mas-field, [is="inline-price"]');
}

function decorateMasField(el) {
  const masField = el.querySelector('mas-field[field]');
  if (!masField) return;
  const classes = MAS_FIELD_CLASSES[masField.getAttribute('field')];
  if (classes) el.classList.add(...classes);
}

function parseLeftColumn(col) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.getAttribute('src'));

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const allTextEls = [...col.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((el) => el !== heading && hasVisibleContent(el));

  return { iconEl, heading, bodyEls: allTextEls };
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

function buildMerchCard(col) {
  decorateButtons(col);

  const buttons = [...col.querySelectorAll('.con-button, a[data-wcs-osi]')];
  buttons.forEach((btn) => btn.remove());

  const allParas = [...col.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter(hasVisibleContent);

  const cardContent = createTag('div', { class: 'pm-merch-content' });
  allParas.forEach((el) => {
    decorateMasField(el);
    cardContent.append(el);
  });

  const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
  buttons.forEach((btn) => ctaWrapper.append(btn));

  const merchCard = createTag('div', { class: 'pm-merch-card' });
  merchCard.append(cardContent);
  if (ctaWrapper.children.length) merchCard.append(ctaWrapper);
  return merchCard;
}

function decorate(block) {
  const row = block.children[0];
  const col = row?.children[0];
  if (!col) return;

  const { iconEl, heading, bodyEls } = parseLeftColumn(col);
  bodyEls.forEach((el) => el.classList.add('pm-subtext'));

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading), ...bodyEls);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  const col2 = row?.children[1];
  if (col2?.children.length) promoArea.append(buildMerchCard(col2));

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
