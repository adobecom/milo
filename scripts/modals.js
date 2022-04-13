import getFragment from '../blocks/fragment/fragment.js';
import { getMetadata, makeRelative } from './scripts.js';

function getPath() {
  const a = document.querySelector(`a[data-modal-hash="${window.location.hash}"]`);
  if (a) {
    return a.dataset.modalPath;
  }
  return makeRelative(getMetadata(`${window.location.hash.replace('#', '-')}`));
}

async function getModal() {
  const path = getPath();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const linkBlock = document.createElement('a');
  linkBlock.href = path;

  await getFragment(linkBlock, backdrop);

  backdrop.append(linkBlock);
  document.body.append(backdrop);
}

export default function modals() {
  if (window.location.hash) {
    getModal();
  } else {
    window.addEventListener('hashchange', getModal);
  }
}
