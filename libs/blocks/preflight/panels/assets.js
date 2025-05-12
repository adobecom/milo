import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { createTag } from '../../../utils/utils.js';

function isViewportTooSmall() {
  return !window.matchMedia('(min-width: 1200px)').matches;
}

const maxFullWidth = 1920;
const imagesWithMismatch = signal([]);
const imagesWithMatch = signal([]);
const checksPerformed = signal(false);
const viewportTooSmall = signal(isViewportTooSmall());

const groups = [
  { title: 'Images with dimension mismatch', imgArray: imagesWithMismatch },
  { title: 'Images with matching dimensions', imgArray: imagesWithMatch },
];

async function checkImageDimensions() {
  if (checksPerformed.value || viewportTooSmall.value) return;
  checksPerformed.value = true;

  const allImages = [...document.querySelectorAll('main picture img')];
  if (!allImages.length) return;

  // Force load all images
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

  // Filter the loaded images to ensure they are visible, not an icon, and not an SVG
  const images = allImages.filter((img) => img.checkVisibility()
    && !img.closest('.icon-area')
    && !img.src.includes('.svg'));

  if (!images.length) return;

  const viewportWidth = document.documentElement.clientWidth;

  // Apply overflow class to body to prevent scrolling issues during image analysis
  document.body.classList.add('preflight-assets-analysis');

  for (const img of images) {
    // Get the original dimensions of the uploaded image; fallback to the natural dimensions
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
    // Separate images depending on mismatch and define the message to display
    let assetMessage;

    if (hasMismatch) {
      imagesWithMismatch.value = [...imagesWithMismatch.value, imageData];

      assetMessage = createTag(
        'div',
        { class: 'picture-meta-asset has-mismatch' },
        `Size: too small, use > ${imageData.recommendedDimensions}`,
      );
    } else {
      imagesWithMatch.value = [...imagesWithMatch.value, imageData];

      assetMessage = createTag(
        'div',
        { class: 'picture-meta-asset no-mismatch' },
        'Size: correct',
      );
    }

    pictureMetaElem.append(assetMessage);
  }

  // Remove overflow class from body after analysis is complete
  document.body.classList.remove('preflight-assets-analysis');
}

function AssetsItem({ title, description }) {
  return html`
    <div class='assets-item'>
      <div class='assets-item-text'>
        <p class='assets-item-title'>${title}</p>
        <p class='assets-item-description'>${description}</p>
      </div>
    </div>`;
}

function ImageGroup({ group }) {
  const { imgArray } = group;
  return html`
    <div class='grid-heading'>
      <div class='grid-toggle'>
        ${group.title}
      </div>
    </div>

    ${viewportTooSmall.value && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>Please resize your browser to at least 1200px width to run image checks</div>
      </div>
    `}

    ${!viewportTooSmall.value && imgArray.value.length > 0 && html`
    <div class='assets-image-grid'>
      ${imgArray.value.map((img) => html`
      <div class='assets-image-grid-item'>
        <img src='${img.src}' />
        <div class='assets-image-grid-item-text'>
          <span>Factor: ${img.roundedFactor}</span>
          <span>Upload size: ${img.naturalDimensions}</span>
          <span>Display size: ${img.displayDimensions}</span>
          ${img.hasMismatch && html`<span>Recommended size: ${img.recommendedDimensions}</span>`}
        </div>
      </div>`)}
    </div>`}

    ${!viewportTooSmall.value && !imgArray.value.length && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>No images found</div>
      </div>
    `}
  `;
}

export default function Assets() {
  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isSmall = isViewportTooSmall();
        if (viewportTooSmall.value !== isSmall) {
          viewportTooSmall.value = isSmall;
          if (!isSmall) checkImageDimensions();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    checkImageDimensions();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return html`
  <div class='assets-columns'>
    <${AssetsItem}
      title="Image Dimensions"
      description="Please verify that image dimensions match their display size to avoid blurriness."
    />
    ${groups.map((group) => html`<${ImageGroup} group=${group} />`)}
  </div>`;
}
