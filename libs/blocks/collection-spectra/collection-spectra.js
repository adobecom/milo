import { createTag, loadScript, loadStyle } from '../../utils/utils.js';

export default async function init(el) {
  const divs = document.querySelectorAll('.collection-spectra > div');
  let props = {};
  for(let div of divs){
    let a = div.querySelectorAll('div');
    let key = a[0].innerText.toLocaleLowerCase();
    let val = a[1].innerText;
    props[key] =val;
  }
  el.innerHTML = '';
  const collectionEl = createTag('div', { id: 'someDivId'}, '');
  el.append(collectionEl);

  const endpoint = props.source && !props.source.includes('community') ? 
    "https://adobe.com/NEED/URL/FOR/THIS/TO&WORK=PROPERLY" :
    "https://cchome-stage.adobe.io/ucs/v3/users/me/surfaces/community/contents/recommendations/context/discussions?locale=en-US" 

  var config = {
    collection: {
      mode: "lightest", // Can be empty, "light", "dark", "darkest";
      layout: {
        type: '3up', // Can be "2up", "3up", "4up", "5up";
        gutter: '4x', // Can be "2x", "3x", "4x";
        container: props.layout || 'carousel' // 'carousel', // Can be "83Percent", "1200MaxWidth", "32Margin";
      },
      lazyLoad: false,
      button: {
        style: "call-to-action", // Can be "primary", "call-to-action";
      },
      banner: {
        upcoming: {
          description: "Upcoming"
        },
        live: {
          description: "Live"
        },
        onDemand: {
          description: "On Demand"
        }
      },
      resultsPerPage: props.resultsPerPage || '5',
      endpoint: endpoint, 
      totalCardsToShow: props.limit || '55',
      cardStyle: props.cardstyle || "half-height", // available options: "1:2", "3:4", "full-card", "half-height", "custom-card", "product", "double-wide";
      showTotalResults: 'true',
      i18n: {
        prettyDateIntervalFormat: '{LLL} {dd} | {timeRange} {timeZone}',
        totalResultsText: '{total} Results',
        title: 'Recommended for you',
        titleHeadingLevel: 'h2',
        cardTitleAccessibilityLevel: '3',
        onErrorTitle: 'Sorry there was a system error.',
        onErrorDescription: 'Please try reloading the page or try coming back to the page another time.',
        lastModified: "Last modified {date}"
      },
      setCardBorders: "true", // Can be true or false;
      useOverlayLinks: "false", // Can be true or false;
    },
    featuredCards: ['c7d34f39-397c-3727-9dff-5d0d9d8cf731'],
    filterPanel: {
      enabled: 'false',
      type: 'top',
      eventFilter: 'all',
      showEmptyFilters: true,
      filters: [
        {
          "group": "By Solution",
          "id": "adobe-com-enterprise:topic",
          "items": [
            {
              "label": "Business Continuity",
              "id": "adobe-com-enterprise:topic/business-continuity"
            },
            {
              "label": "Creativity and Design",
              "id": "adobe-com-enterprise:topic/creativity-design"
            },
            {
              "label": "Customer Intelligence",
              "id": "adobe-com-enterprise:topic/customer-intelligence"
            },
            {
              "label": "Data Management Platform",
              "id": "adobe-com-enterprise:topic/data-management-platform"
            },
            {
              "label": "Digital Foundation",
              "id": "adobe-com-enterprise:topic/digital-foundation"
            },
            {
              "label": "Digital Trends",
              "id": "adobe-com-enterprise:topic/digital-trends"
            },
            {
              "label": "Document Management",
              "id": "adobe-com-enterprise:topic/document-management"
            },
            {
              "label": "Marketing Automation",
              "id": "adobe-com-enterprise:topic/marketing-automation"
            },
            {
              "label": "Personalization",
              "id": "adobe-com-enterprise:topic/personalization"
            },
            {
              "label": "Stock",
              "id": "adobe-com-enterprise:topic/Stock"
            }
          ]
        },
        {
          "group": "Availability",
          "id": "adobe-com-enterprise:availability",
          "items": [
            {
              "label": "On-Demand",
              "id": "adobe-com-enterprise:availability/on-demand"
            },
            {
              "label": "Upcoming",
              "id": "adobe-com-enterprise:availability/upcoming"
            }
          ]
        },
        {
          "group": "Duration",
          "id": "adobe-com-enterprise:duration",
          "items": [
            {
              "label": "Long",
              "id": "adobe-com-enterprise:duration/long"
            },
            {
              "label": "Short",
              "id": "adobe-com-enterprise:duration/short"
            }
          ]
        },
        {
          "group": "Rating",
          "id": "adobe-com-enterprise:rating",
          "items": [
            {
              "label": "5",
              "id": "adobe-com-enterprise:rating/5"
            },
            {
              "label": "4",
              "id": "adobe-com-enterprise:rating/4"
            }
          ]
        }
      ],
      filterLogic: 'or',
      topPanel: {
        mobile: {
          blurFilters: true,
        }
      },
      i18n: {
        leftPanel: {
          header: 'My Favorites',
          // searchBoxTitle: 'Search',
          clearAllFiltersText: 'Clear All',
          mobile: {
            filtersBtnLabel: 'Filters:',
            panel: {
              header: 'Filters',
              totalResultsText: '{total} Results',
              applyBtnText: 'Apply',
              clearFilterText: 'Clear',
              doneBtnText: 'Done',
            },
            group: {
              totalResultsText: '{total} Results',
              applyBtnText: 'Apply',
              clearFilterText: 'Clear Left',
              doneBtnText: 'Done',
            }
          }
        },
        topPanel: {
          groupLabel: 'Filters',
          clearAllFiltersText: 'Clear All Top',
          moreFiltersBtnText: 'More Filters: +',
          mobile: {
            group: {
              totalResultsText: '{total} esults',
              applyBtnText: 'Apply',
              clearFilterText: 'Clear Top',
              doneBtnText: 'Done',
            }
          }
        }
      }
    },
    hideCtaIds: [''],
    sort: {
      enabled: 'true',
      defaultSort: 'customSort',
      options: '[{"label":"Random", "sort":"random"},{"label":"Featured","sort":"featured"},{"label":"Title: (A-Z)","sort":"titleAsc"},{"label":"Title: (Z-A)","sort":"titleDesc"},{"label":"Date: (Oldest to newest)","sort":"dateAsc"},{"label":"Date: (Newest to oldest)","sort":"dateDesc"}, {"label": "Custom Sort", "sort": "customSort"}]',
      customSort: function(card){console.log("customSort: ", card); return card;}
    },
    pagination: {
      animationStyle: 'paged',
      enabled: 'true',
      type: 'loadMore',
      loadMoreButton: {
        style: "primary", // Can be "primary", "over-background";
        useThemeThree: "true", // Can be "true" or "false";
      },
      i18n: {
        loadMore: {
          btnText: 'Load More',
          resultsQuantityText: 'Showing {start} of {end} cards',
        },
        paginator: {
          resultsQuantityText: '{start}-{end} of {total} results',
          prevLabel: 'Prev',
          nextLabel: 'Next',
        }
      }
    },
    bookmarks: {
      showOnCards: 'true',
      leftFilterPanel: {
        bookmarkOnlyCollection: 'false',
        showBookmarksFilter: 'true',
        selectBookmarksIcon: '',
        unselectBookmarksIcon: '',
      },
      i18n: {
        leftFilterPanel: {
          filterTitle: 'My Favorites',
        }
      }
    },
    search: {
      enabled: 'false',
      searchFields: '["contentArea.title","contentArea.description","search.meta.author","overlays.banner.description", "foo.bar"]',
      i18n: {
        noResultsTitle: 'No Results Found',
        noResultsDescription: 'We could not find any results. {break} Try checking your spelling or broadening your search.',
        leftFilterPanel: {
          searchTitle: 'Search',
          searchPlaceholderText: 'Search here...',
        },
        topFilterPanel: {
          searchPlaceholderText: 'i18n.topFilterPanel.searchPlaceholderText',
        },
        filterInfo: {
          searchPlaceholderText: 'i18n.filterInfo.searchPlaceholderText',
        }
      }
    },
    language: 'en-US',
    analytics: {
      trackImpressions: 'true',
      collectionIdentifier: 'Some Identifier',
    },
    customCard: ["data", "return `<div class=customCard><div class=backgroundImg></div> <section><label>PHOTO EDITING</label><p><b>Transform a landscape with Sky Replacement.</b></p></div></section> </div>`"],
    onCardSaved: function(){},
    onCardUnsaved: function(){},
    spectra: {
      input: props.input || document.querySelector('meta[name="description"]').content || "I am trying to color an image in 3 different colors and make it even for each color. The problem is how to do that because selection tool doesnt allow me to do so. Also the middle of the image has an emblem and i need to leave that untouched. Is there any way to do this? Image of what i am trying to color is posted.",
      fiCode: props.ficode || "photoshop_cc",
      metadataImportance: props.metadataImportance || 0.25,
      limit: props.limit || 9,
      cleaning: props.cleaning || "no",
      locale: props.locale || "en-US",
    }
  };

  loadStyle('/libs/blocks/collection-spectra/caas-ui.css');
  loadScript('/libs/blocks/collection-spectra/caas-ui.js')
    .then(() => {
      const consonantCardCollection = new ConsonantCardCollection(config, document.getElementById("someDivId"));
    });
}
