/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { createTag, loadScript, getConfig, loadIms } from '../../../utils/utils.js';

let isStage;

const variant = 'edu-express';
const usp = new URLSearchParams(window.location.search);

const onRedirect = (e) => {
  // eslint-disable-next-line no-console
  console.log('redirecting to:', e.detail);
  setTimeout(() => {
    window.location.assign(e.detail);
    // temporary solution: allows analytics to go thru
  }, 100);
};
const onError = (e) => {
  window.lana?.log('on error:', e);
};

export function loadWrapper() {
  const CDN_URL = `https://auth-light.identity${isStage ? '-stage' : ''}.adobe.com/sentry/wrapper.js`;
  return loadScript(CDN_URL);
}

function getDestURL(url) {
  let destURL;
  try {
    destURL = new URL(url);
  } catch (err) {
    window.lana?.log(`invalid redirect uri for susi-light: ${url}`);
    destURL = new URL('https://new.express.adobe.com');
  }
  if (isStage && ['new.express.adobe.com', 'express.adobe.com'].includes(destURL.hostname)) {
    destURL.hostname = 'stage.projectx.corp.adobe.com';
  }
  return destURL.toString();
}

export default async function init(el) {
  // ({ createTag, loadScript, getConfig, loadIms } = await import(`${getLibs()}/utils/utils.js`));
  isStage = (usp.get('env') && usp.get('env') !== 'prod') || getConfig().env.name !== 'prod';
  const rows = el.querySelectorAll(':scope> div > div');
  const redirectUrl = rows[0]?.textContent?.trim().toLowerCase();
  // eslint-disable-next-line camelcase
  const client_id = rows[1]?.textContent?.trim() || 'AdobeExpressWeb';
  const title = rows[2]?.textContent?.trim();
  const authParams = {
    dt: false,
    locale: getConfig().locale.ietf.toLowerCase(),
    response_type: 'code',
    client_id,
    scope: 'AdobeID,openid',
  };
  function sendEventToAnalytics(type, eventName) {
    const sendEvent = () => {
      window._satellite.track('event', {
        xdm: {},
        data: {
          eventType: 'web.webinteraction.linkClicks',
          web: {
            webInteraction: {
              name: eventName,
              linkClicks: { value: 1 },
              type,
            },
          },
          /* eslint-disable object-curly-newline */
          _adobe_corpnew: {
            digitalData: {
              primaryEvent: {
                eventInfo: {
                  eventName,
                  client_id,
                },
              },
            },
          },
          /* eslint-enable object-curly-newline */
        },
      });
    };
    if (window._satellite?.track) {
      sendEvent();
    } else {
      window.addEventListener('alloy_sendEvent', () => {
        sendEvent();
      }, { once: true });
    }
  }
  const destURL = getDestURL(redirectUrl);
  const goDest = () => {
    sendEventToAnalytics('redirect', 'logged-in-auto-redirect');
    window.location.assign(destURL);
  };
  if (window.adobeIMS) {
    window.adobeIMS.isSignedInUser() && goDest();
  } else {
    loadIms()
      .then(() => {
        /* c8 ignore next */
        window.adobeIMS?.isSignedInUser() && goDest();
      })
      .catch((e) => { window.lana?.log(`Unable to load IMS in susi-light: ${e}`); });
  }
  el.innerHTML = '';
  await loadWrapper();
  const config = { consentProfile: 'free' };
  if (title) { config.title = title; }
  const susi = createTag('susi-sentry-light');
  susi.authParams = authParams;
  susi.authParams.redirect_uri = destURL;
  susi.config = config;
  if (isStage) susi.stage = 'true';
  susi.variant = variant;

  const onAnalytics = (e) => {
    const { type, event } = e.detail;
    sendEventToAnalytics(type, event);
  };
  susi.addEventListener('redirect', onRedirect);
  susi.addEventListener('on-error', onError);
  susi.addEventListener('on-analytics', onAnalytics);
  el.append(susi);
}
