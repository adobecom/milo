import { initCaas, loadCaasFiles } from './utils.js';
import { parseEncodedConfig } from '../../libs/utils.js';

export default async function init(a) {
  await loadCaasFiles();

  // Create empty div to hold CaaS output.
  const block = document.createElement('div');
  block.className = a.className;
  block.id = 'caas';
  a.insertAdjacentElement('afterend', block);

  const encodedConfig = a.href.split('#')[1];
  initCaas(parseEncodedConfig(encodedConfig), block);
}
