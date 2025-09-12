import { createTag, parseEncodedConfig, createIntersectionObserver } from '../../utils/utils.js';
import { initFaas, loadFaasFiles } from './utils.js';

const ROOT_MARGIN = 1000;

const [createLiveRegion, updateLiveRegion] = (() => {
  let ariaLiveRegion;

  return [
    (form) => {
      ariaLiveRegion = createTag('div', {
        'aria-live': 'polite',
        role: 'status',
        class: 'faas-aria-live-region',
      });
      form.prepend(ariaLiveRegion);

      return ariaLiveRegion;
    },
    (errorMessage) => {
      if (!ariaLiveRegion || !errorMessage?.length) return;
      ariaLiveRegion.textContent = errorMessage;

      setTimeout(() => {
        ariaLiveRegion.textContent = '';
      }, 3000);
    },
  ];
})();

let previousActiveElement = null;
let currentActiveElement = null;

const trackPreviousElement = () => {
  const newActiveElement = document.activeElement;
  if (currentActiveElement === newActiveElement) return;

  previousActiveElement = currentActiveElement;
  currentActiveElement = newActiveElement;
};

const getErrorMessage = (element) => element?.parentElement.querySelector('.errorMessage')?.textContent;

const isErrorMessageDifferent = (message, element) => message !== getErrorMessage(element);

const createValidationObserver = () => new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return;

    const rowElement = mutation.target;

    if (rowElement.classList.contains('success')) {
      [...rowElement.querySelectorAll('[id][name]')].forEach((field) => {
        field.removeAttribute('aria-describedby');
      });
    }

    if (!rowElement.classList.contains('error')) return;

    [...rowElement.querySelectorAll('[id][name]')].forEach((field) => {
      const { id } = field;
      field.setAttribute('aria-describedby', `${id}_em_`);
    });

    const errorMessage = rowElement.querySelector('.errorMessage')?.textContent;

    if (isErrorMessageDifferent(errorMessage, previousActiveElement)
        && isErrorMessageDifferent(errorMessage, currentActiveElement)
    ) return;

    updateLiveRegion(errorMessage);
  });
});

function focusModalInput(modal, faas, faasForm) {
  const currentlyFocused = document.activeElement;

  if (!modal || (modal.contains(currentlyFocused) && !currentlyFocused.matches('button.dialog-close'))) return;

  const heading = faas.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && !modal.getAttribute('aria-label')) modal.setAttribute('aria-label', heading.textContent?.trim());

  const focusableInput = faasForm.querySelector('input:not([type="hidden"]), textarea:not([type="hidden"]), select:not([type="hidden"])');
  focusableInput?.focus();
}

const loadFaas = async (a) => {
  await loadFaasFiles();
  const encodedConfig = a.href.split('#')[1];
  const faas = initFaas(parseEncodedConfig(encodedConfig), a);
  const modal = faas.closest('.dialog-modal');

  // if FaaS is in Modal, make it column2 style.
  if (faas && modal) {
    faas.querySelector('.faas').classList.add('column2');
  }

  // Accessibility logic
  const formObserver = new MutationObserver(() => {
    const faasForm = faas.querySelector('.faas-form');
    if (!faasForm) return;

    focusModalInput(modal, faas, faasForm);
    faasForm.addEventListener('focusin', trackPreviousElement);

    createLiveRegion(faasForm);
    const validationObserver = createValidationObserver();

    faasForm.addEventListener('submit', () => {
      if (faasForm.querySelector('.faas-form-overlay')) updateLiveRegion('Form loading');
    });

    [...faasForm.querySelectorAll('.row')].forEach((row) => {
      validationObserver.observe(row, { attributes: true, attributeFilter: ['class'] });
    });

    formObserver.disconnect();
  });

  formObserver.observe(faas, { childList: true, subtree: true });
};

export default async function init(a) {
  if (a.textContent.includes('no-lazy')) {
    loadFaas(a);
  } else {
    createIntersectionObserver({
      el: a,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadFaas,
    });
  }
}
