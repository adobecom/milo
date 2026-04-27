import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

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

function decorate(block, root) {
  const blockName = root.classList[0].toLowerCase();
  const rows = block.querySelectorAll(':scope > div');
  const firstRow = rows[0];
  const foregroundRow = rows[1];

  if (!firstRow) return;

  const contentDiv = firstRow.querySelector(':scope > div:first-child');
  const backgroundDiv = firstRow.querySelector(':scope > div:last-child');
  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const prodIcon = contentDiv?.querySelector('img');
  const link = contentDiv?.querySelector('a');
  const heading = contentDiv?.querySelector(':is(h1, h2, h3, h4, h5, h6)');

  if (prodIcon && isSvgUrl(prodIcon.src)) {
    prodIcon.src = getFederatedUrl(prodIcon.src);
  }

  backgroundDiv?.classList.add(`${blockName}-background`);
  contentDiv?.classList.add(`${blockName}-content`);
  firstRow.classList.add(`${blockName}-container`);

  getForegroundContent(foregroundRow, contentDiv, blockName);
  decorateBlockText(contentDiv, { heading: '4' });

  if (!link) return;
  const linkContainer = createTag('a', { class: `${blockName}-link-container`, href: link.href, 'data-tracking-label': heading?.textContent });
  link.remove();
  linkContainer.append(contentDiv);
  firstRow.prepend(linkContainer);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
