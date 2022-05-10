import { parseEncodedConfig } from '/libs/utils/utils.js';
import { initFaas, loadFaasFiles } from './utils.js';

export default function init(el) {
  loadFaasFiles().then(()=>{
    const a = el  ;
    const encodedConfig = a.href.split('#')[1];
    initFaas(parseEncodedConfig(encodedConfig), a);
  });
}
