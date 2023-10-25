/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
import {
  getConfig as pageConfigHelper,
  loadScript,
  loadStyle,
  localizeLink,
} from '../../utils/utils.js';
import { fetchWithTimeout } from '../utils/utils.js';
import getUuid from '../../utils/getUuid.js';

const URL_ENCODED_COMMA = '%2C';
export const fgHeaderName = 'X-Adobe-Floodgate';
export const fgHeaderValue = 'pink';

const pageConfig = pageConfigHelper();
const pageLocales = Object.keys(pageConfig.locales || {});
const requestHeaders = [];

export function getPageLocale(currentPath, locales = pageLocales) {
  const possibleLocale = currentPath.split('/')[1];
  if (locales.includes(possibleLocale)) {
    return possibleLocale;
  }
  // defaults to en_US
  return '';
}

export const isValidHtmlUrl = (url) => {
  const regex = /^https:\/\/[^\s]+$/;
  return regex.test(url);
};
export const isValidUuid = (id) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

export const loadStrings = async (
  url,
  pathname = window.location.pathname,
  locales = pageLocales,
) => {
  if (!url) return {};
  try {
    const locale = getPageLocale(pathname, locales);
    const localizedURL = new URL(url);
    if (locale) {
      localizedURL.pathname = `${locale}${localizedURL.pathname}`;
    }
    let resp = await fetch(`${localizedURL}.plain.html`);
    if (!resp.ok) {
      resp = await fetch(`${url}.plain.html`);
    }
    if (!resp.ok) {
      return {};
    }
    const html = await resp.text();
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');
    const nodes = document.querySelectorAll('.string-mappings > div');
    return [...nodes].reduce((ans, parent) => {
      const children = parent.querySelectorAll('div');
      const key = children[0]?.innerText;
      const val = children[1]?.innerHTML;
      if (key) {
        ans[key] = val || '';
      }
      return ans;
    }, {});
  } catch (err) {
    return {};
  }
};

export const decodeCompressedString = async (txt) => {
  if (!window.DecompressionStream) {
    await import('../../deps/compression-streams-pollyfill.js');
  }
  const b64decode = (str) => {
    const binaryStr = window.atob(str);
    const bytes = new Uint8Array(new ArrayBuffer(binaryStr.length));
    binaryStr?.split('')
      .forEach((c, i) => (bytes[i] = c.charCodeAt(0)));
    return bytes;
  };

  const b64toStream = (b64) => new Blob([b64decode(b64)], { type: 'text/plain' }).stream();

  const decompressStream = async (stream) => new Response(
    // eslint-disable-next-line no-undef
    stream.pipeThrough(new DecompressionStream('gzip')),
  );

  const responseToJSON = async (response) => {
    const blob = await response.blob();
    return JSON.parse(await blob.text());
  };

  const stream = b64toStream(txt);
  const resp = await decompressStream(stream);
  return responseToJSON(resp);
};

export const loadCaasFiles = async () => {
  const version = new URL(document.location.href)?.searchParams?.get('caasver') || 'stable';

  loadStyle(`https://www.adobe.com/special/chimera/caas-libs/${version}/app.css`);
  await loadScript(`https://www.adobe.com/special/chimera/caas-libs/${version}/react.umd.js`);
  await loadScript(`https://www.adobe.com/special/chimera/caas-libs/${version}/react.dom.umd.js`);
  await loadScript(`https://www.adobe.com/special/chimera/caas-libs/${version}/main.min.js`);
};

export const loadCaasTags = async (tagsUrl) => {
  let errorMsg = '';
  if (tagsUrl) {
    const url = tagsUrl.startsWith('https://') || tagsUrl.startsWith('http://') ? tagsUrl : `https://${tagsUrl}`;
    try {
      const resp = await fetchWithTimeout(url);
      if (resp.ok) {
        const json = await resp.json();
        return {
          tags: json.namespaces.caas.tags,
          error: '',
        };
      }
    } catch (e) {
      errorMsg = 'Unable to fetch tags, loading backup tags.  Please check tags url in the Advanced Panel';
    }
  } else {
    errorMsg = 'Tags url is not defined in the Advanced Panel';
  }

  const { default: caasTags } = await import('../caas-config/caas-tags.js');
  return {
    tags: caasTags.namespaces.caas.tags,
    errorMsg,
  };
};

const getTags = (() => {
  let tags;
  return (async (tagsUrl) => {
    if (tags) return tags;

    tags = await loadCaasTags(tagsUrl);
    return tags;
  });
})();

const getContentIdStr = (cardStr, card) => {
  if (card.contentId) {
    return cardStr.length ? `${cardStr}%2C${card.contentId}` : card.contentId;
  }
  return cardStr;
};

const wrapInParens = (s) => `(${s})`;

const buildComplexQuery = (andLogicTags, orLogicTags, notLogicTags) => {
  let andQuery = andLogicTags
    .filter((tag) => tag.intraTagLogic !== '' && tag.andTags.length)
    .map((tag) => wrapInParens(tag.andTags.map((val) => `"${val}"`).join(`+${tag.intraTagLogic}+`)))
    .join('+AND+');

  let orQuery = orLogicTags
    .filter((tag) => tag.orTags.length)
    .map((tag) => wrapInParens(tag.orTags.map((val) => `"${val}"`).join('+AND+')))
    .join('+OR+');

  let notQuery = notLogicTags
    .filter((tag) => tag.intraTagLogicExclude !== '' && tag.notTags.length)
    .map((tag) => wrapInParens(tag.notTags.map((val) => `"${val}"`).join(`+${tag.intraTagLogicExclude}+`)))
    .join('+AND+');

  andQuery = andQuery.length ? wrapInParens(andQuery) : '';
  orQuery = orQuery.length ? wrapInParens(orQuery) : '';
  notQuery = notQuery.length ? wrapInParens(notQuery) : '';

  return (andQuery || orQuery)
    ? encodeURIComponent(`${andQuery}${
      andQuery && orQuery ? '+AND+' : ''}${orQuery}${
      (andQuery || orQuery) && notQuery ? '+AND+NOT+' : ''}${notQuery}`)
    : '';
};

const getSortOptions = (state, strs) => {
  const sortVals = {
    featured: 'Featured',
    dateAsc: 'Date: (Oldest to Newest)',
    dateDesc: 'Date: (Newest to Oldest)',
    modifiedDesc: 'Date: (Last Modified, Newest to Oldest)',
    modifiedAsc: 'Date (Last Modified, Oldest to Newest)',
    eventSort: 'Events: (Live, Upcoming, OnDemand)',
    titleAsc: 'Title A-Z',
    titleDesc: 'Title Z-A',
    random: 'Random',
  };

  return Object.entries(sortVals).reduce((options, [key, defaultValue]) => {
    const fullKey = `sort${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (state[fullKey]) {
      options.push({
        label: strs[fullKey] || defaultValue,
        sort: key,
      });
    }
    return options;
  }, []);
};

const findTagById = (id, tags) => {
  let tagObj = Object.values(tags).find((tag) => tag.tagID === id);
  if (tagObj) return tagObj;

  Object.values(tags).some((tag) => {
    tagObj = findTagById(id, tag.tags);
    return tagObj;
  });

  return tagObj;
};

const alphaSort = (a, b) => {
  const itemA = a.label.toUpperCase();
  const itemB = b.label.toUpperCase();
  if (itemA < itemB) return -1;
  if (itemA > itemB) return 1;
  /* c8 ignore next */
  return 0;
};

const getLocalTitle = (tag, country, lang) => tag[`title.${lang}_${country}`]
  || tag[`title.${lang}`]
  || tag.title;

const getFilterObj = (
  { excludeTags, filterTag, icon, openedOnLoad },
  tags,
  state,
  country,
  lang,
) => {
  if (!filterTag?.[0]) return null;
  const tagId = filterTag[0];
  const tag = findTagById(tagId, tags);
  if (!tag) return null;
  const items = Object.values(tag.tags)
    .map((itemTag) => {
      if (excludeTags?.includes(itemTag.tagID)) return null;
      const titleLabel = getLocalTitle(itemTag, country, lang);
      return {
        id: itemTag.tagID,
        label: titleLabel.replace('&amp;', '&'),
      };
    })
    .filter((i) => i !== null)
    .sort(alphaSort);

  const filterObj = {
    id: tagId,
    openedOnLoad: !!openedOnLoad,
    items,
    group: getLocalTitle(tag, country, lang),
  };

  if (icon) {
    filterObj.icon = icon;
  }

  return filterObj;
};

const getCustomFilterObj = ({ group, filtersCustomItems, openedOnLoad }, strs = {}) => {
  if (!group) return null;

  const IN_BRACKETS_RE = /^{.*}$/;

  const items = filtersCustomItems.map((item) => ({
    id: item.customFilterTag[0],
    label: item.filtersCustomLabel?.match(IN_BRACKETS_RE)
      ? strs[item.filtersCustomLabel.replace(/{|}/g, '')]
      : item.filtersCustomLabel || '',
  }));

  const filterObj = {
    id: group,
    openedOnLoad: !!openedOnLoad,
    items,
    group: group?.match(IN_BRACKETS_RE)
      ? strs[group.replace(/{|}/g, '')]
      : group || '',
  };

  return filterObj;
};

const getFilterArray = async (state, country, lang, strs) => {
  if ((!state.showFilters || state.filters.length === 0) && state.filtersCustom?.length === 0) {
    return [];
  }

  const { tags } = await getTags(state.tagsUrl);
  const useCustomFilters = state.filterBuildPanel === 'custom';

  let filters = [];
  if (!useCustomFilters) {
    filters = state.filters
      .map((filter) => getFilterObj(filter, tags, state, country, lang))
      .filter((filter) => filter !== null);
  } else {
    filters = state.filtersCustom.length > 0
      ? state.filtersCustom.map((filter) => getCustomFilterObj(filter, strs))
      : [];
  }

  return filters;
};

export function getCountryAndLang({ autoCountryLang, country, language }) {
  if (autoCountryLang) {
    const locale = pageConfigHelper()?.locale;
    return {
      country: locale.region?.toLowerCase() || 'us',
      language: locale.ietf?.toLowerCase() || 'en-us',
    };
  }
  return {
    country: country ? country.split('/').pop() : 'us',
    language: language ? language.split('/').pop() : 'en',
  };
}

/**
 * Finds the matching tuple and returns its index.
 * Looks for 'X-Adobe-Floodgate' in [['X-Adobe-Floodgate', 'pink'], ['a','b']]
 * @param {*} fgHeader fgHeader
 * @returns tupleIndex
 */
const findTupleIndex = (fgHeader) => {
  const matchingTupleIndex = requestHeaders.findIndex((element) => element[0] === fgHeader);
  return matchingTupleIndex;
};

/**
 * Adds the floodgate header to the Config of ConsonantCardCollection
 * headers: [['X-Adobe-Floodgate', 'pink'], ['OtherHeader', 'Value']]
 * @param {*} state state
 * @returns requestHeaders
 */
const addFloodgateHeader = (state) => {
  // Delete FG header if already exists, before adding pink to avoid duplicates in requestHeaders
  requestHeaders.splice(findTupleIndex(fgHeaderName, 1));
  if (state.fetchCardsFromFloodgateTree) {
    requestHeaders.push([fgHeaderName, fgHeaderValue]);
  }
  return requestHeaders;
};

export function arrayToObj(input = []) {
  const obj = {};
  if (!Array.isArray(input)) {
    // eslint-disable-next-line no-param-reassign
    input = [];
  }
  input.forEach((item) => {
    if (item.key && item.value) {
      obj[item.key] = item.value;
    }
  });
  return obj;
}

const addMissingStateProps = (state) => {
  // eslint-disable-next-line no-use-before-define
  Object.entries(defaultState).forEach(([key, val]) => {
    if (state[key] === undefined) {
      state[key] = val;
    }
  });
  return state;
};

const fetchUuidForCard = async (card) => {
  if (!card.contentId) {
    return null;
  }
  if (isValidUuid(card.contentId)) {
    return card.contentId;
  }
  try {
    const url = new URL(card.contentId);
    const localizedLink = localizeLink(url, window.location.hostname, true);
    const substr = String(localizedLink).split('https://').pop();
    return await getUuid(substr);
  } catch (error) {
    return null;
  }
};

const getCardsString = async (cards = []) => {
  const uuids = await Promise.all(cards.map(async (card) => {
    const uuid = await fetchUuidForCard(card);
    return uuid !== null ? uuid : undefined;
  }));
  return uuids.filter(Boolean).join('%2C');
};

export const getConfig = async (originalState, strs = {}) => {
  const state = addMissingStateProps(originalState);
  const originSelection = Array.isArray(state.source) ? state.source.join(',') : state.source;
  const { country, language } = getCountryAndLang(state);
  const featuredCards = state.featuredCards ? await getCardsString(state.featuredCards) : '';
  const excludedCards = state.excludedCards && state.excludedCards.reduce(getContentIdStr, '');
  const hideCtaIds = state.hideCtaIds ? state.hideCtaIds.reduce(getContentIdStr, '') : '';
  const hideCtaTags = state.hideCtaTags ? state.hideCtaTags : [];
  const targetActivity = state.targetEnabled
  && state.targetActivity ? `/${encodeURIComponent(state.targetActivity)}.json` : '';
  const flatFile = targetActivity ? '&flatFile=false' : '';
  const collectionTags = state.includeTags ? state.includeTags.join(',') : '';
  const excludeContentWithTags = state.excludeTags ? state.excludeTags.join(',') : '';

  const complexQuery = buildComplexQuery(state.andLogicTags, state.orLogicTags, state.notLogicTags);

  const caasRequestHeaders = addFloodgateHeader(state);

  const config = {
    collection: {
      mode: state.theme,
      layout: {
        type: state.layoutType,
        gutter: state.gutter,
        container: state.container,
      },
      button: { style: state.collectionBtnStyle },
      resultsPerPage: state.resultsPerPage,
      endpoint: `https://${
        state.endpoint
      }${targetActivity}?originSelection=${originSelection}&contentTypeTags=${state.contentTypeTags.join(
        ',',
      )}&collectionTags=${collectionTags}&excludeContentWithTags=${excludeContentWithTags}&language=${language}&country=${country}&complexQuery=${complexQuery}&excludeIds=${excludedCards}&currentEntityId=&featuredCards=${featuredCards}&environment=&draft=${
        state.draftDb
      }&size=${state.collectionSize || state.totalCardsToShow}${flatFile}`,
      fallbackEndpoint: state.fallbackEndpoint,
      totalCardsToShow: state.totalCardsToShow,
      cardStyle: state.cardStyle,
      showTotalResults: state.showTotalResults,
      i18n: {
        prettyDateIntervalFormat:
          strs.prettyDateIntervalFormat || '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
        totalResultsText: strs.totalResults || '{total} results',
        title: state.collectionTitle?.match(/^{.*}$/) ? strs[state.collectionTitle.replace(/{|}/g, '')] : state.collectionTitle || '',
        titleHeadingLevel: state.titleHeadingLevel,
        cardTitleAccessibilityLevel: state.cardTitleAccessibilityLevel,
        onErrorTitle: strs.onErrorTitle || 'Sorry there was a system error.',
        onErrorDescription: strs.onErrorDesc
          || 'Please try reloading the page or try coming back to the page another time.',
        lastModified: strs.lastModified || 'Last modified {date}',
      },
      detailsTextOption: state.detailsTextOption,
      setCardBorders: state.setCardBorders,
      useOverlayLinks: state.useOverlayLinks,
      collectionButtonStyle: state.collectionBtnStyle,
      banner: {
        register: {
          description: strs.registrationText || 'Sign Up',
          url: strs.registrationUrl || '#registration',
        },
        upcoming: { description: strs.upComingText || 'Upcoming' },
        live: { description: strs.liveText || 'Live' },
        onDemand: { description: strs.onDemandText || 'On Demand' },
      },
      useLightText: state.useLightText,
      disableBanners: state.disableBanners,
      reservoir: {
        sample: state.sortReservoirSample,
        pool: state.sortReservoirPool,
      },
      ctaAction: state.ctaAction,
      additionalRequestParams: arrayToObj(state.additionalRequestParams),
    },
    hideCtaIds: hideCtaIds.split(URL_ENCODED_COMMA),
    hideCtaTags,
    featuredCards: featuredCards.split(URL_ENCODED_COMMA),
    filterPanel: {
      enabled: state.showFilters,
      eventFilter: state.filterEvent,
      type: state.showFilters ? state.filterLocation : 'left',
      showEmptyFilters: state.filtersShowEmpty,
      filters: await getFilterArray(state, country, language, strs),
      filterLogic: state.filterLogic,
      i18n: {
        leftPanel: {
          header: strs.filterLeftPanel || 'Refine Your Results',
          clearAllFiltersText: strs.filterClearAll || 'Clear All',
          mobile: {
            filtersBtnLabel: strs.filterMobileButton || 'Filters',
            panel: {
              header: strs.filterMobilePanel || 'Filter by',
              totalResultsText: strs.totalResults || '{total} results',
              applyBtnText: strs.filterApply || 'Apply',
              clearFilterText: strs.filterClear || 'Clear',
              doneBtnText: strs.filterDone || 'Done',
            },
            group: {
              totalResultsText: strs.totalResults || '{total} results',
              applyBtnText: strs.filterApply || 'Apply',
              clearFilterText: strs.filterClear || 'Clear',
              doneBtnText: strs.filterDone || 'Done',
            },
          },
        },
        topPanel: {
          groupLabel: strs.filterGroupLabel || 'Filters:',
          clearAllFiltersText: strs.filterClearAll || 'Clear All',
          moreFiltersBtnText: strs.filtermore || 'More Filters +',
          mobile: {
            group: {
              totalResultsText: strs.totalResults || '{total} results',
              applyBtnText: strs.filterApply || 'Apply',
              clearFilterText: strs.filterClear || 'Clear',
              doneBtnText: strs.filterDone || 'Done',
            },
          },
        },
      },
    },
    sort: {
      enabled: state.sortEnablePopup,
      defaultSort: state.sortDefault,
      options: getSortOptions(state, strs),
    },
    pagination: {
      animationStyle: state.paginationAnimationStyle,
      enabled: state.paginationEnabled,
      resultsQuantityShown: state.paginationQuantityShown,
      loadMoreButton: {
        style: state.loadMoreBtnStyle,
        useThemeThree: state.paginationUseTheme3,
      },
      type: state.paginationType,
      i18n: {
        loadMore: {
          btnText: strs.pgLoadMore || 'Load More',
          resultsQuantityText: strs.pgLoadMoreResultsQty || '{start} of {end} displayed',
        },
        paginator: {
          resultsQuantityText: strs.pgResultsQuantity || '{start} - {end} of {total} results',
          prevLabel: strs.pgPrevious || 'Prev',
          nextLabel: strs.pgNext || 'Next',
        },
      },
    },
    bookmarks: {
      showOnCards: state.showBookmarksOnCards,
      leftFilterPanel: {
        bookmarkOnlyCollection: state.onlyShowBookmarkedCards,
        showBookmarksFilter: state.showBookmarksFilter,
        selectBookmarksIcon: state.bookmarkIconSelect,
        unselectBookmarksIcon: state.bookmarkIconUnselect,
      },
      i18n: {
        leftFilterPanel: { filterTitle: strs.bmFilterTitle || 'My favorites' },
        card: {
          saveText: strs.bmSaveCard || 'Save Card',
          unsaveText: strs.bmUnsaveCard || 'Unsave Card',
        },
      },
    },
    search: {
      enabled: state.showSearch,
      searchFields: state.searchFields,
      i18n: {
        noResultsTitle: strs.searchNoResults || 'No Results Found',
        noResultsDescription:
          strs.searchNoResultsDesc || 'Try checking your spelling or broadening your search.',
        leftFilterPanel: {
          searchTitle: strs.searchTitle || 'Search',
          searchPlaceholderText: strs.searchPlaceholder || 'Search Here',
        },
        topFilterPanel: { searchPlaceholderText: strs.searchPlaceholder || 'Search Here' },
        filterInfo: { searchPlaceholderText: strs.searchPlaceholder || 'Search Here' },
      },
    },
    language,
    country,
    analytics: {
      trackImpressions: state.analyticsTrackImpression || '',
      collectionIdentifier: state.analyticsCollectionName,
    },
    target: {
      enabled: state.targetEnabled || '',
      lastViewedSession: state.lastViewedSession || '',
    },
    customCard: ['card', `return \`${state.customCard}\``],
    headers: caasRequestHeaders,
  };
  return config;
};

export const initCaas = async (state, caasStrs, el) => {
  window.dexter = window.dexter || {}; // required for caas modals

  const caasEl = el || document.getElementById('caas');
  if (!caasEl) return;

  const appEl = caasEl.parentElement;
  caasEl.remove();

  const newEl = document.createElement('div');
  newEl.id = 'caas';
  newEl.className = 'caas-preview';
  appEl.append(newEl);

  const config = await getConfig(state, caasStrs);

  // eslint-disable-next-line no-new, no-undef
  new ConsonantCardCollection(config, newEl);
};

export const defaultState = {
  additionalRequestParams: [],
  analyticsCollectionName: '',
  analyticsTrackImpression: false,
  andLogicTags: [],
  autoCountryLang: false,
  fetchCardsFromFloodgateTree: false,
  bookmarkIconSelect: '',
  bookmarkIconUnselect: '',
  cardStyle: 'half-height',
  cardTitleAccessibilityLevel: 6,
  collectionBtnStyle: 'primary',
  collectionName: '',
  collectionTitle: '',
  collectionSize: '',
  container: '1200MaxWidth',
  contentTypeTags: [],
  country: 'caas:country/us',
  customCard: '',
  ctaAction: '_self',
  doNotLazyLoad: false,
  disableBanners: false,
  draftDb: false,
  endpoint: 'www.adobe.com/chimera-api/collection',
  environment: '',
  excludedCards: [],
  excludeTags: [],
  fallbackEndpoint: '',
  featuredCards: [],
  filterEvent: '',
  filterBuildPanel: 'automatic',
  filterLocation: 'left',
  filterLogic: 'or',
  filters: [],
  filtersCustom: [],
  filtersShowEmpty: false,
  gutter: '4x',
  headers: [],
  hideCtaIds: [],
  hideCtaTags: [],
  includeTags: [],
  language: 'caas:language/en',
  layoutType: '4up',
  loadMoreBtnStyle: 'primary',
  notLogicTags: [],
  onlyShowBookmarkedCards: false,
  orLogicTags: [],
  paginationAnimationStyle: 'paged',
  paginationEnabled: false,
  paginationQuantityShown: false,
  paginationType: 'paginator',
  paginationUseTheme3: false,
  placeholderUrl: '',
  resultsPerPage: 5,
  searchFields: [],
  setCardBorders: false,
  showBookmarksFilter: false,
  showBookmarksOnCards: false,
  showFilters: false,
  showSearch: false,
  showTotalResults: false,
  sortDateAsc: false,
  sortDateDesc: false,
  sortDateModified: false,
  sortDefault: 'dateDesc',
  sortEnablePopup: false,
  sortEnableRandomSampling: false,
  sortEventSort: false,
  sortFeatured: false,
  sortModifiedAsc: false,
  sortModifiedDesc: false,
  sortRandom: false,
  sortReservoirPool: 1000,
  sortReservoirSample: 3,
  sortTitleAsc: false,
  sortTitleDesc: false,
  source: ['hawks'],
  tagsUrl: 'www.adobe.com/chimera-api/tags',
  targetActivity: '',
  targetEnabled: false,
  theme: 'lightest',
  detailsTextOption: 'default',
  titleHeadingLevel: 'h3',
  totalCardsToShow: 10,
  useLightText: false,
  useOverlayLinks: false,
  collectionButtonStyle: 'primary',
  userInfo: [],
};
