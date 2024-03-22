import { fetchBlogArticleIndex } from '../article-feed/article-feed.js';
import { getArticleTaxonomy, buildArticleCard } from '../article-feed/article-helpers.js';
import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const LIMIT = 12;
let abortController;
let articles = [];
let complete = false;

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    const matches = [];
    const { textContent } = element;
    terms.forEach((term) => {
      const offset = textContent.toLowerCase().indexOf(term.toLowerCase());
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
      if (textBefore === ' ') {
        acc.appendChild(createTag('span', null, ' '));
      }
      if (textBefore && textBefore !== ' ') {
        acc.appendChild(document.createTextNode(textBefore));
      }
      const endIndex = offset + term.length;
      const termText = textContent.substring(offset, endIndex);
      const markedTerm = createTag('mark', { class: 'gnav-search-highlight' }, termText);
      acc.appendChild(markedTerm);
      currentIndex = endIndex;
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

async function getResults(signal, terms, config, resultsEl, dataSegment, prevHits) {
  const data = dataSegment || articles;
  const hits = prevHits || [];

  for (const article of data) {
    if (hits.length === LIMIT || signal.aborted) break;
    const { category } = getArticleTaxonomy(article);
    const text = [category, article.title, article.description].join(' ').toLowerCase();
    if (terms.every((term) => text.includes(term))) {
      const card = buildArticleCard(article);
      const listItemEl = createTag('li', null, card);
      resultsEl.append(listItemEl);
      highlightTextElements(terms, listItemEl.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
      hits.push(article);
    }
  }

  const noArticles = !articles.length;
  const getMoreArticles = noArticles || (hits.length !== LIMIT && !complete);

  if (!signal.aborted && getMoreArticles) {
    const fetchLimit = noArticles ? 500 : 10000;
    const index = await fetchBlogArticleIndex(config, fetchLimit);
    articles = index.data;
    complete = index.complete;
    const newDataSet = data.length === 0 ? index.data : index.offsetData;
    hits.push(...await getResults(signal, terms, config, resultsEl, newDataSet, hits));
  }

  return hits;
}

export default async function onSearchInput(
  { value, resultsEl, searchInputEl, advancedSearchEl, contextualConfig: config },
) {
  resultsEl.innerHTML = '';
  if (!value.length) {
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  resultsEl.classList.remove('no-results');
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  const terms = value.toLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return;

  const hits = await getResults(abortController.signal, terms, config, resultsEl);

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
  }
}
