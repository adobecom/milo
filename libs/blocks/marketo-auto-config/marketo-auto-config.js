import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';
import { loadMarketoForm } from '../marketo/marketo.js';
import { loadStyle, getHashConfig, utf8ToB64, getConfig } from '../../utils/utils.js';
import Accordion from '../../ui/controls/Accordion.js';

const LS_KEY = 'marketoFormConfiguratorState';
const ConfiguratorContext = createContext('marketoForm');
const { marketoBaseURL, marketoMunchkinID, marketoFormID } = getConfig();
const defaultState = {
  title: '',
  description: '',
  error_message: '',
  form_id: marketoFormID,
  base_url: marketoBaseURL,
  munchkin_id: marketoMunchkinID,
  destination_url: '',
  hidden_fields: '',
};

const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

const stateReform = (state) => {
  const newKeys = {};
  Object.keys(state).forEach(((k) => { newKeys[k] = k.replace('_', ' '); }));
  return renameKeys(state, newKeys);
};

const stateReformUndo = (state) => {
  const newKeys = {};
  Object.keys(state).forEach(((k) => { newKeys[k] = k.replace(' ', '_'); }));
  return renameKeys(state, newKeys);
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
  localStorage.setItem(LS_KEY, JSON.stringify(stateReformUndo(state)));
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
  const [showConfigUrl, setShowConfigUrl] = useState(false);

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
    const testInputs = document.querySelectorAll('#form_id, #base_url, #munchkin_id, #destination_url');
    const requiredPanelExpandButton = document.querySelector('#ai_Marketo_Form_Config_Fileds button[aria-label=Expand]');
    testInputs.forEach((input) => {
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
    return `${url}#${utf8ToB64(JSON.stringify(stateReform(state)))}`;
  };

  const copyConfig = () => {
    setConfigUrl(getUrl());
    if (!navigator?.clipboard) {
      setStatus(setIsError);
      setShowConfigUrl(false);
      return;
    }
    if (!configFormValidation()) {
      setErrorMessage('Required fields must be filled');
      setStatus(setIsError);
      setShowConfigUrl(false);
      return;
    }

    const linkTitle = document.getElementById('title').value;
    const formId = document.getElementById('form_id').value;
    const link = document.createElement('a');
    link.href = getUrl();
    link.textContent = `Marketo Form - ${linkTitle || formId}`;

    const blob = new Blob([link.outerHTML], { type: 'text/html' });
    // eslint-disable-next-line no-undef
    const data = [new ClipboardItem({ [blob.type]: blob })];
    navigator.clipboard.write(data)
      .then(() => {
        setStatus(setIsSuccess);
        setErrorMessage('Failed to copy.');
        setShowConfigUrl(true);
      }, () => {
        setStatus(setIsError);
        setShowConfigUrl(false);
      });
  };

  return html`
  <textarea class=${`config-url ${showConfigUrl ? '' : 'hide'}`}>${configUrl}</textarea>
  <button
    class="copy-config"
    onClick=${copyConfig}>Copy</button>
  <div class="copy-message ${isError === true ? 'is-error' : ''} ${isSuccess === true ? 'is-success' : ''}">
    <div class="success-message">Copied to clipboard!</div>
    <div class="error-message">${errorMessage}</div>
  </div>`;
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

  const value = { [type === 'checkbox' ? 'checked' : 'value']: (context.state[prop]) };
  return html` <div class="field">
      <label for=${prop}>${label}</label>
      <input type=${type} id=${prop} name=${prop} ...${value} placeholder=${placeholder} onChange=${onInputChange} />
    </div>`;
};

const FieldsPanel = () => html`
  <${Input} label="Title (Optional)" prop="title" />
  <${Input} label="Description (Optional)" prop="description" />
  <${Input} label="Error Message (Optional)" prop="error_message" />
  <${Input} label="Form ID*" prop="form_id" />
  <${Input} label="Base URL*" prop="base_url" />
  <${Input} label="Munchkin ID*" prop="munchkin_id" />
  <${Input} label="Destination URL*" prop="destination_url" />
  <${Input} label="Hidden Fields (Optional)" prop="hidden_fields" />
`;

const Configurator = ({ rootEl }) => {
  const [state, dispatch] = useReducer(reducer, getInitialState() || defaultState);
  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p');

  useEffect(() => {
    loadMarketoForm(document.querySelector('.marketo'), stateReform(state));
    saveStateToLocalStorage(state);
  }, [state]);

  const panels = [{
    title: 'Marketo Form Config Fileds',
    content: html`<${FieldsPanel}/>`,
  }];
  return html`
    <${ConfiguratorContext.Provider} value=${{ state, dispatch }}>
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title ? title.textContent : 'Marketo link block configurator'}</h1>
        </div>
        <${CopyBtn} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=marketoFormConfig items=${panels} alwaysOpen=${false} />
        </div>
        <div class="content-panel">
          <div class="block marketo"></div>
        </div>
      </div>
    </ConfiguratorContext.Provider>`;
};

export default async function init(el) {
  loadStyle('/libs/ui/page/page.css');
  loadStyle('/libs/blocks/marketo/marketo.css');
  const app = html`<${Configurator} rootEl=${el} />`;
  render(app, el);
}
