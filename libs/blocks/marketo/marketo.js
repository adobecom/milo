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
import {
  parseEncodedConfig,
  loadScript,
  loadLink,
  localizeLinkAsync,
  createTag,
  getConfig,
  getMetadata,
  createIntersectionObserver,
  SLD,
  MILO_EVENTS,
} from '../../utils/utils.js';
import { replaceKeyArray } from '../../features/placeholders.js';

const ROOT_MARGIN = 50;
const FAILURE_TIMEOUT = 10000;
export const LANA_MESSAGE = {
  RENDER_FAILED: 'Marketo form did not render',
  HANDSHAKE_FAILED: 'Marketo form handshake failed',
  RENDER_RECOVERED: 'Marketo form rendered after timeout',
  SUBMIT_FAILED: 'Marketo form submit failed',
  MARKETO_FORMS_JS: 'Marketo form failed to load forms2.min.js',
};
const FORM_ID = 'form id';
const BASE_URL = 'marketo host';
const MUNCHKIN_ID = 'marketo munckin';
const FORM_STATUS = 'form.status';
const FORM_XDFRAME = 'form.xdframe';
const SUCCESS_TYPE = 'form.success.type';
const SUCCESS_CONTENT = 'form.success.content';
const SUCCESS_SECTION = 'form.success.section';
const SUCCESS_HIDE_SECTION = 'form.success.hide.section';
const FORM_MAP = {
  'success-type': SUCCESS_TYPE,
  'destination-type': SUCCESS_TYPE,
  'success-content': SUCCESS_CONTENT,
  'destination-url': SUCCESS_CONTENT,
  'success-section': SUCCESS_SECTION,
  'success-hide-section': SUCCESS_HIDE_SECTION,
  'co-partner-names': 'program.copartnernames',
  'sfdc-campaign-id': 'program.campaignids.sfdc',
  'poi-field': 'field_filters.products',
  'hardcoded-poi': 'program.poi',
};
export const FORM_PARAM = 'form';

const isVisible = (el) => !!el && (typeof el.checkVisibility === 'function'
  ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
  : !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length));

export const setDataLayer = (key = '', value = '') => {
  window.mcz_marketoForm_pref = window.mcz_marketoForm_pref || {};
  if (!value || !key.includes('.')) return;
  const keyParts = key.split('.');
  const lastKey = keyParts.pop();
  const formDataObject = keyParts.reduce((obj, part) => {
    obj[part] = obj[part] || {};
    return obj[part];
  }, window.mcz_marketoForm_pref);
  formDataObject[lastKey] = value;
};

export const setDataLayerObj = (formData) => {
  Object.entries(formData).forEach(([key, value]) => setDataLayer(key, value));
};

export const getDataLayer = (key = '') => key
  .split('.')
  .reduce((obj, part) => obj?.[part], window.mcz_marketoForm_pref);

export const formValidate = (formEl) => {
  formEl.classList.remove('hide-errors');
  formEl.classList.add('show-warnings');
};

export const decorateURL = async (destination, baseURL = window.location) => {
  if (!(destination.startsWith('http') || destination.startsWith('/'))) return null;

  try {
    let destinationUrl = new URL(destination, baseURL.origin);
    const { hostname, pathname, search, hash } = destinationUrl;

    const { htmlExclude } = getConfig();
    const exclude = htmlExclude?.some((excludeRe) => excludeRe.test(destinationUrl));

    /* c8 ignore next 3 */
    if (!hostname) {
      throw new Error('URL does not have a valid host');
    }

    if (destinationUrl.hostname.includes(`.${SLD}.`)) {
      destinationUrl = new URL(`${pathname}${search}${hash}`, baseURL.origin);
    }

    const hasFileExtension = /\.[^/.]+$/.test(pathname);
    if (baseURL.pathname.endsWith('.html') && !hasFileExtension && !pathname.endsWith('/') && !exclude) {
      destinationUrl.pathname = `${pathname}.html`;
    }

    const localized = await localizeLinkAsync(destinationUrl.href, null, true);
    destinationUrl.pathname = new URL(localized, baseURL.origin).pathname;

    return destinationUrl.href;
  } catch (e) {
    /* c8 ignore next 4 */
    window.lana?.log(`Error with Marketo destination URL: ${destination} ${e.message}`, { tags: 'marketo', severity: 'e' });
  }

  return null;
};

const showSuccessSection = (formData) => {
  const show = async (sections) => {
    sections.forEach((section) => section.classList.remove('hide-block'));
    await new Promise((resolve) => { setTimeout(resolve, 300); });
    const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
    const targetPosition = sections[0]?.getBoundingClientRect().top ?? 0;
    const offsetPosition = targetPosition + window.scrollY - pageTop;
    window.scrollTo(0, offsetPosition);
  };

  const showClass = formData[SUCCESS_SECTION]?.toLowerCase().replaceAll(' ', '-');
  if (!showClass) {
    window.lana?.log('Error showing Marketo success section', { tags: 'marketo', severity: 'w' });
    return;
  }

  let successSections = document.querySelectorAll(`.section.${showClass}`);
  show(successSections);
  document.addEventListener(
    MILO_EVENTS.DEFERRED,
    () => {
      successSections = document.querySelectorAll(`.section.${showClass}`);
      show(successSections);
      /* c8 ignore next 3 */
      if (!document.querySelector(`.section.${showClass}`)) {
        window.lana?.log(`Error showing Marketo success section ${showClass}`, { tags: 'marketo', severity: 'w' });
      }
    },
    false,
  );
};

const hideSuccessSection = (formData) => {
  const hide = (sections) => {
    sections.forEach((section) => section.classList.add('hide-block'));
  };

  const hideClass = formData[SUCCESS_HIDE_SECTION]?.toLowerCase().replaceAll(' ', '-');
  if (!hideClass) {
    window.lana?.log('Error hiding Marketo success section', { tags: 'marketo', severity: 'w' });
    return;
  }

  let hideSections = document.querySelectorAll(`.section.${hideClass}`);
  hide(hideSections);
  document.addEventListener(
    MILO_EVENTS.DEFERRED,
    () => {
      hideSections = document.querySelectorAll(`.section.${hideClass}`);
      hide(hideSections);
      /* c8 ignore next 3 */
      if (!document.querySelector(`.section.${hideClass}`)) {
        window.lana?.log(`Error hiding Marketo success section ${hideClass}`, { tags: 'marketo', severity: 'w' });
      }
    },
    false,
  );
};

export const debugTags = () => {
  const len = document.cookie.length;
  const tags = ['marketo'];
  const signedIn = window.adobeIMS?.isSignedInUser();
  const frameStatus = getDataLayer(FORM_XDFRAME);
  if (getDataLayer('form.id')) tags.push(`form-${getDataLayer('form.id')}`);
  if (getDataLayer('program.id')) tags.push(`program-${getDataLayer('program.id')}`);
  if (getDataLayer(FORM_STATUS)) tags.push(`status-${getDataLayer(FORM_STATUS)}`);
  if (len >= 8192) tags.push('cookie-8k');
  else if (len >= 6144) tags.push('cookie-6k');
  else if (len >= 4096) tags.push('cookie-4k');
  tags.push(`ims-${signedIn ? 'signed-in' : 'signed-out'}`);
  tags.push(frameStatus === 'ready' ? 'sync-ok' : 'sync-error');
  if (getDataLayer('form.progressive')) tags.push('progressive');
  if (getDataLayer('profile.known_visitor') === true) tags.push('known-visitor');
  tags.push(`pref-lang-${getDataLayer('profile.prefLanguage') ?? ''}`);
  return tags;
};

const decorateOverlay = async (el, message, callback) => {
  if (el.querySelector('.marketo-overlay')) return;
  const [errorRefresh, tryAgain] = await replaceKeyArray(['marketo-load-error', 'marketo-try-again'], getConfig());
  const formEl = el.querySelector('form');
  if (formEl) formEl.inert = true;
  const searchParams = new URLSearchParams(window.location.search);
  const debugMsg = searchParams.get('preview') === '1' ? message : '';
  const errorMessage = createTag('p', { class: 'error', id: 'marketo-error-message' }, errorRefresh);
  const formError = createTag('div', { class: 'error-container' }, errorMessage);
  if (debugMsg) {
    const debugInfo = createTag('p', { class: 'debug-info' });
    debugInfo.textContent = debugMsg;
    formError.appendChild(debugInfo);
  }
  const retryButton = createTag('button', { class: 'retry-button' }, tryAgain);
  formError.appendChild(retryButton);
  const errorOverlay = createTag(
    'div',
    {
      class: 'marketo-overlay',
      role: 'alertdialog',
      'aria-modal': 'true',
      'aria-labelledby': 'marketo-error-message',
    },
    formError,
  );

  retryButton.addEventListener('click', () => {
    /* c8 ignore next 3 */
    if (formEl) formEl.inert = false;
    errorOverlay.remove();
    if (callback) callback();
  });

  el.appendChild(errorOverlay);
};

export const logFailure = (el, msg) => {
  if (el.dataset.mktoFailed) return;
  const tags = debugTags();
  el.dataset.mktoFailed = 'true';
  window.lana?.log(msg, { tags: tags.join(','), severity: 'e', sampleRate: 100 });
  decorateOverlay(el, `${msg}: ${tags.join(', ')}`, () => { window.location.reload(); });
};

export const formTimeout = (el, condition, message, timeout = FAILURE_TIMEOUT) => {
  setTimeout(() => {
    if (condition()) {
      logFailure(el, message);
    }
  }, timeout);
};

const toggleSuccessSection = (formData) => {
  showSuccessSection(formData);
  hideSuccessSection(formData);
};

export const formSubmit = (formEl) => {
  const el = formEl.closest('.marketo');
  const testRecord = window.mkto_isTestRecord?.();
  if (testRecord && testRecord !== 'not_test') return;
  formTimeout(el, () => !el.classList.contains('success'), LANA_MESSAGE.SUBMIT_FAILED);
};

export const formSuccess = (formEl, formData) => {
  const el = formEl.closest('.marketo');
  const parentModal = formEl?.closest('.dialog-modal');
  const mktoSubmit = new Event('mktoSubmit');

  el.classList.add('success');
  window.dispatchEvent(mktoSubmit);
  window.mktoSubmitted = true;

  if (formData?.[SUCCESS_TYPE] === 'ims') {
    const redirect = getMetadata('marketo-ims-redirect');

    if (!redirect?.startsWith('https://')) {
      window?.lana.log('Marketo IMS failure, full url needed for redirect', { tags: 'marketo', severity: 'i' });
      return false;
    }

    const emailInput = formEl.querySelector('input[name="Email"]');
    const email = emailInput?.value;
    const param = getMetadata('marketo-ims');

    if (param && email) {
      window.location.href = `${redirect}?${param}=${encodeURIComponent(email)}`;
    } else {
      window?.lana.log('Marketo IMS failure, missing data', { tags: 'marketo', severity: 'e' });
    }
    return false;
  }

  /* c8 ignore next 5 */
  if (parentModal) {
    const closeButton = parentModal.querySelector('.dialog-close');
    closeButton.click();
    return false;
  }

  if (formData?.[SUCCESS_TYPE] !== 'section') return true;
  toggleSuccessSection(formData);
  setDataLayer(SUCCESS_TYPE, 'message');
  return false;
};

const readyForm = (form, formData) => {
  const formEl = form.getFormElem().get(0);
  const el = formEl.closest('.marketo');
  const isDesktop = matchMedia('(min-width: 900px)');
  el.classList.remove('loading');

  const handleIframeReady = (event) => {
    if (event.origin !== 'https://engage.adobe.com') return;
    const message = JSON.parse(event.data);
    if (!message.mktoReady) return;
    const hadFailed = el.dataset.mktoFailed === 'true';
    setDataLayer(FORM_XDFRAME, 'ready');
    const formVisible = isVisible(formEl);
    if (hadFailed && formVisible) {
      window.lana?.log(LANA_MESSAGE.RENDER_RECOVERED, { tags: 'marketo,render-recovered', severity: 'i', sampleRate: 100 });
      delete el.dataset.mktoFailed;
      el.querySelector('.marketo-overlay')?.remove();
      formEl.inert = false;
    }
    window.removeEventListener('message', handleIframeReady);
  };
  window.addEventListener('message', handleIframeReady);
  formTimeout(el, () => getDataLayer(FORM_XDFRAME) !== 'ready', LANA_MESSAGE.HANDSHAKE_FAILED);

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
  form.onSubmit(() => formSubmit(formEl));
  form.onSuccess(() => formSuccess(formEl, formData));
};

export const loadMarketo = (el, formData) => {
  setDataLayer(FORM_STATUS, 'loading');
  const baseURL = formData[BASE_URL];
  const munchkinID = formData[MUNCHKIN_ID];
  const formID = formData[FORM_ID];
  const { base } = getConfig();

  return loadScript(`${base}/deps/forms2.min.js`)
    .then(() => {
      const { MktoForms2 } = window;
      if (!MktoForms2) throw new Error('Marketo forms not loaded');

      formTimeout(el, () => !isVisible(el.querySelector('form')), LANA_MESSAGE.RENDER_FAILED);
      MktoForms2.loadForm(`//${baseURL}`, munchkinID, formID, () => { setDataLayer(FORM_STATUS, 'loaded'); });
      MktoForms2.whenReady((form) => { readyForm(form, formData); });

      /* c8 ignore next 3 */
      if (el.classList.contains('multi-step')) {
        import('./marketo-multi.js').then(({ default: multiStep }) => multiStep(el));
      }
    })
    .catch(() => {
      /* c8 ignore next 2 */
      el.style.display = 'none';
      logFailure(el, LANA_MESSAGE.MARKETO_FORMS_JS);
    });
};

function decorateForm(el, formData) {
  const formID = formData[FORM_ID];
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
  el.classList.add('loading');

  const stepPreferences = formData['form.fldStepPref'] || {};
  const count = Object.values(stepPreferences).findLastIndex((fields) => fields?.length) + 1 || 1;

  /* c8 ignore next 6 */
  if (count > 1) {
    el.classList.add(`multi-${count}`);
  }
  if (el.classList.contains('multi-2') || el.classList.contains('multi-3')) {
    el.classList.add('multi-step');
  }
}

export default async function init(el) {
  setDataLayer(FORM_STATUS, 'init');
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

  /* c8 ignore next 4 */
  if (!formID || !baseURL || !munchkinID) {
    el.style.display = 'none';
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const ungated = searchParams.get(FORM_PARAM) === 'off';

  if (formData[SUCCESS_TYPE] === 'section' && ungated) {
    el.classList.add('hide-block');
    toggleSuccessSection(formData);
    return;
  }

  const imsSuccessType = getMetadata('marketo-ims');

  if (imsSuccessType) {
    formData[SUCCESS_TYPE] = 'ims';
  }

  formData[SUCCESS_TYPE] = formData[SUCCESS_TYPE] || 'redirect';

  if (formData[SUCCESS_TYPE] === 'redirect') {
    const destinationUrl = await decorateURL(formData[SUCCESS_CONTENT]);

    if (destinationUrl) formData[SUCCESS_CONTENT] = destinationUrl;
  }

  formData[FORM_STATUS] = 'decorated';
  setDataLayerObj(formData);
  decorateForm(el, formData);

  loadLink(`https://${baseURL}`, { rel: 'dns-prefetch' });

  createIntersectionObserver({
    el,
    callback: (target) => {
      loadMarketo(target, formData);
    },
    options: { rootMargin: `${ROOT_MARGIN}px` },
  });
}
