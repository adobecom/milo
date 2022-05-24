/* global ClipboardItem */
import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';
import { getHashConfig, isValidUuid, loadStyle, utf8ToB64 } from '../../utils/utils.js';
import Accordion from '../../ui/controls/Accordion.js';
import { defaultState, initCaas, loadCaasFiles, loadStrings } from '../caas/utils.js';
import { Input as FormInput, Select as FormSelect } from '../../ui/controls/formControls.js';
import TagSelect from '../../ui/controls/TagSelector.js';
import MultiField from '../../ui/controls/MultiField.js';
import '../../utils/lana.js';

const CAAS_TAG_URL = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/tags';
const LS_KEY = 'caasConfiguratorState';

let tagsData = {};

const caasFilesLoaded = loadCaasFiles();

const loadCaasTags = async () => {
  const resp = await fetch(CAAS_TAG_URL);
  if (resp.ok) {
    const json = await resp.json();
    const { tags } = json.namespaces.caas;
    tagsData = tags;
  }
};
const loadCaasTagsPromise = loadCaasTags();

const getCaasTags = () => tagsData;

const ConfiguratorContext = createContext();

const defaultOptions = {
  cardStyle: {
    '1:2': '1/2 Card',
    '3:4': '3/4 Card',
    'half-height': '1/2 Height Card',
    'full-card': 'Full Card',
    'double-wide': 'Double Width Card',
    product: 'Product Card',
  },
  collectionBtnStyle: {
    primary: 'Primary',
    'call-to-action': 'Call To Action',
  },
  container: {
    '1200MaxWidth': '1200px Container',
    '1600MaxWidth': '1600px Container',
    '83Percent': '83% Container',
    '32Margin': '32 Margin Container',
    carousel: 'Carousel',
  },
  draftDb: {
    false: 'Live',
    true: 'Draft',
  },
  endpoints: {
    'www.adobe.com/chimera-api/collection': 'www.adobe.com/chimera-api/collection',
    'business.adobe.com/chimera-api/collection': 'business.adobe.com/chimera-api/collection',
    'www.stage.adobe.com/chimera-api/collection': 'www.stage.adobe.com/chimera-api/collection',
    'business.stage.adobe.com/chimera-api/collection':
      'business.stage.adobe.com/chimera-api/collection',
    '14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1':
      '14257-chimera.adobeioruntime.net/api/v1/web/chimera-0.0.1',
    '14257-chimera-stage.adobeioruntime.net/api/v1/web/chimera-0.0.1':
      '14257-chimera-stage.adobeioruntime.net/api/v1/web/chimera-0.0.1',
    '14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1':
      '14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1',
  },
  gutter: {
    '1x': '8px (1x)',
    '2x': '16px (2x)',
    '3x': '24px (3x)',
    '4x': '32px (4x)',
  },
  intraTagLogicOptions: {
    AND: 'AND',
    OR: 'OR',
  },
  layoutType: {
    '2up': '2up',
    '3up': '3up',
    '4up': '4up',
    '5up': '5up',
  },
  loadMoreBtnStyle: {
    primary: 'Primary',
    'over-background': 'Over Background',
  },
  paginationAnimationStyle: {
    paged: 'Paged',
    incremental: 'Incremental',
  },
  paginationType: {
    none: 'None',
    paginator: 'Paginator',
    loadMore: 'Load More',
  },
  search: {
    'contentArea.title': 'Card Titles',
    'contentArea.description': 'Card Descriptions',
    'contentArea.detailText': 'Card Details',
    'overlays.label.description': 'Card Labels',
    'overlays.banner.description': 'Banner Descriptions',
  },
  sort: {
    featured: 'Featured',
    dateDesc: 'Date: (Newest to Oldest)',
    dateAsc: 'Date: (Oldest to Newest)',
    eventSort: 'Events: (Live, Upcoming, OnDemand)',
    titleAsc: 'Title: (A - Z)',
    titleDesc: 'Title: (Z - A)',
    random: 'Random',
  },
  source: {
    doccloud: 'DocCloud',
    experienceleague: 'Experience League',
    hawks: 'Hawks',
    magento: 'Magento',
    marketo: 'Marketo',
    northstar: 'Northstar',
    workfront: 'Workfront',
  },
  theme: {
    lightest: 'Lightest Theme',
    light: 'Light Theme',
    dark: 'Dark Theme',
    darkest: 'Darkest Theme',
  },
};

const Select = ({ label, options, prop }) => {
  const context = useContext(ConfiguratorContext);

  const onSelectChange = (val) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop,
      value: val,
    });
  };

  return html`
    <${FormSelect}
      label=${label}
      name=${prop}
      onChange=${onSelectChange}
      options=${options}
      value=${context.state[prop]}
    />
  `;
};

const Input = ({ label, type = 'text', prop }) => {
  const context = useContext(ConfiguratorContext);

  const onInputChange = (val, e) => {
    context.dispatch({
      type: 'INPUT_CHANGE',
      prop,
      value: type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  return html`
    <${FormInput}
      label=${label}
      name=${prop}
      type=${type}
      onChange=${onInputChange}
      value=${context.state[prop]}
    />
  `;
};

const DropdownSelect = ({ label, isModal = false, options, prop }) => {
  const context = useContext(ConfiguratorContext);
  const onChange = (selections) => {
    context.dispatch({
      type: 'MULTI_SELECT_CHANGE',
      prop,
      value: selections,
    });
  };

  return html`
    <${TagSelect}
      id=${prop}
      options=${options}
      value=${context.state[prop]}
      label=${label}
      isModal=${isModal}
      onChange=${onChange}
    />
  `;
};

const BasicsPanel = () => {
  const countryTags = getTagList(tagsData.country.tags);
  const languageTags = getTagList(tagsData.language.tags);
  return html`
    <${DropdownSelect} options=${defaultOptions.source} prop="source" label="Source" />
    <${Select} options=${countryTags} prop="country" label="Country" />
    <${Select} options=${languageTags} prop="language" label="Language" />
    <${Input} label="Results Per Page" prop="resultsPerPage" type="number" />
    <${Input} label="Total Cards to Show" prop="totalCardsToShow" type="number" />
  `;
};

const UiPanel = () => html`
  <${Input} label="Show Card Borders" prop="setCardBorders" type="checkbox" />
  <${Input} label="Disable Card Banners" prop="disableBanners" type="checkbox" />
  <${Input} label="Use Light Text" prop="useLightText" type="checkbox" />
  <${Input} label="Use Overlay Links" prop="useOverlayLinks" type="checkbox" />
  <${Input} label="Show total card count at top" prop="showTotalResults" type="checkbox" />
  <${Select} label="Card Style" prop="cardStyle" options=${defaultOptions.cardStyle} />
  <${Select} label="Layout" prop="container" options=${defaultOptions.container} />
  <${Select} label="Layout Type" prop="layoutType" options=${defaultOptions.layoutType} />
  <${Select} label="Grid Gap (Gutter)" prop="gutter" options=${defaultOptions.gutter} />
  <${Select} label="Theme" prop="theme" options=${defaultOptions.theme} />
  <${Select}
    label="Collection Button Style"
    prop="collectionBtnStyle"
    options=${defaultOptions.collectionBtnStyle}
  />
  <${Select}
    label="Load More Button Style"
    prop="loadMoreBtnStyle"
    options=${defaultOptions.loadMoreBtnStyle}
  />
`;

const getTagList = (root) =>
  Object.entries(root).reduce((options, [, tag]) => {
    options[tag.tagID] = tag.title;
    return options;
  }, {});

const getTagTree = (root) => {
  const options = Object.entries(root).reduce((opts, [, tag]) => {
    opts[tag.tagID] = {};

    if (Object.keys(tag.tags).length) {
      opts[tag.tagID].children = getTagTree(tag.tags);
    }

    opts[tag.tagID].label = tag.title;
    opts[tag.tagID].path = tag.path.replace('/content/cq:tags/caas/', '');

    return opts;
  }, {});
  return options;
};

const TagsPanel = () => {
  const contentTypeTags = getTagList(tagsData['content-type'].tags);

  const allTags = getTagTree(tagsData);
  const context = useContext(ConfiguratorContext);

  const onAndLogicTagChange = (values) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop: 'andLogicTags',
      value: values,
    });
  };

  const onOrLogicTagChange = (values) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop: 'orLogicTags',
      value: values,
    });
  };
  return html`
    <${DropdownSelect}
      options=${contentTypeTags}
      prop="contentTypeTags"
      label="Content Type Tags"
    />
    <${DropdownSelect}
      options=${allTags}
      prop="includeTags"
      label="Tags to Include"
      isModal
    />
    <${DropdownSelect}
      options=${allTags}
      prop="excludeTags"
      label="Tags to Exclude"
      isModal
    />
    <${MultiField}
      onChange=${onAndLogicTagChange}
      values=${context.state.andLogicTags}
      title="AND logic Tags"
      subTitle=""
    >
      <${FormSelect}
        label="Intra Tag Logic"
        name="intraTagLogic"
        options=${defaultOptions.intraTagLogicOptions}
      />
      <${TagSelect}
        id="andTags"
        options=${allTags}
        label="Tags with overall AND logic"
        isModal
      />
    <//>
    <${MultiField}
      onChange=${onOrLogicTagChange}
      values=${context.state.orLogicTags}
      title="OR logic Tags"
      subTitle=""
    >
      <${TagSelect}
        id="orTags"
        options=${allTags}
        label="Tags with overall OR logic"
        isModal
    /><//>
  `;
};

const CardsPanel = () => {
  const context = useContext(ConfiguratorContext);
  const onFeaturedChange = (values) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop: 'featuredCards',
      value: values,
    });
  };

  const onExcludedChange = (values) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop: 'excludedCards',
      value: values,
    });
  };

  return html`
    <${MultiField}
      onChange=${onFeaturedChange}
      values=${context.state.featuredCards}
      title="Featured Cards"
      subTitle="Enter the UUID for cards to be featured"
    >
      <${FormInput} name="contentId" onValidate=${isValidUuid} />
    <//>
    <${MultiField}
      onChange=${onExcludedChange}
      values=${context.state.excludedCards}
      title="Excluded Cards"
      subTitle="Enter the UUID for cards to be excluded"
    >
      <${FormInput} name="excludeCards" label="Content ID" onValidate=${isValidUuid} />
    <//>
  `;
};

const BookmarksPanel = () => html`
    <${Input} label="Show bookmark icon on cards" prop="showBookmarksOnCards" type="checkbox" />
    <${Input} label="Only show bookmarked cards" prop="onlyShowBookmarkedCards" type="checkbox" />
    <${Input}
      label="Show the Bookmarks Filter In The Card Collection"
      prop="showBookmarksFilter"
      type="checkbox"
    />
    <${Input} label="Icon Link for in 'My Bookmarks'" prop="bookmarkIconSelect" />
    <${Input} label="Icon Link for not in 'My Bookmarks'" prop="bookmarkIconUnselect" />
  `;

const SortPanel = () => {
  const { state } = useContext(ConfiguratorContext);

  const RandomSampling = html`
    <${Input} label="Reservoir Sample" prop="sortReservoirSample" type="number" />
    <${Input} label="Reservoir Pool" prop="sortReservoirPool" type="number" />
  `;

  return html`
    <${Select} label="Default Sort Order" prop="sortDefault" options=${defaultOptions.sort} />
    <${Input} label="Enable Sort Popup" prop="sortEnablePopup" type="checkbox" />
    <${Input} label="Customize Random Sample" prop="sortEnableRandomSampling" type="checkbox" />
    ${state.sortEnableRandomSampling && RandomSampling}
  `;
};

const FilterPanel = () => {
  const { state } = useContext(ConfiguratorContext);
  // TODO: Filters
  const FilterOptions = '';

  return html`
    <${Input} label="Show Filters" prop="showFilters" type="checkbox" />
    ${state.showFilters && FilterOptions}
  `;
};

const SearchPanel = () => html`
    <${Input} label="Show Search" prop="showSearch" type="checkbox" />
    <${DropdownSelect}
      options=${defaultOptions.search}
      prop="searchFields"
      label="Choose What To Search Through"
    />
  `;

const PaginationPanel = () => {
  const { state } = useContext(ConfiguratorContext);
  const paginationOptions = html`
    <${Select}
      label="Load More Button Style"
      prop="loadMoreBtnStyle"
      options=${defaultOptions.loadMoreBtnStyle}
    />
    <${Select}
      label="Pagination Type"
      prop="paginationType"
      options=${defaultOptions.paginationType}
    />
    <${Select}
      label="Animation Style"
      prop="paginationAnimationStyle"
      options=${defaultOptions.paginationAnimationStyle}
    />
    <${Input} label="Use Theme 3" prop="paginationUseTheme3" type="checkbox" />
  `;

  return html`
    <${Input} label="Enable Pagination" prop="paginationEnabled" type="checkbox" />
    <${Input} label="Show Pagination Quantity" prop="paginationQuantityShown" type="checkbox" />
    ${state.paginationEnabled && paginationOptions}
  `;
};

const TargetPanel = () =>
  html`
    <${Input} label="Target Enabled" prop="targetEnabled" type="checkbox" />
    <${Input} label="Target Activity" prop="targetActivity" type="text" />
  `;

const AnalyticsPanel = () =>
  html`<${Input} label="Track Impression" prop="analyticsTrackImpression" type="checkbox" />
    <${Input} label="Collection Name" prop="analyticsCollectionName" type="text" />`;

const AdvancedPanel = () => {
  const { dispatch } = useContext(ConfiguratorContext);
  const onClick = () => {
    dispatch({
      type: 'RESET_STATE',
    });
  };
  return html`
    <button class="resetToDefaultState" onClick=${onClick}>Reset to default state</button>
    <${Select} label="CaaS Endpoint" prop="endpoint" options=${defaultOptions.endpoints} />
    <${Select}
      label="Fallback Endpoint"
      prop="fallbackEndpoint"
      options=${{ '': '', ...defaultOptions.endpoints }}
    />
    <${Input} label="Placeholders Folder" prop="placeholderUrl" type="text" />
  `;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANGE':
    case 'INPUT_CHANGE':
    case 'MULTI_SELECT_CHANGE':
      return { ...state, [action.prop]: action.value };
    case 'RESET_STATE':
      return { ...defaultState };
    default:
      console.log('DEFAULT');
      return state;
  }
};

const getInitialState = () => {
  const hashConfig = getHashConfig();
  if (hashConfig) return hashConfig;

  const lsState = localStorage.getItem(LS_KEY);
  if (lsState) {
    try {
      return JSON.parse(lsState);
    } catch (e) {
      // ignore
    }
  }
  return null;
};

const saveStateToLocalStorage = (state) => {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
};

const CopyBtn = () => {
  const { state } = useContext(ConfiguratorContext);
  const [isError, setIsError] = useState();
  const [isSuccess, setIsSuccess] = useState();

  // debug
  const [configUrl, setConfigUrl] = useState('');

  const setStatus = (setFn, status = true) => {
    setFn(status);
    setTimeout(() => {
      setFn(!status);
    }, 2000);
  };

  const getUrl = () => {
    const url = window.location.href.split('#')[0];
    return `${url}#${utf8ToB64(JSON.stringify(state))}`;
  };

  const copyConfig = () => {
    setConfigUrl(getUrl());
    if (!navigator?.clipboard) {
      setStatus(setIsError);
      return;
    }

    const link = document.createElement('a');
    link.href = getUrl();
    link.textContent = 'Content as a Service';

    const blob = new Blob([link.outerHTML], { type: 'text/html' });
    const data = [new ClipboardItem({ [blob.type]: blob })];
    navigator.clipboard.write(data).then(
      () => {
        setStatus(setIsSuccess);
      },
      () => {
        setStatus(setIsError);
      }
    );
  };

  return html` <textarea class=${!navigator?.clipboard ? '' : 'hide'}>${configUrl}</textarea>
    <button
      class="copy-config ${isError === true ? 'is-error' : ''} ${isSuccess === true
        ? 'is-success'
        : ''}"
      onClick=${copyConfig}
    >
      Copy
    </button>`;
};

const Configurator = ({ rootEl }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState() || defaultState);
  const [isCaasLoaded, setIsCaasLoaded] = useState(false);

  useEffect(() => {
    caasFilesLoaded
      .then(() => {
        setIsCaasLoaded(true);
      })
      .catch((error) => {
        console.log('Error loading script: ', error);
      });
  }, []);

  useEffect(async () => {
    if (isCaasLoaded) {
      const caasStrs = await loadStrings(state.placeholderUrl);
      initCaas(state, caasStrs);
      saveStateToLocalStorage(state);
    }
  }, [isCaasLoaded, state]);

  const panels = [
    {
      title: 'Basics',
      content: html`<${BasicsPanel} />`,
    },
    {
      title: 'UI',
      content: html`<${UiPanel} />`,
    },
    {
      title: 'Tags',
      content: html`<${TagsPanel} />`,
    },
    {
      title: 'Cards',
      content: html`<${CardsPanel} />`,
    },
    {
      title: 'Sort',
      content: html`<${SortPanel} />`,
    },
    {
      title: 'Bookmarks',
      content: html`<${BookmarksPanel} />`,
    },
    // {
    //   title: 'Filters',
    //   content: html`<${FilterPanel} />`,
    // },
    {
      title: 'Search',
      content: html`<${SearchPanel} />`,
    },
    {
      title: 'Pagination',
      content: html`<${PaginationPanel} />`,
    },
    {
      title: 'Target',
      content: html`<${TargetPanel} />`,
    },
    {
      title: 'Analytics',
      content: html`<${AnalyticsPanel} />`,
    },
    {
      title: 'Advanced',
      content: html`<${AdvancedPanel} />`,
    },
  ];

  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p');

  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title ? title.textContent : 'CaaS Configurator'}</h1>
        </div>
        <${CopyBtn} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=caasconfig items=${panels} alwaysOpen=${false} />
        </div>
        <div class="content-panel">
          <div id="caas" class="caas-preview"></div>
        </div>
      </div>
    </ConfiguratorContext.Provider>`;
};

export default async function init(el) {
  await loadCaasTagsPromise;
  loadStyle('/libs/ui/page/page.css');

  const app = html` <${Configurator} rootEl=${el} /> `;

  render(app, el);
}
