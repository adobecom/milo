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
      // TODO: check if gnav provides better implementation than this
      if (window.adobeIMS) {
        if (window.adobeIMS.isSignedInUser()) {
          window.adobeIMS
            .getProfile()
            .then((profile) => resolve(profile.countryCode))
            .catch(() => resolve());
        } else {
          resolve();
        }
      // eslint-disable-next-line no-plusplus
      } else if (++count > maxAttempts) {
        resolve();
      } else {
        setTimeout(poll, interval);
      }
    }

    poll();
  });
}
