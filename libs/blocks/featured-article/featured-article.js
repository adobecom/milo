import {
  buildArticleCard,
  getBlogArticle,
  loadTaxonomy,
} from '../article-feed/article-helpers.js';

async function decorate(block, article) {
  const card = buildArticleCard(article, 'featured-article');
  block.insertAdjacentElement('afterbegin', card);
  const tagHeader = document.querySelector('.tag-header-container > div');
  if (tagHeader) tagHeader.append(block);
}

export default async function init(block) {
  const a = block.querySelector('a');
  if (!a && !a.href) return;
  block.innerHTML = '';
  await loadTaxonomy();
  const href = new URL(a.href).pathname;
  const article = await getBlogArticle(href);
  if (!article) {
    console.log(`Featured article does not exist or is missing in index: ${href}`);
    return;
  }
  await decorate(block, article);
}
