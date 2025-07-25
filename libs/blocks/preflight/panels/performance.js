import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { STATUS } from '../checks/constants.js';
import { getPreflightResults } from '../checks/preflightApi.js';
import { getLcpEntry } from '../checks/performance.js';

// Define signals for each performance check result
const lcpElResult = signal({ icon: 'purple', title: 'Valid LCP', description: 'Checking...' });
const singleBlockResult = signal({ icon: 'purple', title: 'Single Block', description: 'Checking...' });
const imageSizeResult = signal({ icon: 'purple', title: 'Images size', description: 'Checking...' });
const videoPosterResult = signal({ icon: 'purple', title: 'Videos', description: 'Checking...' });
const fragmentsResult = signal({ icon: 'purple', title: 'Fragments', description: 'Checking...' });
const personalizationResult = signal({ icon: 'purple', title: 'Personalization', description: 'Checking...' });
const placeholdersResult = signal({ icon: 'purple', title: 'Placeholders', description: 'Checking...' });
const iconsResult = signal({ icon: 'purple', title: 'Icons', description: 'Checking...' });

/**
 * Runs performance checks and updates signals with the results.
 */
async function getResults() {
  const signals = [
    lcpElResult,
    singleBlockResult,
    imageSizeResult,
    videoPosterResult,
    fragmentsResult,
    personalizationResult,
    placeholdersResult,
    iconsResult,
  ];

  const results = await getPreflightResults(window.location.pathname, document);
  const checks = results.runChecks.performance || [];

  const checkPromises = checks.map((resultOrPromise, index) => {
    const signalResult = signals[index];
    return Promise.resolve(resultOrPromise)
      .then((result) => {
        let icon;
        if (result.status === STATUS.PASS) {
          icon = 'green';
        } else if (result.status === STATUS.EMPTY) {
          icon = 'empty';
        } else if (result.status === STATUS.FAIL) {
          icon = result.severity === 'critical' ? 'red' : 'orange';
        } else {
          icon = 'orange';
        }

        signalResult.value = {
          icon,
          title: result.title.replace('Performance - ', ''),
          description: result.description,
        };
      })
      .catch((error) => {
        signalResult.value = {
          icon: 'red',
          title: 'Error',
          description: `Error: ${error.message}`,
        };
      });
  });

  await Promise.all(checkPromises);
}

/**
 * Component to display a single performance check result.
 */
function PerformanceItem({ icon, title, description }) {
  return html`
    <div class="preflight-item">
      <div class="result-icon ${icon}"></div>
      <div class="preflight-item-text">
        <p class="preflight-item-title">${title}</p>
        <p class="preflight-item-description">${description}</p>
      </div>
    </div>`;
}

/**
 * LCP Highlighting Functionality
 */
let clonedLcpSection;
async function highlightElement(event) {
  const lcp = await getLcpEntry(window.location.pathname, document);
  if (!lcp) return;
  const lcpSection = lcp.element.closest('.section');
  const tooltip = document.querySelector('.lcp-tooltip-modal');
  const { offsetHeight, offsetWidth } = lcpSection;
  const scaleFactor = Math.min(500 / offsetWidth, 500 / offsetHeight);

  if (!clonedLcpSection) {
    clonedLcpSection = lcpSection.cloneNode(true);
    clonedLcpSection.classList.add('lcp-clone');
  }

  Object.assign(clonedLcpSection.style, {
    width: `${lcpSection.offsetWidth}px`,
    height: `${lcpSection.offsetHeight}px`,
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'top left',
  });

  if (!tooltip.children.length) tooltip.appendChild(clonedLcpSection);

  const { top, left } = event.currentTarget.getBoundingClientRect();
  Object.assign(tooltip.style, {
    width: `${offsetWidth * scaleFactor}px`,
    height: `${offsetHeight * scaleFactor}px`,
    top: `${top + window.scrollY - offsetHeight * scaleFactor - 10}px`,
    left: `${left + window.scrollX}px`,
  });

  document.querySelector('.lcp-tooltip-modal').classList.add('show');
}

const removeHighlight = () => {
  document.querySelector('.lcp-tooltip-modal').classList.remove('show');
};

/**
 * Main Panel Component
 */
export default function Panel() {
  useEffect(() => {
    getResults();
  }, []);

  return html`
    <div class="preflight-columns">
      <div class="preflight-column">
        <${PerformanceItem} ...${lcpElResult.value} />
        <${PerformanceItem} ...${singleBlockResult.value} />
        <${PerformanceItem} ...${imageSizeResult.value} />
        <${PerformanceItem} ...${videoPosterResult.value} />
      </div>
      <div class="preflight-column">
        <${PerformanceItem} ...${fragmentsResult.value} />
        <${PerformanceItem} ...${personalizationResult.value} />
        <${PerformanceItem} ...${placeholdersResult.value} />
        <${PerformanceItem} ...${iconsResult.value} />
      </div>
      <div>Unsure on how to get this page fully into the green? Check out the <a class="performance-guidelines" href="https://milo.adobe.com/docs/authoring/performance/" target="_blank">Milo Performance Guidelines</a>.</div>
      <div> 
        <span class="performance-element-preview" onMouseEnter=${highlightElement} onMouseLeave=${removeHighlight}>
          Highlight the found LCP section
        </span> 
      </div>
      <div class="lcp-tooltip-modal"></div>
    </div>
  `;
}
