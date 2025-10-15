import { createTag, getConfig } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';
import { closeModal } from '../modal/modal.js';
import {
  getIMS,
  getIMSProfile,
  getApiEndpoint,
  createAriaLive,
  updateAriaLive,
  getFormData,
  setFormData,
  getAEPData,
  disableForm,
  runtimePost,
  FORM_FIELDS,
} from './utils.js';

const miloConfig = getConfig();
const FORM_ID = 'email-collection-form';

function showHideSubscribedMessage(el, subscribed, email) {
  el.querySelector('.button-container')?.classList.toggle('hidden', subscribed);
  el.querySelector('p:has(.show-form)')?.classList.toggle('hidden', !subscribed);
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

      const replace = errorMsg ? error : success;
      if (errorMsg) window.lana?.log(errorMsg);

      foreground.classList.toggle('message', !hideMessage);
      form.classList.toggle('hidden', !hideMessage);
      replace.classList.toggle('hidden', hideMessage);

      showHideSubscribedMessage(replace, subscribed, email);
      updateAriaLive(replace);

      if (!hideMessage) return;
      const emailEl = form.querySelector('#email');
      if (emailEl) emailEl.value = '';
      emailEl?.focus();
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
  let staticColor;
  if (el.tagName === 'BUTTON') {
    const { width, height } = window.getComputedStyle(el);
    el.style.width = width;
    el.style.height = height;
    if (el.matches('.con-button.outline')) staticColor = 'white';
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
      'static-color': staticColor,
      size,
    },
  );

  theme.appendChild(progress);
  el.replaceChildren(theme);
}

function decorateSelect(data, id, placeholder) {
  const selectWrapper = createTag('div', { class: 'select-wrapper' });
  const select = createTag('select', { id, name: id });
  const optionPlaceholder = createTag('option', { value: '' }, placeholder?.trim());
  select.appendChild(optionPlaceholder);

  data.forEach(({ key, value }) => {
    const option = createTag('option', { value: key }, value);
    select.appendChild(option);
  });

  selectWrapper.appendChild(select);
  return selectWrapper;
}

async function decorateInput(key, value) {
  const profile = await getIMSProfile();
  let inputValue = profile[key];
  const { tag, attributes } = FORM_FIELDS[key];
  const [labelText, placeholder] = value.split('|');
  let input;

  const label = createTag(
    'label',
    { for: key, class: 'body-xs' },
    labelText.trim(),
  );

  if (key === 'country') {
    const { country: countries } = await getFormData('config');
    inputValue = countries?.[inputValue];
    if (!inputValue) return null;
  }

  if (key === 'state') {
    const { state: states } = await getFormData('config');
    const fields = getFormData('fields');
    const { country } = profile;
    if (!fields.country || !states?.[country]) return null;
    input = decorateSelect(states[country], key, placeholder ?? labelText);
  }

  input = input ?? createTag(
    tag,
    {
      name: key,
      id: key,
      placeholder: placeholder?.trim() ?? labelText.trim(),
      ...(inputValue && { value: inputValue }),
    },
  );

  Object.entries(attributes).forEach(([attrKey, attrValue]) => {
    const tempInput = input.querySelector('select') ?? input;
    tempInput?.setAttribute(attrKey, attrValue);
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

async function submitForm(form) {
  const messageParams = {
    errorMsg: '',
    subscribed: false,
    email: '',
  };
  const { email, occupation, organization, state } = Object.fromEntries(new FormData(form));
  const button = form.querySelector('button[type="submit"]');
  const buttonContent = button.textContent;
  updateAriaLive('Form loading');
  disableForm(form);
  await insertProgress(button, 's');

  try {
    const { imsClientId } = miloConfig;
    const { mpsSname } = getFormData('metadata');
    const { consentId } = await getFormData('consent');
    const { country } = await getIMSProfile();

    const date = new Date();
    const { guid, ecid } = await getAEPData();
    const bodyData = {
      ecid,
      guid,
      occupation,
      organization,
      email,
      countryCode: country,
      state,
      consentId,
      mpsSname,
      appClientId: imsClientId,
      eventDts: date.toISOString(),
      timezoneOffset: -date.getTimezoneOffset(),
    };

    const { error, data } = await runtimePost(
      getApiEndpoint(),
      bodyData,
      ['occupation', 'organization', 'state'],
    );

    if (error) messageParams.errorMsg = error;

    messageParams.email = email;
    const { subscribed } = data;
    messageParams.subscribed = subscribed;
  } catch (e) {
    messageParams.errorMsg = e.message;
  }

  showHideMessage(messageParams);
  button.replaceChildren(buttonContent);
  disableForm(form, false);
}

function setMaxHeightToForm(formContainer, restore) {
  if (restore) {
    formContainer.style.maxHeight = '';
    return;
  }
  const { height } = window.getComputedStyle(formContainer);
  const mq = window.matchMedia('(min-width: 700px)');
  if (!height) return;

  formContainer.style.maxHeight = mq.matches ? height : '';
  mq.addEventListener('change', () => {
    formContainer.style.maxHeight = mq.matches ? height : '';
  });
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
  const inputs = form.querySelectorAll('input:not([readonly]), select');
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

    focusInvalid = focusInvalid ?? input;
  });

  focusInvalid?.blur();
  setTimeout(() => focusInvalid?.focus(), 50);

  return !isInvalidForm;
}

async function decorateConsentString() {
  const { consentDiv } = await getFormData('consent');
  if (!consentDiv) return null;
  consentDiv.classList.add('body-xxs', 'consent-string');

  const { subscriptionName } = getFormData('metadata');
  const regex = /{{subscription-name}}/g;
  consentDiv.innerHTML = consentDiv.innerHTML.replaceAll(regex, subscriptionName);

  return consentDiv;
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
    if (input) inputs.push(input);
  }

  if (shouldSplitFirstRow) {
    const firstRow = createTag('div', { class: 'split-row' });
    const [i1, i2] = inputs.splice(0, 2);
    firstRow.append(i1, i2);
    inputs.unshift(firstRow);
  }

  form.append(...inputs);
  const submitButton = text.querySelector('.button-container');
  const consentString = await decorateConsentString();

  if (!consentString || !submitButton) {
    showHideMessage({ errorMsg: 'Form is missing consent string/submit button' });
    return;
  }

  form.append(consentString, submitButton);
  text.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMaxHeightToForm(text);
    const isFormValid = await validateForm(form);
    if (!isFormValid) return;
    await submitForm(form);
    setMaxHeightToForm(text, true);
  });
}

function transformCtaToBtn(el) {
  const buttonTypes = ['submit', 'close-form'];
  const link = el.querySelector('a');
  const type = new URL(link.href).hash.replace('#', '');
  if (!buttonTypes.includes(type)) return el;
  const button = createTag(
    'button',
    {
      class: link.className,
      'aria-label': link.textContent,
      ...(type === 'submit' && { type: 'submit', form: FORM_ID }),
    },
    link.innerHTML,
  );

  if (type === 'close-form') {
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
  const showForm = text.querySelector('a[href$="#show-form"]');
  const email = createTag('p', { class: 'subscribed-email hidden body-m' });
  text.appendChild(email);

  if (!showForm) return;
  const span = createTag(
    'span',
    {
      class: 'show-form',
      role: 'button',
      tabindex: '0',
    },
    showForm.textContent,
  );

  ['click', 'keydown'].forEach((eventType) => {
    span.addEventListener(eventType, (e) => {
      const { key, code } = e;
      if (eventType === 'keydown' && key !== 'Enter' && code !== 'Space') return;
      e.preventDefault();
      showHideMessage({ hideMessage: true });
    });
  });

  const parent = showForm.parentElement ?? span;
  parent.classList.replace('body-m', 'body-xs');
  showForm.replaceWith(span);
  text.appendChild(parent);
}

function decorateText(elChildren) {
  const foreground = elChildren[0];
  elChildren.forEach((child, childIndex) => {
    const isForeground = child === foreground;
    const text = isForeground ? child.lastElementChild : child.firstElementChild;
    text.classList.add('text');
    decorateButtons(child);
    [...text.children].forEach((textEl) => {
      if (textEl.classList.contains('action-area')) {
        transformCtaToBtn(textEl);
      } else if (textEl.childElementCount === 1 && textEl.firstElementChild.tagName === 'PICTURE') {
        textEl.classList.add('icon-area');
      } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(textEl.tagName)) {
        textEl.classList.add('heading-l');
      } else {
        textEl.classList.add('body-m');
      }
    });

    if (isForeground) return;

    text.classList.add('hidden');
    text.parentElement.remove();
    foreground.appendChild(text);
    if (childIndex === 1) decorateSubscribedMessage(text);
  });
}

async function checkIsSubscribed() {
  const { mpsSname } = getFormData('metadata');
  const { email } = await getIMSProfile();

  const { data, error } = await runtimePost(getApiEndpoint('is-subscribed'), { email, mpsSname });
  const { subscribed } = data;

  if (subscribed) showHideMessage({ subscribed, email });
  else if (error) showHideMessage({ errorMsg: error });
  return subscribed;
}

function waitForModal() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(), 3000);
    window.addEventListener('milo:modal:loaded', () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
  });
}

async function decorate(el, blockChildren) {
  const ims = await getIMS();
  if (!ims.isSignedInUser()) {
    const dialog = el.closest('.dialog-modal');
    if (!document.body.contains(dialog)) await waitForModal();
    await ims.signIn();
    closeModal(dialog);
    return false;
  }

  blockChildren[0].classList.add('foreground');
  blockChildren[1].classList.add('hidden');
  blockChildren[2].classList.add('hidden');
  blockChildren[0].querySelector(':scope > div:not([class])').classList.add('image');

  decorateText(blockChildren);

  const isSubscribed = await checkIsSubscribed();
  try {
    await decorateForm(el, blockChildren[0]);
    decorateDefaultLinkAnalytics(blockChildren[0], miloConfig);
    if (!isSubscribed) updateAriaLive(blockChildren[0]);
    return true;
  } catch (e) {
    showHideMessage({ errorMsg: e });
    return true;
  }
}

export default async function init(el) {
  el.classList.add('hidden');
  const blockChildren = [...el.children];
  await insertProgress(el, 'l');

  el.classList.remove('hidden');
  const dialog = el.closest('.dialog-modal');
  dialog?.setAttribute('aria-label', 'Form loading');
  createAriaLive(el);

  const configErrMessage = setFormData(el);
  if (configErrMessage) throw new Error(configErrMessage);
  const correctMessageEls = setMessageEls(blockChildren);
  if (!correctMessageEls) throw new Error('Missing success/error message');

  decorate(el, blockChildren).then((isDecorated) => {
    if (!isDecorated) return;
    el.replaceChildren(...blockChildren);
  });
}
