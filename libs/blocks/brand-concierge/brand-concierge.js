import { getModal, closeModal } from '../modal/modal.js';
import { createTag, getConfig, loadScript, loadStyle } from '../../utils/utils.js';
import chatUIConfig from './chat-ui-config.js';
import bcAnalytics from './bc-analytics.js';

const submitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="send-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M18.6485 9.9735C18.6482 9.67899 18.4769 9.41106 18.2059 9.29056L4.05752 2.93282C3.80133 2.8175 3.50129 2.85583 3.28171 3.03122C3.06178 3.20765 2.95889 3.49146 3.01516 3.76733L4.28678 10.008L3.06488 16.2384C3.0162 16.4852 3.09492 16.738 3.27031 16.9134C3.29068 16.9337 3.31278 16.9531 3.33522 16.9714C3.55619 17.1454 3.85519 17.182 4.11069 17.066L18.2086 10.6578C18.4773 10.5356 18.6489 10.268 18.6485 9.9735ZM14.406 9.22716L5.66439 9.25379L4.77705 4.90084L14.406 9.22716ZM4.81711 15.0973L5.6694 10.7529L14.4323 10.7264L4.81711 15.0973Z"></path></svg>';
const aiIcon = (svgId, svgClass, svgTitle, svgSize = 16) => `<svg class="${svgClass}" ${svgTitle ? `title="${svgTitle}"` : ''} width="${svgSize}" height="${svgSize}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.91819 13.2491C9.69944 13.2491 9.47874 13.1924 9.27952 13.0772C8.79807 12.7989 8.55491 12.2471 8.67307 11.7041L9.40061 8.33011L7.08225 5.77249C6.7092 5.36038 6.64475 4.76077 6.92307 4.27933C7.20139 3.79691 7.75803 3.55374 8.29612 3.67288L11.6701 4.40042L14.2278 2.08206C14.6409 1.70706 15.2405 1.64554 15.7209 1.92288C16.2024 2.2012 16.4455 2.75296 16.3274 3.29593L15.5998 6.66995L17.9182 9.22757C18.2912 9.6387 18.3547 10.2383 18.0774 10.7198C17.7991 11.2002 17.2493 11.4453 16.7053 11.3282L13.3313 10.5987L10.7727 12.918C10.5315 13.1368 10.2258 13.2491 9.91819 13.2491ZM10.8918 8.53324L10.2873 11.333L12.4094 9.40921C12.7121 9.1348 13.1301 9.02151 13.5315 9.10745L16.3332 9.71292L14.4094 7.59085C14.134 7.28616 14.0217 6.86526 14.1096 6.46487L14.7131 3.66702L12.5911 5.59085C12.2864 5.86624 11.8664 5.97757 11.4651 5.89065L8.66722 5.28713L10.5911 7.4092C10.8664 7.71291 10.9787 8.13285 10.8918 8.53324Z" fill="url(#${svgId}-1)"/>
<path d="M3.34569 18.252C3.21678 18.252 3.08788 18.2188 2.97069 18.1514C2.68846 17.9883 2.54393 17.6622 2.61229 17.3438L2.91893 15.9258L1.94432 14.8516C1.72557 14.6104 1.68748 14.2549 1.85057 13.9727C2.01366 13.6905 2.34178 13.5498 2.65819 13.6143L4.07616 13.9209L5.15038 12.9463C5.39257 12.7266 5.74608 12.6895 6.02929 12.8526C6.31152 13.0157 6.45605 13.3418 6.38769 13.6602L6.08105 15.0782L7.05566 16.1524C7.27441 16.3936 7.3125 16.7491 7.14941 17.0313C6.98632 17.3135 6.65722 17.4522 6.34179 17.3897L4.92382 17.0831L3.8496 18.0577C3.708 18.1856 3.52733 18.252 3.34569 18.252Z" fill="url(#${svgId}-2)"/>
<defs>
  <linearGradient id="${svgId}-1" x1="6.75122" y1="1.75085" x2="19.2946" y2="3.03523" gradientUnits="userSpaceOnUse">
  <stop stop-color="#D73220"/>
  <stop offset="0.33" stop-color="#D92361"/>
  <stop offset="1" stop-color="#7155FA"/>
  </linearGradient>
  <linearGradient id="${svgId}-2" x1="1.75" y1="12.7517" x2="7.75027" y2="13.3661" gradientUnits="userSpaceOnUse">
  <stop stop-color="#D73220"/>
  <stop offset="0.33" stop-color="#D92361"/>
  <stop offset="1" stop-color="#7155FA"/>
  </linearGradient>
  </defs>
</svg>`;

const chatLabelText = 'Ask';
const mountId = 'brand-concierge-mount';
const animationMs = 500;

const authoredContent = {};
const variants = {};
const params = new URL(document.location).searchParams;

let floatingButtonClicked = false;
let bcToken;
let jarvisInitialized = false;

const getTargetHeight = (target) => {
  const { marginBottom } = window.getComputedStyle(target);
  return target.scrollHeight + (parseFloat(marginBottom) * 2);
};

function floatingElement(targetEl, el, focusableEl = null) {
  const hideFloating = () => {
    if (focusableEl) {
      focusableEl.setAttribute('aria-hidden', 'true');
      focusableEl.setAttribute('tabindex', '-1');
      focusableEl.blur();
    }
    targetEl.classList.add('bc-floating-hidden');
    targetEl.classList.remove('bc-floating-show');
  };

  const showFloating = () => {
    if (focusableEl) {
      focusableEl.removeAttribute('aria-hidden');
      focusableEl.removeAttribute('tabindex');
    }
    targetEl.classList.remove('bc-floating-hidden');
    targetEl.classList.add('bc-floating-show');
  };

  const mainElement = document.querySelector('main');
  const mainTop = mainElement.offsetTop;
  const hasDelay = variants.isHero || variants.floatingDelay || variants.floatingAnchorDelay;
  const anchorDelay = variants.floatingAnchorDelay ? variants.floatingAnchorDelayAmount : 0;
  let mainHeight = mainElement.scrollHeight;
  let targetHeight = getTargetHeight(targetEl);
  let elHeight = el.scrollHeight;

  const floatingSpacer = createTag('div', { class: 'bc-spacer' });
  floatingSpacer.style.cssText = 'height:0; pointer-events:none;';
  mainElement.appendChild(floatingSpacer);

  targetEl.classList.add('bc-floating-element');

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const size = Math.floor(entry.borderBoxSize?.[0]?.blockSize);
      switch (entry.target) {
        case el: elHeight = size ?? el.scrollHeight; break;
        case mainElement: mainHeight = size ?? mainElement.scrollHeight; break;
        case targetEl: targetHeight = getTargetHeight(targetEl); break;
        default: break;
      }
    }
  });
  ro.observe(el);
  ro.observe(mainElement);
  ro.observe(targetEl);

  if (variants.isHero || variants.floatingDelay) {
    hideFloating();
  }

  const handleScroll = (target) => {
    // only values that need to be calculated on scroll are here, to optimize performance
    const threshold = window.scrollY + window.innerHeight - mainTop;
    const topDelay = variants.floatingDelay ? variants.floatingDelayAmount : elHeight;
    const bottomValue = threshold - mainHeight;

    // if the spacer is not the last element in main, move it to the end
    if (mainElement.children[mainElement.children.length - 1] !== floatingSpacer) {
      mainElement.appendChild(floatingSpacer);
    }

    if (threshold > mainHeight) {
      target.style.bottom = `${bottomValue}px`;
      if (variants.isFloatingAnchorHide || variants.floatingAnchorDelay) {
        hideFloating();
      } else {
        floatingSpacer.style.cssText = `height: ${targetHeight}px; pointer-events: none; display: block;`;
      }
    } else {
      showFloating();
      target.style.bottom = '0';
    }
    if (hasDelay) {
      if (window.scrollY > topDelay && threshold <= mainHeight) {
        showFloating();
      }
      if (window.scrollY < topDelay
        || (variants.floatingAnchorDelay && threshold > mainHeight - anchorDelay)) {
        hideFloating();
      }
    }
  };

  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      handleScroll(targetEl);
      scrollPending = false;
    });
  }, { passive: true });
}

function getAnalyticsLabel(step) {
  return `Filters|${getConfig()?.brandConciergeAA ? getConfig()?.brandConciergeAA : 'app-reco'}|bc#${step}`;
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

  // For stage, override specific env variables
  const config = getConfig();
  const { env } = config || {};
  const isStage = env?.name !== 'prod';
  if (isStage) {
    chatUIConfig.env = 'stage';
    chatUIConfig.behavior.fireflyGalleryWidget.fireflyHostname = 'https://firefly-stage.corp.adobe.com';
    chatUIConfig.behavior.fireflyGalleryWidget.fireflyEnv = 'stage';
  }
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

function resetFloatingButton(el) {
  const floatingButton = el.querySelector('.bc-floating-button');
  if (floatingButton) {
    const cleanup = setTimeout(() => {
      floatingButtonClicked = false;
      clearTimeout(cleanup);
    }, animationMs);
  }
}

/**
 * Creates the SUSI Light component for the sign-in modal.
 * Aligns with Nest (Repos/nest) SentryWrapper: popup=true, response_type=token,
 * close modal on 'redirect' (onCloseRedirect) and on 'on-token' (onSuccessfulToken).
 */
export function createSusiComponentForModal({
  authParams,
  config,
  variant,
  redirectUrl,
  isStage,
  popup,
  onCloseRedirect,
  onSuccessfulToken,
  onError,
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
    scope: 'AdobeID,openid,gnav,pps.read,firefly_api,additional_info.roles,read_organizations,account_cluster.read',
  };
  const susiConfig = { consentProfile: 'free', fullWidth: true };
  const onSuccessfulToken = ({ detail }) => {
    closeSusiModal();
    window.dispatchEvent(new CustomEvent('signIn:decorateNav', { detail: 'signIn' }));
    window?.lana.log('SUSI login success', { tags: 'brand-concierge', severity: 'info' });
    const token = detail;
    if (!bcToken) {
      bcToken = token;
      const mountEl = document.getElementById(mountId);
      if (mountEl) {
        mountEl.dispatchEvent(new CustomEvent('bc:cta-action-handled', { detail: { token } }));
      }
    }
  };

  const onError = (e) => {
    const mountEl = document.getElementById(mountId);
    window.lana?.log(`SUSI Light error: ${e}`, { tags: 'brand-concierge', severity: 'error' });
    if (mountEl) {
      mountEl.dispatchEvent(
        new CustomEvent('bc:cta-action-error', { detail: { message: 'Something went wrong signing in. Please try again in a moment.' } }),
      );
    }
    closeSusiModal();
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
    onError,
  });
  const wrapper = createTag('div', { class: 'bc-susi-modal-content' }, susiEl);
  const title = createTag('h2', { class: 'bc-susi-modal-title' }, 'Sign in or create an account');
  const fragment = new DocumentFragment();

  fragment.append(title, wrapper);
  await getModal(null, {
    id: SUSI_MODAL_ID,
    class: 'bc-susi-modal',
    content: fragment,
  });
}

async function openChatModal(initialMessage, el) {
  // POC: the Jarvis client renders its own sandboxed iframe/window, so this skips
  // Milo's modal (getModal) entirely. It still needs a mount point to expand/position
  // itself into, though - confirmed via live testing: without one, the client posts
  // adbmsgui_SET_EXPANDED but has nothing to resize, and stays stuck minimised offscreen.
  if (!document.getElementById(mountId)) {
    document.body.append(createTag('div', { id: mountId }));
  }

  const textareaWrapper = el.querySelector('.bc-textarea-grow-wrap');
  const textarea = el.querySelector('.bc-input-field textarea');
  const submitButton = el.querySelector('.input-field-button');

  if (textareaWrapper && textarea && submitButton) {
    textarea.value = '';
    submitButton.disabled = true;
    updateReplicatedValue(textareaWrapper, textarea);
  }

  // POC: Jarvis/Assistant client swap-in (throwaway branch, not for main/assistant).
  const config = getConfig();
  const { env, locale } = config;
  const isStage = env?.name !== 'prod';

  const JARVIS_CLIENT_JS_URL = 'https://stage-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
  const JARVIS_APPID = 'helpx-default';
  const ASSISTANT_UI_URL = 'https://stage-server.messaging.adobe.com';

  // loadScript() only ever creates a <script> tag - loading the CSS through it downloads
  // the bytes but never applies them (confirmed via live testing: no entry ever appeared in
  // document.styleSheets, so position:fixed on the CTA/window never took effect). helpx.stage
  // loads it as a real <link rel="stylesheet">, which is what loadStyle() does.
  loadStyle(JARVIS_CLIENT_JS_URL.replace(/\.js$/, '.css'));
  await loadScript(JARVIS_CLIENT_JS_URL);

  // 1.0 global; confirm with Jarvis/Leo team if the Leo/2.0 build uses a different name.
  const clientReady = await waitForCondition(() => !!window.AdobeMessagingExperienceClient);
  if (!clientReady) {
    window.lana?.log('Jarvis client not available', { tags: 'brand-concierge', severity: 'critical' });
    return;
  }
  const client = window.AdobeMessagingExperienceClient;

  const lang = locale?.ietf?.split('-')[0] || 'en';
  const region = locale?.region || 'US';

  const getContextCallback = () => ({
    accessToken: bcToken ? `Bearer ${bcToken}` : '',
    language: lang,
    region,
  });
  const signInProvider = async () => {
    await openSusiLightModal();
    return { accessToken: bcToken };
  };
  const analyticsCallback = (event) => bcAnalytics(event);
  // No Milo modal to close, so replicate the old close-triggered floating-button reset here.
  const chatStateCallback = ({ chatState }) => {
    if (chatState === 'close' && floatingButtonClicked) {
      resetFloatingButton(el);
    }
  };

  if (!bcToken) {
    bcToken = window.adobeIMS?.isSignedInUser() ? window.adobeIMS?.getAccessToken()?.token : null;
  }

  // Calling initialize() again after a conversation has already been through one full
  // open/close cycle isn't a no-op: the SDK rejects it ("Messaging client already
  // initialized, returning error") but still proceeds to request a new session, which
  // then fails auth with a 401 and shows "Service Unavailable" in the chat UI. Confirmed
  // via live testing (close via X, reopen via any entry point). Only initialize once;
  // subsequent opens just need the ready-callback + openMessagingWindow below.
  if (!jarvisInitialized) {
    jarvisInitialized = true;
    client.initialize({
      appid: JARVIS_APPID,
      appver: '1.0',
      appType: 'web',
      env: isStage ? 'stage' : 'prod',
      language: lang,
      region,
      clientId: config?.imsClientId,
      accessToken: bcToken ? `Bearer ${bcToken}` : '',
      cookiesEnabled: true,
      theme: 'light',
      loadedVia: 'milo-brand-concierge',
      context: { userData: { userid: '', accountType: 'FREE' } },
      mountEl: `#${mountId}`,
      chatUiUrl: ASSISTANT_UI_URL,
      callbacks: { signInProvider, getContextCallback, analyticsCallback, chatStateCallback },
    });
  }

  // initialize() doesn't return a promise; openMessagingWindow() is a no-op if called
  // before the client reports ready, so gate it on the client's own ready callback.
  client.registerForOnReadyCallback(() => {
    client.openMessagingWindow({
      componentid: 'brand-concierge',
      componentver: '1.0',
      sourceType: 'button',
      sourceText: initialMessage || chatLabelText,
    });
  });
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
      authoredContent.cards.push({ text: cardText, icon: 'sparkleAI', backgroundColor: '#FFFFFF' });
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
  if (el.contains(background)) el.removeChild(background);
}

function decorateMarqueeBackground(el, background) {
  const pictures = [...background.querySelectorAll('picture')];
  if (!pictures.length) {
    decorateBackground(el, background);
    return;
  }
  const backgroundLayer = createTag('div', { class: 'background' });
  if (pictures.length === 1) {
    backgroundLayer.append(pictures[0]);
  } else {
    const viewports = ['desktop-only', 'tablet-only', 'mobile-only'];
    pictures.forEach((picture, index) => {
      backgroundLayer.append(createTag('div', { class: viewports[index] || 'mobile-only' }, picture));
    });
  }
  el.prepend(backgroundLayer);
  if (el.contains(background)) el.removeChild(background);
}

function decorateHeader(el, header, { eyebrow: withEyebrow = false } = {}) {
  const headerSection = createTag('section', { class: 'bc-header' });
  let title;
  let eyebrow = null;

  if (withEyebrow) {
    [eyebrow, title] = header.querySelectorAll('h1, h2, h3, h4, h5, h6');
  } else {
    title = header.querySelector('h1, h2, h3, h4, h5, h6');
  }
  const subTitle = header.querySelector('p');

  if (eyebrow) {
    eyebrow.classList.add('bc-header-eyebrow');
    headerSection.append(eyebrow);
  }
  if (title) {
    title.classList.add('bc-header-title');
    headerSection.append(title);
  }
  if (subTitle) {
    subTitle.classList.add('bc-header-subtitle');
    headerSection.append(subTitle);
  }
  if (!eyebrow && !title && !subTitle) {
    headerSection.append(createTag('p', { class: 'bc-header-subtitle' }, header.textContent.trim()));
  }

  el.append(headerSection);
  if (el.contains(header)) el.removeChild(header);
}

function decorateCards(el, cards) {
  const cardSection = createTag('section', { class: 'bc-prompt-cards' });
  const cardRows = cards.querySelectorAll(':scope > div');
  cardRows.forEach((card, index) => {
    const cardImage = card.querySelector('picture');
    const cardText = createTag('div', { class: 'prompt-card-text' }, `${aiIcon(`card-icon-${index + 1}`, 'card-icon', null, 16)} <p>${card.textContent.trim()}</p>`);
    const cardButton = createTag('button', {
      class: 'prompt-card-button no-track',
      'daa-ll': getAnalyticsLabel(`1|BC-suggested_prompt_clicked|inline|${cardText.textContent.trim()}`),
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
  if (el.contains(cards)) el.removeChild(cards);
}

function decorateInput(el, input) {
  const fieldSection = createTag('section', { class: 'bc-input-field' });
  const fieldLabel = createTag('label', {
    for: 'bc-input-field',
    class: 'bc-input-field-label',
    'aria-describedby': 'bc-label-tooltip',
    tabindex: 0,
  }, `${aiIcon('ai-icon-input', 'input-icon', chatLabelText, 20)}`);
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
  if (el.contains(input)) el.removeChild(input);
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
      e.preventDefault();
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
  if (el.contains(legal)) el.removeChild(legal);
}

function decorateFloatingButton(el) {
  const floatingButton = createTag('section', { class: 'bc-floating-button' });
  const floatingIcon = createTag('div', { class: 'bc-floating-icon' }, aiIcon('ai-icon-floating', 'floating-icon', chatLabelText, 20));
  const floatingInput = createTag('div', { class: 'bc-floating-input' }, authoredContent.input);
  const floatingSubmit = createTag('div', { class: 'bc-floating-submit' }, submitIcon);
  const floatingContainer = createTag('button', { class: 'bc-floating-button-container no-track', 'daa-ll': getAnalyticsLabel('floating-bc') }, [floatingIcon, floatingInput, floatingSubmit]);

  floatingButton.append(floatingContainer);
  el.append(floatingButton);

  floatingButton.addEventListener('click', () => {
    if (floatingButtonClicked) return;
    floatingButtonClicked = true;
    openChatModal(null, el);
  });

  floatingElement(floatingButton, el, floatingContainer);
}

function decorateFloatingInput(el, cards, input) {
  if (variants.isFloatingInputOnly) {
    el.classList.add('floating-input');
  }
  function updatePillVisibility(target) {
    const prompts = target.querySelector('.bc-prompt-cards');
    if (!prompts) return;

    const buttons = [...prompts.querySelectorAll('.prompt-card-button')];
    buttons.forEach((btn) => { btn.style.display = ''; });

    requestAnimationFrame(() => {
      const { left: containerLeft, right: containerRight } = prompts.getBoundingClientRect();

      buttons.forEach((btn) => {
        const { left, right } = btn.getBoundingClientRect();

        if (right > containerRight || left < containerLeft) {
          btn.style.display = 'none';
        }
      });
    });
  }

  const floatingInput = createTag('section', { class: 'bc-floating-input' });
  decorateInput(floatingInput, input);
  decorateCards(floatingInput, cards);
  el.append(floatingInput);

  const updateLayout = () => {
    updatePillVisibility(floatingInput);
  };

  window.addEventListener('resize', updateLayout);
  requestAnimationFrame(updateLayout);
  floatingElement(floatingInput, el, el.querySelector('.bc-input-field'));
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
  // Reset variant flags so each block decorates independently of any prior init.
  Object.keys(variants).forEach((key) => delete variants[key]);

  handleConsent(el);
  window.addEventListener('adobePrivacy:PrivacyReject', () => handleConsent(el));
  window.addEventListener('adobePrivacy:PrivacyCustom', () => handleConsent(el));
  window.addEventListener('signIn:decorateNav', async () => {
    await window.adobeIMS?.refreshToken();
    (window.feds?.nav?.reloadUnav ?? window.feds?.nav?.reload)?.();
  });

  const rows = el.querySelectorAll(':scope > div');

  setAuthoredContent(rows);

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

  if (variants.isFloatingButton) {
    decorateFloatingButton(el);
  }
  if (variants.isFloatingButtonOnly) {
    rows.forEach((row) => {
      el.removeChild(row);
    });
    decorateFloatingButton(el);
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

  if (variants.isMarquee) {
    const [background, header, cards, input, legal] = rows;
    decorateMarqueeBackground(el, background);
    decorateHeader(el, header, { eyebrow: true });
    decorateInput(el, input);
    decorateCards(el, cards);
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

  if (variants.isFloatingInput) {
    const [, , cards, input] = rows;
    decorateFloatingInput(el, cards, input);
  }
  if (variants.isFloatingInputOnly) {
    const [, , cards, input] = rows;
    decorateFloatingInput(el, cards, input);
    rows.forEach((row) => {
      el.removeChild(row);
    });
  }

  const loginTestButton = params.get('susi-test-btn');
  if (loginTestButton) {
    const button = document.createElement('button');
    button.textContent = 'Click me to open SUSI Light (testing only)';
    button.onclick = openSusiLightModal;
    el.appendChild(button);
  }
}
