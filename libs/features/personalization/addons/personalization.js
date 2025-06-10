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

// export const fetchData = async (url, config) => {
//   try {
//     const normalizedUrl = normalizePath(url, config, false);
//     const resp = await fetch(normalizedUrl, null);
//     if (!resp.ok) {
//       /* c8 ignore next 5 */
//       if (resp.status === 404) {
//         throw new Error('File not found');
//       }
//       throw new Error(`Invalid response: ${resp.status} ${resp.statusText}`);
//     }
//     return await resp.json();
//   } catch (e) {
//     /* c8 ignore next 3 */
//     console.log(`Error loading content: ${url}`, e.message || e);
//   }
//   return null;
// };

export async function fetchData(url, config) {
  try {
    const normalizedUrl = normalizePath(url, config, false);
    const resp = await fetch(normalizedUrl, null);
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
    console.log(`Error loading content: ${url}`, e.message || e);
  }
  return null;
}

export default async function init(addon, enablement, config) {
  const manifests = parseManifestUrlAndAddSource(enablement, 'pzn');
  if (!manifests?.length) return;

  await Promise.all(manifests.map(async (manifest) => {
    const fetchedData = await fetchData(manifest.manifestPath, config);
    if (fetchedData) {
      manifest.data = fetchedData;
    }
  }));

  config.mep.fetchedManifests = [...manifests, ...(config.mep.fetchedManifests || [])];
}
