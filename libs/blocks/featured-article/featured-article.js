/* eslint-disable import/named, import/extensions */

import {
  buildArticleCard,
  getBlogArticle,
  loadTaxonomy,
} from '../article-feed/article-helpers.js';

async function decorateFeaturedArticle(featuredArticleEl, articlePath, eager = false) {
  const article = await getBlogArticle(articlePath);
  if (article) {
    const card = buildArticleCard(article, 'featured-article', eager);
    const tagHeader = document.querySelector('.tag-header-container > div');
    if (tagHeader) {
      featuredArticleEl.append(card);
      tagHeader.append(featuredArticleEl);
    } else {
      featuredArticleEl.append(card);
    }
  } else {
    const { origin } = new URL(window.location.href);
    // eslint-disable-next-line no-console
    console.warn(`Featured article does not exist or is missing in index: ${origin}${articlePath}`);
  }
}

export default async function decorate(block, eager) {
  const a = block.querySelector('a');
  block.innerHTML = '';
  loadTaxonomy();
  if (a && a.href) {
    const path = new URL(a.href).pathname;
    await decorateFeaturedArticle(block, path, eager);
  }
}
