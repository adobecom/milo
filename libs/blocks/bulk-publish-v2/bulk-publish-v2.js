import { getConfig } from '../../utils/utils.js';
import './components/bulk-publisher.js';

export default async function init(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot || 'libs';
  el.style.setProperty('--background-img', `url(${base}/blocks/bulk-publish-v2/img/background.svg)`);
  el.style.setProperty('--down-arrow-icon', `url(${base}/blocks/bulk-publish-v2/img/downarrow.svg)`);
  el.append(document.createElement('bulk-publish'));
}
