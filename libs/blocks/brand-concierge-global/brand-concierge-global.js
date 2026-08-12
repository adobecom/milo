import { createTag } from '../../utils/utils.js';
import {
  aiIcon,
  decorateInput,
  decorateCards,
  updateReplicatedValue,
  handleConsent,
  setCssGnavHeight,
} from '../brand-concierge/bc-utils.js';
import {
  loadWebclient,
  bcBootstrap,
  openSideModal,
  setAuthoredContent,
} from '../brand-concierge/bc-bootstrap.js';

let stayActive = false;

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
  setCssGnavHeight();
  openSideModal(text, bcBootstrap);
}

function handleSuggestedPrompt(text, gnavCards, event) {
  const gnavInput = document.querySelector('.feds-bc-wrapper .bc-input-field');
  event.target.blur();
  gnavDeactivate(gnavInput, gnavCards);
  setCssGnavHeight();
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

function decorateGnav(cards, input, topNav, el) {
  const bcWrapper = topNav.querySelector('.feds-bc-wrapper');
  const bcGnav = createTag('div', { class: 'bc-gnav' });
  const hasNoMobile = el.classList.contains('no-gnav-mobile');
  const gnavButtonSection = createTag('section', { class: `bc-gnav-button ${hasNoMobile ? ' no-gnav-mobile' : ''}` });
  const gnavButton = createTag('button', { class: 'gnav-button' }, `${aiIcon('gb-ai-icon', 'gnav-button-icon', 'Ask', 20)}`);

  if (bcWrapper) {
    gnavButtonSection.appendChild(gnavButton);
    bcGnav.appendChild(gnavButtonSection);

    bcWrapper.appendChild(bcGnav);
    const gnavInput = decorateInput(bcGnav, input, { handle: handleInput }, 'bcg-');
    const gnavCards = decorateCards(bcGnav, cards, { handle: handleSuggestedPrompt, down: promptDown, up: promptUp }, false, 'gnav');
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
        closeButton.click();
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
  handleConsent(el);
  window.addEventListener('adobePrivacy:PrivacyReject', () => handleConsent(el));
  window.addEventListener('adobePrivacy:PrivacyCustom', () => handleConsent(el));
  window.addEventListener('signIn:decorateNav', async () => {
    await window.adobeIMS?.refreshToken();
    (window.feds?.nav?.reloadUnav ?? window.feds?.nav?.reload)?.();
  });
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

  setCssGnavHeight();

  const rows = el.querySelectorAll(':scope > div');
  const [cards, input] = rows;
  setAuthoredContent(null, cards, input);
  const navCheck = setInterval(() => {
    const topNav = document.querySelector('header.global-navigation nav.feds-topnav');
    if (topNav) {
      clearInterval(navCheck);
      decorateGnav(cards, input, topNav, el);
    }
  }, 100);

  rows.forEach((row) => {
    el.removeChild(row);
  });

  if (localStorage.getItem('bc-side-overlay') === 'open' && !document.body.classList.contains('bc-side-open')) {
    openSideModal(null, bcBootstrap);
  }
}
