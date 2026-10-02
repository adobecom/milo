import { createTag, getMetadata } from '../../../utils/utils.js';
import { initAnalytics } from './bc-analytics.js';
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
  openSideModal,
  openModal,
  setAuthoredContent,
  mountId,
} from './bc-bootstrap.js';

const variants = {};
let useAcomAssistant = false;
let acomAssistantModulePromise;

async function routeAcomAssistantInput(text, cards) {
  acomAssistantModulePromise ||= import('./acom-assistant-bootstrap.js');
  const { default: acomAssistantRouteInput } = await acomAssistantModulePromise;
  return acomAssistantRouteInput(text, cards);
}

function checkGlobal() {
  let global = false;
  if (window?.milo?.brandConcierge?.brandConciergeGlobal) {
    global = window.milo.brandConcierge.brandConciergeGlobal;
  }
  return global;
}

function routeInput(text, cards) {
  if (useAcomAssistant) {
    routeAcomAssistantInput(text, cards).catch((error) => {
      window.lana?.log?.(`AcomAssistant: failed to open chat (${error.message})`, { tags: 'acom-assistant', severity: 'error' });
    });
    return;
  }
  if (checkGlobal()) {
    const isOpen = document.body.classList.contains('bc-side-open');
    if (isOpen) bcBootstrap(text, mountId);
    else openSideModal(text, bcBootstrap);
  } else {
    openModal(text, bcBootstrap);
  }
}

function handleInput(text, input, cards) {
  const textWrapper = input.querySelector('.bc-textarea-grow-wrap');
  const textArea = input.querySelector('textarea');
  const submitButton = input.querySelector('.input-field-button');
  textArea.value = '';
  updateReplicatedValue(textWrapper, textArea);
  submitButton.disabled = true;
  textArea.blur();

  routeInput(text, cards);
}

function handleSuggestedPrompt(text, event, cards) {
  event.target.blur();
  routeInput(text, cards);
}

function handleFloatingButton(cards) {
  routeInput(null, cards);
}

export default async function init(el) {
  // Reset variant flags so each block decorates independently of any prior init.
  Object.keys(variants).forEach((key) => delete variants[key]);
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

  initAnalytics();

  const rows = el.querySelectorAll(':scope > div');
  const [background, header, cards, input, legal] = rows;
  // Bind handlers to this block's cards so multiple BC blocks don't share prompts.
  const onInput = (text, inputEl) => handleInput(text, inputEl, cards);
  const onPrompt = (text, cardSection, event) => handleSuggestedPrompt(text, event, cards);
  const onFloatingButton = () => handleFloatingButton(cards);

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
    decorateFloatingButton(el, input, onFloatingButton, variants);
  }

  if (variants.isDefault) {
    decorateBackground(el, background);
    decorateHeader(el, header);
    if (variants.inputFirst) {
      decorateInput(el, input, { handle: onInput });
      decorateCards(el, cards, { handle: onPrompt });
    } else {
      decorateCards(el, cards, { handle: onPrompt });
      decorateInput(el, input, { handle: onInput });
    }
    decorateLegal(el, legal);
  }

  if (variants.isHero) {
    decorateBackground(el, background);
    decorateHeader(el, header);
    decorateInput(el, input, { handle: onInput });
    decorateCards(el, cards, { handle: onPrompt });
    decorateLegal(el, legal);
  }

  if (variants.isMarquee) {
    decorateMarqueeBackground(el, background);
    decorateHeader(el, header, { eyebrow: true });
    decorateInput(el, input, { handle: onInput });
    decorateCards(el, cards, { handle: onPrompt }, false);
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
    const floatingInputEvents = { inputHandle: onInput, cardHandle: onPrompt };
    decorateFloatingInput(el, cards, input, floatingInputEvents, variants);
  }

  rows.forEach((row) => {
    el.removeChild(row);
  });
}
