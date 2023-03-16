import { createTag } from '../../utils/utils.js';

const LOC_CONFIG = 'https://main--milo--adobecom.hlx.page/drafts/localization/configs/config.json';
const HELIX_ADMIN = 'https://admin.hlx.page';
const ADOBE_ICON = '<img class="icon" src="/libs/blocks/regions-loader/img/Adobe_Experience_Cloud_logo_RGB.svg">';
const WORD_ICON = '<img class="icon" src="/libs/blocks/regions-loader/img/word-icon.svg">';

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
    if (!res.ok) return false;
    const json = await res.json();
    return json;
  } catch (e) { /* ignore */ }
  return false;
}

const insertAlphabetically = (containerParent, itemContainer) => {
  const locale = itemContainer.dataset.locale;
  const items = [...containerParent.querySelectorAll('.sk-region-select-item-container')];
  const insertBefore = items.find((item) => locale < item.dataset.locale);
  if (insertBefore) {
    containerParent.insertBefore(itemContainer, insertBefore);
  } else {
    containerParent.append(itemContainer);
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
  
  let currentPath;
  if (referrer.includes('google.com') || referrer.includes('sharepoint.com')) {
    currentPath = await getWebPath(owner, repo, referrer);
  } else {
    currentPath = new URL(referrer).pathname;
  }
    
  let currentPathWithOutLocale = currentPath;
  if (!currentPath) {
    return;
  }
  const currentLocale = currentPath.split('/')[1];
  const index = livecopies.indexOf(currentLocale);
  if (index > -1) {
    currentPathWithOutLocale = currentPath.substring(currentPath.indexOf(currentLocale) + currentLocale.length);
  }
  
  const locales = new Set(livecopies);
  const containerParent = createTag('div', { class: 'sk-region-select-item-containers' });
  locales.forEach(async loc => {
    const adminStatus = await getStatusFromHelixAdmin(owner, repo, loc, currentPathWithOutLocale);
    const itemContainer = createTag('div', { class: 'sk-region-select-item-container', 'data-locale': loc});
    const item = createTag('div', { class: 'sk-region-select-item' });

    const localeText = createTag('div', { class: 'locale-text' });
    localeText.innerHTML = loc || 'en_us';

    const linkContainer = createTag('div', { class: 'sk-link-container' });
    const editLink = createTag('a', { class: 'sk-edit-link disabled', target: '_blank' });
    const previewLink = createTag('a', { class: 'sk-preview-link disabled', target: '_blank' });
    const liveLink = createTag('a', { class: 'sk-live-link disabled', target: '_blank' });
    
    editLink.innerHTML = WORD_ICON;
    previewLink.innerHTML = ADOBE_ICON;
    liveLink.innerHTML = ADOBE_ICON;
    
    if (adminStatus.edit.status === 200) {
      editLink.classList.remove('disabled');
      editLink.href = adminStatus.edit.url;
    }
    
    if (adminStatus.preview.status === 200) {
      previewLink.classList.remove('disabled');
      previewLink.href = adminStatus.preview.url;
    }

    if (adminStatus.live.status === 200) {
      liveLink.classList.remove('disabled');
      liveLink.href = adminStatus.live.url;
    }
    
    linkContainer.append(editLink, previewLink, liveLink);
    item.append(localeText, linkContainer);
    itemContainer.append(item);

    if (adminStatus.webPath === currentPath) {
      const origin = document.referrer;
      if (origin.includes('google.com') || origin.includes('sharepoint.com')) {
        editLink.style.opacity = 0;
        editLink.removeAttribute('href');
      } else if(origin.includes('hlx.page')) {
        previewLink.style.opacity = 0;
        previewLink.removeAttribute('href');
      } else {
        liveLink.style.opacity = 0;
        liveLink.removeAttribute('href');
      }
      itemContainer.classList.add('current');
      const localeHeader = block.querySelector('.locale-header');
      localeHeader.parentElement.insertBefore(itemContainer, localeHeader);
    } else {
      insertAlphabetically(containerParent, itemContainer);
    }
  });
  block.querySelector('div').append(containerParent);
};

const searchEvent = (e) => {
  const search = regionsSearch.value;
  const subjects = document.querySelectorAll('.sk-region-select-item-containers .sk-region-select-item-container');
  subjects.forEach(subject => {
    if (subject.textContent.includes(search)) {
      subject.style.display = 'block';
    } else {
      subject.style.display = 'none';
    }
  });
}

const decorateHeader = (block) => {
  const headingParent = block.querySelector('h1, h2, h3')?.parentElement;
  headingParent.classList.add('sk-header');
  const rightHeading = createTag('div', { class: 'right-headings' });
  rightHeading.innerHTML = '<div>EDIT</div><div>PREVIEW</div><div>LIVE</div>';
  headingParent.append(rightHeading);
  
  const localeHeader = createTag('div', { class: 'sk-header locale-header' });
  const localeHeading = createTag('h2');
  const searchInput = createTag('input',{ id: 'regionsSearch', class: 'sk-regions-search', placeholder: 'Search...' });
  searchInput.addEventListener('keyup', searchEvent);
  localeHeading.innerHTML = 'LOCALES';
  localeHeader.append(localeHeading);
  localeHeader.append(searchInput);
  headingParent.parentElement.append(localeHeader);
}

const init = async (block) => {
  decorateHeader(block);
  await decorateRegionLinks(block);
}

export default init;
