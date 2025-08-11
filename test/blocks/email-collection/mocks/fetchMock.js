const originalFetch = window.fetch;

const CONSENT_STRING_URL = 'https://main--federal--adobecom.aem.page/federal/email-collection/consents/cs4.plain.html';

export function mockFetch() {
  window.fetch = async (url) => {
    switch (url) {
      case CONSENT_STRING_URL:
        return new Response(
          '<body><div><p>Consent string {{subscription-name}}</p></div></body>',
          { ok: true },
        );
      default:
        return 'lol';
    }
  };
}

export function restoreFetch() {
  window.fetch = originalFetch;
}
