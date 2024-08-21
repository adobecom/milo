import '../../deps/mas/commerce.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-datasource.js';
import { getConfig, loadStyle } from '../../utils/utils.js';

export default async function init(el) {
  const { base } = getConfig();

  switch (el.dataset.type) {
    case 'merch-card':
      loadStyle(`${base}/blocks/merch-card/merch-card.css`);
      // TODO optimize CLS.
      el.outerHTML = `<merch-card>
        <merch-datasource path="${el.dataset.path}" consonant></merch-datasource>
        </merch-card>`;
      break;
    default:
  }
}
