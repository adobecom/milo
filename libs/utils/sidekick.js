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

  // Forge — AI design-edit overlay (Brad Johnson) + page-commenter (Jingle Huang).
  // Sources resolve via window.forgeSources so demos can repoint at a tunnel /
  // staging host without redeploying milo.
  const forgeAdjustmentsListener = () => {
    if (document.querySelector('[data-replay="host"]')) return;
    const src = window.forgeSources?.adjustments || 'http://localhost:3001/overlay.js';
    loadScript(src);
  };

  const forgeAnnotationsListener = () => {
    if (document.getElementById('page-commenter-root')) return;
    const src = window.forgeSources?.annotations || 'https://page-commenter.jingleh12345.workers.dev/page-commenter.js';
    loadScript(src);
  };

  // Publish aggregates pending state from sibling Forge tools (data-forge-raw
  // stashes from Adjustments, pa:* localStorage from Animator) and shows a
  // review panel. The script toggles its own panel on repeat clicks.
  const forgePublishListener = () => {
    const src = window.forgeSources?.publish || 'http://localhost:3001/forge-publish.js';
    loadScript(src);
  };

  const sk = document.querySelector('aem-sidekick, helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', debounce(sendToCaasListener, 500));
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', debounce(() => preflightListener(), 500));
  sk.addEventListener('custom:forge-adjustments', forgeAdjustmentsListener);
  sk.addEventListener('custom:forge-annotations', forgeAnnotationsListener);
  sk.addEventListener('custom:forge-publish', forgePublishListener);

  // Color code publish button
  stylePublish(sk);
}
