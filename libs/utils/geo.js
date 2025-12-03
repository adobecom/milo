/* eslint-disable no-console */

/**
 * Gets the Akamai country code from the geo2.adobe.com service.
 * @param {boolean} [checkParams=false] - If true, checks URL parameters and session storage first.
 * @returns {Promise<string|null>} A promise that resolves to the lowercase Akamai country code.
 */
const getAkamaiCode = (checkedParams = false) => new Promise((resolve, reject) => {
  let akamaiLocale = null;
  if (!checkedParams) {
    const urlParams = new URLSearchParams(window.location.search);
    akamaiLocale = urlParams.get('akamaiLocale') || sessionStorage.getItem('akamai');
  }
  if (akamaiLocale !== null) {
    resolve(akamaiLocale.toLowerCase());
  } else {
    /* c8 ignore next 5 */
    fetch('https://geo2.adobe.com/json/', { cache: 'no-cache' }).then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => {
          const code = data.country.toLowerCase();
          sessionStorage.setItem('akamai', code);
          resolve(code);
        });
      } else {
        reject(new Error(`Something went wrong getting the akamai Code. Response status text: ${resp.statusText}`));
      }
    }).catch((error) => {
      reject(new Error(`Something went wrong getting the akamai Code. ${error.message}`));
    });
  }
});

export default getAkamaiCode;
