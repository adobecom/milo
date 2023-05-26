import { html, render, useContext, useState, useEffect } from '../../deps/htm-preact.js';
import { utf8ToB64 } from '../../utils/utils.js';
import { setPreferences } from '../marketo/marketo.js';
import Preview from './MarketoPreview.js'
import { ConfiguratorContext, ConfiguratorProvider, stateReform, saveStateToLocalStorage } from './context.js';
import Accordion from '../../ui/controls/Accordion.js';
import CopyBtn from '../../ui/controls/CopyBtn.js';
import { Input, Select } from '../../ui/controls/formControls.js';

export async function fetchData(url) {
  const resp = await fetch(url.toLowerCase());

  if (!resp.ok) throw new Error("Network error");

  const json = await resp.json();
  return json;
}

const getDefaultStates = (panelsData) => {
  let defaultState = {};

  panelsData.forEach(panelConfig => {
    panelConfig.forEach(field => {
      if (field?.prop) {
        const { prop, default: defaultValue = '' } = field;
        defaultState[prop.toLowerCase()] = defaultValue;
      }
    });
  });

  return defaultState;
};

const getConfigOptions = (json) => {
  const sheets = new Map();

  if (json[':names'].includes('metadata')) {
    json['metadata'].data.map((column) => {
      const sheetName = column['sheet'] ?? column['Sheet'];
      const sheetTitle = column['title'] ?? column['Title'];

      sheets.set(sheetTitle, json[sheetName.replace('helix-', '')].data);
    });
  } else {
    json[':names'].sort().forEach(sheetName => {
      sheets.set(sheetName, json[sheetName].data);
    });
  }

  return {
    defaults: getDefaultStates(sheets),
    panelsData: sheets,
  };
}

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
    const required = field.required?.toLowerCase() == 'yes';

    if (!field.options) {
      return html`
        <${Input} label=${field.label} name=${prop} tooltip=${field.description} type="text" value=${value} onChange=${(value) => onChange(prop, value)} isRequired=${required} />
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
      <${Select} label=${field.label} name=${prop} options=${options} tooltip=${field.description} value=${value} onChange=${(value) => onChange(prop, value)} isRequired=${required} />
    `;
  });
};

const getPanels = (panelsData) => {
  const panels = [];

  panelsData.forEach((panelConfig, panelName) => {
    panels.push({
      title: panelName.charAt(0).toUpperCase() + panelName.slice(1),
      content: html`<${Fields} fieldsData=${panelConfig} />`,
    });
  });

  return panels;
};

const Configurator = ({ title, panelsData, lsKey }) => {
  const context = useContext(ConfiguratorContext);
  const { state } = context;

  const panels = getPanels(panelsData);

  const getUrl = () => {
    const url = window.location.href.split('#')[0];
    return `${url}#${utf8ToB64(JSON.stringify(stateReform(state)))}`;
  };

  const configFormValidation = () => {
    let inputValuesFilled = true;
    const testInputs = document.querySelectorAll('.input-invalid');
    testInputs.forEach((input) => {
      inputValuesFilled = false;
      const requiredPanel = input.closest('.accordion-item');
      const requiredPanelExpandButton = requiredPanel.querySelector('button[aria-label=Expand]');
      if (requiredPanelExpandButton) {
        requiredPanelExpandButton.click();
      }
      input.focus();
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
        <${Accordion} lskey=${lsKey} items=${panels} alwaysOpen=${false} />
      </div>
    </div>
  `;
};

const ConfiguratorWrapper = ({ block, link }) => {
  const blockName = block.toLowerCase()
  const title = `${block} Configurator`;
  const lsKey = `${blockName}ConfiguratorState`;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(link)
      .then((json) => {
        const config = getConfigOptions(json);
        setData(config);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [link]);

  if (loading) {
    return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
      </div>
      <div class="tool-content">
        <div>Loading Configurator...</div>
      </div>
    `;
  }

  if (error) {
    return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
      </div>
      <div class="tool-content">
        <div>Error: ${error.message}</div>
      </div>
    `;
  }

  const { defaults, panelsData } = data;

  return html`
  <${ConfiguratorProvider} defaultState=${defaults} lsKey=${lsKey}>
    <${Configurator} title=${title} panelsData=${panelsData} lsKey=${lsKey} />
  </${ConfiguratorProvider}>
  `;
};

export default async function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const block = children[0].textContent.trim();
  const linkElement = children[1].querySelector('a[href$="json"]');
  const link = linkElement.href;

  const parentSection = el.closest('div.section');
  const previewSection = parentSection?.nextElementSibling;

  const app = html`
    <${ConfiguratorWrapper} block=${block} link=${link} />
    <${Preview} section=${previewSection} />
  `;

  linkElement.style.display = 'none';
  render(app, el);
}
