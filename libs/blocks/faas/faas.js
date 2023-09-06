import { parseEncodedConfig } from '../../utils/utils.js';
import { initFaas, loadFaasFiles } from './utils.js';

export default async function init(a) {
  await loadFaasFiles();
  const encodedConfig = a.href.split('#')[1];
  const faas = initFaas(parseEncodedConfig(encodedConfig), a);

  // if FaaS is in Modal, make it column2 style.
  if (faas && faas.closest('.dialog-modal')) {
    faas.querySelector('.faas').classList.add('column2');
  }
}
