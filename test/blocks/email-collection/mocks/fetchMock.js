const originalFetch = window.fetch;

const PLACEHOLDERS_URL = 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json?sheet=placeholders';
const COUNTRIES_URL = 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json?sheet=countries';
const IS_SUBSCRIBED_URL = 'https://www.stage.adobe.com/milo-email-collection-api/is-subscribed';
const CONSENT_URL = 'https://main--federal--adobecom.aem.page/federal/email-collection/consents/cs4.plain.html';

export function mockFetch({ subscribed = false }) {
  window.fetch = async (url) => {
    switch (url) {
      case PLACEHOLDERS_URL:
        return new Response('{"total":2,"offset":0,"limit":2,"data":[{"key":"required","value":"This field is required."},{"key":"email","value":"Enter a valid email."}],"columns":["key","value"],":type":"sheet"}', { ok: true });
      case COUNTRIES_URL:
        return new Response('{"total":229,"offset":0,"limit":229,"data":[{"key":"US","value":"United States"},{"key":"GB","value":"United Kingdom"}],"columns":["key","value"],":type":"sheet"}', { ok: true });
      case IS_SUBSCRIBED_URL:
        return new Response(`{"subscribed": ${subscribed}}`, { ok: true });
      case CONSENT_URL:
        return new Response('<div><p>Consent string</p></div><div><p>consent-id</p></div>', { ok: true });
      default:
        return new Response('', { ok: true });
    }
  };
}

export function restoreFetch() {
  window.fetch = originalFetch;
}
