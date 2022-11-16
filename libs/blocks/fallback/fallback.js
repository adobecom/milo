const subBlocks = [
  'adobe-logo',
  'breadcrumbs',
  'gnav-brand',
  'gnav-promo',
  'large-menu',
  'link-group',
  'profile',
  'region-selector',
  'search',
  'social'
]

export function showError(block, name) {
  const isSubBlock = [...block.classList].some(r=> subBlocks.indexOf(r) >= 0)
  if (!isSubBlock) {
    block.dataset.failed = 'true';
    block.dataset.reason = `Failed loading ${name || ''} block.`;
  }
}
