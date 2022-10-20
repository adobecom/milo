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

/* Marketo adds default styles that we want to remove */
const cleanStyleSheets = (form) => {
  const { styleSheets = [] } = document;

  [...styleSheets].forEach((sheet) => {
    const { href = '' } = sheet;
    const fromMarketo = /marketo.com/.test(href);
    const sheetScope = sheet.ownerNode || sheet.owningElement;
    const formIsParent = sheetScope === form.getFormElem()[0];

    if (fromMarketo || formIsParent) {
      console.log('cleanStyleSheets', sheet);
      sheet.disabled = true;
    }
  });
};

const loadForm = (form, formData) => {
  console.log('loadForm', form);
  cleanStyleSheets(form);

  if (formData['Hidden Fields']) {
    const hiddenFields = {};
    formData['Hidden Fields'].split(',').forEach((field) => {
      const [key, value] = field.trim().split('=');
      hiddenFields[key] = value;
    });
    form.addHiddenFields(hiddenFields);
  }
};

const readyForm = (error, form, formData) => {
  console.log('readyForm', form);
  // Remove styles
  const $form = form.getFormElem();

  $form.find('style').remove();
  $form.find('*').add($form).removeAttr('style');

  const redirectUrl = '';

  form.onValidate((success) => {
    console.log('onValidate', form, success);

    form.submittable(false);
    $form.removeClass('hide-errors');
    $form.addClass('show-warnings');

    if (!form.submittable() && formData['Error Message']) {
      error.textContent = formData['Error Message'];
      error.classList.add('alert');
    } else {
      error.textContent = '';
      error.classList.remove('alert');
    }
  });

  form.onSuccess(() => {
    console.log('onSuccess', form);
    const mktoSubmit = new Event('mktoSubmit');
    const parentModal = form.closest('.modal');

    // Dispatch event for listeners
    window.dispatchEvent(mktoSubmit);
    window.mktoSubmitted = true;

    // Check for form in modal, and set close button
    if (parentModal) {
      const closeButton = parentModal.querySelector('.dialog-close');
      closeButton.click();
    }
    // Modal .dialog-close
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return false;
    }

    return true;
  });
};

const init = (el) => {
  const { marketoBaseURL, marketoMunchkinID, marketoFormID } = getConfig();
  const children = Array.from(el?.querySelectorAll(':scope > div'));
  const formData = {
    'Form ID': marketoFormID,
    'Base URL': marketoBaseURL,
    'Munchkin ID': marketoMunchkinID,
  };

  children.forEach((element) => {
    const key = element.children[0]?.textContent;
    const value = element.children[1]?.textContent;
    if (key && value) { formData[key] = value; }
  });

  const formID = formData['Form ID'];
  const marketoURL = formData['Base URL'];
  const munchkinID = formData['Munchkin ID'];

  loadScript(`https://${marketoURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      const fragment = new DocumentFragment();
      const error = createTag('p', { class: 'marketo-error', 'aria-live': 'polite' });
      const formWrapper = createTag('section', { class: 'marketo-form-wrapper' });

      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      if (formData.Title) {
        const title = createTag('h3', { class: 'marketo-title' }, formData.Title);
        formWrapper.append(title);
      }
      if (formData.Description) {
        const description = createTag('p', { class: 'marketo-description' }, formData.Description);
        formWrapper.append(description);
      }

      const marketoForm = createTag('form', { ID: `mktoForm_${formID}`, class: 'hide-errors' });
      formWrapper.append(marketoForm);
      fragment.append(error);
      fragment.append(formWrapper);
      el.replaceChildren(fragment);

      MktoForms2.loadForm(marketoURL, munchkinID, formID, (form) => { loadForm(form, formData); });
      MktoForms2.whenReady((form) => { readyForm(error, form, formData); });
    })
    .catch(() => {
      el.style.display = 'none';
    });
};

export default init;
