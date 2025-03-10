import { fetchIconList } from '../../../features/icons/icons.js';
import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';

export default async function iconList(content, list, query) {
  const fedIconList = await fetchIconList(content[0].path);
  list.innerHTML = '';
  if (fedIconList.length) {
    [...fedIconList].forEach((icon) => {
      const svg = createTag('span', { class: `icon icon-${icon.name}` }, createTag('img', { class: `icon-${icon.name}-img icon-fed`, src: `${icon.url}`, width: '18px' }));
      const titleText = createTag('p', { class: 'item-title' }, icon.name);
      const title = createTag('li', { class: 'icon-item' }, svg);
      if (query && !icon.name.includes(query)) title.classList.add('is-hidden');
      title.append(titleText);
      const copy = createTag('button', { class: 'copy' });
      copy.id = `${icon.name}-icon-copy`;
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const formatted = `:${icon.name}:`;
        const blob = new Blob([formatted], { type: 'text/plain' });
        createCopy(blob);
        window.hlx?.rum.sampleRUM('click', { source: e.target });
      });
      title.append(copy);
      list.append(title);
    });
  }
}
