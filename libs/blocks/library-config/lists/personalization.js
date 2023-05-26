import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';

const capitalize = (string) => (string[0].toUpperCase() + string.slice(1));

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


export default async function loadPersonalization(content, list) {
  const tagData = await fetchTags(content[0].path);
  const tagsObj = categorize(tagData);
  list.textContent = '';

  Object.entries(tagsObj).forEach(([category, tags]) => {
    const titleTextEl = createTag('p', { class: 'item-title' }, capitalize(category));
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

      // TODO: copy btn code here

      item.append(name);
      tagListEl.append(item);
    });
  });
}
