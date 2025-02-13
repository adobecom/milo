import { createTag } from '../../utils/utils.js';

const VALIDATION_STEP = {
  name: '2',
  phone: '2',
  mktoFormsJobTitle: '2',
  mktoFormsFunctionalArea: '2',
  company: '3',
  state: '3',
  postcode: '3',
  mktoFormsPrimaryProductInterest: '3',
};

function updateStepDetails(formEl, step, totalSteps) {
  formEl.classList.add('hide-errors');
  formEl.classList.remove('show-warnings');
  formEl.dataset.step = step;
  formEl.querySelector('.step-details .step').textContent = `Step ${step} of ${totalSteps}`;
}

function showPreviousStep(formEl, totalSteps) {
  const currentStep = parseInt(formEl.dataset.step, 10);
  const previousStep = currentStep - 1;
  const submitButton = formEl.querySelector('#mktoButton_new');
  const backBtn = formEl.querySelector('.back-btn');

  updateStepDetails(formEl, previousStep, totalSteps);
  submitButton.textContent = 'Next';

  if (previousStep === 1) backBtn?.remove();
}

const showNextStep = (formEl, currentStep, totalSteps) => {
  if (currentStep === totalSteps) return;
  const nextStep = currentStep + 1;
  const submitButton = formEl.querySelector('#mktoButton_new');
  const stepDetails = formEl.querySelector('.step-details');

  if (!stepDetails.querySelector('.back-btn')) {
    const backBtn = createTag('button', { class: 'back-btn', type: 'button' }, 'Back');
    backBtn.addEventListener('click', () => showPreviousStep(formEl, totalSteps));
    stepDetails.prepend(backBtn);
  }

  updateStepDetails(formEl, nextStep, totalSteps);

  if (nextStep === totalSteps) {
    setTimeout(() => { submitButton.textContent = 'Submit'; }, 200);
  }
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

export const onRender = (form, totalSteps) => {
  const formEl = form.getFormElem().get(0);
  if (!formEl) return;

  const submitButton = formEl.querySelector('#mktoButton_new');
  if (submitButton && formEl.dataset.step === '1') submitButton.textContent = 'Next';

  if (!formEl.querySelector('.step-details')) {
    const stepEl = createTag('p', { class: 'step' }, `Step 1 of ${totalSteps}`);
    const stepDetails = createTag('div', { class: 'step-details' }, stepEl);
    formEl.append(stepDetails);
  }

  setTimeout(() => {
    formEl.querySelectorAll('.mktoFormRowTop').forEach((row) => {
      const rowAttr = row.getAttribute('data-mktofield') || row.getAttribute('data-mkto_vis_src');
      const step = VALIDATION_STEP[rowAttr] ? Math.min(VALIDATION_STEP[rowAttr], totalSteps) : 1;
      row.setAttribute('data-validate', step);
    });
  }, 100);
};

export default (el) => {
  if (!el.classList.contains('multi-step')) return;
  const formEl = el.querySelector('form');
  const totalSteps = el.classList.contains('multi-3') ? 3 : 2;
  formEl.dataset.step = 1;

  const { MktoForms2 } = window;
  MktoForms2.whenRendered((form) => { onRender(form, totalSteps); });
  MktoForms2.whenReady((form) => { form.onValidate(() => formValidate(formEl)); });
};
