import { runGeneralChecks } from '../panels/general.js';
import { checkImageDimensions } from './assets.js';
import { checkAlt } from '../accessibility/audit-image-alt-text.js';
import {
  checkLcpEl,
  checkSingleBlock,
  checkImageSize,
  checkVideoPoster,
  checkFragments,
  checkForPersonalization,
  checkPlaceholders,
  checkIcons,
} from './performance.js';
import {
  checkH1s,
  checkTitle,
  checkCanon,
  checkDescription,
  checkBody,
  checkLorem,
  validLinkFilter,
} from './seo.js';

// eslint-disable-next-line import/prefer-default-export
export async function openAllModals(area = document) {
  const links = area.querySelectorAll('main a[data-modal-hash]');
  // eslint-disable-next-line no-unused-vars
  for (const [index, link] of links.entries()) {
    try {
      // Scroll into view if necessary
      link.scrollIntoView({ behavior: 'instant', block: 'center' });
      // Use JavaScript to simulate a click without closing the previous modal
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      link.dispatchEvent(event);
    } catch (err) {
      // skip
    }
  }
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

window.preflightExecutors = {
  general: { runGeneralChecks },
  assets: {
    openAllModals,
    checkImageDimensions,
  },
  accessibility: { checkAlt },
  performance: {
    checkLcpEl,
    checkSingleBlock,
    checkImageSize,
    checkVideoPoster,
    checkFragments,
    checkForPersonalization,
    checkPlaceholders,
    checkIcons,
  },
  seo: {
    checkH1s,
    checkTitle,
    checkCanon,
    checkDescription,
    checkBody,
    checkLorem,
    validLinkFilter,
  },
};
window.dispatchEvent(new CustomEvent('content-insights-begin'));
