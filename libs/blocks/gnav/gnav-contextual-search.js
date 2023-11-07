import { fetchBlogArticleIndex } from '../article-feed/article-feed.js';
import { getArticleTaxonomy, buildArticleCard } from '../article-feed/article-helpers.js';
import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

let abortController;
let articles = [];
const LIMIT = 12;
let lastSearch = null;

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    const matches = [];
    const textContent = element.textContent.toLowerCase();
    terms.forEach((term) => {
      const offset = textContent.indexOf(term.toLowerCase());
      if (offset >= 0) {
        matches.push({ offset, term });
      }
    });

    if (!matches.length) {
      if (element.firstElementChild?.nodeName === 'A') {
        element.firstElementChild.removeAttribute('href');
      }
      return;
    }

    matches.sort((a, b) => a.offset - b.offset);
    let currentIndex = 0;
    const fragment = matches.reduce((acc, { offset, term }) => {
      const textBefore = textContent.substring(currentIndex, offset);
      if (textBefore) {
        acc.appendChild(document.createTextNode(textBefore));
      }
      const markedTerm = createTag('mark', { class: 'gnav-search-highlight' }, term);
      acc.appendChild(markedTerm);
      currentIndex = offset + term.length;
      return acc;
    }, document.createDocumentFragment());
    const textAfter = textContent.substring(currentIndex);
    if (textAfter) {
      fragment.appendChild(document.createTextNode(textAfter));
    }
    element.innerHTML = '';
    element.appendChild(fragment);
  });
}

async function fetchResults(signal, terms) {
  let data = [];
  let complete = false;
  const hits = [];
  if (!articles.length) {
    ({ data } = await fetchBlogArticleIndex());
    articles = data;
  }
  while (hits.length < LIMIT && !complete && !signal.aborted) {
    articles.forEach((article) => {
      if (hits.length === LIMIT) {
        return;
      }
      const { category } = getArticleTaxonomy(article);
      const text = [category, article.title, article.description].join(' ').toLowerCase();
      if (terms.every((term) => text.includes(term))) {
        hits.push(article);
      }
    });
    if (hits.length < LIMIT && !complete) {
      ({ data, complete } = await fetchBlogArticleIndex());
    }
  }
  return hits;
}

export default async function onSearchInput({ value, resultsEl, searchInputEl, advancedSearchEl }) {
  if (!value.length) {
    resultsEl.innerHTML = '';
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  resultsEl.classList.remove('no-results');
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  lastSearch = {};
  const currentSearch = lastSearch;

  const terms = value.toLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return;

  const hits = await fetchResults(abortController.signal, terms);

  if (currentSearch === lastSearch) {
    if (!hits.length) {
      const noResults = await replaceKey('no-results', getConfig());
      const emptyMessage = createTag('p', {}, noResults);
      let emptyList = createTag('li', null, emptyMessage);
      if (advancedSearchEl) {
        const advancedLink = advancedSearchEl.querySelector('a');
        const href = new URL(advancedLink.href);
        href.searchParams.set('q', value);
        advancedLink.href = href.toString();
        emptyList = advancedSearchEl;
      }
      resultsEl.replaceChildren(emptyList);
      resultsEl.classList.add('no-results');
      return;
    }

    const fragment = document.createDocumentFragment();
    hits.forEach((hit) => {
      const card = buildArticleCard(hit);
      const listItemEl = createTag('li', null, card);
      fragment.appendChild(listItemEl);
    });
    resultsEl.innerHTML = '';
    resultsEl.appendChild(fragment);

    highlightTextElements(terms, resultsEl.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
  }
}
