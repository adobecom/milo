const subBlocks = [
  'gnav-brand',
  'adobe-logo',
  'link-group',
  'large-menu',
  'search',
  'profile',
  'breadcrumbs',
  'gnav-promo',
  'region-selector',
  'social'
]

export function showFallback(block) {
  const isSubBlock = [...block.classList].some(r=> subBlocks.indexOf(r) >= 0)
  if (!isSubBlock) {
    block.dataset.failed = 'true';
    block.dataset.reason = `Failed loading ${name || ''} block.`;
  }
}
