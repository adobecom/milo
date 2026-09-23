import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import DropdownFilter from './DropdownFilter.js';
import SearchTextarea from './SearchTextarea.js';
import Pagination from './Pagination.js';
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

// Report only ever offers the 4 shortest windows (matches original mmm.js).
const REPORT_LAST_SEEN_KEYS = ['day', 'week', 'month', 'threeMonths'];
const reportLastSeenOptions = Object.entries(LAST_SEEN_OPTIONS)
  .filter(([key]) => REPORT_LAST_SEEN_KEYS.includes(key))
  .map(([, o]) => ({ value: o.key, label: o.value }));

const HEADERS = [
  { label: 'URL', orderBy: 'p.url' },
  { label: 'Target', orderBy: 'p.target' },
  { label: 'Last Seen from Target', orderBy: 'a.lastSeen' },
  { label: 'Page Last Seen', orderBy: 'p.lastSeen' },
];

const SORT_ARROW = html`<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.70504 0L0.295044 1.41L4.87504 6L0.295044 10.59L1.70504 12L7.70504 6L1.70504 0Z" fill="currentColor"/></svg>`;

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
      <div class="mmm2-report-actions">
        <p class="mmm2-action-area ${copyState === 'error' ? 'has-error' : ''} ${copyState === 'success' ? 'has-success' : ''}">
          <a class="con-button blue button-l" onClick=${copySelected}>Copy Selected</a>
          <a class="con-button button-l" href="https://adobe.enterprise.slack.com/archives/C08SA7JUW3F" target="_blank" rel="noopener">Open Slack</a>
        </p>
      </div>
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
      <div class="mmm2-report">
        <div class="mmm2-report-header">
          <div class="mmm2-report-select-all">
            <input type="checkbox" id="mmm2-report-select-all" checked=${allSelected} onChange=${toggleAll} />
            <label for="mmm2-report-select-all">Select All</label>
          </div>
          ${HEADERS.map((header) => html`
            <div key=${header.orderBy} class="mmm2-report-sortable" onClick=${() => sortBy(header.orderBy)}>
              ${header.label}
              ${filters.orderBy === header.orderBy ? html`<span class="mmm2-sort-arrow mmm2-sort-${filters.order}">${SORT_ARROW}</span>` : null}
            </div>
          `)}
        </div>
        <div class="mmm2-report-body">
          ${loading ? html`<div class="mmm2-loading">Loading…</div>` : rows.map((item) => html`
            <div class="mmm2-report-row" key=${item.pageId}>
              <div><input type="checkbox" checked=${selected.has(item.url)} onChange=${() => toggleRow(item.url)} /></div>
              <div><a href="${item.url}?mep" target="_blank" rel="noopener">${item.url}</a></div>
              <div>${item.target}</div>
              <div>${getDate(item.aLastSeen)}<br/><a class="mmm2-small" target="_blank" rel="noopener" href=${getAbsUrl(item.manifestUrl, item.url)}>${item.targetActivityName}</a></div>
              <div>${getDate(item.pLastSeen)}</div>
            </div>
          `)}
        </div>
      </div>
      <${Pagination}
        pageNum=${filters.pageNum}
        perPage=${filters.perPage}
        totalRecords=${result.totalRecords}
        onPageChange=${(p) => setFilters((prev) => ({ ...prev, pageNum: p }))}
        onPerPageChange=${(p) => setFilters((prev) => ({ ...prev, perPage: p }))}
      />
    </div>
  `;
}

export default InactivityReportView;
