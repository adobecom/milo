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
  return Object.values(panelsData).reduce((defaultState, panelConfig) => {
    panelConfig.forEach(field => {
      if (field?.prop) {
        const { prop, default: defaultValue = '' } = field;
        defaultState[prop] = defaultValue;
      }
    });
    return defaultState;
  }, {});
};

const cleanPanelData = (data) => {
  data.forEach(field => {
    if (field?.prop) {
      field.prop = field.prop.toLowerCase();
    }
    if (field.required) {
      field.required = field.required.toLowerCase();
    }
  });
  return data;
}

const getConfigOptions = (json) => {
  if (json[':names'].includes('metadata')) {
    return json['metadata'].data.reduce((sheets, column) => {
      const sheetName = column['sheet'] ?? column['Sheet'];
      const sheetTitle = column['title'] ?? column['Title'];

      sheets[sheetTitle] = json[sheetName.replace('helix-', '')].data;
      return sheets;
    }, {});
  } else {
    return json[':names'].sort().reduce((sheets, sheetName) => {
      sheets[sheetName] = json[sheetName].data;
      return sheets;
    }, {});
  }
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
    const prop = field.prop;
    const value = state?.[prop];
    const required = field.required === 'yes';

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

const validateState = (state, panelsData) => {
  let validatedState = {};

  Object.values(panelsData).forEach(panelConfig => {
    panelConfig.forEach(field => {
      if (field?.prop) {
        const key = field.prop;
        if (key in state) {
          validatedState[key] = state[key];
        }
      }
    });
  });

  return validatedState;
};

const getPanels = (panelsData) => {
  return Object.entries(panelsData).map(([panelName, panelConfig]) => ({
    title: panelName.charAt(0).toUpperCase() + panelName.slice(1),
    content: html`<${Fields} fieldsData=${panelConfig} />`,
  }));
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
    const invalidInputs = document.querySelectorAll('.input-invalid');
    const hasInputsValid = invalidInputs.length === 0;

    invalidInputs.forEach((input) => {
      const requiredPanel = input.closest('.accordion-item');
      const requiredPanelExpandButton = requiredPanel.querySelector('button[aria-label=Expand]');
      if (requiredPanelExpandButton) {
        requiredPanelExpandButton.click();
      }
      input.focus();
    });

    return hasInputsValid;
  };

  useEffect(() => {
    const validatedState = validateState(state, panelsData);
    setPreferences(validatedState);
    saveStateToLocalStorage(validatedState, lsKey);
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
        <${Accordion} lskey=${lsKey} items=${panels} alwaysOpen=${true} />
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
        Object.values(config).forEach(panelData => {
          cleanPanelData(panelData);
        });
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

  const defaults = getDefaultStates(data);

  return html`
  <${ConfiguratorProvider} defaultState=${defaults} lsKey=${lsKey}>
    <${Configurator} title=${title} panelsData=${data} lsKey=${lsKey} />
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
