import { parseEncodedConfig } from '../../utils/utils.js';
import { loadMarketoForm } from '../marketo/marketo.js';

export default async function init(a) {
  console.log('here');
  const encodedConfig = a.href.split('#')[1];
  loadMarketoForm(a.parentElement, parseEncodedConfig(encodedConfig));
}
