import { createTag, getConfig } from '../../utils/utils.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';
import { closeModal } from '../modal/modal.js';
import {
  getIMS,
  getIMSProfile,
  getIMSAccessToken,
  getApiEndpoint,
  createAriaLive,
  updateAriaLive,
  getFormData,
  setFormData,
  getAEPData,
  disableForm,
  FORM_FIELDS,
} from './utils.js';

const miloConfig = getConfig();
const FORM_ID = 'email-collection-form';

function showHideSubscribedMessage(el, subscribed, email) {
  el.querySelector('.button-container:not(.reset-form)')?.classList.toggle('hidden', subscribed);
  el.querySelector('.reset-form')?.classList.toggle('hidden', !subscribed);
  const emailEl = el.querySelector('.subscribed-email');
  if (emailEl) emailEl.textContent = email;
  emailEl?.classList.toggle('hidden', !subscribed);
}

export const [showHideMessage, setMessageEls] = (() => {
  let elsObject = {};
  return [
    ({ errorMsg, subscribed = false, email, hideMessage = false }) => {
      const { foreground, success, error, form } = elsObject;
      [form, success, error].forEach((el) => el.classList.add('hidden'));
      form.classList.toggle('hidden', !hideMessage);
      let replace = success;
      if (errorMsg) {
        window.lana?.log(errorMsg);
        replace = error;
      }
      foreground.classList.toggle('message', !hideMessage);
      replace.classList.toggle('hidden', hideMessage);

      showHideSubscribedMessage(replace, subscribed, email);

      if (hideMessage) {
        const emailEl = form.querySelector('#email');
        if (emailEl) emailEl.value = '';
        emailEl?.focus();
      }
      updateAriaLive(replace);
    },
    (children) => {
      const foreground = children[0];
      elsObject = {
        foreground,
        form: foreground.children[1],
        success: children[1].firstElementChild,
        error: children[2].firstElementChild,
      };
      return Object.values(elsObject).every((value) => value);
    },
  ];
})();

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

async function decorateInput(key, value) {
  const profile = await getIMSProfile();
  let inputValue = profile[key];
  const { tag, attributes } = FORM_FIELDS[key];
  const [labelText, placeholder] = value.split('|');
  const label = createTag(
    'label',
    { for: key, class: 'body-xs' },
    labelText.trim(),
  );

  if (key === 'country') {
    const { countries } = await getFormData('config');
    inputValue = countries[inputValue];
    if (!inputValue) return null;
  }

  const input = createTag(
    tag,
    {
      name: key,
      id: key,
      placeholder: placeholder?.trim() ?? labelText.trim(),
      ...(inputValue && { value: inputValue }),
    },
  );
  Object.entries(attributes).forEach(([attrKey, attrValue]) => {
    input?.setAttribute(attrKey, attrValue);
  });
  label.classList.toggle('required', !!attributes.required);
  const container = createTag('div', { class: 'input-container' });
  container.append(label, input);
  if (input.getAttribute('readonly') === null) {
    const error = createTag('div', { id: `error-${key}`, class: 'body-xs hidden' });
    container.append(error);
  }
  return container;
}

async function sendForm(form) {
  const messageParams = {
    errorMsg: '',
    subscribed: false,
    email: '',
  };
  const { email, occupation, organization } = Object.fromEntries(new FormData(form));
  const button = form.querySelector('button[type="submit"]');
  const buttonContent = button.textContent;
  updateAriaLive('Form loading');
  disableForm(form);
  await insertProgress(button, 's');

  try {
    const { imsClientId } = miloConfig;
    const { mpsSname, consentId, campaignId } = getFormData('metadata');
    messageParams.email = email;

    const date = new Date();
    const mpsData = {
      consentId,
      mpsSname,
      appClientId: imsClientId,
      eventDts: date.toISOString(),
      timezoneOffset: -date.getTimezoneOffset(),
    };
    const aepData = await getAEPData();
    if (!aepData) return;
    const token = await getIMSAccessToken();
    const submitFormReq = await fetch(getApiEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OW-EXTRA-LOGGING': 'on', // Delete this
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...mpsData,
        ...aepData,
        campaignId,
        occupation,
        organization,
        email,
      }),
    });
    if (!submitFormReq.ok) {
      const submitFormRes = await submitFormReq.json();
      messageParams.errorMsg = `Form submit request failed: ${JSON.stringify(submitFormRes)}`;
    }
    if (submitFormReq.status === 204) messageParams.subscribed = true;
  } catch (e) {
    messageParams.errorMsg = e;
  }

  showHideMessage(messageParams);
  button.replaceChildren(buttonContent);
  disableForm(form, false);
}

function validateInput(input) {
  const { value, type } = input;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if ((type !== 'email' && !input.checkValidity())
  || (type === 'email' && !value)) return 'required';
  if (type === 'email' && !emailRegex.test(value)) return 'email';
  return '';
}

function showInputError(form, input, placeholders) {
  const { id } = input;
  const label = form.querySelector(`label[for=${id}]`);
  const error = form.querySelector(`div[id$=${id}]`);
  const errorType = validateInput(input);
  error.textContent = placeholders[errorType];

  if (errorType) input.setAttribute('aria-describedby', error.id);
  else input.removeAttribute('aria-describedby');

  input.classList.toggle('invalid', errorType);
  label.classList.toggle('invalid', errorType);
  error.classList.toggle('hidden', !errorType);

  return !!errorType;
}

async function validateForm(form) {
  const inputs = form.querySelectorAll('input:not([readonly])');
  let isInvalidForm = false;
  let focusInvalid;
  const { placeholders } = await getFormData('config');
  inputs.forEach((input) => {
    if (!showInputError(form, input, placeholders)) return;
    isInvalidForm = true;

    /* eslint-disable */ 
    if (!input._hasChangeListener) {
      input.addEventListener('change', () => showInputError(form, input, placeholders));
      input._hasChangeListener = true;
    }
    /* eslint-enable */
    const autocompleteValue = input.getAttribute('autocomplete');
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', () => {
      input.setAttribute('autocomplete', autocompleteValue);
    }, { once: true });

    if (!focusInvalid) focusInvalid = input;
  });

  focusInvalid?.blur();
  setTimeout(() => focusInvalid?.focus(), 50);

  return !isInvalidForm;
}

async function decorateForm(el, foreground) {
  const fields = getFormData('fields');
  const text = foreground.querySelector('.text');

  const shouldSplitFirstRow = !el.classList.contains('large-image');
  const form = createTag('form', { id: FORM_ID, novalidate: true });
  const inputs = [];
  for (const [key, value] of Object.entries(fields)) {
    // eslint-disable-next-line no-continue
    if (!FORM_FIELDS[key]) continue;
    const input = await decorateInput(key, value);
    inputs.push(input);
  }

  if (shouldSplitFirstRow) {
    const firstRow = createTag('div', { class: 'split-row' });
    const [i1, i2] = inputs.splice(0, 2);
    firstRow.append(i1, i2);
    inputs.unshift(firstRow);
  }

  form.append(...inputs);
  const submitButton = text.querySelector('.button-container');
  const consentString = text.querySelector('.consent-string');
  if (!consentString) {
    showHideMessage({ errorMsg: 'Consent string is missing' });
    return;
  }

  form.append(consentString, submitButton);
  text.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isFormValid = await validateForm(form);
    if (!isFormValid) return;
    await sendForm(form);
  });
}

function decorateButton(el, isSubmit) {
  const buttonText = el.textContent;
  const button = createTag(
    'button',
    {
      class: 'con-button blue',
      'aria-label': buttonText,
      ...(isSubmit && { type: 'submit', form: FORM_ID }),
    },
    buttonText,
  );

  if (!isSubmit) {
    button.addEventListener('click', function closeForm() {
      closeModal(this.closest('.dialog-modal'));
    });
  }

  const buttonContainer = createTag('div', { class: 'button-container' });
  buttonContainer.appendChild(button);
  el.replaceWith(buttonContainer);
  return buttonContainer;
}

function decorateSubscribedMessage(text) {
  const lastChild = text?.lastElementChild;
  const em = lastChild?.querySelector('em');
  if (!lastChild || !em) return;
  const span = createTag(
    'span',
    {
      class: 'reset-form',
      role: 'button',
      tabindex: '0',
    },
    em?.textContent,
  );
  const email = createTag('p', { class: 'subscribed-email hidden body-m' });
  ['click', 'keydown'].forEach((eventType) => {
    span.addEventListener(eventType, (e) => {
      const { key, code } = e;
      if (eventType === 'keydown'
        && key !== 'Enter'
        && code !== 'Space') return;
      e.preventDefault();
      showHideMessage({ hideMessage: true });
    });
  });

  em.replaceWith(span);
  lastChild.classList.replace('body-m', 'body-xs');
  lastChild.before(email);
}

function decorateConsentString(text) {
  text.classList.add('body-xxs', 'consent-string');
  [...text.firstElementChild.childNodes].forEach((node) => {
    text.appendChild(node);
  });
  text.firstElementChild.remove();
}

async function decorateText(elChildren) {
  const foreground = elChildren[0];
  elChildren.forEach((child, childIndex) => {
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
      } else if (isForeground
        && textEl.childElementCount === 1 && textEl.firstElementChild.tagName === 'EM') {
        decorateConsentString(textEl);
      } else {
        textEl.classList.add('body-m');
      }
    });
    if (!isForeground) {
      text.classList.add('hidden');
      text.parentElement.remove();
      foreground.appendChild(text);
      if (childIndex === 1) decorateSubscribedMessage(text);
    }
  });
}

async function checkIsSubscribed() {
  const { mpsSname } = getFormData('metadata');
  const token = await getIMSAccessToken();
  const { email } = await getIMSProfile();
  // showHideMessage({ subscribed: true, email });
  // return true;

  try {
    const submitFormReq = await fetch(getApiEndpoint('is-subscribed'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OW-EXTRA-LOGGING': 'on', // Delete this
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, mpsSname }),
    });
    if (!submitFormReq.ok) return null;
    const { subscribed } = await submitFormReq.json();
    if (subscribed) showHideMessage({ subscribed, email });
    return subscribed;
  } catch (e) {
    // Log lana
    return null;
  }
}

async function decorate(el, blockChildren) {
  const ims = await getIMS();
  if (!ims.isSignedInUser()) {
    ims.signIn();
    return;
  }
  blockChildren[0].classList.add('foreground');
  blockChildren[1].classList.add('hidden');
  blockChildren[2].classList.add('hidden');
  blockChildren[0].querySelector(':scope > div:not([class])').classList.add('image');
  // Tests
  decorateText(blockChildren);
  decorateDefaultLinkAnalytics(blockChildren[0], miloConfig);

  const isSubscribed = await checkIsSubscribed();
  try {
    await decorateForm(el, blockChildren[0]);
    if (!isSubscribed) updateAriaLive(blockChildren[0]);
  } catch (e) {
    showHideMessage({ errorMsg: e });
  }
}

export default async function init(el) {
  const dialog = el.closest('.dialog-modal');
  dialog?.setAttribute('aria-label', 'Form loading');
  createAriaLive(el);
  const blockChildren = [...el.children];
  const configErrMessage = setFormData(el);
  if (configErrMessage) throw new Error(configErrMessage);
  const correctMessageEls = setMessageEls(blockChildren);
  if (!correctMessageEls) throw new Error('Missing success/error message');
  await insertProgress(el, 'l');
  decorate(el, blockChildren).then(() => el.replaceChildren(...blockChildren));
}
