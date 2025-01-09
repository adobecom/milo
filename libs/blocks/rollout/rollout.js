import { createTag } from '../../utils/utils.js';

let urlData = {};

const getLanguageCode = (url) => {
  try {
    const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
    const langPattern = /^[a-z]{2,3}(-[A-Za-z]{4})?(-[A-Za-z0-9]{2,3})?$/;

    return (pathSegments[0] === 'langstore' && langPattern.test(pathSegments[1]))
      ? pathSegments[1]
      : 'root';
  } catch {
    return null;
  }
};

const getReferrer = () => {
  const referrer = new URLSearchParams(window.location.search).get('referrer');
  return decodeURIComponent(referrer);
};

const setUrlData = (url, allowEmptyPaths = false) => {
  const urlParts = url.split('--');
  if (urlParts.length !== 3) {
    return null;
  }

  const hlxPageIndex = urlParts[2].indexOf('.hlx.page');
  const aemPageIndex = urlParts[2].indexOf('.aem.page');
  const pageIndex = hlxPageIndex >= 0 ? hlxPageIndex : aemPageIndex;
  const pageType = hlxPageIndex >= 0 ? '.hlx.page' : '.aem.page';

  const pathLengthCheck = allowEmptyPaths ? pageType.length - 1 : pageType.length;
  if (pageIndex < 0 || pageIndex + pathLengthCheck >= urlParts[2].length) {
    return null;
  }

  urlData = {
    urlBranch: urlParts[0].slice(8), // remove "https://"
    urlRepo: urlParts[1],
    urlOwner: urlParts[2].slice(0, pageIndex),
    urlPathRemainder: urlParts[2].slice(pageIndex + pageType.length),
    currentPageLang: getLanguageCode(url),
    host: new URLSearchParams(window.location.search).get('host'),
    project: new URLSearchParams(window.location.search).get('project'),
    referrer: getReferrer(),
  };
  return urlData;
};

const buildUi = async (el, previewUrl) => {
  const modal = createTag('div', { class: 'modal' });
  const radioGroup = createTag('div', { class: 'radio-group' });
  const envLabel = createTag('div', { class: 'env-label' }, 'Environment');
  radioGroup.appendChild(envLabel);

  const stageLabel = createTag('label');
  const stageRadio = createTag('input', {
    type: 'radio',
    name: 'deployTarget',
    value: 'stage',
    required: true,
    checked: true,
  });
  stageLabel.appendChild(stageRadio);
  stageLabel.appendChild(document.createTextNode('Stage'));

  const prodLabel = createTag('label');
  const prodRadio = createTag('input', {
    type: 'radio',
    name: 'deployTarget',
    value: 'prod',
    required: true,
  });
  prodLabel.appendChild(prodRadio);
  prodLabel.appendChild(document.createTextNode('Prod'));

  radioGroup.appendChild(stageLabel);
  radioGroup.appendChild(prodLabel);

  const rolloutBtn = createTag('button', { class: 'rollout-btn' });
  rolloutBtn.append(
    createTag('span', { class: 'rollout-btn-text' }, 'Rollout'),
  );

  rolloutBtn.addEventListener('click', () => {
    const selectedEnv = document.querySelector('input[name="deployTarget"]:checked').value;
    const locV3ConfigUrl = new URL(
      'tools/locui-create',
      `https://${urlData.urlBranch}--${urlData.urlRepo}--${urlData.urlOwner}.hlx.page`,
    );
    locV3ConfigUrl.searchParams.append('milolibs', 'milostudio-stage');
    locV3ConfigUrl.searchParams.append('ref', urlData.urlBranch);
    locV3ConfigUrl.searchParams.append('repo', urlData.urlRepo);
    locV3ConfigUrl.searchParams.append('owner', urlData.urlOwner);
    locV3ConfigUrl.searchParams.append('host', urlData.host);
    locV3ConfigUrl.searchParams.append('project', urlData.project);
    locV3ConfigUrl.searchParams.append('env', selectedEnv);
    locV3ConfigUrl.searchParams.append('type', 'rollout');
    locV3ConfigUrl.searchParams.append('encodedUrls', previewUrl);
    locV3ConfigUrl.searchParams.append('language', urlData.currentPageLang);
    window.open(locV3ConfigUrl, '_blank');
  });

  const buttonGroup = createTag('div', { class: 'button-group' });
  modal.appendChild(radioGroup);
  buttonGroup.appendChild(rolloutBtn);
  modal.appendChild(buttonGroup);

  el.appendChild(modal);
};

const setup = async (el) => {
  const previewUrl = getReferrer();
  const data = setUrlData(previewUrl, true);
  if (!data) {
    el.innerHTML = '<div class="modal">Invalid URL format</div>';
    return;
  }
  el.innerHTML = '';
  await buildUi(el, previewUrl);
};

export default async function init(el) {
  try {
    await setup(el);
    return true;
  } catch {
    return false;
  }
}
