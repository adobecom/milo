import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import SearchTextarea from './SearchTextarea.js';
import {
  TARGET_METADATA_OPTIONS,
  METADATA_URLS_CATEGORIES,
  LOCAL_STORAGE_KEYS,
  getDate,
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
  const urls = (urlListText ?? '').split(/,|\n/).filter((item) => item.trim().length > 0);
  urls.forEach((url) => {
    const path = url.split(/\.com|\.html/g)[1];
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

function UrlPod({ title, list, onCopy }) {
  if (!list.length) return null;
  return html`
    <div class="mmm2-metadata-pod">
      <h3>${title}</h3>
      ${list.map((item) => html`
        <div class="mmm2-metadata-pod-item" key=${item.URL ?? item}>
          <span>${item.URL || item.split(/\.com|\.html/g)[1]}</span>
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
    const text = list.map((item) => item.URL || item.split(/\.com|\.html/g)[1]).join('\n');
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
      ${loading ? html`<div class="mmm2-loading">Loading…</div>` : html`
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
