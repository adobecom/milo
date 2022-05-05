import { loadStyle, loadScript } from '../../utils/utils.js';

export const faasHostUrl = 'https://dev.apps.enterprise.adobe.com';

export const loadFaasFiles = () => {
  loadStyle('/libs/blocks/faas/faas.css');
  return Promise.all([
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
    loadScript(`${faasHostUrl}/faas/service/jquery.faas-current.js`),
  ]);
};

export const initFaas = (state, targetEl) => {
  if (!targetEl || !state) return;

  const appEl = targetEl.parentElement;
  const formWrapperEl = document.createElement('div');
  const formEl = document.createElement('div');
  const formTitleWrapperEl = document.createElement('div');
  const formTitleEl = document.createElement('h2');
  formEl.classList = 'faas-form'
  formTitleWrapperEl.classList.add('faas-title');
  formTitleEl.textContent = state.title || '';
  
  formWrapperEl.className = targetEl.className;
  formWrapperEl.classList.add('block', 'faas', state.style || 'default');
  $(formEl).faas(makeFaasConfig(state));
  
  formTitleWrapperEl.append(formTitleEl);
  formWrapperEl.append(formTitleWrapperEl, formEl);
  appEl.replaceChild(formWrapperEl, targetEl);
};

export const makeFaasConfig = (state) => {
  if (!state) {
    return defaultState;
  }
  
  console.log('state', state);
  const config = {
    id: state.id,
    l: state.l,
    d: state.d,
    as: state.as,
    ar: state.ar,
    pc: {
      1: state.pc1 ? 'js' : '',
      2: state.pc2 ? 'faas_submission' : '',
      3: state.pc3 ? 'sfdc' : '',
      4: state.pc4 ? 'demandbase' : '',
      5: state.pc5 ? 'clearbit' : '',
    },
    q: {},
    p: {
      js: {
        36: state[36],
        39: state[39],
        77: 1,
        78: 1,
        79: 1,
        90: 'FAAS',
        92: state[92],
        93: state[93],
        94: state[94],
      },
    },
    e:{
      afterYiiLoadedCallback: () => {
        console.log('form loaded.');
      },
      afterSubmitCallback: (formData) => {
        console.log('submitted.', formData);
      }
    },
  }
  console.log('config', config);
  
  return config;
};

export const defaultState = {
  id: 40,
  l: 'en_us',
  d: 'https://business.adobe.com/request-consultation/thankyou.html',
  as: true,
  ar: false,
  pc: {
    1: 'js',
    2: 'faas_submission',
    3: 'sfdc',
    4: 'demandbase',
    5: '',
  },
  q: {},
  p: {
    js: {
      36: "70130000000kYe0AAE",
      39: "",
      77: 1,
      78: 1,
      79: 1,
      90: 'FAAS',
      92: "2846",
      93: "2848",
      94: "",
    },
  },
  e: {},
};
