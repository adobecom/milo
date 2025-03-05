import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const imagesWithMismatch = signal([]);
const imagesWithMatch = signal([]);
const checksPerformed = signal(false);

const groups = [
  { title: 'Images with dimension mismatch', imgArray: imagesWithMismatch },
  { title: 'Images with matching dimensions', imgArray: imagesWithMatch },
];

async function checkImageDimensions() {
  if (checksPerformed.value) return;

  const images = document.querySelectorAll('main picture img');
  if (!images) return;

  images.forEach(async (img) => {
    // Don't consider hidden images, icons, or SVGs
    if (!img.checkVisibility()
      || img.closest('.icon-area')
      || img.src.endsWith('.svg')) return;
    // Force load images
    if (!img.complete) {
      img.setAttribute('loading', 'eager');
      await new Promise((resolve) => {
        img.addEventListener('load', resolve);
      });
    }

    const {
      naturalWidth,
      naturalHeight,
      offsetWidth: displayWidth,
      offsetHeight: displayHeight,
    } = img;

    const factor = Math.round((naturalWidth / displayWidth) * 100) / 100;
    const hasMismatch = factor < 2; // TODO: Lower factor for full width images

    const imageData = {
      src: img.getAttribute('src'),
      naturalDimensions: `${naturalWidth}x${naturalHeight}`,
      displayDimensions: `${displayWidth}x${displayHeight}`,
      factor,
    };

    if (hasMismatch) {
      imagesWithMismatch.value = [...imagesWithMismatch.value, imageData];
      img.closest('picture').classList.add('has-mismatch');
    } else {
      imagesWithMatch.value = [...imagesWithMatch.value, imageData];
      img.closest('picture').classList.add('no-mismatch');
    }
  });

  checksPerformed.value = true;
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

    ${imgArray.value.length > 0 && html`
    <div class='assets-image-grid'>
      ${imgArray.value.map((img) => html`
      <div class='assets-image-grid-item'>
        <img src='${img.src}' />
        <div class='assets-image-grid-item-text'>
          <span>Factor: ${img.factor}</span>
          <span>Natural size: ${img.naturalDimensions}</span>
          <span>Display size: ${img.displayDimensions}</span>
        </div>
      </div>`)}
    </div>`}

    ${!imgArray.value.length && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>No images found</div>
      </div>
    `}
  `;
}

export default function Assets() {
  useEffect(() => { checkImageDimensions(); }, []);

  return html`
  <div class='assets-columns'>
    <${AssetsItem}
      title="Image Dimensions"
      description="Please verify that image dimensions match their display size to avoid blurriness."
    />
    ${groups.map((group) => html`<${ImageGroup} group=${group} />`)}
  </div>`;
}
