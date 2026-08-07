import { html, signal, useEffect, useRef, useState } from '../../../deps/htm-preact.js';
import fetchVersions from '../checks/diff/fetchVersions.js';
import diffContent from '../checks/diff/diffContent.js';
import diffMetadata from '../checks/diff/diffMetadata.js';
import { highlightOnPage, jumpToChangeOnPage } from './diff-onpage.js';

const EMPTY_MAIN_HTML = '<main></main>';
// NEW_PAGE and ERROR are both "live not ok" outcomes, split by whether admin status confirms
// the page was never published (safe to label preview content as new) or not (never guess —
// show an explicit "couldn't load" state instead of fabricating a diff against an empty live).
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
// A block's raw pre-decoration markup can carry many images (rows/cells) — the detail snippet
// is meant as a lightweight "what did this look like" preview, not a full re-render, so it's
// capped rather than cloning every image the block ever had.
const MAX_SNIPPET_IMAGES = 4;

const view = signal(VIEW.LOADING);
const activeTab = signal(TAB.CONTENT);
const contentDiff = signal(null);
const metadataDiff = signal(null);
const pageStatus = signal(null);
const highlightsOn = signal(true);
const errorMessage = signal(DEFAULT_ERROR_MESSAGE);

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

function toggleHighlights() {
  highlightsOn.value = !highlightsOn.value;
}

// Self-contained: the Inc-1 check's `details` has classifications but not the raw
// .plain.html the panes need, so the panel fetches and diffs its own copy on mount.
async function loadDiff(url) {
  view.value = VIEW.LOADING;
  activeTab.value = TAB.CONTENT;
  contentDiff.value = null;
  metadataDiff.value = null;
  pageStatus.value = null;
  errorMessage.value = DEFAULT_ERROR_MESSAGE;

  try {
    const versions = await fetchVersions(url);
    if (versions.skipped) {
      view.value = VIEW.EMPTY;
      return;
    }
    if (!versions.preview) {
      view.value = VIEW.ERROR;
      return;
    }

    const previewMain = parseMain(versions.preview.html);
    pageStatus.value = versions.status;

    // The live .plain.html didn't load — never fabricate an empty live doc to diff against.
    // Only a confirmed-unpublished page (admin status has no live lastModified) is safe to show
    // as "all new"; a live page that IS published (or whose publish state is unknown) must show
    // an explicit "couldn't load" state instead of guessing.
    if (versions.liveStatus !== 'ok') {
      const isConfirmedUnpublished = versions.status != null && !versions.status.live?.lastModified;
      if (isConfirmedUnpublished) {
        const emptyMain = parseMain(EMPTY_MAIN_HTML);
        contentDiff.value = diffContent(previewMain, emptyMain);
        metadataDiff.value = diffMetadata(previewMain, emptyMain);
        view.value = VIEW.NEW_PAGE;
        return;
      }
      errorMessage.value = LIVE_UNAVAILABLE_MESSAGE;
      view.value = VIEW.ERROR;
      return;
    }

    const liveMain = parseMain(versions.live.html);
    const nextContentDiff = diffContent(previewMain, liveMain);
    const nextMetadataDiff = diffMetadata(previewMain, liveMain);

    contentDiff.value = nextContentDiff;
    metadataDiff.value = nextMetadataDiff;
    view.value = hasChanges(nextContentDiff, nextMetadataDiff) ? VIEW.READY : VIEW.EMPTY;
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

// Milo block class names are single tokens, sometimes hyphenated (e.g. "two-up") — title-case
// each word so the label reads like a name rather than a raw CSS class.
function titleCaseBlockName(name) {
  return (name || '')
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Raw xpaths (e.g. "/div[1]/p[3]") aren't meaningful to authors — build a human-readable label
// from the change's tag + text instead. The raw path stays as the row's title/tooltip.
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

// `change.path` is a raw xpath ("/div[1]/p[3]") — safe as an HTML id, but not guaranteed unique
// enough alone if two changes ever shared a path, so type is folded in too (mirrors the list key).
function toDetailId(change) {
  return `preflight-diff-detail-${change.type}-${change.path}`.replace(/[^a-zA-Z0-9_-]/g, '-');
}

// Clones a live/preview DOM node (never a network string) into a scoped container via useEffect
// + ref — no loadArea, no decoration, no innerHTML from fetched content. Used for an <img> leaf
// change, where the actual live/preview <img> (with its real src) is the most useful preview.
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

// A block never gets its raw markup re-rendered here (unstyled block internals look bad) — only
// its text and a capped set of its own <img> nodes (cloned, not re-parsed) are shown, as a
// lightweight stand-in for "what did this block look like".
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

// Text is rendered through Preact's own templating (a plain text child, not innerHTML), so
// fetched live/preview strings are inserted safely without any manual escaping.
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

// Before/after detail shown when a change row is expanded. Changed shows both sides so the
// author can see what flips; Removed shows only the live side (there's no preview counterpart);
// Added's "after" is optional context — it's already visible on the page once published.
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

// Removed content never rendered on the preview page in the first place — there's nothing on
// the page to jump to, so that row stays a plain (non-interactive) list entry. The expand toggle
// is a separate control from the jump button (not a nested button) so it can reveal the
// before/after detail without also triggering the jump-to-page action.
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
          aria-controls=${detailId}
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

  // Mirror the toggle/change-list onto the real preview page: on while the toggle is on and a
  // diff has loaded, off (cleaned up) otherwise — same guard the toggle CSS uses in the modal.
  // No dependency array: highlightsOn/contentDiff are module-level signals (not component state
  // or props), so re-running after every render — rather than listing them as deps — is what
  // actually reacts to their changes here. highlightOnPage clears+reapplies idempotently.
  useEffect(() => {
    if (!highlightsOn.value || !contentDiff.value) return undefined;
    const root = document.querySelector('main');
    if (!root) return undefined;
    return highlightOnPage(contentDiff.value, root, () => { highlightsOn.value = false; });
  });

  // On-demand: every preflight tab mounts at once, so without this guard the fetch would fire
  // on every preflight open, tab viewed or not. Runs synchronously in the render body — not in
  // a useEffect — so the guard latches immediately, instead of racing the async loadDiff() work
  // against a separately-scheduled effect.
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
