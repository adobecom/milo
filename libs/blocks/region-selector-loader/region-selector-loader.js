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
  livecopies.forEach(async l => {
    const editUrl = await getEditUrl(owner, repo, l, currentPathWithOutLocale);
    if (editUrl && !editUrls.has(editUrl)) {
      const previewUrl = `${l ? `/${l}` : ''}${currentPathWithOutLocale}`;
      if(previewUrl === currentPath) return;

      const div = createTag('div', { class: 'sk-edit-link' })
      const link = createTag('a', { target: '_blank' });
      link.href = editUrl;
      link.innerHTML = previewUrl;
      div.append(link);
      el.querySelector('div div').append(div);
      editUrls.add(editUrl);
    }
  });
}

export default init;
