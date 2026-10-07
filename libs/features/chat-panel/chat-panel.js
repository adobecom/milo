import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { bcBootstrap, mountId } from '../../blocks/brand-concierge/bc-bootstrap.js';
import { getBetaLabel } from '../../blocks/brand-concierge/bc-utils.js';
import { getAnalyticsLabel } from '../../blocks/brand-concierge/bc-analytics.js';

let initialization = null;
let bootstrapPromise = null;
let panelEl = null;
let toggleEl = null;

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
  return createTag('button', {
    id: 'chat-panel-toggle',
    'aria-label': 'Open chat',
    'aria-expanded': 'false',
    'aria-controls': 'chat-panel',
  }, 'Chat');
}

export function isChatPanelOpen() {
  return document.body.classList.contains('chat-panel-open');
}

export function closeChatPanel() {
  if (!isChatPanelOpen()) return;
  document.body.classList.remove('chat-panel-open');
  toggleEl?.setAttribute('aria-expanded', 'false');
  localStorage.setItem('bc-side-overlay', 'closed');
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
  if (!bootstrapPromise) {
    bootstrapPromise = bcBootstrap(initialMessage || null, mountId);
    await bootstrapPromise;
  } else if (initialMessage) {
    await bootstrapPromise;
    await bcBootstrap(initialMessage, mountId);
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeChatPanel();
}

/**
 * Build the panel DOM + wire up close/toggle/Escape. Idempotent — calling
 * again is a no-op. Does NOT open the panel; callers must call openChatPanel().
 */
export default function init() {
  if (initialization && (!panelEl || document.contains(panelEl))) return initialization;
  panelEl = null;
  bootstrapPromise = null;
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
  })();
  return initialization;
}
