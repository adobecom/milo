import { createTag, getMetadata, localizeLink } from '../../utils/utils.js';

const FOCUSABLES = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"]';
const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

function findDetails(hash, el) {
  const id = hash.replace('#', '');
  const a = el || document.querySelector(`a[data-modal-hash="${hash}"]`);
  const path = a?.dataset.modalPath || localizeLink(getMetadata(`-${id}`));
  return { id, path, isHash: hash === window.location.hash };
}

function closeModal(modal) {
  const { id } = modal;

  document.querySelectorAll(`#${id}`).forEach((mod) => {
    if (mod.nextElementSibling?.classList.contains('modal-curtain')) {
      mod.nextElementSibling.remove();
    }
    mod.remove();
    document.querySelector(`[data-modal-hash="#${mod.id}"]`)?.focus();
  });

  const hashId = window.location.hash.replace('#', '');
  if (hashId === modal.id) window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
}

function isElementInView(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getCustomModal(custom, dialog) {
  if (custom.id) dialog.id = custom.id;
  if (custom.class) dialog.classList.add(custom.class);
  if (custom.closeEvent) {
    dialog.addEventListener(custom.closeEvent, () => {
      closeModal(dialog);
    });
  }
  dialog.append(custom.content);
}

async function getPathModal(path, dialog) {
  const block = createTag('a', { href: path });
  dialog.append(block);

  const { default: getFragment } = await import('../fragment/fragment.js');
  await getFragment(block);
}

export async function getModal(details, custom) {
  if (!(details?.path || custom)) return null;

  const { id } = details || custom;

  const dialog = createTag('div', { class: 'dialog-modal', id });

  if (custom) getCustomModal(custom, dialog);
  if (details) await getPathModal(details.path, dialog);

  const close = createTag('button', { class: 'dialog-close', 'aria-label': 'Close' }, CLOSE_ICON);

  const focusVisible = { focusVisible: true };
  const focusablesOnLoad = [...dialog.querySelectorAll(FOCUSABLES)];
  const titleOnLoad = dialog.querySelector('h1, h2, h3, h4, h5');
  let firstFocusable;

  if (focusablesOnLoad.length && isElementInView(focusablesOnLoad[0])) {
    firstFocusable = focusablesOnLoad[0]; // eslint-disable-line prefer-destructuring
  } else if (titleOnLoad) {
    titleOnLoad.setAttribute('tabIndex', 0);
    firstFocusable = titleOnLoad;
  } else {
    firstFocusable = close;
  }

  dialog.addEventListener('keydown', (event) => {
    const isShiftKey = event.shiftKey;
    const isTab = event.key === 'Tab';
    const isCloseActive = document.activeElement === close;

    if (!isShiftKey && isTab && isCloseActive) {
      event.preventDefault();
      firstFocusable.focus(focusVisible);
    }

    if (isTab && isShiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      close.focus(focusVisible);
    }
  });

  close.addEventListener('click', (e) => {
    closeModal(dialog);
    e.preventDefault();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(dialog);
    }
  });

  dialog.append(close);
  document.body.append(dialog);
  firstFocusable.focus(focusVisible);

  if (!dialog.classList.contains('curtain-off')) {
    const curtain = createTag('div', { class: 'modal-curtain is-open' });
    curtain.addEventListener('click', (e) => {
      if (e.target === curtain) closeModal(dialog);
    });
    dialog.insertAdjacentElement('afterend', curtain);
  }

  return dialog;
}

// Deep link-based
export default function init(el) {
  const { modalHash } = el.dataset;
  if (window.location.hash === modalHash) {
    const details = findDetails(window.location.hash, el);
    if (details) return getModal(details);
  }
  return null;
}

// Event-based modal
window.addEventListener('modal:open', (e) => {
  const details = findDetails(e.detail.hash);
  if (details) getModal(details);
});

// Click-based modal
window.addEventListener('hashchange', (e) => {
  if (!window.location.hash) {
    const url = new URL(e.oldURL);
    const dialog = document.querySelector(`.dialog-modal${url.hash}`);
    if (dialog) closeModal(dialog);
  } else {
    const details = findDetails(window.location.hash, null);
    if (details) getModal(details);
  }
});
