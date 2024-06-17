import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';
import { getTable, decorateImages, handleLinks } from './blocks.js';

function createSpace() {
  const br = createTag('br');
  return createTag('p', null, br);
}

function formatDom(aemDom, path) {
  // Decorate Links
  handleLinks(aemDom, path);

  // Decorate Images
  decorateImages(aemDom, path);

  // Decorate Blocks
  const divs = aemDom.querySelectorAll('main > div > div');
  divs.forEach((div) => {
    // Give table some space
    div.insertAdjacentElement('afterend', createSpace());

    const table = getTable(div, true);
    div.parentElement.replaceChild(table, div);
  });

  // Decorate Sections
  const sections = aemDom.body.querySelectorAll('main > div');
  const formattedSections = [...sections].map((section, idx) => {
    const fragment = new DocumentFragment();
    if (idx > 0) {
      const divider = createTag('p', null, '---');
      fragment.append(divider, createSpace());
    }
    fragment.append(...section.querySelectorAll(':scope > *'));

    return fragment;
  });
  const flattedDom = createTag('div');
  flattedDom.append(...formattedSections);
  return flattedDom;
}

async function formatTemplate(path) {
  const resp = await fetch(path);
  if (!resp.ok) window.lana.log('Could not fetch template path', { tags: 'errorType=info,module=sidekick-templates' });

  const html = await resp.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');
  return formatDom(dom, path);
}

export default async function loadTemplates(templates, list) {
  templates.forEach(async (template) => {
    const titleText = createTag('p', { class: 'item-title' }, template.name);
    const title = createTag('li', { class: 'template' }, titleText);
    const previewButton = createTag('button', { class: 'preview-group' }, 'Preview');
    const copy = createTag('button', { class: 'copy' });
    const formatted = await formatTemplate(template.path);

    list.append(title);
    title.append(previewButton, copy);

    previewButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(template.path, '_templatepreview');
    });

    copy.addEventListener('click', (e) => {
      e.target.classList.add('copied');
      setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
      const blob = new Blob([formatted.outerHTML], { type: 'text/html' });
      createCopy(blob);
    });
  });
}
