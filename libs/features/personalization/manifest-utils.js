import { loadLink } from '../../utils/utils.js';

export const appendJsonExt = (path) => (path.endsWith('.json') ? path : `${path}.json`);

export const normalizePath = (p) => {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  if (path.startsWith('http')) {
    try {
      path = new URL(path).pathname;
    } catch (e) { /* return path below */ }
  } else if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const preloadManifests = ({ targetManifests = [], persManifests = [] }) => {
  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifestPath) => ({ manifestPath: appendJsonExt(manifestPath) })),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath) {
      manifest.manifestPath = normalizePath(manifest.manifestPath);
      loadLink(
        manifest.manifestPath,
        { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
      );
    }
  }
  return manifests;
};
