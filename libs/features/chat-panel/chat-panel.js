import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { bcBootstrap, mountId } from '../../blocks/brand-concierge/bc-bootstrap.js';
import { getBetaLabel } from '../../blocks/brand-concierge/bc-utils.js';

let initialized = false;
let bootstrapped = false;
let toggleEl = null;

function buildPanel() {
  const panel = createTag('aside', { id: 'chat-panel', 'aria-label': 'Chat' });

  // Match the "Ask BETA" styling from the legacy #brand-concierge-side header:
  // an `h1.bc-modal-title` next to `getBetaLabel()` (the pill from bc-utils).
  const title = createTag('h1', { class: 'bc-modal-title' }, 'Ask');
  const closeBtn = createTag('button', { class: 'chat-panel-close', 'aria-label': 'Close chat' }, '✕');
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
  if (!initialized) return;
  document.body.classList.remove('chat-panel-open');
  toggleEl?.setAttribute('aria-expanded', 'false');
}

export function openChatPanel(initialMessage) {
  if (!initialized) return;
  document.body.classList.add('chat-panel-open');
  toggleEl?.setAttribute('aria-expanded', 'true');
  if (!bootstrapped) {
    bootstrapped = true;
    bcBootstrap(initialMessage || null, mountId);
  } else if (initialMessage) {
    // Same pattern as the legacy routeInput's `if (isOpen) bcBootstrap(text)`:
    // set dataset.initialMessage and re-invoke bootstrap so BC picks it up.
    bcBootstrap(initialMessage, mountId);
  }
}

/**
 * Build the panel DOM + wire up close/toggle/Escape. Idempotent — calling
 * again is a no-op. Does NOT open the panel; callers must call openChatPanel().
 */
export default async function init() {
  if (initialized) return;
  initialized = true;

  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot || '/libs';
  await new Promise((resolve) => {
    loadStyle(`${base}/features/chat-panel/chat-panel.css`, resolve);
  });

  const { panel, closeBtn } = buildPanel();
  const toggle = buildToggle();
  toggleEl = toggle;
  document.body.append(panel, toggle);

  toggle.addEventListener('click', () => openChatPanel());
  closeBtn.addEventListener('click', closeChatPanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isChatPanelOpen()) closeChatPanel();
  });
}
