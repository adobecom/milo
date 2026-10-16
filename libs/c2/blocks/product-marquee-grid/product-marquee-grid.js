import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

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

  const bodyEls = [...col.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((el) => el !== heading && el.textContent.trim());

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
  decorateButtons(col);

  const allParas = [...col.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((el) => el.textContent.trim()
      || el.querySelector('mas-field, [is="inline-price"], .con-button, a[data-wcs-osi]'));

  const cardContent = createTag('div', { class: 'pm-merch-content' });
  // Keep the mas-field wrapper: its tooltip CSS is scoped to `mas-field .icon-button`.
  allParas.forEach((el) => cardContent.append(el.closest('mas-field') || el));
  decorateMasField(cardContent);

  // Group the CTAs in place so any content authored after them still renders after.
  // Detect CTAs by their stable markup (resolved buttons, commerce links, or a headless
  // `ctas` mas-field) rather than the `.action-area` class: merch.js stamps `.action-area`
  // asynchronously once a headless mas-field CTA resolves -- after this runs -- so keying
  // off it would miss late CTAs and never build the wrapper.
  const isCtaPara = (el) => !!el.querySelector('.con-button, a[data-wcs-osi], mas-field[field^="ctas"]');
  const ctaParas = [...cardContent.children].filter(isCtaPara);
  if (ctaParas.length) {
    const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
    ctaParas[0].replaceWith(ctaWrapper);
    ctaParas.forEach((area) => ctaWrapper.append(area));
  }

  const merchCard = createTag('div', { class: 'pm-merch-card' });
  merchCard.append(cardContent);
  return merchCard;
}

function toSubtext(el) {
  const level = el.tagName.match(/^H([1-6])$/)?.[1];
  if (!level) {
    el.classList.add('pm-subtext');
    return el;
  }
  const p = createTag('p', null, el.innerHTML);
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
