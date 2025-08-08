import { createTag, getConfig, getFederatedUrl, localizeLink } from '../../utils/utils.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';
import { closeModal } from '../modal/modal.js';

// Maybe move this to object and remap names
const FORM_CONFIG = {
  'campaign-id': 'campaignId',
  'mps-sname': 'mpsSname',
  'subscription-name': 'subscriptionName',
};
const FORM_ID = 'email-collection-form';
const ALL_COUNTRIES_CONSENT_ID = 'cs4;ve1;';
const FEDERAL_ROOT = '/federal/email-collection';
const ECID_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const SUBMIT_FORM_ENDPOINTS = {
  // stage: 'https://14257-miloemailcollection-dev.adobeioruntime.net/api/v1/web/email-collection/form-submit',
  stage: 'https://www.stage.adobe.com/milo-email-collection-api/form-submit',
  prod: 'https://www.adobe.com/milo-email-collection-api/form-submit',
};
const miloConfig = getConfig();

function localizeFederatedUrl(url) {
  return localizeLink(getFederatedUrl(url), '', true);
}
const ALL_COUNTRIES_CONSENT_URL = localizeFederatedUrl(`${FEDERAL_ROOT}/consents/cs4.plain.html`);

const FORM_FIELDS = {
  email: {
    tag: 'input',
    attributes: {
      type: 'email',
      required: true,
      autocomplete: 'email',
    },
  },
  'first-name': {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'given-name',
    },
  },
  'last-name': {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'family-name',
    },
  },
  organization: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'on',
    },
  },
  occupation: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'on',
    },
  },
  state: {
    tag: 'select',
    url: getFederatedUrl(`${FEDERAL_ROOT}/states.json?limit=1900`),
    attributes: {
      required: true,
      autocomplete: 'on',
    },
  },
  country: {
    tag: 'select',
    url: localizeFederatedUrl(`${FEDERAL_ROOT}/countries.json`),
    attributes: {
      required: true,
      autocomplete: 'on',
    },
  },
  custom: { tag: 'textarea', attributes: {} },
};

const [showMessage, setMessageEls] = (() => {
  let elsObject = {};
  return [
    (type, errorMsg) => {
      const { foreground, success, error, text, ariaLive } = elsObject;
      text.classList.add('hidden');
      let replace = success;
      if (type === 'error') replace = error;
      foreground.classList.add('message');
      replace.classList.remove('hidden');
      if (errorMsg) window.lana.log(errorMsg);
      console.log(errorMsg);

      let ariaTextContent = '';
      replace.querySelectorAll('.text > *:not(.icon-area, .button-container)')
        .forEach((child) => { ariaTextContent += ` ${child.textContent}`; });
      ariaLive.textContent = ariaTextContent;
    },
    (el) => {
      const foreground = el.children[0];
      const allText = foreground.querySelectorAll('.text');
      elsObject = {
        foreground,
        success: allText[1],
        error: allText[2],
        text: allText[0],
        ariaLive: el.children[1],
      };

      return Object.values(elsObject).every((value) => value);
    },
  ];
})();

async function getIMS() {
  if (window.adobeIMS) return window.adobeIMS;
  return new Promise((resolve) => {
    const imsInterval = setInterval(() => {
      if (!window.adobeIMS) return;
      clearInterval(imsInterval);
      resolve(window.adobeIMS);
    }, 100);
  });
}

async function insertProgress(el, size = 'm') {
  if (!el) return;
  const { base } = miloConfig;
  await Promise.all([
    import('../../deps/lit-all.min.js'),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
    import(`${base}/features/spectrum-web-components/dist/progress-circle.js`),
  ]);
  if (el.tagName === 'BUTTON') {
    const { width } = window.getComputedStyle(el);
    el.style.width = width;
  }
  const theme = createTag(
    'sp-theme',
    {
      system: 'spectrum',
      color: 'light',
      scale: 'medium',
      class: 'progress-circle-container',
    },
  );
  const progress = createTag(
    'sp-progress-circle',
    {
      label: 'Loading content',
      indeterminate: true,
      size,
    },
  );
  theme.appendChild(progress);
  el.replaceChildren(theme);
}

function formatMetadataKey(key) {
  return key?.toLowerCase().trim().replaceAll(/\s+/g, '-');
}

const [getMetadata, setMetadata] = (() => {
  let emailCollectionMetada;
  return [
    () => (emailCollectionMetada),
    (el) => {
      emailCollectionMetada = { fields: {}, config: {} };
      const { fields, config } = emailCollectionMetada;
      const metadataEl = el.nextElementSibling;
      if (!metadataEl?.classList.contains('section-metadata')) {
        return 'Section metadata is missing';
      }

      [...metadataEl.children].forEach((child) => {
        const key = formatMetadataKey(child.firstElementChild?.textContent);
        if (!FORM_FIELDS[key] && !FORM_CONFIG[key]) return;
        const value = child.lastElementChild.textContent;
        const metadataObject = FORM_CONFIG[key] ? config : fields;
        const newKey = FORM_CONFIG[key] ?? key;
        metadataObject[newKey] = value;
      });

      if (!fields.email || !config.campaignId || (!el.classList.contains('waitlist') && !config.mpsSname && !config.subscriptionName)) {
        return 'Section metadata is missing email/campaing-id/mps-sname/subscription-name field';
      }
      return null;
    },
  ];
})();

function formatStateData(data) {
  const formattedData = {};
  data.forEach((state) => {
    const { countryCode, stateCode, stateName } = state;
    if (!countryCode) return;
    formattedData[countryCode] = formattedData[countryCode] ?? [];
    formattedData[countryCode].push({ stateCode, stateName });
  });
  return formattedData;
}

const selectMapping = {
  country: {
    value: 'countryCode',
    text: 'countryName',
    format: (data) => data,
  },
  state: {
    value: 'stateCode',
    text: 'stateName',
    format: formatStateData,
    hide: true,
  },
};

const getSelectData = (() => {
  const dataCache = {};
  return async (id) => {
    if (dataCache[id]) return dataCache[id];
    try {
      const { url } = FORM_FIELDS[id];
      const selectReq = await fetch(url);
      if (!selectReq.ok) {
        showMessage('error', `Select data not found: ${url}`);
        return null;
      }
      const { data } = await selectReq.json();
      dataCache[id] = selectMapping[id].format(data);
      return dataCache[id];
    } catch (e) {
      showMessage('error', e);
      return null;
    }
  };
})();

async function getConsentString(url) {
  try {
    if (!url) return null;
    const stringReq = await fetch(url);
    if (!stringReq.ok) {
      showMessage('error', `Consent string document not found: ${url}`);
      return null;
    }
    const string = await stringReq.text();
    const doc = new DOMParser().parseFromString(string, 'text/html');
    const consentDiv = doc.querySelector('body > div');
    return consentDiv.cloneNode(true);
  } catch (e) {
    showMessage('error', e);
    return null;
  }
}

async function decorateConsentString(consentContainer, url) {
  consentContainer.classList.add('empty');
  const consentStringEl = await getConsentString(url, url);
  if (!consentStringEl) return;

  const { config } = getMetadata();
  // Check if this is the same as sname
  if (config.subscriptionName) {
    const { subscriptionName } = config;
    const regex = /{{subscription-name}}/g;
    consentStringEl.innerHTML = consentStringEl.innerHTML.replaceAll(regex, subscriptionName);
  }
  consentContainer.appendChild(consentStringEl);
  consentContainer.classList.remove('empty');
  decorateDefaultLinkAnalytics(consentContainer, miloConfig);
}

function hideSelect({ selectWrapper, select, label, shouldHide = true }) {
  selectWrapper.classList.toggle('hide-select', shouldHide);
  label.classList.toggle('hide-select', shouldHide);
  select.toggleAttribute('required', !shouldHide);
}

function populateSelect(select, data) {
  const id = select.getAttribute('id');
  const { value, text } = selectMapping[id];
  const placeholder = select.getAttribute('data-select-placeholder');
  const placeholderOption = placeholder ? [{ [value]: '', [text]: placeholder.trim() }] : [];
  [...placeholderOption, ...data].forEach((optionData) => {
    const option = createTag('option', { value: optionData[value] }, optionData[text]);
    select.appendChild(option);
  });
}

async function decorateSelect(id, label, placeholder) {
  const data = await getSelectData(id);
  if (!data) return null;
  const selectWrapper = createTag('div', { class: 'select-wrapper' });
  const select = createTag(
    'select',
    {
      id,
      name: id,
      'data-select-placeholder': placeholder?.trim() ?? label.textContent.trim(),
    },
  );

  if (selectMapping[id].hide) hideSelect({ selectWrapper, select, label });
  else populateSelect(select, data);
  selectWrapper.append(select);
  return selectWrapper;
}

async function decorateInput(key, value) {
  let input;
  const { tag, attributes } = FORM_FIELDS[key];
  const [labelText, placeholder] = value.split('|');
  const label = createTag(
    'label',
    {
      for: key,
      class: 'body-xs',
    },
    labelText.trim(),
  );

  if (tag === 'select') {
    input = await decorateSelect(key, label, placeholder);
    if (!input) return [];
  }

  input = input ?? createTag(
    tag,
    {
      name: key,
      id: key,
      placeholder: placeholder?.trim() ?? labelText.trim(),
    },
  );
  Object.entries(attributes).forEach(([confKey, confValue]) => {
    const tempInput = input.querySelector(':scope > select') ?? input;
    tempInput?.setAttribute(confKey, confValue);
  });
  label.classList.toggle('required', !!attributes.required);

  return [label, input];
}

async function attachCountryListener(form) {
  const country = form.querySelector(':scope > .select-wrapper #country');
  const stateWrapper = form.querySelector(':scope > .select-wrapper:has(#state)');
  const stateSelect = stateWrapper?.querySelector(':scope > select');
  const label = form.querySelector(':scope > label[for="state"]');
  const stateData = await getSelectData('state');
  country?.addEventListener('change', (e) => {
    const { value: countryCode } = e.target;
    if (!stateWrapper || !label || !stateData) return;
    stateSelect.innerHTML = '';
    hideSelect({
      selectWrapper: stateWrapper,
      select: stateSelect,
      shouldHide: !stateData[countryCode],
      label,
    });
    if (!stateData[countryCode]) return;
    populateSelect(stateSelect, stateData[countryCode]);
  });
}

function formatMPSData(data) {
  const date = new Date();
  const required = ['email', 'consentId', 'appClientId', 'mpsSname'];
  let result = {
    eventDts: date.toISOString(),
    timezoneOffset: -date.getTimezoneOffset(),
  };
  Object.entries(data).forEach(([key, value]) => {
    if (required.includes(key) || key.startsWith('mps')) {
      result = { ...result, [key]: value };
    }
  });

  return result;
}

function disableForm(form) {
  form.querySelectorAll('input, select, textarea, button').forEach((el) => {
    el.disabled = true;
  });
}

function appendLangToConsnetId(consentId) {
  const { locale } = miloConfig;
  const languageOverride = {
    'zh-CN': 'chi',
    'zh-HK': 'zho',
    'zh-TW': 'zho',
  };
  const language = languageOverride[locale.ietf] ?? locale.ietf.split('-')[0];
  return consentId + language;
}

async function getMartech() {
  // eslint-disable-next-line
  const satellite = await window.__satelliteLoadedPromise;

  return { satellite, alloyAll: window.alloy_all };
}

async function getAEPBody(email) {
  const martechParam = new URLSearchParams(window.location.search).get('martech');
  if (martechParam === 'off') {
    showMessage('error', 'Martech disabled');
    return null;
  }
  const { satellite, alloyAll } = await getMartech();
  const { config } = getMetadata();
  // const ecid = satellite?.cookie.get(ECID_COOKIE)?.split('|')[1];
  const ecid = decodeURIComponent(satellite?.cookie.get(ECID_COOKIE)).split('|')[1];
  const ims = await getIMS();
  const isSignedInUser = ims.isSignedInUser();
  const guid = isSignedInUser ? alloyAll?.xdm.identityMap?.adobeGUID[0].id : 'not-signed-in';
  if (!ecid || !guid) {
    showMessage('error', 'Missing ecid or guid');
    return null;
  }

  const body = {
    events: [
      {
        xdm: {
          identityMap: {
            adobeGUID: [{ id: guid, primary: isSignedInUser }],
            ECID: [{ id: ecid, primary: !isSignedInUser }],
            Email: [{ id: email, primary: false }],
          },
          eventType: 'web.webinteraction.linkClicks',
          web: {
            webInteraction: { linkClicks: { value: 1 }, name: 'Form Submission' },
            timestamp: new Date().toISOString(),
          },
          marketing: { trackingCode: config.campaignId },
        },
      },
    ],
  };
  return body;
}

async function sendFormData(form) {
  let messageType = 'success';
  let errorMsg;
  try {
    const { config } = getMetadata();
    const formData = Object.fromEntries(new FormData(form));
    disableForm(form);
    const consentId = ALL_COUNTRIES_CONSENT_ID;
    const { imsClientId } = miloConfig;
    const { mpsSname } = config;
    const { email } = formData;

    const date = new Date();
    const mpsBody = {
      consentId: appendLangToConsnetId(consentId),
      mpsSname,
      appClientId: imsClientId,
      eventDts: date.toISOString(),
      timezoneOffset: -date.getTimezoneOffset(),
      email,
    };
    const aepBody = await getAEPBody(email);
    if (!aepBody) return;
    const ims = await getIMS();
    const { token } = ims.getAccessToken() ?? {};
    const { env } = miloConfig;
    const endPoint = SUBMIT_FORM_ENDPOINTS[env.name] ?? SUBMIT_FORM_ENDPOINTS.stage;
    // console.log(mpsBody, aepBody);
    // await new Promise((resolve) => setTimeout(() => resolve(), 2000));
    const submitFormReq = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OW-EXTRA-LOGGING': 'on', // Delete this
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...mpsBody, aepBody }),
    });
    const submitFormRes = await submitFormReq.json();
    if (!submitFormReq.ok) {
      messageType = 'error';
      errorMsg = `MPS request failed: ${JSON.stringify(submitFormRes)}`;
    }
  } catch (e) {
    messageType = 'error';
    errorMsg = e;
  }
  showMessage(messageType, errorMsg);
}

// Refactor
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(email.value)) return true;
  // This can be authorable ?
  email.setCustomValidity('Please enter a valid email address.');
  email.reportValidity();
  email.addEventListener('input', () => email.setCustomValidity(''));
  return false;
}

// function validateForm(form, error) {
//   console.log(form);
//   const inputs = form.querySelectorAll('input');
//   inputs.forEach((input) => {
//     console.log(input.getAttribute('required'));
//     if (input.getAttribute('required')) {
//       error.classList.remove('hide');
//       input.previousElementSibling.setAttribute('aria-invalid', true);
//       input.setAttribute('aria-describedby', 'req-err');
//       input.setAttribute('aria-invalid', true);
//       // input.blur();
//       input.focus();
//     }
//   });
// }

async function decorateForm(el, foreground) {
  const { fields } = getMetadata();
  const text = foreground.querySelector('.text');

  if (!el.classList.contains('waitlist')) el.classList.add('mailing-list');

  const shouldSplitFirstRow = !el.classList.contains('mailing-list') && !el.classList.contains('large-image');
  const form = createTag('form', { id: FORM_ID, novalidate: true });
  // const error = createTag('p', { id: 'req-err', class: 'hide' }, 'Required Field *');
  // form.append(error);
  const inputs = [];
  for (const [key, value] of Object.entries(fields)) {
    // eslint-disable-next-line no-continue
    if (!FORM_FIELDS[key]) continue;
    const input = await decorateInput(key, value);
    inputs.push(...input);
  }

  if (shouldSplitFirstRow) {
    const firstRow = createTag('div', { class: 'split-row' });
    const [l1, i1, l2, i2] = inputs.splice(0, 4);
    [[l1, i1], [l2, i2]].forEach((li) => {
      const inputContainer = createTag('div');
      inputContainer.append(...li);
      firstRow.append(inputContainer);
    });
    inputs.unshift(firstRow);
  }

  form.append(...inputs);
  const submitButton = text.querySelector('.button-container');
  const consentStringContainer = createTag(
    'div',
    { class: 'body-xxs consent-string empty' },
  );

  form.append(consentStringContainer, submitButton);
  text.append(form);

  if (fields.country) attachCountryListener(form);
  await decorateConsentString(consentStringContainer, ALL_COUNTRIES_CONSENT_URL);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (consentStringContainer.classList.contains('empty')) return;
    const email = form.querySelector('#email');
    // const first = form.querySelector('#first-name');
    // email.setAttribute('autocomplete', 'off');
    // console.log(email.checkValidity());
    // email.setCustomValidity('Test');
    // console.log(email.checkValidity(), 'email');
    // email.reportValidity();
    // email.setAttribute('type', 'text');
    // email.removeAttribute('required');
    // email.setAttribute('readonly', true);
    // email.addEventListener('input', () => {
    //   email.setCustomValidity('');
    //   email.setAttribute('autocomplete', 'email');
      // email.setAttribute('required', true);
      // email.setAttribute('autocomplete', 'email');
      // console.log(email.checkValidity(), 'email');
    // }, { once: true });
    // if (!validateEmail(email)) return;
    // validateForm(form, error);

    await insertProgress(submitButton.querySelector('button'), 's');
    await sendFormData(form);
  });
}

function decorateButton(el, isFormButton) {
  const buttonText = el.textContent;
  const button = createTag(
    'button',
    {
      class: 'con-button blue',
      'aria-label': buttonText,
      ...(isFormButton && { type: 'submit', form: FORM_ID }),
    },
    buttonText,
  );
  if (!isFormButton) {
    button.addEventListener('click', function closeForm() {
      const modal = this.closest('.dialog-modal');
      closeModal(modal);
    });
  }
  const buttonContainer = createTag('div', { class: 'button-container' });
  buttonContainer.appendChild(button);
  el.replaceWith(buttonContainer);
}

async function decorateText(el, foreground) {
  for (const child of [...el.children]) {
    const isForeground = child === foreground;
    const text = isForeground ? child.lastElementChild : child.firstElementChild;
    text.classList.add('text');
    [...text.children].forEach((textEl) => {
      if (textEl.tagName === 'P'
        && textEl.childElementCount === 1
        && textEl.firstElementChild.tagName === 'STRONG') {
        decorateButton(textEl, isForeground);
      } else if (textEl.childElementCount === 1 && textEl.firstElementChild.tagName === 'PICTURE') {
        textEl.classList.add('icon-area');
      } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(textEl.tagName)) {
        textEl.classList.add('heading-l');
      } else {
        textEl.classList.add('body-m');
      }
    });
    if (!isForeground) {
      text.classList.add('hidden');
      text.parentElement.remove();
      foreground.appendChild(text);
    }
  }
  const ariaLive = createTag('div', {
    class: 'aria-live-container',
    'aria-live': 'polite',
    role: 'status',
  });
  el.appendChild(ariaLive);
}

export default async function init(el) {
  const blockChildren = [...el.children];
  await insertProgress(el, 'l');
  const ims = await getIMS();
  // if (el.classList.contains('waitlist') && !ims.isSignedInUser()) {
  //   ims.signIn();
  //   return;
  // }
  el.replaceChildren(...blockChildren);

  const foreground = el.children[0];
  foreground.classList.add('foreground');
  const successMessage = el.children[1];
  const errorMessage = el.children[2];
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  // Tests
  decorateText(el, foreground);

  const metadataError = setMetadata(el);
  if (metadataError) {
    showMessage('error', metadataError);
    return;
  }

  const media = foreground.querySelector(':scope > div:not([class])');
  media?.classList.add('image');
  const correctMessageEls = setMessageEls(el);
  if (!correctMessageEls) {
    showMessage('error', 'Missing success/error message');
    return;
  }
  try {
    await decorateForm(el, foreground);
  } catch (e) {
    showMessage('error', e);
  }
}
