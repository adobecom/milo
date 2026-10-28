import { decorateBlockText, decorateButtons, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

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

function buildMerchCard(col) {
  [...col.children]
    .filter((el) => !el.matches(MAS_BODY_FIELDS) && !el.querySelector(MAS_BODY_FIELDS))
    .forEach((el) => decorateButtons(el));
  col.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(col, 'md', MAS_BODY_FIELDS);

  let allParas = [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field, div)')]
    .filter((el) => el.textContent.trim() || el.matches('mas-field')
      || el.querySelector('mas-field, [is="inline-price"], .con-button, a[data-wcs-osi]'));
  if (!allParas.length && col.textContent.trim()) {
    const para = createTag('p');
    para.append(...col.childNodes);
    allParas = [para];
  }

  const cardContent = createTag('div', { class: 'sh-merch-content' });
  // Keep the mas-field wrapper: its tooltip CSS is scoped to `mas-field .icon-button`.
  allParas.forEach((el) => cardContent.append(el.closest('mas-field') || el));
  decorateMasField(cardContent);

  const merchCard = createTag('div', { class: 'sh-merch-card' });
  merchCard.append(cardContent);
  const ctaSelector = '.con-button, a[data-wcs-osi], mas-field[field^="ctas"]';
  const isCtaPara = (el) => {
    const cta = el.matches(ctaSelector) ? el : el.querySelector(ctaSelector);
    return !!cta && !cta.closest(MAS_BODY_FIELDS);
  };
  const ctaParas = [...cardContent.children].filter(isCtaPara);
  if (ctaParas.length) {
    const ctaWrapper = createTag('div', { class: 'sh-merch-ctas' });
    ctaParas[0].replaceWith(ctaWrapper);
    ctaParas.forEach((para) => ctaWrapper.append(para));
  }

  return merchCard;
}

function decorate(block, root) {
  const row = block.firstElementChild;
  const [copy, merch, media] = row?.children || [];
  if (!copy) return;

  decorateBlockText(copy, { heading: '2', body: 'md', button: 'md' });
  const [heading, ...otherHeadings] = copy.querySelectorAll('h1, h2, h3, h4, h5, h6');
  otherHeadings.forEach((other) => other.classList.remove('heading-2'));
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.matches('p')) eyebrow.classList.add('sh-product-lockup', 'eyebrow');
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('sh-text');

  const supporting = row.nextElementSibling?.firstElementChild;
  const copyGroup = createTag('div', { class: 'sh-copy' }, copy);
  const foreground = createTag('div', { class: 'sh-foreground' }, copyGroup);
  if (merch?.children.length) {
    const card = buildMerchCard(merch);
    if (root.classList.contains('special-promo')) {
      card.classList.add(root.classList.contains('dark') ? 'light' : 'dark');
    }
    copyGroup.append(createTag('div', { class: 'sh-promo-area' }, card));
  }
  if (supporting) {
    supporting.classList.add('sh-supporting', 'caption');
    foreground.append(supporting);
  }

  const content = createTag('div', { class: 'sh-content container' }, foreground);
  if (media) {
    const frame = createTag('div', { class: 'sh-media-frame' });
    frame.append(...media.childNodes);
    media.append(frame);
    media.classList.add('sh-media');
    content.append(media);
  }
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
