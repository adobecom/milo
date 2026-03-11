import { createTag, getFederatedUrl } from '../../../utils/utils.js';

function hasContent(node) {
  return node.textContent?.trim() !== '' || node.querySelector('img, picture, svg, a[href]');
}

function getForegroundContent(foregroundRow, contentDiv, blockName) {
  if (foregroundRow) {
    if (hasContent(foregroundRow)) {
      [...foregroundRow.children].forEach((child) => child.classList.add(`${blockName}-foreground`));
      contentDiv?.append(...foregroundRow.childNodes);
    }
    foregroundRow.remove();
  }
}

function checkPreset(section, blockName) {
  const productGrid = section.classList.contains('product-grid');
  if (!productGrid) return;

  const exploreCards = section.querySelectorAll(`.${blockName}`);
  exploreCards.forEach((card) => {
    card.classList.add('parallax-stagger-ltr-grid');
  });
}

export default function init(el) {
  const blockName = el.classList[0].toLowerCase();
  const rows = el.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  const foregroundRow = rows[1];
  const section = el.closest('.section');

  if (!firstRow) return;

  // First row: content (first div) + background (second div)
  const contentDiv = firstRow.querySelector(':scope > div:first-child');
  const backgroundDiv = firstRow.querySelector(':scope > div:last-child');
  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const prodIcon = contentDiv?.querySelector('img');
  const link = contentDiv?.querySelector('a');

  if (prodIcon && isSvgUrl(prodIcon.src)) {
    prodIcon.src = getFederatedUrl(prodIcon.src);
  }

  backgroundDiv?.classList.add(`${blockName}-background`);
  contentDiv?.classList.add(`${blockName}-content`);
  firstRow.classList.add(`${blockName}-container`);

  // Second row: foreground container
  getForegroundContent(foregroundRow, contentDiv, blockName);
  if (section) checkPreset(section, blockName);

  if (!link) return;
  const linkContainer = createTag('a', { class: `${blockName}-link-container`, href: link.href });
  link.remove();
  linkContainer.append(contentDiv);
  firstRow.prepend(linkContainer);
}
