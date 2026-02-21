import { getModal, closeModal } from '../modal/modal.js';
import { createTag, getConfig, loadScript } from '../../utils/utils.js';
import chatUIConfig from './chat-ui-config.js';

const cardIcon = '<svg class="card-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.93446 10.5992C7.75946 10.5992 7.58289 10.5539 7.42352 10.4617C7.03836 10.239 6.84383 9.79763 6.93836 9.36325L7.52039 6.66404L5.6657 4.61794C5.36726 4.28825 5.3157 3.80856 5.53836 3.42341C5.76101 3.03748 6.20633 2.84294 6.6368 2.93825L9.33601 3.52028L11.3821 1.6656C11.7126 1.3656 12.1923 1.31638 12.5766 1.53825C12.9618 1.76091 13.1563 2.20232 13.0618 2.63669L12.4798 5.33591L14.3345 7.382C14.6329 7.71091 14.6837 8.1906 14.4618 8.57576C14.2391 8.96013 13.7993 9.15623 13.3641 9.06248L10.6649 8.47889L8.61806 10.3344C8.42509 10.5094 8.18054 10.5992 7.93446 10.5992ZM8.71336 6.82654L8.22977 9.06638L9.92742 7.52732C10.1696 7.30779 10.504 7.21716 10.8251 7.28591L13.0665 7.77028L11.5274 6.07263C11.3071 5.82888 11.2173 5.49216 11.2876 5.17184L11.7704 2.93356L10.0727 4.47263C9.82899 4.69294 9.49306 4.782 9.17196 4.71247L6.93368 4.22965L8.47274 5.92731C8.69305 6.17028 8.7829 6.50623 8.71336 6.82654Z" fill="currentColor"/><path d="M2.67645 14.6017C2.57333 14.6017 2.47021 14.5751 2.37645 14.5212C2.15067 14.3907 2.03505 14.1298 2.08973 13.8751L2.33505 12.7407L1.55536 11.8813C1.38036 11.6884 1.34989 11.404 1.48036 11.1782C1.61083 10.9524 1.87333 10.8399 2.12645 10.8915L3.26083 11.1368L4.12021 10.3571C4.31396 10.1813 4.59677 10.1516 4.82333 10.2821C5.04912 10.4126 5.16474 10.6735 5.11005 10.9282L4.86474 12.0626L5.64443 12.922C5.81943 13.1149 5.8499 13.3993 5.71943 13.6251C5.58896 13.8509 5.32568 13.9618 5.07333 13.9118L3.93896 13.6665L3.07958 14.4462C2.9663 14.5485 2.82177 14.6017 2.67645 14.6017Z" fill="currentColor"/></svg>';
const submitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"></path></svg>';
const aiChatIcon = '<svg title="Ask" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.25 18.998C6.15039 18.998 6.05078 18.9785 5.95605 18.9385C5.67968 18.8203 5.5 18.5488 5.5 18.248V14.998H4.75C2.68262 14.998 1 13.3154 1 11.248V5.74805C1 3.68067 2.68262 1.99805 4.75 1.99805H8.70312C9.11718 1.99805 9.45312 2.33399 9.45312 2.74805C9.45312 3.16211 9.11718 3.49805 8.70312 3.49805H4.75C3.50977 3.49805 2.5 4.50782 2.5 5.74805V11.248C2.5 12.4883 3.50977 13.498 4.75 13.498H6.25C6.66406 13.498 7 13.834 7 14.248V16.4844L9.88379 13.708C10.0234 13.5732 10.21 13.498 10.4043 13.498H15.25C16.4902 13.498 17.5 12.4883 17.5 11.248V9.97657C17.5 9.56251 17.8359 9.22657 18.25 9.22657C18.6641 9.22657 19 9.56251 19 9.97657V11.248C19 13.3154 17.3174 14.998 15.25 14.998H10.707L6.77051 18.7881C6.62793 18.9258 6.44043 18.998 6.25 18.998Z" fill="currentColor"/><path d="M13.2774 9.08292C13.0889 9.08292 12.8995 9.03409 12.7286 8.93546C12.3126 8.6962 12.1016 8.22062 12.2022 7.75187L12.6622 5.62687L11.2022 4.01652C10.8799 3.66105 10.8243 3.14445 11.0635 2.72941C11.3038 2.31437 11.7842 2.10343 12.2471 2.20304L14.3721 2.663L15.9825 1.20304C16.338 0.881747 16.8575 0.827057 17.2696 1.06437C17.6856 1.30363 17.8965 1.77921 17.796 2.24796L17.336 4.37296L18.796 5.98331C19.1182 6.33878 19.1739 6.85538 18.9346 7.27042C18.6944 7.68644 18.2178 7.89933 17.751 7.79679L15.626 7.33683L14.0157 8.79679C13.8077 8.98527 13.544 9.08292 13.2774 9.08292ZM13.1514 3.9335L13.9112 4.77139C14.1475 5.0292 14.2462 5.39248 14.1719 5.74014L13.9327 6.84757L14.7706 6.0878C15.0294 5.85147 15.3966 5.75382 15.7393 5.82706L16.8467 6.06632L16.087 5.22843C15.8506 4.97062 15.752 4.60734 15.8262 4.25968L16.0655 3.15226L15.2276 3.91203C14.9698 4.14933 14.6046 4.24894 14.2589 4.17277L13.1514 3.9335Z" fill="currentColor"/><path d="M7.93261 11.5039C7.8037 11.5039 7.6748 11.4707 7.55761 11.4033C7.27538 11.2402 7.13085 10.9141 7.19921 10.5957L7.37694 9.77538L6.81346 9.15429C6.59471 8.91308 6.55662 8.55761 6.71971 8.27538C6.8828 7.99315 7.21092 7.85448 7.52733 7.91698L8.34764 8.09471L8.96873 7.53123C9.21092 7.31248 9.56443 7.27439 9.84764 7.43748C10.1299 7.60057 10.2744 7.92674 10.206 8.2451L10.0283 9.06541L10.5918 9.6865C10.8105 9.92771 10.8486 10.2832 10.6855 10.5654C10.5225 10.8476 10.1933 10.9892 9.87792 10.9238L9.05761 10.7461L8.43652 11.3096C8.29492 11.4375 8.11425 11.5039 7.93261 11.5039Z" fill="currentColor"/></svg>';

const chatLabelText = 'Ask';
const floatingButtonText = 'Ask a question';
const mountId = 'brand-concierge-mount';
const animationMs = 500;

const authoredContent = {};
const variants = {};

function getBetaLabel() {
  return createTag('span', { class: 'bc-beta-label' }, 'Beta');
}

function getAnalyticsLabel(step) {
  return `Filters|${getConfig()?.brandConciergeAA ? getConfig()?.brandConciergeAA : 'app-reco'}|bc#${step}`;
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

export function updateReplicatedValue(textareaWrapper, textarea) {
  if (!textareaWrapper || !textarea) return;
  textareaWrapper.dataset.replicatedValue = textarea.value || textarea.placeholder;
}

export function getUpdatedChatUIConfig() {
  if (authoredContent.header) chatUIConfig.text['welcome.heading'] = authoredContent.header.title;
  if (authoredContent.header.subTitle) chatUIConfig.text['welcome.subheading'] = authoredContent.header.subTitle;
  if (authoredContent.cards) chatUIConfig.arrays['welcome.examples'] = authoredContent.cards;
  if (authoredContent.input) chatUIConfig.text['input.placeholder'] = authoredContent.input;
  return chatUIConfig;
}

function waitForCondition(checkFn, timeout = 5000, interval = 100) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const check = () => {
      if (checkFn()) {
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        resolve(false);
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
}

/**
 * Creates the SUSI Light component for the sign-in modal.
 * Aligns with Nest (Repos/nest) SentryWrapper: popup=true, response_type=token,
 * close modal on 'redirect' (onCloseRedirect) and on 'on-token' (onSuccessfulToken).
 */
function createSusiComponentForModal({
  authParams, config, variant, redirectUrl, isStage, popup, onCloseRedirect, onSuccessfulToken,
}) {
  const susi = createTag('susi-sentry-light');
  susi.authParams = {
    ...authParams,
    redirect_uri: redirectUrl,
  };
  susi.config = config;
  susi.variant = variant;
  susi.popup = !!popup;
  if (isStage) susi.stage = 'true';

  const onRedirect = (e) => {
    if (popup && typeof onCloseRedirect === 'function') {
      onCloseRedirect();
    } else if (!popup) {
      window.location.assign(e.detail);
    }
  };
  const onError = (e) => { window.lana?.log('SUSI Light error:', e); };
  const onAnalytics = () => { /* TODO: send analytics from e.detail (type, event, client_id) */ };
  const onAuthFailed = () => { /* TODO: handle auth failed (e.detail) */ };

  susi.addEventListener('redirect', onRedirect);
  susi.addEventListener('on-error', onError);
  susi.addEventListener('on-analytics', onAnalytics);
  if (onSuccessfulToken) {
    susi.addEventListener('on-token', onSuccessfulToken);
  }
  susi.addEventListener('on-auth-failed', onAuthFailed);
  return susi;
}

async function openSusiLightModal() {
  const config = getConfig();
  const { env, locale, imsClientId } = config || {};
  const isStage = env?.name !== 'prod';
  const redirectUrl = window.location.href;
  const clientId = imsClientId;
  const localeIetf = (locale?.ietf || 'en-US').toLowerCase();

  const CDN_URL = `https://auth-light.identity${isStage ? '-stage' : ''}.adobe.com/sentry/wrapper.js`;
  await loadScript(CDN_URL);

  const SUSI_MODAL_ID = 'bc-susi-modal';
  const closeSusiModal = () => {
    const modal = document.getElementById(SUSI_MODAL_ID);
    if (modal) closeModal(modal);
  };
  const authParams = {
    dt: false,
    locale: localeIetf,
    response_type: 'token',
    client_id: clientId,
    scope: 'AdobeID,openid',
  };
  const susiConfig = { consentProfile: 'free', fullWidth: true };
  const onSuccessfulToken = ({ detail }) => {
    closeSusiModal();
    const token = detail;
    console.log('SUSI Light: on-token (successful auth), token received', token);
    // ToDo: Do something with the token - need info from Nina
  };
  const susiEl = createSusiComponentForModal({
    authParams,
    config: susiConfig,
    variant: 'standard',
    redirectUrl,
    isStage,
    popup: true,
    onCloseRedirect: closeSusiModal,
    onSuccessfulToken,
  });
  const wrapper = createTag('div', { class: 'bc-susi-modal-content' }, susiEl);
  const title = createTag('h2', { class: 'bc-susi-modal-title' }, 'Sign in');
  const fragment = new DocumentFragment();
  fragment.append(title, wrapper);
  await getModal(null, {
    id: SUSI_MODAL_ID,
    class: 'bc-susi-modal',
    content: fragment,
  });
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
    closeCallback: async () => {
      modal.classList.add('closing');
      await new Promise((resolve) => {
        setTimeout(() => resolve(), animationMs);
      });
    },
  });
  modal.querySelector('.dialog-close').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  document.querySelector('.modal-curtain').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  updateModalHeight();
  const textareaWrapper = el.querySelector('.bc-textarea-grow-wrap');
  const textarea = el.querySelector('.bc-input-field textarea');
  const submitButton = el.querySelector('.input-field-button');
  if (textareaWrapper && textarea && submitButton) {
    textarea.value = '';
    submitButton.disabled = true;
    updateReplicatedValue(textareaWrapper, textarea);
  }

  mountEl.addEventListener('bc:cta-action', ({ detail }) => {
    console.log('bc:cta-action', detail);
    if (detail?.action === 'sign-in') {
      openSusiLightModal();
    }
  });

  // eslint-disable-next-line no-underscore-dangle
  const alloyVersion = window.alloy_all?.data?._adobe_corpnew?.digitalData?.page?.libraryVersions;
  const useNewBootstrapAPI = alloyVersion === '2.31.0';

  if (useNewBootstrapAPI) {
    // New method: Load script and use bootstrap API
    const { env } = getConfig();
    const base = env.name === 'prod' ? 'experience.adobe.net' : 'experience-stage.adobe.net';
    const src = `https://${base}/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js`;
    await loadScript(src);

    const urlParams = new URLSearchParams(window.location.search);
    const testParam = urlParams.get('test');
    const useTestInstance = env.name !== 'prod' && (testParam === 'cts' || testParam === 'cjm');
    const instanceName = useTestInstance ? 'alloy2' : 'alloy';
    const bootstrapAPIReady = await waitForCondition(() => !!window.adobe?.concierge?.bootstrap);

    if (bootstrapAPIReady) {
      window.adobe.concierge.bootstrap({
        instanceName,
        stylingConfigurations: getUpdatedChatUIConfig(),
        selector: `#${mountId}`,
      });
    } else {
      window.lana?.log('Brand Concierge: bootstrap API not available', { tags: 'brand-concierge', severity: 'critical' });
    }
  } else {
    // Legacy method: Use _satellite.track
    // eslint-disable-next-line no-underscore-dangle
    window._satellite?.track('bootstrapConversationalExperience', {
      selector: `#${mountId}`,
      src: 'https://cdn.experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js',
      stylingConfigurations: getUpdatedChatUIConfig(),
    });
  }

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

// sets values that will be used to overwrite json config values before invoking chat
function setAuthoredContent(rows) {
  const [, header, cards, input] = rows;
  if (header) {
    const title = header.querySelector('h1, h2, h3, h4, h5, h6');
    const subTitle = header.querySelector('p');
    authoredContent.header = {};
    if (title) authoredContent.header.title = title.textContent.trim();
    if (subTitle) authoredContent.header.subTitle = subTitle.textContent.trim();
    if (!title && !subTitle) {
      authoredContent.header.title = header.textContent.trim();
    }
  }
  if (cards) {
    authoredContent.cards = [];
    const cardRows = cards.querySelectorAll(':scope > div');
    cardRows.forEach((card) => {
      const cardText = card.textContent.trim();
      authoredContent.cards.push({ text: cardText });
    });
  }
  if (input) {
    authoredContent.input = input.textContent.trim();
  }
}

function decorateBackground(el, background) {
  const bgValue = background.textContent.trim();
  if (bgValue) {
    el.classList.add('has-bg-color');
    el.style.setProperty('--brand-concierge-bg', bgValue);
  } else {
    const bgImage = background.querySelector('img');
    if (bgImage) {
      // remove query string to prevent blurry images.
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
  if (hTag) {
    hTag.classList.add('bc-header-title');
    headerSection.append(hTag);
  }
  if (subTitle) {
    subTitle.classList.add('bc-header-subtitle');
    headerSection.append(subTitle);
  }
  if (!hTag && !subTitle) {
    headerSection.append(createTag('p', { class: 'bc-header-subtitle' }, header.textContent.trim()));
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
  }, `${aiChatIcon}`);
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
  const textareaWrapper = createTag('div', { class: 'bc-textarea-grow-wrap' }, fieldInput);
  const fieldContainer = createTag('div', { class: 'bc-input-field-container' }, [fieldLabel, fieldLabelToolTip, textareaWrapper, fieldButton]);
  fieldSection.append(fieldContainer);
  el.append(fieldSection);
  el.removeChild(input);
  updateReplicatedValue(textareaWrapper, fieldInput);

  fieldInput.addEventListener('input', () => {
    if (fieldInput.value && fieldInput.value.trim() !== '') {
      fieldButton.disabled = false;
    } else {
      fieldButton.disabled = true;
    }
    updateReplicatedValue(textareaWrapper, fieldInput);
  });

  fieldInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (!fieldInput.value || fieldInput.value.trim() === '') e.preventDefault();
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
  const legalContent = createTag('p', {}, legal.querySelector('div').innerHTML);
  legalSection.append(legalContent);
  el.append(legalSection);
  el.removeChild(legal);
}

function decorateFloatingButton(el) {
  const floatingButton = createTag('section', { class: 'bc-floating-button' });
  const floatingIcon = createTag('div', { class: 'bc-floating-icon' }, aiChatIcon);
  const floatingInput = createTag('div', { class: 'bc-floating-input' }, floatingButtonText);
  const floatingSubmit = createTag('div', { class: 'bc-floating-submit' }, submitIcon);

  const floatingContainer = createTag('div', { class: 'bc-floating-button-container' }, [floatingIcon, floatingInput, floatingSubmit]);
  floatingButton.append(floatingContainer);
  el.append(floatingButton);

  if (variants.isHero) {
    floatingButton.classList.add('floating-hidden');
  }

  const mainElement = document.querySelector('main');
  const gnavElement = document.querySelector('header.global-navigation');
  const handleScroll = (target) => {
    const mainHeight = mainElement.scrollHeight;
    const gnavHeight = gnavElement.offsetHeight;
    const threshold = (window.scrollY + window.innerHeight - gnavHeight);
    const targetStyle = window.getComputedStyle(target);
    const targetHeight = target.scrollHeight + (parseFloat(targetStyle.marginBottom) * 2);
    if (threshold > mainHeight) {
      target.style.bottom = `${threshold - mainHeight}px`;
      mainElement.style.paddingBottom = `${targetHeight}px`;
    } else {
      target.style.bottom = '0';
    }
    if (variants.isHero) {
      if (window.scrollY > el.scrollHeight) {
        floatingButton.classList.remove('floating-hidden');
        floatingButton.classList.add('floating-show');
      } else {
        floatingButton.classList.add('floating-hidden');
        floatingButton.classList.remove('floating-show');
      }
    }
  };

  floatingButton.addEventListener('click', () => {
    openChatModal(null, el);
  });

  window.addEventListener('scroll', () => handleScroll(floatingButton));
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

  setAuthoredContent(rows);

  // set variant
  if (!el.classList.contains('hero')
  && !el.classList.contains('floating-button-only')) {
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
  } else if (el.classList.contains('floating-button-only')) {
    variants.isFloatingButtonOnly = true;
  }

  if (variants.isDefault) {
    const [background, header, cards, input, legal] = rows;
    decorateBackground(el, background);
    decorateHeader(el, header);
    if (variants.inputFirst) {
      decorateInput(el, input);
      decorateCards(el, cards);
    } else {
      decorateCards(el, cards);
      decorateInput(el, input);
    }
    decorateLegal(el, legal);
  }

  if (variants.isHero) {
    const [background, header, cards, input, legal] = rows;
    decorateBackground(el, background);
    decorateHeader(el, header);
    decorateInput(el, input);
    decorateCards(el, cards);
    decorateLegal(el, legal);
  }
  if (variants.isFloatingButton) {
    decorateFloatingButton(el);
  }
  if (variants.isFloatingButtonOnly) {
    rows.forEach((row) => {
      el.removeChild(row);
    });
    decorateFloatingButton(el);
  }

  // Testing only: Remove before contributing
  const button = document.createElement('button');
  button.textContent = 'Click me to open SUSI Light (testing only)';
  button.onclick = openSusiLightModal;
  el.appendChild(button);
}
