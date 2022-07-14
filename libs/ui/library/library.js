/* global ClipboardItem */

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

function getBlockName(block) {
  const variants = block.className.split('--');
  let name = variants.shift();
  name = name.replace(name[0], name[0].toUpperCase());
  if (variants.length > 0) {
    variants.push(variants.pop().slice(0, -1));
    name += ` (${variants.join(', ')})`;
  }
  return name;
}

function getTable(block) {
  const name = getBlockName(block);
  const rows = [...block.children];
  const maxCols = rows.reduce((cols, row) => (
    row.children.length > cols ? row.children.length : cols), 0);
  const table = document.createElement('table');
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
  return { name, table: table.outerHTML };
}

async function loadBlockList(path, list) {
  const resp = await fetch(`${domain}${path}`);
  if (!resp.ok) return;
  const json = await resp.json();
  json.data.forEach(async (blockGroup) => {
    const pageResp = await fetch(`${domain}${blockGroup.value}.plain.html`);
    if (!pageResp.ok) return;
    const html = await pageResp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks = doc.body.querySelectorAll('div[class]');
    blocks.forEach((block) => {
      const item = document.createElement('li');
      const name = document.createElement('p');
      const converted = getTable(block);
      name.textContent = converted.name;
      const { table } = converted;
      const copy = document.createElement('button');
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const blob = new Blob([table], { type: 'text/html' });
        createCopy(blob);
      });

      item.append(name, copy);
      list.append(item);
    });
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
      loadBlockList(type.path, list);
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

function loadContentFinder() {
  if (!libraries) return;
  loadStyle(`${domain}/libs/ui/library/library.css`);
  const finder = document.createElement('div');
  finder.className = 'con-finder';

  const header = document.createElement('div');
  header.className = 'con-header';
  header.insertAdjacentHTML('afterbegin', '<p class="heading">Library</p>');
  const back = document.createElement('button');
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
  loadContentFinder();
});
