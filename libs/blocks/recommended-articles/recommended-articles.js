import { createTag, getMetadata, getConfig } from '../../utils/utils.js';
import fetchTaxonomy from '../../scripts/taxonomy.js';
import { replaceKey } from '../../features/placeholders.js';
import { updateLinkWithLangRoot } from '../../utils/helpers.js';

async function getArticleDetails(article) {
  const path = new URL(article.href).pathname;
  const resp = await fetch(path);
  if (!resp || !resp.ok) {
    // eslint-disable-next-line no-console
    console.log(`Could not retrieve metadata for ${path}`);
    return null;
  }
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const trimEndings = ['|Adobe', '| Adobe', '| Adobe Blog', '|Adobe Blog'];
  let title = getMetadata('og:title', doc).trim();
  const ending = trimEndings.find((el) => title.endsWith(el));
  [title] = title.split(ending);

  const category = getMetadata('category', doc) || getMetadata('article:tag', doc);

  return {
    title,
    path,
    category,
    description: getMetadata('description', doc),
    imageEl: doc.querySelector('picture'),
    date: getMetadata('publication-date', doc),
  };
}

function getDecoratedCards(articles, taxonomy) {
  const container = createTag('div', { class: 'article-cards' });
  articles.forEach((article) => {
    if (!article) return;

    const {
      category, imageEl, path, title, description, date,
    } = article;
    const wrapper = createTag('a', { class: 'article-card', href: path });
    const cardImage = createTag('div', { class: 'article-card-image' }, imageEl);
    const cardBody = createTag('div', { class: 'article-card-body' });
    const categoryTaxonomy = taxonomy.get(category) || 'News';
    const categoryLink = createTag('a', { href: updateLinkWithLangRoot(categoryTaxonomy.link) }, categoryTaxonomy.name);
    const categoryEl = createTag('p', { class: 'article-card-category' }, categoryLink);
    const titleEl = createTag('h3', null, title);
    const descriptionEl = createTag('p', { class: 'article-card-description' }, description);
    const dateEl = createTag('p', { class: 'article-card-date' }, date);

    cardBody.append(categoryEl, titleEl, descriptionEl, dateEl);
    wrapper.append(cardImage, cardBody);
    container.append(wrapper);
  });
  return container;
}

export default async function init(blockEl) {
  const children = [...blockEl.querySelectorAll(':scope > div')];
  const config = getConfig();
  let content;
  let recommendedArticleLinks;

  if (children.length === 1) {
    recommendedArticleLinks = [...children[0].querySelectorAll('a')];
  } else {
    content = children[0].querySelector('div');
    content.classList.add('recommended-articles-content');
    content.querySelector('a')?.classList.add('button');

    recommendedArticleLinks = [...children[1].querySelectorAll('a')];
  }

  if (blockEl.classList.contains('small')) {
    blockEl.classList.add('recommended-articles-small-content-wrapper');
    blockEl.classList.remove('small');
  } else {
    blockEl.classList.add('recommended-articles-content-wrapper');
    if (!content) {
      const text = await replaceKey('recommended-for-you', config);
      content = createTag('h3', null, text);
    }
  }
  blockEl.innerHTML = '';

  const taxonomyRoot = config.taxonomyRoot || '/topics';
  const taxonomy = await fetchTaxonomy(config, taxonomyRoot);
  const unresolvedPromises = recommendedArticleLinks.map((article) => getArticleDetails(article));
  let articles = [];
  articles = await Promise.all(unresolvedPromises);

  if (!articles.some((article) => article)) {
    blockEl.remove();
    return;
  }

  const decoratedEl = getDecoratedCards(articles, taxonomy);

  blockEl.append(decoratedEl);
  if (content) blockEl.prepend(content);
}
