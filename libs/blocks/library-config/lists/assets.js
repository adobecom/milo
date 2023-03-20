import createCopy from '../library-utils.js';
import { createTag } from '../../../utils/utils.js';

function buildLink(href) {
  return createTag('a', { href, style: 'background-color: #FF00B9' }, href).outerHTML;
}

export default async function assetsList(content, list) {
  content.forEach((href) => {
    const img = createTag('img', { src: href, style: '', title: 'does this work' });
    const a = createTag('a', { href: 'https://www.adobe.com', style: `background-image: url('${href}')` }, 'Hello World');
    const li = createTag('li', { class: 'asset-item' }, img);
    list.append(li);
    img.addEventListener('click', async () => {
      const html = href.endsWith('.svg') ? buildLink(href) : img.outerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      document.body.querySelector('.section').append(img);
      createCopy(blob);
    });
  });
}
