import { initCaas, loadCaasFiles, loadStrings } from './utils.js';
import { parseEncodedConfig, createIntersectionObserver } from '../../utils/utils.js';

const ROOT_MARGIN = 1000;

const getCaasStrings = (placeholderUrl) => new Promise((resolve) => {
  if (placeholderUrl) {
    resolve(loadStrings(placeholderUrl));
    return;
  }
  resolve({});
});

const loadCaas = async (a) => {
  const encodedConfig = a.href.split('#')[1];
  const state = parseEncodedConfig(encodedConfig);

  const [caasStrs] = await Promise.all([
    getCaasStrings(state.placeholderUrl),
    loadCaasFiles(),
  ]);

  const block = document.createElement('div');
  block.className = a.className;
  block.id = 'caas';
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modalContainer';
  a.insertAdjacentElement('afterend', modalDiv);

  a.insertAdjacentElement('afterend', block);
  a.remove();

  initCaas(state, caasStrs, block);
};

export default async function init(link) {
  if (link.textContent.includes('no-lazy')) {
    loadCaas(link);
  } else {
    createIntersectionObserver({
      el: link,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadCaas,
    });
  }
}
