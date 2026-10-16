import { createTag, getMetadata } from '../../utils/utils.js';
import loadFragment from '../../blocks/fragment/fragment.js';
import { getModal } from '../../c2/blocks/modal/modal.js';

const DISMISSED_KEY = 'evnt027-login-prompt-dismissed';
const MODAL_ID = 'max26-login-prompt';
let activeTrigger;

export default function init() {
  if (activeTrigger) return activeTrigger;
  if (localStorage.getItem(DISMISSED_KEY)) return null;

  const path = getMetadata('max26-login-prompt');
  const targetSelector = getMetadata('max26-login-prompt-scroll-target');
  const delayValue = getMetadata('max26-login-prompt-delay') ?? (targetSelector ? '0' : '120');
  const delay = Number(delayValue) * 1000;
  if (!path) throw new Error('Missing max26-login-prompt fragment metadata.');
  if (!delayValue.trim() || !Number.isFinite(delay) || delay < 0) {
    throw new Error('max26-login-prompt-delay must be a non-negative number of seconds.');
  }
  // Validate authored selectors before installing event handlers.
  if (targetSelector) document.querySelector(targetSelector);

  let stopped = false;
  let preparing = false;
  let content;
  let timer;
  const listeners = [];
  const observer = new MutationObserver(() => check()); // eslint-disable-line no-use-before-define

  const stop = () => {
    stopped = true;
    clearTimeout(timer);
    observer.disconnect();
    listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
    if (activeTrigger === stop) activeTrigger = null;
  };

  const canOpen = () => {
    if (stopped || document.visibilityState !== 'visible'
      || localStorage.getItem(DISMISSED_KEY)
      || document.querySelector('.dialog-modal, .modal-curtain')
      || performance.now() < delay) return false;
    if (!targetSelector) return true;
    const target = document.querySelector(targetSelector);
    return !!target && target.getClientRects().length > 0
      && target.getBoundingClientRect().top < window.innerHeight;
  };

  async function check() {
    if (preparing || stopped) return;
    try {
      if (localStorage.getItem(DISMISSED_KEY)) {
        stop();
        return;
      }
      if (!canOpen()) return;
      preparing = true;
      if (!content) {
        content = createTag('div');
        const link = createTag('a', { href: path });
        content.append(link);
        await loadFragment(link);
        const block = content.querySelector('.max26-login-prompt');
        if (!block || block.dataset.blockStatus !== 'loaded') {
          throw new Error(`Could not load MAX login prompt fragment: ${path}`);
        }
      }
      // Loading the fragment can outlive a scroll, dismissal, or another modal.
      if (!canOpen()) return;
      const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
      await getModal(null, {
        id: MODAL_ID,
        title: heading?.textContent,
        content,
        closeCallback: () => {
          try {
            localStorage.setItem(DISMISSED_KEY, 'true');
          } catch (error) {
            window.lana?.log(`EVNT027 dismissal: ${error.message}`, { tags: 'evnt027', severity: 'error' });
            console.error('EVNT027 could not persist dismissal:', error);
          }
        },
      });
      stop();
    } catch (error) {
      stop();
      window.lana?.log(`EVNT027: ${error.message}`, { tags: 'evnt027', severity: 'error' });
      console.error('EVNT027 login prompt:', error);
    } finally {
      preparing = false;
    }
  }

  const listen = (target, type, handler = check) => {
    target.addEventListener(type, handler, { passive: true });
    listeners.push([target, type, handler]);
  };
  listen(window, 'scroll');
  listen(window, 'resize');
  listen(window, 'storage');
  // The shared modal dispatches its close event before removing the dialog.
  listen(window, 'milo:modal:closed', () => queueMicrotask(check));
  listen(document, 'visibilitychange');
  window.addEventListener('pagehide', stop, { once: true });
  listeners.push([window, 'pagehide', stop]);
  if (document.querySelector('main')) {
    observer.observe(document.querySelector('main'), { childList: true, subtree: true });
  }
  activeTrigger = stop;
  timer = setTimeout(check, Math.max(0, delay - performance.now()));
  return stop;
}
