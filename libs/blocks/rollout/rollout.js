import login from '../../tools/sharepoint/login.js';
import { accessToken, account } from '../../tools/sharepoint/state.js';
import { createTag } from '../../utils/utils.js';

const SCOPES = ['files.readwrite', 'sites.readwrite.all'];
const TELEMETRY = { application: { appName: 'Milo - Single Page Rollout' } };
let urlData = {};

const setUrlData = (url, allowEmptyPaths = false) => {
  const urlParts = url.split('--');
  if (urlParts.length !== 3) {
    return null;
  }
  const hlxPageIndex = urlParts[2].indexOf('.hlx.page');
  if (hlxPageIndex < 0 || hlxPageIndex + (allowEmptyPaths ? 8 : 9) >= urlParts[2].length) {
    return null;
  }
  urlData = {
    urlBranch: urlParts[0].slice(8), // remove "https://"
    urlRepo: urlParts[1],
    urlOwner: urlParts[2].slice(0, hlxPageIndex),
    urlPathRemainder: urlParts[2].slice(hlxPageIndex + 9), // 9 === ".hlx.page".length
  };
};

const getReferrer = () => {
  const referrer = new URLSearchParams(window.location.search).get('referrer');
  return decodeURIComponent(referrer);
};

const resetFormData = () => {
  document.querySelectorAll(".rollout .checkbox-group input[type='checkbox']").forEach(
    (checkbox) => (checkbox.checked = false),
  );
  document.querySelectorAll('.rollout .dropdown').forEach(
    (dropdown) => (dropdown.selectedIndex = 0),
  );
};

const createRolloutData = (previewUrl) => {
  const environment = document.querySelector('.modal .dropdown').value;
  const regionalEditConfig = document.querySelectorAll('.modal .dropdown')[1].value;

  console.log(`all checkboxes: ${document.querySelectorAll('.checkbox-group input[type="checkbox"]')}`);
  const selectedLocales = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const data = {
    owner: urlData.urlOwner,
    repo: urlData.urlRepo,
    branch: urlData.urlBranch,
    urls: [
      previewUrl,
    ],
    languages: [{
      language: urlData.currentPageLang,
      locales: selectedLocales,
    }],
    settings: {
      env: environment,
      regionalEditBehaviour: regionalEditConfig,
    },
  };
  return data;
}

const submitRolloutAction = (previewUrl) => {
  // Show loading bar
  const submitButton = document.getElementById('createProjectBtn');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('rollout-btn-text');
  submitButton.disabled = true;
  buttonText.textContent = 'Creating...';
  spinner.style.display = 'inline-block';

  // Simulate processing delay
  setTimeout(async () => {
    try {
      const response = await fetch('https://14257-miloc-raga.adobeioruntime.net/api/v1/web/miloc-0.0.1/create-rollout-project', {
        method: 'POST',
        headers: { 'User-Token': accessToken.value, 'Content-Type': 'application/json' },
        body: JSON.stringify(createRolloutData(previewUrl)),
      });
      console.log(`Response from Raghu's service : ${response}`);
      if (response.ok) {
        submitButton.disabled = false;
        buttonText.textContent = 'Open Project';
        spinner.style.display = 'none';
        submitButton.onclick = () => (window.location.href = response.json().locUiUrl);
      } else {
        console.error('Error while creating rollout project');
      }
    } catch (error) {
      console.error(`Error occurred while rolling out ${previewUrl}: ${error}`);
    } finally {
      resetFormData();
    }
  }, 2000); // Simulate a 2-second delay
};

const createDropdown = (dropdownContainer, options, label) => {
  const dropdownGroup = createTag('div', { class: 'dropdown-group' });
  const labelTag = createTag('label', { for: label?.toLowerCase(), textContent: label });
  const dropdown = createTag('select', { class: 'dropdown', id: label?.toLowerCase() });
  options.forEach((option) => {
    dropdown.appendChild(createTag('option', { value: option.toLowerCase().replace(/\s+/g, '-') }, option));
  });
  dropdownGroup.append(labelTag, dropdown);
  dropdownContainer.appendChild(dropdownGroup);
}

const getLanguageCode = (url) => {
  try {
    const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
    const langPattern = /^[a-z]{2,3}(-[A-Za-z]{4})?(-[A-Za-z0-9]{2,3})?$/;

    return (pathSegments[0] === 'langstore' && langPattern.test(pathSegments[1]))
      ? pathSegments[1]
      : 'root';
  } catch {
    console.error('Invalid URL');
    return null;
  }
};

const findLiveCopies = (data, languageCode) => {
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  if (!Array.isArray(parsedData)) throw new TypeError('Expected data to be an array');
  return parsedData.find((item) => item.languagecode === languageCode) || null;
};

const getLiveCopies = async (previewUrl) => {
  const currentLangCode = getLanguageCode(previewUrl);
  if (currentLangCode === 'root') return { language: 'English (US)', livecopies: 'langstore/en' };

  const configJsonUrl = `https://${urlData.urlBranch}--${urlData.urlRepo}--${urlData.urlOwner}.hlx.page/.milo/config.json`;
  const response = await fetch(configJsonUrl);
  const configJson = await response.json();
  return findLiveCopies(JSON.stringify(configJson?.locales?.data), currentLangCode);
};

const updateRolloutButtonState = () => {
  console.log(`all checkboxes: ${document.querySelectorAll('.rollout .checkbox-group input[type="checkbox"]')}`);
  const rolloutButton = document.getElementById('createProjectBtn');
  if (rolloutButton) {
    const anyChecked = Array.from(
      document.querySelectorAll('.checkbox-group input[type="checkbox"]'),
    ).some((checkbox) => checkbox.checked);
    rolloutButton.disabled = !anyChecked;
  }
};

const createLocalesCheckboxes = async (modal, previewUrl) => {
  const liveCopiesEntry = await getLiveCopies(previewUrl);
  urlData.currentPageLang = liveCopiesEntry.language;

  const checkboxGroup = createTag('div', { class: 'checkbox-group' });
  liveCopiesEntry?.livecopies?.split(',').forEach((countryCode) => {
    const country = countryCode?.trim()?.toLowerCase();
    console.log(country);
    const checkbox = createTag('input', {
      type: 'checkbox',
      id: country,
      value: country,
    }, country);
    checkbox.onchange = updateRolloutButtonState;
    const label = createTag('label', { for: country }, country);
    checkboxGroup.append(checkbox, label);
  });
  modal.appendChild(checkboxGroup);
};

const buildUi = async (el, previewUrl) => {
  const modal = createTag('div', { class: 'modal' });
  const dropdownContainer = createTag('div', { class: 'dropdown-container' });

  createDropdown(dropdownContainer, ['Stage', 'Prod'], 'Environment:');
  createDropdown(dropdownContainer, ['Skip', 'Merge', 'Overwrite'], 'Regional Edit Behavior:');
  modal.append(dropdownContainer, createTag('label', { for: 'locales', class: 'locale-label' }, 'Locales:'));

  await createLocalesCheckboxes(modal, previewUrl);

  const submitButton = createTag('button', { id: 'createProjectBtn', type: 'button', disabled: true });
  submitButton.append(
    createTag('span', { id: 'rollout-btn-text' }, 'Rollout'),
    createTag('span', { class: 'spinner', id: 'spinner', style: 'display: none' }),
  );
  submitButton.onclick = submitRolloutAction.bind(null, previewUrl);

  const buttonGroup = createTag('div', { class: 'button-group' });
  buttonGroup.appendChild(submitButton);
  modal.appendChild(buttonGroup);

  el.appendChild(modal);
};

const setup = async (el) => {
  await login({ scopes: SCOPES, telemetry: TELEMETRY });
  if (!account.value.username) return;

  const previewUrl = getReferrer();
  setUrlData(previewUrl, true);
  el.innerHTML = '';
  await buildUi(el, previewUrl);
};

export default async function init(el) {
  try {
    await setup(el);
  } catch {
    console.error('Setup initialization failed');
  }
}
