import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import DropdownFilter from './DropdownFilter.js';
import SearchTextarea from './SearchTextarea.js';
import Pagination from './Pagination.js';
import HowToAccordion from './HowToAccordion.js';
import {
  LAST_SEEN_OPTIONS,
  LOCAL_STORAGE_KEYS,
  REFERENCE_PAGES,
  fetchReferenceConfig,
  toFilterParam,
  getDate,
  getAbsUrl,
} from '../utils.js';

const DEFAULT_FILTERS = {
  pageNum: 1,
  perPage: 25,
  lastSeenManifest: 'week',
  geos: '',
  filterText: '',
  orderBy: 'a.lastSeen',
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

// Report only ever offers the 4 shortest windows (matches original mmm.js).
const REPORT_LAST_SEEN_KEYS = ['day', 'week', 'month', 'threeMonths'];
const reportLastSeenOptions = Object.entries(LAST_SEEN_OPTIONS)
  .filter(([key]) => REPORT_LAST_SEEN_KEYS.includes(key))
  .map(([, o]) => ({ value: o.key, label: o.value }));

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
 * Today's "target-cleanup" mmm variant: the Target-inactivity report. Its `geos`
 * dropdown config is authored on the original /mep-target-inactivity page, not this
 * one - fetched once client-side via the Franklin `.plain.html` convention (see
 * fetchReferenceConfig in utils.js) rather than duplicating that authored content here.
 */
function InactivityReportView() {
  const [filters, setFilters] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.inactivity,
    () => DEFAULT_FILTERS,
  );
  const [result, setResult] = useState({ result: [], totalRecords: 0 });
  const [loading, setLoading] = useState(false);
  const [geosConfig, setGeosConfig] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [copyState, setCopyState] = useState('idle'); // idle | error | success
  const [colWidths, setColWidths] = useState(DEFAULT_COL_WIDTHS);
  const [resizingCol, setResizingCol] = useState(null);

  const resizeCol = (colKey, width) => {
    setColWidths((prev) => ({ ...prev, [colKey]: width }));
  };

  useEffect(() => {
    fetchReferenceConfig(REFERENCE_PAGES.inactivity, '.mmm.target-cleanup')
      .then((config) => setGeosConfig(config.geos ?? null))
      .catch(() => setGeosConfig(null));
  }, []);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNum: 1 }));
  };

  const sortBy = (headerOrderBy) => {
    const currentOrder = filters.orderBy === headerOrderBy ? filters.order : 'asc';
    const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    setFilters((prev) => ({ ...prev, orderBy: headerOrderBy, order: nextOrder, pageNum: 1 }));
  };

  useEffect(() => {
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
      .then((data) => { if (!cancelled) { setResult(data); setSelected(new Set()); } })
      .catch(() => { if (!cancelled) setResult({ result: [], totalRecords: 0 }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const rows = result.result ?? [];
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.url));

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.url)));
  };
  const toggleRow = (url) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const copySelected = () => {
    if (selected.size === 0) {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 3000);
      return;
    }
    const urls = [...selected];
    const text = `Please turn off Target integration from the following ${urls.length > 1 ? `${urls.length} pages:` : 'page:'}\n${urls.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopyState('success');
    setTimeout(() => setCopyState('idle'), 3000);
  };

  return html`
    <div class="mmm2-inactivity-view">
      <${HowToAccordion}>
        <ol>
          <li>Search for your pages and adjust filters if desired</li>
          <li>Select pages where you would like to disable Target</li>
          <li>Click "Copy Selected"</li>
          <li>Click "Open Slack"</li>
          <li>Paste your request in Slack.</li>
        </ol>
        <a class="con-button button-s mmm2-howto-link" href="/docs/authoring/features/mep/target-integration" target="_blank" rel="noopener">Learn more</a>
      <//>
      <div class="mmm2-filters">
        <${DropdownFilter}
          id="mmm2-report-filter-lastseen"
          label="Target manifests not seen in the last"
          options=${reportLastSeenOptions}
          value=${filters.lastSeenManifest}
          onChange=${(v) => setFilter('lastSeenManifest', v)}
        />
        ${geosConfig ? html`<${DropdownFilter}
          id="mmm2-report-filter-geos"
          label=${geosConfig.label}
          options=${Object.entries(geosConfig.options).map(([value, label]) => ({ value, label }))}
          value=${filters.geos}
          onChange=${(v) => setFilter('geos', v)}
        />` : null}
        <${SearchTextarea}
          id="mmm2-report-filter-search"
          label="Filter: search for a full or partial page URL, manifest URL, manifest experience name or Target activity name:"
          placeholder="https://www.adobe.com/creativecloud.html"
          value=${filters.filterText}
          onChange=${(v) => setFilter('filterText', v)}
        />
      </div>
      <div class="mmm2-report-actions">
        <p class="mmm2-action-area ${copyState === 'error' ? 'has-error' : ''} ${copyState === 'success' ? 'has-success' : ''}">
          <a class="con-button blue button-l" onClick=${copySelected}>Copy Selected</a>
          <a class="con-button button-l" href="https://adobe.enterprise.slack.com/archives/C08SA7JUW3F" target="_blank" rel="noopener">Open Slack</a>
        </p>
      </div>
      <div class="mmm2-report">
        <table class="mmm2-report-table">
          <colgroup>
            <col style=${{ width: `${SELECT_COL_WIDTH}px` }} />
            ${HEADERS.map((header) => html`<col key=${header.colKey} style=${{ width: `${colWidths[header.colKey]}px` }} />`)}
          </colgroup>
          <thead>
            <tr>
              <th class="mmm2-report-select-all">
                <input type="checkbox" id="mmm2-report-select-all" aria-label="Select All" checked=${allSelected} onChange=${toggleAll} />
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
        onPageChange=${(p) => setFilters((prev) => ({ ...prev, pageNum: p }))}
        onPerPageChange=${(p) => setFilters((prev) => ({ ...prev, perPage: p }))}
      />
    </div>
  `;
}

export default InactivityReportView;
