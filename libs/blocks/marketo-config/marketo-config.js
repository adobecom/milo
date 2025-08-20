/* eslint-disable react-hooks/exhaustive-deps */
import { html, render, useContext, useState, useEffect } from '../../deps/htm-preact.js';
import { utf8ToB64, loadBlock, createTag } from '../../utils/utils.js';
import { ConfiguratorContext, ConfiguratorProvider, saveStateToLocalStorage, loadStateFromLocalStorage } from './context.js';
import Accordion from '../../ui/controls/Accordion.js';
import CopyBtn from '../../ui/controls/CopyBtn.js';
import { Input, Select } from '../../ui/controls/formControls.js';
import StepPanel from './step-panel.js';

const CONFIG_URL = 'https://milo.adobe.com/tools/marketo';

const TEMPLATE_RULE_MAPPING = {
  formVersion: 'form.id',
  formSuccessType: 'form.success.type',
  purpose: 'form.subtype',
  field_visibility: 'field_visibility',
  field_filters: 'field_filters',
};

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

  const stepPreferences = state['form.fldStepPref'] || {};
  const count = Object.values(stepPreferences).findLastIndex((fields) => fields?.length) + 1 || 1;

  if (count > 1) {
    validatedState['form.fldStepPref'] = stepPreferences;
  }

  return validatedState;
};

const AdvancedPanel = ({ lsKey }) => {
  const { state, dispatch } = useContext(ConfiguratorContext);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const windowUrl = new URL(window.location.href);
  const isPreview = windowUrl.searchParams.get('preview') === '1';
  const currentLocale = windowUrl.searchParams.get('lang');
  const localeIndex = supportedLanguages.findIndex((lang) => lang === currentLocale);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'supportedLanguages' && event.data.data) {
        setSupportedLanguages(event.data.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const onClick = () => {
    const firstPanel = document.querySelector('.accordion-item button[aria-label=Expand]');

    localStorage.removeItem(lsKey);
    dispatch({ type: 'RESET_STATE' });
    saveStateToLocalStorage(state, lsKey);
    firstPanel.click();
  };

  const debugState = () => {
    // eslint-disable-next-line no-console
    console.log('Configuration:', JSON.stringify(state, null, 2));
  };

  const togglePreview = () => {
    if (isPreview) {
      windowUrl.searchParams.delete('preview');
    } else {
      windowUrl.searchParams.set('preview', '1');
    }
    window.location.href = windowUrl.toString();
  };

  const changeLocale = (locale) => {
    if (supportedLanguages[locale] === 'en_us') {
      windowUrl.searchParams.delete('lang');
    } else {
      windowUrl.searchParams.set('lang', supportedLanguages[locale]);
    }
    window.location.href = windowUrl.toString();
  };

  return html`
    <button class="resetToDefaultState" onClick=${onClick}>Reset to default state</button>
    <div class="debug-settings">
      <button class="debug" onClick=${debugState}>Debug State</button>
      <button role="switch" aria-checked=${isPreview} class="preview ${isPreview ? ' active' : ''}" onClick=${togglePreview}>Toggle Console Preview</button>
    </div>
    <${Select} label="Test Language" name="lang" options=${supportedLanguages} value=${localeIndex > -1 ? localeIndex : 0} onChange=${changeLocale} />
  `;
};

const getPanels = (panelsData, lsKey) => {
  const panels = Object.entries(panelsData).map(([panelName, panelConfig]) => ({
    title: panelName.substring(0, 1).toUpperCase() + panelName.substring(1),
    content: html`<${Fields} fieldsData=${panelConfig} />`,
  }));

  panels.push({
    title: 'Multi-Step',
    content: html`<${StepPanel} />`,
  });
  panels.push({
    title: 'Advanced',
    content: html`<${AdvancedPanel} lsKey=${lsKey}/>`,
  });

  return panels;
};

const getDataUrl = (state) => `${CONFIG_URL}#${utf8ToB64(JSON.stringify(state))}`;

const Configurator = ({ title, panelsData, lsKey }) => {
  const { dispatch, state } = useContext(ConfiguratorContext);
  const panels = getPanels(panelsData, lsKey);
  const [templateRules, setTemplateRules] = useState([]);

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
    const validatedState = validateState(state, panelsData);
    const url = getDataUrl(validatedState);
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
    const contentEl = document.querySelector('.content-panel');
    const validatedState = validateState(state, panelsData);
    const url = window.location.href.split(/#|\?/)[0];
    const isPreview = window.location.href.includes('preview=1');
    const iframe = createTag('iframe', { src: url + (isPreview ? '?preview=1' : '') });

    saveStateToLocalStorage(validatedState, lsKey);
    contentEl.replaceChildren(iframe);
  }, [state]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'templateRules' && event.data.data) {
        setTemplateRules(event.data.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const extractRuleValue = (rule) => rule?.[0]?.split(':')?.[0] || '';
    const applyRulesToState = (rules) => {
      Object.entries(TEMPLATE_RULE_MAPPING).forEach(([key, prop]) => {
        const value = rules[key];
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            dispatch({ type: 'SET_VALUE', prop: `${prop}.${subKey}`, value: extractRuleValue(subValue) });
          });
          return;
        }
        dispatch({ type: 'SET_VALUE', prop, value: extractRuleValue(value) });
      });
    };

    const formTemplate = state['form.template'];
    if (!formTemplate || !templateRules || templateRules.length === 0) return;

    const selectedRules = templateRules.find((t) => t[formTemplate])?.[formTemplate];
    if (!selectedRules || Object.keys(selectedRules).length === 0) return;

    applyRulesToState(selectedRules);
  }, [state['form.template'], state.reset]);

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
    <${Configurator} title=${title} panelsData=${data} lsKey=${lsKey} />
  </${ConfiguratorProvider}>
  `;
};

function createDataBlock(blockClass, data) {
  const url = getDataUrl(data);
  const link = createTag('a', { href: url }, url);
  const row = createTag('div', null, link);
  const block = createTag('div', { class: blockClass }, row);

  return block;
}

export default async function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const title = children[0].textContent.trim();
  const linkElement = children[1].querySelector('a[href$="json"]');
  const link = linkElement?.href;
  // If the block is loaded in an iframe, replace it with the block itself
  if (window.self !== window.top) {
    const lsKey = `${title.toLowerCase().replace(' ', '-')}-ConfiguratorState`;
    const state = loadStateFromLocalStorage(lsKey);
    const marketoBlock = createDataBlock('marketo', state);

    el.replaceWith(marketoBlock);
    await loadBlock(marketoBlock);

    const postMarketoRules = () => {
      if (window?.MktoForms2) {
        window.MktoForms2.whenReady(() => {
          window.parent.postMessage({ type: 'templateRules', data: window.templateRules }, '*');
          window.parent.postMessage({ type: 'supportedLanguages', data: window.SUPPORTED_LANGUAGES }, '*');
        });
      } else {
        setTimeout(postMarketoRules, 100);
      }
    };
    postMarketoRules();
    return;
  }
  el.innerHTML = '';

  const app = html`
    <${ConfiguratorWrapper} title=${title} link=${link} />
  `;

  render(app, el);
}
