const getConfig = (state) => {
  const config = {
    collection: {
      mode: state.theme,
      layout: {
        type: state.layoutType,
        gutter: state.gutter,
        container: state.container,
      },
      button: {
        style: state.collectionBtnStyle,
      },
      resultsPerPage: state.resultsPerPage,
      endpoint:
                `https://www.stage.adobe.com/chimera-api/collection?contentSource=&originSelection=${state.source}&contentTypeTags=&collectionTags=&excludeContentWithTags=caas%3Aevents&language=en&country=us&complexQuery=&excludeIds=¤tEntityId=55214dea-5481-3515-a4b9-dbf51c378e62&featuredCards=&environment=&draft=${state.draftDb}&size=2000`,
      fallbackEndpoint: '',
      totalCardsToShow: state.totalCardsToShow,
      cardStyle: state.cardStyle,
      showTotalResults: 'false',
      i18n: {
        prettyDateIntervalFormat: '{ddd}, {LLL} {dd} | {timeRange} {timeZone}',
        totalResultsText: '{total} results',
        title: '',
        onErrorTitle: 'Sorry there was a system error.',
        onErrorDescription:
                    'Please try reloading the page or try coming back to the page another time.',
      },
      setCardBorders: state.setCardBorders,
      useOverlayLinks: 'false',
      banner: {
        register: {
          description: 'Sign Up',
          url: '#registration',
        },
        upcoming: {
          description: 'Upcoming',
        },
        live: {
          description: 'Live',
        },
        onDemand: {
          description: 'On Demand',
        },
      },
      useLightText: state.useLightText,
      disableBanners: state.disableBanners,
      reservoir: {
        sample: '3',
        pool: '1000',
      },
    },
    filterPanel: {
      enabled: state.showFilters,
      eventFilter: 'not-timed',
      type: 'left',
      showEmptyFilters: 'true',
      filters: [
        {
          openedOnLoad: false,
          id: 'caas:content-type',
          items: [
            {
              label: 'Application',
              id: 'caas:content-type/application',
            },
            {
              label: 'Article',
              id: 'caas:content-type/article',
            },
            {
              label: 'Blog',
              id: 'caas:content-type/blog',
            },
            {
              label: 'Certification',
              id: 'caas:content-type/certification',
            },
            {
              label: 'Consulting',
              id: 'caas:content-type/consulting',
            },
            {
              label: 'Course',
              id: 'caas:content-type/course',
            },
            {
              label: 'Customer Story',
              id: 'caas:content-type/customer-story',
            },
            {
              label: 'Demo',
              id: 'caas:content-type/demo',
            },
            {
              label: 'Document',
              id: 'caas:content-type/document',
            },
            {
              label: 'Documentation',
              id: 'caas:content-type/documentation',
            },
            {
              label: 'Event',
              id: 'caas:content-type/event',
            },
            {
              label: 'Event Session',
              id: 'caas:content-type/event-session',
            },
            {
              label: 'Event Speaker',
              id: 'caas:content-type/event-speaker',
            },
            {
              label: 'Guide',
              id: 'caas:content-type/guide',
            },
            {
              label: 'Infographic',
              id: 'caas:content-type/infographic',
            },
            {
              label: 'Partner',
              id: 'caas:content-type/partner',
            },
            {
              label: 'Podcast',
              id: 'caas:content-type/podcast',
            },
            {
              label: 'Product',
              id: 'caas:content-type/product',
            },
            {
              label: 'Product Tour',
              id: 'caas:content-type/product-tour',
            },
            {
              label: 'Promotion',
              id: 'caas:content-type/promotion',
            },
            {
              label: 'Quiz',
              id: 'caas:content-type/quiz',
            },
            {
              label: 'Report',
              id: 'caas:content-type/report',
            },
            {
              label: 'Solution',
              id: 'caas:content-type/solution',
            },
            {
              label: 'Template',
              id: 'caas:content-type/template',
            },
            {
              label: 'Tutorial',
              id: 'caas:content-type/tutorial',
            },
            {
              label: 'Video',
              id: 'caas:content-type/video',
            },
            {
              label: 'Webinar',
              id: 'caas:content-type/webinar',
            },
            {
              label: 'eBook',
              id: 'caas:content-type/ebook',
            },
          ],
          group: 'Content Type',
        },
        {
          openedOnLoad: false,
          id: 'caas:business-unit',
          items: [
            {
              label: 'Commerce Cloud',
              id: 'caas:business-unit/commerce-cloud',
            },
            {
              label: 'Creative Cloud',
              id: 'caas:business-unit/creative-cloud',
            },
            {
              label: 'Document Cloud',
              id: 'caas:business-unit/document-cloud',
            },
            {
              label: 'Experience Cloud',
              id: 'caas:business-unit/experience-cloud',
            },
          ],
          group: 'Business Unit',
        },
        {
          openedOnLoad: false,
          id: 'caas:journey-phase',
          items: [
            {
              label: 'Acceleration',
              id: 'caas:journey-phase/acceleration',
            },
            {
              label: 'Acquisition',
              id: 'caas:journey-phase/acquisition',
            },
            {
              label: 'Discover',
              id: 'caas:journey-phase/discover',
            },
            {
              label: 'Evaluate',
              id: 'caas:journey-phase/evaluate',
            },
            {
              label: 'Expansion',
              id: 'caas:journey-phase/expansion',
            },
            {
              label: 'Explore',
              id: 'caas:journey-phase/explore',
            },
            {
              label: 'Retention',
              id: 'caas:journey-phase/retention',
            },
            {
              label: 'Use Re-invest',
              id: 'caas:journey-phase/use-re-invest',
            },
          ],
          group: 'Journey Phase',
        },
        {
          openedOnLoad: false,
          id: 'caas:role',
          items: [
            {
              label: 'Advertising',
              id: 'caas:role/advertising',
            },
            {
              label: 'Commerce',
              id: 'caas:role/commerce',
            },
            {
              label: 'Compliance Evaluator',
              id: 'caas:role/compliance-evaluator',
            },
            {
              label: 'Decision Maker',
              id: 'caas:role/decision-maker',
            },
            {
              label: 'Digital',
              id: 'caas:role/digital',
            },
            {
              label: 'Feature Evaluator',
              id: 'caas:role/feature-evaluator',
            },
            {
              label: 'IT',
              id: 'caas:role/it',
            },
            {
              label: 'Marketing',
              id: 'caas:role/marketing',
            },
            {
              label: 'Sales',
              id: 'caas:role/sales',
            },
            {
              label: 'Vision Leader',
              id: 'caas:role/vision-leader',
            },
          ],
          group: 'Role',
        },
        {
          openedOnLoad: false,
          id: 'caas:industry',
          items: [
            {
              label: 'Advertising',
              id: 'caas:industry/advertising',
            },
            {
              label: 'Aviation',
              id: 'caas:industry/aviation',
            },
            {
              label: 'Education',
              id: 'caas:industry/education',
            },
            {
              label: 'Energy & Utilities',
              id: 'caas:industry/energy-utilities',
            },
            {
              label: 'Financial Services',
              id: 'caas:industry/financial-services',
            },
            {
              label: 'Food & Beverage',
              id: 'caas:industry/food-and-beverage',
            },
            {
              label: 'Government',
              id: 'caas:industry/government',
            },
            {
              label: 'Healthcare',
              id: 'caas:industry/healthcare',
            },
            {
              label: 'High Tech',
              id: 'caas:industry/high-tech',
            },
            {
              label: 'Life Sciences',
              id: 'caas:industry/life-sciences',
            },
            {
              label: 'Logistics & Transportation',
              id: 'caas:industry/logistics-transportation',
            },
            {
              label: 'Manufacturing',
              id: 'caas:industry/manufacturing',
            },
            {
              label: 'Media & Entertainment',
              id: 'caas:industry/media-and-entertainment',
            },
            {
              label: 'Non-profit',
              id: 'caas:industry/non-profit',
            },
            {
              label: 'Pharmaceuticals',
              id: 'caas:industry/pharmaceuticals',
            },
            {
              label: 'Print & Publishing',
              id: 'caas:industry/print-publishing',
            },
            {
              label: 'Professional Services',
              id: 'caas:industry/professional-services',
            },
            {
              label: 'Retail',
              id: 'caas:industry/retail',
            },
            {
              label: 'Technology Software & Services',
              id: 'caas:industry/technology-software-services',
            },
            {
              label: 'Telecommunications',
              id: 'caas:industry/telecommunications',
            },
            {
              label: 'Travel & Hospitality',
              id: 'caas:industry/travel-and-hospitality',
            },
          ],
          group: 'Industry',
        },
        {
          openedOnLoad: false,
          id: 'caas:products',
          items: [
            {
              label: 'Acrobat',
              id: 'caas:products/acrobat',
            },
            {
              label: 'Adobe Advertising Cloud',
              id: 'caas:products/adobe-advertising-cloud',
            },
            {
              label: 'Adobe Analytics',
              id: 'caas:products/adobe-analytics',
            },
            {
              label: 'Adobe Audience Manager',
              id: 'caas:products/adobe-audience-manager',
            },
            {
              label: 'Adobe Campaign',
              id: 'caas:products/adobe-campaign',
            },
            {
              label: 'Adobe Commerce',
              id: 'caas:products/adobe-commerce',
            },
            {
              label: 'Adobe Commerce Cloud',
              id: 'caas:products/adobe-commerce-cloud',
            },
            {
              label: 'Adobe Creative Cloud',
              id: 'caas:products/adobe-creative-cloud',
            },
            {
              label: 'Adobe Document Cloud',
              id: 'caas:products/adobe-document-cloud',
            },
            {
              label: 'Adobe Experience Cloud',
              id: 'caas:products/adobe-experience-cloud',
            },
            {
              label: 'Adobe Experience Manager',
              id: 'caas:products/adobe-experience-manager',
            },
            {
              label: 'Adobe Experience Platform',
              id: 'caas:products/adobe-experience-platform',
            },
            {
              label: 'Adobe Fonts',
              id: 'caas:products/adobe-fonts',
            },
            {
              label: 'Adobe Fresco',
              id: 'caas:products/adobe-fresco',
            },
            {
              label: 'Adobe Primetime',
              id: 'caas:products/adobe-primetime',
            },
            {
              label: 'Adobe Scan',
              id: 'caas:products/adobe-scan',
            },
            {
              label: 'Adobe Sensei',
              id: 'caas:products/adobe-sensei',
            },
            {
              label: 'Adobe Sign',
              id: 'caas:products/adobe-sign',
            },
            {
              label: 'Adobe Spark',
              id: 'caas:products/adobe-spark',
            },
            {
              label: 'Adobe Stock',
              id: 'caas:products/adobe-stock',
            },
            {
              label: 'Adobe Target',
              id: 'caas:products/adobe-target',
            },
            {
              label: 'Adobe Workfront',
              id: 'caas:products/workfront',
            },
            {
              label: 'Adobe Workfront',
              id: 'caas:products/adobe-workfront',
            },
            {
              label: 'Aero',
              id: 'caas:products/aero',
            },
            {
              label: 'After Effects',
              id: 'caas:products/after-effects',
            },
            {
              label: 'Animate',
              id: 'caas:products/animate',
            },
            {
              label: 'Audition',
              id: 'caas:products/audition',
            },
            {
              label: 'Behance',
              id: 'caas:products/behance',
            },
            {
              label: 'Bridge',
              id: 'caas:products/bridge',
            },
            {
              label: 'Capture',
              id: 'caas:products/capture',
            },
            {
              label: 'Character Animator',
              id: 'caas:products/character-animator',
            },
            {
              label: 'Creative Cloud',
              id: 'caas:products/creative-cloud',
            },
            {
              label: 'Creative Cloud Express',
              id: 'caas:products/creative-cloud-express',
            },
            {
              label: 'Creative Cloud Libraries',
              id: 'caas:products/creative-cloud-libraries',
            },
            {
              label: 'Dimension',
              id: 'caas:products/dimension',
            },
            {
              label: 'Illustrator',
              id: 'caas:products/illustrator',
            },
            {
              label: 'InDesign',
              id: 'caas:products/indesign',
            },
            {
              label: 'Lightroom',
              id: 'caas:products/lightroom',
            },
            {
              label: 'Lightroom Classic',
              id: 'caas:products/lightroom-classic',
            },
            {
              label: 'Lightroom on mobile',
              id: 'caas:products/lightroom-on-mobile',
            },
            {
              label: 'Magento Business Intelligence',
              id: 'caas:products/magento-business-intelligence',
            },
            {
              label: 'Magento Commerce',
              id: 'caas:products/magento-commerce',
            },
            {
              label: 'Magento Order Management',
              id: 'caas:products/magento-order-management',
            },
            {
              label: 'Marketo Engage & Bizible',
              id: 'caas:products/marketo-engage-bizible',
            },
            {
              label: 'Medium by Adobe',
              id: 'caas:products/medium-by-adobe',
            },
            {
              label: 'Not Product Specific',
              id: 'caas:products/not-product-specific',
            },
            {
              label: 'PDF API',
              id: 'caas:products/pdf-api',
            },
            {
              label: 'PDF SDK',
              id: 'caas:products/pdf-sdk',
            },
            {
              label: 'Photoshop',
              id: 'caas:products/photoshop',
            },
            {
              label: 'Photoshop Camera',
              id: 'caas:products/photoshop-camera',
            },
            {
              label: 'Photoshop Express',
              id: 'caas:products/photoshop-express',
            },
            {
              label: 'Portfolio',
              id: 'caas:products/portfolio',
            },
            {
              label: 'Premiere Express',
              id: 'caas:products/premiere-express',
            },
            {
              label: 'Premiere Pro',
              id: 'caas:products/premiere-pro',
            },
            {
              label: 'Premiere Rush',
              id: 'caas:products/premiere-rush',
            },
            {
              label: 'Preview',
              id: 'caas:products/preview',
            },
            {
              label: 'Reader',
              id: 'caas:products/reader',
            },
            {
              label: 'Substance',
              id: 'caas:products/substance',
            },
            {
              label: 'Substance 3D Assets',
              id: 'caas:products/substance-3d-assets',
            },
            {
              label: 'Substance 3D Designer',
              id: 'caas:products/substance-3d-designer',
            },
            {
              label: 'Substance 3D Modeler',
              id: 'caas:products/substance-3d-modeler',
            },
            {
              label: 'Substance 3D Painter',
              id: 'caas:products/substance-3d-painter',
            },
            {
              label: 'Substance 3D Sampler',
              id: 'caas:products/substance-3d-sampler',
            },
            {
              label: 'Substance 3D Stager',
              id: 'caas:products/substance-3d-stager',
            },
            {
              label: 'Substance Alchemist',
              id: 'caas:products/substance-alchemist',
            },
            {
              label: 'Substance Painter',
              id: 'caas:products/substance-painter',
            },
            {
              label: 'Substance Source',
              id: 'caas:products/substance-source',
            },
            {
              label: 'XD',
              id: 'caas:products/xd',
            },
          ],
          group: 'Products',
        },
        {
          openedOnLoad: false,
          id: 'caas:product-categories',
          items: [
            {
              label: '3D and AR',
              id: 'caas:product-categories/3d-and-ar',
            },
            {
              label: 'Acrobat and PDF',
              id: 'caas:product-categories/acrobat-and-pdf',
            },
            {
              label: 'Graphic Design',
              id: 'caas:product-categories/graphic-design',
            },
            {
              label: 'Illustration',
              id: 'caas:product-categories/illustration',
            },
            {
              label: 'Photo',
              id: 'caas:product-categories/photo',
            },
            {
              label: 'Social Media',
              id: 'caas:product-categories/social-media',
            },
            {
              label: 'UI and UX',
              id: 'caas:product-categories/ui-and-ux',
            },
            {
              label: 'Video',
              id: 'caas:product-categories/video',
            },
          ],
          group: 'Product Categories',
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
      enabled: 'true',
      defaultSort: 'dateDesc',
      options: [{ label: 'Feeee', sort: 'featured' }, { label: 'Old', sort: 'dateAsc' }, { label: 'New', sort: 'dateDesc' }],
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
        leftFilterPanel: {
          filterTitle: 'My favorites',
        },
        card: {
          saveText: 'Save Card',
          unsaveText: 'Unsave Card',
        },
      },
    },
    search: {
      enabled: state.showSearch,
      searchFields: [],
      i18n: {
        noResultsTitle: 'No Results Found',
        noResultsDescription: 'Try checking your spelling or broadening your search.',
        leftFilterPanel: {
          searchTitle: 'Search',
          searchPlaceholderText: 'Search Here',
        },
        topFilterPanel: {
          searchPlaceholderText: 'Search Here',
        },
        filterInfo: {
          searchPlaceholderText: 'Search Here',
        },
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
    },
  };
  return config;
};

export default getConfig;
