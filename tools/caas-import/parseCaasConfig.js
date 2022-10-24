import { defaultState } from '../../libs/blocks/caas/utils.js';
import { utf8ToB64 } from '../../libs/utils/utils.js';

const d = '{  "collection": {    "mode": "lightest",    "layout": {      "type": "3up",      "gutter": "4x",      "container": "1200MaxWidth"    },    "lazyload": "false",    "button": {      "style": "primary"    },    "resultsPerPage": "9",    "endpoint": "https://www.adobe.com/chimera-api/collection?contentSource=Northstar%2CMarketo%2CMagento%2CExperienceLeague%2CWorkfront&originSelection=Northstar%2CExperienceLeague&contentTypeTags=caas%3Acontent-type%2Freport%2Ccaas%3Acontent-type%2Fvideo%2Ccaas%3Acontent-type%2Fwebinar%2Ccaas%3Acontent-type%2Fevent-session%2Ccaas%3Acontent-type%2Finfographic%2Ccaas%3Acontent-type%2Febook%2Ccaas%3Acontent-type%2Fdemo%2Ccaas%3Acontent-type%2Fguide%2Ccaas%3Acontent-type%2Fcourse&collectionTags=&excludeContentWithTags=caas%3Aevents&language=en&country=us&complexQuery=%28%28%22caas%3Acontent-type%2Freport%22+OR+%22caas%3Acontent-type%2Fvideo%22+OR+%22caas%3Acontent-type%2Fwebinar%22+OR+%22caas%3Acontent-type%2Fevent-session%22+OR+%22caas%3Acontent-type%2Finfographic%22+OR+%22caas%3Acontent-type%2Febook%22+OR+%22caas%3Acontent-type%2Fdemo%22+OR+%22caas%3Acontent-type%2Fguide%22+OR+%22caas%3Acontent-type%2Fcourse%22%29%29&excludeIds=11c0a80e-5fe6-34c8-bea3-a859dc0967a3%2Cb09a4cbd-9ae3-3272-8fd8-7d773e609f09%2C05a75b5f-ea47-3226-bd6d-fd8f66c0e07f%2C8deca492-3796-3bde-af68-768f4a07bd70%2C7eb4800f-0905-3d76-8cb2-73d1a1473521%2C64eea049-993d-3f96-a94e-f68013294be0%2C16c50ab8-7aef-3854-b321-b8c9692025e5%2C9196eebb-54a8-36e6-940e-fbdaf8e53ceb%2C62d368f0-cfe1-33d9-bcae-267efde7b59d%2C26e48ad6-0a5c-343b-876a-4000ebc6a77e%2C899fd0a3-8873-3e01-8f23-c50b2554dc34%2C4199c35f-b43e-3e10-9149-7d2c1a706789%2C7b66b2ed-b0b7-3df3-9a8a-e28d4451003a%2C29be7241-e7d2-374d-879c-0f1a1e8fbed1%2Cd6fc48f6-9000-3a38-9d67-f4eed1f5133a%2Caad34b7a-bd53-3356-a61e-9486510d9047%2Cd1b02bdd-b0ca-3f14-8406-59f867cc3615%2C9728ef6e-5785-3f7f-9b4c-0cb0c12fbe53%2C5945170b-3352-3cf5-b47e-3fae978a8b98%2C8d5db0e0-3517-3bea-a897-1a11b80de926%2C33a46910-1c0d-3aaf-9ad7-37bc369cda6a%2C7f307fa4-2bbb-3b83-833a-6b16c989f657%2Ce09fbde5-3b40-38c8-aa23-fecfeed7565b%2Cd0a0d317-bdbc-35b2-a779-cb1ad14191f7&currentEntityId=729849be-f1df-3dbb-96ba-8f759ba0084c&featuredCards=420b8181-b812-3323-8809-cb968fcdc022%2C8ad1c148-9a63-3ada-8a4e-1101e6c54c8c%2C92cf8eed-f7a7-317f-bead-30d204f4a901%2Cef9f592c-1b31-31ef-891d-45d19313bf69%2Cee2935f6-928c-327e-b4d7-830719c84a6c%2Cc94aa2c9-4b16-3bf1-a67c-9727034fc116%2Cb5199d0d-1a61-38b4-962c-db7f14fd706a%2C5b34aba0-4797-388b-860b-6bda40c52ea5%2C8d3833b1-5de0-31ef-bbb1-701515ace168&environment=&size=1500",    "fallbackEndpoint": "",    "totalCardsToShow": "1500",    "cardStyle": "1:2",    "showTotalResults": "false",    "i18n": {      "prettyDateIntervalFormat": "{ddd}, {LLL} {dd} | {timeRange} {timeZone}",      "totalResultsText": "{total} results",      "title": "Find resources relevant to your industry, product, and more.",      "titleHeadingLevel": "h2",      "onErrorTitle": "Sorry there was a system error.",      "onErrorDescription": "Please try reloading the page or try coming back to the page another time."    },    "setCardBorders": "true",    "useOverlayLinks": "false",    "banner": {      "register": {        "description": "Sign Up",        "url": "#registration"      },      "upcoming": {        "description": "Upcoming"      },      "live": {        "description": "Live"      },      "onDemand": {        "description": "On Demand"      }    },    "useLightText": "false",    "disableBanners": "false",    "reservoir": {      "sample": "3",      "pool": "1000"    },    "ctaAction": "",    "additionalRequestParams": {}  },  "featuredCards": "[`420b8181-b812-3323-8809-cb968fcdc022`,`8ad1c148-9a63-3ada-8a4e-1101e6c54c8c`,`92cf8eed-f7a7-317f-bead-30d204f4a901`,`ef9f592c-1b31-31ef-891d-45d19313bf69`,`ee2935f6-928c-327e-b4d7-830719c84a6c`,`c94aa2c9-4b16-3bf1-a67c-9727034fc116`,`b5199d0d-1a61-38b4-962c-db7f14fd706a`,`5b34aba0-4797-388b-860b-6bda40c52ea5`,`8d3833b1-5de0-31ef-bbb1-701515ace168`]",  "filterPanel": {    "enabled": "true",    "eventFilter": "",    "type": "left",    "showEmptyFilters": "false",    "filters": [      {        "openedOnLoad": false,        "icon": "",        "id": "adobe-com-enterprise:topic",        "items": [          {            "label": "Advertising",            "id": "adobe-com-enterprise:topic/advertising"          },          {            "label": "Analytics",            "id": "adobe-com-enterprise:topic/analytics"          },          {            "label": "Business Continuity",            "id": "adobe-com-enterprise:topic/business-continuity"          },          {            "label": "Campaign Orchestration",            "id": "adobe-com-enterprise:topic/campaign-orchestration"          },          {            "label": "Commerce",            "id": "adobe-com-enterprise:topic/commerce"          },          {            "label": "Content Management",            "id": "adobe-com-enterprise:topic/content-management"          },          {            "label": "Customer Intelligence",            "id": "adobe-com-enterprise:topic/customer-intelligence"          },          {            "label": "Data & Insights",            "id": "adobe-com-enterprise:topic/data-&-insights"          },          {            "label": "Data Foundation",            "id": "adobe-com-enterprise:topic/data-foundation"          },          {            "label": "Data Management",            "id": "adobe-com-enterprise:topic/data-management"          },          {            "label": "Demand Marketing",            "id": "adobe-com-enterprise:topic/demand-marketing"          },          {            "label": "Digital Foundation",            "id": "adobe-com-enterprise:topic/digital-foundation"          },          {            "label": "Documents & E-Signatures",            "id": "adobe-com-enterprise:topic/documents-and-e-signatures"          },          {            "label": "Email Marketing",            "id": "adobe-com-enterprise:topic/email-marketing"          },          {            "label": "Enterprise Work Management",            "id": "adobe-com-enterprise:topic/enterprise-work-management"          },          {            "label": "Marketing Automation",            "id": "adobe-com-enterprise:topic/marketing-automation"          },          {            "label": "Personalization",            "id": "adobe-com-enterprise:topic/personalization"          }        ],        "group": "Topic"      },      {        "openedOnLoad": false,        "icon": "",        "id": "caas:industry",        "items": [          {            "label": "Advertising",            "id": "caas:industry/advertising"          },          {            "label": "Education",            "id": "caas:events/industry/education"          },          {            "label": "Financial Services",            "id": "caas:industry/financial-services"          },          {            "label": "Food & Beverage",            "id": "caas:industry/food-and-beverage"          },          {            "label": "Government",            "id": "caas:industry/government"          },          {            "label": "Healthcare",            "id": "caas:industry/healthcare"          },          {            "label": "High Tech",            "id": "caas:industry/high-tech"          },          {            "label": "Life Sciences",            "id": "caas:industry/life-sciences"          },          {            "label": "Manufacturing",            "id": "caas:events/industry/manufacturing"          },          {            "label": "Media & Entertainment",            "id": "caas:industry/media-and-entertainment"          },          {            "label": "Non-Profit",            "id": "caas:industry/non-profit"          },          {            "label": "Retail",            "id": "caas:industry/retail"          },          {            "label": "Telecommunications",            "id": "caas:industry/telecommunications"          },          {            "label": "Travel & Hospitality",            "id": "caas:industry/travel-and-hospitality"          }        ],        "group": "Industry"      },      {        "openedOnLoad": false,        "icon": "",        "id": "caas:content-type",        "items": [          {            "label": "Course",            "id": "caas:content-type/course"          },          {            "label": "Demo",            "id": "caas:content-type/demo"          },          {            "label": "eBook",            "id": "caas:content-type/ebook"          },          {            "label": "Event Session",            "id": "caas:content-type/event-session"          },          {            "label": "Guide",            "id": "caas:content-type/guide"          },          {            "label": "Infographic",            "id": "caas:content-type/infographic"          },          {            "label": "Report",            "id": "caas:content-type/report"          },          {            "label": "Video",            "id": "caas:content-type/video"          },          {            "label": "Webinar",            "id": "caas:content-type/webinar"          }        ],        "group": "Content Type"      },      {        "openedOnLoad": false,        "icon": "",        "id": "caas:products",        "items": [          {            "label": "Journey Optimizer",            "id": "adobe-com-enterprise:product/journey-orchestration"          },          {            "label": "Advertising",            "id": "adobe-com-enterprise:product/advertising-cloud"          },          {            "label": "Analytics",            "id": "adobe-com-enterprise:product/analytics"          },          {            "label": "Audience Manager",            "id": "adobe-com-enterprise:product/audience-manager"          },          {            "label": "Campaign",            "id": "adobe-com-enterprise:product/campaign"          },          {            "label": "Captivate",            "id": "adobe-com-enterprise:product/captivate"          },          {            "label": "Commerce",            "id": "adobe-com-enterprise:product/magento-commerce"          },          {            "label": "Commerce Cloud",            "id": "adobe-com-enterprise:product/commerce-cloud"          },          {            "label": "Customer Journey Analytics",            "id": "adobe-com-enterprise:product/customer-journey-analytics"          },          {            "label": "Experience Cloud",            "id": "adobe-com-enterprise:related-product/experience-cloud"          },          {            "label": "Experience Manager",            "id": "adobe-com-enterprise:product/experience-manager"          },          {            "label": "Experience Manager Assets",            "id": "adobe-com-enterprise:product/experience-manager-assets"          },          {            "label": "Experience Manager Forms",            "id": "adobe-com-enterprise:product/experience-manager-forms"          },          {            "label": "Experience Manager Sites",            "id": "adobe-com-enterprise:product/experience-manager-sites"          },          {            "label": "Experience Platform",            "id": "adobe-com-enterprise:product/experience-platform"          },          {            "label": "Intelligent Services",            "id": "adobe-com-enterprise:product/intelligent-services"          },          {            "label": "Journey Orchestration",            "id": "adobe-com-enterprise:product/journey-orchestration"          },          {            "label": "Marketo Engage",            "id": "adobe-com-enterprise:product/marketo-engage"          },          {            "label": "Real-Time Customer Data Platform",            "id": "adobe-com-enterprise:product/real-time-customer-data-platform"          },          {            "label": "Sensei",            "id": "adobe-com-enterprise:product/sensei"          },          {            "label": "Services",            "id": "adobe-com-enterprise:product/services"          },          {            "label": "Sign",            "id": "adobe-com-enterprise:product/sign"          },          {            "label": "Target",            "id": "adobe-com-enterprise:product/target"          },          {            "label": "Workfront",            "id": "adobe-com-enterprise:product/workfront"          }        ],        "group": "Products"      }    ],    "filterLogic": "or",    "i18n": {      "leftPanel": {        "header": "Refine Your Results",        "clearAllFiltersText": "Clear All",        "mobile": {          "filtersBtnLabel": "Filters",          "panel": {            "header": "Filter by",            "totalResultsText": "{total} results",            "applyBtnText": "Apply",            "clearFilterText": "Clear",            "doneBtnText": "Done"          },          "group": {            "totalResultsText": "{total} results",            "applyBtnText": "Apply",            "clearFilterText": "Clear",            "doneBtnText": "Done"          }        }      },      "topPanel": {        "groupLabel": "Filters:",        "clearAllFiltersText": "Clear All",        "moreFiltersBtnText": "More Filters +",        "mobile": {          "group": {            "totalResultsText": "{total} results",            "applyBtnText": "Apply",            "clearFilterText": "Clear",            "doneBtnText": "Done"          }        }      }    }  },  "sort": {    "enabled": "true",    "defaultSort": "dateDesc",    "options": [      {        "label": "Newest",        "sort": "dateDesc"      },      {        "label": "Title",        "sort": "titleAsc"      },      {        "label": "Featured",        "sort": "featured"      },      {        "sort": "featured"      }    ]  },  "pagination": {    "animationStyle": "paged",    "enabled": "true",    "resultsQuantityShown": "true",    "loadMoreButton": {      "style": "primary",      "useThemeThree": "true"    },    "type": "paginator",    "i18n": {      "loadMore": {        "btnText": "Load More",        "resultsQuantityText": "{start} of {end} displayed"      },      "paginator": {        "resultsQuantityText": "{start} - {end} of {total} results",        "prevLabel": "Prev",        "nextLabel": "Next"      }    }  },  "bookmarks": {    "showOnCards": "false",    "leftFilterPanel": {      "bookmarkOnlyCollection": "false",      "showBookmarksFilter": "false",      "selectBookmarksIcon": "",      "unselectBookmarksIcon": ""    },    "i18n": {      "leftFilterPanel": {        "filterTitle": "My favorites"      },      "card": {        "saveText": "Save Card",        "unsaveText": "Unsave Card"      }    }  },  "search": {    "enabled": "true",    "searchFields": [      "contentArea.title",      "contentArea.description",      "contentArea.detailText",      "overlays.label.description"    ],    "i18n": {      "noResultsTitle": "No Results Found",      "noResultsDescription": "Try checking your spelling or broadening your search.",      "leftFilterPanel": {        "searchTitle": "Filter resources",        "searchPlaceholderText": "Search Here"      },      "topFilterPanel": {        "searchPlaceholderText": "Search Here"      },      "filterInfo": {        "searchPlaceholderText": "Search Here"      }    }  },  "language": "en",  "country": "US",  "analytics": {    "trackImpressions": "",    "collectionIdentifier": ""  },  "target": {    "enabled": "",    "lastViewedSession": ""  },  "customCard": [    "return `<div>Please author a valid custom card key</div>`"  ]}';

const oldc = {
  collection: {
    mode: 'lightest', // ?
    layout: {
      type: '3up',
      gutter: '4x',
      container: '1200MaxWidth',
    },
    lazyload: '',
    button: { style: 'primary' },
    resultsPerPage: '3',
    endpoint:
      'https://www.adobe.com/chimera-api/collection?contentSource=&originSelection=Northstar%2CMarketo%2CMagento%2CWorkfront%2CExperienceLeague&contentTypeTags=&collectionTags=&excludeContentWithTags=&language=en&country=us&complexQuery=%28%28%22adobe-com-enterprise%3Aproduct%2Fmagento-commerce%22+OR+%22caas%3Aproducts%2Fadobe-commerce%22%29%29&excludeIds=d0a0d317-bdbc-35b2-a779-cb1ad14191f7&currentEntityId=a2086bf4-c9f2-3136-b76f-66e0e5fa7625&featuredCards=&environment=&size=500',
    fallbackEndpoint: '',
    totalCardsToShow: '500',
    cardStyle: '1:2',
    showTotalResults: 'false',
    i18n: {
      prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
      totalResultsText: '{total} results',
      title: '',
      titleHeadingLevel: 'h2',
      onErrorTitle: 'Sorry there was a system error.',
      onErrorDescription:
        'Please try reloading the page or try coming back to the page another time.',
    },
    setCardBorders: 'true',
    useOverlayLinks: 'false',
    banner: {
      register: {
        description: 'Sign Up',
        url: '#registration',
      },
      upcoming: { description: 'Upcoming' },
      live: { description: 'Live' },
      onDemand: { description: 'On Demand' },
    },
    useLightText: 'false',
    disableBanners: 'false',
    reservoir: {
      sample: '3',
      pool: '1000',
    },
    ctaAction: '',
    additionalRequestParams: {},
  },
  featuredCards: '[]',
  filterPanel: {
    enabled: 'false',
    eventFilter: '',
    type: 'left',
    showEmptyFilters: 'false',
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
  sort: {
    enabled: 'false',
    defaultSort: 'random',
    options: [],
  },
  pagination: {
    animationStyle: 'paged',
    enabled: 'false',
    resultsQuantityShown: 'false',
    loadMoreButton: {
      style: 'primary',
      useThemeThree: 'true',
    },
    type: 'loadMore',
    i18n: {
      loadMore: {
        btnText: 'Load More',
        resultsQuantityText: '{start} of {end} displayed',
      },
      paginator: {
        resultsQuantityText: '{start} - {end} of {total} results',
        prevLabel: 'Prev',
        nextLabel: 'Next',
      },
    },
  },
  bookmarks: {
    showOnCards: 'false',
    leftFilterPanel: {
      bookmarkOnlyCollection: 'false',
      showBookmarksFilter: 'false',
      selectBookmarksIcon: '',
      unselectBookmarksIcon: '',
    },
    i18n: {
      leftFilterPanel: { filterTitle: 'My favorites' },
      card: {
        saveText: 'Save Card',
        unsaveText: 'Unsave Card',
      },
    },
  },
  search: {
    enabled: 'true',
    searchFields: [],
    i18n: {
      noResultsTitle: 'No Results Found',
      noResultsDescription: 'Try checking your spelling or broadening your search.',
      leftFilterPanel: {
        searchTitle: 'Search',
        searchPlaceholderText: 'Search Here',
      },
      topFilterPanel: { searchPlaceholderText: 'Search Here' },
      filterInfo: { searchPlaceholderText: 'Search Here' },
    },
  },
  language: 'en',
  country: 'US',
  analytics: {
    trackImpressions: '',
    collectionIdentifier: '',
  },
  target: {
    enabled: '',
    lastViewedSession: '',
  },
  customCard: ['return `<div>Please author a valid custom card key</div>`'],
};

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
  console.log(Object.entries(obj))
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
      if (typeof window !== 'undefined' && window.btoa) {
        return utf8ToB64(configStr);
      }
      // for node
      return Buffer.from(configStr).toString('base64');
    },
    getStringCsv: (conf) => {
      const state = getData(conf);
      return convertToCsv(state.configStrings);
    },
  };
})();

console.log(getCaasConfigHash(d));
console.log(getStringCsv(d));

export { getCaasConfigHash, getStringCsv };
