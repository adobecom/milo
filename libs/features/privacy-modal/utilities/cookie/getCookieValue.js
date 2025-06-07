/**
 * Returns the value for a given cookie
 * @param {String} cookie Cookie name
 * @param {Boolean} raw Flag to return encoded cookie
 * @return {String} Cookie value
 */
const getCookieValue = (cookie, raw) => {
  let cookies;
  let index;
  let temporaryCookie;
  let cookieValue;

  if (typeof cookie === 'string' && cookie.length && (typeof document.cookie === 'string')) {
    cookies = document.cookie.split('; ');
    const { length } = cookies;
    for (index = length - 1; index >= 0; index -= 1) {
      temporaryCookie = cookies[index];
      if (typeof temporaryCookie === 'string' && temporaryCookie.length) {
        temporaryCookie = temporaryCookie.split(/=(.+)/);
        if (cookie === temporaryCookie[0]) {
          if (typeof raw === 'boolean' && raw) {
            [, cookieValue] = temporaryCookie;
            return cookieValue;
          }

          cookieValue = window.decodeURIComponent(temporaryCookie[1]);
        }
      }
    }
  }

  return cookieValue;
};

export default getCookieValue;
