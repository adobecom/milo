/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import { createTag, getMetadata, localizeLink, loadStyle, getConfig } from '../../utils/utils.js';
import { decorateSectionAnalytics } from '../../martech/attributes.js';

const LOCALE_MODAL_ID = 'locale-modal-v2';
const FOCUSABLES = 'a:not(.hide-video, .faas), button:not([disabled], .locale-modal-v2 .paddle), input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
const CLOSE_ICON = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke-width="2"/>
  </g>
</svg>`;

let delayedModalId = null;
let prevHash = '';
let isDeepLink = false;
const dialogLoadingSet = new Set();

export function findDetails(hash, el) {
  const id = hash.replace('#', '');
  const a = el || document.querySelector(`a[data-modal-hash="${hash}"]`);
  const path = a?.dataset.modalPath || localizeLink(getMetadata(`-${id}`));
  const ariaLabel = a?.getAttribute('aria-label') || document.querySelector(`a[data-modal-id="${id}"]`)?.getAttribute('aria-label');
  return {
    id,
    path,
    isHash: hash === window.location.hash,
    title: ariaLabel ? `Modal: ${ariaLabel}` : null,
  };
}

function fireAnalyticsEvent(event) {
  const data = {
    xdm: {},
    data: { web: { webInteraction: { name: event?.type } } },
  };
  if (event?.data) data.data._adobe_corpnew = { digitalData: event.data };
  window._satellite?.track('event', data);
}

export function sendAnalytics(event) {
  if (window._satellite?.track) {
    fireAnalyticsEvent(event);
  } else {
    window.addEventListener('alloy_sendEvent', () => {
      fireAnalyticsEvent(event);
    }, { once: true });
  }
}

function focusAfterModalClose(modal) {
  const isGeoPopup = modal?.id === LOCALE_MODAL_ID;
  const onetrustBanner = (isDeepLink || isGeoPopup) && document.querySelector('#onetrust-banner-sdk');
  const geoPopupFocus = !isGeoPopup && document.querySelector(`.dialog-modal#${LOCALE_MODAL_ID} a.con-button`);
  const toFocus = geoPopupFocus || onetrustBanner || null;
  toFocus?.focus();
  isDeepLink = false;

  return toFocus;
}

function focusTriggerElement(modalId) {
  const triggerElement = document.querySelector(
    `[data-modal-hash="#${modalId}"][data-is-modal-trigger="true"]`,
  );
  if (triggerElement) {
    triggerElement.focus();
    triggerElement.removeAttribute('data-is-modal-trigger');
    return;
  }

  // Fallback focus options for deep links
  if (!isDeepLink) return;
  const fallbackSelectors = [
    `[data-modal-hash="#${modalId}"]`,
    `a[data-modal-id="${modalId}"].con-button`,
  ];

  for (const selector of fallbackSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      break;
    }
  }
}

export async function closeModal(modal) {
  if (typeof modal.closeCallback === 'function') await modal.closeCallback(modal);
  const { id } = modal;
  const closeEvent = new Event('milo:modal:closed');
  window.dispatchEvent(closeEvent);

  const iframe = modal.querySelector('iframe');
  if (iframe?._iframeKeydownListener) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.removeEventListener('keydown', iframe._iframeKeydownListener);
    } catch (e) {
      // Cross-origin iframe, can't access content
    }
    delete iframe._iframeKeydownListener;
  }

  if (modal._documentKeydownListener) {
    modal.removeEventListener('keydown', modal._documentKeydownListener);
    delete modal._documentKeydownListener;
  }

  document.querySelectorAll(`#${id}`).forEach((mod) => {
    if (mod.classList.contains('dialog-modal')) {
      const modalCurtain = !mod.matches('.dialog-modal.curtain-off') && document.querySelector(`#${id}~.modal-curtain`);
      if (modalCurtain) {
        modalCurtain.remove();
      }
      mod.remove();
    }
    focusTriggerElement(mod.id);
  });

  if (!document.querySelectorAll('.modal-curtain').length) {
    document.body.classList.remove('disable-scroll');
  }

  [...document.querySelectorAll('header, main, footer')]
    .forEach((element) => element.removeAttribute('aria-disabled'));

  const hashId = window.location.hash.replace('#', '');
  if (hashId === modal.id || modal.id === 'checkout-link-modal') {
    window.history.pushState(window.history.state, document.title, `${window.location.pathname}${window.location.search}${prevHash ? `${prevHash}` : ''}`);
  }
  if (prevHash) prevHash = '';

  if (focusAfterModalClose(modal)) return;

  if (document.querySelector('.notification-curtain')) {
    window.dispatchEvent(new Event('milo:modal:closed:notification'));
    return;
  }

  focusTriggerElement(id);
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
  if (custom.title) dialog.setAttribute('aria-label', custom.title);
  if (custom.class) dialog.classList.add(custom.class);
  if (custom.closeEvent) dialog.addEventListener(custom.closeEvent, () => closeModal(dialog));
  if (custom.closeCallback) dialog.closeCallback = custom.closeCallback;
  dialog.append(custom.content);
}

async function getPathModal(path, dialog) {
  let href = path;
  if (path.includes('/federal/')) {
    const { getFederatedUrl } = await import('../../utils/utils.js');
    href = getFederatedUrl(path);
  }
  const block = createTag('a', { href });
  dialog.append(block);

  // eslint-disable-next-line import/no-cycle
  const { default: getFragment } = await import('../fragment/fragment.js');
  await getFragment(block);
}

const isSameOrigin = (iframe) => new URL(iframe.src).origin === window.location.origin;

function addIframeKeydownListener(iframe, dialog) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const iframeKeydownListener = (event) => (event.key === 'Escape') && closeModal(dialog);
    iframeDoc.addEventListener('keydown', iframeKeydownListener);
    iframe._iframeKeydownListener = iframeKeydownListener;
  } catch (e) {
    // Cross-origin iframe, can't access content
  }
}

export async function getModal(details, custom) {
  if (!((details?.path && details?.id) || custom)) return null;
  const { id, deepLink } = details || custom;
  if (id !== LOCALE_MODAL_ID) isDeepLink = deepLink;
  if (!isDeepLink) document.activeElement.dataset.isModalTrigger = 'true';

  dialogLoadingSet.add(id);
  const dialog = createTag('div', { class: 'dialog-modal', id, role: 'dialog', 'aria-modal': true });
  const loadedEvent = new Event('milo:modal:loaded');

  if (custom && !custom?.title) custom.title = findDetails(window.location.hash, null)?.title;
  if (custom) getCustomModal(custom, dialog);
  if (details) await getPathModal(details.path, dialog);
  if (delayedModalId === id) {
    dialog.classList.add('delayed-modal');
    const mediaBlock = dialog.querySelector('div.media');
    if (mediaBlock) {
      mediaBlock.classList.add('in-modal');
      const { miloLibs, codeRoot } = getConfig();
      const base = miloLibs || codeRoot;
      loadStyle(`${base}/styles/rounded-corners.css`);
    }
    delayedModalId = null;
  }

  const localeModal = id?.includes('locale-modal') ? 'localeModal' : 'milo';
  const analyticsEventName = window.location.hash ? window.location.hash.replace('#', '') : localeModal;
  const close = createTag('button', {
    class: 'dialog-close',
    'aria-label': 'Close',
    'daa-ll': `${analyticsEventName}:modalClose:buttonClose`,
  }, CLOSE_ICON);
  const focusPlaceholder = createTag('div', { class: 'dialog-focus-placeholder', tabindex: 0 });

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

  let shiftTabOnClose = false;

  close.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !event.shiftKey) return;
    shiftTabOnClose = true;
    focusPlaceholder.focus(focusVisible);
  });

  focusPlaceholder.addEventListener('focus', () => {
    if (!shiftTabOnClose) close.focus(focusVisible);
    shiftTabOnClose = false;
  });

  close.addEventListener('click', (e) => {
    closeModal(dialog);
    e.preventDefault();
  });

  const documentKeydownListener = (event) => (event.key === 'Escape') && closeModal(dialog);
  dialog.addEventListener('keydown', documentKeydownListener);
  dialog._documentKeydownListener = documentKeydownListener;

  decorateSectionAnalytics(dialog, `${id}-modal`, getConfig());
  dialog.prepend(close);
  dialog.append(focusPlaceholder);
  document.body.append(dialog);
  dialogLoadingSet.delete(id);
  firstFocusable?.focus({ preventScroll: true, ...focusVisible });
  window.dispatchEvent(loadedEvent);

  if (!dialog.classList.contains('curtain-off')) {
    document.body.classList.add('disable-scroll');
    const curtain = createTag('div', {
      class: 'modal-curtain is-open',
      'daa-ll': `${analyticsEventName}:modalClose:curtainClose`,
    });
    curtain.addEventListener('click', (e) => {
      if (e.target === curtain) closeModal(dialog);
    });
    dialog.insertAdjacentElement('afterend', curtain);
    [...document.querySelectorAll('header, main, footer')]
      .forEach((element) => element.setAttribute('aria-disabled', 'true'));
  }

  const iframe = dialog.querySelector('iframe');
  if (iframe) {
    const title = custom?.title || details?.title;
    if (title) {
      iframe.setAttribute('title', title);
      dialog.setAttribute('aria-label', title);
    }

    if (iframe.title) {
      dialog.setAttribute('aria-label', iframe.title);
    } else {
      iframe.onload = () => {
        try {
          if (!isSameOrigin(iframe) && iframe.title) {
            dialog.setAttribute('aria-label', iframe.title);
            return;
          }

          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          const iframeHeading = iframeDoc.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim();
          if (iframeHeading) dialog.setAttribute('aria-label', iframeHeading);
          if (!iframe.title && iframeHeading) iframe.title = iframeHeading;
        } catch (e) {
          // Cross-origin iframe, can't access content
        }
      };
    }

    iframe.addEventListener('load', () => {
      if (!isSameOrigin(iframe)) return;
      addIframeKeydownListener(iframe, dialog);
    });

    if (dialog.classList.contains('commerce-frame') || dialog.classList.contains('dynamic-height')) {
      const { default: enableCommerceFrameFeatures } = await import('./modal.merch.js');
      await enableCommerceFrameFeatures({ dialog, iframe });
    } else {
      /* Initially iframe height is set to 0% in CSS for the height auto adjustment feature.
      The height auto adjustment feature is applicable only to dialogs
      with the `commerce-frame` or `dynamic-height` classes */
      iframe.style.height = '100%';
    }
    if (!custom?.closeEvent) dialog.addEventListener('iframe:modal:closed', () => closeModal(dialog));
  } else {
    const firstHeading = dialog.querySelector('h1, h2, h3, h4, h5, h6');
    if (firstHeading) dialog.setAttribute('aria-label', firstHeading.textContent.trim());
  }

  return dialog;
}

export function getHashParams(hashStr) {
  if (!hashStr) return {};
  return hashStr.split(':').reduce((params, part) => {
    if (part.startsWith('#')) {
      params.hash = part;
    } else {
      const [key, val] = part.split('=');
      if (key === 'delay') {
        params.delay = parseInt(val, 10) * 1000;
      }
    }
    return params;
  }, {});
}

export function delayedModal(el) {
  const { hash, delay } = getHashParams(el?.dataset.modalHash);
  const isDesktop = window.matchMedia('(min-width: 1200px)').matches;
  if (delay === undefined || !hash || !isDesktop) return false;
  delayedModalId = hash.replace('#', '');
  const modalOpenEvent = new Event(`${hash}:modalOpen`);
  const pagesModalWasShownOn = window.sessionStorage.getItem(`shown:${hash}`);
  el.dataset.modalHash = hash;
  el.href = hash;
  if (!pagesModalWasShownOn?.includes(window.location.pathname)) {
    setTimeout(() => {
      window.location.replace(hash);
      sendAnalytics(modalOpenEvent);
      window.sessionStorage.setItem(`shown:${hash}`, `${pagesModalWasShownOn || ''} ${window.location.pathname}`);
    }, delay);
  }
  return true;
}

// Deep link-based
export default function init(el) {
  const { modalHash, modalPath } = el.dataset;
  if (getConfig().mep?.fragments?.[modalPath]?.action === 'remove') return null;
  if (delayedModal(el) || window.location.hash !== modalHash || document.querySelector(`div.dialog-modal${modalHash}`)) return null;
  if (dialogLoadingSet.has(modalHash?.replace('#', ''))) return null; // prevent duplicate modal loading
  const details = findDetails(window.location.hash, el);
  details.deepLink = true;
  return details ? getModal(details) : null;
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
    if (isDeepLink) return;
    const details = findDetails(window.location.hash, null);
    if (details) getModal(details);
    const { hash } = new URL(e.oldURL);
    const isFromIms = hash.includes(`old_hash=${details.id}`) || hash.includes('from_ims=true');
    isDeepLink = isFromIms;
    if (!hash || isFromIms) return;

    if (hash.includes('=') || !document.querySelector(`${hash}:not(.dialog-modal)`)) {
      prevHash = hash;
    }
  }
});
