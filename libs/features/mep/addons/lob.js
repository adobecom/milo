import { getConfig } from '../../../utils/utils.js';
import { getCookie, AMCV_COOKIE } from '../../../martech/helpers.js';

export async function getSpectraLOB(lastVisitedPage) {
  const getECID = getCookie(AMCV_COOKIE);
  if (!getECID) return false;
  const [, ECID] = getECID.split('|');
  const domainPrefix = getConfig()?.env?.name === 'prod' ? '' : 'stage.';
  let url = `https://www.${domainPrefix}adobe.com/int/v1/aep/events/webpage?ecid=${ECID}`;
  if (lastVisitedPage) url = `${url}&lastVisitedPage=${encodeURIComponent(lastVisitedPage)}`;

  try {
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'MarketingTech',
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const content = await rawResponse.json();
    content.modelLineOfBusiness = content.modelLineOfBusiness?.toLowerCase();
    return content;
    /* c8 ignore next 3 */
  } catch (e) {
    return false;
  }
}

function resolvePendingPromise(promise, resolve) {
  const promiseTimeout = setTimeout(() => resolve(undefined), 5000);
  promise.then((result) => {
    clearTimeout(promiseTimeout);
    resolve(result);
  });
}

function awaitWindowProperty(property, timeout = 5000, interval = 100) {
  const alloyObj = window[property];
  if (window.location.href.includes('lobdebug')) {
    console.log('FROM AWAIT WINDOW PROPERTY');
    console.log(`alloyObj: ${alloyObj}`);
    console.log(`alloyObj.then (promise?): ${alloyObj?.then}`);
    console.log(`alloyObj.get: ${alloyObj?.get}`);
    console.log(`alloyObj.set: ${alloyObj?.set}`);
    console.log('tester claude');
  }
  if (alloyObj && !alloyObj.then && typeof alloyObj.get === 'function' && typeof alloyObj.set === 'function') return Promise.resolve(window[property]);
  return new Promise((resolve) => {
    let timeoutRef;
    const intervalRef = setInterval(() => {
      const val = window[property];
      if (window.location.href.includes('lobdebug')) {
        console.log('FROM INTERVAL');
        console.log(`alloyObj: ${val}`);
        console.log(`alloyObj.then (promise?): ${val}.${val?.then}`);
        console.log(`alloyObj.get: ${val}.${val?.get}`);
        console.log(`alloyObj.set: ${val}.${val?.set}`);
      }
      if (!val) return;
      if (!val.then && (typeof val.get !== 'function' || typeof val.set !== 'function')) return;
      clearTimeout(timeoutRef);
      clearInterval(intervalRef);
      if (val.then) resolvePendingPromise(val, resolve);
      else resolve(val);
    }, interval);

    timeoutRef = setTimeout(() => {
      clearInterval(intervalRef);
      if (window[property]?.then) resolvePendingPromise(window[property], resolve);
      else resolve(window[property]);
    }, timeout);
  });
}

function addAlloyTracking(lobObject) {
  awaitWindowProperty('alloy_all').then((alloyAll) => {
    if (window.location.href.includes('lobdebug')) {
      console.log(`alloyAll: ${alloyAll} FOUND`);
      const alloyObj = window['alloy_all']; // part of debug, remove when done
      console.log('FROM addAlloyTracking FUNCTION');
      console.log(`alloyObj: ${alloyObj}`);
      console.log(`alloyObj.then (promise?): ${alloyObj?.then}`);
      console.log(`alloyObj.get: ${alloyObj?.get}`);
      console.log(`alloyObj.set: ${alloyObj?.set}`);
    }
    if (!alloyAll || !lobObject) return;
    const spectraValues = {
      modelLineOfBusiness: 'spectraLob',
      modelScore: 'spectraScore',
      experienceSelected: 'spectraExperience',
    };
    const dataObjString = 'data._adobe_corpnew.event.custom';
    const existingCustomData = window.alloy_all?.get(window.alloy_all, dataObjString) || [];
    window.alloy_all?.set(window.alloy_all, dataObjString, existingCustomData);
    Object.entries(lobObject).forEach(([key, value]) => {
      if (!spectraValues[key]) return;
      // eslint-disable-next-line no-underscore-dangle
      window.alloy_all?.data?._adobe_corpnew?.event?.custom
        ?.push({ propertyName: spectraValues[key], propertyValue: value });
    });
  });
}

export default async function init(enablement) {
  if (enablement !== true) return enablement;
  if (window.location.hostname.includes('.aem.')) return 'cc';
  const lobValue = await getSpectraLOB(document.referrer);
  if (!lobValue || !lobValue.modelLineOfBusiness) return false;
  addAlloyTracking(lobValue);
  return lobValue.modelLineOfBusiness;
}
