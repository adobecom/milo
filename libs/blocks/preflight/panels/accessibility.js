import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_DESC = 'Checking...';
const decorativeImage = signal([]);
const altTextImage = signal([]);
const altResult = signal({ title: 'Image alt value', description: DEF_DESC });

function filterGrid(e) {
  const imgGrid = e.target.parentElement.parentElement;
  imgGrid.classList.remove('show-main', 'show-gnav', 'show-footer');
  imgGrid.classList.add(e.target.value);
}

function toggleGrid(e) {
  e.preventDefault();
  const clickArea = e.target.nodeName === 'SPAN' ? e.target.parentElement.parentElement : e.target.parentElement;
  clickArea.classList.toggle('is-closed');
}

async function checkAlt() {
  if (altResult.value.checked) return;
  // If images are not scoped, tracking pixel/images are picked up.
  const images = document.querySelectorAll('header img, main img, footer img');
  const result = { ...altResult.value };
  if (!images) return;

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    let parent = '';

    if (img.closest('header')) parent = 'gnav';
    if (img.closest('main')) parent = 'main-content';
    if (img.closest('footer')) parent = 'footer';
    if (alt === '') {
      img.dataset.altCheck = 'decorative';
      decorativeImage.value = [...decorativeImage.value,
        {
          src: img.getAttribute('src'),
          altCheck: img.dataset.altCheck,
          parent,
        }];
    }
    if (alt) {
      altTextImage.value = [...altTextImage.value,
        {
          src: img.getAttribute('src'),
          alt,
          parent,
        }];
    }
    img.dataset.pageLocation = parent;
  });
  result.description = 'All images listed below. Please validate each alt text has been set appropriately. Decorative images have also been highlighted on page.';
  altResult.value = { ...result, checked: true };
}

function AccessibilityItem({ title, description }) {
  return html`
    <div class="access-item">
      <div class=access-item-text>
        <p class=access-item-title>${title}</p>
        <p class=access-item-description>${description}</p>
      </div>
    </div>`;
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class="access-columns">
    <${AccessibilityItem} title=${altResult.value.title} description=${altResult.value.description} />
    <div class='grid-heading'>
      <a href='#' onClick=${(e) => toggleGrid(e)} class='grid-toggle'>
        <span class="preflight-group-expand"></span>
        Images with alt text
      </a>
    </div>
    ${altTextImage.value.length > 0 && html`
    <div class="access-image-grid">
      ${altTextImage.value.map((img) => html`
      <div class="access-image-grid-item in-${img.parent}">
        <img src="${img.src}" />
        <span>Alt='${img.alt}'</span>
        <span>Located in ${img.parent}</span>
      </div>`)}
    </div>`}
    ${!altTextImage.value.length && html`
      <div class="access-image-grid">
        <div class="access-image-grid-item full-width">No images found</div>
      </div>
    `}
    <div class='grid-heading is-closed'>
      <a href='#' onClick=${(e) => toggleGrid(e)} class='grid-toggle'>
        <span class="preflight-group-expand"></span>
        Decorative images (empty alt text)
      </a>
    </div>
    ${decorativeImage.value.length > 0 && html`
    <div class="access-image-grid">
      <div class="access-image-grid-item filter">
        Filter: 
        <select onChange=${(e) => filterGrid(e)} class="image-filter">
          <option value="" selected="selected">Show all</option>
          <option value="show-main">Show main</option>
          <option value="show-gnav">Show gnav</option>
          <option value="show-footer">Show footer</option>
        </select>
      </div>
      ${decorativeImage.value.map((img) => html`
      <div class="access-image-grid-item in-${img.parent}">
        <img src="${img.src}" />
        <span>Marked as ${img.altCheck}</span>
        <span>Located in ${img.parent}</span>
      </div>`)}
    </div>`}
    ${!decorativeImage.value.length && html`
      <div class="access-image-grid">
        <div class="access-image-grid-item full-width">No images found</div>
      </div>
    `}
  </div>`;
}
