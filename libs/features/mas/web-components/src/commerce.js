import { EVENT_TYPE_READY, TAG_NAME_SERVICE } from './constants.js';

/**
 * Waits for commerce service to be ready and returns.
 */
export async function getService() {
    const { head } = document;
    const current = head.querySelector(TAG_NAME_SERVICE);
    if (current) return Promise.resolve(current);
    return new Promise((resolve, reject) => {
        head.addEventListener(
            EVENT_TYPE_READY,
            () => {
                const service = head.querySelector(TAG_NAME_SERVICE);
                if (service) resolve(service);
                else reject(new Error('Commerce service not found'));
            },
            { once: true },
        );
    });
}
