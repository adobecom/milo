import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons, normalizeMasFieldText } from '../../../utils/decorate.js';

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

function parseLeftColumn(col) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.getAttribute('src'));

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');

  const bodyEls = [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field)')]
    .filter((el) => el !== heading && (el.textContent.trim() || el.matches('mas-field') || el.querySelector('mas-field')));

  return { iconEl, heading, bodyEls };
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
  [...col.children]
    .filter((el) => !el.matches(MAS_BODY_FIELDS) && !el.querySelector(MAS_BODY_FIELDS))
    .forEach((el) => decorateButtons(el));
  col.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(col, 'md', MAS_BODY_FIELDS);

  const buttons = [...col.querySelectorAll('.con-button, a[data-wcs-osi]')]
    .filter((btn) => !btn.closest(MAS_BODY_FIELDS));
  buttons.forEach((btn) => btn.remove());

  const allParas = [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field, div.body-md)')]
    .filter((el) => el.textContent.trim() || el.matches('mas-field') || el.querySelector('mas-field, [is="inline-price"]'));

  const cardContent = createTag('div', { class: 'pm-merch-content' });
  // Keep the mas-field wrapper: its tooltip CSS is scoped to `mas-field .icon-button`.
  allParas.forEach((el) => cardContent.append(el.closest('mas-field') || el));
  decorateMasField(cardContent);

  const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
  buttons.forEach((btn) => ctaWrapper.append(btn));

  const merchCard = createTag('div', { class: 'pm-merch-card' });
  merchCard.append(cardContent);
  if (ctaWrapper.children.length) merchCard.append(ctaWrapper);
  return merchCard;
}

function toSubtext(el) {
  const level = el.tagName.match(/^H([1-6])$/)?.[1];
  if (!level) {
    el.classList.add('pm-subtext');
    return el;
  }
  const p = createTag('p');
  p.append(...el.childNodes);
  [...el.attributes].forEach(({ name, value }) => p.setAttribute(name, value));
  p.classList.add('pm-subtext', `heading-${level}`);
  return p;
}

function decorate(block, blockEl = block) {
  const row = block.children[0];
  const col = row?.children[0];
  if (!col) return;

  const { iconEl, heading, bodyEls } = parseLeftColumn(col);
  const subtextEls = bodyEls.map(toSubtext);

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading), ...subtextEls);
  foreground.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(foreground, 'md', MAS_BODY_FIELDS);
  foreground.querySelectorAll(':scope > div.body-md').forEach((body) => body.classList.add('pm-subtext'));

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  const col2 = row?.children[1];
  if (col2?.children.length) {
    const merchCard = buildMerchCard(col2);
    // special-promo inverts the card vs the hero: light hero -> dark card,
    // dark hero -> light card. The mode class flips its content via tokens.
    if (blockEl.classList.contains('special-promo')) {
      merchCard.classList.add(blockEl.classList.contains('dark') ? 'light' : 'dark');
    }
    promoArea.append(merchCard);
  }

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
