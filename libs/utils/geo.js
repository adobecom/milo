import { getCountry } from './utils.js';
/* eslint-disable no-console */

/**
 * Gets the Akamai country code from the geo2.adobe.com service.
 * @returns {Promise<string|null>} A promise that resolves to the lowercase Akamai country code.
 */
export const getAkamaiCode = (checkedParams = false) => new Promise((resolve, reject) => {
  let akamaiLocale = null;
  if (!checkedParams) {
    akamaiLocale = getCountry();
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
