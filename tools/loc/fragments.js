import { init as getProjectFile } from './project.js';
import { connect as connectToSp, updateExcelTable } from './sharepoint.js';
import { loadingON } from './utils.js';

const fragmentPath = '/fragments/';

async function fetchUrl(url, type) {
  let value = `Could not fetch url ${url}`;
  let status = 'error';
  try {
    const response = await fetch(url);
    value = `Could not fetch url ${url}. Error Code ${response.status}`;
    if (response.ok) {
      value = await (type === 'json' ? response.json() : response.text());
      status = 'success';
    }
  } catch (error) {
    value = `${value} ${error.message}`;
  }
  return { status, value, url };
}

async function fetchUrls(urls) {
  const responses = await Promise.allSettled(urls.map((url) => fetchUrl(`${url}.plain.html`, 'html')));
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
  return link && link.startsWith(baseUrlOrigin) && link.includes(fragmentPath);
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
  const dom = parser.parseFromString(urlHtml.value, 'text/html');
  const baseUrl = urlHtml.url;
  updateDomWithBaseUrl(dom, baseUrl);
  const baseUrlOrigin = getOriginFromLink(baseUrl);
  const { links } = dom;
  for (let i = 0; i < links.length; i += 1) {
    const linkHref = links[i].href;
    if (isLocalFragment(linkHref, baseUrlOrigin)) {
      const sanitizedUrl = getSanitizedUrl(linkHref);
      if (!fragments.includes(sanitizedUrl)) {
        fragments.push(sanitizedUrl);
      }
    }
  }
  return fragments;
}

async function persistFragments(fragments, excelPath) {
  let success = true;
  try {
    const values = fragments.map((fragment) => [fragment]);
    await updateExcelTable(excelPath, 'URL', values);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error occurred when persisting into project excel');
    success = false;
  }
  return success;
}

async function refreshProjectJson(projectFile, fragments, attempts = 0) {
  loadingON('Reloading Project JSON...');
  let isJsonUpdated = false;
  const maxAttempts = 2;
  await projectFile.purge();
  const projectJson = await fetchUrl(projectFile.path, 'json');
  const urls = projectJson?.value?.translation?.data;
  if (!urls || !urls.map((url) => url.URL).includes(...fragments)) {
    if (attempts < maxAttempts) {
      loadingON(`Failed to reload Project JSON... Trying until max attempts ${maxAttempts}`);
      // eslint-disable-next-line no-console
      console.log('Json not updated. Trying again until max attempts');
      const currentAttempt = attempts + 1;
      await refreshProjectJson(projectFile, fragments, currentAttempt);
    } else {
      // eslint-disable-next-line no-console
      console.log('Failed to reload Project JSON.. Please reload manually');
    }
  } else {
    isJsonUpdated = true;
  }
  return isJsonUpdated;
}

async function updateFragments() {
  let status = 'No Fragments found';
  const projectFile = await getProjectFile();
  const projectDetail = await projectFile.detail();
  let { urls } = projectDetail;
  urls = [...urls.keys()];
  const urlHtmls = await fetchUrls(urls);
  const fragments = [];
  loadingON('Finding Fragments...');
  urlHtmls.forEach((urlHtml) => {
    if (urlHtml.status !== 'error') {
      const fragmentsInUrl = getFragmentLinksFromUrlHtml(urlHtml);
      if (fragmentsInUrl.length > 0) {
        const filteredFragments = fragmentsInUrl
          .filter((fragment) => !urls.includes(fragment) && !fragments.includes(fragment));
        fragments.push(...filteredFragments);
      }
    }
  });
  if (fragments.length > 0) {
    loadingON('Found Fragments...');
    const connectedToSp = await connectToSp();
    if (!connectedToSp) {
      status = 'Could not connect to sharepoint';
    }
    loadingON('Saving Fragments into project excel...');
    const persisted = await persistFragments(fragments, projectFile.excelPath);
    if (persisted) {
      loadingON('Successfully persisted Fragments into project excel...');
      const isProjectJsonRefreshed = await refreshProjectJson(projectFile, fragments);
      if (isProjectJsonRefreshed) {
        status = 'Fragments found, updated and project json refreshed';
      } else {
        status = 'Fragments found, updated but project json refresh failed. Please preview project manually or use reload button so json is updated';
      }
    } else {
      status = 'Fragments found, but failed to update excel. Please try again';
    }
  }
  return status;
}

export default updateFragments;
