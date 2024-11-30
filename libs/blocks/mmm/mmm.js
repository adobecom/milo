import { createTag, customFetch } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from '../../features/personalization/personalization.js';
import { createPanelContents } from '../../features/personalization/preview.js';

const API_URLS = {
  pageList: '/libs/blocks/mmm/pageList.json',
  pageDetails: '/libs/blocks/mmm/pageDetails.json',
};

function handleClick(el, dd) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    if (!dd.classList.contains('placeholder-resolved')) {
      const { page } = dd.dataset;
      dd.innerHTML = createPanelContents(`from ${page}`);
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
  button.addEventListener('click', (e) => { handleClick(e.target, dd, pageId, 'mmm'); });
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
}

async function createForms() {
  const resp = await customFetch({ resource: '/libs/blocks/mmm/form.html', withCacheRules: true })
    .catch(() => ({}));
  const html = await resp.text();
  if (!html) return;
  const doc = createTag('div', false, html);
  document.querySelector('#tab-panel-mmm-options-1')?.append(doc);
  doc.querySelectorAll('select').forEach((field) => {
    field.addEventListener('change', searchFilterByInput);
  });
  document.querySelector('#tab-panel-mmm-options-2')
    ?.append(document.querySelector('#mmm-search-input-container'));
  const searchForm = document.querySelector('#mmm-search-input');
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
  el.replaceWith(mmmElContainer);
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
