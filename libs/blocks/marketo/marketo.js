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
import { parseEncodedConfig, loadScript, localizeLink, createTag, createIntersectionObserver } from '../../utils/utils.js';

const ROOT_MARGIN = 1000;
const FORM_ID = 'form id';
const BASE_URL = 'marketo host';
const MUNCHKIN_ID = 'marketo munckin';
const SUCCESS_TYPE = 'form.success.type';
const SUCCESS_CONTENT = 'form.success.content';
const SUCCESS_SECTION = 'form.success.section';
const FORM_MAP = {
  'success-type': SUCCESS_TYPE,
  'destination-type': SUCCESS_TYPE,
  'success-content': SUCCESS_CONTENT,
  'destination-url': SUCCESS_CONTENT,
  'success-section': SUCCESS_SECTION,
  'co-partner-names': 'program.copartnernames',
  'sfdc-campaign-id': 'program.campaignids.sfdc',
};

export const formValidate = (formEl) => {
  formEl.classList.remove('hide-errors');
  formEl.classList.add('show-warnings');
};

export const decorateURL = (destination, baseURL = window.location) => {
  if (!(destination.startsWith('http') || destination.startsWith('/'))) return null;

  try {
    let destinationUrl = new URL(destination, baseURL.origin);
    const { hostname, pathname, search, hash } = destinationUrl;

    if (!hostname) {
      throw new Error('URL does not have a valid host');
    }

    if (destinationUrl.hostname.includes('.hlx.')) {
      destinationUrl = new URL(`${pathname}${search}${hash}`, baseURL.origin);
    }

    if (baseURL.pathname.endsWith('.html') && !pathname.endsWith('.html') && !pathname.endsWith('/')) {
      destinationUrl.pathname = `${pathname}.html`;
    }

    const localized = localizeLink(destinationUrl.href, null, true);
    destinationUrl.pathname = new URL(localized, baseURL.origin).pathname;

    return destinationUrl.href;
  } catch (e) {
    window.lana?.log(`Error with Marketo destination URL: ${destination} ${e.message}`);
  }

  return null;
};

const setPreference = (key = '', value = '') => {
  if (!value || !key.includes('.')) return;
  const keyParts = key.split('.');
  const lastKey = keyParts.pop();
  const formDataObject = keyParts.reduce((obj, part) => {
    obj[part] = obj[part] || {};
    return obj[part];
  }, window.mcz_marketoForm_pref);
  formDataObject[lastKey] = value;
};

export const setPreferences = (formData) => {
  window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || {};
  Object.entries(formData).forEach(([key, value]) => setPreference(key, value));
};

export const formSuccess = (formEl, formData) => {
  const parentModal = formEl?.closest('.dialog-modal');
  const mktoSubmit = new Event('mktoSubmit');

  window.dispatchEvent(mktoSubmit);
  window.mktoSubmitted = true;

  /* c8 ignore next 5 */
  if (parentModal) {
    const closeButton = parentModal.querySelector('.dialog-close');
    closeButton.click();
    return false;
  }

  if (formData?.[SUCCESS_TYPE] !== 'section') return true;

  try {
    const section = formData[SUCCESS_SECTION].toLowerCase().replaceAll(' ', '-');
    const success = document.querySelector(`.section.${section}`);
    success.classList.remove('hide-block');
    success.scrollIntoView({ behavior: 'smooth' });
    setPreference(SUCCESS_TYPE, 'message');
  } catch (e) {
    /* c8 ignore next 2 */
    window.lana?.log('Error showing Marketo success section', { tags: 'errorType=warn,module=marketo' });
  }

  return false;
};

const readyForm = (form, formData) => {
  const formEl = form.getFormElem().get(0);
  const isDesktop = matchMedia('(min-width: 900px)');

  formEl.addEventListener('focus', ({ target }) => {
    /* c8 ignore next 9 */
    const hasError = formEl.classList.contains('show-warnings');
    const firstInvalidField = formEl.querySelector('.mktoRequired[aria-invalid=true]');
    if (!['text', 'email', 'tel', 'textarea'].includes(target.type)
      || (isDesktop.matches && !(hasError && target === firstInvalidField))) return;

    const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
    const targetPosition = target?.getBoundingClientRect().top ?? 0;
    const offsetPosition = targetPosition + window.pageYOffset - pageTop - window.innerHeight / 2;
    window.scrollTo(0, offsetPosition);
  }, true);
  form.onValidate(() => formValidate(formEl));
  form.onSuccess(() => formSuccess(formEl, formData));
};

export const loadMarketo = (el, formData) => {
  const baseURL = formData[BASE_URL];
  const munchkinID = formData[MUNCHKIN_ID];
  const formID = formData[FORM_ID];

  loadScript(`https://${baseURL}/js/forms2/js/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      MktoForms2.loadForm(`//${baseURL}`, munchkinID, formID);
      MktoForms2.whenReady((form) => { readyForm(form, formData); });
    })
    .catch(() => {
      /* c8 ignore next 2 */
      el.style.display = 'none';
      window.lana?.log(`Error loading Marketo form for ${munchkinID}_${formID}`, { tags: 'errorType=error,module=marketo' });
    });
};

export default function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const encodedConfigDiv = children.shift();
  const link = encodedConfigDiv.querySelector('a');

  if (!link?.href) {
    el.style.display = 'none';
    return;
  }

  const encodedConfig = link.href.split('#')[1];
  const formData = parseEncodedConfig(encodedConfig);

  children.forEach((element) => {
    const key = element.children[0]?.textContent.trim().toLowerCase().replaceAll(' ', '-');
    const value = element.children[1]?.href ?? element.children[1]?.textContent;
    if (!key || !value) return;
    if (key in FORM_MAP) {
      formData[FORM_MAP[key]] = value;
    } else {
      formData[key] = value;
    }
  });

  const formID = formData[FORM_ID];
  const baseURL = formData[BASE_URL];
  const munchkinID = formData[MUNCHKIN_ID];

  if (!formID || !baseURL || !munchkinID) {
    el.style.display = 'none';
    return;
  }

  formData[SUCCESS_TYPE] = formData[SUCCESS_TYPE] || 'redirect';

  if (formData[SUCCESS_TYPE] === 'redirect') {
    const destinationUrl = decorateURL(formData[SUCCESS_CONTENT]);

    if (destinationUrl) formData[SUCCESS_CONTENT] = destinationUrl;
  }

  setPreferences(formData);

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

  createIntersectionObserver({
    el,
    callback: (target) => {
      loadMarketo(target, formData);
    },
    options: { rootMargin: `${ROOT_MARGIN}px` },
  });
}
