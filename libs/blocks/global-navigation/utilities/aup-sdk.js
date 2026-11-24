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
  clearPreservedAupModalHash,
  getAupModalHashCleanup,
  getAupModalTitle,
  getAupModalTrigger,
} from '../../merch/merch.js';

// Mirrors Milo modal close tracking (`${hash}:modalClose:${source}` daa-ll in modal.js).
export async function sendAupDialogCloseAnalytics(modalHash, source) {
  const { sendAnalytics } = await import('../../../martech/helpers.js');
  sendAnalytics(`${modalHash?.replace('#', '') || 'aup-workflow'}:modalClose:${source}`);
}

// Test seam for stubbing window.location.reload in unit tests.
export const aupPage = { reload: () => window.location.reload() };

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
      const modalTrigger = cleanupAupModalHash && getAupModalTrigger();
      const isIframe = element.tagName === 'IFRAME';
      const controller = new AbortController();
      let content;
      let dialog;
      let closeMiloModal;
      let finishLoading;
      let onNavigation;
      let onPageShow;
      let onWorkflowClose;
      let onWorkflowSuccess;
      let requestClose;
      let closing;
      let settled = false;
      let workflowClosed = false;
      let workflowSucceeded = false;
      const attachSpinner = () => {
        if (!isIframe || !content || content.querySelector('.aup-loading-indicator')) return null;
        const spinner = toFragment`
          <sp-theme system="spectrum" color="light" scale="medium" class="aup-loading-indicator">
            <sp-progress-circle label="Loading content" indeterminate size="l"></sp-progress-circle>
          </sp-theme>`;
        content.classList.add('loading');
        dialog?.classList.remove('hide-close-button');
        content.prepend(spinner);
        return spinner;
      };
      const cleanup = ({ preserveHistory = false, keepSpinner = false } = {}) => {
        controller.abort();
        if (keepSpinner) {
          if (finishLoading) element.removeEventListener('app_loaded', finishLoading);
          finishLoading = undefined;
        } else {
          finishLoading?.();
        }
        element.removeEventListener('close', onWorkflowClose);
        element.removeEventListener('success', onWorkflowSuccess);
        window.removeEventListener('popstate', onNavigation);
        window.removeEventListener('hashchange', onNavigation);
        window.removeEventListener('pageshow', onPageShow);
        if (cancelActiveDialog === requestClose) cancelActiveDialog = undefined;
        cleanupAupModalHash?.({ preserveHistory });
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
      onPageShow = async (event) => {
        if (!event.persisted || settled || closing || !dialog?.isConnected) return;
        const trigger = modalTrigger?.isConnected
          ? modalTrigger
          : (modalHash
            && document.querySelector(`[is="checkout-link"][data-modal-id="${CSS.escape(modalHash.slice(1))}"]`));
        if (!trigger) {
          aupPage.reload();
          return;
        }
        // Hide the frozen iframe behind the spinner immediately, settle the stale workflow
        // without changing history, and relaunch through the trigger CTA in place.
        attachSpinner();
        const previousDialog = dialog;
        const { aupCheckoutPromise } = modalTrigger ?? trigger;
        settled = true;
        if (!workflowClosed) {
          element.dispatchEvent(new Event('cancel'));
          if (!workflowClosed) element.dispatchEvent(new Event('close'));
        }
        cleanup({ preserveHistory: true, keepSpinner: true });
        const closeStaleDialog = () => {
          if (cancelActiveDialog === closeStaleDialog) cancelActiveDialog = undefined;
          return previousDialog.isConnected ? closeMiloModal(previousDialog, false) : undefined;
        };
        cancelActiveDialog = closeStaleDialog;
        closeCallback({ type: 'close' });
        await Promise.resolve(aupCheckoutPromise).catch(() => {});
        if (!previousDialog.isConnected || previousDialog.dataset.closing) {
          clearPreservedAupModalHash({ restore: true, hash: modalHash });
          if (cancelActiveDialog === closeStaleDialog) cancelActiveDialog = undefined;
          return;
        }
        if (request !== dialogRequest || (modalHash && window.location.hash !== modalHash)) {
          clearPreservedAupModalHash();
          if (request === dialogRequest) await closeStaleDialog();
          return;
        }
        const beforeRequest = dialogRequest;
        const finishFailedRelaunch = () => {
          if (dialogRequest !== beforeRequest) return undefined;
          const hasReplacementModal = [...document.querySelectorAll('.dialog-modal')]
            .some((modal) => modal !== previousDialog
              && !modal.id?.includes('locale-modal')
              && !modal.id?.includes('region-modal'));
          clearPreservedAupModalHash({ restore: !hasReplacementModal, hash: modalHash });
          return closeStaleDialog();
        };
        trigger.click();
        if (trigger.aupCheckoutPromise && trigger.aupCheckoutPromise !== aupCheckoutPromise) {
          trigger.aupCheckoutPromise.finally(finishFailedRelaunch);
        } else if (dialogRequest === beforeRequest) {
          await finishFailedRelaunch();
        }
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
        content = document.createElement('div');
        content.className = 'aup-workflow-content';
        const title = options?.title || element.getAttribute('aria-label')
          || modalTitle || element.getAttribute('title');
        const labelledBy = element.getAttribute('aria-labelledby');
        if (isIframe) {
          const spinner = attachSpinner();
          finishLoading = () => {
            element.removeEventListener('app_loaded', finishLoading);
            content.classList.remove('loading');
            dialog?.classList.add('hide-close-button');
            spinner?.remove();
            finishLoading = undefined;
          };
          element.addEventListener('app_loaded', finishLoading, { once: true });
        }
        content.appendChild(element);
        window.addEventListener('popstate', onNavigation);
        window.addEventListener('hashchange', onNavigation);
        window.addEventListener('pageshow', onPageShow);
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
