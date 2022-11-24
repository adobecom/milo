import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { defaultState, getConfig, loadStrings } from '../../../libs/blocks/caas/utils.js';

const strings = {
  collectionTitle: 'My Awesome Title',
  onErrorDesc: 'Error Desc',
  onErrorTitle: 'Error Loading Title',
  prettyDateIntervalFormat: '',
  totalResults: '{total} Results',
  sortLabel1: 'Featured Sort',
  sortLabel2: 'Most recent',
  sortLabel3: 'Title',
  sortType1: 'featured',
  sortType2: 'dateDesc',
  sortType3: 'titleAsc',
};

describe('loadStrings', () => {
  const ogFetch = window.fetch;

  beforeEach(() => {
    window.fetch = stub().returns(
      new Promise((resolve) => {
        resolve({
          ok: true,
          json: () => ({
            data: [
              {
                key: 'collectionTitle',
                val: 'My Awesome Title',
              },
              {
                key: 'onErrorTitle',
                val: 'Error Loading Title',
              },
              {
                key: 'onErrorDesc',
                val: 'Error Desc',
              },
              {
                key: 'prettyDateIntervalFormat',
                val: '',
              },
              {
                key: 'totalResults',
                val: '{total} Results',
              },
              {
                key: 'sortLabel1',
                val: 'Featured Sort',
              },
              {
                key: 'sortType1',
                val: 'featured',
              },
              {
                key: 'sortLabel2',
                val: 'Most recent',
              },
              {
                key: 'sortType2',
                val: 'dateDesc',
              },
              {
                key: 'sortLabel3',
                val: 'Title',
              },
              {
                key: 'sortType3',
                val: 'titleAsc',
              },
            ],
          }),
        });
      }),
    );
  });

  afterEach(() => {
    window.fetch = ogFetch;
  });

  it('should fetch data from the given url', async () => {
    const loadedStrings = await loadStrings('http://my.test.url');
    expect(loadedStrings).to.eql(strings);
  });
});

describe('getConfig', () => {
  const state = defaultState;

  state.featuredCards = [{ contentId: 'a' }, { contentId: 'b' }];
  state.andLogicTags = [
    { intraTagLogic: 'AND', andTags: ['caas:products/indesign', 'caas:products/reader'] },
    { intraTagLogic: 'OR', andTags: ['caas:country/br', 'caas:country/ca'] },
  ];
  state.orLogicTags = [{ orTags: ['caas:content-type/video', 'caas:content-type/blog'] }];
  state.targetEnabled = true;
  state.targetActivity = 'myTargetActivity';
  state.tagsUrl = '';
  state.showFilters = true;
  state.filters = [
    {
      filterTag: [
        'caas:business-unit/creative-cloud',
      ],
      openedOnLoad: true,
      icon: '',
      excludeTags: [],
    },
    {
      filterTag: [
        'caas:product-categories',
      ],
      openedOnLoad: '',
      icon: '/path/to/icon.svg',
      excludeTags: [
        'caas:product-categories/video',
      ],
    },
  ];

  it('should return a caas config object', async () => {
    const config = await getConfig(state, strings);
    expect(config).to.be.eql({
      collection: {
        mode: 'lightest',
        layout: { type: '4up', gutter: '4x', container: '1200MaxWidth' },
        button: { style: 'primary' },
        resultsPerPage: 5,
        endpoint:
          'https://www.adobe.com/chimera-api/collection/myTargetActivity.json?originSelection=hawks&contentTypeTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=((%22caas%3Aproducts%2Findesign%22%2BAND%2B%22caas%3Aproducts%2Freader%22)%2BAND%2B(%22caas%3Acountry%2Fbr%22%2BOR%2B%22caas%3Acountry%2Fca%22))%2BAND%2B((%22caas%3Acontent-type%2Fvideo%22%2BAND%2B%22caas%3Acontent-type%2Fblog%22))&excludeIds=&currentEntityId=&featuredCards=a%2Cb&environment=&draft=false&size=10&flatFile=false',
        fallbackEndpoint: '',
        totalCardsToShow: 10,
        cardStyle: 'half-height',
        showTotalResults: false,
        i18n: {
          prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
          totalResultsText: '{total} Results',
          title: 'My Awesome Title',
          onErrorTitle: 'Error Loading Title',
          onErrorDescription: 'Error Desc',
        },
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
      },
      featuredCards: ['a', 'b'],
      filterPanel: {
        enabled: true,
        eventFilter: '',
        type: 'left',
        showEmptyFilters: false,
        filters: [
          {
            group: 'Creative Cloud',
            id: 'caas:business-unit/creative-cloud',
            items: [],
            openedOnLoad: true,
          },
          {
            group: 'Product Categories',
            icon: '/path/to/icon.svg',
            id: 'caas:product-categories',
            items: [
              {
                id: 'caas:product-categories/3d-and-ar',
                label: '3D and AR',
              },
              {
                id: 'caas:product-categories/acrobat-and-pdf',
                label: 'Acrobat and PDF',
              },
              {
                id: 'caas:product-categories/graphic-design',
                label: 'Graphic Design',
              },
              {
                id: 'caas:product-categories/illustration',
                label: 'Illustration',
              },
              {
                id: 'caas:product-categories/photo',
                label: 'Photo',
              },
              {
                id: 'caas:product-categories/social-media',
                label: 'Social Media',
              },
              {
                id: 'caas:product-categories/ui-and-ux',
                label: 'UI and UX',
              },
            ],
            openedOnLoad: false,
          },
        ],
        filterLogic: 'or',
        i18n: {
          leftPanel: {
            header: 'Refine Your Results',
            clearAllFiltersText: 'Clear All',
            mobile: {
              filtersBtnLabel: 'Filters',
              panel: {
                header: 'Filter by',
                totalResultsText: '{total} Results',
                applyBtnText: 'Apply',
                clearFilterText: 'Clear',
                doneBtnText: 'Done',
              },
              group: {
                totalResultsText: '{total} Results',
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
                totalResultsText: '{total} Results',
                applyBtnText: 'Apply',
                clearFilterText: 'Clear',
                doneBtnText: 'Done',
              },
            },
          },
        },
      },
      sort: {
        enabled: false,
        defaultSort: 'dateDesc',
        options: [],
      },
      pagination: {
        animationStyle: 'paged',
        enabled: false,
        resultsQuantityShown: false,
        loadMoreButton: { style: 'primary', useThemeThree: false },
        type: 'none',
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
      country: 'US',
      analytics: { trackImpressions: '', collectionIdentifier: '' },
      target: { enabled: true },
    });
  });
});
