import { fetchBlogArticleIndex } from '../article-feed/article-feed.js';
import { getArticleTaxonomy, buildArticleCard } from '../article-feed/article-helpers.js';
import { createTag } from '../../utils/utils.js';

const LIMIT = 12;

function highlightTextElements(terms, elements) {
  elements.forEach((element) => {
    const matches = [];
    const { textContent } = element;
    const lowerCaseTextContent = textContent.toLowerCase();
    terms.forEach((term) => {
      const offset = lowerCaseTextContent.indexOf(term.toLowerCase());
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

export default async function onSearchInput({ value, resultsEl, searchInputEl, advancedSearchEl }) {
  if (!value.length) {
    resultsEl.innerHTML = '';
    searchInputEl.classList.remove('gnav-search-input--isPopulated');
    return;
  }

  resultsEl.classList.remove('no-results');
  searchInputEl.classList.add('gnav-search-input--isPopulated');

  const terms = value.toLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return;

  const { data: articles } = await fetchBlogArticleIndex();
  const hits = articles.reduce((acc, article) => {
    if (acc.length === LIMIT) {
      return acc;
    }

    const { category } = getArticleTaxonomy(article);
    const text = [category, article.title, article.description].join(' ').toLowerCase();

    if (terms.every((term) => text.includes(term))) {
      acc.push(article);
    }

    return acc;
  }, []);

  if (!hits.length) {
    const advancedLink = advancedSearchEl.querySelector('a');
    const href = new URL(advancedLink.href);
    href.searchParams.set('q', value);
    advancedLink.href = href.toString();

    resultsEl.replaceChildren(advancedSearchEl);
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
