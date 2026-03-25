import { createTag } from '../../../utils/utils.js';
import createCopy, { isMatching } from '../library-utils.js';
import { getMetadata } from '../../section-metadata/section-metadata.js';
import { getTable, decorateImages, handleLinks } from './blocks.js';

function createSpace() {
  const br = createTag('br');
  return createTag('p', null, br);
}

export function getTemplateSearchTags(template, titleText) {
  const templateName = titleText.textContent;

  if (template.searchtags?.text) {
    const terms = template.searchtags?.text.trim().toLowerCase();
    return `${terms} ${templateName}`;
  }
  return templateName;
}

function formatDom(aemDom, path) {
  // Decorate Links
  handleLinks(aemDom, path);

  // Decorate Images
  decorateImages(aemDom, path);

  // Decorate Blocks
  const divs = aemDom.querySelectorAll('main > div > div');
  const template = {};

  divs.forEach((div) => {
    // If there is library-metadata, extract searchTags. Remove library-metadata.
    if (div.classList.contains('library-metadata')) {
      const libraryMetadata = getMetadata(div);
      template.searchtags = libraryMetadata.searchtags;
      div.remove();
      return;
    }
    // Give table some space
    div.insertAdjacentElement('afterend', createSpace());

    const table = getTable(div, true);
    const th = table.querySelector('th');

    // Converts to a metadata block so it can be copied/pasted.
    if (th.textContent === 'template-metadata') {
      th.textContent = 'metadata';
    }

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
  template.flattedDom = flattedDom;
  return template;
}

async function formatTemplate(path) {
  const resp = await fetch(path);
  if (!resp.ok) window.lana.log('Could not fetch template path', { tags: 'sidekick-templates', errorType: 'i' });

  const html = await resp.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');
  return formatDom(dom, path);
}

export default async function loadTemplates(templates, list, query, type) {
  list.textContent = '';

  templates.forEach(async (template) => {
    const titleText = createTag('p', { class: 'item-title' }, template.name);
    const title = createTag('li', { class: 'template' }, titleText);
    const previewButton = createTag('button', { class: 'preview-group' }, 'Preview');
    const copy = createTag('button', { class: 'copy' });

    list.append(title);
    title.append(previewButton, copy);

    previewButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(template.path, '_templatepreview');
    });

    // Returns an object with flattedDom and searchtags.
    const formatted = await formatTemplate(template.path);
    if (query) {
      if (isMatching(formatted, query, type, titleText)) {
        title.classList.remove('is-hidden');
      } else {
        title.classList.add('is-hidden');
      }
    } else {
      title.classList.remove('is-hidden');
    }

    copy.addEventListener('click', (e) => {
      e.target.classList.add('copied');
      setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
      const blob = new Blob([formatted.flattedDom.outerHTML], { type: 'text/html' });
      createCopy(blob);
    });
  });
}
