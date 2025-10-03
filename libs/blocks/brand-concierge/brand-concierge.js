import { getModal } from '../modal/modal.js';
import { createTag, getConfig } from '../../utils/utils.js';
import chatUIConfig from './chat-ui-config.js';

const cardIcon = '<svg class="card-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.93446 10.5992C7.75946 10.5992 7.58289 10.5539 7.42352 10.4617C7.03836 10.239 6.84383 9.79763 6.93836 9.36325L7.52039 6.66404L5.6657 4.61794C5.36726 4.28825 5.3157 3.80856 5.53836 3.42341C5.76101 3.03748 6.20633 2.84294 6.6368 2.93825L9.33601 3.52028L11.3821 1.6656C11.7126 1.3656 12.1923 1.31638 12.5766 1.53825C12.9618 1.76091 13.1563 2.20232 13.0618 2.63669L12.4798 5.33591L14.3345 7.382C14.6329 7.71091 14.6837 8.1906 14.4618 8.57576C14.2391 8.96013 13.7993 9.15623 13.3641 9.06248L10.6649 8.47889L8.61806 10.3344C8.42509 10.5094 8.18054 10.5992 7.93446 10.5992ZM8.71336 6.82654L8.22977 9.06638L9.92742 7.52732C10.1696 7.30779 10.504 7.21716 10.8251 7.28591L13.0665 7.77028L11.5274 6.07263C11.3071 5.82888 11.2173 5.49216 11.2876 5.17184L11.7704 2.93356L10.0727 4.47263C9.82899 4.69294 9.49306 4.782 9.17196 4.71247L6.93368 4.22965L8.47274 5.92731C8.69305 6.17028 8.7829 6.50623 8.71336 6.82654Z" fill="currentColor"/><path d="M2.67645 14.6017C2.57333 14.6017 2.47021 14.5751 2.37645 14.5212C2.15067 14.3907 2.03505 14.1298 2.08973 13.8751L2.33505 12.7407L1.55536 11.8813C1.38036 11.6884 1.34989 11.404 1.48036 11.1782C1.61083 10.9524 1.87333 10.8399 2.12645 10.8915L3.26083 11.1368L4.12021 10.3571C4.31396 10.1813 4.59677 10.1516 4.82333 10.2821C5.04912 10.4126 5.16474 10.6735 5.11005 10.9282L4.86474 12.0626L5.64443 12.922C5.81943 13.1149 5.8499 13.3993 5.71943 13.6251C5.58896 13.8509 5.32568 13.9618 5.07333 13.9118L3.93896 13.6665L3.07958 14.4462C2.9663 14.5485 2.82177 14.6017 2.67645 14.6017Z" fill="currentColor"/></svg>';
const submitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"></path></svg>';
const closeIcon = '<svg class="close-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.74243 6.99999L11.387 3.35576C11.592 3.15068 11.592 2.81845 11.387 2.61337C11.1819 2.40829 10.8497 2.40829 10.6446 2.61337L7 6.25761L3.35542 2.61337C3.15034 2.40829 2.81812 2.40829 2.61304 2.61337C2.40796 2.81845 2.40796 3.15068 2.61304 3.35576L6.25757 6.99999L2.61304 10.6442C2.40796 10.8493 2.40796 11.1815 2.61304 11.3866C2.71557 11.4891 2.8499 11.5404 2.98423 11.5404C3.11855 11.5404 3.25288 11.4892 3.35542 11.3866L6.99999 7.74238L10.6446 11.3866C10.7471 11.4891 10.8814 11.5404 11.0158 11.5404C11.1501 11.5404 11.2844 11.4892 11.387 11.3866C11.592 11.1815 11.592 10.8493 11.387 10.6442L7.74243 6.99999Z" fill="#292929"/></svg>';

const chatLabelText = 'Ask';
const mountId = 'brand-concierge-mount';
const stickyLegalContent = {};
// ^^ used to dynamically add content to legal for accessibility using aria-live

function getAiChatIcon(maskId, fillId) {
  return `<svg title="${chatLabelText}" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="${maskId}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26">
  <path d="M8.1248 24.6975C7.99531 24.6975 7.86582 24.6721 7.74267 24.62C7.38339 24.4664 7.1498 24.1135 7.1498 23.7225V19.4975H6.1748C3.48721 19.4975 1.2998 17.3101 1.2998 14.6225V7.47247C1.2998 4.78488 3.48721 2.59747 6.1748 2.59747H11.3139C11.8521 2.59747 12.2889 3.0342 12.2889 3.57247C12.2889 4.11075 11.8521 4.54747 11.3139 4.54747H6.1748C4.56251 4.54747 3.2498 5.86017 3.2498 7.47247V14.6225C3.2498 16.2348 4.56251 17.5475 6.1748 17.5475H8.1248C8.66308 17.5475 9.0998 17.9842 9.0998 18.5225V21.4297L12.8487 17.8204C13.0303 17.6452 13.2728 17.5475 13.5254 17.5475H19.8248C21.4371 17.5475 22.7498 16.2348 22.7498 14.6225V12.9696C22.7498 12.4313 23.1865 11.9945 23.7248 11.9945C24.2631 11.9945 24.6998 12.4313 24.6998 12.9696V14.6225C24.6998 17.3101 22.5124 19.4975 19.8248 19.4975H13.9189L8.80147 24.4245C8.61611 24.6035 8.37236 24.6975 8.1248 24.6975Z" fill="#292929"/><path d="M17.2617 11.8079C17.0167 11.8079 16.7704 11.7444 16.5482 11.6162C16.0074 11.3052 15.7332 10.6869 15.8639 10.0775L16.4619 7.31505L14.5639 5.22159C14.145 4.75948 14.0726 4.0879 14.3837 3.54835C14.696 3.0088 15.3206 2.73458 15.9223 2.86407L18.6848 3.46202L20.7783 1.56407C21.2404 1.14639 21.9158 1.0753 22.4515 1.3838C22.9924 1.69484 23.2666 2.31309 23.1358 2.92247L22.5379 5.68497L24.4358 7.77842C24.8548 8.24053 24.9271 8.91211 24.6161 9.45166C24.3038 9.99249 23.6843 10.2692 23.0774 10.1359L20.3149 9.538L18.2215 11.4359C17.9511 11.681 17.6083 11.8079 17.2617 11.8079ZM17.0979 5.11367L18.0856 6.20293C18.3929 6.53808 18.5211 7.01034 18.4246 7.4623L18.1136 8.90196L19.2028 7.91426C19.5392 7.60703 20.0166 7.48008 20.4622 7.5753L21.9018 7.88633L20.9141 6.79708C20.6069 6.46192 20.4787 5.98966 20.5752 5.5377L20.8862 4.09806L19.797 5.08576C19.4618 5.39425 18.987 5.52374 18.5376 5.42472L17.0979 5.11367Z" fill="#292929"/><path d="M10.3125 14.9551C10.1449 14.9551 9.97734 14.912 9.82499 14.8243C9.45809 14.6123 9.2702 14.1883 9.35907 13.7744L9.59012 12.708L8.8576 11.9006C8.57322 11.587 8.5237 11.1249 8.73572 10.758C8.94774 10.3911 9.37429 10.2109 9.78563 10.2921L10.852 10.5232L11.6594 9.79064C11.9743 9.50627 12.4339 9.45675 12.802 9.66877C13.1689 9.88078 13.3568 10.3048 13.2679 10.7187L13.0369 11.7851L13.7694 12.5925C14.0538 12.9061 14.1033 13.3682 13.8913 13.7351C13.6793 14.102 13.2515 14.2861 12.8414 14.201L11.775 13.9699L10.9676 14.7025C10.7835 14.8688 10.5486 14.9551 10.3125 14.9551Z" fill="#292929"/>
  </mask><g mask="url(#${maskId})"><rect width="26" height="26" fill="url(#${fillId}"/></g><defs><linearGradient id="${fillId}" x1="-4.82083" y1="7.8963" x2="35.6711" y2="13.6628" gradientUnits="userSpaceOnUse"><stop offset="0.059183" stop-color="#9A3CF9"/><stop offset="0.344409" stop-color="#E743C8"/><stop offset="0.58317" stop-color="#ED457E"/><stop offset="0.84223" stop-color="#FF7918"/></linearGradient></defs>
  </svg>`;
}

function getBetaLabel() {
  return createTag('span', { class: 'bc-beta-label' }, 'Beta');
}

function getAnalyticsLabel(step) {
  return `Filters|${getConfig()?.brandConciergeAA}|bc#${step}`;
}

function updateModalHeight() {
  const modal = document.getElementById('brand-concierge-modal');
  if (!modal) return;
  const isMobile = window.innerWidth < 768;
  const marginTop = isMobile ? 22 : 32;
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const modalHeight = Math.min(viewportHeight - marginTop, window.innerHeight - marginTop);
  modal.style.height = `${modalHeight}px`;
}

function updateInputHeight(el) {
  const fieldInput = el.querySelector('.bc-input-field textarea');
  if (!fieldInput) return;
  fieldInput.style.height = 'auto';
  fieldInput.style.height = `${fieldInput.scrollHeight}px`;
}

async function openChatModal(initialMessage, el) {
  const innerModal = new DocumentFragment();
  const title = createTag('h1', { class: 'bc-modal-title' }, chatLabelText);
  const header = createTag('div', { class: 'bc-modal-header' }, [title, getBetaLabel()]);
  const mountEl = createTag('div', { id: mountId });
  if (initialMessage) mountEl.dataset.initialMessage = initialMessage;
  innerModal.append(header, mountEl);
  const modal = await getModal(null, {
    id: 'brand-concierge-modal',
    content: innerModal,
  });
  modal.querySelector('.dialog-close').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  document.querySelector('.modal-curtain').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  el.querySelector('.bc-input-field textarea').value = '';
  updateInputHeight(el);
  updateModalHeight();

  // eslint-disable-next-line no-underscore-dangle
  window._satellite?.track('bootstrapConversationalExperience', {
    selector: `#${mountId}`,
    src: 'https://cdn.experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js',
    stylingConfigurations: chatUIConfig,
  });

  const handleViewportResize = () => updateModalHeight();
  const handleOrientationChange = () => setTimeout(updateModalHeight, 100);
  window.visualViewport?.addEventListener('resize', handleViewportResize);
  window.addEventListener('resize', handleViewportResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  const cleanup = () => {
    window.visualViewport?.removeEventListener('resize', handleViewportResize);
    window.removeEventListener('resize', handleViewportResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
  const handleBCModalClose = () => {
    cleanup();
    window.removeEventListener('milo:modal:closed', handleBCModalClose);
  };
  window.addEventListener('milo:modal:closed', handleBCModalClose);
}

function decorateBackground(el, background) {
  const bgValue = background.textContent.trim();
  console.log(background);
  if (bgValue) {
    el.classList.add('has-bg-color');
    el.style.setProperty('--brand-concierge-bg', bgValue);
  } else {
    const bgImage = background.querySelector('img');
    if (bgImage) {
      // remove querystring
      const rawImage = bgImage.src.slice(0, bgImage.src.indexOf('?'));
      el.classList.add('has-bg-image');
      el.style.setProperty('--brand-concierge-bg', `url(${rawImage})`);
    }
  }
  el.removeChild(background);
}

function decorateHeader(el, header) {
  const hTag = header.querySelector('h1, h2, h3, h4, h5, h6');
  const subTitle = header.querySelector('p');
  const headerSection = createTag('section', { class: 'bc-header' });
  hTag.classList.add('bc-header-title');
  headerSection.append(hTag);
  if (subTitle) {
    subTitle.classList.add('bc-header-subtitle');
    headerSection.append(subTitle);
  }
  el.append(headerSection);
  el.removeChild(header);
}

function decorateCards(el, cards) {
  const cardSection = createTag('section', { class: 'bc-prompt-cards' });
  const cardRows = cards.querySelectorAll(':scope > div');
  cardRows.forEach((card) => {
    const cardImage = card.querySelector('picture');
    const cardText = createTag('div', { class: 'prompt-card-text' }, `${cardIcon} <p>${card.textContent.trim()}</p>`);
    const cardButton = createTag('button', {
      class: 'prompt-card-button no-track',
      'daa-ll': getAnalyticsLabel('1'),
      'aria-label': cardText.textContent.trim(),
    });
    if (cardImage) {
      cardButton.append(cardImage);
      cardImage.classList.add('prompt-card-image');
    }
    if (card.textContent !== '') cardButton.append(cardText);
    cardSection.append(cardButton);

    cardButton.addEventListener('click', () => {
      const input = el.querySelector('.bc-input-field textarea');

      input.value = cardText.textContent.trim();
      openChatModal(input.value, el);
    });
  });

  el.append(cardSection);
  el.removeChild(cards);
}

function decorateInput(el, input) {
  const fieldSection = createTag('section', { class: 'bc-input-field' });
  const fieldLabel = createTag('label', {
    for: 'bc-input-field',
    class: 'bc-input-field-label',
    'aria-describedby': 'bc-label-tooltip',
    tabindex: 0,
  }, `${getAiChatIcon('bc-label-mask', 'bc-label-fill')}`);
  const fieldLabelToolTip = createTag('div', { id: 'bc-label-tooltip', class: 'bc-input-tooltip', role: 'tooltip' }, chatLabelText);
  fieldLabel.append(fieldLabelToolTip);
  const fieldInput = createTag('textarea', {
    id: 'bc-input-field',
    rows: 1,
    placeholder: input.textContent.trim(),
  });
  const fieldButton = createTag('button', {
    class: 'input-field-button no-track',
    disabled: true,
    'aria-label': 'Send Message',
    'daa-ll': getAnalyticsLabel('1'),
  }, submitIcon);
  const fieldContainer = createTag('div', { class: 'bc-input-field-container' }, [fieldLabel, fieldLabelToolTip, fieldInput, fieldButton]);
  fieldSection.append(fieldContainer);
  el.append(fieldSection);
  el.removeChild(input);

  fieldInput.addEventListener('input', () => {
    if (fieldInput.value && fieldInput.value.trim() !== '') {
      fieldButton.disabled = false;
    } else {
      fieldButton.disabled = true;
    }
    updateInputHeight(el);
  });

  if (el.classList.contains('sticky')) {
    const mobileButton = createTag('button', { class: 'bc-mobile-button' }, `${getAiChatIcon('bc-mobile-mask', 'bc-mobile-fill')}`);
    const mainElement = document.querySelector('main');
    const gnavElement = document.querySelector('header.global-navigation');
    const handleScroll = () => {
      const mainHeight = mainElement.scrollHeight;
      const gnavHeight = gnavElement.offsetHeight;
      const threshold = (window.scrollY + window.innerHeight - gnavHeight);
      if (threshold > mainHeight) {
        el.style.bottom = `${threshold - mainHeight}px`;
      } else {
        el.style.bottom = '0';
      }
    };
    fieldContainer.prepend(mobileButton);
    mobileButton.addEventListener('click', () => {
      openChatModal(null, el);
    });

    fieldInput.addEventListener('focus', () => {
      const bcLegal = el.querySelector('.bc-legal');
      if (stickyLegalContent.legalSection && !bcLegal.classList.contains('legal-shown')) {
        // this timeout is necessary for screenreaders to properly register updates to aria-live
        setTimeout(() => {
          stickyLegalContent.legalSection.append(
            stickyLegalContent.headerContainer,
            stickyLegalContent.legalCopy,
            stickyLegalContent.closeButton,
          );
        }, 100);
      }
      bcLegal.classList.add('legal-shown');
    });
    // used to prevent the block from going over the global footer.
    window.addEventListener('scroll', handleScroll);
  }

  fieldInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      if (!fieldInput.value || fieldInput.value.trim() === '') return;
      fieldButton.click();
    }
  });

  fieldButton.addEventListener('click', () => {
    if (!fieldInput.value || fieldInput.value.trim() === '') return;
    openChatModal(fieldInput.value, el);
  });
}

function decorateLegal(el, legal) {
  const legalSection = createTag('section', { class: 'bc-legal' });
  const hTag = legal.querySelector('h1, h2, h3, h4, h5, h6');
  const legalCopy = legal.querySelector('p');
  if (el.classList.contains('sticky')) {
    legalSection.setAttribute('aria-live', 'polite');
    const closeButton = createTag('button', { class: 'bc-legal-close', 'aria-label': 'Close' }, closeIcon);
    stickyLegalContent.closeButton = closeButton;
    closeButton.addEventListener('click', () => {
      legalSection.classList.add('legal-closed');
      el.querySelector('.bc-input-field textarea').focus();
    });
  }
  if (hTag && legalCopy) {
    const hTagTagname = hTag.tagName;
    const headerContainer = createTag(hTagTagname, { class: 'bc-legal-header' }, [hTag.textContent, getBetaLabel()]);
    if (el.classList.contains('sticky')) {
      stickyLegalContent.legalSection = legalSection;
      stickyLegalContent.headerContainer = headerContainer;
      stickyLegalContent.legalCopy = legalCopy;
    } else {
      legalSection.append(headerContainer, legalCopy);
    }
  } else {
    const legalContent = createTag('p', {}, legal.querySelector('div').innerHTML);
    legalSection.append(legalContent);
  }
  el.append(legalSection);
  el.removeChild(legal);
}

function handleConsent(el) {
  if (!window.adobePrivacy) return;
  const cookieGrp = window.adobePrivacy.activeCookieGroups();
  if (!cookieGrp?.includes('C0002')) {
    el.classList.add('hide-block');
    window.lana?.log('Block hidden because user has not consented to cookies', { tags: 'brand-concierge' });
  }
}

export default async function init(el) {
  handleConsent(el);
  window.addEventListener('adobePrivacy:PrivacyReject', () => handleConsent(el));
  window.addEventListener('adobePrivacy:PrivacyCustom', () => handleConsent(el));

  const rows = el.querySelectorAll(':scope > div');
  let isDefault = false;
  let fieldFirst = false;
  let isSticky = false;
  let isHero = false;

  // set variant
  if (!el.classList.contains('sticky') && !el.classList.contains('hero')) {
    el.classList.add('inline');
    isDefault = true;
  } else if (el.classList.contains('hero')) {
    el.classList.add('hero');
    isHero = true;
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

  if (isHero) {
    const [background, header, cards, input, legal] = rows;
    decorateBackground(el, background);
    decorateHeader(el, header);
    decorateInput(el, input);
    decorateCards(el, cards);
    decorateLegal(el, legal);
  }

  if (isSticky) {
    const [input, legal] = rows;
    decorateLegal(el, legal);
    decorateInput(el, input);
  }

  // Make sure input height is updated when placeholder text is visible
  const section = el.closest('.section');
  if (!section) return;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'attributes'
        || mutation.attributeName !== 'data-status'
        || section.getAttribute('data-status') === 'decorated') return;
      const fieldInput = el.querySelector('.bc-input-field textarea');
      if (fieldInput) {
        updateInputHeight(el);
        observer.disconnect();
      }
    });
  });

  observer.observe(section, {
    attributes: true,
    attributeFilter: ['data-status'],
  });
}
