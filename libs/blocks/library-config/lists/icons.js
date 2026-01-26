import { fetchIconList } from '../../../features/icons/icons.js';
import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';

let fedIconList;
const iconElements = new Map();

export default async function iconList(content, list, query) {
  if (!fedIconList) {
    fedIconList = await fetchIconList(content[0].path);
    if (!fedIconList?.length) throw new Error('No icons returned from fetchIconList');
    fedIconList.forEach(({ key, icon }) => {
      const svg = createTag('span', { class: `icon icon-${key}` }, createTag('img', { class: `icon-${key}-img icon-fed`, src: `${icon}`, width: '18px' }));
      const titleText = createTag('p', { class: 'item-title' }, key);
      const title = createTag('li', { class: 'icon-item' }, svg);
      title.append(titleText);
      const copy = createTag('button', { class: 'copy' });
      copy.id = `${key}-icon-copy`;
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const formatted = `:${key}:`;
        const blob = new Blob([formatted], { type: 'text/plain' });
        createCopy(blob);
        window.hlx?.rum.sampleRUM('click', { source: e.target });
      });
      title.append(copy);

      iconElements.set(key, title);
    });
  }

  list.replaceChildren();

  iconElements.forEach((element, name) => {
    element.classList.toggle('is-hidden', query && !name.includes(query));
    list.appendChild(element);
  });
}
