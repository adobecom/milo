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

  const pageAnimatorListener = () => {
    import('../c2/tools/page-animator/page-animator.js').catch(console.error);
  };

  const sk = document.querySelector('aem-sidekick, helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', debounce(sendToCaasListener, 500));
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', debounce(() => preflightListener(), 500));

  // On-page launcher button for testing (no sidekick config required)
  const animatorBtn = createTag('button', { id: 'page-animator-launch-btn' }, 'Animator');
  Object.assign(animatorBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999999',
    padding: '8px 14px',
    background: '#0d66d0',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgb(0 0 0 / 30%)',
  });
  animatorBtn.addEventListener('click', () => {
    animatorBtn.remove();
    pageAnimatorListener();
  });
  document.body.appendChild(animatorBtn);

  // Color code publish button
  stylePublish(sk);
}
