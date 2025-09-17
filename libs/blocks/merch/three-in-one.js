/* eslint-disable import/no-relative-packages */
import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKeyArray } from '../../features/placeholders.js';
import '../../features/spectrum-web-components/dist/theme.js';
import '../../features/spectrum-web-components/dist/progress-circle.js';

export const MSG_SUBTYPE = {
  AppLoaded: 'AppLoaded',
  EXTERNAL: 'EXTERNAL',
  SWITCH: 'SWITCH',
  RETURN_BACK: 'RETURN_BACK',
  OrderComplete: 'OrderComplete',
  Error: 'Error',
  Close: 'Close',
};

export const LANA_OPTIONS = {
  clientId: 'merch-at-scale',
  sampleRate: 10,
  tags: 'three-in-one',
};

export const reloadIframe = ({ iframe, theme, msgWrapper, handleTimeoutError }) => {
  if (!msgWrapper || !iframe || !theme || !handleTimeoutError) return;
  msgWrapper.remove();
  iframe.setAttribute('data-wasreloaded', true);
  iframe.style.display = 'block';
  // eslint-disable-next-line no-self-assign
  iframe.src = iframe.src;
  iframe.classList.add('loading');
  theme.style.display = 'block';
  setTimeout(handleTimeoutError, 15000);
};

export const showErrorMsg = async ({ iframe, miloIframe, showBtn, theme, handleTimeoutError }) => {
  theme.style.display = 'none';
  iframe.style.display = 'none';
  const [errorRefresh, errorTryLater, tryAgain] = await replaceKeyArray(['error-refresh', 'error-try-later', 'try-again'], getConfig());
  const iconAndText = `
  <div class="icon-and-text">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
      <defs>
        <style>
          .fill {
            fill: #fff;
          }
        </style>
      </defs>
      <title>Alert</title>
      <rect id="Canvas" fill="#ff13dc" opacity="0" width="24" height="24" />
      <path class="fill"
        d="M11.418,1.72L0.267,21.675c-0.134,0.238,0.033,0.535,0.581,0.535h22.305c0.547,0,0.714-0.297,0.581-0.535L12.582,1.72c-0.134-0.238-1.031-0.238-1.164,0ZM13.333,19.669c0,0.333-0.333,0.333-0.333,0.333h-2c0,0-0.333,0-0.333-0.333v-2c0-0.333,0.333-0.333,0.333-0.333h2c0,0,0.333,0,0.333,0.333Zm0-4c0,0.333-0.333,0.333-0.333,0.333h-2c0,0-0.333,0-0.333-0.333v-8c0-0.333,0.333-0.333,0.333-0.333h2c0,0,0.333,0,0.333,0.333Z" />
    </svg>
    <p class="error-msg">${showBtn ? `${errorRefresh}` : `${errorTryLater}`}</p>
  </div>`;
  const msgWrapper = createTag('div', { class: 'error-wrapper' }, iconAndText, { parent: miloIframe });

  if (showBtn) {
    const btn = createTag('button', { class: 'try-again-btn' }, `${tryAgain}`, { parent: msgWrapper });
    btn.addEventListener('click', () => reloadIframe({ iframe, theme, msgWrapper, handleTimeoutError }));
  }
};

export const handle3in1IFrameEvents = ({ data: msgData }) => {
  let parsedMsg = null;
  try {
    parsedMsg = JSON.parse(msgData);
  } catch (error) {
    return;
  }
  const { app, subType, data } = parsedMsg || {};
  if (app !== 'ucv3') return;
  window.lana?.log(`3-in-1 modal: ${subType}, data: ${JSON.stringify(data)}`);
  const threeInOne = document.querySelector('.three-in-one');
  const closeBtn = threeInOne?.querySelector('.dialog-close');
  const iframe = threeInOne?.querySelector('iframe');
  const relatedMerchCards = document.querySelectorAll(`a[data-modal-id="${threeInOne?.id}"]`);
  if (!threeInOne) return;
  switch (subType) {
    case MSG_SUBTYPE.AppLoaded:
      iframe?.setAttribute('data-pageloaded', 'true');
      iframe?.classList.remove('loading');
      threeInOne.querySelector('sp-theme')?.remove();
      if (closeBtn) {
        closeBtn.setAttribute('aria-hidden', 'true');
        closeBtn.style.opacity = '0';
        closeBtn.style.height = '1px';
        closeBtn.style.width = '1px';
      }
      break;
    case MSG_SUBTYPE.EXTERNAL:
    case MSG_SUBTYPE.SWITCH:
    case MSG_SUBTYPE.RETURN_BACK:
      if (data?.externalUrl && data.target) {
        window.open(data.externalUrl, data.target);
      }
      break;
    case MSG_SUBTYPE.Close:
      if (data?.actionRequired && data?.actionUrl) {
        window.open(data.actionUrl);
      }
      relatedMerchCards.forEach((card) => {
        card?.closest('merch-card')?.dispatchEvent(new CustomEvent(
          'merch-modal:addon-and-quantity-update',
          { detail: { id: threeInOne?.id, items: data?.state?.cart?.items } },
        ));
      });
      threeInOne?.dispatchEvent(new Event('closeModal'));
      window.removeEventListener('message', handle3in1IFrameEvents);
      break;
    default:
      break;
  }
};

export const handleTimeoutError = async () => {
  const modal = document.querySelector('.three-in-one');
  const miloIframe = modal?.querySelector('.milo-iframe');
  const iframe = modal?.querySelector('iframe');
  const theme = modal?.querySelector('sp-theme');
  if (iframe?.getAttribute('data-pageloaded') || !miloIframe || !iframe || !theme) return;
  const wasReloaded = iframe.getAttribute('data-wasreloaded') === 'true';

  await showErrorMsg({ iframe, miloIframe, showBtn: !wasReloaded, theme, handleTimeoutError });

  if (wasReloaded) {
    setTimeout(() => {
      modal?.dispatchEvent(new Event('closeModal'));
      window.removeEventListener('message', handle3in1IFrameEvents);
    }, 5000);
  }
};

export function createContent(iframeUrl) {
  const content = createTag('div', { class: 'milo-iframe' });
  // Detect Mobile Safari - it doesn't properly support loading="lazy" on iframes
  const isMobileSafari = /iPhone|iPad|iPod/.test(navigator.userAgent)
    && /WebKit/.test(navigator.userAgent)
    && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(navigator.userAgent);

  const loadingAttr = isMobileSafari ? '' : ' loading="lazy"';

  content.innerHTML = `<sp-theme system="light" color="light" scale="medium" dir="ltr" style="display: flex; justify-content: center; align-items: center; height: 100%;">
  <sp-progress-circle label="progress circle" indeterminate="" size="l" dir="ltr" role="progressbar" aria-label="progress circle"></sp-progress-circle>
  </sp-theme>
  <iframe src="${iframeUrl}" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen="true"${loadingAttr} class="loading" style="height: 100%;"></iframe>`;
  return content;
}

export default async function openThreeInOneModal(el) {
  const iframeUrl = el?.href;
  const modalType = el?.getAttribute('data-modal');
  const id = el?.getAttribute('data-modal-id');
  if (!modalType || !iframeUrl) return undefined;
  const { getModal } = await import('../modal/modal.js');
  const content = createContent(iframeUrl);
  const timeoutId = setTimeout(handleTimeoutError, 15000);
  const clearTimeoutOnClose = () => {
    clearTimeout(timeoutId);
    window.removeEventListener('milo:modal:closed', clearTimeoutOnClose);
  };
  window.addEventListener('milo:modal:closed', clearTimeoutOnClose);
  return getModal(null, {
    id,
    content,
    closeEvent: 'closeModal',
    class: 'three-in-one',
  });
}
