const defaultState = {
  analyticsCollectionName: '',
  analyticsTrackImpression: false,
  andLogicTags: [],
  bookmarkIconSelect: '',
  bookmarkIconUnselect: '',
  cardStyle: 'half-height',
  collectionBtnStyle: 'primary',
  collectionSize: '',
  container: '1200MaxWidth',
  contentTypeTags: [],
  country: 'caas:country/us',
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

const utf8ToB64 = (str) => window.btoa(unescape(encodeURIComponent(str)));

const getSortOptions = (config) => {
  const sortOptions = config.sort.options;
  if (!sortOptions) return {};
  const options = {};
  const strings = {};

  sortOptions.forEach(({ label, sort }) => {
    if (label && sort) {
      const key = `sort${sort.charAt(0).toUpperCase() + sort.slice(1)}`;
      options[key] = true;
      strings[key] = label;
    }
  });

  return [options, strings];
};

const parseAndQuery = (str) => {
  if (!str) return [];
  const andStr = str.replace('((', '').replace('))', '');
  return andStr.split(') AND (')
    .map((q) => {
      const intraTagLogic = q.includes(' AND ')
        ? 'AND'
        : 'OR';
      return {
        intraTagLogic,
        andTags: q.split(` ${intraTagLogic} `)
      };
    });
};

const parseOrQuery = (str) => {
  if (!str) return [];
  const orStr = str.replace('((', '').replace('))', '');
  return orStr.split(') OR (')
    // OR queries only have AND tags in each group
    .map((q) => ({ orTags: q.split(' AND ') }));
};

const parseComplexQuery = (query) => {
  let queryStr = query.replaceAll('+', ' ').replaceAll('"', '');
  let andQueryStr;
  let orQueryStr;

  const hasBothAndOr = queryStr.includes(')) AND ((');
  if (hasBothAndOr) {
    ([andQueryStr, orQueryStr] = queryStr.split(')) AND (('));
    let andLogicTags = parseAndQuery(`${andQueryStr}))`);

    if (!orQueryStr.includes(' AND ')) {
      // handle AEM bug
      orQueryStr = orQueryStr.replaceAll(') OR (', ' OR ');
      andLogicTags = [...andLogicTags, ...parseAndQuery(orQueryStr)];
      orQueryStr = '';
    }

    return {
      andLogicTags,
      orLogicTags: parseOrQuery(orQueryStr && `((${orQueryStr}`),
    };
  }
  if (queryStr.includes(') OR (') && queryStr.includes(' AND ')) {
    return {
      andLogicTags: [],
      orLogicTags: parseOrQuery(queryStr),
    };
  }
  // handle aem bug with OR query
  // OR querys should always have an AND:
  // ((tag1 AND tag2 AND tag3) OR (tag4 AND tag5 AND tag6))
  if (!queryStr.includes(' AND ')) {
    queryStr = queryStr.replaceAll(') OR (', ' OR ');
  }

  return {
    andLogicTags: parseAndQuery(queryStr),
    orLogicTags: [],
  };
};

const parseEndpoint = (endpoint) => {
  const url = new URL(endpoint);
  if (!url) return {};

  let epParams = {};
  if (url.pathname.endsWith('.json')) {
    const splitPath = url.pathname.split('/');
    epParams.targetActivity = splitPath.pop();
    epParams.endpoint = `${url.host}${splitPath.join('/')}`;
  } else {
    epParams.endpoint = `${url.host}${url.pathname}`;
  }

  const paramMap = {
    originSelection: (s) => ({ source: s.split(',').map((src) => src.toLowerCase()) }),
    contentTypeTags: (s) => ({ contentTypeTags: s.split(',') }),
    collectionTags: (s) => ({ includeTags: s.split(',') }),
    excludeContentWithTags: (s) => ({ excludeTags: s.split(',') }),
    language: (s) => ({ language: `caas:language/${s}` }),
    country: (s) => ({ country: `caas:country/${s}` }),
    complexQuery: (s) => parseComplexQuery(s),
    featuredCards: (s) => ({ featuredCards: s.split(',').map((id) => ({ contentId: id })) }),
    excludeIds: (s) => ({ excludedCards: s.split(',').map((id) => ({ contentId: id })) }),
    draft: (s) => ({ draftDb: s === 'true' }),
    size: (s) => ({ collectionSize: parseInt(s, 10) }),
  };

  [...url.searchParams.entries()].forEach(([key, val]) => {
    if (paramMap[key]) {
      epParams = { ...epParams, ...paramMap[key](val) };
    }
  });

  return epParams;
};

const convertFilters = (filters) => filters.map((filter) => ({
  excludeTags: [],
  filterTag: [filter.id],
  icon: filter.icon,
  openedOnLoad: filter.openedOnLoad,
}));

const getState = (c) => {
  const state = {
    analyticsTrackImpression: c.analytics.trackImpressions,
    analyticsCollectionName: c.analytics.collectionIdentifier,
    andLogicTags: [],
    bookmarkIconSelect: c.bookmarks.leftFilterPanel.selectBookmarksIcon,
    bookmarkIconUnselect: c.bookmarks.leftFilterPanel.unselectBookmarksIcon,
    cardStyle: c.collection.cardStyle,
    collectionBtnStyle: c.collection.button.style,
    collectionSize: '',
    container: c.collection.layout.container,
    country: 'caas:country/us',
    contentTypeTags: [],
    disableBanners: c.collection.disableBanners,
    draftDb: false,
    environment: '',
    excludeTags: [],
    excludedCards: [],
    fallbackEndpoint: '',
    featuredCards: [],
    filterEvent: c.filterPanel.eventFilter,
    filterLocation: c.filterPanel.type,
    filterLogic: c.filterPanel.filterLogic,
    filters: convertFilters(c.filterPanel.filters),
    filtersShowEmpty: c.filterPanel.showEmptyFilters,
    gutter: c.collection.layout.gutter,
    includeTags: [],
    language: 'caas:language/en',
    layoutType: c.collection.layout.type,
    loadMoreBtnStyle: c.pagination.loadMoreButton.style,
    onlyShowBookmarkedCards: c.bookmarks.leftFilterPanel.bookmarkOnlyCollection,
    orLogicTags: [],
    paginationAnimationStyle: c.pagination.animationStyle,
    paginationEnabled: c.pagination.enabled,
    paginationQuantityShown: c.pagination.resultsQuantityShown,
    paginationUseTheme3: c.pagination.loadMoreButton.useThemeThree,
    paginationType: c.pagination.type,
    placeholderUrl: '',
    resultsPerPage: c.collection.resultsPerPage,
    searchFields: c.search.searchFields,
    setCardBorders: c.collection.setCardBorders,
    showBookmarksFilter: c.bookmarks.leftFilterPanel.showBookmarksFilter,
    showBookmarksOnCards: c.bookmarks.showOnCards,
    showFilters: c.filterPanel.enabled,
    showSearch: c.search.enabled,
    showTotalResults: c.collection.showTotalResults,
    sortDefault: c.sort.defaultSort,
    sortEnablePopup: c.sort.enabled,
    sortEnableRandomSampling: false,
    sortReservoirSample: c.collection.reservoir.sample,
    sortReservoirPool: c.collection.reservoir.pool,
    source: ['hawks'],
    tagsUrl: 'www.adobe.com/chimera-api/tags',
    targetActivity: '',
    targetEnabled: c.target.enabled,
    theme: c.collection.mode,
    totalCardsToShow: c.collection.totalCardsToShow,
    useLightText: c.collection.useLightText,
    useOverlayLinks: c.collection.useOverlayLinks,
    userInfo: [],
  };

  // fill any missing params with default values
  Object.keys(state).forEach((key) => {
    if (state[key] === undefined) {
      state[key] = defaultState[key];
    }
  });

  return state;
};

// NOTE: Some strings are defined multiple times for different areas
// e.g: totalResults
// CaaS currently doesn't support setting multiple different values for
// those different areas
const getStrings = (c) => ({
  prettyDateIntervalFormat: c.collection.i18n.prettyDateIntervalFormat,
  totalResults: c.collection.i18n.totalResultsText,
  collectionTitle: c.collection.i18n.title,
  onErrorTitle: c.collection.i18n.onErrorTitle,
  onErrorDescription: c.collection.onErrorDesc,
  registrationText: c.collection.banner.register.description,
  registrationUrl: c.collection.banner.register.url,
  upComingText: c.collection.banner.upcoming.description,
  liveText: c.collection.banner.live.description,
  onDemandText: c.collection.banner.onDemand.description,
  filterLeftPanel: c.filterPanel.i18n.leftPanel.header,
  filterClearAll: c.filterPanel.i18n.leftPanel.clearAllFiltersText,
  filterMobileButton: c.filterPanel.i18n.leftPanel.mobile.filtersBtnLabel,
  filterMobilePanel: c.filterPanel.i18n.leftPanel.mobile.panel.header,
  // totalResults: c.filterPanel.i18n.leftPanel.mobile.panel.totalResultsText,
  filterApply: c.filterPanel.i18n.leftPanel.mobile.panel.applyBtnText,
  filterClear: c.filterPanel.i18n.leftPanel.mobile.panel.clearFilterText,
  filterDone: c.filterPanel.i18n.leftPanel.mobile.panel.doneBtnText,
  // totalResults: c.filterPanel.i18n.leftPanel.mobile.group.totalResultsText,
  // filterApply: c.filterPanel.i18n.leftPanel.mobile.group.applyBtnText,
  // filterClear: c.filterPanel.i18n.leftPanel.mobile.group.clearFilterText,
  // filterDone: c.filterPanel.i18n.leftPanel.mobile.group.doneBtnText,
  // filterGroupLabel: c.filterPanel.i18n.topPanel.groupLabel,
  // filterClearAll: c.filterPanel.i18n.topPanel.clearAllFiltersText,
  // filterClearAll: c.filterPanel.i18n.topPanel.clearAllFiltersText,
  // filtermore: c.filterPanel.i18n.topPanel.moreFiltersBtnText,
  // totalResults: c.filterPanel.i18n.topPanel.mobile.group.totalResultsText,
  // filterApply: c.filterPanel.i18n.topPanel.mobile.group.applyBtnText,
  // filterClear: c.filterPanel.i18n.topPanel.mobile.group.clearFilterText,
  // filterDone: c.filterPanel.i18n.topPanel.mobile.group.doneBtnText,
  pgLoadMore: c.pagination.i18n.loadMore.btnText,
  pgLoadMoreResultsQty: c.pagination.i18n.loadMore.resultsQuantityText,
  pgResultsQuantity: c.pagination.i18n.paginator.resultsQuantityText,
  pgPrevious: c.pagination.i18n.paginator.prevLabel,
  pgNext: c.pagination.i18n.paginator.nextLabel,
  bmFilterTitle: c.bookmarks.i18n.leftFilterPanel.filterTitle,
  bmSaveCard: c.bookmarks.i18n.card.saveText,
  bmUnsaveCard: c.bookmarks.i18n.card.unsaveText,
  searchNoResults: c.search.i18n.noResultsTitle,
  searchNoResultsDesc: c.search.i18n.noResultsDescription,
  searchTitle: c.search.i18n.leftFilterPanel.searchTitle,
  searchPlaceholder: c.search.i18n.leftFilterPanel.searchPlaceholderText,
});

const parseCaasConfig = (conf) => {
  const config = typeof conf === 'string' ? JSON.parse(conf) : conf;
  const endpointInfo = parseEndpoint(config.collection.endpoint);
  const state = getState(config);
  const strings = getStrings(config);
  const [sortOptions, sortStrings] = getSortOptions(config);
  return {
    configState: { ...state, ...sortOptions, ...endpointInfo },
    configStrings: { ...strings, ...sortStrings },
  };
};

const convertToCsv = (obj) => {
  const arr = Object.entries(obj)
    .map(([key, val]) => (`"${key}","${val?.replaceAll('"', '""')}"`));
  arr.unshift('"key","val"');
  return arr.join('\n');
};

const { getCaasConfigHash, getStringCsv } = (() => {
  let data;
  const getData = (configStr) => {
    if (!data) {
      data = parseCaasConfig(configStr);
    }
    return data;
  };

  return {
    getCaasConfigHash: (conf) => {
      const state = getData(conf);
      const configStr = JSON.stringify(state.configState);
      const link = 'https://milo.adobe.com/tools/caas#';
      if (typeof window !== 'undefined' && window.btoa) {
        return `${link}${utf8ToB64(configStr)}`;
      }
      // for node
      return `${link}${Buffer.from(configStr).toString('base64')}`;
    },
    getStringCsv: (conf) => {
      const state = getData(conf);
      return convertToCsv(state.configStrings);
    },
  };
})();

export { getCaasConfigHash, getStringCsv };
