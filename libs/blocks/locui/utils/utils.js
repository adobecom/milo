import { getConfig, getLocale } from '../../../utils/utils.js';

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

export async function getUrlDetails(urls) {
  const { locales } = getConfig();
  // Assume all URLs will be the same locale as the first URL
  const locale = getLocale(locales, urls[0].pathname);
  const langstorePrefix = locale.prefix ? `/langstore${locale.prefix}` : '/langstore/en';
  // Loop through each url to get langstore information
  return urls.map((url) => {
    url.langstore = {
      lang: locale.prefix ? locale.prefix.replace('/', '') : 'en',
      pathname: url.pathname.replace(locale.prefix, langstorePrefix),
    };
    return url;
  });
}

export async function getProjectDetails() {
  const resp = await fetch(resourcePath);
  if (!resp.ok) return null;
  const json = await resp.json();
  const projectUrls = json.urls.data.map((item) => new URL(item.URL));
  const languages = json.languages.data.reduce((rdx, lang) => {
    if (LANG_ACTIONS.includes(lang.Action)) {
      lang.size = projectUrls.length;
      rdx.push(lang);
    }
    return rdx;
  }, []);
  return { languages, projectUrls };
}

export async function getProjectHeading() {
  const { edit } = await getStatus();
  const projectName = edit.name.split('.').shift().replace('-', ' ');
  return { name: projectName, editUrl: edit.url };
}
