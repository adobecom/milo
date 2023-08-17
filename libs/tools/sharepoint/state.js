import { signal } from '../../deps/htm-preact.js';

const CONFIG = '/.milo/config.json';

const urlParams = new URLSearchParams(window.location.search);
const owner = urlParams.get('owner') || 'adobecom';
const repo = urlParams.get('repo') || 'milo';
const ref = urlParams.get('ref') || 'main';
const origin = `https://${ref}--${repo}--${owner}.hlx.page`;

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
