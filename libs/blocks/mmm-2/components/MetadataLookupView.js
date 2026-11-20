import { html, useState, useEffect, useMemo } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/mep/mep-next/mep-next.js';
import SearchTextarea from './SearchTextarea.js';
import HowToAccordion from './HowToAccordion.js';
import {
  TARGET_METADATA_OPTIONS,
  METADATA_URLS_CATEGORIES,
  LOCAL_STORAGE_KEYS,
  getDate,
  getUrlPath,
  menuOptions,
  normalizeAuthoredFilters,
  getButtonClasses,
} from '../utils.js';

const COPY_BUTTON_CLASSES = getButtonClasses('em');
const REPORT_BUTTON_CLASSES = getButtonClasses('strong', 'l');
const COPY_MESSAGES = {
  copying: 'Copying report...',
  success: 'Report copied to clipboard.',
  error: 'Unable to copy to the clipboard. Please try again.',
};

const DEFAULT_STATE = { urlListText: '' };
const normalizeMetadataFilters = (saved, config) => (
  normalizeAuthoredFilters(saved, config, { selectedRepo: 'metadatarepo' }, DEFAULT_STATE)
);

function spreadsheetInstructions(content, selectedRepo) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = content;
  wrapper.querySelectorAll('a[href*="sharepoint.com/:x:"]').forEach((link) => {
    const sourceDoc = new URL(link.href).searchParams.get('sourcedoc');
    const original = Object.values(TARGET_METADATA_OPTIONS)
      .find(({ source }) => new URL(source).searchParams.get('sourcedoc') === sourceDoc);
    if (!original) return;
    link.href = selectedRepo.source;
    link.textContent = link.textContent.replace(original.name, selectedRepo.name);
  });
  return wrapper.innerHTML;
}

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
  const [copyState, setCopyState] = useState('idle');
  const listSignature = JSON.stringify(list);
  useEffect(() => {
    setCopyState('idle');
  }, [listSignature]);
  useEffect(() => {
    if (copyState !== 'success' && copyState !== 'error') return undefined;
    const timer = setTimeout(() => setCopyState('idle'), 3000);
    return () => clearTimeout(timer);
  }, [copyState]);
  const copy = async () => {
    if (copyState === 'copying') return;
    setCopyState('copying');
    try {
      await onCopy();
      setCopyState('success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy metadata category:', error);
      setCopyState('error');
    }
  };
  if (!list.length) return null;
  return html`
    <div class="mmm2-metadata-pod">
      <h3>${title}</h3>
      ${list.map((item) => html`
        <div class="mmm2-metadata-pod-item" key=${item.URL ?? item}>
          <span>${item.URL || getUrlPath(item)}</span>
        </div>
      `)}
      <div class="mmm2-metadata-pod-actions mmm2-metadata-copy-action">
        <button type="button" class=${COPY_BUTTON_CLASSES} disabled=${copyState === 'copying'} onClick=${copy}>Copy</button>
        ${copyState !== 'idle' ? html`
          <p class="mmm2-copy-message" data-state=${copyState} role=${copyState === 'error' ? 'alert' : 'status'}>
            ${copyState === 'success' ? 'Copied to clipboard.' : COPY_MESSAGES[copyState]}
          </p>
        ` : null}
      </div>
    </div>
  `;
}

function MetadataLookupView({ authoredConfig }) {
  const [savedState, setState] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.metadataLookup,
    () => normalizeMetadataFilters({}, authoredConfig).filters,
  );
  const { filters: state, resetFilters } = normalizeMetadataFilters(savedState, authoredConfig);
  const updateState = (changes) => setState((prev) => ({
    ...normalizeMetadataFilters(prev, authoredConfig).filters,
    ...changes,
  }));
  const instructions = useMemo(() => (authoredConfig.error ? '' : spreadsheetInstructions(
    authoredConfig.howTo.html,
    TARGET_METADATA_OPTIONS[state.selectedRepo],
  )), [authoredConfig, state.selectedRepo]);
  const [metadataRows, setMetadataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyState, setCopyState] = useState('idle');

  useEffect(() => {
    setCopyState('idle');
  }, [state.selectedRepo, state.urlListText]);

  useEffect(() => {
    if (copyState !== 'success' && copyState !== 'error') return undefined;
    const timer = setTimeout(() => setCopyState('idle'), 3000);
    return () => clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (authoredConfig.error) return undefined;
    let cancelled = false;
    setLoading(true);
    const rngString = Math.random().toString(36).substring(2, 10);
    const url = `${TARGET_METADATA_OPTIONS[state.selectedRepo].metadata}?limit=10000&r=${rngString}`;
    fetch(url).then((res) => res.json())
      .then((json) => { if (!cancelled) setMetadataRows(json?.data ?? []); })
      .catch(() => { if (!cancelled) setMetadataRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [state.selectedRepo, authoredConfig.error]);

  const categories = categorize(state.urlListText, metadataRows);
  const hasResults = Object.values(categories).some((list) => list.length);

  useEffect(() => {
    if (authoredConfig.error) return;
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
    return navigator.clipboard.writeText(text);
  };

  const copyFullReport = async () => {
    if (copyState === 'copying') return;
    setCopyState('copying');
    const merged = { ...categories, off: categories.off.concat(categories.notFound), notFound: [] };
    const reportText = `Date: ${getDate()}\nRepo: ${state.selectedRepo.toUpperCase()}\nRequested pages are grouped below by their Target setting.\n${Object.keys(merged).map((key) => {
      const urls = merged[key].map((item) => item.url || item);
      return urls.length ? `\n\n${METADATA_URLS_CATEGORIES[key].display}:\n${urls.join('\n')}\n` : null;
    }).filter(Boolean).join('')}`;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyState('success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy metadata report:', error);
      setCopyState('error');
    }
  };

  if (authoredConfig.error) {
    return html`<div class="mmm2-metadata-view" role="alert">${authoredConfig.error}</div>`;
  }

  return html`
    <div class="mmm2-metadata-view">
      <${HowToAccordion} title=${authoredConfig.howTo.title} content=${instructions} />
      ${resetFilters.length ? html`<p role="status">Unavailable filter selections were reset: ${resetFilters.join(', ')}.</p>` : null}
      <div class="mmm2-filters">
        <div class="mmm2-form-field">
          <label for="mmm2-metadata-repo">${authoredConfig.metadatarepo.label}</label>
          <select
            id="mmm2-metadata-repo"
            value=${state.selectedRepo}
            onChange=${(e) => updateState({ selectedRepo: e.target.value })}
          >
            ${menuOptions(authoredConfig.metadatarepo).map(({ value, label }) => html`
              <option value=${value}>${label}</option>
            `)}
          </select>
        </div>
        <${SearchTextarea}
          id="mmm2-metadata-filter"
          label="URL list (full URLs):"
          placeholder="https://www.adobe.com/products/photoshop.html"
          value=${state.urlListText}
          onChange=${(v) => updateState({ urlListText: v })}
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
        <div class="mmm2-metadata-report-actions mmm2-metadata-copy-action">
          <button
            type="button"
            class=${REPORT_BUTTON_CLASSES}
            disabled=${copyState === 'copying'}
            onClick=${copyFullReport}
          >
            Copy Report
          </button>
          ${copyState !== 'idle' ? html`
            <p class="mmm2-copy-message" data-state=${copyState} role=${copyState === 'error' ? 'alert' : 'status'}>
              ${COPY_MESSAGES[copyState]}
            </p>
          ` : null}
        </div>
      ` : null}
    </div>
  `;
}

export default MetadataLookupView;
