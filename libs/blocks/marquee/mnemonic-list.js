import { createTag } from '../../utils/utils.js';

export const decorateMnemonicList = (container) => {
  const paragraphs = container.querySelectorAll(':scope p:not([class])');
  if (paragraphs.length < 1) return;
  const productList = createTag('div', { class: 'product-list' });
  [...paragraphs].forEach((paragraph) => {
    const title = paragraph.querySelector('strong');
    const picture = paragraph.querySelector('picture');
    const product = createTag('div', { class: 'product-item' });
    if (picture) product.appendChild(picture);
    if (title) product.appendChild(title);
    productList.appendChild(product);
    paragraph.replaceWith(productList);
  });
};

export default decorateMnemonicList;
