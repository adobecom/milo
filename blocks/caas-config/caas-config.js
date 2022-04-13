import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
} from '../../libs/deps/htm-preact.js';
import { loadStyle } from '../../scripts/scripts.js';
import { Accordion } from '../../libs/ui/controls/controls.js';
import getConfig from './configObj.js';
import { loadScript, setQueryStringWithoutPageReload } from './utils.js';
import { defaultState, b64_to_utf8, utf8_to_b64, getUrlConfig } from './shared-utils.js';
import TagSelect from './TagSelector.js';

const EVENT_CAAS_SCRIPT_LOADED = 'caas-loaded';

loadStyle('https://www.adobe.com/special/chimera/latest/dist/dexter/app.min.css');
loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/react.umd.js');
loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/react.dom.umd.js');
loadScript('https://www.adobe.com/special/chimera/latest/dist/dexter/app.min.js', () => {
  window.dispatchEvent(new Event(EVENT_CAAS_SCRIPT_LOADED));
  // consonantCardCollection = new ConsonantCardCollection(config, document.getElementById('caas'));
});

const ConfiguratorContext = createContext();

const options = {
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
    'featured': 'Featured',
    'dateDesc': 'Date: (Newest to Oldest)',
    'dateAsc': 'Date: (Oldest to Newest)',
    'eventSort': 'Events: (Live, Upcoming, OnDemand)',
    'titleAsc': 'Title: (A - Z)',
    'titleDesc': 'Title: (Z - A)',
    'random': 'Random',
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
        <div class=field>
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

  return html` <div class=field>
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
        <label for=${prop}>${label}</label>
        <${TagSelect} id=${prop} options=${options} selectedOptions=${context.state[prop]} label=${label} onSelectedChange=${onChange}/>
    `;
}

const BasicsPanel = () => {
    return html`
        <${DropdownSelect} options=${options.source} prop="source" label="Source"/>
        <${Select} label="Card Style" prop="cardStyle" options=${options.cardStyle} />
        <${Select} label="Layout" prop="container" options=${options.container} />
        <${Select}
            label="Pagination Type"
            prop="paginationType"
            options=${options.paginationType}
        />
        <${Select} label="Layout Type" prop="layoutType" options=${options.layoutType} />
        <${Input} label="Results Per Page" prop="resultsPerPage" type="number" />
        <${Input} label="Total Cards to Show" prop="totalCardsToShow" type="number" />
    `;
};

const UiPanel = () => {
    return html`
        <${Input} label="Show Card Borders" prop="setCardBorders" type="checkbox" />
        <${Input} label="Disable Card Banners" prop="disableBanners" type="checkbox" />
        <${Input} label="Use Light Text" prop="useLightText" type="checkbox" />
        <${Select} label="Grid Gap (Gutter)" prop="gutter" options=${options.gutter} />
        <${Select} label="Theme" prop="theme" options=${options.theme} />
        <${Select}
            label="Collection Button Style"
            prop="collectionBtnStyle"
            options=${options.collectionBtnStyle}
        />
        <${Select}
            label="Load More Button Style"
            prop="loadMoreBtnStyle"
            options=${options.loadMoreBtnStyle}
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
        <${Select} label="Default Sort Order" prop="sortDefault" options=${options.sort} />
        <${Input} label="Enable Sort Popup" prop="sortEnablePopup" type="checkbox" />
        <${Input} label="Customize Random Sample" prop="sortEnableRandomSampling" type="checkbox" />
        ${state.sortEnableRandomSampling && RandomSampling}

     `;
}

const FilterPanel = () => {
    const { state } = useContext(ConfiguratorContext);
    const FilterOptions = html`<${Input} label="Show Search" prop="showSearch" type="checkbox" />`;

    return html`
        <${Input} label="Show Filters" prop="showFilters" type="checkbox" />
        ${state.showFilters && FilterOptions}
    `;
};

const AdvancedPanel = () => {
    return html` <${Select} label="Database" prop="draftDb" options=${options.draftDb} /> `;
};

const PaginationPanel = () => {
    const { state } = useContext(ConfiguratorContext);
    const paginationOptions = html`
        <${Select}
            label="Load More Button Style"
            prop="loadMoreBtnStyle"
            options=${options.loadMoreBtnStyle}
        />
        <${Select}
            label="Pagination Type"
            prop="paginationType"
            options=${options.paginationType}
        />
        <${Select}
            label="Animation Style"
            prop="paginationAnimationStyle"
            options=${options.paginationAnimationStyle}
        />
        <${Input} label="Use Theme 3" prop="paginationUseTheme3" type="checkbox" />
    `;

    return html`
        <${Input} label="Enable Pagination" prop="paginationEnabled" type="checkbox" />
        <${Input} label="Show Pagination Quantity" prop="paginationQuantityShown" type="checkbox" />
        ${state.paginationEnabled && paginationOptions}
    `;
};

const updateCollection = (state) => {
  const caasEl = document.getElementById('caas');
  if (!caasEl) return;

  const appEl = caasEl.parentElement;
  caasEl.remove();

  const newEl = document.createElement('div');
  newEl.id = 'caas';
  newEl.className = 'caas-preview';
  appEl.append(newEl);

  new ConsonantCardCollection(getConfig(state), newEl);
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANGE':
    case 'INPUT_CHANGE':
    case 'MULTI_SELECT_CHANGE':
      return { ...state, [action.prop]: action.value };
      break;
    default:
      console.log('DEFAULT');
      return state;
  }
};

const setUrlState = (state) => {
  const urlParams = new URLSearchParams();
  urlParams.set('config', utf8_to_b64(JSON.stringify(state)));
  setQueryStringWithoutPageReload(urlParams.toString());
};

const Configurator = () => {
  const [state, dispatch] = useReducer(reducer, getUrlConfig() || defaultState);

  useEffect(() => {
    window.addEventListener(EVENT_CAAS_SCRIPT_LOADED, () => {
      setUrlState(state);
      updateCollection(state);
    });
  }, []);

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

  return html`
        <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
            <${Accordion} items=${panels} />
        </ConfiguratorContext.Provider>
        `;
};

export default async function init(el) {
  loadStyle('/libs/ui/page/page.css');
  const title = el.querySelector('h1, h2, h3, h4, h5, h6, p').textContent;

  const app = html`
    <div class=tool-header>
      <div class=tool-title><h1>${title}</h1></div>
      <button class=copy>Copy</button>
    </div>
    <div class=tool-content>
      <div class=config-panel>
        <${Configurator} />
      </div>
      <div class=content-panel>
      <div id="caas" class="caas-preview"></div>
      </div>
    </div>
  `;

  render(app, el);
}
