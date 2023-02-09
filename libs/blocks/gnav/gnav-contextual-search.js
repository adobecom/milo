import { fetchBlogArticleIndex } from '../article-feed/article-feed.js';
import { getArticleTaxonomy, buildArticleCard } from '../article-feed/article-helpers.js';
import { getNoResultsEl } from './gnav-search.js';

function highlightTextElements(terms, elements) {
  elements.forEach((e) => {
    const matches = [];
    const txt = e.textContent;
    terms.forEach((term) => {
      const offset = txt.toLowerCase().indexOf(term);
      if (offset >= 0) {
        matches.push({ offset, term });
      }
    });
    matches.sort((a, b) => a.offset - b.offset);
    let markedUp = '';
    if (!matches.length) markedUp = txt;
    else {
      markedUp = txt.substr(0, matches[0].offset);
      matches.forEach((hit, i) => {
        markedUp += `<mark class="gnav-search-highlight">${txt.substr(hit.offset, hit.term.length)}</mark>`;
        if (matches.length - 1 === i) {
          markedUp += txt.substr(hit.offset + hit.term.length);
        } else {
          markedUp += txt.substring(hit.offset + hit.term.length, matches[i + 1].offset);
        }
      });
      e.innerHTML = markedUp;
    }
  });
}

export default async function onSearchInput(searchTerm, resultsContainer) {
  const limit = 12;
  const terms = searchTerm.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (!terms.length) return;

  const { data: articles } = await fetchBlogArticleIndex();
  const hits = [];
  let i = 0;
  for (; i < articles.length; i += 1) {
    const article = articles[i];
    const { category } = getArticleTaxonomy(article);
    const text = [category, article.title, article.description].join(' ').toLowerCase();

    if (terms.every((term) => text.includes(term))) {
      if (hits.length === limit) {
        break;
      }
      hits.push(article);
    }
  }

  if (!hits.length) {
    const noResults = getNoResultsEl();
    resultsContainer.replaceChildren(noResults);
    return;
  };

  hits.forEach((hit) => {
    const card = buildArticleCard(hit);
    resultsContainer.appendChild(card);
  });

  highlightTextElements(terms, resultsContainer.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
}
