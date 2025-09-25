import { createTag, getConfig } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';

const FIREFLY_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS = '?size=32&sort=updated_desc&include_pending_assets=false&cursor=';
const API_KEY = 'alfred-community-hubs';
const ICON_PLAY = '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.59755 34.6503C10.6262 35.2535 11.7861 35.5552 12.9471 35.5552C14.0637 35.5552 15.1824 35.2753 16.1839 34.7132L32.1258 25.7798C34.2742 24.5775 35.5557 22.4155 35.5557 20.0002C35.5557 17.5843 34.2742 15.4228 32.1258 14.2206L16.1839 5.28719C14.1429 4.14137 11.6168 4.16523 9.59753 5.35012C7.76268 6.42434 6.66675 8.27981 6.66675 10.3094V29.6909C6.66675 31.72 7.76268 33.576 9.59755 34.6503Z" fill="black" fill-opacity="0.84" style="fill:black;fill-opacity:0.84;"/></svg>';

// Item type thresholds for categorization
const ITEM_TYPE_THRESHOLDS = {
  tall: 0.8, // aspect ratio < 0.8 = tall
  portrait: 1.0, // 0.8 <= aspect ratio < 1.0 = portrait
  square: 1.2, // 1.0 <= aspect ratio < 1.2 = square
  // anything >= 1.2 = short (landscape)
};

const RENDITION_SIZES = {
  short: { default: 350, desktop: 350, tablet: 300, mobile: 250 },
  square: { default: 400, desktop: 400, tablet: 350, mobile: 280 },
  portrait: { default: 450, desktop: 450, tablet: 400, mobile: 300 },
  tall: { default: 500, desktop: 500, tablet: 450, mobile: 350 },
};

export function safeJsonParse(jsonString, defaultValue = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return defaultValue;
  }
}

export function getLocalizedValue(localizations, currentLocale, defaultValue = '') {
  if (!localizations) return defaultValue;

  if (localizations[currentLocale]) {
    return localizations[currentLocale];
  }

  // Try language match (e.g., 'en-US' -> 'en')
  const language = currentLocale.split('-')[0];
  const languageMatch = Object.keys(localizations).find((key) => key.startsWith(language));
  if (languageMatch) {
    return localizations[languageMatch];
  }

  // Try English as fallback
  if (localizations['en-US']) {
    return localizations['en-US'];
  }

  // Get any available value
  const firstAvailable = Object.values(localizations)[0];
  if (firstAvailable) {
    return firstAvailable;
  }

  return defaultValue;
}

export function getScreenSizeCategory() {
  const viewportWidth = window.innerWidth;

  if (viewportWidth < 600) {
    return 'mobile';
  }
  if (viewportWidth < 900) {
    return 'tablet';
  }
  return 'desktop';
}

export function extractAspectRatio(asset) {
  let aspectRatio = 1; // Default to square

  // Method 1: Extract from rendition max dimensions
  if (
    // eslint-disable-next-line no-underscore-dangle
    asset._links?.rendition?.max_width && asset._links?.rendition?.max_height
  ) {
    // eslint-disable-next-line no-underscore-dangle
    aspectRatio = asset._links.rendition.max_width / asset._links.rendition.max_height;
  } else if (asset.custom?.input?.['firefly#inputModel']) {
    // Method 2: Extract from firefly#inputModel if available
    try {
      const inputModel = safeJsonParse(
        asset.custom.input['firefly#inputModel'],
      );
      if (inputModel.aspectRatio) {
        aspectRatio = parseFloat(inputModel.aspectRatio);
      }
    } catch (e) { /* eslint-disable-line no-empty */ }
  }

  return aspectRatio;
}

function constructVideoUrl(assetId) {
  return `https://cdn.cp.adobe.io/content/2/dcx/${assetId}/content/manifest/version/0/component/path/output/resource`;
}

export function getItemTypeFromAspectRatio(aspectRatio) {
  if (aspectRatio < ITEM_TYPE_THRESHOLDS.tall) {
    return 'tall';
  }
  if (aspectRatio < ITEM_TYPE_THRESHOLDS.portrait) {
    return 'portrait';
  }
  if (aspectRatio < ITEM_TYPE_THRESHOLDS.square) {
    return 'square';
  }
  return 'short';
}

function updateItemTypeClass(item, itemType) {
  const existingClasses = item.className.split(' ');
  const newClasses = existingClasses
    .filter(
      (cls) => !cls.match(/firefly-gallery-item-(short|square|portrait|tall)/),
    )
    .concat([`firefly-gallery-item-${itemType}`]);
  item.className = newClasses.join(' ');
}

async function fetchFireflyAssets(categoryId, viewBtnLabel, cgenId) {
  try {
    const response = await fetch(
      `${FIREFLY_API_URL}${API_PARAMS}&category_id=${categoryId}`,
      { headers: { 'x-api-key': API_KEY } },
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    // Shuffle assets
    // eslint-disable-next-line no-underscore-dangle
    const assets = [...(data._embedded.assets || [])].sort(
      () => Math.random() - 0.5,
    );
    assets.forEach((asset) => {
      asset.assetType = categoryId === 'VideoGeneration' ? 'video' : 'image';
      asset.viewBtnLabel = viewBtnLabel;
      asset.cgenId = cgenId;
    });
    return assets;
  } catch (error) {
    return [];
  }
}

const replaceRenditionUrl = (url, format, dimension, size) => url
  .replace(/{format}/g, format)
  .replace(/{dimension}/g, dimension)
  .replace(/{size}/g, size);

export function createFireflyURL(urn, assetType = 'image', cgenId = '') {
  const assetTypeParam = assetType === 'video' ? 'VideoGeneration' : 'ImageGeneration';
  let url = `https://firefly.adobe.com/open?assetOrigin=community&assetType=${assetTypeParam}&id=${urn}`;

  if (cgenId) {
    url += `&promoid=${cgenId}&mv=other`;
  }
  return url;
}

export function getImageRendition(asset, itemType = 'square') {
  if (!asset) return '';

  const screenSize = getScreenSizeCategory();

  const sizeObj = RENDITION_SIZES[itemType] || RENDITION_SIZES.square;
  const width = sizeObj[screenSize] || sizeObj.default;

  const renditionUrl = replaceRenditionUrl(
    // eslint-disable-next-line no-underscore-dangle
    asset._links.rendition.href,
    'jpg',
    'width',
    width,
  );

  return renditionUrl;
}

export function createGalleryStructure() {
  const galleryContainer = createTag('div', { class: 'firefly-gallery-container' });
  const galleryContent = createTag('div', { class: 'firefly-gallery-content' });
  const galleryFadeOverlay = createTag('div', { class: 'firefly-gallery-fade' });

  galleryContainer.appendChild(galleryContent);
  galleryContainer.appendChild(galleryFadeOverlay);

  return {
    container: galleryContainer,
    content: galleryContent,
  };
}

function createSkeletonLayout(container) {
  const masonryGrid = createTag('div', { class: 'firefly-gallery-masonry-grid loading' });

  const skeletonItems = [];
  const numItems = 25;

  const placeholderTypes = [
    // Column flow pattern optimized for 5 columns (5 items per column)
    // column 1
    'short', 'square', 'portrait', 'tall', 'short',
    // column 2
    'portrait', 'short', 'tall', 'square', 'portrait',
    // column 3
    'square', 'tall', 'short', 'portrait', 'tall',
    // column 4
    'tall', 'portrait', 'square', 'short', 'square',
    // column 5
    'short', 'square', 'portrait', 'tall', 'portrait',
  ];

  const initialAspectRatios = {
    short: 1.43,
    square: 1.0,
    portrait: 0.77,
    tall: 0.59,
  };

  for (let i = 0; i < numItems; i += 1) {
    const placeholderType = placeholderTypes[i];

    const itemClass = `firefly-gallery-item firefly-gallery-item-${placeholderType} skeleton-item`;
    const skeletonItem = createTag('div', { class: itemClass });

    const aspectRatio = initialAspectRatios[placeholderType];
    skeletonItem.style.setProperty('--aspect-ratio', aspectRatio);

    skeletonItem.dataset.heightRatio = aspectRatio;

    const skeletonWrapper = createTag('div', { class: 'skeleton-wrapper absolute-fill' });

    const skeletonAnimation = createTag('div', { class: 'skeleton-animation absolute-fill' });

    skeletonWrapper.appendChild(skeletonAnimation);
    skeletonItem.appendChild(skeletonWrapper);
    masonryGrid.appendChild(skeletonItem);

    skeletonItems.push(skeletonItem);
  }
  container.insertBefore(masonryGrid, container.firstChild);
  return { masonryGrid, skeletonItems };
}

function createImageElement(imageUrl, altText) {
  return createTag('img', {
    src: imageUrl,
    alt: altText,
    loading: 'lazy',
    class: 'firefly-gallery-img absolute-fill',
  });
}

function createPlayIconElement() {
  const wrapper = createTag('div', { class: 'firefly-gallery-play-icon' });
  wrapper.insertAdjacentHTML('afterbegin', ICON_PLAY);
  return wrapper;
}

function createOverlayElement(
  promptText,
  fireflyUrl,
  viewBtnLabel,
  userInfo = {},
) {
  const overlay = createTag('a', {
    class: 'firefly-gallery-overlay',
    href: fireflyUrl,
    target: '_blank',
    rel: 'noopener',
    'aria-label': 'Open in Firefly',
    tabindex: '0',
  });

  // Handle touch events specifically for iOS Safari
  overlay.addEventListener('touchstart', () => {
    // Remove focus from any other elements first
    if (document.activeElement && document.activeElement !== overlay) {
      document.activeElement.blur();
    }
  });

  const contentWrapper = createTag('div', { class: 'firefly-gallery-content-wrapper' });
  const infoContainer = createTag('div', { class: 'firefly-gallery-info-container' });

  if (userInfo.name || userInfo.avatarUrl) {
    const userInfoContainer = createTag('div', { class: 'firefly-gallery-user-info' });

    if (userInfo.avatarUrl) {
      const avatar = createTag('img', {
        src: userInfo.avatarUrl,
        alt: `${userInfo.name || 'Artist'}'s avatar`,
        class: 'firefly-gallery-user-avatar',
      });
      userInfoContainer.appendChild(avatar);
    }

    if (userInfo.name) {
      const username = createTag(
        'span',
        { class: 'firefly-gallery-username' },
        userInfo.name,
      );
      userInfoContainer.appendChild(username);
    }
    infoContainer.appendChild(userInfoContainer);
  }

  if (promptText) {
    const promptElement = createTag(
      'div',
      { class: 'firefly-gallery-prompt' },
      promptText,
    );
    infoContainer.appendChild(promptElement);
  }

  contentWrapper.appendChild(infoContainer);

  const viewButton = createTag(
    'div',
    { class: 'firefly-gallery-view-button' },
    viewBtnLabel,
  );
  contentWrapper.appendChild(viewButton);
  overlay.appendChild(contentWrapper);

  return overlay;
}

function loadAssetIntoSkeleton(
  skeletonItem,
  imageUrl,
  altText,
  promptText,
  assetUrn,
  assetData = {},
  userInfo = {},
) {
  const { id, assetType, viewBtnLabel, cgenId } = assetData;
  return new Promise((resolve) => {
    const assetContainer = createTag('div', { class: 'firefly-gallery-image' });
    if (assetType === 'video') {
      skeletonItem.classList.add('video-item');
      const playIcon = createPlayIconElement();
      assetContainer.appendChild(playIcon);
    }
    const img = createImageElement(imageUrl, altText);
    assetContainer.appendChild(img);

    // Create and append clickable overlay if prompt exists
    if (promptText) {
      const fireflyUrl = createFireflyURL(assetUrn, assetType, cgenId);
      const overlayPromptText = assetType === 'video' ? '' : promptText;
      const overlay = createOverlayElement(
        overlayPromptText,
        fireflyUrl,
        viewBtnLabel,
        userInfo,
      );
      if (assetType === 'video') {
        overlay.classList.add('firefly-gallery-video-overlay');
      }

      // Add video element inside the overlay for video assets
      if (assetType === 'video' && id) {
        const videoUrl = constructVideoUrl(id);
        const video = createTag('video', {
          src: videoUrl,
          class: 'firefly-gallery-video absolute-fill',
          muted: true,
          loop: true,
          preload: 'none',
          playsinline: true,
        });

        assetContainer.appendChild(video);

        const playVideo = () => {
          video.style.opacity = '1';
          video.muted = true;
          video.play().catch(() => {});
        };

        const pauseVideo = () => {
          video.pause();
          video.style.opacity = '0';
        };

        let hoverTimeout;
        skeletonItem.addEventListener('mouseenter', () => {
          clearTimeout(hoverTimeout);
          // Trigger video after a short delay to prevent flickering on quick mouse movement
          hoverTimeout = setTimeout(playVideo, 150);
        });

        skeletonItem.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimeout);
          pauseVideo();
        });

        // Handle keyboard focus for video playback
        overlay.addEventListener('focus', () => {
          playVideo();
        });

        overlay.addEventListener('blur', () => {
          pauseVideo();
        });
      }

      assetContainer.appendChild(overlay);
    }

    skeletonItem.classList.add('loaded');

    const skeletonWrapper = skeletonItem.querySelector('.skeleton-wrapper');
    if (skeletonWrapper) {
      skeletonItem.replaceChild(assetContainer, skeletonWrapper);
    } else {
      // Fallback if wrapper not found
      skeletonItem.innerHTML = '';
      skeletonItem.appendChild(assetContainer);
    }

    // Image successfully loaded
    resolve();
  });
}

function processItem(item, asset, index, locale) {
  const aspectRatio = extractAspectRatio(asset);

  const itemType = getItemTypeFromAspectRatio(aspectRatio);

  updateItemTypeClass(item, itemType);

  item.style.setProperty('--aspect-ratio', aspectRatio);

  const imageUrl = getImageRendition(asset, itemType);
  const altText = asset.title || 'Firefly generated image';

  let promptText = '';
  if (asset?.custom?.input?.['firefly#prompts']) {
    promptText = getLocalizedValue(
      asset.custom.input['firefly#prompts'],
      locale,
      asset.title || 'Firefly generated image',
    );
  } else {
    // Use title as fallback
    promptText = asset.title || 'Firefly generated image';
  }

  const userInfo = {};
  // eslint-disable-next-line no-underscore-dangle
  if (asset?._embedded?.owner) {
    // eslint-disable-next-line no-underscore-dangle
    const { owner } = asset._embedded;
    userInfo.name = owner.display_name
      || `${owner.first_name} ${owner.last_name}`.trim()
      || owner.user_name
      || 'Unknown Artist';

    // eslint-disable-next-line no-underscore-dangle
    if (owner._links?.images && owner._links.images.length > 0) {
      // eslint-disable-next-line no-underscore-dangle
      const sortedImages = [...owner._links.images].sort((a, b) => {
        const aDiff = Math.abs(a.width - 24);
        const bDiff = Math.abs(b.width - 24);
        return aDiff - bDiff;
      });

      userInfo.avatarUrl = sortedImages[0].href;
    }
  }

  // Prepare asset data for video handling
  const assetData = {
    id: asset.id,
    assetType: asset.assetType || 'image',
    viewBtnLabel: asset.viewBtnLabel,
    cgenId: asset.cgenId,
  };
  loadAssetIntoSkeleton(
    item,
    imageUrl,
    altText,
    promptText,
    asset.urn,
    assetData,
    userInfo,
  );
}

function loadFireflyImages(skeletonItems, assets = []) {
  try {
    if (!assets || !assets.length) {
      return;
    }

    const locale = getConfig().locale?.ietf || 'en-US';

    // Load images only when they're visible
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const index = parseInt(item.dataset.index, 10);

            obs.unobserve(item);

            // Load the image if we have an asset for it
            if (index >= 0 && index < assets.length) {
              processItem(item, assets[index], index, locale);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01,
      },
    );

    skeletonItems.forEach((item, index) => {
      item.dataset.index = index;
      observer.observe(item);
    });

    // Also process the first few items immediately for a faster initial view
    const immediateLoadCount = Math.min(4, skeletonItems.length);
    for (let i = 0; i < immediateLoadCount; i += 1) {
      if (i < assets.length) {
        processItem(skeletonItems[i], assets[i], i, locale);
        observer.unobserve(skeletonItems[i]); // Stop observing items already processed
      }
    }
  } catch (error) { /* eslint-disable-line no-empty */ }
}

function getItemTypeFromClass(item) {
  const itemClasses = item.className.split(' ');
  const sizeClassRegex = /firefly-gallery-item-(\S+)/;
  const sizeClassMatch = itemClasses.find((cls) => sizeClassRegex.test(cls));
  return sizeClassMatch ? sizeClassMatch.match(sizeClassRegex)[1] : 'square';
}

function handleResizeForGallery(assets, skeletonItems) {
  const handleResize = debounce(() => {
    if (assets?.length > 0 && skeletonItems?.length > 0) {
      skeletonItems.forEach((item, index) => {
        if (index >= assets.length) return;
        const imgElement = item.querySelector('.firefly-gallery-img');
        if (imgElement) {
          const itemType = getItemTypeFromClass(item);
          const newSrc = getImageRendition(assets[index], itemType);
          if (newSrc !== imgElement.src) {
            imgElement.src = newSrc;
          }
        }
      });
    }
  }, 250); // Wait 250ms after resize ends to recalculate

  window.addEventListener('resize', handleResize);
}

export default async function init(el) {
  el.classList.add('firefly-gallery-block', 'con-block');
  // Extract category_id - should be text2Image / VideoGeneration
  const [categoryId, cgenId] = el.querySelector('div:first-child > div').innerText.split('|').map((i) => i.trim());
  const viewBtnLabel = el.querySelector('div:last-child > div').innerText || 'View';

  // Clear existing content
  el.textContent = '';

  // Create gallery structure
  const { container, content } = createGalleryStructure();

  // Create and append skeleton layout
  const { skeletonItems, masonryGrid } = createSkeletonLayout(content);

  // Replace block content with our gallery structure
  el.appendChild(container);

  // Allow UI to be scrollable before waiting for image data
  fetchFireflyAssets(categoryId, viewBtnLabel, cgenId)
    .then((assets) => {
      if (assets && assets.length) {
        loadFireflyImages(skeletonItems, assets);
        handleResizeForGallery(assets, skeletonItems);
        masonryGrid.classList.remove('loading');
      } else {
        masonryGrid.classList.remove('loading');
      }
    })
    .catch(() => {
      masonryGrid.classList.remove('loading');
    });
}
