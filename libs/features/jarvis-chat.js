import {
  loadScript,
  loadStyle,
} from '../utils/utils.js';

const initJarvisChat = async (config) => {
  // TODO: set as config
  loadStyle('https://client.messaging.adobe.com/latest/AdobeMessagingClient.css');
  await loadScript('https://client.messaging.adobe.com/latest/AdobeMessagingClient.js');

  let language, region;
  if (config.locale.ietf.includes('-')) {
    [ language, region ] = config.locale.ietf.split('-');
  } else {
    [ region, language ] = config.locale.prefix.replace('/', '').split('_');
  }
  
  window.AdobeMessagingExperienceClient.initialize({
    appid: config.jarvis.id,
    appver: config.jarvis.version,
    env: config.env.name !== 'prod' ? 'stage' : 'prod',
    clientId: window.adobeid?.client_id,
    accessToken: window.adobeIMS?.isSignedInUser() ?
      `Bearer ${window.adobeIMS.getAccessToken()?.token}` : undefined,
    lazyLoad: true,
    loadedVia: 'milo',
    language,
    region,
    cookiesEnabled: window.adobePrivacy?.activeCookieGroups()?.length > 1,
    cookies: {
      mcid: 'mcid',
    },
    callbacks: {
      signInProvider: window.adobeIMS?.signIn,
    }
  });
};

export default initJarvisChat;
