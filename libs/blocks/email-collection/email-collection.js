import { decorateButtons } from '../../utils/decorate.js';
import { createTag, getConfig, getFederatedUrl, localizeLink } from '../../utils/utils.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';

// Remove consent related
const FORM_CONFIG = ['campaign-id', 'mps-sname'];
// Probably don't need this if button is inside the form
const FORM_ID = 'email-collection-form';
// const ALL_COUNTRIES_CONSENT_ID = 'cs3;v1;';
const FEDERAL_ROOT = '/federal/email-collection';

function createFederatedUrl(url) {
  return localizeLink(getFederatedUrl(url), '', true);
}
const ALL_COUNTRIES_CONSENT_URL = createFederatedUrl(`${FEDERAL_ROOT}/consents/cs4.plain.html`);

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
    url: getFederatedUrl(`${FEDERAL_ROOT}/countries.json`),
    attributes: {
      required: true,
      autocomplete: true,
    },
  },
  custom: { tag: 'textarea', attributes: {} },
};

function formatMetadataKey(key) {
  return key?.toLowerCase().trim().replaceAll(/\s+/g, '-');
}

function getEmailCollectionMetadata(el) {
  const metadata = el.nextElementSibling;
  const { fields, config } = { fields: {}, config: {} };
  if (!metadata?.classList.contains('email-collection-metadata')) {
    throw new Error('Email collection metadata is missing');
  }
  [...metadata.children].forEach((child) => {
    const key = formatMetadataKey(child.firstElementChild?.textContent);
    if (!FORM_FIELDS[key] && !FORM_CONFIG.includes(key)) return;
    const value = child.lastElementChild;
    // let metadataObject = emailCollectionMetadata.fields;
    const metadataObject = FORM_CONFIG.includes(key) ? config : fields;
    metadataObject[key] = value;
  });

  if (!fields.email) {
    throw new Error('Email collection form is missing email field');
  }

  // sname is not required for non newsletter mailing list
  if (!Object.keys(config).every((key) => FORM_CONFIG.includes(key))) {
    throw new Error('Email collection metadata is missing a config field');
  }

  return { fields, config };
}

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

// Maybe have different for fetch and getState/Country
const getSelectData = (() => {
  const dataCache = {};
  return async (id) => {
    if (dataCache[id]) return dataCache[id];
    try {
      const { url } = FORM_FIELDS[id];
      const selectReq = await fetch(url);
      if (!selectReq.ok) return null;
      const { data } = await selectReq.json();
      dataCache[id] = selectMapping[id].format(data);
      return dataCache[id];
    } catch (e) {
      return null;
    }
  };
})();

const getConsentString = (() => {
  const consentCache = {};
  return async (url, countryCode) => {
    if (!url && !countryCode) return null;
    let consentUrl = url;
    if (!consentUrl) {
      const countries = await getSelectData('country');
      const { consentPath } = countries.find((c) => c.countryCode === countryCode);
      consentUrl = createFederatedUrl(`${consentPath}.plain.html`);
    }
    if (consentCache[consentUrl]) return consentCache[consentUrl];
    const stringReq = await fetch(consentUrl);
    // Think about this
    if (!stringReq.ok) throw new Error();
    const string = await stringReq.text();
    const doc = new DOMParser().parseFromString(string, 'text/html');
    const consentDiv = doc.querySelector('body > div');
    consentCache[consentUrl] = consentDiv;
    // Possible throw
    return consentDiv;
  };
})();

// Think about localizing links here instead of manually
// console.log(localizeLink('https://adobe.com/privacy.html', '', true));
async function decorateConsentString(consentContainer, consentParams) {
  consentContainer.innerHTML = '';
  const { url, countryCode } = consentParams;
  const consentStringEl = await getConsentString(url, countryCode);
  if (!consentStringEl) return;

  const ul = consentStringEl.querySelector('ul');
  const container = createTag('div');
  // Need to think still
  if (ul) {
    [...ul.children].forEach((li) => {
      const checkboxContainer = createTag('div', { class: 'checkbox-container' });
      const [text, id] = li.textContent.split('|');
      const required = [...li.querySelectorAll('strong')]
        .some((strong) => strong.textContent.trim() === id.trim());
      const label = createTag('label', { for: `mps-${id.trim()}` }, text.trim());
      const checkbox = createTag(
        'input',
        {
          type: 'checkbox',
          name: `mps-${id.trim()}`,
          id: `mps-${id.trim()}`,
          ...(required && { required: true }),
        },
      );
      checkboxContainer.append(checkbox, label);
      container.appendChild(checkboxContainer);
    });
    ul.replaceWith(container);
  }
  consentContainer.appendChild(consentStringEl);
  decorateDefaultLinkAnalytics(consentContainer, getConfig());
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
  const [labelText, placeholder] = value.textContent.split('|');
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
  label.classList.toggle('required', attributes.required);

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

async function decorateForm(el, text) {
  const { fields } = getEmailCollectionMetadata(el);

  // Think about variants
  if (Object.keys(fields).length === 1
    && fields.email) el.classList.add('mailing-list');

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
  // TODO: Will be refactored when form is connected to backend
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // const formData = new FormData(form);
    // console.log('Form data submitted:', Object.fromEntries(formData));
    // Send request to MPS and AEP

    const foreground = el.children[0];
    foreground.classList.add('success-message');
    const successMessage = el.children[1].querySelector('.text');
    text.replaceWith(successMessage);
  });

  const submitContainer = createTag('div', { class: 'submit-button' });
  const submitButton = createTag(
    'button',
    {
      type: 'submit',
      class: 'con-button blue',
      form: FORM_ID, // Maybe don't need this
    },
  );
  const submitText = text.lastElementChild;
  submitButton.textContent = submitText.textContent;
  submitText.remove();
  submitContainer.append(submitButton);

  const consentStringContainer = createTag(
    'div',
    { class: 'body-xxs consent-string' },
  );

  // Think of a better way to distignuish if we need all country consent string maybe ask about this
  // Move url
  if (!fields.country) {
    await decorateConsentString(consentStringContainer, { url: ALL_COUNTRIES_CONSENT_URL });
  }

  form.append(consentStringContainer, submitContainer);
  text.append(form);

  if (fields.country) attachCountryListener(form);
}

async function decorateText(el) {
  for (const child of [...el.children]) {
    const isForeground = child.classList.contains('foreground');
    const text = isForeground ? child.lastElementChild : child.firstElementChild;
    text.classList.add('text');
    [...text.children].forEach((textEl) => {
      if (textEl.classList.contains('action-area')) return;
      if (textEl.childElementCount === 1 && textEl.firstElementChild.tagName === 'PICTURE') {
        textEl.classList.add('icon-area');
      } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(textEl.tagName)) {
        textEl.classList.add('heading-l');
      } else {
        textEl.classList.add('body-m');
      }
    });
    if (isForeground) await decorateForm(el, text);
  }
}

export default async function init(el) {
  const foreground = el.children[0];
  foreground.classList.add('foreground');
  const successMessage = el.children[1];
  if (!successMessage) {
    throw new Error('Success message text is missing');
  }
  successMessage.classList.add('hidden');
  decorateButtons(el);
  // ACCESSIBILITY
  // FIX STYLE BUGS
  await decorateText(el);
  const media = foreground.querySelector(':scope > div:not([class])');
  media?.classList.add('image');
}
