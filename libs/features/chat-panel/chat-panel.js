import {
  createTag,
  getConfig,
  loadStyle,
  isAcomAssistantPanelEnabled,
} from '../../utils/utils.js';
import { aiIcon, getBetaLabel } from '../../blocks/brand-concierge/bc-utils.js';
import { getAnalyticsLabel } from '../../blocks/brand-concierge/bc-analytics.js';
import initJarvisPanel from './jarvis-panel.js';

const mountId = 'brand-concierge-mount';
let initialization = null;
let bootstrapPromise = null;
let panelEl = null;
let toggleEl = null;
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

function buildToggle() {
  const icon = createTag('span', {
    class: 'chat-panel-toggle-icon',
    'aria-hidden': 'true',
  }, aiIcon('chat-panel-toggle-ai', 'chat-panel-ai-icon', null, 20));
  const label = createTag('span', { class: 'chat-panel-toggle-label' }, 'Ask');
  return createTag('button', {
    id: 'chat-panel-toggle',
    type: 'button',
    class: 'no-track',
    'aria-label': 'Ask Adobe',
    'aria-expanded': 'false',
    'aria-controls': 'chat-panel',
    'daa-ll': getAnalyticsLabel('floating-bc'),
  }, [icon, label]);
}

export function isChatPanelOpen() {
  return document.body.classList.contains('chat-panel-open');
}

export function closeChatPanel() {
  if (!isChatPanelOpen()) return;
  document.body.classList.remove('chat-panel-open');
  toggleEl?.setAttribute('aria-expanded', 'false');
  localStorage.setItem('bc-side-overlay', 'closed');
  jarvisClient?.closeMessageWindow();
  window.dispatchEvent(new CustomEvent('bc:side-modal-close'));
}

/**
 * Shared entrypoint for Milo and C2. Wait for the singleton panel before
 * bootstrapping; reopening without a new message preserves the conversation.
 */
export async function openChatPanel(initialMessage) {
  // eslint-disable-next-line no-use-before-define
  await init();
  const wasOpen = isChatPanelOpen();
  document.body.classList.add('chat-panel-open');
  toggleEl?.setAttribute('aria-expanded', 'true');
  localStorage.setItem('bc-side-overlay', 'open');
  if (!wasOpen) window.dispatchEvent(new CustomEvent('bc:side-modal-open'));
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = initJarvisPanel(mountId, ({ state }) => {
        if (state === 'hidden') closeChatPanel();
      });
    }
    jarvisClient = await bootstrapPromise;
    if (!isChatPanelOpen()) return;
    if (initialMessage) {
      const accepted = jarvisClient.sendUserMessage({ label: initialMessage });
      if (!accepted) throw new Error('Jarvis did not accept the panel prompt');
    } else {
      jarvisClient.openMessagingWindow({ sourceType: 'button', sourceText: 'Ask' });
    }
  } catch (error) {
    window.lana?.log(`Jarvis panel: ${error.message}`, { tags: 'brand-concierge', severity: 'error' });
    const mount = panelEl.querySelector(`#${mountId}`);
    if (!mount.querySelector('[role="alert"]')) {
      mount.append(createTag('p', { role: 'alert' }, 'Chat could not be loaded. Please reload the page to try again.'));
    }
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
 * Build the panel DOM + wire up close/toggle/Escape. Idempotent — calling
 * again is a no-op. Does NOT open the panel; callers must call openChatPanel().
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
    const toggle = buildToggle();
    panelEl = panel;
    toggleEl = toggle;
    document.body.append(panel, toggle);

    toggle.addEventListener('click', () => openChatPanel());
    closeBtn.addEventListener('click', closeChatPanel);
    document.removeEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);
    document.removeEventListener('click', handleJarvisLink, true);
    document.addEventListener('click', handleJarvisLink, true);
  })();
  return initialization;
}
