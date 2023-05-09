import { getConfig, getLocale } from '../../../utils/utils.js';
import { heading, languages, urls, getSiteConfig, setStatus } from '../utils/state.js';
import { getStatus, preview } from '../utils/franklin.js';

const LANG_ACTIONS = ['Translate', 'English Copy', 'Rollout'];
const MOCK_REFERRER = 'https%3A%2F%2Fadobe.sharepoint.com%2F%3Ax%3A%2Fr%2Fsites%2Fadobecom%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257B94460FAC-CDEE-4B31-B8E0-AA5E3F45DCC5%257D%26file%3Dwesco-demo.xlsx';

const urlParams = new URLSearchParams(window.location.search);

let resourcePath;
let previewPath;

export function getUrls(jsonUrls) {
  const { locales } = getConfig();
  // Assume all URLs will be the same locale as the first URL
  const locale = getLocale(locales, jsonUrls[0].pathname);
  const langstorePrefix = locale.prefix ? `/langstore${locale.prefix}` : '/langstore/en';
  // Loop through each url to get langstore information
  return jsonUrls.map((url) => {
    url.langstore = {
      lang: locale.prefix ? locale.prefix.replace('/', '') : 'en',
      pathname: url.pathname.replace(locale.prefix, langstorePrefix),
    };
    return url;
  });
}

async function loadLocales() {
  const config = await getSiteConfig();
  languages.value.forEach((language) => {
    const found = config.locales.data.find(
      (locale) => language.Language === locale.language,
    );
    language.locales = found.livecopies.split(',');
  });
  languages.value = [...languages.value];
}

async function loadDetails() {
  setStatus('details', 'info', 'Loading languages and URLs.');
  try {
    const resp = await fetch(previewPath);
    const json = await resp.json();
    const jsonUrls = json.urls.data.map((item) => new URL(item.URL));
    const projectUrls = getUrls(jsonUrls);
    const projectLangs = json.languages.data.reduce((rdx, lang) => {
      if (LANG_ACTIONS.includes(lang.Action)) {
        lang.size = projectUrls.length;
        rdx.push(lang);
      }
      return rdx;
    }, []);
    languages.value = projectLangs;
    urls.value = projectUrls;
    setStatus('details');
  } catch {
    setStatus('details', 'error', 'Error loading languages and URLs.');
  }
}

async function loadHeading() {
  setStatus('details', 'info', 'Getting latest project info.');
  const editUrl = urlParams.get('referrer') || MOCK_REFERRER;
  const json = await getStatus('', editUrl);
  resourcePath = json.resourcePath;
  previewPath = json.preview.url;
  const path = resourcePath.replace(/\.[^/.]+$/, '');
  setStatus('details');
  const projectName = json.edit.name.split('.').shift().replace('-', ' ');
  heading.value = { name: projectName, editUrl: json.edit.url, path };
  await preview(`${path}.json`);
}

export default async function setDetails() {
  await loadHeading();
  await loadDetails();
  await loadLocales();
}
