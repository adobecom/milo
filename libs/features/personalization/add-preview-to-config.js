export default async function addPreviewToConfig(
  PAGE_URL,
  utils,
  persManifests,
  persEnabled,
  targetEnabled,
  previewPage,
) {
  const { mep: mepOverride, mepHighlight, mepButton } = Object.fromEntries(PAGE_URL.searchParams);
  const config = utils.updateConfig({
    ...utils.getConfig(),
    mep: {
      preview: (mepButton !== 'off' && (mepOverride !== undefined || (previewPage && (persEnabled || targetEnabled)))),
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
      .then(({ default: decoratePreviewMode }) => decoratePreviewMode([], utils));
  }
  return persManifests;
}
