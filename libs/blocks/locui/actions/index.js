/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { heading, urls, languages, allowSyncToLangstore, allowSendForLoc, allowRollout } from '../utils/state.js';
import { setExcelStatus, setStatus } from '../utils/status.js';
import { origin, preview } from '../utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import { createProject, startSync, startProject, getServiceUpdates, rolloutLang } from '../utils/miloc.js';
import { signal } from '../../../deps/htm-preact.js';

export const showRolloutOptions = signal(false);

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
  const isIndex = path.lastIndexOf('index');
  const hlxPath = isIndex > 0 ? path.substring(0, isIndex) : path;
  const resp = await fetch(`${origin}${hlxPath}`);
  if (!resp.ok) return [];
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  // TODO: Support nested fragments
  // Decorate the doc, but don't load any blocks (i.e. do not use loadArea)
  decorateSections(doc, true);
  const fragments = [...doc.querySelectorAll('.fragment, .modal.link-block')];
  const fragmentUrls = fragments.reduce((rdx, fragment) => {
    // Normalize the fragment path to support production urls.
    const pathname = fragment.dataset.modalPath || new URL(fragment.href).pathname.replace('.html', '');
    const fragmentUrl = new URL(`${origin}${pathname}`);
    // Look for duplicates that are already in the urls
    const dupe = urls.value.some((url) => url.href === fragmentUrl.href);
    if (!dupe) rdx.push(fragmentUrl);
    return rdx;
  }, []);
  // TODO: Footer promos
  // const footerPromo = doc.querySelector('[name="footer-promo-tag"]');
  // if (footerPromo) {
  //   const content = footerPromo.getAttribute('content');
  //   if (content) {
  //     const promoUrl = new URL(`${origin}/fragments/footer-promos/${content}`);
  //     const dupe = urls.value.some((url) => url.href === promoUrl.href);
  //     if (!dupe) fragmentUrls.push(promoUrl);
  //   }
  // }
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
  setExcelStatus('Find fragments', `Found ${forExcel.length} fragments.`);
  if (forExcel.length > 0) {
    urls.value = [...urls.value];
    // Update language cards count
    languages.value = [...languages.value.map((lang) => {
      lang.size = urls.value.length;
      return lang;
    })];
    const itemId = getItemId();
    const resp = await updateExcelTable({ itemId, tablename: 'URL', values: forExcel });
    if (resp.status !== 201) {
      setStatus('fragments', 'error', 'Couldn\'t add to Excel.');
      return;
    }
    updateExcelJson();
  }
}

export async function syncToLangstore(e) {
  e.target.disabled = true;
  if (!heading.value.projectId) {
    const status = await createProject();
    if (status === 201) await startSync();
    getServiceUpdates();
  } else {
    await startSync();
  }
  e.target.disabled = false;
}

export async function sendForLoc(e) {
  e.target.disabled = true;
  const status = await startProject();
  if (status === 201) {
    allowSyncToLangstore.value = false;
    allowSendForLoc.value = false;
  }
  e.target.disabled = false;
}

export function showRollout() {
  showRolloutOptions.value = true;
}

export async function rolloutAll(e, reroll) {
  showRolloutOptions.value = false;
  allowRollout.value = false;
  await rolloutLang('all', reroll);
}
