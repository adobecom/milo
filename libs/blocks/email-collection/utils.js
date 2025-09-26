import { createTag, getConfig, getFederatedUrl, localizeLink } from '../../utils/utils.js';

const ECID_COOKIE = 'AMCV_9E1005A551ED61CA0A490D45@AdobeOrg';
const API_ENDPOINTS = {
  stage: 'https://www.stage.adobe.com/milo-email-collection-api',
  prod: 'https://www.adobe.com/milo-email-collection-api',
};
const FORM_METADATA = {
  'campaign-id': 'campaignId',
  'mps-sname': 'mpsSname',
  'consent-id': 'consentId',
  'subscription-name': 'subscriptionName',
};

export function localizeFederatedUrl(url) {
  return localizeLink(getFederatedUrl(url), '', true);
}

const FEDERAL_ROOT = '/federal/email-collection';
const FORM_CONFIG_URL = localizeFederatedUrl(`${FEDERAL_ROOT}/form-config.json`);
const CONSENT_URL = localizeFederatedUrl(`${FEDERAL_ROOT}/consents/cs4.plain.html`);

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
};

export async function getIMS() {
  if (window.adobeIMS) return window.adobeIMS;
  return new Promise((resolve) => {
    const imsInterval = setInterval(() => {
      if (!window.adobeIMS) return;
      clearInterval(imsInterval);
      resolve(window.adobeIMS);
    }, 100);
  });
}

export async function getIMSAccessToken() {
  try {
    const ims = await getIMS();
    const { token } = ims.getAccessToken() ?? {};
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
  const endPoint = API_ENDPOINTS[env.name] ?? API_ENDPOINTS.stage;
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

const fetchFormConfig = (() => {
  const defaultConfig = {
    placeholders: {
      required: 'This field is required.',
      email: 'Enter a valid emaili.',
    },
    countries: {},
  };
  const config = {};
  return async () => {
    if (Object.keys(config).length) return config;
    try {
      const configReq = await fetch(FORM_CONFIG_URL);
      if (!configReq.ok) return defaultConfig;
      const configRes = await configReq.json();
      const { ':names': names } = configRes;
      names.forEach((name) => {
        const { data } = configRes[name];
        config[name] = Object.fromEntries(data.map(({ key, value }) => [key, value]));
      });
      return config;
    } catch (e) {
      window.lana?.log(e);
      return defaultConfig;
    }
  };
})();

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
        config: fetchFormConfig(),
        consent: fetchConsentString(),
      };
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
      });

      if (!fields.email
        || !metadata.campaignId
        || !metadata.mpsSname
        || !metadata.subscriptionName) return 'Section metadata is missing email/campaing-id/mps-sname/subscription-name field';

      return null;
    },
  ];
})();

async function getMartech() {
  // eslint-disable-next-line
  const satellite = await window.__satelliteLoadedPromise;
  return { satellite };
}

export function disableForm(form, disable = true) {
  form.querySelectorAll('input, button').forEach((el) => {
    el.toggleAttribute('disabled', disable);
  });
}

export async function getAEPData() {
  const { satellite } = await getMartech();
  const ecid = decodeURIComponent(satellite?.cookie.get(ECID_COOKIE))?.split('|')[1];
  const { userId: guid } = await getIMSProfile();

  return { guid, ecid };
}
