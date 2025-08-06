import { createTag } from '../../utils/utils.js';

export function addAssetMetadata(asset, assetData) {
  let parent;
  if (asset.tagName === 'VIDEO') {
    parent = asset.closest('.video-holder') || asset.parentElement;
  } else if (asset.tagName === 'IFRAME') {
    parent = asset.closest('.milo-video') || asset.parentElement;
  } else {
    parent = asset.closest('picture') || asset.parentElement;
  }

  let container = parent.querySelector('.asset-meta');
  if (!container) {
    container = createTag('div', { class: 'asset-meta' });
    parent.insertBefore(container, asset.nextSibling);
  }

  const sizeStatus = assetData.hasMismatch ? 'is-invalid' : 'is-valid';
  const isAboveFoldCritical = assetData.isAboveFold && assetData.hasMismatch;

  const sizeMessage = (isAboveFoldCritical && `CRITICAL: size issue! Use > ${assetData.recommendedDimensions}`)
    || (assetData.hasMismatch && `Size: too small, use > ${assetData.recommendedDimensions}`)
    || 'Size: correct';

  const sizeEl = createTag('div', { class: `asset-meta-entry preflight-decoration ${sizeStatus} ${isAboveFoldCritical ? 'above-fold-critical' : ''}` }, sizeMessage);
  container.appendChild(sizeEl);

  if (assetData.type === 'mpc') {
    const title = asset.title || '';
    const titleStatus = title.length ? 'is-valid' : 'is-invalid';
    const titleMessage = title.length ? `Title: ${title}` : 'Title: no title';

    const titleEl = createTag('div', { class: `asset-meta-entry preflight-decoration ${titleStatus}` }, titleMessage);
    container.appendChild(titleEl);
  }
}

export function addAccessibilityMetadata(element, message, status = '') {
  const picture = element.closest('picture');
  let container;

  if (picture) {
    container = picture.querySelector('.picture-meta');
    if (!container) {
      container = createTag('div', { class: 'picture-meta preflight-decoration' });
      picture.insertBefore(container, element.nextSibling);
    }
  } else {
    container = createTag('div', { class: 'picture-meta preflight-decoration no-picture-tag' });
    element.parentNode.insertBefore(container, element.nextSibling);
  }

  const metadataEl = createTag('div', { class: `picture-meta-a11y preflight-decoration ${status}` }, message);
  container.appendChild(metadataEl);
}
