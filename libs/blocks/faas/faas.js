import { parseEncodedConfig } from '/libs/utils/utils.js';
import { initFaas, loadFaasFiles } from './utils.js';

export default function init(a) {
  loadFaasFiles().then(() => {
    const encodedConfig = a.href.split('#')[1];
    initFaas(parseEncodedConfig(encodedConfig), a);
  });
}
