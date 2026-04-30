import { signal } from '../../../deps/htm-preact.js';
import { getConfig } from '../../../utils/utils.js';
import { setStatus } from './status.js';
import { origin } from './franklin.js';

function getLocConfigPath() {
  const { env } = getConfig();
  return env?.name === 'prod' ? '/.milo/config.json' : '/.milo/config-stage.json';
}

export const telemetry = { application: { appName: 'Adobe Localization' } };

// Signals
export const statuses = signal({});
export const heading = signal({ name: '' });
export const languages = signal([]);
export const urls = signal([]);
export const syncFragments = signal([]);
export const siteConfig = signal(null);
export const user = signal();
export const spAccessToken = signal();
export const showLogin = signal(false);
export const allowSyncToLangstore = signal(false);
export const allowSendForLoc = signal(false);
export const allowRollout = signal(false);
export const allowCancelProject = signal(false);
export const projectCancelled = signal(false);
export const polling = signal(false);
export const projectStatus = signal({});
export const canRefresh = signal(false);
export const serviceStatus = signal('');
export const serviceStatusDate = signal();
export const isLOCV3RolloutFlow = signal(false);

export function getSiteConfig() {
  setStatus('siteConfig', 'info', 'Getting site settings.');
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (siteConfig.value) {
      setStatus('siteConfig');
      resolve(siteConfig.value);
      return;
    }
    const primaryPath = getLocConfigPath();
    let resp = await fetch(`${origin}${primaryPath}`);
    if (!resp.ok && primaryPath !== '/.milo/config.json') {
      resp = await fetch(`${origin}/.milo/config.json`);
    }
    if (!resp.ok) {
      setStatus('siteConfig', 'error', 'Error getting site settings.');
      return;
    }
    siteConfig.value = await resp.json();
    setStatus('siteConfig');
    resolve(siteConfig.value);
  });
}
