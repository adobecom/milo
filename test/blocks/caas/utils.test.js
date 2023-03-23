import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { defaultState, getConfig, loadStrings, arrayToObj, getPageLocale } from '../../../libs/blocks/caas/utils.js';

const mockLocales = ['ar', 'br', 'ca', 'ca_fr', 'cl', 'co', 'la', 'mx', 'pe', '', 'africa', 'be_fr', 'be_en', 'be_nl',
  'cy_en', 'dk', 'de', 'ee', 'es', 'fr', 'gr_en', 'ie', 'il_en', 'it', 'lv', 'lt', 'lu_de', 'lu_en', 'lu_fr', 'hu',
  'mt', 'mena_en', 'nl', 'no', 'pl', 'pt', 'ro', 'sa_en', 'ch_de', 'si', 'sk', 'ch_fr', 'fi', 'se', 'ch_it', 'tr',
  'ae_en', 'uk', 'at', 'cz', 'bg', 'ru', 'ua', 'il_he', 'ae_ar', 'mena_ar', 'sa_ar', 'au', 'hk_en', 'in', 'id_id',
  'id_en', 'my_ms', 'my_en', 'nz', 'ph_en', 'ph_fil', 'sg', 'th_en', 'in_hi', 'th_th', 'cn', 'hk_zh', 'tw', 'jp', 'kr',
  'langstore'];

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

function fileNotFoundResponse(){
  return new Promise(function(resolve, reject){
    resolve({
      ok: false,
      statusCode: 404,
      text: () => {}
    });
  })
}

function htmlResponse(){
  return new Promise(function(resolve){
    resolve({
      ok: true,
      text: () => {
        let fetchCalledWith = fetch.args[0].toString();
        let fetchLocale = fetchCalledWith.split('/')[3];
        return `
            <div class="string-mappings">
              <div>
                <div>collectionTitle</div>
                <div>${mockLocales.includes(fetchLocale) ? fetchLocale : ''} collection title</div>
                <div>Card Collection Title</div>
                <div></div>
                <div></div>
              </div>
            </div>`
      },
    });
  })
}

describe('additionalQueryParams', () => {
  expect(arrayToObj([{key: 'a', value: 1}, {key: 'b', value: 2}])).to.be.eql({a: 1, b: 2})
  expect(arrayToObj({})).to.be.eql({});
})
describe('loadStrings', () => {
  const ogFetch = window.fetch;

  beforeEach(() => {
    window.fetch = stub().returns(htmlResponse());
  });

  afterEach(() => {
    window.fetch = ogFetch;
  });

  it('should fetch mappings for en_US', async () => {
    const pathname = '/tools/caas';
    const loadedStrings = await loadStrings('https://milo.adobe.com/drafts/caas/mappings', pathname, mockLocales);
    let expected = {
      collectionTitle: ' collection title',
    };
    expect(loadedStrings).to.eql(expected);
  });

  it('should be able to get correct page locale for en_US', () => {
    let locale = getPageLocale('/tools/caas', mockLocales);
    expect(locale).to.eql('');
  });

  for(let locale of mockLocales){
    it('should be able to fetch mappings all other mockLocales ', async () => {
      let expected = {
        collectionTitle: `${locale} collection title`
      };
      const pathname = `/${locale}/tools/caas`;
      const loadedStrings = await loadStrings(`https://milo.adobe.com/drafts/caas/mappings`, pathname, mockLocales);
      expect(loadedStrings).to.eql(expected);
    });
  }

  for(let locale of mockLocales) {
    it('should be able to get correct page locale', () => {
      let pageLocale = getPageLocale(`/${locale}/tools/caas`, mockLocales);
      expect(locale).to.eql(pageLocale);
    });
  }

  it('should be able to handle multiple 404s', async () => {
    const pathname = `/fr/tools/caas`;
    window.fetch = stub().returns(fileNotFoundResponse());
    const loadedStrings = await loadStrings(`https://milo.adobe.com/drafts/caas/mappings`, pathname, mockLocales);
    expect(loadedStrings).to.eql({});
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
        collectionButtonStyle: 'primary',
        resultsPerPage: 5,
        endpoint:
          'https://www.adobe.com/chimera-api/collection/myTargetActivity.json?originSelection=hawks&contentTypeTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=((%22caas%3Aproducts%2Findesign%22%2BAND%2B%22caas%3Aproducts%2Freader%22)%2BAND%2B(%22caas%3Acountry%2Fbr%22%2BOR%2B%22caas%3Acountry%2Fca%22))%2BAND%2B((%22caas%3Acontent-type%2Fvideo%22%2BAND%2B%22caas%3Acontent-type%2Fblog%22))&excludeIds=&currentEntityId=&featuredCards=a%2Cb&environment=&draft=false&size=10&flatFile=false',
        fallbackEndpoint: '',
        totalCardsToShow: 10,
        cardStyle: 'half-height',
        ctaAction: "_blank",
        showTotalResults: false,
        i18n: {
          cardTitleAccessibilityLevel: 6,
          prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
          totalResultsText: '{total} Results',
          title: 'My Awesome Title',
          onErrorTitle: 'Error Loading Title',
          onErrorDescription: 'Error Desc',
          titleHeadingLevel: 'h3'
        },
        setCardBorders: false,
        useOverlayLinks: false,
        additionalRequestParams: {},
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
      hideCtaIds: [
        ""
      ],
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
      country: 'us',
      "customCard": [
        "card",
        "return ``"
      ],
    analytics: { trackImpressions: '', collectionIdentifier: '' },
      target: {
        enabled: true,
        lastViewedSession: "",
      },
    });
  });
});
