import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import DropdownFilter from './DropdownFilter.js';
import CheckboxFilterGroup from './CheckboxFilterGroup.js';
import SearchTextarea from './SearchTextarea.js';
import PageListItem from './PageListItem.js';
import Pagination from './Pagination.js';
import {
  LAST_SEEN_OPTIONS,
  SUBDOMAIN_OPTIONS,
  TARGETSETTING_OPTIONS,
  MANIFESTSRC_OPTIONS,
  LOCAL_STORAGE_KEYS,
  toFilterParam,
} from '../utils.js';

const DEFAULT_FILTERS = {
  pageNum: 1,
  perPage: 25,
  lastSeenManifest: 'threeMonths',
  subdomain: 'www',
  targetSetting: 'on, off, postLCP',
  manifestSrc: 'pzn, promo, target, ajo, placeholders',
  pages: '',
  geos: '',
  filterText: '',
};

const optionsFromParsedTable = (group) => (
  group ? Object.entries(group.options).map(([value, label]) => ({ value, label })) : []
);
const optionsFromEnumKV = (obj) => Object.values(obj)
  .map((o) => ({ value: o.key, label: o.value }));

/**
 * Today's "base" mmm variant: page search/filter tool. Config for the `pages` and
 * `geos` dropdowns is authored directly on this same page/block (parsed in mmm-2.js's
 * init() and passed in as `searchConfig`), matching the original mmm.js behavior for
 * this variant (no cross-page fetch needed here).
 */
function SearchView({ searchConfig }) {
  const [filters, setFilters] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.search,
    () => DEFAULT_FILTERS,
  );
  const [result, setResult] = useState({ result: [], totalRecords: 0 });
  const [loading, setLoading] = useState(false);

  const authoredConfig = searchConfig ?? {};

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNum: 1 }));
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const body = {
      pageNum: filters.pageNum,
      perPage: filters.perPage,
      lastSeenManifest: filters.lastSeenManifest,
      subdomain: filters.subdomain,
      targetSetting: filters.targetSetting,
      manifestSrc: filters.manifestSrc,
      pages: filters.pages,
      geos: filters.geos,
      filter: toFilterParam(filters.filterText),
    };
    fetch(API_URLS.pageList, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json())
      .then((data) => { if (!cancelled) setResult(data); })
      .catch(() => { if (!cancelled) setResult({ result: [], totalRecords: 0 }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return html`
    <div class="mmm2-search-view">
      <div class="mmm2-filters">
        ${authoredConfig.pages ? html`<${DropdownFilter}
          id="mmm2-filter-pages"
          label=${authoredConfig.pages.label}
          options=${optionsFromParsedTable(authoredConfig.pages)}
          value=${filters.pages}
          onChange=${(v) => setFilter('pages', v)}
        />` : null}
        ${authoredConfig.geos ? html`<${DropdownFilter}
          id="mmm2-filter-geos"
          label=${authoredConfig.geos.label}
          options=${optionsFromParsedTable(authoredConfig.geos)}
          value=${filters.geos}
          onChange=${(v) => setFilter('geos', v)}
        />` : null}
        <${DropdownFilter}
          id="mmm2-filter-lastseen"
          label="Manifests seen in the last"
          options=${optionsFromEnumKV(LAST_SEEN_OPTIONS)}
          value=${filters.lastSeenManifest}
          onChange=${(v) => setFilter('lastSeenManifest', v)}
        />
        <${DropdownFilter}
          id="mmm2-filter-subdomain"
          label="Subdomain"
          options=${optionsFromEnumKV(SUBDOMAIN_OPTIONS)}
          value=${filters.subdomain}
          onChange=${(v) => setFilter('subdomain', v)}
        />
        <${CheckboxFilterGroup}
          id="mmm2-filter-targetsetting"
          legend="Page's Target Setting"
          options=${Object.values(TARGETSETTING_OPTIONS)}
          value=${filters.targetSetting}
          onChange=${(v) => setFilter('targetSetting', v)}
        />
        <${CheckboxFilterGroup}
          id="mmm2-filter-manifestsrc"
          legend="Manifest Source"
          options=${Object.values(MANIFESTSRC_OPTIONS)}
          value=${filters.manifestSrc}
          onChange=${(v) => setFilter('manifestSrc', v)}
        />
        <${SearchTextarea}
          id="mmm2-filter-search"
          label="Filter: search for a full or partial page URL (production only), manifest URL, manifest experience name or Target activity name:"
          placeholder="https://www.adobe.com/creativecloud.html&#10;/test_campaign4/test-campaign4-business.json&#10;DC1031"
          value=${filters.filterText}
          onChange=${(v) => setFilter('filterText', v)}
        />
      </div>
      <div class="mmm2-page-list">
        ${loading
    ? html`<div class="mmm2-loading">Loading…</div>`
    : (result.result ?? []).map((page) => html`
          <${PageListItem}
            key=${page.pageId}
            page=${page}
            lastSeenManifest=${filters.lastSeenManifest}
            manifestSrc=${filters.manifestSrc}
          />
        `)}
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

export default SearchView;
