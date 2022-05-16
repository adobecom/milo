import {
  loadStyle,
  loadScript,
} from '../../utils/utils.js';

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
  formWrapperEl.className = `block faas
    ${state['style_backgroundTheme']||'white'}
    ${state['style_layout']||'column1'}
    ${state['isGate']?'gated':''}`;

  const formTitleWrapperEl = document.createElement('div');
  formTitleWrapperEl.classList.add('faas-title');

  if (state.title) {
    const formTitleEl = document.createElement('h2');
    formTitleEl.textContent = state.title;
    formTitleWrapperEl.append(formTitleEl);
  }

  const formEl = document.createElement('div');
  formEl.className = 'faas-form'

  $(formEl).faas(makeFaasConfig(state));

  formWrapperEl.append(formTitleWrapperEl, formEl);
  appEl.replaceChild(formWrapperEl, targetEl);
};

export const makeFaasConfig = (state) => {
  if (!state) {
    return defaultState;
  }
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
    e: {
      afterYiiLoadedCallback: () => {
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
        const multicampaignradiostyle = false; //temp
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

        function setMutationObserver(elms = [], mutation) {
          $.each(elms, (i, elm) => {
            mutation.observe(elm, {
              childList: true
            });
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

        if (state['hidePrepopulated']) {
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

        setMutationObserver(errorMessages, childListMutation(editMessages));
      },
      afterSubmitCallback: (formData) => {
        // Gate Stuff
        const disableAutoResponseChk = typeof disableAutoResponse === 'string';
        const closeModalElement = modal ? modal.querySelector('.dexter-CloseButton') : undefined;
        const isSameDestination = typeof sameDestination === 'string';

        if (disableAutoResponseChk && state['isGate']) {
          blocker.parentElement.removeChild(blocker);
        }

        if (disableAutoResponseChk && isSameDestination && isinmodal && closeModalElement) {
          closeModalElement.click();
        }

        // IO Stuff
        const baseUrl = 'https://sc5.omniture.com/p/suite/1.3/json/index.html?a=Basketball.ProvisionUser';
        const email = formData.data[`faas_form_${id}_hash`];
        const ioUrl =
          /qa\d+|dev\d+|local|127\.0\.0\.1|:\d{2,4}/g.test(window.location.href) ?
          'https://www.qa02.adobe.com/shortform/' : 'https://www.adobe.com/shortform';

        if (analyticsEmailEnabled) {
          $.ajax({
            method: 'GET',
            url: `${baseUrl}&email=${email}&analytics_company=HackTheBracket`,
          }).done((omniData) => {
            const serviceData = {
              emailProgram: 'analytics',
              emailType: analyticsEmailType,
              page: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
              emailRecipient: email,
              loginUrl: omniData.login_page_url,
              company: omniData.company,
              username: omniData.username,
              password: omniData.password,
            };

            $.ajax({
              data: serviceData,
              method: 'POST',
              url: ioUrl,
            });
          });
        }
      },
    },
  }
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