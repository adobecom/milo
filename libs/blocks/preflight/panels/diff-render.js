import { createTag, loadArea } from '../../../utils/utils.js';
import { CONTENT_SELECTOR } from '../checks/diff/diffContent.js';
import { getXPath } from '../checks/diff/nodePath.js';

// Stamp before decorate: decoration reshapes nodes (links→buttons, img→picture),
// but a key computed pre-decoration stays attached to the node and matches diffContent's path.
export function stampKeys(main) {
  main.querySelectorAll(CONTENT_SELECTOR).forEach((el) => {
    el.dataset.diffKey = getXPath(el, main);
  });
}

export async function renderPane(plainHtml, { decorate = loadArea } = {}) {
  const doc = new DOMParser().parseFromString(plainHtml, 'text/html');
  const parsedMain = doc.querySelector('main') || doc.body;
  const main = createTag('main');
  main.append(...parsedMain.childNodes);
  stampKeys(main);
  await decorate(main);
  return main;
}
