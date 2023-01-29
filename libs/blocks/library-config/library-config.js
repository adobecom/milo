import { createTag } from '../../utils/utils.js';

const LIBRARY_PATH = '/docs/library/library.json';

async function loadBlocks(content, list) {
  const { default: blocks } = await import('./lists/blocks.js');
  blocks(content, list);
}

async function loadPlaceholders(content, list) {
  const { default: placeholders } = await import('./lists/placeholders.js');
  placeholders(content, list);
}

async function loadIcons(content, list) {
  const { default: icons } = await import('./lists/icons.js');
  icons(content, list);
}

async function loadAssets(content, list) {
  const { default: assets } = await import('./lists/assets.js');
  assets(content, list);
}

async function loadList(type, content, list) {
  list.innerHTML = '';
  switch (type) {
    case 'blocks':
      loadBlocks(content, list);
      break;
    case 'placeholders':
      loadPlaceholders(content, list);
      break;
    case 'icons':
      loadIcons(content, list);
      break;
    case 'assets':
      loadAssets(content, list);
      break;
    default:
      await import('../../utils/lana.js');
      window.lana.log(`Library type not supported: ${type}`, { clientId: 'milo', sampleRate: 100 });
  }
}

async function fetchLibrary(domain) {
  const { searchParams } = new URL(window.location.href);
  const suppliedLibrary = searchParams.get('library');
  const library = suppliedLibrary || `${domain}${LIBRARY_PATH}`;

  const resp = await fetch(library);
  if (!resp.ok) return null;
  return resp.json();
}

async function getSuppliedLibrary() {
  const { searchParams } = new URL(window.location.href);
  const repo = searchParams.get('repo');
  const owner = searchParams.get('owner');
  if (!repo || !owner) return null;
  return fetchLibrary(`https://main--${repo}--${owner}.hlx.live`);
}

async function fetchAssetsData(path) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;

  const json = await resp.json();
  const assetHrefs = json.entities.map((entity) => entity.links[0].href);
  return assetHrefs;
}

async function combineLibraries(base, supplied) {
  const url = new URL(window.location.href);

  const assetsPath = url.searchParams.get('assets');

  const library = {
    blocks: base.blocks.data,
    placeholders: base.placeholders?.data,
    icons: base.icons?.data,
    assets: await fetchAssetsData(assetsPath),
  };

  if (supplied) {
    if (supplied.blocks.data.length > 0) {
      library.blocks.push(...supplied.blocks.data);
    }

    if (supplied.placeholders.data.length > 0) {
      library.placeholders = supplied.placeholders.data;
    }
  }

  return library;
}

function createList(libraries) {
  const container = createTag('div', { class: 'con-container' });

  const libraryList = createTag('ul', { class: 'sk-library-list' });
  container.append(libraryList);

  Object.keys(libraries).forEach((type) => {
    if (!libraries[type] || libraries[type].length === 0) return;

    const item = createTag('li', { class: 'content-type' }, type);
    libraryList.append(item);

    const list = document.createElement('ul');
    list.classList.add('con-type-list', `con-${type}-list`);
    container.append(list);

    item.addEventListener('click', (e) => {
      const skLibrary = e.target.closest('.sk-library');
      skLibrary.querySelector('.sk-library-title-text').textContent = type;
      libraryList.classList.add('inset');
      list.classList.add('inset');
      skLibrary.classList.add('allow-back');
      loadList(type, libraries[type], list);
    });
  });

  return container;
}

function createHeader() {
  const nav = createTag('button', { class: 'sk-library-logo' }, 'Franklin Library');
  const title = createTag('div', { class: 'sk-library-title' }, nav);
  title.append(createTag('p', { class: 'sk-library-title-text' }, 'Pick a library'));
  const header = createTag('div', { class: 'sk-library-header' }, title);

  nav.addEventListener('click', (e) => {
    const skLibrary = e.target.closest('.sk-library');
    skLibrary.querySelector('.sk-library-title-text').textContent = 'Pick a library';
    const insetEls = skLibrary.querySelectorAll('.inset');
    insetEls.forEach((el) => {
      el.classList.remove('inset');
    });
    skLibrary.classList.remove('allow-back');
  });
  return header;
}

function detectContext() {
  if (window.self === window.top) {
    document.body.classList.add('in-page');
  }
}

export default async function init(el) {
  el.querySelector('div').remove();
  detectContext();

  // Get the data
  const base = await fetchLibrary(window.location.origin);
  const supplied = await getSuppliedLibrary();
  const libraries = await combineLibraries(base, supplied);

  // Create the UI
  const skLibrary = createTag('div', { class: 'sk-library' });

  const header = createHeader();
  skLibrary.append(header);

  const list = createList(libraries);
  skLibrary.append(list);

  el.append(skLibrary);
}
