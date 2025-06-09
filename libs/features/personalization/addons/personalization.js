import { getFederatedUrl } from '../../../utils/utils.js';

function parseManifestUrlAndAddSource(manifestString, source) {
  if (!manifestString) return [];
  return manifestString.toLowerCase()
    .split(/,|(\s+)|(\\n)/g)
    .filter((path) => path?.trim())
    .map((manifestPath) => ({ manifestPath, source: [source] }));
}

const isDamContent = (path) => path?.includes('/content/dam/');

export const normalizePath = (p, config, localize = true) => {
  let path = p;

  if (isDamContent(path) || !path?.includes('/')) return path;

  if (path.includes('/federal/')) return getFederatedUrl(path);

  if (!path.startsWith(config.codeRoot) && !path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }

  try {
    const url = new URL(path);
    const { hash, pathname } = url;
    const firstFolder = pathname.split('/')[1];
    const mepHash = '#_dnt';

    if (path.startsWith(config.codeRoot)
      || path.includes('.hlx.')
      || path.includes('.aem.')
      || path.includes('.adobe.')) {
      if (!localize
        || config.locale.ietf === 'en-US'
        || hash.includes(mepHash)
        || firstFolder in config.locales
        || path.includes('.json')) {
        path = pathname;
      } else {
        path = `${config.locale.prefix}${pathname}`;
      }
    }
    return `${path}${hash.replace(mepHash, '')}`;
  } catch (e) {
    return path;
  }
};

export const fetchData = async (url, config) => {
  try {
    const resp = await fetch(normalizePath(url, config));
    if (!resp.ok) {
      /* c8 ignore next 5 */
      if (resp.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`Invalid response: ${resp.status} ${resp.statusText}`);
    }
    return await resp.json();
  } catch (e) {
    /* c8 ignore next 3 */
    // log(`Error loading content: ${url}`, e.message || e);
  }
  return null;
};

export default async function init(addon, enablement, config) {
  // config.mep[addon] = enablement !== true ? enablement : await getSpectraLOB(document.referrer);
  const manifests = parseManifestUrlAndAddSource(enablement, 'pzn');
  const fetchedManifests = [];
  manifests?.forEach(async (manifest) => {
    // if (manifest.disabled) return;
    // const normalizedURL = normalizePath(manifest.manifestPath);
    // loadLink(normalizedURL, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
    const fetchedData = await fetchData(manifest, config);
    if (fetchedData) {
      fetchedManifests.push(fetchedData);
    }
  });
  if (fetchedManifests.length) {
    config.mep.fetchedManifests = [...fetchedManifests, ...config.mep.fetchedManifests || []];
  }
}
