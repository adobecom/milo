import {
  buildArticleCard,
  getBlogArticle,
  loadTaxonomy,
} from '../article-feed/article-helpers.js';

async function decorate(block, article) {
  const card = buildArticleCard(article, 'featured-article');
  block.insertAdjacentElement('afterbegin', card);
  const tagHeader = document.querySelector('.tag-header-container > div');
  /* c8 ignore next */
  if (tagHeader) tagHeader.append(block);
}

export default async function init(block) {
  const a = block.querySelector('a');
  /* c8 ignore next */
  if (!a && !a.href) return;
  block.innerHTML = '';
  loadTaxonomy();
  const article = await getBlogArticle(a.href);
  if (!article) {
    console.log(`Featured article does not exist or is missing in index: ${a.href}`);
    return;
  }
  await decorate(block, article);
}
