import login from '../../tools/sharepoint/login.js';
import { accessToken, account } from '../../tools/sharepoint/state.js';
import { createTag } from '../../utils/utils.js';

const SCOPES = ['files.readwrite', 'sites.readwrite.all'];
const TELEMETRY = { application: { appName: 'Milo - Path Finder' } };
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

const submitModal = (previewUrl) => {
  // Show loading bar
  const submitButton = document.getElementById('createProjectBtn');
  const spinner = document.getElementById('spinner');
  const buttonText = document.getElementById('rollout-btn-text');
  submitButton.disabled = true;
  buttonText.textContent = 'Creating...';
  spinner.style.display = 'inline-block';

  // Simulate processing delay
  setTimeout(async () => {
    const environment = document.querySelector('.modal .dropdown').value;
    const regionalEditConfig = document.querySelectorAll('.modal .dropdown')[1].value;

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
      languages: [{ language: urlData.currentPageLang, locales: selectedLocales }],
      settings: {
        env: environment,
        regionalEditBehaviour: regionalEditConfig,
      },
    };

    const body = JSON.stringify(data);
    const opts = { method: 'POST', headers: { 'User-Token': accessToken.value, 'Content-Type': 'application/json' }, body };
    try {
      const response = await fetch('http://whatever.coasas/endpoint', opts);
      if (response.ok) {
        submitButton.disabled = false;
        buttonText.textContent = 'Open Project';
        spinner.style.display = 'none';

        submitButton.onclick = function () {
          window.location.href = previewUrl; // Use the previewUrl parameter for redirection
        };
      } else {
        alert('Failed to submit data');
      }
    } catch (error) {
      alert('Error occurred while submitting data');
    }
    resetFormData();
  }, 2000); // Simulate a 2-second delay
};

function createDropdown(dropdownContainer, options, label) {
  const dropdownGroup = createTag('div');
  dropdownGroup.className = 'dropdown-group';
  const labelTag = createTag('label');
  labelTag.htmlFor = label.toLowerCase();
  labelTag.innerText = label;
  const dropdown = document.createElement('select');
  dropdown.className = 'dropdown';
  dropdown.id = label.toLowerCase();
  options.forEach((option) => {
    const optionTag = document.createElement('option');
    optionTag.value = option.toLowerCase()
      .replace(/\s+/g, '-');
    optionTag.textContent = option;
    dropdown.appendChild(optionTag);
  });
  dropdownGroup.appendChild(labelTag);
  dropdownGroup.appendChild(dropdown);

  dropdownContainer.appendChild(dropdownGroup);
}

const getLanguageCode = (url) => {
  try {
    const pathSegments = new URL(url).pathname
      .split('/')
      .filter(Boolean);

    // Regex to match two- or three-letter language codes with optional script and region subtags
    const langPattern = /^[a-z]{2,3}(-[A-Za-z]{4})?(-[A-Za-z0-9]{2,3})?$/;

    if (pathSegments.length === 0) {
      return 'root'; // Case for root path
    }

    // Check if the URL has a "langstore" segment followed by a valid language code
    if (pathSegments[0] === 'langstore' && langPattern.test(pathSegments[1])) {
      return pathSegments[1]; // Return the language code
    }

    return 'root'; // Default to root for other cases
  } catch (error) {
    console.error(`Invalid URL, ${error}`);
    return null;
  }
};

const findLiveCopies = (data, languageCode) => {
  // Parse data if it's a JSON string
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      throw new TypeError('Invalid JSON string provided');
    }
  }

  // Ensure data is an array
  if (!Array.isArray(data)) {
    throw new TypeError('Expected data to be an array');
  }

  // Find the first match and return its livecopies
  const match = data.find((item) => item.languagecode === languageCode);
  // return match ? match.livecopies : null; // Return null if no match is found
  return match || null; // Return null if no match is found
};

const getLiveCopies = async (previewUrl) => {
  console.log(`preview url in getLiveCopies ${previewUrl}`);
  const currentLangCode = getLanguageCode(previewUrl);
  if (currentLangCode === 'root') {
    return 'langstore/en';
  }
  // { urlBranch, urlOwner, urlRepo } = getUrlParts(previewUrl, true);
  const configJsonUrl = `https://${urlData.urlBranch}--${urlData.urlRepo}--${urlData.urlOwner}.hlx.page/.milo/config.json`;
  const configJsonResponse = await fetch(configJsonUrl);
  const liveCopies = await configJsonResponse.json()
    .then((configJson) => {
      const data = JSON.stringify(configJson?.locales?.data);
      return findLiveCopies(data, currentLangCode);
    });
  return liveCopies;
};

// Function to check if any checkbox is selected
const updateRolloutButtonState = () => {
  const rolloutButton = document.getElementById('createProjectBtn');
  if (!rolloutButton) return;
  const checkboxes = document.querySelectorAll(".checkbox-group input[type='checkbox']");
  // Check if at least one checkbox is checked
  const anyChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);

  // Enable or disable the button based on selection
  rolloutButton.disabled = !anyChecked;
};

async function createLocalesCheckboxes(modal, previewUrl) {
  // const liveCopies = await getLiveCopies('https://main--milo--adobecom.hlx.page/langstore/en-GB/drafts/sabya/document1');
  const liveCopiesEntry = await getLiveCopies(previewUrl);
  urlData.currentPageLang = liveCopiesEntry.language;
  const checkboxGroup = document.createElement('div');
  checkboxGroup.className = 'checkbox-group';
  liveCopiesEntry.livecopies
    .split(',')
    .map((countryCode) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = countryCode.toLowerCase();
      checkbox.value = countryCode.toLowerCase();
      checkbox.addEventListener('change', updateRolloutButtonState);
      label.htmlFor = countryCode.toLowerCase();
      label.appendChild(document.createTextNode(` ${countryCode}`));

      checkboxGroup.appendChild(checkbox);
      checkboxGroup.appendChild(label);
    });
  modal.appendChild(checkboxGroup);
}

function resetFormData() {
  // Reset checkboxes
  document.querySelectorAll(".rollout .checkbox-group input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Reset dropdowns to their first option
  document.querySelectorAll('.rollout .dropdown').forEach((dropdown) => {
    dropdown.selectedIndex = 0;
  });
}

async function buildUi(el, previewUrl) {
  const modal = createTag('div');
  modal.className = 'modal';
  const dropDownContainer = createTag('div');
  dropDownContainer.className = 'dropdown-container';

  createDropdown(dropDownContainer, ['Stage', 'Prod'], 'Environment:');
  createDropdown(dropDownContainer, ['Skip', 'Merge', 'Overwrite'], 'Regional Edit Behavior:');
  modal.appendChild(dropDownContainer);

  // Checkbox group label
  const checkboxGroupLabel = document.createElement('label');
  checkboxGroupLabel.htmlFor = 'locales';
  checkboxGroupLabel.className = 'locale-label';
  checkboxGroupLabel.innerText = 'Locales:';
  modal.appendChild(checkboxGroupLabel);

  // Checkbox group
  await createLocalesCheckboxes(modal, previewUrl);

  const buttonGroup = createTag('div');
  buttonGroup.className = 'button-group';
  const submitButton = createTag('button', { type: 'button' });
  submitButton.id = 'createProjectBtn';
  submitButton.disabled = true;
  submitButton.onclick = submitModal.bind(null, previewUrl);
  buttonGroup.appendChild(submitButton);
  const buttonText = createTag('span');
  buttonText.id = 'rollout-btn-text';
  buttonText.innerText = 'Rollout';
  submitButton.appendChild(buttonText);
  const spinner = createTag('span');
  spinner.className = 'spinner';
  spinner.id = 'spinner';
  spinner.style.display = 'none';
  submitButton.appendChild(spinner);
  modal.appendChild(buttonGroup);
  el.append(modal);
}

async function setup(el) {
  // Get auth info
  await login({
    scopes: SCOPES,
    telemetry: TELEMETRY,
  });
  if (!account.value.username) {
    window.lana.log('Could not login to MS Graph', {
      tags: 'rollout',
      errorType: 'i',
    });
    console.log('user is not logged in');
    return;
  }

  // console.log(`auth token :: ${JSON.stringify(accessToken.value)}`);
  const previewUrl = getReferrer();
  setUrlData(previewUrl, true);
  // Build the UI
  el.innerHTML = '';
  buildUi(el, previewUrl);
}

export default async function init(el) {
  try {
    await setup(el);
  } catch {
    // do nothing for now.
  }
}
