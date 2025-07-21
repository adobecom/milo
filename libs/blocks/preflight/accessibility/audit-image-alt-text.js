import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { addAccessibilityMetadata } from '../visual-metadata.js';

const DEF_DESC = 'Checking...';
const decorativeImages = signal([]);
const altTextImages = signal([]);
const altResult = signal({ title: 'Audit Image Alt value', description: DEF_DESC });
const groups = [
  { title: 'Images with alt text', imgArray: altTextImages },
  { title: 'Decorative images (empty alt text)', imgArray: decorativeImages, closed: true },
];
const filterOptions = [
  { value: '', content: 'All' },
  { value: 'show-main', content: 'Main content', selected: true },
  { value: 'show-gnav', content: 'Gnav' },
  { value: 'show-footer', content: 'Footer' },
];

function filterGrid(e) {
  const imgGrid = e.target.parentElement.parentElement;
  filterOptions.forEach((option) => {
    if (imgGrid.classList.contains(option.value)) {
      imgGrid.classList.remove(option.value);
    }
  });
  if (e.target.value) imgGrid.classList.add(e.target.value);
}

function toggleGrid(e) {
  e.preventDefault();
  const current = e.target.closest('.grid-heading');
  current.classList.toggle('is-closed');
}

function dropdownOptions({ option }) {
  return html`<option value=${option.value} selected=${option.selected}>${option.content}</option>`;
}

async function checkAlt() {
  if (altResult.value.checked) return;
  // If images are not scoped, tracking pixel/images are picked up.
  const images = document.querySelectorAll(':is(header, main, footer) img:not(.accessibility-control)');
  const result = { ...altResult.value };
  if (!images) return;

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    let parent = '';

    if (img.closest('header')) parent = 'gnav';
    if (img.closest('main')) parent = 'main-content';
    if (img.closest('footer')) parent = 'footer';

    if (alt === '') {
      img.dataset.altCheck = 'Decorative';
      addAccessibilityMetadata(img, img.dataset.altCheck, 'is-decorative');

      decorativeImages.value = [...decorativeImages.value,
        {
          src: img.getAttribute('src'),
          altCheck: img.dataset.altCheck,
          parent,
        }];
    }
    if (alt) {
      addAccessibilityMetadata(img, `Alt: ${alt}`, 'has-alt');

      altTextImages.value = [...altTextImages.value,
        {
          src: img.getAttribute('src'),
          alt,
          parent,
        }];
    }

    img.dataset.pageLocation = parent;
  });
  result.description = 'All images from the page are listed below. Please ensure each image has appropriate alt text. Decorative images are highlighted in yellow on the page';
  altResult.value = { ...result, checked: true };
}

function AccessibilityItem({ title, description }) {
  return html`
    <div class="preflight-content-group">
      <div class="preflight-item preflight-accessibility-item ">
        <div class="result-icon alt-text"></div>
        <div class="preflight-item-text">
          <p class="preflight-item-title">${title}</p>
          <p class="preflight-item-description">${description}</p>
        </div>
      </div>
    </div>`;
}

function ImageGroups({ group }) {
  const setFilterView = filterOptions.find((option) => option.selected === true);
  const { imgArray, closed } = group;
  return html`
    <div class='grid-heading ${closed === true ? 'is-closed' : ''}'>
      <a href='#' onClick=${(e) => toggleGrid(e)} class='grid-toggle'>
        <span class="preflight-group-expand"></span>
        ${group.title}
      </a>
    </div>

    ${imgArray.value.length > 0 && html`
    <div class="access-image-grid ${setFilterView.value}">
      <div class="access-image-grid-item filter">
        Filter images by:
        <select onChange=${(e) => filterGrid(e)} class="image-filter">
        ${filterOptions.map((option) => html`<${dropdownOptions} option=${option} />`)}
        </select>
      </div>

      ${imgArray.value.map((img) => html`
      <div class="access-image-grid-item in-${img.parent}">
        <img src="${img.src}" />
        <span>${!img.altCheck ? `Alt=${img.alt}` : `Marked as ${img.altCheck}`}</span>
        <span>Located in ${img.parent}</span>
      </div>`)}
    </div>`}

    ${!imgArray.value.length && html`
      <div class="access-image-grid">
        <div class="access-image-grid-item full-width">No images found</div>
      </div>
    `}
  `;
}

export default function AuditImageAltText() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class="access-columns">
    <${AccessibilityItem} title=${altResult.value.title} description=${altResult.value.description} />
    ${groups.map((group) => html`<${ImageGroups} group=${group} />`)}
  </div>`;
}
