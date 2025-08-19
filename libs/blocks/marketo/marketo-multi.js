import { createTag, getConfig } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';
import { replaceKey } from '../../features/placeholders.js';

const VALIDATION_STEP = {
  2: [
    'name',
    'phone',
    'mktoFormsJobTitle',
    'mktoFormsFunctionalArea',
  ],
  3: [
    'company',
    'state',
    'postcode',
    'mktoFormsPrimaryProductInterest',
    'mktoFormsCompanyType',
  ],
};

export function updateTabIndex(formEl, stepToAdd, stepToRemove) {
  const fieldsToAdd = formEl.querySelectorAll(`.mktoFormRowTop[data-validate="${stepToAdd}"]:not(.mktoHidden) input, 
    .mktoFormRowTop[data-validate="${stepToAdd}"]:not(.mktoHidden) select, 
    .mktoFormRowTop[data-validate="${stepToAdd}"]:not(.mktoHidden) textarea`);
  fieldsToAdd.forEach((f) => { f.tabIndex = 0; });

  const fieldsToRemove = formEl.querySelectorAll(`.mktoFormRowTop[data-validate="${stepToRemove}"]:not(.mktoHidden) input, 
    .mktoFormRowTop[data-validate="${stepToRemove}"]:not(.mktoHidden) select, 
    .mktoFormRowTop[data-validate="${stepToRemove}"]:not(.mktoHidden) textarea`);
  fieldsToRemove.forEach((f) => { f.tabIndex = -1; });
}

function updateStepDetails(formEl, step, totalSteps) {
  formEl.classList.add('hide-errors');
  formEl.classList.remove('show-warnings');
  formEl.dataset.step = step;
  formEl.querySelector('.step-details .step-count').textContent = `${step} / ${totalSteps}`;
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
  updateTabIndex(formEl, previousStep, currentStep);
  if (previousStep === 1) backBtn?.remove();
}

const showNextStep = async (formEl, currentStep, totalSteps) => {
  if (currentStep === totalSteps) return;
  const nextStep = currentStep + 1;
  const stepDetails = formEl.querySelector('.step-details');

  if (!stepDetails.querySelector('.back-btn')) {
    const backText = await replaceKey('back', getConfig());
    const backBtn = createTag('button', { class: 'back-btn', type: 'button' }, backText);
    backBtn.addEventListener('click', () => showPreviousStep(formEl, totalSteps));
    stepDetails.prepend(backBtn);
  }

  updateStepDetails(formEl, nextStep, totalSteps);
  updateTabIndex(formEl, nextStep, currentStep);
};

export const formValidate = async (formEl) => {
  const currentStep = parseInt(formEl.dataset.step, 10) || 1;

  if (formEl.querySelector(`.mktoFormRowTop[data-validate="${currentStep}"] .mktoInvalid`)) {
    return false;
  }

  const totalSteps = formEl.closest('.marketo').classList.contains('multi-3') ? 3 : 2;
  await showNextStep(formEl, currentStep, totalSteps);

  return currentStep === totalSteps;
};

function setValidationSteps(formEl, totalSteps, currentStep) {
  const formData = window.mcz_marketoForm_pref || {};
  const validationMap = formData.form?.fldStepPref || VALIDATION_STEP;
  formEl.querySelectorAll('.mktoFormRowTop').forEach((row) => {
    const rowAttr = row.getAttribute('data-mktofield') || row.getAttribute('data-mkto_vis_src');
    const mapStep = Object.keys(validationMap).find((stepNum) => validationMap[stepNum].some((field) => field.toLowerCase() === rowAttr?.toLowerCase())) || '1';
    const step = Math.min(parseInt(mapStep, 10), totalSteps);
    row.dataset.validate = rowAttr?.startsWith('adobe-privacy') ? totalSteps : step;
    const fields = row.querySelectorAll('input, select, textarea');
    if (fields.length) fields.forEach((f) => { f.tabIndex = step === currentStep ? 0 : -1; });
  });
}

function onRender(formEl, totalSteps) {
  const currentStep = parseInt(formEl.dataset.step, 10);
  const submitButton = formEl.querySelector('#mktoButton_new');
  submitButton?.classList.toggle('mktoHidden', currentStep !== totalSteps);
  formEl.querySelector('.step-details .step-count').textContent = `${currentStep} / ${totalSteps}`;
  setValidationSteps(formEl, totalSteps, currentStep);
}

const readyForm = async (form, totalSteps) => {
  const formEl = form.getFormElem().get(0);
  form.onValidate(() => formValidate(formEl));

  const nextButton = createTag('button', { type: 'button', id: 'mktoButton_next', class: 'mktoButton mktoUpdatedBTN mktoVisible' }, 'Next');
  nextButton.addEventListener('click', () => form.validate());
  const nextContainer = createTag('div', { class: 'mktoButtonRow' }, nextButton);
  const stepText = await replaceKey('step', getConfig());
  const stepEl = createTag('p', { class: 'step' }, `${stepText} <span class="step-count">1 / ${totalSteps}</span>`);
  const stepDetails = createTag('div', { class: 'step-details' }, stepEl);
  formEl.append(nextContainer, stepDetails);

  const debouncedOnRender = debounce(() => onRender(formEl, totalSteps), 50);
  const observer = new MutationObserver(debouncedOnRender);
  const fieldLoadTimeOnSlowDevice = 12000;
  observer.observe(formEl, { childList: true, subtree: true });
  setTimeout(() => {
    observer.disconnect();
  }, fieldLoadTimeOnSlowDevice);
  debouncedOnRender();
};

export default async (el) => {
  if (!el.classList.contains('multi-step')) return;
  const formEl = el.querySelector('form');
  const totalSteps = el.classList.contains('multi-3') ? 3 : 2;
  formEl.dataset.step = 1;

  const { MktoForms2 } = window;
  await MktoForms2.whenReady((form) => readyForm(form, totalSteps));
};
