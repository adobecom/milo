import stylePublish from './sidekick-decorate.js';
import { debounce } from './action.js';
import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';

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
    await getPreflightResults(window.location.href, document, true, true);
    const preflight = createTag('div', { class: 'preflight' });
    const content = await loadBlock(preflight);

    const { getModal } = await import('../blocks/modal/modal.js');
    getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
  };

  const sk = document.querySelector('aem-sidekick, helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', debounce(sendToCaasListener, 500));
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', debounce(() => preflightListener(), 500));

  // Color code publish button
  stylePublish(sk);
}
