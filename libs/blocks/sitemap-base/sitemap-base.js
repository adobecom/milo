import { decorateLinksAsync } from '../../utils/utils.js';

export default async function init(el) {
  const items = el.querySelectorAll(':scope > div');

  items.forEach((item, index) => {
    item.classList.add('sitemap-base-item', `sitemap-base-item-${index + 1}`);
  });

  await decorateLinksAsync(el);
}
