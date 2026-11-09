import { getConfig, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';
import { initJarvisChat } from '../jarvis-chat.js';

export default function initJarvisPanel(mountIdentifier, onWindowState) {
  const config = getConfig();
  const jarvis = {
    ...config.jarvis,
    id: getMetadata('jarvis-surface-id') || config.jarvis?.id,
    version: getMetadata('jarvis-surface-version') || config.jarvis?.version,
  };

  return new Promise((resolve, reject) => {
    let finished = false;
    let timer;
    const fail = (error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(error instanceof Error ? error : new Error(`Jarvis initialization failed: ${error}`));
    };
    timer = setTimeout(() => fail(new Error('Jarvis panel initialization timed out')), 30000);
    if (window.AdobeMessagingExperienceClient) {
      fail(new Error('Jarvis is already loaded; the embedded panel must initialize it first'));
      return;
    }
    if (!jarvis.version || !jarvis.id) {
      fail(new Error('Jarvis panel requires a surface ID and version'));
      return;
    }
    const loadPanelStyle = (href) => new Promise((loaded, failed) => {
      loadStyle(href, (status) => {
        if (status === 'error') failed(new Error('Jarvis panel stylesheet could not be loaded'));
        else loaded();
      });
    });
    initJarvisChat({ ...config, jarvis }, loadScript, loadPanelStyle, getMetadata, {
      mountSelector: `#${mountIdentifier}`,
      initCallback: (data) => {
        if (!data?.releaseControl?.showAdobeMessaging) {
          fail(new Error('Jarvis is disabled for this surface'));
        }
      },
      initErrorCallback: fail,
      onReadyCallback: () => {
        if (finished) return;
        const client = window.AdobeMessagingExperienceClient;
        finished = true;
        clearTimeout(timer);
        window.addEventListener('feds:signOut', () => client.handleSignOut());
        window.addEventListener('signIn:decorateNav', () => {
          const token = window.adobeIMS?.getAccessToken()?.token;
          if (token) client.updateAccessToken(`Bearer ${token}`);
        });
        resolve(client);
      },
      windowStateCallback: onWindowState,
    }).then((result) => {
      if (result?.status === 'error' || result?.status === 'blocked') {
        fail(new Error(`Jarvis initialization failed: ${result.type}`));
      }
    }).catch(fail);
  });
}
