import {
  createContext,
  html,
  render,
  useContext,
  useEffect,
  useReducer,
  useState,
} from '../../deps/htm-preact.js';
import { loadStyle, getHashConfig, utf8ToB64 } from '../../utils/utils.js';
import { Accordion } from '../../ui/controls/controls.js';
// import { defaultState, initCaas, loadCaasFiles } from '../faas/utils.js';

let faasEl;
const sortObjects = (obj) => {
  return Object.entries(obj).sort((a, b) => {
    const x = a[1].toLowerCase();
    const y = b[1].toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
};
const ConfiguratorContext = createContext('milo');
const faasHostUrl = 'https://dev.apps.enterprise.adobe.com';
const getObjFromAPI = async (apiPath) => {
  const resp = await fetch(`${faasHostUrl}${apiPath}`);
  if (resp.ok) {
    return await resp.json();
  }
};
const initialState = 0;
const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CHANGE':
    case 'INPUT_CHANGE':
    case 'MULTI_SELECT_CHANGE':
      return {
        ...state, [action.prop]: action.value
      };
    default:
      console.log('DEFAULT');
      return state;
  }
};
const createCopy = (blob, message) => {
  const data = [new ClipboardItem({
    [blob.type]: blob
  })];
  navigator.clipboard.write(data).then(
    () => {
      message.className = 'success-message';
      message.innerText = 'FaaS Config is successfully copied to clipboard';
    },
    (err) => {
      message.className = 'error-message';
      message.innerText = 'Failed to copy.';
      console.log('failed to copy:', err);
    }
  );
};
const CopyBtn = () => {
  const {
    state
  } = useContext(ConfiguratorContext);
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
}
const Select = ({
  label,
  options,
  prop,
  onChange,
  sort
}) => {
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
        <select id=${prop} onChange=${onSelectChange}>
          ${optionsArray.map(
      ([val, label]) => html`<option value="${val}">${label}</option>`,
    )}
        </select>
      </div>
    `;
};
const Input = ({
  label,
  type = 'text',
  prop,
  placeholder
}) => {
  const context = useContext(ConfiguratorContext);

  const onInputChange = (e) => {
    context.dispatch({
      type: 'INPUT_CHANGE',
      prop,
      value: type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  return html` <div class="field">
      <label for=${prop}>${label}</label>
      <input type=${type} id=${prop} name=${prop} placeholder=${placeholder} onChange=${onInputChange} />
    </div>`;
};
const templateSelected = () => {
  const formId = document.getElementById('formTemplateId') ? document.getElementById('formTemplateId').value : '2';
  const renderFields = [];
  const buildOptionsFromApi = (obj) => {
    const results = {}
    obj.forEach((o) => {
      results[o.id] = o.displayText.phrase;
    });
    return results;
  }
  getObjFromAPI('/faas/api/locale').then((data) => {
    console.log(data);
    const langOptions = {};
    data.forEach((l) => {
      langOptions[l.code] = l.name;
    });
    renderFields.push(html`<${Select} label="Form Language" prop="l" options=${langOptions} />`);
  });
  getObjFromAPI(`/faas/api/form/${formId}`).then((data) => {

      data.formQuestions.forEach((d) => {
        // console.log(d.question);
        if (d.question.id === '92' || // Form Type
          d.question.id === '93' || // Form Subtype
          d.question.id === '94') { // Primary Product Interest
          renderFields.push(html`<${Select} label="${d.question.name}" prop="${d.question.id}" options=${buildOptionsFromApi(d.question.collection.collectionValues)} sort="true" />`);
        }
        if (d.question.id === '149') { // b2bpartners
          renderFields.push(html`<${Input} label="Name(s) of B2B Partner(s)" prop="${d.question.id}" placeholder="Simple string, or comma separated list e.g. Microsoft, SAP" />`);
        }
        if (d.question.id === '172') { // Last Asset
          renderFields.push(html`<${Input} label="Last Asset" prop="${d.question.id}" placeholder="Simple string of last Asset" />`);
        }
      });
      const app = html`
            <${Configurator} rootEl=${faasEl} renderFields=${renderFields} />
        `;
      render(app, faasEl);
    })
    .catch((err) => {
      console.log('Could not load additonal Form Template options from FaaS.', err);
    });
}
const templateOptions = {};
const RequiredPanel = ({
  renderFields
}) => html`
    <${Select} label="Form Template" prop="formTemplateId" options=${templateOptions} sort="true" onChange=${templateSelected} />
    ${renderFields}
    <${Input} label="Destination URL" prop="d" />
    <${Input} label="Internal Campagin ID" prop="36" placeholder="70114000002XYvIAAW" />
`;
const OptionalPanel = () => html`
    <${Input} label="Onsite Campagin ID" prop="39" />
    <${Input} label="Auto Submit" prop="as" type="checkbox" />
    <${Input} label="Auto Response" prop="ar" type="checkbox" />
`;
const PrepopulationPanel = () => html`
    <${Input} label="Custom JavaScript" prop="pc1" type="checkbox" />
    <${Input} label="Faas Submissions" prop="pc2" type="checkbox" />
    <${Input} label="SFDC" prop="pc3" type="checkbox" />
    <${Input} label="Demandbase" prop="pc4" type="checkbox" />
    <${Input} label="Clearbit (DX use Only)" prop="pc5" type="checkbox" />
`;
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
const Configurator = ({
  rootEl,
  renderFields
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const title = rootEl.querySelector('h1, h2, h3, h4, h5, h6, p');
  const panels = [{
      title: 'Required',
      content: html`<${RequiredPanel} renderFields=${renderFields} />`,
    },
    {
      title: 'Optional',
      content: html`<${OptionalPanel} />`,
    },
    {
      title: 'Prepopulation',
      content: html`<${PrepopulationPanel} />`,
    },
  ];
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
          <div id="faas" class="faas-preview"></div>
        </div>
      </div>
    </ConfiguratorContext.Provider>`;
};
export default async function init(el) {
  faasEl = el;
  loadStyle('/libs/ui/page/page.css');
  getObjFromAPI('/faas/api/form?active=1&tags=adobe.com,RFI').then((data) => {
    data.forEach((d) => {
      templateOptions[d.id] = d.name;
    });
    templateSelected();
  });
}

const temp = () => {

  const faasConfigForm = document.createElement('form');
  block.append(faasConfigForm);


  // form field build functions:
  const selectBuild = (formLabel, name, optionObj, optionValueKey, OptionTextKey, required = false) => {
    const formControl = document.createElement('div');
    formControl.classList.add('form-group');
    const label = document.createElement('label');
    label.innerHTML = `${formLabel}${required ? ' *' : ''}`;
    label.setAttribute('for', name);
    const select = document.createElement('select');
    select.id = name;
    select.name = name;
    select.required = required;
    optionObj.forEach((optionItem) => {
      const option = document.createElement('option');
      option.value = optionItem[optionValueKey];
      option.text = OptionTextKey === 'displayText' ? optionItem[OptionTextKey].phrase : optionItem[OptionTextKey];
      select.add(option);
    });
    formControl.append(label, select);
    return formControl;
  };
  const textInputBuild = (formLabel, name, placeholder = '', required = false) => {
    const formControl = document.createElement('div');
    formControl.classList.add('form-group');
    const label = document.createElement('label');
    label.innerHTML = `${formLabel}${required ? ' *' : ''}`;
    label.setAttribute('for', name);
    const input = document.createElement('input');
    input.id = name;
    input.name = name;
    input.placeholder = placeholder;
    input.required = required;
    formControl.append(label, input);
    return formControl;
  };
  const checkboxInputBuild = (formLabel, name, checked = false) => {
    const formControl = document.createElement('div');
    formControl.classList.add('form-group', 'd-flex');
    const label = document.createElement('label');
    label.innerHTML = `${formLabel}`;
    label.setAttribute('for', name);
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = name;
    input.name = name;
    input.checked = checked;
    formControl.append(input, label);
    return formControl;
  };
  const templateSelected = () => {
    getObjFromAPI(`/faas/api/form/${document.getElementById('id').value}`).then((data) => {
        // remove questions by template.
        ['92', '93', '94', '149'].forEach(id => document.getElementById(id) ? document.getElementById(id).parentElement.remove() : '');

        // reverse forEach of question for adding form element using after()
        data.formQuestions.reverse().forEach((d) => {
          // console.log(d.question);
          if (d.question.id === '92' || // Form Type
            d.question.id === '93' || // Form Subtype
            d.question.id === '94') { // Primary Product Interest
            document.getElementById('id').parentElement.after(selectBuild(d.question.name, d.question.id, d.question.collection.collectionValues, 'id', 'displayText', true))
          }
          if (d.question.id === '149') { // b2bpartners
            document.getElementById('id').parentElement.after(textInputBuild('Name(s) of B2B Partner(s)', d.question.id, 'Simple string, or comma separated list e.g. Microsoft, SAP'));
          }
          if (d.question.id === '172') { // Last Asset
            document.getElementById('id').parentElement.after(textInputBuild('Last Asset', d.question.id, 'Simple string of last Asset', true));
          }
        });
      })
      .catch(() => {
        console.log('Could not load additonal Form Template options from FaaS.');
      });
  }

  faasConfigForm.append(textInputBuild('Destination URL', 'd', 'https://www.adobe.com', true));
  faasConfigForm.append(textInputBuild('Internal Campagin ID', '36', '70114000002XYvIAAW', true));
  faasConfigForm.append(textInputBuild('Onsite Campagin ID', '39'));
  faasConfigForm.append(checkboxInputBuild('Auto Submit', 'as'));
  faasConfigForm.append(checkboxInputBuild('Auto Response', 'ar', true));
  faasConfigForm.append(checkboxInputBuild('Prepopulation: Custom JavaScript', 'pc1', true));
  faasConfigForm.append(checkboxInputBuild('Prepopulation: Faas Submissions', 'pc2', true));
  faasConfigForm.append(checkboxInputBuild('Prepopulation: SFDC', 'pc3', true));
  faasConfigForm.append(checkboxInputBuild('Prepopulation: Demandbase', 'pc4', true));
  faasConfigForm.append(checkboxInputBuild('Prepopulation: Clearbit (DX use Only)', 'pc5'));

  getObjFromAPI('/faas/api/locale').then(data => document.getElementById('as').parentElement.before(selectBuild('Form Language', 'l', data, 'code', 'name', true)));

  // set the copy button:
  const copyBtn = document.createElement('button');
  copyBtn.innerHTML = 'Copy FaaS Config';
  block.append(copyBtn);

  // Message:
  const message = document.createElement('p');
  message.className = 'error-message';
  block.append(message);

  // copy button click event:
  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // form validation:
    message.innerText = '';
    const requiredInput = Array.prototype.slice.call(faasConfigForm.querySelectorAll('*[required]'));
    let invalid = false;
    requiredInput.reverse().forEach((input) => {
      if (!input.value) {
        message.innerText = `"${input.parentElement.querySelector('label').innerText.replace('*','').trim()}" is required.`;
        input.focus();
        invalid = true;
        return;
      }
    });
    if (invalid) {
      return;
    }

    const getFormValue = (id) => {
      const el = document.getElementById(id);
      if (!el) {
        return '';
      }
      if (el.type === 'checkbox') {
        return el.checked;
      }
      return el.value;
    };
    // set the faasconf object from the form values:
    const pjs = {
      36: getFormValue('36'),
      39: getFormValue('39'),
      77: 1,
      78: 1,
      79: 1,
      90: 'FAAS',
      92: getFormValue('92'),
      93: getFormValue('93'),
      94: getFormValue('94'),
    };
    if (getFormValue('149')) {
      Object.assign(pjs, {
        149: getFormValue('149')
      });
    }
    if (getFormValue('172')) {
      Object.assign(pjs, {
        172: getFormValue('172')
      });
    }
    const faasconf = {
      id: getFormValue('id'),
      l: getFormValue('l'),
      d: getFormValue('d'),
      as: getFormValue('as'),
      ar: getFormValue('ar'),
      pc: {
        1: getFormValue('pc1') ? 'js' : '',
        2: getFormValue('pc2') ? 'faas_submission' : '',
        3: getFormValue('pc3') ? 'sfdc' : '',
        4: getFormValue('pc4') ? 'demandbase' : '',
        5: getFormValue('pc5') ? 'clearbit' : '',
      },
      q: {},
      p: {
        js: pjs,
      },
      e: {
        afterYiiLoadedCallback: () => {
          console.log('form loaded.');
        },
        afterSubmitCallback: (formData) => {
          console.log('submitted.', formData);
        },
      },
    };
    // console.log(faasconf);

    // set the copy link and copy the html to clipboard:
    const link = document.createElement('a');
    link.href = `https://main--milo--adobecom.hlx.page/tools/faas?config=${encodeConfig(faasconf)}`;
    link.innerText = `FaaS Form - ${document.getElementById('id').options[document.getElementById('id').selectedIndex].text}`;
    const blob = new Blob([link.outerHTML], {
      type: 'text/html'
    });
    createCopy(blob, message);
  });
}