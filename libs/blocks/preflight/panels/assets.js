import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { STATUS } from '../checks/constants.js';
import { getPreflightResults } from '../checks/preflightApi.js';
import { isViewportTooSmall } from '../checks/assets.js';

// Define signals for check results and viewport status
const assetDimensionsResult = signal({
  title: 'Asset Dimensions',
  description: 'Checking...',
});
const assetsWithMismatch = signal([]);
const assetsWithMatch = signal([]);
const criticalAssetFailures = signal([]);
const warningAssetFailures = signal([]);
const viewportTooSmall = signal(isViewportTooSmall());

/**
 * Runs asset checks and updates signals with the results.
 */
async function getResults() {
  const results = await getPreflightResults({
    url: window.location.pathname,
    area: document,
    useCache: false,
    injectVisualMetadata: false,
  });

  if (!results) return; // Page is excluded from preflight checks

  const checks = results.runChecks.assets || [];

  const result = await Promise.resolve(checks[0]).catch((error) => ({
    title: 'Assets - Image Dimensions',
    status: STATUS.FAIL,
    description: `Error: ${error.message}`,
  }));

  assetDimensionsResult.value = {
    title: result.title.replace('Assets - ', ''),
    description: result.description,
  };

  if (result.details) {
    assetsWithMismatch.value = result.details.assetsWithMismatch || [];
    assetsWithMatch.value = result.details.assetsWithMatch || [];
    criticalAssetFailures.value = result.details.criticalAssetFailures || [];
    warningAssetFailures.value = result.details.warningAssetFailures || [];
  }
}

/**
 * Navigate to an asset element on the page:
 * 1. Close the Preflight modal.
 * 2. Scroll the element into view and focus it.
 * 3. Show the 'Back to Preflight' popover.
 */
function navigateToAsset(asset) {
  // Find the element on the page by src
  const el = document.querySelector(`img[src="${asset.src}"], video[src="${asset.src}"]`);

  // Close the Preflight modal
  const modal = document.querySelector('.dialog-modal#preflight');
  if (modal) {
    // Dispatch a close event that the modal infrastructure listens to
    modal.dispatchEvent(new CustomEvent('closeModal', { bubbles: true }));
    // Also try clicking the close button if present
    const closeBtn = modal.querySelector('.dialog-close, [aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  }

  // Scroll and focus the element
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    el.style.outline = '3px solid var(--s2a-color-accent-primary, #0265dc)';
    setTimeout(() => { el.style.outline = ''; }, 3000);
  }

  // Show 'Back to Preflight' popover
  showBackPopover();
}

/**
 * Show the 'Back to Preflight' popover pinned to top-left of viewport.
 */
function showBackPopover() {
  let popover = document.querySelector('.preflight-back-popover');
  if (!popover) {
    popover = document.createElement('button');
    popover.className = 'preflight-back-popover';
    popover.innerHTML = '<span class="preflight-back-popover-icon">←</span> Back to Preflight';
    popover.addEventListener('click', () => {
      popover.remove();
      // Re-open Preflight by dispatching the same event the sidekick uses
      window.dispatchEvent(new CustomEvent('preflight:reopen'));
      // Fallback: find and click the preflight trigger
      const trigger = document.querySelector('[data-preflight-trigger], .preflight-trigger');
      if (trigger) trigger.click();
    });
    document.body.appendChild(popover);
  }
}

/**
 * Component to display a single asset check result.
 */
function AssetsItem({ title, description }) {
  return html`
    <div class="assets-item">
      <div class="assets-item-text">
        <p class="assets-item-title">${title}</p>
        <p class="assets-item-description">${description}</p>
      </div>
    </div>`;
}

/**
 * Component to display a group of assets.
 */
function AssetGroup({ group }) {
  const { title, assetArray } = group;
  const isCriticalGroup = title.includes('Critical');

  return html`
    <div class="grid-heading">
      <div class="grid-toggle">${title}</div>
    </div>

    ${viewportTooSmall.value && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>Please resize your browser to at least 1200px width to run image checks</div>
      </div>
    `}

    ${!viewportTooSmall.value && assetArray.value.length > 0 && html`
    <div class='assets-image-grid'>
      ${assetArray.value.map((asset) => {
    const isAboveFoldWithMismatch = isCriticalGroup;
    const itemClass = isAboveFoldWithMismatch ? 'assets-image-grid-item above-fold-critical' : 'assets-image-grid-item';

    return html`
      <div
        class='${itemClass}'
        title='${isAboveFoldWithMismatch ? 'Above-the-fold asset with critical dimension issues' : ''}'
        onClick=${() => navigateToAsset(asset)}
        role="button"
        tabIndex="0"
        onKeyDown=${(e) => { if (e.key === 'Enter' || e.key === ' ') navigateToAsset(asset); }}>
        ${asset.type === 'image' && html`<img src='${asset.src}' alt="" />`}
        ${asset.type === 'video' && html`<video controls src='${asset.src}' />`}
        ${asset.type === 'mpc' && html`<iframe src='${asset.src}' title="asset" />`}
        <div class='assets-image-grid-item-text'>
          <span>Factor: ${asset.roundedFactor}</span>
          <span>Upload size: ${asset.naturalDimensions}</span>
          <span>Display size: ${asset.displayDimensions}</span>
          ${asset.hasMismatch && html`<span>Recommended size: ${asset.recommendedDimensions}</span>`}
          <span>Type: ${asset.typeLabel}</span>
          ${asset.notes && html`<span><strong>Notes:</strong> ${asset.notes}</span>`}
          ${isAboveFoldWithMismatch && html`<span class="above-fold-notice"><strong>⚠️ CRITICAL:</strong></span>`}
        </div>
      </div>`;
  })}
    </div>`}

    ${!viewportTooSmall.value && assetArray.value.length === 0 && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>No assets found</div>
      </div>
    `}
  `;
}

/**
 * Main Panel Component
 */
export default function Assets() {
  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isSmall = isViewportTooSmall();
        if (viewportTooSmall.value !== isSmall) {
          viewportTooSmall.value = isSmall;
          if (!isSmall) getResults();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    if (!viewportTooSmall.value) getResults();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const groups = [
    { title: 'Critical Asset Issues (Above-the-fold)', assetArray: criticalAssetFailures },
    { title: 'Warning Asset Issues (Below-the-fold)', assetArray: warningAssetFailures },
    { title: 'Assets with matching dimensions', assetArray: assetsWithMatch },
  ];

  return html`
    <div class="assets-columns">
      <${AssetsItem} ...${assetDimensionsResult.value} />
      ${groups.map((group) => html`<${AssetGroup} group=${group} />`)}
    </div>
  `;
}
