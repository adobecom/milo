import { STATUS, ASSETS_TITLES } from './constants.js';
import { createTag } from '../../../utils/utils.js';

const maxFullWidth = 1920;
const assetsCache = new Map();

export function isViewportTooSmall() {
  return !window.matchMedia('(min-width: 1200px)').matches;
}

export async function checkImageDimensions(url, area) {
  if (isViewportTooSmall()) {
    return {
      title: ASSETS_TITLES.ImageDimensions,
      status: STATUS.EMPTY,
      description: 'Viewport is too small to run image checks (minimum width: 1200px).',
    };
  }

  if (assetsCache.has(url)) {
    const cachedResult = assetsCache.get(url);
    return JSON.parse(JSON.stringify(cachedResult));
  }

  const allImages = [...area.querySelectorAll('main picture img')];
  if (!allImages.length) {
    return {
      title: ASSETS_TITLES.ImageDimensions,
      status: STATUS.EMPTY,
      description: 'No images found in the main content.',
    };
  }

  await Promise.all(
    allImages.map((img) => {
      if (!img.complete) {
        img.setAttribute('loading', 'eager');
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      }
      return Promise.resolve();
    }),
  );

  const images = allImages.filter((img) => img.checkVisibility()
    && !img.closest('.icon-area')
    && !img.src.includes('.svg'));

  if (!images.length) {
    return {
      title: ASSETS_TITLES.ImageDimensions,
      status: STATUS.EMPTY,
      description: 'No eligible images found (visible, non-icon, non-SVG).',
    };
  }

  const viewportWidth = area.documentElement.clientWidth;
  const imagesWithMismatch = [];
  const imagesWithMatch = [];

  area.body.classList.add('preflight-assets-analysis');

  for (const img of images) {
    const naturalWidth = img.getAttribute('width') ? parseInt(img.getAttribute('width'), 10) : img.naturalWidth;
    const naturalHeight = img.getAttribute('height') ? parseInt(img.getAttribute('height'), 10) : img.naturalHeight;
    // Get the display dimensions of the image
    const displayWidth = img.offsetWidth;
    const displayHeight = img.offsetHeight;
    // Check if the image is full width
    const isFullWidthImage = displayWidth >= viewportWidth;
    // Define the ideal factor depending on the image's display width
    const idealFactor = isFullWidthImage ? 1.5 : 2;
    // Get the multiplication factor depending on image display width; allow 5% tolerance
    const factorDivisor = isFullWidthImage ? maxFullWidth : displayWidth;
    const actualFactor = Math.round((naturalWidth / factorDivisor) * 100) / 100;
    const roundedFactor = Math.ceil(actualFactor * 20) / 20;
    // Check if the image meets the ideal factor
    const hasMismatch = roundedFactor < idealFactor;
    // Define the recommended dimensions
    const recommendedDimensions = isFullWidthImage
      ? `${maxFullWidth * idealFactor}x${Math.ceil((maxFullWidth * idealFactor * naturalHeight) / naturalWidth)}`
      : `${Math.ceil(displayWidth * idealFactor)}x${Math.ceil(displayHeight * idealFactor)}`;
    // Save the image data relevant to the final template
    const imageData = {
      src: img.getAttribute('src'),
      naturalDimensions: `${naturalWidth}x${naturalHeight}`,
      displayDimensions: `${displayWidth}x${displayHeight}`,
      recommendedDimensions,
      roundedFactor,
      hasMismatch,
    };
    // Check for or define a picture meta element to display image analysis results
    let pictureMetaElem = img.closest('picture').querySelector('.picture-meta');
    if (!pictureMetaElem) {
      pictureMetaElem = createTag('div', { class: 'picture-meta' });
      img.closest('picture').insertBefore(pictureMetaElem, img.nextSibling);
    }

    const assetMessage = createTag(
      'div',
      { class: `picture-meta-asset preflight-decoration ${hasMismatch ? 'has-mismatch' : 'no-mismatch'}` },
      hasMismatch
        ? `Size: too small, use > ${imageData.recommendedDimensions}`
        : 'Size: correct',
    );
    pictureMetaElem.append(assetMessage);

    if (hasMismatch) {
      imagesWithMismatch.push(imageData);
    } else {
      imagesWithMatch.push(imageData);
    }
  }

  area.body.classList.remove('preflight-assets-analysis');

  const result = {
    title: ASSETS_TITLES.ImageDimensions,
    status: imagesWithMismatch.length > 0 ? STATUS.FAIL : STATUS.PASS,
    description:
      imagesWithMismatch.length > 0
        ? `${imagesWithMismatch.length} image(s) have dimension mismatches.`
        : 'All images have matching dimensions.',
    details: {
      imagesWithMismatch,
      imagesWithMatch,
    },
  };

  if (result.status === STATUS.PASS || result.status === STATUS.FAIL) {
    assetsCache.set(url, JSON.parse(JSON.stringify(result)));
  }

  return result;
}

export function runChecks(url, area) {
  return [checkImageDimensions(url, area)];
}
