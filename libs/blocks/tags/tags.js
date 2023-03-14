import { getTaxonomyModule, loadTaxonomy, computeTaxonomyFromTopics, getLinkForTopic } from '../article-feed/article-helpers.js';
import { createTag } from '../../utils/utils.js';

export default async function init(blockEl) {
  let tags = blockEl.firstElementChild?.firstElementChild?.textContent;

  if (!tags) return;

  if (!getTaxonomyModule()) {
    await loadTaxonomy();
  }

  blockEl.innerHTML = '';
  tags = tags.replace(/[^a-zA-Z0-9,\s-]/g, '');
  const tagsArray = tags.split(', ').map((tag) => tag.trim());
  const articleTax = computeTaxonomyFromTopics(tagsArray);
  const tagsWrapper = createTag('p');

  articleTax.visibleTopics?.forEach((topic) => {
    const link = getLinkForTopic(topic);
    const parser = new DOMParser();
    const linkElement = parser.parseFromString(link, 'text/html').body.firstChild;
    tagsWrapper.appendChild(linkElement);
  });

  blockEl.append(tagsWrapper);
}
