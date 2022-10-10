import { init as getProjectFile } from './project.js';

const fragmentPath = '/fragments/';

async function fetchHtml(url) {
  let htmlText = `Could not fetch url ${url}`;
  let status = 'error';
  try {
    const response = await fetch(`${url}.plain.html`);
    htmlText = `Could not fetch url ${url}. Error Code ${response.status}`;
    if (response.ok) {
      htmlText = await response.text();
      status = 'success';
    }
  } catch (error) {
    htmlText = `${htmlText} ${error.message}`;
  }
  return { status, htmlText, url };
}

async function fetchUrls(urls) {
  const responses = await Promise.allSettled(urls.map((url) => fetchHtml(url)));
  return responses
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value);
}

function updateDomWithBaseUrl(dom, url) {
  const baseEl = dom.createElement('base');
  baseEl.setAttribute('href', url);
  dom.head.append(baseEl);
}

function isLocalFragment(link, baseUrlOrigin) {
  return link && link.startsWith(`${baseUrlOrigin}${fragmentPath}`);
}

function getOriginFromLink(link) {
  const url = new URL(link);
  return url.origin;
}

function getSanitizedUrl(link) {
  const url = new URL(link);
  return `${url.origin}${url.pathname}`;
}

function getFragmentLinksFromUrlHtml(urlHtml) {
  const fragments = [];
  const parser = new DOMParser();
  const dom = parser.parseFromString(urlHtml.htmlText, 'text/html');
  const baseUrl = urlHtml.url;
  updateDomWithBaseUrl(dom, baseUrl);
  const baseUrlOrigin = getOriginFromLink(baseUrl);
  const { links } = dom;
  for (let i = 0; i < links.length; i += 1) {
    const linkHref = links[i].href;
    if (isLocalFragment(linkHref, baseUrlOrigin)) {
      fragments.push(getSanitizedUrl(linkHref));
    }
  }
  return fragments;
}

function persistFragments(fragmentsMap, projectDetail) {
  fragmentsMap.forEach((fragments, url) => {
    console.log(`${url} = ${fragments}`);
  });
}

async function getFragments() {
  const projectFile = await getProjectFile();
  const projectDetail = await projectFile.detail();
  const { urls } = projectDetail;
  urls.push('https://loc--milo--adobecom.hlx.page/drafts/bhagwath/loc/nonexistent');
  const urlHtmls = await fetchUrls(urls);
  const fragments = new Map();
  urlHtmls.forEach((urlHtml) => {
    if (urlHtml.status !== 'error') {
      const fragmentsInUrl = getFragmentLinksFromUrlHtml(urlHtml);
      const filteredFragments = fragmentsInUrl.filter((fragment) => !urls.includes(fragment));
      fragments.set(urlHtml.url, filteredFragments);
    }
  });
  persistFragments(fragments, projectDetail);
}

async function copyFilesToLanguageEn() {
  // Do nothing
}

async function init() {
  document.querySelector('#getFragments button').addEventListener('click', getFragments);
  document.querySelector('#copyToEn button').addEventListener('click', copyFilesToLanguageEn);
}

export default init;
