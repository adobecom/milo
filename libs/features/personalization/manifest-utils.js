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
function xlSerialToJsDate(xlSerial) {
  return new Date(-2209075200000 + (xlSerial - (xlSerial < 61 ? 0 : 1)) * 86400000);
}
export const preloadManifests = ({ targetManifests = [], persManifests = [], flags = [] }) => {
  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((persManifest) => {
      if (!persManifest.includes('|')) {
        return { manifestPath: appendJsonExt(persManifest) };
      }
      let disabled = false;
      const [flag, manifestPath] = persManifest.split('|');
      const flagData = flags.data.find((f) => f?.flag === flag);
      if (flagData) {
        if (flagData.onoff !== '') {
          disabled = flagData.onoff === 'off';
        } else {
          const start = xlSerialToJsDate(flagData.start);
          const end = xlSerialToJsDate(flagData.end);
          const currentDate = new Date();
          if (start && end && (currentDate < start || currentDate > end)) {
            disabled = true;
          }
        }
      }
      return { flag, manifestPath, disabled };
    }),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath && !manifest.disabled) {
      manifest.manifestPath = normalizePath(manifest.manifestPath);
      loadLink(
        manifest.manifestPath,
        { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
      );
    }
  }
  return manifests;
};
