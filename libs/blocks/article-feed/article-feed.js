import {
  stamp,
  getTaxonomyModule,
  loadTaxonomy,
  getArticleTaxonomy,
  buildArticleCard,
} from './article-helpers.js';

import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const replacePlaceholder = async (key) => replaceKey(key, getConfig());

const blogIndex = {
  data: [],
  byPath: {},
  offset: 0,
  complete: false,
};

/**
 * Sanitizes a name for use as class name.
 * @param {*} name The unsanitized name
 * @returns {string} The class name
 */
function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

/**
 * Extracts the config from a block.
 * @param {Element} block The block element
 * @returns {object} The block config
 */
export function readBlockConfig(block) {
  return [...block.querySelectorAll(':scope>div')].reduce((config, row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const valueEl = cols[1];
        const name = toClassName(cols[0].textContent);
        if (valueEl.querySelector('a')) {
          const aArr = [...valueEl.querySelectorAll('a')];
          if (aArr.length === 1) {
            config[name] = aArr[0].href;
          } else {
            config[name] = aArr.map((a) => a.href);
          }
        } else if (valueEl.querySelector('p')) {
          const pArr = [...valueEl.querySelectorAll('p')];
          if (pArr.length === 1) {
            config[name] = pArr[0].textContent;
          } else {
            config[name] = pArr.map((p) => p.textContent);
          }
        } else config[name] = row.children[1].textContent;
      }
    }

    return config;
  }, {});
}

/**
 * fetches blog article index.
 * @returns {object} index with data and path lookup
 */
export async function fetchBlogArticleIndex() {
  const pageSize = 500;

  if (blogIndex.complete) return (blogIndex);

  return fetch(`${getConfig().locale.contentRoot}/query-index.json?limit=${pageSize}&offset=${blogIndex.offset}`)
    .then((response) => response.json())
    .then((json) => {
      const complete = (json.limit + json.offset) === json.total;
      json.data.forEach((post) => {
        blogIndex.data.push(post);
        blogIndex.byPath[post.path.split('.')[0]] = post;
      });
      blogIndex.complete = complete;
      blogIndex.offset = json.offset + pageSize;

      return blogIndex;
    });
}

function isCardOnPage(article) {
  const path = article.path.split('.')[0];
  /* using recommended and featured articles */
  return !!document.querySelector(`.featured-article a.featured-article-card[href="${path}"], .recommended-articles a.article-card[href="${path}"]`);
}

function closeMenu(el) {
  el.setAttribute('aria-expanded', false);
}

function openMenu(el) {
  const expandedMenu = document.querySelector('.filter-button[aria-expanded=true]');
  if (expandedMenu) { closeMenu(expandedMenu); }
  el.setAttribute('aria-expanded', true);
}

function filterSearch(e) {
  const { target } = e;
  const { value } = target;
  const parent = target.parentElement.parentElement;
  parent.querySelectorAll('.filter-option').forEach((option) => {
    if (!value.length || option.textContent.toLowerCase().includes(value)) {
      option.classList.remove('hide');
    } else {
      option.classList.add('hide');
    }
  });
}

function enableSearch(id) {
  const menu = document.querySelector(`[aria-labelledby='${id}']`);
  const input = menu.querySelector('input');
  input.addEventListener('keyup', filterSearch);
}

function disableSearch(id) {
  const menu = document.querySelector(`[aria-labelledby='${id}']`);
  const input = menu.querySelector('input');
  input.value = '';
  const parent = input.parentElement.parentElement;
  parent.querySelectorAll('.filter-option').forEach((option) => {
    option.classList.remove('hide');
  });
  input.removeEventListener('keyup', filterSearch);
}

function closeOnDocClick(e) {
  const { target } = e;
  const curtain = document.querySelector('.filter-curtain');
  if (target === curtain) {
    const open = document.querySelector('.filter-button[aria-expanded=true]');
    closeMenu(open);
    disableSearch(open.id);
    curtain.classList.add('hide');
  }
}

function closeCurtain() {
  const curtain = document.querySelector('.filter-curtain');
  curtain.classList.add('hide');
  window.removeEventListener('click', closeOnDocClick);
}

function openCurtain() {
  const curtain = document.querySelector('.filter-curtain');
  curtain.classList.remove('hide');
  window.addEventListener('click', closeOnDocClick);
}

function toggleMenu(e) {
  const button = e.target.closest('[role=button]');
  const expanded = button.getAttribute('aria-expanded');
  if (expanded === 'true') {
    closeMenu(button);
    disableSearch(button.id);
    closeCurtain();
  } else {
    openMenu(button);
    enableSearch(button.id);
    openCurtain();
  }
}

function buildSelectedFilter(name) {
  const a = document.createElement('a');
  a.classList.add('selected-filter');
  a.setAttribute('tabindex', 0);
  a.textContent = name;
  return a;
}

function clearFilter(e, block, config) {
  const { target } = e;
  const checked = document
    .querySelector(`input[name='${target.textContent}']`);
  if (checked) { checked.checked = false; }
  delete config.selectedProducts;
  delete config.selectedIndustries;
  // eslint-disable-next-line no-use-before-define
  applyCurrentFilters(block, config);
}

function applyCurrentFilters(block, config, close) {
  const filters = {};
  document.querySelectorAll('.filter-options').forEach((filter) => {
    const type = filter.getAttribute('data-type');
    const subfilters = [];
    filter.querySelectorAll('input[type=checkbox]').forEach((box) => {
      if (box.checked) {
        const boxType = box.parentElement.parentElement.getAttribute('data-type');
        const capBoxType = boxType.charAt(0).toUpperCase() + boxType.slice(1);
        subfilters.push(box.name);
        if (config[`selected${capBoxType}`]) {
          config[`selected${capBoxType}`] += `, ${box.name}`;
        } else {
          config[`selected${capBoxType}`] = box.name;
        }
      }
    });
    if (subfilters.length) {
      filters[type] = subfilters;
    }
    if (close) {
      const id = filter.parentElement.getAttribute('aria-labelledby');
      const dropdown = document.getElementById(id);
      closeMenu(dropdown);
    }
  });
  const selectedContainer = document.querySelector('.selected-container');
  const selectedFilters = selectedContainer.querySelector('.selected-filters');
  selectedFilters.innerHTML = '';

  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filter) => {
      filters[filter].forEach((f) => {
        const selectedFilter = buildSelectedFilter(f);
        selectedFilter.addEventListener('click', (e) => {
          clearFilter(e, block, config);
        });
        selectedFilters.append(selectedFilter);
      });
    });
    selectedContainer.classList.remove('hide');
  } else {
    selectedContainer.classList.add('hide');
  }
  if (block) {
    block.innerHTML = '';
    // eslint-disable-next-line no-use-before-define
    decorateArticleFeed(block, config);
  }
}

function clearFilters(e, block, config) {
  const type = e.target.classList[e.target.classList.length - 1];
  let target = document;
  if (type === 'reset') {
    target = e.target.parentNode.parentNode;
  }
  const dropdowns = target.querySelectorAll('.filter-options');
  dropdowns.forEach((dropdown) => {
    const checked = dropdown.querySelectorAll('input:checked');
    checked.forEach((box) => { box.checked = false; });
  });
  delete config.selectedProducts;
  delete config.selectedIndustries;
  applyCurrentFilters(block, config);
}

function buildFilterOption(itemName, type) {
  const name = itemName.replace(/\*/gm, '');

  const option = document.createElement('li');
  option.classList
    .add('filter-option', `filter-option-${type}`);

  const checkbox = document.createElement('input');
  checkbox.id = name;
  checkbox.setAttribute('name', name);
  checkbox.setAttribute('type', 'checkbox');

  const label = document.createElement('label');
  label.setAttribute('for', name);
  label.textContent = name;

  option.append(checkbox, label);
  return option;
}

async function buildFilter(type, tax, block, config) {
  const container = createTag('div', { class: 'filter' });

  const button = document.createElement('a');
  button.classList.add('filter-button');
  button.id = `${type}-filter-button`;
  button.setAttribute('aria-haspopup', true);
  button.setAttribute('aria-expanded', false);
  button.setAttribute('role', 'button');
  button.textContent = tax.getCategoryTitle(type);
  button.addEventListener('click', toggleMenu);

  const dropdown = createTag('div', { class: 'filter-dropdown' });
  dropdown.setAttribute('aria-labelledby', `${type}-filter-button`);
  dropdown.setAttribute('role', 'menu');

  const SEARCH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false">
    <path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path>
  </svg>`;
  const searchBar = createTag('div', { class: 'filter-search' });
  searchBar.insertAdjacentHTML('afterbegin', SEARCH_ICON);
  const searchField = document.createElement('input');
  searchField.setAttribute('id', `${type}-filter-search`);
  searchField.setAttribute('aria-label', await replacePlaceholder('search'));
  searchField.setAttribute('placeholder', await replacePlaceholder('search'));
  searchBar.append(searchField);

  const options = document.createElement('ul');
  options.classList.add('filter-options');
  options.setAttribute('data-type', type);
  const category = tax.getCategory(tax[`${type.toUpperCase()}`]);
  category.forEach((topic) => {
    const item = tax.get(topic, tax[`${type.toUpperCase()}`]);
    if (item.level === 1) {
      const option = buildFilterOption(item.name, 'primary');
      options.append(option);
      item.children.forEach((child) => {
        const nestedOption = buildFilterOption(child, 'nested');
        options.append(nestedOption);
      });
    }
  });

  const footer = createTag('div', { class: 'filter-dropdown-footer' });

  const resetBtn = document.createElement('a');
  resetBtn.classList.add('button', 'small', 'reset');
  resetBtn.textContent = await replacePlaceholder('reset');
  resetBtn.addEventListener('click', clearFilters);

  const applyBtn = document.createElement('a');
  applyBtn.classList.add('button', 'small', 'apply');
  applyBtn.textContent = await replacePlaceholder('apply');
  applyBtn.addEventListener('click', () => {
    // sampleRUM('apply-topic-filter');
    delete config.selectedProducts;
    delete config.selectedIndustries;
    closeCurtain();
    disableSearch(`${type}-filter-button`);
    applyCurrentFilters(block, config, 'close');
  });

  footer.append(resetBtn, applyBtn);

  dropdown.append(searchBar, options, footer);
  container.append(button, dropdown);
  return container;
}

const isInList = (list, val) => list && list.map((t) => t.toLowerCase()).includes(val);

async function filterArticles(config, feed, limit, offset) {
  /* filter posts by category, tag and author */
  const FILTER_NAMES = ['tags', 'topics', 'selectedProducts', 'selectedIndustries', 'author', 'category', 'exclude'];

  const filters = Object.keys(config).reduce((prev, key) => {
    if (FILTER_NAMES.includes(key)) {
      prev[key] = config[key].split(',').map((e) => e.toLowerCase().trim());
    }

    return prev;
  }, {});

  while ((feed.data.length < limit + offset) && (!feed.complete)) {
    const beforeLoading = new Date();
    // eslint-disable-next-line no-await-in-loop
    const index = await fetchBlogArticleIndex();
    const indexChunk = index.data.slice(feed.cursor);

    const beforeFiltering = new Date();

    const KEYWORDS = ['exclude', 'tags', 'topics'];
    const SELECTED = ['selectedProducts', 'selectedIndustries'];

    /* filter and ignore if already in result */
    const feedChunk = indexChunk.filter((article) => {
      const articleTaxonomy = getArticleTaxonomy(article);

      const matchedAll = Object.keys(filters).every((key) => {
        if (KEYWORDS.includes(key)) {
          const matchedFilter = filters[key]
            .some((val) => (isInList(articleTaxonomy?.allTopics, val)));
          return key === 'exclude' ? !matchedFilter : matchedFilter;
        }
        if (SELECTED.includes(key)) {
          if (filters.selectedProducts && filters.selectedIndustries) {
            // match product && industry
            const matchProduct = filters.selectedProducts
              .some((val) => (isInList(articleTaxonomy?.allTopics, val)));
            const matchIndustry = filters.selectedIndustries
              .some((val) => (isInList(articleTaxonomy?.allTopics, val)));
            return matchProduct && matchIndustry;
          }
          const matchedFilter = filters[key]
            .some((val) => isInList(articleTaxonomy.allTopics, val));
          return matchedFilter;
        }
        const matchedFilter = filters[key].some((val) => isInList([article[key]], val));
        return matchedFilter;
      });

      return (matchedAll && !isCardOnPage(article));
    });

    stamp(`chunk measurements - loading: ${beforeFiltering - beforeLoading}ms filtering: ${new Date() - beforeFiltering}ms`);

    feed.cursor = index.data.length;
    feed.complete = index.complete;
    feed.data = [...feed.data, ...feedChunk];
  }
}

async function decorateArticleFeed(
  articleFeedEl,
  config,
  offset = 0,
  feed = { data: [], complete: false, cursor: 0 },
  limit = 12,
) {
  let articleCards = articleFeedEl.querySelector('.article-cards');

  if (!articleCards) {
    articleCards = createTag('div', { class: 'article-cards' });
    articleFeedEl.append(articleCards);
  }

  const container = createTag('div', { class: 'article-cards-empty' });

  // display spinner
  const spinner = createTag('div', { class: 'spinner' });
  container.append(spinner);
  articleCards.append(container);

  const pageEnd = offset + limit;
  await filterArticles(config, feed, limit, offset);
  const articles = feed.data;

  if (articles.length) {
    // results were found
    container.remove();
  } else if (config.selectedProducts || config.selectedIndustries) {
    // no user filtered results were found
    spinner.remove();
    const noMatches = document.createElement('p');
    noMatches.innerHTML = `<strong>${await replacePlaceholder('no-matches')}</strong>`;
    const userHelp = document.createElement('p');
    userHelp.classList.add('article-cards-empty-filtered');
    userHelp.textContent = await replacePlaceholder('user-help');
    container.append(noMatches, userHelp);
  } else {
    // no results were found
    spinner.remove();
    const noResults = document.createElement('p');
    noResults.innerHTML = `<strong>${await replacePlaceholder('no-results')}</strong>`;
    container.append(noResults);
  }
  const max = pageEnd > articles.length ? articles.length : pageEnd;
  for (let i = offset; i < max; i += 1) {
    const article = articles[i];
    const card = buildArticleCard(article);
    articleCards.append(card);
  }
  if (articles.length > pageEnd || !feed.complete) {
    const loadMore = document.createElement('a');
    loadMore.className = 'load-more button small primary light';
    loadMore.href = '#';
    loadMore.textContent = await replacePlaceholder('load-more');
    articleFeedEl.append(loadMore);
    loadMore.addEventListener('click', (event) => {
      event.preventDefault();
      loadMore.remove();
      decorateArticleFeed(articleFeedEl, config, pageEnd, feed);
    });
  }
  articleFeedEl.classList.add('appear');
}

async function decorateFeedFilter(articleFeedEl, config) {
  const taxonomy = getTaxonomyModule();
  const parent = document.querySelector('.article-feed-container');

  const curtain = createTag('div', { class: 'filter-curtain hide' });
  document.querySelector('main').append(curtain);

  // FILTER CONTAINER
  const filterContainer = createTag('div', { class: 'filter-container' });
  const filterWrapper = createTag('div');

  const filterText = document.createElement('p');
  filterText.classList.add('filter-text');
  filterText.textContent = await replacePlaceholder('filters');

  const productsDropdown = buildFilter('products', taxonomy, articleFeedEl, config);
  const industriesDropdown = buildFilter('industries', taxonomy, articleFeedEl, config);

  filterWrapper.append(filterText, productsDropdown, industriesDropdown);
  filterContainer.append(filterWrapper);

  parent.parentElement.insertBefore(filterContainer, parent);

  // SELECTED CONTAINER
  const selectedContainer = createTag('div', { class: 'selected-container hide' });
  const selectedWrapper = createTag('div');

  const selectedText = document.createElement('p');
  selectedText.classList.add('selected-text');
  selectedText.textContent = await replacePlaceholder('showing-articles-for');

  const selectedCategories = document.createElement('span');
  selectedCategories.classList.add('selected-filters');

  const clearBtn = document.createElement('a');
  clearBtn.classList.add('button', 'small', 'clear');
  clearBtn.textContent = await replacePlaceholder('clear-all');
  clearBtn.addEventListener(
    'click',
    (e) => clearFilters(e, articleFeedEl, config),
  );

  selectedWrapper.append(selectedText, selectedCategories, clearBtn);
  selectedContainer.append(selectedWrapper);
  parent.parentElement.insertBefore(selectedContainer, parent);
}

const clearBlock = (block) => { block.innerHTML = ''; };

export default async function init(articleFeed) {
  const config = readBlockConfig(articleFeed);
  clearBlock(articleFeed);
  loadTaxonomy();
  if (config.filters) {
    decorateFeedFilter(articleFeed, config);
  }
  decorateArticleFeed(articleFeed, config);
}
