import '../../tools/loc/lib/msal-browser.js';
import loginToSharePoint from '../tools/sharepoint/login.js';
import { getReqOptions } from '../tools/sharepoint/msal.js';

// loadScript and loadStyle are passed in to avoid circular dependencies
export default function init({ createTag, loadBlock, loadScript, loadStyle }) {
  // manifest v3
  const sendToCaasListener = async (e) => {
    const { host, project, ref: branch, repo, owner } = e.detail.data.config;
    const caaSUrl = 'https://milo.adobe.com/tools/send-to-caas/send-to-caas.js';
    const { sendToCaaS } = await import(caaSUrl);
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

  const addVersion = async () => {
    const sk = document.querySelector('helix-sidekick');
    const statusJson = JSON.parse(sk.getAttribute('status'));
    const sourceUrl = statusJson?.edit?.url;
    const sourceCode = sourceUrl?.match(/sourcedoc=([^&]+)/)[1];
    const sourceId = decodeURIComponent(sourceCode);
    const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileById('${sourceId}')`;

    const options = getReqOptions({
      method: 'POST',
      accept: 'application/json; odata=nometadata',
      contentType: 'application/json;odata=verbose',
    });
    await fetch(`${url}/Publish('Last Published version')`, { ...options, keepalive: true });
  };

  // Support for legacy manifest v2 - Delete once everyone is migrated to v3
  document.addEventListener('send-to-caas', async (e) => {
    const { host, project, branch, repo, owner } = e.detail;
    const { sendToCaaS } = await import('../../tools/send-to-caas/send-to-caas.js');
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  });

  // fetch sharepoint access token
  loginToSharePoint(['https://adobe.sharepoint.com/.default']);

  const sk = document.querySelector('helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', sendToCaasListener);
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', preflightListener);
  sk.addEventListener('published', addVersion);
}
