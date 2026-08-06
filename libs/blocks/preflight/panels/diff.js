import { html, signal, useEffect, useRef } from '../../../deps/htm-preact.js';
import fetchVersions from '../checks/diff/fetchVersions.js';
import diffContent from '../checks/diff/diffContent.js';
import diffMetadata from '../checks/diff/diffMetadata.js';
import { renderPane } from './diff-render.js';
import { applyHighlights, scrollToChange } from './diff-highlight.js';

const EMPTY_MAIN_HTML = '<main></main>';
const VIEW = { LOADING: 'loading', EMPTY: 'empty', READY: 'ready' };
const TAB = { CONTENT: 'content', METADATA: 'metadata' };
const BADGE_LABEL = { added: 'New', modified: 'Changed', removed: 'Removed' };

const view = signal(VIEW.LOADING);
const activeTab = signal(TAB.CONTENT);
const contentDiff = signal(null);
const metadataDiff = signal(null);
const pageStatus = signal(null);
const previewPane = signal(null);
const livePane = signal(null);

function parseMain(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  return doc.querySelector('main') || doc.body;
}

function hasChanges(content, metadata) {
  if (!content || !metadata) return false;
  const total = content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length;
  return total > 0;
}

function buildMetadataRows(metadata) {
  if (!metadata) return [];
  return [
    ...metadata.added.map((change) => ({ ...change, type: 'added' })),
    ...metadata.modified.map((change) => ({ ...change, type: 'modified' })),
    ...metadata.removed.map((change) => ({ ...change, type: 'removed' })),
  ];
}

// Self-contained: the Inc-1 check's `details` has classifications but not the raw
// .plain.html the panes need, so the panel fetches and diffs its own copy on mount.
async function loadDiff(url, decorate) {
  view.value = VIEW.LOADING;
  activeTab.value = TAB.CONTENT;
  contentDiff.value = null;
  metadataDiff.value = null;
  pageStatus.value = null;
  previewPane.value = null;
  livePane.value = null;

  try {
    const versions = await fetchVersions(url);
    if (versions.skipped || !versions.preview) {
      view.value = VIEW.EMPTY;
      return;
    }

    const liveHtml = versions.live?.html || EMPTY_MAIN_HTML;
    const nextContentDiff = diffContent(parseMain(versions.preview.html), parseMain(liveHtml));
    const nextMetadataDiff = diffMetadata(parseMain(versions.preview.html), parseMain(liveHtml));
    const [nextPreviewPane, nextLivePane] = await Promise.all([
      renderPane(versions.preview.html, { decorate }),
      renderPane(liveHtml, { decorate }),
    ]);
    applyHighlights(nextPreviewPane, nextLivePane, nextContentDiff);

    contentDiff.value = nextContentDiff;
    metadataDiff.value = nextMetadataDiff;
    pageStatus.value = versions.status;
    previewPane.value = nextPreviewPane;
    livePane.value = nextLivePane;
    view.value = hasChanges(nextContentDiff, nextMetadataDiff) ? VIEW.READY : VIEW.EMPTY;
  } catch (e) {
    window.lana?.log?.(`[preflight][diff-panel] ${e.message}`, { tags: 'preflight', errorType: 'i' });
    view.value = VIEW.EMPTY;
  }
}

function LastModifiedHeader() {
  const status = pageStatus.value;
  const liveBy = status?.live?.lastModifiedBy || 'Unknown';
  const previewBy = status?.preview?.lastModifiedBy || 'Unknown';
  return html`<p class="preflight-diff-header">Live: ${liveBy} · Preview: ${previewBy}</p>`;
}

function DiffTabs() {
  const isContentTab = activeTab.value === TAB.CONTENT;
  return html`
    <div class="preflight-diff-tabs" role="tablist" aria-label="Diff view">
      <button
        id="preflight-diff-tab-content"
        class="preflight-diff-tab"
        role="tab"
        aria-controls="preflight-diff-panel-content"
        aria-selected=${isContentTab}
        onClick=${() => { activeTab.value = TAB.CONTENT; }}>
        Content Changes
      </button>
      <button
        id="preflight-diff-tab-metadata"
        class="preflight-diff-tab"
        role="tab"
        aria-controls="preflight-diff-panel-metadata"
        aria-selected=${!isContentTab}
        onClick=${() => { activeTab.value = TAB.METADATA; }}>
        Metadata Changes
      </button>
    </div>`;
}

function ChangeRow({ change, previewRef, liveRef }) {
  return html`
    <li class="preflight-diff-change-item">
      <button
        class="preflight-diff-change-row"
        onClick=${() => {
    scrollToChange(previewRef.current, change);
    scrollToChange(liveRef.current, change);
  }}>
        <span class="preflight-diff-badge is-${change.type}">${BADGE_LABEL[change.type]}</span>
        <span class="preflight-diff-change-path">${change.path}</span>
      </button>
    </li>`;
}

function ContentTab({ previewRef, liveRef }) {
  const diff = contentDiff.value;
  const changes = [...diff.added, ...diff.modified, ...diff.removed];
  return html`
    <div
      id="preflight-diff-panel-content"
      class="preflight-diff-tabpanel"
      role="tabpanel"
      aria-labelledby="preflight-diff-tab-content"
      aria-selected=${activeTab.value === TAB.CONTENT}>
      <div class="preflight-diff-panes">
        <div class="preflight-diff-pane preflight-diff-pane-live">
          <p class="preflight-diff-pane-label">Live</p>
          <div class="preflight-diff-pane-body" ref=${liveRef}></div>
        </div>
        <div class="preflight-diff-pane preflight-diff-pane-preview">
          <p class="preflight-diff-pane-label">Preview</p>
          <div class="preflight-diff-pane-body" ref=${previewRef}></div>
        </div>
      </div>
      <div class="preflight-diff-changes">
        <p class="preflight-diff-changes-title">Changes (${changes.length})</p>
        ${changes.length === 0 && html`<p class="preflight-diff-empty-changes">No content changes</p>`}
        ${changes.length > 0 && html`
          <ul class="preflight-diff-change-list">
            ${changes.map((change) => html`<${ChangeRow}
              key=${`${change.type}-${change.path}`}
              change=${change}
              previewRef=${previewRef}
              liveRef=${liveRef} />`)}
          </ul>`}
      </div>
    </div>`;
}

function MetadataTab() {
  const rows = buildMetadataRows(metadataDiff.value);
  return html`
    <div
      id="preflight-diff-panel-metadata"
      class="preflight-diff-tabpanel"
      role="tabpanel"
      aria-labelledby="preflight-diff-tab-metadata"
      aria-selected=${activeTab.value === TAB.METADATA}>
      ${rows.length === 0 && html`<p class="preflight-diff-empty-changes">No metadata changes</p>`}
      ${rows.length > 0 && html`
        <table class="preflight-diff-metadata-table">
          <thead>
            <tr>
              <th class="preflight-diff-metadata-th">Key</th>
              <th class="preflight-diff-metadata-th">Live</th>
              <th class="preflight-diff-metadata-th">Preview</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => html`
              <tr key=${row.key} class="preflight-diff-metadata-row">
                <td class="preflight-diff-metadata-td preflight-diff-metadata-key">
                  <span class="preflight-diff-badge is-${row.type}">${BADGE_LABEL[row.type]}</span>
                  ${row.key}
                </td>
                <td class="preflight-diff-metadata-td">${row.liveValue ?? '—'}</td>
                <td class="preflight-diff-metadata-td">${row.previewValue ?? '—'}</td>
              </tr>`)}
          </tbody>
        </table>`}
    </div>`;
}

export default function DiffPanel({ url = new URL(window.location.href), decorate } = {}) {
  const previewRef = useRef(null);
  const liveRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only, props snapshotted
  useEffect(() => { loadDiff(url, decorate); }, []);

  useEffect(() => {
    if (liveRef.current && livePane.value) liveRef.current.replaceChildren(livePane.value);
    if (previewRef.current && previewPane.value) {
      previewRef.current.replaceChildren(previewPane.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- signal .value reads, not plain vars
  }, [previewPane.value, livePane.value]);

  if (view.value === VIEW.LOADING) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-loading">Loading content diff...</p>
      </div>`;
  }

  if (view.value === VIEW.EMPTY) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-empty">No unpublished changes</p>
      </div>`;
  }

  return html`
    <div class="preflight-diff">
      <${LastModifiedHeader} />
      <${DiffTabs} />
      <${ContentTab} previewRef=${previewRef} liveRef=${liveRef} />
      <${MetadataTab} />
    </div>`;
}
