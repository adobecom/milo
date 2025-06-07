import isEmptyObject from '../lang/isEmptyObject.js';

/**
 * Sets a cookie with a specific value and options
 * @param {String} cookie Cookie name
 * @param {String} value Cookie value
 * @param {Object} options Options object
 * @param {String} options.path Cookie path
 * @param {Date} options.expiration Cookie expiration date
 * @param {String} options.domain Cookie domain
 */
const setCookieValue = (cookie, value, options, raw) => {
  let newCookie = '';
  let cookiePath;
  let cookieExpiration;
  let cookieDomain;

  // value can be empty
  if ((typeof cookie === 'string') && cookie.length && (typeof document.cookie === 'string')) {
    // set the cookie unencoded
    if ((typeof raw === 'boolean') && raw) {
      newCookie += `${cookie}=${value}`;
    } else {
      newCookie += `${window.encodeURIComponent(cookie)}=${window.encodeURIComponent(value)}`;
    }
    if (!isEmptyObject(options)) {
      // set path
      cookiePath = options.path;
      if ((typeof cookiePath === 'string') && !!cookiePath.length) {
        newCookie += `; path=${cookiePath}`;
      }

      // set expiration date
      cookieExpiration = options.expiration;
      if (cookieExpiration instanceof Date) {
        newCookie += `; expires=${cookieExpiration.toUTCString()}`;
      }

      // set domain
      cookieDomain = options.domain;
      if ((typeof cookieDomain === 'string') && !!cookieDomain.length) {
        newCookie += `; domain=${cookieDomain}`;
      }
    }

    document.cookie = newCookie;
  }
};

export default setCookieValue;
