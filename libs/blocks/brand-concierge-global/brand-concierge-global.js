import { createTag, getMetadata } from '../../utils/utils.js';
import {
  aiIcon,
  decorateInput,
  decorateCards,
  updateReplicatedValue,
  handleConsent,
  hasChatCookie,
  isC2,
  isC2Nav,
} from '../brand-concierge/bc-utils.js';
import {
  loadWebclient,
  bcBootstrap,
  openSideModal,
  setAuthoredContent,
  sideOverlayTop,
  isMobile,
} from '../brand-concierge/bc-bootstrap.js';
import { initAnalytics } from '../brand-concierge/bc-analytics.js';

let stayActive = false;
let useAcomAssistant = false;
let acomAssistantModulePromise;

function gnavActivate(gnavInput, gnavCards) {
  gnavInput.classList.add('active');
  gnavCards.classList.add('active');
}

function gnavDeactivate(gnavInput, gnavCards) {
  if (!stayActive) {
    gnavInput.classList.remove('active');
    gnavCards.classList.remove('active');
  }
}

function handleInput(text, gnavInput) {
  const textWrapper = gnavInput.querySelector('.bc-textarea-grow-wrap');
  const textArea = gnavInput.querySelector('textarea');
  const submitButton = gnavInput.querySelector('.input-field-button');
  const gnavCards = document.querySelector('.feds-bc-wrapper .bc-prompt-cards');
  textArea.value = '';
  updateReplicatedValue(textWrapper, textArea);
  submitButton.disabled = true;
  textArea.blur();
  gnavDeactivate(gnavInput, gnavCards);
  openSideModal(text, bcBootstrap);
}

function handleSuggestedPrompt(text, gnavCards, event) {
  const gnavInput = document.querySelector('.feds-bc-wrapper .bc-input-field');
  event.target.blur();
  gnavDeactivate(gnavInput, gnavCards);
  openSideModal(text, bcBootstrap);
}

function handleGnavButton(event) {
  const isOpen = document.body.classList.contains('bc-side-open');
  const close = document.querySelector('#brand-concierge-side button.dialog-close');
  if (!isOpen) openSideModal(null, bcBootstrap);
  else close.click();
  event.target.blur();
}

function promptDown() {
  stayActive = true;
}

function promptUp() {
  stayActive = false;
}

export function decorateNavWithAssistant(cards, topNav) {
  const bcWrapper = topNav.querySelector('.feds-bc-wrapper');
  if (!bcWrapper || bcWrapper.querySelector('#acomAssistant-gnav-mount')) return;

  // Per the wiki, the client discovers this mount point and builds its own GNav
  // icon/expanded-input/minimized states into it
  // https://wiki.corp.adobe.com/spaces/Infinity/pages/4028260009/BC+Milo+Integration
  const mount = createTag('div', { id: 'acomAssistant-gnav-mount' });
  bcWrapper.appendChild(mount);
  acomAssistantModulePromise ||= import('../brand-concierge/acom-assistant-bootstrap.js');
  acomAssistantModulePromise.then(({ ensureAcomAssistant }) => ensureAcomAssistant(cards))
    .catch((error) => {
      window.lana?.log?.(`AcomAssistant: failed to initialize GNav (${error.message})`, { tags: 'acom-assistant', severity: 'error' });
    });

  if (window?.milo) {
    window.milo.brandConcierge = { brandConciergeGlobal: true };
  } else {
    window.milo = { brandConcierge: { brandConciergeGlobal: true } };
  }
}

function decorateGnav(cards, input, topNav, el) {
  if (useAcomAssistant) {
    decorateNavWithAssistant(cards, topNav);
    return;
  }

  const bcWrapper = topNav.querySelector('.feds-bc-wrapper');
  const bcGnav = createTag('div', { class: `bc-gnav${hasChatCookie() ? ' has-chat-history' : ''}${isC2() ? 'is-c2' : ''}${isC2Nav() ? ' is-c2-nav' : ''}` });
  const hasNoMobile = el.classList.contains('no-gnav-mobile');
  const gnavButtonSection = createTag('section', { class: `bc-gnav-button${hasNoMobile ? ' no-gnav-mobile' : ''}` });
  const gnavButton = createTag('button', { class: 'gnav-button' }, `${aiIcon('gb-ai-icon', 'gnav-button-icon', 'Ask', 20)}`);

  if (bcWrapper) {
    gnavButtonSection.appendChild(gnavButton);
    bcGnav.appendChild(gnavButtonSection);

    window.addEventListener('bc:side-modal-open', () => {
      if (!bcGnav.classList.contains('has-chat-history')) {
        bcGnav.classList.add('has-chat-history');
      }
    });
    // remove the has-chat-history class if the overlay is closed before chat history is written
    window.addEventListener('bc:side-modal-close', () => {
      if (!hasChatCookie()) {
        bcGnav.classList.remove('has-chat-history');
      }
    });

    bcWrapper.appendChild(bcGnav);
    const gnavInput = decorateInput(bcGnav, input, { handle: handleInput }, 'bcg-');
    const gnavCards = decorateCards(bcGnav, cards, { handle: handleSuggestedPrompt, down: promptDown, up: promptUp }, 'gnav');
    const brandConcierge = { brandConciergeGlobal: true };

    const textarea = document.querySelector('.feds-bc-wrapper textarea');
    textarea.addEventListener('focus', () => {
      stayActive = false;
      gnavActivate(gnavInput, gnavCards);
    });
    textarea.addEventListener('focusout', () => {
      setTimeout(() => {
        gnavDeactivate(gnavInput, gnavCards);
      }, 250);
    });

    gnavButton.addEventListener('click', (event) => {
      // debounce the click to prevent double opening of the modal
      gnavButton.classList.add('active');
      const cleanup = setTimeout(() => {
        gnavButton.classList.remove('active');
        clearTimeout(cleanup);
      }, 500);
      if (document.body.classList.contains('bc-side-open')) {
        const closeButton = document.querySelector('#brand-concierge-side button.dialog-close');
        if (closeButton) {
          closeButton.click();
        } else {
          document.body.classList.remove('bc-side-open');
          handleGnavButton(event);
        }
      } else handleGnavButton(event);
    });
    if (window?.milo) {
      window.milo.brandConcierge = brandConcierge;
    } else {
      const milo = {};
      window.milo = milo;
      window.milo.brandConcierge = brandConcierge;
    }
  }
}

export default function init(el) {
  const acomAssistantParam = new URLSearchParams(window.location.search).get('acom-assistant');
  useAcomAssistant = (acomAssistantParam || getMetadata('acom-assistant')) === 'on';

  handleConsent(el);
  window.addEventListener('adobePrivacy:PrivacyReject', () => handleConsent(el));
  window.addEventListener('adobePrivacy:PrivacyCustom', () => handleConsent(el));
  if (!useAcomAssistant) {
    window.addEventListener('feds:signOut', () => {
      if (!window.adobe?.concierge?.clearHistory) {
        loadWebclient();
      }
      if (window.adobe?.concierge?.clearHistory) {
        if (document.body.classList.contains('bc-side-open')) {
          const closeButton = document.querySelector('#brand-concierge-side button.dialog-close');
          closeButton.click();
        }
        window.adobe.concierge.clearHistory();
      }
    });
  }

  initAnalytics('BC-GNav-shown');

  const rows = el.querySelectorAll(':scope > div');
  const [cards, input] = rows;
  setAuthoredContent(null, cards, input);
  const navCheck = setInterval(() => {
    const topNav = document.querySelector('header.global-navigation nav');
    if (topNav) {
      clearInterval(navCheck);
      decorateGnav(cards, input, topNav, el);
    }
  }, 100);

  rows.forEach((row) => {
    el.removeChild(row);
  });

  if (useAcomAssistant) return;
  window.dispatchEvent(new CustomEvent('bc:ready', { detail: 'brand-concierge-global' }));

  if (!hasChatCookie()) localStorage.setItem('bc-side-overlay', 'closed');
  if (localStorage.getItem('bc-side-overlay') === 'open' && !document.body.classList.contains('bc-side-open') && !isMobile()) {
    sideOverlayTop();
    openSideModal(null, bcBootstrap);
  }
}
