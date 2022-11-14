import {
  buildArticleCard,
  getBlogArticle,
} from '../article-feed/article-helpers.js';

import { createTag, getConfig } from '../../utils/utils.js';

import { replaceKey } from '../../features/placeholders.js';

const replacePlaceholder = async (key) => replaceKey(key, getConfig());

async function decorateRecommendedArticles(recommendedArticlesEl, paths) {
  if (recommendedArticlesEl.classList.contains('small')) {
    recommendedArticlesEl.parentNode.querySelectorAll('a').forEach((aEl) => {
      aEl.classList.add('button', 'primary', 'small', 'light');
    });
    recommendedArticlesEl.parentNode.classList.add('recommended-articles-small-content-wrapper');
  } else {
    const title = document.createElement('h3');
    title.textContent = replacePlaceholder('recommended-for-you');
    recommendedArticlesEl.prepend(title);
  }

  const articleCardsContainer = createTag('div', { class: 'article-cards' });

  paths.forEach(async (articlePath) => {
    // eslint-disable-next-line no-await-in-loop
    const article = await getBlogArticle(articlePath);

    if (!article) {
      const { origin } = new URL(window.location.href);
      // eslint-disable-next-line no-console
      console.warn(`Recommended article does not exist or is missing in index: ${origin}${articlePath}`);
    } else {
      const card = buildArticleCard(article);
      articleCardsContainer.append(card);
      recommendedArticlesEl.append(articleCardsContainer);
    }
  });

  if (!articleCardsContainer.hasChildNodes()) {
    recommendedArticlesEl.parentNode.parentNode.remove();
  }
}

export default async function init(recommendedArticles) {
  const anchors = [...recommendedArticles.querySelectorAll('a')];
  recommendedArticles.innerHTML = '';
  const paths = anchors.map((a) => new URL(a.href).pathname);
  decorateRecommendedArticles(recommendedArticles, paths);
}
