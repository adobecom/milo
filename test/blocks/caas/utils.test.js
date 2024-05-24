import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import {
  defaultState,
  getConfig,
  loadStrings,
  arrayToObj,
  getPageLocale,
  getCountryAndLang,
} from '../../../libs/blocks/caas/utils.js';

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

function fileNotFoundResponse() {
  return new Promise((resolve) => {
    resolve({
      ok: false,
      statusCode: 404,
      text: () => {},
    });
  });
}

function htmlResponse() {
  return new Promise((resolve) => {
    resolve({
      ok: true,
      text: () => {
        const fetchCalledWith = fetch.args[0].toString();
        const fetchLocale = fetchCalledWith.split('/')[3];
        return `
            <div class="string-mappings">
              <div>
                <div>collectionTitle</div>
                <div>${mockLocales.includes(fetchLocale) ? fetchLocale : ''} collection title</div>
                <div>Card Collection Title</div>
                <div></div>
                <div></div>
              </div>
            </div>`;
      },
    });
  });
}

describe('arrayToObj', () => {
  it('should convert array to object', () => {
    expect(arrayToObj([{ key: 'a', value: 1 }, { key: 'b', value: 2 }])).to.be.eql({ a: 1, b: 2 });
    expect(arrayToObj({})).to.be.eql({});
  });
});
describe('additionalQueryParams', () => {
  expect(arrayToObj([{ key: 'a', value: 1 }, { key: 'b', value: 2 }])).to.be.eql({ a: 1, b: 2 });
  expect(arrayToObj({})).to.be.eql({});
});

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
    const expected = { collectionTitle: ' collection title' };
    expect(loadedStrings).to.eql(expected);
  });

  it('should be able to get correct page locale for en_US', () => {
    const locale = getPageLocale('/tools/caas', mockLocales);
    expect(locale).to.eql('');
  });

  for (const locale of mockLocales) {
    it('should be able to fetch mappings all other mockLocales ', async () => {
      const expected = { collectionTitle: `${locale} collection title` };
      const pathname = `/${locale}/tools/caas`;
      const loadedStrings = await loadStrings('https://milo.adobe.com/drafts/caas/mappings', pathname, mockLocales);
      expect(loadedStrings).to.eql(expected);
    });
  }

  for (const locale of mockLocales) {
    it('should be able to get correct page locale', () => {
      const pageLocale = getPageLocale(`/${locale}/tools/caas`, mockLocales);
      expect(locale).to.eql(pageLocale);
    });
  }

  it('should be able to handle multiple 404s', async () => {
    const pathname = '/fr/tools/caas';
    window.fetch = stub().returns(fileNotFoundResponse());
    const loadedStrings = await loadStrings('https://milo.adobe.com/drafts/caas/mappings', pathname, mockLocales);
    expect(loadedStrings).to.eql({});
  });
});

describe('getConfig', () => {
  const state = defaultState;

  state.featuredCards = [{ contentId: 'https://business.adobe.com/resources/articles/4-pieces-of-social-media-real-estate-you-shouldnt-ignore.html' }, { contentId: 'e9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd' }];
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
        'caas:industry/life-sciences',
      ],
      openedOnLoad: true,
      icon: '',
      excludeTags: [],
    },
    {
      filterTag: [
        'caas:journey-phase',
      ],
      openedOnLoad: '',
      icon: '/path/to/icon.svg',
      excludeTags: [
        'caas:journey-phase/use-re-invest',
        'caas:journey-phase/expansion',
      ],
    },
  ];

  it('*** NEW *** should return a caas config object', async () => {
    const config = await getConfig(state, strings);
    expect(config).to.be.eql({
      collection: {
        mode: 'lightest',
        layout: { type: '4up', gutter: '4x', container: '1200MaxWidth' },
        button: { style: 'primary' },
        cardHoverEffect: 'default',
        collectionButtonStyle: 'primary',
        resultsPerPage: 5,
        endpoint: 'https://www.adobe.com/chimera-api/collection/myTargetActivity.json?originSelection=hawks&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=((%22caas%3Aproducts%2Findesign%22%2BAND%2B%22caas%3Aproducts%2Freader%22)%2BAND%2B(%22caas%3Acountry%2Fbr%22%2BOR%2B%22caas%3Acountry%2Fca%22))%2BAND%2B((%22caas%3Acontent-type%2Fvideo%22%2BAND%2B%22caas%3Acontent-type%2Fblog%22))&excludeIds=&currentEntityId=&featuredCards=c94ec235-50c2-595e-9fa8-0b4602c08712%2Ce9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd&environment=&draft=true&size=10&debug=true&flatFile=false',
        fallbackEndpoint: '',
        totalCardsToShow: 10,
        cardStyle: 'half-height',
        ctaAction: '_self',
        detailsTextOption: 'default',
        showTotalResults: false,
        i18n: {
          cardTitleAccessibilityLevel: 6,
          lastModified: 'Last modified {date}',
          prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
          totalResultsText: '{total} Results',
          title: '',
          onErrorTitle: 'Error Loading Title',
          onErrorDescription: 'Error Desc',
          titleHeadingLevel: 'h3',
        },
        setCardBorders: false,
        showFooterDivider: false,
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
      featuredCards: ['c94ec235-50c2-595e-9fa8-0b4602c08712', 'e9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd'],
      headers: [['X-Adobe-Floodgate', 'pink']],
      hideCtaIds: [''],
      hideCtaTags: [],
      filterPanel: {
        categories: [
          {
            group: "All Topics",
            id: "",
            items: [],
            label: "All Topics",
          },
          {
            group: "photo",
            label: "Photo",
            icon: "",
            id: "caas:product-categories/photo",
            items: [
              {
                group: "Photoshop",
                id: "caas:product-categories/photo/photoshop",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/photo/photoshop-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Camera",
                id: "caas:product-categories/photo/photoshop-camera",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/photo/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "graphic-design",
            label: "Graphic Design",
            id: "caas:product-categories/graphic-design",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/graphic-design/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Illustrator",
                id: "caas:product-categories/graphic-design/illustrator",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "video",
            label: "Video",
            id: "caas:product-categories/video",
            icon: "",
            items: [
              {
                group: "After Effects",
                id: "caas:product-categories/video/after-effects",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Premier Pro",
                id: "caas:product-categories/video/premier-pro",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/video/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/video/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "illustration",
            label: "Illustration",
            id: "caas:product-categories/illustration",
            icon: "",
            items: [
              {
                group: "Illustrator",
                id: "caas:product-categories/illustration/illustrator",
                items: [],
                openedOnLoad: false
              },
              {
                group: "InDesign",
                id: "caas:product-categories/illustration/indesign",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/illustration/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Fresco",
                id: "caas:product-categories/illustration/fresco",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "ui-and-ux",
            id: "caas:product-categories/ui-and-ux",
            icon: "",
            items: [],
            label: "UI and UX",
          },
          {
            group: "acrobat-and-pdf",
            id: "caas:product-categories/acrobat-and-pdf",
            icon: "",
            items: [],
            label: "Acrobat and PDF"
          },
          {
            group: "3d-and-ar",
            label: "3D and AR",
            id: "caas:product-categories/3d-and-ar",
            icon: "",
            items: [
              {
                group: "3D Modeler",
                id: "caas:product-categories/3d-and-ar/3d-modeler",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Painter",
                id: "caas:product-categories/3d-and-ar/3d-painter",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Designer",
                id: "caas:product-categories/3d-and-ar/3d-designer",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "social-media",
            label: "Social Media",
            id: "caas:product-categories/social-media",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/social-media/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/social-media/photoshop-express",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "genai",
            label: "Gen AI",
            id: "caas:product-categories/genai",
            icon: "",
            items: [
              {
                group: "Gen Studio",
                id: "caas:product-categories/genai/genstudio",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Firefly",
                id: "caas:product-categories/genai/firefly",
                items: [],
                openedOnLoad: false
              },
              {
                group: "AI Assistant",
                id: "caas:product-categories/genai/ai-assistant",
                items: [],
                openedOnLoad: false
              }
            ],
          },
        ],
        enabled: true,
        eventFilter: '',
        type: 'left',
        showEmptyFilters: false,
        filters: [
          {
            group: 'Life Sciences',
            id: 'caas:industry/life-sciences',
            items: [],
            openedOnLoad: true,
          },
          {
            group: 'Journey Phase',
            icon: '/path/to/icon.svg',
            id: 'caas:journey-phase',
            items: [
              {
                id: 'caas:journey-phase/acceleration',
                label: 'Acceleration',
              },
              {
                id: 'caas:journey-phase/acquisition',
                label: 'Acquisition',
              },
              {
                id: 'caas:journey-phase/discover',
                label: 'Discover',
              },
              {
                id: 'caas:journey-phase/evaluate',
                label: 'Evaluate',
              },
              {
                id: 'caas:journey-phase/explore',
                label: 'Explore',
              },
              {
                id: 'caas:journey-phase/retention',
                label: 'Retention',
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
      customCard: [
        'card',
        'return ``',
      ],
      analytics: { trackImpressions: '', collectionIdentifier: '' },
      target: {
        enabled: true,
        lastViewedSession: '',
      },
    });
  });

  it('should return localized filters', async () => {
    const cfg = {
      pathname: '/be_fr/blah.html',
      locales: {
        '': { ietf: 'en-US' },
        be_fr: { ietf: 'fr-BE' },
      },
    };
    setConfig(cfg);
    const myState = JSON.parse(JSON.stringify(state));
    myState.language = 'fr';
    myState.country = 'be';
    const config = await getConfig(myState, strings);
    expect(config).to.be.eql({
      collection: {
        mode: 'lightest',
        layout: { type: '4up', gutter: '4x', container: '1200MaxWidth' },
        button: { style: 'primary' },
        cardHoverEffect: 'default',
        collectionButtonStyle: 'primary',
        resultsPerPage: 5,
        endpoint: 'https://www.adobe.com/chimera-api/collection/myTargetActivity.json?originSelection=hawks&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=fr&country=be&complexQuery=((%22caas%3Aproducts%2Findesign%22%2BAND%2B%22caas%3Aproducts%2Freader%22)%2BAND%2B(%22caas%3Acountry%2Fbr%22%2BOR%2B%22caas%3Acountry%2Fca%22))%2BAND%2B((%22caas%3Acontent-type%2Fvideo%22%2BAND%2B%22caas%3Acontent-type%2Fblog%22))&excludeIds=&currentEntityId=&featuredCards=b6aa23a7-f6bf-51f4-a2b6-0a93fc31bd16%2Ce9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd&environment=&draft=true&size=10&debug=true&flatFile=false',
        fallbackEndpoint: '',
        totalCardsToShow: 10,
        cardStyle: 'half-height',
        ctaAction: '_self',
        detailsTextOption: 'default',
        showTotalResults: false,
        i18n: {
          cardTitleAccessibilityLevel: 6,
          lastModified: 'Last modified {date}',
          prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
          totalResultsText: '{total} Results',
          title: '',
          onErrorTitle: 'Error Loading Title',
          onErrorDescription: 'Error Desc',
          titleHeadingLevel: 'h3',
        },
        setCardBorders: false,
        showFooterDivider: false,
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
      featuredCards: ['b6aa23a7-f6bf-51f4-a2b6-0a93fc31bd16', 'e9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd'],
      headers: [['X-Adobe-Floodgate', 'pink']],
      hideCtaIds: [''],
      hideCtaTags: [],
      filterPanel: {
        categories: [
          {
            group: "All Topics",
            id: "",
            items: [],
            label: "All Topics",
          },
          {
            group: "photo",
            label: "Photo",
            icon: "",
            id: "caas:product-categories/photo",
            items: [
              {
                group: "Photoshop",
                id: "caas:product-categories/photo/photoshop",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/photo/photoshop-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Camera",
                id: "caas:product-categories/photo/photoshop-camera",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/photo/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "graphic-design",
            label: "Graphic Design",
            id: "caas:product-categories/graphic-design",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/graphic-design/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Illustrator",
                id: "caas:product-categories/graphic-design/illustrator",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "video",
            label: "Video",
            id: "caas:product-categories/video",
            icon: "",
            items: [
              {
                group: "After Effects",
                id: "caas:product-categories/video/after-effects",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Premier Pro",
                id: "caas:product-categories/video/premier-pro",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/video/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/video/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "illustration",
            label: "Illustration",
            id: "caas:product-categories/illustration",
            icon: "",
            items: [
              {
                group: "Illustrator",
                id: "caas:product-categories/illustration/illustrator",
                items: [],
                openedOnLoad: false
              },
              {
                group: "InDesign",
                id: "caas:product-categories/illustration/indesign",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/illustration/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Fresco",
                id: "caas:product-categories/illustration/fresco",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "ui-and-ux",
            id: "caas:product-categories/ui-and-ux",
            icon: "",
            items: [],
            label: "UI and UX",
          },
          {
            group: "acrobat-and-pdf",
            id: "caas:product-categories/acrobat-and-pdf",
            icon: "",
            items: [],
            label: "Acrobat and PDF"
          },
          {
            group: "3d-and-ar",
            label: "3D and AR",
            id: "caas:product-categories/3d-and-ar",
            icon: "",
            items: [
              {
                group: "3D Modeler",
                id: "caas:product-categories/3d-and-ar/3d-modeler",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Painter",
                id: "caas:product-categories/3d-and-ar/3d-painter",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Designer",
                id: "caas:product-categories/3d-and-ar/3d-designer",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "social-media",
            label: "Social Media",
            id: "caas:product-categories/social-media",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/social-media/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/social-media/photoshop-express",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "genai",
            label: "Gen AI",
            id: "caas:product-categories/genai",
            icon: "",
            items: [
              {
                group: "Gen Studio",
                id: "caas:product-categories/genai/genstudio",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Firefly",
                id: "caas:product-categories/genai/firefly",
                items: [],
                openedOnLoad: false
              },
              {
                group: "AI Assistant",
                id: "caas:product-categories/genai/ai-assistant",
                items: [],
                openedOnLoad: false
              }
            ],
          },
        ],
        enabled: true,
        eventFilter: '',
        type: 'left',
        showEmptyFilters: false,
        filters: [
          {
            group: 'Sciences de la vie',
            id: 'caas:industry/life-sciences',
            items: [],
            openedOnLoad: true,
          },
          {
            group: 'Journey Phase',
            icon: '/path/to/icon.svg',
            id: 'caas:journey-phase',
            items: [
              {
                id: 'caas:journey-phase/acceleration',
                label: 'Accélération',
              },
              {
                id: 'caas:journey-phase/acquisition',
                label: 'Acquisition',
              },
              {
                id: 'caas:journey-phase/discover',
                label: 'Découvrir',
              },
              {
                id: 'caas:journey-phase/explore',
                label: 'Explorer',
              },
              {
                id: 'caas:journey-phase/retention',
                label: 'Fidélisation',
              },
              {
                id: 'caas:journey-phase/evaluate',
                label: 'Évaluation',
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
      language: 'fr',
      country: 'be',
      customCard: [
        'card',
        'return ``',
      ],
      analytics: { trackImpressions: '', collectionIdentifier: '' },
      target: {
        enabled: true,
        lastViewedSession: '',
      },
    });
  });
});

describe('getCountryAndLang', () => {
  const caasCfg = {
    country: 'caas:country/ec',
    language: 'caas:laguange/es',
  };
  const cfg = {
    pathname: '/be_fr/blah.html',
    locales: {
      '': { ietf: 'en-US' },
      be_fr: { ietf: 'fr-BE' },
    },
  };

  it('should use country and lang from CaaS Config', () => {
    setConfig(cfg);
    const expected = getCountryAndLang({
      ...caasCfg,
      autoCountryLang: false,
    });
    expect(expected).to.deep.eq({
      country: 'ec',
      language: 'es',
      locales: '',
    });
  });

  it('should use default country and lang from CaaS Config', () => {
    setConfig(cfg);
    const expected = getCountryAndLang({ autoCountryLang: false });
    expect(expected).to.deep.eq({
      country: 'US',
      language: 'en',
      locales: '',
    });
  });

  it('should use country and lang from locale in Milo Config', () => {
    setConfig(cfg);
    const expected = getCountryAndLang({
      ...caasCfg,
      autoCountryLang: true,
    });
    expect(expected).to.deep.eq({
      country: 'BE',
      language: 'fr',
      locales: '',
    });
  });

  it('should use default country and lang from locale in Milo Config', () => {
    setConfig({
      ...cfg,
      pathname: '/whatever/blah.html',
    });
    const expected = getCountryAndLang({
      ...caasCfg,
      autoCountryLang: true,
    });
    expect(expected).to.deep.eq({
      country: 'US',
      language: 'en',
      locales: '',
    });
  });
});

describe('getFloodgateCaasConfig', () => {
  const caasFgState = defaultState;
  caasFgState.fetchCardsFromFloodgateTree = true;
  caasFgState.draftDb = true;

  it('should return a floodgate enabled caas config object', async () => {
    const caasFgConfig = await getConfig(caasFgState, strings);
    expect(caasFgConfig).to.be.eql({
      collection: {
        mode: 'lightest',
        layout: { type: '4up', gutter: '4x', container: '1200MaxWidth' },
        button: { style: 'primary' },
        cardHoverEffect: 'default',
        collectionButtonStyle: 'primary',
        resultsPerPage: 5,
        endpoint: 'https://www.adobe.com/chimera-api/collection/myTargetActivity.json?originSelection=hawks&contentTypeTags=&secondSource=&secondaryTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=((%22caas%3Aproducts%2Findesign%22%2BAND%2B%22caas%3Aproducts%2Freader%22)%2BAND%2B(%22caas%3Acountry%2Fbr%22%2BOR%2B%22caas%3Acountry%2Fca%22))%2BAND%2B((%22caas%3Acontent-type%2Fvideo%22%2BAND%2B%22caas%3Acontent-type%2Fblog%22))&excludeIds=&currentEntityId=&featuredCards=c94ec235-50c2-595e-9fa8-0b4602c08712%2Ce9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd&environment=&draft=true&size=10&debug=true&flatFile=false',
        fallbackEndpoint: '',
        totalCardsToShow: 10,
        cardStyle: 'half-height',
        ctaAction: '_self',
        detailsTextOption: 'default',
        showTotalResults: false,
        i18n: {
          cardTitleAccessibilityLevel: 6,
          lastModified: 'Last modified {date}',
          prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
          totalResultsText: '{total} Results',
          title: '',
          onErrorTitle: 'Error Loading Title',
          onErrorDescription: 'Error Desc',
          titleHeadingLevel: 'h3',
        },
        setCardBorders: false,
        showFooterDivider: false,
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
      featuredCards: ['c94ec235-50c2-595e-9fa8-0b4602c08712', 'e9d71f5e-e7c9-5d6d-89e9-2ffdad17b8bd'],
      headers: [['X-Adobe-Floodgate', 'pink']],
      hideCtaIds: [''],
      hideCtaTags: [],
      filterPanel: {
        categories: [
          {
            group: "All Topics",
            id: "",
            items: [],
            label: "All Topics",
          },
          {
            group: "photo",
            label: "Photo",
            icon: "",
            id: "caas:product-categories/photo",
            items: [
              {
                group: "Photoshop",
                id: "caas:product-categories/photo/photoshop",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/photo/photoshop-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Camera",
                id: "caas:product-categories/photo/photoshop-camera",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/photo/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "graphic-design",
            label: "Graphic Design",
            id: "caas:product-categories/graphic-design",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/graphic-design/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Illustrator",
                id: "caas:product-categories/graphic-design/illustrator",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "video",
            label: "Video",
            id: "caas:product-categories/video",
            icon: "",
            items: [
              {
                group: "After Effects",
                id: "caas:product-categories/video/after-effects",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Premier Pro",
                id: "caas:product-categories/video/premier-pro",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/video/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Lightroom",
                id: "caas:product-categories/video/lightroom",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "illustration",
            label: "Illustration",
            id: "caas:product-categories/illustration",
            icon: "",
            items: [
              {
                group: "Illustrator",
                id: "caas:product-categories/illustration/illustrator",
                items: [],
                openedOnLoad: false
              },
              {
                group: "InDesign",
                id: "caas:product-categories/illustration/indesign",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Adobe Express",
                id: "caas:product-categories/illustration/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Fresco",
                id: "caas:product-categories/illustration/fresco",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "ui-and-ux",
            id: "caas:product-categories/ui-and-ux",
            icon: "",
            items: [],
            label: "UI and UX",
          },
          {
            group: "acrobat-and-pdf",
            id: "caas:product-categories/acrobat-and-pdf",
            icon: "",
            items: [],
            label: "Acrobat and PDF"
          },
          {
            group: "3d-and-ar",
            label: "3D and AR",
            id: "caas:product-categories/3d-and-ar",
            icon: "",
            items: [
              {
                group: "3D Modeler",
                id: "caas:product-categories/3d-and-ar/3d-modeler",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Painter",
                id: "caas:product-categories/3d-and-ar/3d-painter",
                items: [],
                openedOnLoad: false
              },
              {
                group: "3D Designer",
                id: "caas:product-categories/3d-and-ar/3d-designer",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "social-media",
            label: "Social Media",
            id: "caas:product-categories/social-media",
            icon: "",
            items: [
              {
                group: "Adobe Express",
                id: "caas:product-categories/social-media/adobe-express",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Photoshop Express",
                id: "caas:product-categories/social-media/photoshop-express",
                items: [],
                openedOnLoad: false
              }
            ],
          },
          {
            group: "genai",
            label: "Gen AI",
            id: "caas:product-categories/genai",
            icon: "",
            items: [
              {
                group: "Gen Studio",
                id: "caas:product-categories/genai/genstudio",
                items: [],
                openedOnLoad: false
              },
              {
                group: "Firefly",
                id: "caas:product-categories/genai/firefly",
                items: [],
                openedOnLoad: false
              },
              {
                group: "AI Assistant",
                id: "caas:product-categories/genai/ai-assistant",
                items: [],
                openedOnLoad: false
              }
            ],
          },
        ],
        enabled: true,
        eventFilter: '',
        type: 'left',
        showEmptyFilters: false,
        filters: [
          {
            group: 'Life Sciences',
            id: 'caas:industry/life-sciences',
            items: [],
            openedOnLoad: true,
          },
          {
            group: 'Journey Phase',
            icon: '/path/to/icon.svg',
            id: 'caas:journey-phase',
            items: [
              {
                id: 'caas:journey-phase/acceleration',
                label: 'Acceleration',
              },
              {
                id: 'caas:journey-phase/acquisition',
                label: 'Acquisition',
              },
              {
                id: 'caas:journey-phase/discover',
                label: 'Discover',
              },
              {
                id: 'caas:journey-phase/evaluate',
                label: 'Evaluate',
              },
              {
                id: 'caas:journey-phase/explore',
                label: 'Explore',
              },
              {
                id: 'caas:journey-phase/retention',
                label: 'Retention',
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
      customCard: [
        'card',
        'return ``',
      ],
      analytics: { trackImpressions: '', collectionIdentifier: '' },
      target: {
        enabled: true,
        lastViewedSession: '',
      },
    });
  });
});
