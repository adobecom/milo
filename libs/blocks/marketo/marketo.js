/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Marketo Form
 */
import { loadScript, createTag, getConfig } from '../../utils/utils.js';

const DESTINATION_URL = 'destination url';
const HIDDEN_FIELDS = 'hidden fields';
const BASE_URL = 'base url';
const FORM_ID = 'form id';
const MUNCHKIN_ID = 'munchkin id';
const ERROR_MESSAGE = 'error message';

const loadForm = (form, formData) => {
  if (!form) return;

  if (formData[HIDDEN_FIELDS]) {
    const hiddenFields = {};
    formData[HIDDEN_FIELDS].split(',').forEach((field) => {
      const [key, value] = field.trim().split('=');
      hiddenFields[key] = value;
    });
    form.addHiddenFields(hiddenFields);
  }
};

export const formValidate = (form, success, error, errorMessage) => {
  const formEl = form.getFormElem().get(0);
  formEl.classList.remove('hide-errors');
  formEl.classList.add('show-warnings');

  if (!success && errorMessage) {
    error.textContent = errorMessage;
    error.classList.add('alert');
  } else {
    error.textContent = '';
    error.classList.remove('alert');
  }
};

export const formSuccess = (form, redirectUrl) => {
  const formEl = form.getFormElem().get(0);
  const parentModal = formEl.closest('.dialog-modal');
  const mktoSubmit = new Event('mktoSubmit');

  window.dispatchEvent(mktoSubmit);
  window.mktoSubmitted = true;

  /* c8 ignore next 5 */
  if (parentModal && !redirectUrl) {
    const closeButton = parentModal.querySelector('.dialog-close');
    closeButton.click();
    return false;
  }
  /* c8 ignore next 4 */
  if (redirectUrl) {
    window.location.href = redirectUrl;
    return false;
  }

  return true;
};

const readyForm = (error, form, formData) => {
  const formEl = form.getFormElem().get(0);
  const redirectUrl = formData[DESTINATION_URL];
  const errorMessage = formData[ERROR_MESSAGE];
  console.log('Megan', formEl);

  // Set row width of legal language, without knowing position
  const formTexts = formEl.querySelectorAll('.mktoHtmlText');
  formEl.querySelector('.mktoPlaceholderFieldSet_2020-10-29T12').closest('.mktoFormRow').classList.add('marketo-privacy');

  formEl.addEventListener('focus', (e) => {
    if (e.target.type === 'submit') return;
    const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
    const targetPosition = e.target?.getBoundingClientRect().top ?? 0;
    const offsetPosition = targetPosition + window.pageYOffset - pageTop - window.innerHeight /2 ;
    window.scrollTo(0, offsetPosition);
  }, true);
  form.onValidate((success) => formValidate(form, success, error, errorMessage));
  form.onSuccess(() => formSuccess(form, redirectUrl));
};

const init = (el) => {
  const { marketoBaseURL, marketoMunchkinID, marketoFormID } = getConfig();
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const formData = {
    [FORM_ID]: marketoFormID,
    [BASE_URL]: marketoBaseURL,
    [MUNCHKIN_ID]: marketoMunchkinID,
  };

  children.forEach((element) => {
    const key = element.children[0]?.textContent.toLowerCase();
    const value = element.children[1]?.textContent;
    if (key && value) { formData[key] = value; }
  });

  const formID = formData[FORM_ID];
  const baseURL = formData[BASE_URL];
  const munchkinID = formData[MUNCHKIN_ID];

  if (!formID || !baseURL) {
    el.style.display = 'none';
    return;
  }

  loadScript(`https:${baseURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      const fragment = new DocumentFragment();
      const error = createTag('p', { class: 'marketo-error', 'aria-live': 'polite' });
      const formWrapper = createTag('section', { class: 'marketo-form-wrapper' });

      if (formData.title) {
        const title = createTag('h3', { class: 'marketo-title' }, formData.title);
        formWrapper.append(title);
      }
      if (formData.description) {
        const description = createTag('p', { class: 'marketo-description' }, formData.description);
        formWrapper.append(description);
      }

      const marketoForm = createTag('form', { ID: `mktoForm_${formID}`, class: 'hide-errors my-form', style: 'opacity:0;visibility:hidden;' });
      const span1 = createTag('span', { id: 'mktoForms2BaseStyle', style: 'display:none;' });
      const span2 = createTag('span', { id: 'mktoForms2ThemeStyle', style: 'display:none;' });
      formWrapper.append(span1, span2, marketoForm);


      fragment.append(error, formWrapper);
      el.replaceChildren(fragment);

      MktoForms2.loadForm(baseURL, munchkinID, formID, (form) => { loadForm(form, formData); });
      MktoForms2.whenReady((form) => { readyForm(error, form, formData); });
    })
    .catch(() => {
      /* c8 ignore next */
      el.style.display = 'none';
    });
};

export default init;
