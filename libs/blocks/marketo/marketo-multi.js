import { createTag } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';

const VALIDATION_STEP = {
  name: '2',
  phone: '2',
  mktoFormsJobTitle: '2',
  mktoFormsFunctionalArea: '2',
  company: '3',
  state: '3',
  postcode: '3',
  mktoFormsPrimaryProductInterest: '3',
  mktoFormsCompanyType: '3',
};

function updateStepDetails(formEl, step, totalSteps) {
  formEl.classList.add('hide-errors');
  formEl.classList.remove('show-warnings');
  formEl.dataset.step = step;
  formEl.querySelector('.step-details .step').textContent = `Step ${step} of ${totalSteps}`;
  formEl.querySelector('#mktoButton_new')?.classList.toggle('mktoHidden', step !== totalSteps);
  formEl.querySelector('#mktoButton_next')?.classList.toggle('mktoHidden', step === totalSteps);
  setTimeout(() => {
    formEl.querySelector(`.mktoFormRowTop[data-validate="${step}"]:not(.mktoHidden) input`)?.focus();
  }, 100);
}

function showPreviousStep(formEl, totalSteps) {
  const currentStep = parseInt(formEl.dataset.step, 10);
  const previousStep = currentStep - 1;
  const backBtn = formEl.querySelector('.back-btn');

  updateStepDetails(formEl, previousStep, totalSteps);
  if (previousStep === 1) backBtn?.remove();
}

const showNextStep = (formEl, currentStep, totalSteps) => {
  if (currentStep === totalSteps) return;
  const nextStep = currentStep + 1;
  const stepDetails = formEl.querySelector('.step-details');

  if (!stepDetails.querySelector('.back-btn')) {
    const backBtn = createTag('button', { class: 'back-btn', type: 'button' }, 'Back');
    backBtn.addEventListener('click', () => showPreviousStep(formEl, totalSteps));
    stepDetails.prepend(backBtn);
  }

  updateStepDetails(formEl, nextStep, totalSteps);
};

export const formValidate = (formEl) => {
  const currentStep = parseInt(formEl.dataset.step, 10) || 1;

  if (formEl.querySelector(`.mktoFormRowTop[data-validate="${currentStep}"] .mktoInvalid`)) {
    return false;
  }

  const totalSteps = formEl.closest('.marketo').classList.contains('multi-3') ? 3 : 2;
  showNextStep(formEl, currentStep, totalSteps);

  return currentStep === totalSteps;
};

function setValidationSteps(formEl, totalSteps) {
  formEl.querySelectorAll('.mktoFormRowTop').forEach((row) => {
    const rowAttr = row.getAttribute('data-mktofield') || row.getAttribute('data-mkto_vis_src');
    const step = VALIDATION_STEP[rowAttr] ? Math.min(VALIDATION_STEP[rowAttr], totalSteps) : 1;
    row.dataset.validate = rowAttr?.startsWith('adobe-privacy') ? totalSteps : step;
  });
}

function onRender(formEl, totalSteps) {
  const currentStep = parseInt(formEl.dataset.step, 10);
  const submitButton = formEl.querySelector('#mktoButton_new');
  submitButton?.classList.toggle('mktoHidden', currentStep !== totalSteps);
  formEl.querySelector('.step-details .step').textContent = `Step ${currentStep} of ${totalSteps}`;
  setValidationSteps(formEl, totalSteps);
}

const readyForm = (form, totalSteps) => {
  const formEl = form.getFormElem().get(0);
  form.onValidate(() => formValidate(formEl));

  const nextButton = createTag('button', { type: 'button', id: 'mktoButton_next', class: 'mktoButton mktoUpdatedBTN mktoVisible' }, 'Next');
  nextButton.addEventListener('click', () => form.validate());
  const nextContainer = createTag('div', { class: 'mktoButtonRow' }, nextButton);
  const stepEl = createTag('p', { class: 'step' }, `Step 1 of ${totalSteps}`);
  const stepDetails = createTag('div', { class: 'step-details' }, stepEl);
  formEl.append(nextContainer, stepDetails);

  const debouncedOnRender = debounce(() => onRender(formEl, totalSteps), 10);
  const observer = new MutationObserver(debouncedOnRender);
  observer.observe(formEl, { childList: true, subtree: true });
  debouncedOnRender();
};

export default (el) => {
  if (!el.classList.contains('multi-step')) return;
  const formEl = el.querySelector('form');
  const totalSteps = el.classList.contains('multi-3') ? 3 : 2;
  formEl.dataset.step = 1;

  const { MktoForms2 } = window;
  MktoForms2.whenReady((form) => { readyForm(form, totalSteps); });
};
