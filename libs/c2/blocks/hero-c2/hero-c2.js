import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateButtons, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';

const MAS_BODY_FIELDS = 'mas-field:is([field="description"], [field="shortDescription"])';

const hasContent = (cell) => !!cell
  && (!!cell.textContent.trim() || !!cell.querySelector(':not(p, br)'));

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

function buildMerch(col) {
  [...col.children]
    .filter((el) => !el.matches(MAS_BODY_FIELDS) && !el.querySelector(MAS_BODY_FIELDS))
    .forEach((el) => decorateButtons(el));
  col.querySelectorAll(`:scope > p:has(> ${MAS_BODY_FIELDS})`)
    .forEach((p) => p.classList.add('body-md'));
  normalizeMasFieldText(col, 'md', MAS_BODY_FIELDS);

  const content = createTag('div', { class: 'hero-c2-merch-content' });
  [...col.querySelectorAll(':scope > :is(p, h1, h2, h3, h4, h5, h6, mas-field, div)')]
    .filter((el) => el.textContent.trim() || el.matches('mas-field')
      || el.querySelector('mas-field, [is="inline-price"], .con-button, a[data-wcs-osi]'))
    // Keep the mas-field wrapper: its tooltip CSS is scoped to `mas-field .icon-button`.
    .forEach((el) => content.append(el.closest('mas-field') || el));
  decorateMasField(content);

  const ctaSelector = '.con-button, a[data-wcs-osi], mas-field[field^="ctas"]';
  const ctaParas = [...content.children].filter((el) => {
    const cta = el.matches(ctaSelector) ? el : el.querySelector(ctaSelector);
    return !!cta && !cta.closest(MAS_BODY_FIELDS);
  });
  if (ctaParas.length) {
    const ctas = createTag('div', { class: 'hero-c2-merch-ctas' });
    ctaParas[0].replaceWith(ctas);
    ctaParas.forEach((para) => ctas.append(para));
  }
  return createTag('div', { class: 'hero-c2-merch' }, content);
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
  copy.classList.add('hero-c2-text');
}

// Background of the media area: image, video, or a CSS color/gradient as text.
function decorateBackground(block, bg) {
  if (!hasContent(bg)) return null;
  decorateBlockBg(block, bg, { className: 'hero-c2-background' });
  if (bg.classList.contains('hero-c2-background')) return bg;
  if (!block.style.background) return null;
  const colorBg = createTag('div', { class: 'hero-c2-background', style: `background: ${block.style.background}` });
  block.style.removeProperty('background');
  return colorBg;
}

function decorate(block) {
  const [copyRow, merchRow, footerRow] = block.children;
  const [copy, bg] = copyRow?.children || [];
  const [merch, media] = merchRow?.children || [];
  const [supporting] = footerRow?.children || [];
  if (!copy) return;

  decorateCopy(copy);
  const left = createTag('div', { class: 'hero-c2-left' }, copy);
  if (hasContent(merch)) left.append(buildMerch(merch));
  if (hasContent(supporting)) {
    supporting.classList.add('hero-c2-supporting', 'caption');
    left.append(supporting);
  }

  const mediaArea = createTag('div', { class: 'hero-c2-media-area' });
  const background = decorateBackground(block, bg);
  if (background) mediaArea.append(background);
  if (hasContent(media)) {
    media.classList.add('hero-c2-foreground');
    mediaArea.append(media);
  }

  const content = createTag('div', { class: 'hero-c2-content container' }, left);
  content.append(mediaArea);
  block.replaceChildren(content);
  block.querySelectorAll('video:not([controls])').forEach((video) => video.setAttribute('tabindex', '-1'));
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
