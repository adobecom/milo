import { createTag, getMetadata, loadIms } from '../../utils/utils.js';
import loadFragment from '../../blocks/fragment/fragment.js';
import { getModal } from '../../c2/blocks/modal/modal.js';

const DISMISSED_KEY = 'evnt027-login-prompt-dismissed';
const MODAL_ID = 'max26-login-prompt';
const DELAY = 120000;
let activeTrigger;

export default async function init() {
  if (activeTrigger) return activeTrigger;
  const { pathname } = window.location;
  const isSession = /^\/max\/2026\/sessions\/[^/]+\.html$/.test(pathname);
  const isTimed = ['/max.html', '/max-new.html', '/max/2026/sessions.html'].includes(pathname);
  if ((!isSession && !isTimed) || localStorage.getItem(DISMISSED_KEY)) return null;

  const path = getMetadata('max26-login-prompt');
  const boundarySelector = getMetadata('max26-login-prompt-scroll-target');
  if (!path) throw new Error('Missing max26-login-prompt fragment metadata.');
  if (isSession && !boundarySelector) {
    throw new Error('Individual session pages require max26-login-prompt-scroll-target metadata.');
  }
  // Validate authored selectors before installing event handlers.
  if (boundarySelector) document.querySelectorAll(boundarySelector);
  if (!window.adobeIMS?.initialized) await loadIms();
  if (window.adobeIMS.isSignedInUser()) return null;
  if (activeTrigger) return activeTrigger;

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

  const hasPassed = (element) => element.getClientRects().length > 0
    && element.getBoundingClientRect().bottom <= 0;

  const eligible = () => {
    if (stopped || document.visibilityState !== 'visible'
      || window.adobeIMS.isSignedInUser()
      || localStorage.getItem(DISMISSED_KEY)
      || document.querySelector('.dialog-modal, .modal-curtain')
      || (isTimed && performance.now() < DELAY)) return false;
    const boundaries = boundarySelector ? [...document.querySelectorAll(boundarySelector)] : [];
    if (boundarySelector && (!boundaries.length || !boundaries.every(hasPassed))) return false;
    if (pathname === '/max/2026/sessions.html') return true;
    // Treat embedded frames conservatively: never cover a player or open before passing it.
    const players = [...document.querySelectorAll('main video, main iframe')]
      .filter((element) => element.getClientRects().length > 0);
    return players.every(hasPassed);
  };

  async function check() {
    if (preparing || stopped) return;
    try {
      if (localStorage.getItem(DISMISSED_KEY) || window.adobeIMS.isSignedInUser()) {
        stop();
        return;
      }
      if (!eligible()) return;
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
      // Loading the fragment can outlive a scroll, sign-in, dismissal, or another modal.
      if (!eligible()) return;
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
  timer = setTimeout(check, isTimed ? Math.max(0, DELAY - performance.now()) : 0);
  return stop;
}
