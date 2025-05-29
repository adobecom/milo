import { createTag, loadStyle } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from '../../features/personalization/personalization.js';
import { getMepPopup, API_URLS } from '../../features/personalization/preview.js';

const SEARCH_CRITERIA_CHANGE_EVENT = 'mmm-search-change';
let cachedSearchCriteria = '';
export const DEBOUNCE_TIME = 800;
export const MMM_LOCAL_STORAGE_KEY = 'mmm_filter_settings';
export const MMM_REPORT_LOCAL_STORAGE_KEY = 'mmm_report_filter_settings';
export const MMM_METADATA_LOCAL_STORAGE_KEY = 'mmm_metadata_report_filter_settings';
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
const TARGETSETTING_OPTIONS = {
  on: { label: 'On', value: 'on' },
  off: { label: 'Off', value: 'off' },
  postLCP: { label: 'Post LCP', value: 'postLCP' },
};
const MANIFESTSRC_OPTIONS = {
  personalization: { label: 'PZN', value: 'pzn' },
  promo: { label: 'Promo', value: 'promo' },
  target: { label: 'Target', value: 'target' },
  // ajo: { label: 'AJO', value: 'ajo' },
  // placeholder: { label: 'Placeholders', value: 'placeholders' },
};

const GRID_FORMAT = {
  // array values must match ids of html element in order desired per row
  base: {
    row1: ['mmm-container-dropdown-pages', 'mmm-container-dropdown-geos', 'mmm-dropdown-lastSeen', 'mmm-dropdown-subdomain'],
    row2: ['mmm-checkbox-filter-targetSetting', 'mmm-checkbox-filter-manifestSrc'],
    row3: ['mmm-search-filter-container'],
  },
  targetCleanUp: {
    row1: ['mmm-dropdown-lastSeen', 'mmm-container-dropdown-geos'],
    row2: ['mmm-search-filter-container'],
  },
};

const METADATA_URLS_CATEGORIES = {
  notFound: { display: 'Not in spreadsheet', key: 'notFound' },
  off: { display: 'Off', key: 'off' },
  on: { display: 'On', key: 'on' },
  postLCP: { display: 'PostLCP', key: 'postLCP' },
};

const TARGET_METADATA_OPTIONS = {
  cc: {
    name: 'CC',
    metadata: 'https://main--cc--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B818b8ad2-72db-4726-85a6-5238d6715069%7D&action=edit&activeCell=%27helix-default%27!A16&wdinitialsession=11b36a4d-a08b-0def-1294-1fcf497cfc1a&wdrldsc=4&wdrldc=1&wdrldr=AccessTokenExpiredWarningUnauthenticated%2CRefreshin',
  },
  dc: {
    name: 'DC',
    metadata: 'https://main--dc--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7B8F5A8CD0-7979-41CE-894A-CC465B293C1A%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true&wdsle=0',
  },
  express: {
    name: 'Express',
    metadata: 'https://main--express-milo--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7BEC96D2B9-9F25-48AF-B88A-A6926A340D3A%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true',
  },
  bacom: {
    name: 'BACOM',
    metadata: 'https://main--bacom--adobecom.aem.live/metadata-optimization.json',
    source: 'https://adobe.sharepoint.com/:x:/r/sites/adobecom/_layouts/15/Doc.aspx?sourcedoc=%7BEE70634D-C16E-45E7-B16E-718C5022413E%7D&file=metadata-optimization.xlsx&action=default&mobileredirect=true&wdsle=0',
  },
};
let isReport = false;
let mmmPageVer = GRID_FORMAT.base;
let isMetadataLookup = false;
let metadataLookupData = null;

function getStorageKey() {
  if (isReport) {
    return MMM_REPORT_LOCAL_STORAGE_KEY;
  }
  if (isMetadataLookup) {
    return MMM_METADATA_LOCAL_STORAGE_KEY;
  }
  return MMM_LOCAL_STORAGE_KEY;
}

export const getLocalStorageFilter = () => {
  const cookie = localStorage.getItem(getStorageKey());
  return cookie ? JSON.parse(cookie) : null;
};

const setLocalStorageFilter = (obj) => {
  localStorage.setItem(getStorageKey(), JSON.stringify(obj));
};

const SEARCH = () => getLocalStorageFilter() ?? {
  lastSeenManifest: isReport ? LAST_SEEN_OPTIONS.week.key : LAST_SEEN_OPTIONS.threeMonths.key,
  pageNum: 1,
  subdomain: SUBDOMAIN_OPTIONS.www.key,
  perPage: 25,
  targetSetting: 'on, off, postLCP',
  manifestSrc: 'pzn, promo, target, ajo, placeholders',
  selectedRepo: 'cc',
  metadataFilter: '',
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
    const pageData = await fetchData(`${API_URLS.pageDetails}?id=${pageId}&lastSeen=${SEARCH().lastSeenManifest}&manifestSrc=${SEARCH().manifestSrc}`, DATA_TYPE.JSON);
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
 * @param {Number} pageNum - optional. Number of page.
 * @param {Number} perPage - optional. Rows per page.
 * @param {Event} filterEvent - optional. Fitler input Event object.
 * @param {Event} sortingEvent - optional. Sorting Event object.
 */
function filterPageList(pageNum, perPage, filterEvent, sortingEvent) {
  const searchValues = {};
  const activeSearchWithShortKeyword = filterEvent?.target?.value
    && filterEvent.target.value.length < 2;
  // handle dropdowns and text area
  document.querySelector(SEARCH_CONTAINER).querySelectorAll('select, textarea').forEach((field) => {
    const id = field.getAttribute('id').split('-').pop();
    const { value } = field;
    searchValues[id] = value;
  });
  // handle grouped checkboxes into single object value
  const checkedBoxes = {};
  document.querySelector(SEARCH_CONTAINER).querySelectorAll('fieldset input[type="checkbox"]:checked:not(.mmm-report-add, .mmm-report-all)').forEach((checkedBox) => {
    const fieldset = checkedBox.closest('fieldset').getAttribute('id').split('-')[1];
    const { value } = checkedBox;
    if (fieldset in checkedBoxes) {
      checkedBoxes[fieldset].value.push(value);
    } else checkedBoxes[fieldset] = { value: [value] };
  });
  if (Object.entries(checkedBoxes).length) {
    Object.keys(checkedBoxes).forEach((key) => {
      const fieldsetValue = checkedBoxes[key].value.join((', '));
      searchValues[key] = fieldsetValue; // no need for tagName
    });
  }
  // add pageNum and perPage to args for api call
  searchValues.pageNum = pageNum || 1;
  searchValues.perPage = perPage || SEARCH()?.perPage;

  // add orderBy and order to args for api call
  if (isReport) {
    searchValues.orderBy = sortingEvent?.target?.dataset?.orderBy
      || getLocalStorageFilter()?.orderBy;
    searchValues.order = sortingEvent?.target?.dataset?.order || getLocalStorageFilter()?.order;
  }
  // assemble event details object with all filter criterias
  const detail = {};
  Object.keys(searchValues).forEach((key) => {
    let value = searchValues[key];
    if (key === 'filter' && value.replace) { // allow optional commas inside filter textbox
      value = value.replace(/,/g, '');
      value = value.replace(/\n/g, ',\n');
    }
    detail[key] = value;
  });
  // This event triggers an API call with most recent search criteria and a forces a re-render
  if (!activeSearchWithShortKeyword) {
    setLocalStorageFilter(detail);
    document.dispatchEvent(new CustomEvent(SEARCH_CRITERIA_CHANGE_EVENT, { detail }));
  }
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

function findAndSetInGrid(htmlEl) {
  let insertPoint;

  Object.keys(mmmPageVer).forEach((key) => {
    const checkIndex = mmmPageVer[key].indexOf(htmlEl.id);
    if (checkIndex !== -1) insertPoint = [key, checkIndex];
  });
  const searchRow = document.getElementById(`mmm-search-${insertPoint[0]}`);
  searchRow.append(htmlEl);
  htmlEl.classList.add(`mmm-order-${insertPoint[1] + 1}`);
}

function createDropdowns(data) {
  Object.keys(data).forEach((key) => {
    const { label, options } = data[key];
    const dropdownContainer = createTag(
      'div',
      { id: `mmm-container-dropdown-${key}`, class: 'mmm-form-container mmm-dropdown-container' },
    );
    const dropdownSubContainer = createTag('div', { class: 'mmm-dropdown-sub-container' });
    dropdownContainer.append(dropdownSubContainer);
    dropdownSubContainer.append(createTag('label', { for: `mmm-dropdown-${key}` }, `${label}:`));
    const select = createTag('select', { id: `mmm-dropdown-${key}` });
    dropdownSubContainer.append(select);
    select.append(createTag('option', { value: '' }, 'Show all'));
    Object.keys(options).forEach((option) => {
      const optionEl = createTag('option', { value: option }, options[option]);
      select.append(optionEl);
      const startingVal = SEARCH()[key];
      if (startingVal === option) optionEl.setAttribute('selected', 'selected');
    });
    select.addEventListener('change', () => filterPageList());
    findAndSetInGrid(dropdownContainer);
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
  const searchForm = createTag(
    'div',
    { id: 'mmm-search-filter-container', class: 'mmm-form-container' },
    `<div class="mmm-search-sub-container">
      <label for="mmm-search-filter">Filter: search for a full or partial page URL (production only), manifest URL, manifest experience name or Target activity name:</label>
      <textarea id="mmm-search-filter" type="text" name="mmm-search-filter" class="text-field-input" placeholder="https://www.adobe.com/creativecloud.html\n/test_campaign4/test-campaign4-business.json\nDC1031"></textarea>
    </div>`,
  );
  const searchField = searchForm.querySelector('textarea');
  searchField.innerHTML = SEARCH().filter || '';

  searchField.addEventListener('keyup', debounce((event) => filterPageList(null, null, event)));
  searchField.addEventListener('change', debounce((event) => filterPageList(null, null, event)));
  searchField.addEventListener('input', (event) => {
    const target = event.target || event.detail;
    target.style.height = 'auto'; /* Reset height to auto to recalculate */
    target.style.height = `${target.scrollHeight}px`;
  });
  setTimeout(() => searchField.dispatchEvent(new Event('input'), 10));
  findAndSetInGrid(searchForm);
}

function createLastSeenManifestAndDomainDD() {
  const dropdownLastSeen = createTag(
    'div',
    { id: 'mmm-dropdown-lastSeen', class: 'mmm-form-container' },
    `<div>
      <label for="mmm-lastSeenManifest">${isReport ? 'Target manifests not' : 'Manifests'} seen in the last:</label>
      <select id="mmm-lastSeenManifest" type="text" name="mmm-lastSeenManifest" class="text-field-input">
      
      </select>
    </div>`,
  );
  dropdownLastSeen.addEventListener('change', () => filterPageList());
  findAndSetInGrid(dropdownLastSeen);
  Object.keys(LAST_SEEN_OPTIONS).forEach((key, index) => {
    if (isReport && index > 3) return;
    const lastSeenSelect = dropdownLastSeen.querySelector('select');
    const newEl = createTag(
      'option',
      { value: LAST_SEEN_OPTIONS[key].key, ...(SEARCH().lastSeenManifest === LAST_SEEN_OPTIONS[key].key ? { selected: 'selected' } : {}) },
      LAST_SEEN_OPTIONS[key].value,
    );
    lastSeenSelect.append(newEl);
  });

  if (!isReport) {
    const dropdownSubdomain = createTag(
      'div',
      { id: 'mmm-dropdown-subdomain', class: 'mmm-form-container' },
      `<div>
        <label for="mmm-subdomain">Subdomain:</label>
        <select id="mmm-subdomain" type="text" name="mmm-subdomain" class="text-field-input">
          ${Object.keys(SUBDOMAIN_OPTIONS).map((key) => `
            <option value="${SUBDOMAIN_OPTIONS[key].key}" ${SEARCH().subdomain === SUBDOMAIN_OPTIONS[key].key ? 'selected' : ''}>${SUBDOMAIN_OPTIONS[key].value}</option>
          `)}
        </select>
      </div>`,
    );
    dropdownSubdomain.addEventListener('change', () => filterPageList());
    findAndSetInGrid(dropdownSubdomain);
  }
}

function createCheckBoxFilterGroup(checkBoxId, legendLabel, optionsObj) {
  const checkBoxLegend = createTag('legend', { id: `mmm-checkbox-${checkBoxId}-legend` }, legendLabel);
  const checkBoxFieldset = createTag('fieldset', { id: `mmm-${checkBoxId}-fieldset` }, checkBoxLegend);
  // helper function only ran during filter build. consider moving to outter lex scope
  function createCheckBox(groupName, checkboxLabel, checkboxValue) {
    const initValueCheck = !SEARCH()?.[groupName] || SEARCH()?.[groupName]?.split(', ').includes(checkboxValue);
    const checkDiv = createTag('div', { class: 'mmm-checkbox-option' });
    const checkLabel = createTag('label', { for: `mmm-${groupName}-${checkboxValue}` }, checkboxLabel);
    const checkBox = createTag('input', {
      type: 'checkbox',
      id: `mmm-${groupName}-${checkboxValue}`,
      name: groupName,
      value: checkboxValue,
      class: 'mmm-checkbox',
      ...(initValueCheck ? { checked: 'true' } : {}),
    });
    checkDiv.append(checkBox, checkLabel);
    return checkDiv;
  }

  Object.keys(optionsObj).forEach((key) => {
    const checkDiv = createCheckBox(
      checkBoxId,
      optionsObj[key].label,
      optionsObj[key].value,
    );
    checkBoxFieldset.append(checkDiv);
  });
  const checkboxContainer = createTag('div', { id: `mmm-${checkBoxId}-container`, class: 'mmm-form-container' }, checkBoxFieldset);
  return checkboxContainer;
}

function createTargetAndManifestSrcFilter() {
  const filterConfigs = [
    { name: 'targetSetting', label: "Page's Target Setting:", options: TARGETSETTING_OPTIONS },
    { name: 'manifestSrc', label: 'Manifest Source:', options: MANIFESTSRC_OPTIONS },
  ];
  filterConfigs.forEach(({ name, label, options }) => {
    const checkboxSubContainer = createTag('div', { class: 'mmm-checkbox-sub-container' });
    const filterGroup = createCheckBoxFilterGroup(name, label, options);
    checkboxSubContainer.append(filterGroup);
    const checkBoxFilterContainer = createTag(
      'div',
      { id: `mmm-checkbox-filter-${name}`, class: 'mmm-form-container ' },
      checkboxSubContainer,
    );
    findAndSetInGrid(checkBoxFilterContainer);
  });
  document.querySelectorAll('.mmm-checkbox-sub-container fieldset input').forEach((input) => {
    input.addEventListener('click', (e) => {
      if (e.target.closest('fieldset').querySelectorAll('input[type="checkbox"]:checked').length === 0) {
        e.preventDefault();
        e.target.closest('fieldset').classList.add('minError');
        setTimeout(() => e.target.closest('fieldset').classList.remove('minError'), 5000);
        return;
      }
      filterPageList();
    });
  });
}

async function createFiltersForm(el) {
  const data = parseData(el);
  createDropdowns(data);
  createLastSeenManifestAndDomainDD();
  if (!isReport) createTargetAndManifestSrcFilter();
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
    );
  });
}

function handlePaginationClicks() {
  const paginationEl = document.querySelector('#mmm-pagination');
  paginationEl?.querySelectorAll('a').forEach((item) => {
    item?.addEventListener('click', () => {
      paginationEl.dataset.currentPage = item.dataset.pageNum;
      filterPageList(
        item.dataset.pageNum,
        paginationEl.dataset.perpage,
      );
    });
  });
}

function getDate(inputDate) {
  const date = inputDate || new Date();
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', dateOptions);
}

function getAbsUrl(manifestUrl, pageUrl) {
  return manifestUrl?.startsWith('http')
    ? manifestUrl
    : `${pageUrl.split('.com')[0]}.com${manifestUrl}`;
}

function createReportButton() {
  const parentContainer = document.querySelector('dl.mmm.foreground');
  const copyReportButton = createTag('a', { class: 'con-button blue button-l button-justified-mobile mmm-report-copy' }, 'Copy Selected');
  const openSlackButton = createTag(
    'a',
    {
      class: 'con-button outline button-l button-justified-mobile mmm-report-slack',
      href: 'https://adobe.enterprise.slack.com/archives/C08SA7JUW3F',
    },
    'Open Slack',
  );
  copyReportButton.addEventListener('click', (e) => {
    const reportData = [];
    const selectedCheckboxes = document.querySelectorAll('.mmm-report-add:checked');
    if (selectedCheckboxes.length === 0) {
      e.target.closest('p').classList.add('minError');
      setTimeout(() => e.target.closest('p').classList.remove('minError'), 3000);
      return;
    }
    selectedCheckboxes.forEach((checkedBox) => reportData.push(checkedBox.closest('.mmm-report-row').querySelector('a').href.split('?')[0]));
    navigator.clipboard.writeText(`Please turn off Target integration from the following ${reportData.length > 1 ? `${reportData.length} pages:` : 'page:'}\n${reportData.join('\n')}`);
    e.target.closest('p').classList.remove('minError');
    e.target.closest('p').classList.add('copySuccess');
    setTimeout(() => e.target.closest('p').classList.remove('copySuccess'), 3000);
  });
  const topButtonContainer = createTag('div', { id: 'mmm-report-button-container', class: 'mmm-report-button-container' }, '<p class="action-area"></p>');
  topButtonContainer.querySelector('.action-area').append(copyReportButton, openSlackButton);
  parentContainer.prepend(topButtonContainer);
}

function createReport(el, data) {
  const { result, orderBy, order } = data;
  const arrow = '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.70504 0L0.295044 1.41L4.87504 6L0.295044 10.59L1.70504 12L7.70504 6L1.70504 0Z" fill="black"/></svg>';
  const headers = [
    { label: 'URL', orderBy: 'p.url', order: 'asc' },
    { label: 'Target', orderBy: 'p.target', order: 'asc' },
    { label: 'Target Last Seen', orderBy: 'a.lastSeen', order: 'asc' },
    { label: 'Page Last Seen', orderBy: 'p.lastSeen', order: 'asc' },
  ];
  el.innerHTML = `
    <div class="mmm-report">
      <div class="mmm-report-header">
        <div class="select-all">
          <label for="mmm-report-all">Select All</label>
          <input id="mmm-report-all" type="checkbox" id="entry-all" name="entry-all" value="entry-all" class="mmm-report-all">
        </div>
      ${headers.map((header) => `
        <div data-order-by="${header.orderBy}" data-order="${header.orderBy === orderBy ? order : header.order}" class="sortable">
          ${header.label}
          <section>${header.orderBy === orderBy ? arrow : ''}</section>
        </div>
      `).join('')}
      </div>
      <div class="mmm-report-body">
        ${result.map((item, index) => `
          <div class="mmm-report-row">
            <div>
              <input type="checkbox" id="entry-${index}" name="entry-${index}" value="entry-${index}" class="mmm-report-add">
            </div>
            <div><a href="${item.url}?mep" target="_blank">${item.url}</a></div>
            <div>${item.target}</div>
            <div>${getDate(item.aLastSeen)}<br/><a class="small" target="_blank" href="${getAbsUrl(item.manifestUrl, item.url)}">${item.targetActivityName}</a></div>
            <div>${getDate(item.pLastSeen)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('.mmm-report-header div.sortable').forEach((header) => {
    header.addEventListener('click', (e) => {
      e.target.dataset.order = e.target.dataset.order === 'asc' ? 'desc' : 'asc';
      filterPageList(null, null, null, e);
    });
  });
  const selectAllCheck = el.querySelector('.mmm-report-all');

  selectAllCheck?.addEventListener('change', (e) => {
    const checkboxes = el.querySelectorAll('input[type="checkbox"].mmm-report-add');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  });
}

function buildUrlPod(list, title) {
  if (!list.length) return;
  const container = document.querySelector('.mmm-metadata-lookup__results');
  const html = `
    <div class="mmm-metadata-url-pod">
      <h3>${title}</h3>
      ${list.map((item) => `
      <div class="mmm-metadata-url-pod__item">
        <span>${item.URL || item.split(/\.com|\.html/g)[1]}</span>
      </div>
      `).join('')}
    </div>
    <button class="mmm-metadata-lookup__button" data-result=${JSON.stringify(list)}>Copy</button>
    `;
  container.append(createTag('div', { class: 'mmm-metadata-url-pod-container' }, html));
}

function updatePageTargetStatus(url, target) {
  return fetch(API_URLS.save, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: { url, target }, updateOnly: true }),
  });
}

function handleMetadataFilterInput(event) {
  setLocalStorageFilter({
    selectedRepo: document.querySelector('#mmm-metadata-lookup-repo-cc').value,
    metadataFilter: document.querySelector('#mmm-metadata-lookup__filter').value,
  });
  const { target, detail } = event;
  const el = target ?? detail;
  el.style.height = 'auto'; /* Reset height to auto to recalculate */
  el.style.height = `${el.scrollHeight}px`;
  const categories = {
    [METADATA_URLS_CATEGORIES.notFound.key]: [],
    [METADATA_URLS_CATEGORIES.off.key]: [],
    [METADATA_URLS_CATEGORIES.on.key]: [],
    [METADATA_URLS_CATEGORIES.postLCP.key]: [],
  };
  const urls = el.value?.split(/,|\n/)?.filter((item) => item.trim().length > 0) || [];
  urls.forEach((url) => {
    const path = url.split(/\.com|\.html/g)[1];
    const match = metadataLookupData.find((item) => item.URL === path);
    if (match) match.url = url;
    if (!match && url) {
      categories.notFound.push(url);
    } else if (match.target) {
      categories[match.target].push(match);
    } else {
      categories[METADATA_URLS_CATEGORIES.off.key].push(match);
    }
  });
  document.querySelector('.mmm-metadata-lookup__results').innerHTML = '';

  Object.keys(categories).forEach((key) => {
    buildUrlPod(categories[key], METADATA_URLS_CATEGORIES[key].display);
    if (key !== 'notFound') {
      categories[key].forEach((item) => {
        item.target = key;
        updatePageTargetStatus(item.url, key);
      });
    }
  });

  // handle 'copy to clipboard' pod buttons
  const container = document.querySelector('.mmm-metadata-lookup__results');
  container.querySelectorAll('.mmm-metadata-lookup__button').forEach((item) => {
    item.addEventListener('click', (e) => {
      const tgt = e.target;
      const result = JSON.parse(tgt.dataset.result);
      const text = `${result.map((url) => url.URL || url.split(/\.com|\.html/g)[1]).join('\n')}`;
      tgt.classList.add('success');
      navigator.clipboard.writeText(text).then(() => {
        setTimeout(() => tgt.classList.remove('success'), 2000);
      });
    });
  });

  const filterResult = document.querySelector('.mmm-metadata-lookup__results');
  filterResult.dataset.result = JSON.stringify(categories);

  if (filterResult.childNodes.length) {
    document.querySelector('#mmm-copy-metadata-report').classList.remove('mmm-hide');
  } else {
    document.querySelector('#mmm-copy-metadata-report').classList.add('mmm-hide');
  }
}

function createMetadataLookup(el) {
  const openMetadataSheetBtn = document.querySelector('.text.instructions .cta-container a');
  const dropdown = {
    id: 'mmm-metadata-lookup-repo-cc',
    label: 'Choose Repo',
    selected: SEARCH().selectedRepo,
  };

  const search = createTag('div', { class: 'mmm-metadata-lookup' }, `
    <div class="mmm-form-container">
      <div>
        <label for="${dropdown.id}">${dropdown.label}:</label>
        <select id="${dropdown.id}" class="text-field-input">
          ${Object.keys(TARGET_METADATA_OPTIONS).map((key) => `
            <option value="${key}" ${dropdown.selected === key ? 'selected' : ''}>${TARGET_METADATA_OPTIONS[key].name}</option>
          `).join('')}
        </select>
      </div>
      <div>
        <label for="mmm-metadata-lookup__filter">URL list (full URLs):</label>
        <textarea id="mmm-metadata-lookup__filter"></textarea>
      </div>
    </div>
    <div class="mmm-metadata-lookup__results"></div>
    <button id="mmm-copy-metadata-report" class="mmm-metadata-lookup__button primary mmm-hide" style="align-self: center">Copy Report</button>
  `);
  el.append(search);
  // Edit REP button label and URL
  const { name, source } = TARGET_METADATA_OPTIONS[dropdown.selected];
  openMetadataSheetBtn.innerHTML = `Open ${name} Spreadsheet`;
  openMetadataSheetBtn.href = source;

  // Handle REPO change
  // eslint-disable-next-line no-use-before-define
  el.querySelector('#mmm-metadata-lookup-repo-cc').addEventListener('change', handleRepoChange);
  // Handle copy report button
  el.querySelector('#mmm-copy-metadata-report').addEventListener('click', () => {
    const filterResult = document.querySelector('.mmm-metadata-lookup__results')?.dataset?.result;
    const filterResultObj = JSON.parse(filterResult);
    filterResultObj.off = filterResultObj.off.concat(filterResultObj.notFound);
    filterResultObj.notFound = [];
    const reportText = `Date: ${getDate()}\nRepo: ${SEARCH().selectedRepo.toUpperCase()}\nRequested pages are grouped below by their Target setting.
      ${Object.keys(filterResultObj).map((key) => {
    const urls = filterResultObj[key].map((item) => item.url || item);
    return urls.length ? `\n\n${METADATA_URLS_CATEGORIES[key].display}:\n${urls.join('\n')}\n` : null;
  }).join('')}`;
    // copy to clipboard
    navigator.clipboard.writeText(reportText).then(() => {
      const btn = document.querySelector('#mmm-copy-metadata-report');
      btn.classList.add('success');
      setTimeout(() => btn.classList.remove('success'), 2000);
    });
  });
  // Handle Filter input
  const textarea = search.querySelector('textarea');
  textarea.addEventListener('input', debounce((event) => handleMetadataFilterInput(event)));
  textarea.innerHTML = SEARCH().metadataFilter;
  textarea.dispatchEvent(new CustomEvent('input', { detail: textarea }));
}

function creastePageList(el, data) {
  data?.result.map((page) => createButtonDetailsPair(el, page));
}

async function createView(el, search) {
  const mmmElContainer = createTag('div', { class: 'mmm-container max-width-12-desktop' });
  const mmmEl = createTag('dl', {
    class: `mmm foreground ${el.classList[1]}`,
    id: 'mmm',
    role: 'presentation',
  });
  mmmElContainer.append(mmmEl);

  let url = '';
  let method = 'POST';
  let body = JSON.stringify(search ?? SEARCH());
  switch (true) {
    case isReport: url = API_URLS.report; break;
    case isMetadataLookup: {
      url = TARGET_METADATA_OPTIONS[SEARCH().selectedRepo].metadata;
      method = 'GET';
      body = null;
      break;
    }
    default: url = API_URLS.pageList;
  }

  const response = await fetch(url, {
    method,
    body,
  }).then((res) => res.json())
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
      return { result: [] };
    });

  if (isReport) {
    createReport(mmmEl, response);
  } else if (isMetadataLookup) {
    metadataLookupData = response?.data;
    createMetadataLookup(mmmEl);
  } else {
    creastePageList(mmmEl, response);
  }
  const section = createTag('div', { id: 'mep-section', class: 'section' });
  const main = document.querySelector('main');
  el.replaceWith(mmmElContainer);
  main.append(section);
  if (!isMetadataLookup) {
    createPaginationEl({
      data: response,
      el: mmmElContainer,
    });
    handlePaginationClicks();
    handlePaginationDropdownChange();
  }
  if (isReport) createReportButton();
}

function createSearchRows() {
  const searchContainer = createTag('div', { class: SEARCH_CONTAINER.slice(1) });
  document.querySelector('.mmm-container').parentNode.prepend(searchContainer);
  Object.keys(mmmPageVer).forEach((key) => {
    const row = createTag('div', { id: `mmm-search-${key}`, class: 'mmm-row mmm-form-container' });
    searchContainer.append(row);
  });
}

/**
 * This function creates a listener to search criteria changes
 * and will fires an API call when event is received.
 * The search criteria change event is fired inside filterPageList()
 */
function subscribeToSearchCriteriaChanges() {
  document.addEventListener(SEARCH_CRITERIA_CHANGE_EVENT, (el) => {
    // clear url of search params - might need to enable later
    if (document.location.search) {
      window.history.pushState({}, document.title, `${document.location.origin}${document.location.pathname}`);
    }

    const searchCriteria = JSON.stringify(el?.detail || {});
    if (cachedSearchCriteria !== searchCriteria) {
      createView(document.querySelector('.mmm').parentNode, el.detail);
      cachedSearchCriteria = searchCriteria;
    }
  });
}

function handleRepoChange() {
  setLocalStorageFilter({
    selectedRepo: document.querySelector('#mmm-metadata-lookup-repo-cc').value,
    metadataFilter: '',
  });
  createView(document.querySelector('.mmm').parentNode);
}

export default async function init(el) {
  isReport = el.classList.contains('target-cleanup');
  mmmPageVer = isReport ? GRID_FORMAT.targetCleanUp : GRID_FORMAT.base;
  isMetadataLookup = el.classList.contains('target-metadata-lookup');
  await createView(el);
  if (!isMetadataLookup) {
    createSearchRows();
    createFiltersForm(el);
  }
  subscribeToSearchCriteriaChanges();
  loadStyle('/libs/features/personalization/preview.css');
}
