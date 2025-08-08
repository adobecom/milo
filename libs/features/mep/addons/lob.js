import { getConfig } from '../../../utils/utils.js';

function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map((x) => decodeURIComponent(x.trim()).split(/=(.*)/s))
    .find(([k]) => k === key);
  return cookie ? cookie[1] : null;
}

export async function getSpectraLOB(lastVisitedPage) {
  const getECID = getCookie('AMCV_9E1005A551ED61CA0A490D45@AdobeOrg');
  if (!getECID) return false;
  const [, ECID] = getECID.split('|');
  const domainSuffix = getConfig()?.env?.name === 'prod' ? '' : '-stage';
  let url = `https://cchome${domainSuffix}.adobe.io/int/v1/aep/events/webpage?ecid=${ECID}`;
  if (lastVisitedPage) url = `${url}&lastVisitedPage=${lastVisitedPage}`;

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
    return content.modelLineOfBusiness?.toLowerCase();
    /* c8 ignore next 3 */
  } catch (e) {
    return false;
  }
}

export default async function init(enablement) {
  if (enablement !== true) return enablement;
  const consentCookieValue = getCookie('OptanonConsent');
  if (consentCookieValue?.includes('C0002:0')) return 'cc';
  const lobValue = await getSpectraLOB(document.referrer);
  return lobValue;
}
