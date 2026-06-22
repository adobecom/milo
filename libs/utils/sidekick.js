import stylePublish from './sidekick-decorate.js';
import { debounce } from './action.js';

// loadScript and loadStyle are passed in to avoid circular dependencies
export default function init({ createTag, loadBlock, loadScript, loadStyle }) {
  const sendToCaasListener = async (e) => {
    // handle v2 and v3 sidekick events
    const config = e.detail.data?.config ?? e.detail.config;
    const { host, project, ref: branch, repo, owner } = config;
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

  const annotationsListener = async () => {
    if (document.getElementById('pc-root')) return;
    const scriptUrl = 'https://milo-core-prod.adobe.io/page-commenter.js';
    await loadScript(scriptUrl);
  };

  const sk = document.querySelector('aem-sidekick, helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', debounce(sendToCaasListener, 500));
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', debounce(() => preflightListener(), 500));
  sk.addEventListener('custom:annotations', annotationsListener);

  // Auto-open annotations panel when ?pcThread= is in the URL (e.g. from a
  // Slack deep-link to a specific thread).
  if (new URLSearchParams(window.location.search).get('pcThread')) annotationsListener();

  // Color code publish button
  stylePublish(sk);
}
