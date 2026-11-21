import { createTag } from '../../../utils/utils.js';
import { decorateButtons, normalizeMasFieldText } from '../../../utils/decorate.js';

const MAS_BODY_FIELDS = 'mas-field:is([field="description"], [field="shortDescription"])';

const MAS_FIELD_CLASSES = {
  description: ['mas-description'],
  prices: ['mas-price', 'heading-5'],
  shortDescription: ['mas-short-description'],
  subtitle: ['mas-subtitle'],
  badge: ['mas-badge'],
  cardTitle: ['mas-card-title', 'heading-5'],
};

function decorateMasField(cardContent) {
  cardContent.querySelectorAll('mas-field[field]').forEach((masField) => {
    const classes = MAS_FIELD_CLASSES[masField.getAttribute('field')];
    if (classes) masField.classList.add(...classes);
  });
  const priceParent = cardContent.querySelector('.mas-price')?.parentElement;
  const commitmentEl = priceParent?.nextElementSibling;
  if (!commitmentEl?.matches('p') || commitmentEl.children.length || !commitmentEl.textContent.trim()) return;
  priceParent.append(commitmentEl);
  commitmentEl.classList.add('mas-price-commitment');
}

export default function buildMerchWidget(col) {
  [...col.children]
    .filter((el) => !el.matches(MAS_BODY_FIELDS) && !el.querySelector(MAS_BODY_FIELDS))
    .forEach((el) => decorateButtons(el));
  col.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(col, 'md', MAS_BODY_FIELDS);

  const content = createTag('div', { class: 'merch-widget-content' });
  [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field, div)')]
    .filter((el) => el.textContent.trim() || el.matches('mas-field')
      || el.querySelector('mas-field, [is="inline-price"], .con-button, a[data-wcs-osi]'))
    .forEach((el) => content.append(el.closest('mas-field') || el));
  decorateMasField(content);

  const ctaSelector = '.con-button, a[data-wcs-osi], mas-field[field^="ctas"]';
  const ctaParas = [...content.children].filter((el) => {
    const cta = el.matches(ctaSelector) ? el : el.querySelector(ctaSelector);
    return !!cta && !cta.closest(MAS_BODY_FIELDS);
  });
  if (ctaParas.length) {
    const ctas = createTag('div', { class: 'merch-widget-ctas' });
    ctaParas[0].replaceWith(ctas);
    ctaParas.forEach((para) => ctas.append(para));
  }
  return createTag('div', { class: 'merch-widget-c2' }, content);
}
