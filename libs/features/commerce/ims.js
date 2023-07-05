// @ts-nocheck

export const IMS_POLL_INTERVAL = 200;
export const IMS_POLL_MAX_ATTEMPTS = 25;

/** @type {Commerce.pollImsCountry} */
export function pollImsCountry({
  interval = IMS_POLL_INTERVAL,
  maxAttempts = IMS_POLL_MAX_ATTEMPTS,
} = {}) {
  return new Promise((resolve) => {
    let count = 0;

    function poll() {
      if (window.adobeIMS) {
        if (window.adobeIMS.isSignedInUser()) {
          window.adobeIMS
            .getProfile()
            .then((profile) => resolve(profile.countryCode))
            .catch(() => resolve());
        } else {
          resolve();
        }
      } else if (++count > maxAttempts) {
        resolve();
      } else {
        setTimeout(poll, interval);
      }
    }

    poll();
  });
}

export default pollImsCountry;
