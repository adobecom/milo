import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';

const altResult = signal({ icon: DEF_ICON, title: 'Image alt value', description: DEF_DESC });

async function checkAlt() {
  const images = document.querySelectorAll('img');
  const result = { ...altResult.value };
  let altMissing;
  let altValueMissing;
  for (const image of images) {
    if (!image.hasAttribute('alt')) altMissing = true;
    else {
      const resp = await fetch(image.alt, { method: 'HEAD' });
      if (!resp.ok) altValueMissing = true;
    }
  }

  if (altMissing) {
    result.icon = fail;
    result.description = 'Reason: Alt attribute miing';
  } if (altValueMissing) {
    result.icon = fail;
    result.description = 'Reason: No value assigned to alt attribute';
  } else {
    result.icon = pass;
    result.description = 'Images are valid.';
  }
  altResult.value = result;
  return result.icon;
}

function AccessibilityItem({ icon, title, description }) {
  return html`
    <div class=seo-item>
      <div class="result-icon ${icon}"></div>
      <div class=seo-item-text>
        <p class=seo-item-title>${title}</p>
        <p class=seo-item-description>${description}</p>
      </div>
    </div>`;
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
      <div class=seo-column>
        <${AccessibilityItem} icon=${altResult.value.icon} title=${altResult.value.title} description=${altResult.value.description} />
      </div>`;
}
