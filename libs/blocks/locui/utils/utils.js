import { getConfig, getLocale } from '../../../utils/utils.js';
import { status, heading, languages, urls } from './state.js';

const LOC_CONFIG = '/drafts/localization/configs/config.json';
const ADMIN = 'https://admin.hlx.page';
const LANG_ACTIONS = ['Translate', 'English Copy', 'Rollout'];
const MOCK_REFERRER = 'https%3A%2F%2Fadobe.sharepoint.com%2F%3Ax%3A%2Fr%2Fsites%2Fadobecom%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257B94460FAC-CDEE-4B31-B8E0-AA5E3F45DCC5%257D%26file%3Dwesco-demofoo.xlsx';

const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
const ref = urlParams.get('ref') || 'main';
const origin = `https://${ref}--${repo}--${owner}.hlx.page`;
const editUrl = urlParams.get('referrer') || MOCK_REFERRER;

let resourcePath;

export async function getStatus() {
  const resp = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${editUrl}`);
  const json = await resp.json();
  resourcePath = json.resourcePath;
  return json;
}

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

async function getSiteConfig() {
  const error = { type: 'error', text: 'There was a problem loading localization settings.' };
  try {
    const resp = await fetch(`${origin}${LOC_CONFIG}`);
    if (!resp.ok) return { status: error };
    const json = await resp.json();
    return { status: undefined, config: json };
  } catch {
    // something bad happened
  }
  return { status: error };
}

export async function getProjectLocales(langs) {
  const config = await getSiteConfig();
  if (config.status?.type === 'error') return { status: config.status };
  langs.forEach((language) => {
    const found = config.config.locales.data.find(
      (locale) => language.Language === locale.language,
    );
    language.locales = found.livecopies.split(',');
  });
  return { languages: langs };
}

export async function getProjectDetails() {
  const resp = await fetch(resourcePath);
  if (!resp.ok) return null;
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
  return { origin, projectLangs, projectUrls };
}

export async function getProjectHeading() {
  const { edit } = await getStatus();
  const projectName = edit.name.split('.').shift().replace('-', ' ');
  heading.value = { name: projectName, editUrl: edit.url };
}

export async function loadLocales() {
  status.value = { type: 'Status', text: 'Loading locales.' };
  const locales = await getProjectLocales(languages.value);
  if (locales.status) {
    status.value = locales.status;
    return;
  }
  languages.value = [...locales.languages];
  status.value = {};
}

export async function loadDetails() {
  status.value = { type: 'Status', text: 'Loading languages and URLs.' };
  const { projectLangs, projectUrls } = await getProjectDetails();
  languages.value = projectLangs;
  urls.value = projectUrls;
}
