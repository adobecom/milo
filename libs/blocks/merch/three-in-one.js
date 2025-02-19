/* eslint-disable import/no-relative-packages */
import { createTag } from '../../utils/utils.js';
import { MODAL_TYPE_3_IN_1 } from '../../deps/mas/mas.js';
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

export const handle3in1IFrameEvents = ({ data: msgData }) => {
  let parsedMsg = null;
  try {
    parsedMsg = JSON.parse(msgData);
  } catch (error) {
    return;
  }
  const { app, subType, data } = parsedMsg || {};
  if (app !== 'ucv3') return;
  window.lana?.log(`3-in-1 modal: ${subType}`, LANA_OPTIONS);
  const threeInOne = document.querySelector('.three-in-one');
  const closeBtn = threeInOne?.querySelector('.dialog-close');
  if (!threeInOne) return;
  switch (subType) {
    case MSG_SUBTYPE.AppLoaded:
      threeInOne.querySelector('iframe')?.classList.remove('loading');
      threeInOne.querySelector('sp-theme')?.remove();
      if (closeBtn) {
        closeBtn.setAttribute('aria-hidden', 'true');
        closeBtn.style.opacity = '0';
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
      document.querySelector('.dialog-modal.three-in-one')?.dispatchEvent(new Event('closeModal'));
      window.removeEventListener('message', handle3in1IFrameEvents);
      break;
    default:
      break;
  }
};

export async function createContent(iframeUrl, modalType) {
  const content = createTag('div', { class: 'milo-iframe' });
  content.innerHTML = `<sp-theme system="light" color="light" scale="medium" dir="ltr">
  <sp-progress-circle label="progress circle" indeterminate="" size="l" dir="ltr" role="progressbar" aria-label="progress circle"></sp-progress-circle>
  </sp-theme>
  <iframe src="${iframeUrl}" title="${modalType === MODAL_TYPE_3_IN_1.CRM ? 'Single App' : modalType}" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen="true" loading="lazy" class="loading" style="height: 100%;"></iframe>`;
  return content;
}

export default async function openThreeInOneModal(el) {
  const iframeUrl = el?.href;
  const modalType = el?.getAttribute('data-modal-type');
  if (!modalType || !iframeUrl) return undefined;
  const { getModal } = await import('../modal/modal.js');
  const content = await createContent(iframeUrl, modalType);
  return getModal(null, {
    id: 'three-in-one',
    content,
    closeEvent: 'closeModal',
    class: 'three-in-one',
  });
}
