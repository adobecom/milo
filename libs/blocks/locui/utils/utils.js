const LOC_CONFIG = 'https://main--milo--adobecom.hlx.page/drafts/localization/configs/config.json';
const ADMIN = 'https://admin.hlx.page';
const LANG_ACTIONS = ['Translate', 'English Copy', 'Rollout'];

const MOCK_REFERRER = 'https%3A%2F%2Fadobe.sharepoint.com%2F%3Ax%3A%2Fr%2Fsites%2Fadobecom%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257B94460FAC-CDEE-4B31-B8E0-AA5E3F45DCC5%257D%26file%3Dwesco-demofoo.xlsx';

let resourcePath;

export async function getStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const owner = urlParams.get('owner') || 'adobecom';
  const repo = urlParams.get('repo') || 'milo';
  const ref = urlParams.get('ref') || 'main';
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const resp = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${editUrl}`);
  const json = await resp.json();
  resourcePath = json.resourcePath;
  return json;
}

function getPaths(urls) {
  return urls.data.map((item) => {
    const url = new URL(item.URL);
    return url.pathname;
  });
}

export async function getProjectDetails() {
  const resp = await fetch(resourcePath);
  if (!resp.ok) return null;
  const json = await resp.json();
  const paths = getPaths(json.urls);
  const languages = json.languages.data.reduce((rdx, lang) => {
    if (LANG_ACTIONS.includes(lang.Action)) {
      lang.size = paths.length;
      rdx.push(lang);
    }
    return rdx;
  }, []);
  return { languages, paths };
}

export async function getProjectHeading() {
  const { edit } = await getStatus();
  const projectName = edit.name.split('.').shift().replace('-', ' ');
  return { name: projectName, editUrl: edit.url };
}
