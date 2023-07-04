/** @type {Commerce.pollImsCountry} */
export default function pollImsCountry() {
  return new Promise((resolve) => {
    let count = 0;
    const check = setInterval(() => {
      count += 1;
      if (window.adobeIMS) {
        clearInterval(check);
        if (window.adobeIMS.isSignedInUser()) {
          window.adobeIMS
            .getProfile()
            .then(({ countryCode }) => resolve(countryCode))
            .catch(() => resolve());
        } else {
          resolve();
        }
      } else if (count > 25) {
        clearInterval(check);
        resolve();
      }
    }, 200);
  });
}
