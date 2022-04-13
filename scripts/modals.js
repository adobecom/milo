import getFragment from '../blocks/fragment/fragment.js';
import { getMetadata, makeRelative } from './scripts.js';

function getPath() {
  const a = document.querySelector(`a[data-modal-hash="${window.location.hash}"]`);
  if (a) {
    return a.dataset.modalPath;
  }
  const metaModal = getMetadata(`${window.location.hash.replace('#', '-')}`);
  if (metaModal) {
    return makeRelative(metaModal);
  }
  return null;
}

async function getModal() {
  const path = getPath();
  if (path) {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal-dialog';

    const linkBlock = document.createElement('a');
    linkBlock.href = path;

    await getFragment(linkBlock, dialog);

    dialog.append(linkBlock);
    document.body.append(dialog);
    dialog.showModal();
  }
}

export default function modals() {
  if (window.location.hash) {
    getModal();
  }
  window.addEventListener('hashchange', () => {
    getModal();
  });
}
