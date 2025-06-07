import getCookieValue from './cookie/getCookieValue.js';
import isFunction from './lang/isFunction.js';
import isGPCEnabled from './helpers/isGPCEnabled.js';
import isObject from './lang/isObject.js';
import isProduction from './helpers/isProduction.js';
import uuid from './helpers/uuid.js';
import getPropertySafely from './lang/getPropertySafely.js';
import Debug from './Debug.js';
import isEmptyObject from './lang/isEmptyObject.js';
import getUserLocation from './helpers/getUserLocation.js';
import config from './config.js';

const debug = new Debug({ control: 'privacy' });

const track = (eventType, type) => {
  let dataWasSent = false;

  if (typeof eventType !== 'string' || eventType === '') {
    return;
  }

  // Build the URL
  const configId = `11dd9af9-1455-4159-bb5e-0b1fdf039f76:${isProduction() ? 'prod' : 'dev'}`;
  const trackURL = `https://sstats.adobe.com/ee/v1/interact?configId=${configId}&requestId=${uuid()}`;

  // Build page info
  const pageURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  let geoLocationData = {};

  // OneTrust might not be loaded when analytics needs to be sent
  if (isFunction(getPropertySafely(window, 'OneTrust.getGeolocationData'))) {
    geoLocationData = window.OneTrust.getGeolocationData();
  }
  const domainID = getPropertySafely(window, 'fedsConfig.privacy.otDomainId');

  // Build the event
  const event = {
    xdm: {
      web: {
        webPageDetails: {
          name: pageURL,
          URL: pageURL,
        },
        webInteraction: {
          type: 'other',
          // can be one of 1) choice, 2) showBanner, 3) closeModal
          name: eventType,
        },
      },
      _adobe_corpnew: {
        consentTracking: {
          activeGroups: window.adobePrivacy.activeCookieGroups().toString(),
          activeGroupsArray: window.adobePrivacy.activeCookieGroups(),
          domainID,
          continent: geoLocationData.continent || '',
          country: geoLocationData.country || '',
          state: geoLocationData.state || '',
          stateName: geoLocationData.stateName || '',
          city: geoLocationData.city || '',
          zipcode: geoLocationData.zipcode || '',
          timezone: geoLocationData.timezone || '',
        },
      },
    },
  };

  try {
    event.xdm.timestamp = new Date().toISOString();
  } catch (e) {
    // Do nothing
  }

  // Update type only when defined
  if (typeof type !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    event.xdm._adobe_corpnew.consentTracking.type = type;
  }

  const sendData = (ecid) => {
    // Make sure we don't send the same data multiple times
    if (dataWasSent) {
      return;
    }

    // Populate ECID if available
    if (ecid) {
      event.xdm.identityMap = {
        ECID: [
          { id: ecid },
        ],
      };
    }

    const xhr = new window.XMLHttpRequest();
    xhr.open('POST', trackURL, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.withCredentials = false;
    xhr.send(JSON.stringify({ events: [event] }));
    dataWasSent = true;
    debug.log('analytics data', event);
  };

  // If Launch is available, try to use the visitor object
  if (isFunction(getPropertySafely(window, '_satellite.getVisitorId'))) {
    // eslint-disable-next-line no-underscore-dangle
    const visitor = window._satellite.getVisitorId();
    if (isObject(visitor) && isFunction(visitor.getMarketingCloudVisitorID)) {
      // Pass "send" as a callback - if the method does not return a value,
      // the callback will be called. If the method returns a value, we manually call "send".
      const ecidValue = visitor.getMarketingCloudVisitorID(sendData);
      if (ecidValue) {
        sendData(ecidValue);
      }
    } else {
      // Launch is not fully available
      sendData();
    }
    // If Launch is not available, try to use the cookie info
  } else {
    let amcvCookie = getCookieValue('AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg');
    if (typeof amcvCookie === 'string' && amcvCookie.length) {
      amcvCookie = amcvCookie.split('MCMID|');
      // eslint-disable-next-line prefer-destructuring
      amcvCookie = amcvCookie[1];
      if (typeof amcvCookie === 'string' && amcvCookie.length) {
        amcvCookie = amcvCookie.split('|');
        // eslint-disable-next-line prefer-destructuring
        amcvCookie = amcvCookie[0];
        sendData(amcvCookie);
      } else {
        // Cookie is empty or does not include ECID
        sendData();
      }
    } else {
      // Cookie not found or empty. Call send without ECID
      sendData();
    }
  }
};

const trackEvent = (eventData = {}) => {
  let dataWasSent = false;

  if (isEmptyObject(eventData) || !(eventData.eventName)) {
    return;
  }
  // Build the URL
  const configId = isProduction() ? '8d7bac14-04dd-47cb-9710-7d4b1358467a' : '20b030dd-b713-45da-8ff7-0a7027d2da29';
  const trackURL = `https://sstats.adobe.com/ee/v1/interact?configId=${configId}&requestId=${uuid()}`;

  // Build page info
  const pageURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  const domainID = getPropertySafely(window, 'fedsConfig.privacy.otDomainId');
  let geoLocationData = {};
  // OneTrust might not be loaded when analytics needs to be sent
  if (isFunction(getPropertySafely(window, 'OneTrust.getGeolocationData'))) {
    geoLocationData = window.OneTrust.getGeolocationData();
  } else {
    // Try with FEDS data if possible
    geoLocationData = getUserLocation();
  }

  // Format eVar64
  let language = window.navigator.language || window.navigator.userLanguage;
  if (eventData.usePageLanguage) {
    language = document.documentElement.lang;
  }

  // Format eVar62
  let interaction = eventData.source;
  if (interaction && eventData.element) {
    interaction += `|${eventData.element}`;
  }

  // Format eVar60
  let bannerDesign;
  const bannerVisible = document.querySelector(config.selectors.banner);
  if (bannerVisible) {
    bannerDesign = 'Cookie banner';
  }

  const bannerOptions = document.querySelectorAll(`${config.selectors.buttonGroup} button`);
  if (bannerOptions && bannerOptions.length === 3) {
    bannerDesign = 'Cookie banner with opt-out button';
  }

  // Build the event
  const event = {
    data: {
      eventType: 'web.webInteraction.linkClicks',
      timestamp: (new Date()).toISOString(),
      web: {
        webPageDetails: {
          name: pageURL,
          URL: pageURL,
        },
        webInteraction: {
          type: 'other',
          name: eventData.eventName,
          linkClicks: { value: 1 },
        },
      },
      _adobe_corpnew: {
        consentTracking: {
          activeGroups: window.adobePrivacy.activeCookieGroups().toString(),
          activeGroupsArray: window.adobePrivacy.activeCookieGroups(),
          group: eventData.userGroup || 'unspecified',
          bannerDesign,
          city: geoLocationData.city,
          continent: geoLocationData.continent,
          country: geoLocationData.country,
          customMode: eventData.customMode, // eVar 67
          domainID,
          gpc: isGPCEnabled(), // eVar 66
          holdBanner: !!getPropertySafely(window, 'fedsConfig.privacy.holdBanner'),
          interaction,
          language,
          modalLaunchMethod: eventData.modalLaunchMethod,
          state: geoLocationData.state,
          stateName: geoLocationData.stateName,
          timezone: geoLocationData.timezone,
          type: eventData.choiceType,
          zipcode: geoLocationData.zipcode,
        },
      },
    },
  };

  const sendData = (ecid) => {
    // Make sure we don't send the same data multiple times
    if (dataWasSent) {
      return;
    }

    // Populate ECID if available
    if (ecid) {
      event.data.identityMap = {
        ECID: [
          { id: ecid },
        ],
      };
    }

    const xhr = new window.XMLHttpRequest();
    xhr.open('POST', trackURL, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.withCredentials = false;
    xhr.send(JSON.stringify({ events: [event] }));
    dataWasSent = true;
    debug.log('analytics data', event);
  };

  // If Launch is available, try to use the visitor object
  if (isFunction(getPropertySafely(window, '_satellite.getVisitorId'))) {
    // eslint-disable-next-line no-underscore-dangle
    const visitor = window._satellite.getVisitorId();
    if (isObject(visitor) && isFunction(visitor.getMarketingCloudVisitorID)) {
      // Pass "send" as a callback - if the method does not return a value,
      // the callback will be called. If the method returns a value, we manually call "send".
      const ecidValue = visitor.getMarketingCloudVisitorID(sendData);
      if (ecidValue) {
        sendData(ecidValue);
      }
    } else {
      // Launch is not fully available
      sendData();
    }
    // If Launch is not available, try to use the cookie info
  } else {
    let amcvCookie = getCookieValue('AMCV_9E1005A551ED61CA0A490D45%40AdobeOrg');
    if (typeof amcvCookie === 'string' && amcvCookie.length) {
      amcvCookie = amcvCookie.split('MCMID|');
      // eslint-disable-next-line prefer-destructuring
      amcvCookie = amcvCookie[1];
      if (typeof amcvCookie === 'string' && amcvCookie.length) {
        amcvCookie = amcvCookie.split('|');
        // eslint-disable-next-line prefer-destructuring
        amcvCookie = amcvCookie[0];
        sendData(amcvCookie);
      } else {
        // Cookie is empty or does not include ECID
        sendData();
      }
    } else {
      // Cookie not found or empty. Call send without ECID
      sendData();
    }
  }
};

/**
 * Track enable all
 */
const trackEnableAll = (data = {}) => {
  track('choice', 'enable');
  trackEvent({ eventName: 'choice', choiceType: 'enable', ...data });
};

/**
 * Track reject all
 */
const trackRejectAll = (data = {}) => {
  track('choice', 'disable');
  trackEvent({ eventName: 'choice', choiceType: 'disable', ...data });
};

/**
 * Track custom consent
 */
const trackCustomConsent = (data = {}) => {
  track('choice', 'custom');
  trackEvent({ eventName: 'choice', choiceType: 'custom', ...data });
};

/**
 * Track when Preference Center is visible
 */
const trackShowPreferenceCenter = (data = {}) => {
  trackEvent({ eventName: 'showModal', ...data });
};

/**
 * Track when Preference Center is hidden
 */
const trackHidePreferenceCenter = (data = {}) => {
  track('closeModal');
  trackEvent({ eventName: 'closeModal', ...data });
};

/**
 * Track when banner is displayed
 */
const trackShowBanner = (data = {}) => {
  track('showBanner');
  trackEvent({ eventName: 'showBanner', ...data });
};

/**
 * Track when banner is minimized
 */
const trackMinimizeBanner = (data = {}) => {
  trackEvent({ eventName: 'choice', ...data });
};

export default {
  trackCustomConsent,
  trackEnableAll,
  trackShowBanner,
  trackHidePreferenceCenter,
  trackShowPreferenceCenter,
  trackRejectAll,
  trackMinimizeBanner,
};
