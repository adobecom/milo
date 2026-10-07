import { html, useState, useEffect } from '../../../deps/htm-preact.js';
import useLocalStorageState from '../../../hooks/useLocalStorageState.js';
import { API_URLS } from '../../../features/mep/mep-next/mep-next.js';
import {
  PROMO_OR_NO_OFFER_CHANGES,
  NON_PERSONALIZED_OFFER_TEST,
  PERSONALIZED_OFFER,
} from '../../../features/personalization/personalization.js';
import DropdownFilter from './DropdownFilter.js';
import CheckboxFilterGroup from './CheckboxFilterGroup.js';
import SearchTextarea from './SearchTextarea.js';
import TextFilter from './TextFilter.js';
import PageListItem from './PageListItem.js';
import Pagination from './Pagination.js';
import HowToAccordion from './HowToAccordion.js';
import {
  TARGETSETTING_OPTIONS,
  MANIFESTSRC_OPTIONS,
  LOCAL_STORAGE_KEYS,
  toFilterParam,
  menuOptions,
  normalizeAuthoredFilters,
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

const MANIFEST_CONSENT_TYPE_OPTIONS = [
  { value: PROMO_OR_NO_OFFER_CHANGES, label: 'Promo Or No Offer Changes' },
  { value: NON_PERSONALIZED_OFFER_TEST, label: 'Non-Personalized Offer Test' },
  { value: PERSONALIZED_OFFER, label: 'Personalized Offer' },
];
const ALL_CONSENT_TYPES = MANIFEST_CONSENT_TYPE_OPTIONS.map(({ value }) => value).join(', ');

const DEFAULT_FILTERS = {
  pageNum: 1,
  perPage: 25,
  targetSetting: 'on, off, postLCP',
  manifestSrc: 'pzn, promo, target, ajo, placeholders',
  manifestConsentType: ALL_CONSENT_TYPES,
  manifestCountryRestriction: '',
  filterText: '',
};

const SEARCH_PLACEHOLDER = 'https://www.adobe.com/creativecloud.html\n/test_campaign4/test-campaign4-business.json\nDC1031';
const getSearchMenus = (authoredConfig) => Object.entries(authoredConfig)
  .filter(([, group]) => group?.options)
  .map(([key, group]) => ({
    ...group,
    key: key === 'lastseenmanifest' ? 'lastSeenManifest' : key,
  }));
const normalizeSearchFilters = (savedFilters, authoredConfig) => (
  normalizeAuthoredFilters(
    savedFilters,
    authoredConfig,
    Object.fromEntries(getSearchMenus(authoredConfig).map(({ key }) => [key, key.toLowerCase()])),
    DEFAULT_FILTERS,
  )
);

/**
 * Manifest Manager reads its instructions and dropdowns from the local authored table.
 */
function SearchView({ authoredConfig }) {
  const [savedFilters, setFilters] = useLocalStorageState(
    LOCAL_STORAGE_KEYS.search,
    () => normalizeSearchFilters({}, authoredConfig).filters,
  );
  const [result, setResult] = useState({ result: [], totalRecords: 0 });
  const [loading, setLoading] = useState(false);
  const { filters, resetFilters } = normalizeSearchFilters(savedFilters, authoredConfig);
  const consentTypes = filters.manifestConsentType ?? ALL_CONSENT_TYPES;

  const updateFilters = (changes) => setFilters((prev) => ({
    ...normalizeSearchFilters(prev, authoredConfig).filters,
    ...changes,
  }));
  const setFilter = (key, value) => {
    updateFilters({ [key]: value, pageNum: 1 });
  };

  useEffect(() => {
    if (authoredConfig.error) return undefined;
    let cancelled = false;
    setLoading(true);
    const body = {
      pageNum: filters.pageNum,
      perPage: filters.perPage,
      ...Object.fromEntries(getSearchMenus(authoredConfig).map(({ key }) => [key, filters[key]])),
      targetSetting: filters.targetSetting,
      manifestSrc: filters.manifestSrc,
      manifestConsentType: consentTypes === ALL_CONSENT_TYPES ? '' : consentTypes,
      manifestCountryRestriction: filters.manifestCountryRestriction,
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

  if (authoredConfig.error) {
    return html`<div class="mmm2-search-view" role="alert">${authoredConfig.error}</div>`;
  }

  return html`
    <div class="mmm2-search-view">
      <${HowToAccordion} title=${authoredConfig.howTo.title} content=${authoredConfig.howTo.html} />
      ${resetFilters.length ? html`<p role="status">Unavailable filter selections were reset: ${resetFilters.join(', ')}.</p>` : null}
      <div class="mmm2-filters">
        <div class="mmm2-filter-fields">
          ${getSearchMenus(authoredConfig).map((group) => html`<${DropdownFilter}
            key=${group.key}
            id=${`mmm2-filter-${group.key === 'lastSeenManifest' ? 'lastseen' : group.key}`}
            label=${group.label}
            options=${menuOptions(group)}
            value=${filters[group.key]}
            onChange=${(v) => setFilter(group.key, v)}
          />`)}
          <${TextFilter}
            id="mmm2-filter-manifestcountryrestriction"
            label="Manifest Country Restriction"
            placeholder="e.g. US, CA"
            value=${filters.manifestCountryRestriction}
            onChange=${(v) => setFilter('manifestCountryRestriction', v)}
          />
        </div>
        <div class="mmm2-filter-checkboxes">
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
          <${CheckboxFilterGroup}
            id="mmm2-filter-manifestconsenttype"
            legend="Manifest Consent Type"
            options=${MANIFEST_CONSENT_TYPE_OPTIONS}
            value=${consentTypes}
            onChange=${(v) => setFilter('manifestConsentType', v)}
          />
        </div>
        <${SearchTextarea}
          id="mmm2-filter-search"
          label="Filter: search for a full or partial page URL (production only), manifest URL, manifest experience name or Target activity name:"
          placeholder=${SEARCH_PLACEHOLDER}
          value=${filters.filterText}
          onChange=${(v) => setFilter('filterText', v)}
        />
      </div>
      ${result.totalRecords > 0 ? html`<${Pagination}
        id="mmm2-pagination-dropdown-top"
        pageNum=${filters.pageNum}
        perPage=${filters.perPage}
        totalRecords=${result.totalRecords}
        loading=${loading}
        onPageChange=${(p) => updateFilters({ pageNum: p })}
        onPerPageChange=${(p) => updateFilters({ perPage: p })}
      />` : null}
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
        onPageChange=${(p) => updateFilters({ pageNum: p })}
        onPerPageChange=${(p) => updateFilters({ perPage: p })}
      />
    </div>
  `;
}

export default SearchView;
