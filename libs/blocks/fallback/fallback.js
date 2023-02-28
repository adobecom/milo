/**
 * Some blocks are not meant to be loaded out of the
 * blocks folder. They are typically used used in
 * larger blocks only to help add context to content.
 */
const SYNTHETIC_BLOCKS = [
  'adobe-logo',
  'breadcrumbs',
  'gnav-brand',
  'gnav-promo',
  'large-menu',
  'library-metadata',
  'link-group',
  'profile',
  'region-selector',
  'search',
  'social',
];

// eslint-disable-next-line import/prefer-default-export
export function showError(block, name) {
  const isSynth = SYNTHETIC_BLOCKS.some((synth) => synth === name);
  if (isSynth) return;
  block.dataset.failed = 'true';
  block.dataset.reason = `Failed loading ${name || ''} block.`;
}
