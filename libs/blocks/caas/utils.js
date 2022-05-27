import { loadScript, loadStyle } from '../../utils/utils.js';

export const loadStrings = async (url) => {
  // TODO: Loc based loading
  if (!url) return {};
  const resp = await fetch(url);
  if (!resp.ok) return {};
  const json = await resp.json();
  const convertToObj = (data) =>
    data.reduce((obj, { key, val }) => {
      obj[key] = val;
      return obj;
    }, {});
  return convertToObj(json.data);
};

export const loadCaasFiles = () => {
  loadStyle('https://www.adobe.com/special/chimera/latest/dist/dexter/app.min.css');
  return Promise.all([
    loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/react.umd.js'),
    loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/react.dom.umd.js'),
  ]).then(() => loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/app.min.js'));
};

export const initCaas = (state, caasStrs, el) => {
  const caasEl = el || document.getElementById('caas');
  if (!caasEl) return;

  const appEl = caasEl.parentElement;
  caasEl.remove();

  const newEl = document.createElement('div');
  newEl.id = 'caas';
  newEl.className = 'caas-preview';
  appEl.append(newEl);

  new ConsonantCardCollection(getConfig(state, caasStrs), newEl);
};

const getContentIdStr = (cardStr, card) => {
  if (card.contentId) {
    cardStr = cardStr.length ? `${cardStr}%2C${card.contentId}` : card.contentId;
  }
  return cardStr;
};

const wrapInParens = (s) => `(${s})`;

const buildComplexQuery = (andLogicTags, orLogicTags) => {
  let andQuery = andLogicTags
    .filter((tag) => tag.intraTagLogic !== '')
    .map((tag) => wrapInParens(tag.andTags.map((val) => `"${val}"`).join(`+${tag.intraTagLogic}+`)))
    .join('+AND+');

  let orQuery = orLogicTags
    .filter((tag) => tag.orTags.length > 0)
    .map((tag) => wrapInParens(tag.orTags.map((val) => `"${val}"`).join('+OR+')))
    .join('+OR+');

  andQuery = andQuery.length ? wrapInParens(andQuery) : '';
  orQuery = orQuery.length ? wrapInParens(orQuery) : '';

  return `${andQuery}${andQuery && orQuery ? '+AND+' : ''}${orQuery}`;
};

export const getConfig = (state, strs = []) => {
  const originSelection = Array.isArray(state.source) ? state.source.join(',') : state.source;
  const language = state.language ? state.language.split('/').at(-1) : 'en';
  const country = state.country ? state.country.split('/').at(-1) : 'us';
  const featuredCards = state.featuredCards && state.featuredCards.reduce(getContentIdStr, '');
  const excludedCards = state.excludeCards && state.excludeCards.reduce(getContentIdStr, '');
  const targetActivity =
    state.targetEnabled && state.targetActivity ? `/${state.targetActivity}.json` : '';
  const flatFile = state.targetActivity ? '&flatFile=false' : '';

  const complexQuery = buildComplexQuery(state.andLogicTags, state.orLogicTags);

  const sortOptions = Object.entries(strs).reduce((opts, [key, val]) => {
    const parse = (keyType, propName) => {
      if (key.startsWith(keyType)) {
        const idx = parseInt(key.replace(keyType, ''), 10);
        if (idx !== NaN) {
          opts[idx - 1] = opts[idx - 1] || {};
          opts[idx - 1][propName] = val;
        }
      }
    };
    parse('sortLabel', 'label');
    parse('sortType', 'sort');
    return opts;
  }, []);

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
        ','
      )}&collectionTags=&excludeContentWithTags=caas%3Aevents&language=${language}&country=${country}&complexQuery=${complexQuery}&excludeIds=${excludedCards}&currentEntityId=55214dea-5481-3515-a4b9-dbf51c378e62&featuredCards=${featuredCards}&environment=&draft=${
        state.draftDb
      }&size=2000${flatFile}`,
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
        onErrorDescription:
          strs.onErrorDesc ||
          'Please try reloading the page or try coming back to the page another time.',
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
    filterPanel: {
      enabled: state.showFilters,
      eventFilter: 'not-timed',
      type: 'left',
      showEmptyFilters: 'true',
      filters: [],
      filterLogic: 'or',
      i18n: {
        leftPanel: {
          header: strs.filterLeftPanel || 'Refine Your Results',
          clearAllFiltersText: strs.filterClearAll || 'Clear All',
          mobile: {
            filtersBtnLabel: strs.filterMobileButton || 'Filters',
            panel: {
              header: strs.filterMobilePanel || 'Filter by',
              totalResultsText: '{total} results',
              applyBtnText: strs.filterApply || 'Apply',
              clearFilterText: strs.filterClear || 'Clear',
              doneBtnText: strs.filterDone || 'Done',
            },
            group: {
              totalResultsText: '{total} results',
              applyBtnText: strs.filterApply || 'Apply',
              clearFilterText: strs.filterClear || 'Clear',
              doneBtnText: strs.filterDone || 'Done',
            },
          },
        },
        topPanel: {
          groupLabel: 'Filters:',
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
      options: sortOptions,
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

export const defaultState = {
  analyticsTrackImpression: false,
  analyticsCollectionName: '',
  andLogicTags: [],
  bookmarkIconSelect: '',
  bookmarkIconUnselect: '',
  cardStyle: 'half-height',
  collectionBtnStyle: 'primary',
  container: '1200MaxWidth',
  country: 'caas:country/us',
  contentTypeTags: [],
  disableBanners: false,
  draftDb: false,
  environment: '',
  endpoint: 'www.adobe.com/chimera-api/collection',
  excludedCards: [],
  fallbackEndpoint: '',
  featuredCards: [],
  gutter: '4x',
  language: 'caas:language/en',
  layoutType: '4up',
  loadMoreBtnStyle: 'primary',
  onlyShowBookmarkedCards: false,
  orLogicTags: [],
  paginationAnimationStyle: 'paged',
  paginationEnabled: false,
  paginationQuantityShown: false,
  paginationUseTheme3: false,
  paginationType: 'none',
  resultsPerPage: 5,
  searchFields: [],
  setCardBorders: false,
  showBookmarksFilter: false,
  showBookmarksOnCards: false,
  showFilters: false,
  showSearch: false,
  showTotalResults: false,
  sortDefault: 'dateDesc',
  sortEnablePopup: false,
  sortEnableRandomSampling: false,
  sortReservoirSample: 3,
  sortReservoirPool: 1000,
  source: ['hawks'],
  targetActivity: '',
  targetEnabled: false,
  theme: 'lightest',
  totalCardsToShow: 10,
  useLightText: false,
  useOverlayLinks: false,
  userInfo: [],
};
