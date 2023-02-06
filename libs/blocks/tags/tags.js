import { sampleRUM } from '../../utils/samplerum.js';
import { createTag } from '../../utils/utils.js';
import { loadTaxonomy, computeTaxonomyFromTopics, getTaxonomyModule } from '../article-feed/article-helpers.js';

export default async function decorateTags(blockEl) {
  await loadTaxonomy();

  const container = blockEl.querySelector('p');
  const topics = container.textContent.split(';');
  container.classList.add('tags-container');
  container.textContent = '';

  const articleTax = computeTaxonomyFromTopics(topics);
  const tagsForBlock = articleTax.visibleTopics.map((topic) => {
    const anchor = createTag('a', { href: getTaxonomyModule().get(topic).link }, topic);
    return anchor;
  });

  const mainEl = document.body.querySelector('main');
  const recBlock = mainEl.querySelector('.recommended-articles');
  if (recBlock) {
    recBlock.insertAdjacentElement('beforebegin', blockEl);
  } else {
    mainEl.lastElementChild.append(blockEl);
  }

  const targets = [];
  Array.from(tagsForBlock).forEach((tag) => {
    tag.classList.add('button');
    container.append(tag);
    targets.push(tag.textContent);
  });
  const target = targets.join('; ');

  sampleRUM('loadtags', { target, source: 'tags' });
}
