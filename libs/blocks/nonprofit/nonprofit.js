/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable compat/compat */
/* eslint-disable max-len */

import { createTag } from '../../utils/utils.js';
import { countries } from './constants.js';
import ReactiveStore from './reactiveStore.js';
import { getNonprofitIconTag, NONPRFIT_ICONS } from './icons.js';
import nonprofitSelect from './nonprofit-select.js';

const removeOptionElements = (element) => {
  const children = element.querySelectorAll(':scope > div');
  children.forEach((child) => {
    child.remove();
  });
};

// #region Constants

const PERCENT_API_URL = 'https://sandbox-api.poweredbypercent.com/v1';
const PERCENT_VALIDATION_API_URL = 'https://sandbox-validate.poweredbypercent.com/adobe-acrobat';
const PERCENT_PUBLISHABLE_KEY = 'sandbox_pk_8b320cc4-5950-4263-a3ac-828c64f6e19b';
export const SCENARIOS = Object.freeze({
  FOUND_IN_SEARCH: 'FOUND_IN_SEARCH',
  NOT_FOUND_IN_SEARCH: 'NOT_FOUND_IN_SEARCH',
});
const SEARCH_DEBOUNCE = 500; // ms
const FETCH_ON_SCROLL_OFFSET = 100; // px

// #endregion

const nonprofitFormData = JSON.parse('{}');

// #region Stores

export const stepperStore = new ReactiveStore({
  step: 1,
  scenario: SCENARIOS.FOUND_IN_SEARCH,
  pending: false,
});

export const organizationsStore = new ReactiveStore([]);

export const registriesStore = new ReactiveStore([]);

const selectedOrganizationStore = new ReactiveStore();

// #endregion

// #region Percent API integration

// #region Helpers

function getPercentErrorString(result) {
  return `${result.error.title}: ${result.error.message}${result.error.reasons ? ` (${result.error.reasons.join(', ')})` : ''}`;
}

async function validatePercentResponse(response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(getPercentErrorString(result));
  }

  return result;
}

// #endregion

let nextOrganizationsPageUrl;

async function fetchOrganizations(search, countryCode, abortController) {
  try {
    organizationsStore.startLoading(true);
    const response = await fetch(
      `${PERCENT_API_URL}/organisations?countryCode=${countryCode}&query=${search}`,
      {
        cache: 'force-cache',
        signal: abortController.signal,
        headers: { Authorization: PERCENT_PUBLISHABLE_KEY },
      },
    );

    const result = await validatePercentResponse(response);

    if (!result._links) {
      nextOrganizationsPageUrl = null;
      window.lana?.log('No next organization page link provided.');
    } else nextOrganizationsPageUrl = result._links.next || null;
    organizationsStore.update(result.data);
  } catch (error) {
    organizationsStore.update((prev) => prev);
    window.lana?.log(`Could not fetch organizations: ${error}`);
  }
}

async function fetchNextOrganizations(abortController) {
  if (!nextOrganizationsPageUrl) return;
  try {
    organizationsStore.startLoading();
    const response = await fetch(nextOrganizationsPageUrl, {
      cache: 'force-cache',
      signal: abortController.signal,
      headers: { Authorization: PERCENT_PUBLISHABLE_KEY },
    });

    const result = await validatePercentResponse(response);

    nextOrganizationsPageUrl = result._links.next;
    organizationsStore.update((prev) => [...prev, ...result.data]);
  } catch (error) {
    organizationsStore.update((prev) => prev);
    window.lana?.log(`Could not fetch next organizations: ${error}`);
  }
}

async function fetchRegistries(countryCode, abortController) {
  try {
    registriesStore.startLoading(true);
    const response = await fetch(`${PERCENT_API_URL}/registries?countryCode=${countryCode}`, {
      cache: 'force-cache',
      signal: abortController.signal,
      headers: { Authorization: PERCENT_PUBLISHABLE_KEY },
    });

    const result = await validatePercentResponse(response);

    registriesStore.update(result.data);
  } catch (error) {
    registriesStore.update((prev) => prev);
    window.lana?.log(`Could not fetch registries: ${error}`);
  }
}

async function sendOrganizationData() {
  try {
    const inviteResponse = await fetch(PERCENT_VALIDATION_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${PERCENT_PUBLISHABLE_KEY}` },
    });

    const inviteResult = await validatePercentResponse(inviteResponse);

    const { validationInviteId } = inviteResult.data;

    const foundInSearch = stepperStore.data.scenario === SCENARIOS.FOUND_IN_SEARCH;

    if (!foundInSearch) {
      const evidenceUploadData = new FormData();
      evidenceUploadData.append('file', nonprofitFormData.evidenceNonProfitStatus);
      evidenceUploadData.append('validationInviteId', validationInviteId);

      const uploadResponse = await fetch(`${PERCENT_API_URL}/validation-submission-documents`, {
        method: 'POST',
        headers: { Authorization: PERCENT_PUBLISHABLE_KEY },
        body: evidenceUploadData,
      });

      await validatePercentResponse(uploadResponse);
    }

    let body;
    if (foundInSearch) {
      body = JSON.stringify({
        validationInviteId,
        organisationId: nonprofitFormData.organizationId,
        firstName: nonprofitFormData.firstName,
        lastName: nonprofitFormData.lastName,
        email: nonprofitFormData.email,
        language: 'en-US',
      });
    } else {
      body = JSON.stringify({
        validationInviteId,
        countryCode: nonprofitFormData.countryCode,
        organisationName: nonprofitFormData.organizationName,
        registryId: nonprofitFormData.organizationRegistrationId,
        registryName: nonprofitFormData.registryName,
        website: nonprofitFormData.website,
        addressLine1: nonprofitFormData.streetAddress,
        addressLine2: nonprofitFormData.addressDetails,
        city: nonprofitFormData.city,
        postal: nonprofitFormData.zipCode,
        state: nonprofitFormData.state,
        firstName: nonprofitFormData.firstName,
        lastName: nonprofitFormData.lastName,
        email: nonprofitFormData.email,
        language: 'en-US',
      });
    }

    const submissionResponse = await fetch(`${PERCENT_API_URL}/validation-submissions`, {
      method: 'POST',
      body,
      headers: {
        Authorization: PERCENT_PUBLISHABLE_KEY,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    await validatePercentResponse(submissionResponse);

    return true;
  } catch (error) {
    window.lana?.log(`Could not send organization data: ${error}`);
    return false;
  }
}

// #endregion

// UI

function getStepBackTag() {
  const buttonTag = createTag('div', { class: 'np-stepper-back', tabindex: 0 });
  const backIconTag = getNonprofitIconTag(NONPRFIT_ICONS.BACK);
  buttonTag.append(backIconTag);

  stepperStore.subscribe(({ step, scenario, pending }) => {
    if (pending) buttonTag.classList.add('disabled');
    else buttonTag.classList.remove('disabled');
    if (step === 1 || (step === 3 && scenario === SCENARIOS.FOUND_IN_SEARCH) || step === 5) {
      buttonTag.style.display = 'none';
      return;
    }
    buttonTag.style.display = 'flex';
  });

  buttonTag.addEventListener('click', () => {
    if (stepperStore.data.pending) return;
    stepperStore.update((prev) => ({ ...prev, step: prev.step - 1 }));
  });

  buttonTag.addEventListener('keydown', (ev) => {
    if (stepperStore.data.pending) return;
    if (ev.code !== 'Enter') return;
    ev.preventDefault();
    buttonTag.click();
  });

  return buttonTag;
}

function renderStepper(containerTag) {
  const stepperContainerTag = createTag('div', { class: 'np-stepper-container' });
  const getStepTag = (number) => {
    const stepContainerTag = createTag('div', { class: 'np-step-container', 'data-step': number });
    const stepIconTag = createTag('span', { class: 'np-step-icon' }, number);
    const stepNameTag = createTag(
      'span',
      { class: 'np-step-name' },
      window.mph[`nonprofit-step-${number}`],
    );
    stepContainerTag.append(stepIconTag, stepNameTag);
    return stepContainerTag;
  };

  const step1 = getStepTag(1);
  const step2 = getStepTag(2);
  const step3 = getStepTag(3);

  stepperStore.subscribe(({ step, scenario }) => {
    // Reset steps
    step1.classList.remove('is-cleared', 'is-active');
    step2.classList.remove('is-cleared', 'is-active');
    step3.classList.remove('is-cleared', 'is-active');

    if (step === 1) {
      step1.classList.add('is-active');
    }
    if (step === 2) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-active');
    }
    if (step === 3) {
      if (scenario === SCENARIOS.FOUND_IN_SEARCH) {
        step1.classList.add('is-cleared');
        step2.classList.add('is-cleared');
        step3.classList.add('is-active');
      } else {
        step1.classList.add('is-cleared');
        step2.classList.add('is-active');
      }
    }
    if (step === 4) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-active');
    }
    if (step === 5) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-cleared');
      step3.classList.add('is-active');
    }
  });

  const separatorIconTag = getNonprofitIconTag(NONPRFIT_ICONS.CHEVRON_RIGHT);
  separatorIconTag.classList.add('np-step-separator');

  stepperContainerTag.append(
    step1,
    separatorIconTag.cloneNode(true),
    step2,
    separatorIconTag.cloneNode(true),
    step3,
  );

  const stepBackTag = getStepBackTag();

  containerTag.append(stepperContainerTag, stepBackTag);
}

// #region Render form

function getDescriptionTag(title, subtitle) {
  const descriptionTag = createTag('div', { class: 'np-description' });
  const titleTag = createTag('span', { class: 'np-title' }, title);

  descriptionTag.append(titleTag);

  if (subtitle) {
    const subtitleTag = createTag('span', { class: 'np-subtitle' }, subtitle);

    descriptionTag.append(subtitleTag);
  }

  return descriptionTag;
}

function getSubmitTag() {
  return createTag('input', {
    class: 'np-button',
    type: 'submit',
    value: window.mph['nonprofit-continue'],
    disabled: 'disabled',
  });
}

function getNonprofitInput(params) {
  const { type, name, label, placeholder, required } = params;
  const baseParams = { name, placeholder };
  if (required) baseParams.required = 'required';
  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag('label', { class: 'np-label', for: name }, label);
  const inputTag = createTag('input', {
    class: `np-input${required ? ' np-required-field' : ''}`,
    type,
    ...baseParams,
  });
  controlTag.append(labelTag, inputTag);

  // File validation
  if (type === 'file') {
    // Hide input and render a text one
    inputTag.style.display = 'none';
    const textTag = createTag('input', {
      type: 'text',
      class: 'np-input',
      placeholder,
      readonly: 'readonly',
      'data-for': name,
    });

    textTag.addEventListener('click', () => {
      inputTag.click();
    });

    textTag.addEventListener('keypress', (ev) => {
      if (ev.code !== 'Enter') return;
      ev.preventDefault();
      inputTag.click();
    });

    // Validation
    inputTag.addEventListener('change', () => {
      if (!inputTag.files || inputTag.files.length === 0) {
        textTag.value = '';
        return;
      }

      const file = inputTag.files[0];

      // Percent only accepts jpg, png and pdf files
      const extensionRegex = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
      if (!extensionRegex.exec(file.name)) {
        inputTag.value = '';
        inputTag.dispatchEvent(new Event('input'));
        alert(window.mph['nonprofit-invalid-file-type']);
        return;
      }

      // Percent acceps files up to 5 mb
      const size = file.size / 1024 ** 2;
      if (size > 5) {
        inputTag.value = '';
        inputTag.dispatchEvent(new Event('input'));
        alert(window.mph['nonprofit-file-size-exceeded']);
        return;
      }

      textTag.value = file.name;
    });

    const uploadIconTag = getNonprofitIconTag(NONPRFIT_ICONS.UPLOAD);

    controlTag.append(textTag, uploadIconTag);
  }

  return controlTag;
}

function getSelectedOrganizationTag() {
  const containerTag = createTag('div', { class: 'np-selected-organization-container' });

  const headerTag = createTag('div', { class: 'np-selected-organization-header' });

  const avatarTag = createTag('div', { class: 'np-selected-organization-avatar' });

  const initialsTag = createTag('span', { class: 'np-selected-organization-initials' });
  const showInitials = () => {
    avatarTag.classList.add('fallback');
    const initialWords = selectedOrganizationStore.data.name
      .split(' ')
      .filter((word) => Boolean(word))
      .slice(0, 2);
    const initials = initialWords.map((word) => word.substring(0, 1).toUpperCase()).join('');
    initialsTag.textContent = initials;
  };

  const logoTag = createTag('img', { class: 'np-selected-organization-logo' });
  logoTag.addEventListener('error', () => {
    avatarTag.classList.remove('loading');
    showInitials();
  });
  logoTag.addEventListener('load', () => {
    avatarTag.classList.remove('loading');
  });

  avatarTag.append(initialsTag, logoTag);

  const nameTag = createTag('span', { class: 'np-selected-organization-detail' });
  headerTag.append(avatarTag, nameTag);

  const separatorTag = createTag('div', { class: 'np-selected-organization-separator' });

  const addressTag = createTag('span', { class: 'np-selected-organization-detail' });
  const idTag = createTag('span', { class: 'np-selected-organization-detail' });

  const clearTag = createTag('div', { class: 'np-selected-organization-clear', tabindex: 0 });
  const clearIconTag = getNonprofitIconTag(NONPRFIT_ICONS.CLOSE);
  clearTag.append(clearIconTag);

  clearTag.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') return;
    clearTag.click();
  });

  containerTag.append(headerTag, separatorTag, addressTag, idTag, clearTag);

  selectedOrganizationStore.subscribe((organization) => {
    if (!organization) {
      containerTag.style.display = 'none';
      return;
    }

    // Load avatar
    if (organization.logo) {
      avatarTag.classList.add('loading');
      avatarTag.classList.remove('fallback');
      logoTag.src = organization.logo;
    } else {
      showInitials();
    }

    nameTag.textContent = organization.name;

    addressTag.textContent = organization.address || '-';
    addressTag.setAttribute('title', organization.address);
    idTag.textContent = organization.id;
    idTag.setAttribute('title', organization.id);

    containerTag.style.display = 'flex';
  }, false);

  containerTag.onClear = (handler) => {
    clearTag.addEventListener('click', handler);
  };

  return containerTag;
}

function trackSubmitCondition(formTag) {
  const requiredInputs = formTag.querySelectorAll('.np-required-field');
  const submitTag = formTag.querySelector('.np-button[type=submit]');

  for (let index = 0; index < requiredInputs.length; index++) {
    const requiredInput = requiredInputs[index];
    requiredInput.addEventListener('input', () => {
      if (!requiredInput.value) {
        submitTag.setAttribute('disabled', 'disabled');
      } else {
        let hasEmptyFields = false;
        requiredInputs.forEach((input) => {
          if (input === requiredInput) return;
          if (!input.value) hasEmptyFields = true;
        });
        if (hasEmptyFields) {
          submitTag.setAttribute('disabled', 'disabled');
        } else {
          submitTag.removeAttribute('disabled');
        }
      }
    });
  }
}

// Select non-profit
function renderSelectNonprofit(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(
    window.mph['nonprofit-title-select-non-profit'],
    window.mph['nonprofit-subtitle-select-non-profit'],
  );

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const countryTag = nonprofitSelect({
    createTag,
    name: 'country',
    label: window.mph['nonprofit-country'],
    placeholder: window.mph['nonprofit-country-placeholder'],
    options: countries,
    labelKey: 'name',
    valueKey: 'code',
  });

  // #region Organization select
  const organizationTag = nonprofitSelect({
    createTag,
    name: 'organizationId',
    label: window.mph['nonprofit-organization-name-or-id'],
    placeholder: window.mph['nonprofit-organization-name-or-id-search-placeholder'],
    noOptionsText: window.mph['nonprofit-not-found-in-database'],
    debounce: SEARCH_DEBOUNCE,
    store: organizationsStore,
    disabled: true,
    hideIcon: true,
    clearable: true,
    labelKey: 'name',
    valueKey: 'id',
    renderOption: (option, itemTag) => {
      const nameTag = createTag(
        'span',
        { class: 'np-organization-select-name', title: option.name },
        option.name,
      );
      const idTag = createTag(
        'span',
        { class: 'np-organization-select-id', title: option.id },
        option.id,
      );

      itemTag.append(nameTag, idTag);
    },
    footerTag: (() => {
      const cannotFindTag = createTag('div', { class: 'np-select-list-tag np-organization-cannot-find' });
      const cannotFindLinkTag = createTag(
        'a',
        { tabindex: 0 },
        window.mph['nonprofit-organization-cannot-find'],
      );
      // Cannot find action handler
      const switchToNotFound = () => {
        stepperStore.update((prev) => ({
          ...prev,
          step: 2,
          scenario: SCENARIOS.NOT_FOUND_IN_SEARCH,
        }));
      };
      cannotFindLinkTag.addEventListener('click', switchToNotFound);
      cannotFindLinkTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'Enter') return;
        switchToNotFound();
      });

      cannotFindTag.append(cannotFindLinkTag);

      return cannotFindTag;
    })(),
  });

  organizationTag.onInput((value, abortController) => {
    if (!value) return;
    fetchOrganizations(value, countryTag.getValue(), abortController);
  });

  organizationTag.onSelect((option) => {
    selectedOrganizationStore.update(option);
  });

  organizationTag.onScroll((listTag, abortController, hasNewInput) => {
    if (
      (Boolean(selectedOrganizationStore.data) && !hasNewInput)
      || organizationsStore.loading
      || !nextOrganizationsPageUrl
    ) return;
    if (listTag.scrollTop + listTag.clientHeight + FETCH_ON_SCROLL_OFFSET >= listTag.scrollHeight) {
      fetchNextOrganizations(abortController);
    }
  });

  countryTag.onSelect(() => {
    organizationTag.enable();
    organizationTag.clear();
    if (selectedOrganizationStore.data) {
      selectedOrganizationStore.update(null);
    }
  });

  // #endregion

  const selectedOrganizationTag = getSelectedOrganizationTag();

  selectedOrganizationTag.onClear(() => {
    organizationTag.clear();
    selectedOrganizationStore.update(null);
  });

  const submitTag = getSubmitTag();

  formTag.append(countryTag, organizationTag, selectedOrganizationTag, submitTag);

  trackSubmitCondition(formTag);

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.countryCode = formData.get('country');
    nonprofitFormData.organizationId = formData.get('organizationId');

    stepperStore.update((prev) => ({ ...prev, scenario: SCENARIOS.FOUND_IN_SEARCH, step: 2 }));
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Organization details
function renderOrganizationDetails(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(window.mph['nonprofit-title-organization-details']);

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  let abortController;

  const countryTag = nonprofitSelect({
    createTag,
    name: 'country',
    label: window.mph['nonprofit-country'],
    placeholder: window.mph['nonprofit-country-placeholder'],
    options: countries,
    labelKey: 'name',
    valueKey: 'code',
  });

  countryTag.onSelect((option) => {
    abortController?.abort();
    abortController = new AbortController();
    fetchRegistries(option.code, abortController);
  });

  const organizationNameTag = getNonprofitInput({
    type: 'text',
    name: 'organizationName',
    label: window.mph['nonprofit-organization-name'],
    placeholder: window.mph['nonprofit-organization-name-placeholder'],
    required: true,
  });

  const registryTag = nonprofitSelect({
    createTag,
    name: 'registry',
    label: window.mph['nonprofit-registry'],
    placeholder: window.mph['nonprofit-registry-placeholder'],
    labelKey: 'name',
    valueKey: 'name',
    disabled: true,
  });

  registriesStore.subscribe((registries, loading) => {
    if (!countryTag.getValue()) return;
    if (loading) {
      registryTag.clear(false);
      return;
    }
    registryTag.enable();
    registryTag.updateOptions(registries);
  });

  const organizationRegistrationIdTag = getNonprofitInput({
    type: 'text',
    name: 'organizationRegistrationId',
    label: window.mph['nonprofit-organization-registration-id'],
    placeholder: window.mph['nonprofit-organization-registration-id-placeholder'],
    required: true,
  });

  const evidenceNonProfitStatusTag = getNonprofitInput({
    type: 'file',
    name: 'evidenceNonProfitStatus',
    label: window.mph['nonprofit-evidence-non-profit-status'],
    placeholder: window.mph['nonprofit-evidence-non-profit-status-placeholder'],
    required: true,
  });

  const websiteTag = getNonprofitInput({
    type: 'text',
    name: 'website',
    label: window.mph['nonprofit-website'],
    placeholder: window.mph['nonprofit-website-placeholder'],
    required: true,
  });

  const submitTag = getSubmitTag();

  formTag.append(
    countryTag,
    organizationNameTag,
    registryTag,
    organizationRegistrationIdTag,
    evidenceNonProfitStatusTag,
    websiteTag,
    submitTag,
  );

  trackSubmitCondition(formTag);

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.countryCode = formData.get('country');
    nonprofitFormData.organizationName = formData.get('organizationName');
    nonprofitFormData.registryName = formData.get('registry');
    nonprofitFormData.organizationRegistrationId = formData.get('organizationRegistrationId');
    nonprofitFormData.evidenceNonProfitStatus = formData.get('evidenceNonProfitStatus');
    nonprofitFormData.website = formData.get('website');

    stepperStore.update((prev) => ({ ...prev, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH, step: 3 }));
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Organization address
function renderOrganizationAddress(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(window.mph['nonprofit-title-organization-address']);

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const streetAddressTag = getNonprofitInput({
    type: 'text',
    name: 'streetAddress',
    label: window.mph['nonprofit-street-address'],
    placeholder: window.mph['nonprofit-street-address-placeholder'],
    required: true,
  });

  const addressDetailsTag = getNonprofitInput({
    type: 'text',
    name: 'addressDetails',
    label: window.mph['nonprofit-address-details'],
    placeholder: window.mph['nonprofit-address-details-placeholder'],
  });

  const stateTag = getNonprofitInput({
    type: 'text',
    name: 'state',
    label: window.mph['nonprofit-state'],
    placeholder: window.mph['nonprofit-state-placeholder'],
  });

  const cityTag = getNonprofitInput({
    type: 'text',
    name: 'city',
    label: window.mph['nonprofit-city'],
    placeholder: window.mph['nonprofit-city-placeholder'],
    required: true,
  });

  const zipCodeTag = getNonprofitInput({
    type: 'text',
    name: 'zipCode',
    label: window.mph['nonprofit-zip-code'],
    placeholder: window.mph['nonprofit-zip-code-placeholder'],
    required: true,
  });

  const submitTag = getSubmitTag();

  formTag.append(streetAddressTag, addressDetailsTag, stateTag, cityTag, zipCodeTag, submitTag);

  trackSubmitCondition(formTag);

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.streetAddress = formData.get('streetAddress');
    nonprofitFormData.addressDetails = formData.get('addressDetails');
    nonprofitFormData.state = formData.get('state');
    nonprofitFormData.city = formData.get('city');
    nonprofitFormData.zipCode = formData.get('zipCode');

    stepperStore.update((prev) => ({ ...prev, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH, step: 4 }));
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Personal data
function renderPersonalData(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(
    window.mph['nonprofit-title-personal-details'],
    window.mph['nonprofit-subtitle-personal-details'],
  );

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const firstNameTag = getNonprofitInput({
    type: 'text',
    name: 'firstName',
    label: window.mph['nonprofit-first-name'],
    placeholder: window.mph['nonprofit-first-name-placeholder'],
    required: true,
  });

  const lastNameTag = getNonprofitInput({
    type: 'text',
    name: 'lastName',
    label: window.mph['nonprofit-last-name'],
    placeholder: window.mph['nonprofit-last-name-placeholder'],
    required: true,
  });

  const emailTag = getNonprofitInput({
    type: 'text',
    name: 'email',
    label: window.mph['nonprofit-email'],
    placeholder: window.mph['nonprofit-email-placeholder'],
    required: true,
  });

  const disclaimerTag = createTag(
    'span',
    { class: 'np-personal-data-disclaimer' },
    window.mph['nonprofit-personal-data-disclaimer'],
  );

  const submitTag = getSubmitTag();

  formTag.append(firstNameTag, lastNameTag, emailTag, disclaimerTag, submitTag);

  trackSubmitCondition(formTag);

  formTag.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.firstName = formData.get('firstName');
    nonprofitFormData.lastName = formData.get('lastName');
    nonprofitFormData.email = formData.get('email');

    const inputs = formTag.querySelectorAll('input');
    inputs.forEach((input) => {
      input.setAttribute('disabled', 'disabled');
    });

    stepperStore.update((prev) => ({ ...prev, pending: true }));

    const ok = await sendOrganizationData();

    if (!ok) {
      inputs.forEach((input) => {
        input.removeAttribute('disabled');
      });

      stepperStore.update((prev) => ({ ...prev, pending: false }));
    } else {
      stepperStore.update((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

function renderApplicationReview(containerTag) {
  const applicationReviewTag = createTag('div', { class: 'np-application-review-container' });

  const titleTag = createTag(
    'span',
    { class: 'np-title' },
    window.mph['nonprofit-title-application-review'],
  );
  const detail1Tag = createTag(
    'span',
    { class: 'np-application-review-detail' },
    window.mph['nonprofit-detail-1-application-review'],
  );
  const detail2Tag = createTag(
    'span',
    { class: 'np-application-review-detail' },
    window.mph['nonprofit-detail-2-application-review']?.replace(
      '__EMAIL__',
      nonprofitFormData.email,
    ),
  );

  applicationReviewTag.append(titleTag, detail1Tag, detail2Tag);

  const returnToAcrobatForNonprofitsTag = createTag(
    'button',
    { class: 'np-button' },
    window.mph['nonprofit-return-to-acrobat-for-nonprofits'],
  );

  containerTag.replaceChildren(applicationReviewTag, returnToAcrobatForNonprofitsTag);
}

function renderStepContent(containerTag) {
  const contentContainerTag = createTag('div', { class: 'np-content-container' });

  let currentStep;
  let currentScenario;
  stepperStore.subscribe(({ step, scenario }) => {
    if (step === currentStep && scenario === currentScenario) return;
    currentStep = step;
    currentScenario = scenario;

    if (step === 1) renderSelectNonprofit(contentContainerTag);
    if (step === 2 && scenario === SCENARIOS.FOUND_IN_SEARCH) renderPersonalData(contentContainerTag);
    if (step === 2 && scenario === SCENARIOS.NOT_FOUND_IN_SEARCH) renderOrganizationDetails(contentContainerTag);
    if (step === 3 && scenario === SCENARIOS.FOUND_IN_SEARCH) renderApplicationReview(contentContainerTag);
    if (step === 3 && scenario === SCENARIOS.NOT_FOUND_IN_SEARCH) renderOrganizationAddress(contentContainerTag);
    if (step === 4 && scenario === SCENARIOS.NOT_FOUND_IN_SEARCH) renderPersonalData(contentContainerTag);
    if (step === 5 && scenario === SCENARIOS.NOT_FOUND_IN_SEARCH) renderApplicationReview(contentContainerTag);
  });

  containerTag.append(contentContainerTag);
}

// #endregion

// #region Stepper Controller (TODO - remove)

function initStepperController(tag) {
  const containerTag = createTag('div', { class: 'np-controller-container' });

  const titleTag = createTag(
    'span',
    { class: 'np-controller-title' },
    'Stepper controller (for testing)',
  );

  const scenariosTag = createTag('div', { class: 'np-controller-section' });
  const stepsTag = createTag('div', { class: 'np-controller-section' });

  stepperStore.subscribe(() => {
    const { step, scenario } = stepperStore.data;

    const foundInSearchTag = createTag(
      'button',
      { class: `np-controller-button${scenario === SCENARIOS.FOUND_IN_SEARCH ? ' selected' : ''}` },
      'Found in search',
    );
    foundInSearchTag.addEventListener('click', () => {
      const newStep = step > 3 ? 1 : step;
      stepperStore.update((prev) => ({
        ...prev,
        step: newStep,
        scenario: SCENARIOS.FOUND_IN_SEARCH,
      }));
    });
    const notFoundInSearchTag = createTag(
      'button',
      { class: `np-controller-button${scenario === SCENARIOS.NOT_FOUND_IN_SEARCH ? ' selected' : ''}` },
      'Not found in search',
    );
    notFoundInSearchTag.addEventListener('click', () => stepperStore.update((prev) => ({ ...prev, scenario: SCENARIOS.NOT_FOUND_IN_SEARCH })));

    const maxSteps = scenario === SCENARIOS.FOUND_IN_SEARCH ? 3 : 5;

    stepsTag.replaceChildren();
    Array.from({ length: maxSteps })
      .map((_, index) => index + 1)
      .forEach((value) => {
        const stepTag = createTag(
          'button',
          { class: `np-controller-button is-step ${step === value ? ' selected' : ''}` },
          value,
        );
        stepTag.addEventListener('click', () => stepperStore.update((prev) => ({ ...prev, step: value })));
        stepsTag.append(stepTag);
      });

    scenariosTag.replaceChildren(foundInSearchTag, notFoundInSearchTag);
  });

  containerTag.append(titleTag, scenariosTag, stepsTag);

  const bufferTag = createTag('div', { class: 'np-controller-buffer ' });
  tag.append(bufferTag, containerTag);
}

// #endregion

function initNonprofit(element) {
  const containerTag = createTag('div', { class: 'np-container' });

  renderStepper(containerTag);
  renderStepContent(containerTag);

  element.append(containerTag);

  // TODO - remove
  initStepperController(element);
}

export default function init(element) {
  // Get metadata
  removeOptionElements(element);
  initNonprofit(element);
}
