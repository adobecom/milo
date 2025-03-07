import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { createTag } from '../../../utils/utils.js';

const imagesWithMismatch = signal([]);
const imagesWithMatch = signal([]);
const checksPerformed = signal(false);
const viewportTooSmall = signal(!window.matchMedia('(min-width: 1200px)').matches);

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
        });
      }
      return Promise.resolve();
    }),
  );

  // Filter the loaded images to ensure they are visible, not an icon, and not an SVG
  const images = allImages.filter((img) => img.checkVisibility()
    && !img.closest('.icon-area')
    && !img.src.endsWith('.svg'));

  if (!images.length) return;

  for (const img of images) {
    const naturalWidth = img.getAttribute('width') ? parseInt(img.getAttribute('width'), 10) : img.naturalWidth;
    const naturalHeight = img.getAttribute('height') ? parseInt(img.getAttribute('height'), 10) : img.naturalHeight;
    const displayWidth = img.offsetWidth;
    const displayHeight = img.offsetHeight;

    // TODO: Lower factor for full width images
    const idealFactor = 2;
    // Calculate and round up the actual factor to nearest .05
    const actualFactor = Math.round((naturalWidth / displayWidth) * 100) / 100;
    const roundedFactor = Math.ceil(actualFactor * 20) / 20;
    const hasMismatch = roundedFactor < idealFactor;

    const imageData = {
      src: img.getAttribute('src'),
      naturalDimensions: `${naturalWidth}x${naturalHeight}`,
      displayDimensions: `${displayWidth}x${displayHeight}`,
      recommendedDimensions: `${Math.ceil(displayWidth * idealFactor)}x${Math.ceil(displayHeight * idealFactor)}`,
      roundedFactor,
    };

    let pictureMetaElem = img.closest('picture').querySelector('.picture-meta');
    if (!pictureMetaElem) {
      pictureMetaElem = createTag('div', { class: 'picture-meta' });
      img.closest('picture').insertBefore(pictureMetaElem, img.nextSibling);
    }

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
          <span>Natural size: ${img.naturalDimensions}</span>
          <span>Display size: ${img.displayDimensions}</span>
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
        const mediaQuery = window.matchMedia('(min-width: 1200px)');
        const isSmall = !mediaQuery.matches;
        if (viewportTooSmall.value !== isSmall) {
          viewportTooSmall.value = isSmall;
          if (!isSmall) {
            checkImageDimensions();
          }
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
