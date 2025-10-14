import { createTag, getConfig, getFederatedUrl, localizeLink, loadIms } from '../../utils/utils.js';

const API_ENDPOINTS = {
  local: 'https://www.stage.adobe.com/milo-email-collection-api',
  stage: 'https://www.stage.adobe.com/milo-email-collection-api',
  prod: 'https://www.adobe.com/milo-email-collection-api',
};
const FORM_METADATA = {
  'mps-sname': 'mpsSname',
  'subscription-name': 'subscriptionName',
};

export function localizeFederatedUrl(url) {
  return localizeLink(getFederatedUrl(url), '', true);
}

const FEDERAL_ROOT = '/federal/email-collection';
const CONSENT_URL = localizeFederatedUrl(`${FEDERAL_ROOT}/consents/cs4.plain.html`);
const PLACEHOLDER_URL = localizeFederatedUrl(`${FEDERAL_ROOT}/form-config.json?sheet=placeholders`);

export const FORM_FIELDS = {
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
      readonly: '',
    },
  },
  'last-name': {
    tag: 'input',
    attributes: {
      type: 'text',
      readonly: '',
    },
  },
  country: {
    tag: 'input',
    url: localizeFederatedUrl(`${FEDERAL_ROOT}/form-config.json?sheet=countries`),
    attributes: {
      type: 'text',
      readonly: '',
    },
  },
  organization: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'organization',
    },
  },
  occupation: {
    tag: 'input',
    attributes: {
      type: 'text',
      required: true,
      autocomplete: 'organization-title',
    },
  },
  state: {
    tag: 'select',
    url: getFederatedUrl(`${FEDERAL_ROOT}/form-config.json?sheet=states&limit=2000`),
    attributes: { required: true },
  },
};

export async function getIMS() {
  if (window.adobeIMS) return window.adobeIMS;

  await loadIms();
  return window.adobeIMS;
}

export async function getIMSAccessToken() {
  try {
    const ims = await getIMS();
    const { token } = ims?.getAccessToken() ?? {};
    return token;
  } catch (e) {
    return null;
  }
}

export async function getIMSProfile() {
  try {
    const ims = await getIMS();
    const {
      email,
      countryCode: country,
      first_name: firstName,
      last_name: lastName,
      ...profile
    } = await ims.getProfile();

    return {
      email,
      country,
      'first-name': firstName,
      'last-name': lastName,
      ...profile,
    };
  } catch (e) {
    return {};
  }
}

export function getApiEndpoint(action = 'submit') {
  const { env } = getConfig();
  const endPoint = API_ENDPOINTS[env.name] ?? API_ENDPOINTS.prod;
  return endPoint + (action === 'is-subscribed' ? '/is-subscribed' : '/form-submit');
}

export const [createAriaLive, updateAriaLive] = (() => {
  let ariaLive;
  return [
    (el) => {
      ariaLive = createTag('div', {
        class: 'email-aria-live',
        'aria-live': 'polite',
        role: 'status',
      });
      el.nextElementSibling.after(ariaLive);
    },
    (content) => {
      ariaLive.textContent = '';
      let ariaTextContent = '';
      if (typeof content === 'string') {
        ariaLive.textContent = content;
        return;
      }
      content.querySelectorAll('.text:not(.hidden) > *:not(.icon-area, form, .button-container, .hidden)')
        .forEach((child) => { ariaTextContent += ` ${child.textContent}`; });
      ariaLive.textContent = ariaTextContent;
    },
  ];
})();

function formatMetadataKey(key) {
  return key?.toLowerCase().trim().replaceAll(/\s+/g, '-');
}

function formatStateData(data) {
  const formattedData = {};
  data.forEach((state) => {
    const { countryCode, key, value } = state;
    if (!countryCode) return;
    formattedData[countryCode] = formattedData[countryCode] ?? [];
    formattedData[countryCode].push({ key, value });
  });
  return formattedData;
}

function defaultFormatData(data) {
  return data.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}

async function fetchSheet(sheetData) {
  const formatData = { state: formatStateData };
  const { id, url } = sheetData;
  try {
    const sheetReq = await fetch(url);
    if (!sheetReq.ok) return { [id]: {} };
    const { data } = await sheetReq.json();

    if (formatData[id]) return { [id]: formatData[id](data) };
    return { [id]: defaultFormatData(data) };
  } catch (e) {
    window.lana?.log(e);
    return { [id]: {} };
  }
}

async function fetchFormConfig(sheets) {
  const sheetPromises = [{ url: PLACEHOLDER_URL, id: 'placeholders' }, ...sheets]
    .map((sheet) => (fetchSheet(sheet)));

  const resolved = await Promise.all(sheetPromises);
  let config = {};
  resolved.forEach((result) => { config = { ...config, ...result }; });
  return config;
}

export async function fetchConsentString() {
  try {
    const stringReq = await fetch(CONSENT_URL);
    if (!stringReq.ok) return {};

    const string = await stringReq.text();
    const doc = new DOMParser().parseFromString(string, 'text/html');
    const [consentDiv, consentId] = doc.querySelectorAll('body > div');

    return {
      consentDiv,
      consentId: consentId?.textContent.trim(),
    };
  } catch (e) {
    return {};
  }
}

export const [getFormData, setFormData] = (() => {
  let formData;
  return [
    (key) => (formData[key]),
    (el) => {
      formData = {
        fields: {},
        metadata: {},
        consent: fetchConsentString(),
      };
      const fetchConfigParams = [];
      const { fields, metadata } = formData;
      const metadataEl = el.parentElement?.querySelector('.section-metadata');
      if (!metadataEl) return 'Section metadata is missing';

      [...metadataEl.children].forEach((child) => {
        const key = formatMetadataKey(child.firstElementChild?.textContent);
        if (!FORM_FIELDS[key] && !FORM_METADATA[key]) return;
        const value = child.lastElementChild.textContent;
        const metadataObject = FORM_METADATA[key] ? metadata : fields;
        const newKey = FORM_METADATA[key] ?? key;
        metadataObject[newKey] = value;

        if (FORM_FIELDS[key]?.url) fetchConfigParams.push({ id: key, url: FORM_FIELDS[key].url });
      });

      if (!fields.email
        || !metadata.mpsSname
        || !metadata.subscriptionName) return 'Section metadata is missing email/mps-sname/subscription-name field';

      formData.config = fetchFormConfig(fetchConfigParams);

      return null;
    },
  ];
})();

export function disableForm(form, disable = true) {
  form.querySelectorAll('input, button').forEach((el) => {
    el.toggleAttribute('disabled', disable);
  });
}

export async function getAEPData() {
  const ECID_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
  try {
    // eslint-disable-next-line
    const satellite = await window.__satelliteLoadedPromise;
    const ecid = decodeURIComponent(satellite?.cookie.get(ECID_COOKIE))?.split('|')[1];
    const { userId: guid } = await getIMSProfile();
    return { guid, ecid };
  } catch (e) {
    return {};
  }
}

export async function runtimePost(url, data, notRequiredData = []) {
  const hasMissingData = Object.entries(data)
    .find(([key, value]) => (value === undefined && !notRequiredData.includes(key)));
  if (hasMissingData) return { error: 'Request body is missing required data' };

  const token = await getIMSAccessToken();
  try {
    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const { ok, status } = req;
    const res = await req.json();
    return {
      status,
      data: res,
      ...(!ok && { error: JSON.stringify(res) }),
    };
  } catch (e) {
    return { error: e.message };
  }
}
