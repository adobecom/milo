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

function closeModals(modals) {
  const qModals = modals || document.querySelectorAll('dialog[open]');
  qModals.forEach((modal) => { modal.remove(); });
  window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
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
      closeModals([dialog]);
      e.preventDefault();
    });

    const linkBlock = document.createElement('a');
    linkBlock.href = details.path;

    const { default: getFragment } = await import('../fragment/fragment.js');
    await getFragment(linkBlock, dialog);

    dialog.append(linkBlock, close);
    document.body.append(dialog);
    dialog.showModal();
  }

  return dialog;
}

export default function init(el) {
  const { modalHash } = el.dataset;
  if (window.location.hash === modalHash) {
    getModal();
  }
}

// First import will cause this side effect (on purpose)
window.addEventListener('hashchange', () => {
  if (!window.location.hash) {
    closeModals();
  } else {
    getModal();
  }
});
