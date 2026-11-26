// Shared AUP SDK host used by the C1 and C2 global navigation.
import {
  getConfig,
  getMetadata,
  isAupSelectOn,
  getLingoRegion,
  lingoActive,
  loadScript,
  loadStyle,
} from '../../../utils/utils.js';
import { isDarkMode, toFragment } from './utilities.js';
import {
  AUP_SDK_READY_EVENT,
  clearForegroundTimeout,
  clearPreservedAupModalHash,
  getAupModalHashCleanup,
  getAupModalTitle,
  getAupModalTrigger,
  isLocaleModal,
  raceForegroundTimeout,
  setForegroundTimeout,
} from '../../merch/merch.js';

const AUP_RELAUNCH_SETTLE_TIMEOUT = 2000;
const AUP_IFRAME_LOAD_TIMEOUT = 15000;
const AUP_ERROR_CLOSE_DELAY = 5000;

function findCheckoutTrigger(modalHash) {
  const rawId = modalHash?.slice(1);
  if (!rawId) return null;
  const byId = (id) => document.querySelector(`[is="checkout-link"][data-modal-id="${CSS.escape(id)}"]`);
  let decodedId = rawId;
  try {
    decodedId = decodeURIComponent(rawId);
  } catch { /* keep raw */ }
  return byId(rawId) || (decodedId !== rawId ? byId(decodedId) : null);
}

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
      let loadTimeoutId;
      let errorCloseTimeoutId;
      let settled = false;
      let workflowClosed = false;
      let workflowSucceeded = false;
      const loadSpinnerDeps = () => Promise.all([
        import(`${config.base}/features/spectrum-web-components/dist/theme.js`),
        import(`${config.base}/features/spectrum-web-components/dist/progress-circle.js`),
      ]);
      const clearLoadTimers = () => {
        clearForegroundTimeout(loadTimeoutId);
        loadTimeoutId = undefined;
        clearTimeout(errorCloseTimeoutId);
        errorCloseTimeoutId = undefined;
      };
      const attachSpinner = () => {
        if (!content) return null;
        content.classList.add('loading');
        dialog?.classList.remove('hide-close-button');
        const existing = content.querySelector('.aup-loading-indicator');
        if (existing) {
          existing.style.display = '';
          return existing;
        }
        const spinner = toFragment`
          <sp-theme system="spectrum" color="light" scale="medium" class="aup-loading-indicator">
            <sp-progress-circle label="Loading content" indeterminate size="l"></sp-progress-circle>
          </sp-theme>`;
        content.prepend(spinner);
        if (!isIframe) loadSpinnerDeps().catch(() => {});
        return spinner;
      };
      const cleanup = ({ preserveHistory = false, keepSpinner = false } = {}) => {
        controller.abort();
        clearLoadTimers();
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
          : findCheckoutTrigger(modalHash);
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
        let onStaleDialogClose;
        const staleDialogClosed = new Promise((resolve) => { onStaleDialogClose = resolve; });
        previousDialog.closeCallback = () => {
          onStaleDialogClose();
        };
        const closeStaleDialog = () => {
          if (cancelActiveDialog === closeStaleDialog) cancelActiveDialog = undefined;
          return previousDialog.isConnected ? closeMiloModal(previousDialog, false) : undefined;
        };
        cancelActiveDialog = closeStaleDialog;
        closeCallback({ type: 'close' });
        const settleOutcome = await raceForegroundTimeout(
          Promise.race([
            Promise.resolve(aupCheckoutPromise).catch(() => {}).then(() => 'settled'),
            staleDialogClosed.then(() => 'closed'),
          ]),
          AUP_RELAUNCH_SETTLE_TIMEOUT,
          'timeout',
        );
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
        if (settleOutcome === 'timeout') {
          clearPreservedAupModalHash();
          aupPage.reload();
          return;
        }
        const beforeRequest = dialogRequest;
        const finishFailedRelaunch = () => {
          if (!previousDialog.isConnected || previousDialog.dataset.closing) return undefined;
          const hasReplacementModal = [...document.querySelectorAll('.dialog-modal')]
            .some((modal) => modal !== previousDialog && !isLocaleModal(modal));
          clearPreservedAupModalHash({ restore: !hasReplacementModal, hash: modalHash });
          return closeStaleDialog();
        };
        trigger.click();
        if (trigger.aupCheckoutPromise && trigger.aupCheckoutPromise !== aupCheckoutPromise) {
          trigger.aupCheckoutPromise.finally(finishFailedRelaunch).catch(() => {});
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
          ...(isIframe ? [loadSpinnerDeps()] : []),
        ]);
        closeMiloModal = closeModal;
        if (settled) {
          if (request === dialogRequest) await cancelActiveDialog?.();
          return;
        }
        if (request !== dialogRequest || (modalHash && window.location.hash !== modalHash)) {
          if (request === dialogRequest) await cancelActiveDialog?.();
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
            clearLoadTimers();
            element.removeEventListener('app_loaded', finishLoading);
            content.querySelector('.error-wrapper')?.remove();
            element.style.display = 'block';
            content.classList.remove('loading');
            dialog?.classList.add('hide-close-button');
            spinner?.remove();
            finishLoading = undefined;
          };
          const handleLoadTimeout = async () => {
            loadTimeoutId = undefined;
            if (!finishLoading || settled || closing || !dialog?.isConnected) return;
            const theme = content?.querySelector('.aup-loading-indicator');
            if (!theme) return;
            const wasReloaded = element.getAttribute('data-wasreloaded') === 'true';
            loadStyle(`${config.base}/blocks/merch/merch.css`);
            const { showErrorMsg } = await import('../../merch/three-in-one.js');
            if (!finishLoading || settled || closing || !dialog?.isConnected) return;
            content.classList.remove('loading');
            await showErrorMsg({
              iframe: element,
              miloIframe: content,
              showBtn: !wasReloaded,
              theme,
              onRetry: ({ msgWrapper }) => {
                msgWrapper.remove();
                element.setAttribute('data-wasreloaded', 'true');
                element.style.display = 'block';
                if (element.getAttribute('src')) {
                  // eslint-disable-next-line no-self-assign
                  element.src = element.src;
                } else if (element.srcdoc) {
                  // eslint-disable-next-line no-self-assign
                  element.srcdoc = element.srcdoc;
                }
                content.classList.add('loading');
                theme.style.display = '';
                clearLoadTimers();
                loadTimeoutId = setForegroundTimeout(handleLoadTimeout, AUP_IFRAME_LOAD_TIMEOUT);
              },
            });
            if (!finishLoading || settled || closing || !dialog?.isConnected) {
              content.querySelector('.error-wrapper')?.remove();
              return;
            }
            if (wasReloaded) {
              errorCloseTimeoutId = setTimeout(() => {
                errorCloseTimeoutId = undefined;
                requestClose();
              }, AUP_ERROR_CLOSE_DELAY);
            }
          };
          element.addEventListener('app_loaded', finishLoading, { once: true });
          loadTimeoutId = setForegroundTimeout(handleLoadTimeout, AUP_IFRAME_LOAD_TIMEOUT);
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
        if (request === dialogRequest) await cancelActiveDialog?.().catch(() => {});
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
