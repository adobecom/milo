import loadPrivacyBanner from '../privacy-banner/privacy-banner.js';
import loadPrivacyModal from './privacy-modal.js';

/**
 * Initialize the privacy flow (banner + modal event binding)
 *
 * @param {object} config         - Milo/federal config
 * @param {function} createTag    - Milo createTag
 * @param {function} getMetadata  - Milo getMetadata
 * @param {function} loadBlock    - Milo loadBlock
 * @param {function} loadStyle    - Milo loadStyle
 */
export function initPrivacy(config, createTag, getMetadata, loadBlock, loadStyle) {
  // 1. Show privacy banner right away
  loadPrivacyBanner(config, createTag, getMetadata, loadStyle);

  // 2. Listen for "open modal" event (from banner/settings button)
  document.addEventListener('adobePrivacy:OpenModal', () => {
    loadPrivacyModal(config, createTag, getMetadata, loadBlock, loadStyle);
  });
}

// Optionally, you can default-export the function too:
export default initPrivacy;
