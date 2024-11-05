/* eslint-disable no-continue */
import { loadScript, loadStyle } from '../../libs/utils/utils.js';
import { getImsToken } from '../utils/utils.js';
import {
  loadTingleModalFiles,
  showAlert,
  showConfirm,
} from './send-to-caas.js';
import {
  getCardMetadata,
  getCaasProps,
  loadCaasTags,
  postDataToCaaS,
  getConfig,
  setConfig,
} from './send-utils.js';
import comEnterpriseToCaasTagMap from './comEnterpriseToCaasTagMap.js';

const LS_KEY = 'bulk-publish-caas';
const FIELDS = ['preset', 'host', 'repo', 'owner', 'caasEnv', 'urls', 'contentType', 'publishToFloodgate'];
const FIELDS_CB = ['publishToDraft', 'useHtml', 'usePreview'];
const DEFAULT_VALUES = {
  preset: 'default',
  caasEnv: 'prod',
  contentType: 'caas:content-type/article',
  excelFile: '',
  host: 'business.adobe.com',
  owner: 'adobecom',
  repo: 'bacom',
  urls: '',
  publishToFloodgate: 'default',
};
const DEFAULT_VALUES_CB = {
  publishToDraft: true,
  usePreview: false,
  useHtml: true,
};

const useDarkTheme = localStorage.getItem('bp-theme') === 'dark'
  ? true
  : localStorage.getItem('bp-theme') === 'light' 
    ? false
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

if (useDarkTheme) {
  document.querySelector('.bulk-publisher').classList.add('dark');
  document.querySelector('#option-dark').checked = true;
} else {
  document.querySelector('#option-light').checked = true;
}

const fetchExcelJson = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const json = await resp.json();
    return json.data;
  }
  return [];
};

const checkIms = async (prompt = true) => {
  if (location.search.includes('mode=dev')) return 'fake-token';
  
  const accessToken = await getImsToken(loadScript);
  if (!accessToken && prompt) {
    const shouldLogIn = await showConfirm(
      'You must be logged in with an Adobe ID in order to publish to CaaS.\nDo you want to log in?',
    );
    if (shouldLogIn) {
      const { signInContext } = getConfig();
      window.adobeIMS.signIn(signInContext);
    }
    return false;
  }
  return accessToken;
};

const getPageDom = async (url, now) => {
  try {
    const resp = await fetch(`${url}?date=${now.getTime()}`);
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
  const now  = new Date();

  const statusModal = showAlert('', { btnText: 'Cancel', onClose: () => { keepGoing = false; } });
  const {
    caasEnv,
    publishToDraft,
    host,
    owner,
    repo,
    useHtml,
    usePreview,
    publishToFloodgate,
  } = getConfig();

  if (!repo) {
    showAlert('You must select a Preset, or use the Advanced option to enter the necessary information.', { error: true });
    if (statusModal.modal) statusModal.close();
    return;
  }

  let domain = `https://${host}`;

  if (usePreview || publishToFloodgate !== 'default') {
    domain = `https://main--${repo}--${owner}.hlx.live`;
  }

  for (const page of data) {
    if (!keepGoing) break;

    try {
      const rawUrl = page.Path || page.path || page.url || page.URL || page.Url || page;

      const { pathname } = new URL(rawUrl);
      const pathnameNoHtml = pathname.replace('.html', '');
      const pageUrl = usePreview ? `${domain}${pathnameNoHtml}` : `${domain}${pathname}`;
      const prodUrl = `${host}${pathnameNoHtml}${useHtml ? '.html' : ''}`;

      index += 1;
      statusModal.setContent(`Publishing ${index} of ${data.length}:<br>${pageUrl}`);

      if (pageUrl === 'stop') break; // debug, stop on empty line

      const { dom, error, lastModified } = await getPageDom(pageUrl, now);
      if (error) {
        errorArr.push([pageUrl, error]);
        continue;
      }

      setConfig({ bulkPublish: true, doc: dom, pageUrl, lastModified });
      const { caasMetadata, errors } = await getCardMetadata({
        prodUrl,
        floodgatecolor: publishToFloodgate,
      });

      if (errors.length) {
        errorArr.push([pageUrl, errors]);
        continue;
      }

      const tagField = page['cq:tags'] || page.tags;
      if (tagField) {
        const updatedTags = updateTagsFromSheetData(caasMetadata.tags, tagField);
        caasMetadata.tags = updatedTags;
      }

      if (!caasMetadata.tags.length) {
        errorArr.push([pageUrl, 'No tags on page']);
        continue;
      }

      const caasProps = getCaasProps(caasMetadata);

      const response = await postDataToCaaS({
        accessToken,
        caasEnv: caasEnv?.toLowerCase(),
        caasProps,
        publishToDraft,
      });

      if (response.success) {
        successArr.push([pageUrl, caasMetadata.entityid]);
      } else {
        errorArr.push([pageUrl, response]);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`ERROR: ${e.message}`);
    }
  }

  if (statusModal.modal) statusModal.close();

  document.querySelector('.status-signed-in').style.display = 'none';
  document.querySelector('.status-signed-out').style.display = 'none';
  resetStatusTables()
  if (successArr.length) {
    showSuccessTable(successArr);
  }
  if (errorArr.length) {
    showErrorTable(errorArr);
  }

  showAlert(`Successfully published ${successArr.length} pages. \n\n Failed to publish ${errorArr.length} pages.`);
};

function resetStatusTables() {
  const successTable = document.querySelector('.success-table');
  const successTBody = successTable.querySelector('tbody');
  successTBody.innerHTML = '';
  successTable.style.display = 'none';
  const errorTable = document.querySelector('.error-table');
  const errorTBody = errorTable.querySelector('tbody');
  errorTBody.innerHTML = '';
  errorTable.style.display = 'none';
}

function showSuccessTable(successArr) {
  const env = getConfig().caasEnv === 'prod' ? '' : `-${getConfig().caasEnv}`;
  const chimeraEndpoint = `https://14257-chimera${env}.adobeioruntime.net/api/v1/web/chimera-0.0.1/collection?debug=1&featuredCards=`;
  const successTable = document.querySelector('.success-table');
  const tableBody = successTable.querySelector('tbody');
  successTable.style.display = 'block';
  successArr.forEach(([pageUrl, response]) => {
    tableBody.innerHTML += `<tr>
      <td class="ok">OK</td>
      <td><a href="${pageUrl}" title="View page">${pageUrl}</a></td>
      <td class="entityid"><a target="_blank" href="${chimeraEndpoint}${response}" title="View Card JSON">${response}</a></td>
      <!-- td class="entityid" data-entity-id="${response}">${response}</td -->
    </tr>`;
  });
}

function showErrorTable(errorArr) {
  const errorTable = document.querySelector('.error-table');
  const tableBody = errorTable.querySelector('tbody');
  errorTable.style.display = 'block';
  errorArr.forEach(([pageUrl, response]) => {
    const message = response.error ? response.error.replace(/:.*/, '') : response;
    tableBody.innerHTML += `<tr><td class="error">Failed</td><td><a href="${pageUrl}">${pageUrl}</a></td><td>${message}</td></tr>`;
  });
}

const bulkPublish = async () => {
  const accessToken = await checkIms();
  if (!accessToken) return;

  const { excelFile, urls } = getConfig();

  if (!(excelFile || urls)) {
    await showAlert('Please enter urls or an excel json url.');
  }

  const data = urls
    ? urls.split('\n')
    : await fetchExcelJson(excelFile);

  await processData(data, accessToken);
};

const loadFromLS = () => {
  document.body.classList = '';
  const ls = localStorage.getItem(LS_KEY);
  if (!ls || !ls.includes('preset')) return;
  try {
    setConfig(JSON.parse(ls));
    const config = getConfig();
    FIELDS.forEach((field) => {
      document.getElementById(field).value = config[field] ?? DEFAULT_VALUES[field];
      if (field === 'preset' && config[field] === 'advanced') {
        document.body.classList = 'advanced';
      } else if (field === 'preset' && config[field] !== 'default') {
        document.body.classList = 'preset';
      }
    });
    FIELDS_CB.forEach((field) => {
      document.getElementById(field).checked = config[field] ?? DEFAULT_VALUES_CB[field];
    });

    /* c8 ignore next */
  } catch (e) { /* do nothing */ }
 
  if (caasEnv.value === 'prod' && !publishToDraft.checked) {
    publishWarning.style.height = '30px';
  }
};

const separator = document.querySelector('.separator');
const parent = separator.parentElement;

const presetsJsonPath = 'https://milo.adobe.com/drafts/caas/bppresets.json';

let presetsData = {};

const PRESETS = fetchExcelJson(presetsJsonPath).then((presets) => {
    presetsData = presets;
    presets.forEach((preset) => {
      const option = document.createElement('option');
      option.value = preset.repo;
      option.text = `${preset.name} (${preset.repo})`;
      parent.insertBefore(option, separator);
    });
  });

preset.addEventListener('change', () => {
  const { value } = preset;
  const selectedPreset = presetsData.find(item => item.id === value) || {};
  document.body.classList = '';
  
  if (value === 'advanced') {
    document.body.classList.add('advanced');
    return;
  } else if (value === 'default') {
    document.body.classList = '';
  } else {
    document.body.classList.add('preset');
  }

  const ls = localStorage.getItem(LS_KEY);
  const config = ls ? JSON.parse(ls) : {};
  config.preset = selectedPreset.id || 'default';
  config.host = selectedPreset.host || '';
  config.owner = selectedPreset.owner || '';
  config.repo = selectedPreset.repo || '';
  config.contentType = selectedPreset.contentType;
  setConfig(config);
  window.localStorage.setItem(LS_KEY, JSON.stringify(getConfig()));
  loadFromLS();
});

const publishWarning =  document.querySelector('.publish-warning');
caasEnv.addEventListener('change', () => {
  const { value } = caasEnv;
  if (value === 'prod') {
    publishWarning.style.height = '30px';
  } else {
    publishWarning.style.height = '0';
  }
});

publishToDraft.addEventListener('change', () => {
  const { checked } = publishToDraft;
  if (caasEnv.value === 'prod' && !checked) {
    publishWarning.style.height = '30px';
  } else {
    publishWarning.style.height = '0';
  }
});

const checkUserStatus = async () => {
  const accessToken = await checkIms(false);
  if (accessToken) {
    document.querySelector('.status-checking').style.display = 'none';
    document.querySelector('.status-signed-in').style.display = 'block';
  } else {
    document.querySelector('.status-checking').style.display = 'none';
    document.querySelector('.status-signed-out').style.display = 'block';
  }
  return true;
}

const helpButtons = document.querySelectorAll('.help');
helpButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const el = e.target.classList[1]

    if (el === 'use-preview') {
      showAlert(`<p><b>Use Preview Content</b>
        <p>When this option is checked, the tool will publish content from:
        <p><tt>https://main--{repo}--{owner}.hlx.live</tt>
        <p>This can be useful for testing before publishing to production.</p>`);

    } else if (el === 'host') {
      showAlert(`<p><b>Host</b><p>Enter the host of the site you are publishing content to.</p>
        <p>
         <tt>&nbsp; milo.adobe.com</tt> <br>
         <tt>&nbsp; blog.adobe.com</tt> <br>
         <tt>&nbsp; business.adobe.com</tt>.</p>`);

      } else if (el === 'repo') {
        showAlert(`<p><b>Repo</b></p>
          <p>The <b>Repo</b> is the name of the repository where the content will be published.</p>
          <p>For example:</p>
          <p><tt>https://main--<b>{repo}</b>--{owner}.hlx.live</tt>`);

      } else if (el === 'owner') {
        showAlert(`<p><b>Repo Owner</b></p>
          <p>The <b>Repo Owner</b> is the owner of the repository where the content will be published. For example:</p>
          <p>For example:</p>
          <p><tt>https://main--{repo}--<b>{owner}</b>.hlx.live</tt>`);

      } else if (el === 'publish-to-draft') {   
        showAlert(`<p><b>Publish to CaaS DRAFT only</b></p>
          <p>When this is option checked, the content will be sent to the CaaS <b>DRAFT</b> container <i>only</i>. </p>
          <p>With this option unchecked, the content is sent to both, the CaaS <b>LIVE</b> and <b>DRAFT</b> containers.</p>`);
          
      } else if (el === 'floodgate') {   
        showAlert(`<p><b>FloodGate</b></p>
          <p>Use this option to select the <b>FloodGate</b> color for the content.</p>`);

      } else if (el === 'use-html') {
        showAlert(`<p><b>Add HTML to Links</b></p>
          <p>When this option is checked, the bulkpublisher will add the <b>.html</b> extension to the CTA links.</p>`);

      } else if (el === 'content-type-fallback') {   
        showAlert(`<p><b>ContentType Fallback</b></p>
          <p>This is the <b>content-type</b> tag that will be applied to all cards that do not have 
          a specific <b>content-type</b> tag included in their metadata.</p>`);

    } else {
        showAlert(`<p><b>Help</b><p>Help for "${el}" is on its way! Stay tuned.</p>`);
    }
  });
}
);

const themeOptions = document.querySelectorAll('.theme-options');
themeOptions.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (e.target.value === "dark") {
      document.querySelector('.bulk-publisher').classList.add('dark');
      localStorage.setItem('bp-theme', 'dark');

    } else {
      document.querySelector('.bulk-publisher').classList.remove('dark');
      localStorage.setItem('bp-theme', 'light');
    }
  });
});


const init = async () => {
  await loadTingleModalFiles(loadScript, loadStyle);
  await loadCaasTags();
  loadFromLS();
  checkUserStatus();

  window.addEventListener('beforeunload', () => {
    FIELDS.forEach((field) => {
      setConfig({ [field]: document.getElementById(field).value });
    });
    FIELDS_CB.forEach((field) => {
      setConfig({ [field]: document.getElementById(field).checked });
    });
    window.localStorage.setItem(LS_KEY, JSON.stringify(getConfig()));
  });

  const bulkPublishBtn = document.querySelector('#bulkpublish');
  bulkPublishBtn.addEventListener('click', () => {
    setConfig({
      host: document.getElementById('host').value,
      project: '',
      branch: 'main',
      caasEnv: document.getElementById('caasEnv').value || 'prod',
      contentType: document.getElementById('contentType').value,
      repo: document.getElementById('repo').value,
      owner: document.getElementById('owner').value,
      urls: document.getElementById('urls').value,
      publishToFloodgate: document.getElementById('publishToFloodgate').value,
      publishToDraft: document.getElementById('publishToDraft').checked,
      useHtml: document.getElementById('useHtml').checked,
      usePreview: document.getElementById('usePreview').checked,
    });
    bulkPublish();
  });
};

export default init;
