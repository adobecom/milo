/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateExcelTable from '../utils/sp/excel.js';
import { heading, setStatus, urls } from '../utils/state.js';
import { origin, preview } from '../utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';
import copyFile from '../utils/sp/file.js';
import makeGroups from '../utils/group.js';

const MISSING_SOURCE = 'There are missing source docs in the project. Remove the missing docs or create them.';

async function updateExcelJson() {
  let count = 1;
  const excelUpdated = setInterval(async () => {
    setStatus('excel', 'info', `Refreshing project. Try #${count}`);
    const previewResp = await preview(`${heading.value.path}.json`);
    const resp = await fetch(previewResp.preview.url);
    const json = await resp.json();
    count += 1;
    if (count > 10 || json.urls.data.length === urls.value.length) {
      clearInterval(excelUpdated);
      setStatus('excel', 'info', 'Excel refreshed.', null, 1500);
    }
  }, 1000);
}

async function findPageFragments(path) {
  const resp = await fetch(`${origin}${path}`);
  if (!resp.ok) return [];
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  decorateSections(doc, true);
  const fragments = [...doc.querySelectorAll('.fragment')];
  const fragmentUrls = fragments.reduce((rdx, fragment) => {
    // Normalize the fragment path to support production urls.
    const pathname = new URL(fragment.href).pathname.replace('.html', '');
    const fragmentUrl = new URL(`${origin}${pathname}`);
    // Look for duplicates that are already in the urls
    const dupe = urls.value.some((url) => url.href === fragmentUrl.href);
    if (!dupe) rdx.push(fragmentUrl);
    return rdx;
  }, []);
  if (fragmentUrls.length === 0) return [];
  return getUrls(fragmentUrls);
}

export async function findFragments() {
  setStatus('fragments', 'info', 'Finding fragments.');
  const found = urls.value.map((url) => findPageFragments(url.pathname));
  const pageFragments = await Promise.all(found);
  // For each page, loop through all the found fragments
  const forExcel = pageFragments.reduce((rdx, fragments) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        urls.value.push(fragment);
        rdx.push([fragment.href]);
      });
    }
    return rdx;
  }, []);
  setStatus('fragments', 'info', `${forExcel.length} fragments found.`, null, 1500);
  if (forExcel.length > 0) {
    urls.value = [...urls.value];
    updateExcelTable(forExcel);
    updateExcelJson();
  }
}

function checkSource() {
  return urls.value.some((url) => {
    if (!url.actions || url.actions.edit?.status === 404) return true;
    return false;
  });
}

function getFilePath(pathname, filename) {
  const pathArr = pathname.split('/');
  pathArr.pop();
  pathArr.push(filename);
  return pathArr.join('/');
}

async function syncFile(url) {
  return new Promise((resolve) => {
    const sourcePath = getFilePath(url.pathname, url.actions.edit.filename);
    const destPath = getFilePath(url.langstore.pathname, url.actions.edit.filename);
    console.log(sourcePath);
    copyFile(sourcePath, destPath).then((json) => {
      if (json.webUrl) {
        url.langstore.actions = {
          ...url.langstore.actions,
          edit: { url: json.webUrl, status: 200 },
        };
      }
      resolve(url);
    });
  });
}

export async function syncToLangstore() {
  if (checkSource()) {
    setStatus('langstore', 'error', 'Missing source docs.', MISSING_SOURCE);
    return;
  }

  for (const [idx, url] of urls.value.entries()) {
    setStatus(`langstore-${idx}`, 'info', `Syncing - ${url.pathname}`);
    urls.value[idx] = await syncFile(url);
    setStatus(`langstore-${idx}`);
    urls.value = [...urls.value];
  }
}

// async function makeOne(num) {
//   return new Promise((resolve) => {
//     const source = '/drafts/cmillar/batch/Doc_';
//     const dest = `/drafts/cmillar/batch/Doc_${num}`;
//     copyFile(source, dest).then((json) => {
//       resolve(json);
//     });
//   });
// }

// (async function loadPage() {
//   setTimeout(async () => {
//     const iters = [...Array(200).keys()];
//     for (const num of iters) {
//       const json = await makeOne(num);
//       console.log(json);
//     }
//   }, 1500);
// }());
