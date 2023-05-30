import { getConfig } from '../../tools/loc/config.js';
import '../../tools/loc/lib/msal-browser.js';
// loadScript and loadStyle are passed in to avoid circular dependencies
export default function init({ createTag, loadBlock, loadScript, loadStyle }) {
  let accessToken = '';
  // manifest v3
  const sendToCaasListener = async (e) => {
    const { host, project, ref: branch, repo, owner } = e.detail.data.config;
    const { sendToCaaS } = await import('https://milo.adobe.com/tools/send-to-caas/send-to-caas.js');
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  };

  const checkSchemaListener = async (e) => {
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

  const fetchAccessToken = async () => {
    const { sprest } = await getConfig();
      const msalClient = new msal.PublicClientApplication(sprest);
      const loginRequest = {
        scopes: ["https://adobe.sharepoint.com/.default"] // SharePoint API scope
      };
      const response = await msalClient.loginPopup(loginRequest);
      accessToken = response.accessToken;
  };

  const getAuthorizedRequestOptionSP = ({
    body = null,
    json = true,
    method = 'GET',
  } = {}) => {
    const bearer = `Bearer ${accessToken}`;
    const headers = new Headers();
    headers.append('Authorization', bearer);
    if (json) {
      headers.append('Accept', 'application/json; odata=nometadata');
      headers.append('Content-Type', 'application/json;odata=verbose');
    }
  
    const options = {
      method,
      headers,
    };
  
    if (body) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
  
    return options;
  };

  const addVersion = async (event) => {
    const url = `https://adobe.sharepoint.com/sites/adobecom/_api/web/GetFileByServerRelativeUrl('/sites/adobecom/CC/www${event.detail.data}.docx')`;
    const options = getAuthorizedRequestOptionSP({
      method: 'POST'
    });
    await fetch(`${url}/Publish('Last Published version')`, {...options, keepalive: true});
  };

  // Support for legacy manifest v2 - Delete once everyone is migrated to v3
  document.addEventListener('send-to-caas', async (e) => {
    const { host, project, branch, repo, owner } = e.detail;
    const { sendToCaaS } = await import('../../tools/send-to-caas/send-to-caas.js');
    sendToCaaS({ host, project, branch, repo, owner }, loadScript, loadStyle);
  });

  // fetch sharepoint access token
  fetchAccessToken();

  const sk = document.querySelector('helix-sidekick');

  // Add plugin listeners here
  sk.addEventListener('custom:send-to-caas', sendToCaasListener);
  sk.addEventListener('custom:check-schema', checkSchemaListener);
  sk.addEventListener('custom:preflight', preflightListener);
  sk.addEventListener('published', addVersion);
}
