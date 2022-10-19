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

const formSubmit = (form) => {
  console.log('formSubmit', form);
};

const formValidate = (form) => {
  console.log('formValidate', form);
  form.submittable(false);
};

const loadForm = (form) => {
  console.log('loadForm', form);
  cleanStyleSheets(form);
};

const readyForm = (form) => {
  console.log('readyForm', form);
  const $form = form.getFormElem();

  // Remove styles
  $form.find('style').remove();
  $form.find('*').add($form).removeAttr('style');

  const redirectUrl = '';

  form.onValidate((success) => {
    console.log('onValidate', form, success);
    formValidate(form);
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
  const config = {
    'Form ID': marketoFormID,
    'Base URL': marketoBaseURL,
    'Munchkin ID': marketoMunchkinID,
  };

  children.forEach((element) => {
    const key = element.children[0]?.textContent;
    const value = element.children[1]?.textContent;
    if (key && value) { config[key] = value; }
  });

  const formID = config['Form ID'];
  const marketoURL = config['Base URL'];
  const munchkinID = config['Munchkin ID'];

  loadScript(`https://${marketoURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      const fragment = new DocumentFragment();

      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      if (config.Title) {
        const title = createTag('h3', { class: 'marketo-title' }, config.Title);
        fragment.append(title);
      }
      if (config.Description) {
        const description = createTag('p', { class: 'marketo-description' }, config.Description);
        fragment.append(description);
      }

      const form = createTag('form', { ID: `mktoForm_${formID}` });
      fragment.append(form);
      el.replaceChildren(fragment);

      MktoForms2.loadForm(marketoURL, munchkinID, formID, loadForm);
      MktoForms2.whenReady(readyForm);
    })
    .catch(() => {
      el.style.display = 'none';
    });
};

export default init;
