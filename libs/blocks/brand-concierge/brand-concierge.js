import { createTag, getConfig } from '../../utils/utils.js';
import { getModal } from '../modal/modal.js';

function initModal(el, button) {
  button.addEventListener('click', () => {
    const mountEl = document.createElement('div');
    mountEl.id = 'brand-concierge-mount';
    getModal(null, {
      id: 'brand-concierge-modal',
      content: mountEl,
      closeEvent: 'closeModal', // Megan TODO: Fix this
    });

    // Temporary way to load chat from stage
    const devScript = document.createElement('script');
    devScript.src = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/dev.js';
    devScript.async = true;
    document.head.appendChild(devScript);

    // const devCss = document.createElement('link');
    // devCss.rel = 'stylesheet';
    // devCss.href = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/dev.css';
    // document.head.appendChild(devCss);

    const mainScript = document.createElement('script');
    mainScript.src = 'https://cdn.experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
    mainScript.async = true;
    document.head.appendChild(mainScript);
  });
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

    cardButton.addEventListener('click', () => {
      const input = el.querySelector('input.input-field-input');
      input.value = cardText.textContent.trim();
      el.querySelector('button.input-field-button').click();
    });
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
  initModal(el, el.querySelector('button.input-field-button'));
}
