import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';

const fetchTags = async (path) => {
  const resp = await fetch(path);
  if (!resp.ok) return [];
  const json = await resp.json();
  return json.data || [];
};

const categorize = (tagData) => tagData
  .reduce((tags, tag) => {
    tags[tag.category] ??= [];
    tags[tag.category].push({
      tagname: tag.tagname,
      description: tag.description,
    });
    return tags;
  }, {});

const getCopyBtn = (tagName) => {
  const copy = createTag('button', { class: 'copy' });
  copy.id = `${tagName}-tag-copy`;
  copy.addEventListener('click', (e) => {
    e.target.classList.add('copied');
    setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
    const blob = new Blob([tagName], { type: 'text/plain' });
    createCopy(blob);
    window.hlx?.rum.sampleRUM('click', { source: e.target });
  });
  return copy;
};

export default async function loadPersonalization(content, list) {
  const tagData = await fetchTags(content[0].path);
  const tagsObj = categorize(tagData);
  list.textContent = '';

  Object.entries(tagsObj).forEach(([category, tags]) => {
    const titleTextEl = createTag('p', { class: 'item-title' }, category);
    const titleEl = createTag('li', { class: 'block-group' }, titleTextEl);
    list.append(titleEl);

    const tagListEl = createTag('ul', { class: 'block-group-list' });
    list.append(tagListEl);

    titleEl.addEventListener('click', () => {
      titleEl.classList.toggle('is-open');
    });

    tags.forEach((tag) => {
      const item = document.createElement('li');
      const name = document.createElement('p');
      name.textContent = tag.description;

      const copy = getCopyBtn(tag.tagname);
      item.append(name, copy);

      tagListEl.append(item);
    });
  });
}
