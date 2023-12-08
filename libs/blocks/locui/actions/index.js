/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { heading, urls, languages, allowSyncToLangstore, allowSendForLoc, allowRollout, allowFindFragments } from '../utils/state.js';
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
  // Decorate the doc, but don't load any blocks (i.e. do not use loadArea)
  decorateSections(doc, true);
  const fragments = [...doc.querySelectorAll('.fragment, .modal.link-block')];
  const fragmentUrls = fragments.reduce((acc, fragment) => {
    // Normalize the fragment path to support production urls.
    const pathname = fragment.dataset.modalPath || new URL(fragment.href).pathname.replace('.html', '');

    // Find dupes across current iterator as well as original url list
    const accDupe = acc.some((url) => url.pathname === pathname);
    const dupe = urls.value.some((url) => url.pathname === pathname);

    if (accDupe || dupe) return acc;
    const fragmentUrl = new URL(`${origin}${pathname}`);
    acc.push(fragmentUrl);
    return acc;
  }, []);
  if (fragmentUrls.length === 0) return [];
  return getUrls(fragmentUrls);
}

export async function findFragments() {
  setStatus('fragments', 'info', 'Finding fragments.');
  const found = urls.value.map((url) => findPageFragments(url.pathname));
  const pageFragments = await Promise.all(found);

  // For each page, loop through all the found fragments
  const forExcel = pageFragments.reduce((acc, fragments) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        // De-dupe across pages that share fragments
        const dupe = acc.some((url) => url[0] === fragment.href);
        if (!dupe) {
          // Push into urls state for the UI
          urls.value.push(fragment);
          // Push into excel
          acc.push([fragment.href]);
        }
      });
    }
    return acc;
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

export async function syncToLangstore() {
  // Disable finding fragments
  allowFindFragments.value = false;

  // Disable all langstore syncing, the project is being sent.
  allowSyncToLangstore.value = false;

  // Disable sending for loc as this is in progress.
  allowSendForLoc.value = false;

  if (!heading.value.projectId) {
    const status = await createProject();
    setTimeout(async () => {
      if (status === 201) await startSync();
      getServiceUpdates();
    }, 3000);
  } else {
    await startSync();
  }
}

export async function sendForLoc() {
  // Disable finding fragments
  allowFindFragments.value = false;

  // Disable all langstore syncing, the project is being sent.
  allowSyncToLangstore.value = false;

  // Disable sending for loc as this is in progress.
  allowSendForLoc.value = false;

  // If no Project ID, create project first.
  if (!heading.value.projectId) {
    const status = await createProject();
    if (status !== 201) {
      setStatus('service', 'error', 'Error creating new project.');
      return;
    }
    setStatus('service', 'info', 'Starting project.');
    // Give the service time to digest and error check creating a project
  }

  await startProject({ skipSync: true });
  setStatus('service');
  // Start polling for updates since this has not been kicked off.
  getServiceUpdates();
}

export function showRollout() {
  showRolloutOptions.value = true;
}

export async function rolloutAll(e, reroll) {
  showRolloutOptions.value = false;
  allowRollout.value = false;
  await rolloutLang('all', reroll);
}
