import { getConfig, updateConfig } from '../../utils/utils.js';

export default async function addPreviewToConfig({
  pageUrl,
  mepEnabled,
  persManifests,
  targetEnabled,
}) {
  const { mep: mepOverride, mepHighlight, mepButton } = Object.fromEntries(pageUrl.searchParams);
  const config = updateConfig({
    ...getConfig(),
    mep: {
      preview: (mepButton !== 'off' && (mepOverride !== undefined || mepEnabled)),
      override: mepOverride ? decodeURIComponent(mepOverride) : '',
      highlight: (mepHighlight !== undefined && mepHighlight !== 'false'),
      targetEnabled,
    },
  });

  if (config.mep.override !== '') {
    const persManifestPaths = persManifests.map((manifest) => {
      const { manifestPath } = manifest;
      if (manifestPath.startsWith('/')) return manifestPath;
      try {
        const url = new URL(manifestPath);
        return url.pathname;
      } catch (e) {
        return manifestPath;
      }
    });

    config.mep.override.split('---').forEach((manifestPair) => {
      const manifestPath = manifestPair.trim().toLowerCase().split('--')[0];
      if (!persManifestPaths.includes(manifestPath)) {
        persManifests.push({ manifestPath });
      }
    });
  }

  return persManifests;
}
