/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import updateExcelTable from '../utils/sp/excel.js';
import { heading, setStatus, urls } from '../utils/state.js';
import { origin, preview } from '../utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';
import copyFile from '../utils/sp/file.js';
import group from '../utils/group.js';

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

async function syncFile(url) {
  return new Promise(async (resolve) => {
    const sourcePath = url.pathname;
    const destPath = url.langstore.pathname;
    const json = await copyFile(sourcePath, destPath);
    url.langstore.actions = {
      ...url.langstore.actions,
      edit: {
        url: json.webUrl,
        status: 200,
      },
    };
    resolve(url);
  });
}

export async function syncToLangstore() {
  if (checkSource()) {
    const desc = `There are missing source docs in the project.
                  Remove the missing docs or create them.`;
    setStatus('langstore', 'error', 'Missing source docs.', desc);
    return;
  }
  let count = urls.value.length;
  // eslint-disable-next-line no-restricted-syntax
  for (const [idx, url] of urls.value.entries()) {
    setStatus('langstore', 'info', `Syncing - ${count} left.`, 'Syncing to Langstore.');
    // eslint-disable-next-line no-await-in-loop
    urls.value[idx] = await syncFile(url);
    urls.value = [...urls.value];
    count -= 1;
    if (count === 0) {
      setStatus('langstore');
    }
  }
}

export async function makeLots() {
  const iters = [...Array(104).keys()];
  const groups = group(iters);
}
