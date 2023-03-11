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
  return livecopies;
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

const getEditUrl = async (owner, repo, locale, path) => {
  try {
    const res = await fetch(`${HELIX_ADMIN}/status/${owner}/${repo}/main/${locale}/${path}?editUrl=auto`);
    const json = await res.json();
    if (json.edit.status === 200) {
      return json.edit.url;
    }
    return false;
  } catch (e) {
    return false;
  }
}

const init = async (el) => {
  const livecopies = await getLivecopies();
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const referrer = params.get('referrer');
  const owner = params.get('owner');
  const repo = params.get('repo');
  let currentPath = await getWebPath(owner, repo, referrer);
  if (!currentPath) {
    return;
  }
  const currentLocale = currentPath.split('/')[1];
  const index = livecopies.indexOf(currentLocale);
  if (index > -1) {
    livecopies.splice(index, 1);
    // taking off the locale part.
    currentPath = currentPath.substring(currentPath.indexOf(currentLocale) + currentLocale.length);
  }
  livecopies.forEach(async l => {
    const editUrl = await getEditUrl(owner, repo, l, currentPath);
    if (editUrl) {
      const div = createTag('div', { class: 'sk-edit-link' })
      const link = createTag('a', { target: '_blank' });
      link.href = editUrl;
      link.innerHTML = `${l ? `/${l}` : ''}${currentPath}`;
      div.append(link);
      el.querySelector('div div').append(div);
    }
  });
  if (!el.querySelector('.sk-edit-link')) {
    const noLinkDiv = createTag('div', { class: 'sk-no-edit-link' })
    noLinkDiv.innerHTML = 'There is no other locale content.';
    el.append(noLinkDiv);
  }
}

export default init;
