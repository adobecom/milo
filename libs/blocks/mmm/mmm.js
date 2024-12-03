import { createTag, customFetch, loadStyle } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from '../../features/personalization/personalization.js';
import { getMepPopup } from '../../features/personalization/preview.js';

const debugVersion = 'params'; // hash or params

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';
const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page?id=`,
};

// hash methods
function updateWindowUrlWithSearchHash() {
  const newHash = [];
  const type = document.querySelector('.tab-list-container button[aria-selected="true"]').innerHTML;
  newHash.push(`type=${type}`);
  if (type === 'Dropdown') {
    const geoValue = `geo=${document.querySelector('select#mmm-search-geo').value}`;
    const topPageValue = `page=${document.querySelector('select#mmm-search-page').value}`;
    newHash.push(geoValue, topPageValue);
  } else {
    const query = document.querySelector('#mmm-search-input').value;
    if (query) newHash.push(`q=${query}`);
  }
  console.log(`new hash no encoding: #${newHash.join('&')}`);
  window.location.hash = encodeURIComponent(newHash.join('&'));
}
function searchFromWindowUrl() {
  const decodedHash = decodeURIComponent(window.location.hash);
  const hashParams = decodedHash.replace('#', '').split('&');
  if (hashParams.length === 0) return;
  const paramsObj = {};
  hashParams.forEach((pair) => {
    const currentPair = pair.split('=');
    paramsObj[currentPair[0]] = currentPair[1];
  });
  console.log('windowparams: for API', paramsObj);
}

// param methods
function buildSharableLink() {
  // runs only on button click

  // const newUrlQueryParam = [];
  // const type = document.querySelector('.tab-list-container button[aria-selected="true"]').innerHTML;
  // newUrlQueryParam.push(`type=${type}`);
  // if (type === 'Dropdown') {
  //   const geoValue = `&geo=${document.querySelector('select#mmm-search-geo').value}`;
  //   const topPageValue = `&page=${document.querySelector('select#mmm-search-page').value}`;
  //   newUrlQueryParam.push(geoValue, topPageValue);
  // } else {
  //   const query = document.querySelector('#mmm-search-input').value;
  //   if (query) newUrlQueryParam.push(`q=${query}`);
  // }
  // console.log(`sharable link no encoding= ?${newUrlQueryParam.join('&')}`);
  // const sharableLink = encodeURIComponent(newUrlQueryParam.join('&'));
  // console.log(`sharable link= ${sharableLink}`);

  // OR this is prob better
  const urlObj = window.location;
  const newDomain = new URL(urlObj.protocol + urlObj.host + urlObj.pathname);
  const sharableLinkParams = {};

  sharableLinkParams.type = document.querySelector('.tab-list-container button[aria-selected="true"]').innerHTML;
  if (sharableLinkParams.type === 'Dropdown') {
    sharableLinkParams.geo = document.querySelector('select#mmm-search-geo').value;
    sharableLinkParams.topPage = document.querySelector('select#mmm-search-page').value;
  } else sharableLinkParams.q = document.querySelector('#mmm-search-input').value;

  newDomain.search = new URLSearchParams(sharableLinkParams).toString();
  const sharableLink = newDomain.toString();
  console.log(`new sharable link: ${sharableLink}`);
}
function searchFromWindowParameters() {
  const searchParams = new URLSearchParams(decodeURIComponent(window.location.search));
  const newValuesToBuild = {};
  newValuesToBuild.type = searchParams.get('type');
  if (newValuesToBuild.type === 'Dropdown') {
    newValuesToBuild.geo = searchParams.get('geo');
    newValuesToBuild.page = searchParams.get('page');
  } else newValuesToBuild.q = searchParams.get('q');
  return Object.keys(newValuesToBuild).length > 1 ? newValuesToBuild : null;
}

async function toggleDrawer(el, dd) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    if (!dd.classList.contains('placeholder-resolved')) {
      const { pageId } = dd.dataset;
      const pageData = await fetchData(`${API_URLS.pageDetails}${pageId}`, DATA_TYPE.JSON);
      const { page, activities } = pageData;
      if (!page.prefix) page.prefix = 'en-us';
      activities.map((activity) => {
        activity.variantNames = activity.variantNames.split('||');
        activity.source = activity.source.split(',');
        return activity;
      });
      dd.append(getMepPopup(activities, page, true));
      dd.classList.add('placeholder-resolved');
    }
    dd.removeAttribute('hidden');
  }
}

function createButtonDetailsPair(mmmEl, page) {
  const { url, pageId } = page;
  const geoOptions = [
    'jp',
    'ca',
    'ca_fr',
    'au',
    'nz',
    'kr',
    'mx',
    'br',
  ];

  const pageUrl = new URL(url);
  let path = pageUrl.pathname;
  const pathFolders = path.split('/');
  if (geoOptions.includes(pathFolders[1])) {
    pathFolders.splice(1, 1);
    path = pathFolders.join('/');
  }
  page.path = path;
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

  const panel = url.nextElementSibling?.firstElementChild;
  // const para = panel?.querySelector('p');
  // const text = para ? para.textContent : panel?.textContent;
  const dtHtml = hTag ? createTag(hTag.tagName, { class: 'mmm-heading' }, button) : button;
  const dt = createTag('dt', false, dtHtml);
  const dd = createTag('dd', { id: panelId, hidden: true }, panel);
  Object.keys(page).forEach((key) => {
    dt.dataset[key] = page[key];
    dd.dataset[key] = page[key];
  });
  button.addEventListener('click', (e) => { toggleDrawer(e.target, dd, pageId, 'mmm'); });
  mmmEl.append(dt, dd);
}

function searchFilterByInput() {
  const searchFieldValue = document.querySelector('#mmm-search-input').value;
  const geoDropDownValue = document.querySelector('#mmm-search-geo').value;
  const pageDropDownValue = document.querySelector('#mmm-search-page').value;
  const mmmEntries = document.querySelectorAll('div.mmm-container > dl > *');
  const selectedGeos = geoDropDownValue.split(',');
  const selectedRadio = document.querySelector('.tab-list-container button[aria-selected="true"]');
  const filterType = selectedRadio?.getAttribute('id') === 'tab-mmm-options-2' ? 'search' : 'filter';

  if (!mmmEntries) return;
  mmmEntries.forEach((entry) => {
    const { url, path, prefix = 'us' } = entry.dataset;
    entry.classList.remove('filter-hide');
    if (filterType === 'search') {
      if (!url.includes(searchFieldValue)) entry.classList.add('filter-hide');
      return;
    }
    if (geoDropDownValue !== 'all' && !selectedGeos.some((item) => prefix === item)) {
      entry.classList.add('filter-hide');
    }
    if (pageDropDownValue !== 'all' && path !== pageDropDownValue) {
      entry.classList.add('filter-hide');
    }
  });

  if (debugVersion === 'hash') {
    updateWindowUrlWithSearchHash();
  } else buildSharableLink();
}

async function createForms(sharedUrlSettings) {
  const resp = await customFetch({ resource: '/libs/blocks/mmm/form.html', withCacheRules: true })
    .catch(() => ({}));
  const html = await resp.text();
  if (!html) return;
  const doc = createTag('div', false, html);
  const dropdownContainer = document.querySelector('.section-metadata.dropdowns');
  dropdownContainer.parentNode.insertBefore(doc, dropdownContainer);
  // insert default for 2 dropdowns here
  if (sharedUrlSettings?.type === 'Dropdown') {
    document.querySelector(`#mmm-search-geo [value="${sharedUrlSettings.geo}"]`).setAttribute('selected', 'selected');
    document.querySelector(`#mmm-search-page [value="${sharedUrlSettings.page}"]`).setAttribute('selected', 'selected');
  }
  doc.querySelectorAll('select').forEach((field) => {
    field.addEventListener('change', searchFilterByInput);
  });
  const searchContainer = document.querySelector('.section-metadata.search');
  const searchForm = document.querySelector('#mmm-search-input-container');
  searchContainer.parentNode.insertBefore(searchForm, searchContainer);
  // insert default for q value here
  if (sharedUrlSettings?.type === 'Search') {
    searchForm.querySelector('input').value = sharedUrlSettings.q;
  }
  searchForm.addEventListener('keyup', searchFilterByInput);
  searchForm.addEventListener('change', searchFilterByInput);
  document.querySelectorAll('.tab-list-container button').forEach((button) => {
    button.addEventListener('click', searchFilterByInput);
  });
}

export default async function init(el) {
  if (debugVersion === 'params' && window.location.search.length !== 0) {
    const urlParamSettings = window.location.search ? searchFromWindowParameters() : null;
    console.log(urlParamSettings);
    createForms(urlParamSettings);
  } else createForms();

  const mmmElContainer = createTag('div', { class: 'mmm-container max-width-12-desktop' });
  const mmmEl = createTag('dl', {
    class: 'mmm foreground',
    id: 'mmm',
    role: 'presentation',
  });
  mmmElContainer.append(mmmEl);
  const pageList = await fetchData(API_URLS.pageList, DATA_TYPE.JSON);
  pageList.map((page) => createButtonDetailsPair(mmmEl, page));
  el.remove();
  const section = createTag('div', { id: 'mep-section', class: 'section' });
  const main = document.querySelector('main');
  section.append(mmmElContainer);
  main.append(section);
  if (debugVersion === 'hash') {
    if (!window.location.hash.length) return;
    searchFromWindowUrl();
  }
  loadStyle('/libs/features/personalization/preview.css');
}
/*
todo:
createForm(el) - inserts content in front of el
form - type in search first, and go button. hide everything that's not applicable.
text field for form. overcomplicate later.

radio buttosn
filter or search

string search will never be with geo. it will be under 'search' always and but itself
on filter radio button:

decouple string search and geo/page filter.(need radio button).
if value = filter, then do drop down functions.
if search = just do the string pattern match.

no buttons just add to fire when
1. key up on search
2. change on dropdowns
3. radio button change (automatically runs the function to get same results)
*/

// add updateWindowUrl from within searchFilterByInput ... whereve the changes are happening in functions
// switch to not constantly adding hash - just parse param if available (? not #) no container value, just the forms or search
// update selected tab before render IF search value exists in url
