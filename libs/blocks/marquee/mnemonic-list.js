import { getConfig, createTag, loadStyle } from '../../utils/utils.js';

export const decorateMnemonicList = (container) => {
  if (!container) return;
  const paragraphs = container.querySelectorAll(':scope p:not([class])');
  if (paragraphs.length < 1) return;
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/blocks/marquee/mnemonic-list.css`);
  const productList = createTag('div', { class: 'product-list' });
  [...paragraphs].forEach((paragraph) => {
    const title = paragraph.querySelector('strong');
    const picture = paragraph.querySelector('picture');
    const product = createTag('div', { class: 'product-item' });
    if (title && !picture) {
      product.appendChild(title);
    }
    if (title && picture) {
      product.appendChild(picture);
      product.appendChild(title);
    }
    productList.appendChild(product);
    paragraph.replaceWith(productList);
  });
};

export default decorateMnemonicList;
