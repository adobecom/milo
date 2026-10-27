// Shared AUP SDK host used by the C1 and C2 global navigation.
import {
  getConfig,
  getMetadata,
  isAupSelectOn,
  getLingoRegion,
  lingoActive,
  loadScript,
} from '../../../utils/utils.js';
import { isDarkMode, toFragment } from './utilities.js';
import {
  AUP_SDK_READY_EVENT,
  getAupModalHashCleanup,
  getAupModalTitle,
} from '../../merch/merch.js';

// Mirrors Milo modal close tracking (`${hash}:modalClose:${source}` daa-ll in modal.js).
export async function sendAupDialogCloseAnalytics(modalHash, source) {
  const { sendAnalytics } = await import('../../../martech/helpers.js');
  sendAnalytics(`${modalHash?.replace('#', '') || 'aup-workflow'}:modalClose:${source}`);
}

async function createAupSdk() {
  const config = getConfig();
  const { imsClientId } = config;
  const cdnEnvironment = config.env.name === 'prod' ? 'prod' : 'stage';
  const commerceEnvironment = new URLSearchParams(window.location.search).get('commerce.env');
  const allowOverride = config.env.name !== 'prod';
  let environment = cdnEnvironment;
  if (allowOverride && commerceEnvironment?.toLowerCase() === 'prod') environment = 'prod';
  const lingoRegion = lingoActive() ? await getLingoRegion() : null;
  const locale = lingoRegion?.ietf || config.locale?.ietf || 'en-US';

  const sdkUrl = `https://shared-components.${cdnEnvironment === 'prod' ? '' : `${cdnEnvironment}.`}adobe.com/aup-sdk/stable/main.js`;
  try {
    await loadScript(sdkUrl, null, { mode: 'async' });
  } catch (e) {
    // loadScript reuses a failed tag and would wait forever; drop it so a retry re-downloads.
    document.head.querySelector(`script[src="${sdkUrl}"]:not([data-loaded])`)?.remove();
    throw e;
  }

  let cancelActiveDialog;
  let dialogRequest = 0;
  const claimedAupModalHashes = new WeakSet();
  return window.AUPSDK.preloadSDK('adobe-com-stable', {
    appId: 'adobe_com',
    apiKey: imsClientId,
    getAccessToken: () => Promise.resolve(window.adobeIMS?.getAccessToken()?.token),
    getProfile: async () => (
      window.adobeIMS?.isSignedInUser() ? window.adobeIMS.getProfile() : undefined
    ),
    environment,
    cdnEnvironment,
    locale,
    appName: 'adobecom',
    appVersion: '1.0',
    colorScheme: isDarkMode() ? 'dark' : 'light',
    showDialog: async (element, options, closeCallback) => {
      dialogRequest += 1;
      const request = dialogRequest;
      const availableAupCleanup = getAupModalHashCleanup();
      const canClaimHash = availableAupCleanup && !claimedAupModalHashes.has(availableAupCleanup);
      const cleanupAupModalHash = canClaimHash
        ? availableAupCleanup : undefined;
      if (cleanupAupModalHash) claimedAupModalHashes.add(cleanupAupModalHash);
      const modalHash = cleanupAupModalHash && window.location.hash;
      const modalTitle = cleanupAupModalHash && getAupModalTitle();
      const isIframe = element.tagName === 'IFRAME';
      const controller = new AbortController();
      let dialog;
      let closeMiloModal;
      let finishLoading;
      let onNavigation;
      let onWorkflowClose;
      let onWorkflowSuccess;
      let requestClose;
      let closing;
      let settled = false;
      let workflowClosed = false;
      let workflowSucceeded = false;
      const cleanup = () => {
        controller.abort();
        finishLoading?.();
        element.removeEventListener('close', onWorkflowClose);
        element.removeEventListener('success', onWorkflowSuccess);
        window.removeEventListener('popstate', onNavigation);
        window.removeEventListener('hashchange', onNavigation);
        if (cancelActiveDialog === requestClose) cancelActiveDialog = undefined;
        cleanupAupModalHash?.();
      };
      const finishWorkflow = () => {
        if (settled) return;
        settled = true;
        if (!workflowClosed) {
          element.dispatchEvent(new Event('cancel'));
          if (!workflowClosed) element.dispatchEvent(new Event('close'));
        }
        cleanup();
        closeCallback({ type: 'close' });
      };
      requestClose = () => {
        if (closing) return closing;
        if (settled) return undefined;
        if (dialog) closing = closeMiloModal(dialog);
        else finishWorkflow();
        return closing;
      };
      onWorkflowSuccess = () => {
        workflowSucceeded = true;
      };
      onWorkflowClose = () => {
        // Closes started by the Milo modal (button, curtain, Escape) carry their own daa-ll
        // and settle first; an unsettled close from the workflow is the user dismissing it.
        if (dialog && !settled && !closing && !workflowSucceeded) {
          sendAupDialogCloseAnalytics(modalHash, 'buttonClose');
        }
        workflowClosed = true;
        requestClose();
      };
      onNavigation = () => {
        if (modalHash && window.location.hash !== modalHash) requestClose();
      };
      element.addEventListener('close', onWorkflowClose);
      element.addEventListener('success', onWorkflowSuccess);
      try {
        const isC2 = getMetadata('foundation')?.toLowerCase() === 'c2';
        const [{ getModal, closeModal }] = await Promise.all([
          import(isC2 ? '../../../c2/blocks/modal/modal.js' : '../../modal/modal.js'),
          ...(isIframe ? [
            import(`${config.base}/features/spectrum-web-components/dist/theme.js`),
            import(`${config.base}/features/spectrum-web-components/dist/progress-circle.js`),
          ] : []),
        ]);
        closeMiloModal = closeModal;
        if (settled) return;
        if (request !== dialogRequest || (modalHash && window.location.hash !== modalHash)) {
          await requestClose();
          return;
        }
        await cancelActiveDialog?.();
        if (request !== dialogRequest || (modalHash && window.location.hash !== modalHash)) {
          await requestClose();
          return;
        }
        const content = document.createElement('div');
        content.className = 'aup-workflow-content';
        const title = options?.title || element.getAttribute('aria-label')
          || modalTitle || element.getAttribute('title');
        const labelledBy = element.getAttribute('aria-labelledby');
        if (isIframe) {
          const spinner = toFragment`
            <sp-theme system="spectrum" color="light" scale="medium" class="aup-loading-indicator">
              <sp-progress-circle label="Loading content" indeterminate size="l"></sp-progress-circle>
            </sp-theme>`;
          content.classList.add('loading');
          content.appendChild(spinner);
          finishLoading = () => {
            element.removeEventListener('app_loaded', finishLoading);
            content.classList.remove('loading');
            dialog?.classList.add('hide-close-button');
            spinner.remove();
            finishLoading = undefined;
          };
          element.addEventListener('app_loaded', finishLoading, { once: true });
        }
        content.appendChild(element);
        window.addEventListener('popstate', onNavigation);
        window.addEventListener('hashchange', onNavigation);
        dialog = await getModal(null, {
          id: 'aup-workflow-dialog',
          class: 'aup-modal',
          content,
          title,
          hash: modalHash,
          signal: controller.signal,
          closeEvent: 'closeModal',
          closeCallback: finishWorkflow,
        });
        if (settled) {
          if (dialog?.isConnected) await closeMiloModal(dialog);
          return;
        }
        if (request !== dialogRequest || (modalHash && window.location.hash !== modalHash)) {
          await requestClose();
          return;
        }
        if (!finishLoading) dialog.classList.add('hide-close-button');
        if (labelledBy) {
          dialog.setAttribute('aria-labelledby', labelledBy);
          dialog.removeAttribute('aria-label');
        } else if (title) {
          dialog.setAttribute('aria-label', title);
        }
        cancelActiveDialog = requestClose;
      } catch (e) {
        cleanup();
        throw e;
      }
    },
  });
}

let pendingAupSdk;

// Safe to call repeatedly: the SDK is created once (concurrent callers share it) and every call
// re-applies features, so a late aup-select change reaches an already loaded SDK.
export async function preloadAupSdk() {
  if (!window.aupsdk) {
    pendingAupSdk ??= createAupSdk().finally(() => { pendingAupSdk = undefined; });
    const sdk = await pendingAupSdk;
    window.aupsdk = window.aupsdk || sdk;
  }

  const features = ['useToasts'];
  if (isAupSelectOn()) features.push('tmp_aupsdk_ucv3_in_iframe');
  await window.aupsdk.updateConfig({ miniAppContext: { features } });
  window.dispatchEvent(new CustomEvent(AUP_SDK_READY_EVENT));
  return window.aupsdk;
}
