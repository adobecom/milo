import { loadScript } from '../../utils/utils.js';

export const faasHostUrl = 'https://dev.apps.enterprise.adobe.com';

export const loadFaasFiles = () => {
  return Promise.all([
    loadScript('https://code.jquery.com/jquery-3.6.0.min.js'),
    loadScript(`${faasHostUrl}/faas/service/jquery.faas-current.js`),
  ]);
};

export const initFaas = (faasconf, targetEl) => {
  const faasEl = targetEl;
  if (!faasEl || !faasconf) return;

  const appEl = faasEl.parentElement;
  const newEl = document.createElement('div');
  newEl.className = targetEl.className;
  newEl.classList.add('faas-preview', 'block', 'faas');
  console.log(faasconf);
  $(newEl).faas(faasconf);
  appEl.replaceChild(newEl, faasEl);
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
  e: {
    afterYiiLoadedCallback: () => {
      console.log('form loaded.');
    },
    afterSubmitCallback: (formData) => {
      console.log('submitted.', formData);
    },
  },
};
