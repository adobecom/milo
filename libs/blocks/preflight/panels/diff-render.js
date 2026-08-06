import { createTag, loadArea } from '../../../utils/utils.js';
import { CONTENT_SELECTOR } from '../checks/diff/diffContent.js';
import { getXPath } from '../checks/diff/nodePath.js';

const PANE_ROOT_CLASS = 'preflight-diff-pane-root';

// Stamp before decorate: decoration reshapes nodes (links→buttons, img→picture),
// but a key computed pre-decoration stays attached to the node and matches diffContent's path.
export function stampKeys(main) {
  main.querySelectorAll(CONTENT_SELECTOR).forEach((el) => {
    el.dataset.diffKey = getXPath(el, main);
  });
}

// Decoration can assign ids (e.g. anchor targets); two rendered page copies living in the
// same document must not carry them over, or they'd collide with each other and the real page.
function stripIds(root) {
  if (root.hasAttribute('id')) root.removeAttribute('id');
  root.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
}

export async function renderPane(plainHtml, { decorate = loadArea } = {}) {
  const doc = new DOMParser().parseFromString(plainHtml, 'text/html');
  const parsedMain = doc.querySelector('main') || doc.body;
  // A div, not <main> — a rendered comparison pane isn't a page landmark.
  const root = createTag('div', { class: PANE_ROOT_CLASS });
  root.append(...parsedMain.childNodes);
  stampKeys(root);
  await decorate(root);
  stripIds(root);
  return root;
}
