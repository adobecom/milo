const originalFetch = window.fetch;

const FORM_CONFIG_URL = 'https://main--federal--adobecom.aem.page/federal/email-collection/form-config.json';
// CHANGE
const IS_SUBSCRIBED_URL = 'https://14257-miloemailcollection-dev.adobeioruntime.net/api/v1/web/email-collection/is-subscribed';
const FORM_SUBMIT_URL = 'https://14257-miloemailcollection-dev.adobeioruntime.net/api/v1/web/email-collection/form-submit';

export function mockFetch({ subscribed = false }) {
  window.fetch = async (url) => {
    switch (url) {
      case FORM_CONFIG_URL:
        return new Response('{"countries":{"total":229,"offset":0,"limit":229,"data":[{"key":"US","value":"United States"},{"key":"GB","value":"United Kingdom"}],"columns":["key","value"]},"placeholders":{"total":2,"offset":0,"limit":2,"data":[{"key":"required","value":"This field is required."},{"key":"email","value":"Enter a valid email."}],"columns":["key","value"]},":version":3,":names":["countries","placeholders"],":type":"multi-sheet"}', { ok: true });
      case IS_SUBSCRIBED_URL:
        return new Response(`{"subscribed": ${subscribed}}`, { ok: true });
      case FORM_SUBMIT_URL:
        return new Response('', { ok: true });
      default:
        return new Response('', { ok: true });
    }
  };
}

export function restoreFetch() {
  window.fetch = originalFetch;
}
