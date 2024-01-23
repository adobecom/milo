/* eslint-disable import/no-cycle */
import { createTag, getMetadata, localizeLink, loadStyle, getConfig } from '../../utils/utils.js';

const FOCUSABLES = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"]';
const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;
let isInitialPageLoad = true;
const MOBILE_MAX = 599;
const TABLET_MAX = 1199;

export function findDetails(hash, el) {
  const id = hash.replace('#', '');
  const a = el || document.querySelector(`a[data-modal-hash="${hash}"]`);
  const path = a?.dataset.modalPath || localizeLink(getMetadata(`-${id}`));
  return { id, path, isHash: hash === window.location.hash };
}

export function sendAnalytics(event) {
  // eslint-disable-next-line no-underscore-dangle
  window._satellite?.track('event', {
    xdm: {},
    data: {
      web: { webInteraction: { name: event?.type } },
      _adobe_corpnew: { digitalData: event?.data },
    },
  });
}

function closeModal(modal) {
  const { id } = modal;
  const closeEvent = new Event('milo:modal:closed');
  window.dispatchEvent(closeEvent);
  const localeModal = id?.includes('locale-modal') ? 'localeModal' : 'milo';
  const analyticsEventName = window.location.hash ? window.location.hash.replace('#', '') : localeModal;
  const closeEventAnalytics = new Event(`${analyticsEventName}:modalClose:buttonClose`);
  sendAnalytics(closeEventAnalytics);

  document.querySelectorAll(`#${id}`).forEach((mod) => {
    if (mod.classList.contains('dialog-modal')) {
      const modalCurtain = document.querySelector(`#${id}~.modal-curtain`);
      if (modalCurtain) {
        modalCurtain.remove();
      }
      mod.remove();
    }
    document.querySelector(`[data-modal-hash="#${mod.id}"]`)?.focus();
  });

  if (!document.querySelectorAll('.modal-curtain').length) {
    document.body.classList.remove('disable-scroll');
  }

  [...document.querySelectorAll('header, main, footer')]
    .forEach((element) => element.removeAttribute('aria-disabled'));

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
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/blocks/modal/modal.css`);
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

  // eslint-disable-next-line import/no-cycle
  const { default: getFragment } = await import('../fragment/fragment.js');
  await getFragment(block);
}
function sendViewportDimensionsToiFrame(source) {
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  source.postMessage({ mobileMax: MOBILE_MAX, tabletMax: TABLET_MAX, viewportWidth }, '*');
}

let resizeListenerAdded = false;
export async function sendViewportDimensionsOnRequest(messageInfo) {
  if (messageInfo.data === 'viewportWidth') {
    sendViewportDimensionsToiFrame(messageInfo.source);
    const { debounce } = await import('../../utils/action.js');
    if (!resizeListenerAdded) {
      window.addEventListener('resize', debounce(() => sendViewportDimensionsToiFrame(messageInfo.source), 50));
      resizeListenerAdded = true;
    }
  }
}

/** For the modal height adjustment to work the following conditions must be met:
 * 1. The modal must have classes 'commerce-frame height-fit-content';
 * 2. The iframe inside must send a postMessage with the contentHeight (a number of px or '100%);
 */
function adjustModalHeight({ contentHeight, dialogId }) {
  if (!contentHeight || !dialogId) return;
  const dialog = document.querySelector(`#${dialogId}`);
  const iFrameWrapper = dialog?.querySelector('.milo-iframe.modal');
  if (!iFrameWrapper) return;

  if (contentHeight === '100%') {
    iFrameWrapper.style.height = contentHeight;
    dialog.style.height = contentHeight;
  } else {
    const verticalMargins = 20;
    const clientHeight = document.documentElement.clientHeight - verticalMargins;
    if (clientHeight <= 0) return;
    const newHeight = contentHeight > clientHeight ? clientHeight : contentHeight;
    iFrameWrapper.style.height = `${newHeight}px`;
    dialog.style.height = `${newHeight}px`;
  }
}

export async function getModal(details, custom) {
  if (!(details?.path || custom)) return null;
  const { id } = details || custom;

  const dialog = createTag('div', { class: 'dialog-modal', id });
  const loadedEvent = new Event('milo:modal:loaded');

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
  firstFocusable.focus({ preventScroll: true, ...focusVisible });
  window.dispatchEvent(loadedEvent);

  if (!dialog.classList.contains('curtain-off')) {
    document.body.classList.add('disable-scroll');
    const curtain = createTag('div', { class: 'modal-curtain is-open' });
    curtain.addEventListener('click', (e) => {
      if (e.target === curtain) closeModal(dialog);
    });
    dialog.insertAdjacentElement('afterend', curtain);
    [...document.querySelectorAll('header, main, footer')]
      .forEach((element) => element.setAttribute('aria-disabled', 'true'));
  }
  if (dialog.classList.contains('commerce-frame')) {
    if (isInitialPageLoad) {
      window.addEventListener('message', (messageInfo) => {
        if (dialog.classList.contains('height-fit-content')) {
          adjustModalHeight({ contentHeight: messageInfo?.data?.contentHeight, dialogId: id });
        }
        sendViewportDimensionsOnRequest(messageInfo);
      });
      isInitialPageLoad = false;
    }
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

// Click-based modal
window.addEventListener('hashchange', (e) => {
  if (!window.location.hash) {
    try {
      const url = new URL(e.oldURL);
      const dialog = document.querySelector(`.dialog-modal${url.hash}`);
      if (dialog) closeModal(dialog);
    } catch (error) {
      /* do nothing */
    }
  } else {
    const details = findDetails(window.location.hash, null);
    if (details) getModal(details);
  }
});
