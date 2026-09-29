import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/personalization/preview.js';
import DropdownFilter from './DropdownFilter.js';
import CheckboxFilterGroup from './CheckboxFilterGroup.js';
import SearchTextarea from './SearchTextarea.js';
import TextFilter from './TextFilter.js';
import PageListItem from './PageListItem.js';
import Pagination from './Pagination.js';
import HowToAccordion from './HowToAccordion.js';
import {
  LAST_SEEN_OPTIONS,
  SUBDOMAIN_OPTIONS,
  TARGETSETTING_OPTIONS,
  MANIFESTSRC_OPTIONS,
  LOCAL_STORAGE_KEYS,
  REFERENCE_PAGES,
  fetchReferenceConfig,
  toFilterParam,
} from '../utils.js';

// Varied so the skeleton reads as organic placeholder text, not a robotic repeat.
const PAGE_ROW_SKELETON_WIDTHS = ['55%', '70%', '40%', '62%', '48%', '35%'];

function PageListSkeleton() {
  return html`
    ${PAGE_ROW_SKELETON_WIDTHS.map((width, i) => html`
      <div class="mmm2-page-item" key=${i}>
        <div class="mmm2-page-trigger">
          <span class="mmm2-skeleton mmm2-skeleton-circle"></span>
          <span class="mmm2-skeleton mmm2-skeleton-text mmm2-page-heading" style=${{ width }}></span>
          <span class="mmm2-skeleton mmm2-skeleton-text" style=${{ width: '110px' }}></span>
        </div>
      </div>
    `)}
  `;
}

const DEFAULT_FILTERS = {
  pageNum: 1,
  perPage: 25,
  lastSeenManifest: 'threeMonths',
  subdomain: 'www',
  targetSetting: 'on, off, postLCP',
  manifestSrc: 'pzn, promo, target, ajo, placeholders',
  manifestConsentType: '',
  manifestCountryRestriction: '',
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
 * `geos` dropdowns is authored on the original (pre-mmm-2) /mmm report page, not this
 * one - fetched once client-side via the Franklin `.plain.html` convention (see
 * fetchReferenceConfig in utils.js), same pattern InactivityReportView uses for its own
 * geos dropdown, rather than requiring that content to be re-authored on /mmm-2.
 */
function SearchView() {
  const [filters, setFilters] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.search,
    () => DEFAULT_FILTERS,
  );
  const [result, setResult] = useState({ result: [], totalRecords: 0 });
  const [loading, setLoading] = useState(false);
  const [authoredConfig, setAuthoredConfig] = useState({});

  useEffect(() => {
    fetchReferenceConfig(REFERENCE_PAGES.search, '.mmm')
      .then(setAuthoredConfig)
      .catch(() => setAuthoredConfig({}));
  }, []);

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
      manifestConsentType: filters.manifestConsentType,
      manifestCountryRestriction: filters.manifestCountryRestriction,
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
      <${HowToAccordion}>
        <ol>
          <li>Search for your pages and adjust filters if desired</li>
          <li>Click on a page to open more details</li>
          <li>Look through the list of manifests and select an experience you would like to see.*</li>
          <li>Select any options you would like to include</li>
          <li>Click Preview</li>
        </ol>
        <p class="mmm2-howto-note">* Keeping "None" selected does not add the manifest to your preview URL and will not force the manifest to load. But if the manifest is still attached to the page, it will load anyways. If you want to force the default experience, choose "Default" from the dropdown menu.</p>
      <//>
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
        <${TextFilter}
          id="mmm2-filter-manifestconsenttype"
          label="Manifest Consent Type"
          placeholder="e.g. strict, implicit"
          value=${filters.manifestConsentType}
          onChange=${(v) => setFilter('manifestConsentType', v)}
        />
        <${TextFilter}
          id="mmm2-filter-manifestcountryrestriction"
          label="Manifest Country Restriction"
          placeholder="e.g. US, CA"
          value=${filters.manifestCountryRestriction}
          onChange=${(v) => setFilter('manifestCountryRestriction', v)}
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
    ? html`<${PageListSkeleton} />`
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
        loading=${loading}
        onPageChange=${(p) => setFilters((prev) => ({ ...prev, pageNum: p }))}
        onPerPageChange=${(p) => setFilters((prev) => ({ ...prev, perPage: p }))}
      />
    </div>
  `;
}

export default SearchView;
