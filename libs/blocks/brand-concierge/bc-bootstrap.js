import { getModal, closeModal } from '../modal/modal.js';
import { createTag, getConfig, loadScript } from '../../utils/utils.js';
import { getBetaLabel, waitForCondition, expandIcon } from './bc-utils.js';
import { bcAnalytics, getAnalyticsLabel } from './bc-analytics.js';
import chatUIConfig from './chat-ui-config.js';

const chatLabelText = 'Ask';
const mountId = 'brand-concierge-mount';
const animationMs = 500;

const authoredContent = {};
const params = new URL(document.location).searchParams;
const webClient = params.get('webclient');
const webClientVersion = params.get('webclientversion');

let bcToken;

/**
 * Creates the SUSI Light component for the sign-in modal.
 * Aligns with Nest (Repos/nest) SentryWrapper: popup=true, response_type=token,
 * close modal on 'redirect' (onCloseRedirect) and on 'on-token' (onSuccessfulToken).
 */
function createSusiComponentForModal({
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

export function susiTestButton(el) {
  const loginTestButton = params.get('susi-test-btn');
  if (loginTestButton) {
    const button = document.createElement('button');
    button.textContent = 'Click me to open SUSI Light (testing only)';
    button.onclick = openSusiLightModal;
    el.appendChild(button);
  }
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

function getUpdatedChatUIConfig() {
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

export async function bcBootstrap(mountEl) {
  const logWebClient = (text, src) => {
    // eslint-disable-next-line no-console
    console.log(text, src);
  };

  const { env, locale } = getConfig();
  const baseProd = 'https://experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
  const baseStage = 'https://experience-stage.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
  const prod = 'https://experience.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
  const stage = 'https://experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
  let src = stage;

  if (env?.name === 'prod') {
    src = prod;
  }

  if (webClient === 'prod') {
    logWebClient('prod', prod);
    src = prod;
  } else if (webClient === 'stage') {
    logWebClient('stage', stage);
    src = stage;
  } else if (webClient === 'baseProd') {
    logWebClient('baseProd', baseProd);
    src = baseProd;
  } else if (webClient === 'baseStage') {
    logWebClient('baseStage', baseStage);
    src = baseStage;
  }

  if (webClientVersion) {
    const prBase = 'https://cdn.experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
    const pr = `${prBase}?adobe-brand-concierge-acom-brand-concierge-web-agent_version=${encodeURIComponent(webClientVersion)}`;
    src = pr;
  }

  loadScript(src);

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
      bcToken = window.adobeIMS?.isSignedInUser() ? window.adobeIMS?.getAccessToken()?.token : null;
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

  bootstrap(mountEl);
}

export async function openSideModal(initialMessage, bootstrap) {
  const innerModal = new DocumentFragment();
  const title = createTag('h1', { class: 'bc-modal-title' }, `${chatLabelText}`);
  const expandButton = createTag('button', { class: 'bc-expand-button', 'aria-label': 'expand-modal' }, expandIcon);
  const header = createTag('div', { class: 'bc-modal-header' }, [title, getBetaLabel(), expandButton]);
  const mountEl = createTag('div', { id: mountId });

  if (initialMessage) mountEl.dataset.initialMessage = initialMessage;
  innerModal.append(header, mountEl);
  const modal = await getModal(null, {
    id: 'brand-concierge-side',
    content: innerModal,
    closeCallback: async () => {
      localStorage.setItem('bc-side-overlay', 'closed');
      document.body.classList.remove('bc-side-open');
      modal.classList.add('closing');
      await new Promise((resolve) => {
        setTimeout(() => resolve(), animationMs);
      });
    },
  });
  modal.querySelector('.dialog-close').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  document.querySelector('.modal-curtain').setAttribute('daa-ll', getAnalyticsLabel('modal-close'));
  document.body.classList.add('bc-side-open');
  localStorage.setItem('bc-side-overlay', 'open');

  expandButton.addEventListener('click', () => {
    const modalClasses = modal.classList;
    if (modalClasses.contains('expanded')) {
      modalClasses.remove('expanded');
      document.body.classList.add('bc-side-open');
    } else {
      modalClasses.add('expanded');
      document.body.classList.remove('bc-side-open');
    }
  });

  bootstrap(mountEl);
}
