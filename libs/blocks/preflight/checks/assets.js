import { STATUS, SEVERITY, ASSETS_TITLES, ASSETS_IDS, ASSETS_SEVERITIES } from './constants.js';
import { createTag } from '../../../utils/utils.js';
import { displayPreflightVisuals } from '../visual-metadata.js';

const maxFullWidth = 1920;

function loadImage(asset) {
  if (asset.complete) return Promise.resolve();
  asset.setAttribute('loading', 'eager');

  return new Promise((resolve) => {
    ['load', 'error'].forEach((evt) => asset.addEventListener(evt, resolve, { once: true }));
  });
}

function loadVideo(asset) {
  if (asset.querySelector('source')
    && asset.readyState > 1
    && asset.videoWidth > 0) return Promise.resolve();

  return new Promise((resolve) => {
    asset.appendChild(createTag('source', { src: asset.getAttribute('data-video-source'), type: 'video/mp4' }));
    ['loadedmetadata', 'error'].forEach((evt) => asset.addEventListener(evt, resolve, { once: true }));
    asset.load();
  });
}

function loadMpc(asset) {
  return new Promise((resolve) => {
    const idMatch = asset.src.match(/\/v\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : null;
    if (!videoId) resolve();

    window.fetch(`https://video.tv.adobe.com/v/${videoId}?format=json`)
      .then((res) => res.json())
      .then((info) => {
        const activeSource = info.sources.find((source) => source.active);
        asset.setAttribute('data-video-width', activeSource.width);
        asset.setAttribute('data-video-height', activeSource.height);
        resolve();
      });
  });
}

async function loadAssets(assets) {
  const loadedAssets = assets.map((asset) => {
    if (asset.tagName === 'IMG') return loadImage(asset);
    if (asset.tagName === 'VIDEO') return loadVideo(asset);
    if (asset.tagName === 'IFRAME') return loadMpc(asset);

    return Promise.resolve();
  });

  await Promise.all(loadedAssets);

  return assets.filter((asset) => asset.checkVisibility()
    && !asset.closest('.icon-area')
    && !asset.src.includes('.svg'));
}

function getAssetDimensions(asset, type) {
  let naturalWidth;
  let naturalHeight;

  switch (type) {
    case 'video':
      naturalWidth = asset.videoWidth;
      naturalHeight = asset.videoHeight;
      break;
    case 'mpc':
      naturalWidth = asset.getAttribute('data-video-width');
      naturalHeight = asset.getAttribute('data-video-height');
      break;
    default:
      naturalWidth = asset.getAttribute('width') ? parseInt(asset.getAttribute('width'), 10) : asset.naturalWidth;
      naturalHeight = asset.getAttribute('height') ? parseInt(asset.getAttribute('height'), 10) : asset.naturalHeight;
  }

  return { naturalWidth, naturalHeight };
}

function isNotConstrainedByContainer(asset) {
  const picture = asset.closest?.('picture');
  if (!picture) return false;
  const childWidth = picture.offsetWidth;
  let parent = picture.parentElement;
  let depth = 0;
  while (parent && depth < 5) {
    const parentWidth = parent.offsetWidth;
    if (parentWidth === childWidth) return false;
    if (parentWidth > 0 && parentWidth !== childWidth) return true;
    parent = parent.parentElement;
    depth += 1;
  }
  return false;
}

function getAssetData(asset) {
  // Get the asset type
  const type = (asset.tagName === 'VIDEO' && 'video') || (asset.tagName === 'IFRAME' && 'mpc') || 'image';

  // Calculate asset dimensions
  const { naturalWidth, naturalHeight } = getAssetDimensions(asset, type);

  // Get the display dimensions of the asset
  const { offsetWidth, offsetHeight } = asset;

  // Check if the asset is full width
  const viewportWidth = document.documentElement.clientWidth;
  const isFullWidthAsset = offsetWidth >= viewportWidth;

  // Define the ideal factor depending on the asset's display width
  let idealFactor = isFullWidthAsset ? 1.5 : 2;
  if (['video', 'mpc'].includes(type)) idealFactor = 1;

  // Get the multiplication factor depending on asset display width; allow 5% tolerance
  const factorDivisor = isFullWidthAsset ? maxFullWidth : offsetWidth;
  const actualFactor = Math.round((naturalWidth / factorDivisor) * 100) / 100;
  const roundedFactor = Math.ceil(actualFactor * 20) / 20;

  // Check if the asset meets the ideal factor
  let hasMismatch = roundedFactor < idealFactor;

  if (hasMismatch && type === 'image' && isNotConstrainedByContainer(asset)) hasMismatch = false;

  // Define the recommended dimensions
  const recommendedDimensions = isFullWidthAsset
    ? `${maxFullWidth * idealFactor}x${Math.ceil((maxFullWidth * idealFactor * naturalHeight) / naturalWidth)}`
    : `${Math.ceil(offsetWidth * idealFactor)}x${Math.ceil(offsetHeight * idealFactor)}`;

  // Check if the source is an MPC MP4
  const sourceElement = asset.querySelector?.('source');
  const isMpcSrc = sourceElement?.src && new URL(sourceElement.src).hostname === 'images-tv.adobe.com';

  // Define the type label
  const typeLabel = (type === 'mpc' && 'Video (MPC)')
    || (isMpcSrc && 'Video (MPC source)')
    || (type === 'video' && 'Video (Sharepoint)')
    || 'Image';

  // Perform additional video checks
  let notes;
  if (type === 'video'
    && asset.webkitAudioDecodedByteCount
    && (asset.controls || !asset.muted)) {
    notes = 'Has audio, MPC should be used instead.';
  }
  if (type === 'video' && asset.closest('.background') && isMpcSrc) {
    notes = 'MPC MP4 used as background, Sharepoint MP4 should be used instead.';
  }

  // Return the asset data relevant to the final template
  return {
    type,
    src: asset.getAttribute(type === 'video' ? 'data-video-source' : 'src'),
    naturalDimensions: `${naturalWidth}x${naturalHeight}`,
    displayDimensions: `${offsetWidth}x${offsetHeight}`,
    recommendedDimensions,
    roundedFactor,
    hasMismatch,
    typeLabel,
    notes,
  };
}

function isAboveFold(asset) {
  const main = asset.closest('main');
  const sections = main?.querySelectorAll(':scope > div.section');

  return !sections.length
    || sections[0]?.contains(asset)
    || sections[1]?.contains(asset);
}

export function isViewportTooSmall() {
  return !window.matchMedia('(min-width: 1200px)').matches;
}

export async function checkImageDimensions(url, area, injectVisualMetadata = false) {
  if (isViewportTooSmall()) {
    return {
      checkId: ASSETS_IDS.imageDimensions,
      severity: ASSETS_SEVERITIES.imageDimensions,
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'Viewport is too small to run asset checks (minimum width: 1200px).',
    };
  }

  const allAssets = [
    ...area.querySelectorAll(
      'main picture img, main video, :is(main, .dialog-modal:not(#preflight)) .adobetv',
    ),
  ];

  if (!allAssets.length) {
    return {
      checkId: ASSETS_IDS.imageDimensions,
      severity: ASSETS_SEVERITIES.imageDimensions,
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'No assets found in the main content.',
    };
  }

  const assets = await loadAssets(allAssets);

  if (!assets.length) {
    return {
      checkId: ASSETS_IDS.imageDimensions,
      severity: ASSETS_SEVERITIES.imageDimensions,
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'No eligible assets found (visible, non-icon, non-SVG).',
    };
  }

  const processedAssets = assets.map((asset) => {
    const assetData = getAssetData(asset);
    const isAssetAboveFold = isAboveFold(asset);
    assetData.isAboveFold = isAssetAboveFold;
    assetData.asset = asset;

    if (assetData.hasMismatch) {
      assetData.failure = isAssetAboveFold ? SEVERITY.CRITICAL : SEVERITY.WARNING;
    } else {
      assetData.failure = null;
    }

    return assetData;
  });

  if (injectVisualMetadata) displayPreflightVisuals(processedAssets);

  const getStatus = () => {
    const criticalCount = processedAssets.filter(
      (check) => check.failure === 'critical',
    ).length;
    const warningCount = processedAssets.filter(
      (check) => check.failure === 'warning',
    ).length;

    if (criticalCount === 0 && warningCount > 0) {
      return {
        checkId: ASSETS_IDS.imageDimensions,
        severity: SEVERITY.WARNING,
        description: `${warningCount} below-the-fold asset(s) have dimension mismatches.`,
        status: STATUS.PASS,
      };
    }

    if (criticalCount > 0) {
      const criticalMsg = `${criticalCount} above-the-fold asset(s) have dimension mismatches (critical).`;
      const warningMsg = warningCount > 0 ? ` ${warningCount} below-the-fold asset(s) also have issues.` : '';
      return {
        checkId: ASSETS_IDS.imageDimensions,
        severity: SEVERITY.CRITICAL,
        description: criticalMsg + warningMsg,
        status: STATUS.FAIL,
      };
    }
    return {
      checkId: ASSETS_IDS.imageDimensions,
      severity: ASSETS_SEVERITIES.imageDimensions,
      description: 'All assets have matching dimensions.',
      status: STATUS.PASS,
    };
  };

  const status = getStatus();

  const result = {
    ...status,
    title: ASSETS_TITLES.AssetDimensions,
    details: {
      assets: processedAssets,
      assetsWithMismatch: processedAssets.filter((data) => data.hasMismatch),
      assetsWithMatch: processedAssets.filter((data) => !data.hasMismatch),
      criticalAssetFailures: processedAssets.filter((data) => data.failure === 'critical'),
      warningAssetFailures: processedAssets.filter((data) => data.failure === 'warning'),
    },
  };

  return result;
}

export function runChecks(url, area, injectVisualMetadata = false) {
  return [checkImageDimensions(url, area, injectVisualMetadata)];
}
