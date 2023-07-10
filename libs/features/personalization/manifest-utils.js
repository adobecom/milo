export const appendJsonExt = (path) => (path.endsWith('.json') ? path : `${path}.json`);

export const normalizePath = (p, utils) => {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  const config = utils.getConfig();

  if (path.startsWith(config.codeRoot) || path.startsWith(`https://${config.productionDomain}`)) {
    try {
      path = new URL(path).pathname;
    } catch (e) { /* return path below */ }
  } else if (!path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const preloadManifests = ({ targetManifests = [], persManifests = [] }, utils) => {
  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifestPath) => ({ manifestPath: appendJsonExt(manifestPath) })),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath) {
      manifest.manifestPath = normalizePath(manifest.manifestPath, utils);
      utils.loadLink(
        manifest.manifestPath,
        { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
      );
    }
  }
  return manifests;
};
