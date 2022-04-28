/* global ClipboardItem */
import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../libs/deps/htm-preact.js';
import { loadStyle } from '../../scripts/scripts.js';
import { Accordion } from '../../libs/ui/controls/controls.js';
import { defaultState, initCaas, loadCaasFiles } from '../caas/utils.js';
import { getHashConfig, utf8ToB64 } from '../../libs/utils.js';
import TagSelect from './TagSelector.js';

const CAAS_TAG_URL = 'https://14257-chimera-dev.adobeioruntime.net/api/v1/web/chimera-0.0.1/tags';
const LS_KEY = 'caasConfiguratorState';

const caasFilesLoaded = loadCaasFiles();

let tagsData = {};

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
  gutter: {
    '1x': '8px (1x)',
    '2x': '16px (2x)',
    '3x': '24px (3x)',
    '4x': '32px (4x)',
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

  const onSelectChange = (e) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop,
      value: e.target.value,
    });
  };

  return html`
    <div class="field">
      <label for=${prop}>${label}</label>
      <select id=${prop} value=${context.state[prop]} onChange=${onSelectChange}>
        ${Object.entries(options).map(
    ([val, label]) => html`<option value="${val}">${label}</option>`,
  )}
      </select>
    </div>
  `;
};

const Input = ({ label, type = 'text', prop }) => {
  const context = useContext(ConfiguratorContext);

  const onInputChange = (e) => {
    context.dispatch({
      type: 'INPUT_CHANGE',
      prop,
      value: type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const value = { [type === 'checkbox' ? 'checked' : 'value']: context.state[prop] };

  return html` <div class="field">
    <label for=${prop}>${label}</label>
    <input type=${type} id=${prop} name=${prop} ...${value} onChange=${onInputChange} />
  </div>`;
};

const DropdownSelect = ({ label, options, prop }) => {
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
      selectedOptions=${context.state[prop]}
      label=${label}
      onSelectedChange=${onChange}
    />
  `;
};

const BasicsPanel = () => html`
  <${DropdownSelect} options=${defaultOptions.source} prop="source" label="Source" />
  <${Select} label="Card Style" prop="cardStyle" options=${defaultOptions.cardStyle} />
  <${Select} label="Layout" prop="container" options=${defaultOptions.container} />
  <${Select} label="Layout Type" prop="layoutType" options=${defaultOptions.layoutType} />
  <${Input} label="Results Per Page" prop="resultsPerPage" type="number" />
  <${Input} label="Total Cards to Show" prop="totalCardsToShow" type="number" />
`;

const UiPanel = () => html`
  <${Input} label="Show Card Borders" prop="setCardBorders" type="checkbox" />
  <${Input} label="Disable Card Banners" prop="disableBanners" type="checkbox" />
  <${Input} label="Use Light Text" prop="useLightText" type="checkbox" />
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

const getTopLevelTags = (tagId) => {
  const tagsData = getCaasTags();
  return Object.entries(tagsData[tagId].tags).reduce(
    (contentOptions, [, tagObj]) => {
      contentOptions[tagObj.tagID] = tagObj.title;
      return contentOptions;
    },
    {},
  );
};

const TagsPanel = () => {
  const contentTypeTags = getTopLevelTags('content-type');
  const countryTags = getTopLevelTags('country');
  const languageTags = getTopLevelTags('language');

  return html`
    <${DropdownSelect}
      options=${contentTypeTags}
      prop="contentTypeTags"
      label="Content Type Tags"
    />
    <${Select}
      options=${countryTags}
      prop="country"
      label="Country"
    />
    <${Select}
      options=${languageTags}
      prop="language"
      label="Language"
    />
  `;
};

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
  const FilterOptions = html`<${Input} label="Show Search" prop="showSearch" type="checkbox" />`;

  return html`
    <${Input} label="Show Filters" prop="showFilters" type="checkbox" />
    ${state.showFilters && FilterOptions}
  `;
};

const AdvancedPanel = () => html` <${Select} label="Database" prop="draftDb" options=${defaultOptions.draftDb} /> `;

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

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANGE':
    case 'INPUT_CHANGE':
    case 'MULTI_SELECT_CHANGE':
      return { ...state, [action.prop]: action.value };
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
    navigator.clipboard.write(data)
      .then(() => {
        setStatus(setIsSuccess);
      }, () => {
        setStatus(setIsError);
      });
  };

  return html`
  <textarea class=${!navigator?.clipboard ? '' : 'hide'}>${configUrl}</textarea>
  <button
    class="copy-config ${isError === true ? 'is-error' : ''} ${isSuccess === true ? 'is-success' : ''}"
    onClick=${copyConfig}>Copy</button>`;
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

  useEffect(() => {
    if (isCaasLoaded) {
      initCaas(state);
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
      title: 'Sort',
      content: html`<${SortPanel} />`,
    },
    {
      title: 'Filters',
      content: html`<${FilterPanel} />`,
    },
    {
      title: 'Pagination',
      content: html`<${PaginationPanel} />`,
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

  const app = html`
    <${Configurator} rootEl=${el}/>
  `;

  render(app, el);
}
