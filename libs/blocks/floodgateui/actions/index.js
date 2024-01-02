import { heading, urls, fragmentStatusCheck } from '../utils/state.js';
import { setStatus, setExcelStatus } from '../utils/status.js';
import updateExcelTable from '../../../tools/sharepoint/excel.js';
import { getItemId } from '../../../tools/sharepoint/shared.js';
import { signal } from '../../../deps/htm-preact.js';
import { origin, preview } from '../../locui/utils/franklin.js';
import { decorateSections } from '../../../utils/utils.js';
import { getUrls } from '../../locui/loc/index.js';

export const showRolloutOptions = signal(false);

function getSanitizedUrl(link) {
  const url = new URL(link);
  return new URL(`${origin}${url.pathname}`);
}

function isReferencedAsset(link, baseUrlOrigin) {
  return link && link.startsWith(baseUrlOrigin) && (link.endsWith('.svg') || link.endsWith('.pdf'));
}

function updateDomWithBaseUrl(dom, url) {
  const baseEl = dom.createElement('base');
  baseEl.setAttribute('href', url);
  dom.head.append(baseEl);
}

function getOriginFromLink(link) {
  const url = new URL(link);
  return url.origin;
}

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
      fragmentStatusCheck.value = 'COMPLETED';
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

  const { links } = doc;
  updateDomWithBaseUrl(doc, resp.url);
  const baseUrlOrigin = getOriginFromLink(resp.url);
  const assestsList = [];
  for (let i = 0; i < links.length; i += 1) {
    const linkHref = links[i].href;
    // Check if it's a referenced asset
    if (isReferencedAsset(linkHref, baseUrlOrigin)) {
      const pathname = new URL(linkHref).pathname;
      // Check for duplicates against the original URLs
      if (!urls.value.some((originalUrl) => originalUrl.pathname === pathname)) {
        const sanitizedUrl = getSanitizedUrl(linkHref);
        assestsList.push(sanitizedUrl);
      }
    }
  }

  // Decorate the doc without loading any blocks (i.e., do not use loadArea)
  decorateSections(doc, true);
  const fragments = [...doc.querySelectorAll('.fragment, .modal.link-block')];
  const fragmentUrls = fragments.reduce((acc, fragment) => {
    // Normalize the fragment path to support production urls.
    const pathname = fragment.dataset.modalPath || new URL(fragment.href).pathname.replace('.html', '');

    // Find duplicates across the current iterator and the original url list
    const accDupe = acc.some((url) => url.pathname === pathname);
    const dupe = urls.value.some((url) => url.pathname === pathname);

    if (accDupe || dupe) return acc;
    const fragmentUrl = new URL(`${origin}${pathname}`);
    acc.push(fragmentUrl);
    return acc;
  }, []);
  const combinedUrls = Array.from(new Set([...fragmentUrls, ...assestsList]));
  if (combinedUrls.length === 0) return [];
  return getUrls(combinedUrls, true);
}

export async function findFragments() {
  fragmentStatusCheck.value = 'IN PROGRESS';
  setStatus('fragments', 'info', 'Finding fragments.');
  const found = urls.value
    .filter((url) => !url.pathname.endsWith('.svg') && !url.pathname.endsWith('.pdf'))
    .map((url) => findPageFragments(url.pathname));
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
  setExcelStatus(`Found ${forExcel.length} fragments.`);

  if (forExcel.length > 0) {
    urls.value = [...urls.value];
    // Update language cards count
    const itemId = getItemId();
    const resp = await updateExcelTable({ itemId, tablename: 'URL', values: forExcel });
    if (resp.status !== 201) {
      setStatus('fragments', 'error', 'Couldn\'t add to Excel.');
      fragmentStatusCheck.value = 'ERROR';
      return;
    }
    updateExcelJson();
  } else {
    fragmentStatusCheck.value = 'COMPLETED';
  }  
}
