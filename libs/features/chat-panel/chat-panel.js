import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { bcBootstrap, mountId } from '../../blocks/brand-concierge/bc-bootstrap.js';

let bootstrapped = false;

function buildPanel() {
  const panel = createTag('aside', { id: 'chat-panel', 'aria-label': 'Chat' });

  const header = createTag('div', { class: 'chat-panel-header' });
  const title = createTag('span', { class: 'chat-panel-title' }, 'Ask Adobe');
  const closeBtn = createTag('button', { class: 'chat-panel-close', 'aria-label': 'Close chat' }, '✕');
  header.append(title, closeBtn);

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

export default async function init() {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot || '/libs';
  await new Promise((resolve) => {
    loadStyle(`${base}/features/chat-panel/chat-panel.css`, resolve);
  });

  const { panel, closeBtn } = buildPanel();
  const toggle = buildToggle();
  document.body.append(panel, toggle);

  const open = () => {
    document.body.classList.add('chat-panel-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (!bootstrapped) {
      bootstrapped = true;
      bcBootstrap(null, mountId);
    }
  };

  const close = () => {
    document.body.classList.remove('chat-panel-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('chat-panel-open')) close();
  });

  open();
}
