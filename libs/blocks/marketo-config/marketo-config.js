import { html, render, useContext, useState, useEffect, useRef } from '../../deps/htm-preact.js';
import { loadStyle, loadBlock, createTag } from '../../utils/utils.js';
import { Input, Select, CopyBtn } from './components.js'
import { ConfiguratorContext, ConfiguratorProvider, stateReform, saveStateToLocalStorage } from './context.js';
import Accordion from '../../ui/controls/Accordion.js';
import { utf8ToB64 } from '../../utils/utils.js';

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
  console.log('defaultState', defaultState);
  return defaultState;
};

const getFields = (fieldsData, state, onChange) => {
  return fieldsData.map((field) => {
    const prop = field.prop.toLowerCase();
    const value = state?.[prop];

    if (!field.options) {
      return html`
        <${Input} label=${field.label} prop=${prop} description=${field.description} type="text" value=${value} onChange=${(value) => onChange('INPUT_CHANGE', prop, value)} />
      `;
    }
    let options = {};
    try {
      options = JSON.parse(field.options);
    } catch {

      const keyValuePairs = field.options.split(',').map((item) => {
        const [key, value] = item.trim().split(':');
        return [key.trim(), (value || key).trim()];
      });
      options = Object.fromEntries(keyValuePairs);
    }

    if (typeof options !== 'object') {
      options = { [field.options]: field.options };
    }

    return html`
    <${Select} label=${field.label} prop=${prop} options=${options} description=${field.description} value=${value} onChange=${(value) => onChange('SELECT_CHANGE', prop, value)} />
    `;
  });
};

const getPanels = (panelsData, state, onChange) => {
  return panelsData[':names']?.sort().map(panelName => {
    const panelData = panelsData[panelName];
    return {
      title: panelName.charAt(0).toUpperCase() + panelName.slice(1),
      content: html`${getFields(panelData.data, state, onChange)}`,
    };
  });
};

const TabsComponent = ({ items }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      initTabs(ref.current, items);
    }
  }, [items]);

  return html`<div class='tabs' ref=${ref} />`;
};

const Configurator = ({ title, panelsData, lsKey, block }) => {
  const context = useContext(ConfiguratorContext);
  const [panels, setPanels] = useState([]);
  const { state } = context;

  const onChange = (type, prop, value) => {
    context.dispatch({
      type,
      prop,
      value,
    });
  };

  useEffect(() => {
    const linkBlock = createTag('a', { class: block, href: getUrl() }, getUrl());
    const blockEl = document.getElementsByClassName(block)[0];
    blockEl.replaceWith(linkBlock);
    loadBlock(linkBlock);
    setPanels(getPanels(panelsData, state, onChange));
    saveStateToLocalStorage(state, lsKey);
  }, [panelsData, state]);

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
  const [defaults, setDefaults] = useState([]);
  const [panelsData, setPanelsData] = useState({});
  const blockName = block.toLowerCase()
  const title = `${block} Configurator`;
  const lsKey = `${block.toLowerCase()}ConfiguratorState`;

  useEffect(() => {
    fetchData(link)
      .then((json) => {
        setPanelsData(json);
        setDefaults(getDefaults(json));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return html`
  <${ConfiguratorProvider} defaultState=${defaults} lsKey=${lsKey}>
    <${Configurator} title=${title} panelsData=${panelsData} lsKey=${lsKey} block=${blockName} />
  </${ConfiguratorProvider}>
  `;
};

export default async function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const block = children[0].textContent.trim();
  const link = children[1].querySelector('a[href$="json"]').href;

  const app = html`<${ConfiguratorWrapper} block=${block} link=${link} />`;
  render(app, el);
}
