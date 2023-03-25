import updateExcelTable from '../utils/sp/excel.js';
import { heading, setStatus, urls } from '../utils/state.js';
import { origin, preview } from '../utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';

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
      setStatus('excel', 'info', 'Excel refreshed.', 1500);
    }
  }, 5000);
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
    // Normalize the fragment domain to the current project
    const pathname = new URL(fragment.href).pathname.replace('.html', '');
    const fragmentUrl = new URL(`${origin}${pathname}`);
    // Look for duplicates that are already in the urls
    const dupe = urls.value.find((url) => url.href === fragmentUrl.href);
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
  setStatus('fragments', 'info', `${forExcel.length} fragments found.`, 1500);
  if (forExcel.length > 0) {
    urls.value = [...urls.value];
    updateExcelTable(forExcel);
    updateExcelJson();
  }
}

export function noSource() {
  return urls.value.find((url) => {
    if (!url.actions) return true;
    return url.actions?.edit?.status === 404;
  });
}

export function syncToLangstore() {

}
