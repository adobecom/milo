import getFragment from '../blocks/fragment/fragment.js';
import { getMetadata, makeRelative } from './scripts.js';

function getDetails() {
  const details = { id: window.location.hash.replace('#', '') };
  const a = document.querySelector(`a[data-modal-hash="${window.location.hash}"]`);
  if (a) {
    details.path = a.dataset.modalPath;
    return details;
  }
  const metaPath = getMetadata(`-${details.id}`);
  if (metaPath) {
    details.path = makeRelative(metaPath);
    return details;
  }
  return null;
}

function closeModals() {
  const modals = document.querySelectorAll('dialog[open]');
  modals.forEach((modal) => {
    modal.close();
  });
}

async function getModal() {
  const details = getDetails();
  if (details) {
    let dialog = document.querySelector(`#${details.id}`);
    if (dialog) {
      dialog.showModal();
    } else {
      dialog = document.createElement('dialog');
      dialog.className = 'dialog-modal';
      dialog.id = details.id;

      const close = document.createElement('button');
      close.textContent = 'X';
      close.className = 'dialog-close';

      close.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#';
        dialog.close();
      });

      const linkBlock = document.createElement('a');
      linkBlock.href = details.path;

      await getFragment(linkBlock, dialog);

      dialog.append(linkBlock, close);
      document.body.append(dialog);
      dialog.showModal();
    }
  }
}

export default function init() {
  if (window.location.hash) {
    getModal();
  }
  window.addEventListener('hashchange', () => {
    if (!window.location.hash) {
      closeModals();
    } else {
      getModal();
    }
  });
}
