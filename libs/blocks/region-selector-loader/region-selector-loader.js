import { createTag } from '../../utils/utils.js';

const LOC_CONFIG = 'https://main--milo--adobecom.hlx.page/drafts/localization/configs/config.json';
const HELIX_ADMIN = 'https://admin.hlx.page';

const getLivecopies = async () => {
  const livecopies = [];
  const res = await fetch(LOC_CONFIG);
  const json = await res.json();
  json.locales.data.forEach((d) => {
    livecopies.push(...d.livecopies.split(','));
  });
  return livecopies.sort();
};

const getWebPath = async (owner, repo, referrer) => {
  try {
    const res = await fetch(`${HELIX_ADMIN}/status/${owner}/${repo}/ref?editUrl=${referrer}`);
    const json = await res.json();
    return json.webPath;
  } catch (e) {
    return false;
  }
}

const getStatusFromHelixAdmin = async (owner, repo, locale, path) => {
  try {
    const res = await fetch(`${HELIX_ADMIN}/status/${owner}/${repo}/main/${locale}/${path}?editUrl=auto`);
    const json = await res.json();
    if (json.edit.status === 200) {
      return json;
    }
  } catch (e) { /* ignore */ }
  return false;
}

const insertAlphabetically = (ul, li) => {
  const locale = li.dataset.locale;
  const items = [...ul.getElementsByTagName('li')];
  const insertBefore = items.find((item) => locale < item.dataset.locale);
  if (insertBefore) {
    ul.insertBefore(li, insertBefore);
  } else {
    ul.append(li);
  }
};

const decorateRegionLinks = async (block) => {
  const livecopies = await getLivecopies();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const referrer = params.get('referrer');
  const owner = params.get('owner');
  const repo = params.get('repo');
  
  if (!owner || !repo || !referrer) return;
  
  const currentPath = await getWebPath(owner, repo, referrer);
  
  let currentPathWithOutLocale = currentPath;
  if (!currentPath) {
    return;
  }
  const currentLocale = currentPath.split('/')[1];
  const index = livecopies.indexOf(currentLocale);
  if (index > -1) {
    livecopies.splice(index, 1);
    currentPathWithOutLocale = currentPath.substring(currentPath.indexOf(currentLocale) + currentLocale.length);
  }
  
  const editUrls = new Set();
  const ul = createTag('ul', { class: 'sk-edit-links' });
  livecopies.forEach(async l => {
    const adminStatus = await getStatusFromHelixAdmin(owner, repo, l, currentPathWithOutLocale);
    if (adminStatus && !editUrls.has(adminStatus.edit.url)) {
      if (adminStatus.webPath === currentPath) return;
      const item = createTag('div', { class: 'sk-region-select-item' });
      const li = createTag('li', { class: 'sk-edit-list', 'data-locale': l});
      const previewContainer = createTag('div', { class: 'sk-preview-container' });
      const previewLink = createTag('a', { class: 'sk-preview-link', target: '_blank' });
      const editLink = createTag('a', { class: 'sk-edit-link', target: '_blank' });
      previewLink.innerHTML = adminStatus.webPath;
      if (adminStatus.preview.status === 200) {
        previewLink.classList.add('previewed');
        previewLink.href = adminStatus.preview.url;
        const checkmark = createTag('span', { class: 'icon icon-checkmark'});
        checkmark.innerHTML = `<svg id="checkmark" viewBox="0 0 18 18" class="icon-milo icon-milo-checkmark"><path fill="currentcolor" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"></path></svg>`;
        previewContainer.append(checkmark);
      }
      editLink.href = adminStatus.edit.url;
      editLink.innerHTML = 'Edit';

      previewContainer.append(previewLink);
      item.append(previewContainer);
      item.append(editLink);
      li.append(item);
      insertAlphabetically(ul, li);
      editUrls.add(adminStatus.edit.url);
    }
  });
  block.querySelector('div').append(ul);
};

const init = async (block) => {
  await decorateRegionLinks(block);
}

export default init;
