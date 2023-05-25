import { html, render, useContext, useState, useEffect } from '../../deps/htm-preact.js';
import { loadStyle, loadBlock, createTag, utf8ToB64 } from '../../utils/utils.js';
import { setPreferences } from '../marketo/marketo.js';
import Preview from './MarketoPreview.js'
import { ConfiguratorContext, ConfiguratorProvider, stateReform, saveStateToLocalStorage } from './context.js';
import Accordion from '../../ui/controls/Accordion.js';
import CopyBtn from '../../ui/controls/CopyBtn.js';
import { Input, Select } from '../../ui/controls/formControls.js';

export async function fetchData(url) {
  const resp = await fetch(url.toLowerCase());

  if (!resp.ok) return {};

  const json = await resp.json();
  return json;
}

const getDefaults = (panelsData) => {
  let defaultState = {};

  panelsData[':names'].forEach(panelName => {
    const panelData = panelsData[panelName];
    panelData.data.forEach(field => {
      const prop = field.prop.toLowerCase();
      defaultState[prop] = field.default || '';
    });
  });
  return defaultState;
};

const getConfigOptions = (link) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(link)
      .then((json) => {
        setData({
          defaults: getDefaults(json),
          panelsData: json,
        });
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [link]);

  return { data, loading, error };
};

const Fields = ({ fieldsData }) => {
  const { state, dispatch } = useContext(ConfiguratorContext);

  const onChange = (prop, value) => {
    dispatch({
      type: 'SET_VALUE',
      prop,
      value,
    });
  };

  return fieldsData.map((field) => {
    const prop = field.prop.toLowerCase();
    const value = state?.[prop];

    if (!field.options) {
      return html`
        <${Input} label=${field.label} name=${prop} description=${field.description} type="text" value=${value} onChange=${(value) => onChange(prop, value)} />
      `;
    }

    let options = {};
    try {
      options = JSON.parse(field.options);
    } catch {
      const keyValuePairs = field.options.split(',').map((item) => {
        const [key, val] = item.trim().split(':');
        return key.trim() ? [key.trim(), `${(val || key).trim()} (${key.trim()})`] : ['', 'Choose an option...'];
      });
      options = Object.fromEntries(keyValuePairs);
    }

    if (typeof options !== 'object') {
      options = { [field.options]: field.options };
    }

    return html`
      <${Select} label=${field.label} name=${prop} options=${options} description=${field.description} value=${value} onChange=${(value) => onChange(prop, value)} />
    `;
  });
};


const getPanels = (panelsData) => {
  return panelsData[':names']?.sort().map(panelName => {
    const panelData = panelsData[panelName];
    return {
      title: panelName.charAt(0).toUpperCase() + panelName.slice(1),
      content: html`<${Fields} fieldsData=${panelData.data} />`,
    };
  });
};

const Configurator = ({ title, panelsData, lsKey, block }) => {
  const context = useContext(ConfiguratorContext);
  const { state } = context;

  const panels = getPanels(panelsData);

  const getUrl = () => {
    const url = window.location.href.split('#')[0];
    return `${url}#${utf8ToB64(JSON.stringify(stateReform(state)))}`;
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

  useEffect(() => {
    setPreferences(stateReform(state));
    saveStateToLocalStorage(state, lsKey);
  }, [state]);

  return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
        <${CopyBtn} getUrl=${getUrl} configFormValidation=${configFormValidation} />
      </div>
      <div class="tool-content">
        <div class="config-panel">
          <${Accordion} lskey=faasconfig items=${panels} alwaysOpen=${false} />
        </div>
      </div>`;
};

const ConfiguratorWrapper = ({ block, link }) => {
  const { data, loading, error } = getConfigOptions(link);
  const blockName = block.toLowerCase()
  const title = `${block} Configurator`;
  const lsKey = `${blockName}ConfiguratorState`;

  if (loading) {
    return html`<div>Loading Configurator...</div>`;
  }

  if (error) {
    return html`<div>Error: ${error.message}</div>`;
  }

  const { defaults, panelsData } = data;

  return html`
  <${ConfiguratorProvider} defaultState=${defaults} lsKey=${lsKey}>
    <${Configurator} title=${title} panelsData=${panelsData} lsKey=${lsKey} block=${blockName} />
  </${ConfiguratorProvider}>
  `;
};

export default async function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const block = children[0].textContent.trim();
  const linkElement = children[1].querySelector('a[href$="json"]');
  const link = linkElement.href;
  linkElement.style.display = 'none';

  const parentSection = el.closest('div.section');
  const previewSection = parentSection?.nextElementSibling;

  const app = html`
    <${ConfiguratorWrapper} block=${block} link=${link} />
    <${Preview} section=${previewSection} />
  `;
  render(app, el);
}
