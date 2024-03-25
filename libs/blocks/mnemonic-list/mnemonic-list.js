import { createTag, getConfig, loadStyle } from '../../utils/utils.js';

export async function loadMnemonicList(container) {
  try {
    const { base } = getConfig();
    const stylePromise = new Promise((resolve) => {
      loadStyle(`${base}/blocks/mnemonic-list/mnemonic-list.css`, resolve);
    });
    const loadModule = import(`${base}/blocks/mnemonic-list/mnemonic-list.js`)
      .then(({ decorateMnemonicList }) => decorateMnemonicList(container));
    await Promise.all([stylePromise, loadModule]);
  } catch (err) {
    window.lana?.log(`Failed to load mnemonic list module: ${err}`);
  }
}


export const decorateMnemonicList = async (container) => {
  const { base } = getConfig();
  loadStyle(`${base}/blocks/mnemonic-list/mnemonic-list.css`);
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
  targetElement?.prepend(productList);
  const divs = targetElement?.querySelectorAll('div:not([class])');
  divs.forEach((div) => div.remove());
};

export default async function init(el) {
  decorateMnemonicList(el);
}
