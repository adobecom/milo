import { html, render, useContext, useState, useEffect } from '../../deps/htm-preact.js';
import { utf8ToB64, loadBlock, createTag } from '../../utils/utils.js';
import { setPreferences } from '../marketo/marketo.js';
import { ConfiguratorContext, ConfiguratorProvider, saveStateToLocalStorage } from './context.js';
import Accordion from '../../ui/controls/Accordion.js';
import CopyBtn from '../../ui/controls/CopyBtn.js';
import { Input, Select } from '../../ui/controls/formControls.js';

async function fetchData(url) {
  const resp = await fetch(url.toLowerCase());

  if (!resp.ok) throw new Error('Network error');

  const json = await resp.json();
  return json;
}

export const getDefaultStates = (panels) => Object.values(panels).reduce((defaults, panel) => {
  panel.forEach(({ prop, default: defaultValue = '' }) => {
    if (prop) defaults[prop] = defaultValue;
  });
  return defaults;
}, {});

export const cleanPanelData = (data) => {
  data.forEach((field) => {
    if (field.prop) {
      field.prop = field.prop.toLowerCase();
    }
    if (field.required) {
      field.required = field.required.toLowerCase();
    }
  });
  return data;
};

export const getConfigOptions = (json) => {
  if (json[':names'].includes('metadata')) {
    return json.metadata.data.reduce((sheets, column) => {
      const sheetName = column.sheet ?? column.Sheet;
      const sheetTitle = column.title ?? column.Title;

      sheets[sheetTitle] = json[sheetName.replace('helix-', '')].data;
      return sheets;
    }, {});
  }
  /* c8 ignore next 4 */
  return json[':names'].sort().reduce((sheets, sheetName) => {
    sheets[sheetName] = json[sheetName].data;
    return sheets;
  }, {});
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
    const { prop } = field;
    const value = state?.[prop];
    const required = field.required === 'yes';

    if (!field.options) {
      return html`
        <${Input} label=${field.label} name=${prop} tooltip=${field.description} type="text" value=${value} onChange=${(newValue) => onChange(prop, newValue)} isRequired=${required} />
      `;
    }

    let options = {};
    try {
      options = JSON.parse(field.options);
    } catch {
      const keyValuePairs = field.options.split(',').map((item) => {
        const [key, val] = item.trim().split(':');
        return key.trim() ? [key.trim(), `${(val || key).trim()}`] : ['', 'Choose an option...'];
      });
      options = Object.fromEntries(keyValuePairs);
    }

    return html`
      <${Select} label=${field.label} name=${prop} options=${options} tooltip=${field.description} value=${value} onChange=${(newValue) => onChange(prop, newValue)} isRequired=${required} />
    `;
  });
};

const validateState = (state, panelsData) => {
  const validatedState = {};

  Object.values(panelsData).forEach((panelConfig) => {
    panelConfig.forEach((field) => {
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

const AdvancedPanel = (lsKey) => {
  const { dispatch } = useContext(ConfiguratorContext);
  const onClick = () => {
    const firstPanel = document.querySelector('.accordion-item button[aria-label=Expand]');

    localStorage.removeItem(lsKey);
    dispatch({ type: 'RESET_STATE' });
    firstPanel.click();
  };

  return html`
    <button class="resetToDefaultState" onClick=${onClick}>Reset to default state</button>
  `;
};

const getPanels = (panelsData, lsKey) => {
  const panels = Object.entries(panelsData).map(([panelName, panelConfig]) => ({
    title: panelName.substring(0, 1).toUpperCase() + panelName.substring(1),
    content: html`<${Fields} fieldsData=${panelConfig} />`,
  }));

  panels.push({
    title: 'Advanced',
    content: html`<${AdvancedPanel} lskey=${lsKey}/>`,
  });

  return panels;
};

const Configurator = ({ title, blockClass, panelsData, lsKey }) => {
  const { state } = useContext(ConfiguratorContext);
  const panels = getPanels(panelsData);

  const getUrl = () => {
    const url = window.location.href.split('#')[0];
    return `${url}#${utf8ToB64(JSON.stringify(state))}`;
  };

  const configFormValidation = () => {
    const invalidInputs = document.querySelectorAll('.input-invalid');
    const hasInputsValid = invalidInputs.length === 0;

    invalidInputs.forEach((input) => {
      const requiredPanel = input.closest('.accordion-item');
      const requiredPanelExpandButton = requiredPanel.querySelector('button[aria-label=Expand]');
      /* c8 ignore next 3 */
      if (requiredPanelExpandButton) {
        requiredPanelExpandButton.click();
      }
      input.focus();
    });

    return hasInputsValid;
  };

  const getContent = () => {
    const url = getUrl();
    const dateStr = new Date().toLocaleString('us-EN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    return {
      content: url,
      contentHtml: `<a href=${url}>${title} Configurator ${dateStr}</a>`,
    };
  };

  useEffect(() => {
    const validatedState = validateState(state, panelsData);
    setPreferences(validatedState);
    saveStateToLocalStorage(validatedState, lsKey);
  }, [state]);

  useEffect(() => {
    const url = getUrl();
    const blockLink = createTag('a', { href: url }, url);
    const blockContent = createTag('div', {}, blockLink);
    const newBlockEl = createTag('div', { class: blockClass }, blockContent);
    const contentEl = document.querySelector('.content-panel');
    contentEl.append(newBlockEl);
    loadBlock(newBlockEl);
  }, []);

  return html`
    <div class="tool-header">
      <div class="tool-title">
        <h1>${title} Configurator</h1>
      </div>
      <${CopyBtn} getContent=${getContent} configFormValidation=${configFormValidation} />
    </div>
    <div class="tool-content">
      <div class="config-panel">
        <${Accordion} lskey=${lsKey} items=${panels} alwaysOpen=${false} />
      </div>
      <div class="content-panel">
      </div>
    </div>
  `;
};

const ConfiguratorWrapper = ({ title, link }) => {
  const blockClass = 'marketo';
  const lsKey = `${title.toLowerCase().replace(' ', '-')}-ConfiguratorState`;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchData(link)
      .then((json) => {
        const config = getConfigOptions(json);
        Object.values(config).forEach((panelData) => {
          cleanPanelData(panelData);
        });
        setData(config);
      })
      .catch((error) => {
        setErrorMessage(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [link]);

  if (loading) {
    return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title} Configurator</h1>
        </div>
      </div>
      <div class="tool-content">
        <div class="loading">Loading Configurator...</div>
      </div>
    `;
  }

  if (errorMessage) {
    return html`
      <div class="tool-header">
        <div class="tool-title">
          <h1>${title}</h1>
        </div>
      </div>
      <div class="tool-content">
        <div class="error">Error: ${errorMessage.message}</div>
      </div>
    `;
  }

  const defaults = getDefaultStates(data);

  return html`
  <${ConfiguratorProvider} defaultState=${defaults} lsKey=${lsKey}>
    <${Configurator} title=${title} blockClass=${blockClass} panelsData=${data} lsKey=${lsKey} />
  </${ConfiguratorProvider}>
  `;
};

export default async function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const title = children[0].textContent.trim();
  const linkElement = children[1].querySelector('a[href$="json"]');
  const link = linkElement?.href;

  const app = html`
    <${ConfiguratorWrapper} title=${title} link=${link} />
  `;

  render(app, el);
}
