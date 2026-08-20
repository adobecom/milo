import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent, decorateButtons } from '../../../utils/decorate.js';

const findSize = (classes, key) => classes.find((item) => item.startsWith(key))?.slice(key.length);

function getSubtextStyle(block) {
  const classes = [...block.classList];
  const headingSize = findSize(classes, 'heading-');
  if (headingSize) return `heading-${headingSize}`;
  const bodySize = findSize(classes, 'body-');
  if (bodySize) return `body-${bodySize}`;
  return 'heading-5';
}

function parseLeftColumn(col) {
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.src);

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const allTextEls = [...col.querySelectorAll('p, h1, h2, h3, h4, h5, h6')]
    .filter((el) => el !== heading && el.textContent.trim());

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

  const allParas = [...col.querySelectorAll('p')].filter((el) => el.textContent.trim());
  const contentEls = allParas.filter((el) => !el.querySelector('.con-button'));

  const cardContent = createTag('div', { class: 'pm-merch-content' });
  contentEls.forEach((el) => cardContent.append(el));

  const ctaWrapper = createTag('div', { class: 'pm-merch-ctas' });
  [...col.querySelectorAll('.con-button')].forEach((btn) => ctaWrapper.append(btn));

  return createTag('div', { class: 'pm-merch-card' }, [cardContent, ctaWrapper]);
}

function decorate(block) {
  const row = block.children[0];
  const col = row?.children[0];
  if (!col) return;

  const { iconEl, heading, bodyEls } = parseLeftColumn(col);
  const subtextStyle = getSubtextStyle(block);
  bodyEls.forEach((el) => el.classList.add('pm-subtext', subtextStyle));

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(buildChicletRow(iconEl, heading), ...bodyEls);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  const col2 = row?.children[1];
  if (col2) promoArea.append(buildMerchCard(col2));

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
