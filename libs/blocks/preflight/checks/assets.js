import { STATUS, ASSETS_TITLES, CHECK_IDS, getCheckSeverity, SEVERITY } from './constants.js';
import { createTag } from '../../../utils/utils.js';
import { addAssetMetadata } from '../visual-metadata.js';

const maxFullWidth = 1920;
const assetsCache = new Map();

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
  const hasMismatch = roundedFactor < idealFactor;

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

// Determine if an asset is above-the-fold and should be considered critical
function isAboveFold(asset) {
  const main = asset.closest('main');
  if (!main) return false;

  const sections = main.querySelectorAll(':scope > div.section');
  if (sections.length === 0) return true; // If no sections, assume critical

  const firstSection = sections[0];
  const secondSection = sections[1];
  const isInFirstSection = firstSection && firstSection.contains(asset);
  const isInSecondSection = secondSection && secondSection.contains(asset);
  const isInHeroBlock = asset.closest('.hero, .marquee, .hero-marquee');

  return isInFirstSection || isInSecondSection || !!isInHeroBlock;
}

export function isViewportTooSmall() {
  return !window.matchMedia('(min-width: 1200px)').matches;
}

export async function checkImageDimensions(url, area, injectVisualMetadata = false) {
  if (isViewportTooSmall()) {
    return {
      checkId: CHECK_IDS.IMAGE_DIMENSIONS,
      severity: getCheckSeverity(CHECK_IDS.IMAGE_DIMENSIONS),
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'Viewport is too small to run asset checks (minimum width: 1200px).',
    };
  }

  const cacheKey = `${url}_${injectVisualMetadata}`;
  if (assetsCache.has(cacheKey)) {
    const cachedResult = assetsCache.get(cacheKey);
    return JSON.parse(JSON.stringify(cachedResult));
  }

  const allAssets = [
    ...area.querySelectorAll(
      'main picture img, main video, :is(main, .dialog-modal:not(#preflight)) .adobetv',
    ),
  ];

  if (!allAssets.length) {
    return {
      checkId: CHECK_IDS.IMAGE_DIMENSIONS,
      severity: getCheckSeverity(CHECK_IDS.IMAGE_DIMENSIONS),
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'No assets found in the main content.',
    };
  }

  const assets = await loadAssets(allAssets);

  if (!assets.length) {
    return {
      checkId: CHECK_IDS.IMAGE_DIMENSIONS,
      severity: getCheckSeverity(CHECK_IDS.IMAGE_DIMENSIONS),
      title: ASSETS_TITLES.AssetDimensions,
      status: STATUS.EMPTY,
      description: 'No eligible assets found (visible, non-icon, non-SVG).',
    };
  }

  const assetsWithMismatch = [];
  const assetsWithMatch = [];
  const criticalAssetFailures = [];
  const warningAssetFailures = [];

  if (injectVisualMetadata) area.body.classList.add('preflight-assets-analysis');

  for (const asset of assets) {
    const assetData = getAssetData(asset);
    const isAssetAboveFold = isAboveFold(asset);
    assetData.isAboveFold = isAssetAboveFold;

    if (injectVisualMetadata) addAssetMetadata(asset, assetData);

    if (assetData.hasMismatch) {
      assetsWithMismatch.push(assetData);

      if (isAssetAboveFold) {
        criticalAssetFailures.push(assetData);
      } else {
        warningAssetFailures.push(assetData);
      }
    } else {
      assetsWithMatch.push(assetData);
    }
  }

  if (injectVisualMetadata) area.body.classList.remove('preflight-assets-analysis');

  let dynamicSeverity;
  let description;
  let status;

  if (assetsWithMismatch.length === 0) {
    dynamicSeverity = getCheckSeverity(CHECK_IDS.IMAGE_DIMENSIONS);
    description = 'All assets have matching dimensions.';
    status = STATUS.PASS;
  } else if (criticalAssetFailures.length > 0) {
    dynamicSeverity = SEVERITY.CRITICAL;
    const criticalMsg = `${criticalAssetFailures.length} above-the-fold asset(s) have dimension mismatches (critical).`;
    const warningMsg = warningAssetFailures.length > 0
      ? ` ${warningAssetFailures.length} below-the-fold asset(s) also have issues.`
      : '';
    description = criticalMsg + warningMsg;
    status = STATUS.FAIL; // Triggers preflight notification
  } else {
    dynamicSeverity = SEVERITY.WARNING;
    description = `${warningAssetFailures.length} below-the-fold asset(s) have dimension mismatches.`;
    status = STATUS.LIMBO;
  }

  const result = {
    checkId: CHECK_IDS.IMAGE_DIMENSIONS,
    severity: dynamicSeverity,
    title: ASSETS_TITLES.AssetDimensions,
    status,
    description,
    details: {
      assetsWithMismatch,
      assetsWithMatch,
      criticalAssetFailures,
      warningAssetFailures,
    },
  };

  const validStatuses = [STATUS.PASS, STATUS.FAIL, STATUS.LIMBO];
  if (validStatuses.includes(result.status)) {
    assetsCache.set(cacheKey, JSON.parse(JSON.stringify(result)));
  }

  return result;
}

export function runChecks(url, area, injectVisualMetadata = false) {
  return [checkImageDimensions(url, area, injectVisualMetadata)];
}
