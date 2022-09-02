import { createTag, getMetadata, makeRelative } from '../../utils/utils.js';

const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="16" height="16" focusable="false"><path d="M14 3.41L9.41 8 14 12.59 12.59 14 8 9.41 3.41 14 2 12.59 6.59 8 2 3.41 3.41 2 8 6.59 12.59 2z"></path></svg>';

function getDetails(el) {
  const details = { id: window.location.hash.replace('#', '') };
  const a = el || document.querySelector(`a[data-modal-hash="${window.location.hash}"]`);
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
  if (qModals?.length) {
    qModals.forEach((modal) => { modal.remove(); });
    window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
  }
}

async function getModal(el) {
  const details = getDetails(el);
  if (!details) return null;
  let dialog = document.querySelector(`#${details.id}`);
  if (dialog) {
    dialog.showModal();
  } else {
    dialog = document.createElement('dialog');
    dialog.className = 'dialog-modal';
    dialog.id = details.id;

    const close = createTag('button', { class: 'dialog-close', 'aria-label': 'Close' }, CLOSE_ICON);

    close.addEventListener('click', (e) => {
      closeModals([dialog]);
      e.preventDefault();
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeModals([dialog]);
      }
    });

    dialog.addEventListener('close', () => {
      closeModals([dialog]);
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
    getModal(el);
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
