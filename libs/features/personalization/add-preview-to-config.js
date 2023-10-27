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
    config.mep.override.split(',').forEach((manifestPair) => {
      persManifests.push(manifestPair.trim().toLowerCase().split('--')[0]);
    });
  }

  if (config.mep.preview && !targetEnabled && !persManifests.length) {
    import('./preview.js')
      .then(({ default: decoratePreviewMode }) => decoratePreviewMode([]));
  }
  return persManifests;
}
