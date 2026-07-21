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

/* eslint-disable no-underscore-dangle */
function addAlloyTracking(lobObject) {
  if (!lobObject) return;
  const spectraValues = {
    modelLineOfBusiness: 'spectraLob',
    modelScore: 'spectraScore',
  };

  // Define helper functions for alloy_all if not already available
  const get = (obj, path) => path.split('.').reduce((current, segment) => (current !== undefined && current !== null ? current[segment] : undefined), obj);
  const set = (obj, path, val) => {
    path.split('.').reduce((current, segment, index, segments) => {
      if (index === segments.length - 1) current[segment] = val;
      else current[segment] = current[segment] || {};
      return current[segment];
    }, obj);
    return obj;
  };

  window.alloy_all = window.alloy_all || {};
  window.alloy_all.get = window.alloy_all.get || get;
  window.alloy_all.set = window.alloy_all.set || set;
  const alloyAll = window.alloy_all;
  alloyAll.data = alloyAll.data || {};
  alloyAll.data._adobe_corpnew = alloyAll.data._adobe_corpnew || {};
  alloyAll.data._adobe_corpnew.event = alloyAll.data._adobe_corpnew.event || {};
  alloyAll.data._adobe_corpnew.event.custom = alloyAll.data._adobe_corpnew.event.custom || [];
  const customEvents = alloyAll.data._adobe_corpnew.event.custom;
  Object.entries(lobObject).forEach(([key, value]) => {
    if (!spectraValues[key]) return;
    customEvents.push({ propertyName: spectraValues[key], propertyValue: value });
  });
  if (window.location.href.includes('lobdebug')) console.log('LOB raw:', customEvents, 'n', 'LOB window:', window.alloy_all.data._adobe_corpnew.event.custom);
}

/* eslint-enable no-underscore-dangle */
export default async function init(enablement) {
  if (enablement !== true) return enablement;
  if (window.location.hostname.includes('.aem.')) return 'cc';
  const lobValue = await getSpectraLOB(document.referrer);
  if (!lobValue || !lobValue.modelLineOfBusiness) return false;
  addAlloyTracking(lobValue);
  return lobValue.modelLineOfBusiness;
}
