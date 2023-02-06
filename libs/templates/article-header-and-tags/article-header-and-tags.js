import { createTag } from '../../utils/utils.js';
import { sampleRUM } from '../../utils/samplerum.js';
import { loadTaxonomy, computeTaxonomyFromTopics, getTaxonomyModule } from '../../blocks/article-feed/article-helpers.js';

function decorateTags(topics) {
  const articleTax = computeTaxonomyFromTopics(topics);
  const tagsForBlock = articleTax.visibleTopics.map((topic) => {
    const anchor = createTag('a', { href: getTaxonomyModule().get(topic).link }, topic);
    return anchor;
  });

  const tagsEl = createTag('p');
  const container = createTag('div', { class: 'tags-container' }, tagsEl);
  const mainEl = document.body.querySelector('main');
  const recBlock = mainEl.querySelector('.recommended-articles');
  if (recBlock) {
    recBlock.insertAdjacentElement('beforebegin', container);
  } else {
    mainEl.lastElementChild.append(container);
  }

  const targets = [];
  Array.from(tagsForBlock).forEach((tag) => {
    tag.classList.add('button');
    tagsEl.append(tag);
    targets.push(tag.textContent);
  });
  const target = targets.join('; ');

  sampleRUM('loadtags', { target, source: 'tags' });
}

async function init() {
  await loadTaxonomy();

  const topics = [...document.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);

  decorateTags(topics);
}

init();
