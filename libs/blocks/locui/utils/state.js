import { signal } from '../../../deps/htm-preact.js';
import { origin } from './franklin.js';

const LOC_CONFIG = '/drafts/localization/configs/config.json';

// Signals
export const statuses = signal({});
export const heading = signal({ name: '' });
export const languages = signal([]);
export const urls = signal([]);
export const siteConfig = signal(null);
export const user = signal();
export const spAccessToken = signal();

export function setStatus(name, type, text, description, timeout) {
  const content = type && text ? { type, text, description } : null;
  statuses.value = { ...statuses.value, [name]: content };
  if (timeout) {
    setTimeout(() => {
      delete statuses.value[name];
      statuses.value = { ...statuses.value };
    }, timeout);
  }
}

export function getSiteConfig() {
  setStatus('siteConfig', 'info', 'Getting site settings.');
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (siteConfig.value) {
      setStatus('siteConfig');
      resolve(siteConfig.value);
      return;
    }
    const resp = await fetch(`${origin}${LOC_CONFIG}`);
    if (!resp.ok) {
      setStatus('siteConfig', 'error', 'Error getting site settings.');
      return;
    }
    siteConfig.value = await resp.json();
    setStatus('siteConfig');
    resolve(siteConfig.value);
  });
}
