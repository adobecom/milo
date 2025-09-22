import { createTag, getConfig } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';

const FIREFLY_API_URL = 'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS = '?size=32&sort=updated_desc&include_pending_assets=false&cursor=';
const API_KEY = 'alfred-community-hubs';

// Item type thresholds for categorization
const ITEM_TYPE_THRESHOLDS = {
  tall: 0.8, // aspect ratio < 0.8 = tall
  portrait: 1.0, // 0.8 <= aspect ratio < 1.0 = portrait
  square: 1.2, // 1.0 <= aspect ratio < 1.2 = square
  // anything >= 1.2 = short (landscape)
};

// Define different rendition sizes for different item types and screen sizes
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

  if (viewportWidth < 601) {
    return 'mobile';
  }
  if (viewportWidth < 901) {
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

  // Determine screen size category
  const screenSize = getScreenSizeCategory();

  // Get appropriate size based on item type and screen size
  const sizeObj = RENDITION_SIZES[itemType] || RENDITION_SIZES.square;
  const width = sizeObj[screenSize] || sizeObj.default;

  // Create rendition URL with appropriate size
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

  // Number of items to create (will be replaced with actual images)
  const numItems = 25;

  // Define placeholder aspect ratios - we'll replace these with real ones
  // Optimized for 5-column desktop layout: 30 items = 6 items per column
  // Pattern ensures balanced distribution across all responsive breakpoints
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

  // Initial aspect ratios for placeholder types - these will be replaced with actual ratios
  const initialAspectRatios = {
    short: 1.43, // landscape orientation (width/height = 1.43)
    square: 1.0, // square (width/height = 1)
    portrait: 0.77, // portrait orientation (width/height = 0.77)
    tall: 0.59, // tall portrait (width/height = 0.59)
  };

  // Create skeleton items with appropriate initial dimensions
  for (let i = 0; i < numItems; i += 1) {
    // Get the placeholder type from our predefined sequence
    const placeholderType = placeholderTypes[i];

    // Create the skeleton item with appropriate classes
    const itemClass = `firefly-gallery-item firefly-gallery-item-${placeholderType} skeleton-item`;
    const skeletonItem = createTag('div', { class: itemClass });

    // Set the aspect ratio as a CSS custom property
    // This ensures proper rendering even before API data is received
    const aspectRatio = initialAspectRatios[placeholderType];
    skeletonItem.style.setProperty('--aspect-ratio', aspectRatio);

    // Add a height attribute proportional to the width and aspect ratio
    // This ensures the skeleton maintains its height during load and doesn't jump
    skeletonItem.dataset.heightRatio = aspectRatio;

    // Add a wrapper for the skeleton animation
    const skeletonWrapper = createTag('div', { class: 'skeleton-wrapper absolute-fill' });

    // Add loading animation elements
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

  // Create info container for user avatar, name, and prompt
  const infoContainer = createTag('div', { class: 'firefly-gallery-info-container' });

  // Add user info if available
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

  // Add prompt text
  if (promptText) {
    const promptElement = createTag(
      'div',
      { class: 'firefly-gallery-prompt' },
      promptText,
    );
    infoContainer.appendChild(promptElement);
  }

  overlay.appendChild(infoContainer);

  // Add View button
  const viewButton = createTag(
    'div',
    { class: 'firefly-gallery-view-button' },
    viewBtnLabel,
  );
  overlay.appendChild(viewButton);

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
    // Create image container
    const assetContainer = createTag('div', { class: 'firefly-gallery-image' });

    // Add asset type to container for styling
    if (assetType === 'video') {
      assetContainer.classList.add('firefly-gallery-video-item');
      skeletonItem.classList.add('video-item');
    }

    // Create and append image
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

        // Add hover event listeners for video playback
        let hoverTimeout;
        skeletonItem.addEventListener('mouseenter', () => {
          // Clear any existing timeout
          clearTimeout(hoverTimeout);
          // Start video after a short delay (prevents flickering on quick mouse movements)
          hoverTimeout = setTimeout(playVideo, 150);
        });

        skeletonItem.addEventListener('mouseleave', () => {
          // Stop video when hover ends
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

    // Add loaded class to trigger transition
    skeletonItem.classList.add('loaded');

    // Replace skeleton wrapper with actual image after animation
    // but maintain the aspect ratio structure
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
  // Extract aspect ratio from the asset
  const aspectRatio = extractAspectRatio(asset);

  // Determine item type based on aspect ratio
  const itemType = getItemTypeFromAspectRatio(aspectRatio);

  // Update the item's class to match the aspect ratio
  updateItemTypeClass(item, itemType);

  // Set the exact aspect ratio as a custom property for precise sizing
  item.style.setProperty('--aspect-ratio', aspectRatio);

  const imageUrl = getImageRendition(asset, itemType);
  const altText = asset.title || 'Firefly generated image';

  // Get localized prompt text
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

  // Get user info
  const userInfo = {};
  // eslint-disable-next-line no-underscore-dangle
  if (asset?._embedded?.owner) {
    // eslint-disable-next-line no-underscore-dangle
    const { owner } = asset._embedded;
    userInfo.name = owner.display_name
      || `${owner.first_name} ${owner.last_name}`.trim()
      || owner.user_name
      || 'Unknown Artist';

    // Get the user avatar image - find the one closest to 24px
    // eslint-disable-next-line no-underscore-dangle
    if (owner._links?.images && owner._links.images.length > 0) {
      // We want an image that's at least 24px but not too much larger
      // First sort by size to find closest match to our target 24px size
      // eslint-disable-next-line no-underscore-dangle
      const sortedImages = [...owner._links.images].sort((a, b) => {
        const aDiff = Math.abs(a.width - 24);
        const bDiff = Math.abs(b.width - 24);
        return aDiff - bDiff; // Sort by closest to 24px
      });

      userInfo.avatarUrl = sortedImages[0].href; // Use the closest to 24px
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

    // Get current locale or fallback to default
    const locale = getConfig().locale?.ietf || 'en-US';

    // Set up intersection observer to load images only when they're visible
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
        rootMargin: '200px 0px', // Start loading when within 200px of viewport
        threshold: 0.01, // Trigger when at least 1% is visible
      },
    );

    // Set up each skeleton item for observation and loading
    skeletonItems.forEach((item, index) => {
      // Store the index as data attribute for the observer callback
      item.dataset.index = index;

      // Start observing this item
      observer.observe(item);
    });

    // Also process the first few items immediately for a faster initial view
    const immediateLoadCount = Math.min(4, skeletonItems.length);
    for (let i = 0; i < immediateLoadCount; i += 1) {
      if (i < assets.length) {
        processItem(skeletonItems[i], assets[i], i, locale);
        observer.unobserve(skeletonItems[i]); // Stop observing items we've already processed
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
    // Column count now handled by CSS media queries automatically
    // We only need to update image URLs

    // Only update if we have both assets and skeleton items
    if (assets?.length > 0 && skeletonItems?.length > 0) {
      // Update image URLs based on current viewport - but only for loaded images
      // This prevents loading images that haven't been scrolled to yet
      skeletonItems.forEach((item, index) => {
        if (index >= assets.length) return;

        // Only update images that are already loaded (have been scrolled to)
        // This is determined by presence of the image element
        const imgElement = item.querySelector('img');
        if (imgElement) {
          // Get item type from class
          const itemType = getItemTypeFromClass(item);

          // Update src with new rendition size
          const newSrc = getImageRendition(assets[index], itemType);
          // Only update if URL changed (prevents unnecessary reloads)
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

  // Allow the skeleton UI to render and be scrollable
  // before waiting for image data
  // Load Firefly images
  fetchFireflyAssets(categoryId, viewBtnLabel, cgenId)
    .then((assets) => {
      if (assets && assets.length) {
        // Pass assets to the function to enable progressive loading
        loadFireflyImages(skeletonItems, assets);

        // Set up resize handler for responsive image sizes
        handleResizeForGallery(assets, skeletonItems);

        // Remove loading class after initial items are loaded
        masonryGrid.classList.remove('loading');
      } else {
        // Remove loading state if no assets found
        masonryGrid.classList.remove('loading');
      }
    })
    .catch(() => {
      masonryGrid.classList.remove('loading');
    });
}
