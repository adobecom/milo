import initModal from '../../../c2/blocks/modal/modal.js';
import initTrigger from '../login-trigger.js';

export default function init(el) {
  const { modalHash, modalPath } = el.dataset;
  if (modalHash !== '#max26-login-prompt' && !modalHash?.startsWith('#max26-login-prompt:')) {
    return initModal(el);
  }
  if (!modalPath) throw new Error('MAX login prompt requires a modal fragment path.');
  const url = new URL(modalPath, window.location.href);
  url.hash = modalHash;
  // Consume the automatic trigger so clicks/hash changes cannot bypass its guards.
  el.remove();
  return initTrigger({ path: url.href });
}
