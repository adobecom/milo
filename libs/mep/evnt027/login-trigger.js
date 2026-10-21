import { createTag, getMetadata } from '../../utils/utils.js';
import loadFragment from '../../blocks/fragment/fragment.js';
import { getModal } from '../../c2/blocks/modal/modal.js';

const DISMISSED_KEY = 'evnt027-login-prompt-dismissed';
const MODAL_ID = 'max26-login-prompt';
let activeTrigger;

export default function init() {
  if (activeTrigger) return activeTrigger;
  if (localStorage.getItem(DISMISSED_KEY)) return null;

  const fragmentPath = getMetadata('max26-login-prompt');
  if (!fragmentPath) throw new Error('Missing max26-login-prompt fragment metadata.');
  const fragmentUrl = new URL(fragmentPath, window.location.href);
  const params = fragmentUrl.searchParams;
  const targetClass = params.get('showAfter')?.replace(/^\./, '');
  if (params.has('showAfter')
    && (!targetClass || /\s/.test(targetClass) || targetClass.startsWith('#'))) {
    throw new Error('showAfter must name a single class, not an element ID or whitespace-separated list.');
  }
  const targetSelector = targetClass ? null : getMetadata('max26-login-prompt-scroll-target');
  const hasTarget = !!(targetClass || targetSelector);
  const authoredDelay = params.get('delay') ?? getMetadata('max26-login-prompt-delay');
  const hasDelay = authoredDelay !== null || !hasTarget;
  const delayValue = authoredDelay ?? (hasTarget ? '0' : '120');
  const delay = Number(delayValue) * 1000;
  const operator = params.get('operator') ?? 'and';
  if (!delayValue.trim() || !Number.isFinite(delay) || delay < 0) {
    throw new Error('MAX login prompt delay must be a non-negative number of seconds.');
  }
  if (operator !== 'and' && operator !== 'or') {
    throw new Error('MAX login prompt operator must be "and" or "or".');
  }
  // Validate authored selectors before installing event handlers.
  if (targetSelector) document.querySelector(targetSelector);
  ['delay', 'showAfter', 'operator'].forEach((name) => params.delete(name));
  const path = fragmentUrl.href;

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
      || document.querySelector('.dialog-modal, .modal-curtain')) return false;
    const conditions = [];
    if (hasDelay) conditions.push(performance.now() >= delay);
    if (hasTarget) {
      const target = targetClass
        ? document.getElementsByClassName(targetClass)[0] : document.querySelector(targetSelector);
      conditions.push(!!target && target.getClientRects().length > 0
        && target.getBoundingClientRect().top < window.innerHeight);
    }
    return operator === 'or' ? conditions.some(Boolean) : conditions.every(Boolean);
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
  if (hasDelay) timer = setTimeout(check, Math.max(0, delay - performance.now()));
  queueMicrotask(check);
  return stop;
}
