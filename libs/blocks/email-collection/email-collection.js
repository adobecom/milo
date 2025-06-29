import { decorateButtons } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const FORM_FIELDS = {
  email: {
    type: 'email',
    required: true,
    autocomplete: true,
  },
  'first-name': {
    type: 'text',
    required: true,
    autocomplete: true,
  },
  'last-name': {
    type: 'text',
    required: true,
    autocomplete: true,
  },
  organization: {
    type: 'text',
    required: true,
    autocomplete: true,
  },
  occupation: {
    type: 'text',
    required: false,
    autocomplete: true,
  },
  state: { type: 'select' },
  country: { type: 'select' },
  custom: { type: 'textarea' },
};
const FORM_CONFIG = ['consent-string', 'consent-id', 'campaign-id', 'mps-sname'];

function formatMetadataKey(key) {
  return key?.toLowerCase().trim().replaceAll(/\s+/g, '-');
}

function getEmailCollectionMetadata(el) {
  const metadata = el.nextElementSibling;
  const emailCollectionMetadata = { fields: {}, config: {} };
  if (!metadata?.classList.contains('email-collection-metadata')) {
    throw new Error('Email collection metadata is missing');
  }
  [...metadata.children].forEach((child) => {
    let metadataObject = emailCollectionMetadata.fields;
    const key = formatMetadataKey(child.firstElementChild?.textContent);
    let value = child.lastElementChild?.textContent.trim();
    if (FORM_CONFIG.includes(key)) {
      value = child.lastElementChild?.innerHTML.trim();
      metadataObject = emailCollectionMetadata.config;
    }
    metadataObject[key] = value;
  });

  if (Object.keys(emailCollectionMetadata.config).length !== FORM_CONFIG.length) {
    throw new Error('Email collection metadata is missing a config field');
  }
  metadata.remove();

  return emailCollectionMetadata;
}

let selectOptions;
async function decorateSelect(id, url) {
  try {
    const selectWrapper = createTag('div', { class: 'select-wrapper' });
    if (!selectOptions) {
      const selectOptionsReq = await fetch(url);
      if (!selectOptionsReq.ok) return null;
      selectOptions = await selectOptionsReq.json();
    }
    const { [id]: options } = selectOptions;
    if (!options || !options.data.length) return null;
    const { data } = options;
    const select = createTag('select', { id, name: id });
    data.forEach(({ key, value }) => {
      const option = createTag('option', { value: key }, value);
      select.append(option);
    });
    selectWrapper.append(select);
    return selectWrapper;
  } catch (e) {
    return null;
  }
}

async function decorateInput(fieldConfig, key, value) {
  let input;
  let tag = 'input';
  let labelText = value;
  if (fieldConfig.type === 'select') {
    const [label, url] = value.split('|');
    labelText = label;
    input = await decorateSelect(key, url);
    if (!input) return [];
  } else if (fieldConfig.type === 'textarea') {
    tag = 'textarea';
  }
  input = input ?? createTag(tag, { name: key, id: key });
  Object.entries(fieldConfig).forEach(([confKey, confValue]) => {
    if (['select', 'textarea'].includes(confValue)) return;
    input.setAttribute(confKey, confValue);
  });
  const label = createTag('label', { for: key, class: 'body-xs' }, labelText.trim());
  label.classList.toggle('required', input.getAttribute('required') === 'true');

  return [label, input];
}

async function decorateForm(el, text) {
  const emailCollectionMetadata = getEmailCollectionMetadata(el);
  const shouldSplitFirstRow = !el.classList.contains('mailing-list') && !el.classList.contains('large-image');
  const form = createTag('form', { id: 'email-collection-form' });
  const inputs = [];
  for (const [key, value] of Object.entries(emailCollectionMetadata.fields)) {
    const fieldConfig = FORM_FIELDS[key];
    // eslint-disable-next-line no-continue
    if (!fieldConfig) continue;
    const input = await decorateInput(fieldConfig, key, value);
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
    const formData = new FormData(form);
    console.log('Form data submitted:', Object.fromEntries(formData));

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
      form: 'email-collection-form',
    },
  );
  const submitText = text.lastElementChild;
  submitButton.textContent = submitText.textContent;
  submitText.remove();
  submitContainer.append(submitButton);

  const consentString = createTag(
    'p',
    { class: 'body-xxs consent-string' },
    emailCollectionMetadata.config['consent-string'],
  );
  text.append(form, consentString, submitContainer);
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
  await decorateText(el);
  const media = foreground.querySelector(':scope > div:not([class])');
  media?.classList.add('image');
}
