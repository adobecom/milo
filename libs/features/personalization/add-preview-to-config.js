import { getConfig, updateConfig } from '../../utils/utils.js';

export default async function addPreviewToConfig({
  pageUrl,
  persEnabled,
  persManifests,
  targetEnabled,
}) {
  const { mep: mepOverride, mepHighlight, mepButton } = Object.fromEntries(pageUrl.searchParams);
  const config = updateConfig({
    ...getConfig(),
    mep: {
      preview: (mepButton !== 'off' && (mepOverride !== undefined || persEnabled || targetEnabled)),
      override: mepOverride ? decodeURIComponent(mepOverride) : '',
      highlight: (mepHighlight !== undefined && mepHighlight !== 'false'),
    },
  });

  if (config.mep.override !== '') {
    const persManifestPaths = persManifests.map((manifest) => {
      if (manifest.startsWith('/')) return manifest;
      try {
        const url = new URL(manifest);
        return url.pathname;
      } catch (e) {
        return manifest;
      }
    });

    config.mep.override.split(',').forEach((manifestPair) => {
      const manifestTitle = manifestPair.trim().toLowerCase().split('--')[0];
      if (!persManifestPaths.includes(manifestTitle)) {
        persManifests.push(manifestTitle);
      }
    });
  }

  return persManifests;
}
