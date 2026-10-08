import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/mep/mep-next/mep-next.js';
import DropdownFilter from './DropdownFilter.js';
import SearchTextarea from './SearchTextarea.js';
import Pagination from './Pagination.js';
import HowToAccordion from './HowToAccordion.js';
import TargetActivityChart from './TargetActivityChart.js';
import {
  LOCAL_STORAGE_KEYS,
  menuOptions,
  normalizeAuthoredFilters,
  toFilterParam,
  getDate,
  getAbsUrl,
  getButtonClasses,
} from '../utils.js';

const COPY_BUTTON_CLASSES = getButtonClasses('strong', 'l');
const SLACK_BUTTON_CLASSES = getButtonClasses('em', 'l');

const DEFAULT_FILTERS = {
  pageNum: 1,
  perPage: 25,
  filterText: '',
  orderBy: 'p.lastSeen',
  order: 'asc',
};

const REPORT_ROW_SKELETON_WIDTHS = ['65%', '45%', '75%', '52%', '38%', '60%'];

// Mirrors the real table row shape (checkbox + 4 columns) so nothing jumps once the
// report resolves.
function ReportRowsSkeleton() {
  return html`
    ${REPORT_ROW_SKELETON_WIDTHS.map((width, i) => html`
      <tr class="mmm2-report-row" key=${i}>
        <td><span class="mmm2-skeleton mmm2-skeleton-circle"></span></td>
        <td><span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width }}></span></td>
        <td><span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '50px' }}></span></td>
        <td><span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '90%' }}></span></td>
        <td><span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '80%' }}></span></td>
      </tr>
    `)}
  `;
}

const MENU_KEYS = { lastSeenManifest: 'lastseenmanifest', geos: 'geos' };
const normalizeReportFilters = (saved, config) => (
  normalizeAuthoredFilters(saved, config, MENU_KEYS, DEFAULT_FILTERS)
);

const HEADERS = [
  { label: 'URL', orderBy: 'p.url', colKey: 'url' },
  { label: 'Target', orderBy: 'p.target', colKey: 'target' },
  { label: 'Last Seen from Target', orderBy: 'a.lastSeen', colKey: 'lastSeen' },
  { label: 'Page Last Seen', orderBy: 'p.lastSeen', colKey: 'pageLastSeen' },
];

const MIN_COL_WIDTH = 20;

const SELECT_COL_WIDTH = 36;

const DEFAULT_COL_WIDTHS = {
  url: 420,
  target: 90,
  lastSeen: 220,
  pageLastSeen: 160,
};

const CHEVRON_UP = html`<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0L8 5H0L4 0Z" fill="currentColor"/></svg>`;
const CHEVRON_DOWN = html`<svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5L0 0H8L4 5Z" fill="currentColor"/></svg>`;

// Always-visible up/down chevron pair for a sortable header - the chevron matching
// the column's active sort direction is darkened, both stay a light neutral gray on
// non-active/unsorted columns.
function SortChevrons({ order }) {
  return html`
    <span class="mmm2-sort-chevrons">
      <span class="mmm2-sort-chevron ${order === 'asc' ? 'is-active' : ''}">${CHEVRON_UP}</span>
      <span class="mmm2-sort-chevron ${order === 'desc' ? 'is-active' : ''}">${CHEVRON_DOWN}</span>
    </span>
  `;
}

/**
 * Drag handle on a column's right edge. Plain document-level pointermove/pointerup
 * listeners (added on pointerdown, removed on pointerup) rather than pointer capture -
 * simpler, and works uniformly for mouse/touch/pen via the Pointer Events API.
 */
function ColumnResizer({ colKey, width, onResize, resizing, setResizing }) {
  const onPointerDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    setResizing(colKey);
    const onMove = (moveEvent) => {
      const next = Math.max(MIN_COL_WIDTH, startWidth + (moveEvent.clientX - startX));
      onResize(colKey, next);
    };
    const onUp = () => {
      setResizing(null);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return html`
    <span
      class="mmm2-col-resizer ${resizing === colKey ? 'is-resizing' : ''}"
      onPointerDown=${onPointerDown}
    ></span>
  `;
}

/**
 * Target inactivity, with instructions and menus supplied by the local authored table.
 */
function InactivityReportView({ authoredConfig }) {
  const [savedFilters, setFilters] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.inactivity,
    () => normalizeReportFilters({}, authoredConfig).filters,
  );
  const [sort, setSort] = useState(() => ({
    orderBy: DEFAULT_FILTERS.orderBy,
    order: DEFAULT_FILTERS.order,
  }));
  const { filters: normalizedFilters, resetFilters } = normalizeReportFilters(
    savedFilters,
    authoredConfig,
  );
  const filters = { ...normalizedFilters, ...sort };
  const [result, setResult] = useState({ result: [], totalRecords: 0 });
  const [loading, setLoading] = useState(false);
  const geosConfig = authoredConfig.geos;
  const [selected, setSelected] = useState(new Set());
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [copying, setCopying] = useState(false);
  const [colWidths, setColWidths] = useState(DEFAULT_COL_WIDTHS);
  const [resizingCol, setResizingCol] = useState(null);

  useEffect(() => {
    if (!copyFeedback || copying) return undefined;
    const timer = setTimeout(() => setCopyFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [copyFeedback, copying]);

  const resizeCol = (colKey, width) => {
    setColWidths((prev) => ({ ...prev, [colKey]: width }));
  };

  const updateFilters = (changes) => setFilters((prev) => ({
    ...normalizeReportFilters(prev, authoredConfig).filters,
    ...changes,
  }));
  const setFilter = (key, value) => {
    updateFilters({ [key]: value, pageNum: 1 });
  };

  const sortBy = (headerOrderBy) => {
    const currentOrder = filters.orderBy === headerOrderBy ? filters.order : 'asc';
    const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    setSort({ orderBy: headerOrderBy, order: nextOrder });
    updateFilters({ pageNum: 1 });
  };

  useEffect(() => {
    if (authoredConfig.error) return undefined;
    let cancelled = false;
    setLoading(true);
    const body = {
      pageNum: filters.pageNum,
      perPage: filters.perPage,
      lastSeenManifest: filters.lastSeenManifest,
      geos: filters.geos,
      filter: toFilterParam(filters.filterText),
      orderBy: filters.orderBy,
      order: filters.order,
    };
    fetch(API_URLS.report, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setResult(data);
          setSelected(new Set());
          setCopyFeedback(null);
        }
      })
      .catch(() => { if (!cancelled) setResult({ result: [], totalRecords: 0 }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const rows = result.result ?? [];
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.url));

  const toggleAll = () => {
    setCopyFeedback(null);
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.url)));
  };
  const toggleRow = (url) => {
    setCopyFeedback(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const copySelected = async () => {
    if (copying) return;
    if (selected.size === 0) {
      setCopyFeedback({ error: true, message: 'Select at least one page before copying.' });
      return;
    }
    const urls = [...selected];
    const text = `Please turn off Target integration from the following ${urls.length > 1 ? `${urls.length} pages:` : 'page:'}\n${urls.join('\n')}`;
    setCopying(true);
    setCopyFeedback(null);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback({
        error: false,
        message: `Copied ${urls.length} selected ${urls.length === 1 ? 'page' : 'pages'} to the clipboard.`,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy selected pages:', error);
      setCopyFeedback({ error: true, message: 'Unable to copy to the clipboard. Please try again.' });
    } finally {
      setCopying(false);
    }
  };
  const copyMessage = copying ? 'Copying selected pages...' : copyFeedback?.message;
  const copyMessageState = copyFeedback?.error ? 'error' : 'success';

  if (authoredConfig.error) {
    return html`<div class="mmm2-inactivity-view" role="alert">${authoredConfig.error}</div>`;
  }

  return html`
    <div class="mmm2-inactivity-view">
      <${HowToAccordion} title=${authoredConfig.howTo.title} content=${authoredConfig.howTo.html} />
      ${resetFilters.length ? html`<p role="status">Unavailable filter selections were reset: ${resetFilters.join(', ')}.</p>` : null}
      <${TargetActivityChart}
        selectedGeos=${filters.geos}
        geoGroups=${menuOptions(geosConfig).filter(({ value }) => value)}
      />
      <div class="mmm2-filters">
        <${DropdownFilter}
          id="mmm2-report-filter-lastseen"
          label=${authoredConfig.lastseenmanifest.label}
          options=${menuOptions(authoredConfig.lastseenmanifest)}
          value=${filters.lastSeenManifest}
          onChange=${(v) => setFilter('lastSeenManifest', v)}
        />
        <${DropdownFilter}
          id="mmm2-report-filter-geos"
          label=${geosConfig.label}
          options=${menuOptions(geosConfig)}
          value=${filters.geos}
          onChange=${(v) => setFilter('geos', v)}
        />
        <${SearchTextarea}
          id="mmm2-report-filter-search"
          label="Filter: search for a full or partial page URL, manifest URL, manifest experience name or Target activity name:"
          placeholder="https://www.adobe.com/creativecloud.html"
          value=${filters.filterText}
          onChange=${(v) => setFilter('filterText', v)}
        />
      </div>
      ${result.totalRecords > 0 ? html`<${Pagination}
        id="mmm2-report-pagination-dropdown-top"
        pageNum=${filters.pageNum}
        perPage=${filters.perPage}
        totalRecords=${result.totalRecords}
        loading=${loading}
        onPageChange=${(p) => updateFilters({ pageNum: p })}
        onPerPageChange=${(p) => updateFilters({ perPage: p })}
      />` : null}
      <div class="mmm2-report">
        <table class="mmm2-report-table">
          <colgroup>
            <col style=${{ width: `${SELECT_COL_WIDTH}px` }} />
            ${HEADERS.map((header) => html`<col key=${header.colKey} style=${{ width: `${colWidths[header.colKey]}px` }} />`)}
          </colgroup>
          <thead>
            <tr>
              <th class="mmm2-report-select-all">
                <label class="mmm2-report-select-all-label" for="mmm2-report-select-all" title="Select All">
                  <input type="checkbox" id="mmm2-report-select-all" checked=${allSelected} onChange=${toggleAll} />
                  <span class="mmm2-visually-hidden">Select All</span>
                </label>
              </th>
              ${HEADERS.map((header) => html`
                <th key=${header.colKey}>
                  <div class="mmm2-report-sortable" onClick=${() => sortBy(header.orderBy)}>
                    ${header.label}
                    <${SortChevrons} order=${filters.orderBy === header.orderBy ? filters.order : null} />
                  </div>
                  <${ColumnResizer}
                    colKey=${header.colKey}
                    width=${colWidths[header.colKey]}
                    onResize=${resizeCol}
                    resizing=${resizingCol}
                    setResizing=${setResizingCol}
                  />
                </th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${loading ? html`<${ReportRowsSkeleton} />` : rows.map((item) => html`
              <tr class="mmm2-report-row" key=${item.pageId}>
                <td><input type="checkbox" checked=${selected.has(item.url)} onChange=${() => toggleRow(item.url)} /></td>
                <td><a class="mmm2-primary-link" href="${item.url}?mep" target="_blank" rel="noopener">${item.url}</a></td>
                <td>${item.target}</td>
                <td>${getDate(item.aLastSeen)}<br/><a class="mmm2-medium mmm2-link-flat" target="_blank" rel="noopener" href=${getAbsUrl(item.manifestUrl, item.url)}>${item.targetActivityName}</a></td>
                <td>${getDate(item.pLastSeen)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
      <${Pagination}
        pageNum=${filters.pageNum}
        perPage=${filters.perPage}
        totalRecords=${result.totalRecords}
        loading=${loading}
        onPageChange=${(p) => updateFilters({ pageNum: p })}
        onPerPageChange=${(p) => updateFilters({ perPage: p })}
      />
      <div class="mmm2-report-actions">
        <div class="mmm2-action-area">
          <button type="button" class=${COPY_BUTTON_CLASSES} disabled=${copying} aria-disabled=${copying} onClick=${copySelected}>Copy Selected</button>
          <a class=${SLACK_BUTTON_CLASSES} href="https://adobe.enterprise.slack.com/archives/C08SA7JUW3F" target="_blank" rel="noopener">Open Slack</a>
          ${copyMessage ? html`
            <p class="mmm2-copy-message" data-state=${copying ? 'copying' : copyMessageState} role=${!copying && copyFeedback?.error ? 'alert' : 'status'} aria-atomic="true">${copyMessage}</p>
          ` : null}
        </div>
      </div>
    </div>
  `;
}

export default InactivityReportView;
