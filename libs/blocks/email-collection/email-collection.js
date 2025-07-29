import { createTag, getConfig, getFederatedUrl, localizeLink } from '../../utils/utils.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';
import { closeModal } from '../modal/modal.js';

// Maybe move this to object and remap names
const FORM_CONFIG = ['campaign-id', 'mps-sname', 'subscription-name'];
const FORM_ID = 'email-collection-form';
const ALL_COUNTRIES_CONSENT_ID = 'cs4;ve1;';
const FEDERAL_ROOT = '/federal/email-collection';
const ECID_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const SUBMIT_FORM_ENDPOINTS = {
  stage: 'https://14257-miloemailcollection-stage.adobeioruntime.net/api/v1/web/email-collection/form-submit',
  prod: 'https://14257-miloemailcollection.adobeioruntime.net/api/v1/web/email-collection/form-submit',
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
      autocomplete: true,
    },
  },
  'first-name': {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: true,
    },
  },
  'last-name': {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: true,
    },
  },
  organization: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: true,
    },
  },
  occupation: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: true,
    },
  },
  state: {
    tag: 'select',
    url: getFederatedUrl(`${FEDERAL_ROOT}/states.json?limit=1900`),
    attributes: {
      required: true,
      autocomplete: true,
    },
  },
  country: {
    tag: 'select',
    url: localizeFederatedUrl(`${FEDERAL_ROOT}/countries.json`),
    attributes: {
      required: true,
      autocomplete: true,
    },
  },
  custom: { tag: 'textarea', attributes: {} },
};

const [showMessage, setMessageEls] = (() => {
  let elsObject = {};
  return [
    (type, errorMsg) => {
      const { foreground, success, error, text } = elsObject;
      let replaceText = success;
      if (type === 'error') replaceText = error;
      foreground.classList.add('message');
      text.replaceWith(replaceText);
      if (errorMsg) window.lana.log(errorMsg);
    },
    (el) => {
      elsObject = {
        foreground: el.children[0],
        success: el.children[1]?.querySelector('.text'),
        error: el.children[2]?.querySelector('.text'),
        text: el.children[0].querySelector('.text'),
      };
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
        throw new Error('Email collection metadata is missing');
      }

      [...metadataEl.children].forEach((child) => {
        const key = formatMetadataKey(child.firstElementChild?.textContent);
        if (!FORM_FIELDS[key] && !FORM_CONFIG.includes(key)) return;
        const value = child.lastElementChild.textContent;
        const metadataObject = FORM_CONFIG.includes(key) ? config : fields;
        metadataObject[key] = value;
      });

      if (!fields.email || !config['campaign-id'] || (!el.classList.contains('waitlist') && !config['mps-sname'] && !config['subscription-name'])) {
        throw new Error('Email collection form is missing email/campaing-id/mps-sname/subscription-name field');
      }
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
      if (!selectReq.ok) throw new Error(`Select data not found: ${url}`);
      const { data } = await selectReq.json();
      dataCache[id] = selectMapping[id].format(data);
      return dataCache[id];
    } catch (e) {
      showMessage('error', e);
      return null;
    }
  };
})();

const getConsentString = (() => {
  const consentCache = {};
  return async (url, countryCode) => {
    try {
      if (!url && !countryCode) return null;
      let consentUrl = url;
      if (!consentUrl) {
        const countries = await getSelectData('country');
        const { consentPath } = countries.find((c) => c.countryCode === countryCode);
        consentUrl = localizeFederatedUrl(`${consentPath}.plain.html`);
      }
      if (consentCache[consentUrl]) return consentCache[consentUrl].cloneNode(true);
      const stringReq = await fetch(consentUrl);
      if (!stringReq.ok) throw new Error(`Consent string document not found: ${consentUrl}`);
      const string = await stringReq.text();
      const doc = new DOMParser().parseFromString(string, 'text/html');
      const consentDiv = doc.querySelector('body > div');
      consentCache[consentUrl] = consentDiv;
      return consentDiv.cloneNode(true);
    } catch (e) {
      showMessage('error', e);
      return null;
    }
  };
})();

async function decorateConsentString(consentContainer, consentParams) {
  const channelPrefix = 'mpschannel-';
  consentContainer.innerHTML = '';
  consentContainer.classList.add('empty');
  const { url, countryCode } = consentParams;
  const consentStringEl = await getConsentString(url, countryCode);
  if (!consentStringEl) return;

  const ol = consentStringEl.querySelectorAll('ol');
  if (ol.length) {
    ol.forEach((list) => {
      const container = createTag('div');
      [...list.children].forEach((li) => {
        const checkboxContainer = createTag('div', { class: 'checkbox-container' });
        const [, id] = li.textContent.split('::');
        const regex = new RegExp(`\\s*::${id}\\b`, 'g');
        const text = li.innerHTML.replace(regex, '');
        const required = id.trim().startsWith('required');
        const prefix = required ? '' : channelPrefix;
        const label = createTag('label', { for: prefix + id.trim() }, text.trim());
        const checkbox = createTag(
          'input',
          {
            type: 'checkbox',
            id: prefix + id.trim(),
            name: prefix + id.trim(),
            ...(required && { required: true }),
          },
        );
        checkboxContainer.append(checkbox, label);
        container.appendChild(checkboxContainer);
      });
      list.replaceWith(container);
    });
  }
  const { config } = getMetadata();
  if (config['subscription-name']) {
    const regex = /{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;
    consentStringEl.innerHTML = consentStringEl.innerHTML.replaceAll(regex, config['subscription-name']);
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
  // CHECK RTL
  label.classList.toggle('required', !!attributes.required);

  return [label, input];
}

async function attachCountryListener(form) {
  const country = form.querySelector(':scope > .select-wrapper #country');
  const stateWrapper = form.querySelector(':scope > .select-wrapper:has(#state)');
  const stateSelect = stateWrapper?.querySelector(':scope > select');
  const label = form.querySelector(':scope > label[for="state"]');
  const stateData = await getSelectData('state');
  const consentStringContainer = form.querySelector(':scope > .consent-string');
  country?.addEventListener('change', (e) => {
    const { value: countryCode } = e.target;
    decorateConsentString(consentStringContainer, { countryCode });
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
  const required = ['email', 'consentId', 'appClientId'];
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
  const language = locale.ietf.split('-')[0];
  return consentId + language;
}

async function getMartech() {
  // eslint-disable-next-line
  const satellite = await window.__satelliteLoadedPromise;
  const alloyAll = window.alloy_all;

  return { satellite, alloyAll };
}

async function getAEPBody(email) {
  const { satellite, alloyAll } = await getMartech();
  const { config } = getMetadata();
  const ecid = satellite.cookie.get(ECID_COOKIE).split('|')[1];
  const ims = await getIMS();
  const isSignedInUser = ims.isSignedInUser();
  const guid = alloyAll.xdm.identityMap?.adobeGUID[0].id ?? 'random value';
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
          marketing: { trackingCode: config['campaign-id'] },
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
    // Move config
    const { config } = getMetadata();
    const formData = Object.fromEntries(new FormData(form));
    disableForm(form);
    let consentId = ALL_COUNTRIES_CONSENT_ID;
    if (formData.country) {
      const countries = await getSelectData('country');
      const { consentId: id } = countries.find((c) => c.countryCode === formData.country);
      consentId = id;
    }
    const { imsClientId } = miloConfig;
    const mpsBody = formatMPSData({ ...formData, consentId: appendLangToConsnetId(consentId), 'mps-sname': config['mps-sname'], appClientId: imsClientId });
    const aepBody = await getAEPBody(formData.email);
    const ims = await getIMS();
    const { token } = ims.getAccessToken() ?? {};
    const { env } = miloConfig;
    const endPoint = SUBMIT_FORM_ENDPOINTS[env.name] ?? SUBMIT_FORM_ENDPOINTS.stage;
    console.log('AEP BODY', aepBody);
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
    console.log(submitFormRes);
    if (!submitFormReq.ok) {
      throw new Error(`MPS request failed: ${JSON.stringify(submitFormRes)}`);
    }
  } catch (e) {
    messageType = 'error';
    errorMsg = e;
  }
  showMessage(messageType, errorMsg);
}

async function decorateForm(el, foreground) {
  const { fields } = getMetadata();
  const text = foreground.querySelector('.text');

  if (!el.classList.contains('waitlist')) el.classList.add('mailing-list');

  const shouldSplitFirstRow = !el.classList.contains('mailing-list') && !el.classList.contains('large-image');
  const form = createTag('form', { id: FORM_ID });
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
  else await decorateConsentString(consentStringContainer, { url: ALL_COUNTRIES_CONSENT_URL });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (consentStringContainer.classList.contains('empty')) return;
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

async function decorateText(el) {
  for (const child of [...el.children]) {
    const isForeground = child.classList.contains('foreground');
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
  }
}

export default async function init(el) {
  const blockChildren = [...el.children];
  await insertProgress(el, 'l');
  setMetadata(el);
  const ims = await getIMS();
  // Maybe change to beta-waitlist
  if (el.classList.contains('waitlist') && !ims.isSignedInUser()) {
    ims.signIn();
    return;
  }
  el.replaceChildren(...blockChildren);

  const foreground = el.children[0];
  foreground.classList.add('foreground');
  const successMessage = el.children[1];
  const errorMessage = el.children[2];
  successMessage.classList.add('hidden');
  errorMessage.classList.add('hidden');
  // ACCESSIBILITY
  // Check design
  decorateText(el);
  const media = foreground.querySelector(':scope > div:not([class])');
  media?.classList.add('image');
  setMessageEls(el);
  try {
    // await sendAEPData('ratko@test.com', '11111');
    await decorateForm(el, foreground);
  } catch (e) {
    showMessage('error', e);
  }
}
