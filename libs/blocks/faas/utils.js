/* eslint-disable no-undef */

import {
  loadStyle,
  loadScript,
  getConfig,
  createTag,
} from '../../utils/utils.js';

const { env, miloLibs, codeRoot } = getConfig();
let state;

export const getFaasHostSubDomain = (environment) => {
  const faasEnv = environment ?? env.name;
  // TODO: prod should be updated as '' when QA is done from FAAS team.
  if (faasEnv === 'prod') {
    return '';
  }
  if (faasEnv === 'stage') {
    return 'dev.';
  }
  if (faasEnv === 'dev') {
    return 'dev.';
  }
  return 'qa.';
};

const base = miloLibs || codeRoot;

export const faasHostUrl = `https://${getFaasHostSubDomain()}apps.enterprise.adobe.com`;
let faasCurrentJS = `${faasHostUrl}/faas/service/jquery.faas-current.js`;
if (env.name === 'local') {
  faasCurrentJS = `${base}/deps/jquery.faas-current.js`;
}
export const loadFaasFiles = () => {
  loadStyle(`${base}/blocks/faas/faas.css`);
  return Promise.all([
    loadScript(`${base}/deps/jquery-3.6.0.min.js`).then(() => loadScript(faasCurrentJS)),
  ]);
};

export const defaultState = {
  id: 40,
  l: 'en_us',
  d: '',
  as: true,
  ar: true,
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
      36: '',
      39: '',
      77: 1,
      78: 1,
      79: 1,
      90: 'FAAS',
      92: '2846',
      93: '2848',
      94: '',
    },
  },
  e: {},
  title_align: 'center',
  title_size: 'h3',
};

/* c8 ignore start */
const afterYiiLoadedCallback = () => {
  const wr = document.querySelector('.faas-form');
  function editMessages(mutations) {
    const firstmut = mutations[0].addedNodes;
    const text = firstmut[firstmut.length - 1].nodeValue;
    const sibs = mutations[0].target.parents('.checkbox').querySelector('.checkbox.error');
    let i = 0;
    do {
      sibs[i].style.height = '4em';
      sibs[i].querySelector('.errorMessage').innerHTML = text;
      i += 1;
    } while (sibs[i]);
  }
  const { multicampaignradiostyle } = state; // temp
  function changeSelectionElement() {
    if (multicampaignradiostyle) {
      const inputs = wr.querySelectorAll('.checkboxlist input');
      inputs.forEach((input) => {
        if (input.type === 'checkbox') {
          input.type = 'radio';
        }
      });
    }
  }

  function hideDisplay(elms = []) {
    $.each(elms, (i, elm) => {
      elm.style.display = 'none';
    });
  }

  function placeHolders() {
    function iterator(els) {
      $.each(els, (i, el) => {
        const textHolder = $(el).siblings('label')[0];
        const text = textHolder instanceof HTMLElement ? textHolder.textContent : '';
        if (text !== '') {
          el.setAttribute('placeholder', text);
        }
      });
    }

    iterator($('.faasform input[type="text"]'));
    iterator($('.faasform textarea'));
  }

  function removeRequired() {
    const requireds = $('span.required');
    $.each(requireds, (i, req) => {
      $(req).remove();
    });
  }

  function requireNote() {
    const notearr = $('p.note');
    const RMTEXT = [
      'Required fields',
      'Povinná pole',
      'Pflichtfelder',
      'Skal udfyldes',
      'Champs obligatoires',
      'Pakolliset kentät',
      'Campi obbligatori',
      '必須フィールド',
      'Verplichte velden',
      'Obligatoriske felt',
      'Campos obligatorios',
      'Obligatoriska fält',
      'Pola wymagane',
      'Обязательные поля',
      'Os campos obrigatórios',
      '필수 입력란',
      '为必填项',
      '為必填項',
      'Zorunlu alanlar',
    ];
    const validnote = $.each(notearr, (i, note) => {
      const text = note.textContent;
      const notematch = RMTEXT.indexOf(text);
      if (notematch >= 0) {
        return note;
      }
      return undefined;
    });

    return validnote;
  }

  function childListMutation(cb) {
    return new MutationObserver((mutations) => {
      cb(mutations, this);
    });
  }

  function setMutationObserver(mutation, elms = []) {
    $.each(elms, (i, elm) => {
      mutation.observe(elm, { childList: true });
    });
  }

  function removeExtraColumnDivForNext() {
    const columnsDivs = document.querySelectorAll('.columns > .row.next > div');
    columnsDivs.forEach((colDiv) => {
      if (!colDiv.innerHTML) {
        colDiv.remove();
      }
    });
  }

  changeSelectionElement();
  removeRequired();
  placeHolders();

  const errorMessages = $('.hash-window .checkbox .errorMessage');
  const faasform = $('.faas-form');
  const note = requireNote();

  if (note) {
    note.remove();
  }

  if (state.hidePrepopulated) {
    const prepop = $('.prepopulated', wr);
    hideDisplay(prepop);
  }

  $.each(faasform, (i, form) => {
    $(form).on('change', () => {
      const elements = $('span.required', form);
      hideDisplay(elements);
    });
  });

  $('.faas-form').on('submit', (event) => {
    removeExtraColumnDivForNext();
    const nextFirstInput = document.querySelector('.faas-form.next input:not([type=hidden])');
    if (nextFirstInput && !nextFirstInput.value) {
      nextFirstInput.parentElement.classList.add('error');
      if (!nextFirstInput.parentElement.querySelector('.errorMessage').textContent) {
        nextFirstInput.parentElement.querySelector('.errorMessage').textContent = 'Business email cannot be blank.';
      }
    }
    const firstError = event.target.querySelector('.error [name]');
    if (firstError) {
      firstError.focus();
    }
  });
  removeExtraColumnDivForNext();
  setMutationObserver(childListMutation(editMessages), errorMessages);
};
/* c8 ignore stop */

export const makeFaasConfig = (targetState) => {
  if (!targetState) {
    state = defaultState;
    return state;
  }

  const config = {
    id: targetState.id,
    l: targetState.l,
    d: targetState.d,
    as: targetState.as,
    ar: targetState.ar,
    pc: {
      1: targetState.pc1 ? 'js' : '',
      2: targetState.pc2 ? 'faas_submission' : '',
      3: targetState.pc3 ? 'sfdc' : '',
      4: targetState.pc4 ? 'demandbase' : '',
      5: targetState.pc5 ? 'clearbit' : '',
    },
    q: {},
    p: {
      js: {
        36: targetState.pjs36,
        39: targetState.pjs39,
        77: 1,
        78: 1,
        79: 1,
        90: 'FAAS',
        92: targetState.pjs92,
        93: targetState.pjs93,
        94: targetState.pjs94,
      },
    },
    e: { afterYiiLoadedCallback },
  };

  // b2bpartners
  if (targetState[149]) {
    // eslint-disable-next-line prefer-destructuring
    config.p.js[149] = targetState[149];
  }
  // last asset
  if (targetState[172]) {
    // eslint-disable-next-line prefer-destructuring
    config.p.js[172] = targetState[172];
  }
  // Multiple Campaign Ids
  if (targetState.q103) {
    Object.assign(config.q, { 103: { c: targetState.q103 } });
  }

  state = config;
  return config;
};

export const initFaas = (config, targetEl) => {
  if (!targetEl || !config) return null;
  state = config;
  const appEl = targetEl.parentElement;
  const isNext = (state.pjs93 || state.p.js[93])?.toString() === '2847' && (state.pc5 || state.pc[5] === 'clearbit');
  const formWrapperEl = createTag('div', {
    class: `block faas
  ${state.style_backgroundTheme || 'white'}
  ${state.style_layout || 'column1'}
  ${state.isGate ? 'gated' : ''}
  ${isNext ? 'next' : ''}`,
  });

  const formTitleWrapperEl = createTag('div', { class: `faas-title text-${state.title_align || 'center'}` });
  if (state.title) {
    const formTitleEl = createTag(state.title_size || 'h3');
    formTitleEl.textContent = state.title;
    formTitleWrapperEl.append(formTitleEl);
  }

  const formEl = createTag('div', { class: 'faas-form-wrapper' });
  if (state.complete) {
    state.e = { afterYiiLoadedCallback };
    $(formEl).faas(state);
  } else {
    makeFaasConfig(config);
    $(formEl).faas(state);
  }

  formWrapperEl.append(formTitleWrapperEl, formEl);
  appEl.replaceChild(formWrapperEl, targetEl);

  return appEl;
};
