/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import './locale-selector.js';

const ADMIN_SOURCE = 'https://admin.da.live/source/';
const ADMIN_STATUS = 'https://admin.hlx.page/status/';
const EDIT_URL = 'https://da.live/edit#/';
const ROOT_LANG = 'en';
const ROOT_PATH = '/';

function extractPaths(languages) {
  const langPaths = languages.data.reduce((acc, { location, locales }) => {
    if (!location.startsWith('/langstore') && location !== ROOT_PATH) {
      acc.push(location);
    }
    if (locales) {
      acc.push(...locales.split(', ').filter((loc) => loc !== ROOT_PATH));
    }
    return acc;
  }, []);

  return [...langPaths, ROOT_PATH, `/langstore/${ROOT_LANG}`];
}

async function fetchLangPaths({ org, repo }, token) {
  const opts = { headers: { Authorization: `Bearer ${token}` } };
  const langConfigUrl = `${ADMIN_SOURCE}${org}/${repo}/.da/translate-v2.json`;

  try {
    const resp = await fetch(langConfigUrl, opts);
    if (!resp.ok) return null;
    const { languages } = await resp.json();

    return extractPaths(languages);
  } catch (e) {
    return null;
  }
}

async function fetchStatus({ org, repo }, locPath) {
  const statusUrl = `${ADMIN_STATUS}${org}/${repo}/main/${locPath}`;
  try {
    const res = await fetch(statusUrl);
    if (!res.ok) { throw new Error(res.status); }
    const data = await res.json();
    return { preview: data.preview.status, live: data.live.status };
  } catch {
    return null;
  }
}

(async function init() {
  const { context, token } = await DA_SDK;
  if (!context) {
    // eslint-disable-next-line no-console
    console.error('No context found');
    return;
  }
  const { org, repo, path } = context;
  const aemPath = `/${path.replace(/^\/|index$/g, '')}`;

  const langPaths = await fetchLangPaths(context, token);
  if (!langPaths) {
    // eslint-disable-next-line no-console
    console.error('No languages found');
    return;
  }

  const currLang = langPaths.find((lang) => aemPath.startsWith(lang));
  const langPathList = langPaths.map((lang) => {
    const code = lang === ROOT_PATH ? ROOT_LANG : lang.replace(ROOT_PATH, '');
    const currLocation = lang === ROOT_PATH ? '' : lang;
    const editPath = path.replace(currLang === ROOT_PATH ? '' : currLang, currLocation);
    const locPath = aemPath.replace(currLang === ROOT_PATH ? '' : currLang, currLocation);
    return {
      code,
      path: locPath,
      edit: `${EDIT_URL}${org}/${repo}${editPath}`,
      preview: `https://main--${repo}--${org}.aem.page${locPath}`,
      live: `https://main--${repo}--${org}.aem.live${locPath}`,
    };
  });

  const tagBrowser = document.createElement('da-locale-selector');
  const status = langPathList.reduce((acc, locale) => {
    acc[locale.path] = { };
    return acc;
  }, {});
  const currLangIndex = langPathList.findIndex((lang) => lang.code === (currLang === ROOT_PATH ? ROOT_LANG : currLang.replace(ROOT_PATH, '')));
  const [currentLocale] = langPathList.splice(currLangIndex, 1);
  tagBrowser.status = status;
  tagBrowser.currLocale = currentLocale;
  tagBrowser.altLocales = langPathList;

  document.body.querySelector('main').replaceChildren(tagBrowser);

  Object.keys(status).forEach((locPath) => {
    fetchStatus(context, locPath).then((stat) => {
      status[locPath] = stat;
      tagBrowser.status = { ...status };
    });
  });
}());
