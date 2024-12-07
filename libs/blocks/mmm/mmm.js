import { createTag, customFetch, loadStyle } from '../../utils/utils.js';
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

function searchFilterByInput() {
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

function addShareButtonListeners() {
  document.querySelectorAll('button.copy-to-clipboard').forEach((target) => {
    target.addEventListener('click', (e) => {
      /* c8 ignore next 6 */
      e.preventDefault();
      const button = e.target.closest('button');
      navigator.clipboard.writeText(button.dataset.destination).then(() => {
        button.classList.add('copy-to-clipboard-copied');
        setTimeout(() => document.activeElement.blur(), 500);
        setTimeout(
          () => button.classList.remove('copy-to-clipboard-copied'),
          2000,
        );
      });
    });
  });
}

async function createForms() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedUrlSettings = Object.fromEntries(urlParams.entries());
  const resp = await customFetch({ resource: '/libs/blocks/mmm/form.html', withCacheRules: true })
    .catch(() => ({}));
  const html = await resp.text();
  if (!html) return;
  const doc = createTag('div', false, html);
  const dropdownContainer = document.querySelector('.section-metadata.dropdowns');
  dropdownContainer.parentNode.insertBefore(doc, dropdownContainer);
  doc.querySelectorAll('.tabs select').forEach((select) => {
    select.addEventListener('change', searchFilterByInput);
    const key = select.getAttribute('id').split('-').pop();
    const value = sharedUrlSettings[key];
    if (!value) return;
    select.querySelector(`option[value="${value}"]`)?.setAttribute('selected', 'selected');
  });
  const searchContainer = document.querySelector('.section-metadata.search');
  const searchForm = document.querySelector('#mmm-search-query-container');
  searchContainer.parentNode.insertBefore(searchForm, searchContainer);
  if (sharedUrlSettings.query) searchForm.querySelector('input').value = sharedUrlSettings.query;
  searchForm.addEventListener('keyup', searchFilterByInput);
  searchForm.addEventListener('change', searchFilterByInput);
  document.querySelectorAll('.tab-list-container button').forEach((button) => {
    button.addEventListener('click', searchFilterByInput);
  });
}

export default async function init(el) {
  createForms();
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
  searchFilterByInput();
  addShareButtonListeners();
  loadStyle('/libs/features/personalization/preview.css');
}
