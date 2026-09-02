import { createTag } from '../../../utils/utils.js';
import {
  decorateBackground,
  decorateMarqueeBackground,
  decorateHeader,
  decorateInput,
  decorateCards,
  decorateLegal,
  decorateFloatingButton,
  decorateFloatingInput,
  updateReplicatedValue,
  handleConsent,
} from './bc-utils.js';
import {
  loadWebclient,
  bcBootstrap,
  openModal,
  setAuthoredContent,
  mountId,
} from './bc-bootstrap.js';
import initChatPanel, {
  openChatPanel,
  closeChatPanel,
  isChatPanelOpen,
} from '../../../features/chat-panel/chat-panel.js';

const variants = {};

function checkGlobal() {
  let global = false;
  if (window?.milo?.brandConcierge?.brandConciergeGlobal) {
    global = window.milo.brandConcierge.brandConciergeGlobal;
  }
  return global;
}

function routeInput(text) {
  if (checkGlobal()) {
    if (isChatPanelOpen()) bcBootstrap(text, mountId);
    else openChatPanel(text);
  } else {
    openModal(text, bcBootstrap);
  }
}

function handleInput(text, input) {
  const textWrapper = input.querySelector('.bc-textarea-grow-wrap');
  const textArea = input.querySelector('textarea');
  const submitButton = input.querySelector('.input-field-button');
  textArea.value = '';
  updateReplicatedValue(textWrapper, textArea);
  submitButton.disabled = true;
  textArea.blur();

  routeInput(text);
}

function handleSuggestedPrompt(text, cards, event) {
  event.target.blur();
  routeInput(text);
}

function handleFloatingButton() {
  routeInput(null);
}

export default async function init(el) {
  // Reset variant flags so each block decorates independently of any prior init.
  Object.keys(variants).forEach((key) => delete variants[key]);

  handleConsent(el);
  window.addEventListener('adobePrivacy:PrivacyReject', () => handleConsent(el));
  window.addEventListener('adobePrivacy:PrivacyCustom', () => handleConsent(el));
  window.addEventListener('feds:signOut', () => {
    if (!window.adobe?.concierge?.clearHistory) {
      loadWebclient();
    }
    if (window.adobe?.concierge?.clearHistory) {
      if (isChatPanelOpen()) closeChatPanel();
      window.adobe.concierge.clearHistory();
    }
  });

  // Build the chat-panel DOM once so gnav / floating-button / input triggers
  // can open it. Idempotent — safe to call from multiple BC block instances.
  initChatPanel();

  const rows = el.querySelectorAll(':scope > div');
  const [background, header, cards, input, legal] = rows;

  setAuthoredContent(header, cards, input);

  // set variant
  if (el.classList.contains('marquee')) {
    variants.isMarquee = true;
  } else if (!el.classList.contains('hero')
    && !el.classList.contains('floating-button-only')
    && !el.classList.contains('floating-input-only')) {
    el.classList.add('inline');
    variants.isDefault = true;
  } else if (el.classList.contains('hero')) {
    el.classList.add('hero');
    variants.isHero = true;
  }
  if (el.classList.contains('input-first')) {
    variants.inputFirst = true;
  }
  if (el.classList.contains('floating-button')) {
    variants.isFloatingButton = true;
  }
  if (el.classList.contains('floating-button-only')) {
    variants.isFloatingButtonOnly = true;
    variants.isFloatingButton = false;
  }

  if (el.classList.contains('floating-anchor-hide')) {
    variants.isFloatingAnchorHide = true;
  }

  el.classList.forEach((classItem) => {
    if (classItem.includes('floating-delay')) {
      variants.floatingDelay = true;
      variants.floatingDelayAmount = parseFloat(classItem.match(/\w+/g)[2]);
    }
    if (classItem.includes('floating-anchor-delay')) {
      variants.floatingAnchorDelay = true;
      variants.floatingAnchorDelayAmount = parseFloat(classItem.match(/\w+/g)[3]);
    }
  });

  if (el.classList.contains('floating-input')) {
    variants.isFloatingInput = true;
  }
  if (el.classList.contains('floating-input-only')) {
    variants.isFloatingInputOnly = true;
    variants.isFloatingInput = false;
  }

  if (variants.isFloatingButton || variants.isFloatingButtonOnly) {
    decorateFloatingButton(el, input, handleFloatingButton, variants);
  }

  if (variants.isDefault) {
    decorateBackground(el, background);
    decorateHeader(el, header);
    if (variants.inputFirst) {
      decorateInput(el, input, { handle: handleInput });
      decorateCards(el, cards, { handle: handleSuggestedPrompt });
    } else {
      decorateCards(el, cards, { handle: handleSuggestedPrompt });
      decorateInput(el, input, { handle: handleInput });
    }
    decorateLegal(el, legal);
  }

  if (variants.isHero) {
    decorateBackground(el, background);
    decorateHeader(el, header);
    decorateInput(el, input, { handle: handleInput });
    decorateCards(el, cards, { handle: handleSuggestedPrompt });
    decorateLegal(el, legal);
  }

  if (variants.isMarquee) {
    decorateMarqueeBackground(el, background);
    decorateHeader(el, header, { eyebrow: true });
    decorateInput(el, input, { handle: handleInput });
    decorateCards(el, cards, { handle: handleSuggestedPrompt }, false);
    decorateLegal(el, legal);

    const foreground = createTag('div', { class: 'foreground container' });
    foreground.append(
      el.querySelector('.bc-header'),
      el.querySelector('.bc-input-field'),
      el.querySelector('.bc-prompt-cards'),
      el.querySelector('.bc-legal'),
    );
    el.append(foreground);
  }

  if (variants.isFloatingInput || variants.isFloatingInputOnly) {
    const floatingInputEvents = { inputHandle: handleInput, cardHandle: handleSuggestedPrompt };
    decorateFloatingInput(el, cards, input, floatingInputEvents, variants);
  }

  rows.forEach((row) => {
    el.removeChild(row);
  });
}
