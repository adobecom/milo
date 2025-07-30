import { getModal } from '../modal/modal.js';
import { createTag } from '../../utils/utils.js';

function openChatModal(initialMessage) {
  const mountEl = createTag('div', { id: 'brand-concierge-mount' });
  if (initialMessage) mountEl.dataset.initialMessage = initialMessage;
  getModal(null, {
    id: 'brand-concierge-modal',
    content: mountEl,
    closeEvent: 'closeModal',
  });

  // Temporary way to load chat from stage
  window.addEventListener('adobe-brand-concierge-prompt-loaded', () => {
    const instanceEvent = new CustomEvent('alloy-brand-concierge-instance', {
      detail: {
        instanceName: 'mockAlloyInstance',
        contentUrl: '/libs/blocks/brand-concierge/chat-ui-config.json',
      },
    });
    window.dispatchEvent(instanceEvent);
  });
  const mainScriptSrc = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
  document.querySelector(`script[src="${mainScriptSrc}"]`)?.remove();
  const mainScript = document.createElement('script');
  mainScript.src = mainScriptSrc;
  mainScript.async = true;
  document.head.appendChild(mainScript);
}

function decorateBackground(el, background) {
  const bgValue = background.textContent.trim();
  if (bgValue) {
    el.style.setProperty('--brand-concierge-bg', bgValue);
  }
  el.removeChild(background);
}

function decorateHeader(el, header) {
  const hTag = header.querySelector('h1, h2, h3, h4, h5, h6');
  const subhead = header.querySelector('p');
  const headerSection = createTag('section', { class: 'header' });
  headerSection.append(hTag, subhead);
  el.append(headerSection);
  el.removeChild(header);
}

function decorateCards(el, cards) {
  const cardSection = createTag('section', { class: 'prompt-cards' });
  const cardRows = cards.querySelectorAll(':scope > div');
  cardRows.forEach((card) => {
    const cardImage = card.querySelector('picture');
    const cardText = createTag('p', { class: 'prompt-card-text' }, card.textContent.trim());
    const cardButton = createTag('button', { class: 'prompt-card-button' });
    if (cardImage) cardButton.append(cardImage); cardImage.classList.add('prompt-card-image');
    if (cardText) cardButton.append(cardText);
    cardSection.append(cardButton);

    cardButton.addEventListener('click', () => openChatModal(cardText.textContent.trim()));
  });

  el.append(cardSection);
  el.removeChild(cards);
}

function decorateInput(el, input) {
  const fieldSection = createTag('section', { class: 'input-field' });
  const fieldInput = createTag('input', { type: 'text', class: 'input-field-input', placeholder: input.textContent.trim() });
  const fieldButton = createTag('button', { class: 'input-field-button' }, 'Submit');
  fieldSection.append(fieldInput, fieldButton);
  el.append(fieldSection);
  el.removeChild(input);
  fieldButton.addEventListener('click', () => {
    if (!fieldInput.value) return;
    openChatModal(fieldInput.value);
  });
}

function decorateLegal(el, legal) {
  const legalSection = createTag('section', { class: 'legal' });
  legalSection.append(legal.textContent.trim());
  el.append(legalSection);
  el.removeChild(legal);
}

export default async function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  let isDefault = false;
  let isSticky = false;
  let fieldFirst = false;

  // set variant
  if (!el.classList.contains('sticky')) {
    el.classList.add('inline');
    isDefault = true;
  } else if (el.classList.contains('sticky')) {
    el.classList.add('sticky');
    isSticky = true;
  }
  if (el.classList.contains('field-first')) {
    fieldFirst = true;
  }

  if (isDefault) {
    const [background, header, cards, input, legal] = rows;
    decorateBackground(el, background);
    decorateHeader(el, header);
    if (fieldFirst) {
      decorateInput(el, input);
      decorateCards(el, cards);
    } else {
      decorateCards(el, cards);
      decorateInput(el, input);
    }
    decorateLegal(el, legal);
  }
}
