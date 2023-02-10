import { fetchBlogArticleIndex } from '../article-feed/article-feed.js';
import { getArticleTaxonomy, buildArticleCard } from '../article-feed/article-helpers.js';
import { createTag } from '../../utils/utils.js';

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

export default async function onSearchInput({ value, resultsEl, searchInputEl, advancedSearchEl }) {
  // If no value is provided, search results dropdown should not be populated
  if (!value.length) {
    resultsEl.replaceChildren();
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  // Add a modifier class if the input is populated
  resultsEl.classList.remove('no-results');
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  const limit = 12;
  const terms = value.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsEl.innerHTML = '';

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
    const noResults = advancedSearchEl;

    const advancedLink = advancedSearchEl.querySelector('a');
    const href = new URL(advancedLink.href);
    href.searchParams.set('q', value);
    advancedLink.href = href.toString();

    resultsEl.replaceChildren(noResults);
    resultsEl.classList.add('no-results');
    return;
  }

  hits.forEach((hit) => {
    const card = buildArticleCard(hit);
    const listItemEl = createTag('li', null, card);
    resultsEl.appendChild(listItemEl);
  });

  highlightTextElements(terms, resultsEl.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
}
