/* global ClipboardItem */

import { createTag } from '../../utils/utils.js';

let domain;
let libraries;

function createCopy(blob) {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  navigator.clipboard.write(data);
}

function loadStyle(href) {
  if (!document.head.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    document.head.appendChild(link);
  }
}

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
    img.style = 'max-height: 100px; width: auto;';
    img.src = `${url.origin}/${mediaPath}`;
  });
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
  table.setAttribute('border', 1);
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th colspan="${maxCols}">${name}</th>`;
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

async function loadBlockList(paths, list) {
  paths.forEach(async (path) => {
    const resp = await fetch(path);
    if (!resp.ok) return;
    const json = await resp.json();
    // eslint-disable-next-line no-restricted-syntax
    for (const blockGroup of json.data) {
      const titleText = createTag('p', { class: 'block-title' }, blockGroup.key);
      const title = createTag('li', { class: 'block-group' }, titleText);
      const previewButton = createTag('button', { class: 'preview-group' }, 'Preview');
      title.append(previewButton);
      list.append(title);

      previewButton.addEventListener('click', () => {
        window.open(blockGroup.value, '_blockpreview');
      });

      // eslint-disable-next-line no-await-in-loop
      const pageResp = await fetch(`${blockGroup.value}.plain.html`);
      if (!pageResp.ok) return;
      // eslint-disable-next-line no-await-in-loop
      const html = await pageResp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const blocks = doc.body.querySelectorAll('div[class]');
      blocks.forEach((block) => {
        const item = document.createElement('li');
        const name = document.createElement('p');
        name.textContent = getAuthorName(block) || getBlockName(block);
        const copy = document.createElement('button');
        copy.addEventListener('click', (e) => {
          const table = getTable(block, name.textContent, blockGroup.value);
          e.target.classList.add('copied');
          setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
          const blob = new Blob([table], { type: 'text/html' });
          createCopy(blob);
        });
        item.append(name, copy);
        list.append(item);
      });
    }
  });
}

function stub(list) {
  const item = document.createElement('li');
  const name = document.createElement('p');
  name.textContent = 'This library isn\'t supported';
  item.append(name);
  list.append(item);
}

async function loadList(type, list) {
  list.innerHTML = '';
  switch (type.text) {
    case 'Blocks':
      loadBlockList(type.paths, list);
      break;
    case 'Templates':
      stub(list);
      break;
    case 'Placeholders':
      stub(list);
      break;
    case 'Tokens':
      stub(list);
      break;
    default:
      await import('../../utils/lana.js');
      window.lana.log(`Library type not supported: ${type}`, { clientId: 'milo', sampleRate: 100 });
  }
}

function loadLibraries() {
  if (!libraries) return;
  loadStyle(`${domain}/libs/ui/library/library.css`);
  const finder = document.createElement('div');
  finder.className = 'con-finder';

  const button = createTag('button', { class: 'logo' }, 'Close');
  button.addEventListener('click', () => {
    finder.classList.toggle('is-collapsed');
  });

  const title = createTag('div', { class: 'con-title' }, button);
  title.append(createTag('p', { class: 'headering' }, 'Library'));
  const header = createTag('div', { class: 'con-header' }, title);

  const back = document.createElement('button');
  back.className = 'con-back';
  back.addEventListener('click', () => {
    const insetEls = finder.querySelectorAll('.inset');
    insetEls.forEach((el) => {
      el.classList.remove('inset');
    });
    finder.classList.remove('allow-back');
  });
  header.append(back);
  finder.append(header);

  const container = document.createElement('div');
  container.className = 'con-container';
  finder.append(container);

  const contentList = document.createElement('ul');
  container.append(contentList);

  Object.keys(libraries).forEach((type) => {
    const item = document.createElement('li');
    item.className = 'content-type';
    item.innerHTML = `<p>${libraries[type].text}</p>`;
    contentList.appendChild(item);

    const list = document.createElement('ul');
    list.classList.add('con-type-list', `con-${type}-list`);
    container.append(list);

    item.addEventListener('click', () => {
      contentList.classList.add('inset');
      list.classList.add('inset');
      finder.classList.add('allow-back');
      loadList(libraries[type], list);
    });
  });
  document.body.append(finder);
}

document.addEventListener('hlx:library-loaded', (e) => {
  domain = e.detail.domain;
  libraries = e.detail.libraries;
  loadLibraries();
});
