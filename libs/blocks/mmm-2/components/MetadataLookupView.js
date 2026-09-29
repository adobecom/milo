import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import SearchTextarea from './SearchTextarea.js';
import HowToAccordion from './HowToAccordion.js';
import {
  TARGET_METADATA_OPTIONS,
  METADATA_URLS_CATEGORIES,
  LOCAL_STORAGE_KEYS,
  getDate,
  getUrlPath,
} from '../utils.js';

const DEFAULT_STATE = { selectedRepo: 'cc', urlListText: '' };

function updatePageTargetStatus(url, target) {
  return fetch(API_URLS.save, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: { url, target }, updateOnly: true }),
  });
}

function categorize(urlListText, metadataRows) {
  const categories = {
    [METADATA_URLS_CATEGORIES.notFound.key]: [],
    [METADATA_URLS_CATEGORIES.off.key]: [],
    [METADATA_URLS_CATEGORIES.on.key]: [],
    [METADATA_URLS_CATEGORIES.postLCP.key]: [],
  };
  const urls = (urlListText ?? '').split(/,|\n/).map((item) => item.trim()).filter(Boolean);
  urls.forEach((url) => {
    const path = getUrlPath(url);
    const match = metadataRows.find((item) => item.URL === path);
    if (!match) {
      if (url) categories.notFound.push(url);
      return;
    }
    const matchWithUrl = { ...match, url };
    const targetKey = match.target || METADATA_URLS_CATEGORIES.off.key;
    categories[targetKey].push(matchWithUrl);
  });
  return categories;
}

const POD_SKELETON_ITEM_COUNTS = [3, 5, 2, 4];

// Mirrors the real .mmm2-metadata-pod card shape (heading + a few item rows).
function MetadataPodsSkeleton() {
  return html`
    <div class="mmm2-metadata-results">
      ${POD_SKELETON_ITEM_COUNTS.map((itemCount, i) => html`
        <div class="mmm2-skeleton-pod" key=${i}>
          <span class="mmm2-skeleton mmm2-skeleton-heading" style=${{ width: '55%' }}></span>
          ${Array.from({ length: itemCount }).map((_, j) => html`
            <span class="mmm2-skeleton mmm2-skeleton-text" key=${j} style=${{ width: `${80 - (j % 3) * 15}%` }}></span>
          `)}
        </div>
      `)}
    </div>
  `;
}

function UrlPod({ title, list, onCopy }) {
  if (!list.length) return null;
  return html`
    <div class="mmm2-metadata-pod">
      <h3>${title}</h3>
      ${list.map((item) => html`
        <div class="mmm2-metadata-pod-item" key=${item.URL ?? item}>
          <span>${item.URL || getUrlPath(item)}</span>
        </div>
      `)}
      <button type="button" class="con-button" onClick=${onCopy}>Copy</button>
    </div>
  `;
}

/**
 * Today's "target-metadata-lookup" mmm variant. Unlike the other two views, this one
 * has no authored config table to read (confirmed empty on the live page) - its
 * repo options/spreadsheet links are already fully defined in TARGET_METADATA_OPTIONS,
 * so no cross-page fetch is needed here.
 */
function MetadataLookupView() {
  const [state, setState] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.metadataLookup,
    () => DEFAULT_STATE,
  );
  const [metadataRows, setMetadataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyState, setCopyState] = useState('idle');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const rngString = Math.random().toString(36).substring(2, 10);
    const url = `${TARGET_METADATA_OPTIONS[state.selectedRepo].metadata}?limit=10000&r=${rngString}`;
    fetch(url).then((res) => res.json())
      .then((json) => { if (!cancelled) setMetadataRows(json?.data ?? []); })
      .catch(() => { if (!cancelled) setMetadataRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [state.selectedRepo]);

  const categories = categorize(state.urlListText, metadataRows);
  const hasResults = Object.values(categories).some((list) => list.length);

  useEffect(() => {
    // Sync each matched page's `target` field in the backend to reflect the
    // spreadsheet, matching the original mmm.js side effect of this tool.
    Object.keys(categories).forEach((key) => {
      if (key === 'notFound') return;
      categories[key].forEach((item) => updatePageTargetStatus(item.url, key));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.urlListText, metadataRows]);

  const copyCategory = (list) => {
    const text = list.map((item) => item.URL || getUrlPath(item)).join('\n');
    navigator.clipboard.writeText(text);
  };

  const copyFullReport = () => {
    const merged = { ...categories, off: categories.off.concat(categories.notFound), notFound: [] };
    const reportText = `Date: ${getDate()}\nRepo: ${state.selectedRepo.toUpperCase()}\nRequested pages are grouped below by their Target setting.\n${Object.keys(merged).map((key) => {
      const urls = merged[key].map((item) => item.url || item);
      return urls.length ? `\n\n${METADATA_URLS_CATEGORIES[key].display}:\n${urls.join('\n')}\n` : null;
    }).filter(Boolean).join('')}`;
    navigator.clipboard.writeText(reportText);
    setCopyState('success');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const { name, source } = TARGET_METADATA_OPTIONS[state.selectedRepo];

  return html`
    <div class="mmm2-metadata-view">
      <${HowToAccordion} title="Instructions">
        <p>A report to categorize URLs by their Target metadata.</p>
        <ol>
          <li>Choose the appropriate repo from the dropdown (you can only check one repo at a time)</li>
          <li>Click the "Open ${name} Spreadsheet" button below to open the corresponding spreadsheet</li>
          <li>Enter production URL(s) below</li>
          <li>Click the "Copy Report" button and paste that report into Jira to preserve a record of the page settings before you update</li>
          <li>Use the categorized paths to know what updates are needed in the spreadsheet. You can copy each path list if needed.</li>
          <li>Preview and publish the spreadsheet</li>
          <li>Reload this page to confirm the page settings are updated and update MMM.</li>
        </ol>
      <//>
      <div class="mmm2-filters">
        <div class="mmm2-form-field">
          <label for="mmm2-metadata-repo">Choose Repo:</label>
          <select
            id="mmm2-metadata-repo"
            value=${state.selectedRepo}
            onChange=${(e) => setState((prev) => ({ ...prev, selectedRepo: e.target.value }))}
          >
            ${Object.entries(TARGET_METADATA_OPTIONS).map(([key, opt]) => html`
              <option value=${key}>${opt.name}</option>
            `)}
          </select>
        </div>
        <p><a href=${source} target="_blank" rel="noopener" class="con-button">Open ${name} Spreadsheet</a></p>
        <${SearchTextarea}
          id="mmm2-metadata-filter"
          label="URL list (full URLs):"
          placeholder="https://www.adobe.com/products/photoshop.html"
          value=${state.urlListText}
          onChange=${(v) => setState((prev) => ({ ...prev, urlListText: v }))}
        />
      </div>
      ${loading ? html`<${MetadataPodsSkeleton} />` : html`
        <div class="mmm2-metadata-results">
          ${Object.keys(categories).map((key) => html`
            <${UrlPod}
              key=${key}
              title=${METADATA_URLS_CATEGORIES[key].display}
              list=${categories[key]}
              onCopy=${() => copyCategory(categories[key])}
            />
          `)}
        </div>
      `}
      ${hasResults ? html`
        <button type="button" class="con-button blue button-l ${copyState === 'success' ? 'has-success' : ''}" onClick=${copyFullReport}>
          Copy Report
        </button>
      ` : null}
    </div>
  `;
}

export default MetadataLookupView;
