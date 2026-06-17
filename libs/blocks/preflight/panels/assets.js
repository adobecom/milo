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
function AssetMetric({ label, value, recommended }) {
  return html`
    <div class="asset-metric${recommended ? ' is-recommended' : ''}">
      <span class="asset-metric-label">${label}</span>
      <span class="asset-metric-value">${value}</span>
    </div>`;
}

function AssetGroup({ group }) {
  const { title, assetArray, empty } = group;
  const isCriticalGroup = title.includes('Critical');
  const isWarningGroup = title.includes('Warning');
  const headingClass = `grid-heading${isCriticalGroup ? ' is-critical' : ''}${isWarningGroup ? ' is-warning' : ''}`;

  return html`
    <div class="${headingClass}">
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
    const itemClass = isCriticalGroup ? 'assets-image-grid-item above-fold-critical' : 'assets-image-grid-item';

    return html`
      <div class='${itemClass}' title='${isCriticalGroup ? 'Above-the-fold asset with critical dimension issues' : ''}'>
        ${asset.type === 'image' && html`<img src='${asset.src}' />`}
        ${asset.type === 'video' && html`<video controls src='${asset.src}' />`}
        ${asset.type === 'mpc' && html`<iframe src='${asset.src}' />`}
        <div class='assets-image-grid-item-text'>
          <${AssetMetric} label="Factor" value=${asset.roundedFactor} />
          <${AssetMetric} label="Upload" value=${asset.naturalDimensions} />
          <${AssetMetric} label="Display" value=${asset.displayDimensions} />
          ${asset.hasMismatch && html`<${AssetMetric} label="Recommended" value=${asset.recommendedDimensions} recommended=${true} />`}
          <${AssetMetric} label="Type" value=${asset.typeLabel} />
          ${asset.notes && html`<p class="asset-note"><strong>Notes:</strong> ${asset.notes}</p>`}
          ${isCriticalGroup && html`<span class="asset-critical-pill">⚠️ Critical</span>`}
        </div>
      </div>`;
  })}
    </div>`}

    ${!viewportTooSmall.value && assetArray.value.length === 0 && html`
      <div class='assets-image-grid'>
        <div class='assets-image-grid-item full-width'>${empty || 'No assets found'}</div>
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
    { title: 'Critical Asset Issues (Above-the-fold)', assetArray: criticalAssetFailures, empty: 'No critical asset issues.' },
    { title: 'Warning Asset Issues (Below-the-fold)', assetArray: warningAssetFailures, empty: 'No warnings.' },
    { title: 'Assets with matching dimensions', assetArray: assetsWithMatch, empty: 'No matching assets found.' },
  ];

  return html`
    <div class="assets-columns">
      <${AssetsItem} ...${assetDimensionsResult.value} />
      ${groups.map((group) => html`<${AssetGroup} group=${group} />`)}
    </div>
  `;
}
