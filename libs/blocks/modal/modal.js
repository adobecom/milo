import { createTag, getMetadata, makeRelative } from '../../utils/utils.js';

const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

function getDetails(el) {
  const id = el.dataset.eventModal || window.location.hash.replace('#', '');
  const details = { id };
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
  const qModals = modals || document.querySelectorAll('.dialog-modal');
  if (qModals?.length) {
    qModals.forEach((modal) => {
      if (modal.nextElementSibling?.classList.contains('modal-curtain')) {
        modal.nextElementSibling.remove();
      }
      modal.remove();
    });
    window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
  }
}

export async function getModal(el, name) {
  const details = getDetails(el, name);
  if (!details) return null;

  const close = createTag('button', { class: 'dialog-close', 'aria-label': 'Close' }, CLOSE_ICON);
  const dialog = document.createElement('div');
  dialog.className = 'dialog-modal';
  dialog.id = details.id;

  close.addEventListener('click', (e) => {
    closeModals([dialog]);
    e.preventDefault();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) {
      closeModals([dialog]);
    }
  });

  const linkBlock = document.createElement('a');
  linkBlock.href = details.path;
  dialog.append(close, linkBlock);

  const { default: getFragment } = await import('../fragment/fragment.js');
  await getFragment(linkBlock, dialog);

  document.body.append(dialog);

  if (!dialog.classList.contains('backdrop-off')) {
    const curtain = createTag('div', { class: 'modal-curtain is-open' });
    dialog.insertAdjacentElement('afterend', curtain);
    curtain.addEventListener('click', (e) => {
      // on click outside of modal
      if (e.target === curtain) {
        closeModals([dialog]);
      }
    });
  }

  close.focus({ focusVisible: true });

  return dialog;
}

export default function init(el) {
  const { modalHash } = el.dataset;
  if (window.location.hash === modalHash) {
    return getModal(el);
  }
  return null;
}

window.addEventListener('modal:open', (e) => {
  const { name } = e.detail;
  const el = document.querySelector(`a[data-modal-hash="#${name}"]`);
  if (!el) return;
  el.dataset.eventModal = name;
  getModal(el);
});

// First import will cause this side effect (on purpose)
window.addEventListener('hashchange', () => {
  if (!window.location.hash) {
    closeModals();
  } else {
    getModal();
  }
});
