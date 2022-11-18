import {
  buildArticleCard,
  getBlogArticle,
  loadTaxonomy,
} from '../article-feed/article-helpers.js';

async function decorateFeaturedArticle(featuredArticleEl, articlePath) {
  const article = await getBlogArticle(articlePath);
  if (article) {
    const card = buildArticleCard(article, 'featured-article');
    const tagHeader = document.querySelector('.tag-header-container > div');
    featuredArticleEl.append(card);
    if (tagHeader) tagHeader.append(featuredArticleEl);
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Featured article does not exist or is missing in index: ${window.location.origin}${articlePath}`);
  }
}

export default async function decorate(block) {
  const a = block.querySelector('a');
  block.innerHTML = '';
  loadTaxonomy();
  if (a && a.href) {
    const { href } = a;
    await decorateFeaturedArticle(block, href);
  }
}
