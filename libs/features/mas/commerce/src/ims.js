import { Log } from './log.js';

/** @type {Commerce.Ims.imsReady} */
export function imsReady({ interval = 200, maxAttempts = 25 } = {}) {
    const log = Log.module('ims');
    return new Promise((resolve) => {
        log.debug('Waing for IMS to be ready');
        let count = 0;

        function poll() {
            if (window.adobeIMS?.initialized) {
                resolve();
            } else if (++count > maxAttempts) {
                log.debug('Timeout');
                resolve();
            } else {
                setTimeout(poll, interval);
            }
        }
        poll();
    });
}

/** @type {Commerce.Ims.imsSignedIn} */
export function imsSignedIn(imsReadyPromise) {
    return imsReadyPromise.then(
        () => window.adobeIMS?.isSignedInUser() ?? false,
    );
}

/** @type {Commerce.Ims.imsCountry} */
export function imsCountry(imsSignedInPromise) {
    const log = Log.module('ims');
    return imsSignedInPromise.then((signedIn) => {
        if (!signedIn) return null;
        return window.adobeIMS.getProfile().then(
            ({ countryCode }) => {
                log.debug('Got user country:', countryCode);
                return countryCode;
            },
            (error) => {
                log.error('Unable to get user country:', error);
                return undefined;
            },
        );
    });
}

/**
 * @returns {Commerce.Ims.Client}
 */
export function Ims({}) {
    const imsReadyPromise = imsReady();
    const imsSignedInPromise = imsSignedIn(imsReadyPromise);
    const imsCountryPromise = imsCountry(imsSignedInPromise);
    return { imsReadyPromise, imsSignedInPromise, imsCountryPromise };
}
