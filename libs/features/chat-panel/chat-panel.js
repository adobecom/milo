import {
  createTag,
  getConfig,
  loadStyle,
  isAcomAssistantPanelEnabled,
} from '../../utils/utils.js';
import { getBetaLabel } from '../../blocks/brand-concierge/bc-utils.js';
import { getAnalyticsLabel } from '../../blocks/brand-concierge/bc-analytics.js';
import initJarvisPanel from './jarvis-panel.js';

const mountId = 'brand-concierge-mount';
let initialization = null;
let bootstrapPromise = null;
let panelEl = null;
let jarvisClient = null;

function buildPanel() {
  const panel = createTag('aside', { id: 'chat-panel', 'aria-label': 'Chat' });

  // Match the "Ask BETA" styling from the legacy #brand-concierge-side header:
  // an `h1.bc-modal-title` next to `getBetaLabel()` (the pill from bc-utils).
  const title = createTag('h1', { class: 'bc-modal-title' }, 'Ask');
  const closeBtn = createTag('button', {
    class: 'chat-panel-close',
    'aria-label': 'Close chat',
    'daa-ll': getAnalyticsLabel('modal-close'),
  }, '✕');
  const header = createTag('div', { class: 'chat-panel-header bc-modal-header' }, [title, getBetaLabel(), closeBtn]);

  const mountEl = createTag('div', { id: mountId });
  panel.append(header, mountEl);

  return { panel, closeBtn };
}

const GNAV_SLOT_TIMEOUT = 10000;

function placeGnavMount(mount, slot, panel) {
  // The panel may have been torn down (e.g. replaced page content) while waiting for the gnav.
  if (!panel.isConnected) return;
  if (slot) {
    mount.classList.add('chat-panel-gnav');
    slot.after(mount);
  } else {
    document.body.append(mount);
  }
}

// Sits after the gnav utilities. Federal renders the gnav asynchronously, so wait
// for it; pages without a gnav (or one that never renders) get a floating mount.
function mountGnav(mount, panel) {
  const header = document.querySelector('header.global-navigation');
  const find = () => header?.querySelector('.feds-utilities');
  if (!header || find()) {
    placeGnavMount(mount, find(), panel);
    return;
  }
  let timer;
  const observer = new MutationObserver(() => {
    const slot = find();
    if (!slot) return;
    observer.disconnect();
    clearTimeout(timer);
    placeGnavMount(mount, slot, panel);
  });
  timer = setTimeout(() => {
    observer.disconnect();
    placeGnavMount(mount, null, panel);
  }, GNAV_SLOT_TIMEOUT);
  observer.observe(header, { childList: true, subtree: true });
}

export function isChatPanelOpen() {
  return document.body.classList.contains('chat-panel-open');
}

function setChatPanelOpen(open) {
  if (isChatPanelOpen() === open) return;
  document.body.classList.toggle('chat-panel-open', open);
  localStorage.setItem('bc-side-overlay', open ? 'open' : 'closed');
  window.dispatchEvent(new CustomEvent(open ? 'bc:side-modal-open' : 'bc:side-modal-close'));
}

export function closeChatPanel() {
  if (!isChatPanelOpen()) return;
  setChatPanelOpen(false);
  jarvisClient?.closeMessageWindow();
}

function reportPanelError(error) {
  window.lana?.log(`Jarvis panel: ${error.message}`, { tags: 'brand-concierge', severity: 'error' });
  const mount = panelEl.querySelector(`#${mountId}`);
  if (!mount.querySelector('[role="alert"]')) {
    mount.append(createTag('p', { role: 'alert' }, 'Chat could not be loaded. Please reload the page to try again.'));
  }
}

/**
 * Shared entrypoint for Milo and C2. Wait for the singleton panel before
 * bootstrapping; reopening without a new message preserves the conversation.
 */
export async function openChatPanel(initialMessage) {
  // eslint-disable-next-line no-use-before-define
  await init();
  setChatPanelOpen(true);
  try {
    jarvisClient = await bootstrapPromise;
    if (!isChatPanelOpen()) return;
    if (initialMessage) {
      const accepted = jarvisClient.sendUserMessage({ label: initialMessage });
      if (!accepted) throw new Error('Jarvis did not accept the panel prompt');
    } else {
      jarvisClient.openMessagingWindow({ sourceType: 'button', sourceText: 'Ask' });
    }
  } catch (error) {
    reportPanelError(error);
    throw error;
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeChatPanel();
}

function handleJarvisLink(event) {
  if (!isAcomAssistantPanelEnabled() || !event.target.closest('a[href*="#open-jarvis-chat"]')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openChatPanel();
}

/**
 * Build the panel DOM, initialize the SDK entrypoint, and wire up close/Escape.
 * Idempotent — calling again is a no-op. Does NOT open the panel.
 */
export default function init() {
  if (initialization && (!panelEl || document.contains(panelEl))) return initialization;
  panelEl = null;
  bootstrapPromise = null;
  jarvisClient = null;
  initialization = (async () => {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot || '/libs';
    await new Promise((resolve) => {
      loadStyle(`${base}/features/chat-panel/chat-panel.css`, resolve);
    });

    const { panel, closeBtn } = buildPanel();
    const gnavMount = createTag('div', {
      id: 'acomAssistant-gnav-mount',
      class: 'chat-panel-entrypoint',
      style: 'visibility: hidden',
    });
    panelEl = panel;
    document.body.append(panel);
    mountGnav(gnavMount, panel);

    closeBtn.addEventListener('click', closeChatPanel);
    document.removeEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);
    document.removeEventListener('click', handleJarvisLink, true);
    document.addEventListener('click', handleJarvisLink, true);

    bootstrapPromise = initJarvisPanel(mountId, ({ state }) => {
      if (state === 'hidden') setChatPanelOpen(false);
      if (state === 'panel' || state === 'maximised') setChatPanelOpen(true);
    });
    bootstrapPromise.then((client) => {
      jarvisClient = client;
      gnavMount.style.visibility = '';
    }, reportPanelError);
  })();
  return initialization;
}
