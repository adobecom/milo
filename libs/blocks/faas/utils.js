/* eslint-disable no-undef */

import {
  loadStyle,
  loadScript,
  getConfig,
} from '../../utils/utils.js';

const { env } = getConfig();

export const getFaasHostSubDomain = (environment) => {
  const faasEnv = environment ?? env.name;
  console.log(faasEnv);
  // TODO: prod should be updated as '' when QA is done from FAAS team.
  if (faasEnv === 'prod') {
    return '';
  }
  if (faasEnv === 'stage') {
    return 'staging.';
  }
  if (faasEnv === 'dev') {
    return 'dev.';
  }
  return 'qa.';
};

export const faasHostUrl = `https://${getFaasHostSubDomain()}apps.enterprise.adobe.com`;
let faasCurrentJS = `${faasHostUrl}/faas/service/jquery.faas-current.js`;
if (env === 'local') {
  faasCurrentJS = '/libs/deps/jquery.faas-current.js';
}
export const loadFaasFiles = () => {
  loadStyle('/libs/blocks/faas/faas.css');
  return Promise.all([
    loadScript('/libs/deps/jquery-3.6.0.min.js').then(() => loadScript(faasCurrentJS)),
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
};

export const makeFaasConfig = (state) => {
  if (!state) {
    return defaultState;
  }
  /* c8 ignore start */
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
        36: state.pjs36,
        39: state.pjs39,
        77: 1,
        78: 1,
        79: 1,
        90: 'FAAS',
        92: state.pjs92,
        93: state.pjs93,
        94: state.pjs94,
      },
    },
    e: {
      afterYiiLoadedCallback: () => {
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
          const firstError = event.target.querySelector('.error [name]');
          const subNavEl = $('.Subnav-wrapper');
          const elHeight = subNavEl && subNavEl[0] ? subNavEl[0].offsetHeight : 0;

          if (firstError) {
            const pageTop = document.body.getClientRects()[0].top;
            const firstErrorTop = firstError.getClientRects()[0].top;
            const relPostion = pageTop - firstErrorTop;

            $(firstError).on('focus', (ev) => {
              ev.preventDefault();

              window.scrollTo(0, (Math.abs(relPostion) - (elHeight * 2.5)));
            });

            firstError.focus();
          }
        });

        setMutationObserver(childListMutation(editMessages), errorMessages);
      },
    },
  };

  // b2bpartners
  if (state[149]) {
    // eslint-disable-next-line prefer-destructuring
    config.p.js[149] = state[149];
  }
  // last asset
  if (state[172]) {
    // eslint-disable-next-line prefer-destructuring
    config.p.js[172] = state[172];
  }
  // Multiple Campaign Ids
  if (state.q103) {
    Object.assign(config.q, { 103: { c: state.q103 } });
  }
  /* c8 ignore stop */

  return config;
};

export const initFaas = (state, targetEl) => {
  if (!targetEl || !state) return null;

  const appEl = targetEl.parentElement;

  const formWrapperEl = document.createElement('div');
  formWrapperEl.className = `block faas
    ${state.style_backgroundTheme || 'white'}
    ${state.style_layout || 'column1'}
    ${state.isGate ? 'gated' : ''}`;

  const formTitleWrapperEl = document.createElement('div');
  formTitleWrapperEl.classList.add('faas-title');

  if (state.title) {
    const formTitleEl = document.createElement('h2');
    formTitleEl.textContent = state.title;
    formTitleWrapperEl.append(formTitleEl);
  }

  const formEl = document.createElement('div');
  formEl.className = 'faas-form-wrapper';

  $(formEl).faas(makeFaasConfig(state));

  formWrapperEl.append(formTitleWrapperEl, formEl);
  appEl.replaceChild(formWrapperEl, targetEl);

  return appEl;
};
