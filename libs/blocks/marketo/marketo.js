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
import { parseEncodedConfig, loadScript, createTag } from '../../utils/utils.js';

const FORM_ID = 'form id';
const BASE_URL = 'marketo host';
const MUNCHKIN_ID = 'marketo munckin';

export const formValidate = (form) => {
  const formEl = form.getFormElem().get(0);
  formEl.classList.remove('hide-errors');
  formEl.classList.add('show-warnings');
};

export const formSuccess = (form) => {
  const formEl = form.getFormElem().get(0);
  const parentModal = formEl.closest('.dialog-modal');
  const mktoSubmit = new Event('mktoSubmit');

  window.dispatchEvent(mktoSubmit);
  window.mktoSubmitted = true;

  /* c8 ignore next 5 */
  if (parentModal) {
    const closeButton = parentModal.querySelector('.dialog-close');
    closeButton.click();
    return false;
  }

  return true;
};

const readyForm = (form, formData) => {
  const formEl = form.getFormElem().get(0);

  formEl.addEventListener('focus', (e) => {
    if (e.target.type === 'submit' || e.target.type === 'button') return;
    const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
    const targetPosition = e.target?.getBoundingClientRect().top ?? 0;
    const offsetPosition = targetPosition + window.pageYOffset - pageTop - window.innerHeight /2 ;
    window.scrollTo(0, offsetPosition);
  }, true);
  form.onValidate(() => formValidate(form));
  form.onSuccess(() => formSuccess(form));
};

const setPreference = (key, value) => {
  if (key?.includes('.')) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const targetObject = keys.reduce((object, key) => {
      return object[key] = object[key] || {};
    }, window.mcz_marketoForm_pref);
    targetObject[lastKey] = value;
  }
}

export const setPreferences = (formData) => {
  window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || {};
  for(const [key, value] of Object.entries(formData)) {
    setPreference(key, value);
  }
}

const init = (el) => {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const link = children[0].querySelector('a');
  let formData = {};

  if (link && link.href) {
    const encodedConfig = link.href.split('#')[1];

    formData = parseEncodedConfig(encodedConfig);
  }

  children.forEach((element) => {
    const key = element.children[0]?.textContent.toLowerCase();
    const value = element.children[1]?.textContent;
    if (key && value) { formData[key] = value; }
  });

  const formID = formData[FORM_ID];
  const baseURL = formData[BASE_URL];
  const munchkinID = formData[MUNCHKIN_ID];

  setPreferences(formData);

  if (!formID || !baseURL || !munchkinID) {
    el.style.display = 'none';
    return;
  }


  const fragment = new DocumentFragment();
  const formWrapper = createTag('section', { class: 'marketo-form-wrapper' });

  if (formData.title) {
    const title = createTag('h3', { class: 'marketo-title' }, formData.title);
    formWrapper.append(title);
  }
  if (formData.description) {
    const description = createTag('p', { class: 'marketo-description' }, formData.description);
    formWrapper.append(description);
  }

  const marketoForm = createTag('form', { ID: `mktoForm_${formID}`, class: 'hide-errors', style: 'opacity:0;visibility:hidden;' });
  const span1 = createTag('span', { id: 'mktoForms2BaseStyle', style: 'display:none;' });
  const span2 = createTag('span', { id: 'mktoForms2ThemeStyle', style: 'display:none;' });
  formWrapper.append(span1, span2, marketoForm);

  fragment.append(formWrapper);
  el.replaceChildren(fragment);

  loadScript(`https://${baseURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      MktoForms2.loadForm(`//${baseURL}`, munchkinID, formID);
      MktoForms2.whenReady((form) => { readyForm(form, formData); });
    })
    .catch(() => {
      /* c8 ignore next */
      el.style.display = 'none';
    });
};

export default init;
