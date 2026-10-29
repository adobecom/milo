import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateButtons, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';

const MAS_BODY_FIELDS = 'mas-field:is([field="description"], [field="shortDescription"])';

const hasContent = (cell) => !!cell && (cell.children.length > 0 || !!cell.textContent.trim());

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
      || el.querySelector('mas-field, .con-button'));
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
  const ctaSelector = '.con-button, mas-field[field^="ctas"]';
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

function decorateCopy(copy) {
  const heading = copy.querySelector('h1, h2, h3, h4, h5, h6');
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.matches('p')) {
    eyebrow.querySelectorAll('img[src*=".svg"]').forEach((img) => {
      img.src = getFederatedUrl(img.getAttribute('src'));
    });
    eyebrow.classList.add('eyebrow');
    eyebrow.before(heading);
  }
  decorateBlockText(copy, { heading: '2', body: 'md', button: 'md' });
  const [, ...otherHeadings] = copy.querySelectorAll('h1, h2, h3, h4, h5, h6');
  otherHeadings.forEach((other) => other.classList.remove('heading-2'));
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('sh-text');
}

function decorateBackground(block, bg) {
  if (!hasContent(bg)) return null;
  decorateBlockBg(block, bg, { className: 'sh-background' });
  if (!block.style.background) return bg;
  const colorBg = createTag('div', { class: 'sh-background', style: `background: ${block.style.background}` });
  block.style.removeProperty('background');
  return colorBg;
}

function decorate(block) {
  const [mainRow, offerRow] = block.children;
  const [copy, media, bg] = mainRow?.children || [];
  const [merch, supporting] = offerRow?.children || [];
  if (!copy) return;

  decorateCopy(copy);
  const copyGroup = createTag('div', { class: 'sh-copy' }, copy);
  const foreground = createTag('div', { class: 'sh-foreground' }, copyGroup);
  if (hasContent(merch)) {
    copyGroup.append(createTag('div', { class: 'sh-promo-area' }, buildMerchCard(merch)));
  }
  if (hasContent(supporting)) {
    supporting.classList.add('sh-supporting', 'caption');
    foreground.append(supporting);
  }

  const content = createTag('div', { class: 'sh-content container' }, foreground);
  if (hasContent(media)) {
    const frame = createTag('div', { class: 'sh-media-frame' });
    frame.append(...media.childNodes);
    media.append(frame);
    media.classList.add('sh-media');
    content.append(media);
  }
  const background = decorateBackground(block, bg);
  block.replaceChildren(...[background, content].filter(Boolean));
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
