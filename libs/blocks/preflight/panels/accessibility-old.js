import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_DESC = 'Checking...';
const decorativeImages = signal([]);
const altTextImages = signal([]);
const altResult = signal({ title: 'Image alt value', description: DEF_DESC });
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
  const clickArea = e.target.nodeName === 'SPAN' ? e.target.parentElement.parentElement : e.target.parentElement;
  clickArea.classList.toggle('is-closed');
}

function dropdownOptions(props) {
  const selected = props.option.selected === true;
  return html`
      <option value="${props.option.value}" selected="${selected}">${props.option.content}</option>
  `;
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
      decorativeImages.value = [...decorativeImages.value,
        {
          src: img.getAttribute('src'),
          altCheck: img.dataset.altCheck,
          parent,
        }];
    }
    if (alt) {
      altTextImages.value = [...altTextImages.value,
        {
          src: img.getAttribute('src'),
          alt,
          parent,
        }];
    }
    img.dataset.pageLocation = parent;
  });
  result.description = 'All images listed below. Please validate each alt text has been set appropriately. Decorative images have been highlighted in yellow on the page.';
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

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class="access-columns">
    <${AccessibilityItem} title=${altResult.value.title} description=${altResult.value.description} />
    ${groups.map((group) => html`<${ImageGroups} group=${group} />`)}
  </div>`;
}
