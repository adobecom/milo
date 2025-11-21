/* eslint-disable import/no-unresolved */
import { saveDaVersion } from 'https://da.live/blocks/edit/utils/helpers.js';
import { setImsDetails } from 'https://da.live/nx/utils/daFetch.js';
import { getImsToken } from '../../tools/utils/utils.js';
import stylePublish from './sidekick-decorate.js';
import { debounce } from './action.js';

// loadScript and loadStyle are passed in to avoid circular dependencies
export default function init({ createTag, loadBlock, loadScript, loadStyle }) {
  const publishListener = async ({ detail: path }) => {
    const token = await getImsToken(loadScript);
    if (token) setImsDetails(token);
    if (path) await saveDaVersion(path);
  };

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

  const sk = document.querySelector('aem-sidekick, helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', debounce(sendToCaasListener, 500));
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', debounce(() => preflightListener(), 500));
  sk.addEventListener('published', publishListener);

  // Color code publish button
  stylePublish(sk);
}
