import { createTag, loadBlock } from './utils.js';

// blockNamesStr is a comma delimited list of blocks to inject
export default async function injectBlock(blockNamesStr) {
  if (!blockNamesStr) return;

  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  const blockNames = blockNamesStr.split(',').map((name) => name.trim()).filter(Boolean);

  await Promise.all(blockNames.map((blockName) => {
    const blockEl = createTag('div', { class: blockName });
    mainEl.appendChild(blockEl);
    return loadBlock(blockEl);
  }));
}
