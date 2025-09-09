import { createTag, getConfig } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';
const DEBUG = false;

// API configuration
const FIREFLY_API_URL =
  'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS =
  '?size=32&sort=updated_desc&include_pending_assets=false&cursor=';
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
  short: {
    default: 350,
    desktop: 350,
    tablet: 300,
    mobile: 250,
  },
  square: {
    default: 400,
    desktop: 400,
    tablet: 350,
    mobile: 280,
  },
  portrait: {
    default: 450,
    desktop: 450,
    tablet: 400,
    mobile: 300,
  },
  tall: {
    default: 500,
    desktop: 500,
    tablet: 450,
    mobile: 350,
  },
};

function debug(message, data) {
  if (!DEBUG) return;

  if (data !== undefined) {
    console.log(`[FireflyGallery] ${message}`, data);
  } else {
    console.log(`[FireflyGallery] ${message}`);
  }
}

/**
 * Logs errors with consistent formatting
 * @param {string} message - Error message
 * @param {Error} error - Error object
 */
function logError(message, error) {
  console.error(`[FireflyGallery Error] ${message}`, error);
}

/**
 * Safely attempts to parse JSON with error handling
 * @param {string} jsonString - The JSON string to parse
 * @param {*} defaultValue - Default value to return if parsing fails
 * @return {*} - Parsed object or default value
 */
function safeJsonParse(jsonString, defaultValue = {}) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logError('Failed to parse JSON', e);
    return defaultValue;
  }
}

/**
 * Gets a localized string from an object based on locale
 * @param {Object} localizations - Object with locale keys
 * @param {string} currentLocale - Current locale code
 * @param {string} defaultValue - Default value if no match found
 * @return {string} - Localized string or default
 */
function getLocalizedValue(localizations, currentLocale, defaultValue = '') {
  if (!localizations) return defaultValue;

  // Try exact match
  if (localizations[currentLocale]) {
    return localizations[currentLocale];
  }

  // Try language match (e.g., 'en-US' -> 'en')
  const language = currentLocale.split('-')[0];
  const languageMatch = Object.keys(localizations).find((key) =>
    key.startsWith(language)
  );
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

/**
 * Gets screen size category based on viewport width
 * Using exact breakpoints to match CSS media queries
 * @return {string} - 'mobile', 'tablet', or 'desktop'
 */
function getScreenSizeCategory() {
  const viewportWidth = window.innerWidth;

  if (viewportWidth < 601) {
    return 'mobile';
  } else if (viewportWidth < 901) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Extracts the aspect ratio from a Firefly asset
 * @param {Object} asset - The Firefly asset object
 * @return {number} - The aspect ratio (width/height), defaults to 1 if not found
 */
function extractAspectRatio(asset) {
  let aspectRatio = 1; // Default to square

  // Method 1: Extract from rendition max dimensions
  if (
    asset._links?.rendition?.max_width &&
    asset._links?.rendition?.max_height
  ) {
    aspectRatio =
      asset._links.rendition.max_width / asset._links.rendition.max_height;
  }
  // Method 2: Extract from firefly#inputModel if available
  else if (asset.custom?.input?.['firefly#inputModel']) {
    try {
      const inputModel = safeJsonParse(
        asset.custom.input['firefly#inputModel']
      );
      if (inputModel.aspectRatio) {
        aspectRatio = parseFloat(inputModel.aspectRatio);
      }
    } catch (e) {
      logError('Could not parse aspect ratio from inputModel', e);
    }
  }

  return aspectRatio;
}

function constructVideoUrl(assetId) {
  return `https://cdn.cp.adobe.io/content/2/dcx/${assetId}/content/manifest/version/0/component/path/output/resource`;
}

/**
 * Determines the item type based on aspect ratio
 * @param {number} aspectRatio - The aspect ratio (width/height)
 * @return {string} - Item type: 'tall', 'portrait', 'square', or 'short'
 */
function getItemTypeFromAspectRatio(aspectRatio) {
  if (aspectRatio < ITEM_TYPE_THRESHOLDS.tall) {
    return 'tall'; // Portrait (very tall)
  } else if (aspectRatio < ITEM_TYPE_THRESHOLDS.portrait) {
    return 'portrait'; // Portrait (moderately tall)
  } else if (aspectRatio < ITEM_TYPE_THRESHOLDS.square) {
    return 'square'; // Approximately square
  } else {
    return 'short'; // Landscape
  }
}

/**
 * Updates item class based on determined item type
 * @param {HTMLElement} item - The item element to update
 * @param {string} itemType - The determined item type
 */
function updateItemTypeClass(item, itemType) {
  const existingClasses = item.className.split(' ');
  const newClasses = existingClasses
    .filter(
      (cls) => !cls.match(/firefly-gallery-item-(short|square|portrait|tall)/)
    )
    .concat([`firefly-gallery-item-${itemType}`]);
  item.className = newClasses.join(' ');
}

async function fetchFireflyAssets(categoryId) {
  try {
    debug('Fetching Firefly assets...');
    const response = await fetch(
      `${FIREFLY_API_URL}${API_PARAMS}&category_id=${categoryId}`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    debug('Firefly API response:', data);
    const assets = data._embedded.assets || [];
    assets.forEach((asset) => {
      asset.assetType = categoryId === 'VideoGeneration' ? 'video' : 'image';
    });
    return assets;
  } catch (error) {
    logError('Error fetching Firefly images:', error);
    return [];
  }
}
const replaceRenditionUrl = (url, format, dimension, size) =>
  url
    .replace(/{format}/g, format)
    .replace(/{dimension}/g, dimension)
    .replace(/{size}/g, size);

/**
 * Creates Firefly gallery URL for opening asset in new tab
 * @param {string} urn - Asset URN identifier
 * @return {string} - Complete Firefly URL
 */
function createFireflyURL(urn, assetType = 'image') {
  const assetTypeParam =
    assetType === 'video' ? 'VideoGeneration' : 'ImageGeneration';
  return `https://firefly.adobe.com/open?assetOrigin=community&assetType=${assetTypeParam}&id=${urn}`;
}

function getImageRendition(asset, itemType = 'square') {
  if (!asset) return '';

  // Determine screen size category
  const screenSize = getScreenSizeCategory();

  // Get appropriate size based on item type and screen size
  const sizeObj = RENDITION_SIZES[itemType] || RENDITION_SIZES.square;
  const width = sizeObj[screenSize] || sizeObj.default;

  // Extract actual aspect ratio from the asset
  const aspectRatio = extractAspectRatio(asset);

  // Calculate height based on width and aspect ratio to maintain proper proportions
  const height = Math.round(width / aspectRatio);

  // Create rendition URL with appropriate size
  const renditionUrl = replaceRenditionUrl(
    asset._links.rendition.href,
    'jpg',
    'width',
    width
  );

  return renditionUrl;
}

function createGalleryStructure() {
  const galleryContainer = createTag('div', {
    class: 'firefly-gallery-container',
  });
  const galleryContent = createTag('div', { class: 'firefly-gallery-content' });
  const galleryOverlay = createTag('div', { class: 'firefly-gallery-fade' });

  galleryContent.appendChild(galleryOverlay);

  galleryContainer.appendChild(galleryContent);

  return {
    container: galleryContainer,
    content: galleryContent,
  };
}

function preventScrollOnTab(contentElement) {
  let savedScrollTop = 0;
  let isTabbing = false;

  contentElement.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      // Save position only when starting a tab sequence
      if (!isTabbing) {
        savedScrollTop = contentElement.scrollTop;
      }
      isTabbing = true;
    }
  });

  // Use only a single focusin handler to restore scroll position
  contentElement.addEventListener('focusin', () => {
    if (isTabbing) {
      // Use requestAnimationFrame for smoother visual updates
      requestAnimationFrame(() => {
        contentElement.scrollTop = savedScrollTop;
        // Reset tabbing flag after a short delay
        setTimeout(() => {
          isTabbing = false;
        }, 100);
      });
    }
  });
}

// Column count is now handled entirely by CSS media queries

function createSkeletonLayout(container) {
  // Create the masonry grid container
  const masonryGrid = createTag('div', {
    class: 'firefly-gallery-masonry-grid loading',
  });

  const skeletonItems = [];

  // Number of items to create (will be replaced with actual images)
  const numItems = 30;

  // Define placeholder aspect ratios - we'll replace these with real ones
  // Optimized for 5-column desktop layout: 30 items = 6 items per column
  // Pattern ensures balanced distribution across all responsive breakpoints
  const placeholderTypes = [
    // Column flow pattern optimized for 5 columns (6 items per column)
    // row 1
    'short',
    'square',
    'portrait',
    'tall',
    'short',
    // row 2
    'portrait',
    'short',
    'tall',
    'square',
    'portrait',
    // row 3
    'square',
    'tall',
    'short',
    'portrait',
    'tall',
    // row 4
    'tall',
    'portrait',
    'square',
    'short',
    'square',
    // row 5
    'short',
    'square',
    'portrait',
    'tall',
    'portrait',
    // row 6
    'portrait',
    'tall',
    'short',
    'square',
    'tall',
  ];

  // Initial aspect ratios for placeholder types - these will be replaced with actual ratios
  const initialAspectRatios = {
    short: 1.43, // landscape orientation (width/height = 1.43)
    square: 1.0, // square (width/height = 1)
    portrait: 0.77, // portrait orientation (width/height = 0.77)
    tall: 0.59, // tall portrait (width/height = 0.59)
  };

  // Create skeleton items with appropriate initial dimensions
  for (let i = 0; i < numItems; i++) {
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
    const skeletonWrapper = createTag('div', { class: 'skeleton-wrapper' });

    // Add loading animation elements
    const skeletonAnimation = createTag('div', { class: 'skeleton-animation' });

    skeletonWrapper.appendChild(skeletonAnimation);
    skeletonItem.appendChild(skeletonWrapper);
    masonryGrid.appendChild(skeletonItem);

    skeletonItems.push(skeletonItem);
  }
  container.insertBefore(masonryGrid, container.firstChild);
  // container.appendChild(masonryGrid);
  return { masonryGrid, skeletonItems };
}

/**
 * Creates and returns image element with proper attributes
 * @param {string} imageUrl - URL of the image to load
 * @param {string} altText - Alt text for the image
 * @return {HTMLElement} - The created image element
 */
function createImageElement(imageUrl, altText) {
  return createTag('img', {
    src: imageUrl,
    alt: altText,
    loading: 'lazy',
    class: 'firefly-gallery-img',
  });
}

/**
 * Creates clickable overlay with prompt and user info
 * @param {string} promptText - The prompt text to display
 * @param {Object} userInfo - User information (name, avatarUrl)
 * @param {string} fireflyUrl - URL to open when clicked
 * @return {HTMLElement} - The created clickable overlay element
 */
function createOverlayElement(promptText, userInfo = {}, fireflyUrl) {
  const overlay = createTag('a', {
    class: 'firefly-gallery-overlay',
    href: fireflyUrl,
    target: '_blank',
    rel: 'noopener',
    'aria-label': `Open "${promptText}" in Firefly`,
    tabindex: '0',
  });

  // Create info container for user avatar, name, and prompt
  const infoContainer = createTag('div', {
    class: 'firefly-gallery-info-container',
  });

  // Add user info if available
  if (userInfo.name || userInfo.avatarUrl) {
    const userInfoContainer = createTag('div', {
      class: 'firefly-gallery-user-info',
    });

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
        userInfo.name
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
      promptText
    );
    infoContainer.appendChild(promptElement);
  }

  overlay.appendChild(infoContainer);

  // Add View button
  const viewButton = createTag(
    'div',
    {
      class: 'firefly-gallery-view-button',
    },
    'View'
  );
  overlay.appendChild(viewButton);

  return overlay;
}

/**
 * Loads an image into a skeleton item with proper overlay and transitions
 * @param {HTMLElement} skeletonItem - The skeleton item to load the image into
 * @param {string} imageUrl - URL of the image to load
 * @param {string} altText - Alt text for the image
 * @param {string} promptText - Prompt text to show in overlay
 * @param {Object} userInfo - User information (name, avatarUrl)
 * @param {string} assetUrn - Asset URN for generating Firefly URL
 * @return {Promise} - Resolves when image is loaded
 */
function loadImageIntoSkeleton(
  skeletonItem,
  imageUrl,
  altText,
  promptText,
  userInfo = {},
  assetUrn,
  assetData = {}
) {
  return new Promise((resolve) => {
    debug('Loading image:', imageUrl);

    // Create image container
    const imageContainer = createTag('div', {
      class: 'firefly-gallery-image',
    });

    // Add asset type to container for styling
    if (assetData.assetType === 'video') {
      imageContainer.classList.add('firefly-gallery-video-item');
      skeletonItem.classList.add('video-item');
    }

    // Create and append image
    const img = createImageElement(imageUrl, altText);
    imageContainer.appendChild(img);

    // Create and append clickable overlay if prompt exists
    if (promptText) {
      const fireflyUrl = createFireflyURL(assetUrn);
      const overlayPromptText =
        assetData.assetType === 'video' ? '' : promptText;
      const overlay = createOverlayElement(
        overlayPromptText,
        userInfo,
        fireflyUrl
      );
      if (assetData.assetType === 'video') {
        overlay.classList.add('firefly-gallery-video-overlay');
      }

      // Add video element inside the overlay for video assets
      if (assetData.assetType === 'video' && assetData.id) {
        const videoUrl = constructVideoUrl(assetData.id);
        const video = createTag('video', {
          src: videoUrl,
          class: 'firefly-gallery-video',
          muted: true,
          loop: true,
          preload: 'none',
          playsinline: true,
        });

        video.addEventListener('loadeddata', () => {
          debug('Video loaded:', videoUrl);
        });

        video.addEventListener('error', (e) => {
          logError('Video loading error:', e);
        });

        overlay.appendChild(video);

        // Add hover event listeners for video playback
        let hoverTimeout;
        overlay.addEventListener('mouseenter', () => {
          // Clear any existing timeout
          clearTimeout(hoverTimeout);
          // Start video after a short delay (prevents flickering on quick mouse movements)
          hoverTimeout = setTimeout(() => {
            video.style.opacity = '1';
            video.play().catch((err) => {
              logError('Video play failed:', err);
            });
          }, 150);
        });

        overlay.addEventListener('mouseleave', () => {
          // Stop video when hover ends
          clearTimeout(hoverTimeout);
          video.pause();
          video.style.opacity = '0';
        });
      }

      imageContainer.appendChild(overlay);
    }

    // Add loaded class to trigger transition
    skeletonItem.classList.add('loaded');

    // Replace skeleton wrapper with actual image after animation
    // but maintain the aspect ratio structure
    const skeletonWrapper = skeletonItem.querySelector('.skeleton-wrapper');
    if (skeletonWrapper) {
      skeletonItem.replaceChild(imageContainer, skeletonWrapper);
    } else {
      // Fallback if wrapper not found
      skeletonItem.innerHTML = '';
      skeletonItem.appendChild(imageContainer);
    }

    // Image successfully loaded
    debug(`${assetData.assetType || 'Image'} loaded successfully:`, imageUrl);
    resolve();
  });
}

/**
 * Process a single item when it's visible
 * @param {HTMLElement} item - The item element to process
 * @param {Object} asset - The asset data
 * @param {number} index - The index of this item
 * @param {string} locale - The current locale
 */
function processItem(item, asset, index, locale, assets) {
  // Extract aspect ratio from the asset
  const aspectRatio = extractAspectRatio(asset);

  // Determine item type based on aspect ratio
  const itemType = getItemTypeFromAspectRatio(aspectRatio);

  debug(
    `Asset ${index} aspect ratio: ${aspectRatio}, assigned type: ${itemType}`
  );

  // Update the item's class to match the aspect ratio
  updateItemTypeClass(item, itemType);

  // Get the original height ratio from the skeleton item
  const originalHeightRatio = parseFloat(item.dataset.heightRatio) || 1;

  // Calculate a transition ratio that gradually moves from the placeholder to the real one
  // to minimize layout shifts
  const transitionRatio = (originalHeightRatio + aspectRatio) / 2;

  // Set the exact aspect ratio as a custom property for precise sizing
  item.style.setProperty('--aspect-ratio', aspectRatio);

  const imageUrl = getImageRendition(asset, itemType);
  const altText = asset.title || 'Firefly generated image';

  // Get localized prompt text
  let promptText = '';
  if (asset?.custom?.input?.['firefly#prompts']) {
    // Use the getLocalizedValue utility
    promptText = getLocalizedValue(
      asset.custom.input['firefly#prompts'],
      locale,
      asset.title || 'Firefly generated image'
    );
  } else {
    // Use title as fallback
    promptText = asset.title || 'Firefly generated image';
  }

  // Get user info
  const userInfo = {};
  if (asset?._embedded?.owner) {
    const owner = asset._embedded.owner;
    userInfo.name =
      owner.display_name ||
      `${owner.first_name} ${owner.last_name}`.trim() ||
      owner.user_name ||
      'Unknown Artist';

    // Get the user avatar image - find the one closest to 24px
    if (owner._links?.images && owner._links.images.length > 0) {
      // We want an image that's at least 24px but not too much larger
      // First sort by size to find closest match to our target 24px size
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
    assetType: asset.assetType || 'image',
    id: asset.id,
  };
  debug(
    `Loading ${assetData.assetType} ${index + 1}/${assets.length}: ${imageUrl}`
  );
  loadImageIntoSkeleton(
    item,
    imageUrl,
    altText,
    promptText,
    userInfo,
    asset.urn,
    assetData
  );
}

function loadFireflyImages(skeletonItems) {
  try {
    // We'll now take assets as an argument since they're fetched earlier
    const assets = arguments[1] || [];

    if (!assets || !assets.length) {
      debug('No assets provided for loading');
      return;
    }

    debug(
      `Loading ${assets.length} Firefly images into ${skeletonItems.length} placeholders`
    );

    // Get current locale or fallback to default
    const locale = getConfig().locale?.ietf || 'en-US';

    // Set up intersection observer to load images only when they're visible
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            const index = parseInt(item.dataset.index, 10);

            // Stop observing this item
            observer.unobserve(item);

            // Load the image if we have an asset for it
            if (index >= 0 && index < assets.length) {
              processItem(item, assets[index], index, locale, assets);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading when within 200px of viewport
        threshold: 0.01, // Trigger when at least 1% is visible
      }
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
    for (let i = 0; i < immediateLoadCount; i++) {
      if (i < assets.length) {
        processItem(skeletonItems[i], assets[i], i, locale, assets);
        observer.unobserve(skeletonItems[i]); // Stop observing items we've already processed
      }
    }

    return observer; // Return the observer in case we need to disconnect it later
  } catch (error) {
    logError('Error loading Firefly images:', error);
  }
}

/**
 * Extract item type from element's class names
 * @param {HTMLElement} item - The item element
 * @return {string} - The item type or 'square' as fallback
 */
function getItemTypeFromClass(item) {
  const itemClasses = item.className.split(' ');
  const sizeClassRegex = /firefly-gallery-item-(\S+)/;
  const sizeClassMatch = itemClasses.find((cls) => sizeClassRegex.test(cls));
  return sizeClassMatch ? sizeClassMatch.match(sizeClassRegex)[1] : 'square';
}

/**
 * Handles window resize events to optimize the gallery layout
 * @param {Array} assets - The array of image assets
 * @param {Array} skeletonItems - The skeleton item elements
 */
function handleResizeForGallery(assets, skeletonItems, masonryGrid) {
  const handleResize = debounce(() => {
    // Column count now handled by CSS media queries automatically
    // We only need to update image URLs

    // Only update if we have both assets and skeleton items
    if (
      assets &&
      assets.length > 0 &&
      skeletonItems &&
      skeletonItems.length > 0
    ) {
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

/**
 * Sets tabindex=-1 for overlay elements that are hidden by the firefly-gallery-fade overlay
 * to prevent keyboard focus on elements that aren't fully visible.
 *
 * @param {HTMLElement} galleryContent - The gallery content element with class 'firefly-gallery-content'
 */
function setTabindexForHiddenOverlays(galleryContent) {
  if (!galleryContent) return;

  const fadeOverlay = galleryContent.querySelector('.firefly-gallery-fade');
  if (!fadeOverlay) return;

  // Get overlay elements that can be focused (with tabindex="0")
  const overlayElements = galleryContent.querySelectorAll(
    '.firefly-gallery-overlay'
  );

  // Get fade dimensions
  const contentRect = galleryContent.getBoundingClientRect();
  const fadeHeight = parseInt(window.getComputedStyle(fadeOverlay).height, 10);
  const fadeStartsAt = contentRect.height - fadeHeight;

  // Check each overlay and set tabindex accordingly
  overlayElements.forEach((overlay) => {
    const overlayRect = overlay.getBoundingClientRect();
    const overlayTop = overlayRect.top - contentRect.top;
    const overlayBottom = overlayRect.bottom - contentRect.top;

    if (overlayTop >= fadeStartsAt) {
      overlay.setAttribute('tabindex', '-1');
    }
  });
}

export default async function init(el) {
  el.classList.add('firefly-gallery-block', 'con-block');

  // Extract category_id - should be text2Image / VideoGeneration
  const categoryId =
    el.innerText.replaceAll('\n', '').replaceAll(' ', '') || 'text2Image';

  // Clear existing content
  el.textContent = '';

  // Create gallery structure
  const { container, content } = createGalleryStructure();

  // Create and append skeleton layout
  const { skeletonItems, masonryGrid } = createSkeletonLayout(content);

  // Add this line to prevent scrolling when tabbing
  preventScrollOnTab(content);

  // Replace block content with our gallery structure
  el.appendChild(container);

  // Allow the skeleton UI to render and be scrollable
  // before waiting for image data
  // Load Firefly images
  fetchFireflyAssets(categoryId)
    .then((assets) => {
      if (assets && assets.length) {
        // Pass assets to the function to enable progressive loading
        const observer = loadFireflyImages(skeletonItems, assets);

        // Set up resize handler for responsive image sizes
        handleResizeForGallery(assets, skeletonItems, masonryGrid);

        // Remove loading class after initial items are loaded
        masonryGrid.classList.remove('loading');
        setTimeout(() => {
          const galleryContent = document.querySelector(
            '.firefly-gallery-content'
          );
          if (galleryContent) setTabindexForHiddenOverlays(galleryContent);
        }, 100);
      } else {
        // Remove loading state if no assets found
        masonryGrid.classList.remove('loading');
      }
    })
    .catch((error) => {
      logError('Error fetching Firefly images:', error);
      masonryGrid.classList.remove('loading');
    });
}
