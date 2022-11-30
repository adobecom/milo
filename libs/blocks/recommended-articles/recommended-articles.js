import {
  buildArticleCard,
  getBlogArticle,
  loadTaxonomy,
} from '../article-feed/article-helpers.js';

import { createTag, getConfig, decoratePlaceholders } from '../../utils/utils.js';

async function decorateRecommendedArticles(recommendedArticlesEl, paths) {
  if (recommendedArticlesEl.classList.contains('small')) {
    recommendedArticlesEl.parentNode.querySelectorAll('a').forEach((aEl) => {
      aEl.classList.add('button');
    });
    recommendedArticlesEl.parentNode.classList.add('recommended-articles-small-content-wrapper');
  } else {
    recommendedArticlesEl.parentNode.classList.add('recommended-articles-content-wrapper');
    const title = document.createElement('h3');
    title.innerHTML = '{{recommended-for-you}}'
    await decoratePlaceholders(title, getConfig())
    recommendedArticlesEl.prepend(title);
  }

  const articleCardsContainer = createTag('div', { class: 'article-cards' });
  let articles;
  const asyncFunc = async () => {
    const unresolvedPromises = paths.map(async (path) => getBlogArticle(path));
    articles = await Promise.all(unresolvedPromises);
    console.log(articles.length)
    if (articles.length) {
      articles.forEach((article, index) => {
        if (!article) {
          const { origin } = new URL(window.location.href);
          // eslint-disable-next-line no-console
          window.lana.log(`Recommended article does not exist or is missing in index: ${origin}${paths[index]}`);
        } else {
          const card = buildArticleCard(article);
          articleCardsContainer.append(card);
          recommendedArticlesEl.append(articleCardsContainer);
        }
      });
    }
  };
  await asyncFunc();

  if (!articleCardsContainer.hasChildNodes()) {
    recommendedArticlesEl.parentNode.remove();
  }
}

export default async function init(recommendedArticles) {
  const anchors = [...recommendedArticles.querySelectorAll('a')];
  recommendedArticles.innerHTML = '';
  await loadTaxonomy();
  const paths = anchors.map((a) => new URL(a.href).pathname);
  decorateRecommendedArticles(recommendedArticles, paths);
}
