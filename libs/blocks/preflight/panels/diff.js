import { html, signal, useEffect, useRef, useState } from '../../../deps/htm-preact.js';
import fetchVersions from '../checks/diff/fetchVersions.js';
import computeDiff, { DIFF_STATE } from '../checks/diff/computeDiff.js';
import { highlightOnPage, jumpToChangeOnPage, areHighlightsDismissed, setHighlightsDismissed } from './diff-onpage.js';

// NEW_PAGE = confirmed-unpublished (safe to show as "all new"); ERROR = unknown/failed live fetch
const VIEW = { LOADING: 'loading', EMPTY: 'empty', ERROR: 'error', READY: 'ready', NEW_PAGE: 'new-page' };
const TAB = { CONTENT: 'content', METADATA: 'metadata' };
const BADGE_LABEL = { added: 'New', modified: 'Changed', removed: 'Removed' };
const DEFAULT_ERROR_MESSAGE = 'Something went wrong loading the content diff.';
const LIVE_UNAVAILABLE_MESSAGE = 'Couldn’t load the live version to compare.';
const NEW_PAGE_MESSAGE = 'This page isn’t published yet — all content is new.';
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const TEXT_TAGS = new Set(['P', 'LI', 'BLOCKQUOTE']);
const LABEL_TRUNCATE_LENGTH = 60;
const BLOCK_LABEL_PREFIX = { added: 'New block', modified: 'Changed block', removed: 'Removed block' };
// Snippet is a lightweight preview, not a full re-render — cap images rather than clone them all
const MAX_SNIPPET_IMAGES = 4;

const view = signal(VIEW.LOADING);
const activeTab = signal(TAB.CONTENT);
const contentDiff = signal(null);
const metadataDiff = signal(null);
const pageStatus = signal(null);
// Highlights may already be on from the auto-apply on preview load — start from the shared
// session-dismiss flag so the panel toggle and the on-page control agree.
const highlightsOn = signal(!areHighlightsDismissed());
const errorMessage = signal(DEFAULT_ERROR_MESSAGE);

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

function toggleHighlights() {
  highlightsOn.value = !highlightsOn.value;
  setHighlightsDismissed(!highlightsOn.value);
}

async function loadDiff(url) {
  view.value = VIEW.LOADING;
  activeTab.value = TAB.CONTENT;
  contentDiff.value = null;
  metadataDiff.value = null;
  pageStatus.value = null;
  errorMessage.value = DEFAULT_ERROR_MESSAGE;

  try {
    const versions = await fetchVersions(url);
    const diff = computeDiff(versions);
    // Set once a preview exists (every state but skipped/no-preview) — mirrors the check.
    if (diff.state !== DIFF_STATE.SKIPPED && diff.state !== DIFF_STATE.NO_PREVIEW) {
      pageStatus.value = versions.status;
    }

    switch (diff.state) {
      case DIFF_STATE.NO_PREVIEW:
        view.value = VIEW.ERROR;
        return;
      case DIFF_STATE.LIVE_UNAVAILABLE:
        errorMessage.value = LIVE_UNAVAILABLE_MESSAGE;
        view.value = VIEW.ERROR;
        return;
      case DIFF_STATE.NEW_PAGE:
        contentDiff.value = diff.content;
        metadataDiff.value = diff.metadata;
        view.value = VIEW.NEW_PAGE;
        return;
      case DIFF_STATE.READY:
        contentDiff.value = diff.content;
        metadataDiff.value = diff.metadata;
        view.value = hasChanges(diff.content, diff.metadata) ? VIEW.READY : VIEW.EMPTY;
        return;
      default: // SKIPPED — preview not newer than live, nothing unpublished
        view.value = VIEW.EMPTY;
    }
  } catch (e) {
    window.lana?.log?.(`[preflight][diff-panel] ${e.message}`, { tags: 'preflight', errorType: 'i' });
    errorMessage.value = DEFAULT_ERROR_MESSAGE;
    view.value = VIEW.ERROR;
  }
}

function LastModifiedHeader() {
  const status = pageStatus.value;
  const liveBy = status?.live?.lastModifiedBy || 'Unknown';
  const previewBy = status?.preview?.lastModifiedBy || 'Unknown';
  return html`<p class="preflight-diff-header">Live: ${liveBy} · Preview: ${previewBy}</p>`;
}

function HighlightToggle() {
  const on = highlightsOn.value;
  return html`
    <button
      class="preflight-diff-highlight-toggle"
      aria-pressed=${on}
      onClick=${toggleHighlights}>
      ${on ? 'Hide highlights' : 'Show highlights'}
    </button>`;
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

function DiffToolbar() {
  return html`
    <div class="preflight-diff-toolbar">
      <${DiffTabs} />
      <${HighlightToggle} />
    </div>`;
}

function truncateLabel(text) {
  if (!text) return '';
  if (text.length <= LABEL_TRUNCATE_LENGTH) return text;
  return `${text.slice(0, LABEL_TRUNCATE_LENGTH - 1)}…`;
}

// Title-case each word so a hyphenated class name (e.g. "two-up") reads like a name
function titleCaseBlockName(name) {
  return (name || '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Raw xpath isn't meaningful to authors — build a human-readable label (path stays as tooltip)
function describeChange(change) {
  if (change.kind === 'block') {
    return `${BLOCK_LABEL_PREFIX[change.type]}: ${titleCaseBlockName(change.blockName)}`;
  }
  const text = truncateLabel(change.previewText || change.liveText || '');
  if (change.tag === 'IMG') return text ? `Image (${text})` : 'Image';
  if (HEADING_TAGS.has(change.tag)) return `Heading: "${text}"`;
  if (change.tag === 'A') return `Link: "${text}"`;
  if (TEXT_TAGS.has(change.tag)) return `Text: "${text}"`;
  return `${change.tag.toLowerCase()}: "${text}"`;
}

// Fold type into the id since two changes could share a path (mirrors the list key)
function toDetailId(change) {
  return `preflight-diff-detail-${change.type}-${change.path}`.replace(/[^a-zA-Z0-9_-]/g, '-');
}

// Clones the real live/preview DOM node — never innerHTML from fetched content
function ClonedElement({ el }) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.textContent = '';
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.classList.add('preflight-diff-snippet-img');
    container.append(clone);
  }, [el]);
  return html`<div class="preflight-diff-snippet-media" ref=${ref}></div>`;
}

// Shows text + a capped set of cloned images as a stand-in — block markup isn't re-rendered raw
function BlockSnippet({ el, text }) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.textContent = '';
    const images = el ? [...el.querySelectorAll('img')].slice(0, MAX_SNIPPET_IMAGES) : [];
    images.forEach((img) => {
      const clone = img.cloneNode(true);
      clone.classList.add('preflight-diff-snippet-img');
      container.append(clone);
    });
  }, [el]);
  return html`
    <div class="preflight-diff-snippet-block">
      <p class="preflight-diff-snippet-text">${text || 'No text content'}</p>
      <div class="preflight-diff-snippet-media" ref=${ref}></div>
    </div>`;
}

// Rendered as a plain text child (not innerHTML), so fetched text is safe without manual escaping
function TextSnippet({ text }) {
  return html`<p class="preflight-diff-snippet-text">${text || '(no text)'}</p>`;
}

function ChangeSnippet({ change, side }) {
  const el = side === 'live' ? change.liveEl : change.previewEl;
  const text = side === 'live' ? change.liveText : change.previewText;

  if (change.kind === 'block') return html`<${BlockSnippet} el=${el} text=${text} />`;
  if (change.tag === 'IMG') {
    if (!el) return html`<p class="preflight-diff-snippet-empty">Image unavailable</p>`;
    return html`<${ClonedElement} el=${el} />`;
  }
  return html`<${TextSnippet} text=${text} />`;
}

// Modified shows both sides; Removed only has a live side; Added's "after" is just context
function ChangeDetail({ change }) {
  if (change.type === 'modified') {
    return html`
      <div class="preflight-diff-detail-columns">
        <div class="preflight-diff-detail-col">
          <p class="preflight-diff-detail-label">Before</p>
          <${ChangeSnippet} change=${change} side="live" />
        </div>
        <div class="preflight-diff-detail-col">
          <p class="preflight-diff-detail-label">After</p>
          <${ChangeSnippet} change=${change} side="preview" />
        </div>
      </div>`;
  }
  if (change.type === 'removed') {
    return html`
      <div class="preflight-diff-detail-columns">
        <div class="preflight-diff-detail-col">
          <p class="preflight-diff-detail-label">Removed</p>
          <${ChangeSnippet} change=${change} side="live" />
        </div>
      </div>`;
  }
  return html`
    <div class="preflight-diff-detail-columns">
      <div class="preflight-diff-detail-col">
        <p class="preflight-diff-detail-label">After</p>
        <${ChangeSnippet} change=${change} side="preview" />
      </div>
    </div>`;
}

// Removed rows aren't clickable (nothing on the page to jump to); expand is a separate button so
// it doesn't trigger the jump.
function ChangeRow({ change }) {
  const isOnPage = change.type !== 'removed';
  const [expanded, setExpanded] = useState(false);
  const detailId = toDetailId(change);
  const label = describeChange(change);
  return html`
    <li class="preflight-diff-change-item">
      <div class="preflight-diff-change-row-group">
        <button
          type="button"
          class="preflight-diff-change-row"
          disabled=${!isOnPage}
          onClick=${() => isOnPage && jumpToChangeOnPage(change)}>
          <span class="preflight-diff-badge is-${change.type}">${BADGE_LABEL[change.type]}</span>
          <span class="preflight-diff-change-path" title=${change.path}>${label}</span>
        </button>
        <button
          type="button"
          class="preflight-diff-change-expand"
          aria-expanded=${expanded}
          aria-controls=${expanded ? detailId : undefined}
          aria-label=${`${expanded ? 'Hide' : 'Show'} details for ${label}`}
          onClick=${() => setExpanded((prev) => !prev)}>
          <span class="preflight-diff-expand-chevron" aria-hidden="true"></span>
        </button>
      </div>
      ${expanded && html`
        <div id=${detailId} class="preflight-diff-change-detail">
          <${ChangeDetail} change=${change} />
        </div>`}
    </li>`;
}

function ContentTab() {
  const diff = contentDiff.value;
  const changes = [...diff.added, ...diff.modified, ...diff.removed];
  return html`
    <div
      id="preflight-diff-panel-content"
      class="preflight-diff-tabpanel"
      role="tabpanel"
      aria-labelledby="preflight-diff-tab-content"
      hidden=${activeTab.value !== TAB.CONTENT}>
      <div class="preflight-diff-changes">
        <p class="preflight-diff-changes-title">Changes (${changes.length})</p>
        ${changes.length === 0 && html`<p class="preflight-diff-empty-changes">No content changes</p>`}
        ${changes.length > 0 && html`
          <ul class="preflight-diff-change-list">
            ${changes.map((change) => html`<${ChangeRow}
              key=${`${change.type}-${change.path}`}
              change=${change} />`)}
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
      hidden=${activeTab.value !== TAB.METADATA}>
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

export default function DiffPanel({ url: rawUrl, selected = true } = {}) {
  const url = rawUrl || new URL(window.location.href);
  const hasLoadedRef = useRef(false);

  // Overlays live on the page and intentionally outlive the modal —
  // cleared by the on-page control or reload.
  useEffect(() => {
    if (!highlightsOn.value || !contentDiff.value) return undefined;
    const root = document.querySelector('main');
    if (!root) return undefined;
    return highlightOnPage(contentDiff.value, root, () => {
      highlightsOn.value = false;
      setHighlightsDismissed(true);
    });
  });

  // Runs in the render body (not useEffect) so the guard latches immediately, avoiding a race
  // with the async loadDiff() work.
  if (selected && !hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadDiff(url);
  }

  if (view.value === VIEW.LOADING) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-loading">Loading content diff...</p>
      </div>`;
  }

  if (view.value === VIEW.ERROR) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-error">${errorMessage.value}</p>
        <button class="preflight-action preflight-diff-retry" onClick=${() => loadDiff(url)}>
          Retry
        </button>
      </div>`;
  }

  if (view.value === VIEW.EMPTY) {
    return html`
      <div class="preflight-diff">
        <p class="preflight-diff-empty">No unpublished changes</p>
      </div>`;
  }

  if (view.value === VIEW.NEW_PAGE) {
    return html`
      <div class="preflight-diff ${highlightsOn.value ? 'preflight-diff-active' : ''}">
        <p class="preflight-diff-new-page">${NEW_PAGE_MESSAGE}</p>
        <${LastModifiedHeader} />
        <${DiffToolbar} />
        <${ContentTab} />
        <${MetadataTab} />
      </div>`;
  }

  return html`
    <div class="preflight-diff ${highlightsOn.value ? 'preflight-diff-active' : ''}">
      <${LastModifiedHeader} />
      <${DiffToolbar} />
      <${ContentTab} />
      <${MetadataTab} />
    </div>`;
}
