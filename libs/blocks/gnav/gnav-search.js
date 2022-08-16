import { getConfig, getMetadata, createTag } from '../../utils/utils.js';

/**
 * Returns a picture element with webp and fallbacks
 * @param {string} src The image URL
 * @param {boolean} eager load image eager
 * @param {Array} breakpoints breakpoints and corresponding params (eg. width)
 */
export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  const { pathname } = url;
  const ext = pathname.substring(pathname.lastIndexOf('.') + 1);

  // webp
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });

  // fallback
  breakpoints.forEach((br, i) => {
    if (i < breakpoints.length - 1) {
      const source = document.createElement('source');
      if (br.media) source.setAttribute('media', br.media);
      source.setAttribute('srcset', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
      picture.appendChild(source);
    } else {
      const img = document.createElement('img');
      img.setAttribute('loading', eager ? 'eager' : 'lazy');
      img.setAttribute('alt', alt);
      picture.appendChild(img);
      img.setAttribute('src', `${pathname}?width=${br.width}&format=${ext}&optimize=medium`);
    }
  });

  return picture;
}

function decorateCard(hit) {
  const { title, description, image, category } = hit;
  const path = hit.path.split('.')[0];
  const picture = createOptimizedPicture(image, title, false, [{ width: '750' }]);
  const pictureTag = picture.outerHTML;
  const html = `
  <div class="article-card-image">${pictureTag}</div>
  <div class="article-card-body">
    <p class="article-card-category">${category}</p>
    <h3>${title}</h3>
    <p>${description}</p>
  </div>`;
  return createTag('a', { class: 'article-card', href: path }, html);
}

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

export async function addSegmentToIndex(url, index, pageSize) {
  const resp = await fetch(url);
  if (resp.status !== '200') {
    window.blogIndex.complete = true;
    return;
  }
  const json = await resp.json();
  const complete = (json.limit + json.offset) === json.total;
  json.data.forEach((post) => {
    index.data.push(post);
    index.byPath[post.path.split('.')[0]] = post;
  });
  index.complete = complete;
  index.offset = json.offset + pageSize;
}

/**
 * fetches blog article index.
 * @returns {object} index with data and path lookup
 */
export async function fetchBlogArticleIndex() {
  const { contentRoot } = getConfig();
  const url = getMetadata('search-index-source') || `${contentRoot}/query-index.json`;
  const pageSize = 1000;
  window.blogIndex = window.blogIndex || {
    data: [],
    byPath: {},
    offset: 0,
    complete: false,
  };

  if (window.blogIndex.complete) return (window.blogIndex);
  const index = window.blogIndex;
  const { offset } = index;
  await addSegmentToIndex(`${url}/?limit=${pageSize}&offset=${offset}`, index, pageSize);
  index.data.sort((a, b) => b.date - a.date);

  return (index);
}

async function populateSearchResults(searchTerms, resultsContainer) {
  const limit = 12;
  const terms = searchTerms.toLowerCase().split(' ').map((e) => e.trim()).filter((e) => !!e);
  resultsContainer.innerHTML = '';

  if (terms.length) {
    await fetchBlogArticleIndex();

    const articles = window.blogIndex.data;

    const hits = [];
    let i = 0;
    for (; i < articles.length; i += 1) {
      const e = articles[i];
      const text = [e.category, e.title, e.teaser].join(' ').toLowerCase();

      if (terms.every((term) => text.includes(term))) {
        if (hits.length === limit) {
          break;
        }
        hits.push(e);
      }
    }

    hits.forEach((hit) => {
      const card = decorateCard(hit);
      resultsContainer.appendChild(card);
    });

    if (!hits.length) {
      resultsContainer.classList.add('no-Results');
    } else {
      resultsContainer.classList.remove('no-Results');
    }

    highlightTextElements(terms, resultsContainer.querySelectorAll('h3, .article-card-category, .article-card-body > p'));
  }
}

export default function onSearchInput(value, resultsContainer, advancedLink) {
  populateSearchResults(value, resultsContainer);
  if (advancedLink) {
    const href = new URL(advancedLink.href);
    href.searchParams.set('q', value);
    advancedLink.href = href.toString();
  }
}
