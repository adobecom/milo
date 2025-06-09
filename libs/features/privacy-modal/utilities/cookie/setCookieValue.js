import isEmptyObject from '../lang/isEmptyObject.js';

const setCookieValue = (cookie, value, options, raw) => {
  let newCookie = '';
  let cookiePath;
  let cookieExpiration;
  let cookieDomain;

  if ((typeof cookie === 'string') && cookie.length && (typeof document.cookie === 'string')) {
    if ((typeof raw === 'boolean') && raw) {
      newCookie += `${cookie}=${value}`;
    } else {
      newCookie += `${window.encodeURIComponent(cookie)}=${window.encodeURIComponent(value)}`;
    }
    if (!isEmptyObject(options)) {
      cookiePath = options.path;
      if ((typeof cookiePath === 'string') && !!cookiePath.length) {
        newCookie += `; path=${cookiePath}`;
      }

      cookieExpiration = options.expiration;
      if (cookieExpiration instanceof Date) {
        newCookie += `; expires=${cookieExpiration.toUTCString()}`;
      }

      // Set Domain to test cookie on milo
      cookieDomain = options.domain;
      const PROD_DOMAINS = [
        'adobe.com',
        'adobe.com.aem.page',
        'adobe.com.aem.live',
      ];
      const isProdDomain = PROD_DOMAINS.some((d) => window.location.hostname.endsWith(d));
      if ((typeof cookieDomain === 'string') && !!cookieDomain.length && isProdDomain) {
        newCookie += `; domain=${cookieDomain}`;
      }
    }

    document.cookie = newCookie;
  }
};

export default setCookieValue;
