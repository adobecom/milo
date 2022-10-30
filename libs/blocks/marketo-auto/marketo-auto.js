import { parseEncodedConfig, loadStyle, createTag } from '../../utils/utils.js';
import { loadMarketoForm } from '../marketo/marketo.js';

export default async function init(a) {
  const encodedConfig = a.href.split('#')[1];
  const marketo = createTag('div', { class: 'marketo' });
  a.parentElement.replaceChild(marketo, a);
  loadStyle('/libs/blocks/marketo/marketo.css');
  loadMarketoForm(marketo, parseEncodedConfig(encodedConfig));
}
