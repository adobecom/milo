/**
 * Some blocks are not meant to be loaded out of the
 * blocks folder. They are typically used in
 * larger blocks only to help add context to content.
 */
const SYNTHETIC_BLOCKS = [
  'adobe-logo',
  'brand',
  'breadcrumbs',
  'column-break',
  'contact-support',
  'cross-cloud-menu',
  'gnav-brand',
  'gnav-promo',
  'large-menu',
  'library-metadata',
  'link-group',
  'mailing-list',
  'profile',
  'region-selector',
  'search',
  'social',
  'product-entry-cta',
  'gnav-image',
  'gnav-dropdown-metadata',
  'featured-card',
  'product-card',
  'links-card',
  'promo-card',
  'promo-card-small',
];

// eslint-disable-next-line import/prefer-default-export
export function showError(block, name) {
  const isSynth = [...block.classList].some((className) => SYNTHETIC_BLOCKS.includes(className));
  if (isSynth) return;
  block.dataset.failed = 'true';
  block.dataset.reason = `Failed loading ${name || ''} block.`;
}
