/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  heading,
  urls,
  languages,
  allowSyncToLangstore,
  allowSendForLoc,
  allowRollout,
  syncFragments,
  allowCancelProject,
} from '../utils/state.js';
import { setExcelStatus, setStatus } from '../utils/status.js';
import { origin, preview } from '../utils/franklin.js';
import { createTag, decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../loc/index.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import {
  createProject,
  startSync,
  startProject,
  getServiceUpdates,
  rolloutLang,
} from '../utils/miloc.js';
import { signal } from '../../../deps/htm-preact.js';
import Modal from './modal.js';

export const showRolloutOptions = signal(false);

async function updateExcelJson() {
  return new Promise((resolve) => {
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
        resolve();
      }
    }, 1000);
  });
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
  return fragmentUrls;
}

async function findDeepFragments(path) {
  const searched = [];
  const fragments = await findPageFragments(path);
  if (!fragments) return [];
  while (fragments.length !== searched.length) {
    const needsSearch = fragments.filter((fragment) => !searched.includes(fragment.pathname));
    for (const search of needsSearch) {
      const nestedFragments = await findPageFragments(search.pathname);
      const notSearched = nestedFragments.filter((nested) => !searched.includes(nested.pathname));
      if (notSearched?.length) fragments.push(...notSearched);
      searched.push(search.pathname);
    }
  }
  return fragments.length ? getUrls(fragments) : [];
}

export async function findFragments() {
  const found = urls.value.map((url) => findDeepFragments(url.pathname));
  const pageFragments = await Promise.all(found);
  // For each page, loop through all the found fragments
  const foundFragments = pageFragments.reduce((acc, fragments) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        // De-dupe across pages that share fragments
        const dupe = acc.some((url) => url[0] === fragment.href);
        if (!dupe) acc.push([fragment.href]);
      });
    }
    return acc;
  }, []);
  return foundFragments;
}

export async function syncToExcel(paths) {
  setStatus('fragments', 'info', `${paths.length} fragments found.`, null, 1500);
  setExcelStatus('Find fragments', `Found ${paths.length} fragments.`);
  if (paths.length > 0) {
    const newUrls = paths.map((path) => new URL(path[0]));
    urls.value = [...urls.value, ...getUrls(newUrls)];
    // Update language cards count
    languages.value = [...languages.value.map((lang) => {
      lang.size = urls.value.length;
      return lang;
    })];
    const itemId = getItemId();
    const resp = await updateExcelTable({ itemId, tablename: 'URL', values: paths });
    if (resp.status !== 201) {
      setStatus('fragments', 'error', 'Couldn\'t add to Excel.');
      return;
    }
    await updateExcelJson();
  }
}

export async function findAllFragments() {
  setStatus('fragments', 'info', 'Finding fragments.');
  const forExcel = await findFragments();
  await syncToExcel(forExcel);
}

export async function syncToLangstore() {
  // Disable all langstore syncing, the project is being sent.
  allowSyncToLangstore.value = false;

  // Disable sending for loc as this is in progress.
  allowSendForLoc.value = false;

  // Disable cancel project
  allowCancelProject.value = false;

  if (!heading.value.projectId) {
    const status = await createProject();
    setTimeout(async () => {
      if (status === 201) {
        await startSync();
        getServiceUpdates();
      } else {
        allowSyncToLangstore.value = true;
        allowSendForLoc.value = true;
        allowCancelProject.value = false;
      }
    }, 3000);
  } else {
    await startSync();
  }
}

export async function startSyncToLangstore() {
  if (heading.value.projectId) {
    await syncToLangstore();
  } else {
    const { getModal } = await import('../../modal/modal.js');
    const div = createTag('div');
    const content = Modal(div, 'sync');
    getModal(null, { id: 'sync-modal', content, closeEvent: 'closeModal' });
  }
}

export function closeActionModal() {
  document.querySelector('.dialog-modal').dispatchEvent(new Event('closeModal'));
}

export async function syncFragsLangstore() {
  closeActionModal();
  if (syncFragments.value?.length) {
    await syncToExcel(syncFragments.value);
    syncFragments.value = [];
  }
  await syncToLangstore();
}

export async function sendForLoc() {
  // Disable all langstore syncing, the project is being sent.
  allowSyncToLangstore.value = false;

  // Disable sending for loc as this is in progress.
  allowSendForLoc.value = false;

  // Disable cancel project
  allowCancelProject.value = false;

  // If no Project ID, create project first.
  if (!heading.value.projectId) {
    const status = await createProject();
    if (status === 201) {
      // Give the service time to digest and error check creating a project
      setStatus('service', 'info', 'Starting project.');
    } else {
      allowSyncToLangstore.value = true;
      allowSendForLoc.value = true;
      allowCancelProject.value = false;
      return;
    }
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

export async function cancelLocProject() {
  const { getModal } = await import('../../modal/modal.js');
  const div = createTag('div');
  const content = Modal(div, 'cancel');
  getModal(null, { id: 'cancel-modal', content, closeEvent: 'closeModal' });
}
