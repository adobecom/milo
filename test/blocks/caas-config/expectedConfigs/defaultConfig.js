const defaultConfig = {
  collection: {
    mode: 'lightest',
    layout: { type: '4up', gutter: '4x', container: '1200MaxWidth' },
    button: { style: 'primary' },
    collectionButtonStyle: 'primary',
    resultsPerPage: 5,
    endpoint:
      'https://www.adobe.com/chimera-api/collection?originSelection=hawks&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=&excludeIds=&currentEntityId=&featuredCards=&environment=&draft=false&size=10',
    fallbackEndpoint: '',
    totalCardsToShow: 10,
    cardStyle: 'half-height',
    showTotalResults: false,
    i18n: {
      cardTitleAccessibilityLevel: 6,
      lastModified: 'Last modified {date}',
      prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
      totalResultsText: '{total} results',
      title: '',
      onErrorTitle: 'Sorry there was a system error.',
      onErrorDescription:
        'Please try reloading the page or try coming back to the page another time.',
      titleHeadingLevel: 'h3',
    },
    detailsTextOption: 'default',
    setCardBorders: false,
    useOverlayLinks: false,
    banner: {
      register: { description: 'Sign Up', url: '#registration' },
      upcoming: { description: 'Upcoming' },
      live: { description: 'Live' },
      onDemand: { description: 'On Demand' },
    },
    useLightText: false,
    disableBanners: false,
    reservoir: { sample: 3, pool: 1000 },
    ctaAction: '_self',
    additionalRequestParams: {},
  },
  headers: [],
  hideCtaIds: [
    '',
  ],
  hideCtaTags: [],
  featuredCards: [
    '',
  ],
  filterPanel: {
    enabled: false,
    eventFilter: '',
    type: 'left',
    showEmptyFilters: false,
    filters: [],
    filterLogic: 'or',
    i18n: {
      leftPanel: {
        header: 'Refine Your Results',
        clearAllFiltersText: 'Clear All',
        mobile: {
          filtersBtnLabel: 'Filters',
          panel: {
            header: 'Filter by',
            totalResultsText: '{total} results',
            applyBtnText: 'Apply',
            clearFilterText: 'Clear',
            doneBtnText: 'Done',
          },
          group: {
            totalResultsText: '{total} results',
            applyBtnText: 'Apply',
            clearFilterText: 'Clear',
            doneBtnText: 'Done',
          },
        },
      },
      topPanel: {
        groupLabel: 'Filters:',
        clearAllFiltersText: 'Clear All',
        moreFiltersBtnText: 'More Filters +',
        mobile: {
          group: {
            totalResultsText: '{total} results',
            applyBtnText: 'Apply',
            clearFilterText: 'Clear',
            doneBtnText: 'Done',
          },
        },
      },
    },
  },
  sort: { enabled: false, defaultSort: 'dateDesc', options: [] },
  pagination: {
    animationStyle: 'paged',
    enabled: false,
    resultsQuantityShown: false,
    loadMoreButton: { style: 'primary', useThemeThree: false },
    type: 'paginator',
    i18n: {
      loadMore: { btnText: 'Load More', resultsQuantityText: '{start} of {end} displayed' },
      paginator: {
        resultsQuantityText: '{start} - {end} of {total} results',
        prevLabel: 'Prev',
        nextLabel: 'Next',
      },
    },
  },
  bookmarks: {
    showOnCards: false,
    leftFilterPanel: {
      bookmarkOnlyCollection: false,
      showBookmarksFilter: false,
      selectBookmarksIcon: '',
      unselectBookmarksIcon: '',
    },
    i18n: {
      leftFilterPanel: { filterTitle: 'My favorites' },
      card: { saveText: 'Save Card', unsaveText: 'Unsave Card' },
    },
  },
  search: {
    enabled: false,
    searchFields: [],
    i18n: {
      noResultsTitle: 'No Results Found',
      noResultsDescription: 'Try checking your spelling or broadening your search.',
      leftFilterPanel: { searchTitle: 'Search', searchPlaceholderText: 'Search Here' },
      topFilterPanel: { searchPlaceholderText: 'Search Here' },
      filterInfo: { searchPlaceholderText: 'Search Here' },
    },
  },
  language: 'en',
  country: 'us',
  analytics: { trackImpressions: '', collectionIdentifier: '' },
  target: {
    enabled: '',
    lastViewedSession: '',
  },
  customCard: ['card', 'return ``'],
};

export default defaultConfig;
