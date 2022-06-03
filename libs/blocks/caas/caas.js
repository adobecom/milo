import { initCaas, loadCaasFiles, loadStrings } from './utils.js';
import { parseEncodedConfig } from '../../utils/utils.js';

export default async function init(a) {
  await loadCaasFiles();

  const encodedConfig = a.href.split('#')[1];
  const state = parseEncodedConfig(encodedConfig);
  const caasStrs = state.placeholderUrl ? await loadStrings(state.placeholderUrl) : {};

  const block = document.createElement('div');
  block.className = a.className;
  block.id = 'caas';
  a.insertAdjacentElement('afterend', block);
  a.remove();

  initCaas(state, caasStrs, block);
}
