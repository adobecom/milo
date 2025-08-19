import { createTag, getConfig } from '../../utils/utils.js';
import { decorateBlockBg } from '../../utils/decorate.js';

const FIREFLY_API_URL =
  'https://community-hubs.adobe.io/api/v2/ff_community/assets';
const API_PARAMS =
  '?size=16&sort=updated_desc&include_pending_assets=false&category_id=text2Image&cursor=';
const API_KEY = 'alfred-community-hubs';
const RENDITION_SIZE = 350;

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

function getImageRendition(asset) {
  if (!asset) return '';

  // Check if rendition_url exists
  const renditionUrl = replaceRenditionUrl(
    asset._links.rendition.href,
    'jpg',
    'width',
    350
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
    'Firefly Gallery'
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
  // Define different item sizes for the masonry layout
  const itemSizes = [
    // { class: 'large', width: 2, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    { class: 'medium', width: 1, height: 2 },
    // { class: 'medium', width: 1, height: 2 },
    { class: 'small', width: 1, height: 1 },
    // { class: 'small', width: 1, height: 1 },
    // { class: 'medium-wide', width: 2, height: 1 },
    // { class: 'small', width: 1, height: 1 },
    // { class: 'medium', width: 1, height: 2 },
    // { class: 'small', width: 1, height: 1 },
    // { class: 'large', width: 2, height: 2 },
    // { class: 'small', width: 1, height: 1 },
    // { class: 'medium-wide', width: 2, height: 1 },
    // { class: 'small', width: 1, height: 1 },
  ];

  // Create the masonry grid container
  const masonryGrid = createTag('div', {
    class: 'firefly-gallery-masonry-grid loading',
  });
  const skeletonItems = [];

  // Create skeleton items with different sizes
  itemSizes.forEach((size) => {
    const itemClass = `firefly-gallery-item firefly-gallery-item-${size.class} skeleton-item`;
    const skeletonItem = createTag('div', { class: itemClass });

    // Add a wrapper for the skeleton animation
    const skeletonWrapper = createTag('div', { class: 'skeleton-wrapper' });

    // Add loading animation elements
    const skeletonAnimation = createTag('div', { class: 'skeleton-animation' });

    skeletonWrapper.appendChild(skeletonAnimation);
    skeletonItem.appendChild(skeletonWrapper);
    masonryGrid.appendChild(skeletonItem);

    skeletonItems.push(skeletonItem);
  });

  container.appendChild(masonryGrid);
  return { masonryGrid, skeletonItems };
}

function loadImageIntoSkeleton(skeletonItem, imageUrl, altText) {
  return new Promise((resolve) => {
    console.log('Loading image:', imageUrl);

    const img = createTag('img', {
      src: imageUrl,
      alt: altText,
      loading: 'lazy',
    });

    const imageContainer = createTag('div', {
      class: 'firefly-gallery-image',
    });
    imageContainer.appendChild(img);
    // Handle image load event
    console.log('Image loaded successfully:', imageUrl);

    // Add loaded class to trigger transition
    skeletonItem.classList.add('loaded');

    // Replace skeleton wrapper with actual image after animation
    const skeletonWrapper = skeletonItem.querySelector('.skeleton-wrapper');
    if (skeletonWrapper) {
      skeletonItem.replaceChild(imageContainer, skeletonWrapper);
    } else {
      // Fallback if wrapper not found
      skeletonItem.innerHTML = '';
      skeletonItem.appendChild(imageContainer);
    }

    resolve();
  });
}

async function loadFireflyImages(skeletonItems) {
  try {
    // Fetch assets from Firefly API
    const assets = await fetchFireflyImages();

    if (!assets || !assets.length) {
      console.warn('No assets returned from Firefly API');
      return;
    }

    console.log(
      `Loading ${assets.length} Firefly images into ${skeletonItems.length} placeholders`
    );

    // Load images into skeleton items
    const loadPromises = skeletonItems.map((item, index) => {
      if (index >= assets.length) return Promise.resolve();

      const asset = assets[index];
      const imageUrl = getImageRendition(asset);
      const altText = asset.title || 'Firefly generated image';

      console.log(`Loading image ${index + 1}/${assets.length}: ${imageUrl}`);
      return loadImageIntoSkeleton(item, imageUrl, altText);
    });

    await Promise.all(loadPromises);
    console.log('All images loaded successfully');
  } catch (error) {
    console.error('Error loading Firefly images:', error);
  } finally {
    const grid = skeletonItems[0]?.parentElement;
    if (grid) grid.classList.remove('loading');
  }
}

export default async function init(el) {
  el.classList.add('firefly-gallery-block', 'con-block');

  // Check if block has background div
  const rows = el.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    if (rows[0].textContent !== '') el.classList.add('has-bg');
    decorateBlockBg(el, rows[0]);
  }

  // Clear existing content
  el.textContent = '';

  // Create gallery structure
  const { container, content } = createGalleryStructure();

  // Create and append skeleton layout
  const { skeletonItems } = createSkeletonLayout(content);

  // Replace block content with our gallery structure
  el.appendChild(container);

  // Add additional classes for styling
  el.classList.add('max-width-10-desktop');

  // Load Firefly images
  loadFireflyImages(skeletonItems);
}
