import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import preflightApi from '../checks/preflightApi.js';
import { STATUS } from '../checks/constants.js';

const { isViewportTooSmall, runChecks } = preflightApi.assets;

// Define signals for check results and viewport status
const imageDimensionsResult = signal({
  title: 'Image Dimensions',
  description: 'Checking...',
});
const imagesWithMismatch = signal([]);
const imagesWithMatch = signal([]);
const viewportTooSmall = signal(isViewportTooSmall());

/**
 * Runs asset checks and updates signals with the results.
 */
async function getResults() {
  const checks = runChecks(window.location.pathname, document);

  const result = await Promise.resolve(checks[0]).catch((error) => ({
    title: 'Assets - Image Dimensions',
    status: STATUS.FAIL,
    description: `Error: ${error.message}`,
  }));

  imageDimensionsResult.value = {
    title: result.title.replace('Assets - ', ''),
    description: result.description,
  };

  if (result.details) {
    imagesWithMismatch.value = result.details.imagesWithMismatch || [];
    imagesWithMatch.value = result.details.imagesWithMatch || [];
  }
}

/**
 * Component to display a single asset check result.
 */
function AssetsItem({ title, description }) {
  return html`
    <div class="assets-item">
      <div class="assets-item-text">
        <p class="assets-item-title">${title}</p>
        <p class="assets-item-description">${description}</p>
      </div>
    </div>`;
}

/**
 * Component to display a group of images.
 */
function ImageGroup({ group }) {
  const { title, imgArray } = group;
  return html`
    <div class="grid-heading">
      <div class="grid-toggle">${title}</div>
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

/**
 * Main Panel Component
 */
export default function Assets() {
  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isSmall = isViewportTooSmall();
        if (viewportTooSmall.value !== isSmall) {
          viewportTooSmall.value = isSmall;
          if (!isSmall) getResults();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    if (!viewportTooSmall.value) getResults();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const groups = [
    { title: 'Images with dimension mismatch', imgArray: imagesWithMismatch },
    { title: 'Images with matching dimensions', imgArray: imagesWithMatch },
  ];

  return html`
    <div class="assets-columns">
      <${AssetsItem} ...${imageDimensionsResult.value} />
      ${groups.map((group) => html`<${ImageGroup} group=${group} />`)}
    </div>
  `;
}
