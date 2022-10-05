/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import {
  loadTingleModalFiles,
  showAlert,
  showConfirm,
} from './send-to-caas.js';
import {
  getCardMetadata,
  getCaasProps,
  getImsToken,
  loadCaasTags,
  postDataToCaaS,
  getConfig,
  setConfig,
} from './send-utils.js';
import comEnterpriseToCaasTagMap from './comEnterpriseToCaasTagMap.js';

const LS_KEY = 'bulk-publish-caas';

const fetchExcelJson = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const json = await resp.json();
    return json.data;
  }
  return [];
};

const checkIms = async () => {
  const accessToken = await getImsToken();
  if (!accessToken) {
    const shouldLogIn = await showConfirm(
      'You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?',
    );
    if (shouldLogIn) {
      window.adobeIMS.signIn();
    }
    return false;
  }
  return accessToken;
};

const getPageDom = async (url) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return { error: `${resp.status}: ${resp.statusText}` };
    const html = await resp.text();
    const dp = new DOMParser();
    const dom = dp.parseFromString(html, 'text/html');
    return { dom, lastModified: resp.headers.get('last-modified') };
  } catch (err) {
    return { error: err.message };
  }
};

const updateTagsFromSheetData = (tags, sheetTagsStr) => {
  const sheetTags = sheetTagsStr.split(',');
  const tagSet = new Set(tags.map((t) => t.id));

  sheetTags.forEach((sheetTag) => {
    if (sheetTag.startsWith('caas:')) {
      tagSet.add(sheetTag);
      return;
    }
    const newTag = comEnterpriseToCaasTagMap[sheetTag];
    if (newTag) {
      tagSet.add(newTag);
    }
  });

  return [...tagSet].map((t) => ({ id: t }));
};

const processData = async (data, accessToken) => {
  const errorArr = [];
  const successArr = [];
  let index = 0;
  let keepGoing = true;

  const statusModal = showAlert('', { btnText: 'Cancel', onClose: () => { keepGoing = false; } });

  // eslint-disable-next-line no-restricted-syntax
  for (const page of data) {
    if (!keepGoing) break;
    try {
      const pageUrl = page.Path || page.path || page.url || page.URL || page.Url;

      index += 1;
      statusModal.setContent(`Publishing ${index} of ${data.length}:<br>${pageUrl}`);

      if (pageUrl === 'stop') break; // debug, stop on empty line

      const { dom, error, lastModified } = await getPageDom(pageUrl);
      if (error) {
        errorArr.push({ url: pageUrl, error });
        continue;
      }

      setConfig({ bulkPublish: true, doc: dom, pageUrl, lastModified });
      const { caasMetadata, errors } = await getCardMetadata({ prodUrl: pageUrl.replace('https://', '') });

      if (errors.length) {
        errorArr.push({ url: pageUrl, error: errors.join('\n') });
        continue;
      }

      const tagField = page['cq:tags'] || page.tags;
      if (tagField) {
        const updatedTags = updateTagsFromSheetData(caasMetadata.tags, tagField);
        caasMetadata.tags = updatedTags;
      }

      const caasProps = getCaasProps(caasMetadata);

      const { caasEnv, draftOnly } = getConfig();

      const response = await postDataToCaaS({
        accessToken,
        caasEnv: caasEnv?.toLowerCase(),
        caasProps,
        draftOnly,
      });

      if (response.success) {
        successArr.push({ url: pageUrl, caasMetadata });
      } else {
        errorArr.push({ url: pageUrl, response });
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }

  if (statusModal.modal) statusModal.close();

  document.getElementById('errors').value = JSON.stringify(errorArr, null, 2);
  document.getElementById('success').value = JSON.stringify(successArr, null, 2);
  showAlert(`Successfully published ${successArr.length} pages. \n\n Failed to publish ${errorArr.length} pages.`);
};

const bulkPublish = async () => {
  const accessToken = await checkIms();
  if (!accessToken) return;

  const excelJsonUrl = getConfig().excelFile;
  if (!excelJsonUrl) {
    await showAlert('Please enter an excel json url.');
  }

  const data = await fetchExcelJson(excelJsonUrl);
  await processData(data, accessToken);
};

const loadFromLS = () => {
  const ls = localStorage.getItem(LS_KEY);
  if (ls) {
    try {
      setConfig(JSON.parse(ls));
      /* c8 ignore next */
    } catch (e) {}
  }
  const fieldIds = ['host', 'repo', 'owner', 'excelFile', 'caasEnv'];
  const defaults = {
    excelFile: '',
    host: 'business.adobe.com',
    repo: 'bacom',
    owner: 'adobecom',
    caasEnv: 'Prod',
  };
  const config = getConfig();
  fieldIds.forEach((field) => {
    document.getElementById(field).value = config[field] || defaults[field];
  });
};

const init = async () => {
  await loadTingleModalFiles();
  await loadCaasTags();
  loadFromLS();

  window.addEventListener('beforeunload', () => {
    const fieldIds = ['host', 'repo', 'owner', 'excelFile', 'caasEnv'];
    fieldIds.forEach((field) => {
      setConfig({ [field]: document.getElementById(field).value });
    });
    window.localStorage.setItem(LS_KEY, JSON.stringify(getConfig()));
  });

  const bulkPublishBtn = document.querySelector('#bulkpublish');
  bulkPublishBtn.addEventListener('click', () => {
    setConfig({
      host: document.getElementById('host').value,
      project: '',
      branch: 'main',
      repo: document.getElementById('repo').value,
      owner: document.getElementById('owner').value,
    });
    bulkPublish();
  });
};

export default init;
