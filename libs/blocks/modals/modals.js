import { getMetadata, makeRelative } from '../../utils/utils.js';

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
  return null;
}

async function getModal() {
  const details = getDetails();
  if (!details) return null;
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

    const { default: getFragment } = await import('../fragment/fragment.js');
    await getFragment(linkBlock, dialog);

    dialog.append(linkBlock, close);
    document.body.append(dialog);
    dialog.showModal();
  }

  dialog.addEventListener('close', (e) => {
    window.location.hash = '#';
    e.target.remove();
  });

  return dialog;
}

export default function init(once = false) {
  return new Promise((resolve) => {
    if (window.location.hash) {
      resolve(getModal());
    }
    window.addEventListener('hashchange', () => {
      if (!window.location.hash) {
        resolve(closeModals());
      } else {
        resolve(getModal());
      }
    }, { once });
  });
}
