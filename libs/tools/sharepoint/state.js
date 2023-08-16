import { signal } from '../../deps/htm-preact.js';

const CONFIG = '/.milo/config.json';

// Signals
export const siteConfig = signal(null);
export const spAccessToken = signal();

export function getSiteConfig() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (siteConfig.value) {
      resolve(siteConfig.value);
      return;
    }

    const resp = await fetch(`${origin}${CONFIG}`);

    if (!resp.ok) {
      window.lana?.log('Error getting site settings.');
      return;
    }
    siteConfig.value = await resp.json();
    resolve(siteConfig.value);
  });
}
