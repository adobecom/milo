import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';
import { getMetadata } from '../../section-metadata/section-metadata.js';

function getAuthorName(block) {
  const blockSib = block.previousElementSibling;
  if (!blockSib) return null;
  if (['H2', 'H3'].includes(blockSib.nodeName)) {
    return blockSib.textContent;
  }
  return null;
}

function getBlockName(block) {
  const classes = block.className.split(' ');
  const name = classes.shift();
  return classes.length > 0 ? `${name} (${classes.join(', ')})` : name;
}

function getTable(block) {
  const name = getBlockName(block);
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.append(createTag('th', { colspan: maxCols }, name));
  table.append(headerRow);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((col) => {
      const td = document.createElement('td');
      if (row.children.length < maxCols) {
        td.setAttribute('colspan', maxCols);
      }
      td.innerHTML = col.innerHTML;
      tr.append(td);
    });
    table.append(tr);
  });
  return table.outerHTML;
}

function decorateImages(element, path) {
  if (!element || !path) return;
  const url = new URL(path);
  element.querySelectorAll('img').forEach((img) => {
    const srcSplit = img.src.split('/');
    const mediaPath = srcSplit.pop();
    img.src = `${url.origin}/${mediaPath}`;
    const { width, height } = img;
    const ratio = width > 200 ? 200 / width : 1;
    img.width = width * ratio;
    img.height = height * ratio;
  });
}

export function getHtml(container, path) {
  if (!container || !path) return '';
  return container.elements.reduce((acc, element) => {
    decorateImages(element, path);
    const isBlock = element.nodeName === 'DIV' && element.className;
    const content = isBlock ? getTable(element) : element.outerHTML;
    return `${acc}${content}`;
  }, '');
}

export function getSearchTags(container) {
  if (!container || !container.elements) return '';
  const firstBlock = container.elements[0];
  if (container['library-metadata']) {
    const libraryMetadata = getMetadata(container['library-metadata']);
    return libraryMetadata?.searchtags?.text
      ? `${libraryMetadata?.searchtags?.text} ${getBlockName(firstBlock)}`
      : getBlockName(firstBlock);
  }
  return getBlockName(firstBlock);
}

export function isMatching(container, query) {
  const tagsString = getSearchTags(container);
  if (!query || !tagsString) return false;
  const searchTokens = query.split(' ');
  return searchTokens.every((token) => tagsString.toLowerCase().includes(token.toLowerCase()));
}

export function getContainers(doc) {
  /* A page describing blocks is assumed to have the following representation
  (e.g. the page at /docs/library/blocks/carousel.plain.html):
  <body>
    <div>
      <p>Single block container</p>
      <h2>...</h2>
      <div class="block1">
      <div class="block2">
      <div class="library-metadata">
    </div>
    <div>
      <h2>...</h2>
      <p>Multiple block container</p>
      <div class="library-container-start"></div>
      <p>...</p>
      <div class="block3"></div>
    </div>
    ...
    <div>
      <h2>...</h2>
      <p>...</p>
      <div class="block4"></div>
      <div class="library-container-end"></div>
      <div class="library-metadata">
      ...
    </div>
    ...
  </body>

  The page html is parsed into sections (div children of body) and
  sub-sections (children of section).
  Parsing the above html results in the following container array:
  [{
      elements: [<div class="block1">],
    }, {
      elements: [<div class="block2">],
      library-metadata: <div class="library-metadata">
    }, {
      elements: [<p>, <div class="block3">, <p>---</p>, ...,<h2>, <p>, <div class="block4">],
      library-metadata: <div class="library-metadata">
    },
    ...
  ]
   */
  if (!doc || !doc.body) return [];
  const sections = doc.body.children;
  if (sections.length === 0) return [];
  const containers = [];
  const sectionBreak = doc.createElement('p');
  sectionBreak.innerHTML = '---';
  let container = { elements: [] };
  let withinContainer = false;
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const subSections = section.children;
    // eslint-disable-next-line no-continue
    if (subSections.length === 0) continue;
    for (let j = 0; j < subSections.length; j += 1) {
      const subSection = subSections[j];
      if (subSection.className === 'library-container-start') {
        withinContainer = true;
      } else if (subSection.className === 'library-container-end') {
        const nextSubSection = subSections[j + 1];
        if (nextSubSection && nextSubSection.className === 'library-metadata') {
          container['library-metadata'] = nextSubSection;
          j += 1;
        }
        containers.push(container);
        container = { elements: [] };
        withinContainer = false;
      } else if (withinContainer) {
        container.elements.push(subSection);
      } else if (subSection.nodeName === 'DIV' && subSection.className) {
        // single block container
        container.elements.push(subSection);
        const nextSubSection = subSections[j + 1];
        if (nextSubSection && nextSubSection.className === 'library-metadata') {
          container['library-metadata'] = nextSubSection;
          j += 1;
        }
        containers.push(container);
        container = { elements: [] };
      }
    }
    // when the container has multiple elements: add a section break after each section
    if (withinContainer) {
      container.elements.push(sectionBreak);
    }
  }
  return containers;
}

export default async function loadBlocks(blocks, list, query) {
  list.textContent = '';
  blocks.forEach(async (block) => {
    const titleText = createTag('p', { class: 'item-title' }, block.name);
    const title = createTag('li', { class: 'block-group' }, titleText);
    if (query) {
      title.classList.add('is-hidden');
    }
    const previewButton = createTag('button', { class: 'preview-group' }, 'Preview');
    title.append(previewButton);
    list.append(title);

    const blockList = createTag('ul', { class: 'block-group-list' });
    list.append(blockList);

    title.addEventListener('click', () => {
      title.classList.toggle('is-open');
    });

    previewButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(block.path, '_blockpreview');
    });

    const resp = await fetch(`${block.path}.plain.html`);
    if (!resp.ok) return;

    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const containers = getContainers(doc);
    let matchingContainerFound = false;

    containers.forEach((container) => {
      const item = document.createElement('li');
      const name = document.createElement('p');
      name.textContent = getAuthorName(container.elements[0])
        || getBlockName(container.elements[0]);
      const copy = document.createElement('button');
      copy.addEventListener('click', (e) => {
        const containerHtml = getHtml(container, block.path);
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const blob = new Blob([containerHtml], { type: 'text/html' });
        createCopy(blob);
      });
      item.append(name, copy);

      if (query) {
        if (isMatching(container, query)) {
          matchingContainerFound = true;
        } else {
          item.classList.add('is-hidden');
        }
      }

      blockList.append(item);
    });
    if (query && matchingContainerFound) {
      title.classList.remove('is-hidden');
      title.classList.add('is-open');
    }
  });
}
