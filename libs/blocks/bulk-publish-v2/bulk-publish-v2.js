import { getConfig } from '../../utils/utils.js';
import './components/bulk-publisher.js';

export default async function init(el) {
  el.append(document.createElement('bulk-publish'));
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot || 'libs';
  el.style.setProperty('--bg-img', `url(${base}/blocks/bulk-publish-v2/img/background.svg)`);
  el.style.setProperty('--arrow-icon', `url(${base}/blocks/bulk-publish-v2/img/downarrow.svg)`);
}
