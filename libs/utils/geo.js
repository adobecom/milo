/* eslint-disable no-console */

/**
 * Gets the Akamai country code from the geo2.adobe.com service.
 * @returns {Promise<string|null>} A promise that resolves to the lowercase Akamai country code.
 */
export const getAkamaiCode = () => new Promise((resolve, reject) => {
  /* c8 ignore next 5 */
  fetch('https://geo2.adobe.com/json/', { cache: 'no-cache' }).then((resp) => {
    if (!resp?.ok) {
      reject(new Error(`Something went wrong getting the akamai Code. Response status text: ${resp?.statusText ?? 'no response'}`));
      return;
    }
    {
      const jsonPromise = typeof resp.json === 'function' ? resp.json() : Promise.resolve(null);
      Promise.resolve(jsonPromise).then((data) => {
        const country = data?.country;
        if (country == null || typeof country !== 'string') {
          reject(new Error('Something went wrong getting the akamai Code. No country in response'));
          return;
        }
        const code = country.toLowerCase();
        sessionStorage.setItem('akamai', code);
        resolve(code);
      }).catch((err) => reject(err));
    }
  }).catch((error) => {
    reject(new Error(`Something went wrong getting the akamai Code. ${error.message}`));
  });
});

export default getAkamaiCode;
