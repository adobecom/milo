import createCopy from '../library-utils.js';
import { createTag } from '../../../utils/utils.js';

function buildLink(href) {
  return createTag('a', { href }, href).outerHTML;
}

export default async function assetsList(content, list) {
  content.forEach((href) => {
    const img = createTag('img', { src: href });
    createTag('li', { class: 'asset-item' }, img, { parent: list });
    img.addEventListener('click', () => {
      const html = href.endsWith('.svg') ? buildLink(href) : img.outerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      createCopy(blob);
    });
  });
}
