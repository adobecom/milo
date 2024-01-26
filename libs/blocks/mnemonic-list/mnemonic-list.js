import { createTag, getConfig, loadStyle } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();

export const decorateMnemonicList = (container) => {
  loadStyle(`${miloLibs || codeRoot}/blocks/mnemonic-list/mnemonic-list.css`);
  const mnemonicListElement = container.querySelector('.mnemonic-list');
  const targetElement = mnemonicListElement || container;
  const rows = targetElement.querySelectorAll(':scope p:not([class])');
  if (rows.length < 1) return;
  const productList = createTag('div', { class: 'product-list' });
  [...rows].forEach((paragraph) => {
    const title = paragraph.querySelector('strong');
    const picture = paragraph.querySelector('picture');
    const product = createTag('div', { class: 'product-item' });
    if (picture) product.appendChild(picture);
    if (title) product.appendChild(title);
    productList.appendChild(product);
    paragraph.replaceWith(productList);
  });
};

export default async function init(el) {
  decorateMnemonicList(el);
}
