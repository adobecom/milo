import { createTag } from '../../utils/utils.js';
import {
  aiIcon,
  decorateInput,
  decorateCards,
  updateReplicatedValue,
} from '../brand-concierge/bc-utils.js';
import {
  bcBootstrap,
  openSideModal,
  setAuthoredContent,
  susiTestButton,
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
  openSideModal(text, bcBootstrap);
}

function handlePrompt(text, gnavCards, event) {
  const textArea = document.querySelector('.feds-bc-wrapper textarea');
  const gnavInput = document.querySelector('.feds-bc-wrapper .bc-input-field');
  textArea.value = '';
  event.target.blur();
  gnavDeactivate(gnavInput, gnavCards);
  openSideModal(text, bcBootstrap);
}

function handleGnavButton(event) {
  const isOpen = document.body.classList.contains('bc-chat-open');
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
    const gnavCards = decorateCards(bcGnav, cards, { handle: handlePrompt, down: promptDown, up: promptUp }, 'bcg-', 'gnav');

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
    if (localStorage.getItem('bc-side-overlay') === 'open') openSideModal(null, bcBootstrap);
  }
}

export default function init(el) {
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
  susiTestButton(el);

  rows.forEach((row) => {
    el.removeChild(row);
  });
}
