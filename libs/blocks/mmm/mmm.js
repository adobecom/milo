import { createTag, loadStyle } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from '../../features/personalization/personalization.js';
import { getMepPopup, API_URLS } from '../../features/personalization/preview.js';

async function toggleDrawer(target, dd) {
  const el = target.closest('button');
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    dd.removeAttribute('hidden');
    const loading = dd.querySelector('.loading');
    if (dd.classList.contains('placeholder-resolved') || !loading) return;
    const { pageId } = dd.dataset;
    const pageData = await fetchData(`${API_URLS.pageDetails}${pageId}`, DATA_TYPE.JSON);
    loading.replaceWith(getMepPopup(pageData, true));
    dd.classList.add('placeholder-resolved');
  }
}
function createButtonDetailsPair(mmmEl, page) {
  const { url, pageId } = page;
  const triggerId = `mmm-trigger-${pageId}`;
  const panelId = `mmm-content-${pageId}`;
  const icon = createTag('span', { class: 'mmm-icon' });
  const hTag = createTag('h5', false, url);
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'mmm-trigger tracking-header',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  }, hTag);
  button.append(icon);

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
  Object.keys(page).forEach((key) => {
    const val = page[key] || 'us';
    dt.dataset[key] = val;
    dd.dataset[key] = val;
  });
  button.addEventListener('click', (e) => { toggleDrawer(e.target, dd, pageId, 'mmm'); });
  mmmEl.append(dt, dd);
}
function filterPageList() {
  const mmmEntries = document.querySelectorAll('div.mmm-container > dl > *');
  const shareUrl = new URL(`${window.location.origin}${window.location.pathname}`);
  const searchValues = {};
  document.querySelectorAll('.tabs input, .tabs select').forEach((field) => {
    const id = field.getAttribute('id').split('-').pop();
    const { value, tagName } = field;
    searchValues[id] = {
      value,
      tagName,
    };
    if (value) shareUrl.searchParams.set(id, value);
  });
  const selectedRadio = document.querySelector('.tab-list-container button[aria-selected="true"]');
  const filterType = selectedRadio?.getAttribute('id') === 'tab-mmm-options-2' ? 'search' : 'filter';
  if (filterType === 'search') shareUrl.searchParams.set('tab', 'mmm-options-2');
  document.querySelectorAll('button.copy-to-clipboard').forEach((button) => {
    button.dataset.destination = shareUrl.href;
  });

  mmmEntries.forEach((entry) => {
    const data = entry.dataset;
    entry.classList.remove('filter-hide');
    if (filterType === 'search') {
      if (!data.url.includes(searchValues.query.value)) entry.classList.add('filter-hide');
      return;
    }
    Object.keys(searchValues).forEach((key) => {
      const { value, tagName } = searchValues[key];
      if (tagName !== 'SELECT') return;
      // const inputVal = data[key];
      const FIELD_MAP = { page: 'pagePath', geo: 'prefix' };
      const inputVal = data[FIELD_MAP[key]];
      if (value && !value.split(',').some((val) => inputVal === val)) {
        entry.classList.add('filter-hide');
      }
    });
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
  const p = createTag('p', { class: 'icon-container' });
  div.append(p);
  const buttonLabel = 'Copy link to these search settings';
  const button = createTag('button', {
    type: 'button',
    class: 'copy-to-clipboard',
    'aria-label': buttonLabel,
    'data-copy-to-clipboard': buttonLabel,
    'data-copied': 'Copied!',
  });
  p.append(button);
  button.addEventListener('click', (e) => {
    /* c8 ignore next 6 */
    e.preventDefault();
    navigator.clipboard.writeText(button.dataset.destination).then(() => {
      button.classList.add('copy-to-clipboard-copied');
      setTimeout(() => document.activeElement.blur(), 500);
      setTimeout(
        () => button.classList.remove('copy-to-clipboard-copied'),
        2000,
      );
    });
  });
}
function createDropdowns(data, sharedUrlSettings) {
  const dropdownTab = document.querySelector('.section-metadata.dropdowns');
  const dropdownForm = createTag(
    'div',
    { id: 'mmm-dropdown-container', class: 'mmm-form-container' },
  );
  dropdownTab.parentNode.append(dropdownForm);
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
      const startingVal = sharedUrlSettings[key];
      if (startingVal === option) optionEl.setAttribute('selected', 'selected');
    });
    select.addEventListener('change', filterPageList);
  });
}
function createSearchField(data, sharedUrlSettings) {
  const searchTab = document.querySelector('.section-metadata.search');
  const searchForm = createTag(
    'div',
    { id: 'mmm-search-query-container', class: 'mmm-form-container' },
    `<div>
      <label for="mmm-search-query">Search:</label>
      <input id="mmm-search-query" type="text" name="mmm-search-query" class="text-field-input" placeholder="Search for a full or partial URL">
    </div>`,
  );
  searchForm.append(createShareButton());
  searchTab.parentNode.insertBefore(searchForm, searchTab);
  const searchField = searchForm.querySelector('input');
  if (sharedUrlSettings.query) searchField.value = sharedUrlSettings.query;
  searchField.addEventListener('keyup', filterPageList);
  searchField.addEventListener('change', filterPageList);
}
async function createForm(el) {
  const data = parseData(el);
  const urlParams = new URLSearchParams(window.location.search);
  const sharedUrlSettings = Object.fromEntries(urlParams.entries());
  createSearchField(data, sharedUrlSettings);
  createDropdowns(data, sharedUrlSettings);
  document.querySelectorAll('.tab-list-container button').forEach((button) => {
    button.addEventListener('click', filterPageList);
  });
}
async function createPageList(el) {
  const mmmElContainer = createTag('div', { class: 'mmm-container max-width-12-desktop' });
  const mmmEl = createTag('dl', {
    class: 'mmm foreground',
    id: 'mmm',
    role: 'presentation',
  });
  mmmElContainer.append(mmmEl);
  const pageList = await fetchData(API_URLS.pageList, DATA_TYPE.JSON);
  pageList.map((page) => createButtonDetailsPair(mmmEl, page));
  const section = createTag('div', { id: 'mep-section', class: 'section' });
  const main = document.querySelector('main');
  el.replaceWith(mmmElContainer);
  main.append(section);
  filterPageList();
  loadStyle('/libs/features/personalization/preview.css');
}
export default async function init(el) {
  createForm(el);
  createPageList(el);
}
