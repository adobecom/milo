function stylePublish(sk) {
  const pubPlg = sk.shadowRoot.querySelector('.publish.plugin');
  if (!pubPlg) return;
  const style = document.createElement('style');
  const span = document.createElement('span');
  span.textContent = 'Are you sure? This will publish to production.';
  const btn = pubPlg.querySelector('button');
  const publishStyles = `
    .plugin.update {
      --bg-color: rgb(129 27 14);
      --text-color: #fff0f0;

      color-scheme: light dark;
      display: flex;
      order: 100;
    }
    .publish.plugin > button {
      background: var(--bg-color);
      border-color: #b46157;
      color: var(--text-color);
    }
    .publish.plugin > button > span {
      display: none;
      background: var(--bg-color);
      border-radius: 4px;
      line-height: 1.2rem;
      padding: 8px 12px;
      position: absolute;
      top: 34px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      white-space: pre-wrap;
    }
    .publish.plugin > button:hover > span {
      display: block;
      color: var(--text-color);
    }
    .publish.plugin > button > span:before {
      content: '';
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--bg-color);
      position: absolute;
      text-align: center;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  `;
  style.append(publishStyles);
  pubPlg.prepend(style);
  btn.append(span);
}

// loadScript and loadStyle are passed in to avoid circular dependencies
export default function init({ createTag, loadBlock, loadScript, loadStyle }) {
  // manifest v3
  const sendToCaasListener = async (e) => {
    const { host, project, ref: branch, repo, owner } = e.detail.data.config;
    // eslint-disable-next-line import/no-unresolved
    const { sendToCaaS } = await import('https://milo.adobe.com/tools/send-to-caas/send-to-caas.js');
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  };

  const checkSchemaListener = async () => {
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema === null) return;
    const resultsUrl = 'https://search.google.com/test/rich-results?url=';
    window.open(`${resultsUrl}${encodeURIComponent(window.location.href)}`, 'check-schema');
  };

  const preflightListener = async () => {
    const preflight = createTag('div', { class: 'preflight' });
    const content = await loadBlock(preflight);

    const { getModal } = await import('../blocks/modal/modal.js');
    getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
  };

  // Support for legacy manifest v2 - Delete once everyone is migrated to v3
  document.addEventListener('send-to-caas', async (e) => {
    const { host, project, branch, repo, owner } = e.detail;
    const { sendToCaaS } = await import('../../tools/send-to-caas/send-to-caas.js');
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  });

  const sk = document.querySelector('helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', sendToCaasListener);
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', preflightListener);

  // Color code publish button
  stylePublish(sk);
}
