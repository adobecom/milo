import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';
import { faasHostUrl, defaultState, initFaas, loadFaasFiles } from '../faas/utils.js';
import { loadStyle, getHashConfig, utf8ToB64 } from '../../utils/utils.js';
import Accordion from '../../ui/controls/Accordion.js';
import MultiField from '../../ui/controls/MultiField.js';
import { Input as FormInput } from '../../ui/controls/formControls.js';

let faasEl;
const LS_KEY = 'faasConfiguratorState';
const faasFilesLoaded = loadFaasFiles();
const ConfiguratorContext = createContext('faas');
const langOptions = {};
const sortObjects = (obj) => Object.entries(obj).sort((a, b) => {
  const x = a[1].toLowerCase();
  const y = b[1].toLowerCase();
  // eslint-disable-next-line no-nested-ternary
  return x < y ? -1 : x > y ? 1 : 0;
});

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
const getObjFromAPI = async (apiPath) => {
  const resp = await fetch(`${faasHostUrl}${apiPath}`);
  if (resp.ok) {
    const json = await resp.json();
    return json;
  }
  return false;
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

const CopyBtn = () => {
  const { state } = useContext(ConfiguratorContext);
  const [isError, setIsError] = useState();
  const [isSuccess, setIsSuccess] = useState();
  const [errorMessage, setErrorMessage] = useState('Failed to Copy.');

  // debug
  const [configUrl, setConfigUrl] = useState('');

  const setStatus = (setFn, status = true) => {
    setFn(status);
    setTimeout(() => {
      setFn(!status);
    }, 2000);
  };

  const configFormValidation = () => {
    let inputValuesFilled = true;
    const inputs = document.querySelectorAll('#ai_Required select, #ai_Required input');
    const requiredPanelExpandButton = document.querySelector('#ai_Required button[aria-label=Expand]');
    inputs.forEach((input) => {
      if (!input.value) {
        inputValuesFilled = false;
        if (requiredPanelExpandButton) {
          requiredPanelExpandButton.click();
        }
        input.focus();
      }
    });
    return inputValuesFilled;
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
    if (!configFormValidation()) {
      setErrorMessage('Required fields must be filled');
      setStatus(setIsError);
      return;
    }

    const formTemplate = document.getElementById('id').options[document.getElementById('id').selectedIndex].text;
    const link = document.createElement('a');
    link.href = getUrl();
    link.textContent = `Form as a Service - ${formTemplate}`;

    const blob = new Blob([link.outerHTML], { type: 'text/html' });
    // eslint-disable-next-line no-undef
    const data = [new ClipboardItem({ [blob.type]: blob })];
    navigator.clipboard.write(data)
      .then(() => {
        setStatus(setIsSuccess);
        setErrorMessage('Failed to copy.');
      }, () => {
        setStatus(setIsError);
      });
  };

  return html`
  <textarea class=${!navigator?.clipboard ? '' : 'hide'}>${configUrl}</textarea>
  <button
    class="copy-config"
    onClick=${copyConfig}>Copy</button>
  <div class="copy-message ${isError === true ? 'is-error' : ''} ${isSuccess === true ? 'is-success' : ''}">
    <div class="success-message">Copied to clipboard!</div>
    <div class="error-message">${errorMessage}</div>
  </div>`;
};

const Select = ({ label, options, prop, onChange, sort }) => {
  const context = useContext(ConfiguratorContext);
  const onSelectChange = (e) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop,
      value: e.target.value,
    });
    if (typeof onChange === 'function') {
      onChange();
    }
  };
  const optionsArray = sort ? sortObjects(options) : Object.entries(options);
  return html`
      <div class="field">
        <label for=${prop}>${label}</label>
        <select id=${prop} value=${context.state[prop]} onChange=${onSelectChange}>
          ${optionsArray.map(([v, l]) => html`<option value="${v}">${l}</option>`)}
        </select>
      </div>
    `;
};
const Input = ({ label, type = 'text', prop, placeholder }) => {
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
      <input type=${type} id=${prop} name=${prop} ...${value} placeholder=${placeholder} onChange=${onInputChange} />
    </div>`;
};

const RequiredPanel = () => {
  const [templateOptions, setTemplateOptions] = useState({});
  const context = useContext(ConfiguratorContext);
  const [fieldLanguage, setFieldLanguage] = useState('');
  const [field92, setField92] = useState('');
  const [field93, setField93] = useState('');
  const [field94, setField94] = useState('');
  const [field149, setField149] = useState('');
  const [field172, setField172] = useState('');
  const [field103, setField103] = useState('');
  const [fieldMultiCampStyle, setFieldMultiCampStyle] = useState('');
  const [fieldpjs36, setFieldpjs36] = useState('');

  const buildOptionsFromApi = (obj) => {
    const results = {};
    obj.forEach((o) => {
      results[o.id] = o.displayText.phrase;
    });
    return results;
  };

  const onCampaignIDChange = (values) => {
    context.dispatch({
      type: 'SELECT_CHANGE',
      prop: 'q103',
      value: values,
    });
  };

  if (!Object.keys(langOptions).length) {
    useEffect(() => {
      getObjFromAPI('/faas/api/locale').then((data) => {
        data.forEach((l) => {
          langOptions[l.code] = l.name;
        });
        setFieldLanguage(html`<${Select} label="Form Language" prop="l" options=${langOptions} />`);
      });
    });
  }

  useEffect(() => {
    const options = {};
    getObjFromAPI('/faas/api/form?active=1&tags=adobe.com,RFI').then((data) => {
      data.forEach((d) => {
        options[d.id] = d.name;
      });
      setTemplateOptions(options);
    });
    const formTypeSelectValue = document.getElementById('id') ? document.getElementById('id').value : null;
    const initialState = getInitialState();
    const formId = formTypeSelectValue || (initialState ? initialState.id : '40');
    getObjFromAPI(`/faas/api/form/${formId}`).then((data) => {
      let isMultipleCampaign = false;
      data.formQuestions.forEach((d) => {
        // Form Type
        if (d.question.id === '92') {
          setField92(html`
          <${Select}
            label="${d.question.name}"
            prop="pjs${d.question.id}"
            options=${buildOptionsFromApi(d.question.collection.collectionValues)}
            sort="true" />`);
        }
        // Form Subtype
        if (d.question.id === '93') {
          setField93(html`
          <${Select}
            label="${d.question.name}"
            prop="pjs${d.question.id}"
            options=${buildOptionsFromApi(d.question.collection.collectionValues)}
            sort="true" />`);
        }
        // Primary Product Interest
        if (d.question.id === '94') {
          setField94(html`
          <${Select}
            label="${d.question.name}"
            prop="pjs${d.question.id}"
            options=${buildOptionsFromApi(d.question.collection.collectionValues)}
            sort="true" />`);
        }
        // b2bpartners
        if (d.question.id === '149') {
          setField149(html`
          <${Input} label="Name(s) of B2B Partner(s)"
          prop="${d.question.id}"
          placeholder="Comma separated list e.g. Microsoft, SAP" />`);
        }
        // Last Asset
        if (d.question.id === '172') {
          setField172(html`<${Input} label="Last Asset" prop="${d.question.id}" placeholder="Simple string of last Asset" />`);
        }
        // Multiple Campaign Ids
        if (d.question.id === '103') {
          isMultipleCampaign = true;
          const internalCampIDs = html`
            <${MultiField}
            onChange=${onCampaignIDChange}
            values=${context.state.q103}
            title="Multiple Campaign Ids"
            >
              <${FormInput} name="v" label="Campagin ID" />
              <${FormInput} name="l" label="Description" />
            <//>`;
          setField103(internalCampIDs);
          setFieldMultiCampStyle(html`<${Input} label="Multi Campaign Radio Styling" prop="multicampaignradiostyle" type="checkbox" />`);
        }
      });
      if (!isMultipleCampaign) {
        setFieldpjs36(html`<${Input} label="Internal Campagin ID" prop="pjs36" placeholder="ex) 70114000002XYvIAAW" />`);
      }
      // eslint-disable-next-line no-use-before-define
    }).catch((err) => {
      console.log('Could not load additonal Form Template options from FaaS.', err);
    });
  }, []);

  const templateSelected = '';
  return html`
  <${Select} label="Form Template" prop="id" options=${templateOptions} sort="true" onChange=${templateSelected} />
  ${fieldLanguage}
  ${field92}
  ${field93}
  ${field94}
  ${field149}
  ${field172}
  <${Input} label="Destination URL" prop="d" />
  ${field103}
  ${fieldMultiCampStyle}
  ${fieldpjs36}
`;
};
const OptionalPanel = () => html`
  <${Input} label="Form Title" prop="title" />
  <${Input} label="Onsite Campagin ID" prop="pjs39" />
  <${Input} label="Hide Prepopulated Fields" prop="hidePrepopulated" type="checkbox" />
  <${Input} label="Auto Submit" prop="as" type="checkbox" />
  <${Input} label="Auto Response" prop="ar" type="checkbox" />
  <${Input} label="Form is a Gate" prop="isGate" type="checkbox" />
`;
const PrepopulationPanel = () => html`
  <${Input} label="Custom JavaScript" prop="pc1" type="checkbox" />
  <${Input} label="Faas Submissions" prop="pc2" type="checkbox" />
  <${Input} label="SFDC" prop="pc3" type="checkbox" />
  <${Input} label="Demandbase" prop="pc4" type="checkbox" />
  <${Input} label="Clearbit (DX use Only)" prop="pc5" type="checkbox" />
`;
const StylePanel = () => html`
  <${Select} label="Background Theme" prop="style_backgroundTheme" options="${{ white: 'White', dark: 'Dark' }}" />
  <${Select} label="Layout" prop="style_layout" options="${{ column1: '1 Column', column2: '2 Columns' }}" />
  <${Select} label="Custom Theme" prop="style_customTheme" options="${{ none: 'None' }}" />
`;
const Configurator = ({ rootEl }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState() || defaultState);
  const [isFaasLoaded, setIsFaasLoaded] = useState(false);
  const [requiredPanel, setRequiredPanel] = useState(false);
  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p');

  useEffect(() => {
    faasFilesLoaded
      .then(() => {
        setIsFaasLoaded(true);
      })
      .catch((error) => {
        console.log('Error loading script: ', error);
      });
  }, []);

  useEffect(() => {
    if (isFaasLoaded) {
      initFaas(state, document.getElementsByClassName('faas')[0]);
      saveStateToLocalStorage(state);
    }
  }, [isFaasLoaded, state]);

  useEffect(() => {
    setRequiredPanel(html`<${RequiredPanel}/>`);
  }, [isFaasLoaded, state]);

  const panels = [{
    title: 'Required',
    content: requiredPanel,
  },
  {
    title: 'Optional',
    content: html`<${OptionalPanel} />`,
  },
  {
    title: 'Prepopulation',
    content: html`<${PrepopulationPanel} />`,
  },
  {
    title: 'Style',
    content: html`<${StylePanel} />`,
  }];
  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title ? title.textContent : 'FaaS Configurator'}</h1>
        </div>
        <${CopyBtn} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=faasconfig items=${panels} alwaysOpen=${false} />
        </div>
        <div class="content-panel">
          <div class="block faas"></div>
        </div>
      </div>
    </ConfiguratorContext.Provider>`;
};

export default async function init(el) {
  faasEl = el;
  loadStyle('/libs/ui/page/page.css');
  const app = html`<${Configurator} rootEl=${el} />`;
  render(app, el);
}
