/* eslint-disable no-underscore-dangle */
import { loadScript, loadStyle } from '../../utils/utils.js';

const URL_ENCODED_COMMA = '%2C';

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 5000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

export const loadStrings = async (url) => {
  // TODO: Loc based loading
  if (!url) return {};
  const resp = await fetch(url);
  if (!resp.ok) return {};
  const json = await resp.json();
  const convertToObj = (data) => data.reduce((obj, { key, val }) => {
    obj[key] = val;
    return obj;
  }, {});
  return convertToObj(json.data);
};

export const loadCaasFiles = async () => {
  const version = new URL(document.location.href)?.searchParams?.get('caasver') || 'latest';

  loadStyle(`https://www.adobe.com/special/chimera/${version}/dist/dexter/app.min.css`);
  await loadScript(`https://www.adobe.com/special/chimera/${version}/dist/dexter/react.umd.js`);
  await loadScript(`https://www.adobe.com/special/chimera/${version}/dist/dexter/react.dom.umd.js`);
  await loadScript(`https://www.adobe.com/special/chimera/${version}/dist/dexter/app.min.js`);
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

const buildComplexQuery = (andLogicTags, orLogicTags) => {
  let andQuery = andLogicTags
    .filter((tag) => tag.intraTagLogic !== '' && tag.andTags.length)
    .map((tag) => wrapInParens(tag.andTags.map((val) => `"${val}"`).join(`+${tag.intraTagLogic}+`)))
    .join('+AND+');

  let orQuery = orLogicTags
    .filter((tag) => tag.orTags.length)
    .map((tag) => wrapInParens(tag.orTags.map((val) => `"${val}"`).join('+AND+')))
    .join('+OR+');

  andQuery = andQuery.length ? wrapInParens(andQuery) : '';
  orQuery = orQuery.length ? wrapInParens(orQuery) : '';

  return encodeURIComponent(`${andQuery}${andQuery && orQuery ? '+AND+' : ''}${orQuery}`);
};

const getSortOptions = (state, strs) => {
  const sortVals = {
    featured: 'Featured',
    dateAsc: 'Date: (Oldest to Newest)',
    dateDesc: 'Date: (Newest to Oldest)',
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

const getFilterObj = ({ excludeTags, filterTag, icon, openedOnLoad }, tags) => {
  if (!filterTag?.[0]) return null;
  const tagId = filterTag[0];
  const tag = findTagById(tagId, tags);
  if (!tag) return null;
  const items = Object.values(tag.tags)
    .map((itemTag) => {
      if (excludeTags.includes(itemTag.tagID)) return null;

      return {
        id: itemTag.tagID,
        label: itemTag.title.replace('&amp;', '&'),
      };
    })
    .filter((i) => i !== null)
    .sort(alphaSort);

  const filterObj = {
    id: tagId,
    openedOnLoad: !!openedOnLoad,
    items,
    group: tag.title,
  };

  if (icon) {
    filterObj.icon = icon;
  }

  return filterObj;
};

const getFilterArray = async (state) => {
  if (!state.showFilters || state.filters.length === 0) {
    return [];
  }

  const { tags } = await getTags(state.tagsUrl);
  const filters = state.filters
    .map((filter) => getFilterObj(filter, tags))
    .filter((filter) => filter !== null);
  return filters;
};

export const getConfig = async (state, strs = {}) => {
  const originSelection = Array.isArray(state.source) ? state.source.join(',') : state.source;
  const language = state.language ? state.language.split('/').pop() : 'en';
  const country = state.country ? state.country.split('/').pop() : 'us';
  const featuredCards = state.featuredCards && state.featuredCards.reduce(getContentIdStr, '');
  const excludedCards = state.excludedCards && state.excludedCards.reduce(getContentIdStr, '');
  const targetActivity = state.targetEnabled
    && state.targetActivity ? `/${encodeURIComponent(state.targetActivity)}.json` : '';
  const flatFile = targetActivity ? '&flatFile=false' : '';
  const collectionTags = state.includeTags ? state.includeTags.join(',') : '';
  const excludeContentWithTags = state.excludeTags ? state.excludeTags.join(',') : '';

  const complexQuery = buildComplexQuery(state.andLogicTags, state.orLogicTags);

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
      fallbackEndpoint: '',
      totalCardsToShow: state.totalCardsToShow,
      cardStyle: state.cardStyle,
      showTotalResults: state.showTotalResults,
      i18n: {
        prettyDateIntervalFormat:
          strs.prettyDateIntervalFormat || '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
        totalResultsText: strs.totalResults || '{total} results',
        title: strs.collectionTitle || '',
        onErrorTitle: strs.onErrorTitle || 'Sorry there was a system error.',
        onErrorDescription: strs.onErrorDesc
          || 'Please try reloading the page or try coming back to the page another time.',
      },
      setCardBorders: state.setCardBorders,
      useOverlayLinks: state.useOverlayLinks,
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
    },
    featuredCards: featuredCards.split(URL_ENCODED_COMMA),
    filterPanel: {
      enabled: state.showFilters,
      eventFilter: state.filterEvent,
      type: state.showFilters ? state.filterLocation : 'top',
      showEmptyFilters: state.filtersShowEmpty,
      filters: await getFilterArray(state),
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
    language: 'en',
    country: 'US',
    analytics: {
      trackImpressions: state.analyticsTrackImpression || '',
      collectionIdentifier: state.analyticsCollectionName,
    },
    target: { enabled: state.targetEnabled || '' },
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
  analyticsCollectionName: '',
  analyticsTrackImpression: false,
  andLogicTags: [],
  bookmarkIconSelect: '',
  bookmarkIconUnselect: '',
  cardStyle: 'half-height',
  collectionBtnStyle: 'primary',
  collectionName: '',
  collectionSize: '',
  container: '1200MaxWidth',
  contentTypeTags: [],
  country: 'caas:country/us',
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
  filterLocation: 'left',
  filterLogic: 'or',
  filters: [],
  filtersShowEmpty: false,
  gutter: '4x',
  includeTags: [],
  language: 'caas:language/en',
  layoutType: '4up',
  loadMoreBtnStyle: 'primary',
  onlyShowBookmarkedCards: false,
  orLogicTags: [],
  paginationAnimationStyle: 'paged',
  paginationEnabled: false,
  paginationQuantityShown: false,
  paginationType: 'none',
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
  sortDefault: 'dateDesc',
  sortEnablePopup: false,
  sortEnableRandomSampling: false,
  sortEventSort: false,
  sortFeatured: false,
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
  totalCardsToShow: 10,
  useLightText: false,
  useOverlayLinks: false,
  userInfo: [],
};
