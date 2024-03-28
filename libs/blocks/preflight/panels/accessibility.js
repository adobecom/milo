import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_DESC = 'Checking...';
const content = signal([]);
const altResult = signal({ title: 'Image alt value', description: DEF_DESC });

async function checkAlt() {
  if (altResult.value.checked) return;
  const images = document.querySelectorAll('header img, main img, footer img');
  const result = { ...altResult.value };
  if (!images) return;

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    let parent = '';

    if (img.closest('header')) parent = 'Gnav';
    if (img.closest('main')) parent = 'Main content';
    if (img.closest('footer')) parent = 'Footer';
    if (alt === '') img.dataset.altCheck = 'decorative';

    content.value = [...content.value,
      {
        src: img.getAttribute('src'),
        altCheck: img.dataset.altCheck,
        alt,
        parent,
      }];
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
    ${content.value.length > 0 && html`
    <div class="access-image-grid">
      ${content.value.map((img) => html`
      <div class="access-image-grid-item">
        <img src="${img.src}" />
        ${img.altCheck && html`
          <span>Marked as ${img.altCheck}</span>
        `}
        ${img.alt && html`
          <span>Alt='${img.alt}'</span>
        `}
        <span>Located in ${img.parent}</span>
      </div>`)}
    </div>
    `}
  </div>`;
}
