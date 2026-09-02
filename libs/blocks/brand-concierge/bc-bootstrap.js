import { getModal, closeModal } from '../modal/modal.js';
import { createTag, getConfig, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';
import { getBetaLabel, waitForCondition, expandIcon } from './bc-utils.js';
import { bcAnalytics, getAnalyticsLabel } from './bc-analytics.js';
import chatUIConfig from './chat-ui-config.js';

export const mountId = 'brand-concierge-mount';
const chatLabelText = 'Ask';
const animationMs = 500;

const authoredContent = {};
const params = new URL(document.location).searchParams;
const webClient = params.get('webclient');
const webClientVersion = params.get('webclientversion');
const susiScopes = 'AdobeID,openid,gnav,pps.read,firefly_api,additional_info.roles,read_organizations,account_cluster.read';

let bcToken;
let susiListener;
let sideModalEl = null;
let sideCurtainEl = null;
let lastImsState = null;

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
  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}${window.location.search}`,
  );
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
    scope: susiScopes,
  };
  const susiConfig = { consentProfile: 'free', fullWidth: true };
  const onSuccessfulToken = ({ detail }) => {
    closeSusiModal();
    window.dispatchEvent(new CustomEvent('signIn:decorateNav', { detail: 'signIn' }));
    window?.lana?.log('SUSI login success', { tags: 'brand-concierge', severity: 'info' });
    const token = detail;
    bcToken = token;
    const mountEl = document.getElementById(mountId);
    if (mountEl) {
      mountEl.dispatchEvent(new CustomEvent('bc:cta-action-handled', { detail: { token } }));
    }
  };

  const onError = (e) => {
    const mountEl = document.getElementById(mountId);
    window?.lana?.log(`SUSI Light error: ${e}`, { tags: 'brand-concierge', severity: 'error' });
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

export function setAuthoredContent(header = null, cards = null, input = null) {
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

export function getUpdatedChatUIConfig() {
  if (authoredContent?.header) chatUIConfig.text['welcome.heading'] = authoredContent.header.title;
  if (authoredContent?.header?.subTitle) chatUIConfig.text['welcome.subheading'] = authoredContent.header.subTitle;
  if (authoredContent?.cards) chatUIConfig.arrays['welcome.examples'] = authoredContent.cards;
  if (authoredContent?.input) chatUIConfig.text['input.placeholder'] = authoredContent.input;

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

export function loadWebclient() {
  const { env } = getConfig();
  const baseProd = 'https://experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
  const baseStage = 'https://experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
  const prod = 'https://experience.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
  const stage = 'https://experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
  let src = stage;

  if (env?.name === 'prod') {
    src = prod;
  }

  if (webClient === 'prod') {
    src = prod;
  } else if (webClient === 'stage') {
    src = stage;
  } else if (webClient === 'baseProd') {
    src = baseProd;
  } else if (webClient === 'baseStage') {
    src = baseStage;
  }

  if (webClientVersion) {
    const prBase = 'https://cdn.experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
    const pr = `${prBase}?adobe-brand-concierge-acom-brand-concierge-web-agent_version=${encodeURIComponent(webClientVersion)}`;
    src = pr;
  }

  loadScript(src);
}

export async function bcBootstrap(initialMessage, mountIdentifier) {
  const mountEl = document.querySelector(`#${mountIdentifier}`);
  const { locale } = getConfig();

  loadWebclient();

  if (initialMessage) mountEl.dataset.initialMessage = initialMessage;

  const bootstrapAPIReady = await waitForCondition(() => !!window.adobe?.concierge?.bootstrap);
  const surfaceURL = window.location.href;
  const { userAgent, language } = window.navigator;

  const onBeforeEventSend = (content) => {
    const MEETING_EVENT_TYPES = [
      'form-fetch',
      'form-submit',
      'calendar-fetch',
      'calendar-submit',
      'conversation-command',
    ];

    if (MEETING_EVENT_TYPES.includes(content.data?.type)) {
      return;
    }

    if (!bcToken) {
      bcToken = window.adobeIMS?.getAccessToken()?.token;
    }

    const isSignedIn = !!window.adobeIMS?.isSignedInUser();
    const guestToken = getMetadata('ims-guest-token');
    const imsState = `${isSignedIn}:${!!bcToken}:${!!guestToken}`;
    if (imsState !== lastImsState) {
      lastImsState = imsState;
      const severity = (!bcToken && isSignedIn) || (!bcToken && guestToken) || !guestToken ? 'warn' : 'info';
      window.lana?.log(
        `Brand Concierge IMS state — signedIn: ${isSignedIn}, accessToken: ${!!bcToken}, guestToken: ${!!guestToken}`,
        { tags: 'brand-concierge', severity, sampleRate: 50 },
      );
    }

    if (bcToken) {
      content.data = {
        type: 'auth',
        payload: { token: bcToken },
      };
    }

    // eslint-disable-next-line no-underscore-dangle
    const consentsConfig = window.alloy_all?.data?._adobe_corpnew?.otherConsents?.configuration;
    const consentConfObject = consentsConfig
      && Object.keys(consentsConfig).reduce((rdx, key) => {
        rdx.push({
          consentStandard: key,
          consentStringValue: consentsConfig[key].toString(),
          consentStandardVersion: '2.0',
          gdprApplies: true,
          containsPersonalData: true,
        });
        return rdx;
      }, []);

    content.xdm = {
      web: { webPageDetails: { URL: surfaceURL } },
      environment: {
        browserDetails: { userAgent },
        _dc: { language },
      },
      homeAddress: { region: locale.region },
      arpSessionToken: window.adobeArp?.sessionToken,
    };

    if (consentConfObject?.length) {
      content.xdm.consentStrings = consentConfObject;
    }
  };

  if (bootstrapAPIReady) {
    window.adobe.concierge.bootstrap({
      instanceName: 'alloy',
      stylingConfigurations: getUpdatedChatUIConfig(),
      selector: `#${mountId}`,
      onBeforeEventSend,
      onEvent: (event) => {
        bcAnalytics(event);
      },
    });
  } else {
    window.lana?.log('Brand Concierge: bootstrap API not available', { tags: 'brand-concierge', severity: 'critical' });
  }

  mountEl.addEventListener('bc:cta-action', ({ detail }) => {
    if (detail?.action === 'sign-in') {
      openSusiLightModal();
    }
  });
}

export async function openModal(initialMessage, bootstrap) {
  const innerModal = new DocumentFragment();
  const title = createTag('h1', { class: 'bc-modal-title' }, chatLabelText);
  const header = createTag('div', { class: 'bc-modal-header' }, [title, getBetaLabel()]);
  const mountEl = createTag('div', { id: mountId });

  innerModal.append(header, mountEl);
  const modal = await getModal(null, {
    class: 'opening',
    id: 'brand-concierge-modal',
    content: innerModal,
    closeCallback: async () => {
      modal.classList.add('closing');
      await new Promise((resolve) => {
        setTimeout(() => resolve(), animationMs);
      });
    },
  });

  setTimeout(() => {
    modal.classList.remove('opening');
  }, animationMs);

  if (susiListener !== 'signIn:decorateNav') {
    window.addEventListener('signIn:decorateNav', async () => {
      await window.adobeIMS?.refreshToken();
      (window.feds?.nav?.reloadUnav ?? window.feds?.nav?.reload)?.();
    });
    susiListener = 'signIn:decorateNav';
  }

  modal.querySelector('.dialog-close').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  document.querySelector('.modal-curtain').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));

  bootstrap(initialMessage, mountId);
}

async function hideSideModal() {
  if (!sideModalEl) return;
  localStorage.setItem('bc-side-overlay', 'closed');
  document.body.classList.remove('bc-side-open');
  sideModalEl.classList.add('closing');
  sideModalEl.classList.remove('expanded');
  await new Promise((resolve) => { setTimeout(resolve, animationMs); });
  // Keep 'closing' on the element — its CSS properties (right/-100vw or bottom/-100vh)
  // hold the panel in the correct off-screen position. 'bc-side-hidden' only suppresses
  // any animation re-trigger (animation: none !important) and disables pointer-events.
  sideModalEl.classList.add('bc-side-hidden');
  sideModalEl.setAttribute('aria-hidden', 'true');
  if (sideCurtainEl) sideCurtainEl.classList.remove('is-open');
  if (!document.querySelectorAll('.modal-curtain.is-open').length) {
    document.body.classList.remove('disable-scroll');
    window.lenis?.start();
  }
  [...document.querySelectorAll('header, main, footer')]
    .forEach((el) => el.removeAttribute('aria-disabled'));
  window.dispatchEvent(new Event('milo:modal:closed'));
}

export async function destroySideModal() {
  await hideSideModal();
  sideModalEl?.remove();
  sideCurtainEl?.remove();
  sideModalEl = null;
  sideCurtainEl = null;
}

export async function openSideModal(initialMessage, bootstrap) {
  if (susiListener !== 'signIn:decorateNav') {
    window.addEventListener('signIn:decorateNav', async () => {
      await window.adobeIMS?.refreshToken();
      (window.feds?.nav?.reloadUnav ?? window.feds?.nav?.reload)?.();
    });
    susiListener = 'signIn:decorateNav';
  }

  document.body.classList.add('bc-side-open');
  localStorage.setItem('bc-side-overlay', 'open');

  // Guard: if the element was removed from the DOM externally (e.g. by tests or
  // a hard reset), treat the reference as stale and fall through to a full rebuild.
  if (sideModalEl && !document.contains(sideModalEl)) {
    sideModalEl = null;
    sideCurtainEl = null;
  }

  // Subsequent opens: reveal existing panel without re-bootstrapping.
  // Remove both 'bc-side-hidden' and 'closing' (held from the park state), then
  // add 'opening' so the slide-in animation plays from the off-screen position.
  if (sideModalEl) {
    sideModalEl.removeAttribute('aria-hidden');
    sideModalEl.classList.remove('bc-side-hidden', 'closing');
    sideModalEl.classList.add('opening');
    if (sideCurtainEl) sideCurtainEl.classList.add('is-open');
    document.body.classList.add('disable-scroll');
    window.lenis?.stop();
    [...document.querySelectorAll('header, main, footer')]
      .forEach((el) => el.setAttribute('aria-disabled', 'true'));
    setTimeout(() => sideModalEl.classList.remove('opening'), animationMs);
    return;
  }

  // First open: build modal DOM and bootstrap the web agent.
  // Await modal.css so position:fixed and --modal-z-index vars are available before
  // the panel is appended to the DOM — loadStyle is fire-and-forget otherwise.
  const { miloLibs, codeRoot } = getConfig();
  await new Promise((resolve) => {
    loadStyle(`${miloLibs || codeRoot}/blocks/modal/modal.css`, resolve);
  });

  const title = createTag('h1', { class: 'bc-modal-title' }, chatLabelText);
  const expandButton = createTag('button', { class: 'bc-expand-button', 'aria-label': 'expand-modal' }, expandIcon);
  const header = createTag('div', { class: 'bc-modal-header' }, [title, getBetaLabel(), expandButton]);
  const mountEl = createTag('div', { id: mountId });

  const closeBtn = createTag('button', {
    class: 'dialog-close',
    'aria-label': 'Close',
    'daa-ll': getAnalyticsLabel('modal-close'),
  });
  const modal = createTag('div', {
    class: 'dialog-modal opening',
    id: 'brand-concierge-side',
    role: 'dialog',
    'aria-modal': 'true',
  });
  modal.append(closeBtn, header, mountEl);
  document.body.append(modal);
  sideModalEl = modal;

  document.body.classList.add('disable-scroll');
  window.lenis?.stop();
  [...document.querySelectorAll('header, main, footer')]
    .forEach((el) => el.setAttribute('aria-disabled', 'true'));

  const curtain = createTag('div', {
    class: 'modal-curtain is-open',
    'daa-ll': getAnalyticsLabel('modal-close'),
  });
  curtain.addEventListener('click', (e) => { if (e.target === curtain) hideSideModal(); });
  modal.insertAdjacentElement('afterend', curtain);
  sideCurtainEl = curtain;

  closeBtn.addEventListener('click', hideSideModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sideModalEl?.classList.contains('bc-side-hidden')) hideSideModal();
  });

  setTimeout(() => modal.classList.remove('opening'), animationMs);

  expandButton.addEventListener('click', () => {
    const { classList } = modal;
    if (classList.contains('expanded')) {
      classList.remove('expanded');
      document.body.classList.add('bc-side-open');
    } else {
      classList.add('expanded');
      document.body.classList.remove('bc-side-open');
    }
  });

  window.dispatchEvent(new Event('milo:modal:loaded'));
  bootstrap(initialMessage, mountId);
}
