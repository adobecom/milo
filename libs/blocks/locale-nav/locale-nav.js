import { createTag, getConfig, getLocale } from '../../utils/utils.js';

const { locales } = getConfig();

const params = new URLSearchParams(window.location.search);
const referrer = params.get('referrer');
const owner = params.get('owner');
const repo = params.get('repo');

const formatJson = (json) => {
  const { pathname } = new URL(json.preview.url);
  const locale = getLocale(locales, pathname);
  const editHref = json.edit.url ? json.edit.url : '#';
  return {
    locale,
    pathname,
    edit: createTag('a', { class: `edit action status-${json.edit.status}`, href: editHref, target: '_blank', title: 'Edit' }, 'Edit'),
    preview: createTag('a', { class: `preview action status-${json.preview.status}`, href: json.preview.url, target: '_blank', title: 'Preview' }, 'Preview'),
    live: createTag('a', { class: `live action status-${json.live.status}`, href: json.live.url, target: '_blank', title: 'Live' }, 'Live'),
  };
};

const getDetails = async (path) => {
  const url = path
    ? `https://admin.hlx.page/status/${owner}/${repo}/main${path}?editUrl=auto`
    : `https://admin.hlx.page/status/${owner}/${repo}/main?editUrl=${referrer}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    return formatJson(json);
  } catch (e) {
    return false;
  }
};

const getCurrentDetails = async () => {
  const { origin, pathname } = new URL(referrer);
  const split = origin.split('.');
  const topLevel = split.slice(Math.max(split.length - 2, 1)).join('.');
  const isEdit = topLevel === 'google.com' || topLevel === 'sharepoint.com';
  return isEdit ? getDetails() : getDetails(pathname);
};

const getStatus = async (li, localePath) => {
  const page = await getDetails(localePath);
  const actions = createTag('div', { class: 'actions' }, [page.edit, page.preview, page.live]);
  li.append(actions);
};

const decorateLocales = (current) => {
  const currLocale = current.locale.prefix.replace('/', '');
  delete locales[currLocale];
  return Object.keys(locales).map((key) => {
    const prefix = key === '' ? key : `/${key}`;
    const localePath = currLocale === ''
      ? `/${key}${current.pathname}`
      : current.pathname.replace(current.locale.prefix, prefix);
    const li = createTag('li', { class: 'detail' }, `<span>${key || 'us'}</span>`);
    getStatus(li, localePath);
    return li;
  });
};

const handleSearch = (e, els) => {
  const search = e.target.value.toLowerCase().trim();
  els.forEach((subject) => {
    if (subject.textContent.includes(search)) {
      subject.style.display = 'flex';
    } else {
      subject.style.display = 'none';
    }
  });
};

const decorateSearch = (el, current) => {
  const search = createTag('input', { class: 'locale-search', placeholder: 'Locales' });
  const icon = createTag('div', { class: 'locale-search-icon' });
  const wrapper = createTag('div', { class: 'locale-search-wrapper' }, [search, icon]);
  const localeEls = decorateLocales(current);
  const list = createTag('ul', { class: 'locales' }, localeEls);
  search.addEventListener('keyup', (e) => { handleSearch(e, localeEls); });
  el.append(wrapper, list);
};

const decorateHeader = (el, page) => {
  const currentHeading = createTag('span', null, 'Current');
  const actionsText = '<span>Edit</span><span>Preview</span><span>Live</span>';
  const actionsHeading = createTag('div', { class: 'actions' }, actionsText);
  const header = createTag('div', { class: 'sk-header' });
  header.append(currentHeading, actionsHeading);
  const currentLocale = page.locale.prefix.replace('/', '') || 'us';
  const currentPage = createTag('div', { class: 'current-page detail' }, `<span>${currentLocale}</span>`);
  const currentActions = createTag('div', { class: 'actions' }, [page.edit, page.preview, page.live]);
  currentPage.append(currentActions);
  el.append(header, currentPage);
};

function detectContext() {
  if (window.self === window.top) document.body.classList.add('in-page');
}

export default async function init(el) {
  detectContext();
  const current = await getCurrentDetails();
  decorateHeader(el, current);
  decorateSearch(el, current);
}
