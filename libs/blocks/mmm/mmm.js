import { createTag, loadStyle } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from '../../features/personalization/personalization.js';
import { getMepPopup, API_URLS } from '../../features/personalization/preview.js';

const SEARCH_CRITERIA_CHANGE_EVENT = 'mmm-search-change';
let cachedSearchCriteria = '';
export const DEBOUNCE_TIME = 800;
export const MMM_LOCAL_STORAGE_KEY = 'mmm_filter_settings';
export const MMM_REPORT_LOCAL_STORAGE_KEY = 'mmm_report_filter_settings';
const SEARCH_CONTAINER = '.mmm-search-container';
const LAST_SEEN_OPTIONS = {
  day: { value: 'Day', key: 'day' },
  week: { value: 'Week', key: 'week' },
  month: { value: 'Month', key: 'month' },
  threeMonths: { value: '3 Months', key: 'threeMonths' },
  sixMonths: { value: '6 Months', key: 'sixMonths' },
  year: { value: 'Year', key: 'year' },
  all: { value: 'All', key: 'all' },
};
const SUBDOMAIN_OPTIONS = {
  www: { value: 'www', key: 'www' },
  business: { value: 'business', key: 'business' },
  all: { value: 'all', key: 'all' },
};

let isReport = false;

export const getLocalStorageFilter = () => {
  const cookie = localStorage.getItem(isReport
    ? MMM_REPORT_LOCAL_STORAGE_KEY
    : MMM_LOCAL_STORAGE_KEY);
  return cookie ? JSON.parse(cookie) : null;
};

const setLocalStorageFilter = (obj) => {
  localStorage.setItem(isReport
    ? MMM_REPORT_LOCAL_STORAGE_KEY
    : MMM_LOCAL_STORAGE_KEY, JSON.stringify(obj));
};

const getInitialValues = () => {
  const search = new URLSearchParams(window.location.search);
  const values = {};
  if (search.size) {
    search.entries().forEach((item) => {
      const key = item[0];
      const value = item[1];
      values[key] = value;
    });
    return values;
  }
  return getLocalStorageFilter();
};

const SEARCH_INITIAL_VALUES = () => getInitialValues() ?? {
  lastSeenManifest: isReport ? LAST_SEEN_OPTIONS.week.key : LAST_SEEN_OPTIONS.threeMonths.key,
  pageNum: 1,
  subdomain: SUBDOMAIN_OPTIONS.www.key,
  perPage: 25,
};

async function toggleDrawer(target, dd, pageId) {
  const el = target.closest('button');
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    document.querySelectorAll('dd:not([hidden])').forEach((openDd) => {
      openDd.setAttribute('hidden', '');
    });
    document.querySelectorAll('dt button[aria-expanded="true"]').forEach((openButton) => {
      openButton.setAttribute('aria-expanded', 'false');
    });
    el.setAttribute('aria-expanded', 'true');
    dd.removeAttribute('hidden');
    const loading = dd.querySelector('.loading');
    if (dd.classList.contains('placeholder-resolved') || !loading) return;
    const pageData = await fetchData(`${API_URLS.pageDetails}${pageId}`, DATA_TYPE.JSON);
    loading.replaceWith(getMepPopup(pageData, true));
    dd.classList.add('placeholder-resolved');
  }
}

function createButtonDetailsPair(mmmEl, page) {
  const { url, pageId, numOfActivities } = page;
  const triggerId = `mmm-trigger-${pageId}`;
  const panelId = `mmm-content-${pageId}`;
  const icon = createTag('span', { class: 'mmm-icon' });
  const hTag = createTag('h5', false, url);
  const activitiesNum = createTag(
    'span',
    { class: 'mmm-page_item-subtext' },
    `${numOfActivities} Manifest(s) found`,
  );
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'mmm-trigger tracking-header',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  }, hTag);
  button.append(icon);
  button.append(activitiesNum);

  const dtHtml = hTag ? createTag(hTag.tagName, { class: 'mmm-heading' }, button) : button;
  const dt = createTag('dt', false, dtHtml);
  const loading = createTag(
    'div',
    { class: 'loading' },
    `<svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
        <circle fill="currentColor" stroke="none" cx="6" cy="50" r="6">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"></animateTransform>
        </circle>
        <circle fill="currentColor" stroke="none" cx="30" cy="50" r="6">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"></animateTransform>
        </circle>
        <circle fill="currentColor" stroke="none" cx="54" cy="50" r="6">
          <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"></animateTransform>
        </circle>
      </svg>`,
  );
  const dd = createTag('dd', { id: panelId, hidden: true }, loading);
  button.addEventListener('click', (e) => { toggleDrawer(e.target, dd, pageId, 'mmm'); });
  mmmEl.append(dt, dd);
}

/**
 * This function should be fired by any search criteria field change event
 * Or by page number change event
 * @param {Number} pageNum - optional. Number of the clicked page.
 * @param {Event} event - optional. Page number click Event object.
 */
function filterPageList(pageNum, perPage, event) {
  const shareUrl = new URL(`${window.location.origin}${window.location.pathname}`);
  const searchValues = {};
  const activeSearchWithShortKeyword = event?.target?.value && event.target.value.length < 2;

  document.querySelector(SEARCH_CONTAINER).querySelectorAll('input, select, textarea').forEach((field) => {
    const id = field.getAttribute('id').split('-').pop();
    const { value, tagName } = field;
    searchValues[id] = {
      value,
      tagName,
    };
    if (value) shareUrl.searchParams.set(id, value);
  });

  // add pageNum and perPage to args for api call
  searchValues.pageNum = { value: pageNum || 1, tagName: 'A' };
  searchValues.perPage = { value: perPage || 25, tagName: 'SELECT' };

  // assemble event details object with all filter criterias
  const detail = {};
  Object.keys(searchValues).forEach((key) => {
    let { value } = searchValues[key];
    if (value.replace) {
      value = value.replace(',', '');
      value = value.replace(/\n/g, ',\n');
    }
    detail[key] = value;
  });
  // This event triggers an API call with most recent search criteria and a forces a re-render
  if (!activeSearchWithShortKeyword) {
    setLocalStorageFilter(detail);
    document.dispatchEvent(new CustomEvent(SEARCH_CRITERIA_CHANGE_EVENT, { detail }));
  }

  document.querySelectorAll('button.copy-to-clipboard').forEach((button) => {
    button.dataset.destination = shareUrl.href;
  });
}

function parseData(el) {
  const data = {};
  const rows = el.querySelectorAll('div');
  let currentKey = '';
  rows.forEach((row) => {
    const cols = row.querySelectorAll('div');
    if (cols.length < 2) return;
    const val = cols[1].innerText.trim();
    let key = cols[0].innerText.toLowerCase().replace(/\s+/g, '');
    if (key.startsWith('menu')) {
      key = key.split(':')[1].trim();
      currentKey = key;
      data[key] = {
        label: val,
        options: {},
      };
      return;
    }
    if (data[currentKey]) data[currentKey].options[key] = val;
  });
  return data;
}

function createShareButton() {
  const div = createTag(
    'div',
    { class: 'share-mmm' },
  );
  const buttonLabel = 'Copy link to these search settings';
  const button = createTag(
    'button',
    {
      type: 'button',
      class: 'copy-to-clipboard',
      'aria-label': buttonLabel,
      'data-copy-to-clipboard': buttonLabel,
      'data-copied': 'Copied!',
    },
    `<svg viewBox="0 0 37 37" style="enable-background:new 0 0 37 37" xml:space="preserve" class="icon icon-clipboard">
      <path fill="currentColor" d="M31 0H6C2.7 0 0 2.7 0 6v25c0 3.3 2.7 6 6 6h25c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zM15.34 30.58a6.296 6.296 0 0 1-8.83 0c-2.48-2.44-2.52-6.43-.08-8.91l6.31-6.31a6.423 6.423 0 0 1 9.01-.04c.43.43.79.93 1.08 1.47l-1.52 1.51c-.11.11-.24.2-.38.28a3.68 3.68 0 0 0-3.32-2.44c-1.1-.04-2.17.37-2.96 1.13l-6.31 6.31a3.591 3.591 0 0 0 0 5.09 3.591 3.591 0 0 0 5.09 0c.19-.19 2.81-2.85 3.26-3.3 1.04.43 2.16.61 3.29.53-.96.95-4.31 4.34-4.64 4.68zm15.19-15.2-5.94 5.94c-2.54 2.57-6.63 2.73-9.38.38-.43-.43-.79-.93-1.08-1.47l1.44-1.5a2 2 0 0 1 .37-.28c.24.56.61 1.05 1.09 1.43.64.62 1.49.97 2.37.97 1.1.04 2.17-.37 2.96-1.14l6.26-6.26a3.591 3.591 0 0 0 0-5.09 3.591 3.591 0 0 0-5.09 0c-.19.19-2.87 2.83-3.32 3.29a7.267 7.267 0 0 0-3.29-.53c.96-.96 4.36-4.32 4.7-4.66a6.301 6.301 0 0 1 8.91 0l.01.01c2.46 2.47 2.46 6.46-.01 8.91z"></path>
    </svg>`,
  );
  // set initial destination
  button.dataset.destination = document.location.href;
  div.append(button);
  button.addEventListener('click', (e) => {
    /* c8 ignore start */
    e.preventDefault();
    navigator.clipboard.writeText(button.dataset.destination).then(() => {
      button.classList.add('copy-to-clipboard-copied');
      setTimeout(() => document.activeElement.blur(), 500);
      setTimeout(
        () => button.classList.remove('copy-to-clipboard-copied'),
        2000,
      );
    });
    /* c8 ignore end */
  });
  return div;
}

function createDropdowns(data) {
  const searchContainer = document.querySelector(SEARCH_CONTAINER);
  const dropdownForm = createTag(
    'div',
    { id: 'mmm-dropdown-container', class: 'mmm-form-container' },
  );
  searchContainer.append(dropdownForm);
  const dropdownSubContainer = createTag('div', { id: 'mmm-dropdown-sub-container' });
  dropdownForm.append(dropdownSubContainer);
  dropdownForm.append(createShareButton());
  Object.keys(data).forEach((key) => {
    const { label, options } = data[key];
    const container = createTag('div');
    dropdownSubContainer.append(container);
    container.append(createTag('label', { for: `mmm-dropdown-${key}` }, `${label}:`));
    const select = createTag('select', { id: `mmm-dropdown-${key}` });
    container.append(select);
    select.append(createTag('option', { value: '' }, 'Show all'));
    Object.keys(options).forEach((option) => {
      const optionEl = createTag('option', { value: option }, options[option]);
      select.append(optionEl);
      const startingVal = SEARCH_INITIAL_VALUES()[key];
      if (startingVal === option) optionEl.setAttribute('selected', 'selected');
    });
    select.addEventListener('change', () => filterPageList());
  });
}

function debounce(func) {
  let timeout;
  return (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(event), DEBOUNCE_TIME);
  };
}

function createSearchField() {
  const searchContainer = document.querySelector(SEARCH_CONTAINER);
  const searchForm = createTag(
    'div',
    { id: 'mmm-search-filter-container', class: 'mmm-form-container' },
    `<div>
      <label for="mmm-search-filter">Filter:</label>
      <textarea id="mmm-search-filter" type="text" name="mmm-search-filter" class="text-field-input" placeholder="Search for the full or partial: page URL, manifest URL, manifest experience name or Target activity name"></textarea>
    </div>`,
  );
  searchContainer.append(searchForm);
  const searchField = searchForm.querySelector('textarea');
  searchField.value = SEARCH_INITIAL_VALUES().filter || '';

  searchField.addEventListener('keyup', debounce((event) => filterPageList(null, null, event)));
  searchField.addEventListener('change', debounce((event) => filterPageList(null, null, event)));
  searchField.addEventListener('input', function adjustHeight() {
    this.style.height = 'auto'; /* Reset height to auto to recalculate */
    this.style.height = `${this.scrollHeight - 32}px`;
  });
}

function createLastSeenManifestAndDomainDD() {
  const searchContainer = document.querySelector(SEARCH_CONTAINER);
  const dd = createTag(
    'div',
    { id: 'mmm-dropdown-container', class: 'mmm-form-container' },
    `<div>
      <label for="mmm-lastSeenManifest">Manifests ${isReport ? 'not ' : ''}seen in the last:</label>
      <select id="mmm-lastSeenManifest" type="text" name="mmm-lastSeenManifest" class="text-field-input">
        ${Object.keys(LAST_SEEN_OPTIONS).map((key) => `
          <option value="${LAST_SEEN_OPTIONS[key].key}" ${SEARCH_INITIAL_VALUES().lastSeenManifest === LAST_SEEN_OPTIONS[key].key ? 'selected' : ''}>${LAST_SEEN_OPTIONS[key].value}</option>
        `)}
      </select>
    </div>
    ${!isReport ? `<div>
      <label for="mmm-subdomain">Subdomain:</label>
      <select id="mmm-subdomain" type="text" name="mmm-subdomain" class="text-field-input">
        ${Object.keys(SUBDOMAIN_OPTIONS).map((key) => `
          <option value="${SUBDOMAIN_OPTIONS[key].key}" ${SEARCH_INITIAL_VALUES().subdomain === SUBDOMAIN_OPTIONS[key].key ? 'selected' : ''}>${SUBDOMAIN_OPTIONS[key].value}</option>
        `)}
      </select>
    </div>
    ` : ''}`,
  );
  dd.addEventListener('change', () => filterPageList());
  searchContainer.append(dd);
}

async function createForm(el) {
  const data = parseData(el);
  const searchContainer = createTag('div', { class: SEARCH_CONTAINER.slice(1) });
  document.querySelector('.mmm-container').parentNode.prepend(searchContainer);
  createDropdowns(data);
  createLastSeenManifestAndDomainDD();
  createSearchField();
}

function createPaginationEl({ data, el }) {
  const { pageNum, perPage, totalRecords } = data;
  const arrowIcons = {
    first: '<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.205 10.59L8.61504 6L13.205 1.41L11.795 0L5.79504 6L11.795 12L13.205 10.59ZM0.795044 0H2.79504V12H0.795044V0Z" fill="black"/></svg>',
    prev: '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.70504 1.41L6.29504 0L0.295044 6L6.29504 12L7.70504 10.59L3.12504 6L7.70504 1.41Z" fill="black"/></svg>',
    next: '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.70504 0L0.295044 1.41L4.87504 6L0.295044 10.59L1.70504 12L7.70504 6L1.70504 0Z" fill="black"/></svg>',
    last: '<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.795044 1.41L5.38504 6L0.795044 10.59L2.20504 12L8.20504 6L2.20504 0L0.795044 1.41ZM11.205 0H13.205V12H11.205V0Z" fill="black"/></svg>',
  };
  const paginationEl = createTag('div', {
    id: 'mmm-pagination',
    'data-current-page': pageNum,
    'data-perpage': perPage,
  });
  if (totalRecords) {
    const perPageOptions = [25, 50, 100]; // add more options as needed
    const paginationWrapper = createTag('div', { id: 'mmm-pagination-wrapper' });
    const paginationLabel = createTag(
      'label',
      { for: 'mmm-pagination-dropdown' },
      'Items per page:',
    );
    const paginationDropdown = createTag(
      'select',
      {
        id: 'mmm-pagination-dropdown',
        value: perPage,
      },
    );
    perPageOptions.forEach((option) => paginationDropdown.append(createTag('option', {
      value: option,
      ...(option === perPage ? { selected: 'selected' } : {}),
    }, option)));
    paginationEl.append(paginationWrapper);
    const totalPages = Math.ceil(totalRecords / perPage);
    const prev = pageNum - 1 || 1;
    const next = pageNum < totalPages ? pageNum + 1 : pageNum;
    const firstEl = createTag('a', {
      'data-page-num': '1',
      class: `arrow ${pageNum === 1 ? 'disabled' : ''}`,
    }, arrowIcons.first);
    const prevEl = createTag('a', {
      'data-page-num': prev,
      class: `arrow ${pageNum === 1 ? 'disabled' : ''}`,
    }, arrowIcons.prev);
    const nextEl = createTag('a', {
      'data-page-num': next,
      class: `arrow ${pageNum === totalPages ? 'disabled' : ''}`,
    }, arrowIcons.next);
    const lastEl = createTag('a', {
      'data-page-num': totalPages,
      class: `arrow ${pageNum === totalPages ? 'disabled' : ''}`,
    }, arrowIcons.last);
    const rangeStart = pageNum * perPage - (perPage - 1);
    const rangeEnd = pageNum * perPage < totalRecords ? pageNum * perPage : totalRecords;
    const range = `${rangeStart.toLocaleString()} - ${rangeEnd.toLocaleString()}`;
    const paginationSummary = createTag(
      'div',
      { class: 'mmm-pagination-summary' },
      `<div><span>${range} of ${totalRecords.toLocaleString()}</span><div>`,
    );
    paginationWrapper.append(
      createTag('div', { id: 'pagination-select' }, [paginationLabel, paginationDropdown]),
      createTag('div', { id: 'pagination-arrows' }, [
        firstEl,
        prevEl,
        paginationSummary,
        nextEl,
        lastEl,
      ]),
    );
  } else {
    paginationEl.append(createTag('h5', { id: 'mmm-pagination-no-results' }, 'No results'));
  }
  el.append(paginationEl);
}

function handlePaginationDropdownChange() {
  const paginationEl = document.querySelector('#mmm-pagination');
  paginationEl?.querySelector('select')?.addEventListener('change', (event) => {
    paginationEl.dataset.perpage = event.target.value;
    filterPageList(
      paginationEl.dataset.pageNum,
      paginationEl.dataset.perpage,
      event,
    );
  });
}

function handlePaginationClicks() {
  const paginationEl = document.querySelector('#mmm-pagination');
  paginationEl?.querySelectorAll('a').forEach((item) => {
    item?.addEventListener('click', (event) => {
      paginationEl.dataset.currentPage = item.dataset.pageNum;
      filterPageList(
        item.dataset.pageNum,
        paginationEl.dataset.perpage,
        event,
      );
    });
  });
}

function getDate(inputDate) {
  const date = inputDate || new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', dateOptions);
}
function createReport(el, data) {
  const { result } = data;
  el.innerHTML = `
    <div class="mmm-report">
      <div class="mmm-report-header">
        <span>URL</span>
        <span>Target Status</span>
        <span>Target Seen</span>
        <span>Page Last Seen</span>
      </div>
      <div class="mmm-report-body">
        ${result.map((item) => `
          <div class="mmm-report-row">
            <span><a href="${item.url}?mep" target="_blank">${item.url}</a></span>
            <span>${item.target}</span>
            <span>${getDate(item.aLastSeen)}</span>
            <span>${getDate(item.pLastSeen)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function createPageList(el, search) {
  const paginationEl = document.querySelector('.mmm-pagination');
  paginationEl?.classList.add('mmm-hide');
  const mmmElContainer = createTag('div', { class: 'mmm-container max-width-12-desktop' });
  const mmmEl = createTag('dl', {
    class: 'mmm foreground',
    id: 'mmm',
    role: 'presentation',
  });
  mmmElContainer.append(mmmEl);

  const url = isReport ? API_URLS.report : API_URLS.pageList;
  const response = await fetchData(
    url,
    DATA_TYPE.JSON,
    {
      method: 'POST',
      body: JSON.stringify(search ?? SEARCH_INITIAL_VALUES()),
    },
  );
  if (isReport) {
    createReport(mmmEl, response);
  } else {
    response.result?.map((page) => createButtonDetailsPair(mmmEl, page));
  }
  const section = createTag('div', { id: 'mep-section', class: 'section' });
  const main = document.querySelector('main');
  el.replaceWith(mmmElContainer);
  main.append(section);
  createPaginationEl({
    data: response,
    el: mmmElContainer,
  });
  paginationEl?.classList.remove('mmm-hide');
  handlePaginationClicks();
  handlePaginationDropdownChange();
}

/**
 * This function creates a listener to search criteria changes
 * and will fires an API call when event is received.
 * The search criteria change event is fired inside filterPageList()
 */
function subscribeToSearchCriteriaChanges() {
  document.addEventListener(SEARCH_CRITERIA_CHANGE_EVENT, (el) => {
    // clear url of search params (if user came from a share link)
    if (document.location.search) {
      window.history.pushState({}, document.title, `${document.location.origin}${document.location.pathname}`);
    }

    const searchCriteria = JSON.stringify(el?.detail || {});
    if (cachedSearchCriteria !== searchCriteria) {
      createPageList(document.querySelector('.mmm').parentNode, el.detail);
      cachedSearchCriteria = searchCriteria;
    }
  });
}

export default async function init(el) {
  isReport = el.classList.contains('target-cleanup');
  await createPageList(el);
  createForm(el);
  subscribeToSearchCriteriaChanges();
  loadStyle('/libs/features/personalization/preview.css');
}
