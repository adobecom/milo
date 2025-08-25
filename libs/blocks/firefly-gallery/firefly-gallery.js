import { createTag, getConfig } from '../../utils/utils.js';

const FIREFLY_API_URL =
  'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS =
  '?size=32&sort=updated_desc&include_pending_assets=false&category_id=text2Image&cursor=';
const API_KEY = 'alfred-community-hubs';
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

async function fetchFireflyImages() {
  try {
    console.log('Fetching Firefly images...');
    const response = await fetch(`${FIREFLY_API_URL}${API_PARAMS}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Firefly API response:', data);
    return data._embedded.assets || [];
  } catch (error) {
    console.error('Error fetching Firefly images:', error);
    return [];
  }
}
const replaceRenditionUrl = (url, format, dimension, size) =>
  url
    .replace(/{format}/g, format)
    .replace(/{dimension}/g, dimension)
    .replace(/{size}/g, size);

function getImageRendition(asset, itemType = 'square') {
  if (!asset) return '';

  // Determine screen size category
  let screenSize = 'default';
  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 600) {
    screenSize = 'mobile';
  } else if (viewportWidth <= 900) {
    screenSize = 'tablet';
  } else {
    screenSize = 'desktop';
  }

  // Get appropriate size based on item type and screen size
  const sizeObj = RENDITION_SIZES[itemType] || RENDITION_SIZES.square;
  const width = sizeObj[screenSize] || sizeObj.default;

  // Extract actual aspect ratio from the asset
  let aspectRatio = 1; // Default to square

  if (
    asset._links?.rendition?.max_width &&
    asset._links?.rendition?.max_height
  ) {
    aspectRatio =
      asset._links.rendition.max_width / asset._links.rendition.max_height;
  } else if (asset.custom?.input?.['firefly#inputModel']) {
    try {
      const inputModel = JSON.parse(asset.custom.input['firefly#inputModel']);
      if (inputModel.aspectRatio) {
        aspectRatio = parseFloat(inputModel.aspectRatio);
      }
    } catch (e) {
      console.warn('Could not parse aspect ratio from inputModel', e);
    }
  }

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
  const galleryHeader = createTag('div', { class: 'firefly-gallery-header' });
  const galleryTitle = createTag(
    'h2',
    { class: 'firefly-gallery-title heading-xl' },
    'Get inspired by the community'
  );
  const galleryContent = createTag('div', { class: 'firefly-gallery-content' });

  galleryHeader.appendChild(galleryTitle);
  galleryContainer.appendChild(galleryHeader);
  galleryContainer.appendChild(galleryContent);

  return {
    container: galleryContainer,
    content: galleryContent,
  };
}

function createSkeletonLayout(container) {
  // Create the masonry grid container
  const masonryGrid = createTag('div', {
    class: 'firefly-gallery-masonry-grid loading',
  });
  const skeletonItems = [];

  // Number of items to create (will be replaced with actual images)
  const numItems = 16;

  // Define placeholder aspect ratios - we'll replace these with real ones
  // Varied aspect ratios for visual interest during loading
  // We create a balanced distribution of item types for a pleasing initial layout
  const placeholderTypes = [
    // First 4 items - one of each type for visual balance
    'short',
    'square',
    'portrait',
    'tall',
    // Next 4 items - different order
    'portrait',
    'short',
    'tall',
    'square',
    // Next 4 items - another pattern
    'square',
    'tall',
    'short',
    'portrait',
    // Last 4 items - final pattern
    'tall',
    'portrait',
    'square',
    'short',
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

  container.appendChild(masonryGrid);
  return { masonryGrid, skeletonItems };
}

function loadImageIntoSkeleton(
  skeletonItem,
  imageUrl,
  altText,
  promptText,
  userInfo = {}
) {
  return new Promise((resolve) => {
    console.log('Loading image:', imageUrl);

    const img = createTag('img', {
      src: imageUrl,
      alt: altText,
      loading: 'lazy',
      class: 'firefly-gallery-img',
    });

    const imageContainer = createTag('div', {
      class: 'firefly-gallery-image',
    });
    imageContainer.appendChild(img);

    // Add prompt overlay
    if (promptText) {
      const overlay = createTag('div', {
        class: 'firefly-gallery-overlay',
      });

      // Create info container for user avatar, name, and prompt
      const infoContainer = createTag('div', {
        class: 'firefly-gallery-info-container',
      });

      // Add user info container at the top left
      if (userInfo.name || userInfo.avatarUrl) {
        const userInfoContainer = createTag('div', {
          class: 'firefly-gallery-user-info',
        });

        // Add user avatar if available
        if (userInfo.avatarUrl) {
          const avatar = createTag('img', {
            src: userInfo.avatarUrl,
            alt: `${userInfo.name || 'Artist'}'s avatar`,
            class: 'firefly-gallery-user-avatar',
          });
          userInfoContainer.appendChild(avatar);
        }

        // Add username if available
        if (userInfo.name) {
          const username = createTag(
            'span',
            {
              class: 'firefly-gallery-username',
            },
            userInfo.name
          );
          userInfoContainer.appendChild(username);
        }

        infoContainer.appendChild(userInfoContainer);
      }

      // Add prompt right after user info
      const promptElement = createTag(
        'div',
        {
          class: 'firefly-gallery-prompt',
        },
        promptText
      );

      infoContainer.appendChild(promptElement);
      overlay.appendChild(infoContainer);
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
    console.log('Image loaded successfully:', imageUrl);
    resolve();
  });
}

function loadFireflyImages(skeletonItems) {
  try {
    // We'll now take assets as an argument since they're fetched earlier
    const assets = arguments[1] || [];

    if (!assets || !assets.length) {
      console.warn('No assets provided for loading');
      return;
    }

    console.log(
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
              processItem(item, assets[index], index, locale);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading when within 200px of viewport
        threshold: 0.01, // Trigger when at least 1% is visible
      }
    );

    // Function to process a single item when it's visible
    function processItem(item, asset, index, locale) {
      // Extract aspect ratio from the asset
      let aspectRatio = 1; // Default to square if we can't determine

      // Method 1: Extract from rendition max dimensions
      if (
        asset._links?.rendition?.max_width &&
        asset._links?.rendition?.max_height
      ) {
        const maxWidth = asset._links.rendition.max_width;
        const maxHeight = asset._links.rendition.max_height;
        aspectRatio = maxWidth / maxHeight;
      }
      // Method 2: Extract from firefly#inputModel if available
      else if (asset.custom?.input?.['firefly#inputModel']) {
        try {
          const inputModel = JSON.parse(
            asset.custom.input['firefly#inputModel']
          );
          if (inputModel.aspectRatio) {
            aspectRatio = parseFloat(inputModel.aspectRatio);
          }
        } catch (e) {
          console.warn('Could not parse aspect ratio from inputModel', e);
        }
      }

      // Determine item type based on aspect ratio
      let itemType;
      if (aspectRatio < 0.8) {
        itemType = 'tall'; // Portrait (tall)
      } else if (aspectRatio >= 0.8 && aspectRatio < 1.0) {
        itemType = 'portrait'; // Portrait (less tall)
      } else if (aspectRatio >= 1.0 && aspectRatio < 1.2) {
        itemType = 'square'; // Approximately square
      } else {
        itemType = 'short'; // Landscape
      }

      console.log(
        `Asset ${index} aspect ratio: ${aspectRatio}, assigned type: ${itemType}`
      );

      // Update the item's class to match the aspect ratio
      const existingClasses = item.className.split(' ');
      const newClasses = existingClasses
        .filter(
          (cls) =>
            !cls.match(/firefly-gallery-item-(short|square|portrait|tall)/)
        )
        .concat([`firefly-gallery-item-${itemType}`]);
      item.className = newClasses.join(' ');

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
        // Try to get prompt for current locale
        promptText =
          asset.custom.input['firefly#prompts'][locale] ||
          // Fallback to English
          asset.custom.input['firefly#prompts']['en-US'] ||
          // Fallback to any available locale
          Object.values(asset.custom.input['firefly#prompts'])[0] ||
          // Final fallback
          asset.title ||
          'Firefly generated image';
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

      console.log(`Loading image ${index + 1}/${assets.length}: ${imageUrl}`);
      loadImageIntoSkeleton(item, imageUrl, altText, promptText, userInfo);
    }

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
        processItem(skeletonItems[i], assets[i], i, locale);
        observer.unobserve(skeletonItems[i]); // Stop observing items we've already processed
      }
    }

    return observer; // Return the observer in case we need to disconnect it later
  } catch (error) {
    console.error('Error loading Firefly images:', error);
  }
}

/**
 * Handles window resize events to optimize the gallery layout
 * @param {Array} assets - The array of image assets
 * @param {Array} skeletonItems - The skeleton item elements
 */
function handleResizeForGallery(assets, skeletonItems) {
  let resizeTimer;

  window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
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
            const itemClasses = item.className.split(' ');
            const sizeClassRegex = /firefly-gallery-item-(\S+)/;
            const sizeClassMatch = itemClasses.find((cls) =>
              sizeClassRegex.test(cls)
            );
            const itemType = sizeClassMatch
              ? sizeClassMatch.match(sizeClassRegex)[1]
              : 'square';

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
  });
}

export default async function init(el) {
  el.classList.add('firefly-gallery-block', 'con-block');

  // Clear existing content
  el.textContent = '';

  // Create gallery structure
  const { container, content } = createGalleryStructure();

  // Create and append skeleton layout
  const { skeletonItems, masonryGrid } = createSkeletonLayout(content);

  // Replace block content with our gallery structure
  el.appendChild(container);

  // Add additional classes for styling
  el.classList.add('max-width-10-desktop');

  // Allow the skeleton UI to render and be scrollable
  // before waiting for image data
  setTimeout(() => {
    // Load Firefly images
    fetchFireflyImages()
      .then((assets) => {
        if (assets && assets.length) {
          // Pass assets to the function to enable progressive loading
          const observer = loadFireflyImages(skeletonItems, assets);

          // Set up resize handler for responsive image sizes
          handleResizeForGallery(assets, skeletonItems);

          // Remove loading class after initial items are loaded (5 second timeout)
          setTimeout(() => {
            masonryGrid.classList.remove('loading');
          }, 5000);
        } else {
          // Remove loading state if no assets found
          masonryGrid.classList.remove('loading');
        }
      })
      .catch((error) => {
        console.error('Error fetching Firefly images:', error);
        masonryGrid.classList.remove('loading');
      });
  }, 0);
}
