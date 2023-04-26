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

function getTable(block, name, path) {
  const url = new URL(path);
  block.querySelectorAll('img').forEach((img) => {
    const srcSplit = img.src.split('/');
    const mediaPath = srcSplit.pop();
    img.src = `${url.origin}/${mediaPath}`;
    const { width, height } = img;
    const ratio = width > 200 ? 200 / width : 1;
    img.width = width * ratio;
    img.height = height * ratio;
    const pic = img.closest('picture');
    pic.parentElement.replaceChild(img, pic);
  });
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.append(createTag('td', { colspan: maxCols }, name));
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

function getBlockTags(block) {
  if (block.nextElementSibling?.className !== 'library-metadata') {
    return getBlockName(block);
  }
  const libraryMetadata = getMetadata(block.nextElementSibling);
  return libraryMetadata?.searchtags?.text
    ? `${libraryMetadata?.searchtags?.text} ${getBlockName(block)}`
    : getBlockName(block);
}

function isMatchingBlock(pageBlock, query) {
  const tagsString = getBlockTags(pageBlock);
  if (!query || !tagsString) return false;
  const searchTokens = query.split(' ');
  return searchTokens.every((token) => tagsString.toLowerCase().includes(token.toLowerCase()));
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
    const pageBlocks = doc.body.querySelectorAll('div[class]');
    let matchingBlockFound = false;
    pageBlocks.forEach((pageBlock) => {
      // don't display the library-metadata block used to set the block search tags
      if (pageBlock.className === 'library-metadata') {
        return;
      }
      const item = document.createElement('li');
      const name = document.createElement('p');
      name.textContent = getAuthorName(pageBlock) || getBlockName(pageBlock);
      const copy = document.createElement('button');
      copy.addEventListener('click', (e) => {
        const table = getTable(pageBlock, getBlockName(pageBlock), block.path);
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const blob = new Blob([table], { type: 'text/html' });
        createCopy(blob);
      });
      item.append(name, copy);

      if (query) {
        if (isMatchingBlock(pageBlock, query)) {
          matchingBlockFound = true;
        } else {
          item.classList.add('is-hidden');
        }
      }

      blockList.append(item);
    });
    if (query && matchingBlockFound) {
      title.classList.remove('is-hidden');
      title.classList.add('is-open');
    }
  });
}
